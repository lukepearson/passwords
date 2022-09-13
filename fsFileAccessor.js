const path = require('path');
const fs = require('fs');

module.exports = (hashDbBasePath) => ({
  read: async (hashChunkPath) => {
    try {
      fs.accessSync(hashChunkPath, fs.constants.R_OK);
    } catch (error) {
      console.error(error);
      throw new Error("Unable to access file");
    }

    let file;
    try {
      file = fs.readFileSync(path.join(hashDbBasePath, hashChunkPath));
    } catch (error) {
      console.error(error);
      throw new Error("Unable to read file");
    }

    return file.toString('utf-8');
  }
});
