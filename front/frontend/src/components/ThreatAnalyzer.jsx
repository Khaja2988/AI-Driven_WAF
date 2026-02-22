import React, { useState } from "react";
import API from "../services/Api";
import axios from "axios";

function ThreatAnalyzer() {
  const [payload, setPayload] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  const analyzeThreat = async () => {
    if (!payload.trim()) {
      alert("Please enter a payload to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await API.post("/api/analyze", {
        payload: payload
      });

      setResult(response.data);
      
      // Add to history
      setHistory(prev => [{
        payload: payload.substring(0, 50) + (payload.length > 50 ? "..." : ""),
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

  const getRiskLevelColor = (score) => {
    if (score >= 80) return 'danger';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'info';
    return 'success';
  };

  const getRiskLevelText = (score) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const clearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-shield-exclamation-triangle me-2"></i>
                Threat Analyzer
              </h4>
              <small className="opacity-75">Advanced Security Threat Detection System</small>
            </div>
            
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Input Payload</label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Enter HTTP request payload, SQL query, or any suspicious input..."
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  style={{fontFamily: 'monospace'}}
                ></textarea>
                <small className="text-muted">
                  Examples: "SELECT * FROM users WHERE id=1 OR 1=1", "&lt;script&gt;alert('XSS')&lt;/script&gt;"
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={analyzeThreat}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Analyze Threat
                    </>
                  )}
                </button>
                
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setPayload("")}
                  disabled={isAnalyzing}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Clear
                </button>
              </div>

              {result && (
                <div className="mt-4">
                  <h5 className="mb-3">Analysis Results</h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className={`card border-0 bg-${getRiskLevelColor(result.riskScore)} bg-opacity-10`}>
                        <div className="card-body">
                          <h6 className="text-muted mb-1">Risk Level</h6>
                          <div className="d-flex align-items-center">
                            <span className={`badge bg-${getRiskLevelColor(result.riskScore)} me-2`}>
                              {getRiskLevelText(result.riskScore)}
                            </span>
                            <span className="fw-bold">{result.riskScore}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="text-muted mb-1">Attack Type</h6>
                          <div className="fw-bold text-danger">{result.attackType}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="text-muted mb-1">Confidence</h6>
                          <div className="fw-bold">{(result.confidence * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="text-muted mb-1">OWASP Category</h6>
                          <div className="fw-bold">{result.owaspCategory}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info mt-3">
                    <h6><i className="bi bi-info-circle me-2"></i>Security Recommendations</h6>
                    <ul className="mb-0">
                      {result.attackType === 'SQL_INJECTION' && (
                        <>
                          <li>Use parameterized queries or prepared statements</li>
                          <li>Implement input validation and sanitization</li>
                          <li>Apply least privilege database access</li>
                        </>
                      )}
                      {result.attackType === 'XSS' && (
                        <>
                          <li>Implement Content Security Policy (CSP)</li>
                          <li>Sanitize and escape user input</li>
                          <li>Use secure frameworks and libraries</li>
                        </>
                      )}
                      {result.attackType === 'SAFE' && (
                        <>
                          <li>Continue monitoring for suspicious patterns</li>
                          <li>Implement rate limiting and monitoring</li>
                          <li>Regular security audits and penetration testing</li>
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
                          <code className="d-block small">{item.payload}</code>
                          <span className={`badge bg-${getRiskLevelColor(item.result.riskScore)} mt-1`}>
                            {item.result.attackType}
                          </span>
                        </div>
                        <span className="badge bg-secondary">{item.result.riskScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-lg border-0 mt-3">
            <div className="card-header bg-dark text-white">
              <h6 className="mb-0">Quick Test Cases</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setPayload("SELECT * FROM users WHERE id=1 OR 1=1")}
                >
                  SQL Injection Test
                </button>
                <button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => setPayload("<script>alert('XSS Attack')</script>")}
                >
                  XSS Test
                </button>
                <button 
                  className="btn btn-outline-info btn-sm"
                  onClick={() => setPayload("../../../etc/passwd")}
                >
                  Path Traversal Test
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPayload("'; DROP TABLE users; --")}
                >
                  Command Injection Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreatAnalyzer;
