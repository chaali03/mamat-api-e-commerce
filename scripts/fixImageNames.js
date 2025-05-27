const fs = require('fs');
const path = require('path');

function renameFiles(directory) {
  try {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        renameFiles(filePath); // Recursively process subdirectories
      } else {
        // Clean filename
        const cleanName = file
          .replace(/^'|'$/g, '') // Remove single quotes at start or end
          .replace(/[:'()\\[\]{}]/g, '') // Remove colons, quotes, parentheses, brackets
          .replace(/\s+/g, '-'); // Replace spaces with hyphens
        
        if (cleanName !== file) {
          const newPath = path.join(directory, cleanName);
          fs.renameSync(filePath, newPath);
          console.log(`Renamed: ${file} -> ${cleanName}`);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

// Path to images directory
const imagesDir = path.join(__dirname, '../public/images');
renameFiles(imagesDir);

console.log('Image renaming complete!');