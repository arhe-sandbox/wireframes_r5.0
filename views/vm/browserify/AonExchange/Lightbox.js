(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.lightbox');

    ns.Lightbox = function Lightbox(params) {
        if (!(this instanceof Lightbox)) {
            return new Lightbox(params);
        }

        var self = this;

        // Name and Id are used to close via lightbox manager.
        self.name = params && params.name !== undefined ? params.name : '';
        self.id = params && params.id !== undefined ? params.id : app.functions.guid();

        // The selector that .modalPopLight will be called on.
        self.divSelector = params && params.divSelector !== undefined ? params.divSelector : '';

        self.openButtonSelector = params && params.openButtonSelector !== undefined ? params.openButtonSelector : '';
        self.closeButtonSelector = params && params.closeButtonSelector !== undefined ? params.closeButtonSelector : '';

        // Logic to determine if the lightbox should open. If it returns false, it doesn't open.
        self.beforeOpen = params && params.beforeOpen !== undefined ? params.beforeOpen : function (clickedItem) { return true; };

        // Load data
        self.afterOpen = params && params.afterOpen !== undefined ? params.afterOpen : function (clickedItem) { };

        // Logic to determine if the lightbox should close. If it returns false, it doesn't close. Possibly error checking, etc.ange t
        self.beforeSubmit = params && params.beforeSubmit !== undefined ? params.beforeSubmit : function (clickedItem) { return true; };

        // Save data, apply sorts, what have you. Only run the function once.
        self.hasAfterCloseRan = false;
        var afterClose = params && params.afterClose !== undefined ? params.afterClose : function (clickedItem) { };
        self.afterClose = function (clickitem) {
            if (!self.hasAfterCloseRan) {
                self.hasAfterCloseRan = true;
                afterClose(clickitem);
            }
        };


        self.hasAfterExitRun = false;
        var afterExit = params && params.afterExit !== undefined ? params.afterExit : function (clickedItem) { };
        self.afterExit = function (clickitem) {
            if (!self.hasAfterExitRan) {
                self.hasAfterExitRan = true;
                afterExit(clickitem);
            }
        };
        self.parent = null;

        self.clickedItem = null;

        self.alwaysPerformAfterClose = params && params.alwaysPerformAfterClose !== undefined ? params.alwaysPerformAfterClose : false;

        self.alwaysPerformAfterExit = params && params.alwaysPerformAfterExit !== undefined ? params.alwaysPerformAfterExit : false;
        // Wait popup
        self.showWaitPopup = params && params.showWaitPopup != undefined ? params.showWaitPopup : false;
        self.waitPopup = null;

        // Called after the lightbox contents is loaded
        self.loaded = function () {
            if (self.waitPopup) {
                self.waitPopup.Close();
                self.waitPopup = null;
            }
        };

        $.subscribe("EXCHANGE.lightbox." + self.name + ".open", function (topic, clickedItem) {
            if (ns.currentLightbox && ns.currentLightbox.name === self.name) {
                return false;
            }
            self.clickedItem = clickedItem;
            if ($(self.clickedItem).attr('disabled') === 'disabled' || $(self.clickedItem).attr('disabled') === 'true') {
                return false;
            }

            if (clickedItem) {

                if (_gaq) {

                    switch (clickedItem.id) {
                        case 'sidebar-helpchoose':
                            _gaq.push(['_trackEvent', 'SideBar-Estimate Med Costs', 'Click', 'Open Window']);
                            break;
                        case 'sidebar-compareplans-ma':
                            _gaq.push(['_trackEvent', 'SideBar-Compare Plans-MA', 'Click', EXCHANGE.plans.MedicareAdvantageCompareList.getComparedPlansCount() + ' Plans']);
                            break;
                        case 'sidebar-compareplans-drug':
                            _gaq.push(['_trackEvent', 'SideBar-Compare Plans-Drug', 'Click', EXCHANGE.plans.PrescriptionDrugCompareList.getComparedPlansCount() + ' Plans']);
                            break;
                        case 'sidebar-compareplans-medigap':
                            _gaq.push(['_trackEvent', 'SideBar-Compare Plans-Medigap', 'Click', EXCHANGE.plans.MedigapCompareList.getComparedPlansCount() + ' Plans']);
                            break;
                        case 'custom_btn_insurer':
                            _gaq.push(['_trackEvent', 'Select Insurers', 'Click', 'Insurers Selected']);
                            break;
                        default:
                            break;

                    }
                }

            }

        
            self.hasAfterCloseRan = false;
            self.hasAfterExitRan = false;
            if (self.beforeOpen(self.clickedItem)) {
                if (ns.currentLightbox) {
                    $(ns.currentLightbox.closeButtonSelector).click();
                }
                $(self.openButtonSelector).click();

                var maxZIndex = $(self.divSelector).parent().css('z-index');

                // Find the top UI layer positioning of any button spinner control mask panel
                $('.spinner-maskwrapper').each(function (key, sm) {
                    if (!isNaN(maxZIndex)) {
                        maxZIndex = Math.max(parseInt(maxZIndex), parseInt($(sm).css('z-index'))).toString();
                    }
                    else {
                        maxZIndex = $(sm).css('z-index');
                    }
                });

                // Move the lightbox to the top of the UI layer stack, above any page control masking panel.
                if (!isNaN(maxZIndex)) {
                    $(self.divSelector).parent().css('z-index', (parseInt(maxZIndex) + 1).toString());
                }

                // Open the wait popup
                if (self.showWaitPopup) {
                    self.waitPopup = $(self.divSelector).WaitPopup({ hide: true, fullWindow: false }); 
                }

                self.afterOpen(self.clickedItem);
                var shouldSet = true;
                var current = ns.currentLightbox;
                while (current !== null && shouldSet) {
                    if (current === self) {
                        shouldSet = false;
                    }
                    current = current.parent;
                }
                if (shouldSet && !self.parent && ns.currentLightbox && !(ns.currentLightbox.name == self.name)) {
                    var parentLightbox = ns.currentLightbox;
                    if (ns.currentLightbox.name === "comparisonlimit" && self.name !== "gethelp") {
                        parentLightbox = parentLightbox.parent;
                    }
                    if (parentLightbox) {
                        self.parent = parentLightbox;
                    }
                }
                ns.currentLightbox = self;
                $.publish("EXCHANGE.lightbox." + self.name + ".doneOpen");

                if (_gaq) {

                    var virtualPageName = '';

                    switch (self.name.toUpperCase()) {
                        case 'GETHELP':
                            virtualPageName = 'Get_Help/Main';
                            break;
                        case 'SENDMESSAGE':
                            virtualPageName = 'Get_Help/SendMessage';
                            break;
                        case 'LOGIN':
                            virtualPageName = 'Login';
                            break;
                        case 'CREATEACCOUNTPERSONALINFO':
                            virtualPageName = 'Create_Account/1';
                            break;
                        case 'CREATEACCOUNTAUTH':
                            virtualPageName = 'Create_Account/2';
                            break;
                        case 'FORGOTUSERNAME':
                            virtualPageName = 'Forgot_Username/Request';
                            break;
                        case 'FINDACCOUNT':
                            virtualPageName = 'Forgot_Username/Sent';
                            break;
                        case 'FORGOTUSERNAME':
                            virtualPageName = 'Forgot_Username/Request';
                            break;
                        case 'FINDACCOUNT':
                            virtualPageName = 'Forgot_Username/Sent';
                            break;
                        case 'PRIVACY':
                            virtualPageName = 'Privacy_Policy';
                            break;
                        case 'CALLUS':
                            virtualPageName = 'Plan_Search/None_Available';
                            break;
                        case 'PLANDETAILS':
                            virtualPageName = 'Plan_Search/Plan_Details';
                            break;
                        case 'COMPAREPLANS':
                            virtualPageName = 'Plan_Search/Compare_Plans';
                            break;
                        case 'DOCTORFINDERINTRO':
                            virtualPageName = 'Doctor_Finder/Intro';
                            break;
                        case 'DOCTORFINDERMAIN':
                            virtualPageName = 'Doctor_Finder/Search';
                            break;
                        case 'PLANDOCUMENTS':
                            virtualPageName = 'Request_Plan_Docs/Start';
                            break;
                        case 'PLANDOCUMENTSEMAIL':
                            virtualPageName = 'Request_Plan_Docs/Email';
                            break;
                        case 'PLANDOCUMENTSMAIL':
                            virtualPageName = 'Request_Plan_Docs/Mail';
                            break;
                        case 'PLANDOCUMENTSEMAILCONFIRM':
                            virtualPageName = 'Request_Plan_Docs/Email_Sent';
                            break;
                        case 'PLANDOCUMENTSMAILCONFIRM':
                            virtualPageName = 'Request_Plan_Docs/Mail_Sent';
                            break;
                        case 'HELPCHOOSE':
                            virtualPageName = 'Plan_Search/HelpChoose';
                            break;
                        case 'COMPANYAUTHOPTIONSCREATEACCOUNTAUTH':
                            virtualPageName = 'CREATEACCTCREDS-CLIENT';
                            break;
                        default:
                            virtualPageName = self.name.toUpperCase();
                            break;
                    }
                    _gaq.push(['_trackPageview', virtualPageName]);

                }
                return false;
            }

            return false;
        });

        // This event can be fired by a lightbox client to indicate it is done loading/rendering
        $.subscribe("EXCHANGE.lightbox." + self.name + ".loaded", function (topic, clickedItem) {
            self.clickedItem = clickedItem;
            self.loaded();
            return false;
        });

        $.subscribe("EXCHANGE.lightbox." + self.name + ".done", function (topic, clickedItem) {

            if (_gaq) {

                switch (topic) {

                    case 'EXCHANGE.lightbox.viewcart.done':
                        _gaq.push(['_trackEvent', 'Checkout', 'Click', 'View Cart']);
                        break;
                    case 'EXCHANGE.lightbox.intelligentswap.done':
                        _gaq.push(['_trackEvent', 'Intelligent Swap', 'Click', 'Accept']);
                        break;
                    default:
                        break;
                }

            }

            self.clickedItem = clickedItem;
            if (self.beforeSubmit(self.clickedItem)) {
                self.parent = null;
                $(self.closeButtonSelector).click();
                if (self === ns.currentLightbox) {
                    ns.currentLightbox = null;
                }
                self.afterClose(self.clickedItem);
            }

            return false; // So we don't scroll to the top
        });

        $.subscribe("EXCHANGE.lightbox." + self.name + ".back", function (topic, clickedItem) {

            if (_gaq) {
                switch (topic) {

                    case 'EXCHANGE.lightbox.intelligentswap.back':
                        _gaq.push(['_trackEvent', 'Intelligent Swap', 'Click', 'Decline']);
                        break;
                    default:
                        break;
                }
            }

            self.clickedItem = clickedItem;
            $(self.closeButtonSelector).click();
            if (self === ns.currentLightbox) {
                ns.currentLightbox = null;
            }

            if (self.parent) {
                $.publish("EXCHANGE.lightbox." + self.parent.name + ".open");
            }

            self.parent = null;
        });

        Lightbox.prototype.open = function open() {
            var protoSelf = this;
            if (protoSelf.beforeOpen()) {
                $(protoSelf.openButtonSelector).click();
                protoSelf.afterOpen();
                return true;
            }
            return false;
        };

        Lightbox.prototype.closeWithCheck = function closeWithCheck() {
            var protoSelf = this;
            if (protoSelf.waitPopup) {
                protoSelf.waitPopup.Close();
                protoSelf.waitPopup = null;
            }
            if (protoSelf.beforeSubmit()) {
                $(protoSelf.closeButtonSelector).click();
                protoSelf.parent = null;
                protoSelf.afterClose();
            }

            return false;
        };

        Lightbox.prototype.closeWithoutCheck = function closeWithoutCheck(after) {
            var protoSelf = this;
            if (protoSelf.waitPopup) {
                protoSelf.waitPopup.Close();
                protoSelf.waitPopup = null;
            }
            $(protoSelf.closeButtonSelector).click();
            protoSelf.parent = null;
            if (after || protoSelf.alwaysPerformAfterClose) {
                protoSelf.afterClose();
            }

            if (protoSelf.alwaysPerformAfterExit) {
                protoSelf.afterExit();
            }

            return false;
        };

        $(self.divSelector).modalPopLite({
            openButton: self.openButtonSelector,
            closeButton: self.closeButtonSelector,
            callBack: self.afterClose,
            name: self.name
        });

        $(document).on('click', '.lightbox-exit-' + self.name, function () {
            $.publish("EXCHANGE.lightbox.closeAll");
            return false;
        });

        $(document).on('click', '.lightbox-open-' + self.name, function () {
            $.publish("EXCHANGE.lightbox." + self.name + ".open", this);
            return false;
        });
        $(document).on('click', '.lightbox-back-' + self.name, function () {
            $.publish("EXCHANGE.lightbox." + self.name + ".back", this);
            return false;
        });
        $(document).on('click', '.lightbox-done-' + self.name, function () {
            $.publish("EXCHANGE.lightbox." + self.name + ".done", this);
            return false;
        });

        return self;
    };

} (EXCHANGE));

(function (app) {
    var ns = app.namespace('EXCHANGE.lightbox');

    ns.currentLightbox = null;
    $.subscribe("EXCHANGE.lightbox.closeAll", function () {
        if (ns.currentLightbox !== null) {
            ns.currentLightbox.closeWithoutCheck();
        }

        ns.currentLightbox = null;
    });

} (EXCHANGE));
