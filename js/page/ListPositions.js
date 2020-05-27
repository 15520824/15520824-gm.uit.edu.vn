import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListPositions.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import {loadData,updateData} from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewDepartment from '../component/NewDepartment';
import NewPosition from '../component/NewPosition';
var _ = Fcore._;
var $ = Fcore.$;

function ListPositions() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListPositions.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListPositions.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListPositions.prototype.constructor = ListPositions;

ListPositions.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag:"input",
        class:"quantumWizTextinputPaperinputInput",
        on:{
            change:function(){
                self.mTable.updatePagination(this.value);
            }
        },
        props:{
            type:"number",
            autocomplete:"off",
            min:1,
            max:200,
            step:1,
            value:50
        }
    })
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-position-list",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
                    {
                        tag: "span",
                        class: "pizo-body-title-left",
                        props: {
                            innerHTML: "Sơ đồ tổ chức"
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
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.addDepartment();
                                    }
                                },
                                child: [
                                '<span>' + "Thêm bộ phận" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                       var arr  = self.mTable.getElementsByClassName("choice");
                                       if(arr.length == 1)
                                            arr = arr[0];
                                        else
                                            return;
                                        self.addPosition(arr.data.original.id,arr);
                                    }
                                },
                                child: [
                                '<span>' + "Thêm chức vụ" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        
                                    }
                                },
                                child: [
                                '<span>' + "Tìm nhân viên" + '</span>'
                                ]
                            }
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
    var tabInput = _({
        tag:"input",
        class:"pizo-list-realty-page-allinput-input",
        style:{
            marginBottom:"0.71428571428rem"
        },
        props:{
            placeholder:"Tìm kiếm"
        }
    });
    var titleInput = _({
        tag:"input",
        class:"pizo-list-realty-page-allinput-input",
        style:{
            marginBottom:"0.71428571428rem",
            fontWeight:"bold",
            pointerEvents:"none"
        },
        props:{
            innerHTML:""
        }
    });
    self.titleInput = titleInput;
    var tabContainer = _({
        tag:"div",
        class:["pizo-list-realty-main-result-control","drag-zone-bg"],
        style:{
            width:"40%",
            display: "inline-block"
        },
        child:[
            tabInput
        ]
    })

    var contentContainer = _({
        tag:"div",
        class:["pizo-list-realty-main-result-control","drag-zone-bg"],
        style:{
            width:"calc(60% - 30px)",
            display: "inline-block",
            marginLeft: "30px"
        },
        child:[
            titleInput
        ]
    })

    var docTypeMemuProps,token,functionX;
    var functionClickMore = function(event, me, index, parent, data, row)
    {
       
        docTypeMemuProps = {
            items: [
                {
                    text: 'Thêm',
                    icon: 'span.mdi.mdi-text-short',
                    value:0,
                },
                {
                    text: 'Sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value:1,
                },
                {
                    text: 'Xóa',
                    icon: 'span.mdi.mdi-text',
                    value:2,
                },
                {
                    text: 'Thêm chức vụ',
                    icon: 'span.mdi.mdi-text-short',
                    value:3,
                },
            ]
        };
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3,4], function (menuItem) {
            switch(menuItem.value)
            {
                case 0:
                    self.addDepartment(data.original.id,row);
                    break;
                case 1:
                    self.editDepartment(data,parent,index);
                    break;
                case 2:
                    self.deleteDepartment(data.original,parent,index);
                    break;
                case 3:
                    self.addPosition(data.original.id,row);
                    break;
            }
        });

        functionX = function(token){
            return function(){
                var x = function(event){
                    absol.QuickMenu.close(token);
                    document.body.removeEventListener("click",x);
                }
                document.body.addEventListener("click",x)
            }
        }(token);

        setTimeout(functionX,10)
    }
    var functionClickRow = function(event, me, index, parent, data, row){
        self.mTablePosition.updateTable(undefined,self.checkDepartment[data.original.id]);

        var arr = self.mTable.getElementsByClassName("choice");
        for(var i = 0;i<arr.length;i++)
            arr[i].classList.remove("choice");
        row.classList.add("choice");
        self.titleInput.value = data.original.name;
        self.titleInput.data = data.original.id;
    }

    var functionClickMoreSencond = function(event, me, index, parent, data, row)
    {
       
        docTypeMemuProps = {
            items: [
                {
                    text: 'Sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value:0,
                },
                {
                    text: 'Xóa',
                    icon: 'span.mdi.mdi-text',
                    value:1,
                }
            ]
        };
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3,4], function (menuItem) {
            switch(menuItem.value)
            {
                case 0:
                    self.editPosition(data,parent,index);
                    break;
                case 1:
                    self.deletePosition(data.original,parent,index);
                    break;
            }
        });

        functionX = function(token){
            return function(){
                var x = function(event){
                    absol.QuickMenu.close(token);
                    document.body.removeEventListener("click",x);
                }
                document.body.addEventListener("click",x)
            }
        }(token);

        setTimeout(functionX,10)
    }

    loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_departments.php").then(function(value){
        var header = [{value:'Bộ phận',sort:true,style:{minWidth:"unset"},functionClickAll:functionClickRow},{value: 'Mã',sort:true,style:{minWidth:"100px",width:"100px"},functionClickAll:functionClickRow},{type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
        console.log(value)
        self.mTable = new tableView(header, self.formatDataRow(value), false, true, 0);
        tabContainer.addChild(self.mTable);
        self.mTable.addInputSearch(tabInput);

        var header = [{value: 'STT',type:"increase",sort:true,style:{minWidth:"50px",width:"50px"}},{value: 'Mã',sort:true,style:{minWidth:"100px",width:"100px"}},{value:'Họ và tên',sort:true,style:{minWidth:"unset"}},{value:'Chức vụ',sort:true,style:{minWidth:"unset"}},{value:'Ghi chú',style:{minWidth:"unset"}},{type:"detail", functionClickAll:functionClickMoreSencond,icon:"",dragElement : false,style:{width:"30px"}}];
        self.mTablePosition = new tableView(header, [], false, true);
        contentContainer.addChild(self.mTablePosition);

        var promiseAll = [];
        promiseAll.push(loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_positions.php"));
        promiseAll.push(loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_accounts.php"));
        Promise.all(promiseAll).then(function(values){
            self.formatDataRowAccount(values[1]);
            self.formatDataRowPosition(values[0]);
        });
    });

   
    
    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                tabContainer,
                contentContainer
            ]   
        })
        );
    return this.$view;
}

ListPositions.prototype.formatDataRowPosition = function(data){
    var checkDepartment = [];
    for(var i = 0;i<data.length;i++)
    {
        if(checkDepartment[data[i].department_id]==undefined)
        checkDepartment[data[i].department_id] = [];

        checkDepartment[data[i].department_id].push(this.getDataRowPosition(data[i]));
    }
    this.checkDepartment = checkDepartment;
}

ListPositions.prototype.getDataRowPosition = function(data)
{
    var name;
    if(this.checkAccount[data.id]==undefined)
        name = "";
    else{
        name = this.checkAccount[data.id].name
    }
        
    var temp = [
        {},
        data.code,
        name,
        data.name,
        data.note,
        {}
    ]
    temp.original = data;
    return temp;
}

ListPositions.prototype.formatDataRowAccount = function(data){
    var checkAccount = [];
    this.listAccoutData = data;
    for(var i = 0;i<data.length;i++)
    {
        checkAccount[data[i].positionid]= data[i];
    }
    this.checkAccount = checkAccount;
}

ListPositions.prototype.formatDataRow = function(data)
{
    var temp = [];
    var check = [];
    var k = 0;
  
    console.log(data)
    for(var i=0;i<data.length;i++)
    {
        var result = [
        data[i].name,
        data[i].code,
        {}
        ]
        result.original = data[i];
        if(check[data[i].parent_id]!==undefined)
        {
            if(check[data[i].parent_id].child === undefined)
            check[data[i].parent_id].child = [];
            check[data[i].parent_id].child.push(result);
        }
        else
        temp[k++] = result;
        check[data[i].id] = result;
    }
    
    return temp;
}

ListPositions.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListPositions.prototype.getDataChild = function(arr)
{
    var self = this;
    var result = [];
    for(var i = 0;i<arr.length;i++)
    {
        result.push(arr[i].original);
        if(arr[i].child!==undefined)
        result = result.concat(self.getDataChild(arr[i].child));
    }
    return result;
}

ListPositions.prototype.addDepartment = function(parent_id = 0,row)
{
    var self = this;
    var mNewDepartment = new NewDepartment(undefined,parent_id);
    mNewDepartment.attach(self.parent);
    var frameview = mNewDepartment.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDBDepartment(mNewDepartment,row);
}

ListPositions.prototype.addDBDepartment = function(mNewDepartment,row ){
    var self = this;
    mNewDepartment.promiseAddDB.then(function(value){
        console.log(value)
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/add_department.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        updateData(phpFile,value).then(function(result){
            value.id = result;
            self.addViewDepartment(value,row);
        })
        mNewDepartment.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewDepartment.promiseAddDB!==undefined)
            self.addDBDepartment(mNewDepartment);
        },10);
    })
}

ListPositions.prototype.addViewDepartment = function(value,parent){
    var result = [
        value.name,
        value.code,
        {}
    ]
    result.original = value;

    var element = parent;
        if(value.parent_id == 0)
        element = this.mTable;
        else
        for(var i = 0;i<parent.bodyTable.childNodes.length;i++)
        {
            if(parent.bodyTable.childNodes[i].data.original.id==value.parent_id){
                element = parent.bodyTable.childNodes[i];
                break;
            }
         }
    element.insertRow(result);
}

ListPositions.prototype.editDepartment = function(data,parent,index)
{
    var self = this;
    var mNewDepartment = new NewDepartment(data);
    mNewDepartment.attach(self.parent);
    var frameview = mNewDepartment.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBDepartment(mNewDepartment,data,parent,index);
}

ListPositions.prototype.editDBDepartment = function(mNewDepartment,data,parent,index){
    var self = this;
    mNewDepartment.promiseEditDB.then(function(value){
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/update_department.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        value.id = data.original.id;
        updateData(phpFile,value).then(function(result){
            self.editViewDepartment(value,data,parent,index);
        })
        mNewDepartment.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewDepartment.promiseEditDB!==undefined)
            self.editDBDepartment(mNewDepartment,data,parent,index);
        },10);
    })
}

ListPositions.prototype.editViewDepartment = function(value,data,parent,index){
    var isChangeView=false;

    data.original.name = value.name;
    data.original.code = value.code;

    if(data.original.parent_id!=value.parent_id){
        isChangeView = true;
    }
    data.original.parent_id = value.parent_id;


    data[0] = value.name;
    data[1] = value.code;


    var indexOF = index,element = parent;
    
    if(isChangeView===true)
    {
        var element;
        if(value.parent_id == 0)
        element = parent.bodyTable.parentNode;
        else
        for(var i = 0;i<parent.bodyTable.childNodes.length;i++)
        {
            if(parent.bodyTable.childNodes[i].data.original.id==value.parent_id){
                element = parent.bodyTable.childNodes[i];
                break;
            }
        }
        indexOF = parent.changeParent(index,element);
    }
    element.updateRow(data,indexOF,true);
    if(this.titleInput.data == value.id)
    {
        this.titleInput.value = value.name;
    }
}

ListPositions.prototype.deleteDepartment = function(data,parent,index)
{
    
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục","Bạn có chắc muốn xóa :"+data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function(){
        self.deleteDBDepartment(data,parent,index);
    })
}

ListPositions.prototype.deleteViewDepartment = function(parent,index){
    parent.dropRow(index).then(function(){
        
    });
}

ListPositions.prototype.deleteDBDepartment = function(data,parent,index){
    var self = this;
    var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/delete_department.php";
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    updateData(phpFile,data).then(function(value){
        self.deleteViewDepartment(parent,index);
    })
}

ListPositions.prototype.addPosition = function(parent_id = 0,row)
{
    var self = this;
    var mNewPosition = new NewPosition(undefined,parent_id);
    mNewPosition.attach(self.parent);
    mNewPosition.setDataListAccount(self.listAccoutData)
    var frameview = mNewPosition.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDBPosition(mNewPosition,row);
}

ListPositions.prototype.addDBPosition = function(mNewPosition,row ){
    var self = this;
    mNewPosition.promiseAddDB.then(function(value){
        console.log(value)
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/add_position.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        updateData(phpFile,value).then(function(result){
            
            value.id = result;
            console.log(result)
            

            if(value.username!==undefined)
            {
                console.log(value.id)
                var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/update_account.php";
                if(self.phpUpdateAccount)
                phpFile = self.phpUpdateAccount;
                var x = {
                    id:value.username.id,
                    positionid:value.id
                }
                for(var i = 0;i<self.listAccoutData.length;i++)
                {
                    if(self.listAccoutData[i].id == value.username.id )
                     self.listAccoutData[i].positionid = value.id;
                }
                updateData(phpFile,x).then(function(){
                    delete self.checkAccount[value.username.positionid];
                    value.username.positionid = value.id

                    self.checkAccount[value.id] = value.username;
                    value.username = undefined;
                    self.addViewPosition(value,row);
                })
              
            }else
            self.addViewPosition(value,row);
        })

        
        mNewPosition.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewPosition.promiseAddDB!==undefined)
            self.addDBPosition(mNewPosition);
        },10);
    })
}

ListPositions.prototype.addViewPosition = function(value,parent){
    var arr = this.mTable.getElementsByClassName("choice");
    if(arr.length!=1)
    return;
    else
    arr = arr[0];
    if(value.department_id != arr.data.original.id)
    return;
    var result = this.getDataRowPosition(value);
    
    var element = this.mTablePosition;
    element.insertRow(result);
}

ListPositions.prototype.editPosition = function(data,parent,index)
{
    var self = this;
    var mNewPosition = new NewPosition(data);
    mNewPosition.attach(self.parent);
    var frameview = mNewPosition.getView(self.getDataCurrent());
    mNewPosition.setDataListAccount(self.listAccoutData);
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBPosition(mNewPosition,data,parent,index);
}

ListPositions.prototype.editDBPosition = function(mNewPosition,data,parent,index){
    var self = this;
    mNewPosition.promiseEditDB.then(function(value){
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/update_position.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        value.id = data.original.id;
        console.log(value)

        updateData(phpFile,value).then(function(result){
            if(value.username!==undefined&&value.username.positionid != value.id)
            {
                var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/update_account.php";
                if(self.phpUpdateAccount)
                phpFile = self.phpUpdateAccount;
                var x = {
                    id:value.username.id,
                    positionid:value.id
                }
                var promiseAll = [];
                promiseAll.push(updateData(phpFile,x));
                if(self.checkAccount[value.id]!==undefined){
                    var y = {
                        id:self.checkAccount[value.id].id,
                        positionid:0
                    }
                    var promiseAll = [];
                    promiseAll.push(updateData(phpFile,y));
                   
                }   

                for(var i = 0;i<self.listAccoutData.length;i++)
                {
                    if(self.listAccoutData[i]!==undefined&&self.checkAccount[value.id]!==undefined&&self.listAccoutData[i].id == self.checkAccount[value.id].id)
                    {
                        self.mTablePosition.updateTable(undefined,self.mTablePosition.data);
                        self.listAccoutData[i].positionid = 0;
                    }
                    if(self.listAccoutData[i].id == value.username.id )
                    self.listAccoutData[i].positionid = value.id;
                }

                Promise.all(promiseAll).then(function(){
                    delete self.checkAccount[value.username.positionid];
                    value.username.positionid = value.id;
                   
                    self.checkAccount[value.id] = value.username;
                    value.username = undefined;
                    self.editViewPosition(value,data,parent,index);
                })
              
            }else
            self.editViewPosition(value,data,parent,index);
        })
        
        mNewPosition.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewPosition.promiseEditDB!==undefined)
            self.editDBPosition(mNewPosition,data,parent,index);
        },10);
    })
}

ListPositions.prototype.editViewPosition = function(value,data,parent,index){
    var data = this.getDataRowPosition(value);

    var indexOF = index,element = parent;
    
    element.updateRow(data,indexOF,true);
}

ListPositions.prototype.deletePosition = function(data,parent,index)
{
    
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục","Bạn có chắc muốn xóa :"+data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function(){
        self.deleteDBPosition(data,parent,index);
    })
}

ListPositions.prototype.deleteViewPosition = function(parent,index){
    parent.dropRow(index).then(function(){
        
    });
}

ListPositions.prototype.deleteDBPosition = function(data,parent,index){
    var self = this;
    var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/delete_position.php";
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    updateData(phpFile,data).then(function(value){
        self.deleteViewPosition(parent,index);
    })
}


ListPositions.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListPositions.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListPositions.prototype.flushDataToView = function () {
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

ListPositions.prototype.start = function () {

}

export default ListPositions;