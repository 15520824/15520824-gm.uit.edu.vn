import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/MapView.css';
import moduleDatabase from '../component/ModuleDatabase';
import {getIDCompair,removeAccents} from './FormatFunction';

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
    temp.getDataCurrent = detailView.getDataCurrent.bind(detailView);
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
    var arr = [];
    
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("districts").load({ORDERING:"stateid"}));
    arr.push(moduleDatabase.getModule("wards").load({ORDERING:"districtid"}));
    arr.push(moduleDatabase.getModule("streets").load({ORDERING:"wardid"}));
    moduleDatabase.getModule("ward_street_link").load({ORDERING:"wardid"}).then(function(value){
        temp.checkLinkAdress = moduleDatabase.getModule("ward_street_link").getLibary("wardid");
    })
    var state,district,ward,street,number;
    state = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props:{
            enableSearch: true
        },
        on:{
            change:function(event)
            {
                var x = parseInt(getIDCompair(this.value));
                for(var i = 0;i<temp.checkStateDistrict[x].length;i++)
                {
                    if(temp.checkStateDistrict[x][i] == district.value)
                    return;
                }
                if(temp.checkStateDistrict[x][0]!==undefined)
                district.value = temp.checkStateDistrict[x][0].value;
                district.emit("change");
            }
        }
    });
    district = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props:{
            enableSearch: true
        },
        on:{
            change:function(event){
                var x = parseInt(getIDCompair(this.value));
                var checkid = temp.checkState[temp.checkDistrict[x].stateid].name+"_"+temp.checkDistrict[x].stateid;
                    state.value = checkid;
                for(var i = 0;i<temp.checkDistrictWard[x].length;i++)
                {
                    if(temp.checkDistrictWard[x][i] == ward.value)
                    return;
                }
                if(temp.checkDistrictWard[x][0]!==undefined)
                ward.value = temp.checkDistrictWard[x][0].value;
            }
        }
    });
    ward = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props:{
            enableSearch: true
        },
        on:{
            change:function(event)
            {
                var x = parseInt(getIDCompair(this.value));
                var checkid = temp.checkDistrict[temp.checkWard[x].districtid].name+"_"+temp.checkWard[x].districtid;
                district.value = checkid;
            }
        }
    });
    street = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    });
    number = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-menu"
    });
    Promise.all(arr).then(function(){
        state.items = moduleDatabase.getModule("states").getList("name",["name","id"]);
        district.items = moduleDatabase.getModule("districts").getList("name",["name","id"]);
        ward.items = moduleDatabase.getModule("wards").getList("name",["name","id"]);
        street.items = moduleDatabase.getModule("streets").getList("name",["name","id"]);

        temp.checkStateDistrict = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
            return {text:data.name,value:data.name+"_"+data.id}
        },true);
        temp.checkDistrictWard = moduleDatabase.getModule("wards").getLibary("districtid",function(data){
            return {text:data.name,value:data.name+"_"+data.id}
        });
        temp.checkWard = moduleDatabase.getModule("wards").getLibary("id");
        temp.checkState = moduleDatabase.getModule("states").getLibary("id");
        temp.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
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
                    district
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
    temp.district = district;
    temp.street = street;
    temp.ward = ward;
    temp.state = state;
    Object.assign(temp,DetailView.prototype);
    temp.long = long;
    temp.lat = lat;
    temp.activeAutocomplete(map);
    return temp;
}

DetailView.prototype.getDataCurrent = function()
{
    if(temp.number.value==undefined||temp.street.value==undefined||temp.ward.value==undefined||temp.district.value==undefined||temp.state.value==undefined)
    {
        alert("Vui lòng điền đầy đủ địa chỉ");
        return;
    }
    return {
        number:this.number.value,
        street:this.street.value,
        ward:this.ward.value,
        district:this.district.value,
        state:this.state.value,
        lng:this.long.value,
        lat:this.lat.value
    }
}

DetailView.prototype.activeAutocomplete = function(map) {
    var self = this;
    var autocomplete;
    var options = {
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    };
    
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
    
    this.getLongLat(text).then(function (result) {
        map.addMoveMarker(result)
    })
    
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
    
    self.number.value = "";
    self.street.value = "";
    self.state.value = "";
    self.district.value = "";
    self.ward.value = "";

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (var i = place.address_components.length-1; i >= 0 ; i--) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            switch (addressType) {
                case "street_number":
                    var valueNumber = val;
                    self.number.value = valueNumber;
                    break;
                case "route":
                    var valueRoute = getContainsChild(self.street.items,{text:val,value:val})
                    if(valueRoute === false)
                    {
                        self.street.items= self.street.items.concat([{text:val,value:val}])
                        self.street.value = val;
                        valueRoute = {text:val,value:val};
                    }else
                    self.street.value = valueRoute.value;

                    textResult = textResult.replace(textResult.slice(0,textResult.indexOf(val+", ")+val.length+2),"");
                    break;
                case "administrative_area_level_1":
                    var valueState = getContainsChild(self.state.items,{text:val,value:val});
                    if(valueState === false)
                    {
                        self.state.items=self.state.items.concat([{text:val,value:val}]);
                        self.state.value = val;
                        valueState = {text:val,value:val};
                    }else
                    self.state.value = valueState.value;
                    break;
                case "administrative_area_level_2":
                    if(typeof valueState === "string")
                    var valueDistrict = getContainsChild(self.district.items,{text:val,value:val});
                    else
                    var valueDistrict = getContainsChild(self.checkStateDistrict[getIDCompair(valueState.value)],{text:val,value:val});
                    if(valueDistrict === false)
                    {
                        self.district.items=self.district.items.concat([{text:val,value:val}]);
                        self.district.value = val;
                        valueDistrict = {text:val,value:val};
                    }else
                    self.district.value = valueDistrict.value;
                    break;
                case "country":
                    break;
            }
        }
    }
    var val  = textResult.slice(0,textResult.indexOf(","));
    val = val.replace("Ward Number","Phường");

    if(typeof valueDistrict === "string")
    var valueWard = getContainsChild(self.ward.items,{text:val,value:val});
    else
    var valueWard = getContainsChild(self.checkDistrictWard[getIDCompair(valueDistrict.value)],{text:val,value:val});
    if(valueWard===false)
    {
        self.ward.items=self.ward.items.concat([{text:val,value:val}]);
        self.ward.value = val;
    }
    self.ward.value = valueWard.value;

    
    var stringInput = "";

    if(valueNumber!==false)
    stringInput+=valueNumber;

    if(valueRoute!==false)
    stringInput+=" "+valueRoute.text;

    if(valueWard!==false)
    stringInput+=", "+valueWard.text;

    if(valueDistrict!==false)
    stringInput+=", "+valueDistrict.text;

    if(valueState!==false)
    stringInput+=", "+valueState.text;

    self.input.value = stringInput;
}


function getContainsChild(arr, value)
{
    var check;
    for(var i = 0;i<arr.length;i++)
    {
        check = arr[i].text;
            
        if(removeAccents(check.toLowerCase()).indexOf(removeAccents(value.value.toLowerCase()))!==-1)
            return arr[i];
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
    
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        
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