import React, { Component } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import logo from '../logo.png';
import '../styles/App.css';
import SocialThread from '../abis/SocialThread.json';

class App extends Component {

  async componentWillMount() {

    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected!');
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });

    // Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = SocialThread.networks[networkId];

    if (networkData) {
      const socialThread = web3.eth.Contract(SocialThread.abi, networkData.address);
      this.setState({ socialThread });
      const postCount = await socialThread.methods.postCount().call();
      this.setState({ postCount });

      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialThread.methods.posts(i).call();
        this.setState({
          posts: [...this.state.posts, post]
        });
      }

      // Set loading to false
      this.setState({ loading: false });

    } else {
      window.alert('SocialThread contract not deployed to detected network.');
    }
  }

  createPost(content) {
    this.setState({ loading: true });
    this.state.socialThread.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true });
    this.state.socialThread.methods.tipPost(id).send({ from:this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      socialThread: null,
      postCount: 0,
      posts: [],
      loading: true
    }
    this.createPost = this.createPost.bind(this);
    this.tipPost = this.tipPost.bind(this);
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {
          this.state.loading
          ?
          <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          :
          <Main
            posts={this.state.posts}
            createPost={this.createPost}
            tipPost={this.tipPost}
          />
        }

      </div>
    );
  }
}

export default App;
