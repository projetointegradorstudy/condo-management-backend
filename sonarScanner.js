/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: `http://${process.env.SONAR_HOST}:${process.env.SONAR_PORT}`,
    options: {
      'sonar.projectKey': `${process.env.SONAR_PROJECT_KEY}`,
      'sonar.login': `${process.env.SONAR_LOGIN}`,
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
      'sonar.language': 'ts',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.inclusions': '**',
      'sonar.test.inclusions': 'src/**/*.spec.ts,src/**/*.spec.tsx,src/**/*.test.ts,src/**/*.test.tsx',
      'sonar.exclusions':
        '**/*.spec.ts, **/*.interface.ts, **/*.decorator.ts, **/*.strategy.ts, **/*.pipe.ts, **/*.guard.ts, **/*.module.ts, **/*.middleware.ts, **/*.entity.ts, **/main.ts, **/file-mimetype-filter.ts, src/config/*, src/db/**/*',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
    },
  },
  () => {},
);
