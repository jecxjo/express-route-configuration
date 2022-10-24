export default (rt, st) => async (req, res, next) => {
  const statusCode = st?.options?.validationErrorStatusCode ?? 422;

  if (rt.config.validate) {
    // Parameters
    if (rt.config.validate.params) {
      const { value, error } = rt.config.validate.params.validate(req.params);
      if (error !== undefined) {
        st.logger.error(
          `${rt.method} ${rt.path} Param Validation - ${error.details[0].message}`
        );
        res.status(statusCode);
        return res.json({ error: error.details[0].message });
      }
      req.params = value;
    }

    // Query
    if (rt.config.validate.query) {
      const { value, error } = rt.config.validate.query.validate(req.query);
      if (error !== undefined) {
        st.logger.error(
          `${rt.method} ${rt.path} Query Validation - ${error.details[0].message}`
        );
        res.status(statusCode);
        return res.json({ error: error.details[0].message });
      }
      req.query = value;
    }

    // Payload
    if (st.options.parsePayload && rt.config.validate.payload) {
      const { value, error } = rt.config.validate.payload.validate(req.body);
      if (error !== undefined) {
        st.logger.error(
          `${rt.method} ${rt.path} Payload Validation - ${error.details[0].message}`
        );
        res.status(statusCode);
        return res.json({ error: error.details[0].message });
      }
      req.body = value;
    }
  }

  // Handle the endpoint
  return rt.config.handler(req, res, next);
};
