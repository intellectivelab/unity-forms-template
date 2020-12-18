package com.intellective.unity.configuration.external;

import com.intellective.unity.client.UserInfoClient;
import com.intellective.unity.security.DeepAuthenticationManager;
import com.intellective.unity.security.DevAuthenticationManager;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;

@Profile({"external-application"})
@Configuration
@RequiredArgsConstructor
public class AuthenticationManagerConfig {

    private final UserInfoClient userInfoClient;

    @Profile("debug-authentication")
    @Bean
    public AuthenticationManager alwaysValid() {
        return new DevAuthenticationManager(userInfoClient);
    }

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationManager deepAuthenticationManager() {
        return new DeepAuthenticationManager(userInfoClient);
    }

}
