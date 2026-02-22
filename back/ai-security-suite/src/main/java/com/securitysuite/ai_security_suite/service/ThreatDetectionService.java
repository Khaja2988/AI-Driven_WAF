package com.securitysuite.ai_security_suite.service;

import org.springframework.stereotype.Service;

import com.securitysuite.ai_security_suite.model.ThreatResponse;

@Service
public class ThreatDetectionService {

    public ThreatResponse analyze(String payload) {
        int score = 0;
        String type = "SAFE";
        String owaspCategory = "None";

        String input = payload.toLowerCase().trim();

        // SQL Injection Patterns
        if (containsAny(input, new String[]{"or 1=1", "or true", "or '1'='1'", "or \"1\"=\"1\""})) {
            score += 40;
            type = "SQL_INJECTION";
            owaspCategory = "A03: Injection";
        }
        
        if (containsAny(input, new String[]{"union select", "select * from", "insert into", "delete from", "update set"})) {
            score += 50;
            if (type.equals("SAFE")) {
                type = "SQL_INJECTION";
                owaspCategory = "A03: Injection";
            }
        }

        if (containsAny(input, new String[]{"drop table", "truncate table", "alter table", "exec(", "system("})) {
            score += 60;
            type = "SQL_INJECTION";
            owaspCategory = "A03: Injection";
        }

        // XSS Patterns
        if (containsAny(input, new String[]{"<script>", "javascript:", "onload=", "onerror=", "onclick="})) {
            score += 60;
            if (type.equals("SAFE")) {
                type = "XSS";
                owaspCategory = "A03: Injection";
            }
        }

        if (containsAny(input, new String[]{"<img", "<iframe", "<object", "<embed", "vbscript:"})) {
            score += 50;
            if (type.equals("SAFE")) {
                type = "XSS";
                owaspCategory = "A03: Injection";
            }
        }

        // Command Injection Patterns
        if (containsAny(input, new String[]{"&&", ";", "||", "|", "&", "`", "$(", "${"})) {
            score += 45;
            if (type.equals("SAFE")) {
                type = "COMMAND_INJECTION";
                owaspCategory = "A03: Injection";
            }
        }

        // Path Traversal Patterns
        if (containsAny(input, new String[]{"../", "..\\", "%2e%2e%2f", "%2e%2e%5c"})) {
            score += 35;
            if (type.equals("SAFE")) {
                type = "PATH_TRAVERSAL";
                owaspCategory = "A01: Broken Access Control";
            }
        }

        // LDAP Injection Patterns
        if (containsAny(input, new String[]{"*)(", "*))", "*)%00", "cn=", "ou="})) {
            score += 40;
            if (type.equals("SAFE")) {
                type = "LDAP_INJECTION";
                owaspCategory = "A03: Injection";
            }
        }

        // NoSQL Injection Patterns
        if (containsAny(input, new String[]{"$ne:", "$gt:", "$lt:", "$where:", "$regex:"})) {
            score += 45;
            if (type.equals("SAFE")) {
                type = "NOSQL_INJECTION";
                owaspCategory = "A03: Injection";
            }
        }

        // XXE Injection Patterns
        if (containsAny(input, new String[]{"<!doctype", "<!entity", "&external;", "&system;"})) {
            score += 55;
            if (type.equals("SAFE")) {
                type = "XXE_INJECTION";
                owaspCategory = "A05: Security Misconfiguration";
            }
        }

        // SSRF Patterns
        if (containsAny(input, new String[]{"http://localhost", "http://127.0.0.1", "http://169.254.169.254"})) {
            score += 50;
            if (type.equals("SAFE")) {
                type = "SSRF";
                owaspCategory = "A10: Server-Side Request Forgery";
            }
        }

        // File Inclusion Patterns
        if (containsAny(input, new String[]{"php://", "file://", "data://", "expect://"})) {
            score += 55;
            if (type.equals("SAFE")) {
                type = "FILE_INCLUSION";
                owaspCategory = "A01: Broken Access Control";
            }
        }

        // Buffer Overflow Patterns
        if (containsAny(input, new String[]{"%41%41%41", "aaaaaaaaaaaaaaaaaaaa", "nop sled"})) {
            score += 40;
            if (type.equals("SAFE")) {
                type = "BUFFER_OVERFLOW";
                owaspCategory = "A03: Injection";
            }
        }

        // Comment-based attacks
        if (containsAny(input, new String[]{"--", "#", "/*", "*/"})) {
            score += 20;
            if (type.equals("SAFE")) {
                type = "COMMENT_INJECTION";
                owaspCategory = "A03: Injection";
            }
        }

        // Encoding-based attacks
        if (containsAny(input, new String[]{"%27", "%22", "%3c", "%3e", "%2f"})) {
            score += 25;
            if (type.equals("SAFE")) {
                type = "ENCODED_PAYLOAD";
                owaspCategory = "A03: Injection";
            }
        }

        // Cap the score at 100
        score = Math.min(score, 100);

        // Create response
        ThreatResponse response = new ThreatResponse();
        response.setAttackType(type);
        response.setRiskScore(score);
        response.setConfidence(score / 100.0);
        response.setOwaspCategory(owaspCategory);

        return response;
    }

    private boolean containsAny(String input, String[] patterns) {
        for (String pattern : patterns) {
            if (input.contains(pattern)) {
                return true;
            }
        }
        return false;
    }
}
