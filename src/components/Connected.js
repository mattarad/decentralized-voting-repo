import React from "react"

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="welcome-message">wallet connection successfull!</h1>
            <p className="connected-account">Account: {props.account}</p>
            <p className="connected-account">Time Remaining: {props.remainingTime}</p>

            <div>
                {console.log(props.showButton)}
                {props.showButton ? (<p>you have voted</p>) :
                (
                <div>
                    <input
                        type="number"
                        placeholder="enter candidate index"
                        value={props.number}
                        onChange={props.handleNumberChange}
                    >

                    </input>
                    <button className="login-button" onClick={props.voteFunction}>VOTE</button>
                </div>
                )
                }
            </div>

            <table id="myTable" className="candidate-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Candidate Name</th>
                        <th>Number of Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {props.candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td>{candidate.index}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Connected