/**
 * ReactPlugin.ts
 * @copyright Microsoft 2019
 */
import { CoreUtils, _InternalMessageId, LoggingSeverity } from "@microsoft/applicationinsights-core-js";
var ReactPlugin = /** @class */ (function () {
    function ReactPlugin() {
        this.priority = 180;
        this.identifier = 'ReactPlugin';
    }
    ReactPlugin.prototype.initialize = function (config, core, extensions) {
        var _this = this;
        this._extensionConfig =
            config.extensionConfig && config.extensionConfig[this.identifier]
                ? config.extensionConfig[this.identifier]
                : { history: null };
        this._logger = core.logger;
        extensions.forEach(function (ext) {
            var identifier = ext.identifier;
            if (identifier === 'ApplicationInsightsAnalytics') {
                _this._analyticsPlugin = ext;
            }
        });
        if (this._extensionConfig.history) {
            this.addHistoryListener(this._extensionConfig.history);
            var pageViewTelemetry = {
                uri: this._extensionConfig.history.location.pathname
            };
            this.trackPageView(pageViewTelemetry);
        }
    };
    /**
     * Add Part A fields to the event
     * @param event The event that needs to be processed
     */
    ReactPlugin.prototype.processTelemetry = function (event) {
        if (!CoreUtils.isNullOrUndefined(this._nextPlugin)) {
            this._nextPlugin.processTelemetry(event);
        }
    };
    /**
     * Sets the next plugin that comes after this plugin
     * @param nextPlugin The next plugin
     */
    ReactPlugin.prototype.setNextPlugin = function (nextPlugin) {
        this._nextPlugin = nextPlugin;
    };
    ReactPlugin.prototype.trackMetric = function (metric, customProperties) {
        if (this._analyticsPlugin) {
            this._analyticsPlugin.trackMetric(metric, customProperties);
        }
        else {
            this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "Analytics plugin is not available, React plugin telemetry will not be sent: ");
        }
    };
    ReactPlugin.prototype.trackPageView = function (pageView) {
        if (this._analyticsPlugin) {
            this._analyticsPlugin.trackPageView(pageView);
        }
        else {
            this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "Analytics plugin is not available, React plugin telemetry will not be sent: ");
        }
    };
    ReactPlugin.prototype.addHistoryListener = function (history) {
        var _this = this;
        var locationListener = function (location, action) {
            // Timeout to ensure any changes to the DOM made by route changes get included in pageView telemetry
            setTimeout(function () {
                var pageViewTelemetry = { uri: location.pathname };
                _this.trackPageView(pageViewTelemetry);
            }, 500);
        };
        history.listen(locationListener);
    };
    return ReactPlugin;
}());
export default ReactPlugin;
//# sourceMappingURL=ReactPlugin.js.map