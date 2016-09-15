"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var root_module_1 = require('../root.module');
platform_browser_dynamic_1.platformBrowserDynamic()
    .bootstrapModule(root_module_1.RootModule)
    .catch(function (error) { console.error(error); });
//# sourceMappingURL=main.js.map