"use strict";

// Get the result body (so our response always has the same format)
export const getResponseBody = (httpStatusCode, result) => ({
  httpStatusCode,
  result
});

// Get the request body for any request we want to make
export const getRequestBody = defaultServerPath => (method = "GET", reqBody) =>
  Object.assign(
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      url: defaultServerPath,
      method
    },
    // Add body if its defined
    typeof reqBody === "string"
      ? { body: JSON.stringify({ data: reqBody }) }
      : {}
  );
