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
], function(BaseController,deepExtend, Formatter, Controller, JSONModel, ColumnListItem, Input, MessageToast, ODataModel, Storage, Filter,FilterOperator,MessageBox) {
	"use strict";
	return BaseController.extend("notificacionesfabrica.controller.fabricacion", {
		formatter: Formatter,
        
		onInit: function () {
            //se registra el método onDisplay para que siempre se llame cuando se retorna a la vista
           this.reloadView(this, "fabricacion");

            var loRouterThis = sap.ui.core.UIComponent.getRouterFor(this);
            //obtiene el nombre de la vista y lo extrae del namespace con pop, luego lo pasa a getRoute para así obtener su route y su target indicado en el manifest
            loRouterThis.getRoute(this.getMetadata().getName().split('.').pop());
            //oRouter.getRoute("fabricacion").attachMatched(this.backToLogin, this);
            //this.backToLogin(Storage.Type.session, this);
            var _this = this;
            this.url = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.fabricacion.uri ;			            
			this.oDataModel = new ODataModel( this.url, true );   

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
			this.oTable = this.byId("idFabricacionTabla");
            //Se copia el estado anterior de la tabla 
            this.oTableAnterior = Object.assign(this.oTable);
			
			this.oReadOnlyTemplate = this.byId("idFabricacionTabla").removeItem(0);
		/*  this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.oEditableTemplate = new ColumnListItem({
				cells: [					
					 new Input({
						value: "{Enmng}",
						description: "{Meins} / {i18n>fabricacion_tab_col_5}"
					})
				]
			});*/
            //this.setCabecera();
            //this.showSideMenu();

        },

        onDisplay(){
            //se refrescará la tabla cada vez que se visualice la vista
            this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            //se hace una copia de los datos anteriores a la modificación
            this.oEditableTemplate  = this.oReadOnlyTemplate;
			/*this.oEditableTemplate = new ColumnListItem({
				cells: [					
					 new Input({
						value: "{Enmng}",
						description: "{Meins} / {i18n>fabricacion_tab_col_5}"
					})
				]
			});*/
            this.setCabecera();
            this.showSideMenu();
        },

        showSideMenu: function(){
            sap.ui.getCore().getEventBus().publish( "menu",         
                                                    "setVisibilitySideMenu",
                                                    {   buttonsToAvoid: ["loginOrdenes"] ,
                                                        visible: true ,
                                                        logoutBtn: true
                                                    }
                );
        },

        rebindTable: function(oTemplate, sKeyboardMode) {
			this.oTable.bindItems({
				//path: "/ordenFabricacionSet?$filter=Aufnr eq '900000094870' and Arbpl eq 'PREP_ACO' and Pernr eq '10000095'",                
                path: "/ordenFabricacionSet",
                filters: [ new Filter("Aufnr", FilterOperator.EQ, '900000094870') ,
                           new Filter("Arbpl", FilterOperator.EQ, 'PREP_ACO') ,
                           new Filter("Pernr", FilterOperator.EQ, '10000095') ,
                        ],
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
/*
		onEdit: function() {
			this.aProductCollection = deepExtend([], this.getView().getModel().getProperty("/ordenFabricacionSet"));
			this.byId("editButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("cancelButton").setVisible(true);
            
			this.rebindTable(this.oEditableTemplate, "Edit");
		},*/

         /**
             * Permite enviar las modificaciones de la tabla al Gateway de sap especificado
             * Solo serán enviadas aquellas filas que se hayan modificado
             * @param {[{colIndex,colBinding}]} itFieldsToSend Arreglo con los índices y sus respectivas propiedades de la entidad de la columna que se campararán y se enviarán al gateway de sap
             * @private
             */
        enviarModificaciones(itFieldsToSend){
            var _this = this;
            var ordenFabricacion=[];
            //SE COMPARA EL NUEVO VALOR INTRODUCIDO EN EL INPUT con el valor antiguo obtenido originalmente al cargar la tabla, este valor antiguo se encuentra en las propiedades dle Model
            var lenghtItems=this.oTable.getItems().length;
            var json={  "Aufnr" :  this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Aufnr ,
                        "Arbpl" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Arbpl,
                        "Pernr" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Pernr,
                        "N_header_ordenes" : ""
                    };                  
                    
                    //var json=[];
                    
            var ltFieldsModified = [];
            //llaves que son las propiedades del Binding del odata
            var ltJsonKeys = null;
            for(var i=0;i < lenghtItems;i++){  
                var lvFlagModifiedRow = false;
                
                //se toma la primera fila y se obtienen los keys que conforman el binding(las propiedades del Odata)
                if(!ltJsonKeys){
                    ltJsonKeys = Object.keys(this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()));
                    ltJsonKeys.splice(0,1);
                }
                //se agregan todos los valores de los campos de la fila en un json para 
                var lsFilaJson = {};
                for(var lvKey of ltJsonKeys){
                    lsFilaJson[lvKey] = this.getView().getModel().getProperty(this.oTable.getItems()[i].getBindingContext().getPath())[lvKey];
                    //JSON.stringify( '"'+lvKey+'" : "'+this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath())[lvKey] +'"' )
                }
                    
                //Se verifica si los campos cuyos valores se compararán, para ver si se han modificado porque se supone son los que se actualizarán en el gateway de sap, son de tipo Input
                for(var lvIndex of itFieldsToSend){                    
                    //Si el campo no se puede editar se manda excepción porque es un error de lógica de la aplicación 
                    if(!this.oTable.getItems()[i].getCells()[lvIndex.colIndex].getEditable() ){                             
                        throw new error("El campo cuyo Valor a enviar debe ser de tipo editable/input");
                    }
                    //si se ha modificado algunod e los campos que se van a enviar al serividor, se coloca la fila entera en el json para enviarlo al servidor
                    if( this.oTable.getItems()[i].getCells()[lvIndex.colIndex].getValue()
                     != this.getView().getModel().getProperty(this.oTable.getItems()[i].getBindingContext().getPath())[lvIndex.colBinding]  ){
                        //se guarda el valor que se ha modificado en la propiedad correspondiente en el json
                        lsFilaJson[lvIndex.colBinding]=this.oTable.getItems()[i].getCells()[lvIndex.colIndex].getValue();                                         
                        //como hay un campo cuyo valor se ha modificado, se agregará al Json para enviar a SAP
                        lvFlagModifiedRow = true;                         
                    }
                }
                //se agrega la fila con los cambios al json a enviar a SAP (solo si se han realizado cambios)
                if(lvFlagModifiedRow){
                    ordenFabricacion.push( lsFilaJson );
                }
            }            
            json.N_header_ordenes = ordenFabricacion ;
/*
                //SOLO PARA LA PRIMERA ITERACIÓN
                //obtengo cuales son los índices de las columnas a tratar  
                if(!lenghtcolumns){
                    lenghtcolumns = this.oTable.getItems()[i].getCells().length;
                    //se obtiene cuál es la columna a tratar, dicha columna es un input
                    for(var j=0; j < lenghtcolumns; j++){                        
                        //var lvField = this.oTable.getItems()[i].getCells()[3].getMetadata().getElementName().indexOf("Input");
                        //if(lvField>-1){
                        
                        //si el campo es de tipo input/editable entonces se inserta en el array de índices
                        if(this.oTable.getItems()[i].getCells()[j].getEditable() ){                             
                            ltFieldsModified.push(j);        
                        }
                    }
                }*/
                /*//se verifica si se ha modificado algún campo
                for(var indexCelda of ltFieldsModified ){                    
                    if( this.oTable.getItems()[i].getCells()[indexCelda].getValue()
                    != this.oTableAnterior.getItems()[i].getCells()[indexCelda].getValue()){
                            
                        
                        break;
                    }
                }    */

/*
            if( this.oTable.getItems()[i].getCells()[indexCelda].getValue()
                != this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath()).Enmng       ){
                    
                    ordenFabricacion.push({
                        "Aufnr" :  this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath()).Aufnr ,
                        "Arbpl" : this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath()).Arbpl,
                        "Pernr" : this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath()).Pernr,
                        "Matnr" : this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath()).Matnr,
                        "Maktx" : this.getView().getModel().getProperty(this.oTable.getItems()[indexCelda].getBindingContext().getPath()).Maktx,
                        "ChargD" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).ChargD,
                        "Bdmng" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Bdmng,
                        "Enmng" : this.oTable.getItems()[i].getCells()[0].getValue(),
                        "Erfmg" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Erfmg,
                        "Meins" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Meins
                    });
                }
                   
            }
        }
        json.N_header_ordenes = ordenFabricacion ;*/
        //json = ordenFabricacion ;
    
  /*      this.oDataModel.create("/ordenFabricacionSet",json,{
            success: function(result){
                console.log("ok");
                // everything is OK 
            },
            error: function(err){
                // some error occuerd 
            },
            async: true,  // execute async request to not stuck the main thread
            urlParameters: {}  // send URL parameters if required 
        }); 
*/


        OData.request  ({  
            requestUri:      this.url + "ordenHeaderSet",  
            method: "GET",  
                    
            headers: {   "X-Requested-With": "XMLHttpRequest",                        
                    "Content-Type": "application/atom+xml", 
                    "DataServiceVersion": "2.0",                      
                    //se pasa el parámetro fetch para así obtener el token CSRF
                    "X-CSRF-Token": "Fetch"   },  
            },  
            //si se conecta con el servidor, se continúa ya haciendo el post con el token obtenido en el get 
            function (data, response) {
                    var header_xcsrf_token = response.headers['x-csrf-token'];                    

                OData.request 
                ({                  
                    requestUri: _this.url + "ordenHeaderSet",
                    method: "POST",
                    headers: {   "X-Requested-With": "XMLHttpRequest",                        
                                "Content-Type": "application/atom+xml", 
                                "DataServiceVersion": "2.0",  
                                "Accept": "application/atom+xml,application/atomsvc+xml,application/xml", 
                                "X-CSRF-Token": header_xcsrf_token    
                            },  
                    data:  json
                            
                },
                function (data, response) 
                { 
                    MessageBox.error(response.message);
                },  
                function (err)  
                {      
                                            
                    _this._showServiceError(_this,err);                             
                })

            });   
            
        },
        


/*
		onSave: function() {
			this.byId("saveButton").setVisible(false);
			this.byId("cancelButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			//this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            this.enviarModificaciones();
		},

		onCancel: function() {
			this.byId("cancelButton").setVisible(false);
			this.byId("saveButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.oModel.setProperty("/ordenFabricacionSet", this.aProductCollection);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},*/

		onSumbit: function() {            
			this.enviarModificaciones(
                                        //se especifican las columnas a enviar (ÍNDICE Y LS PROPIEDAD DEL ODATA PARA LOS CAMPOS DE DICHA COLUMNA)
                                        [{
                                            colIndex: 3,
                                            colBinding: "Enmng"
                                        }
                                        ]);
		},

		onExit: function() {
			this.aProductCollection = [];
			this.oEditableTemplate.destroy();
			this.oModel.destroy();
		},

		onPaste: function(oEvent) {
			var aData = oEvent.getParameter("data");
			MessageToast.show("Se han pegado los datos: " + aData);
		}
	})

	        /*
        //se vuelve al login verificando la cocokie
        backToLogin: function(_View){
            //verifico si mis coockies de sesión han sido guardadas, es decir, si me he logueado recientemente
            var oStorage = new Storage(Storage.Type.session, "login");
            //si no existe al menos la orden que siempre va a estar guardada, es porque se ha salido de la sesión
            if (!oStorage.get("idorden")){

                var oRouter = sap.ui.core.UIComponent.getRouterFor(_View);
			    oRouter.navTo("login", {} );
            }
        },
*/


});