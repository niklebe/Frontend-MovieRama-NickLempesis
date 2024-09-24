# Movierama - Vite Project

This is a basic **Vite** project using **Vanilla JavaScript**, along with **Vitest** for unit testing and **Playwright** for end-to-end testing.
Author: Nick Lempesis @niklebe

## Performance Optimizations and Best Practices

This project implements several performance optimizations and follows good programming practices:

1. **Infinite Scrolling**: Implemented in `infinite-scroll.js`, this technique loads content as the user scrolls, reducing initial load time and improving performance.

2. **Throttling**: Used in `search.js` to limit the frequency of search function calls, preventing excessive API requests and improving performance.

3. **Document Fragments**: In `movies.js`, `DocumentFragment` is used to batch DOM manipulations, significantly reducing reflow and repaint operations.

4. **Template Elements**: HTML `<template>` elements are used for movie, review, and similar movie items, promoting code reusability and maintainability.

5. **Lazy Loading**: Movie details (trailers, reviews, similar movies) are loaded only when a movie card is expanded, reducing initial load time and unnecessary API calls.

6. **FLIP Animation Technique**: Used in `movies.js` for smooth transitions when expanding/collapsing movie cards, providing a better user experience without sacrificing performance.

7. **Error Handling**: Comprehensive try-catch blocks are used throughout the codebase to gracefully handle and log errors.

8. **Modular Code Structure**: The project is organized into separate modules (`movies.js`, `search.js`, `infinite-scroll.js`, `utils.js`) for better maintainability and separation of concerns.

9. **Environment Variables**: Sensitive data like API keys are stored in environment variables, enhancing security.

10. **Responsive Design**: CSS in `main.css` uses responsive design techniques to ensure the application looks good on various screen sizes.

11. **Asynchronous Operations**: Extensive use of async/await for handling asynchronous operations, improving code readability and error handling.

12. **Unit and E2E Testing**: Implemented with Vitest and Playwright respectively, ensuring code reliability and easier maintenance.

These optimizations and practices contribute to a faster, more efficient, and maintainable application.

## Project Setup

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/en/) (version 14.18.0 or later)
- [npm](https://www.npmjs.com/) (version 6.0.0 or later)

### Install Dependencies

After cloning the project, run the following command in the root directory to install the project dependencies:

```bash
npm install
```

You will also need to create a .env and add the environment variable VITE_TMDB_API_KEY=xxxxx accordingly.

## Development

To start the development server, run:

```bash
npm run dev
```

This will launch the Vite development server, which will allow you to develop your project in real-time with hot-reloading. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Build for Production

To build the project for production, run:

```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

### Preview the Build

Once you've built the project, you can preview the production build locally by running:

```bash
npm run preview
```

This will start a local server to view the built version of the app at [http://localhost:4173](http://localhost:4173).

## Testing

### Unit Testing with Vitest

Unit tests are handled with **Vitest**. To run all unit tests, use the following command:

```bash
npm run test:unit
```

This will run the tests in the DOM environment using the `happy-dom` library for simulating the browser environment in a Node.js environment.

### End-to-End Testing with Playwright

For end-to-end (E2E) testing, **Playwright** is used. To run some simple tests on a preinstalled Chromium instance (on Linux), do:

```bash
npm run test:e2e
```

This will run the E2E tests in tests/e2e and log in the command line. If it complains about browser installation, you may need to point to your preinstalled Chromium in playwright.config.js, or run

```bash
npx install playwright
```

to install new browsers.
