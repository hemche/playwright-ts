# Playwright automated tests built using typescript

A simple playwright typescript starter kit with all components needed like, page objects and reporting.

### Prerequisites

- Install Git from the below links depending on your platform

  [Install git on windows](https://github.com/git-guides/install-git#install-git-on-windows)

  [Install git on Mac](https://github.com/git-guides/install-git#install-git-on-mac)

- Install [node](https://nodejs.org/en)

### Install project dependencies

- In the root folder where `package.json` file exists, run `yarn install` or `yarn`

### Run tests

- The web applications under test for this framework are

          https://the-internet.herokuapp.com

          https://demo.playwright.dev/todomvc

- `yarn run test` - This will launch all tests inside the `tests` directory in the root folder

### Launch test report

- `yarn run report` - This will launch `allure` html report with all the test execution details
