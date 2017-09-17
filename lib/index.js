const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const pug = require('pug');
const puppeteer = require('puppeteer');
const repl = require('repl');
const unzip = require('unzip');

exports.render = (configPath, outputPath) => {
  if (typeof configPath !== 'string') {
    configPath = 'pugfolio.json';
  } else if (fs.statSync(configPath).isDirectory()) {
    configPath = path.join(configPath, 'pugfolio.json');
  } else if (!configPath.endsWith('.json')) {
    configPath += '.json';
  }
  console.log(`Set a config file path: ${path.resolve(configPath)}`);

  const date = new Date();
  const config = JSON.parse(fs.readFileSync(configPath));
  const options = {
    config,
    title: config.title,
    subtitle: config.subtitle,
    author: config.author,
    description: config.description,
    writeAsPdf: config.writeAsPdf,
    contents: [],
    date: `${date.getFullYear()}.${(`00${date.getMonth() + 1}`).slice(-2)}.${(`00${date.getDate()}`).slice(-2)}`,
  };

  if (typeof outputPath !== 'string') {
    outputPath = 'index.html';
  } else if (fs.statSync(outputPath).isDirectory()) {
    outputPath = path.join(outputPath, 'index.html');
  } else if (!outputPath.endsWith('.html')) {
    outputPath += '.html';
  }

  const outputFilePath = path.resolve(outputPath);
  const outputPdfPath = path.resolve(outputPath.replace('.html', '.pdf'));
  console.log(`Set an output HTML file path: ${outputFilePath}`);
  if (config.writeAsPdf) {
    console.log(`Set an output PDF file path: ${outputPdfPath}`);
  }

  repl.start('Please wait for a minute…\n');

  const themeDirPath = path.join(__dirname, '../themes/');
  const themePath = path.join(themeDirPath, config.theme);
  const save = () => {
    config.files.forEach(file => options.contents.push(pug.renderFile(path.join(outputPath, file))));
    console.log('Rendering the pugfolio as HTML');
    const html = pug.renderFile(path.join(themePath, 'main.pug'), options);
    fs.writeFile(outputFilePath, html, (err) => {
      if (!err) {
        console.log(`Saved the pugfolio as HTML: ${outputFilePath}`);
        if (config.writeAsPdf) {
          (async () => {
            console.log('Rendering the pugfolio as PDF');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`file://${outputFilePath}`);
            await page.pdf({ path: outputPdfPath, printBackground: true, format: 'A4', margin: { top: '20mm', bottom: '20mm' } });
            browser.close();
            console.log(`Saved the pugfolio as PDF: ${outputPdfPath}`);
            console.log('Finish! (HTML, PDF)');
            process.exit();
          })();
        } else {
          console.log('Finish! (HTML)');
          process.exit();
        }
      } else {
        console.log(err);
      }
    });
  };

  if (config.theme === 'local') {
    save();
  } else {
    const copy = () => {
      const assetsPath = path.join(outputPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        console.log('Removing the old theme');
        fsExtra.removeSync(assetsPath);
      }
      console.log('Copying the theme to local directory');
      fsExtra.copySync(path.join(themePath, 'assets'), assetsPath);
      save();
    };

    if (!fs.existsSync(themePath)) {
      const zip = fs.createReadStream(path.join(themeDirPath, `${config.theme}.theme.zip`));
      console.log('Extracting the theme from resources');
      zip.on('finish', copy);
      zip.pipe(unzip.Extract({ path: themeDirPath }));
    } else {
      copy();
    }
  }
};
