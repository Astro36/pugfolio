const fs = require('fs');
const path = require('path');
const pug = require('pug');
const puppeteer = require('puppeteer');
const repl = require('repl');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

exports.render = (configPath, outputPath) => {
  if (typeof configPath !== 'string') {
    configPath = 'pugfolio.json';
  } else if (fs.statSync(configPath).isDirectory()) {
    configPath = path.join(configPath, 'pugfolio.json');
  } else if (!configPath.endsWith('.json')) {
    configPath += '.json';
  }
  console.log(`Set the config file path: ${path.resolve(configPath)}`);

  const date = new Date();
  const config = JSON.parse(fs.readFileSync(configPath));
  const options = {
    config,
    contents: [],
    date: `${date.getFullYear()}.${(`00${date.getMonth() + 1}`).slice(-2)}.${(`00${date.getDate()}`).slice(-2)}`,
  };

  if (typeof outputPath !== 'string') {
    outputPath = path.join(configPath, '../', 'index.html');
  } else if (fs.statSync(outputPath).isDirectory()) {
    outputPath = path.join(outputPath, 'index.html');
  } else if (!outputPath.endsWith('.html')) {
    outputPath += '.html';
  }

  const outputFilePath = path.resolve(outputPath);
  const outputPdfPath = path.resolve(outputPath.replace('.html', '.pdf'));
  const pathSeps = outputPath.split(path.sep);
  const outputFileName = pathSeps[pathSeps.length - 1];
  console.log(`Set the output HTML file path: ${outputFilePath}`);
  if (config.writeAsPdf) {
    console.log(`Set the output PDF file path: ${outputPdfPath}`);
  }

  repl.start('Please wait for a minute…\n');

  const themeDirPath = path.join(__dirname, '../themes/');
  const themePath = path.join(themeDirPath, config.theme);

  config.files.forEach(file => options.contents.push(pug.renderFile(path.resolve(configPath, '../', file))));
  console.log('Rendering the pugfolio as HTML');
  const html = pug.renderFile(path.join(themePath, 'main.pug'), options);
  fs.writeFile(outputFilePath, html, (err) => {
    if (!err) {
      console.log('Bundling the asset files');
      webpack({
        entry: {
          app: path.resolve(themePath, 'main.js'),
        },
        output: {
          filename: outputFileName.replace('.html', '.bundle.js'),
          path: path.resolve(outputPath, '../'),
        },
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
              }),
            },
            {
              test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
              use: [
                'base64-inline-loader',
              ],
            },
          ],
        },
        plugins: [
          new ExtractTextPlugin({
            filename: outputFileName.replace('.html', '.bundle.css'),
          }),
          new HtmlWebpackPlugin({
            template: outputFilePath,
          }),
          new UglifyJSPlugin(),
        ],
      }, (err2, stats) => {
        if (!err2 && !stats.hasErrors()) {
          console.log(`Saved the pugfolio as HTML: ${outputFilePath}`);
          if (config.writeAsPdf) {
            (async () => {
              console.log('Rendering the pugfolio as PDF');
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              await page.goto(`file://${outputFilePath}`);
              await page.pdf({
                path: outputPdfPath, printBackground: true, format: 'A4', margin: { top: '20mm', bottom: '20mm' },
              });
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
          console.log(err2 || stats.toString());
          process.exit();
        }
      });
    }
  });
};
