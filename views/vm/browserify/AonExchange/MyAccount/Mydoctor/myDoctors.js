(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.myDoctors');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeMyDoctors();
        ns.wireupJqueryEvents();
    });


    ns.initializeMyDoctors = function initializeMyDoctors() {
        app.viewModels.myDoctorsViewModel = new app.models.myDoctorsViewModel();

        var myDoctorsLb = new EXCHANGE.lightbox.Lightbox({
            name: 'myDoctors',
            divSelector: '#myDoctors-popup',
            openButtonSelector: '#myDoctors-open-button',
            closeButtonSelector: '#myDoctors-close-button',
            beforeOpen: function () {

                return true;
            },
            afterOpen: function () {
              
                $.publish("EXCHANGE.lightbox.myDoctors.loaded");
                $.publish("lightbox-refresh-myDoctors");
            }
        });

    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#searchArea').keyup(function () {
            var $th = $(this);
            $th.val($th.val().replace(/[^0-9]/g, function (str) { alert('You typed " ' + str + ' ".\n\nPlease use only numbers.'); return ''; }));
        });
    }

    ns.myDoctorsModelLoad = function myDoctorsModelLoad(data) {
        //alert(data);
        app.viewModels.loadFromJSON(data);
    };

    $(function () {

        $("#myText").autocomplete({
            source: function (request, response) {

                var name = $("#myText").val();
                var zip = $("#searchArea").val(); //"92708";
                var zipRadiusMiles = $("#radiusInMiles").val();

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/Account/GetProvidersUsingPartialKey",
                    dataType: "json", // text, html, xml
                    data: JSON.stringify({ 'name': name, 'zip': zip, 'zipRadiusMiles': zipRadiusMiles }),
                    success: function (data) {
                        response(data);

                    }
                })
            },
            select: function (event, ui) {

                $(this).val(ui.item.value);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/Account/GetProviders",
                    dataType: "json", // text, html, xml
                    data: JSON.stringify({ 'name': ui.item.value, 'zip': $("#searchArea").val(), 'zipRadiusMiles': $("#radiusInMiles").val() }),
                    success: function (data) {
                        //app.viewModels.myDoctorsViewModel = app.viewModels.myDoctorsViewModel.loadFromJSON(data);
                        ns.myDoctorsModelLoad(data);
                    }
                })
            },
            minLength: 3
        });
    });

} (EXCHANGE));

