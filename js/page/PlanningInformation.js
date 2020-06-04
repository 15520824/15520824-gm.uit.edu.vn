import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/PlanningInformation.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate,checkRule,consoleArea,loaddingWheel } from '../component/FormatFunction';

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
                    
                        var geojson = GeoJSON.parse(dxf)
                        var center =  new google.maps.LatLng(GeoJSON.header.$LATITUDE, GeoJSON.header.$LONGITUDE);
                        window.dcel.extractLines();
                        var faces = dcel.internalFaces();
                        console.log(faces)
                        geojson = consoleArea(faces);
                        console.log(geojson)
                        // moduleDatabase.getModule("geometry").add({map:JSON.stringify(geojson)}).then(function(value){
                        //     console.log(value)
                        // });
                        mapView.map.data.addGeoJson(geojson, {});
                        mapView.map.setCenter(center);
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
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-container",
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
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-filter",
                                on:{
                                    click:function(event)
                                    {
                                        self.searchControl.show();
                                    }
                                },
                                child:[
                                    {
                                        tag: 'filter-ico',
                                    },
                                    {
                                        tag:"span",
                                        class:"navbar-search__filter-text",
                                        props:{
                                            innerHTML:"Lọc"
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-page-number-line",
                        child: [
                            input,
                            {
                                tag: "span",
                                class:
                                    "freebirdFormeditorViewAssessmentWidgetsPointsLabel",
                                props: {
                                    innerHTML: "Số dòng"
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    });


    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
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
    this.mapView.map.enableKeyDragZoom(this.selectPolygon.bind(this));
    this.polygon = [];
    this.selectPolygon = [];
    window.addEventListener("keydown",function(e){
        if(e.keyCode==46)
        {
            for(var i = 0;i<self.selectPolygon.length;i++)
            {
                self.selectPolygon[i].setMap(null);
                var index = self.polygon.indexOf(self.selectPolygon[i]);
                self.polygon.splice(index,1);
            }
            self.selectPolygon = [];
        }else if(e.keyCode == 27)
        {
            for(var i = 0;i<self.selectPolygon.length;i++)
            {
                self.selectPolygon[i].setOptions({strokeColor:"#000000",fillColor:"#adaeaf"});
            }
            self.selectPolygon = [];
        }

    })
    
    moduleDatabase.getModule("geometry",["loadMap.php","addMap.php","updateMap.php","deleteMap.php"]).load().then(function(value){
        for(var i = 0;i<value.length;i++){
            self.polygon =  self.polygon.concat(self.addWKT(value[i]["AsText(`map`)"]));
        }
    })
    return this.$view;
}

PlanningInformation.prototype.selectPolygon = function(bns){
    for(var i=0;i<this.polygon.length;i++)
    {
        if(bns.Ya.i<this.polygon[i].boundary.min.lat&&this.polygon[i].boundary.max.lat<bns.Ya.j
            &&bns.Ua.i<this.polygon[i].boundary.min.lng&&this.polygon[i].boundary.max.lng<bns.Ua.j)
        {
            this.polygon[i].setOptions({strokeColor:"#eb4034",fillColor:"#c18986"});
            this.selectPolygon.push(this.polygon[i]);
        }
            
    }
}

PlanningInformation.prototype.searchControlContent = function(){
    var filterDistrict = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control-row-district-street-input",
        child:[
            {
                tag:"selectmenu",
                props:{
                    enableSearch:true,
                    items: [{text:"Tất cả", value: 0}]
                }
            }
        ]
    })

    var filterState = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control-row-state-street-input",
        child:[
            {
                tag:"selectmenu",
                props:{
                    enableSearch:true,
                    items: [{text:"Tất cả", value: 0}]
                }
            }
        ]
    })

    var filterWard = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control-row-ward-street-input",
        child:[
            {
                tag:"selectmenu",
                props:{
                    enableSearch:true,
                    items:[{text:"Tất cả", value: 0}]
                }
            }
        ]
    });

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
                        class:"pizo-list-realty-main-search-control-row",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-state-street",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-state-street-label",
                                        props:{
                                            innerHTML:"Tỉnh/TP"
                                        }
                                    },
                                    filterState
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-district-street",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-district-street-label",
                                        props:{
                                            innerHTML:"Quận/Huyện"
                                        }
                                    },
                                    filterDistrict
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-ward-street",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-ward-street-label",
                                        props:{
                                            innerHTML:"Phường/Xã"
                                        }
                                    },
                                    filterWard
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-button",
                                child:[
                                    {
                                        tag: "button",
                                        class: ["pizo-list-realty-button-deleteall","pizo-list-realty-button-element"],
                                        on: {
                                            click: function (evt) {
                                                temp.reset();
                                            }
                                        },
                                        child: [
                                        '<span>' + "Thiết lập lại" + '</span>'
                                        ]
                                    }
                                ]
                            },
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
    var self = this;
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
                })
            polygon.setMap(this.mapView.map);
            google.maps.event.addListener(polygon, 'click', function (event) {
                var index = self.selectPolygon.indexOf(this);
                if(index!==-1)
                {
                    self.selectPolygon.splice(index,1);
                    this.setOptions({strokeColor:"#000000",fillColor:"#adaeaf"});

                }else
                {
                    self.selectPolygon.push(this);
                    this.setOptions({strokeColor:"#eb4034",fillColor:"#c18986"});
                }
              });
            var max = {lat:-90,lng:-200},min = {lat:90,lng:200};
            line = line[0];
            for(var i = 0;i<line.length;i++)
            {
                if(max.lat<line[i].lat)
                    max.lat=line[i].lat;
                if(min.lat>line[i].lat)
                    min.lat=line[i].lat;
                if(max.lng<line[i].lng)
                    max.lng=line[i].lng;
                if(min.lng>line[i].lng)
                    min.lng=line[i].lng;
               
            }
            var boundary = {max:max,min:min}
            polygon.boundary = boundary;
            toReturn.push(polygon);
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