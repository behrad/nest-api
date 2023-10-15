# Hub Backend

Hub API orchestrator backend written in typescript powered by nestjs framework.


## Installation

```bash
$ npx husky-init
$ npm install
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- Mongo server running
- Redis server running

Rename `.sample.env` to `.env` and edit it as your needs to configure the app.


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


docker build -t backend-api .

docker run -d -t -p 3000:3000 backend-api
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Contribution Guideline

1.  Clone the Project

        `git clone https://`

    - make sure you have `node >= 18` installed
    - run `npm i` to install dependencies
    - use docker compose to run dependencies
    - enable eslint/prettier in your IDE

2.  Create your Feature Branch

        `git checkout -b feat/(task|scope)/AmazingFeature`

3.  Commit your Changes

        `git commit -m 'feat(task|scope): Add some AmazingFeature'`

    Make sure you obey to [commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint) commit message conventions

    ```bash
    type(scope?): subject
    body?
    footer?
    ```

    `type` must be one of `[build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]`

4.  Push to the Branch
    `git push origin feature/(task|scope)/AmazingFeature`
5.  Open a Pull Request

