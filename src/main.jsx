import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bot,
  Bug,
  Check,
  Code2,
  CreditCard,
  Crown,
  Eye,
  FilePlus2,
  FileText,
  FolderKanban,
  GitBranch,
  Home,
  Layers3,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  PanelBottom,
  Palette,
  Play,
  Rocket,
  Save,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Search,
  TerminalSquare,
  UsersRound,
  UserRound,
  WandSparkles,
  X
} from 'lucide-react';
import './styles.css';

registerSW({ immediate: true });

const screens = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'preview', label: 'Preview', icon: Smartphone },
  { id: 'files', label: 'Files', icon: FolderKanban }
];

const quickActions = [
  { title: 'New Project', meta: 'Prompt to software', icon: WandSparkles },
  { title: 'Open Studio', meta: 'Mobile IDE', icon: TerminalSquare },
  { title: 'Ship Preview', meta: 'Test instantly', icon: Rocket }
];

const featureMenuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ai', label: 'AI Mode', icon: Bot },
  { id: 'code', label: 'Code Mode', icon: Code2 },
  { id: 'preview', label: 'Preview Mode', icon: Smartphone },
  { id: 'files', label: 'Files', icon: FolderKanban },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'subscription', label: 'Subscription', icon: Crown }
];

const languageOptions = [
  { id: 'javascript', label: 'JavaScript', extension: 'jsx' },
  { id: 'typescript', label: 'TypeScript', extension: 'tsx' },
  { id: 'python', label: 'Python', extension: 'py' },
  { id: 'csharp', label: 'C#', extension: 'cs' },
  { id: 'cpp', label: 'C++', extension: 'cpp' },
  { id: 'java', label: 'Java', extension: 'java' },
  { id: 'go', label: 'Go', extension: 'go' },
  { id: 'php', label: 'PHP', extension: 'php' },
  { id: 'ruby', label: 'Ruby', extension: 'rb' },
  { id: 'sql', label: 'SQL', extension: 'sql' },
  { id: 'powershell', label: 'PowerShell', extension: 'ps1' },
  { id: 'vbscript', label: 'VBScript', extension: 'vbs' },
  { id: 'html', label: 'HTML', extension: 'html' },
  { id: 'css', label: 'CSS', extension: 'css' },
  { id: 'json', label: 'JSON', extension: 'json' },
  { id: 'markdown', label: 'Markdown', extension: 'md' }
];

const libraryOptions = {
  javascript: ['React + Vite', 'Vanilla JS', 'Node', 'Express', 'Vue'],
  typescript: ['React + Vite', 'TypeScript Node', 'Vue TS', 'Vanilla TS'],
  python: ['FastAPI', 'Flask', 'CLI Script', 'Data Script'],
  csharp: ['.NET Console', 'ASP.NET Core API', 'Unity Script', 'Windows Forms'],
  cpp: ['Console App', 'CMake Project', 'Game Loop', 'CLI Tool'],
  java: ['Spring Boot API', 'Console App', 'Android Activity'],
  go: ['HTTP Server', 'CLI Tool', 'Worker Service'],
  php: ['Laravel Route', 'Plain PHP', 'WordPress Plugin'],
  ruby: ['Rails Controller', 'Sinatra App', 'CLI Script'],
  sql: ['PostgreSQL Schema', 'MySQL Schema', 'SQLite Queries'],
  powershell: ['Admin Script', 'Automation Runbook', 'Deployment Script'],
  vbscript: ['Windows Script', 'Office Automation', 'Logon Script'],
  html: ['Vanilla HTML', 'PWA Page', 'Static Landing'],
  css: ['Plain CSS', 'CSS Modules', 'Design Tokens'],
  json: ['Config', 'Manifest', 'API Schema'],
  markdown: ['Documentation', 'Changelog', 'Specification']
};

const defaultChatMessages = [
  { from: 'ai', text: 'Tell me what software you want to build. I can draft code for the selected language and stack, or you can switch to Code Mode and type manually.' }
];

const defaultWorkspace = {
  language: 'javascript',
  library: 'React + Vite',
  fileName: 'App.jsx',
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
  chatMessages: defaultChatMessages,
  lastPrompt: '',
  lastRunAt: null
};

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    amount: 0,
    detail: 'Prototype locally',
    features: ['Basic AI prompts', 'Three projects', 'Offline preview']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    amount: 12,
    detail: 'per month',
    featured: true,
    features: ['Unlimited prompts', 'Mobile code editor', 'Priority previews']
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$24',
    amount: 24,
    detail: 'per month',
    features: ['Team files', 'Export builds', 'Advanced AI mode']
  }
];

const storageKey = 'code-on-the-go-demo-state';

const defaultUserSettings = {
  workspaceName: 'Pocket Studio',
  accent: 'violet',
  density: 'comfortable',
  editorSize: 'regular',
  glass: true
};

const accentOptions = [
  { id: 'violet', label: 'Violet' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'rose', label: 'Rose' }
];

const densityOptions = [
  { id: 'comfortable', label: 'Comfort' },
  { id: 'compact', label: 'Compact' }
];

const editorSizeOptions = [
  { id: 'regular', label: 'Regular' },
  { id: 'large', label: 'Large' }
];

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getNow() {
  return new Date().toISOString();
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function getLanguage(languageId) {
  return languageOptions.find((language) => language.id === languageId) ?? languageOptions[0];
}

function getFileName(languageId, library) {
  const extension = getLanguage(languageId).extension;
  const fileNames = {
    csharp: library === 'Unity Script' ? 'MobileBuilder.cs' : 'Program.cs',
    cpp: library === 'CMake Project' ? 'main.cpp' : 'main.cpp',
    java: library === 'Android Activity' ? 'MainActivity.java' : 'Main.java',
    go: 'main.go',
    php: library === 'WordPress Plugin' ? 'code-on-the-go.php' : 'index.php',
    ruby: library === 'Rails Controller' ? 'projects_controller.rb' : 'app.rb',
    sql: library === 'SQLite Queries' ? 'queries.sql' : 'schema.sql',
    powershell: 'build-workspace.ps1',
    vbscript: 'automation.vbs',
    json: library === 'Manifest' ? 'manifest.json' : 'project.json',
    markdown: 'README.md'
  };

  if (fileNames[languageId]) {
    return fileNames[languageId];
  }

  if (languageId === 'css') {
    return library === 'Design Tokens' ? 'tokens.css' : 'styles.css';
  }

  if (languageId === 'html') {
    return 'index.html';
  }

  if (languageId === 'python') {
    return library === 'FastAPI' ? 'main.py' : 'app.py';
  }

  return extension === 'tsx' ? 'App.tsx' : 'App.jsx';
}

function buildGeneratedCode(prompt, language, library) {
  const title = prompt.trim() || 'mobile coding workspace';
  const cleanTitle = title.replace(/["`]/g, "'");
  const pascalTitle = cleanTitle
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join('') || 'GeneratedProject';

  if (language === 'python' && library === 'FastAPI') {
    return `from fastapi import FastAPI

app = FastAPI(title="Code On The Go API")

@app.get("/")
def read_root():
    return {
        "app": "${cleanTitle}",
        "status": "ready",
        "built_from": "mobile"
    }

@app.get("/features")
def features():
    return ["AI Mode", "Code Mode", "Preview Mode", "Files"]`;
  }

  if (language === 'python' && library === 'Flask') {
    return `from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({
        "project": "${cleanTitle}",
        "message": "Built with Code On The Go"
    })

if __name__ == "__main__":
    app.run(debug=True)`;
  }

  if (language === 'python') {
    return `def build_project():
    project = "${cleanTitle}"
    steps = ["plan screens", "write code", "preview", "ship"]
    return {"project": project, "steps": steps}

if __name__ == "__main__":
    print(build_project())`;
  }

  if (language === 'csharp' && library === 'ASP.NET Core API') {
    return `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => new
{
    project = "${cleanTitle}",
    status = "ready",
    stack = "ASP.NET Core API"
});

app.MapGet("/features", () => new[] { "AI Mode", "Code Mode", "Preview Mode", "Files" });

app.Run();`;
  }

  if (language === 'csharp' && library === 'Unity Script') {
    return `using UnityEngine;

public class ${pascalTitle}Controller : MonoBehaviour
{
    [SerializeField] private string projectName = "${cleanTitle}";

    private void Start()
    {
        Debug.Log($"Building {projectName} with Code On The Go");
    }
}`;
  }

  if (language === 'csharp') {
    return `using System;
using System.Collections.Generic;

var project = "${cleanTitle}";
var tasks = new List<string> { "plan", "code", "test", "ship" };

Console.WriteLine($"Code On The Go project: {project}");
foreach (var task in tasks)
{
    Console.WriteLine($"- {task}");
}`;
  }

  if (language === 'cpp') {
    return `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::string project = "${cleanTitle}";
    std::vector<std::string> steps = {"plan", "code", "test", "ship"};

    std::cout << "Code On The Go project: " << project << "\\n";
    for (const auto& step : steps) {
        std::cout << "- " << step << "\\n";
    }

    return 0;
}`;
  }

  if (language === 'java' && library === 'Spring Boot API') {
    return `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "${cleanTitle} is ready";
    }
}`;
  }

  if (language === 'java') {
    return `public class Main {
    public static void main(String[] args) {
        String project = "${cleanTitle}";
        String[] steps = { "plan", "code", "test", "ship" };

        System.out.println("Code On The Go project: " + project);
        for (String step : steps) {
            System.out.println("- " + step);
        }
    }
}`;
  }

  if (language === 'go') {
    return `package main

import (
    "encoding/json"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{
            "project": "${cleanTitle}",
            "status": "ready",
        })
    })

    log.Println("Code On The Go server running on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}`;
  }

  if (language === 'php' && library === 'Laravel Route') {
    return `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return response()->json([
        'project' => '${cleanTitle}',
        'status' => 'ready',
    ]);
});`;
  }

  if (language === 'php') {
    return `<?php

$project = '${cleanTitle}';
$steps = ['plan', 'code', 'test', 'ship'];

header('Content-Type: application/json');
echo json_encode([
    'project' => $project,
    'steps' => $steps,
]);`;
  }

  if (language === 'ruby' && library === 'Sinatra App') {
    return `require "sinatra"
require "json"

get "/" do
  content_type :json
  { project: "${cleanTitle}", status: "ready" }.to_json
end`;
  }

  if (language === 'ruby') {
    return `project = "${cleanTitle}"
steps = ["plan", "code", "test", "ship"]

puts "Code On The Go project: #{project}"
steps.each { |step| puts "- #{step}" }`;
  }

  if (language === 'sql') {
    return `CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (name, status)
VALUES ('${cleanTitle}', 'ready');

SELECT id, name, status, created_at
FROM projects
ORDER BY created_at DESC;`;
  }

  if (language === 'powershell') {
    return `$ProjectName = "${cleanTitle}"
$Steps = @("plan", "code", "test", "ship")

Write-Host "Code On The Go project: $ProjectName"
foreach ($Step in $Steps) {
    Write-Host "- $Step"
}`;
  }

  if (language === 'vbscript') {
    return `Dim projectName
Dim steps

projectName = "${cleanTitle}"
steps = Array("plan", "code", "test", "ship")

WScript.Echo "Code On The Go project: " & projectName
For Each stepName In steps
    WScript.Echo "- " & stepName
Next`;
  }

  if (language === 'html') {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${cleanTitle}</title>
  </head>
  <body>
    <main class="app-shell">
      <section class="hero">
        <p>Built on mobile</p>
        <h1>${cleanTitle}</h1>
        <button>Launch Preview</button>
      </section>
    </main>
  </body>
</html>`;
  }

  if (language === 'css') {
    return `:root {
  --brand: #7c3aed;
  --accent: #3b82f6;
  --surface: rgba(255, 255, 255, 0.82);
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--brand), var(--accent));
}

.hero {
  max-width: 360px;
  padding: 24px;
  border-radius: 28px;
  background: var(--surface);
  box-shadow: 0 24px 70px rgba(76, 29, 149, 0.24);
}`;
  }

  if (language === 'json') {
    return `{
  "name": "${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}",
  "title": "${cleanTitle}",
  "status": "draft",
  "generatedBy": "Code On The Go",
  "features": ["ai", "code-editor", "preview", "files"]
}`;
  }

  if (language === 'markdown') {
    return `# ${cleanTitle}

Built with Code On The Go.

## Scope

- Plan the software workflow
- Generate starter code
- Edit files manually
- Preview and ship the project

## Stack

${library}`;
  }

  if (language === 'typescript') {
    return `type Feature = {
  id: number;
  title: string;
};

const features: Feature[] = [
  { id: 1, title: "AI Mode" },
  { id: 2, title: "Code Mode" },
  { id: 3, title: "Preview Mode" }
];

export function AppPreview() {
  return (
    <main className="mobile-app">
      <h1>${cleanTitle}</h1>
      {features.map((feature) => (
        <button key={feature.id}>{feature.title}</button>
      ))}
    </main>
  );
}`;
  }

  if (library === 'Express') {
    return `import express from "express";

const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  res.json({
    project: "${cleanTitle}",
    status: "ready",
    stack: "Express"
  });
});

app.listen(port, () => {
  console.log(\`Code On The Go server running on port \${port}\`);
});`;
  }

  if (library === 'Vanilla JS') {
    return `const app = document.querySelector("#app");

const project = {
  title: "${cleanTitle}",
  actions: ["Prompt", "Code", "Preview", "Ship"]
};

app.innerHTML = \`
  <section class="hero">
    <h1>\${project.title}</h1>
    <p>Built from a phone-first workspace.</p>
    <button>Start building</button>
  </section>
\`;`;
  }

  return `export function AppPreview() {
  const features = ["AI prompts", "Manual coding", "${library}"];

  return (
    <main className="mobile-app">
      <section className="hero">
        <span>Generated by AI Mode</span>
        <h1>${cleanTitle}</h1>
        <p>Edit this manually in Code Mode whenever you want.</p>
      </section>
      <div className="feature-grid">
        {features.map((feature) => (
          <button key={feature}>{feature}</button>
        ))}
      </div>
    </main>
  );
}`;
}

function getFileType(language, library) {
  return `${getLanguage(language).label} / ${library}`;
}

function getFileSize(code = '') {
  const bytes = new Blob([code]).size;
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

function createWorkspaceFile({ id, name, type, language, library, code, createdAt, updatedAt }) {
  const timestamp = createdAt ?? getNow();

  return {
    id,
    name,
    type: type ?? getFileType(language, library),
    language,
    library,
    code,
    createdAt: timestamp,
    updatedAt: updatedAt ?? timestamp
  };
}

function createDefaultWorkspaceFiles(workspace, language, library) {
  const createdAt = workspace.createdAt ?? getNow();
  const mainName = workspace.fileName ?? getFileName(language, library);
  const mainCode = typeof workspace.code === 'string' ? workspace.code : defaultWorkspace.code;

  return [
    createWorkspaceFile({
      id: 'file-main',
      name: mainName,
      type: getFileType(language, library),
      language,
      library,
      code: mainCode,
      createdAt
    }),
    createWorkspaceFile({
      id: 'file-theme',
      name: 'theme.css',
      type: 'Design tokens',
      language: 'css',
      library: 'Design Tokens',
      code: `:root {
  --brand: #7c3aed;
  --accent: #3b82f6;
  --surface: rgba(255, 255, 255, 0.82);
}

.workspace {
  color: var(--brand);
  background: var(--surface);
}`,
      createdAt
    }),
    createWorkspaceFile({
      id: 'file-readme',
      name: 'README.md',
      type: 'Documentation',
      language: 'markdown',
      library: 'Documentation',
      code: `# Code On The Go Project

Use AI Mode to generate software, Code Mode to edit files, and Preview Mode to inspect the current build.`,
      createdAt
    }),
    createWorkspaceFile({
      id: 'file-config',
      name: 'project.json',
      type: 'Project config',
      language: 'json',
      library: 'Config',
      code: `{
  "name": "code-on-the-go-project",
  "workspace": "mobile-ide",
  "status": "draft"
}`,
      createdAt
    })
  ];
}

function normalizeWorkspaceFiles(workspace, language, library) {
  const sourceFiles = Array.isArray(workspace.files) && workspace.files.length
    ? workspace.files
    : createDefaultWorkspaceFiles(workspace, language, library);

  return sourceFiles.map((file, index) => {
    const fileLanguage = libraryOptions[file.language] ? file.language : language;
    const libraries = libraryOptions[fileLanguage] ?? libraryOptions.javascript;
    const fileLibrary = libraries.includes(file.library) ? file.library : libraries[0];
    const code = typeof file.code === 'string' ? file.code : '';

    return createWorkspaceFile({
      id: file.id ?? `file-${index + 1}`,
      name: file.name ?? getFileName(fileLanguage, fileLibrary),
      type: file.type ?? getFileType(fileLanguage, fileLibrary),
      language: fileLanguage,
      library: fileLibrary,
      code,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    });
  });
}

function normalizeWorkspace(workspace = {}) {
  const language = workspace.language ?? defaultWorkspace.language;
  const libraries = libraryOptions[language] ?? libraryOptions.javascript;
  const library = libraries.includes(workspace.library) ? workspace.library : libraries[0];
  const files = normalizeWorkspaceFiles(workspace, language, library);
  const activeFile =
    files.find((file) => file.id === workspace.activeFileId) ??
    files.find((file) => file.name === workspace.fileName) ??
    files[0];

  return {
    ...defaultWorkspace,
    ...workspace,
    language: activeFile.language,
    library: activeFile.library,
    fileName: activeFile.name,
    code: activeFile.code,
    files,
    activeFileId: activeFile.id,
    chatMessages: workspace.chatMessages?.length ? workspace.chatMessages : defaultChatMessages
  };
}

function withDefaultUserSettings(user) {
  return {
    ...user,
    settings: {
      ...defaultUserSettings,
      ...(user.settings ?? {})
    }
  };
}

function getDefaultAppData() {
  const createdAt = getNow();

  return {
    currentUserId: null,
    workspace: defaultWorkspace,
    users: [
      {
        id: 'user-demo',
        name: 'Demo Builder',
        email: 'demo@codego.app',
        password: 'demo123',
        planId: 'pro',
        paymentProvider: 'Stripe',
        subscriptionStatus: 'active',
        settings: defaultUserSettings,
        createdAt,
        payments: [
          {
            id: 'pay-demo',
            planId: 'pro',
            provider: 'Stripe',
            status: 'test_paid',
            amount: 12,
            last4: '4242',
            createdAt
          }
        ]
      }
    ],
    activity: [
      {
        id: 'activity-demo',
        type: 'signup',
        message: 'Demo Builder signed up for Pro with Stripe test checkout.',
        createdAt
      }
    ]
  };
}

function loadAppData() {
  if (typeof window === 'undefined') {
    return getDefaultAppData();
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return getDefaultAppData();
    }

    const parsed = { ...getDefaultAppData(), ...JSON.parse(saved) };
    return {
      ...parsed,
      workspace: normalizeWorkspace(parsed.workspace),
      users: parsed.users.map(withDefaultUserSettings)
    };
  } catch {
    return getDefaultAppData();
  }
}

function formatActivityTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function getPlan(planId) {
  return plans.find((plan) => plan.id === planId) ?? plans[0];
}

function App() {
  const initialData = React.useMemo(() => loadAppData(), []);
  const [appData, setAppData] = React.useState(initialData);
  const [activeScreen, setActiveScreen] = React.useState('home');
  const [activeView, setActiveView] = React.useState(initialData.currentUserId ? 'app' : 'login');
  const [returnView, setReturnView] = React.useState('login');
  const [pendingSignup, setPendingSignup] = React.useState(null);
  const screenStackRef = React.useRef(null);
  const currentUser = appData.users.find((user) => user.id === appData.currentUserId) ?? null;
  const currentSettings = currentUser?.settings ?? defaultUserSettings;
  const workspace = normalizeWorkspace(appData.workspace);
  const shellModeClass = activeView === 'app' ? `screen-${activeScreen}` : `view-${activeView}`;

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(appData));
  }, [appData]);

  React.useEffect(() => {
    if (screenStackRef.current) {
      screenStackRef.current.scrollTop = 0;
    }
  }, [activeScreen, activeView]);

  const enterApp = () => {
    setActiveView('app');
    setActiveScreen('home');
  };

  const openSubscription = () => {
    setReturnView(activeView);
    setActiveView('subscription');
  };

  const openProfile = () => {
    setActiveView('profile');
  };

  const selectFeature = (featureId) => {
    if (featureId === 'profile') {
      setActiveView('profile');
      return;
    }

    if (featureId === 'subscription') {
      openSubscription();
      return;
    }

    setActiveScreen(featureId);
    setActiveView('app');
  };

  const appendActivity = (activity) => {
    const entry = {
      id: createId('activity'),
      createdAt: getNow(),
      ...activity
    };

    setAppData((current) => ({
      ...current,
      activity: [entry, ...current.activity].slice(0, 20)
    }));

    return entry;
  };

  const handleLogin = ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);
    const user = appData.users.find((candidate) => candidate.email === normalizedEmail);

    if (!normalizedEmail || !password) {
      return { ok: false, message: 'Enter your email and password.' };
    }

    if (!user || user.password !== password) {
      return { ok: false, message: 'No matching account found for those details.' };
    }

    setAppData((current) => ({ ...current, currentUserId: user.id }));
    appendActivity({ type: 'login', message: `${user.name} signed in.` });
    enterApp();
    return { ok: true };
  };

  const handleRegister = ({ name, email, password }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!name.trim() || !normalizedEmail || !password) {
      return { ok: false, message: 'Add your name, email, and password.' };
    }

    if (password.length < 6) {
      return { ok: false, message: 'Use at least 6 characters for the password.' };
    }

    if (appData.users.some((user) => user.email === normalizedEmail)) {
      return { ok: false, message: 'That email is already registered. Sign in instead.' };
    }

    setPendingSignup({
      id: createId('pending'),
      name: name.trim(),
      email: normalizedEmail,
      password
    });
    setReturnView('register');
    setActiveView('subscription');
    return { ok: true };
  };

  const handleCheckout = ({ planId, provider, payment }) => {
    const plan = getPlan(planId);
    const createdAt = getNow();
    const requiresPayment = plan.amount > 0;
    const digits = payment.cardNumber.replace(/\D/g, '');

    if (requiresPayment && provider === 'Stripe' && digits.length < 12) {
      return { ok: false, message: 'Enter a test card number for Stripe checkout.' };
    }

    if (requiresPayment && provider === 'PayPoint' && !payment.reference.trim()) {
      return { ok: false, message: 'Enter a PayPoint test reference.' };
    }

    if (!pendingSignup && !currentUser) {
      setActiveView('register');
      return { ok: false, message: 'Create an account before checkout.' };
    }

    const paymentRecord = {
      id: createId('pay'),
      planId,
      provider: requiresPayment ? provider : 'None',
      status: requiresPayment ? 'test_paid' : 'free_started',
      amount: plan.amount,
      last4: provider === 'Stripe' && digits ? digits.slice(-4) : undefined,
      reference: provider === 'PayPoint' ? payment.reference.trim() : undefined,
      createdAt
    };

    if (pendingSignup) {
      const newUser = {
        id: createId('user'),
        name: pendingSignup.name,
        email: pendingSignup.email,
        password: pendingSignup.password,
        planId,
        paymentProvider: paymentRecord.provider,
        subscriptionStatus: plan.amount > 0 ? 'active' : 'free',
        settings: defaultUserSettings,
        createdAt,
        payments: [paymentRecord]
      };

      setAppData((current) => ({
        ...current,
        currentUserId: newUser.id,
        users: [...current.users, newUser],
        activity: [
          {
            id: createId('activity'),
            type: 'signup',
            message: `${newUser.name} signed up for ${plan.name} with ${paymentRecord.provider} checkout.`,
            createdAt
          },
          ...current.activity
        ].slice(0, 20)
      }));
      setPendingSignup(null);
      enterApp();
      return { ok: true };
    }

    setAppData((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              planId,
              paymentProvider: paymentRecord.provider,
              subscriptionStatus: plan.amount > 0 ? 'active' : 'free',
              payments: [paymentRecord, ...(user.payments ?? [])]
            }
          : user
      ),
      activity: [
        {
          id: createId('activity'),
          type: 'subscription',
          message: `${currentUser.name} changed to ${plan.name} with ${paymentRecord.provider} checkout.`,
          createdAt
        },
        ...current.activity
      ].slice(0, 20)
    }));
    enterApp();
    return { ok: true };
  };

  const handleSignOut = () => {
    setAppData((current) => ({ ...current, currentUserId: null }));
    setActiveScreen('home');
    setActiveView('login');
  };

  const handleProfileSave = ({ name, workspaceName, settings }) => {
    const displayName = name.trim();
    const workspace = workspaceName.trim();

    if (!displayName) {
      return { ok: false, message: 'Add a display name.' };
    }

    if (!workspace) {
      return { ok: false, message: 'Add a workspace name.' };
    }

    setAppData((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === current.currentUserId
          ? {
              ...user,
              name: displayName,
              settings: {
                ...defaultUserSettings,
                ...settings,
                workspaceName: workspace
              }
            }
          : user
      ),
      activity: [
        {
          id: createId('activity'),
          type: 'profile',
          message: `${displayName} updated their profile settings.`,
          createdAt: getNow()
        },
        ...current.activity
      ].slice(0, 20)
    }));

    return { ok: true, message: 'Profile saved.' };
  };

  const updateWorkspace = (patch) => {
    setAppData((current) => ({
      ...current,
      workspace: normalizeWorkspace({
        ...current.workspace,
        ...patch
      })
    }));
  };

  const updateActiveFile = (patch) =>
    workspace.files.map((file) =>
      file.id === workspace.activeFileId
        ? {
            ...file,
            ...patch,
            updatedAt: getNow()
          }
        : file
    );

  const handleWorkspaceStackChange = ({ language, library }) => {
    const libraries = libraryOptions[language] ?? libraryOptions.javascript;
    const nextLibrary = library ?? libraries[0];
    const nextFileName = getFileName(language, nextLibrary);

    updateWorkspace({
      language,
      library: nextLibrary,
      fileName: nextFileName,
      files: updateActiveFile({
        name: nextFileName,
        type: getFileType(language, nextLibrary),
        language,
        library: nextLibrary
      })
    });
  };

  const handleAiPrompt = (prompt) => {
    const generatedCode = buildGeneratedCode(prompt, workspace.language, workspace.library);
    const nextFileName = getFileName(workspace.language, workspace.library);
    const aiMessage = `I generated ${workspace.library} ${getLanguage(workspace.language).label} code and placed it in Code Mode. You can keep editing it manually.`;

    setAppData((current) => ({
      ...current,
      workspace: normalizeWorkspace({
        ...current.workspace,
        code: generatedCode,
        lastPrompt: prompt,
        fileName: nextFileName,
        files: updateActiveFile({
          name: nextFileName,
          type: getFileType(workspace.language, workspace.library),
          language: workspace.language,
          library: workspace.library,
          code: generatedCode
        }),
        chatMessages: [
          ...(current.workspace?.chatMessages ?? defaultChatMessages),
          { from: 'user', text: prompt },
          { from: 'ai', text: aiMessage }
        ]
      }),
      activity: [
        {
          id: createId('activity'),
          type: 'ai',
          message: `${currentUser?.name ?? 'A user'} generated code with AI Mode.`,
          createdAt: getNow()
        },
        ...current.activity
      ].slice(0, 20)
    }));

    return { ok: true, message: aiMessage };
  };

  const handleManualCodeChange = (code) => {
    updateWorkspace({
      code,
      files: updateActiveFile({ code })
    });
  };

  const handleRunCode = () => {
    updateWorkspace({ lastRunAt: getNow() });
    appendActivity({ type: 'code', message: `${currentUser?.name ?? 'A user'} previewed ${workspace.fileName}.` });
  };

  const handleOpenFile = (fileId, openCode = true) => {
    const file = workspace.files.find((candidate) => candidate.id === fileId);
    if (!file) {
      return;
    }

    updateWorkspace({
      activeFileId: file.id,
      language: file.language,
      library: file.library,
      fileName: file.name,
      code: file.code
    });

    if (openCode) {
      setActiveScreen('code');
    }
  };

  const handleCreateFile = () => {
    const language = workspace.language;
    const library = workspace.library;
    const extension = getLanguage(language).extension;
    const fileNumber = workspace.files.length + 1;
    const newFile = createWorkspaceFile({
      id: createId('file'),
      name: `untitled-${fileNumber}.${extension}`,
      type: getFileType(language, library),
      language,
      library,
      code: language === 'markdown' ? '# New file\n' : '',
      createdAt: getNow()
    });

    updateWorkspace({
      files: [newFile, ...workspace.files],
      activeFileId: newFile.id,
      language,
      library,
      fileName: newFile.name,
      code: newFile.code
    });
    setActiveScreen('code');
    appendActivity({ type: 'file', message: `${currentUser?.name ?? 'A user'} created ${newFile.name}.` });
  };

  return (
    <main className={`app theme-${currentSettings.accent} density-${currentSettings.density} editor-${currentSettings.editorSize} ${currentSettings.glass ? 'glass-on' : 'glass-off'}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className={`phone-shell ${shellModeClass} ${!currentUser || activeView === 'subscription' ? 'auth-shell' : ''}`} aria-label="Code On The Go software workspace">
        <AppHeader
          showActions={Boolean(currentUser) && (activeView === 'app' || activeView === 'profile')}
          onOpenProfile={openProfile}
          onSelectFeature={selectFeature}
          onSignOut={handleSignOut}
          activeScreen={activeScreen}
        />
        <div className="screen-stack" ref={screenStackRef}>
          {activeView === 'login' && (
            <LoginScreen
              onLogin={handleLogin}
              onRegister={() => setActiveView('register')}
              onSubscribe={openSubscription}
            />
          )}
          {activeView === 'register' && (
            <RegisterScreen
              onLogin={() => setActiveView('login')}
              onCreate={handleRegister}
            />
          )}
          {activeView === 'subscription' && (
            <SubscriptionScreen
              onBack={() => setActiveView(returnView === 'profile' ? 'profile' : returnView)}
              onCheckout={handleCheckout}
              onRequireAccount={() => setActiveView('register')}
              currentUser={currentUser}
              pendingSignup={pendingSignup}
            />
          )}
          {activeView === 'profile' && (
            <ProfileScreen
              user={currentUser}
              plan={getPlan(currentUser?.planId)}
              onSave={handleProfileSave}
              onSubscribe={openSubscription}
              onDone={() => setActiveView('app')}
              onSignOut={handleSignOut}
            />
          )}
          {activeView === 'app' && activeScreen === 'home' && (
            <HomeScreen
              user={currentUser}
              activity={appData.activity}
              totalSignups={appData.users.length}
              onSubscribe={openSubscription}
              onSignOut={handleSignOut}
            />
          )}
          {activeView === 'app' && activeScreen === 'ai' && (
            <AiScreen
              workspace={workspace}
              onPrompt={handleAiPrompt}
              onStackChange={handleWorkspaceStackChange}
              onOpenCode={() => setActiveScreen('code')}
            />
          )}
          {activeView === 'app' && activeScreen === 'code' && (
            <CodeScreen
              workspace={workspace}
              onCodeChange={handleManualCodeChange}
              onStackChange={handleWorkspaceStackChange}
              onRunCode={handleRunCode}
              onSelectFile={(fileId) => handleOpenFile(fileId, false)}
              onCreateFile={handleCreateFile}
            />
          )}
          {activeView === 'app' && activeScreen === 'preview' && <PreviewScreen workspace={workspace} />}
          {activeView === 'app' && activeScreen === 'files' && (
            <FilesScreen
              workspace={workspace}
              onOpenFile={(fileId) => handleOpenFile(fileId, true)}
              onCreateFile={handleCreateFile}
            />
          )}
        </div>
        {activeView === 'app' && <BottomNav activeScreen={activeScreen} onChange={setActiveScreen} />}
      </section>
    </main>
  );
}

function AppHeader({ showActions, onOpenProfile, onSelectFeature, onSignOut, activeScreen }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const chooseFeature = (featureId) => {
    setMenuOpen(false);
    onSelectFeature(featureId);
  };

  return (
    <header className={`app-header ${showActions ? 'has-actions' : 'brand-only'}`}>
      {showActions && (
        <button
          className="icon-button header-menu-button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close feature menu' : 'Open feature menu'}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <Menu size={20} />
        </button>
      )}
      <div className="brand-lockup">
        <BrandLogo />
      </div>
      {showActions && (
        <button className="icon-button header-settings-button" aria-label="Open profile settings" onClick={onOpenProfile} type="button">
          <Settings size={19} />
        </button>
      )}
      {showActions && menuOpen && (
        <div className="feature-menu">
          <div className="feature-menu-title">
            <span>Features</span>
            <small>Choose a workspace view</small>
          </div>
          {featureMenuItems.map((item) => (
            <button
              className={activeScreen === item.id ? 'active' : ''}
              key={item.id}
              onClick={() => chooseFeature(item.id)}
              type="button"
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </button>
          ))}
          <button className="danger-menu-item" onClick={onSignOut} type="button">
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}

function BrandLogo() {
  return (
    <svg className="brand-logo" viewBox="0 0 340 120" role="img" aria-label="Code On The Go" xmlns="http://www.w3.org/2000/svg">
      <title>Code On The Go</title>
      <defs>
        <linearGradient id="dynamicMarkBg" x1="18" y1="18" x2="104" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--violet)" />
          <stop offset="1" stopColor="var(--blue)" />
        </linearGradient>
        <linearGradient id="dynamicMarkGlass" x1="38" y1="25" x2="86" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.7" />
          <stop offset="1" stopColor="white" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="dynamicWord" x1="125" y1="30" x2="330" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ink)" />
          <stop offset="0.55" stopColor="var(--violet-dark)" />
          <stop offset="1" stopColor="var(--blue)" />
        </linearGradient>
      </defs>
      <rect x="13" y="13" width="94" height="94" rx="31" fill="url(#dynamicMarkBg)" />
      <path d="M26 44C34 24 58 18 78 27C92 33 99 47 99 63C99 86 77 103 53 98C32 94 17 68 26 44Z" fill="white" opacity="0.16" />
      <g transform="rotate(-8 60 60)">
        <rect x="38" y="25" width="44" height="70" rx="14" fill="url(#dynamicMarkGlass)" stroke="white" strokeOpacity="0.46" strokeWidth="2" />
        <path d="M55 49L46 60L55 71" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M65 49L74 60L65 71" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M63 45L57 76" stroke="white" strokeWidth="5" strokeLinecap="round" />
      </g>
      <text x="126" y="55" fill="url(#dynamicWord)" fontFamily="Inter, Segoe UI, Arial, sans-serif" fontSize="35" fontWeight="850">Code On</text>
      <text x="128" y="84" fill="var(--violet)" fontFamily="Inter, Segoe UI, Arial, sans-serif" fontSize="22" fontWeight="850">The Go</text>
      <path d="M127 94H281" stroke="var(--violet)" strokeWidth="5" strokeLinecap="round" />
      <path d="M289 94H326" stroke="var(--blue)" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

function LoginScreen({ onLogin, onRegister, onSubscribe }) {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');

  const updateField = (event) => {
    setError('');
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitLogin = (event) => {
    event.preventDefault();
    const result = onLogin(form);
    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <section className="screen auth-screen">
      <div className="auth-intro">
        <span className="pill auth-pill">
          <ShieldCheck size={14} />
          Secure workspace
        </span>
        <h2>Welcome back</h2>
        <p>Sign in to keep building, previewing, and shipping from your phone.</p>
      </div>

      <form className="auth-card" onSubmit={submitLogin}>
        <InputField
          icon={Mail}
          label="Email"
          name="email"
          type="text"
          inputMode="email"
          autoCapitalize="none"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
        />
        <InputField
          icon={LockKeyhole}
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="Enter password"
          actionIcon={Eye}
        />
        <div className="form-options">
          <label>
            <input type="checkbox" defaultChecked />
            Remember me
          </label>
          <button type="button" onClick={() => setError('Password reset link would be sent from the backend.')}>Reset</button>
        </div>
        {error && <FormMessage message={error} />}
        <button className="primary-action" type="submit">
          Sign In
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-switcher">
        <button type="button" onClick={onRegister}>Create account</button>
        <button type="button" onClick={onSubscribe}>View plans</button>
      </div>
    </section>
  );
}

function RegisterScreen({ onLogin, onCreate }) {
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [error, setError] = React.useState('');

  const updateField = (event) => {
    setError('');
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitRegister = (event) => {
    event.preventDefault();
    const result = onCreate(form);
    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <section className="screen auth-screen">
      <div className="auth-intro">
        <span className="pill auth-pill">
          <Sparkles size={14} />
          Start coding today
        </span>
        <h2>Create your account</h2>
        <p>Set up a mobile AI coding studio that is ready for prompts, files, and previews.</p>
      </div>

      <form className="auth-card" onSubmit={submitRegister}>
        <InputField
          icon={UserRound}
          label="Name"
          name="name"
          type="text"
          value={form.name}
          onChange={updateField}
          placeholder="Your name"
        />
        <InputField
          icon={Mail}
          label="Email"
          name="email"
          type="text"
          inputMode="email"
          autoCapitalize="none"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
        />
        <InputField
          icon={LockKeyhole}
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="Create password"
          actionIcon={Eye}
        />
        <div className="mini-plan">
          <Crown size={18} />
          <div>
            <strong>Pro trial included</strong>
            <span>Seven days of AI builds, previews, and offline files.</span>
          </div>
        </div>
        {error && <FormMessage message={error} />}
        <button className="primary-action" type="submit">
          Continue
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-switcher">
        <span>Already registered?</span>
        <button type="button" onClick={onLogin}>Sign in</button>
      </div>
    </section>
  );
}

function SubscriptionScreen({ onBack, onCheckout, onRequireAccount, currentUser, pendingSignup }) {
  const [selectedPlanId, setSelectedPlanId] = React.useState(currentUser?.planId ?? 'pro');
  const [provider, setProvider] = React.useState('Stripe');
  const [payment, setPayment] = React.useState({ cardNumber: '', expiry: '', reference: '' });
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const selectedPlan = getPlan(selectedPlanId);
  const canCheckout = Boolean(currentUser || pendingSignup);
  const requiresPayment = selectedPlan.amount > 0;

  const updatePayment = (event) => {
    setError('');
    setPayment((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitCheckout = () => {
    if (!canCheckout) {
      onRequireAccount();
      return;
    }

    const result = onCheckout({ planId: selectedPlanId, provider, payment });
    if (!result.ok) {
      setError(result.message);
      setCheckoutOpen(true);
      return;
    }
  };

  const handlePrimaryAction = () => {
    if (!canCheckout) {
      onRequireAccount();
      return;
    }

    if (requiresPayment) {
      setError('');
      setCheckoutOpen(true);
      return;
    }

    submitCheckout();
  };

  return (
    <section className="screen subscription-screen">
      <div className="subscription-topbar">
        <button className="ghost-icon-button" type="button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <span>Choose Plan</span>
      </div>

      <article className="subscription-hero">
        <span className="pill auth-pill">
          <Crown size={14} />
          Premium mobile IDE
        </span>
        <h2>Unlock AI coding anywhere</h2>
        <p>Pick the workflow that matches how much you want Code On The Go to handle for you.</p>
      </article>

      <div className="plan-list">
        {plans.map((plan) => (
          <button
            className={`plan-card plan-option ${plan.featured ? 'featured' : ''} ${selectedPlanId === plan.id ? 'selected' : ''}`}
            key={plan.name}
            onClick={() => {
              setError('');
              setCheckoutOpen(false);
              setSelectedPlanId(plan.id);
            }}
            type="button"
          >
            <div className="plan-card-header">
              <div>
                <h3>{plan.name}</h3>
                <span>{plan.detail}</span>
              </div>
              <strong>{plan.price}</strong>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="selected-plan-summary">
        <div>
          <span>Selected plan</span>
          <strong>{selectedPlan.name}</strong>
        </div>
        <strong>{selectedPlan.price}</strong>
      </div>

      {error && !checkoutOpen && <FormMessage message={error} />}
      <button className="primary-action sticky-action" type="button" onClick={handlePrimaryAction}>
        {!canCheckout ? 'Create Account' : requiresPayment ? 'Continue to Checkout' : 'Start Building'}
        <ArrowRight size={18} />
      </button>

      {checkoutOpen && requiresPayment && (
        <div className="checkout-overlay">
          <button
            className="checkout-backdrop"
            type="button"
            aria-label="Close checkout"
            onClick={() => {
              setError('');
              setCheckoutOpen(false);
            }}
          />
          <div className="checkout-sheet" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <div className="checkout-handle" />
            <div className="checkout-sheet-header">
              <div className="payment-card-title">
                <CreditCard size={18} />
                <div>
                  <strong id="checkout-title">Test Checkout</strong>
                  <span>{selectedPlan.name} through {provider}</span>
                </div>
              </div>
              <button
                className="checkout-close"
                type="button"
                aria-label="Close checkout"
                onClick={() => {
                  setError('');
                  setCheckoutOpen(false);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="checkout-plan-row">
              <div>
                <span>Plan</span>
                <strong>{selectedPlan.name}</strong>
              </div>
              <strong>{selectedPlan.price}</strong>
            </div>

            <div className="provider-switch" aria-label="Payment provider">
              {['Stripe', 'PayPoint'].map((option) => (
                <button
                  className={provider === option ? 'active' : ''}
                  key={option}
                  type="button"
                  onClick={() => {
                    setError('');
                    setProvider(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {provider === 'Stripe' ? (
              <div className="payment-fields">
                <InputField
                  icon={CreditCard}
                  label="Card number"
                  name="cardNumber"
                  inputMode="numeric"
                  value={payment.cardNumber}
                  onChange={updatePayment}
                  placeholder="4242 4242 4242 4242"
                />
                <InputField
                  icon={CreditCard}
                  label="Expiry"
                  name="expiry"
                  value={payment.expiry}
                  onChange={updatePayment}
                  placeholder="12/30"
                />
              </div>
            ) : (
              <InputField
                icon={CreditCard}
                label="PayPoint reference"
                name="reference"
                value={payment.reference}
                onChange={updatePayment}
                placeholder="PP-TEST-1001"
              />
            )}

            {error && <FormMessage message={error} />}
            <button className="primary-action checkout-action" type="button" onClick={submitCheckout}>
              Start Building
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ProfileScreen({ user, plan, onSave, onSubscribe, onDone, onSignOut }) {
  const userSettings = user?.settings ?? defaultUserSettings;
  const [profile, setProfile] = React.useState({
    name: user?.name ?? '',
    workspaceName: userSettings.workspaceName,
    settings: {
      ...defaultUserSettings,
      ...userSettings
    }
  });
  const [message, setMessage] = React.useState('');

  const updateField = (event) => {
    setMessage('');
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateSetting = (key, value) => {
    setMessage('');
    setProfile((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [key]: value
      }
    }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const result = onSave(profile);
    setMessage(result.message);
  };

  return (
    <section className="screen profile-screen">
      <div className="profile-hero">
        <div className="profile-avatar">
          <UserRound size={28} />
        </div>
        <div>
          <p className="eyebrow">Profile</p>
          <h2>{user?.name}</h2>
          <span>{user?.email}</span>
        </div>
      </div>

      <form className="profile-card" onSubmit={saveProfile}>
        <InputField
          icon={UserRound}
          label="Display name"
          name="name"
          type="text"
          value={profile.name}
          onChange={updateField}
          placeholder="Your name"
        />
        <InputField
          icon={Palette}
          label="Workspace name"
          name="workspaceName"
          type="text"
          value={profile.workspaceName}
          onChange={updateField}
          placeholder="Pocket Studio"
        />

        <SettingGroup icon={Palette} title="Accent theme" value={profile.settings.accent}>
          <OptionGrid
            options={accentOptions}
            value={profile.settings.accent}
            onChange={(value) => updateSetting('accent', value)}
            variant="swatch"
          />
        </SettingGroup>

        <SettingGroup icon={SlidersHorizontal} title="Layout density" value={profile.settings.density}>
          <OptionGrid
            options={densityOptions}
            value={profile.settings.density}
            onChange={(value) => updateSetting('density', value)}
          />
        </SettingGroup>

        <SettingGroup icon={Code2} title="Editor text" value={profile.settings.editorSize}>
          <OptionGrid
            options={editorSizeOptions}
            value={profile.settings.editorSize}
            onChange={(value) => updateSetting('editorSize', value)}
          />
        </SettingGroup>

        <label className="toggle-row">
          <div>
            <strong>Glass effect</strong>
            <span>Use soft translucent panels and shadows.</span>
          </div>
          <input
            type="checkbox"
            checked={profile.settings.glass}
            onChange={(event) => updateSetting('glass', event.target.checked)}
          />
        </label>

        {message && <FormMessage message={message} />}
        <button className="primary-action" type="submit">
          Save Profile
          <Check size={18} />
        </button>
      </form>

      <div className="profile-actions">
        <button type="button" onClick={onSubscribe}>
          <Crown size={17} />
          {plan.name} Plan
        </button>
        <button type="button" onClick={onDone}>
          <Home size={17} />
          Back Home
        </button>
        <button type="button" onClick={onSignOut}>
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </section>
  );
}

function SettingGroup({ icon: Icon, title, value, children }) {
  return (
    <div className="setting-group">
      <div className="setting-group-title">
        <Icon size={17} />
        <div>
          <strong>{title}</strong>
          <span>{value}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function OptionGrid({ options, value, onChange, variant }) {
  return (
    <div className={`option-grid ${variant === 'swatch' ? 'swatch-grid' : ''}`}>
      {options.map((option) => (
        <button
          className={value === option.id ? 'active' : ''}
          key={option.id}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {variant === 'swatch' && <span className={`swatch swatch-${option.id}`} />}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FormMessage({ message }) {
  return (
    <p className="form-message">
      <AlertCircle size={15} />
      {message}
    </p>
  );
}

function InputField({ icon: Icon, actionIcon: ActionIcon, label, ...props }) {
  return (
    <label className="input-field">
      <span>{label}</span>
      <div>
        <Icon size={18} />
        <input {...props} />
        {ActionIcon && <ActionIcon size={17} />}
      </div>
    </label>
  );
}

function HomeScreen({ user, activity, totalSignups, onSubscribe, onSignOut }) {
  const plan = getPlan(user?.planId);
  const recentActivity = activity.slice(0, 3);

  return (
    <section className="screen home-screen">
      <article className="hero-card">
        <div className="hero-copy">
          <span className="pill">
            <Sparkles size={14} />
            Pocket AI builder
          </span>
          <h2>Build software from your phone</h2>
          <p>Prompt, edit, preview, and organize apps, APIs, scripts, and tools in one polished workspace.</p>
        </div>
        <div className="hero-device" aria-hidden="true">
          <Code2 size={34} />
          <div className="device-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
      </article>

      <div className="stat-row">
        <Metric value={totalSignups} label="Signups" />
        <Metric value={plan.name} label="Plan" />
        <Metric value="99%" label="Offline" />
      </div>

      <div className="section-heading">
        <h3>Quick Actions</h3>
        <span>Today</span>
      </div>
      <div className="quick-grid">
        {quickActions.map((item) => (
          <button className="quick-card" key={item.title}>
            <item.icon size={22} />
            <span>{item.title}</span>
            <small>{item.meta}</small>
          </button>
        ))}
        <button className="quick-card upgrade-card" onClick={onSubscribe}>
          <Crown size={22} />
          <span>Upgrade Plan</span>
          <small>More AI builds</small>
        </button>
      </div>

      <article className="account-card">
        <div className="account-card-top">
          <div className="account-avatar">
            <UsersRound size={20} />
          </div>
          <div>
            <p className="eyebrow">Account</p>
            <h3>{user?.name ?? 'Signed in'}</h3>
            <span>{user?.email}</span>
          </div>
          <button className="ghost-icon-button compact" type="button" aria-label="Sign out" onClick={onSignOut}>
            <LogOut size={17} />
          </button>
        </div>

        <div className="account-metrics">
          <div>
            <strong>{plan.name}</strong>
            <span>Current plan</span>
          </div>
          <div>
            <strong>{totalSignups}</strong>
            <span>Signups</span>
          </div>
        </div>

        <div className="activity-panel">
          <div className="activity-heading">
            <Bell size={16} />
            <strong>Recent activity</strong>
          </div>
          {recentActivity.map((item) => (
            <div className="activity-row" key={item.id}>
              <p>{item.message}</p>
              <span>{formatActivityTime(item.createdAt)}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function StackControls({ workspace, onStackChange }) {
  const libraries = libraryOptions[workspace.language] ?? libraryOptions.javascript;
  const controlId = React.useId();

  return (
    <div className="stack-controls">
      <label>
        <span id={`${controlId}-language-label`}>Language</span>
        <select
          aria-labelledby={`${controlId}-language-label`}
          value={workspace.language}
          onChange={(event) => onStackChange({ language: event.target.value })}
        >
          {languageOptions.map((language) => (
            <option key={language.id} value={language.id}>
              {language.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span id={`${controlId}-library-label`}>Stack</span>
        <select
          aria-labelledby={`${controlId}-library-label`}
          value={workspace.library}
          onChange={(event) => onStackChange({ language: workspace.language, library: event.target.value })}
        >
          {libraries.map((library) => (
            <option key={library} value={library}>
              {library}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function AiScreen({ workspace, onPrompt, onStackChange, onOpenCode }) {
  const [prompt, setPrompt] = React.useState('');
  const [status, setStatus] = React.useState('');

  const submitPrompt = (event) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setStatus('Describe what you want the AI to build first.');
      return;
    }

    const result = onPrompt(prompt.trim());
    setStatus(result.message);
    setPrompt('');
  };

  return (
    <section className="screen ai-screen">
      <div className="screen-title">
        <div>
          <p className="eyebrow">AI Mode</p>
          <h2>Prompt Studio</h2>
        </div>
        <span className="status-dot">Demo AI</span>
      </div>
      <StackControls workspace={workspace} onStackChange={onStackChange} />
      <div className="chat-panel">
        {workspace.chatMessages.map((message, index) => (
          <div className={`bubble-row ${message.from}`} key={`${message.from}-${index}`}>
            <div className="avatar">{message.from === 'ai' ? <Bot size={16} /> : <MessageSquareText size={16} />}</div>
            <p className="chat-bubble">{message.text}</p>
          </div>
        ))}
      </div>
      {status && <FormMessage message={status} />}
      <form className="prompt-box" onSubmit={submitPrompt}>
        <input
          aria-label="Prompt input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={`Ask for ${workspace.library} software...`}
        />
        <button type="submit" aria-label="Send prompt">
          <Send size={18} />
        </button>
      </form>
      <button className="secondary-action" type="button" onClick={onOpenCode}>
        <Code2 size={17} />
        Edit generated code manually
      </button>
    </section>
  );
}

function CodeScreen({ workspace, onCodeChange, onStackChange, onRunCode, onSelectFile, onCreateFile }) {
  const lineCount = workspace.code.split('\n').length;
  const activeFile = workspace.files.find((file) => file.id === workspace.activeFileId) ?? workspace.files[0];
  const terminalLines = [
    `> codego run ${workspace.fileName}`,
    `${getLanguage(workspace.language).label} workspace ready`,
    `${workspace.library} selected`,
    workspace.lastRunAt ? 'Last run completed successfully' : 'No active errors'
  ];

  return (
    <section className="screen code-screen ide-screen">
      <div className="ide-shell">
        <div className="ide-titlebar">
          <div>
            <p className="eyebrow">Code Mode</p>
            <h2>{workspace.fileName}</h2>
          </div>
          <div className="toolbar-actions">
            <button type="button" aria-label="Run code" onClick={onRunCode}>
              <Play size={16} />
            </button>
            <button type="button" aria-label="Save file" onClick={() => onCodeChange(workspace.code)}>
              <Save size={16} />
            </button>
          </div>
        </div>

        <div className="ide-command-row">
          <button type="button">
            <Search size={14} />
            Search
          </button>
          <button type="button">
            <GitBranch size={14} />
            main
          </button>
          <button type="button" onClick={onCreateFile}>
            <FilePlus2 size={14} />
            New file
          </button>
        </div>

        <StackControls workspace={workspace} onStackChange={onStackChange} />

        <div className="ide-workbench">
          <aside className="ide-sidebar" aria-label="IDE sidebar">
            <div className="ide-activity-bar" aria-label="Activity bar">
              <button className="active" type="button" aria-label="Explorer">
                <FolderKanban size={16} />
              </button>
              <button type="button" aria-label="Search">
                <Search size={16} />
              </button>
              <button type="button" aria-label="Source control">
                <GitBranch size={16} />
              </button>
              <button type="button" aria-label="Problems">
                <Bug size={16} />
              </button>
            </div>
            <div className="ide-explorer">
              <div className="ide-panel-heading">
                <span>Explorer</span>
                <button type="button" aria-label="Create file" onClick={onCreateFile}>
                  <FilePlus2 size={13} />
                </button>
              </div>
              <div className="ide-file-tree">
                {workspace.files.map((file) => (
                  <button
                    className={file.id === activeFile.id ? 'active' : ''}
                    key={file.id}
                    type="button"
                    onClick={() => onSelectFile(file.id)}
                  >
                    <FileText size={13} />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="ide-main-panel">
            <div className="editor-tabs" aria-label="Open files">
              {workspace.files.slice(0, 4).map((file) => (
                <button
                  className={file.id === activeFile.id ? 'active-tab' : ''}
                  key={file.id}
                  type="button"
                  onClick={() => onSelectFile(file.id)}
                >
                  {file.name}
                </button>
              ))}
            </div>

            <div className="manual-editor">
              <div className="line-gutter" aria-hidden="true">
                {Array.from({ length: Math.max(lineCount, 9) }, (_, index) => (
                  <span key={index}>{String(index + 1).padStart(2, '0')}</span>
                ))}
              </div>
              <textarea
                aria-label="Manual code editor"
                value={workspace.code}
                onChange={(event) => onCodeChange(event.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="ide-bottom-panel">
              <div className="ide-bottom-tabs">
                <span className="active">
                  <PanelBottom size={13} />
                  Terminal
                </span>
                <span>
                  <Bug size={13} />
                  Problems 0
                </span>
              </div>
              <div className="terminal-output">
                {terminalLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ide-statusbar">
          <span>
            <GitBranch size={13} />
            main
          </span>
          <span>{getLanguage(workspace.language).label}</span>
          <span>{workspace.library}</span>
          <span>{lineCount} lines</span>
          <span>{getFileSize(workspace.code)}</span>
        </div>
      </div>
    </section>
  );
}

function PreviewScreen({ workspace }) {
  return (
    <section className="screen preview-screen">
      <div className="screen-title">
        <div>
          <p className="eyebrow">Preview Mode</p>
          <h2>Live Mobile Build</h2>
        </div>
        <Layers3 size={22} />
      </div>
      <div className="preview-stage">
        <div className="preview-phone">
          <div className="preview-notch" />
          <div className="preview-app-card">
            <span>{getLanguage(workspace.language).label} preview</span>
            <h3>{workspace.library}</h3>
            <div className="preview-progress"><span /></div>
            <ul>
              <li>{workspace.fileName}</li>
              <li>{workspace.code.split('\n').length} editable lines</li>
              <li>{workspace.lastRunAt ? 'Last run saved' : 'Ready to run'}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilesScreen({ workspace, onOpenFile, onCreateFile }) {
  const totalLines = workspace.files.reduce((total, file) => total + file.code.split('\n').length, 0);

  return (
    <section className="screen files-screen">
      <div className="screen-title">
        <div>
          <p className="eyebrow">Files</p>
          <h2>Project Explorer</h2>
        </div>
        <button className="new-file-button" type="button" onClick={onCreateFile}>
          <FilePlus2 size={17} />
          New
        </button>
      </div>
      <div className="files-summary">
        <div>
          <strong>{workspace.files.length}</strong>
          <span>Files</span>
        </div>
        <div>
          <strong>{totalLines}</strong>
          <span>Lines</span>
        </div>
        <div>
          <strong>{workspace.library}</strong>
          <span>Active stack</span>
        </div>
      </div>
      <div className="file-list">
        {workspace.files.map((file) => (
          <button
            className={`file-row ${file.id === workspace.activeFileId ? 'active' : ''}`}
            key={file.id}
            type="button"
            onClick={() => onOpenFile(file.id)}
          >
            <div className="file-icon">
              <FileText size={18} />
            </div>
            <div>
              <h3>{file.name}</h3>
              <p>{file.type}</p>
            </div>
            <span>{getFileSize(file.code)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BottomNav({ activeScreen, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {screens.map((screen) => (
        <button
          className={activeScreen === screen.id ? 'active' : ''}
          key={screen.id}
          onClick={() => onChange(screen.id)}
          type="button"
        >
          <screen.icon size={20} />
          <span>{screen.label}</span>
        </button>
      ))}
    </nav>
  );
}

const rootElement = document.getElementById('root');
const root = window.__codeOnTheGoRoot ?? createRoot(rootElement);
window.__codeOnTheGoRoot = root;
root.render(<App />);
