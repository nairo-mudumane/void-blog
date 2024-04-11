import { DbAttr, DbAttrKeys } from 'core'

export interface User extends DbAttr {
  name: string
  email: string
  password?: string
}

export type NewUser = Partial<Omit<User, DbAttrKeys>>
