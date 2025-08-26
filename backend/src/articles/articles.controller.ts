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
  ) {}

  updateAndCreateTags = async (bodyTags: string[]) => {
    if (!bodyTags || bodyTags.length === 0) return [];

    // 1️⃣ Находим все существующие теги из базы, которые совпадают с bodyTags
    const existingTags = await this.tagModel.find({
      label: { $in: bodyTags },
    });

    // 2️⃣ Сохраняем найденные ID
    const existingTagIds = existingTags.map((tag) => tag._id.toString());

    // 3️⃣ Определяем теги, которых нет в базе
    const existingLabels = existingTags.map((tag) => tag.label);
    const newLabels = bodyTags.filter((tag) => !existingLabels.includes(tag));

    // 4️⃣ Создаём новые теги
    const newTags = await this.tagModel.insertMany(
      newLabels.map((label) => ({ label })),
    );

    const newTagIds = newTags.map((tag) => tag._id.toString());

    // 5️⃣ Возвращаем объединённый массив ID (существующие + новые)
    return [...existingTagIds, ...newTagIds];
  };

  create = async (
    req: Request<object, IArticle, CreateArticleBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { title, slug, description, body, tags = [], image } = req.body;
      const tagIds = tags.length ? await this.updateAndCreateTags(tags) : [];

      const article = await this.articleModel.create({
        title,
        slug,
        description,
        body,
        tags: tagIds,
        image,
        author: req.user.id, // допустим, req.user есть
      });

      await (article as any).populate('tags').populate('author');

      res.status(201).send(article);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (
    req: Request<object, IArticle[], object, GetArticlesQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { limit = 20, offset = 0, sort, author, isFavourite } = req.query;

      const filter: FilterQuery<IArticle> = {};

      if (author) filter.author = author;

      if (isFavourite && req.user) {
        filter.favoredBy = req.user.id;
      }

      const options: QueryOptions<IArticle> = {
        limit,
        skip: offset,
      };

      let query = this.articleModel
        .find(filter, null, options)
        .populate('tags')
        .populate('author');

      if (sort === 'popular') query = query.sort({ favoredCount: -1 });
      else query = query.sort({ createdAt: -1 });

      const articles = await query.exec();
      res.send(articles);
    } catch (err) {
      next(err);
    }
  };

  findOne = async (
    req: Request<{ id: string }, IArticle>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const article = await this.articleModel
        .findById(req.params.id)
        .populate('tags')
        .populate('author');
      if (!article)
        return res.status(404).send({ message: 'Article not found' });
      res.send(article);
    } catch (err) {
      next(err);
    }
  };

  findOneBySlug = async (
    req: Request<{ slug: string }, IArticle>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const article = await this.articleModel
        .findOne({ slug: req.params.slug })
        .populate('tags')
        .populate('author');
      if (!article)
        return res.status(404).send({ message: 'Article not found' });
      res.send(article);
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request<{ id: string }, IArticle, UpdateArticleBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      if (body.tags.length) {
        body.tags = await this.updateAndCreateTags(body.tags);
      }
      const article = await this.articleModel
        .findByIdAndUpdate(req.params.id, body, { new: true })
        .populate('tags')
        .populate('author');
      if (!article)
        return res.status(404).send({ message: 'Article not found' });
      res.send(article);
    } catch (err) {
      next(err);
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const article = await this.articleModel
        .findByIdAndDelete(req.params.id)
        .populate('tags')
        .populate('author');
      if (!article)
        return res.status(404).send({ message: 'Article not found' });
      res.send(article);
    } catch (err) {
      next(err);
    }
  };

  likeArticle = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const article = await this.articleModel
        .findByIdAndUpdate(
          req.params.id,
          { $addToSet: { favoredBy: req.user.id }, $inc: { favoredCount: 1 } },
          { new: true },
        )
        .populate('tags')
        .populate('author');

      if (!article)
        return res.status(404).send({ message: 'Article not found' });
      res.status(201).send(article);
    } catch (err) {
      next(err);
    }
  };

  removeLike = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const article = await this.articleModel
        .findByIdAndUpdate(
          req.params.id,
          { $pull: { favoredBy: req.user.id }, $inc: { favoredCount: -1 } },
          { new: true },
        )
        .populate('tags')
        .populate('author');

      if (!article)
        return res.status(404).send({ message: 'Article not found' });
      res.send(article);
    } catch (err) {
      next(err);
    }
  };
}
