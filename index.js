#!/usr/bin/env node
var drblMacSelector = require('./libs/drblMacSelector.js');
var drblms = new drblMacSelector('/etc/drblms');
drblms.init();
