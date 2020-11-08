import React from 'react';
import './App.css';


class Home extends React.Component {
  render() {
    return (
  <div>
  <a href="/login"><button>login</button></a>
  <a href="/register"><button>register</button></a>
  </div>
  );
  }
}

export default Home;