import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompanyDetails from './pages/CompanyDetails'
import ModelDetails from './pages/ModelDetails'
import ReviewDocument from './pages/ReviewDocument'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/company/:name" element={<CompanyDetails />} />
        <Route path="/company/:company/model/:model" element={<ModelDetails />} />
        <Route path="/company/:company/model/:model/document/:docId" element={<ReviewDocument />} />
      </Routes>
    </Router>
  )
}

export default App
