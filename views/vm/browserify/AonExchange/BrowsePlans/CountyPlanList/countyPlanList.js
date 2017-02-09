;
(function(app) {
    var ns = app.namespace("EXCHANGE.countyPlanList");
    app.namespace("EXCHANGE.viewModels");
    ns.countyId = "";
    ns.planType = 0;
    
    $(document).ready(function() {
        ns.initializeCountyPlanList();
    });

    ns.initializeCountyPlanList = function initializeCountyPlanList() {
        ns.setupViewModels();
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.CountyPlanListViewModel = EXCHANGE.models.CountyPlanListViewModel();
        app.viewModels.PlanSharedResourceStrings = EXCHANGE.models.PlanSharedResourceStrings();
        ns.fetchValuesFromHiddenFields();

        ko.applyBindings(app.viewModels, $('.county-plan-list-page').get(0));

        var countyListArgs = {
            CountyId: $('#CountyIdHiddenField').val(),
            PlanType: $('#PlanTypeHiddenField').val()
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/BrowsePlans/CountyPlanListViewModel",
            data: JSON.stringify(countyListArgs),
            dataType: "json",
            success: function (serverPageViewModels) {
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverPageViewModels.PlanSharedResourceStrings);
                app.viewModels.CountyPlanListViewModel.loadFromJSON(serverPageViewModels.CountyPlanListViewModel);
                ns.loadPlansFromJson(serverPageViewModels.PlanModels);
                ns.setupSmartHover();
            },
            error: function (data) {
            }
        });
    };

    ns.loadPlansFromJson = function loadPlansFromJson(plans) {
        $.each(plans, function(index, plan) {
//            var planModel = new EXCHANGE.plans.PlanModel(plan);
//            var planVm = new app.models.PlanViewModel(0);
//            planVm = planVm.loadFromPlan(planModel);

             var planVm = new EXCHANGE.models.PlanSearchResultsViewModel(plan.PlanType);
             planVm = planVm.loadFromPlanDomainEntity(plan);


            app.viewModels.CountyPlanListViewModel.allPlans.push(planVm);
        });
    };

    ns.showAll = function showAll() {
        app.viewModels.CountyPlanListViewModel.showAll(true);
    };

    ns.fetchValuesFromHiddenFields = function() {
        ns.countyId = $('#CountyIdHiddenField').val();
        ns.planType = $('#PlanTypeHiddenField').val();

        app.viewModels.CountyPlanListViewModel.CountyName($('#CountyNameHiddenField').val());
        app.viewModels.CountyPlanListViewModel.StateAbbreviation($('#StateAbbreviationHiddenField').val());
    };

    ns.spacesToDashes = function(insurerName) {
        var outString = "";
        if (!insurerName) {
            return outString;
        }
        for (var i = 0; i < insurerName.length; i++) {
            var currentChar = insurerName.charAt(i);
            if (currentChar == " ") {
                outString += "-";
            } else {
                outString += currentChar;
            }
        }

        return outString;
    };
    ns.showtip = function showtip() {
        if ($(this).hasClass("rating")) {
            $(this).addClass('ratinghover');
        } else if ($(this).hasClass("covericon")) {
            $(this).addClass('covericonhover');
        } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("show-details")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("compare-side")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("med-covered")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("total-cost")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("moreoption-wrap")) {
            $(this).addClass('show-menu');
        } else {
            $(this).addClass('logosinfo');
        }
    };

    ns.hidetip = function hidetip() {
        if ($(this).hasClass("rating")) {
            $(this).removeClass('ratinghover');
        } else if ($(this).hasClass("covericon")) {
            $(this).removeClass('covericonhover');
        } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
            $(this).removeClass('show-tip');
        } else if ($(this).hasClass("show-details")) {
            $(this).removeClass('show-tip');
        } else if ($(this).hasClass("compare-side")) {
            $(this).removeClass('show-tip');
        } else if ($(this).hasClass("med-covered")) {
            $(this).removeClass('show-tip');
        } else if ($(this).hasClass("total-cost")) {
            $(this).removeClass('show-tip');
        } else if ($(this).hasClass("moreoption-wrap")) {
            $(this).removeClass('show-menu');
        } else {
            $(this).removeClass('logosinfo');
        }
    };

    ns.showtip2 = function showtip2() {
        $(this).parent().addClass("show-tip");
    };

    ns.hidetip2 = function hidetip2() {
        $(this).parent().removeClass("show-tip");
    };

    var config = {
        sensitivity: 4,
        interval: 250,
        over: ns.showtip,
        out: ns.hidetip
    };

    var config2 = {
        sensitivity: 4,
        interval: 250,
        over: ns.showtip2,
        out: ns.hidetip2
    };


    ns.setupSmartHover = function setupSmartHover() {
        $("div.providerinfo").hover(function () {
            $(this).addClass('providerhover');
        }, function () {
            $(this).removeClass("providerhover");
        });

        $("div.providerinfo div.providerlogo").smartHover(config);
        $("div.providerinfo div.providerdetail h3").smartHover(config);
        $("div.providerinfo .price").smartHover(config);
        $("div.providerinfo div.rating").smartHover(config);
        $("div.providerinfo a.covericon").smartHover(config);

        $("a.add-to-cart").smartHover(config);
        $(".addtocompare").smartHover(config);
        $(".compare-side").smartHover(config);
        $(".pricebar li a").smartHover(config2);
        $("a.med-covered").smartHover(config2);
        $("a.find-doc").smartHover(config2);
        $(".moreoption-wrap").smartHover(config);
        //$(".total-cost a").smartHover(config2);
        $("div.total-cost").smartHover(config);
    };

}(EXCHANGE));