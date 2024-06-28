import { ThemeProvider } from '@/components/theme-provider'
import AuthProvider from "@/provider/authProvider";
import Routes from '@/routes/routes';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
