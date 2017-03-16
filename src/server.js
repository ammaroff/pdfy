const phantom = require('phantom')
const express = require('express')
const randomstring = require('randomstring')
const fs = require('fs')

let app = express()

 
app.get('/', async (req, res) => {
  const file = await capture('https://stackoverflow.com/');
  var fileContent = fs.readFileSync(file);

  var img = new Buffer(fileContent);
  fs.unlinkSync(file);
  console.log('image length', fileContent.length);
  res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': fileContent.length
    });
    res.end(fileContent);
});
 

app.listen(80);
 console.log("listening http://localhost:80");

 function addA4StyleString() {
    var node = document.createElement('style');
    node.innerHTML = "@page {" +
    "size: 21cm 29.7cm;"+
    "margin: 10mm 10mm 10mm 10mm;"+
    "orphans:4;"+
    "widows:2;"+
    "}"+
    ""+
    "html,"+
    "body {"+
    "    height: 100%;"+
    "}"+
    ""+
    "body {"+
    "    margin:0;"+
    "    zoom: 1;"+
    "}";
    document.body.appendChild(node);
}
const capture = async function(url) {
    const instance = await phantom.create();
    const page = await instance.createPage();


    // await page.on("onResourceRequested", function(requestData) {
    //    // console.info('Requesting', requestData.url)
    // });
    var dpi = 150.0, dpcm = dpi/2.54;
    var widthCm = 21.0, heightCm = 29.7; // A4
 
    const status = await page.open(url);
    await page.evaluate(addA4StyleString);
    await page.property('viewportSize',{ width: Math.round(widthCm * dpcm), height: Math.round(heightCm * dpcm) });  
    await page.property('paperSize',{width: Math.round(widthCm * dpcm)+'px', height: Math.round(heightCm * dpcm)+'px', orientation: 'portrait', margin: '1cm' }) ;
    await page.property('settings',{dpi: dpi}) ;
    
    await page.property('zoomFactor', 1.0);
    console.log(status);
    const file = randomstring.generate() + '.pdf';
    await page.render(file);
    // const content = await page.property('content');
    
 
    await instance.exit();
    return file;
};