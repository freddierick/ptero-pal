import React from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { requestPOST, checkAuth, requestGET } from '../apiHandeler';

const baseUrl = "https://fre.rest";
let token = localStorage.getItem('token');
function first(){
    return <div></div>
}
let userDetails = {} 
class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.panel = this.panel.bind(this);
        this.panelSave = this.panelSave.bind(this);
        
        this.discord = this.discord.bind(this);
        this.discordSave = this.discordSave.bind(this);

        this.done = this.done.bind(this);
        this.redirectTo = this.redirectTo.bind(this);

        this.discordURL = this.discordURL.bind(this);
        this.discordURLSave = this.discordURLSave.bind(this);
        

        
        this.pages=[this.panel,this.discord,,this.discordURL,this.done,this.checkA]
        this.userDetails = {} 
        this.state = {
            page: this.panel,
            currantPage:0,
            newPage:0,
            loading:false,
            setLoading:false,
            
        };

      }
    async componentDidMount() {
        let isAuthenticated = await checkAuth();
        console.log(typeof this.redirectTo("/login"),"Login Data",isAuthenticated)
        if (!isAuthenticated) return this.setState({page: this.redirectTo("/login")});
        this.userDetails.redirectURL = (await requestGET("/admin/setup/redirectURL")).id;

        console.log(this.userDetails.redirectURL)

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




  panel = function(props){  
            return (
                <div class="login-box">
                <span class="form-icon">
                <img alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Now we need to get some info about your panel.</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>
                <div class="login-form">
                <label for="url">Fully Qualified Domain Name (FQDN)</label>
                        <input type="text" onChange={event => {this.userDetails.url = event.target.value}} name="url" placeholder="panel.example.com" required />  
                <label for="apiKey">Here you need to enter a API key for the panel (MUST HAVE ALL PERMS READ AND WRITE)</label>

                        <input type="text" autoComplete="false" onChange={event => {this.userDetails.apiKey = event.target.value}} name="apiKey" placeholder="******************************" required />  
                        <input  type="submit" onClick={this.panelSave} value="Next" />
                </div>
                </div>
            );

        };

    panelSave = async function(props){
            this.setState({loading:false,newPage:this.state.currantPage+1})
        }

        discord = function(props){
            return (
                <div class="login-box">
                <span class="form-icon">
                <img  alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Ok now i need your discord application information.</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>

                <div class="login-form">
                <label for="ClientID">Client ID</label>
                        <input type="text" onChange={event => {this.userDetails.ClientID = event.target.value}} name="ClientID" placeholder="57689435673895678943" required />  
                <label for="ClientSecrete">Client Secrete</label>

                    <input type="text" autoComplete="false" onChange={event => {this.userDetails.ClientSecrete = event.target.value}} name="ClientSecrete" placeholder="***********************" required />  
                    <input  type="submit" onClick={this.discordSave} value="Next" />

                </div>
                </div>
            );
        }
        discordSave = async function(props){

            this.setState({loading:false,newPage:this.state.currantPage+1})

        }
        discordURL = function(props){
            return (
                <div class="login-box">
                <span class="form-icon">
                <img  alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Now you need to add this custom redirect URL to your discord application.</h3>
                <p style={{color:"red",textAlign:"center"}}>{this.userDetails.error}</p>

                <div class="login-form">
                <label for="URL">URL</label>
                <input type="text" name="URL" value={this.userDetails.redirectURL} readonly required />  

                </div>
                </div>
            );
        }
        discordURLSave = async function(props){
            this.userDetails.error = ""
            this.setState({loading:true})
            let response = await requestPOST({ panURL: this.userDetails.url, panKEY: this.userDetails.apiKey, diskID: this.userDetails.ClientID, discSec: this.userDetails.ClientSecrete },"/admin/setup");
    

        }
        
        

        done = function(props){
            return (
                <div class="login-box">
                <span class="form-icon">
                <img alt="img" width="200" height="200" src="/pteroIcon.png"/>
                </span>
                <h3>Sign up finished!</h3>
                <div class="login-form">

                       <h3> Your account has been successfully created; now you need to finish your setup.</h3>
                        <input type="submit" value="First Time Setup" />
                        {/* <button onClick={this.setState({newPage:this.state.currantPage-1})} value="Back" /> */}

                </div>
                </div>
            );
        }
        
        redirectTo = function(dest) {
            return(
                <Redirect push to={dest} />
            )
        }
        }

function loading(){
    return (
        <div class="login-box">
        <span class="form-icon">
        <img width="200" height="200" src="/pteroIcon.png"/>
        </span>
        <h3>Checking the info you gave me, this will take a while.</h3>
        <h5 style={{textAlign:"center"}}>Did you know There's No Such Thing as a Pterodactyl.</h5>
        <span class="form-icon">
             <img alt="img" width="200" height="200" src="/loading.gif"/>
        </span>
          </div>
    );
}





export default Setup;