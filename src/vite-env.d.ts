
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_PRIVATE_KEY: string;
  readonly VITE_MUMBAI_RPC_URL: string;
  readonly VITE_POLYGON_RPC_URL: string;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
