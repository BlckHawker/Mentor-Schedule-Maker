interface Mentor {
    name: string
    availability: {[id: string] : boolean[];}
}

class Mentor {
    constructor(name: string, availability: {[id: string] : boolean[];} = {
        "Monday": [false, false, false, false, false, false, false, false],
        "Tuesday": [false, false, false, false, false, false, false, false],
        "Wednesday": [false, false, false, false, false, false, false, false],
        "Thursday": [false, false, false, false, false, false, false, false],
        "Friday": [false, false, false, false, false, false, false, false]
     }) {
        this.name = name;
        this.availability = availability;
    }
}

export type {Mentor}