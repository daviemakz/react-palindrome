"use strict";

// Define server settings
export const port = 3000;
export const host = "localhost";
export const route = `palindromes`;

// Define default route
export const defaultServerPath = `http://${host}:${port}/${route}`;

// Just store the results in an array at the top level and push to it when needed
export const palindromeList = [];

// HTTP codes
export const successCode = 200;
export const failureCode = 400;
