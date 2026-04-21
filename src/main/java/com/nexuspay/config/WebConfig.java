package com.nexuspay.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // 1. If the resource exists exactly as requested, return it.
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // 2. If it's a route (no extension), try appending .html
                        if (!resourcePath.contains(".") && !resourcePath.startsWith("api/")) {
                            Resource htmlResource = location.createRelative(resourcePath + ".html");
                            if (htmlResource.exists() && htmlResource.isReadable()) {
                                return htmlResource;
                            }
                        }
                        
                        // 3. Fallback to index.html for unknown routes (SPA support)
                        if (!resourcePath.startsWith("api/")) {
                            return location.createRelative("index.html");
                        }
                        
                        return null;
                    }
                });
    }
}
