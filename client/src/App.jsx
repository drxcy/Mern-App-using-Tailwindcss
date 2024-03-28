import {BrowserRouter ,Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './components/Header';
import FooterComp from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-out' element={<SignOut />} />
        <Route element={<PrivateRoute/>}> 
        <Route path='/dashboard' element={<Dashboard />} />
     </Route>
        <Route path='/projects' element={<Projects />} />
        
      </Routes>
      <FooterComp/>
    </BrowserRouter>
  )
}
