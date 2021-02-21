import { getGroupCodeValue, getGroupCodeValues } from '@dxfom/dxf/bundle.mjs'
import DCEL from './dcel'

function computeDistanceAndBearing(lat1, lng1, lat2, lng2) {
    var results = [0, 0, 0];
    var MAXITERS = 20;
    // Convert lat/lngg to radians
    lat1 *= Math.PI / 180.0;
    lat2 *= Math.PI / 180.0;
    lng1 *= Math.PI / 180.0;
    lng2 *= Math.PI / 180.0;

    var a = 6378137.0; // WGS84 major axis
    var b = 6356752.3142; // WGS84 semi-major axis
    var f = (a - b) / a;
    var aSqMinusBSqOverBSq = (a * a - b * b) / (b * b);

    var L = lng2 - lng1;
    var A = 0.0;
    var U1 = Math.atan((1.0 - f) * Math.tan(lat1));
    var U2 = Math.atan((1.0 - f) * Math.tan(lat2));

    var cosU1 = Math.cos(U1);
    var cosU2 = Math.cos(U2);
    var sinU1 = Math.sin(U1);
    var sinU2 = Math.sin(U2);
    var cosU1cosU2 = cosU1 * cosU2;
    var sinU1sinU2 = sinU1 * sinU2;

    var sigma = 0.0;
    var deltaSigma = 0.0;
    var cosSqAlpha;
    var cos2SM;
    var cosSigma;
    var sinSigma;
    var cosLambda = 0.0;
    var sinLambda = 0.0;

    var lambda = L; // initial guess
    for (var iter = 0; iter < MAXITERS; iter++) {
        var lambdaOrig = lambda;
        cosLambda = Math.cos(lambda);
        sinLambda = Math.sin(lambda);
        var t1 = cosU2 * sinLambda;
        var t2 = cosU1 * sinU2 - sinU1 * cosU2 * cosLambda;
        var sinSqSigma = t1 * t1 + t2 * t2; // (14)
        sinSigma = Math.sqrt(sinSqSigma);
        cosSigma = sinU1sinU2 + cosU1cosU2 * cosLambda; // (15)
        sigma = Math.atan2(sinSigma, cosSigma); // (16)
        var sinAlpha = (sinSigma == 0) ? 0.0 :
            cosU1cosU2 * sinLambda / sinSigma; // (17)
        cosSqAlpha = 1.0 - sinAlpha * sinAlpha;
        cos2SM = (cosSqAlpha == 0) ? 0.0 :
            cosSigma - 2.0 * sinU1sinU2 / cosSqAlpha; // (18)

        var uSquared = cosSqAlpha * aSqMinusBSqOverBSq; // defn
        A = 1 + (uSquared / 16384.0) * // (3)
            (4096.0 + uSquared *
                (-768 + uSquared * (320.0 - 175.0 * uSquared)));
        var B = (uSquared / 1024.0) * // (4)
            (256.0 + uSquared *
                (-128.0 + uSquared * (74.0 - 47.0 * uSquared)));
        var C = (f / 16.0) *
            cosSqAlpha *
            (4.0 + f * (4.0 - 3.0 * cosSqAlpha)); // (10)
        var cos2SMSq = cos2SM * cos2SM;
        deltaSigma = B * sinSigma * // (6)
            (cos2SM + (B / 4.0) *
                (cosSigma * (-1.0 + 2.0 * cos2SMSq) -
                    (B / 6.0) * cos2SM *
                    (-3.0 + 4.0 * sinSigma * sinSigma) *
                    (-3.0 + 4.0 * cos2SMSq)));

        lambda = L +
            (1.0 - C) * f * sinAlpha *
            (sigma + C * sinSigma *
                (cos2SM + C * cosSigma *
                    (-1.0 + 2.0 * cos2SM * cos2SM))); // (11)

        var delta = (lambda - lambdaOrig) / lambda;
        if (Math.abs(delta) < 1.0e-12) {
            break;
        }
    }

    var distance = b * A * (sigma - deltaSigma);
    results[0] = distance;
    var initialBearing = Math.atan2(cosU2 * sinLambda,
        cosU1 * sinU2 - sinU1 * cosU2 * cosLambda);
    initialBearing *= 180.0 / Math.PI;
    results[1] = initialBearing;
    var finalBearing = Math.atan2(cosU1 * sinLambda, -sinU1 * cosU2 + cosU1 * sinU2 * cosLambda);
    finalBearing *= 180.0 / Math.PI;
    results[2] = finalBearing;
}


function LatLng(lat, lng) {
    this.lat = lat;
    this.lng = lng;
}

/**
 * @param {LatLng} other
 * @returns {Number}
 */
LatLng.prototype.distance = function(other) {
    var res = computeDistanceAndBearing(this.lat, this.lng, other.lat, other.lng);
    return nes[0];
};


/**
 * @param {Number} n
 * @param {Number} e
 * @returns {LatLng} 
 */
LatLng.prototype.moveByMetter = function(n, e) {
    var a = 6378137.0; // WGS84 major axis
    var b = 6356752.3142; // WGS84 semi-major axis
    var lat = this.lat * Math.PI / 180.0;
    var lng = this.lng * Math.PI / 180.0;
    var A = Math.cos(lat) * a;
    var dLng = e / (Math.PI * A) * 180.0;
    var dLat = n / (Math.PI * b) * 180.0;
    var newLat = this.lat + dLat;
    var newLng = this.lng + dLng;

    if (newLat < -90) newLat = -180 + newLat;
    if (newLat > 90) newLat = 180 - newLat;

    if (newLng < -180) newLng += 360;
    if (newLng > 180) newLng -= 360;
    return new LatLng(newLat, newLng);
};

function rotation_point(cx, cy, angle, x, y) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    x -= cx;
    y -= cy;

    var xnew = x * c - y * s;
    var ynew = x * s + y * c;

    x = xnew + cx;
    y = ynew + cy;
    return [x, y]
};

var GeoJSON = {};
GeoJSON.version = '0.4.1';

// Allow user to specify default parameters
GeoJSON.defaults = {
    doThrows: {
        invalidGeometry: false
    },
    removeInvalidGeometries: false
};

// GeoJSON.rotation = 90;
var fls = false;

GeoJSON.ConvertGeo = function(y, x) {
    y = eval(y);
    x = eval(x);
    // var target = this.TABLES.viewPort.viewPorts[0].viewTarget;
    // var center = this.TABLES.viewPort.viewPorts[0].center;
    if (!fls) {
        var centerLatLng = new LatLng(this.HEADER.$LATITUDE, this.HEADER.$LONGITUDE);
        fls = true;
        console.log(centerLatLng);
    }
    y -= this.mapPoint.y;
    x -= this.mapPoint.x;
    // var newPos - 
    // var nY = x;
    // var nX = -y;
    var nX = x;
    var nY = -y;
    var nX1 = -nY;
    var nY1 = nX;

    nX1 += this.HEADER.VN2000_X;
    nY1 += this.HEADER.VN2000_Y;
    // var nLatLng = centerLatLng.moveByMetter(nY-4, nX); 
    var result = rotation_point(this.HEADER.VN2000_X, this.HEADER.VN2000_Y, -eval(getGroupCodeValue(this.HEADER.$NORTHDIRECTION, 40)), nX1, nY1);
    nX1 = result[0];
    nY1 = result[1];
    // result = [NBT_to_WGS84_Long(nX1, nY1, 0),NBT_to_WGS84_Lat(nX1, nY1, 0)];
    return NBT_to_WGS84_Long_Lat(nX1, nY1, 0);
}

function InvalidGeometryError() {
    var args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
    var item = args.shift();
    var params = args.shift();

    Error.apply(this, args);
    this.message = this.message || "Invalid Geometry: " + 'item: ' + JSON.stringify(item) + ', params: ' + JSON.stringify(params);
}

InvalidGeometryError.prototype = Error;


GeoJSON.errors = {
    InvalidGeometryError: InvalidGeometryError
};

//exposing so this can be overriden maybe by geojson-validation or the like
GeoJSON.isGeometryValid = function(geometry) {
    if (!geometry || !Object.keys(geometry).length)
        return false;

    return !!geometry.type && !!geometry.coordinates && Array.isArray(geometry.coordinates) && !!geometry.coordinates.length;
};

// The one and only public function.
// Converts an array of objects into a GeoJSON feature collection
GeoJSON.parse = function(objects, params, callback) {
    if (objects.ENTITIES !== undefined)
        this.ENTITIES = objects.ENTITIES;
    if (objects.BLOCKS !== undefined)
        this.BLOCKS = objects.BLOCKS;
    if (objects.TABLES !== undefined)
        this.TABLES = objects.TABLES;
    if (objects.HEADER !== undefined) {
        this.HEADER = objects.HEADER;
        this.LATITUDE = getGroupCodeValue(this.HEADER.$LATITUDE, 40);
        this.LONGITUDE = getGroupCodeValue(this.HEADER.$LONGITUDE, 40);
        this.HEADER.VN2000_X = NBT_to_VN2000_X(this.LATITUDE, this.LONGITUDE, 0);
        this.HEADER.VN2000_Y = NBT_to_VN2000_Y(this.LATITUDE, this.LONGITUDE, 0);

        for (var i = this.ENTITIES.length - 1; i >= 0; i--) {
            if (getGroupCodeValue(this.ENTITIES[i], 2))
                if (getGroupCodeValue(this.ENTITIES[i], 2).toLowerCase() == "mappoint") {
                    this.mapPoint = {
                        x: getGroupCodeValue(this.ENTITIES[i], 10),
                        y: getGroupCodeValue(this.ENTITIES[i], 20)
                    }
                    this.HEADER.distance_X = this.HEADER.VN2000_X - this.mapPoint.x;
                    this.HEADER.distance_Y = this.HEADER.VN2000_Y - this.mapPoint.y;
                    break;
                }
        }

        this.EXTMIN = this.ConvertGeo(getGroupCodeValue(this.HEADER.$EXTMIN, 20), getGroupCodeValue(this.HEADER.$EXTMIN, 10));
        this.EXTMAX = this.ConvertGeo(getGroupCodeValue(this.HEADER.$EXTMAX, 20), getGroupCodeValue(this.HEADER.$EXTMAX, 10));
    }
    if (objects.TABLES !== undefined) {
        this.TABLES = objects.TABLES;
    }

    if (objects.BLOCKS !== undefined)
        this.BLOCKS = objects.BLOCKS;

    this.dcel = new DCEL(this)

    objects = objects.ENTITIES;
    geomAttrs.length = 0; // Reset the list of geometry fields
    this.stackNote = [];
    if (Array.isArray(objects)) {
        objects.forEach(function(item) {
            if (getGroupCodeValue(item, 8) == "bo") {
                this.getFeature({ item: item });
            } else {
                this.stackNote.push(item);
            }

        }.bind(this));
    } else {
        if (getGroupCodeValue(objects, 8)) {
            this.getFeature({ item: objects });
        } else {
            this.stackNote.push(item);
        }
    }

    return true;
};

// Helper functions
var geoms = { Point: ['POINT'], MultiPoint: [], LineString: ['LINE', 'LWPOLYLINE', 'SPLINE', 'POLYLINE'], MultiLineString: [], Polygon: [], MultiPolygon: [], GeoJSON: [] },
    geomAttrs = [],
    geoInput = {
        OLEFRAME: '',
        OLE2FRAME: '',
        ACAD_PROXY_ENTITY: '',
        POINT: '',
        ARC: '',
        POLYLINE: [10, 20],
        ARCALIGNEDTEXT: '',
        RAY: '',
        ATTDEF: '',
        REGION: '',
        ATTRIB: '',
        RTEXT: '',
        BODY: '',
        SEQEND: '',
        CIRCLE: '',
        SHAPE: '',
        DIMENSION: '',
        SOLID: '',
        ELLIPSE: '',
        SPLINE: [10, 20],
        HATCH: '',
        TEXT: '',
        IMAGE: '',
        TOLERANCE: '',
        INSERT: "",
        TRACE: '',
        VERTEX: [10, 20],
        LINE: [
            [10, 11],
            [20, 21]
        ],
        VIEWPORT: '',
        LWPOLYLINE: [10, 20],
        WIPEOUT: '',
        MLINE: '',
        XLINE: '',
        MTEXT: ''
    };
geoInput["3DSOLID"] = '';
geoInput["3DFACE"] = '';
// Adds default settings to user-specified params
// Does not overwrite any settings--only adds defaults
// the the user did not specify
function applyDefaults(params, defaults) {
    var settings = params || {};
    for (var setting in defaults) {
        if (defaults.hasOwnProperty(setting) && !settings[setting]) {
            settings[setting] = defaults[setting];
        }
    }
    return settings;
}

// Verify that the structure of CRS object is valid
function checkCRS(crs) {
    if (crs.type === 'name') {
        if (crs.properties && crs.properties.name) {
            return true;
        } else {
            throw new Error('Invalid CRS. Properties must contain "name" key');
        }
    } else if (crs.type === 'link') {
        if (crs.properties && crs.properties.href && crs.properties.type) {
            return true;
        } else {
            throw new Error('Invalid CRS. Properties must contain "href" and "type" key');
        }
    } else {
        throw new Error('Invald CRS. Type attribute must be "name" or "link"');
    }
}

GeoJSON.getFeature = function(args) {
    var item = args.item;
    if (GeoJSON.TABLES !== undefined) {
        for (var i = 0; i < GeoJSON.TABLES.LAYER.length; i++) {
            if (getGroupCodeValue(GeoJSON.TABLES.LAYER[i], 2) == getGroupCodeValue(item, 8)) {
                if (getGroupCodeValue(GeoJSON.TABLES.LAYER[i], 70) == 1)
                    return undefined;
                break;
            }
        }
    }
    var settings = {};

    for (var param in geoms) {
        if (geoms[param].indexOf(getGroupCodeValue(item, 0)) != -1) {
            settings[param] = geoInput[getGroupCodeValue(item, 0)];
            break;
        }
    }

    return this.buildGeom(item, settings);
}

// Assembles the `geometry` property
// for the feature output
GeoJSON.buildGeom = function(item, params) {
    for (var param in params) {
        if (param == "LineString") {
            var x;
            if (Array.isArray(params[param][0])) {
                x = [];
                for (var i = 0; i < params[param][0].length; i++) {
                    x.push(getGroupCodeValue(item, params[param][0][i]));
                }
            } else
                x = getGroupCodeValues(item, params[param][0]);

            var y;
            if (Array.isArray(params[param][1])) {
                y = [];
                for (var i = 0; i < params[param][1].length; i++) {
                    y.push(getGroupCodeValue(item, params[param][1][i]));
                }
            } else
                y = getGroupCodeValues(item, params[param][1]);
            var min = x.length < y.length ? x.length : y.length;
            for (var i = 1; i < min; i++) {
                this.dcel.stackLine([this.ConvertGeo(y[i], x[i]), this.ConvertGeo(y[i - 1], x[i - 1])]);
            }
        }
    }
    return true;
}

GeoJSON.extractLines = function() {
    return this.dcel.extractLines();
}

GeoJSON.internalFaces = function() {
    return this.dcel.internalFaces();
}

// Returns the function to be used to
// build the properties object for each feature
function getPropFunction(params) {
    var func;

    if (!params.exclude && !params.include) {
        func = function(properties) {
            for (var attr in this) {
                if (this.hasOwnProperty(attr) && (geomAttrs.indexOf(attr) === -1)) {
                    properties[attr] = this[attr];
                }
            }
        };
    } else if (params.include) {
        func = function(properties) {
            params.include.forEach(function(attr) {
                properties[attr] = this[attr];
            }, this);
        };
    } else if (params.exclude) {
        func = function(properties) {
            for (var attr in this) {
                if (this.hasOwnProperty(attr) && (geomAttrs.indexOf(attr) === -1) && (params.exclude.indexOf(attr) === -1)) {
                    properties[attr] = this[attr];
                }
            }
        };
    }

    return function() {
        var properties = {};

        func.call(this, properties);

        if (params.extra) { addExtra(properties, params.extra); }
        return properties;
    };
}

// Adds data contained in the `extra`
// parameter if it has been specified
function addExtra(properties, extra) {
    for (var key in extra) {
        if (extra.hasOwnProperty(key)) {
            properties[key] = extra[key];
        }
    }

    return properties;
}

export default GeoJSON;