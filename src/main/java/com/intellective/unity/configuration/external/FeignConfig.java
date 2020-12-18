package com.intellective.unity.configuration.external;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.security.oauth2.client.feign.OAuth2FeignRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;

@Profile("external-application")
@EnableFeignClients(basePackages = "com.intellective.unity")
@Configuration
public class FeignConfig {

    @Bean
    public OAuth2FeignRequestInterceptor oAuth2FeignRequestInterceptor(@Qualifier("oauth2ClientContext") OAuth2ClientContext oauth2ClientContext, OAuth2ProtectedResourceDetails serviceAccountOauthDetails) {
        return new OAuth2FeignRequestInterceptor(oauth2ClientContext, serviceAccountOauthDetails);
    }
}
