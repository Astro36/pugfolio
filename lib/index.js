const fs = require('fs');
const path = require('path');
const pug = require('pug');
const puppeteer = require('puppeteer');
const repl = require('repl');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
  console.log(`Set the output HTML file path: ${outputFilePath}`);
  if (config.writeAsPdf) {
    console.log(`Set the output PDF file path: ${outputPdfPath}`);
  }

  repl.start('Please wait for a minute…\n');

  const themeDirPath = path.join(__dirname, '../themes/');
  const themePath = path.join(themeDirPath, config.theme);

  config.files.forEach(file => options.contents.push(pug.renderFile(path.resolve(configPath, '../', file))));
  console.log('Rendering the pugfolio as HTML');

  webpack({
    entry: {
      app: path.resolve(themePath, 'main.js'),
    },
    output: {
      filename: 'index.bundle.js',
      path: path.resolve(outputPath, '../dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.pug$/,
          use: [
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin([path.resolve(outputPath, '../dist')]),
      new HtmlWebpackPlugin({
        template: path.join(themePath, 'main.pug'),
      }),
      new UglifyJSPlugin(),
    ],
  }, (err, stats) => {
    if (err || stats.hasErrors()) {
      // console.log(stats.toString())
      return;
    }
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
  });
};
