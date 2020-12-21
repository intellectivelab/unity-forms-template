package com.intellective.unity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication(scanBasePackages = {"com.intellective.unity"})
@ConfigurationPropertiesScan
public class UnityApplication {

    public static void main(String... args) {
        ConfigurableApplicationContext context = SpringApplication.run(UnityApplication.class, args);
    }

}

