#!/usr/bin/env node

const pugfolio = require('../');

const args = process.argv.slice(2);

if (args.length <= 2) {
  pugfolio.render(args[0], args[1]);
}
