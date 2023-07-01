import { createContext, useContext, useState } from "react";
import UseLocalStorage from "../hooks/UseLocalStorage";
import { InitialBallStates } from "../components/InitialBallStates";
import { ballIcons } from "../components/BallIcons";
import { BallImages } from "../components/BallImages";
import { defaultPlayers } from "../components/DefaultPlayers"
import { defaultBallsToUpdate } from "../components/DefaultBallsToUpdate"

const ScoreNineContext = createContext();

export function useScoreNine() {
  return useContext(ScoreNineContext);
}

export const ScoreNineProvider = ({ children }) => {
  const [playerOneActive, setPlayerOneActive] = useState(true);
  const [ballStates, setBallStates] = UseLocalStorage("ballStates", InitialBallStates)
  const [nineIsPotted, setNineIsPotted] = useState(false);
  const [rackNumber, setRackNumber] = useState(1);
  const [deadBalls, setDeadBalls] = UseLocalStorage("deadBalls", []);
  const [players, setPlayers] = UseLocalStorage("players", defaultPlayers)
  const [ballsToUpdate, setBallsToUpdate] = UseLocalStorage("ballsToUpdate", defaultBallsToUpdate)

  const updateBallState = (ballNum, editRack=false, updateOwner) => {
    //KEY: player1 = 0, player2 = 1, deadBall = 3, reset = 4
    const ballIndex = ballNum - 1//Because balls index starts at 0
    const currentOwner = ballStates[ballIndex].currentOwner
    const previousOwner = ballStates[ballIndex].currentOwner
    let newState = 'default'
    let newOwner = null

    if (!editRack) {
      if (currentOwner === null) {
        //BALL IS POTTED INCLUDING 9
        newOwner = playerOneActive ? 0 : 1
      } else if ((currentOwner === 0 || currentOwner === 1) && ballNum !== 9) {
        //PLAYER BALL IS DEAD, BUT CAN'T BE THE 9
        newOwner = 3//dead
      } else {
        //RESET BALL
        newOwner = null
        if (ballNum === 9) {
            setNineIsPotted(false)
        }
      }
    } else {
      newOwner = updateOwner
    }

    switch (newOwner) {
      case 0:
        //Potted by player 1
        newState = "potted"
        if (ballNum === 9) {
          setNineIsPotted(true)
        }
      break;
      case 1:
        //Potted by player 2
        newState = "potted"
        if (ballNum === 9) {
          setNineIsPotted(true)
        }
      break
      case 3:
        //Dead
        if (ballNum !== 9) {
          newState = "dead"

          setDeadBalls((prevBalls) => {
            const uniqueBalls = new Set([...prevBalls, ballNum]);
            return Array.from(uniqueBalls);
          })
        }
      break
      case null:
        newState = "default"
        if (ballNum === 9) {
            setNineIsPotted(false)
        } else {
          //REMOVE FROM DEAD BALLS
          setDeadBalls((prevBalls) => prevBalls.filter((ballId) => ballId !== ballNum))
        }
        break
      default:
        break
    }
    console.log("Check Before updatePlayers. Ball #: ",ballNum, " Previous Owner: ", previousOwner, " New Owner: ", newOwner)
    updatePlayers(ballNum, previousOwner, newOwner)
    
    setBallStates((prevBalls) => {
      const updatedBalls = [...prevBalls];
      updatedBalls[ballIndex] = {
        ...updatedBalls[ballIndex],
        currentState: newState,
        currentOwner: newOwner,
        previousOwner: previousOwner,
    }
      return updatedBalls;
    })

    if (editRack) {
      archiveBalls()
    }
  }

  function updatePlayers(ballNum, previousOwner, currentOwner) {
    console.log("In updatePlayers, Ball Number is:", ballNum, "Previous Owner: ", previousOwner, "Current Owner is: ", currentOwner)
    const ballValue = ballNum === 9 ? 2 : 1
    const ballIndex = ballNum - 1

        if (currentOwner === 3) {
          //REMOVE BALL FROM PREVIOUS OWNER
          removeBall(ballNum, previousOwner)

          //REMOVE PREVIOUS OWNER POINTS
          removePoints(ballValue, previousOwner)

        } else if (currentOwner === null) {
          //RESET BALL
          console.log("Before resetBall: ", ballNum, ballValue, previousOwner)
          if (previousOwner !== 3 && previousOwner !== null) {
            resetBall(ballNum, ballValue, previousOwner)  
          } else {
            setBallStates((prevBalls) => {
              const updatedBalls = [...prevBalls];
              updatedBalls[ballIndex] = {
                ...updatedBalls[ballIndex],
                currentState: "default",
                currentOwner: null,
                previousOwner: null,
                archived: false
            }
            return updatedBalls;
            })
          }
          if (ballNum === 9) {
            setNineIsPotted(false)
          }
        } else {
            //BALL IS POTTED
            //ADD BALL TO CURRENT OWNER AND UPDATE SCORE
            addBall(ballNum, currentOwner)
            addPoints(ballValue, currentOwner)
            //REMOVE BALL FROM PREVIOUS OWNER
          if (previousOwner !== 3 && previousOwner !== null) {
            removeBall(ballNum, previousOwner)
            //REMOVE PREVIOUS OWNER POINTS
            removePoints(ballValue, previousOwner) 
          }
        }
  
  }

  function addBall(ballNum, atIndex) {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[atIndex] = {
        ...updatedPlayers[atIndex],
        rackBallsPotted: [...new Set([...prevPlayers[atIndex].rackBallsPotted, ballNum])],
      }
      return updatedPlayers;
    })
  }

  function removeBall(ballNum, atIndex) {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[atIndex] = {
        ...updatedPlayers[atIndex],
        rackBallsPotted: prevPlayers[atIndex].rackBallsPotted.filter(
          (ballId) => ballId !== ballNum,
        )
      }
      return updatedPlayers;
    })
    
  }

  function resetBall(ballNum, ballValue, previousOwner) {
    console.log("Ball #: ",ballNum," Ball Value: ", ballValue," Previous Owner", previousOwner)
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[previousOwner] = {
        ...updatedPlayers[previousOwner],
        rackBallsPotted: prevPlayers[previousOwner].rackBallsPotted.filter(
          (ballId) => ballId !== ballNum
        ),
        totalPoints:
          prevPlayers[previousOwner].totalPoints - ballValue > 0
            ? prevPlayers[previousOwner].totalPoints - ballValue
            : 0,
        archived: false
      }
      return updatedPlayers;
    });
  }


  function removePoints(ballValue, atIndex) {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[atIndex] = {
        ...updatedPlayers[atIndex],
        totalPoints:
          prevPlayers[atIndex].totalPoints - ballValue > 0
            ? prevPlayers[atIndex].totalPoints - ballValue
            : 0,
      }
      return updatedPlayers;
    })
  }

  function addPoints(ballValue, atIndex) {
    //const currentTotal = players[atIndex].totalPoints
    const updatedTotal = players[atIndex].totalPoints + ballValue
    //console.log("Passed In Ball Value: ", ballValue, "Current Total: ", currentTotal, "Updated Total: ", updatedTotal)

    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[atIndex] = {
        ...updatedPlayers[atIndex],
        totalPoints: updatedTotal
      }
      return updatedPlayers;
    })
  }

  function editRack() {
  const filteredBalls = ballsToUpdate.filter((ball) => ball.currentOwner !== null) 
  console.log("Balls To Update: ", filteredBalls);  

    filteredBalls.forEach(ball => {
      updateBallState(ball.id, editRack, ball.newOwner);  
    })
    setBallsToUpdate(defaultBallsToUpdate)
  }


  // Function to get the appropriate image based on the ball state
  const getOverlayImage = (ballState) => {
    switch (ballState.currentState) {
      case "potted":
        return require("../assets/pottedball.png");
      case "dead":
        return require("../assets/deadball.png");
      default:
        return ballState.image;
    }
  };

  function archiveBalls() {
    const ballsDown = [
      ...players[0].rackBallsPotted,
      ...players[1].rackBallsPotted,
      ...deadBalls,
    ]
    //ARCHIVE DOWNED BALLS
    setBallStates((prevBalls) =>
      prevBalls.map((ball) =>
        ballsDown.includes(ball.id) ? { ...ball, archived: true } : ball
      )
    )   
  }

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
  };

  const turnOver = () => {
    //Toggle which player is active
    setPlayerOneActive((prevValue) => !prevValue)
    archiveBalls()
  };

  const clearAll = () => {
    setBallStates(InitialBallStates);
    setPlayerOneActive(true);
    setNineIsPotted(false);
    setRackNumber(1);
    setDeadBalls([]);
    setPlayers(defaultPlayers)
    setBallsToUpdate(defaultBallsToUpdate)
  };

  const newRack = () => {
    setBallStates(InitialBallStates);
    setNineIsPotted(false);
    setRackNumber((prevNumber) => prevNumber + 1);
    setDeadBalls([]);
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0].rackBallsPotted = [];
      updatedPlayers[1].rackBallsPotted = [];
      return updatedPlayers;
    });
  };

  return (
    <ScoreNineContext.Provider
      value={{
        players,
        playerOneActive,
        deadBalls,
        ballIcons,
        rackNumber,
        ballStates,
        nineIsPotted,
        BallImages,
        ballsToUpdate,
        setBallsToUpdate,
        editRack,
        updateBallState,
        getOverlayImage,
        turnOver,
        newRack,
        clearAll,
      }}
    >
      {children}
    </ScoreNineContext.Provider>
  );
};
