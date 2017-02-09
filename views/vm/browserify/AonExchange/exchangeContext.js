;(function (app) {
    //"use strict";
	var ns = app.namespace('EXCHANGE.classes');

	ns.ExchangeContext = function ExchangeContext() {
		if (!(this instanceof ExchangeContext)) {
			return new ExchangeContext();
		}
	    var self = this;

	    self.tabOrder = ko.observableArray([]);
	    self.currencySymbol = ko.observable("");
	    self.medicareMinAge = ko.observable(65);
	    self.mailOrderPharmacy = ko.observable();

		return self;
	};
})(EXCHANGE);
