
import { h, render, useSignal, useEffect, htm } from "../lib/standalone.js";
import D3Wrapper from './D3wrapper.js'
import Counter  from "./Counter.js";
import NOAAWidget from "./NOAAWidget.js"
import Map from "./Map.js"

const html = htm.bind(h);

const HEAT_EQUATION = "\\frac{\\partial u}{\\partial t} = \\alpha \\frac{\\partial^2 u}{\\partial x^2}"
const WAVE_EQUATION = "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}"


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


const FormInput = () => {
	return html`<div class="field">
		<h6 class="title">Welcome!</h6>
  <p class="control has-icons-left has-icons-right">
    <input class="input" type="email" placeholder="Email" />
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-check"></i>
    </span>
  </p>
</div>

<div class="field">
  <p class="control has-icons-left">
    <input class="input" type="password" placeholder="Password" />
    <span class="icon is-small is-left">
      <i class="fas fa-lock"></i>
    </span>
  </p>
	<button style="margin-top: 1em;" class="button">submit</button>
</div>`
}


const SignalReciever = (props) => {
	// mock
	return html`<div><h2 class="title">0</h2></div>`
}

const BookContent = (props) => {
	return html`
  <div class="content">
    <h1>What is this?</h1>
	<p>CleanRoom is a philosophy, a sort of anti-framework.</p>
    <p>
      Lorem ipsum<sup><a>[1]</a></sup> dolor sit amet, consectetur adipiscing
      elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius
      lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat
      odio, sollicitudin vel erat vel, interdum mattis neque. Sub<sub>script</sub>
      works as well!
    </p>
    <h2>MathJax: The Wave Equation</h2>
    <p>
	 <${MathJaxWrapper} expression=${WAVE_EQUATION} />
      Curabitur accumsan turpis pharetra <strong>augue tincidunt</strong> blandit.
      Quisque condimentum maximus mi, sit amet commodo arcu rutrum id. Proin
      pretium urna vel cursus venenatis. Suspendisse potenti. Etiam mattis sem
      rhoncus lacus dapibus facilisis. Donec at dignissim dui. Ut et neque nisl.
    </p>
    <ul>
      <li>In fermentum leo eu lectus mollis, quis dictum mi aliquet.</li>
      <li>Morbi eu nulla lobortis, lobortis est in, fringilla felis.</li>
      <li>Aliquam nec felis in sapien venenatis viverra fermentum nec lectus.</li>
      <li>Ut non enim metus.</li>
    </ul>
    <h3>Third level</h3>
    <p>
      Quisque ante lacus, malesuada ac auctor vitae, congue
      <a href="#">non ante</a>. Phasellus lacus ex, semper ac tortor nec,
      fringilla condimentum orci. Fusce eu rutrum tellus.
    </p>
    <ol>
      <li>Donec blandit a lorem id convallis.</li>
      <li>Cras gravida arcu at diam gravida gravida.</li>
      <li>Integer in volutpat libero.</li>
      <li>Donec a diam tellus.</li>
      <li>Aenean nec tortor orci.</li>
      <li>Quisque aliquam cursus urna, non bibendum massa viverra eget.</li>
      <li>Vivamus maximus ultricies pulvinar.</li>
    </ol>
    <blockquote>
      Ut venenatis, nisl scelerisque sollicitudin fermentum, quam libero hendrerit
      ipsum, ut blandit est tellus sit amet turpis.
    </blockquote>
    <p>
      Quisque at semper enim, eu hendrerit odio. Etiam auctor nisl et
      <em>justo sodales</em> elementum. Maecenas ultrices lacus quis neque
      consectetur, et lobortis nisi molestie.
    </p>
    <p>
      Sed sagittis enim ac tortor maximus rutrum. Nulla facilisi. Donec mattis
      vulputate risus in luctus. Maecenas vestibulum interdum commodo.
    </p>
    <dl>
      <dt>Web</dt>
      <dd>The part of the Internet that contains websites and web pages</dd>
      <dt>HTML</dt>
      <dd>A markup language for creating web pages</dd>
      <dt>CSS</dt>
      <dd>A technology to make HTML look better</dd>
    </dl>
    <p>
      Suspendisse egestas sapien non felis placerat elementum. Morbi tortor nisl,
      suscipit sed mi sit amet, mollis malesuada nulla. Nulla facilisi. Nullam ac
      erat ante.
    </p>
    <h4>Fourth level</h4>
    <p>
      Nulla efficitur eleifend nisi, sit amet bibendum sapien fringilla ac. Mauris
      euismod metus a tellus laoreet, at elementum ex efficitur.
    </p>
    <pre> 
	
	def my_method():
	  print('not doing much...')
	  pass
	
	</pre>
    <p>
      Maecenas eleifend sollicitudin dui, faucibus sollicitudin augue cursus non.
      Ut finibus eleifend arcu ut vehicula. Mauris eu est maximus est porta
      condimentum in eu justo. Nulla id iaculis sapien.
    </p>
    <table>
      <thead>
        <tr>
          <th>One</th>
          <th>Two</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Three</td>
          <td>Four</td>
        </tr>
        <tr>
          <td>Five</td>
          <td>Six</td>
        </tr>
        <tr>
          <td>Seven</td>
          <td>Eight</td>
        </tr>
        <tr>
          <td>Nine</td>
          <td>Ten</td>
        </tr>
        <tr>
          <td>Eleven</td>
          <td>Twelve</td>
        </tr>
      </tbody>
    </table>
    <p>
      Phasellus porttitor enim id metus volutpat ultricies. Ut nisi nunc, blandit
      sed dapibus at, vestibulum in felis. Etiam iaculis lorem ac nibh bibendum
      rhoncus. Nam interdum efficitur ligula sit amet ullamcorper. Etiam
      tristique, leo vitae porta faucibus, mi lacus laoreet metus, at cursus leo
      est vel tellus. Sed ac posuere est. Nunc ultricies nunc neque, vitae
      ultricies ex sodales quis. Aliquam eu nibh in libero accumsan pulvinar.
      Nullam nec nisl placerat, pretium metus vel, euismod ipsum. Proin tempor
      cursus nisl vel condimentum. Nam pharetra varius metus non pellentesque.
    </p>
    <h5>Fifth level</h5>
    <p>
      Aliquam sagittis rhoncus vulputate. Cras non luctus sem, sed tincidunt
      ligula. Vestibulum at nunc elit. Praesent aliquet ligula mi, in luctus elit
      volutpat porta. Phasellus molestie diam vel nisi sodales, a eleifend augue
      laoreet. Sed nec eleifend justo. Nam et sollicitudin odio.
    </p>
    <figure>
      <img src="https://bulma.io/assets/images/placeholders/256x256.png" />
      <img src="https://bulma.io/assets/images/placeholders/256x256.png" />
      <figcaption>Figure 1: Some beautiful placeholders</figcaption>
    </figure>
    <h6>Sixth level</h6>
    <p>
      Cras in nibh lacinia, venenatis nisi et, auctor urna. Donec pulvinar lacus
      sed diam dignissim, ut eleifend eros accumsan. Phasellus non tortor eros. Ut
      sed rutrum lacus. Etiam purus nunc, scelerisque quis enim vitae, malesuada
      ultrices turpis. Nunc vitae maximus purus, nec consectetur dui. Suspendisse
      euismod, elit vel rutrum commodo, ipsum tortor maximus dui, sed varius
      sapien odio vitae est. Etiam at cursus metus.
    </p>
  </div>
	`
}

const SmartGrid = () => {
  return html`<h1 class="title">SMARTGRID</h1><div class="grid is-desktop">
  <div class="cell"><h2 class="subtitle">Cell 1</h2>
  
  </div>
  <div class="cell"><h2 class="subtitle">Cell 2</h2>
   <${MathJaxWrapper} expression=${HEAT_EQUATION} />
  </div>
  <div class="cell">Cell 3</div>
  <div class="cell">Cell 4</div>
  <div class="cell">Cell 5</div>
  <div class="cell">Cell 6</div>
  <div class="cell">Cell 7</div>
  <div class="cell">Cell 8</div>
  <div class="cell">Cell 9</div>
  <div class="cell">Cell 10</div>
  <div class="cell">Cell 11</div>
  <div class="cell">Cell 12</div>
  <div class="cell">Cell 13</div>
  <div class="cell">Cell 14</div>
  <div class="cell">Cell 15</div>
  <div class="cell">Cell 16</div>
  <div class="cell">Cell 17</div>
  <div class="cell">Cell 18</div>
  <div class="cell">Cell 19</div>
  <div class="cell">Cell 20</div>
  <div class="cell">Cell 21</div>
  <div class="cell">Cell 22</div>
  <div class="cell">Cell 23</div>
  <div class="cell">Cell 24</div>
</div>`
}

const BaseComponent = (props) => {
	
  console.log(props.data);
  return html`<header class="header"><h1 class="title"><pre>CLEANROOM.JS</pre></h1></header><div class="container">
<${Map}
        lat=${38.505}
        lng=${-96.09}
        zoom=${3}
        msg=${"you are here"}
      />
<div class="columns">
  <div class="column">
   <${D3Wrapper}/>
  </div>
  <div class="column">
  <h2 class="subtitle">SIGNALS CONTROL</h2>
   <${Counter} />
  </div>
  <div class="column">
   <h2 class="subtitle">SIGNALS RECIEVER</h2>
  <${SignalReciever}/>
  </div>
  <div class="column">
 
    <${FormInput} />
  </div>
  </div>
  <div class="columns">
  <div class="column">
  <div class="content">
   <img src="https://bulma.io/assets/images/placeholders/256x256.png" />
  <h1 class="title">5</h1>
   <p>Sed sagittis enim ac tortor maximus rutrum. Nulla facilisi. Donec mattis
      vulputate risus in luctus. Maecenas vestibulum interdum commodo.</p>
  </div>
  </div>
  <div class="column">
    <div class="content">
  <h2 class="subtitle">6</div>
<p>
  Aliquam sagittis rhoncus vulputate. Cras non luctus sem, sed tincidunt
  ligula. Vestibulum at nunc elit. Praesent aliquet ligula mi, in luctus elit
  volutpat porta. Phasellus molestie diam vel nisi sodales, a eleifend augue
  laoreet. Sed nec eleifend justo. Nam et sollicitudin odio.
</p>
<figure>
  <img src="https://bulma.io/assets/images/placeholders/256x256.png" />
  <figcaption>Figure 1: Some beautiful placeholders</figcaption>
</figure>
  </div>
  </div>
  <div class="column">
  <div class="content">
  <h1 class="subtitle">7: Heat Equation</h1>
  <${MathJaxWrapper} expression=${HEAT_EQUATION} />
  </div>
  </div>
  <div class="column">
   <${NOAAWidget}/>
  </div>
</div>
  <div class="notification">
    This container is <strong>centered</strong> on desktop and larger viewports.
  </div>

   
  <${BookContent} />
 
 <${SmartGrid} />
<footer class="footer">
  <div class=" has-text-centered">
    <p>
      <strong>CLEANROOM.JS</strong> by <a href="https://github.com/vmwherez">vmwherez</a>.
      The source code is licensed
      <a href="https://opensource.org/license/mit">MIT</a>. The
      website content is licensed
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0//"
        >CC BY NC SA 4.0</a
      >.
    </p>
  </div>
</footer>
</div>`}




render(html`<${BaseComponent} />`, document.getElementById("app"));