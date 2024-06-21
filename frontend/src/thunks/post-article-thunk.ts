import { AxiosError } from 'axios';
import { TAPIError } from '../services/api.types';
import { post as createArticle } from '../services/api/articles';
import { makeErrorObject } from '../services/helpers';
import makeTagList from '../services/helpers/make-tagList';
import {
  articlePostFailed,
  articlePostRequested,
  articlePostSucceeded,
} from '../store';
import { AppThunk } from '../store/store.types';

const postArticleThunk: AppThunk = () => async (dispatch, getState) => {
  try {
    dispatch(articlePostRequested());
    const articleData = getState().forms.article ?? {};
    const {
      title, description, body, image, tags,
    } = articleData;

    if (!title || !description || !body) {
      throw new Error('Can\'t save article');
    }

    const tagList = makeTagList(tags || '');

    await createArticle({
      title,
      description,
      body,
      image: image ?? undefined,
      tags: tagList,
    });
    dispatch(articlePostSucceeded());
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(
        articlePostFailed(makeErrorObject(error as AxiosError<TAPIError>)),
      );
    } else {
      dispatch(articlePostFailed(error as TAPIError));
    }
  }
};

export default postArticleThunk;
