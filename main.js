const fs = require('fs');
const os = require('os');
const spawn = require('child_process').spawn;
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const AWS = require('aws-sdk'); 
const awsUtil = require('./awsHelper.js');

app.use(bodyParser.json());

let commandify = (c) => `#compute 1 {${c}}.`
const answerSet = './family.lp';
const querySet = './run.lp';
let lasterr = '';

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/:project/create', (req, res) => {
  const project = req.params.project

  awsUtil.createProject(project, (err, data) => {
    if (err) {
      res.send("err");
    } else {
      res.send("good");
    }
  });
});

app.post('/:project/upload', (req, res) => {
  const text = req.body.text;
  const project = req.params.project

  awsUtil.uploadFileWithPath(project, text, (err, data) => {
    if (err) {
      res.send("err");
    } else {
      res.send("good");
    }
  });
});

app.post('/:project/query', (req, res) => {
  const query = req.body.query;
  const project = req.params.project

  awsUtil.readFileWithPath(project, (err, data) => {
    if (err) throw err;

    data = data.Body.toString('ascii');

    const lines = data.split(os.EOL);

    lines.push(commandify(query));
    
    fs.writeFile (querySet, lines.join("\n"), (err) => {
        if (err) throw err;

        const sasp = spawn('sasp', ['-a', querySet]);

        sasp.stdout.on('data', (data) => {
          const strData = `${data}`;
          const json = { "output": strData, "success": (strData.indexOf("false.") === -1) }
          res.send(JSON.stringify(json));
          console.log(`stdout: ${data}`);
        });

        sasp.stderr.on('data', (data) => {
          const strData = `${data}`;
          const json = { "output": strData, "error": true }
          try {
            res.send(JSON.stringify(json));
          } catch (ignore) {}
          console.log(`stderr: ${data}`);
        });

    });
  });
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
