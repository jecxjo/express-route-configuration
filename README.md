# express-route-configuration

This project is a utility module that allows you to write your route
configuration and validation in the controller module itself. The modules are
auto-detected and the routes created without having to manually set them.

## Usage

Supports both ESM and CommonJS.

### ESM

**server.js**

```js
import express from 'express';
import routeConfig from 'express-route-configuration';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

routeConfig(app, path.join(dirname, 'routes'));

app.listen(3000);
```

**routes/hello.js**

```js
import Joi from 'joi';

export default {
  helloWorld: {
    method: 'GET',
    path: '/hello/:name',
    config: {
      validate: {
        params: Joi.object({
          name: Joi.string().required(),
        }),
        query: Joi.object({
          age: Joi.number().min(0).max(100).optional(),
        }),
      },
      async handler(req, res) {
        if (req.query.age) {
          res.send(`Hello ${req.params.name}, age ${req.query.age}`);
        } else {
          res.send(`Hello ${req.params.name}, of unknown age`);
        }
      },
    },
  },
};
```

### CommonJS

**server.js**

```js
const express = require('express');
const routeConfig = require('express-route-configuration');
const path = require('path');

const app = express();

routeConfig(app, path.join(__dirname, 'routes'));

app.listen(3000);
```

**routes/hello.js**

```js
const Joi = require('joi');

exports.hello = {
  path: '/hello',
  method: 'GET',
  config: {
    validate: {
      params: Joi.object({
        name: Joi.string().required(),
      }),
      query: Joi.object({
        age: Joi.number().min(0).max(100).optional(),
      }),
    },
    async handler(req, res) {
      res.send('Hello world');
    },
  },
};
```

The route is created automatically based on the discovery path. URL Parameters,
query string and payload values are checked for their type and if matches the
schema the handler is called.

## Options:

`routeConfig(app, path, options)` task the following options:

- `app`: The instance of Express
- `path`: A path string where to search for routes
- `options`: Additional optional configuration parameters

Additional optional config includes:

- `parsePayload`: If true, use `body-parser` to convert payload body to object
- `ignore`: An array of paths and files to ignore when search for controllers
- `validationErrorStatusCode`: The HTTP Status Code to issue when validation fails, normally 422
- `debug`: More verbose logging

## Controllers:

The controller modules are fairly simple in their setup. Create an exported
object with the following schema:

```
{
  method: String('GET', 'POST', 'UPDATE', 'PUT', 'PATCH', 'DELETE'),
  path: String(),
  config: {
    validate: {
      params: optional JoiObject(),
      query: optional JoiObject(),
      payload: optional JoiObject(),
    },
    handler: async function(req, res),
  },
}
```

The `path` string follows the express.js format using a colon to define a
variable, `/path/:variable`.

Validation fields use Joi, documentation [here](https://joi.dev/api/).

## Building

To build both the ESM and CommonJS distribution run the script `npm run build`.

**TODO** Add more details on exactly what happens

## Issue

There is a problem with V8's support of dynamic imports and how `jest` works
with in band testing. This means using dynamic imports can be hit or miss. As a
unit test option the main entry point now can take a string path or the
imported controller module. If your unit tests fail try converting to something
along these lines.

```js

import express from 'express';
import configRoutes from 'express-route-configuration'
import helloRoutes from '../../controller/hello.js'

test('testing routes', async () => {
  const app = express();
  configRoutes(app, helloRoutes { debug: true });

  // Normal test accessing routes
});

```
