(() => {
  // cleanroom.js
  var MINI = true;
  var MODE_SLASH = 0;
  var MODE_TEXT = 1;
  var MODE_WHITESPACE = 2;
  var MODE_TAGNAME = 3;
  var MODE_COMMENT = 4;
  var MODE_PROP_SET = 5;
  var MODE_PROP_APPEND = 6;
  var CHILD_APPEND = 0;
  var CHILD_RECURSE = 2;
  var TAG_SET = 3;
  var PROPS_ASSIGN = 4;
  var PROP_SET = MODE_PROP_SET;
  var build = function(statics) {
    const fields = arguments;
    const h = this;
    let mode = MODE_TEXT;
    let buffer = "";
    let quote = "";
    let current = [0];
    let char, propName;
    const commit = (field) => {
      if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))) {
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
      } else if (mode === MODE_WHITESPACE && buffer === "..." && field) {
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
            (current[2] = current[2] || {})[propName] = field ? buffer ? buffer + fields[field] : fields[field] : buffer;
            mode = MODE_PROP_APPEND;
          } else if (field || buffer) {
            current[2][propName] += field ? buffer + fields[field] : buffer;
          }
        } else {
          if (buffer || !field && mode === MODE_PROP_SET) {
            current.push(mode, 0, buffer, propName);
            mode = MODE_PROP_APPEND;
          }
          if (field) {
            current.push(mode, field, 0, propName);
            mode = MODE_PROP_APPEND;
          }
        }
      }
      buffer = "";
    };
    for (let i = 0; i < statics.length; i++) {
      if (i) {
        if (mode === MODE_TEXT) commit();
        commit(i);
      }
      for (let j = 0; j < statics[i].length; j++) {
        char = statics[i][j];
        if (mode === MODE_TEXT) {
          if (char === "<") {
            commit();
            if (MINI) {
              current = [current, "", null];
            } else {
              current = [current];
            }
            mode = MODE_TAGNAME;
          } else {
            buffer += char;
          }
        } else if (mode === MODE_COMMENT) {
          if (buffer === "--" && char === ">") {
            mode = MODE_TEXT;
            buffer = "";
          } else {
            buffer = char + buffer[0];
          }
        } else if (quote) {
          if (char === quote) quote = "";
          else buffer += char;
        } else if (char === '"' || char === "'") {
          quote = char;
        } else if (char === ">") {
          commit();
          mode = MODE_TEXT;
        } else if (!mode) {
        } else if (char === "=") {
          mode = MODE_PROP_SET;
          propName = buffer;
          buffer = "";
        } else if (char === "/" && (mode < MODE_PROP_SET || statics[i][j + 1] === ">")) {
          commit();
          if (mode === MODE_TAGNAME) current = current[0];
          mode = current;
          if (MINI) {
            (current = current[0]).push(h.apply(null, mode.slice(1)));
          } else {
            (current = current[0]).push(CHILD_RECURSE, 0, mode);
          }
          mode = MODE_SLASH;
        } else if (char === " " || char === "	" || char === "\n" || char === "\r") {
          commit();
          mode = MODE_WHITESPACE;
        } else {
          buffer += char;
        }
        if (mode === MODE_TAGNAME && buffer === "!--") {
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
  var components = /* @__PURE__ */ new Map();
  var renderQueue = [];
  var renderTimer = null;
  function processRenderQueue() {
    const queue = renderQueue.slice();
    renderQueue.length = 0;
    renderTimer = null;
    queue.forEach((component) => {
      if (component._dirty) renderComponent(component);
    });
  }
  var SKIP_CHILDREN = 0;
  var options = {
    _enqueueRender: (component) => {
      if (!component._dirty) return;
      if (renderQueue.indexOf(component) === -1) renderQueue.push(component);
      if (!renderTimer) renderTimer = setTimeout(processRenderQueue, 0);
    },
    _diff: null,
    _render: null,
    diffed: null,
    _commit: null,
    unmount: null,
    _root: null,
    _afterRender: null,
    _hook: null,
    _catchError: (error, vnode) => {
      console.error(error, vnode);
    },
    // Basic error handler
    _skipEffects: false,
    requestAnimationFrame: typeof requestAnimationFrame == "function" ? requestAnimationFrame : null,
    useDebugValue: null
  };
  var currentIndex;
  var currentComponent;
  var previousComponent;
  var currentHook = 0;
  var afterPaintEffects = [];
  var RAF_TIMEOUT = 35;
  var prevRaf;
  options._diff = (vnode) => {
    currentComponent = null;
  };
  options._root = (vnode, parentDom) => {
    if (vnode && parentDom._children && parentDom._children._mask) {
      vnode._mask = parentDom._children._mask;
    }
  };
  options._render = (vnode) => {
    currentComponent = vnode._component;
    currentIndex = 0;
    const hooks = currentComponent.__hooks;
    if (hooks) {
      if (previousComponent === currentComponent) {
        hooks._pendingEffects = [];
        currentComponent._renderCallbacks = [];
        hooks._list.forEach((hookItem) => {
          hookItem._pendingArgs = void 0;
        });
      } else {
        hooks._pendingEffects.forEach(invokeCleanup);
        hooks._pendingEffects.forEach(invokeEffect);
        hooks._pendingEffects = [];
        currentIndex = 0;
      }
    }
    previousComponent = currentComponent;
  };
  options.diffed = (vnode) => {
    const c = vnode._component;
    if (c && c.__hooks) {
      if (c.__hooks._pendingEffects.length) afterPaint(afterPaintEffects.push(c));
      c.__hooks._list.forEach((hookItem) => {
        if (hookItem._pendingArgs) {
          hookItem._args = hookItem._pendingArgs;
        }
        hookItem._pendingArgs = void 0;
      });
    }
    previousComponent = currentComponent = null;
  };
  options._commit = (vnode, commitQueue) => {
    commitQueue.some((component) => {
      try {
        component._renderCallbacks.forEach(invokeCleanup);
        component._renderCallbacks = component._renderCallbacks.filter(
          (cb) => cb._value ? invokeEffect(cb) : true
        );
      } catch (e) {
        commitQueue.some((c) => {
          if (c._renderCallbacks) c._renderCallbacks = [];
        });
        commitQueue = [];
        options._catchError(e, component._vnode);
      }
    });
  };
  options.unmount = (vnode) => {
    const c = vnode._component;
    if (c && c.__hooks) {
      let hasErrored;
      c.__hooks._list.forEach((s) => {
        try {
          invokeCleanup(s);
        } catch (e) {
          hasErrored = e;
        }
      });
      c.__hooks = void 0;
      if (hasErrored) options._catchError(hasErrored, c._vnode);
    }
  };
  options._afterRender = (newVNode, oldVNode) => {
    if (newVNode._component && newVNode._component.__hooks) {
      const hooks = newVNode._component.__hooks._list;
      const stateHooksThatExecuted = hooks.filter(
        (x) => x._component && x._didExecute
      );
      if (stateHooksThatExecuted.length && !stateHooksThatExecuted.some((x) => x._didUpdate) && oldVNode.props === newVNode.props) {
        newVNode._component.__hooks._pendingEffects = [];
        newVNode._flags |= SKIP_CHILDREN;
      }
      stateHooksThatExecuted.some((hook) => {
        hook._didExecute = hook._didUpdate = false;
      });
    }
  };
  function getHookState(index, type) {
    if (options._hook) {
      options._hook(currentComponent, index, currentHook || type);
    }
    currentHook = 0;
    const hooks = currentComponent.__hooks || (currentComponent.__hooks = {
      _list: [],
      _pendingEffects: []
    });
    if (index >= hooks._list.length) {
      hooks._list.push({});
    }
    return hooks._list[index];
  }
  function useReducer(reducer2, initialState2, init) {
    const hookState = getHookState(currentIndex++, 2);
    hookState._reducer = reducer2;
    if (!hookState._component) {
      hookState._actions = [];
      hookState._value = [
        !init ? invokeOrReturn(void 0, initialState2) : init(initialState2),
        (action) => {
          hookState._actions.push(action);
          hookState._component.setState({});
        }
      ];
      hookState._component = currentComponent;
      if (!currentComponent._hasScuFromHooks) {
        currentComponent._hasScuFromHooks = true;
        let prevScu = currentComponent.shouldComponentUpdate;
        currentComponent.shouldComponentUpdate = function(p, s, c) {
          return prevScu ? prevScu.call(this, p, s, c) || hookState._actions.length : hookState._actions.length;
        };
      }
    }
    if (hookState._actions.length) {
      const initialValue = hookState._value[0];
      hookState._actions.some((action) => {
        hookState._value[0] = hookState._reducer(hookState._value[0], action);
      });
      hookState._didUpdate = !Object.is(initialValue, hookState._value[0]);
      hookState._value = [hookState._value[0], hookState._value[1]];
      hookState._didExecute = true;
      hookState._actions = [];
    }
    return hookState._value;
  }
  function flushAfterPaintEffects() {
    let component;
    while (component = afterPaintEffects.shift()) {
      if (!component._parentDom || !component.__hooks) continue;
      try {
        component.__hooks._pendingEffects.forEach(invokeCleanup);
        component.__hooks._pendingEffects.forEach(invokeEffect);
        component.__hooks._pendingEffects = [];
      } catch (e) {
        component.__hooks._pendingEffects = [];
        options._catchError(e, component._vnode);
      }
    }
  }
  var HAS_RAF = typeof requestAnimationFrame == "function";
  function afterNextFrame(callback) {
    const done = () => {
      clearTimeout(timeout);
      if (HAS_RAF) cancelAnimationFrame(raf);
      setTimeout(callback);
    };
    const timeout = setTimeout(done, RAF_TIMEOUT);
    let raf;
    if (HAS_RAF) {
      raf = requestAnimationFrame(done);
    }
  }
  function afterPaint(newQueueLength) {
    if (newQueueLength === 1 || prevRaf !== options.requestAnimationFrame) {
      prevRaf = options.requestAnimationFrame;
      (prevRaf || afterNextFrame)(flushAfterPaintEffects);
    }
  }
  function invokeCleanup(hook) {
    const comp = currentComponent;
    let cleanup = hook._cleanup;
    if (typeof cleanup == "function") {
      hook._cleanup = void 0;
      cleanup();
    }
    currentComponent = comp;
  }
  function invokeEffect(hook) {
    const comp = currentComponent;
    hook._cleanup = hook._value();
    currentComponent = comp;
  }
  function invokeOrReturn(arg, f) {
    return typeof f == "function" ? f(arg) : f;
  }
  var FC = (fn) => {
    return class extends BaseComponent {
      render() {
        currentComponent = this;
        currentIndex = 0;
        const result = fn(this.props);
        currentComponent = null;
        return result;
      }
    };
  };
  function toChildArray(children) {
    if (children == null) return [];
    return Array.isArray(children) ? children.flat() : [children];
  }
  function createElement(type, props, ...children) {
    props = props || {};
    const normalizedChildren = children.flat().filter((child) => child != null && child !== false);
    props.children = normalizedChildren.length === 1 ? normalizedChildren[0] : normalizedChildren.length ? normalizedChildren : void 0;
    return { type, props, key: props.key || null, ref: props.ref || null, __isVNode: true };
  }
  var BaseComponent = class {
    constructor(props) {
      this.props = props || {};
      this.state = {};
      this.refs = {};
      this._dirty = false;
      this._pendingState = null;
    }
    setState(update, callback) {
      if (!this._pendingState) this._pendingState = { ...this.state };
      Object.assign(this._pendingState, typeof update === "function" ? update(this._pendingState, this.props) : update);
      this._dirty = true;
      options._enqueueRender(this);
      if (callback) setTimeout(callback, 0);
    }
    forceUpdate(callback) {
      this._dirty = true;
      renderComponent(this);
      if (callback) setTimeout(callback, 0);
    }
    render() {
      return null;
    }
  };
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
    if (vnode == null || typeof vnode === "boolean") {
      return document.createTextNode("");
    }
    if (typeof vnode === "string" || typeof vnode === "number") {
      return document.createTextNode(vnode);
    }
    if (Array.isArray(vnode)) {
      const fragment = document.createDocumentFragment();
      vnode.forEach((child) => {
        const childDom = renderToDom(child);
        if (childDom) fragment.appendChild(childDom);
      });
      return fragment;
    }
    if (typeof vnode.type === "function") {
      const props = vnode.props || {};
      if (vnode.type.prototype instanceof BaseComponent) {
        const component = new vnode.type(props);
        components.set(component, { vnode, dom: null, component });
        return renderComponent(component);
      }
      const renderedVNode = vnode.type(props);
      return renderToDom(renderedVNode);
    }
    const dom = vnode.type === "svg" ? document.createElementNS("http://www.w3.org/2000/svg", vnode.type) : document.createElement(vnode.type);
    setAttributes(dom, vnode.props || {});
    toChildArray(vnode.props ? vnode.props.children : []).forEach((child) => {
      const childDom = renderToDom(child);
      if (childDom) dom.appendChild(childDom);
    });
    if (vnode.ref) {
      typeof vnode.ref === "function" ? vnode.ref(dom) : vnode.ref.current = dom;
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
      name in dom && !(dom instanceof SVGElement) ? dom[name] = props[name] : dom.setAttribute(name, props[name]);
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

  // Counter.js
  var html = build.bind(createElement);
  var initialState = 1;
  var reducer = (state, action) => {
    switch (action) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      case "reset":
        return 0;
      default:
        throw new Error("Unexpected action");
    }
  };
  function Counter(props) {
    const [count, dispatch] = useReducer(reducer, props.state || initialState);
    return html`<div>
    <h2><pre>${count}</pre></h2> 
     <div class="button-group right" style="margin-top: 2em;">
      <button class="button" onClick=${() => dispatch("increment")}>+1</button>
      <button class="button" onClick=${() => dispatch("decrement")}>-1</button>
      <button class="button" onClick=${() => dispatch("reset")}>reset</button>
    </div>
      </div>`;
  }
  var Counter_default = FC(Counter);

  // app.js
  var html2 = build.bind(createElement);
  var App = () => html2`
  <div class="container">
    <h1 class="title"><img src="../cleanroom_guy.png" style="width:50px;position:relative;top:1em;"/>CLEANROOM.JS</h1>
   <hr/>
    <${Counter_default} />
  </div>
`;
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("app");
    render(createElement(App), container);
  });
})();
