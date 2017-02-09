(function (app) {
    //"use strict";

    var ns = app.namespace("EXCHANGE.autosuggest");

    ns.dataList = {};


    ns.doAutosuggest = function doAutosuggest(drugs) {
        //names
        var oldLength = ns.dataList['med-name'] ? ns.dataList['med-name'].length : 0;
        ns.dataList['med-name'].splice(0, oldLength);
        for (var i = 0; i < drugs.length; i++) {
            ns.dataList['med-name'].push(drugs[i]);
        }

        ns.input.trigger("check-auto-suggest");
    };

    ns.input = {};

    ns._doneScopes = [];

    ns.bindAutosuggests = function bindAutosuggests(scope) {
        ns.dataList['med-name'] = [];
        if (ns._doneScopes.indexOf(scope.selector) > -1) {
            return;
        }
        ns._doneScopes.push(scope.selector);
        scope.find("input[autosuggest]").each(function () {

            var $input = $(this),
                src_name = $input.attr("autosuggest"),
                data = ns.dataList[src_name];
            $input.data("auto-suggest", data);
            ns.input = $input;

            $input
                .attr("autocorrect", "off")
                .attr("autocapitalize", "off")
                .wrap('<span class="auto-suggest-wrapper"></span>');
            var $wrapper = $input.parent();

            $wrapper.css({
                "float": $input.css("float"),
                "display": $input.css("display"),
                "margin-top": $input.css("margin-top"),
                "margin-right": $input.css("margin-right"),
                "margin-bottom": $input.css("margin-bottom"),
                "margin-left": $input.css("margin-left")
            });
            $input.css({
                "float": "none",
                "margin": "0"
            });

            $input.after('<ul class="auto-suggest"></ul>');
            var $as = $input.next();

            $input
                .bind("check-auto-suggest", function () {
                    var val = $input.val();

                    if (val === "") {
                        $as.hide();
                    } else {
                        $as.show();
                        var items = [];
                        ns.dataList[src_name].forEach(function (drug/*line*/) {
                            var line = drug.Name;
                            if (line.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                                var newLine = '<a href="javascript:;" data-drug-id="' + drug.Id + '">',
                                    vLen = val.length,
                                    cursor = 0,
                                    textLengths = line.toLowerCase().split(val.toLowerCase());
                                textLengths.forEach(function (text) {
                                    var tLen = text.length;
                                    newLine += line.substring(cursor, cursor + tLen);
                                    newLine += '<strong>' + line.substring(cursor + tLen, cursor + tLen + vLen) + '</strong>';
                                    cursor += tLen + vLen;
                                });
                                newLine += "</a>";
                                items.push(newLine);
                            }
                        });
                        if (items.length === 0) {
                            if (app.viewModels.MyMedicationViewModel.noMedsFound_lbl()) {
                                $as.html('<li>' + app.viewModels.MyMedicationViewModel.noMedsFound_lbl() + '</li>');
                            }
                            else {
                                $as.hide();
                            }
                        } else {
                            //modify here
                            $as.html('<li>' + items.join('</li><li>') + '</li>');
                            $as.children()
                                .hover(function () { $as.trigger("suggest", $(this).prevAll().length); })
                                .bind("mousedown", function () {
                                    $as.trigger("take-suggestion", $(this).prevAll().length);
                                });
                            $as.hover(function () {
                            }, function () { $as.trigger("suggest", -1); });
                            $as.data("suggestion", -1);
                        }
                    }
                })
                .bind("keydown", function (e) {
                    var kc = e.keyCode,
                        len, ind;
                    switch (kc) {
                        case 40:
                            // Down
                            len = $as.children().length;
                            ind = $as.data("suggestion");
                            if (ind == len - 1)
                                $as.trigger("suggest", -1);
                            else
                                $as.trigger("suggest", ind + 1);
                            e.preventDefault();
                            break;
                        case 38:
                            // Up
                            len = $as.children().length;
                            ind = $as.data("suggestion");
                            if (ind == -1)
                                $as.trigger("suggest", len - 1);
                            else
                                $as.trigger("suggest", ind - 1);
                            e.preventDefault();
                            break;
                        case 13:
                            // return
                            $as.trigger("take-suggestion");
                            break;
                    }
                })
                .bind("keyup", function (e) {
                    var kc = e.keyCode, len = $input.val().length;
                    switch (kc) {
                        case 38:
                        case 40:
                            e.preventDefault();
                            return false;
                    }
                    if (len >= 4) {
                        app.drugs.DrugAPI.autoCompleteDrugList($input.val(), ns.doAutosuggest);
                    }
                    else {
                        $as.hide();
                    }
                    $input.data("orig-val", $input.val());
                })
                .bind("focus", function () {
                    $input.trigger("check-auto-suggest");
                })
                .bind("blur", function () {
                    $as.fadeOut("fast");
                });

            $as
                .bind("suggest", function (e, eq) {
                    $as.data("suggestion", eq);
                    if (eq == -1) {
                        $as.children().removeClass("hover");
                        $input.val($input.data("orig-val"));
                    } else {
                        $as.children().eq(eq).addClass("hover").siblings().removeClass("hover");
                        $input.val($as.children().eq(eq).text());
                    }
                })
                .bind("take-suggestion", function (e, index) {
                    var drugId = 0;

                    if (index === undefined)
                        index = $as.data("suggestion");
                    if (index === -1) {
                        index = -1;
                        $input.val($input.data("orig-val"));
                    } else {
                        var text = $as.children().eq(index).text();
                        drugId = $as.children().eq(index).find('a').attr('data-drug-id'); ;

                        $input.val(text).data("orig-val", text);
                    }
                    $as.data("suggestion", index);

                    // Custom Action
                    app.decisionSupport.autoCompleteSelection($input.val(), drugId);
                    $input.blur().val("").data("orig-val", "");
                    $as.hide();
                });

        });
    };

    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.com/#x15.4.4.18
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            var T, k;
            if (this === null)
                throw new TypeError(" this is null or not defined");
            var O = Object(this);
            var len = O.length >>> 0;
            if ({}.toString.call(callback) != "[object Function]")
                throw new TypeError(callback + " is not a function");
            if (thisArg)
                T = thisArg;
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }
} (EXCHANGE));
