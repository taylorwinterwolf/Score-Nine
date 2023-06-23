import React, { useState, useEffect, useRef } from "react"
import { InitialBallStates } from "./InitialBallStates"
import { ballIcons } from "./BallIcons"
import { Player } from "./Player"
import { defaultPlayerOne, defaultPlayerTwo } from "./DefaultPlayers"



export default function ScoreKeeper(){
    const [ballStates, setBallStates] = useState(InitialBallStates)
    const [nineIsPotted, setNineIsPotted] = useState(false)
    const [showEditPlayersModal, setShowEditPlayersModal] = useState(true)
    const [winner, setWinner] = useState()
    const [showWinnerModal, setShowWinnerModal] = useState(false)
    const [playerOne, setPlayerOne] = useState(Player)
    const [playerTwo, setPlayerTwo] = useState(Player)
    const [playerOneActive, setPlayerOneActive] = useState(true)
    const [playerOneSelectedSkillLevel, setPlayerOneSelectedSkillLevel] = useState()
    const [playerTwoSelectedSkillLevel, setPlayerTwoSelectedSkillLevel] = useState()
    const skillPointsKey = [null, 14, 19, 25, 31, 38, 46, 55, 65, 75]
    const [skillLevels, setSkillLevels] = useState([
        {label: 'SL 1', value: 1},
        {label: 'SL 2', value: 2},
        {label: 'SL 3', value: 3},
        {label: 'SL 4', value: 4},
        {label: 'SL 5', value: 5},
        {label: 'SL 6', value: 6},
        {label: 'SL 7', value: 7},
        {label: 'SL 8', value: 8},
        {label: 'SL 9', value: 9},
    ])
    const playerOneNameRef = useRef()
    const playerOneSkillRef = useRef()
    const playerTwoNameRef = useRef()
    const playerTwoSkillRef = useRef()
    
    useEffect(() => {
        if (playerOne.winner === true) {
            setWinner(playerOne.name)
            setShowWinnerModal(true)
        }else if (playerTwo.winner === true) {
            setWinner(playerTwo.name)
            setShowWinnerModal(true)
        }
    }, [playerOne.winner, playerTwo.winner])


    const updateScore = (ballState) => {
        updateBallState(ballState.id);
    
        let ballValue = 0
    
        if (ballState.id === 9) {
            ballValue = 2
            //Check state of 9 ball
            if (ballState.currentState === 'default') {
                //If 9ball is potted, set all un-potted balls to dead
                setBallStates((prevBallStates) => prevBallStates.map((selectedBall) => {
                    if (selectedBall.id !== 9 && selectedBall.currentState !== 'potted') {
                        return {
                            ...selectedBall,
                            currentState: 'dead'
                        }
                    }
                    //Otherwise keep ball state as is
                    return selectedBall
                }))
                setNineIsPotted(true)
            } else {
                setBallStates((prevBallStates) => prevBallStates.map((selectedBall) => {
                    if (selectedBall.id !== 9 && selectedBall.currentState !== 'potted') {
                        return {
                            ...selectedBall,
                            currentState: 'default'
                        }
                    }
                    //Otherwise keep ball state as is
                    return selectedBall
                }))
                setNineIsPotted(false)
            }
            
        } else {
            ballValue = 1
        }

        if (playerOneActive) {
            if (ballState.currentState === 'default') {
                //POTTED BALL
                setPlayerOne(prevPlayer => ({...prevPlayer,
                    totalPoints: prevPlayer.totalPoints + ballValue <= prevPlayer.skillPoints ? prevPlayer.totalPoints + ballValue : prevPlayer.skillPoints,
                    pointsNeeded: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) > 0 ? prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) : 0,
                    rackBallsPotted: prevPlayer.rackBallsPotted.concat(ballState.id),
                    winner: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) === 0 ? true : false
                }))
            } else if (ballState.currentState === 'potted') {
                //DEAD BALL
                setPlayerOne(prevPlayer => ({ ...prevPlayer,
                    totalPoints: prevPlayer.totalPoints - ballValue,
                    pointsNeeded: prevPlayer.pointsNeeded + ballValue,
                    rackBallsPotted: prevPlayer.rackBallsPotted.filter(ball => ball !== ballState.id),
                    winner: prevPlayer.skillPoints + (prevPlayer.totalPoints + ballValue) >= 0 ? false : true
                }))
            }
        } else {
            if (ballState.currentState === 'default') {
                //POTTED BALL
                setPlayerTwo(prevPlayer => ({...prevPlayer,
                    totalPoints: prevPlayer.totalPoints + ballValue <= prevPlayer.skillPoints ? prevPlayer.totalPoints + ballValue : prevPlayer.skillPoints,
                    pointsNeeded: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) > 0 ? prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) : 0,
                    rackBallsPotted: prevPlayer.rackBallsPotted.concat(ballState.id),
                    winner: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) === 0 ? true : false
                }))
            } else if (ballState.currentState === 'potted') {
                //DEAD BALL
                setPlayerTwo(prevPlayer => ({ ...prevPlayer,
                    totalPoints: prevPlayer.totalPoints - ballValue,
                    pointsNeeded: prevPlayer.pointsNeeded + ballValue,
                    rackBallsPotted: prevPlayer.rackBallsPotted.filter(ball => ball !== ballState.id),
                    winner: prevPlayer.skillPoints + (prevPlayer.totalPoints + ballValue) >= 0 ? false : true
                }))
            }
        }


    }
    
    // Function to update the state of a specific ball
    const updateBallState = (ballId) => {
        //console.log("Update ball state clicked")
        let state = "default"
        setBallStates((prevBallStates) =>
        prevBallStates.map((selectedBall) => {
            if (selectedBall.id === ballId) {
                if (selectedBall.currentState === 'default') {
                    state = 'potted'    
                } else if (selectedBall.currentState === 'potted' && selectedBall.id !== 9){
                    state = 'dead'
                }

                return {
                    ...selectedBall,
                    currentState: state,
                };
            }
            return selectedBall;
        })
        )
    }

    // Function to get the appropriate image based on the ball state
    const getOverlayImage = (ballState) => {
        switch (ballState.currentState) {
        case 'potted':
            return require('../assets/pottedball.png');
        case 'dead':
            return require('../assets/deadball.png');
        default:
            return ballState.image;
        }
    };

    const addPlayers = () => {
        setPlayerOne(prevPlayer => ({
            ...prevPlayer,
            name: playerOneNameRef.current.value,
            skillLevel: playerOneSkillRef.current.value,
            skillPoints: skillPointsKey[playerOneSkillRef.current.value],
            pointsNeeded: skillPointsKey[playerOneSkillRef.current.value]
        }))
        setPlayerTwo(prevPlayer => ({
            ...prevPlayer,
            name: playerTwoNameRef.current.value,
            skillLevel: playerTwoSkillRef.current.value,
            skillPoints: skillPointsKey[playerTwoSkillRef.current.value],
            pointsNeeded: skillPointsKey[playerTwoSkillRef.current.value]
        }))
    }

    const loadDefault = () => {
        setPlayerOne(defaultPlayerOne)
        setPlayerTwo(defaultPlayerTwo)
    }

    const turnOver = () => {
        //Toggle which player is active
        setPlayerOneActive(prevValue => !prevValue)
        
        //Filter out(remove) the balls that have already been potted this rack
        const rackBallsPotted = [...playerOne.rackBallsPotted, ...playerTwo.rackBallsPotted]
        setBallStates(prevBallStates => prevBallStates.filter(ball => !rackBallsPotted.includes(ball.id)))
    }

    const clearAll = () => {
        setShowEditPlayersModal(true)
        setShowWinnerModal(false)
        setBallStates(InitialBallStates)
        setPlayerOneActive(true)
        setNineIsPotted(false)
        setPlayerOneSelectedSkillLevel()
        setPlayerTwoSelectedSkillLevel()
        setPlayerOne(Player)
        setPlayerTwo(Player)
    }

    const newRack = () => {  
        setBallStates(InitialBallStates)
        setPlayerOne(prevPlayer => ({...prevPlayer, rackBallsPotted: []}))
        setPlayerTwo(prevPlayer => ({...prevPlayer, rackBallsPotted: []}))
        setNineIsPotted(false)
    }

    //console.log("PLAYER ONE: ", JSON.stringify(playerOne, null, 2))
    //console.log("PLAYER TWO: ", JSON.stringify(playerTwo, null, 2)) 

    return (
        <div className="centerTxt">  
            <div className="row"><h3>9 Ball Score Keeper</h3></div>
            <div className="row">
                <div className={'col ' + (playerOneActive ? 'isActive' : 'isNotActive')}>{playerOne.name !== null ? playerOne.name : "Player 1"} SL {playerOne.skillLevel !== null ? playerOne.skillLevel : 0 }</div>
                <div className={'col ' + (!playerOneActive ? 'isActive' : 'isNotActive')}>{playerTwo.name  !== null ? playerTwo.name : "Player 2" } SL {playerTwo.skillLevel !== null ? playerTwo.skillLevel : 0 }</div>
            </div>
            <div className="row">
                <div className="col">
                    {playerOne.rackBallsPotted.length > 0 && playerOne.rackBallsPotted.sort((a, b) => a - b).map((ballNum) => {
                        return(
                            <img src={ballIcons[ballNum].icon} alt=""/>
                        )
                    })}
                </div>
                <div className="col">
                    {playerTwo.rackBallsPotted.length > 0 && playerTwo.rackBallsPotted.sort((a, b) => a - b).map((ballNum) => {
                        return(
                            <img src={ballIcons[ballNum].icon} alt=""/>
                        )
                    })}
                </div>
            </div>
            <div className="row">
                <div className="col">Points: {playerOne.totalPoints}/{playerOne.skillPoints} Need: {playerOne.pointsNeeded}</div>
                <div className="col">Points: {playerTwo.totalPoints}/{playerTwo.skillPoints} Need: {playerTwo.pointsNeeded}</div>
            </div>
            <div className="row ballsContainer d-flex justify-content-center">
                {ballStates.map((ballState) => {
                    return (
                        <div onClick={nineIsPotted && ballState.id !== 9 ? undefined : () => updateScore(ballState)} className="col-4 col-sm-2 ballImg mb-2">
                            <img key={ballState.id} src={ballState.image} alt=""/>
                            <img className="overlayImage" src={getOverlayImage(ballState)} alt=""/>
                        </div>
                    );
                })}
            </div>
            <div className="row">
                <div className="col">
                    <button type="button" className="btn btn-outline-primary" onClick={clearAll}>Clear Everything</button>
                    <button type="button" className="btn btn-outline-primary" onClick={nineIsPotted ? undefined : turnOver}>Turn Over</button>
                    <button type="button" className={'btn ' + (nineIsPotted ? 'btn-primary' : 'btn-outline-primary')} onClick={newRack}>Start New Rack</button>
                    <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editPlayersModal">Edit Players</button>
                        <button type="button" className="btn btn-outline-primary" onClick={loadDefault} >Load Default Players</button>
                </div>
            </div>

            
            <div className="modal fade" id="editPlayersModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="playerWrapper">
                                <div><h5>Player 1 Name</h5></div>
                                <div><input type="text" ref={playerOneNameRef}/></div>
                                <div><h5>Select Skill Level</h5></div>
                                <div>
                                    <select ref={playerOneSkillRef}>
                                        {skillLevels.map((option) => {
                                            return (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="playerWrapper">
                                <div><h5>Player 2 Name</h5></div>
                                <div><input type="text" ref={playerTwoNameRef}/></div>
                                <div><h5>Select Skill Level</h5></div>
                                <div>
                                    <select ref={playerTwoSkillRef}>
                                        {skillLevels.map((option) => {
                                            return (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            {/*
                            <div>
                                <label class="switch">
                                <input type="checkbox"/>
                                <span class="slider round"></span>
                                </label>
                            </div>*/}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={addPlayers } data-bs-dismiss="modal">Add Players</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>    
                    </div>
                </div>
            </div>
            
            {showWinnerModal &&
            <div>
                <div className="modal">
                    <div>
                        <div>
                            <p>And the winner is {winner ? winner : "Unknown"}!</p>
                                {/*<button type="button" className="btn btn-outline-primary" mode="outlined" onClick={clearAll}>Start New Match</button>*/}
                            <button type="button" className="btn btn-outline-primary" mode="outlined" onClick={() => setShowWinnerModal(false)}>Go back to turn</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    ) 
}
