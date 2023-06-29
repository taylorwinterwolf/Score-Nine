import { createContext, useContext, useEffect, useState, useRef } from "react";
import UseLocalStorage from "../hooks/UseLocalStorage";
import { InitialBallStates } from "../components/InitialBallStates";
import { ballIcons } from "../components/BallIcons";
import { BallImages } from "../components/BallImages";
import { defaultPlayers } from "../components/DefaultPlayers";

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

  //ANYTIME UPDATE BALL STATES CHANGES, UPDATE EVERYTHING ELSE
  
  useEffect(() => {

    updatePlayers()

  }, [ballStates])
  

  function updatePlayers() {
    console.log(ballStates)
    
    ballStates.forEach((ballState, index) => {
      const ballNum = ballState.id
      const ballValue = ballNum === 9 ? 2 : 1
      const previousOwner = ballState.previousOwner
      const currentOwner = ballState.currentOwner
      //Accounting for the 0 index where player one resides
      const previousOwnerIndex = previousOwner !== -1 || 0 ? previousOwner - 1 : 0
      const newOwnerIndex = currentOwner !== -1 || 0 ? currentOwner - 1 : 0


      if (previousOwner !== currentOwner) {
        if (currentOwner === -1) {
          //MOVE TO DEAD BALLS
          if (ballNum !== 9) {
            setDeadBalls((prevBalls) => {
              const uniqueBalls = new Set([...prevBalls, ballNum]);
              return Array.from(uniqueBalls);
            })
          }
          //REMOVE BALL FROM PREVIOUS OWNER
          removeBall(ballNum, previousOwnerIndex)

          //REMOVE PREVIOUS OWNER POINTS
          removePoints(ballValue, previousOwnerIndex)
        } else {
          //Ball is potted
          //Add ball to current owner and update score
          addBall(ballNum, newOwnerIndex)
          addPoints()

          //If previous owner is not 0
          //Remove from previous owner and update score
        }
        //This means something changed
        //Take
      } else {
        if (ballState.id !== 9) {
            //If ball is reset, remove from dead
            setDeadBalls((prevBalls) => prevBalls.filter((ballId) => ballId !== ballState.id)
          );
        } else {
            //Reset Nine Ball
            //setPlayerRemoveBall(currentOwner, ballState.id);
        }
      }
    });
    
  }

  function addBall(ballNum, atIndex) {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[atIndex] = {
        ...updatedPlayers[atIndex],
        rackBallsPotted: [...new Set([...prevPlayers[atIndex].rackBallsPotted, ballNum])]
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

  function addPoints(){}

  const updateBallState = (ballNum) => {
    const ballIndex = ballNum - 1
    const currentState = ballStates[ballIndex].currentState
    let newState = 'default'
    let newOwner = 0
    let previousOwner = ballStates[ballIndex].currentOwner

    if (previousOwner === 0) {
      //Ball is potted
      newOwner = playerOneActive ? 1 : 2
    } else if (previousOwner === 1 || previousOwner === 2) {
      //Ball is dead
      newOwner = -1
    } else {
      previousOwner = 0
    }

    switch (currentState) {
        case "default":
        newState = "potted"
        if (ballNum === 9) {
          setNineIsPotted(!nineIsPotted);
        }
        break;
        case "potted":
        if (ballNum !== 9) {
          newState = "dead";
        }
        break;
        default:
        newState = "default";
        break
      }

    setBallStates((prevBalls) => {
      const updatedBalls = [...prevBalls];
      updatedBalls[ballIndex] = {
        ...updatedBalls[ballIndex],
        currentState: newState,
        currentOwner: newOwner,
        previousOwner: previousOwner
      }

      return updatedBalls;
    })
  }
  
  /*
  function setPlayerAddBall(playerID, ballID) {
    const ballValue = ballID === 9 ? 2 : 1;

    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[playerID] = {
        ...updatedPlayers[playerID],
        totalPoints: prevPlayers[playerID].totalPoints + ballValue,

        pointsNeeded:
          prevPlayers[playerID].skillPoints -
            (prevPlayers[playerID].totalPoints + ballValue) >
          0
            ? prevPlayers[playerID].skillPoints -
              (prevPlayers[playerID].totalPoints + ballValue)
            : 0,

        rackBallsPotted: ballStates
          .filter(
            (ballState) =>
              ballState !== null &&
              ballState.currentOwner === playerID &&
              ballState.currentState === "potted"
          )
          .map((ballState) => ballState.id),

        winner:
          prevPlayers[playerID].skillPoints -
            (prevPlayers[playerID].totalPoints + ballValue) ===
          0
            ? true
            : false,
      };
      return updatedPlayers;
    });
  }

  function setPlayerRemoveBall(playerID, ballID) {
    const ballValue = ballID === 9 ? 2 : 1;

    
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[playerID] = {
        ...updatedPlayers[playerID],
        totalPoints:
          prevPlayers[playerID].totalPoints - ballValue > 0
            ? prevPlayers[playerID].totalPoints - ballValue
            : 0,
        pointsNeeded: prevPlayers[playerID].pointsNeeded + ballValue,
        rackBallsPotted: prevPlayers[playerID].rackBallsPotted.filter(
          (ballId) => ballId !== ballID
        ),
        winner:
          prevPlayers[playerID].skillPoints +
            (prevPlayers[playerID].totalPoints + ballValue) >=
          0
            ? false
            : true,
      };
      return updatedPlayers;
    })
    if (ballID !== 9) {
      setDeadBalls((prevBalls) => {
        const uniqueBalls = new Set([...prevBalls, ballID]);
        return Array.from(uniqueBalls);
      });
    }


  }
*/

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
    setPlayerOneActive((prevValue) => !prevValue);

    const ballsDown = [
      ...players[1].rackBallsPotted,
      ...players[2].rackBallsPotted,
      ...deadBalls,
    ];
    //console.log(ballsDown)
    setBallStates((prevBalls) =>
      prevBalls.map((ball, index) =>
        ballsDown.includes(index) && index !== 0
          ? { ...ball, archived: true }
          : ball
      )
    );
  };

  const clearAll = () => {
    setBallStates(InitialBallStates);
    setPlayerOneActive(true);
    setNineIsPotted(false);
    setRackNumber(1);
    setDeadBalls([]);
    setPlayers(defaultPlayers)
  };

  const newRack = () => {
    setBallStates(InitialBallStates);
    setNineIsPotted(false);
    setRackNumber((prevNumber) => prevNumber + 1);
    setDeadBalls([]);
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[1].rackBallsPotted = [];
      updatedPlayers[2].rackBallsPotted = [];
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
