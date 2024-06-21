import { NextFunction, Request, Response } from 'express';
import { FilterQuery, QueryOptions } from 'mongoose';
import type { TagModel } from '../tags/tags.model';
import type { UserModel } from '../users/users.model';
import type { ArticleModel, IArticle } from './articles.model';
import {
  CreateArticleBody,
  GetArticlesQuery,
  UpdateArticleBody,
} from './articles.validation';

export class ArticlesController {
  constructor(
    private articleModel: ArticleModel,
    private tagModel: TagModel,
    private userModel: UserModel,
  ) { }

  updateAndCreateTags = async (bodyTags: string[]) => {
    /**
     * TODO: Добавить логику проверки тегов в базе во избежания дублей
     * bodyTags это массив тегов в формате ["tag1", "tag2"]
     * Используйте метод this.tagModel.find с использованием "$in"
     * Функция проверяет есть ли тег в списке переданных и если его нет в базе, то создает тег
     * Возвращает массив id тегов в формате ["idTag1",  "idTag1"]
     */
    return [];
  };

  create = async (
    req: Request<object, IArticle, CreateArticleBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { title, slug, description, body, tags = [], image } = req.body;
    try {
      let tagsEntity: string[] = [];
      if (tags.length) {
        tagsEntity = await this.updateAndCreateTags(tags);
      }
      /**
      * TODO: Добавить функционал создания статьи
      * Возвращает созданную статью типа IArticle
      */
      return null;
    } catch (err) {

    }
  };

  findAll = async (
    req: Request<object, IArticle[], object, GetArticlesQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        limit = 20,
        offset = 0,
        sort,
        author,
        isFavourite,
      } = req.query;

      const filter: FilterQuery<IArticle> = {};

      if (author) {
        /**
        * TODO: Добавить фильтрацию по автору
        */
      }

      if (isFavourite) {
        /**
        * TODO: Добавить фильтрацию избранных статей текущего пользователя
        */
      }

      const options: QueryOptions<IArticle> = {
        limit,
        skip: offset,
      };

      switch (sort) {
        /**
        * TODO: Описать логику сортировки популярных товаров и по дате
        */
      }

       /**
        * TODO: Поиск с фильтрами и сортировками.
        * Необходимо расширить поля tags и author перед возвратом данных на клиент
        * Возвращает IArticle[]
        */
      res.send([]);
    } catch (error) {
    }

  };

  findOne = async (
    req: Request<{ id: string; }, IArticle>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      /**
        * TODO: Поиск детальной статьи по id.
        * Необходимо расширить поля tags и author перед возвратом данных на клиент
        * Возвращает IArticle
        */
      return res.send(null);
    } catch (error) {
    }

  };

  findOneBySlug = async (
    req: Request<{ slug: string; }, IArticle>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      /**
        * TODO: Поиск детальной статьи по slug.
        * Необходимо расширить поля tags и author перед возвратом данных на клиент
        * Возвращает IArticle
        */
      return res.send(null);
    } catch (error) {
    }

  };

  update = async (
    req: Request<{ id: string; }, IArticle, UpdateArticleBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      if (body.tags.length) {
        body.tags = await this.updateAndCreateTags(body.tags);
      }
      /**
      * TODO: Добавить функционал обновления статьи
      * Возвращает обновленную статью типа IArticle
      */
      res.send(null);
    } catch (error) {
    }

  };

  delete = async (
    req: Request<{ id: string; }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      /**
      * TODO: Добавить функционал удаления статьи
      * Возвращает удаленную статью типа IArticle
      */
      res.status(200).send(null);
    } catch (error) {
    }

  };

  likeArticle = async (
    req: Request<{ id: string; }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      /**
        * TODO: Добавление лайка к статье, добавляется id пользователя поставившего лайк в массив favoredBy, увеличивает поле favoredCount на 1
        * Использовать $addToSet и $inc
        * Необходимо расширить поля tags и author перед возвратом данных на клиент
        * Возвращает IArticle
        */
      return res.status(201).send(null);
    } catch (error) {
    }

  };

  removeLike = async (
    req: Request<{ id: string; }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      /**
        * TODO: Удаление лайка у статьи, удаляет id пользователя поставившего лайк из массива favoredBy, уменьшает поле favoredCount на 1
        * Использовать $pull и $inc
        * Необходимо расширить поля tags и author перед возвратом данных на клиент
        * Возвращает IArticle
        */
      return res.status(200).send(null);
    } catch (error) {
    }
  };
}
