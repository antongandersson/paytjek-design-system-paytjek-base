import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 5173,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Explicitly define environment variables - use loadEnv to ensure they're available
    define: {
      'import.meta.env.VITE_LIGHTRAG_URL': JSON.stringify(env.VITE_LIGHTRAG_URL || 'http://localhost:8093'),
      'import.meta.env.VITE_LIGHTRAG_API_KEY': JSON.stringify(env.VITE_LIGHTRAG_API_KEY || ''),
    },
  };
});
