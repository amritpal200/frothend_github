// import React, { useState } from 'react'
// import './Login.css'
// import logo from '../assets/logo.JPG'
// import { useNavigate } from 'react-router-dom'

// function Login() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     console.log('Submitting login form...');
//     console.log('Email:', email);
//     console.log('Password:', password);

//     // https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend
//     // https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/api/login
//     try { 
//       const response = await fetch('https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       })

//       console.log('Response received:', response);

//       // const data = await response.json()

//       // console.log('Raw response json:', data);

//       const rawData = await response.json();
//       console.log('Raw response json:', rawData);

//       let data;
//       try {
//         data = typeof rawData.body === 'string' ? JSON.parse(rawData.body) : rawData.body;
//         console.log('Final parsed login data:', data);
//       } catch (err) {
//         console.error('Failed to parse body:', err);
//         setError('Invalid server response');
//         return;
//       }

//       if (data.success) {
//         // Optionally store user in state or context
//         localStorage.setItem('userId', data.user.id)
//         console.log('navigating to dashboard');
//         navigate('/dashboard')
//         console.log('Login successful, user ID:', data.user.id);
//       } else {
//         setError(data.message)
//       }
//     } catch (err) {
//       console.error('Login error:', err); 
//       setError('Server error')
//       setError(err)
//     }
//   }

//   return (
//     <div className="login-container">
//       <div className="logo-wrapper">
//         <img src={logo} alt="Logo" className="logo-large" />
//       </div>
//       <div className="login-card">
//         <h2>Welcome Back</h2>
//         <form className="login-form" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Log In</button>
//           {error && <p className="error-msg">{error}</p>}
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Login




import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.JPG';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');                         // clear previous error

    try {
      const response = await fetch(
        'https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log('Parsed login data:', data);

      if (response.ok && data.success) {
        localStorage.setItem('userId', data.user.id);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error');
    }
  };

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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
