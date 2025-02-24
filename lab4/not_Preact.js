
      // Core VDOM creator
      export  function h(type, props, ...children) {
        return { type, props: props || {}, children };
      }
      export function render(vnode, container) {
        console.log('Rendering vnode:', vnode);
        const element = document.createElement(vnode.type);
        console.log('Created element:', element);
      
        const props = vnode.props || {};
        for (const [key, value] of Object.entries(props)) {
          element.setAttribute(key, value);
          console.log('Setting attribute:', key, value);
        }
      
        const children = vnode.children || [];
        children.forEach((child) => {
          if (typeof child === "string") {
            console.log('Appending text:', child);
            element.appendChild(document.createTextNode(child));
          } else {
            console.log('Rendering child:', child);
            render(child, element);
          }
        });
      
        console.log('Appending element to container');
        container.appendChild(element);
      }
      