export interface TaskRequest {
    row: number;
    width: number;
    generation: number;
    r_min: number;
    r_max: number;
    i: number;
    max_iter: number;
    escape: number;
}

export interface TaskAnswer {
    row: number;
    values: Array<number>;
}