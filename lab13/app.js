import { h, render, htm } from "../lib/standalone.js";
import Counter from "../src/Counter.js";

const html = htm.bind(h);

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  render(html`<${Counter} />`, container);
});
