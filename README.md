# express-route-configuration

This project is a utility module that allows you to write your route
configuration and validation in the controller module itself. The modules are
auto-detected and the routes created without having to manually set them.

## Usage

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

The route is created automatically based on the discovery path. URL Parameters,
query string and payload values are checked for their type and if matches the
schema the handler is called.
