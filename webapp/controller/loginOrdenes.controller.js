    sap.ui.define([        
        './BaseController',
        'sap/ui/model/json/JSONModel',
        'sap/ui/Device',
        './../model/formatter',
        "./../utils/Validator",
        'sap/ui/core/MessageType',
        'sap/ui/model/odata/ODataModel',
        'sap/m/MessageBox',
        "sap/ui/util/Storage",
        "sap/m/List",
        "sap/m/ObjectListItem"    
    ], function ( BaseController, JSONModel, Device, formatter, Validator, MessageType, ODataModel, MessageBox, Storage, List, ObjectListItem) {
        "use strict";
        return BaseController.extend("notificacionesfabrica.controller.loginOrdenes", {
            formatter: formatter,
    
            onInit: function () {
                var oViewModel = new JSONModel({
                    isPhone : Device.system.phone
                });
                this.setModel(oViewModel, "view");
                Device.media.attachHandler(function (oDevice) {
                    this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
                }.bind(this));
    

                this.urlLogin = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.datosOrden.uri;
    
                this.oDataServiceUrl = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.datosOrden.uri;
                this.oDataModel = new ODataModel( this.oDataServiceUrl, true );
                this.getView().setModel(this.oDataModel);

           //instancia para manejo de coockies
                this.oStorage = new Storage(Storage.Type.session, "login");
                var loJSON = {};
                loJSON.token = this.oDataModel.getSecurityToken() ;
                this.oStorage.put("login", loJSON);
                
                //Registro  el método onDisplay para que se ejecute cada vez que se visualice la página (attachDisplay)
                var loRouter = this.getOwnerComponent().getRouter();
                var loTarget = loRouter.getTarget("loginOrdenes");
                loTarget.attachDisplay(this.onDisplay, this);

                this.hideVisibilitySideMenu();
                
            },
            onDisplay : function(){
                this.hideVisibilitySideMenu();                

                // se verifica si existe previamente un inicio de sesión, si es así realiza un update para que se actualice el estado de la sesión a finalizado y se borra coockie 
                this.logout();
            },
            //se oculta el menú lateral de modo que no se pueda navegar y se tenga que loguear el usuario
            hideVisibilitySideMenu: function(){
                //se oculta el menú lateral de modo que no se pueda navegar y se tenga que loguear el usuario
                sap.ui.getCore().getEventBus().publish( "menu",         
                                                        "setVisibilitySideMenu",
                                                        {   buttonsToAvoid: [] ,
                                                            visible: false ,
                                                            logoutBtn: false
                                                        }
                );

            },
            logout: function(){
                this.oStorage = new Storage(Storage.Type.session, "login");
			    var loJSON = this.oStorage.get("login");   
                var params = {};                    
                    params.Pernrs = '';
                var _this = this;
                //Si previamente se ha logueado y se está llamando para desloguearse             
                if(loJSON && loJSON.cabecera ){
                    //Se toman los operarios registrados para luego concatenarlos y enviarlos al odata
                    for (var lvPernr of loJSON.pernr){                                                         
                        params.Pernrs  += lvPernr +',';
                    }  
                    //si existe la sesión se llama la API para desloguearse
                    OData.request  ({  
                        requestUri:      _this.urlLogin+'logoutPernrsSet',  
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
                                requestUri: _this.urlLogin+'logoutPernrsSet',
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
                                _this.oStorage.clear();
                            },  
                            function (err)  
                            {                                 
                                _this._showServiceError(_this,err);                             
                            })
        
                        });   
                }
                


            },
            /*onPress: function(oEvent){
                console.log("presionado");
                //se guarda el id seleccionado
                this.oStorage.put("login", "{ Aufnr:"+ _this.byId("Aufnr").getValue()+"}");

                var oRouter = sap.ui.core.routing.Router.getRouter("loginOrdenes");                        
                oRouter.navTo("login",oContext,false);


            },*/
            onSelectionChange: function(oEvent){
                var loJSON=this.oStorage.get("login");
                
                //Obtiene el ufnr que se encontraría en el título del item seleccionado
                var lv_aufnr = oEvent.getParameters("selected").listItem.getProperty("title");
                 //se guarda el id seleccionado
                 loJSON.Aufnr = lv_aufnr;
                 this.oStorage.put(loJSON);

                 this.getCabecera(lv_aufnr);
            },
            getCabecera:function(aufnr){
                var loJSON=this.oStorage.get("login");
               // this.urlLogin = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.datosOrden.uri;
                var _this = this;                  
                    /*var params = {};
                    params.Aufnr    = _this.byId("idorden").getValue();*/
                    
                //se consulta el webservcie para así obtener el token
                OData.request  ({  
                    requestUri:      _this.urlLogin+'infoOrdenSet' + "('"+ aufnr +"')",  
                    method: "GET",  
                            
                    headers: {   "X-Requested-With": "XMLHttpRequest",                        
                            "Content-Type": "application/atom+xml", 
                            "DataServiceVersion": "2.0",                      
                            //se pasa el parámetro fetch para así obtener el token CSRF
                            "X-CSRF-Token": "Fetch"   },  
                    },  
                    //se guardan los datos obtenidos del ODATA en la cabecera
                    function (data, response) {               
                        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                            format: "yMMMd"
                        });         
                        var loJSON=_this.oStorage.get("login");
                        loJSON.cabecera = { };
                                                
                        loJSON.cabecera.orden = data.Aufnr;
                        loJSON.cabecera.fecha_ini = oDateFormat.format(data.Bgndt);
                        loJSON.cabecera.fecha_lib = oDateFormat.format(data.RELDT);
                        loJSON.cabecera.marca  = data.MARCA;
                        loJSON.cabecera.num_lote = data.CHARG;
                        loJSON.cabecera.a_pesar = data.APESA;
                        loJSON.cabecera.unidades_caja = data.UNXCA;
                        loJSON.cabecera.densidad = data.DENSI;
                        loJSON.cabecera.volumen = data.VOLUM;
                        loJSON.cabecera.cant_nominal = data.CNTNM;
                        loJSON.cabecera.fecha_caducidad = oDateFormat.format(data.VFDAT);
                        loJSON.cabecera.impr_caducidad = data.SSVFD;
                        _this.oStorage.put("login",loJSON);
                         //se cambia el nombre por el ID Orden en el botón desplegable de la barra del lado superior derecho
                         sap.ui.getCore().getEventBus().publish("login",         
                         "setUID",
                         {sUID:data.Aufnr });

                         //se redirige a la siguiente pantalla para seleccionar el usuario del listado
                        //var oRouter = sap.ui.core.routing.Router.getRouter("loginOrdenes");                        
                        var oRouter = _this.getRouter("loginOrdenes");                        
                        oRouter.navTo("login");
                    },
                    function (error)  
                    {                                 
                        _this._showServiceError(_this,error);                             
                    })

            }
            
        });
    });