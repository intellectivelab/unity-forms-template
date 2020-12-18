package com.intellective.unity.security;

import com.intellective.unity.client.PublicApiCasesClient;
import com.intellective.unity.model.EPermittingCase;
import lombok.Value;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class CaseSecurityChecker {

    @Autowired
    private PublicApiCasesClient casesClient;

    @Value
    public static class CaseIdentity {
        String caseType;
        String caseId;
    }

    public boolean check(CaseIdentity caseIdentity, String userId) {
        val ePermittingCase = casesClient.getEPermittingCase(caseIdentity.getCaseType(), caseIdentity.getCaseId());
        return check(ePermittingCase, userId);
    }

    public boolean check(EPermittingCase epermittingCase, String userId) {
        val fields = epermittingCase.getFields();

        return userId.equalsIgnoreCase(fields.getAuthorId()) || Optional.ofNullable(fields.getReviewers())
                .map(list -> list.stream().anyMatch(userId::equalsIgnoreCase))
                .orElse(false);
    }
}
