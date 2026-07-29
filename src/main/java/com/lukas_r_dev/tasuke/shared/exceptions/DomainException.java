package com.lukas_r_dev.tasuke.shared.exceptions;

public class DomainException extends RuntimeException {
    public DomainException(String message) {
        super(message);
    }
}
