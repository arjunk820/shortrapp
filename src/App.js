import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'; // bootstrap css for React
import './App.css';
import Form from "./components/Form";

function App() { // sets up routing (navigation to different pages)
  return (<Router>
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Routes>
            <Route exact path='/' element={<Form/>} />
            <Route path="/app" element={<Form/>} />
          </Routes>
        </div>
      </div>
    </div></Router>
  );
}

export default App;
