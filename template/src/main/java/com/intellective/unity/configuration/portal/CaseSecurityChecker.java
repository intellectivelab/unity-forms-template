package com.intellective.unity.configuration.portal;

import com.intellective.unity.client.CasesApiClient;
import com.intellective.unity.model.DomainCase;
import lombok.Value;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class CaseSecurityChecker {

    @Autowired
    private CasesApiClient casesClient;

    @Value
    public static class CaseIdentity {
        String caseType;
        String caseId;
    }

    public boolean check(CaseIdentity caseIdentity, String userId) {
        val aCase = casesClient.getCaseById(caseIdentity.getCaseType(), caseIdentity.getCaseId());

        return check(aCase, userId);
    }

    public boolean check(DomainCase aCase, String userId) {
        val fields = aCase.getFields();

        return userId.equalsIgnoreCase(fields.getAuthorId()) || Optional.ofNullable(fields.getReviewers())
                .map(list -> list.stream().anyMatch(userId::equalsIgnoreCase))
                .orElse(false);
    }
}
