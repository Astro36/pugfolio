#!/usr/bin/env node

const pugfolio = require('../')
, args = process.argv.slice(2);

if (args.length === 0) pugfolio.render();
else if (args.length === 1) pugfolio.render(args[0]);
else if (args.length === 2) pugfolio.render(args[0], args[1]);
else throw new RangeError('The maximum number of arguments is two.');
