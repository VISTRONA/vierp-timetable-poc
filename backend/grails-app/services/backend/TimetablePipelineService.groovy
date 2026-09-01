package backend

class TimetablePipelineService {

    Map runPipeline(String excelFilePath) {

        File projectRoot = new File("..").canonicalFile
        File script = new File(
                projectRoot,
                "database/pipeline/run_pipeline.py"
        ).canonicalFile

        if (!script.exists()) {
            return [
                    success: false,
                    error: "Pipeline script not found."
            ]
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
                "python3",
                script.absolutePath,
                excelFilePath
        )

        processBuilder.directory(
                new File(projectRoot, "database/pipeline")
        )

        processBuilder.redirectErrorStream(true)

        Process process = processBuilder.start()

        String output = process.inputStream.text
        int exitCode = process.waitFor()

        return [
                success: exitCode == 0,
                exitCode: exitCode,
                output: output
        ]
    }
}
