/**
 * コアモジュール
 */
import * as Express from 'express';
import { check, validationResult } from 'express-validator';

/**
 * 定数
 */
import { constant } from 'src/constant';

import { db } from 'src';

export const v_search = [check('q').not().isEmpty()];

interface i_search extends Express.Request {
  query: {
    q: string;
  };
}

export const search = async (req: i_search, res: Express.Response) => {
  try {
    if (!validationResult(req).isEmpty()) {
      res.sendStatus(500);
      return;
    }

    const _ret = await db
      .collection(constant.collection_images)
      .where('id', '==', req.query.q)
      .get();

    if (_ret['docs'][0].lengh === 0) {
      res.sendStatus(500);
      return;
    }

    res.send({ q: req.query.q });
  } catch (err) {
    res.sendStatus(500);
  }
};
