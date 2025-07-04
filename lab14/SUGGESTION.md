# Suggestion for `cleanroom.js`

The "class constructors must be invoked with 'new'" error, despite `esbuild` targeting `es2020`, suggests an issue with how class components are identified within the `renderToDom` function, particularly when bundled. The `instanceof BaseComponent` check can be fragile in certain bundling scenarios or when module interop is involved.

To make the class component detection more robust, I suggest modifying the `renderToDom` function in `/Users/mvm/Desktop/cleanroom/lib/cleanroom.js` to check for the presence of a `render` method on the component's prototype. This is a more direct and reliable way to identify a class component in your framework.

**Proposed Change:**

In `lib/cleanroom.js`, locate the `renderToDom` function.

**Old code:**
```javascript
      // Class component
      if (vnode.type.prototype instanceof BaseComponent) {
        const component = new vnode.type(props);
        components.set(component, { vnode, dom: null, component });
        return renderComponent(component);
      }
```

**New code:**
```javascript
      // Class component
      // A more robust check for class components by looking for a render method on the prototype.
      if (vnode.type.prototype && typeof vnode.type.prototype.render === 'function') {
        const component = new vnode.type(props);
        components.set(component, { vnode, dom: null, component });
        return renderComponent(component);
      }
```
