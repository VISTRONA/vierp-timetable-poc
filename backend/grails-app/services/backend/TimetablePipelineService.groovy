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
                    error: "Pipeline script not found: ${script.absolutePath}"
            ]
        }

        String pythonCommand = findPythonCommand()

        if (pythonCommand == null) {
            return [
                    success: false,
                    error: "Python was not found. Install Python and make sure it is available in PATH."
            ]
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonCommand,
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

    private String findPythonCommand() {

        List<String> commands = [
                "python3",
                "python"
        ]

        for (String command : commands) {
            try {
                Process process = new ProcessBuilder(
                        command,
                        "--version"
                )
                        .redirectErrorStream(true)
                        .start()

                int exitCode = process.waitFor()

                if (exitCode == 0) {
                    return command
                }
            } catch (Exception ignored) {
            }
        }

        return null
    }
}