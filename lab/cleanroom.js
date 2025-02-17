/** catch-error.js *********************************************************************/

/**
 * Find the closest error boundary to a thrown error and call it
 * @param {object} error The thrown value
 * @param {import('../internal').VNode} vnode The vnode that threw the error that was caught (except
 * for unmounting when this parameter is the highest parent that was being
 * unmounted)
 * @param {import('../internal').VNode} [oldVNode]
 * @param {import('../internal').ErrorInfo} [errorInfo]
 */
export function _catchError(error, vnode, oldVNode, errorInfo) {
	/** @type {import('../internal').Component} */
	let component,
		/** @type {import('../internal').ComponentType} */
		ctor,
		/** @type {boolean} */
		handled;

	for (; (vnode = vnode._parent); ) {
		if ((component = vnode._component) && !component._processingException) {
			try {
				ctor = component.constructor;

				if (ctor && ctor.getDerivedStateFromError != null) {
					component.setState(ctor.getDerivedStateFromError(error));
					handled = component._dirty;
				}

				if (component.componentDidCatch != null) {
					component.componentDidCatch(error, errorInfo || {});
					handled = component._dirty;
				}

				// This is an error boundary. Mark it as having bailed out, and whether it was mid-hydration.
				if (handled) {
					return (component._pendingError = component);
				}
			} catch (e) {
				error = e;
			}
		}
	}

	throw error;
}

/** options.js ********************************************************************/

import { _catchError } from './diff/catch-error';

/**
 * The `option` object can potentially contain callback functions
 * that are called during various stages of our renderer. This is the
 * foundation on which all our addons like `preact/debug`, `preact/compat`,
 * and `preact/hooks` are based on. See the `Options` type in `internal.d.ts`
 * for a full list of available option hooks (most editors/IDEs allow you to
 * ctrl+click or cmd+click on mac the type definition below).
 * @type {import('./internal').Options}
 */
const options = {
	_catchError
};

export default options;

/** constant.js **/

/** Normal hydration that attaches to a DOM tree but does not diff it. */
export const MODE_HYDRATE = 1 << 5;
/** Signifies this VNode suspended on the previous render */
export const MODE_SUSPENDED = 1 << 7;
/** Indicates that this node needs to be inserted while patching children */
export const INSERT_VNODE = 1 << 2;
/** Indicates a VNode has been matched with another VNode in the diff */
export const MATCHED = 1 << 1;

/** Reset all mode flags */
export const RESET_MODE = ~(MODE_HYDRATE | MODE_SUSPENDED);

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
export const MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';

export const UNDEFINED = undefined;
export const EMPTY_OBJ = /** @type {any} */ ({});
export const EMPTY_ARR = [];
export const IS_NON_DIMENSIONAL =
	/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
	
	
/** util.js ***************************************************************/
	
	import { EMPTY_ARR } from './constants';

	export const isArray = Array.isArray;

	/**
	 * Assign properties from `props` to `obj`
	 * @template O, P The obj and props types
	 * @param {O} obj The object to copy properties to
	 * @param {P} props The object to copy properties from
	 * @returns {O & P}
	 */
	export function assign(obj, props) {
		// @ts-expect-error We change the type of `obj` to be `O & P`
		for (let i in props) obj[i] = props[i];
		return /** @type {O & P} */ (obj);
	}

	/**
	 * Remove a child node from its parent if attached. This is a workaround for
	 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
	 * is smaller than including a dedicated polyfill.
	 * @param {import('./index').ContainerNode} node The node to remove
	 */
	export function removeNode(node) {
		if (node && node.parentNode) node.parentNode.removeChild(node);
	}

	export const slice = EMPTY_ARR.slice;

/*** render.js **** /
	
import { EMPTY_OBJ } from './constants';
import { commitRoot, diff } from './diff/index';
import { createElement, Fragment } from './create-element';
import options from './options';
import { slice } from './util';

/**
 * Render a Preact virtual node into a DOM element
 * @param {import('./internal').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to render into
 * @param {import('./internal').PreactElement | object} [replaceNode] Optional: Attempt to re-use an
 * existing DOM tree rooted at `replaceNode`
 */
export function render(vnode, parentDom, replaceNode) {
	// https://github.com/preactjs/preact/issues/3794
	if (parentDom == document) {
		parentDom = document.documentElement;
	}

	if (options._root) options._root(vnode, parentDom);

	// We abuse the `replaceNode` parameter in `hydrate()` to signal if we are in
	// hydration mode or not by passing the `hydrate` function instead of a DOM
	// element..
	let isHydrating = typeof replaceNode == 'function';

	// To be able to support calling `render()` multiple times on the same
	// DOM node, we need to obtain a reference to the previous tree. We do
	// this by assigning a new `_children` property to DOM nodes which points
	// to the last rendered tree. By default this property is not present, which
	// means that we are mounting a new tree for the first time.
	let oldVNode = isHydrating
		? null
		: (replaceNode && replaceNode._children) || parentDom._children;

	vnode = ((!isHydrating && replaceNode) || parentDom)._children =
		createElement(Fragment, null, [vnode]);

	// List of effects that need to be called after diffing.
	let commitQueue = [],
		refQueue = [];
	diff(
		parentDom,
		// Determine the new vnode tree and store it on the DOM element on
		// our custom `_children` property.
		vnode,
		oldVNode || EMPTY_OBJ,
		EMPTY_OBJ,
		parentDom.namespaceURI,
		!isHydrating && replaceNode
			? [replaceNode]
			: oldVNode
				? null
				: parentDom.firstChild
					? slice.call(parentDom.childNodes)
					: null,
		commitQueue,
		!isHydrating && replaceNode
			? replaceNode
			: oldVNode
				? oldVNode._dom
				: parentDom.firstChild,
		isHydrating,
		refQueue
	);

	// Flush all queued effects
	commitRoot(commitQueue, vnode, refQueue);
}

/**
 * Update an existing DOM element with data from a Preact virtual node
 * @param {import('./internal').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to update
 */
export function hydrate(vnode, parentDom) {
	render(vnode, parentDom, hydrate);
}

	
/** create-element.js *************************************************************/ 

	import { slice } from './util';
	import options from './options';
	import { UNDEFINED } from './constants';

	let vnodeId = 0;

	/**
	 * Create an virtual node (used for JSX)
	 * @param {import('./internal').VNode["type"]} type The node name or Component constructor for this
	 * virtual node
	 * @param {object | null | undefined} [props] The properties of the virtual node
	 * @param {Array<import('.').ComponentChildren>} [children] The children of the
	 * virtual node
	 * @returns {import('./internal').VNode}
	 */
	export function createElement(type, props, children) {
		let normalizedProps = {},
			key,
			ref,
			i;
		for (i in props) {
			if (i == 'key') key = props[i];
			else if (i == 'ref') ref = props[i];
			else normalizedProps[i] = props[i];
		}

		if (arguments.length > 2) {
			normalizedProps.children =
				arguments.length > 3 ? slice.call(arguments, 2) : children;
		}

		// If a Component VNode, check for and apply defaultProps
		// Note: type may be undefined in development, must never error here.
		if (typeof type == 'function' && type.defaultProps != null) {
			for (i in type.defaultProps) {
				if (normalizedProps[i] === UNDEFINED) {
					normalizedProps[i] = type.defaultProps[i];
				}
			}
		}

		return createVNode(type, normalizedProps, key, ref, null);
	}

	/**
	 * Create a VNode (used internally by Preact)
	 * @param {import('./internal').VNode["type"]} type The node name or Component
	 * Constructor for this virtual node
	 * @param {object | string | number | null} props The properties of this virtual node.
	 * If this virtual node represents a text node, this is the text of the node (string or number).
	 * @param {string | number | null} key The key for this virtual node, used when
	 * diffing it against its children
	 * @param {import('./internal').VNode["ref"]} ref The ref property that will
	 * receive a reference to its created child
	 * @returns {import('./internal').VNode}
	 */
	export function createVNode(type, props, key, ref, original) {
		// V8 seems to be better at detecting type shapes if the object is allocated from the same call site
		// Do not inline into createElement and coerceToVNode!
		/** @type {import('./internal').VNode} */
		const vnode = {
			type,
			props,
			key,
			ref,
			_children: null,
			_parent: null,
			_depth: 0,
			_dom: null,
			_component: null,
			constructor: UNDEFINED,
			_original: original == null ? ++vnodeId : original,
			_index: -1,
			_flags: 0
		};

		// Only invoke the vnode hook if this was *not* a direct copy:
		if (original == null && options.vnode != null) options.vnode(vnode);

		return vnode;
	}

	export function createRef() {
		return { current: null };
	}

	export function Fragment(props) {
		return props.children;
	}

	/**
	 * Check if a the argument is a valid Preact VNode.
	 * @param {*} vnode
	 * @returns {vnode is VNode}
	 */
	export const isValidElement = vnode =>
		vnode != null && vnode.constructor == UNDEFINED;

/** component.js ***********************************************************************/
		
		import { assign } from './util';
		import { diff, commitRoot } from './diff/index';
		import options from './options';
		import { Fragment } from './create-element';
		import { MODE_HYDRATE } from './constants';

		/**
		 * Base Component class. Provides `setState()` and `forceUpdate()`, which
		 * trigger rendering
		 * @param {object} props The initial component props
		 * @param {object} context The initial context from parent components'
		 * getChildContext
		 */
		export function BaseComponent(props, context) {
			this.props = props;
			this.context = context;
		}

		/**
		 * Update component state and schedule a re-render.
		 * @this {import('./internal').Component}
		 * @param {object | ((s: object, p: object) => object)} update A hash of state
		 * properties to update with new values or a function that given the current
		 * state and props returns a new partial state
		 * @param {() => void} [callback] A function to be called once component state is
		 * updated
		 */
		BaseComponent.prototype.setState = function (update, callback) {
			// only clone state when copying to nextState the first time.
			let s;
			if (this._nextState != null && this._nextState !== this.state) {
				s = this._nextState;
			} else {
				s = this._nextState = assign({}, this.state);
			}

			if (typeof update == 'function') {
				// Some libraries like `immer` mark the current state as readonly,
				// preventing us from mutating it, so we need to clone it. See #2716
				update = update(assign({}, s), this.props);
			}

			if (update) {
				assign(s, update);
			}

			// Skip update if updater function returned null
			if (update == null) return;

			if (this._vnode) {
				if (callback) {
					this._stateCallbacks.push(callback);
				}
				enqueueRender(this);
			}
		};

		/**
		 * Immediately perform a synchronous re-render of the component
		 * @this {import('./internal').Component}
		 * @param {() => void} [callback] A function to be called after component is
		 * re-rendered
		 */
		BaseComponent.prototype.forceUpdate = function (callback) {
			if (this._vnode) {
				// Set render mode so that we can differentiate where the render request
				// is coming from. We need this because forceUpdate should never call
				// shouldComponentUpdate
				this._force = true;
				if (callback) this._renderCallbacks.push(callback);
				enqueueRender(this);
			}
		};

		/**
		 * Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
		 * Virtual DOM is generally constructed via [JSX](https://jasonformat.com/wtf-is-jsx).
		 * @param {object} props Props (eg: JSX attributes) received from parent
		 * element/component
		 * @param {object} state The component's current state
		 * @param {object} context Context object, as returned by the nearest
		 * ancestor's `getChildContext()`
		 * @returns {ComponentChildren | void}
		 */
		BaseComponent.prototype.render = Fragment;

		/**
		 * @param {import('./internal').VNode} vnode
		 * @param {number | null} [childIndex]
		 */
		export function getDomSibling(vnode, childIndex) {
			if (childIndex == null) {
				// Use childIndex==null as a signal to resume the search from the vnode's sibling
				return vnode._parent
					? getDomSibling(vnode._parent, vnode._index + 1)
					: null;
			}

			let sibling;
			for (; childIndex < vnode._children.length; childIndex++) {
				sibling = vnode._children[childIndex];

				if (sibling != null && sibling._dom != null) {
					// Since updateParentDomPointers keeps _dom pointer correct,
					// we can rely on _dom to tell us if this subtree contains a
					// rendered DOM node, and what the first rendered DOM node is
					return sibling._dom;
				}
			}

			// If we get here, we have not found a DOM node in this vnode's children.
			// We must resume from this vnode's sibling (in it's parent _children array)
			// Only climb up and search the parent if we aren't searching through a DOM
			// VNode (meaning we reached the DOM parent of the original vnode that began
			// the search)
			return typeof vnode.type == 'function' ? getDomSibling(vnode) : null;
		}

		/**
		 * Trigger in-place re-rendering of a component.
		 * @param {import('./internal').Component} component The component to rerender
		 */
		function renderComponent(component) {
			let oldVNode = component._vnode,
				oldDom = oldVNode._dom,
				commitQueue = [],
				refQueue = [];

			if (component._parentDom) {
				const newVNode = assign({}, oldVNode);
				newVNode._original = oldVNode._original + 1;
				if (options.vnode) options.vnode(newVNode);

				diff(
					component._parentDom,
					newVNode,
					oldVNode,
					component._globalContext,
					component._parentDom.namespaceURI,
					oldVNode._flags & MODE_HYDRATE ? [oldDom] : null,
					commitQueue,
					oldDom == null ? getDomSibling(oldVNode) : oldDom,
					!!(oldVNode._flags & MODE_HYDRATE),
					refQueue
				);

				newVNode._original = oldVNode._original;
				newVNode._parent._children[newVNode._index] = newVNode;
				commitRoot(commitQueue, newVNode, refQueue);

				if (newVNode._dom != oldDom) {
					updateParentDomPointers(newVNode);
				}
			}
		}

		/**
		 * @param {import('./internal').VNode} vnode
		 */
		function updateParentDomPointers(vnode) {
			if ((vnode = vnode._parent) != null && vnode._component != null) {
				vnode._dom = vnode._component.base = null;
				for (let i = 0; i < vnode._children.length; i++) {
					let child = vnode._children[i];
					if (child != null && child._dom != null) {
						vnode._dom = vnode._component.base = child._dom;
						break;
					}
				}

				return updateParentDomPointers(vnode);
			}
		}

		/**
		 * The render queue
		 * @type {Array<import('./internal').Component>}
		 */
		let rerenderQueue = [];

		/*
		 * The value of `Component.debounce` must asynchronously invoke the passed in callback. It is
		 * important that contributors to Preact can consistently reason about what calls to `setState`, etc.
		 * do, and when their effects will be applied. See the links below for some further reading on designing
		 * asynchronous APIs.
		 * * [Designing APIs for Asynchrony](https://blog.izs.me/2013/08/designing-apis-for-asynchrony)
		 * * [Callbacks synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)
		 */

		let prevDebounce;

		const defer =
			typeof Promise == 'function'
				? Promise.prototype.then.bind(Promise.resolve())
				: setTimeout;

		/**
		 * Enqueue a rerender of a component
		 * @param {import('./internal').Component} c The component to rerender
		 */
		export function enqueueRender(c) {
			if (
				(!c._dirty &&
					(c._dirty = true) &&
					rerenderQueue.push(c) &&
					!process._rerenderCount++) ||
				prevDebounce !== options.debounceRendering
			) {
				prevDebounce = options.debounceRendering;
				(prevDebounce || defer)(process);
			}
		}

		/**
		 * @param {import('./internal').Component} a
		 * @param {import('./internal').Component} b
		 */
		const depthSort = (a, b) => a._vnode._depth - b._vnode._depth;

		/** Flush the render queue by rerendering all queued components */
		function process() {
			let c,
				l = 1;

			// Don't update `renderCount` yet. Keep its value non-zero to prevent unnecessary
			// process() calls from getting scheduled while `queue` is still being consumed.
			while (rerenderQueue.length) {
				// Keep the rerender queue sorted by (depth, insertion order). The queue
				// will initially be sorted on the first iteration only if it has more than 1 item.
				//
				// New items can be added to the queue e.g. when rerendering a provider, so we want to
				// keep the order from top to bottom with those new items so we can handle them in a
				// single pass
				if (rerenderQueue.length > l) {
					rerenderQueue.sort(depthSort);
				}

				c = rerenderQueue.shift();
				l = rerenderQueue.length;

				if (c._dirty) {
					renderComponent(c);
				}
			}
			process._rerenderCount = 0;
		}

		process._rerenderCount = 0;
		
/** clone-element.js ***************************************************************/		


/** create-context.js ***************************************************************/

		import { enqueueRender } from './component';

		export let i = 0;

		export function createContext(defaultValue) {
			function Context(props) {
				if (!this.getChildContext) {
					/** @type {Set<import('./internal').Component> | null} */
					let subs = new Set();
					let ctx = {};
					ctx[Context._id] = this;

					this.getChildContext = () => ctx;

					this.componentWillUnmount = () => {
						subs = null;
					};

					this.shouldComponentUpdate = function (_props) {
						// @ts-expect-error even
						if (this.props.value !== _props.value) {
							subs.forEach(c => {
								c._force = true;
								enqueueRender(c);
							});
						}
					};

					this.sub = c => {
						subs.add(c);
						let old = c.componentWillUnmount;
						c.componentWillUnmount = () => {
							if (subs) {
								subs.delete(c);
							}
							if (old) old.call(c);
						};
					};
				}

				return props.children;
			}

			Context._id = '__cC' + i++;
			Context._defaultValue = defaultValue;

			/** @type {import('./internal').FunctionComponent} */
			Context.Consumer = (props, contextValue) => {
				return props.children(contextValue);
			};

			// we could also get rid of _contextRef entirely
			Context.Provider =
				Context._contextRef =
				Context.Consumer.contextType =
					Context;

			return Context;
		}		
		
/** diff/children.js ******************************************************************/
		
		import { diff, unmount, applyRef } from './index';
		import { createVNode, Fragment } from '../create-element';
		import {
			EMPTY_OBJ,
			EMPTY_ARR,
			INSERT_VNODE,
			MATCHED,
			UNDEFINED
		} from '../constants';
		import { isArray } from '../util';
		import { getDomSibling } from '../component';

		/**
		 * @typedef {import('../internal').ComponentChildren} ComponentChildren
		 * @typedef {import('../internal').Component} Component
		 * @typedef {import('../internal').PreactElement} PreactElement
		 * @typedef {import('../internal').VNode} VNode
		 */

		/**
		 * Diff the children of a virtual node
		 * @param {PreactElement} parentDom The DOM element whose children are being
		 * diffed
		 * @param {ComponentChildren[]} renderResult
		 * @param {VNode} newParentVNode The new virtual node whose children should be
		 * diff'ed against oldParentVNode
		 * @param {VNode} oldParentVNode The old virtual node whose children should be
		 * diff'ed against newParentVNode
		 * @param {object} globalContext The current context object - modified by
		 * getChildContext
		 * @param {string} namespace Current namespace of the DOM node (HTML, SVG, or MathML)
		 * @param {Array<PreactElement>} excessDomChildren
		 * @param {Array<Component>} commitQueue List of components which have callbacks
		 * to invoke in commitRoot
		 * @param {PreactElement} oldDom The current attached DOM element any new dom
		 * elements should be placed around. Likely `null` on first render (except when
		 * hydrating). Can be a sibling DOM element when diffing Fragments that have
		 * siblings. In most cases, it starts out as `oldChildren[0]._dom`.
		 * @param {boolean} isHydrating Whether or not we are in hydration
		 * @param {any[]} refQueue an array of elements needed to invoke refs
		 */
		export function diffChildren(
			parentDom,
			renderResult,
			newParentVNode,
			oldParentVNode,
			globalContext,
			namespace,
			excessDomChildren,
			commitQueue,
			oldDom,
			isHydrating,
			refQueue
		) {
			let i,
				/** @type {VNode} */
				oldVNode,
				/** @type {VNode} */
				childVNode,
				/** @type {PreactElement} */
				newDom,
				/** @type {PreactElement} */
				firstChildDom;

			// This is a compression of oldParentVNode!=null && oldParentVNode != EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR
			// as EMPTY_OBJ._children should be `undefined`.
			/** @type {VNode[]} */
			let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR;

			let newChildrenLength = renderResult.length;

			oldDom = constructNewChildrenArray(
				newParentVNode,
				renderResult,
				oldChildren,
				oldDom,
				newChildrenLength
			);

			for (i = 0; i < newChildrenLength; i++) {
				childVNode = newParentVNode._children[i];
				if (childVNode == null) continue;

				// At this point, constructNewChildrenArray has assigned _index to be the
				// matchingIndex for this VNode's oldVNode (or -1 if there is no oldVNode).
				if (childVNode._index === -1) {
					oldVNode = EMPTY_OBJ;
				} else {
					oldVNode = oldChildren[childVNode._index] || EMPTY_OBJ;
				}

				// Update childVNode._index to its final index
				childVNode._index = i;

				// Morph the old element into the new one, but don't append it to the dom yet
				let result = diff(
					parentDom,
					childVNode,
					oldVNode,
					globalContext,
					namespace,
					excessDomChildren,
					commitQueue,
					oldDom,
					isHydrating,
					refQueue
				);

				// Adjust DOM nodes
				newDom = childVNode._dom;
				if (childVNode.ref && oldVNode.ref != childVNode.ref) {
					if (oldVNode.ref) {
						applyRef(oldVNode.ref, null, childVNode);
					}
					refQueue.push(
						childVNode.ref,
						childVNode._component || newDom,
						childVNode
					);
				}

				if (firstChildDom == null && newDom != null) {
					firstChildDom = newDom;
				}

				if (
					childVNode._flags & INSERT_VNODE ||
					oldVNode._children === childVNode._children
				) {
					oldDom = insert(childVNode, oldDom, parentDom);
				} else if (typeof childVNode.type == 'function' && result !== UNDEFINED) {
					oldDom = result;
				} else if (newDom) {
					oldDom = newDom.nextSibling;
				}

				// Unset diffing flags
				childVNode._flags &= ~(INSERT_VNODE | MATCHED);
			}

			newParentVNode._dom = firstChildDom;

			return oldDom;
		}

		/**
		 * @param {VNode} newParentVNode
		 * @param {ComponentChildren[]} renderResult
		 * @param {VNode[]} oldChildren
		 */
		function constructNewChildrenArray(
			newParentVNode,
			renderResult,
			oldChildren,
			oldDom,
			newChildrenLength
		) {
			/** @type {number} */
			let i;
			/** @type {VNode} */
			let childVNode;
			/** @type {VNode} */
			let oldVNode;

			let oldChildrenLength = oldChildren.length,
				remainingOldChildren = oldChildrenLength;

			let skew = 0;

			newParentVNode._children = new Array(newChildrenLength);
			for (i = 0; i < newChildrenLength; i++) {
				// @ts-expect-error We are reusing the childVNode variable to hold both the
				// pre and post normalized childVNode
				childVNode = renderResult[i];

				if (
					childVNode == null ||
					typeof childVNode == 'boolean' ||
					typeof childVNode == 'function'
				) {
					newParentVNode._children[i] = null;
					continue;
				}
				// If this newVNode is being reused (e.g. <div>{reuse}{reuse}</div>) in the same diff,
				// or we are rendering a component (e.g. setState) copy the oldVNodes so it can have
				// it's own DOM & etc. pointers
				else if (
					typeof childVNode == 'string' ||
					typeof childVNode == 'number' ||
					// eslint-disable-next-line valid-typeof
					typeof childVNode == 'bigint' ||
					childVNode.constructor == String
				) {
					childVNode = newParentVNode._children[i] = createVNode(
						null,
						childVNode,
						null,
						null,
						null
					);
				} else if (isArray(childVNode)) {
					childVNode = newParentVNode._children[i] = createVNode(
						Fragment,
						{ children: childVNode },
						null,
						null,
						null
					);
				} else if (childVNode.constructor === UNDEFINED && childVNode._depth > 0) {
					// VNode is already in use, clone it. This can happen in the following
					// scenario:
					//   const reuse = <div />
					//   <div>{reuse}<span />{reuse}</div>
					childVNode = newParentVNode._children[i] = createVNode(
						childVNode.type,
						childVNode.props,
						childVNode.key,
						childVNode.ref ? childVNode.ref : null,
						childVNode._original
					);
				} else {
					childVNode = newParentVNode._children[i] = childVNode;
				}

				const skewedIndex = i + skew;
				childVNode._parent = newParentVNode;
				childVNode._depth = newParentVNode._depth + 1;

				// Temporarily store the matchingIndex on the _index property so we can pull
				// out the oldVNode in diffChildren. We'll override this to the VNode's
				// final index after using this property to get the oldVNode
				const matchingIndex = (childVNode._index = findMatchingIndex(
					childVNode,
					oldChildren,
					skewedIndex,
					remainingOldChildren
				));

				oldVNode = null;
				if (matchingIndex !== -1) {
					oldVNode = oldChildren[matchingIndex];
					remainingOldChildren--;
					if (oldVNode) {
						oldVNode._flags |= MATCHED;
					}
				}

				// Here, we define isMounting for the purposes of the skew diffing
				// algorithm. Nodes that are unsuspending are considered mounting and we detect
				// this by checking if oldVNode._original === null
				const isMounting = oldVNode == null || oldVNode._original === null;

				if (isMounting) {
					if (matchingIndex == -1) {
						skew--;
					}

					// If we are mounting a DOM VNode, mark it for insertion
					if (typeof childVNode.type != 'function') {
						childVNode._flags |= INSERT_VNODE;
					}
				} else if (matchingIndex != skewedIndex) {
					// When we move elements around i.e. [0, 1, 2] --> [1, 0, 2]
					// --> we diff 1, we find it at position 1 while our skewed index is 0 and our skew is 0
					//     we set the skew to 1 as we found an offset.
					// --> we diff 0, we find it at position 0 while our skewed index is at 2 and our skew is 1
					//     this makes us increase the skew again.
					// --> we diff 2, we find it at position 2 while our skewed index is at 4 and our skew is 2
					//
					// this becomes an optimization question where currently we see a 1 element offset as an insertion
					// or deletion i.e. we optimize for [0, 1, 2] --> [9, 0, 1, 2]
					// while a more than 1 offset we see as a swap.
					// We could probably build heuristics for having an optimized course of action here as well, but
					// might go at the cost of some bytes.
					//
					// If we wanted to optimize for i.e. only swaps we'd just do the last two code-branches and have
					// only the first item be a re-scouting and all the others fall in their skewed counter-part.
					// We could also further optimize for swaps
					if (matchingIndex == skewedIndex - 1) {
						skew--;
					} else if (matchingIndex == skewedIndex + 1) {
						skew++;
					} else {
						if (matchingIndex > skewedIndex) {
							skew--;
						} else {
							skew++;
						}

						// Move this VNode's DOM if the original index (matchingIndex) doesn't
						// match the new skew index (i + new skew)
						// In the former two branches we know that it matches after skewing
						childVNode._flags |= INSERT_VNODE;
					}
				}
			}

			// Remove remaining oldChildren if there are any. Loop forwards so that as we
			// unmount DOM from the beginning of the oldChildren, we can adjust oldDom to
			// point to the next child, which needs to be the first DOM node that won't be
			// unmounted.
			if (remainingOldChildren) {
				for (i = 0; i < oldChildrenLength; i++) {
					oldVNode = oldChildren[i];
					if (oldVNode != null && (oldVNode._flags & MATCHED) == 0) {
						if (oldVNode._dom == oldDom) {
							oldDom = getDomSibling(oldVNode);
						}

						unmount(oldVNode, oldVNode);
					}
				}
			}

			return oldDom;
		}

		/**
		 * @param {VNode} parentVNode
		 * @param {PreactElement} oldDom
		 * @param {PreactElement} parentDom
		 * @returns {PreactElement}
		 */
		function insert(parentVNode, oldDom, parentDom) {
			// Note: VNodes in nested suspended trees may be missing _children.

			if (typeof parentVNode.type == 'function') {
				let children = parentVNode._children;
				for (let i = 0; children && i < children.length; i++) {
					if (children[i]) {
						// If we enter this code path on sCU bailout, where we copy
						// oldVNode._children to newVNode._children, we need to update the old
						// children's _parent pointer to point to the newVNode (parentVNode
						// here).
						children[i]._parent = parentVNode;
						oldDom = insert(children[i], oldDom, parentDom);
					}
				}

				return oldDom;
			} else if (parentVNode._dom != oldDom) {
				if (oldDom && parentVNode.type && !parentDom.contains(oldDom)) {
					oldDom = getDomSibling(parentVNode);
				}
				parentDom.insertBefore(parentVNode._dom, oldDom || null);
				oldDom = parentVNode._dom;
			}

			do {
				oldDom = oldDom && oldDom.nextSibling;
			} while (oldDom != null && oldDom.nodeType == 8);

			return oldDom;
		}

		/**
		 * Flatten and loop through the children of a virtual node
		 * @param {ComponentChildren} children The unflattened children of a virtual
		 * node
		 * @returns {VNode[]}
		 */
		export function toChildArray(children, out) {
			out = out || [];
			if (children == null || typeof children == 'boolean') {
			} else if (isArray(children)) {
				children.some(child => {
					toChildArray(child, out);
				});
			} else {
				out.push(children);
			}
			return out;
		}

		/**
		 * @param {VNode} childVNode
		 * @param {VNode[]} oldChildren
		 * @param {number} skewedIndex
		 * @param {number} remainingOldChildren
		 * @returns {number}
		 */
		function findMatchingIndex(
			childVNode,
			oldChildren,
			skewedIndex,
			remainingOldChildren
		) {
			const key = childVNode.key;
			const type = childVNode.type;
			let oldVNode = oldChildren[skewedIndex];

			// We only need to perform a search if there are more children
			// (remainingOldChildren) to search. However, if the oldVNode we just looked
			// at skewedIndex was not already used in this diff, then there must be at
			// least 1 other (so greater than 1) remainingOldChildren to attempt to match
			// against. So the following condition checks that ensuring
			// remainingOldChildren > 1 if the oldVNode is not already used/matched. Else
			// if the oldVNode was null or matched, then there could needs to be at least
			// 1 (aka `remainingOldChildren > 0`) children to find and compare against.
			//
			// If there is an unkeyed functional VNode, that isn't a built-in like our Fragment,
			// we should not search as we risk re-using state of an unrelated VNode. (reverted for now)
			let shouldSearch =
				// (typeof type != 'function' || type === Fragment || key) &&
				remainingOldChildren >
				(oldVNode != null && (oldVNode._flags & MATCHED) == 0 ? 1 : 0);

			if (
				oldVNode === null ||
				(oldVNode &&
					key == oldVNode.key &&
					type === oldVNode.type &&
					(oldVNode._flags & MATCHED) == 0)
			) {
				return skewedIndex;
			} else if (shouldSearch) {
				let x = skewedIndex - 1;
				let y = skewedIndex + 1;
				while (x >= 0 || y < oldChildren.length) {
					if (x >= 0) {
						oldVNode = oldChildren[x];
						if (
							oldVNode &&
							(oldVNode._flags & MATCHED) == 0 &&
							key == oldVNode.key &&
							type === oldVNode.type
						) {
							return x;
						}
						x--;
					}

					if (y < oldChildren.length) {
						oldVNode = oldChildren[y];
						if (
							oldVNode &&
							(oldVNode._flags & MATCHED) == 0 &&
							key == oldVNode.key &&
							type === oldVNode.type
						) {
							return y;
						}
						y++;
					}
				}
			}

			return -1;
		}				

/** hooks ***************************************************************** hooks/index.js *****/

		import { options as _options } from 'preact';

		/** @type {number} */
		let currentIndex;

		/** @type {import('./internal').Component} */
		let currentComponent;

		/** @type {import('./internal').Component} */
		let previousComponent;

		/** @type {number} */
		let currentHook = 0;

		/** @type {Array<import('./internal').Component>} */
		let afterPaintEffects = [];

		// Cast to use internal Options type
		const options = /** @type {import('./internal').Options} */ (_options);

		let oldBeforeDiff = options._diff;
		let oldBeforeRender = options._render;
		let oldAfterDiff = options.diffed;
		let oldCommit = options._commit;
		let oldBeforeUnmount = options.unmount;
		let oldRoot = options._root;

		const RAF_TIMEOUT = 100;
		let prevRaf;

		/** @type {(vnode: import('./internal').VNode) => void} */
		options._diff = vnode => {
			currentComponent = null;
			if (oldBeforeDiff) oldBeforeDiff(vnode);
		};

		options._root = (vnode, parentDom) => {
			if (vnode && parentDom._children && parentDom._children._mask) {
				vnode._mask = parentDom._children._mask;
			}

			if (oldRoot) oldRoot(vnode, parentDom);
		};

		/** @type {(vnode: import('./internal').VNode) => void} */
		options._render = vnode => {
			if (oldBeforeRender) oldBeforeRender(vnode);

			currentComponent = vnode._component;
			currentIndex = 0;

			const hooks = currentComponent.__hooks;
			if (hooks) {
				if (previousComponent === currentComponent) {
					hooks._pendingEffects = [];
					currentComponent._renderCallbacks = [];
					hooks._list.forEach(hookItem => {
						if (hookItem._nextValue) {
							hookItem._value = hookItem._nextValue;
						}
						hookItem._pendingArgs = hookItem._nextValue = undefined;
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

		/** @type {(vnode: import('./internal').VNode) => void} */
		options.diffed = vnode => {
			if (oldAfterDiff) oldAfterDiff(vnode);

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

		// TODO: Improve typing of commitQueue parameter
		/** @type {(vnode: import('./internal').VNode, commitQueue: any) => void} */
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

			if (oldCommit) oldCommit(vnode, commitQueue);
		};

		/** @type {(vnode: import('./internal').VNode) => void} */
		options.unmount = vnode => {
			if (oldBeforeUnmount) oldBeforeUnmount(vnode);

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

		/**
		 * Get a hook's state from the currentComponent
		 * @param {number} index The index of the hook to get
		 * @param {number} type The index of the hook to get
		 * @returns {any}
		 */
		function getHookState(index, type) {
			if (options._hook) {
				options._hook(currentComponent, index, currentHook || type);
			}
			currentHook = 0;

			// Largely inspired by:
			// * https://github.com/michael-klein/funcy.js/blob/f6be73468e6ec46b0ff5aa3cc4c9baf72a29025a/src/hooks/core_hooks.mjs
			// * https://github.com/michael-klein/funcy.js/blob/650beaa58c43c33a74820a3c98b3c7079cf2e333/src/renderer.mjs
			// Other implementations to look at:
			// * https://codesandbox.io/s/mnox05qp8
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

		/**
		 * @template {unknown} S
		 * @param {import('./index').Dispatch<import('./index').StateUpdater<S>>} [initialState]
		 * @returns {[S, (state: S) => void]}
		 */
		export function useState(initialState) {
			currentHook = 1;
			return useReducer(invokeOrReturn, initialState);
		}

		/**
		 * @template {unknown} S
		 * @template {unknown} A
		 * @param {import('./index').Reducer<S, A>} reducer
		 * @param {import('./index').Dispatch<import('./index').StateUpdater<S>>} initialState
		 * @param {(initialState: any) => void} [init]
		 * @returns {[ S, (state: S) => void ]}
		 */
		export function useReducer(reducer, initialState, init) {
			/** @type {import('./internal').ReducerHookState} */
			const hookState = getHookState(currentIndex++, 2);
			hookState._reducer = reducer;
			if (!hookState._component) {
				hookState._value = [
					!init ? invokeOrReturn(undefined, initialState) : init(initialState),

					action => {
						const currentValue = hookState._nextValue
							? hookState._nextValue[0]
							: hookState._value[0];
						const nextValue = hookState._reducer(currentValue, action);

						if (currentValue !== nextValue) {
							hookState._nextValue = [nextValue, hookState._value[1]];
							hookState._component.setState({});
						}
					}
				];

				hookState._component = currentComponent;

				if (!currentComponent._hasScuFromHooks) {
					currentComponent._hasScuFromHooks = true;
					let prevScu = currentComponent.shouldComponentUpdate;
					const prevCWU = currentComponent.componentWillUpdate;

					// If we're dealing with a forced update `shouldComponentUpdate` will
					// not be called. But we use that to update the hook values, so we
					// need to call it.
					currentComponent.componentWillUpdate = function (p, s, c) {
						if (this._force) {
							let tmp = prevScu;
							// Clear to avoid other sCU hooks from being called
							prevScu = undefined;
							updateHookState(p, s, c);
							prevScu = tmp;
						}

						if (prevCWU) prevCWU.call(this, p, s, c);
					};

					// This SCU has the purpose of bailing out after repeated updates
					// to stateful hooks.
					// we store the next value in _nextValue[0] and keep doing that for all
					// state setters, if we have next states and
					// all next states within a component end up being equal to their original state
					// we are safe to bail out for this specific component.
					/**
					 *
					 * @type {import('./internal').Component["shouldComponentUpdate"]}
					 */
					// @ts-ignore - We don't use TS to downtranspile
					// eslint-disable-next-line no-inner-declarations
					function updateHookState(p, s, c) {
						if (!hookState._component.__hooks) return true;

						/** @type {(x: import('./internal').HookState) => x is import('./internal').ReducerHookState} */
						const isStateHook = x => !!x._component;
						const stateHooks =
							hookState._component.__hooks._list.filter(isStateHook);

						const allHooksEmpty = stateHooks.every(x => !x._nextValue);
						// When we have no updated hooks in the component we invoke the previous SCU or
						// traverse the VDOM tree further.
						if (allHooksEmpty) {
							return prevScu ? prevScu.call(this, p, s, c) : true;
						}

						// We check whether we have components with a nextValue set that
						// have values that aren't equal to one another this pushes
						// us to update further down the tree
						let shouldUpdate = hookState._component.props !== p;
						stateHooks.forEach(hookItem => {
							if (hookItem._nextValue) {
								const currentValue = hookItem._value[0];
								hookItem._value = hookItem._nextValue;
								hookItem._nextValue = undefined;
								if (currentValue !== hookItem._value[0]) shouldUpdate = true;
							}
						});

						return prevScu
							? prevScu.call(this, p, s, c) || shouldUpdate
							: shouldUpdate;
					}

					currentComponent.shouldComponentUpdate = updateHookState;
				}
			}

			return hookState._nextValue || hookState._value;
		}

		/**
		 * @param {import('./internal').Effect} callback
		 * @param {unknown[]} args
		 * @returns {void}
		 */
		export function useEffect(callback, args) {
			/** @type {import('./internal').EffectHookState} */
			const state = getHookState(currentIndex++, 3);
			if (!options._skipEffects && argsChanged(state._args, args)) {
				state._value = callback;
				state._pendingArgs = args;

				currentComponent.__hooks._pendingEffects.push(state);
			}
		}

		/**
		 * @param {import('./internal').Effect} callback
		 * @param {unknown[]} args
		 * @returns {void}
		 */
		export function useLayoutEffect(callback, args) {
			/** @type {import('./internal').EffectHookState} */
			const state = getHookState(currentIndex++, 4);
			if (!options._skipEffects && argsChanged(state._args, args)) {
				state._value = callback;
				state._pendingArgs = args;

				currentComponent._renderCallbacks.push(state);
			}
		}

		/** @type {(initialValue: unknown) => unknown} */
		export function useRef(initialValue) {
			currentHook = 5;
			return useMemo(() => ({ current: initialValue }), []);
		}

		/**
		 * @param {object} ref
		 * @param {() => object} createHandle
		 * @param {unknown[]} args
		 * @returns {void}
		 */
		export function useImperativeHandle(ref, createHandle, args) {
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

		/**
		 * @template {unknown} T
		 * @param {() => T} factory
		 * @param {unknown[]} args
		 * @returns {T}
		 */
		export function useMemo(factory, args) {
			/** @type {import('./internal').MemoHookState<T>} */
			const state = getHookState(currentIndex++, 7);
			if (argsChanged(state._args, args)) {
				state._value = factory();
				state._args = args;
				state._factory = factory;
			}

			return state._value;
		}

		/**
		 * @param {() => void} callback
		 * @param {unknown[]} args
		 * @returns {() => void}
		 */
		export function useCallback(callback, args) {
			currentHook = 8;
			return useMemo(() => callback, args);
		}

		/**
		 * @param {import('./internal').PreactContext} context
		 */
		export function useContext(context) {
			const provider = currentComponent.context[context._id];
			// We could skip this call here, but than we'd not call
			// `options._hook`. We need to do that in order to make
			// the devtools aware of this hook.
			/** @type {import('./internal').ContextHookState} */
			const state = getHookState(currentIndex++, 9);
			// The devtools needs access to the context object to
			// be able to pull of the default value when no provider
			// is present in the tree.
			state._context = context;
			if (!provider) return context._defaultValue;
			// This is probably not safe to convert to "!"
			if (state._value == null) {
				state._value = true;
				provider.sub(currentComponent);
			}
			return provider.props.value;
		}

		/**
		 * Display a custom label for a custom hook for the devtools panel
		 * @type {<T>(value: T, cb?: (value: T) => string | number) => void}
		 */
		export function useDebugValue(value, formatter) {
			if (options.useDebugValue) {
				options.useDebugValue(
					formatter ? formatter(value) : /** @type {any}*/ (value)
				);
			}
		}

		/**
		 * @param {(error: unknown, errorInfo: import('preact').ErrorInfo) => void} cb
		 * @returns {[unknown, () => void]}
		 */
		export function useErrorBoundary(cb) {
			/** @type {import('./internal').ErrorBoundaryHookState} */
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

		/** @type {() => string} */
		export function useId() {
			/** @type {import('./internal').IdHookState} */
			const state = getHookState(currentIndex++, 11);
			if (!state._value) {
				// Grab either the root node or the nearest async boundary node.
				/** @type {import('./internal').VNode} */
				let root = currentComponent._vnode;
				while (root !== null && !root._mask && root._parent !== null) {
					root = root._parent;
				}

				let mask = root._mask || (root._mask = [0, 0]);
				state._value = 'P' + mask[0] + '-' + mask[1]++;
			}

			return state._value;
		}

		/**
		 * After paint effects consumer.
		 */
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

		/**
		 * Schedule a callback to be invoked after the browser has a chance to paint a new frame.
		 * Do this by combining requestAnimationFrame (rAF) + setTimeout to invoke a callback after
		 * the next browser frame.
		 *
		 * Also, schedule a timeout in parallel to the the rAF to ensure the callback is invoked
		 * even if RAF doesn't fire (for example if the browser tab is not visible)
		 *
		 * @param {() => void} callback
		 */
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

		// Note: if someone used options.debounceRendering = requestAnimationFrame,
		// then effects will ALWAYS run on the NEXT frame instead of the current one, incurring a ~16ms delay.
		// Perhaps this is not such a big deal.
		/**
		 * Schedule afterPaintEffects flush after the browser paints
		 * @param {number} newQueueLength
		 * @returns {void}
		 */
		function afterPaint(newQueueLength) {
			if (newQueueLength === 1 || prevRaf !== options.requestAnimationFrame) {
				prevRaf = options.requestAnimationFrame;
				(prevRaf || afterNextFrame)(flushAfterPaintEffects);
			}
		}

		/**
		 * @param {import('./internal').HookState} hook
		 * @returns {void}
		 */
		function invokeCleanup(hook) {
			// A hook cleanup can introduce a call to render which creates a new root, this will call options.vnode
			// and move the currentComponent away.
			const comp = currentComponent;
			let cleanup = hook._cleanup;
			if (typeof cleanup == 'function') {
				hook._cleanup = undefined;
				cleanup();
			}

			currentComponent = comp;
		}

		/**
		 * Invoke a Hook's effect
		 * @param {import('./internal').EffectHookState} hook
		 * @returns {void}
		 */
		function invokeEffect(hook) {
			// A hook call can introduce a call to render which creates a new root, this will call options.vnode
			// and move the currentComponent away.
			const comp = currentComponent;
			hook._cleanup = hook._value();
			currentComponent = comp;
		}

		/**
		 * @param {unknown[]} oldArgs
		 * @param {unknown[]} newArgs
		 * @returns {boolean}
		 */
		function argsChanged(oldArgs, newArgs) {
			return (
				!oldArgs ||
				oldArgs.length !== newArgs.length ||
				newArgs.some((arg, index) => arg !== oldArgs[index])
			);
		}

		/**
		 * @template Arg
		 * @param {Arg} arg
		 * @param {(arg: Arg) => any} f
		 * @returns {any}
		 */
		function invokeOrReturn(arg, f) {
			return typeof f == 'function' ? f(arg) : f;
		}				
				
/** index.js **/
		
		export { render, hydrate } from './render';
		export {
			createElement,
			createElement as h,
			Fragment,
			createRef,
			isValidElement
		} from './create-element';
		export { BaseComponent as Component } from './component';
		export { cloneElement } from './clone-element';
		export { createContext } from './create-context';
		export { toChildArray } from './diff/children';
		export { default as options } from './options';