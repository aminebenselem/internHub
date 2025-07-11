import { useState } from 'react'
import { AdminDashboard } from './pages/AdminDashboard'
import { InternDashboard } from './pages/InternDashboard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <InternDashboard/>
    </>
  )
}

export default App
