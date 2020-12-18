package com.intellective.unity.client;

import com.intellective.unity.model.EPermittingCase;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "public-api-cases", url = "${unity.public.uri}/api/1.0.0/cases")
public interface PublicApiCasesClient {

    @GetMapping("/{caseType}/{caseId}")
    EPermittingCase getEPermittingCase(@PathVariable("caseType") String caseType, @PathVariable("caseId") String caseId);
}
