interface Mentor {
    name: string
    schedule: {[id: string] : boolean[];}
}

interface Schedule {

}
class Mentor {
    constructor(name: string, schedule: {[id: string] : boolean[];} = {
        "Monday": [false, false, false, false, false, false, false, false],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [false, false, false, false, false, false, false, false],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [false, false, false, false, false, false, false, false]
     }) {
        this.name = name;
        //! really hate this is just an array
        //9 10 11 12 1 2 3 4 5
        this.schedule = schedule;
    }
}