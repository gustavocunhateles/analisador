import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//const express = require('express');
//var app = express()
// var rotas = "./rotas/"
// app.use('', rotas)

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
