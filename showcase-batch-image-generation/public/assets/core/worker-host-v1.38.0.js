var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array2, target) => __defNormalProp(target, __knownSymbol("metadata"), array2[3]);
var __runInitializers = (array2, flags, self2, value) => {
  for (var i = 0, fns = array2[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self2) : value = fns[i].call(self2, value);
  return value;
};
var __decorateElement = (array2, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array2.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array2[j - 1] = []), extraInitializers = array2[j] || (array2[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array2[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array2, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter2) => (__accessCheck(obj, member, "read from private field"), getter2 ? getter2.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter2) => (__accessCheck(obj, member, "write to private field"), setter2 ? setter2.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// ../../node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "../../node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// ../../node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "../../node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// ../../node_modules/buffer/index.js
var require_buffer = __commonJS({
  "../../node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        var arr = new Uint8Array(1);
        var proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      var buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer2.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      var valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      var b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer2.from(
          value[Symbol.toPrimitive]("string"),
          encodingOrOffset,
          length
        );
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer2, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string2, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      var length = byteLength(string2, encoding) | 0;
      var buf = createBuffer(length);
      var actual = buf.write(string2, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array2) {
      var length = array2.length < 0 ? 0 : checked(array2.length) | 0;
      var buf = createBuffer(length);
      for (var i = 0; i < length; i += 1) {
        buf[i] = array2[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        var copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array2, byteOffset, length) {
      if (byteOffset < 0 || array2.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array2.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      var buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array2);
      } else if (length === void 0) {
        buf = new Uint8Array(array2, byteOffset);
      } else {
        buf = new Uint8Array(array2, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      var x = a.length;
      var y = b.length;
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      var i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      var buffer = Buffer2.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            Buffer2.from(buf).copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string2, encoding) {
      if (Buffer2.isBuffer(string2)) {
        return string2.length;
      }
      if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
        return string2.byteLength;
      }
      if (typeof string2 !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
        );
      }
      var len = string2.length;
      var mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string2).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string2).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string2).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      var loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      var i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      var length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      var str = "";
      var max2 = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max2).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max2) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
    }
    Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);
      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);
      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read2(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      var i;
      if (dir) {
        var foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          var found = true;
          for (var j = 0; j < valLength; j++) {
            if (read2(arr, i + j) !== read2(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string2, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      var strLen = string2.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string2.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string2, offset, length) {
      return blitBuffer(utf8ToBytes(string2, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string2, offset, length) {
      return blitBuffer(asciiToBytes(string2), buf, offset, length);
    }
    function base64Write(buf, string2, offset, length) {
      return blitBuffer(base64ToBytes(string2), buf, offset, length);
    }
    function ucs2Write(buf, string2, offset, length) {
      return blitBuffer(utf16leToBytes(string2, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string2, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string2.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string2, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string2, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string2, offset, length);
          case "base64":
            return base64Write(this, string2, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string2, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];
      var i = start;
      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      var res = "";
      var i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      var len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      var out = "";
      for (var i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = "";
      for (var i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      var newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer2.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      var i = byteLength2;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max2, min2) {
      if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max2 || value < min2) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function checkIEEE754(buf, value, offset, ext, max2, min2) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      var len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      var i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        var len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string2, units) {
      units = units || Infinity;
      var codePoint;
      var length = string2.length;
      var leadSurrogate = null;
      var bytes = [];
      for (var i = 0; i < length; ++i) {
        codePoint = string2.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type2) {
      return obj instanceof type2 || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type2.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = function() {
      var alphabet = "0123456789abcdef";
      var table = new Array(256);
      for (var i = 0; i < 16; ++i) {
        var i16 = i * 16;
        for (var j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
  }
});

// ../../esbuild/polyfill.noop.js
var require_polyfill_noop = __commonJS({
  "../../esbuild/polyfill.noop.js"() {
    "use strict";
  }
});

// ../../_builds/cesdk/wasm32-unknown-emscripten/RelWithDebInfo/cesdk.js
var require_cesdk = __commonJS({
  "../../_builds/cesdk/wasm32-unknown-emscripten/RelWithDebInfo/cesdk.js"(exports, module) {
    "use strict";
    var CESDK2 = (() => {
      var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      if (typeof __filename !== "undefined") _scriptDir ||= __filename;
      return function(moduleArg = {}) {
        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        Module["ready"] = new Promise((resolve, reject) => {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        ["_malloc", "_free", "___indirect_function_table", "_ma_malloc_emscripten", "_ma_free_emscripten", "_ma_device_process_pcm_frames_capture__webaudio", "_ma_device_process_pcm_frames_playback__webaudio", "_isLocalTrackingEnabled", "_getTrackingOverrideEndpoint", "_jsUpdateTexture", "_getWindowHostname", "_setItem", "_getItem", "_isLocalStorageDefined", "_clearItem", "_main", "onRuntimeInitialized"].forEach((prop) => {
          if (!Object.getOwnPropertyDescriptor(Module["ready"], prop)) {
            Object.defineProperty(Module["ready"], prop, {
              get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
              set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
            });
          }
        });
        if (!Module.expectedDataFileDownloads) {
          Module.expectedDataFileDownloads = 0;
        }
        Module.expectedDataFileDownloads++;
        (function() {
          if (Module["ENVIRONMENT_IS_PTHREAD"] || Module["$ww"]) return;
          var loadPackage = function(metadata) {
            var PACKAGE_PATH = "";
            if (typeof window === "object") {
              PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/");
            } else if (typeof process === "undefined" && typeof location !== "undefined") {
              PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/");
            }
            var PACKAGE_NAME = "cesdk.data";
            var REMOTE_PACKAGE_BASE = "cesdk.data";
            if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
              Module["locateFile"] = Module["locateFilePackage"];
              err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)");
            }
            var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
            var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
            function fetchRemotePackage(packageName, packageSize, callback, errback) {
              if (typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string") {
                require_polyfill_noop().readFile(packageName, function(err2, contents) {
                  if (err2) {
                    errback(err2);
                  } else {
                    callback(contents.buffer);
                  }
                });
                return;
              }
              var xhr = new XMLHttpRequest();
              xhr.open("GET", packageName, true);
              xhr.responseType = "arraybuffer";
              xhr.onprogress = function(event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                  if (!xhr.addedTotal) {
                    xhr.addedTotal = true;
                    if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                    Module.dataFileDownloads[url] = {
                      loaded: event.loaded,
                      total: size
                    };
                  } else {
                    Module.dataFileDownloads[url].loaded = event.loaded;
                  }
                  var total = 0;
                  var loaded = 0;
                  var num = 0;
                  for (var download in Module.dataFileDownloads) {
                    var data = Module.dataFileDownloads[download];
                    total += data.total;
                    loaded += data.loaded;
                    num++;
                  }
                  total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                  if (Module["setStatus"]) Module["setStatus"](`Downloading data... (${loaded}/${total})`);
                } else if (!Module.dataFileDownloads) {
                  if (Module["setStatus"]) Module["setStatus"]("Downloading data...");
                }
              };
              xhr.onerror = function(event) {
                throw new Error("NetworkError for: " + packageName);
              };
              xhr.onload = function(event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                  var packageData = xhr.response;
                  callback(packageData);
                } else {
                  throw new Error(xhr.statusText + " : " + xhr.responseURL);
                }
              };
              xhr.send(null);
            }
            ;
            function handleError(error) {
              console.error("package error:", error);
            }
            ;
            var fetchedCallback = null;
            var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
            if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
              if (fetchedCallback) {
                fetchedCallback(data);
                fetchedCallback = null;
              } else {
                fetched = data;
              }
            }, handleError);
            function runWithFS() {
              function assert4(check, msg) {
                if (!check) throw msg + new Error().stack;
              }
              Module["FS_createPath"]("/", "ly.img.cesdk", true, true);
              Module["FS_createPath"]("/ly.img.cesdk", "fonts", true, true);
              Module["FS_createPath"]("/ly.img.cesdk", "icons", true, true);
              Module["FS_createPath"]("/ly.img.cesdk", "icu", true, true);
              Module["FS_createPath"]("/ly.img.cesdk", "presets", true, true);
              Module["FS_createPath"]("/ly.img.cesdk", "shaders", true, true);
              Module["FS_createPath"]("/ly.img.cesdk/shaders", "common", true, true);
              function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio;
              }
              DataRequest.prototype = {
                requests: {},
                open: function(mode, name) {
                  this.name = name;
                  this.requests[name] = this;
                  Module["addRunDependency"](`fp ${this.name}`);
                },
                send: function() {
                },
                onload: function() {
                  var byteArray = this.byteArray.subarray(this.start, this.end);
                  this.finish(byteArray);
                },
                finish: function(byteArray) {
                  var that = this;
                  Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                  Module["removeRunDependency"](`fp ${that.name}`);
                  this.requests[this.name] = null;
                }
              };
              var files = metadata["files"];
              for (var i2 = 0; i2 < files.length; ++i2) {
                new DataRequest(files[i2]["start"], files[i2]["end"], files[i2]["audio"] || 0).open("GET", files[i2]["filename"]);
              }
              function processPackageData(arrayBuffer) {
                assert4(arrayBuffer, "Loading data file failed.");
                assert4(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                var curr;
                DataRequest.prototype.byteArray = byteArray;
                var files2 = metadata["files"];
                for (var i3 = 0; i3 < files2.length; ++i3) {
                  DataRequest.prototype.requests[files2[i3].filename].onload();
                }
                Module["removeRunDependency"]("datafile_cesdk.data");
              }
              ;
              Module["addRunDependency"]("datafile_cesdk.data");
              if (!Module.preloadResults) Module.preloadResults = {};
              Module.preloadResults[PACKAGE_NAME] = { fromCache: false };
              if (fetched) {
                processPackageData(fetched);
                fetched = null;
              } else {
                fetchedCallback = processPackageData;
              }
            }
            if (Module["calledRun"]) {
              runWithFS();
            } else {
              if (!Module["preRun"]) Module["preRun"] = [];
              Module["preRun"].push(runWithFS);
            }
          };
          loadPackage({ "files": [{ "filename": "/ly.img.cesdk/fonts/imgly_font_inter_semibold.otf", "start": 0, "end": 270760 }, { "filename": "/ly.img.cesdk/icons/ErrorAudio.svg", "start": 270760, "end": 271672 }, { "filename": "/ly.img.cesdk/icons/ErrorConnection.svg", "start": 271672, "end": 272620 }, { "filename": "/ly.img.cesdk/icons/ErrorVideo.svg", "start": 272620, "end": 273473 }, { "filename": "/ly.img.cesdk/icons/Move.svg", "start": 273473, "end": 274413 }, { "filename": "/ly.img.cesdk/icons/RotateIndicator.svg", "start": 274413, "end": 275394 }, { "filename": "/ly.img.cesdk/icu/icudt74l.dat", "start": 275394, "end": 810498 }, { "filename": "/ly.img.cesdk/presets/.keep", "start": 810498, "end": 810498 }, { "filename": "/ly.img.cesdk/shaders/adjustments.sksl", "start": 810498, "end": 814387 }, { "filename": "/ly.img.cesdk/shaders/black_and_white_color_mixer.sksl", "start": 814387, "end": 820704 }, { "filename": "/ly.img.cesdk/shaders/common/ubq_adjustments.sksl", "start": 820704, "end": 825295 }, { "filename": "/ly.img.cesdk/shaders/common/ubq_color_conversions.sksl", "start": 825295, "end": 835280 }, { "filename": "/ly.img.cesdk/shaders/common/ubq_constants.sksl", "start": 835280, "end": 835770 }, { "filename": "/ly.img.cesdk/shaders/common/ubq_hue_constants.sksl", "start": 835770, "end": 838937 }, { "filename": "/ly.img.cesdk/shaders/common/ubq_noise.sksl", "start": 838937, "end": 841575 }, { "filename": "/ly.img.cesdk/shaders/cross_cut.sksl", "start": 841575, "end": 842522 }, { "filename": "/ly.img.cesdk/shaders/dot_pattern.sksl", "start": 842522, "end": 843600 }, { "filename": "/ly.img.cesdk/shaders/duotone_filter.sksl", "start": 843600, "end": 844564 }, { "filename": "/ly.img.cesdk/shaders/extrude_blur.sksl", "start": 844564, "end": 846681 }, { "filename": "/ly.img.cesdk/shaders/glow.sksl", "start": 846681, "end": 847648 }, { "filename": "/ly.img.cesdk/shaders/half_tone.sksl", "start": 847648, "end": 848142 }, { "filename": "/ly.img.cesdk/shaders/hsp_selective_adjustments.sksl", "start": 848142, "end": 861742 }, { "filename": "/ly.img.cesdk/shaders/linocut.sksl", "start": 861742, "end": 862527 }, { "filename": "/ly.img.cesdk/shaders/liquid.sksl", "start": 862527, "end": 863009 }, { "filename": "/ly.img.cesdk/shaders/lut_filter.sksl", "start": 863009, "end": 865872 }, { "filename": "/ly.img.cesdk/shaders/mask_color.sksl", "start": 865872, "end": 866377 }, { "filename": "/ly.img.cesdk/shaders/mirror.sksl", "start": 866377, "end": 866831 }, { "filename": "/ly.img.cesdk/shaders/outliner.sksl", "start": 866831, "end": 868468 }, { "filename": "/ly.img.cesdk/shaders/pixelize.sksl", "start": 868468, "end": 868768 }, { "filename": "/ly.img.cesdk/shaders/placeholder_overlay_lines.sksl", "start": 868768, "end": 869456 }, { "filename": "/ly.img.cesdk/shaders/posterize.sksl", "start": 869456, "end": 869668 }, { "filename": "/ly.img.cesdk/shaders/radial_pixel.sksl", "start": 869668, "end": 870231 }, { "filename": "/ly.img.cesdk/shaders/recolor.sksl", "start": 870231, "end": 872432 }, { "filename": "/ly.img.cesdk/shaders/sharpie.sksl", "start": 872432, "end": 874737 }, { "filename": "/ly.img.cesdk/shaders/shifter.sksl", "start": 874737, "end": 875421 }, { "filename": "/ly.img.cesdk/shaders/tiltshift.sksl", "start": 875421, "end": 876003 }, { "filename": "/ly.img.cesdk/shaders/tv_glitch.sksl", "start": 876003, "end": 876721 }, { "filename": "/ly.img.cesdk/shaders/vignette.sksl", "start": 876721, "end": 877093 }], "remote_package_size": 877093 });
        })();
        if (Module["ENVIRONMENT_IS_PTHREAD"] || Module["$ww"]) Module["preRun"] = [];
        var necessaryPreJSTasks = Module["preRun"].slice();
        if (typeof window === "object" && typeof window.performance === "object") {
          Module.performance = performance;
        } else if (typeof global === "object" && typeof global.perf_hooks === "object" && typeof global.perf_hooks.performance === "object") {
          Module.performance = global.perf_hooks.performance;
        } else {
          Module.performance = { mark: function() {
          }, measure: function() {
          } };
        }
        var emscripten_ubq_FetchState;
        (function(emscripten_ubq_FetchState2) {
          emscripten_ubq_FetchState2[emscripten_ubq_FetchState2["PENDING"] = 0] = "PENDING";
          emscripten_ubq_FetchState2[emscripten_ubq_FetchState2["FINISHED"] = 1] = "FINISHED";
          emscripten_ubq_FetchState2[emscripten_ubq_FetchState2["ALLOCATED"] = 2] = "ALLOCATED";
          emscripten_ubq_FetchState2[emscripten_ubq_FetchState2["ERROR"] = 3] = "ERROR";
        })(emscripten_ubq_FetchState || (emscripten_ubq_FetchState = {}));
        var emscripten_ubq_FetchMethod;
        (function(emscripten_ubq_FetchMethod2) {
          emscripten_ubq_FetchMethod2[emscripten_ubq_FetchMethod2["GET"] = 0] = "GET";
          emscripten_ubq_FetchMethod2[emscripten_ubq_FetchMethod2["POST"] = 1] = "POST";
        })(emscripten_ubq_FetchMethod || (emscripten_ubq_FetchMethod = {}));
        class FetchProcess {
          constructor(handle, uri) {
            this.state = emscripten_ubq_FetchState.PENDING;
            this.totalBytes = 0;
            this.receivedLength = 0;
            this.handle = handle;
            this.uri = uri;
            this.abortController = new AbortController();
            this.abortSignal = this.abortController.signal;
          }
          async readChunks(body) {
            let receivedLength = 0;
            const chunks = [];
            const readChunk = (chunk) => {
              chunks.push(chunk);
              receivedLength += chunk.length;
              this.receivedLength = receivedLength;
            };
            if (body == null) {
            } else if ("getReader" in body) {
              const reader = body.getReader();
              for (; ; ) {
                const { done, value } = await reader.read();
                if (done)
                  break;
                if (this.abortSignal.aborted) {
                  await reader.cancel();
                  reader.releaseLock();
                  throw new Error(this.abortSignal.reason);
                }
                readChunk(value);
              }
              reader.releaseLock();
            } else {
              const handleAbort = () => body.destroy(new Error(this.abortSignal.reason));
              this.abortSignal.addEventListener("abort", handleAbort, { once: true });
              try {
                await new Promise((resolve, reject) => {
                  body.on("data", readChunk);
                  body.on("end", () => resolve());
                  body.on("error", (err2) => reject(err2));
                });
              } finally {
                this.abortSignal.removeEventListener("abort", handleAbort);
              }
            }
            const mergedChunks = new Uint8Array(receivedLength);
            let position = 0;
            for (const chunk of chunks) {
              mergedChunks.set(chunk, position);
              position += chunk.length;
            }
            return this.finish(mergedChunks);
          }
          abort() {
            if (this.isPending()) {
              this.abortController.abort("Fetch aborted");
            }
          }
          isPending() {
            return this.state === emscripten_ubq_FetchState.PENDING;
          }
          isError() {
            return this.state === emscripten_ubq_FetchState.ERROR;
          }
          isFinished() {
            return this.state === emscripten_ubq_FetchState.FINISHED;
          }
          isAllocated() {
            return this.state === emscripten_ubq_FetchState.ALLOCATED;
          }
          allocate() {
            if (this.isAllocated())
              return this;
            if (this.isFinished()) {
              const resultLength = this.result.length;
              const resultAddress = Module._malloc(resultLength);
              Module.HEAPU8.set(this.result, resultAddress);
              const allocatedProcess = Object.assign(Object.assign({}, this), {
                state: emscripten_ubq_FetchState.ALLOCATED,
                resultAddress,
                resultLength
              });
              Object.assign(this, allocatedProcess);
              return allocatedProcess;
            }
            return null;
          }
          finish(result) {
            const finishedProcess = Object.assign(Object.assign({}, this), { state: emscripten_ubq_FetchState.FINISHED, result, totalBytes: result.length });
            return Object.assign(this, finishedProcess);
          }
          fail(error) {
            const erroredProcess = Object.assign(Object.assign({}, this), { state: emscripten_ubq_FetchState.ERROR, error });
            return Object.assign(this, erroredProcess);
          }
        }
        class AsyncFetchManager {
          constructor() {
            this._nextHandle = 0;
            this._nextHeaderHandle = 0;
            this._processes = /* @__PURE__ */ new Map();
            this._headers = /* @__PURE__ */ new Map();
            this._fetchImpl = null;
          }
          _fetch(args, init2) {
            if (this._fetchImpl) {
              return this._fetchImpl(args, init2);
            } else {
              return fetch(args, init2);
            }
          }
          setFetch(fetchImp) {
            this._fetchImpl = fetchImp;
          }
          getProcess(handle) {
            return this._processes.get(handle);
          }
          deleteProcess(handle) {
            const process2 = this._processes.get(handle);
            if (process2 === null || process2 === void 0 ? void 0 : process2.isPending()) {
              process2.abort();
            }
            return this._processes.delete(handle);
          }
          clear() {
            for (const process2 of this._processes.values()) {
              if (process2.isPending()) {
                process2.abort();
              }
            }
            this._processes.clear();
            this._headers.clear();
          }
          fetch(method, uriAddress, uriLength, headerHandlesAddress, headerHandleCount, requestBodyAddress, requestBodyLength, credentialsAddress, credentialsLength) {
            const uriString = Module.UTF8ToString(uriAddress, uriLength);
            const handle = this._nextHandle++;
            const process2 = new FetchProcess(handle, uriString);
            this._processes.set(handle, process2);
            if (uriString.match(/^file:/)) {
              this._fetchFile(process2).catch((error) => {
                process2.fail(error);
              });
            } else {
              this._fetchRemote(process2, method, headerHandlesAddress, headerHandleCount, requestBodyAddress, requestBodyLength, credentialsAddress, credentialsLength).catch((error) => {
                process2.fail(error);
              });
            }
            return process2;
          }
          async _fetchFile(process2) {
            if (typeof window !== "undefined")
              throw new Error("File URLs supported only in Node.JS");
            const fs2 = require_polyfill_noop();
            const { fileURLToPath } = require_polyfill_noop();
            const readStream = fs2.createReadStream(fileURLToPath(process2.uri));
            return process2.readChunks(readStream);
          }
          async _fetchRemote(process2, method, headerHandlesAddress, headerHandleCount, requestBodyAddress, requestBodyLength, credentialsAddress, credentialsLength) {
            const credentials = Module.UTF8ToString(credentialsAddress, credentialsLength);
            const headers = this.getHeaders(headerHandlesAddress, headerHandleCount);
            const body = method === emscripten_ubq_FetchMethod.POST ? new Uint8Array(new Uint8Array(Module.HEAPU8.buffer, requestBodyAddress, requestBodyLength)) : void 0;
            const response = await this._fetch(process2.uri, {
              method: emscripten_ubq_FetchMethod[method],
              headers,
              body,
              mode: "cors",
              credentials,
              signal: process2.abortSignal
            });
            if (response.status >= 200 && response.status <= 209) {
              let contentLength = 0;
              if (response.headers.has("Content-Length")) {
                contentLength = +response.headers.get("Content-Length");
              }
              process2.totalBytes = contentLength;
              return process2.readChunks(response.body);
            } else {
              return process2.fail(response.statusText);
            }
          }
          getHeaders(address, count) {
            const headers = {};
            for (let i2 = 0; i2 < count; i2++) {
              const headerHandle = Module.getValue(address + i2 * 4, "i32");
              const header = this._headers.get(headerHandle);
              headers[header.key] = header.value;
            }
            return headers;
          }
          createHeader(keyAddress, keyLength, valueAddress, valueLength) {
            const key = Module.UTF8ToString(keyAddress, keyLength);
            const value = Module.UTF8ToString(valueAddress, valueLength);
            const handle = this._nextHeaderHandle++;
            this._headers.set(handle, { key, value });
            return handle;
          }
          deleteHeader(handle) {
            return this._headers.delete(handle);
          }
        }
        Module.emscripten_ubq_asyncFetchManager = new AsyncFetchManager();
        Module.emscripten_ubq_codec_videoDecoders = /* @__PURE__ */ new Map();
        Module.emscripten_ubq_codec_audioDecoders = /* @__PURE__ */ new Map();
        Module.emscripten_ubq_codec_videoEncoders = /* @__PURE__ */ new Map();
        Module.emscripten_ubq_codec_audioEncoders = /* @__PURE__ */ new Map();
        Module.emscripten_ubq_codec_videoDecoderNextHandle = 1;
        Module.emscripten_ubq_codec_audioDecoderNextHandle = 1;
        Module.emscripten_ubq_codec_videoEncoderNextHandle = 1;
        Module.emscripten_ubq_codec_audioEncoderNextHandle = 1;
        Module.emscripten_ubq_codec_createNativeResult = function(result) {
          const resultPtr = Module._malloc(8);
          const array2 = Module.HEAPU32.subarray(resultPtr / 4, resultPtr / 4 + 2);
          array2[0] = result.handle ? result.handle : result.code ? result.code : 0;
          if (result.error) {
            const encoder = new TextEncoder();
            const utf8String = encoder.encode(result.error);
            const stringPtr = Module._malloc(utf8String.length + 1);
            const string2 = Module.HEAPU8.subarray(stringPtr, stringPtr + utf8String.length + 1);
            for (let i2 = 0; i2 < utf8String.length; i2++) {
              string2[i2] = utf8String[i2];
            }
            string2[utf8String.length] = 0;
            array2[1] = stringPtr;
          } else {
            array2[1] = 0;
          }
          return resultPtr;
        };
        Module.emscripten_ubq_codec_createVideoDecoder = function(handle, codecServicePtr) {
          const videoDecoder = new VideoDecoder({
            output: (frame) => {
              const textures = videoDecoder.textures;
              let dropFrame = false;
              if (videoDecoder.shouldDropFrames) {
                dropFrame = true;
              } else if (videoDecoder.decodedFrames < videoDecoder.requestedFrame) {
                dropFrame = true;
              } else if (videoDecoder.decodeQueueSize >= textures.length) {
                dropFrame = true;
              }
              if (!dropFrame) {
                var gl = Module.ctx;
                const textureIndex = videoDecoder.decodedFrames % textures.length;
                const prevTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
                gl.bindTexture(gl.TEXTURE_2D, textures[textureIndex]);
                gl.texImage2D(
                  gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  frame
                );
                gl.bindTexture(gl.TEXTURE_2D, prevTexture);
              }
              frame.close();
              videoDecoder.decodedFrames++;
              Module.emscripten_ubq_codec_onOutputDecodedVideoFrame(
                handle,
                videoDecoder.decodedFrames,
                dropFrame,
                codecServicePtr
              );
            },
            error: (e) => {
              videoDecoder.unexpectedError = e;
              console.error(e);
            }
          });
          videoDecoder.decodedFrames = 0;
          videoDecoder.requestedFrame = 0;
          videoDecoder.shouldDropFrames = false;
          return videoDecoder;
        };
        Module.emscripten_ubq_codec_createAudioDecoder = function(leftBufferPtr, rightBufferPtr, bufferLength) {
          const audioDecoder = new AudioDecoder({
            output: (data) => {
              if (audioDecoder.flushing) {
                data.close();
                return;
              }
              const leftArray = Module.HEAPF32.subarray(
                leftBufferPtr / 4,
                leftBufferPtr / 4 + bufferLength
              );
              const rightArray = Module.HEAPF32.subarray(
                rightBufferPtr / 4,
                rightBufferPtr / 4 + bufferLength
              );
              const rightPlaneIndex = data.numberOfChannels === 1 ? 0 : 1;
              if (data.format === "f32-planar") {
                let writeCursor = audioDecoder.writtenFrames % bufferLength;
                if (writeCursor + data.numberOfFrames <= bufferLength) {
                  data.copyTo(leftArray.subarray(writeCursor), {
                    planeIndex: 0,
                    frameCount: data.numberOfFrames
                  });
                  data.copyTo(rightArray.subarray(writeCursor), {
                    planeIndex: rightPlaneIndex,
                    frameCount: data.numberOfFrames
                  });
                } else {
                  const length = bufferLength - writeCursor;
                  data.copyTo(leftArray.subarray(writeCursor), {
                    planeIndex: 0,
                    frameCount: length
                  });
                  data.copyTo(rightArray.subarray(writeCursor), {
                    planeIndex: rightPlaneIndex,
                    frameCount: length
                  });
                  data.copyTo(leftArray, { planeIndex: 0, frameOffset: length });
                  data.copyTo(rightArray, { planeIndex: rightPlaneIndex, frameOffset: length });
                }
                audioDecoder.writtenFrames += data.numberOfFrames;
              } else if (data.format === "s16-planar") {
                if (data.numberOfChannels === 1) {
                  const buffer = new Int16Array(data.numberOfFrames);
                  data.copyTo(buffer, { planeIndex: 0 });
                  for (let frameIndex = 0; frameIndex < data.numberOfFrames; frameIndex++) {
                    const sample = buffer[frameIndex] / 32768;
                    let writeCursor = audioDecoder.writtenFrames % bufferLength;
                    leftArray[writeCursor] = sample;
                    rightArray[writeCursor] = sample;
                    audioDecoder.writtenFrames++;
                  }
                } else {
                  const leftBuffer = new Int16Array(data.numberOfFrames);
                  const rightBuffer = new Int16Array(data.numberOfFrames);
                  data.copyTo(leftBuffer, { planeIndex: 0 });
                  data.copyTo(rightBuffer, { planeIndex: 1 });
                  for (let frameIndex = 0; frameIndex < data.numberOfFrames; frameIndex++) {
                    let writeCursor = audioDecoder.writtenFrames % bufferLength;
                    leftArray[writeCursor] = leftBuffer[frameIndex] / 32768;
                    rightArray[writeCursor] = rightBuffer[frameIndex] / 32768;
                    audioDecoder.writtenFrames++;
                  }
                }
              } else if (data.format === "s16") {
                const buffer = new Int16Array(data.numberOfFrames * data.numberOfChannels);
                data.copyTo(buffer, { planeIndex: 0 });
                if (data.numberOfChannels === 1) {
                  for (let frameIndex = 0; frameIndex < data.numberOfFrames; frameIndex++) {
                    const sample = buffer[frameIndex] / 32768;
                    let writeCursor = audioDecoder.writtenFrames % bufferLength;
                    leftArray[writeCursor] = sample;
                    rightArray[writeCursor] = sample;
                    audioDecoder.writtenFrames++;
                  }
                } else {
                  for (let frameIndex = 0; frameIndex < data.numberOfFrames; frameIndex++) {
                    let writeCursor = audioDecoder.writtenFrames % bufferLength;
                    leftArray[writeCursor] = buffer[frameIndex * data.numberOfChannels + 0] / 32768;
                    rightArray[writeCursor] = buffer[frameIndex * data.numberOfChannels + 1] / 32768;
                    audioDecoder.writtenFrames++;
                  }
                }
              } else {
                console.error("Unsupported audio format:", data.format);
              }
              data.close();
            },
            error: (e) => {
              audioDecoder.unexpectedError = e;
              console.error(e);
            }
          });
          audioDecoder.writtenFrames = 0;
          return audioDecoder;
        };
        Module.emscripten_ubq_settings_forceWebGL1 = false;
        if (!Module["preRun"]) throw "Module.preRun should exist because file support used it; did a pre-js delete it?";
        necessaryPreJSTasks.forEach(function(task) {
          if (Module["preRun"].indexOf(task) < 0) throw "All preRun tasks that exist before user pre-js code should remain after; did you replace Module or modify Module.preRun?";
        });
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module["ENVIRONMENT"]) {
          throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
        }
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          if (typeof process == "undefined" || !process.release || process.release.name !== "node") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          var nodeVersion = process.versions.node;
          var numericVersion = nodeVersion.split(".").slice(0, 3);
          numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
          var minVersion = 181500;
          if (numericVersion < 181500) {
            throw new Error("This emscripten-generated code requires node v18.15.15.0 (detected v" + nodeVersion + ")");
          }
          var fs = require_polyfill_noop();
          var nodePath = require_polyfill_noop();
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
          } else {
            scriptDirectory = __dirname + "/";
          }
          read_ = (filename, binary) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert3(ret.buffer);
            return ret;
          };
          readAsync = (filename, onload, onerror, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
              if (err2) onerror(err2);
              else onload(binary ? data.buffer : data);
            });
          };
          if (!Module["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
        } else if (ENVIRONMENT_IS_SHELL) {
          if (typeof process == "object" && typeof __require === "function" || typeof window == "object" || typeof importScripts == "function") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          if (typeof read != "undefined") {
            read_ = read;
          }
          readBinary = (f) => {
            if (typeof readbuffer == "function") {
              return new Uint8Array(readbuffer(f));
            }
            let data = read(f, "binary");
            assert3(typeof data == "object");
            return data;
          };
          readAsync = (f, onload, onerror) => {
            setTimeout(() => onload(readBinary(f)));
          };
          if (typeof clearTimeout == "undefined") {
            globalThis.clearTimeout = (id) => {
            };
          }
          if (typeof setTimeout == "undefined") {
            globalThis.setTimeout = (f) => typeof f == "function" ? f() : abort();
          }
          if (typeof scriptArgs != "undefined") {
            arguments_ = scriptArgs;
          } else if (typeof arguments != "undefined") {
            arguments_ = arguments;
          }
          if (typeof quit == "function") {
            quit_ = (status, toThrow) => {
              setTimeout(() => {
                if (!(toThrow instanceof ExitStatus)) {
                  let toLog = toThrow;
                  if (toThrow && typeof toThrow == "object" && toThrow.stack) {
                    toLog = [toThrow, toThrow.stack];
                  }
                  err(`exiting due to exception: ${toLog}`);
                }
                quit(status);
              });
              throw toThrow;
            };
          }
          if (typeof print != "undefined") {
            if (typeof console == "undefined") console = /** @type{!Console} */
            {};
            console.log = /** @type{!function(this:Console, ...*): undefined} */
            print;
            console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */
            typeof printErr != "undefined" ? printErr : print;
          }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          if (!(typeof window == "object" || typeof importScripts == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  xhr.response
                );
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
        } else {
          throw new Error("environment detection error");
        }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        checkIncomingModuleAPI();
        if (Module["arguments"]) arguments_ = Module["arguments"];
        legacyModuleProp("arguments", "arguments_");
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        legacyModuleProp("thisProgram", "thisProgram");
        if (Module["quit"]) quit_ = Module["quit"];
        legacyModuleProp("quit", "quit_");
        assert3(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert3(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
        assert3(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert3(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
        assert3(typeof Module["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
        assert3(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
        assert3(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
        assert3(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
        assert3(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
        legacyModuleProp("asm", "wasmExports");
        legacyModuleProp("read", "read_");
        legacyModuleProp("readAsync", "readAsync");
        legacyModuleProp("readBinary", "readBinary");
        legacyModuleProp("setWindowTitle", "setWindowTitle");
        var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";
        var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";
        var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";
        var FETCHFS = "FETCHFS is no longer included by default; build with -lfetchfs.js";
        var ICASEFS = "ICASEFS is no longer included by default; build with -licasefs.js";
        var JSFILEFS = "JSFILEFS is no longer included by default; build with -ljsfilefs.js";
        var OPFS = "OPFS is no longer included by default; build with -lopfs.js";
        var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";
        assert3(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        legacyModuleProp("wasmBinary", "wasmBinary");
        if (typeof WebAssembly != "object") {
          abort("no native wasm support detected");
        }
        function intArrayFromBase64(s) {
          if (typeof ENVIRONMENT_IS_NODE != "undefined" && ENVIRONMENT_IS_NODE) {
            var buf = Buffer.from(s, "base64");
            return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
          }
          var decoded = atob(s);
          var bytes = new Uint8Array(decoded.length);
          for (var i2 = 0; i2 < decoded.length; ++i2) {
            bytes[i2] = decoded.charCodeAt(i2);
          }
          return bytes;
        }
        function tryParseAsDataURI(filename) {
          if (!isDataURI(filename)) {
            return;
          }
          return intArrayFromBase64(filename.slice(dataURIPrefix.length));
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert3(condition, text) {
          if (!condition) {
            abort("Assertion failed" + (text ? ": " + text : ""));
          }
        }
        var HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module["HEAP8"] = HEAP8 = new Int8Array(b);
          Module["HEAP16"] = HEAP16 = new Int16Array(b);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module["HEAP32"] = HEAP32 = new Int32Array(b);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
          Module["HEAP64"] = HEAP64 = new BigInt64Array(b);
          Module["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
        }
        assert3(!Module["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
        assert3(
          typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0,
          "JS engine does not provide full typed array support"
        );
        var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
        legacyModuleProp("INITIAL_MEMORY", "INITIAL_MEMORY");
        assert3(INITIAL_MEMORY >= 65536, "INITIAL_MEMORY should be larger than STACK_SIZE, was " + INITIAL_MEMORY + "! (STACK_SIZE=65536)");
        if (Module["wasmMemory"]) {
          wasmMemory = Module["wasmMemory"];
        } else {
          wasmMemory = new WebAssembly.Memory({
            "initial": INITIAL_MEMORY / 65536,
            // In theory we should not need to emit the maximum if we want "unlimited"
            // or 4GB of memory, but VMs error on that atm, see
            // https://github.com/emscripten-core/emscripten/issues/14130
            // And in the pthreads case we definitely need to emit a maximum. So
            // always emit one.
            "maximum": 2147483648 / 65536
          });
        }
        updateMemoryViews();
        INITIAL_MEMORY = wasmMemory.buffer.byteLength;
        assert3(INITIAL_MEMORY % 65536 === 0);
        function writeStackCookie() {
          var max2 = _emscripten_stack_get_end();
          assert3((max2 & 3) == 0);
          if (max2 == 0) {
            max2 += 4;
          }
          HEAPU32[max2 >> 2] = 34821223;
          HEAPU32[max2 + 4 >> 2] = 2310721022;
          HEAPU32[0 >> 2] = 1668509029;
        }
        function checkStackCookie() {
          if (ABORT) return;
          var max2 = _emscripten_stack_get_end();
          if (max2 == 0) {
            max2 += 4;
          }
          var cookie1 = HEAPU32[max2 >> 2];
          var cookie2 = HEAPU32[max2 + 4 >> 2];
          if (cookie1 != 34821223 || cookie2 != 2310721022) {
            abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max2)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
          }
          if (HEAPU32[0 >> 2] != 1668509029) {
            abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
          }
        }
        (function() {
          var h16 = new Int16Array(1);
          var h8 = new Int8Array(h16.buffer);
          h16[0] = 25459;
          if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
        })();
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          assert3(!runtimeInitialized);
          runtimeInitialized = true;
          checkStackCookie();
          if (!Module["noFSInit"] && !FS.init.initialized)
            FS.init();
          FS.ignorePermissions = false;
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          checkStackCookie();
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          checkStackCookie();
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPreMain(cb) {
          __ATMAIN__.unshift(cb);
        }
        function addOnExit(cb) {
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        assert3(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert3(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert3(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert3(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        var runDependencyTracking = {};
        function getUniqueRunDependency(id) {
          var orig = id;
          while (1) {
            if (!runDependencyTracking[id]) return id;
            id = orig + Math.random();
          }
        }
        function addRunDependency(id) {
          runDependencies++;
          Module["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert3(!runDependencyTracking[id]);
            runDependencyTracking[id] = 1;
            if (runDependencyWatcher === null && typeof setInterval != "undefined") {
              runDependencyWatcher = setInterval(() => {
                if (ABORT) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null;
                  return;
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                  if (!shown) {
                    shown = true;
                    err("still waiting on run dependencies:");
                  }
                  err(`dependency: ${dep}`);
                }
                if (shown) {
                  err("(end of list)");
                }
              }, 1e4);
            }
          } else {
            err("warning: run dependency added without ID");
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert3(runDependencyTracking[id]);
            delete runDependencyTracking[id];
          } else {
            err("warning: run dependency removed without ID");
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          Module["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        function createExportWrapper(name) {
          return function() {
            assert3(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
            var f = wasmExports[name];
            assert3(f, `exported native function \`${name}\` not found`);
            return f.apply(null, arguments);
          };
        }
        var wasmBinaryFile;
        wasmBinaryFile = "cesdk.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function") {
              return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
                if (!response["ok"]) {
                  throw `failed to load wasm binary file at '${binaryFile}'`;
                }
                return response["arrayBuffer"]();
              }).catch(() => getBinarySync(binaryFile));
            }
          }
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => {
            return WebAssembly.instantiate(binary, imports);
          }).then((instance) => {
            return instance;
          }).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            if (isFileURI(wasmBinaryFile)) {
              err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
            }
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && // Avoid instantiateStreaming() on Node.js environment for now, as while
          // Node.js v18.1.0 implements it, it does not have a full fetch()
          // implementation yet.
          //
          // Reference:
          //   https://github.com/emscripten-core/emscripten/pull/16917
          !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
              var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(
                callback,
                function(reason) {
                  err(`wasm streaming compile failed: ${reason}`);
                  err("falling back to ArrayBuffer instantiation");
                  return instantiateArrayBuffer(binaryFile, imports, callback);
                }
              );
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function createWasm() {
          var info = {
            "env": wasmImports,
            "wasi_snapshot_preview1": wasmImports
          };
          function receiveInstance(instance, module2) {
            wasmExports = instance.exports;
            wasmTable = wasmExports["__indirect_function_table"];
            assert3(wasmTable, "table not found in wasm exports");
            addOnInit(wasmExports["__wasm_call_ctors"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          addRunDependency("wasm-instantiate");
          var trueModule = Module;
          function receiveInstantiationResult(result) {
            assert3(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
            trueModule = null;
            receiveInstance(result["instance"]);
          }
          if (Module["instantiateWasm"]) {
            try {
              return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        function legacyModuleProp(prop, newName, incomming = true) {
          if (!Object.getOwnPropertyDescriptor(Module, prop)) {
            Object.defineProperty(Module, prop, {
              configurable: true,
              get() {
                let extra = incomming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
                abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
              }
            });
          }
        }
        function ignoredModuleProp(prop) {
          if (Object.getOwnPropertyDescriptor(Module, prop)) {
            abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
          }
        }
        function isExportedByForceFilesystem(name) {
          return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || // The old FS has some functionality that WasmFS lacks.
          name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
        }
        function missingGlobal(sym, msg) {
          if (typeof globalThis !== "undefined") {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
                return void 0;
              }
            });
          }
        }
        missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
        missingGlobal("asm", "Please use wasmExports instead");
        function missingLibrarySymbol(sym) {
          if (typeof globalThis !== "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
                var librarySymbol = sym;
                if (!librarySymbol.startsWith("_")) {
                  librarySymbol = "$" + sym;
                }
                msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                warnOnce(msg);
                return void 0;
              }
            });
          }
          unexportedRuntimeSymbol(sym);
        }
        function unexportedRuntimeSymbol(sym) {
          if (!Object.getOwnPropertyDescriptor(Module, sym)) {
            Object.defineProperty(Module, sym, {
              configurable: true,
              get() {
                var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                abort(msg);
              }
            });
          }
        }
        function dbg(text) {
          console.warn.apply(console, arguments);
        }
        var ASM_CONSTS = {
          2581788: ($0, $1, $2, $3, $4) => {
            if (typeof window === "undefined" || (window.AudioContext || window.webkitAudioContext) === void 0) {
              return 0;
            }
            if (typeof window.miniaudio === "undefined") {
              window.miniaudio = { referenceCount: 0 };
              window.miniaudio.device_type = {};
              window.miniaudio.device_type.playback = $0;
              window.miniaudio.device_type.capture = $1;
              window.miniaudio.device_type.duplex = $2;
              window.miniaudio.device_state = {};
              window.miniaudio.device_state.stopped = $3;
              window.miniaudio.device_state.started = $4;
              miniaudio.devices = [];
              miniaudio.track_device = function(device) {
                for (var iDevice = 0; iDevice < miniaudio.devices.length; ++iDevice) {
                  if (miniaudio.devices[iDevice] == null) {
                    miniaudio.devices[iDevice] = device;
                    return iDevice;
                  }
                }
                miniaudio.devices.push(device);
                return miniaudio.devices.length - 1;
              };
              miniaudio.untrack_device_by_index = function(deviceIndex) {
                miniaudio.devices[deviceIndex] = null;
                while (miniaudio.devices.length > 0) {
                  if (miniaudio.devices[miniaudio.devices.length - 1] == null) {
                    miniaudio.devices.pop();
                  } else {
                    break;
                  }
                }
              };
              miniaudio.untrack_device = function(device) {
                for (var iDevice = 0; iDevice < miniaudio.devices.length; ++iDevice) {
                  if (miniaudio.devices[iDevice] == device) {
                    return miniaudio.untrack_device_by_index(iDevice);
                  }
                }
              };
              miniaudio.get_device_by_index = function(deviceIndex) {
                return miniaudio.devices[deviceIndex];
              };
              miniaudio.unlock_event_types = /* @__PURE__ */ function() {
                return ["touchstart", "touchend", "click"];
              }();
              miniaudio.unlock = function() {
                for (var i2 = 0; i2 < miniaudio.devices.length; ++i2) {
                  var device = miniaudio.devices[i2];
                  if (device != null && device.webaudio != null && device.state === 2) {
                    device.webaudio.resume();
                  }
                }
                miniaudio.unlock_event_types.map(function(event_type) {
                  document.removeEventListener(event_type, miniaudio.unlock, true);
                });
              };
              miniaudio.unlock_event_types.map(function(event_type) {
                document.addEventListener(event_type, miniaudio.unlock, true);
              });
            }
            window.miniaudio.referenceCount += 1;
            return 1;
          },
          2583778: () => {
            if (typeof window.miniaudio !== "undefined") {
              window.miniaudio.referenceCount -= 1;
              if (window.miniaudio.referenceCount === 0) {
                delete window.miniaudio;
              }
            }
          },
          2583942: () => {
            return navigator.mediaDevices !== void 0 && navigator.mediaDevices.getUserMedia !== void 0;
          },
          2584046: () => {
            try {
              var temp = new (window.AudioContext || window.webkitAudioContext)();
              var sampleRate = temp.sampleRate;
              temp.close();
              return sampleRate;
            } catch (e) {
              return 0;
            }
          },
          2584217: ($0, $1, $2, $3, $4, $5) => {
            var deviceType = $0;
            var channels = $1;
            var sampleRate = $2;
            var bufferSize = $3;
            var pIntermediaryBuffer = $4;
            var pDevice = $5;
            if (typeof window.miniaudio === "undefined") {
              return -1;
            }
            var device = {};
            var audioContextOptions = {};
            if (deviceType == window.miniaudio.device_type.playback) {
              audioContextOptions.sampleRate = sampleRate;
            }
            device.webaudio = new (window.AudioContext || window.webkitAudioContext)(audioContextOptions);
            device.webaudio.suspend();
            device.state = window.miniaudio.device_state.stopped;
            var channelCountIn = 0;
            var channelCountOut = channels;
            if (deviceType != window.miniaudio.device_type.playback) {
              channelCountIn = channels;
            }
            device.scriptNode = device.webaudio.createScriptProcessor(bufferSize, channelCountIn, channelCountOut);
            device.scriptNode.onaudioprocess = function(e) {
              if (device.intermediaryBufferView == null || device.intermediaryBufferView.length == 0) {
                device.intermediaryBufferView = new Float32Array(Module.HEAPF32.buffer, pIntermediaryBuffer, bufferSize * channels);
              }
              if (deviceType == miniaudio.device_type.capture || deviceType == miniaudio.device_type.duplex) {
                for (var iChannel = 0; iChannel < channels; iChannel += 1) {
                  var inputBuffer = e.inputBuffer.getChannelData(iChannel);
                  var intermediaryBuffer = device.intermediaryBufferView;
                  for (var iFrame = 0; iFrame < bufferSize; iFrame += 1) {
                    intermediaryBuffer[iFrame * channels + iChannel] = inputBuffer[iFrame];
                  }
                }
                _ma_device_process_pcm_frames_capture__webaudio(pDevice, bufferSize, pIntermediaryBuffer);
              }
              if (deviceType == miniaudio.device_type.playback || deviceType == miniaudio.device_type.duplex) {
                _ma_device_process_pcm_frames_playback__webaudio(pDevice, bufferSize, pIntermediaryBuffer);
                for (var iChannel = 0; iChannel < e.outputBuffer.numberOfChannels; ++iChannel) {
                  var outputBuffer = e.outputBuffer.getChannelData(iChannel);
                  var intermediaryBuffer = device.intermediaryBufferView;
                  for (var iFrame = 0; iFrame < bufferSize; iFrame += 1) {
                    outputBuffer[iFrame] = intermediaryBuffer[iFrame * channels + iChannel];
                  }
                }
              } else {
                for (var iChannel = 0; iChannel < e.outputBuffer.numberOfChannels; ++iChannel) {
                  e.outputBuffer.getChannelData(iChannel).fill(0);
                }
              }
            };
            if (deviceType == miniaudio.device_type.capture || deviceType == miniaudio.device_type.duplex) {
              navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream) {
                device.streamNode = device.webaudio.createMediaStreamSource(stream);
                device.streamNode.connect(device.scriptNode);
                device.scriptNode.connect(device.webaudio.destination);
              }).catch(function(error) {
                console.log("Failed to get user media: " + error);
              });
            }
            if (deviceType == miniaudio.device_type.playback) {
              device.scriptNode.connect(device.webaudio.destination);
            }
            return miniaudio.track_device(device);
          },
          2587e3: ($0) => {
            return miniaudio.get_device_by_index($0).webaudio.sampleRate;
          },
          2587066: ($0) => {
            var device = miniaudio.get_device_by_index($0);
            if (device.scriptNode !== void 0) {
              device.scriptNode.onaudioprocess = function(e) {
              };
              device.scriptNode.disconnect();
              device.scriptNode = void 0;
            }
            if (device.streamNode !== void 0) {
              device.streamNode.disconnect();
              device.streamNode = void 0;
            }
            device.webaudio.close();
            device.webaudio = void 0;
          },
          2587431: ($0) => {
            miniaudio.untrack_device_by_index($0);
          },
          2587474: ($0) => {
            var device = miniaudio.get_device_by_index($0);
            device.webaudio.resume();
            device.state = miniaudio.device_state.started;
          },
          2587599: ($0) => {
            var device = miniaudio.get_device_by_index($0);
            device.webaudio.suspend();
            device.state = miniaudio.device_state.stopped;
          },
          2587725: () => {
            return !!globalThis.ubq_browserTabHidden;
          },
          2587771: () => {
            return HEAP8.length;
          }
        };
        function isLocalTrackingEnabled() {
          return typeof window !== "undefined" && window.localTracking === true;
        }
        function getTrackingOverrideEndpoint() {
          if (typeof window !== "undefined" && window.trackingEndpoint) {
            return stringToNewUTF8(window.trackingEndpoint);
          }
          return null;
        }
        function jsUpdateTexture(texID, bufferHandle) {
          const buffer = Emval.toValue(bufferHandle);
          const gl = Module.ctx;
          gl.bindTexture(gl.TEXTURE_2D, GL.textures[texID]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        }
        function getWindowHostname() {
          return typeof window !== "undefined" ? stringToNewUTF8(window.location.hostname) : stringToNewUTF8("");
        }
        function setItem(key, value) {
          var keyStr = UTF8ToString(key);
          var valueStr = UTF8ToString(value);
          localStorage.setItem(keyStr, valueStr);
        }
        function getItem(key) {
          var keyStr = UTF8ToString(key);
          var valueStr = localStorage.getItem(keyStr);
          if (valueStr == null) {
            return null;
          }
          return stringToNewUTF8(valueStr);
        }
        function isLocalStorageDefined() {
          return typeof localStorage !== "undefined";
        }
        function clearItem(key) {
          var keyStr = UTF8ToString(key);
          localStorage.removeItem(keyStr);
        }
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module);
          }
        };
        function getValue(ptr, type2 = "i8") {
          if (type2.endsWith("*")) type2 = "*";
          switch (type2) {
            case "i1":
              return HEAP8[ptr >> 0];
            case "i8":
              return HEAP8[ptr >> 0];
            case "i16":
              return HEAP16[ptr >> 1];
            case "i32":
              return HEAP32[ptr >> 2];
            case "i64":
              return HEAP64[ptr >> 3];
            case "float":
              return HEAPF32[ptr >> 2];
            case "double":
              return HEAPF64[ptr >> 3];
            case "*":
              return HEAPU32[ptr >> 2];
            default:
              abort(`invalid type for getValue: ${type2}`);
          }
        }
        var noExitRuntime = Module["noExitRuntime"] || true;
        var ptrToString = (ptr) => {
          assert3(typeof ptr === "number");
          ptr >>>= 0;
          return "0x" + ptr.toString(16).padStart(8, "0");
        };
        function setValue(ptr, value, type2 = "i8") {
          if (type2.endsWith("*")) type2 = "*";
          switch (type2) {
            case "i1":
              HEAP8[ptr >> 0] = value;
              break;
            case "i8":
              HEAP8[ptr >> 0] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              HEAP64[ptr >> 3] = BigInt(value);
              break;
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            case "*":
              HEAPU32[ptr >> 2] = value;
              break;
            default:
              abort(`invalid type for setValue: ${type2}`);
          }
        }
        var warnOnce = (text) => {
          warnOnce.shown ||= {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
            err(text);
          }
        };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
        var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var UTF8ToString = (ptr, maxBytesToRead) => {
          assert3(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        };
        var ___assert_fail = (condition, filename, line, func) => {
          abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
        };
        var exceptionCaught = [];
        var uncaughtExceptionCount = 0;
        var ___cxa_begin_catch = (ptr) => {
          var info = new ExceptionInfo(ptr);
          if (!info.get_caught()) {
            info.set_caught(true);
            uncaughtExceptionCount--;
          }
          info.set_rethrown(false);
          exceptionCaught.push(info);
          ___cxa_increment_exception_refcount(info.excPtr);
          return info.get_exception_ptr();
        };
        var exceptionLast = 0;
        var ___cxa_end_catch = () => {
          _setThrew(0, 0);
          assert3(exceptionCaught.length > 0);
          var info = exceptionCaught.pop();
          ___cxa_decrement_exception_refcount(info.excPtr);
          exceptionLast = 0;
        };
        class ExceptionInfo {
          // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
          constructor(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 24;
          }
          set_type(type2) {
            HEAPU32[this.ptr + 4 >> 2] = type2;
          }
          get_type() {
            return HEAPU32[this.ptr + 4 >> 2];
          }
          set_destructor(destructor) {
            HEAPU32[this.ptr + 8 >> 2] = destructor;
          }
          get_destructor() {
            return HEAPU32[this.ptr + 8 >> 2];
          }
          set_caught(caught) {
            caught = caught ? 1 : 0;
            HEAP8[this.ptr + 12 >> 0] = caught;
          }
          get_caught() {
            return HEAP8[this.ptr + 12 >> 0] != 0;
          }
          set_rethrown(rethrown) {
            rethrown = rethrown ? 1 : 0;
            HEAP8[this.ptr + 13 >> 0] = rethrown;
          }
          get_rethrown() {
            return HEAP8[this.ptr + 13 >> 0] != 0;
          }
          // Initialize native structure fields. Should be called once after allocated.
          init(type2, destructor) {
            this.set_adjusted_ptr(0);
            this.set_type(type2);
            this.set_destructor(destructor);
          }
          set_adjusted_ptr(adjustedPtr) {
            HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
          }
          get_adjusted_ptr() {
            return HEAPU32[this.ptr + 16 >> 2];
          }
          // Get pointer which is expected to be received by catch clause in C++ code. It may be adjusted
          // when the pointer is casted to some of the exception object base classes (e.g. when virtual
          // inheritance is used). When a pointer is thrown this method should return the thrown pointer
          // itself.
          get_exception_ptr() {
            var isPointer = ___cxa_is_pointer_type(this.get_type());
            if (isPointer) {
              return HEAPU32[this.excPtr >> 2];
            }
            var adjusted = this.get_adjusted_ptr();
            if (adjusted !== 0) return adjusted;
            return this.excPtr;
          }
        }
        var ___resumeException = (ptr) => {
          if (!exceptionLast) {
            exceptionLast = ptr;
          }
          assert3(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
        };
        var findMatchingCatch = (args) => {
          var thrown = exceptionLast;
          if (!thrown) {
            setTempRet0(0);
            return 0;
          }
          var info = new ExceptionInfo(thrown);
          info.set_adjusted_ptr(thrown);
          var thrownType = info.get_type();
          if (!thrownType) {
            setTempRet0(0);
            return thrown;
          }
          for (var arg in args) {
            var caughtType = args[arg];
            if (caughtType === 0 || caughtType === thrownType) {
              break;
            }
            var adjusted_ptr_addr = info.ptr + 16;
            if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
              setTempRet0(caughtType);
              return thrown;
            }
          }
          setTempRet0(thrownType);
          return thrown;
        };
        var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);
        var ___cxa_find_matching_catch_3 = (arg0) => findMatchingCatch([arg0]);
        var ___cxa_throw = (ptr, type2, destructor) => {
          var info = new ExceptionInfo(ptr);
          info.init(type2, destructor);
          exceptionLast = ptr;
          uncaughtExceptionCount++;
          assert3(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
        };
        var PATH = {
          isAbs: (path) => path.charAt(0) === "/",
          splitPath: (filename) => {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: (parts, allowAboveRoot) => {
            var up = 0;
            for (var i2 = parts.length - 1; i2 >= 0; i2--) {
              var last = parts[i2];
              if (last === ".") {
                parts.splice(i2, 1);
              } else if (last === "..") {
                parts.splice(i2, 1);
                up++;
              } else if (up) {
                parts.splice(i2, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift("..");
              }
            }
            return parts;
          },
          normalize: (path) => {
            var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }
            return (isAbsolute ? "/" : "") + path;
          },
          dirname: (path) => {
            var result = PATH.splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
              return ".";
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: (path) => {
            if (path === "/") return "/";
            path = PATH.normalize(path);
            path = path.replace(/\/$/, "");
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1) return path;
            return path.substr(lastSlash + 1);
          },
          join: function() {
            var paths = Array.prototype.slice.call(arguments);
            return PATH.normalize(paths.join("/"));
          },
          join2: (l, r) => PATH.normalize(l + "/" + r)
        };
        var initRandomFill = () => {
          if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return (view) => crypto.getRandomValues(view);
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = require_polyfill_noop();
              var randomFillSync = crypto_module["randomFillSync"];
              if (randomFillSync) {
                return (view) => crypto_module["randomFillSync"](view);
              }
              var randomBytes = crypto_module["randomBytes"];
              return (view) => (view.set(randomBytes(view.byteLength)), // Return the original view to match modern native implementations.
              view);
            } catch (e) {
            }
          }
          abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
        };
        var randomFill = (view) => {
          return (randomFill = initRandomFill())(view);
        };
        var PATH_FS = {
          resolve: function() {
            var resolvedPath = "", resolvedAbsolute = false;
            for (var i2 = arguments.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
              var path = i2 >= 0 ? arguments[i2] : FS.cwd();
              if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings");
              } else if (!path) {
                return "";
              }
              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = PATH.isAbs(path);
            }
            resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          },
          relative: (from, to) => {
            from = PATH_FS.resolve(from).substr(1);
            to = PATH_FS.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "") break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "") break;
              }
              if (start > end) return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i2 = 0; i2 < length; i2++) {
              if (fromParts[i2] !== toParts[i2]) {
                samePartsLength = i2;
                break;
              }
            }
            var outputParts = [];
            for (var i2 = samePartsLength; i2 < fromParts.length; i2++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          }
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i2 = 0; i2 < str.length; ++i2) {
            var c = str.charCodeAt(i2);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i2;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          assert3(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i2 = 0; i2 < str.length; ++i2) {
            var u = str.charCodeAt(i2);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i2);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx) break;
              if (u > 1114111) warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        };
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        }
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
              var fd = process.stdin.fd;
              try {
                bytesRead = fs.readSync(fd, buf);
              } catch (e) {
                if (e.toString().includes("EOF")) bytesRead = 0;
                else throw e;
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = {
          ttys: [],
          init() {
          },
          shutdown() {
          },
          register(dev, ops) {
            TTY.ttys[dev] = { input: [], output: [], ops };
            FS.registerDevice(dev, TTY.stream_ops);
          },
          stream_ops: {
            open(stream) {
              var tty = TTY.ttys[stream.node.rdev];
              if (!tty) {
                throw new FS.ErrnoError(43);
              }
              stream.tty = tty;
              stream.seekable = false;
            },
            close(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            fsync(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            read(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
              }
              var bytesRead = 0;
              for (var i2 = 0; i2 < length; i2++) {
                var result;
                try {
                  result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === void 0 && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === void 0) break;
                bytesRead++;
                buffer[offset + i2] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
              }
              try {
                for (var i2 = 0; i2 < length; i2++) {
                  stream.tty.ops.put_char(stream.tty, buffer[offset + i2]);
                }
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i2;
            }
          },
          default_tty_ops: {
            get_char(tty) {
              return FS_stdin_getChar();
            },
            put_char(tty, val) {
              if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0) tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            },
            ioctl_tcgets(tty) {
              return {
                c_iflag: 25856,
                c_oflag: 5,
                c_cflag: 191,
                c_lflag: 35387,
                c_cc: [
                  3,
                  28,
                  127,
                  21,
                  4,
                  0,
                  1,
                  0,
                  17,
                  19,
                  26,
                  0,
                  18,
                  15,
                  23,
                  22,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              };
            },
            ioctl_tcsets(tty, optional_actions, data) {
              return 0;
            },
            ioctl_tiocgwinsz(tty) {
              return [24, 80];
            }
          },
          default_tty1_ops: {
            put_char(tty, val) {
              if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0) tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            }
          }
        };
        var zeroMemory = (address, size) => {
          HEAPU8.fill(0, address, address + size);
          return address;
        };
        var alignMemory = (size, alignment) => {
          assert3(alignment, "alignment argument is required");
          return Math.ceil(size / alignment) * alignment;
        };
        var mmapAlloc = (size) => {
          size = alignMemory(size, 65536);
          var ptr = _emscripten_builtin_memalign(65536, size);
          if (!ptr) return 0;
          return zeroMemory(ptr, size);
        };
        var MEMFS = {
          ops_table: null,
          mount(mount) {
            return MEMFS.createNode(null, "/", 16384 | 511, 0);
          },
          createNode(parent, name, mode, dev) {
            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
              throw new FS.ErrnoError(63);
            }
            MEMFS.ops_table ||= {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            };
            var node = FS.createNode(parent, name, mode, dev);
            if (FS.isDir(node.mode)) {
              node.node_ops = MEMFS.ops_table.dir.node;
              node.stream_ops = MEMFS.ops_table.dir.stream;
              node.contents = {};
            } else if (FS.isFile(node.mode)) {
              node.node_ops = MEMFS.ops_table.file.node;
              node.stream_ops = MEMFS.ops_table.file.stream;
              node.usedBytes = 0;
              node.contents = null;
            } else if (FS.isLink(node.mode)) {
              node.node_ops = MEMFS.ops_table.link.node;
              node.stream_ops = MEMFS.ops_table.link.stream;
            } else if (FS.isChrdev(node.mode)) {
              node.node_ops = MEMFS.ops_table.chrdev.node;
              node.stream_ops = MEMFS.ops_table.chrdev.stream;
            }
            node.timestamp = Date.now();
            if (parent) {
              parent.contents[name] = node;
              parent.timestamp = node.timestamp;
            }
            return node;
          },
          getFileDataAsTypedArray(node) {
            if (!node.contents) return new Uint8Array(0);
            if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
            return new Uint8Array(node.contents);
          },
          expandFileStorage(node, newCapacity) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity) return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
            if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          },
          resizeFileStorage(node, newSize) {
            if (node.usedBytes == newSize) return;
            if (newSize == 0) {
              node.contents = null;
              node.usedBytes = 0;
            } else {
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
              }
              node.usedBytes = newSize;
            }
          },
          node_ops: {
            getattr(node) {
              var attr = {};
              attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
              attr.ino = node.id;
              attr.mode = node.mode;
              attr.nlink = 1;
              attr.uid = 0;
              attr.gid = 0;
              attr.rdev = node.rdev;
              if (FS.isDir(node.mode)) {
                attr.size = 4096;
              } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
              } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
              } else {
                attr.size = 0;
              }
              attr.atime = new Date(node.timestamp);
              attr.mtime = new Date(node.timestamp);
              attr.ctime = new Date(node.timestamp);
              attr.blksize = 4096;
              attr.blocks = Math.ceil(attr.size / attr.blksize);
              return attr;
            },
            setattr(node, attr) {
              if (attr.mode !== void 0) {
                node.mode = attr.mode;
              }
              if (attr.timestamp !== void 0) {
                node.timestamp = attr.timestamp;
              }
              if (attr.size !== void 0) {
                MEMFS.resizeFileStorage(node, attr.size);
              }
            },
            lookup(parent, name) {
              throw FS.genericErrors[44];
            },
            mknod(parent, name, mode, dev) {
              return MEMFS.createNode(parent, name, mode, dev);
            },
            rename(old_node, new_dir, new_name) {
              if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                }
                if (new_node) {
                  for (var i2 in new_node.contents) {
                    throw new FS.ErrnoError(55);
                  }
                }
              }
              delete old_node.parent.contents[old_node.name];
              old_node.parent.timestamp = Date.now();
              old_node.name = new_name;
              new_dir.contents[new_name] = old_node;
              new_dir.timestamp = old_node.parent.timestamp;
              old_node.parent = new_dir;
            },
            unlink(parent, name) {
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            rmdir(parent, name) {
              var node = FS.lookupNode(parent, name);
              for (var i2 in node.contents) {
                throw new FS.ErrnoError(55);
              }
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            readdir(node) {
              var entries = [".", ".."];
              for (var key of Object.keys(node.contents)) {
                entries.push(key);
              }
              return entries;
            },
            symlink(parent, newname, oldpath) {
              var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
              node.link = oldpath;
              return node;
            },
            readlink(node) {
              if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              return node.link;
            }
          },
          stream_ops: {
            read(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= stream.node.usedBytes) return 0;
              var size = Math.min(stream.node.usedBytes - position, length);
              assert3(size >= 0);
              if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset);
              } else {
                for (var i2 = 0; i2 < size; i2++) buffer[offset + i2] = contents[position + i2];
              }
              return size;
            },
            write(stream, buffer, offset, length, position, canOwn) {
              assert3(!(buffer instanceof ArrayBuffer));
              if (buffer.buffer === HEAP8.buffer) {
                canOwn = false;
              }
              if (!length) return 0;
              var node = stream.node;
              node.timestamp = Date.now();
              if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                  assert3(position === 0, "canOwn must imply no weird position inside the file");
                  node.contents = buffer.subarray(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (node.usedBytes === 0 && position === 0) {
                  node.contents = buffer.slice(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (position + length <= node.usedBytes) {
                  node.contents.set(buffer.subarray(offset, offset + length), position);
                  return length;
                }
              }
              MEMFS.expandFileStorage(node, position + length);
              if (node.contents.subarray && buffer.subarray) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
              } else {
                for (var i2 = 0; i2 < length; i2++) {
                  node.contents[position + i2] = buffer[offset + i2];
                }
              }
              node.usedBytes = Math.max(node.usedBytes, position + length);
              return length;
            },
            llseek(stream, offset, whence) {
              var position = offset;
              if (whence === 1) {
                position += stream.position;
              } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                  position += stream.node.usedBytes;
                }
              }
              if (position < 0) {
                throw new FS.ErrnoError(28);
              }
              return position;
            },
            allocate(stream, offset, length) {
              MEMFS.expandFileStorage(stream.node, offset + length);
              stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
            },
            mmap(stream, length, position, prot, flags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              var ptr;
              var allocated;
              var contents = stream.node.contents;
              if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                allocated = false;
                ptr = contents.byteOffset;
              } else {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(contents, position, position + length);
                  }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                HEAP8.set(contents, ptr);
              }
              return { ptr, allocated };
            },
            msync(stream, buffer, offset, length, mmapFlags) {
              MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
              return 0;
            }
          }
        };
        var asyncLoad = (url, onload, onerror, noRunDep) => {
          var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
          readAsync(url, (arrayBuffer) => {
            assert3(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep);
          }, (event) => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          });
          if (dep) addRunDependency(dep);
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
          FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        };
        var preloadPlugins = Module["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
          if (typeof Browser != "undefined") Browser.init();
          var handled = false;
          preloadPlugins.forEach((plugin) => {
            if (handled) return;
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, onerror);
              handled = true;
            }
          });
          return handled;
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency(`cp ${fullname}`);
          function processData(byteArray) {
            function finish(byteArray2) {
              preFinish?.();
              if (!dontCreateFile) {
                FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
              }
              onload?.();
              removeRunDependency(dep);
            }
            if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
              onerror?.();
              removeRunDependency(dep);
            })) {
              return;
            }
            finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == "string") {
            asyncLoad(url, processData, onerror);
          } else {
            processData(url);
          }
        };
        var FS_modeStringToFlags = (str) => {
          var flagModes = {
            "r": 0,
            "r+": 2,
            "w": 512 | 64 | 1,
            "w+": 512 | 64 | 2,
            "a": 1024 | 64 | 1,
            "a+": 1024 | 64 | 2
          };
          var flags = flagModes[str];
          if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
          }
          return flags;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        };
        var ERRNO_MESSAGES = {
          0: "Success",
          1: "Arg list too long",
          2: "Permission denied",
          3: "Address already in use",
          4: "Address not available",
          5: "Address family not supported by protocol family",
          6: "No more processes",
          7: "Socket already connected",
          8: "Bad file number",
          9: "Trying to read unreadable message",
          10: "Mount device busy",
          11: "Operation canceled",
          12: "No children",
          13: "Connection aborted",
          14: "Connection refused",
          15: "Connection reset by peer",
          16: "File locking deadlock error",
          17: "Destination address required",
          18: "Math arg out of domain of func",
          19: "Quota exceeded",
          20: "File exists",
          21: "Bad address",
          22: "File too large",
          23: "Host is unreachable",
          24: "Identifier removed",
          25: "Illegal byte sequence",
          26: "Connection already in progress",
          27: "Interrupted system call",
          28: "Invalid argument",
          29: "I/O error",
          30: "Socket is already connected",
          31: "Is a directory",
          32: "Too many symbolic links",
          33: "Too many open files",
          34: "Too many links",
          35: "Message too long",
          36: "Multihop attempted",
          37: "File or path name too long",
          38: "Network interface is not configured",
          39: "Connection reset by network",
          40: "Network is unreachable",
          41: "Too many open files in system",
          42: "No buffer space available",
          43: "No such device",
          44: "No such file or directory",
          45: "Exec format error",
          46: "No record locks available",
          47: "The link has been severed",
          48: "Not enough core",
          49: "No message of desired type",
          50: "Protocol not available",
          51: "No space left on device",
          52: "Function not implemented",
          53: "Socket is not connected",
          54: "Not a directory",
          55: "Directory not empty",
          56: "State not recoverable",
          57: "Socket operation on non-socket",
          59: "Not a typewriter",
          60: "No such device or address",
          61: "Value too large for defined data type",
          62: "Previous owner died",
          63: "Not super-user",
          64: "Broken pipe",
          65: "Protocol error",
          66: "Unknown protocol",
          67: "Protocol wrong type for socket",
          68: "Math result not representable",
          69: "Read only file system",
          70: "Illegal seek",
          71: "No such process",
          72: "Stale file handle",
          73: "Connection timed out",
          74: "Text file busy",
          75: "Cross-device link",
          100: "Device not a stream",
          101: "Bad font file fmt",
          102: "Invalid slot",
          103: "Invalid request code",
          104: "No anode",
          105: "Block device required",
          106: "Channel number out of range",
          107: "Level 3 halted",
          108: "Level 3 reset",
          109: "Link number out of range",
          110: "Protocol driver not attached",
          111: "No CSI structure available",
          112: "Level 2 halted",
          113: "Invalid exchange",
          114: "Invalid request descriptor",
          115: "Exchange full",
          116: "No data (for no delay io)",
          117: "Timer expired",
          118: "Out of streams resources",
          119: "Machine is not on the network",
          120: "Package not installed",
          121: "The object is remote",
          122: "Advertise error",
          123: "Srmount error",
          124: "Communication error on send",
          125: "Cross mount point (not really error)",
          126: "Given log. name not unique",
          127: "f.d. invalid for this operation",
          128: "Remote address changed",
          129: "Can   access a needed shared lib",
          130: "Accessing a corrupted shared lib",
          131: ".lib section in a.out corrupted",
          132: "Attempting to link in too many libs",
          133: "Attempting to exec a shared library",
          135: "Streams pipe error",
          136: "Too many users",
          137: "Socket type not supported",
          138: "Not supported",
          139: "Protocol family not supported",
          140: "Can't send after socket shutdown",
          141: "Too many references",
          142: "Host is down",
          148: "No medium (in tape drive)",
          156: "Level 2 not synchronized"
        };
        var ERRNO_CODES = {
          "EPERM": 63,
          "ENOENT": 44,
          "ESRCH": 71,
          "EINTR": 27,
          "EIO": 29,
          "ENXIO": 60,
          "E2BIG": 1,
          "ENOEXEC": 45,
          "EBADF": 8,
          "ECHILD": 12,
          "EAGAIN": 6,
          "EWOULDBLOCK": 6,
          "ENOMEM": 48,
          "EACCES": 2,
          "EFAULT": 21,
          "ENOTBLK": 105,
          "EBUSY": 10,
          "EEXIST": 20,
          "EXDEV": 75,
          "ENODEV": 43,
          "ENOTDIR": 54,
          "EISDIR": 31,
          "EINVAL": 28,
          "ENFILE": 41,
          "EMFILE": 33,
          "ENOTTY": 59,
          "ETXTBSY": 74,
          "EFBIG": 22,
          "ENOSPC": 51,
          "ESPIPE": 70,
          "EROFS": 69,
          "EMLINK": 34,
          "EPIPE": 64,
          "EDOM": 18,
          "ERANGE": 68,
          "ENOMSG": 49,
          "EIDRM": 24,
          "ECHRNG": 106,
          "EL2NSYNC": 156,
          "EL3HLT": 107,
          "EL3RST": 108,
          "ELNRNG": 109,
          "EUNATCH": 110,
          "ENOCSI": 111,
          "EL2HLT": 112,
          "EDEADLK": 16,
          "ENOLCK": 46,
          "EBADE": 113,
          "EBADR": 114,
          "EXFULL": 115,
          "ENOANO": 104,
          "EBADRQC": 103,
          "EBADSLT": 102,
          "EDEADLOCK": 16,
          "EBFONT": 101,
          "ENOSTR": 100,
          "ENODATA": 116,
          "ETIME": 117,
          "ENOSR": 118,
          "ENONET": 119,
          "ENOPKG": 120,
          "EREMOTE": 121,
          "ENOLINK": 47,
          "EADV": 122,
          "ESRMNT": 123,
          "ECOMM": 124,
          "EPROTO": 65,
          "EMULTIHOP": 36,
          "EDOTDOT": 125,
          "EBADMSG": 9,
          "ENOTUNIQ": 126,
          "EBADFD": 127,
          "EREMCHG": 128,
          "ELIBACC": 129,
          "ELIBBAD": 130,
          "ELIBSCN": 131,
          "ELIBMAX": 132,
          "ELIBEXEC": 133,
          "ENOSYS": 52,
          "ENOTEMPTY": 55,
          "ENAMETOOLONG": 37,
          "ELOOP": 32,
          "EOPNOTSUPP": 138,
          "EPFNOSUPPORT": 139,
          "ECONNRESET": 15,
          "ENOBUFS": 42,
          "EAFNOSUPPORT": 5,
          "EPROTOTYPE": 67,
          "ENOTSOCK": 57,
          "ENOPROTOOPT": 50,
          "ESHUTDOWN": 140,
          "ECONNREFUSED": 14,
          "EADDRINUSE": 3,
          "ECONNABORTED": 13,
          "ENETUNREACH": 40,
          "ENETDOWN": 38,
          "ETIMEDOUT": 73,
          "EHOSTDOWN": 142,
          "EHOSTUNREACH": 23,
          "EINPROGRESS": 26,
          "EALREADY": 7,
          "EDESTADDRREQ": 17,
          "EMSGSIZE": 35,
          "EPROTONOSUPPORT": 66,
          "ESOCKTNOSUPPORT": 137,
          "EADDRNOTAVAIL": 4,
          "ENETRESET": 39,
          "EISCONN": 30,
          "ENOTCONN": 53,
          "ETOOMANYREFS": 141,
          "EUSERS": 136,
          "EDQUOT": 19,
          "ESTALE": 72,
          "ENOTSUP": 138,
          "ENOMEDIUM": 148,
          "EILSEQ": 25,
          "EOVERFLOW": 61,
          "ECANCELED": 11,
          "ENOTRECOVERABLE": 56,
          "EOWNERDEAD": 62,
          "ESTRPIPE": 135
        };
        var FS = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: "/",
          initialized: false,
          ignorePermissions: true,
          ErrnoError: class extends Error {
            // We set the `name` property to be able to identify `FS.ErrnoError`
            // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
            // - when using PROXYFS, an error can come from an underlying FS
            // as different FS objects have their own FS.ErrnoError each,
            // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
            // we'll use the reliable test `err.name == "ErrnoError"` instead
            constructor(errno) {
              super(ERRNO_MESSAGES[errno]);
              this.name = "ErrnoError";
              this.errno = errno;
              for (var key in ERRNO_CODES) {
                if (ERRNO_CODES[key] === errno) {
                  this.code = key;
                  break;
                }
              }
            }
          },
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          lookupPath(path, opts = {}) {
            path = PATH_FS.resolve(path);
            if (!path) return { path: "", node: null };
            var defaults = {
              follow_mount: true,
              recurse_count: 0
            };
            opts = Object.assign(defaults, opts);
            if (opts.recurse_count > 8) {
              throw new FS.ErrnoError(32);
            }
            var parts = path.split("/").filter((p) => !!p);
            var current = FS.root;
            var current_path = "/";
            for (var i2 = 0; i2 < parts.length; i2++) {
              var islast = i2 === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              current = FS.lookupNode(current, parts[i2]);
              current_path = PATH.join2(current_path, parts[i2]);
              if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                  current = current.mounted.root;
                }
              }
              if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                  var link = FS.readlink(current_path);
                  current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                  var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                  current = lookup.node;
                  if (count++ > 40) {
                    throw new FS.ErrnoError(32);
                  }
                }
              }
            }
            return { path: current_path, node: current };
          },
          getPath(node) {
            var path;
            while (true) {
              if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
              }
              path = path ? `${node.name}/${path}` : node.name;
              node = node.parent;
            }
          },
          hashName(parentid, name) {
            var hash = 0;
            for (var i2 = 0; i2 < name.length; i2++) {
              hash = (hash << 5) - hash + name.charCodeAt(i2) | 0;
            }
            return (parentid + hash >>> 0) % FS.nameTable.length;
          },
          hashAddNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            node.name_next = FS.nameTable[hash];
            FS.nameTable[hash] = node;
          },
          hashRemoveNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            if (FS.nameTable[hash] === node) {
              FS.nameTable[hash] = node.name_next;
            } else {
              var current = FS.nameTable[hash];
              while (current) {
                if (current.name_next === node) {
                  current.name_next = node.name_next;
                  break;
                }
                current = current.name_next;
              }
            }
          },
          lookupNode(parent, name) {
            var errCode = FS.mayLookup(parent);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            var hash = FS.hashName(parent.id, name);
            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
              var nodeName = node.name;
              if (node.parent.id === parent.id && nodeName === name) {
                return node;
              }
            }
            return FS.lookup(parent, name);
          },
          createNode(parent, name, mode, rdev) {
            assert3(typeof parent == "object");
            var node = new FS.FSNode(parent, name, mode, rdev);
            FS.hashAddNode(node);
            return node;
          },
          destroyNode(node) {
            FS.hashRemoveNode(node);
          },
          isRoot(node) {
            return node === node.parent;
          },
          isMountpoint(node) {
            return !!node.mounted;
          },
          isFile(mode) {
            return (mode & 61440) === 32768;
          },
          isDir(mode) {
            return (mode & 61440) === 16384;
          },
          isLink(mode) {
            return (mode & 61440) === 40960;
          },
          isChrdev(mode) {
            return (mode & 61440) === 8192;
          },
          isBlkdev(mode) {
            return (mode & 61440) === 24576;
          },
          isFIFO(mode) {
            return (mode & 61440) === 4096;
          },
          isSocket(mode) {
            return (mode & 49152) === 49152;
          },
          flagsToPermissionString(flag) {
            var perms = ["r", "w", "rw"][flag & 3];
            if (flag & 512) {
              perms += "w";
            }
            return perms;
          },
          nodePermissions(node, perms) {
            if (FS.ignorePermissions) {
              return 0;
            }
            if (perms.includes("r") && !(node.mode & 292)) {
              return 2;
            } else if (perms.includes("w") && !(node.mode & 146)) {
              return 2;
            } else if (perms.includes("x") && !(node.mode & 73)) {
              return 2;
            }
            return 0;
          },
          mayLookup(dir) {
            if (!FS.isDir(dir.mode)) return 54;
            var errCode = FS.nodePermissions(dir, "x");
            if (errCode) return errCode;
            if (!dir.node_ops.lookup) return 2;
            return 0;
          },
          mayCreate(dir, name) {
            try {
              var node = FS.lookupNode(dir, name);
              return 20;
            } catch (e) {
            }
            return FS.nodePermissions(dir, "wx");
          },
          mayDelete(dir, name, isdir) {
            var node;
            try {
              node = FS.lookupNode(dir, name);
            } catch (e) {
              return e.errno;
            }
            var errCode = FS.nodePermissions(dir, "wx");
            if (errCode) {
              return errCode;
            }
            if (isdir) {
              if (!FS.isDir(node.mode)) {
                return 54;
              }
              if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
              }
            } else {
              if (FS.isDir(node.mode)) {
                return 31;
              }
            }
            return 0;
          },
          mayOpen(node, flags) {
            if (!node) {
              return 44;
            }
            if (FS.isLink(node.mode)) {
              return 32;
            } else if (FS.isDir(node.mode)) {
              if (FS.flagsToPermissionString(flags) !== "r" || // opening for write
              flags & 512) {
                return 31;
              }
            }
            return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
          },
          MAX_OPEN_FDS: 4096,
          nextfd() {
            for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
              if (!FS.streams[fd]) {
                return fd;
              }
            }
            throw new FS.ErrnoError(33);
          },
          getStreamChecked(fd) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            return stream;
          },
          getStream: (fd) => FS.streams[fd],
          createStream(stream, fd = -1) {
            if (!FS.FSStream) {
              FS.FSStream = /** @constructor */
              function() {
                this.shared = {};
              };
              FS.FSStream.prototype = {};
              Object.defineProperties(FS.FSStream.prototype, {
                object: {
                  /** @this {FS.FSStream} */
                  get() {
                    return this.node;
                  },
                  /** @this {FS.FSStream} */
                  set(val) {
                    this.node = val;
                  }
                },
                isRead: {
                  /** @this {FS.FSStream} */
                  get() {
                    return (this.flags & 2097155) !== 1;
                  }
                },
                isWrite: {
                  /** @this {FS.FSStream} */
                  get() {
                    return (this.flags & 2097155) !== 0;
                  }
                },
                isAppend: {
                  /** @this {FS.FSStream} */
                  get() {
                    return this.flags & 1024;
                  }
                },
                flags: {
                  /** @this {FS.FSStream} */
                  get() {
                    return this.shared.flags;
                  },
                  /** @this {FS.FSStream} */
                  set(val) {
                    this.shared.flags = val;
                  }
                },
                position: {
                  /** @this {FS.FSStream} */
                  get() {
                    return this.shared.position;
                  },
                  /** @this {FS.FSStream} */
                  set(val) {
                    this.shared.position = val;
                  }
                }
              });
            }
            stream = Object.assign(new FS.FSStream(), stream);
            if (fd == -1) {
              fd = FS.nextfd();
            }
            stream.fd = fd;
            FS.streams[fd] = stream;
            return stream;
          },
          closeStream(fd) {
            FS.streams[fd] = null;
          },
          chrdev_stream_ops: {
            open(stream) {
              var device = FS.getDevice(stream.node.rdev);
              stream.stream_ops = device.stream_ops;
              stream.stream_ops.open?.(stream);
            },
            llseek() {
              throw new FS.ErrnoError(70);
            }
          },
          major: (dev) => dev >> 8,
          minor: (dev) => dev & 255,
          makedev: (ma, mi) => ma << 8 | mi,
          registerDevice(dev, ops) {
            FS.devices[dev] = { stream_ops: ops };
          },
          getDevice: (dev) => FS.devices[dev],
          getMounts(mount) {
            var mounts = [];
            var check = [mount];
            while (check.length) {
              var m = check.pop();
              mounts.push(m);
              check.push.apply(check, m.mounts);
            }
            return mounts;
          },
          syncfs(populate, callback) {
            if (typeof populate == "function") {
              callback = populate;
              populate = false;
            }
            FS.syncFSRequests++;
            if (FS.syncFSRequests > 1) {
              err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
            }
            var mounts = FS.getMounts(FS.root.mount);
            var completed = 0;
            function doCallback(errCode) {
              assert3(FS.syncFSRequests > 0);
              FS.syncFSRequests--;
              return callback(errCode);
            }
            function done(errCode) {
              if (errCode) {
                if (!done.errored) {
                  done.errored = true;
                  return doCallback(errCode);
                }
                return;
              }
              if (++completed >= mounts.length) {
                doCallback(null);
              }
            }
            ;
            mounts.forEach((mount) => {
              if (!mount.type.syncfs) {
                return done(null);
              }
              mount.type.syncfs(mount, populate, done);
            });
          },
          mount(type2, opts, mountpoint) {
            if (typeof type2 == "string") {
              throw type2;
            }
            var root = mountpoint === "/";
            var pseudo = !mountpoint;
            var node;
            if (root && FS.root) {
              throw new FS.ErrnoError(10);
            } else if (!root && !pseudo) {
              var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
              mountpoint = lookup.path;
              node = lookup.node;
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
            }
            var mount = {
              type: type2,
              opts,
              mountpoint,
              mounts: []
            };
            var mountRoot = type2.mount(mount);
            mountRoot.mount = mount;
            mount.root = mountRoot;
            if (root) {
              FS.root = mountRoot;
            } else if (node) {
              node.mounted = mount;
              if (node.mount) {
                node.mount.mounts.push(mount);
              }
            }
            return mountRoot;
          },
          unmount(mountpoint) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            if (!FS.isMountpoint(lookup.node)) {
              throw new FS.ErrnoError(28);
            }
            var node = lookup.node;
            var mount = node.mounted;
            var mounts = FS.getMounts(mount);
            Object.keys(FS.nameTable).forEach((hash) => {
              var current = FS.nameTable[hash];
              while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                  FS.destroyNode(current);
                }
                current = next;
              }
            });
            node.mounted = null;
            var idx = node.mount.mounts.indexOf(mount);
            assert3(idx !== -1);
            node.mount.mounts.splice(idx, 1);
          },
          lookup(parent, name) {
            return parent.node_ops.lookup(parent, name);
          },
          mknod(path, mode, dev) {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            if (!name || name === "." || name === "..") {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.mayCreate(parent, name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.mknod) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.mknod(parent, name, mode, dev);
          },
          create(path, mode) {
            mode = mode !== void 0 ? mode : 438;
            mode &= 4095;
            mode |= 32768;
            return FS.mknod(path, mode, 0);
          },
          mkdir(path, mode) {
            mode = mode !== void 0 ? mode : 511;
            mode &= 511 | 512;
            mode |= 16384;
            return FS.mknod(path, mode, 0);
          },
          mkdirTree(path, mode) {
            var dirs = path.split("/");
            var d = "";
            for (var i2 = 0; i2 < dirs.length; ++i2) {
              if (!dirs[i2]) continue;
              d += "/" + dirs[i2];
              try {
                FS.mkdir(d, mode);
              } catch (e) {
                if (e.errno != 20) throw e;
              }
            }
          },
          mkdev(path, mode, dev) {
            if (typeof dev == "undefined") {
              dev = mode;
              mode = 438;
            }
            mode |= 8192;
            return FS.mknod(path, mode, dev);
          },
          symlink(oldpath, newpath) {
            if (!PATH_FS.resolve(oldpath)) {
              throw new FS.ErrnoError(44);
            }
            var lookup = FS.lookupPath(newpath, { parent: true });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var newname = PATH.basename(newpath);
            var errCode = FS.mayCreate(parent, newname);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.symlink) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.symlink(parent, newname, oldpath);
          },
          rename(old_path, new_path) {
            var old_dirname = PATH.dirname(old_path);
            var new_dirname = PATH.dirname(new_path);
            var old_name = PATH.basename(old_path);
            var new_name = PATH.basename(new_path);
            var lookup, old_dir, new_dir;
            lookup = FS.lookupPath(old_path, { parent: true });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, { parent: true });
            new_dir = lookup.node;
            if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
            if (old_dir.mount !== new_dir.mount) {
              throw new FS.ErrnoError(75);
            }
            var old_node = FS.lookupNode(old_dir, old_name);
            var relative = PATH_FS.relative(old_path, new_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(28);
            }
            relative = PATH_FS.relative(new_path, old_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(55);
            }
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (old_node === new_node) {
              return;
            }
            var isdir = FS.isDir(old_node.mode);
            var errCode = FS.mayDelete(old_dir, old_name, isdir);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!old_dir.node_ops.rename) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
              throw new FS.ErrnoError(10);
            }
            if (new_dir !== old_dir) {
              errCode = FS.nodePermissions(old_dir, "w");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            FS.hashRemoveNode(old_node);
            try {
              old_dir.node_ops.rename(old_node, new_dir, new_name);
            } catch (e) {
              throw e;
            } finally {
              FS.hashAddNode(old_node);
            }
          },
          rmdir(path) {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, true);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.rmdir) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.rmdir(parent, name);
            FS.destroyNode(node);
          },
          readdir(path) {
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            if (!node.node_ops.readdir) {
              throw new FS.ErrnoError(54);
            }
            return node.node_ops.readdir(node);
          },
          unlink(path) {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, false);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.unlink) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.unlink(parent, name);
            FS.destroyNode(node);
          },
          readlink(path) {
            var lookup = FS.lookupPath(path);
            var link = lookup.node;
            if (!link) {
              throw new FS.ErrnoError(44);
            }
            if (!link.node_ops.readlink) {
              throw new FS.ErrnoError(28);
            }
            return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
          },
          stat(path, dontFollow) {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            var node = lookup.node;
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (!node.node_ops.getattr) {
              throw new FS.ErrnoError(63);
            }
            return node.node_ops.getattr(node);
          },
          lstat(path) {
            return FS.stat(path, true);
          },
          chmod(path, mode, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, { follow: !dontFollow });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              mode: mode & 4095 | node.mode & ~4095,
              timestamp: Date.now()
            });
          },
          lchmod(path, mode) {
            FS.chmod(path, mode, true);
          },
          fchmod(fd, mode) {
            var stream = FS.getStreamChecked(fd);
            FS.chmod(stream.node, mode);
          },
          chown(path, uid, gid, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, { follow: !dontFollow });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              timestamp: Date.now()
              // we ignore the uid / gid for now
            });
          },
          lchown(path, uid, gid) {
            FS.chown(path, uid, gid, true);
          },
          fchown(fd, uid, gid) {
            var stream = FS.getStreamChecked(fd);
            FS.chown(stream.node, uid, gid);
          },
          truncate(path, len) {
            if (len < 0) {
              throw new FS.ErrnoError(28);
            }
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, { follow: true });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isDir(node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!FS.isFile(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.nodePermissions(node, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            node.node_ops.setattr(node, {
              size: len,
              timestamp: Date.now()
            });
          },
          ftruncate(fd, len) {
            var stream = FS.getStreamChecked(fd);
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(28);
            }
            FS.truncate(stream.node, len);
          },
          utime(path, atime, mtime) {
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            node.node_ops.setattr(node, {
              timestamp: Math.max(atime, mtime)
            });
          },
          open(path, flags, mode) {
            if (path === "") {
              throw new FS.ErrnoError(44);
            }
            flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
            mode = typeof mode == "undefined" ? 438 : mode;
            if (flags & 64) {
              mode = mode & 4095 | 32768;
            } else {
              mode = 0;
            }
            var node;
            if (typeof path == "object") {
              node = path;
            } else {
              path = PATH.normalize(path);
              try {
                var lookup = FS.lookupPath(path, {
                  follow: !(flags & 131072)
                });
                node = lookup.node;
              } catch (e) {
              }
            }
            var created = false;
            if (flags & 64) {
              if (node) {
                if (flags & 128) {
                  throw new FS.ErrnoError(20);
                }
              } else {
                node = FS.mknod(path, mode, 0);
                created = true;
              }
            }
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (FS.isChrdev(node.mode)) {
              flags &= ~512;
            }
            if (flags & 65536 && !FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
            if (!created) {
              var errCode = FS.mayOpen(node, flags);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            if (flags & 512 && !created) {
              FS.truncate(node, 0);
            }
            flags &= ~(128 | 512 | 131072);
            var stream = FS.createStream({
              node,
              path: FS.getPath(node),
              // we want the absolute path to the node
              flags,
              seekable: true,
              position: 0,
              stream_ops: node.stream_ops,
              // used by the file family libc calls (fopen, fwrite, ferror, etc.)
              ungotten: [],
              error: false
            });
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
            if (Module["logReadFiles"] && !(flags & 1)) {
              if (!FS.readFiles) FS.readFiles = {};
              if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
              }
            }
            return stream;
          },
          close(stream) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (stream.getdents) stream.getdents = null;
            try {
              if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
              }
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(stream.fd);
            }
            stream.fd = null;
          },
          isClosed(stream) {
            return stream.fd === null;
          },
          llseek(stream, offset, whence) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (!stream.seekable || !stream.stream_ops.llseek) {
              throw new FS.ErrnoError(70);
            }
            if (whence != 0 && whence != 1 && whence != 2) {
              throw new FS.ErrnoError(28);
            }
            stream.position = stream.stream_ops.llseek(stream, offset, whence);
            stream.ungotten = [];
            return stream.position;
          },
          read(stream, buffer, offset, length, position) {
            assert3(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.read) {
              throw new FS.ErrnoError(28);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
            if (!seeking) stream.position += bytesRead;
            return bytesRead;
          },
          write(stream, buffer, offset, length, position, canOwn) {
            assert3(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.write) {
              throw new FS.ErrnoError(28);
            }
            if (stream.seekable && stream.flags & 1024) {
              FS.llseek(stream, 0, 2);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
            if (!seeking) stream.position += bytesWritten;
            return bytesWritten;
          },
          allocate(stream, offset, length) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (offset < 0 || length <= 0) {
              throw new FS.ErrnoError(28);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (!stream.stream_ops.allocate) {
              throw new FS.ErrnoError(138);
            }
            stream.stream_ops.allocate(stream, offset, length);
          },
          mmap(stream, length, position, prot, flags) {
            if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
              throw new FS.ErrnoError(2);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(2);
            }
            if (!stream.stream_ops.mmap) {
              throw new FS.ErrnoError(43);
            }
            return stream.stream_ops.mmap(stream, length, position, prot, flags);
          },
          msync(stream, buffer, offset, length, mmapFlags) {
            assert3(offset >= 0);
            if (!stream.stream_ops.msync) {
              return 0;
            }
            return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
          },
          munmap: (stream) => 0,
          ioctl(stream, cmd, arg) {
            if (!stream.stream_ops.ioctl) {
              throw new FS.ErrnoError(59);
            }
            return stream.stream_ops.ioctl(stream, cmd, arg);
          },
          readFile(path, opts = {}) {
            opts.flags = opts.flags || 0;
            opts.encoding = opts.encoding || "binary";
            if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
              throw new Error(`Invalid encoding type "${opts.encoding}"`);
            }
            var ret;
            var stream = FS.open(path, opts.flags);
            var stat = FS.stat(path);
            var length = stat.size;
            var buf = new Uint8Array(length);
            FS.read(stream, buf, 0, length, 0);
            if (opts.encoding === "utf8") {
              ret = UTF8ArrayToString(buf, 0);
            } else if (opts.encoding === "binary") {
              ret = buf;
            }
            FS.close(stream);
            return ret;
          },
          writeFile(path, data, opts = {}) {
            opts.flags = opts.flags || 577;
            var stream = FS.open(path, opts.flags, opts.mode);
            if (typeof data == "string") {
              var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
              var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
              FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
            } else if (ArrayBuffer.isView(data)) {
              FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
            } else {
              throw new Error("Unsupported data type");
            }
            FS.close(stream);
          },
          cwd: () => FS.currentPath,
          chdir(path) {
            var lookup = FS.lookupPath(path, { follow: true });
            if (lookup.node === null) {
              throw new FS.ErrnoError(44);
            }
            if (!FS.isDir(lookup.node.mode)) {
              throw new FS.ErrnoError(54);
            }
            var errCode = FS.nodePermissions(lookup.node, "x");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            FS.currentPath = lookup.path;
          },
          createDefaultDirectories() {
            FS.mkdir("/tmp");
            FS.mkdir("/home");
            FS.mkdir("/home/web_user");
          },
          createDefaultDevices() {
            FS.mkdir("/dev");
            FS.registerDevice(FS.makedev(1, 3), {
              read: () => 0,
              write: (stream, buffer, offset, length, pos) => length
            });
            FS.mkdev("/dev/null", FS.makedev(1, 3));
            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
            FS.mkdev("/dev/tty", FS.makedev(5, 0));
            FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var randomBuffer = new Uint8Array(1024), randomLeft = 0;
            var randomByte = () => {
              if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength;
              }
              return randomBuffer[--randomLeft];
            };
            FS.createDevice("/dev", "random", randomByte);
            FS.createDevice("/dev", "urandom", randomByte);
            FS.mkdir("/dev/shm");
            FS.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories() {
            FS.mkdir("/proc");
            var proc_self = FS.mkdir("/proc/self");
            FS.mkdir("/proc/self/fd");
            FS.mount({
              mount() {
                var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                node.node_ops = {
                  lookup(parent, name) {
                    var fd = +name;
                    var stream = FS.getStreamChecked(fd);
                    var ret = {
                      parent: null,
                      mount: { mountpoint: "fake" },
                      node_ops: { readlink: () => stream.path }
                    };
                    ret.parent = ret;
                    return ret;
                  }
                };
                return node;
              }
            }, {}, "/proc/self/fd");
          },
          createStandardStreams() {
            if (Module["stdin"]) {
              FS.createDevice("/dev", "stdin", Module["stdin"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdin");
            }
            if (Module["stdout"]) {
              FS.createDevice("/dev", "stdout", null, Module["stdout"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdout");
            }
            if (Module["stderr"]) {
              FS.createDevice("/dev", "stderr", null, Module["stderr"]);
            } else {
              FS.symlink("/dev/tty1", "/dev/stderr");
            }
            var stdin = FS.open("/dev/stdin", 0);
            var stdout = FS.open("/dev/stdout", 1);
            var stderr = FS.open("/dev/stderr", 1);
            assert3(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
            assert3(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
            assert3(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
          },
          staticInit() {
            [44].forEach((code) => {
              FS.genericErrors[code] = new FS.ErrnoError(code);
              FS.genericErrors[code].stack = "<generic error, no stack>";
            });
            FS.nameTable = new Array(4096);
            FS.mount(MEMFS, {}, "/");
            FS.createDefaultDirectories();
            FS.createDefaultDevices();
            FS.createSpecialDirectories();
            FS.filesystems = {
              "MEMFS": MEMFS
            };
          },
          init(input, output, error) {
            assert3(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
            FS.init.initialized = true;
            Module["stdin"] = input || Module["stdin"];
            Module["stdout"] = output || Module["stdout"];
            Module["stderr"] = error || Module["stderr"];
            FS.createStandardStreams();
          },
          quit() {
            FS.init.initialized = false;
            _fflush(0);
            for (var i2 = 0; i2 < FS.streams.length; i2++) {
              var stream = FS.streams[i2];
              if (!stream) {
                continue;
              }
              FS.close(stream);
            }
          },
          findObject(path, dontResolveLastLink) {
            var ret = FS.analyzePath(path, dontResolveLastLink);
            if (!ret.exists) {
              return null;
            }
            return ret.object;
          },
          analyzePath(path, dontResolveLastLink) {
            try {
              var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
              path = lookup.path;
            } catch (e) {
            }
            var ret = {
              isRoot: false,
              exists: false,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: false,
              parentPath: null,
              parentObject: null
            };
            try {
              var lookup = FS.lookupPath(path, { parent: true });
              ret.parentExists = true;
              ret.parentPath = lookup.path;
              ret.parentObject = lookup.node;
              ret.name = PATH.basename(path);
              lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
              ret.exists = true;
              ret.path = lookup.path;
              ret.object = lookup.node;
              ret.name = lookup.node.name;
              ret.isRoot = lookup.path === "/";
            } catch (e) {
              ret.error = e.errno;
            }
            ;
            return ret;
          },
          createPath(parent, path, canRead, canWrite) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            var parts = path.split("/").reverse();
            while (parts.length) {
              var part = parts.pop();
              if (!part) continue;
              var current = PATH.join2(parent, part);
              try {
                FS.mkdir(current);
              } catch (e) {
              }
              parent = current;
            }
            return current;
          },
          createFile(parent, name, properties, canRead, canWrite) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(canRead, canWrite);
            return FS.create(path, mode);
          },
          createDataFile(parent, name, data, canRead, canWrite, canOwn) {
            var path = name;
            if (parent) {
              parent = typeof parent == "string" ? parent : FS.getPath(parent);
              path = name ? PATH.join2(parent, name) : parent;
            }
            var mode = FS_getMode(canRead, canWrite);
            var node = FS.create(path, mode);
            if (data) {
              if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i2 = 0, len = data.length; i2 < len; ++i2) arr[i2] = data.charCodeAt(i2);
                data = arr;
              }
              FS.chmod(node, mode | 146);
              var stream = FS.open(node, 577);
              FS.write(stream, data, 0, data.length, 0, canOwn);
              FS.close(stream);
              FS.chmod(node, mode);
            }
          },
          createDevice(parent, name, input, output) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(!!input, !!output);
            if (!FS.createDevice.major) FS.createDevice.major = 64;
            var dev = FS.makedev(FS.createDevice.major++, 0);
            FS.registerDevice(dev, {
              open(stream) {
                stream.seekable = false;
              },
              close(stream) {
                if (output?.buffer?.length) {
                  output(10);
                }
              },
              read(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i2 = 0; i2 < length; i2++) {
                  var result;
                  try {
                    result = input();
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === void 0 && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === void 0) break;
                  bytesRead++;
                  buffer[offset + i2] = result;
                }
                if (bytesRead) {
                  stream.node.timestamp = Date.now();
                }
                return bytesRead;
              },
              write(stream, buffer, offset, length, pos) {
                for (var i2 = 0; i2 < length; i2++) {
                  try {
                    output(buffer[offset + i2]);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                }
                if (length) {
                  stream.node.timestamp = Date.now();
                }
                return i2;
              }
            });
            return FS.mkdev(path, mode, dev);
          },
          forceLoadFile(obj) {
            if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
            if (typeof XMLHttpRequest != "undefined") {
              throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            } else if (read_) {
              try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            } else {
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            }
          },
          createLazyFile(parent, name, url, canRead, canWrite) {
            function LazyUint8Array() {
              this.lengthKnown = false;
              this.chunks = [];
            }
            LazyUint8Array.prototype.get = /** @this{Object} */
            function LazyUint8Array_get(idx) {
              if (idx > this.length - 1 || idx < 0) {
                return void 0;
              }
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = idx / this.chunkSize | 0;
              return this.getter(chunkNum)[chunkOffset];
            };
            LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter2) {
              this.getter = getter2;
            };
            LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              var xhr = new XMLHttpRequest();
              xhr.open("HEAD", url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
              var chunkSize = 1024 * 1024;
              if (!hasByteServing) chunkSize = datalength;
              var doXHR = (from, to) => {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr2 = new XMLHttpRequest();
                xhr2.open("GET", url, false);
                if (datalength !== chunkSize) xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                xhr2.responseType = "arraybuffer";
                if (xhr2.overrideMimeType) {
                  xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                }
                xhr2.send(null);
                if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
                if (xhr2.response !== void 0) {
                  return new Uint8Array(
                    /** @type{Array<number>} */
                    xhr2.response || []
                  );
                }
                return intArrayFromString(xhr2.responseText || "", true);
              };
              var lazyArray2 = this;
              lazyArray2.setDataGetter((chunkNum) => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                  lazyArray2.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
                return lazyArray2.chunks[chunkNum];
              });
              if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
              }
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
            };
            if (typeof XMLHttpRequest != "undefined") {
              if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var lazyArray = new LazyUint8Array();
              Object.defineProperties(lazyArray, {
                length: {
                  get: (
                    /** @this{Object} */
                    function() {
                      if (!this.lengthKnown) {
                        this.cacheLength();
                      }
                      return this._length;
                    }
                  )
                },
                chunkSize: {
                  get: (
                    /** @this{Object} */
                    function() {
                      if (!this.lengthKnown) {
                        this.cacheLength();
                      }
                      return this._chunkSize;
                    }
                  )
                }
              });
              var properties = { isDevice: false, contents: lazyArray };
            } else {
              var properties = { isDevice: false, url };
            }
            var node = FS.createFile(parent, name, properties, canRead, canWrite);
            if (properties.contents) {
              node.contents = properties.contents;
            } else if (properties.url) {
              node.contents = null;
              node.url = properties.url;
            }
            Object.defineProperties(node, {
              usedBytes: {
                get: (
                  /** @this {FSNode} */
                  function() {
                    return this.contents.length;
                  }
                )
              }
            });
            var stream_ops = {};
            var keys = Object.keys(node.stream_ops);
            keys.forEach((key) => {
              var fn = node.stream_ops[key];
              stream_ops[key] = function forceLoadLazyFile() {
                FS.forceLoadFile(node);
                return fn.apply(null, arguments);
              };
            });
            function writeChunks(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= contents.length)
                return 0;
              var size = Math.min(contents.length - position, length);
              assert3(size >= 0);
              if (contents.slice) {
                for (var i2 = 0; i2 < size; i2++) {
                  buffer[offset + i2] = contents[position + i2];
                }
              } else {
                for (var i2 = 0; i2 < size; i2++) {
                  buffer[offset + i2] = contents.get(position + i2);
                }
              }
              return size;
            }
            stream_ops.read = (stream, buffer, offset, length, position) => {
              FS.forceLoadFile(node);
              return writeChunks(stream, buffer, offset, length, position);
            };
            stream_ops.mmap = (stream, length, position, prot, flags) => {
              FS.forceLoadFile(node);
              var ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              writeChunks(stream, HEAP8, ptr, length, position);
              return { ptr, allocated: true };
            };
            node.stream_ops = stream_ops;
            return node;
          },
          absolutePath() {
            abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
          },
          createFolder() {
            abort("FS.createFolder has been removed; use FS.mkdir instead");
          },
          createLink() {
            abort("FS.createLink has been removed; use FS.symlink instead");
          },
          joinPath() {
            abort("FS.joinPath has been removed; use PATH.join instead");
          },
          mmapAlloc() {
            abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
          },
          standardizePath() {
            abort("FS.standardizePath has been removed; use PATH.normalize instead");
          }
        };
        var SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt(dirfd, path, allowEmpty) {
            if (PATH.isAbs(path)) {
              return path;
            }
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = SYSCALLS.getStreamFromFD(dirfd);
              dir = dirstream.path;
            }
            if (path.length == 0) {
              if (!allowEmpty) {
                throw new FS.ErrnoError(44);
                ;
              }
              return dir;
            }
            return PATH.join2(dir, path);
          },
          doStat(func, path, buf) {
            var stat = func(path);
            HEAP32[buf >> 2] = stat.dev;
            HEAP32[buf + 4 >> 2] = stat.mode;
            HEAPU32[buf + 8 >> 2] = stat.nlink;
            HEAP32[buf + 12 >> 2] = stat.uid;
            HEAP32[buf + 16 >> 2] = stat.gid;
            HEAP32[buf + 20 >> 2] = stat.rdev;
            HEAP64[buf + 24 >> 3] = BigInt(stat.size);
            HEAP32[buf + 32 >> 2] = 4096;
            HEAP32[buf + 36 >> 2] = stat.blocks;
            var atime = stat.atime.getTime();
            var mtime = stat.mtime.getTime();
            var ctime = stat.ctime.getTime();
            HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
            HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3;
            HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
            HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3;
            HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
            HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3;
            HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
            return 0;
          },
          doMsync(addr, stream, len, flags, offset) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (flags & 2) {
              return 0;
            }
            var buffer = HEAPU8.slice(addr, addr + len);
            FS.msync(stream, buffer, offset, len, flags);
          },
          varargs: void 0,
          get() {
            assert3(SYSCALLS.varargs != void 0);
            var ret = HEAP32[+SYSCALLS.varargs >> 2];
            SYSCALLS.varargs += 4;
            return ret;
          },
          getp() {
            return SYSCALLS.get();
          },
          getStr(ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          },
          getStreamFromFD(fd) {
            var stream = FS.getStreamChecked(fd);
            return stream;
          }
        };
        function ___syscall_chmod(path, mode) {
          try {
            path = SYSCALLS.getStr(path);
            FS.chmod(path, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchmod(fd, mode) {
          try {
            FS.fchmod(fd, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                  return -28;
                }
                while (FS.streams[arg]) {
                  arg++;
                }
                var newStream;
                newStream = FS.createStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0;
              }
              case 12: {
                var arg = SYSCALLS.getp();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0;
              }
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_fstat64(fd, buf) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21505: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = SYSCALLS.getp();
                  HEAP32[argp >> 2] = termios.c_iflag || 0;
                  HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                  HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                  HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                  for (var i2 = 0; i2 < 32; i2++) {
                    HEAP8[argp + i2 + 17 >> 0] = termios.c_cc[i2] || 0;
                  }
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  var argp = SYSCALLS.getp();
                  var c_iflag = HEAP32[argp >> 2];
                  var c_oflag = HEAP32[argp + 4 >> 2];
                  var c_cflag = HEAP32[argp + 8 >> 2];
                  var c_lflag = HEAP32[argp + 12 >> 2];
                  var c_cc = [];
                  for (var i2 = 0; i2 < 32; i2++) {
                    c_cc.push(HEAP8[argp + i2 + 17 >> 0]);
                  }
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
                }
                return 0;
              }
              case 21519: {
                if (!stream.tty) return -59;
                var argp = SYSCALLS.getp();
                HEAP32[argp >> 2] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty) return -59;
                return -28;
              }
              case 21531: {
                var argp = SYSCALLS.getp();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  var argp = SYSCALLS.getp();
                  HEAP16[argp >> 1] = winsize[0];
                  HEAP16[argp + 2 >> 1] = winsize[1];
                }
                return 0;
              }
              case 21524: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21515: {
                if (!stream.tty) return -59;
                return 0;
              }
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_lstat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.lstat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
          try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags = flags & ~6400;
            assert3(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? SYSCALLS.get() : 0;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
          try {
            oldpath = SYSCALLS.getStr(oldpath);
            newpath = SYSCALLS.getStr(newpath);
            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
            FS.rename(oldpath, newpath);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_rmdir(path) {
          try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_stat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
              FS.unlink(path);
            } else if (flags === 512) {
              FS.rmdir(path);
            } else {
              abort("Invalid flags passed to unlinkat");
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        var tupleRegistrations = {};
        var runDestructors = (destructors) => {
          while (destructors.length) {
            var ptr = destructors.pop();
            var del = destructors.pop();
            del(ptr);
          }
        };
        function simpleReadValueFromPointer(pointer) {
          return this["fromWireType"](HEAP32[pointer >> 2]);
        }
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        var InternalError;
        var throwInternalError = (message) => {
          throw new InternalError(message);
        };
        var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
          myTypes.forEach(function(type2) {
            typeDependencies[type2] = dependentTypes;
          });
          function onComplete(typeConverters2) {
            var myTypeConverters = getTypeConverters(typeConverters2);
            if (myTypeConverters.length !== myTypes.length) {
              throwInternalError("Mismatched type converter count");
            }
            for (var i2 = 0; i2 < myTypes.length; ++i2) {
              registerType(myTypes[i2], myTypeConverters[i2]);
            }
          }
          var typeConverters = new Array(dependentTypes.length);
          var unregisteredTypes = [];
          var registered = 0;
          dependentTypes.forEach((dt, i2) => {
            if (registeredTypes.hasOwnProperty(dt)) {
              typeConverters[i2] = registeredTypes[dt];
            } else {
              unregisteredTypes.push(dt);
              if (!awaitingDependencies.hasOwnProperty(dt)) {
                awaitingDependencies[dt] = [];
              }
              awaitingDependencies[dt].push(() => {
                typeConverters[i2] = registeredTypes[dt];
                ++registered;
                if (registered === unregisteredTypes.length) {
                  onComplete(typeConverters);
                }
              });
            }
          });
          if (0 === unregisteredTypes.length) {
            onComplete(typeConverters);
          }
        };
        var __embind_finalize_value_array = (rawTupleType) => {
          var reg = tupleRegistrations[rawTupleType];
          delete tupleRegistrations[rawTupleType];
          var elements = reg.elements;
          var elementsLength = elements.length;
          var elementTypes = elements.map((elt) => elt.getterReturnType).concat(elements.map((elt) => elt.setterArgumentType));
          var rawConstructor = reg.rawConstructor;
          var rawDestructor = reg.rawDestructor;
          whenDependentTypesAreResolved([rawTupleType], elementTypes, function(elementTypes2) {
            elements.forEach((elt, i2) => {
              var getterReturnType = elementTypes2[i2];
              var getter2 = elt.getter;
              var getterContext = elt.getterContext;
              var setterArgumentType = elementTypes2[i2 + elementsLength];
              var setter2 = elt.setter;
              var setterContext = elt.setterContext;
              elt.read = (ptr) => getterReturnType["fromWireType"](getter2(getterContext, ptr));
              elt.write = (ptr, o) => {
                var destructors = [];
                setter2(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                runDestructors(destructors);
              };
            });
            return [{
              name: reg.name,
              "fromWireType": (ptr) => {
                var rv = new Array(elementsLength);
                for (var i2 = 0; i2 < elementsLength; ++i2) {
                  rv[i2] = elements[i2].read(ptr);
                }
                rawDestructor(ptr);
                return rv;
              },
              "toWireType": (destructors, o) => {
                if (elementsLength !== o.length) {
                  throw new TypeError(`Incorrect number of tuple elements for ${reg.name}: expected=${elementsLength}, actual=${o.length}`);
                }
                var ptr = rawConstructor();
                for (var i2 = 0; i2 < elementsLength; ++i2) {
                  elements[i2].write(ptr, o[i2]);
                }
                if (destructors !== null) {
                  destructors.push(rawDestructor, ptr);
                }
                return ptr;
              },
              "argPackAdvance": GenericWireTypeSize,
              "readValueFromPointer": simpleReadValueFromPointer,
              destructorFunction: rawDestructor
            }];
          });
        };
        var structRegistrations = {};
        var __embind_finalize_value_object = (structType) => {
          var reg = structRegistrations[structType];
          delete structRegistrations[structType];
          var rawConstructor = reg.rawConstructor;
          var rawDestructor = reg.rawDestructor;
          var fieldRecords = reg.fields;
          var fieldTypes = fieldRecords.map((field) => field.getterReturnType).concat(fieldRecords.map((field) => field.setterArgumentType));
          whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes2) => {
            var fields = {};
            fieldRecords.forEach((field, i2) => {
              var fieldName = field.fieldName;
              var getterReturnType = fieldTypes2[i2];
              var getter2 = field.getter;
              var getterContext = field.getterContext;
              var setterArgumentType = fieldTypes2[i2 + fieldRecords.length];
              var setter2 = field.setter;
              var setterContext = field.setterContext;
              fields[fieldName] = {
                read: (ptr) => getterReturnType["fromWireType"](getter2(getterContext, ptr)),
                write: (ptr, o) => {
                  var destructors = [];
                  setter2(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                  runDestructors(destructors);
                }
              };
            });
            return [{
              name: reg.name,
              "fromWireType": (ptr) => {
                var rv = {};
                for (var i2 in fields) {
                  rv[i2] = fields[i2].read(ptr);
                }
                rawDestructor(ptr);
                return rv;
              },
              "toWireType": (destructors, o) => {
                for (var fieldName in fields) {
                  if (!(fieldName in o)) {
                    throw new TypeError(`Missing field: "${fieldName}"`);
                  }
                }
                var ptr = rawConstructor();
                for (fieldName in fields) {
                  fields[fieldName].write(ptr, o[fieldName]);
                }
                if (destructors !== null) {
                  destructors.push(rawDestructor, ptr);
                }
                return ptr;
              },
              "argPackAdvance": GenericWireTypeSize,
              "readValueFromPointer": simpleReadValueFromPointer,
              destructorFunction: rawDestructor
            }];
          });
        };
        var embindRepr = (v) => {
          if (v === null) {
            return "null";
          }
          var t = typeof v;
          if (t === "object" || t === "array" || t === "function") {
            return v.toString();
          } else {
            return "" + v;
          }
        };
        var embind_init_charCodes = () => {
          var codes = new Array(256);
          for (var i2 = 0; i2 < 256; ++i2) {
            codes[i2] = String.fromCharCode(i2);
          }
          embind_charCodes = codes;
        };
        var embind_charCodes;
        var readLatin1String = (ptr) => {
          var ret = "";
          var c = ptr;
          while (HEAPU8[c]) {
            ret += embind_charCodes[HEAPU8[c++]];
          }
          return ret;
        };
        var BindingError;
        var throwBindingError = (message) => {
          throw new BindingError(message);
        };
        function sharedRegisterType(rawType, registeredInstance, options = {}) {
          var name = registeredInstance.name;
          if (!rawType) {
            throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
          }
          if (registeredTypes.hasOwnProperty(rawType)) {
            if (options.ignoreDuplicateRegistrations) {
              return;
            } else {
              throwBindingError(`Cannot register type '${name}' twice`);
            }
          }
          registeredTypes[rawType] = registeredInstance;
          delete typeDependencies[rawType];
          if (awaitingDependencies.hasOwnProperty(rawType)) {
            var callbacks = awaitingDependencies[rawType];
            delete awaitingDependencies[rawType];
            callbacks.forEach((cb) => cb());
          }
        }
        function registerType(rawType, registeredInstance, options = {}) {
          if (!("argPackAdvance" in registeredInstance)) {
            throw new TypeError("registerType registeredInstance requires argPackAdvance");
          }
          return sharedRegisterType(rawType, registeredInstance, options);
        }
        var integerReadValueFromPointer = (name, width, signed) => {
          switch (width) {
            case 1:
              return signed ? (pointer) => HEAP8[pointer >> 0] : (pointer) => HEAPU8[pointer >> 0];
            case 2:
              return signed ? (pointer) => HEAP16[pointer >> 1] : (pointer) => HEAPU16[pointer >> 1];
            case 4:
              return signed ? (pointer) => HEAP32[pointer >> 2] : (pointer) => HEAPU32[pointer >> 2];
            case 8:
              return signed ? (pointer) => HEAP64[pointer >> 3] : (pointer) => HEAPU64[pointer >> 3];
            default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
          }
        };
        var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {
          name = readLatin1String(name);
          var isUnsignedType = name.indexOf("u") != -1;
          if (isUnsignedType) {
            maxRange = (1n << 64n) - 1n;
          }
          registerType(primitiveType, {
            name,
            "fromWireType": (value) => value,
            "toWireType": function(destructors, value) {
              if (typeof value != "bigint" && typeof value != "number") {
                throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${this.name}`);
              }
              if (typeof value == "number") {
                value = BigInt(value);
              }
              if (value < minRange || value > maxRange) {
                throw new TypeError(`Passing a number "${embindRepr(value)}" from JS side to C/C++ side to an argument of type "${name}", which is outside the valid range [${minRange}, ${maxRange}]!`);
              }
              return value;
            },
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": integerReadValueFromPointer(name, size, !isUnsignedType),
            destructorFunction: null
            // This type does not need a destructor
          });
        };
        var GenericWireTypeSize = 8;
        var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
          name = readLatin1String(name);
          registerType(rawType, {
            name,
            "fromWireType": function(wt) {
              return !!wt;
            },
            "toWireType": function(destructors, o) {
              return o ? trueValue : falseValue;
            },
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": function(pointer) {
              return this["fromWireType"](HEAPU8[pointer]);
            },
            destructorFunction: null
            // This type does not need a destructor
          });
        };
        var shallowCopyInternalPointer = (o) => {
          return {
            count: o.count,
            deleteScheduled: o.deleteScheduled,
            preservePointerOnDelete: o.preservePointerOnDelete,
            ptr: o.ptr,
            ptrType: o.ptrType,
            smartPtr: o.smartPtr,
            smartPtrType: o.smartPtrType
          };
        };
        var throwInstanceAlreadyDeleted = (obj) => {
          function getInstanceTypeName(handle) {
            return handle.$$.ptrType.registeredClass.name;
          }
          throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
        };
        var finalizationRegistry = false;
        var detachFinalizer = (handle) => {
        };
        var runDestructor = ($$) => {
          if ($$.smartPtr) {
            $$.smartPtrType.rawDestructor($$.smartPtr);
          } else {
            $$.ptrType.registeredClass.rawDestructor($$.ptr);
          }
        };
        var releaseClassHandle = ($$) => {
          $$.count.value -= 1;
          var toDelete = 0 === $$.count.value;
          if (toDelete) {
            runDestructor($$);
          }
        };
        var downcastPointer = (ptr, ptrClass, desiredClass) => {
          if (ptrClass === desiredClass) {
            return ptr;
          }
          if (void 0 === desiredClass.baseClass) {
            return null;
          }
          var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
          if (rv === null) {
            return null;
          }
          return desiredClass.downcast(rv);
        };
        var registeredPointers = {};
        var getInheritedInstanceCount = () => Object.keys(registeredInstances).length;
        var getLiveInheritedInstances = () => {
          var rv = [];
          for (var k in registeredInstances) {
            if (registeredInstances.hasOwnProperty(k)) {
              rv.push(registeredInstances[k]);
            }
          }
          return rv;
        };
        var deletionQueue = [];
        var flushPendingDeletes = () => {
          while (deletionQueue.length) {
            var obj = deletionQueue.pop();
            obj.$$.deleteScheduled = false;
            obj["delete"]();
          }
        };
        var delayFunction;
        var setDelayFunction = (fn) => {
          delayFunction = fn;
          if (deletionQueue.length && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
        };
        var init_embind = () => {
          Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
          Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
          Module["flushPendingDeletes"] = flushPendingDeletes;
          Module["setDelayFunction"] = setDelayFunction;
        };
        var registeredInstances = {};
        var getBasestPointer = (class_, ptr) => {
          if (ptr === void 0) {
            throwBindingError("ptr should not be undefined");
          }
          while (class_.baseClass) {
            ptr = class_.upcast(ptr);
            class_ = class_.baseClass;
          }
          return ptr;
        };
        var getInheritedInstance = (class_, ptr) => {
          ptr = getBasestPointer(class_, ptr);
          return registeredInstances[ptr];
        };
        var makeClassHandle = (prototype, record) => {
          if (!record.ptrType || !record.ptr) {
            throwInternalError("makeClassHandle requires ptr and ptrType");
          }
          var hasSmartPtrType = !!record.smartPtrType;
          var hasSmartPtr = !!record.smartPtr;
          if (hasSmartPtrType !== hasSmartPtr) {
            throwInternalError("Both smartPtrType and smartPtr must be specified");
          }
          record.count = { value: 1 };
          return attachFinalizer(Object.create(prototype, {
            $$: {
              value: record,
              writable: true
            }
          }));
        };
        function RegisteredPointer_fromWireType(ptr) {
          var rawPointer = this.getPointee(ptr);
          if (!rawPointer) {
            this.destructor(ptr);
            return null;
          }
          var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
          if (void 0 !== registeredInstance) {
            if (0 === registeredInstance.$$.count.value) {
              registeredInstance.$$.ptr = rawPointer;
              registeredInstance.$$.smartPtr = ptr;
              return registeredInstance["clone"]();
            } else {
              var rv = registeredInstance["clone"]();
              this.destructor(ptr);
              return rv;
            }
          }
          function makeDefaultHandle() {
            if (this.isSmartPointer) {
              return makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this.pointeeType,
                ptr: rawPointer,
                smartPtrType: this,
                smartPtr: ptr
              });
            } else {
              return makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this,
                ptr
              });
            }
          }
          var actualType = this.registeredClass.getActualType(rawPointer);
          var registeredPointerRecord = registeredPointers[actualType];
          if (!registeredPointerRecord) {
            return makeDefaultHandle.call(this);
          }
          var toType;
          if (this.isConst) {
            toType = registeredPointerRecord.constPointerType;
          } else {
            toType = registeredPointerRecord.pointerType;
          }
          var dp = downcastPointer(
            rawPointer,
            this.registeredClass,
            toType.registeredClass
          );
          if (dp === null) {
            return makeDefaultHandle.call(this);
          }
          if (this.isSmartPointer) {
            return makeClassHandle(toType.registeredClass.instancePrototype, {
              ptrType: toType,
              ptr: dp,
              smartPtrType: this,
              smartPtr: ptr
            });
          } else {
            return makeClassHandle(toType.registeredClass.instancePrototype, {
              ptrType: toType,
              ptr: dp
            });
          }
        }
        var attachFinalizer = (handle) => {
          if ("undefined" === typeof FinalizationRegistry) {
            attachFinalizer = (handle2) => handle2;
            return handle;
          }
          finalizationRegistry = new FinalizationRegistry((info) => {
            console.warn(info.leakWarning.stack.replace(/^Error: /, ""));
            releaseClassHandle(info.$$);
          });
          attachFinalizer = (handle2) => {
            var $$ = handle2.$$;
            var hasSmartPtr = !!$$.smartPtr;
            if (hasSmartPtr) {
              var info = { $$ };
              var cls = $$.ptrType.registeredClass;
              info.leakWarning = new Error(`Embind found a leaked C++ instance ${cls.name} <${ptrToString($$.ptr)}>.
We'll free it automatically in this case, but this functionality is not reliable across various environments.
Make sure to invoke .delete() manually once you're done with the instance instead.
Originally allocated`);
              if ("captureStackTrace" in Error) {
                Error.captureStackTrace(info.leakWarning, RegisteredPointer_fromWireType);
              }
              finalizationRegistry.register(handle2, info, handle2);
            }
            return handle2;
          };
          detachFinalizer = (handle2) => finalizationRegistry.unregister(handle2);
          return attachFinalizer(handle);
        };
        var init_ClassHandle = () => {
          Object.assign(ClassHandle.prototype, {
            "isAliasOf"(other) {
              if (!(this instanceof ClassHandle)) {
                return false;
              }
              if (!(other instanceof ClassHandle)) {
                return false;
              }
              var leftClass = this.$$.ptrType.registeredClass;
              var left = this.$$.ptr;
              other.$$ = /** @type {Object} */
              other.$$;
              var rightClass = other.$$.ptrType.registeredClass;
              var right = other.$$.ptr;
              while (leftClass.baseClass) {
                left = leftClass.upcast(left);
                leftClass = leftClass.baseClass;
              }
              while (rightClass.baseClass) {
                right = rightClass.upcast(right);
                rightClass = rightClass.baseClass;
              }
              return leftClass === rightClass && left === right;
            },
            "clone"() {
              if (!this.$$.ptr) {
                throwInstanceAlreadyDeleted(this);
              }
              if (this.$$.preservePointerOnDelete) {
                this.$$.count.value += 1;
                return this;
              } else {
                var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
                  $$: {
                    value: shallowCopyInternalPointer(this.$$)
                  }
                }));
                clone.$$.count.value += 1;
                clone.$$.deleteScheduled = false;
                return clone;
              }
            },
            "delete"() {
              if (!this.$$.ptr) {
                throwInstanceAlreadyDeleted(this);
              }
              if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
                throwBindingError("Object already scheduled for deletion");
              }
              detachFinalizer(this);
              releaseClassHandle(this.$$);
              if (!this.$$.preservePointerOnDelete) {
                this.$$.smartPtr = void 0;
                this.$$.ptr = void 0;
              }
            },
            "isDeleted"() {
              return !this.$$.ptr;
            },
            "deleteLater"() {
              if (!this.$$.ptr) {
                throwInstanceAlreadyDeleted(this);
              }
              if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
                throwBindingError("Object already scheduled for deletion");
              }
              deletionQueue.push(this);
              if (deletionQueue.length === 1 && delayFunction) {
                delayFunction(flushPendingDeletes);
              }
              this.$$.deleteScheduled = true;
              return this;
            }
          });
        };
        function ClassHandle() {
        }
        var createNamedFunction = (name, body) => Object.defineProperty(body, "name", {
          value: name
        });
        var ensureOverloadTable = (proto, methodName, humanName) => {
          if (void 0 === proto[methodName].overloadTable) {
            var prevFunc = proto[methodName];
            proto[methodName] = function() {
              if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${arguments.length}) - expects one of (${proto[methodName].overloadTable})!`);
              }
              return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
            };
            proto[methodName].overloadTable = [];
            proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
          }
        };
        var exposePublicSymbol = (name, value, numArguments) => {
          if (Module.hasOwnProperty(name)) {
            if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) {
              throwBindingError(`Cannot register public name '${name}' twice`);
            }
            ensureOverloadTable(Module, name, name);
            if (Module.hasOwnProperty(numArguments)) {
              throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
            }
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            if (void 0 !== numArguments) {
              Module[name].numArguments = numArguments;
            }
          }
        };
        var char_0 = 48;
        var char_9 = 57;
        var makeLegalFunctionName = (name) => {
          if (void 0 === name) {
            return "_unknown";
          }
          name = name.replace(/[^a-zA-Z0-9_]/g, "$");
          var f = name.charCodeAt(0);
          if (f >= char_0 && f <= char_9) {
            return `_${name}`;
          }
          return name;
        };
        function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
          this.name = name;
          this.constructor = constructor;
          this.instancePrototype = instancePrototype;
          this.rawDestructor = rawDestructor;
          this.baseClass = baseClass;
          this.getActualType = getActualType;
          this.upcast = upcast;
          this.downcast = downcast;
          this.pureVirtualFunctions = [];
        }
        var upcastPointer = (ptr, ptrClass, desiredClass) => {
          while (ptrClass !== desiredClass) {
            if (!ptrClass.upcast) {
              throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
            }
            ptr = ptrClass.upcast(ptr);
            ptrClass = ptrClass.baseClass;
          }
          return ptr;
        };
        function constNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) {
              throwBindingError(`null is not a valid ${this.name}`);
            }
            return 0;
          }
          if (!handle.$$) {
            throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          }
          if (!handle.$$.ptr) {
            throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function genericPointerToWireType(destructors, handle) {
          var ptr;
          if (handle === null) {
            if (this.isReference) {
              throwBindingError(`null is not a valid ${this.name}`);
            }
            if (this.isSmartPointer) {
              ptr = this.rawConstructor();
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
              return ptr;
            } else {
              return 0;
            }
          }
          if (!handle || !handle.$$) {
            throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          }
          if (!handle.$$.ptr) {
            throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          }
          if (!this.isConst && handle.$$.ptrType.isConst) {
            throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          if (this.isSmartPointer) {
            if (void 0 === handle.$$.smartPtr) {
              throwBindingError("Passing raw pointer to smart pointer is illegal");
            }
            switch (this.sharingPolicy) {
              case 0:
                if (handle.$$.smartPtrType === this) {
                  ptr = handle.$$.smartPtr;
                } else {
                  throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
                }
                break;
              case 1:
                ptr = handle.$$.smartPtr;
                break;
              case 2:
                if (handle.$$.smartPtrType === this) {
                  ptr = handle.$$.smartPtr;
                } else {
                  var clonedHandle = handle["clone"]();
                  ptr = this.rawShare(
                    ptr,
                    Emval.toHandle(() => clonedHandle["delete"]())
                  );
                  if (destructors !== null) {
                    destructors.push(this.rawDestructor, ptr);
                  }
                }
                break;
              default:
                throwBindingError("Unsupporting sharing policy");
            }
          }
          return ptr;
        }
        function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) {
              throwBindingError(`null is not a valid ${this.name}`);
            }
            return 0;
          }
          if (!handle.$$) {
            throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          }
          if (!handle.$$.ptr) {
            throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          }
          if (handle.$$.ptrType.isConst) {
            throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function readPointer(pointer) {
          return this["fromWireType"](HEAPU32[pointer >> 2]);
        }
        var init_RegisteredPointer = () => {
          Object.assign(RegisteredPointer.prototype, {
            getPointee(ptr) {
              if (this.rawGetPointee) {
                ptr = this.rawGetPointee(ptr);
              }
              return ptr;
            },
            destructor(ptr) {
              this.rawDestructor?.(ptr);
            },
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": readPointer,
            "fromWireType": RegisteredPointer_fromWireType
          });
        };
        function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
          this.name = name;
          this.registeredClass = registeredClass;
          this.isReference = isReference;
          this.isConst = isConst;
          this.isSmartPointer = isSmartPointer;
          this.pointeeType = pointeeType;
          this.sharingPolicy = sharingPolicy;
          this.rawGetPointee = rawGetPointee;
          this.rawConstructor = rawConstructor;
          this.rawShare = rawShare;
          this.rawDestructor = rawDestructor;
          if (!isSmartPointer && registeredClass.baseClass === void 0) {
            if (isConst) {
              this["toWireType"] = constNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
            } else {
              this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
            }
          } else {
            this["toWireType"] = genericPointerToWireType;
          }
        }
        var replacePublicSymbol = (name, value, numArguments) => {
          if (!Module.hasOwnProperty(name)) {
            throwInternalError("Replacing nonexistant public symbol");
          }
          if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) {
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            Module[name].argCount = numArguments;
          }
        };
        var wasmTableMirror = [];
        var wasmTable;
        var getWasmTableEntry = (funcPtr) => {
          var func = wasmTableMirror[funcPtr];
          if (!func) {
            if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
            wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
          }
          assert3(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
          return func;
        };
        var embind__requireFunction = (signature, rawFunction) => {
          signature = readLatin1String(signature);
          function makeDynCaller() {
            return getWasmTableEntry(rawFunction);
          }
          var fp = makeDynCaller();
          if (typeof fp != "function") {
            throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
          }
          return fp;
        };
        var extendError = (baseErrorType, errorName) => {
          var errorClass = createNamedFunction(errorName, function(message) {
            this.name = errorName;
            this.message = message;
            var stack = new Error(message).stack;
            if (stack !== void 0) {
              this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
            }
          });
          errorClass.prototype = Object.create(baseErrorType.prototype);
          errorClass.prototype.constructor = errorClass;
          errorClass.prototype.toString = function() {
            if (this.message === void 0) {
              return this.name;
            } else {
              return `${this.name}: ${this.message}`;
            }
          };
          return errorClass;
        };
        var UnboundTypeError;
        var getTypeName = (type2) => {
          var ptr = ___getTypeName(type2);
          var rv = readLatin1String(ptr);
          _free(ptr);
          return rv;
        };
        var throwUnboundTypeError = (message, types) => {
          var unboundTypes = [];
          var seen = {};
          function visit(type2) {
            if (seen[type2]) {
              return;
            }
            if (registeredTypes[type2]) {
              return;
            }
            if (typeDependencies[type2]) {
              typeDependencies[type2].forEach(visit);
              return;
            }
            unboundTypes.push(type2);
            seen[type2] = true;
          }
          types.forEach(visit);
          throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
        };
        var __embind_register_class = (rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) => {
          name = readLatin1String(name);
          getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
          upcast &&= embind__requireFunction(upcastSignature, upcast);
          downcast &&= embind__requireFunction(downcastSignature, downcast);
          rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
          var legalFunctionName = makeLegalFunctionName(name);
          exposePublicSymbol(legalFunctionName, function() {
            throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
          });
          whenDependentTypesAreResolved(
            [rawType, rawPointerType, rawConstPointerType],
            baseClassRawType ? [baseClassRawType] : [],
            function(base) {
              base = base[0];
              var baseClass;
              var basePrototype;
              if (baseClassRawType) {
                baseClass = base.registeredClass;
                basePrototype = baseClass.instancePrototype;
              } else {
                basePrototype = ClassHandle.prototype;
              }
              var constructor = createNamedFunction(name, function() {
                if (Object.getPrototypeOf(this) !== instancePrototype) {
                  throw new BindingError("Use 'new' to construct " + name);
                }
                if (void 0 === registeredClass.constructor_body) {
                  throw new BindingError(name + " has no accessible constructor");
                }
                var body = registeredClass.constructor_body[arguments.length];
                if (void 0 === body) {
                  throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
                }
                return body.apply(this, arguments);
              });
              var instancePrototype = Object.create(basePrototype, {
                constructor: { value: constructor }
              });
              constructor.prototype = instancePrototype;
              var registeredClass = new RegisteredClass(
                name,
                constructor,
                instancePrototype,
                rawDestructor,
                baseClass,
                getActualType,
                upcast,
                downcast
              );
              if (registeredClass.baseClass) {
                registeredClass.baseClass.__derivedClasses ??= [];
                registeredClass.baseClass.__derivedClasses.push(registeredClass);
              }
              var referenceConverter = new RegisteredPointer(
                name,
                registeredClass,
                true,
                false,
                false
              );
              var pointerConverter = new RegisteredPointer(
                name + "*",
                registeredClass,
                false,
                false,
                false
              );
              var constPointerConverter = new RegisteredPointer(
                name + " const*",
                registeredClass,
                false,
                true,
                false
              );
              registeredPointers[rawType] = {
                pointerType: pointerConverter,
                constPointerType: constPointerConverter
              };
              replacePublicSymbol(legalFunctionName, constructor);
              return [referenceConverter, pointerConverter, constPointerConverter];
            }
          );
        };
        var heap32VectorToArray = (count, firstElement) => {
          var array2 = [];
          for (var i2 = 0; i2 < count; i2++) {
            array2.push(HEAPU32[firstElement + i2 * 4 >> 2]);
          }
          return array2;
        };
        function usesDestructorStack(argTypes) {
          for (var i2 = 1; i2 < argTypes.length; ++i2) {
            if (argTypes[i2] !== null && argTypes[i2].destructorFunction === void 0) {
              return true;
            }
          }
          return false;
        }
        function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
          var argCount = argTypes.length;
          if (argCount < 2) {
            throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
          }
          assert3(!isAsync, "Async bindings are only supported with JSPI.");
          var isClassMethodFunc = argTypes[1] !== null && classType !== null;
          var needsDestructorStack = usesDestructorStack(argTypes);
          var returns = argTypes[0].name !== "void";
          var expectedArgCount = argCount - 2;
          var argsWired = new Array(expectedArgCount);
          var invokerFuncArgs = [];
          var destructors = [];
          var invokerFn = function() {
            if (arguments.length !== expectedArgCount) {
              throwBindingError(`function ${humanName} called with ${arguments.length} arguments, expected ${expectedArgCount}`);
            }
            destructors.length = 0;
            var thisWired;
            invokerFuncArgs.length = isClassMethodFunc ? 2 : 1;
            invokerFuncArgs[0] = cppTargetFunc;
            if (isClassMethodFunc) {
              thisWired = argTypes[1]["toWireType"](destructors, this);
              invokerFuncArgs[1] = thisWired;
            }
            for (var i2 = 0; i2 < expectedArgCount; ++i2) {
              argsWired[i2] = argTypes[i2 + 2]["toWireType"](destructors, arguments[i2]);
              invokerFuncArgs.push(argsWired[i2]);
            }
            var rv = cppInvokerFunc.apply(null, invokerFuncArgs);
            function onDone(rv2) {
              if (needsDestructorStack) {
                runDestructors(destructors);
              } else {
                for (var i3 = isClassMethodFunc ? 1 : 2; i3 < argTypes.length; i3++) {
                  var param = i3 === 1 ? thisWired : argsWired[i3 - 2];
                  if (argTypes[i3].destructorFunction !== null) {
                    argTypes[i3].destructorFunction(param);
                  }
                }
              }
              if (returns) {
                return argTypes[0]["fromWireType"](rv2);
              }
            }
            return onDone(rv);
          };
          return createNamedFunction(humanName, invokerFn);
        }
        var __embind_register_class_constructor = (rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) => {
          assert3(argCount > 0);
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          invoker = embind__requireFunction(invokerSignature, invoker);
          var args = [rawConstructor];
          var destructors = [];
          whenDependentTypesAreResolved([], [rawClassType], function(classType) {
            classType = classType[0];
            var humanName = `constructor ${classType.name}`;
            if (void 0 === classType.registeredClass.constructor_body) {
              classType.registeredClass.constructor_body = [];
            }
            if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
              throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
            }
            classType.registeredClass.constructor_body[argCount - 1] = () => {
              throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
            };
            whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
              argTypes.splice(1, 0, null);
              classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
              return [];
            });
            return [];
          });
        };
        var getFunctionName = (signature) => {
          signature = signature.trim();
          const argsIndex = signature.indexOf("(");
          if (argsIndex !== -1) {
            assert3(signature[signature.length - 1] == ")", "Parentheses for argument names should match.");
            return signature.substr(0, argsIndex);
          } else {
            return signature;
          }
        };
        var __embind_register_class_function = (rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual, isAsync) => {
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          methodName = readLatin1String(methodName);
          methodName = getFunctionName(methodName);
          rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
          whenDependentTypesAreResolved([], [rawClassType], function(classType) {
            classType = classType[0];
            var humanName = `${classType.name}.${methodName}`;
            if (methodName.startsWith("@@")) {
              methodName = Symbol[methodName.substring(2)];
            }
            if (isPureVirtual) {
              classType.registeredClass.pureVirtualFunctions.push(methodName);
            }
            function unboundTypesHandler() {
              throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
            }
            var proto = classType.registeredClass.instancePrototype;
            var method = proto[methodName];
            if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
              unboundTypesHandler.argCount = argCount - 2;
              unboundTypesHandler.className = classType.name;
              proto[methodName] = unboundTypesHandler;
            } else {
              ensureOverloadTable(proto, methodName, humanName);
              proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
            }
            whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
              var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
              if (void 0 === proto[methodName].overloadTable) {
                memberFunction.argCount = argCount - 2;
                proto[methodName] = memberFunction;
              } else {
                proto[methodName].overloadTable[argCount - 2] = memberFunction;
              }
              return [];
            });
            return [];
          });
        };
        class HandleAllocator {
          constructor() {
            this.allocated = [void 0];
            this.freelist = [];
          }
          get(id) {
            assert3(this.allocated[id] !== void 0, `invalid handle: ${id}`);
            return this.allocated[id];
          }
          has(id) {
            return this.allocated[id] !== void 0;
          }
          allocate(handle) {
            var id = this.freelist.pop() || this.allocated.length;
            this.allocated[id] = handle;
            return id;
          }
          free(id) {
            assert3(this.allocated[id] !== void 0);
            this.allocated[id] = void 0;
            this.freelist.push(id);
          }
        }
        var emval_handles = new HandleAllocator();
        ;
        var __emval_decref = (handle) => {
          if (handle >= emval_handles.reserved && 0 === --emval_handles.get(handle).refcount) {
            emval_handles.free(handle);
          }
        };
        var count_emval_handles = () => {
          var count = 0;
          for (var i2 = emval_handles.reserved; i2 < emval_handles.allocated.length; ++i2) {
            if (emval_handles.allocated[i2] !== void 0) {
              ++count;
            }
          }
          return count;
        };
        var init_emval = () => {
          emval_handles.allocated.push(
            { value: void 0 },
            { value: null },
            { value: true },
            { value: false }
          );
          Object.assign(
            emval_handles,
            /** @lends {emval_handles} */
            { reserved: emval_handles.allocated.length }
          ), Module["count_emval_handles"] = count_emval_handles;
        };
        var Emval = {
          toValue: (handle) => {
            if (!handle) {
              throwBindingError("Cannot use deleted val. handle = " + handle);
            }
            return emval_handles.get(handle).value;
          },
          toHandle: (value) => {
            switch (value) {
              case void 0:
                return 1;
              case null:
                return 2;
              case true:
                return 3;
              case false:
                return 4;
              default: {
                return emval_handles.allocate({ refcount: 1, value });
              }
            }
          }
        };
        var EmValType = {
          name: "emscripten::val",
          "fromWireType": (handle) => {
            var rv = Emval.toValue(handle);
            __emval_decref(handle);
            return rv;
          },
          "toWireType": (destructors, value) => Emval.toHandle(value),
          "argPackAdvance": GenericWireTypeSize,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: null
          // This type does not need a destructor
          // TODO: do we need a deleteObject here?  write a test where
          // emval is passed into JS via an interface
        };
        var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
        var enumReadValueFromPointer = (name, width, signed) => {
          switch (width) {
            case 1:
              return signed ? function(pointer) {
                return this["fromWireType"](HEAP8[pointer >> 0]);
              } : function(pointer) {
                return this["fromWireType"](HEAPU8[pointer >> 0]);
              };
            case 2:
              return signed ? function(pointer) {
                return this["fromWireType"](HEAP16[pointer >> 1]);
              } : function(pointer) {
                return this["fromWireType"](HEAPU16[pointer >> 1]);
              };
            case 4:
              return signed ? function(pointer) {
                return this["fromWireType"](HEAP32[pointer >> 2]);
              } : function(pointer) {
                return this["fromWireType"](HEAPU32[pointer >> 2]);
              };
            default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
          }
        };
        var __embind_register_enum = (rawType, name, size, isSigned) => {
          name = readLatin1String(name);
          function ctor() {
          }
          ctor.values = {};
          registerType(rawType, {
            name,
            constructor: ctor,
            "fromWireType": function(c) {
              return this.constructor.values[c];
            },
            "toWireType": (destructors, c) => c.value,
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": enumReadValueFromPointer(name, size, isSigned),
            destructorFunction: null
          });
          exposePublicSymbol(name, ctor);
        };
        var requireRegisteredType = (rawType, humanName) => {
          var impl = registeredTypes[rawType];
          if (void 0 === impl) {
            throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
          }
          return impl;
        };
        var __embind_register_enum_value = (rawEnumType, name, enumValue) => {
          var enumType = requireRegisteredType(rawEnumType, "enum");
          name = readLatin1String(name);
          var Enum = enumType.constructor;
          var Value = Object.create(enumType.constructor.prototype, {
            value: { value: enumValue },
            constructor: { value: createNamedFunction(`${enumType.name}_${name}`, function() {
            }) }
          });
          Enum.values[enumValue] = Value;
          Enum[name] = Value;
        };
        var floatReadValueFromPointer = (name, width) => {
          switch (width) {
            case 4:
              return function(pointer) {
                return this["fromWireType"](HEAPF32[pointer >> 2]);
              };
            case 8:
              return function(pointer) {
                return this["fromWireType"](HEAPF64[pointer >> 3]);
              };
            default:
              throw new TypeError(`invalid float width (${width}): ${name}`);
          }
        };
        var __embind_register_float = (rawType, name, size) => {
          name = readLatin1String(name);
          registerType(rawType, {
            name,
            "fromWireType": (value) => value,
            "toWireType": (destructors, value) => {
              if (typeof value != "number" && typeof value != "boolean") {
                throw new TypeError(`Cannot convert ${embindRepr(value)} to ${this.name}`);
              }
              return value;
            },
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": floatReadValueFromPointer(name, size),
            destructorFunction: null
            // This type does not need a destructor
          });
        };
        var __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) => {
          var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          name = readLatin1String(name);
          name = getFunctionName(name);
          rawInvoker = embind__requireFunction(signature, rawInvoker);
          exposePublicSymbol(name, function() {
            throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
          }, argCount - 1);
          whenDependentTypesAreResolved([], argTypes, function(argTypes2) {
            var invokerArgsArray = [
              argTypes2[0],
              null
              /* no class 'this'*/
            ].concat(
              argTypes2.slice(1)
              /* actual params */
            );
            replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
            return [];
          });
        };
        var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
          name = readLatin1String(name);
          if (maxRange === -1) {
            maxRange = 4294967295;
          }
          var fromWireType = (value) => value;
          if (minRange === 0) {
            var bitshift = 32 - 8 * size;
            fromWireType = (value) => value << bitshift >>> bitshift;
          }
          var isUnsignedType = name.includes("unsigned");
          var checkAssertions = (value, toTypeName) => {
            if (typeof value != "number" && typeof value != "boolean") {
              throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${toTypeName}`);
            }
            if (value < minRange || value > maxRange) {
              throw new TypeError(`Passing a number "${embindRepr(value)}" from JS side to C/C++ side to an argument of type "${name}", which is outside the valid range [${minRange}, ${maxRange}]!`);
            }
          };
          var toWireType;
          if (isUnsignedType) {
            toWireType = function(destructors, value) {
              checkAssertions(value, this.name);
              return value >>> 0;
            };
          } else {
            toWireType = function(destructors, value) {
              checkAssertions(value, this.name);
              return value;
            };
          }
          registerType(primitiveType, {
            name,
            "fromWireType": fromWireType,
            "toWireType": toWireType,
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": integerReadValueFromPointer(name, size, minRange !== 0),
            destructorFunction: null
            // This type does not need a destructor
          });
        };
        var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
          var typeMapping = [
            Int8Array,
            Uint8Array,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array,
            BigInt64Array,
            BigUint64Array
          ];
          var TA = typeMapping[dataTypeIndex];
          function decodeMemoryView(handle) {
            var size = HEAPU32[handle >> 2];
            var data = HEAPU32[handle + 4 >> 2];
            return new TA(HEAP8.buffer, data, size);
          }
          name = readLatin1String(name);
          registerType(rawType, {
            name,
            "fromWireType": decodeMemoryView,
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": decodeMemoryView
          }, {
            ignoreDuplicateRegistrations: true
          });
        };
        var __embind_register_smart_ptr = (rawType, rawPointeeType, name, sharingPolicy, getPointeeSignature, rawGetPointee, constructorSignature, rawConstructor, shareSignature, rawShare, destructorSignature, rawDestructor) => {
          name = readLatin1String(name);
          rawGetPointee = embind__requireFunction(getPointeeSignature, rawGetPointee);
          rawConstructor = embind__requireFunction(constructorSignature, rawConstructor);
          rawShare = embind__requireFunction(shareSignature, rawShare);
          rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
          whenDependentTypesAreResolved([rawType], [rawPointeeType], function(pointeeType) {
            pointeeType = pointeeType[0];
            var registeredPointer = new RegisteredPointer(
              name,
              pointeeType.registeredClass,
              false,
              false,
              // smart pointer properties
              true,
              pointeeType,
              sharingPolicy,
              rawGetPointee,
              rawConstructor,
              rawShare,
              rawDestructor
            );
            return [registeredPointer];
          });
        };
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
          assert3(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        };
        var __embind_register_std_string = (rawType, name) => {
          name = readLatin1String(name);
          var stdStringIsUTF8 = name === "std::string";
          registerType(rawType, {
            name,
            // For some method names we use string keys here since they are part of
            // the public/external API and/or used by the runtime-generated code.
            "fromWireType"(value) {
              var length = HEAPU32[value >> 2];
              var payload = value + 4;
              var str;
              if (stdStringIsUTF8) {
                var decodeStartPtr = payload;
                for (var i2 = 0; i2 <= length; ++i2) {
                  var currentBytePtr = payload + i2;
                  if (i2 == length || HEAPU8[currentBytePtr] == 0) {
                    var maxRead = currentBytePtr - decodeStartPtr;
                    var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                    if (str === void 0) {
                      str = stringSegment;
                    } else {
                      str += String.fromCharCode(0);
                      str += stringSegment;
                    }
                    decodeStartPtr = currentBytePtr + 1;
                  }
                }
              } else {
                var a = new Array(length);
                for (var i2 = 0; i2 < length; ++i2) {
                  a[i2] = String.fromCharCode(HEAPU8[payload + i2]);
                }
                str = a.join("");
              }
              _free(value);
              return str;
            },
            "toWireType"(destructors, value) {
              if (value instanceof ArrayBuffer) {
                value = new Uint8Array(value);
              }
              var length;
              var valueIsOfTypeString = typeof value == "string";
              if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                throwBindingError("Cannot pass non-string to std::string");
              }
              if (stdStringIsUTF8 && valueIsOfTypeString) {
                length = lengthBytesUTF8(value);
              } else {
                length = value.length;
              }
              var base = _malloc(4 + length + 1);
              var ptr = base + 4;
              HEAPU32[base >> 2] = length;
              if (stdStringIsUTF8 && valueIsOfTypeString) {
                stringToUTF8(value, ptr, length + 1);
              } else {
                if (valueIsOfTypeString) {
                  for (var i2 = 0; i2 < length; ++i2) {
                    var charCode = value.charCodeAt(i2);
                    if (charCode > 255) {
                      _free(ptr);
                      throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                    }
                    HEAPU8[ptr + i2] = charCode;
                  }
                } else {
                  for (var i2 = 0; i2 < length; ++i2) {
                    HEAPU8[ptr + i2] = value[i2];
                  }
                }
              }
              if (destructors !== null) {
                destructors.push(_free, base);
              }
              return base;
            },
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": readPointer,
            destructorFunction(ptr) {
              _free(ptr);
            }
          });
        };
        var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
        ;
        var UTF16ToString = (ptr, maxBytesToRead) => {
          assert3(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
          var endPtr = ptr;
          var idx = endPtr >> 1;
          var maxIdx = idx + maxBytesToRead / 2;
          while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
          endPtr = idx << 1;
          if (endPtr - ptr > 32 && UTF16Decoder)
            return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
          var str = "";
          for (var i2 = 0; !(i2 >= maxBytesToRead / 2); ++i2) {
            var codeUnit = HEAP16[ptr + i2 * 2 >> 1];
            if (codeUnit == 0) break;
            str += String.fromCharCode(codeUnit);
          }
          return str;
        };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
          assert3(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
          assert3(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          maxBytesToWrite ??= 2147483647;
          if (maxBytesToWrite < 2) return 0;
          maxBytesToWrite -= 2;
          var startPtr = outPtr;
          var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
          for (var i2 = 0; i2 < numCharsToWrite; ++i2) {
            var codeUnit = str.charCodeAt(i2);
            HEAP16[outPtr >> 1] = codeUnit;
            outPtr += 2;
          }
          HEAP16[outPtr >> 1] = 0;
          return outPtr - startPtr;
        };
        var lengthBytesUTF16 = (str) => {
          return str.length * 2;
        };
        var UTF32ToString = (ptr, maxBytesToRead) => {
          assert3(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
          var i2 = 0;
          var str = "";
          while (!(i2 >= maxBytesToRead / 4)) {
            var utf32 = HEAP32[ptr + i2 * 4 >> 2];
            if (utf32 == 0) break;
            ++i2;
            if (utf32 >= 65536) {
              var ch = utf32 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            } else {
              str += String.fromCharCode(utf32);
            }
          }
          return str;
        };
        var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
          assert3(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
          assert3(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          maxBytesToWrite ??= 2147483647;
          if (maxBytesToWrite < 4) return 0;
          var startPtr = outPtr;
          var endPtr = startPtr + maxBytesToWrite - 4;
          for (var i2 = 0; i2 < str.length; ++i2) {
            var codeUnit = str.charCodeAt(i2);
            if (codeUnit >= 55296 && codeUnit <= 57343) {
              var trailSurrogate = str.charCodeAt(++i2);
              codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
            }
            HEAP32[outPtr >> 2] = codeUnit;
            outPtr += 4;
            if (outPtr + 4 > endPtr) break;
          }
          HEAP32[outPtr >> 2] = 0;
          return outPtr - startPtr;
        };
        var lengthBytesUTF32 = (str) => {
          var len = 0;
          for (var i2 = 0; i2 < str.length; ++i2) {
            var codeUnit = str.charCodeAt(i2);
            if (codeUnit >= 55296 && codeUnit <= 57343) ++i2;
            len += 4;
          }
          return len;
        };
        var __embind_register_std_wstring = (rawType, charSize, name) => {
          name = readLatin1String(name);
          var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
          if (charSize === 2) {
            decodeString = UTF16ToString;
            encodeString = stringToUTF16;
            lengthBytesUTF = lengthBytesUTF16;
            getHeap = () => HEAPU16;
            shift = 1;
          } else if (charSize === 4) {
            decodeString = UTF32ToString;
            encodeString = stringToUTF32;
            lengthBytesUTF = lengthBytesUTF32;
            getHeap = () => HEAPU32;
            shift = 2;
          }
          registerType(rawType, {
            name,
            "fromWireType": (value) => {
              var length = HEAPU32[value >> 2];
              var HEAP2 = getHeap();
              var str;
              var decodeStartPtr = value + 4;
              for (var i2 = 0; i2 <= length; ++i2) {
                var currentBytePtr = value + 4 + i2 * charSize;
                if (i2 == length || HEAP2[currentBytePtr >> shift] == 0) {
                  var maxReadBytes = currentBytePtr - decodeStartPtr;
                  var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                  if (str === void 0) {
                    str = stringSegment;
                  } else {
                    str += String.fromCharCode(0);
                    str += stringSegment;
                  }
                  decodeStartPtr = currentBytePtr + charSize;
                }
              }
              _free(value);
              return str;
            },
            "toWireType": (destructors, value) => {
              if (!(typeof value == "string")) {
                throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
              }
              var length = lengthBytesUTF(value);
              var ptr = _malloc(4 + length + charSize);
              HEAPU32[ptr >> 2] = length >> shift;
              encodeString(value, ptr + 4, length + charSize);
              if (destructors !== null) {
                destructors.push(_free, ptr);
              }
              return ptr;
            },
            "argPackAdvance": GenericWireTypeSize,
            "readValueFromPointer": simpleReadValueFromPointer,
            destructorFunction(ptr) {
              _free(ptr);
            }
          });
        };
        var __embind_register_value_array = (rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) => {
          tupleRegistrations[rawType] = {
            name: readLatin1String(name),
            rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
            rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
            elements: []
          };
        };
        var __embind_register_value_array_element = (rawTupleType, getterReturnType, getterSignature, getter2, getterContext, setterArgumentType, setterSignature, setter2, setterContext) => {
          tupleRegistrations[rawTupleType].elements.push({
            getterReturnType,
            getter: embind__requireFunction(getterSignature, getter2),
            getterContext,
            setterArgumentType,
            setter: embind__requireFunction(setterSignature, setter2),
            setterContext
          });
        };
        var __embind_register_value_object = (rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) => {
          structRegistrations[rawType] = {
            name: readLatin1String(name),
            rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
            rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
            fields: []
          };
        };
        var __embind_register_value_object_field = (structType, fieldName, getterReturnType, getterSignature, getter2, getterContext, setterArgumentType, setterSignature, setter2, setterContext) => {
          structRegistrations[structType].fields.push({
            fieldName: readLatin1String(fieldName),
            getterReturnType,
            getter: embind__requireFunction(getterSignature, getter2),
            getterContext,
            setterArgumentType,
            setter: embind__requireFunction(setterSignature, setter2),
            setterContext
          });
        };
        var __embind_register_void = (rawType, name) => {
          name = readLatin1String(name);
          registerType(rawType, {
            isVoid: true,
            // void return values can be optimized out sometimes
            name,
            "argPackAdvance": 0,
            "fromWireType": () => void 0,
            // TODO: assert if anything else is given?
            "toWireType": (destructors, o) => void 0
          });
        };
        var nowIsMonotonic = 1;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        var __emscripten_throw_longjmp = () => {
          throw Infinity;
        };
        var emval_returnValue = (returnType, destructorsRef, handle) => {
          var destructors = [];
          var result = returnType["toWireType"](destructors, handle);
          if (destructors.length) {
            HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
          }
          return result;
        };
        var __emval_as = (handle, returnType, destructorsRef) => {
          handle = Emval.toValue(handle);
          returnType = requireRegisteredType(returnType, "emval::as");
          return emval_returnValue(returnType, destructorsRef, handle);
        };
        var emval_methodCallers = [];
        var __emval_call = (caller, handle, destructorsRef, args) => {
          caller = emval_methodCallers[caller];
          handle = Emval.toValue(handle);
          return caller(null, handle, destructorsRef, args);
        };
        var emval_symbols = {};
        var getStringOrSymbol = (address) => {
          var symbol = emval_symbols[address];
          if (symbol === void 0) {
            return readLatin1String(address);
          }
          return symbol;
        };
        var __emval_call_method = (caller, objHandle, methodName, destructorsRef, args) => {
          caller = emval_methodCallers[caller];
          objHandle = Emval.toValue(objHandle);
          methodName = getStringOrSymbol(methodName);
          return caller(objHandle, objHandle[methodName], destructorsRef, args);
        };
        var __emval_equals = (first, second) => {
          first = Emval.toValue(first);
          second = Emval.toValue(second);
          return first == second;
        };
        var emval_get_global = () => {
          if (typeof globalThis == "object") {
            return globalThis;
          }
          function testGlobal(obj) {
            obj["$$$embind_global$$$"] = obj;
            var success = typeof $$$embind_global$$$ == "object" && obj["$$$embind_global$$$"] == obj;
            if (!success) {
              delete obj["$$$embind_global$$$"];
            }
            return success;
          }
          if (typeof $$$embind_global$$$ == "object") {
            return $$$embind_global$$$;
          }
          if (typeof global == "object" && testGlobal(global)) {
            $$$embind_global$$$ = global;
          } else if (typeof self == "object" && testGlobal(self)) {
            $$$embind_global$$$ = self;
          }
          if (typeof $$$embind_global$$$ == "object") {
            return $$$embind_global$$$;
          }
          throw Error("unable to get global object.");
        };
        var __emval_get_global = (name) => {
          if (name === 0) {
            return Emval.toHandle(emval_get_global());
          } else {
            name = getStringOrSymbol(name);
            return Emval.toHandle(emval_get_global()[name]);
          }
        };
        var emval_addMethodCaller = (caller) => {
          var id = emval_methodCallers.length;
          emval_methodCallers.push(caller);
          return id;
        };
        var emval_lookupTypes = (argCount, argTypes) => {
          var a = new Array(argCount);
          for (var i2 = 0; i2 < argCount; ++i2) {
            a[i2] = requireRegisteredType(
              HEAPU32[argTypes + i2 * 4 >> 2],
              "parameter " + i2
            );
          }
          return a;
        };
        var reflectConstruct = Reflect.construct;
        var __emval_get_method_caller = (argCount, argTypes, kind) => {
          var types = emval_lookupTypes(argCount, argTypes);
          var retType = types.shift();
          argCount--;
          var argN = new Array(argCount);
          var invokerFunction = (obj, func, destructorsRef, args) => {
            var offset = 0;
            for (var i2 = 0; i2 < argCount; ++i2) {
              argN[i2] = types[i2]["readValueFromPointer"](args + offset);
              offset += types[i2]["argPackAdvance"];
            }
            var rv = kind === /* CONSTRUCTOR */
            1 ? reflectConstruct(func, argN) : func.apply(obj, argN);
            return emval_returnValue(retType, destructorsRef, rv);
          };
          var functionName = `methodCaller<(${types.map((t) => t.name).join(", ")}) => ${retType.name}>`;
          return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
        };
        var __emval_get_property = (handle, key) => {
          handle = Emval.toValue(handle);
          key = Emval.toValue(key);
          return Emval.toHandle(handle[key]);
        };
        var __emval_incref = (handle) => {
          if (handle > 4) {
            emval_handles.get(handle).refcount += 1;
          }
        };
        var __emval_instanceof = (object2, constructor) => {
          object2 = Emval.toValue(object2);
          constructor = Emval.toValue(constructor);
          return object2 instanceof constructor;
        };
        var __emval_is_number = (handle) => {
          handle = Emval.toValue(handle);
          return typeof handle == "number";
        };
        var __emval_is_string = (handle) => {
          handle = Emval.toValue(handle);
          return typeof handle == "string";
        };
        var __emval_new_array = () => Emval.toHandle([]);
        var __emval_new_cstring = (v) => Emval.toHandle(getStringOrSymbol(v));
        var __emval_new_object = () => Emval.toHandle({});
        var __emval_run_destructors = (handle) => {
          var destructors = Emval.toValue(handle);
          runDestructors(destructors);
          __emval_decref(handle);
        };
        var __emval_set_property = (handle, key, value) => {
          handle = Emval.toValue(handle);
          key = Emval.toValue(key);
          value = Emval.toValue(value);
          handle[key] = value;
        };
        var __emval_take_value = (type2, arg) => {
          type2 = requireRegisteredType(type2, "_emval_take_value");
          var v = type2["readValueFromPointer"](arg);
          return Emval.toHandle(v);
        };
        var __emval_throw = (object2) => {
          object2 = Emval.toValue(object2);
          throw object2;
        };
        var __emval_typeof = (handle) => {
          handle = Emval.toValue(handle);
          return Emval.toHandle(typeof handle);
        };
        var MAX_INT53 = 9007199254740992;
        var MIN_INT53 = -9007199254740992;
        var bigintToI53Checked = (num) => num < MIN_INT53 || num > MAX_INT53 ? NaN : Number(num);
        function __gmtime_js(time, tmPtr) {
          time = bigintToI53Checked(time);
          ;
          var date = new Date(time * 1e3);
          HEAP32[tmPtr >> 2] = date.getUTCSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
          HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
          HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
          var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
          var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          ;
        }
        var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = (date) => {
          var leap = isLeapYear(date.getFullYear());
          var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
          var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
          return yday;
        };
        function __localtime_js(time, tmPtr) {
          time = bigintToI53Checked(time);
          ;
          var date = new Date(time * 1e3);
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          var yday = ydayFromDate(date) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >> 2] = dst;
          ;
        }
        var __mktime_js = function(tmPtr) {
          var ret = (() => {
            var date = new Date(
              HEAP32[tmPtr + 20 >> 2] + 1900,
              HEAP32[tmPtr + 16 >> 2],
              HEAP32[tmPtr + 12 >> 2],
              HEAP32[tmPtr + 8 >> 2],
              HEAP32[tmPtr + 4 >> 2],
              HEAP32[tmPtr >> 2],
              0
            );
            var dst = HEAP32[tmPtr + 32 >> 2];
            var guessedOffset = date.getTimezoneOffset();
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dstOffset = Math.min(winterOffset, summerOffset);
            if (dst < 0) {
              HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
            } else if (dst > 0 != (dstOffset == guessedOffset)) {
              var nonDstOffset = Math.max(winterOffset, summerOffset);
              var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
              date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
            }
            HEAP32[tmPtr + 24 >> 2] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[tmPtr + 28 >> 2] = yday;
            HEAP32[tmPtr >> 2] = date.getSeconds();
            HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
            HEAP32[tmPtr + 8 >> 2] = date.getHours();
            HEAP32[tmPtr + 12 >> 2] = date.getDate();
            HEAP32[tmPtr + 16 >> 2] = date.getMonth();
            HEAP32[tmPtr + 20 >> 2] = date.getYear();
            var timeMs = date.getTime();
            if (isNaN(timeMs)) {
              return -1;
            }
            return timeMs / 1e3;
          })();
          return BigInt(ret);
        };
        function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
          offset = bigintToI53Checked(offset);
          ;
          try {
            if (isNaN(offset)) return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            var res = FS.mmap(stream, len, offset, prot, flags);
            var ptr = res.ptr;
            HEAP32[allocated >> 2] = res.allocated;
            HEAPU32[addr >> 2] = ptr;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
          ;
        }
        function __munmap_js(addr, len, prot, flags, fd, offset) {
          offset = bigintToI53Checked(offset);
          ;
          try {
            if (isNaN(offset)) return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (prot & 2) {
              SYSCALLS.doMsync(addr, stream, len, flags, offset);
            }
            FS.munmap(stream);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
          ;
        }
        var stringToNewUTF8 = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = _malloc(size);
          if (ret) stringToUTF8(str, ret, size);
          return ret;
        };
        var __tzset_js = (timezone, daylight, tzname) => {
          var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          var winter = new Date(currentYear, 0, 1);
          var summer = new Date(currentYear, 6, 1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
          HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
          function extractZone(date) {
            var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
            return match ? match[1] : "GMT";
          }
          ;
          var winterName = extractZone(winter);
          var summerName = extractZone(summer);
          var winterNamePtr = stringToNewUTF8(winterName);
          var summerNamePtr = stringToNewUTF8(summerName);
          if (summerOffset < winterOffset) {
            HEAPU32[tzname >> 2] = winterNamePtr;
            HEAPU32[tzname + 4 >> 2] = summerNamePtr;
          } else {
            HEAPU32[tzname >> 2] = summerNamePtr;
            HEAPU32[tzname + 4 >> 2] = winterNamePtr;
          }
        };
        var _abort = () => {
          abort("native code called abort()");
        };
        var _emscripten_set_main_loop_timing = (mode, value) => {
          Browser.mainLoop.timingMode = mode;
          Browser.mainLoop.timingValue = value;
          if (!Browser.mainLoop.func) {
            err("emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.");
            return 1;
          }
          if (!Browser.mainLoop.running) {
            Browser.mainLoop.running = true;
          }
          if (mode == 0) {
            Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
              var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
              setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
            };
            Browser.mainLoop.method = "timeout";
          } else if (mode == 1) {
            Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
              Browser.requestAnimationFrame(Browser.mainLoop.runner);
            };
            Browser.mainLoop.method = "rAF";
          } else if (mode == 2) {
            if (typeof Browser.setImmediate == "undefined") {
              if (typeof setImmediate == "undefined") {
                var setImmediates = [];
                var emscriptenMainLoopMessageId = "setimmediate";
                var Browser_setImmediate_messageHandler = (event) => {
                  if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()();
                  }
                };
                addEventListener("message", Browser_setImmediate_messageHandler, true);
                Browser.setImmediate = /** @type{function(function(): ?, ...?): number} */
                function Browser_emulated_setImmediate(func) {
                  setImmediates.push(func);
                  if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === void 0) Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    postMessage({ target: emscriptenMainLoopMessageId });
                  } else postMessage(emscriptenMainLoopMessageId, "*");
                };
              } else {
                Browser.setImmediate = setImmediate;
              }
            }
            Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
              Browser.setImmediate(Browser.mainLoop.runner);
            };
            Browser.mainLoop.method = "immediate";
          }
          return 0;
        };
        var _emscripten_get_now;
        _emscripten_get_now = () => performance.now();
        ;
        var setMainLoop = (browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
          assert3(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
          Browser.mainLoop.func = browserIterationFunc;
          Browser.mainLoop.arg = arg;
          var thisMainLoopId = (() => Browser.mainLoop.currentlyRunningMainloop)();
          function checkIsRunning() {
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
              return false;
            }
            return true;
          }
          Browser.mainLoop.running = false;
          Browser.mainLoop.runner = function Browser_mainLoop_runner() {
            if (ABORT) return;
            if (Browser.mainLoop.queue.length > 0) {
              var start = Date.now();
              var blocker = Browser.mainLoop.queue.shift();
              blocker.func(blocker.arg);
              if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                  Browser.mainLoop.remainingBlockers = next;
                } else {
                  next = next + 0.5;
                  Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
                }
              }
              Browser.mainLoop.updateStatus();
              if (!checkIsRunning()) return;
              setTimeout(Browser.mainLoop.runner, 0);
              return;
            }
            if (!checkIsRunning()) return;
            Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
            if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
              Browser.mainLoop.scheduler();
              return;
            } else if (Browser.mainLoop.timingMode == 0) {
              Browser.mainLoop.tickStartTime = _emscripten_get_now();
            }
            if (Browser.mainLoop.method === "timeout" && Module.ctx) {
              warnOnce("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
              Browser.mainLoop.method = "";
            }
            Browser.mainLoop.runIter(browserIterationFunc);
            checkStackCookie();
            if (!checkIsRunning()) return;
            if (typeof SDL == "object") SDL.audio?.queueNewAudioData?.();
            Browser.mainLoop.scheduler();
          };
          if (!noSetTiming) {
            if (fps && fps > 0) {
              _emscripten_set_main_loop_timing(0, 1e3 / fps);
            } else {
              _emscripten_set_main_loop_timing(1, 1);
            }
            Browser.mainLoop.scheduler();
          }
          if (simulateInfiniteLoop) {
            throw "unwind";
          }
        };
        var handleException = (e) => {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          checkStackCookie();
          if (e instanceof WebAssembly.RuntimeError) {
            if (_emscripten_stack_get_current() <= 0) {
              err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)");
            }
          }
          quit_(1, e);
        };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code) => {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            Module["onExit"]?.(code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        };
        var exitJS = (status, implicit) => {
          EXITSTATUS = status;
          checkUnflushedContent();
          if (keepRuntimeAlive() && !implicit) {
            var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
            readyPromiseReject(msg);
            err(msg);
          }
          _proc_exit(status);
        };
        var _exit = exitJS;
        var maybeExit = () => {
          if (!keepRuntimeAlive()) {
            try {
              _exit(EXITSTATUS);
            } catch (e) {
              handleException(e);
            }
          }
        };
        var callUserCallback = (func) => {
          if (ABORT) {
            err("user callback triggered after runtime exited or application aborted.  Ignoring.");
            return;
          }
          try {
            func();
            maybeExit();
          } catch (e) {
            handleException(e);
          }
        };
        var safeSetTimeout = (func, timeout) => {
          return setTimeout(() => {
            callUserCallback(func);
          }, timeout);
        };
        var Browser = {
          mainLoop: {
            running: false,
            scheduler: null,
            method: "",
            currentlyRunningMainloop: 0,
            func: null,
            arg: 0,
            timingMode: 0,
            timingValue: 0,
            currentFrameNumber: 0,
            queue: [],
            pause() {
              Browser.mainLoop.scheduler = null;
              Browser.mainLoop.currentlyRunningMainloop++;
            },
            resume() {
              Browser.mainLoop.currentlyRunningMainloop++;
              var timingMode = Browser.mainLoop.timingMode;
              var timingValue = Browser.mainLoop.timingValue;
              var func = Browser.mainLoop.func;
              Browser.mainLoop.func = null;
              setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
              _emscripten_set_main_loop_timing(timingMode, timingValue);
              Browser.mainLoop.scheduler();
            },
            updateStatus() {
              if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                  if (remaining < expected) {
                    Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")");
                  } else {
                    Module["setStatus"](message);
                  }
                } else {
                  Module["setStatus"]("");
                }
              }
            },
            runIter(func) {
              if (ABORT) return;
              if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                  return;
                }
              }
              callUserCallback(func);
              Module["postMainLoop"]?.();
            }
          },
          isFullscreen: false,
          pointerLock: false,
          moduleContextCreatedCallbacks: [],
          workers: [],
          init() {
            if (Browser.initted) return;
            Browser.initted = true;
            var imagePlugin = {};
            imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
              return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
            };
            imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) {
                b = new Blob([new Uint8Array(byteArray).buffer], { type: Browser.getMimetype(name) });
              }
              var url = URL.createObjectURL(b);
              assert3(typeof url == "string", "createObjectURL must return a url as a string");
              var img = new Image();
              img.onload = () => {
                assert3(img.complete, `Image ${name} could not be decoded`);
                var canvas2 = (
                  /** @type {!HTMLCanvasElement} */
                  document.createElement("canvas")
                );
                canvas2.width = img.width;
                canvas2.height = img.height;
                var ctx = canvas2.getContext("2d");
                ctx.drawImage(img, 0, 0);
                preloadedImages[name] = canvas2;
                URL.revokeObjectURL(url);
                onload?.(byteArray);
              };
              img.onerror = (event) => {
                err(`Image ${url} could not be decoded`);
                onerror?.();
              };
              img.src = url;
            };
            preloadPlugins.push(imagePlugin);
            var audioPlugin = {};
            audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
              return !Module.noAudioDecoding && name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 };
            };
            audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
              var done = false;
              function finish(audio2) {
                if (done) return;
                done = true;
                preloadedAudios[name] = audio2;
                onload?.(byteArray);
              }
              function fail() {
                if (done) return;
                done = true;
                preloadedAudios[name] = new Audio();
                onerror?.();
              }
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              var url = URL.createObjectURL(b);
              assert3(typeof url == "string", "createObjectURL must return a url as a string");
              var audio = new Audio();
              audio.addEventListener("canplaythrough", () => finish(audio), false);
              audio.onerror = function audio_onerror(event) {
                if (done) return;
                err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
                function encode64(data) {
                  var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                  var PAD = "=";
                  var ret = "";
                  var leftchar = 0;
                  var leftbits = 0;
                  for (var i2 = 0; i2 < data.length; i2++) {
                    leftchar = leftchar << 8 | data[i2];
                    leftbits += 8;
                    while (leftbits >= 6) {
                      var curr = leftchar >> leftbits - 6 & 63;
                      leftbits -= 6;
                      ret += BASE[curr];
                    }
                  }
                  if (leftbits == 2) {
                    ret += BASE[(leftchar & 3) << 4];
                    ret += PAD + PAD;
                  } else if (leftbits == 4) {
                    ret += BASE[(leftchar & 15) << 2];
                    ret += PAD;
                  }
                  return ret;
                }
                audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                finish(audio);
              };
              audio.src = url;
              safeSetTimeout(() => {
                finish(audio);
              }, 1e4);
            };
            preloadPlugins.push(audioPlugin);
            function pointerLockChange() {
              Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"];
            }
            var canvas = Module["canvas"];
            if (canvas) {
              canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (() => {
              });
              canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (() => {
              });
              canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
              document.addEventListener("pointerlockchange", pointerLockChange, false);
              document.addEventListener("mozpointerlockchange", pointerLockChange, false);
              document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
              document.addEventListener("mspointerlockchange", pointerLockChange, false);
              if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", (ev) => {
                  if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                    Module["canvas"].requestPointerLock();
                    ev.preventDefault();
                  }
                }, false);
              }
            }
          },
          createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
            if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
            var ctx;
            var contextHandle;
            if (useWebGL) {
              var contextAttributes = {
                antialias: false,
                alpha: false,
                majorVersion: typeof WebGL2RenderingContext != "undefined" ? 2 : 1
              };
              if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                  contextAttributes[attribute] = webGLContextAttributes[attribute];
                }
              }
              if (typeof GL != "undefined") {
                contextHandle = GL.createContext(canvas, contextAttributes);
                if (contextHandle) {
                  ctx = GL.getContext(contextHandle).GLctx;
                }
              }
            } else {
              ctx = canvas.getContext("2d");
            }
            if (!ctx) return null;
            if (setInModule) {
              if (!useWebGL) assert3(typeof GLctx == "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
              Module.ctx = ctx;
              if (useWebGL) GL.makeContextCurrent(contextHandle);
              Module.useWebGL = useWebGL;
              Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
              Browser.init();
            }
            return ctx;
          },
          destroyContext(canvas, useWebGL, setInModule) {
          },
          fullscreenHandlersInstalled: false,
          lockPointer: void 0,
          resizeCanvas: void 0,
          requestFullscreen(lockPointer, resizeCanvas) {
            Browser.lockPointer = lockPointer;
            Browser.resizeCanvas = resizeCanvas;
            if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
            if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
            var canvas = Module["canvas"];
            function fullscreenChange() {
              Browser.isFullscreen = false;
              var canvasContainer2 = canvas.parentNode;
              if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer2) {
                canvas.exitFullscreen = Browser.exitFullscreen;
                if (Browser.lockPointer) canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                  Browser.setFullscreenCanvasSize();
                } else {
                  Browser.updateCanvasDimensions(canvas);
                }
              } else {
                canvasContainer2.parentNode.insertBefore(canvas, canvasContainer2);
                canvasContainer2.parentNode.removeChild(canvasContainer2);
                if (Browser.resizeCanvas) {
                  Browser.setWindowedCanvasSize();
                } else {
                  Browser.updateCanvasDimensions(canvas);
                }
              }
              Module["onFullScreen"]?.(Browser.isFullscreen);
              Module["onFullscreen"]?.(Browser.isFullscreen);
            }
            if (!Browser.fullscreenHandlersInstalled) {
              Browser.fullscreenHandlersInstalled = true;
              document.addEventListener("fullscreenchange", fullscreenChange, false);
              document.addEventListener("mozfullscreenchange", fullscreenChange, false);
              document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
              document.addEventListener("MSFullscreenChange", fullscreenChange, false);
            }
            var canvasContainer = document.createElement("div");
            canvas.parentNode.insertBefore(canvasContainer, canvas);
            canvasContainer.appendChild(canvas);
            canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
            canvasContainer.requestFullscreen();
          },
          requestFullScreen() {
            abort("Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)");
          },
          exitFullscreen() {
            if (!Browser.isFullscreen) {
              return false;
            }
            var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => {
            });
            CFS.apply(document, []);
            return true;
          },
          nextRAF: 0,
          fakeRequestAnimationFrame(func) {
            var now = Date.now();
            if (Browser.nextRAF === 0) {
              Browser.nextRAF = now + 1e3 / 60;
            } else {
              while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60;
              }
            }
            var delay = Math.max(Browser.nextRAF - now, 0);
            setTimeout(func, delay);
          },
          requestAnimationFrame(func) {
            if (typeof requestAnimationFrame == "function") {
              requestAnimationFrame(func);
              return;
            }
            var RAF = Browser.fakeRequestAnimationFrame;
            RAF(func);
          },
          safeSetTimeout(func, timeout) {
            return safeSetTimeout(func, timeout);
          },
          safeRequestAnimationFrame(func) {
            return Browser.requestAnimationFrame(() => {
              callUserCallback(func);
            });
          },
          getMimetype(name) {
            return {
              "jpg": "image/jpeg",
              "jpeg": "image/jpeg",
              "png": "image/png",
              "bmp": "image/bmp",
              "ogg": "audio/ogg",
              "wav": "audio/wav",
              "mp3": "audio/mpeg"
            }[name.substr(name.lastIndexOf(".") + 1)];
          },
          getUserMedia(func) {
            window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"];
            window.getUserMedia(func);
          },
          getMovementX(event) {
            return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
          },
          getMovementY(event) {
            return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
          },
          getMouseWheelDelta(event) {
            var delta = 0;
            switch (event.type) {
              case "DOMMouseScroll":
                delta = event.detail / 3;
                break;
              case "mousewheel":
                delta = event.wheelDelta / 120;
                break;
              case "wheel":
                delta = event.deltaY;
                switch (event.deltaMode) {
                  case 0:
                    delta /= 100;
                    break;
                  case 1:
                    delta /= 3;
                    break;
                  case 2:
                    delta *= 80;
                    break;
                  default:
                    throw "unrecognized mouse wheel delta mode: " + event.deltaMode;
                }
                break;
              default:
                throw "unrecognized mouse wheel event: " + event.type;
            }
            return delta;
          },
          mouseX: 0,
          mouseY: 0,
          mouseMovementX: 0,
          mouseMovementY: 0,
          touches: {},
          lastTouches: {},
          calculateMouseCoords(pageX, pageY) {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset;
            assert3(typeof scrollX != "undefined" && typeof scrollY != "undefined", "Unable to retrieve scroll position, mouse positions likely broken.");
            var adjustedX = pageX - (scrollX + rect.left);
            var adjustedY = pageY - (scrollY + rect.top);
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
            return { x: adjustedX, y: adjustedY };
          },
          setMouseCoords(pageX, pageY) {
            const { x, y } = Browser.calculateMouseCoords(pageX, pageY);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y;
          },
          calculateMouseEvent(event) {
            if (Browser.pointerLock) {
              if (event.type != "mousemove" && "mozMovementX" in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0;
              } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event);
              }
              if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
              } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY;
              }
            } else {
              if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === void 0) {
                  return;
                }
                var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
                if (event.type === "touchstart") {
                  Browser.lastTouches[touch.identifier] = coords;
                  Browser.touches[touch.identifier] = coords;
                } else if (event.type === "touchend" || event.type === "touchmove") {
                  var last = Browser.touches[touch.identifier];
                  last ||= coords;
                  Browser.lastTouches[touch.identifier] = last;
                  Browser.touches[touch.identifier] = coords;
                }
                return;
              }
              Browser.setMouseCoords(event.pageX, event.pageY);
            }
          },
          resizeListeners: [],
          updateResizeListeners() {
            var canvas = Module["canvas"];
            Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
          },
          setCanvasSize(width, height, noUpdates) {
            var canvas = Module["canvas"];
            Browser.updateCanvasDimensions(canvas, width, height);
            if (!noUpdates) Browser.updateResizeListeners();
          },
          windowedWidth: 0,
          windowedHeight: 0,
          setFullscreenCanvasSize() {
            if (typeof SDL != "undefined") {
              var flags = HEAPU32[SDL.screen >> 2];
              flags = flags | 8388608;
              HEAP32[SDL.screen >> 2] = flags;
            }
            Browser.updateCanvasDimensions(Module["canvas"]);
            Browser.updateResizeListeners();
          },
          setWindowedCanvasSize() {
            if (typeof SDL != "undefined") {
              var flags = HEAPU32[SDL.screen >> 2];
              flags = flags & ~8388608;
              HEAP32[SDL.screen >> 2] = flags;
            }
            Browser.updateCanvasDimensions(Module["canvas"]);
            Browser.updateResizeListeners();
          },
          updateCanvasDimensions(canvas, wNative, hNative) {
            if (wNative && hNative) {
              canvas.widthNative = wNative;
              canvas.heightNative = hNative;
            } else {
              wNative = canvas.widthNative;
              hNative = canvas.heightNative;
            }
            var w = wNative;
            var h = hNative;
            if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
              if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"]);
              } else {
                h = Math.round(w / Module["forcedAspectRatio"]);
              }
            }
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
              var factor = Math.min(screen.width / w, screen.height / h);
              w = Math.round(w * factor);
              h = Math.round(h * factor);
            }
            if (Browser.resizeCanvas) {
              if (canvas.width != w) canvas.width = w;
              if (canvas.height != h) canvas.height = h;
              if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height");
              }
            } else {
              if (canvas.width != wNative) canvas.width = wNative;
              if (canvas.height != hNative) canvas.height = hNative;
              if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                  canvas.style.setProperty("width", w + "px", "important");
                  canvas.style.setProperty("height", h + "px", "important");
                } else {
                  canvas.style.removeProperty("width");
                  canvas.style.removeProperty("height");
                }
              }
            }
          }
        };
        var EGL = {
          errorCode: 12288,
          defaultDisplayInitialized: false,
          currentContext: 0,
          currentReadSurface: 0,
          currentDrawSurface: 0,
          contextAttributes: {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false
          },
          stringCache: {},
          setErrorCode(code) {
            EGL.errorCode = code;
          },
          chooseConfig(display, attribList, config, config_size, numConfigs) {
            if (display != 62e3) {
              EGL.setErrorCode(
                12296
                /* EGL_BAD_DISPLAY */
              );
              return 0;
            }
            if (attribList) {
              for (; ; ) {
                var param = HEAP32[attribList >> 2];
                if (param == 12321) {
                  var alphaSize = HEAP32[attribList + 4 >> 2];
                  EGL.contextAttributes.alpha = alphaSize > 0;
                } else if (param == 12325) {
                  var depthSize = HEAP32[attribList + 4 >> 2];
                  EGL.contextAttributes.depth = depthSize > 0;
                } else if (param == 12326) {
                  var stencilSize = HEAP32[attribList + 4 >> 2];
                  EGL.contextAttributes.stencil = stencilSize > 0;
                } else if (param == 12337) {
                  var samples = HEAP32[attribList + 4 >> 2];
                  EGL.contextAttributes.antialias = samples > 0;
                } else if (param == 12338) {
                  var samples = HEAP32[attribList + 4 >> 2];
                  EGL.contextAttributes.antialias = samples == 1;
                } else if (param == 12544) {
                  var requestedPriority = HEAP32[attribList + 4 >> 2];
                  EGL.contextAttributes.lowLatency = requestedPriority != 12547;
                } else if (param == 12344) {
                  break;
                }
                attribList += 8;
              }
            }
            if ((!config || !config_size) && !numConfigs) {
              EGL.setErrorCode(
                12300
                /* EGL_BAD_PARAMETER */
              );
              return 0;
            }
            if (numConfigs) {
              HEAP32[numConfigs >> 2] = 1;
            }
            if (config && config_size > 0) {
              HEAPU32[config >> 2] = 62002;
            }
            EGL.setErrorCode(
              12288
              /* EGL_SUCCESS */
            );
            return 1;
          }
        };
        var _eglChooseConfig = (display, attrib_list, configs, config_size, numConfigs) => {
          return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs);
        };
        var GL = {
          counter: 1,
          buffers: [],
          programs: [],
          framebuffers: [],
          renderbuffers: [],
          textures: [],
          shaders: [],
          vaos: [],
          contexts: [],
          offscreenCanvases: {},
          queries: [],
          samplers: [],
          transformFeedbacks: [],
          syncs: [],
          stringCache: {},
          stringiCache: {},
          unpackAlignment: 4,
          recordError: function recordError(errorCode) {
            if (!GL.lastError) {
              GL.lastError = errorCode;
            }
          },
          getNewId: (table) => {
            var ret = GL.counter++;
            for (var i2 = table.length; i2 < ret; i2++) {
              table[i2] = null;
            }
            return ret;
          },
          getSource: (shader, count, string2, length) => {
            var source = "";
            for (var i2 = 0; i2 < count; ++i2) {
              var len = length ? HEAPU32[length + i2 * 4 >> 2] : void 0;
              source += UTF8ToString(HEAPU32[string2 + i2 * 4 >> 2], len);
            }
            return source;
          },
          createContext: (canvas, webGLContextAttributes) => {
            if (!canvas.getContextSafariWebGL2Fixed) {
              let fixedGetContext2 = function(ver, attrs) {
                var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null;
              };
              var fixedGetContext = fixedGetContext2;
              canvas.getContextSafariWebGL2Fixed = canvas.getContext;
              canvas.getContext = fixedGetContext2;
            }
            var ctx = webGLContextAttributes.majorVersion > 1 ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
            if (!ctx) return 0;
            var handle = GL.registerContext(ctx, webGLContextAttributes);
            return handle;
          },
          registerContext: (ctx, webGLContextAttributes) => {
            var handle = GL.getNewId(GL.contexts);
            var context = {
              handle,
              attributes: webGLContextAttributes,
              version: webGLContextAttributes.majorVersion,
              GLctx: ctx
            };
            if (ctx.canvas) ctx.canvas.GLctxObject = context;
            GL.contexts[handle] = context;
            return handle;
          },
          makeContextCurrent: (contextHandle) => {
            GL.currentContext = GL.contexts[contextHandle];
            Module.ctx = GLctx = GL.currentContext?.GLctx;
            return !(contextHandle && !GLctx);
          },
          getContext: (contextHandle) => {
            return GL.contexts[contextHandle];
          },
          deleteContext: (contextHandle) => {
            if (GL.currentContext === GL.contexts[contextHandle]) {
              GL.currentContext = null;
            }
            if (typeof JSEvents == "object") {
              JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
            }
            if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
              GL.contexts[contextHandle].GLctx.canvas.GLctxObject = void 0;
            }
            GL.contexts[contextHandle] = null;
          }
        };
        var _eglCreateContext = (display, config, hmm, contextAttribs) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          var glesContextVersion = 1;
          for (; ; ) {
            var param = HEAP32[contextAttribs >> 2];
            if (param == 12440) {
              glesContextVersion = HEAP32[contextAttribs + 4 >> 2];
            } else if (param == 12344) {
              break;
            } else {
              EGL.setErrorCode(
                12292
                /*EGL_BAD_ATTRIBUTE*/
              );
              return 0;
            }
            contextAttribs += 8;
          }
          if (glesContextVersion < 2 || glesContextVersion > 3) {
            EGL.setErrorCode(
              12293
              /* EGL_BAD_CONFIG */
            );
            return 0;
          }
          EGL.contextAttributes.majorVersion = glesContextVersion - 1;
          EGL.contextAttributes.minorVersion = 0;
          EGL.context = GL.createContext(Module["canvas"], EGL.contextAttributes);
          if (EGL.context != 0) {
            EGL.setErrorCode(
              12288
              /* EGL_SUCCESS */
            );
            GL.makeContextCurrent(EGL.context);
            Module.useWebGL = true;
            Browser.moduleContextCreatedCallbacks.forEach(function(callback) {
              callback();
            });
            GL.makeContextCurrent(null);
            return 62004;
          } else {
            EGL.setErrorCode(
              12297
              /* EGL_BAD_MATCH */
            );
            return 0;
          }
        };
        var _eglCreateWindowSurface = (display, config, win, attrib_list) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          if (config != 62002) {
            EGL.setErrorCode(
              12293
              /* EGL_BAD_CONFIG */
            );
            return 0;
          }
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          return 62006;
        };
        var _eglDestroyContext = (display, context) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          if (context != 62004) {
            EGL.setErrorCode(
              12294
              /* EGL_BAD_CONTEXT */
            );
            return 0;
          }
          GL.deleteContext(EGL.context);
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          if (EGL.currentContext == context) {
            EGL.currentContext = 0;
          }
          return 1;
        };
        var _eglDestroySurface = (display, surface) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          if (surface != 62006) {
            EGL.setErrorCode(
              12301
              /* EGL_BAD_SURFACE */
            );
            return 1;
          }
          if (EGL.currentReadSurface == surface) {
            EGL.currentReadSurface = 0;
          }
          if (EGL.currentDrawSurface == surface) {
            EGL.currentDrawSurface = 0;
          }
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          return 1;
        };
        var _eglGetConfigAttrib = (display, config, attribute, value) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          if (config != 62002) {
            EGL.setErrorCode(
              12293
              /* EGL_BAD_CONFIG */
            );
            return 0;
          }
          if (!value) {
            EGL.setErrorCode(
              12300
              /* EGL_BAD_PARAMETER */
            );
            return 0;
          }
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          switch (attribute) {
            case 12320:
              HEAP32[value >> 2] = EGL.contextAttributes.alpha ? 32 : 24;
              return 1;
            case 12321:
              HEAP32[value >> 2] = EGL.contextAttributes.alpha ? 8 : 0;
              return 1;
            case 12322:
              HEAP32[value >> 2] = 8;
              return 1;
            case 12323:
              HEAP32[value >> 2] = 8;
              return 1;
            case 12324:
              HEAP32[value >> 2] = 8;
              return 1;
            case 12325:
              HEAP32[value >> 2] = EGL.contextAttributes.depth ? 24 : 0;
              return 1;
            case 12326:
              HEAP32[value >> 2] = EGL.contextAttributes.stencil ? 8 : 0;
              return 1;
            case 12327:
              HEAP32[value >> 2] = 12344;
              return 1;
            case 12328:
              HEAP32[value >> 2] = 62002;
              return 1;
            case 12329:
              HEAP32[value >> 2] = 0;
              return 1;
            case 12330:
              HEAP32[value >> 2] = 4096;
              return 1;
            case 12331:
              HEAP32[value >> 2] = 16777216;
              return 1;
            case 12332:
              HEAP32[value >> 2] = 4096;
              return 1;
            case 12333:
              HEAP32[value >> 2] = 0;
              return 1;
            case 12334:
              HEAP32[value >> 2] = 0;
              return 1;
            case 12335:
              HEAP32[value >> 2] = 12344;
              return 1;
            case 12337:
              HEAP32[value >> 2] = EGL.contextAttributes.antialias ? 4 : 0;
              return 1;
            case 12338:
              HEAP32[value >> 2] = EGL.contextAttributes.antialias ? 1 : 0;
              return 1;
            case 12339:
              HEAP32[value >> 2] = 4;
              return 1;
            case 12340:
              HEAP32[value >> 2] = 12344;
              return 1;
            case 12341:
            case 12342:
            case 12343:
              HEAP32[value >> 2] = -1;
              return 1;
            case 12345:
            case 12346:
              HEAP32[value >> 2] = 0;
              return 1;
            case 12347:
              HEAP32[value >> 2] = 0;
              return 1;
            case 12348:
              HEAP32[value >> 2] = 1;
              return 1;
            case 12349:
            case 12350:
              HEAP32[value >> 2] = 0;
              return 1;
            case 12351:
              HEAP32[value >> 2] = 12430;
              return 1;
            case 12352:
              HEAP32[value >> 2] = 4;
              return 1;
            case 12354:
              HEAP32[value >> 2] = 0;
              return 1;
            default:
              EGL.setErrorCode(
                12292
                /* EGL_BAD_ATTRIBUTE */
              );
              return 0;
          }
        };
        var _eglGetDisplay = (nativeDisplayType) => {
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          if (nativeDisplayType != 0 && nativeDisplayType != 1) {
            return 0;
          }
          return 62e3;
        };
        var _eglGetError = () => EGL.errorCode;
        var _eglInitialize = (display, majorVersion, minorVersion) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          if (majorVersion) {
            HEAP32[majorVersion >> 2] = 1;
          }
          if (minorVersion) {
            HEAP32[minorVersion >> 2] = 4;
          }
          EGL.defaultDisplayInitialized = true;
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          return 1;
        };
        var _eglMakeCurrent = (display, draw, read2, context) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          if (context != 0 && context != 62004) {
            EGL.setErrorCode(
              12294
              /* EGL_BAD_CONTEXT */
            );
            return 0;
          }
          if (read2 != 0 && read2 != 62006 || draw != 0 && draw != 62006) {
            EGL.setErrorCode(
              12301
              /* EGL_BAD_SURFACE */
            );
            return 0;
          }
          GL.makeContextCurrent(context ? EGL.context : null);
          EGL.currentContext = context;
          EGL.currentDrawSurface = draw;
          EGL.currentReadSurface = read2;
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          return 1;
        };
        var _eglSwapBuffers = (dpy, surface) => {
          if (!EGL.defaultDisplayInitialized) {
            EGL.setErrorCode(
              12289
              /* EGL_NOT_INITIALIZED */
            );
          } else if (!Module.ctx) {
            EGL.setErrorCode(
              12290
              /* EGL_BAD_ACCESS */
            );
          } else if (Module.ctx.isContextLost()) {
            EGL.setErrorCode(
              12302
              /* EGL_CONTEXT_LOST */
            );
          } else {
            EGL.setErrorCode(
              12288
              /* EGL_SUCCESS */
            );
            return 1;
          }
          return 0;
        };
        var _eglTerminate = (display) => {
          if (display != 62e3) {
            EGL.setErrorCode(
              12296
              /* EGL_BAD_DISPLAY */
            );
            return 0;
          }
          EGL.currentContext = 0;
          EGL.currentReadSurface = 0;
          EGL.currentDrawSurface = 0;
          EGL.defaultDisplayInitialized = false;
          EGL.setErrorCode(
            12288
            /* EGL_SUCCESS */
          );
          return 1;
        };
        var readEmAsmArgsArray = [];
        var readEmAsmArgs = (sigPtr, buf) => {
          assert3(Array.isArray(readEmAsmArgsArray));
          assert3(buf % 16 == 0);
          readEmAsmArgsArray.length = 0;
          var ch;
          while (ch = HEAPU8[sigPtr++]) {
            var chr = String.fromCharCode(ch);
            var validChars = ["d", "f", "i", "p"];
            validChars.push("j");
            assert3(validChars.includes(chr), `Invalid character ${ch}("${chr}") in readEmAsmArgs! Use only [${validChars}], and do not specify "v" for void return argument.`);
            var wide = ch != 105;
            wide &= ch != 112;
            buf += wide && buf % 8 ? 4 : 0;
            readEmAsmArgsArray.push(
              // Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
              ch == 112 ? HEAPU32[buf >> 2] : ch == 106 ? HEAP64[buf >> 3] : ch == 105 ? HEAP32[buf >> 2] : HEAPF64[buf >> 3]
            );
            buf += wide ? 8 : 4;
          }
          return readEmAsmArgsArray;
        };
        var runEmAsmFunction = (code, sigPtr, argbuf) => {
          var args = readEmAsmArgs(sigPtr, argbuf);
          assert3(ASM_CONSTS.hasOwnProperty(code), `No EM_ASM constant found at address ${code}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
          return ASM_CONSTS[code].apply(null, args);
        };
        var _emscripten_asm_const_int = (code, sigPtr, argbuf) => {
          return runEmAsmFunction(code, sigPtr, argbuf);
        };
        var _emscripten_console_error = (str) => {
          assert3(typeof str == "number");
          console.error(UTF8ToString(str));
        };
        var _emscripten_console_log = (str) => {
          assert3(typeof str == "number");
          console.log(UTF8ToString(str));
        };
        var _emscripten_console_warn = (str) => {
          assert3(typeof str == "number");
          console.warn(UTF8ToString(str));
        };
        var _emscripten_date_now = () => Date.now();
        function _emscripten_debugger() {
          debugger;
        }
        var _emscripten_err = (str) => err(UTF8ToString(str));
        var getHeapMax = () => (
          // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
          // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
          // for any code that deals with heap sizes, which would require special
          // casing all heap size related code to treat 0 specially.
          2147483648
        );
        var _emscripten_get_heap_max = () => getHeapMax();
        function _glActiveTexture(x0) {
          GLctx.activeTexture(x0);
        }
        var _emscripten_glActiveTexture = _glActiveTexture;
        var _glAttachShader = (program, shader) => {
          GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
        };
        var _emscripten_glAttachShader = _glAttachShader;
        var _glBeginQuery = (target, id) => {
          GLctx.beginQuery(target, GL.queries[id]);
        };
        var _emscripten_glBeginQuery = _glBeginQuery;
        var _glBeginQueryEXT = (target, id) => {
          GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
        };
        var _emscripten_glBeginQueryEXT = _glBeginQueryEXT;
        function _glBeginTransformFeedback(x0) {
          GLctx.beginTransformFeedback(x0);
        }
        var _emscripten_glBeginTransformFeedback = _glBeginTransformFeedback;
        var _glBindAttribLocation = (program, index, name) => {
          GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
        };
        var _emscripten_glBindAttribLocation = _glBindAttribLocation;
        var _glBindBuffer = (target, buffer) => {
          if (target == 35051) {
            GLctx.currentPixelPackBufferBinding = buffer;
          } else if (target == 35052) {
            GLctx.currentPixelUnpackBufferBinding = buffer;
          }
          GLctx.bindBuffer(target, GL.buffers[buffer]);
        };
        var _emscripten_glBindBuffer = _glBindBuffer;
        var _glBindBufferBase = (target, index, buffer) => {
          GLctx.bindBufferBase(target, index, GL.buffers[buffer]);
        };
        var _emscripten_glBindBufferBase = _glBindBufferBase;
        var _glBindBufferRange = (target, index, buffer, offset, ptrsize) => {
          GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize);
        };
        var _emscripten_glBindBufferRange = _glBindBufferRange;
        var _glBindFramebuffer = (target, framebuffer) => {
          GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
        };
        var _emscripten_glBindFramebuffer = _glBindFramebuffer;
        var _glBindRenderbuffer = (target, renderbuffer) => {
          GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
        };
        var _emscripten_glBindRenderbuffer = _glBindRenderbuffer;
        var _glBindSampler = (unit, sampler) => {
          GLctx.bindSampler(unit, GL.samplers[sampler]);
        };
        var _emscripten_glBindSampler = _glBindSampler;
        var _glBindTexture = (target, texture) => {
          GLctx.bindTexture(target, GL.textures[texture]);
        };
        var _emscripten_glBindTexture = _glBindTexture;
        var _glBindTransformFeedback = (target, id) => {
          GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id]);
        };
        var _emscripten_glBindTransformFeedback = _glBindTransformFeedback;
        var _glBindVertexArray = (vao) => {
          GLctx.bindVertexArray(GL.vaos[vao]);
        };
        var _emscripten_glBindVertexArray = _glBindVertexArray;
        var _glBindVertexArrayOES = _glBindVertexArray;
        var _emscripten_glBindVertexArrayOES = _glBindVertexArrayOES;
        function _glBlendColor(x0, x1, x2, x3) {
          GLctx.blendColor(x0, x1, x2, x3);
        }
        var _emscripten_glBlendColor = _glBlendColor;
        function _glBlendEquation(x0) {
          GLctx.blendEquation(x0);
        }
        var _emscripten_glBlendEquation = _glBlendEquation;
        function _glBlendEquationSeparate(x0, x1) {
          GLctx.blendEquationSeparate(x0, x1);
        }
        var _emscripten_glBlendEquationSeparate = _glBlendEquationSeparate;
        function _glBlendFunc(x0, x1) {
          GLctx.blendFunc(x0, x1);
        }
        var _emscripten_glBlendFunc = _glBlendFunc;
        function _glBlendFuncSeparate(x0, x1, x2, x3) {
          GLctx.blendFuncSeparate(x0, x1, x2, x3);
        }
        var _emscripten_glBlendFuncSeparate = _glBlendFuncSeparate;
        function _glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
          GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
        }
        var _emscripten_glBlitFramebuffer = _glBlitFramebuffer;
        var _glBufferData = (target, size, data, usage) => {
          if (GL.currentContext.version >= 2) {
            if (data && size) {
              GLctx.bufferData(target, HEAPU8, usage, data, size);
            } else {
              GLctx.bufferData(target, size, usage);
            }
          } else {
            GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage);
          }
        };
        var _emscripten_glBufferData = _glBufferData;
        var _glBufferSubData = (target, offset, size, data) => {
          if (GL.currentContext.version >= 2) {
            size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
            return;
          }
          GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
        };
        var _emscripten_glBufferSubData = _glBufferSubData;
        function _glCheckFramebufferStatus(x0) {
          return GLctx.checkFramebufferStatus(x0);
        }
        var _emscripten_glCheckFramebufferStatus = _glCheckFramebufferStatus;
        function _glClear(x0) {
          GLctx.clear(x0);
        }
        var _emscripten_glClear = _glClear;
        function _glClearBufferfi(x0, x1, x2, x3) {
          GLctx.clearBufferfi(x0, x1, x2, x3);
        }
        var _emscripten_glClearBufferfi = _glClearBufferfi;
        var _glClearBufferfv = (buffer, drawbuffer, value) => {
          GLctx.clearBufferfv(buffer, drawbuffer, HEAPF32, value >> 2);
        };
        var _emscripten_glClearBufferfv = _glClearBufferfv;
        var _glClearBufferiv = (buffer, drawbuffer, value) => {
          GLctx.clearBufferiv(buffer, drawbuffer, HEAP32, value >> 2);
        };
        var _emscripten_glClearBufferiv = _glClearBufferiv;
        var _glClearBufferuiv = (buffer, drawbuffer, value) => {
          GLctx.clearBufferuiv(buffer, drawbuffer, HEAPU32, value >> 2);
        };
        var _emscripten_glClearBufferuiv = _glClearBufferuiv;
        function _glClearColor(x0, x1, x2, x3) {
          GLctx.clearColor(x0, x1, x2, x3);
        }
        var _emscripten_glClearColor = _glClearColor;
        function _glClearDepthf(x0) {
          GLctx.clearDepth(x0);
        }
        var _emscripten_glClearDepthf = _glClearDepthf;
        function _glClearStencil(x0) {
          GLctx.clearStencil(x0);
        }
        var _emscripten_glClearStencil = _glClearStencil;
        var _glClientWaitSync = (sync, flags, timeout) => {
          timeout = Number(timeout);
          return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout);
        };
        var _emscripten_glClientWaitSync = _glClientWaitSync;
        var _glColorMask = (red, green, blue, alpha) => {
          GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
        };
        var _emscripten_glColorMask = _glColorMask;
        var _glCompileShader = (shader) => {
          GLctx.compileShader(GL.shaders[shader]);
        };
        var _emscripten_glCompileShader = _glCompileShader;
        var _glCompressedTexImage2D = (target, level, internalFormat, width, height, border, imageSize, data) => {
          if (GL.currentContext.version >= 2) {
            if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
              GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data);
            } else {
              GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, HEAPU8, data, imageSize);
            }
            return;
          }
          GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null);
        };
        var _emscripten_glCompressedTexImage2D = _glCompressedTexImage2D;
        var _glCompressedTexImage3D = (target, level, internalFormat, width, height, depth, border, imageSize, data) => {
          if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data);
          } else {
            GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, HEAPU8, data, imageSize);
          }
        };
        var _emscripten_glCompressedTexImage3D = _glCompressedTexImage3D;
        var _glCompressedTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, imageSize, data) => {
          if (GL.currentContext.version >= 2) {
            if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
              GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
            } else {
              GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize);
            }
            return;
          }
          GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null);
        };
        var _emscripten_glCompressedTexSubImage2D = _glCompressedTexSubImage2D;
        var _glCompressedTexSubImage3D = (target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data) => {
          if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data);
          } else {
            GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, HEAPU8, data, imageSize);
          }
        };
        var _emscripten_glCompressedTexSubImage3D = _glCompressedTexSubImage3D;
        function _glCopyBufferSubData(x0, x1, x2, x3, x4) {
          GLctx.copyBufferSubData(x0, x1, x2, x3, x4);
        }
        var _emscripten_glCopyBufferSubData = _glCopyBufferSubData;
        function _glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
          GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);
        }
        var _emscripten_glCopyTexImage2D = _glCopyTexImage2D;
        function _glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
          GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);
        }
        var _emscripten_glCopyTexSubImage2D = _glCopyTexSubImage2D;
        function _glCopyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8) {
          GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8);
        }
        var _emscripten_glCopyTexSubImage3D = _glCopyTexSubImage3D;
        var _glCreateProgram = () => {
          var id = GL.getNewId(GL.programs);
          var program = GLctx.createProgram();
          program.name = id;
          program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
          program.uniformIdCounter = 1;
          GL.programs[id] = program;
          return id;
        };
        var _emscripten_glCreateProgram = _glCreateProgram;
        var _glCreateShader = (shaderType) => {
          var id = GL.getNewId(GL.shaders);
          GL.shaders[id] = GLctx.createShader(shaderType);
          return id;
        };
        var _emscripten_glCreateShader = _glCreateShader;
        function _glCullFace(x0) {
          GLctx.cullFace(x0);
        }
        var _emscripten_glCullFace = _glCullFace;
        var _glDeleteBuffers = (n, buffers) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[buffers + i2 * 4 >> 2];
            var buffer = GL.buffers[id];
            if (!buffer) continue;
            GLctx.deleteBuffer(buffer);
            buffer.name = 0;
            GL.buffers[id] = null;
            if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
            if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
          }
        };
        var _emscripten_glDeleteBuffers = _glDeleteBuffers;
        var _glDeleteFramebuffers = (n, framebuffers) => {
          for (var i2 = 0; i2 < n; ++i2) {
            var id = HEAP32[framebuffers + i2 * 4 >> 2];
            var framebuffer = GL.framebuffers[id];
            if (!framebuffer) continue;
            GLctx.deleteFramebuffer(framebuffer);
            framebuffer.name = 0;
            GL.framebuffers[id] = null;
          }
        };
        var _emscripten_glDeleteFramebuffers = _glDeleteFramebuffers;
        var _glDeleteProgram = (id) => {
          if (!id) return;
          var program = GL.programs[id];
          if (!program) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          GLctx.deleteProgram(program);
          program.name = 0;
          GL.programs[id] = null;
        };
        var _emscripten_glDeleteProgram = _glDeleteProgram;
        var _glDeleteQueries = (n, ids) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[ids + i2 * 4 >> 2];
            var query = GL.queries[id];
            if (!query) continue;
            GLctx.deleteQuery(query);
            GL.queries[id] = null;
          }
        };
        var _emscripten_glDeleteQueries = _glDeleteQueries;
        var _glDeleteQueriesEXT = (n, ids) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[ids + i2 * 4 >> 2];
            var query = GL.queries[id];
            if (!query) continue;
            GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
            GL.queries[id] = null;
          }
        };
        var _emscripten_glDeleteQueriesEXT = _glDeleteQueriesEXT;
        var _glDeleteRenderbuffers = (n, renderbuffers) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[renderbuffers + i2 * 4 >> 2];
            var renderbuffer = GL.renderbuffers[id];
            if (!renderbuffer) continue;
            GLctx.deleteRenderbuffer(renderbuffer);
            renderbuffer.name = 0;
            GL.renderbuffers[id] = null;
          }
        };
        var _emscripten_glDeleteRenderbuffers = _glDeleteRenderbuffers;
        var _glDeleteSamplers = (n, samplers) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[samplers + i2 * 4 >> 2];
            var sampler = GL.samplers[id];
            if (!sampler) continue;
            GLctx.deleteSampler(sampler);
            sampler.name = 0;
            GL.samplers[id] = null;
          }
        };
        var _emscripten_glDeleteSamplers = _glDeleteSamplers;
        var _glDeleteShader = (id) => {
          if (!id) return;
          var shader = GL.shaders[id];
          if (!shader) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          GLctx.deleteShader(shader);
          GL.shaders[id] = null;
        };
        var _emscripten_glDeleteShader = _glDeleteShader;
        var _glDeleteSync = (id) => {
          if (!id) return;
          var sync = GL.syncs[id];
          if (!sync) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          GLctx.deleteSync(sync);
          sync.name = 0;
          GL.syncs[id] = null;
        };
        var _emscripten_glDeleteSync = _glDeleteSync;
        var _glDeleteTextures = (n, textures) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[textures + i2 * 4 >> 2];
            var texture = GL.textures[id];
            if (!texture) continue;
            GLctx.deleteTexture(texture);
            texture.name = 0;
            GL.textures[id] = null;
          }
        };
        var _emscripten_glDeleteTextures = _glDeleteTextures;
        var _glDeleteTransformFeedbacks = (n, ids) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[ids + i2 * 4 >> 2];
            var transformFeedback = GL.transformFeedbacks[id];
            if (!transformFeedback) continue;
            GLctx.deleteTransformFeedback(transformFeedback);
            transformFeedback.name = 0;
            GL.transformFeedbacks[id] = null;
          }
        };
        var _emscripten_glDeleteTransformFeedbacks = _glDeleteTransformFeedbacks;
        var _glDeleteVertexArrays = (n, vaos) => {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[vaos + i2 * 4 >> 2];
            GLctx.deleteVertexArray(GL.vaos[id]);
            GL.vaos[id] = null;
          }
        };
        var _emscripten_glDeleteVertexArrays = _glDeleteVertexArrays;
        var _glDeleteVertexArraysOES = _glDeleteVertexArrays;
        var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArraysOES;
        function _glDepthFunc(x0) {
          GLctx.depthFunc(x0);
        }
        var _emscripten_glDepthFunc = _glDepthFunc;
        var _glDepthMask = (flag) => {
          GLctx.depthMask(!!flag);
        };
        var _emscripten_glDepthMask = _glDepthMask;
        function _glDepthRangef(x0, x1) {
          GLctx.depthRange(x0, x1);
        }
        var _emscripten_glDepthRangef = _glDepthRangef;
        var _glDetachShader = (program, shader) => {
          GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
        };
        var _emscripten_glDetachShader = _glDetachShader;
        function _glDisable(x0) {
          GLctx.disable(x0);
        }
        var _emscripten_glDisable = _glDisable;
        var _glDisableVertexAttribArray = (index) => {
          GLctx.disableVertexAttribArray(index);
        };
        var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;
        var _glDrawArrays = (mode, first, count) => {
          GLctx.drawArrays(mode, first, count);
        };
        var _emscripten_glDrawArrays = _glDrawArrays;
        var _glDrawArraysInstanced = (mode, first, count, primcount) => {
          GLctx.drawArraysInstanced(mode, first, count, primcount);
        };
        var _emscripten_glDrawArraysInstanced = _glDrawArraysInstanced;
        var _glDrawArraysInstancedANGLE = _glDrawArraysInstanced;
        var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstancedANGLE;
        var _glDrawArraysInstancedARB = _glDrawArraysInstanced;
        var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstancedARB;
        var _glDrawArraysInstancedBaseInstanceWEBGL = (mode, first, count, instanceCount, baseInstance) => {
          GLctx.dibvbi["drawArraysInstancedBaseInstanceWEBGL"](mode, first, count, instanceCount, baseInstance);
        };
        var _emscripten_glDrawArraysInstancedBaseInstanceWEBGL = _glDrawArraysInstancedBaseInstanceWEBGL;
        var _glDrawArraysInstancedEXT = _glDrawArraysInstanced;
        var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstancedEXT;
        var _glDrawArraysInstancedNV = _glDrawArraysInstanced;
        var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstancedNV;
        var tempFixedLengthArray = [];
        var _glDrawBuffers = (n, bufs) => {
          var bufArray = tempFixedLengthArray[n];
          for (var i2 = 0; i2 < n; i2++) {
            bufArray[i2] = HEAP32[bufs + i2 * 4 >> 2];
          }
          GLctx.drawBuffers(bufArray);
        };
        var _emscripten_glDrawBuffers = _glDrawBuffers;
        var _glDrawBuffersEXT = _glDrawBuffers;
        var _emscripten_glDrawBuffersEXT = _glDrawBuffersEXT;
        var _glDrawBuffersWEBGL = _glDrawBuffers;
        var _emscripten_glDrawBuffersWEBGL = _glDrawBuffersWEBGL;
        var _glDrawElements = (mode, count, type2, indices) => {
          GLctx.drawElements(mode, count, type2, indices);
        };
        var _emscripten_glDrawElements = _glDrawElements;
        var _glDrawElementsInstanced = (mode, count, type2, indices, primcount) => {
          GLctx.drawElementsInstanced(mode, count, type2, indices, primcount);
        };
        var _emscripten_glDrawElementsInstanced = _glDrawElementsInstanced;
        var _glDrawElementsInstancedANGLE = _glDrawElementsInstanced;
        var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstancedANGLE;
        var _glDrawElementsInstancedARB = _glDrawElementsInstanced;
        var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstancedARB;
        var _glDrawElementsInstancedBaseVertexBaseInstanceWEBGL = (mode, count, type2, offset, instanceCount, baseVertex, baseinstance) => {
          GLctx.dibvbi["drawElementsInstancedBaseVertexBaseInstanceWEBGL"](mode, count, type2, offset, instanceCount, baseVertex, baseinstance);
        };
        var _emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL = _glDrawElementsInstancedBaseVertexBaseInstanceWEBGL;
        var _glDrawElementsInstancedEXT = _glDrawElementsInstanced;
        var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstancedEXT;
        var _glDrawElementsInstancedNV = _glDrawElementsInstanced;
        var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstancedNV;
        var _glDrawRangeElements = (mode, start, end, count, type2, indices) => {
          _glDrawElements(mode, count, type2, indices);
        };
        var _emscripten_glDrawRangeElements = _glDrawRangeElements;
        function _glEnable(x0) {
          GLctx.enable(x0);
        }
        var _emscripten_glEnable = _glEnable;
        var _glEnableVertexAttribArray = (index) => {
          GLctx.enableVertexAttribArray(index);
        };
        var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;
        function _glEndQuery(x0) {
          GLctx.endQuery(x0);
        }
        var _emscripten_glEndQuery = _glEndQuery;
        var _glEndQueryEXT = (target) => {
          GLctx.disjointTimerQueryExt["endQueryEXT"](target);
        };
        var _emscripten_glEndQueryEXT = _glEndQueryEXT;
        function _glEndTransformFeedback() {
          GLctx.endTransformFeedback();
        }
        var _emscripten_glEndTransformFeedback = _glEndTransformFeedback;
        var _glFenceSync = (condition, flags) => {
          var sync = GLctx.fenceSync(condition, flags);
          if (sync) {
            var id = GL.getNewId(GL.syncs);
            sync.name = id;
            GL.syncs[id] = sync;
            return id;
          }
          return 0;
        };
        var _emscripten_glFenceSync = _glFenceSync;
        function _glFinish() {
          GLctx.finish();
        }
        var _emscripten_glFinish = _glFinish;
        function _glFlush() {
          GLctx.flush();
        }
        var _emscripten_glFlush = _glFlush;
        var _glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
          GLctx.framebufferRenderbuffer(
            target,
            attachment,
            renderbuffertarget,
            GL.renderbuffers[renderbuffer]
          );
        };
        var _emscripten_glFramebufferRenderbuffer = _glFramebufferRenderbuffer;
        var _glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
          GLctx.framebufferTexture2D(
            target,
            attachment,
            textarget,
            GL.textures[texture],
            level
          );
        };
        var _emscripten_glFramebufferTexture2D = _glFramebufferTexture2D;
        var _glFramebufferTextureLayer = (target, attachment, texture, level, layer) => {
          GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer);
        };
        var _emscripten_glFramebufferTextureLayer = _glFramebufferTextureLayer;
        function _glFrontFace(x0) {
          GLctx.frontFace(x0);
        }
        var _emscripten_glFrontFace = _glFrontFace;
        var __glGenObject = (n, buffers, createFunction, objectTable) => {
          for (var i2 = 0; i2 < n; i2++) {
            var buffer = GLctx[createFunction]();
            var id = buffer && GL.getNewId(objectTable);
            if (buffer) {
              buffer.name = id;
              objectTable[id] = buffer;
            } else {
              GL.recordError(
                1282
                /* GL_INVALID_OPERATION */
              );
            }
            HEAP32[buffers + i2 * 4 >> 2] = id;
          }
        };
        var _glGenBuffers = (n, buffers) => {
          __glGenObject(
            n,
            buffers,
            "createBuffer",
            GL.buffers
          );
        };
        var _emscripten_glGenBuffers = _glGenBuffers;
        var _glGenFramebuffers = (n, ids) => {
          __glGenObject(
            n,
            ids,
            "createFramebuffer",
            GL.framebuffers
          );
        };
        var _emscripten_glGenFramebuffers = _glGenFramebuffers;
        var _glGenQueries = (n, ids) => {
          __glGenObject(
            n,
            ids,
            "createQuery",
            GL.queries
          );
        };
        var _emscripten_glGenQueries = _glGenQueries;
        var _glGenQueriesEXT = (n, ids) => {
          for (var i2 = 0; i2 < n; i2++) {
            var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
            if (!query) {
              GL.recordError(
                1282
                /* GL_INVALID_OPERATION */
              );
              while (i2 < n) HEAP32[ids + i2++ * 4 >> 2] = 0;
              return;
            }
            var id = GL.getNewId(GL.queries);
            query.name = id;
            GL.queries[id] = query;
            HEAP32[ids + i2 * 4 >> 2] = id;
          }
        };
        var _emscripten_glGenQueriesEXT = _glGenQueriesEXT;
        var _glGenRenderbuffers = (n, renderbuffers) => {
          __glGenObject(
            n,
            renderbuffers,
            "createRenderbuffer",
            GL.renderbuffers
          );
        };
        var _emscripten_glGenRenderbuffers = _glGenRenderbuffers;
        var _glGenSamplers = (n, samplers) => {
          __glGenObject(
            n,
            samplers,
            "createSampler",
            GL.samplers
          );
        };
        var _emscripten_glGenSamplers = _glGenSamplers;
        var _glGenTextures = (n, textures) => {
          __glGenObject(
            n,
            textures,
            "createTexture",
            GL.textures
          );
        };
        var _emscripten_glGenTextures = _glGenTextures;
        var _glGenTransformFeedbacks = (n, ids) => {
          __glGenObject(
            n,
            ids,
            "createTransformFeedback",
            GL.transformFeedbacks
          );
        };
        var _emscripten_glGenTransformFeedbacks = _glGenTransformFeedbacks;
        function _glGenVertexArrays(n, arrays) {
          __glGenObject(
            n,
            arrays,
            "createVertexArray",
            GL.vaos
          );
        }
        var _emscripten_glGenVertexArrays = _glGenVertexArrays;
        var _glGenVertexArraysOES = _glGenVertexArrays;
        var _emscripten_glGenVertexArraysOES = _glGenVertexArraysOES;
        function _glGenerateMipmap(x0) {
          GLctx.generateMipmap(x0);
        }
        var _emscripten_glGenerateMipmap = _glGenerateMipmap;
        var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type2, name) => {
          program = GL.programs[program];
          var info = GLctx[funcName](program, index);
          if (info) {
            var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
            if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
            if (size) HEAP32[size >> 2] = info.size;
            if (type2) HEAP32[type2 >> 2] = info.type;
          }
        };
        var _glGetActiveAttrib = (program, index, bufSize, length, size, type2, name) => {
          __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type2, name);
        };
        var _emscripten_glGetActiveAttrib = _glGetActiveAttrib;
        var _glGetActiveUniform = (program, index, bufSize, length, size, type2, name) => {
          __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type2, name);
        };
        var _emscripten_glGetActiveUniform = _glGetActiveUniform;
        var _glGetActiveUniformBlockName = (program, uniformBlockIndex, bufSize, length, uniformBlockName) => {
          program = GL.programs[program];
          var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
          if (!result) return;
          if (uniformBlockName && bufSize > 0) {
            var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
            if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
          } else {
            if (length) HEAP32[length >> 2] = 0;
          }
        };
        var _emscripten_glGetActiveUniformBlockName = _glGetActiveUniformBlockName;
        var _glGetActiveUniformBlockiv = (program, uniformBlockIndex, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          program = GL.programs[program];
          if (pname == 35393) {
            var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
            HEAP32[params >> 2] = name.length + 1;
            return;
          }
          var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
          if (result === null) return;
          if (pname == 35395) {
            for (var i2 = 0; i2 < result.length; i2++) {
              HEAP32[params + i2 * 4 >> 2] = result[i2];
            }
          } else {
            HEAP32[params >> 2] = result;
          }
        };
        var _emscripten_glGetActiveUniformBlockiv = _glGetActiveUniformBlockiv;
        var _glGetActiveUniformsiv = (program, uniformCount, uniformIndices, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          if (uniformCount > 0 && uniformIndices == 0) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          program = GL.programs[program];
          var ids = [];
          for (var i2 = 0; i2 < uniformCount; i2++) {
            ids.push(HEAP32[uniformIndices + i2 * 4 >> 2]);
          }
          var result = GLctx.getActiveUniforms(program, ids, pname);
          if (!result) return;
          var len = result.length;
          for (var i2 = 0; i2 < len; i2++) {
            HEAP32[params + i2 * 4 >> 2] = result[i2];
          }
        };
        var _emscripten_glGetActiveUniformsiv = _glGetActiveUniformsiv;
        var _glGetAttachedShaders = (program, maxCount, count, shaders) => {
          var result = GLctx.getAttachedShaders(GL.programs[program]);
          var len = result.length;
          if (len > maxCount) {
            len = maxCount;
          }
          HEAP32[count >> 2] = len;
          for (var i2 = 0; i2 < len; ++i2) {
            var id = GL.shaders.indexOf(result[i2]);
            HEAP32[shaders + i2 * 4 >> 2] = id;
          }
        };
        var _emscripten_glGetAttachedShaders = _glGetAttachedShaders;
        var _glGetAttribLocation = (program, name) => {
          return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
        };
        var _emscripten_glGetAttribLocation = _glGetAttribLocation;
        var readI53FromI64 = (ptr) => {
          return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
        };
        var readI53FromU64 = (ptr) => {
          return HEAPU32[ptr >> 2] + HEAPU32[ptr + 4 >> 2] * 4294967296;
        };
        var writeI53ToI64 = (ptr, num) => {
          HEAPU32[ptr >> 2] = num;
          var lower = HEAPU32[ptr >> 2];
          HEAPU32[ptr + 4 >> 2] = (num - lower) / 4294967296;
          var deserialized = num >= 0 ? readI53FromU64(ptr) : readI53FromI64(ptr);
          var offset = ptr >> 2;
          if (deserialized != num) warnOnce(`writeI53ToI64() out of range: serialized JS Number ${num} to Wasm heap as bytes lo=${ptrToString(HEAPU32[offset])}, hi=${ptrToString(HEAPU32[offset + 1])}, which deserializes back to ${deserialized} instead!`);
        };
        var getEmscriptenSupportedExtensions = function(ctx) {
          var supportedExtensions = [
            // WebGL 1 extensions
            "ANGLE_instanced_arrays",
            "EXT_blend_minmax",
            "EXT_disjoint_timer_query",
            "EXT_frag_depth",
            "EXT_shader_texture_lod",
            "EXT_sRGB",
            "OES_element_index_uint",
            "OES_fbo_render_mipmap",
            "OES_standard_derivatives",
            "OES_texture_float",
            "OES_texture_half_float",
            "OES_texture_half_float_linear",
            "OES_vertex_array_object",
            "WEBGL_color_buffer_float",
            "WEBGL_depth_texture",
            "WEBGL_draw_buffers",
            // WebGL 2 extensions
            "EXT_color_buffer_float",
            "EXT_disjoint_timer_query_webgl2",
            "EXT_texture_norm16",
            "WEBGL_clip_cull_distance",
            // WebGL 1 and WebGL 2 extensions
            "EXT_color_buffer_half_float",
            "EXT_float_blend",
            "EXT_texture_compression_bptc",
            "EXT_texture_compression_rgtc",
            "EXT_texture_filter_anisotropic",
            "KHR_parallel_shader_compile",
            "OES_texture_float_linear",
            "WEBGL_compressed_texture_s3tc",
            "WEBGL_compressed_texture_s3tc_srgb",
            "WEBGL_debug_renderer_info",
            "WEBGL_debug_shaders",
            "WEBGL_lose_context",
            "WEBGL_multi_draw"
          ];
          return (ctx.getSupportedExtensions() || []).filter((ext) => supportedExtensions.includes(ext));
        };
        var webglGetExtensions = function $webglGetExtensions() {
          var exts = getEmscriptenSupportedExtensions(GLctx);
          exts = exts.concat(exts.map((e) => "GL_" + e));
          return exts;
        };
        var emscriptenWebGLGet = (name_, p, type2) => {
          if (!p) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var ret = void 0;
          switch (name_) {
            case 36346:
              ret = 1;
              break;
            case 36344:
              if (type2 != 0 && type2 != 1) {
                GL.recordError(1280);
              }
              return;
            case 34814:
            case 36345:
              ret = 0;
              break;
            case 34466:
              var formats = GLctx.getParameter(
                34467
                /*GL_COMPRESSED_TEXTURE_FORMATS*/
              );
              ret = formats ? formats.length : 0;
              break;
            case 33309:
              if (GL.currentContext.version < 2) {
                GL.recordError(
                  1282
                  /* GL_INVALID_OPERATION */
                );
                return;
              }
              ret = webglGetExtensions().length;
              break;
            case 33307:
            case 33308:
              if (GL.currentContext.version < 2) {
                GL.recordError(1280);
                return;
              }
              ret = name_ == 33307 ? 3 : 0;
              break;
          }
          if (ret === void 0) {
            var result = GLctx.getParameter(name_);
            switch (typeof result) {
              case "number":
                ret = result;
                break;
              case "boolean":
                ret = result ? 1 : 0;
                break;
              case "string":
                GL.recordError(1280);
                return;
              case "object":
                if (result === null) {
                  switch (name_) {
                    case 34964:
                    case 35725:
                    case 34965:
                    case 36006:
                    case 36007:
                    case 32873:
                    case 34229:
                    case 36662:
                    case 36663:
                    case 35053:
                    case 35055:
                    case 36010:
                    case 35097:
                    case 35869:
                    case 32874:
                    case 36389:
                    case 35983:
                    case 35368:
                    case 34068: {
                      ret = 0;
                      break;
                    }
                    default: {
                      GL.recordError(1280);
                      return;
                    }
                  }
                } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                  for (var i2 = 0; i2 < result.length; ++i2) {
                    switch (type2) {
                      case 0:
                        HEAP32[p + i2 * 4 >> 2] = result[i2];
                        break;
                      case 2:
                        HEAPF32[p + i2 * 4 >> 2] = result[i2];
                        break;
                      case 4:
                        HEAP8[p + i2 >> 0] = result[i2] ? 1 : 0;
                        break;
                    }
                  }
                  return;
                } else {
                  try {
                    ret = result.name | 0;
                  } catch (e) {
                    GL.recordError(1280);
                    err(`GL_INVALID_ENUM in glGet${type2}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
                    return;
                  }
                }
                break;
              default:
                GL.recordError(1280);
                err(`GL_INVALID_ENUM in glGet${type2}v: Native code calling glGet${type2}v(${name_}) and it returns ${result} of type ${typeof result}!`);
                return;
            }
          }
          switch (type2) {
            case 1:
              writeI53ToI64(p, ret);
              break;
            case 0:
              HEAP32[p >> 2] = ret;
              break;
            case 2:
              HEAPF32[p >> 2] = ret;
              break;
            case 4:
              HEAP8[p >> 0] = ret ? 1 : 0;
              break;
          }
        };
        var _glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);
        var _emscripten_glGetBooleanv = _glGetBooleanv;
        var _glGetBufferParameteri64v = (target, value, data) => {
          if (!data) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          writeI53ToI64(data, GLctx.getBufferParameter(target, value));
        };
        var _emscripten_glGetBufferParameteri64v = _glGetBufferParameteri64v;
        var _glGetBufferParameteriv = (target, value, data) => {
          if (!data) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[data >> 2] = GLctx.getBufferParameter(target, value);
        };
        var _emscripten_glGetBufferParameteriv = _glGetBufferParameteriv;
        var _glGetError = () => {
          var error = GLctx.getError() || GL.lastError;
          GL.lastError = 0;
          return error;
        };
        var _emscripten_glGetError = _glGetError;
        var _glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);
        var _emscripten_glGetFloatv = _glGetFloatv;
        var _glGetFragDataLocation = (program, name) => {
          return GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name));
        };
        var _emscripten_glGetFragDataLocation = _glGetFragDataLocation;
        var _glGetFramebufferAttachmentParameteriv = (target, attachment, pname, params) => {
          var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
          if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
            result = result.name | 0;
          }
          HEAP32[params >> 2] = result;
        };
        var _emscripten_glGetFramebufferAttachmentParameteriv = _glGetFramebufferAttachmentParameteriv;
        var emscriptenWebGLGetIndexed = (target, index, data, type2) => {
          if (!data) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var result = GLctx.getIndexedParameter(target, index);
          var ret;
          switch (typeof result) {
            case "boolean":
              ret = result ? 1 : 0;
              break;
            case "number":
              ret = result;
              break;
            case "object":
              if (result === null) {
                switch (target) {
                  case 35983:
                  case 35368:
                    ret = 0;
                    break;
                  default: {
                    GL.recordError(1280);
                    return;
                  }
                }
              } else if (result instanceof WebGLBuffer) {
                ret = result.name | 0;
              } else {
                GL.recordError(1280);
                return;
              }
              break;
            default:
              GL.recordError(1280);
              return;
          }
          switch (type2) {
            case 1:
              writeI53ToI64(data, ret);
              break;
            case 0:
              HEAP32[data >> 2] = ret;
              break;
            case 2:
              HEAPF32[data >> 2] = ret;
              break;
            case 4:
              HEAP8[data >> 0] = ret ? 1 : 0;
              break;
            default:
              throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type2;
          }
        };
        var _glGetInteger64i_v = (target, index, data) => emscriptenWebGLGetIndexed(target, index, data, 1);
        var _emscripten_glGetInteger64i_v = _glGetInteger64i_v;
        var _glGetInteger64v = (name_, p) => {
          emscriptenWebGLGet(name_, p, 1);
        };
        var _emscripten_glGetInteger64v = _glGetInteger64v;
        var _glGetIntegeri_v = (target, index, data) => emscriptenWebGLGetIndexed(target, index, data, 0);
        var _emscripten_glGetIntegeri_v = _glGetIntegeri_v;
        var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);
        var _emscripten_glGetIntegerv = _glGetIntegerv;
        var _glGetInternalformativ = (target, internalformat, pname, bufSize, params) => {
          if (bufSize < 0) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
          if (ret === null) return;
          for (var i2 = 0; i2 < ret.length && i2 < bufSize; ++i2) {
            HEAP32[params + i2 * 4 >> 2] = ret[i2];
          }
        };
        var _emscripten_glGetInternalformativ = _glGetInternalformativ;
        var _glGetProgramBinary = (program, bufSize, length, binaryFormat, binary) => {
          GL.recordError(
            1282
            /*GL_INVALID_OPERATION*/
          );
        };
        var _emscripten_glGetProgramBinary = _glGetProgramBinary;
        var _glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
          var log = GLctx.getProgramInfoLog(GL.programs[program]);
          if (log === null) log = "(unknown error)";
          var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        };
        var _emscripten_glGetProgramInfoLog = _glGetProgramInfoLog;
        var _glGetProgramiv = (program, pname, p) => {
          if (!p) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          if (program >= GL.counter) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          program = GL.programs[program];
          if (pname == 35716) {
            var log = GLctx.getProgramInfoLog(program);
            if (log === null) log = "(unknown error)";
            HEAP32[p >> 2] = log.length + 1;
          } else if (pname == 35719) {
            if (!program.maxUniformLength) {
              for (var i2 = 0; i2 < GLctx.getProgramParameter(
                program,
                35718
                /*GL_ACTIVE_UNIFORMS*/
              ); ++i2) {
                program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i2).name.length + 1);
              }
            }
            HEAP32[p >> 2] = program.maxUniformLength;
          } else if (pname == 35722) {
            if (!program.maxAttributeLength) {
              for (var i2 = 0; i2 < GLctx.getProgramParameter(
                program,
                35721
                /*GL_ACTIVE_ATTRIBUTES*/
              ); ++i2) {
                program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i2).name.length + 1);
              }
            }
            HEAP32[p >> 2] = program.maxAttributeLength;
          } else if (pname == 35381) {
            if (!program.maxUniformBlockNameLength) {
              for (var i2 = 0; i2 < GLctx.getProgramParameter(
                program,
                35382
                /*GL_ACTIVE_UNIFORM_BLOCKS*/
              ); ++i2) {
                program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i2).length + 1);
              }
            }
            HEAP32[p >> 2] = program.maxUniformBlockNameLength;
          } else {
            HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname);
          }
        };
        var _emscripten_glGetProgramiv = _glGetProgramiv;
        var _glGetQueryObjecti64vEXT = (id, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var query = GL.queries[id];
          var param;
          if (GL.currentContext.version < 2) {
            param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
          } else {
            param = GLctx.getQueryParameter(query, pname);
          }
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          writeI53ToI64(params, ret);
        };
        var _emscripten_glGetQueryObjecti64vEXT = _glGetQueryObjecti64vEXT;
        var _glGetQueryObjectivEXT = (id, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var query = GL.queries[id];
          var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          HEAP32[params >> 2] = ret;
        };
        var _emscripten_glGetQueryObjectivEXT = _glGetQueryObjectivEXT;
        var _glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;
        var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjectui64vEXT;
        var _glGetQueryObjectuiv = (id, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var query = GL.queries[id];
          var param = GLctx.getQueryParameter(query, pname);
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          HEAP32[params >> 2] = ret;
        };
        var _emscripten_glGetQueryObjectuiv = _glGetQueryObjectuiv;
        var _glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;
        var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectuivEXT;
        var _glGetQueryiv = (target, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[params >> 2] = GLctx.getQuery(target, pname);
        };
        var _emscripten_glGetQueryiv = _glGetQueryiv;
        var _glGetQueryivEXT = (target, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[params >> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
        };
        var _emscripten_glGetQueryivEXT = _glGetQueryivEXT;
        var _glGetRenderbufferParameteriv = (target, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname);
        };
        var _emscripten_glGetRenderbufferParameteriv = _glGetRenderbufferParameteriv;
        var _glGetSamplerParameterfv = (sampler, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAPF32[params >> 2] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
        };
        var _emscripten_glGetSamplerParameterfv = _glGetSamplerParameterfv;
        var _glGetSamplerParameteriv = (sampler, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[params >> 2] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
        };
        var _emscripten_glGetSamplerParameteriv = _glGetSamplerParameteriv;
        var _glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
          var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
          if (log === null) log = "(unknown error)";
          var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        };
        var _emscripten_glGetShaderInfoLog = _glGetShaderInfoLog;
        var _glGetShaderPrecisionFormat = (shaderType, precisionType, range, precision) => {
          var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
          HEAP32[range >> 2] = result.rangeMin;
          HEAP32[range + 4 >> 2] = result.rangeMax;
          HEAP32[precision >> 2] = result.precision;
        };
        var _emscripten_glGetShaderPrecisionFormat = _glGetShaderPrecisionFormat;
        var _glGetShaderSource = (shader, bufSize, length, source) => {
          var result = GLctx.getShaderSource(GL.shaders[shader]);
          if (!result) return;
          var numBytesWrittenExclNull = bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        };
        var _emscripten_glGetShaderSource = _glGetShaderSource;
        var _glGetShaderiv = (shader, pname, p) => {
          if (!p) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          if (pname == 35716) {
            var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
            if (log === null) log = "(unknown error)";
            var logLength = log ? log.length + 1 : 0;
            HEAP32[p >> 2] = logLength;
          } else if (pname == 35720) {
            var source = GLctx.getShaderSource(GL.shaders[shader]);
            var sourceLength = source ? source.length + 1 : 0;
            HEAP32[p >> 2] = sourceLength;
          } else {
            HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
          }
        };
        var _emscripten_glGetShaderiv = _glGetShaderiv;
        var _glGetString = (name_) => {
          var ret = GL.stringCache[name_];
          if (!ret) {
            switch (name_) {
              case 7939:
                ret = stringToNewUTF8(webglGetExtensions().join(" "));
                break;
              case 7936:
              case 7937:
              case 37445:
              case 37446:
                var s = GLctx.getParameter(name_);
                if (!s) {
                  GL.recordError(
                    1280
                    /*GL_INVALID_ENUM*/
                  );
                }
                ret = s ? stringToNewUTF8(s) : 0;
                break;
              case 7938:
                var glVersion = GLctx.getParameter(
                  7938
                  /*GL_VERSION*/
                );
                if (GL.currentContext.version >= 2) glVersion = `OpenGL ES 3.0 (${glVersion})`;
                else {
                  glVersion = `OpenGL ES 2.0 (${glVersion})`;
                }
                ret = stringToNewUTF8(glVersion);
                break;
              case 35724:
                var glslVersion = GLctx.getParameter(
                  35724
                  /*GL_SHADING_LANGUAGE_VERSION*/
                );
                var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                var ver_num = glslVersion.match(ver_re);
                if (ver_num !== null) {
                  if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                  glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
                }
                ret = stringToNewUTF8(glslVersion);
                break;
              default:
                GL.recordError(
                  1280
                  /*GL_INVALID_ENUM*/
                );
            }
            GL.stringCache[name_] = ret;
          }
          return ret;
        };
        var _emscripten_glGetString = _glGetString;
        var _glGetStringi = (name, index) => {
          if (GL.currentContext.version < 2) {
            GL.recordError(
              1282
              /* GL_INVALID_OPERATION */
            );
            return 0;
          }
          var stringiCache = GL.stringiCache[name];
          if (stringiCache) {
            if (index < 0 || index >= stringiCache.length) {
              GL.recordError(
                1281
                /*GL_INVALID_VALUE*/
              );
              return 0;
            }
            return stringiCache[index];
          }
          switch (name) {
            case 7939:
              var exts = webglGetExtensions().map(stringToNewUTF8);
              stringiCache = GL.stringiCache[name] = exts;
              if (index < 0 || index >= stringiCache.length) {
                GL.recordError(
                  1281
                  /*GL_INVALID_VALUE*/
                );
                return 0;
              }
              return stringiCache[index];
            default:
              GL.recordError(
                1280
                /*GL_INVALID_ENUM*/
              );
              return 0;
          }
        };
        var _emscripten_glGetStringi = _glGetStringi;
        var _glGetSynciv = (sync, pname, bufSize, length, values) => {
          if (bufSize < 0) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          if (!values) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
          if (ret !== null) {
            HEAP32[values >> 2] = ret;
            if (length) HEAP32[length >> 2] = 1;
          }
        };
        var _emscripten_glGetSynciv = _glGetSynciv;
        var _glGetTexParameterfv = (target, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname);
        };
        var _emscripten_glGetTexParameterfv = _glGetTexParameterfv;
        var _glGetTexParameteriv = (target, pname, params) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[params >> 2] = GLctx.getTexParameter(target, pname);
        };
        var _emscripten_glGetTexParameteriv = _glGetTexParameteriv;
        var _glGetTransformFeedbackVarying = (program, index, bufSize, length, size, type2, name) => {
          program = GL.programs[program];
          var info = GLctx.getTransformFeedbackVarying(program, index);
          if (!info) return;
          if (name && bufSize > 0) {
            var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
            if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
          } else {
            if (length) HEAP32[length >> 2] = 0;
          }
          if (size) HEAP32[size >> 2] = info.size;
          if (type2) HEAP32[type2 >> 2] = info.type;
        };
        var _emscripten_glGetTransformFeedbackVarying = _glGetTransformFeedbackVarying;
        var _glGetUniformBlockIndex = (program, uniformBlockName) => {
          return GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));
        };
        var _emscripten_glGetUniformBlockIndex = _glGetUniformBlockIndex;
        var _glGetUniformIndices = (program, uniformCount, uniformNames, uniformIndices) => {
          if (!uniformIndices) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          program = GL.programs[program];
          var names = [];
          for (var i2 = 0; i2 < uniformCount; i2++)
            names.push(UTF8ToString(HEAP32[uniformNames + i2 * 4 >> 2]));
          var result = GLctx.getUniformIndices(program, names);
          if (!result) return;
          var len = result.length;
          for (var i2 = 0; i2 < len; i2++) {
            HEAP32[uniformIndices + i2 * 4 >> 2] = result[i2];
          }
        };
        var _emscripten_glGetUniformIndices = _glGetUniformIndices;
        var jstoi_q = (str) => parseInt(str);
        var webglGetLeftBracePos = (name) => name.slice(-1) == "]" && name.lastIndexOf("[");
        var webglPrepareUniformLocationsBeforeFirstUse = (program) => {
          var uniformLocsById = program.uniformLocsById, uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, i2, j;
          if (!uniformLocsById) {
            program.uniformLocsById = uniformLocsById = {};
            program.uniformArrayNamesById = {};
            for (i2 = 0; i2 < GLctx.getProgramParameter(
              program,
              35718
              /*GL_ACTIVE_UNIFORMS*/
            ); ++i2) {
              var u = GLctx.getActiveUniform(program, i2);
              var nm = u.name;
              var sz = u.size;
              var lb = webglGetLeftBracePos(nm);
              var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
              var id = program.uniformIdCounter;
              program.uniformIdCounter += sz;
              uniformSizeAndIdsByName[arrayName] = [sz, id];
              for (j = 0; j < sz; ++j) {
                uniformLocsById[id] = j;
                program.uniformArrayNamesById[id++] = arrayName;
              }
            }
          }
        };
        var _glGetUniformLocation = (program, name) => {
          name = UTF8ToString(name);
          if (program = GL.programs[program]) {
            webglPrepareUniformLocationsBeforeFirstUse(program);
            var uniformLocsById = program.uniformLocsById;
            var arrayIndex = 0;
            var uniformBaseName = name;
            var leftBrace = webglGetLeftBracePos(name);
            if (leftBrace > 0) {
              arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
              uniformBaseName = name.slice(0, leftBrace);
            }
            var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
            if (sizeAndId && arrayIndex < sizeAndId[0]) {
              arrayIndex += sizeAndId[1];
              if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) {
                return arrayIndex;
              }
            }
          } else {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
          }
          return -1;
        };
        var _emscripten_glGetUniformLocation = _glGetUniformLocation;
        var webglGetUniformLocation = (location2) => {
          var p = GLctx.currentProgram;
          if (p) {
            var webglLoc = p.uniformLocsById[location2];
            if (typeof webglLoc == "number") {
              p.uniformLocsById[location2] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location2] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
            }
            return webglLoc;
          } else {
            GL.recordError(
              1282
              /*GL_INVALID_OPERATION*/
            );
          }
        };
        var emscriptenWebGLGetUniform = (program, location2, params, type2) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          program = GL.programs[program];
          webglPrepareUniformLocationsBeforeFirstUse(program);
          var data = GLctx.getUniform(program, webglGetUniformLocation(location2));
          if (typeof data == "number" || typeof data == "boolean") {
            switch (type2) {
              case 0:
                HEAP32[params >> 2] = data;
                break;
              case 2:
                HEAPF32[params >> 2] = data;
                break;
            }
          } else {
            for (var i2 = 0; i2 < data.length; i2++) {
              switch (type2) {
                case 0:
                  HEAP32[params + i2 * 4 >> 2] = data[i2];
                  break;
                case 2:
                  HEAPF32[params + i2 * 4 >> 2] = data[i2];
                  break;
              }
            }
          }
        };
        var _glGetUniformfv = (program, location2, params) => {
          emscriptenWebGLGetUniform(program, location2, params, 2);
        };
        var _emscripten_glGetUniformfv = _glGetUniformfv;
        var _glGetUniformiv = (program, location2, params) => {
          emscriptenWebGLGetUniform(program, location2, params, 0);
        };
        var _emscripten_glGetUniformiv = _glGetUniformiv;
        var _glGetUniformuiv = (program, location2, params) => emscriptenWebGLGetUniform(program, location2, params, 0);
        var _emscripten_glGetUniformuiv = _glGetUniformuiv;
        var emscriptenWebGLGetVertexAttrib = (index, pname, params, type2) => {
          if (!params) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          var data = GLctx.getVertexAttrib(index, pname);
          if (pname == 34975) {
            HEAP32[params >> 2] = data && data["name"];
          } else if (typeof data == "number" || typeof data == "boolean") {
            switch (type2) {
              case 0:
                HEAP32[params >> 2] = data;
                break;
              case 2:
                HEAPF32[params >> 2] = data;
                break;
              case 5:
                HEAP32[params >> 2] = Math.fround(data);
                break;
            }
          } else {
            for (var i2 = 0; i2 < data.length; i2++) {
              switch (type2) {
                case 0:
                  HEAP32[params + i2 * 4 >> 2] = data[i2];
                  break;
                case 2:
                  HEAPF32[params + i2 * 4 >> 2] = data[i2];
                  break;
                case 5:
                  HEAP32[params + i2 * 4 >> 2] = Math.fround(data[i2]);
                  break;
              }
            }
          }
        };
        var _glGetVertexAttribIiv = (index, pname, params) => {
          emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
        };
        var _emscripten_glGetVertexAttribIiv = _glGetVertexAttribIiv;
        var _glGetVertexAttribIuiv = _glGetVertexAttribIiv;
        var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIuiv;
        var _glGetVertexAttribPointerv = (index, pname, pointer) => {
          if (!pointer) {
            GL.recordError(
              1281
              /* GL_INVALID_VALUE */
            );
            return;
          }
          HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname);
        };
        var _emscripten_glGetVertexAttribPointerv = _glGetVertexAttribPointerv;
        var _glGetVertexAttribfv = (index, pname, params) => {
          emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
        };
        var _emscripten_glGetVertexAttribfv = _glGetVertexAttribfv;
        var _glGetVertexAttribiv = (index, pname, params) => {
          emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
        };
        var _emscripten_glGetVertexAttribiv = _glGetVertexAttribiv;
        function _glHint(x0, x1) {
          GLctx.hint(x0, x1);
        }
        var _emscripten_glHint = _glHint;
        var _glInvalidateFramebuffer = (target, numAttachments, attachments) => {
          var list = tempFixedLengthArray[numAttachments];
          for (var i2 = 0; i2 < numAttachments; i2++) {
            list[i2] = HEAP32[attachments + i2 * 4 >> 2];
          }
          GLctx.invalidateFramebuffer(target, list);
        };
        var _emscripten_glInvalidateFramebuffer = _glInvalidateFramebuffer;
        var _glInvalidateSubFramebuffer = (target, numAttachments, attachments, x, y, width, height) => {
          var list = tempFixedLengthArray[numAttachments];
          for (var i2 = 0; i2 < numAttachments; i2++) {
            list[i2] = HEAP32[attachments + i2 * 4 >> 2];
          }
          GLctx.invalidateSubFramebuffer(target, list, x, y, width, height);
        };
        var _emscripten_glInvalidateSubFramebuffer = _glInvalidateSubFramebuffer;
        var _glIsBuffer = (buffer) => {
          var b = GL.buffers[buffer];
          if (!b) return 0;
          return GLctx.isBuffer(b);
        };
        var _emscripten_glIsBuffer = _glIsBuffer;
        function _glIsEnabled(x0) {
          return GLctx.isEnabled(x0);
        }
        var _emscripten_glIsEnabled = _glIsEnabled;
        var _glIsFramebuffer = (framebuffer) => {
          var fb = GL.framebuffers[framebuffer];
          if (!fb) return 0;
          return GLctx.isFramebuffer(fb);
        };
        var _emscripten_glIsFramebuffer = _glIsFramebuffer;
        var _glIsProgram = (program) => {
          program = GL.programs[program];
          if (!program) return 0;
          return GLctx.isProgram(program);
        };
        var _emscripten_glIsProgram = _glIsProgram;
        var _glIsQuery = (id) => {
          var query = GL.queries[id];
          if (!query) return 0;
          return GLctx.isQuery(query);
        };
        var _emscripten_glIsQuery = _glIsQuery;
        var _glIsQueryEXT = (id) => {
          var query = GL.queries[id];
          if (!query) return 0;
          return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
        };
        var _emscripten_glIsQueryEXT = _glIsQueryEXT;
        var _glIsRenderbuffer = (renderbuffer) => {
          var rb = GL.renderbuffers[renderbuffer];
          if (!rb) return 0;
          return GLctx.isRenderbuffer(rb);
        };
        var _emscripten_glIsRenderbuffer = _glIsRenderbuffer;
        var _glIsSampler = (id) => {
          var sampler = GL.samplers[id];
          if (!sampler) return 0;
          return GLctx.isSampler(sampler);
        };
        var _emscripten_glIsSampler = _glIsSampler;
        var _glIsShader = (shader) => {
          var s = GL.shaders[shader];
          if (!s) return 0;
          return GLctx.isShader(s);
        };
        var _emscripten_glIsShader = _glIsShader;
        var _glIsSync = (sync) => GLctx.isSync(GL.syncs[sync]);
        var _emscripten_glIsSync = _glIsSync;
        var _glIsTexture = (id) => {
          var texture = GL.textures[id];
          if (!texture) return 0;
          return GLctx.isTexture(texture);
        };
        var _emscripten_glIsTexture = _glIsTexture;
        var _glIsTransformFeedback = (id) => GLctx.isTransformFeedback(GL.transformFeedbacks[id]);
        var _emscripten_glIsTransformFeedback = _glIsTransformFeedback;
        var _glIsVertexArray = (array2) => {
          var vao = GL.vaos[array2];
          if (!vao) return 0;
          return GLctx.isVertexArray(vao);
        };
        var _emscripten_glIsVertexArray = _glIsVertexArray;
        var _glIsVertexArrayOES = _glIsVertexArray;
        var _emscripten_glIsVertexArrayOES = _glIsVertexArrayOES;
        function _glLineWidth(x0) {
          GLctx.lineWidth(x0);
        }
        var _emscripten_glLineWidth = _glLineWidth;
        var _glLinkProgram = (program) => {
          program = GL.programs[program];
          GLctx.linkProgram(program);
          program.uniformLocsById = 0;
          program.uniformSizeAndIdsByName = {};
        };
        var _emscripten_glLinkProgram = _glLinkProgram;
        var _glMultiDrawArraysInstancedBaseInstanceWEBGL = (mode, firsts, counts, instanceCounts, baseInstances, drawCount) => {
          GLctx.mdibvbi["multiDrawArraysInstancedBaseInstanceWEBGL"](
            mode,
            HEAP32,
            firsts >> 2,
            HEAP32,
            counts >> 2,
            HEAP32,
            instanceCounts >> 2,
            HEAPU32,
            baseInstances >> 2,
            drawCount
          );
        };
        var _emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL = _glMultiDrawArraysInstancedBaseInstanceWEBGL;
        var _glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL = (mode, counts, type2, offsets, instanceCounts, baseVertices, baseInstances, drawCount) => {
          GLctx.mdibvbi["multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL"](
            mode,
            HEAP32,
            counts >> 2,
            type2,
            HEAP32,
            offsets >> 2,
            HEAP32,
            instanceCounts >> 2,
            HEAP32,
            baseVertices >> 2,
            HEAPU32,
            baseInstances >> 2,
            drawCount
          );
        };
        var _emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL = _glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL;
        function _glPauseTransformFeedback() {
          GLctx.pauseTransformFeedback();
        }
        var _emscripten_glPauseTransformFeedback = _glPauseTransformFeedback;
        var _glPixelStorei = (pname, param) => {
          if (pname == 3317) {
            GL.unpackAlignment = param;
          }
          GLctx.pixelStorei(pname, param);
        };
        var _emscripten_glPixelStorei = _glPixelStorei;
        function _glPolygonOffset(x0, x1) {
          GLctx.polygonOffset(x0, x1);
        }
        var _emscripten_glPolygonOffset = _glPolygonOffset;
        var _glProgramBinary = (program, binaryFormat, binary, length) => {
          GL.recordError(
            1280
            /*GL_INVALID_ENUM*/
          );
        };
        var _emscripten_glProgramBinary = _glProgramBinary;
        var _glProgramParameteri = (program, pname, value) => {
          GL.recordError(
            1280
            /*GL_INVALID_ENUM*/
          );
        };
        var _emscripten_glProgramParameteri = _glProgramParameteri;
        var _glQueryCounterEXT = (id, target) => {
          GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
        };
        var _emscripten_glQueryCounterEXT = _glQueryCounterEXT;
        function _glReadBuffer(x0) {
          GLctx.readBuffer(x0);
        }
        var _emscripten_glReadBuffer = _glReadBuffer;
        var computeUnpackAlignedImageSize = (width, height, sizePerPixel, alignment) => {
          function roundedToNextMultipleOf(x, y) {
            return x + y - 1 & -y;
          }
          var plainRowSize = width * sizePerPixel;
          var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
          return height * alignedRowSize;
        };
        var colorChannelsInGlTextureFormat = (format) => {
          var colorChannels = {
            // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
            // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
            5: 3,
            6: 4,
            // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
            8: 2,
            29502: 3,
            29504: 4,
            // 0x1903 /* GL_RED */ - 0x1902: 1,
            26917: 2,
            26918: 2,
            // 0x8D94 /* GL_RED_INTEGER */ - 0x1902: 1,
            29846: 3,
            29847: 4
          };
          return colorChannels[format - 6402] || 1;
        };
        var heapObjectForWebGLType = (type2) => {
          type2 -= 5120;
          if (type2 == 0) return HEAP8;
          if (type2 == 1) return HEAPU8;
          if (type2 == 2) return HEAP16;
          if (type2 == 4) return HEAP32;
          if (type2 == 6) return HEAPF32;
          if (type2 == 5 || type2 == 28922 || type2 == 28520 || type2 == 30779 || type2 == 30782)
            return HEAPU32;
          return HEAPU16;
        };
        var heapAccessShiftForWebGLHeap = (heap) => 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
        var emscriptenWebGLGetTexPixelData = (type2, format, width, height, pixels, internalFormat) => {
          var heap = heapObjectForWebGLType(type2);
          var shift = heapAccessShiftForWebGLHeap(heap);
          var byteSize = 1 << shift;
          var sizePerPixel = colorChannelsInGlTextureFormat(format) * byteSize;
          var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
          return heap.subarray(pixels >> shift, pixels + bytes >> shift);
        };
        var _glReadPixels = (x, y, width, height, format, type2, pixels) => {
          if (GL.currentContext.version >= 2) {
            if (GLctx.currentPixelPackBufferBinding) {
              GLctx.readPixels(x, y, width, height, format, type2, pixels);
            } else {
              var heap = heapObjectForWebGLType(type2);
              GLctx.readPixels(x, y, width, height, format, type2, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
            }
            return;
          }
          var pixelData = emscriptenWebGLGetTexPixelData(type2, format, width, height, pixels, format);
          if (!pixelData) {
            GL.recordError(
              1280
              /*GL_INVALID_ENUM*/
            );
            return;
          }
          GLctx.readPixels(x, y, width, height, format, type2, pixelData);
        };
        var _emscripten_glReadPixels = _glReadPixels;
        var _glReleaseShaderCompiler = () => {
        };
        var _emscripten_glReleaseShaderCompiler = _glReleaseShaderCompiler;
        function _glRenderbufferStorage(x0, x1, x2, x3) {
          GLctx.renderbufferStorage(x0, x1, x2, x3);
        }
        var _emscripten_glRenderbufferStorage = _glRenderbufferStorage;
        function _glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
          GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);
        }
        var _emscripten_glRenderbufferStorageMultisample = _glRenderbufferStorageMultisample;
        function _glResumeTransformFeedback() {
          GLctx.resumeTransformFeedback();
        }
        var _emscripten_glResumeTransformFeedback = _glResumeTransformFeedback;
        var _glSampleCoverage = (value, invert) => {
          GLctx.sampleCoverage(value, !!invert);
        };
        var _emscripten_glSampleCoverage = _glSampleCoverage;
        var _glSamplerParameterf = (sampler, pname, param) => {
          GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
        };
        var _emscripten_glSamplerParameterf = _glSamplerParameterf;
        var _glSamplerParameterfv = (sampler, pname, params) => {
          var param = HEAPF32[params >> 2];
          GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
        };
        var _emscripten_glSamplerParameterfv = _glSamplerParameterfv;
        var _glSamplerParameteri = (sampler, pname, param) => {
          GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
        };
        var _emscripten_glSamplerParameteri = _glSamplerParameteri;
        var _glSamplerParameteriv = (sampler, pname, params) => {
          var param = HEAP32[params >> 2];
          GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
        };
        var _emscripten_glSamplerParameteriv = _glSamplerParameteriv;
        function _glScissor(x0, x1, x2, x3) {
          GLctx.scissor(x0, x1, x2, x3);
        }
        var _emscripten_glScissor = _glScissor;
        var _glShaderBinary = (count, shaders, binaryformat, binary, length) => {
          GL.recordError(
            1280
            /*GL_INVALID_ENUM*/
          );
        };
        var _emscripten_glShaderBinary = _glShaderBinary;
        var _glShaderSource = (shader, count, string2, length) => {
          var source = GL.getSource(shader, count, string2, length);
          if (GL.currentContext.version >= 2) {
            if (source.includes("#version 100")) {
              source = source.replace(/#extension GL_OES_standard_derivatives : enable/g, "");
              source = source.replace(/#extension GL_EXT_shader_texture_lod : enable/g, "");
              var prelude = "";
              if (source.includes("gl_FragColor")) {
                prelude += "out mediump vec4 GL_FragColor;\n";
                source = source.replace(/gl_FragColor/g, "GL_FragColor");
              }
              if (source.includes("attribute")) {
                source = source.replace(/attribute/g, "in");
                source = source.replace(/varying/g, "out");
              } else {
                source = source.replace(/varying/g, "in");
              }
              source = source.replace(/textureCubeLodEXT/g, "textureCubeLod");
              source = source.replace(/texture2DLodEXT/g, "texture2DLod");
              source = source.replace(/texture2DProjLodEXT/g, "texture2DProjLod");
              source = source.replace(/texture2DGradEXT/g, "texture2DGrad");
              source = source.replace(/texture2DProjGradEXT/g, "texture2DProjGrad");
              source = source.replace(/textureCubeGradEXT/g, "textureCubeGrad");
              source = source.replace(/textureCube/g, "texture");
              source = source.replace(/texture1D/g, "texture");
              source = source.replace(/texture2D/g, "texture");
              source = source.replace(/texture3D/g, "texture");
              source = source.replace(/#version 100/g, "#version 300 es\n" + prelude);
            }
          }
          GLctx.shaderSource(GL.shaders[shader], source);
        };
        var _emscripten_glShaderSource = _glShaderSource;
        function _glStencilFunc(x0, x1, x2) {
          GLctx.stencilFunc(x0, x1, x2);
        }
        var _emscripten_glStencilFunc = _glStencilFunc;
        function _glStencilFuncSeparate(x0, x1, x2, x3) {
          GLctx.stencilFuncSeparate(x0, x1, x2, x3);
        }
        var _emscripten_glStencilFuncSeparate = _glStencilFuncSeparate;
        function _glStencilMask(x0) {
          GLctx.stencilMask(x0);
        }
        var _emscripten_glStencilMask = _glStencilMask;
        function _glStencilMaskSeparate(x0, x1) {
          GLctx.stencilMaskSeparate(x0, x1);
        }
        var _emscripten_glStencilMaskSeparate = _glStencilMaskSeparate;
        function _glStencilOp(x0, x1, x2) {
          GLctx.stencilOp(x0, x1, x2);
        }
        var _emscripten_glStencilOp = _glStencilOp;
        function _glStencilOpSeparate(x0, x1, x2, x3) {
          GLctx.stencilOpSeparate(x0, x1, x2, x3);
        }
        var _emscripten_glStencilOpSeparate = _glStencilOpSeparate;
        var _glTexImage2D = (target, level, internalFormat, width, height, border, format, type2, pixels) => {
          if (GL.currentContext.version >= 2) {
            if (format == 6402 && internalFormat == 6402 && type2 == 5125) {
              internalFormat = 33190;
            }
            if (type2 == 36193) {
              type2 = 5131;
              if (format == 6408 && internalFormat == 6408) {
                internalFormat = 34842;
              }
            }
            if (internalFormat == 34041) {
              internalFormat = 35056;
            }
          }
          if (GL.currentContext.version >= 2) {
            if (GLctx.currentPixelUnpackBufferBinding) {
              GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type2, pixels);
            } else if (pixels) {
              var heap = heapObjectForWebGLType(type2);
              GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type2, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
            } else {
              GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type2, null);
            }
            return;
          }
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type2, pixels ? emscriptenWebGLGetTexPixelData(type2, format, width, height, pixels, internalFormat) : null);
        };
        var _emscripten_glTexImage2D = _glTexImage2D;
        var _glTexImage3D = (target, level, internalFormat, width, height, depth, border, format, type2, pixels) => {
          if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type2, pixels);
          } else if (pixels) {
            var heap = heapObjectForWebGLType(type2);
            GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type2, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
          } else {
            GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type2, null);
          }
        };
        var _emscripten_glTexImage3D = _glTexImage3D;
        function _glTexParameterf(x0, x1, x2) {
          GLctx.texParameterf(x0, x1, x2);
        }
        var _emscripten_glTexParameterf = _glTexParameterf;
        var _glTexParameterfv = (target, pname, params) => {
          var param = HEAPF32[params >> 2];
          GLctx.texParameterf(target, pname, param);
        };
        var _emscripten_glTexParameterfv = _glTexParameterfv;
        function _glTexParameteri(x0, x1, x2) {
          GLctx.texParameteri(x0, x1, x2);
        }
        var _emscripten_glTexParameteri = _glTexParameteri;
        var _glTexParameteriv = (target, pname, params) => {
          var param = HEAP32[params >> 2];
          GLctx.texParameteri(target, pname, param);
        };
        var _emscripten_glTexParameteriv = _glTexParameteriv;
        function _glTexStorage2D(x0, x1, x2, x3, x4) {
          GLctx.texStorage2D(x0, x1, x2, x3, x4);
        }
        var _emscripten_glTexStorage2D = _glTexStorage2D;
        function _glTexStorage3D(x0, x1, x2, x3, x4, x5) {
          GLctx.texStorage3D(x0, x1, x2, x3, x4, x5);
        }
        var _emscripten_glTexStorage3D = _glTexStorage3D;
        var _glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type2, pixels) => {
          if (GL.currentContext.version >= 2) {
            if (type2 == 36193) type2 = 5131;
          }
          if (GL.currentContext.version >= 2) {
            if (GLctx.currentPixelUnpackBufferBinding) {
              GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type2, pixels);
            } else if (pixels) {
              var heap = heapObjectForWebGLType(type2);
              GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type2, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
            } else {
              GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type2, null);
            }
            return;
          }
          var pixelData = null;
          if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type2, format, width, height, pixels, 0);
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type2, pixelData);
        };
        var _emscripten_glTexSubImage2D = _glTexSubImage2D;
        var _glTexSubImage3D = (target, level, xoffset, yoffset, zoffset, width, height, depth, format, type2, pixels) => {
          if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type2, pixels);
          } else if (pixels) {
            var heap = heapObjectForWebGLType(type2);
            GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type2, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
          } else {
            GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type2, null);
          }
        };
        var _emscripten_glTexSubImage3D = _glTexSubImage3D;
        var _glTransformFeedbackVaryings = (program, count, varyings, bufferMode) => {
          program = GL.programs[program];
          var vars = [];
          for (var i2 = 0; i2 < count; i2++)
            vars.push(UTF8ToString(HEAP32[varyings + i2 * 4 >> 2]));
          GLctx.transformFeedbackVaryings(program, vars, bufferMode);
        };
        var _emscripten_glTransformFeedbackVaryings = _glTransformFeedbackVaryings;
        var _glUniform1f = (location2, v0) => {
          GLctx.uniform1f(webglGetUniformLocation(location2), v0);
        };
        var _emscripten_glUniform1f = _glUniform1f;
        var miniTempWebGLFloatBuffers = [];
        var _glUniform1fv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform1fv(webglGetUniformLocation(location2), HEAPF32, value >> 2, count);
            return;
          }
          if (count <= 288) {
            var view = miniTempWebGLFloatBuffers[count - 1];
            for (var i2 = 0; i2 < count; ++i2) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2);
          }
          GLctx.uniform1fv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform1fv = _glUniform1fv;
        var _glUniform1i = (location2, v0) => {
          GLctx.uniform1i(webglGetUniformLocation(location2), v0);
        };
        var _emscripten_glUniform1i = _glUniform1i;
        var miniTempWebGLIntBuffers = [];
        var _glUniform1iv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform1iv(webglGetUniformLocation(location2), HEAP32, value >> 2, count);
            return;
          }
          if (count <= 288) {
            var view = miniTempWebGLIntBuffers[count - 1];
            for (var i2 = 0; i2 < count; ++i2) {
              view[i2] = HEAP32[value + 4 * i2 >> 2];
            }
          } else {
            var view = HEAP32.subarray(value >> 2, value + count * 4 >> 2);
          }
          GLctx.uniform1iv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform1iv = _glUniform1iv;
        var _glUniform1ui = (location2, v0) => {
          GLctx.uniform1ui(webglGetUniformLocation(location2), v0);
        };
        var _emscripten_glUniform1ui = _glUniform1ui;
        var _glUniform1uiv = (location2, count, value) => {
          count && GLctx.uniform1uiv(webglGetUniformLocation(location2), HEAPU32, value >> 2, count);
        };
        var _emscripten_glUniform1uiv = _glUniform1uiv;
        var _glUniform2f = (location2, v0, v1) => {
          GLctx.uniform2f(webglGetUniformLocation(location2), v0, v1);
        };
        var _emscripten_glUniform2f = _glUniform2f;
        var _glUniform2fv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform2fv(webglGetUniformLocation(location2), HEAPF32, value >> 2, count * 2);
            return;
          }
          if (count <= 144) {
            var view = miniTempWebGLFloatBuffers[2 * count - 1];
            for (var i2 = 0; i2 < 2 * count; i2 += 2) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2);
          }
          GLctx.uniform2fv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform2fv = _glUniform2fv;
        var _glUniform2i = (location2, v0, v1) => {
          GLctx.uniform2i(webglGetUniformLocation(location2), v0, v1);
        };
        var _emscripten_glUniform2i = _glUniform2i;
        var _glUniform2iv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform2iv(webglGetUniformLocation(location2), HEAP32, value >> 2, count * 2);
            return;
          }
          if (count <= 144) {
            var view = miniTempWebGLIntBuffers[2 * count - 1];
            for (var i2 = 0; i2 < 2 * count; i2 += 2) {
              view[i2] = HEAP32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAP32[value + (4 * i2 + 4) >> 2];
            }
          } else {
            var view = HEAP32.subarray(value >> 2, value + count * 8 >> 2);
          }
          GLctx.uniform2iv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform2iv = _glUniform2iv;
        var _glUniform2ui = (location2, v0, v1) => {
          GLctx.uniform2ui(webglGetUniformLocation(location2), v0, v1);
        };
        var _emscripten_glUniform2ui = _glUniform2ui;
        var _glUniform2uiv = (location2, count, value) => {
          count && GLctx.uniform2uiv(webglGetUniformLocation(location2), HEAPU32, value >> 2, count * 2);
        };
        var _emscripten_glUniform2uiv = _glUniform2uiv;
        var _glUniform3f = (location2, v0, v1, v2) => {
          GLctx.uniform3f(webglGetUniformLocation(location2), v0, v1, v2);
        };
        var _emscripten_glUniform3f = _glUniform3f;
        var _glUniform3fv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform3fv(webglGetUniformLocation(location2), HEAPF32, value >> 2, count * 3);
            return;
          }
          if (count <= 96) {
            var view = miniTempWebGLFloatBuffers[3 * count - 1];
            for (var i2 = 0; i2 < 3 * count; i2 += 3) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2);
          }
          GLctx.uniform3fv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform3fv = _glUniform3fv;
        var _glUniform3i = (location2, v0, v1, v2) => {
          GLctx.uniform3i(webglGetUniformLocation(location2), v0, v1, v2);
        };
        var _emscripten_glUniform3i = _glUniform3i;
        var _glUniform3iv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform3iv(webglGetUniformLocation(location2), HEAP32, value >> 2, count * 3);
            return;
          }
          if (count <= 96) {
            var view = miniTempWebGLIntBuffers[3 * count - 1];
            for (var i2 = 0; i2 < 3 * count; i2 += 3) {
              view[i2] = HEAP32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAP32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAP32[value + (4 * i2 + 8) >> 2];
            }
          } else {
            var view = HEAP32.subarray(value >> 2, value + count * 12 >> 2);
          }
          GLctx.uniform3iv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform3iv = _glUniform3iv;
        var _glUniform3ui = (location2, v0, v1, v2) => {
          GLctx.uniform3ui(webglGetUniformLocation(location2), v0, v1, v2);
        };
        var _emscripten_glUniform3ui = _glUniform3ui;
        var _glUniform3uiv = (location2, count, value) => {
          count && GLctx.uniform3uiv(webglGetUniformLocation(location2), HEAPU32, value >> 2, count * 3);
        };
        var _emscripten_glUniform3uiv = _glUniform3uiv;
        var _glUniform4f = (location2, v0, v1, v2, v3) => {
          GLctx.uniform4f(webglGetUniformLocation(location2), v0, v1, v2, v3);
        };
        var _emscripten_glUniform4f = _glUniform4f;
        var _glUniform4fv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform4fv(webglGetUniformLocation(location2), HEAPF32, value >> 2, count * 4);
            return;
          }
          if (count <= 72) {
            var view = miniTempWebGLFloatBuffers[4 * count - 1];
            var heap = HEAPF32;
            value >>= 2;
            for (var i2 = 0; i2 < 4 * count; i2 += 4) {
              var dst = value + i2;
              view[i2] = heap[dst];
              view[i2 + 1] = heap[dst + 1];
              view[i2 + 2] = heap[dst + 2];
              view[i2 + 3] = heap[dst + 3];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
          }
          GLctx.uniform4fv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform4fv = _glUniform4fv;
        var _glUniform4i = (location2, v0, v1, v2, v3) => {
          GLctx.uniform4i(webglGetUniformLocation(location2), v0, v1, v2, v3);
        };
        var _emscripten_glUniform4i = _glUniform4i;
        var _glUniform4iv = (location2, count, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniform4iv(webglGetUniformLocation(location2), HEAP32, value >> 2, count * 4);
            return;
          }
          if (count <= 72) {
            var view = miniTempWebGLIntBuffers[4 * count - 1];
            for (var i2 = 0; i2 < 4 * count; i2 += 4) {
              view[i2] = HEAP32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAP32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAP32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAP32[value + (4 * i2 + 12) >> 2];
            }
          } else {
            var view = HEAP32.subarray(value >> 2, value + count * 16 >> 2);
          }
          GLctx.uniform4iv(webglGetUniformLocation(location2), view);
        };
        var _emscripten_glUniform4iv = _glUniform4iv;
        var _glUniform4ui = (location2, v0, v1, v2, v3) => {
          GLctx.uniform4ui(webglGetUniformLocation(location2), v0, v1, v2, v3);
        };
        var _emscripten_glUniform4ui = _glUniform4ui;
        var _glUniform4uiv = (location2, count, value) => {
          count && GLctx.uniform4uiv(webglGetUniformLocation(location2), HEAPU32, value >> 2, count * 4);
        };
        var _emscripten_glUniform4uiv = _glUniform4uiv;
        var _glUniformBlockBinding = (program, uniformBlockIndex, uniformBlockBinding) => {
          program = GL.programs[program];
          GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding);
        };
        var _emscripten_glUniformBlockBinding = _glUniformBlockBinding;
        var _glUniformMatrix2fv = (location2, count, transpose, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 4);
            return;
          }
          if (count <= 72) {
            var view = miniTempWebGLFloatBuffers[4 * count - 1];
            for (var i2 = 0; i2 < 4 * count; i2 += 4) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAPF32[value + (4 * i2 + 12) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
          }
          GLctx.uniformMatrix2fv(webglGetUniformLocation(location2), !!transpose, view);
        };
        var _emscripten_glUniformMatrix2fv = _glUniformMatrix2fv;
        var _glUniformMatrix2x3fv = (location2, count, transpose, value) => {
          count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 6);
        };
        var _emscripten_glUniformMatrix2x3fv = _glUniformMatrix2x3fv;
        var _glUniformMatrix2x4fv = (location2, count, transpose, value) => {
          count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 8);
        };
        var _emscripten_glUniformMatrix2x4fv = _glUniformMatrix2x4fv;
        var _glUniformMatrix3fv = (location2, count, transpose, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 9);
            return;
          }
          if (count <= 32) {
            var view = miniTempWebGLFloatBuffers[9 * count - 1];
            for (var i2 = 0; i2 < 9 * count; i2 += 9) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAPF32[value + (4 * i2 + 12) >> 2];
              view[i2 + 4] = HEAPF32[value + (4 * i2 + 16) >> 2];
              view[i2 + 5] = HEAPF32[value + (4 * i2 + 20) >> 2];
              view[i2 + 6] = HEAPF32[value + (4 * i2 + 24) >> 2];
              view[i2 + 7] = HEAPF32[value + (4 * i2 + 28) >> 2];
              view[i2 + 8] = HEAPF32[value + (4 * i2 + 32) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2);
          }
          GLctx.uniformMatrix3fv(webglGetUniformLocation(location2), !!transpose, view);
        };
        var _emscripten_glUniformMatrix3fv = _glUniformMatrix3fv;
        var _glUniformMatrix3x2fv = (location2, count, transpose, value) => {
          count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 6);
        };
        var _emscripten_glUniformMatrix3x2fv = _glUniformMatrix3x2fv;
        var _glUniformMatrix3x4fv = (location2, count, transpose, value) => {
          count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 12);
        };
        var _emscripten_glUniformMatrix3x4fv = _glUniformMatrix3x4fv;
        var _glUniformMatrix4fv = (location2, count, transpose, value) => {
          if (GL.currentContext.version >= 2) {
            count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 16);
            return;
          }
          if (count <= 18) {
            var view = miniTempWebGLFloatBuffers[16 * count - 1];
            var heap = HEAPF32;
            value >>= 2;
            for (var i2 = 0; i2 < 16 * count; i2 += 16) {
              var dst = value + i2;
              view[i2] = heap[dst];
              view[i2 + 1] = heap[dst + 1];
              view[i2 + 2] = heap[dst + 2];
              view[i2 + 3] = heap[dst + 3];
              view[i2 + 4] = heap[dst + 4];
              view[i2 + 5] = heap[dst + 5];
              view[i2 + 6] = heap[dst + 6];
              view[i2 + 7] = heap[dst + 7];
              view[i2 + 8] = heap[dst + 8];
              view[i2 + 9] = heap[dst + 9];
              view[i2 + 10] = heap[dst + 10];
              view[i2 + 11] = heap[dst + 11];
              view[i2 + 12] = heap[dst + 12];
              view[i2 + 13] = heap[dst + 13];
              view[i2 + 14] = heap[dst + 14];
              view[i2 + 15] = heap[dst + 15];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2);
          }
          GLctx.uniformMatrix4fv(webglGetUniformLocation(location2), !!transpose, view);
        };
        var _emscripten_glUniformMatrix4fv = _glUniformMatrix4fv;
        var _glUniformMatrix4x2fv = (location2, count, transpose, value) => {
          count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 8);
        };
        var _emscripten_glUniformMatrix4x2fv = _glUniformMatrix4x2fv;
        var _glUniformMatrix4x3fv = (location2, count, transpose, value) => {
          count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location2), !!transpose, HEAPF32, value >> 2, count * 12);
        };
        var _emscripten_glUniformMatrix4x3fv = _glUniformMatrix4x3fv;
        var _glUseProgram = (program) => {
          program = GL.programs[program];
          GLctx.useProgram(program);
          GLctx.currentProgram = program;
        };
        var _emscripten_glUseProgram = _glUseProgram;
        var _glValidateProgram = (program) => {
          GLctx.validateProgram(GL.programs[program]);
        };
        var _emscripten_glValidateProgram = _glValidateProgram;
        function _glVertexAttrib1f(x0, x1) {
          GLctx.vertexAttrib1f(x0, x1);
        }
        var _emscripten_glVertexAttrib1f = _glVertexAttrib1f;
        var _glVertexAttrib1fv = (index, v) => {
          GLctx.vertexAttrib1f(index, HEAPF32[v >> 2]);
        };
        var _emscripten_glVertexAttrib1fv = _glVertexAttrib1fv;
        function _glVertexAttrib2f(x0, x1, x2) {
          GLctx.vertexAttrib2f(x0, x1, x2);
        }
        var _emscripten_glVertexAttrib2f = _glVertexAttrib2f;
        var _glVertexAttrib2fv = (index, v) => {
          GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2]);
        };
        var _emscripten_glVertexAttrib2fv = _glVertexAttrib2fv;
        function _glVertexAttrib3f(x0, x1, x2, x3) {
          GLctx.vertexAttrib3f(x0, x1, x2, x3);
        }
        var _emscripten_glVertexAttrib3f = _glVertexAttrib3f;
        var _glVertexAttrib3fv = (index, v) => {
          GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2]);
        };
        var _emscripten_glVertexAttrib3fv = _glVertexAttrib3fv;
        function _glVertexAttrib4f(x0, x1, x2, x3, x4) {
          GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);
        }
        var _emscripten_glVertexAttrib4f = _glVertexAttrib4f;
        var _glVertexAttrib4fv = (index, v) => {
          GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2]);
        };
        var _emscripten_glVertexAttrib4fv = _glVertexAttrib4fv;
        var _glVertexAttribDivisor = (index, divisor) => {
          GLctx.vertexAttribDivisor(index, divisor);
        };
        var _emscripten_glVertexAttribDivisor = _glVertexAttribDivisor;
        var _glVertexAttribDivisorANGLE = _glVertexAttribDivisor;
        var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisorANGLE;
        var _glVertexAttribDivisorARB = _glVertexAttribDivisor;
        var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisorARB;
        var _glVertexAttribDivisorEXT = _glVertexAttribDivisor;
        var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisorEXT;
        var _glVertexAttribDivisorNV = _glVertexAttribDivisor;
        var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisorNV;
        function _glVertexAttribI4i(x0, x1, x2, x3, x4) {
          GLctx.vertexAttribI4i(x0, x1, x2, x3, x4);
        }
        var _emscripten_glVertexAttribI4i = _glVertexAttribI4i;
        var _glVertexAttribI4iv = (index, v) => {
          GLctx.vertexAttribI4i(index, HEAP32[v >> 2], HEAP32[v + 4 >> 2], HEAP32[v + 8 >> 2], HEAP32[v + 12 >> 2]);
        };
        var _emscripten_glVertexAttribI4iv = _glVertexAttribI4iv;
        function _glVertexAttribI4ui(x0, x1, x2, x3, x4) {
          GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4);
        }
        var _emscripten_glVertexAttribI4ui = _glVertexAttribI4ui;
        var _glVertexAttribI4uiv = (index, v) => {
          GLctx.vertexAttribI4ui(index, HEAPU32[v >> 2], HEAPU32[v + 4 >> 2], HEAPU32[v + 8 >> 2], HEAPU32[v + 12 >> 2]);
        };
        var _emscripten_glVertexAttribI4uiv = _glVertexAttribI4uiv;
        var _glVertexAttribIPointer = (index, size, type2, stride, ptr) => {
          GLctx.vertexAttribIPointer(index, size, type2, stride, ptr);
        };
        var _emscripten_glVertexAttribIPointer = _glVertexAttribIPointer;
        var _glVertexAttribPointer = (index, size, type2, normalized, stride, ptr) => {
          GLctx.vertexAttribPointer(index, size, type2, !!normalized, stride, ptr);
        };
        var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;
        function _glViewport(x0, x1, x2, x3) {
          GLctx.viewport(x0, x1, x2, x3);
        }
        var _emscripten_glViewport = _glViewport;
        var _glWaitSync = (sync, flags, timeout) => {
          timeout = Number(timeout);
          GLctx.waitSync(GL.syncs[sync], flags, timeout);
        };
        var _emscripten_glWaitSync = _glWaitSync;
        var growMemory = (size) => {
          var b = wasmMemory.buffer;
          var pages = (size - b.byteLength + 65535) / 65536;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
            err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
          }
        };
        var _emscripten_resize_heap = (requestedSize) => {
          var oldSize = HEAPU8.length;
          requestedSize >>>= 0;
          assert3(requestedSize > oldSize);
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
            return false;
          }
          var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
          return false;
        };
        function _emscripten_ubq_codec_createAudioDecoder(codecPtr, codecLength, sampleRate, numberOfChannels, extraDataPtr, extraDataLength, leftBufferPtr, rightBufferPtr, bufferLength) {
          const codec = Module.UTF8ToString(codecPtr, codecPtr + codecLength);
          const extraData = Module.HEAPU8.subarray(
            extraDataPtr,
            extraDataPtr + extraDataLength
          );
          const handle = Module.emscripten_ubq_codec_audioDecoderNextHandle++;
          const decoderConfig = {
            codec,
            sampleRate,
            numberOfChannels,
            description: extraData
          };
          try {
            const audioDecoder = Module.emscripten_ubq_codec_createAudioDecoder(
              leftBufferPtr,
              rightBufferPtr,
              bufferLength
            );
            AudioDecoder.isConfigSupported(decoderConfig).then(
              (supported) => {
                audioDecoder.configUnsupported = !supported;
              },
              () => {
                audioDecoder.configUnsupported = true;
              }
            );
            audioDecoder.configure(decoderConfig);
            Module.emscripten_ubq_codec_audioDecoders.set(handle, {
              audioDecoder,
              decoderConfig,
              leftBufferPtr,
              rightBufferPtr,
              bufferLength
            });
          } catch (error) {
            return Module.emscripten_ubq_codec_createNativeResult({ error });
          }
          return Module.emscripten_ubq_codec_createNativeResult({ handle });
        }
        function _emscripten_ubq_codec_createAudioEncoder(codec, codecLength, sampleRate, numberOfChannels, bitRate, codecServicePtr) {
          const codecString = Module.UTF8ToString(codec, codec + codecLength);
          const handle = Module.emscripten_ubq_codec_audioEncoderNextHandle++;
          const audioEncoderConfig = {
            codec: codecString,
            sampleRate,
            numberOfChannels,
            bitrate: bitRate
          };
          try {
            const audioEncoder = new AudioEncoder({
              output: (chunk) => {
                const buf = Module._malloc(chunk.byteLength);
                const data = Module.HEAPU8.subarray(buf, buf + chunk.byteLength);
                chunk.copyTo(data);
                Module.emscripten_ubq_codec_onOutputEncodedAudioChunk(
                  handle,
                  buf,
                  chunk.byteLength,
                  codecServicePtr
                );
                Module._free(buf);
              },
              error: (e) => {
                const frameIndex = Module.emscripten_ubq_codec_audioEncoders.get(handle).frameIndex;
                if (frameIndex > 1) {
                  console.error(e);
                }
              }
            });
            audioEncoder.configure(audioEncoderConfig);
            Module.emscripten_ubq_codec_audioEncoders.set(handle, {
              audioEncoder,
              audioEncoderConfig,
              frameIndex: 0
            });
          } catch (error) {
            error += ' Requested codec: "' + codecString + '"';
            error += "; sample rate: " + sampleRate;
            error += "; channels: " + numberOfChannels;
            error += "; bit rate: " + bitRate;
            return Module.emscripten_ubq_codec_createNativeResult({ error });
          }
          return Module.emscripten_ubq_codec_createNativeResult({ handle });
        }
        function _emscripten_ubq_codec_createVideoDecoder(codec, codecLength, width, height, extraData, extraDataLength, codecServicePtr) {
          const codecString = Module.UTF8ToString(codec, codec + codecLength);
          const extraDataArray = Module.HEAPU8.subarray(
            extraData,
            extraData + extraDataLength
          );
          const handle = Module.emscripten_ubq_codec_videoDecoderNextHandle++;
          const decoderConfig = {
            codec: codecString,
            codedWidth: width,
            codedHeight: height,
            description: extraDataArray,
            optimizeForLatency: true
          };
          try {
            const videoDecoder = Module.emscripten_ubq_codec_createVideoDecoder(
              handle,
              codecServicePtr
            );
            VideoDecoder.isConfigSupported(decoderConfig).then(
              (supported) => {
                videoDecoder.configUnsupported = !supported;
              },
              () => {
                videoDecoder.configUnsupported = true;
              }
            );
            videoDecoder.configure(decoderConfig);
            Module.emscripten_ubq_codec_videoDecoders.set(handle, {
              videoDecoder,
              decoderConfig,
              codecServicePtr
            });
          } catch (error) {
            return Module.emscripten_ubq_codec_createNativeResult({ error });
          }
          return Module.emscripten_ubq_codec_createNativeResult({ handle });
        }
        function _emscripten_ubq_codec_createVideoEncoder(codec, codecLength, width, height, framerate, bitrate, codecServicePtr) {
          const codecString = Module.UTF8ToString(codec, codec + codecLength);
          const handle = Module.emscripten_ubq_codec_videoEncoderNextHandle++;
          const canvas = Module.specialHTMLTargets["!canvas"];
          canvas.width = width;
          canvas.height = height;
          const encoderConfig = {
            codec: codecString,
            width,
            height,
            avc: {
              format: "annexb"
            },
            framerate
          };
          if (bitrate > 0) {
            encoderConfig.bitrate = bitrate;
          }
          try {
            const videoEncoder = new VideoEncoder({
              output: (chunk) => {
                const buf = Module._malloc(chunk.byteLength);
                const data = Module.HEAPU8.subarray(buf, buf + chunk.byteLength);
                chunk.copyTo(data);
                Module.emscripten_ubq_codec_onOutputEncodedVideoChunk(
                  handle,
                  buf,
                  chunk.byteLength,
                  codecServicePtr
                );
                Module._free(buf);
              },
              error: (e) => console.error(e)
            });
            VideoEncoder.isConfigSupported(encoderConfig).then(
              (supported) => {
                videoEncoder.configUnsupported = !supported;
              },
              () => {
                videoEncoder.configUnsupported = true;
              }
            );
            videoEncoder.configure(encoderConfig);
            Module.emscripten_ubq_codec_videoEncoders.set(handle, {
              videoEncoder,
              encoderConfig,
              groupOfPictures: 150,
              frameIndex: 0
            });
          } catch (error) {
            error += ' Requested codec: "' + codecString + '"';
            error += "; resolution: " + width + "x" + height;
            return Module.emscripten_ubq_codec_createNativeResult({ error });
          }
          return Module.emscripten_ubq_codec_createNativeResult({ handle });
        }
        function _emscripten_ubq_codec_decodeAudioChunk(handle, isSync, cts, duration, data, dataLength) {
          const decoder = Module.emscripten_ubq_codec_audioDecoders.get(handle);
          if (decoder.audioDecoder.unexpectedError) {
            return Module.emscripten_ubq_codec_createNativeResult({
              code: 2,
              error: decoder.audioDecoder.unexpectedError
            });
          }
          if (decoder.audioDecoder.state === "closed") {
            decoder.audioDecoder = Module.emscripten_ubq_codec_createAudioDecoder(
              decoder.leftBufferPtr,
              decoder.rightBufferPtr,
              decoder.bufferLength
            );
            decoder.audioDecoder.configure(decoder.decoderConfig);
          }
          const audioDecoder = decoder.audioDecoder;
          const dataArray = Module.HEAPU8.subarray(data, data + dataLength);
          const chunk = new EncodedAudioChunk({
            type: isSync ? "key" : "delta",
            timestamp: cts,
            duration,
            data: dataArray
          });
          try {
            audioDecoder.decode(chunk);
          } catch (error) {
            if (audioDecoder.configUnsupported) {
              return Module.emscripten_ubq_codec_createNativeResult({
                code: 2,
                error
              });
            }
            return Module.emscripten_ubq_codec_createNativeResult({ code: 1, error });
          }
          return Module.emscripten_ubq_codec_createNativeResult({ code: 0 });
        }
        function _emscripten_ubq_codec_decodeVideoChunk(handle, isSync, cts, duration, dataPtr, dataLength) {
          const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
          if (decoder.videoDecoder.unexpectedError) {
            return Module.emscripten_ubq_codec_createNativeResult({
              code: 2,
              error: decoder.videoDecoder.unexpectedError
            });
          }
          if (decoder.videoDecoder.state === "closed") {
            const textures = decoder.videoDecoder.textures;
            decoder.videoDecoder = Module.emscripten_ubq_codec_createVideoDecoder(
              handle,
              decoder.codecServicePtr
            );
            decoder.videoDecoder.textures = textures;
            decoder.videoDecoder.configure(decoder.decoderConfig);
            return Module.emscripten_ubq_codec_createNativeResult({
              code: 1,
              error: "VideoDecoder was closed"
            });
          }
          const videoDecoder = decoder.videoDecoder;
          const dataArray = Module.HEAPU8.subarray(dataPtr, dataPtr + dataLength);
          const chunk = new EncodedVideoChunk({
            type: isSync ? "key" : "delta",
            timestamp: cts,
            duration,
            data: dataArray
          });
          try {
            videoDecoder.decode(chunk);
          } catch (error) {
            if (videoDecoder.configUnsupported) {
              return Module.emscripten_ubq_codec_createNativeResult({
                code: 2,
                error
              });
            }
            return Module.emscripten_ubq_codec_createNativeResult({ code: 1, error });
          }
          return Module.emscripten_ubq_codec_createNativeResult({ code: 0 });
        }
        function _emscripten_ubq_codec_destroyAudioDecoder(handle) {
          if (Module.emscripten_ubq_codec_audioDecoders.has(handle)) {
            const decoder = Module.emscripten_ubq_codec_audioDecoders.get(handle);
            if (decoder.audioDecoder.state !== "closed") {
              decoder.audioDecoder.close();
            }
            Module.emscripten_ubq_codec_audioDecoders.delete(handle);
          }
        }
        function _emscripten_ubq_codec_destroyAudioEncoder(handle) {
          const encoder = Module.emscripten_ubq_codec_audioEncoders.get(handle);
          if (encoder.audioEncoder.state !== "closed") {
            encoder.audioEncoder.close();
          }
          Module.emscripten_ubq_codec_audioEncoders.delete(handle);
        }
        function _emscripten_ubq_codec_destroyVideoDecoder(handle) {
          if (Module.emscripten_ubq_codec_videoDecoders.has(handle)) {
            const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
            if (decoder.videoDecoder.state !== "closed") {
              decoder.videoDecoder.close();
            }
            Module.emscripten_ubq_codec_videoDecoders.delete(handle);
          }
        }
        function _emscripten_ubq_codec_destroyVideoEncoder(handle) {
          const encoder = Module.emscripten_ubq_codec_videoEncoders.get(handle);
          if (encoder.videoEncoder.state !== "closed") {
            encoder.videoEncoder.close();
          }
          Module.emscripten_ubq_codec_videoEncoders.delete(handle);
        }
        function _emscripten_ubq_codec_encodeAudioData(handle, dataPtr, dataLength) {
          const MICROSECONDS = 1e6;
          const encoder = Module.emscripten_ubq_codec_audioEncoders.get(handle);
          const sampleRate = encoder.audioEncoderConfig.sampleRate;
          const numberOfChannels = encoder.audioEncoderConfig.numberOfChannels;
          const numberOfFrames = dataLength / numberOfChannels;
          const timestamp = Math.round(
            MICROSECONDS * (encoder.frameIndex * numberOfFrames / sampleRate)
          );
          const duration = Math.round(MICROSECONDS * (numberOfFrames / sampleRate));
          const data = Module.HEAPF32.subarray(dataPtr / 4, dataPtr / 4 + dataLength);
          const audioData = new AudioData({
            format: "f32",
            sampleRate,
            numberOfFrames,
            numberOfChannels,
            duration,
            timestamp,
            data
          });
          encoder.audioEncoder.encode(audioData);
          encoder.frameIndex++;
          audioData.close();
        }
        function _emscripten_ubq_codec_encodeVideoFrame(handle, dataPtr, dataLength) {
          const MICROSECONDS = 1e6;
          const encoder = Module.emscripten_ubq_codec_videoEncoders.get(handle);
          const timestamp = Math.round(
            MICROSECONDS * (encoder.frameIndex / encoder.encoderConfig.framerate)
          );
          const keyFrame = encoder.frameIndex % encoder.groupOfPictures === 0;
          const duration = Math.round(MICROSECONDS / encoder.encoderConfig.framerate);
          const canvas = Module.specialHTMLTargets["!canvas"];
          const frame = new VideoFrame(canvas, { timestamp, duration });
          encoder.videoEncoder.encode(frame, { keyFrame });
          frame.close();
          encoder.frameIndex++;
        }
        async function _emscripten_ubq_codec_finalizeAudioEncoding(handle, codecServicePtr) {
          const encoder = Module.emscripten_ubq_codec_audioEncoders.get(handle);
          try {
            await encoder.audioEncoder.flush();
          } catch {
            if (encoder.frameIndex > 1) {
              throw new Error("AudioEncoder.flush() failed");
            }
          }
          Module.emscripten_ubq_codec_onFinalizedAudioEncoding(
            handle,
            codecServicePtr
          );
        }
        async function _emscripten_ubq_codec_finalizeVideoEncoding(handle, codecServicePtr) {
          const encoder = Module.emscripten_ubq_codec_videoEncoders.get(handle);
          await encoder.videoEncoder.flush();
          Module.emscripten_ubq_codec_onFinalizedVideoEncoding(
            handle,
            codecServicePtr
          );
        }
        async function _emscripten_ubq_codec_flushAudioDecoder(handle, initialWrittenFrames) {
          const decoder = Module.emscripten_ubq_codec_audioDecoders.get(handle);
          const audioDecoder = decoder.audioDecoder;
          audioDecoder.flushing = true;
          try {
            await audioDecoder.flush();
          } catch {
          }
          audioDecoder.flushing = false;
          audioDecoder.writtenFrames = initialWrittenFrames;
        }
        async function _emscripten_ubq_codec_flushVideoDecoder(handle, initialDecodedFrames, shouldDropFrames) {
          const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
          const videoDecoder = decoder.videoDecoder;
          videoDecoder.shouldDropFrames = shouldDropFrames;
          videoDecoder.flushing = true;
          try {
            await videoDecoder.flush();
          } catch {
          }
          videoDecoder.flushing = false;
          videoDecoder.shouldDropFrames = false;
          videoDecoder.decodedFrames = initialDecodedFrames;
        }
        function _emscripten_ubq_codec_getAudioDecoderQueueSize(handle) {
          const decoder = Module.emscripten_ubq_codec_audioDecoders.get(handle);
          return decoder.audioDecoder.decodeQueueSize;
        }
        function _emscripten_ubq_codec_getNumberOfDecodedVideoFrames(handle) {
          const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
          const videoDecoder = decoder.videoDecoder;
          return videoDecoder.decodedFrames;
        }
        function _emscripten_ubq_codec_getWrittenAudioFrames(handle) {
          const decoder = Module.emscripten_ubq_codec_audioDecoders.get(handle);
          return decoder.audioDecoder.writtenFrames;
        }
        function _emscripten_ubq_codec_isFlushingAudioDecoder(handle) {
          const decoder = Module.emscripten_ubq_codec_audioDecoders.get(handle);
          return decoder.audioDecoder.flushing;
        }
        function _emscripten_ubq_codec_isFlushingVideoDecoder(handle) {
          const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
          return decoder.videoDecoder.flushing;
        }
        function _emscripten_ubq_codec_isSupported() {
          return typeof VideoFrame !== "undefined" && typeof VideoDecoder !== "undefined" && typeof VideoEncoder !== "undefined" && typeof AudioDecoder !== "undefined" && typeof AudioEncoder !== "undefined";
        }
        function _emscripten_ubq_codec_setRequestedVideoFrame(handle, requestedFrame) {
          const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
          decoder.videoDecoder.requestedFrame = requestedFrame;
        }
        function _emscripten_ubq_codec_setVideoTextures(handle, nativeTexturesPtr, length) {
          const decoder = Module.emscripten_ubq_codec_videoDecoders.get(handle);
          const nativeTexturesArray = Module.HEAPU32.subarray(
            nativeTexturesPtr / 4,
            nativeTexturesPtr / 4 + length
          );
          decoder.videoDecoder.textures = [];
          for (let i2 = 0; i2 < length; i2++) {
            decoder.videoDecoder.textures[i2] = GL.textures[nativeTexturesArray[i2]];
          }
        }
        function _emscripten_ubq_fetch_allocateFetchResult(identifier) {
          const process2 = Module.emscripten_ubq_asyncFetchManager.getProcess(identifier);
          if (process2 === null || process2 === void 0 ? void 0 : process2.allocate()) {
            return true;
          } else {
            return false;
          }
        }
        function _emscripten_ubq_fetch_clear() {
          Module.emscripten_ubq_asyncFetchManager.clear();
        }
        function _emscripten_ubq_fetch_createHeader(key, keyLength, value, valueLength) {
          return Module.emscripten_ubq_asyncFetchManager.createHeader(key, keyLength, value, valueLength);
        }
        function _emscripten_ubq_fetch_deleteHeader(identifier) {
          Module.emscripten_ubq_asyncFetchManager.deleteHeader(identifier);
        }
        function _emscripten_ubq_fetch_dispatchAsyncFetch(methodIndex, uri, uriLength, headerHandles, headerHandleCount, requestBody, bodyLength, credentials, credentialsLength) {
          const process2 = Module.emscripten_ubq_asyncFetchManager.fetch(methodIndex, uri, uriLength, headerHandles, headerHandleCount, requestBody, bodyLength, credentials, credentialsLength);
          return process2.handle;
        }
        function _emscripten_ubq_fetch_freeFetchResult(identifier) {
          return Module.emscripten_ubq_asyncFetchManager.deleteProcess(identifier);
        }
        function _emscripten_ubq_fetch_getFetchCompletedBytes(identifier) {
          var _a, _b;
          return (_b = (_a = Module.emscripten_ubq_asyncFetchManager.getProcess(identifier)) === null || _a === void 0 ? void 0 : _a.receivedLength) !== null && _b !== void 0 ? _b : 0;
        }
        function _emscripten_ubq_fetch_getFetchResultAddress(identifier) {
          const process2 = Module.emscripten_ubq_asyncFetchManager.getProcess(identifier);
          if (process2 === null || process2 === void 0 ? void 0 : process2.isAllocated()) {
            return process2.resultAddress;
          } else {
            return -1;
          }
        }
        function _emscripten_ubq_fetch_getFetchResultLength(identifier) {
          const process2 = Module.emscripten_ubq_asyncFetchManager.getProcess(identifier);
          if (process2 === null || process2 === void 0 ? void 0 : process2.isAllocated()) {
            return process2.resultLength;
          } else {
            return -1;
          }
        }
        function _emscripten_ubq_fetch_getFetchState(identifier) {
          var _a, _b;
          return (_b = (_a = Module.emscripten_ubq_asyncFetchManager.getProcess(identifier)) === null || _a === void 0 ? void 0 : _a.state) !== null && _b !== void 0 ? _b : -1;
        }
        function _emscripten_ubq_fetch_getFetchTotalBytes(identifier) {
          var _a, _b;
          return (_b = (_a = Module.emscripten_ubq_asyncFetchManager.getProcess(identifier)) === null || _a === void 0 ? void 0 : _a.totalBytes) !== null && _b !== void 0 ? _b : 0;
        }
        function _emscripten_ubq_settings_getForceWebGL1() {
          return !!Module.emscripten_ubq_settings_forceWebGL1;
        }
        var withStackSave = (f) => {
          var stack = stackSave();
          var ret = f();
          stackRestore(stack);
          return ret;
        };
        var JSEvents = {
          removeAllEventListeners() {
            while (JSEvents.eventHandlers.length) {
              JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
            }
            JSEvents.deferredCalls = [];
          },
          inEventHandler: 0,
          deferredCalls: [],
          deferCall(targetFunction, precedence, argsList) {
            function arraysHaveEqualContent(arrA, arrB) {
              if (arrA.length != arrB.length) return false;
              for (var i3 in arrA) {
                if (arrA[i3] != arrB[i3]) return false;
              }
              return true;
            }
            for (var i2 in JSEvents.deferredCalls) {
              var call = JSEvents.deferredCalls[i2];
              if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                return;
              }
            }
            JSEvents.deferredCalls.push({
              targetFunction,
              precedence,
              argsList
            });
            JSEvents.deferredCalls.sort((x, y) => x.precedence < y.precedence);
          },
          removeDeferredCalls(targetFunction) {
            for (var i2 = 0; i2 < JSEvents.deferredCalls.length; ++i2) {
              if (JSEvents.deferredCalls[i2].targetFunction == targetFunction) {
                JSEvents.deferredCalls.splice(i2, 1);
                --i2;
              }
            }
          },
          canPerformEventHandlerRequests() {
            if (navigator.userActivation) {
              return navigator.userActivation.isActive;
            }
            return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
          },
          runDeferredCalls() {
            if (!JSEvents.canPerformEventHandlerRequests()) {
              return;
            }
            for (var i2 = 0; i2 < JSEvents.deferredCalls.length; ++i2) {
              var call = JSEvents.deferredCalls[i2];
              JSEvents.deferredCalls.splice(i2, 1);
              --i2;
              call.targetFunction.apply(null, call.argsList);
            }
          },
          eventHandlers: [],
          removeAllHandlersOnTarget: (target, eventTypeString) => {
            for (var i2 = 0; i2 < JSEvents.eventHandlers.length; ++i2) {
              if (JSEvents.eventHandlers[i2].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i2].eventTypeString)) {
                JSEvents._removeHandler(i2--);
              }
            }
          },
          _removeHandler(i2) {
            var h = JSEvents.eventHandlers[i2];
            h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
            JSEvents.eventHandlers.splice(i2, 1);
          },
          registerOrRemoveHandler(eventHandler) {
            if (!eventHandler.target) {
              err("registerOrRemoveHandler: the target element for event handler registration does not exist, when processing the following event handler registration:");
              console.dir(eventHandler);
              return -4;
            }
            if (eventHandler.callbackfunc) {
              eventHandler.eventListenerFunc = function(event) {
                ++JSEvents.inEventHandler;
                JSEvents.currentEventHandler = eventHandler;
                JSEvents.runDeferredCalls();
                eventHandler.handlerFunc(event);
                JSEvents.runDeferredCalls();
                --JSEvents.inEventHandler;
              };
              eventHandler.target.addEventListener(
                eventHandler.eventTypeString,
                eventHandler.eventListenerFunc,
                eventHandler.useCapture
              );
              JSEvents.eventHandlers.push(eventHandler);
            } else {
              for (var i2 = 0; i2 < JSEvents.eventHandlers.length; ++i2) {
                if (JSEvents.eventHandlers[i2].target == eventHandler.target && JSEvents.eventHandlers[i2].eventTypeString == eventHandler.eventTypeString) {
                  JSEvents._removeHandler(i2--);
                }
              }
            }
            return 0;
          },
          getNodeNameForTarget(target) {
            if (!target) return "";
            if (target == window) return "#window";
            if (target == screen) return "#screen";
            return target?.nodeName || "";
          },
          fullscreenEnabled() {
            return document.fullscreenEnabled || document.webkitFullscreenEnabled;
          }
        };
        var emscripten_webgl_power_preferences = ["default", "low-power", "high-performance"];
        var maybeCStringToJsString = (cString) => {
          return cString > 2 ? UTF8ToString(cString) : cString;
        };
        var specialHTMLTargets = [0, typeof document != "undefined" ? document : 0, typeof window != "undefined" ? window : 0];
        var findEventTarget = (target) => {
          target = maybeCStringToJsString(target);
          var domElement = specialHTMLTargets[target] || (typeof document != "undefined" ? document.querySelector(target) : void 0);
          return domElement;
        };
        var findCanvasEventTarget = findEventTarget;
        var _emscripten_webgl_do_create_context = (target, attributes) => {
          assert3(attributes);
          var a = attributes >> 2;
          var powerPreference = HEAP32[a + (24 >> 2)];
          var contextAttributes = {
            "alpha": !!HEAP32[a + (0 >> 2)],
            "depth": !!HEAP32[a + (4 >> 2)],
            "stencil": !!HEAP32[a + (8 >> 2)],
            "antialias": !!HEAP32[a + (12 >> 2)],
            "premultipliedAlpha": !!HEAP32[a + (16 >> 2)],
            "preserveDrawingBuffer": !!HEAP32[a + (20 >> 2)],
            "powerPreference": emscripten_webgl_power_preferences[powerPreference],
            "failIfMajorPerformanceCaveat": !!HEAP32[a + (28 >> 2)],
            // The following are not predefined WebGL context attributes in the WebGL specification, so the property names can be minified by Closure.
            majorVersion: HEAP32[a + (32 >> 2)],
            minorVersion: HEAP32[a + (36 >> 2)],
            enableExtensionsByDefault: HEAP32[a + (40 >> 2)],
            explicitSwapControl: HEAP32[a + (44 >> 2)],
            proxyContextToMainThread: HEAP32[a + (48 >> 2)],
            renderViaOffscreenBackBuffer: HEAP32[a + (52 >> 2)]
          };
          var canvas = findCanvasEventTarget(target);
          if (!canvas) {
            return 0;
          }
          if (contextAttributes.explicitSwapControl) {
            return 0;
          }
          var contextHandle = GL.createContext(canvas, contextAttributes);
          return contextHandle;
        };
        var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;
        var _emscripten_webgl_destroy_context = (contextHandle) => {
          if (GL.currentContext == contextHandle) GL.currentContext = 0;
          GL.deleteContext(contextHandle);
        };
        var webgl_enable_OES_vertex_array_object = (ctx) => {
          var ext = ctx.getExtension("OES_vertex_array_object");
          if (ext) {
            ctx["createVertexArray"] = () => ext["createVertexArrayOES"]();
            ctx["deleteVertexArray"] = (vao) => ext["deleteVertexArrayOES"](vao);
            ctx["bindVertexArray"] = (vao) => ext["bindVertexArrayOES"](vao);
            ctx["isVertexArray"] = (vao) => ext["isVertexArrayOES"](vao);
            return 1;
          }
        };
        var _emscripten_webgl_enable_OES_vertex_array_object = (ctx) => webgl_enable_OES_vertex_array_object(GL.contexts[ctx].GLctx);
        var webgl_enable_WEBGL_draw_buffers = (ctx) => {
          var ext = ctx.getExtension("WEBGL_draw_buffers");
          if (ext) {
            ctx["drawBuffers"] = (n, bufs) => ext["drawBuffersWEBGL"](n, bufs);
            return 1;
          }
        };
        var _emscripten_webgl_enable_WEBGL_draw_buffers = (ctx) => webgl_enable_WEBGL_draw_buffers(GL.contexts[ctx].GLctx);
        var webgl_enable_WEBGL_multi_draw = (ctx) => {
          return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
        };
        var _emscripten_webgl_enable_WEBGL_multi_draw = (ctx) => webgl_enable_WEBGL_multi_draw(GL.contexts[ctx].GLctx);
        var _emscripten_webgl_enable_extension = (contextHandle, extension) => {
          var context = GL.getContext(contextHandle);
          var extString = UTF8ToString(extension);
          if (extString.startsWith("GL_")) extString = extString.substr(3);
          if ([
            "ANGLE_instanced_arrays",
            "OES_vertex_array_object",
            "WEBGL_draw_buffers",
            "WEBGL_multi_draw",
            "WEBGL_draw_instanced_base_vertex_base_instance",
            "WEBGL_multi_draw_instanced_base_vertex_base_instance"
          ].includes(extString)) {
            err("When building with -sGL_SUPPORT_SIMPLE_ENABLE_EXTENSIONS=0, function emscripten_webgl_enable_extension() cannot be used to enable extension " + extString + "! Use one of the functions emscripten_webgl_enable_*() to enable it!");
          }
          var ext = context.GLctx.getExtension(extString);
          return !!ext;
        };
        var _emscripten_webgl_get_context_attributes = (c, a) => {
          if (!a) return -5;
          c = GL.contexts[c];
          if (!c) return -3;
          var t = c.GLctx;
          if (!t) return -3;
          t = t.getContextAttributes();
          HEAP32[a >> 2] = t.alpha;
          HEAP32[a + 4 >> 2] = t.depth;
          HEAP32[a + 8 >> 2] = t.stencil;
          HEAP32[a + 12 >> 2] = t.antialias;
          HEAP32[a + 16 >> 2] = t.premultipliedAlpha;
          HEAP32[a + 20 >> 2] = t.preserveDrawingBuffer;
          var power = t["powerPreference"] && emscripten_webgl_power_preferences.indexOf(t["powerPreference"]);
          HEAP32[a + 24 >> 2] = power;
          HEAP32[a + 28 >> 2] = t.failIfMajorPerformanceCaveat;
          HEAP32[a + 32 >> 2] = c.version;
          HEAP32[a + 36 >> 2] = 0;
          return 0;
        };
        var _emscripten_webgl_make_context_current = (contextHandle) => {
          var success = GL.makeContextCurrent(contextHandle);
          return success ? 0 : -5;
        };
        var ENV = {};
        var getExecutableName = () => {
          return thisProgram || "./this.program";
        };
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
            var env = {
              "USER": "web_user",
              "LOGNAME": "web_user",
              "PATH": "/",
              "PWD": "/",
              "HOME": "/home/web_user",
              "LANG": lang,
              "_": getExecutableName()
            };
            for (var x in ENV) {
              if (ENV[x] === void 0) delete env[x];
              else env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer) => {
          for (var i2 = 0; i2 < str.length; ++i2) {
            assert3(str.charCodeAt(i2) === (str.charCodeAt(i2) & 255));
            HEAP8[buffer++ >> 0] = str.charCodeAt(i2);
          }
          HEAP8[buffer >> 0] = 0;
        };
        var _environ_get = (__environ, environ_buf) => {
          var bufSize = 0;
          getEnvStrings().forEach((string2, i2) => {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + i2 * 4 >> 2] = ptr;
            stringToAscii(string2, ptr);
            bufSize += string2.length + 1;
          });
          return 0;
        };
        var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
          var strings = getEnvStrings();
          HEAPU32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          strings.forEach((string2) => bufSize += string2.length + 1);
          HEAPU32[penviron_buf_size >> 2] = bufSize;
          return 0;
        };
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        function _fd_fdstat_get(fd, pbuf) {
          try {
            var rightsBase = 0;
            var rightsInheriting = 0;
            var flags = 0;
            {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var type2 = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
            }
            HEAP8[pbuf >> 0] = type2;
            HEAP16[pbuf + 2 >> 1] = flags;
            HEAP64[pbuf + 8 >> 3] = BigInt(rightsBase);
            HEAP64[pbuf + 16 >> 3] = BigInt(rightsInheriting);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i2 = 0; i2 < iovcnt; i2++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break;
            if (typeof offset !== "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_pread(fd, iov, iovcnt, offset, pnum) {
          offset = bigintToI53Checked(offset);
          ;
          try {
            if (isNaN(offset)) return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt, offset);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
          ;
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        function _fd_seek(fd, offset, whence, newOffset) {
          offset = bigintToI53Checked(offset);
          ;
          try {
            if (isNaN(offset)) return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            HEAP64[newOffset >> 3] = BigInt(stream.position);
            if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
          ;
        }
        var doWritev = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i2 = 0; i2 < iovcnt; i2++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (typeof offset !== "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var _getentropy = (buffer, size) => {
          randomFill(HEAPU8.subarray(buffer, buffer + size));
          return 0;
        };
        var arraySum = (array2, index) => {
          var sum = 0;
          for (var i2 = 0; i2 <= index; sum += array2[i2++]) {
          }
          return sum;
        };
        var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var addDays = (date, days) => {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        };
        var writeArrayToMemory = (array2, buffer) => {
          assert3(array2.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
          HEAP8.set(array2, buffer);
        };
        var _strftime = (s, maxsize, format, tm) => {
          var tm_zone = HEAPU32[tm + 40 >> 2];
          var date = {
            tm_sec: HEAP32[tm >> 2],
            tm_min: HEAP32[tm + 4 >> 2],
            tm_hour: HEAP32[tm + 8 >> 2],
            tm_mday: HEAP32[tm + 12 >> 2],
            tm_mon: HEAP32[tm + 16 >> 2],
            tm_year: HEAP32[tm + 20 >> 2],
            tm_wday: HEAP32[tm + 24 >> 2],
            tm_yday: HEAP32[tm + 28 >> 2],
            tm_isdst: HEAP32[tm + 32 >> 2],
            tm_gmtoff: HEAP32[tm + 36 >> 2],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
          };
          var pattern = UTF8ToString(format);
          var EXPANSION_RULES_1 = {
            "%c": "%a %b %d %H:%M:%S %Y",
            // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
            "%D": "%m/%d/%y",
            // Equivalent to %m / %d / %y
            "%F": "%Y-%m-%d",
            // Equivalent to %Y - %m - %d
            "%h": "%b",
            // Equivalent to %b
            "%r": "%I:%M:%S %p",
            // Replaced by the time in a.m. and p.m. notation
            "%R": "%H:%M",
            // Replaced by the time in 24-hour notation
            "%T": "%H:%M:%S",
            // Replaced by the time
            "%x": "%m/%d/%y",
            // Replaced by the locale's appropriate date representation
            "%X": "%H:%M:%S",
            // Replaced by the locale's appropriate time representation
            // Modified Conversion Specifiers
            "%Ec": "%c",
            // Replaced by the locale's alternative appropriate date and time representation.
            "%EC": "%C",
            // Replaced by the name of the base year (period) in the locale's alternative representation.
            "%Ex": "%m/%d/%y",
            // Replaced by the locale's alternative date representation.
            "%EX": "%H:%M:%S",
            // Replaced by the locale's alternative time representation.
            "%Ey": "%y",
            // Replaced by the offset from %EC (year only) in the locale's alternative representation.
            "%EY": "%Y",
            // Replaced by the full alternative year representation.
            "%Od": "%d",
            // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
            "%Oe": "%e",
            // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
            "%OH": "%H",
            // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
            "%OI": "%I",
            // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
            "%Om": "%m",
            // Replaced by the month using the locale's alternative numeric symbols.
            "%OM": "%M",
            // Replaced by the minutes using the locale's alternative numeric symbols.
            "%OS": "%S",
            // Replaced by the seconds using the locale's alternative numeric symbols.
            "%Ou": "%u",
            // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
            "%OU": "%U",
            // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
            "%OV": "%V",
            // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
            "%Ow": "%w",
            // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
            "%OW": "%W",
            // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
            "%Oy": "%y"
            // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
          };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            var str = typeof value == "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            var thisDate = addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              }
              return thisDate.getFullYear();
            }
            return thisDate.getFullYear() - 1;
          }
          var EXPANSION_RULES_2 = {
            "%a": (date2) => WEEKDAYS[date2.tm_wday].substring(0, 3),
            "%A": (date2) => WEEKDAYS[date2.tm_wday],
            "%b": (date2) => MONTHS[date2.tm_mon].substring(0, 3),
            "%B": (date2) => MONTHS[date2.tm_mon],
            "%C": (date2) => {
              var year = date2.tm_year + 1900;
              return leadingNulls(year / 100 | 0, 2);
            },
            "%d": (date2) => leadingNulls(date2.tm_mday, 2),
            "%e": (date2) => leadingSomething(date2.tm_mday, 2, " "),
            "%g": (date2) => {
              return getWeekBasedYear(date2).toString().substring(2);
            },
            "%G": getWeekBasedYear,
            "%H": (date2) => leadingNulls(date2.tm_hour, 2),
            "%I": (date2) => {
              var twelveHour = date2.tm_hour;
              if (twelveHour == 0) twelveHour = 12;
              else if (twelveHour > 12) twelveHour -= 12;
              return leadingNulls(twelveHour, 2);
            },
            "%j": (date2) => {
              return leadingNulls(date2.tm_mday + arraySum(isLeapYear(date2.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3);
            },
            "%m": (date2) => leadingNulls(date2.tm_mon + 1, 2),
            "%M": (date2) => leadingNulls(date2.tm_min, 2),
            "%n": () => "\n",
            "%p": (date2) => {
              if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
                return "AM";
              }
              return "PM";
            },
            "%S": (date2) => leadingNulls(date2.tm_sec, 2),
            "%t": () => "	",
            "%u": (date2) => date2.tm_wday || 7,
            "%U": (date2) => {
              var days = date2.tm_yday + 7 - date2.tm_wday;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%V": (date2) => {
              var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
              if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
                val++;
              }
              if (!val) {
                val = 52;
                var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
                if (dec31 == 4 || dec31 == 5 && isLeapYear(date2.tm_year % 400 - 1)) {
                  val++;
                }
              } else if (val == 53) {
                var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
                if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date2.tm_year)))
                  val = 1;
              }
              return leadingNulls(val, 2);
            },
            "%w": (date2) => date2.tm_wday,
            "%W": (date2) => {
              var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%y": (date2) => {
              return (date2.tm_year + 1900).toString().substring(2);
            },
            // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
            "%Y": (date2) => date2.tm_year + 1900,
            "%z": (date2) => {
              var off = date2.tm_gmtoff;
              var ahead = off >= 0;
              off = Math.abs(off) / 60;
              off = off / 60 * 100 + off % 60;
              return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
            },
            "%Z": (date2) => date2.tm_zone,
            "%%": () => "%"
          };
          pattern = pattern.replace(/%%/g, "\0\0");
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.includes(rule)) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          pattern = pattern.replace(/\0\0/g, "%");
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        };
        var _strftime_l = (s, maxsize, format, tm, loc) => {
          return _strftime(s, maxsize, format, tm);
        };
        var stringToUTF8OnStack = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var getCFunc = (ident) => {
          var func = Module["_" + ident];
          assert3(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        };
        var ccall = (ident, returnType, argTypes, args, opts) => {
          var toC = {
            "string": (str) => {
              var ret2 = 0;
              if (str !== null && str !== void 0 && str !== 0) {
                ret2 = stringToUTF8OnStack(str);
              }
              return ret2;
            },
            "array": (arr) => {
              var ret2 = stackAlloc(arr.length);
              writeArrayToMemory(arr, ret2);
              return ret2;
            }
          };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              return UTF8ToString(ret2);
            }
            if (returnType === "boolean") return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          assert3(returnType !== "array", 'Return type should not be "array".');
          if (args) {
            for (var i2 = 0; i2 < args.length; i2++) {
              var converter = toC[argTypes[i2]];
              if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i2] = converter(args[i2]);
              } else {
                cArgs[i2] = args[i2];
              }
            }
          }
          var ret = func.apply(null, cArgs);
          function onDone(ret2) {
            if (stack !== 0) stackRestore(stack);
            return convertReturnValue(ret2);
          }
          ret = onDone(ret);
          return ret;
        };
        var FS_unlink = (path) => FS.unlink(path);
        var FSNode = (
          /** @constructor */
          function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          }
        );
        var readMode = 292 | 73;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, {
          read: {
            get: (
              /** @this{FSNode} */
              function() {
                return (this.mode & readMode) === readMode;
              }
            ),
            set: (
              /** @this{FSNode} */
              function(val) {
                val ? this.mode |= readMode : this.mode &= ~readMode;
              }
            )
          },
          write: {
            get: (
              /** @this{FSNode} */
              function() {
                return (this.mode & writeMode) === writeMode;
              }
            ),
            set: (
              /** @this{FSNode} */
              function(val) {
                val ? this.mode |= writeMode : this.mode &= ~writeMode;
              }
            )
          },
          isFolder: {
            get: (
              /** @this{FSNode} */
              function() {
                return FS.isDir(this.mode);
              }
            )
          },
          isDevice: {
            get: (
              /** @this{FSNode} */
              function() {
                return FS.isChrdev(this.mode);
              }
            )
          }
        });
        FS.FSNode = FSNode;
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS_unlink"] = FS.unlink;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createDevice"] = FS.createDevice;
        ;
        InternalError = Module["InternalError"] = class InternalError extends Error {
          constructor(message) {
            super(message);
            this.name = "InternalError";
          }
        };
        embind_init_charCodes();
        BindingError = Module["BindingError"] = class BindingError extends Error {
          constructor(message) {
            super(message);
            this.name = "BindingError";
          }
        };
        init_ClassHandle();
        init_embind();
        ;
        init_RegisteredPointer();
        UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
        ;
        init_emval();
        ;
        Module["requestFullscreen"] = Browser.requestFullscreen;
        Module["requestFullScreen"] = Browser.requestFullScreen;
        Module["requestAnimationFrame"] = Browser.requestAnimationFrame;
        Module["setCanvasSize"] = Browser.setCanvasSize;
        Module["pauseMainLoop"] = Browser.mainLoop.pause;
        Module["resumeMainLoop"] = Browser.mainLoop.resume;
        Module["getUserMedia"] = Browser.getUserMedia;
        Module["createContext"] = Browser.createContext;
        var preloadedImages = {};
        var preloadedAudios = {};
        ;
        var GLctx;
        ;
        for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
        ;
        var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
        for (var i = 0; i < 288; ++i) {
          miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1);
        }
        ;
        var miniTempWebGLIntBuffersStorage = new Int32Array(288);
        for (var i = 0; i < 288; ++i) {
          miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i + 1);
        }
        ;
        function checkIncomingModuleAPI() {
          ignoredModuleProp("fetchSettings");
        }
        var wasmImports = {
          /** @export */
          __assert_fail: ___assert_fail,
          /** @export */
          __cxa_begin_catch: ___cxa_begin_catch,
          /** @export */
          __cxa_end_catch: ___cxa_end_catch,
          /** @export */
          __cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
          /** @export */
          __cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
          /** @export */
          __cxa_throw: ___cxa_throw,
          /** @export */
          __resumeException: ___resumeException,
          /** @export */
          __syscall_chmod: ___syscall_chmod,
          /** @export */
          __syscall_fchmod: ___syscall_fchmod,
          /** @export */
          __syscall_fcntl64: ___syscall_fcntl64,
          /** @export */
          __syscall_fstat64: ___syscall_fstat64,
          /** @export */
          __syscall_ioctl: ___syscall_ioctl,
          /** @export */
          __syscall_lstat64: ___syscall_lstat64,
          /** @export */
          __syscall_newfstatat: ___syscall_newfstatat,
          /** @export */
          __syscall_openat: ___syscall_openat,
          /** @export */
          __syscall_renameat: ___syscall_renameat,
          /** @export */
          __syscall_rmdir: ___syscall_rmdir,
          /** @export */
          __syscall_stat64: ___syscall_stat64,
          /** @export */
          __syscall_unlinkat: ___syscall_unlinkat,
          /** @export */
          _embind_finalize_value_array: __embind_finalize_value_array,
          /** @export */
          _embind_finalize_value_object: __embind_finalize_value_object,
          /** @export */
          _embind_register_bigint: __embind_register_bigint,
          /** @export */
          _embind_register_bool: __embind_register_bool,
          /** @export */
          _embind_register_class: __embind_register_class,
          /** @export */
          _embind_register_class_constructor: __embind_register_class_constructor,
          /** @export */
          _embind_register_class_function: __embind_register_class_function,
          /** @export */
          _embind_register_emval: __embind_register_emval,
          /** @export */
          _embind_register_enum: __embind_register_enum,
          /** @export */
          _embind_register_enum_value: __embind_register_enum_value,
          /** @export */
          _embind_register_float: __embind_register_float,
          /** @export */
          _embind_register_function: __embind_register_function,
          /** @export */
          _embind_register_integer: __embind_register_integer,
          /** @export */
          _embind_register_memory_view: __embind_register_memory_view,
          /** @export */
          _embind_register_smart_ptr: __embind_register_smart_ptr,
          /** @export */
          _embind_register_std_string: __embind_register_std_string,
          /** @export */
          _embind_register_std_wstring: __embind_register_std_wstring,
          /** @export */
          _embind_register_value_array: __embind_register_value_array,
          /** @export */
          _embind_register_value_array_element: __embind_register_value_array_element,
          /** @export */
          _embind_register_value_object: __embind_register_value_object,
          /** @export */
          _embind_register_value_object_field: __embind_register_value_object_field,
          /** @export */
          _embind_register_void: __embind_register_void,
          /** @export */
          _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
          /** @export */
          _emscripten_throw_longjmp: __emscripten_throw_longjmp,
          /** @export */
          _emval_as: __emval_as,
          /** @export */
          _emval_call: __emval_call,
          /** @export */
          _emval_call_method: __emval_call_method,
          /** @export */
          _emval_decref: __emval_decref,
          /** @export */
          _emval_equals: __emval_equals,
          /** @export */
          _emval_get_global: __emval_get_global,
          /** @export */
          _emval_get_method_caller: __emval_get_method_caller,
          /** @export */
          _emval_get_property: __emval_get_property,
          /** @export */
          _emval_incref: __emval_incref,
          /** @export */
          _emval_instanceof: __emval_instanceof,
          /** @export */
          _emval_is_number: __emval_is_number,
          /** @export */
          _emval_is_string: __emval_is_string,
          /** @export */
          _emval_new_array: __emval_new_array,
          /** @export */
          _emval_new_cstring: __emval_new_cstring,
          /** @export */
          _emval_new_object: __emval_new_object,
          /** @export */
          _emval_run_destructors: __emval_run_destructors,
          /** @export */
          _emval_set_property: __emval_set_property,
          /** @export */
          _emval_take_value: __emval_take_value,
          /** @export */
          _emval_throw: __emval_throw,
          /** @export */
          _emval_typeof: __emval_typeof,
          /** @export */
          _gmtime_js: __gmtime_js,
          /** @export */
          _localtime_js: __localtime_js,
          /** @export */
          _mktime_js: __mktime_js,
          /** @export */
          _mmap_js: __mmap_js,
          /** @export */
          _munmap_js: __munmap_js,
          /** @export */
          _tzset_js: __tzset_js,
          /** @export */
          abort: _abort,
          /** @export */
          clearItem,
          /** @export */
          eglChooseConfig: _eglChooseConfig,
          /** @export */
          eglCreateContext: _eglCreateContext,
          /** @export */
          eglCreateWindowSurface: _eglCreateWindowSurface,
          /** @export */
          eglDestroyContext: _eglDestroyContext,
          /** @export */
          eglDestroySurface: _eglDestroySurface,
          /** @export */
          eglGetConfigAttrib: _eglGetConfigAttrib,
          /** @export */
          eglGetDisplay: _eglGetDisplay,
          /** @export */
          eglGetError: _eglGetError,
          /** @export */
          eglInitialize: _eglInitialize,
          /** @export */
          eglMakeCurrent: _eglMakeCurrent,
          /** @export */
          eglSwapBuffers: _eglSwapBuffers,
          /** @export */
          eglTerminate: _eglTerminate,
          /** @export */
          emscripten_asm_const_int: _emscripten_asm_const_int,
          /** @export */
          emscripten_console_error: _emscripten_console_error,
          /** @export */
          emscripten_console_log: _emscripten_console_log,
          /** @export */
          emscripten_console_warn: _emscripten_console_warn,
          /** @export */
          emscripten_date_now: _emscripten_date_now,
          /** @export */
          emscripten_debugger: _emscripten_debugger,
          /** @export */
          emscripten_err: _emscripten_err,
          /** @export */
          emscripten_get_heap_max: _emscripten_get_heap_max,
          /** @export */
          emscripten_get_now: _emscripten_get_now,
          /** @export */
          emscripten_glActiveTexture: _emscripten_glActiveTexture,
          /** @export */
          emscripten_glAttachShader: _emscripten_glAttachShader,
          /** @export */
          emscripten_glBeginQuery: _emscripten_glBeginQuery,
          /** @export */
          emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
          /** @export */
          emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
          /** @export */
          emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
          /** @export */
          emscripten_glBindBuffer: _emscripten_glBindBuffer,
          /** @export */
          emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
          /** @export */
          emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
          /** @export */
          emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
          /** @export */
          emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
          /** @export */
          emscripten_glBindSampler: _emscripten_glBindSampler,
          /** @export */
          emscripten_glBindTexture: _emscripten_glBindTexture,
          /** @export */
          emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
          /** @export */
          emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
          /** @export */
          emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
          /** @export */
          emscripten_glBlendColor: _emscripten_glBlendColor,
          /** @export */
          emscripten_glBlendEquation: _emscripten_glBlendEquation,
          /** @export */
          emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
          /** @export */
          emscripten_glBlendFunc: _emscripten_glBlendFunc,
          /** @export */
          emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
          /** @export */
          emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
          /** @export */
          emscripten_glBufferData: _emscripten_glBufferData,
          /** @export */
          emscripten_glBufferSubData: _emscripten_glBufferSubData,
          /** @export */
          emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
          /** @export */
          emscripten_glClear: _emscripten_glClear,
          /** @export */
          emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
          /** @export */
          emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
          /** @export */
          emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
          /** @export */
          emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
          /** @export */
          emscripten_glClearColor: _emscripten_glClearColor,
          /** @export */
          emscripten_glClearDepthf: _emscripten_glClearDepthf,
          /** @export */
          emscripten_glClearStencil: _emscripten_glClearStencil,
          /** @export */
          emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
          /** @export */
          emscripten_glColorMask: _emscripten_glColorMask,
          /** @export */
          emscripten_glCompileShader: _emscripten_glCompileShader,
          /** @export */
          emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
          /** @export */
          emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
          /** @export */
          emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
          /** @export */
          emscripten_glCompressedTexSubImage3D: _emscripten_glCompressedTexSubImage3D,
          /** @export */
          emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
          /** @export */
          emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
          /** @export */
          emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
          /** @export */
          emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
          /** @export */
          emscripten_glCreateProgram: _emscripten_glCreateProgram,
          /** @export */
          emscripten_glCreateShader: _emscripten_glCreateShader,
          /** @export */
          emscripten_glCullFace: _emscripten_glCullFace,
          /** @export */
          emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
          /** @export */
          emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
          /** @export */
          emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
          /** @export */
          emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
          /** @export */
          emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
          /** @export */
          emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
          /** @export */
          emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
          /** @export */
          emscripten_glDeleteShader: _emscripten_glDeleteShader,
          /** @export */
          emscripten_glDeleteSync: _emscripten_glDeleteSync,
          /** @export */
          emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
          /** @export */
          emscripten_glDeleteTransformFeedbacks: _emscripten_glDeleteTransformFeedbacks,
          /** @export */
          emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
          /** @export */
          emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
          /** @export */
          emscripten_glDepthFunc: _emscripten_glDepthFunc,
          /** @export */
          emscripten_glDepthMask: _emscripten_glDepthMask,
          /** @export */
          emscripten_glDepthRangef: _emscripten_glDepthRangef,
          /** @export */
          emscripten_glDetachShader: _emscripten_glDetachShader,
          /** @export */
          emscripten_glDisable: _emscripten_glDisable,
          /** @export */
          emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
          /** @export */
          emscripten_glDrawArrays: _emscripten_glDrawArrays,
          /** @export */
          emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
          /** @export */
          emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
          /** @export */
          emscripten_glDrawArraysInstancedARB: _emscripten_glDrawArraysInstancedARB,
          /** @export */
          emscripten_glDrawArraysInstancedBaseInstanceWEBGL: _emscripten_glDrawArraysInstancedBaseInstanceWEBGL,
          /** @export */
          emscripten_glDrawArraysInstancedEXT: _emscripten_glDrawArraysInstancedEXT,
          /** @export */
          emscripten_glDrawArraysInstancedNV: _emscripten_glDrawArraysInstancedNV,
          /** @export */
          emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
          /** @export */
          emscripten_glDrawBuffersEXT: _emscripten_glDrawBuffersEXT,
          /** @export */
          emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
          /** @export */
          emscripten_glDrawElements: _emscripten_glDrawElements,
          /** @export */
          emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
          /** @export */
          emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
          /** @export */
          emscripten_glDrawElementsInstancedARB: _emscripten_glDrawElementsInstancedARB,
          /** @export */
          emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL: _emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL,
          /** @export */
          emscripten_glDrawElementsInstancedEXT: _emscripten_glDrawElementsInstancedEXT,
          /** @export */
          emscripten_glDrawElementsInstancedNV: _emscripten_glDrawElementsInstancedNV,
          /** @export */
          emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
          /** @export */
          emscripten_glEnable: _emscripten_glEnable,
          /** @export */
          emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
          /** @export */
          emscripten_glEndQuery: _emscripten_glEndQuery,
          /** @export */
          emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
          /** @export */
          emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
          /** @export */
          emscripten_glFenceSync: _emscripten_glFenceSync,
          /** @export */
          emscripten_glFinish: _emscripten_glFinish,
          /** @export */
          emscripten_glFlush: _emscripten_glFlush,
          /** @export */
          emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
          /** @export */
          emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
          /** @export */
          emscripten_glFramebufferTextureLayer: _emscripten_glFramebufferTextureLayer,
          /** @export */
          emscripten_glFrontFace: _emscripten_glFrontFace,
          /** @export */
          emscripten_glGenBuffers: _emscripten_glGenBuffers,
          /** @export */
          emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
          /** @export */
          emscripten_glGenQueries: _emscripten_glGenQueries,
          /** @export */
          emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
          /** @export */
          emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
          /** @export */
          emscripten_glGenSamplers: _emscripten_glGenSamplers,
          /** @export */
          emscripten_glGenTextures: _emscripten_glGenTextures,
          /** @export */
          emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
          /** @export */
          emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
          /** @export */
          emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
          /** @export */
          emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
          /** @export */
          emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
          /** @export */
          emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
          /** @export */
          emscripten_glGetActiveUniformBlockName: _emscripten_glGetActiveUniformBlockName,
          /** @export */
          emscripten_glGetActiveUniformBlockiv: _emscripten_glGetActiveUniformBlockiv,
          /** @export */
          emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
          /** @export */
          emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
          /** @export */
          emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
          /** @export */
          emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
          /** @export */
          emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
          /** @export */
          emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
          /** @export */
          emscripten_glGetError: _emscripten_glGetError,
          /** @export */
          emscripten_glGetFloatv: _emscripten_glGetFloatv,
          /** @export */
          emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
          /** @export */
          emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
          /** @export */
          emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
          /** @export */
          emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
          /** @export */
          emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
          /** @export */
          emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
          /** @export */
          emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
          /** @export */
          emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
          /** @export */
          emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
          /** @export */
          emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
          /** @export */
          emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
          /** @export */
          emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
          /** @export */
          emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
          /** @export */
          emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
          /** @export */
          emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
          /** @export */
          emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
          /** @export */
          emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
          /** @export */
          emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
          /** @export */
          emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
          /** @export */
          emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
          /** @export */
          emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
          /** @export */
          emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
          /** @export */
          emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
          /** @export */
          emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
          /** @export */
          emscripten_glGetString: _emscripten_glGetString,
          /** @export */
          emscripten_glGetStringi: _emscripten_glGetStringi,
          /** @export */
          emscripten_glGetSynciv: _emscripten_glGetSynciv,
          /** @export */
          emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
          /** @export */
          emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
          /** @export */
          emscripten_glGetTransformFeedbackVarying: _emscripten_glGetTransformFeedbackVarying,
          /** @export */
          emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
          /** @export */
          emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
          /** @export */
          emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
          /** @export */
          emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
          /** @export */
          emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
          /** @export */
          emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
          /** @export */
          emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
          /** @export */
          emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
          /** @export */
          emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
          /** @export */
          emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
          /** @export */
          emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
          /** @export */
          emscripten_glHint: _emscripten_glHint,
          /** @export */
          emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
          /** @export */
          emscripten_glInvalidateSubFramebuffer: _emscripten_glInvalidateSubFramebuffer,
          /** @export */
          emscripten_glIsBuffer: _emscripten_glIsBuffer,
          /** @export */
          emscripten_glIsEnabled: _emscripten_glIsEnabled,
          /** @export */
          emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
          /** @export */
          emscripten_glIsProgram: _emscripten_glIsProgram,
          /** @export */
          emscripten_glIsQuery: _emscripten_glIsQuery,
          /** @export */
          emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
          /** @export */
          emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
          /** @export */
          emscripten_glIsSampler: _emscripten_glIsSampler,
          /** @export */
          emscripten_glIsShader: _emscripten_glIsShader,
          /** @export */
          emscripten_glIsSync: _emscripten_glIsSync,
          /** @export */
          emscripten_glIsTexture: _emscripten_glIsTexture,
          /** @export */
          emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
          /** @export */
          emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
          /** @export */
          emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
          /** @export */
          emscripten_glLineWidth: _emscripten_glLineWidth,
          /** @export */
          emscripten_glLinkProgram: _emscripten_glLinkProgram,
          /** @export */
          emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL: _emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL,
          /** @export */
          emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL: _emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL,
          /** @export */
          emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
          /** @export */
          emscripten_glPixelStorei: _emscripten_glPixelStorei,
          /** @export */
          emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
          /** @export */
          emscripten_glProgramBinary: _emscripten_glProgramBinary,
          /** @export */
          emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
          /** @export */
          emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
          /** @export */
          emscripten_glReadBuffer: _emscripten_glReadBuffer,
          /** @export */
          emscripten_glReadPixels: _emscripten_glReadPixels,
          /** @export */
          emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
          /** @export */
          emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
          /** @export */
          emscripten_glRenderbufferStorageMultisample: _emscripten_glRenderbufferStorageMultisample,
          /** @export */
          emscripten_glResumeTransformFeedback: _emscripten_glResumeTransformFeedback,
          /** @export */
          emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
          /** @export */
          emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
          /** @export */
          emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
          /** @export */
          emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
          /** @export */
          emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
          /** @export */
          emscripten_glScissor: _emscripten_glScissor,
          /** @export */
          emscripten_glShaderBinary: _emscripten_glShaderBinary,
          /** @export */
          emscripten_glShaderSource: _emscripten_glShaderSource,
          /** @export */
          emscripten_glStencilFunc: _emscripten_glStencilFunc,
          /** @export */
          emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
          /** @export */
          emscripten_glStencilMask: _emscripten_glStencilMask,
          /** @export */
          emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
          /** @export */
          emscripten_glStencilOp: _emscripten_glStencilOp,
          /** @export */
          emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
          /** @export */
          emscripten_glTexImage2D: _emscripten_glTexImage2D,
          /** @export */
          emscripten_glTexImage3D: _emscripten_glTexImage3D,
          /** @export */
          emscripten_glTexParameterf: _emscripten_glTexParameterf,
          /** @export */
          emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
          /** @export */
          emscripten_glTexParameteri: _emscripten_glTexParameteri,
          /** @export */
          emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
          /** @export */
          emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
          /** @export */
          emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
          /** @export */
          emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
          /** @export */
          emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
          /** @export */
          emscripten_glTransformFeedbackVaryings: _emscripten_glTransformFeedbackVaryings,
          /** @export */
          emscripten_glUniform1f: _emscripten_glUniform1f,
          /** @export */
          emscripten_glUniform1fv: _emscripten_glUniform1fv,
          /** @export */
          emscripten_glUniform1i: _emscripten_glUniform1i,
          /** @export */
          emscripten_glUniform1iv: _emscripten_glUniform1iv,
          /** @export */
          emscripten_glUniform1ui: _emscripten_glUniform1ui,
          /** @export */
          emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
          /** @export */
          emscripten_glUniform2f: _emscripten_glUniform2f,
          /** @export */
          emscripten_glUniform2fv: _emscripten_glUniform2fv,
          /** @export */
          emscripten_glUniform2i: _emscripten_glUniform2i,
          /** @export */
          emscripten_glUniform2iv: _emscripten_glUniform2iv,
          /** @export */
          emscripten_glUniform2ui: _emscripten_glUniform2ui,
          /** @export */
          emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
          /** @export */
          emscripten_glUniform3f: _emscripten_glUniform3f,
          /** @export */
          emscripten_glUniform3fv: _emscripten_glUniform3fv,
          /** @export */
          emscripten_glUniform3i: _emscripten_glUniform3i,
          /** @export */
          emscripten_glUniform3iv: _emscripten_glUniform3iv,
          /** @export */
          emscripten_glUniform3ui: _emscripten_glUniform3ui,
          /** @export */
          emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
          /** @export */
          emscripten_glUniform4f: _emscripten_glUniform4f,
          /** @export */
          emscripten_glUniform4fv: _emscripten_glUniform4fv,
          /** @export */
          emscripten_glUniform4i: _emscripten_glUniform4i,
          /** @export */
          emscripten_glUniform4iv: _emscripten_glUniform4iv,
          /** @export */
          emscripten_glUniform4ui: _emscripten_glUniform4ui,
          /** @export */
          emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
          /** @export */
          emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
          /** @export */
          emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
          /** @export */
          emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
          /** @export */
          emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
          /** @export */
          emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
          /** @export */
          emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
          /** @export */
          emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
          /** @export */
          emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
          /** @export */
          emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
          /** @export */
          emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
          /** @export */
          emscripten_glUseProgram: _emscripten_glUseProgram,
          /** @export */
          emscripten_glValidateProgram: _emscripten_glValidateProgram,
          /** @export */
          emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
          /** @export */
          emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
          /** @export */
          emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
          /** @export */
          emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
          /** @export */
          emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
          /** @export */
          emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
          /** @export */
          emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
          /** @export */
          emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
          /** @export */
          emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
          /** @export */
          emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
          /** @export */
          emscripten_glVertexAttribDivisorARB: _emscripten_glVertexAttribDivisorARB,
          /** @export */
          emscripten_glVertexAttribDivisorEXT: _emscripten_glVertexAttribDivisorEXT,
          /** @export */
          emscripten_glVertexAttribDivisorNV: _emscripten_glVertexAttribDivisorNV,
          /** @export */
          emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
          /** @export */
          emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
          /** @export */
          emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
          /** @export */
          emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
          /** @export */
          emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
          /** @export */
          emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
          /** @export */
          emscripten_glViewport: _emscripten_glViewport,
          /** @export */
          emscripten_glWaitSync: _emscripten_glWaitSync,
          /** @export */
          emscripten_resize_heap: _emscripten_resize_heap,
          /** @export */
          emscripten_ubq_codec_createAudioDecoder: _emscripten_ubq_codec_createAudioDecoder,
          /** @export */
          emscripten_ubq_codec_createAudioEncoder: _emscripten_ubq_codec_createAudioEncoder,
          /** @export */
          emscripten_ubq_codec_createVideoDecoder: _emscripten_ubq_codec_createVideoDecoder,
          /** @export */
          emscripten_ubq_codec_createVideoEncoder: _emscripten_ubq_codec_createVideoEncoder,
          /** @export */
          emscripten_ubq_codec_decodeAudioChunk: _emscripten_ubq_codec_decodeAudioChunk,
          /** @export */
          emscripten_ubq_codec_decodeVideoChunk: _emscripten_ubq_codec_decodeVideoChunk,
          /** @export */
          emscripten_ubq_codec_destroyAudioDecoder: _emscripten_ubq_codec_destroyAudioDecoder,
          /** @export */
          emscripten_ubq_codec_destroyAudioEncoder: _emscripten_ubq_codec_destroyAudioEncoder,
          /** @export */
          emscripten_ubq_codec_destroyVideoDecoder: _emscripten_ubq_codec_destroyVideoDecoder,
          /** @export */
          emscripten_ubq_codec_destroyVideoEncoder: _emscripten_ubq_codec_destroyVideoEncoder,
          /** @export */
          emscripten_ubq_codec_encodeAudioData: _emscripten_ubq_codec_encodeAudioData,
          /** @export */
          emscripten_ubq_codec_encodeVideoFrame: _emscripten_ubq_codec_encodeVideoFrame,
          /** @export */
          emscripten_ubq_codec_finalizeAudioEncoding: _emscripten_ubq_codec_finalizeAudioEncoding,
          /** @export */
          emscripten_ubq_codec_finalizeVideoEncoding: _emscripten_ubq_codec_finalizeVideoEncoding,
          /** @export */
          emscripten_ubq_codec_flushAudioDecoder: _emscripten_ubq_codec_flushAudioDecoder,
          /** @export */
          emscripten_ubq_codec_flushVideoDecoder: _emscripten_ubq_codec_flushVideoDecoder,
          /** @export */
          emscripten_ubq_codec_getAudioDecoderQueueSize: _emscripten_ubq_codec_getAudioDecoderQueueSize,
          /** @export */
          emscripten_ubq_codec_getNumberOfDecodedVideoFrames: _emscripten_ubq_codec_getNumberOfDecodedVideoFrames,
          /** @export */
          emscripten_ubq_codec_getWrittenAudioFrames: _emscripten_ubq_codec_getWrittenAudioFrames,
          /** @export */
          emscripten_ubq_codec_isFlushingAudioDecoder: _emscripten_ubq_codec_isFlushingAudioDecoder,
          /** @export */
          emscripten_ubq_codec_isFlushingVideoDecoder: _emscripten_ubq_codec_isFlushingVideoDecoder,
          /** @export */
          emscripten_ubq_codec_isSupported: _emscripten_ubq_codec_isSupported,
          /** @export */
          emscripten_ubq_codec_setRequestedVideoFrame: _emscripten_ubq_codec_setRequestedVideoFrame,
          /** @export */
          emscripten_ubq_codec_setVideoTextures: _emscripten_ubq_codec_setVideoTextures,
          /** @export */
          emscripten_ubq_fetch_allocateFetchResult: _emscripten_ubq_fetch_allocateFetchResult,
          /** @export */
          emscripten_ubq_fetch_clear: _emscripten_ubq_fetch_clear,
          /** @export */
          emscripten_ubq_fetch_createHeader: _emscripten_ubq_fetch_createHeader,
          /** @export */
          emscripten_ubq_fetch_deleteHeader: _emscripten_ubq_fetch_deleteHeader,
          /** @export */
          emscripten_ubq_fetch_dispatchAsyncFetch: _emscripten_ubq_fetch_dispatchAsyncFetch,
          /** @export */
          emscripten_ubq_fetch_freeFetchResult: _emscripten_ubq_fetch_freeFetchResult,
          /** @export */
          emscripten_ubq_fetch_getFetchCompletedBytes: _emscripten_ubq_fetch_getFetchCompletedBytes,
          /** @export */
          emscripten_ubq_fetch_getFetchResultAddress: _emscripten_ubq_fetch_getFetchResultAddress,
          /** @export */
          emscripten_ubq_fetch_getFetchResultLength: _emscripten_ubq_fetch_getFetchResultLength,
          /** @export */
          emscripten_ubq_fetch_getFetchState: _emscripten_ubq_fetch_getFetchState,
          /** @export */
          emscripten_ubq_fetch_getFetchTotalBytes: _emscripten_ubq_fetch_getFetchTotalBytes,
          /** @export */
          emscripten_ubq_settings_getForceWebGL1: _emscripten_ubq_settings_getForceWebGL1,
          /** @export */
          emscripten_webgl_create_context: _emscripten_webgl_create_context,
          /** @export */
          emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
          /** @export */
          emscripten_webgl_enable_OES_vertex_array_object: _emscripten_webgl_enable_OES_vertex_array_object,
          /** @export */
          emscripten_webgl_enable_WEBGL_draw_buffers: _emscripten_webgl_enable_WEBGL_draw_buffers,
          /** @export */
          emscripten_webgl_enable_WEBGL_multi_draw: _emscripten_webgl_enable_WEBGL_multi_draw,
          /** @export */
          emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
          /** @export */
          emscripten_webgl_get_context_attributes: _emscripten_webgl_get_context_attributes,
          /** @export */
          emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
          /** @export */
          environ_get: _environ_get,
          /** @export */
          environ_sizes_get: _environ_sizes_get,
          /** @export */
          exit: _exit,
          /** @export */
          fd_close: _fd_close,
          /** @export */
          fd_fdstat_get: _fd_fdstat_get,
          /** @export */
          fd_pread: _fd_pread,
          /** @export */
          fd_read: _fd_read,
          /** @export */
          fd_seek: _fd_seek,
          /** @export */
          fd_write: _fd_write,
          /** @export */
          getItem,
          /** @export */
          getTrackingOverrideEndpoint,
          /** @export */
          getWindowHostname,
          /** @export */
          getentropy: _getentropy,
          /** @export */
          invoke_fff,
          /** @export */
          invoke_fi,
          /** @export */
          invoke_fii,
          /** @export */
          invoke_fiif,
          /** @export */
          invoke_i,
          /** @export */
          invoke_iff,
          /** @export */
          invoke_ii,
          /** @export */
          invoke_iiffiiiffiiiiiii,
          /** @export */
          invoke_iii,
          /** @export */
          invoke_iiii,
          /** @export */
          invoke_iiiii,
          /** @export */
          invoke_iiiiii,
          /** @export */
          invoke_iiiiiii,
          /** @export */
          invoke_iiiiiiiiii,
          /** @export */
          invoke_v,
          /** @export */
          invoke_vi,
          /** @export */
          invoke_vifi,
          /** @export */
          invoke_vii,
          /** @export */
          invoke_viii,
          /** @export */
          invoke_viiii,
          /** @export */
          invoke_viiiii,
          /** @export */
          invoke_viiiiii,
          /** @export */
          invoke_viiiiiii,
          /** @export */
          invoke_viiiiiiiii,
          /** @export */
          isLocalStorageDefined,
          /** @export */
          isLocalTrackingEnabled,
          /** @export */
          jsUpdateTexture,
          /** @export */
          memory: wasmMemory,
          /** @export */
          setItem,
          /** @export */
          strftime_l: _strftime_l
        };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors");
        var _malloc = Module["_malloc"] = createExportWrapper("malloc");
        var _main = Module["_main"] = createExportWrapper("__main_argc_argv");
        var _free = Module["_free"] = createExportWrapper("free");
        var _ma_malloc_emscripten = Module["_ma_malloc_emscripten"] = createExportWrapper("ma_malloc_emscripten");
        var _ma_free_emscripten = Module["_ma_free_emscripten"] = createExportWrapper("ma_free_emscripten");
        var _ma_device_process_pcm_frames_capture__webaudio = Module["_ma_device_process_pcm_frames_capture__webaudio"] = createExportWrapper("ma_device_process_pcm_frames_capture__webaudio");
        var _ma_device_process_pcm_frames_playback__webaudio = Module["_ma_device_process_pcm_frames_playback__webaudio"] = createExportWrapper("ma_device_process_pcm_frames_playback__webaudio");
        var _fflush = createExportWrapper("fflush");
        var setTempRet0 = createExportWrapper("setTempRet0");
        var ___getTypeName = createExportWrapper("__getTypeName");
        var _emscripten_builtin_memalign = createExportWrapper("emscripten_builtin_memalign");
        var _setThrew = createExportWrapper("setThrew");
        var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports["emscripten_stack_init"])();
        var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"])();
        var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"])();
        var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();
        var stackSave = createExportWrapper("stackSave");
        var stackRestore = createExportWrapper("stackRestore");
        var stackAlloc = createExportWrapper("stackAlloc");
        var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
        var ___cxa_decrement_exception_refcount = createExportWrapper("__cxa_decrement_exception_refcount");
        var ___cxa_increment_exception_refcount = createExportWrapper("__cxa_increment_exception_refcount");
        var ___cxa_can_catch = createExportWrapper("__cxa_can_catch");
        var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type");
        var ___start_em_js = Module["___start_em_js"] = 2587791;
        var ___stop_em_js = Module["___stop_em_js"] = 2588845;
        function invoke_iii(index, a1, a2) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_vii(index, a1, a2) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_ii(index, a1) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_v(index) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)();
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_vi(index, a1) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiii(index, a1, a2, a3, a4) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3, a4);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_fiif(index, a1, a2, a3) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_fi(index, a1) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_fff(index, a1, a2) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viii(index, a1, a2, a3) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiffiiiffiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_vifi(index, a1, a2, a3) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_fii(index, a1, a2) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iff(index, a1, a2) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_i(index) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)();
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiii(index, a1, a2, a3) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiii(index, a1, a2, a3, a4) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3, a4);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3, a4, a5);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          var sp = stackSave();
          try {
            return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        }
        Module["addRunDependency"] = addRunDependency;
        Module["removeRunDependency"] = removeRunDependency;
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createDevice"] = FS.createDevice;
        Module["ccall"] = ccall;
        Module["getValue"] = getValue;
        Module["UTF8ToString"] = UTF8ToString;
        Module["specialHTMLTargets"] = specialHTMLTargets;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_unlink"] = FS.unlink;
        var missingLibrarySymbols = [
          "writeI53ToI64Clamped",
          "writeI53ToI64Signaling",
          "writeI53ToU64Clamped",
          "writeI53ToU64Signaling",
          "convertI32PairToI53",
          "convertI32PairToI53Checked",
          "convertU32PairToI53",
          "inetPton4",
          "inetNtop4",
          "inetPton6",
          "inetNtop6",
          "readSockaddr",
          "writeSockaddr",
          "getCallstack",
          "emscriptenLog",
          "convertPCtoSourceLocation",
          "runMainThreadEmAsm",
          "listenOnce",
          "autoResumeAudioContext",
          "getDynCaller",
          "dynCall",
          "runtimeKeepalivePush",
          "runtimeKeepalivePop",
          "asmjsMangle",
          "getNativeTypeSize",
          "STACK_SIZE",
          "STACK_ALIGN",
          "POINTER_SIZE",
          "ASSERTIONS",
          "cwrap",
          "uleb128Encode",
          "sigToWasmTypes",
          "generateFuncType",
          "convertJsFunctionToWasm",
          "getEmptyTableSlot",
          "updateTableMap",
          "getFunctionAddress",
          "addFunction",
          "removeFunction",
          "reallyNegative",
          "unSign",
          "strLen",
          "reSign",
          "formatString",
          "intArrayToString",
          "AsciiToString",
          "registerKeyEventCallback",
          "getBoundingClientRect",
          "fillMouseEventData",
          "registerMouseEventCallback",
          "registerWheelEventCallback",
          "registerUiEventCallback",
          "registerFocusEventCallback",
          "fillDeviceOrientationEventData",
          "registerDeviceOrientationEventCallback",
          "fillDeviceMotionEventData",
          "registerDeviceMotionEventCallback",
          "screenOrientation",
          "fillOrientationChangeEventData",
          "registerOrientationChangeEventCallback",
          "fillFullscreenChangeEventData",
          "registerFullscreenChangeEventCallback",
          "JSEvents_requestFullscreen",
          "JSEvents_resizeCanvasForFullscreen",
          "registerRestoreOldStyle",
          "hideEverythingExceptGivenElement",
          "restoreHiddenElements",
          "setLetterbox",
          "softFullscreenResizeWebGLRenderTarget",
          "doRequestFullscreen",
          "fillPointerlockChangeEventData",
          "registerPointerlockChangeEventCallback",
          "registerPointerlockErrorEventCallback",
          "requestPointerLock",
          "fillVisibilityChangeEventData",
          "registerVisibilityChangeEventCallback",
          "registerTouchEventCallback",
          "fillGamepadEventData",
          "registerGamepadEventCallback",
          "registerBeforeUnloadEventCallback",
          "fillBatteryEventData",
          "battery",
          "registerBatteryEventCallback",
          "setCanvasElementSize",
          "getCanvasElementSize",
          "demangle",
          "jsStackTrace",
          "stackTrace",
          "checkWasiClock",
          "wasiRightsToMuslOFlags",
          "wasiOFlagsToMuslOFlags",
          "createDyncallWrapper",
          "setImmediateWrapped",
          "clearImmediateWrapped",
          "polyfillSetImmediate",
          "getPromise",
          "makePromise",
          "idsToPromises",
          "makePromiseCallback",
          "Browser_asyncPrepareDataCounter",
          "getSocketFromFD",
          "getSocketAddress",
          "FS_mkdirTree",
          "_setNetworkCallback",
          "webgl_enable_ANGLE_instanced_arrays",
          "writeGLArray",
          "registerWebGlEventCallback",
          "runAndAbortIfError",
          "SDL_unicode",
          "SDL_ttfContext",
          "SDL_audio",
          "webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance",
          "webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance",
          "ALLOC_NORMAL",
          "ALLOC_STACK",
          "allocate",
          "writeStringToMemory",
          "writeAsciiToMemory",
          "setErrNo",
          "getFunctionArgsName",
          "createJsInvokerSignature",
          "createJsInvoker",
          "registerInheritedInstance",
          "unregisterInheritedInstance",
          "validateThis"
        ];
        missingLibrarySymbols.forEach(missingLibrarySymbol);
        var unexportedSymbols = [
          "run",
          "addOnPreRun",
          "addOnInit",
          "addOnPreMain",
          "addOnExit",
          "addOnPostRun",
          "FS_createFolder",
          "FS_createLink",
          "FS_readFile",
          "out",
          "err",
          "callMain",
          "abort",
          "wasmMemory",
          "wasmExports",
          "stackAlloc",
          "stackSave",
          "stackRestore",
          "getTempRet0",
          "setTempRet0",
          "writeStackCookie",
          "checkStackCookie",
          "writeI53ToI64",
          "readI53FromI64",
          "readI53FromU64",
          "MAX_INT53",
          "MIN_INT53",
          "bigintToI53Checked",
          "ptrToString",
          "zeroMemory",
          "exitJS",
          "getHeapMax",
          "growMemory",
          "ENV",
          "MONTH_DAYS_REGULAR",
          "MONTH_DAYS_LEAP",
          "MONTH_DAYS_REGULAR_CUMULATIVE",
          "MONTH_DAYS_LEAP_CUMULATIVE",
          "isLeapYear",
          "ydayFromDate",
          "arraySum",
          "addDays",
          "ERRNO_CODES",
          "ERRNO_MESSAGES",
          "DNS",
          "Protocols",
          "Sockets",
          "initRandomFill",
          "randomFill",
          "timers",
          "warnOnce",
          "UNWIND_CACHE",
          "readEmAsmArgsArray",
          "readEmAsmArgs",
          "runEmAsmFunction",
          "jstoi_q",
          "jstoi_s",
          "getExecutableName",
          "handleException",
          "keepRuntimeAlive",
          "callUserCallback",
          "maybeExit",
          "asyncLoad",
          "alignMemory",
          "mmapAlloc",
          "HandleAllocator",
          "wasmTable",
          "noExitRuntime",
          "getCFunc",
          "freeTableIndexes",
          "functionsInTableMap",
          "setValue",
          "PATH",
          "PATH_FS",
          "UTF8Decoder",
          "UTF8ArrayToString",
          "stringToUTF8Array",
          "stringToUTF8",
          "lengthBytesUTF8",
          "intArrayFromString",
          "stringToAscii",
          "UTF16Decoder",
          "UTF16ToString",
          "stringToUTF16",
          "lengthBytesUTF16",
          "UTF32ToString",
          "stringToUTF32",
          "lengthBytesUTF32",
          "stringToNewUTF8",
          "stringToUTF8OnStack",
          "writeArrayToMemory",
          "JSEvents",
          "maybeCStringToJsString",
          "findEventTarget",
          "findCanvasEventTarget",
          "currentFullscreenStrategy",
          "restoreOldWindowedStyle",
          "ExitStatus",
          "getEnvStrings",
          "doReadv",
          "doWritev",
          "safeSetTimeout",
          "promiseMap",
          "uncaughtExceptionCount",
          "exceptionLast",
          "exceptionCaught",
          "ExceptionInfo",
          "findMatchingCatch",
          "Browser",
          "setMainLoop",
          "wget",
          "SYSCALLS",
          "preloadPlugins",
          "FS_modeStringToFlags",
          "FS_getMode",
          "FS_stdin_getChar_buffer",
          "FS_stdin_getChar",
          "FS",
          "MEMFS",
          "TTY",
          "PIPEFS",
          "SOCKFS",
          "tempFixedLengthArray",
          "miniTempWebGLFloatBuffers",
          "miniTempWebGLIntBuffers",
          "heapObjectForWebGLType",
          "heapAccessShiftForWebGLHeap",
          "webgl_enable_OES_vertex_array_object",
          "webgl_enable_WEBGL_draw_buffers",
          "webgl_enable_WEBGL_multi_draw",
          "GL",
          "emscriptenWebGLGet",
          "computeUnpackAlignedImageSize",
          "colorChannelsInGlTextureFormat",
          "emscriptenWebGLGetTexPixelData",
          "__glGenObject",
          "emscriptenWebGLGetUniform",
          "webglGetUniformLocation",
          "webglPrepareUniformLocationsBeforeFirstUse",
          "webglGetLeftBracePos",
          "emscriptenWebGLGetVertexAttrib",
          "__glGetActiveAttribOrUniform",
          "emscripten_webgl_power_preferences",
          "AL",
          "GLUT",
          "EGL",
          "GLEW",
          "IDBStore",
          "SDL",
          "SDL_gfx",
          "emscriptenWebGLGetIndexed",
          "allocateUTF8",
          "allocateUTF8OnStack",
          "InternalError",
          "BindingError",
          "throwInternalError",
          "throwBindingError",
          "registeredTypes",
          "awaitingDependencies",
          "typeDependencies",
          "tupleRegistrations",
          "structRegistrations",
          "sharedRegisterType",
          "whenDependentTypesAreResolved",
          "embind_charCodes",
          "embind_init_charCodes",
          "readLatin1String",
          "getTypeName",
          "getFunctionName",
          "heap32VectorToArray",
          "requireRegisteredType",
          "usesDestructorStack",
          "UnboundTypeError",
          "PureVirtualError",
          "GenericWireTypeSize",
          "EmValType",
          "init_embind",
          "throwUnboundTypeError",
          "ensureOverloadTable",
          "exposePublicSymbol",
          "replacePublicSymbol",
          "extendError",
          "createNamedFunction",
          "embindRepr",
          "registeredInstances",
          "getBasestPointer",
          "getInheritedInstance",
          "getInheritedInstanceCount",
          "getLiveInheritedInstances",
          "registeredPointers",
          "registerType",
          "integerReadValueFromPointer",
          "enumReadValueFromPointer",
          "floatReadValueFromPointer",
          "simpleReadValueFromPointer",
          "readPointer",
          "runDestructors",
          "craftInvokerFunction",
          "embind__requireFunction",
          "genericPointerToWireType",
          "constNoSmartPtrRawPointerToWireType",
          "nonConstNoSmartPtrRawPointerToWireType",
          "init_RegisteredPointer",
          "RegisteredPointer",
          "RegisteredPointer_fromWireType",
          "runDestructor",
          "releaseClassHandle",
          "finalizationRegistry",
          "detachFinalizer_deps",
          "detachFinalizer",
          "attachFinalizer",
          "makeClassHandle",
          "init_ClassHandle",
          "ClassHandle",
          "throwInstanceAlreadyDeleted",
          "deletionQueue",
          "flushPendingDeletes",
          "delayFunction",
          "setDelayFunction",
          "RegisteredClass",
          "shallowCopyInternalPointer",
          "downcastPointer",
          "upcastPointer",
          "char_0",
          "char_9",
          "makeLegalFunctionName",
          "emval_handles",
          "emval_symbols",
          "init_emval",
          "count_emval_handles",
          "getStringOrSymbol",
          "Emval",
          "emval_get_global",
          "emval_returnValue",
          "emval_lookupTypes",
          "emval_methodCallers",
          "emval_addMethodCaller",
          "reflectConstruct"
        ];
        unexportedSymbols.forEach(unexportedRuntimeSymbol);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun) run2();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function callMain(args = []) {
          assert3(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
          assert3(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
          var entryFunction = _main;
          args.unshift(thisProgram);
          var argc = args.length;
          var argv = stackAlloc((argc + 1) * 4);
          var argv_ptr = argv;
          args.forEach((arg) => {
            HEAPU32[argv_ptr >> 2] = stringToUTF8OnStack(arg);
            argv_ptr += 4;
          });
          HEAPU32[argv_ptr >> 2] = 0;
          try {
            var ret = entryFunction(argc, argv);
            exitJS(
              ret,
              /* implicit = */
              true
            );
            return ret;
          } catch (e) {
            return handleException(e);
          }
        }
        function stackCheckInit() {
          _emscripten_stack_init();
          writeStackCookie();
        }
        function run2(args = arguments_) {
          if (runDependencies > 0) {
            return;
          }
          stackCheckInit();
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun) return;
            calledRun = true;
            Module["calledRun"] = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module);
            if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
            if (shouldRunNow) callMain(args);
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
          checkStackCookie();
        }
        function checkUnflushedContent() {
          var oldOut = out;
          var oldErr = err;
          var has = false;
          out = err = (x) => {
            has = true;
          };
          try {
            _fflush(0);
            ["stdout", "stderr"].forEach(function(name) {
              var info = FS.analyzePath("/dev/" + name);
              if (!info) return;
              var stream = info.object;
              var rdev = stream.rdev;
              var tty = TTY.ttys[rdev];
              if (tty?.output?.length) {
                has = true;
              }
            });
          } catch (e) {
          }
          out = oldOut;
          err = oldErr;
          if (has) {
            warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
          }
        }
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        var shouldRunNow = true;
        if (Module["noInitialRun"]) shouldRunNow = false;
        run2();
        return moduleArg.ready;
      };
    })();
    if (typeof exports === "object" && typeof module === "object")
      module.exports = CESDK2;
    else if (typeof define === "function" && define["amd"])
      define([], () => CESDK2);
  }
});

// ../../bindings/wasm/js_web/src/streams/index.ts
function makeSource(onSubscribe, onUnsubscribe) {
  const handlers = /* @__PURE__ */ new Set();
  function emit(value, ...values) {
    for (const handler of handlers) {
      handler(value);
      for (const v of values) {
        handler(v);
      }
    }
  }
  function stream(handler) {
    handlers.add(handler);
    const emitToSubscriber = (value, ...values) => {
      handler(value);
      for (const v of values) {
        handler(v);
      }
    };
    onSubscribe?.(emitToSubscriber);
    const unsubscribeMakeSource = () => {
      handlers.delete(handler);
      onUnsubscribe?.();
    };
    return unsubscribeMakeSource;
  }
  stream.emit = emit;
  stream.handlers = handlers;
  return stream;
}

// ../../bindings/wasm/js_web/src/streams/Channel.ts
var NO_VALUE = Symbol("NO_VALUE");
function makeValueChannel(initialValue) {
  let currentValue = NO_VALUE;
  const value = () => {
    if (currentValue === NO_VALUE) {
      currentValue = initialValue();
    }
    return currentValue;
  };
  const subscribe = makeSource();
  return {
    subscribe,
    value,
    update(newValue) {
      currentValue = newValue;
      subscribe.emit(currentValue);
    }
  };
}

// ../../bindings/wasm/js_web/src/types/MimeType.ts
var MimeType = /* @__PURE__ */ ((MimeType2) => {
  MimeType2["Png"] = "image/png";
  MimeType2["Jpeg"] = "image/jpeg";
  MimeType2["WebP"] = "image/webp";
  MimeType2["Tga"] = "image/x-tga";
  MimeType2["Wav"] = "audio/wav";
  MimeType2["Mp4"] = "video/mp4";
  MimeType2["QuickTime"] = "video/quicktime";
  MimeType2["Binary"] = "application/octet-stream";
  MimeType2["Pdf"] = "application/pdf";
  MimeType2["Zip"] = "application/zip";
  return MimeType2;
})(MimeType || {});
var MimeType_default = MimeType;

// ../../node_modules/superstruct/lib/index.es.js
var StructError = class extends TypeError {
  constructor(failure, failures) {
    let cached;
    const {
      message,
      ...rest
    } = failure;
    const {
      path
    } = failure;
    const msg = path.length === 0 ? message : "At path: " + path.join(".") + " -- " + message;
    super(msg);
    this.value = void 0;
    this.key = void 0;
    this.type = void 0;
    this.refinement = void 0;
    this.path = void 0;
    this.branch = void 0;
    this.failures = void 0;
    Object.assign(this, rest);
    this.name = this.constructor.name;
    this.failures = () => {
      var _cached;
      return (_cached = cached) != null ? _cached : cached = [failure, ...failures()];
    };
  }
};
function isIterable(x) {
  return isObject(x) && typeof x[Symbol.iterator] === "function";
}
function isObject(x) {
  return typeof x === "object" && x != null;
}
function print2(value) {
  return typeof value === "string" ? JSON.stringify(value) : "" + value;
}
function shiftIterator(input) {
  const {
    done,
    value
  } = input.next();
  return done ? void 0 : value;
}
function toFailure(result, context, struct, value) {
  if (result === true) {
    return;
  } else if (result === false) {
    result = {};
  } else if (typeof result === "string") {
    result = {
      message: result
    };
  }
  const {
    path,
    branch
  } = context;
  const {
    type: type2
  } = struct;
  const {
    refinement,
    message = "Expected a value of type `" + type2 + "`" + (refinement ? " with refinement `" + refinement + "`" : "") + ", but received: `" + print2(value) + "`"
  } = result;
  return {
    value,
    type: type2,
    refinement,
    key: path[path.length - 1],
    path,
    branch,
    ...result,
    message
  };
}
function* toFailures(result, context, struct, value) {
  if (!isIterable(result)) {
    result = [result];
  }
  for (const r of result) {
    const failure = toFailure(r, context, struct, value);
    if (failure) {
      yield failure;
    }
  }
}
function* run(value, struct, options = {}) {
  const {
    path = [],
    branch = [value],
    coerce = false,
    mask: mask2 = false
  } = options;
  const ctx = {
    path,
    branch
  };
  if (coerce) {
    value = struct.coercer(value, ctx);
    if (mask2 && struct.type !== "type" && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
      for (const key in value) {
        if (struct.schema[key] === void 0) {
          delete value[key];
        }
      }
    }
  }
  let valid = true;
  for (const failure of struct.validator(value, ctx)) {
    valid = false;
    yield [failure, void 0];
  }
  for (let [k, v, s] of struct.entries(value, ctx)) {
    const ts = run(v, s, {
      path: k === void 0 ? path : [...path, k],
      branch: k === void 0 ? branch : [...branch, v],
      coerce,
      mask: mask2
    });
    for (const t of ts) {
      if (t[0]) {
        valid = false;
        yield [t[0], void 0];
      } else if (coerce) {
        v = t[1];
        if (k === void 0) {
          value = v;
        } else if (value instanceof Map) {
          value.set(k, v);
        } else if (value instanceof Set) {
          value.add(v);
        } else if (isObject(value)) {
          value[k] = v;
        }
      }
    }
  }
  if (valid) {
    for (const failure of struct.refiner(value, ctx)) {
      valid = false;
      yield [failure, void 0];
    }
  }
  if (valid) {
    yield [void 0, value];
  }
}
var Struct = class {
  constructor(props) {
    this.TYPE = void 0;
    this.type = void 0;
    this.schema = void 0;
    this.coercer = void 0;
    this.validator = void 0;
    this.refiner = void 0;
    this.entries = void 0;
    const {
      type: type2,
      schema,
      validator,
      refiner,
      coercer = (value) => value,
      entries = function* () {
      }
    } = props;
    this.type = type2;
    this.schema = schema;
    this.entries = entries;
    this.coercer = coercer;
    if (validator) {
      this.validator = (value, context) => {
        const result = validator(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.validator = () => [];
    }
    if (refiner) {
      this.refiner = (value, context) => {
        const result = refiner(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.refiner = () => [];
    }
  }
  /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */
  assert(value) {
    return assert(value, this);
  }
  /**
   * Create a value with the struct's coercion logic, then validate it.
   */
  create(value) {
    return create(value, this);
  }
  /**
   * Check if a value passes the struct's validation.
   */
  is(value) {
    return is(value, this);
  }
  /**
   * Mask a value, coercing and validating it, but returning only the subset of
   * properties defined by the struct's schema.
   */
  mask(value) {
    return mask(value, this);
  }
  /**
   * Validate a value with the struct's validation logic, returning a tuple
   * representing the result.
   *
   * You may optionally pass `true` for the `withCoercion` argument to coerce
   * the value before attempting to validate it. If you do, the result will
   * contain the coerced result when successful.
   */
  validate(value, options = {}) {
    return validate(value, this, options);
  }
};
function assert(value, struct) {
  const result = validate(value, struct);
  if (result[0]) {
    throw result[0];
  }
}
function create(value, struct) {
  const result = validate(value, struct, {
    coerce: true
  });
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
function mask(value, struct) {
  const result = validate(value, struct, {
    coerce: true,
    mask: true
  });
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
function is(value, struct) {
  const result = validate(value, struct);
  return !result[0];
}
function validate(value, struct, options = {}) {
  const tuples = run(value, struct, options);
  const tuple2 = shiftIterator(tuples);
  if (tuple2[0]) {
    const error = new StructError(tuple2[0], function* () {
      for (const t of tuples) {
        if (t[0]) {
          yield t[0];
        }
      }
    });
    return [error, void 0];
  } else {
    const v = tuple2[1];
    return [void 0, v];
  }
}
function define2(name, validator) {
  return new Struct({
    type: name,
    schema: null,
    validator
  });
}
function array(Element2) {
  return new Struct({
    type: "array",
    schema: Element2,
    *entries(value) {
      if (Element2 && Array.isArray(value)) {
        for (const [i, v] of value.entries()) {
          yield [i, v, Element2];
        }
      }
    },
    coercer(value) {
      return Array.isArray(value) ? value.slice() : value;
    },
    validator(value) {
      return Array.isArray(value) || "Expected an array value, but received: " + print2(value);
    }
  });
}
function boolean() {
  return define2("boolean", (value) => {
    return typeof value === "boolean";
  });
}
function integer() {
  return define2("integer", (value) => {
    return typeof value === "number" && !isNaN(value) && Number.isInteger(value) || "Expected an integer, but received: " + print2(value);
  });
}
function never() {
  return define2("never", () => false);
}
function number() {
  return define2("number", (value) => {
    return typeof value === "number" && !isNaN(value) || "Expected a number, but received: " + print2(value);
  });
}
function object(schema) {
  const knowns = schema ? Object.keys(schema) : [];
  const Never = never();
  return new Struct({
    type: "object",
    schema: schema ? schema : null,
    *entries(value) {
      if (schema && isObject(value)) {
        const unknowns = new Set(Object.keys(value));
        for (const key of knowns) {
          unknowns.delete(key);
          yield [key, value[key], schema[key]];
        }
        for (const key of unknowns) {
          yield [key, value[key], Never];
        }
      }
    },
    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print2(value);
    },
    coercer(value) {
      return isObject(value) ? {
        ...value
      } : value;
    }
  });
}
function string() {
  return define2("string", (value) => {
    return typeof value === "string" || "Expected a string, but received: " + print2(value);
  });
}
function getSize(value) {
  if (value instanceof Map || value instanceof Set) {
    return value.size;
  } else {
    return value.length;
  }
}
function max(struct, threshold, options = {}) {
  const {
    exclusive
  } = options;
  return refine(struct, "max", (value) => {
    return exclusive ? value < threshold : value <= threshold || "Expected a " + struct.type + " less than " + (exclusive ? "" : "or equal to ") + threshold + " but received `" + value + "`";
  });
}
function min(struct, threshold, options = {}) {
  const {
    exclusive
  } = options;
  return refine(struct, "min", (value) => {
    return exclusive ? value > threshold : value >= threshold || "Expected a " + struct.type + " greater than " + (exclusive ? "" : "or equal to ") + threshold + " but received `" + value + "`";
  });
}
function nonempty(struct) {
  return refine(struct, "nonempty", (value) => {
    const size = getSize(value);
    return size > 0 || "Expected a nonempty " + struct.type + " but received an empty one";
  });
}
function refine(struct, name, refiner) {
  return new Struct({
    ...struct,
    *refiner(value, ctx) {
      yield* struct.refiner(value, ctx);
      const result = refiner(value, ctx);
      const failures = toFailures(result, ctx, struct, value);
      for (const failure of failures) {
        yield {
          ...failure,
          refinement: name
        };
      }
    }
  });
}

// ../../bindings/wasm/js_web/src/assert.ts
function assert2(name, value, struct) {
  const [err] = validate(value, struct);
  if (err) {
    err.message = `Error in argument '${name}': ${err.message}`;
    throw err;
  }
}
function mimeType() {
  const r = /image\/(png|jpeg|webp|x-tga)|audio\/(wav)|video\/(mp4|quicktime)|application\/octet-stream|application\/pdf/;
  return define2("MimeType", (value) => {
    if (typeof value === "string" && r.test(value)) {
      return true;
    } else {
      return {
        message: `expected one of "image/png", "image/jpeg", "image/webp", "image/x-tga", "video/mp4", "video/quicktime", "application/pdf" or "application/octet-stream", but got "${value}"`
      };
    }
  });
}
function sceneLayoutShape() {
  const options = [
    "Free",
    "VerticalStack",
    "HorizontalStack",
    "DepthStack"
  ];
  return define2("SceneLayout", (value) => {
    if (typeof value === "string" && options.includes(value)) {
      return true;
    } else {
      return {
        message: `expected one of ${options.map((o) => `"${o}"`).join(", ")}, but got "${value}"`
      };
    }
  });
}
function zoomAutoFitAxisShape() {
  const options = ["Horizontal", "Vertical", "Both"];
  return define2("ZoomAutoFitAxis", (value) => {
    if (typeof value === "string" && options.includes(value)) {
      return true;
    } else {
      return {
        message: `expected one of ${options.map((o) => `"${o}"`).join(", ")}, but got "${value}"`
      };
    }
  });
}
function designUnitShape() {
  const options = ["Pixel", "Millimeter", "Inch"];
  return define2("DesignUnit", (value) => {
    if (typeof value === "string" && options.includes(value)) {
      return true;
    } else {
      return {
        message: `expected one of ${options.map((o) => `"${o}"`).join(", ")}, but got "${value}"`
      };
    }
  });
}
function cutoutOperationShape() {
  const options = [
    "Difference",
    "Intersection",
    "Union",
    "XOR"
  ];
  return define2("CutoutOperation", (value) => {
    if (typeof value === "string" && options.includes(value)) {
      return true;
    } else {
      return {
        message: `expected one of ${options.map((o) => `"${o}"`).join(", ")}, but got "${value}"`
      };
    }
  });
}

// ../../bindings/wasm/js_web/src/reactor/decorate.ts
var PROXY = Symbol("PROXY");
function getter(target, context) {
  Object.defineProperty(target, PROXY, {
    value: { type: "getter" },
    writable: false
  });
}
function setter(target, context) {
  Object.defineProperty(target, PROXY, {
    value: { type: "setter" },
    writable: false
  });
}

// ../../bindings/wasm/js_web/src/types/color.ts
function isRGBAColor(color) {
  return "r" in color && "a" in color && color.r !== void 0 && color.a !== void 0;
}
function isSpotColor(color) {
  return "name" in color && color.name !== void 0;
}
function isCMYKColor(color) {
  return "c" in color && "m" in color && "y" in color && "k" in color && color.c !== void 0 && color.m !== void 0 && color.y !== void 0 && color.k !== void 0;
}
var ColorInternal;
((ColorInternal2) => {
  let ColorSpace;
  ((ColorSpace2) => {
    ColorSpace2[ColorSpace2["sRGB"] = 0] = "sRGB";
    ColorSpace2[ColorSpace2["CMYK"] = 1] = "CMYK";
    ColorSpace2[ColorSpace2["SpotColor"] = 2] = "SpotColor";
  })(ColorSpace = ColorInternal2.ColorSpace || (ColorInternal2.ColorSpace = {}));
  function toColor(color) {
    switch (color.colorSpace) {
      case 0 /* sRGB */:
        return {
          r: color.components.x,
          g: color.components.y,
          b: color.components.z,
          a: color.components.w
        };
      case 2 /* SpotColor */: {
        return {
          name: color.spotColorName,
          tint: color.tint,
          externalReference: color.externalReference
        };
      }
      case 1 /* CMYK */:
        return {
          c: color.components.x,
          m: color.components.y,
          y: color.components.z,
          k: color.components.w,
          tint: color.tint
        };
      default:
        throw new Error("Unknown color space!");
    }
  }
  ColorInternal2.toColor = toColor;
  function fromColor(color) {
    if (isRGBAColor(color)) {
      return {
        colorSpace: 0 /* sRGB */,
        components: { x: color.r, y: color.g, z: color.b, w: color.a },
        spotColorName: "",
        tint: 1,
        externalReference: ""
      };
    } else if (isCMYKColor(color)) {
      return {
        colorSpace: 1 /* CMYK */,
        components: { x: color.c, y: color.m, z: color.y, w: color.k },
        spotColorName: "",
        tint: color.tint,
        externalReference: ""
      };
    } else if (isSpotColor(color)) {
      return {
        colorSpace: 2 /* SpotColor */,
        components: { x: 0, y: 0, z: 0, w: 0 },
        spotColorName: color.name,
        tint: color.tint,
        externalReference: color.externalReference
      };
    }
    throw new Error("Unknown color space!");
  }
  ColorInternal2.fromColor = fromColor;
})(ColorInternal || (ColorInternal = {}));

// ../../bindings/wasm/js_web/src/ubq/ubq_result.ts
function unpackResult(result) {
  if (result.isValid()) {
    const value = result.value();
    result.delete();
    return value;
  } else {
    const error = result.error();
    const errorMessage = false ? error.message() : error.publicMessage();
    error.delete();
    result.delete();
    throw new Error(errorMessage);
  }
}
function unpackAsync(invoker) {
  return new Promise((resolve, reject) => {
    invoker((ubqResult) => {
      try {
        const result = unpackResult(ubqResult);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  });
}

// ../../bindings/wasm/js_web/src/utils/Blob.ts
var Blob_default = typeof Blob !== "undefined" ? Blob : (() => {
  try {
    return require_buffer().Blob;
  } catch (e) {
    return function Blob2() {
      throw new Error(
        "Could not find Blob constructor and failed to require('buffer').Blob"
      );
    };
  }
})();

// ../../bindings/wasm/js_web/src/utils/cppVectorToArray.ts
var cppVectorToArray_default = (stdVector, dispose = true) => {
  const ids = [];
  for (let index = 0; index < stdVector.size(); index += 1) {
    ids.push(stdVector.get(index));
  }
  if (dispose) stdVector.delete();
  return ids;
};

// ../../bindings/wasm/js_web/src/BlockAPI.ts
var _forceLoadResources_dec, _setState_dec, _getState_dec, _setNativePixelBuffer_dec, _getOutAnimation_dec, _getLoopAnimation_dec, _getInAnimation_dec, _setOutAnimation_dec, _setLoopAnimation_dec, _setInAnimation_dec, _supportsAnimation_dec, _createAnimation_dec, _getPageThumbnailAtlas_dec, _getVideoFillThumbnailAtlas_dec, _getVideoFillThumbnail_dec, _getVideoHeight_dec, _getVideoWidth_dec, _getAVResourceTotalDuration_dec, _unstable_isAVResourceLoaded_dec, _forceLoadAVResource_dec, _getVolume_dec, _setVolume_dec, _isMuted_dec, _setMuted_dec, _isLooping_dec, _setLooping_dec, _supportsPlaybackControl_dec, _hasPlaybackControl_dec, _isSoloPlaybackEnabled_dec, _setSoloPlaybackEnabled_dec, _isVisibleAtCurrentPlaybackTime_dec, _getPlaybackTime_dec, _setPlaybackTime_dec, _supportsPlaybackTime_dec, _hasPlaybackTime_dec, _isPlaying_dec, _setPlaying_dec, _getTotalSceneDuration_dec, _getTrimLength_dec, _setTrimLength_dec, _getTrimOffset_dec, _setTrimOffset_dec, _supportsTrim_dec, _hasTrim_dec, _getTimeOffset_dec, _setTimeOffset_dec, _supportsTimeOffset_dec, _hasTimeOffset_dec, _getDuration_dec, _setDuration_dec, _supportsDuration_dec, _hasDuration_dec, _isAllowedByScope_dec, _isScopeEnabled_dec, _setScopeEnabled_dec, _removeMetadata_dec, _findAllMetadata_dec, _hasMetadata_dec, _getMetadata_dec, _setMetadata_dec, _isPlaceholderControlsButtonEnabled_dec, _setPlaceholderControlsButtonEnabled_dec, _isPlaceholderControlsOverlayEnabled_dec, _setPlaceholderControlsOverlayEnabled_dec, _supportsPlaceholderControls_dec, _hasPlaceholderControls_dec, _isPlaceholderBehaviorEnabled_dec, _setPlaceholderBehaviorEnabled_dec, _supportsPlaceholderBehavior_dec, _hasPlaceholderBehavior_dec, _isPlaceholderEnabled_dec, _setPlaceholderEnabled_dec, _getFillSolidColor_dec, _setFillSolidColor_dec, _setFill_dec, _getFill_dec, _setFillEnabled_dec, _isFillEnabled_dec, _supportsFill_dec, _hasFill_dec, _getTextCursorRange_dec, _getTypeface_dec, _setTypeface_dec, _setFont_dec, _toggleItalicFont_dec, _toggleBoldFont_dec, _canToggleItalicFont_dec, _canToggleBoldFont_dec, _setTextCase_dec, _getTextCases_dec, _getTextFontStyles_dec, _setTextFontStyle_dec, _getTextFontSizes_dec, _setTextFontSize_dec, _getTextFontWeights_dec, _setTextFontWeight_dec, _getTextColors_dec, _setTextColor_dec, _removeText_dec, _replaceText_dec, _createCutoutFromOperation_dec, _createCutoutFromPath_dec, _createCutoutFromBlocks_dec, _getDropShadowClip_dec, _setDropShadowClip_dec, _getDropShadowBlurRadiusY_dec, _setDropShadowBlurRadiusY_dec, _getDropShadowBlurRadiusX_dec, _setDropShadowBlurRadiusX_dec, _getDropShadowOffsetY_dec, _setDropShadowOffsetY_dec, _getDropShadowOffsetX_dec, _setDropShadowOffsetX_dec, _getDropShadowColor_dec, _getDropShadowColorRGBA_dec, _setDropShadowColor_dec, _setDropShadowColorRGBA_dec, _isDropShadowEnabled_dec, _setDropShadowEnabled_dec, _supportsDropShadow_dec, _hasDropShadow_dec, _getStrokeCornerGeometry_dec, _setStrokeCornerGeometry_dec, _getStrokePosition_dec, _setStrokePosition_dec, _getStrokeStyle_dec, _setStrokeStyle_dec, _getStrokeWidth_dec, _setStrokeWidth_dec, _getStrokeColor_dec, _getStrokeColorRGBA_dec, _setStrokeColor_dec, _setStrokeColorRGBA_dec, _isStrokeEnabled_dec, _setStrokeEnabled_dec, _supportsStroke_dec, _hasStroke_dec, _isBackgroundColorEnabled_dec, _setBackgroundColorEnabled_dec, _getBackgroundColorRGBA_dec, _setBackgroundColorRGBA_dec, _supportsBackgroundColor_dec, _hasBackgroundColor_dec, _isBlurEnabled_dec, _setBlurEnabled_dec, _getBlur_dec, _setBlur_dec, _supportsBlur_dec, _hasBlur_dec, _createBlur_dec, _isEffectEnabled_dec, _setEffectEnabled_dec, _hasEffectEnabled_dec, _removeEffect_dec, _appendEffect_dec, _insertEffect_dec, _getEffects_dec, _supportsEffects_dec, _hasEffects_dec, _createEffect_dec, _isFillColorEnabled_dec, _setFillColorEnabled_dec, _getFillColorRGBA_dec, _setFillColorRGBA_dec, _setIncludedInExport_dec, _isIncludedInExport_dec, _hasFillColor_dec, _getBlendMode_dec, _setBlendMode_dec, _supportsBlendMode_dec, _hasBlendMode_dec, _getOpacity_dec, _setOpacity_dec, _supportsOpacity_dec, _hasOpacity_dec, _flipCropVertical_dec, _flipCropHorizontal_dec, _adjustCropToFillFrame_dec, _getCropTranslationY_dec, _getCropTranslationX_dec, _getCropScaleRatio_dec, _getCropRotation_dec, _getCropScaleY_dec, _getCropScaleX_dec, _resetCrop_dec, _setCropTranslationY_dec, _setCropTranslationX_dec, _setCropScaleRatio_dec, _setCropRotation_dec, _setCropScaleY_dec, _setCropScaleX_dec, _supportsCrop_dec, _hasCrop_dec, _getEnum_dec, _setEnum_dec, _addVideoFileURIToSourceSet_dec, _addImageFileURIToSourceSet_dec, _setSourceSet_dec, _getSourceSet_dec, _getGradientColorStops_dec, _setGradientColorStops_dec, _getColorSpotTint_dec, _getColorSpotName_dec, _setColorSpot_dec, _getColorRGBA_dec, _setColorRGBA_dec, _getColor_dec, _setColor_dec, _getString_dec, _setString_dec, _getDouble_dec, _setDouble_dec, _getFloat_dec, _setFloat_dec, _getInt_dec, _setInt_dec, _getBool_dec, _setBool_dec, _getEnumValues_dec, _getPropertyType_dec, _isPropertyWritable_dec, _isPropertyReadable_dec, _findAllProperties_dec, _scale_dec, _resizeContentAware_dec, _fillParent_dec, _isDistributable_dec, _distributeVertically_dec, _distributeHorizontally_dec, _isAlignable_dec, _alignVertically_dec, _alignHorizontally_dec, _getScreenSpaceBoundingBoxXYWH_dec, _getGlobalBoundingBoxHeight_dec, _getGlobalBoundingBoxWidth_dec, _getGlobalBoundingBoxY_dec, _getGlobalBoundingBoxX_dec, _referencesAnyVariables_dec, _appendChild_dec, _insertChild_dec, _getChildren_dec, _getParent_dec, _isValid_dec, _destroy_dec, _duplicate_dec, _getContentFillMode_dec, _setContentFillMode_dec, _getFrameHeight_dec, _getFrameWidth_dec, _getFrameY_dec, _getFrameX_dec, _setHeightMode_dec, _setHeight_dec, _setWidthMode_dec, _setWidth_dec, _getHeightMode_dec, _getHeight_dec, _getWidthMode_dec, _getWidth_dec, _supportsContentFillMode_dec, _hasContentFillMode_dec, _setFlipVertical_dec, _setFlipHorizontal_dec, _getFlipVertical_dec, _getFlipHorizontal_dec, _setRotation_dec, _getRotation_dec, _sendBackward_dec, _bringForward_dec, _sendToBack_dec, _bringToFront_dec, _isAlwaysOnBottom_dec, _isAlwaysOnTop_dec, _setAlwaysOnBottom_dec, _setAlwaysOnTop_dec, _setPositionYMode_dec, _setPositionY_dec, _setPositionXMode_dec, _setPositionX_dec, _getPositionYMode_dec, _getPositionY_dec, _getPositionXMode_dec, _getPositionX_dec, _setTransformLocked_dec, _isTransformLocked_dec, _setClipped_dec, _isClipped_dec, _setVisible_dec, _isVisible_dec, _setShape_dec, _getShape_dec, _supportsShape_dec, _hasShape_dec, _createShape_dec, _findAllPlaceholders_dec, _findAll_dec, _findByKind_dec, _findByType_dec, _findByName_dec, _getUUID_dec, _getName_dec, _setName_dec, _combine_dec, _isCombinable_dec, _exitGroup_dec, _enterGroup_dec, _ungroup_dec, _group_dec, _isGroupable_dec, _findAllSelected_dec, _isSelected_dec, _setSelected_dec, _select_dec, _setKind_dec, _getKind_dec, _getType_dec, _createFill_dec, _create_dec, _loadFromArchiveURL_dec, _loadFromString_dec, _ubq, _init;
_loadFromString_dec = [setter], _loadFromArchiveURL_dec = [setter], _create_dec = [setter], _createFill_dec = [setter], _getType_dec = [getter], _getKind_dec = [getter], _setKind_dec = [setter], _select_dec = [setter], _setSelected_dec = [setter], _isSelected_dec = [getter], _findAllSelected_dec = [getter], _isGroupable_dec = [getter], _group_dec = [setter], _ungroup_dec = [setter], _enterGroup_dec = [setter], _exitGroup_dec = [setter], _isCombinable_dec = [getter], _combine_dec = [setter], _setName_dec = [setter], _getName_dec = [getter], _getUUID_dec = [getter], _findByName_dec = [getter], _findByType_dec = [getter], _findByKind_dec = [getter], _findAll_dec = [getter], _findAllPlaceholders_dec = [getter], _createShape_dec = [setter], _hasShape_dec = [getter], _supportsShape_dec = [getter], _getShape_dec = [getter], _setShape_dec = [setter], _isVisible_dec = [getter], _setVisible_dec = [setter], _isClipped_dec = [getter], _setClipped_dec = [setter], _isTransformLocked_dec = [getter], _setTransformLocked_dec = [setter], _getPositionX_dec = [getter], _getPositionXMode_dec = [getter], _getPositionY_dec = [getter], _getPositionYMode_dec = [getter], _setPositionX_dec = [setter], _setPositionXMode_dec = [setter], _setPositionY_dec = [setter], _setPositionYMode_dec = [setter], _setAlwaysOnTop_dec = [setter], _setAlwaysOnBottom_dec = [setter], _isAlwaysOnTop_dec = [getter], _isAlwaysOnBottom_dec = [getter], _bringToFront_dec = [setter], _sendToBack_dec = [setter], _bringForward_dec = [setter], _sendBackward_dec = [setter], _getRotation_dec = [getter], _setRotation_dec = [setter], _getFlipHorizontal_dec = [getter], _getFlipVertical_dec = [getter], _setFlipHorizontal_dec = [setter], _setFlipVertical_dec = [setter], _hasContentFillMode_dec = [getter], _supportsContentFillMode_dec = [getter], _getWidth_dec = [getter], _getWidthMode_dec = [getter], _getHeight_dec = [getter], _getHeightMode_dec = [getter], _setWidth_dec = [setter], _setWidthMode_dec = [setter], _setHeight_dec = [setter], _setHeightMode_dec = [setter], _getFrameX_dec = [getter], _getFrameY_dec = [getter], _getFrameWidth_dec = [getter], _getFrameHeight_dec = [getter], _setContentFillMode_dec = [setter], _getContentFillMode_dec = [getter], _duplicate_dec = [setter], _destroy_dec = [setter], _isValid_dec = [getter], _getParent_dec = [getter], _getChildren_dec = [getter], _insertChild_dec = [setter], _appendChild_dec = [setter], _referencesAnyVariables_dec = [getter], _getGlobalBoundingBoxX_dec = [getter], _getGlobalBoundingBoxY_dec = [getter], _getGlobalBoundingBoxWidth_dec = [getter], _getGlobalBoundingBoxHeight_dec = [getter], _getScreenSpaceBoundingBoxXYWH_dec = [getter], _alignHorizontally_dec = [setter], _alignVertically_dec = [setter], _isAlignable_dec = [getter], _distributeHorizontally_dec = [setter], _distributeVertically_dec = [setter], _isDistributable_dec = [setter], _fillParent_dec = [setter], _resizeContentAware_dec = [setter], _scale_dec = [setter], _findAllProperties_dec = [getter], _isPropertyReadable_dec = [getter], _isPropertyWritable_dec = [getter], _getPropertyType_dec = [getter], _getEnumValues_dec = [getter], _setBool_dec = [setter], _getBool_dec = [getter], _setInt_dec = [setter], _getInt_dec = [getter], _setFloat_dec = [setter], _getFloat_dec = [getter], _setDouble_dec = [setter], _getDouble_dec = [getter], _setString_dec = [setter], _getString_dec = [getter], _setColor_dec = [setter], _getColor_dec = [getter], _setColorRGBA_dec = [setter], _getColorRGBA_dec = [getter], _setColorSpot_dec = [setter], _getColorSpotName_dec = [getter], _getColorSpotTint_dec = [getter], _setGradientColorStops_dec = [setter], _getGradientColorStops_dec = [getter], _getSourceSet_dec = [getter], _setSourceSet_dec = [setter], _addImageFileURIToSourceSet_dec = [setter], _addVideoFileURIToSourceSet_dec = [setter], _setEnum_dec = [setter], _getEnum_dec = [getter], _hasCrop_dec = [getter], _supportsCrop_dec = [getter], _setCropScaleX_dec = [setter], _setCropScaleY_dec = [setter], _setCropRotation_dec = [setter], _setCropScaleRatio_dec = [setter], _setCropTranslationX_dec = [setter], _setCropTranslationY_dec = [setter], _resetCrop_dec = [setter], _getCropScaleX_dec = [getter], _getCropScaleY_dec = [getter], _getCropRotation_dec = [getter], _getCropScaleRatio_dec = [getter], _getCropTranslationX_dec = [getter], _getCropTranslationY_dec = [getter], _adjustCropToFillFrame_dec = [setter], _flipCropHorizontal_dec = [setter], _flipCropVertical_dec = [setter], _hasOpacity_dec = [getter], _supportsOpacity_dec = [getter], _setOpacity_dec = [setter], _getOpacity_dec = [getter], _hasBlendMode_dec = [getter], _supportsBlendMode_dec = [getter], _setBlendMode_dec = [setter], _getBlendMode_dec = [getter], _hasFillColor_dec = [getter], _isIncludedInExport_dec = [getter], _setIncludedInExport_dec = [setter], _setFillColorRGBA_dec = [setter], _getFillColorRGBA_dec = [getter], _setFillColorEnabled_dec = [setter], _isFillColorEnabled_dec = [getter], _createEffect_dec = [setter], _hasEffects_dec = [getter], _supportsEffects_dec = [getter], _getEffects_dec = [getter], _insertEffect_dec = [setter], _appendEffect_dec = [setter], _removeEffect_dec = [setter], _hasEffectEnabled_dec = [getter], _setEffectEnabled_dec = [setter], _isEffectEnabled_dec = [getter], _createBlur_dec = [setter], _hasBlur_dec = [getter], _supportsBlur_dec = [getter], _setBlur_dec = [setter], _getBlur_dec = [getter], _setBlurEnabled_dec = [setter], _isBlurEnabled_dec = [getter], _hasBackgroundColor_dec = [getter], _supportsBackgroundColor_dec = [getter], _setBackgroundColorRGBA_dec = [setter], _getBackgroundColorRGBA_dec = [getter], _setBackgroundColorEnabled_dec = [setter], _isBackgroundColorEnabled_dec = [getter], _hasStroke_dec = [getter], _supportsStroke_dec = [getter], _setStrokeEnabled_dec = [setter], _isStrokeEnabled_dec = [getter], _setStrokeColorRGBA_dec = [setter], _setStrokeColor_dec = [setter], _getStrokeColorRGBA_dec = [getter], _getStrokeColor_dec = [getter], _setStrokeWidth_dec = [setter], _getStrokeWidth_dec = [getter], _setStrokeStyle_dec = [setter], _getStrokeStyle_dec = [getter], _setStrokePosition_dec = [setter], _getStrokePosition_dec = [getter], _setStrokeCornerGeometry_dec = [setter], _getStrokeCornerGeometry_dec = [getter], _hasDropShadow_dec = [getter], _supportsDropShadow_dec = [getter], _setDropShadowEnabled_dec = [setter], _isDropShadowEnabled_dec = [getter], _setDropShadowColorRGBA_dec = [setter], _setDropShadowColor_dec = [setter], _getDropShadowColorRGBA_dec = [getter], _getDropShadowColor_dec = [getter], _setDropShadowOffsetX_dec = [setter], _getDropShadowOffsetX_dec = [getter], _setDropShadowOffsetY_dec = [setter], _getDropShadowOffsetY_dec = [getter], _setDropShadowBlurRadiusX_dec = [setter], _getDropShadowBlurRadiusX_dec = [getter], _setDropShadowBlurRadiusY_dec = [setter], _getDropShadowBlurRadiusY_dec = [getter], _setDropShadowClip_dec = [setter], _getDropShadowClip_dec = [getter], _createCutoutFromBlocks_dec = [setter], _createCutoutFromPath_dec = [setter], _createCutoutFromOperation_dec = [setter], _replaceText_dec = [setter], _removeText_dec = [setter], _setTextColor_dec = [setter], _getTextColors_dec = [getter], _setTextFontWeight_dec = [setter], _getTextFontWeights_dec = [getter], _setTextFontSize_dec = [setter], _getTextFontSizes_dec = [getter], _setTextFontStyle_dec = [setter], _getTextFontStyles_dec = [getter], _getTextCases_dec = [getter], _setTextCase_dec = [setter], _canToggleBoldFont_dec = [getter], _canToggleItalicFont_dec = [getter], _toggleBoldFont_dec = [setter], _toggleItalicFont_dec = [setter], _setFont_dec = [setter], _setTypeface_dec = [setter], _getTypeface_dec = [getter], _getTextCursorRange_dec = [getter], _hasFill_dec = [getter], _supportsFill_dec = [getter], _isFillEnabled_dec = [getter], _setFillEnabled_dec = [setter], _getFill_dec = [getter], _setFill_dec = [setter], _setFillSolidColor_dec = [setter], _getFillSolidColor_dec = [getter], _setPlaceholderEnabled_dec = [setter], _isPlaceholderEnabled_dec = [getter], _hasPlaceholderBehavior_dec = [getter], _supportsPlaceholderBehavior_dec = [getter], _setPlaceholderBehaviorEnabled_dec = [setter], _isPlaceholderBehaviorEnabled_dec = [getter], _hasPlaceholderControls_dec = [getter], _supportsPlaceholderControls_dec = [getter], _setPlaceholderControlsOverlayEnabled_dec = [setter], _isPlaceholderControlsOverlayEnabled_dec = [getter], _setPlaceholderControlsButtonEnabled_dec = [setter], _isPlaceholderControlsButtonEnabled_dec = [getter], _setMetadata_dec = [setter], _getMetadata_dec = [getter], _hasMetadata_dec = [getter], _findAllMetadata_dec = [getter], _removeMetadata_dec = [setter], _setScopeEnabled_dec = [setter], _isScopeEnabled_dec = [getter], _isAllowedByScope_dec = [getter], _hasDuration_dec = [getter], _supportsDuration_dec = [getter], _setDuration_dec = [setter], _getDuration_dec = [getter], _hasTimeOffset_dec = [getter], _supportsTimeOffset_dec = [getter], _setTimeOffset_dec = [setter], _getTimeOffset_dec = [getter], _hasTrim_dec = [getter], _supportsTrim_dec = [getter], _setTrimOffset_dec = [setter], _getTrimOffset_dec = [getter], _setTrimLength_dec = [setter], _getTrimLength_dec = [getter], _getTotalSceneDuration_dec = [getter], _setPlaying_dec = [setter], _isPlaying_dec = [getter], _hasPlaybackTime_dec = [getter], _supportsPlaybackTime_dec = [getter], _setPlaybackTime_dec = [setter], _getPlaybackTime_dec = [getter], _isVisibleAtCurrentPlaybackTime_dec = [getter], _setSoloPlaybackEnabled_dec = [setter], _isSoloPlaybackEnabled_dec = [getter], _hasPlaybackControl_dec = [getter], _supportsPlaybackControl_dec = [getter], _setLooping_dec = [setter], _isLooping_dec = [getter], _setMuted_dec = [setter], _isMuted_dec = [getter], _setVolume_dec = [setter], _getVolume_dec = [getter], _forceLoadAVResource_dec = [setter], _unstable_isAVResourceLoaded_dec = [getter], _getAVResourceTotalDuration_dec = [getter], _getVideoWidth_dec = [getter], _getVideoHeight_dec = [getter], _getVideoFillThumbnail_dec = [getter], _getVideoFillThumbnailAtlas_dec = [getter], _getPageThumbnailAtlas_dec = [getter], _createAnimation_dec = [setter], _supportsAnimation_dec = [getter], _setInAnimation_dec = [setter], _setLoopAnimation_dec = [setter], _setOutAnimation_dec = [setter], _getInAnimation_dec = [getter], _getLoopAnimation_dec = [getter], _getOutAnimation_dec = [getter], _setNativePixelBuffer_dec = [setter], _getState_dec = [getter], _setState_dec = [setter], _forceLoadResources_dec = [setter];
var BlockAPI = class {
  /** @internal */
  constructor(ubq) {
    __runInitializers(_init, 5, this);
    /** @internal */
    __privateAdd(this, _ubq);
    /**
     * Subscribe to changes in the current set of selected blocks.
     * @param callback - This function is called at the end of the engine update if the selection has changed.
     * @returns A method to unsubscribe.
     */
    __publicField(this, "onSelectionChanged", (callback) => {
      const subscription = __privateGet(this, _ubq).subscribeToSelectionChange(callback);
      return () => {
        if (__privateGet(this, _ubq).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq).unsubscribe(subscription));
      };
    });
    /**
     * Subscribe to block click events.
     * @param callback - This function is called at the end of the engine update if a block has been clicked.
     * @returns A method to unsubscribe.
     */
    __publicField(this, "onClicked", (callback) => {
      const subscription = __privateGet(this, _ubq).subscribeToBlockClicked(callback);
      return () => {
        if (__privateGet(this, _ubq).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq).unsubscribe(subscription));
      };
    });
    /**
     * Subscribe to changes to the state of a block.
     * Like `getState`, the state of a block is determined by the state of itself and its `Shape`, `Fill` and
     * `Effect` block(s).
     * @param blocks - A list of blocks to filter events by. If the list is empty, events for every block are sent.
     * @param callback - The event callback.
     * @returns Subscription A handle to the subscription. Use it to unsubscribe when done.
     */
    __publicField(this, "onStateChanged", (ids, callback) => {
      assert2("ids", ids, array(integer()));
      const subscription = __privateGet(this, _ubq).subscribeToBlockState(ids, (blockIds) => {
        try {
          callback(cppVectorToArray_default(blockIds, true));
        } catch (e) {
          console.error(e);
        }
      });
      return () => {
        if (__privateGet(this, _ubq).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq).unsubscribe(subscription));
      };
    });
    __privateSet(this, _ubq, ubq);
  }
  /**
   * Exports a design block element as a file of the given mime type.
   * Performs an internal update to resolve the final layout for the blocks.
   * @param handle - The design block element to export.
   * @param mimeType - The mime type of the output file.
   * @param options - The options for exporting the block type
   * @returns A promise that resolves with the exported image or is rejected with an error.
   */
  async export(handle, mimeType2 = MimeType_default.Png, options = {}) {
    assert2("handle", handle, number());
    assert2("mimeType", mimeType2, mimeType());
    assert2("options", options, object());
    const useTargetSize = options.targetWidth != null && options.targetHeight != null;
    const jpegQuality = options.jpegQuality ?? 0.9;
    const webpQuality = options.webpQuality ?? 1;
    const pngCompressionLevel = options.pngCompressionLevel ?? 5;
    assert2(
      "jpegQuality",
      jpegQuality,
      min(max(number(), 1), 0, { exclusive: true })
    );
    assert2(
      "webpQuality",
      webpQuality,
      min(max(number(), 1), 0, { exclusive: true })
    );
    assert2(
      "pngCompressionLevel",
      pngCompressionLevel,
      min(max(integer(), 9), 0)
    );
    if (options.targetWidth != null || options.targetHeight != null) {
      assert2("targetWidth", options.targetWidth, number());
      assert2("targetHeight", options.targetHeight, number());
    }
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).exportToBuffer(
        handle,
        mimeType2,
        (result) => {
          if ("error" in result) {
            reject(result.error);
          } else {
            resolve(new Blob_default([result], { type: mimeType2 }));
          }
        },
        {
          pngCompressionLevel,
          jpegQuality,
          webpQuality,
          useTargetSize,
          targetWidth: options.targetWidth ?? 0,
          targetHeight: options.targetHeight ?? 0,
          exportPdfWithHighCompatibility: options.exportPdfWithHighCompatibility ?? true,
          exportPdfWithUnderlayer: options.exportPdfWithUnderlayer ?? false,
          underlayerSpotColorName: options.underlayerSpotColorName ?? "",
          underlayerOffset: options.underlayerOffset ?? 0
        }
      );
    });
  }
  /**
   * Exports a design block element as a file of the given mime type.
   * Performs an internal update to resolve the final layout for the blocks.
   * @param handle - The design block element to export.
   * @param mimeType - The mime type of the output file.
   * @param maskColorR - The red component of the special color mask color.
   * @param maskColorG - The green component of the special color mask color.
   * @param maskColorB - The blue component of the special color mask color.
   * @param options - The options for exporting the block type
   * @returns A promise that resolves with an array of the exported image and mask or is rejected with an error.
   */
  async exportWithColorMask(handle, mimeType2 = MimeType_default.Png, maskColorR, maskColorG, maskColorB, options = {}) {
    assert2("handle", handle, number());
    assert2("mimeType", mimeType2, mimeType());
    assert2("options", options, object());
    const useTargetSize = options.targetWidth != null && options.targetHeight != null;
    const jpegQuality = options.jpegQuality ?? 0.9;
    const webpQuality = options.webpQuality ?? 1;
    const pngCompressionLevel = options.pngCompressionLevel ?? 5;
    assert2(
      "jpegQuality",
      jpegQuality,
      min(max(number(), 1), 0, { exclusive: true })
    );
    assert2(
      "webpQuality",
      webpQuality,
      min(max(number(), 1), 0, { exclusive: true })
    );
    assert2(
      "pngCompressionLevel",
      pngCompressionLevel,
      min(max(integer(), 9), 0)
    );
    if (options.targetWidth != null || options.targetHeight != null) {
      assert2("targetWidth", options.targetWidth, number());
      assert2("targetHeight", options.targetHeight, number());
    }
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).exportWithColorMaskToBuffer(
        handle,
        mimeType2,
        maskColorR,
        maskColorG,
        maskColorB,
        (imageResult, maskResult) => {
          if ("error" in imageResult) {
            reject(imageResult.error);
          } else if ("error" in maskResult) {
            reject(maskResult.error);
          } else {
            const imageData = new Blob_default([imageResult], {
              type: mimeType2
            });
            const maskData = new Blob_default([maskResult], {
              type: mimeType2
            });
            resolve([imageData, maskData]);
          }
        },
        {
          pngCompressionLevel,
          jpegQuality,
          webpQuality,
          useTargetSize,
          targetWidth: options.targetWidth ?? 0,
          targetHeight: options.targetHeight ?? 0,
          exportPdfWithHighCompatibility: options.exportPdfWithHighCompatibility ?? true,
          exportPdfWithUnderlayer: options.exportPdfWithUnderlayer ?? false,
          underlayerSpotColorName: options.underlayerSpotColorName ?? "",
          underlayerOffset: options.underlayerOffset ?? 0
        }
      );
    });
  }
  /**
   * Exports a design block as a video file of the given mime type.
   * Note: The export will run across multiple iterations of the update loop. In each iteration a frame is scheduled for encoding.
   * @param handle - The design block element to export. Currently, only page blocks are supported.
   * @param mimeType - The mime type of the output video file.
   * @param progressCallback - A callback which reports on the progress of the export. It informs the receiver of the current frame index, which currently gets exported and the total frame count.
   * @param options - The options for exporting the video.
   * @returns A promise that resolves with a video blob or is rejected with an error.
   */
  async exportVideo(handle, mimeType2 = MimeType_default.Mp4, progressCallback, options) {
    throw new Error(
      "Method not implemented. An implementation is available on the BlockAPI at engine.block or cesdk.engine.block"
    );
  }
  /**
   * Exports a design block as an audio file of the given mime type.
   * @param handle - The design block element to export. Currently, only audio blocks are supported.
   * @param mimeType - The mime type of the output audio file.
   * @param progressCallback - A callback which reports on the progress of the export.
   * @param options - The options for exporting the audio.
   * @returns A promise that resolves with an audio blob or is rejected with an error.
   */
  async unstable_exportAudio(handle, mimeType2 = MimeType_default.Wav, progressCallback, options) {
    assert2("handle", handle, number());
    assert2("mimeType", mimeType2, mimeType());
    assert2("options", options, object());
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).unstable_exportAudioToBuffer(
        handle,
        options.timeOffset ?? 0,
        options.duration ?? 0,
        mimeType2,
        progressCallback,
        (result) => {
          if ("error" in result) {
            reject(result.error);
          } else {
            resolve(new Blob_default([result], { type: mimeType2 }));
          }
        },
        {
          sampleRate: options.sampleRate ?? 48e3,
          numberOfChannels: options.numberOfChannels ?? 2
        }
      );
    });
  }
  async loadFromString(content) {
    assert2("content", content, string());
    return unpackAsync(
      (cb) => __privateGet(this, _ubq).loadBlocksFromString(content, cb)
    ).then((vector) => cppVectorToArray_default(vector));
  }
  loadFromArchiveURL(url) {
    assert2("url", url, string());
    return unpackAsync(
      (cb) => __privateGet(this, _ubq).loadBlocksFromArchiveURL(url, cb)
    ).then((vector) => cppVectorToArray_default(vector));
  }
  /**
   * Saves the given blocks into a string. If given the root of a block hierarchy, e.g. a
   * page with multiple children, the entire hierarchy is saved.
   * @param blocks - The blocks to save
   * @returns A promise that resolves to a string representing the blocks or an error.
   */
  async saveToString(blocks, allowedResourceSchemes = ["buffer", "http", "https"]) {
    assert2("blocks", blocks, array(number()));
    return unpackAsync(
      (cb) => __privateGet(this, _ubq).saveBlocksToString(blocks, cb, allowedResourceSchemes)
    );
  }
  /**
   * Saves the given blocks and all of their referenced assets into an archive.
   * The archive contains all assets that were accessible when this function was called.
   * Blocks in the archived scene reference assets relative from to the location of the scene
   * file. These references are resolved when loading such a scene via `loadSceneFromURL`.
   * @param blocks - The blocks to save
   * @returns A promise that resolves with a Blob on success or an error on failure.
   */
  async saveToArchive(blocks) {
    assert2("blocks", blocks, array(number()));
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).saveBlocksToArchive(blocks, (result) => {
        if ("error" in result) {
          reject(result.error);
        } else {
          resolve(new Blob_default([result], { type: MimeType_default.Zip }));
        }
      });
    });
  }
  create(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq).create(type2));
  }
  createFill(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq).createFill(type2));
  }
  getType(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getType(id));
  }
  getKind(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getKind(id));
  }
  setKind(id, kind) {
    assert2("id", id, integer());
    unpackResult(__privateGet(this, _ubq).setKind(id, kind));
  }
  select(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).select(id));
  }
  setSelected(id, selected) {
    assert2("id", id, integer());
    assert2("selected", selected, boolean());
    return unpackResult(__privateGet(this, _ubq).setSelected(id, selected));
  }
  isSelected(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isSelected(id));
  }
  findAllSelected() {
    return cppVectorToArray_default(__privateGet(this, _ubq).findAllSelected());
  }
  isGroupable(ids) {
    assert2("ids", ids, array(number()));
    return unpackResult(__privateGet(this, _ubq).isGroupable(ids));
  }
  group(ids) {
    assert2("ids", ids, nonempty(array(number())));
    return unpackResult(__privateGet(this, _ubq).group(ids));
  }
  ungroup(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).ungroup(id));
  }
  enterGroup(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).enterGroup(id));
  }
  exitGroup(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).exitGroup(id));
  }
  isCombinable(ids) {
    assert2("ids", ids, array(number()));
    return unpackResult(__privateGet(this, _ubq).isCombinable(ids));
  }
  combine(ids, op) {
    assert2("ids", ids, array(number()));
    assert2("op", op, string());
    return unpackResult(__privateGet(this, _ubq).combine(ids, op));
  }
  setName(id, name) {
    assert2("id", id, integer());
    assert2("name", name, string());
    return unpackResult(__privateGet(this, _ubq).setName(id, name));
  }
  getName(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getName(id));
  }
  getUUID(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getUUID(id));
  }
  findByName(name) {
    assert2("name", name, string());
    const result = __privateGet(this, _ubq).findByName(name);
    return cppVectorToArray_default(result);
  }
  findByType(type2) {
    assert2("type", type2, string());
    const result = __privateGet(this, _ubq).findByType(type2);
    const vector = unpackResult(result);
    return cppVectorToArray_default(vector);
  }
  findByKind(kind) {
    assert2("kind", kind, string());
    const result = __privateGet(this, _ubq).findByKind(kind);
    const vector = unpackResult(result);
    return cppVectorToArray_default(vector);
  }
  findAll() {
    return cppVectorToArray_default(__privateGet(this, _ubq).findAll());
  }
  findAllPlaceholders() {
    return cppVectorToArray_default(__privateGet(this, _ubq).findAllPlaceholders());
  }
  createShape(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq).createShape(type2));
  }
  hasShape(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasShape(id));
  }
  supportsShape(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsShape(id));
  }
  getShape(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getShape(id));
  }
  setShape(id, shape) {
    assert2("id", id, integer());
    assert2("shape", shape, integer());
    return unpackResult(__privateGet(this, _ubq).setShape(id, shape));
  }
  isVisible(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isVisible(id));
  }
  setVisible(id, visible) {
    assert2("id", id, integer());
    assert2("visible", visible, boolean());
    return unpackResult(__privateGet(this, _ubq).setVisible(id, visible));
  }
  isClipped(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isClipped(id));
  }
  setClipped(id, clipped) {
    assert2("id", id, integer());
    assert2("clipped", clipped, boolean());
    return unpackResult(__privateGet(this, _ubq).setClipped(id, clipped));
  }
  isTransformLocked(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isTransformLocked(id));
  }
  setTransformLocked(id, locked) {
    assert2("id", id, integer());
    assert2("locked", locked, boolean());
    return unpackResult(__privateGet(this, _ubq).setTransformLocked(id, locked));
  }
  getPositionX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getPositionX(id));
  }
  getPositionXMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getPositionXMode(id));
  }
  getPositionY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getPositionY(id));
  }
  getPositionYMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getPositionYMode(id));
  }
  setPositionX(id, value) {
    assert2("id", id, integer());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq).setPositionX(id, value));
  }
  setPositionXMode(id, mode) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setPositionXMode(id, mode));
  }
  setPositionY(id, value) {
    assert2("id", id, integer());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq).setPositionY(id, value));
  }
  setPositionYMode(id, mode) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setPositionYMode(id, mode));
  }
  setAlwaysOnTop(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setAlwaysOnTop(id, enabled));
  }
  setAlwaysOnBottom(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setAlwaysOnBottom(id, enabled));
  }
  isAlwaysOnTop(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isAlwaysOnTop(id));
  }
  isAlwaysOnBottom(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isAlwaysOnBottom(id));
  }
  bringToFront(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).bringToFront(id));
  }
  sendToBack(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).sendToBack(id));
  }
  bringForward(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).bringForward(id));
  }
  sendBackward(id) {
    assert2("id", id, number());
    return unpackResult(__privateGet(this, _ubq).sendBackward(id));
  }
  getRotation(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getRotation(id));
  }
  setRotation(id, radians) {
    assert2("id", id, integer());
    assert2("radians", radians, number());
    return unpackResult(__privateGet(this, _ubq).setRotation(id, radians));
  }
  getFlipHorizontal(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getFlip(id)).horizontal;
  }
  getFlipVertical(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getFlip(id)).vertical;
  }
  setFlipHorizontal(id, flip) {
    assert2("id", id, integer());
    assert2("flip", flip, boolean());
    return unpackResult(__privateGet(this, _ubq).setFlipHorizontal(id, flip));
  }
  setFlipVertical(id, flip) {
    assert2("id", id, integer());
    assert2("flip", flip, boolean());
    return unpackResult(__privateGet(this, _ubq).setFlipVertical(id, flip));
  }
  hasContentFillMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasContentFillMode(id));
  }
  supportsContentFillMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsContentFillMode(id));
  }
  getWidth(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getWidth(id));
  }
  getWidthMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getWidthMode(id));
  }
  getHeight(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getHeight(id));
  }
  getHeightMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getHeightMode(id));
  }
  setWidth(id, value) {
    assert2("id", id, integer());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq).setWidth(id, value));
  }
  setWidthMode(id, mode) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setWidthMode(id, mode));
  }
  setHeight(id, value) {
    assert2("id", id, integer());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq).setHeight(id, value));
  }
  setHeightMode(id, mode) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setHeightMode(id, mode));
  }
  getFrameX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getLastFrameX(id));
  }
  getFrameY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getLastFrameY(id));
  }
  getFrameWidth(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getLastFrameWidth(id));
  }
  getFrameHeight(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getLastFrameHeight(id));
  }
  setContentFillMode(id, mode) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setContentFillMode(id, mode));
  }
  getContentFillMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getContentFillMode(id));
  }
  duplicate(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).duplicate(id));
  }
  destroy(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).destroy(id));
  }
  isValid(id) {
    assert2("id", id, integer());
    return __privateGet(this, _ubq).isValid(id);
  }
  getParent(id) {
    assert2("id", id, integer());
    if (!unpackResult(__privateGet(this, _ubq).hasParent(id))) return null;
    return unpackResult(__privateGet(this, _ubq).getParent(id));
  }
  getChildren(id) {
    assert2("id", id, integer());
    const vector = unpackResult(__privateGet(this, _ubq).getChildren(id));
    return cppVectorToArray_default(vector);
  }
  insertChild(parent, child, index) {
    assert2("parent", parent, number());
    assert2("child", child, number());
    assert2("index", index, min(number(), 0));
    return unpackResult(__privateGet(this, _ubq).insertChild(parent, child, index));
  }
  appendChild(parent, child) {
    assert2("parent", parent, number());
    assert2("child", child, number());
    return unpackResult(__privateGet(this, _ubq).appendChild(parent, child));
  }
  referencesAnyVariables(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).referencesAnyVariables(id));
  }
  getGlobalBoundingBoxX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getGlobalBoundingBoxX(id));
  }
  getGlobalBoundingBoxY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getGlobalBoundingBoxY(id));
  }
  getGlobalBoundingBoxWidth(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getGlobalBoundingBoxWidth(id));
  }
  getGlobalBoundingBoxHeight(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getGlobalBoundingBoxHeight(id));
  }
  getScreenSpaceBoundingBoxXYWH(ids) {
    assert2("ids", ids, array(number()));
    return unpackResult(__privateGet(this, _ubq).getScreenSpaceBoundingBoxXYWH(ids));
  }
  alignHorizontally(ids, horizontalBlockAlignment) {
    assert2("ids", ids, nonempty(array(number())));
    return unpackResult(
      __privateGet(this, _ubq).alignHorizontally(ids, horizontalBlockAlignment)
    );
  }
  alignVertically(ids, verticalBlockAlignment) {
    assert2("ids", ids, nonempty(array(number())));
    return unpackResult(__privateGet(this, _ubq).alignVertically(ids, verticalBlockAlignment));
  }
  isAlignable(ids) {
    assert2("ids", ids, array(number()));
    return unpackResult(__privateGet(this, _ubq).isAlignable(ids));
  }
  distributeHorizontally(ids) {
    assert2("ids", ids, nonempty(array(number())));
    return unpackResult(__privateGet(this, _ubq).distributeHorizontally(ids));
  }
  distributeVertically(ids) {
    assert2("ids", ids, nonempty(array(number())));
    return unpackResult(__privateGet(this, _ubq).distributeVertically(ids));
  }
  isDistributable(ids) {
    assert2("ids", ids, array(number()));
    return unpackResult(__privateGet(this, _ubq).isDistributable(ids));
  }
  fillParent(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).fillParent(id));
  }
  resizeContentAware(ids, width, height) {
    assert2("ids", ids, array(number()));
    assert2("width", width, number());
    assert2("height", height, number());
    return unpackResult(__privateGet(this, _ubq).resizeContentAware(ids, width, height));
  }
  scale(id, scale, anchorX = 0, anchorY = 0) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).scale(id, scale, anchorX, anchorY));
  }
  findAllProperties(id) {
    assert2("id", id, integer());
    return cppVectorToArray_default(unpackResult(__privateGet(this, _ubq).findAllProperties(id)));
  }
  isPropertyReadable(property) {
    assert2("property", property, string());
    return __privateGet(this, _ubq).isPropertyReadable(property);
  }
  isPropertyWritable(property) {
    assert2("property", property, string());
    return __privateGet(this, _ubq).isPropertyWritable(property);
  }
  getPropertyType(property) {
    assert2("property", property, string());
    const type2 = unpackResult(__privateGet(this, _ubq).getPropertyType(property));
    return type2;
  }
  getEnumValues(enumProperty) {
    assert2("enumProperty", enumProperty, string());
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq).getEnumValues(enumProperty))
    );
  }
  setBool(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("value", value, boolean());
    return unpackResult(__privateGet(this, _ubq).setBool(id, property, value));
  }
  getBool(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getBool(id, property));
  }
  setInt(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("value", value, integer());
    return unpackResult(__privateGet(this, _ubq).setInt(id, property, value));
  }
  getInt(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getInt(id, property));
  }
  setFloat(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq).setFloat(id, property, value));
  }
  getFloat(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getFloat(id, property));
  }
  setDouble(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq).setDouble(id, property, value));
  }
  getDouble(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getDouble(id, property));
  }
  setString(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("value", value, string());
    return unpackResult(__privateGet(this, _ubq).setString(id, property, value));
  }
  getString(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getString(id, property));
  }
  setColor(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(
      __privateGet(this, _ubq).setColor(id, property, ColorInternal.fromColor(value))
    );
  }
  getColor(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return ColorInternal.toColor(
      unpackResult(__privateGet(this, _ubq).getColor(id, property))
    );
  }
  setColorRGBA(id, property, r, g, b, a = 1) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    assert2("a", a, number());
    return unpackResult(__privateGet(this, _ubq).setColorRGBA(id, property, r, g, b, a));
  }
  getColorRGBA(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getColorRGBA(id, property));
  }
  setColorSpot(id, property, name, tint = 1) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("name", name, string());
    assert2("tint", tint, number());
    return unpackResult(__privateGet(this, _ubq).setColorSpot(id, property, name, tint));
  }
  getColorSpotName(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getColorSpotName(id, property));
  }
  getColorSpotTint(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getColorSpotTint(id, property));
  }
  setGradientColorStops(id, property, colors) {
    assert2("id", id, integer());
    assert2("property", property, string());
    const engineColors = colors.map((colorStop) => {
      return {
        color: ColorInternal.fromColor(colorStop.color),
        stop: colorStop.stop
      };
    });
    return unpackResult(
      __privateGet(this, _ubq).setGradientColorStops(id, property, engineColors)
    );
  }
  getGradientColorStops(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    const result = __privateGet(this, _ubq).getGradientColorStops(id, property);
    const vector = unpackResult(result);
    return cppVectorToArray_default(vector).map((colorStop) => {
      return {
        color: ColorInternal.toColor(colorStop.color),
        stop: colorStop.stop
      };
    });
  }
  getSourceSet(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return cppVectorToArray_default(unpackResult(__privateGet(this, _ubq).getSourceSet(id, property)));
  }
  setSourceSet(id, property, sourceSet) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2(
      "sourceSet",
      sourceSet,
      array(
        object({
          uri: string(),
          width: number(),
          height: number()
        })
      )
    );
    unpackResult(__privateGet(this, _ubq).setSourceSet(id, property, sourceSet));
  }
  addImageFileURIToSourceSet(id, property, uri) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("uri", uri, string());
    return unpackAsync(
      (cb) => __privateGet(this, _ubq).addImageFileURIToSourceSet(id, property, uri, cb)
    );
  }
  addVideoFileURIToSourceSet(id, property, uri) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("uri", uri, string());
    return unpackAsync(
      (cb) => __privateGet(this, _ubq).addVideoFileURIToSourceSet(id, property, uri, cb)
    );
  }
  setEnum(id, property, value) {
    assert2("id", id, integer());
    assert2("property", property, string());
    assert2("value", value, string());
    return unpackResult(__privateGet(this, _ubq).setEnum(id, property, value));
  }
  getEnum(id, property) {
    assert2("id", id, integer());
    assert2("property", property, string());
    return unpackResult(__privateGet(this, _ubq).getEnum(id, property));
  }
  hasCrop(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasCrop(id));
  }
  supportsCrop(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsCrop(id));
  }
  setCropScaleX(id, scaleX) {
    assert2("id", id, integer());
    assert2("scaleX", scaleX, number());
    return unpackResult(__privateGet(this, _ubq).setCropScaleX(id, scaleX));
  }
  setCropScaleY(id, scaleY) {
    assert2("id", id, integer());
    assert2("scaleY", scaleY, number());
    return unpackResult(__privateGet(this, _ubq).setCropScaleY(id, scaleY));
  }
  setCropRotation(id, rotation) {
    assert2("id", id, integer());
    assert2("rotation", rotation, number());
    return unpackResult(__privateGet(this, _ubq).setCropRotation(id, rotation));
  }
  setCropScaleRatio(id, scaleRatio) {
    assert2("id", id, integer());
    assert2("scaleRatio", scaleRatio, number());
    return unpackResult(__privateGet(this, _ubq).setCropScaleRatio(id, scaleRatio));
  }
  setCropTranslationX(id, translationX) {
    assert2("id", id, integer());
    assert2("translationX", translationX, number());
    return unpackResult(__privateGet(this, _ubq).setCropTranslationX(id, translationX));
  }
  setCropTranslationY(id, translationY) {
    assert2("id", id, integer());
    assert2("translationY", translationY, number());
    return unpackResult(__privateGet(this, _ubq).setCropTranslationY(id, translationY));
  }
  resetCrop(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).resetCrop(id));
  }
  getCropScaleX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getCropScaleX(id));
  }
  getCropScaleY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getCropScaleY(id));
  }
  getCropRotation(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getCropRotation(id));
  }
  getCropScaleRatio(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getCropScaleRatio(id));
  }
  getCropTranslationX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getCropTranslationX(id));
  }
  getCropTranslationY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getCropTranslationY(id));
  }
  adjustCropToFillFrame(id, minScaleRatio) {
    assert2("id", id, integer());
    assert2("minScaleRatio", minScaleRatio, number());
    return unpackResult(__privateGet(this, _ubq).adjustCropToFillFrame(id, minScaleRatio));
  }
  flipCropHorizontal(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).flipCropHorizontal(id));
  }
  flipCropVertical(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).flipCropVertical(id));
  }
  hasOpacity(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasOpacity(id));
  }
  supportsOpacity(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsOpacity(id));
  }
  setOpacity(id, opacity) {
    assert2("id", id, integer());
    assert2("opacity", opacity, number());
    return unpackResult(__privateGet(this, _ubq).setOpacity(id, opacity));
  }
  getOpacity(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getOpacity(id));
  }
  hasBlendMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasBlendMode(id));
  }
  supportsBlendMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsBlendMode(id));
  }
  setBlendMode(id, blendMode) {
    assert2("id", id, integer());
    assert2("blendMode", blendMode, string());
    return unpackResult(__privateGet(this, _ubq).setBlendMode(id, blendMode));
  }
  getBlendMode(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getBlendMode(id));
  }
  hasFillColor(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasFillColor(id));
  }
  isIncludedInExport(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isIncludedInExport(id));
  }
  setIncludedInExport(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setIncludedInExport(id, enabled));
  }
  setFillColorRGBA(id, r, g, b, a = 1) {
    assert2("id", id, integer());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    assert2("a", a, number());
    return unpackResult(__privateGet(this, _ubq).setFillColorRGBA(id, r, g, b, a));
  }
  getFillColorRGBA(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getFillColorRGBA(id));
  }
  setFillColorEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setFillColorEnabled(id, enabled));
  }
  isFillColorEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isFillColorEnabled(id));
  }
  createEffect(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq).createEffect(type2));
  }
  hasEffects(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasEffects(id));
  }
  supportsEffects(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsEffects(id));
  }
  getEffects(id) {
    assert2("id", id, integer());
    const result = __privateGet(this, _ubq).getEffects(id);
    const vector = unpackResult(result);
    return cppVectorToArray_default(vector);
  }
  insertEffect(id, effectId, index) {
    assert2("id", id, integer());
    assert2("effectId", effectId, integer());
    assert2("index", index, min(integer(), 0));
    unpackResult(__privateGet(this, _ubq).insertEffect(id, effectId, index));
  }
  appendEffect(id, effectId) {
    assert2("id", id, integer());
    assert2("effectId", effectId, integer());
    unpackResult(__privateGet(this, _ubq).appendEffect(id, effectId));
  }
  removeEffect(id, index) {
    assert2("id", id, integer());
    assert2("index", index, min(integer(), 0));
    unpackResult(__privateGet(this, _ubq).removeEffect(id, index));
  }
  hasEffectEnabled(effectId) {
    assert2("effectId", effectId, integer());
    return unpackResult(__privateGet(this, _ubq).hasEffectEnabled(effectId));
  }
  setEffectEnabled(effectId, enabled) {
    assert2("effectId", effectId, integer());
    assert2("enabled", enabled, boolean());
    unpackResult(__privateGet(this, _ubq).setEffectEnabled(effectId, enabled));
  }
  isEffectEnabled(effectId) {
    assert2("effectId", effectId, integer());
    return unpackResult(__privateGet(this, _ubq).isEffectEnabled(effectId));
  }
  createBlur(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq).createBlur(type2));
  }
  hasBlur(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasBlur(id));
  }
  supportsBlur(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsBlur(id));
  }
  setBlur(id, blurId) {
    assert2("id", id, integer());
    assert2("blurId", blurId, integer());
    unpackResult(__privateGet(this, _ubq).setBlur(id, blurId));
  }
  getBlur(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getBlur(id));
  }
  setBlurEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    unpackResult(__privateGet(this, _ubq).setBlurEnabled(id, enabled));
  }
  isBlurEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isBlurEnabled(id));
  }
  hasBackgroundColor(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasBackgroundColor(id));
  }
  supportsBackgroundColor(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsBackgroundColor(id));
  }
  setBackgroundColorRGBA(id, r, g, b, a = 1) {
    assert2("id", id, integer());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    assert2("a", a, number());
    return unpackResult(__privateGet(this, _ubq).setBackgroundColorRGBA(id, r, g, b, a));
  }
  getBackgroundColorRGBA(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getBackgroundColorRGBA(id));
  }
  setBackgroundColorEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setBackgroundColorEnabled(id, enabled));
  }
  isBackgroundColorEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isBackgroundColorEnabled(id));
  }
  hasStroke(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasStroke(id));
  }
  supportsStroke(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsStroke(id));
  }
  setStrokeEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setStrokeEnabled(id, enabled));
  }
  isStrokeEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isStrokeEnabled(id));
  }
  setStrokeColorRGBA(id, r, g, b, a = 1) {
    assert2("id", id, integer());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    assert2("a", a, number());
    return unpackResult(__privateGet(this, _ubq).setStrokeColorRGBA(id, r, g, b, a));
  }
  setStrokeColor(id, color) {
    assert2("id", id, integer());
    return unpackResult(
      __privateGet(this, _ubq).setStrokeColor(id, ColorInternal.fromColor(color))
    );
  }
  getStrokeColorRGBA(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getStrokeColorRGBA(id));
  }
  getStrokeColor(id) {
    assert2("id", id, integer());
    return ColorInternal.toColor(unpackResult(__privateGet(this, _ubq).getStrokeColor(id)));
  }
  setStrokeWidth(id, width) {
    assert2("id", id, integer());
    assert2("width", width, number());
    return unpackResult(__privateGet(this, _ubq).setStrokeWidth(id, width));
  }
  getStrokeWidth(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getStrokeWidth(id));
  }
  setStrokeStyle(id, style) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setStrokeStyle(id, style));
  }
  getStrokeStyle(id) {
    assert2("id", id, integer());
    const style = unpackResult(__privateGet(this, _ubq).getStrokeStyle(id));
    return style;
  }
  setStrokePosition(id, position) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setStrokePosition(id, position));
  }
  getStrokePosition(id) {
    assert2("id", id, integer());
    const position = unpackResult(__privateGet(this, _ubq).getStrokePosition(id));
    return position;
  }
  setStrokeCornerGeometry(id, cornerGeometry) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setStrokeCornerGeometry(id, cornerGeometry));
  }
  getStrokeCornerGeometry(id) {
    assert2("id", id, integer());
    const cornerGeometry = unpackResult(__privateGet(this, _ubq).getStrokeCornerGeometry(id));
    return cornerGeometry;
  }
  hasDropShadow(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasDropShadow(id));
  }
  supportsDropShadow(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsDropShadow(id));
  }
  setDropShadowEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setDropShadowEnabled(id, enabled));
  }
  isDropShadowEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isDropShadowEnabled(id));
  }
  setDropShadowColorRGBA(id, r, g, b, a = 1) {
    assert2("id", id, integer());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    assert2("a", a, number());
    return unpackResult(__privateGet(this, _ubq).setDropShadowColorRGBA(id, r, g, b, a));
  }
  setDropShadowColor(id, color) {
    assert2("id", id, integer());
    return unpackResult(
      __privateGet(this, _ubq).setDropShadowColor(id, ColorInternal.fromColor(color))
    );
  }
  getDropShadowColorRGBA(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDropShadowColorRGBA(id));
  }
  getDropShadowColor(id) {
    assert2("id", id, integer());
    return ColorInternal.toColor(
      unpackResult(__privateGet(this, _ubq).getDropShadowColor(id))
    );
  }
  setDropShadowOffsetX(id, offsetX) {
    assert2("id", id, integer());
    assert2("offsetX", offsetX, number());
    return unpackResult(__privateGet(this, _ubq).setDropShadowOffsetX(id, offsetX));
  }
  getDropShadowOffsetX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDropShadowOffsetX(id));
  }
  setDropShadowOffsetY(id, offsetY) {
    assert2("id", id, integer());
    assert2("offsetY", offsetY, number());
    return unpackResult(__privateGet(this, _ubq).setDropShadowOffsetY(id, offsetY));
  }
  getDropShadowOffsetY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDropShadowOffsetY(id));
  }
  setDropShadowBlurRadiusX(id, blurRadiusX) {
    assert2("id", id, integer());
    assert2("blurRadiusX", blurRadiusX, number());
    return unpackResult(__privateGet(this, _ubq).setDropShadowBlurRadiusX(id, blurRadiusX));
  }
  getDropShadowBlurRadiusX(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDropShadowBlurRadiusX(id));
  }
  setDropShadowBlurRadiusY(id, blurRadiusY) {
    assert2("id", id, integer());
    assert2("blurRadiusY", blurRadiusY, number());
    return unpackResult(__privateGet(this, _ubq).setDropShadowBlurRadiusY(id, blurRadiusY));
  }
  getDropShadowBlurRadiusY(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDropShadowBlurRadiusY(id));
  }
  setDropShadowClip(id, clip) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setDropShadowClip(id, clip));
  }
  getDropShadowClip(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDropShadowClip(id));
  }
  createCutoutFromBlocks(ids, vectorizeDistanceThreshold = 2, simplifyDistanceThreshold = 4, useExistingShapeInformation = true) {
    assert2("ids", ids, array(integer()));
    assert2("vectorizeDistanceThreshold", vectorizeDistanceThreshold, number());
    assert2("maxSmoothingDistance", simplifyDistanceThreshold, number());
    assert2(
      "useExistingShapeInformation",
      useExistingShapeInformation,
      boolean()
    );
    return unpackResult(
      __privateGet(this, _ubq).createCutoutFromBlocks(
        ids,
        vectorizeDistanceThreshold,
        simplifyDistanceThreshold,
        useExistingShapeInformation
      )
    );
  }
  createCutoutFromPath(path) {
    assert2("path", path, string());
    return unpackResult(__privateGet(this, _ubq).createCutoutFromPath(path));
  }
  createCutoutFromOperation(ids, op) {
    assert2("ids", ids, array(integer()));
    assert2("op", op, cutoutOperationShape());
    return unpackResult(__privateGet(this, _ubq).createCutoutFromOperation(ids, op));
  }
  replaceText(id, text, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("text", text, string());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(__privateGet(this, _ubq).replaceText(id, text, from, to));
  }
  removeText(id, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(__privateGet(this, _ubq).removeText(id, from, to));
  }
  setTextColor(id, color, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(
      __privateGet(this, _ubq).setTextColor(id, ColorInternal.fromColor(color), from, to)
    );
  }
  getTextColors(id, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    const result = __privateGet(this, _ubq).getTextColors(id, from, to);
    const colorInternals = cppVectorToArray_default(unpackResult(result));
    return colorInternals.map((colorInternal) => {
      return ColorInternal.toColor(colorInternal);
    });
  }
  setTextFontWeight(id, fontWeight, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(__privateGet(this, _ubq).setTextFontWeight(id, fontWeight, from, to));
  }
  getTextFontWeights(id, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq).getTextFontWeights(id, from, to))
    );
  }
  setTextFontSize(id, fontSize, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(__privateGet(this, _ubq).setTextFontSize(id, fontSize, from, to));
  }
  getTextFontSizes(id, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq).getTextFontSizes(id, from, to))
    );
  }
  setTextFontStyle(id, fontStyle, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(__privateGet(this, _ubq).setTextFontStyle(id, fontStyle, from, to));
  }
  getTextFontStyles(id, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq).getTextFontStyles(id, from, to))
    );
  }
  getTextCases(id, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("from", from, integer());
    assert2("to", to, integer());
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq).getTextCases(id, from, to))
    );
  }
  setTextCase(id, textCase, from = -1, to = -1) {
    assert2("id", id, integer());
    assert2("textCase", textCase, string());
    assert2("from", from, integer());
    assert2("to", to, integer());
    unpackResult(__privateGet(this, _ubq).setTextCase(id, textCase, from, to));
  }
  canToggleBoldFont(id, from = -1, to = -1) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).canToggleBoldFont(id, from, to));
  }
  canToggleItalicFont(id, from = -1, to = -1) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).canToggleItalicFont(id, from, to));
  }
  toggleBoldFont(id, from = -1, to = -1) {
    assert2("id", id, integer());
    unpackResult(__privateGet(this, _ubq).toggleBoldFont(id, from, to));
  }
  toggleItalicFont(id, from = -1, to = -1) {
    assert2("id", id, integer());
    unpackResult(__privateGet(this, _ubq).toggleItalicFont(id, from, to));
  }
  setFont(id, fontFileUri, typeface) {
    assert2("block", id, integer());
    assert2("fontFileUri", fontFileUri, string());
    unpackResult(__privateGet(this, _ubq).setFont(id, fontFileUri, typeface));
  }
  setTypeface(id, fallbackFontFileUri, typeface) {
    assert2("block", id, integer());
    assert2("fontFileUri", fallbackFontFileUri, string());
    unpackResult(__privateGet(this, _ubq).setTypeface(id, fallbackFontFileUri, typeface));
  }
  getTypeface(id) {
    assert2("block", id, integer());
    return unpackResult(__privateGet(this, _ubq).getTypeface(id));
  }
  getTextCursorRange() {
    return unpackResult(__privateGet(this, _ubq).getTextCursorRange());
  }
  hasFill(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasFill(id));
  }
  supportsFill(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsFill(id));
  }
  isFillEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isFillEnabled(id));
  }
  setFillEnabled(id, enabled) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).setFillEnabled(id, enabled));
  }
  getFill(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getFill(id));
  }
  setFill(id, fill) {
    assert2("id", id, integer());
    assert2("fill", fill, integer());
    return unpackResult(__privateGet(this, _ubq).setFill(id, fill));
  }
  setFillSolidColor(id, r, g, b, a = 1) {
    assert2("id", id, integer());
    unpackResult(__privateGet(this, _ubq).setFillSolidColor(id, r, g, b, a));
  }
  getFillSolidColor(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getFillSolidColor(id));
  }
  setPlaceholderEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    unpackResult(__privateGet(this, _ubq).setPlaceholderEnabled(id, enabled));
  }
  isPlaceholderEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isPlaceholderEnabled(id));
  }
  hasPlaceholderBehavior(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasPlaceholderBehavior(id));
  }
  supportsPlaceholderBehavior(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsPlaceholderBehavior(id));
  }
  setPlaceholderBehaviorEnabled(id, enabled) {
    assert2("id", id, integer());
    unpackResult(__privateGet(this, _ubq).setPlaceholderBehaviorEnabled(id, enabled));
  }
  isPlaceholderBehaviorEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isPlaceholderBehaviorEnabled(id));
  }
  hasPlaceholderControls(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasPlaceholderControls(id));
  }
  supportsPlaceholderControls(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsPlaceholderControls(id));
  }
  setPlaceholderControlsOverlayEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(
      __privateGet(this, _ubq).setPlaceholderControlsOverlayEnabled(id, enabled)
    );
  }
  isPlaceholderControlsOverlayEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isPlaceholderControlsOverlayEnabled(id));
  }
  setPlaceholderControlsButtonEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(
      __privateGet(this, _ubq).setPlaceholderControlsButtonEnabled(id, enabled)
    );
  }
  isPlaceholderControlsButtonEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isPlaceholderControlsButtonEnabled(id));
  }
  setMetadata(id, key, value) {
    assert2("id", id, integer());
    assert2("key", key, string());
    assert2("value", value, string());
    unpackResult(__privateGet(this, _ubq).setMetadata(id, key, value));
  }
  getMetadata(id, key) {
    assert2("id", id, integer());
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq).getMetadata(id, key));
  }
  hasMetadata(id, key) {
    assert2("id", id, integer());
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq).hasMetadata(id, key));
  }
  findAllMetadata(id) {
    assert2("id", id, integer());
    return cppVectorToArray_default(unpackResult(__privateGet(this, _ubq).findAllMetadata(id)));
  }
  removeMetadata(id, key) {
    assert2("id", id, integer());
    assert2("key", key, string());
    unpackResult(__privateGet(this, _ubq).removeMetadata(id, key));
  }
  setScopeEnabled(id, key, enabled) {
    assert2("id", id, integer());
    assert2("key", key, string());
    assert2("enabled", enabled, boolean());
    unpackResult(__privateGet(this, _ubq).setScopeEnabled(id, key, enabled));
  }
  isScopeEnabled(id, key) {
    assert2("id", id, integer());
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq).isScopeEnabled(id, key));
  }
  isAllowedByScope(id, key) {
    assert2("id", id, integer());
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq).isAllowedByScope(id, key));
  }
  hasDuration(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasDuration(id));
  }
  supportsDuration(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsDuration(id));
  }
  setDuration(id, duration) {
    assert2("id", id, integer());
    assert2("duration", duration, number());
    return unpackResult(__privateGet(this, _ubq).setDuration(id, duration));
  }
  getDuration(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getDuration(id));
  }
  hasTimeOffset(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasTimeOffset(id));
  }
  supportsTimeOffset(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsTimeOffset(id));
  }
  setTimeOffset(id, offset) {
    assert2("id", id, integer());
    assert2("offset", offset, number());
    return unpackResult(__privateGet(this, _ubq).setTimeOffset(id, offset));
  }
  getTimeOffset(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getTimeOffset(id));
  }
  hasTrim(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasTrim(id));
  }
  supportsTrim(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsTrim(id));
  }
  setTrimOffset(id, offset) {
    assert2("id", id, integer());
    assert2("offset", offset, number());
    return unpackResult(__privateGet(this, _ubq).setTrimOffset(id, offset));
  }
  getTrimOffset(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getTrimOffset(id));
  }
  setTrimLength(id, length) {
    assert2("id", id, integer());
    assert2("length", length, number());
    return unpackResult(__privateGet(this, _ubq).setTrimLength(id, length));
  }
  getTrimLength(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getTrimLength(id));
  }
  getTotalSceneDuration(scene) {
    assert2("scene", scene, integer());
    return unpackResult(__privateGet(this, _ubq).getTotalSceneDuration(scene));
  }
  setPlaying(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setPlaying(id, enabled));
  }
  isPlaying(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isPlaying(id));
  }
  hasPlaybackTime(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasPlaybackTime(id));
  }
  supportsPlaybackTime(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsPlaybackTime(id));
  }
  setPlaybackTime(id, time) {
    assert2("id", id, integer());
    assert2("time", time, number());
    return unpackResult(__privateGet(this, _ubq).setPlaybackTime(id, time));
  }
  getPlaybackTime(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getPlaybackTime(id));
  }
  isVisibleAtCurrentPlaybackTime(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isVisibleAtCurrentPlaybackTime(id));
  }
  setSoloPlaybackEnabled(id, enabled) {
    assert2("id", id, integer());
    assert2("enabled", enabled, boolean());
    return unpackResult(__privateGet(this, _ubq).setSoloPlaybackEnabled(id, enabled));
  }
  isSoloPlaybackEnabled(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isSoloPlaybackEnabled(id));
  }
  hasPlaybackControl(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).hasPlaybackControl(id));
  }
  supportsPlaybackControl(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsPlaybackControl(id));
  }
  setLooping(id, looping) {
    assert2("id", id, integer());
    assert2("looping", looping, boolean());
    unpackResult(__privateGet(this, _ubq).setLooping(id, looping));
  }
  isLooping(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isLooping(id));
  }
  setMuted(id, muted) {
    assert2("id", id, integer());
    assert2("muted", muted, boolean());
    unpackResult(__privateGet(this, _ubq).setMuted(id, muted));
  }
  isMuted(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).isMuted(id));
  }
  setVolume(id, volume) {
    assert2("id", id, integer());
    assert2("volume", volume, number());
    unpackResult(__privateGet(this, _ubq).setVolume(id, volume));
  }
  getVolume(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getVolume(id));
  }
  async forceLoadAVResource(id) {
    assert2("id", id, integer());
    return unpackAsync((cb) => __privateGet(this, _ubq).forceLoadAVResource(id, cb));
  }
  unstable_isAVResourceLoaded(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).unstable_isAVResourceLoaded(id));
  }
  getAVResourceTotalDuration(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getAVResourceTotalDuration(id));
  }
  getVideoWidth(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getVideoWidth(id));
  }
  getVideoHeight(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getVideoHeight(id));
  }
  /**
   * Generate a sequence of thumbnails for the given video fill or design block.
   * Note: there can only be one thumbnail generation request in progress for a given block.
   * @param id - The video fill or design block.
   * @param thumbnailHeight - The height of a thumbnail. The width will be calculated from the video aspect ratio.
   * @param timeBegin - The time in seconds relative to the time offset of the design block at which the thumbnail sequence should start.
   * @param timeEnd - The time in seconds relative to the time offset of the design block  at which the thumbnail sequence should end.
   * @param numberOfFrames - The number of frames to generate.
   * @param onFrame - Gets passed the frame index and RGBA image data.
   * @returns A method that will cancel any thumbnail generation request in progress for this block.
   */
  generateVideoThumbnailSequence(id, thumbnailHeight, timeBegin, timeEnd, numberOfFrames, onFrame) {
    assert2("id", id, integer());
    assert2("thumbnailHeight", thumbnailHeight, integer());
    assert2("timeBegin", timeBegin, number());
    assert2("timeEnd", timeEnd, number());
    assert2("numberOfFrames", numberOfFrames, integer());
    const handle = __privateGet(this, _ubq).generateVideoThumbnailSequence(
      id,
      thumbnailHeight,
      timeBegin,
      timeEnd,
      numberOfFrames,
      (result) => {
        if ("error" in result) {
          onFrame(0, new Error(result.error));
        } else {
          onFrame(
            result.frameIndex,
            new ImageData(
              new Uint8ClampedArray(result.imageData),
              result.width,
              result.height
            )
          );
        }
      }
    );
    return () => {
      __privateGet(this, _ubq).cancelVideoThumbnailSequenceGeneration(handle);
    };
  }
  /**
   * Generate a thumbnail sequence for the given audio block or video fill.
   * A thumbnail in this case is a chunk of samples in the range of 0 to 1.
   * In case stereo data is requested, the samples are interleaved, starting with the left channel.
   * @param id - The audio block or video fill.
   * @param samplesPerChunk - The number of samples per chunk. `onChunk` is called when this many samples are ready.
   * @param timeBegin - The time in seconds at which the thumbnail sequence should start.
   * @param timeEnd - The time in seconds at which the thumbnail sequence should end.
   * @param numberOfSamples - The total number of samples to generate.
   * @param numberOfChannels - The number of channels in the output. 1 for mono, 2 for stereo.
   * @param onChunk - This gets passed an index and a chunk of samples whenever it's ready, or an error.
   */
  generateAudioThumbnailSequence(id, samplesPerChunk, timeBegin, timeEnd, numberOfSamples, numberOfChannels, onChunk) {
    assert2("id", id, integer());
    assert2("samplesPerChunk", samplesPerChunk, integer());
    assert2("timeBegin", timeBegin, number());
    assert2("timeEnd", timeEnd, number());
    assert2("numberOfSamples", numberOfSamples, integer());
    assert2("numberOfChannels", numberOfChannels, integer());
    const handle = __privateGet(this, _ubq).generateAudioThumbnailSequence(
      id,
      samplesPerChunk,
      timeBegin,
      timeEnd,
      numberOfSamples,
      numberOfChannels,
      (result) => {
        if ("error" in result) {
          onChunk(0, new Error(result.error));
        } else {
          onChunk(result.chunkIndex, result.sampleData);
        }
      }
    );
    return () => {
      __privateGet(this, _ubq).cancelAudioThumbnailSequenceGeneration(handle);
    };
  }
  async getVideoFillThumbnail(id, thumbnailHeight) {
    assert2("id", id, integer());
    assert2("thumbnailHeight", thumbnailHeight, integer());
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).getVideoFillThumbnail(id, thumbnailHeight, (result) => {
        if ("error" in result) {
          reject(result.error);
        } else {
          resolve(new Blob_default([result], { type: "image/jpeg" }));
        }
      });
    });
  }
  async getVideoFillThumbnailAtlas(id, numberOfColumns, numberOfRows, thumbnailHeight) {
    assert2("id", id, integer());
    assert2("numberOfColumns", numberOfColumns, integer());
    assert2("numberOfRows", numberOfRows, integer());
    assert2("thumbnailHeight", thumbnailHeight, integer());
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).getVideoFillThumbnailAtlas(
        id,
        numberOfColumns,
        numberOfRows,
        thumbnailHeight,
        (result) => {
          if ("error" in result) {
            reject(result.error);
          } else {
            resolve(new Blob_default([result], { type: "image/jpeg" }));
          }
        }
      );
    });
  }
  async getPageThumbnailAtlas(id, numberOfColumns, numberOfRows, thumbnailHeight) {
    assert2("id", id, integer());
    assert2("numberOfColumns", numberOfColumns, integer());
    assert2("numberOfRows", numberOfRows, integer());
    return new Promise((resolve, reject) => {
      __privateGet(this, _ubq).getPageThumbnailAtlas(
        id,
        numberOfColumns,
        numberOfRows,
        thumbnailHeight,
        (result) => {
          if ("error" in result) {
            reject(result.error);
          } else {
            resolve(new Blob_default([result], { type: "image/jpeg" }));
          }
        }
      );
    });
  }
  createAnimation(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq).createAnimation(type2));
  }
  supportsAnimation(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).supportsAnimation(id));
  }
  setInAnimation(id, animation) {
    assert2("id", id, integer());
    assert2("animation", animation, integer());
    unpackResult(__privateGet(this, _ubq).setInAnimation(id, animation));
  }
  setLoopAnimation(id, animation) {
    assert2("id", id, integer());
    assert2("animation", animation, integer());
    unpackResult(__privateGet(this, _ubq).setLoopAnimation(id, animation));
  }
  setOutAnimation(id, animation) {
    assert2("id", id, integer());
    assert2("animation", animation, integer());
    unpackResult(__privateGet(this, _ubq).setOutAnimation(id, animation));
  }
  getInAnimation(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getInAnimation(id));
  }
  getLoopAnimation(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getLoopAnimation(id));
  }
  getOutAnimation(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getOutAnimation(id));
  }
  setNativePixelBuffer(id, buffer) {
    assert2("id", id, integer());
    if (buffer instanceof HTMLVideoElement) {
      buffer.width = buffer.videoWidth;
      buffer.height = buffer.videoHeight;
    }
    unpackResult(__privateGet(this, _ubq).setNativePixelBuffer(id, buffer));
  }
  getState(id) {
    assert2("id", id, integer());
    return unpackResult(__privateGet(this, _ubq).getState(id));
  }
  setState(id, state) {
    assert2("id", id, integer());
    unpackResult(__privateGet(this, _ubq).setState(id, state));
  }
  async forceLoadResources(ids) {
    assert2("ids", ids, array(integer()));
    return unpackAsync((cb) => __privateGet(this, _ubq).forceLoadResources(ids, cb));
  }
};
_init = __decoratorStart(null);
_ubq = new WeakMap();
__decorateElement(_init, 1, "loadFromString", _loadFromString_dec, BlockAPI);
__decorateElement(_init, 1, "loadFromArchiveURL", _loadFromArchiveURL_dec, BlockAPI);
__decorateElement(_init, 1, "create", _create_dec, BlockAPI);
__decorateElement(_init, 1, "createFill", _createFill_dec, BlockAPI);
__decorateElement(_init, 1, "getType", _getType_dec, BlockAPI);
__decorateElement(_init, 1, "getKind", _getKind_dec, BlockAPI);
__decorateElement(_init, 1, "setKind", _setKind_dec, BlockAPI);
__decorateElement(_init, 1, "select", _select_dec, BlockAPI);
__decorateElement(_init, 1, "setSelected", _setSelected_dec, BlockAPI);
__decorateElement(_init, 1, "isSelected", _isSelected_dec, BlockAPI);
__decorateElement(_init, 1, "findAllSelected", _findAllSelected_dec, BlockAPI);
__decorateElement(_init, 1, "isGroupable", _isGroupable_dec, BlockAPI);
__decorateElement(_init, 1, "group", _group_dec, BlockAPI);
__decorateElement(_init, 1, "ungroup", _ungroup_dec, BlockAPI);
__decorateElement(_init, 1, "enterGroup", _enterGroup_dec, BlockAPI);
__decorateElement(_init, 1, "exitGroup", _exitGroup_dec, BlockAPI);
__decorateElement(_init, 1, "isCombinable", _isCombinable_dec, BlockAPI);
__decorateElement(_init, 1, "combine", _combine_dec, BlockAPI);
__decorateElement(_init, 1, "setName", _setName_dec, BlockAPI);
__decorateElement(_init, 1, "getName", _getName_dec, BlockAPI);
__decorateElement(_init, 1, "getUUID", _getUUID_dec, BlockAPI);
__decorateElement(_init, 1, "findByName", _findByName_dec, BlockAPI);
__decorateElement(_init, 1, "findByType", _findByType_dec, BlockAPI);
__decorateElement(_init, 1, "findByKind", _findByKind_dec, BlockAPI);
__decorateElement(_init, 1, "findAll", _findAll_dec, BlockAPI);
__decorateElement(_init, 1, "findAllPlaceholders", _findAllPlaceholders_dec, BlockAPI);
__decorateElement(_init, 1, "createShape", _createShape_dec, BlockAPI);
__decorateElement(_init, 1, "hasShape", _hasShape_dec, BlockAPI);
__decorateElement(_init, 1, "supportsShape", _supportsShape_dec, BlockAPI);
__decorateElement(_init, 1, "getShape", _getShape_dec, BlockAPI);
__decorateElement(_init, 1, "setShape", _setShape_dec, BlockAPI);
__decorateElement(_init, 1, "isVisible", _isVisible_dec, BlockAPI);
__decorateElement(_init, 1, "setVisible", _setVisible_dec, BlockAPI);
__decorateElement(_init, 1, "isClipped", _isClipped_dec, BlockAPI);
__decorateElement(_init, 1, "setClipped", _setClipped_dec, BlockAPI);
__decorateElement(_init, 1, "isTransformLocked", _isTransformLocked_dec, BlockAPI);
__decorateElement(_init, 1, "setTransformLocked", _setTransformLocked_dec, BlockAPI);
__decorateElement(_init, 1, "getPositionX", _getPositionX_dec, BlockAPI);
__decorateElement(_init, 1, "getPositionXMode", _getPositionXMode_dec, BlockAPI);
__decorateElement(_init, 1, "getPositionY", _getPositionY_dec, BlockAPI);
__decorateElement(_init, 1, "getPositionYMode", _getPositionYMode_dec, BlockAPI);
__decorateElement(_init, 1, "setPositionX", _setPositionX_dec, BlockAPI);
__decorateElement(_init, 1, "setPositionXMode", _setPositionXMode_dec, BlockAPI);
__decorateElement(_init, 1, "setPositionY", _setPositionY_dec, BlockAPI);
__decorateElement(_init, 1, "setPositionYMode", _setPositionYMode_dec, BlockAPI);
__decorateElement(_init, 1, "setAlwaysOnTop", _setAlwaysOnTop_dec, BlockAPI);
__decorateElement(_init, 1, "setAlwaysOnBottom", _setAlwaysOnBottom_dec, BlockAPI);
__decorateElement(_init, 1, "isAlwaysOnTop", _isAlwaysOnTop_dec, BlockAPI);
__decorateElement(_init, 1, "isAlwaysOnBottom", _isAlwaysOnBottom_dec, BlockAPI);
__decorateElement(_init, 1, "bringToFront", _bringToFront_dec, BlockAPI);
__decorateElement(_init, 1, "sendToBack", _sendToBack_dec, BlockAPI);
__decorateElement(_init, 1, "bringForward", _bringForward_dec, BlockAPI);
__decorateElement(_init, 1, "sendBackward", _sendBackward_dec, BlockAPI);
__decorateElement(_init, 1, "getRotation", _getRotation_dec, BlockAPI);
__decorateElement(_init, 1, "setRotation", _setRotation_dec, BlockAPI);
__decorateElement(_init, 1, "getFlipHorizontal", _getFlipHorizontal_dec, BlockAPI);
__decorateElement(_init, 1, "getFlipVertical", _getFlipVertical_dec, BlockAPI);
__decorateElement(_init, 1, "setFlipHorizontal", _setFlipHorizontal_dec, BlockAPI);
__decorateElement(_init, 1, "setFlipVertical", _setFlipVertical_dec, BlockAPI);
__decorateElement(_init, 1, "hasContentFillMode", _hasContentFillMode_dec, BlockAPI);
__decorateElement(_init, 1, "supportsContentFillMode", _supportsContentFillMode_dec, BlockAPI);
__decorateElement(_init, 1, "getWidth", _getWidth_dec, BlockAPI);
__decorateElement(_init, 1, "getWidthMode", _getWidthMode_dec, BlockAPI);
__decorateElement(_init, 1, "getHeight", _getHeight_dec, BlockAPI);
__decorateElement(_init, 1, "getHeightMode", _getHeightMode_dec, BlockAPI);
__decorateElement(_init, 1, "setWidth", _setWidth_dec, BlockAPI);
__decorateElement(_init, 1, "setWidthMode", _setWidthMode_dec, BlockAPI);
__decorateElement(_init, 1, "setHeight", _setHeight_dec, BlockAPI);
__decorateElement(_init, 1, "setHeightMode", _setHeightMode_dec, BlockAPI);
__decorateElement(_init, 1, "getFrameX", _getFrameX_dec, BlockAPI);
__decorateElement(_init, 1, "getFrameY", _getFrameY_dec, BlockAPI);
__decorateElement(_init, 1, "getFrameWidth", _getFrameWidth_dec, BlockAPI);
__decorateElement(_init, 1, "getFrameHeight", _getFrameHeight_dec, BlockAPI);
__decorateElement(_init, 1, "setContentFillMode", _setContentFillMode_dec, BlockAPI);
__decorateElement(_init, 1, "getContentFillMode", _getContentFillMode_dec, BlockAPI);
__decorateElement(_init, 1, "duplicate", _duplicate_dec, BlockAPI);
__decorateElement(_init, 1, "destroy", _destroy_dec, BlockAPI);
__decorateElement(_init, 1, "isValid", _isValid_dec, BlockAPI);
__decorateElement(_init, 1, "getParent", _getParent_dec, BlockAPI);
__decorateElement(_init, 1, "getChildren", _getChildren_dec, BlockAPI);
__decorateElement(_init, 1, "insertChild", _insertChild_dec, BlockAPI);
__decorateElement(_init, 1, "appendChild", _appendChild_dec, BlockAPI);
__decorateElement(_init, 1, "referencesAnyVariables", _referencesAnyVariables_dec, BlockAPI);
__decorateElement(_init, 1, "getGlobalBoundingBoxX", _getGlobalBoundingBoxX_dec, BlockAPI);
__decorateElement(_init, 1, "getGlobalBoundingBoxY", _getGlobalBoundingBoxY_dec, BlockAPI);
__decorateElement(_init, 1, "getGlobalBoundingBoxWidth", _getGlobalBoundingBoxWidth_dec, BlockAPI);
__decorateElement(_init, 1, "getGlobalBoundingBoxHeight", _getGlobalBoundingBoxHeight_dec, BlockAPI);
__decorateElement(_init, 1, "getScreenSpaceBoundingBoxXYWH", _getScreenSpaceBoundingBoxXYWH_dec, BlockAPI);
__decorateElement(_init, 1, "alignHorizontally", _alignHorizontally_dec, BlockAPI);
__decorateElement(_init, 1, "alignVertically", _alignVertically_dec, BlockAPI);
__decorateElement(_init, 1, "isAlignable", _isAlignable_dec, BlockAPI);
__decorateElement(_init, 1, "distributeHorizontally", _distributeHorizontally_dec, BlockAPI);
__decorateElement(_init, 1, "distributeVertically", _distributeVertically_dec, BlockAPI);
__decorateElement(_init, 1, "isDistributable", _isDistributable_dec, BlockAPI);
__decorateElement(_init, 1, "fillParent", _fillParent_dec, BlockAPI);
__decorateElement(_init, 1, "resizeContentAware", _resizeContentAware_dec, BlockAPI);
__decorateElement(_init, 1, "scale", _scale_dec, BlockAPI);
__decorateElement(_init, 1, "findAllProperties", _findAllProperties_dec, BlockAPI);
__decorateElement(_init, 1, "isPropertyReadable", _isPropertyReadable_dec, BlockAPI);
__decorateElement(_init, 1, "isPropertyWritable", _isPropertyWritable_dec, BlockAPI);
__decorateElement(_init, 1, "getPropertyType", _getPropertyType_dec, BlockAPI);
__decorateElement(_init, 1, "getEnumValues", _getEnumValues_dec, BlockAPI);
__decorateElement(_init, 1, "setBool", _setBool_dec, BlockAPI);
__decorateElement(_init, 1, "getBool", _getBool_dec, BlockAPI);
__decorateElement(_init, 1, "setInt", _setInt_dec, BlockAPI);
__decorateElement(_init, 1, "getInt", _getInt_dec, BlockAPI);
__decorateElement(_init, 1, "setFloat", _setFloat_dec, BlockAPI);
__decorateElement(_init, 1, "getFloat", _getFloat_dec, BlockAPI);
__decorateElement(_init, 1, "setDouble", _setDouble_dec, BlockAPI);
__decorateElement(_init, 1, "getDouble", _getDouble_dec, BlockAPI);
__decorateElement(_init, 1, "setString", _setString_dec, BlockAPI);
__decorateElement(_init, 1, "getString", _getString_dec, BlockAPI);
__decorateElement(_init, 1, "setColor", _setColor_dec, BlockAPI);
__decorateElement(_init, 1, "getColor", _getColor_dec, BlockAPI);
__decorateElement(_init, 1, "setColorRGBA", _setColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "getColorRGBA", _getColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "setColorSpot", _setColorSpot_dec, BlockAPI);
__decorateElement(_init, 1, "getColorSpotName", _getColorSpotName_dec, BlockAPI);
__decorateElement(_init, 1, "getColorSpotTint", _getColorSpotTint_dec, BlockAPI);
__decorateElement(_init, 1, "setGradientColorStops", _setGradientColorStops_dec, BlockAPI);
__decorateElement(_init, 1, "getGradientColorStops", _getGradientColorStops_dec, BlockAPI);
__decorateElement(_init, 1, "getSourceSet", _getSourceSet_dec, BlockAPI);
__decorateElement(_init, 1, "setSourceSet", _setSourceSet_dec, BlockAPI);
__decorateElement(_init, 1, "addImageFileURIToSourceSet", _addImageFileURIToSourceSet_dec, BlockAPI);
__decorateElement(_init, 1, "addVideoFileURIToSourceSet", _addVideoFileURIToSourceSet_dec, BlockAPI);
__decorateElement(_init, 1, "setEnum", _setEnum_dec, BlockAPI);
__decorateElement(_init, 1, "getEnum", _getEnum_dec, BlockAPI);
__decorateElement(_init, 1, "hasCrop", _hasCrop_dec, BlockAPI);
__decorateElement(_init, 1, "supportsCrop", _supportsCrop_dec, BlockAPI);
__decorateElement(_init, 1, "setCropScaleX", _setCropScaleX_dec, BlockAPI);
__decorateElement(_init, 1, "setCropScaleY", _setCropScaleY_dec, BlockAPI);
__decorateElement(_init, 1, "setCropRotation", _setCropRotation_dec, BlockAPI);
__decorateElement(_init, 1, "setCropScaleRatio", _setCropScaleRatio_dec, BlockAPI);
__decorateElement(_init, 1, "setCropTranslationX", _setCropTranslationX_dec, BlockAPI);
__decorateElement(_init, 1, "setCropTranslationY", _setCropTranslationY_dec, BlockAPI);
__decorateElement(_init, 1, "resetCrop", _resetCrop_dec, BlockAPI);
__decorateElement(_init, 1, "getCropScaleX", _getCropScaleX_dec, BlockAPI);
__decorateElement(_init, 1, "getCropScaleY", _getCropScaleY_dec, BlockAPI);
__decorateElement(_init, 1, "getCropRotation", _getCropRotation_dec, BlockAPI);
__decorateElement(_init, 1, "getCropScaleRatio", _getCropScaleRatio_dec, BlockAPI);
__decorateElement(_init, 1, "getCropTranslationX", _getCropTranslationX_dec, BlockAPI);
__decorateElement(_init, 1, "getCropTranslationY", _getCropTranslationY_dec, BlockAPI);
__decorateElement(_init, 1, "adjustCropToFillFrame", _adjustCropToFillFrame_dec, BlockAPI);
__decorateElement(_init, 1, "flipCropHorizontal", _flipCropHorizontal_dec, BlockAPI);
__decorateElement(_init, 1, "flipCropVertical", _flipCropVertical_dec, BlockAPI);
__decorateElement(_init, 1, "hasOpacity", _hasOpacity_dec, BlockAPI);
__decorateElement(_init, 1, "supportsOpacity", _supportsOpacity_dec, BlockAPI);
__decorateElement(_init, 1, "setOpacity", _setOpacity_dec, BlockAPI);
__decorateElement(_init, 1, "getOpacity", _getOpacity_dec, BlockAPI);
__decorateElement(_init, 1, "hasBlendMode", _hasBlendMode_dec, BlockAPI);
__decorateElement(_init, 1, "supportsBlendMode", _supportsBlendMode_dec, BlockAPI);
__decorateElement(_init, 1, "setBlendMode", _setBlendMode_dec, BlockAPI);
__decorateElement(_init, 1, "getBlendMode", _getBlendMode_dec, BlockAPI);
__decorateElement(_init, 1, "hasFillColor", _hasFillColor_dec, BlockAPI);
__decorateElement(_init, 1, "isIncludedInExport", _isIncludedInExport_dec, BlockAPI);
__decorateElement(_init, 1, "setIncludedInExport", _setIncludedInExport_dec, BlockAPI);
__decorateElement(_init, 1, "setFillColorRGBA", _setFillColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "getFillColorRGBA", _getFillColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "setFillColorEnabled", _setFillColorEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isFillColorEnabled", _isFillColorEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "createEffect", _createEffect_dec, BlockAPI);
__decorateElement(_init, 1, "hasEffects", _hasEffects_dec, BlockAPI);
__decorateElement(_init, 1, "supportsEffects", _supportsEffects_dec, BlockAPI);
__decorateElement(_init, 1, "getEffects", _getEffects_dec, BlockAPI);
__decorateElement(_init, 1, "insertEffect", _insertEffect_dec, BlockAPI);
__decorateElement(_init, 1, "appendEffect", _appendEffect_dec, BlockAPI);
__decorateElement(_init, 1, "removeEffect", _removeEffect_dec, BlockAPI);
__decorateElement(_init, 1, "hasEffectEnabled", _hasEffectEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "setEffectEnabled", _setEffectEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isEffectEnabled", _isEffectEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "createBlur", _createBlur_dec, BlockAPI);
__decorateElement(_init, 1, "hasBlur", _hasBlur_dec, BlockAPI);
__decorateElement(_init, 1, "supportsBlur", _supportsBlur_dec, BlockAPI);
__decorateElement(_init, 1, "setBlur", _setBlur_dec, BlockAPI);
__decorateElement(_init, 1, "getBlur", _getBlur_dec, BlockAPI);
__decorateElement(_init, 1, "setBlurEnabled", _setBlurEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isBlurEnabled", _isBlurEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "hasBackgroundColor", _hasBackgroundColor_dec, BlockAPI);
__decorateElement(_init, 1, "supportsBackgroundColor", _supportsBackgroundColor_dec, BlockAPI);
__decorateElement(_init, 1, "setBackgroundColorRGBA", _setBackgroundColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "getBackgroundColorRGBA", _getBackgroundColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "setBackgroundColorEnabled", _setBackgroundColorEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isBackgroundColorEnabled", _isBackgroundColorEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "hasStroke", _hasStroke_dec, BlockAPI);
__decorateElement(_init, 1, "supportsStroke", _supportsStroke_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokeEnabled", _setStrokeEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isStrokeEnabled", _isStrokeEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokeColorRGBA", _setStrokeColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokeColor", _setStrokeColor_dec, BlockAPI);
__decorateElement(_init, 1, "getStrokeColorRGBA", _getStrokeColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "getStrokeColor", _getStrokeColor_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokeWidth", _setStrokeWidth_dec, BlockAPI);
__decorateElement(_init, 1, "getStrokeWidth", _getStrokeWidth_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokeStyle", _setStrokeStyle_dec, BlockAPI);
__decorateElement(_init, 1, "getStrokeStyle", _getStrokeStyle_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokePosition", _setStrokePosition_dec, BlockAPI);
__decorateElement(_init, 1, "getStrokePosition", _getStrokePosition_dec, BlockAPI);
__decorateElement(_init, 1, "setStrokeCornerGeometry", _setStrokeCornerGeometry_dec, BlockAPI);
__decorateElement(_init, 1, "getStrokeCornerGeometry", _getStrokeCornerGeometry_dec, BlockAPI);
__decorateElement(_init, 1, "hasDropShadow", _hasDropShadow_dec, BlockAPI);
__decorateElement(_init, 1, "supportsDropShadow", _supportsDropShadow_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowEnabled", _setDropShadowEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isDropShadowEnabled", _isDropShadowEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowColorRGBA", _setDropShadowColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowColor", _setDropShadowColor_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowColorRGBA", _getDropShadowColorRGBA_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowColor", _getDropShadowColor_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowOffsetX", _setDropShadowOffsetX_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowOffsetX", _getDropShadowOffsetX_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowOffsetY", _setDropShadowOffsetY_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowOffsetY", _getDropShadowOffsetY_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowBlurRadiusX", _setDropShadowBlurRadiusX_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowBlurRadiusX", _getDropShadowBlurRadiusX_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowBlurRadiusY", _setDropShadowBlurRadiusY_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowBlurRadiusY", _getDropShadowBlurRadiusY_dec, BlockAPI);
__decorateElement(_init, 1, "setDropShadowClip", _setDropShadowClip_dec, BlockAPI);
__decorateElement(_init, 1, "getDropShadowClip", _getDropShadowClip_dec, BlockAPI);
__decorateElement(_init, 1, "createCutoutFromBlocks", _createCutoutFromBlocks_dec, BlockAPI);
__decorateElement(_init, 1, "createCutoutFromPath", _createCutoutFromPath_dec, BlockAPI);
__decorateElement(_init, 1, "createCutoutFromOperation", _createCutoutFromOperation_dec, BlockAPI);
__decorateElement(_init, 1, "replaceText", _replaceText_dec, BlockAPI);
__decorateElement(_init, 1, "removeText", _removeText_dec, BlockAPI);
__decorateElement(_init, 1, "setTextColor", _setTextColor_dec, BlockAPI);
__decorateElement(_init, 1, "getTextColors", _getTextColors_dec, BlockAPI);
__decorateElement(_init, 1, "setTextFontWeight", _setTextFontWeight_dec, BlockAPI);
__decorateElement(_init, 1, "getTextFontWeights", _getTextFontWeights_dec, BlockAPI);
__decorateElement(_init, 1, "setTextFontSize", _setTextFontSize_dec, BlockAPI);
__decorateElement(_init, 1, "getTextFontSizes", _getTextFontSizes_dec, BlockAPI);
__decorateElement(_init, 1, "setTextFontStyle", _setTextFontStyle_dec, BlockAPI);
__decorateElement(_init, 1, "getTextFontStyles", _getTextFontStyles_dec, BlockAPI);
__decorateElement(_init, 1, "getTextCases", _getTextCases_dec, BlockAPI);
__decorateElement(_init, 1, "setTextCase", _setTextCase_dec, BlockAPI);
__decorateElement(_init, 1, "canToggleBoldFont", _canToggleBoldFont_dec, BlockAPI);
__decorateElement(_init, 1, "canToggleItalicFont", _canToggleItalicFont_dec, BlockAPI);
__decorateElement(_init, 1, "toggleBoldFont", _toggleBoldFont_dec, BlockAPI);
__decorateElement(_init, 1, "toggleItalicFont", _toggleItalicFont_dec, BlockAPI);
__decorateElement(_init, 1, "setFont", _setFont_dec, BlockAPI);
__decorateElement(_init, 1, "setTypeface", _setTypeface_dec, BlockAPI);
__decorateElement(_init, 1, "getTypeface", _getTypeface_dec, BlockAPI);
__decorateElement(_init, 1, "getTextCursorRange", _getTextCursorRange_dec, BlockAPI);
__decorateElement(_init, 1, "hasFill", _hasFill_dec, BlockAPI);
__decorateElement(_init, 1, "supportsFill", _supportsFill_dec, BlockAPI);
__decorateElement(_init, 1, "isFillEnabled", _isFillEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "setFillEnabled", _setFillEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "getFill", _getFill_dec, BlockAPI);
__decorateElement(_init, 1, "setFill", _setFill_dec, BlockAPI);
__decorateElement(_init, 1, "setFillSolidColor", _setFillSolidColor_dec, BlockAPI);
__decorateElement(_init, 1, "getFillSolidColor", _getFillSolidColor_dec, BlockAPI);
__decorateElement(_init, 1, "setPlaceholderEnabled", _setPlaceholderEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isPlaceholderEnabled", _isPlaceholderEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "hasPlaceholderBehavior", _hasPlaceholderBehavior_dec, BlockAPI);
__decorateElement(_init, 1, "supportsPlaceholderBehavior", _supportsPlaceholderBehavior_dec, BlockAPI);
__decorateElement(_init, 1, "setPlaceholderBehaviorEnabled", _setPlaceholderBehaviorEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isPlaceholderBehaviorEnabled", _isPlaceholderBehaviorEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "hasPlaceholderControls", _hasPlaceholderControls_dec, BlockAPI);
__decorateElement(_init, 1, "supportsPlaceholderControls", _supportsPlaceholderControls_dec, BlockAPI);
__decorateElement(_init, 1, "setPlaceholderControlsOverlayEnabled", _setPlaceholderControlsOverlayEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isPlaceholderControlsOverlayEnabled", _isPlaceholderControlsOverlayEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "setPlaceholderControlsButtonEnabled", _setPlaceholderControlsButtonEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isPlaceholderControlsButtonEnabled", _isPlaceholderControlsButtonEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "setMetadata", _setMetadata_dec, BlockAPI);
__decorateElement(_init, 1, "getMetadata", _getMetadata_dec, BlockAPI);
__decorateElement(_init, 1, "hasMetadata", _hasMetadata_dec, BlockAPI);
__decorateElement(_init, 1, "findAllMetadata", _findAllMetadata_dec, BlockAPI);
__decorateElement(_init, 1, "removeMetadata", _removeMetadata_dec, BlockAPI);
__decorateElement(_init, 1, "setScopeEnabled", _setScopeEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isScopeEnabled", _isScopeEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isAllowedByScope", _isAllowedByScope_dec, BlockAPI);
__decorateElement(_init, 1, "hasDuration", _hasDuration_dec, BlockAPI);
__decorateElement(_init, 1, "supportsDuration", _supportsDuration_dec, BlockAPI);
__decorateElement(_init, 1, "setDuration", _setDuration_dec, BlockAPI);
__decorateElement(_init, 1, "getDuration", _getDuration_dec, BlockAPI);
__decorateElement(_init, 1, "hasTimeOffset", _hasTimeOffset_dec, BlockAPI);
__decorateElement(_init, 1, "supportsTimeOffset", _supportsTimeOffset_dec, BlockAPI);
__decorateElement(_init, 1, "setTimeOffset", _setTimeOffset_dec, BlockAPI);
__decorateElement(_init, 1, "getTimeOffset", _getTimeOffset_dec, BlockAPI);
__decorateElement(_init, 1, "hasTrim", _hasTrim_dec, BlockAPI);
__decorateElement(_init, 1, "supportsTrim", _supportsTrim_dec, BlockAPI);
__decorateElement(_init, 1, "setTrimOffset", _setTrimOffset_dec, BlockAPI);
__decorateElement(_init, 1, "getTrimOffset", _getTrimOffset_dec, BlockAPI);
__decorateElement(_init, 1, "setTrimLength", _setTrimLength_dec, BlockAPI);
__decorateElement(_init, 1, "getTrimLength", _getTrimLength_dec, BlockAPI);
__decorateElement(_init, 1, "getTotalSceneDuration", _getTotalSceneDuration_dec, BlockAPI);
__decorateElement(_init, 1, "setPlaying", _setPlaying_dec, BlockAPI);
__decorateElement(_init, 1, "isPlaying", _isPlaying_dec, BlockAPI);
__decorateElement(_init, 1, "hasPlaybackTime", _hasPlaybackTime_dec, BlockAPI);
__decorateElement(_init, 1, "supportsPlaybackTime", _supportsPlaybackTime_dec, BlockAPI);
__decorateElement(_init, 1, "setPlaybackTime", _setPlaybackTime_dec, BlockAPI);
__decorateElement(_init, 1, "getPlaybackTime", _getPlaybackTime_dec, BlockAPI);
__decorateElement(_init, 1, "isVisibleAtCurrentPlaybackTime", _isVisibleAtCurrentPlaybackTime_dec, BlockAPI);
__decorateElement(_init, 1, "setSoloPlaybackEnabled", _setSoloPlaybackEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "isSoloPlaybackEnabled", _isSoloPlaybackEnabled_dec, BlockAPI);
__decorateElement(_init, 1, "hasPlaybackControl", _hasPlaybackControl_dec, BlockAPI);
__decorateElement(_init, 1, "supportsPlaybackControl", _supportsPlaybackControl_dec, BlockAPI);
__decorateElement(_init, 1, "setLooping", _setLooping_dec, BlockAPI);
__decorateElement(_init, 1, "isLooping", _isLooping_dec, BlockAPI);
__decorateElement(_init, 1, "setMuted", _setMuted_dec, BlockAPI);
__decorateElement(_init, 1, "isMuted", _isMuted_dec, BlockAPI);
__decorateElement(_init, 1, "setVolume", _setVolume_dec, BlockAPI);
__decorateElement(_init, 1, "getVolume", _getVolume_dec, BlockAPI);
__decorateElement(_init, 1, "forceLoadAVResource", _forceLoadAVResource_dec, BlockAPI);
__decorateElement(_init, 1, "unstable_isAVResourceLoaded", _unstable_isAVResourceLoaded_dec, BlockAPI);
__decorateElement(_init, 1, "getAVResourceTotalDuration", _getAVResourceTotalDuration_dec, BlockAPI);
__decorateElement(_init, 1, "getVideoWidth", _getVideoWidth_dec, BlockAPI);
__decorateElement(_init, 1, "getVideoHeight", _getVideoHeight_dec, BlockAPI);
__decorateElement(_init, 1, "getVideoFillThumbnail", _getVideoFillThumbnail_dec, BlockAPI);
__decorateElement(_init, 1, "getVideoFillThumbnailAtlas", _getVideoFillThumbnailAtlas_dec, BlockAPI);
__decorateElement(_init, 1, "getPageThumbnailAtlas", _getPageThumbnailAtlas_dec, BlockAPI);
__decorateElement(_init, 1, "createAnimation", _createAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "supportsAnimation", _supportsAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "setInAnimation", _setInAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "setLoopAnimation", _setLoopAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "setOutAnimation", _setOutAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "getInAnimation", _getInAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "getLoopAnimation", _getLoopAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "getOutAnimation", _getOutAnimation_dec, BlockAPI);
__decorateElement(_init, 1, "setNativePixelBuffer", _setNativePixelBuffer_dec, BlockAPI);
__decorateElement(_init, 1, "getState", _getState_dec, BlockAPI);
__decorateElement(_init, 1, "setState", _setState_dec, BlockAPI);
__decorateElement(_init, 1, "forceLoadResources", _forceLoadResources_dec, BlockAPI);
__decoratorMetadata(_init, BlockAPI);

// ../../bindings/wasm/js_web/src/EditorAPI.ts
var _urlResolvers = /* @__PURE__ */ new WeakMap();
var _convertColorToColorSpace_dec, _getSpotColorForCutoutType_dec, _setSpotColorForCutoutType_dec, _removeSpotColor_dec, _setSpotColorCMYK_dec, _setSpotColorRGB_dec, _getSpotColorCMYK_dec, _getSpotColorRGBA_dec, _findAllSpotColors_dec, _getGlobalScope_dec, _setGlobalScope_dec, _findAllScopes_dec, _getAbsoluteURI_dec, _unstable_getURIResolver_dec, _setURIResolver_dec, _getMaxExportSize_dec, _getUsedMemory_dec, _getAvailableMemory_dec, _findAllSettings_dec, _getRole_dec, _setRole_dec, _getSettingEnum_dec, _setSettingEnum_dec, _getSettingColorRGBA_dec, _setSettingColorRGBA_dec, _getSettingColor_dec, _setSettingColor_dec, _getSettingString_dec, _setSettingString_dec, _getSettingFloat_dec, _setSettingFloat_dec, _getSettingInt_dec, _setSettingInt_dec, _getSettingBool_dec, _setSettingBool_dec, _canRedo_dec, _canUndo_dec, _redo_dec, _undo_dec, _addUndoStep_dec, _getActiveHistory_dec, _setActiveHistory_dec, _destroyHistory_dec, _createHistory_dec, _getTextCursorPositionInScreenSpaceY_dec, _getTextCursorPositionInScreenSpaceX_dec, _getCursorRotation_dec, _getCursorType_dec, _unstable_isInteractionHappening_dec, _getEditMode_dec, _setEditMode_dec, __update_dec, _getActiveLicense_dec, _getTrackingMetadata_dec, _setTrackingMetadata_dec, _startTracking_dec, _unlockWithLicense_dec, _ubq2, _init2;
_unlockWithLicense_dec = [setter], _startTracking_dec = [setter], _setTrackingMetadata_dec = [setter], _getTrackingMetadata_dec = [getter], _getActiveLicense_dec = [getter], __update_dec = [setter], _setEditMode_dec = [setter], _getEditMode_dec = [getter], _unstable_isInteractionHappening_dec = [getter], _getCursorType_dec = [getter], _getCursorRotation_dec = [getter], _getTextCursorPositionInScreenSpaceX_dec = [getter], _getTextCursorPositionInScreenSpaceY_dec = [getter], _createHistory_dec = [setter], _destroyHistory_dec = [setter], _setActiveHistory_dec = [setter], _getActiveHistory_dec = [getter], _addUndoStep_dec = [setter], _undo_dec = [setter], _redo_dec = [setter], _canUndo_dec = [getter], _canRedo_dec = [getter], _setSettingBool_dec = [setter], _getSettingBool_dec = [getter], _setSettingInt_dec = [setter], _getSettingInt_dec = [getter], _setSettingFloat_dec = [setter], _getSettingFloat_dec = [getter], _setSettingString_dec = [setter], _getSettingString_dec = [getter], _setSettingColor_dec = [setter], _getSettingColor_dec = [getter], _setSettingColorRGBA_dec = [setter], _getSettingColorRGBA_dec = [getter], _setSettingEnum_dec = [setter], _getSettingEnum_dec = [getter], _setRole_dec = [setter], _getRole_dec = [getter], _findAllSettings_dec = [getter], _getAvailableMemory_dec = [getter], _getUsedMemory_dec = [getter], _getMaxExportSize_dec = [getter], _setURIResolver_dec = [setter], _unstable_getURIResolver_dec = [getter], _getAbsoluteURI_dec = [getter], _findAllScopes_dec = [getter], _setGlobalScope_dec = [setter], _getGlobalScope_dec = [getter], _findAllSpotColors_dec = [getter], _getSpotColorRGBA_dec = [getter], _getSpotColorCMYK_dec = [getter], _setSpotColorRGB_dec = [setter], _setSpotColorCMYK_dec = [setter], _removeSpotColor_dec = [setter], _setSpotColorForCutoutType_dec = [setter], _getSpotColorForCutoutType_dec = [setter], _convertColorToColorSpace_dec = [getter];
var EditorAPI = class {
  /** @internal */
  constructor(ubq) {
    __runInitializers(_init2, 5, this);
    /** @internal */
    __privateAdd(this, _ubq2);
    /**
     * Subscribe to changes to the editor state.
     * @param callback - This function is called at the end of the engine update, if the editor state has changed.
     * @returns A method to unsubscribe.
     */
    __publicField(this, "onStateChanged", (callback) => {
      const subscription = __privateGet(this, _ubq2).subscribeToEditorState(callback);
      return () => {
        if (__privateGet(this, _ubq2).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq2).unsubscribe(subscription));
      };
    });
    /**
     * Subscribe to changes to the undo/redo history.
     *
     * @param callback - This function is called at the end of the engine update, if the undo/redo history has been changed.
     * @returns A method to unsubscribe
     */
    __publicField(this, "onHistoryUpdated", (callback) => {
      const subscription = __privateGet(this, _ubq2).subscribeToHistory(callback);
      return () => {
        if (__privateGet(this, _ubq2).isDeleted()) return;
        __privateGet(this, _ubq2).unsubscribe(subscription);
      };
    });
    /**
     * Subscribe to changes to the editor settings.
     * @param callback - This function is called at the end of the engine update, if the editor settings have changed.
     * @returns A method to unsubscribe.
     */
    __publicField(this, "onSettingsChanged", (callback) => {
      const subscription = __privateGet(this, _ubq2).subscribeToSettings(callback);
      return () => {
        if (__privateGet(this, _ubq2).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq2).unsubscribe(subscription));
      };
    });
    /**
     * Subscribe to changes to the editor role.
     *
     * This lets you react to changes in the role of the user and update engine
     * and editor settings in response.
     *
     * @param callback - This function will be called immediately after a role has
     * been set and the default settings for that role have been applied. This function
     * will also be called in case the role is set to the same value as before.
     * @returns A function for unsubscribing
     */
    __publicField(this, "onRoleChanged", (callback) => {
      const subscription = __privateGet(this, _ubq2).subscribeToRoleChange(callback);
      return () => {
        if (__privateGet(this, _ubq2).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq2).unsubscribe(subscription));
      };
    });
    __privateSet(this, _ubq2, ubq);
  }
  unlockWithLicense(license) {
    unpackResult(__privateGet(this, _ubq2).unlockWithLicense(license));
  }
  startTracking(license, userId) {
    __privateGet(this, _ubq2).startTracking(license, userId, "");
  }
  setTrackingMetadata(metadata) {
    __privateGet(this, _ubq2).setTrackingMetadata(metadata);
  }
  getTrackingMetadata() {
    return unpackResult(__privateGet(this, _ubq2).getTrackingMetadata());
  }
  getActiveLicense() {
    return unpackResult(__privateGet(this, _ubq2).getActiveLicense());
  }
  _update() {
    __privateGet(this, _ubq2).update();
  }
  setEditMode(mode) {
    assert2("keypath", mode, string());
    __privateGet(this, _ubq2).setEditMode(mode);
  }
  getEditMode() {
    return __privateGet(this, _ubq2).getEditMode();
  }
  unstable_isInteractionHappening() {
    return unpackResult(__privateGet(this, _ubq2).unstable_isInteractionHappening());
  }
  getCursorType() {
    return __privateGet(this, _ubq2).getCursorType();
  }
  getCursorRotation() {
    return __privateGet(this, _ubq2).getCursorRotation();
  }
  getTextCursorPositionInScreenSpaceX() {
    return __privateGet(this, _ubq2).getTextCursorPositionInScreenSpaceX();
  }
  getTextCursorPositionInScreenSpaceY() {
    return __privateGet(this, _ubq2).getTextCursorPositionInScreenSpaceY();
  }
  createHistory() {
    return __privateGet(this, _ubq2).createHistory();
  }
  destroyHistory(history) {
    unpackResult(__privateGet(this, _ubq2).destroyHistory(history));
  }
  setActiveHistory(history) {
    unpackResult(__privateGet(this, _ubq2).setActiveHistory(history));
  }
  getActiveHistory() {
    return __privateGet(this, _ubq2).getActiveHistory();
  }
  addUndoStep() {
    unpackResult(__privateGet(this, _ubq2).addUndoStep());
  }
  undo() {
    unpackResult(__privateGet(this, _ubq2).undo());
  }
  redo() {
    unpackResult(__privateGet(this, _ubq2).redo());
  }
  canUndo() {
    return unpackResult(__privateGet(this, _ubq2).canUndo());
  }
  canRedo() {
    return unpackResult(__privateGet(this, _ubq2).canRedo());
  }
  setSettingBool(keypath, value) {
    assert2("keypath", keypath, string());
    assert2("value", value, boolean());
    return unpackResult(__privateGet(this, _ubq2).setSettingBool(keypath, value));
  }
  getSettingBool(keypath) {
    assert2("keypath", keypath, string());
    return unpackResult(__privateGet(this, _ubq2).getSettingBool(keypath));
  }
  setSettingInt(keypath, value) {
    assert2("keypath", keypath, string());
    assert2("value", value, integer());
    return unpackResult(__privateGet(this, _ubq2).setSettingInt(keypath, value));
  }
  getSettingInt(keypath) {
    assert2("keypath", keypath, string());
    return unpackResult(__privateGet(this, _ubq2).getSettingInt(keypath));
  }
  setSettingFloat(keypath, value) {
    assert2("keypath", keypath, string());
    assert2("value", value, number());
    return unpackResult(__privateGet(this, _ubq2).setSettingFloat(keypath, value));
  }
  getSettingFloat(keypath) {
    assert2("keypath", keypath, string());
    return unpackResult(__privateGet(this, _ubq2).getSettingFloat(keypath));
  }
  setSettingString(keypath, value) {
    assert2("keypath", keypath, string());
    assert2("value", value, string());
    return unpackResult(__privateGet(this, _ubq2).setSettingString(keypath, value));
  }
  getSettingString(keypath) {
    assert2("keypath", keypath, string());
    return unpackResult(__privateGet(this, _ubq2).getSettingString(keypath));
  }
  setSettingColor(keypath, value) {
    assert2("keypath", keypath, string());
    return unpackResult(
      __privateGet(this, _ubq2).setSettingColor(keypath, ColorInternal.fromColor(value))
    );
  }
  getSettingColor(keypath) {
    assert2("keypath", keypath, string());
    return ColorInternal.toColor(
      unpackResult(__privateGet(this, _ubq2).getSettingColor(keypath))
    );
  }
  setSettingColorRGBA(keypath, r, g, b, a = 1) {
    assert2("keypath", keypath, string());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    assert2("a", a, number());
    return unpackResult(__privateGet(this, _ubq2).setSettingColorRGBA(keypath, r, g, b, a));
  }
  getSettingColorRGBA(keypath) {
    assert2("keypath", keypath, string());
    return unpackResult(__privateGet(this, _ubq2).getSettingColorRGBA(keypath));
  }
  setSettingEnum(keypath, value) {
    assert2("keypath", keypath, string());
    assert2("value", value, string());
    return unpackResult(__privateGet(this, _ubq2).setSettingEnum(keypath, value));
  }
  getSettingEnum(keypath) {
    assert2("keypath", keypath, string());
    return unpackResult(__privateGet(this, _ubq2).getSettingEnum(keypath));
  }
  getSettingEnumOptions(keypath) {
    assert2("keypath", keypath, string());
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq2).getSettingEnumOptions(keypath))
    );
  }
  setRole(role) {
    return unpackResult(__privateGet(this, _ubq2).setRole(role));
  }
  getRole() {
    return unpackResult(__privateGet(this, _ubq2).getRole());
  }
  findAllSettings() {
    return cppVectorToArray_default(__privateGet(this, _ubq2).findAllSettings());
  }
  /**
   * Returns the type of a setting.
   * @param keypath - The settings keypath, e.g. `doubleClickSelectionMode`.
   * @returns The setting type.
   */
  getSettingType(keypath) {
    assert2("keypath", keypath, string());
    const type2 = unpackResult(__privateGet(this, _ubq2).getSettingType(keypath));
    return type2;
  }
  getAvailableMemory() {
    return unpackResult(__privateGet(this, _ubq2).getAvailableMemory());
  }
  getUsedMemory() {
    return unpackResult(__privateGet(this, _ubq2).getUsedMemory());
  }
  getMaxExportSize() {
    return unpackResult(__privateGet(this, _ubq2).getMaxExportSize());
  }
  setURIResolver(resolver) {
    _urlResolvers.set(__privateGet(this, _ubq2), resolver);
    const resolverWithDefault = (uri) => resolver(uri, this.defaultURIResolver.bind(this));
    return unpackResult(__privateGet(this, _ubq2).setURIResolver(resolverWithDefault));
  }
  unstable_getURIResolver() {
    return _urlResolvers.get(__privateGet(this, _ubq2)) ?? null;
  }
  /**
   * This is the default implementation for the URI resolver.
   * It resolves the given path relative to the `basePath` setting.
   * @param relativePath - The relative path that should be resolved.
   * @returns The resolved absolute URI.
   */
  defaultURIResolver(relativePath) {
    return __privateGet(this, _ubq2).defaultURIResolver(relativePath);
  }
  getAbsoluteURI(relativePath) {
    return unpackResult(__privateGet(this, _ubq2).getAbsoluteURI(relativePath));
  }
  findAllScopes() {
    return cppVectorToArray_default(__privateGet(this, _ubq2).findAllScopes());
  }
  setGlobalScope(key, value) {
    assert2("key", key, string());
    assert2("value", value, string());
    unpackResult(__privateGet(this, _ubq2).setGlobalScope(key, value));
  }
  getGlobalScope(key) {
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq2).getGlobalScope(key));
  }
  findAllSpotColors() {
    return cppVectorToArray_default(__privateGet(this, _ubq2).findAllSpotColors());
  }
  getSpotColorRGBA(name) {
    assert2("name", name, string());
    return __privateGet(this, _ubq2).getSpotColorRGB(name);
  }
  getSpotColorCMYK(name) {
    assert2("name", name, string());
    return __privateGet(this, _ubq2).getSpotColorCMYK(name);
  }
  setSpotColorRGB(name, r, g, b) {
    assert2("name", name, string());
    assert2("r", r, number());
    assert2("g", g, number());
    assert2("b", b, number());
    return __privateGet(this, _ubq2).setSpotColorRGB(name, r, g, b);
  }
  setSpotColorCMYK(name, c, m, y, k) {
    assert2("name", name, string());
    assert2("c", c, number());
    assert2("m", m, number());
    assert2("y", y, number());
    assert2("k", k, number());
    return __privateGet(this, _ubq2).setSpotColorCMYK(name, c, m, y, k);
  }
  removeSpotColor(name) {
    assert2("name", name, string());
    return unpackResult(__privateGet(this, _ubq2).removeSpotColor(name));
  }
  setSpotColorForCutoutType(type2, color) {
    assert2("type", type2, string());
    assert2("color", color, string());
    return unpackResult(__privateGet(this, _ubq2).setSpotColorForCutoutType(type2, color));
  }
  getSpotColorForCutoutType(type2) {
    assert2("type", type2, string());
    return unpackResult(__privateGet(this, _ubq2).getSpotColorForCutoutType(type2));
  }
  convertColorToColorSpace(color, colorSpace) {
    assert2("colorSpace", colorSpace, string());
    return ColorInternal.toColor(
      unpackResult(
        __privateGet(this, _ubq2).convertColorToColorSpace(
          ColorInternal.fromColor(color),
          colorSpace
        )
      )
    );
  }
  /**
   * Create a resizable buffer that can hold arbitrary data.
   * @returns A URI to identify the buffer.
   */
  createBuffer() {
    return __privateGet(this, _ubq2).createBuffer();
  }
  /**
   * Destroy a buffer and free its resources.
   * @param uri - The URI of the buffer to destroy.
   */
  destroyBuffer(uri) {
    unpackResult(__privateGet(this, _ubq2).destroyBuffer(uri));
  }
  /**
   * Set the data of a buffer at a given offset.
   * @param uri - The URI of the buffer to update.
   * @param offset - The offset in bytes at which to start writing.
   * @param data - The data to write.
   */
  setBufferData(uri, offset, data) {
    assert2("offset", offset, integer());
    unpackResult(__privateGet(this, _ubq2).setBufferData(uri, offset, data));
  }
  /**
   * Get the data of a buffer at a given offset.
   * @param uri - The URI of the buffer to query.
   * @param offset - The offset in bytes at which to start reading.
   * @param length - The number of bytes to read.
   * @returns The data at the given offset.
   */
  getBufferData(uri, offset, length) {
    assert2("offset", offset, integer());
    assert2("length", length, integer());
    const result = __privateGet(this, _ubq2).getBufferData(uri, offset, length);
    if ("error" in result) {
      throw new Error(result.error);
    }
    return result;
  }
  /**
   * Set the length of a buffer.
   * @param uri - The URI of the buffer to update.
   * @param length - The new length of the buffer in bytes.
   */
  setBufferLength(uri, length) {
    assert2("length", length, integer());
    unpackResult(__privateGet(this, _ubq2).setBufferLength(uri, length));
  }
  /**
   * Get the length of a buffer.
   * @param uri - The URI of the buffer to query.
   * @returns The length of the buffer in bytes.
   */
  getBufferLength(uri) {
    return unpackResult(__privateGet(this, _ubq2).getBufferLength(uri));
  }
  /** @internal */
  cloneBuffers() {
    return cppVectorToArray_default(unpackResult(__privateGet(this, _ubq2).cloneBuffers()));
  }
  /** @internal */
  restoreBuffers(buffers) {
    unpackResult(__privateGet(this, _ubq2).restoreBuffers(buffers));
  }
  /**
   * Returns the mimetype of the resources at the given URI.
   * If the resource is not already downloaded, this function will download it.
   * @param uri - The URI of the resource.
   * @returns The mimetype of the resource.
   * @throws An error if the resource could not be downloaded or the mimetype could not be determined.
   */
  getMimeType(uri) {
    assert2("uri", uri, string());
    return unpackAsync((cb) => __privateGet(this, _ubq2).getMimeType(uri, cb));
  }
  /**
   * Returns the URLs and sizes of all resources whose data would be lost if the scene was exported.
   * This function is useful for determining which resources need to be relocated (e.g., to a CDN) before
   * exporting a scene since the resources are not included in the exported scene.
   * @returns The URLs and sizes of transient resources.
   */
  findAllTransientResources() {
    return cppVectorToArray_default(
      unpackResult(__privateGet(this, _ubq2).findAllTransientResources())
    );
  }
  /**
   * Provides the data of a resource at the given URL.
   * @param url - The URL of the resource.
   * @param chunkSize - The size of the chunks in which the resource data is provided.
   * @param onData - The callback function that is called with the resource data or an error if an error occurred.
   * The callback will be called as long as there is data left to provide and the callback returns `true`.
   */
  getResourceData(uri, chunkSize, onData) {
    assert2("uri", uri, string());
    assert2("chunkSize", chunkSize, integer());
    unpackResult(__privateGet(this, _ubq2).getResourceData(uri, chunkSize, onData));
  }
  /**
   * Changes the URL associated with a resource.
   * This function can be used change the URL of a resource that has been relocated (e.g., to a CDN).
   * @param currentURL - The current URL of the resource.
   * @param relocatedURL - The new URL of the resource.
   */
  relocateResource(currentUrl, relocatedUrl) {
    assert2("currentUrl", currentUrl, string());
    assert2("relocatedUrl", relocatedUrl, string());
    unpackResult(__privateGet(this, _ubq2).relocateResource(currentUrl, relocatedUrl));
  }
};
_init2 = __decoratorStart(null);
_ubq2 = new WeakMap();
__decorateElement(_init2, 1, "unlockWithLicense", _unlockWithLicense_dec, EditorAPI);
__decorateElement(_init2, 1, "startTracking", _startTracking_dec, EditorAPI);
__decorateElement(_init2, 1, "setTrackingMetadata", _setTrackingMetadata_dec, EditorAPI);
__decorateElement(_init2, 1, "getTrackingMetadata", _getTrackingMetadata_dec, EditorAPI);
__decorateElement(_init2, 1, "getActiveLicense", _getActiveLicense_dec, EditorAPI);
__decorateElement(_init2, 1, "_update", __update_dec, EditorAPI);
__decorateElement(_init2, 1, "setEditMode", _setEditMode_dec, EditorAPI);
__decorateElement(_init2, 1, "getEditMode", _getEditMode_dec, EditorAPI);
__decorateElement(_init2, 1, "unstable_isInteractionHappening", _unstable_isInteractionHappening_dec, EditorAPI);
__decorateElement(_init2, 1, "getCursorType", _getCursorType_dec, EditorAPI);
__decorateElement(_init2, 1, "getCursorRotation", _getCursorRotation_dec, EditorAPI);
__decorateElement(_init2, 1, "getTextCursorPositionInScreenSpaceX", _getTextCursorPositionInScreenSpaceX_dec, EditorAPI);
__decorateElement(_init2, 1, "getTextCursorPositionInScreenSpaceY", _getTextCursorPositionInScreenSpaceY_dec, EditorAPI);
__decorateElement(_init2, 1, "createHistory", _createHistory_dec, EditorAPI);
__decorateElement(_init2, 1, "destroyHistory", _destroyHistory_dec, EditorAPI);
__decorateElement(_init2, 1, "setActiveHistory", _setActiveHistory_dec, EditorAPI);
__decorateElement(_init2, 1, "getActiveHistory", _getActiveHistory_dec, EditorAPI);
__decorateElement(_init2, 1, "addUndoStep", _addUndoStep_dec, EditorAPI);
__decorateElement(_init2, 1, "undo", _undo_dec, EditorAPI);
__decorateElement(_init2, 1, "redo", _redo_dec, EditorAPI);
__decorateElement(_init2, 1, "canUndo", _canUndo_dec, EditorAPI);
__decorateElement(_init2, 1, "canRedo", _canRedo_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingBool", _setSettingBool_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingBool", _getSettingBool_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingInt", _setSettingInt_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingInt", _getSettingInt_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingFloat", _setSettingFloat_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingFloat", _getSettingFloat_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingString", _setSettingString_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingString", _getSettingString_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingColor", _setSettingColor_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingColor", _getSettingColor_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingColorRGBA", _setSettingColorRGBA_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingColorRGBA", _getSettingColorRGBA_dec, EditorAPI);
__decorateElement(_init2, 1, "setSettingEnum", _setSettingEnum_dec, EditorAPI);
__decorateElement(_init2, 1, "getSettingEnum", _getSettingEnum_dec, EditorAPI);
__decorateElement(_init2, 1, "setRole", _setRole_dec, EditorAPI);
__decorateElement(_init2, 1, "getRole", _getRole_dec, EditorAPI);
__decorateElement(_init2, 1, "findAllSettings", _findAllSettings_dec, EditorAPI);
__decorateElement(_init2, 1, "getAvailableMemory", _getAvailableMemory_dec, EditorAPI);
__decorateElement(_init2, 1, "getUsedMemory", _getUsedMemory_dec, EditorAPI);
__decorateElement(_init2, 1, "getMaxExportSize", _getMaxExportSize_dec, EditorAPI);
__decorateElement(_init2, 1, "setURIResolver", _setURIResolver_dec, EditorAPI);
__decorateElement(_init2, 1, "unstable_getURIResolver", _unstable_getURIResolver_dec, EditorAPI);
__decorateElement(_init2, 1, "getAbsoluteURI", _getAbsoluteURI_dec, EditorAPI);
__decorateElement(_init2, 1, "findAllScopes", _findAllScopes_dec, EditorAPI);
__decorateElement(_init2, 1, "setGlobalScope", _setGlobalScope_dec, EditorAPI);
__decorateElement(_init2, 1, "getGlobalScope", _getGlobalScope_dec, EditorAPI);
__decorateElement(_init2, 1, "findAllSpotColors", _findAllSpotColors_dec, EditorAPI);
__decorateElement(_init2, 1, "getSpotColorRGBA", _getSpotColorRGBA_dec, EditorAPI);
__decorateElement(_init2, 1, "getSpotColorCMYK", _getSpotColorCMYK_dec, EditorAPI);
__decorateElement(_init2, 1, "setSpotColorRGB", _setSpotColorRGB_dec, EditorAPI);
__decorateElement(_init2, 1, "setSpotColorCMYK", _setSpotColorCMYK_dec, EditorAPI);
__decorateElement(_init2, 1, "removeSpotColor", _removeSpotColor_dec, EditorAPI);
__decorateElement(_init2, 1, "setSpotColorForCutoutType", _setSpotColorForCutoutType_dec, EditorAPI);
__decorateElement(_init2, 1, "getSpotColorForCutoutType", _getSpotColorForCutoutType_dec, EditorAPI);
__decorateElement(_init2, 1, "convertColorToColorSpace", _convertColorToColorSpace_dec, EditorAPI);
__decoratorMetadata(_init2, EditorAPI);

// ../../bindings/wasm/js_web/src/SceneAPI.ts
var _isZoomAutoFitEnabled_dec, _disableZoomAutoFit_dec, _enableZoomAutoFit_dec, _zoomToBlock_dec, _getZoomLevel_dec, _setZoomLevel_dec, _findNearestToViewPortCenterByKind_dec, _findNearestToViewPortCenterByType_dec, _getCurrentPage_dec, _getPages_dec, _getDesignUnit_dec, _setDesignUnit_dec, _getMode_dec, _applyTemplateFromURL_dec, _applyTemplateFromString_dec, _get_dec, _createFromVideo_dec, _createFromImage_dec, _createVideo_dec, _create_dec2, _loadFromArchiveURL_dec2, _loadFromURL_dec, _loadFromString_dec2, _ubq3, _init3;
_loadFromString_dec2 = [setter], _loadFromURL_dec = [setter], _loadFromArchiveURL_dec2 = [setter], _create_dec2 = [setter], _createVideo_dec = [setter], _createFromImage_dec = [setter], _createFromVideo_dec = [setter], _get_dec = [getter], _applyTemplateFromString_dec = [setter], _applyTemplateFromURL_dec = [setter], _getMode_dec = [getter], _setDesignUnit_dec = [setter], _getDesignUnit_dec = [getter], _getPages_dec = [getter], _getCurrentPage_dec = [getter], _findNearestToViewPortCenterByType_dec = [getter], _findNearestToViewPortCenterByKind_dec = [getter], _setZoomLevel_dec = [setter], _getZoomLevel_dec = [getter], _zoomToBlock_dec = [setter], _enableZoomAutoFit_dec = [setter], _disableZoomAutoFit_dec = [setter], _isZoomAutoFitEnabled_dec = [getter];
var SceneAPI = class {
  /** @internal */
  constructor(ubq) {
    __runInitializers(_init3, 5, this);
    /** @internal */
    __privateAdd(this, _ubq3);
    /**
     * Subscribe to changes to the zoom level.
     * @param callback - This function is called at the end of the engine update, if the zoom level has changed.
     * @returns A method to unsubscribe.
     * @privateRemarks This will currently fire on _all_ changes to camera properties
     */
    __publicField(this, "onZoomLevelChanged", (callback) => {
      const subscription = __privateGet(this, _ubq3).subscribeToZoomLevel(callback);
      return () => {
        if (__privateGet(this, _ubq3).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq3).unsubscribe(subscription));
      };
    });
    /**
     * Subscribe to changes to the active scene rendered by the engine.
     * @param callback - This function is called at the end of the engine update, if the active scene has changed.
     * @returns A method to unsubscribe.
     */
    __publicField(this, "onActiveChanged", (callback) => {
      const subscription = __privateGet(this, _ubq3).subscribeToActiveSceneChange(callback);
      return () => {
        if (__privateGet(this, _ubq3).isDeleted()) return;
        unpackResult(__privateGet(this, _ubq3).unsubscribe(subscription));
      };
    });
    __privateSet(this, _ubq3, ubq);
  }
  async loadFromString(sceneContent) {
    assert2("sceneContent", sceneContent, string());
    return unpackAsync((cb) => __privateGet(this, _ubq3).loadSceneFromString(sceneContent, cb));
  }
  async loadFromURL(url) {
    assert2("url", url, string());
    return unpackAsync((cb) => __privateGet(this, _ubq3).loadSceneFromURL(url, cb));
  }
  async loadFromArchiveURL(url) {
    assert2("url", url, string());
    return unpackAsync((cb) => __privateGet(this, _ubq3).loadSceneFromArchiveURL(url, cb));
  }
  /**
   * Serializes the current scene into a string. Selection is discarded.
   * @returns A promise that resolves with a string on success or an error on failure.
   */
  async saveToString(allowedResourceSchemes = [
    "blob",
    "bundle",
    "file",
    "http",
    "https"
  ]) {
    const scene = this.get();
    if (scene == null) {
      throw new Error("No scene available.");
    }
    return unpackAsync((cb) => {
      __privateGet(this, _ubq3).saveSceneToString(scene, cb, allowedResourceSchemes);
    });
  }
  /**
   * Saves the current scene and all of its referenced assets into an archive.
   * The archive contains all assets, that were accessible when this function was called.
   * Blocks in the archived scene reference assets relative from to the location of the scene
   * file. These references are resolved when loading such a scene via `loadSceneFromURL`.
   *
   * @returns A promise that resolves with a Blob on success or an error on failure.
   */
  async saveToArchive() {
    return new Promise((resolve, reject) => {
      const scene = this.get();
      if (scene == null) {
        reject(new Error("No scene available."));
      } else {
        __privateGet(this, _ubq3).saveSceneToArchive(scene, (result) => {
          if ("error" in result) {
            reject(result.error);
          } else {
            resolve(new Blob_default([result], { type: MimeType_default.Zip }));
          }
        });
      }
    });
  }
  create(sceneLayout = "Free") {
    assert2("sceneLayout", sceneLayout, sceneLayoutShape());
    const scene = unpackResult(__privateGet(this, _ubq3).createScene(sceneLayout));
    return scene;
  }
  createVideo() {
    return unpackResult(__privateGet(this, _ubq3).createVideoScene());
  }
  createFromImage(url, dpi = 300, pixelScaleFactor = 1, sceneLayout = "Free", spacing = 0, spacingInScreenSpace = false) {
    assert2("url", url, string());
    assert2("dpi", dpi, min(number(), 0));
    assert2("pixelScaleFactor", pixelScaleFactor, min(number(), 0));
    assert2("sceneLayout", sceneLayout, sceneLayoutShape());
    return unpackAsync(
      (cb) => __privateGet(this, _ubq3).createSceneFromImage(
        url,
        dpi,
        pixelScaleFactor,
        sceneLayout,
        spacing,
        spacingInScreenSpace,
        cb
      )
    );
  }
  createFromVideo(url) {
    assert2("url", url, string());
    return unpackAsync((cb) => __privateGet(this, _ubq3).createSceneFromVideo(url, cb));
  }
  get() {
    const result = __privateGet(this, _ubq3).findByType("scene");
    const vector = unpackResult(result);
    const scenes = cppVectorToArray_default(vector);
    return scenes.length > 0 ? scenes[0] : null;
  }
  async applyTemplateFromString(content) {
    assert2("content", content, string());
    return unpackAsync((cb) => __privateGet(this, _ubq3).applyTemplateFromString(content, cb));
  }
  async applyTemplateFromURL(url) {
    assert2("url", url, string());
    return unpackAsync((cb) => __privateGet(this, _ubq3).applyTemplateFromURL(url, cb));
  }
  getMode() {
    const scene = this.get();
    return unpackResult(__privateGet(this, _ubq3).getSceneMode(scene));
  }
  setDesignUnit(designUnit) {
    assert2("designUnit", designUnit, designUnitShape());
    const scene = this.get();
    unpackResult(__privateGet(this, _ubq3).setDesignUnit(scene, designUnit));
  }
  getDesignUnit() {
    const scene = this.get();
    return unpackResult(__privateGet(this, _ubq3).getDesignUnit(scene));
  }
  getPages() {
    return cppVectorToArray_default(unpackResult(__privateGet(this, _ubq3).getPages()));
  }
  getCurrentPage() {
    const scene = this.get();
    if (scene == null) {
      return null;
    }
    const result = __privateGet(this, _ubq3).getCurrentPage(scene);
    if (!result.isValid()) {
      return null;
    }
    return unpackResult(result);
  }
  findNearestToViewPortCenterByType(type2) {
    assert2("type", type2, string());
    const scene = this.get();
    if (scene == null) {
      return [];
    }
    const result = __privateGet(this, _ubq3).findNearestToViewPortCenterByType(scene, type2);
    const vector = unpackResult(result);
    return cppVectorToArray_default(vector);
  }
  findNearestToViewPortCenterByKind(kind) {
    assert2("kind", kind, string());
    const scene = this.get();
    if (scene == null) {
      return [];
    }
    const result = __privateGet(this, _ubq3).findNearestToViewPortCenterByKind(scene, kind);
    const vector = unpackResult(result);
    return cppVectorToArray_default(vector);
  }
  setZoomLevel(zoomLevel = 1) {
    const scene = this.get();
    assert2("zoomLevel", zoomLevel, min(number(), 0));
    __privateGet(this, _ubq3).setZoomLevel(scene, zoomLevel);
  }
  getZoomLevel() {
    const scene = this.get();
    return unpackResult(__privateGet(this, _ubq3).getZoomLevel(scene));
  }
  async zoomToBlock(id, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0) {
    assert2("id", id, integer());
    return unpackAsync(
      (cb) => __privateGet(this, _ubq3).zoomToBlock(
        id,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        cb
      )
    );
  }
  enableZoomAutoFit(id, axis, paddingBeforeOrLeft = 0, paddingAfterOrTop = 0, paddingRight = 0, paddingBottom = 0) {
    assert2("id", id, integer());
    assert2("axis", axis, zoomAutoFitAxisShape());
    if (axis === "Horizontal") {
      assert2("paddingBefore", paddingBeforeOrLeft, number());
      assert2("paddingAfter", paddingAfterOrTop, number());
      return unpackResult(
        __privateGet(this, _ubq3).enableZoomAutoFit(
          id,
          axis,
          paddingBeforeOrLeft,
          0,
          paddingAfterOrTop,
          0
        )
      );
    }
    if (axis === "Vertical") {
      assert2("paddingBefore", paddingBeforeOrLeft, number());
      assert2("paddingAfter", paddingAfterOrTop, number());
      return unpackResult(
        __privateGet(this, _ubq3).enableZoomAutoFit(
          id,
          axis,
          0,
          paddingBeforeOrLeft,
          0,
          paddingAfterOrTop
        )
      );
    }
    assert2("paddingLeft", paddingBeforeOrLeft, number());
    assert2("paddingTop", paddingAfterOrTop, number());
    assert2("paddingRight", paddingRight, number());
    assert2("paddingBottom", paddingBottom, number());
    return unpackResult(
      __privateGet(this, _ubq3).enableZoomAutoFit(
        id,
        axis,
        paddingBeforeOrLeft,
        paddingAfterOrTop,
        paddingRight,
        paddingBottom
      )
    );
  }
  disableZoomAutoFit(blockOrScene) {
    assert2("blockOrScene", blockOrScene, integer());
    return unpackResult(__privateGet(this, _ubq3).disableZoomAutoFit(blockOrScene));
  }
  isZoomAutoFitEnabled(blockOrScene) {
    assert2("blockOrScene", blockOrScene, integer());
    return unpackResult(__privateGet(this, _ubq3).isZoomAutoFitEnabled(blockOrScene));
  }
  /**
   * Continually ensures the camera position to be within the width and height of the blocks axis-aligned bounding box.
   * Without padding, this results in a tight clamp on the block. With padding, the padded part of the
   * blocks is ensured to be visible.
   *
   * @param ids - The blocks to which the camera position is adjusted to, usually, the scene or a page.
   * @param paddingLeft - Optional padding in screen pixels to the left of the block.
   * @param paddingTop - Optional padding in screen pixels to the top of the block.
   * @param paddingRight - Optional padding in screen pixels to the right of the block.
   * @param paddingBottom - Optional padding in screen pixels to the bottom of the block.
   * @param scaledPaddingLeft - Optional padding in screen pixels to the left of the block that scales with the zoom level until five times the initial value.
   * @param scaledPaddingTop - Optional padding in screen pixels to the top of the block that scales with the zoom level until five times the initial value.
   * @param scaledPaddingRight - Optional padding in screen pixels to the right of the block that scales with the zoom level until five times the initial value.
   * @param scaledPaddingBottom - Optional padding in screen pixels to the bottom of the block that scales with the zoom level until five times the initial value.
   */
  unstable_enableCameraPositionClamping(ids, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0, scaledPaddingLeft = 0, scaledPaddingTop = 0, scaledPaddingRight = 0, scaledPaddingBottom = 0) {
    assert2("ids", ids, array(number()));
    assert2("paddingLeft", paddingLeft, number());
    assert2("paddingTop", paddingTop, number());
    assert2("paddingRight", paddingRight, number());
    assert2("paddingBottom", paddingBottom, number());
    assert2("scaledPaddingLeft", paddingLeft, number());
    assert2("scaledPaddingTop", paddingTop, number());
    assert2("scaledPaddingRight", paddingRight, number());
    assert2("scaledPaddingBottom", paddingBottom, number());
    return unpackResult(
      __privateGet(this, _ubq3).unstable_enableCameraPositionClamping(
        ids,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        scaledPaddingLeft,
        scaledPaddingTop,
        scaledPaddingRight,
        scaledPaddingBottom
      )
    );
  }
  /**
   *  Disables any previously set position clamping for the current scene.
   * @param blockOrScene - Optionally, the scene or a block in the scene for which to query the position clamping.
   */
  unstable_disableCameraPositionClamping(blockOrScene = this.get()) {
    if (blockOrScene == null) {
      throw new Error("No scene available.");
    }
    return unpackResult(
      __privateGet(this, _ubq3).unstable_disableCameraPositionClamping(blockOrScene)
    );
  }
  /**
   *  Queries whether position clamping is enabled.
   *
   * @param blockOrScene - Optionally, the scene or a block in the scene for which to query the position clamping.
   * @returns True if the given block has position clamping set or the scene contains a block for which position clamping is set, false
   * otherwise.
   */
  unstable_isCameraPositionClampingEnabled(blockOrScene = this.get()) {
    if (blockOrScene == null) {
      throw new Error("No scene available.");
    }
    return unpackResult(
      __privateGet(this, _ubq3).unstable_isCameraPositionClampingEnabled(blockOrScene)
    );
  }
  /**
   * Continually ensures the zoom level of the camera in the active scene to be in the given range.
   *
   * @param ids - The blocks to which the camera zoom limits are adjusted to, usually, the scene or a page.
   * @param minZoomLimit - The minimum zoom level limit when zooming out, unlimited when negative.
   * @param maxZoomLimit - The maximum zoom level limit when zooming in, unlimited when negative.
   * @param paddingLeft - Optional padding in screen pixels to the left of the block. Only applied when the block is not a camera.
   * @param paddingTop - Optional padding in screen pixels to the top of the block. Only applied when the block is not a camera.
   * @param paddingRight - Optional padding in screen pixels to the right of the block. Only applied when the block is not a camera.
   * @param paddingBottom - Optional padding in screen pixels to the bottom of the block. Only applied when the block is not a camera.
   *
   */
  unstable_enableCameraZoomClamping(ids, minZoomLimit = -1, maxZoomLimit = -1, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0) {
    assert2("ids", ids, array(number()));
    assert2("minZoomLimit", minZoomLimit, number());
    assert2("maxZoomLimit", maxZoomLimit, number());
    assert2("paddingLeft", paddingLeft, number());
    assert2("paddingTop", paddingTop, number());
    assert2("paddingRight", paddingRight, number());
    assert2("paddingBottom", paddingBottom, number());
    return unpackResult(
      __privateGet(this, _ubq3).unstable_enableCameraZoomClamping(
        ids,
        minZoomLimit,
        maxZoomLimit,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom
      )
    );
  }
  /**
   * Disables any previously set zoom clamping for the current scene.
   * @param blockOrScene - Optionally, the scene or a block for which to query the zoom clamping.
   */
  unstable_disableCameraZoomClamping(blockOrScene = this.get()) {
    if (blockOrScene == null) {
      throw new Error("No scene available.");
    }
    return unpackResult(
      __privateGet(this, _ubq3).unstable_disableCameraZoomClamping(blockOrScene)
    );
  }
  /**
   * Queries whether zoom clamping is enabled.
   *
   * @param blockOrScene - Optionally, the scene or a block for which to query the zoom clamping.
   * @returns True if the given block has zoom clamping set or the scene contains a block for which zoom clamping is set, false otherwise.
   */
  unstable_isCameraZoomClampingEnabled(blockOrScene = this.get()) {
    if (blockOrScene == null) {
      throw new Error("No scene available.");
    }
    return unpackResult(
      __privateGet(this, _ubq3).unstable_isCameraZoomClampingEnabled(blockOrScene)
    );
  }
};
_init3 = __decoratorStart(null);
_ubq3 = new WeakMap();
__decorateElement(_init3, 1, "loadFromString", _loadFromString_dec2, SceneAPI);
__decorateElement(_init3, 1, "loadFromURL", _loadFromURL_dec, SceneAPI);
__decorateElement(_init3, 1, "loadFromArchiveURL", _loadFromArchiveURL_dec2, SceneAPI);
__decorateElement(_init3, 1, "create", _create_dec2, SceneAPI);
__decorateElement(_init3, 1, "createVideo", _createVideo_dec, SceneAPI);
__decorateElement(_init3, 1, "createFromImage", _createFromImage_dec, SceneAPI);
__decorateElement(_init3, 1, "createFromVideo", _createFromVideo_dec, SceneAPI);
__decorateElement(_init3, 1, "get", _get_dec, SceneAPI);
__decorateElement(_init3, 1, "applyTemplateFromString", _applyTemplateFromString_dec, SceneAPI);
__decorateElement(_init3, 1, "applyTemplateFromURL", _applyTemplateFromURL_dec, SceneAPI);
__decorateElement(_init3, 1, "getMode", _getMode_dec, SceneAPI);
__decorateElement(_init3, 1, "setDesignUnit", _setDesignUnit_dec, SceneAPI);
__decorateElement(_init3, 1, "getDesignUnit", _getDesignUnit_dec, SceneAPI);
__decorateElement(_init3, 1, "getPages", _getPages_dec, SceneAPI);
__decorateElement(_init3, 1, "getCurrentPage", _getCurrentPage_dec, SceneAPI);
__decorateElement(_init3, 1, "findNearestToViewPortCenterByType", _findNearestToViewPortCenterByType_dec, SceneAPI);
__decorateElement(_init3, 1, "findNearestToViewPortCenterByKind", _findNearestToViewPortCenterByKind_dec, SceneAPI);
__decorateElement(_init3, 1, "setZoomLevel", _setZoomLevel_dec, SceneAPI);
__decorateElement(_init3, 1, "getZoomLevel", _getZoomLevel_dec, SceneAPI);
__decorateElement(_init3, 1, "zoomToBlock", _zoomToBlock_dec, SceneAPI);
__decorateElement(_init3, 1, "enableZoomAutoFit", _enableZoomAutoFit_dec, SceneAPI);
__decorateElement(_init3, 1, "disableZoomAutoFit", _disableZoomAutoFit_dec, SceneAPI);
__decorateElement(_init3, 1, "isZoomAutoFitEnabled", _isZoomAutoFitEnabled_dec, SceneAPI);
__decoratorMetadata(_init3, SceneAPI);

// ../../bindings/wasm/js_web/src/AssetAPI.ts
var assetCallbacks = /* @__PURE__ */ new WeakMap();
var EMPTY_RESULT = {
  assets: [],
  total: 0,
  currentPage: 0,
  nextPage: void 0
};
var AssetAPI = class {
  /** @internal */
  #ubq;
  /** @internal */
  constructor(ubq) {
    this.#ubq = ubq;
  }
  /** @internal */
  #applyAssetMiddlewares = /* @__PURE__ */ new Set();
  /** @internal */
  #applyAssetToBlockMiddlewares = /* @__PURE__ */ new Set();
  /**
   * Register a middleware that is called before applying an asset to the scene.
   * @internal
   */
  unstable_registerApplyAssetMiddleware(middleware) {
    this.#applyAssetMiddlewares.add(middleware);
    return () => {
      this.#applyAssetMiddlewares.delete(middleware);
    };
  }
  /**
   * Register a middleware that is called before applying an asset to a block.
   * @internal
   */
  unstable_registerApplyAssetToBlockMiddleware(middleware) {
    this.#applyAssetToBlockMiddlewares.add(middleware);
    return () => {
      this.#applyAssetToBlockMiddlewares.delete(middleware);
    };
  }
  /**
   * Adds a custom asset source. Its ID has to be unique.
   * @param source - The asset source.
   */
  addSource(source) {
    const getSupportedMimeTypes = source.getSupportedMimeTypes?.bind(source);
    const getGroups = source.getGroups?.bind(source);
    const applyAsset = source.applyAsset?.bind(source);
    const applyAssetToBlock = source.applyAssetToBlock?.bind(source);
    const addAsset = source.addAsset?.bind(source);
    const removeAsset = source.removeAsset?.bind(source);
    const credits = source.credits;
    const license = source.license;
    unpackResult(
      this.#ubq.addAssetSource(
        source.id,
        async (query, callback) => {
          try {
            const queryData = {
              ...query,
              sortKey: query.sortKey,
              sortingOrder: query.sortingOrder,
              sortActiveFirst: query.sortActiveFirst,
              tags: cppVectorToArray_default(query.tags),
              groups: cppVectorToArray_default(query.groups),
              excludeGroups: cppVectorToArray_default(query.excludeGroups)
            };
            const result = await source.findAssets(queryData);
            if (!result) {
              callback.invoke(EMPTY_RESULT);
            } else {
              const completeResult = {
                ...result,
                assets: result.assets.map(
                  (asset) => ensureComplete(asset, source.id)
                )
              };
              callback.invoke(completeResult);
            }
          } catch (e) {
            callback.invoke(
              e.message ?? "Unknown error in user-defined `findAssets`"
            );
          }
        },
        getGroups ? async (callback) => {
          try {
            const groups = await getGroups();
            callback.invoke(groups);
          } catch (e) {
            callback.invoke(
              e.message ?? "Unknown error in user-defined `getGroups`"
            );
          }
        } : null,
        credits ? () => ({ name: credits.name, url: credits.url ?? "" }) : null,
        license ? () => ({ name: license.name, url: license.url ?? "" }) : null,
        getSupportedMimeTypes ? () => {
          return getSupportedMimeTypes() ?? [];
        } : null,
        applyAsset ? async (findAssetResult, callback) => {
          try {
            const id = await applyAsset(
              this.#adaptAssetResult(findAssetResult)
            );
            callback.invoke(id);
          } catch (e) {
            callback.invoke(
              e.message ?? "Unknown error in user-defined `applyAsset`"
            );
          }
        } : null,
        applyAssetToBlock ? async (result, block, callback) => {
          try {
            await applyAssetToBlock(this.#adaptAssetResult(result), block);
            callback.invoke({});
          } catch (e) {
            callback.invoke(
              e.message ?? "Unknown error in user-defined `applyAssetToBlock`"
            );
          }
        } : null,
        addAsset ? async (asset) => {
          addAsset(asset);
        } : null,
        removeAsset ? async (id) => {
          removeAsset(id);
        } : null
      )
    );
    this.#addAssetCallbacks(source.id, source);
  }
  /**
   * Adds a local asset source. Its ID has to be unique.
   * @param source - The asset source.
   * @param supportedMimeTypes - The mime types of assets that are allowed to be added to this local source.
   * @param applyAsset - An optional callback that can be used to override the default behavior of applying a given
   * asset result to the active scene.
   * @param applyAssetToBlock - An optional callback that can be used to override the default behavior of applying
   * an asset result to a given block.
   */
  addLocalSource(id, supportedMimeTypes, applyAsset, applyAssetToBlock) {
    unpackResult(
      this.#ubq.addLocalAssetSource(
        id,
        supportedMimeTypes ?? [],
        applyAsset ? async (findAssetResult, callback) => {
          try {
            const blockId = await applyAsset(
              this.#adaptAssetResult(findAssetResult)
            );
            callback.invoke(blockId);
          } catch (e) {
            callback.invoke(
              e.message ?? "Unknown error in user-defined `applyAsset`"
            );
          }
        } : null,
        applyAssetToBlock ? async (result, block, callback) => {
          try {
            await applyAssetToBlock(this.#adaptAssetResult(result), block);
            callback.invoke({});
          } catch (e) {
            callback.invoke(
              e.message ?? "Unknown error in user-defined `applyAssetToBlock`"
            );
          }
        } : null
      )
    );
  }
  /**
   * Removes an asset source with the given ID.
   * @param id - The ID to refer to the asset source.
   */
  removeSource(id) {
    unpackResult(this.#ubq.removeAssetSource(id));
    this.#removeAssetCallbacks(id);
  }
  /**
   * Finds all registered asset sources.
   * @returns A list with the IDs of all registered asset sources.
   */
  findAllSources() {
    return cppVectorToArray_default(this.#ubq.findAllAssetSources());
  }
  /**
   * Finds assets of a given type in a specific asset source.
   * @param sourceId - The ID of the asset source.
   * @param query - All the options to filter the search results by.
   * @returns The search results.
   */
  findAssets(sourceId, query) {
    return new Promise((resolve, reject) => {
      let tags = query?.tags ?? [];
      if (!Array.isArray(tags)) tags = [tags];
      const findAssetQuery = {
        perPage: query?.perPage ?? 0,
        page: query?.page ?? 0,
        query: query?.query ?? "",
        tags,
        groups: query?.groups ?? [],
        excludeGroups: query?.excludeGroups ?? [],
        locale: query?.locale ?? "",
        sortingOrder: query?.sortingOrder ?? "None",
        sortKey: query?.sortKey ?? "",
        sortActiveFirst: query?.sortActiveFirst ?? false
      };
      this.#ubq.findAssetSourceAssets(sourceId, findAssetQuery, (result) => {
        try {
          const unpacked = unpackResult(result);
          resolve({
            ...unpacked,
            nextPage: unpacked.nextPage === -1 ? void 0 : unpacked.nextPage
          });
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  /** internal */
  #adaptAssetResult(findAssetResult) {
    const assetResult = {
      ...findAssetResult
    };
    if (assetResult.groups?.length === 0) {
      delete assetResult.groups;
    }
    if (!assetResult.locale) {
      delete assetResult.locale;
    }
    if (!assetResult.label) {
      delete assetResult.label;
    }
    if (assetResult.tags?.length === 0) {
      delete assetResult.tags;
    }
    if (!assetResult.credits?.name && !assetResult.credits?.url) {
      delete assetResult.credits;
    } else if (!assetResult.credits.url) {
      delete assetResult.credits.url;
    }
    if (!assetResult.license?.name && !assetResult.license?.url) {
      delete assetResult.license;
    } else if (!assetResult.license.url) {
      delete assetResult.license.url;
    }
    if (!assetResult.utm?.source && !assetResult.utm?.medium) {
      delete assetResult.utm;
    } else {
      if (!assetResult.utm.source) {
        delete assetResult.utm.source;
      }
      if (!assetResult.utm.medium) {
        delete assetResult.utm.medium;
      }
    }
    return assetResult;
  }
  /**
   * Queries the asset source's groups for a certain asset type.
   * @param id - The ID of the asset source.
   * @returns The asset groups.
   */
  async getGroups(id) {
    return unpackAsync(
      (cb) => this.#ubq.getAssetSourceGroups(id, cb)
    ).then((vector) => cppVectorToArray_default(vector));
  }
  /**
   * Queries the list of supported mime types of the specified asset source.
   * An empty result means that all mime types are supported.
   * @param sourceId - The ID of the asset source.
   */
  getSupportedMimeTypes(sourceId) {
    return cppVectorToArray_default(
      unpackResult(this.#ubq.getAssetSourceSupportedMimeTypes(sourceId))
    );
  }
  /**
   * Queries the asset source's credits info.
   * @param sourceId - The ID of the asset source.
   * @returns The asset source's credits info consisting of a name and an optional URL.
   */
  getCredits(sourceId) {
    const credits = unpackResult(this.#ubq.getAssetSourceCredits(sourceId));
    if (!credits.name && !credits.url) {
      return void 0;
    } else if (!credits.url) {
      return { name: credits.name, url: void 0 };
    }
    return credits;
  }
  /**
   * Queries the asset source's license info.
   * @param sourceId - The ID of the asset source.
   * @returns The asset source's license info consisting of a name and an optional URL.
   */
  getLicense(sourceId) {
    const license = unpackResult(this.#ubq.getAssetSourceLicense(sourceId));
    if (!license.name && !license.url) {
      return void 0;
    } else if (!license.url) {
      return { name: license.name, url: void 0 };
    }
    return license;
  }
  canManageAssets(sourceId) {
    return !!assetCallbacks.get(this.#ubq)?.get(sourceId)?.canManageAssets;
  }
  /**
   * Adds the given asset to a local asset source.
   * @param sourceId - The local asset source ID that the asset should be added to.
   * @param asset - The asset to be added to the asset source.
   */
  addAssetToSource(sourceId, asset) {
    unpackResult(this.#ubq.addAssetToSource(sourceId, asset));
  }
  /**
   * Removes the specified asset from its local asset source.
   * @param sourceId - The id of the local asset source that currently contains the asset.
   * @param assetId - The id of the asset to be removed.
   */
  removeAssetFromSource(sourceId, assetId) {
    unpackResult(this.#ubq.removeAssetFromSource(sourceId, assetId));
  }
  #addAssetCallbacks(sourceId, source) {
    if (!assetCallbacks.has(this.#ubq)) {
      assetCallbacks.set(this.#ubq, /* @__PURE__ */ new Map());
    }
    if (source.canManageAssets) {
      console.warn(
        `
DEPRECATION WARNING:

'canManageAssets' flag was found for asset source with the id '${sourceId}'.

This flag is deprecated and will be removed in the next version. If you have used it to control if an upload buttons is rendered in the asset library, use the 'canAdd' options on an asset library entry. See documentation here: https://img.ly/docs/cesdk/ui/guides/customize-asset-library/`
      );
    }
    assetCallbacks.get(this.#ubq).set(sourceId, {
      canManageAssets: source.canManageAssets
    });
  }
  #removeAssetCallbacks(sourceId) {
    assetCallbacks.get(this.#ubq)?.delete(sourceId);
  }
  /**
   * Apply an asset result to the active scene.
   * The default behavior will instantiate a block and configure it according to the asset's properties.
   * Note that this can be overridden by providing an `applyAsset` function when adding the asset source.
   * @param sourceId - The ID of the asset source.
   * @param assetResult - A single assetResult of a `findAssets` query.
   */
  async apply(sourceId, assetResult) {
    const originalApplyAsset = (id, asset) => {
      return new Promise((resolve, reject) => {
        this.#ubq.applyAssetSourceAsset(
          id,
          ensureComplete(asset, id),
          (result) => {
            try {
              const _id = unpackResult(result);
              if (this.#ubq.isValid(_id)) {
                resolve(_id);
              } else {
                resolve(void 0);
              }
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    };
    if (this.#applyAssetMiddlewares.size > 0) {
      const applyAsset = Array.from(this.#applyAssetMiddlewares).reduce(
        (next, middleware) => {
          return (id, asset) => middleware(id, asset, next);
        },
        originalApplyAsset
      );
      return applyAsset(sourceId, assetResult);
    } else {
      return originalApplyAsset(sourceId, assetResult);
    }
  }
  /**
   * Apply an asset result to the given block.
   * @param sourceId - The ID of the asset source.
   * @param assetResult - A single assetResult of a `findAssets` query.
   * @param block - The block the asset should be applied to.
   */
  async applyToBlock(sourceId, assetResult, block) {
    const originalApplyAssetToBlock = (id, asset, blockId) => {
      return unpackAsync(
        (cb) => this.#ubq.applyAssetSourceAssetToBlock(
          id,
          ensureComplete(asset, id),
          blockId,
          cb
        )
      );
    };
    if (this.#applyAssetToBlockMiddlewares.size > 0) {
      const applyToBlock = Array.from(
        this.#applyAssetToBlockMiddlewares
      ).reduce(
        (next, middleware) => {
          return (id, asset, blockId) => middleware(id, asset, blockId, next);
        },
        originalApplyAssetToBlock
      );
      return applyToBlock(sourceId, assetResult, block);
    } else {
      return originalApplyAssetToBlock(sourceId, assetResult, block);
    }
  }
  async unstable_applyProperty(sourceId, assetResult, property) {
    return unpackAsync(
      (cb) => this.#ubq.unstable_applyAssetSourceProperty(
        sourceId,
        ensureComplete(assetResult, sourceId),
        property,
        cb
      )
    );
  }
  /**
   * The default implementation for applying an asset to the scene.
   * This implementation is used when no `applyAsset` function is provided to `addSource`.
   * @param assetResult - A single assetResult of a `findAssets` query.
   */
  async defaultApplyAsset(assetResult) {
    return new Promise((resolve, reject) => {
      this.#ubq.defaultApplyAsset(ensureComplete(assetResult, ""), (result) => {
        try {
          const id = unpackResult(result);
          if (this.#ubq.isValid(id)) {
            resolve(id);
          } else {
            resolve(void 0);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  /**
   * The default implementation for applying an asset to an existing block.
   * @param assetResult - A single assetResult of a `findAssets` query.
   * @param block - The block to apply the asset result to.
   */
  async defaultApplyAssetToBlock(assetResult, block) {
    return unpackAsync(
      (cb) => this.#ubq.defaultApplyAssetToBlock(
        ensureComplete(assetResult, ""),
        block,
        cb
      )
    );
  }
  /**
   * Register a callback to be called every time an asset source is added.
   * @param callback - The function that is called whenever an asset source is added.
   * @returns A method to unsubscribe.
   */
  onAssetSourceAdded = (callback) => {
    const subscription = this.#ubq.subscribeToAssetSourceAdded(callback);
    return () => {
      if (this.#ubq.isDeleted()) return;
      unpackResult(this.#ubq.unsubscribe(subscription));
    };
  };
  /**
   * Register a callback to be called every time an asset source is removed.
   * @param callback - The function that is called whenever an asset source is added.
   * @returns A method to unsubscribe.
   */
  onAssetSourceRemoved = (callback) => {
    const subscription = this.#ubq.subscribeToAssetSourceRemoved(callback);
    return () => {
      if (this.#ubq.isDeleted()) return;
      unpackResult(this.#ubq.unsubscribe(subscription));
    };
  };
  /**
   * Register a callback to be called every time an asset source's contents are changed.
   * @param callback - The function that is called whenever an asset source is updated.
   * @returns A method to unsubscribe.
   */
  onAssetSourceUpdated = (callback) => {
    const subscription = this.#ubq.subscribeToAssetSourceUpdated(callback);
    return () => {
      if (this.#ubq.isDeleted()) return;
      unpackResult(this.#ubq.unsubscribe(subscription));
    };
  };
  /**
   * Notifies the engine that the contents of an asset source changed.
   * @param sourceID - The asset source whose contents changed.
   */
  assetSourceContentsChanged(sourceID) {
    unpackResult(this.#ubq.assetSourceContentsChanged(sourceID));
  }
  /**
   * @internal
   * Remove reference in WeakMap. Just a precaution to not leak a handful of references in a global map.
   */
  dispose() {
    assetCallbacks.delete(this.#ubq);
  }
};
function ensureComplete(assetResult, sourceId) {
  const hasContext = "context" in assetResult && assetResult.context.sourceId === sourceId;
  const hasActive = "active" in assetResult;
  if (hasContext && hasActive) {
    return assetResult;
  }
  return {
    ...assetResult,
    active: assetResult.active ?? false,
    context: { sourceId }
  };
}

// ../../bindings/wasm/js_web/src/types/engine.ts
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2[NotificationType2["Information"] = 0] = "Information";
  NotificationType2[NotificationType2["Warning"] = 1] = "Warning";
  NotificationType2[NotificationType2["Error"] = 2] = "Error";
  return NotificationType2;
})(NotificationType || {});
var SceneLayoutNumeric = /* @__PURE__ */ ((SceneLayoutNumeric2) => {
  SceneLayoutNumeric2[SceneLayoutNumeric2["Free"] = 0] = "Free";
  SceneLayoutNumeric2[SceneLayoutNumeric2["VerticalStack"] = 1] = "VerticalStack";
  SceneLayoutNumeric2[SceneLayoutNumeric2["HorizontalStack"] = 2] = "HorizontalStack";
  SceneLayoutNumeric2[SceneLayoutNumeric2["DepthStack"] = 3] = "DepthStack";
  return SceneLayoutNumeric2;
})(SceneLayoutNumeric || {});

// ../../bindings/wasm/js_web/src/utils/mapToEngineKey.ts
function mapToEngineKey(event) {
  const result = {
    key: 255 /* Unknown */,
    characters: event.key,
    shiftIsHeld: event.shiftKey,
    commandIsHeld: event.metaKey || event.ctrlKey,
    optionIsHeld: event.altKey,
    timestamp: Date.now()
  };
  switch (event.key.toUpperCase()) {
    case "0":
      result.key = 0 /* Key0 */;
      break;
    case "1":
      result.key = 1 /* Key1 */;
      break;
    case "2":
      result.key = 2 /* Key2 */;
      break;
    case "3":
      result.key = 3 /* Key3 */;
      break;
    case "4":
      result.key = 4 /* Key4 */;
      break;
    case "5":
      result.key = 5 /* Key5 */;
      break;
    case "6":
      result.key = 6 /* Key6 */;
      break;
    case "7":
      result.key = 7 /* Key7 */;
      break;
    case "8":
      result.key = 8 /* Key8 */;
      break;
    case "9":
      result.key = 9 /* Key9 */;
      break;
    case "A":
      result.key = 10 /* A */;
      break;
    case "B":
      result.key = 11 /* B */;
      break;
    case "C":
      result.key = 12 /* C */;
      break;
    case "D":
      result.key = 13 /* D */;
      break;
    case "E":
      result.key = 14 /* E */;
      break;
    case "F":
      result.key = 15 /* F */;
      break;
    case "G":
      result.key = 16 /* G */;
      break;
    case "H":
      result.key = 17 /* H */;
      break;
    case "I":
      result.key = 18 /* I */;
      break;
    case "J":
      result.key = 19 /* J */;
      break;
    case "K":
      result.key = 20 /* K */;
      break;
    case "L":
      result.key = 21 /* L */;
      break;
    case "M":
      result.key = 22 /* M */;
      break;
    case "N":
      result.key = 23 /* N */;
      break;
    case "O":
      result.key = 24 /* O */;
      break;
    case "P":
      result.key = 25 /* P */;
      break;
    case "Q":
      result.key = 26 /* Q */;
      break;
    case "R":
      result.key = 27 /* R */;
      break;
    case "S":
      result.key = 28 /* S */;
      break;
    case "T":
      result.key = 29 /* T */;
      break;
    case "U":
      result.key = 30 /* U */;
      break;
    case "V":
      result.key = 31 /* V */;
      break;
    case "W":
      result.key = 32 /* W */;
      break;
    case "X":
      result.key = 33 /* X */;
      break;
    case "Y":
      result.key = 34 /* Y */;
      break;
    case "Z":
      result.key = 35 /* Z */;
      break;
    case " ":
      result.key = 42 /* Space */;
      break;
    case "ESCAPE":
      result.key = 43 /* Escape */;
      result.characters = "";
      break;
    case "BACKSPACE":
      result.key = 40 /* Backspace */;
      result.characters = "";
      break;
    case "DELETE":
      result.key = 44 /* Delete */;
      result.characters = "";
      break;
    case "ENTER":
      result.key = 41 /* Enter */;
      result.characters = result.shiftIsHeld ? "\u2028" : "\n";
      break;
    case "CONTROL":
      result.key = 45 /* Control */;
      result.characters = "";
      break;
    case "ALT":
      result.key = 46 /* Option */;
      result.characters = "";
      break;
    case "SHIFT":
      result.key = 47 /* Shift */;
      result.characters = "";
      break;
    case "ARROWLEFT":
      result.key = 36 /* ArrowLeft */;
      result.characters = "";
      break;
    case "ARROWRIGHT":
      result.key = 37 /* ArrowRight */;
      result.characters = "";
      break;
    case "ARROWUP":
      result.key = 38 /* ArrowUp */;
      result.characters = "";
      break;
    case "ARROWDOWN":
      result.key = 39 /* ArrowDown */;
      result.characters = "";
      break;
    case "DEAD":
      result.key = 255 /* Unknown */;
      result.characters = "";
      break;
    default:
      break;
  }
  return result;
}

// ../../bindings/wasm/js_web/src/ubq/LegacyAPI.ts
var _getValue_dec, _hasComponent_dec, _getSelectedText_dec, _init4;
_getSelectedText_dec = [getter], _hasComponent_dec = [getter], _getValue_dec = [getter];
var LegacyAPI = class {
  constructor(ubq) {
    __runInitializers(_init4, 5, this);
    __publicField(this, "ubique");
    __publicField(this, "notificationStream", (handler) => {
      const disposable = this.ubique.addEventCallback(
        "NotificationEvent",
        (e) => handler({
          type: NotificationType[e.type],
          i18n: e.i18n
        })
      );
      return () => {
        disposable.dispose();
        disposable.delete();
      };
    });
    __publicField(this, "designElementLifecycleStream", (event) => (handler) => {
      const disposable = this.ubique.addEventCallback(event, handler);
      return () => {
        disposable.dispose();
        disposable.delete();
      };
    });
    __publicField(this, "historyStream", (handler) => {
      const disposable = this.ubique.addEventCallback(
        "HistoryUpdatedEvent",
        handler
      );
      return () => {
        disposable.dispose();
        disposable.delete();
      };
    });
    this.ubique = ubq.getInternalAPI();
  }
  dispose() {
    this.ubique.delete();
  }
  setErrorCallback(callback, abortOnError) {
    this.ubique.setErrorCallback(callback, abortOnError);
  }
  getSelectedText() {
    return unpackResult(this.ubique.getSelectedText());
  }
  hasComponent(id, component) {
    return unpackResult(this.ubique.hasComponent(id, component));
  }
  getValue(id, component, keyPath) {
    return unpackResult(this.ubique.getValue(id, component, keyPath));
  }
  execute(command, args) {
    let executeResult;
    const resultPromise = new Promise((resolve, reject) => {
      executeResult = this.ubique.ubqExecute(command, args, (rawResult) => {
        try {
          const result = unpackResult(rawResult);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    unpackResult(executeResult);
    return resultPromise;
  }
  /**
   * Convencience helper to send keyboard events into the engine
   */
  sendKey(event) {
    return this.execute("ubq/inputs/keyboardkey", mapToEngineKey(event));
  }
  /** Convenience helper to avoid having to work with numeric scene layouts in the CESDK */
  changeSceneLayout(scene, layout, spacing, spacingInScreenSpace) {
    return this.execute("ubq/scene/changeLayout", [
      scene,
      SceneLayoutNumeric[layout],
      spacing,
      spacingInScreenSpace
    ]);
  }
};
_init4 = __decoratorStart(null);
__decorateElement(_init4, 1, "getSelectedText", _getSelectedText_dec, LegacyAPI);
__decorateElement(_init4, 1, "hasComponent", _hasComponent_dec, LegacyAPI);
__decorateElement(_init4, 1, "getValue", _getValue_dec, LegacyAPI);
__decoratorMetadata(_init4, LegacyAPI);

// ../../bindings/wasm/js_web/src/VariableAPI.ts
var _remove_dec, _getString_dec2, _setString_dec2, _findAll_dec2, _ubq4, _init5;
_findAll_dec2 = [getter], _setString_dec2 = [setter], _getString_dec2 = [getter], _remove_dec = [setter];
var VariableAPI = class {
  /** @internal */
  constructor(ubq) {
    __runInitializers(_init5, 5, this);
    /** @internal */
    __privateAdd(this, _ubq4);
    __privateSet(this, _ubq4, ubq);
  }
  findAll() {
    return cppVectorToArray_default(__privateGet(this, _ubq4).findAllVariables());
  }
  setString(key, value) {
    assert2("key", key, string());
    assert2("value", value, string());
    return unpackResult(__privateGet(this, _ubq4).setVariableString(key, value));
  }
  getString(key) {
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq4).getVariableString(key));
  }
  remove(key) {
    assert2("key", key, string());
    return unpackResult(__privateGet(this, _ubq4).removeVariable(key));
  }
};
_init5 = __decoratorStart(null);
_ubq4 = new WeakMap();
__decorateElement(_init5, 1, "findAll", _findAll_dec2, VariableAPI);
__decorateElement(_init5, 1, "setString", _setString_dec2, VariableAPI);
__decorateElement(_init5, 1, "getString", _getString_dec2, VariableAPI);
__decorateElement(_init5, 1, "remove", _remove_dec, VariableAPI);
__decoratorMetadata(_init5, VariableAPI);

// ../../bindings/wasm/js_web/src/configure.ts
var isDevelopment = true;
function configureEngine(ubq, config) {
  const editor = new EditorAPI(ubq);
  const assets = new AssetAPI(ubq);
  editor.setRole(config.role ?? "Creator");
  if (isDevelopment) {
    const legacyApi = new LegacyAPI(ubq);
    void legacyApi.execute("cesdk/getVersionInfo").then(
      (info) => (
        // eslint-disable-next-line no-console
        console.debug(info)
      )
    );
    void legacyApi.execute("cesdk/getCapabilitiesInfo").then(
      (info) => (
        // eslint-disable-next-line no-console
        console.debug(info)
      )
    );
    legacyApi.dispose();
  }
  editor.setSettingString("basePath", config.baseURL);
  editor.setSettingBool(
    "showBuildVersion",
    isDevelopment || false
  );
  if (config.featureFlags?.preventScrolling) {
    editor.setSettingBool("touch/singlePointPanning", false);
    editor.setSettingBool("touch/dragStartCanSelect", false);
  }
  assets.addLocalSource("ly.img.text");
  initializeFeatures();
  initializeVariables();
  editor.startTracking(config.license, config.userId ?? "");
  function initializeFeatures() {
    if (isDevelopment) {
      editor.setSettingBool("features/hspSelectiveAdjustmentsEnabled", false);
      editor.setSettingBool("features/templatingEnabled", true);
    }
    const singlePageMode = !!config.featureFlags?.singlePageMode;
    editor.setSettingBool("features/singlePageModeEnabled", singlePageMode);
    editor.setSettingBool("features/effectsEnabled", true);
  }
  function initializeVariables() {
    const api = new VariableAPI(ubq);
    if (isDevelopment || typeof window !== "undefined" && window.Cypress) {
      api.setString("company_name", "img.ly");
      api.setString("first_name", "Charly");
      api.setString("last_name", "Williams");
      api.setString("address", "742 Evergreen Terrace");
      api.setString("city", "Springfield");
    }
  }
}

// ../../bindings/wasm/js_web/src/license.ts
var licenseEndpoint = true ? "https://api.staging.img.ly/activate" : "https://api.img.ly/activate";
function downloadAndCheckLicense(config, fetchImpl = fetch) {
  if (!config.license) {
    throw new Error("Missing license key in config");
  }
  const license = config.license.length < 128 ? fetchImpl(licenseEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: config.license,
      userId: config.userId
    })
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(
        `Unfortunately we are experiencing a server down time and your License key cannot be validated. We're already working on a fix and will restore service soon. Should services not restore within the hour, kindly get in touch with our support team.`
      );
    }
  }).then((data) => {
    if (data.status === "valid") {
      return data.license;
    } else if (data.status === "expired") {
      throw new Error(
        "Thanks for using IMG.LY for creative editing. Please note that your license file or commercial use is expired. Please get in touch with our sales team to discuss extension of your commercial license."
      );
    } else {
      throw new Error(
        "The License Key (API Key) you are using to access the IMG.LY SDK is invalid. Please ensure that you are using the license key tied to your subscription and get in touch with our support team."
      );
    }
  }) : Promise.resolve(config.license);
  return license;
}
function unlockUbq(ubq, license) {
  if (!license) throw new Error("Missing license key");
  unpackResult(ubq.unlockWithLicense(license));
}

// ../../bindings/wasm/js_web/src/ubq/module.ts
var import_cesdk = __toESM(require_cesdk());

// ../../_builds/cesdk/wasm32-unknown-emscripten/RelWithDebInfo/cesdk.data
var cesdk_default = "../../cesdk-v1.38.0-XHZXX7DG.data";

// ../../_builds/cesdk/wasm32-unknown-emscripten/RelWithDebInfo/cesdk.wasm
var cesdk_default2 = "../../cesdk-v1.38.0-OUAQCJWX.wasm";

// ../../bindings/wasm/js_web/src/ubq/module.ts
var CESDK_JS = import_cesdk.default;

// ../../bindings/wasm/js_web/src/ui/browser.ts
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var userAgent = canUseDOM && navigator && navigator.userAgent || "";
var isEdge = userAgent.indexOf("Edge") !== -1;
var isIE = !!userAgent.match(/msie|trident/i);
var isMobileWebKit = /\b(iPad|iPhone|iPod)\b/.test(userAgent) && /WebKit/.test(userAgent) && !/Edge/.test(userAgent) && (typeof window === "undefined" || !("MSStream" in window));

// ../../bindings/wasm/js_web/src/init.ts
var changeAssetPath = (initialPath, assetPath) => {
  if (assetPath != null) {
    const fileName = initialPath.split("/").pop();
    return [assetPath, fileName].join("");
  }
  return new URL(initialPath, window.location.origin);
};
function getWasmMemory() {
  try {
    return new WebAssembly.Memory({
      initial: getWasmPageLimitFromMegabytes(isMobileWebKit ? 512 : 32),
      maximum: getWasmPageLimitFromMegabytes(2048)
    });
  } catch (e) {
    return new WebAssembly.Memory({
      initial: getWasmPageLimitFromMegabytes(32),
      maximum: getWasmPageLimitFromMegabytes(2048)
    });
  }
}
function getWasmPageLimitFromMegabytes(limitInMegabytes) {
  return limitInMegabytes * 1024 * 1024 / 65536;
}
async function init(canvasElement, config) {
  const { core } = config;
  const log = config.logger;
  const wasmPath = changeAssetPath(cesdk_default2, core.baseURL).toString();
  const dataPath = changeAssetPath(cesdk_default, core.baseURL).toString();
  const targetIsElectron = /electron/i.test(navigator.userAgent);
  const license = downloadAndCheckLicense(config);
  const getPreloadedPackage = targetIsElectron ? await fetch(dataPath, { credentials: "same-origin" }).then((res) => res.arrayBuffer()).then((buffer) => {
    return function getPreloadedPackage2(name, size) {
      if (name !== dataPath) {
        return null;
      }
      if (size === buffer.byteLength) {
        return buffer;
      } else {
        throw new Error(
          `Attempt to get preloaded package of unknown name or size: ${name} ${size}`
        );
      }
    };
  }) : void 0;
  return new Promise((resolveInit, rejectInit) => {
    const emscriptenConfig = {
      getPreloadedPackage,
      locateFile: (path, prefix) => {
        if (path.endsWith(".wasm")) {
          return wasmPath;
        }
        if (path.endsWith(".data")) {
          return dataPath;
        }
        return prefix + path;
      },
      print: (message) => {
        if (message && message !== "undefined") {
          log(message, "Info");
        }
      },
      printErr: (message) => {
        if (message && message !== "undefined") {
          log(message, "Error");
        }
      },
      logReadFiles: false,
      printWithColors: true,
      wasmMemory: getWasmMemory()
    };
    CESDK_JS(emscriptenConfig).then(async (ModuleInstance) => {
      ModuleInstance.specialHTMLTargets["!canvas"] = canvasElement;
      const target = "!canvas";
      ModuleInstance.emscripten_ubq_settings_forceWebGL1 = isMobileWebKit || !!config?.forceWebGL1;
      const engine = unpackResult(
        ModuleInstance.createEngine(target, config.audioOutput ?? "auto")
      );
      unlockUbq(engine, await license);
      configureEngine(engine, config);
      resolveInit(engine);
    }).catch(rejectInit);
  });
}

// ../../bindings/wasm/js_web/src/workers/transferSettings.ts
function importSettings(editor, settings) {
  for (const [key, value] of settings) {
    switch (editor.getSettingType(key)) {
      case "Bool":
        editor.setSettingBool(key, value);
        break;
      case "Int":
        editor.setSettingInt(key, value);
        break;
      case "Float":
        editor.setSettingFloat(key, value);
        break;
      case "String":
        editor.setSettingString(key, value);
        break;
      case "Color":
        editor.setSettingColor(key, value);
        break;
      case "Enum":
        {
          const _key = key;
          const _value = value;
          editor.setSettingEnum(_key, _value);
        }
        break;
      default:
        break;
    }
  }
}

// ../../bindings/wasm/js_web/src/workers/exportVideo.ts
var MAX_QUEUE_SIZE = 10;
globalThis.ubq_browserTabHidden = true;
async function exportVideo(config, settings, sceneString, options, workerOptions, runOptions) {
  let queueSize = 0;
  let lastActivity = null;
  let rejectExport;
  let timeout;
  const visibilityChannel = runOptions.visibility ?? defaultVisibility;
  const inactivityTimeout = runOptions.inactivityTimeout;
  const unsubscribeVisibility = visibilityChannel.subscribe(() => {
    if (lastActivity !== null) {
      lastActivity = Date.now();
    }
    globalThis.ubq_browserTabHidden = !visibilityChannel.value();
  });
  let disposeEngine = null;
  function dispose() {
    clearTimeout(timeout);
    unsubscribeVisibility();
    disposeEngine?.();
  }
  try {
    let update2 = function() {
      if (visibilityChannel.value() === true && lastActivity !== null) {
        if (Date.now() - lastActivity > inactivityTimeout) {
          rejectExport(new Error("Video export timed out due to inactivity."));
          return;
        }
      }
      if (queueSize < MAX_QUEUE_SIZE) {
        ubq.update();
      }
      timeout = setTimeout(update2, 1);
    };
    var update = update2;
    const canvas = new OffscreenCanvas(64, 64);
    const ubq = await init(canvas, { ...config, audioOutput: "none" });
    const sceneApi = new SceneAPI(ubq);
    const blockApi = new BlockAPI(ubq);
    const editorApi = new EditorAPI(ubq);
    disposeEngine = () => {
      ubq.delete();
    };
    importSettings(editorApi, settings);
    if (workerOptions?.trackingMetadata) {
      editorApi.setTrackingMetadata(workerOptions.trackingMetadata);
    }
    if (workerOptions?.uriResolver) {
      let resolverWithError2 = function(uri, defaultURIResolver) {
        try {
          return uriResolver(uri, defaultURIResolver);
        } catch (e) {
          console.warn(
            `Error during execution of URI resolver: ${e}.
Make sure the url resolver function does not reference any external variables. Falling back to default URI resolver.`
          );
          return defaultURIResolver(uri);
        }
      };
      var resolverWithError = resolverWithError2;
      const uriResolver = (0, eval)(
        `'use strict';(${workerOptions.uriResolver})`
      );
      editorApi.setURIResolver(resolverWithError2);
    }
    if (workerOptions?.scopes) {
      for (const [scope, value] of Object.entries(workerOptions.scopes)) {
        editorApi.setGlobalScope(scope, value);
      }
    }
    if (workerOptions?.buffers) {
      editorApi.restoreBuffers(workerOptions.buffers);
    }
    const sceneId = await sceneApi.loadFromString(sceneString);
    const exportVideoDuration = options.block ? blockApi.getDuration(options.block) : blockApi.getTotalSceneDuration(sceneApi.get());
    update2();
    const data = await new Promise((resolve, reject) => {
      rejectExport = reject;
      config.abortSignal?.addEventListener("abort", () => {
        reject(new Error("AbortSignal received"));
      });
      ubq.exportVideoToBuffer(
        options.block ?? sceneId,
        options.timeOffset ?? 0,
        options.duration ?? exportVideoDuration,
        MimeType_default.Mp4,
        (renderedFrames, encodedFrames, totalFrames) => {
          queueSize = renderedFrames - encodedFrames;
          lastActivity = Date.now();
          runOptions?.onProgress?.(renderedFrames, encodedFrames, totalFrames);
        },
        (exportResult) => {
          if ("error" in exportResult) {
            reject(exportResult.error);
          } else {
            resolve(exportResult);
          }
        },
        {
          h264Profile: options.h264Profile ?? 77,
          // Main
          h264Level: options.h264Level ?? 52,
          // 5.2
          framerate: options.framerate ?? 30,
          videoBitrate: options.videoBitrate ?? 0,
          audioBitrate: options.audioBitrate ?? 0,
          useTargetSize: options.width !== void 0 && options.height !== void 0,
          targetWidth: options.width ?? 0,
          targetHeight: options.height ?? 0
        }
      );
    });
    const videoData = new Uint8Array(data.byteLength);
    videoData.set(data);
    dispose();
    return videoData;
  } catch (e) {
    dispose();
    throw e;
  }
}
var defaultVisibility = {
  value() {
    if (typeof document === "undefined") {
      return true;
    } else {
      return document.visibilityState === "visible";
    }
  },
  subscribe(handler) {
    if (typeof document === "undefined") {
      return () => {
      };
    } else {
      const handleChange = () => {
        handler(document.visibilityState === "visible");
      };
      document.addEventListener("visibilitychange", handleChange);
      return () => {
        document.removeEventListener("visibilitychange", handleChange);
      };
    }
  }
};

// ../../bindings/wasm/js_web/src/workers/workerTypes.ts
var ExportVideo;
((ExportVideo2) => {
  function start(args) {
    return { ...args, msg: "exportVideo" };
  }
  ExportVideo2.start = start;
  function abort() {
    return { msg: "exportVideoAbort" };
  }
  ExportVideo2.abort = abort;
  function finished(args) {
    return { ...args, msg: "exportVideoFinished" };
  }
  ExportVideo2.finished = finished;
  function error(args) {
    return { ...args, msg: "exportVideoError" };
  }
  ExportVideo2.error = error;
  function progress(args) {
    return { ...args, msg: "exportVideoProgress" };
  }
  ExportVideo2.progress = progress;
  function log(args) {
    return { ...args, msg: "exportLog" };
  }
  ExportVideo2.log = log;
})(ExportVideo || (ExportVideo = {}));

// ../../bindings/wasm/js_web/src/workers/workerHost.ts
if (typeof WorkerGlobalScope !== "undefined") {
  const visibility = makeValueChannel(() => true);
  const exportVideoAbortController = new AbortController();
  self.onmessage = async ({ data }) => {
    const logger = (message, logLevel) => {
      self.postMessage(ExportVideo.log({ logLevel, message }));
    };
    if (data.msg === "setVisibility") {
      visibility.update(data.visible);
    } else if (data.msg === "exportVideo") {
      exportVideo(
        {
          ...data.config,
          logger,
          abortSignal: exportVideoAbortController.signal
        },
        data.engineSettings,
        data.sceneString,
        data.exportOptions,
        data.workerOptions,
        {
          onProgress: (renderedFrames, encodedFrames, totalFrames) => {
            self.postMessage(
              ExportVideo.progress({
                renderedFrames,
                encodedFrames,
                totalFrames
              })
            );
          },
          visibility,
          inactivityTimeout: data.inactivityTimeout
        }
      ).then(
        (videoData) => {
          self.postMessage(
            ExportVideo.finished({ data: videoData, mimeType: MimeType_default.Mp4 })
          );
        },
        (error) => {
          self.postMessage(ExportVideo.error({ error }));
        }
      );
    } else if (data.msg === "exportVideoAbort") {
      exportVideoAbortController.abort();
    }
  };
}
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
//# sourceMappingURL=worker-host-v1.38.0.js.map
