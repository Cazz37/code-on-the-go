export function generateLocalCode({ prompt, language, library }) {
  const title = (prompt || 'Code On The Go project').replace(/["`]/g, "'");

  if (language === 'python') {
    return `def main():
    project = "${title}"
    stack = "${library}"
    print({"project": project, "stack": stack, "status": "ready"})

if __name__ == "__main__":
    main()`;
  }

  if (language === 'csharp') {
    return `using System;

Console.WriteLine("Code On The Go");
Console.WriteLine("Project: ${title}");
Console.WriteLine("Stack: ${library}");`;
  }

  if (language === 'cpp') {
    return `#include <iostream>

int main() {
    std::cout << "Code On The Go: ${title}\\n";
    std::cout << "Stack: ${library}\\n";
    return 0;
}`;
  }

  if (language === 'vbscript') {
    return `WScript.Echo "Code On The Go"
WScript.Echo "Project: ${title}"
WScript.Echo "Stack: ${library}"`;
  }

  if (language === 'sql') {
    return `CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stack TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (name, stack) VALUES ('${title}', '${library}');`;
  }

  if (language === 'html') {
    return `<!doctype html>
<html>
  <head><title>${title}</title></head>
  <body>
    <main>
      <h1>${title}</h1>
      <p>Built with ${library} in Code On The Go.</p>
    </main>
  </body>
</html>`;
  }

  return `export function AppPreview() {
  return (
    <main className="mobile-app">
      <h1>${title}</h1>
      <p>Generated for ${library}.</p>
    </main>
  );
}`;
}
