package com.intellective.unity.client;

import com.intellective.unity.model.DomainCase;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "unity-api-cases", url = "${unity-api.uri}/cases")
public interface CasesApiClient {

    @GetMapping("/{caseType}/{caseId}")
    DomainCase getCaseById(@PathVariable("caseType") String caseType, @PathVariable("caseId") String caseId);
}
