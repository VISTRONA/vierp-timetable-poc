package backend

import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest

class TimetableController {

    TimetableUploadService timetableUploadService
    TimetableJsonService timetableJsonService

    def upload() {

        if (!(request instanceof MultipartHttpServletRequest)) {
            render(
                    status: 400,
                    contentType: 'application/json',
                    text: groovy.json.JsonOutput.toJson([
                            success: false,
                            error: [
                                    code: 'INVALID_MULTIPART_REQUEST',
                                    message: 'Request must be multipart/form-data.'
                            ]
                    ])
            )
            return
        }

        MultipartHttpServletRequest multipartRequest =
                (MultipartHttpServletRequest) request

        MultipartFile file = multipartRequest.getFile("file")

        Map result = timetableUploadService.handleUpload(file)

        if (!result.success) {
            render(
                    status: result.status,
                    contentType: 'application/json',
                    text: groovy.json.JsonOutput.toJson([
                            success: false,
                            error: result.error
                    ])
            )
            return
        }

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        success: true,
                        filename: result.filename,
                        message: 'File passed initial validation.'
                ])
        )
    }
    def getTimetable(String className) {

        Map timetable = timetableJsonService.getTimetable(className)

        if (timetable == null) {
            render(
                    status: 404,
                    contentType: 'application/json',
                    text: groovy.json.JsonOutput.toJson([
                            success: false,
                            error: [
                                    code: 'TIMETABLE_NOT_FOUND',
                                    message: "No timetable found for class '${className}'."
                            ]
                    ])
            )
            return
        }

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        success: true,
                        data: timetable
                ])
        )
    }
    def getClasses() {

        List<String> classes = timetableJsonService.getClasses()

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        success: true,
                        data: classes
                ])
        )
    }
    def getFaculties() {

        List<String> faculties = timetableJsonService.getFaculties()

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        success: true,
                        data: faculties
                ])
        )
    }
    def getClassrooms() {
        List<String> classrooms = timetableJsonService.getClassrooms()

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                success: true,
                data: classrooms
                ])
        )
    }


    def getFacultyTimetable(String facultyName) {

        Map timetable =
                timetableJsonService.getFacultyTimetable(facultyName)

        if (timetable == null) {

                render(
                        status: 404,
                        contentType: 'application/json',
                        text: groovy.json.JsonOutput.toJson([
                                success: false,
                                error: [
                                        code: 'FACULTY_TIMETABLE_NOT_FOUND',
                                        message: "No timetable found for faculty '${facultyName}'."
                                ]
                        ])
                )

                return
        }

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        success: true,
                        data: timetable
                ])
        )
    }
    def getClassroomTimetable(String classroomName) {
        Map timetable = timetableJsonService.getClassroomTimetable(classroomName)

        if (timetable == null) {
                render(
                status: 404,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        success: false,
                        error: [
                        code: 'CLASSROOM_TIMETABLE_NOT_FOUND',
                        message: "No timetable found for classroom '${classroomName}'."
                        ]
                ])
                )
                return
        }

        render(
                status: 200,
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                success: true,
                data: timetable
                ])
        )
   }
}