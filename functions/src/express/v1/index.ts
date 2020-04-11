/**
 * コアモジュール
 */
import * as Express from 'express';

import { search, v_search } from 'src/express/v1/search';
import { create, v_create } from 'src/express/v1/create';

const route = '/v1';

export const v1 = (app: Express.Application) => {
  app.get(route + '/search', v_search, search);
  app.post(route + '/create', v_create, create);
};
