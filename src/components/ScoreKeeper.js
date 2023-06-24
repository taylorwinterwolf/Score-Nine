import React, { useState, useEffect, useRef } from "react"
import { InitialBallStates } from "./InitialBallStates"
import { ballIcons } from "./BallIcons"
import { Player } from "./Player"
import { defaultPlayerOne, defaultPlayerTwo } from "./DefaultPlayers"
import { playerCard } from "./playerCard"
import logo from '../assets/logo.png'



export default function ScoreKeeper(){
    const [ballStates, setBallStates] = useState(InitialBallStates)
    const [nineIsPotted, setNineIsPotted] = useState(false)
    const [winner, setWinner] = useState()
    const [rackNumber, setRackNumber] = useState(1)
    const [deadBalls, setDeadBalls] = useState([])
    const [showWinnerModal, setShowWinnerModal] = useState(false)
    const [playerOne, setPlayerOne] = useState(Player)
    const [playerTwo, setPlayerTwo] = useState(Player)
    const [playerOneActive, setPlayerOneActive] = useState(true)
    const skillPointsKey = [null, 14, 19, 25, 31, 38, 46, 55, 65, 75]
    const skillLevels = [
        {label: 'SL 1', value: 1},
        {label: 'SL 2', value: 2},
        {label: 'SL 3', value: 3},
        {label: 'SL 4', value: 4},
        {label: 'SL 5', value: 5},
        {label: 'SL 6', value: 6},
        {label: 'SL 7', value: 7},
        {label: 'SL 8', value: 8},
        {label: 'SL 9', value: 9},
    ]

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
                    rackBallsPotted: [...prevPlayer.rackBallsPotted, ballState.id],
                    winner: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) === 0 ? true : false
                }))
                setDeadBalls(prevBalls => prevBalls.filter(ballId => ballId !== ballState.id))
            } else if (ballState.currentState === 'potted') {
                //DEAD BALL
                setPlayerOne(prevPlayer => ({ ...prevPlayer,
                    totalPoints: prevPlayer.totalPoints - ballValue,
                    pointsNeeded: prevPlayer.pointsNeeded + ballValue,
                    rackBallsPotted: prevPlayer.rackBallsPotted.filter(ballId => ballId !== ballState.id),
                    deadBalls: [...prevPlayer.rackBallsPotted, ballState.id],
                    winner: prevPlayer.skillPoints + (prevPlayer.totalPoints + ballValue) >= 0 ? false : true
                }))
                if (ballState.id !== 9) {
                    setDeadBalls(prevBalls => ([...prevBalls, ballState.id]))
                }
                
            } else {
                //RESET BALL
                setDeadBalls(prevBalls => prevBalls.filter(ballId => ballId !== ballState.id))
            }
        } else {
            if (ballState.currentState === 'default') {
                //POTTED BALL
                setPlayerTwo(prevPlayer => ({...prevPlayer,
                    totalPoints: prevPlayer.totalPoints + ballValue <= prevPlayer.skillPoints ? prevPlayer.totalPoints + ballValue : prevPlayer.skillPoints,
                    pointsNeeded: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) > 0 ? prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) : 0,
                    rackBallsPotted: [...prevPlayer.rackBallsPotted, ballState.id],
                    winner: prevPlayer.skillPoints - (prevPlayer.totalPoints + ballValue) === 0 ? true : false
                }))
                setDeadBalls(prevBalls => prevBalls.filter(ballId => ballId !== ballState.id))
            } else if (ballState.currentState === 'potted') {
                //DEAD BALL
                setPlayerTwo(prevPlayer => ({ ...prevPlayer,
                    totalPoints: prevPlayer.totalPoints - ballValue,
                    pointsNeeded: prevPlayer.pointsNeeded + ballValue,
                    rackBallsPotted: prevPlayer.rackBallsPotted.filter(ballId => ballId !== ballState.id),
                    deadBalls: [...prevPlayer.rackBallsPotted, ballState.id],
                    winner: prevPlayer.skillPoints + (prevPlayer.totalPoints + ballValue) >= 0 ? false : true
                }))
                if (ballState.id !== 9) {
                    setDeadBalls(prevBalls => ([...prevBalls, ballState.id]))
                }
                
            } else {
                //RESET BALL
                setDeadBalls(prevBalls => prevBalls.filter(ballId => ballId !== ballState.id))
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
        const ballsDown = [...playerOne.rackBallsPotted, ...playerTwo.rackBallsPotted, ...deadBalls]
        setBallStates(prevBallStates => prevBallStates.filter(ball => !ballsDown.includes(ball.id)))
    }

    const clearAll = () => {
        setShowWinnerModal(false)
        setBallStates(InitialBallStates)
        setPlayerOneActive(true)
        setNineIsPotted(false)
        setPlayerOne(Player)
        setPlayerTwo(Player)
        setRackNumber(1)
        setDeadBalls([])
    }

    const newRack = () => {  
        setBallStates(InitialBallStates)
        setPlayerOne(prevPlayer => ({...prevPlayer, rackBallsPotted: []}))
        setPlayerTwo(prevPlayer => ({...prevPlayer, rackBallsPotted: []}))
        setNineIsPotted(false)
        setRackNumber(prevNumber => prevNumber + 1)
        setDeadBalls([])
    }

    const inlineStyles = {
        activePlayer: {
            backgroundColor: '#729142',
            borderRadius: '10px 0px 0px 10px',
            color:'gold'
        },
        inActivePlayer:{
            backgroundColor: '#839099',
            borderRadius: '10px 0px 0px 10px'
        }
    }

    //console.log("PLAYER ONE: ", JSON.stringify(playerOne, null, 2))
    //console.log("PLAYER TWO: ", JSON.stringify(playerTwo, null, 2)) 

    return (
        <div className="centerTxt">  
            <div className="row"><img src={logo} alt="" /></div>
        
            <playerCard
                playerActive={playerOneActive}
                playerName={playerOne.name}
                rackBallsPotted={playerOne.rackBallsPotted}
                skillLevel={playerOne.skillLevel !== null ? playerOne.skillLevel : 0}
                pointsNeeded={playerOne.pointsNeeded}
                totalPoints={playerOne.totalPoints}
                skillPoints={playerOne.skillPoints}
            />    


            {/*PLAYER ONE*/}
            <div className="row d-flex justify-content-center playerWrapper">
                <div className="playerContainer col-11 mb-2">
                    <div className="row">
                    <div className="col-1 d-flex align-items-center" style={playerOneActive ? inlineStyles.activePlayer : inlineStyles.inActivePlayer}>{playerOneActive && <span>&#9733;</span>}</div>
                    <div className="col-9 d-flex flex-column">
                        <div className="row flex-grow-1 align-items-center">
                                <p className="playerName">
                                    {playerOne.name !== null ? playerOne.name : "Player 1"}
                                </p>
                        </div>
                        <div className="row flex-grow-1">
                            <div className="col d-flex justify-content-center align-items-center">
                                {playerOne.rackBallsPotted.length > 0 && playerOne.rackBallsPotted.sort((a, b) => a - b).map((ballNum) => {
                                    return(
                                        <img src={ballIcons[ballNum].icon} alt="" className="icon ms-1"/>
                                    )
                                })}
                                </div>
                            <div className="col d-flex justify-content-center align-items-center skillLevel">
                                SL {playerOne.skillLevel !== null ? playerOne.skillLevel : 0}
                            </div>
                            <div className="col toWin d-flex justify-content-center align-items-center">
                                <div className="col">{playerOne.pointsNeeded} TO WIN</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 scoreBoard">
                        <div className="row" style={{ backgroundColor: '#838370' }}>
                                <h1>{playerOne.totalPoints}</h1>
                        </div>
                        <div className="row" style={{ backgroundColor: '#6d828f' }}>
                            <h1>{playerOne.skillPoints}</h1>
                        </div>
                    </div>
                    </div>                    
                </div>
            </div>

            {/*PLAYER TWO*/}
            <div className="row d-flex justify-content-center playerWrapper">
                <div className="playerContainer col-11 mb-2">
                    <div className="row">
                     <div className="col-1 d-flex align-items-center" style={!playerOneActive ? inlineStyles.activePlayer : inlineStyles.inActivePlayer}>{!playerOneActive && <span>&#9733;</span>}</div>
                    <div className="col-9 d-flex flex-column">
                        <div className="row flex-grow-1 align-items-center">
                                <p className="playerName">
                                    {playerTwo.name !== null ? playerTwo.name : "Player 1"}
                                </p>
                        </div>
                        <div className="row flex-grow-1">
                            <div className="col d-flex justify-content-center align-items-center">
                                {playerTwo.rackBallsPotted.length > 0 && playerTwo.rackBallsPotted.sort((a, b) => a - b).map((ballNum) => {
                                    return(
                                        <img src={ballIcons[ballNum].icon} alt="" className="icon ms-1"/>
                                    )
                                })}
                                </div>
                            <div className="col d-flex justify-content-center align-items-center skillLevel">
                                SL {playerOne.skillLevel !== null ? playerOne.skillLevel : 0}
                            </div>
                            <div className="col toWin d-flex justify-content-center align-items-center">
                                <div className="col">{playerTwo.pointsNeeded} TO WIN</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 scoreBoard">
                        <div className="row" style={{ backgroundColor: '#838370' }}>
                                <h1>{playerTwo.totalPoints}</h1>
                        </div>
                        <div className="row" style={{ backgroundColor: '#6d828f' }}>
                            <h1>{playerTwo.skillPoints}</h1>
                        </div>
                    </div>
                    </div>                    
                </div>
            </div>

            <div className="row">
                <div className="col">Dead Balls:
                    {deadBalls.length > 0 && deadBalls.sort((a, b) => a - b).map((ballNum) => {
                        return(
                            <img src={ballIcons[ballNum].icon} alt="" className="icon"/>
                        )
                    })}
                </div>
            </div>
            
            {/*AVAILABLE BALLS*/}
            <div className="row ballsContainer d-flex justify-content-center">
                <div className="rackNumber"><h2>Rack Number {rackNumber}</h2></div>
                {ballStates.map((ballState) => {
                    return (
                        <div onClick={nineIsPotted && ballState.id !== 9 ? undefined : () => updateScore(ballState)} className="col-4 col-sm-2 ballImg mb-2">
                            <img key={ballState.id} src={ballState.image} alt=""/>
                            <img className="overlayImage" src={getOverlayImage(ballState)} alt=""/>
                        </div>
                    );
                })}
            </div>

            {/*BUTTONS*/}
            <div className="row">
                <div className="col">
                    <button type="button" className="btn btn-outline-primary" onClick={clearAll}>Clear Everything</button>
                    <button type="button" className="btn btn-outline-primary" onClick={nineIsPotted ? undefined : turnOver}>Turn Over</button>
                    <button type="button" className={'btn ' + (nineIsPotted ? 'btn-primary' : 'btn-outline-primary')} onClick={nineIsPotted ? newRack : undefined}>Start New Rack</button>
                    <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editPlayersModal">Edit Players</button>
                        <button type="button" className="btn btn-outline-primary" onClick={loadDefault} >Load Default Players</button>
                </div>
            </div>

            {/*MODALS*/}
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
        </div>
    ) 
}
