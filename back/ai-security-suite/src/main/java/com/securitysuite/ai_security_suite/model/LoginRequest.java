package com.securitysuite.ai_security_suite.model;

public class LoginRequest {

    private String username;
    private String country;
    private int failedAttempts;
    private String loginTime;
    private String ipAddress;
    private String device;
    
    // Default constructor
    public LoginRequest() {
    }
    
    // Parameterized constructor
    public LoginRequest(String username, String country, int failedAttempts, String loginTime, String ipAddress, String device) {
        this.username = username;
        this.country = country;
        this.failedAttempts = failedAttempts;
        this.loginTime = loginTime;
        this.ipAddress = ipAddress;
        this.device = device;
    }
    
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public int getFailedAttempts() {
		return failedAttempts;
	}
	public void setFailedAttempts(int failedAttempts) {
		this.failedAttempts = failedAttempts;
	}
	public String getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(String loginTime) {
		this.loginTime = loginTime;
	}
    public String getIpAddress() {
        return ipAddress;
    }
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    public String getDevice() {
        return device;
    }
    public void setDevice(String device) {
        this.device = device;
    }

    // getters & setters
}

