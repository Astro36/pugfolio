const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const pug = require('pug');
const unzip = require('unzip');

exports.render = (configPath = 'pugfolio.json', output = 'index.html') => {
  if (fs.statSync(configPath).isDirectory()) {
    configPath = path.join(configPath, 'pugfolio.json');
  }

  const outputPath = path.join(configPath, '../');
  const date = new Date();
  const config = JSON.parse(fs.readFileSync(configPath));
  const options = {
    config: config,
    title: config.title,
    subtitle: config.subtitle,
    author: config.author,
    description: config.description,
    contents: [],
    date: `${date.getFullYear()}.${(`00${date.getMonth() + 1}`).slice(-2)}.${(`00${date.getDate()}`).slice(-2)}`,
  };

  config.files.forEach(file => options.contents.push(pug.renderFile(path.join(outputPath, file))));

  const themeDirPath = path.join(__dirname, '../themes/');
  const themePath = path.join(themeDirPath, config.theme);
  const render = () => {
    const assetsPath = path.join(outputPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      fsExtra.removeSync(assetsPath);
    }
    fsExtra.copySync(path.join(themePath, 'assets'), assetsPath);
    fs.writeFileSync(path.join(outputPath, output), pug.renderFile(path.join(themePath, 'main.pug'), options));
  };

  if (!fs.existsSync(themePath)) {
    const zip = fs.createReadStream(path.join(themeDirPath, `${config.theme}.theme.zip`));
    zip.on('finish', render);
    zip.pipe(unzip.Extract({ path: themeDirPath }));
  } else {
    render();
  }
};
