const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const pug = require('pug');
const puppeteer = require('puppeteer');
const unzip = require('unzip');

exports.render = (configPath = 'pugfolio.json', output = 'index.html') => {
  if (fs.statSync(configPath).isDirectory()) {
    configPath = path.join(configPath, 'pugfolio.json');
  }

  const outputPath = path.join(configPath, '../');
  const outputFilePath = path.resolve(outputPath, output);
  const outputPdfPath = path.resolve(outputPath, output.replace('.html', '.pdf'));
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

  console.log('Start rendering the pugfolio as HTML');
  config.files.forEach(file => options.contents.push(pug.renderFile(path.join(outputPath, file))));

  const themeDirPath = path.join(__dirname, '../themes/');
  const themePath = path.join(themeDirPath, config.theme);
  const save = () => {
    const html = pug.renderFile(path.join(themePath, 'main.pug'), options);
    fs.writeFile(outputFilePath, html, (err) => {
      if (!err) {
        if (config.writeAsPdf) {
          console.log(`Save the pugfolio as HTML: ${outputFilePath}`);
          (async () => {
            console.log('Start rendering the pugfolio as PDF');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`file://${outputFilePath}`);
            await page.pdf({ path: outputPdfPath, printBackground: true, format: 'A4', margin: { top: '20mm', bottom: '20mm' } });
            browser.close();
            console.log(`Save the pugfolio as PDF: ${outputPdfPath}`);
            console.log('Finish! (HTML, PDF)');
          })();
        } else {
          console.log('Finish! (HTML)');
        }
      } else {
        console.log(err);
      }
    });
  };

  if (config.theme === 'local') {
    save();
  } else {
    const finish = () => {
      const assetsPath = path.join(outputPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        fsExtra.removeSync(assetsPath);
      }
      fsExtra.copySync(path.join(themePath, 'assets'), assetsPath);
      save();
    };

    if (!fs.existsSync(themePath)) {
      const zip = fs.createReadStream(path.join(themeDirPath, `${config.theme}.theme.zip`));
      zip.on('finish', finish);
      zip.pipe(unzip.Extract({ path: themeDirPath }));
    } else {
      finish();
    }
  }
};
