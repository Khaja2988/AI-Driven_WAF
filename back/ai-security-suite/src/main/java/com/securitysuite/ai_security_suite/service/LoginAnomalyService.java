package com.securitysuite.ai_security_suite.service;

import org.springframework.stereotype.Service;

import com.securitysuite.ai_security_suite.model.LoginRequest;
import com.securitysuite.ai_security_suite.model.LoginResponse;

@Service
public class LoginAnomalyService {

    public LoginResponse analyze(LoginRequest request) {
        int score = 0;
        StringBuilder reason = new StringBuilder();

        // Failed Attempts Analysis
        if (request.getFailedAttempts() > 5) {
            score += 50;
            reason.append("Critical: Multiple failed attempts (").append(request.getFailedAttempts()).append("). ");
        } else if (request.getFailedAttempts() > 3) {
            score += 30;
            reason.append("Warning: Multiple failed attempts (").append(request.getFailedAttempts()).append("). ");
        } else if (request.getFailedAttempts() > 1) {
            score += 10;
            reason.append("Minor: Some failed attempts (").append(request.getFailedAttempts()).append("). ");
        }

        // Time-based Analysis
        if (request.getLoginTime() != null && !request.getLoginTime().isEmpty()) {
            try {
                String[] timeParts = request.getLoginTime().split(":");
                if (timeParts.length >= 2) {
                    int hour = Integer.parseInt(timeParts[0]);
                    int minute = Integer.parseInt(timeParts[1]);
                    
                    // Unusual hours (midnight to 6 AM, and 11 PM to midnight)
                    if (hour >= 0 && hour < 6) {
                        score += 35;
                        reason.append("Unusual login time (").append(request.getLoginTime()).append("). ");
                    } else if (hour >= 23 || hour == 0) {
                        score += 25;
                        reason.append("Late night login (").append(request.getLoginTime()).append("). ");
                    }
                    
                    // Weekend consideration
                    // Note: In real implementation, you'd check actual day of week
                    // For demo, we'll add small score for very late hours
                    if (hour >= 2 && hour < 5) {
                        score += 15;
                        reason.append("Very late night login. ");
                    }
                }
            } catch (NumberFormatException e) {
                // Invalid time format
                score += 5;
                reason.append("Invalid time format. ");
            }
        }

        // Geographic Analysis
        if (request.getCountry() != null && !request.getCountry().isEmpty()) {
            String country = request.getCountry().toUpperCase();
            
            // High-risk countries (simplified for demo)
            String[] highRiskCountries = {"CN", "RU", "IR", "KP", "PK"};
            String[] mediumRiskCountries = {"BR", "IN", "NG", "ID"};
            
            for (String riskCountry : highRiskCountries) {
                if (country.equals(riskCountry)) {
                    score += 30;
                    reason.append("Login from high-risk country (").append(country).append("). ");
                    break;
                }
            }
            
            for (String medCountry : mediumRiskCountries) {
                if (country.equals(medCountry)) {
                    score += 15;
                    reason.append("Login from medium-risk country (").append(country).append("). ");
                    break;
                }
            }
        }

        // IP Address Analysis
        if (request.getIpAddress() != null && !request.getIpAddress().isEmpty()) {
            String ip = request.getIpAddress().trim();
            
            // Private IP ranges
            if (ip.startsWith("192.168.") || ip.startsWith("10.") || 
                ip.startsWith("172.16.") || ip.startsWith("127.")) {
                score += 5;
                reason.append("Private IP address. ");
            }
            
            // Suspicious IP patterns
            if (ip.startsWith("192.168.1.") || ip.startsWith("10.0.0.")) {
                score += 10;
                reason.append("Common gateway IP. ");
            }
        }

        // Device/Browser Analysis
        if (request.getDevice() != null && !request.getDevice().isEmpty()) {
            String device = request.getDevice().toLowerCase();
            
            // Unknown or suspicious user agents
            if (device.contains("bot") || device.contains("crawler") || 
                device.contains("scanner") || device.contains("automated")) {
                score += 40;
                reason.append("Automated/bot user agent detected. ");
            }
            
            // Very old browsers
            if (device.contains("ie 6") || device.contains("ie 7") || 
                device.contains("netscape") || device.contains("mozilla/4")) {
                score += 20;
                reason.append("Outdated browser detected. ");
            }
        }

        // Username Analysis
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            String username = request.getUsername().toLowerCase().trim();
            
            // Suspicious username patterns
            if (username.contains("admin") || username.contains("root") || 
                username.contains("administrator") || username.contains("sa")) {
                score += 15;
                reason.append("Privileged account username. ");
            }
            
            // SQL injection patterns in username
            if (username.contains("'") || username.contains("\"") || 
                username.contains("or") || username.contains("and")) {
                score += 35;
                reason.append("SQL injection patterns in username. ");
            }
            
            // Very short or generic usernames
            if (username.length() <= 2 || username.equals("user") || 
                username.equals("test") || username.equals("demo")) {
                score += 10;
                reason.append("Generic or test username. ");
            }
        }

        // Velocity Analysis (would need database in real implementation)
        // For demo, add random factor for multiple rapid attempts
        if (request.getFailedAttempts() > 2) {
            score += 20;
            reason.append("High velocity login attempts. ");
        }

        // Cap the score at 100
        score = Math.min(score, 100);

        // Determine risk level
        String risk;
        if (score >= 80) {
            risk = "CRITICAL";
        } else if (score >= 60) {
            risk = "HIGH";
        } else if (score >= 40) {
            risk = "MEDIUM";
        } else if (score >= 20) {
            risk = "LOW";
        } else {
            risk = "MINIMAL";
        }

        // Create response
        LoginResponse response = new LoginResponse();
        response.setAnomalyScore(score);
        response.setRiskLevel(risk);
        response.setReason(reason.toString().trim());

        return response;
    }
}
