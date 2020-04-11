/**
 * コアモジュール
 */
import * as Express from 'express';
import { check, validationResult } from 'express-validator';

const admin = require('firebase-admin');
const FileType = require('file-type');

/**
 * 定数
 */
import { constant } from 'src/constant';

import { db } from 'src';

export const v_create = [check('image').not().isEmpty()];

// 2MB
const maxsize = 2000000;

interface i_create extends Express.Request {
  body: {
    image: Buffer;
  };
}

// firebaseにアップロード
const upload = async (filename: string, image: Buffer, type: string) => {
  const _bucket = await admin.storage().bucket();

  const _file = _bucket.file(filename);
  await _file.save(image);
  await _file.setMetadata({
    cacheControl: 'public,max-age=3600',
    contentType: type,
  });
};

export const create = async (req: i_create, res: Express.Response) => {
  try {
    if (!validationResult(req).isEmpty()) {
      res.sendStatus(500);
      return;
    }

    const _image = Buffer.from(req.body.image);

    // mimeチェック
    const _type = await FileType.fromBuffer(_image);

    if (
      !(
        _type.mime === 'image/jpeg' ||
        _type.mime === 'image/png' ||
        _type.mime === 'image/gif'
      )
    ) {
      res.sendStatus(500);
      return;
    }

    // 2MB以上は保存しない
    if (_image.length > maxsize) {
      res.sendStatus(500);
      return;
    }

    // ハッシュ生成用
    const _s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const _id =
      [...Array(30)]
        .map(() => _s[Math.floor(Math.random() * _s.length)])
        .join('') +
      new Date().getTime() +
      '.' +
      _type.ext;

    // firebaseに保存
    await upload(_id, Buffer.from(req.body.image), _type.mime);

    // firestoreに保存
    await db.collection(constant.collection_images).add({
      id: _id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.send({ q: _id });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
