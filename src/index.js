import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAj_SdncL_oL1J_vWqPLqRJutn6xLYtEaQ",
  authDomain: "url-shortener-80b8d.firebaseapp.com",
  databaseURL: "https://url-shortener-80b8d-default-rtdb.firebaseio.com",
  projectId: "url-shortener-80b8d",
  storageBucket: "url-shortener-80b8d.appspot.com",
  messagingSenderId: "239276058490",
  appId: "1:239276058490:web:c2a7396b8c1816ed0658c3",
  measurementId: "G-JME71VZ4RN"
};

initializeApp(firebaseConfig); // client -> db

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
