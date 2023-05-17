import React from "react"

const Login = (props) => {
    return (
        <div className="login-container">
            <h1 className="welcome-message">welcome to decentralized voting!</h1>
            <button className="login-button" onClick={props.connectWallet}>Connect MetaMask</button>
        </div>
    )
}

export default Login