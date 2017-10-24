import './assets/css/katex.min.css';
import './assets/css/prism.css';
import './assets/js/katex.min.js';
import { renderMathInElement } from './assets/js/katex-auto.min.js';
import './assets/js/prism.min.js';

renderMathInElement(document.body, {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "\\(", right: "\\)", display: false }
  ]
});
