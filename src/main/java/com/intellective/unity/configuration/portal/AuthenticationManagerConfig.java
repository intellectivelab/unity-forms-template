package com.intellective.unity.configuration.portal;

import com.intellective.unity.client.UserInfoClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;

@Profile({"portal"})
@Configuration
@RequiredArgsConstructor
public class AuthenticationManagerConfig {

    private final UserInfoClient userInfoClient;

    @Profile("debug-authentication")
    @Bean
    public AuthenticationManager alwaysValid() {
        return new DebugAuthenticationManager(userInfoClient);
    }

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationManager deepAuthenticationManager() {
        return new PortalAuthenticationManager(userInfoClient);
    }

}
