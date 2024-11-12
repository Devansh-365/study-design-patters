import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function createPattern(patternName: string) {
  const patternDir = path.join(__dirname, "../patterns", patternName);

  // Create pattern directory
  fs.mkdirSync(patternDir, { recursive: true });

  // Create package.json
  const packageJson = {
    name: `@design-patterns/${patternName}`,
    version: "0.0.1",
    private: true,
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      test: "vitest",
      preview: "vite preview",
      lint: "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "type-check": "tsc --noEmit",
    },
    dependencies: {
      react: "workspace:*",
      "react-dom": "workspace:*",
    },
    devDependencies: {
      "@types/react": "workspace:*",
      "@types/react-dom": "workspace:*",
      typescript: "workspace:*",
      "@vitejs/plugin-react": "workspace:*",
      tailwindcss: "workspace:*",
      vitest: "workspace:*",
    },
  };

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
      },
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }],
  };

  // Create tsconfig.node.json
  const tsConfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: "ESNext",
      moduleResolution: "bundler",
      allowSyntheticDefaultImports: true,
    },
    include: ["vite.config.ts"],
  };

  // Enhanced Vite config
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true // automatically open browser
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts']
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
`;

  // Create setupTests.ts
  const setupTests = `
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
`;

  // Write configuration files
  fs.writeFileSync(
    path.join(patternDir, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );
  fs.writeFileSync(
    path.join(patternDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2),
  );
  fs.writeFileSync(
    path.join(patternDir, "tsconfig.node.json"),
    JSON.stringify(tsConfigNode, null, 2),
  );
  fs.writeFileSync(path.join(patternDir, "vite.config.ts"), viteConfig);

  // Create source directory structure with additional folders
  const srcDir = path.join(patternDir, "src");
  const directories = [
    "components",
    "hooks",
    "utils",
    "types",
    "constants",
    "tests",
    "assets",
  ];

  directories.forEach((dir) => {
    fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
  });

  // Rest of your existing file creation code...
  // (Your current HTML, TSX, and CSS file creation code remains the same)

  // Create test example
  const exampleTest = `
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders pattern title', () => {
    render(<App />);
    expect(screen.getByText('${patternName} Pattern')).toBeInTheDocument();
  });
});
`;

  // Create example pattern implementation
  const patternImplementation = `
// Example Singleton implementation
export class ${patternName}Manager {
  private static instance: ${patternName}Manager;
  private constructor() {}

  public static getInstance(): ${patternName}Manager {
    if (!${patternName}Manager.instance) {
      ${patternName}Manager.instance = new ${patternName}Manager();
    }
    return ${patternName}Manager.instance;
  }

  // Add your pattern-specific methods here
}
`;

  fs.writeFileSync(path.join(srcDir, "tests/App.test.tsx"), exampleTest);
  fs.writeFileSync(
    path.join(srcDir, `${patternName.toLowerCase()}.ts`),
    patternImplementation,
  );
  fs.writeFileSync(path.join(srcDir, "setupTests.ts"), setupTests);

  console.log(`Created ${patternName} pattern project`);

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

  // Install dependencies
  try {
    console.log("Installing dependencies...");
    execSync("bun install", { cwd: patternDir, stdio: "inherit" });
  } catch (error) {
    console.error("Error installing dependencies:", error);
  }
}

const patternName = process.argv[2];
if (!patternName) {
  console.error("Please provide a pattern name");
  process.exit(1);
}
createPattern(patternName);
