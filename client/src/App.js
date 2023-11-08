import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import RecoverPage from './pages/recover';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />}/>  
            <Route path="/recoverpassword" element={<RecoverPage />}/>  
            <Route path="/" element={<LoginPage />}/> {/* Default path */}
        </Routes>
    </Router>

  );
}

export default App;
