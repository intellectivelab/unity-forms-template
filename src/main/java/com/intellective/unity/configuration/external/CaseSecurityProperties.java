package com.intellective.unity.configuration.external;

import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.context.annotation.Profile;

import java.util.Map;
import java.util.function.BiFunction;

@Profile("external-application")
@ConfigurationProperties("security.case")
@Value
@ConstructorBinding
public class CaseSecurityProperties {

    @RequiredArgsConstructor
    public enum UserFilter {
        AUTHOR(((prop, userId) -> String.format("%s==\"%s\"", prop.getAuthorPropertyName(), userId))),
        REVIEWER(((prop, userId) -> String.format("%s=CONTAINS=\"%s\"", prop.getReviewerPropertyName(), userId))),
        AUTHOR_OR_REVIEWER(((prop, userId) -> String.format("(%s,%s)", AUTHOR.generateQuery(prop, userId), REVIEWER.generateQuery(prop, userId))));

        private final BiFunction<CaseSecurityProperties, String, String> queryGenerator;

        public String generateQuery(CaseSecurityProperties caseSecurityProperties, String userId) {
            return queryGenerator.apply(caseSecurityProperties, userId);
        }
    }

    String authorPropertyName;
    String reviewerPropertyName;
    String creatorPropertyName;
    String creatorEmailPropertyName;

    Map<String, UserFilter> templates;
}
