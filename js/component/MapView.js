import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/MapView.css';
import moduleDatabase from '../component/ModuleDatabase';
import { getIDCompair, removeAccents, generalOperator } from './FormatFunction';

var _ = Fcore._;
var $ = Fcore.$;

export function locationView(functionDone, data, functionCancel) {
    var map = MapView();
    var detailView = DetailView(map, data);
    map.activeDetail(detailView)
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-location",
        on: {
            click: function(event) {
                event.preventDefault();
            }
        },
        child: [{
                tag: "div",
                class: "pizo-new-realty-location-tab",
                child: [{
                        tag: "span",
                        props: {
                            innerHTML: "Vị trí"
                        },
                    },
                    {
                        tag: "button",
                        class: "pizo-new-realty-location-donebutton",
                        on: {
                            click: function(event) {
                                if (temp.detailView.number.value == undefined || temp.detailView.street.value == undefined ||
                                    temp.detailView.ward.value == undefined || temp.detailView.district.value == undefined ||
                                    temp.detailView.state.value == undefined) {
                                    alert("Vui lòng điền đầy đủ địa chỉ");
                                    return;
                                }
                                functionDone(detailView, map);
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
    if (functionCancel) {
        $("div.pizo-new-realty-location-tab", temp).appendChild(_({
            tag: "button",
            class: "pizo-new-realty-location-donebutton",
            on: {
                click: function(event) {
                    functionCancel(detailView, map);
                }
            },
            props: {
                innerHTML: "Hủy"
            }
        }))
    }
    temp.map = map;
    temp.detailView = detailView;
    temp.getDataCurrent = detailView.getDataCurrent.bind(detailView);
    temp.addLatLng = function() {
        temp.detailView.addLatLng();
        temp.map.addLatLng();
    }
    temp.data = data;

    return temp;
}

export function DetailView(map, data) {
    var temp;
    var input = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-input",
        props: {
            type: "text",
            placeholder: ""
        },
        attr: {
            disabled: ""
        }
    });
    var arr = [];
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("districts").load({ ORDERING: "stateid" }));
    arr.push(moduleDatabase.getModule("wards").load({ ORDERING: "districtid" }));
    var state, district, ward, street, number;
    state = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props: {
            enableSearch: true
        },
        on: {
            change: function(event) {
                var x = parseInt(getIDCompair(this.value));
                for (var i = 0; i < temp.checkStateDistrict[x].length; i++) {
                    if (temp.checkStateDistrict[x][i] == district.value)
                        return;
                }
                if (temp.checkStateDistrict[x] !== undefined)
                    district.items = temp.checkStateDistrict[x];
                district.emit("change");
                if (event !== undefined)
                    temp.setInput();
            }
        }
    });
    district = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props: {
            enableSearch: true
        },
        style: {
            poiterEvent: "none",
            backGroundColor: "#fafafa"
        },
        on: {
            change: function(event) {
                var x = parseInt(getIDCompair(this.value));
                if (temp.checkDistrictWard[x] !== undefined) {
                    ward.items = temp.checkDistrictWard[x];
                    ward.emit("change");
                }

                if (event !== undefined)
                    temp.setInput();
            }
        }
    });
    ward = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props: {
            enableSearch: true
        },
        style: {
            poiterEvent: "none",
            backGroundColor: "#fafafa"
        },
        on: {
            change: function(event) {
                var x = parseInt(getIDCompair(this.value));
                moduleDatabase.getModule("streets").load({ WHERE: [{ wardid: x }] }).then(function(value) {
                    temp.checkWardStreet = moduleDatabase.getModule("streets").getLibary("wardid", function(data) {
                        return { text: data.name, value: data.name + "_" + data.id }
                    }, true);
                    street.items = temp.checkWardStreet[x];
                    if (event !== undefined)
                        temp.setInput();
                })

            }
        }
    });
    street = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        style: {
            poiterEvent: "none",
            backGroundColor: "#fafafa"
        },
        on: {
            change: function(event) {
                if (event !== undefined)
                    temp.setInput();
            }
        }
    });
    number = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-menu",
        on: {
            change: function(event) {
                if (event !== undefined)
                    temp.setInput();
            }
        }
    });
    Promise.all(arr).then(function() {
        state.items = moduleDatabase.getModule("states").getList("name", ["name", "id"]);

        temp.checkStateDistrict = moduleDatabase.getModule("districts").getLibary("stateid", function(data) {
            return { text: data.name, value: data.name + "_" + data.id }
        }, true);
        temp.checkDistrictWard = moduleDatabase.getModule("wards").getLibary("districtid", function(data) {
            return { text: data.name, value: data.name + "_" + data.id }
        }, true);

        temp.checkWard = moduleDatabase.getModule("wards").getLibary("id");
        temp.checkState = moduleDatabase.getModule("states").getLibary("id");
        temp.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");

        var index;
        if (data !== undefined) {
            temp.number.value = data.number;
            index = data.state.lastIndexOf("_");
            if (index === -1) {
                temp.state.items.push({ text: data.state, value: data.state });
                temp.state.items = temp.state.items;

            }
            temp.state.value = data.state;
            temp.state.emit("change");

            index = data.district.lastIndexOf("_");
            if (index === -1) {
                temp.district.items.push({ text: data.district, value: data.district });
                temp.district.items = temp.district.items;
            }
            temp.district.value = data.district;
            temp.district.emit("change");

            index = data.ward.lastIndexOf("_");
            if (index === -1) {
                temp.ward.items.push({ text: data.ward, value: data.ward });
                temp.ward.items = temp.ward.items;
            }
            temp.ward.value = data.ward;
            temp.ward.emit("change");

            index = data.street.lastIndexOf("_");
            if (index === -1) {
                temp.street.items.push({ text: data.street, value: data.street });
                temp.street.items = temp.street.items;
            }
            temp.street.value = data.street;
            temp.setInput(false);
            if (data.lat !== undefined && data.lng !== undefined) {
                temp.lat.value = data.lat;
                temp.lng.value = data.lng;
                var postionData = [data.lat, data.lng];
                postionData["data"] = data;
                map.addMoveMarker(postionData);
            } else
                temp.setInput();
        }
    })
    var lat, lng;
    lng = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-input-long",
        attr: {
            type: "number"
        },
        on: {
            change: function(event) {
                if (temp.changInput)
                    map.addMoveMarker([parseFloat(lat.value), parseFloat(lng.value)], false)
            }
        }
    })
    lat = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-input-lat",
        attr: {
            type: "number"
        },
        on: {
            change: function(event) {
                if (temp.changInput)
                    map.addMoveMarker([parseFloat(lat.value), parseFloat(lng.value)], false)
            }
        }
    })
    var containerGPS = _({
        tag: "div",
        class: "pizo-new-realty-location-detail-row",
        style: {
            display: "none"
        },
        child: [{
                tag: "span",
                class: "pizo-new-realty-location-detail-row-label",
                props: {
                    innerHTML: "GPS"
                },
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row-menu",
                child: [
                    lat,
                    lng
                ]
            }
        ]
    })
    temp = _({
        tag: "div",
        class: "pizo-new-realty-location-detail",
        child: [{
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [{
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
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Tỉnh/TP"
                        },
                        child: [{
                            tag: "span",
                            class: "pizo-new-realty-location-detail-row-label-important",
                            props: {
                                innerHTML: "*"
                            }
                        }, ]
                    },
                    state
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Quận/Huyện"
                        },
                        child: [{
                            tag: "span",
                            class: "pizo-new-realty-location-detail-row-label-important",
                            props: {
                                innerHTML: "*"
                            }
                        }]
                    },
                    district
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Phường/Xã"
                        },
                        child: [{
                            tag: "span",
                            class: "pizo-new-realty-location-detail-row-label-important",
                            props: {
                                innerHTML: "*"
                            }
                        }]
                    },
                    ward
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Đường"
                        },
                        child: [{
                            tag: "span",
                            class: "pizo-new-realty-location-detail-row-label-important",
                            props: {
                                innerHTML: "*"
                            }
                        }]
                    },
                    street
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Số nhà"
                        },
                        child: [{
                            tag: "span",
                            class: "pizo-new-realty-location-detail-row-label-important",
                            props: {
                                innerHTML: "*"
                            }
                        }]
                    },
                    number
                ]
            },
            containerGPS
        ]
    })
    temp.map = map;
    temp.input = input;
    temp.number = number;
    temp.district = district;
    temp.street = street;
    temp.ward = ward;
    temp.state = state;
    Object.assign(temp, DetailView.prototype);
    temp.lng = lng;
    temp.lat = lat;
    temp.containerGPS = containerGPS;
    // temp.activeAutocomplete(map);
    return temp;
}

DetailView.prototype.addLatLng = function() {
    this.containerGPS.style.display = "";
}

DetailView.prototype.getDataCurrent = function() {
    var temp = {
        number: this.number.value,
        street: this.street.value,
        ward: this.ward.value,
        district: this.district.value,
        state: this.state.value
    }

    if (this.containerGPS.style.display == "") {
        temp.lng = parseFloat(this.lng.value);
        temp.lat = parseFloat(this.lat.value);
    }
    return temp;
}

DetailView.prototype.activeAutocomplete = function(map) {
    var self = this;
    map.setCurrentLocation();
    var autocomplete;
    var options = {
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['address'],
        componentRestrictions: { country: 'vn' }
    };

    autocomplete = new google.maps.places.Autocomplete(
        self.input, options
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', function() {
        if (self.input.value !== self.input.lastValue)
            self.fillInAddress(autocomplete, self.input.value, map)
        self.input.lastValue = self.input.value;
    });
    self.autocomplete = autocomplete;
}

DetailView.prototype.setInput = function(isChange = true) {
    var self = this;
    var stringInput = "";
    var index;
    var valueNumber = this.number.value;
    var valueRoute = this.street.value;
    var valueWard = this.ward.value;
    var valueDistrict = this.district.value;
    var valueState = this.state.value;
    var isFirst = "";

    if (valueNumber !== undefined) {
        stringInput += isFirst + valueNumber;
        isFirst = " ";
    }

    if (valueRoute !== undefined) {
        index = valueRoute.lastIndexOf("_");
        if (index == -1)
            stringInput += isFirst + valueRoute;
        else
            stringInput += isFirst + valueRoute.slice(0, index);
        isFirst = ", "
    }


    if (valueWard !== undefined) {
        index = valueWard.lastIndexOf("_");
        if (index == -1)
            stringInput += isFirst + valueWard;
        else
            stringInput += isFirst + valueWard.slice(0, index);
        isFirst = ", "
    }

    if (valueDistrict !== undefined) {
        index = valueDistrict.lastIndexOf("_");
        if (index == -1)
            stringInput += isFirst + valueDistrict;
        else
            stringInput += isFirst + valueDistrict.slice(0, index);
        isFirst = ", "
    }

    if (valueState !== undefined) {
        index = valueState.lastIndexOf("_");
        if (index == -1)
            stringInput += isFirst + valueState;
        else
            stringInput += isFirst + valueState.slice(0, index);
        isFirst = ", "
    }
    this.input.value = stringInput;

    if (isChange === true)
        this.getLongLat(stringInput).then(function(result) {
            self.map.addMoveMarker(result)
        })
        // if(isChange===true)
        // google.maps.event.trigger(this.autocomplete, 'place_changed');
}

DetailView.prototype.fillInAddress = function(autocomplete, text, map) {
    // Get the place details from the autocomplete object.
    // var self = this;
    // var place = autocomplete.getPlace();

    this.getLongLat(text).then(function(result) {
        map.addMoveMarker(result)
    })

    // var textResult = text;
    // var componentForm = {
    //     street_number: 'short_name',
    //     route: 'long_name',
    //     locality: 'long_name',
    //     administrative_area_level_1: 'long_name',
    //     administrative_area_level_2: 'long_name',
    //     country: 'long_name',
    //     postal_code: 'short_name'
    // };

    // self.number.value = "";
    // self.street.value = "";
    // self.state.value = "";
    // self.district.value = "";
    // self.ward.value = "";

    // // Get each component of the address from the place details,
    // // and then fill-in the corresponding field on the form.
    // console.log(place)
    // for (var i = place.address_components.length-1; i >= 0 ; i--) {
    //     var addressType = place.address_components[i].types[0];
    //     if (componentForm[addressType]) {
    //         var val = place.address_components[i][componentForm[addressType]];
    //         switch (addressType) {
    //             case "street_number":
    //                 var valueNumber = val;
    //                 console.log(val)
    //                 self.number.value = valueNumber;
    //                 break;
    //             case "route":
    //                 var valueRoute = getContainsChild(self.street.items,{text:val,value:val})
    //                 if(valueRoute === false)
    //                 {
    //                     self.street.items= self.street.items.concat([{text:val,value:val}])
    //                     self.street.value = val;
    //                     valueRoute = {text:val,value:val};
    //                 }else
    //                 self.street.value = valueRoute.value;

    //                 textResult = textResult.replace(textResult.slice(0,textResult.indexOf(val+", ")+val.length+2),"");
    //                 break;
    //             case "administrative_area_level_1":
    //                 var valueState = getContainsChild(self.state.items,{text:val,value:val});
    //                 if(valueState === false)
    //                 {
    //                     self.state.items=self.state.items.concat([{text:val,value:val}]);
    //                     self.state.value = val;
    //                     valueState = {text:val,value:val};
    //                 }else
    //                 self.state.value = valueState.value;
    //                 break;
    //             case "administrative_area_level_2":
    //                 if(typeof valueState === "string")
    //                 var valueDistrict = getContainsChild(self.district.items,{text:val,value:val});
    //                 else
    //                 var valueDistrict = getContainsChild(self.checkStateDistrict[getIDCompair(valueState.value)],{text:val,value:val});
    //                 if(valueDistrict === false)
    //                 {
    //                     self.district.items=self.district.items.concat([{text:val,value:val}]);
    //                     self.district.value = val;
    //                     valueDistrict = {text:val,value:val};
    //                 }else
    //                 self.district.value = valueDistrict.value;
    //                 break;
    //             case "country":
    //                 break;
    //         }
    //     }
    // }
    // var val  = textResult.slice(0,textResult.indexOf(","));
    // val = val.replace("Ward Number","Phường");

    // if(typeof valueDistrict === "string")
    // var valueWard = getContainsChild(self.ward.items,{text:val,value:val});
    // else
    // var valueWard = getContainsChild(self.checkDistrictWard[getIDCompair(valueDistrict.value)],{text:val,value:val});
    // if(valueWard===false)
    // {
    //     self.ward.items=self.ward.items.concat([{text:val,value:val}]);
    //     self.ward.value = val;
    // }
    // self.ward.value = valueWard.value;


    // this.setInput();
}


function getContainsChild(arr, value) {
    var check;
    for (var i = 0; i < arr.length; i++) {
        check = arr[i].text;

        if (removeAccents(check.toLowerCase()).indexOf(removeAccents(value.value.toLowerCase())) !== -1)
            return arr[i];
    }
    return false;
}

DetailView.prototype.geolocate = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({ center: geolocation, radius: position.coords.accuracy });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


DetailView.prototype.getLongLat = function(text) {
    return new Promise(function(resolve, reject) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': text }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // do something with the geocoded result
                //

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
        child: [{
            tag: "div",
            class: "pizo-new-realty-location-map-view-content",
            props: {
                id: "map-View"
            }
        }]
    })
    Object.assign(temp, MapView.prototype);
    temp.mapReplace = $('div.pizo-new-realty-location-map-view-content', temp);
    temp.map = temp.activeMap();
    temp.isShowAddress = true;
    return temp;
}


MapView.prototype.setLabelUnder = function(isShowAddress = true) {
    this.isShowAddress = isShowAddress;
}

MapView.prototype.activePlanningMap = function() {
    this.addMapPolygon();
    this.addMapHouse();
}

MapView.prototype.addLatLng = function() {
    if (this.currentMarker !== undefined) {
        this.currentMarker.setOption({ draggable: true });
    }
    this.draggable = true;
}

MapView.prototype.addMapPolygon = function() {
    var self = this;
    if (this.checkMap === undefined)
        this.checkMap = [];
    if (this.currentPolygon === undefined)
        this.currentPolygon = [];
    if (this.checkLibary === undefined)
        this.checkLibary = [];
    google.maps.event.addListener(self.map, 'zoom_changed', function() {
        var zoomLevel = self.map.getZoom();
        if (zoomLevel >= 20) {
            self.enablePolygon = true;
            new google.maps.event.trigger(self.map, 'center_changed');
        } else {
            self.enablePolygon = false;
            self.removeMapPolygon();
        }
    });
    self.map.setZoom(20);
    var intLng, cellLng, intLat, cellLat, cellDeltaLat, cellDeltaLng;
    google.maps.event.addListener(self.map, "center_changed", function() {
        if (self.enablePolygon == true) {
            var promiseAll = [];
            var center = this.getCenter();
            var latitude = center.lat();
            var longitude = center.lng();
            intLng = parseInt(longitude / 1);
            cellLng = Math.ceil(longitude % 1 / (1 / 1110));
            intLat = parseInt(latitude / 1);
            cellLat = Math.ceil(latitude % 1 / (1 / 1110));
            cellLng = intLng * 10000 + cellLng;
            cellLat = intLat * 10000 + cellLat;
            self.removeMapPolygonAround(cellLat, cellLng);
            for (var m = -2; m <= 1; m++) {
                for (var k = -2; k <= 1; k++) {
                    cellDeltaLat = cellLat + m;
                    cellDeltaLng = cellLng + k;
                    if (self.checkMap[cellDeltaLat] === undefined || self.checkMap[cellDeltaLat][cellDeltaLng] === undefined) {
                        if (self.checkMap[cellDeltaLat] === undefined)
                            self.checkMap[cellDeltaLat] = [];
                        if (self.checkMap[cellDeltaLat][cellDeltaLng] === undefined)
                            self.checkMap[cellDeltaLat][cellDeltaLng] = [];
                        if (self.checkLibary[cellDeltaLat] === undefined)
                            self.checkLibary[cellDeltaLat] = [];
                        self.checkLibary[cellDeltaLat][cellDeltaLng] = 1;
                        var promiseTemp = new Promise(function(resolve, reject) {
                            moduleDatabase.getModule("polygon").load({ WHERE: [{ cellLng: cellDeltaLng }, "&&", { cellLat: cellDeltaLat }] }).then(function(cellDeltaLat, cellDeltaLng, value) {
                                if (self.enablePolygon == true) {
                                    for (var i = 0; i < value.length; i++) {
                                        self.addWKT(value[i]["AsText(`map`)"], cellDeltaLat, cellDeltaLng)
                                    }
                                    resolve();
                                }
                            }.bind(null, cellDeltaLat, cellDeltaLng));
                        });

                        promiseAll.push(promiseTemp);
                    } else {
                        self.setMapPolygon(cellDeltaLat, cellDeltaLng);
                    }
                }
            }
            if (self.isDoneMarker) {
                promiseAll.push(self.isDoneMarker)
                Promise.all(promiseAll).then(function() {
                    for (var i = 0; i < self.currentHouse.length; i++) {
                        var marker = self.checkHouse[self.currentHouse[i][0]][self.currentHouse[i][1]];
                        if (marker.length > 0)
                            marker = marker[0];
                        if (marker.isTrigger === true)
                            continue;
                        var cellLatX, cellLngX, intLngX, intLatX, deltaLat, deltaLng;
                        intLngX = parseInt(self.currentHouse[i][1] / 1);
                        cellLngX = self.currentHouse[i][1] % 1 / (1 / 1110);
                        deltaLng = cellLngX % 1;
                        if (deltaLng > 0.5)
                            cellLngX = Math.ceil(cellLngX) - 1;
                        else
                            cellLngX = Math.ceil(cellLngX) - 2;
                        intLatX = parseInt(self.currentHouse[i][0] / 1);
                        cellLatX = self.currentHouse[i][0] % 1 / (1 / 1110);
                        deltaLat = cellLatX % 1;
                        if (deltaLat > 0.5)
                            cellLatX = Math.ceil(cellLatX) - 1;
                        else
                            cellLatX = Math.ceil(cellLatX) - 2;
                        cellLngX = intLngX * 10000 + cellLngX;
                        cellLatX = intLatX * 10000 + cellLatX;
                        for (var k = 0; k < 2; k++) {
                            for (var n = 0; n < 2; n++) {
                                var arrPolygon = self.checkMap[cellLatX + k];
                                if (arrPolygon) {
                                    arrPolygon = arrPolygon[cellLngX + n];
                                    if (arrPolygon)
                                        for (var j = 0; j < arrPolygon.length; j++) {
                                            if (google.maps.geometry.poly.containsLocation(marker.getPosition(), arrPolygon[j])) {
                                                google.maps.event.addListener(arrPolygon[j], "mousemove", function() {
                                                    google.maps.event.trigger(marker, 'mouseover');
                                                });
                                                google.maps.event.addListener(arrPolygon[j], "click", function() {
                                                    google.maps.event.trigger(marker, 'click');
                                                });
                                                google.maps.event.addListener(arrPolygon[j], "mouseout", function() {
                                                    google.maps.event.trigger(marker, 'mouseout');
                                                });
                                                marker.isTrigger = true;
                                            }
                                        }
                                }
                            }
                        }
                    }
                })
            }
        }
    });
}

MapView.prototype.addWKT = function(multipolygonWKT, cellLat, cellLng) {
    var wkt = new Wkt.Wkt();
    wkt.read(multipolygonWKT);
    var components = wkt.components;
    for (var k = 0; k < components.length; k++) {
        var line = components[k];
        var polygon = new google.maps.Polygon({
            paths: line,
            strokeColor: "#000000",
            fillColor: "#adaeaf",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            map: this.map,
            geodesic: true
        })
        google.maps.event.addListener(polygon, "mouseover", function() {
            this.setOptions({ fillColor: "#00FF00" });
        });

        google.maps.event.addListener(polygon, "mouseout", function() {
            this.setOptions({ fillColor: "#adaeaf" });
        });
        this.checkMap[cellLat][cellLng].push(polygon);
    }
    if (this.checkLibary[cellLat] === undefined)
        this.checkLibary[cellLat] = [];
    this.currentPolygon.push([cellLat, cellLng]);

    return this.checkMap[cellLat][cellLng];
}

MapView.prototype.setMapPolygon = function(cellLat, cellLng) {
    if (this.checkLibary[cellLat] === undefined || this.checkLibary[cellLat][cellLng] === 1)
        return;
    var arr = this.checkMap[cellLat][cellLng];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getMap() === null)
            arr[i].setMap(this.map);
    }
    if (this.checkLibary[cellLat] === undefined)
        this.checkLibary[cellLat] = [];

    if (this.checkLibary[cellLat][cellLng] !== 1)
        this.currentPolygon.push([cellLat, cellLng]);

    this.checkLibary[cellLat][cellLng] = 1;
}

MapView.prototype.removeMapPolygon = function(arr) {
    for (var i = this.currentPolygon.length - 1; i >= 0; i--) {
        var arr = this.checkMap[this.currentPolygon[i][0]][this.currentPolygon[i][1]];
        for (var j = 0; j < arr.length; j++) {
            arr[j].setMap(null);
        }
        this.checkLibary[this.currentPolygon[i][0]][this.currentPolygon[i][1]] = undefined;
        this.currentPolygon.splice(i, 1);
    }
}

MapView.prototype.removeMapPolygonAround = function(cellLat, cellLng) {
    var currentLat, currentLng;
    for (var i = this.currentPolygon.length - 1; i >= 0; i--) {
        currentLat = this.currentPolygon[i][0];
        currentLng = this.currentPolygon[i][1];
        if (Math.abs(currentLat - cellLat) > 3 || Math.abs(currentLng - cellLng) > 3) {
            var arr = this.checkMap[currentLat][currentLng];

            for (var j = 0; j < arr.length; j++) {
                arr[j].setMap(null);
            }
            this.currentPolygon.splice(i, 1);
            this.checkLibary[currentLat][currentLng] = undefined;
        }
    }
}


MapView.prototype.addMapHouse = function() {
    var self = this;
    if (this.checkWard == undefined)
        self.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    if (this.checkDistrict == undefined)
        self.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    if (this.checkState == undefined)
        self.checkState = moduleDatabase.getModule("states").getLibary("id");
    if (this.checkHouse === undefined)
        this.checkHouse = [];
    if (this.currentHouse === undefined)
        this.currentHouse = [];
    google.maps.event.addListener(self.map, 'zoom_changed', function() {
        var zoomLevel = self.map.getZoom();
        if (zoomLevel >= 10) {
            self.enableHouse = true;
            new google.maps.event.trigger(self.map, 'center_changed');
        } else {
            self.enableHouse = true;
            // self.removeMapHouse();
        }
    });
    self.map.setZoom(20);

    google.maps.event.addListener(self.map, "idle", function() {
        self.isDoneMarker = new Promise(function(resolve, reject) {
            var bounds = self.map.getBounds();
            var ne = bounds.getNorthEast(); // LatLng of the north-east corner
            var sw = bounds.getSouthWest();

            var topRight = [ne.lat(), ne.lng()];
            var bottomLeft = [sw.lat(), sw.lng()];
            self.bottomLeft = bottomLeft;
            self.topRight = topRight;

            if (self.enableHouse == true) {
                self.removeMapHouseAround();
                var queryData = [{ lat: { operator: ">", value: bottomLeft[0] } }, "&&", { lat: { operator: "<", value: topRight[0] } }, "&&",
                    { lng: { operator: ">", value: bottomLeft[1] } }, "&&", { lng: { operator: "<", value: topRight[1] } }
                ];
                if (self.currentMarker && self.currentMarker.data !== undefined && self.currentMarker.data.id !== undefined) {
                    queryData = [queryData];
                    queryData.push("&&");
                    queryData.push({ id: { operator: "!=", value: self.currentMarker.data.id } })
                }
                if (queryData.length > 0) {
                    queryData.push("&&");
                    queryData.push({ censorship: 1 });
                }
                moduleDatabase.getModule("activehouses").load({ WHERE: queryData }).then(
                    function(data) {
                        var isAvailable, districtid, stateid;
                        for (var i = 0; i < data.length; i++) {
                            isAvailable = false;
                            Loop: for (var param in moduleDatabase.checkPermission) {
                                if (data[i].portion == "" && data[i].addressnumber == "")
                                    continue;
                                var object = JSON.parse(param);
                                districtid = undefined;
                                stateid = undefined;
                                if (data[i].wardid)
                                    districtid = self.checkWard[data[i].wardid].districtid;
                                if (districtid)
                                    stateid = self.checkDistrict[districtid].stateid;
                                for (var objectParam in object) {
                                    if (objectParam === "stateid") {
                                        if (stateid !== object[objectParam])
                                            continue Loop;
                                    } else
                                    if (objectParam === "districtid") {
                                        if (districtid !== object[objectParam])
                                            continue Loop;
                                    } else
                                    if (object[objectParam] !== data[i][objectParam]) {
                                        continue Loop;
                                    }
                                }
                                if (moduleDatabase.checkPermission[param].indexOf(56) !== -1) {
                                    isAvailable = true;
                                }
                            }
                            if (isAvailable == false)
                                continue;
                            self.addOrtherMarker(data[i]);
                        }
                        var event = new CustomEvent("change-house");
                        self.dispatchEvent(event);
                        resolve();
                    })
            }
        }.bind(this));

    });
}

MapView.prototype.setLabelContent = function(isPrice) {
    this.isPrice = isPrice;
    var data;
    var labelContent;
    var label;
    for (var i = 0; i < this.currentHouse.length; i++) {
        data = this.checkHouse[this.currentHouse[i][0]][this.currentHouse[i][1]];
        if (data) {
            for (var j = 0; j < data.length; j++) {
                if (this.isPrice == true) {
                    label = data[j].data.price + " tỉ";
                } else if (this.isPrice == false)
                    label = ((parseInt(data[j].data.pricerent) / 1000000) + " triệu");
                else {
                    if (parseInt(data[j].data.salestatus / 10) == 1 ? true : false)
                        label = data[j].data.price + " tỉ";
                    else if (parseInt(data[j].data.salestatus % 10) == 1 ? true : false)
                        label = (parseInt(data[j].data.pricerent) / 1000000) + " triệu";
                    else if (data[j].data.price > 0)
                        label = data[j].data.price + " tỉ";
                    else if (data[j].data.pricerent > 0)
                        label = (parseInt(data[j].data.pricerent) / 1000000) + " triệu";
                }
                labelContent = _({
                    tag: "div",
                    child: [{
                            tag: "div",
                            class: "arrow",
                        },
                        {
                            tag: "div",
                            class: "inner",
                            props: {
                                innerHTML: label
                            }
                        }
                    ]
                });
                data[j].set('labelContent', labelContent);
            }
        }
    }
}

MapView.prototype.setGeneralOperator = function(WHERE) {
    var data;
    this.WHERE = WHERE;
    for (var i = 0; i < this.currentHouse.length; i++) {
        data = this.checkHouse[this.currentHouse[i][0]][this.currentHouse[i][1]];
        if (data) {
            for (var j = 0; j < data.length; j++) {
                if (generalOperator(data[j].data, WHERE) == false) {
                    data[j].setMap(null);
                } else {
                    data[j].setMap(this.map);
                }
            }
        }
    }
    var event = new CustomEvent("change-house");
    this.dispatchEvent(event);
}

MapView.prototype.addOrtherMarker = function(data) {
    var self = this;
    var position = [data.lat, data.lng];
    if (this.checkHouse[position[0]] !== undefined && this.checkHouse[position[0]][position[1]] !== undefined) {
        var arr = this.checkHouse[position[0]][position[1]];
        for (var j = 0; j < arr.length; j++) {
            if (arr[j].getMap() === null) {
                if (self.WHERE) {
                    if (generalOperator(arr[j].data, self.WHERE) == false)
                        arr[j].setMap(null);
                    else {
                        arr[j].setMap(self.map);
                        if (this.isPrice == true) {
                            label = arr[j].data.price + " tỉ";
                        } else if (this.isPrice == false)
                            label = ((parseInt(arr[j].data.pricerent) / 1000000) + " triệu");
                        else if (parseInt(arr[j].data.salestatus / 10) == 1 ? true : false)
                            label = arr[j].data.price + " tỉ";
                        else if (parseInt(arr[j].data.salestatus % 10) == 1 ? true : false)
                            label = (parseInt(arr[j].data.pricerent) / 1000000) + " triệu";
                        else if (arr[j].data.price > 0)
                            label = arr[j].data.price + " tỉ";
                        else if (arr[j].data.pricerent > 0)
                            label = (parseInt(arr[j].data.pricerent) / 1000000) + " triệu";
                    }
                    var labelContent = _({
                        tag: "div",
                        child: [{
                                tag: "div",
                                class: "arrow",
                            },
                            {
                                tag: "div",
                                class: "inner",
                                props: {
                                    innerHTML: label
                                }
                            }
                        ]
                    })
                    arr[j].set('labelContent', labelContent);
                } else
                    arr[j].setMap(self.map);
                this.currentHouse.push(position);
            }
        }
        var marker = arr;
    } else {
        var image = {
            url: "./assets/images/marker-red.png",
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(24, 24),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(12, 12)
        };
        var label;
        if (self.isShowAddress === true) {
            if (data.addressnumber)
                label = data.addressnumber;
        } else if (self.isShowAddress === false) {
            if (this.isPrice == true) {
                label = data.price + " tỉ";
            } else if (this.isPrice == false)
                label = ((parseInt(data.pricerent) / 1000000) + " triệu");
            else if (parseInt(data.salestatus / 10) == 1 ? true : false)
                label = data.price + " tỉ";
            else if (parseInt(data.salestatus % 10) == 1 ? true : false)
                label = (parseInt(data.pricerent) / 1000000) + " triệu";
            else if (data.price > 0)
                label = data.price + " tỉ";
            else if (data.pricerent > 0)
                label = (parseInt(data.pricerent) / 1000000) + " triệu";
        }
        var labelContent = _({
            tag: "div",
            child: [{
                    tag: "div",
                    class: "arrow",
                },
                {
                    tag: "div",
                    class: "inner",
                    props: {
                        innerHTML: label
                    }
                }
            ]
        })

        var marker = new MarkerWithLabel({
            position: new google.maps.LatLng(position[0], position[1]),
            draggable: false,
            icon: image,
            labelContent: labelContent,
            labelAnchor: new google.maps.Point(40, -5),
            labelClass: "labels",
            zIndex: 2,
        });
        if (self.WHERE) {
            if (generalOperator(data, self.WHERE) == false)
                marker.setMap(null);
            else
                marker.setMap(self.map);
        } else
            marker.setMap(self.map);
        this.currentHouse.push(position);
        var imageHover = {
            url: "./assets/images/marker-green.png",
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(24, 24),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(12, 12)
        };
        // var mouseOverInfoWindow = false, timeoutID;
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 350
        });

        marker.data = data;
        google.maps.event.addListener(marker, 'mouseover', function() {
            if (infowindow.visible === true)
                return;
            infowindow.setContent(self.modalMiniRealty(marker.data));
            infowindow.open(self.map, marker);
            infowindow.visible = true;
            marker.setIcon(imageHover);
        });
        google.maps.event.addListener(marker, 'mouseout', function(event) {
            marker.setIcon(image);
            infowindow.close();
            infowindow.visible = false;
        });

        if (this.checkHouse[position[0]] === undefined)
            this.checkHouse[position[0]] = [];
        if (this.checkHouse[position[0]][position[1]] === undefined)
            this.checkHouse[position[0]][position[1]] = [marker];
        else
            this.checkHouse[position[0]][position[1]].push(marker);
        this.currentHouse.push(position);
    }

    self.isDoneMarker = true;
    return this.currentHouse;
}

MapView.prototype.setFilter = function() {

}

MapView.prototype.modalMiniRealty = function(data) {

    var temp = _({
        tag: "a",
        class: "responsive-mini-bubble",
        child: [{
            tag: "div",
            class: "mini-bubble-content",
            child: [{
                    tag: "div",
                    class: "mini-bubble-image",
                },
                {
                    tag: "div",
                    class: "mini-bubble-details",
                    child: [{
                            tag: "strong",
                            props: {
                                innerHTML: "VND " + data.price + " tỉ"
                            }
                        },
                        {
                            tag: "div",
                            props: {
                                innerHTML: data.width + "m x " + data.height + "m"
                            }
                        },
                        {
                            tag: "div",
                            props: {
                                innerHTML: data.acreage + "m²"
                            }
                        }
                    ]
                }
            ]
        }]
    })
    var image = $("div.mini-bubble-image", temp);
    var src = moduleDatabase.imageThumnail;
    if (data !== undefined) {
        moduleDatabase.getModule("image").load({ WHERE: [{ houseid: data.id }] }).then(function(values) {
            for (var i = 0; i < values.length; i++) {
                if (values[i].type == 1) {
                    src = moduleDatabase.imageAssetSrc + values[i].src;
                }
                if (values[i].thumnail == 1) {
                    src = moduleDatabase.imageAssetSrc + values[i].src;
                    image.style.backgroundImage = `url(` + src + `)`;
                    break;
                }
            }
            image.style.backgroundImage = `url(` + src + `)`;
        })
    }
    image.style.backgroundImage = `url(` + src + `)`;
    return temp;
}

MapView.prototype.removeMapHouse = function(arr) {
    for (var i = this.currentHouse.length - 1; i >= 0; i--) {
        var arr = this.checkHouse[this.currentHouse[i][0]][this.currentHouse[i][1]];
        for (var j = 0; j < arr.length; j++) {
            arr[j].setMap(null);
        }
        this.currentHouse.splice(i, 1);
    }
}

MapView.prototype.removeMapHouseAround = function(cellLat, cellLng) {
    var currentLat, currentLng;
    for (var i = this.currentHouse.length - 1; i >= 0; i--) {
        currentLat = this.currentHouse[i][0];
        currentLng = this.currentHouse[i][1];
        if (currentLat < this.bottomLeft[0] ||
            currentLat > this.topRight[0] ||
            currentLng < this.bottomLeft[1] ||
            currentLng > this.topRight[1]) {
            var arr = this.checkHouse[currentLat][currentLng];

            for (var j = 0; j < arr.length; j++) {
                arr[j].setMap(null);
            }
            this.currentHouse.splice(i, 1);
        }
    }
}

MapView.prototype.activeDetail = function(detailView) {

    this.detailView = detailView;
    this.addMapPolygon();
    this.addMapHouse();
}

MapView.prototype.activeMap = function(center = [10.822500, 106.629104], zoom = 16) {
    var map = new google.maps.Map(this.mapReplace, {
        zoom: zoom,
        center: new google.maps.LatLng(center[0], center[1]),
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite']
        }
    });
    this.delay = 10;
    this.numDeltas = 50;
    this.draggable = false;
    this.moveCurrentMarker = true;
    return map;
}

MapView.prototype.setCurrentLocation = function() {
    var geolocationDiv = document.createElement('div');
    var geolocationControl = this.GeolocationControl(geolocationDiv, this.map);

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);
}

MapView.prototype.setMoveMarkerWithCurrent = function(value) {
    this.moveCurrentMarker = value;
}

MapView.prototype.addMoveMarker = function(position, changeInput = true) {
    var self = this;
    var marker;
    if (self.detailView !== undefined) {
        if (changeInput)
            self.detailView.changInput = false;
    } else
        changeInput = false;

    if (this.currentMarker !== undefined) {
        marker = this.currentMarker;
        self.transition(position, changeInput).then(function(value) {
            self.map.setCenter(new google.maps.LatLng(position[0], position[1]));
            self.smoothZoom(20, self.map.getZoom());
        })
    } else {
        var image = {
            url: "./assets/images/marker-blue.png",
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(24, 24),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(12, 12)
        };
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(position[0], position[1]),
            map: self.map,
            draggable: self.draggable,
            icon: image,
            title: "Latitude:" + position[0] + " | Longtitude:" + position[1],
            zIndex: 100
        });
        this.currentMarker = marker;
        if (position.data !== undefined) {
            marker.data = position.data;
        }
        self.map.setCenter(new google.maps.LatLng(position[0], position[1]));
        self.smoothZoom(20, self.map.getZoom());
        if (changeInput) {
            self.detailView.lng.value = position[1];
            self.detailView.lat.value = position[0];
            self.detailView.changInput = true;
        }
        marker.addListener("dragend", function(event) {
            var result = [event.latLng.lat(), event.latLng.lng()];
            self.map.setCenter(new google.maps.LatLng(result[0], result[1]));
            self.smoothZoom(20, self.map.getZoom());
            if (changeInput) {
                self.detailView.lng.value = result[1];
                self.detailView.lat.value = result[0];
                self.detailView.changInput = true;
            }
        })
    }


    return marker;
}

MapView.prototype.transition = function(result, changeInput) {
    var self = this;
    var position = [this.currentMarker.getPosition().lat(), this.currentMarker.getPosition().lng()];
    if (changeInput) {
        self.detailView.lng.value = result[1];
        self.detailView.lat.value = result[0];
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

    if (status === google.maps.places.PlacesServiceStatus.OK) {

        // for (var i = 0; i < results.length; i++) { 
        //     this.createMarker(results[i]); 
        // }
    }
}

MapView.prototype.createMarker = function(place) {
    var marker = new google.maps.Marker({ map: this.map, position: place.geometry.location });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

MapView.prototype.moveMarker = function(position, deltaLat, deltaLng, i = 0) {
    var self = this;
    return new Promise(function(resolve, reject) {
        position[0] += deltaLat;
        position[1] += deltaLng;
        var latlng = new google.maps.LatLng(position[0], position[1]);
        self.currentMarker.setTitle("Latitude:" + position[0] + " | Longtitude:" + position[1]);
        self.currentMarker.setPosition(latlng);
        if (i != self.numDeltas - 1) {
            i++;
            setTimeout(function() {
                resolve(self.moveMarker(position, deltaLat, deltaLng, i));
            }, self.delay);
        } else
            resolve();
    })
}

MapView.prototype.smoothZoom = function(max, cnt) {
    var self = this;
    if (cnt >= max) {
        return;
    } else {
        var z = google.maps.event.addListener(this.map, 'zoom_changed', function(event) {
            google.maps.event.removeListener(z);
            self.smoothZoom(this.map, max, cnt + 1);
        });
        setTimeout(function() {
            if (cnt !== undefined)
                self.map.setZoom(cnt)
        }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}




MapView.prototype.GeolocationControl = function(controlDiv) {

    // Set CSS for the control button
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#444';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = 'white';
    controlUI.style.height = '28px';
    controlUI.style.marginTop = '5px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center map on your location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control text
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '10px';
    controlText.style.color = 'white';
    controlText.style.paddingLeft = '10px';
    controlText.style.paddingRight = '10px';
    controlText.style.marginTop = '8px';
    controlText.innerHTML = 'Chọn để quay về vị trí hiện tại';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to geolocate user
    google.maps.event.addDomListener(controlUI, 'click', this.geolocateMap.bind(this));
}

MapView.prototype.geolocateMap = function() {
    var self = this;
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {
            if (self.moveCurrentMarker)
                self.addMoveMarker([position.coords.latitude, position.coords.longitude]);
            else {
                self.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                self.smoothZoom(20, self.map.getZoom());
            }
        });
    }
}