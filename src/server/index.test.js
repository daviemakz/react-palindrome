"use strict";

// Import resources
import { getServer, checkPalindromes } from ".";
import { defaultServerPath } from "./constants";
import { getRequestBody } from "./utility";
import request from "request";

// Generic test for all API calls, use currying so we can reuse the code below
const testResult = ([result, httpStatusCode]) => done => (
  error,
  response,
  body
) => {
  if (response?.statusCode === 500) {
    throw new Error("Error with server:" + body);
  }
  // Dont bother checking the body if we hit a 404
  httpStatusCode !== 404 &&
    expect(JSON.parse(body)).toEqual({
      httpStatusCode,
      result
    });
  expect(error).toBeNull();
  expect(response?.statusCode).toEqual(httpStatusCode);
  done();
};

// Define test variables
const validPalindrome = "Dammit I'm Mad";
const invalidPalindrome = "abcde fghij";

describe("server", () => {
  describe("functions", () => {
    describe("checkPalindromes()", () => {
      test("true when a palindrome is found", () => {
        const result = checkPalindromes(validPalindrome);
        expect(result).toEqual(true);
      });
      test("true when a palindrome is NOT found", () => {
        const result = checkPalindromes(invalidPalindrome);
        expect(result).toEqual(false);
      });
    });
  });

  describe("express", () => {
    describe("responding to requests", () => {
      let server;

      beforeAll(done => {
        server = getServer(done);
      });
      afterAll(done => {
        server.close();
        done();
      });

      test("GET /palindromes | recieves a result with an empty array", done => {
        const requestBody = getRequestBody(defaultServerPath)("GET");
        const resultTesterFunction = testResult([[], 200])(done);
        request(requestBody, resultTesterFunction);
      });

      test("POST /palindromes | recieves a result with 'true' to say its a valid palindrome", done => {
        const requestBody = getRequestBody(defaultServerPath)(
          "POST",
          validPalindrome
        );
        const resultTesterFunction = testResult([true, 200])(done);
        request(requestBody, resultTesterFunction);
      });

      test("POST /palindromes | recieves a result with 'false' to say its a valid palindrome", done => {
        const requestBody = getRequestBody(defaultServerPath)(
          "POST",
          invalidPalindrome
        );
        const resultTesterFunction = testResult([false, 400])(done);
        request(requestBody, resultTesterFunction);
      });

      test("GET /palindromes | recieves a result with an non-empty array", done => {
        const requestBody = getRequestBody(defaultServerPath)("GET");
        const resultTesterFunction = testResult([[validPalindrome], 200])(done);
        request(requestBody, resultTesterFunction);
      });

      test("GET /palindromes/foo/bar | 404 for all other results", done => {
        const requestBody = getRequestBody(`${defaultServerPath}/foo/bar`)(
          "GET"
        );
        const resultTesterFunction = testResult([null, 404])(done);
        request(requestBody, resultTesterFunction);
      });
    });
  });
});
