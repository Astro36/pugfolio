# Pugfolio
Create Your Portfolio using Pug Template Engine

Pug 템플릿 엔진을 사용하여 문서를 작성할 수 있게 하는 도구입니다.

쉽고 간결한 Pug로 문서를 작성해 보세요!

## ChangeLog
See [CHANGELOG](./CHANGELOG.md)

## Demo
See [example](http://astro36.me/Pugfolio/example/)

## Features
- Supporting Markdown
- Using Latex Syntax by Katex
- Code Highlighting by Prizm

## Install
- Install with npm:
``` bash
npm install pugfolio -g
```
- Clone the repo:
``` bash
git clone https://github.com/Astro36/Pugfolio.git
```

## Usage
- To run Pugfolio, use the following format:
``` bash
pugfolio [config=pugfolio.json] [output=index.html]
```

- Here’s an example `pugfolio.json` file:
```json
{
  "theme": "skeleton",
  "title": "Pugfolio",
  "subtitle": "Create Your Portfolio using Pug Template Engine",
  "author": "Astro36",
  "description": "My Portfolio",
  "files": ["about.pug", "portfolio.pug"]
}
```
You can add custom theme on `/themes` directory as `*.theme.zip` extension.


## License
Pugfolio is licensed under the [GPL 3.0](./LICENSE).

[KaTeX](https://khan.github.io/KaTeX/) is licensed under a [MIT License](https://github.com/Khan/KaTeX/blob/master/LICENSE.txt) by Khan Academy.

[Materialize](http://materializecss.com/) is licensed under a [MIT License](https://github.com/Dogfalo/materialize/blob/master/LICENSE) by Dogfalo.

[Prism.js](http://prismjs.com) is licensed under a [MIT License](https://github.com/PrismJS/prism/blob/gh-pages/LICENSE) by Lea Verou.

[Skeleton](http://getskeleton.com) is licensed under a [MIT License](https://github.com/dhg/Skeleton/blob/master/LICENSE.md) by Dave Gamache.

[Font Awesome](http://fontawesome.io/) is licensed under a [SIL OFL 1.1 and MIT License](http://fontawesome.io/license/) by Font Awesome.

[Spoqa Han Sans](https://spoqa.github.io/spoqa-han-sans/ko-KR/) is licensed under a [SIL OFL 1.1](https://github.com/spoqa/spoqa-han-sans/blob/master/LICENSE) by Spoqa.
