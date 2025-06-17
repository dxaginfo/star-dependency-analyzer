# Setup Instructions

The Star Player Dependency Analyzer is a client-side web application that requires no server-side components or complex build process. This makes it extremely simple to set up and run.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/star-dependency-analyzer.git
   ```

2. Navigate to the project directory:
   ```bash
   cd star-dependency-analyzer
   ```

3. Open `index.html` in your web browser:
   - Double-click the `index.html` file
   - Or open it using your favorite browser (e.g., `firefox index.html` or `chrome index.html`)

That's it! The application will run directly in your browser without needing any additional setup or installation.

## GitHub Pages Deployment

For a live demo or easy sharing, you can deploy the application to GitHub Pages:

1. Go to the repository settings on GitHub
2. Navigate to the "Pages" section
3. Set the source to the "main" branch
4. Save the configuration

GitHub will provide you with a URL where the application is accessible.

## Development Setup

If you want to modify the application, you'll need a text editor or IDE. Here are a few recommended options:

- Visual Studio Code
- Sublime Text
- Atom
- WebStorm

Since this is a simple HTML/CSS/JavaScript application, you don't need any special development tools or build processes.

## Directory Structure

```
star-dependency-analyzer/
├── index.html             # Main entry point and UI
├── css/
│   └── styles.css         # Application styles
├── js/
│   └── app.js             # Application logic
└── docs/                  # Documentation
    ├── architecture.md    # Architecture overview
    └── setup.md           # This setup guide
```

## Dependencies

The application uses the following external libraries, which are loaded via CDN:

- Bootstrap 5.3.0 (CSS and JS)
- Bootstrap Icons 1.10.0
- Chart.js (latest version)

No additional dependency installation is required as these are loaded directly from CDN in the HTML file.

## Browser Compatibility

The application is compatible with all modern browsers that support ES6 JavaScript features:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

## Local Storage

The application uses browser localStorage to save assessment data. This data is stored locally on the user's device and is not transmitted to any server. Users can clear this data by:

1. Clearing their browser's local storage
2. Using the "New Assessment" button in the application

## Troubleshooting

If you encounter any issues:

1. Make sure you're using a modern, up-to-date browser
2. Check that JavaScript is enabled in your browser
3. If charts aren't rendering, ensure your browser is not blocking third-party scripts

## Further Assistance

If you need additional help or have questions:

- Open an issue on the GitHub repository
- Refer to the architecture documentation for more details about how the application works