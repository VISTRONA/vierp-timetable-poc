package backend

class UrlMappings {

    static mappings = {

        // =========================
        // Public API
        // =========================

        "/api/health"(
                controller: "health",
                action: "index",
                method: "GET"
        )

        "/api/timetable/upload"(
                controller: "timetable",
                action: "upload",
                method: "POST"
        )

        // =========================
        // Division APIs
        // =========================

        "/api/timetable/classes"(
                controller: "timetable",
                action: "getClasses",
                method: "GET"
        )

        // =========================
        // Faculty APIs
        // =========================

        "/api/faculties"(
                controller: "timetable",
                action: "getFaculties",
                method: "GET"
        )

        "/api/faculties/$facultyName"(
                controller: "timetable",
                action: "getFacultyTimetable",
                method: "GET"
        )

        "/api/classrooms"(
            controller: "timetable",
            action: "getClassrooms",
            method: "GET"
        )

        "/api/classrooms/$classroomName"(
            controller: "timetable",
            action: "getClassroomTimetable",
            method: "GET"
        )

        // =========================
        // Division timetable
        // =========================

        "/api/timetable/$className"(
                controller: "timetable",
                action: "getTimetable",
                method: "GET"
        )

        // =========================
        // Default Grails routes
        // =========================

        "/$namespace/$controller/$action?/$id?(.$format)?" {
            constraints {
                // apply constraints here
            }
        }

        "/$controller/$action?/$id?(.$format)?" {
            constraints {
                // apply constraints here
            }
        }

        "/"(view: "/index")

        "500"(view: "/error")
        "404"(view: "/notFound")
    }
}