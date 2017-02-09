;
(function(app) {
    var ns = app.namespace("EXCHANGE.agentAccess");

    ns.hideAndDisable = function hideAndDisable() {
        if(app.user.UserSession.Agent && app.user.UserSession.Agent().Id && app.user.UserSession.Agent().Id() !== app.constants.blankGuid) {
            $('.agent-disable').attr('disabled', 'disabled');
            $('.footer a').attr('disabled', 'disabled').attr('href', '#').click(function() { return false; });
            $('.lightbox-open-gethelp').attr('disabled', 'disabled');
            $('.disableIfAgent').attr('disabled', 'disabled');
            $('.helpOptions').removeClass('helpOptions');
            $(".helpoptionsmenu").remove();
        }
    };

}(EXCHANGE));