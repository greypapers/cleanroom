import { h, render, useSignal, htm, useEffect, useRef, useState } from "../lib/standalone.js";
import { select } from '../lib/d3.min.js';

// Initialize HTM with Preact
const html = htm.bind(h);

const D3Wrapper = (props) => {
  // useRef to get a reference to the SVG container
  const svgRef = useRef(null);
  
  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("width", "100%")
      .attr("height", 200)
    .attr('viewBox', '0 0 400 200')
    .attr('preserveAspectRatio', 'xMinYMin meet')
      // .style("border", "1px solid black");

    const data = [20, 80, 70, 50];

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 100)
      .attr("y", (d) => 200 - d)
      .attr("width", 60)
      .attr("height", (d) => d)
      .attr("fill", "grey");
  }, []); // note: empty dependency array ensures this effect runs only once on mount

  return html`
    <div>
      <h2 class="subtitle"><pre>D3.js</pre></h2>
      <svg ref=${svgRef}></svg>
    </div>
  `;
};

export default D3Wrapper;
