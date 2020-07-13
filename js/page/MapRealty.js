import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/MapRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate } from '../component/FormatFunction';

import { MapView } from "../component/MapView";
import moduleDatabase from '../component/ModuleDatabase';



var _ = Fcore._;
var $ = Fcore.$;

function MapRealty() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.hash = [];
}

MapRealty.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(MapRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
MapRealty.prototype.constructor = MapRealty;

MapRealty.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
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
                            innerHTML: "Nhà đất"
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

    this.allinput = allinput;
    var searchBox = new google.maps.places.SearchBox(allinput,{
        // terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    });

    this.searchBox = searchBox;

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
    
        // For each place, get the icon, place name, and location.
        self.mapView.map.setZoom(20);
        var bounds = new google.maps.LatLngBounds();
        var place = null;
        for (var i = 0; place = places[i]; i++) {
          bounds.extend(place.geometry.location);
        }
        self.mapView.map.setCenter(bounds.getCenter());
      });
    this.mapView = mapView;
    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-plan-main"],
            style:{
                flexDirection: "column"
            },
            child:[
                this.searchControl,
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control"],
                    child:[
                        {
                            tag:"div",
                            class:"pizo-list-realty-main-result-control-map-view",
                            child:[
                                mapView,
                                self.modalRealty(), 
                            ]
                        }
                    ]
                }
            ]   
        })
        );

    return this.$view;
}

MapRealty.prototype.modalRealty = function(){
    var self = this;
    var container = _({
        tag:"ul",
        class:["photo-cards", "photo-cards_wow", "photo-cards_short"],
        child:[
        ]
    })
    var temp=_({
        tag:"div",
        class:["search-page-list-container", "double-column-only" ,"short-list-cards"],
        child:[
            {
                tag:"div",
                class:"result-list-container",
                child:[
                    {
                        tag:"div",
                        class:"search-page-list-header",
                        child:[
                            {
                                tag:"h1",
                                class:"search-title",
                                props:{
                                    innerHTML:"Bất động sản rao bán"
                                }
                            },
                            {
                                tag:"div",
                                class:"search-subtitle",
                                child:[
                                    {
                                        tag:"span",
                                        class:"result-count"
                                    },
                                    {
                                        tag:"div",
                                        class:["sort-options", "visible"],
                                        child:[
                                            {
                                                tag:"strong",
                                                innerHTML:"Sắp xếp theo"
                                            },
                                            {
                                                tag:"selectmenu",
                                                props:{
                                                    items:[
                                                        {text:"Mới nhất",value:0},
                                                        {text:"Giá (Thấp tới cao)",value:1},
                                                        {text:"Giá (Cao tới thấp)",value:2},
                                                        {text:"Diện tích",value:3}
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    container
                ]
            },
            {
                tag:"div",
                class:["zsg-subfooter", "region-info-footer"]
            }
        ]
    })
    this.updateResult = function()
    {
        container.clearChild();
        var cellLat,cellLng,arrTemp;
        for(var i = 0;i<this.mapView.currentHouse.length;i++)
        {
            cellLat = this.mapView.currentHouse[i][0];
            cellLng = this.mapView.currentHouse[i][1];
            arrTemp = this.mapView.checkHouse[cellLat][cellLng];
            for(var j = 0;j<arrTemp.length;j++)
            {
                container.appendChild(this.itemMap(arrTemp[j]));
            }
        }
    }
    this.mapView.addEventListener("change-house", function() {
        self.updateResult();
    })
    return temp;
}

MapRealty.prototype.itemMap = function(marker){
    var data = marker.data;
    var src = "https://photos.zillowstatic.com/p_e/ISrh2fnbc4956m0000000000.jpg";
    if(data.imageCurrentStaus.length>0)
    src = "https://lab.daithangminh.vn/home_co/pizo/assets/upload/"+data.imageCurrentStaus[0].src;
    var thumnail = _({
        tag:"img",
        props:{
            src:src
        }
    });
    var type;
    var diffTime = Math.abs(new Date() - new Date(data.created));
    var date = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    switch(parseInt(data.type))
    {
        case 0:
            type = "Chưa xác định";
            break;
        case 1:
            type = "Hẻm";
            break;
        case 2:
            type = "Mặt tiền";
            break;
        case 3:
            type = "Chung cư";
            break;
    }
    var temp = _({
        tag:"li",
        on:{
            mousehover:function(event)
            {
                google.maps.event.trigger(marker,"onmouseover");
            },
            mouseout:function(event)
            {
                google.maps.event.trigger(marker,"onmouseout");
            }
        },
        child:[
            {
                tag:"scrpit",
                props:{
                    type:"application/ld+json",
                    // innerHTML:"" Thêm scrpit cần để làm từ khóa cho google search
                }
            },
            {
                tag:"article",
                class:["list-card", "list-card-short", "list-card_not-saved"],
                child:[
                    {
                        tag:"div",
                        class:"list-card-info",
                        child:[
                            {
                                tag:"a",
                                class:"list-card-link",
                                props:{
                                    src:"Link nhà"
                                },
                                child:[
                                    {
                                        tag:"address",
                                        class:"list-card-addr",
                                        props:{
                                            innerHTML:"277 Trần Quang Khải"
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"list-card-footer",
                                child:[
                                    {
                                        tag:"div",
                                        class:"list-card-type",
                                        child:[
                                            {
                                                tag:"i",
                                                class:["material-icons", "list-card-type-icon", "zsg-icon-for-sale"],
                                                props:{
                                                    innerHTML:"brightness_1"
                                                }
                                            },
                                            {
                                                tag:"span",
                                                props:{
                                                    innerHTML:type
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"list-card-heading",
                                child:[
                                    {
                                        tag:"div",
                                        class:"list-card-price",
                                        props:{
                                            innerHTML:"VND "+data.price+" tỉ"
                                        }
                                    },
                                    {
                                        tag:"ul",
                                        class:"list-card-details",
                                        child:[
                                            {
                                                tag:"li",
                                                child:[
                                                    {
                                                        tag:"span",
                                                        props:{
                                                            innerHTML:data.width
                                                        }
                                                    },
                                                    {
                                                        tag:"abbr",
                                                        class:"list-card-label",
                                                        props:{
                                                            innerHTML:"m"
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                tag:"li",
                                                child:[
                                                    {
                                                        tag:"span",
                                                        props:{
                                                            innerHTML:data.height
                                                        }
                                                    },
                                                    {
                                                        tag:"abbr",
                                                        class:"list-card-label",
                                                        props:{
                                                            innerHTML:"m"
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                tag:"li",
                                                child:[
                                                    {
                                                        tag:"span",
                                                        props:{
                                                            innerHTML:data.acreage
                                                        }
                                                    },
                                                    {
                                                        tag:"abbr",
                                                        class:"list-card-label",
                                                        props:{
                                                            innerHTML:"m²"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"list-card-top",
                        child:[
                            {
                                tag:"div",
                                class:["list-card-variable-text", "list-card-img-overlay"],
                                props:{
                                    innerHTML:date+" ngày trước"
                                }
                            },
                            {
                                tag:"div",
                                class:["list-card-brokerage", "list-card-img-overlay"],
                                child:[
                                    {
                                        tag:"div",
                                        class:"list-card-truncate",
                                        props:{
                                            innerHTML:data.content
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"a",
                                class:["list-card-link", "list-card-img"],
                                props:{
                                    src:"Link nhà"
                                },
                                child:[
                                    thumnail
                                ]
                            }
                        ]
                    },
                    {
                        tag:"button",
                        class:"list-card-save",
                        child:[
                            {
                                tag:"i",
                                class:["favorite_border","material-icons"],
                                props:{
                                    innerHTML:"favorite_border"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

MapRealty.prototype.searchControlContent = function(){
    var startDay, endDay;

    startDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: new Date(new Date().getFullYear(), 0, 1),
            maxDateLimit: new Date()
        },
        on: {
            changed: function (date) {

                endDay.minDateLimit = date;
            }
        }
    })

    endDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: new Date(),
            minDateLimit: new Date()
        },
        on: {
            changed: function (date) {

                startDay.maxDateLimit = date;
            }
        }
    })
    var content = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control-container",
        on: {
            click: function (event) {
                event.stopPropagation();
            }
        },
        child: [{
            tag: "div",
            class: "pizo-list-realty-main-search-control-container-scroller",
            child: [{
                    tag: "div",
                    class: "pizo-list-realty-main-search-control-row",
                    child: [{
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-date",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-date-label",
                                    props: {
                                        innerHTML: "Thời gian"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-date-input",
                                    child: [
                                        startDay,
                                        endDay
                                    ]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-price",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-price-label",
                                    props: {
                                        innerHTML: "Khoảng giá"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-price-input",
                                    child: [{
                                            tag: "input",
                                            class: "pizo-list-realty-main-search-control-row-price-input-low",
                                            props: {
                                                type: "number",
                                                autocomplete: "off",
                                                placeholder: "đ Từ",
                                            }
                                        },
                                        {
                                            tag: "input",
                                            class: "pizo-list-realty-main-search-control-row-price-input-high",
                                            props: {
                                                type: "number",
                                                autocomplete: "off",
                                                placeholder: "đ Đến",
                                            }
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-phone",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-phone-label",
                                    props: {
                                        innerHTML: "Số điện thoại"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-phone-input",
                                    child: [{
                                        tag: "input",
                                        props: {
                                            type: "number",
                                            autocomplete: "off"
                                        }
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-button",
                            child: [{
                                tag: "button",
                                class: ["pizo-list-realty-button-apply", "pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                    }
                                },
                                child: [
                                    '<span>' + "Áp dụng" + '</span>'
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-button",
                            child: [{
                                tag: "button",
                                class: ["pizo-list-realty-button-deleteall", "pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        temp.reset();
                                    }
                                },
                                child: [
                                    '<span>' + "Thiết lập lại" + '</span>'
                                ]
                            }]
                        },
                    ]
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-main-search-control-row",
                    child: [{
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-MS",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-MS-label",
                                    props: {
                                        innerHTML: "Mã số"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-MS-input",
                                    child: [{
                                        tag: "input",
                                        props: {
                                            type: "number",
                                            autocomplete: "off"
                                        }
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-SN",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-SN-label",
                                    props: {
                                        innerHTML: "Số nhà"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-SN-input",
                                    child: [{
                                        tag: "input",
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-TD",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-TD-label",
                                    props: {
                                        innerHTML: "Tên đường"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-TD-input",
                                    child: [{
                                        tag: "input",
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-PX",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-PX-label",
                                    props: {
                                        innerHTML: "Phường/Xã"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-PX-input",
                                    child: [{
                                        tag: "input",
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-QH",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-QH-label",
                                    props: {
                                        innerHTML: "Quận huyện"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-QH-input",
                                    child: [{
                                        tag: "input",
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-TT",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-TT-label",
                                    props: {
                                        innerHTML: "Tỉnh/TP"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-TT-input",
                                    child: [{
                                        tag: "input"
                                    }]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-HT",
                            child: [{
                                    tag: "span",
                                    class: "pizo-list-realty-main-search-control-row-HT-label",
                                    props: {
                                        innerHTML: "Tình trạng"
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-HT-input",
                                    child: [{
                                        tag: "selectmenu",
                                        props: {
                                            items: [{
                                                    text: "Tất cả",
                                                    value: 0
                                                },
                                                {
                                                    text: "Còn bán",
                                                    value: 1
                                                },
                                                {
                                                    text: "Đã bán",
                                                    value: 2
                                                },
                                                {
                                                    text: "Ngưng bán",
                                                    value: 3
                                                },
                                            ]
                                        }
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]
        }]
    });
    var temp = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control",
        style:{
            display:"none"
        },
        on: {
            click: function (event) {
                this.hide();
            }
        },
        child: [
            content
        ]
    })

    temp.content = content;
    content.timestart = startDay;
    content.timeend = endDay;
    content.lowprice = $('input.pizo-list-realty-main-search-control-row-price-input-low', content);
    content.highprice = $('input.pizo-list-realty-main-search-control-row-price-input-high', content);
    content.phone = $('.pizo-list-realty-main-search-control-row-phone-input input', content);
    content.MS = $('.pizo-list-realty-main-search-control-row-MS-input input', content);
    content.SN = $('.pizo-list-realty-main-search-control-row-SN input', content);
    content.TD = $('.pizo-list-realty-main-search-control-row-TD input', content);
    content.PX = $('.pizo-list-realty-main-search-control-row-PX input', content);
    content.QH = $('.pizo-list-realty-main-search-control-row-QH input', content);
    content.HT = $('.pizo-list-realty-main-search-control-row-HT input', content);

    temp.show = function () {
        if (!temp.classList.contains("showTranslate"))
            temp.classList.add("showTranslate");
    }
    temp.hide = function () {
        if (!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function () {
            if (temp.classList.contains("showTranslate"))
                temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd", eventEnd);
            content.removeEventListener("transitionend", eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function () {

    }
    temp.reset = function () {
        content.timestart = new Date();
        content.timeend = new Date();
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
MapRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

MapRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

MapRealty.prototype.flushDataToView = function () {
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

MapRealty.prototype.start = function () {

}

export default MapRealty;