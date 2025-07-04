import { h, render, useSignal, htm, useEffect, useRef, useState, useReducer, FC  } from "./cleanroom.js";


const html = htm.bind(h);
 
let initialState = 1;
const reducer = (state, action) => {
  switch (action) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error('Unexpected action');
  }
};

function Counter(props) {
  // Returns the current state and a dispatch function to
  // trigger an action
  const [count, dispatch] = useReducer(reducer, props.state || initialState)
  return (
    html`<div>
    <h2><pre>${count}</pre></h2> 
     <div class="button-group right" style="margin-top: 2em;">
      <button class="button" onClick=${() => dispatch('increment')}>+1</button>
      <button class="button" onClick=${() => dispatch('decrement')}>-1</button>
      <button class="button" onClick=${() => dispatch('reset')}>reset</button>
    </div>
      </div>`
  );
}

export default FC(Counter);