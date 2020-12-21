package com.intellective.unity.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.util.List;

@Value
@NoArgsConstructor(force = true, access = AccessLevel.PRIVATE)
public class DomainCase {
    String caseType;
    String caseId;

    Fields fields;

    @Value
    @NoArgsConstructor(force = true, access = AccessLevel.PRIVATE)
    public static class Fields {
        @JsonProperty("EP_Reviewer")
        List<String> reviewers;

        @JsonProperty("EP_AuthorID")
        String authorId;
    }
}
