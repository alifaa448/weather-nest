# Startup

### Follow these steps to get started:

#### 1. Install the Node.js

Go to [**official nodejs website**](https://nodejs.org) and download the installer.
You can choose between Long Term Support (LTS) version or the latest version.
After downloading, run the installer and just install the Node.js pressing the Next button.

#### 2. Install the Git

Go to [**official git website**](https://git-scm.com) and download the installer.
After downloading, run the installer and just install the Git pressing the Next button.

#### 3. Clone the repository
Open a terminal and type:
```
git clone https://github.com/alifaa448/weather-app-nest.git
```
After cloning go to the directory and install the dependencies:
```
cd weather-app-nest
npm install
```

#### 4. Setting up the environment variables
In a root directory create a file called `.env` and add the following lines:

```
# server config
PORT=3000

# secrets
OPEN_WEATHER_KEY=someOpenWeatherKey
```

In order to get a unique API key register on https://openweathermap.org/api and go to your account page under the "API key" tab.

#### 5. Run the app
Open a terminal and type:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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
