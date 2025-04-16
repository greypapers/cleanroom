// app.js
import { h, Component, useState, render, FC, build } from "./cleanroom_esm.js";

const htm = build.bind(h);


class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 }; // Initial state
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 }, () => {
      console.log("Button clicked", this.state.count);
    });
  };

  render() {
    return htm`
        <div>
          <p style="font-family:monospace;">${this.state.count}</p>
          <button class="button" onClick=${this.increment} style="font-family: monospace;font-size:10pt;">
            ${this.props.label}
          </button>
        </div>
      `;
  }
}

// Button component with useState
const UseStateButton = FC((props) => {
const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    console.log("Button clicked", count + 1);
  };

return htm`
    <div>
<br/><br/>
      <p style="font-family: monospace;">${count}</p>
      <button class=${props.class} onClick=${increment} style="font-family: monospace;font-size:10pt;">
        ${props.label}
      </button>
    </div>
  `;
});

function App() {
  return htm`
          <div class="container">
            <div class="content">
            <h1 style="font-family: monospace;">CLEANROOM.JS</h1>
            <hr/>
            <${Button} label="setState"/>
              <${UseStateButton} class="button" label="useState"/>
          </div>
  </div>
        `;
}

render(h(App), document.getElementById("app"));

