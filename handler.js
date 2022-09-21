const HashLookup = require('./hashLookup');
const S3FileAccessor = require('./s3FileAccessor');
const { S3Client } = require("@aws-sdk/client-s3");

const s3FileAccessor = S3FileAccessor(
  new S3Client({ region: 'eu-west-1' }),
  'passwords/data'
);
const hashLookup = HashLookup(s3FileAccessor);

let max_count = 7671364;

function permut(string) {
  if (string.length < 2) return string; // This is our break condition

  var permutations = []; // This array will hold our permutations
  for (var i = 0; i < string.length; i++) {
    var char = string[i];

    // Cause we don't want any duplicates:
    if (string.indexOf(char) != i) // if char was used already
    continue; // skip it this time

    var remainingString = string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

    for (var subPermutation of permut(remainingString))
    permutations.push(char + subPermutation)
  }
  return permutations;
}

async function go(terms, options) {
  const { allCases, anyOrder } = options;

  console.log("Searching...")

  try {
    let prom_uhhh_sesssss = []

    if (allCases) {
      const allTerms = []
      terms.forEach(t => {
        const term = t.split('')
        let bitmask = eval(`0b${term.map(_ => 0).join('')}`);
        const maxVal = eval(`0b${term.map(_ => 1).join('')}`);
        while (bitmask <= maxVal) {
          const casedTerm = term.map((letter, index) => {
            const letterValue = eval(`0b${term.map((l, i) => i == index ? 1 : 0).join('')}`);
            return bitmask & letterValue ? letter.toUpperCase() : letter.toLowerCase()
          }).join('')
          allTerms.push(casedTerm)
          bitmask = bitmask + 1
        }
      })
      terms = terms.concat(allTerms);
    }

    if (anyOrder) {
      terms.forEach(t => {
        terms = terms.concat(permut(t))
      });
    }

    terms = terms.filter(onlyUnique);

    terms.forEach(term => {
      prom_uhhh_sesssss.push(get_result(term))
    })

    let results = await Promise.all(prom_uhhh_sesssss)

    results = results.sort((a, b) => {
      return Number(a.count) <= Number(b.count) ? 1 : -1
    })

    if (results.length > 1) {
      max_count = Number(results[0].count)
    }

    results = results.map(a => {
      a.percent = (a.count / max_count) * 100
      return a;
    });

    return results;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function get_result(term) {
  return hashLookup.findHashByTerm(term);
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

async function handler(event) {
  if (!event?.queryStringParameters?.passwords) {
    return {
      statusCode: '400',
      body: JSON.stringify({ error: "Missing required query string parameter `passwords`" }),
    };
  }

  const { allCases, passwords, anyOrder } = event.queryStringParameters;

  const terms = passwords.split(',');
  const results = await go(terms, { allCases, anyOrder });
  const response = results.map(({
    term, hash, count, percent, search_time
  }) => ({ term, hash, count, percent, search_time }));

  return {
    statusCode: '200',
    body: JSON.stringify(response),
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
    },
  };
}

module.exports = { handler };
