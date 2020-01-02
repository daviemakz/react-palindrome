# Summary

The purpose of this repository is to build a backend service that checks/stores palindromes (in memory for now) and a frontend which allows you to interact with it.

A palindrome is a word or phrase string that reads the same backwards as forwards, _independent of spaces and punctuation_. An example could be 'Dammit I'm Mad' or 'otto'.

The repository uses a single webpack configuration to bundle both the backend and the frontend into one artefact within the `public` folder. This means you don't need separate scripts / configuration to build the frontend and backend separately.

You would simply build the application, zip up all the files in your `public` folder and there you are, frontend and backend all in one!

# Installation

To install you run:

`yarn install`

_NOTE: You can also use NPM is you prefer!_

# Starting The Stack

To start the web application / server please run this in the terminal:

`yarn start`

You can then access the web application by navigating to

`http://localhost:8080`

Please note there is actually two servers running here:

```
// Serves our static (frontend) content and acts as a reverse proxy to the express server
Webpack => (http://localhost:8080)
```

and...

```
// Contains all RESTful API calls for checking, listing and storing palindromes
Express => (http://localhost:3000)
```

## Reverse Proxying

We are using `webpack-dev-server` with reverse proxying enabled to forward requests like so:

http://localhost:8080/api => http://localhost:3000

# Testing

To test please run the following:

`yarn test`

This will test the web application and the express server. Testing here is strictly unit test based, no integration tests (i.e. Selenium, Puppeteer)

## Live Testing

If you want to develop while your program you can run the following command:

`yarn test:watch`
