    sap.ui.define([
        './BaseController',
        'sap/ui/model/json/JSONModel',
        'sap/ui/Device',
        './../model/formatter',
        "./../utils/Validator",
        'sap/ui/core/MessageType',
        'sap/ui/model/odata/ODataModel',
        'sap/m/MessageBox',
        "sap/ui/util/Storage"
    
    
    ], function (BaseController, JSONModel, Device, formatter, Validator, MessageType, ODataModel, MessageBox, Storage) {
        "use strict";
        return BaseController.extend("notificacionesfabrica.controller.login", {
            formatter: formatter,
    
            onInit: function () {
                //permite ejecutar onDisplay al volver a visualizar la vista
                this.reloadView(this, "login");

                var oViewModel = new JSONModel({
                    isPhone : Device.system.phone
                });
                this.setModel(oViewModel, "view");
                Device.media.attachHandler(function (oDevice) {
                    this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
                }.bind(this));
    

    
                this.oDataServiceUrl = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.operarios.uri;
                this.oDataModel = new ODataModel( this.oDataServiceUrl, true );
                this.getView().setModel(this.oDataModel);
                //sap.ui.getCore().setModel(this.oDataModel);

                var listLogin = this.byId("idListLogin");
                
                //listLogin.setModel(this.oDataModel);


       
           //instancia para manejo de coockies
                this.oStorage = new Storage(Storage.Type.session, "login");
               
                this.setCabecera();

                /*
                this.oJsonViews = new sap.ui.model.json.JSONModel(); 
                this.oJsonViews.loadData("./model/sideContent.json",false); */
            },
            onDisplay:function(){
                 //se oculta el menú lateral de modo que no se pueda navegar y se tenga que loguear el usuario
                 sap.ui.getCore().getEventBus().publish( "menu",         
                 "setVisibilitySideMenu",
                 {   buttonsToAvoid: ["loginOrdenes"] ,
                     visible: false ,
                     logoutBtn: false
                 }
);
            },
            onSelectionChange: function (oEvent) {
                var lv_selected_element = oEvent.getParameters("selected").listItem;
                var loJSON = this.oStorage.get("login");
                
                if(lv_selected_element.getProperty("selected")){
                    //verifico si existe el atributo pernr donde contiene todos operarios seleccionados
                    if(loJSON && loJSON.pernr){
                        loJSON.pernr.push(lv_selected_element.getProperty("title"));
                        this.oStorage.put("login",loJSON);
                        //"this.oStorage.put("login", '{"pernr": ["'+loJSON.pernr.title+lv_selected_element.getProperty("title")+'"]}' );
                    //Si no existe ningún pernr porque no se ha logueado nadie, entonces creo     
                    }else{                        
                        loJSON.pernr = [lv_selected_element.getProperty("title")];
                        this.oStorage.put("login", loJSON);
                        //this.oStorage.put("login", '{"pernr": ["'+lv_selected_element.getProperty("title")+'"]}' );
                    }                   
                }                
                
            },
            onSearch: function(oEvent) 
            {
                //this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains,  oEvent.getSource().getValue()));
                this.inputId = oEvent.getSource().getId();
                if( this.inputId.indexOf("idorden") != -1){                   
                        this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
                }
                if( this.inputId.indexOf("idpuestotrabajo") != -1){                   
                    this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/CramnSet" , new sap.m.StandardListItem({title: "{Arbpl}", description: "{Werks}{Ktext}" }),  new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
                } 
                if( this.inputId.indexOf("uid") != -1){                   
                    this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/EwapernrSet" , new sap.m.StandardListItem({title: "{Pernr}", description: "{Vorna}" }),  new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
                } 
                /*
                var sInputValue = oEvent.getSource().getValue();
                this.inputId = oEvent.getSource().getId();
                var path;var oTableStdListTemplate;
                var oFilterTableNo;
                this.oDialog = sap.ui.xmlfragment("projectpruebaodata.view.matchcode", this);
                path = "/AufnrSet";
                oTableStdListTemplate = new sap.m.StandardListItem({title: "{aufnr}"});// //create a filter for the binding
                oFilterTableNo = new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains, sInputValue);
                
                this.oDialog.unbindAggregation("items");
                this.oDialog.bindAggregation("items", {
                path: path,
                template: oTableStdListTemplate,
                filters: [oFilterTableNo]}
                );// }// open value help dialog filtered by the input value
                this.oDialog.open(sInputValue);
                */
            },
            handleTableValueHelpConfirm: function(e) 
            {
               var s = e.getParameter("selectedItem");
                if (s) {                
                    if( this.inputId.indexOf("idorden") != -1){  
                        this.byId(this.inputId).setValue(s.getBindingContext().getObject().aufnr);
                    }
                    if( this.inputId.indexOf("idpuestotrabajo") != -1){                                     
                        this.byId(this.inputId).setValue(s.getBindingContext().getObject().Arbpl);
                    }
                    if( this.inputId.indexOf("uid") != -1){                   
                        this.byId(this.inputId).setValue(s.getBindingContext().getObject().Pernr);                  
                    } 
               //this.readRefresh(e);
                }
                this.oDialog.destroy();     
                this.oDialog = null;
            },
            handleTableValueHelpSearch: function(e) 
            {         
                var lv_value = e.getParameters().value;   
                if(lv_value){  
                    if( this.inputId.indexOf("idorden") != -1){                 
                            this.setMatchcodeList(e, lv_value, "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains, lv_value));
                    }
                    if( this.inputId.indexOf("idpuestotrabajo") != -1){                                     
                            this.setMatchcodeList(e, lv_value, "/CramnSet" , new sap.m.StandardListItem({title: "{Arbpl}", description: "{Werks}{Ktext}" }),  new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, lv_value));                    
                    }     
                    if( this.inputId.indexOf("uid") != -1){                                     
                        this.setMatchcodeList(e, lv_value, "/EwapernrSet" , new sap.m.StandardListItem({title: "{Pernr}", description: "{Vorna}" }),  new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, lv_value));
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
                   // || !this.oDialog.isBinding() ){            
                    this.oDialog = sap.ui.xmlfragment("notificacionesfabrica.view.matchcode", this);
                }
               
                path = entityName; //"/AufnrSet";     
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
            onLoginSubmit(oEvent){
                
                var loJSON = this.oStorage.get("login");

       
      //      if (!this.oDataModelLogin){
                var urlLogin = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.login.uri;			
                var _this = this
                  
                    var params = {};
                    params.Aufnr    = params.Aufnr = loJSON.cabecera.orden ;
                    params.Pernrs = '';
                for (var lvPernr of loJSON.pernr){                                                         
                    params.Pernrs  += lvPernr +',';
                        
                    
                }  
                    
                    //params.Password = _this.byId("password").getValue();
                    
   
                //se consulta el webservcie para así obtener el token
                OData.request  ({  
                    requestUri:      urlLogin+'loginPernrsSet',  
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
                            requestUri: urlLogin+'loginPernrsSet',
                            method: "POST",
                            headers: {   "X-Requested-With": "XMLHttpRequest",                        
                                        "Content-Type": "application/atom+xml", 
                                        "DataServiceVersion": "2.0",  
                                        "Accept": "application/atom+xml,application/atomsvc+xml,application/xml", 
                                        "X-CSRF-Token": header_xcsrf_token    
                                    },  
                            data:  params                                    
                        },
                        function (data, response) 
                        {   
                            
                            //var oRouter = sap.ui.core.routing.Router.getRouter("login");      
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);                  
                            oRouter.navTo("fabricacion");
                            //oRouter.navTo("fabricacion",oContext,false);
                            /*// se muestra el botón de logout
                            sap.ui.getCore().getEventBus().publish( "login",         
                                                                    "setVisibilityBtnLogout",
                                                                    {   
                                                                        visible: true 
                                                                    }
                                                                    
                            );*/
                            _this.showSideMenu();
                            
                        },  
                        function (err)  
                        {                                 
                            _this._showServiceError(_this,err);                             
                        })
    
                    });   
                                    //}
                
            
            },
            showSideMenu: function(){
                sap.ui.getCore().getEventBus().publish( "menu",         
                                                        "setVisibilitySideMenu",
                                                        {   buttonsToAvoid: ["login"] ,
                                                            visible: true ,
                                                            logoutBtn: true
                                                        }
                    );
            },

            //Deja en estado inicial todas las ventanas de los módulos a los cuales se les ha ido seleccionando
            destruirViews(){
                /*var loJsonViews = new sap.ui.model.json.JSONModel(); 
                loJsonViews.loadData("sideContent.json",false); */
                
                    for( var loViewItem of this.oJsonViews.getData().navigation){
                        //this.getView(loViewItem.key).destroy();
                        /*sap.ui.view({
                            id: id,
                            viewName: loView.getProperty("key"),
                            type: sap.ui.core.mvc.ViewType.XML
                        }).destroy();*/
                    };                
            },
    
        /**
             * Shows a {@link sap.m.MessageBox} when a service call has failed.
             * Only the first error message will be display.
             * @param {string} sDetails a technical error to be displayed on request
             * @private
             */
          /*  _showServiceError: function(_this,sMsgError) {
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
                
            },*/
    
         
            
        });
    });