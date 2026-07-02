package backend.app.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Slf4j
@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    /**
     * Uploads a file to a Supabase Storage bucket and returns its public URL.
     *
     * @param file       the uploaded file from the multipart request
     * @param bucketName the Supabase bucket to upload to ("assets", "avatars", etc.)
     * @param folder     optional subfolder inside the bucket (e.g. "thumbnails") — pass "" for root
     * @return the public URL of the uploaded file
     */
    public String upload(MultipartFile file, String bucketName, String folder) {
        if (file == null || file.isEmpty()) return null;

        try {
            // Generate a unique filename to prevent collisions
            String extension  = getExtension(file.getOriginalFilename());
            String uniqueName = UUID.randomUUID() + extension;
            String objectPath = folder.isBlank() ? uniqueName : folder + "/" + uniqueName;

            String uploadUrl = supabaseUrl
                    + "/storage/v1/object/"
                    + bucketName + "/"
                    + objectPath;

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("Content-Type", file.getContentType())
                    .header("x-upsert", "false")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200 && response.statusCode() != 201) {
                log.error("Supabase upload failed: {} — {}", response.statusCode(), response.body());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "File upload failed.");
            }

            // Build and return the public URL
            String publicUrl = supabaseUrl
                    + "/storage/v1/object/public/"
                    + bucketName + "/"
                    + objectPath;

            log.info("File uploaded to Supabase: {}", publicUrl);
            return publicUrl;

        } catch (IOException | InterruptedException e) {
            log.error("Upload error: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "File upload failed: " + e.getMessage());
        }
    }

    /**
     * Deletes a file from Supabase Storage given its public URL.
     * Call this when an asset is deleted or its image is replaced.
     */
    public void delete(String publicUrl, String bucketName) {
        if (publicUrl == null || publicUrl.isBlank()) return;

        try {
            // Extract object path from the public URL
            String marker     = "/object/public/" + bucketName + "/";
            int    idx        = publicUrl.indexOf(marker);
            if (idx == -1) return;
            String objectPath = publicUrl.substring(idx + marker.length());

            String deleteUrl = supabaseUrl
                    + "/storage/v1/object/"
                    + bucketName + "/"
                    + objectPath;

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(deleteUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .method("DELETE", HttpRequest.BodyPublishers.noBody())
                    .build();

            client.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("Deleted from Supabase Storage: {}", objectPath);

        } catch (IOException | InterruptedException e) {
            log.warn("Failed to delete file from storage: {}", e.getMessage());
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
