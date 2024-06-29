import { ThemeProvider } from '@/components/theme-provider'
import AuthProvider from "@/provider/authProvider";
import Routes from '@/routes/routes';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
