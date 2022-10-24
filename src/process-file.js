import schema from './schema.js';
import { toRelativePath } from './util.js';

const handleImportFailure = (err, file, st) => {
  st.logger.error(`Failed loading File: ${toRelativePath(file)} - ${err.message}`);
  return {};
};

export default async (file, st) => {
  const res = [];
  st.logger.debug(`Processing ${toRelativePath(file)}`);
  let module = await import(file).catch((e) => handleImportFailure(e, file, st));

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
