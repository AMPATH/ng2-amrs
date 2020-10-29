[![Build Status](https://travis-ci.com/AMPATH/ng2-amrs.svg?branch=master)](https://travis-ci.com/AMPATH/ng2-amrs)

# AMPATH POC

AMPATH POC is a point of care system used by AMPATH clinics. It provides real-time access to electronic medical records allowing patient records to be accessible during patient-clinician interactions. It also offers clinical decision support via automated reminders, lab integrations, clinic dashboards as well as data analytics and reporting.

AMPATH POC works in conjunction with [AMPATH ETL](https://github.com/ampath/etl-rest-server) and AMRS (AMPATH Medical Records System), a web-based open-source medical records system. It is being used against OpenMRS v2.1.2 in production but it should be compatible with older versions of OpenMRS.

## Setting up a Dev Environment

### Prerequisites

#### System Requirements

Recommended setup:

- Install [chrome](https://www.google.com/chrome/).
- Install and setup [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on your local machine.
- Install [npm and nodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
- Install [visual studio code](https://code.visualstudio.com/).

### Setup

After you've made sure to have the correct things setup, you should be able to run a few commands to get set up:

```
git clone https://github.com/AMPATH/ng2-amrs.git
cd ng2-amrs
npm install
```

### Running the app

To get the app up and running locally, run:

```
npm start
```

Fire up your chrome and go to `https://localhost:3000`. You should see a login screen with the AMPATH logo.

### Running tests

```
npm test
```

This command will build the app and launch the [Karma](https://karma-runner.github.io/) test runner. Karma should spin up [several](https://www.npmjs.com/package/karma-parallel) chrome browser instances (equal to the number of cores on your machine) and run the test specs in parallel the specs across them.

### Communication and management

There are a few tools that we use extensively that all AMPATH developers should have set up:

- [JIRA](https://www.atlassian.com/software/jira) for tracking bugs and project management.
- [Slack](https://slack.com) for project-specific group chats.
- AMRS is AMPATH's medical records system. You'll need an AMRS account for use with a lot of AMPATH's internal tools, including AMPATH POC.

Access to these platforms is managed by the AMPATH IT team.
