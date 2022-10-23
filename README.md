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
