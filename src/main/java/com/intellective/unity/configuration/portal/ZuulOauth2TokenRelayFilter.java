package com.intellective.unity.configuration.portal;

import com.intellective.unity.model.UserInfo;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import lombok.val;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.common.OAuth2AccessToken;

import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

public class ZuulOauth2TokenRelayFilter extends ZuulFilter {

    private OAuth2RestOperations restTemplate;

    public ZuulOauth2TokenRelayFilter(OAuth2RestOperations restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void setRestTemplate(OAuth2RestOperations restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public int filterOrder() {
        return 12;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public boolean shouldFilter() {
        val ctx = RequestContext.getCurrentContext();


        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(it -> it instanceof PortalAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(it -> {
                    ctx.set("user-info", it.getPrincipal());
                    return true;
                }).orElse(false);
    }

    @Override
    public Object run() {
        val ctx = RequestContext.getCurrentContext();

        val accessToken = getAccessToken(ctx);

        ctx.addZuulRequestHeader("authorization",
                accessToken.getTokenType() + " " + accessToken.getValue());
        ctx.addZuulRequestHeader("user-info", ((UserInfo) ctx.get("user-info")).getUserId());
        ctx.addZuulRequestHeader("user-type", "SUBMITTER");

        return null;
    }

    private OAuth2AccessToken getAccessToken(RequestContext ctx) {
        try {
            return restTemplate.getAccessToken();
        } catch (Exception e) {
            // Quite possibly a UserRedirectRequiredException, but the caller
            // probably doesn't know how to handle it, otherwise they wouldn't be
            // using this filter, so we rethrow as an authentication exception
            ctx.set("error.status_code", HttpServletResponse.SC_UNAUTHORIZED);
            throw new BadCredentialsException("Cannot obtain valid access token");
        }
    }
}
