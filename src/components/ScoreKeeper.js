import React, { useState, useEffect, useRef } from "react"
import { InitialBallStates } from "./InitialBallStates"
import { ballIcons } from "./BallIcons"
import { BallImages } from "./BallImages"
import { Player } from "./Player"
import PlayerCard from "./PlayerCard"
import UseLocalStorage from "../hooks/UseLocalStorage"
import { defaultPlayerOne, defaultPlayerTwo } from "./DefaultPlayers"
import logo from '../assets/logo.png'



export default function ScoreKeeper(){
    const [ballStates, setBallStates] = UseLocalStorage("ballStates", InitialBallStates)
    const [nineIsPotted, setNineIsPotted] = useState(false)
    const [winner, setWinner] = useState()
    const [rackNumber, setRackNumber] = useState(1)
    const [deadBalls, setDeadBalls] = useState([])
    const [showWinnerModal, setShowWinnerModal] = useState(false)
    const [playerOne, setPlayerOne] = UseLocalStorage("playerOne", Player)
    const [playerTwo, setPlayerTwo] = UseLocalStorage("playerTwo", Player)
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
    const oneFiltered = ballStates.filter(ball => playerOne.rackBallsPotted.includes(ball.id))
    const twoFiltered = ballStates.filter(ball => playerTwo.rackBallsPotted.includes(ball.id))

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
            <div className="row mb-2 mt-2 d-flex justify-content-center">
                <div className="col-7" id="logoWrap"><img src={logo} alt="" /></div>
            </div>

            {/*PLAYER ONE*/}
            <PlayerCard
                playerActive={playerOneActive}
                playerName={playerOne.name}x
                rackBallsPotted={playerOne.rackBallsPotted}
                skillLevel={playerOne.skillLevel !== null ? playerOne.skillLevel : 0}
                pointsNeeded={playerOne.pointsNeeded}
                totalPoints={playerOne.totalPoints}
                skillPoints={playerOne.skillPoints}
            />    

            {/*PLAYER TWO*/}
            <PlayerCard
                playerActive={!playerOneActive}
                playerName={playerTwo.name}
                rackBallsPotted={playerTwo.rackBallsPotted}
                skillLevel={playerTwo.skillLevel !== null ? playerTwo.skillLevel : 0}
                pointsNeeded={playerTwo.pointsNeeded}
                totalPoints={playerTwo.totalPoints}
                skillPoints={playerTwo.skillPoints}
            />  

            <div className="row">
                <div className="col"><span className="me-1">Dead Balls:</span>
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
            <div className="row mb-5">
                <div className="col d-flex">
                    <button type="button" className={'flex-fill btn ' + (!nineIsPotted ? 'btn-secondary' : 'btn-outline-secondary')} onClick={nineIsPotted ? undefined : turnOver}>Turn Over</button>
                    <button type="button" className={'flex-fill btn ' + (nineIsPotted ? 'btn-secondary' : 'btn-outline-secondary')} disabled={!nineIsPotted} onClick={nineIsPotted ? newRack : undefined}>Start New Rack</button>
                    <button type="button" className='flex-fill btn btn-outline-secondary' data-bs-toggle="modal" data-bs-target="#editRackModal">Edit Rack</button>
                </div>
            </div>
            <div className="row">
                <div className="col d-flex">
                    <button type="button" className="flex-fill btn btn-outline-primary" onClick={clearAll}>Clear Everything</button>
                    <button type="button" className="flex-fill btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editPlayersModal">Edit Players</button>
                        <button type="button" className="flex-fill btn btn-outline-primary" onClick={loadDefault} >Load Default Players</button>
                </div>
            </div>

            {/*EDIT PLAYERS MODAL*/}
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
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={addPlayers } data-bs-dismiss="modal">Add Players</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>    
                    </div>
                </div>
            </div>

            {/*EDIT RACK MODAL*/}
            <div className="modal fade" id="editRackModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            Edit Rack
                        </div>
                        <div className="row d-flex justify-content-center">
                                <div className="col-4">
                                    <p>Player One</p>
                                    <div>
                                    {playerOne.rackBallsPotted.map((ball) => {
                                        const source = BallImages[ball].img
                                        console.log(source)
                                        return (
                                            <div className="ballImg mb-2">
                                                <img key={ball} src={source} alt=""/>
                                            </div>
                                        )
                                    })}
                                    </div>
                            </div>
                            <div className="col-4">
                                    <p>Dead Balls</p>
                                    <div>
                                    {deadBalls.map((ball) => {
                                        const source = BallImages[ball].img
                                        console.log(source)
                                        return (
                                            <div className="ballImg mb-2">
                                                <img key={ball} src={source} alt=""/>
                                            </div>
                                        )
                                    })}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <p>Player Two</p>
                                <div>
                                    {playerTwo.rackBallsPotted.map((ball) => {
                                        const source = BallImages[ball].img
                                        console.log(source)
                                        return (
                                            <div className="ballImg mb-2">
                                                <img key={ball} src={source} alt=""/>
                                            </div>
                                        )
                                    })}
                                    </div>
                                </div>
                            </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Done</button>
                            
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    ) 
}
