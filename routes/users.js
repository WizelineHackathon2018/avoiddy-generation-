var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const config = {
  accessKeyId: '',
  secretAccessKey: '',
  region:'us-east-2'
}

router.get('/:message', function(req, res, next) {
   var message = req.params.message;
  const config = {
    accessKeyId: '',
    secretAccessKey: '',
    region:'us-east-1'
  }
  const lex = new AWS.LexRuntime(config);
   var params = {
   botAlias: 'hack', /* required */
   botName: 'PruebaWZH', /* required */
   inputText: message, /* required */
   userId: 'jvalenzu', /* required */
 };
 lex.postText(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else  {
     var mess = data['message'];
     if(mess == 'I just sent a copy of your contract to your email '){
       sendEmail();
     }else if(message == 'call'){
       startCall();
       res.send('');
     }
     res.send(mess);
   }
 });
});


function sendEmail(){
  console.log('envio correo');
  var sns = new AWS.SNS(config);
  var params = {
    Message: 'Hola como estas! te saluda SmartBot', /* required */
    Subject: 'Respuesta a tu mensaje',
    TopicArn: ''
    };
  sns.publish(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

function startCall(){
  var params2 = {
    ContactFlowId: '35fc2338-4f6b-42c4-93a6-918b3479f864', /* required */
    InstanceId: '6bc2b28a-f941-442d-8650-d389b02a116c', /* required */
    QueueId: 'd5ec7577-25d4-4406-9b08-ac669bbd38d5',
    SourcePhoneNumber: '+5218008720356'
  };
  var connect = new AWS.Connect({
    accessKeyId: '',
    secretAccessKey: '',
    region:'us-east-1'
  });

  connect.startOutboundVoiceContact(params2, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred          // successful response
  });
}


module.exports = router;
