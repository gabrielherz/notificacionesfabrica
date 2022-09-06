sap.ui.define([
	"sap/base/strings/formatMessage"
], function (formatMessage) {
	"use strict";

	return {
		formatMessage: formatMessage,

		/**
		 * Determines the path of the image depending if its a phone or not the smaller or larger image version is loaded
		 *
		 * @public
		 * @param {boolean} bIsPhone the value to be checked
		 * @param {string} sImagePath The path of the image
		 * @returns {string} path to image
		 */
		srcImageValue : function (bIsPhone, sImagePath) {
			if (bIsPhone) {
				sImagePath += "_small";
			}
			return sImagePath + ".jpg";
		},
		/**
		 * Indica si la cantidad a fabricar es inferir o superior a la cantidad planificada
		 *
		 * @public
		 * */
		cantidadAFabricar : function (value1,value2) {
			try {
				value1 = parseFloat(value1);
				value2 = parseFloat(value2);
				if (value1 < 0) {
					return "None";
				} else if (value1= value2) {
					return "Success";
				//} else if (value1 < value2 || value1 > value2) {
				//	return "Error";
				} else {
					return "Warning";
				}
			} catch (err) {
				return "None";
			}
		}
	};
});