(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Pre65");
    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        $('div.copyright').hide();
        $("#pre65multiplantxt").html('Disclaimer:  HRA amount represents plans administered by Aon Hewitt and could be inclusive of multiple employer contributions which could be subject to different plan rules.  Please see your specific employer(s) HRA plan details for further information');
        $('.wrapper').width("100%");
        $('.header').width("100%");
        $('.container .colmL').css("padding-top", "108px");
        $('.footer.nospace').css("padding-left", "190px");
        $('#pre65multiplantxt').css("padding-left", "190px");
        $('#pre65multiplantxt').width("970px");
        $('#modalPopLite-wrapper1').hide();
        ns.initializePage();
        ns.setupJqueryBindings();

    });

    ns.initializePage = function initializePage() {
        app.viewModels.Pre65ViewModel = EXCHANGE.models.Pre65ViewModel();
        //ko.applyBindings(EXCHANGE.viewModels, $('#pre65-individual-and-family-template').get(0));
        ko.applyBindings(EXCHANGE.viewModels, $('.pre65-individual-and-family').get(0));


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/GetPre65ViewModel",
            dataType: "json",
            success: function (viewModel) {
                app.viewModels.Pre65ViewModel.loadFromJSON(viewModel);
            }
        });

    };

    ns.setupJqueryBindings = function setupJqueryBindings() {


        $(document).on('click', '#btnPre65GetStartedTop', function () {

            app.ButtonSpinner = $('#divPre65GetStartedTop').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

            if (EXCHANGE.user.UserSession.IsLoggedIn()) {
                redirectUrl = "/my-account.aspx";
            }
            else {
                //"/first-time-user.aspx?navigatorid=" + EXCHANGE.viewModels.ActivateAccountViewModel.lead().NavigatorsId;
                redirectUrl = "/first-time-user.aspx";
            }
            app.functions.redirectToRelativeUrlFromSiteBase(redirectUrl);
            return false;
        });
        $(document).on('click', '#btnPre65GetStartedBottom', function () {
            if (EXCHANGE.user.UserSession.IsLoggedIn()) {
                redirectUrl = "/my-account.aspx";
            }
            else {
                //"/first-time-user.aspx?navigatorid=" + EXCHANGE.viewModels.ActivateAccountViewModel.lead().NavigatorsId;
                redirectUrl = "/first-time-user.aspx";
            }
            app.functions.redirectToRelativeUrlFromSiteBase(redirectUrl);
            return false;
        });
    };


} (EXCHANGE));
