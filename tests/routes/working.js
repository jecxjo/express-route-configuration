export default {
  workingGet: {
    method: 'GET',
    path: '/working',
    config: {
      async handler(req, res) {
        res.json({ status: 0 });
      },
    },
  },

  workingPost: {
    method: 'POST',
    path: '/working/post',
    config: {
      async handler(req, res) {
        res.json({ payload: req.body });
      },
    },
  },

  workingUpdate: {
    method: 'UPDATE',
    path: '/working/update',
    config: {
      async handler(req, res) {
        res.json({ payload: req.body });
      },
    },
  },

  workingPut: {
    method: 'PUT',
    path: '/working/put',
    config: {
      async handler(req, res) {
        res.json({ payload: req.body });
      },
    },
  },

  workingPatch: {
    method: 'PATCH',
    path: '/working/patch',
    config: {
      async handler(req, res) {
        res.json({ payload: req.body });
      },
    },
  },

  workingDelete: {
    method: 'DELETE',
    path: '/working/delete',
    config: {
      async handler(req, res) {
        res.json({ status: 0 });
      },
    },
  },
};
