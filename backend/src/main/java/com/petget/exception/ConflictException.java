package com.petget.exception;

/**
 * Exceção lançada quando há conflito de dados (ex: duplicação).
 */
public class ConflictException extends RuntimeException {
    
    public ConflictException(String message) {
        super(message);
    }
    
    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}