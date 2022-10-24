import Joi from 'joi';

const schema = Joi.object({
  method: Joi.string().pattern(/^GET$|^POST$|^PUT$|^DELETE$|^PATCH$/).required(),
  path: Joi.string().required(),
  config: Joi.object({
    validate: Joi.object({
      payload: Joi.object().optional(),
      params: Joi.object().optional(),
      query: Joi.object().optional(),
      errorHandler: Joi.function().optional(),
    }).optional(),
    handler: Joi.function().minArity(2).maxArity(3).required(),
  }).required(),
});

const checkSchema = (obj) => schema.validate(obj);

export default {
  checkSchema,
};
