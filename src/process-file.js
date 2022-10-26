import schema from './schema.js';
import { toRelativePath } from './util.js';

const handleImportFailure = (err, file, st) => {
  st.logger.error(
    `Failed loading File: ${toRelativePath(file)} - ${err.message}`
  );
  return [];
};

export const processFile = async (file, st) => {
  st.logger.debug(`Processing ${toRelativePath(file)}`);

  return import(file)
    .then((module) => {
      const res = [];
      if (module.default !== undefined) {
        module = module.default;
      }
      Object.keys(module).forEach((k) => {
        const check = schema.checkSchema(module[k]);
        if (check.error === undefined) {
          st.logger.debug(`Importing Route: ${k}`);
          res.push(module[k]);
        }
      });

      return res;
    }).
    catch((e) => handleImportFailure(e, file, st));
};

export const processObject = (module, st) => {
  const res = [];
  if (module.default !== undefined) {
    module = module.default;
  }
  Object.keys(module).forEach((k) => {
    const check = schema.checkSchema(module[k]);
    if (check.error === undefined) {
      st.logger.debug(`Importing Route: ${k}`);
      res.push(module[k]);
    }
  });

  return res;
};

export default {};
