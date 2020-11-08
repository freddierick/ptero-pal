import React from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { requestGET, requestPOST, checkAuth } from '../apiHandeler';
const baseUrl = "https://fre.rest";
let token = "";
function first(){
    return <div></div>
}
let userDetails = {} 
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.email = this.email.bind(this);
        this.emailSend = this.emailSend.bind(this);
        this.emailConf = this.emailConf.bind(this);
        this.emailConfSend = this.emailConfSend.bind(this);
        this.passwords = this.passwords.bind(this);
        this.passwordsSend = this.passwordsSend.bind(this);
        this.done = this.done.bind(this);
        this.checkA = this.checkA.bind(this);
        this.goBack = this.goBack.bind(this);
        
        this.pages=[this.email,this.emailConf,this.passwords,this.done,this.checkA]
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
        if (isAuthenticated) this.setState({page:this.checkA});
        
        this.setState({page:this.pages[this.state.newPage],setLoading:false})
         
    
        await this.getToken()
        this.setState({page:this.pages[this.state.newPage],setLoading:false})
         
    }
    
    componentDidUpdate(){
        console.log(userDetails)
        if (this.state.loading && !this.state.setLoading) {
            console.log("loading",this.state)
            return this.setState({page:loading,setLoading:true});
        }
        if (this.state.newPage !== this.state.currantPage) {
            console.log("page",this.state.newPage)
            this.setState({page:this.pages[this.state.newPage],currantPage: this.state.newPage,setLoading:false}) 
        };
        
    }

    render() {
        console.log("RENDER",console.log(this.state))
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



  goBack = async function(props){
        this.state.newPage = this.state.currantPage -1
        this.userDetails.error = "";
        this.setState({loading:false,page:this.pages[this.state.newPage]})
    }
        

    getToken = async function(props){
        let result = await requestPOST({ code: this.userDetails.code },"/register/getToken",false);
        token = result.token;
        this.setState({loading:false,page:this.pages[this.state.newPage]})
    }

        email = function(props){  
            return (
                <div class="login-box">
                <span class="form-icon">
                <img alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Hello welcome to PteroPal! enter your email to get started!</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>
                <div class="login-form">
                        <input type="email" onChange={event => {this.userDetails.email = event.target.value; console.log(this.userDetails.email)}} name="email" placeholder="Email" required />  
                        <h2>All ready have a account? <a href="login">Sign In</a></h2>
                        <input  type="submit" onClick={this.emailSend} value="Next" />
                </div>
                </div>
            );

        };
        emailSend = async function(props){
            // if (!this.userDetails.email) { this.userDetails.error = "Enter a email";return this.forceUpdate()}
            this.userDetails.error = ""
            if (!this.state.loading)this.setState({loading:true})
            let result = await requestPOST({ token, email: this.userDetails.email },"/register/email",false);
            if(result.error){
                this.userDetails.error = result.message;
                this.setState({loading:false,setLoading:false,page:this.pages[this.state.newPage]})
                console.log(this.state)
                
            }else{
                this.setState({loading:false,newPage:this.state.currantPage+1})
            }
        }

        emailConf = function(props){
            return (
                <div class="login-box">
                <span class="form-icon">
                <img  alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Great we have sent an email to <br/><strong>{this.userDetails.email}</strong><br/> enter the conformation code here...</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>

                <div class="login-form">

                        <input type="text" name="code" onChange={event => {this.userDetails.code = event.target.value}} placeholder="*****" required />  
                        <input type="submit" onClick={this.emailConfSend} value="Next" />
                        <input  type="submit" onClick={this.goBack} class="back-button" value="Back" />

                        {/* <button onClick={this.setState({newPage:this.state.currantPage-1})} value="Back" /> */}

                </div>
                </div>
            );
        }
        emailConfSend = async function(props){
            if (!this.userDetails.email) { this.userDetails.code = "Enter a code";return this.forceUpdate()}
            this.userDetails.error = ""
            this.setState({loading:true})
            let result = await requestPOST({token, code: this.userDetails.code },"/register/code",false);
            if(result.error){
                this.userDetails.error = result.message;
                this.setState({loading:false,page:this.pages[this.state.newPage]})
                console.log(this.state)
                
            }else{
                this.setState({loading:false,newPage:this.state.currantPage+1})
            }
        }


        passwords = function(props){
            return (
                <div class="login-box">
                <span class="form-icon">
                <img alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Ok, great last step choose your password!</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>

                <div class="login-form">

                        <input type="password" name="pass" onChange={event => {this.userDetails.pass = event.target.value}} placeholder="Password" required />  
                        <input type="password" name="passConf" onChange={event => {this.userDetails.passConf = event.target.value}} placeholder="Confirm Password " required />  
                        <input type="submit" onClick={this.passwordsSend} value="Next" />
                        <input  type="submit" onClick={this.goBack} class="back-button" value="Back" />

                        {/* <button onClick={this.setState({newPage:this.state.currantPage-1})} value="Back" /> */}

                </div>
                </div>
            );
        }

        passwordsSend = async function(props){
            if (!this.userDetails.email) { this.userDetails.pass = "Enter a password";return this.setState({loading:false})}
            if (!this.userDetails.email) { this.userDetails.passConf = "Enter a conformation password";return this.setState({loading:false})}
            if (!(this.userDetails.passConf==this.userDetails.pass)){ this.userDetails.error = "Those passwords don't match!";return this.setState({loading:false})}

            this.userDetails.error = ""

            this.setState({loading:true})
            let result = await requestPOST({token, pass: this.userDetails.pass, passConf: this.userDetails.passConf },"/register/password",false);
            if(result.error){
                this.userDetails.error = result.message;
                this.setState({loading:false,page:this.pages[this.state.newPage]})
                console.log(this.state)
                
            }else{
                localStorage.removeItem('token');
                this.setState({loading:false,newPage:this.state.currantPage+1})
            }
        }

        done = function(props){
            return (
                <div class="login-box">
                <span class="form-icon">
                <img alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Sign up finished!</h3>
                <div class="login-form">

                       <h3> Your account has been successfully created; now you need to finish your setup. Login then click setup!</h3>
                        <a href="/login"><input type="submit" value="Login" /></a>
                        {/* <button onClick={this.setState({newPage:this.state.currantPage-1})} value="Back" /> */}

                </div>
                </div>
            );
        }
        checkA = function() {
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