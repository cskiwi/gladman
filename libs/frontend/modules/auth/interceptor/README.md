---
title: '@app/frontend-modules-auth/interceptor'
description: 'Authentication interceptor and GraphQL HTTP failure diagnostics.'
---

## Overview

Secondary entry point of `@app/frontend-modules-auth`. It can be used by importing from `@app/frontend-modules-auth/interceptor`.

## GraphQL request diagnostics

Failed GraphQL HTTP requests emit `GraphQL HTTP request failed:` followed by JSON in the server logs during SSR,
or in the browser console for client requests. All named operations are included; unnamed queries use `<anonymous>`.
This supplements existing service-level error logs, including `Failed to fetch user:`.

Diagnostics include the operation name, endpoint (without query parameters), method, execution platform, auth-cookie presence,
HTTP status, and network cause names and connection
details such as `ECONNREFUSED`, address, and port. Tokens, cookie values, request variables, response bodies, and raw
transport messages are not logged. The original error continues unchanged; no retries or authentication changes are made.
