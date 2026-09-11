package backend

import org.springframework.web.multipart.MultipartFile

class FileStorageService {

    private final File uploadDirectory =
            new File("../storage/uploads").canonicalFile

    Map save(MultipartFile file) {

        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs()
        }

        String originalFilename = file.originalFilename ?: "timetable.xlsx"

        String safeFilename = originalFilename
                .replaceAll("[^a-zA-Z0-9._-]", "_")

        File destination = new File(uploadDirectory, safeFilename)

        file.transferTo(destination)

        return [
                filename: safeFilename,
                path: destination.absolutePath,
                size: destination.length()
        ]
    }
}