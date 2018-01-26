export class Point {
    _id?: string;
    name?: string;
    units?: string;
}

export class Group {
    _id?: string;
    name?: string;
    description?: number;
    points?: [Point];
}


export class Location {
    _id?: string;
    name?: string;
    country?: string;
    groups?: [Group];
}

