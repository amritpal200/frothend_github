import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/dashboard')
      const data = await response.json()
      if (data.success) {
        setCompanies(data.companies)
      }
    } catch (err) {
      console.error('Error fetching companies:', err)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleCompanyClick = (companyName) => {
    navigate(`/company/${companyName}`)
  }

  const handleNewCompanyClick = async () => {
    const name = prompt('Enter the new company name:')
    if (!name) return

    const userId = localStorage.getItem('userId') // stored during login

    try {
        const response = await fetch('https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, user_id: userId })
        })
        const data = await response.json()
        if (data.success) {
        alert('Company created!')
        fetchCompanies()
        } else {
        alert('Failed to create company: ' + data.message)
        }
    } catch (err) {
        console.error(err)
        alert('Error creating company')
    }
  }

  return (
    <div className="dashboard-container">
      <h1>Translator Dashboard</h1>

      <div className="dashboard-header">
        <h2>Client Companies</h2>
        <button className="new-company-btn" onClick={handleNewCompanyClick}>+ New Company</button>
      </div>

      <div className="company-grid">
        {companies.map((company, idx) => (
          <div
            key={idx}
            className="company-square"
            onClick={() => handleCompanyClick(company.name)}
          >
            <h3>{company.name}</h3>
            <p>📁 {company.files} Documents</p>
            <p>🧠 {company.models} Models</p>
          </div>
        ))}
      </div>

      <section className="dashboard-section">
        <h2>Recent Activity</h2>
        <ul className="activity-list">
          {recentActivities.map((activity, idx) => (
            <li key={idx}>{activity}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Dashboard
