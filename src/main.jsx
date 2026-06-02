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
  Download,
  Eye,
  FilePlus2,
  FileText,
  FolderKanban,
  GitBranch,
  Home,
  Layers3,
  KeyRound,
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
  Share2,
  TerminalSquare,
  Trash2,
  UsersRound,
  UserRound,
  WandSparkles,
  X
} from 'lucide-react';
import './styles.css';

registerSW({ immediate: true });

const screens = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'preview', label: 'Preview', icon: Smartphone },
  { id: 'files', label: 'Files', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const quickActions = [
  { title: 'New Project', meta: 'Prompt to software', icon: WandSparkles },
  { title: 'Open Studio', meta: 'Mobile IDE', icon: TerminalSquare },
  { title: 'Ship Preview', meta: 'Test instantly', icon: Rocket }
];

const featureMenuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'newProject', label: 'New Project', icon: FilePlus2 },
  { id: 'code', label: 'Code Editor', icon: Code2 },
  { id: 'preview', label: 'Preview', icon: Smartphone },
  { id: 'files', label: 'Files', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'terms', label: 'Terms', icon: ShieldCheck }
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
  { from: 'assist', text: 'Smart Assistance can explain errors, suggest snippets, and help you keep building in the editor.' }
];

const defaultWorkspace = {
  language: 'javascript',
  library: 'React + Vite',
  fileName: 'App.jsx',
  code: `export function AppPreview() {
  const features = ["Smart Assistance", "Code editor", "Mobile preview"];

  return (
    <main className="mobile-app">
      <section className="hero">
        <span>Code On The Go</span>
        <h1>Build software from your phone</h1>
        <p>Edit, preview, and ship apps, APIs, tools, and scripts anywhere.</p>
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
    name: 'Free',
    price: 'Free',
    amount: 0,
    detail: 'Start building',
    features: ['One active project', 'Manual code editor', 'Local preview']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    amount: 12,
    detail: 'per month',
    featured: true,
    features: ['Smart Assistance tools', 'Unlimited projects', 'Priority previews']
  },
  {
    id: 'studio',
    name: 'Team',
    price: '$24',
    amount: 24,
    detail: 'per month',
    features: ['Shared files', 'Team workspaces', 'Cloud sync controls']
  }
];

const storageKey = 'code-on-the-go-demo-state';
const termsStorageKey = 'code-on-the-go-terms-accepted';
const portfolioUserId = 'portfolio-user';

const defaultUserSettings = {
  workspaceName: 'Pocket Studio',
  accent: 'violet',
  density: 'comfortable',
  editorSize: 'regular',
  glass: true,
  lineWrap: true,
  autosave: true,
  defaultLanguage: 'javascript',
  defaultFramework: 'React + Vite',
  cloudSync: false
};

function createPortfolioUser(settings = defaultUserSettings) {
  return {
    id: portfolioUserId,
    name: '',
    email: '',
    planId: 'starter',
    paymentProvider: null,
    subscriptionStatus: 'portfolio',
    settings: {
      ...defaultUserSettings,
      ...settings
    },
    createdAt: getNow(),
    payments: [],
    aiKeyConfigured: false
  };
}

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

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    const error = new Error('API unavailable');
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  if (!response.ok || payload.ok === false) {
    const error = new Error(payload.error || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return payload;
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
    return ["Smart Assistance", "Code Mode", "Preview Mode", "Files"]`;
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

app.MapGet("/features", () => new[] { "Smart Assistance", "Code Mode", "Preview Mode", "Files" });

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
  { id: 1, title: "Smart Assistance" },
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
  const features = ["Smart Assistance", "Manual coding", "${library}"];

  return (
    <main className="mobile-app">
      <section className="hero">
        <span>Generated by Smart Assistance</span>
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

function buildProjectTemplate({ name, language, framework, template }) {
  if (template === 'Blank file') {
    if (language === 'markdown') return `# ${name}\n`;
    if (language === 'json') return `{\n  "name": "${name}",\n  "version": "0.1.0"\n}\n`;
    return '';
  }

  return buildGeneratedCode(`${template} project named ${name}`, language, framework);
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

Use Smart Assistance for syntax help and snippets, Code Mode to edit files, and Preview Mode to inspect the current build.`,
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
    aiKeyConfigured: Boolean(user.aiKeyConfigured),
    settings: {
      ...defaultUserSettings,
      ...(user.settings ?? {})
    }
  };
}

function getDefaultAppData() {
  const createdAt = getNow();
  const portfolioUser = createPortfolioUser();

  return {
    currentUserId: portfolioUserId,
    workspace: defaultWorkspace,
    users: [portfolioUser],
    activity: [
      {
        id: 'activity-portfolio',
        type: 'portfolio',
        message: 'Portfolio workspace opened for review.',
        createdAt
      }
    ]
  };
}

function sanitizePortfolioData(data) {
  const portfolioUser = createPortfolioUser(data.users?.find((user) => user.id === portfolioUserId)?.settings);

  return {
    ...data,
    currentUserId: portfolioUserId,
    users: [portfolioUser],
    workspace: normalizeWorkspace(data.workspace),
    activity: [
      {
        id: 'activity-portfolio',
        type: 'portfolio',
        message: 'Portfolio workspace opened for review.',
        createdAt: data.activity?.[0]?.createdAt ?? getNow()
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
    return sanitizePortfolioData({
      ...parsed,
      users: parsed.users.map(withDefaultUserSettings)
    });
  } catch {
    return getDefaultAppData();
  }
}

function loadTermsAccepted() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(termsStorageKey) === 'true';
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

function isStandaloneApp() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function App() {
  const initialData = React.useMemo(() => loadAppData(), []);
  const initialTermsAccepted = React.useMemo(() => loadTermsAccepted(), []);
  const [appData, setAppData] = React.useState(initialData);
  const [activeScreen, setActiveScreen] = React.useState('home');
  const [termsAccepted, setTermsAccepted] = React.useState(initialTermsAccepted);
  const [activeView, setActiveView] = React.useState(initialTermsAccepted ? 'app' : 'landing');
  const [returnView, setReturnView] = React.useState('landing');
  const [pendingSignup, setPendingSignup] = React.useState(null);
  const [installPrompt, setInstallPrompt] = React.useState(null);
  const [installSheetOpen, setInstallSheetOpen] = React.useState(false);
  const [appInstalled, setAppInstalled] = React.useState(() => isStandaloneApp());
  const screenStackRef = React.useRef(null);
  const currentUser = appData.users.find((user) => user.id === appData.currentUserId) ?? null;
  const currentSettings = currentUser?.settings ?? defaultUserSettings;
  const workspace = normalizeWorkspace(appData.workspace);
  const shellModeClass = activeView === 'app' ? `screen-${activeScreen}` : `view-${activeView}`;

  const applyServerSession = React.useCallback((payload) => {
    if (!payload?.user) {
      return;
    }

    setAppData((current) => {
      const existingUser = current.users.find((user) => user.id === payload.user.id);
      const nextUser = {
        ...existingUser,
        ...payload.user,
        aiKeyConfigured: payload.user.aiKeyConfigured ?? existingUser?.aiKeyConfigured ?? false,
        settings: {
          ...defaultUserSettings,
          ...(existingUser?.settings ?? {}),
          ...(payload.user.settings ?? {})
        }
      };
      const otherUsers = current.users.filter((user) => user.id !== nextUser.id);

      return {
        ...current,
        currentUserId: nextUser.id,
        users: [...otherUsers, nextUser],
        workspace: payload.workspace ? normalizeWorkspace(payload.workspace) : current.workspace,
        activity: payload.activity?.length ? payload.activity : current.activity
      };
    });
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(appData));
  }, [appData]);

  React.useEffect(() => {
    const updateInstalled = () => setAppInstalled(isStandaloneApp());
    const media = window.matchMedia('(display-mode: standalone)');
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setAppInstalled(false);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setInstallSheetOpen(false);
      setAppInstalled(true);
    };

    updateInstalled();
    media.addEventListener?.('change', updateInstalled);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      media.removeEventListener?.('change', updateInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const acceptTerms = () => {
    window.localStorage.setItem(termsStorageKey, 'true');
    setTermsAccepted(true);
    setActiveView('app');
    setActiveScreen('home');
  };

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
    setActiveScreen('settings');
    setActiveView('app');
  };

  const handleInstallApp = async () => {
    if (isStandaloneApp() || appInstalled) {
      setAppInstalled(true);
      setInstallSheetOpen(true);
      return;
    }

    if (!installPrompt) {
      setInstallSheetOpen(true);
      return;
    }

    const promptEvent = installPrompt;
    setInstallPrompt(null);
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    if (choice?.outcome === 'accepted') {
      setAppInstalled(true);
      setInstallSheetOpen(false);
      return;
    }

    setInstallSheetOpen(true);
  };

  const selectFeature = (featureId) => {
    if (featureId === 'newProject') {
      setReturnView('app');
      setActiveView('newProject');
      return;
    }

    if (featureId === 'terms') {
      setReturnView('app');
      setActiveView('terms');
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

  const handleLogin = async ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return { ok: false, message: 'Enter your email and password.' };
    }

    try {
      const payload = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      applyServerSession(payload);
      enterApp();
      return { ok: true };
    } catch (error) {
      if (error.status && error.status !== 404) {
        return { ok: false, message: error.message };
      }
    }

    const user = appData.users.find((candidate) => candidate.email === normalizedEmail);

    if (!user || user.password !== password) {
      return { ok: false, message: 'No matching account found for those details.' };
    }

    setAppData((current) => ({ ...current, currentUserId: user.id }));
    appendActivity({ type: 'login', message: `${user.name} signed in.` });
    enterApp();
    return { ok: true };
  };

  const handleRegister = async ({ name, email, password, confirmPassword }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!name.trim() || !normalizedEmail || !password) {
      return { ok: false, message: 'Add your name, email, and password.' };
    }

    if (password.length < 6) {
      return { ok: false, message: 'Use at least 6 characters for the password.' };
    }

    if (password !== confirmPassword) {
      return { ok: false, message: 'Passwords must match.' };
    }

    if (appData.users.some((user) => user.email === normalizedEmail)) {
      return { ok: false, message: 'That email is already registered. Sign in instead.' };
    }

    try {
      const registerPayload = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          planId: 'starter'
        })
      });
      applyServerSession(registerPayload);
      enterApp();
      return { ok: true };
    } catch (error) {
      if (error.status && error.status !== 404) {
        return { ok: false, message: error.message };
      }
    }

    const createdAt = getNow();
    const newUser = {
      id: createId('user'),
      name: name.trim(),
      email: normalizedEmail,
      password,
      planId: 'starter',
      paymentProvider: 'None',
      subscriptionStatus: 'free',
      settings: defaultUserSettings,
      createdAt,
      payments: []
    };

    setAppData((current) => ({
      ...current,
      currentUserId: newUser.id,
      users: [...current.users, newUser],
      activity: [
        {
          id: createId('activity'),
          type: 'signup',
          message: `${newUser.name} created an account.`,
          createdAt
        },
        ...current.activity
      ].slice(0, 20)
    }));
    enterApp();
    return { ok: true };
  };

  const handleCheckout = async ({ planId, provider, payment }) => {
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

    try {
      if (pendingSignup) {
        const registerPayload = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: pendingSignup.name,
            email: pendingSignup.email,
            password: pendingSignup.password,
            planId
          })
        });
        applyServerSession(registerPayload);
      }

      const checkoutPayload = await apiRequest('/api/checkout/create', {
        method: 'POST',
        body: JSON.stringify({ planId, provider, payment })
      });

      if (checkoutPayload.checkoutUrl) {
        window.location.assign(checkoutPayload.checkoutUrl);
        return { ok: true };
      }

      if (checkoutPayload.user) {
        applyServerSession({
          user: checkoutPayload.user,
          workspace,
          activity: appData.activity
        });
      }

      setPendingSignup(null);
      enterApp();
      return { ok: true };
    } catch (error) {
      if (error.status && error.status !== 404) {
        return { ok: false, message: error.message };
      }
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

  const handleSignOut = async () => {
    apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setAppData((current) => ({ ...current, currentUserId: null }));
    setActiveScreen('home');
    setActiveView('landing');
  };

  const handleProfileSave = async ({ name, workspaceName, settings }) => {
    const displayName = name.trim();
    const workspace = workspaceName.trim();

    if (!displayName) {
      return { ok: false, message: 'Add a display name.' };
    }

    if (!workspace) {
      return { ok: false, message: 'Add a workspace name.' };
    }

    try {
      const payload = await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: displayName, workspaceName: workspace, settings })
      });
      if (payload.user) {
        applyServerSession({
          user: payload.user,
          workspace: appData.workspace,
          activity: appData.activity
        });
      }
      return { ok: true, message: 'Profile saved.' };
    } catch (error) {
      if (error.status && error.status !== 404) {
        return { ok: false, message: error.message };
      }
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
          message: 'Portfolio workspace settings were updated.',
          createdAt: getNow()
        },
        ...current.activity
      ].slice(0, 20)
    }));

    return { ok: true, message: 'Profile saved.' };
  };

  const handleSaveAiKey = async (apiKey) => {
    if (!currentUser) {
      return { ok: false, message: 'Sign in before saving an API key.' };
    }

    if (!apiKey) {
      return { ok: false, message: 'Enter an API key first.' };
    }

    try {
      const payload = await apiRequest('/api/ai/key', {
        method: 'PUT',
        body: JSON.stringify({ apiKey })
      });
      if (payload.user) {
        applyServerSession({
          user: payload.user,
          workspace: appData.workspace,
          activity: appData.activity
        });
      }
      return { ok: true, message: 'API key connected.' };
    } catch (error) {
      if (error.message !== 'API unavailable' && error.status !== 404) {
        return { ok: false, message: error.message };
      }
    }

    setAppData((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === current.currentUserId
          ? {
              ...user,
              aiKeyConfigured: true
            }
          : user
      ),
      activity: [
        {
          id: createId('activity'),
          type: 'settings',
          message: `${currentUser.name} connected a personal API key locally.`,
          createdAt: getNow()
        },
        ...current.activity
      ].slice(0, 20)
    }));

    return { ok: true, message: 'API key connected on this device.' };
  };

  const handleRemoveAiKey = async () => {
    if (!currentUser) {
      return { ok: false, message: 'Sign in before changing API settings.' };
    }

    try {
      const payload = await apiRequest('/api/ai/key', { method: 'DELETE' });
      if (payload.user) {
        applyServerSession({
          user: payload.user,
          workspace: appData.workspace,
          activity: appData.activity
        });
      }
      return { ok: true, message: 'API key removed.' };
    } catch (error) {
      if (error.message !== 'API unavailable' && error.status !== 404) {
        return { ok: false, message: error.message };
      }
    }

    setAppData((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === current.currentUserId
          ? {
              ...user,
              aiKeyConfigured: false
            }
          : user
      )
    }));

    return { ok: true, message: 'API key removed from this device.' };
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

  const syncWorkspace = async (nextWorkspace = appData.workspace) => {
    try {
      await apiRequest('/api/workspace', {
        method: 'PUT',
        body: JSON.stringify({ workspace: normalizeWorkspace(nextWorkspace) })
      });
      return { ok: true, message: 'Workspace saved.' };
    } catch (error) {
      if (error.status && error.status !== 404) {
        return { ok: false, message: error.message };
      }
      return { ok: true, message: 'Workspace saved locally.' };
    }
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

  const handleAiPrompt = async (prompt) => {
    const generatedCode = buildGeneratedCode(prompt, workspace.language, workspace.library);
    const nextFileName = getFileName(workspace.language, workspace.library);
    const aiMessage = `I generated ${workspace.library} ${getLanguage(workspace.language).label} code and placed it in Code Mode. You can keep editing it manually.`;

    try {
      const payload = await apiRequest('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          language: workspace.language,
          library: workspace.library,
          workspace
        })
      });

      if (payload.workspace) {
        updateWorkspace(payload.workspace);
      } else if (payload.code) {
        updateWorkspace({
          code: payload.code,
          lastPrompt: prompt,
          fileName: nextFileName,
          files: updateActiveFile({
            name: nextFileName,
            type: getFileType(workspace.language, workspace.library),
            language: workspace.language,
            library: workspace.library,
            code: payload.code
          }),
          chatMessages: [
            ...(workspace.chatMessages ?? defaultChatMessages),
            { from: 'user', text: prompt },
            { from: 'assist', text: `Generated code with ${payload.provider ?? 'Smart Assistance'}.` }
          ]
        });
      }

      return { ok: true, message: `Generated code with ${payload.provider ?? 'Smart Assistance backend'}.` };
    } catch (error) {
      if (error.status && error.status !== 404) {
        return { ok: false, message: error.message };
      }
    }

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
          { from: 'assist', text: aiMessage }
        ]
      }),
      activity: [
        {
          id: createId('activity'),
          type: 'ai',
          message: 'Smart Assistance generated code for the portfolio workspace.',
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
    const runAt = getNow();

    updateWorkspace({ lastRunAt: runAt });
    syncWorkspace({
      ...workspace,
      lastRunAt: runAt
    });
    appendActivity({ type: 'code', message: `Previewed ${workspace.fileName}.` });
    setActiveScreen('preview');
    return { ok: true, message: 'Preview refreshed.' };
  };

  const handleSaveWorkspace = async () => syncWorkspace(workspace);

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
    appendActivity({ type: 'file', message: `Created ${newFile.name}.` });
  };

  const handleCreateProject = ({ projectName, language, framework, template, assistanceLevel }) => {
    const name = projectName.trim();
    if (!name) {
      return { ok: false, message: 'Add a project name.' };
    }

    const fileName = getFileName(language, framework);
    const starterCode = buildProjectTemplate({ name, language, framework, template });
    const newFile = createWorkspaceFile({
      id: createId('file'),
      name: fileName,
      type: getFileType(language, framework),
      language,
      library: framework,
      code: starterCode,
      createdAt: getNow()
    });

    updateWorkspace({
      projectName: name,
      assistanceLevel,
      language,
      library: framework,
      fileName,
      code: starterCode,
      files: [newFile],
      activeFileId: newFile.id,
      lastPrompt: ''
    });
    appendActivity({ type: 'project', message: `Created ${name}.` });
    setActiveView('app');
    setActiveScreen('code');
    return { ok: true };
  };

  return (
    <main className={`app theme-${currentSettings.accent} density-${currentSettings.density} editor-${currentSettings.editorSize} ${currentSettings.glass ? 'glass-on' : 'glass-off'}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className={`phone-shell ${shellModeClass} ${activeView !== 'app' ? 'auth-shell' : ''}`} aria-label="Code On The Go software workspace">
        <AppHeader
          showActions={termsAccepted && activeView === 'app'}
          onOpenProfile={openProfile}
          onSelectFeature={selectFeature}
          activeScreen={activeScreen}
        />
        <div className="screen-stack" ref={screenStackRef}>
          {(activeView === 'landing' || activeView === 'terms') && (
            <TermsNoticeScreen
              accepted={termsAccepted}
              onAccept={acceptTerms}
              onBack={termsAccepted ? () => setActiveView(returnView) : null}
            />
          )}
          {activeView === 'newProject' && (
            <NewProjectScreen
              workspace={workspace}
              onBack={() => setActiveView('app')}
              onCreate={handleCreateProject}
            />
          )}
          {activeView === 'app' && activeScreen === 'home' && (
            <HomeScreen
              user={currentUser}
              activity={appData.activity}
              installPromptReady={Boolean(installPrompt)}
              installSheetOpen={installSheetOpen}
              appInstalled={appInstalled}
              onOpenScreen={setActiveScreen}
              onInstallApp={handleInstallApp}
              onCloseInstallSheet={() => setInstallSheetOpen(false)}
              onNewProject={() => {
                setReturnView('app');
                setActiveView('newProject');
              }}
              onViewTerms={() => {
                setReturnView('app');
                setActiveView('terms');
              }}
            />
          )}
          {activeView === 'app' && activeScreen === 'code' && (
            <CodeScreen
              workspace={workspace}
              settings={currentSettings}
              onCodeChange={handleManualCodeChange}
              onStackChange={handleWorkspaceStackChange}
              onGenerate={handleAiPrompt}
              onRunCode={handleRunCode}
              onSaveWorkspace={handleSaveWorkspace}
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
          {activeView === 'app' && activeScreen === 'settings' && (
            <SettingsScreen
              user={currentUser}
              onSave={handleProfileSave}
              onViewTerms={() => {
                setReturnView('app');
                setActiveView('terms');
              }}
            />
          )}
        </div>
        {termsAccepted && activeView === 'app' && <BottomNav activeScreen={activeScreen} onChange={setActiveScreen} />}
      </section>
    </main>
  );
}

function AppHeader({ showActions, onOpenProfile, onSelectFeature, activeScreen }) {
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

function TermsNoticeScreen({ accepted, onAccept, onBack }) {
  const [checked, setChecked] = React.useState(accepted);

  const continueToApp = (event) => {
    event.preventDefault();
    if (checked) {
      onAccept();
    }
  };

  return (
    <section className="screen terms-notice-screen">
      {onBack && (
        <div className="subscription-topbar">
          <button className="ghost-icon-button" type="button" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={18} />
          </button>
          <span>Terms</span>
        </div>
      )}

      <div className="portfolio-notice-card">
        <span className="hero-kicker">
          <ShieldCheck size={14} />
          Personal portfolio notice
        </span>
        <h1>Please note this site is for personal use and my Portfolio</h1>
      </div>

      <form className="terms-card" onSubmit={continueToApp}>
        <div className="section-heading">
          <h2>Terms and Conditions</h2>
          <span>Standard site terms</span>
        </div>

        <div className="terms-copy">
          <p>This website is provided as a personal portfolio and demonstration project. It is intended for review, presentation, and personal-use purposes only.</p>
          <p>Content, interface designs, sample workflows, generated previews, and demo features are provided as-is without warranties of availability, accuracy, fitness for a specific purpose, or uninterrupted operation.</p>
          <p>Visitors must not misuse the site, attempt unauthorized access, upload unlawful material, reverse engineer protected parts of the service, or use the site in a way that disrupts its normal operation.</p>
          <p>Any demo data entered into the site should be non-sensitive. Do not enter private financial, medical, legal, or confidential business information.</p>
          <p>By continuing, you acknowledge that this is a portfolio project and agree to use it responsibly.</p>
        </div>

        <label className="terms-check">
          <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
          <span>I have read and agree to the terms and conditions.</span>
        </label>

        <button className="primary-action" type="submit" disabled={!checked}>
          Continue
          <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}

function LoginScreen({ onLogin, onRegister, onSubscribe }) {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');

  const updateField = (event) => {
    setError('');
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    const result = await onLogin(form);
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
          <button type="button" onClick={() => setError('Password reset link would be sent from the backend.')}>Forgot password</button>
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
  const [form, setForm] = React.useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = React.useState('');

  const updateField = (event) => {
    setError('');
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    const result = await onCreate(form);
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
        <p>Set up a mobile coding studio that is ready for projects, files, and previews.</p>
      </div>

      <form className="auth-card" onSubmit={submitRegister}>
        <InputField
          icon={UserRound}
          label="Full name"
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
        <InputField
          icon={LockKeyhole}
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={updateField}
          placeholder="Confirm password"
          actionIcon={Eye}
        />
        {error && <FormMessage message={error} />}
        <button className="primary-action" type="submit">
          Create Account
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
  const [billing, setBilling] = React.useState('monthly');
  const [provider, setProvider] = React.useState('Stripe');
  const [payment, setPayment] = React.useState({ cardNumber: '', expiry: '', reference: '' });
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const selectedPlan = getPlan(selectedPlanId);
  const canCheckout = Boolean(currentUser || pendingSignup);
  const requiresPayment = selectedPlan.amount > 0;
  const displayPrice = (plan) => {
    if (plan.amount === 0) return 'Free';
    return billing === 'yearly' ? `$${plan.amount * 10}/yr` : `${plan.price}/mo`;
  };

  const updatePayment = (event) => {
    setError('');
    setPayment((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitCheckout = async () => {
    if (!canCheckout) {
      onRequireAccount();
      return;
    }

    const result = await onCheckout({ planId: selectedPlanId, provider, payment });
    if (!result.ok) {
      setError(result.message);
      setCheckoutOpen(true);
      return;
    }
  };

  const handlePrimaryAction = async () => {
    if (!canCheckout) {
      onRequireAccount();
      return;
    }

    if (requiresPayment) {
      setError('');
      setCheckoutOpen(true);
      return;
    }

    await submitCheckout();
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
        <h2>Unlock Smart Assistance anywhere</h2>
        <p>Pick the workflow that matches how much you want Code On The Go to support your builds.</p>
      </article>

      <div className="billing-toggle" aria-label="Billing period">
        {['monthly', 'yearly'].map((option) => (
          <button
            className={billing === option ? 'active' : ''}
            key={option}
            type="button"
            onClick={() => setBilling(option)}
          >
            {option}
          </button>
        ))}
      </div>

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
              <strong>{displayPrice(plan)}</strong>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} />
                  {feature}
                </li>
              ))}
            </ul>
            <span className="upgrade-pill">{plan.amount === 0 ? 'Choose Free' : 'Upgrade'}</span>
          </button>
        ))}
      </div>

      <div className="selected-plan-summary">
        <div>
          <span>Selected plan</span>
          <strong>{selectedPlan.name}</strong>
        </div>
        <strong>{displayPrice(selectedPlan)}</strong>
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

function ProfileScreen({ user, plan, onSave, onSaveAiKey, onRemoveAiKey, onSubscribe, onDone, onSignOut }) {
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
  const [apiKey, setApiKey] = React.useState('');
  const [keyMessage, setKeyMessage] = React.useState('');

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

  const saveProfile = async (event) => {
    event.preventDefault();
    const result = await onSave(profile);
    setMessage(result.message);
  };

  const saveAiKey = async (event) => {
    event.preventDefault();
    setKeyMessage('');
    const result = await onSaveAiKey(apiKey.trim());
    if (result.ok) {
      setApiKey('');
    }
    setKeyMessage(result.message);
  };

  const removeAiKey = async () => {
    setKeyMessage('');
    const result = await onRemoveAiKey();
    setKeyMessage(result.message);
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

      <form className="profile-card ai-key-card" onSubmit={saveAiKey}>
        <div className="ai-key-heading">
          <div>
            <KeyRound size={18} />
            <div>
              <strong>Personal API key</strong>
              <span>{user?.aiKeyConfigured ? 'Connected' : 'Not connected'}</span>
            </div>
          </div>
          <span className={`key-status ${user?.aiKeyConfigured ? 'connected' : ''}`}>
            <ShieldCheck size={14} />
            {user?.aiKeyConfigured ? 'Ready' : 'Setup'}
          </span>
        </div>

        <InputField
          icon={KeyRound}
          label="API key"
          name="apiKey"
          type="password"
          value={apiKey}
          onChange={(event) => {
            setKeyMessage('');
            setApiKey(event.target.value);
          }}
          placeholder="sk-..."
          autoComplete="off"
        />

        {keyMessage && <FormMessage message={keyMessage} />}
        <div className="profile-key-actions">
          <button className="primary-action" type="submit" disabled={!apiKey.trim()}>
            Save Key
            <Check size={18} />
          </button>
          <button
            className="secondary-action danger-action"
            type="button"
            disabled={!user?.aiKeyConfigured}
            onClick={removeAiKey}
          >
            Remove
            <Trash2 size={17} />
          </button>
        </div>
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

function NewProjectScreen({ workspace, onBack, onCreate }) {
  const [form, setForm] = React.useState({
    projectName: '',
    language: workspace.language,
    framework: workspace.library,
    template: 'Starter app',
    assistanceLevel: 'Guided'
  });
  const [message, setMessage] = React.useState('');
  const frameworks = libraryOptions[form.language] ?? libraryOptions.javascript;
  const templates = ['Starter app', 'Blank file', 'Dashboard', 'API route', 'Utility script'];
  const assistanceLevels = ['Light', 'Guided', 'Detailed'];

  const update = (key, value) => {
    setMessage('');
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === 'language' ? { framework: (libraryOptions[value] ?? libraryOptions.javascript)[0] } : {})
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    const result = onCreate(form);
    if (!result.ok) {
      setMessage(result.message);
    }
  };

  return (
    <section className="screen new-project-screen">
      <div className="subscription-topbar">
        <button className="ghost-icon-button" type="button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <span>New Project</span>
      </div>

      <form className="project-form-card" onSubmit={submit}>
        <InputField
          icon={FilePlus2}
          label="Project name"
          name="projectName"
          type="text"
          value={form.projectName}
          onChange={(event) => update('projectName', event.target.value)}
          placeholder="Client dashboard"
        />

        <label className="select-field">
          <span>Language</span>
          <select value={form.language} onChange={(event) => update('language', event.target.value)}>
            {languageOptions.map((language) => (
              <option key={language.id} value={language.id}>{language.label}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Framework</span>
          <select value={form.framework} onChange={(event) => update('framework', event.target.value)}>
            {frameworks.map((framework) => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Template</span>
          <select value={form.template} onChange={(event) => update('template', event.target.value)}>
            {templates.map((template) => (
              <option key={template} value={template}>{template}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Assistance level</span>
          <select value={form.assistanceLevel} onChange={(event) => update('assistanceLevel', event.target.value)}>
            {assistanceLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>

        {message && <FormMessage message={message} />}
        <button className="primary-action" type="submit">
          Create Project
          <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}

function SettingsScreen({ user, onSave, onViewTerms }) {
  const userSettings = user?.settings ?? defaultUserSettings;
  const [settings, setSettings] = React.useState({
    ...defaultUserSettings,
    ...userSettings
  });
  const [message, setMessage] = React.useState('');
  const frameworks = libraryOptions[settings.defaultLanguage] ?? libraryOptions.javascript;

  const update = (key, value) => {
    setMessage('');
    setSettings((current) => ({
      ...current,
      [key]: value,
      ...(key === 'defaultLanguage' ? { defaultFramework: (libraryOptions[value] ?? libraryOptions.javascript)[0] } : {})
    }));
  };

  const save = async () => {
    const result = await onSave({
      name: 'Portfolio workspace',
      workspaceName: settings.workspaceName,
      settings
    });
    setMessage(result.message);
  };

  return (
    <section className="screen settings-screen">
      <div className="screen-title">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Workspace</h2>
        </div>
      </div>

      <div className="settings-card">
        <SettingGroup icon={Palette} title="Theme" value={settings.accent}>
          <OptionGrid
            options={accentOptions}
            value={settings.accent}
            onChange={(value) => update('accent', value)}
            variant="swatch"
          />
        </SettingGroup>

        <SettingGroup icon={Code2} title="Editor font size" value={settings.editorSize}>
          <OptionGrid
            options={editorSizeOptions}
            value={settings.editorSize}
            onChange={(value) => update('editorSize', value)}
          />
        </SettingGroup>

        <ToggleSetting label="Line wrap" checked={settings.lineWrap} onChange={(value) => update('lineWrap', value)} />
        <ToggleSetting label="Autosave" checked={settings.autosave} onChange={(value) => update('autosave', value)} />
        <ToggleSetting label="Cloud sync" checked={settings.cloudSync} onChange={(value) => update('cloudSync', value)} />

        <label className="select-field">
          <span>Default language</span>
          <select value={settings.defaultLanguage} onChange={(event) => update('defaultLanguage', event.target.value)}>
            {languageOptions.map((language) => (
              <option key={language.id} value={language.id}>{language.label}</option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Default framework</span>
          <select value={settings.defaultFramework} onChange={(event) => update('defaultFramework', event.target.value)}>
            {frameworks.map((framework) => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </label>

        {message && <FormMessage message={message} />}
        <button className="primary-action" type="button" onClick={save}>
          Save Settings
          <Check size={18} />
        </button>
      </div>

      <div className="settings-card account-settings-card">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h3>Personal-use demo</h3>
          <span>This site is provided as a portfolio project.</span>
        </div>
        <button className="secondary-action" type="button" onClick={onViewTerms}>
          View Terms
          <ShieldCheck size={17} />
        </button>
      </div>
    </section>
  );
}

function ToggleSetting({ label, checked, onChange }) {
  return (
    <label className="toggle-row compact-toggle-row">
      <strong>{label}</strong>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function HomeScreen({
  user,
  activity,
  installPromptReady,
  installSheetOpen,
  appInstalled,
  onOpenScreen,
  onInstallApp,
  onCloseInstallSheet,
  onNewProject,
  onViewTerms
}) {
  const recentActivity = activity[0];
  const actions = [
    { id: 'newProject', title: 'New Project', meta: 'Start clean', icon: FilePlus2, action: onNewProject },
    { id: 'code', title: 'Code', meta: 'Edit manually', icon: Code2 },
    { id: 'preview', title: 'Preview', meta: 'View the app', icon: Smartphone }
  ];

  return (
    <section className="screen home-screen">
      <div className="home-greeting">
        <div>
          <span>Personal portfolio</span>
          <h2>Code On The Go</h2>
        </div>
        <div className="plan-badge">Portfolio</div>
      </div>

      <button className={`install-app-card ${appInstalled ? 'installed' : ''}`} type="button" onClick={onInstallApp}>
        <span className="install-app-icon">
          {installPromptReady ? <Download size={18} /> : <Share2 size={18} />}
        </span>
        <span>
          <strong>{appInstalled ? 'App installed' : 'Install app'}</strong>
          <small>
            {appInstalled
              ? 'Ready from your home screen.'
              : installPromptReady
                ? 'Save Code On The Go to your home screen.'
                : 'Add it to your phone for the full app experience.'}
          </small>
        </span>
        <ArrowRight size={18} />
      </button>

      {installSheetOpen && (
        <div className="install-sheet-overlay" role="dialog" aria-modal="true" aria-labelledby="install-sheet-title">
          <button className="install-sheet-backdrop" type="button" aria-label="Close install help" onClick={onCloseInstallSheet} />
          <div className="install-sheet">
            <div className="checkout-handle" />
            <div className="install-sheet-header">
              <div>
                <p className="eyebrow">Install app</p>
                <h2 id="install-sheet-title">{appInstalled ? 'Already installed' : 'Add to Home Screen'}</h2>
              </div>
              <button className="checkout-close" type="button" aria-label="Close install help" onClick={onCloseInstallSheet}>
                <X size={18} />
              </button>
            </div>
            <div className="install-steps">
              <article>
                <Share2 size={18} />
                <span>iPhone Safari</span>
                <strong>Tap Share, then Add to Home Screen.</strong>
              </article>
              <article>
                <Download size={18} />
                <span>Android Chrome</span>
                <strong>Tap Install app or Add to Home screen.</strong>
              </article>
            </div>
            <button className="primary-action" type="button" onClick={onCloseInstallSheet}>
              Done
              <Check size={18} />
            </button>
          </div>
        </div>
      )}

      <article className="hero-card">
        <span className="hero-kicker">
          <Sparkles size={14} />
          Mobile software studio
        </span>
        <div>
          <h2>Build software from your phone</h2>
          <p>Edit code, use Smart Assistance, preview your work, and keep projects organized in one calm workspace.</p>
        </div>
      </article>

      <div className="section-heading">
        <h3>Main actions</h3>
      </div>
      <div className="main-action-grid">
        {actions.map((item) => (
          <button className="main-action-card" key={item.id} type="button" onClick={item.action ?? (() => onOpenScreen(item.id))}>
            <item.icon size={22} />
            <strong>{item.title}</strong>
            <small>{item.meta}</small>
          </button>
        ))}
      </div>

      <article className="recent-project-card">
        <div className="recent-project-icon">
          <FileText size={18} />
        </div>
        <div>
          <span>Recent project</span>
          <h3>{recentActivity?.message ?? 'No recent activity yet'}</h3>
          <p>{recentActivity ? formatActivityTime(recentActivity.createdAt) : 'Start a new project or open Code.'}</p>
        </div>
      </article>

      <button className="premium-card" type="button" onClick={onViewTerms}>
        <ShieldCheck size={20} />
        <span>This site is for personal use and portfolio review.</span>
        <strong>View terms</strong>
      </button>
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

function CodeScreen({ workspace, settings, onCodeChange, onStackChange, onGenerate, onRunCode, onSelectFile }) {
  const lineCount = workspace.code.split('\n').length;
  const activeFile = workspace.files.find((file) => file.id === workspace.activeFileId) ?? workspace.files[0];
  const [assistOpen, setAssistOpen] = React.useState(false);

  const insertSnippet = (snippet) => {
    const separator = workspace.code.endsWith('\n') || !workspace.code ? '' : '\n\n';
    onCodeChange(`${workspace.code}${separator}${snippet}`);
    setAssistOpen(false);
  };

  return (
    <section className="screen code-screen">
      <div className="screen-title">
        <div>
          <p className="eyebrow">Code Mode</p>
          <h2>Editor</h2>
        </div>
        <button className="run-button" type="button" onClick={onRunCode}>
          <Play size={16} />
          Run
        </button>
      </div>
      <button className="smart-assist-button" type="button" onClick={() => setAssistOpen(true)}>
        <WandSparkles size={17} />
        Smart Assist
      </button>

      <div className="code-card">
        <div className="file-tabs" aria-label="Open files">
          {workspace.files.slice(0, 3).map((file) => (
            <button
              className={file.id === activeFile.id ? 'active' : ''}
              key={file.id}
              type="button"
              onClick={() => onSelectFile(file.id)}
            >
              {file.name}
            </button>
          ))}
        </div>

        <StackControls workspace={workspace} onStackChange={onStackChange} />

        <div className="focused-editor">
          <div className="line-gutter" aria-hidden="true">
            {Array.from({ length: Math.max(lineCount, 12) }, (_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>
          <textarea
            className={settings.lineWrap ? 'wrap-on' : 'wrap-off'}
            aria-label="Manual code editor"
            value={workspace.code}
            onChange={(event) => onCodeChange(event.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="editor-footer">
          <span>{getLanguage(workspace.language).label}</span>
          <span>{lineCount} lines</span>
          <span>{getFileSize(workspace.code)}</span>
        </div>
      </div>

      {assistOpen && (
        <SmartAssistSheet
          language={workspace.language}
          library={workspace.library}
          code={workspace.code}
          onClose={() => setAssistOpen(false)}
          onInsert={insertSnippet}
          onGenerate={onGenerate}
        />
      )}
    </section>
  );
}

function SmartAssistSheet({ language, library, code, onClose, onInsert, onGenerate }) {
  const snippets = getSmartSnippets(language, library);
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const askQuestion = (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setAnswer('Type a question, paste an error, or describe the code you want help with.');
      return;
    }

    setAnswer(buildSmartAssistResponse({ question: trimmed, language, library, code }));
  };

  const generateCode = async () => {
    const trimmed = question.trim();
    if (!trimmed) {
      setAnswer('Describe what you want generated first, then tap Generate code.');
      return;
    }

    setBusy(true);
    const result = await onGenerate(trimmed);
    setBusy(false);
    setAnswer(result.message);
  };

  return (
    <div className="assist-overlay" role="dialog" aria-modal="true" aria-labelledby="smart-assist-title">
      <button className="assist-backdrop" type="button" aria-label="Close Smart Assistance" onClick={onClose} />
      <div className="assist-sheet">
        <div className="checkout-handle" />
        <div className="assist-header">
          <div>
            <p className="eyebrow">Smart Assistance</p>
            <h2 id="smart-assist-title">Code help</h2>
          </div>
          <button className="checkout-close" type="button" aria-label="Close Smart Assistance" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="assist-grid">
          <article>
            <ShieldCheck size={18} />
            <strong>Syntax helper</strong>
            <p>{getLanguage(language).label} with {library}: check brackets, imports, names, and return values.</p>
          </article>
          <article>
            <Bug size={18} />
            <strong>Error explainer</strong>
            <p>Paste an error into the editor, then compare it against common syntax and runtime causes.</p>
          </article>
        </div>

        <form className="assist-question" onSubmit={askQuestion}>
          <label htmlFor="smart-assist-question">Ask Smart Assistance</label>
          <textarea
            id="smart-assist-question"
            value={question}
            onChange={(event) => {
              setAnswer('');
              setQuestion(event.target.value);
            }}
            placeholder="Ask a question, paste an error, or describe code to generate..."
          />
          <div className="assist-actions">
            <button type="submit">
              <MessageSquareText size={16} />
              Ask
            </button>
            <button type="button" onClick={generateCode} disabled={busy}>
              {busy ? <Sparkles size={16} /> : <Send size={16} />}
              Generate code
            </button>
          </div>
          {answer && (
            <div className="assist-answer">
              <Bot size={17} />
              <p>{answer}</p>
            </div>
          )}
        </form>

        <div className="snippet-library">
          <div className="section-heading">
            <h3>Snippet library</h3>
          </div>
          {snippets.map((snippet) => (
            <button key={snippet.title} type="button" onClick={() => onInsert(snippet.code)}>
              <div>
                <strong>{snippet.title}</strong>
                <span>{snippet.description}</span>
              </div>
              <FilePlus2 size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSmartSnippets(language, library) {
  if (language === 'python') {
    return [
      {
        title: 'Try / except',
        description: 'Handle an error cleanly',
        code: 'try:\n    result = build_project()\nexcept Exception as error:\n    print(f\"Build failed: {error}\")'
      },
      {
        title: 'Function starter',
        description: 'Reusable Python function',
        code: 'def run_task(input_value):\n    return {\"input\": input_value, \"status\": \"ready\"}'
      }
    ];
  }

  if (language === 'csharp') {
    return [
      {
        title: 'Async method',
        description: 'C# async starter',
        code: 'public async Task<string> LoadProjectAsync()\n{\n    await Task.Delay(100);\n    return "Project ready";\n}'
      },
      {
        title: 'Guard clause',
        description: 'Validate input early',
        code: 'if (string.IsNullOrWhiteSpace(projectName))\n{\n    throw new ArgumentException("Project name is required");\n}'
      }
    ];
  }

  return [
    {
      title: 'Component starter',
      description: 'Reusable UI component',
      code: 'function ProjectCard({ title }) {\n  return <article className="project-card">{title}</article>;\n}'
    },
    {
      title: 'Safe async action',
      description: 'Try/catch for app logic',
      code: 'async function runAction() {\n  try {\n    await saveProject();\n  } catch (error) {\n    console.error("Action failed", error);\n  }\n}'
    }
  ];
}

function buildSmartAssistResponse({ question, language, library, code }) {
  const normalized = question.toLowerCase();
  const languageLabel = getLanguage(language).label;
  const lineCount = code.split('\n').length;

  if (normalized.includes('error') || normalized.includes('bug') || normalized.includes('not working')) {
    return `For this ${languageLabel} / ${library} file, start by checking the exact error line, missing imports, mismatched brackets, and variable names. This file has ${lineCount} lines, so isolate the failing block, run it again, then paste the exact error here for a tighter explanation.`;
  }

  if (normalized.includes('syntax')) {
    return `${languageLabel} syntax help: keep the ${library} structure consistent, close every bracket/string, and make sure exported functions, class names, and imports match the file type. Use the snippets below when you want a clean starter block inserted.`;
  }

  if (normalized.includes('run') || normalized.includes('preview')) {
    return 'Tap Run to save the current editor state and open Preview. The preview is a mobile simulation right now; live execution for every language will need a hosted runner/sandbox service before launch.';
  }

  if (normalized.includes('database') || normalized.includes('payment') || normalized.includes('subscription')) {
    return 'For launch, users and paid access should be handled by the backend database and Stripe or PayPoint webhooks. The app already has API routes for accounts, checkout, workspaces, and API key storage; production needs the live environment variables and a Postgres database connected.';
  }

  return `I can help with this ${languageLabel} / ${library} file. For "${question}", decide whether you want an explanation or generated code. Use Ask for guidance, Generate code to replace the editor with a starter implementation, or Insert snippet to add a small reusable block.`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeScript(value = '') {
  return String(value).replace(/<\/script/gi, '<\\/script');
}

function cleanPreviewText(value = '') {
  return String(value)
    .replace(/{[^}]*}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsxTag(code, tagName) {
  const match = code.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return cleanPreviewText(match?.[1] ?? '');
}

function extractStringList(code) {
  const arrayMatch = code.match(/(?:const|let|var)\s+\w+\s*=\s*\[([\s\S]*?)\]/);
  if (!arrayMatch) {
    return [];
  }

  return Array.from(arrayMatch[1].matchAll(/["'`]([^"'`]+)["'`]/g))
    .map((match) => match[1].trim())
    .filter(Boolean)
    .slice(0, 6);
}

function stripModuleSyntax(code) {
  return code
    .replace(/^\s*import\s+.*$/gm, '')
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+(?=(function|const|let|var|class))/g, '');
}

function wrapPreviewDocument({ title, body, style = '', script = '' }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        color: #211538;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #fbfaff 0%, #f2eaff 100%);
      }
      button {
        border: 0;
        font: inherit;
      }
      .preview-shell {
        min-height: 100vh;
        display: grid;
        align-content: center;
        gap: 18px;
        padding: 18px;
      }
      .hero {
        display: grid;
        gap: 12px;
        padding: 20px;
        color: white;
        border-radius: 28px;
        background:
          radial-gradient(circle at 84% 12%, rgba(255, 255, 255, 0.4), transparent 30%),
          linear-gradient(145deg, #8b5cf6 0%, #6d28d9 52%, #2563eb 130%);
        box-shadow: 0 20px 50px rgba(76, 29, 149, 0.24);
      }
      .hero span,
      .eyebrow {
        color: rgba(255, 255, 255, 0.78);
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: uppercase;
      }
      h1, h2, h3, p {
        margin: 0;
      }
      h1 {
        font-size: clamp(2rem, 12vw, 3.25rem);
        line-height: 0.96;
      }
      p {
        color: rgba(255, 255, 255, 0.82);
        line-height: 1.5;
      }
      .feature-grid,
      ul {
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .feature-grid button,
      li,
      .card,
      pre {
        padding: 13px 14px;
        border: 1px solid rgba(124, 58, 237, 0.12);
        border-radius: 18px;
        color: #33234c;
        background: rgba(255, 255, 255, 0.88);
        box-shadow: 0 12px 28px rgba(76, 29, 149, 0.1);
        font-weight: 850;
      }
      pre {
        overflow: auto;
        white-space: pre-wrap;
        font: 0.78rem/1.55 "SFMono-Regular", Consolas, monospace;
      }
      #console-output {
        min-height: 76px;
        max-height: 180px;
        overflow: auto;
        padding: 12px;
        border-radius: 18px;
        color: #d8cff1;
        background: #171225;
        font: 0.74rem/1.5 "SFMono-Regular", Consolas, monospace;
      }
      #console-output:empty::before {
        content: "No console output yet.";
        color: #8b7aa8;
      }
      ${style}
    </style>
  </head>
  <body>
    ${body}
    ${script ? `<script>${safeScript(script)}</script>` : ''}
  </body>
</html>`;
}

function buildJsxVisualPreviewDoc(workspace) {
  const code = workspace.code;
  const title = extractJsxTag(code, 'h1') || workspace.projectName || workspace.lastPrompt || workspace.fileName;
  const kicker = extractJsxTag(code, 'span') || 'Live component preview';
  const description = extractJsxTag(code, 'p') || `${getLanguage(workspace.language).label} / ${workspace.library}`;
  const features = extractStringList(code);
  const featureItems = (features.length ? features : ['Smart Assistance', 'Manual coding', 'Preview'])
    .map((feature) => `<button>${escapeHtml(feature)}</button>`)
    .join('');

  return wrapPreviewDocument({
    title,
    body: `<main class="preview-shell">
      <section class="hero">
        <span>${escapeHtml(kicker)}</span>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </section>
      <div class="feature-grid">${featureItems}</div>
    </main>`
  });
}

function buildHtmlPreviewDoc(workspace) {
  const code = workspace.code.trim();
  if (/<!doctype|<html[\s>]/i.test(code)) {
    return code;
  }

  return wrapPreviewDocument({
    title: workspace.fileName,
    body: `<main class="preview-shell">${code || '<section class="hero"><h1>Blank HTML preview</h1><p>Start typing HTML in Code Mode.</p></section>'}</main>`
  });
}

function buildCssPreviewDoc(workspace) {
  return wrapPreviewDocument({
    title: workspace.fileName,
    style: workspace.code,
    body: `<main class="app-shell preview-shell">
      <section class="hero">
        <span>CSS applied live</span>
        <h1>${escapeHtml(workspace.projectName || 'Design preview')}</h1>
        <p>Your stylesheet is applied to this sample app surface.</p>
        <button>Primary action</button>
      </section>
    </main>`
  });
}

function buildJavaScriptPreviewDoc(workspace) {
  const code = stripModuleSyntax(workspace.code);
  const script = `
const output = document.getElementById("console-output");
const write = (type, values) => {
  const line = document.createElement("div");
  line.textContent = "[" + type + "] " + values.map((value) => {
    if (typeof value === "string") return value;
    try { return JSON.stringify(value); } catch { return String(value); }
  }).join(" ");
  output.appendChild(line);
};
["log", "info", "warn", "error"].forEach((type) => {
  const original = console[type].bind(console);
  console[type] = (...values) => {
    write(type, values);
    original(...values);
  };
});
window.addEventListener("error", (event) => write("error", [event.message]));
try {
${code}
} catch (error) {
  write("error", [error.message]);
}`;

  return wrapPreviewDocument({
    title: workspace.fileName,
    body: `<main class="preview-shell">
      <div id="app" class="card">JavaScript preview target</div>
      <div id="console-output"></div>
    </main>`,
    script
  });
}

function renderMarkdown(code) {
  const lines = code.split('\n');
  const output = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      output.push(`<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
      listItems = [];
    }
  };

  lines.forEach((line) => {
    if (/^-\s+/.test(line)) {
      listItems.push(line.replace(/^-\s+/, ''));
      return;
    }

    flushList();
    if (/^###\s+/.test(line)) {
      output.push(`<h3>${escapeHtml(line.replace(/^###\s+/, ''))}</h3>`);
    } else if (/^##\s+/.test(line)) {
      output.push(`<h2>${escapeHtml(line.replace(/^##\s+/, ''))}</h2>`);
    } else if (/^#\s+/.test(line)) {
      output.push(`<h1>${escapeHtml(line.replace(/^#\s+/, ''))}</h1>`);
    } else if (line.trim()) {
      output.push(`<p>${escapeHtml(line)}</p>`);
    }
  });
  flushList();

  return output.join('\n');
}

function buildDocumentPreviewDoc(workspace) {
  if (workspace.language === 'markdown') {
    return wrapPreviewDocument({
      title: workspace.fileName,
      body: `<main class="preview-shell markdown-preview">${renderMarkdown(workspace.code)}</main>`,
      style: `.markdown-preview { align-content: start; } .markdown-preview h1 { color: #211538; } .markdown-preview h2, .markdown-preview h3 { color: #33234c; } .markdown-preview p { color: #6d5f8d; }`
    });
  }

  if (workspace.language === 'json') {
    let formatted = workspace.code;
    try {
      formatted = JSON.stringify(JSON.parse(workspace.code), null, 2);
    } catch {
      formatted = workspace.code;
    }

    return wrapPreviewDocument({
      title: workspace.fileName,
      body: `<main class="preview-shell"><pre>${escapeHtml(formatted)}</pre></main>`
    });
  }

  return '';
}

function extractRoutes(code) {
  const routePatterns = [
    /@app\.(get|post|put|delete)\(["']([^"']+)["']\)/gi,
    /app\.(get|post|put|delete)\(["']([^"']+)["']/gi,
    /Map(Get|Post|Put|Delete)\(["']([^"']+)["']/gi,
    /Route::(get|post|put|delete)\(["']([^"']+)["']/gi
  ];
  const routes = [];

  routePatterns.forEach((pattern) => {
    for (const match of code.matchAll(pattern)) {
      routes.push(`${match[1].toUpperCase()} ${match[2]}`);
    }
  });

  return [...new Set(routes)].slice(0, 5);
}

function extractNamedValue(code, names) {
  for (const name of names) {
    const match = code.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
    if (match) {
      return match[1];
    }
  }

  const quoted = code.match(/project["']?\s*[:=]\s*["']([^"']+)["']/i);
  return quoted?.[1] ?? '';
}

function buildTextOutputPreview(workspace) {
  const languageLabel = getLanguage(workspace.language).label;
  const routes = extractRoutes(workspace.code);
  const projectName = extractNamedValue(workspace.code, ['project', 'ProjectName', 'projectName']) || workspace.projectName || workspace.lastPrompt || workspace.fileName;

  if (routes.length) {
    return {
      mode: 'API output',
      title: `${workspace.library} routes`,
      lines: [
        `200 OK ${routes[0]}`,
        JSON.stringify({ project: projectName, status: 'ready', builtFrom: 'Code On The Go' }, null, 2)
      ],
      meta: routes
    };
  }

  if (workspace.language === 'sql') {
    return {
      mode: 'Query preview',
      title: 'SQL result',
      lines: ['id | name | status', `1  | ${projectName} | ready`],
      meta: ['Table: projects', 'Rows: 1']
    };
  }

  return {
    mode: 'Console output',
    title: `${languageLabel} run preview`,
    lines: [`Code On The Go project: ${projectName}`, '- plan', '- code', '- test', '- ship'],
    meta: [`${workspace.library}`, 'Hosted execution runner required for live compiled/script execution.']
  };
}

function buildPreviewModel(workspace) {
  const hasJsx = /<[A-Za-z][\s\S]*>/.test(workspace.code) && /return\s*\(/.test(workspace.code);
  const isPlainBrowserScript = ['Vanilla JS', 'Vanilla TS'].includes(workspace.library) || /document\.|querySelector|innerHTML|getElementById/.test(workspace.code);

  if (workspace.language === 'html') {
    return {
      mode: 'Live HTML',
      status: 'Rendered',
      srcDoc: buildHtmlPreviewDoc(workspace)
    };
  }

  if (workspace.language === 'css') {
    return {
      mode: 'Live CSS',
      status: 'Applied',
      srcDoc: buildCssPreviewDoc(workspace)
    };
  }

  if (['javascript', 'typescript'].includes(workspace.language)) {
    if (hasJsx) {
      return {
        mode: 'Component output',
        status: 'Rendered',
        srcDoc: buildJsxVisualPreviewDoc(workspace)
      };
    }

    if (isPlainBrowserScript) {
      return {
        mode: 'Live JavaScript',
        status: 'Running',
        srcDoc: buildJavaScriptPreviewDoc(workspace)
      };
    }
  }

  if (['markdown', 'json'].includes(workspace.language)) {
    return {
      mode: `${getLanguage(workspace.language).label} output`,
      status: 'Rendered',
      srcDoc: buildDocumentPreviewDoc(workspace)
    };
  }

  return {
    status: 'Output',
    ...buildTextOutputPreview(workspace)
  };
}

function PreviewScreen({ workspace }) {
  const runStatus = workspace.lastRunAt ? `Last run ${formatActivityTime(workspace.lastRunAt)}` : 'Not run yet';
  const preview = buildPreviewModel(workspace);

  return (
    <section className="screen preview-screen">
      <div className="screen-title centered-title">
        <div>
          <p className="eyebrow">Preview Mode</p>
          <h2>Live Output</h2>
        </div>
      </div>

      <div className="preview-stage">
        <div className="preview-phone live-preview-phone">
          <div className="preview-statusbar">
            <span>9:41</span>
            <span>{preview.status}</span>
          </div>
          <div className="preview-toolbar">
            <span>{preview.mode}</span>
            <strong>{workspace.fileName}</strong>
          </div>
          {preview.srcDoc ? (
            <iframe
              className="preview-frame"
              title={`${workspace.fileName} output`}
              sandbox="allow-scripts allow-forms"
              srcDoc={preview.srcDoc}
            />
          ) : (
            <div className="preview-output-card">
              <span>{preview.mode}</span>
              <h3>{preview.title}</h3>
              <pre>{preview.lines.join('\n')}</pre>
              <div className="preview-meta-list">
                {preview.meta.map((item) => (
                  <small key={item}>{item}</small>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <article className="preview-run-card">
        <div>
          <span>{getLanguage(workspace.language).label} / {workspace.library}</span>
          <strong>{runStatus}</strong>
        </div>
        <p>{preview.srcDoc ? 'This preview is rendered inside the phone frame from your current code.' : 'This output panel reads your code and shows the expected run result. Full server-side execution for this language needs a secure hosted runner.'}</p>
      </article>
    </section>
  );
}

function FilesScreen({ workspace, onOpenFile, onCreateFile }) {
  const [query, setQuery] = React.useState('');
  const filteredFiles = workspace.files.filter((file) =>
    `${file.name} ${file.type}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="screen files-screen">
      <div className="screen-title">
        <div>
          <p className="eyebrow">Files</p>
          <h2>Project files</h2>
        </div>
        <button className="new-file-button" type="button" onClick={onCreateFile}>
          <FilePlus2 size={17} />
          New
        </button>
      </div>

      <label className="file-search">
        <Search size={18} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search files"
          aria-label="Search files"
        />
      </label>

      <div className="file-list">
        {filteredFiles.map((file) => (
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

      {filteredFiles.length === 0 && (
        <div className="empty-files">
          <FileText size={20} />
          <span>No files found</span>
        </div>
      )}
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
