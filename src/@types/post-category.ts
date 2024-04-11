import { DbAttr } from './core'
import { User } from './user'

export interface PostCategory extends DbAttr {
  createdBy: User
  createdById: string
  label: string
}

export type NewPostCategory = Partial<Pick<PostCategory, 'label'>>
