import OpenAI from 'openai';
import { requireUser } from '../_lib/auth.js';
import { generateLocalCode } from '../_lib/codeGenerator.js';
import { sendError, sendJson, readJson, requireMethod } from '../_lib/http.js';
import { getStore } from '../_lib/store.js';

function extractOutputText(response) {
  if (response.output_text) {
    return response.output_text;
  }

  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? '')
    .join('\n')
    .trim();
}

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    const store = await getStore();
    const user = await requireUser(req, store);
    if (!user) {
      sendError(res, 401, 'Not signed in.');
      return;
    }

    const { prompt = '', language = 'javascript', library = 'React + Vite', workspace } = await readJson(req);
    if (!prompt.trim()) {
      sendError(res, 400, 'Prompt is required.');
      return;
    }

    let code;
    let provider = 'openai';

    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You generate practical starter code for a mobile IDE. Return only code. No markdown fences, no commentary.'
          },
          {
            role: 'user',
            content: `Language: ${language}\nStack: ${library}\nRequest: ${prompt}\nCurrent file: ${workspace?.fileName ?? 'unknown'}`
          }
        ]
      });
      code = extractOutputText(response);
    } else if (process.env.ALLOW_TEST_AI === 'true' || process.env.NODE_ENV !== 'production') {
      provider = 'local-test-generator';
      code = generateLocalCode({ prompt, language, library });
    } else {
      sendError(res, 503, 'OpenAI is not configured. Add OPENAI_API_KEY before enabling production AI.');
      return;
    }

    const nextWorkspace = workspace && typeof workspace === 'object'
      ? {
          ...workspace,
          code,
          lastPrompt: prompt,
          files: Array.isArray(workspace.files)
            ? workspace.files.map((file) =>
                file.id === workspace.activeFileId
                  ? {
                      ...file,
                      code,
                      language,
                      library,
                      updatedAt: new Date().toISOString()
                    }
                  : file
              )
            : workspace.files,
          chatMessages: [
            ...(workspace.chatMessages ?? []),
            { from: 'user', text: prompt },
            { from: 'ai', text: `Generated ${library} ${language} code with ${provider}.` }
          ]
        }
      : null;

    if (nextWorkspace) {
      await store.saveWorkspace(user.id, nextWorkspace);
    }
    await store.addActivity(user.id, 'ai', `${user.name} generated code with AI Mode.`);

    sendJson(res, 200, {
      ok: true,
      code,
      provider,
      workspace: nextWorkspace
    });
  } catch (error) {
    sendError(res, 500, 'AI generation failed.', error.message);
  }
}
