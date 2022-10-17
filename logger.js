export default (options) => (
  {
    debug: (msg) => {
      if (options.debug) {
        console.log(`DEBUG: ${msg}`); /* eslint-disable-line no-console */
      }
    },
    error: (msg) => {
      console.error(`ERROR ${msg}`); /* eslint-disable-line no-console */
    },
    info: (msg) => {
      console.log(msg); /* eslint-disable-line no-console */
    },
  }
);
