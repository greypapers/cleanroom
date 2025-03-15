// mini-lib.js

const MINI = true;

// Constants
const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;
const CHILD_APPEND = 0;
const CHILD_RECURSE = 2;
const TAG_SET = 3;
const PROPS_ASSIGN = 4;
const PROP_SET = MODE_PROP_SET;
const PROP_APPEND = MODE_PROP_APPEND;

// Treeify function
const treeify = (built, fields) => {
  const _treeify = built => {
    let tag = '';
    let currentProps = null;
    const props = [];
    const children = [];

    for (let i = 1; i < built.length; i++) {
      const type = built[i++];
      const value = built[i] ? fields[built[i++]-1] : built[++i];

      if (type === TAG_SET) {
        tag = value;
      } else if (type === PROPS_ASSIGN) {
        props.push(value);
        currentProps = null;
      } else if (type === PROP_SET) {
        if (!currentProps) {
          currentProps = Object.create(null);
          props.push(currentProps);
        }
        currentProps[built[++i]] = [value];
      } else if (type === PROP_APPEND) {
        currentProps[built[++i]].push(value);
      } else if (type === CHILD_RECURSE) {
        children.push(_treeify(value));
      } else if (type === CHILD_APPEND) {
        children.push(value);
      }
    }

    return { tag, props, children };
  };
  const { children } = _treeify(built);
  return children.length > 1 ? children : children[0];
};

// Evaluate function
const evaluate = (h, built, fields, args) => {
  let tmp;

  built[0] = 0;

  for (let i = 1; i < built.length; i++) {
    const type = built[i++];
    const value = built[i] ? ((built[0] |= type ? 1 : 2), fields[built[i++]]) : built[++i];

    if (type === TAG_SET) {
      args[0] = value;
    } else if (type === PROPS_ASSIGN) {
      args[1] = Object.assign(args[1] || {}, value);
    } else if (type === PROP_SET) {
      (args[1] = args[1] || {})[built[++i]] = value;
    } else if (type === PROP_APPEND) {
      args[1][built[++i]] += (value + '');
    } else if (type) {
      tmp = h.apply(value, evaluate(h, value, fields, ['', null]));
      args.push(tmp);
      if (value[0]) {
        built[0] |= 2;
      } else {
        built[i-2] = CHILD_APPEND;
        built[i] = tmp;
      }
    } else {
      args.push(value);
    }
  }

  return args;
};

// Build function
const build = function(statics) {
  const fields = arguments;
  const h = this;

  let mode = MODE_TEXT;
  let buffer = '';
  let quote = '';
  let current = [0];
  let char, propName;

  const commit = field => {
    if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g,'')))) {
      if (MINI) {
        current.push(field ? fields[field] : buffer);
      } else {
        current.push(CHILD_APPEND, field, buffer);
      }
    } else if (mode === MODE_TAGNAME && (field || buffer)) {
      if (MINI) {
        current[1] = field ? fields[field] : buffer;
      } else {
        current.push(TAG_SET, field, buffer);
      }
      mode = MODE_WHITESPACE;
    } else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
      if (MINI) {
        current[2] = Object.assign(current[2] || {}, fields[field]);
      } else {
        current.push(PROPS_ASSIGN, field, 0);
      }
    } else if (mode === MODE_WHITESPACE && buffer && !field) {
      if (MINI) {
        (current[2] = current[2] || {})[buffer] = true;
      } else {
        current.push(PROP_SET, 0, true, buffer);
      }
    } else if (mode >= MODE_PROP_SET) {
      if (MINI) {
        if (mode === MODE_PROP_SET) {
          (current[2] = current[2] || {})[propName] = field ? buffer ? (buffer + fields[field]) : fields[field] : buffer;
          mode = MODE_PROP_APPEND;
        } else if (field || buffer) {
          current[2][propName] += field ? buffer + fields[field] : buffer;
        }
      } else {
        if (buffer || (!field && mode === MODE_PROP_SET)) {
          current.push(mode, 0, buffer, propName);
          mode = MODE_PROP_APPEND;
        }
        if (field) {
          current.push(mode, field, 0, propName);
          mode = MODE_PROP_APPEND;
        }
      }
    }
    buffer = '';
  };

  for (let i = 0; i < statics.length; i++) {
    if (i) {
      if (mode === MODE_TEXT) commit();
      commit(i);
    }

    for (let j = 0; j < statics[i].length; j++) {
      char = statics[i][j];
      if (mode === MODE_TEXT) {
        if (char === '<') {
          commit();
          if (MINI) {
            current = [current, '', null];
          } else {
            current = [current];
          }
          mode = MODE_TAGNAME;
        } else {
          buffer += char;
        }
      } else if (mode === MODE_COMMENT) {
        if (buffer === '--' && char === '>') {
          mode = MODE_TEXT;
          buffer = '';
        } else {
          buffer = char + buffer[0];
        }
      } else if (quote) {
        if (char === quote) quote = '';
        else buffer += char;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '>') {
        commit();
        mode = MODE_TEXT;
      } else if (!mode) {
        // Ignore everything until the tag ends
      } else if (char === '=') {
        mode = MODE_PROP_SET;
        propName = buffer;
        buffer = '';
      } else if (char === '/' && (mode < MODE_PROP_SET || statics[i][j+1] === '>')) {
        commit();
        if (mode === MODE_TAGNAME) current = current[0];
        mode = current;
        if (MINI) {
          (current = current[0]).push(h.apply(null, mode.slice(1)));
        } else {
          (current = current[0]).push(CHILD_RECURSE, 0, mode);
        }
        mode = MODE_SLASH;
      } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        commit();
        mode = MODE_WHITESPACE;
      } else {
        buffer += char;
      }

      if (mode === MODE_TAGNAME && buffer === '!--') {
        mode = MODE_COMMENT;
        current = current[0];
      }
    }
  }
  commit();

  if (MINI) {
    return current.length > 2 ? current.slice(1) : current[1];
  }
  return current;
};

// P, a rethinking of Preact
const P = (() => {
  const components = new Map();
  const renderQueue = [];
  let renderTimer = null;

  function processRenderQueue() {
    const queue = renderQueue.slice();
    renderQueue.length = 0;
    renderTimer = null;
    queue.forEach(component => {
      if (component._dirty) renderComponent(component);
    });
  }

  const options = {
    _enqueueRender: (component) => {
      if (!component._dirty) return;
      if (renderQueue.indexOf(component) === -1) renderQueue.push(component);
      if (!renderTimer) renderTimer = setTimeout(processRenderQueue, 0);
    }
  };

  function toChildArray(children) {
    if (children == null) return [];
    return Array.isArray(children) ? children.flat() : [children];
  }

  function createElement(type, props, ...children) {
    props = props || {};
    const normalizedChildren = children.flat().filter(child => child != null && child !== false);
    props.children = normalizedChildren.length === 1 ? normalizedChildren[0] : 
                    normalizedChildren.length ? normalizedChildren : undefined;
    return { type, props, key: props.key || null, ref: props.ref || null, __isVNode: true };
  }

  const Fragment = props => props.children;
  const createRef = () => ({ current: null });
  const isValidElement = vnode => vnode != null && vnode.__isVNode === true;

  class BaseComponent {
    constructor(props) {
      this.props = props || {};
      this.state = {};
      this.refs = {};
      this._dirty = false;
      this._pendingState = null;
    }

    setState(update, callback) {
      if (!this._pendingState) this._pendingState = { ...this.state };
      Object.assign(this._pendingState, typeof update === "function" ? 
        update(this._pendingState, this.props) : update);
      this._dirty = true;
      options._enqueueRender(this);
      if (callback) setTimeout(callback, 0);
    }

    forceUpdate(callback) {
      this._dirty = true;
      renderComponent(this);
      if (callback) setTimeout(callback, 0);
    }

    render() { return null; }
  }

  function cloneElement(vnode, props, ...children) {
    props = { ...(vnode.props || {}), ...(props || {}) };
    const childrenToUse = children.length > 0 ? children : vnode.props.children;
    return createElement(vnode.type, props, childrenToUse);
  }

  function createContext(defaultValue) {
    const context = {
      _defaultValue: defaultValue,
      Provider: class extends BaseComponent {
        constructor(props) {
          super(props);
          this.value = props.value !== undefined ? props.value : defaultValue;
        }
        render() { return this.props.children; }
      },
      Consumer: class extends BaseComponent {
        render() {
          const value = this._getContextValue ? 
            this._getContextValue(context) : defaultValue;
          return this.props.children(value);
        }
      }
    };
    return context;
  }


  // Hooks implementation
  let currentComponent = null;
  const states = new WeakMap();
  let stateIndex = 0;

  function useState(initialValue) {
    const component = currentComponent;
    if (!states.has(component)) {
      states.set(component, []);
    }
    const componentStates = states.get(component);
    const index = stateIndex++;

    if (componentStates[index] === undefined) {
      componentStates[index] = [initialValue, (newValue) => {
        componentStates[index][0] = typeof newValue === 'function' ? newValue(componentStates[index][0]) : newValue;
        component._dirty = true;
        options._enqueueRender(component);
      }];
    }

    return componentStates[index];
  }

  // function renderComponent(component) {
  //   if (!component) return null;
  //   if (!components.has(component)) {
  //     components.set(component, { vnode: null, dom: null, component });
  //   }
    
  //   const data = components.get(component);
  //   if (component._pendingState) {
  //     component.state = component._pendingState;
  //     component._pendingState = null;
  //   }
    
  //   component._dirty = false;
  //   const newVNode = component.render();
  //   const newDom = renderToDom(newVNode);
    
  //   if (data.dom && data.dom.parentNode) {
  //     data.dom.parentNode.replaceChild(newDom, data.dom);
  //   }
    
  //   data.vnode = newVNode;
  //   data.dom = newDom;
  //   return newDom;
  // }

  // Functional component wrapper
  FC = (fn) => {
    return class extends BaseComponent {
      render() {
        currentComponent = this; // Set for hooks
        stateIndex = 0; // Reset hook index
        const result = fn(this.props);
        currentComponent = null; // Clear after rendering
        return result;
      }
    };
  };

  // Ensure renderComponent works with hooks
  function renderComponent(component) {
    if (!component) return null;
    if (!components.has(component)) {
      components.set(component, { vnode: null, dom: null, component });
    }
  
    const data = components.get(component);
    if (component._pendingState) {
      component.state = component._pendingState;
      component._pendingState = null;
    }
  
    component._dirty = false;
    const newVNode = component.render();
    const newDom = renderToDom(newVNode);
  
    if (data.dom && data.dom.parentNode) {
      data.dom.parentNode.replaceChild(newDom, data.dom);
    }
  
    data.vnode = newVNode;
    data.dom = newDom;
    return newDom;
  }

 
  function renderToDom(vnode) {
    // Handle null/undefined/boolean
    if (vnode == null || typeof vnode === "boolean") {
      return document.createTextNode("");
    }

    // Handle text nodes
    if (typeof vnode === "string" || typeof vnode === "number") {
      return document.createTextNode(vnode);
    }

    // Handle arrays (e.g., multiple root nodes or fragments)
    if (Array.isArray(vnode)) {
      const fragment = document.createDocumentFragment();
      vnode.forEach(child => {
        const childDom = renderToDom(child);
        if (childDom) fragment.appendChild(childDom);
      });
      return fragment;
    }

    // Handle components (functional or class)
    if (typeof vnode.type === "function") {
      // Ensure props is always an object
      const props = vnode.props || {};
    
      // Class component
      if (vnode.type.prototype instanceof BaseComponent) {
        const component = new vnode.type(props);
        components.set(component, { vnode, dom: null, component });
        return renderComponent(component);
      } 
      // Functional component
      const renderedVNode = vnode.type(props);
      return renderToDom(renderedVNode);
    }

    // Handle regular DOM elements
    const dom = vnode.type === "svg" 
      ? document.createElementNS("http://www.w3.org/2000/svg", vnode.type)
      : document.createElement(vnode.type);

    setAttributes(dom, vnode.props || {}); // Ensure props is defined here too
    toChildArray(vnode.props ? vnode.props.children : []).forEach(child => {
      const childDom = renderToDom(child);
      if (childDom) dom.appendChild(childDom);
    });

    if (vnode.ref) {
      typeof vnode.ref === "function" ? vnode.ref(dom) : (vnode.ref.current = dom);
    }

    return dom;
  }
 

  function setAttributes(dom, props) {
    if (!props) return;
    for (const name in props) {
      if (name === "children" || name === "key" || name === "ref") continue;
      if (name.startsWith("on") && typeof props[name] === "function") {
        const eventName = name.slice(2).toLowerCase();
        dom._listeners = dom._listeners || {};
        if (dom._listeners[eventName]) {
          dom.removeEventListener(eventName, dom._listeners[eventName]);
        }
        dom._listeners[eventName] = props[name];
        dom.addEventListener(eventName, props[name]);
        continue;
      }
      if (name === "style" && typeof props[name] === "object") {
        Object.assign(dom.style, props[name]);
        continue;
      }
      if (name === "className") {
        dom.setAttribute("class", props[name]);
        continue;
      }
      name in dom && !(dom instanceof SVGElement) ? 
        dom[name] = props[name] : 
        dom.setAttribute(name, props[name]);
    }
  }

  function render(vnode, container, replaceNode) {
    if (!container.__vnodeInstance) {
      container.__vnodeInstance = { _container: container, _root: null };
    }
    const instance = container.__vnodeInstance;
    const dom = renderToDom(vnode);
    
    if (replaceNode) {
      container.replaceChild(dom, replaceNode);
    } else if (instance._root) {
      container.replaceChild(dom, instance._root);
    } else {
      container.appendChild(dom);
    }
    
    instance._root = dom;
    return dom;
  }


  const hydrate = (vnode, container) => render(vnode, container);

  return {
    build,
    render,
    hydrate,
    createElement,
    h: createElement,
    Fragment,
    createRef,
    isValidElement,
    Component: BaseComponent,
    cloneElement,
    createContext,
    toChildArray,
	useState,
	FC
  };
})();