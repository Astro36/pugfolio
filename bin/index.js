#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pugfolio = require('../')

const args = process.argv.slice(2);

if (args.length <= 2) {
  pugfolio.render(args[0], args[1]);
  console.log('Finished!');
}
