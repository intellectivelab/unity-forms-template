package com.intellective.unity.filter;

import com.netflix.zuul.ZuulFilter;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import lombok.val;

import java.util.ArrayList;
import java.util.stream.Collectors;

import static com.netflix.zuul.context.RequestContext.getCurrentContext;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SEND_RESPONSE_FILTER_ORDER;

@Log4j2
public class DebugPostFilter extends ZuulFilter {

    public String filterType() {
        return "post";
    }

    public int filterOrder() {
        return SEND_RESPONSE_FILTER_ORDER - 1;
    }

    public boolean shouldFilter() {
        return log.isTraceEnabled();
    }

    @SneakyThrows
    public Object run() {
        val context = getCurrentContext();

        val request = context.getRequest();
        val requestHeaderNames = request.getHeaderNames();
        val zuulRequestHeaders = context.getZuulRequestHeaders();
        val originResponseHeaders = context.getOriginResponseHeaders();
        val zuulResponseHeaders = context.getZuulResponseHeaders();

        val headerList = new ArrayList<String>();
        while (requestHeaderNames.hasMoreElements()) {
            headerList.add(requestHeaderNames.nextElement());
        }

        log.trace("zuulRequestHeaders: \n{}", headerList.stream()
                .map(it -> it + " - " + request.getHeader(it))
                .collect(Collectors.joining(", \n")));

        log.trace("zuulRequestHeaders: \n{}", zuulRequestHeaders.entrySet().stream()
                .map(it -> it.getKey() + " - " + it.getValue())
                .collect(Collectors.joining(", \n")));
        log.trace("originResponseHeaders: \n{}", originResponseHeaders.stream()
                .map(it -> it.first() + " - " + it.second())
                .collect(Collectors.joining(", \n")));

        log.trace("zuulResponseHeaders: \ncom.vegaecm.vspace.security.CORSFilter{}", zuulResponseHeaders.stream()
                .map(it -> it.first() + " - " + it.second())
                .collect(Collectors.joining(", \n")));

        return null;
    }
}
