package com.intellective.unity.configuration.portal;

import lombok.extern.log4j.Log4j2;
import lombok.val;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Log4j2
public class PortalAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {

    public PortalAuthenticationProcessingFilter() {
        this("/login");
    }

    public PortalAuthenticationProcessingFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
    }

    @Override
    public void afterPropertiesSet() {
        Assert.state(getAuthenticationManager() != null, "Supply an authenticationManager");
        super.afterPropertiesSet();
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        Authentication authentication = extractAuthentication(request);
        return this.getAuthenticationManager().authenticate(authentication);
    }

    private Authentication extractAuthentication(HttpServletRequest request) {
        val token = request.getParameter("token");
        if (StringUtils.isEmpty(token)) {
            throw new BadCredentialsException("Could not obtain access token");
        }
        return new PreAuthenticatedAuthenticationToken(token, "");
    }
}
