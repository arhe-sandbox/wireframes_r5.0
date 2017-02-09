(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.pharmacySearch');

    ns.wasPharmacyBackClicked = false;


    ns.changeLocationOpen = function () {
        ns.showSearch();
    };

    ns.changeLocationClose = function () {
        ns.hideSearch();
        ns.getPharmacies();
    };

    //Function to save Refill Preference for each drug under cusomer profile
    ns.RefillPreference = function RefillPreference() {
        var pharmacyType = EXCHANGE.viewModels.EnterDosageViewModel.pharmacy_radio();
        switch (pharmacyType) {
            case "retailPharmacy":
                pharmacyType = 0;
                break;
            case "aggregateRetailPharmacy":
                pharmacyType = 1;
                break;
            case "mailPharmacy":
                pharmacyType = 2;
                break;
        }
        var userDrug = {
            PharmacyType: pharmacyType
        };
        userDrug = JSON.stringify(userDrug);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Drug/UpdateRefillPreference",
            dataType: "json",
            data: userDrug,
            success: function (jsonString) {
                //alert('success');
            },
            error: function (data) {
            }
        });
    };

    //Show Search
    ns.showSearch = function () {

        $popup = $("#pharmacysearchpopup"),
			$list = $popup.find(".pharmacy-list"),
			$pharmmap = $popup.find(".pharmacy-map"),
			$mylist = $popup.find(".my-pharmacies"),
			$listheight = $list.height() - 127,
			$pharmmapheight = $pharmmap.height() - 127,
			$mylistheight = $mylist.height() - 127;
        $popup.find(".inner-content").find(".searchform").removeClass("hidethis").prev("p").find("a.show-search").addClass("hidethis");
        //  $list.css("height", $listheight + "px");
        //  $pharmmap.css("height", $pharmmapheight + "px");
        // $mylist.css("height", $mylistheight + "px");
    };


    //Hide Search
    ns.hideSearch = function () {

        var $popup = $("#pharmacysearchpopup"),
			$list = $popup.find(".pharmacy-list"),
			$pharmmap = $popup.find(".pharmacy-map"),
			$mylist = $popup.find(".my-pharmacies"),
			$listheight = $list.height() + 127,
			$pharmmapheight = $pharmmap.height() + 127,
			$mylistheight = $mylist.height() + 127;
        $popup.find(".inner-content").find(".searchform").addClass("hidethis").prev("p").find("a").removeClass("hidethis");
        //  $list.css("height", $listheight + "px");
        // $pharmmap.css("height", $pharmmapheight + "px");
        // $mylist.css("height", $mylistheight + "px");
    };

    ns.initializePharmacySearch = function initializePharmacySearch() {

        ns.setupLightboxes();
        ns.setupViewModels();
        //Style dropdown
        $('.dropdownsmall').dropkick();

        $(document).on('click', '#btnPharmacySearchDone', function () {

            if (EXCHANGE.decisionSupport.lightboxOpenFlag) {
                app.viewModels.DecisionSupportViewModel.wasPharmacyLightboxOpen = false;

                if (app.lightbox.currentLightbox && app.lightbox.currentLightbox.parent && app.lightbox.currentLightbox.parent.parent) {
                    var previousLightboxName = app.lightbox.currentLightbox.parent.parent.name;
                }
                EXCHANGE.decisionSupport.lightboxOpenFlag = false;
                ns.RefillPreference();
                $.publish('EXCHANGE.lightbox.pharmacysearch.done');

                if (previousLightboxName) {
                    $.publish("EXCHANGE.lightbox." + previousLightboxName + ".open");
                }
            } else {
                $.publish('EXCHANGE.lightbox.pharmacysearch.back');
            }
        });

        $(document).on('click', '#btnPharmacySearchZipDone', function () {
            EXCHANGE.pharmacySearch.changeLocationClose();
        });

        //for some reason, hitting enter in this text field is causing the page to refresh / post to itself.
        //this (somewhat hacky) event will prevent that.
        $(document).on('keypress', '#txtPharmacySearchZip', function (event) {
            if (event.keyCode == app.constants.enterKeyCode) {
                event.preventDefault();
            }
        });

        $(document).on('click', '#btnPharmacySearchBack', function () {
            ns.wasPharmacyBackClicked = true;
        });
    };



    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.PharmacySearchViewModel) {
            app.viewModels.PharmacySearchViewModel = new app.models.PharmacySearchViewModel();
        }
    };

    ns.getPharmacies = function getPharmacies() {
        ns.lightboxOpenFlag = true;

        var args = { Zip: app.viewModels.PharmacySearchViewModel.zip() };
        var waitpopup = $('#pharmacysearchpopup').WaitPopup({ hide: true, fullWindow: false });
        ns.hideSearch();
        args = JSON.stringify(args);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/PharmacySearchViewModel",
            data: args,
            dataType: "json",
            success: function (result) {
                waitpopup.Close();
                app.viewModels.PharmacySearchViewModel.loadFromJSON(result);
                $('.pharmacy-radio').customInput();
            },
            error: function () {
                //alert('Data Retrieval Error');
            }
        });
    };


    ns.addPharmacy = function addPharmacy(pharmacy, event) {

        var args = JSON.stringify(pharmacy);
        app.ButtonSpinner = $(event.target).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/AddPharmacy",
            data: args,
            dataType: "json",
            success: function (pharmacyViewModel) {
                app.ButtonSpinner.Stop();

                var myPharms = [];
                for (var j = 0; j < pharmacyViewModel.Pharmacies.length; j++) {
                    myPharms.push(pharmacyViewModel.Pharmacies[j]);
                }
                app.viewModels.PharmacySearchViewModel.myPharmacies(myPharms);
                app.user.UserSession.UserPharmacies.loadFromJSON(pharmacyViewModel.Pharmacies, pharmacyViewModel.SelectedPharmacy);
            },
            error: function () {
                app.ButtonSpinner.Stop();
                //alert('Data Retrieval Error');              

            }
        });

    };


    ns.removePharmacy = function removePharmacy(pharmacy, event) {

        var args = JSON.stringify(pharmacy);
        app.ButtonSpinner = $(event.target).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/RemovePharmacy",
            data: args,
            dataType: "json",
            success: function (pharmacyViewModel) {
                app.ButtonSpinner.Stop();

                var myPharms = [];
                for (var j = 0; j < pharmacyViewModel.Pharmacies.length; j++) {
                    myPharms.push(pharmacyViewModel.Pharmacies[j]);
                }
                app.viewModels.PharmacySearchViewModel.myPharmacies(myPharms);
                app.user.UserSession.UserPharmacies.loadFromJSON(pharmacyViewModel.Pharmacies, pharmacyViewModel.SelectedPharmacy);
            },
            error: function () {
                app.ButtonSpinner.Stop();
                //alert('Data Retrieval Error');               
            }
        });

    };



    ns.IsAddPharmacyVisible = function IsAddPharmacyVisible(pharmacy) {

        if (app.viewModels.PharmacySearchViewModel.myPharmacies().length >= 1)
            return false;

        for (i = 0; i < app.viewModels.PharmacySearchViewModel.myPharmacies().length; i++) {
            if (app.viewModels.PharmacySearchViewModel.myPharmacies()[i].Id == pharmacy.Id)
                return false;
        }

        return true;

    };

    ns.adjustLightBox = function adjustLightBox() {
        $.publish('lightbox-refresh-pharmacysearch');

        var winW = $(window).width();
        var winH = $(window).height();
        //console.log($('#pharmacysearchpopup').height());

        //var screenH = screen.height;
        //var screenW = screen.width;
        var actualH = $('#pharmacysearchpopup').parent().outerHeight();

        if (winH < actualH) {
            var form_h = $(window).height() - $('.pophead').height() - $('.buttonbar').height(); //- $('.buttonbar').height()*1.5;
            $('#pharmacysearchpopup .left-col').height(form_h);
            $('#pharmacysearchpopup .right-col').height(form_h);
            var popupMarginH = $('#pharmacysearchpopup').parent().outerHeight() - $('#pharmacysearchpopup').parent().height();
            var popH = form_h - (popupMarginH * 2);

            $('#pharmacySearchContent').height(popH);  //check this ??
        }

        var objW = $('#pharmacysearchpopup').parent().outerWidth();
        var objH = $('#pharmacysearchpopup').parent().outerHeight();
        var left = (winW / 2) - (objW / 2);
        //var top = (winH / 2) - (objH / 2) + EXCHANGE.functions.getScrollTop();
        var top = EXCHANGE.functions.getScrollTop();
        if (left < 0) {
            left = 0;
            $('html, body').css('overflowY', 'auto');
            $('.confirmationmodal').css('overflowY', 'auto');
        }
        $('#pharmacysearchpopup').parent().css({ 'left': left + "px", 'top': top });
        $('#pharmacysearchpopup').parent().fadeIn('slow');

    };


    ns.setupLightboxes = function setupLightboxes() {
        if (!(ns.lightboxesSetup)) {
            ns.lightboxesSetup = true;
            var pharLb = new EXCHANGE.lightbox.Lightbox({
                name: 'pharmacysearch',
                divSelector: '#pharmacysearchpopup',
                openButtonSelector: '#pharmacysearch-open-button',
                closeButtonSelector: '#pharmacysearch-close-button',
                beforeOpen: function () {
                    app.viewModels.DecisionSupportViewModel.wasPharmacyLightboxOpen = true;
                    //  $('#pharmacysearchpopup').show();
                    ns.wasPharmacyBackClicked = false;
                    return true;
                },
                beforeSubmit: function () {

                    return true;
                },
                afterOpen: function () {
                    EXCHANGE.pharmacySearch.getPharmacies();
                    ko.applyBindings(app.viewModels.PharmacySearchViewModel, $('#pharmacysearchpopup').get(0));



                },
                afterClose: function () {
                    if (!ns.wasPharmacyBackClicked && !EXCHANGE.user.UserSession.ShowRxPreloadLb()) {
                        if (app.viewModels.SearchResultsViewModel) {
                            app.coverageCost.getCoverageCostsInPriorityOrder();
                        }
                        ns.wasPharmacyBackClicked = false;
                    }
                },

                showWaitPopup: false
            });
        }
    };
})(EXCHANGE);







ko.bindingHandlers.bingMap = {
    _map: {},

    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {



        _map = new EXCHANGE.BingMap(element, $("input[id*=hdBMKey]").val());



    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {


        var availPharms = ko.utils.unwrapObservable(valueAccessor());
        var _pins = [];

        for (i = 0; i < availPharms.length; i++) {

            var location = new Microsoft.Maps.Location(availPharms[i].Latitude, availPharms[i].Longitude);

            var _loc = {

                Latitude: availPharms[i].Latitude,
                Longitude: availPharms[i].Longitude,
                Name: availPharms[i].Name,
                Address1: availPharms[i].Address1,
                Address2: availPharms[i].Address2,
                City: availPharms[i].City,
                State: availPharms[i].State,
                Zip: availPharms[i].Zip,
                Phone: availPharms[i].Phone,
                DisplayNo: i + 1
            };

            _pins.push(_loc);

        }



        _map.addPins(_pins);


    }
};



