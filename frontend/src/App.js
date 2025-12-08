import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import RequestHelp from './Components/RequestHelp/RequestHelp';
import MissingPerson from './Components/MissingPerson/MissingPerson';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-help" element={<RequestHelp />} />
          <Route path="/missing-persons" element={<MissingPerson />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
