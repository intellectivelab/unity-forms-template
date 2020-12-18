package com.intellective.unity.configuration.internal;

import com.intellective.unity.filter.DebugPostFilter;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@EnableZuulProxy
@Configuration
@Profile("internal-application")
public class ZuulConfig {

    @Bean
    public DebugPostFilter debugPostFilter() {
        return new DebugPostFilter();
    }
}
