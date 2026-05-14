export const defaultUserSettings = {
  workspaceName: 'Pocket Studio',
  accent: 'violet',
  density: 'comfortable',
  editorSize: 'regular',
  glass: true
};

export const defaultWorkspace = {
  language: 'javascript',
  library: 'React + Vite',
  fileName: 'App.jsx',
  activeFileId: 'file-main',
  code: `export function AppPreview() {
  const features = ["AI prompts", "Code editor", "Mobile preview"];

  return (
    <main className="mobile-app">
      <section className="hero">
        <span>Code On The Go</span>
        <h1>Build software from your phone</h1>
        <p>Prompt, edit, preview, and ship apps, APIs, tools, and scripts anywhere.</p>
      </section>
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </main>
  );
}`,
  files: [],
  chatMessages: [
    {
      from: 'ai',
      text: 'Tell me what software you want to build. I can draft code for the selected language and stack, or you can switch to Code Mode and type manually.'
    }
  ],
  lastPrompt: '',
  lastRunAt: null
};

export function createInitialWorkspace() {
  const now = new Date().toISOString();
  const code = defaultWorkspace.code;

  return {
    ...defaultWorkspace,
    files: [
      {
        id: 'file-main',
        name: 'App.jsx',
        type: 'JavaScript / React + Vite',
        language: 'javascript',
        library: 'React + Vite',
        code,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'file-theme',
        name: 'theme.css',
        type: 'Design tokens',
        language: 'css',
        library: 'Design Tokens',
        code: `:root {
  --brand: #7c3aed;
  --accent: #3b82f6;
  --surface: rgba(255, 255, 255, 0.82);
}`,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'file-readme',
        name: 'README.md',
        type: 'Documentation',
        language: 'markdown',
        library: 'Documentation',
        code: '# Code On The Go Project\\n\\nGenerated from the backend workspace.',
        createdAt: now,
        updatedAt: now
      }
    ]
  };
}
