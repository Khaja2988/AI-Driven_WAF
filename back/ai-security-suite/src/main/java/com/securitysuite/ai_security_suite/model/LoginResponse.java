package com.securitysuite.ai_security_suite.model;

public class LoginResponse {

    private int anomalyScore;
    private String riskLevel;
    private String reason;
	public int getAnomalyScore() {
		return anomalyScore;
	}
	public void setAnomalyScore(int anomalyScore) {
		this.anomalyScore = anomalyScore;
	}
	public String getRiskLevel() {
		return riskLevel;
	}
	public void setRiskLevel(String riskLevel) {
		this.riskLevel = riskLevel;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}

    // getters & setters
    
}
