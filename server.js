var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors())
const fs = require('fs');
const data = require('./data');
const dir = "./upload/";
//var analisador = require('./analisador.js');

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

/* const contentFilePath = './content.json'

function save(content){
  const contentString = JSO[0]N(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(){
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save, load
} */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    const arq = "./upload/" + file.originalname;
    if (!fs.existsSync(arq)){
      cb(null, file.originalname )
    }
    else{
      cb(null, 'Cópia ' + ' - ' + file.originalname )
    }     
  }
})

var upload = multer({ storage: storage }).array('file')
  
var read = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    const arq = "./upload/" + file.originalname;
    if (!fs.existsSync(arq)){
      cb(null, file.originalname )
    }
    else{
      cb(null, 'Cópia ' + ' - ' +file.originalname )
    }     
  }
})

var select = data.filter( element => element.ip === "192.168.1.1")
var insert = data.filter( element => element.ip === "192.168.1.2")
var deletar = data.filter( element => element.ip === "192.168.1.3")

app.get('/',function(req,res){
    return res.send('Servirdor ok.')
})

app.get('/select',function(req,res){
  res.json(select)
})

app.get('/insert',function(req,res){
  res.json(insert)
})

app.get('/delete',function(req,res){
  res.json(deletar)
})

app.get('/success', (request, reply) => {
  const schnackDomain = getSchnackDomain();
  reply.send(`<script>
    document.domain = '${schnackDomain}';
    window.opener.__schnack_wait_for_oauth();
  </script>`);
});

app.get('/signout', (request, reply) => {
  delete request.session.passport;
  reply.send({ status: 'ok' });
});


app.put('/update', (req, res) => {
  const { index } = req.params; // recupera o index com os dados
  const { name } = req.body;
  
  data[index] = name; // sobrepõe o index obtido na rota de acordo com o novo valor
  
  return res.json(data);
  });

app.post('/upload',function(req, res) {
    
    upload(req, res, function (err) {
     
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        } 
        
        return res.status(200).send(req.file)
      })
});

app.post('/read',function(req, res) {
    
  upload(req, res, function (err) {
   
      if (err instanceof multer.MulterError) {
          return res.status(500).json(err)
      } else if (err) {
          return res.status(500).json(err)
      } 
      
      return res.status(200).send(req.file) 
    })
});

app.post('/setting/:property/:value', (request, reply) => {
  const { property, value } = request.params;
  const user = getUser(request);
  if (!isAdmin(user)) return reply.status(403).send(request.params);
  const setting = value ? 1 : 0;
  db.run(queries.set_settings, [property, setting], err => {
    if (error(err, request, reply)) return;
    reply.send({ status: 'ok' });
  });
});
const requestListener = function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(`<html><body><h1>This is HTML</h1></body></html>`);
};
app.listen(8000, function() {
    console.log('App running on port 8000');
    requestListener
});