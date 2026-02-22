package com.securitysuite.ai_security_suite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securitysuite.ai_security_suite.model.LoginRequest;
import com.securitysuite.ai_security_suite.model.LoginResponse;
import com.securitysuite.ai_security_suite.model.ThreatRequest;
import com.securitysuite.ai_security_suite.model.ThreatResponse;
import com.securitysuite.ai_security_suite.service.LoginAnomalyService;
import com.securitysuite.ai_security_suite.service.ThreatDetectionService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ThreatController {

    @GetMapping
    public String api() {
        return "AI Security Suite API is running";
    }

    @Autowired
    private ThreatDetectionService service;

    @PostMapping("/analyze")
    public ThreatResponse analyze(@RequestBody ThreatRequest request) {
        return service.analyze(request.getPayload());
    }
    
    @Autowired
    private LoginAnomalyService loginService;

    @PostMapping("/login-check")
    public LoginResponse checkLogin(@RequestBody LoginRequest request) {
        return loginService.analyze(request);
    }
}

