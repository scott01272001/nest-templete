
export interface IPagination {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    total?: number;
}

export interface IResponse<T> {
    data: T[];
    pagination: IPagination;
}