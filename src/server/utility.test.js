'use strict';

// Import functions
import { getResponseBody, getRequestBody } from './utility';

// Reuse these, no need to define them again
const testPath = 'http://localhost:3000/palindromes';
const exampleBody = 'Dammit I\'m Mad';
const headers = {
  'Content-Type': 'application/json; charset=utf-8'
};

// Test suite
describe('utility', () => {
  describe('getResponseBody()', () => {
    test('returns expected result', () => {
      expect(getResponseBody(200, true)).toEqual({
        httpStatusCode: 200,
        result: true
      });
    });
  });
  describe('getRequestBody()', () => {
    test('returns expected result | GET', () => {
      expect(getRequestBody(testPath)('GET')).toEqual({
        headers,
        url: testPath,
        method: 'GET'
      });
    });
    test('returns expected result | POST', () => {
      expect(getRequestBody(testPath)('POST', exampleBody)).toEqual({
        headers,
        url: testPath,
        body: JSON.stringify({ data: exampleBody }),
        method: 'POST'
      });
    });
  });
});
