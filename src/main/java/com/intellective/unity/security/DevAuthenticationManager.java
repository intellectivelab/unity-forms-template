package com.intellective.unity.security;

import com.intellective.unity.client.UserInfoClient;
import com.intellective.unity.model.UserInfo;
import com.intellective.unity.model.UserType;
import io.vavr.control.Try;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;

import java.util.Optional;

@RequiredArgsConstructor
public class DevAuthenticationManager implements AuthenticationManager {

    private final UserInfoClient userInfoClient;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        return Optional.ofNullable(authentication)
                .map(it -> (String) authentication.getPrincipal())
                .filter(StringUtils::isNotEmpty)
                .map(this::toUserInfo)
                .map(DeepAuthentication::new)
                .orElseThrow(() -> new InvalidTokenException("Invalid token (token not found)"));
    }

    private UserInfo toUserInfo(String userId) {
        return Try.of(() -> userInfoClient.getUserInfoByUserId(userId))
                .getOrElse(UserInfo.builder()
                        .userId(userId)
                        .userType(UserType.EXTERNAL)
                        .email("stub@intellective.com")
                        .userName("stub user name")
                        .firstName("stub fist name")
                        .lastName("stub last name")
                        .build());
    }
}

