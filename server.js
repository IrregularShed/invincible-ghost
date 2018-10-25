// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const jsBarcode = require('jsbarcode');
const {createCanvas} = require('canvas');
const baseOptions = {
  height: 40
};

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/:value', function(request, response) {
  const canvas = createCanvas(400, 300);
  const options = Object.assign({}, baseOptions);
  
  if (request.query.hasOwnProperty('text')) {
    const val = request.query.text.toLowerCase();
    if (val === 'false' || val === '0') {
      options.text = ' ';
      options.textMargin = 0;
      options.fontSize = 0;
    }
  }
  
  if (request.query.hasOwnProperty('padding')) {
    const val = request.query.padding.toLowerCase();
    if (val === 'false' || val === '0') {
      options.margin = 0;
    }
  }
  
  jsBarcode(canvas, request.params.value, options);
  const glob = canvas.createPNGStream();
  
  response
    .set('Content-Type', 'image/png')
    .send(glob.read())
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
