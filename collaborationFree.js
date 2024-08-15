(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/**
* @vue/shared v3.4.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend$3 = Object.assign;
const remove$1 = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$2(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value) || isObject$2(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$1(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$2(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const isRef$1 = (val) => {
  return !!(val && val.__v_isRef === true);
};
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$2(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$2(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.4.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function track(target2, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target2);
    if (!depsMap) {
      targetMap.set(target2, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep
    );
  }
}
function trigger(target2, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target2);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target2)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4
      );
    }
  }
  resetScheduling();
}
function getDepFromReactive(object, key) {
  const depsMap = targetMap.get(object);
  return depsMap && depsMap.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty$1(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target2, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target2) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target2) === Object.getPrototypeOf(receiver)) {
        return target2;
      }
      return;
    }
    const targetIsArray = isArray$1(target2);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty$1;
      }
    }
    const res = Reflect.get(target2, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target2, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$2(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target2, key, value, receiver) {
    let oldValue = target2[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target2) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target2) && isIntegerKey(key) ? Number(key) < target2.length : hasOwn(target2, key);
    const result = Reflect.set(target2, key, value, receiver);
    if (target2 === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target2, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target2, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target2, key) {
    const hadKey = hasOwn(target2, key);
    target2[key];
    const result = Reflect.deleteProperty(target2, key);
    if (result && hadKey) {
      trigger(target2, "delete", key, void 0);
    }
    return result;
  }
  has(target2, key) {
    const result = Reflect.has(target2, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target2, "has", key);
    }
    return result;
  }
  ownKeys(target2) {
    track(
      target2,
      "iterate",
      isArray$1(target2) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target2);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target2, key) {
    return true;
  }
  deleteProperty(target2, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target2, key, isReadonly2 = false, isShallow2 = false) {
  target2 = target2["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target2.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target2.get(rawKey));
  } else if (target2 !== rawTarget) {
    target2.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target2 = this["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target2.has(key) : target2.has(key) || target2.has(rawKey);
}
function size(target2, isReadonly2 = false) {
  target2 = target2["__v_raw"];
  !isReadonly2 && track(toRaw(target2), "iterate", ITERATE_KEY);
  return Reflect.get(target2, "size", target2);
}
function add$2(value, _isShallow = false) {
  if (!_isShallow && !isShallow(value) && !isReadonly(value)) {
    value = toRaw(value);
  }
  const target2 = toRaw(this);
  const proto = getProto(target2);
  const hadKey = proto.has.call(target2, value);
  if (!hadKey) {
    target2.add(value);
    trigger(target2, "add", value, value);
  }
  return this;
}
function set(key, value, _isShallow = false) {
  if (!_isShallow && !isShallow(value) && !isReadonly(value)) {
    value = toRaw(value);
  }
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  const oldValue = get2.call(target2, key);
  target2.set(key, value);
  if (!hadKey) {
    trigger(target2, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target2, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  get2 ? get2.call(target2, key) : void 0;
  const result = target2.delete(key);
  if (hadKey) {
    trigger(target2, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target2 = toRaw(this);
  const hadItems = target2.size !== 0;
  const result = target2.clear();
  if (hadItems) {
    trigger(target2, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach2(callback, thisArg) {
    const observed = this;
    const target2 = observed["__v_raw"];
    const rawTarget = toRaw(target2);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target2.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target2 = this["__v_raw"];
    const rawTarget = toRaw(target2);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target2[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add: add$2,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add(value) {
      return add$2.call(this, value, true);
    },
    set(key, value) {
      return set.call(this, key, value, true);
    },
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target2, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target2;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target2 ? instrumentations : target2,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target2) {
  if (isReadonly(target2)) {
    return target2;
  }
  return createReactiveObject(
    target2,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target2) {
  return createReactiveObject(
    target2,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target2) {
  return createReactiveObject(
    target2,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target2) {
  return createReactiveObject(
    target2,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target2, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$2(target2)) {
    return target2;
  }
  if (target2["__v_raw"] && !(isReadonly2 && target2["__v_isReactive"])) {
    return target2;
  }
  const existingProxy = proxyMap.get(target2);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target2);
  if (targetType === 0) {
    return target2;
  }
  const proxy = new Proxy(
    target2,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target2, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw2 = observed && observed["__v_raw"];
  return raw2 ? toRaw(raw2) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      )
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal, oldVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue;
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4);
    }
  }
}
function triggerRef(ref2) {
  triggerRefValue(ref2, 4);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target2, key, receiver) => unref(Reflect.get(target2, key, receiver)),
  set: (target2, key, value, receiver) => {
    const oldValue = target2[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target2, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction$1(source)) {
    return new GetterRefImpl(source);
  } else if (isObject$2(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
/**
* @vue/runtime-core v3.4.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw2) {
  if (isString$1(value)) {
    value = JSON.stringify(value);
    return raw2 ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw2 ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw2 ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$1(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw2 ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray$1(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      pauseTracking();
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.active !== false) cb();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre) return -1;
    if (b.pre && !a.pre) return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false) ;
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options2, extraOptions) {
  return isFunction$1(options2) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend$3({ name: options2.name }, extraOptions, { setup: options2 }))()
  ) : options2;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target2) {
  registerKeepAliveHook(hook, "a", target2);
}
function onDeactivated(hook, target2) {
  registerKeepAliveHook(hook, "da", target2);
}
function registerKeepAliveHook(hook, type, target2 = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target2;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target2);
  if (target2) {
    let current = target2.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target2, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target2, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove$1(keepAliveRoot[type], injected);
  }, target2);
}
function injectHook(type, hook, target2 = currentInstance, prepend = false) {
  if (target2) {
    const hooks = target2[type] || (target2[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset2 = setCurrentInstance(target2);
      const res = callWithAsyncErrorHandling(hook, target2, type, args);
      reset2();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target2 = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target2);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target2 = currentInstance) {
  injectHook("ec", hook, target2);
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry2, name) {
  return registry2 && (registry2[name] || registry2[camelize(name)] || registry2[capitalize(camelize(name))]);
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend$3(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target2, key, descriptor) {
    if (descriptor.get != null) {
      target2._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target2, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target2, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options2 = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options2.beforeCreate) {
    callHook(options2.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options2;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$2(data)) ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register2(_hook.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$2(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw2, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw2)) {
    const handler = ctx[raw2];
    if (isFunction$1(handler)) {
      watch$1(getter, handler);
    }
  } else if (isFunction$1(raw2)) {
    watch$1(getter, raw2.bind(publicThis));
  } else if (isObject$2(raw2)) {
    if (isArray$1(raw2)) {
      raw2.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw2.handler) ? raw2.handler.bind(publicThis) : ctx[raw2.handler];
      if (isFunction$1(handler)) {
        watch$1(getter, handler, raw2);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$2(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend$3(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw2) {
  if (isArray$1(raw2)) {
    const res = {};
    for (let i = 0; i < raw2.length; i++) {
      res[raw2[i]] = raw2[i];
    }
    return res;
  }
  return raw2;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend$3(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend$3(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend$3(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate2) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend$3({}, rootComponent);
    }
    if (rootProps != null && !isObject$2(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin2, ...options2) {
        if (installedPlugins.has(plugin2)) ;
        else if (plugin2 && isFunction$1(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app2, ...options2);
        } else if (isFunction$1(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app2, ...options2);
        } else ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate2) {
            hydrate2(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getComponentPublicInstance(vnode.component);
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options2] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options2) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options2,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options2) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options2,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options2, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options2 && hasOwn(options2, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options2,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options2, props, key, value, instance, isAbsent) {
  const opt = options2[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset2 = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset2();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw2 = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw22) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw22, appContext, true);
      extend$3(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw2 && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw2)) {
    for (let i = 0; i < raw2.length; i++) {
      const normalizedKey = camelize(raw2[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw2) {
    for (const key in raw2) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw2[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend$3({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$2(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
function getType(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref3) {
    if (isString$1(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString$1(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray$1(existing) && remove$1(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (hasOwn(setupState, ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options2) {
  return baseCreateRenderer(options2);
}
function baseCreateRenderer(options2, createHydrationFns) {
  const target2 = getGlobalThis();
  target2.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options2;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => {
      if (effect2.dirty) {
        effect2.run();
      }
    };
    update.i = instance;
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing2 = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options2
  };
  let hydrate2;
  let hydrateNode;
  return {
    render,
    hydrate: hydrate2,
    createApp: createAppAPI(render, hydrate2)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++) hooks[i].active = false;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchEffect(effect2, options2) {
  return doWatch(effect2, null, options2);
}
const INITIAL_WATCHER_VALUE = {};
function watch$1(source, cb, options2) {
  return doWatch(source, cb, options2);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance) job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove$1(scope.effects, effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  if (ssrCleanup) ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options2) {
  const publicThis = this.proxy;
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options2 = value;
  }
  const reset2 = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options2);
  reset2();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject$2(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw2 = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw22) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw22, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend$3(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw2 && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw2)) {
    raw2.forEach((key) => normalized[key] = null);
  } else {
    extend$3(normalized, raw2);
  }
  if (isObject$2(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options2, key) {
  if (!options2 || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options2, key[0].toLowerCase() + key.slice(1)) || hasOwn(options2, hyphenate(key)) || hasOwn(options2, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit22,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target2, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target2, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit22
          } : { attrs, slots, emit: emit22 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root2 = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root2;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root2 = cloneVNode(root2, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root2 = cloneVNode(root2, null, false, true);
    root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root2.transition = vnode.transition;
  }
  {
    result = root2;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root2 = parent.subTree;
    if (root2.suspense && root2.suspense.activeBranch === vnode) {
      root2.el = vnode.el;
    }
    if (root2 === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString$1(ref3) || isRef(ref3) || isFunction$1(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString$1(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString$1(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$2(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend$3({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$1(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$2(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return isProxy(props) || isInternalObject(props) ? extend$3({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps$1(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text, null, text2, flag);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps$1(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set2) => set2(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset2 = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset2();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$2(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance, isSSR);
}
let compile$1;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile$1 && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend$3(
          extend$3(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile$1(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset2 = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset2();
    }
  }
}
const attrsProxyHandlers = {
  get(target2, key) {
    track(target2, "get", "");
    return target2[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target2, key) {
        if (key in target2) {
          return target2[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target2, key) {
        return key in target2 || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry2) => {
      for (const key in registry2) {
        if (registry2[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$2(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.4.34";
/**
* @vue/runtime-dom v3.4.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is3, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is3 ? doc.createElement(tag, { is: is3 }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node, text2) => {
    node.nodeValue = text2;
  },
  setElementText: (el, text2) => {
    el.textContent = text2;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper2 = template.firstChild;
        while (wrapper2.firstChild) {
          template.appendChild(wrapper2.firstChild);
        }
        template.removeChild(wrapper2);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString$1(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString$1(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean2 = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean2 ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent) {
  if (key === "innerHTML" || key === "textContent") {
    if (value == null) return;
    el[key] = value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? "" : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options2) {
  el.addEventListener(event, handler, options2);
}
function removeEventListener(el, event, handler, options2) {
  el.removeEventListener(event, handler, options2);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options2] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options2);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options2);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options2;
  if (optionsModifierRE.test(name)) {
    options2 = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options2[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options2];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue2, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue2;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString$1(value)) {
    return false;
  }
  return key in el;
}
const rendererOptions = /* @__PURE__ */ extend$3({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app2._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString$1(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var isBrowser$3 = typeof window !== "undefined";
var explicitKeys = [
  "__key",
  "__init",
  "__shim",
  "__original",
  "__index",
  "__prevKey"
];
function token$1() {
  return Math.random().toString(36).substring(2, 15);
}
function dedupe(arr1, arr2) {
  const original = arr1 instanceof Set ? arr1 : new Set(arr1);
  return [...original];
}
function has(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}
function eq(valA, valB, deep = true, explicit = ["__key"]) {
  if (valA === valB)
    return true;
  if (typeof valB === "object" && typeof valA === "object") {
    if (valA instanceof Map)
      return false;
    if (valA instanceof Set)
      return false;
    if (valA instanceof Date && valB instanceof Date)
      return valA.getTime() === valB.getTime();
    if (valA instanceof RegExp && valB instanceof RegExp)
      return eqRegExp(valA, valB);
    if (valA === null || valB === null)
      return false;
    if (Object.keys(valA).length !== Object.keys(valB).length)
      return false;
    for (const k of explicit) {
      if ((k in valA || k in valB) && valA[k] !== valB[k])
        return false;
    }
    for (const key in valA) {
      if (!(key in valB))
        return false;
      if (valA[key] !== valB[key] && !deep)
        return false;
      if (deep && !eq(valA[key], valB[key], deep, explicit))
        return false;
    }
    return true;
  }
  return false;
}
function eqRegExp(x, y) {
  return x.source === y.source && x.flags.split("").sort().join("") === y.flags.split("").sort().join("");
}
function empty(value) {
  const type = typeof value;
  if (type === "number")
    return false;
  if (value === void 0)
    return true;
  if (type === "string") {
    return value === "";
  }
  if (type === "object") {
    if (value === null)
      return true;
    for (const _i in value)
      return false;
    if (value instanceof RegExp)
      return false;
    if (value instanceof Date)
      return false;
    return true;
  }
  return false;
}
function escapeExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function regexForFormat(format) {
  const escaped = `^${escapeExp(format)}$`;
  const formats = {
    MM: "(0[1-9]|1[012])",
    M: "([1-9]|1[012])",
    DD: "([012][0-9]|3[01])",
    D: "([012]?[0-9]|3[01])",
    YYYY: "\\d{4}",
    YY: "\\d{2}"
  };
  const tokens = Object.keys(formats);
  return new RegExp(
    tokens.reduce((regex, format2) => {
      return regex.replace(format2, formats[format2]);
    }, escaped)
  );
}
function isRecord(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isObject$1(o) {
  return isRecord(o) || Array.isArray(o);
}
function isPojo(o) {
  if (isRecord(o) === false)
    return false;
  if (o.__FKNode__ || o.__POJO__ === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  const prot = ctor.prototype;
  if (isRecord(prot) === false)
    return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}
var extend$2 = /* @__NO_SIDE_EFFECTS__ */ (original, additional, extendArrays = false, ignoreUndefined = false) => {
  if (additional === null)
    return null;
  const merged = {};
  if (typeof additional === "string")
    return additional;
  for (const key in original) {
    if (has(additional, key) && (additional[key] !== void 0 || !ignoreUndefined)) {
      if (extendArrays && Array.isArray(original[key]) && Array.isArray(additional[key])) {
        merged[key] = original[key].concat(additional[key]);
        continue;
      }
      if (additional[key] === void 0) {
        continue;
      }
      if (isPojo(original[key]) && isPojo(additional[key])) {
        merged[key] = /* @__PURE__ */ extend$2(
          original[key],
          additional[key],
          extendArrays,
          ignoreUndefined
        );
      } else {
        merged[key] = additional[key];
      }
    } else {
      merged[key] = original[key];
    }
  }
  for (const key in additional) {
    if (!has(merged, key) && additional[key] !== void 0) {
      merged[key] = additional[key];
    }
  }
  return merged;
};
function isQuotedString(str) {
  if (str[0] !== '"' && str[0] !== "'")
    return false;
  if (str[0] !== str[str.length - 1])
    return false;
  const quoteType = str[0];
  for (let p2 = 1; p2 < str.length; p2++) {
    if (str[p2] === quoteType && (p2 === 1 || str[p2 - 1] !== "\\") && p2 !== str.length - 1) {
      return false;
    }
  }
  return true;
}
function rmEscapes(str) {
  if (!str.length)
    return "";
  let clean2 = "";
  let lastChar = "";
  for (let p2 = 0; p2 < str.length; p2++) {
    const char = str.charAt(p2);
    if (char !== "\\" || lastChar === "\\") {
      clean2 += char;
    }
    lastChar = char;
  }
  return clean2;
}
function nodeProps(...sets) {
  return sets.reduce((valid, props) => {
    const { value, name, modelValue, config: config2, plugins, ...validProps } = props;
    return Object.assign(valid, validProps);
  }, {});
}
function parseArgs(str) {
  const args = [];
  let arg = "";
  let depth = 0;
  let quote = "";
  let lastChar = "";
  for (let p2 = 0; p2 < str.length; p2++) {
    const char = str.charAt(p2);
    if (char === quote && lastChar !== "\\") {
      quote = "";
    } else if ((char === "'" || char === '"') && !quote && lastChar !== "\\") {
      quote = char;
    } else if (char === "(" && !quote) {
      depth++;
    } else if (char === ")" && !quote) {
      depth--;
    }
    if (char === "," && !quote && depth === 0) {
      args.push(arg);
      arg = "";
    } else if (char !== " " || quote) {
      arg += char;
    }
    lastChar = char;
  }
  if (arg) {
    args.push(arg);
  }
  return args;
}
function except(obj, toRemove) {
  const clean2 = {};
  const exps = toRemove.filter((n) => n instanceof RegExp);
  const keysToRemove = new Set(toRemove);
  for (const key in obj) {
    if (!keysToRemove.has(key) && !exps.some((exp) => exp.test(key))) {
      clean2[key] = obj[key];
    }
  }
  return clean2;
}
function only(obj, include) {
  const clean2 = {};
  const exps = include.filter((n) => n instanceof RegExp);
  include.forEach((key) => {
    if (!(key instanceof RegExp)) {
      clean2[key] = obj[key];
    }
  });
  Object.keys(obj).forEach((key) => {
    if (exps.some((exp) => exp.test(key))) {
      clean2[key] = obj[key];
    }
  });
  return clean2;
}
function camel(str) {
  return str.replace(
    /-([a-z0-9])/gi,
    (_s, g) => g.toUpperCase()
  );
}
function kebab(str) {
  return str.replace(
    /([a-z0-9])([A-Z])/g,
    (_s, trail, cap) => trail + "-" + cap.toLowerCase()
  ).replace(" ", "-").toLowerCase();
}
function shallowClone(obj, explicit = explicitKeys) {
  if (obj !== null && typeof obj === "object") {
    let returnObject;
    if (Array.isArray(obj))
      returnObject = [...obj];
    else if (isPojo(obj))
      returnObject = { ...obj };
    if (returnObject) {
      applyExplicit(obj, returnObject, explicit);
      return returnObject;
    }
  }
  return obj;
}
function clone(obj, explicit = explicitKeys) {
  if (obj === null || obj instanceof RegExp || obj instanceof Date || obj instanceof Map || obj instanceof Set || typeof File === "function" && obj instanceof File)
    return obj;
  let returnObject;
  if (Array.isArray(obj)) {
    returnObject = obj.map((value) => {
      if (typeof value === "object")
        return clone(value, explicit);
      return value;
    });
  } else {
    returnObject = Object.keys(obj).reduce((newObj, key) => {
      newObj[key] = typeof obj[key] === "object" ? clone(obj[key], explicit) : obj[key];
      return newObj;
    }, {});
  }
  for (const key of explicit) {
    if (key in obj) {
      Object.defineProperty(returnObject, key, {
        enumerable: false,
        value: obj[key]
      });
    }
  }
  return returnObject;
}
function cloneAny(obj) {
  return typeof obj === "object" ? clone(obj) : obj;
}
function getAt(obj, addr) {
  if (!obj || typeof obj !== "object")
    return null;
  const segments = addr.split(".");
  let o = obj;
  for (const i in segments) {
    const segment = segments[i];
    if (has(o, segment)) {
      o = o[segment];
    }
    if (+i === segments.length - 1)
      return o;
    if (!o || typeof o !== "object")
      return null;
  }
  return null;
}
function undefine(value) {
  return value !== void 0 && value !== "false" && value !== false ? true : void 0;
}
function init(obj) {
  return !Object.isFrozen(obj) ? Object.defineProperty(obj, "__init", {
    enumerable: false,
    value: true
  }) : obj;
}
function slugify(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, " ").trim().replace(/\s+/g, "-");
}
function applyExplicit(original, obj, explicit) {
  for (const key of explicit) {
    if (key in original) {
      Object.defineProperty(obj, key, {
        enumerable: false,
        value: original[key]
      });
    }
  }
  return obj;
}
function whenAvailable(childId, callback, root2) {
  if (!isBrowser$3)
    return;
  if (!root2)
    root2 = document;
  const el = root2.getElementById(childId);
  if (el)
    return callback(el);
  const observer = new MutationObserver(() => {
    const el2 = root2 == null ? void 0 : root2.getElementById(childId);
    if (el2) {
      observer == null ? void 0 : observer.disconnect();
      callback(el2);
    }
  });
  observer.observe(root2, { childList: true, subtree: true });
}
function oncePerTick(fn) {
  let called = false;
  return (...args) => {
    if (called)
      return;
    called = true;
    queueMicrotask(() => called = false);
    return fn(...args);
  };
}
function boolGetter(value) {
  if (value === "false" || value === false)
    return void 0;
  return true;
}
function createDispatcher() {
  const middleware = [];
  let currentIndex = 0;
  const use2 = (dispatchable) => middleware.push(dispatchable);
  const dispatch = (payload) => {
    const current = middleware[currentIndex];
    if (typeof current === "function") {
      return current(payload, (explicitPayload) => {
        currentIndex++;
        return dispatch(explicitPayload);
      });
    }
    currentIndex = 0;
    return payload;
  };
  use2.dispatch = dispatch;
  use2.unshift = (dispatchable) => middleware.unshift(dispatchable);
  use2.remove = (dispatchable) => {
    const index = middleware.indexOf(dispatchable);
    if (index > -1)
      middleware.splice(index, 1);
  };
  return use2;
}
function createEmitter() {
  const listeners = /* @__PURE__ */ new Map();
  const receipts2 = /* @__PURE__ */ new Map();
  let buffer = void 0;
  const emitter = (node, event) => {
    if (buffer) {
      buffer.set(event.name, [node, event]);
      return;
    }
    if (listeners.has(event.name)) {
      listeners.get(event.name).forEach((wrapper2) => {
        if (event.origin === node || wrapper2.modifiers.includes("deep")) {
          wrapper2.listener(event);
        }
      });
    }
    if (event.bubble) {
      node.bubble(event);
    }
  };
  emitter.flush = () => {
    listeners.clear();
    receipts2.clear();
    buffer == null ? void 0 : buffer.clear();
  };
  emitter.on = (eventName, listener, pos = "push") => {
    const [event, ...modifiers] = eventName.split(".");
    const receipt = listener.receipt || token$1();
    const wrapper2 = {
      modifiers,
      event,
      listener,
      receipt
    };
    listeners.has(event) ? listeners.get(event)[pos](wrapper2) : listeners.set(event, [wrapper2]);
    receipts2.has(receipt) ? receipts2.get(receipt)[pos](event) : receipts2.set(receipt, [event]);
    return receipt;
  };
  emitter.off = (receipt) => {
    var _a;
    if (receipts2.has(receipt)) {
      (_a = receipts2.get(receipt)) == null ? void 0 : _a.forEach((event) => {
        const eventListeners = listeners.get(event);
        if (Array.isArray(eventListeners)) {
          listeners.set(
            event,
            eventListeners.filter((wrapper2) => wrapper2.receipt !== receipt)
          );
        }
      });
      receipts2.delete(receipt);
    }
  };
  emitter.pause = (node) => {
    if (!buffer)
      buffer = /* @__PURE__ */ new Map();
    if (node) {
      node.walk((child) => child._e.pause());
    }
  };
  emitter.play = (node) => {
    if (!buffer)
      return;
    const events = buffer;
    buffer = void 0;
    events.forEach(([node2, event]) => emitter(node2, event));
    if (node) {
      node.walk((child) => child._e.play());
    }
  };
  return emitter;
}
function emit(node, context, name, payload, bubble2 = true, meta2) {
  context._e(node, {
    payload,
    name,
    bubble: bubble2,
    origin: node,
    meta: meta2
  });
  return node;
}
function bubble(node, _context, event) {
  if (isNode(node.parent)) {
    node.parent._e(node.parent, event);
  }
  return node;
}
function on(_node, context, name, listener, pos) {
  return context._e.on(name, listener, pos);
}
function off(node, context, receipt) {
  context._e.off(receipt);
  return node;
}
var errorHandler = createDispatcher();
errorHandler((error2, next) => {
  if (!error2.message)
    error2.message = String(`E${error2.code}`);
  return next(error2);
});
var warningHandler = createDispatcher();
warningHandler((warning, next) => {
  if (!warning.message)
    warning.message = String(`W${warning.code}`);
  const result = next(warning);
  if (console && typeof console.warn === "function")
    console.warn(result.message);
  return result;
});
function warn(code, data = {}) {
  warningHandler.dispatch({ code, data });
}
function error(code, data = {}) {
  throw Error(errorHandler.dispatch({ code, data }).message);
}
function createMessage(conf, node) {
  const m = {
    blocking: false,
    key: token$1(),
    meta: {},
    type: "state",
    visible: true,
    ...conf
  };
  return m;
}
var storeTraps = {
  apply: applyMessages,
  set: setMessage,
  remove: removeMessage$1,
  filter: filterMessages,
  reduce: reduceMessages,
  release: releaseBuffer,
  touch: touchMessages
};
function createStore(_buffer = false) {
  const messages3 = {};
  let node;
  let buffer = _buffer;
  let _b = [];
  const _m = /* @__PURE__ */ new Map();
  let _r = void 0;
  const store = new Proxy(messages3, {
    get(...args) {
      const [_target, property] = args;
      if (property === "buffer")
        return buffer;
      if (property === "_b")
        return _b;
      if (property === "_m")
        return _m;
      if (property === "_r")
        return _r;
      if (has(storeTraps, property)) {
        return storeTraps[property].bind(
          null,
          messages3,
          store,
          node
        );
      }
      return Reflect.get(...args);
    },
    set(_t, prop, value) {
      if (prop === "_n") {
        node = value;
        if (_r === "__n")
          releaseMissed(node, store);
        return true;
      } else if (prop === "_b") {
        _b = value;
        return true;
      } else if (prop === "buffer") {
        buffer = value;
        return true;
      } else if (prop === "_r") {
        _r = value;
        return true;
      }
      error(101, node);
      return false;
    }
  });
  return store;
}
function setMessage(messageStore, store, node, message3) {
  if (store.buffer) {
    store._b.push([[message3]]);
    return store;
  }
  if (messageStore[message3.key] !== message3) {
    if (typeof message3.value === "string" && message3.meta.localize !== false) {
      const previous = message3.value;
      message3.value = node.t(message3);
      if (message3.value !== previous) {
        message3.meta.locale = node.props.locale;
      }
    }
    const e = `message-${has(messageStore, message3.key) ? "updated" : "added"}`;
    messageStore[message3.key] = Object.freeze(
      node.hook.message.dispatch(message3)
    );
    node.emit(e, message3);
  }
  return store;
}
function touchMessages(messageStore, store) {
  for (const key in messageStore) {
    const message3 = { ...messageStore[key] };
    store.set(message3);
  }
}
function removeMessage$1(messageStore, store, node, key) {
  if (has(messageStore, key)) {
    const message3 = messageStore[key];
    delete messageStore[key];
    node.emit("message-removed", message3);
  }
  if (store.buffer === true) {
    store._b = store._b.filter((buffered) => {
      buffered[0] = buffered[0].filter((m) => m.key !== key);
      return buffered[1] || buffered[0].length;
    });
  }
  return store;
}
function filterMessages(messageStore, store, node, callback, type) {
  for (const key in messageStore) {
    const message3 = messageStore[key];
    if ((!type || message3.type === type) && !callback(message3)) {
      removeMessage$1(messageStore, store, node, key);
    }
  }
}
function reduceMessages(messageStore, _store, _node, reducer, accumulator) {
  for (const key in messageStore) {
    const message3 = messageStore[key];
    accumulator = reducer(accumulator, message3);
  }
  return accumulator;
}
function applyMessages(_messageStore, store, node, messages3, clear2) {
  if (Array.isArray(messages3)) {
    if (store.buffer) {
      store._b.push([messages3, clear2]);
      return;
    }
    const applied = new Set(
      messages3.map((message3) => {
        store.set(message3);
        return message3.key;
      })
    );
    if (typeof clear2 === "string") {
      store.filter(
        (message3) => message3.type !== clear2 || applied.has(message3.key)
      );
    } else if (typeof clear2 === "function") {
      store.filter((message3) => !clear2(message3) || applied.has(message3.key));
    }
  } else {
    for (const address in messages3) {
      const child = node.at(address);
      if (child) {
        child.store.apply(messages3[address], clear2);
      } else {
        missed(node, store, address, messages3[address], clear2);
      }
    }
  }
}
function createMessages(node, ...errors2) {
  const sourceKey = `${node.name}-set`;
  const make = (error2) => /* @__PURE__ */ createMessage({
    key: slugify(error2),
    type: "error",
    value: error2,
    meta: { source: sourceKey, autoClear: true }
  });
  return errors2.filter((m) => !!m).map((errorSet) => {
    if (typeof errorSet === "string")
      errorSet = [errorSet];
    if (Array.isArray(errorSet)) {
      return errorSet.map((error2) => make(error2));
    } else {
      const errors22 = {};
      for (const key in errorSet) {
        if (Array.isArray(errorSet[key])) {
          errors22[key] = errorSet[key].map(
            (error2) => make(error2)
          );
        } else {
          errors22[key] = [make(errorSet[key])];
        }
      }
      return errors22;
    }
  });
}
function missed(node, store, address, messages3, clear2) {
  var _a;
  const misses = store._m;
  if (!misses.has(address))
    misses.set(address, []);
  if (!store._r)
    store._r = releaseMissed(node, store);
  (_a = misses.get(address)) == null ? void 0 : _a.push([messages3, clear2]);
}
function releaseMissed(node, store) {
  return node.on(
    "child.deep",
    ({ payload: child }) => {
      store._m.forEach((misses, address) => {
        if (node.at(address) === child) {
          misses.forEach(([messages3, clear2]) => {
            child.store.apply(messages3, clear2);
          });
          store._m.delete(address);
        }
      });
      if (store._m.size === 0 && store._r) {
        node.off(store._r);
        store._r = void 0;
      }
    }
  );
}
function releaseBuffer(_messageStore, store) {
  store.buffer = false;
  store._b.forEach(([messages3, clear2]) => store.apply(messages3, clear2));
  store._b = [];
}
function createLedger() {
  const ledger = {};
  let n;
  return {
    count: (...args) => createCounter(n, ledger, ...args),
    init(node) {
      n = node;
      node.on("message-added.deep", add$1(ledger, 1));
      node.on("message-removed.deep", add$1(ledger, -1));
    },
    merge: (child) => merge$1(n, ledger, child),
    settled(counterName) {
      return has(ledger, counterName) ? ledger[counterName].promise : Promise.resolve();
    },
    unmerge: (child) => merge$1(n, ledger, child, true),
    value(counterName) {
      return has(ledger, counterName) ? ledger[counterName].count : 0;
    }
  };
}
function createCounter(node, ledger, counterName, condition, increment = 0) {
  condition = parseCondition(condition || counterName);
  if (!has(ledger, counterName)) {
    const counter = {
      condition,
      count: 0,
      name: counterName,
      node,
      promise: Promise.resolve(),
      resolve: () => {
      }
      // eslint-disable-line @typescript-eslint/no-empty-function
    };
    ledger[counterName] = counter;
    increment = node.store.reduce(
      (sum, m) => sum + counter.condition(m) * 1,
      increment
    );
    node.each((child) => {
      child.ledger.count(counter.name, counter.condition);
      increment += child.ledger.value(counter.name);
    });
  }
  return count(ledger[counterName], increment).promise;
}
function parseCondition(condition) {
  if (typeof condition === "function") {
    return condition;
  }
  return (m) => m.type === condition;
}
function count(counter, increment) {
  const initial = counter.count;
  const post = counter.count + increment;
  counter.count = post;
  if (initial === 0 && post !== 0) {
    counter.node.emit(`unsettled:${counter.name}`, counter.count, false);
    counter.promise = new Promise((r) => counter.resolve = r);
  } else if (initial !== 0 && post === 0) {
    counter.node.emit(`settled:${counter.name}`, counter.count, false);
    counter.resolve();
  }
  counter.node.emit(`count:${counter.name}`, counter.count, false);
  return counter;
}
function add$1(ledger, delta) {
  return (e) => {
    for (const name in ledger) {
      const counter = ledger[name];
      if (counter.condition(e.payload)) {
        count(counter, delta);
      }
    }
  };
}
function merge$1(parent, ledger, child, remove2 = false) {
  const originalParent = parent;
  for (const key in ledger) {
    const condition = ledger[key].condition;
    if (!remove2)
      child.ledger.count(key, condition);
    const increment = child.ledger.value(key) * (remove2 ? -1 : 1);
    if (!parent)
      continue;
    do {
      parent.ledger.count(key, condition, increment);
      parent = parent.parent;
    } while (parent);
    parent = originalParent;
  }
}
var registry = /* @__PURE__ */ new Map();
var reflected = /* @__PURE__ */ new Map();
var emit2 = createEmitter();
function register$1(node) {
  if (node.props.id) {
    registry.set(node.props.id, node);
    reflected.set(node, node.props.id);
    emit2(node, {
      payload: node,
      name: node.props.id,
      bubble: false,
      origin: node
    });
  }
}
function deregister(node) {
  if (reflected.has(node)) {
    const id = reflected.get(node);
    reflected.delete(node);
    registry.delete(id);
    emit2(node, {
      payload: null,
      name: id,
      bubble: false,
      origin: node
    });
  }
}
function getNode(id) {
  return registry.get(id);
}
function watchRegistry(id, callback) {
  const receipt = emit2.on(id, callback);
  return receipt;
}
function configChange(node, prop, value) {
  let usingFallback = true;
  !(prop in node.config._t) ? node.emit(`config:${prop}`, value, false) : usingFallback = false;
  if (!(prop in node.props)) {
    node.emit("prop", { prop, value });
    node.emit(`prop:${prop}`, value);
  }
  return usingFallback;
}
function createConfig(options2 = {}) {
  const nodes = /* @__PURE__ */ new Set();
  const target2 = {
    ...options2,
    ...{
      _add: (node) => nodes.add(node),
      _rm: (node) => nodes.delete(node)
    }
  };
  const rootConfig = new Proxy(target2, {
    set(t, prop, value, r) {
      if (typeof prop === "string") {
        nodes.forEach((node) => configChange(node, prop, value));
      }
      return Reflect.set(t, prop, value, r);
    }
  });
  return rootConfig;
}
function submitForm(id, root2) {
  const formElement = (root2 || document).getElementById(id);
  if (formElement instanceof HTMLFormElement) {
    const event = new Event("submit", { cancelable: true, bubbles: true });
    formElement.dispatchEvent(event);
    return;
  }
  warn(151, id);
}
function clearState(node) {
  const clear2 = (n) => {
    for (const key in n.store) {
      const message3 = n.store[key];
      if (message3.type === "error" || message3.type === "ui" && key === "incomplete") {
        n.store.remove(key);
      } else if (message3.type === "state") {
        n.store.set({ ...message3, value: false });
      }
    }
  };
  clear2(node);
  node.walk(clear2);
}
function reset(id, resetTo) {
  const node = typeof id === "string" ? getNode(id) : id;
  if (node) {
    const initial = (n) => cloneAny(n.props.initial) || (n.type === "group" ? {} : n.type === "list" ? [] : void 0);
    node._e.pause(node);
    const resetValue2 = cloneAny(resetTo);
    if (resetTo && !empty(resetTo)) {
      node.props.initial = isObject$1(resetValue2) ? init(resetValue2) : resetValue2;
      node.props._init = node.props.initial;
    }
    node.input(initial(node), false);
    node.walk((child) => {
      if (child.type === "list" && child.sync)
        return;
      child.input(initial(child), false);
    });
    node.input(
      empty(resetValue2) && resetValue2 ? resetValue2 : initial(node),
      false
    );
    const isDeepReset = node.type !== "input" && resetTo && !empty(resetTo) && isObject$1(resetTo);
    if (isDeepReset) {
      node.walk((child) => {
        child.props.initial = isObject$1(child.value) ? init(child.value) : child.value;
        child.props._init = child.props.initial;
      });
    }
    node._e.play(node);
    clearState(node);
    node.emit("reset", node);
    return node;
  }
  warn(152, id);
  return;
}
var defaultConfig$1 = {
  delimiter: ".",
  delay: 0,
  locale: "en",
  rootClasses: (key) => ({ [`formkit-${kebab(key)}`]: true })
};
var useIndex = Symbol("index");
var valueRemoved = Symbol("removed");
var valueMoved = Symbol("moved");
var valueInserted = Symbol("inserted");
function isList(arg) {
  return arg.type === "list" && Array.isArray(arg._value);
}
function isNode(node) {
  return node && typeof node === "object" && node.__FKNode__ === true;
}
var invalidSetter = (node, _context, property) => {
  error(102, [node, property]);
};
var traps = {
  _c: trap(getContext, invalidSetter, false),
  add: trap(addChild),
  addProps: trap(addProps),
  address: trap(getAddress, invalidSetter, false),
  at: trap(getNode2),
  bubble: trap(bubble),
  clearErrors: trap(clearErrors),
  calm: trap(calm),
  config: trap(false),
  define: trap(define),
  disturb: trap(disturb),
  destroy: trap(destroy),
  extend: trap(extend$1),
  hydrate: trap(hydrate),
  index: trap(getIndex, setIndex, false),
  input: trap(input),
  each: trap(eachChild),
  emit: trap(emit),
  find: trap(find),
  on: trap(on),
  off: trap(off),
  parent: trap(false, setParent),
  plugins: trap(false),
  remove: trap(removeChild),
  root: trap(getRoot, invalidSetter, false),
  reset: trap(resetValue),
  resetConfig: trap(resetConfig),
  setErrors: trap(setErrors),
  submit: trap(submit),
  t: trap(text$1),
  use: trap(use),
  name: trap(getName, false, false),
  walk: trap(walkTree)
};
function createTraps() {
  return new Map(Object.entries(traps));
}
function trap(getter, setter, curryGetter = true) {
  return {
    get: getter ? (node, context) => curryGetter ? (...args) => getter(node, context, ...args) : getter(node, context) : false,
    set: setter !== void 0 ? setter : invalidSetter.bind(null)
  };
}
function createHooks() {
  const hooks = /* @__PURE__ */ new Map();
  return new Proxy(hooks, {
    get(_, property) {
      if (!hooks.has(property)) {
        hooks.set(property, createDispatcher());
      }
      return hooks.get(property);
    }
  });
}
var nameCount = 0;
var idCount = 0;
function createName(options2) {
  var _a, _b;
  if (((_a = options2.parent) == null ? void 0 : _a.type) === "list")
    return useIndex;
  return options2.name || `${((_b = options2.props) == null ? void 0 : _b.type) || "input"}_${++nameCount}`;
}
function createValue(options2) {
  if (options2.type === "group") {
    return init(
      options2.value && typeof options2.value === "object" && !Array.isArray(options2.value) ? options2.value : {}
    );
  } else if (options2.type === "list") {
    return init(Array.isArray(options2.value) ? options2.value : []);
  }
  return options2.value;
}
function input(node, context, value, async = true) {
  context._value = validateInput(node, node.hook.input.dispatch(value));
  node.emit("input", context._value);
  if (node.isCreated && node.type === "input" && eq(context._value, context.value) && !node.props.mergeStrategy) {
    node.emit("commitRaw", context.value);
    return context.settled;
  }
  if (context.isSettled)
    node.disturb();
  if (async) {
    if (context._tmo)
      clearTimeout(context._tmo);
    context._tmo = setTimeout(
      commit,
      node.props.delay,
      node,
      context
    );
  } else {
    commit(node, context);
  }
  return context.settled;
}
function validateInput(node, value) {
  switch (node.type) {
    case "input":
      break;
    case "group":
      if (!value || typeof value !== "object")
        error(107, [node, value]);
      break;
    case "list":
      if (!Array.isArray(value))
        error(108, [node, value]);
      break;
  }
  return value;
}
function commit(node, context, calm2 = true, hydrate2 = true) {
  context._value = context.value = node.hook.commit.dispatch(context._value);
  if (node.type !== "input" && hydrate2)
    node.hydrate();
  node.emit("commitRaw", context.value);
  node.emit("commit", context.value);
  if (calm2)
    node.calm();
}
function partial(context, { name, value, from }) {
  if (Object.isFrozen(context._value))
    return;
  if (isList(context)) {
    const insert = value === valueRemoved ? [] : value === valueMoved && typeof from === "number" ? context._value.splice(from, 1) : [value];
    context._value.splice(
      name,
      value === valueMoved || from === valueInserted ? 0 : 1,
      ...insert
    );
    return;
  }
  if (value !== valueRemoved) {
    context._value[name] = value;
  } else {
    delete context._value[name];
  }
}
function hydrate(node, context) {
  const _value = context._value;
  if (node.type === "list" && node.sync)
    syncListNodes(node, context);
  context.children.forEach((child) => {
    if (typeof _value !== "object")
      return;
    if (child.name in _value) {
      const childValue = child.type !== "input" || _value[child.name] && typeof _value[child.name] === "object" ? init(_value[child.name]) : _value[child.name];
      if (!child.isSettled || (!isObject$1(childValue) || child.props.mergeStrategy) && eq(childValue, child._value))
        return;
      child.input(childValue, false);
    } else {
      if (node.type !== "list" || typeof child.name === "number") {
        partial(context, { name: child.name, value: child.value });
      }
      if (!_value.__init) {
        if (child.type === "group")
          child.input({}, false);
        else if (child.type === "list")
          child.input([], false);
        else
          child.input(void 0, false);
      }
    }
  });
  return node;
}
function syncListNodes(node, context) {
  const _value = node._value;
  if (!Array.isArray(_value))
    return;
  const newChildren = [];
  const unused = new Set(context.children);
  const placeholderValues = /* @__PURE__ */ new Map();
  _value.forEach((value, i) => {
    if (context.children[i] && context.children[i]._value === value) {
      newChildren.push(context.children[i]);
      unused.delete(context.children[i]);
    } else {
      newChildren.push(null);
      const indexes = placeholderValues.get(value) || [];
      indexes.push(i);
      placeholderValues.set(value, indexes);
    }
  });
  if (unused.size && placeholderValues.size) {
    unused.forEach((child) => {
      if (placeholderValues.has(child._value)) {
        const indexes = placeholderValues.get(child._value);
        const index = indexes.shift();
        newChildren[index] = child;
        unused.delete(child);
        if (!indexes.length)
          placeholderValues.delete(child._value);
      }
    });
  }
  const emptyIndexes = [];
  placeholderValues.forEach((indexes) => {
    emptyIndexes.push(...indexes);
  });
  while (unused.size && emptyIndexes.length) {
    const child = unused.values().next().value;
    const index = emptyIndexes.shift();
    if (index === void 0)
      break;
    newChildren[index] = child;
    unused.delete(child);
  }
  emptyIndexes.forEach((index, value) => {
    newChildren[index] = createPlaceholder({ value });
  });
  if (unused.size) {
    unused.forEach((child) => {
      if (!("__FKP" in child)) {
        const parent = child._c.parent;
        if (!parent || isPlaceholder(parent))
          return;
        parent.ledger.unmerge(child);
        child._c.parent = null;
        child.destroy();
      }
    });
  }
  context.children = newChildren;
}
function disturb(node, context) {
  var _a;
  if (context._d <= 0) {
    context.isSettled = false;
    node.emit("settled", false, false);
    context.settled = new Promise((resolve2) => {
      context._resolve = resolve2;
    });
    if (node.parent)
      (_a = node.parent) == null ? void 0 : _a.disturb();
  }
  context._d++;
  return node;
}
function calm(node, context, value) {
  var _a;
  if (value !== void 0 && node.type !== "input") {
    partial(context, value);
    const shouldHydrate = !!(node.config.mergeStrategy && node.config.mergeStrategy[value.name]);
    return commit(node, context, true, shouldHydrate);
  }
  if (context._d > 0)
    context._d--;
  if (context._d === 0) {
    context.isSettled = true;
    node.emit("settled", true, false);
    if (node.parent)
      (_a = node.parent) == null ? void 0 : _a.calm({ name: node.name, value: context.value });
    if (context._resolve)
      context._resolve(context.value);
  }
}
function destroy(node, context) {
  node.emit("destroying", node);
  node.store.filter(() => false);
  if (node.parent) {
    node.parent.remove(node);
  }
  deregister(node);
  node.emit("destroyed", node);
  context._e.flush();
  context._value = context.value = void 0;
  for (const property in context.context) {
    delete context.context[property];
  }
  context.plugins.clear();
  context.context = null;
}
function define(node, context, definition) {
  context.type = definition.type;
  const clonedDef = clone(definition);
  node.props.__propDefs = mergeProps(
    node.props.__propDefs ?? [],
    (clonedDef == null ? void 0 : clonedDef.props) || []
  );
  clonedDef.props = node.props.__propDefs;
  context.props.definition = clonedDef;
  context.value = context._value = createValue({
    type: node.type,
    value: context.value
  });
  if (definition.forceTypeProp) {
    if (node.props.type)
      node.props.originalType = node.props.type;
    context.props.type = definition.forceTypeProp;
  }
  if (definition.family) {
    context.props.family = definition.family;
  }
  if (definition.features) {
    definition.features.forEach((feature) => feature(node));
  }
  if (definition.props) {
    node.addProps(definition.props);
  }
  node.emit("defined", definition);
}
function addProps(node, context, props) {
  const propNames = Array.isArray(props) ? props : Object.keys(props);
  const defaults2 = !Array.isArray(props) ? propNames.reduce((defaults22, name) => {
    if ("default" in props[name]) {
      defaults22[name] = props[name].default;
    }
    return defaults22;
  }, {}) : {};
  if (node.props.attrs) {
    const attrs = { ...node.props.attrs };
    node.props._emit = false;
    for (const attr in attrs) {
      const camelName = camel(attr);
      if (propNames.includes(camelName)) {
        node.props[camelName] = attrs[attr];
        delete attrs[attr];
      }
    }
    if (!Array.isArray(props)) {
      propNames.forEach((prop) => {
        if ("default" in props[prop] && node.props[prop] === void 0) {
          node.props[prop] = defaults2[prop];
        }
      });
    }
    const initial = cloneAny(context._value);
    node.props.initial = node.type !== "input" ? init(initial) : initial;
    node.props._emit = true;
    node.props.attrs = attrs;
  }
  const mergedProps = mergeProps(node.props.__propDefs ?? [], props);
  if (node.props.definition) {
    node.props.definition.props = mergedProps;
  }
  node.props.__propDefs = mergedProps;
  node.emit("added-props", props);
  return node;
}
function toPropsObj(props) {
  return !Array.isArray(props) ? props : props.reduce((props2, prop) => {
    props2[prop] = {};
    return props2;
  }, {});
}
function mergeProps(props, newProps) {
  if (Array.isArray(props) && Array.isArray(newProps))
    return props.concat(newProps);
  return extend$2(toPropsObj(props), toPropsObj(newProps));
}
function addChild(parent, parentContext, child, listIndex) {
  if (parent.type === "input")
    error(100, parent);
  if (child.parent && child.parent !== parent) {
    child.parent.remove(child);
  }
  if (!parentContext.children.includes(child)) {
    if (listIndex !== void 0 && parent.type === "list") {
      const existingNode = parentContext.children[listIndex];
      if (existingNode && "__FKP" in existingNode) {
        child._c.uid = existingNode.uid;
        parentContext.children.splice(listIndex, 1, child);
      } else {
        parentContext.children.splice(listIndex, 0, child);
      }
      if (Array.isArray(parent.value) && parent.value.length < parentContext.children.length) {
        parent.disturb().calm({
          name: listIndex,
          value: child.value,
          from: valueInserted
        });
      }
    } else {
      parentContext.children.push(child);
    }
    if (!child.isSettled)
      parent.disturb();
  }
  if (child.parent !== parent) {
    child.parent = parent;
    if (child.parent !== parent) {
      parent.remove(child);
      child.parent.add(child);
      return parent;
    }
  } else {
    child.use(parent.plugins);
  }
  commit(parent, parentContext, false);
  parent.ledger.merge(child);
  parent.emit("child", child);
  return parent;
}
function setParent(child, context, _property, parent) {
  if (isNode(parent)) {
    if (child.parent && child.parent !== parent) {
      child.parent.remove(child);
    }
    context.parent = parent;
    child.resetConfig();
    !parent.children.includes(child) ? parent.add(child) : child.use(parent.plugins);
    return true;
  }
  if (parent === null) {
    context.parent = null;
    return true;
  }
  return false;
}
function removeChild(node, context, child) {
  const childIndex = context.children.indexOf(child);
  if (childIndex !== -1) {
    if (child.isSettled)
      node.disturb();
    context.children.splice(childIndex, 1);
    let preserve = undefine(child.props.preserve);
    let parent = child.parent;
    while (preserve === void 0 && parent) {
      preserve = undefine(parent.props.preserve);
      parent = parent.parent;
    }
    if (!preserve) {
      node.calm({
        name: node.type === "list" ? childIndex : child.name,
        value: valueRemoved
      });
    } else {
      node.calm();
    }
    child.parent = null;
    child.config._rmn = child;
  }
  node.ledger.unmerge(child);
  node.emit("childRemoved", child);
  return node;
}
function eachChild(_node, context, callback) {
  context.children.forEach((child) => !("__FKP" in child) && callback(child));
}
function walkTree(_node, context, callback, stopIfFalse = false, skipSubtreeOnFalse = false) {
  context.children.some((child) => {
    if ("__FKP" in child)
      return false;
    const val = callback(child);
    if (stopIfFalse && val === false)
      return true;
    if (skipSubtreeOnFalse && val === false)
      return false;
    return child.walk(callback, stopIfFalse, skipSubtreeOnFalse);
  });
}
function resetConfig(node, context) {
  const parent = node.parent || void 0;
  context.config = createConfig2(node.config._t, parent);
  node.walk((n) => n.resetConfig());
}
function use(node, context, plugin2, run2 = true, library = true) {
  if (Array.isArray(plugin2) || plugin2 instanceof Set) {
    plugin2.forEach((p2) => use(node, context, p2));
    return node;
  }
  if (!context.plugins.has(plugin2)) {
    if (library && typeof plugin2.library === "function")
      plugin2.library(node);
    if (run2 && plugin2(node) !== false) {
      context.plugins.add(plugin2);
      node.children.forEach((child) => child.use(plugin2));
    }
  }
  return node;
}
function setIndex(node, _context, _property, setIndex2) {
  if (isNode(node.parent)) {
    const children = node.parent.children;
    const index = setIndex2 >= children.length ? children.length - 1 : setIndex2 < 0 ? 0 : setIndex2;
    const oldIndex = children.indexOf(node);
    if (oldIndex === -1)
      return false;
    children.splice(oldIndex, 1);
    children.splice(index, 0, node);
    node.parent.children = children;
    if (node.parent.type === "list")
      node.parent.disturb().calm({ name: index, value: valueMoved, from: oldIndex });
    return true;
  }
  return false;
}
function getIndex(node) {
  if (node.parent) {
    const index = [...node.parent.children].indexOf(node);
    return index === -1 ? node.parent.children.length : index;
  }
  return -1;
}
function getContext(_node, context) {
  return context;
}
function getName(node, context) {
  var _a;
  if (((_a = node.parent) == null ? void 0 : _a.type) === "list")
    return node.index;
  return context.name !== useIndex ? context.name : node.index;
}
function getAddress(node, context) {
  return context.parent ? context.parent.address.concat([node.name]) : [node.name];
}
function getNode2(node, _context, locator) {
  const address = typeof locator === "string" ? locator.split(node.config.delimiter) : locator;
  if (!address.length)
    return void 0;
  const first = address[0];
  let pointer = node.parent;
  if (!pointer) {
    if (String(address[0]) === String(node.name))
      address.shift();
    pointer = node;
  }
  if (first === "$parent")
    address.shift();
  while (pointer && address.length) {
    const name = address.shift();
    switch (name) {
      case "$root":
        pointer = node.root;
        break;
      case "$parent":
        pointer = pointer.parent;
        break;
      case "$self":
        pointer = node;
        break;
      default:
        pointer = pointer.children.find(
          (c) => !("__FKP" in c) && String(c.name) === String(name)
        ) || select$1(pointer, name);
    }
  }
  return pointer || void 0;
}
function select$1(node, selector) {
  const matches3 = String(selector).match(/^(find)\((.*)\)$/);
  if (matches3) {
    const [, action, argStr] = matches3;
    const args = argStr.split(",").map((arg) => arg.trim());
    switch (action) {
      case "find":
        return node.find(args[0], args[1]);
      default:
        return void 0;
    }
  }
  return void 0;
}
function find(node, _context, searchTerm, searcher) {
  return bfs(node, searchTerm, searcher);
}
function bfs(tree, searchValue, searchGoal = "name") {
  const search = typeof searchGoal === "string" ? (n) => n[searchGoal] == searchValue : searchGoal;
  const stack2 = [tree];
  while (stack2.length) {
    const node = stack2.shift();
    if ("__FKP" in node)
      continue;
    if (search(node, searchValue))
      return node;
    stack2.push(...node.children);
  }
  return void 0;
}
function getRoot(n) {
  let node = n;
  while (node.parent) {
    node = node.parent;
  }
  return node;
}
function createConfig2(target2 = {}, parent) {
  let node = void 0;
  return new Proxy(target2, {
    get(...args) {
      const prop = args[1];
      if (prop === "_t")
        return target2;
      const localValue = Reflect.get(...args);
      if (localValue !== void 0)
        return localValue;
      if (parent) {
        const parentVal = parent.config[prop];
        if (parentVal !== void 0)
          return parentVal;
      }
      if (target2.rootConfig && typeof prop === "string") {
        const rootValue = target2.rootConfig[prop];
        if (rootValue !== void 0)
          return rootValue;
      }
      if (prop === "delay" && (node == null ? void 0 : node.type) === "input")
        return 20;
      return defaultConfig$1[prop];
    },
    set(...args) {
      const prop = args[1];
      const value = args[2];
      if (prop === "_n") {
        node = value;
        if (target2.rootConfig)
          target2.rootConfig._add(node);
        return true;
      }
      if (prop === "_rmn") {
        if (target2.rootConfig)
          target2.rootConfig._rm(node);
        node = void 0;
        return true;
      }
      if (!eq(target2[prop], value, false)) {
        const didSet = Reflect.set(...args);
        if (node) {
          node.emit(`config:${prop}`, value, false);
          configChange(node, prop, value);
          node.walk((n) => configChange(n, prop, value), false, true);
        }
        return didSet;
      }
      return true;
    }
  });
}
function text$1(node, _context, key, type = "ui") {
  const fragment2 = typeof key === "string" ? { key, value: key, type } : key;
  const value = node.hook.text.dispatch(fragment2);
  node.emit("text", value, false);
  return value.value;
}
function submit(node) {
  const name = node.name;
  do {
    if (node.props.isForm === true)
      break;
    if (!node.parent)
      error(106, name);
    node = node.parent;
  } while (node);
  if (node.props.id) {
    submitForm(node.props.id, node.props.__root);
  }
}
function resetValue(node, _context, value) {
  return reset(node, value);
}
function setErrors(node, _context, localErrors, childErrors) {
  const sourceKey = `${node.name}-set`;
  const errors2 = node.hook.setErrors.dispatch({ localErrors, childErrors });
  createMessages(node, errors2.localErrors, errors2.childErrors).forEach(
    (errors22) => {
      node.store.apply(errors22, (message3) => message3.meta.source === sourceKey);
    }
  );
  return node;
}
function clearErrors(node, _context, clearChildErrors = true, sourceKey) {
  node.store.filter((m) => {
    return !(sourceKey === void 0 || m.meta.source === sourceKey);
  }, "error");
  if (clearChildErrors) {
    sourceKey = sourceKey || `${node.name}-set`;
    node.walk((child) => {
      child.store.filter((message3) => {
        return !(message3.type === "error" && message3.meta && message3.meta.source === sourceKey);
      });
    });
  }
  return node;
}
function createProps(initial) {
  const props = {
    initial: typeof initial === "object" ? cloneAny(initial) : initial
  };
  let node;
  let isEmitting = true;
  let propDefs = {};
  return new Proxy(props, {
    get(...args) {
      var _a, _b, _c, _d;
      const [_t, prop] = args;
      let val;
      if (has(props, prop)) {
        val = Reflect.get(...args);
        if ((_a = propDefs[prop]) == null ? void 0 : _a.boolean)
          val = boolGetter(val);
      } else if (node && typeof prop === "string" && node.config[prop] !== void 0) {
        val = node.config[prop];
        if (prop === "mergeStrategy" && (node == null ? void 0 : node.type) === "input" && isRecord(val) && node.name in val) {
          val = val[node.name];
        }
      } else {
        val = (_b = propDefs[prop]) == null ? void 0 : _b.default;
      }
      const getter = (_c = propDefs[prop]) == null ? void 0 : _c.getter;
      if ((_d = propDefs[prop]) == null ? void 0 : _d.boolean)
        val = !!val;
      return getter ? getter(val, node) : val;
    },
    set(target2, property, originalValue, receiver) {
      var _a;
      if (property === "_n") {
        node = originalValue;
        return true;
      }
      if (property === "_emit") {
        isEmitting = originalValue;
        return true;
      }
      let { prop, value } = node.hook.prop.dispatch({
        prop: property,
        value: originalValue
      });
      const setter = (_a = propDefs[prop]) == null ? void 0 : _a.setter;
      value = setter ? setter(value, node) : value;
      if (!eq(props[prop], value, false) || typeof value === "object") {
        const didSet = Reflect.set(target2, prop, value, receiver);
        if (prop === "__propDefs")
          propDefs = toPropsObj(value);
        if (isEmitting) {
          node.emit("prop", { prop, value });
          if (typeof prop === "string")
            node.emit(`prop:${prop}`, value);
        }
        return didSet;
      }
      return true;
    }
  });
}
function extend$1(node, context, property, trap2) {
  context.traps.set(property, trap2);
  return node;
}
function findDefinition(node, plugins) {
  if (node.props.definition)
    return node.define(node.props.definition);
  for (const plugin2 of plugins) {
    if (node.props.definition)
      return;
    if (typeof plugin2.library === "function") {
      plugin2.library(node);
    }
  }
}
function createContext(options2) {
  const value = createValue(options2);
  const config2 = createConfig2(options2.config || {}, options2.parent);
  return {
    _d: 0,
    _e: createEmitter(),
    uid: Symbol(),
    _resolve: false,
    _tmo: false,
    _value: value,
    children: dedupe(options2.children || []),
    config: config2,
    hook: createHooks(),
    isCreated: false,
    isSettled: true,
    ledger: createLedger(),
    name: createName(options2),
    parent: options2.parent || null,
    plugins: /* @__PURE__ */ new Set(),
    props: createProps(value),
    settled: Promise.resolve(value),
    store: createStore(true),
    sync: options2.sync || false,
    traps: createTraps(),
    type: options2.type || "input",
    value
  };
}
function nodeInit(node, options2) {
  var _a, _b;
  const hasInitialId = (_a = options2.props) == null ? void 0 : _a.id;
  if (!hasInitialId)
    (_b = options2.props) == null ? true : delete _b.id;
  node.ledger.init(node.store._n = node.props._n = node.config._n = node);
  node.props._emit = false;
  Object.assign(
    node.props,
    hasInitialId ? {} : { id: `input_${idCount++}` },
    options2.props ?? {}
  );
  node.props._emit = true;
  findDefinition(
    node,
    /* @__PURE__ */ new Set([
      ...options2.plugins || [],
      ...node.parent ? node.parent.plugins : []
    ])
  );
  if (options2.plugins) {
    for (const plugin2 of options2.plugins) {
      use(node, node._c, plugin2, true, false);
    }
  }
  node.each((child) => node.add(child));
  if (node.parent)
    node.parent.add(node, options2.index);
  if (node.type === "input" && node.children.length)
    error(100, node);
  input(node, node._c, node._value, false);
  node.store.release();
  if (hasInitialId)
    register$1(node);
  node.emit("created", node);
  node.isCreated = true;
  return node;
}
function createPlaceholder(options2) {
  return {
    __FKP: true,
    uid: Symbol(),
    name: (options2 == null ? void 0 : options2.name) ?? `p_${nameCount++}`,
    value: (options2 == null ? void 0 : options2.value) ?? null,
    _value: (options2 == null ? void 0 : options2.value) ?? null,
    type: (options2 == null ? void 0 : options2.type) ?? "input",
    props: {},
    use: () => {
    },
    input(value) {
      this._value = value;
      this.value = value;
      return Promise.resolve();
    },
    isSettled: true
  };
}
function isPlaceholder(node) {
  return "__FKP" in node;
}
function createNode(options2) {
  const ops = options2 || {};
  const context = createContext(ops);
  const node = new Proxy(context, {
    get(...args) {
      const [, property] = args;
      if (property === "__FKNode__")
        return true;
      const trap2 = context.traps.get(property);
      if (trap2 && trap2.get)
        return trap2.get(node, context);
      return Reflect.get(...args);
    },
    set(...args) {
      const [, property, value] = args;
      const trap2 = context.traps.get(property);
      if (trap2 && trap2.set)
        return trap2.set(node, context, property, value);
      return Reflect.set(...args);
    }
  });
  return nodeInit(node, ops);
}
function isDOM(node) {
  return typeof node !== "string" && has(node, "$el");
}
function isComponent(node) {
  return typeof node !== "string" && has(node, "$cmp");
}
function isConditional(node) {
  if (!node || typeof node === "string")
    return false;
  return has(node, "if") && has(node, "then");
}
function isSugar(node) {
  return typeof node !== "string" && "$formkit" in node;
}
function sugar(node) {
  if (typeof node === "string") {
    return {
      $el: "text",
      children: node
    };
  }
  if (isSugar(node)) {
    const {
      $formkit: type,
      for: iterator,
      if: condition,
      children,
      bind: bind2,
      ...props
    } = node;
    return Object.assign(
      {
        $cmp: "FormKit",
        props: { ...props, type }
      },
      condition ? { if: condition } : {},
      iterator ? { for: iterator } : {},
      children ? { children } : {},
      bind2 ? { bind: bind2 } : {}
    );
  }
  return node;
}
function compile(expr) {
  let provideTokens;
  const requirements = /* @__PURE__ */ new Set();
  const x = function expand(operand, tokens) {
    return typeof operand === "function" ? operand(tokens) : operand;
  };
  const operatorRegistry = [
    {
      "&&": (l, r, t) => x(l, t) && x(r, t),
      "||": (l, r, t) => x(l, t) || x(r, t)
    },
    {
      "===": (l, r, t) => !!(x(l, t) === x(r, t)),
      "!==": (l, r, t) => !!(x(l, t) !== x(r, t)),
      "==": (l, r, t) => !!(x(l, t) == x(r, t)),
      "!=": (l, r, t) => !!(x(l, t) != x(r, t)),
      ">=": (l, r, t) => !!(x(l, t) >= x(r, t)),
      "<=": (l, r, t) => !!(x(l, t) <= x(r, t)),
      ">": (l, r, t) => !!(x(l, t) > x(r, t)),
      "<": (l, r, t) => !!(x(l, t) < x(r, t))
    },
    {
      "+": (l, r, t) => x(l, t) + x(r, t),
      "-": (l, r, t) => x(l, t) - x(r, t)
    },
    {
      "*": (l, r, t) => x(l, t) * x(r, t),
      "/": (l, r, t) => x(l, t) / x(r, t),
      "%": (l, r, t) => x(l, t) % x(r, t)
    }
  ];
  const operatorSymbols = operatorRegistry.reduce((s, g) => {
    return s.concat(Object.keys(g));
  }, []);
  const operatorChars = new Set(operatorSymbols.map((key) => key.charAt(0)));
  function getOp(symbols, char, p2, expression) {
    const candidates = symbols.filter((s) => s.startsWith(char));
    if (!candidates.length)
      return false;
    return candidates.find((symbol2) => {
      if (expression.length >= p2 + symbol2.length) {
        const nextChars = expression.substring(p2, p2 + symbol2.length);
        if (nextChars === symbol2)
          return symbol2;
      }
      return false;
    });
  }
  function getStep(p2, expression, direction = 1) {
    let next = direction ? expression.substring(p2 + 1).trim() : expression.substring(0, p2).trim();
    if (!next.length)
      return -1;
    if (!direction) {
      const reversed = next.split("").reverse();
      const start = reversed.findIndex((char2) => operatorChars.has(char2));
      next = reversed.slice(start).join("");
    }
    const char = next[0];
    return operatorRegistry.findIndex((operators) => {
      const symbols = Object.keys(operators);
      return !!getOp(symbols, char, 0, next);
    });
  }
  function getTail(pos, expression) {
    let tail = "";
    const length3 = expression.length;
    let depth = 0;
    for (let p2 = pos; p2 < length3; p2++) {
      const char = expression.charAt(p2);
      if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
      } else if (depth === 0 && char === " ") {
        continue;
      }
      if (depth === 0 && getOp(operatorSymbols, char, p2, expression)) {
        return [tail, p2 - 1];
      } else {
        tail += char;
      }
    }
    return [tail, expression.length - 1];
  }
  function parseLogicals(expression, step2 = 0) {
    const operators = operatorRegistry[step2];
    const length3 = expression.length;
    const symbols = Object.keys(operators);
    let depth = 0;
    let quote = false;
    let op = null;
    let operand = "";
    let left = null;
    let operation;
    let lastChar = "";
    let char = "";
    let parenthetical = "";
    let parenQuote = "";
    let startP = 0;
    const addTo = (depth2, char2) => {
      depth2 ? parenthetical += char2 : operand += char2;
    };
    for (let p2 = 0; p2 < length3; p2++) {
      lastChar = char;
      char = expression.charAt(p2);
      if ((char === "'" || char === '"') && lastChar !== "\\" && (depth === 0 && !quote || depth && !parenQuote)) {
        if (depth) {
          parenQuote = char;
        } else {
          quote = char;
        }
        addTo(depth, char);
        continue;
      } else if (quote && (char !== quote || lastChar === "\\") || parenQuote && (char !== parenQuote || lastChar === "\\")) {
        addTo(depth, char);
        continue;
      } else if (quote === char) {
        quote = false;
        addTo(depth, char);
        continue;
      } else if (parenQuote === char) {
        parenQuote = false;
        addTo(depth, char);
        continue;
      } else if (char === " ") {
        continue;
      } else if (char === "(") {
        if (depth === 0) {
          startP = p2;
        } else {
          parenthetical += char;
        }
        depth++;
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          const fn = typeof operand === "string" && operand.startsWith("$") ? operand : void 0;
          const hasTail = fn && expression.charAt(p2 + 1) === ".";
          let tail = "";
          if (hasTail) {
            [tail, p2] = getTail(p2 + 2, expression);
          }
          const lStep = op ? step2 : getStep(startP, expression, 0);
          const rStep = getStep(p2, expression);
          if (lStep === -1 && rStep === -1) {
            operand = evaluate(parenthetical, -1, fn, tail);
            if (typeof operand === "string")
              operand = parenthetical;
          } else if (op && (lStep >= rStep || rStep === -1) && step2 === lStep) {
            left = op.bind(null, evaluate(parenthetical, -1, fn, tail));
            op = null;
            operand = "";
          } else if (rStep > lStep && step2 === rStep) {
            operand = evaluate(parenthetical, -1, fn, tail);
          } else {
            operand += `(${parenthetical})${hasTail ? `.${tail}` : ""}`;
          }
          parenthetical = "";
        } else {
          parenthetical += char;
        }
      } else if (depth === 0 && (operation = getOp(symbols, char, p2, expression))) {
        if (p2 === 0) {
          error(103, [operation, expression]);
        }
        p2 += operation.length - 1;
        if (p2 === expression.length - 1) {
          error(104, [operation, expression]);
        }
        if (!op) {
          if (left) {
            op = operators[operation].bind(null, evaluate(left, step2));
            left = null;
          } else {
            op = operators[operation].bind(null, evaluate(operand, step2));
            operand = "";
          }
        } else if (operand) {
          left = op.bind(null, evaluate(operand, step2));
          op = operators[operation].bind(null, left);
          operand = "";
        }
        continue;
      } else {
        addTo(depth, char);
      }
    }
    if (operand && op) {
      op = op.bind(null, evaluate(operand, step2));
    }
    op = !op && left ? left : op;
    if (!op && operand) {
      op = (v, t) => {
        return typeof v === "function" ? v(t) : v;
      };
      op = op.bind(null, evaluate(operand, step2));
    }
    if (!op && !operand) {
      error(105, expression);
    }
    return op;
  }
  function evaluate(operand, step2, fnToken, tail) {
    if (fnToken) {
      const fn = evaluate(fnToken, operatorRegistry.length);
      let userFuncReturn;
      let tailCall = tail ? compile(`$${tail}`) : false;
      if (typeof fn === "function") {
        const args = parseArgs(String(operand)).map(
          (arg) => evaluate(arg, -1)
        );
        return (tokens) => {
          const userFunc = fn(tokens);
          if (typeof userFunc !== "function") {
            warn(150, fnToken);
            return userFunc;
          }
          userFuncReturn = userFunc(
            ...args.map(
              (arg) => typeof arg === "function" ? arg(tokens) : arg
            )
          );
          if (tailCall) {
            tailCall = tailCall.provide((subTokens) => {
              const rootTokens = provideTokens(subTokens);
              const t = subTokens.reduce(
                (tokenSet, token3) => {
                  const isTail = token3 === tail || (tail == null ? void 0 : tail.startsWith(`${token3}(`));
                  if (isTail) {
                    const value = getAt(userFuncReturn, token3);
                    tokenSet[token3] = () => value;
                  } else {
                    tokenSet[token3] = rootTokens[token3];
                  }
                  return tokenSet;
                },
                {}
              );
              return t;
            });
          }
          return tailCall ? tailCall() : userFuncReturn;
        };
      }
    } else if (typeof operand === "string") {
      if (operand === "true")
        return true;
      if (operand === "false")
        return false;
      if (operand === "undefined")
        return void 0;
      if (isQuotedString(operand))
        return rmEscapes(operand.substring(1, operand.length - 1));
      if (!isNaN(+operand))
        return Number(operand);
      if (step2 < operatorRegistry.length - 1) {
        return parseLogicals(operand, step2 + 1);
      } else {
        if (operand.startsWith("$")) {
          const cleaned = operand.substring(1);
          requirements.add(cleaned);
          return function getToken(tokens) {
            return cleaned in tokens ? tokens[cleaned]() : void 0;
          };
        }
        return operand;
      }
    }
    return operand;
  }
  const compiled = parseLogicals(
    expr.startsWith("$:") ? expr.substring(2) : expr
  );
  const reqs = Array.from(requirements);
  function provide2(callback) {
    provideTokens = callback;
    return Object.assign(
      // @ts-ignore - @rollup/plugin-typescript doesn't like this
      compiled.bind(null, callback(reqs)),
      { provide: provide2 }
    );
  }
  return Object.assign(compiled, {
    provide: provide2
  });
}
function createClasses(propertyKey, node, sectionClassList) {
  if (!sectionClassList)
    return {};
  if (typeof sectionClassList === "string") {
    const classKeys = sectionClassList.split(" ");
    return classKeys.reduce(
      (obj, key) => Object.assign(obj, { [key]: true }),
      {}
    );
  } else if (typeof sectionClassList === "function") {
    return createClasses(
      propertyKey,
      node,
      sectionClassList(node, propertyKey)
    );
  }
  return sectionClassList;
}
function generateClassList(node, property, ...args) {
  const combinedClassList = args.reduce((finalClassList, currentClassList) => {
    if (!currentClassList)
      return handleNegativeClasses(finalClassList);
    const { $reset, ...classList } = currentClassList;
    if ($reset) {
      return handleNegativeClasses(classList);
    }
    return handleNegativeClasses(Object.assign(finalClassList, classList));
  }, {});
  return Object.keys(
    node.hook.classes.dispatch({ property, classes: combinedClassList }).classes
  ).filter((key) => combinedClassList[key]).join(" ") || null;
}
function handleNegativeClasses(classList) {
  const removalToken = "$remove:";
  let hasNegativeClassValue = false;
  const applicableClasses = Object.keys(classList).filter((className) => {
    if (classList[className] && className.startsWith(removalToken)) {
      hasNegativeClassValue = true;
    }
    return classList[className];
  });
  if (applicableClasses.length > 1 && hasNegativeClassValue) {
    const negativeClasses = applicableClasses.filter((className) => className.startsWith(removalToken));
    negativeClasses.map((negativeClass) => {
      const targetClass = negativeClass.substring(removalToken.length);
      classList[targetClass] = false;
      classList[negativeClass] = false;
    });
  }
  return classList;
}
function setErrors2(id, localErrors, childErrors) {
  const node = getNode(id);
  if (node) {
    node.setErrors(localErrors, childErrors);
  } else {
    warn(651, id);
  }
}
function clearErrors2(id, clearChildren = true) {
  const node = getNode(id);
  if (node) {
    node.clearErrors(clearChildren);
  } else {
    warn(652, id);
  }
}
var FORMKIT_VERSION = "1.6.5";
var revokedObservers = /* @__PURE__ */ new WeakSet();
function createObserver(node, dependencies) {
  const deps = dependencies || Object.assign(/* @__PURE__ */ new Map(), { active: false });
  const receipts = /* @__PURE__ */ new Map();
  const addDependency = function(event) {
    var _a;
    if (!deps.active)
      return;
    if (!deps.has(node))
      deps.set(node, /* @__PURE__ */ new Set());
    (_a = deps.get(node)) == null ? void 0 : _a.add(event);
  };
  const observeProps = function(props) {
    return new Proxy(props, {
      get(...args) {
        typeof args[1] === "string" && addDependency(`prop:${args[1]}`);
        return Reflect.get(...args);
      }
    });
  };
  const observeLedger = function(ledger) {
    return new Proxy(ledger, {
      get(...args) {
        if (args[1] === "value") {
          return (key) => {
            addDependency(`count:${key}`);
            return ledger.value(key);
          };
        }
        return Reflect.get(...args);
      }
    });
  };
  const observe = function(value, property) {
    if (isNode(value)) {
      return createObserver(value, deps);
    }
    if (property === "value")
      addDependency("commit");
    if (property === "_value")
      addDependency("input");
    if (property === "props")
      return observeProps(value);
    if (property === "ledger")
      return observeLedger(value);
    if (property === "children") {
      addDependency("child");
      addDependency("childRemoved");
    }
    return value;
  };
  const {
    proxy: observed,
    revoke
  } = Proxy.revocable(node, {
    get(...args) {
      switch (args[1]) {
        case "_node":
          return node;
        case "deps":
          return deps;
        case "watch":
          return (block, after, pos) => watch(observed, block, after, pos);
        case "observe":
          return () => {
            const old = new Map(deps);
            deps.clear();
            deps.active = true;
            return old;
          };
        case "stopObserve":
          return () => {
            const newDeps = new Map(deps);
            deps.active = false;
            return newDeps;
          };
        case "receipts":
          return receipts;
        case "kill":
          return () => {
            removeListeners(receipts);
            revokedObservers.add(args[2]);
            revoke();
            return void 0;
          };
      }
      const value = Reflect.get(...args);
      if (typeof value === "function") {
        return (...subArgs) => {
          const subValue = value(...subArgs);
          return observe(subValue, args[1]);
        };
      }
      return observe(value, args[1]);
    }
  });
  return observed;
}
function applyListeners(node, [toAdd, toRemove], callback, pos) {
  toAdd.forEach((events, depNode) => {
    events.forEach((event) => {
      node.receipts.has(depNode) || node.receipts.set(depNode, {});
      const events2 = node.receipts.get(depNode) ?? {};
      events2[event] = events2[event] ?? [];
      events2[event].push(depNode.on(event, callback, pos));
      node.receipts.set(depNode, events2);
    });
  });
  toRemove.forEach((events, depNode) => {
    events.forEach((event) => {
      if (node.receipts.has(depNode)) {
        const nodeReceipts = node.receipts.get(depNode);
        if (nodeReceipts && has(nodeReceipts, event)) {
          nodeReceipts[event].map(depNode.off);
          delete nodeReceipts[event];
          node.receipts.set(depNode, nodeReceipts);
        }
      }
    });
  });
}
function removeListeners(receipts) {
  receipts.forEach((events, node) => {
    for (const event in events) {
      events[event].map(node.off);
    }
  });
  receipts.clear();
}
function watch(node, block, after, pos) {
  const doAfterObservation = (res2) => {
    const newDeps = node.stopObserve();
    applyListeners(
      node,
      diffDeps(oldDeps, newDeps),
      () => watch(node, block, after, pos),
      pos
    );
    if (after)
      after(res2);
  };
  const oldDeps = new Map(node.deps);
  node.observe();
  const res = block(node);
  if (res instanceof Promise)
    res.then((val) => doAfterObservation(val));
  else
    doAfterObservation(res);
}
function diffDeps(previous, current) {
  const toAdd = /* @__PURE__ */ new Map();
  const toRemove = /* @__PURE__ */ new Map();
  current.forEach((events, node) => {
    if (!previous.has(node)) {
      toAdd.set(node, events);
    } else {
      const eventsToAdd = /* @__PURE__ */ new Set();
      const previousEvents = previous.get(node);
      events.forEach(
        (event) => !(previousEvents == null ? void 0 : previousEvents.has(event)) && eventsToAdd.add(event)
      );
      toAdd.set(node, eventsToAdd);
    }
  });
  previous.forEach((events, node) => {
    if (!current.has(node)) {
      toRemove.set(node, events);
    } else {
      const eventsToRemove = /* @__PURE__ */ new Set();
      const newEvents = current.get(node);
      events.forEach(
        (event) => !(newEvents == null ? void 0 : newEvents.has(event)) && eventsToRemove.add(event)
      );
      toRemove.set(node, eventsToRemove);
    }
  });
  return [toAdd, toRemove];
}
function isKilled(node) {
  return revokedObservers.has(node);
}
var accepted = function accepted2({ value }) {
  return ["yes", "on", "1", 1, true, "true"].includes(value);
};
accepted.skipEmpty = false;
var accepted_default = accepted;
var date_after = function({ value }, compare = false) {
  const timestamp = Date.parse(compare || /* @__PURE__ */ new Date());
  const fieldValue = Date.parse(String(value));
  return isNaN(fieldValue) ? false : fieldValue > timestamp;
};
var date_after_default = date_after;
var alpha = function({ value }, set2 = "default") {
  const sets = {
    default: new RegExp("^\\p{L}+$", "u"),
    latin: /^[a-z]+$/i
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var alpha_default = alpha;
var alpha_spaces = function({ value }, set2 = "default") {
  const sets = {
    default: /^[\p{L} ]+$/u,
    latin: /^[a-z ]+$/i
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var alpha_spaces_default = alpha_spaces;
var alphanumeric = function({ value }, set2 = "default") {
  const sets = {
    default: /^[0-9\p{L}]+$/u,
    latin: /^[0-9a-z]+$/i
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var alphanumeric_default = alphanumeric;
var date_before = function({ value }, compare = false) {
  const timestamp = Date.parse(compare || /* @__PURE__ */ new Date());
  const fieldValue = Date.parse(String(value));
  return isNaN(fieldValue) ? false : fieldValue < timestamp;
};
var date_before_default = date_before;
var between = function between2({ value }, from, to) {
  if (!isNaN(value) && !isNaN(from) && !isNaN(to)) {
    const val = 1 * value;
    from = Number(from);
    to = Number(to);
    const [a, b] = from <= to ? [from, to] : [to, from];
    return val >= 1 * a && val <= 1 * b;
  }
  return false;
};
var between_default = between;
var hasConfirm = /(_confirm(?:ed)?)$/;
var confirm = function confirm2(node, address, comparison = "loose") {
  var _a;
  if (!address) {
    address = hasConfirm.test(node.name) ? node.name.replace(hasConfirm, "") : `${node.name}_confirm`;
  }
  const foreignValue = (_a = node.at(address)) == null ? void 0 : _a.value;
  return comparison === "strict" ? node.value === foreignValue : node.value == foreignValue;
};
var confirm_default = confirm;
var contains_alpha = function({ value }, set2 = "default") {
  const sets = {
    default: new RegExp("\\p{L}", "u"),
    latin: /[a-z]/i
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var contains_alpha_default = contains_alpha;
var contains_alpha_spaces = function({ value }, set2 = "default") {
  const sets = {
    default: /[\p{L} ]/u,
    latin: /[a-z ]/i
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var contains_alpha_spaces_default = contains_alpha_spaces;
var contains_alphanumeric = function({ value }, set2 = "default") {
  const sets = {
    default: /[0-9\p{L}]/u,
    latin: /[0-9a-z]/i
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var contains_alphanumeric_default = contains_alphanumeric;
var contains_lowercase = function({ value }, set2 = "default") {
  const sets = {
    default: new RegExp("\\p{Ll}", "u"),
    latin: /[a-z]/
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var contains_lowercase_default = contains_lowercase;
var contains_numeric = function number({ value }) {
  return /[0-9]/.test(String(value));
};
var contains_numeric_default = contains_numeric;
var contains_symbol = function({ value }) {
  return /[!-/:-@[-`{-~]/.test(String(value));
};
var contains_symbol_default = contains_symbol;
var contains_uppercase = function({ value }, set2 = "default") {
  const sets = {
    default: new RegExp("\\p{Lu}", "u"),
    latin: /[A-Z]/
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var contains_uppercase_default = contains_uppercase;
var date_between = function date_between2({ value }, dateA, dateB) {
  dateA = dateA instanceof Date ? dateA.getTime() : Date.parse(dateA);
  dateB = dateB instanceof Date ? dateB.getTime() : Date.parse(dateB);
  const compareTo = value instanceof Date ? value.getTime() : Date.parse(String(value));
  if (dateA && !dateB) {
    dateB = dateA;
    dateA = Date.now();
  } else if (!dateA || !compareTo) {
    return false;
  }
  return compareTo >= dateA && compareTo <= dateB;
};
var date_between_default = date_between;
var date_format = function date({ value }, format) {
  if (format && typeof format === "string") {
    return regexForFormat(format).test(String(value));
  }
  return !isNaN(Date.parse(String(value)));
};
var date_format_default = date_format;
var email = function email2({ value }) {
  const isEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return isEmail.test(String(value));
};
var email_default = email;
var ends_with = function ends_with2({ value }, ...stack2) {
  if (typeof value === "string" && stack2.length) {
    return stack2.some((item) => {
      return value.endsWith(item);
    });
  } else if (typeof value === "string" && stack2.length === 0) {
    return true;
  }
  return false;
};
var ends_with_default = ends_with;
var is = function is2({ value }, ...stack2) {
  return stack2.some((item) => {
    if (typeof item === "object") {
      return eq(item, value);
    }
    return item == value;
  });
};
var is_default = is;
var length = function length2({ value }, first = 0, second = Infinity) {
  first = parseInt(first);
  second = isNaN(parseInt(second)) ? Infinity : parseInt(second);
  const min3 = first <= second ? first : second;
  const max3 = second >= first ? second : first;
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length >= min3 && value.length <= max3;
  } else if (value && typeof value === "object") {
    const length3 = Object.keys(value).length;
    return length3 >= min3 && length3 <= max3;
  }
  return false;
};
var length_default = length;
var lowercase = function({ value }, set2 = "default") {
  const sets = {
    default: new RegExp("^\\p{Ll}+$", "u"),
    allow_non_alpha: /^[0-9\p{Ll}!-/:-@[-`{-~]+$/u,
    allow_numeric: /^[0-9\p{Ll}]+$/u,
    allow_numeric_dashes: /^[0-9\p{Ll}-]+$/u,
    latin: /^[a-z]+$/
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var lowercase_default = lowercase;
var matches = function matches2({ value }, ...stack2) {
  return stack2.some((pattern) => {
    if (typeof pattern === "string" && pattern.substr(0, 1) === "/" && pattern.substr(-1) === "/") {
      pattern = new RegExp(pattern.substr(1, pattern.length - 2));
    }
    if (pattern instanceof RegExp) {
      return pattern.test(String(value));
    }
    return pattern === value;
  });
};
var matches_default = matches;
var max = function max2({ value }, maximum = 10) {
  if (Array.isArray(value)) {
    return value.length <= maximum;
  }
  return Number(value) <= Number(maximum);
};
var max_default = max;
var min = function min2({ value }, minimum = 1) {
  if (Array.isArray(value)) {
    return value.length >= minimum;
  }
  return Number(value) >= Number(minimum);
};
var min_default = min;
var not = function not2({ value }, ...stack2) {
  return !stack2.some((item) => {
    if (typeof item === "object") {
      return eq(item, value);
    }
    return item === value;
  });
};
var not_default = not;
var number2 = function number3({ value }) {
  return !isNaN(value);
};
var number_default = number2;
var require_one = function(node, ...inputNames) {
  if (!empty(node.value))
    return true;
  const values = inputNames.map((name) => {
    var _a;
    return (_a = node.at(name)) == null ? void 0 : _a.value;
  });
  return values.some((value) => !empty(value));
};
require_one.skipEmpty = false;
var require_one_default = require_one;
var required = function required2({ value }, action = "default") {
  return action === "trim" && typeof value === "string" ? !empty(value.trim()) : !empty(value);
};
required.skipEmpty = false;
var required_default = required;
var starts_with = function starts_with2({ value }, ...stack2) {
  if (typeof value === "string" && stack2.length) {
    return stack2.some((item) => {
      return value.startsWith(item);
    });
  } else if (typeof value === "string" && stack2.length === 0) {
    return true;
  }
  return false;
};
var starts_with_default = starts_with;
var symbol = function({ value }) {
  return /^[!-/:-@[-`{-~]+$/.test(String(value));
};
var symbol_default = symbol;
var uppercase = function({ value }, set2 = "default") {
  const sets = {
    default: new RegExp("^\\p{Lu}+$", "u"),
    latin: /^[A-Z]+$/
  };
  const selectedSet = has(sets, set2) ? set2 : "default";
  return sets[selectedSet].test(String(value));
};
var uppercase_default = uppercase;
var url = function url2({ value }, ...stack2) {
  try {
    const protocols = stack2.length ? stack2 : ["http:", "https:"];
    const url3 = new URL(String(value));
    return protocols.includes(url3.protocol);
  } catch {
    return false;
  }
};
var url_default = url;
const defaultRules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accepted: accepted_default,
  alpha: alpha_default,
  alpha_spaces: alpha_spaces_default,
  alphanumeric: alphanumeric_default,
  between: between_default,
  confirm: confirm_default,
  contains_alpha: contains_alpha_default,
  contains_alpha_spaces: contains_alpha_spaces_default,
  contains_alphanumeric: contains_alphanumeric_default,
  contains_lowercase: contains_lowercase_default,
  contains_numeric: contains_numeric_default,
  contains_symbol: contains_symbol_default,
  contains_uppercase: contains_uppercase_default,
  date_after: date_after_default,
  date_before: date_before_default,
  date_between: date_between_default,
  date_format: date_format_default,
  email: email_default,
  ends_with: ends_with_default,
  is: is_default,
  length: length_default,
  lowercase: lowercase_default,
  matches: matches_default,
  max: max_default,
  min: min_default,
  not: not_default,
  number: number_default,
  require_one: require_one_default,
  required: required_default,
  starts_with: starts_with_default,
  symbol: symbol_default,
  uppercase: uppercase_default,
  url: url_default
}, Symbol.toStringTag, { value: "Module" }));
var validatingMessage = /* @__PURE__ */ createMessage({
  type: "state",
  blocking: true,
  visible: false,
  value: true,
  key: "validating"
});
function createValidationPlugin(baseRules = {}) {
  return function validationPlugin(node) {
    let propRules = cloneAny(node.props.validationRules || {});
    let availableRules = { ...baseRules, ...propRules };
    const state = { input: token$1(), rerun: null, isPassing: true };
    let validation = cloneAny(node.props.validation);
    node.on("prop:validation", ({ payload }) => reboot(payload, propRules));
    node.on(
      "prop:validationRules",
      ({ payload }) => reboot(validation, payload)
    );
    function reboot(newValidation, newRules) {
      var _a;
      if (eq(Object.keys(propRules || {}), Object.keys(newRules || {})) && eq(validation, newValidation))
        return;
      propRules = cloneAny(newRules);
      validation = cloneAny(newValidation);
      availableRules = { ...baseRules, ...propRules };
      (_a = node.props.parsedRules) == null ? void 0 : _a.forEach((validation2) => {
        removeMessage(validation2);
        removeListeners(validation2.observer.receipts);
        validation2.observer.kill();
      });
      node.store.filter(() => false, "validation");
      node.props.parsedRules = parseRules(newValidation, availableRules, node);
      state.isPassing = true;
      validate(node, node.props.parsedRules, state);
    }
    node.props.parsedRules = parseRules(validation, availableRules, node);
    validate(node, node.props.parsedRules, state);
  };
}
function validate(node, validations, state) {
  if (isKilled(node))
    return;
  state.input = token$1();
  node.store.set(
    /* @__PURE__ */ createMessage({
      key: "failing",
      value: !state.isPassing,
      visible: false
    })
  );
  state.isPassing = true;
  node.store.filter((message3) => !message3.meta.removeImmediately, "validation");
  validations.forEach(
    (validation) => validation.debounce && clearTimeout(validation.timer)
  );
  if (validations.length) {
    node.store.set(validatingMessage);
    run(0, validations, state, false, () => {
      node.store.remove(validatingMessage.key);
      node.store.set(
        /* @__PURE__ */ createMessage({
          key: "failing",
          value: !state.isPassing,
          visible: false
        })
      );
    });
  }
}
function run(current, validations, state, removeImmediately, complete) {
  const validation = validations[current];
  if (!validation)
    return complete();
  const node = validation.observer;
  if (isKilled(node))
    return;
  const currentRun = state.input;
  validation.state = null;
  function next(async, result) {
    if (state.input !== currentRun)
      return;
    state.isPassing = state.isPassing && !!result;
    validation.queued = false;
    const newDeps = node.stopObserve();
    const diff = diffDeps(validation.deps, newDeps);
    applyListeners(
      node,
      diff,
      function revalidate() {
        try {
          node.store.set(validatingMessage);
        } catch (e) {
        }
        validation.queued = true;
        if (state.rerun)
          clearTimeout(state.rerun);
        state.rerun = setTimeout(
          validate,
          0,
          node,
          validations,
          state
        );
      },
      "unshift"
      // We want these listeners to run before other events are emitted so the 'state.validating' will be reliable.
    );
    validation.deps = newDeps;
    validation.state = result;
    if (result === false) {
      createFailedMessage(validation, removeImmediately || async);
    } else {
      removeMessage(validation);
    }
    if (validations.length > current + 1) {
      const nextValidation = validations[current + 1];
      if ((result || nextValidation.force || !nextValidation.skipEmpty) && nextValidation.state === null) {
        nextValidation.queued = true;
      }
      run(current + 1, validations, state, removeImmediately || async, complete);
    } else {
      complete();
    }
  }
  if ((!empty(node.value) || !validation.skipEmpty) && (state.isPassing || validation.force)) {
    if (validation.queued) {
      runRule(validation, node, (result) => {
        result instanceof Promise ? result.then((r) => next(true, r)) : next(false, result);
      });
    } else {
      run(current + 1, validations, state, removeImmediately, complete);
    }
  } else if (empty(node.value) && validation.skipEmpty && state.isPassing) {
    node.observe();
    node.value;
    next(false, state.isPassing);
  } else {
    next(false, null);
  }
}
function runRule(validation, node, after) {
  if (validation.debounce) {
    validation.timer = setTimeout(() => {
      node.observe();
      after(validation.rule(node, ...validation.args));
    }, validation.debounce);
  } else {
    node.observe();
    after(validation.rule(node, ...validation.args));
  }
}
function removeMessage(validation) {
  const key = `rule_${validation.name}`;
  if (validation.messageObserver) {
    validation.messageObserver = validation.messageObserver.kill();
  }
  if (has(validation.observer.store, key)) {
    validation.observer.store.remove(key);
  }
}
function createFailedMessage(validation, removeImmediately) {
  const node = validation.observer;
  if (isKilled(node))
    return;
  if (!validation.messageObserver) {
    validation.messageObserver = createObserver(node._node);
  }
  validation.messageObserver.watch(
    (node2) => {
      const i18nArgs = createI18nArgs(
        node2,
        validation
      );
      return i18nArgs;
    },
    (i18nArgs) => {
      const customMessage = createCustomMessage(node, validation, i18nArgs);
      const message3 = /* @__PURE__ */ createMessage({
        blocking: validation.blocking,
        key: `rule_${validation.name}`,
        meta: {
          /**
           * Use this key instead of the message root key to produce i18n validation
           * messages.
           */
          messageKey: validation.name,
          /**
           * For messages that were created *by or after* a debounced or async
           * validation rule — we make note of it so we can immediately remove them
           * as soon as the next commit happens.
           */
          removeImmediately,
          /**
           * Determines if this message should be passed to localization.
           */
          localize: !customMessage,
          /**
           * The arguments that will be passed to the validation rules
           */
          i18nArgs
        },
        type: "validation",
        value: customMessage || "This field is not valid."
      });
      node.store.set(message3);
    }
  );
}
function createCustomMessage(node, validation, i18nArgs) {
  const customMessage = node.props.validationMessages && has(node.props.validationMessages, validation.name) ? node.props.validationMessages[validation.name] : void 0;
  if (typeof customMessage === "function") {
    return customMessage(...i18nArgs);
  }
  return customMessage;
}
function createI18nArgs(node, validation) {
  return [
    {
      node,
      name: createMessageName(node),
      args: validation.args
    }
  ];
}
function createMessageName(node) {
  if (typeof node.props.validationLabel === "function") {
    return node.props.validationLabel(node);
  }
  return node.props.validationLabel || node.props.label || node.props.name || String(node.name);
}
var hintPattern = "(?:[\\*+?()0-9]+)";
var rulePattern = "[a-zA-Z][a-zA-Z0-9_]+";
var ruleExtractor = new RegExp(
  `^(${hintPattern}?${rulePattern})(?:\\:(.*)+)?$`,
  "i"
);
var hintExtractor = new RegExp(`^(${hintPattern})(${rulePattern})$`, "i");
var debounceExtractor = /([\*+?]+)?(\(\d+\))([\*+?]+)?/;
var hasDebounce = /\(\d+\)/;
var defaultHints = {
  blocking: true,
  debounce: 0,
  force: false,
  skipEmpty: true,
  name: ""
};
function parseRules(validation, rules, node) {
  if (!validation)
    return [];
  const intents = typeof validation === "string" ? extractRules(validation) : clone(validation);
  return intents.reduce((validations, args) => {
    let rule = args.shift();
    const hints = {};
    if (typeof rule === "string") {
      const [ruleName, parsedHints] = parseHints(rule);
      if (has(rules, ruleName)) {
        rule = rules[ruleName];
        Object.assign(hints, parsedHints);
      }
    }
    if (typeof rule === "function") {
      validations.push({
        observer: createObserver(node),
        rule,
        args,
        timer: 0,
        state: null,
        queued: true,
        deps: /* @__PURE__ */ new Map(),
        ...defaultHints,
        ...fnHints(hints, rule)
      });
    }
    return validations;
  }, []);
}
function extractRules(validation) {
  return validation.split("|").reduce((rules, rule) => {
    const parsedRule = parseRule(rule);
    if (parsedRule) {
      rules.push(parsedRule);
    }
    return rules;
  }, []);
}
function parseRule(rule) {
  const trimmed = rule.trim();
  if (trimmed) {
    const matches3 = trimmed.match(ruleExtractor);
    if (matches3 && typeof matches3[1] === "string") {
      const ruleName = matches3[1].trim();
      const args = matches3[2] && typeof matches3[2] === "string" ? matches3[2].split(",").map((s) => s.trim()) : [];
      return [ruleName, ...args];
    }
  }
  return false;
}
function parseHints(ruleName) {
  const matches3 = ruleName.match(hintExtractor);
  if (!matches3) {
    return [ruleName, { name: ruleName }];
  }
  const map = {
    "*": { force: true },
    "+": { skipEmpty: false },
    "?": { blocking: false }
  };
  const [, hints, rule] = matches3;
  const hintGroups = hasDebounce.test(hints) ? hints.match(debounceExtractor) || [] : [, hints];
  return [
    rule,
    [hintGroups[1], hintGroups[2], hintGroups[3]].reduce(
      (hints2, group2) => {
        if (!group2)
          return hints2;
        if (hasDebounce.test(group2)) {
          hints2.debounce = parseInt(group2.substr(1, group2.length - 1));
        } else {
          group2.split("").forEach(
            (hint) => has(map, hint) && Object.assign(hints2, map[hint])
          );
        }
        return hints2;
      },
      { name: rule }
    )
  ];
}
function fnHints(existingHints, rule) {
  if (!existingHints.name) {
    existingHints.name = rule.ruleName || rule.name;
  }
  return ["skipEmpty", "force", "debounce", "blocking"].reduce(
    (hints, hint) => {
      if (has(rule, hint) && !has(hints, hint)) {
        Object.assign(hints, {
          [hint]: rule[hint]
        });
      }
      return hints;
    },
    existingHints
  );
}
function sentence(str) {
  return str[0].toUpperCase() + str.substr(1);
}
function list$1(items, conjunction = "or") {
  return items.reduce((oxford, item, index) => {
    oxford += item;
    if (index <= items.length - 2 && items.length > 2) {
      oxford += ", ";
    }
    if (index === items.length - 2) {
      oxford += `${items.length === 2 ? " " : ""}${conjunction} `;
    }
    return oxford;
  }, "");
}
function date2(date22) {
  const dateTime = typeof date22 === "string" ? new Date(Date.parse(date22)) : date22;
  if (!(dateTime instanceof Date)) {
    return "(unknown)";
  }
  return new Intl.DateTimeFormat(void 0, {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(dateTime);
}
function order(first, second) {
  return Number(first) >= Number(second) ? [second, first] : [first, second];
}
var ui10 = {
  /**
   * Shown on a button for adding additional items.
   */
  add: "Add",
  /**
   * Shown when a button to remove items is visible.
   */
  remove: "Remove",
  /**
   * Shown when there are multiple items to remove at the same time.
   */
  removeAll: "Remove all",
  /**
   * Shown when all fields are not filled out correctly.
   */
  incomplete: "Sorry, not all fields are filled out correctly.",
  /**
   * Shown in a button inside a form to submit the form.
   */
  submit: "Submit",
  /**
   * Shown when no files are selected.
   */
  noFiles: "No file chosen",
  /**
   * Shown on buttons that move fields up in a list.
   */
  moveUp: "Move up",
  /**
   * Shown on buttons that move fields down in a list.
   */
  moveDown: "Move down",
  /**
   * Shown when something is actively loading.
   */
  isLoading: "Loading...",
  /**
   * Shown when there is more to load.
   */
  loadMore: "Load more",
  /**
   * Show on buttons that navigate state forward
   */
  next: "Next",
  /**
   * Show on buttons that navigate state backward
   */
  prev: "Previous",
  /**
   * Shown when adding all values.
   */
  addAllValues: "Add all values",
  /**
   * Shown when adding selected values.
   */
  addSelectedValues: "Add selected values",
  /**
   * Shown when removing all values.
   */
  removeAllValues: "Remove all values",
  /**
   * Shown when removing selected values.
   */
  removeSelectedValues: "Remove selected values",
  /**
   * Shown when there is a date to choose.
   */
  chooseDate: "Choose date",
  /**
   * Shown when there is a date to change.
   */
  changeDate: "Change date",
  /**
   * Shown above error summaries when someone attempts to submit a form with
   * errors and the developer has implemented `<FormKitSummary />`.
   */
  summaryHeader: "There were errors in your form.",
  /*
   * Shown when there is something to close
   */
  close: "Close",
  /**
   * Shown when there is something to open.
   */
  open: "Open"
};
var validation10 = {
  /**
   * The value is not an accepted value.
   * @see {@link https://formkit.com/essentials/validation#accepted}
   */
  accepted({ name }) {
    return `Please accept the ${name}.`;
  },
  /**
   * The date is not after
   * @see {@link https://formkit.com/essentials/validation#date-after}
   */
  date_after({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} must be after ${date2(args[0])}.`;
    }
    return `${sentence(name)} must be in the future.`;
  },
  /**
   * The value is not a letter.
   * @see {@link https://formkit.com/essentials/validation#alpha}
   */
  alpha({ name }) {
    return `${sentence(name)} can only contain alphabetical characters.`;
  },
  /**
   * The value is not alphanumeric
   * @see {@link https://formkit.com/essentials/validation#alphanumeric}
   */
  alphanumeric({ name }) {
    return `${sentence(name)} can only contain letters and numbers.`;
  },
  /**
   * The value is not letter and/or spaces
   * @see {@link https://formkit.com/essentials/validation#alpha-spaces}
   */
  alpha_spaces({ name }) {
    return `${sentence(name)} can only contain letters and spaces.`;
  },
  /**
   * The value have no letter.
   * @see {@link https://formkit.com/essentials/validation#contains_alpha}
   */
  contains_alpha({ name }) {
    return `${sentence(name)} must contain alphabetical characters.`;
  },
  /**
   * The value have no alphanumeric
   * @see {@link https://formkit.com/essentials/validation#contains_alphanumeric}
   */
  contains_alphanumeric({ name }) {
    return `${sentence(name)} must contain letters or numbers.`;
  },
  /**
   * The value have no letter and/or spaces
   * @see {@link https://formkit.com/essentials/validation#contains_alpha-spaces}
   */
  contains_alpha_spaces({ name }) {
    return `${sentence(name)} must contain letters or spaces.`;
  },
  /**
   * The value have no symbol
   * @see {@link https://formkit.com/essentials/validation#contains_symbol}
   */
  contains_symbol({ name }) {
    return `${sentence(name)} must contain a symbol.`;
  },
  /**
   * The value have no uppercase
   * @see {@link https://formkit.com/essentials/validation#contains_uppercase}
   */
  contains_uppercase({ name }) {
    return `${sentence(name)} must contain an uppercase letter.`;
  },
  /**
   * The value have no lowercase
   * @see {@link https://formkit.com/essentials/validation#contains_lowercase}
   */
  contains_lowercase({ name }) {
    return `${sentence(name)} must contain a lowercase letter.`;
  },
  /**
   *  The value have no numeric
   * @see {@link https://formkit.com/essentials/validation#contains_numeric}
   */
  contains_numeric({ name }) {
    return `${sentence(name)} must contain numbers.`;
  },
  /**
   * The value is not symbol
   * @see {@link https://formkit.com/essentials/validation#symbol}
   */
  symbol({ name }) {
    return `${sentence(name)} must be a symbol.`;
  },
  /**
   * The value is not uppercase
   * @see {@link https://formkit.com/essentials/validation#uppercase}
   */
  uppercase({ name }) {
    return `${sentence(name)} can only contain uppercase letters.`;
  },
  /**
   * The value is not lowercase
   * @see {@link https://formkit.com/essentials/validation#lowercase}
   */
  lowercase({ name, args }) {
    let postfix = "";
    if (Array.isArray(args) && args.length) {
      if (args[0] === "allow_non_alpha")
        postfix = ", numbers and symbols";
      if (args[0] === "allow_numeric")
        postfix = " and numbers";
      if (args[0] === "allow_numeric_dashes")
        postfix = ", numbers and dashes";
    }
    return `${sentence(name)} can only contain lowercase letters${postfix}.`;
  },
  /**
   * The date is not before
   * @see {@link https://formkit.com/essentials/validation#date-before}
   */
  date_before({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} must be before ${date2(args[0])}.`;
    }
    return `${sentence(name)} must be in the past.`;
  },
  /**
   * The value is not between two numbers
   * @see {@link https://formkit.com/essentials/validation#between}
   */
  between({ name, args }) {
    if (isNaN(args[0]) || isNaN(args[1])) {
      return `This field was configured incorrectly and can’t be submitted.`;
    }
    const [a, b] = order(args[0], args[1]);
    return `${sentence(name)} must be between ${a} and ${b}.`;
  },
  /**
   * The confirmation field does not match
   * @see {@link https://formkit.com/essentials/validation#confirm}
   */
  confirm({ name }) {
    return `${sentence(name)} does not match.`;
  },
  /**
   * The value is not a valid date
   * @see {@link https://formkit.com/essentials/validation#date-format}
   */
  date_format({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} is not a valid date, please use the format ${args[0]}`;
    }
    return "This field was configured incorrectly and can’t be submitted";
  },
  /**
   * Is not within expected date range
   * @see {@link https://formkit.com/essentials/validation#date-between}
   */
  date_between({ name, args }) {
    return `${sentence(name)} must be between ${date2(args[0])} and ${date2(args[1])}`;
  },
  /**
   * Shown when the user-provided value is not a valid email address.
   * @see {@link https://formkit.com/essentials/validation#email}
   */
  email: "Please enter a valid email address.",
  /**
   * Does not end with the specified value
   * @see {@link https://formkit.com/essentials/validation#ends-with}
   */
  ends_with({ name, args }) {
    return `${sentence(name)} doesn’t end with ${list$1(args)}.`;
  },
  /**
   * Is not an allowed value
   * @see {@link https://formkit.com/essentials/validation#is}
   */
  is({ name }) {
    return `${sentence(name)} is not an allowed value.`;
  },
  /**
   * Does not match specified length
   * @see {@link https://formkit.com/essentials/validation#length}
   */
  length({ name, args: [first = 0, second = Infinity] }) {
    const min3 = Number(first) <= Number(second) ? first : second;
    const max3 = Number(second) >= Number(first) ? second : first;
    if (min3 == 1 && max3 === Infinity) {
      return `${sentence(name)} must be at least one character.`;
    }
    if (min3 == 0 && max3) {
      return `${sentence(name)} must be less than or equal to ${max3} characters.`;
    }
    if (min3 === max3) {
      return `${sentence(name)} should be ${max3} characters long.`;
    }
    if (min3 && max3 === Infinity) {
      return `${sentence(name)} must be greater than or equal to ${min3} characters.`;
    }
    return `${sentence(name)} must be between ${min3} and ${max3} characters.`;
  },
  /**
   * Value is not a match
   * @see {@link https://formkit.com/essentials/validation#matches}
   */
  matches({ name }) {
    return `${sentence(name)} is not an allowed value.`;
  },
  /**
   * Exceeds maximum allowed value
   * @see {@link https://formkit.com/essentials/validation#max}
   */
  max({ name, node: { value }, args }) {
    if (Array.isArray(value)) {
      return `Cannot have more than ${args[0]} ${name}.`;
    }
    return `${sentence(name)} must be no more than ${args[0]}.`;
  },
  /**
   * The (field-level) value does not match specified mime type
   * @see {@link https://formkit.com/essentials/validation#mime}
   */
  mime({ name, args }) {
    if (!args[0]) {
      return "No file formats allowed.";
    }
    return `${sentence(name)} must be of the type: ${args[0]}`;
  },
  /**
   * Does not fulfill minimum allowed value
   * @see {@link https://formkit.com/essentials/validation#min}
   */
  min({ name, node: { value }, args }) {
    if (Array.isArray(value)) {
      return `Cannot have fewer than ${args[0]} ${name}.`;
    }
    return `${sentence(name)} must be at least ${args[0]}.`;
  },
  /**
   * Is not an allowed value
   * @see {@link https://formkit.com/essentials/validation#not}
   */
  not({ name, node: { value } }) {
    return `“${value}” is not an allowed ${name}.`;
  },
  /**
   *  Is not a number
   * @see {@link https://formkit.com/essentials/validation#number}
   */
  number({ name }) {
    return `${sentence(name)} must be a number.`;
  },
  /**
   * Require one field.
   * @see {@link https://formkit.com/essentials/validation#require-one}
   */
  require_one: ({ name, node, args: inputNames }) => {
    const labels = inputNames.map((name2) => {
      const dependentNode = node.at(name2);
      if (dependentNode) {
        return createMessageName(dependentNode);
      }
      return false;
    }).filter((name2) => !!name2);
    labels.unshift(name);
    return `${labels.join(" or ")} is required.`;
  },
  /**
   * Required field.
   * @see {@link https://formkit.com/essentials/validation#required}
   */
  required({ name }) {
    return `${sentence(name)} is required.`;
  },
  /**
   * Does not start with specified value
   * @see {@link https://formkit.com/essentials/validation#starts-with}
   */
  starts_with({ name, args }) {
    return `${sentence(name)} doesn’t start with ${list$1(args)}.`;
  },
  /**
   * Is not a url
   * @see {@link https://formkit.com/essentials/validation#url}
   */
  url() {
    return `Please enter a valid URL.`;
  },
  /**
   * Shown when the date is invalid.
   */
  invalidDate: "The selected date is invalid."
};
var en = { ui: ui10, validation: validation10 };
var ui46 = {
  /**
   * Shown on a button for adding additional items.
   */
  add: "新增",
  /**
   * Shown when a button to remove items is visible.
   */
  remove: "移除",
  /**
   * Shown when there are multiple items to remove at the same time.
   */
  removeAll: "移除全部",
  /**
   * Shown when all fields are not filled out correctly.
   */
  incomplete: "很抱歉，部分欄位填寫錯誤",
  /**
   * Shown in a button inside a form to submit the form.
   */
  submit: "提交",
  /**
   * Shown when no files are selected.
   */
  noFiles: "尚未選取檔案",
  /**
   * Shown on buttons that move fields up in a list.
   */
  moveUp: "上移",
  /**
   * Shown on buttons that move fields down in a list.
   */
  moveDown: "下移",
  /**
   * Shown when something is actively loading.
   */
  isLoading: "載入中...",
  /**
   * Shown when there is more to load.
   */
  loadMore: "載入更多",
  /**
   * Show on buttons that navigate state forward
   */
  next: "下一個",
  /**
   * Show on buttons that navigate state backward
   */
  prev: "上一個",
  /**
   * Shown when adding all values.
   */
  addAllValues: "加入全部的值",
  /**
   * Shown when adding selected values.
   */
  addSelectedValues: "加入選取的值",
  /**
   * Shown when removing all values.
   */
  removeAllValues: "移除全部的值",
  /**
   * Shown when removing selected values.
   */
  removeSelectedValues: "移除選取的值",
  /**
   * Shown when there is a date to choose.
   */
  chooseDate: "選擇日期",
  /**
   * Shown when there is a date to change.
   */
  changeDate: "變更日期",
  /**
   * Shown when there is something to close
   */
  close: "關閉",
  /**
   * Shown when there is something to open.
   */
  open: "開放"
};
var validation46 = {
  /**
   * The value is not an accepted value.
   * @see {@link https://formkit.com/essentials/validation#accepted}
   */
  accepted({ name }) {
    return `請接受 ${name}`;
  },
  /**
   * The date is not after
   * @see {@link https://formkit.com/essentials/validation#date-after}
   */
  date_after({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} 必須晚於 ${date2(args[0])}`;
    }
    return `${sentence(name)} 必須晚於今日`;
  },
  /**
   * The value is not a letter.
   * @see {@link https://formkit.com/essentials/validation#alpha}
   */
  alpha({ name }) {
    return `${sentence(name)} 欄位儘能填寫英文字母`;
  },
  /**
   * The value is not alphanumeric
   * @see {@link https://formkit.com/essentials/validation#alphanumeric}
   */
  alphanumeric({ name }) {
    return `${sentence(name)} 欄位僅能填寫英文字母與數字`;
  },
  /**
   * The value is not letter and/or spaces
   * @see {@link https://formkit.com/essentials/validation#alpha-spaces}
   */
  alpha_spaces({ name }) {
    return `${sentence(name)} 欄位儘能填寫英文字母與空白`;
  },
  /**
   * The date is not before
   * @see {@link https://formkit.com/essentials/validation#date-before}
   */
  date_before({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} 必須早於 ${date2(args[0])}.`;
    }
    return `${sentence(name)} 必須早於今日`;
  },
  /**
   * The value is not between two numbers
   * @see {@link https://formkit.com/essentials/validation#between}
   */
  between({ name, args }) {
    if (isNaN(args[0]) || isNaN(args[1])) {
      return `欄位值錯誤，無法提交`;
    }
    const [a, b] = order(args[0], args[1]);
    return `${sentence(name)} 必須介於 ${a} 和 ${b}.`;
  },
  /**
   * The confirmation field does not match
   * @see {@link https://formkit.com/essentials/validation#confirm}
   */
  confirm({ name }) {
    return `${sentence(name)} 與目標不一致`;
  },
  /**
   * The value is not a valid date
   * @see {@link https://formkit.com/essentials/validation#date-format}
   */
  date_format({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${sentence(name)} 不是有效的日期，請使用 ${args[0]} 格式`;
    }
    return "欄位值錯誤，無法提交";
  },
  /**
   * Is not within expected date range
   * @see {@link https://formkit.com/essentials/validation#date-between}
   */
  date_between({ name, args }) {
    return `${sentence(name)} 必須介於 ${date2(args[0])} 和 ${date2(args[1])}`;
  },
  /**
   * Shown when the user-provided value is not a valid email address.
   * @see {@link https://formkit.com/essentials/validation#email}
   */
  email: "請輸入有效的 email",
  /**
   * Does not end with the specified value
   * @see {@link https://formkit.com/essentials/validation#ends-with}
   */
  ends_with({ name, args }) {
    return `${sentence(name)} 的結尾必須是 ${list$1(args)}`;
  },
  /**
   * Is not an allowed value
   * @see {@link https://formkit.com/essentials/validation#is}
   */
  is({ name }) {
    return `${sentence(name)} 欄位的值不合規則`;
  },
  /**
   * Does not match specified length
   * @see {@link https://formkit.com/essentials/validation#length}
   */
  length({ name, args: [first = 0, second = Infinity] }) {
    const min3 = Number(first) <= Number(second) ? first : second;
    const max3 = Number(second) >= Number(first) ? second : first;
    if (min3 == 1 && max3 === Infinity) {
      return `${sentence(name)} 欄位必須至少包含一個字`;
    }
    if (min3 == 0 && max3) {
      return `${sentence(name)} 的字數必須小於等於 ${max3}`;
    }
    if (min3 === max3) {
      return `${sentence(name)} 的字數必須為 ${max3}`;
    }
    if (min3 && max3 === Infinity) {
      return `${sentence(name)} 的字數必須大於等於 ${min3}`;
    }
    return `${sentence(name)} 的字數必須介於 ${min3} 和 ${max3}`;
  },
  /**
   * Value is not a match
   * @see {@link https://formkit.com/essentials/validation#matches}
   */
  matches({ name }) {
    return `${sentence(name)} 欄位的值無效`;
  },
  /**
   * Exceeds maximum allowed value
   * @see {@link https://formkit.com/essentials/validation#max}
   */
  max({ name, node: { value }, args }) {
    if (Array.isArray(value)) {
      return `不能超過 ${args[0]} 個 ${name}.`;
    }
    return `${sentence(name)} 必須小於等於 ${args[0]}.`;
  },
  /**
   * The (field-level) value does not match specified mime type
   * @see {@link https://formkit.com/essentials/validation#mime}
   */
  mime({ name, args }) {
    if (!args[0]) {
      return "非有效的檔案格式";
    }
    return `${sentence(name)} 可接受的檔案格式為: ${args[0]}`;
  },
  /**
   * Does not fulfill minimum allowed value
   * @see {@link https://formkit.com/essentials/validation#min}
   */
  min({ name, node: { value }, args }) {
    if (Array.isArray(value)) {
      return `不可少於 ${args[0]} 個 ${name}`;
    }
    return `${name} 必須大於等於 ${args[0]}`;
  },
  /**
   * Is not an allowed value
   * @see {@link https://formkit.com/essentials/validation#not}
   */
  not({ name, node: { value } }) {
    return `“${value}” 不是 ${name} 欄位可接受的值`;
  },
  /**
   *  Is not a number
   * @see {@link https://formkit.com/essentials/validation#number}
   */
  number({ name }) {
    return `${sentence(name)} 欄位必須是數字`;
  },
  /**
   * Require one field.
   * @see {@link https://formkit.com/essentials/validation#require-one}
   */
  require_one: ({ name, node, args: inputNames }) => {
    const labels = inputNames.map((name2) => {
      const dependentNode = node.at(name2);
      if (dependentNode) {
        return createMessageName(dependentNode);
      }
      return false;
    }).filter((name2) => !!name2);
    labels.unshift(name);
    return `${labels.join("或")}${labels}需要。`;
  },
  /**
   * Required field.
   * @see {@link https://formkit.com/essentials/validation#required}
   */
  required({ name }) {
    return `${sentence(name)} 是必要欄位`;
  },
  /**
   * Does not start with specified value
   * @see {@link https://formkit.com/essentials/validation#starts-with}
   */
  starts_with({ name, args }) {
    return `${sentence(name)} 的開頭必須是 ${list$1(args)}`;
  },
  /**
   * Is not a url
   * @see {@link https://formkit.com/essentials/validation#url}
   */
  url() {
    return `請輸入有效的 url`;
  },
  /**
   * Shown when the date is invalid.
   */
  invalidDate: "選取的日期無效"
};
var zhTW = { ui: ui46, validation: validation46 };
var i18nNodes = /* @__PURE__ */ new Set();
function createI18nPlugin(registry2) {
  return function i18nPlugin(node) {
    i18nNodes.add(node);
    node.on("destroying", () => i18nNodes.delete(node));
    let localeKey = parseLocale(node.config.locale, registry2);
    let locale = localeKey ? registry2[localeKey] : {};
    node.on("prop:locale", ({ payload: lang }) => {
      localeKey = parseLocale(lang, registry2);
      locale = localeKey ? registry2[localeKey] : {};
      node.store.touch();
    });
    node.on("prop:label", () => node.store.touch());
    node.on("prop:validationLabel", () => node.store.touch());
    node.hook.text((fragment2, next) => {
      var _a, _b;
      const key = ((_a = fragment2.meta) == null ? void 0 : _a.messageKey) || fragment2.key;
      if (has(locale, fragment2.type) && has(locale[fragment2.type], key)) {
        const t = locale[fragment2.type][key];
        if (typeof t === "function") {
          fragment2.value = Array.isArray((_b = fragment2.meta) == null ? void 0 : _b.i18nArgs) ? t(...fragment2.meta.i18nArgs) : t(fragment2);
        } else {
          fragment2.value = t;
        }
      }
      return next(fragment2);
    });
  };
}
function parseLocale(locale, availableLocales) {
  if (has(availableLocales, locale)) {
    return locale;
  }
  const [lang] = locale.split("-");
  if (has(availableLocales, lang)) {
    return lang;
  }
  for (const locale2 in availableLocales) {
    return locale2;
  }
  return false;
}
function createLibraryPlugin(...libraries) {
  const library = libraries.reduce(
    (merged, lib) => extend$2(merged, lib),
    {}
  );
  const plugin2 = () => {
  };
  plugin2.library = function(node) {
    const type = camel(node.props.type);
    if (has(library, type)) {
      node.define(library[type]);
    }
  };
  return plugin2;
}
var runtimeProps = [
  "classes",
  "config",
  "delay",
  "errors",
  "id",
  "index",
  "inputErrors",
  "library",
  "modelValue",
  "onUpdate:modelValue",
  "name",
  "number",
  "parent",
  "plugins",
  "sectionsSchema",
  "type",
  "validation",
  "validationLabel",
  "validationMessages",
  "validationRules",
  // Runtime event props:
  "onInput",
  "onInputRaw",
  "onUpdate:modelValue",
  "onNode",
  "onSubmit",
  "onSubmitInvalid",
  "onSubmitRaw"
];
function isGroupOption(option2) {
  return option2 && typeof option2 === "object" && "group" in option2 && Array.isArray(option2.options);
}
function normalizeOptions(options2, i = { count: 1 }) {
  if (Array.isArray(options2)) {
    return options2.map(
      (option2) => {
        if (typeof option2 === "string" || typeof option2 === "number") {
          return {
            label: String(option2),
            value: String(option2)
          };
        }
        if (typeof option2 == "object") {
          if ("group" in option2) {
            option2.options = normalizeOptions(option2.options || [], i);
            return option2;
          } else if ("value" in option2 && typeof option2.value !== "string") {
            Object.assign(option2, {
              value: `__mask_${i.count++}`,
              __original: option2.value
            });
          }
        }
        return option2;
      }
    );
  }
  return Object.keys(options2).map((value) => {
    return {
      label: options2[value],
      value
    };
  });
}
function optionValue(options2, value, undefinedIfNotFound = false) {
  if (Array.isArray(options2)) {
    for (const option2 of options2) {
      if (typeof option2 !== "object" && option2)
        continue;
      if (isGroupOption(option2)) {
        const found = optionValue(option2.options, value, true);
        if (found !== void 0) {
          return found;
        }
      } else if (value == option2.value) {
        return "__original" in option2 ? option2.__original : option2.value;
      }
    }
  }
  return undefinedIfNotFound ? void 0 : value;
}
function shouldSelect(valueA, valueB) {
  if (valueA === null && valueB === void 0 || valueA === void 0 && valueB === null)
    return false;
  if (valueA == valueB)
    return true;
  if (isPojo(valueA) && isPojo(valueB))
    return eq(valueA, valueB);
  return false;
}
function options$1(node) {
  node.hook.prop((prop, next) => {
    var _a;
    if (prop.prop === "options") {
      if (typeof prop.value === "function") {
        node.props.optionsLoader = prop.value;
        prop.value = [];
      } else {
        (_a = node.props)._normalizeCounter ?? (_a._normalizeCounter = { count: 1 });
        prop.value = normalizeOptions(prop.value, node.props._normalizeCounter);
      }
    }
    return next(prop);
  });
}
// @__NO_SIDE_EFFECTS__
function createSection(section, el, fragment2 = false) {
  return (...children) => {
    const extendable = (extensions) => {
      const node = !el || typeof el === "string" ? { $el: el } : el();
      if (isDOM(node) || isComponent(node)) {
        if (!node.meta) {
          node.meta = { section };
        } else {
          node.meta.section = section;
        }
        if (children.length && !node.children) {
          node.children = [
            ...children.map(
              (child) => typeof child === "function" ? child(extensions) : child
            )
          ];
        }
        if (isDOM(node)) {
          node.attrs = {
            class: `$classes.${section}`,
            ...node.attrs || {}
          };
        }
      }
      return {
        if: `$slots.${section}`,
        then: `$slots.${section}`,
        else: section in extensions ? /* @__PURE__ */ extendSchema(node, extensions[section]) : node
      };
    };
    extendable._s = section;
    return fragment2 ? /* @__PURE__ */ createRoot(extendable) : extendable;
  };
}
// @__NO_SIDE_EFFECTS__
function createRoot(rootSection) {
  return (extensions) => {
    return [rootSection(extensions)];
  };
}
function isSchemaObject(schema) {
  return !!(schema && typeof schema === "object" && ("$el" in schema || "$cmp" in schema || "$formkit" in schema));
}
// @__NO_SIDE_EFFECTS__
function extendSchema(schema, extension = {}) {
  if (typeof schema === "string") {
    return isSchemaObject(extension) || typeof extension === "string" ? extension : schema;
  } else if (Array.isArray(schema)) {
    return isSchemaObject(extension) ? extension : schema;
  }
  return extend$2(schema, extension);
}
var actions = /* @__PURE__ */ createSection("actions", () => ({
  $el: "div",
  if: "$actions"
}));
var box = /* @__PURE__ */ createSection("input", () => ({
  $el: "input",
  bind: "$attrs",
  attrs: {
    type: "$type",
    name: "$node.props.altName || $node.name",
    disabled: "$option.attrs.disabled || $disabled",
    onInput: "$handlers.toggleChecked",
    checked: "$fns.eq($_value, $onValue)",
    onBlur: "$handlers.blur",
    value: "$: true",
    id: "$id",
    "aria-describedby": {
      if: "$options.length",
      then: {
        if: "$option.help",
        then: '$: "help-" + $option.attrs.id',
        else: void 0
      },
      else: {
        if: "$help",
        then: '$: "help-" + $id',
        else: void 0
      }
    }
  }
}));
var boxHelp = /* @__PURE__ */ createSection("optionHelp", () => ({
  $el: "div",
  if: "$option.help",
  attrs: {
    id: '$: "help-" + $option.attrs.id'
  }
}));
var boxInner = /* @__PURE__ */ createSection("inner", "span");
var boxLabel = /* @__PURE__ */ createSection("label", "span");
var boxOption = /* @__PURE__ */ createSection("option", () => ({
  $el: "li",
  for: ["option", "$options"],
  attrs: {
    "data-disabled": "$option.attrs.disabled || $disabled || undefined"
  }
}));
var boxOptions = /* @__PURE__ */ createSection("options", "ul");
var boxWrapper = /* @__PURE__ */ createSection("wrapper", () => ({
  $el: "label",
  attrs: {
    "data-disabled": {
      if: "$options.length",
      then: void 0,
      else: "$disabled || undefined"
    },
    "data-checked": {
      if: "$options == undefined",
      then: "$fns.eq($_value, $onValue) || undefined",
      else: "$fns.isChecked($option.value) || undefined"
    }
  }
}));
var buttonInput = /* @__PURE__ */ createSection("input", () => ({
  $el: "button",
  bind: "$attrs",
  attrs: {
    type: "$type",
    disabled: "$disabled",
    name: "$node.name",
    id: "$id"
  }
}));
var buttonLabel = /* @__PURE__ */ createSection("default", null);
var decorator = /* @__PURE__ */ createSection("decorator", () => ({
  $el: "span",
  attrs: {
    "aria-hidden": "true"
  }
}));
var fieldset = /* @__PURE__ */ createSection("fieldset", () => ({
  $el: "fieldset",
  attrs: {
    id: "$id",
    "aria-describedby": {
      if: "$help",
      then: '$: "help-" + $id',
      else: void 0
    }
  }
}));
var fileInput = /* @__PURE__ */ createSection("input", () => ({
  $el: "input",
  bind: "$attrs",
  attrs: {
    type: "file",
    disabled: "$disabled",
    name: "$node.name",
    onChange: "$handlers.files",
    onBlur: "$handlers.blur",
    id: "$id",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  }
}));
var fileItem = /* @__PURE__ */ createSection("fileItem", () => ({
  $el: "li",
  for: ["file", "$value"]
}));
var fileList = /* @__PURE__ */ createSection("fileList", () => ({
  $el: "ul",
  if: "$value.length",
  attrs: {
    "data-has-multiple": "$_hasMultipleFiles"
  }
}));
var fileName = /* @__PURE__ */ createSection("fileName", () => ({
  $el: "span",
  attrs: {
    class: "$classes.fileName"
  }
}));
var fileRemove = /* @__PURE__ */ createSection("fileRemove", () => ({
  $el: "button",
  attrs: {
    type: "button",
    onClick: "$handlers.resetFiles"
  }
}));
var formInput = /* @__PURE__ */ createSection("form", () => ({
  $el: "form",
  bind: "$attrs",
  meta: {
    autoAnimate: true
  },
  attrs: {
    id: "$id",
    name: "$node.name",
    onSubmit: "$handlers.submit",
    "data-loading": "$state.loading || undefined"
  }
}));
var fragment = /* @__PURE__ */ createSection("wrapper", null, true);
var help = /* @__PURE__ */ createSection("help", () => ({
  $el: "div",
  if: "$help",
  attrs: {
    id: '$: "help-" + $id'
  }
}));
var icon = (sectionKey, el) => {
  return (/* @__PURE__ */ createSection(`${sectionKey}Icon`, () => {
    const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}Icon`;
    return {
      if: `$${sectionKey}Icon && $${rawIconProp}`,
      $el: `${el ? el : "span"}`,
      attrs: {
        class: `$classes.${sectionKey}Icon + " " + $classes.icon`,
        innerHTML: `$${rawIconProp}`,
        onClick: `$handlers.iconClick(${sectionKey})`,
        role: `$fns.iconRole(${sectionKey})`,
        tabindex: `$fns.iconRole(${sectionKey}) === "button" && "0" || undefined`,
        for: {
          if: `${el === "label"}`,
          then: "$id"
        }
      }
    };
  }))();
};
var inner = /* @__PURE__ */ createSection("inner", "div");
var label = /* @__PURE__ */ createSection("label", () => ({
  $el: "label",
  if: "$label",
  attrs: {
    for: "$id"
  }
}));
var legend = /* @__PURE__ */ createSection("legend", () => ({
  $el: "legend",
  if: "$label"
}));
var message$1 = /* @__PURE__ */ createSection("message", () => ({
  $el: "li",
  for: ["message", "$messages"],
  attrs: {
    key: "$message.key",
    id: `$id + '-' + $message.key`,
    "data-message-type": "$message.type"
  }
}));
var messages$1 = /* @__PURE__ */ createSection("messages", () => ({
  $el: "ul",
  if: "$defaultMessagePlacement && $fns.length($messages)"
}));
var noFiles = /* @__PURE__ */ createSection("noFiles", () => ({
  $el: "span",
  if: "$value.length == 0"
}));
var optGroup = /* @__PURE__ */ createSection("optGroup", () => ({
  $el: "optgroup",
  bind: "$option.attrs",
  attrs: {
    label: "$option.group"
  }
}));
var option = /* @__PURE__ */ createSection("option", () => ({
  $el: "option",
  bind: "$option.attrs",
  attrs: {
    class: "$classes.option",
    value: "$option.value",
    selected: "$fns.isSelected($option)"
  }
}));
var optionSlot = /* @__PURE__ */ createSection("options", () => ({
  $el: null,
  if: "$options.length",
  for: ["option", "$option.options || $options"]
}));
var outer = /* @__PURE__ */ createSection("outer", () => ({
  $el: "div",
  meta: {
    autoAnimate: true
  },
  attrs: {
    key: "$id",
    "data-family": "$family || undefined",
    "data-type": "$type",
    "data-multiple": '$attrs.multiple || ($type != "select" && $options != undefined) || undefined',
    "data-has-multiple": "$_hasMultipleFiles",
    "data-disabled": '$: ($disabled !== "false" && $disabled) || undefined',
    "data-empty": "$state.empty || undefined",
    "data-complete": "$state.complete || undefined",
    "data-invalid": "$state.invalid || undefined",
    "data-errors": "$state.errors || undefined",
    "data-submitted": "$state.submitted || undefined",
    "data-prefix-icon": "$_rawPrefixIcon !== undefined || undefined",
    "data-suffix-icon": "$_rawSuffixIcon !== undefined || undefined",
    "data-prefix-icon-click": "$onPrefixIconClick !== undefined || undefined",
    "data-suffix-icon-click": "$onSuffixIconClick !== undefined || undefined"
  }
}));
var prefix = /* @__PURE__ */ createSection("prefix", null);
var selectInput = /* @__PURE__ */ createSection("input", () => ({
  $el: "select",
  bind: "$attrs",
  attrs: {
    id: "$id",
    "data-placeholder": "$fns.showPlaceholder($_value, $placeholder)",
    disabled: "$disabled",
    class: "$classes.input",
    name: "$node.name",
    onChange: "$handlers.onChange",
    onInput: "$handlers.selectInput",
    onBlur: "$handlers.blur",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  }
}));
var submitInput = /* @__PURE__ */ createSection("submit", () => ({
  $cmp: "FormKit",
  bind: "$submitAttrs",
  props: {
    type: "submit",
    label: "$submitLabel"
  }
}));
var suffix = /* @__PURE__ */ createSection("suffix", null);
var textInput = /* @__PURE__ */ createSection("input", () => ({
  $el: "input",
  bind: "$attrs",
  attrs: {
    type: "$type",
    disabled: "$disabled",
    name: "$node.name",
    onInput: "$handlers.DOMInput",
    onBlur: "$handlers.blur",
    value: "$_value",
    id: "$id",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  }
}));
var textareaInput = /* @__PURE__ */ createSection("input", () => ({
  $el: "textarea",
  bind: "$attrs",
  attrs: {
    disabled: "$disabled",
    name: "$node.name",
    onInput: "$handlers.DOMInput",
    onBlur: "$handlers.blur",
    value: "$_value",
    id: "$id",
    "aria-describedby": "$describedBy",
    "aria-required": "$state.required || undefined"
  },
  children: "$initialValue"
}));
var wrapper$1 = /* @__PURE__ */ createSection("wrapper", "div");
var radioInstance = 0;
function renamesRadios(node) {
  if (node.type === "group" || node.type === "list") {
    node.plugins.add(renamesRadiosPlugin);
  }
}
function renamesRadiosPlugin(node) {
  if (node.props.type === "radio") {
    node.addProps(["altName"]);
    node.props.altName = `${node.name}_${radioInstance++}`;
  }
}
function normalizeBoxes(node) {
  return function(prop, next) {
    if (prop.prop === "options" && Array.isArray(prop.value)) {
      prop.value = prop.value.map((option2) => {
        var _a;
        if (!((_a = option2.attrs) == null ? void 0 : _a.id)) {
          return extend$2(option2, {
            attrs: {
              id: `${node.props.id}-option-${slugify(String(option2.value))}`
            }
          });
        }
        return option2;
      });
      if (node.props.type === "checkbox" && !Array.isArray(node.value)) {
        if (node.isCreated) {
          node.input([], false);
        } else {
          node.on("created", () => {
            if (!Array.isArray(node.value)) {
              node.input([], false);
            }
          });
        }
      }
    }
    return next(prop);
  };
}
function toggleChecked(node, e) {
  const el = e.target;
  if (el instanceof HTMLInputElement) {
    const value = Array.isArray(node.props.options) ? optionValue(node.props.options, el.value) : el.value;
    if (Array.isArray(node.props.options) && node.props.options.length) {
      if (!Array.isArray(node._value)) {
        node.input([value]);
      } else if (!node._value.some((existingValue) => shouldSelect(value, existingValue))) {
        node.input([...node._value, value]);
      } else {
        node.input(
          node._value.filter(
            (existingValue) => !shouldSelect(value, existingValue)
          )
        );
      }
    } else {
      if (el.checked) {
        node.input(node.props.onValue);
      } else {
        node.input(node.props.offValue);
      }
    }
  }
}
function isChecked(node, value) {
  var _a, _b;
  (_a = node.context) == null ? void 0 : _a.value;
  (_b = node.context) == null ? void 0 : _b._value;
  if (Array.isArray(node._value)) {
    return node._value.some(
      (existingValue) => shouldSelect(optionValue(node.props.options, value), existingValue)
    );
  }
  return false;
}
function checkboxes(node) {
  node.on("created", () => {
    var _a, _b;
    if ((_a = node.context) == null ? void 0 : _a.handlers) {
      node.context.handlers.toggleChecked = toggleChecked.bind(null, node);
    }
    if ((_b = node.context) == null ? void 0 : _b.fns) {
      node.context.fns.isChecked = isChecked.bind(null, node);
    }
    if (!has(node.props, "onValue"))
      node.props.onValue = true;
    if (!has(node.props, "offValue"))
      node.props.offValue = false;
  });
  node.hook.prop(normalizeBoxes(node));
}
function defaultIcon(sectionKey, defaultIcon2) {
  return (node) => {
    if (node.props[`${sectionKey}Icon`] === void 0) {
      node.props[`${sectionKey}Icon`] = defaultIcon2.startsWith("<svg") ? defaultIcon2 : `default:${defaultIcon2}`;
    }
  };
}
function disables(node) {
  node.on("created", () => {
    if ("disabled" in node.props) {
      node.props.disabled = undefine(node.props.disabled);
      node.config.disabled = undefine(node.props.disabled);
    }
  });
  node.hook.prop(({ prop, value }, next) => {
    value = prop === "disabled" ? undefine(value) : value;
    return next({ prop, value });
  });
  node.on("prop:disabled", ({ payload: value }) => {
    node.config.disabled = undefine(value);
  });
}
function localize(key, value) {
  return (node) => {
    node.store.set(
      /* @__PURE__ */ createMessage({
        key,
        type: "ui",
        value: value || key,
        meta: {
          localize: true,
          i18nArgs: [node]
        }
      })
    );
  };
}
var isBrowser$2 = typeof window !== "undefined";
function removeHover(e) {
  if (e.target instanceof HTMLElement && e.target.hasAttribute("data-file-hover")) {
    e.target.removeAttribute("data-file-hover");
  }
}
function preventStrayDrop(type, e) {
  if (!(e.target instanceof HTMLInputElement)) {
    e.preventDefault();
  } else if (type === "dragover") {
    e.target.setAttribute("data-file-hover", "true");
  }
  if (type === "drop") {
    removeHover(e);
  }
}
function files(node) {
  localize("noFiles", "Select file")(node);
  localize("removeAll", "Remove all")(node);
  localize("remove")(node);
  node.addProps(["_hasMultipleFiles"]);
  if (isBrowser$2) {
    if (!window._FormKit_File_Drop) {
      window.addEventListener(
        "dragover",
        preventStrayDrop.bind(null, "dragover")
      );
      window.addEventListener("drop", preventStrayDrop.bind(null, "drop"));
      window.addEventListener("dragleave", removeHover);
      window._FormKit_File_Drop = true;
    }
  }
  node.hook.input((value, next) => next(Array.isArray(value) ? value : []));
  node.on("input", ({ payload: value }) => {
    node.props._hasMultipleFiles = Array.isArray(value) && value.length > 1 ? true : void 0;
  });
  node.on("reset", () => {
    if (node.props.id && isBrowser$2) {
      const el = document.getElementById(node.props.id);
      if (el)
        el.value = "";
    }
  });
  node.on("created", () => {
    if (!Array.isArray(node.value))
      node.input([], false);
    if (!node.context)
      return;
    node.context.handlers.resetFiles = (e) => {
      e.preventDefault();
      node.input([]);
      if (node.props.id && isBrowser$2) {
        const el = document.getElementById(node.props.id);
        if (el)
          el.value = "";
        el == null ? void 0 : el.focus();
      }
    };
    node.context.handlers.files = (e) => {
      var _a, _b;
      const files2 = [];
      if (e.target instanceof HTMLInputElement && e.target.files) {
        for (let i = 0; i < e.target.files.length; i++) {
          let file2;
          if (file2 = e.target.files.item(i)) {
            files2.push({ name: file2.name, file: file2 });
          }
        }
        node.input(files2);
      }
      if (node.context)
        node.context.files = files2;
      if (typeof ((_a = node.props.attrs) == null ? void 0 : _a.onChange) === "function") {
        (_b = node.props.attrs) == null ? void 0 : _b.onChange(e);
      }
    };
  });
}
var loading = /* @__PURE__ */ createMessage({
  key: "loading",
  value: true,
  visible: false
});
async function handleSubmit(node, submitEvent) {
  const submitNonce = Math.random();
  node.props._submitNonce = submitNonce;
  submitEvent.preventDefault();
  await node.settled;
  if (node.ledger.value("validating")) {
    node.store.set(loading);
    await node.ledger.settled("validating");
    node.store.remove("loading");
    if (node.props._submitNonce !== submitNonce)
      return;
  }
  const setSubmitted = (n) => n.store.set(
    /* @__PURE__ */ createMessage({
      key: "submitted",
      value: true,
      visible: false
    })
  );
  node.walk(setSubmitted);
  setSubmitted(node);
  node.emit("submit-raw");
  if (typeof node.props.onSubmitRaw === "function") {
    node.props.onSubmitRaw(submitEvent, node);
  }
  if (node.ledger.value("blocking")) {
    if (typeof node.props.onSubmitInvalid === "function") {
      node.props.onSubmitInvalid(node);
    }
    if (node.props.incompleteMessage !== false) {
      setIncompleteMessage(node);
    }
  } else {
    if (typeof node.props.onSubmit === "function") {
      const retVal = node.props.onSubmit(
        node.hook.submit.dispatch(clone(node.value)),
        node
      );
      if (retVal instanceof Promise) {
        const autoDisable = node.props.disabled === void 0 && node.props.submitBehavior !== "live";
        if (autoDisable)
          node.props.disabled = true;
        node.store.set(loading);
        await retVal;
        if (autoDisable)
          node.props.disabled = false;
        node.store.remove("loading");
      }
    } else {
      if (submitEvent.target instanceof HTMLFormElement) {
        submitEvent.target.submit();
      }
    }
  }
}
function setIncompleteMessage(node) {
  node.store.set(
    /* @__PURE__ */ createMessage({
      blocking: false,
      key: `incomplete`,
      meta: {
        localize: node.props.incompleteMessage === void 0,
        i18nArgs: [{ node }],
        showAsMessage: true
      },
      type: "ui",
      value: node.props.incompleteMessage || "Form incomplete."
    })
  );
}
function form(node) {
  var _a;
  node.props.isForm = true;
  node.ledger.count("validating", (m) => m.key === "validating");
  (_a = node.props).submitAttrs ?? (_a.submitAttrs = {
    disabled: node.props.disabled
  });
  node.on("prop:disabled", ({ payload: disabled }) => {
    node.props.submitAttrs = { ...node.props.submitAttrs, disabled };
  });
  node.on("created", () => {
    var _a2;
    if ((_a2 = node.context) == null ? void 0 : _a2.handlers) {
      node.context.handlers.submit = handleSubmit.bind(null, node);
    }
    if (!has(node.props, "actions")) {
      node.props.actions = true;
    }
  });
  node.on("prop:incompleteMessage", () => {
    if (node.store.incomplete)
      setIncompleteMessage(node);
  });
  node.on("settled:blocking", () => node.store.remove("incomplete"));
}
function ignore(node) {
  if (node.props.ignore === void 0) {
    node.props.ignore = true;
    node.parent = null;
  }
}
function initialValue(node) {
  node.on("created", () => {
    if (node.context) {
      node.context.initialValue = node.value || "";
    }
  });
}
function casts(node) {
  if (typeof node.props.number === "undefined")
    return;
  const strict = ["number", "range", "hidden"].includes(node.props.type);
  node.hook.input((value, next) => {
    if (value === "")
      return next(void 0);
    const numericValue = node.props.number === "integer" ? parseInt(value) : parseFloat(value);
    if (!Number.isFinite(numericValue))
      return strict ? next(void 0) : next(value);
    return next(numericValue);
  });
}
function toggleChecked2(node, event) {
  if (event.target instanceof HTMLInputElement) {
    node.input(optionValue(node.props.options, event.target.value));
  }
}
function isChecked2(node, value) {
  var _a, _b;
  (_a = node.context) == null ? void 0 : _a.value;
  (_b = node.context) == null ? void 0 : _b._value;
  return shouldSelect(optionValue(node.props.options, value), node._value);
}
function radios(node) {
  node.on("created", () => {
    var _a, _b;
    if (!Array.isArray(node.props.options)) {
      warn(350, {
        node,
        inputType: "radio"
      });
    }
    if ((_a = node.context) == null ? void 0 : _a.handlers) {
      node.context.handlers.toggleChecked = toggleChecked2.bind(null, node);
    }
    if ((_b = node.context) == null ? void 0 : _b.fns) {
      node.context.fns.isChecked = isChecked2.bind(null, node);
    }
  });
  node.hook.prop(normalizeBoxes(node));
}
function isSelected(node, option2) {
  if (isGroupOption(option2))
    return false;
  node.context && node.context.value;
  const optionValue2 = "__original" in option2 ? option2.__original : option2.value;
  return Array.isArray(node._value) ? node._value.some((optionA) => shouldSelect(optionA, optionValue2)) : (node._value === void 0 || node._value === null && !containsValue(node.props.options, null)) && option2.attrs && option2.attrs["data-is-placeholder"] ? true : shouldSelect(optionValue2, node._value);
}
function containsValue(options2, value) {
  return options2.some((option2) => {
    if (isGroupOption(option2)) {
      return containsValue(option2.options, value);
    } else {
      return ("__original" in option2 ? option2.__original : option2.value) === value;
    }
  });
}
async function deferChange(node, e) {
  var _a;
  if (typeof ((_a = node.props.attrs) == null ? void 0 : _a.onChange) === "function") {
    await new Promise((r) => setTimeout(r, 0));
    await node.settled;
    node.props.attrs.onChange(e);
  }
}
function selectInput2(node, e) {
  const target2 = e.target;
  const value = target2.hasAttribute("multiple") ? Array.from(target2.selectedOptions).map(
    (o) => optionValue(node.props.options, o.value)
  ) : optionValue(node.props.options, target2.value);
  node.input(value);
}
function applyPlaceholder(options2, placeholder) {
  if (!options2.some(
    (option2) => option2.attrs && option2.attrs["data-is-placeholder"]
  )) {
    return [
      {
        label: placeholder,
        value: "",
        attrs: {
          hidden: true,
          disabled: true,
          "data-is-placeholder": "true"
        }
      },
      ...options2
    ];
  }
  return options2;
}
function firstValue(options2) {
  const option2 = options2.length > 0 ? options2[0] : void 0;
  if (!option2)
    return void 0;
  if (isGroupOption(option2))
    return firstValue(option2.options);
  return "__original" in option2 ? option2.__original : option2.value;
}
function select(node) {
  node.on("created", () => {
    var _a, _b, _c;
    const isMultiple = undefine((_a = node.props.attrs) == null ? void 0 : _a.multiple);
    if (!isMultiple && node.props.placeholder && Array.isArray(node.props.options)) {
      node.hook.prop(({ prop, value }, next) => {
        if (prop === "options") {
          value = applyPlaceholder(value, node.props.placeholder);
        }
        return next({ prop, value });
      });
      node.props.options = applyPlaceholder(
        node.props.options,
        node.props.placeholder
      );
    }
    if (isMultiple) {
      if (node.value === void 0) {
        node.input([], false);
      }
    } else if (node.context && !node.context.options) {
      node.props.attrs = Object.assign({}, node.props.attrs, {
        value: node._value
      });
      node.on("input", ({ payload }) => {
        node.props.attrs = Object.assign({}, node.props.attrs, {
          value: payload
        });
      });
    }
    if ((_b = node.context) == null ? void 0 : _b.handlers) {
      node.context.handlers.selectInput = selectInput2.bind(null, node);
      node.context.handlers.onChange = deferChange.bind(null, node);
    }
    if ((_c = node.context) == null ? void 0 : _c.fns) {
      node.context.fns.isSelected = isSelected.bind(null, node);
      node.context.fns.showPlaceholder = (value, placeholder) => {
        if (!Array.isArray(node.props.options))
          return false;
        const hasMatchingValue = node.props.options.some(
          (option2) => {
            if (option2.attrs && "data-is-placeholder" in option2.attrs)
              return false;
            const optionValue2 = "__original" in option2 ? option2.__original : option2.value;
            return eq(value, optionValue2);
          }
        );
        return placeholder && !hasMatchingValue ? true : void 0;
      };
    }
  });
  node.hook.input((value, next) => {
    var _a, _b, _c;
    if (!node.props.placeholder && value === void 0 && Array.isArray((_a = node.props) == null ? void 0 : _a.options) && node.props.options.length && !undefine((_c = (_b = node.props) == null ? void 0 : _b.attrs) == null ? void 0 : _c.multiple)) {
      value = firstValue(node.props.options);
    }
    return next(value);
  });
}
// @__NO_SIDE_EFFECTS__
function isSlotCondition(node) {
  if (isConditional(node) && node.if && node.if.startsWith("$slots.") && typeof node.then === "string" && node.then.startsWith("$slots.") && "else" in node) {
    return true;
  }
  return false;
}
// @__NO_SIDE_EFFECTS__
function $if(condition, then, otherwise) {
  const extendable = (extensions) => {
    const node = then(extensions);
    if (otherwise || isSchemaObject(node) && "if" in node || /* @__PURE__ */ isSlotCondition(node)) {
      const conditionalNode = {
        if: condition,
        then: node
      };
      if (otherwise) {
        conditionalNode.else = otherwise(extensions);
      }
      return conditionalNode;
    } else if (/* @__PURE__ */ isSlotCondition(node)) {
      Object.assign(node.else, { if: condition });
    } else if (isSchemaObject(node)) {
      Object.assign(node, { if: condition });
    }
    return node;
  };
  extendable._s = token$1();
  return extendable;
}
// @__NO_SIDE_EFFECTS__
function $extend(section, extendWith) {
  const extendable = (extensions) => {
    const node = section({});
    if (/* @__PURE__ */ isSlotCondition(node)) {
      if (Array.isArray(node.else))
        return node;
      node.else = /* @__PURE__ */ extendSchema(
        /* @__PURE__ */ extendSchema(node.else, extendWith),
        section._s ? extensions[section._s] : {}
      );
      return node;
    }
    return /* @__PURE__ */ extendSchema(
      /* @__PURE__ */ extendSchema(node, extendWith),
      section._s ? extensions[section._s] : {}
    );
  };
  extendable._s = section._s;
  return extendable;
}
var button = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value")),
    /* @__PURE__ */ wrapper$1(
      /* @__PURE__ */ buttonInput(
        /* @__PURE__ */ icon("prefix"),
        /* @__PURE__ */ prefix(),
        /* @__PURE__ */ buttonLabel("$label || $ui.submit.value"),
        /* @__PURE__ */ suffix(),
        /* @__PURE__ */ icon("suffix")
      )
    ),
    /* @__PURE__ */ help("$help")
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "button",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [localize("submit"), ignore],
  /**
   * A key to use for memoizing the schema. This is used to prevent the schema
   * from needing to be stringified when performing a memo lookup.
   */
  schemaMemoKey: "h6st4epl3j8"
};
var checkbox = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ $if(
      "$options == undefined",
      /**
       * Single checkbox structure.
       */
      /* @__PURE__ */ boxWrapper(
        /* @__PURE__ */ boxInner(/* @__PURE__ */ prefix(), /* @__PURE__ */ box(), /* @__PURE__ */ decorator(/* @__PURE__ */ icon("decorator")), /* @__PURE__ */ suffix()),
        /* @__PURE__ */ $extend(/* @__PURE__ */ boxLabel("$label"), {
          if: "$label"
        })
      ),
      /**
       * Multi checkbox structure.
       */
      /* @__PURE__ */ fieldset(
        /* @__PURE__ */ legend("$label"),
        /* @__PURE__ */ help("$help"),
        /* @__PURE__ */ boxOptions(
          /* @__PURE__ */ boxOption(
            /* @__PURE__ */ boxWrapper(
              /* @__PURE__ */ boxInner(
                /* @__PURE__ */ prefix(),
                /* @__PURE__ */ $extend(/* @__PURE__ */ box(), {
                  bind: "$option.attrs",
                  attrs: {
                    id: "$option.attrs.id",
                    value: "$option.value",
                    checked: "$fns.isChecked($option.value)"
                  }
                }),
                /* @__PURE__ */ decorator(/* @__PURE__ */ icon("decorator")),
                /* @__PURE__ */ suffix()
              ),
              /* @__PURE__ */ $extend(/* @__PURE__ */ boxLabel("$option.label"), {
                if: "$option.label"
              })
            ),
            /* @__PURE__ */ boxHelp("$option.help")
          )
        )
      )
    ),
    // Help text only goes under the input when it is a single.
    /* @__PURE__ */ $if("$options == undefined && $help", /* @__PURE__ */ help("$help")),
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "box",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["options", "onValue", "offValue", "optionsLoader"],
  /**
   * Additional features that should be added to your input
   */
  features: [
    options$1,
    checkboxes,
    defaultIcon("decorator", "checkboxDecorator")
  ],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "qje02tb3gu8"
};
var file = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ wrapper$1(
      /* @__PURE__ */ label("$label"),
      /* @__PURE__ */ inner(
        /* @__PURE__ */ icon("prefix", "label"),
        /* @__PURE__ */ prefix(),
        /* @__PURE__ */ fileInput(),
        /* @__PURE__ */ fileList(
          /* @__PURE__ */ fileItem(
            /* @__PURE__ */ icon("fileItem"),
            /* @__PURE__ */ fileName("$file.name"),
            /* @__PURE__ */ $if(
              "$value.length === 1",
              /* @__PURE__ */ fileRemove(
                /* @__PURE__ */ icon("fileRemove"),
                '$ui.remove.value + " " + $file.name'
              )
            )
          )
        ),
        /* @__PURE__ */ $if("$value.length > 1", /* @__PURE__ */ fileRemove("$ui.removeAll.value")),
        /* @__PURE__ */ noFiles(/* @__PURE__ */ icon("noFiles"), "$ui.noFiles.value"),
        /* @__PURE__ */ suffix(),
        /* @__PURE__ */ icon("suffix")
      )
    ),
    /* @__PURE__ */ help("$help"),
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "text",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [
    files,
    defaultIcon("fileItem", "fileItem"),
    defaultIcon("fileRemove", "fileRemove"),
    defaultIcon("noFiles", "noFiles")
  ],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "9kqc4852fv8"
};
var form2 = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ formInput(
    "$slots.default",
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value")),
    /* @__PURE__ */ actions(/* @__PURE__ */ submitInput())
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "group",
  /**
   * An array of extra props to accept for this input.
   */
  props: [
    "actions",
    "submit",
    "submitLabel",
    "submitAttrs",
    "submitBehavior",
    "incompleteMessage"
  ],
  /**
   * Additional features that should be added to your input
   */
  features: [form, disables],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "5bg016redjo"
};
var group = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ fragment("$slots.default"),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "group",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [disables, renamesRadios]
};
var hidden = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ textInput(),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [casts]
};
var list = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ fragment("$slots.default"),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "list",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["sync", "dynamic"],
  /**
   * Additional features that should be added to your input
   */
  features: [disables, renamesRadios]
};
var meta = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ fragment(),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: []
};
var radio = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ $if(
      "$options == undefined",
      /**
       * Single radio structure.
       */
      /* @__PURE__ */ boxWrapper(
        /* @__PURE__ */ boxInner(/* @__PURE__ */ prefix(), /* @__PURE__ */ box(), /* @__PURE__ */ decorator(/* @__PURE__ */ icon("decorator")), /* @__PURE__ */ suffix()),
        /* @__PURE__ */ $extend(/* @__PURE__ */ boxLabel("$label"), {
          if: "$label"
        })
      ),
      /**
       * Multi radio structure.
       */
      /* @__PURE__ */ fieldset(
        /* @__PURE__ */ legend("$label"),
        /* @__PURE__ */ help("$help"),
        /* @__PURE__ */ boxOptions(
          /* @__PURE__ */ boxOption(
            /* @__PURE__ */ boxWrapper(
              /* @__PURE__ */ boxInner(
                /* @__PURE__ */ prefix(),
                /* @__PURE__ */ $extend(/* @__PURE__ */ box(), {
                  bind: "$option.attrs",
                  attrs: {
                    id: "$option.attrs.id",
                    value: "$option.value",
                    checked: "$fns.isChecked($option.value)"
                  }
                }),
                /* @__PURE__ */ decorator(/* @__PURE__ */ icon("decorator")),
                /* @__PURE__ */ suffix()
              ),
              /* @__PURE__ */ $extend(/* @__PURE__ */ boxLabel("$option.label"), {
                if: "$option.label"
              })
            ),
            /* @__PURE__ */ boxHelp("$option.help")
          )
        )
      )
    ),
    // Help text only goes under the input when it is a single.
    /* @__PURE__ */ $if("$options == undefined && $help", /* @__PURE__ */ help("$help")),
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "box",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["options", "onValue", "offValue", "optionsLoader"],
  /**
   * Additional features that should be added to your input
   */
  features: [options$1, radios, defaultIcon("decorator", "radioDecorator")],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "qje02tb3gu8"
};
var select2 = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ wrapper$1(
      /* @__PURE__ */ label("$label"),
      /* @__PURE__ */ inner(
        /* @__PURE__ */ icon("prefix"),
        /* @__PURE__ */ prefix(),
        /* @__PURE__ */ selectInput(
          /* @__PURE__ */ $if(
            "$slots.default",
            () => "$slots.default",
            /* @__PURE__ */ optionSlot(
              /* @__PURE__ */ $if(
                "$option.group",
                /* @__PURE__ */ optGroup(/* @__PURE__ */ optionSlot(/* @__PURE__ */ option("$option.label"))),
                /* @__PURE__ */ option("$option.label")
              )
            )
          )
        ),
        /* @__PURE__ */ $if("$attrs.multiple !== undefined", () => "", /* @__PURE__ */ icon("select")),
        /* @__PURE__ */ suffix(),
        /* @__PURE__ */ icon("suffix")
      )
    ),
    /* @__PURE__ */ help("$help"),
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: ["options", "placeholder", "optionsLoader"],
  /**
   * Additional features that should be added to your input
   */
  features: [options$1, select, defaultIcon("select", "select")],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "cb119h43krg"
};
var textarea = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ wrapper$1(
      /* @__PURE__ */ label("$label"),
      /* @__PURE__ */ inner(
        /* @__PURE__ */ icon("prefix", "label"),
        /* @__PURE__ */ prefix(),
        /* @__PURE__ */ textareaInput(),
        /* @__PURE__ */ suffix(),
        /* @__PURE__ */ icon("suffix")
      )
    ),
    /* @__PURE__ */ help("$help"),
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [initialValue],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "b1n0td79m9g"
};
var text = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: /* @__PURE__ */ outer(
    /* @__PURE__ */ wrapper$1(
      /* @__PURE__ */ label("$label"),
      /* @__PURE__ */ inner(
        /* @__PURE__ */ icon("prefix", "label"),
        /* @__PURE__ */ prefix(),
        /* @__PURE__ */ textInput(),
        /* @__PURE__ */ suffix(),
        /* @__PURE__ */ icon("suffix")
      )
    ),
    /* @__PURE__ */ help("$help"),
    /* @__PURE__ */ messages$1(/* @__PURE__ */ message$1("$message.value"))
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "input",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "text",
  /**
   * An array of extra props to accept for this input.
   */
  props: [],
  /**
   * Additional features that should be added to your input
   */
  features: [casts],
  /**
   * The key used to memoize the schema.
   */
  schemaMemoKey: "c3cc4kflsg"
};
var inputs = {
  button,
  submit: button,
  checkbox,
  file,
  form: form2,
  group,
  hidden,
  list,
  meta,
  radio,
  select: select2,
  textarea,
  text,
  color: text,
  date: text,
  datetimeLocal: text,
  email: text,
  month: text,
  number: text,
  password: text,
  search: text,
  tel: text,
  time: text,
  url: text,
  week: text,
  range: text
};
var documentStyles = void 0;
var documentThemeLinkTag = null;
var themeDidLoad;
var themeHasLoaded = false;
var themeWasRequested = false;
var themeLoaded = /* @__PURE__ */ new Promise((res) => {
  themeDidLoad = () => {
    themeHasLoaded = true;
    res();
  };
});
var isClient = typeof window !== "undefined" && typeof fetch !== "undefined";
documentStyles = isClient ? /* @__PURE__ */ getComputedStyle(document.documentElement) : void 0;
var iconRegistry = {};
var iconRequests = {};
function createThemePlugin(theme, icons, iconLoaderUrl, iconLoader) {
  if (icons) {
    Object.assign(iconRegistry, icons);
  }
  if (isClient && !themeWasRequested && (documentStyles == null ? void 0 : documentStyles.getPropertyValue("--formkit-theme"))) {
    themeDidLoad();
    themeWasRequested = true;
  } else if (theme && !themeWasRequested && isClient) {
    loadTheme(theme);
  } else if (!themeWasRequested && isClient) {
    themeDidLoad();
  }
  const themePlugin = function themePlugin2(node) {
    var _a, _b;
    node.addProps(["iconLoader", "iconLoaderUrl"]);
    node.props.iconHandler = createIconHandler(
      ((_a = node.props) == null ? void 0 : _a.iconLoader) ? node.props.iconLoader : iconLoader,
      ((_b = node.props) == null ? void 0 : _b.iconLoaderUrl) ? node.props.iconLoaderUrl : iconLoaderUrl
    );
    loadIconPropIcons(node, node.props.iconHandler);
    node.on("created", () => {
      var _a2, _b2;
      if ((_a2 = node == null ? void 0 : node.context) == null ? void 0 : _a2.handlers) {
        node.context.handlers.iconClick = (sectionKey) => {
          const clickHandlerProp = `on${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}IconClick`;
          const handlerFunction = node.props[clickHandlerProp];
          if (handlerFunction && typeof handlerFunction === "function") {
            return (e) => {
              return handlerFunction(node, e);
            };
          }
          return void 0;
        };
      }
      if ((_b2 = node == null ? void 0 : node.context) == null ? void 0 : _b2.fns) {
        node.context.fns.iconRole = (sectionKey) => {
          const clickHandlerProp = `on${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}IconClick`;
          return typeof node.props[clickHandlerProp] === "function" ? "button" : null;
        };
      }
    });
  };
  themePlugin.iconHandler = createIconHandler(iconLoader, iconLoaderUrl);
  return themePlugin;
}
function loadTheme(theme) {
  if (!theme || !isClient || typeof getComputedStyle !== "function") {
    return;
  }
  themeWasRequested = true;
  documentThemeLinkTag = document.getElementById("formkit-theme");
  if (theme && // if we have a window object
  isClient && // we don't have an existing theme OR the theme being set up is different
  (!(documentStyles == null ? void 0 : documentStyles.getPropertyValue("--formkit-theme")) && !documentThemeLinkTag || (documentThemeLinkTag == null ? void 0 : documentThemeLinkTag.getAttribute("data-theme")) && (documentThemeLinkTag == null ? void 0 : documentThemeLinkTag.getAttribute("data-theme")) !== theme)) {
    const formkitVersion = FORMKIT_VERSION.startsWith("__") ? "latest" : FORMKIT_VERSION;
    const themeUrl = `https://cdn.jsdelivr.net/npm/@formkit/themes@${formkitVersion}/dist/${theme}/theme.css`;
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = "formkit-theme";
    link.setAttribute("data-theme", theme);
    link.onload = () => {
      documentStyles = getComputedStyle(document.documentElement);
      themeDidLoad();
    };
    document.head.appendChild(link);
    link.href = themeUrl;
    if (documentThemeLinkTag) {
      documentThemeLinkTag.remove();
    }
  }
}
function createIconHandler(iconLoader, iconLoaderUrl) {
  return (iconName) => {
    if (typeof iconName !== "string")
      return;
    if (iconName.startsWith("<svg")) {
      return iconName;
    }
    const isDefault = iconName.startsWith("default:");
    iconName = isDefault ? iconName.split(":")[1] : iconName;
    const iconWasAlreadyLoaded = iconName in iconRegistry;
    let loadedIcon = void 0;
    if (iconWasAlreadyLoaded) {
      return iconRegistry[iconName];
    } else if (!iconRequests[iconName]) {
      loadedIcon = getIconFromStylesheet(iconName);
      loadedIcon = isClient && typeof loadedIcon === "undefined" ? Promise.resolve(loadedIcon) : loadedIcon;
      if (loadedIcon instanceof Promise) {
        iconRequests[iconName] = loadedIcon.then((iconValue) => {
          if (!iconValue && typeof iconName === "string" && !isDefault) {
            return loadedIcon = typeof iconLoader === "function" ? iconLoader(iconName) : getRemoteIcon(iconName, iconLoaderUrl);
          }
          return iconValue;
        }).then((finalIcon) => {
          if (typeof iconName === "string") {
            iconRegistry[isDefault ? `default:${iconName}` : iconName] = finalIcon;
          }
          return finalIcon;
        });
      } else if (typeof loadedIcon === "string") {
        iconRegistry[isDefault ? `default:${iconName}` : iconName] = loadedIcon;
        return loadedIcon;
      }
    }
    return iconRequests[iconName];
  };
}
function getIconFromStylesheet(iconName) {
  if (!isClient)
    return;
  if (themeHasLoaded) {
    return loadStylesheetIcon(iconName);
  } else {
    return themeLoaded.then(() => {
      return loadStylesheetIcon(iconName);
    });
  }
}
function loadStylesheetIcon(iconName) {
  const cssVarIcon = documentStyles == null ? void 0 : documentStyles.getPropertyValue(`--fk-icon-${iconName}`);
  if (cssVarIcon) {
    const icon2 = atob(cssVarIcon);
    if (icon2.startsWith("<svg")) {
      iconRegistry[iconName] = icon2;
      return icon2;
    }
  }
  return void 0;
}
function getRemoteIcon(iconName, iconLoaderUrl) {
  const formkitVersion = FORMKIT_VERSION.startsWith("__") ? "latest" : FORMKIT_VERSION;
  const fetchUrl = typeof iconLoaderUrl === "function" ? iconLoaderUrl(iconName) : `https://cdn.jsdelivr.net/npm/@formkit/icons@${formkitVersion}/dist/icons/${iconName}.svg`;
  if (!isClient)
    return void 0;
  return fetch(`${fetchUrl}`).then(async (r) => {
    const icon2 = await r.text();
    if (icon2.startsWith("<svg")) {
      return icon2;
    }
    return void 0;
  }).catch((e) => {
    console.error(e);
    return void 0;
  });
}
function loadIconPropIcons(node, iconHandler) {
  const iconRegex = /^[a-zA-Z-]+(?:-icon|Icon)$/;
  const iconProps = Object.keys(node.props).filter((prop) => {
    return iconRegex.test(prop);
  });
  iconProps.forEach((sectionKey) => {
    return loadPropIcon(node, iconHandler, sectionKey);
  });
}
function loadPropIcon(node, iconHandler, sectionKey) {
  const iconName = node.props[sectionKey];
  const loadedIcon = iconHandler(iconName);
  const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}`;
  const clickHandlerProp = `on${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}Click`;
  node.addProps([rawIconProp, clickHandlerProp]);
  node.on(`prop:${sectionKey}`, reloadIcon);
  if (loadedIcon instanceof Promise) {
    return loadedIcon.then((svg) => {
      node.props[rawIconProp] = svg;
    });
  } else {
    node.props[rawIconProp] = loadedIcon;
  }
  return;
}
function reloadIcon(event) {
  var _a;
  const node = event.origin;
  const iconName = event.payload;
  const iconHandler = (_a = node == null ? void 0 : node.props) == null ? void 0 : _a.iconHandler;
  const sectionKey = event.name.split(":")[1];
  const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}`;
  if (iconHandler && typeof iconHandler === "function") {
    const loadedIcon = iconHandler(iconName);
    if (loadedIcon instanceof Promise) {
      return loadedIcon.then((svg) => {
        node.props[rawIconProp] = svg;
      });
    } else {
      node.props[rawIconProp] = loadedIcon;
    }
  }
}
var errors = {
  /**
   * FormKit errors:
   */
  100: ({ data: node }) => `Only groups, lists, and forms can have children (${node.name}).`,
  101: ({ data: node }) => `You cannot directly modify the store (${node.name}). See: https://formkit.com/advanced/core#message-store`,
  102: ({
    data: [node, property]
  }) => `You cannot directly assign node.${property} (${node.name})`,
  103: ({ data: [operator] }) => `Schema expressions cannot start with an operator (${operator})`,
  104: ({ data: [operator, expression] }) => `Schema expressions cannot end with an operator (${operator} in "${expression}")`,
  105: ({ data: expression }) => `Invalid schema expression: ${expression}`,
  106: ({ data: name }) => `Cannot submit because (${name}) is not in a form.`,
  107: ({ data: [node, value] }) => `Cannot set ${node.name} to non object value: ${value}`,
  108: ({ data: [node, value] }) => `Cannot set ${node.name} to non array value: ${value}`,
  /**
   * Input specific errors:
   */
  300: ({ data: [node] }) => `Cannot set behavior prop to overscroll (on ${node.name} input) when options prop is a function.`,
  /**
   * FormKit vue errors:
   */
  600: ({ data: node }) => `Unknown input type${typeof node.props.type === "string" ? ' "' + node.props.type + '"' : ""} ("${node.name}")`,
  601: ({ data: node }) => `Input definition${typeof node.props.type === "string" ? ' "' + node.props.type + '"' : ""} is missing a schema or component property (${node.name}).`
};
var warnings = {
  /**
   * Core warnings:
   */
  150: ({ data: fn }) => `Schema function "${fn}()" is not a valid function.`,
  151: ({ data: id }) => `No form element with id: ${id}`,
  152: ({ data: id }) => `No input element with id: ${id}`,
  /**
   * Input specific warnings:
   */
  350: ({
    data: { node, inputType }
  }) => `Invalid options prop for ${node.name} input (${inputType}). See https://formkit.com/inputs/${inputType}`,
  /**
   * Vue warnings:
   */
  650: 'Schema "$get()" must use the id of an input to access.',
  651: ({ data: id }) => `Cannot setErrors() on "${id}" because no such id exists.`,
  652: ({ data: id }) => `Cannot clearErrors() on "${id}" because no such id exists.`,
  /**
   * Deprecation warnings:
   */
  800: ({ data: name }) => `${name} is deprecated.`
};
var decodeErrors = (error2, next) => {
  if (error2.code in errors) {
    const err = errors[error2.code];
    error2.message = typeof err === "function" ? err(error2) : err;
  }
  return next(error2);
};
var registered = false;
function register() {
  if (!registered) {
    errorHandler(decodeErrors);
    warningHandler(decodeWarnings);
    registered = true;
  }
}
var decodeWarnings = (warning, next) => {
  if (warning.code in warnings) {
    const warn2 = warnings[warning.code];
    warning.message = typeof warn2 === "function" ? warn2(warning) : warn2;
  }
  return next(warning);
};
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target2, all2) => {
  for (var name in all2)
    __defProp(target2, name, { get: all2[name], enumerable: true });
};
var vueBindings, bindings_default;
var init_bindings = __esm({
  "packages/vue/src/bindings.ts"() {
    vueBindings = function vueBindings2(node) {
      node.ledger.count("blocking", (m) => m.blocking);
      const isValid = ref(!node.ledger.value("blocking"));
      node.ledger.count("errors", (m) => m.type === "error");
      const hasErrors = ref(!!node.ledger.value("errors"));
      let hasTicked = false;
      nextTick(() => {
        hasTicked = true;
      });
      const availableMessages = reactive(
        node.store.reduce((store, message3) => {
          if (message3.visible) {
            store[message3.key] = message3;
          }
          return store;
        }, {})
      );
      const validationVisibility = ref(
        node.props.validationVisibility || (node.props.type === "checkbox" ? "dirty" : "blur")
      );
      node.on("prop:validationVisibility", ({ payload }) => {
        validationVisibility.value = payload;
      });
      const hasShownErrors = ref(validationVisibility.value === "live");
      const isRequired = ref(false);
      const checkForRequired = (parsedRules) => {
        isRequired.value = (parsedRules ?? []).some(
          (rule) => rule.name === "required"
        );
      };
      checkForRequired(node.props.parsedRules);
      node.on("prop:parsedRules", ({ payload }) => checkForRequired(payload));
      const items = ref(node.children.map((child) => child.uid));
      const validationVisible = computed(() => {
        if (!context.state)
          return false;
        if (context.state.submitted)
          return true;
        if (!hasShownErrors.value && !context.state.settled) {
          return false;
        }
        switch (validationVisibility.value) {
          case "live":
            return true;
          case "blur":
            return context.state.blurred;
          case "dirty":
            return context.state.dirty;
          default:
            return false;
        }
      });
      const isInvalid = computed(() => {
        return context.state.failing && validationVisible.value;
      });
      const isComplete = computed(() => {
        return context && hasValidation.value ? isValid.value && !hasErrors.value : context.state.dirty && !empty(context.value);
      });
      const hasValidation = ref(
        Array.isArray(node.props.parsedRules) && node.props.parsedRules.length > 0
      );
      node.on("prop:parsedRules", ({ payload: rules }) => {
        hasValidation.value = Array.isArray(rules) && rules.length > 0;
      });
      const messages3 = computed(() => {
        const visibleMessages = {};
        for (const key in availableMessages) {
          const message3 = availableMessages[key];
          if (message3.type !== "validation" || validationVisible.value) {
            visibleMessages[key] = message3;
          }
        }
        return visibleMessages;
      });
      const ui = reactive(
        node.store.reduce((messages4, message3) => {
          if (message3.type === "ui" && message3.visible)
            messages4[message3.key] = message3;
          return messages4;
        }, {})
      );
      const passing = computed(() => !context.state.failing);
      const cachedClasses = reactive({});
      const classes2 = new Proxy(cachedClasses, {
        get(...args) {
          const [target2, property] = args;
          let className = Reflect.get(...args);
          if (!className && typeof property === "string") {
            if (!has(target2, property) && !property.startsWith("__v")) {
              const observedNode = createObserver(node);
              observedNode.watch((node2) => {
                const rootClasses2 = typeof node2.config.rootClasses === "function" ? node2.config.rootClasses(property, node2) : {};
                const globalConfigClasses = node2.config.classes ? createClasses(property, node2, node2.config.classes[property]) : {};
                const classesPropClasses = createClasses(
                  property,
                  node2,
                  node2.props[`_${property}Class`]
                );
                const sectionPropClasses = createClasses(
                  property,
                  node2,
                  node2.props[`${property}Class`]
                );
                className = generateClassList(
                  node2,
                  property,
                  rootClasses2,
                  globalConfigClasses,
                  classesPropClasses,
                  sectionPropClasses
                );
                target2[property] = className ?? "";
              });
            }
          }
          return className;
        }
      });
      node.on("prop:rootClasses", () => {
        const keys = Object.keys(cachedClasses);
        for (const key of keys) {
          delete cachedClasses[key];
        }
      });
      const describedBy = computed(() => {
        const describers = [];
        if (context.help) {
          describers.push(`help-${node.props.id}`);
        }
        for (const key in messages3.value) {
          describers.push(`${node.props.id}-${key}`);
        }
        return describers.length ? describers.join(" ") : void 0;
      });
      const value = ref(node.value);
      const _value = ref(node.value);
      const context = reactive({
        _value,
        attrs: node.props.attrs,
        disabled: node.props.disabled,
        describedBy,
        fns: {
          length: (obj) => Object.keys(obj).length,
          number: (value2) => Number(value2),
          string: (value2) => String(value2),
          json: (value2) => JSON.stringify(value2),
          eq
        },
        handlers: {
          blur: (e) => {
            if (!node)
              return;
            node.store.set(
              /* @__PURE__ */ createMessage({ key: "blurred", visible: false, value: true })
            );
            if (typeof node.props.attrs.onBlur === "function") {
              node.props.attrs.onBlur(e);
            }
          },
          touch: () => {
            var _a;
            const doCompare = context.dirtyBehavior === "compare";
            if (((_a = node.store.dirty) == null ? void 0 : _a.value) && !doCompare)
              return;
            const isDirty = !eq(node.props._init, node._value);
            if (!isDirty && !doCompare)
              return;
            node.store.set(
              /* @__PURE__ */ createMessage({ key: "dirty", visible: false, value: isDirty })
            );
          },
          DOMInput: (e) => {
            node.input(e.target.value);
            node.emit("dom-input-event", e);
          }
        },
        help: node.props.help,
        id: node.props.id,
        items,
        label: node.props.label,
        messages: messages3,
        didMount: false,
        node: markRaw(node),
        options: node.props.options,
        defaultMessagePlacement: true,
        slots: node.props.__slots,
        state: {
          blurred: false,
          complete: isComplete,
          dirty: false,
          empty: empty(value),
          submitted: false,
          settled: node.isSettled,
          valid: isValid,
          invalid: isInvalid,
          errors: hasErrors,
          rules: hasValidation,
          validationVisible,
          required: isRequired,
          failing: false,
          passing
        },
        type: node.props.type,
        family: node.props.family,
        ui,
        value,
        classes: classes2
      });
      node.on("created", () => {
        if (!eq(context.value, node.value)) {
          _value.value = node.value;
          value.value = node.value;
          triggerRef(value);
          triggerRef(_value);
        }
        (async () => {
          await node.settled;
          if (node)
            node.props._init = cloneAny(node.value);
        })();
      });
      node.on("mounted", () => {
        context.didMount = true;
      });
      node.on("settled", ({ payload: isSettled }) => {
        context.state.settled = isSettled;
      });
      function observeProps(observe) {
        const propNames = Array.isArray(observe) ? observe : Object.keys(observe);
        propNames.forEach((prop) => {
          prop = camel(prop);
          if (!has(context, prop)) {
            context[prop] = node.props[prop];
          }
          node.on(`prop:${prop}`, ({ payload }) => {
            context[prop] = payload;
          });
        });
      }
      const rootProps = () => {
        const props = [
          "__root",
          "help",
          "label",
          "disabled",
          "options",
          "type",
          "attrs",
          "preserve",
          "preserveErrors",
          "id",
          "dirtyBehavior"
        ];
        const iconPattern = /^[a-zA-Z-]+(?:-icon|Icon)$/;
        const matchingProps = Object.keys(node.props).filter((prop) => {
          return iconPattern.test(prop);
        });
        return props.concat(matchingProps);
      };
      observeProps(rootProps());
      function definedAs(definition3) {
        if (definition3.props)
          observeProps(definition3.props);
      }
      node.props.definition && definedAs(node.props.definition);
      node.on("added-props", ({ payload }) => observeProps(payload));
      node.on("input", ({ payload }) => {
        if (node.type !== "input" && !isRef(payload) && !isReactive(payload)) {
          _value.value = shallowClone(payload);
        } else {
          _value.value = payload;
          triggerRef(_value);
        }
      });
      node.on("commitRaw", ({ payload }) => {
        if (node.type !== "input" && !isRef(payload) && !isReactive(payload)) {
          value.value = _value.value = shallowClone(payload);
        } else {
          value.value = _value.value = payload;
          triggerRef(value);
        }
        node.emit("modelUpdated");
      });
      node.on("commit", ({ payload }) => {
        var _a;
        if ((!context.state.dirty || context.dirtyBehavior === "compare") && node.isCreated && hasTicked) {
          if (!((_a = node.store.validating) == null ? void 0 : _a.value)) {
            context.handlers.touch();
          } else {
            const receipt = node.on("message-removed", ({ payload: message3 }) => {
              if (message3.key === "validating") {
                context.handlers.touch();
                node.off(receipt);
              }
            });
          }
        }
        if (isComplete && node.type === "input" && hasErrors.value && !undefine(node.props.preserveErrors)) {
          node.store.filter(
            (message3) => {
              var _a2;
              return !(message3.type === "error" && ((_a2 = message3.meta) == null ? void 0 : _a2.autoClear) === true);
            }
          );
        }
        if (node.type === "list" && node.sync) {
          items.value = node.children.map((child) => child.uid);
        }
        context.state.empty = empty(payload);
      });
      const updateState = async (message3) => {
        if (message3.type === "ui" && message3.visible && !message3.meta.showAsMessage) {
          ui[message3.key] = message3;
        } else if (message3.visible) {
          availableMessages[message3.key] = message3;
        } else if (message3.type === "state") {
          context.state[message3.key] = !!message3.value;
        }
      };
      node.on("message-added", (e) => updateState(e.payload));
      node.on("message-updated", (e) => updateState(e.payload));
      node.on("message-removed", ({ payload: message3 }) => {
        delete ui[message3.key];
        delete availableMessages[message3.key];
        delete context.state[message3.key];
      });
      node.on("settled:blocking", () => {
        isValid.value = true;
      });
      node.on("unsettled:blocking", () => {
        isValid.value = false;
      });
      node.on("settled:errors", () => {
        hasErrors.value = false;
      });
      node.on("unsettled:errors", () => {
        hasErrors.value = true;
      });
      watch$1(validationVisible, (value2) => {
        if (value2) {
          hasShownErrors.value = true;
        }
      });
      node.context = context;
      node.emit("context", node, false);
      node.on("destroyed", () => {
        node.context = void 0;
        node = null;
      });
    };
    bindings_default = vueBindings;
  }
});
var defaultConfig_exports = {};
__export(defaultConfig_exports, {
  defaultConfig: () => defaultConfig
});
var defaultConfig;
var init_defaultConfig = __esm({
  "packages/vue/src/defaultConfig.ts"() {
    init_bindings();
    defaultConfig = (options2 = {}) => {
      register();
      const {
        rules = {},
        locales = {},
        inputs: inputs$1 = {},
        messages: messages3 = {},
        locale = void 0,
        theme = void 0,
        iconLoaderUrl = void 0,
        iconLoader = void 0,
        icons = {},
        ...nodeOptions
      } = options2;
      const validation = createValidationPlugin({
        ...defaultRules,
        ...rules || {}
      });
      const i18n = createI18nPlugin(
        extend$2({ en, ...locales || {} }, messages3)
      );
      const library = createLibraryPlugin(inputs, inputs$1);
      const themePlugin = createThemePlugin(theme, icons, iconLoaderUrl, iconLoader);
      return extend$2(
        {
          plugins: [library, themePlugin, bindings_default, i18n, validation],
          ...!locale ? {} : { config: { locale } }
        },
        nodeOptions || {},
        true
      );
    };
  }
});
var isServer = typeof window === "undefined";
var ssrCompleteRegistry = /* @__PURE__ */ new Map();
function onSSRComplete(app2, callback) {
  var _a;
  if (!isServer || !app2)
    return;
  if (!ssrCompleteRegistry.has(app2))
    ssrCompleteRegistry.set(app2, /* @__PURE__ */ new Set());
  (_a = ssrCompleteRegistry.get(app2)) == null ? void 0 : _a.add(callback);
}
var isServer2 = typeof window === "undefined";
var memo = {};
var memoKeys = {};
var instanceKey;
var instanceScopes = /* @__PURE__ */ new WeakMap();
var raw$1 = "__raw__";
var isClassProp = /[a-zA-Z0-9\-][cC]lass$/;
function getRef(token3, data) {
  const value = ref(null);
  if (token3 === "get") {
    const nodeRefs = {};
    value.value = get.bind(null, nodeRefs);
    return value;
  }
  const path = token3.split(".");
  watchEffect(() => {
    value.value = getValue(
      isRef(data) ? data.value : data,
      path
    );
  });
  return value;
}
function getValue(set2, path) {
  if (Array.isArray(set2)) {
    for (const subset of set2) {
      const value = subset !== false && getValue(subset, path);
      if (value !== void 0)
        return value;
    }
    return void 0;
  }
  let foundValue = void 0;
  let obj = set2;
  for (const i in path) {
    const key = path[i];
    if (typeof obj !== "object" || obj === null) {
      foundValue = void 0;
      break;
    }
    const currentValue = obj[key];
    if (Number(i) === path.length - 1 && currentValue !== void 0) {
      foundValue = typeof currentValue === "function" ? currentValue.bind(obj) : currentValue;
      break;
    }
    obj = currentValue;
  }
  return foundValue;
}
function get(nodeRefs, id) {
  if (typeof id !== "string")
    return warn(650);
  if (!(id in nodeRefs))
    nodeRefs[id] = ref(void 0);
  if (nodeRefs[id].value === void 0) {
    nodeRefs[id].value = null;
    const root2 = getNode(id);
    if (root2)
      nodeRefs[id].value = root2.context;
    watchRegistry(id, ({ payload: node }) => {
      nodeRefs[id].value = isNode(node) ? node.context : node;
    });
  }
  return nodeRefs[id].value;
}
function parseSchema(library, schema, memoKey) {
  function parseCondition2(library2, node) {
    const condition = provider(compile(node.if), { if: true });
    const children = createElements(library2, node.then);
    const alternate = node.else ? createElements(library2, node.else) : null;
    return [condition, children, alternate];
  }
  function parseConditionAttr(attr, _default) {
    var _a, _b;
    const condition = provider(compile(attr.if));
    let b = () => _default;
    let a = () => _default;
    if (typeof attr.then === "object") {
      a = parseAttrs(attr.then, void 0);
    } else if (typeof attr.then === "string" && ((_a = attr.then) == null ? void 0 : _a.startsWith("$"))) {
      a = provider(compile(attr.then));
    } else {
      a = () => attr.then;
    }
    if (has(attr, "else")) {
      if (typeof attr.else === "object") {
        b = parseAttrs(attr.else);
      } else if (typeof attr.else === "string" && ((_b = attr.else) == null ? void 0 : _b.startsWith("$"))) {
        b = provider(compile(attr.else));
      } else {
        b = () => attr.else;
      }
    }
    return () => condition() ? a() : b();
  }
  function parseAttrs(unparsedAttrs, bindExp, _default = {}) {
    const explicitAttrs = new Set(Object.keys(unparsedAttrs || {}));
    const boundAttrs = bindExp ? provider(compile(bindExp)) : () => ({});
    const setters = [
      (attrs) => {
        const bound = boundAttrs();
        for (const attr in bound) {
          if (!explicitAttrs.has(attr)) {
            attrs[attr] = bound[attr];
          }
        }
      }
    ];
    if (unparsedAttrs) {
      if (isConditional(unparsedAttrs)) {
        const condition = parseConditionAttr(
          unparsedAttrs,
          _default
        );
        return condition;
      }
      for (let attr in unparsedAttrs) {
        const value = unparsedAttrs[attr];
        let getValue2;
        const isStr = typeof value === "string";
        if (attr.startsWith(raw$1)) {
          attr = attr.substring(7);
          getValue2 = () => value;
        } else if (isStr && value.startsWith("$") && value.length > 1 && !(value.startsWith("$reset") && isClassProp.test(attr))) {
          getValue2 = provider(compile(value));
        } else if (typeof value === "object" && isConditional(value)) {
          getValue2 = parseConditionAttr(value, void 0);
        } else if (typeof value === "object" && isPojo(value)) {
          getValue2 = parseAttrs(value);
        } else {
          getValue2 = () => value;
        }
        setters.push((attrs) => {
          attrs[attr] = getValue2();
        });
      }
    }
    return () => {
      const attrs = Array.isArray(unparsedAttrs) ? [] : {};
      setters.forEach((setter) => setter(attrs));
      return attrs;
    };
  }
  function parseNode(library2, _node) {
    let element = null;
    let attrs = () => null;
    let condition = false;
    let children = null;
    let alternate = null;
    let iterator = null;
    let resolve2 = false;
    const node = sugar(_node);
    if (isDOM(node)) {
      element = node.$el;
      attrs = node.$el !== "text" ? parseAttrs(node.attrs, node.bind) : () => null;
    } else if (isComponent(node)) {
      if (typeof node.$cmp === "string") {
        if (has(library2, node.$cmp)) {
          element = library2[node.$cmp];
        } else {
          element = node.$cmp;
          resolve2 = true;
        }
      } else {
        element = node.$cmp;
      }
      attrs = parseAttrs(node.props, node.bind);
    } else if (isConditional(node)) {
      [condition, children, alternate] = parseCondition2(library2, node);
    }
    if (!isConditional(node) && "if" in node) {
      condition = provider(compile(node.if));
    } else if (!isConditional(node) && element === null) {
      condition = () => true;
    }
    if ("children" in node && node.children) {
      if (typeof node.children === "string") {
        if (node.children.startsWith("$slots.")) {
          element = element === "text" ? "slot" : element;
          children = provider(compile(node.children));
        } else if (node.children.startsWith("$") && node.children.length > 1) {
          const value = provider(compile(node.children));
          children = () => String(value());
        } else {
          children = () => String(node.children);
        }
      } else if (Array.isArray(node.children)) {
        children = createElements(library2, node.children);
      } else {
        const [childCondition, c, a] = parseCondition2(library2, node.children);
        children = (iterationData) => childCondition && childCondition() ? c && c(iterationData) : a && a(iterationData);
      }
    }
    if (isComponent(node)) {
      if (children) {
        const produceChildren = children;
        children = (iterationData) => {
          return {
            default(slotData2, key) {
              var _a, _b, _c, _d;
              const currentKey = instanceKey;
              if (key)
                instanceKey = key;
              if (slotData2)
                (_a = instanceScopes.get(instanceKey)) == null ? void 0 : _a.unshift(slotData2);
              if (iterationData)
                (_b = instanceScopes.get(instanceKey)) == null ? void 0 : _b.unshift(iterationData);
              const c = produceChildren(iterationData);
              if (slotData2)
                (_c = instanceScopes.get(instanceKey)) == null ? void 0 : _c.shift();
              if (iterationData)
                (_d = instanceScopes.get(instanceKey)) == null ? void 0 : _d.shift();
              instanceKey = currentKey;
              return c;
            }
          };
        };
        children.slot = true;
      } else {
        children = () => ({});
      }
    }
    if ("for" in node && node.for) {
      const values = node.for.length === 3 ? node.for[2] : node.for[1];
      const getValues = typeof values === "string" && values.startsWith("$") ? provider(compile(values)) : () => values;
      iterator = [
        getValues,
        node.for[0],
        node.for.length === 3 ? String(node.for[1]) : null
      ];
    }
    return [condition, element, attrs, children, alternate, iterator, resolve2];
  }
  function createSlots(children, iterationData) {
    const slots = children(iterationData);
    const currentKey = instanceKey;
    return Object.keys(slots).reduce((allSlots, slotName) => {
      const slotFn = slots && slots[slotName];
      allSlots[slotName] = (data) => {
        return slotFn && slotFn(data, currentKey) || null;
      };
      return allSlots;
    }, {});
  }
  function createElement(library2, node) {
    const [condition, element, attrs, children, alternate, iterator, resolve2] = parseNode(library2, node);
    let createNodes = (iterationData) => {
      if (condition && element === null && children) {
        return condition() ? children(iterationData) : alternate && alternate(iterationData);
      }
      if (element && (!condition || condition())) {
        if (element === "text" && children) {
          return createTextVNode(String(children()));
        }
        if (element === "slot" && children)
          return children(iterationData);
        const el = resolve2 ? resolveComponent(element) : element;
        const slots = (children == null ? void 0 : children.slot) ? createSlots(children, iterationData) : null;
        return h(
          el,
          attrs(),
          slots || (children ? children(iterationData) : [])
        );
      }
      return typeof alternate === "function" ? alternate(iterationData) : alternate;
    };
    if (iterator) {
      const repeatedNode = createNodes;
      const [getValues, valueName, keyName] = iterator;
      createNodes = () => {
        const _v = getValues();
        const values = Number.isFinite(_v) ? Array(Number(_v)).fill(0).map((_, i) => i) : _v;
        const fragment2 = [];
        if (typeof values !== "object")
          return null;
        const instanceScope = instanceScopes.get(instanceKey) || [];
        const isArray2 = Array.isArray(values);
        for (const key in values) {
          if (isArray2 && key in Array.prototype)
            continue;
          const iterationData = Object.defineProperty(
            {
              ...instanceScope.reduce(
                (previousIterationData, scopedData) => {
                  if (previousIterationData.__idata) {
                    return { ...previousIterationData, ...scopedData };
                  }
                  return scopedData;
                },
                {}
              ),
              [valueName]: values[key],
              ...keyName !== null ? { [keyName]: isArray2 ? Number(key) : key } : {}
            },
            "__idata",
            { enumerable: false, value: true }
          );
          instanceScope.unshift(iterationData);
          fragment2.push(repeatedNode.bind(null, iterationData)());
          instanceScope.shift();
        }
        return fragment2;
      };
    }
    return createNodes;
  }
  function createElements(library2, schema2) {
    if (Array.isArray(schema2)) {
      const els = schema2.map(createElement.bind(null, library2));
      return (iterationData) => els.map((element2) => element2(iterationData));
    }
    const element = createElement(library2, schema2);
    return (iterationData) => element(iterationData);
  }
  const providers = [];
  function provider(compiled, hints = {}) {
    const compiledFns = /* @__PURE__ */ new WeakMap();
    providers.push((callback, key) => {
      compiledFns.set(
        key,
        compiled.provide((tokens) => callback(tokens, hints))
      );
    });
    return () => compiledFns.get(instanceKey)();
  }
  function createInstance2(providerCallback, key) {
    memoKey ?? (memoKey = toMemoKey(schema));
    const [render, compiledProviders] = has(memo, memoKey) ? memo[memoKey] : [createElements(library, schema), providers];
    if (!isServer2) {
      memoKeys[memoKey] ?? (memoKeys[memoKey] = 0);
      memoKeys[memoKey]++;
      memo[memoKey] = [render, compiledProviders];
    }
    compiledProviders.forEach((compiledProvider) => {
      compiledProvider(providerCallback, key);
    });
    return () => {
      instanceKey = key;
      return render();
    };
  }
  return createInstance2;
}
function useScope(token3, defaultValue) {
  const scopedData = instanceScopes.get(instanceKey) || [];
  let scopedValue = void 0;
  if (scopedData.length) {
    scopedValue = getValue(scopedData, token3.split("."));
  }
  return scopedValue === void 0 ? defaultValue : scopedValue;
}
function slotData(data, key) {
  return new Proxy(data, {
    get(...args) {
      let data2 = void 0;
      const property = args[1];
      if (typeof property === "string") {
        const prevKey = instanceKey;
        instanceKey = key;
        data2 = useScope(property, void 0);
        instanceKey = prevKey;
      }
      return data2 !== void 0 ? data2 : Reflect.get(...args);
    }
  });
}
function createRenderFn(instanceCreator, data, instanceKey2) {
  return instanceCreator(
    (requirements, hints = {}) => {
      return requirements.reduce((tokens, token3) => {
        if (token3.startsWith("slots.")) {
          const slot = token3.substring(6);
          const hasSlot = () => data.slots && has(data.slots, slot) && typeof data.slots[slot] === "function";
          if (hints.if) {
            tokens[token3] = hasSlot;
          } else if (data.slots) {
            const scopedData = slotData(data, instanceKey2);
            tokens[token3] = () => hasSlot() ? data.slots[slot](scopedData) : null;
          }
        } else {
          const value = getRef(token3, data);
          tokens[token3] = () => useScope(token3, value.value);
        }
        return tokens;
      }, {});
    },
    instanceKey2
  );
}
function clean(schema, memoKey, instanceKey2) {
  memoKey ?? (memoKey = toMemoKey(schema));
  memoKeys[memoKey]--;
  if (memoKeys[memoKey] === 0) {
    delete memoKeys[memoKey];
    const [, providers] = memo[memoKey];
    delete memo[memoKey];
    providers.length = 0;
  }
  instanceScopes.delete(instanceKey2);
}
function toMemoKey(schema) {
  return JSON.stringify(schema, (_, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });
}
var FormKitSchema = /* @__PURE__ */ defineComponent({
  name: "FormKitSchema",
  props: {
    schema: {
      type: [Array, Object],
      required: true
    },
    data: {
      type: Object,
      default: () => ({})
    },
    library: {
      type: Object,
      default: () => ({})
    },
    memoKey: {
      type: String,
      required: false
    }
  },
  emits: ["mounted"],
  setup(props, context) {
    var _a;
    const instance = getCurrentInstance();
    let instanceKey2 = {};
    instanceScopes.set(instanceKey2, []);
    const library = { FormKit: markRaw(FormKit_default), ...props.library };
    let provider = parseSchema(library, props.schema, props.memoKey);
    let render;
    let data;
    if (!isServer2) {
      watch$1(
        () => props.schema,
        (newSchema, oldSchema) => {
          var _a2;
          const oldKey = instanceKey2;
          instanceKey2 = {};
          instanceScopes.set(instanceKey2, []);
          provider = parseSchema(library, props.schema, props.memoKey);
          render = createRenderFn(provider, data, instanceKey2);
          if (newSchema === oldSchema) {
            ((_a2 = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a2.$forceUpdate).call(_a2);
          }
          clean(props.schema, props.memoKey, oldKey);
        },
        { deep: true }
      );
    }
    watchEffect(() => {
      data = Object.assign(reactive(props.data ?? {}), {
        slots: context.slots
      });
      context.slots;
      render = createRenderFn(provider, data, instanceKey2);
    });
    function cleanUp2() {
      clean(props.schema, props.memoKey, instanceKey2);
      if (data.node)
        data.node.destroy();
      data.slots = null;
      data = null;
      render = null;
    }
    onMounted(() => context.emit("mounted"));
    onUnmounted(cleanUp2);
    onSSRComplete((_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app, cleanUp2);
    return () => render ? render() : null;
  }
});
var FormKitSchema_default = FormKitSchema;
var isServer3 = typeof window === "undefined";
var parentSymbol = Symbol("FormKitParent");
var componentSymbol = Symbol("FormKitComponentCallback");
function FormKit(props, context) {
  const node = useInput(props, context);
  if (!node.props.definition)
    error(600, node);
  if (node.props.definition.component) {
    return () => {
      var _a;
      return h(
        (_a = node.props.definition) == null ? void 0 : _a.component,
        {
          context: node.context
        },
        { ...context.slots }
      );
    };
  }
  const schema = ref([]);
  let memoKey = node.props.definition.schemaMemoKey;
  const generateSchema = () => {
    var _a, _b;
    const schemaDefinition = (_b = (_a = node.props) == null ? void 0 : _a.definition) == null ? void 0 : _b.schema;
    if (!schemaDefinition)
      error(601, node);
    if (typeof schemaDefinition === "function") {
      schema.value = schemaDefinition({ ...props.sectionsSchema || {} });
      if (memoKey && props.sectionsSchema || "memoKey" in schemaDefinition && typeof schemaDefinition.memoKey === "string") {
        memoKey = (memoKey ?? (schemaDefinition == null ? void 0 : schemaDefinition.memoKey)) + JSON.stringify(props.sectionsSchema);
      }
    } else {
      schema.value = schemaDefinition;
    }
  };
  generateSchema();
  if (!isServer3) {
    node.on("schema", () => {
      memoKey += "♻️";
      generateSchema();
    });
  }
  context.emit("node", node);
  const definitionLibrary = node.props.definition.library;
  const library = {
    FormKit: markRaw(formkitComponent),
    ...definitionLibrary,
    ...props.library ?? {}
  };
  function didMount() {
    node.emit("mounted");
  }
  context.expose({ node });
  return () => h(
    FormKitSchema,
    {
      schema: schema.value,
      data: node.context,
      onMounted: didMount,
      library,
      memoKey
    },
    { ...context.slots }
  );
}
var formkitComponent = /* @__PURE__ */ defineComponent(
  FormKit,
  {
    props: runtimeProps,
    inheritAttrs: false
  }
);
var FormKit_default = formkitComponent;
var rootSymbol = Symbol();
function createPlugin(app2, options2) {
  app2.component(options2.alias || "FormKit", FormKit_default).component(options2.schemaAlias || "FormKitSchema", FormKitSchema_default);
  return {
    get: getNode,
    setLocale: (locale) => {
      var _a;
      if ((_a = options2.config) == null ? void 0 : _a.rootConfig) {
        options2.config.rootConfig.locale = locale;
      }
    },
    clearErrors: clearErrors2,
    setErrors: setErrors2,
    submit: submitForm,
    reset
  };
}
var optionsSymbol = Symbol.for("FormKitOptions");
var configSymbol = Symbol.for("FormKitConfig");
var plugin = {
  install(app2, _options) {
    const options2 = Object.assign(
      {
        alias: "FormKit",
        schemaAlias: "FormKitSchema"
      },
      typeof _options === "function" ? _options() : _options
    );
    const rootConfig = createConfig(options2.config || {});
    options2.config = { rootConfig };
    app2.config.globalProperties.$formkit = createPlugin(app2, options2);
    app2.provide(optionsSymbol, options2);
    app2.provide(configSymbol, rootConfig);
    if (typeof window !== "undefined") {
      globalThis.__FORMKIT_CONFIGS__ = (globalThis.__FORMKIT_CONFIGS__ || []).concat([rootConfig]);
    }
  }
};
var isBrowser$1 = typeof window !== "undefined";
var pseudoProps = [
  // Boolean props
  "ignore",
  "disabled",
  "preserve",
  // String props
  "help",
  "label",
  /^preserve(-e|E)rrors/,
  /^[a-z]+(?:-visibility|Visibility|-behavior|Behavior)$/,
  /^[a-zA-Z-]+(?:-class|Class)$/,
  "prefixIcon",
  "suffixIcon",
  /^[a-zA-Z-]+(?:-icon|Icon)$/
];
var boolProps = ["disabled", "ignore", "preserve"];
function classesToNodeProps(node, props) {
  if (props.classes) {
    Object.keys(props.classes).forEach(
      (key) => {
        if (typeof key === "string") {
          node.props[`_${key}Class`] = props.classes[key];
          if (isObject$1(props.classes[key]) && key === "inner")
            Object.values(props.classes[key]);
        }
      }
    );
  }
}
function onlyListeners(props) {
  if (!props)
    return {};
  const knownListeners = ["Submit", "SubmitRaw", "SubmitInvalid"].reduce(
    (listeners, listener) => {
      const name = `on${listener}`;
      if (name in props) {
        if (typeof props[name] === "function") {
          listeners[name] = props[name];
        }
      }
      return listeners;
    },
    {}
  );
  return knownListeners;
}
function useInput(props, context, options2 = {}) {
  const config2 = Object.assign({}, inject(optionsSymbol) || {}, options2);
  const __root = inject(rootSymbol, ref(isBrowser$1 ? document : void 0));
  const __cmpCallback = inject(componentSymbol, () => {
  });
  const instance = getCurrentInstance();
  const listeners = onlyListeners(instance == null ? void 0 : instance.vnode.props);
  const isVModeled = ["modelValue", "model-value"].some(
    (prop) => prop in ((instance == null ? void 0 : instance.vnode.props) ?? {})
  );
  let isMounted = false;
  onMounted(() => {
    isMounted = true;
  });
  const value = props.modelValue !== void 0 ? props.modelValue : cloneAny(context.attrs.value);
  function createInitialProps() {
    const initialProps2 = {
      ...nodeProps(props),
      ...listeners,
      type: props.type ?? "text",
      __root: __root.value,
      __slots: context.slots
    };
    const attrs = except(nodeProps(context.attrs), pseudoProps);
    if (!attrs.key)
      attrs.key = token$1();
    initialProps2.attrs = attrs;
    const propValues = only(nodeProps(context.attrs), pseudoProps);
    for (const propName in propValues) {
      if (boolProps.includes(propName) && propValues[propName] === "") {
        propValues[propName] = true;
      }
      initialProps2[camel(propName)] = propValues[propName];
    }
    const classesProps = { props: {} };
    classesToNodeProps(classesProps, props);
    Object.assign(initialProps2, classesProps.props);
    if (typeof initialProps2.type !== "string") {
      initialProps2.definition = initialProps2.type;
      delete initialProps2.type;
    }
    return initialProps2;
  }
  const initialProps = createInitialProps();
  const parent = initialProps.ignore ? null : props.parent || inject(parentSymbol, null);
  const node = createNode(
    extend$2(
      config2 || {},
      {
        name: props.name || void 0,
        value,
        parent,
        plugins: (config2.plugins || []).concat(props.plugins ?? []),
        config: props.config || {},
        props: initialProps,
        index: props.index,
        sync: !!undefine(context.attrs.sync || context.attrs.dynamic)
      },
      false,
      true
    )
  );
  __cmpCallback(node);
  if (!node.props.definition)
    error(600, node);
  const lateBoundProps = ref(
    new Set(
      Array.isArray(node.props.__propDefs) ? node.props.__propDefs : Object.keys(node.props.__propDefs ?? {})
    )
  );
  node.on(
    "added-props",
    ({ payload: lateProps }) => {
      const propNames = Array.isArray(lateProps) ? lateProps : Object.keys(lateProps ?? {});
      propNames.forEach((newProp) => lateBoundProps.value.add(newProp));
    }
  );
  const pseudoPropNames = computed(
    () => pseudoProps.concat([...lateBoundProps.value]).reduce((names, prop) => {
      if (typeof prop === "string") {
        names.push(camel(prop));
        names.push(kebab(prop));
      } else {
        names.push(prop);
      }
      return names;
    }, [])
  );
  watchEffect(() => classesToNodeProps(node, props));
  const passThrough = nodeProps(props);
  for (const prop in passThrough) {
    watch$1(
      () => props[prop],
      () => {
        if (props[prop] !== void 0) {
          node.props[prop] = props[prop];
        }
      }
    );
  }
  watchEffect(() => {
    node.props.__root = __root.value;
  });
  const attributeWatchers = /* @__PURE__ */ new Set();
  const possibleProps = nodeProps(context.attrs);
  watchEffect(() => {
    watchAttributes(only(possibleProps, pseudoPropNames.value));
  });
  function watchAttributes(attrProps) {
    attributeWatchers.forEach((stop) => {
      stop();
      attributeWatchers.delete(stop);
    });
    for (const prop in attrProps) {
      const camelName = camel(prop);
      attributeWatchers.add(
        watch$1(
          () => context.attrs[prop],
          () => {
            node.props[camelName] = context.attrs[prop];
          }
        )
      );
    }
  }
  watchEffect(() => {
    const attrs = except(nodeProps(context.attrs), pseudoPropNames.value);
    if ("multiple" in attrs)
      attrs.multiple = undefine(attrs.multiple);
    if (typeof attrs.onBlur === "function") {
      attrs.onBlur = oncePerTick(attrs.onBlur);
    }
    node.props.attrs = Object.assign({}, node.props.attrs || {}, attrs);
  });
  watchEffect(() => {
    const messages3 = (props.errors ?? []).map(
      (error3) => /* @__PURE__ */ createMessage({
        key: slugify(error3),
        type: "error",
        value: error3,
        meta: { source: "prop" }
      })
    );
    node.store.apply(
      messages3,
      (message3) => message3.type === "error" && message3.meta.source === "prop"
    );
  });
  if (node.type !== "input") {
    const sourceKey = `${node.name}-prop`;
    watchEffect(() => {
      const inputErrors = props.inputErrors ?? {};
      const keys = Object.keys(inputErrors);
      if (!keys.length)
        node.clearErrors(true, sourceKey);
      const messages3 = keys.reduce((messages4, key) => {
        let value2 = inputErrors[key];
        if (typeof value2 === "string")
          value2 = [value2];
        if (Array.isArray(value2)) {
          messages4[key] = value2.map(
            (error3) => /* @__PURE__ */ createMessage({
              key: error3,
              type: "error",
              value: error3,
              meta: { source: sourceKey }
            })
          );
        }
        return messages4;
      }, {});
      node.store.apply(
        messages3,
        (message3) => message3.type === "error" && message3.meta.source === sourceKey
      );
    });
  }
  watchEffect(() => Object.assign(node.config, props.config));
  if (node.type !== "input") {
    provide(parentSymbol, node);
  }
  let clonedValueBeforeVmodel = void 0;
  node.on("modelUpdated", () => {
    var _a, _b;
    context.emit("inputRaw", (_a = node.context) == null ? void 0 : _a.value, node);
    if (isMounted) {
      context.emit("input", (_b = node.context) == null ? void 0 : _b.value, node);
    }
    if (isVModeled && node.context) {
      clonedValueBeforeVmodel = cloneAny(node.value);
      context.emit("update:modelValue", shallowClone(node.value));
    }
  });
  if (isVModeled) {
    watch$1(
      toRef(props, "modelValue"),
      (value2) => {
        if (!eq(clonedValueBeforeVmodel, value2)) {
          node.input(value2, false);
        }
      },
      { deep: true }
    );
    if (node.value !== value) {
      node.emit("modelUpdated");
    }
  }
  onBeforeUnmount(() => node.destroy());
  return node;
}
var messages = /* @__PURE__ */ createSection("messages", () => ({
  $el: "ul",
  if: "$fns.length($messages)"
}));
var message = /* @__PURE__ */ createSection("message", () => ({
  $el: "li",
  for: ["message", "$messages"],
  attrs: {
    key: "$message.key",
    id: `$id + '-' + $message.key`,
    "data-message-type": "$message.type"
  }
}));
messages(message("$message.value"));
var summary = /* @__PURE__ */ createSection("summary", () => ({
  $el: "div",
  attrs: {
    "aria-live": "polite"
  }
}));
var summaryInner = /* @__PURE__ */ createSection("summaryInner", () => ({
  $el: "div",
  if: "$summaries.length && $showSummaries"
}));
var messages2 = /* @__PURE__ */ createSection("messages", () => ({
  $el: "ul",
  if: "$summaries.length && $showSummaries"
}));
var message2 = /* @__PURE__ */ createSection("message", () => ({
  $el: "li",
  for: ["summary", "$summaries"],
  attrs: {
    key: "$summary.key",
    "data-message-type": "$summary.type"
  }
}));
var summaryHeader = /* @__PURE__ */ createSection("summaryHeader", () => ({
  $el: "h2",
  attrs: {
    id: "$id"
  }
}));
var messageLink = /* @__PURE__ */ createSection("messageLink", () => ({
  $el: "a",
  attrs: {
    id: "$summary.key",
    href: '$: "#" + $summary.id',
    onClick: "$jumpLink"
  }
}));
summary(
  summaryInner(
    summaryHeader("$summaryHeader"),
    messages2(message2(messageLink("$summary.message")))
  )
);
init_defaultConfig();
init_bindings();
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString = typeOfTest("string");
const isFunction = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach$1(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach$1(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach$1(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches3;
  const arr = [];
  while ((matches3 = regExp.exec(str)) !== null) {
    arr.push(matches3);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer2(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach$1(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define2 = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define2(arrayOrString) : define2(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size2 = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length: length3 } = alphabet;
  while (size2--) {
    str += alphabet[Math.random() * length3 | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack2 = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack2.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack2[i] = source;
        const target2 = isArray(source) ? [] : {};
        forEach$1(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target2[key] = reducedValue);
        });
        stack2[i] = void 0;
        return target2;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
const utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach: forEach$1,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};
function AxiosError(message3, code, config2, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message3;
  this.name = "AxiosError";
  code && (this.code = code);
  config2 && (this.config = config2);
  request && (this.request = request);
  response && (this.response = response);
}
utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error2, code, config2, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils$1.toFlatObject(error2, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error2.message, code, config2, request, response);
  axiosError.cause = error2;
  axiosError.name = error2.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}
function removeBrackets(key) {
  return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token2, i) {
    token2 = removeBrackets(token2);
    return !dots && i ? "[" + token2 + "]" : token2;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options2) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options2 = utils$1.toFlatObject(options2, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option2, source) {
    return !utils$1.isUndefined(source[option2]);
  });
  const metaTokens = options2.metaTokens;
  const visitor = options2.visitor || defaultVisitor;
  const dots = options2.dots;
  const indexes = options2.indexes;
  const _Blob = options2.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
  if (!utils$1.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils$1.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError("Blob is not supported. Use a Buffer instead.");
    }
    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils$1.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack2 = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils$1.isUndefined(value)) return;
    if (stack2.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack2.push(value);
    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils$1.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack2.pop();
  }
  if (!utils$1.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer2(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options2) {
  this._pairs = [];
  params && toFormData(params, this, options2);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url3, params, options2) {
  if (!params) {
    return url3;
  }
  const _encode = options2 && options2.encode || encode;
  const serializeFn = options2 && options2.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options2);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options2).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url3.indexOf("#");
    if (hashmarkIndex !== -1) {
      url3 = url3.slice(0, hashmarkIndex);
    }
    url3 += (url3.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url3;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options2) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options2 ? options2.synchronous : false,
      runWhen: options2 ? options2.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  }
}
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
const hasStandardBrowserEnv = ((product) => {
  return hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0;
})(typeof navigator !== "undefined" && navigator.product);
const hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const origin = hasBrowserEnv && window.location.href || "http://localhost";
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv,
  hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv,
  origin
}, Symbol.toStringTag, { value: "Module" }));
const platform = {
  ...utils,
  ...platform$1
};
function toURLEncodedForm(data, options2) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options2));
}
function parsePropPath(name) {
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target2, index) {
    let name = path[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target2) ? target2.length : name;
    if (isLast) {
      if (utils$1.hasOwnProp(target2, name)) {
        target2[name] = [target2[name], value];
      } else {
        target2[name] = value;
      }
      return !isNumericKey;
    }
    if (!target2[name] || !utils$1.isObject(target2[name])) {
      target2[name] = [];
    }
    const result = buildPath(path, value, target2[name], index);
    if (result && utils$1.isArray(target2[name])) {
      target2[name] = arrayToObject(target2[name]);
    }
    return !isNumericKey;
  }
  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};
    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils$1.isObject(data);
    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils$1.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }
    if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
const ignoreDuplicateOf = utils$1.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils$1.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils$1.isString(value)) return;
  if (utils$1.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils$1.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils$1.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$1.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$1.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils$1.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed2 = new this(first);
    targets.forEach((target2) => computed2.set(target2));
    return computed2;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils$1.freezeMethods(AxiosHeaders);
function transformData(fns, response) {
  const config2 = this || defaults;
  const context = response || config2;
  const headers = AxiosHeaders.from(context.headers);
  let data = context.data;
  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config2, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message3, config2, request) {
  AxiosError.call(this, message3 == null ? "canceled" : message3, AxiosError.ERR_CANCELED, config2, request);
  this.name = "CanceledError";
}
utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});
function settle(resolve2, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(new AxiosError(
      "Request failed with status code " + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
function parseProtocol(url3) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url3);
  return match && match[1] || "";
}
function speedometer(samplesCount, min3) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min3 = min3 !== void 0 ? min3 : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min3) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1e3 / freq;
  let timer = null;
  return function throttled() {
    const force = this === true;
    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, arguments);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, arguments);
      }, threshold - (now - timestamp));
    }
  };
}
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return throttle((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  }, freq);
};
const isURLSameOrigin = platform.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url3) {
      let href = url3;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      const parsed = utils$1.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function nonStandardBrowserEnv() {
    return function isURLSameOrigin2() {
      return true;
    };
  }()
);
const cookies = platform.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + "=" + encodeURIComponent(value)];
      utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
      utils$1.isString(path) && cookie.push("path=" + path);
      utils$1.isString(domain) && cookie.push("domain=" + domain);
      secure === true && cookie.push("secure");
      document.cookie = cookie.join("; ");
    },
    read(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function isAbsoluteURL(url3) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url3);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config3 = {};
  function getMergedValue(target2, source, caseless) {
    if (utils$1.isPlainObject(target2) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({ caseless }, target2, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
  });
  return config3;
}
const resolveConfig = (config2) => {
  const newConfig = mergeConfig({}, config2);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config2.params, config2.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  let contentType;
  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if ((contentType = headers.getContentType()) !== false) {
      const [type, ...tokens] = contentType ? contentType.split(";").map((token2) => token2.trim()).filter(Boolean) : [];
      headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
    }
  }
  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config2) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    const _config = resolveConfig(config2);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
    let { responseType } = _config;
    let onCanceled;
    function done() {
      if (_config.cancelToken) {
        _config.cancelToken.unsubscribe(onCanceled);
      }
      if (_config.signal) {
        _config.signal.removeEventListener("abort", onCanceled);
      }
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config2,
        request
      };
      settle(function _resolve(value) {
        resolve2(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, _config, request));
      request = null;
    };
    request.onerror = function handleError2() {
      reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, _config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        _config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (typeof _config.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(_config.onDownloadProgress, true));
    }
    if (typeof _config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(_config.onUploadProgress));
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config2, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config2));
      return;
    }
    request.send(requestData || null);
  });
};
const composeSignals = (signals, timeout) => {
  let controller = new AbortController();
  let aborted;
  const onabort = function(cancel) {
    if (!aborted) {
      aborted = true;
      unsubscribe();
      const err = cancel instanceof Error ? cancel : this.reason;
      controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
    }
  };
  let timer = timeout && setTimeout(() => {
    onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
  }, timeout);
  const unsubscribe = () => {
    if (signals) {
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach((signal2) => {
        signal2 && (signal2.removeEventListener ? signal2.removeEventListener("abort", onabort) : signal2.unsubscribe(onabort));
      });
      signals = null;
    }
  };
  signals.forEach((signal2) => signal2 && signal2.addEventListener && signal2.addEventListener("abort", onabort));
  const { signal } = controller;
  signal.unsubscribe = unsubscribe;
  return [signal, () => {
    timer && clearTimeout(timer);
    timer = null;
  }];
};
const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
const readBytes = async function* (iterable, chunkSize, encode2) {
  for await (const chunk of iterable) {
    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : await encode2(String(chunk)), chunkSize);
  }
};
const trackStream = (stream, chunkSize, onProgress, onFinish, encode2) => {
  const iterator = readBytes(stream, chunkSize, encode2);
  let bytes = 0;
  return new ReadableStream({
    type: "bytes",
    async pull(controller) {
      const { done, value } = await iterator.next();
      if (done) {
        controller.close();
        onFinish();
        return;
      }
      let len = value.byteLength;
      onProgress && onProgress(bytes += len);
      controller.enqueue(new Uint8Array(value));
    },
    cancel(reason) {
      onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  });
};
const fetchProgressDecorator = (total, fn) => {
  const lengthComputable = total != null;
  return (loaded) => setTimeout(() => fn({
    lengthComputable,
    total,
    loaded
  }));
};
const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
const supportsRequestStream = isReadableStreamSupported && (() => {
  let duplexAccessed = false;
  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      duplexAccessed = true;
      return "half";
    }
  }).headers.has("Content-Type");
  return duplexAccessed && !hasContentType;
})();
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const supportsResponseStream = isReadableStreamSupported && !!(() => {
  try {
    return utils$1.isReadableStream(new Response("").body);
  } catch (err) {
  }
})();
const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};
isFetchSupported && ((res) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config2) => {
      throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config2);
    });
  });
})(new Response());
const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils$1.isBlob(body)) {
    return body.size;
  }
  if (utils$1.isSpecCompliantForm(body)) {
    return (await new Request(body).arrayBuffer()).byteLength;
  }
  if (utils$1.isArrayBufferView(body)) {
    return body.byteLength;
  }
  if (utils$1.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
const resolveBodyLength = async (headers, body) => {
  const length3 = utils$1.toFiniteNumber(headers.getContentLength());
  return length3 == null ? getBodyLength(body) : length3;
};
const fetchAdapter = isFetchSupported && (async (config2) => {
  let {
    url: url3,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = "same-origin",
    fetchOptions
  } = resolveConfig(config2);
  responseType = responseType ? (responseType + "").toLowerCase() : "text";
  let [composedSignal, stopTimeout] = signal || cancelToken || timeout ? composeSignals([signal, cancelToken], timeout) : [];
  let finished, request;
  const onFinish = () => {
    !finished && setTimeout(() => {
      composedSignal && composedSignal.unsubscribe();
    });
    finished = true;
  };
  let requestContentLength;
  try {
    if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
      let _request = new Request(url3, {
        method: "POST",
        body: data,
        duplex: "half"
      });
      let contentTypeHeader;
      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
        headers.setContentType(contentTypeHeader);
      }
      if (_request.body) {
        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
          requestContentLength,
          progressEventReducer(onUploadProgress)
        ), null, encodeText);
      }
    }
    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? "cors" : "omit";
    }
    request = new Request(url3, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      withCredentials
    });
    let response = await fetch(request);
    const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
      const options2 = {};
      ["status", "statusText", "headers"].forEach((prop) => {
        options2[prop] = response[prop];
      });
      const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
          responseContentLength,
          progressEventReducer(onDownloadProgress, true)
        ), isStreamResponse && onFinish, encodeText),
        options2
      );
    }
    responseType = responseType || "text";
    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config2);
    !isStreamResponse && onFinish();
    stopTimeout && stopTimeout();
    return await new Promise((resolve2, reject) => {
      settle(resolve2, reject, {
        data: responseData,
        headers: AxiosHeaders.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config: config2,
        request
      });
    });
  } catch (err) {
    onFinish();
    if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError("Network Error", AxiosError.ERR_NETWORK, config2, request),
        {
          cause: err.cause || err
        }
      );
    }
    throw AxiosError.from(err, err && err.code, config2, request);
  }
});
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};
utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
    const { length: length3 } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length3; i++) {
      nameOrAdapter = adapters2[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length3 ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config2) {
  if (config2.cancelToken) {
    config2.cancelToken.throwIfRequested();
  }
  if (config2.signal && config2.signal.aborted) {
    throw new CanceledError(null, config2);
  }
}
function dispatchRequest(config2) {
  throwIfCancellationRequested(config2);
  config2.headers = AxiosHeaders.from(config2.headers);
  config2.data = transformData.call(
    config2,
    config2.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config2.method) !== -1) {
    config2.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config2.adapter || defaults.adapter);
  return adapter(config2).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config2);
    response.data = transformData.call(
      config2,
      config2.transformResponse,
      response
    );
    response.headers = AxiosHeaders.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config2);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config2,
          config2.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const VERSION = "1.7.2";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message3) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message3 ? ". " + message3 : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options2, schema, allowUnknown) {
  if (typeof options2 !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options2);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options2[opt];
      const result = value === void 0 || validator2(value, opt, options2);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config2) {
    try {
      return await this._request(configOrUrl, config2);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;
        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : dummy = new Error();
        const stack2 = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack2;
          } else if (stack2 && !String(err.stack).endsWith(stack2.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack2;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config2) {
    if (typeof configOrUrl === "string") {
      config2 = config2 || {};
      config2.url = configOrUrl;
    } else {
      config2 = configOrUrl || {};
    }
    config2 = mergeConfig(this.defaults, config2);
    const { transitional: transitional2, paramsSerializer, headers } = config2;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config2.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    config2.method = (config2.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config2.method]
    );
    headers && utils$1.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config2.headers = AxiosHeaders.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config2);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config2;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error2) {
        onRejected.call(this, error2);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error2) {
      return Promise.reject(error2);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config2) {
    config2 = mergeConfig(this.defaults, config2);
    const fullPath = buildFullPath(config2.baseURL, config2.url);
    return buildURL(fullPath, config2.params, config2.paramsSerializer);
  }
}
utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url3, config2) {
    return this.request(mergeConfig(config2 || {}, {
      method,
      url: url3,
      data: (config2 || {}).data
    }));
  };
});
utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url3, data, config2) {
      return this.request(mergeConfig(config2 || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url3,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve2) {
      resolvePromise = resolve2;
    });
    const token2 = this;
    this.promise.then((cancel) => {
      if (!token2._listeners) return;
      let i = token2._listeners.length;
      while (i-- > 0) {
        token2._listeners[i](cancel);
      }
      token2._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve2) => {
        token2.subscribe(resolve2);
        _resolve = resolve2;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token2.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message3, config2, request) {
      if (token2.reason) {
        return;
      }
      token2.reason = new CanceledError(message3, config2, request);
      resolvePromise(token2.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token2 = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token2,
      cancel
    };
  }
}
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils$1.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
function createInstance(defaultConfig2) {
  const context = new Axios(defaultConfig2);
  const instance = bind(Axios.prototype.request, context);
  utils$1.extend(instance, Axios.prototype, context, { allOwnKeys: true });
  utils$1.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig2, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults);
axios.Axios = Axios;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders;
axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode;
axios.default = axios;
let host = location.origin;
if (host.includes("//localhost")) host = "https://adm.mypcstore.com.tw";
function fetchStatus(btype) {
  return axios({
    "method": "POST",
    "url": `${host}/api/collaboration/get_salecase.php`,
    "headers": {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    "data": `btype=${btype}`
  }).then((res) => {
    var _a, _b, _c;
    if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "OK") {
      return { data: res.data.data };
    }
    if (((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.status) === "ERROR") {
      if (res.data.msg == "Wait") {
        return { href: "apply_ordlist.htm" };
      }
      if (res.data.msg == "File") {
        return { step: "attachment" };
      }
    }
    return { msg: ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.msg) || "資料取得錯誤" };
  }).catch((error2) => {
    console.log(error2);
    return { msg: "資料取得異常" };
  });
}
function postData(btype, caseData, formData) {
  const body = new FormData();
  body.append("btype", btype);
  body.append("totalamount", caseData.casePrice.value);
  body.append("contractno", caseData.caseContractNo.value);
  body.append("caseid", caseData.caseId.value);
  body.append("rutid", formData.ruten_account);
  body.append("shipway", formData.shipway);
  body.append("corp_doc", formData.attachment.corp_doc[0].file);
  return axios.post(
    `${host}/api/collaboration/chk_savedata.php`,
    body,
    {
      headers: {
        "Accept": "application/json, text/javascript",
        "Content-Type": "multipart/form-data; charset=UTF-8"
      },
      timeout: 6e4
    }
  ).then((res) => {
    var _a, _b, _c;
    if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "OK") {
      return { status: true, href: "apply_ordlist.htm" };
    }
    if (((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.status) === "ERROR") {
      return { msg: res.data.msg };
    }
    return { msg: ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.msg) || "資料上傳錯誤" };
  }).catch((error2) => {
    console.log(error2);
    return { msg: "資料上傳異常" };
  });
}
function ruten_account_verify(ruten_account, btype) {
  return axios.post(
    `${host}/api/collaboration/chk_rutid.php?btype=${btype}`,
    `rutid=${ruten_account}`,
    {
      "Accept": "application/json, text/javascript",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  ).then((res) => {
    if (res.data.status === "OK") return false;
    if (res.data.status === "ERROR") return true;
    return treu;
  }).catch((err) => {
    return true;
  });
}
const _export_sfc = (sfc, props) => {
  const target2 = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target2[key] = val;
  }
  return target2;
};
const _withScopeId = (n) => (pushScopeId("data-v-505e9234"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "form-container" };
const _hoisted_2 = { class: "flex flex-col max-w-xs p-6 mx-auto text-center text-gray-900 bg-white" };
const _hoisted_3 = { class: "mb-4 text-2xl font-semibold" };
const _hoisted_4 = { class: "font-light text-gray-500 sm:text-lg" };
const _hoisted_5 = { class: "flex items-baseline justify-center my-8" };
const _hoisted_6 = { class: "mr-2 text-5xl font-extrabold" };
const _hoisted_7 = { class: "text-neutral-500 text-xs dark:text-neutral-400 formkit-help" };
const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_9 = ["href"];
const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("a", null, "請按此下載PChomePay支付連實質受益人聲明書", -1));
const _sfc_main = {
  __name: "AppFree",
  setup(__props) {
    const urlParams = new URLSearchParams(window.location.search);
    const btype = urlParams.get("btype") || "";
    ref("false");
    const caseId = ref("");
    const caseTitle = ref("");
    const caseIntro = ref("");
    const casePrice = ref(0);
    const caseContractNo = ref("");
    const ruten_account = ref("");
    const shipway = ref("");
    const shipwayList = ref([
      { value: "", label: "請選擇" },
      { value: "ALL", label: "郵寄寄送、宅配、超商取貨(7-11、全家、萊爾富)" },
      { value: "POS", label: "郵寄寄送、宅配" },
      { value: "CVS", label: "僅超商取貨(7-11、全家、萊爾富)" },
      { value: "LOW", label: "僅低溫寄送" }
    ]);
    const agreement_1 = ref(false);
    fetchStatus(btype).then((obj) => {
      if (obj.msg) alert(obj.msg);
      if (obj.href) {
        location.href = obj.href;
        return;
      }
      if (obj.data) {
        const { caseinfo } = obj.data;
        if (caseinfo) {
          const { caseid, title, intro, price, contractno } = caseinfo;
          caseId.value = caseid || caseId;
          caseTitle.value = title || caseTitle.value;
          caseIntro.value = intro || caseIntro.value;
          casePrice.value = price || casePrice.value;
          caseContractNo.value = contractno || caseContractNo.value;
        }
      }
    });
    async function account(item) {
      return await ruten_account_verify(item.value, btype);
    }
    async function handleDataSubmit(formData) {
      if (formData.delta !== 1) return false;
      const res = await postData(btype, {
        casePrice,
        caseContractNo,
        caseId
      }, formData.currentStep.value);
      if (res.msg) alert(res.msg);
      if (res.token) {
        token.value = res.token;
        return true;
      }
      return false;
    }
    async function handleAttachementSubmit(formData) {
      if (formData.delta !== 1) return false;
      const res = await postAttachment(btype, formData);
      if (res.msg) alert(res.msg);
      if (res.href) {
        location.href = res.href;
      }
      if (res.status) return true;
      return false;
    }
    return (_ctx, _cache) => {
      const _component_FormKit = resolveComponent("FormKit");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_FormKit, {
          type: "form",
          actions: false
        }, {
          default: withCtx(() => [
            createVNode(_component_FormKit, {
              type: "multi-step",
              id: "multi-step",
              "tab-style": "progress",
              "allow-incomplete": false
            }, {
              default: withCtx(() => [
                createVNode(_component_FormKit, {
                  label: "選擇方案",
                  type: "step",
                  name: "case",
                  "next-label": "選擇此方案",
                  "before-step-change": _ctx.handleCaseSubmit
                }, {
                  default: withCtx(() => [
                    createBaseVNode("div", _hoisted_2, [
                      createBaseVNode("h3", _hoisted_3, toDisplayString(caseTitle.value), 1),
                      createBaseVNode("p", _hoisted_4, toDisplayString(caseIntro.value), 1),
                      createBaseVNode("div", _hoisted_5, [
                        createBaseVNode("span", _hoisted_6, "$" + toDisplayString(casePrice.value), 1)
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["before-step-change"]),
                createVNode(_component_FormKit, {
                  label: "填寫資料",
                  type: "step",
                  name: "info",
                  "next-label": "上傳資料",
                  "before-step-change": handleDataSubmit
                }, {
                  stepPrevious: withCtx(() => []),
                  default: withCtx(() => [
                    createBaseVNode("div", null, [
                      createVNode(_component_FormKit, {
                        type: "text",
                        name: "ruten_account",
                        label: "露天帳號",
                        help: "若您填寫的「露天帳號」不符合露天市集規範，或未通過露天實名認證審查，商品將無法搬家至露天市集，後續將有專人與您聯繫確認",
                        modelValue: ruten_account.value,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => ruten_account.value = $event),
                        validation: "required|alphanumeric|(800)account",
                        "validation-rules": { account },
                        "validation-messages": { account: "此帳號尚未在露天註冊，請先前往露天市集註冊會員" }
                      }, null, 8, ["modelValue", "validation-rules"]),
                      createVNode(_component_FormKit, {
                        label: "商品預設運送方式",
                        type: "select",
                        value: shipway.value,
                        name: "shipway",
                        validation: "required",
                        options: shipwayList.value
                      }, {
                        help: withCtx(() => [
                          createBaseVNode("span", _hoisted_7, [
                            createTextVNode(" 搬家到露天的商品會套用此運方式。"),
                            _hoisted_8,
                            createTextVNode(" 請確認選擇的運送方式在"),
                            createBaseVNode("a", {
                              href: `show_contract.htm?type=apply&contractno=${caseContractNo.value}`,
                              target: "_blank",
                              class: "text-blue-400"
                            }, "「付款方式 > 單店運費設定」", 8, _hoisted_9),
                            createTextVNode(" 已設定運費金額 ")
                          ])
                        ]),
                        _: 1
                      }, 8, ["value", "options"]),
                      createVNode(_component_FormKit, {
                        "validation-label": "以上資料",
                        label: "我同意在商店街留存的資料（包含但不限於身分證影本資料及公司變更登記表等資料），得提供予露天市集國際資訊股份有限公司、拍付國際資訊股份有限公司留存",
                        type: "checkbox",
                        name: "agreement_1",
                        value: agreement_1.value,
                        validation: "accepted",
                        "validation-visibility": "dirty"
                      }, null, 8, ["value"])
                    ]),
                    createVNode(_component_FormKit, {
                      label: "上傳資料",
                      type: "step",
                      name: "attachment",
                      id: "attachment",
                      "next-label": "上傳",
                      "before-step-change": handleAttachementSubmit
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_FormKit, {
                          type: "file",
                          label: "實質受益人聲明書",
                          name: "corp_doc",
                          help: "格式限PDF、JPG、JPEG、PNG格式，大小限5M",
                          accept: ".jpg,.png,.pdf",
                          validation: "required"
                        }),
                        _hoisted_10
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_FormKit, {
                  label: "訂單明細",
                  type: "step",
                  name: "detail"
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-505e9234"]]);
const parents = /* @__PURE__ */ new Set();
const coords = /* @__PURE__ */ new WeakMap();
const siblings = /* @__PURE__ */ new WeakMap();
const animations = /* @__PURE__ */ new WeakMap();
const intersections = /* @__PURE__ */ new WeakMap();
const options = /* @__PURE__ */ new WeakMap();
const debounces = /* @__PURE__ */ new WeakMap();
const enabled = /* @__PURE__ */ new WeakSet();
let root;
let scrollX = 0;
let scrollY = 0;
const TGT = "__aa_tgt";
const DEL = "__aa_del";
const NEW = "__aa_new";
const handleMutations = (mutations) => {
  const elements = getElements(mutations);
  if (elements) {
    elements.forEach((el) => animate(el));
  }
};
const handleResizes = (entries) => {
  entries.forEach((entry) => {
    if (entry.target === root)
      updateAllPos();
    if (coords.has(entry.target))
      updatePos(entry.target);
  });
};
function observePosition(el) {
  const oldObserver = intersections.get(el);
  oldObserver === null || oldObserver === void 0 ? void 0 : oldObserver.disconnect();
  let rect = coords.get(el);
  let invocations = 0;
  const buffer = 5;
  if (!rect) {
    rect = getCoords(el);
    coords.set(el, rect);
  }
  const { offsetWidth, offsetHeight } = root;
  const rootMargins = [
    rect.top - buffer,
    offsetWidth - (rect.left + buffer + rect.width),
    offsetHeight - (rect.top + buffer + rect.height),
    rect.left - buffer
  ];
  const rootMargin = rootMargins.map((px) => `${-1 * Math.floor(px)}px`).join(" ");
  const observer = new IntersectionObserver(() => {
    ++invocations > 1 && updatePos(el);
  }, {
    root,
    threshold: 1,
    rootMargin
  });
  observer.observe(el);
  intersections.set(el, observer);
}
function updatePos(el) {
  clearTimeout(debounces.get(el));
  const optionsOrPlugin = getOptions(el);
  const delay = isPlugin(optionsOrPlugin) ? 500 : optionsOrPlugin.duration;
  debounces.set(el, setTimeout(async () => {
    const currentAnimation = animations.get(el);
    try {
      await (currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.finished);
      coords.set(el, getCoords(el));
      observePosition(el);
    } catch {
    }
  }, delay));
}
function updateAllPos() {
  clearTimeout(debounces.get(root));
  debounces.set(root, setTimeout(() => {
    parents.forEach((parent) => forEach(parent, (el) => lowPriority(() => updatePos(el))));
  }, 100));
}
function lowPriority(callback) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => callback());
  } else {
    requestAnimationFrame(() => callback());
  }
}
let resize;
const supportedBrowser = typeof window !== "undefined" && "ResizeObserver" in window;
if (supportedBrowser) {
  root = document.documentElement;
  new MutationObserver(handleMutations);
  resize = new ResizeObserver(handleResizes);
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    scrollX = window.scrollX;
  });
  resize.observe(root);
}
function getElements(mutations) {
  const observedNodes = mutations.reduce((nodes, mutation) => {
    return [
      ...nodes,
      ...Array.from(mutation.addedNodes),
      ...Array.from(mutation.removedNodes)
    ];
  }, []);
  const onlyCommentNodesObserved = observedNodes.every((node) => node.nodeName === "#comment");
  if (onlyCommentNodesObserved)
    return false;
  return mutations.reduce((elements, mutation) => {
    if (elements === false)
      return false;
    if (mutation.target instanceof Element) {
      target(mutation.target);
      if (!elements.has(mutation.target)) {
        elements.add(mutation.target);
        for (let i = 0; i < mutation.target.children.length; i++) {
          const child = mutation.target.children.item(i);
          if (!child)
            continue;
          if (DEL in child) {
            return false;
          }
          target(mutation.target, child);
          elements.add(child);
        }
      }
      if (mutation.removedNodes.length) {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const child = mutation.removedNodes[i];
          if (DEL in child) {
            return false;
          }
          if (child instanceof Element) {
            elements.add(child);
            target(mutation.target, child);
            siblings.set(child, [
              mutation.previousSibling,
              mutation.nextSibling
            ]);
          }
        }
      }
    }
    return elements;
  }, /* @__PURE__ */ new Set());
}
function target(el, child) {
  if (!child && !(TGT in el))
    Object.defineProperty(el, TGT, { value: el });
  else if (child && !(TGT in child))
    Object.defineProperty(child, TGT, { value: el });
}
function animate(el) {
  var _a;
  const isMounted = el.isConnected;
  const preExisting = coords.has(el);
  if (isMounted && siblings.has(el))
    siblings.delete(el);
  if (animations.has(el)) {
    (_a = animations.get(el)) === null || _a === void 0 ? void 0 : _a.cancel();
  }
  if (NEW in el) {
    add(el);
  } else if (preExisting && isMounted) {
    remain(el);
  } else if (preExisting && !isMounted) {
    remove(el);
  } else {
    add(el);
  }
}
function raw(str) {
  return Number(str.replace(/[^0-9.\-]/g, ""));
}
function getScrollOffset(el) {
  let p2 = el.parentElement;
  while (p2) {
    if (p2.scrollLeft || p2.scrollTop) {
      return { x: p2.scrollLeft, y: p2.scrollTop };
    }
    p2 = p2.parentElement;
  }
  return { x: 0, y: 0 };
}
function getCoords(el) {
  const rect = el.getBoundingClientRect();
  const { x, y } = getScrollOffset(el);
  return {
    top: rect.top + y,
    left: rect.left + x,
    width: rect.width,
    height: rect.height
  };
}
function getTransitionSizes(el, oldCoords, newCoords) {
  let widthFrom = oldCoords.width;
  let heightFrom = oldCoords.height;
  let widthTo = newCoords.width;
  let heightTo = newCoords.height;
  const styles = getComputedStyle(el);
  const sizing = styles.getPropertyValue("box-sizing");
  if (sizing === "content-box") {
    const paddingY = raw(styles.paddingTop) + raw(styles.paddingBottom) + raw(styles.borderTopWidth) + raw(styles.borderBottomWidth);
    const paddingX = raw(styles.paddingLeft) + raw(styles.paddingRight) + raw(styles.borderRightWidth) + raw(styles.borderLeftWidth);
    widthFrom -= paddingX;
    widthTo -= paddingX;
    heightFrom -= paddingY;
    heightTo -= paddingY;
  }
  return [widthFrom, widthTo, heightFrom, heightTo].map(Math.round);
}
function getOptions(el) {
  return TGT in el && options.has(el[TGT]) ? options.get(el[TGT]) : { duration: 250, easing: "ease-in-out" };
}
function getTarget(el) {
  if (TGT in el)
    return el[TGT];
  return void 0;
}
function isEnabled(el) {
  const target2 = getTarget(el);
  return target2 ? enabled.has(target2) : false;
}
function forEach(parent, ...callbacks) {
  callbacks.forEach((callback) => callback(parent, options.has(parent)));
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children.item(i);
    if (child) {
      callbacks.forEach((callback) => callback(child, options.has(child)));
    }
  }
}
function getPluginTuple(pluginReturn) {
  if (Array.isArray(pluginReturn))
    return pluginReturn;
  return [pluginReturn];
}
function isPlugin(config2) {
  return typeof config2 === "function";
}
function remain(el) {
  const oldCoords = coords.get(el);
  const newCoords = getCoords(el);
  if (!isEnabled(el))
    return coords.set(el, newCoords);
  let animation;
  if (!oldCoords)
    return;
  const pluginOrOptions = getOptions(el);
  if (typeof pluginOrOptions !== "function") {
    const deltaX = oldCoords.left - newCoords.left;
    const deltaY = oldCoords.top - newCoords.top;
    const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords, newCoords);
    const start = {
      transform: `translate(${deltaX}px, ${deltaY}px)`
    };
    const end = {
      transform: `translate(0, 0)`
    };
    if (widthFrom !== widthTo) {
      start.width = `${widthFrom}px`;
      end.width = `${widthTo}px`;
    }
    if (heightFrom !== heightTo) {
      start.height = `${heightFrom}px`;
      end.height = `${heightTo}px`;
    }
    animation = el.animate([start, end], {
      duration: pluginOrOptions.duration,
      easing: pluginOrOptions.easing
    });
  } else {
    const [keyframes] = getPluginTuple(pluginOrOptions(el, "remain", oldCoords, newCoords));
    animation = new Animation(keyframes);
    animation.play();
  }
  animations.set(el, animation);
  coords.set(el, newCoords);
  animation.addEventListener("finish", updatePos.bind(null, el));
}
function add(el) {
  if (NEW in el)
    delete el[NEW];
  const newCoords = getCoords(el);
  coords.set(el, newCoords);
  const pluginOrOptions = getOptions(el);
  if (!isEnabled(el))
    return;
  let animation;
  if (typeof pluginOrOptions !== "function") {
    animation = el.animate([
      { transform: "scale(.98)", opacity: 0 },
      { transform: "scale(0.98)", opacity: 0, offset: 0.5 },
      { transform: "scale(1)", opacity: 1 }
    ], {
      duration: pluginOrOptions.duration * 1.5,
      easing: "ease-in"
    });
  } else {
    const [keyframes] = getPluginTuple(pluginOrOptions(el, "add", newCoords));
    animation = new Animation(keyframes);
    animation.play();
  }
  animations.set(el, animation);
  animation.addEventListener("finish", updatePos.bind(null, el));
}
function cleanUp(el, styles) {
  var _a;
  el.remove();
  coords.delete(el);
  siblings.delete(el);
  animations.delete(el);
  (_a = intersections.get(el)) === null || _a === void 0 ? void 0 : _a.disconnect();
  setTimeout(() => {
    if (DEL in el)
      delete el[DEL];
    Object.defineProperty(el, NEW, { value: true, configurable: true });
    if (styles && el instanceof HTMLElement) {
      for (const style in styles) {
        el.style[style] = "";
      }
    }
  }, 0);
}
function remove(el) {
  var _a;
  if (!siblings.has(el) || !coords.has(el))
    return;
  const [prev, next] = siblings.get(el);
  Object.defineProperty(el, DEL, { value: true, configurable: true });
  const finalX = window.scrollX;
  const finalY = window.scrollY;
  if (next && next.parentNode && next.parentNode instanceof Element) {
    next.parentNode.insertBefore(el, next);
  } else if (prev && prev.parentNode) {
    prev.parentNode.appendChild(el);
  } else {
    (_a = getTarget(el)) === null || _a === void 0 ? void 0 : _a.appendChild(el);
  }
  if (!isEnabled(el))
    return cleanUp(el);
  const [top, left, width, height] = deletePosition(el);
  const optionsOrPlugin = getOptions(el);
  const oldCoords = coords.get(el);
  if (finalX !== scrollX || finalY !== scrollY) {
    adjustScroll(el, finalX, finalY, optionsOrPlugin);
  }
  let animation;
  let styleReset = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    margin: "0",
    pointerEvents: "none",
    transformOrigin: "center",
    zIndex: "100"
  };
  if (!isPlugin(optionsOrPlugin)) {
    Object.assign(el.style, styleReset);
    animation = el.animate([
      {
        transform: "scale(1)",
        opacity: 1
      },
      {
        transform: "scale(.98)",
        opacity: 0
      }
    ], { duration: optionsOrPlugin.duration, easing: "ease-out" });
  } else {
    const [keyframes, options2] = getPluginTuple(optionsOrPlugin(el, "remove", oldCoords));
    if ((options2 === null || options2 === void 0 ? void 0 : options2.styleReset) !== false) {
      styleReset = (options2 === null || options2 === void 0 ? void 0 : options2.styleReset) || styleReset;
      Object.assign(el.style, styleReset);
    }
    animation = new Animation(keyframes);
    animation.play();
  }
  animations.set(el, animation);
  animation.addEventListener("finish", cleanUp.bind(null, el, styleReset));
}
function adjustScroll(el, finalX, finalY, optionsOrPlugin) {
  const scrollDeltaX = scrollX - finalX;
  const scrollDeltaY = scrollY - finalY;
  const scrollBefore = document.documentElement.style.scrollBehavior;
  const scrollBehavior = getComputedStyle(root).scrollBehavior;
  if (scrollBehavior === "smooth") {
    document.documentElement.style.scrollBehavior = "auto";
  }
  window.scrollTo(window.scrollX + scrollDeltaX, window.scrollY + scrollDeltaY);
  if (!el.parentElement)
    return;
  const parent = el.parentElement;
  let lastHeight = parent.clientHeight;
  let lastWidth = parent.clientWidth;
  const startScroll = performance.now();
  function smoothScroll() {
    requestAnimationFrame(() => {
      if (!isPlugin(optionsOrPlugin)) {
        const deltaY = lastHeight - parent.clientHeight;
        const deltaX = lastWidth - parent.clientWidth;
        if (startScroll + optionsOrPlugin.duration > performance.now()) {
          window.scrollTo({
            left: window.scrollX - deltaX,
            top: window.scrollY - deltaY
          });
          lastHeight = parent.clientHeight;
          lastWidth = parent.clientWidth;
          smoothScroll();
        } else {
          document.documentElement.style.scrollBehavior = scrollBefore;
        }
      }
    });
  }
  smoothScroll();
}
function deletePosition(el) {
  const oldCoords = coords.get(el);
  const [width, , height] = getTransitionSizes(el, oldCoords, getCoords(el));
  let offsetParent = el.parentElement;
  while (offsetParent && (getComputedStyle(offsetParent).position === "static" || offsetParent instanceof HTMLBodyElement)) {
    offsetParent = offsetParent.parentElement;
  }
  if (!offsetParent)
    offsetParent = document.body;
  const parentStyles = getComputedStyle(offsetParent);
  const parentCoords = coords.get(offsetParent) || getCoords(offsetParent);
  const top = Math.round(oldCoords.top - parentCoords.top) - raw(parentStyles.borderTopWidth);
  const left = Math.round(oldCoords.left - parentCoords.left) - raw(parentStyles.borderLeftWidth);
  return [top, left, width, height];
}
var wrapper = /* @__PURE__ */ createSection("wrapper", () => ({
  $el: "div",
  attrs: {
    "data-tab-style": "$tabStyle",
    "data-hide-labels": "$hideProgressLabels"
  }
}));
var badge = /* @__PURE__ */ createSection("badge", () => ({
  $el: "span",
  attrs: {
    role: "presentation"
  }
}));
var stepActions = /* @__PURE__ */ createSection("stepActions", () => ({
  $el: "div"
}));
var stepInner = /* @__PURE__ */ createSection("stepInner", "div");
var stepNext = /* @__PURE__ */ createSection("stepNext", () => ({
  $el: "div",
  if: "$isLastStep === false || $stepIndex === 0",
  children: [
    {
      $cmp: "FormKit",
      bind: "$nextAttrs",
      props: {
        type: "button",
        label: {
          if: "$nextLabel",
          then: "$nextLabel",
          else: "$ui.next.value"
        },
        "data-next": "$isLastStep === false",
        onClick: "$handlers.next"
      }
    }
  ]
}));
var stepOuter = /* @__PURE__ */ createSection("stepOuter", () => ({
  $el: "div",
  attrs: {
    key: "$id",
    "data-type": "step",
    "data-disabled": "$disabled || undefined",
    "data-invalid": "$state.valid === false && $state.validationVisible || undefined",
    "data-errors": "$state.errors || undefined",
    "data-submitted": "$state.submitted || undefined",
    id: "$id",
    role: "tabpanel",
    "aria-labelledby": '$node.parent.props.id + "_tab_" + $stepIndex',
    class: "$classes.step",
    hidden: "$isActiveStep === false || undefined"
  }
}));
var stepPrevious = /* @__PURE__ */ createSection("stepPrevious", () => ({
  $el: "div",
  if: "$isFirstStep === false",
  children: [
    {
      $cmp: "FormKit",
      bind: "$previousAttrs",
      props: {
        type: "button",
        label: {
          if: "$previousLabel",
          then: "$previousLabel",
          else: "$ui.prev.value"
        },
        "data-prev": "$isFirstStep === false",
        onClick: "$handlers.previous"
      }
    }
  ]
}));
var steps = /* @__PURE__ */ createSection("steps", () => ({
  $el: "div"
}));
var stepIcon = (sectionKey, el) => {
  return (/* @__PURE__ */ createSection(`${sectionKey}Icon`, () => {
    const rawIconProp = `_raw${sectionKey.charAt(0).toUpperCase()}${sectionKey.slice(1)}Icon`;
    return {
      if: `$step.${sectionKey}Icon && $step.${rawIconProp}`,
      then: {
        $el: `${"span"}`,
        attrs: {
          class: `$classes.${sectionKey}Icon + " formkit-icon"`,
          innerHTML: `$step.${rawIconProp}`,
          role: "presentation",
          onClick: `$handlers.iconClick(${sectionKey})`
        }
      },
      else: {
        if: `$${sectionKey}Icon && $${rawIconProp}`,
        then: {
          $el: `${"span"}`,
          attrs: {
            class: `$classes.${sectionKey}Icon + " formkit-icon"`,
            innerHTML: `$${rawIconProp}`,
            role: "presentation",
            onClick: `$handlers.iconClick(${sectionKey})`
          }
        }
      }
    };
  }))();
};
var tab = /* @__PURE__ */ createSection("tab", () => ({
  $el: "button",
  for: ["step", "index", "$fns.getSteps()"],
  attrs: {
    key: "$step.id",
    type: "button",
    onClick: "$step.makeActive",
    "data-active": "$step.isActiveStep",
    "data-valid": "$step.isValid",
    "data-visited": "$step.hasBeenVisited",
    role: "tab",
    id: '$id + "_tab_" + $index',
    "aria-selected": "$step.isActiveStep || false",
    "aria-controls": "$step.id",
    tabindex: {
      if: "$step.isActiveStep",
      then: "0",
      else: "-1"
    }
  }
}));
var tabLabel = /* @__PURE__ */ createSection("tabLabel", () => ({
  $el: "span"
}));
var tabs = /* @__PURE__ */ createSection("tabs", () => ({
  $el: "div",
  attrs: {
    role: "tablist"
  }
}));
var multiStepOuter = /* @__PURE__ */ createSection("multiStepOuter", () => ({
  $el: "div",
  attrs: {
    key: "$id",
    id: "$id",
    class: "$classes.outer",
    "data-prerender": "$fns.preRenderSteps()",
    "data-family": "$family || undefined",
    "data-type": "$type",
    "data-multiple": '$attrs.multiple || ($type != "select" && $options != undefined) || undefined',
    "data-disabled": "$disabled || undefined",
    "data-invalid": "$state.valid === false && $state.validationVisible || undefined",
    "data-errors": "$state.errors || undefined",
    "data-submitted": "$state.submitted || undefined"
  }
}));
var multiStep = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: multiStepOuter(
    wrapper(
      tabs(
        tab(
          /* @__PURE__ */ $if(
            '$tabStyle === "tab" || ($tabStyle === "progress" && $hideProgressLabels === false)',
            tabLabel("$step.stepName")
          ),
          /* @__PURE__ */ $if(
            "($step.totalErrorCount > 0) && $step.showStepErrors",
            badge("$step.totalErrorCount")
          ),
          /* @__PURE__ */ $if(
            "$step.isValid && $step.hasBeenVisited",
            badge(stepIcon("validStep"))
          )
        )
      ),
      steps("$slots.default")
    )
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "group",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "multi-step",
  /**
   * An array of extra props to accept for this input.
   */
  props: [
    "allowIncomplete",
    "hideProgressLabels",
    "tabStyle",
    "beforeStepChange",
    "validStepIcon"
  ],
  /**
   * Additional features that should be added to your input
   */
  features: [defaultIcon("validStep", "check"), disables]
};
var step = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: stepOuter(
    stepInner("$slots.default"),
    stepActions(stepPrevious(), stepNext())
  ),
  /**
   * The type of node, can be a list, group, or input.
   */
  type: "group",
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: "",
  /**
   * An array of extra props to accept for this input.
   */
  props: [
    "previousLabel",
    "nextLabel",
    "beforeStepChange",
    "previousAttrs",
    "nextAttrs",
    "validStepIcon"
  ],
  /**
   * Additional features that should be added to your input
   */
  features: [localize("next"), localize("prev"), disables]
};
var isBrowser = typeof window !== "undefined";
var camel2title = (str) => {
  if (!str)
    return str;
  return str.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase()).trim();
};
function orderSteps(node, steps2) {
  if (!isBrowser || !steps2)
    return steps2;
  const orderedSteps = [...steps2];
  orderedSteps.sort((a, b) => {
    var _a, _b;
    const aEl = (_a = node.props.__root) == null ? void 0 : _a.getElementById(a.id);
    const bEl = (_b = node.props.__root) == null ? void 0 : _b.getElementById(b.id);
    if (!aEl || !bEl)
      return 0;
    return aEl.compareDocumentPosition(bEl) === 2 ? 1 : -1;
  });
  orderedSteps.map((step2) => {
    step2.ordered = true;
  });
  return orderedSteps;
}
function setNodePositionProps(steps2) {
  if (!steps2)
    return;
  steps2.forEach((step2, index) => {
    step2.isFirstStep = index === 0;
    step2.isLastStep = index === steps2.length - 1;
    step2.stepIndex = index;
    step2.steps = steps2;
  });
}
function showStepErrors(step2) {
  if (!step2.showStepErrors)
    return;
  return parseInt(step2.blockingCount) + parseInt(step2.errorCount) > 0;
}
async function isTargetStepAllowed(currentStep, targetStep) {
  var _a, _b, _c;
  if (currentStep === targetStep)
    return true;
  const { allowIncomplete } = ((_a = currentStep.node.parent) == null ? void 0 : _a.props) || {};
  const parentNode = currentStep.node.parent;
  const currentStepIndex = parentNode == null ? void 0 : parentNode.props.steps.indexOf(currentStep);
  const targetStepIndex = parentNode == null ? void 0 : parentNode.props.steps.indexOf(targetStep);
  const currentStepIsValid = triggerStepValidations(currentStep);
  currentStep.showStepErrors = true;
  if (targetStepIndex >= currentStepIndex) {
    if (!currentStepIsValid && !allowIncomplete) {
      return false;
    }
  }
  const delta = targetStepIndex - currentStepIndex;
  for (let i = 0; i < delta; i++) {
    const intermediateStep = parentNode == null ? void 0 : parentNode.props.steps[currentStepIndex + i];
    const stepIsAllowed = allowIncomplete || ((_b = intermediateStep.state) == null ? void 0 : _b.valid);
    if (!stepIsAllowed) {
      return false;
    }
  }
  const beforeStepChange = currentStep.node.props.beforeStepChange || ((_c = currentStep.node.parent) == null ? void 0 : _c.props.beforeStepChange);
  if (beforeStepChange && typeof beforeStepChange === "function") {
    if (parentNode) {
      parentNode == null ? void 0 : parentNode.store.set(
        /* @__PURE__ */ createMessage({
          key: "loading",
          value: true,
          visible: false
        })
      );
      parentNode.props.disabled = true;
      currentStep.disabled = true;
    }
    const result = await beforeStepChange({
      currentStep,
      targetStep,
      delta: targetStepIndex - currentStepIndex
    });
    if (parentNode) {
      parentNode == null ? void 0 : parentNode.store.remove("loading");
      parentNode.props.disabled = false;
      currentStep.disabled = false;
    }
    if (typeof result === "boolean" && !result)
      return false;
  }
  return true;
}
async function setActiveStep(targetStep, e) {
  if (e) {
    e.preventDefault();
  }
  if (targetStep && targetStep.node.name && targetStep.node.parent) {
    const currentStep = targetStep.node.parent.props.steps.find(
      (step2) => {
        var _a;
        return step2.node.name === ((_a = targetStep.node.parent) == null ? void 0 : _a.props.activeStep);
      }
    );
    const stepIsAllowed = await isTargetStepAllowed(currentStep, targetStep);
    if (stepIsAllowed && targetStep.node.parent.context) {
      targetStep.node.parent.props.activeStep = targetStep.node.name;
    }
  }
}
async function incrementStep(delta, currentStep) {
  if (currentStep && currentStep.node.name && currentStep.node.parent) {
    const steps2 = currentStep.node.parent.props.steps;
    const stepIndex = currentStep.stepIndex;
    const targetStep = steps2[stepIndex + delta];
    if (!targetStep)
      return;
    const stepIsAllowed = await isTargetStepAllowed(currentStep, targetStep);
    if (targetStep && stepIsAllowed) {
      currentStep.node.parent.props.activeStep = targetStep.node.name;
    }
  }
}
function triggerStepValidations(step2) {
  var _a, _b;
  step2.node.walk((n) => {
    n.store.set(
      /* @__PURE__ */ createMessage({
        key: "submitted",
        value: true,
        visible: false
      })
    );
  });
  return ((_a = step2.node.context) == null ? void 0 : _a.state.valid) || ((_b = step2.node.parent) == null ? void 0 : _b.props.allowIncomplete);
}
function initEvents(node, el) {
  if (!(el instanceof HTMLElement))
    return;
  el.addEventListener("keydown", (event) => {
    var _a;
    if (event.target instanceof HTMLButtonElement) {
      if (event.key === "Tab" && "data-next" in ((_a = event.target) == null ? void 0 : _a.attributes) && !event.shiftKey) {
        event.preventDefault();
        const activeStepContext = node.children.find(
          (step2) => !isPlaceholder(step2) && step2.name === node.props.activeStep
        );
        if (activeStepContext && activeStepContext.context) {
          incrementStep(1, activeStepContext.context);
        }
      }
    }
  });
}
function createSSRStepsFromTabs(tabs2) {
  if (!tabs2 || !tabs2.length)
    return [];
  const tabsToRender = tabs2[0].type == Symbol.for("v-fgt") && tabs2[0].children ? tabs2[0].children : tabs2;
  const placeholderTabs = tabsToRender.map(
    (tab2, index) => {
      var _a, _b, _c;
      return {
        __isPlaceholder: true,
        stepName: ((_a = tab2.props) == null ? void 0 : _a.label) || camel2title((_b = tab2.props) == null ? void 0 : _b.name),
        isFirstStep: index === 0,
        isLastStep: index === tabs2.length - 1,
        isActiveStep: index === 0,
        node: {
          name: (_c = tab2.props) == null ? void 0 : _c.name
        }
      };
    }
  );
  return placeholderTabs;
}
function createPreRenderStepsFunction(node) {
  return () => {
    if (!node.context || node.props.steps)
      return;
    let tabs2 = [];
    if (node.context.slots && node.context.slots.default) {
      tabs2 = node.context.slots.default();
    }
    node.props.steps = node.props.steps || createSSRStepsFromTabs(tabs2);
    node.context.stepCount = node.props.steps.length;
  };
}
function createMultiStepPlugin(options2) {
  let isFirstStep = true;
  const multiStepPlugin = (node) => {
    var _a, _b;
    if (node.props.type === "multi-step") {
      if (!node.context)
        return;
      isFirstStep = true;
      node.addProps(["steps", "tabs", "activeStep"]);
      node.context.fns.preRenderSteps = createPreRenderStepsFunction(node);
      node.context.fns.getStepCount = () => {
        if (!node.context)
          return;
        return node.context.stepCount;
      };
      node.context.fns.getSteps = () => {
        if (!node.context)
          return;
        return node.context.steps;
      };
      node.props.allowIncomplete = typeof node.props.allowIncomplete === "boolean" ? node.props.allowIncomplete : true;
      node.props.hideProgressLabels = typeof node.props.hideProgressLabels === "boolean" ? node.props.hideProgressLabels : false;
      node.props.tabStyle = node.props.tabStyle || (options2 == null ? void 0 : options2.tabStyle) || "tab";
      node.context.handlers.triggerStepValidations = triggerStepValidations;
      node.context.handlers.showStepErrors = showStepErrors;
      node.on("created", () => {
        if (!node.context)
          return;
        node.extend("next", {
          get: (node2) => () => {
            var _a2;
            incrementStep(
              1,
              (_a2 = node2 == null ? void 0 : node2.props) == null ? void 0 : _a2.steps.find(
                (step2) => step2.isActiveStep
              )
            );
          },
          set: false
        });
        node.extend("previous", {
          get: (node2) => () => {
            var _a2;
            incrementStep(
              -1,
              (_a2 = node2 == null ? void 0 : node2.props) == null ? void 0 : _a2.steps.find(
                (step2) => step2.isActiveStep
              )
            );
          },
          set: false
        });
        node.extend("goTo", {
          get: (node2) => (target2) => {
            if (typeof target2 === "number") {
              const targetStep = node2.props.steps[target2];
              setActiveStep(targetStep);
            } else if (typeof target2 === "string") {
              const targetStep = node2.props.steps.find(
                (step2) => step2.node.name === target2
              );
              setActiveStep(targetStep);
            }
          },
          set: false
        });
        whenAvailable(
          `${node.props.id}`,
          (el) => {
            initEvents(node, el);
          },
          node.props.__root
        );
      });
      node.on("child", ({ payload: childNode }) => {
        if (node.props.steps && node.props.steps.length) {
          node.props.steps = node.props.steps.filter(
            (step2) => !step2.__isPlaceholder
          );
        }
        node.props.steps = Array.isArray(node.props.steps) && node.props.steps.length > 0 ? [...node.props.steps, childNode.context] : [childNode.context];
        node.props.steps = orderSteps(node, node.props.steps);
        setNodePositionProps(node.props.steps);
        childNode.props.stepName = childNode.props.label || camel2title(childNode.name);
        childNode.props.errorCount = 0;
        childNode.props.blockingCount = 0;
        childNode.props.isActiveStep = isFirstStep;
        isFirstStep = false;
        node.props.activeStep = node.props.activeStep ? node.props.activeStep : node.props.steps[0] ? node.props.steps[0].node.name : "";
      });
      node.on("prop:activeStep", ({ payload }) => {
        node.children.forEach((child) => {
          var _a2;
          if (isPlaceholder(child))
            return;
          child.props.isActiveStep = child.name === payload;
          if (isBrowser && child.name === payload) {
            const el = (_a2 = node.props.__root) == null ? void 0 : _a2.querySelector(
              `[aria-controls="${child.props.id}"]`
            );
            if (el instanceof HTMLButtonElement) {
              el.focus();
            }
          }
        });
      });
      node.on("childRemoved", ({ payload: childNode }) => {
        let removedStepIndex = -1;
        childNode.props.ordered = false;
        node.props.steps = node.props.steps.filter(
          (step2, index) => {
            if (step2.node.name !== childNode.name) {
              return true;
            }
            removedStepIndex = index;
            return false;
          }
        );
        setNodePositionProps(node.props.steps);
        if (node.props.activeStep === childNode.name) {
          const targetIndex = removedStepIndex > 0 ? removedStepIndex - 1 : 0;
          node.props.activeStep = node.props.steps[targetIndex] ? node.props.steps[targetIndex].node.name : "";
        }
      });
    } else if (node.props.type === "step" && ((_a = node.parent) == null ? void 0 : _a.props.type) === "multi-step") {
      let updateTotalErrorCount2 = function(node2) {
        node2.props.totalErrorCount = node2.props.errorCount + node2.props.blockingCount;
      };
      if (!node.context || !node.parent || !node.parent.context)
        return;
      node.addProps([
        "isActiveStep",
        "isFirstStep",
        "isLastStep",
        "stepName",
        "errorCount",
        "blockingCount",
        "totalErrorCount",
        "showStepErrors",
        "isValid",
        "hasBeenVisited",
        "ordered"
      ]);
      const parentNode = node.parent;
      node.on("created", () => {
        if (!node.context || !parentNode.context)
          return;
        whenAvailable(
          `${node.props.id}`,
          () => {
            parentNode.props.steps = orderSteps(node, parentNode.props.steps);
            setNodePositionProps(parentNode.props.steps);
          },
          node.props.__root
        );
      });
      if (node.context && parentNode.context) {
        parentNode.context.handlers.setActiveStep = (stepNode) => setActiveStep.bind(null, stepNode);
        node.context.handlers.incrementStep = (delta) => () => incrementStep(delta, node.context);
        node.context.makeActive = () => {
          setActiveStep(node.context);
        };
        node.context.handlers.next = () => incrementStep(1, node.context);
        node.context.handlers.previous = () => incrementStep(-1, node.context);
      }
      node.on("count:errors", ({ payload: count2 }) => {
        node.props.errorCount = count2;
      });
      node.on("count:blocking", ({ payload: count2 }) => {
        node.props.blockingCount = count2;
      });
      node.on("prop:errorCount", () => updateTotalErrorCount2(node));
      node.on("prop:blockingCount", () => updateTotalErrorCount2(node));
      node.on("prop:totalErrorCount", () => {
        node.props.isValid = node.props.totalErrorCount <= 0;
      });
      node.on("message-added", ({ payload }) => {
        if (payload.key === "submitted") {
          updateTotalErrorCount2(node);
          if (node.context) {
            triggerStepValidations(node.context);
            node.props.showStepErrors = true;
          }
        }
      });
      node.on("prop:isActiveStep", () => {
        if (!node.props.hasBeenVisited && node.props.isActiveStep) {
          node.props.hasBeenVisited = true;
        }
      });
    } else if (((_b = node.parent) == null ? void 0 : _b.props.type) === "multi-step") {
      console.warn(
        'Invalid FormKit input location. <FormKit type="multi-step"> should only have <FormKit type="step"> inputs as immediate children. Failure to wrap child inputs in <FormKit type="step"> can lead to undesired behaviors.'
      );
    }
  };
  multiStepPlugin.library = (node) => {
    switch (node.props.type) {
      case "multi-step":
        return node.define(multiStep);
      case "step":
        const isInvalid = !node.parent || node.parent.props.type !== "multi-step";
        if (isInvalid) {
          console.warn(
            'Invalid use of <FormKit type="step">. <FormKit type="step"> must be an immediate child of a <FormKit type="multi-step"> component.'
          );
        }
        return node.define(step);
    }
  };
  return multiStepPlugin;
}
var Add_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8,15c-3.86,0-7-3.14-7-7S4.14,1,8,1s7,3.14,7,7-3.14,7-7,7Zm0-13c-3.31,0-6,2.69-6,6s2.69,6,6,6,6-2.69,6-6-2.69-6-6-6Z" fill="currentColor"/><path d="M8,11.5c-.28,0-.5-.22-.5-.5V5c0-.28,.22-.5,.5-.5s.5,.22,.5,.5v6c0,.28-.22,.5-.5,.5Z" fill="currentColor"/><path d="M11,8.5H5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h6c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/></svg>`;
var Check_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 27"><polygon fill="currentColor" points="26.99 0 10.13 17.17 4.69 11.63 0 16.41 10.4 27 15.05 22.27 15.09 22.31 32 5.1 26.99 0"/></svg>`;
var Circle_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle fill="currentColor" cx="16" cy="16" r="16"/></svg>`;
var Close_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16"><path d="M10,12.5c-.13,0-.26-.05-.35-.15L1.65,4.35c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0L10.35,11.65c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/><path d="M2,12.5c-.13,0-.26-.05-.35-.15-.2-.2-.2-.51,0-.71L9.65,3.65c.2-.2,.51-.2,.71,0,.2,.2,.2,.51,0,.71L2.35,12.35c-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var DragHandle_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 80" fill="currentColor"><path d="M0,72c0-4.4,3.6-8,8-8s8,3.6,8,8-3.6,8-8,8-8-3.6-8-8ZM0,40c0-4.4,3.6-8,8-8s8,3.6,8,8-3.6,8-8,8S0,44.4,0,40ZM0,8C0,3.6,3.6,0,8,0s8,3.6,8,8-3.6,8-8,8S0,12.4,0,8ZM30,72c0-4.4,3.6-8,8-8s8,3.6,8,8-3.6,8-8,8-8-3.6-8-8ZM30,40c0-4.4,3.6-8,8-8s8,3.6,8,8-3.6,8-8,8-8-3.6-8-8ZM30,8c0-4.4,3.6-8,8-8s8,3.6,8,8-3.6,8-8,8-8-3.6-8-8Z"/></svg>`;
var Spinner_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path fill="currentColor" d="M7.56,13.88c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5c2.96,0,5.38-2.41,5.38-5.38S10.53,2.12,7.56,2.12c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5c3.52,0,6.38,2.86,6.38,6.38s-2.86,6.38-6.38,6.38Z"/></svg>`;
var Star_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path fill="currentColor" d="M11.41,8.41h0l1.14-.93,1.14-.93c.48-.39,.37-.74-.25-.77l-1.58-.09-2.5-.14-.41-1.05s0,0,0,0l-.53-1.38-.53-1.38c-.22-.58-.59-.58-.81,0l-1.07,2.75s0,0,0,0l-.41,1.05-2.5,.14-1.58,.09c-.62,.03-.73,.38-.25,.77l1.14,.93,1.14,.93h0l.87,.71-.57,2.15-.47,1.79c-.16,.6,.14,.81,.66,.48l2.48-1.6h0s.94-.61,.94-.61l.94,.61h0s1.24,.8,1.24,.8l1.24,.8c.52,.33,.82,.12,.66-.48l-.47-1.79-.57-2.15,.87-.71Z"/></svg>`;
var Trash_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.5,4H1.5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5H14.5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/><path d="M11.02,3.81l-.44-1.46c-.06-.21-.26-.36-.48-.36H5.9c-.22,0-.41,.14-.48,.36l-.44,1.46-.96-.29,.44-1.46c.19-.64,.77-1.07,1.44-1.07h4.2c.67,0,1.24,.43,1.44,1.07l.44,1.46-.96,.29Z" fill="currentColor"/><path d="M11.53,15H4.47c-.81,0-1.47-.64-1.5-1.45l-.34-9.87,1-.03,.34,9.87c0,.27,.23,.48,.5,.48h7.07c.27,0,.49-.21,.5-.48l.34-9.87,1,.03-.34,9.87c-.03,.81-.69,1.45-1.5,1.45Z" fill="currentColor"/><path d="M6.5,11.62c-.28,0-.5-.22-.5-.5V7.12c0-.28,.22-.5,.5-.5s.5,.22,.5,.5v4c0,.28-.22,.5-.5,.5Z" fill="currentColor"/><path d="M9.5,11.62c-.28,0-.5-.22-.5-.5V7.12c0-.28,.22-.5,.5-.5s.5,.22,.5,.5v4c0,.28-.22,.5-.5,.5Z" fill="currentColor"/></svg>`;
var FastForward_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><path d="M3.09,11.01c-.18,0-.36-.05-.53-.14-.35-.19-.57-.56-.57-.96V2.09c0-.4,.22-.77,.57-.96,.35-.19,.78-.18,1.12,.03l3.03,1.92c.23,.15,.3,.46,.15,.69-.15,.23-.46,.3-.69,.15l-3.03-1.92s-.07-.02-.1,0-.05,.05-.05,.09v7.82s.02,.07,.05,.09c.03,.02,.07,.02,.1,0l3.03-1.92c.23-.15,.54-.08,.69,.15,.15,.23,.08,.54-.15,.69l-3.03,1.92c-.18,.11-.38,.17-.59,.17Z" fill="currentColor"/><path d="M7.04,10.98c-.18,0-.36-.04-.52-.13-.36-.19-.58-.56-.58-.97V2.11c0-.41,.22-.78,.58-.97,.36-.19,.79-.17,1.13,.05l5.87,3.89c.31,.2,.49,.55,.49,.92,0,.37-.18,.71-.49,.92l-5.87,3.89c-.18,.12-.39,.18-.61,.18Zm0-8.97s-.03,0-.05,.01c-.03,.02-.05,.05-.05,.09v7.77s.02,.07,.05,.09c.03,.02,.07,.02,.1,0l5.87-3.89,.28-.58-.28,.42L7.09,2.03s-.04-.02-.05-.02Z" fill="currentColor"/></svg>`;
var Rewind_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><path d="M12.91,11.01c-.2,0-.41-.06-.59-.17l-3.03-1.92c-.23-.15-.3-.46-.15-.69,.15-.23,.46-.3,.69-.15l3.03,1.92s.07,.02,.1,0,.05-.05,.05-.09V2.09s-.02-.07-.05-.09c-.03-.02-.07-.02-.1,0l-3.03,1.92c-.23,.15-.54,.08-.69-.15-.15-.23-.08-.54,.15-.69l3.03-1.92c.34-.21,.77-.23,1.12-.03,.35,.19,.57,.56,.57,.96v7.82c0,.4-.22,.77-.57,.96-.17,.09-.35,.14-.53,.14Z" fill="currentColor"/><path d="M8.96,10.98c-.21,0-.42-.06-.61-.18L2.49,6.92c-.31-.2-.49-.55-.49-.92,0-.37,.18-.71,.49-.92L8.36,1.2c.34-.22,.77-.24,1.13-.05,.36,.19,.58,.56,.58,.97v7.77c0,.41-.22,.78-.58,.97-.16,.09-.34,.13-.52,.13ZM2.76,5.5l.28,.42s-.04,.06-.04,.08l5.92,3.97s.07,.02,.1,0c.03-.02,.05-.05,.05-.09V2.11s-.02-.07-.05-.09c-.03-.02-.07-.02-.1,0L3.04,5.92l-.28-.42Z" fill="currentColor"/></svg>`;
var ArrowDown_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 16"><path d="M4.5,13c-.28,0-.5-.22-.5-.5V3.5c0-.28,.22-.5,.5-.5s.5,.22,.5,.5V12.5c0,.28-.22,.5-.5,.5Z" fill="currentColor"/><path d="M4.5,14c-.13,0-.26-.05-.35-.15L.65,10.35c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l3.15,3.15,3.15-3.15c.2-.2,.51-.2,.71,0,.2,.2,.2,.51,0,.71l-3.5,3.5c-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var ArrowUp_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 16"><path d="M4.5,14c-.28,0-.5-.22-.5-.5V4.5c0-.28,.22-.5,.5-.5s.5,.22,.5,.5V13.5c0,.28-.22,.5-.5,.5Z" fill="currentColor"/><path d="M8,7.5c-.13,0-.26-.05-.35-.15l-3.15-3.15L1.35,7.35c-.2,.2-.51,.2-.71,0-.2-.2-.2-.51,0-.71l3.5-3.5c.2-.2,.51-.2,.71,0l3.5,3.5c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var Down_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 7"><path d="M8,6.5c-.13,0-.26-.05-.35-.15L3.15,1.85c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l4.15,4.15L12.15,1.15c.2-.2,.51-.2,.71,0,.2,.2,.2,.51,0,.71l-4.5,4.5c-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var Left_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 16"><path d="M5.5,13c-.13,0-.26-.05-.35-.15L.65,8.35c-.2-.2-.2-.51,0-.71L5.15,3.15c.2-.2,.51-.2,.71,0,.2,.2,.2,.51,0,.71L1.71,8l4.15,4.15c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var Right_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 16"><path d="M1.5,13c-.13,0-.26-.05-.35-.15-.2-.2-.2-.51,0-.71l4.15-4.15L1.15,3.85c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0L6.35,7.65c.2,.2,.2,.51,0,.71L1.85,12.85c-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var FileDoc_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16"><path d="M12.5,16H2.5c-.83,0-1.5-.67-1.5-1.5V1.5c0-.83,.67-1.5,1.5-1.5h7.09c.4,0,.78,.16,1.06,.44l2.91,2.91c.28,.28,.44,.66,.44,1.06V14.5c0,.83-.67,1.5-1.5,1.5ZM2.5,1c-.28,0-.5,.22-.5,.5V14.5c0,.28,.22,.5,.5,.5H12.5c.28,0,.5-.22,.5-.5V4.41c0-.13-.05-.26-.15-.35l-2.91-2.91c-.09-.09-.22-.15-.35-.15H2.5Z" fill="currentColor"/><path d="M13.38,5h-2.91c-.81,0-1.47-.66-1.47-1.47V.62c0-.28,.22-.5,.5-.5s.5,.22,.5,.5V3.53c0,.26,.21,.47,.47,.47h2.91c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/><path d="M10,13H5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/><path d="M10,10H5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/><path d="M7,7h-2c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h2c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/></svg>`;
var Color_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5.5,14H2.5c-.28,0-.5-.22-.5-.5v-3c0-.13,.05-.26,.15-.35L7.15,5.15c.2-.2,.51-.2,.71,0l3,3c.2,.2,.2,.51,0,.71l-5,5c-.09,.09-.22,.15-.35,.15Zm-2.5-1h2.29l4.5-4.5-2.29-2.29L3,10.71v2.29Z" fill="currentColor"/><path d="M13.37,5.62l-1.38,1.38-3-3,1.38-1.38c.42-.42,.96-.62,1.5-.62s1.08,.2,1.5,.62c.83,.83,.83,2.17,0,3Z" fill="currentColor"/><path d="M12.5,8c-.13,0-.26-.05-.35-.15L8.15,3.85c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l4,4c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z" fill="currentColor"/></svg>`;
var Date_default = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.5,16H1.5c-.83,0-1.5-.67-1.5-1.5V2.5c0-.83,.67-1.5,1.5-1.5H14.5c.83,0,1.5,.67,1.5,1.5V14.5c0,.83-.67,1.5-1.5,1.5ZM1.5,2c-.28,0-.5,.22-.5,.5V14.5c0,.28,.22,.5,.5,.5H14.5c.28,0,.5-.22,.5-.5V2.5c0-.28-.22-.5-.5-.5H1.5Z" fill="currentColor"/><path d="M4.5,4c-.28,0-.5-.22-.5-.5V.5c0-.28,.22-.5,.5-.5s.5,.22,.5,.5V3.5c0,.28-.22,.5-.5,.5Z" fill="currentColor"/><path d="M11.5,4c-.28,0-.5-.22-.5-.5V.5c0-.28,.22-.5,.5-.5s.5,.22,.5,.5V3.5c0,.28-.22,.5-.5,.5Z" fill="currentColor"/><path d="M15.5,6H.5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5H15.5c.28,0,.5,.22,.5,.5s-.22,.5-.5,.5Z" fill="currentColor"/></svg>`;
var genesisIcons = {
  add: Add_default,
  arrowDown: ArrowDown_default,
  arrowUp: ArrowUp_default,
  check: Check_default,
  close: Close_default,
  checkboxDecorator: Check_default,
  date: Date_default,
  dragHandle: DragHandle_default,
  fileItem: FileDoc_default,
  fileRemove: Close_default,
  noFiles: FileDoc_default,
  radioDecorator: Circle_default,
  select: Down_default,
  spinner: Spinner_default,
  star: Star_default,
  trash: Trash_default,
  fastForward: FastForward_default,
  right: Right_default,
  left: Left_default,
  rewind: Rewind_default,
  color: Color_default
};
function rootClasses(sectionName, node) {
  const key = `${node.props.type}__${sectionName}`;
  const semanticKey = `formkit-${sectionName}`;
  const familyKey = node.props.family ? `family:${node.props.family}__${sectionName}` : "";
  const memoKey = `${key}__${familyKey}`;
  if (!(memoKey in classes)) {
    const sectionClasses = classes[key] ?? globals[sectionName] ?? {};
    sectionClasses[semanticKey] = true;
    if (familyKey in classes) {
      classes[memoKey] = { ...classes[familyKey], ...sectionClasses };
    } else {
      classes[memoKey] = sectionClasses;
    }
  }
  return classes[memoKey] ?? { [semanticKey]: true };
}
const classes = {
  "family:button__wrapper": {
    "group-data-[disabled=true]:grayscale": true
  },
  "family:button__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "font-bold": true,
    "rounded": true,
    "outline-none": true,
    "flex": true,
    "!text-sm": true,
    "px-7": true,
    "py-3": true,
    "items-center": true,
    "mb-1.5": true,
    "text-sm": true,
    "ring-offset-2": true,
    "ring-blue-500": true,
    "focus-visible:ring-2": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "shadow": true,
    "group-data-[prefix-icon]:pl-5": true,
    "group-data-[suffix-icon]:pr-5": true,
    "border": true,
    "border-blue-600": true,
    "text-blue-600": true,
    "group-[]/repeater:shadow-sm": true,
    "group-[]/multistep:shadow-sm": true,
    "dark:border-blue-500": true
  },
  "family:box__wrapper": {
    "inline-flex": true,
    "items-center": true,
    "mb-1": true,
    "group-data-[multiple]:mb-0": true
  },
  "family:box__legend": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "dark:text-neutral-300": true,
    "mb-2": true
  },
  "family:box__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "peer": true,
    "pointer-events-none": true,
    "absolute": true,
    "h-0": true,
    "w-0": true,
    "overflow-hidden": true,
    "opacity-0": true
  },
  "family:box__decorator": {
    "mr-1.5": true,
    "bg-white": true,
    "ring-blue-500": true,
    "peer-checked:border-blue-600": true,
    "relative": true,
    "block": true,
    "text-lg": true,
    "w-[1em]": true,
    "aspect-[1/1]": true,
    "border": true,
    "border-neutral-400": true,
    "text-transparent": true,
    "peer-checked:bg-blue-50": true,
    "peer-checked:text-blue-600": true,
    "peer-focus-visible:ring-2": true,
    "peer-focus-visible:ring-offset-1": true,
    "select-none": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "peer-disabled:bg-neutral-100": true,
    "group-data-[disabled]:grayscale": true,
    "shadow": true,
    "peer-disabled:cursor-not-allowed": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "dark:border-neutral-500": true,
    "dark:bg-transparent": true,
    "dark:ring-offset-blue-500": true,
    "dark:peer-focus-visible:ring-1": true,
    "dark:peer-disabled:bg-neutral-600/50": true,
    "dark:peer-checked:bg-blue-900": true,
    "dark:peer-checked:text-blue-400": true
  },
  "family:box__decoratorIcon": {
    "absolute": true,
    "left-1/2": true,
    "top-1/2": true,
    "flex": true,
    "h-full": true,
    "w-full": true,
    "-translate-x-1/2": true,
    "-translate-y-1/2": true
  },
  "family:box__option": {
    "mb-1.5": true,
    "last:mb-0": true,
    "data-[disabled]:opacity-50": true,
    "data-[disabled]:select-none": true,
    "group-data-[disabled]:data-[disabled]:opacity-100": true
  },
  "family:box__label": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "mb-1": true,
    "!mb-0": true,
    "!font-normal": true,
    "!text-sm": true,
    "dark:text-neutral-300": true
  },
  "family:box__optionHelp": {
    "text-neutral-500": true,
    "text-xs": true,
    "-mt-1": true,
    "mb-1.5": true,
    "ml-[min(2em,1.7rem)]": true,
    "relative": true,
    "left-px": true
  },
  "family:box__help": {
    "text-neutral-500": true,
    "text-xs": true,
    "dark:text-neutral-400": true,
    "mb-1": true,
    "group-data-[multiple]:mb-2": true,
    "group-data-[multiple]:-mt-1.5": true
  },
  "family:text__wrapper": {
    "flex": true,
    "flex-col": true,
    "items-start": true,
    "justify-start": true,
    "mb-1.5": true,
    "last:mb-0": true
  },
  "family:text__label": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "dark:text-neutral-300": true,
    "!inline-flex": true,
    "mb-1": true
  },
  "family:text__inner": {
    "text-base": true,
    "flex": true,
    "items-center": true,
    "w-full": true,
    "py-2": true,
    "px-3": true,
    "rounded": true,
    "border": true,
    "border-neutral-400": true,
    "bg-white": true,
    "focus-within:ring-1": true,
    "focus-within:!ring-blue-500": true,
    "focus-within:!border-blue-500": true,
    "group-data-[invalid]:border-red-500": true,
    "group-data-[invalid]:ring-1": true,
    "group-data-[invalid]:ring-red-500": true,
    "group-data-[disabled]:bg-neutral-100": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "shadow": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "dark:bg-transparent": true,
    "dark:border-neutral-500": true,
    "dark:group-data-[disabled]:bg-neutral-800/5": true,
    "dark:group-data-[invalid]:border-red-500": true,
    "dark:group-data-[invalid]:ring-red-500": true
  },
  "family:text__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "text-base": true,
    "text-neutral-700": true,
    "min-w-0": true,
    "min-h-[1.5em]": true,
    "grow": true,
    "outline-none": true,
    "bg-transparent": true,
    "selection:bg-blue-100": true,
    "placeholder:text-neutral-400": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "dark:placeholder-neutral-400/50": true,
    "dark:text-neutral-300": true,
    "border-none": true,
    "p-0": true,
    "focus:ring-0": true
  },
  "family:text__prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "family:text__suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "family:dropdown__wrapper": {
    "mb-1.5": true
  },
  "family:dropdown__inner": {
    "relative": true,
    "flex": true,
    "items-center": true,
    "bg-white": true,
    "border": true,
    "border-neutral-400": true,
    "rounded": true,
    "group-data-[is-multiline]:!rounded": true,
    "focus-within:ring-1": true,
    "focus-within:!ring-blue-500": true,
    "focus-within:!border-blue-500": true,
    "group-data-[invalid]:border-red-500": true,
    "group-data-[invalid]:ring-1": true,
    "group-data-[invalid]:ring-red-500": true,
    "group-data-[disabled]:bg-neutral-100": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "shadow": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "dark:bg-transparent": true,
    "dark:border-neutral-500": true,
    "dark:group-data-[disabled]:bg-neutral-700/40": true,
    "dark:group-data-[invalid]:border-red-500": true,
    "dark:group-data-[invalid]:ring-red-500": true
  },
  "family:dropdown__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "grow": true,
    "p-2": true,
    "pr-0": true,
    "pl-3": true,
    "text-base": true,
    "text-neutral-700": true,
    "text-ellipsis": true,
    "min-w-0": true,
    "outline-none": true,
    "bg-transparent": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "group-data-[prefix-icon]:!pl-0": true,
    "group-data-[suffix-icon]:!pr-0": true,
    "placeholder:text-neutral-400": true,
    "selection:bg-blue-100": true,
    "dark:placeholder:text-neutral-500": true,
    "dark:text-neutral-300": true,
    "border-none": true,
    "focus:ring-0": true,
    "bg-none": true
  },
  "family:dropdown__listboxButton": {
    "w-[2.5em]": true,
    "self-stretch": true,
    "text-base": true,
    "flex": true,
    "items-center": true,
    "text-neutral-700": true,
    "z-10": true,
    "dark:text-neutral-300": true,
    "data-[disabled]:cursor-not-allowed": true
  },
  "family:dropdown__removeSelection": {
    "w-[2.5em]": true,
    "self-stretch": true,
    "text-base": true,
    "flex": true,
    "items-center": true,
    "text-neutral-700": true,
    "hover:text-red-400": true,
    "z-10": true,
    "dark:text-neutral-300": true
  },
  "family:dropdown__controlLabel": {
    "absolute": true,
    "opacity-0": true,
    "pointer-events-none": true,
    "text-[0px]": true
  },
  "family:dropdown__selectIcon": {
    "text-base": true,
    "inline-flex": true,
    "justify-center": true,
    "w-[2.5em]": true,
    "relative": true,
    "my-auto": true,
    "[&>svg]:w-[1em]": true,
    "[&>svg]:mx-auto": true
  },
  "family:dropdown__closeIcon": {
    "text-base": true,
    "w-[0.75em]": true,
    "relative": true,
    "m-auto": true
  },
  "family:dropdown__prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "!ml-2": true,
    "!mr-0": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "family:dropdown__suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "!mr-2": true,
    "!ml-0": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "family:dropdown__dropdownWrapper": {
    "rounded": true,
    "shadow-lg": true,
    "mt-1": true,
    "overflow-clip": true,
    "empty:hidden": true,
    "border": true,
    "border-neutral-300": true,
    "dark:border-neutral-600": true,
    "group-data-[expanded]:opacity-100": true,
    "group-data-[overscroll]:m-0": true,
    "group-data-[overscroll]:shadow-none": true,
    "group-data-[overscroll]:border-none": true
  },
  "family:dropdown__listitemGroup": {
    "group/optgroup": true,
    "last:pb-0": true,
    "border-t": true,
    "border-b": true,
    "-mb-px": true,
    "border-neutral-300": true,
    "dark:border-neutral-600": true
  },
  "family:dropdown__groupLabel": {
    "block": true,
    "pt-1.5": true,
    "pb-1": true,
    "px-2.5": true,
    "font-bold": true,
    "pointer-events-none": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "family:dropdown__listbox": {
    "bg-white": true,
    "rounded": true,
    "empty:hidden": true,
    "dark:bg-neutral-800": true,
    "group-data-[overscroll]:shadow-lg": true,
    "group-data-[overscroll]:border": true,
    "group-data-[overscroll]:border-neutral-300": true,
    "group-data-[overscroll]:dark:border-neutral-600": true
  },
  "family:dropdown__listitem": {
    "relative": true,
    "flex": true,
    "items-center": true,
    "px-2": true,
    "py-1.5": true,
    "first:pt-2": true,
    "last:pb-2": true,
    "text-neutral-700": true,
    "text-base": true,
    "data-[is-active]:bg-blue-100": true,
    "dark:text-neutral-200": true,
    "dark:data-[is-active]:text-neutral-700": true,
    "before:content-['']": true,
    "before:absolute": true,
    "before:inset-0": true,
    "data-[is-active]:first:before:rounded": true,
    "data-[is-active]:first:before:rounded-b-none": true,
    "data-[is-active]:last:before:rounded": true,
    "data-[is-active]:last:before:rounded-t-none": true,
    "data-[is-active]:first:last:before:rounded": true,
    "data-[is-active]:before:ring-1": true,
    "data-[is-active]:before:ring-blue-500": true,
    "data-[is-active]:before:ring-inset": true,
    "data-[is-active]:before:ring-offset-blue-100": true,
    "group-[]/optgroup:first:before:!rounded-none": true,
    "group-[]/optgroup:last:before:!rounded-none": true
  },
  "family:dropdown__selectedIcon": {
    "flex": true,
    "absolute": true,
    "items-center": true,
    "text-blue-600": true,
    "left-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true
  },
  "family:dropdown__option": {
    "ml-[1.5em]": true
  },
  "family:dropdown__loadMore": {
    "data-[is-active]:bg-blue-100": true
  },
  "family:dropdown__loadMoreInner": {
    "flex": true,
    "text-sm": true,
    "text-neutral-500": true,
    "p-2": true,
    "items-center": true,
    "justify-center": true,
    "[&>span]:mr-2": true,
    "cursor-pointer": true,
    "dark:text-neutral-200": true,
    "dark:hover:text-blue-500": true
  },
  "family:dropdown__selectionWrapper": {
    "grow": true,
    "flex": true,
    "items-center": true,
    "text-neutral-700": true
  },
  "family:dropdown__selection": {
    "grow": true,
    "text-neutral-700": true,
    "group-data-[multiple]:p-2": true,
    "dark:text-neutral-300": true
  },
  "family:dropdown__tagsWrapper": {
    "w-full": true
  },
  "family:dropdown__tagWrapper": {
    "group/tag": true,
    "rounded": true,
    "mr-1": true,
    "mb-1": true,
    "outline-none": true,
    "data-[active-selection=true]:ring-2": true,
    "data-[active-selection=true]:ring-blue-500": true
  },
  "family:dropdown__tags": {
    "inline-flex": true,
    "flex-wrap": true,
    "items-center": true,
    "w-full": true,
    "-mb-1": true,
    "empty:mb-0": true
  },
  "family:dropdown__tag": {
    "flex": true,
    "items-center": true,
    "cursor-default": true,
    "rounded": true,
    "text-sm": true,
    "px-1.5": true,
    "py-0.5": true,
    "bg-blue-600": true,
    "text-white": true,
    "[&>[type=button]]:!w-[0.5em]": true,
    "[&>[type=button]]:aspect-[1/1]": true,
    "[&>[type=button]]:!text-inherit": true,
    "[&>[type=button]]:cursor-pointer": true,
    "group-data-[active-selection=true]/tag:bg-blue-400": true,
    "group-data-[active-selection=true]/tag:text-neutral-700": true
  },
  "family:dropdown__tagLabel": {
    "mr-1": true
  },
  "family:dropdown__emptyMessage": {
    "flex": true,
    "items-center": true,
    "px-2": true,
    "py-1.5": true,
    "first:pt-2": true,
    "last:pb-2": true,
    "text-neutral-700": true,
    "text-sm": true,
    "aria-selected:text-white": true,
    "aria-selected:bg-blue-600": true
  },
  "button__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "bg-blue-50": true,
    "hover:bg-blue-100": true,
    "dark:text-blue-500": true,
    "dark:bg-transparent": true,
    "dark:hover:bg-blue-50/5": true
  },
  "checkbox__decorator": {
    "rounded": true
  },
  "checkbox__decoratorIcon": {
    "max-w-[66.66%]": true
  },
  "color__inner": {
    "!w-auto": true,
    "!p-1.5": true,
    "!inline-flex": true,
    "group-data-[prefix-icon]:border": true,
    "group-data-[prefix-icon]:border-neutral-400": true,
    "group-data-[suffix-icon]:border": true,
    "group-data-[suffix-icon]:border-neutral-400": true,
    "dark:group-data-[prefix-icon]:border-neutral-500": true,
    "dark:group-data-[suffix-icon]:border-neutral-500": true
  },
  "color__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "!w-14": true,
    "bg-transparent": true,
    "cursor-pointer": true,
    "rounded": true,
    "overflow-clip": true,
    "[&::-webkit-color-swatch-wrapper]:p-0": true,
    "[&::-webkit-color-swatch]:border-none": true,
    "[&::-moz-color-swatch]:border-none": true,
    "group-data-[prefix-icon]:mx-2": true,
    "group-data-[suffix-icon]:mx-2": true
  },
  "color__prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "group-data-[prefix-icon]:m-1.5": true,
    "group-data-[prefix-icon]:mr-0": true
  },
  "color__suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "group-data-[suffix-icon]:m-1.5": true,
    "group-data-[prefix-icon]:ml-0": true
  },
  "date__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "focus:[&::-webkit-datetime-edit-day-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-month-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-year-field]:bg-blue-100": true
  },
  "datetime-local__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "focus:[&::-webkit-datetime-edit-day-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-month-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-year-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-hour-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-minute-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-ampm-field]:bg-blue-100": true
  },
  "file__fileList": {
    "group/list": true,
    "peer": true,
    "w-full": true,
    "min-w-0": true,
    "data-[has-multiple]:mb-[1.25em]": true
  },
  "file__fileItemIcon": {
    "h-[1em]": true,
    "w-[1em]": true,
    "mr-2": true,
    "shrink-0": true
  },
  "file__fileItem": {
    "flex": true,
    "min-w-0": true,
    "items-center": true,
    "text-neutral-700": true,
    "mb-1.5": true,
    "last:mb-0": true,
    "dark:text-neutral-300": true
  },
  "file__fileName": {
    "truncate": true,
    "min-w-0": true,
    "w-full": true,
    "shrink": true,
    "leading-5": true,
    "group-data-[has-multiple]/list:text-sm": true
  },
  "file__fileRemove": {
    "right-2": true,
    "ring-blue-500": true,
    "rounded": true,
    "z-20": true,
    "flex": true,
    "appearance-none": true,
    "items-center": true,
    "text-[0px]": true,
    "outline-none": true,
    "hover:!text-red-500": true,
    "focus-visible:ring-2": true,
    "group-data-[disabled]:pointer-events-none": true,
    "group-data-[disabled]:!text-neutral-500": true,
    "peer-data-[has-multiple]:absolute": true,
    "peer-data-[has-multiple]:bottom-[max(0.5em,8px)]": true,
    "peer-data-[has-multiple]:left-3": true,
    "peer-data-[has-multiple]:text-blue-600": true,
    "peer-data-[has-multiple]:text-xs": true,
    "peer-data-[has-multiple]:whitespace-nowrap": true,
    "group-data-[prefix-icon]:peer-data-[has-multiple]:left-2": true,
    "dark:hover:!text-red-400": true
  },
  "file__fileRemoveIcon": {
    "block": true,
    "text-base": true,
    "w-[0.75em]": true,
    "relative": true,
    "z-10": true
  },
  "file__inner": {
    "relative": true,
    "cursor-pointer": true,
    "group-data-[has-multiple]:rounded": true
  },
  "file__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "cursor-pointer": true,
    "text-transparent": true,
    "absolute": true,
    "inset-0": true,
    "opacity-0": true,
    "z-10": true,
    "file:pointer-events-none": true,
    "file:w-0": true,
    "file:h-0": true,
    "file:overflow-hidden": true
  },
  "file__noFiles": {
    "flex": true,
    "w-full": true,
    "items-center": true,
    "text-neutral-400": true,
    "dark:text-neutral-500": true
  },
  "file__noFilesIcon": {
    "w-[1em]": true,
    "mr-2": true
  },
  "form__form": {
    "group/form": true
  },
  "form__actions": {
    "": true
  },
  "form__summaryInner": {
    "group/summary": true,
    "border": true,
    "border-neutral-400": true,
    "bg-white": true,
    "rounded": true,
    "py-2": true,
    "px-3": true,
    "shadow": true,
    "dark:bg-transparent": true,
    "dark:border-neutral-500": true
  },
  "form__summaryHeader": {
    "text-lg": true,
    "text-neutral-700": true,
    "font-bold": true,
    "mb-2": true,
    "dark:text-neutral-300": true
  },
  "form__messages": {
    "": true
  },
  "form__message": {
    "text-red-600": true,
    "mb-1.5": true,
    "text-xs": true,
    "dark:text-red-400": true,
    "group-[]/summary:text-sm": true
  },
  "form__messageLink": {
    "group-[]/summary:outline-none": true,
    "group-[]/summary:focus-visible:ring-2": true,
    "group-[]/summary:ring-blue-600": true
  },
  "month__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "focus:[&::-webkit-datetime-edit-month-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-year-field]:bg-blue-100": true
  },
  "radio__decorator": {
    "rounded-full": true
  },
  "radio__decoratorIcon": {
    "max-w-[50%]": true
  },
  "range__inner": {
    "relative": true,
    "!border-none": true,
    "!ring-0": true,
    "!px-0": true,
    "!bg-transparent": true,
    "!shadow-none": true
  },
  "range__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "group/input": true,
    "cursor-pointer": true,
    "[&::-webkit-slider-runnable-track]:bg-neutral-400/50": true,
    "[&::-webkit-slider-runnable-track]:h-[0.25em]": true,
    "[&::-webkit-slider-runnable-track]:rounded": true,
    "dark:[&::-webkit-slider-runnable-track]:bg-neutral-500/50": true,
    "[&::-webkit-slider-thumb]:appearance-none": true,
    "[&::-webkit-slider-thumb]:w-[0.85em]": true,
    "[&::-webkit-slider-thumb]:aspect-[1/1]": true,
    "[&::-webkit-slider-thumb]:bg-blue-600": true,
    "[&::-webkit-slider-thumb]:rounded-full": true,
    "[&::-webkit-slider-thumb]:relative": true,
    "[&::-webkit-slider-thumb]:top-1/2": true,
    "[&::-webkit-slider-thumb]:-translate-y-1/2": true,
    "[&::-webkit-slider-thumb]:group-data-[disabled]:bg-neutral-500": true,
    "[&::-webkit-slider-thumb]:group-data-[disabled]:!ring-neutral-300": true,
    "[&::-webkit-slider-thumb]:focus-visible:ring-2": true,
    "[&::-webkit-slider-thumb]:focus:!ring-blue-500": true,
    "[&::-webkit-slider-thumb]:focus:ring-offset-2": true,
    "[&::-webkit-slider-thumb]:shadow": true,
    "dark:[&::-webkit-slider-thumb]:group-data-[disabled]:!ring-neutral-600": true,
    "dark:[&::-webkit-slider-thumb]:focus:ring-offset-neutral-700": true,
    "[&::-moz-range-track]:bg-neutral-400/50": true,
    "[&::-moz-range-track]:h-[0.25]": true,
    "[&::-moz-range-track]:rounded": true,
    "dark:[&::-moz-range-track]:bg-neutral-500/50": true,
    "[&::-moz-range-thumb]:appearance-none": true,
    "[&::-moz-range-thumb]:border-none": true,
    "[&::-moz-range-thumb]:w-[0.85em]": true,
    "[&::-moz-range-thumb]:h-[0.85em]": true,
    "[&::-moz-range-thumb]:bg-blue-600": true,
    "[&::-moz-range-thumb]:rounded-full": true,
    "[&::-moz-range-thumb]:group-data-[disabled]:bg-neutral-500": true,
    "[&::-moz-range-thumb]:group-data-[disabled]:!ring-neutral-300": true,
    "[&::-moz-range-thumb]:focus-visible:ring-2": true,
    "[&::-moz-range-thumb]:focus:!ring-blue-500": true,
    "[&::-moz-range-thumb]:focus:ring-offset-2": true,
    "[&::-moz-range-thumb]:shadow": true,
    "dark:[&::-moz-range-thumb]:group-data-[disabled]:!ring-neutral-500": true,
    "dark:[&::-moz-range-thumb]:focus:ring-offset-neutral-700": true
  },
  "select__wrapper": {
    "mb-1.5": true
  },
  "select__inner": {
    "relative": true,
    "flex": true,
    "items-center": true,
    "bg-white": true,
    "border": true,
    "border-neutral-400": true,
    "rounded": true,
    "focus-within:ring-1": true,
    "focus-within:!ring-blue-500": true,
    "focus-within:!border-blue-500": true,
    "group-data-[invalid]:border-red-500": true,
    "group-data-[invalid]:ring-1": true,
    "group-data-[invalid]:ring-red-500": true,
    "group-data-[disabled]:bg-neutral-100": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "shadow": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "group-data-[multiple]:rounded": true,
    "dark:bg-transparent": true,
    "dark:border-neutral-500": true,
    "dark:group-data-[disabled]:bg-neutral-800/5": true,
    "dark:group-data-[invalid]:border-red-500": true,
    "dark:group-data-[invalid]:ring-red-500": true
  },
  "select__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "grow": true,
    "p-2": true,
    "py-2": true,
    "px-3": true,
    "pr-[2em]": true,
    "text-base": true,
    "text-neutral-700": true,
    "text-ellipsis": true,
    "min-w-0": true,
    "outline-none": true,
    "bg-transparent": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "group-data-[prefix-icon]:!pl-0": true,
    "group-data-[suffix-icon]:!pr-0": true,
    "data-[placeholder]:text-neutral-400": true,
    "group-data-[multiple]:!p-0": true,
    "selection:bg-blue-100": true,
    "dark:data-[placeholder]:text-neutral-400/50": true,
    "dark:text-neutral-300": true,
    "border-none": true,
    "focus:ring-0": true,
    "bg-none": true
  },
  "select__selectIcon": {
    "absolute": true,
    "w-[1em]": true,
    "text-neutral-700": true,
    "pointer-events-none": true,
    "right-2": true,
    "group-data-[suffix-icon]:mr-[1.5em]": true,
    "dark:text-neutral-300": true
  },
  "select__optGroup": {
    "bg-white": true,
    "text-neutral-700": true,
    "group/optgroup": true,
    "group-data-[multiple]:px-1.5": true,
    "pt-1.5": true,
    "font-bold": true,
    "text-sm": true,
    "dark:bg-neutral-800": true,
    "dark:text-neutral-300": true
  },
  "select__option": {
    "bg-white": true,
    "text-neutral-700": true,
    "group-data-[disabled]:opacity-50": true,
    "group-data-[disabled]:select-none": true,
    "group-data-[multiple]:checked:bg-blue-100": true,
    "group-data-[multiple]:focus:bg-blue-100": true,
    "group-data-[multiple]:text-sm": true,
    "group-data-[multiple]:outline-none": true,
    "group-data-[multiple]:border-none": true,
    "group-data-[multiple]:py-1.5": true,
    "group-data-[multiple]:px-2": true,
    "dark:bg-neutral-800": true,
    "dark:text-neutral-300": true,
    "dark:group-data-[multiple]:focus:bg-blue-800": true,
    "dark:group-data-[multiple]:checked:bg-blue-800": true
  },
  "select__prefixIcon": {
    "flex": true,
    "items-center": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "ml-2": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "select__suffixIcon": {
    "flex": true,
    "items-center": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "mr-2": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "submit__outer": {
    "group": true,
    "max-w-[20em]": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "text-base": true,
    "data-[disabled]:opacity-100": true
  },
  "submit__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "bg-blue-600": true,
    "!text-white": true,
    "active:text-blue-100": true,
    "active:bg-blue-700": true,
    "hover:bg-blue-700": true,
    "disabled:border-neutral-400": true,
    "disabled:bg-neutral-400": true,
    "disabled:text-neutral-100": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "dark:disabled:border-neutral-100": true,
    "dark:disabled:bg-neutral-500": true,
    "dark:disabled:text-neutral-200": true,
    "dark:text-white": true,
    "dark:ring-offset-blue-500": true,
    "before:transition-all": true,
    "group-data-[loading=true]/form:before:content['']": true,
    "group-data-[loading=true]/form:before:block": true,
    "group-data-[loading=true]/form:before:animate-spin": true,
    "group-data-[loading=true]/form:before:w-5": true,
    "group-data-[loading=true]/form:before:h-5": true,
    "group-data-[loading=true]/form:before:rounded-full": true,
    "group-data-[loading=true]/form:before:mr-3": true,
    "group-data-[loading=true]/form:before:-ml-1.5": true,
    "group-data-[loading=true]/form:before:border-2": true,
    "group-data-[loading=true]/form:before:border-solid": true,
    "group-data-[loading=true]/form:before:border-white": true,
    "group-data-[loading=true]/form:before:border-r-transparent": true
  },
  "submit__prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "text-neutral-100": true
  },
  "submit__suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "text-neutral-100": true
  },
  "textarea__inner": {
    "flex": true,
    "items-center": true,
    "mb-1.5": true,
    "bg-white": true,
    "border": true,
    "border-neutral-400": true,
    "rounded": true,
    "focus-within:ring-1": true,
    "focus-within:!ring-blue-500": true,
    "focus-within:!border-blue-500": true,
    "group-data-[invalid]:border-red-500": true,
    "group-data-[invalid]:ring-1": true,
    "group-data-[invalid]:ring-red-500": true,
    "group-data-[disabled]:bg-neutral-100": true,
    "shadow": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "dark:border-neutral-500": true,
    "dark:group-data-[disabled]:bg-neutral-800/5": true,
    "dark:group-data-[invalid]:border-red-500": true,
    "dark:group-data-[invalid]:ring-red-500": true,
    "dark:bg-transparent": true
  },
  "textarea__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "text-base": true,
    "h-24": true,
    "text-neutral-700": true,
    "min-w-0": true,
    "grow": true,
    "shrink": true,
    "!py-2": true,
    "!px-3": true,
    "outline-none": true,
    "bg-transparent": true,
    "selection:bg-blue-100": true,
    "placeholder:text-neutral-400": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "dark:placeholder-neutral-400/50": true,
    "dark:text-neutral-300": true,
    "p-0": true,
    "border-none": true,
    "focus:ring-0": true
  },
  "textarea__prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "!ml-2": true,
    "!mr-0": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "textarea__suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "!mr-2": true,
    "!ml-0": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "time__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "focus:[&::-webkit-datetime-edit-hour-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-minute-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-ampm-field]:bg-blue-100": true
  },
  "week__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "focus:[&::-webkit-datetime-edit-week-field]:bg-blue-100": true,
    "focus:[&::-webkit-datetime-edit-year-field]:bg-blue-100": true
  },
  "autocomplete__selections": {
    "flex": true,
    "absolute": true,
    "inset-0": true,
    "group-data-[multiple]:static": true,
    "group-data-[multiple]:block": true,
    "group-data-[empty]:hidden": true,
    "group-data-[multiple]:mt-1.5": true
  },
  "autocomplete__selectionWrapper": {
    "bg-neutral-100": true,
    "rounded": true,
    "group-data-[multiple]:border": true,
    "group-data-[multiple]:border-neutral-300": true,
    "group-data-[multiple]:mb-1.5": true,
    "outline-none": true,
    "data-[active-selection=true]:ring-2": true,
    "data-[active-selection=true]:ring-blue-500": true,
    "dark:bg-neutral-600": true,
    "dark:group-data-[multiple]:border-neutral-500": true,
    "[&.formkit-dropZone]:opacity-25": true,
    "[&.formkit-touchDropZone]:opacity-25": true,
    "[&.formkit-touchDragging]:!flex": true,
    "[&.formkit-longTouch]:opacity-25": true
  },
  "autocomplete__selection": {
    "rounded": true,
    "just": true,
    "pl-2": true,
    "[&>*]:ml-0": true,
    "dark:text-neutral-200": true
  },
  "colorpicker__outer": {
    "group": true,
    "max-w-[20em]": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "data-[disabled]:opacity-50": true,
    "text-base": true,
    "data-[disabled]:cursor-not-allowed": true,
    "data-[disabled]:pointer-events-none": true
  },
  "colorpicker__help": {
    "text-neutral-500": true,
    "text-xs": true,
    "dark:text-neutral-400": true,
    "group-data-[inline]:-mt-1": true,
    "group-data-[inline]:mb-2": true
  },
  "colorpicker__inner": {
    "relative": true,
    "inline-flex": true,
    "!w-auto": true,
    "pl-2": true,
    "group-data-[inline]:border-none": true,
    "group-data-[inline]:shadow-none": true,
    "group-data-[inline]:p-0": true,
    "group-data-[inline]:bg-transparent": true,
    "group-data-[inline]:outline-none": true,
    "group-data-[inline]:!ring-0": true,
    "group-data-[inline]:!w-full": true,
    "group-data-[inline]:rounded": true
  },
  "colorpicker__swatchPreview": {
    "w-full": true,
    "flex": true,
    "justify-start": true,
    "items-center": true,
    "rounded": true,
    "text-sm": true,
    "cursor-pointer": true,
    "outline-none": true
  },
  "colorpicker__canvasSwatchPreviewWrapper": {
    "relative": true,
    "before:content-['']": true,
    "before:absolute": true,
    "before:inset-0": true,
    "before:rounded": true,
    "before:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]": true,
    "before:z-[2]": true
  },
  "colorpicker__canvasSwatchPreview": {
    "text-base": true,
    "rounded": true,
    "aspect-[1/1]": true,
    "shrink-0": true,
    "grow": true,
    "!w-[1.5em]": true
  },
  "colorpicker__valueString": {
    "text-base": true,
    "text-neutral-700": true,
    "selection:bg-blue-100": true,
    "font-mono": true,
    "inline-block": true,
    "ml-2": true,
    "mr-1.5": true,
    "dark:text-neutral-300": true,
    "dark:selection:text-neutral-700": true
  },
  "colorpicker__panel": {
    "absolute": true,
    "left-0": true,
    "top-full": true,
    "z-[99]": true,
    "flex": true,
    "w-[100vw]": true,
    "max-w-[18.5em]": true,
    "touch-manipulation": true,
    "flex-col": true,
    "rounded": true,
    "border": true,
    "bg-white": true,
    "p-2": true,
    "shadow-md": true,
    "group-data-[inline]:static": true,
    "group-data-[inline]:max-w-none": true,
    "border-neutral-400": true,
    "group-data-[inline]:z-auto": true,
    "group-data-[inline]:w-full": true,
    "group-data-[inline]:shadow": true,
    "group-data-[inline]:group-data-[disabled]:!cursor-not-allowed": true,
    "group-data-[inline]:group-data-[disabled]:!pointer-events-none": true,
    "group-data-[inline]:[&:has([id^=swatches]:first-child:last-child)]:w-auto": true,
    "group-data-[inline]:[&:has([id^=swatches]:first-child:last-child)_[id^=swatches]>div]:w-[1.5em]": true,
    "dark:bg-neutral-800": true,
    "dark:border-neutral-500": true,
    "dark:group-data-[inline]:bg-transparent": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:!fixed": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:top-auto": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:max-w-none": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:bottom-0": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:left-0": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:rounded-none": true
  },
  "colorpicker__panelClose": {
    "flex": true,
    "justify-end": true,
    "items-center": true,
    "text-neutral-600": true,
    "mb-1.5": true,
    "-mt-1": true,
    "border-none": true,
    "bg-none": true,
    "border-b": true,
    "border-neutral-300": true,
    "w-[calc(100%+1rem)]": true,
    "-ml-2": true,
    "pt-0": true,
    "pr-2": true,
    "pb-1.5": true,
    "pl-2": true,
    "dark:border-neutral-600": true
  },
  "colorpicker__closeIcon": {
    "w-[2rem]": true,
    "aspect-[1/1]": true,
    "p-1": true,
    "rounded": true,
    "border": true,
    "[&>svg]:w-full": true,
    "[&>svg]:aspect-[1/1]": true,
    "[&>svg]:max-w-none": true,
    "[&>svg]:max-h-none": true
  },
  "colorpicker__controlGroup": {
    "grid": true,
    "[grid-template-areas:'a_a_a'_'b_c_e'_'b_d_e']": true,
    "mb-2": true
  },
  "colorpicker__LS": {
    "[grid-area:a]": true,
    "relative": true,
    "mb-2": true
  },
  "colorpicker__canvas": {
    "block": true,
    "w-full": true
  },
  "colorpicker__canvasLS": {
    "aspect-[2/1]": true,
    "cursor-pointer": true,
    "rounded-none": true
  },
  "colorpicker__canvasHue": {
    "rounded-none": true
  },
  "colorpicker__canvasAlpha": {
    "rounded-none": true
  },
  "colorpicker__preview": {
    "rounded": true,
    "after:rounded": true,
    "relative": true,
    "inline-flex": true,
    "aspect-[1/1]": true,
    "overflow-hidden": true,
    "[grid-area:b]": true,
    "mr-2": true,
    "after:absolute": true,
    "after:left-0": true,
    "after:top-0": true,
    "after:h-full": true,
    "after:w-full": true,
    "after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]": true,
    "after:content-['']": true,
    "w-[2em]": true,
    "dark:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]": true
  },
  "colorpicker__hue": {
    "[grid-area:c]": true,
    "relative": true,
    "inline-flex": true,
    "h-3/4": true
  },
  "colorpicker__alpha": {
    "[grid-area:d]": true,
    "relative": true,
    "inline-flex": true,
    "h-3/4": true
  },
  "colorpicker__eyeDropper": {
    "[grid-area:e]": true,
    "w-[2em]": true,
    "ml-2": true,
    "inline-flex": true,
    "self-center": true,
    "justify-center": true,
    "justify-self-center": true,
    "aspect-[1/1]": true,
    "rounded": true,
    "border": true,
    "border-neutral-300": true,
    "cursor-pointer": true,
    "content-center": true,
    "items-center": true,
    "text-neutral-600": true,
    "dark:border-neutral-600": true
  },
  "colorpicker__eyeDropperIcon": {
    "w-auto": true,
    "[&>svg]:w-[1em]": true,
    "dark:text-neutral-400": true
  },
  "colorpicker__control": {
    "absolute": true,
    "bg-white": true,
    "shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_3px_rgba(0,0,0,0.2)]": true,
    "-translate-y-1/2": true,
    "-translate-x-1/2": true,
    "pointer-events-none": true,
    "data-[prevent-focus-style]:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_3px_rgba(0,0,0,0.2)]": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-offset-2": true,
    "focus-visible:ring-blue-500": true
  },
  "colorpicker__controlLS": {
    "w-[10px]": true,
    "h-[10px]": true,
    "rounded-full": true
  },
  "colorpicker__controlHue": {
    "w-[4px]": true,
    "h-[calc(100%-2px)]": true,
    "top-1/2": true,
    "rounded": true
  },
  "colorpicker__controlAlpha": {
    "w-[4px]": true,
    "h-[calc(100%-2px)]": true,
    "top-1/2": true,
    "rounded": true
  },
  "colorpicker__formatField": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "grow": true
  },
  "colorpicker__colorField": {
    "bg-transparent": true,
    "text-neutral-700": true,
    "border": true,
    "border-neutral-300": true,
    "dark:border-neutral-600": true,
    "dark:text-neutral-300": true,
    "dark:selection:text-neutral-700": true
  },
  "colorpicker__colorInputGroup": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "grow": true
  },
  "colorpicker__fieldGroup": {
    "flex": true,
    "flex-col": true,
    "items-center": true,
    "justify-center": true,
    "w-full": true,
    "mr-1": true,
    "[&>input]:p-1": true,
    "[&>input]:text-sm": true,
    "[&>input]:text-neutral-700": true,
    "[&>input]:selection:bg-blue-100": true,
    "[&>input]:m-0": true,
    "[&>input]:grow": true,
    "[&>input]:shrink": true,
    "[&>input]:w-full": true,
    "[&>input]:border": true,
    "[&>input]:border-neutral-300": true,
    "[&>input]:rounded": true,
    "[&>input]:text-center": true,
    "[&>input]:appearance-none": true,
    "[&>input::-webkit-outer-spin-button]:appearance-none": true,
    "[&>input::-webkit-inner-spin-button]:appearance-none": true,
    "[&>input::-webkit-inner-spin-button]:m-0": true,
    "[&>input:focus]:outline-none": true,
    "[&>input:focus]:ring-1": true,
    "[&>input:focus]:ring-blue-600": true,
    "[&>input:focus]:border-blue-600": true,
    "max-[431px]:[&>input]:text-base": true
  },
  "colorpicker__fieldLabel": {
    "text-xs": true,
    "text-neutral-500": true,
    "mt-1.5": true,
    "dark:text-neutral-400": true
  },
  "colorpicker__formatSwitcher": {
    "flex": true,
    "justify-end": true,
    "self-start": true,
    "uppercase": true,
    "shrink-0": true,
    "p-1": true,
    "mt-0.5": true,
    "text-neutral-600": true,
    "rounded": true,
    "select-none": true,
    "dark:text-neutral-400": true
  },
  "colorpicker__switchIcon": {
    "[&>svg]:w-3": true
  },
  "colorpicker__swatches": {
    "inline-flex": true,
    "flex-wrap": true,
    "w-full": true,
    "justify-self-center": true,
    "min-w-0": true,
    "mx-auto": true,
    "px-[1px]": true,
    "pt-2": true,
    "pb-2": true,
    "mt-2": true,
    "-mb-2": true,
    "border-t": true,
    "border-neutral-300": true,
    "overflow-auto": true,
    "max-h-[200px]": true,
    "select-none": true,
    "first:-mt-[3px]": true,
    "first:last:-mb-[3px]": true,
    "first:last:pb-[2px]": true,
    "first:pt-px": true,
    "first:border-t-0": true,
    "dark:border-neutral-600": true
  },
  "colorpicker__swatchGroup": {
    "flex": true,
    "flex-wrap": true,
    "w-full": true,
    "mb-2": true,
    "last:mb-0": true
  },
  "colorpicker__swatchGroupLabel": {
    "ml-1": true,
    "block": true,
    "w-full": true,
    "text-sm": true,
    "text-neutral-500": true,
    "dark:text-neutral-400": true
  },
  "colorpicker__swatch": {
    "relative": true,
    "text-base": true,
    "w-[calc((100%/10)-0.5em)]": true,
    "max-w-[22px]": true,
    "m-[0.16em]": true,
    "cursor-pointer": true,
    "before:content-['']": true,
    "before:absolute": true,
    "before:inset-0": true,
    "before:rounded": true,
    "before:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]": true,
    "before:pointer-events-none": true,
    "before:z-[2]": true,
    "dark:before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]": true,
    "data-[active=true]:after:content-['']": true,
    "data-[active=true]:after:block": true,
    "data-[active=true]:after:absolute": true,
    "data-[active=true]:after:w-1.5": true,
    "data-[active=true]:after:h-1.5": true,
    "data-[active=true]:after:top-1/2": true,
    "data-[active=true]:after:left-1/2": true,
    "data-[active=true]:after:pointer-events-none": true,
    "data-[active=true]:after:rounded-full": true,
    "data-[active=true]:after:-translate-x-1/2": true,
    "data-[active=true]:after:-translate-y-1/2": true,
    "data-[active=true]:after:bg-white": true,
    "data-[active=true]:after:z-[2]": true,
    "data-[active=true]:after:ring-1": true,
    "data-[active=true]:after:ring-[rgba(0,0,0,0.33)]": true,
    "[&>canvas]:block": true,
    "[&>canvas]:w-full": true,
    "[&>canvas]:aspect-[1/1]": true,
    "[&>canvas]:rounded": true,
    "[&>canvas:focus-visible]:outline-none": true,
    "[&>canvas:focus-visible]:ring-2": true,
    "[&>canvas:focus-visible]:ring-blue-500": true,
    "[&>canvas:focus-visible]:ring-offset-2": true,
    "[&>canvas:focus-visible]:ring-offset-white": true,
    "dark:[&>canvas:focus-visible]:ring-offset-neutral-700": true
  },
  "datepicker__inner": {
    "relative": true
  },
  "datepicker__removeSelection": {
    "self-stretch": true,
    "text-base": true,
    "flex": true,
    "items-center": true,
    "ml-1": true,
    "mr-2": true,
    "text-neutral-700": true,
    "hover:text-red-400": true,
    "z-10": true,
    "dark:text-neutral-300": true
  },
  "datepicker__clearIcon": {
    "[&>svg]:w-[0.75em]": true
  },
  "datepicker__panelWrapper": {
    "group/panel": true,
    "absolute": true,
    "min-w-[20em]": true,
    "top-[calc(100%_+_0.5em)]": true,
    "left-0": true,
    "shadow-[0_0_1.25em_rgba(0,0,0,.25)]": true,
    "rounded": true,
    "p-4": true,
    "bg-white": true,
    "z-10": true,
    "dark:bg-neutral-800": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:!fixed": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:top-auto": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:max-w-none": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:bottom-0": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:left-0": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:rounded-none": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:w-full": true
  },
  "datepicker__panelHeader": {
    "grid": true,
    "grid-cols-[2.5em_1fr_2.5em]": true,
    "justify-center": true,
    "items-center": true,
    "border-b-2": true,
    "border-neutral-300": true,
    "mb-2": true,
    "pb-2.5": true,
    "dark:border-neutral-600": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:grid-cols-[2.5em_1fr_2.5em_2.5em]": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:group-data-[panel=time]/panel:grid-cols-[2.5em_1fr_2.5em]": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:group-data-[panel=month]/panel:grid-cols-[2.5em_1fr_2.5em]": true
  },
  "datepicker__panelClose": {
    "aspect-[1/1]": true,
    "border": true,
    "border-neutral-300": true,
    "rounded": true,
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "text-neutral-700": true,
    "[&_svg]:w-[1.25em]": true,
    "dark:text-neutral-300": true,
    "dark:border-neutral-600": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-data-[panel=time]/panel:col-start-3": true,
    "[@media(max-width:431px)_and_(hover:none)]:group-data-[panel=month]/panel:col-start-3": true
  },
  "datepicker__panel": {
    "flex": true,
    "justify-center": true
  },
  "datepicker__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "placeholder:text-neutral-400": true
  },
  "datepicker__monthsHeader": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "col-start-2": true,
    "col-end-2": true
  },
  "datepicker__timeHeader": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "col-start-2": true,
    "col-end-2": true
  },
  "datepicker__months": {
    "grid": true,
    "grid-cols-3": true,
    "w-full": true
  },
  "datepicker__month": {
    "m-1.5": true,
    "p-1.5": true,
    "text-center": true,
    "text-neutral-700": true,
    "rounded": true,
    "bg-neutral-200": true,
    "aria-selected:!bg-blue-600": true,
    "aria-selected:!text-white": true,
    "focus:outline": true,
    "focus:outline-2": true,
    "focus:outline-blue-600": true,
    "focus:outline-offset-2": true,
    "focus:bg-white": true,
    "focus:text-neutral-700": true,
    "data-[is-extra=true]:opacity-25": true,
    "group-data-[disabled=true]:opacity-50": true,
    "group-data-[disabled=true]:cursor-default": true,
    "group-data-[disabled=true]:pointer-events-none": true,
    "dark:bg-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "datepicker__yearsHeader": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "text-neutral-700": true,
    "col-start-2": true,
    "col-end-2": true,
    "dark:text-neutral-300": true
  },
  "datepicker__years": {
    "grid": true,
    "grid-cols-5": true,
    "w-full": true
  },
  "datepicker__year": {
    "text-base": true,
    "text-center": true,
    "text-neutral-700": true,
    "items-center": true,
    "m-1.5": true,
    "p-1.5": true,
    "rounded": true,
    "bg-neutral-200": true,
    "aria-selected:!bg-blue-600": true,
    "aria-selected:!text-white": true,
    "focus:outline": true,
    "focus:outline-2": true,
    "focus:outline-blue-600": true,
    "focus:outline-offset-2": true,
    "focus:bg-white": true,
    "data-[is-extra=true]:opacity-25": true,
    "group-data-[disabled=true]:opacity-50": true,
    "group-data-[disabled=true]:cursor-default": true,
    "group-data-[disabled=true]:pointer-events-none": true,
    "dark:bg-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "datepicker__weekDays": {
    "grid": true,
    "grid-cols-7": true
  },
  "datepicker__weekDay": {
    "w-[2.25em]": true,
    "text-neutral-700": true,
    "m-1.5": true,
    "rounded": true,
    "font-medium": true,
    "lowercase": true,
    "dark:text-neutral-500": true
  },
  "datepicker__calendarWeeks": {
    "": true
  },
  "datepicker__week": {
    "grid": true,
    "grid-cols-7": true,
    "group-data-[disabled=true]:opacity-50": true,
    "group-data-[disabled=true]:cursor-default": true,
    "group-data-[disabled=true]:pointer-events-none": true
  },
  "datepicker__dayCell": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "text-center": true,
    "text-neutral-700": true,
    "w-[2.25em]": true,
    "h-[2.25em]": true,
    "m-1": true,
    "p-2": true,
    "rounded": true,
    "bg-neutral-200": true,
    "aria-selected:bg-blue-600": true,
    "aria-selected:text-white": true,
    "focus:outline": true,
    "focus:outline-2": true,
    "focus:outline-blue-600": true,
    "focus:outline-offset-2": true,
    "focus:bg-white": true,
    "data-[is-extra=true]:opacity-25": true,
    "data-[disabled=true]:opacity-50": true,
    "data-[disabled=true]:cursor-default": true,
    "data-[disabled=true]:pointer-events-none": true,
    "dark:bg-neutral-600": true,
    "dark:text-neutral-300": true,
    "dark:aria-selected:bg-blue-600": true,
    "dark:aria-selected:text-white": true,
    "dark:focus:outline-blue-600": true,
    "dark:focus:bg-neutral-200": true,
    "dark:focus:text-neutral-700": true
  },
  "datepicker__timeInput": {
    "w-full": true,
    "border-2": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "text-neutral-700": true,
    "border-neutral-300": true,
    "rounded": true,
    "p-1.5": true,
    "my-2.5": true,
    "focus-visible:outline-blue-600": true,
    "dark:text-neutral-300": true,
    "dark:bg-transparent": true,
    "dark:border-neutral-600": true
  },
  "datepicker__daysHeader": {
    "flex": true,
    "items-center": true,
    "justify-center": true
  },
  "datepicker__prev": {
    "mr-auto": true,
    "px-2.5": true,
    "py-0.5": true,
    "hover:bg-neutral-100": true,
    "rounded": true,
    "col-start-1": true,
    "col-end-1": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:ring-offset-2": true
  },
  "datepicker__prevLabel": {
    "hidden": true
  },
  "datepicker__prevIcon": {
    "flex": true,
    "w-[0.75em]": true,
    "select-none": true,
    "text-neutral-700": true,
    "[&>svg]:w-full": true,
    "dark:text-neutral-300": true
  },
  "datepicker__dayButton": {
    "appearance-none": true,
    "text-neutral-700": true,
    "cursor-pointer": true,
    "px-2.5": true,
    "py-0.5": true,
    "border-2": true,
    "border-neutral-300": true,
    "rounded": true,
    "mx-1": true,
    "hover:border-blue-600": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:ring-offset-2": true,
    "dark:text-neutral-300": true,
    "dark:border-neutral-600": true,
    "dark:hover:border-blue-500": true
  },
  "datepicker__monthButton": {
    "appearance-none": true,
    "text-neutral-700": true,
    "cursor-pointer": true,
    "px-2.5": true,
    "py-0.5": true,
    "border-2": true,
    "border-neutral-300": true,
    "rounded": true,
    "mx-1": true,
    "hover:border-blue-600": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:ring-offset-2": true,
    "dark:text-neutral-300": true,
    "dark:border-neutral-600": true,
    "dark:hover:border-blue-500": true
  },
  "datepicker__yearButton": {
    "appearance-none": true,
    "text-neutral-700": true,
    "cursor-pointer": true,
    "px-2.5": true,
    "py-0.5": true,
    "border-2": true,
    "border-neutral-300": true,
    "rounded": true,
    "mx-1": true,
    "hover:border-blue-600": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:ring-offset-2": true,
    "dark:text-neutral-300": true,
    "dark:border-neutral-600": true,
    "dark:hover:border-blue-500": true
  },
  "datepicker__next": {
    "ml-auto": true,
    "px-2.5": true,
    "py-0.5": true,
    "rounded": true,
    "hover:bg-neutral-100": true,
    "hover:rounded": true,
    "col-start-3": true,
    "col-end-3": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:ring-offset-2": true
  },
  "datepicker__nextLabel": {
    "hidden": true
  },
  "datepicker__nextIcon": {
    "flex": true,
    "w-[0.75em]": true,
    "select-none": true,
    "text-neutral-700": true,
    "[&>svg]:w-full": true,
    "dark:text-neutral-300": true
  },
  "datepicker__openButton": {
    "appearance-none": true,
    "border-0": true,
    "bg-transparent": true,
    "flex": true,
    "p-0": true,
    "self-stretch": true,
    "cursor-pointer": true,
    "focus-visible:outline-none": true,
    "focus-visible:ring-2": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:ring-offset-2": true,
    "focus-visible:rounded": true
  },
  "datepicker__calendarIcon": {
    "text-neutral-600": true,
    "focus-visible:text-blue-600": true,
    "flex": true,
    "w-[1em]": true,
    "grow-0": true,
    "shrink-0": true,
    "self-stretch": true,
    "select-none": true,
    "[&>svg]:w-full": true,
    "[&>svg]:m-auto": true,
    "[&>svg]:max-h-[1em]": true,
    "[&>svg]:max-w-[1em]": true
  },
  "dropdown__placeholder": {
    "text-neutral-400": true,
    "grow": true,
    "dark:text-neutral-400/50": true
  },
  "dropdown__selector": {
    "flex": true,
    "grow": true,
    "justify-between": true,
    "w-full": true,
    "py-2": true,
    "pl-3": true,
    "pr-0": true,
    "text-base": true,
    "text-neutral-700": true,
    "text-left": true,
    "group-data-[disabled]:!cursor-not-allowed": true,
    "group-data-[prefix-icon]:!pl-0": true,
    "group-data-[suffix-icon]:!pr-0": true,
    "data-[placeholder]:text-neutral-400": true,
    "selection:bg-blue-100": true,
    "dark:data-[placeholder]:text-neutral-400/50": true,
    "dark:text-neutral-300": true
  },
  "dropdown__selectIcon": {
    "shrink-0": true
  },
  "dropdown__selectionsWrapper": {
    "w-[85%]": true,
    "overflow-hidden": true
  },
  "dropdown__selection": {
    "[&>*]:ml-0": true
  },
  "dropdown__selections": {
    "inline-flex": true,
    "items-center": true
  },
  "dropdown__selectionsItem": {
    "whitespace-nowrap": true,
    "mr-1": true
  },
  "dropdown__tagWrapper": {
    "[&.formkit-dropZone_.formkit-tag]:opacity-25": true,
    "[&.formkit-touchDropZone_.formkit-tag]:opacity-25": true
  },
  "dropdown__truncationCount": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "h-[1.5em]": true,
    "rounded": true,
    "bg-neutral-400": true,
    "text-white": true,
    "whitespace-nowrap": true,
    "text-[11px]": true,
    "[line-height:1em]": true,
    "tracking-tighter": true,
    "leading-0": true,
    "py-1": true,
    "px-1": true,
    "shrink-0": true,
    "my-auto": true
  },
  "mask__inner": {
    "relative": true
  },
  "mask__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "group-data-[has-overlay]:!caret-neutral-700": true,
    "dark:group-data-[has-overlay]:!caret-neutral-300": true
  },
  "rating__inner": {
    "text-neutral-300": true
  },
  "rating__itemsWrapper": {
    "relative": true,
    "inline-flex": true,
    "focus:border-blue-600": true
  },
  "rating__onItemRow": {
    "h-full": true,
    "w-full": true
  },
  "rating__offItemRow": {
    "h-full": true,
    "w-full": true
  },
  "rating__onItemWrapper": {
    "[&>*]:w-full": true,
    "[&>*]:h-full": true,
    "w-full": true,
    "h-full": true,
    "text-yellow-400": true
  },
  "rating__offItemWrapper": {
    "text-neutral-400": true,
    "w-full": true,
    "h-full": true,
    "[&>*]:w-full": true,
    "[&>*]:h-full": true,
    "dark:text-neutral-500": true
  },
  "rating__ratingItem": {
    "relative": true,
    "focus-within:outline": true,
    "focus-within:outline-blue-600": true,
    "w-[1.5em]": true,
    "h-[1.5em]": true
  },
  "rating__itemLabelInner": {
    "h-px": true,
    "w-px": true,
    "overflow-hidden": true,
    "absolute": true,
    "white-space-nowrap": true
  },
  "rating__itemLabel": {
    "absolute": true,
    "h-full": true
  },
  "rating__ratingIcon": {
    "w-[1.5em]": true,
    "h-[1.5em]": true,
    "flex": true
  },
  "rating__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "outline-none": true
  },
  "rating__messages": {
    "mt-1.5": true
  },
  "repeater__outer": {
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "text-base": true,
    "group/repeater": true,
    "max-w-full": true
  },
  "repeater__fieldset": {
    "min-w-0": true
  },
  "repeater__legend": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "dark:text-neutral-300": true,
    "mb-2": true
  },
  "repeater__content": {
    "min-w-0": true,
    "grow": true,
    "p-5": true,
    "flex": true,
    "flex-col": true,
    "align-center": true,
    "[&>div[data-type]]:max-w-none": true,
    "[&>div[data-type]:last-child]:mb-0": true
  },
  "repeater__addButton": {
    "!mb-0": true,
    "group-data-[disabled]/repeater:pointer-events-none": true,
    "group-data-[disabled]/repeater:opacity-50": true,
    "group-data-[disabled]/repeater:grayscale": true
  },
  "repeater__controlLabel": {
    "absolute": true,
    "opacity-0": true,
    "pointer-events-none": true,
    "text-[0px]": true
  },
  "repeater__controls": {
    "flex": true,
    "flex-col": true,
    "items-center": true,
    "justify-center": true,
    "bg-neutral-50": true,
    "p-2": true,
    "[&>li]:aspect-[1/1]": true,
    "dark:bg-neutral-800": true,
    "rounded": true,
    "rounded-tl-none": true,
    "rounded-bl-none": true
  },
  "repeater__downControl": {
    "w-[1.5em]": true,
    "h-[1.5em]": true,
    "my-1.5": true,
    "mx-auto": true,
    "flex": true,
    "items-center": true,
    "appearance-none": true,
    "justify-center": true,
    "aspect-[1/1]": true,
    "text-neutral-500": true,
    "hover:text-blue-600": true,
    "disabled:hover:text-inherit": true,
    "disabled:opacity-25": true,
    "disabled:!text-neutral-500": true,
    "dark:text-neutral-300": true,
    "dark:disabled:!text-neutral-300": true,
    "dark:hover:text-blue-500": true
  },
  "repeater__upControl": {
    "w-[1.5em]": true,
    "h-[1.5em]": true,
    "my-1.5": true,
    "mx-auto": true,
    "flex": true,
    "items-center": true,
    "appearance-none": true,
    "justify-center": true,
    "aspect-[1/1]": true,
    "text-neutral-500": true,
    "hover:text-blue-600": true,
    "disabled:hover:text-inherit": true,
    "disabled:opacity-25": true,
    "disabled:!text-neutral-500": true,
    "dark:text-neutral-300": true,
    "dark:disabled:!text-neutral-300": true,
    "dark:hover:text-blue-500": true
  },
  "repeater__removeControl": {
    "w-[1.5em]": true,
    "h-[1.5em]": true,
    "my-1.5": true,
    "mx-auto": true,
    "flex": true,
    "items-center": true,
    "appearance-none": true,
    "justify-center": true,
    "aspect-[1/1]": true,
    "text-neutral-500": true,
    "hover:text-blue-600": true,
    "disabled:hover:text-inherit": true,
    "disabled:opacity-25": true,
    "disabled:!text-neutral-500": true,
    "dark:text-neutral-300": true,
    "dark:disabled:!text-neutral-300": true,
    "dark:hover:text-blue-500": true
  },
  "repeater__insertControl": {
    "w-[1.5em]": true,
    "h-[1.5em]": true,
    "my-1.5": true,
    "mx-auto": true,
    "flex": true,
    "items-center": true,
    "appearance-none": true,
    "justify-center": true,
    "aspect-[1/1]": true,
    "text-neutral-500": true,
    "hover:text-blue-600": true,
    "disabled:hover:text-inherit": true,
    "disabled:opacity-25": true,
    "disabled:!text-neutral-500": true,
    "dark:text-neutral-300": true,
    "dark:disabled:!text-neutral-300": true,
    "dark:hover:text-blue-500": true
  },
  "repeater__help": {
    "text-neutral-500": true,
    "text-xs": true,
    "dark:text-neutral-400": true,
    "mb-2": true,
    "-mt-1": true
  },
  "repeater__item": {
    "flex": true,
    "relative": true,
    "w-full": true,
    "mb-2": true,
    "bg-white": true,
    "border": true,
    "border-neutral-300": true,
    "rounded": true,
    "shadow": true,
    "dark:border-neutral-600": true,
    "dark:bg-transparent": true,
    "[&.formkit-dropZone]:opacity-30": true,
    "[&.formkit-dropZone]:pointer-events-none": true,
    "[&.formkit-dropZone]:blur-[2px]": true
  },
  "repeater__dragHandleWrapper": {
    "relative": true,
    "w-8": true,
    "bg-neutral-50": true,
    "rounded": true,
    "rounded-tr-none": true,
    "rounded-br-none": true,
    "dark:bg-neutral-800": true
  },
  "repeater__dragHandle": {
    "w-full": true,
    "h-full": true,
    "flex": true,
    "absolute": true,
    "top-0": true,
    "left-0": true,
    "cursor-grab": true,
    "active:cursor-grabbing": true
  },
  "repeater__dragHandleIcon": {
    "w-2": true,
    "m-auto": true,
    "text-neutral-500": true,
    "dark:text-neutral-400": true,
    "[&>svg>path]:fill-current": true
  },
  "repeater__moveDownIcon": {
    "block": true,
    "w-[0.75em]": true,
    "aspect-[1/1]": true
  },
  "repeater__moveUpIcon": {
    "block": true,
    "w-[0.75em]": true,
    "aspect-[1/1]": true
  },
  "repeater__removeIcon": {
    "block": true,
    "w-[1.25em]": true,
    "aspect-[1/1]": true
  },
  "repeater__addIcon": {
    "block": true,
    "w-[1.25em]": true,
    "aspect-[1/1]": true
  },
  "slider__outer": {
    "group": true,
    "max-w-[20em]": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "data-[disabled]:opacity-50": true,
    "text-base": true,
    "data-[disabled]:pointer-events-none": true
  },
  "slider__help": {
    "text-neutral-500": true,
    "text-xs": true,
    "dark:text-neutral-400": true,
    "-mt-0.5": true,
    "mb-1.5": true
  },
  "slider__sliderInner": {
    "flex": true,
    "items-center": true,
    "[&>[data-type=number]]:mb-0": true,
    "[&>[data-type=number]]:ml-2.5": true,
    "[&>[data-type=number]]:shrink": true,
    "[&>[data-type=number]]:grow-0": true,
    "[&[data-has-mark-labels=true]_[id^=track]]:mb-5": true
  },
  "slider__track": {
    "grow": true,
    "relative": true,
    "z-20": true,
    "py-2.5": true,
    "select-none": true
  },
  "slider__trackWrapper": {
    "px-[2px]": true,
    "rounded-full": true,
    "bg-neutral-300": true,
    "dark:bg-neutral-500": true
  },
  "slider__trackInner": {
    "h-1.5": true,
    "mx-0.5": true,
    "relative": true
  },
  "slider__prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "slider__suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true,
    "text-neutral-600": true,
    "dark:text-neutral-300": true
  },
  "slider__fill": {
    "h-full": true,
    "rounded-full": true,
    "absolute": true,
    "top-0": true,
    "-mx-1": true,
    "bg-blue-600": true,
    "group-data-[disabled]:bg-neutral-500": true
  },
  "slider__marks": {
    "absolute": true,
    "pointer-events-none": true,
    "inset-0": true
  },
  "slider__mark": {
    "absolute": true,
    "top-1/2": true,
    "w-[3px]": true,
    "h-[3px]": true,
    "rounded-full": true,
    "-translate-x-1/2": true,
    "-translate-y-1/2": true,
    "bg-neutral-400": true,
    "data-[active=true]:bg-white": true
  },
  "slider__markLabel": {
    "absolute": true,
    "top-[calc(100%+0.5em)]": true,
    "left-1/2": true,
    "text-neutral-400": true,
    "text-xs": true,
    "-translate-x-1/2": true
  },
  "slider__handles": {
    "m-0": true,
    "p-0": true,
    "list-none": true
  },
  "slider__handle": {
    "group": true,
    "select-none": true,
    "w-4": true,
    "h-4": true,
    "rounded-full": true,
    "bg-white": true,
    "absolute": true,
    "top-1/2": true,
    "left-0": true,
    "z-30": true,
    "-translate-x-1/2": true,
    "-translate-y-1/2": true,
    "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.5)]": true,
    "focus-visible:outline-0": true,
    "focus-visible:ring-2": true,
    "ring-blue-600": true,
    "data-[is-target=true]:z-20": true,
    "dark:bg-neutral-200": true
  },
  "slider__tooltip": {
    "absolute": true,
    "bottom-full": true,
    "left-1/2": true,
    "-translate-x-1/2": true,
    "-translate-y-[4px]": true,
    "bg-blue-600": true,
    "text-white": true,
    "py-1": true,
    "px-1.5": true,
    "text-xs": true,
    "leading-none": true,
    "whitespace-nowrap": true,
    "rounded": true,
    "opacity-0": true,
    "pointer-events-none": true,
    "transition-opacity": true,
    'after:content-[""]': true,
    "after:absolute": true,
    "after:top-full": true,
    "after:left-1/2": true,
    "after:-translate-x-1/2": true,
    "after:-translate-y-[1px]": true,
    "after:border-4": true,
    "after:border-transparent": true,
    "after:border-t-blue-600": true,
    "group-hover:opacity-100": true,
    "group-focus-visible:opacity-100": true,
    "group-data-[show-tooltip=true]:opacity-100": true
  },
  "slider__linkedValues": {
    "flex": true,
    "items-start": true,
    "justify-between": true
  },
  "slider__minValue": {
    "grow": true,
    "!max-w-[45%]": true,
    "mb-0": true,
    "[&>div>div]:relative": true,
    '[&>div>div::after]:content-[""]': true,
    "[&>div>div::after]:absolute": true,
    "[&>div>div::after]:top-1/2": true,
    "[&>div>div::after]:left-[105.5%]": true,
    "[&>div>div::after]:w-[12%]": true,
    "[&>div>div::after]:h-[1px]": true,
    "[&>div>div::after]:bg-neutral-400": true,
    "dark:[&>div>div::after]:bg-neutral-500": true
  },
  "slider__maxValue": {
    "grow": true,
    "!max-w-[45%]": true,
    "mb-0": true,
    "relative": true
  },
  "slider__chart": {
    "relative": true,
    "z-20": true,
    "mb-2": true,
    "flex": true,
    "justify-between": true,
    "items-center": true,
    "w-full": true,
    "aspect-[3/1]": true
  },
  "slider__chartBar": {
    "absolute": true,
    "bottom-0": true,
    "h-full": true,
    "bg-neutral-400": true,
    "data-[active=false]:bg-neutral-300": true,
    "dark:bg-neutral-500": true,
    "dark:data-[active=false]:bg-neutral-600": true
  },
  "taglist__inner": {
    "py-2": true,
    "pr-0": true,
    "pl-0": true
  },
  "taglist__tags": {
    "pl-3": true
  },
  "taglist__tagWrapper": {
    "[&.formkit-dropZone_.formkit-tag]:opacity-25": true,
    "[&.formkit-touchDropZone_.formkit-tag]:opacity-25": true
  },
  "taglist__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "!p-0": true,
    "!w-[0%]": true,
    "min-w-[1em]": true,
    "inline-block": true,
    "-mt-1": true,
    "first:mt-0": true,
    "first:mb-1": true
  },
  "taglist__listboxButton": {
    "ml-auto": true,
    "shrink-0": true
  },
  "toggle__outer": {
    "group": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "data-[disabled]:opacity-50": true,
    "text-base": true,
    "max-w-none": true
  },
  "toggle__altLabel": {
    "block": true,
    "w-full": true,
    "mb-1.5": true,
    "font-bold": true,
    "text-xs": true,
    "text-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "toggle__inner": {
    "peer": true,
    "inline-block": true,
    "mr-2": true
  },
  "toggle__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "peer": true,
    "absolute": true,
    "opacity-0": true,
    "w-0": true,
    "h-0": true
  },
  "toggle__label": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "mb-1": true,
    "dark:text-neutral-300": true,
    "peer-first:font-normal": true,
    "peer-first:mb-0": true
  },
  "toggle__innerLabel": {
    "absolute": true,
    "text-neutral-200": true,
    "text-[10px]": true,
    "font-bold": true,
    "select-none": true,
    "left-full": true,
    "top-1/2": true,
    "-translate-x-full": true,
    "-translate-y-1/2": true,
    "px-1": true
  },
  "toggle__thumb": {
    "relative": true,
    "p-0.5": true,
    "left-0": true,
    "aspect-[1/1]": true,
    "rounded-full": true,
    "transition-all": true,
    "w-[1.25em]": true,
    "bg-neutral-50": true,
    "text-neutral-600": true,
    "shadow-base": true
  },
  "toggle__track": {
    "p-0.5": true,
    "min-w-[3em]": true,
    "relative": true,
    "cursor-pointer": true,
    "select-none": true,
    "rounded-full": true,
    "transition-all": true,
    "bg-neutral-400": true,
    "peer-checked:bg-blue-600": true,
    "peer-checked:[&>div:last-child]:left-full": true,
    "peer-checked:[&>div:last-child]:-translate-x-full": true,
    "peer-checked:[&>div:first-child:not(:last-child)]:left-0": true,
    "peer-checked:[&>div:first-child:not(:last-child)]:translate-x-0": true,
    "shadow-sm": true,
    "peer-focus-visible:ring-2": true,
    "peer-focus-visible:ring-blue-500": true,
    "peer-focus-visible:ring-offset-2": true,
    "dark:bg-neutral-500": true
  },
  "toggle__valueLabel": {
    "font-bold": true,
    "text-xs": true,
    "text-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "toggle__wrapper": {
    "flex": true,
    "flex-wrap": true,
    "items-center": true,
    "mb-1.5": true
  },
  "togglebuttons__wrapper": {
    "mb-1.5": true
  },
  "togglebuttons__options": {
    "group/options": true,
    "inline-flex": true,
    "data-[vertical=true]:flex-col": true
  },
  "togglebuttons__option": {
    "group/option": true
  },
  "togglebuttons__input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true,
    "!px-4": true,
    "!mb-0": true,
    "relative": true,
    "focus:z-10": true,
    "group-data-[vertical=true]/options:w-full": true,
    "justify-center": true,
    "bg-blue-50": true,
    "disabled:opacity-50": true,
    "disabled:cursor-not-allowed": true,
    "group-data-[disabled]:disabled:opacity-100": true,
    "dark:bg-transparent": true,
    "dark:disabled:bg-transparent": true,
    "dark:disabled:text-blue-500": true,
    "dark:text-blue-500": true,
    "aria-[pressed=true]:bg-blue-600": true,
    "aria-[pressed=true]:text-white": true,
    "dark:aria-[pressed=true]:bg-blue-600": true,
    "dark:aria-[pressed=true]:text-white": true,
    "group-[]/option:!rounded-none": true,
    "group-data-[vertical=false]/options:group-first/option:!rounded": true,
    "group-data-[vertical=true]/options:group-first/option:!rounded": true,
    "group-data-[vertical=false]/options:group-first/option:!rounded-tr-none": true,
    "group-data-[vertical=false]/options:group-first/option:!rounded-br-none": true,
    "group-data-[vertical=true]/options:group-first/option:!rounded-bl-none": true,
    "group-data-[vertical=true]/options:group-first/option:!rounded-br-none": true,
    "group-data-[vertical=false]/options:group-last/option:!rounded": true,
    "group-data-[vertical=true]/options:group-last/option:!rounded": true,
    "group-data-[vertical=false]/options:group-last/option:!rounded-tl-none": true,
    "group-data-[vertical=false]/options:group-last/option:!rounded-bl-none": true,
    "group-data-[vertical=true]/options:group-last/option:!rounded-tl-none": true,
    "group-data-[vertical=true]/options:group-last/option:!rounded-tr-none": true,
    "group-data-[vertical=false]/options:group-[]/option:!border-r-0": true,
    "group-data-[vertical=false]/options:group-last/option:!border-r": true,
    "group-data-[vertical=false]/options:group-[]/option:aria-[pressed=true]:border-x-blue-500": true,
    "group-data-[vertical=false]/options:group-first/option:aria-[pressed=true]:border-l-blue-600": true,
    "group-data-[vertical=false]/options:group-last/option:aria-[pressed=true]:border-r-blue-600": true,
    "dark:group-data-[vertical=false]/options:group-[]/option:aria-[pressed=true]:border-x-blue-600": true,
    "dark:group-data-[vertical=false]/options:group-first/option:aria-[pressed=true]:border-l-blue-600": true,
    "dark:group-data-[vertical=false]/options:group-last/option:aria-[pressed=true]:border-r-blue-600": true,
    "group-data-[vertical=true]/options:group-[]/option:!border-b-0": true,
    "group-data-[vertical=true]/options:group-last/option:!border-b": true,
    "group-data-[vertical=true]/options:group-[]/option:aria-[pressed=true]:border-y-blue-500": true,
    "group-data-[vertical=true]/options:group-first/option:aria-[pressed=true]:border-t-blue-600": true,
    "group-data-[vertical=true]/options:group-last/option:aria-[pressed=true]:border-b-blue-600": true,
    "dark:group-data-[vertical=true]/options:group-[]/option:aria-[pressed=true]:border-y-blue-600": true,
    "dark:group-data-[vertical=true]/options:group-first/option:aria-[pressed=true]:border-t-blue-600": true,
    "dark:group-data-[vertical=true]/options:group-last/option:aria-[pressed=true]:border-b-blue-600": true
  },
  "transferlist__outer": {
    "group": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "data-[disabled]:opacity-50": true,
    "text-base": true,
    "max-w-none": true,
    "[&_.dnd-placeholder]:bg-blue-600": true,
    "[&_.dnd-placeholder]:text-white": true
  },
  "transferlist__wrapper": {
    "flex": true,
    "flex-col": true,
    "sm:flex-row": true,
    "justify-between": true,
    "w-full": true,
    "max-w-none": true
  },
  "transferlist__help": {
    "text-neutral-500": true,
    "text-xs": true,
    "dark:text-neutral-400": true,
    "pb-2": true
  },
  "transferlist__transferlist": {
    "grow": true,
    "shrink": true,
    "min-w-0": true,
    "shadow": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "aspect-[4/5]": true,
    "flex": true,
    "flex-col": true,
    "h-[350px]": true,
    "border": true,
    "border-neutral-300": true,
    "rounded": true,
    "overflow-hidden": true,
    "select-none": true,
    "[&:has(:focus-visible)]:ring-1": true,
    "[&:has(:focus-visible)]:ring-blue-500": true,
    "dark:border-neutral-600": true,
    "dark:bg-neutral-900/50": true
  },
  "transferlist__transferlistHeader": {
    "flex": true,
    "bg-neutral-100": true,
    "text-neutral-600": true,
    "text-sm": true,
    "justify-between": true,
    "items-center": true,
    "border-b": true,
    "border-neutral-300": true,
    "py-2": true,
    "px-2.5": true,
    "dark:bg-neutral-700": true,
    "dark:border-neutral-600": true,
    "dark:text-neutral-400": true
  },
  "transferlist__transferlistHeaderItemCount": {
    "ml-auto": true,
    "text-xs": true,
    "min-w-[1.5em]": true,
    "[line-height:1.5em]": true,
    "px-2": true,
    "text-center": true,
    "rounded-xl": true,
    "bg-neutral-200": true,
    "text-neutral-700": true,
    "dark:bg-neutral-500": true,
    "dark:text-neutral-300": true
  },
  "transferlist__transferlistListItems": {
    "list-none": true,
    "bg-white": true,
    "h-full": true,
    "overflow-x-hidden": true,
    "overflow-y-auto": true,
    "dark:bg-transparent": true,
    "outline-none": true
  },
  "transferlist__transferlistListItem": {
    "py-2": true,
    "px-2": true,
    "text-neutral-700": true,
    "ring-1": true,
    "ring-neutral-200": true,
    "aria-selected:bg-blue-100": true,
    "data-[is-active=true]:bg-blue-100": true,
    "data-[is-active=true]:ring-blue-200": true,
    "aria-selected:ring-blue-200": true,
    "relative": true,
    "flex": true,
    "cursor-pointer": true,
    "items-center": true,
    "bg-white": true,
    "pl-[1.5em]": true,
    "first:-mt-px": true,
    "first:border-t": true,
    "aria-selected:z-[2]": true,
    "aria-selected:border-transparent": true,
    "aria-selected:ring-1": true,
    "data-[is-active=true]:z-[2]": true,
    "data-[is-active=true]:border-transparent": true,
    "data-[is-active=true]:ring-1": true,
    "group-data-[is-max=true]:cursor-not-allowed": true,
    "dark:bg-neutral-800": true,
    "dark:text-neutral-300": true,
    "dark:data-[is-active=true]:bg-blue-900": true,
    "dark:aria-selected:bg-blue-900": true,
    "dark:ring-neutral-700": true,
    "dark:data-[is-active=true]:ring-blue-600": true,
    "dark:aria-selected:ring-blue-600": true,
    "[&.formkit-dropZone]:bg-blue-100": true,
    "[&.formkit-selectionDropZone]:bg-blue-100": true,
    "[&.formkit-touchDropZone]:bg-blue-100": true,
    "[&.formkit-touchSelectionDropZone]:bg-blue-100": true,
    "[&.formkit-longTouch]:bg-blue-100": true,
    "dark:[&.formkit-dropZone]:bg-blue-900": true,
    "dark:[&.formkit-selectionDropZone]:bg-blue-900": true,
    "dark:[&.formkit-touchDropZone]:bg-blue-900": true,
    "dark:[&.formkit-touchSelectionDropZone]:bg-blue-900": true,
    "dark:[&.formkit-longTouch]:bg-blue-900": true
  },
  "transferlist__transferlistOption": {
    "text-sm": true
  },
  "transferlist__transferControls": {
    "inline-flex": true,
    "grow-0": true,
    "shrink": true,
    "border": true,
    "border-neutral-300": true,
    "flex-row": true,
    "sm:flex-col": true,
    "justify-center": true,
    "my-2": true,
    "sm:my-auto": true,
    "mx-auto": true,
    "sm:mx-2": true,
    "rounded": true,
    "overflow-clip": true,
    "shadow-none": true,
    "group-[]/repeater:shadow-none": true,
    "group-[]/multistep:shadow-none": true,
    "dark:border-neutral-800": true
  },
  "transferlist__sourceEmptyMessage": {
    "appearance-none": true,
    "border-none": true,
    "w-full": true,
    "my-2": true,
    "text-center": true,
    "text-neutral-500": true,
    "italic": true
  },
  "transferlist__sourceListItems": {
    "group-data-[is-max=true]:opacity-50": true
  },
  "transferlist__targetEmptyMessage": {
    "appearance-none": true,
    "border-none": true,
    "w-full": true,
    "my-2": true,
    "text-center": true,
    "text-neutral-500": true,
    "italic": true
  },
  "transferlist__emptyMessageInner": {
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "p-2": true,
    "text-sm": true
  },
  "transferlist__transferlistControls": {
    "bg-white": true,
    "p-2": true,
    "border-b": true,
    "border-neutral-200": true,
    "dark:bg-neutral-700": true,
    "dark:border-neutral-700": true
  },
  "transferlist__transferlistSearch": {
    "flex": true,
    "border": true,
    "border-neutral-300": true,
    "rounded": true,
    "items-center": true,
    "text-neutral-700": true,
    "selection:bg-blue-100": true,
    "dark:border-neutral-600": true,
    "dark:text-neutral-300": true,
    "dark:selection:bg-blue-100": true,
    "dark:selection:text-neutral-700": true,
    "dark:bg-neutral-800": true
  },
  "transferlist__transferlistSearchInput": {
    "border-none": true,
    "px-2": true,
    "py-1.5": true,
    "w-full": true,
    "bg-transparent": true,
    "outline-none": true,
    "text-sm": true
  },
  "transferlist__transferlistSearchClear": {
    "flex": true,
    "w-[0.75em]": true,
    "mr-2": true,
    "[&_svg]:w-full": true
  },
  "transferlist__controlLabel": {
    "absolute": true,
    "opacity-0": true,
    "pointer-events-none": true,
    "text-[0px]": true
  },
  "transferlist__selectedIcon": {
    "w-[0.75em]": true,
    "absolute": true,
    "left-[0.5em]": true,
    "select-none": true,
    "text-blue-600": true,
    "dark:text-blue-500": true
  },
  "transferlist__transferlistButton": {
    "sm:w-5": true,
    "relative": true,
    "flex": true,
    "justify-center": true,
    "text-sm": true,
    "shrink-0": true,
    "box-content": true,
    "text-neutral-700": true,
    "disabled:bg-neutral-200": true,
    "disabled:!text-neutral-400": true,
    "bg-neutral-50": true,
    "hover:text-blue-600": true,
    "cursor-pointer": true,
    "appearance-none": true,
    "border-none": true,
    "p-2.5": true,
    "hover:z-10": true,
    "disabled:cursor-not-allowed": true,
    "disabled:opacity-50": true,
    "disabled:hover:text-current": true,
    "disabled:hover:outline-none": true,
    "focus-visible:ring-1": true,
    "focus-visible:ring-blue-500": true,
    "focus-visible:z-10": true,
    "dark:bg-neutral-800": true,
    "dark:text-neutral-400": true,
    "dark:disabled:!text-neutral-600": true,
    "dark:disabled:bg-neutral-900": true,
    "dark:disabled:hover:text-current": true,
    "dark:disabled:hover:outline-none": true,
    "dark:hover:text-blue-500": true
  },
  "transferlist__fastForwardIcon": {
    "w-4": true,
    "flex": true,
    "select-none": true,
    "[&>svg]:m-auto": true,
    "[&>svg]:w-full": true,
    "[&>svg]:max-w-[1rem]": true,
    "[&>svg]:max-h-[1rem]": true,
    "rotate-90": true,
    "sm:rotate-0": true
  },
  "transferlist__moveRightIcon": {
    "w-4": true,
    "flex": true,
    "select-none": true,
    "[&>svg]:m-auto": true,
    "[&>svg]:w-full": true,
    "[&>svg]:max-w-[1rem]": true,
    "[&>svg]:max-h-[1rem]": true,
    "rotate-90": true,
    "sm:rotate-0": true
  },
  "transferlist__moveLeftIcon": {
    "w-4": true,
    "flex": true,
    "select-none": true,
    "[&>svg]:m-auto": true,
    "[&>svg]:w-full": true,
    "[&>svg]:max-w-[1rem]": true,
    "[&>svg]:max-h-[1rem]": true,
    "rotate-90": true,
    "sm:rotate-0": true
  },
  "transferlist__rewindIcon": {
    "w-4": true,
    "flex": true,
    "select-none": true,
    "[&>svg]:m-auto": true,
    "[&>svg]:w-full": true,
    "[&>svg]:max-w-[1rem]": true,
    "[&>svg]:max-h-[1rem]": true,
    "rotate-90": true,
    "sm:rotate-0": true
  },
  "transferlist__messages": {
    "mt-2": true
  },
  "barcode__barcodeIcon": {
    "w-[1.5em]": true,
    "text-neutral-700": true,
    "cursor-pointer": true,
    "dark:text-neutral-300": true
  },
  "barcode__dialog": {
    "border-none": true,
    "outline-none": true,
    "overflow-clip": true,
    "p-0": true,
    "bg-black": true,
    "rounded": true,
    "w-[100%-2rem]": true,
    "max-w-[30rem]": true,
    "[&::backdrop]:bg-neutral-800/50": true
  },
  "barcode__video": {
    "w-full": true,
    "aspect-[1/1]": true,
    "object-cover": true,
    "block": true,
    "pointer-events-none": true
  },
  "barcode__closeIcon": {
    "cursor-pointer": true,
    "absolute": true,
    "bg-white": true,
    "color-neutral-700": true,
    "w-[1.5em]": true,
    "h-[1.5em]": true,
    "rounded": true,
    "flex": true,
    "top-2": true,
    "right-2": true,
    "z-20": true,
    "[&>svg]:w-[1.25em]": true,
    "[&>svg]:h-[1.25em]": true,
    "[&>svg]:m-auto": true
  },
  "barcode__overlay": {
    "text-neutral-700": true,
    "dark:text-neutral-300": true,
    "absolute": true,
    "top-1/2": true,
    "left-1/2": true,
    "w-[min(20em,75%)]": true,
    "aspect-[1/1]": true,
    "-translate-x-1/2": true,
    "-translate-y-1/2": true,
    "rounded": true,
    "pointer-events-none": true,
    "shadow-[0_0_0_999em_rgba(0,0,0,0.5)]": true
  },
  "barcode__overlayDecorators": {
    "absolute": true,
    "inset-0": true,
    "z-10": true
  },
  "barcode__overlayDecoratorTopLeft": {
    "absolute": true,
    "w-[1.5rem]": true,
    "h-[1.5rem]": true,
    "rounded": true,
    "top-0": true,
    "left-0": true,
    "border-l-4": true,
    "border-t-4": true,
    "rounded-tr-none": true,
    "rounded-bl-none": true
  },
  "barcode__overlayDecoratorTopRight": {
    "absolute": true,
    "w-[1.5rem]": true,
    "h-[1.5rem]": true,
    "rounded": true,
    "top-0": true,
    "right-0": true,
    "border-r-4": true,
    "border-t-4": true,
    "rounded-tl-none": true,
    "rounded-br-none": true
  },
  "barcode__overlayDecoratorBottomRight": {
    "absolute": true,
    "w-[1.5rem]": true,
    "h-[1.5rem]": true,
    "rounded": true,
    "bottom-0": true,
    "right-0": true,
    "border-r-4": true,
    "border-b-4": true,
    "rounded-tr-none": true,
    "rounded-bl-none": true
  },
  "barcode__overlayDecoratorBottomLeft": {
    "absolute": true,
    "w-[1.5rem]": true,
    "h-[1.5rem]": true,
    "rounded": true,
    "bottom-0": true,
    "left-0": true,
    "border-l-4": true,
    "border-b-4": true,
    "rounded-tl-none": true,
    "rounded-br-none": true
  },
  "multi-step__outer": {
    "group": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "data-[disabled]:opacity-50": true,
    "text-base": true,
    "group/multistep": true,
    "max-w-[32rem]": true
  },
  "multi-step__wrapper": {
    "group/wrapper": true,
    "data-[tab-style=tab]:shadow": true,
    "data-[tab-style=tab]:rounded": true
  },
  "multi-step__tabs": {
    "flex": true,
    "items-center": true,
    "group-data-[tab-style=tab]/wrapper:overflow-auto": true,
    "group-data-[tab-style=tab]/wrapper:border": true,
    "group-data-[tab-style=tab]/wrapper:border-b-0": true,
    "group-data-[tab-style=tab]/wrapper:border-neutral-300": true,
    "group-data-[tab-style=tab]/wrapper:rounded": true,
    "group-data-[tab-style=tab]/wrapper:rounded-bl-none": true,
    "group-data-[tab-style=tab]/wrapper:rounded-br-none": true,
    "dark:group-data-[tab-style=tab]/wrapper:border-neutral-600": true,
    "group-data-[tab-style=progress]/wrapper:my-6": true,
    "group-data-[tab-style=progress]/wrapper:justify-around": true,
    "group-data-[tab-style=progress]/wrapper:overflow-visible": true,
    "group-data-[tab-style=progress]/wrapper:group-data-[hide-labels=true]/wrapper:mb-3.5": true
  },
  "multi-step__tab": {
    "group/tab": true,
    "group-data-[tab-style=tab]/wrapper:relative": true,
    "group-data-[tab-style=tab]/wrapper:flex": true,
    "group-data-[tab-style=tab]/wrapper:grow": true,
    "group-data-[tab-style=tab]/wrapper:text-sm": true,
    "group-data-[tab-style=tab]/wrapper:items-center": true,
    "group-data-[tab-style=tab]/wrapper:justify-center": true,
    "group-data-[tab-style=tab]/wrapper:cursor-pointer": true,
    "group-data-[tab-style=tab]/wrapper:text-neutral-700": true,
    "group-data-[tab-style=tab]/wrapper:bg-neutral-100": true,
    "group-data-[tab-style=tab]/wrapper:py-3.5": true,
    "group-data-[tab-style=tab]/wrapper:px-4": true,
    "group-data-[tab-style=tab]/wrapper:border-r": true,
    "group-data-[tab-style=tab]/wrapper:border-b": true,
    "group-data-[tab-style=tab]/wrapper:border-neutral-300": true,
    "group-data-[tab-style=tab]/wrapper:last:border-r-0": true,
    "group-data-[tab-style=tab]/wrapper:shadow-[inset_0_-0.5em_0.5em_-0.5em_rgba(0,0,0,0.1)]": true,
    "group-data-[tab-style=tab]/wrapper:data-[active=true]:bg-white": true,
    "group-data-[tab-style=tab]/wrapper:data-[active=true]:font-bold": true,
    "group-data-[tab-style=tab]/wrapper:data-[active=true]:border-b-white": true,
    "group-data-[tab-style=tab]/wrapper:data-[active=true]:z-10": true,
    "group-data-[tab-style=tab]/wrapper:data-[active=true]:shadow-[0_0_0.5em_0_rgba(0,0,0,0.1)]": true,
    "dark:group-data-[tab-style=tab]/wrapper:text-neutral-300": true,
    "dark:group-data-[tab-style=tab]/wrapper:bg-neutral-950/20": true,
    "dark:group-data-[tab-style=tab]/wrapper:data-[active=true]:bg-transparent": true,
    "dark:group-data-[tab-style=tab]/wrapper:data-[active=true]:border-b-transparent": true,
    "dark:group-data-[tab-style=tab]/wrapper:border-neutral-600": true,
    "group-data-[tab-style=progress]/wrapper:flex": true,
    "group-data-[tab-style=progress]/wrapper:flex-col": true,
    "group-data-[tab-style=progress]/wrapper:items-center": true,
    "group-data-[tab-style=progress]/wrapper:grow": true,
    "group-data-[tab-style=progress]/wrapper:shrink-0": true,
    "group-data-[tab-style=progress]/wrapper:relative": true,
    "group-data-[tab-style=progress]/wrapper:before:block": true,
    "group-data-[tab-style=progress]/wrapper:before:text-sm": true,
    "group-data-[tab-style=progress]/wrapper:before:w-[1.25rem]": true,
    "group-data-[tab-style=progress]/wrapper:before:h-[1.25rem]": true,
    "group-data-[tab-style=progress]/wrapper:before:border-4": true,
    "group-data-[tab-style=progress]/wrapper:before:border-neutral-300": true,
    "group-data-[tab-style=progress]/wrapper:before:rounded-full": true,
    "group-data-[tab-style=progress]/wrapper:before:bg-white": true,
    "group-data-[tab-style=progress]/wrapper:before:z-10": true,
    "dark:group-data-[tab-style=progress]/wrapper:before:border-neutral-600": true,
    "dark:group-data-[tab-style=progress]/wrapper:before:bg-neutral-950": true,
    "group-data-[tab-style=progress]/wrapper:after:block": true,
    "group-data-[tab-style=progress]/wrapper:after:h-1": true,
    "group-data-[tab-style=progress]/wrapper:after:w-full": true,
    "group-data-[tab-style=progress]/wrapper:after:absolute": true,
    "group-data-[tab-style=progress]/wrapper:after:top-[0.5em]": true,
    "group-data-[tab-style=progress]/wrapper:after:left-[calc(50%+0.5em)]": true,
    "group-data-[tab-style=progress]/wrapper:after:bg-neutral-300": true,
    "group-data-[tab-style=progress]/wrapper:data-[valid=true]:data-[visited=true]:after:bg-blue-600": true,
    "group-data-[tab-style=progress]/wrapper:last:after:hidden": true,
    "dark:group-data-[tab-style=progress]/wrapper:after:bg-neutral-600": true,
    "dark:group-data-[tab-style=progress]/wrapper:data-[valid=true]:data-[visited=true]:after:bg-blue-600": true
  },
  "multi-step__tabLabel": {
    "group-data-[tab-style=progress]/wrapper:absolute": true,
    "group-data-[tab-style=progress]/wrapper:text-neutral-800": true,
    "group-data-[tab-style=progress]/wrapper:top-full": true,
    "group-data-[tab-style=progress]/wrapper:w-full": true,
    "group-data-[tab-style=progress]/wrapper:whitespace-nowrap": true,
    "group-data-[tab-style=progress]/wrapper:text-xs": true,
    "dark:group-data-[tab-style=progress]/wrapper:text-neutral-300": true
  },
  "multi-step__badge": {
    "bg-red-600": true,
    "absolute": true,
    "font-mono": true,
    "font-bold": true,
    "flex": true,
    "items-center": true,
    "justify-center": true,
    "aspect-[1/1]": true,
    "[line-height:1.25rem]": true,
    "text-white": true,
    "rounded-full": true,
    "group-data-[valid=true]/tab:bg-blue-600": true,
    "group-data-[tab-style=tab]/wrapper:text-[0.66rem]": true,
    "group-data-[tab-style=tab]/wrapper:p-1.5": true,
    "group-data-[tab-style=tab]/wrapper:w-5": true,
    "group-data-[tab-style=tab]/wrapper:h-5": true,
    "group-data-[tab-style=tab]/wrapper:top-1.5": true,
    "group-data-[tab-style=tab]/wrapper:right-1.5": true,
    "group-data-[tab-style=progress]/wrapper:w-[1.25rem]": true,
    "group-data-[tab-style=progress]/wrapper:h-[1.25rem]": true,
    "group-data-[tab-style=progress]/wrapper:p-1": true,
    "group-data-[tab-style=progress]/wrapper:text-[10px]": true,
    "group-data-[tab-style=progress]/wrapper:[line-height:0]": true,
    "group-data-[tab-style=progress]/wrapper:z-10": true
  },
  "multi-step__validStepIcon": {
    "w-full": true,
    "h-full": true,
    "mt-0.5": true
  },
  "multi-step__steps": {
    "px-10": true,
    "pt-8": true,
    "pb-4": true,
    "bg-white": true,
    "border": true,
    "border-neutral-300": true,
    "rounded": true,
    "dark:bg-transparent": true,
    "dark:border-neutral-600": true,
    "group-data-[tab-style=tab]/wrapper:border-t-0": true,
    "group-data-[tab-style=tab]/wrapper:rounded-tl-none": true,
    "group-data-[tab-style=tab]/wrapper:rounded-tr-none": true,
    "group-data-[tab-style=progress]/wrapper:shadow": true,
    "[&_[data-type]]:max-w-none": true
  },
  "step__stepActions": {
    "flex": true,
    "justify-between": true,
    "[&>*]:grow-0": true
  },
  "step__stepPrevious": {
    "mr-1.5": true
  },
  "step__stepNext": {
    "ml-auto": true
  }
};
const globals = {
  "outer": {
    "group": true,
    "max-w-[20em]": true,
    "min-w-0": true,
    "grow": true,
    "mb-4": true,
    "data-[disabled]:select-none": true,
    "data-[disabled]:opacity-50": true,
    "text-base": true
  },
  "label": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "mb-1": true,
    "dark:text-neutral-300": true
  },
  "legend": {
    "block": true,
    "text-neutral-700": true,
    "text-sm": true,
    "font-bold": true,
    "dark:text-neutral-300": true
  },
  "input": {
    "appearance-none": true,
    "[color-scheme:light]": true,
    "dark:[color-scheme:dark]": true,
    "selection:bg-blue-100": true,
    "selection:text-neutral-700": true,
    "group-data-[has-overlay]:selection:!text-transparent": true
  },
  "prefixIcon": {
    "flex": true,
    "items-center": true,
    "-ml-1": true,
    "mr-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true
  },
  "suffixIcon": {
    "flex": true,
    "items-center": true,
    "-mr-1": true,
    "ml-2": true,
    "text-base": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true
  },
  "loaderIcon": {
    "animate-spin": true,
    "flex": true,
    "items-center": true,
    "my-auto": true,
    "ml-2": true,
    "text-base": true,
    "text-neutral-500": true,
    "h-[1em]": true,
    "w-[1em]": true,
    "shrink-0": true,
    "[&>svg]:w-full": true
  },
  "loadMoreInner": {
    "flex": true,
    "text-sm": true,
    "text-neutral-500": true,
    "p-2": true,
    "items-center": true,
    "justify-center": true,
    "[&>span]:mr-2": true
  },
  "help": {
    "text-neutral-500": true,
    "text-xs": true,
    "dark:text-neutral-400": true
  },
  "message": {
    "text-red-600": true,
    "mb-1.5": true,
    "text-xs": true,
    "dark:text-red-400": true
  },
  "overlay": {
    "text-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "overlayPlaceholder": {
    "text-neutral-400": true,
    "dark:text-neutral-400/50": true
  },
  "overlayLiteral": {
    "text-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "overlayChar": {
    "text-neutral-700": true,
    "dark:text-neutral-300": true
  },
  "overlayEnum": {
    "text-neutral-700": true,
    "dark:text-neutral-300": true
  }
};
const config = defaultConfig({
  plugins: [
    createMultiStepPlugin()
    // createLocalStoragePlugin({
    //   prefix: 'pcstore',
    //   key: undefined,
    //   control: undefined,
    //   maxAge: 3600000, // 1小时
    //   debounce: 200,
    //   beforeSave: undefined,
    //   beforeLoad: undefined
    // }),
  ],
  icons: { ...genesisIcons },
  config: { rootClasses },
  locales: { zhTW },
  locale: "zhTW"
});
const app = createApp(App);
app.use(plugin, defaultConfig(config));
app.mount("#app");
