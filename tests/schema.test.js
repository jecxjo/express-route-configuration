import { describe, expect, test } from '@jest/globals';
import schema from '../src/schema.js';

describe('valid schema', () => {
  test('minimal requirements', () => {
    const obj = {
      method: 'GET',
      path: '/hello',
      config: {
        handler: (
          req,
          res,
          next
        ) => {} /* eslint-disable-line no-unused-vars */,
      },
    };
    const res = schema.checkSchema(obj);
    expect(res.value).toEqual(obj);
  });
});

describe('invalid schema', () => {
  test('missing method', () => {
    const obj = {
      path: '/hello',
      config: {
        handler: (
          req,
          res,
          next
        ) => {} /* eslint-disable-line no-unused-vars */,
      },
    };
    const res = schema.checkSchema(obj);
    expect(res.value).toEqual(obj);
    expect(res.error.name).toBe('ValidationError');
    expect(res.error.details.length).toBe(1);
    expect(res.error.details[0].context.key).toBe('method');
  });
});
