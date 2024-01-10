import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import RecoverPage from './pages/recover';
import NotesPage from './pages/notes';
import "./global.scss"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/recoverpassword" element={<RecoverPage />}/>  
            <Route path="/notes/:userId" element={<NotesPage />} />
            <Route path="/" element={<LoginPage />}/> {/* Default path */}
        </Routes>
    </Router>

  );
}

export default App;
