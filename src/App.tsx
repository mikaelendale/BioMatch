import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import { ThemeProvider } from './components/theme-provider'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
])

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
