package com.parth.Backend.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map<String, String> uploadResult = cloudinary.uploader()
                .upload(file.getBytes(), Map.of(
                    "folder", "codekids",
                    "resource_type", "auto"
                ));
            return uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }

    public void deleteFile(String url) {
        try {
            String publicId = extractPublicId(url);
            cloudinary.uploader().destroy(publicId, Map.of());
        } catch (IOException e) {
            throw new RuntimeException("File deletion failed", e);
        }
    }

    private String extractPublicId(String url) {
        String[] urlParts = url.split("/");
        String fileName = urlParts[urlParts.length - 1];
        return "codekids/" + fileName.substring(0, fileName.lastIndexOf('.'));
    }
}