"use strict";

// Import consts
import {
  port,
  route,
  host,
  successCode,
  failureCode,
  defaultServerPath,
  palindromeList
} from "./constants";

// Test suite
describe("constants", () => {
  test("port", () => {
    expect(port).toEqual(3000);
  });
  test("successCode", () => {
    expect(successCode).toEqual(200);
  });
  test("failureCode", () => {
    expect(failureCode).toEqual(400);
  });
  test("host", () => {
    expect(host).toEqual("localhost");
  });
  test("route", () => {
    expect(route).toEqual("palindromes");
  });
  test("defaultServerPath", () => {
    expect(defaultServerPath).toEqual("http://localhost:3000/palindromes");
  });
  test("palindromeList", () => {
    expect(palindromeList).toEqual([]);
  });
});
