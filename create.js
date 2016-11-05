var AWS = require('aws-sdk'); 
var fs = require('fs')

//Set Amazon Credentials
AWS.config.update({
    accessKeyId: "AKIAJURJT6TKRTQZABTA",
    secretAccessKey: "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"
});

//Fetch the Template for main.lp (Family)
var templateFile = "";
fs.readFile('template/family.lp', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  templateFile = data;
});


var s3 = new AWS.S3(); 


//createProject("sample");

readFile("sample/main.txt");

function createProject(projectName) {

 s3.createBucket({Bucket: 'sasp'}, function() {

  var params = {Bucket: 'sasp', Key: projectName + '/main.txt', Body: templateFile};

  s3.putObject(params, function(err, data) {

      if (err){
          console.log(err)     
      } else {
           console.log("Successfully uploaded data to sasp/"+projectName);   
      }
      

   });

});
}


function readFile(projectPath) {

var params = {Bucket: 'sasp', Key: projectPath};

 s3.getObject(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data.Body.toString('ascii'));           // successful response
});



}

