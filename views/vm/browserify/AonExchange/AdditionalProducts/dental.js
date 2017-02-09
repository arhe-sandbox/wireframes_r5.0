(function (app, global) {
    //"use strict";

    var ns = app.namespace('EXCHANGE.dental');

    ns.displayOrHide = function displayOrHide() {

        if (EXCHANGE.user.UserSession.UserProfile.primaryConnection().Code == "att") {

            $(".group").hide();
            $(".attgroup").show();

        } else {

            $(".attgroup").hide();
            $(".group").show();
        }

    }


    ns.dentalHelpNumber = function dentalHelpNumber() {

        $("#HelpPhone").text(EXCHANGE.viewModels.LoginHeaderViewModel.phoneNumberHtml());

    }


} (EXCHANGE, this));
	
