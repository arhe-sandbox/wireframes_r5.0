// This javascript file contains the main EXCHANGE object that is the root object for all
// methods, object, and properties in the system.  This avoids any conflicts by keeping the custom
// code out of the root namespace.

function Exchange_Ajax(customOptions) {
    var defaultOptions = { type: 'POST', contentType: "application/json; charset=utf-8", dataType: "json", url: "", data: {}, success: function (data) { } };
    var options = $.extend({}, defaultOptions, customOptions);

    var request = $.ajax({
        type: options.type,
        contentType: options.contentType,
        url: options.url,
        data: options.data,
        dataType: options.dataType,
        success: options.success
    });

    return request;
}


/**
* The main Exchanges JavaScript Application object
*
* @module EXCHANGE
*/

var EXCHANGE = EXCHANGE || {};


/**
* Creates namespaces of any depth.
*
* @namespace EXCHANGE
* @param  {String} input Delimited string containing the namespace to create
* @return {String} The last object in the namespace delimited string passed in
*/
EXCHANGE.namespace = function (ns_string) {
    //"use strict";
    var parts = ns_string.split('.'),
        parent = EXCHANGE,
        i;

    // strip redundant leading global
    if (parts[0] == "EXCHANGE") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        // create a property if it does not exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;

};

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
    });
};

if (!('find' in Array.prototype)) {
    Array.prototype.find = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i], i, this)) {
                return this[i];
            }
        }
        return void 0;
    };
}


if (!('contains' in String.prototype))
    String.prototype.contains = function (str, startIndex) { return -1 !== this.indexOf(str, startIndex); };


$.ajaxSetup({
    beforeSend: function (xhr) {
        var token = $('[name=__RequestVerificationToken]').val();

        xhr.setRequestHeader('__RequestVerificationToken', token);
    },
    statusCode: {
        500: function (xhr) {
            if (EXCHANGE.ButtonSpinner) {
                EXCHANGE.ButtonSpinner.Stop();
            }
            var json = '';
            if (xhr.responseText.startsWith("<") == false) {
                json = $.parseJSON(xhr.responseText);
            }
            //alert('Data retrieval error');
            EXCHANGE.viewModels.ErrorViewModel.loadFromAjax(json);
            $.publish("EXCHANGE.lightbox.error.open");
        },
        401: function () {
            if (EXCHANGE.viewModels.ErrorViewModel != undefined && EXCHANGE.viewModels.ErrorViewModel.hasBeenLoaded == true) {
                return;
            }
            if (window.location.pathname !== "/home.aspx" && window.location.pathname !== "/" && window.location.pathname !== "/application-overview.aspx" && !window.location.pathname.contains("find-plans")) {

                EXCHANGE.dst = window.location.pathname;

                window.location = "/" + "?lightboxname=login&dst=" + EXCHANGE.dst;
            }
        }
    }
});
//ie 7 and 8 need this
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
          this[from] === elt)
                return from;
        }
        return -1;
    };
}

// ie fix for console
if (typeof console === "undefined") {
    window.console = {
        log: function () { }
    };
}

// -------------------------------------------------------------------------------------------------
// Dictionary class
// -------------------------------------------------------------------------------------------------
EXCHANGE.Dictionary = function () {
    this.Items = [];

    // ---------------------------------------------------------------------------------------------
    // Add item to dictionary
    //
    // params: key - key of the item to add
    //         value - value of the item to add
    // ---------------------------------------------------------------------------------------------
    this.Add = function (key, value) {
        if (!this.GetItem(key)) {
            this.Items.push({ Key: key, Value: value });
        }
    };

    // ---------------------------------------------------------------------------------------------
    // Remove item from dictionary
    //
    // params: key - key of the item to remove
    // ---------------------------------------------------------------------------------------------
    this.Remove = function (key) {
        if (this.GetItem(key)) {
            var Index = this.GetIndex(key);
            this.Items.splice(Index, 1);
        }
    };

    // ---------------------------------------------------------------------------------------------
    // Retrieve item count
    // params: (none)
    // ---------------------------------------------------------------------------------------------
    this.Count = function () {
        return this.Items.length;
    };

    // ---------------------------------------------------------------------------------------------
    // Get value by item key
    //
    // params: key - key of the item
    // ---------------------------------------------------------------------------------------------
    this.GetValue = function (key) {
        for (var i = 0; i < this.Items.length; i++) {
            if (this.Items[i].Key == key) {
                return this.Items[i].Value;
            }
        }
        return null;
    };

    // ---------------------------------------------------------------------------------------------
    // Get item by key
    //
    // params: key - key of the item to get
    // ---------------------------------------------------------------------------------------------
    this.GetItem = function (key) {
        for (var i = 0; i < this.Items.length; i++) {
            if (this.Items[i].Key == key) {
                return this.Items[i];
            }
        }
        return null;
    };

    // ---------------------------------------------------------------------------------------------
    // Get index by key
    //
    // params: key - key of the item
    // ---------------------------------------------------------------------------------------------
    this.GetIndex = function (key) {
        for (var i = 0; i < this.Items.length; i++) {
            if (this.Items[i].Key == key) {
                return i;
            }
        }
        return -1;
    };

};

(function (app, global) {

    // ---------------------------------------------------------------------------------------------
    // Wait Popup call manager static class. Aggregates running calls for wait popups so that the 
    // wait popup can close only when the last registered call completes.
    // ---------------------------------------------------------------------------------------------
    EXCHANGE.WaitPopupObserver = function WaitPopupObserver() {
        if (!(this instanceof WaitPopupObserver)) {
            return new WaitPopupObserver();
        }
        var self = this;

        if (!self.CallList) {
            self.CallList = new EXCHANGE.Dictionary();
        }

        // -----------------------------------------------------------------------------------------
        // Add item to call list and subscribe to event based on key
        //
        // params: key - key of the call of which to subcribe
        // -----------------------------------------------------------------------------------------
        WaitPopupObserver.prototype.Subscribe = function Subscribe(key) {
            var protoSelf = this;

            // Add the call to the list
            protoSelf.CallList.Add(key, key);

            // Subscribe to an event based on the key. When it is published, the call will be 
            // removed from the list and the wait popup will be closed if there are no more active
            // calls.
            $.subscribe(key, function () {
                protoSelf.CallList.Remove(key);

                if (protoSelf.CallList.Count() <= 0) {
                    if (EXCHANGE.WaitPopup) {
                        EXCHANGE.WaitPopup.Close();
                    }
                }
            });

            return protoSelf;
        };

        // -----------------------------------------------------------------------------------------
        // Publish event based on key
        //
        // params: key - key of the call to publish
        // -----------------------------------------------------------------------------------------
        WaitPopupObserver.prototype.Publish = function Publish(key) {
            var protoSelf = this;

            $.publish(key);

            return protoSelf;
        };

    } ();

} (EXCHANGE, this));

// -------------------------------------------------------------------------------------------------
// Adjust the wait popup masking panel according to the current document body size
// params: (none)
// -------------------------------------------------------------------------------------------------
EXCHANGE.AdjustWaitPopupMask = function () {
    if (EXCHANGE.WaitPopup && EXCHANGE.WaitPopup.fullWindow) {
        var bodyW = $(document.body).outerWidth();
        var bodyH = $(document.body).outerHeight();
        var currW = $('#waitPopup-maskwrapper' + EXCHANGE.WaitPopup.PopID).outerWidth();
        var currH = $('#waitPopup-maskwrapper' + EXCHANGE.WaitPopup.PopID).outerHeight();
        var newW = Math.max(bodyW, currW);
        var newH = Math.max(bodyH, currH);
        var footerH = $('.footer li.column-text.group').outerHeight();
        var adjustH = 120;

        $('#waitPopup-maskwrapper' + EXCHANGE.WaitPopup.PopID).css({
            'width': newW + 'px'
        , 'height': (newH + footerH + adjustH) + 'px'
        });
    }

    if (EXCHANGE.ButtonSpinner) {
        var bodyW = $(document.body).outerWidth();
        var bodyH = $(document.body).outerHeight();
        var currW = $('#spinner-maskwrapper' + EXCHANGE.ButtonSpinner.SpinID).outerWidth();
        var currH = $('#spinner-maskwrapper' + EXCHANGE.ButtonSpinner.SpinID).outerHeight();
        var newW = Math.max(bodyW, currW);
        var newH = Math.max(bodyH, currH);
        var footerH = $('.footer li.column-text.group').outerHeight();
        var adjustH = 120;

        $('#spinner-maskwrapper' + EXCHANGE.ButtonSpinner.SpinID).css({
            'width': newW + 'px'
        , 'height': (newH + footerH + adjustH) + 'px'
        });
    }
};

// -------------------------------------------------------------------------------------------------
// Set the the wait popup masking panel to auto-adjust when the document body size adjusts.
// params: (none)
// -------------------------------------------------------------------------------------------------
EXCHANGE.AutoAdjustWaitPopupMask = function () {
    $(document.body).mutate('height width', function (element, info) {
        EXCHANGE.AdjustWaitPopupMask();
    });
};

// Global variable initialization
EXCHANGE.WaitPopup = null;
EXCHANGE.ButtonSpinner = null;
