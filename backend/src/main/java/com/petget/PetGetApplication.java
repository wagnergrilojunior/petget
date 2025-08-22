package com.petget;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Classe principal da aplicação PetGet.
 * Sistema SaaS para gestão de clínicas veterinárias e pet shops.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableTransactionManagement
@EnableAspectJAutoProxy
public class PetGetApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetGetApplication.class, args);
    }
}