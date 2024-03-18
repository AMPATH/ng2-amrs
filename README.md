[![Ng2-amrs CI](https://github.com/AMPATH/ng2-amrs/actions/workflows/main.yml/badge.svg)](https://github.com/AMPATH/ng2-amrs/actions/workflows/main.yml)

# AMPATH POC

AMPATH POC is a point of care system used by AMPATH clinics. It provides real-time access to electronic medical records allowing patient records to be accessible during patient-clinician interactions. It also offers clinical decision support via automated reminders, lab integrations, clinic dashboards as well as data analytics and reporting.

AMPATH POC works in conjunction with [AMPATH ETL](https://github.com/ampath/etl-rest-server) and AMRS (AMPATH Medical Records System), a web-based open-source medical records system. It is being used against OpenMRS v2.1.2 in production but it should be compatible with older versions of OpenMRS.

## Setting up a Dev Environment

### Prerequisites

#### System Requirements

Recommended setup:

- Install [chrome](https://www.google.com/chrome/).
- Install and setup [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on your local machine.
- Install [npm and nodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).NodeJS version 10-12 and Npm version 6 recommended.
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

### Building for deployment

When building for production environment use:
`npm run build-prod`
When building for staging or test environment use:
`npm run build-staging`
This assists the team to differentiate which environment they are working on

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

program.constants.ts
formentry.component.ts
program-visits-config.json
patient.dashboard.conf.json

New DSD Programs "programToEnroll" "UUID"
FAST TRACK FACILITY MODEL "9d7422b1-af7b-4602-813e-953cfaf47e21" "08381666-5d30-40db-9a77-4413f4329800"

PEER LED FACILITY ART GROUP MODEL "a74f5be3-19bf-44a9-b9d8-14ff5587df37" "379038fc-663f-42ed-87f3-9cdde7fb4339"

HCW FACILITY ART DISTRIBUTION GROUP MODEL "10275c77-e317-4b48-b95e-279053d55cd0" "fb36b5af-3f83-460b-a10f-fc7923ed7914"

MULTI MONTH DISPENSING MODEL "e352cb61-5889-4ba3-8405-d975e4c5e89e" "29a9df4d-808f-4ba0-8b1e-ea05c918f14b"

PEER LED COMMUNITY ART GROUP MODEL "6d5d10b3-ea80-4ee5-a58e-5f8a6f88ae93" "771b200c-8525-4425-b763-7e1cdca1b01f"

HCW COMMUNITY ART DISTRIBUTION GROUP MODEL "7299b930-4866-437e-a879-aefbb5bf2e0b" "fb36b5af-3f83-460b-a10f-fc7923ed7914"

INDIVIDUAL DDD GROUP MODEL "6af0e0eb-7172-4d94-92fd-aa987bb43250" "3ec28e73-6f84-46f1-9310-c0c1a21c8ec3"

COMMUNITY PHARMACY MODEL "e33b0107-c248-42b4-8c94-4525fcc0c86e" "d9108db3-1cb4-4641-afd7-04f3dfc6a204"

FAMILY COMMUNITY ART GROUP MODEL "f16403bb-c5df-46ba-afce-14f8aea2fabd" "5af988e4-09d8-41a4-9438-30f2b62d90b8"

STANDARD PMTCT MODEL "80839137-9711-483f-a239-dfd383d020f6" "ce562f55-bf51-4d00-9a2a-f56ca1a8bc34"

PMTCT DSD MODEL "e950ade1-041d-4dda-b0cd-bb81dad8694e" "a685c057-d475-42ef-bb33-8b0c1d73b122"
