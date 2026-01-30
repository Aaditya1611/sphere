package com.chatapp.web.message.media;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class MediaFileController {
    
    private static final String CHAT_MEDIA_UPLOAD_DIR = "/home/rocks/Work/sphere-user-media-data/chatMediaUploads/";
    private static final String USER_PROFILE_PICS_DIR = "/home/rocks/Work/sphere-user-media-data/usersProfilePic/";


    @PostMapping("/uploadMediaFiles")
    public ResponseEntity<?> uploadMediaFile(@RequestParam("file") MultipartFile file) {
        
        try {
            
            File directory = new File(CHAT_MEDIA_UPLOAD_DIR);
            if(!directory.exists()) directory.mkdirs();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(CHAT_MEDIA_UPLOAD_DIR + fileName);

            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploadMediaFiles/" + fileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed");
        }
    }

    @PostMapping("/uploadProfilePic")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        
        try {

            File directory = new File(USER_PROFILE_PICS_DIR);
            if(!directory.exists()) directory.mkdirs();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(USER_PROFILE_PICS_DIR + fileName);

            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploadProfilePic/" + fileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Profile pic upload failed");
        }
    }
    

                                /// ***** Will use this method to download a media file later on instead of returning the media URL ***** ///

//     @GetMapping("/getMediaFiles{filename}")
//     public ResponseEntity<?> getMediaFile(@PathVariable String filename) {

//         try {

//             // Sanitize filename to prevent directory traversal attacks
//             Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();

//             // Ensure the resulting path is actually inside our upload directory
//             if(!filePath.startsWith(UPLOAD_DIR)) {
//                 return ResponseEntity.badRequest().build();
//             }

//             Resource resource = new UrlResource(filePath.toUri());

//             if(resource.exists() && resource.isReadable()) {

//                 // Determine content type
//                 String contentType = Files.probeContentType(filePath);
//                 if(contentType == null) {
//                     contentType = "application/octate-stream"; // Default binary type
//                 }
//                 return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
//             }
//             else {
//                 return ResponseEntity.notFound().build();
//             }

//         }catch (Exception e) {
//             return ResponseEntity.internalServerError().build();
//         }
//    }
    
}