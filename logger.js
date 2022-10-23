export default (options) => (
  {
    debug: (msg) => {
      if (options?.debug) {
        console.log(`DEBUG: ${msg}`); /* eslint-disable-line no-console */
      }
    },
    error: (msg) => {
      if (process.env?.NODE_ENV !== 'test') {
        console.error(`ERROR ${msg}`); /* eslint-disable-line no-console */
      }
    },
    info: (msg) => {
      console.log(msg); /* eslint-disable-line no-console */
    },
  }
);
