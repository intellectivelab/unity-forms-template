package com.intellective.unity.configuration.portal;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsResourceDetails;

@Profile("portal")
@Configuration
public class OAuth2Config {

    @Bean
    @ConfigurationProperties("login.service-account.oauth2.client")
    protected OAuth2ProtectedResourceDetails serviceAccountOauthDetails() {
        return new ClientCredentialsResourceDetails();
    }

    @Bean
    public DefaultOAuth2ClientContext oauth2ClientContext() {
        return new DefaultOAuth2ClientContext(new DefaultAccessTokenRequest());
    }

    @Bean
    protected OAuth2RestOperations securedRestTemplate() {
        return new OAuth2RestTemplate(serviceAccountOauthDetails(), oauth2ClientContext());
    }
}
