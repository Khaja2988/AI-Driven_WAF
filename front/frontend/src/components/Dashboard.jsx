import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [liveTraffic, setLiveTraffic] = useState([
    { timestamp: '10:45:23', method: 'POST', endpoint: '/api/login', ip: '192.168.1.100', status: 200, latency: 45, detection: 'SQLI DETECTED' },
    { timestamp: '10:45:21', method: 'GET', endpoint: '/api/users', ip: '10.0.0.15', status: 403, latency: 12, detection: 'XSS DETECTED' },
    { timestamp: '10:45:19', method: 'POST', endpoint: '/api/upload', ip: '172.16.0.50', status: 200, latency: 78, detection: 'RCE DETECTED' },
    { timestamp: '10:45:18', method: 'GET', endpoint: '/api/dashboard', ip: '203.0.113.1', status: 200, latency: 23, detection: 'CLEAN' },
    { timestamp: '10:45:15', method: 'POST', endpoint: '/api/admin', ip: '198.51.100.10', status: 403, latency: 8, detection: 'COAF DETECTED' },
    { timestamp: '10:45:12', method: 'PUT', endpoint: '/api/update', ip: '192.168.1.200', status: 200, latency: 34, detection: 'CLEAN' },
    { timestamp: '10:45:10', method: 'DELETE', endpoint: '/api/delete', ip: '10.0.0.25', status: 403, latency: 15, detection: 'XSS DETECTED' },
    { timestamp: '10:45:08', method: 'POST', endpoint: '/api/submit', ip: '172.16.0.75', status: 200, latency: 52, detection: 'SQLI DETECTED' },
  ]);

  const [rules, setRules] = useState([
    { id: 1, name: 'SQL Injection Detection', enabled: true, severity: 'High', pattern: '(union|select|insert|update|delete)' },
    { id: 2, name: 'XSS Protection', enabled: true, severity: 'Critical', pattern: '(<script|javascript:|onload=)' },
    { id: 3, name: 'Remote Code Execution', enabled: true, severity: 'Critical', pattern: '(exec|eval|system|shell_exec)' },
    { id: 4, name: 'Path Traversal', enabled: false, severity: 'Medium', pattern: '(\\.\\./|\\.\\.\\\\)' },
    { id: 5, name: 'Command Injection', enabled: true, severity: 'High', pattern: '(&&|;|\\|\\||`)' },
  ]);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low');

  const [trafficData, setTrafficData] = useState({
    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    datasets: [
      {
        label: 'Request Volume',
        data: [1200, 800, 600, 400, 500, 900, 1400, 1800, 1600, 1900, 1750, 1452],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Detected Threats',
        data: [50, 30, 20, 15, 25, 45, 80, 120, 95, 140, 110, 85],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const [threatOriginsData, setThreatOriginsData] = useState({
    labels: ['CN', 'RU', 'US', 'BR', 'IN', 'DE'],
    datasets: [
      {
        label: 'Threat Count',
        data: [450, 320, 180, 150, 120, 80],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(239, 68, 68, 0.4)',
          'rgba(239, 68, 68, 0.3)',
        ],
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time traffic simulation
  useEffect(() => {
    if (activeSection === 'logs') {
      const trafficTimer = setInterval(() => {
        const newTraffic = generateNewTrafficEntry();
        setLiveTraffic(prev => [newTraffic, ...prev.slice(0, 19)]); // Keep last 20 entries
        
        // Simulate failed attempts and update risk level
        if (newTraffic.detection !== 'CLEAN' && Math.random() > 0.7) {
          setFailedAttempts(prev => {
            const newCount = prev + Math.floor(Math.random() * 5) + 1;
            updateRiskLevel(newCount);
            return newCount;
          });
        }
      }, 2000); // Add new entry every 2 seconds
      
      return () => clearInterval(trafficTimer);
    }
  }, [activeSection]);

  const updateRiskLevel = (attempts) => {
    if (attempts <= 100) {
      setRiskLevel('Low');
    } else if (attempts > 100 && attempts <= 500) {
      setRiskLevel('Medium');
    } else if (attempts > 500 && attempts <= 1000) {
      setRiskLevel('High');
    } else {
      setRiskLevel('Critical');
    }
  };

  const getRiskLevelColor = (level) => {
    switch(level) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      case 'Critical': return 'dark';
      default: return 'secondary';
    }
  };

  // Animated charts for Traffic Analysis
  useEffect(() => {
    if (activeSection === 'traffic') {
      const animationTimer = setInterval(() => {
        // Update traffic line chart data
        setTrafficData(prev => ({
          ...prev,
          datasets: prev.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(value => {
              const variation = Math.floor(Math.random() * 200) - 100; // Random variation between -100 and +100
              const newValue = value + variation;
              return Math.max(10, newValue); // Ensure minimum value of 10
            })
          }))
        }));

        // Update threat origins bar chart data
        setThreatOriginsData(prev => ({
          ...prev,
          datasets: prev.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(value => {
              const variation = Math.floor(Math.random() * 50) - 25; // Random variation between -25 and +25
              const newValue = value + variation;
              return Math.max(10, newValue); // Ensure minimum value of 10
            })
          }))
        }));
      }, 1500); // Update every 1.5 seconds
      
      return () => clearInterval(animationTimer);
    }
  }, [activeSection]);

  const generateNewTrafficEntry = () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const endpoints = ['/api/login', '/api/users', '/api/admin', '/api/upload', '/api/delete', '/api/update', '/api/submit', '/api/dashboard'];
    const ips = ['192.168.1.100', '10.0.0.15', '172.16.0.50', '203.0.113.1', '198.51.100.10', '192.168.1.200', '10.0.0.25', '172.16.0.75'];
    const detections = ['CLEAN', 'SQLI DETECTED', 'XSS DETECTED', 'RCE DETECTED', 'COAF DETECTED', 'PATH TRAVERSAL', 'COMMAND INJECTION'];
    
    const method = methods[Math.floor(Math.random() * methods.length)];
    const detection = detections[Math.floor(Math.random() * detections.length)];
    const isThreat = detection !== 'CLEAN';
    const status = isThreat ? (Math.random() > 0.5 ? 403 : 200) : (Math.random() > 0.1 ? 200 : 404);
    const latency = Math.floor(Math.random() * 100) + 10;
    
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    
    return {
      timestamp,
      method,
      endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
      ip: ips[Math.floor(Math.random() * ips.length)],
      status,
      latency,
      detection
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 750, // Smooth animation duration
      easing: 'easeInOutQuart'
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 750, // Smooth animation duration
      easing: 'easeInOutQuart'
    }
  };

  const renderDashboardContent = () => (
    <>
      {/* Security Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Requests</h6>
              <h3 className="fw-bold">14,520</h3>
              <small className="text-success">+20.1% from last hour</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">Blocked Attacks</h6>
              <h3 className="fw-bold text-danger">124</h3>
              <small className="text-muted">24 SQLi, 100 XSS Attempts</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">Risk Level</h6>
              <div className="d-flex align-items-center">
                <h3 className={`fw-bold text-${getRiskLevelColor(riskLevel)}`}>{riskLevel}</h3>
                <div className="ms-2">
                  <div className="progress" style={{width: '60px', height: '8px'}}>
                    <div 
                      className={`progress-bar bg-${getRiskLevelColor(riskLevel)}`}
                      style={{
                        width: riskLevel === 'Low' ? '25%' : 
                               riskLevel === 'Medium' ? '50%' : 
                               riskLevel === 'High' ? '75%' : '100%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <small className="text-muted">Failed Attempts: {failedAttempts}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">System Uptime</h6>
              <h3 className="fw-bold text-success">99.98%</h3>
              <small className="text-muted">Last restart: 1 day ago</small>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Analysis Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">📈 Request volume vs. detected threats over time</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <Line data={trafficData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Origins Chart */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">🌍 Top sources of malicious traffic by country code</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '250px' }}>
                <Bar data={threatOriginsData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Live Traffic Inspector */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">🔍 Live Traffic Inspector</h5>
              <small className="text-muted">Real-time stream of incoming requests and security decisions.</small>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                <table className="table table-sm">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Timestamp</th>
                      <th>Method</th>
                      <th>Endpoint</th>
                      <th>IP Address</th>
                      <th>Status</th>
                      <th>Latency</th>
                      <th>Detection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveTraffic.slice(0, 5).map((traffic, index) => (
                      <tr key={index}>
                        <td className="small">{traffic.timestamp}</td>
                        <td>
                          <span className={`badge bg-${traffic.method === 'GET' ? 'success' : 'primary'} text-white`}>
                            {traffic.method}
                          </span>
                        </td>
                        <td className="small">{traffic.endpoint}</td>
                        <td className="small">{traffic.ip}</td>
                        <td>
                          <span className={`badge bg-${traffic.status === 200 ? 'success' : 'danger'} text-white`}>
                            {traffic.status}
                          </span>
                        </td>
                        <td className="small">{traffic.latency}ms</td>
                        <td>
                          <span className={`badge bg-${traffic.detection === 'CLEAN' ? 'success' : 'warning'} text-white`}>
                            {traffic.detection}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderLiveLogsContent = () => (
    <div className="row">
      <div className="col-12">
        {/* Risk Level Alert */}
        <div className={`alert alert-${getRiskLevelColor(riskLevel)} alert-dismissible fade show mb-4`} role="alert">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <i className={`bi bi-shield-exclamation-triangle-fill`} style={{fontSize: '24px'}}></i>
            </div>
            <div className="flex-grow-1">
              <h5 className="mb-1">Current Risk Level: <strong>{riskLevel}</strong></h5>
              <p className="mb-0">
                Failed Attempts: <strong>{failedAttempts}</strong> | 
                {riskLevel === 'Low' && ' System operating under normal conditions.'}
                {riskLevel === 'Medium' && ' Elevated threat activity detected. Monitor closely.'}
                {riskLevel === 'High' && ' High threat level! Immediate attention required.'}
                {riskLevel === 'Critical' && ' Critical security situation! Take immediate action.'}
              </p>
            </div>
            <div className="ms-3">
              <div className="text-center">
                <div className="progress" style={{width: '100px', height: '20px'}}>
                  <div 
                    className={`progress-bar bg-${getRiskLevelColor(riskLevel)}`}
                    style={{
                      width: riskLevel === 'Low' ? '25%' : 
                             riskLevel === 'Medium' ? '50%' : 
                             riskLevel === 'High' ? '75%' : '100%'
                    }}
                  ></div>
                </div>
                <small className="text-muted">Risk Progress</small>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">📋 Live Traffic Inspector</h5>
              <small className="text-muted">Real-time stream of incoming requests and security decisions.</small>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="rounded-circle bg-success me-2" style={{width: '10px', height: '10px'}}></div>
                <small className="text-muted">LIVE</small>
              </div>
              <div className="badge bg-primary">
                {liveTraffic.filter(t => t.detection !== 'CLEAN').length} Threats Detected
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="table table-sm">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Timestamp</th>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>Latency</th>
                    <th>Detection</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveTraffic.map((traffic, index) => (
                    <tr key={index} className={traffic.detection !== 'CLEAN' ? 'table-warning' : ''}>
                      <td className="small">{traffic.timestamp}</td>
                      <td>
                        <span className={`badge bg-${traffic.method === 'GET' ? 'success' : traffic.method === 'POST' ? 'primary' : 'secondary'} text-white`}>
                          {traffic.method}
                        </span>
                      </td>
                      <td className="small">{traffic.endpoint}</td>
                      <td className="small">
                        <code className="text-danger">{traffic.ip}</code>
                      </td>
                      <td>
                        <span className={`badge bg-${traffic.status === 200 ? 'success' : 'danger'} text-white`}>
                          {traffic.status}
                        </span>
                      </td>
                      <td className="small">{traffic.latency}ms</td>
                      <td>
                        <span className={`badge bg-${
                          traffic.detection === 'CLEAN' ? 'success' : 
                          traffic.detection === 'SQLI DETECTED' ? 'danger' :
                          traffic.detection === 'XSS DETECTED' ? 'warning' :
                          traffic.detection === 'RCE DETECTED' ? 'dark' :
                          traffic.detection === 'COAF DETECTED' ? 'info' : 'secondary'
                        } text-white`}>
                          {traffic.detection}
                        </span>
                      </td>
                      <td>
                        {traffic.detection !== 'CLEAN' && (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-warning btn-sm">⚠️</button>
                            <button className="btn btn-outline-danger btn-sm">🚫</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRulesEngineContent = () => (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">⚙️ Security Rules Engine</h5>
              <small className="text-muted">Configure and manage security detection rules.</small>
            </div>
            <button className="btn btn-primary btn-sm">+ Add New Rule</button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Rule Name</th>
                    <th>Pattern</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule.id}>
                      <td>{rule.id}</td>
                      <td className="fw-semibold">{rule.name}</td>
                      <td><code className="small">{rule.pattern}</code></td>
                      <td>
                        <span className={`badge bg-${
                          rule.severity === 'Critical' ? 'danger' : 
                          rule.severity === 'High' ? 'warning' : 
                          rule.severity === 'Medium' ? 'info' : 'secondary'
                        } text-white`}>
                          {rule.severity}
                        </span>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={rule.enabled}
                            onChange={() => {
                              setRules(rules.map(r => 
                                r.id === rule.id ? {...r, enabled: !r.enabled} : r
                              ));
                            }}
                          />
                          <label className="form-check-label">
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrafficAnalysisContent = () => (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">📈 Request volume vs. detected threats over time</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '400px' }}>
                <Line data={trafficData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">🌍 Top sources of malicious traffic by country code</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '400px' }}>
                <Bar data={threatOriginsData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderSettingsContent = () => (
    <div className="row">
      <div className="col-md-8">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">👤 User Profile</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{width: '80px', height: '80px', fontSize: '32px'}}>
                JD
              </div>
              <div>
                <h5 className="mb-1">John Doe</h5>
                <p className="text-muted mb-0">Security Administrator</p>
                <small className="text-muted">john.doe@company.com</small>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" defaultValue="John Doe" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" defaultValue="john.doe@company.com" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Role</label>
                <input type="text" className="form-control" defaultValue="Security Administrator" readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Department</label>
                <input type="text" className="form-control" defaultValue="IT Security" />
              </div>
            </div>
            
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">🔐 Security Settings</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
                <label className="form-check-label">Two-Factor Authentication</label>
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
                <label className="form-check-label">Email Notifications</label>
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">Session Timeout (30 min)</label>
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
                <label className="form-check-label">IP Whitelist</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">🚪 Session Actions</h5>
          </div>
          <div className="card-body">
            <div className="d-grid gap-2">
              <button className="btn btn-outline-primary">
                🔄 Refresh Session
              </button>
              <button className="btn btn-outline-warning">
                📝 View Login History
              </button>
              <button className="btn btn-outline-info">
                🔑 Change Password
              </button>
              <hr />
              <button className="btn btn-danger">
                🚪 Logout
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-light rounded">
              <h6>Session Info</h6>
              <small className="text-muted d-block">Logged in: {currentTime.toLocaleString()}</small>
              <small className="text-muted d-block">IP: 192.168.1.100</small>
              <small className="text-muted d-block">Session ID: sess_123456</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'logs':
        return renderLiveLogsContent();
      case 'rules':
        return renderRulesEngineContent();
      case 'traffic':
        return renderTrafficAnalysisContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderDashboardContent();
    }
  };

  const handleExportReport = () => {
    // Create CSV content from live traffic data
    const csvContent = [
      ['Timestamp', 'Method', 'Endpoint', 'IP Address', 'Status', 'Latency', 'Detection'].join(','),
      ...liveTraffic.map(traffic => 
        [traffic.timestamp, traffic.method, traffic.endpoint, traffic.ip, traffic.status, traffic.latency, traffic.detection].join(',')
      )
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // Refresh live traffic with new data
    const newEntries = Array.from({ length: 5 }, () => generateNewTrafficEntry());
    setLiveTraffic(prev => [...newEntries, ...prev.slice(0, 15)]);
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded">
            <h3 className="mb-0 fw-bold">🛡️ SENTINEL SECEPS CONSOLE</h3>
            <div>
              <button 
                onClick={handleExportReport}
                className="btn btn-outline-light btn-sm me-2"
              >
                📊 Export Report
              </button>
              <button 
                onClick={handleRefresh}
                className="btn btn-outline-light btn-sm"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="row">
        <div className="col-md-2">
          <div className="list-group">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`list-group-item list-group-item-action ${
                activeSection === 'dashboard' ? 'active bg-primary text-white' : ''
              }`}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => setActiveSection('logs')}
              className={`list-group-item list-group-item-action ${
                activeSection === 'logs' ? 'active bg-primary text-white' : ''
              }`}
            >
              📋 Live Logs
            </button>
            <button 
              onClick={() => setActiveSection('rules')}
              className={`list-group-item list-group-item-action ${
                activeSection === 'rules' ? 'active bg-primary text-white' : ''
              }`}
            >
              ⚙️ Rules Engine
            </button>
            <button 
              onClick={() => setActiveSection('traffic')}
              className={`list-group-item list-group-item-action ${
                activeSection === 'traffic' ? 'active bg-primary text-white' : ''
              }`}
            >
              📈 Traffic Analysis
            </button>
            <button 
              onClick={() => setActiveSection('settings')}
              className={`list-group-item list-group-item-action ${
                activeSection === 'settings' ? 'active bg-primary text-white' : ''
              }`}
            >
              🔧 Settings
            </button>
          </div>
        </div>

        <div className="col-md-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
