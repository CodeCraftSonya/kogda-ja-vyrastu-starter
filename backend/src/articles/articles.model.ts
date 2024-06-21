import { model, Schema, Types } from 'mongoose';
import { PublishState } from '../../src/types/publish-state';
import type { ITag } from '../tags/tags.model';
import { IUser } from '../users/users.model';

export interface IArticle {
  id: string;
  image: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
  state: PublishState;
  tags: ITag;
  favoredBy: Types.ObjectId[];
  favoredCount: number;
}

const articleSchema = new Schema<IArticle>(
  {
    /**
    * TODO: Описать схему в соответствии с типом IArticle и описанием схемы в swagger
    */
  },
  { 
     /**
    * TODO: Добавить автоматическую генерации даты создания и обновления
    */
   },
);

articleSchema.pre('validate', function (next) {
  if (!this.slug) {
    /**
    * TODO: Генерация уникального slug из title, используйте библиотеку slugify
    */
  }
  this.link = `/article/${this.slug}`;
  next();
});

export const ArticleModel = model<IArticle>('articles', articleSchema);

export type ArticleModel = typeof ArticleModel;
