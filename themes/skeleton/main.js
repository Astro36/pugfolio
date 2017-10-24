import './assets/css/font-awesome.min.css';
import './assets/css/katex.min.css';
import './assets/css/prism.css';
import './assets/css/skeleton.css';
import './assets/css/custom.css';
import './assets/css/spoqa-han-sans-kr.css';
import katex from './assets/js/katex.min.js';
import renderMathInElement from './assets/js/katex-auto.min.js';
import './assets/js/prism.min.js';

renderMathInElement(document.body, {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "\\(", right: "\\)", display: false }
  ]
});
