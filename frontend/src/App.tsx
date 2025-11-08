import './App.css'
import { Routes, Route } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'

import { NavBar } from './components/NavBar'
import { ThemeProvider } from './components/theme_provider'

import Home from './pages/Home'
import Event from './pages/Event'
import Events from './pages/Events'
import List from './pages/List'
import CheckIn from './pages/CheckIn'
import Enter from './pages/Enter'
import Exit from './pages/Exit'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className="flex flex-col">
        <NavBar />
      </div>

      <Toaster position="top-center" />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/events' element={<Events />} />
        <Route path='/event/:id' element={<Event />} />
        <Route path='/list' element={<List />} />
        <Route path='/check-in' element={<CheckIn />} />
        <Route path='/enter' element={<Enter />} />
        <Route path='/exit' element={<Exit />} />
        <Route path='/login' element={<Login />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
