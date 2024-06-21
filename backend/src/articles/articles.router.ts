import { Router } from 'express';
import { TagModel } from '../tags/tags.model';
import { UserModel } from '../users/users.model';
import { ArticlesController } from './articles.controller';
import { ArticleModel } from './articles.model';

const ARTICLES_PATH = '/articles';

const controller = new ArticlesController(ArticleModel, TagModel, UserModel);
const articlesRouter = Router();

/**
  * Заглушка удалить перед реализацией
*/
articlesRouter.use(ARTICLES_PATH, (req, res) => res.send([]));

/**
  * Поиск всех статей с фильтрацией через query параметры
  * TODO: GET ARTICLES_PATH
*/

/**
  * Поиск всех статей по ее id
  * TODO: GET ARTICLES_PATH/:id
*/

/**
  * Поиск всех статей по ее slug
  * TODO: GET ARTICLES_PATH/slug/:slug
  * Добавить валидацию переданного PARAMS c помощью celebrate
*/

/**
  * Создании статьи
  * TODO: POST ARTICLES_PATH
  * Защищенный маршрут
  * Добавить валидацию body c помощью celebrate
*/

/**
  * Обновление статьи
  * TODO: PATCH ARTICLES_PATH/:id
  * Защищенный маршрут
  * Добавить валидацию body c помощью celebrate
  * Проверить права пользователя
*/

/**
  * Удаление статьи
  * TODO: DELETE ARTICLES_PATH/:id
  * Защищенный маршрут
  * Проверить права пользователя
*/

/**
  * Установка лайка
  * TODO: POST ARTICLES_PATH/:id/favourites
  * Защищенный маршрут
*/

/**
  * Удаление лайка
  * TODO: DELETE ARTICLES_PATH/:id/favourites
  * Защищенный маршрут
*/

export default articlesRouter;
