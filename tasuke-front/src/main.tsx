import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@/api/interceptor.ts"
import AuthProvider from "@/context/AuthProvider.tsx";
import {queryClient} from "@/lib/query-client.ts";
import {QueryClientProvider} from "@tanstack/react-query";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <App />
      </AuthProvider>
          </QueryClientProvider>
  </StrictMode>,
)
