# AI-Driven Web Security Suite

A comprehensive web security application that provides real-time threat analysis and login anomaly detection using AI-powered algorithms.

## Features

- **Threat Analyzer**: Analyzes HTTP payloads for various security threats including SQL injection, XSS, command injection, and more
- **Login Anomaly Detector**: Detects suspicious login patterns based on multiple factors
- **Real-time Dashboard**: Provides overview of security metrics and traffic analysis
- **OWASP Compliance**: Categorizes threats according to OWASP Top 10

## Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- npm or yarn

### Running the Application

#### Option 1: Using the Startup Script (Recommended)

1. Double-click `start.bat` (Windows) or run it from command line
2. Wait for both servers to start
3. Open your browser and go to `http://localhost:5173`

#### Option 2: Manual Startup

**Backend:**
```bash
cd back/ai-security-suite
./mvnw.cmd spring-boot:run  # Windows
# or
./mvnw spring-boot:run      # Linux/Mac
```

**Frontend:**
```bash
cd front/frontend
npm install
npm run dev
```

### Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8081
- **API Health Check**: http://localhost:8081/api

## API Endpoints

### Threat Analysis
- **POST** `/api/analyze`
- **Body**: `{ "payload": "your_input_here" }`
- **Response**: Threat analysis with risk score and attack type

### Login Anomaly Detection
- **POST** `/api/login-check`
- **Body**: Login request with user details
- **Response**: Anomaly score and risk assessment

## Technology Stack

### Backend
- Spring Boot 4.0.3
- Java 17
- Jackson (JSON processing)
- Maven

### Frontend
- React
- Vite
- Bootstrap 5
- Axios

## Security Features

### Threat Detection Patterns
- SQL Injection
- Cross-Site Scripting (XSS)
- Command Injection
- Path Traversal
- LDAP Injection
- NoSQL Injection
- XXE Injection
- SSRF
- File Inclusion
- Buffer Overflow

### Login Anomaly Factors
- Failed login attempts
- Unusual login times
- Geographic location
- IP address patterns
- Device/browser analysis
- Username patterns

## Project Structure

```
AI-Driven-Web-Security-Suite/
├── back/
│   └── ai-security-suite/          # Spring Boot backend
│       ├── src/main/java/
│       │   └── com/securitysuite/ai_security_suite/
│       │       ├── controller/     # REST controllers
│       │       ├── service/        # Business logic
│       │       └── model/          # Data models
│       └── src/main/resources/
│           └── application.properties
├── front/
│   └── frontend/                   # React frontend
│       ├── src/
│       │   ├── components/         # React components
│       │   └── services/           # API services
│       └── package.json
├── start.bat                       # Startup script
└── README.md                      # This file
```

## Configuration

The application is configured to run on:
- Backend port: 8081
- Frontend port: 5173

CORS is configured to allow requests from the frontend to the backend.

## Troubleshooting

### Backend Issues
- Ensure Java 17+ is installed and in PATH
- Check if port 8081 is available
- Verify Maven dependencies are downloaded

### Frontend Issues
- Ensure Node.js 16+ is installed
- Run `npm install` in the frontend directory
- Check if port 5173 is available

### Connection Issues
- Verify both servers are running
- Check browser console for CORS errors
- Ensure API endpoints are accessible

## License

This project is for educational and demonstration purposes.
