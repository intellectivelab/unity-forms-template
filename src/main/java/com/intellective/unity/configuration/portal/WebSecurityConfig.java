package com.intellective.unity.configuration.portal;

import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

@Profile("portal")
@Configuration
@EnableWebSecurity
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("login.login-url")
    private final String loginFormUrl;

    @Value("login.home-url")
    private final String home;

    private final AuthenticationManager authenticationManager;

    @Override
    public void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable()

                .authorizeRequests()
                .antMatchers("/manifest.json").permitAll()
                .antMatchers(HttpMethod.GET, "/dev-login.html").permitAll()
                .anyRequest().authenticated()
                .and()

                .addFilterAfter(createFilter(), AbstractPreAuthenticatedProcessingFilter.class)

                .anonymous().disable()
                .exceptionHandling()
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint(loginFormUrl))
                .and()

                .logout().permitAll();
    }

    private PortalAuthenticationProcessingFilter createFilter() {
        val filter = new PortalAuthenticationProcessingFilter();

        filter.setAuthenticationFailureHandler(new SimpleUrlAuthenticationFailureHandler(loginFormUrl));
        filter.setAuthenticationSuccessHandler(new SimpleUrlAuthenticationSuccessHandler(home));
        filter.setAuthenticationManager(authenticationManager);

        return filter;
    }
}
