interface FilterInterface {
    day: string,
    time: string,
    noMentors: boolean,
    minMentors: number,
    maxMentors: number,
    names: string[]
}

export type { FilterInterface }