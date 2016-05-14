const fetch = function () {

  let pending = [];

  return function ({ http = [] }) {

    const staleHttpRequests = Object.keys(pending)
      .map(key => pending[key])
      .filter((req) => http.filter(r => r.key == req.key).length == 0);

    staleHttpRequests.forEach((req) =>
      // req.abort();
      console.log(`request ${req.key} is no longer pending and could be aborted`)); // eslint-disable-line

    const newRequests = http.filter((req) => !(req.key in pending));

    pending = http.reduce(function (acc, req) {
      acc[req.key] = req;
      return acc;
    }, {});

    newRequests.forEach(function (req) {
      const { key, url } = req;

      const stillPending = () => key in pending;

      window.fetch(url)
        .then(res => res.json())
        .then(function (json) {
          if (!stillPending()) {
            return;
          }

          delete pending[key];
          req.success(json);
        })
        .catch(function (err) {
          if (!stillPending()) {
            return;
          }

          delete pending[key];
          req.error(err);
        });
    });
  };
};

export default fetch;
