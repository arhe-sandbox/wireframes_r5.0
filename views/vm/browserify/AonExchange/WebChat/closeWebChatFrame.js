///this file won't have any javascript libraries loaded before it, so we cant use namespaces or jquery or knockout
///  therefore, it will look uglier than the rest of our files.


///this code will bust out of the frameset and set the primary browser window location equal to the main_frame's location
///it will also save eapp answers before reloading if we are on an eapp page.
var mainSiteWindow = parent.main_frame;

var frameBusterCallbackFunction = function () {
    parent.location = mainSiteWindow.location.href;
};

if (mainSiteWindow.EXCHANGE.application && mainSiteWindow.EXCHANGE.application.navigationBar
                && mainSiteWindow.EXCHANGE.application.navigationBar.applicationPageSubmitNoValidation
                && mainSiteWindow.EXCHANGE.viewModels.ApplicationPageViewModel
                && mainSiteWindow.EXCHANGE.applicationPage) {
    mainSiteWindow.EXCHANGE.application.navigationBar.applicationPageSubmitNoValidation(frameBusterCallbackFunction);
}
else {
    frameBusterCallbackFunction();
}
