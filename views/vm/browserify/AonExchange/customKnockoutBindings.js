﻿(function (app, global) {
    var ns = app.namespace("EXCHANGE.customKnockoutBindings");

    ko.bindingHandlers.cssClass = {
        update: function (element, valueAccessor) {
            if (element['__ko__previousClassValue__']) {
                $(element).removeClass(element['__ko__previousClassValue__']);
            }
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).addClass(value);
            element['__ko__previousClassValue__'] = value;
        }
    };


} (EXCHANGE));

