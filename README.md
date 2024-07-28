# LINE Bot Order System

This project is a LINE Bot Order System built using Express.js, MySQL, Google Sheets API, and the LINE Bot SDK.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/PaiKai-Lee/line-bot-order-system.git
    cd line-bot-order-system
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up MySQL:

    - Create a database and import the schema from `src/database/init.sql`.

4. Set up Google Sheets API:

    - Create a project in the [Google Developer Console](https://console.developers.google.com/).
    - Enable the Google Sheets API.
    - Click blue "+ CREATE CREDENTIALS" and select "Service account" option.
    - Click "+ CREATE KEY" button
    - Select the "JSON" key type option
    - Save JSON file as `credentials.json` in the root directory of the project.

5. Configure LINE Bot SDK:

    - Create a LINE bot on the [LINE Developers Console](https://developers.line.biz/console/).
    - Get your channel access token and channel secret.

## Configuration

COPY `.env.example` as `.env` file in the root directory and fill in environment variables.

## Usage

```bash
npm run dev
```
