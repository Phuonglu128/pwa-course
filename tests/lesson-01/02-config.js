"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentFileName = getEnvironmentFileName;
function getEnvironmentFileName(env) {
    switch (env) {
        case 'dev':
            return 'dev.json';
        case 'staging':
            return 'staging.json';
        case 'production':
            return 'production.json';
        default:
            throw new Error("Unknown env: ".concat(env));
    }
}
module.exports = { getEnvironmentFileName: getEnvironmentFileName };


// function getEnviromentFileName(env) {
//     return "".concat(env, ".json");
// }
// // Error because `Duplicate function implementation.`