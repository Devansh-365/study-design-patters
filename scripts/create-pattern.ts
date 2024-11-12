import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function createPattern(patternName: string) {
  const patternDir = path.join(__dirname, "../patterns", patternName);

  fs.mkdirSync(patternDir, { recursive: true });

  const packageJson = {
    name: `@design-patterns/${patternName}`,
    version: "0.0.1",
    private: true,
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      test: "vitest",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
  };

  fs.writeFileSync(
    path.join(patternDir, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );

  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});
`;

  fs.writeFileSync(path.join(patternDir, "vite.config.ts"), viteConfig);

  const srcDir = path.join(patternDir, "src");
  fs.mkdirSync(srcDir);
  fs.mkdirSync(path.join(srcDir, "components"));
  fs.mkdirSync(path.join(srcDir, "hooks"));
  fs.mkdirSync(path.join(srcDir, "utils"));

  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${patternName} Pattern</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const mainTsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  const appTsx = `
import React from 'react'

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">
        ${patternName} Pattern
      </h1>
    </div>
  )
}

export default App
`;

  const indexCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  fs.writeFileSync(path.join(patternDir, "index.html"), indexHtml);
  fs.writeFileSync(path.join(srcDir, "main.tsx"), mainTsx);
  fs.writeFileSync(path.join(srcDir, "App.tsx"), appTsx);
  fs.writeFileSync(path.join(srcDir, "index.css"), indexCss);

  // Create Tailwind config
  const tailwindConfig = `
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

  fs.writeFileSync(path.join(patternDir, "tailwind.config.js"), tailwindConfig);

  const readme = `
# ${patternName} Pattern

## Overview
Describe the ${patternName} pattern and its use cases here.

## Implementation
Explain how the pattern is implemented in this example.

## Running the project
\`\`\`bash
npm install
npm run dev
\`\`\`
`;

  fs.writeFileSync(path.join(patternDir, "README.md"), readme);

  console.log(`Created ${patternName} pattern project`);

  try {
    console.log("Installing dependencies...");
    execSync("npm install", { cwd: patternDir, stdio: "inherit" });
  } catch (error) {
    console.error("Error installing dependencies:", error);
  }

  // Update root package.json scripts
  try {
    const rootPackageJsonPath = path.join(__dirname, "../package.json");
    const rootPackageJson = JSON.parse(
      fs.readFileSync(rootPackageJsonPath, "utf-8"),
    );

    rootPackageJson.scripts[`dev:${patternName.toLowerCase()}`] =
      `npm run --cwd patterns/${patternName} dev`;
    rootPackageJson.scripts[`build:${patternName.toLowerCase()}`] =
      `npm run --cwd patterns/${patternName} build`;
    rootPackageJson.scripts[`test:${patternName.toLowerCase()}`] =
      `npm run --cwd patterns/${patternName} test`;

    fs.writeFileSync(
      rootPackageJsonPath,
      JSON.stringify(rootPackageJson, null, 2),
    );
  } catch (error) {
    console.error("Error updating root package.json:", error);
  }
}

// Get pattern name from command line arguments
const patternName = process.argv[2];

if (!patternName) {
  console.error("Please provide a pattern name");
  process.exit(1);
}

createPattern(patternName);
