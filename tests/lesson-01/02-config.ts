export function getEnvironmentFileName(env: string): string {
  switch (env) {
    case 'dev':
      return 'dev.json';
    case 'staging':
      return 'staging.json';
    case 'production':
      return 'production.json';
    default:
      throw new Error(`Unknown env: ${env}`);
  }
}

module.exports = { getEnvironmentFileName };

// function getEnviromentFileName(env: string) {
//     return `${env}.json`;
// }

// // Error because `Duplicate function implementation.`