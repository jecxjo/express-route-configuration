import Joi from 'joi';

export default {
  validateParams: {
    method: 'GET',
    path: '/validate/:name/:age',
    config: {
      validate: {
        params: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().min(1).max(20).required(),
        }),
      },
      async handler(req, res) {
        res.json({ name: req.params.name, age: req.params.age });
      },
    },
  },

  validateQuery: {
    method: 'GET',
    path: '/validate/query',
    config: {
      validate: {
        query: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().min(1).max(20).required(),
        }),
      },
      async handler(req, res) {
        res.json({ name: req.query.name, age: req.query.age });
      },
    },
  },
};
