(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.profileAddresses");
    var addresstatus;
    $(document).ready(function () {
        // Initialize only if using "communication restrictions" as a separate webpart.
        //ns.initializePage();
        ns.setupBindings();
    });

    ns.initializePage = function initializePage() {
        if (app.viewModels.CommunicationPreferencesViewModel == null) {
            ns.setupViewModels();
        }
        if (app.viewModels.CommunicationPreferencesViewModel.isVMLoaded() === false) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/CommunicationPreferencesViewModel",
                dataType: "json",
                success: function (response) {
                    app.viewModels.CommunicationPreferencesViewModel.loadFromJSON(response);
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                    //app.agentAccess.hideAndDisable();
                },
                error: function (data) {
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                }
            });
        }
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.CommunicationPreferencesViewModel = new app.models.CommunicationPreferencesViewModel();
        ko.applyBindings(app.viewModels, $('#my-profile-addresses').get(0));
    };

    ns.setupBindings = function setupBindings() {
        ns.setupDropdowns();
        ns.bindCountyChangeKeyUp();
        ns.bindAddressEdit();
        ns.bindAddressSubmit();
        ns.bindAddNewAddress();
    };

    ns.bindAddNewAddress = function () {
        $(document).on("click", "#pre65-btn-address", function () {
            if (!$.browser.mozilla) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
           
            addresstatus = "Add";
            //Check if the new address section is displayed. If not, turn it on
            addresstatus = "Add";
            if (!($(".pre65-new-address").is(":visible"))) {
                //Clear input values
                $(".pre65-new-address input").val('');
                $(".pre65-new-address").show();
                $("#pre65-add-submit").val("Submit");
                $("#pre65-add-cancel").val("Cancel");
            }
            $('.pre65-addr-ddl').dropkick();

            $('#dk_container_add-name').attr('tabindex', '0');
            $('#dk_container_states0').attr('tabindex', '0');
            $('#dk_container_country0').attr('tabindex', '0');
            if ($.browser.mozilla) {
                return false;
            }    
        });
    };

    ns.bindAddressEdit = function () {
        $(document).on("click", ".pre65-edit-address", function () {
            if (!$.browser.mozilla) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
            addresstatus = "Edit";
            //Update text to show we're adding a new address
            $(".pre65-new-address h3").html("Editing Address");

            var curLi = $(this).parent().parent();
            //populate inputs with appropriate text
            $("#add-name").val(curLi.find('h4').html());
            $("#add-address1").val(curLi.find('.cur-add1').html());
            $("#add-address2").val(curLi.find('.cur-add2').html());
            $("#add-city").val(curLi.find('.cur-city').html());
            $("#add-state").val(curLi.find('.cur-state').html());
            $("#add-zipcode").val(curLi.find('.cur-zip').html());
            $("#add-county").val(curLi.find('.cur-county').html());
            $("#add-country").val(curLi.find('.cur-country').html());

            //Set editIsPrimary or editIsMailing 
            var addrIdx = parseInt($(this).attr('addrIdx'));

            //Display new address area and remove the old html
            $(".pre65-new-address").show();
            $("#pre65-add-submit").val("Submit");
            $("#pre65-add-cancel").val("Cancel");

            //curLi.remove();
            //curLi.hide();

            //Trigger the click events for the dropkick dropdowns so they are updated when editing
            $option = $('#dk_container_add-name .dk_options a[data-dk-dropdown-value="' + curLi.find('h4').html() + '"]');
            $option.trigger("click");
            $('.pre65-addr-ddl').dropkick();

            $('#dk_container_add-name').attr('tabindex', '0');
            $('#dk_container_states0').attr('tabindex', '0');
            $('#dk_container_country0').attr('tabindex', '0'); 
        });
    };

    ns.bindAddressSubmit = function () {
        //Bind the click event for the submit address button
        $(document).on("click", "#pre65-add-submit", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            if (addresstatus == "Edit") {
                //Update text to show we're Editing address
                $(".pre65-new-address h3").html("Editing Address");
            }
            else {
                //Update text to show we're adding a new address
                $(".pre65-new-address h3").html("Add New Address");
            }           
            var curName = $("#add-name").val();
            var curAddress1 = $("#add-address1").val();
            var curAddress2 = $("#add-address2").val();
            var curCity = $("#add-city").val();
            var curState = $("#add-state").val();
            var curZip = $("#add-zipcode").val();

            /*
            //Add the new address to the list
            $(".pre65-ac-addresses").append('<li class="pre65-ac-box"><h4>' + curName +
            '</h4><strong><span class="cur-add1">' + curAddress1 +
            '</span><br /><span class="cur-add2">' + curAddress2 +
            '</span><br /><span class="cur-city">' + curCity +
            '</span> <span class="cur-state">' + curState +
            '</span>, <span class="cur-zip">' + curZip + 
            '</span></strong><a href="#edit" title="Edit Address">' +
            '                           <span class="pre65-fa pre65-fa-edit edit-address"></span></a></li>');

            */
            /*
            //Clear the inputs in the new address section
            $("#add-name").val('');
            $("#add-address1").val('');
            $("#add-address2").val('');
            $("#add-city").val('');
            $("#add-state").val('');
            $("#add-zipcode").val('');

            //Hide the new address section
            $(".pre65-new-address").hide();
            */
        });
    };

    ns.setupDropdowns = function () {
        $('.pre65-addr-ddl').dropkick();
    }

    ns.bindCountyChangeKeyUp = function () {
        $("#add-zipcode").keyup(function () {
            ns.getCountiesForNewZip(this, false);
        });
        /*
        EXCHANGE.models.CommunicationAddressModel.editZip.subscribe(function (val) {
        if (val == "Yes") {
        $('.pre65-wrap-attorney').show();
        }
        else {
        $('.pre65-wrap-attorney').hide();
        }
        });
        */
    };

    ns.getCountiesForNewZip = function (selectedInput, isFromVM) {
        if (isFromVM) {
            selectedInput = "#add-zipcode";
        }
        var input = $(selectedInput);
        var addrIdx = parseInt(input.attr('addrIdx'));
        var zip = input.val();
        var zipInt = parseInt(zip);

        if (zip.length === 5 && zipInt >= 0 && zipInt < 100000) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/GetCountiesByZip",
                dataType: "json",
                data: JSON.stringify({ 'zip': zip }),
                success: function (data) {
                    if (isFromVM) {
                        app.viewModels.CommunicationPreferencesViewModel.addressAddedOrEdited()[addrIdx].countyList(data);
                    } else {
                        app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].countyList(data);
                    }
                    input.parents('div').find('.selectcounty').dropkick();
                    ns.updateDropkickDropdowns();
                }
            });
        } else {
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].countyList([]);
            input.parents('div').find('.selectcounty').dropkick();
            ns.updateDropkickDropdowns();
        }
    };

    ns.updateDropkickDropdowns = function () {
        // Okay, so, IE doesn't fire click events on these guys, so for IE we need to listen to mousedown events. This appears to be just when
        // we're also using dropkick, so watch out for that.
        $('#add-state').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].editState(selectedVal);
        });
        $('#add-county').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].editCounty(selectedVal);
        });
        $('#add-country').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].editCountry(selectedVal);
            ns.getStatesByCountry(selectedVal, addrIdx);
        });

        ns.getStatesByCountry = function (selectedValue, addrIdx) {

            var ddlstate = $('#states' + addrIdx);
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/GetStatesByCountry",
                dataType: "json",
                data: JSON.stringify({ 'countryName': selectedValue }),
                success: function (data) {
                    app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].stateList(data);
                    ddlstate.dropkick();
                    ns.updateDropkickDropdowns();
                }
            });

        };
    };






} (EXCHANGE));
