const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 2000;

let consoleOutput = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/command', (req, res) => {
  const command = req.body.command.trim();
  console.log(`Received command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      res.status(500).json({ error: 'Error executing command' });
      return;
    }

    console.log(`Command output: ${stdout}`);
    console.error(`Command errors: ${stderr}`);

    const result = stdout || stderr;
    consoleOutput.push(result);

    // Gửi kết quả về cho trình duyệt
    res.json({ consoleOutput });

    // In kết quả ra console của máy chủ
    console.log(`Command output (server): ${result}`);
  });
});

app.post('/editFile', (req, res) => {
  const { fileName, content } = req.body;
  console.log(`Editing file: ${fileName}`);

  fs.writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error editing file: ${err}`);
      res.status(500).json({ error: 'Error editing file' });
      return;
    }

    console.log(`File ${fileName} edited successfully`);
    res.json({ message: 'File edited successfully' });
  });
});

app.get('/files', (req, res) => {
  const directoryPath = req.query.directory || process.cwd(); 
  getAllFilesAndFolders(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      res.status(500).json({ error: 'Error reading directory' });
      return;
    }
    res.json({ files });
  });
});

function getAllFilesAndFolders(directoryPath, callback) {
  let files = [];
  fs.readdir(directoryPath, (err, dirItems) => {
    if (err) {
      callback(err);
      return;
    }

    dirItems.forEach((item) => {
      const itemPath = path.join(directoryPath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();
      files.push({ name: item, type: isDirectory ? 'directory' : 'file' });
    });
    callback(null, files);
  });
}

app.get('/file/:fileName', (req, res) => {
  const { fileName } = req.params;

  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      res.status(500).json({ error: 'Error reading file' });
      return;
    }
    res.json({ content: data });
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
