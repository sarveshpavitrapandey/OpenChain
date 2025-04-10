import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define environment variables for client-side code
    define: {
      'import.meta.env.VITE_PRIVATE_KEY': JSON.stringify(env.PRIVATE_KEY || ''),
      'import.meta.env.VITE_MUMBAI_RPC_URL': JSON.stringify(env.MUMBAI_RPC_URL || ''),
      'import.meta.env.VITE_POLYGON_RPC_URL': JSON.stringify(env.POLYGON_RPC_URL || ''),
    }
  };
});