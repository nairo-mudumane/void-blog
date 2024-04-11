import { DbAttr, DbAttrKeys, PostCategory, User } from '.'

export interface Post extends DbAttr<number> {
  createdBy: User
  createdById: string
  category: PostCategory
  categoryId: string
  title: string
  body: string
  media?: string
}

export interface NewPost
  extends Partial<Omit<Post, DbAttrKeys | 'media' | ''>> {
  media: File
  categoryId: string
}
