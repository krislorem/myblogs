import {
  cyan,
  init_module,
  require_browser,
  require_child_process,
  require_fs,
  require_node_assert,
  require_node_fs,
  require_node_module,
  require_node_path,
  require_node_process,
  require_node_url,
  require_node_util,
  require_node_v8,
  require_path,
  require_process,
  require_promises,
  require_readline,
  require_stream,
  yellow
} from "./chunk-AFBUBBS7.js";
import {
  joinURL
} from "./chunk-FWCCGZMU.js";
import {
  __publicField,
  __toESM
} from "./chunk-KV3LEFFN.js";

// node_modules/@iconify/utils/lib/icon/defaults.mjs
var defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
var defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
var defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
var defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});

// node_modules/@iconify/utils/lib/customisations/defaults.mjs
var defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
var defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});

// node_modules/@iconify/utils/lib/svg/size.mjs
var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
var unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}

// node_modules/@iconify/utils/lib/svg/defs.mjs
function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}

// node_modules/@iconify/utils/lib/svg/build.mjs
var isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}

// node_modules/@iconify/utils/lib/icon/transformations.mjs
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}

// node_modules/@iconify/utils/lib/icon/merge.mjs
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}

// node_modules/@iconify/utils/lib/icon-set/tree.mjs
function getIconsTree(data2, names) {
  const icons = data2.icons;
  const aliases = data2.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve3(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve3(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve3);
  return resolved;
}

// node_modules/@iconify/utils/lib/icon-set/get-icon.mjs
function internalGetIconData(data2, name, tree) {
  const icons = data2.icons;
  const aliases = data2.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse4(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse4(name);
  tree.forEach(parse4);
  return mergeIconData(data2, currentProps);
}
function getIconData(data2, name) {
  if (data2.icons[name]) {
    return internalGetIconData(data2, name, []);
  }
  const tree = getIconsTree(data2, [name])[name];
  return tree ? internalGetIconData(data2, name, tree) : null;
}

// node_modules/@iconify/utils/lib/loader/utils.mjs
var svgWidthRegex = /\swidth\s*=\s*["']([\w.]+)["']/;
var svgHeightRegex = /\sheight\s*=\s*["']([\w.]+)["']/;
var svgTagRegex = /<svg\s+/;
function configureSvgSize(svg, props, scale) {
  const svgNode = svg.slice(0, svg.indexOf(">"));
  const check = (prop, regex) => {
    const result = regex.exec(svgNode);
    const isSet = result != null;
    const propValue = props[prop];
    if (!propValue && !isUnsetKeyword(propValue)) {
      if (typeof scale === "number") {
        if (scale > 0) {
          props[prop] = calculateSize(
            // Base on result from iconToSVG() or 1em
            (result == null ? void 0 : result[1]) ?? "1em",
            scale
          );
        }
      } else if (result) {
        props[prop] = result[1];
      }
    }
    return isSet;
  };
  return [check("width", svgWidthRegex), check("height", svgHeightRegex)];
}
async function mergeIconProps(svg, collection, icon, options, propsProvider, afterCustomizations) {
  const { scale, addXmlNs = false } = options ?? {};
  const { additionalProps = {}, iconCustomizer } = (options == null ? void 0 : options.customizations) ?? {};
  const props = await (propsProvider == null ? void 0 : propsProvider()) ?? {};
  await (iconCustomizer == null ? void 0 : iconCustomizer(collection, icon, props));
  Object.keys(additionalProps).forEach((p) => {
    const v2 = additionalProps[p];
    if (v2 !== void 0 && v2 !== null)
      props[p] = v2;
  });
  afterCustomizations == null ? void 0 : afterCustomizations(props);
  const [widthOnSvg, heightOnSvg] = configureSvgSize(svg, props, scale);
  if (addXmlNs) {
    if (!svg.includes("xmlns=") && !props["xmlns"]) {
      props["xmlns"] = "http://www.w3.org/2000/svg";
    }
    if (!svg.includes("xmlns:xlink=") && svg.includes("xlink:") && !props["xmlns:xlink"]) {
      props["xmlns:xlink"] = "http://www.w3.org/1999/xlink";
    }
  }
  const propsToAdd = Object.keys(props).map(
    (p) => p === "width" && widthOnSvg || p === "height" && heightOnSvg ? null : `${p}="${props[p]}"`
  ).filter((p) => p != null);
  if (propsToAdd.length) {
    svg = svg.replace(svgTagRegex, `<svg ${propsToAdd.join(" ")} `);
  }
  if (options) {
    const { defaultStyle, defaultClass } = options;
    if (defaultClass && !svg.includes("class=")) {
      svg = svg.replace(svgTagRegex, `<svg class="${defaultClass}" `);
    }
    if (defaultStyle && !svg.includes("style=")) {
      svg = svg.replace(svgTagRegex, `<svg style="${defaultStyle}" `);
    }
  }
  const usedProps = options == null ? void 0 : options.usedProps;
  if (usedProps) {
    Object.keys(additionalProps).forEach((p) => {
      const v2 = props[p];
      if (v2 !== void 0 && v2 !== null)
        usedProps[p] = v2;
    });
    if (typeof props.width !== "undefined" && props.width !== null) {
      usedProps.width = props.width;
    }
    if (typeof props.height !== "undefined" && props.height !== null) {
      usedProps.height = props.height;
    }
  }
  return svg;
}
function getPossibleIconNames(icon) {
  return [
    icon,
    icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    icon.replace(/([a-z])(\d+)/g, "$1-$2")
  ];
}

// node_modules/@iconify/utils/lib/loader/modern.mjs
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("@iconify-loader:icon");
async function searchForIcon(iconSet, collection, ids, options) {
  let iconData;
  const { customize } = (options == null ? void 0 : options.customizations) ?? {};
  for (const id of ids) {
    iconData = getIconData(iconSet, id);
    if (iconData) {
      debug(`${collection}:${id}`);
      let defaultCustomizations = {
        ...defaultIconCustomisations
      };
      if (typeof customize === "function") {
        iconData = Object.assign({}, iconData);
        defaultCustomizations = customize(
          defaultCustomizations,
          iconData,
          `${collection}:${id}`
        ) ?? defaultCustomizations;
      }
      const {
        attributes: { width, height, ...restAttributes },
        body
      } = iconToSVG(iconData, defaultCustomizations);
      const scale = options == null ? void 0 : options.scale;
      return await mergeIconProps(
        // DON'T remove space on <svg >
        `<svg >${body}</svg>`,
        collection,
        id,
        options,
        () => {
          return { ...restAttributes };
        },
        (props) => {
          const check = (prop, defaultValue) => {
            const propValue = props[prop];
            let value;
            if (!isUnsetKeyword(propValue)) {
              if (propValue) {
                return;
              }
              if (typeof scale === "number") {
                if (scale) {
                  value = calculateSize(
                    // Base on result from iconToSVG() or 1em
                    defaultValue ?? "1em",
                    scale
                  );
                }
              } else {
                value = defaultValue;
              }
            }
            if (!value) {
              delete props[prop];
            } else {
              props[prop] = value;
            }
          };
          check("width", width);
          check("height", height);
        }
      );
    }
  }
}

// node_modules/@iconify/utils/lib/loader/fs.mjs
var import_fs2 = __toESM(require_fs(), 1);

// node_modules/local-pkg/dist/index.mjs
var import_node_path2 = __toESM(require_node_path(), 1);
var import_node_fs3 = __toESM(require_node_fs(), 1);
var import_promises = __toESM(require_promises(), 1);
var import_node_process2 = __toESM(require_node_process(), 1);

// node_modules/acorn/dist/acorn.mjs
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];
var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛࢘-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟊꟐꟑꟓꟕ-ꟙꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code, set) {
  var pos = 65536;
  for (var i2 = 0; i2 < set.length; i2 += 2) {
    pos += set[i2];
    if (pos > code) {
      return false;
    }
    pos += set[i2 + 1];
    if (pos >= code) {
      return true;
    }
  }
  return false;
}
function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
var TokenType = function TokenType2(label, conf) {
  if (conf === void 0) conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true };
var startsExpr = { startsExpr: true };
var keywords = {};
function kw(name, options) {
  if (options === void 0) options = {};
  options.keyword = name;
  return keywords[name] = new TokenType(name, options);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
  return code === 10 || code === 13 || code === 8232 || code === 8233;
}
function nextLineBreak(code, from, end) {
  if (end === void 0) end = code.length;
  for (var i2 = from; i2 < end; i2++) {
    var next = code.charCodeAt(i2);
    if (isNewLine(next)) {
      return i2 < end - 1 && next === 13 && code.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
    }
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;
var hasOwn = Object.hasOwn || function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
};
var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === "[object Array]";
};
var regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code) {
  if (code <= 65535) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = function Position2(line, col) {
  this.line = line;
  this.column = col;
};
Position.prototype.offset = function offset(n) {
  return new Position(this.line, this.column + n);
};
var SourceLocation = function SourceLocation2(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
};
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset2);
    if (nextBreak < 0) {
      return new Position(line, offset2 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: false,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: true,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (!opts || opts.allowHashBang == null) {
    options.allowHashBang = options.ecmaVersion >= 14;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start,
      end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
var SCOPE_TOP = 1;
var SCOPE_FUNCTION = 2;
var SCOPE_ASYNC = 4;
var SCOPE_GENERATOR = 8;
var SCOPE_ARROW = 16;
var SCOPE_SIMPLE_CATCH = 32;
var SCOPE_SUPER = 64;
var SCOPE_DIRECT_SUPER = 128;
var SCOPE_CLASS_STATIC_BLOCK = 256;
var SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0;
var BIND_VAR = 1;
var BIND_LEXICAL = 2;
var BIND_FUNCTION = 3;
var BIND_SIMPLE_CATCH = 4;
var BIND_OUTSIDE = 5;
var Parser = function Parser2(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") {
      reserved += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);
  this.containsEsc = false;
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }
  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = /* @__PURE__ */ Object.create(null);
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);
  this.regexpState = null;
  this.privateNameStack = [];
};
var prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
Parser.prototype.parse = function parse() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit;
};
prototypeAccessors.canAwait.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) {
      return false;
    }
    if (scope.flags & SCOPE_FUNCTION) {
      return (scope.flags & SCOPE_ASYNC) > 0;
    }
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  var inClassFieldInit = ref2.inClassFieldInit;
  return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  var inClassFieldInit = ref2.inClassFieldInit;
  return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function extend() {
  var plugins = [], len = arguments.length;
  while (len--) plugins[len] = arguments[len];
  var cls = this;
  for (var i2 = 0; i2 < plugins.length; i2++) {
    cls = plugins[i2](cls);
  }
  return cls;
};
Parser.parse = function parse2(input, options) {
  return new this(options, input).parse();
};
Parser.parseExpressionAt = function parseExpressionAt(input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression();
};
Parser.tokenizer = function tokenizer(input, options) {
  return new this(options, input);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) {
    return false;
  }
  for (; ; ) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
    }
    start += match[0].length;
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";") {
      start++;
    }
  }
};
pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc;
};
pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};
pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = function DestructuringErrors2() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node) {
  var exports = /* @__PURE__ */ Object.create(null);
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule) {
    for (var i2 = 0, list = Object.keys(this.undefinedExports); i2 < list.length; i2 += 1) {
      var name = list[i2];
      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program");
};
var loopLabel = { kind: "loop" };
var switchLabel = { kind: "switch" };
pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
  if (nextCh === 91 || nextCh === 92) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123 || nextCh > 55295 && nextCh < 56320) {
    return true;
  }
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
      return true;
    }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 55295 && after < 56320));
};
pp$8.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }
  switch (starttype) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(node);
    case types$1._do:
      return this.parseDoStatement(node);
    case types$1._for:
      return this.parseForStatement(node);
    case types$1._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false, !context);
    case types$1._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types$1._if:
      return this.parseIfStatement(node);
    case types$1._return:
      return this.parseReturnStatement(node);
    case types$1._switch:
      return this.parseSwitchStatement(node);
    case types$1._throw:
      return this.parseThrowStatement(node);
    case types$1._try:
      return this.parseTryStatement(node);
    case types$1._const:
    case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types$1._while:
      return this.parseWhileStatement(node);
    case types$1._with:
      return this.parseWithStatement(node);
    case types$1.braceL:
      return this.parseBlock(true, node);
    case types$1.semi:
      return this.parseEmptyStatement(node);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports);
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true, !context);
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};
pp$8.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types$1.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }
  var i2 = 0;
  for (; i2 < this.labels.length; ++i2) {
    var lab = this.labels[i2];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i2 === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types$1.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};
pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
        } else {
          node.await = awaitAt > -1;
        }
      }
      return this.parseForIn(node, init$1);
    }
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init$1);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var containsEsc = this.containsEsc;
  var refDestructuringErrors = new DestructuringErrors();
  var initPos = this.start;
  var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (awaitAt > -1) {
      if (this.type === types$1._in) {
        this.unexpected(awaitAt);
      }
      node.await = true;
    } else if (isForOf && this.options.ecmaVersion >= 8) {
      if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") {
        this.unexpected();
      } else if (this.options.ecmaVersion >= 9) {
        node.await = false;
      }
    }
    if (startsWithLet && isForOf) {
      this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};
pp$8.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);
  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; ) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom();
  var simple = param.type === "Identifier";
  this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);
  return param;
};
pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseCatchClauseParam();
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};
pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};
pp$8.parseWithStatement = function(node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};
pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1) {
    var label = list[i$1];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i2 = this.labels.length - 1; i2 >= 0; i2--) {
    var label$1 = this.labels[i2];
    if (label$1.statementStart === node.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind, statementStart: this.start });
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;
  if (node === void 0) node = this.startNode();
  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node, "BlockStatement");
};
pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};
pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(
      init.start,
      (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
    );
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) {
      break;
    }
  }
  return node;
};
pp$8.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1;
var FUNC_HANGING_STATEMENT = 2;
var FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node.id = this.type === types$1.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) {
          this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) {
    return null;
  }
  var ecmaVersion = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;
  if (this.eatContextual("static")) {
    if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node;
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }
  if (keyName) {
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }
  if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    if (isConstructor && kind !== "method") {
      this.raise(node.key.start, "Constructor can't have get/set modifier");
    }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }
  return node;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};
pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  if (method.kind === "get" && value.params.length !== 0) {
    this.raiseRecoverable(value.start, "getter should have no params");
  }
  if (method.kind === "set" && value.params.length !== 1) {
    this.raiseRecoverable(value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && value.params[0].type === "RestElement") {
    this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
  }
  return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }
  if (this.eat(types$1.eq)) {
    var scope = this.currentThisScope();
    var inClassFieldInit = scope.inClassFieldInit;
    scope.inClassFieldInit = true;
    field.value = this.parseMaybeAssign();
    scope.inClassFieldInit = inClassFieldInit;
  } else {
    field.value = null;
  }
  this.semicolon();
  return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node) {
  node.body = [];
  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;
  return this.finishNode(node, "StaticBlock");
};
pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement) {
      this.checkLValSimple(node.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node.id = null;
  }
};
pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};
pp$8.enterClassBody = function() {
  var element = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  this.privateNameStack.push(element);
  return element.declared;
};
pp$8.exitClassBody = function() {
  var ref2 = this.privateNameStack.pop();
  var declared = ref2.declared;
  var used = ref2.used;
  if (!this.options.checkPrivateFields) {
    return;
  }
  var len = this.privateNameStack.length;
  var parent = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i2 = 0; i2 < used.length; ++i2) {
    var id = used[i2];
    if (!hasOwn(declared, id.name)) {
      if (parent) {
        parent.used.push(id);
      } else {
        this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
      }
    }
  }
};
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];
  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
pp$8.parseExportAllDeclaration = function(node, exports) {
  if (this.options.ecmaVersion >= 11) {
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports, node.exported, this.lastTokStart);
    } else {
      node.exported = null;
    }
  }
  this.expectContextual("from");
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.source = this.parseExprAtom();
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration");
};
pp$8.parseExport = function(node, exports) {
  this.next();
  if (this.eat(types$1.star)) {
    return this.parseExportAllDeclaration(node, exports);
  }
  if (this.eat(types$1._default)) {
    this.checkExport(exports, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports, node.declaration.declarations);
    } else {
      this.checkExport(exports, node.declaration.id, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
    } else {
      for (var i2 = 0, list = node.specifiers; i2 < list.length; i2 += 1) {
        var spec = list[i2];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }
      node.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(node) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    if (isAsync) {
      this.next();
    }
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
  } else if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID");
  } else {
    var declaration = this.parseMaybeAssign();
    this.semicolon();
    return declaration;
  }
};
pp$8.checkExport = function(exports, name, pos) {
  if (!exports) {
    return;
  }
  if (typeof name !== "string") {
    name = name.type === "Identifier" ? name.name : name.value;
  }
  if (hasOwn(exports, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports[name] = true;
};
pp$8.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports, pat, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i2 = 0, list = pat.properties; i2 < list.length; i2 += 1) {
      var prop = list[i2];
      this.checkPatternExport(exports, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];
      if (elt) {
        this.checkPatternExport(exports, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports, pat.argument);
  }
};
pp$8.checkVariableExport = function(exports, decls) {
  if (!exports) {
    return;
  }
  for (var i2 = 0, list = decls; i2 < list.length; i2 += 1) {
    var decl = list[i2];
    this.checkPatternExport(exports, decl.id);
  }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(exports) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();
  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(
    exports,
    node.exported,
    node.exported.start
  );
  return this.finishNode(node, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseExportSpecifier(exports));
  }
  return nodes;
};
pp$8.parseImport = function(node) {
  this.next();
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();
  if (this.eatContextual("as")) {
    node.local = this.parseIdent();
  } else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) {
      return nodes;
    }
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseImportSpecifier());
  }
  return nodes;
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral;
  }
  return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2) {
    statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
  (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i2 = 0, list = node.properties; i2 < list.length; i2 += 1) {
          var prop = list[i2];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};
pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i2 = 0; i2 < end; i2++) {
    var elt = exprList[i2];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
    this.unexpected();
  }
  node.argument = this.parseBindingAtom();
  return this.finishNode(node, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types$1.comma);
    }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      elts.push(this.parseAssignableListItem(allowModifiers));
    }
  }
  return elts;
};
pp$7.parseAssignableListItem = function(allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem;
};
pp$7.parseBindingListItem = function(param) {
  return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  var isBind = bindingType !== BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let") {
          this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
        }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name)) {
            this.raiseRecoverable(expr.start, "Argument name clash");
          }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) {
          this.declareName(expr.name, bindingType, expr.start);
        }
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ParenthesizedExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding parenthesized expression");
      }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes);
    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "ObjectPattern":
      for (var i2 = 0, list = expr.properties; i2 < list.length; i2 += 1) {
        var prop = list[i2];
        this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break;
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
        if (elem) {
          this.checkLValInnerPattern(elem, bindingType, checkClashes);
        }
      }
      break;
    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
  }
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "Property":
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break;
    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
  }
};
var TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};
var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [types.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types.f_expr || parent === types.f_stat) {
    return true;
  }
  if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr)) {
    return !parent.isExpr;
  }
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
    return true;
  }
  if (prevType === types$1.braceL) {
    return parent === types.b_stat;
  }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
    var context = this.context[i2];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) {
    this.context.push(types.f_expr);
  } else {
    this.context.push(types.f_stat);
  }
  this.exprAllowed = false;
};
types$1.colon.updateContext = function() {
  if (this.curContext().token === "function") {
    this.context.pop();
  }
  this.exprAllowed = true;
};
types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types.q_tmpl);
  }
  this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr) {
      this.context[index] = types.f_expr_gen;
    } else {
      this.context[index] = types.f_gen;
    }
  }
  this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;
      break;
    case "Literal":
      name = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types$1.comma)) {
      node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
    }
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(forInit);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq) {
      left = this.toAssignable(left, false, refDestructuringErrors);
    }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    if (this.type === types$1.eq) {
      this.checkLValPattern(left);
    } else {
      this.checkLValSimple(left);
    }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) {
      refDestructuringErrors.doubleProto = oldDoubleProto;
    }
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
    }
  }
  return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") {
    this.raise(right.start, "Private identifier can only be left side of binary expression");
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLValSimple(node.argument);
    } else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Private fields can not be deleted");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) {
      this.unexpected();
    }
    expr = this.parsePrivateIdent();
    if (this.type !== types$1._in) {
      this.unexpected();
    }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary) {
      this.unexpected(this.lastTokStart);
    } else {
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
    }
  } else {
    return expr;
  }
};
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
    if (refDestructuringErrors.trailingComma >= result.start) {
      refDestructuringErrors.trailingComma = -1;
    }
  }
  return result;
};
pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
  var optionalChained = false;
  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
    if (element.optional) {
      optionalChained = true;
    }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }
    base = element;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};
pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types$1.bracketL);
  if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({ isTagged: true });
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  if (this.type === types$1.slash) {
    this.readRegexp();
  }
  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper) {
        this.raise(node.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");
    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");
    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit);
        }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit);
        }
      }
      return id;
    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = { pattern: value.pattern, flags: value.flags };
      return node;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");
    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;
    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");
    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors);
    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), false);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport(forNew);
      } else {
        return this.unexpected();
      }
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(forNew) {
  var node = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  this.next();
  if (this.type === types$1.parenL && !forNew) {
    return this.parseDynamicImport(node);
  } else if (this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "import";
    node.meta = this.finishNode(meta, "Identifier");
    return this.parseImportMeta(node);
  } else {
    this.unexpected();
  }
};
pp$5.parseDynamicImport = function(node) {
  this.next();
  node.source = this.parseMaybeAssign();
  if (!this.eat(types$1.parenR)) {
    var errorPos = this.start;
    if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
      this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
    } else {
      this.unexpected(errorPos);
    }
  }
  return this.finishNode(node, "ImportExpression");
};
pp$5.parseImportMeta = function(node) {
  this.next();
  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);
  if (node.property.name !== "meta") {
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node, "MetaProperty");
};
pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
    node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};
pp$5.shouldParseArrow = function(exprList) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raiseRecoverable(
            this.start,
            "Comma is not permitted after the rest element"
          );
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);
    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$5.parseParenItem = function(item) {
  return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "new";
    node.meta = this.finishNode(meta, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target") {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    }
    if (!this.allowNewDotTarget) {
      this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  if (this.eat(types$1.parenL)) {
    node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty;
  }
  return this.finishNode(node, "NewExpression");
};
pp$5.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value.replace(/\r\n?/g, "\n"),
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref2) {
  if (ref2 === void 0) ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0) isTagged = false;
  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged });
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types$1.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$5.parseGetterSetter = function(prop) {
  prop.kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start = prop.value.start;
    if (prop.kind === "get") {
      this.raiseRecoverable(start, "getter should have no params");
    } else {
      this.raiseRecoverable(start, "setter should have exactly one param");
    }
  } else {
    if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
      this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    }
  }
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon) {
    this.unexpected();
  }
  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    prop.kind = "init";
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};
pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    if (this.strict && node.id) {
      this.checkLValSimple(node.id, BIND_OUTSIDE);
    }
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
  for (var i2 = 0, list = params; i2 < list.length; i2 += 1) {
    var param = list[i2];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash = /* @__PURE__ */ Object.create(null);
  for (var i2 = 0, list = node.params; i2 < list.length; i2 += 1) {
    var param = list[i2];
    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) {
      elt = null;
    } else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$5.checkUnreserved = function(ref2) {
  var start = ref2.start;
  var end = ref2.end;
  var name = ref2.name;
  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  }
  if (this.currentThisScope().inClassFieldInit && name === "arguments") {
    this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
  }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await")) {
    this.raise(start, "Cannot use " + name + " in class static initialization block");
  }
  if (this.keywords.test(name)) {
    this.raise(start, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
    return;
  }
  var re2 = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re2.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};
pp$5.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node.start;
    }
  }
  return node;
};
pp$5.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
    this.type = types$1.name;
  } else {
    this.unexpected();
  }
  return node;
};
pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");
  if (this.options.checkPrivateFields) {
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }
  }
  return node;
};
pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$3 = Parser.prototype;
var Scope = function Scope2(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
  this.inClassFieldInit = false;
};
pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && scope.flags & SCOPE_TOP) {
      delete this.undefinedExports[name];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    }
    scope$2.functions.push(name);
  } else {
    for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
      var scope$3 = this.scopeStack[i2];
      if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  }
};
pp$3.checkLocalExport = function(id) {
  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
    this.undefinedExports[id.name] = id;
  }
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & SCOPE_VAR) {
      return scope;
    }
  }
};
pp$3.currentThisScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) {
      return scope;
    }
  }
};
var Node = function Node2(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) {
    this.loc = new SourceLocation(parser, loc);
  }
  if (parser.options.directSourceFile) {
    this.sourceFile = parser.options.directSourceFile;
  }
  if (parser.options.ranges) {
    this.range = [pos, 0];
  }
};
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) {
    newNode[prop] = node[prop];
  }
  return newNode;
};
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " Hrkt Katakana_Or_Hiragana Kawi Nag_Mundari Nagm Unknown Zzzz";
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion) {
  var d2 = data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  };
  d2.nonBinary.Script_Extensions = d2.nonBinary.Script;
  d2.nonBinary.gc = d2.nonBinary.General_Category;
  d2.nonBinary.sc = d2.nonBinary.Script;
  d2.nonBinary.scx = d2.nonBinary.Script_Extensions;
}
for (i2 = 0, list = [9, 10, 11, 12, 13, 14]; i2 < list.length; i2 += 1) {
  ecmaVersion = list[i2];
  buildUnicodeData(ecmaVersion);
}
var ecmaVersion;
var i2;
var list;
var pp$1 = Parser.prototype;
var BranchID = function BranchID2(parent, base) {
  this.parent = parent;
  this.base = base || this;
};
BranchID.prototype.separatedFrom = function separatedFrom(alt) {
  for (var self = this; self; self = self.parent) {
    for (var other = alt; other; other = other.parent) {
      if (self.base === other.base && self !== other) {
        return true;
      }
    }
  }
  return false;
};
BranchID.prototype.sibling = function sibling() {
  return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function RegExpValidationState2(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = /* @__PURE__ */ Object.create(null);
  this.backReferenceNames = [];
  this.branchID = null;
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
  var unicodeSets = flags.indexOf("v") !== -1;
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
};
RegExpValidationState.prototype.raise = function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s2 = this.source;
  var l3 = s2.length;
  if (i2 >= l3) {
    return -1;
  }
  var c = s2.charCodeAt(i2);
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l3) {
    return c;
  }
  var next = s2.charCodeAt(i2 + 1);
  return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s2 = this.source;
  var l3 = s2.length;
  if (i2 >= l3) {
    return l3;
  }
  var c = s2.charCodeAt(i2), next;
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l3 || (next = s2.charCodeAt(i2 + 1)) < 56320 || next > 57343) {
    return i2 + 1;
  }
  return i2 + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance(forceU) {
  if (forceU === void 0) forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch, forceU) {
  if (forceU === void 0) forceU = false;
  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
};
RegExpValidationState.prototype.eatChars = function eatChars(chs, forceU) {
  if (forceU === void 0) forceU = false;
  var pos = this.pos;
  for (var i2 = 0, list = chs; i2 < list.length; i2 += 1) {
    var ch = list[i2];
    var current2 = this.at(pos, forceU);
    if (current2 === -1 || current2 !== ch) {
      return false;
    }
    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true;
};
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  var u2 = false;
  var v2 = false;
  for (var i2 = 0; i2 < flags.length; i2++) {
    var flag = flags.charAt(i2);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i2 + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
    if (flag === "u") {
      u2 = true;
    }
    if (flag === "v") {
      v2 = true;
    }
  }
  if (this.options.ecmaVersion >= 15 && u2 && v2) {
    this.raise(state.start, "Invalid regular expression flag");
  }
};
function hasProp(obj) {
  for (var _3 in obj) {
    return true;
  }
  return false;
}
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames = /* @__PURE__ */ Object.create(null);
  state.backReferenceNames.length = 0;
  state.branchID = null;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(
      41
      /* ) */
    )) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(
      93
      /* ] */
    ) || state.eat(
      125
      /* } */
    )) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i2 = 0, list = state.backReferenceNames; i2 < list.length; i2 += 1) {
    var name = list[i2];
    if (!state.groupNames[name]) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$1.regexp_disjunction = function(state) {
  var trackDisjunction = this.options.ecmaVersion >= 16;
  if (trackDisjunction) {
    state.branchID = new BranchID(state.branchID, null);
  }
  this.regexp_alternative(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (trackDisjunction) {
      state.branchID = state.branchID.sibling();
    }
    this.regexp_alternative(state);
  }
  if (trackDisjunction) {
    state.branchID = state.branchID.parent;
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(
    123
    /* { */
  )) {
    state.raise("Lone quantifier brackets");
  }
};
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(
    94
    /* ^ */
  ) || state.eat(
    36
    /* $ */
  )) {
    return true;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    if (state.eat(
      66
      /* B */
    ) || state.eat(
      98
      /* b */
    )) {
      return true;
    }
    state.pos = start;
  }
  if (state.eat(
    40
    /* ( */
  ) && state.eat(
    63
    /* ? */
  )) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(
        60
        /* < */
      );
    }
    if (state.eat(
      61
      /* = */
    ) || state.eat(
      33
      /* ! */
    )) {
      this.regexp_disjunction(state);
      if (!state.eat(
        41
        /* ) */
      )) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start;
  return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0) noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(
      63
      /* ? */
    );
    return true;
  }
  return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(
    42
    /* * */
  ) || state.eat(
    43
    /* + */
  ) || state.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(
    123
    /* { */
  )) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(
        44
        /* , */
      ) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(
        125
        /* } */
      )) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(
    40
    /* ( */
  )) {
    if (state.eat(
      63
      /* ? */
    ) && state.eat(
      58
      /* : */
    )) {
      this.regexp_disjunction(state);
      if (state.eat(
        41
        /* ) */
      )) {
        return true;
      }
      state.raise("Unterminated group");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(
      41
      /* ) */
    )) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$1.regexp_eatExtendedAtom = function(state) {
  return state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(
    63
    /* ? */
  )) {
    if (!this.regexp_eatGroupName(state)) {
      state.raise("Invalid group");
    }
    var trackDisjunction = this.options.ecmaVersion >= 16;
    var known = state.groupNames[state.lastStringValue];
    if (known) {
      if (trackDisjunction) {
        for (var i2 = 0, list = known; i2 < list.length; i2 += 1) {
          var altID = list[i2];
          if (!altID.separatedFrom(state.branchID)) {
            state.raise("Duplicate capture group name");
          }
        }
      } else {
        state.raise("Duplicate capture group name");
      }
    }
    if (trackDisjunction) {
      (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
    } else {
      state.groupNames[state.lastStringValue] = true;
    }
  }
};
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
      62
      /* > */
    )) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
pp$1.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true;
    }
    if (n <= state.numCapturingParens) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0) forceU = false;
  var start = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(
          92
          /* \ */
        ) && state.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(state) && state.eat(
      125
      /* } */
    ) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }
  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(
      47
      /* / */
    )) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch = state.current();
  if (ch !== 99 && (!state.switchN || ch !== 107)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 49 && ch <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
      state.advance();
    } while ((ch = state.current()) >= 48 && ch <= 57);
    return true;
  }
  return false;
};
var CharSetNone = 0;
var CharSetOk = 1;
var CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();
  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk;
  }
  var negate = false;
  if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (state.eat(
      123
      /* { */
    ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
      125
      /* } */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Invalid property name");
      }
      return result;
    }
    state.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(
    61
    /* = */
  )) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return CharSetOk;
    }
  }
  state.pos = start;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name].test(value)) {
    state.raise("Invalid property value");
  }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) {
    return CharSetOk;
  }
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) {
    return CharSetString;
  }
  state.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (!state.eat(
      93
      /* ] */
    )) {
      state.raise("Unterminated character class");
    }
    if (negate && result === CharSetString) {
      state.raise("Negated character class may contain strings");
    }
    return true;
  }
  return false;
};
pp$1.regexp_classContents = function(state) {
  if (state.current() === 93) {
    return CharSetOk;
  }
  if (state.switchV) {
    return this.regexp_classSetExpression(state);
  }
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk;
};
pp$1.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  var ch = state.current();
  if (ch !== 93) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    98
    /* b */
  )) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(
    45
    /* - */
  )) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_classSetExpression = function(state) {
  var result = CharSetOk, subResult;
  if (this.regexp_eatClassSetRange(state)) ;
  else if (subResult = this.regexp_eatClassSetOperand(state)) {
    if (subResult === CharSetString) {
      result = CharSetString;
    }
    var start = state.pos;
    while (state.eatChars(
      [38, 38]
      /* && */
    )) {
      if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
        if (subResult !== CharSetString) {
          result = CharSetOk;
        }
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
    while (state.eatChars(
      [45, 45]
      /* -- */
    )) {
      if (this.regexp_eatClassSetOperand(state)) {
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
  } else {
    state.raise("Invalid character in character class");
  }
  for (; ; ) {
    if (this.regexp_eatClassSetRange(state)) {
      continue;
    }
    subResult = this.regexp_eatClassSetOperand(state);
    if (!subResult) {
      return result;
    }
    if (subResult === CharSetString) {
      result = CharSetString;
    }
  }
};
pp$1.regexp_eatClassSetRange = function(state) {
  var start = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatClassSetOperand = function(state) {
  if (this.regexp_eatClassSetCharacter(state)) {
    return CharSetOk;
  }
  return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};
pp$1.regexp_eatNestedClass = function(state) {
  var start = state.pos;
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (state.eat(
      93
      /* ] */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Negated character class may contain strings");
      }
      return result;
    }
    state.pos = start;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) {
      return result$1;
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(state) {
  var start = state.pos;
  if (state.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (state.eat(
      123
      /* { */
    )) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(
        125
        /* } */
      )) {
        return result;
      }
    } else {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (this.regexp_classString(state) === CharSetString) {
      result = CharSetString;
    }
  }
  return result;
};
pp$1.regexp_classString = function(state) {
  var count = 0;
  while (this.regexp_eatClassSetCharacter(state)) {
    count++;
  }
  return count === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) {
      return true;
    }
    if (state.eat(
      98
      /* b */
    )) {
      state.lastIntValue = 8;
      return true;
    }
    state.pos = start;
    return false;
  }
  var ch = state.current();
  if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) {
    return false;
  }
  if (isClassSetSyntaxCharacter(ch)) {
    return false;
  }
  state.advance();
  state.lastIntValue = ch;
  return true;
};
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
function isClassSetSyntaxCharacter(ch) {
  return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch = state.current();
  if (isClassSetReservedPunctuator(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isClassSetReservedPunctuator(ch) {
  return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 95) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i2 = 0; i2 < length; ++i2) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};
var Token = function Token2(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [p.start, p.end];
  }
};
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;
    return {
      next: function() {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        };
      }
    };
  };
}
pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types$1.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp.readToken = function(code) {
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code);
};
pp.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 55295 || code >= 56320) {
    return code;
  }
  var next = this.input.charCodeAt(this.pos + 1);
  return next <= 56319 || next >= 57344 ? code : (code << 10) + next - 56613888;
};
pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(
      true,
      this.input.slice(start + 2, end),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(
      false,
      this.input.slice(start + startSkip, this.pos),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10:
      case 8232:
      case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break loop;
        }
        break;
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop;
        }
    }
  }
};
pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) {
    return this.readNumber(true);
  }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot);
  }
};
pp.readToken_slash = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types$1.star : types$1.modulo;
  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) {
        return this.finishOp(types$1.assign, 3);
      }
    }
    return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types$1.assign, size + 1);
    }
    return this.finishOp(types$1.bitShift, size);
  }
  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) {
    size = 2;
  }
  return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var ecmaVersion = this.options.ecmaVersion;
  if (ecmaVersion >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) {
        return this.finishOp(types$1.questionDot, 2);
      }
    }
    if (next === 63) {
      if (ecmaVersion >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types$1.assign, 3);
        }
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var ecmaVersion = this.options.ecmaVersion;
  var code = 35;
  if (ecmaVersion >= 13) {
    ++this.pos;
    code = this.fullCharCodeAtPos();
    if (isIdentifierStart(code, true) || code === 92) {
      return this.finishToken(types$1.privateId, this.readWord1());
    }
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.getTokenFromCode = function(code) {
  switch (code) {
    case 46:
      return this.readToken_dot();
    case 40:
      ++this.pos;
      return this.finishToken(types$1.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types$1.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types$1.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types$1.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types$1.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types$1.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types$1.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types$1.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types$1.backQuote);
    case 48:
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) {
          return this.readRadixNumber(8);
        }
        if (next === 98 || next === 66) {
          return this.readRadixNumber(2);
        }
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    case 34:
    case 39:
      return this.readString(code);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code);
    case 60:
    case 62:
      return this.readToken_lt_gt(code);
    case 61:
    case 33:
      return this.readToken_eq_excl(code);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start, "Unterminated regular expression");
    }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) {
      this.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e2) {
  }
  return this.finishToken(types$1.regexp, { pattern, flags, value });
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start = this.pos, total = 0, lastCode = 0;
  for (var i2 = 0, e2 = len == null ? Infinity : len; i2 < e2; ++i2, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i2 === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (code >= 48 && code <= 57) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  if (next === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;
  if (ch === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code = this.readHexChar(4);
  }
  return code;
};
pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) {
      break;
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 8232 || ch === 8233) {
      if (this.options.ecmaVersion < 10) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        if (this.input[this.pos + 1] === "\n") {
          ++this.pos;
        }
      case "\n":
      case "\u2028":
      case "\u2029":
        ++this.curLine;
        this.lineStart = this.pos + 1;
        break;
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return codePointToString(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch)) {
        if (this.options.locations) {
          this.lineStart = this.pos;
          ++this.curLine;
        }
        return "";
      }
      return String.fromCharCode(ch);
  }
};
pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n;
};
pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 65535 ? 1 : 2;
    } else if (ch === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word);
};
var version = "8.12.1";
Parser.acorn = {
  Parser,
  version,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};

// node_modules/mlly/dist/index.mjs
var import_node_module = __toESM(require_node_module(), 1);
var import_node_fs2 = __toESM(require_node_fs(), 1);

// node_modules/pathe/dist/shared/pathe.ff20891b.mjs
var _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
var isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};

// node_modules/pkg-types/dist/index.mjs
var import_node_fs = __toESM(require_node_fs(), 1);

// node_modules/confbox/dist/shared/confbox.9388d834.mjs
var m = Symbol.for("__confbox_fmt__");

// node_modules/confbox/dist/json5.mjs
function X(D2) {
  return D2 && D2.__esModule && Object.prototype.hasOwnProperty.call(D2, "default") ? D2.default : D2;
}
var k = {};
k.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, k.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, k.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
var H = k;
var G = { isSpaceSeparator(D2) {
  return typeof D2 == "string" && H.Space_Separator.test(D2);
}, isIdStartChar(D2) {
  return typeof D2 == "string" && (D2 >= "a" && D2 <= "z" || D2 >= "A" && D2 <= "Z" || D2 === "$" || D2 === "_" || H.ID_Start.test(D2));
}, isIdContinueChar(D2) {
  return typeof D2 == "string" && (D2 >= "a" && D2 <= "z" || D2 >= "A" && D2 <= "Z" || D2 >= "0" && D2 <= "9" || D2 === "$" || D2 === "_" || D2 === "‌" || D2 === "‍" || H.ID_Continue.test(D2));
}, isDigit(D2) {
  return typeof D2 == "string" && /[0-9]/.test(D2);
}, isHexDigit(D2) {
  return typeof D2 == "string" && /[0-9A-Fa-f]/.test(D2);
} };
var f = G;
var q;
var h;
var y;
var V;
var S;
var g;
var l;
var M;
var O;
var Cu = function(C3, E2) {
  q = String(C3), h = "start", y = [], V = 0, S = 1, g = 0, l = void 0, M = void 0, O = void 0;
  do
    l = ru(), nu[h]();
  while (l.type !== "eof");
  return typeof E2 == "function" ? T({ "": O }, "", E2) : O;
};
function T(D2, C3, E2) {
  const n = D2[C3];
  if (n != null && typeof n == "object") if (Array.isArray(n)) for (let m3 = 0; m3 < n.length; m3++) {
    const o = String(m3), x3 = T(n, o, E2);
    x3 === void 0 ? delete n[o] : Object.defineProperty(n, o, { value: x3, writable: true, enumerable: true, configurable: true });
  }
  else for (const m3 in n) {
    const o = T(n, m3, E2);
    o === void 0 ? delete n[m3] : Object.defineProperty(n, m3, { value: o, writable: true, enumerable: true, configurable: true });
  }
  return E2.call(D2, C3, n);
}
var t;
var e;
var $;
var w;
var r;
function ru() {
  for (t = "default", e = "", $ = false, w = 1; ; ) {
    r = b();
    const D2 = U[t]();
    if (D2) return D2;
  }
}
function b() {
  if (q[V]) return String.fromCodePoint(q.codePointAt(V));
}
function u() {
  const D2 = b();
  return D2 === `
` ? (S++, g = 0) : D2 ? g += D2.length : g++, D2 && (V += D2.length), D2;
}
var U = { default() {
  switch (r) {
    case "	":
    case "\v":
    case "\f":
    case " ":
    case " ":
    case "\uFEFF":
    case `
`:
    case "\r":
    case "\u2028":
    case "\u2029":
      u();
      return;
    case "/":
      u(), t = "comment";
      return;
    case void 0:
      return u(), i("eof");
  }
  if (f.isSpaceSeparator(r)) {
    u();
    return;
  }
  return U[h]();
}, comment() {
  switch (r) {
    case "*":
      u(), t = "multiLineComment";
      return;
    case "/":
      u(), t = "singleLineComment";
      return;
  }
  throw a(u());
}, multiLineComment() {
  switch (r) {
    case "*":
      u(), t = "multiLineCommentAsterisk";
      return;
    case void 0:
      throw a(u());
  }
  u();
}, multiLineCommentAsterisk() {
  switch (r) {
    case "*":
      u();
      return;
    case "/":
      u(), t = "default";
      return;
    case void 0:
      throw a(u());
  }
  u(), t = "multiLineComment";
}, singleLineComment() {
  switch (r) {
    case `
`:
    case "\r":
    case "\u2028":
    case "\u2029":
      u(), t = "default";
      return;
    case void 0:
      return u(), i("eof");
  }
  u();
}, value() {
  switch (r) {
    case "{":
    case "[":
      return i("punctuator", u());
    case "n":
      return u(), P("ull"), i("null", null);
    case "t":
      return u(), P("rue"), i("boolean", true);
    case "f":
      return u(), P("alse"), i("boolean", false);
    case "-":
    case "+":
      u() === "-" && (w = -1), t = "sign";
      return;
    case ".":
      e = u(), t = "decimalPointLeading";
      return;
    case "0":
      e = u(), t = "zero";
      return;
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      e = u(), t = "decimalInteger";
      return;
    case "I":
      return u(), P("nfinity"), i("numeric", 1 / 0);
    case "N":
      return u(), P("aN"), i("numeric", NaN);
    case '"':
    case "'":
      $ = u() === '"', e = "", t = "string";
      return;
  }
  throw a(u());
}, identifierNameStartEscape() {
  if (r !== "u") throw a(u());
  u();
  const D2 = Z();
  switch (D2) {
    case "$":
    case "_":
      break;
    default:
      if (!f.isIdStartChar(D2)) throw W();
      break;
  }
  e += D2, t = "identifierName";
}, identifierName() {
  switch (r) {
    case "$":
    case "_":
    case "‌":
    case "‍":
      e += u();
      return;
    case "\\":
      u(), t = "identifierNameEscape";
      return;
  }
  if (f.isIdContinueChar(r)) {
    e += u();
    return;
  }
  return i("identifier", e);
}, identifierNameEscape() {
  if (r !== "u") throw a(u());
  u();
  const D2 = Z();
  switch (D2) {
    case "$":
    case "_":
    case "‌":
    case "‍":
      break;
    default:
      if (!f.isIdContinueChar(D2)) throw W();
      break;
  }
  e += D2, t = "identifierName";
}, sign() {
  switch (r) {
    case ".":
      e = u(), t = "decimalPointLeading";
      return;
    case "0":
      e = u(), t = "zero";
      return;
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      e = u(), t = "decimalInteger";
      return;
    case "I":
      return u(), P("nfinity"), i("numeric", w * (1 / 0));
    case "N":
      return u(), P("aN"), i("numeric", NaN);
  }
  throw a(u());
}, zero() {
  switch (r) {
    case ".":
      e += u(), t = "decimalPoint";
      return;
    case "e":
    case "E":
      e += u(), t = "decimalExponent";
      return;
    case "x":
    case "X":
      e += u(), t = "hexadecimal";
      return;
  }
  return i("numeric", w * 0);
}, decimalInteger() {
  switch (r) {
    case ".":
      e += u(), t = "decimalPoint";
      return;
    case "e":
    case "E":
      e += u(), t = "decimalExponent";
      return;
  }
  if (f.isDigit(r)) {
    e += u();
    return;
  }
  return i("numeric", w * Number(e));
}, decimalPointLeading() {
  if (f.isDigit(r)) {
    e += u(), t = "decimalFraction";
    return;
  }
  throw a(u());
}, decimalPoint() {
  switch (r) {
    case "e":
    case "E":
      e += u(), t = "decimalExponent";
      return;
  }
  if (f.isDigit(r)) {
    e += u(), t = "decimalFraction";
    return;
  }
  return i("numeric", w * Number(e));
}, decimalFraction() {
  switch (r) {
    case "e":
    case "E":
      e += u(), t = "decimalExponent";
      return;
  }
  if (f.isDigit(r)) {
    e += u();
    return;
  }
  return i("numeric", w * Number(e));
}, decimalExponent() {
  switch (r) {
    case "+":
    case "-":
      e += u(), t = "decimalExponentSign";
      return;
  }
  if (f.isDigit(r)) {
    e += u(), t = "decimalExponentInteger";
    return;
  }
  throw a(u());
}, decimalExponentSign() {
  if (f.isDigit(r)) {
    e += u(), t = "decimalExponentInteger";
    return;
  }
  throw a(u());
}, decimalExponentInteger() {
  if (f.isDigit(r)) {
    e += u();
    return;
  }
  return i("numeric", w * Number(e));
}, hexadecimal() {
  if (f.isHexDigit(r)) {
    e += u(), t = "hexadecimalInteger";
    return;
  }
  throw a(u());
}, hexadecimalInteger() {
  if (f.isHexDigit(r)) {
    e += u();
    return;
  }
  return i("numeric", w * Number(e));
}, string() {
  switch (r) {
    case "\\":
      u(), e += Au();
      return;
    case '"':
      if ($) return u(), i("string", e);
      e += u();
      return;
    case "'":
      if (!$) return u(), i("string", e);
      e += u();
      return;
    case `
`:
    case "\r":
      throw a(u());
    case "\u2028":
    case "\u2029":
      iu(r);
      break;
    case void 0:
      throw a(u());
  }
  e += u();
}, start() {
  switch (r) {
    case "{":
    case "[":
      return i("punctuator", u());
  }
  t = "value";
}, beforePropertyName() {
  switch (r) {
    case "$":
    case "_":
      e = u(), t = "identifierName";
      return;
    case "\\":
      u(), t = "identifierNameStartEscape";
      return;
    case "}":
      return i("punctuator", u());
    case '"':
    case "'":
      $ = u() === '"', t = "string";
      return;
  }
  if (f.isIdStartChar(r)) {
    e += u(), t = "identifierName";
    return;
  }
  throw a(u());
}, afterPropertyName() {
  if (r === ":") return i("punctuator", u());
  throw a(u());
}, beforePropertyValue() {
  t = "value";
}, afterPropertyValue() {
  switch (r) {
    case ",":
    case "}":
      return i("punctuator", u());
  }
  throw a(u());
}, beforeArrayValue() {
  if (r === "]") return i("punctuator", u());
  t = "value";
}, afterArrayValue() {
  switch (r) {
    case ",":
    case "]":
      return i("punctuator", u());
  }
  throw a(u());
}, end() {
  throw a(u());
} };
function i(D2, C3) {
  return { type: D2, value: C3, line: S, column: g };
}
function P(D2) {
  for (const C3 of D2) {
    if (b() !== C3) throw a(u());
    u();
  }
}
function Au() {
  switch (b()) {
    case "b":
      return u(), "\b";
    case "f":
      return u(), "\f";
    case "n":
      return u(), `
`;
    case "r":
      return u(), "\r";
    case "t":
      return u(), "	";
    case "v":
      return u(), "\v";
    case "0":
      if (u(), f.isDigit(b())) throw a(u());
      return "\0";
    case "x":
      return u(), Eu();
    case "u":
      return u(), Z();
    case `
`:
    case "\u2028":
    case "\u2029":
      return u(), "";
    case "\r":
      return u(), b() === `
` && u(), "";
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      throw a(u());
    case void 0:
      throw a(u());
  }
  return u();
}
function Eu() {
  let D2 = "", C3 = b();
  if (!f.isHexDigit(C3) || (D2 += u(), C3 = b(), !f.isHexDigit(C3))) throw a(u());
  return D2 += u(), String.fromCodePoint(parseInt(D2, 16));
}
function Z() {
  let D2 = "", C3 = 4;
  for (; C3-- > 0; ) {
    const E2 = b();
    if (!f.isHexDigit(E2)) throw a(u());
    D2 += u();
  }
  return String.fromCodePoint(parseInt(D2, 16));
}
var nu = { start() {
  if (l.type === "eof") throw I();
  K();
}, beforePropertyName() {
  switch (l.type) {
    case "identifier":
    case "string":
      M = l.value, h = "afterPropertyName";
      return;
    case "punctuator":
      _();
      return;
    case "eof":
      throw I();
  }
}, afterPropertyName() {
  if (l.type === "eof") throw I();
  h = "beforePropertyValue";
}, beforePropertyValue() {
  if (l.type === "eof") throw I();
  K();
}, beforeArrayValue() {
  if (l.type === "eof") throw I();
  if (l.type === "punctuator" && l.value === "]") {
    _();
    return;
  }
  K();
}, afterPropertyValue() {
  if (l.type === "eof") throw I();
  switch (l.value) {
    case ",":
      h = "beforePropertyName";
      return;
    case "}":
      _();
  }
}, afterArrayValue() {
  if (l.type === "eof") throw I();
  switch (l.value) {
    case ",":
      h = "beforeArrayValue";
      return;
    case "]":
      _();
  }
}, end() {
} };
function K() {
  let D2;
  switch (l.type) {
    case "punctuator":
      switch (l.value) {
        case "{":
          D2 = {};
          break;
        case "[":
          D2 = [];
          break;
      }
      break;
    case "null":
    case "boolean":
    case "numeric":
    case "string":
      D2 = l.value;
      break;
  }
  if (O === void 0) O = D2;
  else {
    const C3 = y[y.length - 1];
    Array.isArray(C3) ? C3.push(D2) : Object.defineProperty(C3, M, { value: D2, writable: true, enumerable: true, configurable: true });
  }
  if (D2 !== null && typeof D2 == "object") y.push(D2), Array.isArray(D2) ? h = "beforeArrayValue" : h = "beforePropertyName";
  else {
    const C3 = y[y.length - 1];
    C3 == null ? h = "end" : Array.isArray(C3) ? h = "afterArrayValue" : h = "afterPropertyValue";
  }
}
function _() {
  y.pop();
  const D2 = y[y.length - 1];
  D2 == null ? h = "end" : Array.isArray(D2) ? h = "afterArrayValue" : h = "afterPropertyValue";
}
function a(D2) {
  return J(D2 === void 0 ? `JSON5: invalid end of input at ${S}:${g}` : `JSON5: invalid character '${Y(D2)}' at ${S}:${g}`);
}
function I() {
  return J(`JSON5: invalid end of input at ${S}:${g}`);
}
function W() {
  return g -= 5, J(`JSON5: invalid identifier character at ${S}:${g}`);
}
function iu(D2) {
  console.warn(`JSON5: '${Y(D2)}' in strings is not valid ECMAScript; consider escaping`);
}
function Y(D2) {
  const C3 = { "'": "\\'", '"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\v", "\0": "\\0", "\u2028": "\\u2028", "\u2029": "\\u2029" };
  if (C3[D2]) return C3[D2];
  if (D2 < " ") {
    const E2 = D2.charCodeAt(0).toString(16);
    return "\\x" + ("00" + E2).substring(E2.length);
  }
  return D2;
}
function J(D2) {
  const C3 = new SyntaxError(D2);
  return C3.lineNumber = S, C3.columnNumber = g, C3;
}
var au = X(Cu);
var Q = G;
var Bu = function(C3, E2, n) {
  const m3 = [];
  let o = "", x3, L2, N5 = "", R3;
  if (E2 != null && typeof E2 == "object" && !Array.isArray(E2) && (n = E2.space, R3 = E2.quote, E2 = E2.replacer), typeof E2 == "function") L2 = E2;
  else if (Array.isArray(E2)) {
    x3 = [];
    for (const A of E2) {
      let B2;
      typeof A == "string" ? B2 = A : (typeof A == "number" || A instanceof String || A instanceof Number) && (B2 = String(A)), B2 !== void 0 && x3.indexOf(B2) < 0 && x3.push(B2);
    }
  }
  return n instanceof Number ? n = Number(n) : n instanceof String && (n = String(n)), typeof n == "number" ? n > 0 && (n = Math.min(10, Math.floor(n)), N5 = "          ".substr(0, n)) : typeof n == "string" && (N5 = n.substr(0, 10)), z3("", { "": C3 });
  function z3(A, B2) {
    let F = B2[A];
    switch (F != null && (typeof F.toJSON5 == "function" ? F = F.toJSON5(A) : typeof F.toJSON == "function" && (F = F.toJSON(A))), L2 && (F = L2.call(B2, A, F)), F instanceof Number ? F = Number(F) : F instanceof String ? F = String(F) : F instanceof Boolean && (F = F.valueOf()), F) {
      case null:
        return "null";
      case true:
        return "true";
      case false:
        return "false";
    }
    if (typeof F == "string") return j2(F);
    if (typeof F == "number") return String(F);
    if (typeof F == "object") return Array.isArray(F) ? eu(F) : uu(F);
  }
  function j2(A) {
    const B2 = { "'": 0.1, '"': 0.2 }, F = { "'": "\\'", '"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\v", "\0": "\\0", "\u2028": "\\u2028", "\u2029": "\\u2029" };
    let c = "";
    for (let s2 = 0; s2 < A.length; s2++) {
      const p = A[s2];
      switch (p) {
        case "'":
        case '"':
          B2[p]++, c += p;
          continue;
        case "\0":
          if (Q.isDigit(A[s2 + 1])) {
            c += "\\x00";
            continue;
          }
      }
      if (F[p]) {
        c += F[p];
        continue;
      }
      if (p < " ") {
        let v2 = p.charCodeAt(0).toString(16);
        c += "\\x" + ("00" + v2).substring(v2.length);
        continue;
      }
      c += p;
    }
    const d2 = R3 || Object.keys(B2).reduce((s2, p) => B2[s2] < B2[p] ? s2 : p);
    return c = c.replace(new RegExp(d2, "g"), F[d2]), d2 + c + d2;
  }
  function uu(A) {
    if (m3.indexOf(A) >= 0) throw TypeError("Converting circular structure to JSON5");
    m3.push(A);
    let B2 = o;
    o = o + N5;
    let F = x3 || Object.keys(A), c = [];
    for (const s2 of F) {
      const p = z3(s2, A);
      if (p !== void 0) {
        let v2 = Du(s2) + ":";
        N5 !== "" && (v2 += " "), v2 += p, c.push(v2);
      }
    }
    let d2;
    if (c.length === 0) d2 = "{}";
    else {
      let s2;
      if (N5 === "") s2 = c.join(","), d2 = "{" + s2 + "}";
      else {
        let p = `,
` + o;
        s2 = c.join(p), d2 = `{
` + o + s2 + `,
` + B2 + "}";
      }
    }
    return m3.pop(), o = B2, d2;
  }
  function Du(A) {
    if (A.length === 0) return j2(A);
    const B2 = String.fromCodePoint(A.codePointAt(0));
    if (!Q.isIdStartChar(B2)) return j2(A);
    for (let F = B2.length; F < A.length; F++) if (!Q.isIdContinueChar(String.fromCodePoint(A.codePointAt(F)))) return j2(A);
    return A;
  }
  function eu(A) {
    if (m3.indexOf(A) >= 0) throw TypeError("Converting circular structure to JSON5");
    m3.push(A);
    let B2 = o;
    o = o + N5;
    let F = [];
    for (let d2 = 0; d2 < A.length; d2++) {
      const s2 = z3(String(d2), A);
      F.push(s2 !== void 0 ? s2 : "null");
    }
    let c;
    if (F.length === 0) c = "[]";
    else if (N5 === "") c = "[" + F.join(",") + "]";
    else {
      let d2 = `,
` + o, s2 = F.join(d2);
      c = `[
` + o + s2 + `,
` + B2 + "]";
    }
    return m3.pop(), o = B2, c;
  }
};
var su = X(Bu);

// node_modules/confbox/dist/shared/confbox.f9f03f05.mjs
var Q2;
(function(n) {
  n[n.lineFeed = 10] = "lineFeed", n[n.carriageReturn = 13] = "carriageReturn", n[n.space = 32] = "space", n[n._0 = 48] = "_0", n[n._1 = 49] = "_1", n[n._2 = 50] = "_2", n[n._3 = 51] = "_3", n[n._4 = 52] = "_4", n[n._5 = 53] = "_5", n[n._6 = 54] = "_6", n[n._7 = 55] = "_7", n[n._8 = 56] = "_8", n[n._9 = 57] = "_9", n[n.a = 97] = "a", n[n.b = 98] = "b", n[n.c = 99] = "c", n[n.d = 100] = "d", n[n.e = 101] = "e", n[n.f = 102] = "f", n[n.g = 103] = "g", n[n.h = 104] = "h", n[n.i = 105] = "i", n[n.j = 106] = "j", n[n.k = 107] = "k", n[n.l = 108] = "l", n[n.m = 109] = "m", n[n.n = 110] = "n", n[n.o = 111] = "o", n[n.p = 112] = "p", n[n.q = 113] = "q", n[n.r = 114] = "r", n[n.s = 115] = "s", n[n.t = 116] = "t", n[n.u = 117] = "u", n[n.v = 118] = "v", n[n.w = 119] = "w", n[n.x = 120] = "x", n[n.y = 121] = "y", n[n.z = 122] = "z", n[n.A = 65] = "A", n[n.B = 66] = "B", n[n.C = 67] = "C", n[n.D = 68] = "D", n[n.E = 69] = "E", n[n.F = 70] = "F", n[n.G = 71] = "G", n[n.H = 72] = "H", n[n.I = 73] = "I", n[n.J = 74] = "J", n[n.K = 75] = "K", n[n.L = 76] = "L", n[n.M = 77] = "M", n[n.N = 78] = "N", n[n.O = 79] = "O", n[n.P = 80] = "P", n[n.Q = 81] = "Q", n[n.R = 82] = "R", n[n.S = 83] = "S", n[n.T = 84] = "T", n[n.U = 85] = "U", n[n.V = 86] = "V", n[n.W = 87] = "W", n[n.X = 88] = "X", n[n.Y = 89] = "Y", n[n.Z = 90] = "Z", n[n.asterisk = 42] = "asterisk", n[n.backslash = 92] = "backslash", n[n.closeBrace = 125] = "closeBrace", n[n.closeBracket = 93] = "closeBracket", n[n.colon = 58] = "colon", n[n.comma = 44] = "comma", n[n.dot = 46] = "dot", n[n.doubleQuote = 34] = "doubleQuote", n[n.minus = 45] = "minus", n[n.openBrace = 123] = "openBrace", n[n.openBracket = 91] = "openBracket", n[n.plus = 43] = "plus", n[n.slash = 47] = "slash", n[n.formFeed = 12] = "formFeed", n[n.tab = 9] = "tab";
})(Q2 || (Q2 = {})), new Array(20).fill(0).map((n, l3) => " ".repeat(l3));
var N2 = 200;
new Array(N2).fill(0).map((n, l3) => `
` + " ".repeat(l3)), new Array(N2).fill(0).map((n, l3) => "\r" + " ".repeat(l3)), new Array(N2).fill(0).map((n, l3) => `\r
` + " ".repeat(l3)), new Array(N2).fill(0).map((n, l3) => `
` + "	".repeat(l3)), new Array(N2).fill(0).map((n, l3) => "\r" + "	".repeat(l3)), new Array(N2).fill(0).map((n, l3) => `\r
` + "	".repeat(l3));
var U2;
(function(n) {
  n.DEFAULT = { allowTrailingComma: false };
})(U2 || (U2 = {}));
var W2;
(function(n) {
  n[n.None = 0] = "None", n[n.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", n[n.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", n[n.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", n[n.InvalidUnicode = 4] = "InvalidUnicode", n[n.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", n[n.InvalidCharacter = 6] = "InvalidCharacter";
})(W2 || (W2 = {}));
var H2;
(function(n) {
  n[n.OpenBraceToken = 1] = "OpenBraceToken", n[n.CloseBraceToken = 2] = "CloseBraceToken", n[n.OpenBracketToken = 3] = "OpenBracketToken", n[n.CloseBracketToken = 4] = "CloseBracketToken", n[n.CommaToken = 5] = "CommaToken", n[n.ColonToken = 6] = "ColonToken", n[n.NullKeyword = 7] = "NullKeyword", n[n.TrueKeyword = 8] = "TrueKeyword", n[n.FalseKeyword = 9] = "FalseKeyword", n[n.StringLiteral = 10] = "StringLiteral", n[n.NumericLiteral = 11] = "NumericLiteral", n[n.LineCommentTrivia = 12] = "LineCommentTrivia", n[n.BlockCommentTrivia = 13] = "BlockCommentTrivia", n[n.LineBreakTrivia = 14] = "LineBreakTrivia", n[n.Trivia = 15] = "Trivia", n[n.Unknown = 16] = "Unknown", n[n.EOF = 17] = "EOF";
})(H2 || (H2 = {}));
var q2;
(function(n) {
  n[n.InvalidSymbol = 1] = "InvalidSymbol", n[n.InvalidNumberFormat = 2] = "InvalidNumberFormat", n[n.PropertyNameExpected = 3] = "PropertyNameExpected", n[n.ValueExpected = 4] = "ValueExpected", n[n.ColonExpected = 5] = "ColonExpected", n[n.CommaExpected = 6] = "CommaExpected", n[n.CloseBraceExpected = 7] = "CloseBraceExpected", n[n.CloseBracketExpected = 8] = "CloseBracketExpected", n[n.EndOfFileExpected = 9] = "EndOfFileExpected", n[n.InvalidCommentToken = 10] = "InvalidCommentToken", n[n.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", n[n.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", n[n.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", n[n.InvalidUnicode = 14] = "InvalidUnicode", n[n.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", n[n.InvalidCharacter = 16] = "InvalidCharacter";
})(q2 || (q2 = {}));

// node_modules/confbox/dist/yaml.mjs
function oe(e2) {
  return typeof e2 > "u" || e2 === null;
}
function We(e2) {
  return typeof e2 == "object" && e2 !== null;
}
function $e(e2) {
  return Array.isArray(e2) ? e2 : oe(e2) ? [] : [e2];
}
function Qe(e2, n) {
  var i2, l3, r2, u2;
  if (n) for (u2 = Object.keys(n), i2 = 0, l3 = u2.length; i2 < l3; i2 += 1) r2 = u2[i2], e2[r2] = n[r2];
  return e2;
}
function Ve(e2, n) {
  var i2 = "", l3;
  for (l3 = 0; l3 < n; l3 += 1) i2 += e2;
  return i2;
}
function Xe(e2) {
  return e2 === 0 && Number.NEGATIVE_INFINITY === 1 / e2;
}
var Ze = oe;
var ze = We;
var Je = $e;
var en = Ve;
var nn = Xe;
var rn = Qe;
var y2 = { isNothing: Ze, isObject: ze, toArray: Je, repeat: en, isNegativeZero: nn, extend: rn };
function ue(e2, n) {
  var i2 = "", l3 = e2.reason || "(unknown reason)";
  return e2.mark ? (e2.mark.name && (i2 += 'in "' + e2.mark.name + '" '), i2 += "(" + (e2.mark.line + 1) + ":" + (e2.mark.column + 1) + ")", !n && e2.mark.snippet && (i2 += `

` + e2.mark.snippet), l3 + " " + i2) : l3;
}
function M2(e2, n) {
  Error.call(this), this.name = "YAMLException", this.reason = e2, this.mark = n, this.message = ue(this, false), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
M2.prototype = Object.create(Error.prototype), M2.prototype.constructor = M2, M2.prototype.toString = function(n) {
  return this.name + ": " + ue(this, n);
};
var w2 = M2;
function $2(e2, n, i2, l3, r2) {
  var u2 = "", o = "", f2 = Math.floor(r2 / 2) - 1;
  return l3 - n > f2 && (u2 = " ... ", n = l3 - f2 + u2.length), i2 - l3 > f2 && (o = " ...", i2 = l3 + f2 - o.length), { str: u2 + e2.slice(n, i2).replace(/\t/g, "→") + o, pos: l3 - n + u2.length };
}
function Q3(e2, n) {
  return y2.repeat(" ", n - e2.length) + e2;
}
function ln(e2, n) {
  if (n = Object.create(n || null), !e2.buffer) return null;
  n.maxLength || (n.maxLength = 79), typeof n.indent != "number" && (n.indent = 1), typeof n.linesBefore != "number" && (n.linesBefore = 3), typeof n.linesAfter != "number" && (n.linesAfter = 2);
  for (var i2 = /\r?\n|\r|\0/g, l3 = [0], r2 = [], u2, o = -1; u2 = i2.exec(e2.buffer); ) r2.push(u2.index), l3.push(u2.index + u2[0].length), e2.position <= u2.index && o < 0 && (o = l3.length - 2);
  o < 0 && (o = l3.length - 1);
  var f2 = "", c, a2, t2 = Math.min(e2.line + n.linesAfter, r2.length).toString().length, p = n.maxLength - (n.indent + t2 + 3);
  for (c = 1; c <= n.linesBefore && !(o - c < 0); c++) a2 = $2(e2.buffer, l3[o - c], r2[o - c], e2.position - (l3[o] - l3[o - c]), p), f2 = y2.repeat(" ", n.indent) + Q3((e2.line - c + 1).toString(), t2) + " | " + a2.str + `
` + f2;
  for (a2 = $2(e2.buffer, l3[o], r2[o], e2.position, p), f2 += y2.repeat(" ", n.indent) + Q3((e2.line + 1).toString(), t2) + " | " + a2.str + `
`, f2 += y2.repeat("-", n.indent + t2 + 3 + a2.pos) + `^
`, c = 1; c <= n.linesAfter && !(o + c >= r2.length); c++) a2 = $2(e2.buffer, l3[o + c], r2[o + c], e2.position - (l3[o] - l3[o + c]), p), f2 += y2.repeat(" ", n.indent) + Q3((e2.line + c + 1).toString(), t2) + " | " + a2.str + `
`;
  return f2.replace(/\n$/, "");
}
var on = ln;
var un = ["kind", "multi", "resolve", "construct", "instanceOf", "predicate", "represent", "representName", "defaultStyle", "styleAliases"];
var fn = ["scalar", "sequence", "mapping"];
function cn(e2) {
  var n = {};
  return e2 !== null && Object.keys(e2).forEach(function(i2) {
    e2[i2].forEach(function(l3) {
      n[String(l3)] = i2;
    });
  }), n;
}
function an(e2, n) {
  if (n = n || {}, Object.keys(n).forEach(function(i2) {
    if (un.indexOf(i2) === -1) throw new w2('Unknown option "' + i2 + '" is met in definition of "' + e2 + '" YAML type.');
  }), this.options = n, this.tag = e2, this.kind = n.kind || null, this.resolve = n.resolve || function() {
    return true;
  }, this.construct = n.construct || function(i2) {
    return i2;
  }, this.instanceOf = n.instanceOf || null, this.predicate = n.predicate || null, this.represent = n.represent || null, this.representName = n.representName || null, this.defaultStyle = n.defaultStyle || null, this.multi = n.multi || false, this.styleAliases = cn(n.styleAliases || null), fn.indexOf(this.kind) === -1) throw new w2('Unknown kind "' + this.kind + '" is specified for "' + e2 + '" YAML type.');
}
var C2 = an;
function fe(e2, n) {
  var i2 = [];
  return e2[n].forEach(function(l3) {
    var r2 = i2.length;
    i2.forEach(function(u2, o) {
      u2.tag === l3.tag && u2.kind === l3.kind && u2.multi === l3.multi && (r2 = o);
    }), i2[r2] = l3;
  }), i2;
}
function pn() {
  var e2 = { scalar: {}, sequence: {}, mapping: {}, fallback: {}, multi: { scalar: [], sequence: [], mapping: [], fallback: [] } }, n, i2;
  function l3(r2) {
    r2.multi ? (e2.multi[r2.kind].push(r2), e2.multi.fallback.push(r2)) : e2[r2.kind][r2.tag] = e2.fallback[r2.tag] = r2;
  }
  for (n = 0, i2 = arguments.length; n < i2; n += 1) arguments[n].forEach(l3);
  return e2;
}
function V2(e2) {
  return this.extend(e2);
}
V2.prototype.extend = function(n) {
  var i2 = [], l3 = [];
  if (n instanceof C2) l3.push(n);
  else if (Array.isArray(n)) l3 = l3.concat(n);
  else if (n && (Array.isArray(n.implicit) || Array.isArray(n.explicit))) n.implicit && (i2 = i2.concat(n.implicit)), n.explicit && (l3 = l3.concat(n.explicit));
  else throw new w2("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  i2.forEach(function(u2) {
    if (!(u2 instanceof C2)) throw new w2("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (u2.loadKind && u2.loadKind !== "scalar") throw new w2("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (u2.multi) throw new w2("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), l3.forEach(function(u2) {
    if (!(u2 instanceof C2)) throw new w2("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var r2 = Object.create(V2.prototype);
  return r2.implicit = (this.implicit || []).concat(i2), r2.explicit = (this.explicit || []).concat(l3), r2.compiledImplicit = fe(r2, "implicit"), r2.compiledExplicit = fe(r2, "explicit"), r2.compiledTypeMap = pn(r2.compiledImplicit, r2.compiledExplicit), r2;
};
var tn = V2;
var hn = new C2("tag:yaml.org,2002:str", { kind: "scalar", construct: function(e2) {
  return e2 !== null ? e2 : "";
} });
var dn = new C2("tag:yaml.org,2002:seq", { kind: "sequence", construct: function(e2) {
  return e2 !== null ? e2 : [];
} });
var sn = new C2("tag:yaml.org,2002:map", { kind: "mapping", construct: function(e2) {
  return e2 !== null ? e2 : {};
} });
var xn = new tn({ explicit: [hn, dn, sn] });
function mn(e2) {
  if (e2 === null) return true;
  var n = e2.length;
  return n === 1 && e2 === "~" || n === 4 && (e2 === "null" || e2 === "Null" || e2 === "NULL");
}
function gn() {
  return null;
}
function An(e2) {
  return e2 === null;
}
var vn = new C2("tag:yaml.org,2002:null", { kind: "scalar", resolve: mn, construct: gn, predicate: An, represent: { canonical: function() {
  return "~";
}, lowercase: function() {
  return "null";
}, uppercase: function() {
  return "NULL";
}, camelcase: function() {
  return "Null";
}, empty: function() {
  return "";
} }, defaultStyle: "lowercase" });
function yn(e2) {
  if (e2 === null) return false;
  var n = e2.length;
  return n === 4 && (e2 === "true" || e2 === "True" || e2 === "TRUE") || n === 5 && (e2 === "false" || e2 === "False" || e2 === "FALSE");
}
function Cn(e2) {
  return e2 === "true" || e2 === "True" || e2 === "TRUE";
}
function _n(e2) {
  return Object.prototype.toString.call(e2) === "[object Boolean]";
}
var wn = new C2("tag:yaml.org,2002:bool", { kind: "scalar", resolve: yn, construct: Cn, predicate: _n, represent: { lowercase: function(e2) {
  return e2 ? "true" : "false";
}, uppercase: function(e2) {
  return e2 ? "TRUE" : "FALSE";
}, camelcase: function(e2) {
  return e2 ? "True" : "False";
} }, defaultStyle: "lowercase" });
function bn(e2) {
  return 48 <= e2 && e2 <= 57 || 65 <= e2 && e2 <= 70 || 97 <= e2 && e2 <= 102;
}
function Fn(e2) {
  return 48 <= e2 && e2 <= 55;
}
function Sn(e2) {
  return 48 <= e2 && e2 <= 57;
}
function En(e2) {
  if (e2 === null) return false;
  var n = e2.length, i2 = 0, l3 = false, r2;
  if (!n) return false;
  if (r2 = e2[i2], (r2 === "-" || r2 === "+") && (r2 = e2[++i2]), r2 === "0") {
    if (i2 + 1 === n) return true;
    if (r2 = e2[++i2], r2 === "b") {
      for (i2++; i2 < n; i2++) if (r2 = e2[i2], r2 !== "_") {
        if (r2 !== "0" && r2 !== "1") return false;
        l3 = true;
      }
      return l3 && r2 !== "_";
    }
    if (r2 === "x") {
      for (i2++; i2 < n; i2++) if (r2 = e2[i2], r2 !== "_") {
        if (!bn(e2.charCodeAt(i2))) return false;
        l3 = true;
      }
      return l3 && r2 !== "_";
    }
    if (r2 === "o") {
      for (i2++; i2 < n; i2++) if (r2 = e2[i2], r2 !== "_") {
        if (!Fn(e2.charCodeAt(i2))) return false;
        l3 = true;
      }
      return l3 && r2 !== "_";
    }
  }
  if (r2 === "_") return false;
  for (; i2 < n; i2++) if (r2 = e2[i2], r2 !== "_") {
    if (!Sn(e2.charCodeAt(i2))) return false;
    l3 = true;
  }
  return !(!l3 || r2 === "_");
}
function Tn(e2) {
  var n = e2, i2 = 1, l3;
  if (n.indexOf("_") !== -1 && (n = n.replace(/_/g, "")), l3 = n[0], (l3 === "-" || l3 === "+") && (l3 === "-" && (i2 = -1), n = n.slice(1), l3 = n[0]), n === "0") return 0;
  if (l3 === "0") {
    if (n[1] === "b") return i2 * parseInt(n.slice(2), 2);
    if (n[1] === "x") return i2 * parseInt(n.slice(2), 16);
    if (n[1] === "o") return i2 * parseInt(n.slice(2), 8);
  }
  return i2 * parseInt(n, 10);
}
function On(e2) {
  return Object.prototype.toString.call(e2) === "[object Number]" && e2 % 1 === 0 && !y2.isNegativeZero(e2);
}
var In = new C2("tag:yaml.org,2002:int", { kind: "scalar", resolve: En, construct: Tn, predicate: On, represent: { binary: function(e2) {
  return e2 >= 0 ? "0b" + e2.toString(2) : "-0b" + e2.toString(2).slice(1);
}, octal: function(e2) {
  return e2 >= 0 ? "0o" + e2.toString(8) : "-0o" + e2.toString(8).slice(1);
}, decimal: function(e2) {
  return e2.toString(10);
}, hexadecimal: function(e2) {
  return e2 >= 0 ? "0x" + e2.toString(16).toUpperCase() : "-0x" + e2.toString(16).toUpperCase().slice(1);
} }, defaultStyle: "decimal", styleAliases: { binary: [2, "bin"], octal: [8, "oct"], decimal: [10, "dec"], hexadecimal: [16, "hex"] } });
var kn = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Ln(e2) {
  return !(e2 === null || !kn.test(e2) || e2[e2.length - 1] === "_");
}
function Nn(e2) {
  var n, i2;
  return n = e2.replace(/_/g, "").toLowerCase(), i2 = n[0] === "-" ? -1 : 1, "+-".indexOf(n[0]) >= 0 && (n = n.slice(1)), n === ".inf" ? i2 === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : n === ".nan" ? NaN : i2 * parseFloat(n, 10);
}
var Rn = /^[-+]?[0-9]+e/;
function Dn(e2, n) {
  var i2;
  if (isNaN(e2)) switch (n) {
    case "lowercase":
      return ".nan";
    case "uppercase":
      return ".NAN";
    case "camelcase":
      return ".NaN";
  }
  else if (Number.POSITIVE_INFINITY === e2) switch (n) {
    case "lowercase":
      return ".inf";
    case "uppercase":
      return ".INF";
    case "camelcase":
      return ".Inf";
  }
  else if (Number.NEGATIVE_INFINITY === e2) switch (n) {
    case "lowercase":
      return "-.inf";
    case "uppercase":
      return "-.INF";
    case "camelcase":
      return "-.Inf";
  }
  else if (y2.isNegativeZero(e2)) return "-0.0";
  return i2 = e2.toString(10), Rn.test(i2) ? i2.replace("e", ".e") : i2;
}
function Mn(e2) {
  return Object.prototype.toString.call(e2) === "[object Number]" && (e2 % 1 !== 0 || y2.isNegativeZero(e2));
}
var Yn = new C2("tag:yaml.org,2002:float", { kind: "scalar", resolve: Ln, construct: Nn, predicate: Mn, represent: Dn, defaultStyle: "lowercase" });
var Bn = xn.extend({ implicit: [vn, wn, In, Yn] });
var Pn = Bn;
var ce = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
var ae = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function jn(e2) {
  return e2 === null ? false : ce.exec(e2) !== null || ae.exec(e2) !== null;
}
function Hn(e2) {
  var n, i2, l3, r2, u2, o, f2, c = 0, a2 = null, t2, p, d2;
  if (n = ce.exec(e2), n === null && (n = ae.exec(e2)), n === null) throw new Error("Date resolve error");
  if (i2 = +n[1], l3 = +n[2] - 1, r2 = +n[3], !n[4]) return new Date(Date.UTC(i2, l3, r2));
  if (u2 = +n[4], o = +n[5], f2 = +n[6], n[7]) {
    for (c = n[7].slice(0, 3); c.length < 3; ) c += "0";
    c = +c;
  }
  return n[9] && (t2 = +n[10], p = +(n[11] || 0), a2 = (t2 * 60 + p) * 6e4, n[9] === "-" && (a2 = -a2)), d2 = new Date(Date.UTC(i2, l3, r2, u2, o, f2, c)), a2 && d2.setTime(d2.getTime() - a2), d2;
}
function Un(e2) {
  return e2.toISOString();
}
var Kn = new C2("tag:yaml.org,2002:timestamp", { kind: "scalar", resolve: jn, construct: Hn, instanceOf: Date, represent: Un });
function qn(e2) {
  return e2 === "<<" || e2 === null;
}
var Gn = new C2("tag:yaml.org,2002:merge", { kind: "scalar", resolve: qn });
var X2 = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Wn(e2) {
  if (e2 === null) return false;
  var n, i2, l3 = 0, r2 = e2.length, u2 = X2;
  for (i2 = 0; i2 < r2; i2++) if (n = u2.indexOf(e2.charAt(i2)), !(n > 64)) {
    if (n < 0) return false;
    l3 += 6;
  }
  return l3 % 8 === 0;
}
function $n(e2) {
  var n, i2, l3 = e2.replace(/[\r\n=]/g, ""), r2 = l3.length, u2 = X2, o = 0, f2 = [];
  for (n = 0; n < r2; n++) n % 4 === 0 && n && (f2.push(o >> 16 & 255), f2.push(o >> 8 & 255), f2.push(o & 255)), o = o << 6 | u2.indexOf(l3.charAt(n));
  return i2 = r2 % 4 * 6, i2 === 0 ? (f2.push(o >> 16 & 255), f2.push(o >> 8 & 255), f2.push(o & 255)) : i2 === 18 ? (f2.push(o >> 10 & 255), f2.push(o >> 2 & 255)) : i2 === 12 && f2.push(o >> 4 & 255), new Uint8Array(f2);
}
function Qn(e2) {
  var n = "", i2 = 0, l3, r2, u2 = e2.length, o = X2;
  for (l3 = 0; l3 < u2; l3++) l3 % 3 === 0 && l3 && (n += o[i2 >> 18 & 63], n += o[i2 >> 12 & 63], n += o[i2 >> 6 & 63], n += o[i2 & 63]), i2 = (i2 << 8) + e2[l3];
  return r2 = u2 % 3, r2 === 0 ? (n += o[i2 >> 18 & 63], n += o[i2 >> 12 & 63], n += o[i2 >> 6 & 63], n += o[i2 & 63]) : r2 === 2 ? (n += o[i2 >> 10 & 63], n += o[i2 >> 4 & 63], n += o[i2 << 2 & 63], n += o[64]) : r2 === 1 && (n += o[i2 >> 2 & 63], n += o[i2 << 4 & 63], n += o[64], n += o[64]), n;
}
function Vn(e2) {
  return Object.prototype.toString.call(e2) === "[object Uint8Array]";
}
var Xn = new C2("tag:yaml.org,2002:binary", { kind: "scalar", resolve: Wn, construct: $n, predicate: Vn, represent: Qn });
var Zn = Object.prototype.hasOwnProperty;
var zn = Object.prototype.toString;
function Jn(e2) {
  if (e2 === null) return true;
  var n = [], i2, l3, r2, u2, o, f2 = e2;
  for (i2 = 0, l3 = f2.length; i2 < l3; i2 += 1) {
    if (r2 = f2[i2], o = false, zn.call(r2) !== "[object Object]") return false;
    for (u2 in r2) if (Zn.call(r2, u2)) if (!o) o = true;
    else return false;
    if (!o) return false;
    if (n.indexOf(u2) === -1) n.push(u2);
    else return false;
  }
  return true;
}
function ei(e2) {
  return e2 !== null ? e2 : [];
}
var ni = new C2("tag:yaml.org,2002:omap", { kind: "sequence", resolve: Jn, construct: ei });
var ii = Object.prototype.toString;
function ri(e2) {
  if (e2 === null) return true;
  var n, i2, l3, r2, u2, o = e2;
  for (u2 = new Array(o.length), n = 0, i2 = o.length; n < i2; n += 1) {
    if (l3 = o[n], ii.call(l3) !== "[object Object]" || (r2 = Object.keys(l3), r2.length !== 1)) return false;
    u2[n] = [r2[0], l3[r2[0]]];
  }
  return true;
}
function li(e2) {
  if (e2 === null) return [];
  var n, i2, l3, r2, u2, o = e2;
  for (u2 = new Array(o.length), n = 0, i2 = o.length; n < i2; n += 1) l3 = o[n], r2 = Object.keys(l3), u2[n] = [r2[0], l3[r2[0]]];
  return u2;
}
var oi = new C2("tag:yaml.org,2002:pairs", { kind: "sequence", resolve: ri, construct: li });
var ui = Object.prototype.hasOwnProperty;
function fi(e2) {
  if (e2 === null) return true;
  var n, i2 = e2;
  for (n in i2) if (ui.call(i2, n) && i2[n] !== null) return false;
  return true;
}
function ci(e2) {
  return e2 !== null ? e2 : {};
}
var ai = new C2("tag:yaml.org,2002:set", { kind: "mapping", resolve: fi, construct: ci });
var pe = Pn.extend({ implicit: [Kn, Gn], explicit: [Xn, ni, oi, ai] });
var T2 = Object.prototype.hasOwnProperty;
var H3 = 1;
var te = 2;
var he = 3;
var U3 = 4;
var Z2 = 1;
var pi = 2;
var de = 3;
var ti = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var hi = /[\x85\u2028\u2029]/;
var di = /[,\[\]\{\}]/;
var se = /^(?:!|!!|![a-z\-]+!)$/i;
var xe = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function me(e2) {
  return Object.prototype.toString.call(e2);
}
function S2(e2) {
  return e2 === 10 || e2 === 13;
}
function I2(e2) {
  return e2 === 9 || e2 === 32;
}
function b2(e2) {
  return e2 === 9 || e2 === 32 || e2 === 10 || e2 === 13;
}
function k2(e2) {
  return e2 === 44 || e2 === 91 || e2 === 93 || e2 === 123 || e2 === 125;
}
function si(e2) {
  var n;
  return 48 <= e2 && e2 <= 57 ? e2 - 48 : (n = e2 | 32, 97 <= n && n <= 102 ? n - 97 + 10 : -1);
}
function xi(e2) {
  return e2 === 120 ? 2 : e2 === 117 ? 4 : e2 === 85 ? 8 : 0;
}
function mi(e2) {
  return 48 <= e2 && e2 <= 57 ? e2 - 48 : -1;
}
function ge(e2) {
  return e2 === 48 ? "\0" : e2 === 97 ? "\x07" : e2 === 98 ? "\b" : e2 === 116 || e2 === 9 ? "	" : e2 === 110 ? `
` : e2 === 118 ? "\v" : e2 === 102 ? "\f" : e2 === 114 ? "\r" : e2 === 101 ? "\x1B" : e2 === 32 ? " " : e2 === 34 ? '"' : e2 === 47 ? "/" : e2 === 92 ? "\\" : e2 === 78 ? "" : e2 === 95 ? " " : e2 === 76 ? "\u2028" : e2 === 80 ? "\u2029" : "";
}
function gi(e2) {
  return e2 <= 65535 ? String.fromCharCode(e2) : String.fromCharCode((e2 - 65536 >> 10) + 55296, (e2 - 65536 & 1023) + 56320);
}
for (Ae = new Array(256), ve2 = new Array(256), L2 = 0; L2 < 256; L2++) Ae[L2] = ge(L2) ? 1 : 0, ve2[L2] = ge(L2);
var Ae;
var ve2;
var L2;
function Ai(e2, n) {
  this.input = e2, this.filename = n.filename || null, this.schema = n.schema || pe, this.onWarning = n.onWarning || null, this.legacy = n.legacy || false, this.json = n.json || false, this.listener = n.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e2.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function ye(e2, n) {
  var i2 = { name: e2.filename, buffer: e2.input.slice(0, -1), position: e2.position, line: e2.line, column: e2.position - e2.lineStart };
  return i2.snippet = on(i2), new w2(n, i2);
}
function h2(e2, n) {
  throw ye(e2, n);
}
function K2(e2, n) {
  e2.onWarning && e2.onWarning.call(null, ye(e2, n));
}
var Ce = { YAML: function(n, i2, l3) {
  var r2, u2, o;
  n.version !== null && h2(n, "duplication of %YAML directive"), l3.length !== 1 && h2(n, "YAML directive accepts exactly one argument"), r2 = /^([0-9]+)\.([0-9]+)$/.exec(l3[0]), r2 === null && h2(n, "ill-formed argument of the YAML directive"), u2 = parseInt(r2[1], 10), o = parseInt(r2[2], 10), u2 !== 1 && h2(n, "unacceptable YAML version of the document"), n.version = l3[0], n.checkLineBreaks = o < 2, o !== 1 && o !== 2 && K2(n, "unsupported YAML version of the document");
}, TAG: function(n, i2, l3) {
  var r2, u2;
  l3.length !== 2 && h2(n, "TAG directive accepts exactly two arguments"), r2 = l3[0], u2 = l3[1], se.test(r2) || h2(n, "ill-formed tag handle (first argument) of the TAG directive"), T2.call(n.tagMap, r2) && h2(n, 'there is a previously declared suffix for "' + r2 + '" tag handle'), xe.test(u2) || h2(n, "ill-formed tag prefix (second argument) of the TAG directive");
  try {
    u2 = decodeURIComponent(u2);
  } catch {
    h2(n, "tag prefix is malformed: " + u2);
  }
  n.tagMap[r2] = u2;
} };
function O2(e2, n, i2, l3) {
  var r2, u2, o, f2;
  if (n < i2) {
    if (f2 = e2.input.slice(n, i2), l3) for (r2 = 0, u2 = f2.length; r2 < u2; r2 += 1) o = f2.charCodeAt(r2), o === 9 || 32 <= o && o <= 1114111 || h2(e2, "expected valid JSON character");
    else ti.test(f2) && h2(e2, "the stream contains non-printable characters");
    e2.result += f2;
  }
}
function _e(e2, n, i2, l3) {
  var r2, u2, o, f2;
  for (y2.isObject(i2) || h2(e2, "cannot merge mappings; the provided source object is unacceptable"), r2 = Object.keys(i2), o = 0, f2 = r2.length; o < f2; o += 1) u2 = r2[o], T2.call(n, u2) || (n[u2] = i2[u2], l3[u2] = true);
}
function N3(e2, n, i2, l3, r2, u2, o, f2, c) {
  var a2, t2;
  if (Array.isArray(r2)) for (r2 = Array.prototype.slice.call(r2), a2 = 0, t2 = r2.length; a2 < t2; a2 += 1) Array.isArray(r2[a2]) && h2(e2, "nested arrays are not supported inside keys"), typeof r2 == "object" && me(r2[a2]) === "[object Object]" && (r2[a2] = "[object Object]");
  if (typeof r2 == "object" && me(r2) === "[object Object]" && (r2 = "[object Object]"), r2 = String(r2), n === null && (n = {}), l3 === "tag:yaml.org,2002:merge") if (Array.isArray(u2)) for (a2 = 0, t2 = u2.length; a2 < t2; a2 += 1) _e(e2, n, u2[a2], i2);
  else _e(e2, n, u2, i2);
  else !e2.json && !T2.call(i2, r2) && T2.call(n, r2) && (e2.line = o || e2.line, e2.lineStart = f2 || e2.lineStart, e2.position = c || e2.position, h2(e2, "duplicated mapping key")), r2 === "__proto__" ? Object.defineProperty(n, r2, { configurable: true, enumerable: true, writable: true, value: u2 }) : n[r2] = u2, delete i2[r2];
  return n;
}
function z(e2) {
  var n;
  n = e2.input.charCodeAt(e2.position), n === 10 ? e2.position++ : n === 13 ? (e2.position++, e2.input.charCodeAt(e2.position) === 10 && e2.position++) : h2(e2, "a line break is expected"), e2.line += 1, e2.lineStart = e2.position, e2.firstTabInLine = -1;
}
function v(e2, n, i2) {
  for (var l3 = 0, r2 = e2.input.charCodeAt(e2.position); r2 !== 0; ) {
    for (; I2(r2); ) r2 === 9 && e2.firstTabInLine === -1 && (e2.firstTabInLine = e2.position), r2 = e2.input.charCodeAt(++e2.position);
    if (n && r2 === 35) do
      r2 = e2.input.charCodeAt(++e2.position);
    while (r2 !== 10 && r2 !== 13 && r2 !== 0);
    if (S2(r2)) for (z(e2), r2 = e2.input.charCodeAt(e2.position), l3++, e2.lineIndent = 0; r2 === 32; ) e2.lineIndent++, r2 = e2.input.charCodeAt(++e2.position);
    else break;
  }
  return i2 !== -1 && l3 !== 0 && e2.lineIndent < i2 && K2(e2, "deficient indentation"), l3;
}
function q3(e2) {
  var n = e2.position, i2;
  return i2 = e2.input.charCodeAt(n), !!((i2 === 45 || i2 === 46) && i2 === e2.input.charCodeAt(n + 1) && i2 === e2.input.charCodeAt(n + 2) && (n += 3, i2 = e2.input.charCodeAt(n), i2 === 0 || b2(i2)));
}
function J2(e2, n) {
  n === 1 ? e2.result += " " : n > 1 && (e2.result += y2.repeat(`
`, n - 1));
}
function vi(e2, n, i2) {
  var l3, r2, u2, o, f2, c, a2, t2, p = e2.kind, d2 = e2.result, s2;
  if (s2 = e2.input.charCodeAt(e2.position), b2(s2) || k2(s2) || s2 === 35 || s2 === 38 || s2 === 42 || s2 === 33 || s2 === 124 || s2 === 62 || s2 === 39 || s2 === 34 || s2 === 37 || s2 === 64 || s2 === 96 || (s2 === 63 || s2 === 45) && (r2 = e2.input.charCodeAt(e2.position + 1), b2(r2) || i2 && k2(r2))) return false;
  for (e2.kind = "scalar", e2.result = "", u2 = o = e2.position, f2 = false; s2 !== 0; ) {
    if (s2 === 58) {
      if (r2 = e2.input.charCodeAt(e2.position + 1), b2(r2) || i2 && k2(r2)) break;
    } else if (s2 === 35) {
      if (l3 = e2.input.charCodeAt(e2.position - 1), b2(l3)) break;
    } else {
      if (e2.position === e2.lineStart && q3(e2) || i2 && k2(s2)) break;
      if (S2(s2)) if (c = e2.line, a2 = e2.lineStart, t2 = e2.lineIndent, v(e2, false, -1), e2.lineIndent >= n) {
        f2 = true, s2 = e2.input.charCodeAt(e2.position);
        continue;
      } else {
        e2.position = o, e2.line = c, e2.lineStart = a2, e2.lineIndent = t2;
        break;
      }
    }
    f2 && (O2(e2, u2, o, false), J2(e2, e2.line - c), u2 = o = e2.position, f2 = false), I2(s2) || (o = e2.position + 1), s2 = e2.input.charCodeAt(++e2.position);
  }
  return O2(e2, u2, o, false), e2.result ? true : (e2.kind = p, e2.result = d2, false);
}
function yi(e2, n) {
  var i2, l3, r2;
  if (i2 = e2.input.charCodeAt(e2.position), i2 !== 39) return false;
  for (e2.kind = "scalar", e2.result = "", e2.position++, l3 = r2 = e2.position; (i2 = e2.input.charCodeAt(e2.position)) !== 0; ) if (i2 === 39) if (O2(e2, l3, e2.position, true), i2 = e2.input.charCodeAt(++e2.position), i2 === 39) l3 = e2.position, e2.position++, r2 = e2.position;
  else return true;
  else S2(i2) ? (O2(e2, l3, r2, true), J2(e2, v(e2, false, n)), l3 = r2 = e2.position) : e2.position === e2.lineStart && q3(e2) ? h2(e2, "unexpected end of the document within a single quoted scalar") : (e2.position++, r2 = e2.position);
  h2(e2, "unexpected end of the stream within a single quoted scalar");
}
function Ci(e2, n) {
  var i2, l3, r2, u2, o, f2;
  if (f2 = e2.input.charCodeAt(e2.position), f2 !== 34) return false;
  for (e2.kind = "scalar", e2.result = "", e2.position++, i2 = l3 = e2.position; (f2 = e2.input.charCodeAt(e2.position)) !== 0; ) {
    if (f2 === 34) return O2(e2, i2, e2.position, true), e2.position++, true;
    if (f2 === 92) {
      if (O2(e2, i2, e2.position, true), f2 = e2.input.charCodeAt(++e2.position), S2(f2)) v(e2, false, n);
      else if (f2 < 256 && Ae[f2]) e2.result += ve2[f2], e2.position++;
      else if ((o = xi(f2)) > 0) {
        for (r2 = o, u2 = 0; r2 > 0; r2--) f2 = e2.input.charCodeAt(++e2.position), (o = si(f2)) >= 0 ? u2 = (u2 << 4) + o : h2(e2, "expected hexadecimal character");
        e2.result += gi(u2), e2.position++;
      } else h2(e2, "unknown escape sequence");
      i2 = l3 = e2.position;
    } else S2(f2) ? (O2(e2, i2, l3, true), J2(e2, v(e2, false, n)), i2 = l3 = e2.position) : e2.position === e2.lineStart && q3(e2) ? h2(e2, "unexpected end of the document within a double quoted scalar") : (e2.position++, l3 = e2.position);
  }
  h2(e2, "unexpected end of the stream within a double quoted scalar");
}
function _i(e2, n) {
  var i2 = true, l3, r2, u2, o = e2.tag, f2, c = e2.anchor, a2, t2, p, d2, s2, x3 = /* @__PURE__ */ Object.create(null), g2, A, F, m3;
  if (m3 = e2.input.charCodeAt(e2.position), m3 === 91) t2 = 93, s2 = false, f2 = [];
  else if (m3 === 123) t2 = 125, s2 = true, f2 = {};
  else return false;
  for (e2.anchor !== null && (e2.anchorMap[e2.anchor] = f2), m3 = e2.input.charCodeAt(++e2.position); m3 !== 0; ) {
    if (v(e2, true, n), m3 = e2.input.charCodeAt(e2.position), m3 === t2) return e2.position++, e2.tag = o, e2.anchor = c, e2.kind = s2 ? "mapping" : "sequence", e2.result = f2, true;
    i2 ? m3 === 44 && h2(e2, "expected the node content, but found ','") : h2(e2, "missed comma between flow collection entries"), A = g2 = F = null, p = d2 = false, m3 === 63 && (a2 = e2.input.charCodeAt(e2.position + 1), b2(a2) && (p = d2 = true, e2.position++, v(e2, true, n))), l3 = e2.line, r2 = e2.lineStart, u2 = e2.position, R(e2, n, H3, false, true), A = e2.tag, g2 = e2.result, v(e2, true, n), m3 = e2.input.charCodeAt(e2.position), (d2 || e2.line === l3) && m3 === 58 && (p = true, m3 = e2.input.charCodeAt(++e2.position), v(e2, true, n), R(e2, n, H3, false, true), F = e2.result), s2 ? N3(e2, f2, x3, A, g2, F, l3, r2, u2) : p ? f2.push(N3(e2, null, x3, A, g2, F, l3, r2, u2)) : f2.push(g2), v(e2, true, n), m3 = e2.input.charCodeAt(e2.position), m3 === 44 ? (i2 = true, m3 = e2.input.charCodeAt(++e2.position)) : i2 = false;
  }
  h2(e2, "unexpected end of the stream within a flow collection");
}
function wi(e2, n) {
  var i2, l3, r2 = Z2, u2 = false, o = false, f2 = n, c = 0, a2 = false, t2, p;
  if (p = e2.input.charCodeAt(e2.position), p === 124) l3 = false;
  else if (p === 62) l3 = true;
  else return false;
  for (e2.kind = "scalar", e2.result = ""; p !== 0; ) if (p = e2.input.charCodeAt(++e2.position), p === 43 || p === 45) Z2 === r2 ? r2 = p === 43 ? de : pi : h2(e2, "repeat of a chomping mode identifier");
  else if ((t2 = mi(p)) >= 0) t2 === 0 ? h2(e2, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? h2(e2, "repeat of an indentation width identifier") : (f2 = n + t2 - 1, o = true);
  else break;
  if (I2(p)) {
    do
      p = e2.input.charCodeAt(++e2.position);
    while (I2(p));
    if (p === 35) do
      p = e2.input.charCodeAt(++e2.position);
    while (!S2(p) && p !== 0);
  }
  for (; p !== 0; ) {
    for (z(e2), e2.lineIndent = 0, p = e2.input.charCodeAt(e2.position); (!o || e2.lineIndent < f2) && p === 32; ) e2.lineIndent++, p = e2.input.charCodeAt(++e2.position);
    if (!o && e2.lineIndent > f2 && (f2 = e2.lineIndent), S2(p)) {
      c++;
      continue;
    }
    if (e2.lineIndent < f2) {
      r2 === de ? e2.result += y2.repeat(`
`, u2 ? 1 + c : c) : r2 === Z2 && u2 && (e2.result += `
`);
      break;
    }
    for (l3 ? I2(p) ? (a2 = true, e2.result += y2.repeat(`
`, u2 ? 1 + c : c)) : a2 ? (a2 = false, e2.result += y2.repeat(`
`, c + 1)) : c === 0 ? u2 && (e2.result += " ") : e2.result += y2.repeat(`
`, c) : e2.result += y2.repeat(`
`, u2 ? 1 + c : c), u2 = true, o = true, c = 0, i2 = e2.position; !S2(p) && p !== 0; ) p = e2.input.charCodeAt(++e2.position);
    O2(e2, i2, e2.position, false);
  }
  return true;
}
function we(e2, n) {
  var i2, l3 = e2.tag, r2 = e2.anchor, u2 = [], o, f2 = false, c;
  if (e2.firstTabInLine !== -1) return false;
  for (e2.anchor !== null && (e2.anchorMap[e2.anchor] = u2), c = e2.input.charCodeAt(e2.position); c !== 0 && (e2.firstTabInLine !== -1 && (e2.position = e2.firstTabInLine, h2(e2, "tab characters must not be used in indentation")), !(c !== 45 || (o = e2.input.charCodeAt(e2.position + 1), !b2(o)))); ) {
    if (f2 = true, e2.position++, v(e2, true, -1) && e2.lineIndent <= n) {
      u2.push(null), c = e2.input.charCodeAt(e2.position);
      continue;
    }
    if (i2 = e2.line, R(e2, n, he, false, true), u2.push(e2.result), v(e2, true, -1), c = e2.input.charCodeAt(e2.position), (e2.line === i2 || e2.lineIndent > n) && c !== 0) h2(e2, "bad indentation of a sequence entry");
    else if (e2.lineIndent < n) break;
  }
  return f2 ? (e2.tag = l3, e2.anchor = r2, e2.kind = "sequence", e2.result = u2, true) : false;
}
function bi(e2, n, i2) {
  var l3, r2, u2, o, f2, c, a2 = e2.tag, t2 = e2.anchor, p = {}, d2 = /* @__PURE__ */ Object.create(null), s2 = null, x3 = null, g2 = null, A = false, F = false, m3;
  if (e2.firstTabInLine !== -1) return false;
  for (e2.anchor !== null && (e2.anchorMap[e2.anchor] = p), m3 = e2.input.charCodeAt(e2.position); m3 !== 0; ) {
    if (!A && e2.firstTabInLine !== -1 && (e2.position = e2.firstTabInLine, h2(e2, "tab characters must not be used in indentation")), l3 = e2.input.charCodeAt(e2.position + 1), u2 = e2.line, (m3 === 63 || m3 === 58) && b2(l3)) m3 === 63 ? (A && (N3(e2, p, d2, s2, x3, null, o, f2, c), s2 = x3 = g2 = null), F = true, A = true, r2 = true) : A ? (A = false, r2 = true) : h2(e2, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e2.position += 1, m3 = l3;
    else {
      if (o = e2.line, f2 = e2.lineStart, c = e2.position, !R(e2, i2, te, false, true)) break;
      if (e2.line === u2) {
        for (m3 = e2.input.charCodeAt(e2.position); I2(m3); ) m3 = e2.input.charCodeAt(++e2.position);
        if (m3 === 58) m3 = e2.input.charCodeAt(++e2.position), b2(m3) || h2(e2, "a whitespace character is expected after the key-value separator within a block mapping"), A && (N3(e2, p, d2, s2, x3, null, o, f2, c), s2 = x3 = g2 = null), F = true, A = false, r2 = false, s2 = e2.tag, x3 = e2.result;
        else if (F) h2(e2, "can not read an implicit mapping pair; a colon is missed");
        else return e2.tag = a2, e2.anchor = t2, true;
      } else if (F) h2(e2, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else return e2.tag = a2, e2.anchor = t2, true;
    }
    if ((e2.line === u2 || e2.lineIndent > n) && (A && (o = e2.line, f2 = e2.lineStart, c = e2.position), R(e2, n, U3, true, r2) && (A ? x3 = e2.result : g2 = e2.result), A || (N3(e2, p, d2, s2, x3, g2, o, f2, c), s2 = x3 = g2 = null), v(e2, true, -1), m3 = e2.input.charCodeAt(e2.position)), (e2.line === u2 || e2.lineIndent > n) && m3 !== 0) h2(e2, "bad indentation of a mapping entry");
    else if (e2.lineIndent < n) break;
  }
  return A && N3(e2, p, d2, s2, x3, null, o, f2, c), F && (e2.tag = a2, e2.anchor = t2, e2.kind = "mapping", e2.result = p), F;
}
function Fi(e2) {
  var n, i2 = false, l3 = false, r2, u2, o;
  if (o = e2.input.charCodeAt(e2.position), o !== 33) return false;
  if (e2.tag !== null && h2(e2, "duplication of a tag property"), o = e2.input.charCodeAt(++e2.position), o === 60 ? (i2 = true, o = e2.input.charCodeAt(++e2.position)) : o === 33 ? (l3 = true, r2 = "!!", o = e2.input.charCodeAt(++e2.position)) : r2 = "!", n = e2.position, i2) {
    do
      o = e2.input.charCodeAt(++e2.position);
    while (o !== 0 && o !== 62);
    e2.position < e2.length ? (u2 = e2.input.slice(n, e2.position), o = e2.input.charCodeAt(++e2.position)) : h2(e2, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !b2(o); ) o === 33 && (l3 ? h2(e2, "tag suffix cannot contain exclamation marks") : (r2 = e2.input.slice(n - 1, e2.position + 1), se.test(r2) || h2(e2, "named tag handle cannot contain such characters"), l3 = true, n = e2.position + 1)), o = e2.input.charCodeAt(++e2.position);
    u2 = e2.input.slice(n, e2.position), di.test(u2) && h2(e2, "tag suffix cannot contain flow indicator characters");
  }
  u2 && !xe.test(u2) && h2(e2, "tag name cannot contain such characters: " + u2);
  try {
    u2 = decodeURIComponent(u2);
  } catch {
    h2(e2, "tag name is malformed: " + u2);
  }
  return i2 ? e2.tag = u2 : T2.call(e2.tagMap, r2) ? e2.tag = e2.tagMap[r2] + u2 : r2 === "!" ? e2.tag = "!" + u2 : r2 === "!!" ? e2.tag = "tag:yaml.org,2002:" + u2 : h2(e2, 'undeclared tag handle "' + r2 + '"'), true;
}
function Si(e2) {
  var n, i2;
  if (i2 = e2.input.charCodeAt(e2.position), i2 !== 38) return false;
  for (e2.anchor !== null && h2(e2, "duplication of an anchor property"), i2 = e2.input.charCodeAt(++e2.position), n = e2.position; i2 !== 0 && !b2(i2) && !k2(i2); ) i2 = e2.input.charCodeAt(++e2.position);
  return e2.position === n && h2(e2, "name of an anchor node must contain at least one character"), e2.anchor = e2.input.slice(n, e2.position), true;
}
function Ei(e2) {
  var n, i2, l3;
  if (l3 = e2.input.charCodeAt(e2.position), l3 !== 42) return false;
  for (l3 = e2.input.charCodeAt(++e2.position), n = e2.position; l3 !== 0 && !b2(l3) && !k2(l3); ) l3 = e2.input.charCodeAt(++e2.position);
  return e2.position === n && h2(e2, "name of an alias node must contain at least one character"), i2 = e2.input.slice(n, e2.position), T2.call(e2.anchorMap, i2) || h2(e2, 'unidentified alias "' + i2 + '"'), e2.result = e2.anchorMap[i2], v(e2, true, -1), true;
}
function R(e2, n, i2, l3, r2) {
  var u2, o, f2, c = 1, a2 = false, t2 = false, p, d2, s2, x3, g2, A;
  if (e2.listener !== null && e2.listener("open", e2), e2.tag = null, e2.anchor = null, e2.kind = null, e2.result = null, u2 = o = f2 = U3 === i2 || he === i2, l3 && v(e2, true, -1) && (a2 = true, e2.lineIndent > n ? c = 1 : e2.lineIndent === n ? c = 0 : e2.lineIndent < n && (c = -1)), c === 1) for (; Fi(e2) || Si(e2); ) v(e2, true, -1) ? (a2 = true, f2 = u2, e2.lineIndent > n ? c = 1 : e2.lineIndent === n ? c = 0 : e2.lineIndent < n && (c = -1)) : f2 = false;
  if (f2 && (f2 = a2 || r2), (c === 1 || U3 === i2) && (H3 === i2 || te === i2 ? g2 = n : g2 = n + 1, A = e2.position - e2.lineStart, c === 1 ? f2 && (we(e2, A) || bi(e2, A, g2)) || _i(e2, g2) ? t2 = true : (o && wi(e2, g2) || yi(e2, g2) || Ci(e2, g2) ? t2 = true : Ei(e2) ? (t2 = true, (e2.tag !== null || e2.anchor !== null) && h2(e2, "alias node should not have any properties")) : vi(e2, g2, H3 === i2) && (t2 = true, e2.tag === null && (e2.tag = "?")), e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result)) : c === 0 && (t2 = f2 && we(e2, A))), e2.tag === null) e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result);
  else if (e2.tag === "?") {
    for (e2.result !== null && e2.kind !== "scalar" && h2(e2, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e2.kind + '"'), p = 0, d2 = e2.implicitTypes.length; p < d2; p += 1) if (x3 = e2.implicitTypes[p], x3.resolve(e2.result)) {
      e2.result = x3.construct(e2.result), e2.tag = x3.tag, e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result);
      break;
    }
  } else if (e2.tag !== "!") {
    if (T2.call(e2.typeMap[e2.kind || "fallback"], e2.tag)) x3 = e2.typeMap[e2.kind || "fallback"][e2.tag];
    else for (x3 = null, s2 = e2.typeMap.multi[e2.kind || "fallback"], p = 0, d2 = s2.length; p < d2; p += 1) if (e2.tag.slice(0, s2[p].tag.length) === s2[p].tag) {
      x3 = s2[p];
      break;
    }
    x3 || h2(e2, "unknown tag !<" + e2.tag + ">"), e2.result !== null && x3.kind !== e2.kind && h2(e2, "unacceptable node kind for !<" + e2.tag + '> tag; it should be "' + x3.kind + '", not "' + e2.kind + '"'), x3.resolve(e2.result, e2.tag) ? (e2.result = x3.construct(e2.result, e2.tag), e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result)) : h2(e2, "cannot resolve a node with !<" + e2.tag + "> explicit tag");
  }
  return e2.listener !== null && e2.listener("close", e2), e2.tag !== null || e2.anchor !== null || t2;
}
function Ti(e2) {
  var n = e2.position, i2, l3, r2, u2 = false, o;
  for (e2.version = null, e2.checkLineBreaks = e2.legacy, e2.tagMap = /* @__PURE__ */ Object.create(null), e2.anchorMap = /* @__PURE__ */ Object.create(null); (o = e2.input.charCodeAt(e2.position)) !== 0 && (v(e2, true, -1), o = e2.input.charCodeAt(e2.position), !(e2.lineIndent > 0 || o !== 37)); ) {
    for (u2 = true, o = e2.input.charCodeAt(++e2.position), i2 = e2.position; o !== 0 && !b2(o); ) o = e2.input.charCodeAt(++e2.position);
    for (l3 = e2.input.slice(i2, e2.position), r2 = [], l3.length < 1 && h2(e2, "directive name must not be less than one character in length"); o !== 0; ) {
      for (; I2(o); ) o = e2.input.charCodeAt(++e2.position);
      if (o === 35) {
        do
          o = e2.input.charCodeAt(++e2.position);
        while (o !== 0 && !S2(o));
        break;
      }
      if (S2(o)) break;
      for (i2 = e2.position; o !== 0 && !b2(o); ) o = e2.input.charCodeAt(++e2.position);
      r2.push(e2.input.slice(i2, e2.position));
    }
    o !== 0 && z(e2), T2.call(Ce, l3) ? Ce[l3](e2, l3, r2) : K2(e2, 'unknown document directive "' + l3 + '"');
  }
  if (v(e2, true, -1), e2.lineIndent === 0 && e2.input.charCodeAt(e2.position) === 45 && e2.input.charCodeAt(e2.position + 1) === 45 && e2.input.charCodeAt(e2.position + 2) === 45 ? (e2.position += 3, v(e2, true, -1)) : u2 && h2(e2, "directives end mark is expected"), R(e2, e2.lineIndent - 1, U3, false, true), v(e2, true, -1), e2.checkLineBreaks && hi.test(e2.input.slice(n, e2.position)) && K2(e2, "non-ASCII line breaks are interpreted as content"), e2.documents.push(e2.result), e2.position === e2.lineStart && q3(e2)) {
    e2.input.charCodeAt(e2.position) === 46 && (e2.position += 3, v(e2, true, -1));
    return;
  }
  if (e2.position < e2.length - 1) h2(e2, "end of the stream or a document separator is expected");
  else return;
}
function be(e2, n) {
  e2 = String(e2), n = n || {}, e2.length !== 0 && (e2.charCodeAt(e2.length - 1) !== 10 && e2.charCodeAt(e2.length - 1) !== 13 && (e2 += `
`), e2.charCodeAt(0) === 65279 && (e2 = e2.slice(1)));
  var i2 = new Ai(e2, n), l3 = e2.indexOf("\0");
  for (l3 !== -1 && (i2.position = l3, h2(i2, "null byte is not allowed in input")), i2.input += "\0"; i2.input.charCodeAt(i2.position) === 32; ) i2.lineIndent += 1, i2.position += 1;
  for (; i2.position < i2.length - 1; ) Ti(i2);
  return i2.documents;
}
function Oi(e2, n, i2) {
  n !== null && typeof n == "object" && typeof i2 > "u" && (i2 = n, n = null);
  var l3 = be(e2, i2);
  if (typeof n != "function") return l3;
  for (var r2 = 0, u2 = l3.length; r2 < u2; r2 += 1) n(l3[r2]);
}
function Ii(e2, n) {
  var i2 = be(e2, n);
  if (i2.length !== 0) {
    if (i2.length === 1) return i2[0];
    throw new w2("expected a single document in the stream, but found more");
  }
}
var ki = Oi;
var Li = Ii;
var Ni = { loadAll: ki, load: Li };
var Fe = Object.prototype.toString;
var Se = Object.prototype.hasOwnProperty;
var ee = 65279;
var Ri = 9;
var Y2 = 10;
var Di = 13;
var Mi = 32;
var Yi = 33;
var Bi = 34;
var ne = 35;
var Pi = 37;
var ji = 38;
var Hi = 39;
var Ui = 42;
var Ee = 44;
var Ki = 45;
var G2 = 58;
var qi = 61;
var Gi = 62;
var Wi = 63;
var $i = 64;
var Te = 91;
var Oe = 93;
var Qi = 96;
var Ie = 123;
var Vi = 124;
var ke = 125;
var _2 = {};
_2[0] = "\\0", _2[7] = "\\a", _2[8] = "\\b", _2[9] = "\\t", _2[10] = "\\n", _2[11] = "\\v", _2[12] = "\\f", _2[13] = "\\r", _2[27] = "\\e", _2[34] = '\\"', _2[92] = "\\\\", _2[133] = "\\N", _2[160] = "\\_", _2[8232] = "\\L", _2[8233] = "\\P";
var Xi = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"];
var Zi = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function zi(e2, n) {
  var i2, l3, r2, u2, o, f2, c;
  if (n === null) return {};
  for (i2 = {}, l3 = Object.keys(n), r2 = 0, u2 = l3.length; r2 < u2; r2 += 1) o = l3[r2], f2 = String(n[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), c = e2.compiledTypeMap.fallback[o], c && Se.call(c.styleAliases, f2) && (f2 = c.styleAliases[f2]), i2[o] = f2;
  return i2;
}
function Ji(e2) {
  var n, i2, l3;
  if (n = e2.toString(16).toUpperCase(), e2 <= 255) i2 = "x", l3 = 2;
  else if (e2 <= 65535) i2 = "u", l3 = 4;
  else if (e2 <= 4294967295) i2 = "U", l3 = 8;
  else throw new w2("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + i2 + y2.repeat("0", l3 - n.length) + n;
}
var er = 1;
var B = 2;
function nr(e2) {
  this.schema = e2.schema || pe, this.indent = Math.max(1, e2.indent || 2), this.noArrayIndent = e2.noArrayIndent || false, this.skipInvalid = e2.skipInvalid || false, this.flowLevel = y2.isNothing(e2.flowLevel) ? -1 : e2.flowLevel, this.styleMap = zi(this.schema, e2.styles || null), this.sortKeys = e2.sortKeys || false, this.lineWidth = e2.lineWidth || 80, this.noRefs = e2.noRefs || false, this.noCompatMode = e2.noCompatMode || false, this.condenseFlow = e2.condenseFlow || false, this.quotingType = e2.quotingType === '"' ? B : er, this.forceQuotes = e2.forceQuotes || false, this.replacer = typeof e2.replacer == "function" ? e2.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Le(e2, n) {
  for (var i2 = y2.repeat(" ", n), l3 = 0, r2 = -1, u2 = "", o, f2 = e2.length; l3 < f2; ) r2 = e2.indexOf(`
`, l3), r2 === -1 ? (o = e2.slice(l3), l3 = f2) : (o = e2.slice(l3, r2 + 1), l3 = r2 + 1), o.length && o !== `
` && (u2 += i2), u2 += o;
  return u2;
}
function ie(e2, n) {
  return `
` + y2.repeat(" ", e2.indent * n);
}
function ir(e2, n) {
  var i2, l3, r2;
  for (i2 = 0, l3 = e2.implicitTypes.length; i2 < l3; i2 += 1) if (r2 = e2.implicitTypes[i2], r2.resolve(n)) return true;
  return false;
}
function W3(e2) {
  return e2 === Mi || e2 === Ri;
}
function P2(e2) {
  return 32 <= e2 && e2 <= 126 || 161 <= e2 && e2 <= 55295 && e2 !== 8232 && e2 !== 8233 || 57344 <= e2 && e2 <= 65533 && e2 !== ee || 65536 <= e2 && e2 <= 1114111;
}
function Ne(e2) {
  return P2(e2) && e2 !== ee && e2 !== Di && e2 !== Y2;
}
function Re(e2, n, i2) {
  var l3 = Ne(e2), r2 = l3 && !W3(e2);
  return (i2 ? l3 : l3 && e2 !== Ee && e2 !== Te && e2 !== Oe && e2 !== Ie && e2 !== ke) && e2 !== ne && !(n === G2 && !r2) || Ne(n) && !W3(n) && e2 === ne || n === G2 && r2;
}
function rr(e2) {
  return P2(e2) && e2 !== ee && !W3(e2) && e2 !== Ki && e2 !== Wi && e2 !== G2 && e2 !== Ee && e2 !== Te && e2 !== Oe && e2 !== Ie && e2 !== ke && e2 !== ne && e2 !== ji && e2 !== Ui && e2 !== Yi && e2 !== Vi && e2 !== qi && e2 !== Gi && e2 !== Hi && e2 !== Bi && e2 !== Pi && e2 !== $i && e2 !== Qi;
}
function lr(e2) {
  return !W3(e2) && e2 !== G2;
}
function j(e2, n) {
  var i2 = e2.charCodeAt(n), l3;
  return i2 >= 55296 && i2 <= 56319 && n + 1 < e2.length && (l3 = e2.charCodeAt(n + 1), l3 >= 56320 && l3 <= 57343) ? (i2 - 55296) * 1024 + l3 - 56320 + 65536 : i2;
}
function De(e2) {
  var n = /^\n* /;
  return n.test(e2);
}
var Me = 1;
var re = 2;
var Ye = 3;
var Be = 4;
var D = 5;
function or(e2, n, i2, l3, r2, u2, o, f2) {
  var c, a2 = 0, t2 = null, p = false, d2 = false, s2 = l3 !== -1, x3 = -1, g2 = rr(j(e2, 0)) && lr(j(e2, e2.length - 1));
  if (n || o) for (c = 0; c < e2.length; a2 >= 65536 ? c += 2 : c++) {
    if (a2 = j(e2, c), !P2(a2)) return D;
    g2 = g2 && Re(a2, t2, f2), t2 = a2;
  }
  else {
    for (c = 0; c < e2.length; a2 >= 65536 ? c += 2 : c++) {
      if (a2 = j(e2, c), a2 === Y2) p = true, s2 && (d2 = d2 || c - x3 - 1 > l3 && e2[x3 + 1] !== " ", x3 = c);
      else if (!P2(a2)) return D;
      g2 = g2 && Re(a2, t2, f2), t2 = a2;
    }
    d2 = d2 || s2 && c - x3 - 1 > l3 && e2[x3 + 1] !== " ";
  }
  return !p && !d2 ? g2 && !o && !r2(e2) ? Me : u2 === B ? D : re : i2 > 9 && De(e2) ? D : o ? u2 === B ? D : re : d2 ? Be : Ye;
}
function ur(e2, n, i2, l3, r2) {
  e2.dump = function() {
    if (n.length === 0) return e2.quotingType === B ? '""' : "''";
    if (!e2.noCompatMode && (Xi.indexOf(n) !== -1 || Zi.test(n))) return e2.quotingType === B ? '"' + n + '"' : "'" + n + "'";
    var u2 = e2.indent * Math.max(1, i2), o = e2.lineWidth === -1 ? -1 : Math.max(Math.min(e2.lineWidth, 40), e2.lineWidth - u2), f2 = l3 || e2.flowLevel > -1 && i2 >= e2.flowLevel;
    function c(a2) {
      return ir(e2, a2);
    }
    switch (or(n, f2, e2.indent, o, c, e2.quotingType, e2.forceQuotes && !l3, r2)) {
      case Me:
        return n;
      case re:
        return "'" + n.replace(/'/g, "''") + "'";
      case Ye:
        return "|" + Pe(n, e2.indent) + je(Le(n, u2));
      case Be:
        return ">" + Pe(n, e2.indent) + je(Le(fr(n, o), u2));
      case D:
        return '"' + cr(n) + '"';
      default:
        throw new w2("impossible error: invalid scalar style");
    }
  }();
}
function Pe(e2, n) {
  var i2 = De(e2) ? String(n) : "", l3 = e2[e2.length - 1] === `
`, r2 = l3 && (e2[e2.length - 2] === `
` || e2 === `
`), u2 = r2 ? "+" : l3 ? "" : "-";
  return i2 + u2 + `
`;
}
function je(e2) {
  return e2[e2.length - 1] === `
` ? e2.slice(0, -1) : e2;
}
function fr(e2, n) {
  for (var i2 = /(\n+)([^\n]*)/g, l3 = function() {
    var a2 = e2.indexOf(`
`);
    return a2 = a2 !== -1 ? a2 : e2.length, i2.lastIndex = a2, He(e2.slice(0, a2), n);
  }(), r2 = e2[0] === `
` || e2[0] === " ", u2, o; o = i2.exec(e2); ) {
    var f2 = o[1], c = o[2];
    u2 = c[0] === " ", l3 += f2 + (!r2 && !u2 && c !== "" ? `
` : "") + He(c, n), r2 = u2;
  }
  return l3;
}
function He(e2, n) {
  if (e2 === "" || e2[0] === " ") return e2;
  for (var i2 = / [^ ]/g, l3, r2 = 0, u2, o = 0, f2 = 0, c = ""; l3 = i2.exec(e2); ) f2 = l3.index, f2 - r2 > n && (u2 = o > r2 ? o : f2, c += `
` + e2.slice(r2, u2), r2 = u2 + 1), o = f2;
  return c += `
`, e2.length - r2 > n && o > r2 ? c += e2.slice(r2, o) + `
` + e2.slice(o + 1) : c += e2.slice(r2), c.slice(1);
}
function cr(e2) {
  for (var n = "", i2 = 0, l3, r2 = 0; r2 < e2.length; i2 >= 65536 ? r2 += 2 : r2++) i2 = j(e2, r2), l3 = _2[i2], !l3 && P2(i2) ? (n += e2[r2], i2 >= 65536 && (n += e2[r2 + 1])) : n += l3 || Ji(i2);
  return n;
}
function ar(e2, n, i2) {
  var l3 = "", r2 = e2.tag, u2, o, f2;
  for (u2 = 0, o = i2.length; u2 < o; u2 += 1) f2 = i2[u2], e2.replacer && (f2 = e2.replacer.call(i2, String(u2), f2)), (E(e2, n, f2, false, false) || typeof f2 > "u" && E(e2, n, null, false, false)) && (l3 !== "" && (l3 += "," + (e2.condenseFlow ? "" : " ")), l3 += e2.dump);
  e2.tag = r2, e2.dump = "[" + l3 + "]";
}
function Ue(e2, n, i2, l3) {
  var r2 = "", u2 = e2.tag, o, f2, c;
  for (o = 0, f2 = i2.length; o < f2; o += 1) c = i2[o], e2.replacer && (c = e2.replacer.call(i2, String(o), c)), (E(e2, n + 1, c, true, true, false, true) || typeof c > "u" && E(e2, n + 1, null, true, true, false, true)) && ((!l3 || r2 !== "") && (r2 += ie(e2, n)), e2.dump && Y2 === e2.dump.charCodeAt(0) ? r2 += "-" : r2 += "- ", r2 += e2.dump);
  e2.tag = u2, e2.dump = r2 || "[]";
}
function pr(e2, n, i2) {
  var l3 = "", r2 = e2.tag, u2 = Object.keys(i2), o, f2, c, a2, t2;
  for (o = 0, f2 = u2.length; o < f2; o += 1) t2 = "", l3 !== "" && (t2 += ", "), e2.condenseFlow && (t2 += '"'), c = u2[o], a2 = i2[c], e2.replacer && (a2 = e2.replacer.call(i2, c, a2)), E(e2, n, c, false, false) && (e2.dump.length > 1024 && (t2 += "? "), t2 += e2.dump + (e2.condenseFlow ? '"' : "") + ":" + (e2.condenseFlow ? "" : " "), E(e2, n, a2, false, false) && (t2 += e2.dump, l3 += t2));
  e2.tag = r2, e2.dump = "{" + l3 + "}";
}
function tr(e2, n, i2, l3) {
  var r2 = "", u2 = e2.tag, o = Object.keys(i2), f2, c, a2, t2, p, d2;
  if (e2.sortKeys === true) o.sort();
  else if (typeof e2.sortKeys == "function") o.sort(e2.sortKeys);
  else if (e2.sortKeys) throw new w2("sortKeys must be a boolean or a function");
  for (f2 = 0, c = o.length; f2 < c; f2 += 1) d2 = "", (!l3 || r2 !== "") && (d2 += ie(e2, n)), a2 = o[f2], t2 = i2[a2], e2.replacer && (t2 = e2.replacer.call(i2, a2, t2)), E(e2, n + 1, a2, true, true, true) && (p = e2.tag !== null && e2.tag !== "?" || e2.dump && e2.dump.length > 1024, p && (e2.dump && Y2 === e2.dump.charCodeAt(0) ? d2 += "?" : d2 += "? "), d2 += e2.dump, p && (d2 += ie(e2, n)), E(e2, n + 1, t2, true, p) && (e2.dump && Y2 === e2.dump.charCodeAt(0) ? d2 += ":" : d2 += ": ", d2 += e2.dump, r2 += d2));
  e2.tag = u2, e2.dump = r2 || "{}";
}
function Ke(e2, n, i2) {
  var l3, r2, u2, o, f2, c;
  for (r2 = i2 ? e2.explicitTypes : e2.implicitTypes, u2 = 0, o = r2.length; u2 < o; u2 += 1) if (f2 = r2[u2], (f2.instanceOf || f2.predicate) && (!f2.instanceOf || typeof n == "object" && n instanceof f2.instanceOf) && (!f2.predicate || f2.predicate(n))) {
    if (i2 ? f2.multi && f2.representName ? e2.tag = f2.representName(n) : e2.tag = f2.tag : e2.tag = "?", f2.represent) {
      if (c = e2.styleMap[f2.tag] || f2.defaultStyle, Fe.call(f2.represent) === "[object Function]") l3 = f2.represent(n, c);
      else if (Se.call(f2.represent, c)) l3 = f2.represent[c](n, c);
      else throw new w2("!<" + f2.tag + '> tag resolver accepts not "' + c + '" style');
      e2.dump = l3;
    }
    return true;
  }
  return false;
}
function E(e2, n, i2, l3, r2, u2, o) {
  e2.tag = null, e2.dump = i2, Ke(e2, i2, false) || Ke(e2, i2, true);
  var f2 = Fe.call(e2.dump), c = l3, a2;
  l3 && (l3 = e2.flowLevel < 0 || e2.flowLevel > n);
  var t2 = f2 === "[object Object]" || f2 === "[object Array]", p, d2;
  if (t2 && (p = e2.duplicates.indexOf(i2), d2 = p !== -1), (e2.tag !== null && e2.tag !== "?" || d2 || e2.indent !== 2 && n > 0) && (r2 = false), d2 && e2.usedDuplicates[p]) e2.dump = "*ref_" + p;
  else {
    if (t2 && d2 && !e2.usedDuplicates[p] && (e2.usedDuplicates[p] = true), f2 === "[object Object]") l3 && Object.keys(e2.dump).length !== 0 ? (tr(e2, n, e2.dump, r2), d2 && (e2.dump = "&ref_" + p + e2.dump)) : (pr(e2, n, e2.dump), d2 && (e2.dump = "&ref_" + p + " " + e2.dump));
    else if (f2 === "[object Array]") l3 && e2.dump.length !== 0 ? (e2.noArrayIndent && !o && n > 0 ? Ue(e2, n - 1, e2.dump, r2) : Ue(e2, n, e2.dump, r2), d2 && (e2.dump = "&ref_" + p + e2.dump)) : (ar(e2, n, e2.dump), d2 && (e2.dump = "&ref_" + p + " " + e2.dump));
    else if (f2 === "[object String]") e2.tag !== "?" && ur(e2, e2.dump, n, u2, c);
    else {
      if (f2 === "[object Undefined]") return false;
      if (e2.skipInvalid) return false;
      throw new w2("unacceptable kind of an object to dump " + f2);
    }
    e2.tag !== null && e2.tag !== "?" && (a2 = encodeURI(e2.tag[0] === "!" ? e2.tag.slice(1) : e2.tag).replace(/!/g, "%21"), e2.tag[0] === "!" ? a2 = "!" + a2 : a2.slice(0, 18) === "tag:yaml.org,2002:" ? a2 = "!!" + a2.slice(18) : a2 = "!<" + a2 + ">", e2.dump = a2 + " " + e2.dump);
  }
  return true;
}
function hr(e2, n) {
  var i2 = [], l3 = [], r2, u2;
  for (le(e2, i2, l3), r2 = 0, u2 = l3.length; r2 < u2; r2 += 1) n.duplicates.push(i2[l3[r2]]);
  n.usedDuplicates = new Array(u2);
}
function le(e2, n, i2) {
  var l3, r2, u2;
  if (e2 !== null && typeof e2 == "object") if (r2 = n.indexOf(e2), r2 !== -1) i2.indexOf(r2) === -1 && i2.push(r2);
  else if (n.push(e2), Array.isArray(e2)) for (r2 = 0, u2 = e2.length; r2 < u2; r2 += 1) le(e2[r2], n, i2);
  else for (l3 = Object.keys(e2), r2 = 0, u2 = l3.length; r2 < u2; r2 += 1) le(e2[l3[r2]], n, i2);
}
function dr(e2, n) {
  n = n || {};
  var i2 = new nr(n);
  i2.noRefs || hr(e2, i2);
  var l3 = e2;
  return i2.replacer && (l3 = i2.replacer.call({ "": l3 }, "", l3)), E(i2, 0, l3, true, true) ? i2.dump + `
` : "";
}
var sr = dr;
var xr = { dump: sr };
var mr = Ni.load;
var gr = xr.dump;

// node_modules/confbox/dist/toml.mjs
var h3;
var m2;
var s;
h3 = /* @__PURE__ */ new WeakMap(), m2 = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap();

// node_modules/mlly/dist/index.mjs
var import_node_url = __toESM(require_node_url(), 1);
var import_node_assert = __toESM(require_node_assert(), 1);
var import_node_process = __toESM(require_node_process(), 1);
var import_node_path = __toESM(require_node_path(), 1);
var import_node_v8 = __toESM(require_node_v8(), 1);
var import_node_util = __toESM(require_node_util(), 1);
var BUILTIN_MODULES = new Set(import_node_module.builtinModules);
function normalizeSlash(path5) {
  return path5.replace(/\\/g, "/");
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
var own$1 = {}.hasOwnProperty;
var classRegExp = /^([A-Z][a-z\d]*)+$/;
var kTypes = /* @__PURE__ */ new Set([
  "string",
  "function",
  "number",
  "object",
  // Accept 'Function' and 'Object' as alternative to the lower cased version.
  "Function",
  "Object",
  "boolean",
  "bigint",
  "symbol"
]);
var codes = {};
function formatList(array, type = "and") {
  return array.length < 3 ? array.join(` ${type} `) : `${array.slice(0, -1).join(", ")}, ${type} ${array[array.length - 1]}`;
}
var messages = /* @__PURE__ */ new Map();
var nodeInternalPrefix = "__node_internal_";
var userStackTraceLimit;
codes.ERR_INVALID_ARG_TYPE = createError(
  "ERR_INVALID_ARG_TYPE",
  /**
   * @param {string} name
   * @param {Array<string> | string} expected
   * @param {unknown} actual
   */
  (name, expected, actual) => {
    (0, import_node_assert.default)(typeof name === "string", "'name' must be a string");
    if (!Array.isArray(expected)) {
      expected = [expected];
    }
    let message = "The ";
    if (name.endsWith(" argument")) {
      message += `${name} `;
    } else {
      const type = name.includes(".") ? "property" : "argument";
      message += `"${name}" ${type} `;
    }
    message += "must be ";
    const types2 = [];
    const instances = [];
    const other = [];
    for (const value of expected) {
      (0, import_node_assert.default)(
        typeof value === "string",
        "All expected entries have to be of type string"
      );
      if (kTypes.has(value)) {
        types2.push(value.toLowerCase());
      } else if (classRegExp.exec(value) === null) {
        (0, import_node_assert.default)(
          value !== "object",
          'The value "object" should be written as "Object"'
        );
        other.push(value);
      } else {
        instances.push(value);
      }
    }
    if (instances.length > 0) {
      const pos = types2.indexOf("object");
      if (pos !== -1) {
        types2.slice(pos, 1);
        instances.push("Object");
      }
    }
    if (types2.length > 0) {
      message += `${types2.length > 1 ? "one of type" : "of type"} ${formatList(
        types2,
        "or"
      )}`;
      if (instances.length > 0 || other.length > 0) message += " or ";
    }
    if (instances.length > 0) {
      message += `an instance of ${formatList(instances, "or")}`;
      if (other.length > 0) message += " or ";
    }
    if (other.length > 0) {
      if (other.length > 1) {
        message += `one of ${formatList(other, "or")}`;
      } else {
        if (other[0].toLowerCase() !== other[0]) message += "an ";
        message += `${other[0]}`;
      }
    }
    message += `. Received ${determineSpecificType(actual)}`;
    return message;
  },
  TypeError
);
codes.ERR_INVALID_MODULE_SPECIFIER = createError(
  "ERR_INVALID_MODULE_SPECIFIER",
  /**
   * @param {string} request
   * @param {string} reason
   * @param {string} [base]
   */
  (request, reason, base = void 0) => {
    return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
  },
  TypeError
);
codes.ERR_INVALID_PACKAGE_CONFIG = createError(
  "ERR_INVALID_PACKAGE_CONFIG",
  /**
   * @param {string} path
   * @param {string} [base]
   * @param {string} [message]
   */
  (path5, base, message) => {
    return `Invalid package config ${path5}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
  },
  Error
);
codes.ERR_INVALID_PACKAGE_TARGET = createError(
  "ERR_INVALID_PACKAGE_TARGET",
  /**
   * @param {string} packagePath
   * @param {string} key
   * @param {unknown} target
   * @param {boolean} [isImport=false]
   * @param {string} [base]
   */
  (packagePath, key, target, isImport = false, base = void 0) => {
    const relatedError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
    if (key === ".") {
      (0, import_node_assert.default)(isImport === false);
      return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
    }
    return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(
      target
    )} defined for '${key}' in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
  },
  Error
);
codes.ERR_MODULE_NOT_FOUND = createError(
  "ERR_MODULE_NOT_FOUND",
  /**
   * @param {string} path
   * @param {string} base
   * @param {boolean} [exactUrl]
   */
  (path5, base, exactUrl = false) => {
    return `Cannot find ${exactUrl ? "module" : "package"} '${path5}' imported from ${base}`;
  },
  Error
);
codes.ERR_NETWORK_IMPORT_DISALLOWED = createError(
  "ERR_NETWORK_IMPORT_DISALLOWED",
  "import of '%s' by %s is not supported: %s",
  Error
);
codes.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError(
  "ERR_PACKAGE_IMPORT_NOT_DEFINED",
  /**
   * @param {string} specifier
   * @param {string} packagePath
   * @param {string} base
   */
  (specifier, packagePath, base) => {
    return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath}package.json` : ""} imported from ${base}`;
  },
  TypeError
);
codes.ERR_PACKAGE_PATH_NOT_EXPORTED = createError(
  "ERR_PACKAGE_PATH_NOT_EXPORTED",
  /**
   * @param {string} packagePath
   * @param {string} subpath
   * @param {string} [base]
   */
  (packagePath, subpath, base = void 0) => {
    if (subpath === ".")
      return `No "exports" main defined in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
    return `Package subpath '${subpath}' is not defined by "exports" in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
  },
  Error
);
codes.ERR_UNSUPPORTED_DIR_IMPORT = createError(
  "ERR_UNSUPPORTED_DIR_IMPORT",
  "Directory import '%s' is not supported resolving ES modules imported from %s",
  Error
);
codes.ERR_UNSUPPORTED_RESOLVE_REQUEST = createError(
  "ERR_UNSUPPORTED_RESOLVE_REQUEST",
  'Failed to resolve module specifier "%s" from "%s": Invalid relative URL or base scheme is not hierarchical.',
  TypeError
);
codes.ERR_UNKNOWN_FILE_EXTENSION = createError(
  "ERR_UNKNOWN_FILE_EXTENSION",
  /**
   * @param {string} extension
   * @param {string} path
   */
  (extension, path5) => {
    return `Unknown file extension "${extension}" for ${path5}`;
  },
  TypeError
);
codes.ERR_INVALID_ARG_VALUE = createError(
  "ERR_INVALID_ARG_VALUE",
  /**
   * @param {string} name
   * @param {unknown} value
   * @param {string} [reason='is invalid']
   */
  (name, value, reason = "is invalid") => {
    let inspected = (0, import_node_util.inspect)(value);
    if (inspected.length > 128) {
      inspected = `${inspected.slice(0, 128)}...`;
    }
    const type = name.includes(".") ? "property" : "argument";
    return `The ${type} '${name}' ${reason}. Received ${inspected}`;
  },
  TypeError
  // Note: extra classes have been shaken out.
  // , RangeError
);
function createError(sym, value, constructor) {
  messages.set(sym, value);
  return makeNodeErrorWithCode(constructor, sym);
}
function makeNodeErrorWithCode(Base, key) {
  return NodeError;
  function NodeError(...parameters) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    const error = new Base();
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = limit;
    const message = getMessage(key, parameters, error);
    Object.defineProperties(error, {
      // Note: no need to implement `kIsNodeError` symbol, would be hard,
      // probably.
      message: {
        value: message,
        enumerable: false,
        writable: true,
        configurable: true
      },
      toString: {
        /** @this {Error} */
        value() {
          return `${this.name} [${key}]: ${this.message}`;
        },
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    captureLargerStackTrace(error);
    error.code = key;
    return error;
  }
}
function isErrorStackTraceLimitWritable() {
  try {
    if (import_node_v8.default.startupSnapshot.isBuildingSnapshot()) {
      return false;
    }
  } catch {
  }
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) {
    return Object.isExtensible(Error);
  }
  return own$1.call(desc, "writable") && desc.writable !== void 0 ? desc.writable : desc.set !== void 0;
}
function hideStackFrames(wrappedFunction) {
  const hidden = nodeInternalPrefix + wrappedFunction.name;
  Object.defineProperty(wrappedFunction, "name", { value: hidden });
  return wrappedFunction;
}
var captureLargerStackTrace = hideStackFrames(
  /**
   * @param {Error} error
   * @returns {Error}
   */
  // @ts-expect-error: fine
  function(error) {
    const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
    if (stackTraceLimitIsWritable) {
      userStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = Number.POSITIVE_INFINITY;
    }
    Error.captureStackTrace(error);
    if (stackTraceLimitIsWritable) Error.stackTraceLimit = userStackTraceLimit;
    return error;
  }
);
function getMessage(key, parameters, self) {
  const message = messages.get(key);
  (0, import_node_assert.default)(message !== void 0, "expected `message` to be found");
  if (typeof message === "function") {
    (0, import_node_assert.default)(
      message.length <= parameters.length,
      // Default options do not count.
      `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${message.length}).`
    );
    return Reflect.apply(message, self, parameters);
  }
  const regex = /%[dfijoOs]/g;
  let expectedLength = 0;
  while (regex.exec(message) !== null) expectedLength++;
  (0, import_node_assert.default)(
    expectedLength === parameters.length,
    `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${expectedLength}).`
  );
  if (parameters.length === 0) return message;
  parameters.unshift(message);
  return Reflect.apply(import_node_util.format, null, parameters);
}
function determineSpecificType(value) {
  if (value === null || value === void 0) {
    return String(value);
  }
  if (typeof value === "function" && value.name) {
    return `function ${value.name}`;
  }
  if (typeof value === "object") {
    if (value.constructor && value.constructor.name) {
      return `an instance of ${value.constructor.name}`;
    }
    return `${(0, import_node_util.inspect)(value, { depth: -1 })}`;
  }
  let inspected = (0, import_node_util.inspect)(value, { colors: false });
  if (inspected.length > 28) {
    inspected = `${inspected.slice(0, 25)}...`;
  }
  return `type ${typeof value} (${inspected})`;
}
var hasOwnProperty$1 = {}.hasOwnProperty;
var { ERR_INVALID_PACKAGE_CONFIG: ERR_INVALID_PACKAGE_CONFIG$1 } = codes;
var cache = /* @__PURE__ */ new Map();
function read(jsonPath, { base, specifier }) {
  const existing = cache.get(jsonPath);
  if (existing) {
    return existing;
  }
  let string;
  try {
    string = import_node_fs2.default.readFileSync(import_node_path.default.toNamespacedPath(jsonPath), "utf8");
  } catch (error) {
    const exception = (
      /** @type {ErrnoException} */
      error
    );
    if (exception.code !== "ENOENT") {
      throw exception;
    }
  }
  const result = {
    exists: false,
    pjsonPath: jsonPath,
    main: void 0,
    name: void 0,
    type: "none",
    // Ignore unknown types for forwards compatibility
    exports: void 0,
    imports: void 0
  };
  if (string !== void 0) {
    let parsed;
    try {
      parsed = JSON.parse(string);
    } catch (error_) {
      const cause = (
        /** @type {ErrnoException} */
        error_
      );
      const error = new ERR_INVALID_PACKAGE_CONFIG$1(
        jsonPath,
        (base ? `"${specifier}" from ` : "") + (0, import_node_url.fileURLToPath)(base || specifier),
        cause.message
      );
      error.cause = cause;
      throw error;
    }
    result.exists = true;
    if (hasOwnProperty$1.call(parsed, "name") && typeof parsed.name === "string") {
      result.name = parsed.name;
    }
    if (hasOwnProperty$1.call(parsed, "main") && typeof parsed.main === "string") {
      result.main = parsed.main;
    }
    if (hasOwnProperty$1.call(parsed, "exports")) {
      result.exports = parsed.exports;
    }
    if (hasOwnProperty$1.call(parsed, "imports")) {
      result.imports = parsed.imports;
    }
    if (hasOwnProperty$1.call(parsed, "type") && (parsed.type === "commonjs" || parsed.type === "module")) {
      result.type = parsed.type;
    }
  }
  cache.set(jsonPath, result);
  return result;
}
function getPackageScopeConfig(resolved) {
  let packageJSONUrl = new URL("package.json", resolved);
  while (true) {
    const packageJSONPath2 = packageJSONUrl.pathname;
    if (packageJSONPath2.endsWith("node_modules/package.json")) {
      break;
    }
    const packageConfig = read((0, import_node_url.fileURLToPath)(packageJSONUrl), {
      specifier: resolved
    });
    if (packageConfig.exists) {
      return packageConfig;
    }
    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL("../package.json", packageJSONUrl);
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) {
      break;
    }
  }
  const packageJSONPath = (0, import_node_url.fileURLToPath)(packageJSONUrl);
  return {
    pjsonPath: packageJSONPath,
    exists: false,
    type: "none"
  };
}
function getPackageType(url) {
  return getPackageScopeConfig(url).type;
}
var { ERR_UNKNOWN_FILE_EXTENSION } = codes;
var hasOwnProperty2 = {}.hasOwnProperty;
var extensionFormatMap = {
  // @ts-expect-error: hush.
  __proto__: null,
  ".cjs": "commonjs",
  ".js": "module",
  ".json": "json",
  ".mjs": "module"
};
function mimeToFormat(mime) {
  if (mime && /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(mime))
    return "module";
  if (mime === "application/json") return "json";
  return null;
}
var protocolHandlers = {
  // @ts-expect-error: hush.
  __proto__: null,
  "data:": getDataProtocolModuleFormat,
  "file:": getFileProtocolModuleFormat,
  "http:": getHttpProtocolModuleFormat,
  "https:": getHttpProtocolModuleFormat,
  "node:"() {
    return "builtin";
  }
};
function getDataProtocolModuleFormat(parsed) {
  const { 1: mime } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(
    parsed.pathname
  ) || [null, null, null];
  return mimeToFormat(mime);
}
function extname2(url) {
  const pathname = url.pathname;
  let index = pathname.length;
  while (index--) {
    const code = pathname.codePointAt(index);
    if (code === 47) {
      return "";
    }
    if (code === 46) {
      return pathname.codePointAt(index - 1) === 47 ? "" : pathname.slice(index);
    }
  }
  return "";
}
function getFileProtocolModuleFormat(url, _context, ignoreErrors) {
  const value = extname2(url);
  if (value === ".js") {
    const packageType = getPackageType(url);
    if (packageType !== "none") {
      return packageType;
    }
    return "commonjs";
  }
  if (value === "") {
    const packageType = getPackageType(url);
    if (packageType === "none" || packageType === "commonjs") {
      return "commonjs";
    }
    return "module";
  }
  const format3 = extensionFormatMap[value];
  if (format3) return format3;
  if (ignoreErrors) {
    return void 0;
  }
  const filepath = (0, import_node_url.fileURLToPath)(url);
  throw new ERR_UNKNOWN_FILE_EXTENSION(value, filepath);
}
function getHttpProtocolModuleFormat() {
}
function defaultGetFormatWithoutErrors(url, context) {
  const protocol = url.protocol;
  if (!hasOwnProperty2.call(protocolHandlers, protocol)) {
    return null;
  }
  return protocolHandlers[protocol](url, context, true) || null;
}
var RegExpPrototypeSymbolReplace = RegExp.prototype[Symbol.replace];
var {
  ERR_NETWORK_IMPORT_DISALLOWED,
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_UNSUPPORTED_RESOLVE_REQUEST
} = codes;
var own = {}.hasOwnProperty;
var invalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
var deprecatedInvalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
var invalidPackageNameRegEx = /^\.|%|\\/;
var patternRegEx = /\*/g;
var encodedSeparatorRegEx = /%2f|%5c/i;
var emittedPackageWarnings = /* @__PURE__ */ new Set();
var doubleSlashRegEx = /[/\\]{2}/;
function emitInvalidSegmentDeprecation(target, request, match, packageJsonUrl, internal, base, isTarget) {
  if (import_node_process.default.noDeprecation) {
    return;
  }
  const pjsonPath = (0, import_node_url.fileURLToPath)(packageJsonUrl);
  const double = doubleSlashRegEx.exec(isTarget ? target : request) !== null;
  import_node_process.default.emitWarning(
    `Use of deprecated ${double ? "double slash" : "leading or trailing slash matching"} resolving "${target}" for module request "${request}" ${request === match ? "" : `matched to "${match}" `}in the "${internal ? "imports" : "exports"}" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${(0, import_node_url.fileURLToPath)(base)}` : ""}.`,
    "DeprecationWarning",
    "DEP0166"
  );
}
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
  if (import_node_process.default.noDeprecation) {
    return;
  }
  const format3 = defaultGetFormatWithoutErrors(url, { parentURL: base.href });
  if (format3 !== "module") return;
  const urlPath = (0, import_node_url.fileURLToPath)(url.href);
  const packagePath = (0, import_node_url.fileURLToPath)(new import_node_url.URL(".", packageJsonUrl));
  const basePath = (0, import_node_url.fileURLToPath)(base);
  if (!main) {
    import_node_process.default.emitWarning(
      `No "main" or "exports" field defined in the package.json for ${packagePath} resolving the main entry point "${urlPath.slice(
        packagePath.length
      )}", imported from ${basePath}.
Default "index" lookups for the main are deprecated for ES modules.`,
      "DeprecationWarning",
      "DEP0151"
    );
  } else if (import_node_path.default.resolve(packagePath, main) !== urlPath) {
    import_node_process.default.emitWarning(
      `Package ${packagePath} has a "main" field set to "${main}", excluding the full filename and extension to the resolved file at "${urlPath.slice(
        packagePath.length
      )}", imported from ${basePath}.
 Automatic extension resolution of the "main" field is deprecated for ES modules.`,
      "DeprecationWarning",
      "DEP0151"
    );
  }
}
function tryStatSync(path5) {
  try {
    return (0, import_node_fs2.statSync)(path5);
  } catch {
  }
}
function fileExists(url) {
  const stats = (0, import_node_fs2.statSync)(url, { throwIfNoEntry: false });
  const isFile = stats ? stats.isFile() : void 0;
  return isFile === null || isFile === void 0 ? false : isFile;
}
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
  let guess;
  if (packageConfig.main !== void 0) {
    guess = new import_node_url.URL(packageConfig.main, packageJsonUrl);
    if (fileExists(guess)) return guess;
    const tries2 = [
      `./${packageConfig.main}.js`,
      `./${packageConfig.main}.json`,
      `./${packageConfig.main}.node`,
      `./${packageConfig.main}/index.js`,
      `./${packageConfig.main}/index.json`,
      `./${packageConfig.main}/index.node`
    ];
    let i3 = -1;
    while (++i3 < tries2.length) {
      guess = new import_node_url.URL(tries2[i3], packageJsonUrl);
      if (fileExists(guess)) break;
      guess = void 0;
    }
    if (guess) {
      emitLegacyIndexDeprecation(
        guess,
        packageJsonUrl,
        base,
        packageConfig.main
      );
      return guess;
    }
  }
  const tries = ["./index.js", "./index.json", "./index.node"];
  let i2 = -1;
  while (++i2 < tries.length) {
    guess = new import_node_url.URL(tries[i2], packageJsonUrl);
    if (fileExists(guess)) break;
    guess = void 0;
  }
  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
    return guess;
  }
  throw new ERR_MODULE_NOT_FOUND(
    (0, import_node_url.fileURLToPath)(new import_node_url.URL(".", packageJsonUrl)),
    (0, import_node_url.fileURLToPath)(base)
  );
}
function finalizeResolution(resolved, base, preserveSymlinks) {
  if (encodedSeparatorRegEx.exec(resolved.pathname) !== null) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved.pathname,
      'must not include encoded "/" or "\\" characters',
      (0, import_node_url.fileURLToPath)(base)
    );
  }
  let filePath;
  try {
    filePath = (0, import_node_url.fileURLToPath)(resolved);
  } catch (error) {
    const cause = (
      /** @type {ErrnoException} */
      error
    );
    Object.defineProperty(cause, "input", { value: String(resolved) });
    Object.defineProperty(cause, "module", { value: String(base) });
    throw cause;
  }
  const stats = tryStatSync(
    filePath.endsWith("/") ? filePath.slice(-1) : filePath
  );
  if (stats && stats.isDirectory()) {
    const error = new ERR_UNSUPPORTED_DIR_IMPORT(filePath, (0, import_node_url.fileURLToPath)(base));
    error.url = String(resolved);
    throw error;
  }
  if (!stats || !stats.isFile()) {
    const error = new ERR_MODULE_NOT_FOUND(
      filePath || resolved.pathname,
      base && (0, import_node_url.fileURLToPath)(base),
      true
    );
    error.url = String(resolved);
    throw error;
  }
  if (!preserveSymlinks) {
    const real = (0, import_node_fs2.realpathSync)(filePath);
    const { search, hash } = resolved;
    resolved = (0, import_node_url.pathToFileURL)(real + (filePath.endsWith(import_node_path.default.sep) ? "/" : ""));
    resolved.search = search;
    resolved.hash = hash;
  }
  return resolved;
}
function importNotDefined(specifier, packageJsonUrl, base) {
  return new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier,
    packageJsonUrl && (0, import_node_url.fileURLToPath)(new import_node_url.URL(".", packageJsonUrl)),
    (0, import_node_url.fileURLToPath)(base)
  );
}
function exportsNotFound(subpath, packageJsonUrl, base) {
  return new ERR_PACKAGE_PATH_NOT_EXPORTED(
    (0, import_node_url.fileURLToPath)(new import_node_url.URL(".", packageJsonUrl)),
    subpath,
    base && (0, import_node_url.fileURLToPath)(base)
  );
}
function throwInvalidSubpath(request, match, packageJsonUrl, internal, base) {
  const reason = `request is not a valid match in pattern "${match}" for the "${internal ? "imports" : "exports"}" resolution of ${(0, import_node_url.fileURLToPath)(packageJsonUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(
    request,
    reason,
    base && (0, import_node_url.fileURLToPath)(base)
  );
}
function invalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
  target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
  return new ERR_INVALID_PACKAGE_TARGET(
    (0, import_node_url.fileURLToPath)(new import_node_url.URL(".", packageJsonUrl)),
    subpath,
    target,
    internal,
    base && (0, import_node_url.fileURLToPath)(base)
  );
}
function resolvePackageTargetString(target, subpath, match, packageJsonUrl, base, pattern, internal, isPathMap, conditions) {
  if (subpath !== "" && !pattern && target[target.length - 1] !== "/")
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (!target.startsWith("./")) {
    if (internal && !target.startsWith("../") && !target.startsWith("/")) {
      let isURL = false;
      try {
        new import_node_url.URL(target);
        isURL = true;
      } catch {
      }
      if (!isURL) {
        const exportTarget = pattern ? RegExpPrototypeSymbolReplace.call(
          patternRegEx,
          target,
          () => subpath
        ) : target + subpath;
        return packageResolve(exportTarget, packageJsonUrl, conditions);
      }
    }
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (invalidSegmentRegEx.exec(target.slice(2)) !== null) {
    if (deprecatedInvalidSegmentRegEx.exec(target.slice(2)) === null) {
      if (!isPathMap) {
        const request = pattern ? match.replace("*", () => subpath) : match + subpath;
        const resolvedTarget = pattern ? RegExpPrototypeSymbolReplace.call(
          patternRegEx,
          target,
          () => subpath
        ) : target;
        emitInvalidSegmentDeprecation(
          resolvedTarget,
          request,
          match,
          packageJsonUrl,
          internal,
          base,
          true
        );
      }
    } else {
      throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
    }
  }
  const resolved = new import_node_url.URL(target, packageJsonUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new import_node_url.URL(".", packageJsonUrl).pathname;
  if (!resolvedPath.startsWith(packagePath))
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (subpath === "") return resolved;
  if (invalidSegmentRegEx.exec(subpath) !== null) {
    const request = pattern ? match.replace("*", () => subpath) : match + subpath;
    if (deprecatedInvalidSegmentRegEx.exec(subpath) === null) {
      if (!isPathMap) {
        const resolvedTarget = pattern ? RegExpPrototypeSymbolReplace.call(
          patternRegEx,
          target,
          () => subpath
        ) : target;
        emitInvalidSegmentDeprecation(
          resolvedTarget,
          request,
          match,
          packageJsonUrl,
          internal,
          base,
          false
        );
      }
    } else {
      throwInvalidSubpath(request, match, packageJsonUrl, internal, base);
    }
  }
  if (pattern) {
    return new import_node_url.URL(
      RegExpPrototypeSymbolReplace.call(
        patternRegEx,
        resolved.href,
        () => subpath
      )
    );
  }
  return new import_node_url.URL(subpath, resolved);
}
function isArrayIndex(key) {
  const keyNumber = Number(key);
  if (`${keyNumber}` !== key) return false;
  return keyNumber >= 0 && keyNumber < 4294967295;
}
function resolvePackageTarget(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions) {
  if (typeof target === "string") {
    return resolvePackageTargetString(
      target,
      subpath,
      packageSubpath,
      packageJsonUrl,
      base,
      pattern,
      internal,
      isPathMap,
      conditions
    );
  }
  if (Array.isArray(target)) {
    const targetList = target;
    if (targetList.length === 0) return null;
    let lastException;
    let i2 = -1;
    while (++i2 < targetList.length) {
      const targetItem = targetList[i2];
      let resolveResult;
      try {
        resolveResult = resolvePackageTarget(
          packageJsonUrl,
          targetItem,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          isPathMap,
          conditions
        );
      } catch (error) {
        const exception = (
          /** @type {ErrnoException} */
          error
        );
        lastException = exception;
        if (exception.code === "ERR_INVALID_PACKAGE_TARGET") continue;
        throw error;
      }
      if (resolveResult === void 0) continue;
      if (resolveResult === null) {
        lastException = null;
        continue;
      }
      return resolveResult;
    }
    if (lastException === void 0 || lastException === null) {
      return null;
    }
    throw lastException;
  }
  if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    let i2 = -1;
    while (++i2 < keys.length) {
      const key = keys[i2];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          (0, import_node_url.fileURLToPath)(packageJsonUrl),
          base,
          '"exports" cannot contain numeric property keys.'
        );
      }
    }
    i2 = -1;
    while (++i2 < keys.length) {
      const key = keys[i2];
      if (key === "default" || conditions && conditions.has(key)) {
        const conditionalTarget = (
          /** @type {unknown} */
          target[key]
        );
        const resolveResult = resolvePackageTarget(
          packageJsonUrl,
          conditionalTarget,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          isPathMap,
          conditions
        );
        if (resolveResult === void 0) continue;
        return resolveResult;
      }
    }
    return null;
  }
  if (target === null) {
    return null;
  }
  throw invalidPackageTarget(
    packageSubpath,
    target,
    packageJsonUrl,
    internal,
    base
  );
}
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
  if (typeof exports === "string" || Array.isArray(exports)) return true;
  if (typeof exports !== "object" || exports === null) return false;
  const keys = Object.getOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i2 = 0;
  let keyIndex = -1;
  while (++keyIndex < keys.length) {
    const key = keys[keyIndex];
    const currentIsConditionalSugar = key === "" || key[0] !== ".";
    if (i2++ === 0) {
      isConditionalSugar = currentIsConditionalSugar;
    } else if (isConditionalSugar !== currentIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        (0, import_node_url.fileURLToPath)(packageJsonUrl),
        base,
        `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`
      );
    }
  }
  return isConditionalSugar;
}
function emitTrailingSlashPatternDeprecation(match, pjsonUrl, base) {
  if (import_node_process.default.noDeprecation) {
    return;
  }
  const pjsonPath = (0, import_node_url.fileURLToPath)(pjsonUrl);
  if (emittedPackageWarnings.has(pjsonPath + "|" + match)) return;
  emittedPackageWarnings.add(pjsonPath + "|" + match);
  import_node_process.default.emitWarning(
    `Use of deprecated trailing slash pattern mapping "${match}" in the "exports" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${(0, import_node_url.fileURLToPath)(base)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`,
    "DeprecationWarning",
    "DEP0155"
  );
}
function packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJsonUrl, base)) {
    exports = { ".": exports };
  }
  if (own.call(exports, packageSubpath) && !packageSubpath.includes("*") && !packageSubpath.endsWith("/")) {
    const target = exports[packageSubpath];
    const resolveResult = resolvePackageTarget(
      packageJsonUrl,
      target,
      "",
      packageSubpath,
      base,
      false,
      false,
      false,
      conditions
    );
    if (resolveResult === null || resolveResult === void 0) {
      throw exportsNotFound(packageSubpath, packageJsonUrl, base);
    }
    return resolveResult;
  }
  let bestMatch = "";
  let bestMatchSubpath = "";
  const keys = Object.getOwnPropertyNames(exports);
  let i2 = -1;
  while (++i2 < keys.length) {
    const key = keys[i2];
    const patternIndex = key.indexOf("*");
    if (patternIndex !== -1 && packageSubpath.startsWith(key.slice(0, patternIndex))) {
      if (packageSubpath.endsWith("/")) {
        emitTrailingSlashPatternDeprecation(
          packageSubpath,
          packageJsonUrl,
          base
        );
      }
      const patternTrailer = key.slice(patternIndex + 1);
      if (packageSubpath.length >= key.length && packageSubpath.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
        bestMatch = key;
        bestMatchSubpath = packageSubpath.slice(
          patternIndex,
          packageSubpath.length - patternTrailer.length
        );
      }
    }
  }
  if (bestMatch) {
    const target = (
      /** @type {unknown} */
      exports[bestMatch]
    );
    const resolveResult = resolvePackageTarget(
      packageJsonUrl,
      target,
      bestMatchSubpath,
      bestMatch,
      base,
      true,
      false,
      packageSubpath.endsWith("/"),
      conditions
    );
    if (resolveResult === null || resolveResult === void 0) {
      throw exportsNotFound(packageSubpath, packageJsonUrl, base);
    }
    return resolveResult;
  }
  throw exportsNotFound(packageSubpath, packageJsonUrl, base);
}
function patternKeyCompare(a2, b3) {
  const aPatternIndex = a2.indexOf("*");
  const bPatternIndex = b3.indexOf("*");
  const baseLengthA = aPatternIndex === -1 ? a2.length : aPatternIndex + 1;
  const baseLengthB = bPatternIndex === -1 ? b3.length : bPatternIndex + 1;
  if (baseLengthA > baseLengthB) return -1;
  if (baseLengthB > baseLengthA) return 1;
  if (aPatternIndex === -1) return 1;
  if (bPatternIndex === -1) return -1;
  if (a2.length > b3.length) return -1;
  if (b3.length > a2.length) return 1;
  return 0;
}
function packageImportsResolve(name, base, conditions) {
  if (name === "#" || name.startsWith("#/") || name.endsWith("/")) {
    const reason = "is not a valid internal imports specifier name";
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, (0, import_node_url.fileURLToPath)(base));
  }
  let packageJsonUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJsonUrl = (0, import_node_url.pathToFileURL)(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (own.call(imports, name) && !name.includes("*")) {
        const resolveResult = resolvePackageTarget(
          packageJsonUrl,
          imports[name],
          "",
          name,
          base,
          false,
          true,
          false,
          conditions
        );
        if (resolveResult !== null && resolveResult !== void 0) {
          return resolveResult;
        }
      } else {
        let bestMatch = "";
        let bestMatchSubpath = "";
        const keys = Object.getOwnPropertyNames(imports);
        let i2 = -1;
        while (++i2 < keys.length) {
          const key = keys[i2];
          const patternIndex = key.indexOf("*");
          if (patternIndex !== -1 && name.startsWith(key.slice(0, -1))) {
            const patternTrailer = key.slice(patternIndex + 1);
            if (name.length >= key.length && name.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
              bestMatch = key;
              bestMatchSubpath = name.slice(
                patternIndex,
                name.length - patternTrailer.length
              );
            }
          }
        }
        if (bestMatch) {
          const target = imports[bestMatch];
          const resolveResult = resolvePackageTarget(
            packageJsonUrl,
            target,
            bestMatchSubpath,
            bestMatch,
            base,
            true,
            true,
            false,
            conditions
          );
          if (resolveResult !== null && resolveResult !== void 0) {
            return resolveResult;
          }
        }
      }
    }
  }
  throw importNotDefined(name, packageJsonUrl, base);
}
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf("/");
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === "@") {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = specifier.indexOf("/", separatorIndex + 1);
    }
  }
  const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
  if (invalidPackageNameRegEx.exec(packageName) !== null) {
    validPackageName = false;
  }
  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier,
      "is not a valid package name",
      (0, import_node_url.fileURLToPath)(base)
    );
  }
  const packageSubpath = "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex));
  return { packageName, packageSubpath, isScoped };
}
function packageResolve(specifier, base, conditions) {
  if (import_node_module.builtinModules.includes(specifier)) {
    return new import_node_url.URL("node:" + specifier);
  }
  const { packageName, packageSubpath, isScoped } = parsePackageName(
    specifier,
    base
  );
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    const packageJsonUrl2 = (0, import_node_url.pathToFileURL)(packageConfig.pjsonPath);
    if (packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJsonUrl2,
        packageSubpath,
        packageConfig,
        base,
        conditions
      );
    }
  }
  let packageJsonUrl = new import_node_url.URL(
    "./node_modules/" + packageName + "/package.json",
    base
  );
  let packageJsonPath = (0, import_node_url.fileURLToPath)(packageJsonUrl);
  let lastPath;
  do {
    const stat = tryStatSync(packageJsonPath.slice(0, -13));
    if (!stat || !stat.isDirectory()) {
      lastPath = packageJsonPath;
      packageJsonUrl = new import_node_url.URL(
        (isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json",
        packageJsonUrl
      );
      packageJsonPath = (0, import_node_url.fileURLToPath)(packageJsonUrl);
      continue;
    }
    const packageConfig2 = read(packageJsonPath, { base, specifier });
    if (packageConfig2.exports !== void 0 && packageConfig2.exports !== null) {
      return packageExportsResolve(
        packageJsonUrl,
        packageSubpath,
        packageConfig2,
        base,
        conditions
      );
    }
    if (packageSubpath === ".") {
      return legacyMainResolve(packageJsonUrl, packageConfig2, base);
    }
    return new import_node_url.URL(packageSubpath, packageJsonUrl);
  } while (packageJsonPath.length !== lastPath.length);
  throw new ERR_MODULE_NOT_FOUND(packageName, (0, import_node_url.fileURLToPath)(base), false);
}
function isRelativeSpecifier(specifier) {
  if (specifier[0] === ".") {
    if (specifier.length === 1 || specifier[1] === "/") return true;
    if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) {
      return true;
    }
  }
  return false;
}
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === "") return false;
  if (specifier[0] === "/") return true;
  return isRelativeSpecifier(specifier);
}
function moduleResolve(specifier, base, conditions, preserveSymlinks) {
  const protocol = base.protocol;
  const isData = protocol === "data:";
  const isRemote = isData || protocol === "http:" || protocol === "https:";
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    try {
      resolved = new import_node_url.URL(specifier, base);
    } catch (error_) {
      const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
      error.cause = error_;
      throw error;
    }
  } else if (protocol === "file:" && specifier[0] === "#") {
    resolved = packageImportsResolve(specifier, base, conditions);
  } else {
    try {
      resolved = new import_node_url.URL(specifier);
    } catch (error_) {
      if (isRemote && !import_node_module.builtinModules.includes(specifier)) {
        const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
        error.cause = error_;
        throw error;
      }
      resolved = packageResolve(specifier, base, conditions);
    }
  }
  (0, import_node_assert.default)(resolved !== void 0, "expected to be defined");
  if (resolved.protocol !== "file:") {
    return resolved;
  }
  return finalizeResolution(resolved, base, preserveSymlinks);
}
function fileURLToPath(id) {
  if (typeof id === "string" && !id.startsWith("file://")) {
    return normalizeSlash(id);
  }
  return normalizeSlash((0, import_node_url.fileURLToPath)(id));
}
function pathToFileURL(id) {
  return (0, import_node_url.pathToFileURL)(fileURLToPath(id)).toString();
}
function normalizeid(id) {
  if (typeof id !== "string") {
    id = id.toString();
  }
  if (/(node|data|http|https|file):/.test(id)) {
    return id;
  }
  if (BUILTIN_MODULES.has(id)) {
    return "node:" + id;
  }
  return "file://" + encodeURI(normalizeSlash(id));
}
var DEFAULT_CONDITIONS_SET = /* @__PURE__ */ new Set(["node", "import"]);
var DEFAULT_EXTENSIONS = [".mjs", ".cjs", ".js", ".json"];
var NOT_FOUND_ERRORS = /* @__PURE__ */ new Set([
  "ERR_MODULE_NOT_FOUND",
  "ERR_UNSUPPORTED_DIR_IMPORT",
  "MODULE_NOT_FOUND",
  "ERR_PACKAGE_PATH_NOT_EXPORTED"
]);
function _tryModuleResolve(id, url, conditions) {
  try {
    return moduleResolve(id, url, conditions);
  } catch (error) {
    if (!NOT_FOUND_ERRORS.has(error == null ? void 0 : error.code)) {
      throw error;
    }
  }
}
function _resolve(id, options = {}) {
  if (typeof id !== "string") {
    if (id instanceof URL) {
      id = fileURLToPath(id);
    } else {
      throw new TypeError("input must be a `string` or `URL`");
    }
  }
  if (/(node|data|http|https):/.test(id)) {
    return id;
  }
  if (BUILTIN_MODULES.has(id)) {
    return "node:" + id;
  }
  if (id.startsWith("file://")) {
    id = fileURLToPath(id);
  }
  if (isAbsolute(id)) {
    try {
      const stat = (0, import_node_fs2.statSync)(id);
      if (stat.isFile()) {
        return pathToFileURL(id);
      }
    } catch (error) {
      if ((error == null ? void 0 : error.code) !== "ENOENT") {
        throw error;
      }
    }
  }
  const conditionsSet = options.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET;
  const _urls = (Array.isArray(options.url) ? options.url : [options.url]).filter(Boolean).map((url) => new URL(normalizeid(url.toString())));
  if (_urls.length === 0) {
    _urls.push(new URL(pathToFileURL(process.cwd())));
  }
  const urls = [..._urls];
  for (const url of _urls) {
    if (url.protocol === "file:") {
      urls.push(
        new URL("./", url),
        // If url is directory
        new URL(joinURL(url.pathname, "_index.js"), url),
        // TODO: Remove in next major version?
        new URL("node_modules", url)
      );
    }
  }
  let resolved;
  for (const url of urls) {
    resolved = _tryModuleResolve(id, url, conditionsSet);
    if (resolved) {
      break;
    }
    for (const prefix of ["", "/index"]) {
      for (const extension of options.extensions || DEFAULT_EXTENSIONS) {
        resolved = _tryModuleResolve(
          joinURL(id, prefix) + extension,
          url,
          conditionsSet
        );
        if (resolved) {
          break;
        }
      }
      if (resolved) {
        break;
      }
    }
    if (resolved) {
      break;
    }
  }
  if (!resolved) {
    const error = new Error(
      `Cannot find module ${id} imported from ${urls.join(", ")}`
    );
    error.code = "ERR_MODULE_NOT_FOUND";
    throw error;
  }
  return pathToFileURL(resolved);
}
function resolveSync(id, options) {
  return _resolve(id, options);
}
function resolvePathSync(id, options) {
  return fileURLToPath(resolveSync(id, options));
}
function resolvePath(id, options) {
  try {
    return Promise.resolve(resolvePathSync(id, options));
  } catch (error) {
    return Promise.reject(error);
  }
}
var ESM_STATIC_IMPORT_RE = new RegExp(`(?<=\\s|^|;|\\})import\\s*([\\s"']*(?<imports>[\\p{L}\\p{M}\\w\\t\\n\\r $*,/{}@.]+)from\\s*)?["']\\s*(?<specifier>(?<="\\s*)[^"]*[^\\s"](?=\\s*")|(?<='\\s*)[^']*[^\\s'](?=\\s*'))\\s*["'][\\s;]*`, "gmu");
var IMPORT_NAMED_TYPE_RE = new RegExp(`(?<=\\s|^|;|})import\\s*type\\s+([\\s"']*(?<imports>[\\w\\t\\n\\r $*,/{}]+)from\\s*)?["']\\s*(?<specifier>(?<="\\s*)[^"]*[^\\s"](?=\\s*")|(?<='\\s*)[^']*[^\\s'](?=\\s*'))\\s*["'][\\s;]*`, "gm");
var EXPORT_NAMED_RE = new RegExp(`\\bexport\\s+{(?<exports>[^}]+?)[\\s,]*}(\\s*from\\s*["']\\s*(?<specifier>(?<="\\s*)[^"]*[^\\s"](?=\\s*")|(?<='\\s*)[^']*[^\\s'](?=\\s*'))\\s*["'][^\\n;]*)?`, "g");
var EXPORT_NAMED_TYPE_RE = new RegExp(`\\bexport\\s+type\\s+{(?<exports>[^}]+?)[\\s,]*}(\\s*from\\s*["']\\s*(?<specifier>(?<="\\s*)[^"]*[^\\s"](?=\\s*")|(?<='\\s*)[^']*[^\\s'](?=\\s*'))\\s*["'][^\\n;]*)?`, "g");
var EXPORT_STAR_RE = new RegExp(`\\bexport\\s*(\\*)(\\s*as\\s+(?<name>[\\w$]+)\\s+)?\\s*(\\s*from\\s*["']\\s*(?<specifier>(?<="\\s*)[^"]*[^\\s"](?=\\s*")|(?<='\\s*)[^']*[^\\s'](?=\\s*'))\\s*["'][^\\n;]*)?`, "g");
function interopDefault(sourceModule, opts = {}) {
  if (!isObject(sourceModule) || !("default" in sourceModule)) {
    return sourceModule;
  }
  const defaultValue = sourceModule.default;
  if (defaultValue === void 0 || defaultValue === null) {
    return sourceModule;
  }
  const _defaultType = typeof defaultValue;
  if (_defaultType !== "object" && !(_defaultType === "function" && !opts.preferNamespace)) {
    return opts.preferNamespace ? sourceModule : defaultValue;
  }
  for (const key in sourceModule) {
    try {
      if (!(key in defaultValue)) {
        Object.defineProperty(defaultValue, key, {
          enumerable: key !== "default",
          configurable: key !== "default",
          get() {
            return sourceModule[key];
          }
        });
      }
    } catch {
    }
  }
  return defaultValue;
}
var EVAL_ESM_IMPORT_RE = new RegExp(`(?<=import .* from ["'])([^"']+)(?=["'])|(?<=export .* from ["'])([^"']+)(?=["'])|(?<=import\\s*["'])([^"']+)(?=["'])|(?<=import\\s*\\(["'])([^"']+)(?=["']\\))`, "g");

// node_modules/local-pkg/dist/index.mjs
var import_node_url2 = __toESM(require_node_url(), 1);
var findUpStop = Symbol("findUpStop");
async function importModule(path5) {
  const i2 = await import(path5);
  if (i2)
    return interopDefault(i2);
  return i2;
}

// node_modules/@antfu/install-pkg/dist/index.js
var import_process2 = __toESM(require_process());

// node_modules/package-manager-detector/dist/detect.mjs
var import_node_fs4 = __toESM(require_node_fs(), 1);
var import_promises2 = __toESM(require_promises(), 1);
var import_node_path3 = __toESM(require_node_path(), 1);
var import_node_process3 = __toESM(require_node_process(), 1);

// node_modules/package-manager-detector/dist/constants.mjs
var AGENTS = [
  "npm",
  "yarn",
  "yarn@berry",
  "pnpm",
  "pnpm@6",
  "bun"
];
var LOCKS = {
  "bun.lockb": "bun",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm"
};

// node_modules/package-manager-detector/dist/detect.mjs
async function detect(options = {}) {
  const { cwd, onUnknown } = options;
  for (const directory of lookup(cwd)) {
    for (const lock of Object.keys(LOCKS)) {
      if (await fileExists2(import_node_path3.default.join(directory, lock))) {
        const name = LOCKS[lock];
        const result2 = await parsePackageJson(import_node_path3.default.join(directory, "package.json"), onUnknown);
        if (result2)
          return result2;
        else
          return { name, agent: name };
      }
    }
    const result = await parsePackageJson(import_node_path3.default.join(directory, "package.json"), onUnknown);
    if (result)
      return result;
  }
  return null;
}
function* lookup(cwd = import_node_process3.default.cwd()) {
  let directory = import_node_path3.default.resolve(cwd);
  const { root } = import_node_path3.default.parse(directory);
  while (directory && directory !== root) {
    yield directory;
    directory = import_node_path3.default.dirname(directory);
  }
}
async function parsePackageJson(filepath, onUnknown) {
  return !filepath || !await fileExists2(filepath) ? null : handlePackageManager(filepath, onUnknown);
}
function handlePackageManager(filepath, onUnknown) {
  try {
    const pkg = JSON.parse(import_node_fs4.default.readFileSync(filepath, "utf8"));
    let agent;
    if (typeof pkg.packageManager === "string") {
      const [name, ver] = pkg.packageManager.replace(/^\^/, "").split("@");
      let version2 = ver;
      if (name === "yarn" && Number.parseInt(ver) > 1) {
        agent = "yarn@berry";
        version2 = "berry";
        return { name, agent, version: version2 };
      } else if (name === "pnpm" && Number.parseInt(ver) < 7) {
        agent = "pnpm@6";
        return { name, agent, version: version2 };
      } else if (AGENTS.includes(name)) {
        agent = name;
        return { name, agent, version: version2 };
      } else {
        return (onUnknown == null ? void 0 : onUnknown(pkg.packageManager)) ?? null;
      }
    }
  } catch {
  }
  return null;
}
async function fileExists2(filePath) {
  try {
    const stats = await import_promises2.default.stat(filePath);
    if (stats.isFile()) {
      return true;
    }
  } catch {
  }
  return false;
}

// node_modules/@antfu/install-pkg/dist/index.js
var import_fs = __toESM(require_fs());
var import_process3 = __toESM(require_process());
var import_path3 = __toESM(require_path());

// node_modules/tinyexec/dist/main.js
var import_node_module2 = __toESM(require_node_module());
var import_child_process = __toESM(require_child_process());
var import_path = __toESM(require_path());
var import_process = __toESM(require_process());
var import_path2 = __toESM(require_path());
var import_stream = __toESM(require_stream());
var import_readline = __toESM(require_readline());
var require2 = (0, import_node_module2.createRequire)(import.meta.url);
var St = Object.create;
var $3 = Object.defineProperty;
var kt = Object.getOwnPropertyDescriptor;
var Tt = Object.getOwnPropertyNames;
var At = Object.getPrototypeOf;
var Rt = Object.prototype.hasOwnProperty;
var h5 = ((t2) => typeof require2 < "u" ? require2 : typeof Proxy < "u" ? new Proxy(t2, {
  get: (e2, n) => (typeof require2 < "u" ? require2 : e2)[n]
}) : t2)(function(t2) {
  if (typeof require2 < "u") return require2.apply(this, arguments);
  throw Error('Dynamic require of "' + t2 + '" is not supported');
});
var l2 = (t2, e2) => () => (e2 || t2((e2 = { exports: {} }).exports, e2), e2.exports);
var $t = (t2, e2, n, r2) => {
  if (e2 && typeof e2 == "object" || typeof e2 == "function")
    for (let s2 of Tt(e2))
      !Rt.call(t2, s2) && s2 !== n && $3(t2, s2, { get: () => e2[s2], enumerable: !(r2 = kt(e2, s2)) || r2.enumerable });
  return t2;
};
var Nt = (t2, e2, n) => (n = t2 != null ? St(At(t2)) : {}, $t(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  e2 || !t2 || !t2.__esModule ? $3(n, "default", { value: t2, enumerable: true }) : n,
  t2
));
var W4 = l2((Se2, H4) => {
  "use strict";
  H4.exports = z3;
  z3.sync = Wt;
  var j2 = h5("fs");
  function Ht(t2, e2) {
    var n = e2.pathExt !== void 0 ? e2.pathExt : process.env.PATHEXT;
    if (!n || (n = n.split(";"), n.indexOf("") !== -1))
      return true;
    for (var r2 = 0; r2 < n.length; r2++) {
      var s2 = n[r2].toLowerCase();
      if (s2 && t2.substr(-s2.length).toLowerCase() === s2)
        return true;
    }
    return false;
  }
  function F(t2, e2, n) {
    return !t2.isSymbolicLink() && !t2.isFile() ? false : Ht(e2, n);
  }
  function z3(t2, e2, n) {
    j2.stat(t2, function(r2, s2) {
      n(r2, r2 ? false : F(s2, t2, e2));
    });
  }
  function Wt(t2, e2) {
    return F(j2.statSync(t2), t2, e2);
  }
});
var X3 = l2((ke2, B2) => {
  "use strict";
  B2.exports = K3;
  K3.sync = Dt;
  var D2 = h5("fs");
  function K3(t2, e2, n) {
    D2.stat(t2, function(r2, s2) {
      n(r2, r2 ? false : M3(s2, e2));
    });
  }
  function Dt(t2, e2) {
    return M3(D2.statSync(t2), e2);
  }
  function M3(t2, e2) {
    return t2.isFile() && Kt(t2, e2);
  }
  function Kt(t2, e2) {
    var n = t2.mode, r2 = t2.uid, s2 = t2.gid, o = e2.uid !== void 0 ? e2.uid : process.getuid && process.getuid(), i2 = e2.gid !== void 0 ? e2.gid : process.getgid && process.getgid(), u2 = parseInt("100", 8), c = parseInt("010", 8), a2 = parseInt("001", 8), f2 = u2 | c, p = n & a2 || n & c && s2 === i2 || n & u2 && r2 === o || n & f2 && o === 0;
    return p;
  }
});
var U4 = l2((Ae, G3) => {
  "use strict";
  var Te2 = h5("fs"), v2;
  process.platform === "win32" || global.TESTING_WINDOWS ? v2 = W4() : v2 = X3();
  G3.exports = y3;
  y3.sync = Mt;
  function y3(t2, e2, n) {
    if (typeof e2 == "function" && (n = e2, e2 = {}), !n) {
      if (typeof Promise != "function")
        throw new TypeError("callback not provided");
      return new Promise(function(r2, s2) {
        y3(t2, e2 || {}, function(o, i2) {
          o ? s2(o) : r2(i2);
        });
      });
    }
    v2(t2, e2 || {}, function(r2, s2) {
      r2 && (r2.code === "EACCES" || e2 && e2.ignoreErrors) && (r2 = null, s2 = false), n(r2, s2);
    });
  }
  function Mt(t2, e2) {
    try {
      return v2.sync(t2, e2 || {});
    } catch (n) {
      if (e2 && e2.ignoreErrors || n.code === "EACCES")
        return false;
      throw n;
    }
  }
});
var et = l2((Re2, tt) => {
  "use strict";
  var g2 = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys", Y3 = h5("path"), Bt = g2 ? ";" : ":", V3 = U4(), J3 = (t2) => Object.assign(new Error(`not found: ${t2}`), { code: "ENOENT" }), Q4 = (t2, e2) => {
    let n = e2.colon || Bt, r2 = t2.match(/\//) || g2 && t2.match(/\\/) ? [""] : [
      // windows always checks the cwd first
      ...g2 ? [process.cwd()] : [],
      ...(e2.path || process.env.PATH || /* istanbul ignore next: very unusual */
      "").split(n)
    ], s2 = g2 ? e2.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "", o = g2 ? s2.split(n) : [""];
    return g2 && t2.indexOf(".") !== -1 && o[0] !== "" && o.unshift(""), {
      pathEnv: r2,
      pathExt: o,
      pathExtExe: s2
    };
  }, Z3 = (t2, e2, n) => {
    typeof e2 == "function" && (n = e2, e2 = {}), e2 || (e2 = {});
    let { pathEnv: r2, pathExt: s2, pathExtExe: o } = Q4(t2, e2), i2 = [], u2 = (a2) => new Promise((f2, p) => {
      if (a2 === r2.length)
        return e2.all && i2.length ? f2(i2) : p(J3(t2));
      let d2 = r2[a2], w3 = /^".*"$/.test(d2) ? d2.slice(1, -1) : d2, m3 = Y3.join(w3, t2), b3 = !w3 && /^\.[\\\/]/.test(t2) ? t2.slice(0, 2) + m3 : m3;
      f2(c(b3, a2, 0));
    }), c = (a2, f2, p) => new Promise((d2, w3) => {
      if (p === s2.length)
        return d2(u2(f2 + 1));
      let m3 = s2[p];
      V3(a2 + m3, { pathExt: o }, (b3, Ot) => {
        if (!b3 && Ot)
          if (e2.all)
            i2.push(a2 + m3);
          else
            return d2(a2 + m3);
        return d2(c(a2, f2, p + 1));
      });
    });
    return n ? u2(0).then((a2) => n(null, a2), n) : u2(0);
  }, Xt = (t2, e2) => {
    e2 = e2 || {};
    let { pathEnv: n, pathExt: r2, pathExtExe: s2 } = Q4(t2, e2), o = [];
    for (let i2 = 0; i2 < n.length; i2++) {
      let u2 = n[i2], c = /^".*"$/.test(u2) ? u2.slice(1, -1) : u2, a2 = Y3.join(c, t2), f2 = !c && /^\.[\\\/]/.test(t2) ? t2.slice(0, 2) + a2 : a2;
      for (let p = 0; p < r2.length; p++) {
        let d2 = f2 + r2[p];
        try {
          if (V3.sync(d2, { pathExt: s2 }))
            if (e2.all)
              o.push(d2);
            else
              return d2;
        } catch {
        }
      }
    }
    if (e2.all && o.length)
      return o;
    if (e2.nothrow)
      return null;
    throw J3(t2);
  };
  tt.exports = Z3;
  Z3.sync = Xt;
});
var rt = l2(($e2, _3) => {
  "use strict";
  var nt = (t2 = {}) => {
    let e2 = t2.env || process.env;
    return (t2.platform || process.platform) !== "win32" ? "PATH" : Object.keys(e2).reverse().find((r2) => r2.toUpperCase() === "PATH") || "Path";
  };
  _3.exports = nt;
  _3.exports.default = nt;
});
var ct = l2((Ne2, it) => {
  "use strict";
  var st = h5("path"), Gt = et(), Ut = rt();
  function ot(t2, e2) {
    let n = t2.options.env || process.env, r2 = process.cwd(), s2 = t2.options.cwd != null, o = s2 && process.chdir !== void 0 && !process.chdir.disabled;
    if (o)
      try {
        process.chdir(t2.options.cwd);
      } catch {
      }
    let i2;
    try {
      i2 = Gt.sync(t2.command, {
        path: n[Ut({ env: n })],
        pathExt: e2 ? st.delimiter : void 0
      });
    } catch {
    } finally {
      o && process.chdir(r2);
    }
    return i2 && (i2 = st.resolve(s2 ? t2.options.cwd : "", i2)), i2;
  }
  function Yt(t2) {
    return ot(t2) || ot(t2, true);
  }
  it.exports = Yt;
});
var at2 = l2((qe, C3) => {
  "use strict";
  var P3 = /([()\][%!^"`<>&|;, *?])/g;
  function Vt(t2) {
    return t2 = t2.replace(P3, "^$1"), t2;
  }
  function Jt(t2, e2) {
    return t2 = `${t2}`, t2 = t2.replace(/(\\*)"/g, '$1$1\\"'), t2 = t2.replace(/(\\*)$/, "$1$1"), t2 = `"${t2}"`, t2 = t2.replace(P3, "^$1"), e2 && (t2 = t2.replace(P3, "^$1")), t2;
  }
  C3.exports.command = Vt;
  C3.exports.argument = Jt;
});
var lt = l2((Ie2, ut) => {
  "use strict";
  ut.exports = /^#!(.*)/;
});
var dt = l2((Le2, pt) => {
  "use strict";
  var Qt = lt();
  pt.exports = (t2 = "") => {
    let e2 = t2.match(Qt);
    if (!e2)
      return null;
    let [n, r2] = e2[0].replace(/#! ?/, "").split(" "), s2 = n.split("/").pop();
    return s2 === "env" ? r2 : r2 ? `${s2} ${r2}` : s2;
  };
});
var ht = l2((je2, ft) => {
  "use strict";
  var O3 = h5("fs"), Zt = dt();
  function te2(t2) {
    let n = Buffer.alloc(150), r2;
    try {
      r2 = O3.openSync(t2, "r"), O3.readSync(r2, n, 0, 150, 0), O3.closeSync(r2);
    } catch {
    }
    return Zt(n.toString());
  }
  ft.exports = te2;
});
var wt = l2((Fe2, Et) => {
  "use strict";
  var ee2 = h5("path"), mt = ct(), gt = at2(), ne2 = ht(), re2 = process.platform === "win32", se2 = /\.(?:com|exe)$/i, oe2 = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function ie2(t2) {
    t2.file = mt(t2);
    let e2 = t2.file && ne2(t2.file);
    return e2 ? (t2.args.unshift(t2.file), t2.command = e2, mt(t2)) : t2.file;
  }
  function ce2(t2) {
    if (!re2)
      return t2;
    let e2 = ie2(t2), n = !se2.test(e2);
    if (t2.options.forceShell || n) {
      let r2 = oe2.test(e2);
      t2.command = ee2.normalize(t2.command), t2.command = gt.command(t2.command), t2.args = t2.args.map((o) => gt.argument(o, r2));
      let s2 = [t2.command].concat(t2.args).join(" ");
      t2.args = ["/d", "/s", "/c", `"${s2}"`], t2.command = process.env.comspec || "cmd.exe", t2.options.windowsVerbatimArguments = true;
    }
    return t2;
  }
  function ae3(t2, e2, n) {
    e2 && !Array.isArray(e2) && (n = e2, e2 = null), e2 = e2 ? e2.slice(0) : [], n = Object.assign({}, n);
    let r2 = {
      command: t2,
      args: e2,
      options: n,
      file: void 0,
      original: {
        command: t2,
        args: e2
      }
    };
    return n.shell ? r2 : ce2(r2);
  }
  Et.exports = ae3;
});
var bt = l2((ze2, vt) => {
  "use strict";
  var S3 = process.platform === "win32";
  function k3(t2, e2) {
    return Object.assign(new Error(`${e2} ${t2.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${e2} ${t2.command}`,
      path: t2.command,
      spawnargs: t2.args
    });
  }
  function ue3(t2, e2) {
    if (!S3)
      return;
    let n = t2.emit;
    t2.emit = function(r2, s2) {
      if (r2 === "exit") {
        let o = xt(s2, e2, "spawn");
        if (o)
          return n.call(t2, "error", o);
      }
      return n.apply(t2, arguments);
    };
  }
  function xt(t2, e2) {
    return S3 && t2 === 1 && !e2.file ? k3(e2.original, "spawn") : null;
  }
  function le2(t2, e2) {
    return S3 && t2 === 1 && !e2.file ? k3(e2.original, "spawnSync") : null;
  }
  vt.exports = {
    hookChildProcess: ue3,
    verifyENOENT: xt,
    verifyENOENTSync: le2,
    notFoundError: k3
  };
});
var Pt = l2((He2, E2) => {
  "use strict";
  var yt = h5("child_process"), T3 = wt(), A = bt();
  function _t(t2, e2, n) {
    let r2 = T3(t2, e2, n), s2 = yt.spawn(r2.command, r2.args, r2.options);
    return A.hookChildProcess(s2, r2), s2;
  }
  function pe2(t2, e2, n) {
    let r2 = T3(t2, e2, n), s2 = yt.spawnSync(r2.command, r2.args, r2.options);
    return s2.error = s2.error || A.verifyENOENTSync(s2.status, r2), s2;
  }
  E2.exports = _t;
  E2.exports.spawn = _t;
  E2.exports.sync = pe2;
  E2.exports._parse = T3;
  E2.exports._enoent = A;
});
var Lt = /^path$/i;
var q4 = { key: "PATH", value: "" };
function jt(t2) {
  for (let e2 in t2) {
    if (!Object.prototype.hasOwnProperty.call(t2, e2) || !Lt.test(e2))
      continue;
    let n = t2[e2];
    return n ? { key: e2, value: n } : q4;
  }
  return q4;
}
function Ft(t2, e2) {
  let n = e2.value.split(import_path2.delimiter), r2 = t2, s2;
  do
    n.push((0, import_path2.resolve)(r2, "node_modules", ".bin")), s2 = r2, r2 = (0, import_path2.dirname)(r2);
  while (r2 !== s2);
  return { key: e2.key, value: n.join(import_path2.delimiter) };
}
function I3(t2, e2) {
  let n = {
    ...process.env,
    ...e2
  }, r2 = Ft(t2, jt(n));
  return n[r2.key] = r2.value, n;
}
var L = (t2) => {
  let e2 = t2.length, n = new import_stream.PassThrough(), r2 = () => {
    --e2 === 0 && n.emit("end");
  };
  for (let s2 of t2)
    s2.pipe(n, { end: false }), s2.on("end", r2);
  return n;
};
var Ct = Nt(Pt(), 1);
var x2 = class extends Error {
  constructor(e2, n) {
    super(`Process exited with non-zero status (${e2.exitCode})`);
    __publicField(this, "result");
    __publicField(this, "output");
    this.result = e2, this.output = n;
  }
  get exitCode() {
    if (this.result.exitCode !== null)
      return this.result.exitCode;
  }
};
var ge2 = {
  timeout: void 0,
  persist: false
};
var Ee2 = {
  windowsHide: true
};
function we2(t2, e2) {
  return {
    command: (0, import_path.normalize)(t2),
    args: e2 ?? []
  };
}
function xe2(t2) {
  let e2 = new AbortController();
  for (let n of t2) {
    if (n.aborted)
      return e2.abort(), n;
    let r2 = () => {
      e2.abort(n.reason);
    };
    n.addEventListener("abort", r2, {
      signal: e2.signal
    });
  }
  return e2.signal;
}
var R2 = class {
  constructor(e2, n, r2) {
    __publicField(this, "_process");
    __publicField(this, "_aborted", false);
    __publicField(this, "_options");
    __publicField(this, "_command");
    __publicField(this, "_args");
    __publicField(this, "_resolveClose");
    __publicField(this, "_processClosed");
    __publicField(this, "_thrownError");
    __publicField(this, "_streamOut");
    __publicField(this, "_streamErr");
    __publicField(this, "_onError", (e2) => {
      if (e2.name === "AbortError" && (!(e2.cause instanceof Error) || e2.cause.name !== "TimeoutError")) {
        this._aborted = true;
        return;
      }
      this._thrownError = e2;
    });
    __publicField(this, "_onClose", () => {
      this._resolveClose && this._resolveClose();
    });
    this._options = {
      ...ge2,
      ...r2
    }, this._command = e2, this._args = n ?? [], this._processClosed = new Promise((s2) => {
      this._resolveClose = s2;
    });
  }
  get process() {
    return this._process;
  }
  get pid() {
    var _a;
    return (_a = this._process) == null ? void 0 : _a.pid;
  }
  get exitCode() {
    if (this._process && this._process.exitCode !== null)
      return this._process.exitCode;
  }
  kill(e2) {
    var _a;
    return ((_a = this._process) == null ? void 0 : _a.kill(e2)) === true;
  }
  get aborted() {
    return this._aborted;
  }
  get killed() {
    var _a;
    return ((_a = this._process) == null ? void 0 : _a.killed) === true;
  }
  pipe(e2, n, r2) {
    return be2(e2, n, {
      ...r2,
      stdin: this
    });
  }
  async *[Symbol.asyncIterator]() {
    var _a;
    let e2 = this._process;
    if (!e2)
      return;
    let n = [];
    this._streamErr && n.push(this._streamErr), this._streamOut && n.push(this._streamOut);
    let r2 = L(n), s2 = import_readline.default.createInterface({
      input: r2
    });
    for await (let o of s2)
      yield o.toString();
    if (await this._processClosed, e2.removeAllListeners(), this._thrownError)
      throw this._thrownError;
    if (((_a = this._options) == null ? void 0 : _a.throwOnError) && this.exitCode !== 0 && this.exitCode !== void 0)
      throw new x2(this);
  }
  async _waitForOutput() {
    var _a;
    let e2 = this._process;
    if (!e2)
      throw new Error("No process was started");
    let n = "", r2 = "";
    if (this._streamErr)
      for await (let o of this._streamErr)
        n += o.toString();
    if (this._streamOut)
      for await (let o of this._streamOut)
        r2 += o.toString();
    if (await this._processClosed, ((_a = this._options) == null ? void 0 : _a.stdin) && await this._options.stdin, e2.removeAllListeners(), this._thrownError)
      throw this._thrownError;
    let s2 = {
      stderr: n,
      stdout: r2
    };
    if (this._options.throwOnError && this.exitCode !== 0 && this.exitCode !== void 0)
      throw new x2(this, s2);
    return s2;
  }
  then(e2, n) {
    return this._waitForOutput().then(e2, n);
  }
  spawn() {
    let e2 = (0, import_process.cwd)(), n = this._options, r2 = {
      ...Ee2,
      ...n.nodeOptions
    }, s2 = [];
    this._resetState(), n.timeout !== void 0 && s2.push(AbortSignal.timeout(n.timeout)), n.signal !== void 0 && s2.push(n.signal), n.persist === true && (r2.detached = true), s2.length > 0 && (r2.signal = xe2(s2)), r2.env = I3(e2, r2.env);
    let { command: o, args: i2 } = we2(this._command, this._args), u2 = (0, Ct._parse)(o, i2, r2), c = (0, import_child_process.spawn)(
      u2.command,
      u2.args,
      u2.options
    );
    if (c.stderr && (this._streamErr = c.stderr), c.stdout && (this._streamOut = c.stdout), this._process = c, c.once("error", this._onError), c.once("close", this._onClose), n.stdin !== void 0 && c.stdin && n.stdin.process) {
      let { stdout: a2 } = n.stdin.process;
      a2 && a2.pipe(c.stdin);
    }
  }
  _resetState() {
    this._aborted = false, this._processClosed = new Promise((e2) => {
      this._resolveClose = e2;
    }), this._thrownError = void 0;
  }
};
var ve = (t2, e2, n) => {
  let r2 = new R2(t2, e2, n);
  return r2.spawn(), r2;
};
var be2 = ve;

// node_modules/@antfu/install-pkg/dist/index.js
async function detectPackageManager(cwd = import_process2.default.cwd()) {
  const result = await detect({
    cwd,
    onUnknown(packageManager) {
      console.warn("[@antfu/install-pkg] Unknown packageManager:", packageManager);
      return void 0;
    }
  });
  return (result == null ? void 0 : result.agent) || null;
}
async function installPackage(names, options = {}) {
  const detectedAgent = options.packageManager || await detectPackageManager(options.cwd) || "npm";
  const [agent] = detectedAgent.split("@");
  if (!Array.isArray(names))
    names = [names];
  const args = options.additionalArgs || [];
  if (options.preferOffline) {
    if (detectedAgent === "yarn@berry")
      args.unshift("--cached");
    else
      args.unshift("--prefer-offline");
  }
  if (agent === "pnpm" && (0, import_fs.existsSync)((0, import_path3.resolve)(options.cwd ?? import_process3.default.cwd(), "pnpm-workspace.yaml")))
    args.unshift("-w");
  return ve(
    agent,
    [
      agent === "yarn" ? "add" : "install",
      options.dev ? "-D" : "",
      ...args,
      ...names
    ].filter(Boolean),
    {
      nodeOptions: {
        stdio: options.silent ? "ignore" : "inherit",
        cwd: options.cwd
      },
      throwOnError: true
    }
  );
}

// node_modules/@antfu/utils/dist/index.mjs
function sleep(ms, callback) {
  return new Promise(
    (resolve3) => setTimeout(async () => {
      await (callback == null ? void 0 : callback());
      resolve3();
    }, ms)
  );
}
var VOID = Symbol("p-void");

// node_modules/@iconify/utils/lib/loader/install-pkg.mjs
init_module();

// node_modules/@iconify/utils/lib/loader/warn.mjs
init_module();
var warned = /* @__PURE__ */ new Set();
function warnOnce(msg) {
  if (!warned.has(msg)) {
    warned.add(msg);
    console.warn(yellow(`[@iconify-loader] ${msg}`));
  }
}

// node_modules/@iconify/utils/lib/loader/install-pkg.mjs
var pending;
var tasks = {};
async function tryInstallPkg(name, autoInstall) {
  if (pending) {
    await pending;
  }
  if (!tasks[name]) {
    console.log(cyan(`Installing ${name}...`));
    if (typeof autoInstall === "function") {
      tasks[name] = pending = autoInstall(name).then(() => sleep(300)).finally(() => {
        pending = void 0;
      });
    } else {
      tasks[name] = pending = installPackage(name, {
        dev: true,
        preferOffline: true
      }).then(() => sleep(300)).catch((e2) => {
        warnOnce(`Failed to install ${name}`);
        console.error(e2);
      }).finally(() => {
        pending = void 0;
      });
    }
  }
  return tasks[name];
}

// node_modules/@iconify/utils/lib/loader/fs.mjs
init_module();
var _collections = /* @__PURE__ */ Object.create(null);
var isLegacyExists = /* @__PURE__ */ Object.create(null);
async function loadCollectionFromFS(name, autoInstall = false, scope = "@iconify-json", cwd = process.cwd()) {
  const cache2 = _collections[cwd] || (_collections[cwd] = /* @__PURE__ */ Object.create(null));
  if (!await cache2[name]) {
    cache2[name] = task();
  }
  return cache2[name];
  async function task() {
    const packageName = scope.length === 0 ? name : `${scope}/${name}`;
    let jsonPath = await resolvePath(`${packageName}/icons.json`, {
      url: cwd
    }).catch(() => void 0);
    if (scope === "@iconify-json") {
      if (isLegacyExists[cwd] === void 0) {
        const testResult = await resolvePath(
          `@iconify/json/collections.json`,
          {
            url: cwd
          }
        ).catch(() => void 0);
        isLegacyExists[cwd] = !!testResult;
      }
      const checkLegacy = isLegacyExists[cwd];
      if (!jsonPath && checkLegacy) {
        jsonPath = await resolvePath(
          `@iconify/json/json/${name}.json`,
          {
            url: cwd
          }
        ).catch(() => void 0);
      }
      if (!jsonPath && !checkLegacy && autoInstall) {
        await tryInstallPkg(packageName, autoInstall);
        jsonPath = await resolvePath(`${packageName}/icons.json`, {
          url: cwd
        }).catch(() => void 0);
      }
    } else if (!jsonPath && autoInstall) {
      await tryInstallPkg(packageName, autoInstall);
      jsonPath = await resolvePath(`${packageName}/icons.json`, {
        url: cwd
      }).catch(() => void 0);
    }
    if (!jsonPath) {
      let packagePath = await resolvePath(packageName, {
        url: cwd
      }).catch(() => void 0);
      if (packagePath == null ? void 0 : packagePath.match(/^[a-z]:/i)) {
        packagePath = `file:///${packagePath}`.replace(/\\/g, "/");
      }
      if (packagePath) {
        const { icons } = await importModule(
          packagePath
        );
        if (icons)
          return icons;
      }
    }
    let stat;
    try {
      stat = jsonPath ? await import_fs2.promises.lstat(jsonPath) : void 0;
    } catch (err) {
      return void 0;
    }
    if (stat == null ? void 0 : stat.isFile()) {
      return JSON.parse(
        await import_fs2.promises.readFile(jsonPath, "utf8")
      );
    } else {
      return void 0;
    }
  }
}

// node_modules/@iconify/utils/lib/loader/custom.mjs
var import_debug2 = __toESM(require_browser(), 1);

// node_modules/@iconify/utils/lib/svg/trim.mjs
function trimSVG(str) {
  return str.replace(/(['"])\s*\n\s*([^>\\/\s])/g, "$1 $2").replace(/(["';{}><])\s*\n\s*/g, "$1").replace(/\s*\n\s*/g, " ").replace(/\s+"/g, '"').replace(/="\s+/g, '="').replace(/(\s)+\/>/g, "/>").trim();
}

// node_modules/@iconify/utils/lib/loader/custom.mjs
var debug2 = (0, import_debug2.default)("@iconify-loader:custom");
async function getCustomIcon(custom, collection, icon, options) {
  var _a;
  let result;
  debug2(`${collection}:${icon}`);
  try {
    if (typeof custom === "function") {
      result = await custom(icon);
    } else {
      const inline = custom[icon];
      result = typeof inline === "function" ? await inline() : inline;
    }
  } catch (err) {
    console.warn(
      `Failed to load custom icon "${icon}" in "${collection}":`,
      err
    );
    return;
  }
  if (result) {
    const cleanupIdx = result.indexOf("<svg");
    if (cleanupIdx > 0)
      result = result.slice(cleanupIdx);
    const { transform } = (options == null ? void 0 : options.customizations) ?? {};
    result = typeof transform === "function" ? await transform(result, collection, icon) : result;
    if (!result.startsWith("<svg")) {
      console.warn(
        `Custom icon "${icon}" in "${collection}" is not a valid SVG`
      );
      return result;
    }
    return await mergeIconProps(
      ((_a = options == null ? void 0 : options.customizations) == null ? void 0 : _a.trimCustomSvg) === true ? trimSVG(result) : result,
      collection,
      icon,
      options,
      void 0
    );
  }
}

// node_modules/@iconify/utils/lib/loader/loader.mjs
var import_debug3 = __toESM(require_browser(), 1);
var loadIcon = async (collection, icon, options) => {
  var _a;
  const custom = (_a = options == null ? void 0 : options.customCollections) == null ? void 0 : _a[collection];
  if (custom) {
    if (typeof custom === "function") {
      let result;
      try {
        result = await custom(icon);
      } catch (err) {
        console.warn(
          `Failed to load custom icon "${icon}" in "${collection}":`,
          err
        );
        return;
      }
      if (result) {
        if (typeof result === "string") {
          return await getCustomIcon(
            () => result,
            collection,
            icon,
            options
          );
        }
        if ("icons" in result) {
          const ids = [
            icon,
            icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
            icon.replace(/([a-z])(\d+)/g, "$1-$2")
          ];
          return await searchForIcon(
            result,
            collection,
            ids,
            options
          );
        }
      }
    } else {
      return await getCustomIcon(custom, collection, icon, options);
    }
  }
};

// node_modules/@iconify/utils/lib/loader/node-loader.mjs
var import_debug4 = __toESM(require_browser(), 1);
var import_fs4 = __toESM(require_fs(), 1);
init_module();
var loadNodeIcon = async (collection, icon, options) => {
  let result = await loadIcon(collection, icon, options);
  if (result) {
    return result;
  }
  const cwds = Array.isArray(options == null ? void 0 : options.cwd) ? options.cwd : [options == null ? void 0 : options.cwd];
  for (let i2 = 0; i2 < cwds.length; i2++) {
    const iconSet = await loadCollectionFromFS(
      collection,
      i2 === cwds.length - 1 ? options == null ? void 0 : options.autoInstall : false,
      void 0,
      cwds[i2]
    );
    if (iconSet) {
      result = await searchForIcon(
        iconSet,
        collection,
        getPossibleIconNames(icon),
        options
      );
      if (result) {
        return result;
      }
    }
  }
  if (options == null ? void 0 : options.warn) {
    warnOnce(`failed to load ${options.warn} icon`);
  }
};
export {
  loadNodeIcon
};
/*! Bundled license information:

confbox/dist/yaml.mjs:
  (*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)

confbox/dist/toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)
*/
//# sourceMappingURL=node-loader-QKRRDYFS.js.map
