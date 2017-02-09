(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.functions');

    function random4HexDigits() {
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    }

    ns.guid = function guid() {
        return (
            random4HexDigits() + random4HexDigits() + "-" +
            random4HexDigits() + "-" +
            random4HexDigits() + "-" +
            random4HexDigits() + "-" +
            random4HexDigits() + random4HexDigits() + random4HexDigits()
        );
    };

    ns.getKeyValueFromWindowLocation = function getKeyValueFromWindowLocation(key) {
        return ns.getKeyValueFromUrl(key, window.location.search);
    };

    //Get value from querystring
    ns.getKeyValueFromUrl = function getKeyValueFromUrl(key, url) {
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + key + "=([^&#]*)";
        var regex = new RegExp(regexS, 'i');
        var results = regex.exec(url);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    // Do not index strings like this: number[i]. This will break IE7. Use number.substr(i, 1) instead.
    ns.formatPhoneNumber = function formatPhoneNumber(number) {
        var removeFromNumberList = "()-. ";
        var outNumber = "";
        var outNumberFormat = "({0}) {1}-{2}";
        for (var i = 0; i < number.length; i++) {
            if (removeFromNumberList.indexOf(number[i]) === -1) {
                outNumber += number.substr(i, 1);
            }
        }

        if (outNumber.length != 10) {
            return "";
        }

        return outNumberFormat.format(outNumber.substring(0, 3), outNumber.substring(3, 6), outNumber.substring(6));
    };

    // Do not index strings like this: number[i]. This will break IE7. Use number.substr(i, 1) instead.
    ns.formatPhoneNumberWithSpace = function formatPhoneNumberWithSpace(number) {
        var removeFromNumberList = "()-. ";
        var outNumber = "";
        var outNumberFormat = "({0}) {1} {2}";
        for (var i = 0; i < number.length; i++) {
            if (removeFromNumberList.indexOf(number[i]) === -1) {
                outNumber += number.substr(i, 1);
            }
        }

        if (outNumber.length != 10) {
            return "";
        }

        return outNumberFormat.format(outNumber.substring(0, 3), outNumber.substring(3, 6), outNumber.substring(6));
    };

    ns.redirectToRelativeUrlFromSiteBase = function redirectToRelativeUrlFromSiteBase(relativeUrl) {
        if (relativeUrl.charAt(0) == "/") {
            relativeUrl = relativeUrl.substr(1, relativeUrl.length);
        }

        window.location = window.location.protocol + "//" + window.location.host + "/" + relativeUrl;
    };

    ns.setDayListForMonthAndYear = function setListForNumberOfDaysInMonth(monthVal, year, dayOptionsList) {
        // Note: dayOptionsList is a reference to the "DayOptions" ko observable from the dateOfBirth view model. 

        var month = parseInt(monthVal);
        var max = 31;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                max = 31;
                break;
            case 2:
                max = 29;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                max = 30;
                break;
        }
        // we could calculate max via some moment.js calculation instead of the above, but the above is good enough for now

        // At that time, we could also correctly determine whether Feb should have 28 or 29 days,
        // based on the year value sent as an argument to this function. This will involve 
        // (1) including moment.js in this page, and (2) attaching an event handler on the 
        // year dropdown on each page containing the date-of-birth fields. 

        dayOptionsList.removeAll();
        for (var i = 1; i <= max; i++) {
            dayOptionsList.push(i);
        }
    };

    ns.refreshCostEstimates = function refreshCostEstimates() {
        app.user.UserSession.UserProfile.doneMedQuestions(false);
        app.user.UserSession.UserProfile.doneMedQuestions(true);
    };

    ns.getClientCode = function getClientCode() {
        var clientCodeElem = $('#clientCode');
        var clientCodeValue = "";
        if (clientCodeElem.length > 0) {
            clientCodeValue = clientCodeElem.val();
        }
        return clientCodeValue;
    };

    ns.getPartnerCode = function getPartnerCode() {
        var partnerCodeElem = $('#partnerCode');
        var partnerCodeValue = "";
        if (partnerCodeElem.length > 0) {
            partnerCodeValue = partnerCodeElem.val();
        }
        return partnerCodeValue;
    };

    // Use this with caution!! In most cases, it's better to detect the feature you
    // are actually hoping to use. The below function is for situations where it is
    // a behavior hack you need to implement, rather than a feature you need to use
    // or work around, and thus you have no alternative but to check if you've got
    // an older IE. 
    ns.isIE7OrLower = function isIE7OrLower() {
        // Only IE supports document.all. In the IE family, only IE8 and
        // above support document.querySelector. 
        return (document.all && !document.querySelector);
    };

    // Use this with caution!! In most cases, it's better to detect the feature you
    // are actually hoping to use. The below function is for situations where it is
    // a behavior hack you need to implement, rather than a feature you need to use
    // or work around, and thus you have no alternative but to check if you've got
    // an older IE. 
    ns.isIE8OrLower = function isIE8OrLower() {
        if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
            return true;
        }
        return false;
    };

    ns.mapSig = function mapSig(Sig) {
        if (Sig == EXCHANGE.enums.SigTyp.Voice) return EXCHANGE.enums.SigName.Voice;
        if (Sig == EXCHANGE.enums.SigTyp.Wet) return EXCHANGE.enums.SigName.Wet;
    };
} (EXCHANGE));
