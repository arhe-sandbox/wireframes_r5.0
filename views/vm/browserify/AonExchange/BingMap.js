; (function (app) {

    var ns = app.namespace('EXCHANGE');

    ns.BingMap = function BingMap(div, key) {
        if (!(this instanceof BingMap)) {
            return new BingMap(div, key);
        };

        var self = this;
        self.options = {
            credentials: key,
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            showMapTypeSelector: false,
            enableSearchLogo: false,
            showDashboard: true,
            showScalebar: true,
            zoom: 12

        };

        self.webkitTrnsReset = false;


        self.mapDiv = div;
        self.map = new Microsoft.Maps.Map(div, self.options);


        attachmapviewchange = Microsoft.Maps.Events.addHandler(self.map, 'viewchangeend', function (e) {
            if (!self.webkitTrnsReset) {
                var divWithWKTransform = $('div[style*=webkit-transform]');
                var matrix = divWithWKTransform.css("-webkit-transform");
                divWithWKTransform.css('-webkit-transform', '');
                self.webkitTrnsReset = true;
            }

            $('#' + self.mapDiv.id).find('.MapPushpinBase').css('pointer-events', 'auto');
            self.map.getMode().setDrawShapesInSingleLayer(false);
        });





        self.pinInfobox = null;
        self.infoboxLayer = null;

        self.displayInfoBox = function (e) {
            var pin = e.target;


            var infoHtml = String.format("<div class=mapToolTip><SPAN class=tip-pointer></SPAN><P class=pharmacy-name>{0} </P><DIV class=address>{1}<BR>{2}, {3} {4}<BR>{5} </DIV></div>", pin.Name, pin.Address1, pin.City, pin.State, pin.Zip, pin.Phone)

            if (pin != null)
                var location = pin.getLocation();
            var infoboxOptions = { width: 200, height: 100, showCloseButton: true, zIndex: 1000, offset: new Microsoft.Maps.Point(5, -50), showPointer: true };
            if (null != self.pinInfobox)
                self.map.entities.remove(self.pinInfobox);
            self.pinInfobox = new Microsoft.Maps.Infobox(location, infoboxOptions);
            self.map.entities.push(self.pinInfobox);


            self.pinInfobox.setHtmlContent(infoHtml);
        };

        self.hideInfobox = function (e) {
            if (self.pinInfobox != null)
                self.pinInfobox.setOptions({ visible: false });
        };


        self.pinMouseOver = function (e) {


            self.displayInfoBox(e);
        };
        self.pinMouseOut = function (e) {


            self.hideInfobox(e);

        };


        self.addPins = function (p) {
            var pushPins = new Microsoft.Maps.EntityCollection();
            self.map.entities.clear();



            for (j = 0; j < p.length; j++) {
                var pin = p[j];
                var pushpinOptions = { htmlContent: "<span  class=number>" + pin.DisplayNo + "</span>" };
                var location = new Microsoft.Maps.Location(pin.Latitude, pin.Longitude);

                var pushPin = new Microsoft.Maps.Pushpin(location, pushpinOptions);

                pushPin.Title = pin.Name;
                pushPin.Description = pin.Address1;
                pushPin.Name = pin.Name;
                pushPin.Address1 = pin.Address1;
                pushPin.Address2 = pin.Address2;
                pushPin.City = pin.City;
                pushPin.State = pin.State;
                pushPin.Zip = pin.Zip;
                pushPin.Phone = pin.Phone;

                if (j == 0) {
                    self.map.setView({ center: new Microsoft.Maps.Location(pin.Latitude, pin.Longitude) });




                }


                Microsoft.Maps.Events.addHandler(pushPin, 'mouseover', self.pinMouseOver);
                Microsoft.Maps.Events.addHandler(pushPin, 'mouseout', self.pinMouseOut);



                pushPins.push(pushPin);

            }




            if (pushPins.getLength() > 0)
                self.map.entities.push(pushPins);

            $('#' + self.mapDiv.id).find('.MapPushpinBase').css('pointer-events', 'auto');


        };


    }
})(EXCHANGE);



$(function () {
    var body = $("body")
    $("<script type='text/javascript' src='https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onscriptload=DrawMap&s=1'></script>").appendTo(body);


});

var _mapLoadedFrmBing = false;

function DrawMap() {
   
    _mapLoadedFrmBing = true;
}
