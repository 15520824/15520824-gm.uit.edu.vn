import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/EditHelpContainer.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import { tableView } from './ModuleView';
import NewCategory from './NewCategory';

var _ = Fcore._;
var $ = Fcore.$;

function EditHelpContainer(phpLoader) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    var self = this;
    if (this.$view) return this.$view;

    var tabContainer = _({
        tag: "tabframe",
        class:"header-display-visiable",
        attr: {
            name: "Menu",
            id: "matd",
            desc: ""
        },
        child: [
        ]
    })
    
    this.$view = _({
        tag: "table",
        class: "b-workZone__layout"
    })
    Object.assign(this.$view,EditHelpContainer.prototype);

    console.log(this.$view.itemEdit)
    this.$view.editor = this.$view.itemEdit();

    this.$view.addChild(_({
        tag: "tbody",
        child: [
            {
                tag: "tr",
                child: [
                    {
                        tag: "td",
                        class: ["b-workZone__side", "m-workZone__side__nav"],
                        child: [
                            {
                                tag: "div",
                                class: ["b-workZone__content", "m-workZone__content__nav"],
                                props: {
                                    id: "workZone_nav",
                                },
                                child: [
                                    {
                                        tag: "tabview",
                                        class: "absol-tab-frame-small",
                                        props: {
                                            value: 0
                                        },
                                        style: {
                                            width: "fit-content"
                                        },
                                        child: [
                                            tabContainer,
                                            {
                                                tag: "tabframe",
                                                attr: {
                                                    name: "Search",
                                                    id: "matd3",
                                                    desc: ""
                                                },
                                                child: [
                                                    {
                                                        tag: "span",
                                                        props: {
                                                            innerHTML: "3"
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
                        tag: "td",
                        class: ["b-workZone__side", "m-workZone__side__article"],
                        props: {
                            id: "workZone_article"
                        },
                        child: [
                            {
                                tag: "div",
                                class: "b-workZone__content",
                                props: {
                                    id: "workZone_article__content"
                                },
                                child: [
                                    {
                                        tag: "div",
                                        class: "b-article",
                                        child: [
                                            {
                                                tag: "div",
                                                class: "b-article__headerLayout",
                                                props: {
                                                    id: "article__header"
                                                },
                                                child: [
                                                    {
                                                        tag: "div",
                                                        class: ["b-article__headerSide", "m-article__headerSide__nav"],
                                                        props: {
                                                            id: "headerSide__nav"
                                                        },
                                                        child: [
                                                            {
                                                                tag: "ul",
                                                                class: "b-breadCrumbs__items",
                                                                child: [
                                                                    {
                                                                        tag: "li",
                                                                        class: "b-breadCrumbs__item",
                                                                        props: {
                                                                            innerHTML: "Introduction"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        tag: "div",
                                                        class: ["b-article__headerSide", "m-article__headerSide__buttons"],
                                                        props: {
                                                            id: "headerSide__buttons"
                                                        },
                                                        child: [
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                tag: "div",
                                                class: ["b-article__wrapper", "os-host", "os-theme-dark", "os-host-resize-disabled", "os-host-scrollbar-horizontal-hidden", "os-host-overflow", "os-host-overflow-y", "os-host-transition"],
                                                child: [
                                                    self.$view.editor
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }))
    
    var scrollLeftContainer = $('div.b-workZone__content.m-workZone__content__nav#workZone_nav div.absol-tabview.absol-tab-frame-small',this.$view);
    console.log(scrollLeftContainer)
    for(var i = 0;i<scrollLeftContainer.childNodes.length;i++)
    {
        scrollLeftContainer.childNodes[i].classList.add("absol-single-page-scroller")
    }
    this.loadData(phpLoader).then(function(value){
        var header = [{ type: "dragzone"}, {value:"Title",sort:true, functionClickAll: self.$view.functionClickDetail.bind(self.$view),style:{maxWidth:"300px"}}, { type: "detail",style:{maxWidth:"21px"}, functionClickAll: self.$view.functionClickMore.bind(self.$view), icon: "" }];
        self.mTable = new tableView(header, self.$view.formatDataRow(value), false, true, 1);
        tabContainer.addChild(self.mTable);
    });
    return this.$view;
                                        
}

Object.defineProperties(EditHelpContainer.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
EditHelpContainer.prototype.constructor = EditHelpContainer;

EditHelpContainer.prototype.functionClickMore = function (event, me, index, parent, data, row) {
    console.log(this)
    var self = this;
    
    var docTypeMemuProps = {
        items: [
            {
                text: 'Thêm',
                icon: 'span.material-icons.material-icons-add',
                value: 0,
            },
            {
                text: 'Sửa',
                icon: 'i.material-icons.material-icons-edit',
                value: 1,
            },
            {
                text: 'Xóa',
                icon: 'span.material-icons.material-icons-delete',
                value: 2,
            },
        ]
    };
    var token = absol.QuickMenu.show(me, docTypeMemuProps, [3, 4], function (menuItem) {
        switch (menuItem.value) {
            case 0:
                self.add(row.data.original.id,row)
                break;
            case 1:
                self.edit(data)
                break;
            case 2:
                self.delete(data)
                break;
        }
    });

    var functionX = function (token) {
        return function () {
            var x = function (event) {
                absol.QuickMenu.close(token);
                document.body.removeEventListener("click", x);
            }
            document.body.addEventListener("click", x)
        }
    }(token);

    setTimeout(functionX, 10)
}

EditHelpContainer.prototype.functionClickDetail = function(event, me, index, parent, data, row)
{
    var arr =  document.getElementsByClassName("choice-event-category");

    for(var i = 0 ;i<arr.length;i++)
    {
        arr[i].classList.remove("choice-event-category");
    }
    console.log(row)
    row.classList.add("choice-event-category");
    this.editor.setData(data.original.fulltext);
}


EditHelpContainer.prototype.formatDataRow = function(data)
{
    var self = this;
    self.data = data;
    var temp = [];
    var check = [];
    for(var i=0;i<data.length;i++)
    {
        var result = [{value:"",style:{maxWidth:"21px"}},{
            value:data[i].title,
            element:_({
                tag:"div",
                child:[
                    {
                        tag:"span",
                        class:"title-label",
                        props:{
                            innerHTML:data[i].title
                        }
                    },
                    {
                        tag:"span",
                        class:"alias-label",
                        props:{
                            innerHTML:" (Alias :"+data[i].alias+")"
                        }
                    }
                ]
            }),
            style:{maxWidth:"150px"}
        },{value:"",style:{maxWidth:"21px"}}];
        result.original = data[i];
        console.log(check[data[i].parent_id])
        if(check[data[i].parent_id]!==undefined)
        {
            if(check[data[i].parent_id].child === undefined)
            check[data[i].parent_id].child = [];
            check[data[i].parent_id].child.push(result)
        }
        else
        temp[i] = result;
        check[data[i].id] = result;
    }
    return temp;
}

EditHelpContainer.prototype.loadData = function(phpLoader)
{
    var php = "http://localhost/PIZO/php/load_content.php";
    if(phpLoader!==undefined)
    php = phpLoader;
    return new Promise(function(resolve,reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resolve(EncodingClass.string.toVariable(this.responseText.substr(2)));
        }
        };
        xhttp.open("GET", php, true);
        xhttp.send();
    })
}

EditHelpContainer.prototype.add = function(parentid,row)
{
    var self = this;
    var mNewCategory = new NewCategory(undefined,parentid);
    console.log(self.data)
    mNewCategory.attach(self.parent);
    var frameview = mNewCategory.getView(self.data);
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewCategory,row);
}

EditHelpContainer.prototype.addView = function(value,row){
        var result = [
            {value:"",style:{maxWidth:"21px"}},
            {
                value:value.title,
                element:_({
                    tag:"div",
                    child:[
                        {
                            tag:"span",
                            class:"title-label",
                            props:{
                                innerHTML:value.title
                            }
                        },
                        {
                            tag:"span",
                            class:"alias-label",
                            props:{
                                innerHTML:" (Alias :"+value.alias+")"
                            }
                        }
                    ]
                }),
                style:{maxWidth:"150px"}
            },
            {value:"",style:{maxWidth:"21px"}}
        ];
        result.original = value;

    row.insertRow(result);
}

EditHelpContainer.prototype.addDB = function(mNewCategory,row){
    var self = this;
    mNewCategory.promiseAddDB.then(function(value){
        self.addView(value,row);
        setTimeout(function(){
            if(mNewCategory.promiseAddDB!==undefined)
            self.addDB(mNewCategory);
        },100);
    })
}

EditHelpContainer.prototype.edit = function(data)
{
    var self = this;
    var mNewCategory = new NewCategory(data);
    mNewCategory.attach(self.parent);
    var frameview = mNewCategory.getView(self.data);
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewCategory);
}

EditHelpContainer.prototype.editView = function(mNewCategory){

}

EditHelpContainer.prototype.editDB = function(mNewCategory){
    var self = this;
    mNewCategory.promiseEditDB.then(function(value){
        if(mNewCategory.promiseEditDB!==undefined)
            self.editDB(mNewCategory);
    })
}


EditHelpContainer.prototype.delete = function(id)
{
    
}

EditHelpContainer.prototype.deleteView = function(mNewCategory){

}

EditHelpContainer.prototype.deleteDB = function(mNewCategory){
    var self = this;
    mNewCategory.promiseDeleteDB.then(function(value){
        if(mNewCategory.promiseDeleteDB!==undefined)
            self.deleteDB(mNewCategory);
    })
}

EditHelpContainer.prototype.itemEdit = function () {
    var self = this;
    var textId = ("text_" + Math.random() + Math.random()).replace(/\./g, '');
    var temp = _({
        tag: 'div',
        class: "container-bot",
        props: {
            id: textId
        }
    })


    var ckedit = _({
        tag: 'attachhook',
        on: {
            error: function () {
                this.selfRemove();
                self.editor = CKEDITOR.replace(textId);
            }
        }
    });
    return temp;
}

EditHelpContainer.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

EditHelpContainer.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

EditHelpContainer.prototype.flushDataToView = function () {
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

EditHelpContainer.prototype.start = function () {

}

export default EditHelpContainer;