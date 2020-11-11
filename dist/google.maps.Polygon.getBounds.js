/**
 * Polygon getBounds extension - google-maps-extensions
 * @see http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
 */
if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function(latLng) {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPaths();
        var path;

        for (var p = 0; p < paths.getLength(); p++) {
            path = paths.getAt(p);
            for (var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            }
        }

        return bounds;
    };
}

if (!google.maps.Polyline.prototype.getBounds) {
    google.maps.Polyline.prototype.getBounds = function() {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPath();
        var path;

        for (var p = 0; p < paths.getLength(); p++) {
            path = paths.getAt(p);
            console.log(path)
            for (var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            }
        }
        return bounds;
    };
}

if (!google.maps.Polyline.prototype.Contains) {
    google.maps.Polygon.prototype.Contains = function(point) {
        var crossings = 0,
            path = this.getPath();

        // for each edge
        for (var i = 0; i < path.getLength(); i++) {
            var a = path.getAt(i),
                j = i + 1;
            if (j >= path.getLength()) {
                j = 0;
            }
            var b = path.getAt(j);
            if (rayCrossesSegment(point, a, b)) {
                crossings++;
            }
        }
    }
}