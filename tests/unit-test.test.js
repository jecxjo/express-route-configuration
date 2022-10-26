const {
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
} = require('@jest/globals');
const express = require('express');
const supertest = require('supertest');
const routeConfig = require('../dist/cjs/wrapper.js');
const working = require('./routes/working.js');

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

describe('testing non-dynamic imports', () => {
  test('valid import shold be processed', async () => {
    routeConfig(app, working, {
      parsePayload: true,
      debug: true,
    });

    const res = await supertest(app).get('/working');

    expect(res.status).toEqual(200);
    expect(res.body).toStrictEqual({ status: 0 });
  });
});

