const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const pug = require('pug');

exports.render = (configPath = 'pugfolio.json', output = 'pugfolio.html') => {
  const date = new Date();
  const config = JSON.parse(fs.readFileSync(configPath));
  const options = {
    assets: path.join(configPath, '../assets'),
    title: config.title,
    subtitle: config.subtitle,
    author: config.author,
    description: config.description,
    contents: [],
    date: `${date.getFullYear()}.${("00" + (date.getMonth() + 1)).slice(-2)}.${("00" + date.getDate()).slice(-2)}`
  };

  for (let i in config.files) {
    options.contents.push(pug.renderFile(path.join(configPath, '../', config.files[i])));
  }

  fsExtra.copySync(path.join(__dirname, `../themes/${config.theme}/assets`), options.assets);

  let html = pug.renderFile(path.join(__dirname, `../themes/${config.theme}/main.pug`), options);

  fs.writeFileSync(path.join(configPath, '../', output), html);
};