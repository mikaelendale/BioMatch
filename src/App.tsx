import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import { ThemeProvider } from './components/theme-provider'
import LandingPage from './Landing'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/app', element: <Home /> },
])

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
