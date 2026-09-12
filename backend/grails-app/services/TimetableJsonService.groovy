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
                .unique()
                .sort()

    }


    List<String> getFaculties() {

        File directory = new File(getJsonDirectory())

        if (!directory.exists()) {

            return []

        }

        Set<String> faculties = new HashSet<>()

        directory
                .listFiles()
                .findAll { it.isFile() && it.name.toLowerCase().endsWith(".json") }
                .each { file ->

                    def json = new JsonSlurper().parse(file)

                    json.entries?.each { entry ->

                        String teacher = entry.teacher?.toString()?.trim()

                        if (teacher) {

                            faculties.add(teacher)

                        }

                    }

                }

        return faculties.toList().sort()

    }

    List<String> getClassrooms() {
        File directory = new File(getJsonDirectory())

        if (!directory.exists()) {
            return []
        }

        Set<String> classrooms = new HashSet<>()

        directory
                .listFiles()
                .findAll { it.isFile() && it.name.toLowerCase().endsWith(".json") }
                .each { file ->
                    def json = new JsonSlurper().parse(file)

                    json.entries?.each { entry ->
                        String room = entry.room?.toString()?.trim()

                        if (room) {
                            classrooms.add(room)
                        }
                    }
                }

        return classrooms.toList().sort()
    }

    Map getFacultyTimetable(String facultyName) {

        File directory = new File(getJsonDirectory())

        if (!directory.exists()) {

            return null

        }

        List<Map> facultyEntries = []

        directory
                .listFiles()
                .findAll { it.isFile() && it.name.toLowerCase().endsWith(".json") }
                .each { file ->

                    def json = new JsonSlurper().parse(file)

                    json.entries?.each { entry ->

                        String teacher = entry.teacher?.toString()?.trim()

                        if (teacher &&
                                teacher.equalsIgnoreCase(facultyName?.trim())) {

                            facultyEntries.add(entry as Map)

                        }

                    }

                }

        if (facultyEntries.isEmpty()) {

            return null

        }

        return [
                faculty: facultyName,
                entries: facultyEntries
        ]

    }
    Map getClassroomTimetable(String classroomName) {
        File directory = new File(getJsonDirectory())

        if (!directory.exists()) {
            return null
        }

        List<Map> classroomEntries = []

        directory
                .listFiles()
                .findAll { it.isFile() && it.name.toLowerCase().endsWith(".json") }
                .each { file ->
                    def json = new JsonSlurper().parse(file)

                    json.entries?.each { entry ->
                        String room = entry.room?.toString()?.trim()

                        if (room &&
                                room.equalsIgnoreCase(classroomName?.trim())) {
                            classroomEntries.add(entry as Map)
                        }
                    }
                }

        if (classroomEntries.isEmpty()) {
            return null
        }

        return [
                classroom: classroomName,
                entries: classroomEntries
        ]
    }
}