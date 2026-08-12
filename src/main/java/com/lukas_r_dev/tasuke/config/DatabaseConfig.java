package com.lukas_r_dev.tasuke.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Suporta a variável DATABASE_URL (ex.: postgresql://user:pass@host:port/db) usada
 * por plataformas como Render/Heroku. Quando ausente, mantém o comportamento padrão
 * do Spring Boot (spring.datasource.*).
 */
@Configuration
public class DatabaseConfig {

    @Bean
    DataSource dataSource(DataSourceProperties properties) {
        DataSourceBuilder<?> builder = properties.initializeDataSourceBuilder();

        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            URI uri = URI.create(databaseUrl);
            String userInfo = uri.getUserInfo() == null ? "" : uri.getUserInfo();
            String[] parts = userInfo.split(":", 2);
            builder.url("jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath())
                    .username(parts[0])
                    .password(parts.length > 1 ? parts[1] : "");
        }

        return builder.build();
    }
}
