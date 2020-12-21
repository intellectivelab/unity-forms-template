package com.intellective.unity.model;

import lombok.*;
import org.springframework.security.core.AuthenticatedPrincipal;

@Value
@Builder
@NoArgsConstructor(force = true, access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString
public class UserInfo implements AuthenticatedPrincipal {
    UserType userType;

    String userId;

    String userName;

    String firstName;

    String lastName;

    String email;

    @Override
    public String getName() {
        return userName;
    }

    public String getFullName(){
        return firstName + " " + lastName;
    }
}
