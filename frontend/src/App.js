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
import Tsunami from './Components/Disasters/Tsunami/Tsunami';
import Floods from './Components/Disasters/Floods/Floods';
import Wildfire from './Components/Disasters/Wildfire/Wildfire';
import Landslide from './Components/Disasters/Landslide/Landslide';
import Cyclone from './Components/Disasters/Cyclone/Cyclone';
import DisastersHub from './Components/Disasters/DisastersHub/DisastersHub';
import PageHeader from './Components/PageHeader/PageHeader';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <PageHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disasters" element={<DisastersHub />} />
          <Route path="/request-help" element={<RequestHelp />} />
          <Route path="/missing-persons" element={<MissingPerson />} />
          <Route path="/login" element={<Login />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/disasters/tsunami" element={<Tsunami />} />
          <Route path="/disasters/floods" element={<Floods />} />
          <Route path="/disasters/wildfire" element={<Wildfire />} />
          <Route path="/disasters/landslide" element={<Landslide />} />
          <Route path="/disasters/cyclone" element={<Cyclone />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
