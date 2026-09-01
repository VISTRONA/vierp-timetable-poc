package backend

import groovy.json.JsonSlurper

class TimetableJsonService {

    String getJsonDirectory() {
        return "${System.getProperty('user.dir')}/../storage/timetable-json"
    }

    String cleanFilename(String className) {
        return className.replaceAll(/\s+/, "_") + ".json"
    }

    Map getTimetable(String className) {
        String filename = cleanFilename(className)
        File jsonFile = new File(getJsonDirectory(), filename)

        if (!jsonFile.exists()) {
            return null
        }

        def json = new JsonSlurper().parse(jsonFile)
        return json as Map
    }

    List<String> getClasses() {
        File directory = new File(getJsonDirectory())

        if (!directory.exists()) {
            return []
        }

        return directory
                .listFiles()
                .findAll { it.isFile() && it.name.toLowerCase().endsWith(".json") }
                .collect { file ->
                    def json = new JsonSlurper().parse(file)
                    return json.division?.toString()
                }
                .findAll { it != null && !it.trim().isEmpty() }
                .sort()
    }
}