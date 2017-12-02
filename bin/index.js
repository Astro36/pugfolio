#!/usr/bin/env node

const pugfolio = require('../')
, args = process.argv.slice(2);

if (args.length === 0) pugfolio();
else if (args.length === 1) pugfolio(args[0]);
else if (args.length === 2) pugfolio(args[0], args[1]);
else throw new RangeError('The maximum number of arguments is two.');
