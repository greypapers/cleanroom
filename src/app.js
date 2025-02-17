
import { h, render, useSignal, useEffect, htm } from "../lib/standalone.js";
import D3Wrapper from './D3wrapper.js'
import Counter  from "./Counter.js";
import NOAAWidget from "./NOAAWidget.js"
const html = htm.bind(h);


const MathJaxWrapper = ({ expression }) => {
  useEffect(() => {
    // Load MathJax when the component mounts
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea'],
      },
    };

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS_CHTML';
    script.async = true;

    document.head.appendChild(script);

    return () => {
      // Cleanup when the component unmounts
      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
      }
    };
  }, []);

  return html`<div>$$${expression}$$</div>`;
};


const BaseComponent = (props) => {
	
  console.log(props.data);
  return html`<div>
  <{${D3Wrapper}/>
  <${Counter} />
  <${MathJaxWrapper} expression="Laplacian: \\nabla^2" />
  </div>`}

//  

// <${NOAAWidget}/>

render(html`<${BaseComponent} />`, document.getElementById("app"));