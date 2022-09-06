sap.ui.define([	
	'sap/ui/core/mvc/Controller',
 
], function (Controller, ODataModel) {
	"use strict";
	return Controller.extend("notificacionesfabrica.controller.matchcode", {
		
		onInit: function (evt) {
            this.oDataServiceUrl = this.getOwnerComponent().getManifestEntry("notificacionesfabrica").dataSources.matchcodes.uri;
			this.oDataModel = new sap.ui.model.odata.ODataModel( this.oDataServiceUrl, true );
            sap.ui.getCore().setModel(this.oDataModel);
		}
     
	});
});