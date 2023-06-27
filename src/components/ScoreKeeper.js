import React, { useState, useEffect, useRef } from "react"
import { InitialBallStates } from "./InitialBallStates"
import { ballIcons } from "./BallIcons"
import { BallImages } from "./BallImages"
import PlayerCard from "./PlayerCard"
import UseLocalStorage from "../hooks/UseLocalStorage"
import { defaultPlayers } from "./DefaultPlayers"
import logo from '../assets/logo.png'



export default function ScoreKeeper() {
    const [playerOneActive, setPlayerOneActive] = useState(true)
    const [ballStates, setBallStates] = UseLocalStorage("ballStates", InitialBallStates)
    const [nineIsPotted, setNineIsPotted] = useState(false)
    const [winner, setWinner] = useState()
    const [rackNumber, setRackNumber] = useState(1)
    const [deadBalls, setDeadBalls] = UseLocalStorage("deadBalls", [])
    const [players, setPlayers] = UseLocalStorage('players', defaultPlayers)

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

    /*
    useEffect(() => {
        if (players[1].winner === true) {
            setWinner(players[1].name)
        }else if (players[2].winner === true) {
            setWinner(players[2].name)
        }
    }, [players[1].winner, players[2].winner])
    */

    const updateScore = (ballState) => {

        const currentState = ballState.currentState

        let newState = 'default'
        
        switch (currentState) {
        case 'default':
            newState = "potted";
            break;
        case 'potted':
            newState = "dead";
            break;
        default:
            newState = "default";
            break;
        } 

        const activePlayerNumber = playerOneActive ? 1 : 2
        if (newState === 'potted') {
            setPlayerAddBall(activePlayerNumber, ballState.id)
        } else if (newState === 'dead') {
            setPlayerRemoveBall(activePlayerNumber, ballState.id)
        }
    }

    function setPlayerAddBall(playerID, ballID) {
        const ballValue = ballID === 9 ? 2 : 1
    
        setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers]
        updatedPlayers[playerID] = {
            ...updatedPlayers[playerID],
            totalPoints: prevPlayers[playerID].totalPoints + ballValue,
            
            pointsNeeded: prevPlayers[playerID].skillPoints - (prevPlayers[playerID].totalPoints + ballValue) > 0
            ? prevPlayers[playerID].skillPoints - (prevPlayers[playerID].totalPoints + ballValue) : 0,
            
            rackBallsPotted: [...prevPlayers[playerID].rackBallsPotted, ballID],

            winner: prevPlayers[playerID].skillPoints - (prevPlayers[playerID].totalPoints + ballValue) === 0
            ? true
            : false
        }
            return updatedPlayers
        })
        
    }

    function setPlayerRemoveBall(playerID, ballID) {
        const ballValue = ballID === 9 ? 2 : 1
    
        setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers]
            updatedPlayers[playerID] = {
                ...updatedPlayers[playerID],
                totalPoints: prevPlayers[playerID].totalPoints - ballValue,
                pointsNeeded: prevPlayers[playerID].pointsNeeded + ballValue,
                rackBallsPotted: prevPlayers[playerID].rackBallsPotted.filter(ballId => ballId !== ballID),
                deadBalls: [...prevPlayers[playerID].rackBallsPotted, ballID],
                winner: prevPlayers[playerID].skillPoints + (prevPlayers[playerID].totalPoints + ballValue) >= 0 ? false : true
            }
            return updatedPlayers
        })
        setDeadBalls(prevBalls => [...prevBalls, ballID])
    }
    
    // Function to update the state of a specific ball
    const updateBallState = (ballId) => {

        if (ballId === 9) {
            setNineIsPotted(true)
        }
  
        const currentState = ballStates[ballId].currentState

        let state = 'default'
        
        switch (currentState) {
        case 'default':
            state = "potted";
            break;
        case 'potted':
            state = "dead";
            break;
        default:
            state = "default";
            break;
        }        

        //console.log(ballStates[ballId].currentState)
        setBallStates(prevBalls => {
            const updatedBalls = [...prevBalls] // Clone the array
            updatedBalls[ballId] = { ...updatedBalls[ballId], currentState: state }; // Update the currentState property
            return updatedBalls; // Return the updated array
        })

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
        /*
        setPlayerOne(prevPlayer => ({
            ...prevPlayer,
            name: playerOneNameRef.current.value,
            skillLevel: playerOneSkillRef.current.value,
            skillPoints: skillPointsKey[playerOneSkillRef.current.value],
            pointsNeeded: skillPointsKey[playerOneSkillRef.current.value]
        }))
        */
    }

    const turnOver = () => {
        //Toggle which player is active
        setPlayerOneActive(prevValue => !prevValue)
        
        const ballsDown = [...players[1].rackBallsPotted, ...players[2].rackBallsPotted, ...deadBalls]
        console.log(ballsDown)
        setBallStates(prevBalls => prevBalls.map((ball, index) => (
            ballsDown.includes(index) && index !== 0 ? { ...ball, archived: true} : ball
        )));
    }

    const clearAll = () => {
        setBallStates(InitialBallStates)
        setPlayerOneActive(true)
        setNineIsPotted(false)
        setRackNumber(1)
        setDeadBalls([])
        setPlayers(defaultPlayers)
    }

    const newRack = () => {  
        setBallStates(InitialBallStates)
        setNineIsPotted(false)
        setRackNumber(prevNumber => prevNumber + 1)
        setDeadBalls([])
        setPlayers(prevPlayers => {
            const updatedPlayers = [...prevPlayers]
            updatedPlayers[1].rackBallsPotted = []
            updatedPlayers[1].deadBalls = []
            updatedPlayers[2].rackBallsPotted = []
            updatedPlayers[2].deadBalls = []
            return updatedPlayers
        })

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

    return (
        <div className="centerTxt">  
            <div className="row mb-2 mt-2 d-flex justify-content-center">
                <div className="col-7" id="logoWrap"><img src={logo} alt="" /></div>
            </div>

            {/*PLAYER ONE*/}
            <PlayerCard
                playerActive={playerOneActive}
                playerName={players[1].name}
                rackBallsPotted={players[1].rackBallsPotted}
                skillLevel={players[1].skillLevel !== null ? players[1].skillLevel : 0}
                pointsNeeded={players[1].pointsNeeded}
                totalPoints={players[1].totalPoints}
                skillPoints={players[1].skillPoints}
            />    

            {/*PLAYER TWO*/}
            <PlayerCard
                playerActive={!playerOneActive}
                playerName={players[2].name}
                rackBallsPotted={players[2].rackBallsPotted}
                skillLevel={players[2].skillLevel !== null ? players[2].skillLevel : 0}
                pointsNeeded={players[2].pointsNeeded}
                totalPoints={players[2].totalPoints}
                skillPoints={players[2].skillPoints}
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
                    if(ballState !== null && ballState.archived !== true){
                        return (
                            <div key={ballState.id} onClick={nineIsPotted ? undefined : () => { updateBallState(ballState.id); updateScore(ballState); }}
 className="col-4 col-sm-2 ballImg mb-2">
                                <img src={BallImages[ballState.id].img} alt=""/>
                                <img className="overlayImage" src={getOverlayImage(ballState)} alt=""/>
                            </div>
                        )
                    }
                })}
            </div>





            {/*BUTTONS*/}
            <div className="row mb-5">
                <div className="col d-flex">
                    <button type="button" className={'flex-fill btn ' + (!nineIsPotted ? 'btn-secondary' : 'btn-outline-secondary')} onClick={nineIsPotted ? undefined : turnOver}>Turn Over</button>

                    <button type="button" className={'flex-fill btn ' + (nineIsPotted ? 'btn-secondary' : 'btn-outline-secondary')} disabled={!nineIsPotted} onClick={newRack}>Start New Rack</button>

                    <button type="button" className='flex-fill btn btn-outline-secondary' data-bs-toggle="modal" data-bs-target="#editRackModal">Edit Rack</button>
                </div>
            </div>
            <div className="row">
                <div className="col d-flex">
                    <button type="button" className="flex-fill btn btn-outline-primary" onClick={clearAll}>Clear Everything</button>
                    <button type="button" className="flex-fill btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editPlayersModal">Edit Players</button>
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
                                    {players[1].rackBallsPotted.map((ballNum) => {
                                        const source = BallImages[ballNum].img
                                        return (
                                            <div className="ballImg mb-2" onClick={() => updateScore()}>
                                                <img key={ballNum} src={source} alt=""/>
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
                                    {players[2].rackBallsPotted.map((ball) => {
                                        const source = BallImages[ball].img
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
