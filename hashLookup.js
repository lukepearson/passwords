const crypto = require('crypto');
const path = require('path');

function sha1(string) {
  const hash = crypto.createHash('sha1');
  return new Promise((resolve, reject) => {
    hash.on('readable', () => {
      const data = hash.read();
      if (data) {
        resolve(data.toString('hex').toUpperCase());
      }
      reject('Unable to hash ' + string);
    });
    hash.write(string);
    hash.end();
  });
}

module.exports = (fileAccessor) => ({
  findHashByTerm: async (term) => {
    let resultStartTime = new Date();

    return sha1(term).then(async result => {
      const hash = result;
      const letters = hash.split('');
      const first_two = letters.slice(0,2).join('').toUpperCase();
      const file_path = path.resolve(path.join(__dirname, 'data', first_two));

      let file = '';
      try {
        file = await fileAccessor.read(file_path);
      } catch (error) {
        throw error;
      }

      const trimmedHash = hash.trim();
      const hashIndex = file.indexOf(trimmedHash);
      const hashLineEndIndex = file.substring(hashIndex, 200).indexOf('\n');
      const hashLine = file.substring(hashIndex, hashLineEndIndex);

      const count = hashLine.split(':').pop().trim()
      const search_time = String(new Date() - resultStartTime) + 'ms'

      return {
        term: term.trim(), hash: hash.trim(), first_two, hashLine, count, percent: '0', search_time
      };
    });
  },
});
