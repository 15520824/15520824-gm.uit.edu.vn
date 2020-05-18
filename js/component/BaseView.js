import EventEmitter from "absol/src/HTML5/EventEmitter";
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";

function BaseView()
{
    EventEmitter.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    
    this.loadConfig();
}

Object.defineProperties(BaseView.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
Object.defineProperties(BaseView.prototype, Object.getOwnPropertyDescriptors(Fragment.prototype));
BaseView.prototype.constructor = BaseView;

BaseView.prototype.CONFIG_STORE_KEY = "AS_BaseView_config";
BaseView.prototype.config = {};//share width differentInstance

BaseView.prototype.loadConfig = function () {
    var raw = localStorage.getItem(this.CONFIG_STORE_KEY);
    if (raw) {
        try {
            Object.assign(this.config, JSON.parse(raw));
        }
        catch (error) {
            console.error("Config fail:", error);
        }
    }
};

BaseView.prototype.saveConfig = function () {
    if (this._saveConfigTimeOut > 0) {
        clearTimeout(this._saveConfigTimeOut);
        this._saveConfigTimeOut = -1;
    }
    var self = this;
    setTimeout(function () {
        var raw = JSON.stringify(self.config);
        localStorage.setItem(self.CONFIG_STORE_KEY, raw);
    }, 2000);
};

BaseView.prototype.setData = function (data) {
    throw new Error('Not implement!');
};

BaseView.prototype.getData = function () {
    throw new Error('Not implement!');
};

BaseView.prototype.getComponentTool = function () {
    return undefined;
};

BaseView.prototype.getOutlineTool = function () {
    return undefined;
};

BaseView.prototype.notifyDataChange = function () {
    this.emit('datachange', { type: 'datachange', target: this }, this);
};


BaseView.prototype.execCmd = function () {
    return this.cmdRunner.invoke.apply(this.cmdRunner, arguments);
};

export default BaseView;

