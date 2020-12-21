package com.intellective.unity.configuration.portal;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import com.intellective.unity.exception.BadRequestException;
import com.intellective.unity.exception.ForbiddenException;
import com.intellective.unity.model.UserInfo;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import com.netflix.zuul.http.HttpServletRequestWrapper;
import com.netflix.zuul.http.ServletInputStreamWrapper;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import lombok.val;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.util.StreamUtils;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Supplier;

import static com.netflix.zuul.context.RequestContext.getCurrentContext;


@Log4j2
public class CaseAccessPreFilter extends ZuulFilter {

    private final PathMatcher pathMatcher = new AntPathMatcher();

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private CaseSecurityChecker caseSecurityChecker;

    @Autowired
    private CaseSecurityProperties caseSecurityProperties;

    private final List<Supplier<Boolean>> filters = Arrays.asList(
            queryCaseFilter(),
            createCaseFilter(),
            getCaseFilter(),
            putCaseFilter(),
            defaultCaseFilter()
    );

    private Supplier<Boolean> queryCaseFilter() {
        return () -> {
            val context = getCurrentContext();
            val requestUri = (String) context.get("requestURI");

            if (!pathMatcher.match("/**/1.0.0/cases/{caseType}/query", requestUri)) {
                return false;
            }

            log.debug("PreFilter: /**/1.0.0/cases/{caseType}/query");

            val userFilter = findUserFilter();
            val userId = ((UserInfo) context.get("user-info")).getUserId();

            val body = getRequestBody(context);
            log.trace("Body: {}", body);

            val queryRequest = Optional.ofNullable(stringToMap(body)).orElse(new HashMap<>());
            val queryString = (String) queryRequest.getOrDefault("query", "");
            val userQueryString = userFilter.generateQuery(caseSecurityProperties, userId);
            val newQueryString = queryString.isEmpty() ? userQueryString : String.format("(%s);%s", queryString, userQueryString);

            queryRequest.put("query", newQueryString);
            val modifiedBody = mapToString(queryRequest);
            log.trace("Modified body: {}", modifiedBody);

            setRequestBody(context, modifiedBody);
            return true;
        };
    }

    @SneakyThrows
    private CaseSecurityProperties.UserFilter findUserFilter() {
        val context = getCurrentContext();

        var templateId = context.getRequestQueryParams()
                .getOrDefault("templateId", Collections.emptyList())
                .stream()
                .findFirst()
                .orElse("non-set");

        return caseSecurityProperties.getTemplates().entrySet().stream()
                .filter(it -> templateId.equalsIgnoreCase(it.getKey()))
                .findFirst()
                .map(Map.Entry::getValue)
                .orElseThrow(() -> new ZuulException("Rejected by the filter", HttpServletResponse.SC_FORBIDDEN, "Access is not allowed."));
    }

    private Supplier<Boolean> defaultCaseFilter() {
        return () -> {
            val context = getCurrentContext();
            val requestUri = (String) context.get("requestURI");

            if (!pathMatcher.match("/**/1.0.0/cases/{caseType}/{caseId}/**", requestUri)) {
                return false;
            }

            log.debug("PreFilter: /**/1.0.0/cases/{caseType}/{caseId}/**");

            val requestParameters = extractRequestParameters("/**/1.0.0/cases/{caseType}/{caseId}/**", requestUri);
            val userId = ((UserInfo) context.get("user-info")).getUserId();
            verifyCase(requestParameters, userId);

            return true;
        };
    }

    private Supplier<Boolean> putCaseFilter() {
        return () -> {
            val context = getCurrentContext();
            val requestUri = (String) context.get("requestURI");
            val request = context.getRequest();
            val requestType = request.getMethod();

            if (!("PUT".equalsIgnoreCase(requestType) && pathMatcher.match("/**/1.0.0/cases/{caseType}/{caseId}", requestUri))) {
                return false;
            }

            log.debug("PreFilter: PUT: /**/1.0.0/cases/{caseType}/{caseId}");

            val requestParameters = extractRequestParameters("/**/1.0.0/cases/{caseType}/{caseId}", requestUri);
            val userId = ((UserInfo) context.get("user-info")).getUserId();
            verifyCase(requestParameters, userId);

            val body = getRequestBody(context);
            log.trace("Body: {}", body);

            val params = Optional.ofNullable(stringToMap(body))
                    .orElse(new HashMap<>());
            params.remove(caseSecurityProperties.getAuthorPropertyName());
            params.remove(caseSecurityProperties.getCreatorPropertyName());
            params.remove(caseSecurityProperties.getCreatorEmailPropertyName());
            val modifiedBody = mapToString(params);
            log.trace("Modified body: {}", modifiedBody);

            setRequestBody(context, modifiedBody);
            return true;
        };
    }

    private Supplier<Boolean> getCaseFilter() {
        return () -> {
            val context = getCurrentContext();
            val requestUri = (String) context.get("requestURI");
            val request = context.getRequest();
            val requestType = request.getMethod();

            return "GET".equalsIgnoreCase(requestType) && pathMatcher.match("/**/1.0.0/cases/{caseType}/{caseId}", requestUri);
        };
    }

    private Supplier<Boolean> createCaseFilter() {
        return () -> {
            val context = getCurrentContext();
            val requestUri = (String) context.get("requestURI");
            val request = context.getRequest();
            val requestType = request.getMethod();

            if (!("POST".equalsIgnoreCase(requestType) && pathMatcher.match("/**/1.0.0/cases/*", requestUri))) {
                return false;
            }

            log.debug("PreFilter: POST: /**/1.0.0/cases/*");

            val body = getRequestBody(context);
            log.trace("Body: {}", body);

            val params = Optional.ofNullable(stringToMap(body))
                    .orElse(new HashMap<>());
            val userInfo = (UserInfo) context.get("user-info");
            params.put(caseSecurityProperties.getAuthorPropertyName(), userInfo.getUserId());
            params.put(caseSecurityProperties.getCreatorPropertyName(), userInfo.getFullName());
            params.put(caseSecurityProperties.getCreatorEmailPropertyName(), userInfo.getEmail());

            val modifiedBody = mapToString(params);
            log.trace("Modified body: {}", modifiedBody);

            setRequestBody(context, modifiedBody);
            return true;
        };
    }

    public String filterType() {
        return "pre";
    }

    public int filterOrder() {
        return 13;
    }

    public boolean shouldFilter() {
        val context = getCurrentContext();
        val proxy = (String) context.get("proxy");
        return "case-api".equalsIgnoreCase(proxy) || "case-public-api".equalsIgnoreCase(proxy);
    }

    @SneakyThrows
    public Object run() {
        val context = getCurrentContext();
        val userInfo = (UserInfo) context.get("user-info");

        if (userInfo == null || Strings.isNullOrEmpty(userInfo.getUserId())) {
            throw new ForbiddenException("Anonymous users are note allowed");
        }

        val processed = filters.stream()
                .anyMatch(Supplier::get);

        if (!processed) {
            throw new ZuulException("Rejected by the filter", HttpServletResponse.SC_NOT_FOUND, "Action is not allowed.");
        }

        return null;
    }

    @SneakyThrows
    private void verifyCase(CaseSecurityChecker.CaseIdentity caseIdentity, String userId) {
        val valid = caseSecurityChecker.check(caseIdentity, userId);
        if (!valid) {
            throw new ZuulException("Rejected by the filter", HttpServletResponse.SC_FORBIDDEN, "Access is not allowed.");
        }
    }

    private CaseSecurityChecker.CaseIdentity extractRequestParameters(String pattern, String requestUri) {
        val map = pathMatcher.extractUriTemplateVariables(pattern, requestUri);
        val requestParameters = new CaseSecurityChecker.CaseIdentity(map.get("caseType"), map.get("caseId"));
        if (requestParameters.getCaseId() == null || requestParameters.getCaseType() == null) {
            throw new BadRequestException("CaseType and CaseId can't be null");
        }
        return requestParameters;
    }

    @SneakyThrows
    private String mapToString(Map<String, Object> params) {
        return mapper.writeValueAsString(params);
    }

    @SneakyThrows
    private String getRequestBody(RequestContext context) {
        InputStream in = (InputStream) context.get("requestEntity");
        if (in == null) {
            in = context.getRequest().getInputStream();
        }
        return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
    }

    @SneakyThrows
    private Map<String, Object> stringToMap(String string) {
        TypeReference<HashMap<String, Object>> typeRef = new TypeReference<HashMap<String, Object>>() {
        };
        return mapper.readValue(string, typeRef);
    }

    @SneakyThrows
    private void setRequestBody(RequestContext context, String body) {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        context.setRequest(new HttpServletRequestWrapper(getCurrentContext().getRequest()) {
            @Override
            public ServletInputStream getInputStream() {
                return new ServletInputStreamWrapper(bytes);
            }

            @Override
            public int getContentLength() {
                return bytes.length;
            }

            @Override
            public long getContentLengthLong() {
                return bytes.length;
            }
        });
    }
}































