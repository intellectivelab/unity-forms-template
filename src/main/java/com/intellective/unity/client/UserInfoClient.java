package com.intellective.unity.client;

import com.intellective.unity.model.UserInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-info-client", url = "${domain-api.uri}/internal/1.0/user-info")
public interface UserInfoClient {

    @GetMapping("/{token}")
    UserInfo getUserInfo(@PathVariable("token") String token);

    @GetMapping()
    UserInfo getUserInfoByUserId(@RequestParam("userId") String userId);
}
