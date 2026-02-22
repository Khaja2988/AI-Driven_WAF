package com.securitysuite.ai_security_suite.model;

public class ThreatResponse {
	  private String attackType;
	    private int riskScore;
	    private double confidence;
	    private String owaspCategory;
		public String getAttackType() {
			return attackType;
		}
		public void setAttackType(String attackType) {
			this.attackType = attackType;
		}
		public int getRiskScore() {
			return riskScore;
		}
		public void setRiskScore(int riskScore) {
			this.riskScore = riskScore;
		}
		public double getConfidence() {
			return confidence;
		}
		public void setConfidence(double confidence) {
			this.confidence = confidence;
		}
		public String getOwaspCategory() {
			return owaspCategory;
		}
		public void setOwaspCategory(String owaspCategory) {
			this.owaspCategory = owaspCategory;
		}

}
