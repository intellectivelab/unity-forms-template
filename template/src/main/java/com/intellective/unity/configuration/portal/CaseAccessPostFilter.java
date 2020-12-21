package com.intellective.unity.configuration.portal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellective.unity.model.DomainCase;
import com.intellective.unity.model.UserInfo;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.exception.ZuulException;
import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.util.StreamUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static com.netflix.zuul.context.RequestContext.getCurrentContext;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SEND_RESPONSE_FILTER_ORDER;

public class CaseAccessPostFilter extends ZuulFilter {
    private final PathMatcher pathMatcher = new AntPathMatcher();

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private CaseSecurityChecker caseSecurityChecker;

    public String filterType() {
        return "post";
    }

    public int filterOrder() {
        return SEND_RESPONSE_FILTER_ORDER - 1;
    }

    public boolean shouldFilter() {
        val context = getCurrentContext();
        val proxy = (String) context.get("proxy");

        val requestUri = (String) context.get("requestURI");
        val request = context.getRequest();
        val requestType = request.getMethod();

        return ("case-api".equalsIgnoreCase(proxy) || "case-public-api".equalsIgnoreCase(proxy))
                && "GET".equalsIgnoreCase(requestType)
                && pathMatcher.match("/**/1.0.0/cases/{caseType}/{caseId}", requestUri);
    }

    @SneakyThrows
    public Object run() {
        val context = getCurrentContext();
        val userId = ((UserInfo) context.get("user-info")).getUserId();

        InputStream stream = context.getResponseDataStream();
        String body = StreamUtils.copyToString(stream, StandardCharsets.UTF_8);

        val aCase = mapper.readValue(body, DomainCase.class);

        val valid = caseSecurityChecker.check(aCase, userId);

        if (!valid) {
            throw new ZuulException("Rejected by the filter", HttpServletResponse.SC_FORBIDDEN, "Access is not allowed.");
        }

        context.setResponseBody(body);

        return null;
    }


}
