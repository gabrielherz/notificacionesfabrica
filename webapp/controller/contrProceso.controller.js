sap.ui.define([
    './BaseController',
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
    "sap/ui/model/FilterOperator",
    'sap/m/MessageBox'
], function (BaseController, deepExtend, Formatter, Controller, JSONModel, ColumnListItem, Input, MessageToast, ODataModel, Storage, Filter, FilterOperator, MessageBox) {
    "use strict";
    return BaseController.extend("notificacionesfabrica.controller.contrProceso", {
        formatter: Formatter,

        onInit: function () {
            //se registra el método onDisplay para que siempre se llame cuando se retorna a la vista
            this.reloadView(this, "contrProceso");

            var loRouterThis = sap.ui.core.UIComponent.getRouterFor(this);
            //obtiene el nombre de la vista y lo extrae del namespace con pop, luego lo pasa a getRoute para así obtener su route y su target indicado en el manifest
            loRouterThis.getRoute(this.getMetadata().getName().split('.').pop());

            this.setMatchcodeDialog('idpeso');
            /*this.oDataServiceUrlF4 = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.matchcodes.uri;
			this.oDataModelF4 = new ODataModel( this.oDataServiceUrlF4, true );
            this.oDialog = sap.ui.xmlfragment("notificacionesfabrica.view.matchcode", this);
            this.oDialog.setModel(this.oDataModelF4);
            this.setMatchcodeDialog(this.oDialog);*/

            var _this = this;
            this.url = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.contrProceso.uri;
            this.oDataModel = new ODataModel(this.url, true);

            this.getView().setModel(this.oDataModel);

            /*
                            _this.getOwnerComponent().getModel('alerts').setProperty("/alerts/errors", 
                            [ {
                                type: "Error",
                                title: "Error al consultar datos",
                                subTitle: "Error Consulta al servidor",
                                description: e.message, //"Error de Conexión",                                                
                                target: ""                        
                                } ] )                
                            );  */
            this.oTable = this.byId("idContrProdTabla");
            //Se copia el estado anterior de la tabla 
            this.oTableAnterior = Object.assign(this.oTable);

            this.oReadOnlyTemplate = this.byId("idContrProdTabla").removeItem(0);

            this.oTable2 = this.byId("idContrProcPrevTabla");

            this.oReadOnlyTemplate2 = this.byId("idContrProcPrevTabla").removeItem(0);

            this.oTable3 = this.byId("idVerifTaraEnvTabla");

            this.oReadOnlyTemplate3 = this.byId("idVerifTaraEnvTabla").removeItem(0);

        },


        onDisplay() {
            //instancia para manejo de coockies
            this.oStorage = new Storage(Storage.Type.session, "login");
            this.oJSONLogin = this.oStorage.get("login");

            //se refrescará la tabla cada vez que se visualice la vista
            this.rebindTable(this.oReadOnlyTemplate, this.oTable, "Navigation", "/controlesProdSet");

            this.rebindTable(this.oReadOnlyTemplate2, this.oTable2, "Navigation", "/controlesProcesosPrevSet");

            this.rebindTable(this.oReadOnlyTemplate3, this.oTable3, "Navigation", "/verifTaraEnvSet");

            //se hace una copia de los datos anteriores a la modificación
            this.oEditableTemplate = this.oReadOnlyTemplate;

            this.setCabecera();
            this.showSideMenu();
        },
        /**
         * Se ocultan los botones del menú lateral izquierdo
        */
        showSideMenu: function () {
            sap.ui.getCore().getEventBus().publish("menu",
                "setVisibilitySideMenu",
                {
                    buttonsToAvoid: ["loginOrdenes"],
                    visible: true,
                    logoutBtn: true
                }
            );
        },

        rebindTable: function (oTemplate, oTable, sKeyboardMode, sBindingName) {
            var ltFilters = [];
            //se agregan en el filtro los datos seleccionados en las pantallas de login
            ltFilters.push(new Filter("Aufnr", FilterOperator.EQ, this.oJSONLogin.cabecera.orden));            
            ltFilters.push(new Filter("Pernr", FilterOperator.EQ, this.oJSONLogin.selectedPernr));
            /*for (var lvPernr of this.oJSONLogin.pernr) {
                ltFilters.push(new Filter("Pernr", FilterOperator.EQ, lvPernr));
            }*/
            oTable.bindItems({
                path: sBindingName,

                filters: ltFilters,
                //parameters:{"$filter" : "Aufnr eq '900000094870' and Arbpl eq 'PREP_ACO' and Pernr eq '10000095'"},
                //parameters:{$filter : "Aufnr eq '900000094870'"},
                /*filters : [
                    { path : 'Aufnr', operator : 'EQ', value1 : '900000094870'}
                ],*/
                template: oTemplate,
                templateShareable: true,
                key: "Aufnr"
            }).setKeyboardMode(sKeyboardMode);
        },

        onExit: function () {
            this.aProductCollection = [];
            this.oEditableTemplate.destroy();
            this.oModel.destroy();
        },

        onPaste: function (oEvent) {
            var aData = oEvent.getParameter("data");
            MessageToast.show("Se han pegado los datos: " + aData);
        }
    });
}
);
