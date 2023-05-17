import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/constant';

import Login from './components/Login'
import Connected from './components/Connected'
import Finished from './components/Finished';

import './App.css';

function App() {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [votingStatus, setVotingStatus] = useState(true)
  const [remainingTime, setRemainingTime] = useState('')
  const [candidates, setCandidates] = useState([])
  const [number, setNumber] = useState('')
  const [CanVote, setCanVote] = useState(true)

  useEffect(() => {
    getCandidates()
    getRemainingTime()
    getCurrentStatus()
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if(window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  })

  async function connectWallet() {
    if(window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)
        console.log(`metamask connected: ${address}`)
        setIsConnected(true)
        canVote()
      } catch (err) {
        console.error(err)
      }
    } else {
      console.error(`not connected...`)
    }
  }

  function handleAccountsChanged(accounts) {
    if(accounts.length > 0 && accounts !== accounts[0]) {
        setAccount(accounts[0])
        canVote()
      }
    else {
      setIsConnected(false)
      setAccount(null)
    }
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractInstance = new ethers.Contract( CONTRACT_ADDRESS, CONTRACT_ABI, signer )
    const status = await contractInstance.getVotingStatus()
    setVotingStatus(status)
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractInstance = new ethers.Contract( CONTRACT_ADDRESS, CONTRACT_ABI, signer )
    const candidatesList = await contractInstance.getAllVotesOfCandidate()
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    })
    setCandidates(formattedCandidates)
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractInstance = new ethers.Contract( CONTRACT_ADDRESS, CONTRACT_ABI, signer )
    const time = await contractInstance.getRemainingTime()
    setRemainingTime(parseInt(time, 16))

  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractInstance = new ethers.Contract( CONTRACT_ADDRESS, CONTRACT_ABI, signer )
    const voteStatus = await contractInstance.voters(await signer.getAddress())
    setCanVote(voteStatus)
  }

  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contractInstance = new ethers.Contract( CONTRACT_ADDRESS, CONTRACT_ABI, signer )
    const tx = await contractInstance.vote(number)
    await tx.wait()
    canVote()
  }

  async function handleNumberChange(e) {
    let num = e.target.value
    // if(parseInt(num) < 0) num == 0
    // if(parseInt(num) > candidates.length - 1) num = candidates.length - 1
    setNumber(num)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>HELLO!!</h1>
        {votingStatus ? 
        isConnected ? 
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction = {vote}
            showButton = {CanVote}
          /> :
          <Login connectWallet={connectWallet}/>
         :
        <Finished />
      
      } 
        
      </header>
    </div>
  );
}

export default App;
