package com.lukas_r_dev.tasuke;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
public class TasukeApplication {

	public static void main(String[] args) {
		SpringApplication.run(TasukeApplication.class, args);
	}

}
