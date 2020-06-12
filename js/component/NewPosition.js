import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewPosition.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { tableView } from '../component/ModuleView';

var _ = Fcore._;
var $ = Fcore.$;

function NewPosition(data,parent_id) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
    if(parent_id!==undefined)
    this.parent_id = parseFloat(parent_id);
    if(this.data!==undefined)
    this.parent_id = parseFloat(data.original.department_id);
}

NewPosition.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewPosition.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewPosition.prototype.constructor = NewPosition;

NewPosition.prototype.createPromise = function()
{
    var self = this;
    if(this.data === undefined)
    {
        self.promiseAddDB = new Promise(function(resolve,reject){
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })

    }else
    {
        self.promiseEditDB = new Promise(function(resolve,reject){
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })
        
    }
}

NewPosition.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewPosition.prototype.getView = function (dataParent) {
    if (this.$view) return this.$view;
    var self = this;
    self.createPromise();
    var array = [];
    if(self.parent_id===undefined)
    self.parent_id = 0;
    self.check = [];
    for(var i = 0;i<dataParent.length;i++)
    {
        if(self.data !== undefined&&self.data.id == dataParent[i].id)
            continue;
        array[i] = {text:dataParent[i].name,value:parseFloat(dataParent[i].id)};
    }
    

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
                            innerHTML: "Thêm chức vụ"
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
                                        self.rejectDB(self.getDataCurrent());
                                    }
                                },
                                child: [
                                '<span>' + "Đóng" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.resolveDB(self.getDataCurrent());
                                        self.createPromise();
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
                                        self.resolveDB(self.getDataCurrent());
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                    }
                                },
                                child: [
                                '<span>' + "Lưu và đóng" + '</span>'
                                ]
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
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control"],
                    child:[
                        {
                            tag:"div",
                            class:"pizo-new-catergory-container",
                            style:{
                                width:"50%"
                            },
                            child:[
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-username",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-username-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-username-container-label",
                                                    props:{
                                                        innerHTML:"Tài khoản"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-category-container-username-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                        click:function(event)
                                                        {
                                                            var checkAccount = self.listLink(self.dataAccount);
                                                            this.parentNode.appendChild(checkAccount);
                                                            var element = this;
                                                            checkAccount.promiseSelectList.then(function(value){
                                                                element.value = value.data.original.name;
                                                                element.data = value.data.original;
                                                            })
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-code",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-code-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-code-container-label",
                                                    props:{
                                                        innerHTML:"Mã"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-category-container-code-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-name",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-name-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-name-container-label",
                                                    props:{
                                                        innerHTML:"Chức vụ"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-category-container-name-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-state-selectbox",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-state-selectbox-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-state-selectbox-container-label",
                                                    props:{
                                                        innerHTML:"Phòng ban"
                                                    }
                                                },
                                                {
                                                    tag:"selectmenu",
                                                    class:["pizo-new-state-selectbox-container-input","pizo-new-realty-dectruct-input"],
                                                    props:{
                                                        enableSearch: true,
                                                        items:array,
                                                        value:self.parent_id
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-note",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-note-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-note-container-label",
                                                    props:{
                                                        innerHTML:"Ghi chú"
                                                    }
                                                },
                                                {
                                                    tag:"textarea",
                                                    class:["pizo-new-category-container-note-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
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
        })
        );

    this.name = $('input.pizo-new-category-container-name-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.username = $('input.pizo-new-category-container-username-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.code = $('input.pizo-new-category-container-code-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.note = $('.pizo-new-category-container-note-container-input.pizo-new-realty-dectruct-input',this.$view);
    
    this.department = $('.pizo-new-state-selectbox-container-input.pizo-new-realty-dectruct-input',this.$view);
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.code.value = this.data.original.code;
        this.note.value = this.data.original.note;
    }
    return this.$view;
}

NewPosition.prototype.getDataCurrent = function()
{
    return {
        department_id:this.department.value,
        name:this.name.value,
        code:this.code.value,
        note:this.note.value,
        username:this.username.data
    }
}

NewPosition.prototype.getDataRowListAccount = function(data){
    var temp = [
        data.username,
        data.name,
        data.phone,
        data.email,
        data.id
    ]
    temp.original = data;
    return temp;
}

NewPosition.prototype.setDataListAccount = function(data){
    this.dataAccount = this.formatDataRowListAccount(data);
}

NewPosition.prototype.formatDataRowListAccount = function(data)
{
    var temp = [["",
        "Không có nhân viên nào",
        "",
        "",
        ""
    ]];
    temp[0].original = {
        id:0,
        name:""
    };
    var isCheck = false
    for(var i = 0;i<data.length;i++){
        temp.push(this.getDataRowListAccount(data[i]));
        if(isCheck==false&&this.data!=undefined)
        {
            if(this.data.original.id == data[i].positionid){
                this.username.value = data[i].name;
                this.username.data = data[i];
                isCheck = true;
            }
            
        }
    }
    return temp;
}

NewPosition.prototype.functionChoice = function(event, me, index, parent, data, row)
{
    var self = this;
    var arr =  self.getElementsByClassName("choice-list-category");
    if(arr.length!==0)
    arr = arr[0];
    var today  = new Date();
    if(self.clickTime === undefined)
    self.clickTime = 0;
    if(arr == row&&today - self.clickTime< 300){
        self.selfRemove();
        self.resolve({event:event, me:me, index:index, parent:parent, data:data, row:row});
    }
    self.clickTime = today;
    if(arr.length!==0)
    arr.classList.remove("choice-list-category");

    row.classList.add("choice-list-category");
}

NewPosition.prototype.listLink = function(data){
    var self = this;
   
  
    var input = _({
        tag:"input",
        class:"input-search-list",
        props:{
            type:"text",
            placeholder:"Search"
        }
    })
    var container = _({
        tag:"div",
        class:["list-linkChoice-container","absol-single-page-scroller"],
        child:[
            {
                tag:"div",
                class:"js-stools-container-bar",
                child:[
                    {
                        tag:"div",
                        class:["btn-wrapper", "input-append"],
                        child:[
                            input
                        ]
                    }
                ]
            }
        ]
    })
    self.modal = _({
        tag:"modal",
        class:"list-linkChoice",
        on:{
            click:function(event){
                var element = event.target;
                
                while(!(element.classList.contains("list-linkChoice")||element.classList.contains("list-linkChoice-container")))
                element = element.parentNode;
                if(element.classList.contains("list-linkChoice")){
                    this.selfRemove();
                    self.modal.reject();
                }
            }
        },
        child:[
            container
        ]
    })

    var header = [
        {value:'Tài khoản',sort:true,style:{minWidth:"unset"} , functionClickAll: self.functionChoice.bind(self.modal)},
        {value:'Họ và tên',sort:true,style:{minWidth:"unset"} , functionClickAll: self.functionChoice.bind(self.modal)},
        {value:'Số điện thoại',style:{minWidth:"90px",width:"90px"} , functionClickAll: self.functionChoice.bind(self.modal)} , 
        {value:'Email',sort:true,style:{minWidth:"unset"} , functionClickAll: self.functionChoice.bind(self.modal)},
        {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"} , functionClickAll: self.functionChoice.bind(self.modal)}, 
    ];
    var mTable = new tableView(header, data, false, false, 0);
    mTable.style.width = "100%";
    container.appendChild(mTable);
    mTable.addInputSearch(input);
    self.modal.promiseSelectList = new Promise(function(resolve,reject){
        self.modal.resolve = resolve;
        self.modal.reject = reject;
    })
    return self.modal;
}

NewPosition.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewPosition.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewPosition.prototype.flushDataToView = function () {
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

NewPosition.prototype.start = function () {

}

export default NewPosition;