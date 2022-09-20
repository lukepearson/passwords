const path = require('path');
const fs = require('fs');

module.exports = (hashDbBasePath) => ({
  read: async (hashChunkPath) => {
    const resolvedChunkPath = path.join(hashDbBasePath, hashChunkPath);

    try {
      fs.accessSync(resolvedChunkPath, fs.constants.R_OK);
    } catch (error) {
      console.error(error);
      throw new Error("Unable to access file");
    }

    let file;
    try {
      file = fs.readFileSync(resolvedChunkPath);
    } catch (error) {
      console.error(error);
      throw new Error("Unable to read file");
    }

    return file.toString('utf-8');
  }
});
