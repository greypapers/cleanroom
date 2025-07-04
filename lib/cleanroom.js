// cleanroom.js

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

  const SKIP_CHILDREN = 0; // Placeholder for now, as it's not found in src/constants

  const options = {
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
    _catchError: (error, vnode) => { console.error(error, vnode); }, // Basic error handler
    _skipEffects: false,
    requestAnimationFrame: typeof requestAnimationFrame == 'function' ? requestAnimationFrame : null,
    useDebugValue: null
  };

  let currentIndex;
  let currentComponent;
  let previousComponent;
  let currentHook = 0;
  let afterPaintEffects = [];

  const RAF_TIMEOUT = 35;
  let prevRaf;

  options._diff = vnode => {
    currentComponent = null;
    // if (oldBeforeDiff) oldBeforeDiff(vnode); // No oldBeforeDiff in cleanroom_esm.js
  };

  options._root = (vnode, parentDom) => {
    if (vnode && parentDom._children && parentDom._children._mask) {
      vnode._mask = parentDom._children._mask;
    }
    // if (oldRoot) oldRoot(vnode, parentDom); // No oldRoot in cleanroom_esm.js
  };

  options._render = vnode => {
    // if (oldBeforeRender) oldBeforeRender(vnode); // No oldBeforeRender in cleanroom_esm.js

    currentComponent = vnode._component;
    currentIndex = 0;

    const hooks = currentComponent.__hooks;
    if (hooks) {
      if (previousComponent === currentComponent) {
        hooks._pendingEffects = [];
        currentComponent._renderCallbacks = [];
        hooks._list.forEach(hookItem => {
          hookItem._pendingArgs = undefined;
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

  options.diffed = vnode => {
    // if (oldAfterDiff) oldAfterDiff(vnode); // No oldAfterDiff in cleanroom_esm.js

    const c = vnode._component;
    if (c && c.__hooks) {
      if (c.__hooks._pendingEffects.length) afterPaint(afterPaintEffects.push(c));
      c.__hooks._list.forEach(hookItem => {
        if (hookItem._pendingArgs) {
          hookItem._args = hookItem._pendingArgs;
        }
        hookItem._pendingArgs = undefined;
      });
    }
    previousComponent = currentComponent = null;
  };

  options._commit = (vnode, commitQueue) => {
    commitQueue.some(component => {
      try {
        component._renderCallbacks.forEach(invokeCleanup);
        component._renderCallbacks = component._renderCallbacks.filter(cb =>
          cb._value ? invokeEffect(cb) : true
        );
      } catch (e) {
        commitQueue.some(c => {
          if (c._renderCallbacks) c._renderCallbacks = [];
        });
        commitQueue = [];
        options._catchError(e, component._vnode);
      }
    });

    // if (oldCommit) oldCommit(vnode, commitQueue); // No oldCommit in cleanroom_esm.js
  };

  options.unmount = vnode => {
    // if (oldBeforeUnmount) oldBeforeUnmount(vnode); // No oldBeforeUnmount in cleanroom_esm.js

    const c = vnode._component;
    if (c && c.__hooks) {
      let hasErrored;
      c.__hooks._list.forEach(s => {
        try {
          invokeCleanup(s);
        } catch (e) {
          hasErrored = e;
        }
      });
      c.__hooks = undefined;
      if (hasErrored) options._catchError(hasErrored, c._vnode);
    }
  };

  options._afterRender = (newVNode, oldVNode) => {
    if (newVNode._component && newVNode._component.__hooks) {
      const hooks = newVNode._component.__hooks._list;
      const stateHooksThatExecuted = hooks.filter(
        x => x._component && x._didExecute
      );

      if (
        stateHooksThatExecuted.length &&
        !stateHooksThatExecuted.some(x => x._didUpdate) &&
        oldVNode.props === newVNode.props
      ) {
        newVNode._component.__hooks._pendingEffects = [];
        newVNode._flags |= SKIP_CHILDREN;
      }

      stateHooksThatExecuted.some(hook => {
        hook._didExecute = hook._didUpdate = false;
      });
    }

    // if (oldAfterRender) oldAfterRender(newVNode, oldVNode); // No oldAfterRender in cleanroom_esm.js
  };

  function getHookState(index, type) {
    if (options._hook) {
      options._hook(currentComponent, index, currentHook || type);
    }
    currentHook = 0;

    const hooks =
      currentComponent.__hooks ||
      (currentComponent.__hooks = {
        _list: [],
        _pendingEffects: []
      });

    if (index >= hooks._list.length) {
      hooks._list.push({});
    }

    return hooks._list[index];
  }

  function useState(initialState) {
    currentHook = 1;
    return useReducer(invokeOrReturn, initialState);
  }

  function useReducer(reducer, initialState, init) {
    const hookState = getHookState(currentIndex++, 2);
    hookState._reducer = reducer;
    if (!hookState._component) {
      hookState._actions = [];
      hookState._value = [
        !init ? invokeOrReturn(undefined, initialState) : init(initialState),

        action => {
          hookState._actions.push(action);
          hookState._component.setState({});
        }
      ];

      hookState._component = currentComponent;

      if (!currentComponent._hasScuFromHooks) {
        currentComponent._hasScuFromHooks = true;
        let prevScu = currentComponent.shouldComponentUpdate;

        currentComponent.shouldComponentUpdate = function (p, s, c) {
          return prevScu
            ? prevScu.call(this, p, s, c) || hookState._actions.length
            : hookState._actions.length;
        };
      }
    }

    if (hookState._actions.length) {
      const initialValue = hookState._value[0];
      hookState._actions.some(action => {
        hookState._value[0] = hookState._reducer(hookState._value[0], action);
      });

      hookState._didUpdate = !Object.is(initialValue, hookState._value[0]);
      hookState._value = [hookState._value[0], hookState._value[1]];
      hookState._didExecute = true;
      hookState._actions = [];
    }

    return hookState._value;
  }

  function useEffect(callback, args) {
    const state = getHookState(currentIndex++, 3);
    if (!options._skipEffects && argsChanged(state._args, args)) {
      state._value = callback;
      state._pendingArgs = args;

      currentComponent.__hooks._pendingEffects.push(state);
    }
  }

  function useLayoutEffect(callback, args) {
    const state = getHookState(currentIndex++, 4);
    if (!options._skipEffects && argsChanged(state._args, args)) {
      state._value = callback;
      state._pendingArgs = args;

      currentComponent._renderCallbacks.push(state);
    }
  }

  function useRef(initialValue) {
    currentHook = 5;
    return useMemo(() => ({ current: initialValue }), []);
  }

  function useImperativeHandle(ref, createHandle, args) {
    currentHook = 6;
    useLayoutEffect(
      () => {
        if (typeof ref == 'function') {
          const result = ref(createHandle());
          return () => {
            ref(null);
            if (result && typeof result == 'function') result();
          };
        } else if (ref) {
          ref.current = createHandle();
          return () => (ref.current = null);
        }
      },
      args == null ? args : args.concat(ref)
    );
  }

  function useMemo(factory, args) {
    const state = getHookState(currentIndex++, 7);
    if (argsChanged(state._args, args)) {
      state._value = factory();
      state._args = args;
      state._factory = factory;
    }

    return state._value;
  }

  function useCallback(callback, args) {
    currentHook = 8;
    return useMemo(() => callback, args);
  }

  function useContext(context) {
    const provider = currentComponent.context[context._id];
    const state = getHookState(currentIndex++, 9);
    state._context = context;
    if (!provider) return context._defaultValue;
    if (state._value == null) {
      state._value = true;
      provider.sub(currentComponent);
    }
    return provider.props.value;
  }

  function useDebugValue(value, formatter) {
    if (options.useDebugValue) {
      options.useDebugValue(
        formatter ? formatter(value) : value
      );
    }
  }

  function useErrorBoundary(cb) {
    const state = getHookState(currentIndex++, 10);
    const errState = useState();
    state._value = cb;
    if (!currentComponent.componentDidCatch) {
      currentComponent.componentDidCatch = (err, errorInfo) => {
        if (state._value) state._value(err, errorInfo);
        errState[1](err);
      };
    }
    return [
      errState[0],
      () => {
        errState[1](undefined);
      }
    ];
  }

  function useId() {
    const state = getHookState(currentIndex++, 11);
    if (!state._value) {
      let root = currentComponent._vnode;
      while (root !== null && !root._mask && root._parent !== null) {
        root = root._parent;
      }

      let mask = root._mask || (root._mask = [0, 0]);
      state._value = 'P' + mask[0] + '-' + mask[1]++;
    }

    return state._value;
  }

  function flushAfterPaintEffects() {
    let component;
    while ((component = afterPaintEffects.shift())) {
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

  let HAS_RAF = typeof requestAnimationFrame == 'function';

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
    if (typeof cleanup == 'function') {
      hook._cleanup = undefined;
      cleanup();
    }

    currentComponent = comp;
  }

  function invokeEffect(hook) {
    const comp = currentComponent;
    hook._cleanup = hook._value();
    currentComponent = comp;
  }

  function argsChanged(oldArgs, newArgs) {
    return (
      !oldArgs ||
      oldArgs.length !== newArgs.length ||
      newArgs.some((arg, index) => !Object.is(arg, oldArgs[index]))
    );
  }

  function invokeOrReturn(arg, f) {
    return typeof f == 'function' ? f(arg) : f;
  }

  // Functional component wrapper
  const FC = (fn) => {
    return class extends BaseComponent {
      render() {
        currentComponent = this; // Set for hooks
        currentIndex = 0; // Reset hook index
        const result = fn(this.props);
        currentComponent = null; // Clear after rendering
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


  ;

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


/**
 * @template T
 * @typedef {object} Signal
 * @property {T} value
 */

/**
 * @template T
 * @param {T} value
 * @returns {Signal<T>}
 */
function signal(value) {
  const s = {
    value,
    _listeners: [],
    _version: 0,
    _node: undefined,
    _flags: 0,
    _subscriptions: undefined,
    _compute: undefined,
    _deps: undefined,
    _inputs: undefined,
    _queued: undefined,
    _globalVersion: 0,
  };
  return s;
}

/**
 * @template T
 * @param {() => T} compute
 * @returns {Signal<T>}
 */
function computed(compute) {
  const s = signal(undefined);
  s._compute = compute;
  return s;
}

/**
 * @param {() => void} effect
 * @returns {() => void}
 */
function effect(effect) {
  const s = computed(effect);
  s._flags |= 1; // Effect flag
  return () => {
    s._flags &= ~1; // Clear effect flag
    s._listeners.length = 0;
  };
}

/**
 * @template T
 * @param {Signal<T>} s
 * @param {(value: T) => void} listener
 * @returns {() => void}
 */
function subscribe(s, listener) {
  s._listeners.push(listener);
  return () => {
    const i = s._listeners.indexOf(listener);
    if (i > -1) s._listeners.splice(i, 1);
  };
}

/**
 * @template T
 * @param {Signal<T>} s
 * @returns {T}
 */
function peek(s) {
  return s.value;
}

/**
 * @template T
 * @param {Signal<T>} s
 * @returns {T}
 */
function untrack(s) {
  const prev = currentComponent;
  currentComponent = undefined;
  const value = s.value;
  currentComponent = prev;
  return value;
}

/**
 * @template T
 * @param {Signal<T>} s
 * @returns {T}
 */
function useSignal(s) {
  const [value, setValue] = useState(s.value);
  useEffect(() => subscribe(s, setValue), [s]);
  return value;
}

/**
 * @template T
 * @param {T} value
 * @returns {Signal<T>}
 */
function useComputed(value) {
  return useMemo(() => computed(value), [value]);
}

/**
 * @param {() => void} effect
 * @returns {void}
 */
function useSignalEffect(effect) {
  useEffect(() => {
    const s = computed(effect);
    s._flags |= 1; // Effect flag
    return () => {
      s._flags &= ~1; // Clear effect flag
      s._listeners.length = 0;
    };
  }, [effect]);
}

// Export all the functions
export {
    build,
    build as htm,
    render,
    hydrate,
    createElement,
    createElement as h,
    Fragment,
    createRef,
    isValidElement,
    BaseComponent as Component,
    cloneElement,
    createContext,
    toChildArray,
	useState,
	FC,
    useEffect,
    signal,
    computed,
    effect,
    subscribe,
    peek,
    untrack,
    useSignal,
    useComputed,
    useSignalEffect
};