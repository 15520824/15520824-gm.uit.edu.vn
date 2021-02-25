import GeoJSON from './geojson.js'
var DxformSVG = (function(exports) {
            'use strict';

            const getGroupCodeValue = (record, groupCode) => {
                if (record) {
                    for (const groupCodes of record) {
                        if (groupCodes[0] === groupCode) {
                            return groupCodes[1];
                        }
                    }
                }
            };

            const getGroupCodeValues = (record, groupCode) => {
                const values = [];
                if (record) {
                    for (const groupCodes of record) {
                        if (groupCodes[0] === groupCode) {
                            values.push(groupCodes[1]);
                        }
                    }
                }
                return values;
            };

            const isNotNaN = n => !isNaN(n);

            const calculateViewBox = ({
                ENTITIES
            }) => {
                if (!ENTITIES) {
                    return {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    };
                }

                let minX = Infinity;
                let maxX = -Infinity;
                let minY = Infinity;
                let maxY = -Infinity;

                for (const entity of ENTITIES) {
                    const xs = [+getGroupCodeValue(entity, 10), +getGroupCodeValue(entity, 11), +getGroupCodeValue(entity, 12)].filter(isNotNaN);
                    const ys = [-getGroupCodeValue(entity, 20), -getGroupCodeValue(entity, 21), -getGroupCodeValue(entity, 22)].filter(isNotNaN);
                    minX = Math.min(minX, ...xs);
                    maxX = Math.max(maxX, ...xs);
                    minY = Math.min(minY, ...ys);
                    maxY = Math.max(maxY, ...ys);
                }

                return {
                    x: minX,
                    y: minY,
                    w: maxX - minX,
                    h: maxY - minY
                };
            };

            const DXF_COLOR_HEX = ["#000000", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ffffff", "#414141", "#808080", "#ff0000", "#ffaaaa", "#bd0000", "#bd7e7e", "#810000", "#815656", "#680000", "#684545", "#4f0000", "#4f3535", "#ff3f00", "#ffbfaa", "#bd2e00", "#bd8d7e", "#811f00", "#816056", "#681900", "#684e45", "#4f1300", "#4f3b35", "#ff7f00", "#ffd4aa", "#bd5e00", "#bd9d7e", "#814000", "#816b56", "#683400", "#685645", "#4f2700", "#4f4235", "#ffbf00", "#ffeaaa", "#bd8d00", "#bdad7e", "#816000", "#817656", "#684e00", "#685f45", "#4f3b00", "#4f4935", "#ffff00", "#ffffaa", "#bdbd00", "#bdbd7e", "#818100", "#818156", "#686800", "#686845", "#4f4f00", "#4f4f35", "#bfff00", "#eaffaa", "#8dbd00", "#adbd7e", "#608100", "#768156", "#4e6800", "#5f6845", "#3b4f00", "#494f35", "#7fff00", "#d4ffaa", "#5ebd00", "#9dbd7e", "#408100", "#6b8156", "#346800", "#566845", "#274f00", "#424f35", "#3fff00", "#bfffaa", "#2ebd00", "#8dbd7e", "#1f8100", "#608156", "#196800", "#4e6845", "#134f00", "#3b4f35", "#00ff00", "#aaffaa", "#00bd00", "#7ebd7e", "#008100", "#568156", "#006800", "#456845", "#004f00", "#354f35", "#00ff3f", "#aaffbf", "#00bd2e", "#7ebd8d", "#00811f", "#568160", "#006819", "#45684e", "#004f13", "#354f3b", "#00ff7f", "#aaffd4", "#00bd5e", "#7ebd9d", "#008140", "#56816b", "#006834", "#456856", "#004f27", "#354f42", "#00ffbf", "#aaffea", "#00bd8d", "#7ebdad", "#008160", "#568176", "#00684e", "#45685f", "#004f3b", "#354f49", "#00ffff", "#aaffff", "#00bdbd", "#7ebdbd", "#008181", "#568181", "#006868", "#456868", "#004f4f", "#354f4f", "#00bfff", "#aaeaff", "#008dbd", "#7eadbd", "#006081", "#567681", "#004e68", "#455f68", "#003b4f", "#35494f", "#007fff", "#aad4ff", "#005ebd", "#7e9dbd", "#004081", "#566b81", "#003468", "#455668", "#00274f", "#35424f", "#003fff", "#aabfff", "#002ebd", "#7e8dbd", "#001f81", "#566081", "#001968", "#454e68", "#00134f", "#353b4f", "#0000ff", "#aaaaff", "#0000bd", "#7e7ebd", "#000081", "#565681", "#000068", "#454568", "#00004f", "#35354f", "#3f00ff", "#bfaaff", "#2e00bd", "#8d7ebd", "#1f0081", "#605681", "#190068", "#4e4568", "#13004f", "#3b354f", "#7f00ff", "#d4aaff", "#5e00bd", "#9d7ebd", "#400081", "#6b5681", "#340068", "#564568", "#27004f", "#42354f", "#bf00ff", "#eaaaff", "#8d00bd", "#ad7ebd", "#600081", "#765681", "#4e0068", "#5f4568", "#3b004f", "#49354f", "#ff00ff", "#ffaaff", "#bd00bd", "#bd7ebd", "#810081", "#815681", "#680068", "#684568", "#4f004f", "#4f354f", "#ff00bf", "#ffaaea", "#bd008d", "#bd7ead", "#810060", "#815676", "#68004e", "#68455f", "#4f003b", "#4f3549", "#ff007f", "#ffaad4", "#bd005e", "#bd7e9d", "#810040", "#81566b", "#680034", "#684556", "#4f0027", "#4f3542", "#ff003f", "#ffaabf", "#bd002e", "#bd7e8d", "#81001f", "#815660", "#680019", "#68454e", "#4f0013", "#4f353b", "#333333", "#505050", "#696969", "#828282", "#bebebe", "#ffffff"];

            const e = { d: "°", c: "⌀", p: "±" };
            const parseDxfMTextContent = (s, a) => {
                s = s.replace(/%%(.)/g, ((s, a) => e[a] || a));
                const c = a === null || a === void 0 ? void 0 : a.encoding;
                let t, r = c instanceof TextDecoder ? c : void 0,
                    n = "";
                const o = [],
                    f = e => { n && (o.push(n), n = ""), o.push(e); };
                for (let e = 0; e < s.length; e++) switch (t = s[e]) {
                    default: n += t;
                    break
                    case "\\":
                            switch (t = s[++e]) {
                            default: n += t;
                            break
                            case "P":
                                    n += "\n";
                                break
                            case "f":
                                    case "F":
                                {
                                    let a = "";
                                    for (; t = s[++e];) {
                                        if (";" === t) {
                                            f({ f: a });
                                            break
                                        }
                                        if ("|" === t) {
                                            const c = { f: a },
                                                t = s.indexOf(";", ++e);
                                            for (const a of s.slice(e, t).split("|")) c[a[0]] = +a.slice(1);
                                            e = t, f(c);
                                            break
                                        }
                                        a += "\\" === t ? s[++e] : t;
                                    }
                                    break
                                }
                            case "S":
                                {
                                    let a, c = "",
                                        r = "";
                                    for (; t = s[++e];) {
                                        if (";" === t) {
                                            a && f({ S: [c, a, r] });
                                            break
                                        }
                                        "\\" === t ? a ? r += s[++e] : c += s[++e] : a ? r += t : "^" === t || "/" === t || "#" === t ? a = t : c += t;
                                    }
                                    break
                                }
                            case "H":
                                    case "W":
                                    const a = ++e,
                                    [, o, i] = s.slice(a, e = s.indexOf(";", e)).match(/^(\d*(?:\.\d+)?)(\D*)$/);
                                f({
                                    [t]: [+o, i]
                                });
                                break
                            case "Q":
                                    case "A":
                                    case "C":
                                    case "T":
                                {
                                    const a = ++e;
                                    f({
                                        [t]: +s.slice(a, e = s.indexOf(";", e))
                                    });
                                    break
                                }
                            case "L":
                                    case "O":
                                    case "K":
                                    f({
                                    [t]: 1
                                });
                                break
                            case "l":
                                    case "o":
                                    case "k":
                                    f({
                                    [t.toUpperCase()]: 0
                                });
                                break
                            case "U":
                                    case "u":
                                    "+" === s[e + 1] ? (n += String.fromCodePoint(parseInt(s.substr(e + 2, 4), 16)), e += 5) : n += t;
                                break
                            case "M":
                                    case "m":
                                    c ? "+" === s[e + 1] && "1" === s[e + 2] ? (n += (r = r || new TextDecoder(c)).decode(new Uint8Array([parseInt(s.substr(e + 3, 2), 16), parseInt(s.substr(e + 5, 2), 16)])), e += 6) : n += t : n += "\\" + t;
                        }
                        break
                    case "{":
                        {
                            let a = 1;
                            const c = e;
                            for (; t = s[++e];)
                                if ("{" === t) a++;
                                else if ("}" === t) {
                                if (0 == --a) {
                                    f(parseDxfMTextContent(s.slice(c + 1, e)));
                                    break
                                }
                            } else "\\" === t && e++;
                            break
                        }
                }
                return n && o.push(n), o
            };

            const e$1 = { d: "°", c: "⌀", p: "±" };
            const decodeDxfTextCharacterCodes = (e, t) => (e = decodeDxfTextUnicodeCodePoints(e), t ? decodeDxfTextMbcsCharacterCodes(e, t) : e);
            const decodeDxfTextUnicodeCodePoints = e => e.replace(/\\[uU]\+([0-9a-fA-F]{4})/g, ((e, t) => String.fromCodePoint(parseInt(t, 16))));
            const decodeDxfTextMbcsCharacterCodes = (e, t) => {
                let o = t instanceof TextDecoder ? t : void 0;
                return e.replace(/\\[mM]\+1([0-9a-fA-F]{2})([0-9a-fA-F]{2})/g, ((e, d, n) => (o = o || new TextDecoder(t)).decode(new Uint8Array([parseInt(d, 16), parseInt(n, 16)]))))
            };
            const parseDxfTextContent = (t, o) => {
                t = decodeDxfTextCharacterCodes(t, o === null || o === void 0 ? void 0 : o.encoding);
                let d = 0,
                    n = { text: "" };
                const c = [n];
                for (const o of t.matchAll(/%%(\d\d\d|.)/g)) {
                    n.text += t.slice(d, o.index);
                    const r = o[1].toLowerCase(),
                        x = e$1[r];
                    x ? n.text += x : 3 === r.length ? n.text += String.fromCodePoint(+r) : "k" === r || "o" === r || "u" === r ? (n = {...n, text: "" }, n[r] ? delete n[r] : n[r] = 1, c.push(n)) : n.text += r, d = o.index + o[0].length;
                }
                return n.text += t.slice(d), c.filter((e => e.text))
            };

            const collectDimensionStyleOverrides = d => {
                const result = new Map();

                for (let i = 0; i < d.length; i++) {
                    if (d[i][0] === 1000 && d[i][1].trim() === 'DSTYLE' && d[i + 1][0] === 1002 && d[i + 1][1].trim() === '{') {
                        for (let j = i + 2; j < d.length; j++) {
                            if (d[j][0] === 1002) {
                                break;
                            }

                            if (d[j][0] === 1070) {
                                result.set(+d[j][1], d[++j][1]);
                            }
                        }

                        return result;
                    }
                }
            };

            const smallNumber = 1 / 64;
            const nearlyEqual = (a, b) => Math.abs(a - b) < smallNumber;
            const round = (() => {
                const _shift = (n, precision) => {
                    const [d, e] = ('' + n).split('e');
                    return +(d + 'e' + (e ? +e + precision : precision));
                };

                return (n, precision) => _shift(Math.round(_shift(n, precision)), -precision);
            })();
            const trim = function(s) {
                if (s) {
                    if (typeof s !== "string") {
                        if (s.toString)
                            s = s.toString();
                    }
                    try {
                        return s.trim();
                    } catch (error) {
                        console.log(s)
                    }
                }
                return s;
            }
            const negate = function(s) {
                if (!s)
                    return s;
                if (typeof s !== "string") {
                    if (s.toString)
                        s = s.toString();
                }
                if (s.startsWith('-'))
                    return s.slice(1)
                return '-' + s;

            }
            var checkConvert = [];
            const $trim = function(record, groupCode) {
                if (groupCode == 10 || groupCode == 20) {
                    var x = getGroupCodeValue(record, 10);
                    var y = getGroupCodeValue(record, 20);
                    var temp;
                    if (checkConvert[x] && checkConvert[x][y]) {
                        temp = checkConvert[x][y];
                    } else {
                        temp = GeoJSON.ConvertGeo(y, x);
                        if (checkConvert[x] == undefined)
                            checkConvert[x] = [];
                        checkConvert[x][y] = temp;
                    }
                    if (groupCode == 10)
                        return temp[0];
                    else if (groupCode == 20)
                        return temp[1];
                }
                if (groupCode == 11 || groupCode == 21) {
                    var x = getGroupCodeValue(record, 11);
                    var y = getGroupCodeValue(record, 21);
                    var temp;
                    if (checkConvert[x] && checkConvert[x][y]) {
                        temp = checkConvert[x][y];
                    } else {
                        temp = GeoJSON.ConvertGeo(y, x);
                        if (checkConvert[x] == undefined)
                            checkConvert[x] = [];
                        checkConvert[x][y] = temp;
                    }
                    if (groupCode == 11)
                        return temp[0];
                    else if (groupCode == 21)
                        return temp[1];
                }
                if (groupCode == 12 || groupCode == 22) {
                    var x = getGroupCodeValue(record, 12);
                    var y = getGroupCodeValue(record, 22);
                    var temp;
                    if (checkConvert[x] && checkConvert[x][y]) {
                        temp = checkConvert[x][y];
                    } else {
                        temp = GeoJSON.ConvertGeo(y, x);
                        if (checkConvert[x] == undefined)
                            checkConvert[x] = [];
                        checkConvert[x][y] = temp;
                    }
                    if (groupCode == 12)
                        return temp[0];
                    else if (groupCode == 22)
                        return temp[1];
                }
                if (groupCode == 13 || groupCode == 23) {
                    var x = getGroupCodeValue(record, 13);
                    var y = getGroupCodeValue(record, 23);
                    var temp;
                    if (checkConvert[x] && checkConvert[x][y]) {
                        temp = checkConvert[x][y];
                    } else {
                        temp = GeoJSON.ConvertGeo(y, x);
                        if (checkConvert[x] == undefined)
                            checkConvert[x] = [];
                        checkConvert[x][y] = temp;
                    }
                    if (groupCode == 13)
                        return temp[0];
                    else if (groupCode == 23)
                        return temp[1];
                }
                return trim(getGroupCodeValue(record, groupCode));
            }
            const $negate = function(record, groupCode) {
                return $trim(record, groupCode);
            }
            const $number = (record, groupCode, defaultValue) => {
                const value = +$trim(record, groupCode);

                if (!isNaN(value)) {
                    return value;
                }

                if (defaultValue === undefined) {
                    return NaN;
                }

                return defaultValue;
            };

            const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

            const jsx = (type, props) => {
                let s = '<' + type;
                let children;

                for (const [key, value] of Object.entries(props)) {
                    if (!value) {
                        continue;
                    }

                    if (key === 'children') {
                        children = value;
                    } else {
                        s += ` ${key}="${typeof value === 'string' ? escapeHtml(value) : value}"`;
                    }
                }

                if (type === 'line' || type === 'circle' || type === 'path') {
                    if (!props.fill) {
                        s += ' fill="none"';
                    }

                    s += ' vector-effect="non-scaling-stroke"';
                }

                if (type === 'text') {
                    s += ' stroke="none" white-space="pre"';
                }

                if (children) {
                    s += `>${Array.isArray(children) ? children.join('') : children}</${type}>`;
                } else {
                    s += '/>';
                }

                return s;
            };
            const jsxs = jsx;

            const MTEXT_attachmentPoint = n => {
                n = +n;
                let dominantBaseline;
                let textAnchor;

                switch (n) {
                    case 1:
                    case 2:
                    case 3:
                        dominantBaseline = 'text-before-edge';
                        break;

                    case 4:
                    case 5:
                    case 6:
                        dominantBaseline = 'central';
                        break;

                    case 7:
                    case 8:
                    case 9:
                        dominantBaseline = 'text-after-edge';
                        break;
                }

                switch (n % 3) {
                    case 2:
                        textAnchor = 'middle';
                        break;

                    case 0:
                        textAnchor = 'end';
                        break;
                }

                return {
                    dominantBaseline,
                    textAnchor
                };
            };

            const yx2angle = (y, x) => round(Math.atan2(y || 0, x || 0) * 180 / Math.PI, 5) || 0;

            const MTEXT_angle = mtext => {
                for (let i = mtext.length - 1; i >= 0; i--) {
                    switch (mtext[i][0]) {
                        case 50:
                            return round(+mtext[i][1], 5) || 0;

                        case 11:
                            return yx2angle($number(mtext, 12), +mtext[i][1]);

                        case 21:
                            return yx2angle(+mtext[i][1], $number(mtext, 11));
                    }
                }

                return 0;
            };
            const MTEXT_contents = (contents, i = 0) => {
                if (contents.length <= i) {
                    return '';
                }

                const restContents = MTEXT_contents(contents, i + 1);
                const content = contents[i];

                if (typeof content === 'string') {
                    return content + restContents;
                }

                if (Array.isArray(content)) {
                    return MTEXT_contents(content) + restContents;
                }

                if (content.S) {
                    return jsxs("tspan", {
                        children: [jsx("tspan", {
                            dy: "-.5em",
                            children: content.S[0]
                        }), jsx("tspan", {
                            dy: "1em",
                            dx: content.S[0].length / -2 + 'em',
                            children: content.S[2]
                        })]
                    }) + restContents;
                }

                if (content.f) {
                    return jsx("tspan", {
                        "font-family": content.f,
                        "font-weight": content.b && 'bold',
                        "font-style": content.i && 'italic',
                        children: restContents
                    });
                }

                if (content.Q) {
                    return jsx("tspan", {
                        "font-style": `oblique ${content.Q}deg`,
                        children: restContents
                    });
                }

                return restContents;
            };

            const defaultOptions = {
                warn: console.debug,
                resolveColorIndex: index => {
                    var _DXF_COLOR_HEX$index;

                    return (_DXF_COLOR_HEX$index = DXF_COLOR_HEX[index]) !== null && _DXF_COLOR_HEX$index !== void 0 ? _DXF_COLOR_HEX$index : '#888';
                }
            };

            const commonAttributes = entity => ({
                'data-5': $trim(entity, 5)
            });

            const textDecorations = ({
                k,
                o,
                u
            }) => {
                const decorations = [];
                k && decorations.push('line-through');
                o && decorations.push('overline');
                u && decorations.push('underline');
                return decorations.join(' ');
            };

            const TEXT_dominantBaseline = [, 'text-after-edge', 'central', 'text-before-edge'];
            const TEXT_textAnchor = [, 'middle', 'end', , 'middle'];

            const createEntitySvgMap = (dxf, options) => {
                    const {
                        warn,
                        resolveColorIndex
                    } = options;
                    const layerMap = {};

                    for (const layer of(_dxf$TABLES$LAYER = (_dxf$TABLES = dxf.TABLES) === null || _dxf$TABLES === void 0 ? void 0 : _dxf$TABLES.LAYER) !== null && _dxf$TABLES$LAYER !== void 0 ? _dxf$TABLES$LAYER : []) {
                        var _dxf$TABLES$LAYER, _dxf$TABLES;

                        if (getGroupCodeValue(layer, 0) === 'LAYER') {
                            layerMap[getGroupCodeValue(layer, 2)] = {
                                color: resolveColorIndex(+getGroupCodeValue(layer, 62)),
                                ltype: getGroupCodeValue(layer, 6)
                            };
                        }
                    }

                    const ltypeMap = {};

                    for (const ltype of(_dxf$TABLES$LTYPE = (_dxf$TABLES2 = dxf.TABLES) === null || _dxf$TABLES2 === void 0 ? void 0 : _dxf$TABLES2.LTYPE) !== null && _dxf$TABLES$LTYPE !== void 0 ? _dxf$TABLES$LTYPE : []) {
                        var _dxf$TABLES$LTYPE, _dxf$TABLES2;

                        if (getGroupCodeValue(ltype, 0) === 'LTYPE') {
                            const _strokeDasharray = getGroupCodeValues(ltype, 49).map(trim).map(s => s.startsWith('-') ? s.slice(1) : s);

                            const strokeDasharray = _strokeDasharray.length % 2 === 1 ? _strokeDasharray : _strokeDasharray[0] === '0' ? _strokeDasharray.slice(1) : _strokeDasharray.concat('0');
                            ltypeMap[getGroupCodeValue(ltype, 2)] = {
                                strokeDasharray: strokeDasharray.join(' ')
                            };
                        }
                    }

                    const _color = entity => {
                        const colorIndex = $trim(entity, 62);

                        if (colorIndex === '0') {
                            return 'currentColor';
                        }

                        if (colorIndex && colorIndex !== '256') {
                            return resolveColorIndex(+colorIndex);
                        }

                        const layer = layerMap[$trim(entity, 8)];

                        if (layer) {
                            return layer.color;
                        }
                    };

                    const color = entity => _color(entity) || 'currentColor';

                    const strokeDasharray = entity => {
                        var _ltypeMap, _$, _layerMap;

                        return (_ltypeMap = ltypeMap[(_$ = getGroupCodeValue(entity, 6)) !== null && _$ !== void 0 ? _$ : (_layerMap = layerMap[getGroupCodeValue(entity, 8)]) === null || _layerMap === void 0 ? void 0 : _layerMap.ltype]) === null || _ltypeMap === void 0 ? void 0 : _ltypeMap.strokeDasharray;
                    };

                    const extrusionStyle = entity => {
                        const extrusionZ = +$trim(entity, 230);

                        if (extrusionZ && Math.abs(extrusionZ + 1) < 1 / 64) {
                            return 'transform:rotateY(180deg)';
                        }
                    };

                    return {
                        POINT: () => '',
                        LINE: entity => jsx("line", {...commonAttributes(entity),
                            x1: $trim(entity, 10),
                            y1: $negate(entity, 20),
                            x2: $trim(entity, 11),
                            y2: $negate(entity, 21),
                            stroke: color(entity),
                            "stroke-dasharray": strokeDasharray(entity),
                            style: extrusionStyle(entity)
                        }),
                        POLYLINE: (entity, vertices) => {
                            var _$2;

                            const flags = +((_$2 = getGroupCodeValue(entity, 70)) !== null && _$2 !== void 0 ? _$2 : 0);
                            let d = '';

                            for (const vertex of vertices) {
                                d += `${d ? 'L' : 'M'}${$trim(vertex, 10)} ${$negate(vertex, 20)}`;
                            }

                            if (flags & 1) {
                                d += 'Z';
                            }

                            return jsx("path", {...commonAttributes(entity),
                                d: d,
                                stroke: color(entity),
                                "stroke-dasharray": strokeDasharray(entity),
                                style: extrusionStyle(entity)
                            });
                        },
                        LWPOLYLINE: entity => {
                            var _$3;

                            const flags = +((_$3 = getGroupCodeValue(entity, 70)) !== null && _$3 !== void 0 ? _$3 : 0);
                            const xs = getGroupCodeValues(entity, 10);
                            const ys = getGroupCodeValues(entity, 20);
                            var min = xs.length < ys.length ? xs.length : ys.length;
                            var temp;
                            for (var i = 0; i < min; i++) {
                                temp = GeoJSON.ConvertGeo(ys[i], xs[i]);
                                xs[i] = temp[0].toString();
                                ys[i] = temp[1].toString();
                            }
                            let d = '';

                            for (let i = 0; i < xs.length; i++) {
                                d += `${d ? 'L' : 'M'}${trim(xs[i])} ${negate(trim(ys[i]))}`;
                            }

                            if (flags & 1) {
                                d += 'Z';
                            }

                            return jsx("path", {...commonAttributes(entity),
                                d: d,
                                stroke: color(entity),
                                "stroke-dasharray": strokeDasharray(entity),
                                style: extrusionStyle(entity)
                            });
                        },
                        CIRCLE: entity => jsx("circle", {...commonAttributes(entity),
                            cx: $trim(entity, 10),
                            cy: $negate(entity, 20),
                            r: $trim(entity, 40),
                            stroke: color(entity),
                            "stroke-dasharray": strokeDasharray(entity),
                            style: extrusionStyle(entity)
                        }),
                        ARC: entity => {
                            const cx = $number(entity, 10);
                            const cy = $number(entity, 20);
                            const r = $number(entity, 40);
                            const deg1 = $number(entity, 50, 0);
                            const deg2 = $number(entity, 51, 0);
                            const rad1 = deg1 * Math.PI / 180;
                            const rad2 = deg2 * Math.PI / 180;
                            const x1 = cx + r * Math.cos(rad1);
                            const y1 = cy + r * Math.sin(rad1);
                            const x2 = cx + r * Math.cos(rad2);
                            const y2 = cy + r * Math.sin(rad2);
                            const large = (deg2 - deg1 + 360) % 360 <= 180 ? '0' : '1';
                            return jsx("path", {...commonAttributes(entity),
                                d: `M${x1} ${-y1}A${r} ${r} 0 ${large} 0 ${x2} ${-y2}`,
                                stroke: color(entity),
                                "stroke-dasharray": strokeDasharray(entity),
                                style: extrusionStyle(entity)
                            });
                        },
                        ELLIPSE: entity => {
                            // https://wiki.gz-labs.net/index.php/ELLIPSE
                            const cx = $number(entity, 10);
                            const cy = $number(entity, 20);
                            const majorX = $number(entity, 11);
                            const majorY = $number(entity, 21);
                            const majorR = Math.sqrt(majorX * majorX + majorY * majorY);
                            const minorR = $number(entity, 40) * majorR;
                            const radAngleOffset = -Math.atan2(majorY, majorX);
                            const rad1 = $number(entity, 41, 0);
                            const rad2 = $number(entity, 42, 2 * Math.PI);

                            if (nearlyEqual(rad1, 0) && nearlyEqual(rad2, 2 * Math.PI)) {
                                return jsx("ellipse", {...commonAttributes(entity),
                                    cx: cx,
                                    cy: -cy,
                                    rx: majorR,
                                    ry: minorR,
                                    stroke: color(entity),
                                    "stroke-dasharray": strokeDasharray(entity),
                                    transform: radAngleOffset && `rotate(${radAngleOffset * 180 / Math.PI} ${cx} ${-cy})`,
                                    style: extrusionStyle(entity)
                                });
                            } else {
                                warn('Elliptical arc cannot be rendered yet.');
                                return '';
                            }
                        },
                        LEADER: entity => {
                            const xs = getGroupCodeValues(entity, 10);
                            const ys = getGroupCodeValues(entity, 20);
                            var min = xs.length < ys.length ? xs.length : ys.length;
                            var temp;
                            for (var i = 0; i < min; i++) {
                                temp = GeoJSON.ConvertGeo(ys[i], xs[i]);
                                xs[i] = temp[0].toString();
                                ys[i] = temp[1].toString();
                            }
                            let d = '';

                            for (let i = 0; i < xs.length; i++) {
                                d += `${d ? 'L' : 'M'}${trim(xs[i])} ${negate(trim(ys[i]))}`;
                            }

                            return jsx("path", {...commonAttributes(entity),
                                d: d,
                                stroke: color(entity),
                                "stroke-dasharray": strokeDasharray(entity)
                            });
                        },
                        HATCH: entity => {
                            const paths = entity.slice(entity.findIndex(groupCode => groupCode[0] === 92), entity.findIndex(groupCode => groupCode[0] === 97));
                            const x1s = getGroupCodeValues(paths, 10).map(trim);
                            const y1s = getGroupCodeValues(paths, 20).map(trim).map(negate);
                            const x2s = getGroupCodeValues(paths, 11).map(trim);
                            const y2s = getGroupCodeValues(paths, 21).map(trim).map(negate);
                            var min = x1s.length < y1s.length ? x1s.length : y1s.length;
                            var temp;
                            for (var i = 0; i < min; i++) {
                                temp = GeoJSON.ConvertGeo(y1s[i], x1s[i]);
                                x1s[i] = temp[0].toString();
                                y1s[i] = temp[1].toString();
                            }
                            var min = x2s.length < y2s.length ? x2s.length : y2s.length;
                            var temp;
                            for (var i = 0; i < min; i++) {
                                temp = GeoJSON.ConvertGeo(y2s[i], x2s[i]);
                                x2s[i] = temp[0].toString();
                                y2s[i] = temp[1].toString();
                            }
                            let d = '';

                            for (let i = 0; i < x1s.length; i++) {
                                if (!x2s[i]) {
                                    d += `${i === 0 ? 'M' : 'L'}${x1s[i]} ${y1s[i]}`;
                                } else if (x1s[i] === x2s[i - 1] && y1s[i] === y2s[i - 1]) {
                                    d += `L${x2s[i]} ${y2s[i]}`;
                                } else {
                                    d += `M${x1s[i]} ${y1s[i]}L${x2s[i]} ${y2s[i]}`;
                                }
                            }

                            return jsx("path", {...commonAttributes(entity),
                                d: d,
                                fill: color(entity) || 'currentColor',
                                "fill-opacity": ".3"
                            });
                        },
                        SOLID: entity => {
                                const x1 = $trim(entity, 10);
                                const y1 = $negate(entity, 20);
                                const x2 = $trim(entity, 11);
                                const y2 = $negate(entity, 21);
                                const x3 = $trim(entity, 12);
                                const y3 = $negate(entity, 22);
                                const x4 = $trim(entity, 13);
                                const y4 = $negate(entity, 23);
                                const d = `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}${x3 !== x4 || y3 !== y4 ? `L${x4} ${y4}` : ''}Z`;
          return jsx("path", { ...commonAttributes(entity),
            d: d,
            fill: color(entity)
          });
        },
        TEXT: entity => {
          const x = $trim(entity, 10);
          const y = $negate(entity, 20);
          const angle = $negate(entity, 50);
          const contents = parseDxfTextContent(getGroupCodeValue(entity, 1) || '', options);
          return jsx("text", { ...commonAttributes(entity),
            x: x,
            y: y,
            fill: color(entity),
            "font-size": $trim(entity, 40),
            "dominant-baseline": TEXT_dominantBaseline[$trim(entity, 73)],
            "text-anchor": TEXT_textAnchor[$trim(entity, 72)],
            transform: angle && `rotate(${angle} ${x} ${y})`,
            "text-decoration": contents.length === 1 && textDecorations(contents[0]),
            children: contents.length === 1 ? contents[0].text : contents.map(content => jsx("tspan", {
              "text-decoration": textDecorations(content),
              children: content.text
            }))
          });
        },
        MTEXT: entity => {
          var _$4;

          const x = $trim(entity, 10);
          const y = $negate(entity, 20);
          const angle = MTEXT_angle(entity);
          const {
            dominantBaseline,
            textAnchor
          } = MTEXT_attachmentPoint($trim(entity, 71));
          return jsx("text", { ...commonAttributes(entity),
            x: x,
            y: y,
            fill: color(entity),
            "font-size": $trim(entity, 40),
            "dominant-baseline": dominantBaseline,
            "text-anchor": textAnchor,
            transform: angle ? `rotate(${-angle} ${x} ${y})` : undefined,
            children: MTEXT_contents(parseDxfMTextContent(getGroupCodeValues(entity, 3).join('') + ((_$4 = getGroupCodeValue(entity, 1)) !== null && _$4 !== void 0 ? _$4 : ''), options))
          });
        },
        DIMENSION: entity => {
          var _dxf$TABLES3, _dxf$TABLES3$DIMSTYLE, _dxf$HEADER;

          const styleName = getGroupCodeValue(entity, 3);
          const style = (_dxf$TABLES3 = dxf.TABLES) === null || _dxf$TABLES3 === void 0 ? void 0 : (_dxf$TABLES3$DIMSTYLE = _dxf$TABLES3.DIMSTYLE) === null || _dxf$TABLES3$DIMSTYLE === void 0 ? void 0 : _dxf$TABLES3$DIMSTYLE.find(style => getGroupCodeValue(style, 2) === styleName);
          const styleOverrides = collectDimensionStyleOverrides(entity);

          const $style = (key, defaultValue) => {
            var _ref, _styleOverrides$get;

            return +((_ref = (_styleOverrides$get = styleOverrides === null || styleOverrides === void 0 ? void 0 : styleOverrides.get(key)) !== null && _styleOverrides$get !== void 0 ? _styleOverrides$get : getGroupCodeValue(style, key)) !== null && _ref !== void 0 ? _ref : defaultValue);
          };

          let lineElements = '';
          let value = $number(entity, 42, NaN);
          let dominantBaseline = 'text-after-edge';
          let textAnchor = 'middle';
          let angle;
          value === -1 && (value = NaN);
          const factor = $style(144, 1);
          const tx = $trim(entity, 11);
          const ty = $negate(entity, 21);
          const dimensionType = $number(entity, 70, 0);

          switch (dimensionType & 7) {
            case 0: // Rotated, Horizontal, or Vertical

            case 1:
              // Aligned
              {
                const x1 = $trim(entity, 13);
                const y1 = $negate(entity, 23);
                const x2 = $trim(entity, 14);
                const y2 = $negate(entity, 24);
                angle = Math.round(-$number(entity, 50) || 0);

                if (angle % 180 === 0) {
                  const y0 = $negate(entity, 20);
                  value = value || Math.abs(+x1 - +x2) * factor;
                  lineElements = jsx("path", {
                    d: `M${x1} ${y1}L${x1} ${y0}L${x2} ${y0}L${x2} ${y2}`
                  });
                  angle = 0;
                } else {
                  const x0 = $trim(entity, 10);
                  value = value || Math.abs(+y1 - +y2) * factor;
                  lineElements = jsx("path", {
                    d: `M${x1} ${y1}L${x0} ${y1}L${x0} ${y2}L${x2} ${y2}`
                  });
                }

                break;
              }

            case 2: // Angular

            case 5:
              // Angular 3-point
              warn('Angular dimension cannot be rendered yet.', entity);
              break;

            case 3: // Diameter

            case 4:
              // Radius
              warn('Diameter / radius dimension cannot be rendered yet.', entity);
              break;

            case 6:
              // Ordinate
              {
                const x1 = $trim(entity, 13);
                const y1 = $negate(entity, 23);
                const x2 = $trim(entity, 14);
                const y2 = $negate(entity, 24);

                if (dimensionType & 64) {
                  const x0 = $number(entity, 10);
                  value = value || Math.abs(x0 - +x1) * factor;
                  lineElements = jsx("path", {
                    d: `M${x1} ${y1}L${x1} ${y2}L${x2} ${y2}L${tx} ${ty}`
                  });
                  angle = -90;
                } else {
                  const y0 = -$number(entity, 20);
                  value = value || Math.abs(y0 - +y1) * factor;
                  lineElements = jsx("path", {
                    d: `M${x1} ${y1}L${x2} ${y1}L${x2} ${y2}L${tx} ${ty}`
                  });
                }

                dominantBaseline = 'central';
                textAnchor = 'middle';
                break;
              }
          }

          value = round(value, $style(271, 0) || +getGroupCodeValue((_dxf$HEADER = dxf.HEADER) === null || _dxf$HEADER === void 0 ? void 0 : _dxf$HEADER.$DIMDEC, 70) || 4);
          let textElement;
          {
            var _dxf$HEADER2, _dxf$HEADER3;

            const h = ($style(140, 0) || +getGroupCodeValue((_dxf$HEADER2 = dxf.HEADER) === null || _dxf$HEADER2 === void 0 ? void 0 : _dxf$HEADER2.$DIMTXT, 40)) * ($style(40, 0) || +getGroupCodeValue((_dxf$HEADER3 = dxf.HEADER) === null || _dxf$HEADER3 === void 0 ? void 0 : _dxf$HEADER3.$DIMSCALE, 40) || 1);
            let valueWithTolerance = String(value);

            if ($style(71, 0)) {
              const p = $style(47, 0);
              const n = $style(48, 0);

              if (p || n) {
                if (p === n) {
                  valueWithTolerance = `${value}  ±${p}`;
                } else {
                  valueWithTolerance = `${value}  {\\S${p ? '+' + p : ' 0'}^${-n || ' 0'};}`;
                }
              }
            }

            const template = getGroupCodeValue(entity, 1);
            const text = template ? decodeDxfTextCharacterCodes(template, options === null || options === void 0 ? void 0 : options.encoding).replace(/<>/, valueWithTolerance) : valueWithTolerance;
            const textColor = $style(178, NaN);
            textElement = jsx("text", {
              x: tx,
              y: ty,
              fill: isNaN(textColor) ? color(entity) : textColor === 0 ? 'currentColor' : resolveColorIndex(textColor),
              "font-size": h,
              "dominant-baseline": dominantBaseline,
              "text-anchor": textAnchor,
              transform: angle && `rotate(${angle} ${tx} ${ty})`,
              children: MTEXT_contents(parseDxfMTextContent(text))
            });
          }
          return jsx("g", { ...commonAttributes(entity),
            stroke: color(entity) || 'currentColor',
            "stroke-dasharray": strokeDasharray(entity),
            style: extrusionStyle(entity),
            children: lineElements + textElement
          });
        },
        ACAD_TABLE: entity => {
          const cells = [];
          {
            let index = entity.findIndex(groupCode => groupCode[0] === 171);

            for (let i = index + 1; i < entity.length; i++) {
              if (entity[i][0] === 171) {
                cells.push(entity.slice(index, i));
                index = i;
              }
            }

            cells.push(entity.slice(index, entity.length));
          }
          const ys = getGroupCodeValues(entity, 141).map(s => +s).reduce((ys, size) => (ys.push(ys[ys.length - 1] + size), ys), [0]);
          const xs = getGroupCodeValues(entity, 142).map(s => +s).reduce((xs, size) => (xs.push(xs[xs.length - 1] + size), xs), [0]);
          const lineColor = color(entity) || 'currentColor';
          const textColor = resolveColorIndex(+getGroupCodeValue(entity, 64));
          let s = ys.map(y => jsx("line", {
            stroke: lineColor,
            x1: "0",
            y1: y,
            x2: xs[xs.length - 1],
            y2: y
          })).join('');
          let xi = 0;
          let yi = 0;

          for (const cell of cells) {
            const x = xs[xi];
            const y = ys[yi];
            const color = +getGroupCodeValue(cell, 64);

            if (!+getGroupCodeValue(cell, 173)) {
              s += jsx("line", {
                x1: x,
                y1: y,
                x2: x,
                y2: ys[yi + 1],
                stroke: lineColor
              });
            }

            if ($trim(cell, 171) === '2') {
              warn('Table cell type "block" cannot be rendered yet.', entity, cell);
            } else {
              var _$5;

              s += jsx("text", {
                x: x,
                y: y,
                fill: !isNaN(color) ? resolveColorIndex(color) : textColor,
                children: MTEXT_contents(parseDxfMTextContent((_$5 = getGroupCodeValue(cell, 1)) !== null && _$5 !== void 0 ? _$5 : ''))
              });
            }

            if (++xi === xs.length - 1) {
              xi = 0;
              yi++;
            }
          }

          s += jsx("line", {
            x1: xs[xs.length - 1],
            y1: "0",
            x2: xs[xs.length - 1],
            y2: ys[ys.length - 1],
            stroke: lineColor
          });
          return jsx("g", { ...commonAttributes(entity),
            "font-size": $trim(entity, 140),
            "dominant-baseline": "text-before-edge",
            transform: `translate(${$trim(entity, 10)},${$negate(entity, 20)})`,
            children: s
          });
        },
        INSERT: entity => {
          var _dxf$BLOCKS;

          const x = $trim(entity, 10);
          const y = $negate(entity, 20);
          const rotate = $negate(entity, 50);
          const xscale = $trim(entity, 41) || 1;
          const yscale = $trim(entity, 42) || 1;
          const transform = [+x || +y ? `translate(${x},${y})` : '', +xscale !== 1 || +yscale !== 1 ? `scale(${xscale},${yscale})` : '', rotate ? `rotate(${rotate})` : ''].filter(Boolean).join(' ');

          const _block = (_dxf$BLOCKS = dxf.BLOCKS) === null || _dxf$BLOCKS === void 0 ? void 0 : _dxf$BLOCKS[getGroupCodeValue(entity, 2)];

          const block = _block === null || _block === void 0 ? void 0 : _block.slice(getGroupCodeValue(_block[0], 0) === 'BLOCK' ? 1 : 0, getGroupCodeValue(_block[_block.length - 1], 0) === 'ENDBLK' ? -1 : undefined);
          const contents = entitiesToSvgString(dxf, block, options);
          return jsx("g", { ...commonAttributes(entity),
            color: _color(entity),
            transform: transform,
            children: contents
          });
        }
      };
    };

    const entitiesToSvgString = (dxf, entities, options) => {
      const {
        warn
      } = options;
      const entitySvgMap = createEntitySvgMap(dxf, options);
      let s = '';

      if (entities) {
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];
          const entityType = getGroupCodeValue(entity, 0);

          if (!entityType) {
            continue;
          }

          const vertices = [];

          while (getGroupCodeValue(entities[i + 1], 0) === 'VERTEX') {
            vertices.push(entities[++i]);
          }

          if (vertices.length !== 0 && getGroupCodeValue(entities[i + 1], 0) === 'SEQEND') {
            i++;
          }

          const entitySvg = entitySvgMap[entityType];

          if (entitySvg) {
            s += entitySvg(entity, vertices);
          } else {
            warn(`Unknown entity type: ${entityType}`, entity);
          }
        }
      }

      return s;
    };

    const createSvgContentsString = (dxf, options) => {
      const resolvedOptions = options ? { ...defaultOptions,
        ...options
      } : defaultOptions;
      return entitiesToSvgString(dxf, dxf.ENTITIES, resolvedOptions);
    };

    const createSvgString = (dxf, options) => {
      const {
        x,
        y,
        w,
        h
      } = calculateViewBox(dxf);
      return jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `${x} ${y} ${w} ${h}`,
        width: w,
        height: h,
        children: createSvgContentsString(dxf, options)
      });
    };

    exports.calculateViewBox = calculateViewBox;
    exports.createSvgContentsString = createSvgContentsString;
    exports.createSvgString = createSvgString;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));

export default DxformSVG;