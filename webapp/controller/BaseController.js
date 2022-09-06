sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	'sap/m/MessageBox',
	"sap/ui/util/Storage",
	"sap/m/Label"
], function(Controller, UIComponent, MessageBox, Storage, Label) {
	"use strict";
	
	return Controller.extend("notificacionesfabrica.controller.BaseController", {
			 
			 /**
			 * Se vuelve al login verificando la cocokie 
			 * @public
			 */
			//backToLogin: function(session,_View){
			backToLogin: function(){
				//verifico si mis coockies de sesión han sido guardadas, es decir, si me he logueado recientemente
				var loStorage = new Storage(Storage.Type.session, "login");				   
				//si no existe al menos la orden que siempre va a estar guardada, es porque se ha salido de la sesión
				if (!loStorage.get("login")){
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("loginOrdenes", {} );					
				}
			},	
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
		 *
		 * @public
		 * @param {string} sI18nKey The key
		 * @param {sap.ui.core.model.ResourceModel} oResourceModel The resource model
		 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
		 * @returns {Promise<string>} The promise
		 */
		getBundleTextByModel: function(sI18nKey, oResourceModel, aPlaceholderValues){
			return oResourceModel.getResourceBundle().then(function(oBundle){
				return oBundle.getText(sI18nKey, aPlaceholderValues);
			});
		},
		/**
		 * Recarga la página cuando se vuelve a ella al navegar en la aplicación
		 * Nota: SE DEBE IMPLEMENTAR EN EN INIT DE TODAS LAS VISTAS
		 * @param {View} ioView Vista actual
		 */
		reloadView:function(ioView){ //, ivNameView){
			this.backToLogin();
			////----se guarda el nombre de la vista en la coockie////
			//se obtiene el espacio de nombres de la vista
			var ltViewName = ioView.getView().getViewName().split('.')
			//se guarda el nombre de la vista actual en la coockie						
			ioView.getView().getViewName().split('.')
			var loStorage = new Storage(Storage.Type.session, "login");
			var loJSON = loStorage.get("login");   
			//se obtiene el nombre de la vista del espacio de nombres
			loJSON.currentView = ltViewName[ltViewName.length - 1];
			loStorage.put("login", loJSON);
			////----se guarda el nombre de la vista en la coockie////

			/////----se enlaza el método onDisplay para cuando se seleccione la vista en la barra lateral, de modo que siempre se refresque/////
			var loRouter = ioView.getOwnerComponent().getRouter();  
			//anclo al init el método onDisplay, de modo que siempe que visualice la vista va a llamar a este método         
            //loRouter.getRoute(ivNameView).attachMatched(
			loRouter.getRoute(loJSON.currentView).attachMatched(	
                ioView.onDisplay
            , ioView);

			sap.ui.getCore().getEventBus().subscribe( 
				//ivNameView,         
				loJSON.currentView,
				"onDisplay",
				ioView.onDisplay,
				this
			  );
			/////----se enlaza el método onDisplay para cuando se seleccione la vista en la barra lateral, de modo que siempre se refresque/////	
		},
		/**
		 * Método abstracto a implementarse en todas las vistas para cargar la información al volver a la vista
		*/
		 onDisplay: function(){ throw new error("Método Abstracto onDisplay"); },

		/**
		 * Se insertan los textos en la cabecera del listado, de modo que se pueda ver la información de la orden en 3 filas
		*/
		setCabecera: function(){
			this.oStorage = new Storage(Storage.Type.session, "login");
			var loJSON = this.oStorage.get("login");
			//es para evitar que pete la view en caso que se haya borrado la caché con la coockie del login, 
			if(loJSON && loJSON.cabecera){
				this.cabecera1 = this.byId("toolbar_cabecera1");
				//Se limpia la cabecera para que cuando vuelva a la vista se cargue la información respectiva de la orden nuevamente seleccionada
				this.cabecera1.destroyContent();
				this.cabecera1.addContent(new Label({text:"{i18n>orden}: "+loJSON.cabecera.orden}));
				this.cabecera1.addContent(new Label({text:"{i18n>fecha_ini}: "+loJSON.cabecera.fecha_ini}));
				this.cabecera1.addContent(new Label({text:"{i18n>fecha_lib}: "+loJSON.cabecera.fecha_lib}));
				this.cabecera2 = this.byId("toolbar_cabecera2");
				//Se limpia la cabecera para que cuando vuelva a la vista se cargue la información respectiva de la orden nuevamente seleccionada
				this.cabecera2.destroyContent();
				this.cabecera2.addContent(new Label({text:"{i18n>marca}: "+loJSON.cabecera.marca}));			
				this.cabecera2.addContent(new Label({text:"{i18n>num_lote}: "+loJSON.cabecera.num_lote}));
				this.cabecera2.addContent(new Label({text:"{i18n>a_pesar}: "+loJSON.cabecera.a_pesar}));
				this.cabecera3 = this.byId("toolbar_cabecera3");
				//Se limpia la cabecera para que cuando vuelva a la vista se cargue la información respectiva de la orden nuevamente seleccionada
				this.cabecera3.destroyContent();
				this.cabecera3.addContent(new Label({text:"{i18n>unidades_caja}: "+loJSON.cabecera.unidades_caja}));
				this.cabecera3.addContent(new Label({text:"{i18n>densidad}"+loJSON.cabecera.densidad}));
				this.cabecera3.addContent(new Label({text:"{i18n>volumen}"+loJSON.cabecera.volumen}));															
				this.cabecera3.addContent(new Label({text:"{i18n>cant_nominal}"+loJSON.cabecera.cant_nominal}));															
				this.cabecera3.addContent(new Label({text:"{i18n>fecha_caducidad}"+loJSON.cabecera.fecha_caducidad}));															
				this.cabecera3.addContent(new Label({text:"{i18n>impr_caducidad}"+loJSON.cabecera.impr_caducidad}));															
			} 
/*
			sap.ui.xmlfragment(this.getView().getId() ,"notificacionesfabrica.view.cabecera" ); 
			var lblOrden=this.byId("ordenLbl");
			lblOrden.setText("ooooooopo");*/

			//"notificacionesfabrica.controller.cabecera");

		},
		   /**
             * Shows a {@link sap.m.MessageBox} when a service call has failed.
             * Only the first error message will be display.
             * @param {string} sDetails a technical error to be displayed on request
             * @private
             */
            _showServiceError: function(_this,sMsgError) {
                var i18n = this.getView().getModel("i18n");
                if( sMsgError.response.statusCode !== "404" 
                    || (oParams.response.statusCode === 404 
                    && oParams.response.responseText.indexOf("Cannot POST") === 0)) {                                               
                    MessageBox.error(
                        jQuery.parseXML(sMsgError.response.body).querySelector("message").textContent
                        );
                }else{
                    MessageBox.error(i18n.getProperty("msgError404"));
                }
                
            },

//////////// Ayudas de búsqueda //////////////////////
			setMatchcodeDialog(iIndexJSON){
			/*	this.getModel("i18n").getResourceBundle().then(function(oBundle){
					this.this.getView().getModel().getProperty("/matchcodes");
				}.bind(this));	
				var oJsonMatchcode = new sap.ui.model.json.JSONModel("matchcode"); 
				//oJsonMatchcode.loadData("matchcode.json"); 
				this.oJsonMatchcode = oJsonMatchcode.getData("matchcodes")[0]; */
				/*var dataModel = this.getOwnerComponent().getModel("matchcode");
				this.getView().setModel(dataModel, "DataModel");*/

				
				this.oDataServiceUrlF4 = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.matchcodes.uri;
				this.oDataModelF4 = new sap.ui.model.odata.ODataModel( this.oDataServiceUrlF4, true );
			},
			onSearch: function(oEvent) {
				//this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains,  oEvent.getSource().getValue()));
				this.inputId = oEvent.getSource().getId();
				if( this.inputId.indexOf("idpeso") != -1){                   
						this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/MeinsSet" , new sap.m.StandardListItem({title: "{Msehi} - {Msehl}"}),  new sap.ui.model.Filter("Msehi", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
				}
			},
			handleTableValueHelpConfirm: function(e) 
			{
			var s = e.getParameter("selectedItem");
				if (s) {                
					if( this.inputId.indexOf("idpeso") != -1){  
						this.byId(this.inputId).setValue(s.getBindingContext().getObject().aufnr);
					}
				}
				this.oDialog.destroy();     
				this.oDialog = null;
			},
			handleTableValueHelpSearch: function(e) 
			{         
				var lv_value = e.getParameters().value;   
				if(lv_value){  
					if( this.inputId.indexOf("idpeso") != -1){                 
							this.setMatchcodeList(e, lv_value, "/MeinsSet" , new sap.m.StandardListItem({title: "{Msehi}"}),  new sap.ui.model.Filter("Msehi", sap.ui.model.FilterOperator.Contains, lv_value));
					}			
				}
			},
			setMatchcodeList: function(oEvent, value, entityName, oTableStdListTemplate, oFilterTableNo){
				//si es la primera vez que se construye 
				if(!this.inputId){
					this.inputId = oEvent.getSource().getId();
				}
				var sInputValue = value; //oEvent.getSource().getValue();
				
				var path;var oTableStdListTemplate;
				var oFilterTableNo;
				if(!this.oDialog){													
					this.oDialog = sap.ui.xmlfragment("notificacionesfabrica.view.matchcode", this);
					this.oDialog.setModel(this.oDataModelF4);
					this.setMatchcodeDialog(this.oDialog);
				}
			
				path = entityName; 
				if(this.oDialog.isBinding() ){
					this.oDialog.unbindAggregation("items");
				}
				
				this.oDialog.bindAggregation("items", {
				path: path,
				template: oTableStdListTemplate,
				filters: [oFilterTableNo]}
				);// }// abre el matchcode con el valor introducido en el input
				this.oDialog.open(sInputValue);
			}, 
//////////////////////////////////////////////////////
	});

});
