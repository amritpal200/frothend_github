import React, { useState } from 'react'
import './Login.css'
import logo from '../assets/logo.JPG'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        // Optionally store user in state or context
        localStorage.setItem('userId', data.user.id)
        navigate('/dashboard')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Server error')
    }
  }

  return (
    <div className="login-container">
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="logo-large" />
      </div>
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
