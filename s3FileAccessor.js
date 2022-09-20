const path = require("path");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

module.exports = (s3, hashDbBasePath) => ({
  read: async (hashChunkPath) => {
    const fileData = await s3.send(new GetObjectCommand({
      Bucket: 'pub.storage.sgfault.com',
      Key: path.join(hashDbBasePath, hashChunkPath)
    }));
    return streamToString(fileData.Body);
  },
});
