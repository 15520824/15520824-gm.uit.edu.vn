import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListHelp.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import HelpContainer from '../component/HelpContainer';

var _ = Fcore._;
var $ = Fcore.$;

function ListHelp() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListHelp.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(ListHelp.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListHelp.prototype.constructor = ListHelp;

ListHelp.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    var containerHelp = new HelpContainer();
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [{
            class: 'absol-single-page-header',
            child: []
        }, ]
    });

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-help-main"],
        child: [
            containerHelp
        ]
    }));
    return this.$view;
}

ListHelp.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListHelp.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListHelp.prototype.flushDataToView = function() {
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

ListHelp.prototype.start = function() {

}

export default ListHelp;