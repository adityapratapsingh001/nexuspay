package com.nexuspay.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class EncryptionService {

    @Value("${encryption.key:32charslongsecretkey1234567890!!}")
    private String encryptionKey;

    public String decrypt(String encryptedData) throws Exception {
        String[] parts = encryptedData.split(":");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid encrypted data format");
        }

        byte[] iv = HexFormat.of().parseHex(parts[0]);
        byte[] encryptedBytes = HexFormat.of().parseHex(parts[1]);

        byte[] keyBytes = encryptionKey.length() == 64 ? HexFormat.of().parseHex(encryptionKey) : encryptionKey.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv));

        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    public String encrypt(String data) throws Exception {
        byte[] iv = new byte[16];
        new java.security.SecureRandom().nextBytes(iv);
        
        byte[] keyBytes = encryptionKey.length() == 64 ? HexFormat.of().parseHex(encryptionKey) : encryptionKey.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(iv));

        byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(iv) + ":" + HexFormat.of().formatHex(encryptedBytes);
    }
}
