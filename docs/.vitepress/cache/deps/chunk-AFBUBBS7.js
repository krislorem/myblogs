import {
  __commonJS,
  __esm,
  __export
} from "./chunk-KV3LEFFN.js";

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options2) {
      options2 = options2 || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options2.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled2;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled2(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// browser-external:fs
var require_fs = __commonJS({
  "browser-external:fs"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "fs" has been externalized for browser compatibility. Cannot access "fs.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/kolorist/dist/module/index.js
var module_exports = {};
__export(module_exports, {
  ansi256: () => ansi256,
  ansi256Bg: () => ansi256Bg,
  bgBlack: () => bgBlack,
  bgBlue: () => bgBlue,
  bgCyan: () => bgCyan,
  bgGray: () => bgGray,
  bgGreen: () => bgGreen,
  bgLightBlue: () => bgLightBlue,
  bgLightCyan: () => bgLightCyan,
  bgLightGray: () => bgLightGray,
  bgLightGreen: () => bgLightGreen,
  bgLightMagenta: () => bgLightMagenta,
  bgLightRed: () => bgLightRed,
  bgLightYellow: () => bgLightYellow,
  bgMagenta: () => bgMagenta,
  bgRed: () => bgRed,
  bgWhite: () => bgWhite,
  bgYellow: () => bgYellow,
  black: () => black,
  blue: () => blue,
  bold: () => bold,
  cyan: () => cyan,
  dim: () => dim,
  gray: () => gray,
  green: () => green,
  hidden: () => hidden,
  inverse: () => inverse,
  italic: () => italic,
  lightBlue: () => lightBlue,
  lightCyan: () => lightCyan,
  lightGray: () => lightGray,
  lightGreen: () => lightGreen,
  lightMagenta: () => lightMagenta,
  lightRed: () => lightRed,
  lightYellow: () => lightYellow,
  link: () => link,
  magenta: () => magenta,
  options: () => options,
  red: () => red,
  reset: () => reset,
  strikethrough: () => strikethrough,
  stripColors: () => stripColors,
  trueColor: () => trueColor,
  trueColorBg: () => trueColorBg,
  underline: () => underline,
  white: () => white,
  yellow: () => yellow
});
function kolorist(start, end, level) {
  if (level === void 0) {
    level = 1;
  }
  var open = "\x1B[" + start + "m";
  var close = "\x1B[" + end + "m";
  var regex = new RegExp("\\x1b\\[" + end + "m", "g");
  return function(str) {
    return options.enabled && options.supportLevel >= level ? open + ("" + str).replace(regex, open) + close : "" + str;
  };
}
function rgbToAnsi256(r, g, b) {
  if (r >> 4 === g >> 4 && g >> 4 === b >> 4) {
    if (r < 8) {
      return 16;
    }
    if (r > 248) {
      return 231;
    }
    return Math.round((r - 8) / 247 * 24) + 232;
  }
  var ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
  return ansi;
}
function stripColors(str) {
  return ("" + str).replace(/\x1b\[[0-9;]+m/g, "").replace(/\x1b\]8;;.*?\x07(.*?)\x1b\]8;;\x07/g, function(_, group) {
    return group;
  });
}
function link(text, url) {
  return options.enabled ? OSC + "8" + SEP + SEP + url + BEL + text + OSC + "8" + SEP + SEP + BEL : text + " (​" + url + "​)";
}
var enabled, globalVar, supportLevel, _a, FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, COLORTERM, options, reset, bold, dim, italic, underline, inverse, hidden, strikethrough, black, red, green, yellow, blue, magenta, cyan, white, gray, lightGray, lightRed, lightGreen, lightYellow, lightBlue, lightMagenta, lightCyan, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGray, bgLightRed, bgLightGreen, bgLightYellow, bgLightBlue, bgLightMagenta, bgLightCyan, bgLightGray, ansi256, ansi256Bg, trueColor, trueColorBg, OSC, BEL, SEP;
var init_module = __esm({
  "node_modules/kolorist/dist/module/index.js"() {
    enabled = true;
    globalVar = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
    supportLevel = 0;
    if (globalVar.process && globalVar.process.env && globalVar.process.stdout) {
      _a = globalVar.process.env, FORCE_COLOR = _a.FORCE_COLOR, NODE_DISABLE_COLORS = _a.NODE_DISABLE_COLORS, NO_COLOR = _a.NO_COLOR, TERM = _a.TERM, COLORTERM = _a.COLORTERM;
      if (NODE_DISABLE_COLORS || NO_COLOR || FORCE_COLOR === "0") {
        enabled = false;
      } else if (FORCE_COLOR === "1" || FORCE_COLOR === "2" || FORCE_COLOR === "3") {
        enabled = true;
      } else if (TERM === "dumb") {
        enabled = false;
      } else if ("CI" in globalVar.process.env && [
        "TRAVIS",
        "CIRCLECI",
        "APPVEYOR",
        "GITLAB_CI",
        "GITHUB_ACTIONS",
        "BUILDKITE",
        "DRONE"
      ].some(function(vendor) {
        return vendor in globalVar.process.env;
      })) {
        enabled = true;
      } else {
        enabled = process.stdout.isTTY;
      }
      if (enabled) {
        if (process.platform === "win32") {
          supportLevel = 3;
        } else {
          if (COLORTERM && (COLORTERM === "truecolor" || COLORTERM === "24bit")) {
            supportLevel = 3;
          } else if (TERM && (TERM.endsWith("-256color") || TERM.endsWith("256"))) {
            supportLevel = 2;
          } else {
            supportLevel = 1;
          }
        }
      }
    }
    options = {
      enabled,
      supportLevel
    };
    reset = kolorist(0, 0);
    bold = kolorist(1, 22);
    dim = kolorist(2, 22);
    italic = kolorist(3, 23);
    underline = kolorist(4, 24);
    inverse = kolorist(7, 27);
    hidden = kolorist(8, 28);
    strikethrough = kolorist(9, 29);
    black = kolorist(30, 39);
    red = kolorist(31, 39);
    green = kolorist(32, 39);
    yellow = kolorist(33, 39);
    blue = kolorist(34, 39);
    magenta = kolorist(35, 39);
    cyan = kolorist(36, 39);
    white = kolorist(97, 39);
    gray = kolorist(90, 39);
    lightGray = kolorist(37, 39);
    lightRed = kolorist(91, 39);
    lightGreen = kolorist(92, 39);
    lightYellow = kolorist(93, 39);
    lightBlue = kolorist(94, 39);
    lightMagenta = kolorist(95, 39);
    lightCyan = kolorist(96, 39);
    bgBlack = kolorist(40, 49);
    bgRed = kolorist(41, 49);
    bgGreen = kolorist(42, 49);
    bgYellow = kolorist(43, 49);
    bgBlue = kolorist(44, 49);
    bgMagenta = kolorist(45, 49);
    bgCyan = kolorist(46, 49);
    bgWhite = kolorist(107, 49);
    bgGray = kolorist(100, 49);
    bgLightRed = kolorist(101, 49);
    bgLightGreen = kolorist(102, 49);
    bgLightYellow = kolorist(103, 49);
    bgLightBlue = kolorist(104, 49);
    bgLightMagenta = kolorist(105, 49);
    bgLightCyan = kolorist(106, 49);
    bgLightGray = kolorist(47, 49);
    ansi256 = function(n) {
      return kolorist(
        "38;5;" + n,
        0,
        2
        /* ansi256 */
      );
    };
    ansi256Bg = function(n) {
      return kolorist(
        "48;5;" + n,
        0,
        2
        /* ansi256 */
      );
    };
    trueColor = function(r, g, b) {
      return options.supportLevel === 2 ? ansi256(rgbToAnsi256(r, g, b)) : kolorist(
        "38;2;" + r + ";" + g + ";" + b,
        0,
        3
        /* trueColor */
      );
    };
    trueColorBg = function(r, g, b) {
      return options.supportLevel === 2 ? ansi256Bg(rgbToAnsi256(r, g, b)) : kolorist(
        "48;2;" + r + ";" + g + ";" + b,
        0,
        3
        /* trueColor */
      );
    };
    OSC = "\x1B]";
    BEL = "\x07";
    SEP = ";";
  }
});

// browser-external:node:path
var require_node_path = __commonJS({
  "browser-external:node:path"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:path" has been externalized for browser compatibility. Cannot access "node:path.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:fs
var require_node_fs = __commonJS({
  "browser-external:node:fs"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:fs" has been externalized for browser compatibility. Cannot access "node:fs.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:fs/promises
var require_promises = __commonJS({
  "browser-external:node:fs/promises"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:fs/promises" has been externalized for browser compatibility. Cannot access "node:fs/promises.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:process
var require_node_process = __commonJS({
  "browser-external:node:process"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:process" has been externalized for browser compatibility. Cannot access "node:process.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:module
var require_node_module = __commonJS({
  "browser-external:node:module"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:module" has been externalized for browser compatibility. Cannot access "node:module.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:url
var require_node_url = __commonJS({
  "browser-external:node:url"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:url" has been externalized for browser compatibility. Cannot access "node:url.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:assert
var require_node_assert = __commonJS({
  "browser-external:node:assert"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:assert" has been externalized for browser compatibility. Cannot access "node:assert.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:v8
var require_node_v8 = __commonJS({
  "browser-external:node:v8"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:v8" has been externalized for browser compatibility. Cannot access "node:v8.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:node:util
var require_node_util = __commonJS({
  "browser-external:node:util"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "node:util" has been externalized for browser compatibility. Cannot access "node:util.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:process
var require_process = __commonJS({
  "browser-external:process"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "process" has been externalized for browser compatibility. Cannot access "process.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:path
var require_path = __commonJS({
  "browser-external:path"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "path" has been externalized for browser compatibility. Cannot access "path.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:child_process
var require_child_process = __commonJS({
  "browser-external:child_process"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "child_process" has been externalized for browser compatibility. Cannot access "child_process.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:stream
var require_stream = __commonJS({
  "browser-external:stream"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "stream" has been externalized for browser compatibility. Cannot access "stream.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:readline
var require_readline = __commonJS({
  "browser-external:readline"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "readline" has been externalized for browser compatibility. Cannot access "readline.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

export {
  require_browser,
  require_fs,
  require_node_path,
  require_node_fs,
  require_promises,
  require_node_process,
  require_node_module,
  require_node_url,
  require_node_assert,
  require_node_v8,
  require_node_util,
  require_process,
  require_path,
  require_child_process,
  require_stream,
  require_readline,
  yellow,
  cyan,
  module_exports,
  init_module
};
//# sourceMappingURL=chunk-AFBUBBS7.js.map
