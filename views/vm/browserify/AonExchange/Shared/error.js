(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.error');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeError();
        ns.setupJqueryBindings();
    });


    ns.initializeError = function initializeError() {
        EXCHANGE.viewModels.ErrorViewModel = EXCHANGE.models.ErrorViewModel();

        var errorLb = new EXCHANGE.lightbox.Lightbox({
            name: 'error',
            divSelector: '#error-popup',
            openButtonSelector: '#error-open-button',
            closeButtonSelector: '#error-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#error-popup').get(0));
                return true;
            },
            afterOpen: function () {
                ns.errorPopupLoad();
            },
            afterClose: function () {
                EXCHANGE.viewModels.ErrorViewModel.hasBeenLoaded = false;
            }

        });

    };



    ns.errorPopupLoad = function errorPopupLoad() {
        EXCHANGE.viewModels.ErrorViewModel.hasBeenLoaded = true;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PageSetup/ErrorClientViewModel",
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.ErrorViewModel.loadFromJSON(data);
            },
            failure: function (data) {
                alert('failure loading lightbox');
            }
        });

    };

    ns.setupJqueryBindings = function setupJqueryBindings() {

        $('.errorheader').live('click', ns.expandCollapse);

    };

    ns.expandCollapse = function expandCollapse() {
        $errorheader = $(this);
        //getting the next element
        $errorcontent = $errorheader.next();
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $errorcontent.slideToggle(500, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
            $errorheader.text(function () {
                //change text based on condition
                return $errorcontent.is(":visible") ? "Collapse" : "Exception More Details";
            });
        });
    };


} (EXCHANGE, this));

