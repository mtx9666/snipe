const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clean the build directories
console.log('Cleaning build directories...');
try {
  if (fs.existsSync('.next')) {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rmdir /s /q out', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error cleaning directories:', error);
}

// Run the build
console.log('Building the project...');
try {
  execSync('next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building the project:', error);
  process.exit(1);
}

// Create a simple not-found page if it doesn't exist
const notFoundPath = path.join('out', '_not-found.html');
if (!fs.existsSync(notFoundPath)) {
  console.log('Creating not-found page...');
  const notFoundContent = `
<!DOCTYPE html>
<html>
<head>
  <title>404 - Page Not Found</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #18181b;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    h1 {
      font-size: 2.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }
    a {
      background-color: #2563eb;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    a:hover {
      background-color: #1d4ed8;
    }
  </style>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>The page you are looking for does not exist.</p>
  <a href="/">Return to Home</a>
</body>
</html>
  `;
  fs.writeFileSync(notFoundPath, notFoundContent);
}

console.log('Build completed successfully!'); 