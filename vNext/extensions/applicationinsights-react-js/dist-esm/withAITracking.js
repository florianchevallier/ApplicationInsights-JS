// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as tslib_1 from "tslib";
import * as React from 'react';
/**
 * Higher-order component function to hook Application Insights tracking
 * in a React component's lifecycle.
 *
 * @param reactPlugin ReactPlugin instance
 * @param Component the React component to be instrumented
 * @param componentName (optional) component name
 */
export default function withAITracking(reactPlugin, Component, componentName) {
    if (componentName === undefined || componentName === null || typeof componentName !== 'string') {
        componentName = Component.prototype.constructor.name;
    }
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._mountTimestamp = 0;
            _this._firstActiveTimestamp = 0;
            _this._idleStartTimestamp = 0;
            _this._lastActiveTimestamp = 0;
            _this._totalIdleTime = 0;
            _this._idleCount = 0;
            _this._idleTimeout = 5000;
            _this.trackActivity = function (e) {
                if (_this._firstActiveTimestamp === 0) {
                    _this._firstActiveTimestamp = Date.now();
                    _this._lastActiveTimestamp = _this._firstActiveTimestamp;
                }
                else {
                    _this._lastActiveTimestamp = Date.now();
                }
                if (_this._idleStartTimestamp > 0) {
                    var lastIdleTime = _this._lastActiveTimestamp - _this._idleStartTimestamp;
                    _this._totalIdleTime += lastIdleTime;
                    _this._idleStartTimestamp = 0;
                }
            };
            return _this;
        }
        class_1.prototype.componentDidMount = function () {
            var _this = this;
            this._mountTimestamp = Date.now();
            this._firstActiveTimestamp = 0;
            this._totalIdleTime = 0;
            this._lastActiveTimestamp = 0;
            this._idleStartTimestamp = 0;
            this._idleCount = 0;
            this._intervalId = setInterval(function () {
                if (_this._lastActiveTimestamp > 0 && _this._idleStartTimestamp === 0 && Date.now() - _this._lastActiveTimestamp >= _this._idleTimeout) {
                    _this._idleStartTimestamp = Date.now();
                    _this._idleCount++;
                }
            }, 100);
        };
        class_1.prototype.componentWillUnmount = function () {
            if (this._mountTimestamp === 0) {
                throw new Error('withAITracking:componentWillUnmount: mountTimestamp is not initialized.');
            }
            if (this._intervalId) {
                clearInterval(this._intervalId);
            }
            if (this._firstActiveTimestamp === 0) {
                return;
            }
            var engagementTime = this.getEngagementTimeSeconds();
            var metricData = {
                average: engagementTime,
                name: 'React Component Engaged Time (seconds)',
                sampleCount: 1
            };
            var additionalProperties = { 'Component Name': componentName };
            reactPlugin.trackMetric(metricData, additionalProperties);
        };
        class_1.prototype.render = function () {
            return (React.createElement("div", { onKeyDown: this.trackActivity, onMouseMove: this.trackActivity, onScroll: this.trackActivity, onMouseDown: this.trackActivity, onTouchStart: this.trackActivity, onTouchMove: this.trackActivity, className: "appinsights-hoc" },
                React.createElement(Component, tslib_1.__assign({}, this.props))));
        };
        class_1.prototype.getEngagementTimeSeconds = function () {
            return (Date.now() - this._firstActiveTimestamp - this._totalIdleTime - this._idleCount * this._idleTimeout) / 1000;
        };
        return class_1;
    }(React.Component));
}
//# sourceMappingURL=withAITracking.js.map