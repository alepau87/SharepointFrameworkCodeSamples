"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var office_ui_fabric_react_1 = require('office-ui-fabric-react');
var Librarysample_module_scss_1 = require('../Librarysample.module.scss');
var Librarysample = (function (_super) {
    __extends(Librarysample, _super);
    function Librarysample() {
        _super.apply(this, arguments);
    }
    Librarysample.prototype.render = function () {
        return (React.createElement("div", {className: Librarysample_module_scss_1.default.librarysample}, React.createElement("div", {className: Librarysample_module_scss_1.default.container}, React.createElement("div", {className: office_ui_fabric_react_1.css('ms-Grid-row ms-bgColor-themeDark ms-fontColor-white', Librarysample_module_scss_1.default.row)}, React.createElement("div", {className: 'ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'}, React.createElement("span", {className: 'ms-font-xl ms-fontColor-white'}, "Welcome to SharePoint!"), React.createElement("p", {className: 'ms-font-l ms-fontColor-white'}, "Customize SharePoint experiences using Web Parts."), React.createElement("p", {className: 'ms-font-l ms-fontColor-white'}, this.props.description), React.createElement("a", {className: office_ui_fabric_react_1.css('ms-Button', Librarysample_module_scss_1.default.button), href: 'https://github.com/SharePoint/sp-dev-docs/wiki'}, React.createElement("span", {className: 'ms-Button-label'}, "Learn more")))))));
    };
    return Librarysample;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Librarysample;

//# sourceMappingURL=Librarysample.js.map
