(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.AncSearchHeader");
    app.namespace('EXCHANGE.viewModels');

    customerNumber = '';
    gdateOfBirth = '';

    $(document).ready(function () {
        $('#pre65multiplantxt').remove();
        $('#AncMultiplantxt').show();
        $('div.copyright').each(function () { $(this).find('p:not(:first)').remove() });
        $('div.copyright').find('br').remove();
        $("#externallinkpopup").remove();
        ns.initializePage();
        ns.setupJqueryBindings();
    });

    ns.initializePage = function initializePage() {
        app.viewModels.AncSearchHeaderViewModel = EXCHANGE.models.AncSearchHeaderViewModel();
        //ko.applyBindings(EXCHANGE.viewModels, $('#tabs-2').get(0));
        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));
        ns.AncSearchHeaderViewModelLoad();

    };
    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }


    ns.checkDependentSpouse = function checkDependentSpouse(dateOfBirth) {

        gdateOfBirth = dateOfBirth;

        $.publish("EXCHANGE.lightbox.dependentSpouse.open");



    };

    ns.checkDependentAttestation = function checkDependentAttestation() {

        //var ageInMonths = ns.calculateAgeInMonths(this.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
        //var ageInYears = ns.calculateAgeInYears(this.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);




        var ageInMonths = ns.calculateAgeInMonths(gdateOfBirth);
        var ageInYears = ns.calculateAgeInYears(gdateOfBirth);

        for (var i = 0; i < EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans().length; i++) {

            switch (EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].spouseAgeRule()) {
                //"CoverageMonthEnd"                                           
                case 0:
                    if (ageInMonths < EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].spouseMinAge() * 12 || ageInMonths > EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].spouseMaxAge() * 12) {
                        $.publish("EXCHANGE.lightbox.dependentAttestation.open");
                        return false;
                    }
                    break;

                //"CoverageYearEnd"                                           
                case 1:
                    if (ageInYears < EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].spouseMinAge() || ageInYears > EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].spouseMaxAge()) {
                        $.publish("EXCHANGE.lightbox.dependentAttestation.open");
                        return false;
                    }
                    break;

                default:
                    break;
            }
        }
    };

    ns.checkDependentChild = function checkDependentChild(dateOfBirth) {

        var ageInMonths = ns.calculateAgeInMonths(dateOfBirth);
        var ageInYears = ns.calculateAgeInYears(dateOfBirth);

        for (var i = 0; i < EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans().length; i++) {

            switch (EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].dependentAgeRule()) {

                case 0:
                    if (ageInMonths < EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].dependentMinAge() * 12 || ageInMonths > EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].dependentMaxAge() * 12) {
                        $.publish("EXCHANGE.lightbox.dependentAttestation.open");
                        return false;
                    }
                    break;

                case 1:
                    if (ageInYears < EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].dependentMinAge() || ageInYears > EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[i].dependentMaxAge()) {
                        $.publish("EXCHANGE.lightbox.dependentAttestation.open");
                        return false;
                    }
                    break;

                default:
                    break;
            }
        }
    };

    ns.calculateAgeInYears = function calculateAgeInYears(dateString) {
        var dob = new Date(dateString);
        var today = new Date();
        return today.getFullYear() - dob.getFullYear();
    }

    ns.calculateAgeInMonths = function calculateAgeInMonths(dateString) {

        //var now = new Date();
        var dob = new Date(dateString.substring(6, 10),
                     dateString.substring(0, 2) - 1,
                     dateString.substring(3, 5)
                     );
        var edateSplit = app.user.UserSession.UserProfile.coverageBeginsDate.split("T")[0].split("-");
        var effectiveDate = new Date(edateSplit[0], edateSplit[1] - 1, edateSplit[2]);
        var age = effectiveDate.getFullYear() - dob.getFullYear();
        var m = effectiveDate.getMonth() - dob.getMonth();

        return age = (age * 12) + m;

        //        var yearNow = now.getFullYear();
        //        var monthNow = now.getMonth();

        //        //date must be mm/dd/yyyy
        //        var dob = new Date(dateString.substring(6, 10),
        //                     dateString.substring(0, 2) - 1,
        //                     dateString.substring(3, 5)
        //                     );

        //        var yearDob = dob.getFullYear();
        //        var monthDob = dob.getMonth();

        //        yearAge = yearNow - yearDob;

        //        return (yearAge * 12 + monthDob);
    }

    ns.checkDependentEligibility = function checkDependentEligibility() {
        var flag = false;
        customerNumber = this.value;

        if (this.checked) {

            var relationType = "";
            var dob = "";
            var effectiveDate = "";

            if (this.parentElement.nextElementSibling != null) {
                if (this.parentElement.nextElementSibling.nextElementSibling != null) {
                    relationType = this.parentElement.nextElementSibling.nextElementSibling.innerHTML;
                    dob = this.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
                }
                else {
                    relationType = this.parentElement.parentElement.nextElementSibling.nextElementSibling.innerHTML;
                    dob = this.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
                }
            }
            else {
                relationType = this.parentElement.parentElement.nextElementSibling.nextElementSibling.innerHTML;
                dob = this.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
            }

            //if check box checked true then make IsVisionCoverage or IsDentalCoverage true.
            if (EXCHANGE.user.UserSession.UserProfile.family() != null) {
                for (var i = 0; i < EXCHANGE.user.UserSession.UserProfile.family().length; i++) {

                    var custNo = EXCHANGE.user.UserSession.UserProfile.family()[i].CustomerNumber;

                    if (custNo == undefined)
                        custNo = EXCHANGE.user.UserSession.UserProfile.family()[i]()[0].CustomerNumber;

                    if (customerNumber === custNo) {

                        if (EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[0].planType == EXCHANGE.enums.PlanTypeEnum.DENTAL)
                            EXCHANGE.user.UserSession.UserProfile.family()[i].IsDentalCoverage = true;

                        if (EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[0].planType == EXCHANGE.enums.PlanTypeEnum.VISION)
                            EXCHANGE.user.UserSession.UserProfile.family()[i].IsVisionCoverage = true;

                        //return false;
                    }
                }
            }
            //end

            switch (relationType) {
                case "Spouse":
                    ns.checkDependentSpouse(dob);
                    break;
                case "Child":
                    ns.checkDependentChild(dob);
                    break;
            }
        }
        else {

            //if check box NOT checked then make IsVisionCoverage or IsDentalCoverage FALSE.
            if (EXCHANGE.user.UserSession.UserProfile.family() != null) {
                for (var i = 0; i < EXCHANGE.user.UserSession.UserProfile.family().length; i++) {

                    var custNo = EXCHANGE.user.UserSession.UserProfile.family()[i].CustomerNumber;

                    if (customerNumber === custNo) {
                        EXCHANGE.user.UserSession.UserProfile.family()[i].Attestation = 0; // default

                        if (EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[0].planType == EXCHANGE.enums.PlanTypeEnum.DENTAL)
                            EXCHANGE.user.UserSession.UserProfile.family()[i].IsDentalCoverage = false;

                        if (EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans()[0].planType == EXCHANGE.enums.PlanTypeEnum.VISION)
                            EXCHANGE.user.UserSession.UserProfile.family()[i].IsVisionCoverage = false;

                        //return;
                    }
                }
            }
            //end
        }

    };

    ns.updateYesAttestion = function updateYesAttestion() {

        if (EXCHANGE.user.UserSession.UserProfile.family() != null) {
            for (var i = 0; i < EXCHANGE.user.UserSession.UserProfile.family().length; i++) {

                var custNo = EXCHANGE.user.UserSession.UserProfile.family()[i].CustomerNumber;

                if (customerNumber === custNo) {

                    EXCHANGE.user.UserSession.UserProfile.family()[i].Attestation = 1;

                    if (EXCHANGE.user.UserSession.UserProfile.family()[i].IsDentalCoverage) {
                        EXCHANGE.user.UserSession.UserProfile.family()[i].IsDependentDentalEligible = true; // this flag used for showing *
                        EXCHANGE.viewModels.AncSearchHeaderViewModel.Family()[i].IsDependentDentalEligible(true);
                    }
                    else if (EXCHANGE.user.UserSession.UserProfile.family()[i].IsVisionCoverage) {
                        EXCHANGE.user.UserSession.UserProfile.family()[i].IsDependentVisionEligible = true; // this flag used for showing *
                        EXCHANGE.viewModels.AncSearchHeaderViewModel.Family()[i].IsDependentVisionEligible(true);
                    }
                    return false;
                }
            }
        }

    };

    ns.updateNoAttestion = function updateNoAttestion() {

        if (EXCHANGE.user.UserSession.UserProfile.family() != null) {
            for (var i = 0; i < EXCHANGE.user.UserSession.UserProfile.family().length; i++) {

                var custNo = EXCHANGE.user.UserSession.UserProfile.family()[i].CustomerNumber;

                if (customerNumber === custNo) {

                    EXCHANGE.user.UserSession.UserProfile.family()[i].Attestation = 2;

                    if (EXCHANGE.user.UserSession.UserProfile.family()[i].IsDentalCoverage) {
                        EXCHANGE.user.UserSession.UserProfile.family()[i].IsDependentDentalEligible = false;
                        EXCHANGE.viewModels.AncSearchHeaderViewModel.Family()[i].IsDependentDentalEligible(false);
                    }

                    else if (EXCHANGE.user.UserSession.UserProfile.family()[i].IsVisionCoverage) {
                        EXCHANGE.user.UserSession.UserProfile.family()[i].IsDependentVisionEligible = false;
                        EXCHANGE.viewModels.AncSearchHeaderViewModel.Family()[i].IsDependentVisionEligible(false);
                    }

                    return false;
                }
            }
        }

    };




    ns.AncSearchHeaderViewModelLoad = function AncSearchHeaderViewModelLoad() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/AncillarySearchHeaderViewModel",
            dataType: "json",
            success: function (data) {
                app.viewModels.AncSearchHeaderViewModel = app.viewModels.AncSearchHeaderViewModel.loadFromJSON(data);
            },
            error: function (data) {
            }
        });
    };


    ns.getConnectionTypeName = function getConnectionTypeName(conType) {
        switch (conType) {
            case 0:
                return "Primary";
            case 1:
                return "Spouse";
            case 2:
                return "Child";
        }
        return "";
    };
    ns.setupJqueryBindings = function setupJqueryBindings() {

        $('#ancilary-update-profile').live('click', ns.updateMembers);
        $('#ancVisionChkbox').live('click', ns.checkDependentEligibility);
        $('#ancDentalChkbox').live('click', ns.checkDependentEligibility);

        $('#btndependentAttestationYes').live('click', ns.updateYesAttestion);
        $('#btndependentAttestationNo').live('click', ns.updateNoAttestion);

    };

    ns.findAttestationByCustomerNumber = function findAttestationByCustomerNumber(CustomerNumber) {
        var arr = [];
        arr = EXCHANGE.user.UserSession.UserProfile.family();

        var found = false;
        var index;
        $.each(arr, function (i) {
            if (this.CustomerNumber === CustomerNumber) {
                found = true;
                index = i;
                return false;
            }
        });
        if (found)
            return index;
    };

    ns.updateMembers = function updateMembers() {

        var MemberIds = [];
        var type;

        if (location.href.indexOf("search-dental-results") > -1) {

            type = "dental";
            $('#anc-covered-checkbox-submain').find('#ancDentalChkbox').each(function () {

                var index = ns.findAttestationByCustomerNumber($(this).val());

                if (index != null) {

                    EXCHANGE.user.UserSession.UserProfile.family()[index].IsDentalCoverage = false;

                    if ($(this).is(":checked")) {

                        EXCHANGE.user.UserSession.UserProfile.family()[index].IsDentalCoverage = true;

                        MemberIds.push({
                            CustomerId: $(this).val(),
                            Attestation: EXCHANGE.user.UserSession.UserProfile.family()[index].Attestation
                        });

                    }
                    else {

                        MemberIds.push({
                            CustomerId: "",
                            Attestation: 0
                        });
                    }

                }

            });
        }
        else if (location.href.indexOf("search-vision-results") > -1) {

            type = "vision";
            $('#anc-covered-checkbox-submain').find('#ancVisionChkbox').each(function () {

                var index = ns.findAttestationByCustomerNumber($(this).val());

                if (index != null) {

                    EXCHANGE.user.UserSession.UserProfile.family()[index].IsVisionCoverage = false;

                    if ($(this).is(":checked")) {

                        EXCHANGE.user.UserSession.UserProfile.family()[index].IsVisionCoverage = true;

                        MemberIds.push({
                            CustomerId: $(this).val(),
                            Attestation: EXCHANGE.user.UserSession.UserProfile.family()[index].Attestation
                        });

                    }
                    else {

                        MemberIds.push({
                            CustomerId: "",
                            Attestation: 0
                        });
                    }

                }

            });
        }


        if (MemberIds.length > 0) {
            var args = {
                CustomerIds: MemberIds,
                PlanType: type
            };

            args = JSON.stringify(args);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Ancillary/AncillaryUpdateCoverage",
                data: args,
                dataType: "json",
                success: function (data) {
                    if (type == "dental") {
                        app.functions.redirectToRelativeUrlFromSiteBase("search-dental-results.aspx");

                    }
                    else if (type == "vision") {
                        app.functions.redirectToRelativeUrlFromSiteBase("search-vision-results.aspx");

                    }
                },
                error: function (data) {

                }
            });
        }

    }

} (EXCHANGE));

