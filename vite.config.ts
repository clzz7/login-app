import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Expõe na rede local
    port: 5173, // Porta padrão
  },
  build: {
    // Otimizações para reduzir o tamanho do bundle
    rollupOptions: {
      output: {
        // Code splitting manual para melhor controle
        manualChunks: {
          // Separar vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['@chakra-ui/react', '@radix-ui/react-separator', '@radix-ui/react-slot'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // Minificação e otimização
    minify: 'esbuild',
    // Limite de aviso para tamanho de chunk (em KB)
    chunkSizeWarningLimit: 1000,
    // Source maps apenas em desenvolvimento
    sourcemap: false,
  },
  // Otimização de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
})
