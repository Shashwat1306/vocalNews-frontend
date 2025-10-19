import { useState } from 'react'
import './App.css'
import Header from './shared/components/header.jsx'
import AppRoutes from './shared/routes/AppRoutes.jsx'

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <AppRoutes />
    </div>
  )
}

export default App
