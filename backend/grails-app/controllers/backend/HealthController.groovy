package backend

//import grails.converters.JSON - old thingi

class HealthController {

    def index() {
        render(
                status: 200,
//                service: "vierp-timetable-backend"
                contentType: 'application/json',
                text: groovy.json.JsonOutput.toJson([
                        status: 'ok',
                        'baki sab thik': 'Bas chal raha hai!',
                        service: 'vierp-timetable-backend'
                ])

        )
    }
}
