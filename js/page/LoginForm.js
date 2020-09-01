import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/LoginForm.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import moduleDatabase from '../component/ModuleDatabase';

import { setCookie } from '../component/FormatFunction';


var _ = Fcore._;
var $ = Fcore.$;

function LoginForm() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

LoginForm.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(LoginForm.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
LoginForm.prototype.constructor = LoginForm;

LoginForm.prototype.getView = function () {
    this.createPromise();
    var self = this;
    this.$view = _({
        tag:"div",
        class:"login-register",
        style:{
            backgroundImage:"url(https://pizo.vn/storage/backend/assets/images/background/login-register.jpg)"
        },
        child:[
            {
                tag:"div",
                class:["login-box", "card"],
                child:[
                    {
                        tag:"div",
                        class:"card-body",
                        child:[
                            {
                                tag:"div",
                                class:["form-horizontal", "form-material"],
                                props:{
                                    id:"loginform"
                                },
                                child:[
                                    {
                                        tag:"h3",
                                        class:["box-title", "m-b-20", "text-center"],
                                        props:{
                                            innerHTML:"Đăng nhập"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        clas:"form-group",
                                        child:[
                                            {
                                                tag:"div",
                                                class:"col-xs-12",
                                                child:[
                                                    {
                                                        tag:"div",
                                                        class:"form-group",
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:"col-xs-12",
                                                                child:[
                                                                    {
                                                                        tag:"input",
                                                                        class:"form-control",
                                                                        on:{
                                                                            input:function()
                                                                            {
                                                                                if(self.notifycationLogin.style.display == "")
                                                                                self.notifycationLogin.style.display = "none";
                                                                            }
                                                                        },
                                                                        props:{
                                                                            id:"phone-password-pizo-complete",
                                                                            name:"phone",
                                                                            type:"tel",
                                                                            placeholder:"Số điện thoại"
                                                                        }
                                                                    },
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        tag:"div",
                                                        class:"form-group",
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:"col-xs-12",
                                                                child:[
                                                                    {
                                                                        tag:"input",
                                                                        class:"form-control",
                                                                        on:{
                                                                            input:function()
                                                                            {
                                                                                if(self.notifycationLogin.style.display == "")
                                                                                self.notifycationLogin.style.display = "none";
                                                                            }
                                                                        },
                                                                        props:{
                                                                            id:"input-password-pizo-complete",
                                                                            name:"password",
                                                                            type:"password",
                                                                            placeholder:"Mật khẩu"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        tag:"div",
                                                        class:["form-group", "row"],
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:["col-md-12", "font-14"],
                                                                child:[
                                                                    {
                                                                        tag:"div",
                                                                        class:["checkbox", "checkbox-primary", "pull-left", "p-t-0"],
                                                                        child:[
                                                                            {
                                                                                tag:"input",
                                                                                props:{
                                                                                    id:"checkbox-signup",
                                                                                    type:"checkbox",
                                                                                    checked:true
                                                                                }
                                                                            },
                                                                            {
                                                                                tag:"label",
                                                                                props:{
                                                                                    for:"checkbox-signup",
                                                                                    innerHTML:" Ghi nhớ đăng nhập "
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        tag:"div",
                                                        class:["alert", "alert-danger"],
                                                        style:{
                                                            display:"none"
                                                        },
                                                        props:{
                                                            innerHTML:"Đăng nhập thất bại"
                                                        }
                                                    },
                                                    {
                                                        tag:"div",
                                                        class:["form-group", "text-center", "m-t-20"],
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:"col-xs-12",
                                                                child:[
                                                                    {
                                                                        tag:"button",
                                                                        class:["btn-login", "btn-login-info", "btn-login-lg", "btn-login-block", "text-uppercase", "waves-effect", "waves-light"],
                                                                        on:{
                                                                            click:function(event)
                                                                            {
                                                                               self.requestLogin();
                                                                            }
                                                                        },
                                                                        props:{
                                                                            id:"button-password-pizo-complete",
                                                                            type:"submit",
                                                                            innerHTML:"Đăng nhập"
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
                            }
                        ]
                    }
                ]
            }
        ]
    })
    this.inputPhone = $("input#phone-password-pizo-complete",this.$view);
    this.inputPassword = $("input#input-password-pizo-complete",this.$view);
    var functionX = function(event){
        if (event.keyCode === 13) {
            self.requestLogin();
        }
    }
    this.inputSaveLogin = $("input#checkbox-signup",this.$view);
    this.notifycationLogin = $("div.alert.alert-danger",this.$view);
    window.addEventListener("keydown",functionX);
    this.functionX = functionX;
    return this.$view;
}

LoginForm.prototype.requestLogin = function()
{
    moduleDatabase.queryData("login.php",{phone:this.inputPhone.value,password:this.inputPassword.value},"users").then(function(value){
        if(value == false)
        {
            if(this.notifycationLogin.style.display == "none")
            this.notifycationLogin.style.display = "";
        }else
        {
            if(this.inputSaveLogin.checked==true)
            {
                setCookie("token_pizo_phone",value["token"],3);
                setCookie("userid_pizo_phone",value["user"][0]["id"],3);
            }
            window.token = value["token"];
            window.userid = value["user"][0]["id"];
            moduleDatabase.getModule("users").setFormatLoad({WHERE:[{userid:value["user"][0]["id"]}]},value["user"]);
            window.removeEventListener("keydown",this.functionX)
            this.resolveDB(value);
        }
    }.bind(this))
}

LoginForm.prototype.createPromise = function()
{
    var self = this;
    self.promiseLogin = new Promise(function(resolve,reject){
        self.resolveDB = resolve;
        self.rejectDB = reject;
    })
}

LoginForm.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

LoginForm.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

LoginForm.prototype.flushDataToView = function () {
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

LoginForm.prototype.start = function () {

}

export default LoginForm;