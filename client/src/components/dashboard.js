import React from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { requestGET, checkAuth } from '../apiHandeler'

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.redirectTo = this.redirectTo.bind(this);
    this.userDetails = {} 
    this.state = {
      page:<div></div>,

    };

  }
async componentDidMount() {
    let request = await requestGET("/admin/dashboard");
    console.log(request)
    if(request.code) return this.setState({page:this.redirectTo("/login")});
    if (request.requiresSetup)  return this.setState({page:this.redirectTo("/setup")});
}

componentDidUpdate(){

}
  render() {
    return (
  <div>
  {this.state.page}
  </div>
  );
  }


  redirectTo = function(dest) {
    return(
        <Redirect push to={dest} />
    )
}
}

export default Dashboard;