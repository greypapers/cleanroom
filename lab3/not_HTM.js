   //HTM reimplementation
      //treeify
      function treeify() {}

      function build() {}

      function evaluate() {}


      function h(type, props, ...children) {
        return { type, props: props || {}, children };
      }


        // Minimal HTM implementation
       export function html(strings, ...values) {
            // For now, just demonstrate it works
            return h("div", null, "Hello");
          }
      