import { FiltersQuery } from '../common/validation';

import { celebrate, Joi, Segments } from 'celebrate';

export interface CreateArticleBody {
  title: string;
  slug: string;
  description: string;
  body: string;
  image?: string;
  tags: string[];
}

export type UpdateArticleBody = Partial<CreateArticleBody>;

export interface GetArticlesQuery extends FiltersQuery {
  author?: string;
  tags?: string[];
  isFavourite?: boolean;
}

export const validateCreateArticle = celebrate({
  [Segments.BODY]: Joi.object<CreateArticleBody>({
    title: Joi.string().min(2).max(30).required(),
    slug: Joi.string().optional(),
    description: Joi.string().required(),
    body: Joi.string().required(),
    image: Joi.string()
      .uri()
      .regex(/\.(jpg|jpeg|png|webp|gif|svg)$/)
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
});

export const validateUpdateArticle = celebrate({
  [Segments.BODY]: Joi.object<UpdateArticleBody>({
    title: Joi.string().min(2).max(30).optional(),
    slug: Joi.string().optional(),
    description: Joi.string().optional(),
    body: Joi.string().optional(),
    image: Joi.string()
      .uri()
      .regex(/\.(jpg|jpeg|png|webp|gif|svg)$/)
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
});

export const validateGetArticlesQuery = celebrate({
  [Segments.QUERY]: Joi.object<GetArticlesQuery>({
    author: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isFavourite: Joi.boolean().optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(0).optional(),
    sort: Joi.string().valid('recent', 'popular').optional(),
  }),
});

export const validateSlugParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    slug: Joi.string().required(),
  }),
});
