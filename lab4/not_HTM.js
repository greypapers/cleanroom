import { h } from './not_Preact.js';

export function html(strings, ...values) {
    let result = strings[0];
  
    // Construct the final string by appending the values
    values.forEach((value, index) => {
      result += value + strings[index + 1];
    });
  
    console.log('Constructed HTML:', result);  // Debugging log
  
    // Extract the tag name and content using regex
    const tagMatch = result.match(/<(\w+)/);
    const contentMatch = result.match(/>(.*?)<\/\w+>/);
  
    if (!tagMatch) {
      throw new Error(`Invalid HTML structure: No tag found in "${result}"`);
    }
  
    return {
      type: tagMatch[1],  // Extracted tag name (e.g., 'div')
      props: {},           // Currently no props are handled
      children: contentMatch ? [contentMatch[1]] : [] // If content is found, use it as a child
    };
  }

function parseHTML(str) {
  const div = document.createElement('div');
  div.innerHTML = str.trim();

  // Log the parsed content for debugging
  console.log("Parsed HTML:", div.innerHTML);

  // If there are no elements or only text nodes, handle that case
  const rootElements = Array.from(div.childNodes).filter(
    (node) => node.nodeType === Node.ELEMENT_NODE
  );

  if (rootElements.length === 0) {
    throw new Error('Invalid HTML structure: No root element found. Parsed content: ' + div.innerHTML);
  }

  // Handle multiple root elements (wrap them in a parent container)
  if (rootElements.length > 1) {
    const parent = document.createElement('div');
    rootElements.forEach((el) => parent.appendChild(el));
    return createNode(parent);
  }

  // Handle the single root element
  return createNode(rootElements[0]);
}

function createNode(el) {
  const children = [];
  for (let child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      children.push(child.textContent);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(createNode(child));  // Recursively process child nodes
    }
  }

  return h(el.tagName.toLowerCase(), getAttributes(el), ...children);
}

function getAttributes(el) {
  const props = {};
  for (let attr of el.attributes) {
    props[attr.name] = attr.value;
  }
  return props;
}
