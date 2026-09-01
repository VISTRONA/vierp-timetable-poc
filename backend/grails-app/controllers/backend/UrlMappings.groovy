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
        "/api/timetable/classes"(
                controller:"timetable",
                action:"getClasses",
                method:"GET"
        )

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