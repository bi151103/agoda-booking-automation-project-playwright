# Agoda Booking Automation Project with Playwright

This project includes steps to set up and run the automated tests.

## Prerequisites

- Node.js version 18 or higher (compatible with Playwright 1.49.0). Download from [nodejs.org](https://nodejs.org/).

## Getting Started

1. Install the project dependencies:
    ```bash
   npm install
   ```

2. Download the Playwright browser binaries with dependencies:
   ```bash
   npx playwright install --with-deps
   ```

3. Clone the example environment file and set the base URL:
   ```bash
   cp example.env .env
   ```
   Then edit `.env` and set the `BASE_URL` value to `https://agoda.com`.

4. Run the tests:
   ```bash
   npm test
   ```