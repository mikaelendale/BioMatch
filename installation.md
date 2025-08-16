# Instructions to run a React project locally

1.  Open a terminal and navigate to your project directory.

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Add the GRQ API to your project:

    - Import and use the GRQ API in your React code.
    - For example, in your component file `src/utils/ai-insights.ts`:

    ```js
    // Use the API as needed
    const groq = new Groq({
      apiKey: "<your-groq-api-key>", // not added for production
      dangerouslyAllowBrowser: true,
    });
    ```

4.  Start the development server:

    ```bash
    npm start
    ```

5.  Open your browser and go to http://localhost:5173 to view the app.
