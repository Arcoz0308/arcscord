export type ResultOk<T> = [T, null];
export type ResultError<E> = [null, E];

export type Result<T, E> = ResultOk<T>|ResultError<E>;

export type DebugValues = {[key: string]: unknown};
export type DebugValueString = [key: string, value: string];