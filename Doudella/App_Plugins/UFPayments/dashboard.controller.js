angular.module("umbraco").controller("uFPayments.dashboardController", function ($scope, UFPaymentsSettingsResource, notificationsService) {
    var vm = this;
    vm.headline = "UFPayments Settings";

    $scope.licenseIsValid = true;
    $scope.licenseStatus = "No license found, please insert a valid key below and/or upload the license file.";

    vm.settingsId = 0;
    vm.licenseKey = "";

    // Stripe settings
    vm.stripeId = 0;
    vm.stripeApiKey = "";
    vm.stripeEndpointSecret = "";

    // Mollie settings
    vm.mollieId = 0;
    vm.mollieApiKey = "";

    // Adyen settings
    vm.adyenId = 0;
    vm.merchantAccount = "";
    vm.adyenApiKey = "";
    vm.adyenClientKey = "";
    vm.adyenTest = false;

    vm.adyenEndpointPrefix = "";

    vm.toggle = function () {
        vm.adyenTest = !vm.adyenTest;
    }

    vm.dropdownName = "Select endpoint region";
    vm.selectedAdyenRegion = "";
    vm.dropdownOpen = false;

    vm.regions = [
        { "name": "Test" },
        { "name": "Live - EU" },
        { "name": "Live - APSE" },
        { "name": "Live - AU" },
        { "name": "Live - US" }
    ];

    vm.toggleDropdown = function () {
        vm.dropdownOpen = true;
    }

    vm.close = function () {
        vm.dropdownOpen = false;
    }

    vm.select = function (region) {
        vm.dropdownName = region.name;
        vm.dropdownOpen = false;
        vm.selectedAdyenRegion = region.name;
    }

    function setLicenseInvalidStatus(expired, domains) {
        $scope.licenseIsValid = false;

        if (expired) {
            $scope.licenseStatus = "This license is expired. Please upgrade your license to use it with this version."
            $scope.unlicensedDomains = [];
        }
        else if (domains.length == 0) {
            $scope.licenseStatus = "No license found, please insert a valid key below and/or upload the license file.";
            $scope.unlicensedDomains = [];
        }
        else if (domains.length > 0) {
            $scope.licenseStatus = "This license does not cover all of the configured domains.";
            $scope.unlicensedDomains = domains;
        }
    }

    UFPaymentsSettingsResource.getLicenseStatus().then(function (response) {
        $scope.licenseIsValid = response?.LicenseIsValid;

        if (response == null) {
            return;
        }

        if (!response.LicenseIsValid || response.LicenseIsExpired) {
            setLicenseInvalidStatus(response.LicenseIsExpired, response.UnlicensedDomains);
        }
    });

    UFPaymentsSettingsResource.getAll().then(function (response) {
        if (response == null) {
            return;
        }
        vm.settingsId = response.Id;
        vm.licenseKey = response.LicenseKey;

        var stripeSettings = response.PaymentProviderSettings?.find(x => x.PaymentProvider === "stripe");
        vm.stripeId = stripeSettings?.Id;
        vm.stripeApiKey = stripeSettings?.ApiKey;
        if (stripeSettings != null) {
            var stripeSpecificSettings = JSON.parse(stripeSettings?.ProviderSpecificSettings);
            vm.stripeEndpointSecret = stripeSpecificSettings?.WebhookEndpointSecret;
        }

        var mollieSettings = response.PaymentProviderSettings?.find(x => x.PaymentProvider === "mollie");
        vm.mollieId = mollieSettings?.Id;
        vm.mollieApiKey = mollieSettings?.ApiKey;

        var adyenSettings = response.PaymentProviderSettings?.find(x => x.PaymentProvider === "adyen");
        vm.adyenId = adyenSettings?.Id;
        vm.adyenApiKey = adyenSettings?.ApiKey;
        vm.merchantAccount = adyenSettings?.AccountName;
        vm.adyenClientKey = adyenSettings?.ClientKey;
        vm.adyenTest = adyenSettings?.TestEnvironment;
        if (adyenSettings != undefined) {
            var adyenSpecificSettings = JSON.parse(adyenSettings?.ProviderSpecificSettings);
            vm.selectedAdyenRegion = adyenSpecificSettings?.AdyenRegion;
            vm.dropdownName = adyenSpecificSettings?.AdyenRegion
            vm.adyenEndpointPrefix = adyenSpecificSettings?.AdyenEndpointPrefix;
        }
    });

    $scope.setLicenseKey = function () {
        vm.licenseSaveButtonState = "busy";
        UFPaymentsSettingsResource.setLicenseKey(vm.licenseKey).then(
            function (response) {
                vm.licenseSaveButtonState = "success";
                vm.settingsId = response?.SettingsId;
                if (response == null) {
                    return;
                }
                else if (response.LicenseIsValid) {
                    $scope.licenseIsValid = true;
                    $scope.unlicensedDomains = [];
                }
                else {
                    setLicenseInvalidStatus(response.UnlicensedDomains);
                }
            }, function (err) {
                vm.licenseSaveButtonState = "error";
                console.log("FAILED SETTING LICENSE KEY");
                console.error(err);
            });
    }

    $scope.setStripeSettings = function () {
        vm.stripeSaveButtonState = "busy";

        var stripeSpecificSettings = {
            WebhookEndpointSecret: vm.stripeEndpointSecret
        };

        var paymentProviderSettings = {
            Id: vm.stripeId,
            SettingsId: vm.settingsId,
            PaymentProvider: "stripe",
            ApiKey: vm.stripeApiKey,
            ProviderSpecificSettings: JSON.stringify(stripeSpecificSettings)
        };

        UFPaymentsSettingsResource.setPaymentProviderSettings(paymentProviderSettings).then(
            function (response) {
                vm.stripeSaveButtonState = "success";
            }, function (err) {
                vm.stripeSaveButtonState = "error";
                console.log("FAILED SETTING Stripe settings");
                console.error(err);
            });
    }

    $scope.setMollieApiKey = function () {
        vm.mollieSaveButtonState = "busy";
        UFPaymentsSettingsResource.setApiKey(vm.mollieId, vm.settingsId, "mollie", vm.mollieApiKey).then(
            function (response) {
                vm.mollieSaveButtonState = "success";
                notificationsService.success('Saved', 'mollie api key saved');
            }, function (err) {
                vm.mollieSaveButtonState = "error";
                console.log("FAILED SETTING Mollie API KEY");
                console.error(err);
            });
    }

    $scope.setAdyenSettings = function () {
        vm.adyenSaveButtonState = "busy";

        var adyenSpecificSettings = {
            AdyenRegion: vm.selectedAdyenRegion,
            AdyenEndpointPrefix: vm.adyenEndpointPrefix
        };

        var paymentProviderSettings = {
            Id: vm.adyenId,
            SettingsId: vm.settingsId,
            PaymentProvider: "adyen",
            ApiKey: vm.adyenApiKey,
            AccountName: vm.merchantAccount,
            ClientKey: vm.adyenClientKey,
            TestEnvironment: vm.adyenTest,
            ProviderSpecificSettings: JSON.stringify(adyenSpecificSettings)
        };

        UFPaymentsSettingsResource.setPaymentProviderSettings(paymentProviderSettings).then(
            function (response) {
                vm.adyenSaveButtonState = "success";
            }, function (err) {
                vm.adyenSaveButtonState = "error";
                console.log("FAILED SETTING Adyen API KEY");
                console.error(err);
            });
    }
});