package com.intellective.unity.configuration.portal;

import com.intellective.unity.configuration.DebugPostFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.OAuth2RestOperations;

@Profile("portal")
@Configuration
@EnableZuulProxy
@RequiredArgsConstructor
public class ZuulConfig {

    private final OAuth2RestOperations restTemplate;

    @Bean
    public ZuulOauth2TokenRelayFilter tokenRelayFilter() {
        return new ZuulOauth2TokenRelayFilter(restTemplate);
    }

    @Bean
    public CaseAccessPreFilter caseAccessPreFilter() {
        return new CaseAccessPreFilter();
    }

    @Bean
    public CaseAccessPostFilter caseAccessPostFilter() {
        return new CaseAccessPostFilter();
    }

    @Bean
    public CaseSecurityChecker caseSecurityChecker() {
        return new CaseSecurityChecker();
    }

    @Bean
    public DebugPostFilter debugPostFilter() {
        return new DebugPostFilter();
    }

    @Bean
    public PerspectiveFilter perspectiveFilter() {
        return new PerspectiveFilter();
    }
}
