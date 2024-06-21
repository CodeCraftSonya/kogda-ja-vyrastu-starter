import {
  FiltersQuery
} from '../common/validation';

export interface CreateArticleBody {
  title: string;
  slug: string;
  description: string;
  body: string;
  image?: string,
  tags: string[];
}

export type UpdateArticleBody = Partial<CreateArticleBody>;

export interface GetArticlesQuery extends FiltersQuery {
  author?: string;
  tags?: string[];
  isFavourite?: boolean;
}

/**
  * TODO: Добавить мидлвар валидации body создания статьи
*/

/**
  * TODO: Добавить мидлвар валидации body обновления статьи
*/

/**
  * TODO: Добавить мидлвар валидации QUERY при поиске статей
*/

/**
  * TODO: Добавить мидлвар валидации slug PARAMS в при получении статьи
*/
