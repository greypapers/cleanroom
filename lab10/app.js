// app.js
import { h, render, useSignal, useEffect, htm, FC } from "./cleanroom_esmodule.js";

// Create a simple counter component using hooks and signals
const Counter = FC((props) => {
  const [count, setCount] = useSignal(0);
  
  useEffect(() => {
    console.log(`Counter is now: ${count}`);
    return () => console.log('Counter component unmounted');
  }, [count]);
  
  return htm`
    <div>
      <h2>Counter: ${count}</h2>
      <button onClick=${() => setCount(count + 1)}>Increment</button>
      <button onClick=${() => setCount(count - 1)}>Decrement</button>
    </div>
  `;
});

// Render the app
const App = () => htm`
  <div className="app">
    <h1>My Cleanroom App</h1>
    <${Counter} />
  </div>
`;

// Mount app to DOM when content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  render(h(App), container);
});
