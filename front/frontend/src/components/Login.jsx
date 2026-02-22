import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication (in real app, this would be an API call)
    setTimeout(() => {
      // Simple validation for demo
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // Store authentication token
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          username: credentials.username,
          role: 'Security Administrator',
          loginTime: new Date().toISOString()
        }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'}}>
      <div className="card border-0 shadow-lg" style={{width: '450px', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
        <div className="card-body p-5">
          {/* Logo and Title */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white" style={{width: '80px', height: '80px'}}>
                <i className="bi bi-shield-lock-fill" style={{fontSize: '40px'}}></i>
              </div>
            </div>
            <h3 className="fw-bold mb-2" style={{color: '#2c3e50'}}>Security Console</h3>
            <p className="text-muted mb-4">Please login to access your account</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="form-label fw-semibold" style={{color: '#2c3e50'}}>Username</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person-fill text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 border-end-0"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  style={{borderLeft: 'none'}}
                />
                <span className="input-group-text bg-light border-start-0">
                  <i className="bi bi-check-circle-fill text-success"></i>
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold" style={{color: '#2c3e50'}}>Password</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock-fill text-muted"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 border-end-0"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{borderLeft: 'none'}}
                />
                <span className="input-group-text bg-light border-start-0">
                  <i className="bi bi-eye-slash-fill text-muted"></i>
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember" style={{color: '#6c757d'}}>
                  Remember me
                </label>
              </div>
              <a href="#" className="text-decoration-none" style={{color: '#007bff'}}>Forgot password?</a>
            </div>
            
            <div className="d-grid gap-3">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={isLoading}
                style={{borderRadius: '8px', backgroundColor: '#007bff', borderColor: '#007bff'}}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <small className="text-muted">
              Demo: <strong>admin / admin123</strong>
            </small>
          </div>

          <div className="text-center mt-3">
            <small style={{color: '#6c757d'}}>
              Don't have an account? <a href="#" className="text-decoration-none" style={{color: '#007bff'}}>Sign up</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
