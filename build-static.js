const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create out directory if it doesn't exist
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy static files to out directory
const staticDir = path.join(__dirname, 'static');
if (fs.existsSync(staticDir)) {
  console.log('Copying static files to out directory...');
  
  // Copy all files from static directory to out directory
  const files = fs.readdirSync(staticDir);
  files.forEach(file => {
    const sourcePath = path.join(staticDir, file);
    const destPath = path.join(outDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // If it's a directory, copy it recursively
      copyDirRecursive(sourcePath, destPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(sourcePath, destPath);
    }
  });
  
  console.log('Static files copied successfully!');
} else {
  console.error('Static directory not found!');
  process.exit(1);
}

// Function to copy a directory recursively
function copyDirRecursive(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
} 