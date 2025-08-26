import { model, Schema, Types } from 'mongoose';
import { PublishState } from '../../src/types/publish-state';
import { IUser } from '../users/users.model';
import slugify from 'slugify';

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
  tags: Types.ObjectId[];
  favoredBy: Types.ObjectId[];
  favoredCount: number;
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    image: {
      type: String,
      required: false,
      match: [
        /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/,
        'Поле image должно быть валидным URL до изображения',
      ],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'tags',
      default: [],
    },
    favoredBy: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
      default: [],
    },
    favoredCount: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      enum: Object.values(PublishState),
      required: true,
      default: PublishState.Draft,
    },
  },
  {
    timestamps: true,
  },
);

articleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

articleSchema.pre('validate', function (this: IArticle, next) {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  this.link = `/article/${this.slug}`;
  next();
});

export const ArticleModel = model<IArticle>('articles', articleSchema);

export type ArticleModel = typeof ArticleModel;
