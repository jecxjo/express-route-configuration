export default {
  ignoredGet: {
    method: 'GET',
    path: '/ignored',
    config: {
      async handler(req, res) {
        res.send('You should not be getting this message');
      },
    },
  },
};
