// adds the resource to umbraco.resources module:
angular.module('umbraco.resources').factory('UFPaymentsSettingsResource',
    function ($q, $http, umbRequestHelper) {
        // the factory object returned
        return {
            getAll: function () {
                return umbRequestHelper.resourcePromise(
                    $http.get("backoffice/UFPayments/SettingsApi/GetAll",
                        "Failed to retrieve all settings"));
            },
            getLicenseStatus: function () {
                return umbRequestHelper.resourcePromise(
                    $http.get("backoffice/UFPayments/SettingsApi/LicenseValid",
                        "Failed to retrieve license status"));
            },
            setLicenseKey: function (licenseKey) {
                return umbRequestHelper.resourcePromise(
                    $http.post("backoffice/UFPayments/SettingsApi/AddOrUpdateLicenseKey?key=" + licenseKey)
                    , "Failed to set LicenseKey");
            },
            setPaymentProviderSettings: function (paymentProviderSettings) {
                let body = JSON.stringify(paymentProviderSettings);
                return umbRequestHelper.resourcePromise(
                    $http.post("backoffice/UFPayments/SettingsApi/SetPaymentProviderSettings", body)
                    , "Failed to set payment provider settings");
            },
            setApiKey: function (id, settingsId, paymentProvider, apiKey) {
                let body = JSON.stringify(apiKey);
                return umbRequestHelper.resourcePromise(
                    $http.post("backoffice/UFPayments/SettingsApi/SetApiKey?id=" + id + "&settingsId=" + settingsId + "&paymentProvider=" + paymentProvider, body)
                    , "Failed to set apikey");
            }
        };
    }
);