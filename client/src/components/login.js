import React from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { requestPOST, checkAuth } from '../apiHandeler';

const baseUrl = "https://fre.rest";

let token = "";
function first(){
    return <div></div>
}
let userDetails = {} 
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.loginAPI = this.loginAPI.bind(this);
        
        this.pages=[this.login,this.done]
        this.userDetails = {} 
        this.state = {
            page: first,
            currantPage:-1,
            newPage:0,
            loading:false,
            setLoading:false,
            
        };

      }
    async componentDidMount() {
        let isAuthenticated = await checkAuth();
        if (isAuthenticated) return this.setState({newPage: 1});
        this.setState({page:this.pages[this.state.newPage]})
    }
    
    componentDidUpdate(){
        console.log(userDetails)
        
        if (this.state.newPage !== this.state.currantPage) {
            console.log("page",this.state.newPage)
            this.setState({page:this.pages[this.state.newPage],currantPage: this.state.newPage,setLoading:false}) 
        };
        if (this.state.loading && !this.state.setLoading) {
            console.log("loading",this.state)
            return this.setState({page:loading,setLoading:true});
        }
    }

    render() {
        console.log("RENDER")
    return (
        <div>
        <span class="top-left-logo">
            <img alt="img" width="150" height="150" src="logo.png" alt= "logo" />
        </span>
            {/* <h2>First Time Setup</h2> */}

        <span>
        
            <this.state.page/>
        </span>
        
        
        </div>
  );
  }

  login = function(props){  
            return (
                <div class="login-box">
                <span class="form-icon">
                <img alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Hello welcome to PteroPal!</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>
                <div class="login-form">
                        <input type="email" onChange={event => {this.userDetails.email = event.target.value; console.log(this.userDetails.email)}} name="email" placeholder="Email" required />  
                        <input type="password" onChange={event => {this.userDetails.password = event.target.value}} name="password" placeholder="Password" required />  
                        <h2>Don't have an account? <a href="register">Register</a></h2>
                        <input  type="submit" onClick={this.loginAPI} value="Next" />
                </div>
                </div>
            );

        };
        loginAPI = async function(props){
            if (!this.userDetails.email) { this.userDetails.error = "Enter a email";return this.setState({loading:false})}
            if (!this.userDetails.password) { this.userDetails.error = "Enter a password"; return this.setState({loading:false})}
            this.userDetails.error = ""

            this.setState({loading:true})

            let result = await requestPOST({ email: this.userDetails.email, password: this.userDetails.password },"/oauth/token",false);
            if (result.error){
                this.userDetails.error = result.message;
                this.setState({loading:false,page:this.pages[this.state.newPage]})
                return console.log(this.state)
            }
            console.log(result)
            localStorage.setItem('WARNING!!', "Has someone asked you to go here? NEVER GIVE ANYONE YOUR TOKEN! IT WILL GIVE THEM FULL ACCESS TO YOUR ACCOUNT");
            localStorage.setItem('Authorization',  "Bearer "+result.access_token);
            localStorage.setItem('AuthorizationExpDate', result.expDate);
            this.setState({newPage:1})

        }

        done = function() {
            return(
                <Redirect push to="/dashboard" />
            )
        }

        }

function loading(){
    return (
        <div class="login-box">
        <span class="form-icon">
        <img width="200" height="200" src="/pteroIcon.png"/>
        </span>
        <span class="form-icon">
             <img alt="img" width="200" height="200" src="/loading.gif"/>
        </span>
          </div>
    );
}





export default Register;