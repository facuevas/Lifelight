import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Components and pages
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Lifelights from './Pages/Lifelights';
import Feed from './Pages/Feed';

const App = () => {
  return(
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/lifelights" component={Lifelights} />
      <Route path="/feed" component={Feed} />
    </Router>
  );
}

export default App;
