import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Setup from './components/setup';
import Dashboard from './components/dashboard'
// import NotFound from '@/components/screens/NotFound';

class App extends React.Component {
  render() {
    return (
  <main>
    <BrowserRouter>
        <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/setup" component={Setup} />
            <Route path="/dashboard" component={Dashboard} />
            {/* <Route path={'*'} component={NotFound}/> */}
        </Switch>
    </BrowserRouter>
  </main>
  );
  }
}

export default App;
