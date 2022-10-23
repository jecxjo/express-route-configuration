import glob from 'glob';
import bodyParser from 'body-parser';
import genHandler from './gen-handler.js';
import processFile from './process-file.js';
import Logger from './logger.js';

export default async (app, path, options) => {
  const st = {
    options,
    logger: Logger(options),
  };

  st.logger.debug(`ExpressRouteConfig Options: ${JSON.stringify(options)}`);

  if (options?.parsePayload) {
    app.use(bodyParser.urlencoded({ extended: true }));
    st.logger.debug('Enable Body Parser');
  }

  const files = glob.sync(`${path}/**/*.js`, {
    nodir: true,
    follow: true,
    ignore: options?.ignore || [],
  });

  const procFiles = await Promise.all(files.map((f) => processFile(f, st)));

  procFiles.forEach((pFile) => {
    pFile.forEach((rt) => {
      st.logger.debug(`Creating route: ${rt.method} ${rt.path}`);
      switch (rt.method) {
        case 'POST':
          app.post(rt.path, genHandler(rt, st));
          break;
        case 'PUT':
          app.put(rt.path, genHandler(rt, st));
          break;
        case 'DELETE':
          app.delete(rt.path, genHandler(rt, st));
          break;
        case 'PATCH':
          app.patch(rt.path, genHandler(rt, st));
          break;
        case 'GET':
        default:
          app.get(rt.path, genHandler(rt, st));
          break;
      }
    });
  });
};
