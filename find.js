#!/usr/local/bin/node

let startTime = new Date()
const fs = require('fs');
const path = require('path');
const arg = require('arg');
const crypto = require('crypto');

const args = arg({
  // Types
  '--help':       Boolean,
  '--all-cases':  Boolean,
  '--anagrams':   Boolean,
  '-a':        '--anagrams',
  '-c':        '--all-cases',
});

const { execSync, exec } = require('child_process');
let terms = args._;

if (!terms || !terms.length) {
  throw new Error('You must pass in a search term');
}

const allCases = !!args['--all-cases']
const anyOrder = !!args['--anagrams']
const readline = require('readline');
const clc = require('cli-color');
const CLI = require('clui');
const Line = CLI.Line;
const LineBuffer = CLI.LineBuffer;
const Gauge = CLI.Gauge;

let max_count = 7671364;
const c1 = 20;
const c2 = 10;
const c3 = 42;
const c4 = 45;
const c5 = 10;

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

async function go() {
  let outputBuffer
  console.clear();

  console.log("Searching...")

  try {

    outputBuffer = new LineBuffer({
      x: 0,
      y: 0,
      width: 'console',
      height: 'console'
    });

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

    console.clear();

    add_header(outputBuffer);

    results = results.sort((a, b) => {
      return Number(a.count) <= Number(b.count) ? 1 : -1
    })

    if (results.length > 1) {
      max_count = Number(results[0].count)
    }

    results = results.map(a => {
      a.percent = (a.count / max_count) * 100
      return a;
    })

    results.forEach(result => {
      if (Number(result.count) > 0) {
        add_result(outputBuffer, result)
      } else {
        not_found(outputBuffer, result)
      }
    })

    new Line(outputBuffer)
      .column("".padStart(120, '-'), 120)
      .fill()
      .store();

    new Line(outputBuffer)
      .column(String((new Date() - startTime)/1000) + 's')
      .fill()
      .store();

    outputBuffer.output();

  } catch (error) {
    console.log(error)
    process.exit(1)
    return not_found(outputBuffer, result);
  }
}

function get_result(term) {
  let resultStartTime = new Date()
  return new Promise(async (resolve) => {
    return sha1(term).then(result => {
      const hash = result;
      const letters = hash.split('');
      const first_two = letters.slice(0,2).join('').toUpperCase();
      const file_path = path.resolve(path.join(__dirname, 'data', first_two));

      try {
        fs.accessSync(file_path, fs.constants.R_OK);
      } catch (error) {
        console.error(error);
        return resolve({
          term: term.trim(), hash: hash.trim(), first_two, response: '', count: '0', percent: '0', search_time: '0ms'
        })
      }

      exec(`rg ${hash.trim()} ${__dirname}/data/${first_two}`, (err, response) => {
        const count = response.split(':').pop().trim()
        const search_time = String(new Date() - resultStartTime) + 'ms'
        return resolve({
          term: term.trim(), hash: hash.trim(), first_two, response, count, percent: '0', search_time
        })
      })
    })
  })
}

function add_header(outputBuffer) {
  new Line(outputBuffer)
    .column('Password', c1, [ clc.blackBright ])
    .column('Found', c2, [ clc.blackBright ])
    .column('Hash', c3, [ clc.blackBright ])
    .column('Relative popularity', c4, [ clc.blackBright ])
    .column('Count', c5, [ clc.blackBright ])
    .column('Time', 10, [ clc.blackBright ])
    .fill()
    .store();
}

function add_result(outputBuffer, result) {
  new Line(outputBuffer)
    .column(result.term, c1, [ clc.yellow ])
    .column('FOUND', c2, [ clc.green ])
    .column(result.hash, c3)
    .column(Gauge(result.count, max_count, c4-5, max_count), c4)
    .column(result.count, c5)
    .column(result.search_time, 10)
    .fill()
    .store();
}

function not_found(outputBuffer, result) {
  new Line(outputBuffer)
    .column(result.term, c1, [ clc.blackBright ])
    .column('NOT FOUND', c2, [ clc.red ])
    .column(result.hash, c3)
    .column(Gauge(result.count, max_count, c4-5, max_count), c4)
    .column(result.count, c5)
    .column(result.search_time, 10)
    .fill()
    .store();
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

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

go()
