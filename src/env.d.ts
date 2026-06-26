/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BAIDU_API_KEY?: string
  readonly VITE_BAIDU_SECRET_KEY?: string
  readonly VITE_LLM_API_KEY?: string
  readonly VITE_LLM_ENDPOINT?: string
  readonly VITE_LLM_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
