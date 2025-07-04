import { h, render, useSignal, useEffect, htm, FC, useState } from "./cleanroom.js";
import Counter from "./Counter.js";

const html = htm.bind(h);



// Render the app
const App = () => html`
  <div class="container">
    <h1 class="title"><img src="../cleanroom_guy.png" style="width:50px;position:relative;top:1em;"/>CLEANROOM.JS</h1>
   <hr/>
    <${Counter} />
  </div>
`;

// Mount app to DOM when content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  render(h(App), container);
});