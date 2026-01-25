import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./login/loginpage";
import Signup from "./signup/signupPage";
import HomePage from "./home/homepage";
import HelpMe from "./help/helpme";
import OnBoadringPage from "./signup/onboardingPage";
import { UserProvider } from './context/userContext';
import ProtectedRoute from './components/protectedroutes';

const App = () => {

  return (
    <Router>
      <div>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/helpme" element={<HelpMe />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/onboarding" element={<OnBoadringPage />} />
            </Route>
          </Routes>
        </UserProvider>
      </div>
    </Router>
  )
}

export default App;
