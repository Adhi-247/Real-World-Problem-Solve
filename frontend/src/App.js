import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import RequestHelp from './Components/RequestHelp/RequestHelp';
import MissingPerson from './Components/MissingPerson/MissingPerson';
import Login from './Components/Login/Login';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import Volunteer from './Components/Volunteer/Volunteer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-help" element={<RequestHelp />} />
          <Route path="/missing-persons" element={<MissingPerson />} />
          <Route path="/login" element={<Login />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
