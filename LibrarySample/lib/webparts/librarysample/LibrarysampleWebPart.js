"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var sp_client_preview_1 = require('@microsoft/sp-client-preview');
var strings = require('librarysampleStrings');
var Librarysample_1 = require('./components/Librarysample');
var calculator = require('calculator');
var LibrarysampleWebPart = (function (_super) {
    __extends(LibrarysampleWebPart, _super);
    function LibrarysampleWebPart(context) {
        _super.call(this, context);
    }
    LibrarysampleWebPart.prototype.render = function () {
        var element = React.createElement(Librarysample_1.default, {
            description: this.properties.description
        });
        debugger;
        var easycalc = new calculator.EasyCalculator();
        var result = easycalc.sum(1, 2);
        console.log(result);
        ReactDom.render(element, this.domElement);
    };
    Object.defineProperty(LibrarysampleWebPart.prototype, "propertyPaneSettings", {
        get: function () {
            return {
                pages: [
                    {
                        header: {
                            description: strings.PropertyPaneDescription
                        },
                        groups: [
                            {
                                groupName: strings.BasicGroupName,
                                groupFields: [
                                    sp_client_preview_1.PropertyPaneTextField('description', {
                                        label: strings.DescriptionFieldLabel
                                    })
                                ]
                            }
                        ]
                    }
                ]
            };
        },
        enumerable: true,
        configurable: true
    });
    return LibrarysampleWebPart;
}(sp_client_preview_1.BaseClientSideWebPart));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LibrarysampleWebPart;

//# sourceMappingURL=LibrarysampleWebPart.js.map
