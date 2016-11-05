const fs = require('fs');
const os = require('os');
const spawn = require('child_process').spawn;
const express = require('express')
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());

let commandify = (c) => `#compute 1 {${c}}.`
const answerSet = './family.lp';
const querySet = './run.lp';

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/query', (req, res) => {
  const query = req.body.query;

  fs.readFile(answerSet, 'utf8', (err, data) => {
    if (err) throw err;

    const lines = data.split(os.EOL);

    lines.push(commandify(query));
    
    fs.writeFile (querySet, lines.join("\n"), (err) => {
        if (err) throw err;

        const sasp = spawn('sasp', ['-a', querySet]);

        sasp.stdout.on('data', (data) => {
          res.send(`${data}`);
          console.log(`stdout: ${data}`);
        });

        sasp.stderr.on('data', (data) => {
          res.send(`${data}`);
          console.log(`stderr: ${data}`);
        });

        sasp.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });

    });
  });
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
