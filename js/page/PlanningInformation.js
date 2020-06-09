import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/PlanningInformation.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { consoleWKT,loaddingWheel ,getGMT,formatDate } from '../component/FormatFunction';

import { MapView } from "../component/MapView";
import moduleDatabase from '../component/ModuleDatabase';


var _ = Fcore._;
var $ = Fcore.$;

function PlanningInformation() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

PlanningInformation.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(PlanningInformation.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
PlanningInformation.prototype.constructor = PlanningInformation;

PlanningInformation.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag:"input",
        class:"quantumWizTextinputPaperinputInput",
        props:{
            type:"number",
            autocomplete:"off",
            min:1,
            max:200,
            step:1,
            value:50
        }
    })
    var allinput = _({
        tag:"input",
        class:"pizo-list-realty-page-allinput-input",
        props:{
            placeholder:"Tìm theo địa chỉ"
        }
    });
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tìm theo địa chỉ"
    }

    var mapView = new MapView(); 
    mapView.activePlanningMap();
    this.searchControl = this.searchControlContent();

    var hiddenInput = _({
        tag:"input",
        class:"hiddenUI",
        on:{
            change: function(event)
            {  
                var file = this.files[0];
                var loadding = new loaddingWheel();
                var reader = new FileReader();
                reader.readAsText(this.files[0]);
                reader.onload = function(e) {
                    console.time("dcel cost");
                    console.log(file)
                    var extension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
                    var fileText = e.target.result;
                    if(extension === "json"){
                        moduleDatabase.getModule("geometry").add({map:fileText}).then(function(value){
                            loadding.disable();
                        });
                    }
                    else if(extension === "dxf")
                    {
                        var parser = new DxfParser();
                        var dxf = null;
                        try {
                            dxf = parser.parseSync(fileText);
                        } catch (err) {
                            return console.error(err.stack);
                        }
                    
                        var wkt = GeoJSON.parse(dxf)
                        var center =  new google.maps.LatLng(GeoJSON.header.$LATITUDE, GeoJSON.header.$LONGITUDE);
                        window.dcel.extractLines();
                        var faces = dcel.internalFaces();
                        wkt = consoleWKT(faces);
                        
                        self.polygon =  self.polygon.concat(self.addWKT(wkt));
                        mapView.map.setCenter(center);
                        mapView.map.setZoom(17);
                        mapView.map.data.setStyle({
                            strokeColor: "#000000",
                            strokeOpacity: 0.8,
                            strokeWeight: 1,
                        });
                        console.timeEnd("dcel cost");
                        loadding.disable();
                    }
                }   
            }
        },
        props:{
            id:"file-field",
            type:"file"
        }
    })
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [
            {
                class: 'absol-single-page-header',
                style:{
                    paddingRight:0
                },
                child: [
                    {
                        tag: "span",
                        class: "pizo-body-title-left",
                        props: {
                            innerHTML: "Thông tin quy hoạch"
                        }
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-button",
                        child: [
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-quit","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                    }
                                },
                                child: [
                                '<span>' + "Đóng" + '</span>'
                                ]
                            },
                            hiddenInput,
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.saveCurrentDataMap();
                                    }
                                },
                                child: [
                                '<span>' + "Lưu" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        hiddenInput.click()
                                    }
                                },
                                child: [
                                '<span>' + "Thêm" + '</span>'
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-list-realty-page-allinput",
                        style:{                        
                            width: "calc(100% - 190px)"
                        },
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-container",
                                style:{
                                    width:"100%"
                                },
                                child:[
                                    allinput,
                                    {
                                        tag:"button",
                                        class:"pizo-list-realty-page-allinput-search",
                                        child:[
                                            {
                                                tag: 'i',
                                                class: 'material-icons',
                                                props: {
                                                    innerHTML: 'search'
                                                },
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    }
                ]
            },
        ]
    });


    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-plan-main"],
            child:[
                this.searchControl,
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control"],
                    child:[
                        mapView
                    ]
                }
            ]   
        })
        );
    this.mapView = mapView;
    this.mapView.map.enableKeyDragZoom(this.selectPolygonFunction.bind(this));
    this.mapView.map.setTilt(45);
    var polyOptions = {
        strokeColor: "#eb4034",
        fillColor:"#c18986",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        editable: true,
        draggable: true
      };
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions: {
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
          ]
        },
        markerOptions: {
          draggable: true
        },
        polylineOptions: {
        },
        draggableCursor:'crosshair',
        rectangleOptions: polyOptions,
        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        map: this.mapView.map
    });
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
        self.removeAllSelect();
        var polygon = e.overlay;
        self.polygon.push(polygon);
        self.addEventPolygon(polygon);
        if(self.editPolygon !== undefined)
        {
            self.editPolygon.toInActive(self);
        }
        polygon.toActive(self);
        polygon.setOptions({editable:true,draggable:true});
        self.editPolygon = polygon;
       
    })
    this.mapView.map.setOptions({ maxZoom: 30 });
    this.drawingManager = drawingManager;
    this.polygon = [];
    this.selectPolygon = [];
    window.addEventListener("keydown",function(e){
        if(e.keyCode==46)
        {
            if(self.editPolygon!==undefined)
            {
                self.editPolygon.setMap(null);
                var index = self.polygon.indexOf(self.editPolygon);
                self.polygon.splice(index,1);
            }
            for(var i = 0;i<self.selectPolygon.length;i++)
            {
                self.selectPolygon[i].setMap(null);
                google.maps.event.clearListeners(self.selectPolygon[i], 'click');
                var index = self.polygon.indexOf(self.selectPolygon[i]);
                self.polygon.splice(index,1);
            }
            if(self.allPolygon!==undefined)
            {
                self.allPolygon.setMap(null);
                self.allPolygon = undefined;
            }
            self.selectPolygon = [];
        }else if(e.keyCode == 27)
        {
            self.removeAllSelect();
            if(self.editPolygon!==undefined)
            {
                self.editPolygon.toInActive(self);
            }
        }

    })
    this.allinput = allinput;
    var searchBox = new google.maps.places.SearchBox(allinput,{
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    });
    google.maps.event.addListener(this.mapView.map, 'bounds_changed', function() {
        var bounds = self.mapView.map.getBounds();
        searchBox.setBounds(bounds);
    });
    this.searchBox = searchBox;
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
    
        // For each place, get the icon, place name, and location.
        var bounds = new google.maps.LatLngBounds();
        var place = null;
        for (var i = 0; place = places[i]; i++) {
          bounds.extend(place.geometry.location);
        }
        self.mapView.map.setCenter(bounds.getCenter());
      });
    moduleDatabase.getModule("geometry",["loadMap.php","addMap.php","updateMap.php","deleteMap.php"]);
    moduleDatabase.getModule("geometry_created",["loadCreatedMap.php"]).load().then(function(value){
        self.filterTime.updateItem(value);
    })
    return this.$view;
}

PlanningInformation.prototype.removeAllSelect = function()
{
    var self =this;
    if(self.allPolygon!==undefined)
    {
        for(var i = 0;i<self.selectPolygon.length;i++)
        {
            self.selectPolygon[i].setMap(self.mapView.map);
            if(self.allPolygon!==undefined&&self.allPolygon.deltaDrag!==undefined&&(self.allPolygon.deltaDrag.lat!==0||self.allPolygon.deltaDrag.lng!==0))
            {
                var center = self.selectPolygon[i].getBounds().getCenter().toJSON();
                center.lat += self.allPolygon.deltaDrag.lat;
                center.lng += self.allPolygon.deltaDrag.lng;
                self.selectPolygon[i].moveTo(new google.maps.LatLng(center.lat, center.lng)); 
            }
        }
    
        self.allPolygon.setMap(null);
        self.allPolygon = undefined;
        self.selectPolygon = [];
    }
}

PlanningInformation.prototype.createHash = function(arr)
{
    var data = [];
    for(var i = 0;i<arr.length;i++)
    {
        this.createHashRow(arr[i],data);
    }
    return arr;
}

PlanningInformation.prototype.createHashRow = function(data,hash)
{
    var intLat,intLng,cellLat,cellLng,created;
    var center = data.getBounds().getCenter().toJSON();
        intLng = parseInt(center.lng/1);
        cellLng = Math.ceil(center.lng%1/0.0009009009009009009)-1;
        intLat = parseInt(center.lat/1);
        cellLat = Math.ceil(center.lat%1/0.0009009009009009009)-1;
        cellLng = intLng*10000+cellLng;
        cellLat = intLat*10000+cellLat;
        if(data.created!==undefined)
        {
            created = data.created;
            if(hash[created]===undefined)
            hash[created] = [];
            if(hash[created][cellLat] == undefined)
            hash[created][cellLat] = [];
            if(hash[created][cellLat][cellLng] == undefined)
            hash[created][cellLat][cellLng] = [];
            hash[created][cellLat][cellLng].push(data.ToWKT());
        }else
        {
            if(hash[cellLat] == undefined)
            hash[cellLat] = [];
            if(hash[cellLat][cellLng] == undefined)
            hash[cellLat][cellLng] = [];
            hash[cellLat][cellLng].push(data.ToWKT());
        }
    
}

PlanningInformation.prototype.saveCurrentDataMap = function()
{
    var data = [];
   console.log(this.hash)
    data = this.createHash(this.polygon);
    var gmt = getGMT();
    for(var param in data)
    {
        if(isNaN(param/1))
        {
            
        }
        else
        {
            for(var child in data[param])
            {
                var arr = data[param][child];
                var wkt = new Wkt.Wkt();
                for(var i = 0;i<arr.length;i++)
                {
                    if(i===0)
                    wkt.read(arr[i]);
                    else
                    wkt.merge(new Wkt.Wkt(arr[i]));
                }
                
                moduleDatabase.getModule("geometry").add({
                    cellLat:param,
                    cellLng:child,
                    created:gmt,
                    map:wkt.toString()
                }).then(function(value){

                });

            }
            var x = data[param];
            delete data[param];
            if(data[gmt]===undefined)
            data[gmt] = [];
            data[gmt][param] = x;
        }
        
    }

}

PlanningInformation.prototype.addEventPolygon = function(polygon)
{
    var self = this;
    google.maps.event.addListener(polygon, 'click', function (event) {
        if(self.editPolygon===this)
        {
            this.toInActive(self);
        }else
        {
            if(self.editPolygon !== undefined)
            {
                self.editPolygon.toInActive(self);
                this.toActive(self);
                this.setOptions({editable:true,draggable:true});
            }else
            {
                if(self.allPolygon!==undefined)
                {
                    if(self.selectPolygon.indexOf(this) ===-1)
                    {
                        self.allPolygon.setMap(null);
                        var path =[];
                        var tempPath;
                        for(var i=0;i<self.selectPolygon.length;i++)
                        {
                            if(self.allPolygon!==undefined&&self.allPolygon.deltaDrag!==undefined&&(self.allPolygon.deltaDrag.lat!==0||self.allPolygon.deltaDrag.lng!==0))
                            {
                                var center = self.selectPolygon[i].getBounds().getCenter().toJSON();
                                center.lat += self.allPolygon.deltaDrag.lat;
                                center.lng += self.allPolygon.deltaDrag.lng;
                                self.selectPolygon[i].moveTo(new google.maps.LatLng(center.lat, center.lng)); 
                            }
                            tempPath = [];
                            for(var j = 0;j<self.selectPolygon[i].getPath().getLength();j++)
                            {
                                tempPath.push(self.selectPolygon[i].getPath().getAt(j).toJSON())
                            }
                            self.selectPolygon[i].setMap(null);
                            path.push(tempPath)     
                        }
                        tempPath = [];
                        for(var j = 0;j<this.getPath().getLength();j++)
                        {
                            tempPath.push(this.getPath().getAt(j).toJSON())
                        }
                        path.push(tempPath) 
                        this.setMap(null);
                        self.selectPolygon.push(this);

                        self.createAllPolygon(path);
                        
                    }
                }else
                {
                    this.toActive(self);
                    this.setOptions({editable:true,draggable:true});
                }
               
            }
        }
      });
}

PlanningInformation.prototype.selectPolygonFunction = function(bns){
    this.removeAllSelect();
    if(this.editPolygon!==undefined)
    this.editPolygon.toInActive(this);
    var path = [];
    var tempPath;
    for(var i=0;i<this.polygon.length;i++)
    {
        tempPath = [];
        var boundary = this.polygon[i].boundary();
        if(bns.Ya.i<boundary.min.lat&&boundary.max.lat<bns.Ya.j
            &&bns.Ua.i<boundary.min.lng&&boundary.max.lng<bns.Ua.j)
        {
            for(var j = 0;j<this.polygon[i].getPath().getLength();j++)
            {
                tempPath.push(this.polygon[i].getPath().getAt(j).toJSON())
            }
            this.polygon[i].setMap(null);
            this.selectPolygon.push(this.polygon[i]);
        } 
        path.push(tempPath)     
    }
   this.createAllPolygon(path)
}

PlanningInformation.prototype.createAllPolygon = function(path)
{
    var polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: "#eb4034",
        fillColor:"#c18986",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        draggable:true,
        geodesic: true
    })
    google.maps.event.addListener(polygon, 'dragstart', function(e) {
        if(this.dragStart == undefined)
        this.dragStart = polygon.getBounds().getCenter().toJSON();
    });
    google.maps.event.addListener(polygon, 'dragend', function(e) {
        var center = polygon.getBounds().getCenter().toJSON();
        this.deltaDrag = {lat:center.lat-this.dragStart.lat,lng:center.lng-this.dragStart.lng}
    });
    polygon.setMap(this.mapView.map);
    this.allPolygon = polygon;
    return polygon;
}

PlanningInformation.prototype.searchControlContent = function(){
    var self =this;
    var filterTime = _({
        tag:"selectbox",
        props:{
            enableSearch:true
        },
        on:{
            add:function(event)
            {
                moduleDatabase.getModule("geometry").load({WHERE:"created='"+event.value+"'"}).then(function(value){
                    for(var i = 0;i<value.length;i++)
                    {
                        self.polygon = self.polygon.concat(self.addWKT(value[i])); 
                    }
                    var center = value[value.length-1];
                    self.mapView.map.setCenter(new google.maps.LatLng(parseInt(center.cellLat/10000)+(center.cellLat%10000-1)*0.0009009009009009009,parseInt(center.cellLng/10000)+(center.cellLng%10000-1)*0.0009009009009009009));
                    self.mapView.map.setZoom(17);
                })
            },
            remove:function(event)
            {
                self.removeAllSelect();
                for(var i = self.polygon.length-1;i>=0;i--)
                {
                    if(self.polygon[i].created === event.value)
                    {
                        self.polygon[i].setMap(null);
                        self.polygon.splice(i,1);
                    }
                }
            }
        }
    });

    filterTime.updateItem = function(value){
        var list = [];
        for(var i = 0;i<value.length;i++)
        {
            list.push({text:formatDate(value[i].created,true,true,true,true,true,true),value:value[i].created});
        }
        this.items = list;
    }

    var content = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control-container",
        on:{
            click:function(event)
            {
                event.stopPropagation();
            }
        },
        child:[
            {
                tag:"div",
                class:"pizo-list-realty-main-search-control-container-scroller",
                child:[
                    {
                        tag:"div",
                        class:"pizo-list-plan-main-search-control-row",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-plan-main-search-control-row-selectbox-plan",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-plan-main-search-control-row-selectbox-plan-label",
                                        props:{
                                            innerHTML:"Lần commit"
                                        }
                                    }
                                ]
                                
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-selectbox-plan-input",
                                child:[
                                    filterTime
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    var temp = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control",
        on:{
            click:function(event)
            {
                this.hide();
            }
        },
        child:[
            content
        ]
    })

    this.filterTime = filterTime;


    temp.show = function()
    {
        if(!temp.classList.contains("showTranslate"))
        temp.classList.add("showTranslate");
    }
    temp.hide = function()
    {
        if(!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function(){
            if(temp.classList.contains("showTranslate"))
            temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd",eventEnd);
            content.removeEventListener("transitionend",eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function()
    {

    }
    temp.reset = function()
    {
        content.lowprice.value = "";
        content.highprice.value = "";
        content.phone.value = "";
        content.MS.value = "";
        content.SN.value = "";
        content.TD.value = "";
        content.PX.value = "";
        content.QH.value = "";
        content.TT.value = "";
        content.HT.value = 0;
    }

  
    return temp;
}

PlanningInformation.prototype.addWKT = function(multipolygonWKT) {
    if(this.hash === undefined)
    this.hash = [];
    var created;
    if(typeof multipolygonWKT == "object")
    {
        created = multipolygonWKT["created"];
        multipolygonWKT = multipolygonWKT["AsText(`map`)"];
    }
    var wkt = new Wkt.Wkt();
    wkt.read(multipolygonWKT);
    var toReturn = [];
    var components = wkt.components;
    for(var k=0;k<components.length;k++){
        var line = components[k];
        var polygon = new google.maps.Polygon({
            paths: line,
            strokeColor: "#000000",
            fillColor:"#adaeaf",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            map:this.mapView.map,
            geodesic: true
        })
        this.addEventPolygon(polygon);
        if(created!==undefined)
        polygon.created = created;
        toReturn.push(polygon);
        this.createHashRow(polygon,this.hash);
    }
        
    return toReturn;  
}

PlanningInformation.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

PlanningInformation.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

PlanningInformation.prototype.flushDataToView = function () {
    if (this.dataFlushed) return;
    this.dataFlushed = true;
    //TODO: remove older view
    if (!this.data) return;
    this.$content.clearChild();
    if (this.data && this.$view) {
        this.rootComponent = this.build(this.data);
        this.$content.addChild(this.rootComponent.view);
        this.rootComponent.onAttach();
        this.$widthIp.value = this.rootComponent.getStyle('width', 'px');
        this.$heightIp.value = this.rootComponent.getStyle('height', 'px');
    }
};

PlanningInformation.prototype.start = function () {

}

export default PlanningInformation;