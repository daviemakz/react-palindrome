'use strict';

import { isURL } from 'validator';

// Import consts
import {
  port,
  route,
  host,
  successCode,
  failureCode,
  defaultServerPath,
  palindromeList
} from './constants';

// Setting to verify URL
const urlSettings = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: false,
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: true
};

// Test suite
describe('constants', () => {
  test('port is within valid range (admin permissions needed to bind below 1024)', () => {
    expect(port).toBeGreaterThanOrEqual(1024);
    expect(port).toBeLessThanOrEqual(65535);
  });
  test('successCode is HTTP 200', () => {
    expect(successCode).toEqual(200);
  });
  test('failureCode is HTTP 400', () => {
    expect(failureCode).toEqual(400);
  });
  test('host is a valid URL', () => {
    expect(isURL(`http://${host}`, urlSettings)).toEqual(true);
  });
  test('route', () => {
    expect(route).toEqual('palindromes');
  });
  test('defaultServerPath', () => {
    expect(isURL(defaultServerPath, urlSettings)).toEqual(true);
    expect(defaultServerPath).toEqual(`http://${host}:${port}/${route}`); // Ensure the URL is assembled properly
  });
  test('palindromeList', () => {
    expect(palindromeList).toEqual([]);
  });
});
