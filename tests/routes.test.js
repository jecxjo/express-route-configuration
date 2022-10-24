const {
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
} = require('@jest/globals');
const express = require('express');
const supertest = require('supertest');
const path = require('path');
const routeConfig = require('../dist/cjs/wrapper.js');

let app = null;
let shutdown = () => {};

beforeEach(() => {
  app = express();
  const server = app.listen(3000);
  shutdown = () => {
    server.close();
  };
});

afterEach(() => {
  shutdown();
  shutdown = () => {};
});

describe('testing working routes', () => {
  describe('testing methods', () => {
    test('GET 200', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app).get('/working');

      expect(res.status).toEqual(200);
      expect(res.body).toStrictEqual({ status: 0 });
    });

    test('GET 404', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app).get('/not-working');

      expect(res.status).toEqual(404);
    });

    test('POST 200', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      // TODO: Check payload data once supertest bug fixed
      const res = await supertest(app)
        .post('/working/post')
        .field('name', 'joe')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(200);
    });

    test('POST 404', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app)
        .post('/not-working/post')
        .field('name', 'joe')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(404);
    });

    test('PUT 200', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      // TODO: Check payload data once supertest bug fixed
      const res = await supertest(app)
        .put('/working/put')
        .field('name', 'joe')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(200);
    });

    test('PUT 404', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app)
        .put('/not-working/put')
        .field('name', 'joe')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(404);
    });

    test('DELETE 200', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      // TODO: Check payload data once supertest bug fixed
      const res = await supertest(app).delete('/working/delete');

      expect(res.status).toEqual(200);
    });

    test('DELETE 404', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app)
        .delete('/not-working/delete')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(404);
    });

    test('PATCH 200', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      // TODO: Check payload data once supertest bug fixed
      const res = await supertest(app)
        .patch('/working/patch')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(200);
    });

    test('PATCH 404', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app)
        .patch('/not-working/patch')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(404);
    });
  });

  describe('validation', () => {
    describe('parameters', () => {
      test('parameters in URL match when all exist', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
        });

        const res = await supertest(app)
          .get('/validate/joe/12')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body).toStrictEqual({ name: 'joe', age: 12 });
      });

      test('when params fail, still success result but error provided to handler', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
        });

        const res = await supertest(app)
          .get('/validate/12/joe')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(422);
        expect(res.body).toStrictEqual({ error: '"age" must be a number' });
      });

      test('returns configured status code when failed', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
          validationErrorStatusCode: 400,
        });

        const res = await supertest(app)
          .get('/validate/12/joe')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(400);
        expect(res.body).toStrictEqual({ error: '"age" must be a number' });
      });
    });

    describe('query', () => {
      test('query in URL match when all exist', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
        });

        const res = await supertest(app)
          .get('/validate/query?name=joe&age=12')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(200);
        expect(res.body).toStrictEqual({ name: 'joe', age: 12 });
      });

      test('query fails when missing required variable', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
        });

        const res = await supertest(app)
          .get('/validate/query?name=joe')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(422);
        expect(res.body).toStrictEqual({ error: '"age" is required' });
      });

      test('query fails when variable is wrong type', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
        });

        const res = await supertest(app)
          .get('/validate/query?name=joe&age=twelve')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(422);
        expect(res.body).toStrictEqual({ error: '"age" must be a number' });
      });

      test('query fail returns custom status code', async () => {
        routeConfig(app, path.join(__dirname, 'routes'), {
          parsePayload: true,
          validationErrorStatusCode: 400,
        });

        const res = await supertest(app)
          .get('/validate/query?name=joe&age=twelve')
          .set('Accept', 'application/json');

        expect(res.status).toEqual(400);
        expect(res.body).toStrictEqual({ error: '"age" must be a number' });
      });
    });

    // TODO: Add payload unit tests when bug in supertest is fixed
  });

  describe('Configuration Options', () => {
    test('verify route works when not in ignore list', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
      });

      const res = await supertest(app)
        .get('/ignored')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(200);
    });
    test('ignored controller when in arg list', async () => {
      routeConfig(app, path.join(__dirname, 'routes'), {
        parsePayload: true,
        ignore: ['**/ignore.js'],
      });

      const res = await supertest(app)
        .get('/ignored')
        .set('Accept', 'application/json');

      expect(res.status).toEqual(404);
    });
  });
});
