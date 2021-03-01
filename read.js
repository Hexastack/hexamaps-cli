const readCb = require("read");

const read = function(options = {}) {
  return new Promise((resolve, reject) => {
    readCb(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

module.exports = {
  read,
};
