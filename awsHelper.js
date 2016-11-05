'use strict';

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

function readFileCallback(err,data){ 
  if (err) {
      console.log(err, err.stack); // an error occurred
      return err;
    } else {
       console.log(data.Body.toString('ascii'));           // successful response
       return data.Body.toString('ascii');
    }   
}

var s3 = new AWS.S3(); 

//readFile(readFileCallback);


var projName = "";

module.exports = 
{

createProject: function(projectName,callback) {
  projName = projectName; //set the master project name
  var params = {Bucket: 'sasp', Key: projectName + '/main.txt', Body: templateFile};
  s3.putObject(params,callback);
},

readFile: function (callback) {
  var params = {Bucket: 'sasp', Key: projName+'/main.txt'};
  s3.getObject(params, callback);
}, 

readFileWithPath:function(project,callback) {
  projName = project;

  var params = {Bucket: 'sasp', Key: project+'/main.txt'};
  s3.getObject(params, callback);
},

uploadFile:function(modifiedText,callback) {
   var params = {Bucket: 'sasp', Key: projName + '/main.txt', Body: modifiedText};
  s3.putObject(params, callback);   

},

uploadFileWithPath:function(project,modifiedText,callback) {
   var params = {Bucket: 'sasp', Key: project + '/main.txt', Body: modifiedText};
  s3.putObject(params, callback);   

}

}




