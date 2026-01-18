import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./login/loginpage";
import Signup from "./signup/signupPage";
import HomePage from "./home/homepage";
import HelpMe from "./help/helpme";
import OnBoadringPage from "./signup/onboardingPage";

const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/helpme" element={<HelpMe />} />
          <Route path="/onboarding" element={<OnBoadringPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
