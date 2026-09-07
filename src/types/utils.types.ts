export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
