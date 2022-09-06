sap.ui.define([	
	'sap/ui/core/mvc/Controller',
    'sap/base/util/deepExtend',
	'../model/formatter',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/ColumnListItem',
	'sap/m/Input',
	'sap/m/MessageToast',
    'sap/ui/model/odata/ODataModel',
    "sap/ui/util/Storage",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
	
], function (Controller, deepExtend, Formatter, Controller, JSONModel, ColumnListItem, Input, MessageToast, ODataModel, Storage, Filter,FilterOperator) {
	"use strict";
	return Controller.extend("notificacionesfabrica.controller.cabecera", {
    
    	onInit: function () {
		}
	})
});	