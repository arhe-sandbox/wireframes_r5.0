(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.costEstimator');

    //This is what you will need to pass to the graphing engine
    ns.OutOfPocketGraph = function OutOfPocketGraph(containerId) {
        if (!(this instanceof OutOfPocketGraph)) {
            return new OutOfPocketGraph(containerId);
        }
        var self = this;

        self.CURRENCY_STRING = '$';
        self.MIN_BAR_HEIGHT = 18;
        self.TOP_TEXT_HEIGHT = 40;
        self.BAR_SPACE = 3;
        self.TOTAL_COST_LABEL_OFFSET = 0;
        self.PARTIAL_COST_LABEL_OFFSET = 1;
        self.BAR_WIDTH_SPACE = 5;

        self.graphContainerId = containerId;
        self.$graph = $(self.graphContainerId);
        self.months = {};
        self.monthDisplayNames = EXCHANGE.constants.monthNames();
        self.isInNetwork = true;
        self.showPrescription = false;
        self.showMedical = false;
        self.showPremium = false;
        self.maxBarHeight = 0;
        self.rowWidth = 0;
        self.barHeight = 0;
        self.totalDollarVals = [];
        self.barPixelHeights = [];
        self.barPremiumPixelHeights = [];
        self.barMedicalPixelHeights = [];
        self.barDrugPixelHeights = [];
        self.maxCost = 0;
        self.premiumBarsCalculated = false;
        self.medicalBarsCalculated = false;
        self.drugBarsCalculated = false;

        function resetGraph() {
            self.months = {};
            self.monthArray = EXCHANGE.constants.monthNames();
            self.isInNetwork = true;
            self.showPrescription = false;
            self.showMedical = false;
            self.showPremium = false;
            self.maxBarHeight = 0;
            self.rowWidth = 0;
            self.barHeight = 0;
            self.totalDollarVals = [];
            self.barPixelHeights = [];
            self.barPremiumPixelHeights = [];
            self.barMedicalPixelHeights = [];
            self.barDrugPixelHeights = [];
            self.maxCost = 0;
            self.premiumBarsCalculated = false;
            self.medicalBarsCalculated = false;
            self.drugBarsCalculated = false;
            self.$graph.html('');
            $('.total-cost-label').remove();
            $('.medical-cost-label').remove();
            $('.drug-cost-label').remove();
            $('.premium-cost-label').remove();
            $('.premium-bar').remove();
            $('.drug-bar').remove();
            $('.medical-bar').remove();
            $('.oopg-bar-container').remove();

        };

        OutOfPocketGraph.prototype.drawGraph = function drawGraph(costEstimateMonths, showPrescription,
																  showMedical, showPremium) {
            var protoSelf = this;
            resetGraph();
            self.months = costEstimateMonths;
            self.isInNetwork = true;
            self.showPrescription = showPrescription;
            self.showMedical = showMedical;
            self.showPremium = showPremium;
            var barsShownCount = 0;
            if (showPrescription) barsShownCount++;
            if (showMedical) barsShownCount++;
            if (showPremium) barsShownCount++;

            graphContainer();
            graphHeader();
            graphBody();

            drawBars();

            //if ie 9
            //if (isIE9()) {
            // setTimeout(redrawForIe9, 100);
            //}

            return protoSelf;
        };

        function redrawForIe9() {
            var tdObj = $('#oopg-body').children('td')[0];
            var cntnObj = $('.oopg-bar-container')[0];
            if (null != tdObj && null != cntnObj) {
                var tdRect = $('#oopg-body').children('td')[0].getBoundingClientRect();
                var containerRect = $('.oopg-bar-container')[0].getBoundingClientRect();
                if (tdRect.bottom > (containerRect.top + $('.oopg-bar-container').first().height() + 10)) {
                    console.log('redrawing');
                    self.drawGraph(self.months, self.isInNetwork, self.showPrescription, self.showMedical, self.showPremium);
                }
                removeDuplicateBars();
            }
        }

        function graphContainer() {
            var tableStr =
			'<table id="oopg">' +
				'<tbody>' +
				'<tr id="oopg-header"></tr>' +
				'<tr id="oopg-body"></tr>' +
				'</tbody>' +
			'</table>';
            self.$graph.html(tableStr);
        };

        function graphHeader() {
            var headStr = '';
            for (var i = 0; i < self.months.length; i++) {
                headStr += '<td><strong>' + self.monthArray[self.months[i].MonthId].ShortMonthName + '</strong></td>';
            }
            $('#oopg-header').append(headStr);

            self.rowWidth = Math.floor(self.$graph.width() / self.months.length);
            $('#oopg-header').find('td').each(function (index, element) {
                $(element).width(self.rowWidth);
            });
        };

        function graphBody() {
            var rowStr = '';
            for (var i = 0; i < self.months.length; i++) {
                rowStr += '<td></td>';
            }
            $('#oopg-body').append(rowStr);
            self.barHeight = self.$graph.height() - $('#oopg-header').height() - 4;
            self.maxBarHeight = self.barHeight - self.TOP_TEXT_HEIGHT;
            var numBars = 0;
            if (self.showPrescription) numBars++;
            if (self.showMedical) numBars++;
            if (self.showPremium) numBars++;
            if (numBars > 0) numBars--;
            self.maxBarHeight -= (numBars * self.BAR_SPACE);
            $('#oopg-body').find('td').each(function (index, element) {
                $(element).height(self.barHeight);
            });
        };

        function drawBars() {
            self.maxCost = getMaxMonthOOPCost(self.months);

            $('#oopg-body').find('td').each(function (index, element) {
                var id = 'oopg-bar-container-' + index;
                $(element).append('<div class="oopg-bar-container" id="' + id + '"></div>');
                var ce = self.months[index];
                var height = getTotalBarHeight(ce, index);
                $('#' + id).height(height);
                if ($.browser.msie /*&& parseInt($.browser.version, 10) == 9*/) {
                    var top = $(element).height() - $('#' + id).height();
                    $('#' + id).css('top', top + 'px');
                }
                setTimeout(function () {
                    var totalCost = getTotal(ce);
                    var totalLabel = '<div class="total-cost-label" style="position:absolute" id="total-cost-label' + index + '">' + self.CURRENCY_STRING + roundPremiumCost(totalCost) + '</div>';
                    $(element).append(totalLabel);
                    draw3Bars(ce, index, $(element));
                    var labelHeight = getLabelHeight(index);
                    if (!isIE9()) {
                        $('#total-cost-label' + index).css('bottom', labelHeight + self.TOTAL_COST_LABEL_OFFSET);
                    }
                    else {//ie-9

                        $('#total-cost-label' + index).css('top', '5px');
                    }
                    setBarWidths(index);
                }, 10);
            });

        };

        function setBarWidths(index) {
            var totalWidth = self.$graph.width();
            var rowCount = self.months.length;
            totalWidth -= (rowCount * self.BAR_WIDTH_SPACE);
            var rowWidth = totalWidth / rowCount;
            $('#oopg-bar-container-' + index).width(rowWidth);
            $('#total-cost-label' + index).width(rowWidth);
            $('#premium-bar' + index).width(rowWidth);
            $('#premium-cost-label' + index).width(rowWidth);
            $('#medical-bar' + index).width(rowWidth);
            $('#medical-cost-label' + index).width(rowWidth);
            $('#drug-bar' + index).width(rowWidth);
            $('#drug-cost-label' + index).width(rowWidth);
        };

        function getLabelHeight(index) {
            var height = 0;
            if (self.showPremium) {
                height += (self.barPremiumPixelHeights[index] + self.BAR_SPACE);
            }
            if (self.showMedical) {
                height += (self.barMedicalPixelHeights[index] + self.BAR_SPACE);
            }
            if (self.showPrescription) {
                height += (self.barDrugPixelHeights[index] + self.BAR_SPACE);
            }
            return height;
        };

        function draw3Bars(ce, index, $element) {
            var barsToDraw = 0;
            if (self.showPremium) barsToDraw++;
            if (self.showMedical) barsToDraw++;
            if (self.showPrescription) barsToDraw++;
            for (var iteration = 0; iteration < barsToDraw; iteration++) {
                calculateNextLowestBarHeight(ce, index, iteration);
            }
            var thisBarBottomPx = 0;
            thisBarBottomPx = drawPremiumBar(thisBarBottomPx, ce, index, $element);
            thisBarBottomPx = drawMedicalBar(thisBarBottomPx, ce, index, $element);
            thisBarBottomPx = drawPrescriptionBar(thisBarBottomPx, ce, index, $element);

            self.premiumBarsCalculated = false;
            self.medicalBarsCalculated = false;
            self.drugBarsCalculated = false;

            if (isIE9()) {
                removeDuplicateBars();
            }
        };

        function drawPremiumBar(thisBarBottomPx, ce, index, $element) {
            if (!self.showPremium) return thisBarBottomPx;
            var $barContainer = $('#oopg-bar-container-' + index);
            var premiumLabel = '<div class="premium-cost-label"  id="premium-cost-label' + index + '">' + self.CURRENCY_STRING + roundPremiumCost(ce.PremiumCost) + '</div>';
            if (isIE9())
                $barContainer.append('<div class="premium-bar" id="premium-bar' + index + '">' + premiumLabel + '</div>');
            else
                $barContainer.append('<div class="premium-bar" id="premium-bar' + index + '"></div>');
            $('#premium-bar' + index).css('bottom', thisBarBottomPx);
            $('#premium-bar' + index).height(self.barPremiumPixelHeights[index]);

            if (!isIE9()) {
                $element.append(premiumLabel);
                $('#premium-cost-label' + index).css('bottom', thisBarBottomPx + self.PARTIAL_COST_LABEL_OFFSET);
            }
            thisBarBottomPx += (self.barPremiumPixelHeights[index] + self.BAR_SPACE);
            return thisBarBottomPx;
        };

        function drawMedicalBar(thisBarBottomPx, ce, index, $element) {
            if (!self.showMedical) return thisBarBottomPx;
            var $barContainer = $('#oopg-bar-container-' + index);
            var medicalLabel = '<div class="medical-cost-label"  id="medical-cost-label' + index + '">' + self.CURRENCY_STRING + roundPremiumCost(ce.MedicalCost) + '</div>';
            if (isIE9())
                $barContainer.append('<div class="medical-bar" id="medical-bar' + index + '">' + medicalLabel + '</div>');
            else
                $barContainer.append('<div class="medical-bar" id="medical-bar' + index + '"></div>');

            $('#medical-bar' + index).css('bottom', thisBarBottomPx);
            $('#medical-bar' + index).height(self.barMedicalPixelHeights[index]);

            if (!isIE9()) {
                $element.append(medicalLabel);
                $('#medical-cost-label' + index).css('bottom', thisBarBottomPx + self.PARTIAL_COST_LABEL_OFFSET);
            }
            thisBarBottomPx += (self.barMedicalPixelHeights[index] + self.BAR_SPACE);
            return thisBarBottomPx;
        };

        function drawPrescriptionBar(thisBarBottomPx, ce, index, $element) {
            if (!self.showPrescription) return thisBarBottomPx;
            var $barContainer = $('#oopg-bar-container-' + index);
            var prescriptionCost = self.isInNetwork ? ce.InNetworkDrugCost : ce.OutNetworkDrugCost;
            var drugLabel = '<div class="drug-cost-label"  id="drug-cost-label' + index + '">' + self.CURRENCY_STRING + roundPremiumCost(prescriptionCost) + '</div>';
            if (isIE9())
                $barContainer.append('<div class="drug-bar" id="drug-bar' + index + '">' + drugLabel + '</div>');
            else
                $barContainer.append('<div class="drug-bar" id="drug-bar' + index + '"></div>');
            $('#drug-bar' + index).css('bottom', thisBarBottomPx);
            $('#drug-bar' + index).height(self.barDrugPixelHeights[index]);

            if (!isIE9()) {
                $element.append(drugLabel);
                $('#drug-cost-label' + index).css('bottom', thisBarBottomPx + self.PARTIAL_COST_LABEL_OFFSET);
            }
            thisBarBottomPx += (self.barDrugPixelHeights[index] + self.BAR_SPACE);
            return thisBarBottomPx;
        };

        function roundPremiumCost(cost) {
            return cost.toFixed(0);
        };

        function calculateNextLowestBarHeight(ce, index, iteration) {
            var lowest = Number.MAX_VALUE;
            var lowestBarType = 0;
            if (!self.premiumBarsCalculated && self.showPremium) {
                if (ce.PremiumCost < lowest) {
                    lowest = ce.PremiumCost;
                    lowestBarType = EXCHANGE.enums.OopgBarType.Premium;
                }
            }
            if (!self.medicalBarsCalculated && self.showMedical) {
                if (ce.MedicalCost < lowest) {
                    lowest = ce.MedicalCost;
                    lowestBarType = EXCHANGE.enums.OopgBarType.Medical;
                }
            }
            if (!self.drugBarsCalculated && self.showPrescription) {
                if (self.isInNetwork) {
                    if (ce.InNetworkDrugCost < lowest) {
                        lowest = ce.InNetworkDrugCost;
                        lowestBarType = EXCHANGE.enums.OopgBarType.Drug;
                    }
                } else {
                    if (ce.OutNetworkDrugCost < lowest) {
                        lowest = ce.OutNetworkDrugCost;
                        lowestBarType = EXCHANGE.enums.OopgBarType.Drug;
                    }
                }
            }

            switch (lowestBarType) {
                case EXCHANGE.enums.OopgBarType.Premium:
                    self.premiumBarsCalculated = true;
                    self.barPremiumPixelHeights[index] = calculateBarHeightInPixels(ce.PremiumCost, index, iteration, EXCHANGE.enums.OopgBarType.Premium);
                    break;
                case EXCHANGE.enums.OopgBarType.Medical:
                    self.medicalBarsCalculated = true;
                    self.barMedicalPixelHeights[index] = calculateBarHeightInPixels(ce.MedicalCost, index, iteration, EXCHANGE.enums.OopgBarType.Medical);
                    break;
                case EXCHANGE.enums.OopgBarType.Drug:
                    if (self.isInNetwork) {
                        self.barDrugPixelHeights[index] = calculateBarHeightInPixels(ce.InNetworkDrugCost, index, iteration, EXCHANGE.enums.OopgBarType.Drug);
                    } else {
                        self.barDrugPixelHeights[index] = calculateBarHeightInPixels(ce.OutNetworkDrugCost, index, iteration, EXCHANGE.enums.OopgBarType.Drug);
                    }
                    self.drugBarsCalculated = true;
                    break;
            }
        };

        function calculateBarHeightInPixels(dollarVal, index, iteration, barType) {
            var totalBarHeight = self.barPixelHeights[index];
            var totalDollarVal = self.totalDollarVals[index];
            var thisBarHeight = Math.floor((dollarVal * totalBarHeight) / totalDollarVal);
            if (thisBarHeight < self.MIN_BAR_HEIGHT) {
                thisBarHeight = self.MIN_BAR_HEIGHT;
            }
            return thisBarHeight;
        };

        function isLastIteration(iteration) {
            var iterationCount = 0;
            if (self.showPremium) iterationCount++;
            if (self.showMedical) iterationCount++;
            if (self.showPrescription) iterationCount++;
            if (iterationCount == (iteration + 1)) {
                return true;
            }
            return false;
        };

        function getMaxMonthOOPCost(months) {
            var max = 0;
            for (var i = 0; i < months.length; i++) {
                var total = getTotal(months[i]);
                self.totalDollarVals[i] = total;
                if (total > max) max = total;
            };
            return max;
        };

        function getTotalBarHeight(ce, index) {
            var thisBarTotal = getTotal(ce);
            self.barPixelHeights[index] = Math.floor((self.maxBarHeight * thisBarTotal) / self.maxCost);
            return self.barPixelHeights[index];
        };

        function getTotal(ce) {
            var total = 0;
            if (self.showPrescription) {
                if (self.isInNetwork) {
                    total += ce.InNetworkDrugCost;
                } else {
                    total += ce.OutNetworkDrugCost;
                }
            }
            if (self.showMedical) {
                total += ce.MedicalCost;
            }
            if (self.showPremium) {
                total += ce.PremiumCost;
            }
            return total;
        };

        function removeDuplicateBars() {
            removeDuplicateBarsByClass('.drug-bar');
            removeDuplicateBarsByClass('.medical-bar');
            removeDuplicateBarsByClass('.premium-bar');
        };

        function isIE9() {

            var ret = false;
            if ($.browser.msie) {
                var brwsVer9 = parseInt($.browser.version, 10) == 9;
                var trident5 = navigator.appVersion.indexOf("Trident/5.0") > 0;
                if (brwsVer9 || trident5)
                    ret = true;
            }

            return ret;
        };

        function removeDuplicateBarsByClass(className) {
            var foundIds = [];
            var elements = $(className);
            for (var i = 0; i < elements.length; i++) {
                var id = elements.eq(i).attr('id');
                if ($.inArray(id, foundIds) > -1) {
                    elements.eq(i).remove();
                } else {
                    foundIds.push(id);
                }
            }
        };

        return self;
    };

} (EXCHANGE, this));

(function (app, global) {
    var ns = app.namespace('EXCHANGE.enums');

    ns.OopgBarType = {
        Premium: 0,
        Medical: 1,
        Drug: 2
    };

} (EXCHANGE, this));

