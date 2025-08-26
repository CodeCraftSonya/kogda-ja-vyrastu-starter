import { Router } from 'express';
import { TagModel } from '../tags/tags.model';
import { UserModel } from '../users/users.model';
import { ArticlesController } from './articles.controller';
import { ArticleModel } from './articles.model';
import {
  validateCreateArticle,
  validateGetArticlesQuery,
  validateSlugParam,
  validateUpdateArticle,
} from './articles.validation';

import {
  authMiddleware,
  currentUserAccessMiddleware,
} from '../middlewares/auth';

const ARTICLES_PATH = '/articles';

const controller = new ArticlesController(ArticleModel, TagModel, UserModel);
const articlesRouter = Router();

/**
 * Заглушка удалить перед реализацией
 */
// articlesRouter.use(ARTICLES_PATH, (req, res) => res.send([]));

articlesRouter.get(ARTICLES_PATH, validateGetArticlesQuery, controller.findAll);
articlesRouter.get(`${ARTICLES_PATH}/:id`, controller.findOne);
articlesRouter.get(
  `${ARTICLES_PATH}/slug/:slug`,
  validateSlugParam,
  controller.findOneBySlug,
);
articlesRouter.post(
  ARTICLES_PATH,
  authMiddleware,
  validateCreateArticle,
  controller.create,
);

articlesRouter.patch(
  `${ARTICLES_PATH}/:id`,
  authMiddleware,
  currentUserAccessMiddleware(ArticleModel, 'id', 'author'),
  validateUpdateArticle,
  controller.update,
);

articlesRouter.delete(
  `${ARTICLES_PATH}/:id`,
  authMiddleware,
  currentUserAccessMiddleware(ArticleModel, 'id', 'author'),
  controller.delete,
);

articlesRouter.post(
  `${ARTICLES_PATH}/:id/favourites`,
  authMiddleware,
  controller.likeArticle,
);

articlesRouter.delete(
  `${ARTICLES_PATH}/:id/favourites`,
  authMiddleware,
  controller.removeLike,
);

/**
 * Удаление лайка
 * TODO: DELETE ARTICLES_PATH/:id/favourites
 * Защищенный маршрут
 */

export default articlesRouter;
