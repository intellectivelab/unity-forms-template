package com.intellective.unity.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Collection;
import java.util.Optional;

public class DeepAuthentication extends AbstractAuthenticationToken implements
        Serializable {

    private static final long serialVersionUID = 1L;
    private final Object principal;

    /**
     * Creates a token with the supplied array of authorities.
     */
    public DeepAuthentication(Object principal) {
        this(principal, null);
    }

    public DeepAuthentication(Object principal, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = Optional.ofNullable(principal).orElse("anonymous");
        super.setAuthenticated(true); // must use super, as we override
    }

    @Override
    public Object getCredentials() {
        return "";
    }

    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException(
                    "Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        }

        super.setAuthenticated(false);
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}
