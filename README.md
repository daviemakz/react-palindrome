# Summary

# Installation

To install you run:

`yarn install`

# Start

To start the server please run this in the terminal:

`yarn start`

You can then access the web application by navigating to

`http://localhost:8080`

Please note there is actually two servers running here:

```
// Serves our content and acts as a reverse proxy to the express server
Webpack => (http://localhost:8080)
```

and...

```
// Contains all RESTFul API calls for checking, listing and storing palindromes
Express => (http://localhost:3000)
```

## Reverse Proxying

We are using webpack-dev-server with reverse proxying enabled to forward requests like so:

http://localhost:8080/api => http://localhost:3000

# Testing

To test please run the following:

`yarn test`

This will test the web application and the express server. Testing here is strictly unit test based, no integration tests (i.e. Selenium, Puppeteer)
