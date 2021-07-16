const readline = require('readline');
const fs = require('fs'); 
const rl = readline.createInterface({ input: fs.createReadStream('./upload/arquivo1.txt') });

// regex
var ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
var matriculaFormat = /^([c|C][0-9]{7}|[c|C][0-9]{7}[-][0-9]|[e|E][0-9]{7}|[e|E][0-9]{7}[-][0-9]|[f|F][0-9]{7}|[f|F][0-9]{7}[-][0-9]|[z|Z][0-9]{7}|[z|Z][0-9]{7}[-][0-9])$/
var comentFormat = /^([<][!][-][-].*.[-][-][>]|[/][/].*$|[/][*].*$)$/

var rsaPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[r|R][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[e|E][n|N][d|D]\s[r|R][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[b|B][e|E][g|G][i|I][n|N]\s[r|R][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y][0-9|a-z|A-Z|\s]*[e|E][n|N][d|D]\s[r|R][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var begin_rsaPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[r|R][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var end_rsaPrivateFormat = /^(-*[e|E][n|N][d|D]\s[r|R][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/

var opensshPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[o|O][p|P][e|E][n|N][s|S][s|S][h|H]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[e|E][n|N][d|D]\s[o|O][p|P][e|E][n|N][s|S][s|S][h|H]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var begin_opensshPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[o|O][p|P][e|E][n|N][s|S][s|S][h|H]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var end_opensshPrivateFormat = /^(-*[e|E][n|N][d|D]\s[o|O][p|P][e|E][n|N][s|S][s|S][h|H]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/

var dsaPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[d|D][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[e|E][n|N][d|D]\s[d|D][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var begin_dsaPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[d|D][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var end_dsaPrivateFormat = /^(-*[e|E][n|N][d|D]\s[d|D][s|S][a|A]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/

var ecPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[e|E][c|C]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[e|E][n|N][d|D]\s[e|E][c|C]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var begin_ecPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[e|E][c|C]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var end_ecPrivateFormat = /^(-*[e|E][n|N][d|D]\s[e|E][c|C]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/

var pgpPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[p|P][g|G][p|P]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[e|E][n|N][d|D]\s[p|P][g|G][p|P]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var begin_pgpPrivateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[p|P][g|G][p|P]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var end_pgpPrivateFormat = /^(-*[e|E][n|N][d|D]\s[p|P][g|G][p|P]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/

var privateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*|-*[e|E][n|N][d|D]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var begin_privateFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/
var end_privateFormat = /^(-*[e|E][n|N][d|D]\s[p|P][r|R][i|I][v|V][a|A][t|T][e|E]\s[k|K][e|E][y|Y]-*)$/

var pkcs7Format = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[p|P][k|K][c|C][s|S][7]-*|-*[e|E][n|N][d|D]\s[p|P][k|K][c|C][s|S][7]-*)$/
var begin_pkcs7Format = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[p|P][k|K][c|C][s|S][7]-*)$/
var end_pkcs7Format = /^(-*[e|E][n|N][d|D]\s[p|P][k|K][c|C][s|S][7]-*)$/

var _3desFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[3][d|D][e|E][s|S]-*|-*[e|E][n|N][d|D]\s[3][d|D][e|E][s|S]-*)$/
var begin_3desFormat = /^(-*[b|B][e|E][g|G][i|I][n|N]\s[3][d|D][e|E][s|S]-*)$/
var end_3desFormat = /^(-*[e|E][n|N][d|D]\s[3][d|D][e|E][s|S]-*)$/

// arrays
var ipLista = new Array("")
var matriculaLista = new Array("")
var comentLista = new Array("")
var rsaPrivateLista = new Array("")
var opensshPrivateLista = new Array("")
var dsaPrivateLista = new Array("")
var ecPrivateLista = new Array("")
var pgpPrivateLista = new Array("")
var privateLista = new Array("")
var pkcs7Lista = new Array("")
var _3desLista = new Array("")
var arrayFormat = new Array("")

Tratamento = (count, lista) => {

  if(count === 1){
    console.log('1 match identificado: ' + lista + '.\n')
  }
  else if(count > 1){
    console.log(count + ' matchs identificados: ' + lista + '.\n')
  }

}

BeginEnd = (lista) => {

  var conteudo = new Array("")
  var begin_chaves = [begin_rsaPrivateFormat, begin_opensshPrivateFormat, begin_dsaPrivateFormat, begin_ecPrivateFormat, begin_pgpPrivateFormat, begin_privateFormat, begin_pkcs7Format, begin_3desFormat]
  var end_chaves = [end_rsaPrivateFormat, end_opensshPrivateFormat, end_dsaPrivateFormat, end_ecPrivateFormat, end_pgpPrivateFormat, end_privateFormat, end_pkcs7Format, end_3desFormat]

  for(var x = 0; x<begin_chaves.length; x++) {
    
    for(var y = 0; y<lista.length; y++) {

      if( begin_chaves[x].test(lista[y]) ){
        while(!end_chaves[x].test(lista[y]))
          conteudo += lista[y]
      }
    }
  }  

  console.log('teste:  '+conteudo)
}

// Leitura por combinação de regex
Filtros = (strings, arrayFormat, arrayLista) => {

  var arrayCount = new Array("")

  if(strings.length>0){

    for(var i = 0; i<arrayFormat.length; i++) {
      
      arrayCount.push(0);

      for(var j = 0; j<strings.length; j++) {
        if ( arrayFormat[i].test(strings[j]) ){
          arrayCount[i]++;
          if(arrayCount[i] === 1) {
              arrayLista[i] += strings[j] 
              BeginEnd(arrayLista[i])
          }         
          else if( arrayCount[i] > 1){
              arrayLista[i] += ', ' + strings[j] 
              BeginEnd(arrayLista[i])
          } 
        }    

      }
    }
    
    for(var k = 0; k<arrayLista.length; k++) { 
      Tratamento(arrayCount[k], arrayLista[k]) 
    }

  }

  else{
    console.log("Erro. Tamanho inválido de entrada: " + strings.length) 
  }
  
}

const line_counter = ((i = 0) => () => ++i)();

// Leitor
rl.on('line', (line, lineno = line_counter(), input) => {

  // Cada linha
  console.log('Conteúdo: ' + line);

  // Arrays
  var test = line.trim().split( "'" );

  var arrayFormat = [ ipFormat, matriculaFormat, comentFormat, rsaPrivateFormat, opensshPrivateFormat, 
    dsaPrivateFormat, ecPrivateFormat, pgpPrivateFormat, privateFormat, pkcs7Format, _3desFormat ]    

  var arrayLista = [ ipLista, matriculaLista, comentLista, rsaPrivateLista, opensshPrivateLista, 
    dsaPrivateLista, ecPrivateLista, pgpPrivateLista, privateLista, pkcs7Lista, _3desLista ]
  
  // Analisador
  Filtros(test, arrayFormat, arrayLista)

  //Contador de linha
  console.log(lineno)

});

// Finalizador
rl.on('close', () => {
  console.log('Fim do arquivo.');
});

