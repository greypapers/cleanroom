
      // Core VDOM creator
    export  function h(type, props, ...children) {
        return { type, props: props || {}, children };
      }

      // Simple render function
      export function render(vnode, container) {
        const element = document.createElement(vnode.type);
        for (const [key, value] of Object.entries(vnode.props)) {
          element.setAttribute(key, value);
        }
        vnode.children.forEach((child) => {
          if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
          } else {
            render(child, element);
          }
        });
        container.appendChild(element);
      }

