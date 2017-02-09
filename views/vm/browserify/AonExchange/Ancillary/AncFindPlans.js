(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.ancFindPlans');


    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeAncFindPlans();
    });


    ns.initializeAncFindPlans = function initializeAncFindPlans() {
        EXCHANGE.viewModels.AncFindPlansViewModel = EXCHANGE.models.AncFindPlansViewModel();

        var ancillaryLb = new EXCHANGE.lightbox.Lightbox({
            name: 'ancfindplans',
            divSelector: '#ancfindplans',
            openButtonSelector: '#ancfindplans-open-button',
            closeButtonSelector: '#ancfindplans-close-button',
            beforeOpen: function () {
                try {
                    ko.applyBindings(EXCHANGE.viewModels.FindPlansViewModel, $('#ancfindplans').get(0));
                } catch (e) {
                }
                return true;
            },
            afterOpen: function () {

                if (EXCHANGE.findPlans) {
                    EXCHANGE.findPlans.finishedUpdatingFindPlansViewModel();

                    //$('input').customInput();
                    //$('.genderselect input').customInput();
                    $('input[name=isGenderRadioGroup]').customInput();
                }
                ns.ancfindplansPopupLoad();
                ns.wireupJqueryEvents();
            },
            afterClose: function () {
                location.reload();
            },
            showWaitPopup: true
        });

    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {

        $('#seePlansButton').live('click', function () {
            if (EXCHANGE.findPlans) {
                EXCHANGE.findPlans.seePlansClick();
                $('#ancfindplans').hide();
            }
        });

        $('#findPlansSearchForm').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_month div.dk_options a', function (e) {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#year').val();
            var dayOptions = app.viewModels.FindPlansViewModel.dateOfBirth.DayOptions;
            app.functions.dateDropDownUpdate(chosenMonth, chosenYear, dayOptions);
        });

        if (EXCHANGE.findPlans) {
            EXCHANGE.findPlans.getCountiesForNewZip();
        }
        $('#county').css('width', 'auto');
        $('#county').css('z-index', '101');
        $('#county').css('position', 'relative');
        $('.main').css('margin-top', '15px');
    };

    ns.ancfindplansPopupLoad = function ancfindplansPopupLoad() {
        if (!EXCHANGE.viewModels.AncFindPlansViewModel.hasBeenLoaded) {

            var args = {
                UserZip: "",
                UserPhone: ""
            };

            args = JSON.stringify(args);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/FindPlan/FindPlansClientViewModel",
                data: args,
                dataType: "json",
                success: function (data) {
                    /*
                    var serverViewModel = data;
                    EXCHANGE.viewModels.AncFindPlansViewModel.loadFromJSON(serverViewModel.AncillaryPopupViewModel);
                    */
                    app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.loadFromJSON(data.CallUsPopupViewModel);
                    //ns.checkForNoPlansFound();
                    //validation step
                    app.viewModels.FindPlansViewModel = app.viewModels.FindPlansViewModel.loadFromJSON(data.FindPlansViewModel);
                    ns.setupFindPlansLB();
                    if (EXCHANGE.findPlans) {
                        EXCHANGE.findPlans.finishedUpdatingFindPlansViewModel();
                        //$('input').customInput();
                        //$('.genderselect input').customInput();
                    }
                    EXCHANGE.viewModels.AncFindPlansViewModel.hasBeenLoaded = true;
                    app.functions.addMonthOptionsSubscription(app.viewModels.FindPlansViewModel.dateOfBirth, 'month', true);
                    $('#findPlansSearchForm').find('.selectfield').dropkick();
                    EXCHANGE.placeholder.applyPlaceholder();

                    $('#dk_container_coverageBeginsSelectList').bind('click', function () {
                        if ($.browser.msie && (parseInt($.browser.version, 10) === 7 || document.documentMode == 7)) {
                            $('.dk_options_inner').css('z-index', '100');
                            $('.dk_options_inner').css('position', 'relative');
                            $('#coverageBeginsDiv').css('z-index', '100');
                            $('#coverageBeginsDiv').css('position', 'relative');
                            $('#dob').css('z-index', '10');
                            $('#dob').css('position', 'relative');
                            $('#county').css('width', 'auto');
                            $('#county').css('z-index', '101');
                            $('#county').css('position', 'relative');
                        }
                    });
                    $.publish("EXCHANGE.lightbox.ancfindplans.loaded");
                },
                failure: function (data) {
                    alert('failure loading lightbox');
                }
            });
        }
        else {
            $.publish("EXCHANGE.lightbox.ancfindplans.loaded");
        }
    };

    ns.setupFindPlansLB = function setupFindPlansLB() {
        app.viewModels.FindPlansViewModel.IsAncillary(true);
        if (location.href.indexOf("dental") > -1) {
            app.viewModels.FindPlansViewModel.currentAncSearch("dental");
        } else if (location.href.indexOf("vision") > -1) {
            app.viewModels.FindPlansViewModel.currentAncSearch("vision");
        }
        app.viewModels.FindPlansViewModel.isDisabled_radio(false);
        app.viewModels.FindPlansViewModel.isKidneyFailure_radio(false);
        app.viewModels.FindPlansViewModel.isTobaccoUser_radio(false);
    };

} (EXCHANGE, this));

