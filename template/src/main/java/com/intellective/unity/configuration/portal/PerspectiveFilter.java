package com.intellective.unity.configuration.portal;

import com.netflix.zuul.ZuulFilter;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import lombok.val;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

import static com.netflix.zuul.context.RequestContext.getCurrentContext;

@Log4j2
public class PerspectiveFilter extends ZuulFilter {

    private final PathMatcher pathMatcher = new AntPathMatcher();

    public String filterType() {
        return "pre";
    }

    public int filterOrder() {
        return 13;
    }

    public boolean shouldFilter() {
        val context = getCurrentContext();
        val requestUri = (String) context.get("requestURI");
        val request = context.getRequest();
        val requestType = request.getMethod();

        return "GET".equalsIgnoreCase(requestType) && pathMatcher.match("/**/api/1.0.0/config/perspectives/internal", requestUri);
    }

    @SneakyThrows
    public Object run() {
        val context = getCurrentContext();
        val requestUri = (String) context.get("requestURI");

        log.debug("PerspectiveFilter: GET /**/api/1.0.0/config/perspectives/internal");

        context.set("requestURI", requestUri.replace("/internal", "/external"));

        return null;
    }

}