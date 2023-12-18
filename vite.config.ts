import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.OPEN_AI_KEY': JSON.stringify(env.OPEN_AI_KEY)
    },
    plugins: [react()],
    base: '/gpt-1/'
  }
})
