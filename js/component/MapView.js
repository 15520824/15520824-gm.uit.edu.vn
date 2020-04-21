import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/MapView.css';

var _ = Fcore._;
var $ = Fcore.$;
 
export function locationView(functionDone,data) {
    var map = MapView(data);
    var detailView = DetailView(map,data);
    map.activeDetail(detailView)
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-location",
        on:{
            click:function(event)
            {
                event.preventDefault();
            }
        },
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-location-tab",
                child:[
                    {
                        tag:"span",
                        props: {
                            innerHTML: "Vị trí"
                        },
                    },
                    {
                        tag: "button",
                        class: "pizo-new-realty-location-donebutton",
                        on:{
                            click:function(event)
                            {
                                functionDone(detailView,map);
                            }
                        },
                        props: {
                            innerHTML: "Xong"
                        }
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-content",
                child: [
                    detailView,
                    map
                ]
            }
        ]
    })
    temp.map = map;
    temp.detailView = detailView;
    return temp;
}

export function DetailView(map) {
    var temp;
    var input = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-input",
        props: {
            type: "text",
            placeholder: ""
        }
    });
    var state = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    });
    var dictrict = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var ward = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var street = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var number = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var lat,long;
    long = _({
        tag:"input",
        class:"pizo-new-realty-location-detail-row-input-long",
        attr:{
            type:"number"
        },
        on:{
            change:function(event)
            {
                if(temp.changInput)
                map.addMoveMarker([parseFloat(long.value),parseFloat(lat.value)],false)
            }
        }
    })
    lat = _({
        tag:"input",
        class:"pizo-new-realty-location-detail-row-input-lat",
        attr:{
            type:"number"
        },
        on:{
            change:function(event)
            {
                if(temp.changInput)
                map.addMoveMarker([parseFloat(long.value),parseFloat(lat.value)],false)
            }
        }
    })
    temp = _({
        tag: "div",
        class: "pizo-new-realty-location-detail",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Địa chỉ đầy đủ"
                        }
                    },
                    input
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Tỉnh/TP"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            },
                        ]
                    },
                    state
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Quận/Huyện"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    dictrict
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Phường/Xã"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    ward
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Đường"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    street
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Số nhà"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    number
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "GPS"
                        },
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-location-detail-row-menu",
                        child:[
                            long,
                            lat
                        ]
                    }
                ]
            }
        ]
    })
    temp.input = input;
    temp.number = number;
    temp.dictrict = dictrict;
    temp.street = street;
    temp.ward = ward;
    temp.state = state;
    Object.assign(temp,DetailView.prototype);
    temp.long = long;
    temp.lat = lat;
    temp.activeAutocomplete(map);
    return temp;
}

DetailView.prototype.activeAutocomplete = function(map) {
    var self = this;
    var autocomplete;
    var options = {
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    };
    console.log(options)
    autocomplete = new google.maps.places.Autocomplete(
        self.input, options);

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', function () {
        self.fillInAddress(autocomplete, self.input.value, map)
    });
}

DetailView.prototype.fillInAddress = function (autocomplete, text, map) {
    // Get the place details from the autocomplete object.
    var self = this;
    var place = autocomplete.getPlace();
    console.log(autocomplete)
    this.getLongLat(text).then(function (result) {
        map.addMoveMarker(result)
    })
    console.log(place);
    var textResult = text;
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        administrative_area_level_2: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    console.log(place)
    self.number.value = "";
    self.street.value = "";
    self.state.value = "";
    self.dictrict.value = "";
    self.ward.value = "";

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            switch (addressType) {
                case "street_number":
                    self.number.value = val;
                    break;
                case "route":
                    if(!self.street.items.getContainsChild({text:val,value:val}))
                    {
                        self.street.items=self.street.items.concat([{text:val,value:val}])
                    }
                    self.street.value = val;
                    textResult = textResult.replace(textResult.slice(0,textResult.indexOf(val+", ")+val.length+2),"");
                    break;
                case "administrative_area_level_1":
                    if(!self.state.items.getContainsChild({text:val,value:val}))
                    {
                        self.state.items=self.state.items.concat([{text:val,value:val}])
                    }
                    self.state.value = val;
                    break;
                case "administrative_area_level_2":
                    if(!self.dictrict.items.getContainsChild({text:val,value:val}))
                    {
                        self.dictrict.items=self.dictrict.items.concat([{text:val,value:val}])
                    }
                    self.dictrict.value = val;
                    break;
                case "country":
                    break;
            }
        }
    }
    var val  = textResult.slice(0,textResult.indexOf(", "));
    if(!self.ward.items.getContainsChild({text:val,value:val}))
    {
        self.ward.items=self.ward.items.concat([{text:val,value:val}]);
    }
    self.ward.value = val;
}

Array.prototype.getContainsChild = function(value)
{
    for(var i = 0;i<this.length;i++)
    {
        if(this[i].value  == value.value)
        return true;
    }
    return false;
}

DetailView.prototype.geolocate = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle(
                { center: geolocation, radius: position.coords.accuracy });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


DetailView.prototype.getLongLat = function (text) {
    return new Promise(function (resolve, reject) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': text }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // do something with the geocoded result
                //
                console.log([results[0].geometry.location.lat(), results[0].geometry.location.lng()])
                resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()])
                // results[0].geometry.location.latitude
                // results[0].geometry.location.longitude
            } else {
                reject();
            }
        });
    })

}

export function MapView() {
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-location-map-view",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-location-map-view-content",
                props: {
                    id: "map-View"
                }
            }
        ]
    })
    Object.assign(temp,MapView.prototype);
    temp.mapReplace = $('div.pizo-new-realty-location-map-view-content',temp);
    return temp;
}

MapView.prototype.activePlanningMap = function()
{
    this.map = this.activeMap();
}

MapView.prototype.activeDetail = function(detailView)
{
    this.detailView = detailView;
    this.map = this.activeMap();
}

MapView.prototype.activeMap = function (center = [10.822500, 106.629104], zoom = 16) {
    var map = new google.maps.Map(this.mapReplace, {
        zoom: zoom,
        center: new google.maps.LatLng(center[0], center[1]),
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite']
        }
    });
    this.delay = 10;
    this.numDeltas = 50;
    return map;
}

MapView.prototype.addMoveMarker = function (position,changeInput=true) {
    var self = this;
    var marker;
    console.log(position)
    if(changeInput)
    self.detailView.changInput = false;
    if (this.currentMarker !== undefined) {
        marker = this.currentMarker;
        self.transition(position,changeInput).then(function (value) {
            self.map.setCenter(new google.maps.LatLng(position[0], position[1]));
            self.smoothZoom(12, self.map.getZoom());
        })
    } else {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(position[0], position[1]),
            map: self.map,
            draggable:true,
            title: "Latitude:" + position[0] + " | Longtitude:" + position[1]
        });
        this.currentMarker = marker;
        self.map.setCenter(new google.maps.LatLng(position[0], position[1]));
        self.smoothZoom(12, self.map.getZoom());
        if(changeInput){
            self.detailView.long.value = position[0];
            self.detailView.lat.value = position[1];
            self.detailView.changInput = true;
        }
        marker.addListener("dragend",function(event){
            var result = [event.latLng.lat(), event.latLng.lng()];
            self.map.setCenter(new google.maps.LatLng(result[0], result[1]));
            self.smoothZoom(12, self.map.getZoom());
            if(changeInput){
                self.detailView.long.value = result[0];
                self.detailView.lat.value = result[1];
                self.detailView.changInput = true;
            }
        })
    }


    return marker;
}

MapView.prototype.transition = function (result,changeInput) {
    var self=this;
    var position = [this.currentMarker.getPosition().lat(), this.currentMarker.getPosition().lng()];
    if(changeInput){
        self.detailView.long.value = result[0];
        self.detailView.lat.value = result[1];
        self.detailView.changInput = true;
    }

    var deltaLat = (result[0] - position[0]) / this.numDeltas;
    var deltaLng = (result[1] - position[1]) / this.numDeltas;
    // window.service.nearbySearch({ location: {lat: result[0], lng: result[1]}, rankBy: google.maps.places.RankBy.DISTANCE , type: ['market'] },
    // function(results, status){
    //     self.callback(results, status)
    // });
    return this.moveMarker(position, deltaLat, deltaLng);
}

MapView.prototype.callback = function(results, status) {
    console.log(this)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results)
        // for (var i = 0; i < results.length; i++) { 
        //     this.createMarker(results[i]); 
        // }
    }
}

MapView.prototype.createMarker = function(place) { 
    var marker = new google.maps.Marker({ map: this.map, position: place.geometry.location }); 
    google.maps.event.addListener(marker, 'click', function () { infowindow.setContent(place.name); 
    infowindow.open(map, this); }); 
}

MapView.prototype.moveMarker = function (position, deltaLat, deltaLng, i = 0) {
    var self = this;
    return new Promise(function (resolve, reject) {
        position[0] += deltaLat;
        position[1] += deltaLng;
        var latlng = new google.maps.LatLng(position[0], position[1]);
        self.currentMarker.setTitle("Latitude:" + position[0] + " | Longtitude:" + position[1]);
        self.currentMarker.setPosition(latlng);
        if (i != self.numDeltas - 1) {
            i++;
            setTimeout(function () {
                resolve(self.moveMarker(position, deltaLat, deltaLng, i));
            }, self.delay);
        } else
            resolve();
    })
}

MapView.prototype.smoothZoom = function (max, cnt) {
    var self = this;
    if (cnt >= max) {
        return;
    }
    else {
        var z = google.maps.event.addListener(this.map, 'zoom_changed', function (event) {
            google.maps.event.removeListener(z);
            self.smoothZoom(this.map, max, cnt + 1);
        });
        setTimeout(function () { self.map.setZoom(cnt) }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}