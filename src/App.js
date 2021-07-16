import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import Select from 'react-select'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
const dir = "./upload";
const arquivos = new FormData() 

for(var x = 0; x<dir.length; x++) {
  arquivos.append(null, dir[x].originalname)
}

const arqs = [
  { value: 'arquivo1', label: 'arquivo1' },
  { value: 'arquivo2', label: 'arquivo2' },
  { value: 'arquivo3', label: 'arquivo3' },
];

const formats = [
  { value: 'ip', label: 'Ip' },
  { value: 'matricula', label: 'MatrÍcula' },
  { value: 'comentario', label: 'Comentário' },
  { value: 'rsaPrivate', label: 'Rsa Private' },
  { value: 'opensshPrivate', label: 'Openssh Private' },
  { value: 'dsaPrivate', label: 'Dsa Private' },
  { value: 'ecPrivate', label: 'Ec Private' },
  { value: 'pgpPrivate', label: 'Pgp Private' },
  { value: 'private', label: 'Private' },
  { value: 'pkcs7', label: 'Pkcs7' },
];

class App extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        selectedOption: null,
        loaded:0,
        firstName: "",
        lastName: ""
      }
  }

  checkMimeType=(event)=>{
    
    let files = event.target.files 
    let err = []
    const types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html']
    
    for(var x = 0; x<files.length; x++) {
         if (types.every(type => files[x].type !== type)) {
         err[x] = 'O sistema não analisa arquivos do tipo ' + files[x].type;
       }
     };
     
     for(var z = 0; z<err.length; z++) {
        toast.error(err[z])
        event.target.value = null
     }
   
     return true;
  }
  
  maxSelectFile=(event)=>{
      let files = event.target.files
          if (files.length > 3) { 
            const msg = 'Selecione apenas 3 arquivos!'
            event.target.value = null
            toast.warn(msg)
            return false;
        }
      return true;
  }

  checkFileSize=(event)=>{
    let files = event.target.files
    let size = 99999999999999 
    let err = []; 
    for(var x = 0; x<files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type+' é muito grande, escolha um menor!\n';
      }
    };
    for(var z = 0; z<err.length; z++) {
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }

  onChangeHandler=event=>{
    var files = event.target.files
    if(this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)){ 
    // if return true allow to setState
      this.setState({
      selectedFile: files,
      loaded:0
      })
    }
  }

  formatsOption=event=>{
    var formats = event.target
    this.setState({
      selectedOption: formats,
      loaded:0
    })
    
  } 

  arqsOptions=event=>{
    var arqs = event.target
    this.setState({
      selectedOption: arqs,
      loaded:0
    })
    
  } 
  
  upload = () => {
    
    const data = new FormData() 

    if(this.state.selectedFile === null){
      toast.error('Selecione o arquivo!')
    }
    
    else{
      
      for(var x = 0; x<this.state.selectedFile.length; x++) {
        data.append('file', this.state.selectedFile[x])
      }
      axios.post("http://localhost:8000/upload", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
          })
        },
      })
      .then(res => { 
        toast.success('Upload realizado com sucesso!')
      })
      .catch(err => { 
        toast.error('Falha no upload! ' + err)
      })
    }

  }

  retornaLista = (array, format) => {
    
    var count = 0
    var lista = new Array("")

    for(var i = 0; i<array.length; i++) {
      if ( format.test(array[i]) ){
        count++;
        if(count === 1){
          lista += array[i] 
        }
        else{
          lista += ', ' + array[i] 
        }    
      }
    }

    return lista;

  }

  read = () => {

    const data = new FormData() 
    var strings = new Array("")
    strings = ['192.168.1.1', 'hostname', '192.168.1.3', '192.168.1.4', '1.1', 'ipteste', '999.999.999.999',
                    'C1234567', 'C1234567-8', 'E3877678', 'E3877678-2', 'F3877678', 'F3877678-2', 'Z1234567', 'Z1234567-8',
                    '<!-- Comentário em html -->', '<!-- Não é comentário em html --', '// Comentário em Java', '/* Comentário em Java */', '/ Não é um comentário em Java']
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    var matriculaFormat = /^([c|C][0-9]{7}|[c|C][0-9]{7}[-][0-9]|[e|E][0-9]{7}|[e|E][0-9]{7}[-][0-9]|[f|F][0-9]{7}|[f|F][0-9]{7}[-][0-9]|[z|Z][0-9]{7}|[z|Z][0-9]{7}[-][0-9])$/
    var comentFormat = /^([<][!][-][-].*.[-][-][>]|[/][/].*$|[/][*].*$)$/
    var listaIps = new Array("")
    var listaMatriculas = new Array("")
    var listaComent = new Array("")
    var countIps = 0
    var countMatriculas = 0
    var countComent = 0
    var l = strings.length

    if(l>0){

      for(var i = 0; i<l; i++) {
        if ( ipformat.test(strings[i]) ){
          countIps++;
          if(countIps === 1){
            listaIps += strings[i] 
          }
          else{
            listaIps += ', ' + strings[i] 
          }    
        }
      }
  
      for(var x = 0; x<l; x++) {    
        if ( matriculaFormat.test(strings[x]) ){
          countMatriculas++;
          if(countMatriculas === 1){
            listaMatriculas += strings[x] 
          }
          else{
            listaMatriculas += ', ' + strings[x] 
          }    
        }
      }
  
      for(var y = 0; y<l; y++) {
        
        if ( comentFormat.test(strings[y]) ){
          countComent++;  
          if(countComent === 1){
            listaComent += strings[y] 
          }
          else{
            listaComent += ', ' + strings[y] 
          }                   
        }

      } 

    }

    if(this.state.selectedOption === null){
      toast.error('Selecione o arquivo!')
    }
    
    else{     
      axios.post("http://localhost:8000/read", data)
      .then(res => { 
        countIps === 0 ?
          //não existe ip
          countMatriculas === 0 ? 
            //não existe matrícula
            countComent === 0 ? 
              //não existe comentário
              toast.success('Análise realizada com sucesso!\nNão há informações para os filtros aplicados!')
              :
              //existe apenas comentário
              toast.success('Análise realizada com sucesso! '
              + countComent + ' Comentário(s) identificado(s): ' + listaComent + '.')
            :
            countComent === 0 ? 
              //existe apenas matrícula
              toast.success('Análise realizada com sucesso! ' 
              + countMatriculas + ' Matrícula(s) identificada(s): ' + listaMatriculas + '. ')  
              :
              //existem matrícula e comentário
              toast.success('Análise realizada com sucesso! '              
              + countMatriculas + ' Matrícula(s) identificada(s): ' + listaMatriculas + '. '
              + countComent + ' Comentário(s) identificado(s): ' + listaComent + '.')  
          : 
          //existe ip
          countMatriculas !== 0 ?
            //existe matrícula
            countComent !== 0 ? 
              //existe comentário
              toast.success('Análise realizada com sucesso! ' 
              + countIps +' Ip(s) identificado(s): ' + listaIps + '. '
              + countMatriculas + ' Matrícula(s) identificada(s): ' + listaMatriculas + '. '
              + countComent + ' Comentário(s) identificado(s): ' + listaComent + '.')
              :
              //não existe comentário
              toast.success('Análise realizada com sucesso! ' 
              + countIps +' Ip(s) identificado(s): ' + listaIps + '. '
              + countMatriculas + ' Matrícula(s) identificada(s): ' + listaMatriculas + '. ')
            :
            //não existe matrícula  
            countComent === 0 ?  
              //não existe comentário
              toast.success('Análise realizada com sucesso! ' 
              + countIps +' Ip(s) identificado(s): ' + listaIps + '. ')
              :
              //existe comentário
              toast.success('Análise realizada com sucesso! ' 
              + countIps +' Ip(s) identificado(s): ' + listaIps + '. '             
              + countComent + ' Comentário(s) identificado(s): ' + listaComent + '.')
      })
      .catch(err => { 
        toast.error('Falha na análise! ' + err)
      })
    }
  }

  Tratamento = (count, lista) => {

    if(count === 1){
      console.log('1 match identificado: ' + lista + '.\n')
    }
    else if(count > 1){
      console.log(count + ' matchs identificados: ' + lista + '.\n')
    }
  
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
            }         
            else if( arrayCount[i] > 1){
                arrayLista[i] += ', ' + strings[j]          
            } 
          }    

        }
      }
      
      /* for(var k = 0; k<arrayLista.length; k++) { 
        Tratamento(arrayCount[k], arrayLista[k]) 
      } */

    }

    else{
      console.log("Erro. Tamanho inválido de entrada: " + strings.length) 
    }
    
  }

  Label(props){
    return <label htmlFor="filled-in-box"> {props.name} </label> ;
  } 

  CheckBox = () => {
    return (
      <input type="checkbox"
      checked={this.state.checked}
      onChange={this.handleCheckClick}
      id="filled-in-box" />
    );
  }

  render() {

    const{selectedOption } = this.state;

    return (

      <div className="container">

	      <div className="row" style={{ display: "table", margin: "0 auto", width: "100%", padding: '10% 50px 75px' }}>
          
          <Grid style={{border: '2px solid green'}}>
            <Row>

              {/* Espaçamento lateral esquerdo em branco */}
              <Col style={{width: "5%"}}></Col>
              
              {/* Upload de Arquivos */}
              <Col style={{width: "42.5%"}}>
                
                <br></br> 

                <center> <h2> Upload de Arquivos </h2> </center> <br></br>
                
                <div className="form-group files">
                  <input type="file" className="form-control" placeholder={"Selecione do pc ou solte aqui"} multiple onChange={this.onChangeHandler}/>
                </div>  
                
                <div className="form-group">
                  <ToastContainer />
                  <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>      
                </div> 

                <Row style={{padding: '1% 0% 0%'}}> 
                  <button type="button" className="btn btn-success btn-block" onClick={this.upload}>Upload</button>
                </Row>  
                
              </Col>
              
              {/* Espaçamento medial colorido */}
              <Col style={{width: "5%"}}>
                <Row style={{height: "80%", position: "relative", padding: '0% 0% 10%',
                          left: "-10%", margin: "60%", top: "0", border: "1px solid green"}}></Row>
              </Col>
              
              {/* Análise de Arquivos */}
              <Col style={{width: "42.5%"}}>
                
                <br></br> <center> <h2> Analisador de Arquivos </h2> </center> <br></br>
                
                {/* Arquivos disponíveis para filtro */}                
                <Row style={{padding: '0% 0% 1%'}}> 
                  <h5> Arquivos: </h5> 
                </Row>
                <Row>
                  <Col style={{width: "100%"}}>
                  {/* <input type="file" className="form-control" placeholder={"Selecione do pc ou solte aqui"} multiple onChange={this.onChangeHandler}/> */}
                    <Select
                      value={selectedOption}
                      onChange={this.arqsOptions}
                      options={arqs} 
                      placeholder={""}   
                    />
                  </Col>
                </Row>
                           
                {/* Filtros disponíveis */}                  
                <Row style={{padding: '1% 0% 1%'}}> 
                  <h5> Filtros: </h5> 
                </Row>
                
                <Row>
                  {/* Espaçamento lateral esquerdo em branco */}
                  <Col style={{width: "10%"}}></Col>

                  <Col style={{width: "20%"}}>
                    <this.CheckBox/> {/* <Label name="Ip" /> */} <label htmlFor="filled-in-box"> Ip </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> Matrícula </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> Comentário </label> <br></br>
                  </Col>
                  
                  {/* Espaçamento medial em branco */}
                  <Col style={{width: "10%"}}></Col>

                  <Col style={{width: "20%"}}>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> RSA </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> OPENSSH </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> DSA </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> EC </label> <br></br>
                  </Col>

                  {/* Espaçamento medial em branco */}
                  <Col style={{width: "10%"}}></Col>

                  <Col style={{width: "20%"}}>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> PGP </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> Private </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> PKCS7 </label> <br></br>
                    <this.CheckBox/> <label htmlFor="filled-in-box"> 3DES </label> <br></br>
                  </Col>

                  {/* Espaçamento lateral direito em branco */}
                  <Col style={{width: "10%"}}></Col>

                </Row>

                <Row style={{padding: '3.5% 0% 2%'}}>
                  <button type="button" className="btn btn-success btn-block" onClick={this.read}>
                    Analisar
                  </button>    
                </Row>
               
              </Col>

              {/* Espaçamento lateral direito em branco */}
              <Col style={{width: "5%"}}></Col>

            </Row>
          </Grid>

        </div>
      </div>

    );
  }
}

export default App;
