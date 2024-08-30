interface MentorInterface {
    name: string
    availability: { Monday: boolean[]; Tuesday: boolean[]; Wednesday: boolean[]; Thursday: boolean[]; Friday: boolean[]; };
}

export type { MentorInterface }