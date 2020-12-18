package com.intellective.unity.security;

import com.google.common.base.Strings;
import com.intellective.unity.client.UserInfoClient;
import io.vavr.control.Try;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;

import java.util.Optional;

@RequiredArgsConstructor
public class DeepAuthenticationManager implements AuthenticationManager {

    private final UserInfoClient userInfoClient;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        val token = Optional.ofNullable(authentication)
                .map(it -> (String) authentication.getPrincipal())
                .filter(StringUtils::isNotEmpty)
                .orElseThrow(() -> new InvalidTokenException("Invalid token (token not found)"));


        return Try.of(() -> userInfoClient.getUserInfo(token))
                .filter(it -> it == null || Strings.isNullOrEmpty(it.getUserId()))
                .map(DeepAuthentication::new)
                .getOrElseThrow(e -> new BadCredentialsException("Could not validate token", e));

    }
}
