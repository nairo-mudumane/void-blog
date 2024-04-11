import { DbAttr, DbAttrKeys } from '@/@types'

export interface User extends DbAttr {
  name: string
  email: string
  role: RoleUser
  password?: string
}

export type NewUser = Partial<Omit<User, DbAttrKeys>>

export type JwtUser = Pick<User, 'email' | 'id'>

export type LoginUser = Pick<User, 'email' | 'password'>

export type RoleUser = 'admin' | 'blogger'
