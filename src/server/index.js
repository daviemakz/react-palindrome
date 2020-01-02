'use strict';

// Load NPM modules
import express from 'express';
import { isEqual } from 'lodash';

// Import settings for server
import { getResponseBody } from './utility';
import {
  port,
  host,
  palindromeList,
  successCode,
  failureCode
} from './constants';

// Init server to configure
const app = express();

// Check if something is a palindrome
export const checkPalindromes = stringToTest => {
  // Anything which isnt a string we return early false
  if (typeof stringToTest !== 'string') {
    return false;
  }
  // Split the string, remove whitespace and symbols
  const originalString = stringToTest
    .toLowerCase()
    .replace(/\W+/g, '')
    .split('');
  // Reverse the string and check for deep equality
  const reversedString = [].concat(originalString).reverse();
  // Return the result
  return isEqual(originalString, reversedString);
};

// parse application/json (normally you can not always be sure of this)
app.use(express.json());

// Define route GET
app.get('/palindromes', (req, res) =>
  res.status(successCode).send(getResponseBody(successCode, palindromeList))
);

// Define route POST
app.post('/palindromes', (req, res) =>
  checkPalindromes(req.body.data)
    ? void palindromeList.push(req.body.data) ||
      res.status(successCode).send(getResponseBody(successCode, true))
    : res.status(failureCode).send(getResponseBody(failureCode, false))
);

// Define the function which will launch the server
export const getServer = (callback = () => void 0) =>
  app.listen(port, host, _err => {
    if (_err) {
      throw new Error(_err);
    }
    // Kill the process on recieving SIGINT or SIGTERM
    ['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => process.exit());
    });
    return callback();
  });

// Only start the server if not in test mode
process.env.NODE_ENV !== 'test' && getServer();
