import React, { useState } from "react";
import API from "../services/Api";
import axios from "axios";

function LoginMonitor() {
  const [data, setData] = useState({
    username: "",
    country: "",
    failedAttempts: 0,
    loginTime: "",
    ipAddress: "",
    device: "",
    browser: ""
  });

  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  const checkLogin = async () => {
    if (!data.username.trim()) {
      alert("Please enter a username");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await API.post("/api/login-check", data);
      setResult(response.data);
      
      // Add to history
      setHistory(prev => [{
        ...data,
        result: response.data,
        timestamp: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]); // Keep last 5 entries

    } catch (error) {
      console.error(error);
      alert("Backend connection failed! Please check if the server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (level) => {
    switch(level?.toUpperCase()) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  };

  const getRiskLevelIcon = (level) => {
    switch(level?.toUpperCase()) {
      case 'HIGH': return 'bi-exclamation-triangle-fill';
      case 'MEDIUM': return 'bi-exclamation-circle-fill';
      case 'LOW': return 'bi-check-circle-fill';
      default: return 'bi-question-circle-fill';
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  const resetForm = () => {
    setData({
      username: "",
      country: "",
      failedAttempts: 0,
      loginTime: "",
      ipAddress: "",
      device: "",
      browser: ""
    });
    setResult(null);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-warning text-dark">
              <h4 className="mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Login Anomaly Detector
              </h4>
              <small className="opacity-75">Advanced Login Behavior Analysis System</small>
            </div>
            
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter username"
                      value={data.username}
                      onChange={(e) => setData({ ...data, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Country</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <select
                      className="form-select"
                      value={data.country}
                      onChange={(e) => setData({ ...data, country: e.target.value })}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CN">China</option>
                      <option value="RU">Russia</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                      <option value="PK">Pakistan</option>
                      <option value="IR">Iran</option>
                      <option value="KP">North Korea</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Failed Attempts</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-x-circle"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Number of failed attempts"
                      min="0"
                      max="100"
                      value={data.failedAttempts}
                      onChange={(e) =>
                        setData({ ...data, failedAttempts: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Login Time</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-clock"></i>
                    </span>
                    <input
                      type="time"
                      className="form-control"
                      value={data.loginTime}
                      onChange={(e) => setData({ ...data, loginTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">IP Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-wifi"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="192.168.1.1"
                      value={data.ipAddress}
                      onChange={(e) => setData({ ...data, ipAddress: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Device/Browser</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-laptop"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Chrome, Firefox, Safari..."
                      value={data.device}
                      onChange={(e) => setData({ ...data, device: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-warning flex-grow-1"
                  onClick={checkLogin}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Analyze Login
                    </>
                  )}
                </button>
                
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  disabled={isAnalyzing}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Reset
                </button>
              </div>

              {result && (
                <div className="mt-4">
                  <h5 className="mb-3">Anomaly Analysis Results</h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className={`card border-0 bg-${getRiskLevelColor(result.riskLevel)} bg-opacity-10`}>
                        <div className="card-body text-center">
                          <i className={`bi ${getRiskLevelIcon(result.riskLevel)} fs-2 text-${getRiskLevelColor(result.riskLevel)}`}></i>
                          <h6 className="mt-2 mb-1">Risk Level</h6>
                          <span className={`badge bg-${getRiskLevelColor(result.riskLevel)} fs-6`}>
                            {result.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-1">Anomaly Score</h6>
                          <div className="fs-4 fw-bold">{result.anomalyScore}/100</div>
                          <div className="progress mt-2" style={{height: '8px'}}>
                            <div 
                              className={`progress-bar bg-${getRiskLevelColor(result.riskLevel)}`}
                              style={{width: `${result.anomalyScore}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.reason && (
                    <div className="alert alert-warning mt-3">
                      <h6><i className="bi bi-exclamation-triangle me-2"></i>Detection Reasons</h6>
                      <p className="mb-0">{result.reason}</p>
                    </div>
                  )}

                  <div className="alert alert-info mt-3">
                    <h6><i className="bi bi-info-circle me-2"></i>Security Recommendations</h6>
                    <ul className="mb-0">
                      {result.riskLevel === 'HIGH' && (
                        <>
                          <li>Require additional authentication factors (2FA/MFA)</li>
                          <li>Block the IP address temporarily</li>
                          <li>Notify security team immediately</li>
                          <li>Review recent account activity</li>
                        </>
                      )}
                      {result.riskLevel === 'MEDIUM' && (
                        <>
                          <li>Implement additional verification steps</li>
                          <li>Monitor subsequent login attempts</li>
                          <li>Consider email notification to user</li>
                          <li>Review geolocation patterns</li>
                        </>
                      )}
                      {result.riskLevel === 'LOW' && (
                        <>
                          <li>Continue normal monitoring</li>
                          <li>Log the attempt for future analysis</li>
                          <li>Maintain standard security protocols</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-secondary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Analysis History</h6>
                {history.length > 0 && (
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={clearHistory}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {history.length === 0 ? (
                <p className="text-muted text-center">No analysis history yet</p>
              ) : (
                <div className="list-group list-group-flush">
                  {history.map((item, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <small className="text-muted d-block">{item.timestamp}</small>
                          <div className="fw-bold">{item.username}</div>
                          <small className="text-muted d-block">
                            {item.country} • {item.failedAttempts} failed attempts
                          </small>
                        </div>
                        <span className={`badge bg-${getRiskLevelColor(item.result.riskLevel)}`}>
                          {item.result.riskLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-lg border-0 mt-3">
            <div className="card-header bg-dark text-white">
              <h6 className="mb-0">Risk Factors</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Failed Attempts > 3</span>
                    <span className="badge bg-warning">+40 points</span>
                  </div>
                </div>
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Unusual Time (0-6, 23-24)</span>
                    <span className="badge bg-warning">+30 points</span>
                  </div>
                </div>
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Suspicious Country</span>
                    <span className="badge bg-info">+20 points</span>
                  </div>
                </div>
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>New IP Address</span>
                    <span className="badge bg-info">+15 points</span>
                  </div>
                </div>
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Unknown Device</span>
                    <span className="badge bg-secondary">+10 points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginMonitor;
