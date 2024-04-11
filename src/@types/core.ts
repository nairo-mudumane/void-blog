export interface DbAttr<T = string> {
  id: T
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type DbAttrKeys = keyof DbAttr

export type UndoPartial<T> = { [P in keyof T]-?: T[P] }

export type ApiReturn<T = any> = { message: string; count?: number; data?: T }
