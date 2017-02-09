(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.intelligentSwap');

    ns.cancelLoginConflictSwap = false;
    ns.shouldProgressNextLoginConflictIntelligentSwap = false;

    ns.initializeIntelligentSwap = function initializeIntelligentSwap() {

        ns.setupViewModels();

        var intelligentSwapLb = new EXCHANGE.lightbox.Lightbox({
            name: 'intelligentswap',
            divSelector: '#intelligent-swap-popup',
            openButtonSelector: '#intelligent-swap-popup-open-button',
            closeButtonSelector: '#intelligent-swap-popup-close-button',
            beforeSubmit: function () {
                //determine if we should close, return false to prevent

                return true;
            },
            afterClose: function () {
                if (ns.shouldProgressNextLoginConflictIntelligentSwap) {
                    if (ns.cancelLoginConflictSwap) {
                        var intSwapArgs = ns.buildIntelligentSwapArgs();
                        app.cart.CartAPI.cancelLoginConflictIntelligentSwap(intSwapArgs, ns.closeLightbox);
                    }

                    app.cart.CartAPI.nextLoginConflictIntelligentSwap();
                }
            },
            beforeOpen: function () {
                //determine if we should open, return false to prevent
                ko.applyBindings(app.viewModels, $('#intelligent-swap-popup').get(0));
                ns.setupBindings();
                return true;
            },
            afterOpen: function () {
                ns.shouldPerformNextLoginConflictIntelligentSwap = true;
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        if (!EXCHANGE.viewModels.IntelligentSwapViewModel) {
            EXCHANGE.viewModels.IntelligentSwapViewModel = new EXCHANGE.models.IntelligentSwapViewModel();
        }
    };

    ns.setupBindings = function setupBindings() {
        $(document).on('click', '.intelligentswap-plandetails-open', function () {
            ns.shouldProgressNextLoginConflictIntelligentSwap = false;
            $.publish('EXCHANGE.lightbox.plandetails.open', this);
        });

        $(document).on('click', '#intelligentSwapConfirmButton', function () {
            ns.cancelLoginConflictSwap = false;

            var intSwapArgs = ns.buildIntelligentSwapArgs();
            if (app.viewModels.IntelligentSwapViewModel.Panels[0].Plan().planType == app.enums.PlanTypeEnum.DENTAL || app.viewModels.IntelligentSwapViewModel.Panels[0].Plan().planType == app.enums.PlanTypeEnum.VISION)
            {
                app.cart.CartAPI.addAndRemoveAncillaryPlansForIntelligentSwap(intSwapArgs, ns.closeLightbox);
            }
            else
            {
                app.cart.CartAPI.addAndRemovePlansForIntelligentSwap(intSwapArgs, ns.closeLightbox);
            }

            return false;
        });
    };

    ns.closeLightbox = function closeLightbox() {
        $.publish('EXCHANGE.lightbox.intelligentswap.close');
    };

    ns.redirectToPage = function redirectToPage(url) {
        window.location = url;
    };

    ns.buildIntelligentSwapArgs = function buildIntelligentSwapArgs() {
        var args = { OldPlanId1: null, OldPlanId2: null, NewPlanId: null };
        var panel1 = app.viewModels.IntelligentSwapViewModel.Panels[0];
        var panel2 = app.viewModels.IntelligentSwapViewModel.Panels[1];
        var panel3 = app.viewModels.IntelligentSwapViewModel.Panels[2];

        if (panel1.PanelType() == app.enums.PanelTypeEnum.OLDPLAN) {
            args.OldPlanId1 = panel1.Plan().planGuid;
        }
        if (panel2.PanelType() == app.enums.PanelTypeEnum.OLDPLAN) {
            args.OldPlanId2 = panel2.Plan().planGuid;
        }
        if (panel2.PanelType() == app.enums.PanelTypeEnum.NEWPLAN) {
            args.NewPlanId = panel2.Plan().planGuid;
        }
        if (panel3.PanelType() == app.enums.PanelTypeEnum.NEWPLAN) {
            args.NewPlanId = panel3.Plan().planGuid;
        }

        return args;
    };

} (EXCHANGE));

