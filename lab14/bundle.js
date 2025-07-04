(() => {
  // ../lib/standalone.js
  var t;
  var n;
  var e;
  var _;
  var i;
  var r;
  var o;
  var u;
  var f;
  var s = {};
  var l = [];
  var c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var a = Array.isArray;
  function h(t2, n2) {
    for (var e2 in n2) t2[e2] = n2[e2];
    return t2;
  }
  function p(t2) {
    var n2 = t2.parentNode;
    n2 && n2.removeChild(t2);
  }
  function v(n2, e2, _2) {
    var i2, r2, o2, u2 = {};
    for (o2 in e2) "key" == o2 ? i2 = e2[o2] : "ref" == o2 ? r2 = e2[o2] : u2[o2] = e2[o2];
    if (arguments.length > 2 && (u2.children = arguments.length > 3 ? t.call(arguments, 2) : _2), "function" == typeof n2 && null != n2.defaultProps) for (o2 in n2.defaultProps) void 0 === u2[o2] && (u2[o2] = n2.defaultProps[o2]);
    return d(n2, u2, i2, r2, null);
  }
  function d(t2, _2, i2, r2, o2) {
    var u2 = { type: t2, props: _2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == o2 ? ++e : o2, __i: -1, __u: 0 };
    return null == o2 && null != n.vnode && n.vnode(u2), u2;
  }
  function m(t2) {
    return t2.children;
  }
  function g(t2, n2) {
    this.props = t2, this.context = n2;
  }
  function b(t2, n2) {
    if (null == n2) return t2.__ ? b(t2.__, t2.__i + 1) : null;
    for (var e2; n2 < t2.__k.length; n2++) if (null != (e2 = t2.__k[n2]) && null != e2.__e) return e2.__e;
    return "function" == typeof t2.type ? b(t2) : null;
  }
  function k(t2) {
    var n2, e2;
    if (null != (t2 = t2.__) && null != t2.__c) {
      for (t2.__e = t2.__c.base = null, n2 = 0; n2 < t2.__k.length; n2++) if (null != (e2 = t2.__k[n2]) && null != e2.__e) {
        t2.__e = t2.__c.base = e2.__e;
        break;
      }
      return k(t2);
    }
  }
  function S(t2) {
    (!t2.__d && (t2.__d = true) && i.push(t2) && !x.__r++ || r !== n.debounceRendering) && ((r = n.debounceRendering) || o)(x);
  }
  function x() {
    var t2, e2, _2, r2, o2, f2, s2, l2, c2;
    for (i.sort(u); t2 = i.shift(); ) t2.__d && (e2 = i.length, r2 = void 0, f2 = (o2 = (_2 = t2).__v).__e, l2 = [], c2 = [], (s2 = _2.__P) && ((r2 = h({}, o2)).__v = o2.__v + 1, n.vnode && n.vnode(r2), D(s2, r2, o2, _2.__n, void 0 !== s2.ownerSVGElement, 32 & o2.__u ? [f2] : null, l2, null == f2 ? b(o2) : f2, !!(32 & o2.__u), c2), r2.__.__k[r2.__i] = r2, T(l2, r2, c2), r2.__e != f2 && k(r2)), i.length > e2 && i.sort(u));
    x.__r = 0;
  }
  function w(t2, n2, e2, _2, i2, r2, o2, u2, f2, c2, h2) {
    var p2, v2, y, g2, k2, S2 = _2 && _2.__k || l, x2 = n2.length;
    for (e2.__d = f2, function(t3, n3, e3) {
      var _3, i3, r3, o3, u3, f3 = n3.length, s2 = e3.length, l2 = s2, c3 = 0;
      for (t3.__k = [], _3 = 0; _3 < f3; _3++) null != (i3 = t3.__k[_3] = null == (i3 = n3[_3]) || "boolean" == typeof i3 || "function" == typeof i3 ? null : "string" == typeof i3 || "number" == typeof i3 || "bigint" == typeof i3 || i3.constructor == String ? d(null, i3, null, null, i3) : a(i3) ? d(m, { children: i3 }, null, null, null) : void 0 === i3.constructor && i3.__b > 0 ? d(i3.type, i3.props, i3.key, i3.ref ? i3.ref : null, i3.__v) : i3) ? (i3.__ = t3, i3.__b = t3.__b + 1, u3 = U(i3, e3, o3 = _3 + c3, l2), i3.__i = u3, r3 = null, -1 !== u3 && (l2--, (r3 = e3[u3]) && (r3.__u |= 131072)), null == r3 || null === r3.__v ? (-1 == u3 && c3--, "function" != typeof i3.type && (i3.__u |= 65536)) : u3 !== o3 && (u3 === o3 + 1 ? c3++ : u3 > o3 ? l2 > f3 - o3 ? c3 += u3 - o3 : c3-- : c3 = u3 < o3 && u3 == o3 - 1 ? u3 - o3 : 0, u3 !== _3 + c3 && (i3.__u |= 65536))) : (r3 = e3[_3]) && null == r3.key && r3.__e && (r3.__e == t3.__d && (t3.__d = b(r3)), V(r3, r3, false), e3[_3] = null, l2--);
      if (l2) for (_3 = 0; _3 < s2; _3++) null != (r3 = e3[_3]) && 0 == (131072 & r3.__u) && (r3.__e == t3.__d && (t3.__d = b(r3)), V(r3, r3));
    }(e2, n2, S2), f2 = e2.__d, p2 = 0; p2 < x2; p2++) null != (y = e2.__k[p2]) && "boolean" != typeof y && "function" != typeof y && (v2 = -1 === y.__i ? s : S2[y.__i] || s, y.__i = p2, D(t2, y, v2, i2, r2, o2, u2, f2, c2, h2), g2 = y.__e, y.ref && v2.ref != y.ref && (v2.ref && A(v2.ref, null, y), h2.push(y.ref, y.__c || g2, y)), null == k2 && null != g2 && (k2 = g2), 65536 & y.__u || v2.__k === y.__k ? f2 = C(y, f2, t2) : "function" == typeof y.type && void 0 !== y.__d ? f2 = y.__d : g2 && (f2 = g2.nextSibling), y.__d = void 0, y.__u &= -196609);
    e2.__d = f2, e2.__e = k2;
  }
  function C(t2, n2, e2) {
    var _2, i2;
    if ("function" == typeof t2.type) {
      for (_2 = t2.__k, i2 = 0; _2 && i2 < _2.length; i2++) _2[i2] && (_2[i2].__ = t2, n2 = C(_2[i2], n2, e2));
      return n2;
    }
    return t2.__e != n2 && (e2.insertBefore(t2.__e, n2 || null), n2 = t2.__e), n2 && n2.nextSibling;
  }
  function U(t2, n2, e2, _2) {
    var i2 = t2.key, r2 = t2.type, o2 = e2 - 1, u2 = e2 + 1, f2 = n2[e2];
    if (null === f2 || f2 && i2 == f2.key && r2 === f2.type) return e2;
    if (_2 > (null != f2 && 0 == (131072 & f2.__u) ? 1 : 0)) for (; o2 >= 0 || u2 < n2.length; ) {
      if (o2 >= 0) {
        if ((f2 = n2[o2]) && 0 == (131072 & f2.__u) && i2 == f2.key && r2 === f2.type) return o2;
        o2--;
      }
      if (u2 < n2.length) {
        if ((f2 = n2[u2]) && 0 == (131072 & f2.__u) && i2 == f2.key && r2 === f2.type) return u2;
        u2++;
      }
    }
    return -1;
  }
  function H(t2, n2, e2) {
    "-" === n2[0] ? t2.setProperty(n2, null == e2 ? "" : e2) : t2[n2] = null == e2 ? "" : "number" != typeof e2 || c.test(n2) ? e2 : e2 + "px";
  }
  function P(t2, n2, e2, _2, i2) {
    var r2;
    t: if ("style" === n2) if ("string" == typeof e2) t2.style.cssText = e2;
    else {
      if ("string" == typeof _2 && (t2.style.cssText = _2 = ""), _2) for (n2 in _2) e2 && n2 in e2 || H(t2.style, n2, "");
      if (e2) for (n2 in e2) _2 && e2[n2] === _2[n2] || H(t2.style, n2, e2[n2]);
    }
    else if ("o" === n2[0] && "n" === n2[1]) r2 = n2 !== (n2 = n2.replace(/(PointerCapture)$|Capture$/, "$1")), n2 = n2.toLowerCase() in t2 ? n2.toLowerCase().slice(2) : n2.slice(2), t2.l || (t2.l = {}), t2.l[n2 + r2] = e2, e2 ? _2 ? e2.u = _2.u : (e2.u = Date.now(), t2.addEventListener(n2, r2 ? $ : N, r2)) : t2.removeEventListener(n2, r2 ? $ : N, r2);
    else {
      if (i2) n2 = n2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" !== n2 && "height" !== n2 && "href" !== n2 && "list" !== n2 && "form" !== n2 && "tabIndex" !== n2 && "download" !== n2 && "rowSpan" !== n2 && "colSpan" !== n2 && "role" !== n2 && n2 in t2) try {
        t2[n2] = null == e2 ? "" : e2;
        break t;
      } catch (t3) {
      }
      "function" == typeof e2 || (null == e2 || false === e2 && "-" !== n2[4] ? t2.removeAttribute(n2) : t2.setAttribute(n2, e2));
    }
  }
  function N(t2) {
    var e2 = this.l[t2.type + false];
    if (t2.t) {
      if (t2.t <= e2.u) return;
    } else t2.t = Date.now();
    return e2(n.event ? n.event(t2) : t2);
  }
  function $(t2) {
    return this.l[t2.type + true](n.event ? n.event(t2) : t2);
  }
  function D(e2, _2, i2, r2, o2, u2, f2, l2, c2, v2) {
    var d2, y, k2, S2, x2, C2, E, U2, H2, N2, $2, D2, T2, A2, V2, W2 = _2.type;
    if (void 0 !== _2.constructor) return null;
    128 & i2.__u && (c2 = !!(32 & i2.__u), u2 = [l2 = _2.__e = i2.__e]), (d2 = n.__b) && d2(_2);
    t: if ("function" == typeof W2) try {
      if (U2 = _2.props, H2 = (d2 = W2.contextType) && r2[d2.__c], N2 = d2 ? H2 ? H2.props.value : d2.__ : r2, i2.__c ? E = (y = _2.__c = i2.__c).__ = y.__E : ("prototype" in W2 && W2.prototype.render ? _2.__c = y = new W2(U2, N2) : (_2.__c = y = new g(U2, N2), y.constructor = W2, y.render = M), H2 && H2.sub(y), y.props = U2, y.state || (y.state = {}), y.context = N2, y.__n = r2, k2 = y.__d = true, y.__h = [], y._sb = []), null == y.__s && (y.__s = y.state), null != W2.getDerivedStateFromProps && (y.__s == y.state && (y.__s = h({}, y.__s)), h(y.__s, W2.getDerivedStateFromProps(U2, y.__s))), S2 = y.props, x2 = y.state, y.__v = _2, k2) null == W2.getDerivedStateFromProps && null != y.componentWillMount && y.componentWillMount(), null != y.componentDidMount && y.__h.push(y.componentDidMount);
      else {
        if (null == W2.getDerivedStateFromProps && U2 !== S2 && null != y.componentWillReceiveProps && y.componentWillReceiveProps(U2, N2), !y.__e && (null != y.shouldComponentUpdate && false === y.shouldComponentUpdate(U2, y.__s, N2) || _2.__v === i2.__v)) {
          for (_2.__v !== i2.__v && (y.props = U2, y.state = y.__s, y.__d = false), _2.__e = i2.__e, _2.__k = i2.__k, _2.__k.forEach(function(t2) {
            t2 && (t2.__ = _2);
          }), $2 = 0; $2 < y._sb.length; $2++) y.__h.push(y._sb[$2]);
          y._sb = [], y.__h.length && f2.push(y);
          break t;
        }
        null != y.componentWillUpdate && y.componentWillUpdate(U2, y.__s, N2), null != y.componentDidUpdate && y.__h.push(function() {
          y.componentDidUpdate(S2, x2, C2);
        });
      }
      if (y.context = N2, y.props = U2, y.__P = e2, y.__e = false, D2 = n.__r, T2 = 0, "prototype" in W2 && W2.prototype.render) {
        for (y.state = y.__s, y.__d = false, D2 && D2(_2), d2 = y.render(y.props, y.state, y.context), A2 = 0; A2 < y._sb.length; A2++) y.__h.push(y._sb[A2]);
        y._sb = [];
      } else do {
        y.__d = false, D2 && D2(_2), d2 = y.render(y.props, y.state, y.context), y.state = y.__s;
      } while (y.__d && ++T2 < 25);
      y.state = y.__s, null != y.getChildContext && (r2 = h(h({}, r2), y.getChildContext())), k2 || null == y.getSnapshotBeforeUpdate || (C2 = y.getSnapshotBeforeUpdate(S2, x2)), w(e2, a(V2 = null != d2 && d2.type === m && null == d2.key ? d2.props.children : d2) ? V2 : [V2], _2, i2, r2, o2, u2, f2, l2, c2, v2), y.base = _2.__e, _2.__u &= -161, y.__h.length && f2.push(y), E && (y.__E = y.__ = null);
    } catch (e3) {
      _2.__v = null, c2 || null != u2 ? (_2.__e = l2, _2.__u |= c2 ? 160 : 32, u2[u2.indexOf(l2)] = null) : (_2.__e = i2.__e, _2.__k = i2.__k), n.__e(e3, _2, i2);
    }
    else null == u2 && _2.__v === i2.__v ? (_2.__k = i2.__k, _2.__e = i2.__e) : _2.__e = function(n2, e3, _3, i3, r3, o3, u3, f3, l3) {
      var c3, h2, v3, d3, y2, m2, g2, k3 = _3.props, S3 = e3.props, x3 = e3.type;
      if ("svg" === x3 && (r3 = true), null != o3) {
        for (c3 = 0; c3 < o3.length; c3++) if ((y2 = o3[c3]) && "setAttribute" in y2 == !!x3 && (x3 ? y2.localName === x3 : 3 === y2.nodeType)) {
          n2 = y2, o3[c3] = null;
          break;
        }
      }
      if (null == n2) {
        if (null === x3) return document.createTextNode(S3);
        n2 = r3 ? document.createElementNS("http://www.w3.org/2000/svg", x3) : document.createElement(x3, S3.is && S3), o3 = null, f3 = false;
      }
      if (null === x3) k3 === S3 || f3 && n2.data === S3 || (n2.data = S3);
      else {
        if (o3 = o3 && t.call(n2.childNodes), k3 = _3.props || s, !f3 && null != o3) for (k3 = {}, c3 = 0; c3 < n2.attributes.length; c3++) k3[(y2 = n2.attributes[c3]).name] = y2.value;
        for (c3 in k3) y2 = k3[c3], "children" == c3 || ("dangerouslySetInnerHTML" == c3 ? v3 = y2 : "key" === c3 || c3 in S3 || P(n2, c3, null, y2, r3));
        for (c3 in S3) y2 = S3[c3], "children" == c3 ? d3 = y2 : "dangerouslySetInnerHTML" == c3 ? h2 = y2 : "value" == c3 ? m2 = y2 : "checked" == c3 ? g2 = y2 : "key" === c3 || f3 && "function" != typeof y2 || k3[c3] === y2 || P(n2, c3, y2, k3[c3], r3);
        if (h2) f3 || v3 && (h2.__html === v3.__html || h2.__html === n2.innerHTML) || (n2.innerHTML = h2.__html), e3.__k = [];
        else if (v3 && (n2.innerHTML = ""), w(n2, a(d3) ? d3 : [d3], e3, _3, i3, r3 && "foreignObject" !== x3, o3, u3, o3 ? o3[0] : _3.__k && b(_3, 0), f3, l3), null != o3) for (c3 = o3.length; c3--; ) null != o3[c3] && p(o3[c3]);
        f3 || (c3 = "value", void 0 !== m2 && (m2 !== n2[c3] || "progress" === x3 && !m2 || "option" === x3 && m2 !== k3[c3]) && P(n2, c3, m2, k3[c3], false), c3 = "checked", void 0 !== g2 && g2 !== n2[c3] && P(n2, c3, g2, k3[c3], false));
      }
      return n2;
    }(i2.__e, _2, i2, r2, o2, u2, f2, c2, v2);
    (d2 = n.diffed) && d2(_2);
  }
  function T(t2, e2, _2) {
    e2.__d = void 0;
    for (var i2 = 0; i2 < _2.length; i2++) A(_2[i2], _2[++i2], _2[++i2]);
    n.__c && n.__c(e2, t2), t2.some(function(e3) {
      try {
        t2 = e3.__h, e3.__h = [], t2.some(function(t3) {
          t3.call(e3);
        });
      } catch (t3) {
        n.__e(t3, e3.__v);
      }
    });
  }
  function A(t2, e2, _2) {
    try {
      "function" == typeof t2 ? t2(e2) : t2.current = e2;
    } catch (t3) {
      n.__e(t3, _2);
    }
  }
  function V(t2, e2, _2) {
    var i2, r2;
    if (n.unmount && n.unmount(t2), (i2 = t2.ref) && (i2.current && i2.current !== t2.__e || A(i2, null, e2)), null != (i2 = t2.__c)) {
      if (i2.componentWillUnmount) try {
        i2.componentWillUnmount();
      } catch (t3) {
        n.__e(t3, e2);
      }
      i2.base = i2.__P = null, t2.__c = void 0;
    }
    if (i2 = t2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && V(i2[r2], e2, _2 || "function" != typeof t2.type);
    _2 || null == t2.__e || p(t2.__e), t2.__ = t2.__e = t2.__d = void 0;
  }
  function M(t2, n2, e2) {
    return this.constructor(t2, e2);
  }
  function W(e2, _2, i2) {
    var r2, o2, u2, f2;
    n.__ && n.__(e2, _2), o2 = (r2 = "function" == typeof i2) ? null : i2 && i2.__k || _2.__k, u2 = [], f2 = [], D(_2, e2 = (!r2 && i2 || _2).__k = v(m, null, [e2]), o2 || s, s, void 0 !== _2.ownerSVGElement, !r2 && i2 ? [i2] : o2 ? null : _2.firstChild ? t.call(_2.childNodes) : null, u2, !r2 && i2 ? i2 : o2 ? o2.__e : _2.firstChild, r2, f2), T(u2, e2, f2);
  }
  t = l.slice, n = { __e: function(t2, n2, e2, _2) {
    for (var i2, r2, o2; n2 = n2.__; ) if ((i2 = n2.__c) && !i2.__) try {
      if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(t2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(t2, _2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
    } catch (n3) {
      t2 = n3;
    }
    throw t2;
  } }, e = 0, _ = function(t2) {
    return null != t2 && null == t2.constructor;
  }, g.prototype.setState = function(t2, n2) {
    var e2;
    e2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h({}, this.state), "function" == typeof t2 && (t2 = t2(h({}, e2), this.props)), t2 && h(e2, t2), null != t2 && this.__v && (n2 && this._sb.push(n2), S(this));
  }, g.prototype.forceUpdate = function(t2) {
    this.__v && (this.__e = true, t2 && this.__h.push(t2), S(this));
  }, g.prototype.render = m, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, u = function(t2, n2) {
    return t2.__v.__b - n2.__v.__b;
  }, x.__r = 0, f = 0;
  var O;
  var R;
  var j;
  var q;
  var B = 0;
  var I = [];
  var G = [];
  var z = n.__b;
  var J = n.__r;
  var K = n.diffed;
  var Q = n.__c;
  var X = n.unmount;
  function Y(t2, e2) {
    n.__h && n.__h(R, t2, B || e2), B = 0;
    var _2 = R.__H || (R.__H = { __: [], __h: [] });
    return t2 >= _2.__.length && _2.__.push({ __V: G }), _2.__[t2];
  }
  function tt(t2, n2, e2) {
    var _2 = Y(O++, 2);
    if (_2.t = t2, !_2.__c && (_2.__ = [e2 ? e2(n2) : dt(void 0, n2), function(t3) {
      var n3 = _2.__N ? _2.__N[0] : _2.__[0], e3 = _2.t(n3, t3);
      n3 !== e3 && (_2.__N = [e3, _2.__[1]], _2.__c.setState({}));
    }], _2.__c = R, !R.u)) {
      var i2 = function(t3, n3, e3) {
        if (!_2.__c.__H) return true;
        var i3 = _2.__c.__H.__.filter(function(t4) {
          return t4.__c;
        });
        if (i3.every(function(t4) {
          return !t4.__N;
        })) return !r2 || r2.call(this, t3, n3, e3);
        var o3 = false;
        return i3.forEach(function(t4) {
          if (t4.__N) {
            var n4 = t4.__[0];
            t4.__ = t4.__N, t4.__N = void 0, n4 !== t4.__[0] && (o3 = true);
          }
        }), !(!o3 && _2.__c.props === t3) && (!r2 || r2.call(this, t3, n3, e3));
      };
      R.u = true;
      var r2 = R.shouldComponentUpdate, o2 = R.componentWillUpdate;
      R.componentWillUpdate = function(t3, n3, e3) {
        if (this.__e) {
          var _3 = r2;
          r2 = void 0, i2(t3, n3, e3), r2 = _3;
        }
        o2 && o2.call(this, t3, n3, e3);
      }, R.shouldComponentUpdate = i2;
    }
    return _2.__N || _2.__;
  }
  function rt(t2, n2) {
    var e2 = Y(O++, 7);
    return vt(e2.__H, n2) ? (e2.__V = t2(), e2.i = n2, e2.__h = t2, e2.__V) : e2.__;
  }
  function lt() {
    for (var t2; t2 = I.shift(); ) if (t2.__P && t2.__H) try {
      t2.__H.__h.forEach(ht), t2.__H.__h.forEach(pt), t2.__H.__h = [];
    } catch (e2) {
      t2.__H.__h = [], n.__e(e2, t2.__v);
    }
  }
  n.__b = function(t2) {
    R = null, z && z(t2);
  }, n.__r = function(t2) {
    J && J(t2), O = 0;
    var n2 = (R = t2.__c).__H;
    n2 && (j === R ? (n2.__h = [], R.__h = [], n2.__.forEach(function(t3) {
      t3.__N && (t3.__ = t3.__N), t3.__V = G, t3.__N = t3.i = void 0;
    })) : (n2.__h.forEach(ht), n2.__h.forEach(pt), n2.__h = [], O = 0)), j = R;
  }, n.diffed = function(t2) {
    K && K(t2);
    var e2 = t2.__c;
    e2 && e2.__H && (e2.__H.__h.length && (1 !== I.push(e2) && q === n.requestAnimationFrame || ((q = n.requestAnimationFrame) || at)(lt)), e2.__H.__.forEach(function(t3) {
      t3.i && (t3.__H = t3.i), t3.__V !== G && (t3.__ = t3.__V), t3.i = void 0, t3.__V = G;
    })), j = R = null;
  }, n.__c = function(t2, e2) {
    e2.some(function(t3) {
      try {
        t3.__h.forEach(ht), t3.__h = t3.__h.filter(function(t4) {
          return !t4.__ || pt(t4);
        });
      } catch (_2) {
        e2.some(function(t4) {
          t4.__h && (t4.__h = []);
        }), e2 = [], n.__e(_2, t3.__v);
      }
    }), Q && Q(t2, e2);
  }, n.unmount = function(t2) {
    X && X(t2);
    var e2, _2 = t2.__c;
    _2 && _2.__H && (_2.__H.__.forEach(function(t3) {
      try {
        ht(t3);
      } catch (t4) {
        e2 = t4;
      }
    }), _2.__H = void 0, e2 && n.__e(e2, _2.__v));
  };
  var ct = "function" == typeof requestAnimationFrame;
  function at(t2) {
    var n2, e2 = function() {
      clearTimeout(_2), ct && cancelAnimationFrame(n2), setTimeout(t2);
    }, _2 = setTimeout(e2, 100);
    ct && (n2 = requestAnimationFrame(e2));
  }
  function ht(t2) {
    var n2 = R, e2 = t2.__c;
    "function" == typeof e2 && (t2.__c = void 0, e2()), R = n2;
  }
  function pt(t2) {
    var n2 = R;
    t2.__c = t2.__(), R = n2;
  }
  function vt(t2, n2) {
    return !t2 || t2.length !== n2.length || n2.some(function(n3, e2) {
      return n3 !== t2[e2];
    });
  }
  function dt(t2, n2) {
    return "function" == typeof n2 ? n2(t2) : n2;
  }
  var yt = function(t2, n2, e2, _2) {
    var i2;
    n2[0] = 0;
    for (var r2 = 1; r2 < n2.length; r2++) {
      var o2 = n2[r2++], u2 = n2[r2] ? (n2[0] |= o2 ? 1 : 2, e2[n2[r2++]]) : n2[++r2];
      3 === o2 ? _2[0] = u2 : 4 === o2 ? _2[1] = Object.assign(_2[1] || {}, u2) : 5 === o2 ? (_2[1] = _2[1] || {})[n2[++r2]] = u2 : 6 === o2 ? _2[1][n2[++r2]] += u2 + "" : o2 ? (i2 = t2.apply(u2, yt(t2, u2, e2, ["", null])), _2.push(i2), u2[0] ? n2[0] |= 2 : (n2[r2 - 2] = 0, n2[r2] = i2)) : _2.push(u2);
    }
    return _2;
  };
  var mt = /* @__PURE__ */ new Map();
  function gt(t2) {
    var n2 = mt.get(this);
    return n2 || (n2 = /* @__PURE__ */ new Map(), mt.set(this, n2)), (n2 = yt(this, n2.get(t2) || (n2.set(t2, n2 = function(t3) {
      for (var n3, e2, _2 = 1, i2 = "", r2 = "", o2 = [0], u2 = function(t4) {
        1 === _2 && (t4 || (i2 = i2.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? o2.push(0, t4, i2) : 3 === _2 && (t4 || i2) ? (o2.push(3, t4, i2), _2 = 2) : 2 === _2 && "..." === i2 && t4 ? o2.push(4, t4, 0) : 2 === _2 && i2 && !t4 ? o2.push(5, 0, true, i2) : _2 >= 5 && ((i2 || !t4 && 5 === _2) && (o2.push(_2, 0, i2, e2), _2 = 6), t4 && (o2.push(_2, t4, 0, e2), _2 = 6)), i2 = "";
      }, f2 = 0; f2 < t3.length; f2++) {
        f2 && (1 === _2 && u2(), u2(f2));
        for (var s2 = 0; s2 < t3[f2].length; s2++) n3 = t3[f2][s2], 1 === _2 ? "<" === n3 ? (u2(), o2 = [o2], _2 = 3) : i2 += n3 : 4 === _2 ? "--" === i2 && ">" === n3 ? (_2 = 1, i2 = "") : i2 = n3 + i2[0] : r2 ? n3 === r2 ? r2 = "" : i2 += n3 : '"' === n3 || "'" === n3 ? r2 = n3 : ">" === n3 ? (u2(), _2 = 1) : _2 && ("=" === n3 ? (_2 = 5, e2 = i2, i2 = "") : "/" === n3 && (_2 < 5 || ">" === t3[f2][s2 + 1]) ? (u2(), 3 === _2 && (o2 = o2[0]), _2 = o2, (o2 = o2[0]).push(2, 0, _2), _2 = 0) : " " === n3 || "	" === n3 || "\n" === n3 || "\r" === n3 ? (u2(), _2 = 2) : i2 += n3), 3 === _2 && "!--" === i2 && (_2 = 4, o2 = o2[0]);
      }
      return u2(), o2;
    }(t2)), n2), arguments, [])).length > 1 ? n2 : n2[0];
  }
  function bt() {
    throw new Error("Cycle detected");
  }
  var kt = Symbol.for("preact-signals");
  function St() {
    if (Ht > 1) Ht--;
    else {
      for (var t2, n2 = false; void 0 !== Ut; ) {
        var e2 = Ut;
        for (Ut = void 0, Pt++; void 0 !== e2; ) {
          var _2 = e2.o;
          if (e2.o = void 0, e2.f &= -3, !(8 & e2.f) && At(e2)) try {
            e2.c();
          } catch (e3) {
            n2 || (t2 = e3, n2 = true);
          }
          e2 = _2;
        }
      }
      if (Pt = 0, Ht--, n2) throw t2;
    }
  }
  var wt;
  var Ct;
  var Et = void 0;
  var Ut = void 0;
  var Ht = 0;
  var Pt = 0;
  var Nt = 0;
  function $t(t2) {
    if (void 0 !== Et) {
      var n2 = t2.n;
      if (void 0 === n2 || n2.t !== Et) return n2 = { i: 0, S: t2, p: Et.s, n: void 0, t: Et, e: void 0, x: void 0, r: n2 }, void 0 !== Et.s && (Et.s.n = n2), Et.s = n2, t2.n = n2, 32 & Et.f && t2.S(n2), n2;
      if (-1 === n2.i) return n2.i = 0, void 0 !== n2.n && (n2.n.p = n2.p, void 0 !== n2.p && (n2.p.n = n2.n), n2.p = Et.s, n2.n = void 0, Et.s.n = n2, Et.s = n2), n2;
    }
  }
  function Dt(t2) {
    this.v = t2, this.i = 0, this.n = void 0, this.t = void 0;
  }
  function Tt(t2) {
    return new Dt(t2);
  }
  function At(t2) {
    for (var n2 = t2.s; void 0 !== n2; n2 = n2.n) if (n2.S.i !== n2.i || !n2.S.h() || n2.S.i !== n2.i) return true;
    return false;
  }
  function Vt(t2) {
    for (var n2 = t2.s; void 0 !== n2; n2 = n2.n) {
      var e2 = n2.S.n;
      if (void 0 !== e2 && (n2.r = e2), n2.S.n = n2, n2.i = -1, void 0 === n2.n) {
        t2.s = n2;
        break;
      }
    }
  }
  function Mt(t2) {
    for (var n2 = t2.s, e2 = void 0; void 0 !== n2; ) {
      var _2 = n2.p;
      -1 === n2.i ? (n2.S.U(n2), void 0 !== _2 && (_2.n = n2.n), void 0 !== n2.n && (n2.n.p = _2)) : e2 = n2, n2.S.n = n2.r, void 0 !== n2.r && (n2.r = void 0), n2 = _2;
    }
    t2.s = e2;
  }
  function Wt(t2) {
    Dt.call(this, void 0), this.x = t2, this.s = void 0, this.g = Nt - 1, this.f = 4;
  }
  function Ft(t2) {
    return new Wt(t2);
  }
  function Lt(t2) {
    var n2 = t2.u;
    if (t2.u = void 0, "function" == typeof n2) {
      Ht++;
      var e2 = Et;
      Et = void 0;
      try {
        n2();
      } catch (n3) {
        throw t2.f &= -2, t2.f |= 8, Ot(t2), n3;
      } finally {
        Et = e2, St();
      }
    }
  }
  function Ot(t2) {
    for (var n2 = t2.s; void 0 !== n2; n2 = n2.n) n2.S.U(n2);
    t2.x = void 0, t2.s = void 0, Lt(t2);
  }
  function Rt(t2) {
    if (Et !== this) throw new Error("Out-of-order effect");
    Mt(this), Et = t2, this.f &= -2, 8 & this.f && Ot(this), St();
  }
  function jt(t2) {
    this.x = t2, this.u = void 0, this.s = void 0, this.o = void 0, this.f = 32;
  }
  function qt(t2) {
    var n2 = new jt(t2);
    try {
      n2.c();
    } catch (t3) {
      throw n2.d(), t3;
    }
    return n2.d.bind(n2);
  }
  function Bt(t2, e2) {
    n[t2] = e2.bind(null, n[t2] || function() {
    });
  }
  function It(t2) {
    Ct && Ct(), Ct = t2 && t2.S();
  }
  function Gt(t2) {
    var n2 = this, e2 = t2.data, i2 = Jt(e2);
    i2.value = e2;
    var r2 = rt(function() {
      for (var t3 = n2.__v; t3 = t3.__; ) if (t3.__c) {
        t3.__c.__$f |= 4;
        break;
      }
      return n2.__$u.c = function() {
        var t4;
        _(r2.peek()) || 3 !== (null == (t4 = n2.base) ? void 0 : t4.nodeType) ? (n2.__$f |= 1, n2.setState({})) : n2.base.data = r2.peek();
      }, Ft(function() {
        var t4 = i2.value.value;
        return 0 === t4 ? 0 : true === t4 ? "" : t4 || "";
      });
    }, []);
    return r2.value;
  }
  function zt(t2, n2, e2, _2) {
    var i2 = n2 in t2 && void 0 === t2.ownerSVGElement, r2 = Tt(e2);
    return { o: function(t3, n3) {
      r2.value = t3, _2 = n3;
    }, d: qt(function() {
      var e3 = r2.value.value;
      _2[n2] !== e3 && (_2[n2] = e3, i2 ? t2[n2] = e3 : e3 ? t2.setAttribute(n2, e3) : t2.removeAttribute(n2));
    }) };
  }
  function Jt(t2) {
    return rt(function() {
      return Tt(t2);
    }, []);
  }
  Dt.prototype.brand = kt, Dt.prototype.h = function() {
    return true;
  }, Dt.prototype.S = function(t2) {
    this.t !== t2 && void 0 === t2.e && (t2.x = this.t, void 0 !== this.t && (this.t.e = t2), this.t = t2);
  }, Dt.prototype.U = function(t2) {
    if (void 0 !== this.t) {
      var n2 = t2.e, e2 = t2.x;
      void 0 !== n2 && (n2.x = e2, t2.e = void 0), void 0 !== e2 && (e2.e = n2, t2.x = void 0), t2 === this.t && (this.t = e2);
    }
  }, Dt.prototype.subscribe = function(t2) {
    var n2 = this;
    return qt(function() {
      var e2 = n2.value, _2 = 32 & this.f;
      this.f &= -33;
      try {
        t2(e2);
      } finally {
        this.f |= _2;
      }
    });
  }, Dt.prototype.valueOf = function() {
    return this.value;
  }, Dt.prototype.toString = function() {
    return this.value + "";
  }, Dt.prototype.toJSON = function() {
    return this.value;
  }, Dt.prototype.peek = function() {
    return this.v;
  }, Object.defineProperty(Dt.prototype, "value", { get: function() {
    var t2 = $t(this);
    return void 0 !== t2 && (t2.i = this.i), this.v;
  }, set: function(t2) {
    if (Et instanceof Wt && function() {
      throw new Error("Computed cannot have side-effects");
    }(), t2 !== this.v) {
      Pt > 100 && bt(), this.v = t2, this.i++, Nt++, Ht++;
      try {
        for (var n2 = this.t; void 0 !== n2; n2 = n2.x) n2.t.N();
      } finally {
        St();
      }
    }
  } }), (Wt.prototype = new Dt()).h = function() {
    if (this.f &= -3, 1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    if (this.f &= -5, this.g === Nt) return true;
    if (this.g = Nt, this.f |= 1, this.i > 0 && !At(this)) return this.f &= -2, true;
    var t2 = Et;
    try {
      Vt(this), Et = this;
      var n2 = this.x();
      (16 & this.f || this.v !== n2 || 0 === this.i) && (this.v = n2, this.f &= -17, this.i++);
    } catch (t3) {
      this.v = t3, this.f |= 16, this.i++;
    }
    return Et = t2, Mt(this), this.f &= -2, true;
  }, Wt.prototype.S = function(t2) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var n2 = this.s; void 0 !== n2; n2 = n2.n) n2.S.S(n2);
    }
    Dt.prototype.S.call(this, t2);
  }, Wt.prototype.U = function(t2) {
    if (void 0 !== this.t && (Dt.prototype.U.call(this, t2), void 0 === this.t)) {
      this.f &= -33;
      for (var n2 = this.s; void 0 !== n2; n2 = n2.n) n2.S.U(n2);
    }
  }, Wt.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var t2 = this.t; void 0 !== t2; t2 = t2.x) t2.t.N();
    }
  }, Wt.prototype.peek = function() {
    if (this.h() || bt(), 16 & this.f) throw this.v;
    return this.v;
  }, Object.defineProperty(Wt.prototype, "value", { get: function() {
    1 & this.f && bt();
    var t2 = $t(this);
    if (this.h(), void 0 !== t2 && (t2.i = this.i), 16 & this.f) throw this.v;
    return this.v;
  } }), jt.prototype.c = function() {
    var t2 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var n2 = this.x();
      "function" == typeof n2 && (this.u = n2);
    } finally {
      t2();
    }
  }, jt.prototype.S = function() {
    1 & this.f && bt(), this.f |= 1, this.f &= -9, Lt(this), Vt(this), Ht++;
    var t2 = Et;
    return Et = this, Rt.bind(this, t2);
  }, jt.prototype.N = function() {
    2 & this.f || (this.f |= 2, this.o = Ut, Ut = this);
  }, jt.prototype.d = function() {
    this.f |= 8, 1 & this.f || Ot(this);
  }, Gt.displayName = "_st", Object.defineProperties(Dt.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: Gt }, props: { configurable: true, get: function() {
    return { data: this };
  } }, __b: { configurable: true, value: 1 } }), Bt("__b", function(t2, n2) {
    if ("string" == typeof n2.type) {
      var e2, _2 = n2.props;
      for (var i2 in _2) if ("children" !== i2) {
        var r2 = _2[i2];
        r2 instanceof Dt && (e2 || (n2.__np = e2 = {}), e2[i2] = r2, _2[i2] = r2.peek());
      }
    }
    t2(n2);
  }), Bt("__r", function(t2, n2) {
    It();
    var e2, _2 = n2.__c;
    _2 && (_2.__$f &= -2, void 0 === (e2 = _2.__$u) && (_2.__$u = e2 = function(t3) {
      var n3;
      return qt(function() {
        n3 = this;
      }), n3.c = function() {
        _2.__$f |= 1, _2.setState({});
      }, n3;
    }())), wt = _2, It(e2), t2(n2);
  }), Bt("__e", function(t2, n2, e2, _2) {
    It(), wt = void 0, t2(n2, e2, _2);
  }), Bt("diffed", function(t2, n2) {
    var e2;
    if (It(), wt = void 0, "string" == typeof n2.type && (e2 = n2.__e)) {
      var _2 = n2.__np, i2 = n2.props;
      if (_2) {
        var r2 = e2.U;
        if (r2) for (var o2 in r2) {
          var u2 = r2[o2];
          void 0 === u2 || o2 in _2 || (u2.d(), r2[o2] = void 0);
        }
        else e2.U = r2 = {};
        for (var f2 in _2) {
          var s2 = r2[f2], l2 = _2[f2];
          void 0 === s2 ? (s2 = zt(e2, f2, l2, i2), r2[f2] = s2) : s2.o(l2, i2);
        }
      }
    }
    t2(n2);
  }), Bt("unmount", function(t2, n2) {
    if ("string" == typeof n2.type) {
      var e2 = n2.__e;
      if (e2) {
        var _2 = e2.U;
        if (_2) for (var i2 in e2.U = void 0, _2) {
          var r2 = _2[i2];
          r2 && r2.d();
        }
      }
    } else {
      var o2 = n2.__c;
      if (o2) {
        var u2 = o2.__$u;
        u2 && (o2.__$u = void 0, u2.d());
      }
    }
    t2(n2);
  }), Bt("__h", function(t2, n2, e2, _2) {
    (_2 < 3 || 9 === _2) && (n2.__$f |= 2), t2(n2, e2, _2);
  }), g.prototype.shouldComponentUpdate = function(t2, n2) {
    var e2 = this.__$u;
    if (!(e2 && void 0 !== e2.s || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
    for (var _2 in n2) return true;
    for (var i2 in t2) if ("__source" !== i2 && t2[i2] !== this.props[i2]) return true;
    for (var r2 in this.props) if (!(r2 in t2)) return true;
    return false;
  };
  var Qt = gt.bind(v);

  // ../src/Counter.js
  var html = gt.bind(v);
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
    const [count, dispatch] = tt(reducer, props.state || initialState);
    return html`<div>
    <h2><pre>${count}</pre></h2> 
     <div class="button-group right" style="margin-top: 2em;">
      <button class="button" onClick=${() => dispatch("increment")}>+1</button>
      <button class="button" onClick=${() => dispatch("decrement")}>-1</button>
      <button class="button" onClick=${() => dispatch("reset")}>reset</button>
    </div>
      </div>`;
  }
  var Counter_default = Counter;

  // app.js
  var html2 = gt.bind(v);
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("app");
    W(html2`<${Counter_default} />`, container);
  });
})();
