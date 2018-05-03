// THIS FILE WAS AUTOGENERATED
/// <reference path="Domain.ts" />
/// <reference path="SeverityLevel.ts" />
/// <reference path="ExceptionDetails.ts" />
module AI
{
"use strict";
    
    /**
     * An instance of Exception represents a handled or unhandled exception that occurred during execution of the monitored application.
     */
    export class ExceptionData extends Microsoft.Telemetry.Domain
    {
        
        /**
         * Schema version
         */
        public ver: number;
        
        /**
         * Exception chain - list of inner exceptions.
         */
        public exceptions: ExceptionDetails[];
        
        /**
         * Severity level. Mostly used to indicate exception severity level when it is reported by logging library.
         */
        public severityLevel: AI.SeverityLevel;
        
        /**
         * Collection of custom properties.
         */
        public properties: any;
        
        /**
         * Collection of custom measurements.
         */
        public measurements: any;
        
        constructor()
        {
            super();
            
            this.ver = 2;
            this.exceptions = [];
            this.properties = {};
            this.measurements = {};
        }
    }
}
