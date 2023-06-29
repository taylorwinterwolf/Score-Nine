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
  const defaultEditRack = [
    null,
    {id: 1, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 2, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 3, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 4, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 5, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 6, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 7, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 8, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""},
    {id: 9, optionTxt: "", currentOwner: "", newOwner: "", ballState: "", operation: ""}
  ]
  const [playerOneActive, setPlayerOneActive] = useState(true);
  const [ballStates, setBallStates] = UseLocalStorage(
    "ballStates",
    InitialBallStates
  );
  const [nineIsPotted, setNineIsPotted] = useState(false);
  const [rackNumber, setRackNumber] = useState(1);
  const [deadBalls, setDeadBalls] = UseLocalStorage("deadBalls", []);
  const [players, setPlayers] = UseLocalStorage("players", defaultPlayers);
  const [editBalls, setEditBalls] = UseLocalStorage("editBalls", defaultEditRack)
  /*
    const [winner, setWinner] = useState()

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
    */

  const prevBallStatesRef = useRef([]);

  /*
  useEffect(() => {
    const prevBallStates = prevBallStatesRef.current;

    ballStates.forEach((ballState, index) => {
      if (
        ballState !== null &&
        ballState !== prevBallStates[index]
      ) {
        updatePlayers(ballState);
      }
    });

    prevBallStatesRef.current = ballStates;
  }, [ballStates]);
*/
  const updatePlayers = (ballState) => {
    const currentState = ballState.currentState;
    const currentOwner = ballState.currentOwner;

    if (currentState === "potted") {
        setPlayerAddBall(currentOwner, ballState.id);
      } else if (currentState === "dead") {
          setPlayerRemoveBall(currentOwner, ballState.id);
      } else if (currentState === "default") {
        if (ballState.id !== 9) {
            //If ball is reset, remove from dead
            setDeadBalls((prevBalls) => prevBalls.filter((ballId) => ballId !== ballState.id)
          );
        } else {
            //Reset Nine Ball
            setPlayerRemoveBall(currentOwner, ballState.id);
        }
    }
  };

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

  const updateBallState = (ballId, editRack = false, editRackState) => {
    const currentState = ballStates[ballId].currentState;
    let newOwner = playerOneActive ? 1 : 2;
    let newState = "default";

    if (editRack) {
      const operation = editRackState.operation
      switch (operation) {
        case 'moveToPlayer':
          newState = 'potted'
          newOwner = editRackState.newOwner
          break
        case 'dead':
           newState = 'dead'
          break
        default:
          newState = 'default'
          break
      }
    } else {
      switch (currentState) {
        case "default":
          newState = "potted";
          if (ballId === 9) {
            setNineIsPotted(!nineIsPotted);
          }
          break;
        case "potted":
          if (ballId !== 9) {
            newState = "dead";
            newOwner = -1;
          }
          break;
        default:
          newState = "default";
          break;
      }
    }

    setBallStates((prevBalls) => {
      const updatedBalls = [...prevBalls];
      updatedBalls[ballId] = {
        ...updatedBalls[ballId],
        currentState: newState,
        currentOwner: newOwner,
      };

      return updatedBalls;
    });
  };

  

  function editRack(editBalls) {
    /*
    editBalls.filter((editBall) => editBall !== null && editBall.ballState.operation !== "")

    editBalls.forEach((ballState, index) => {
      if(ballState !== null){
        updateBallState(ballState.id, editRack = true, ballState)
      }
    })
    */
  }

  function updateEditRackBalls(ballState, operation, optionTxt, currentOwner) {
    let newOperation = "";
    let newOwner = currentOwner;

    //IF COMING FROM DEAD BALL
    if (ballState.currentState === "dead") {
      switch (optionTxt) {
        case "":
          optionTxt = "Player 1 Ball";
          newOperation = "moveToPlayer";
          newOwner = 1;
          break;
        case "Player 1 Ball":
          optionTxt = "Player 2 Ball";
          newOperation = "moveToPlayer";
          newOwner = 2;
          break;
        case "Player 2 Ball":
          optionTxt = "Reset";
          newOperation = "default";
          newOwner = 0;
          break;
        default:
          optionTxt = "";
          newOperation = "";
          newOwner = "";
          break;
      }
    } else {
      //UPDATE OPTION TEXT UNDER PLAYER BALL IMAGE
      switch (operation) {
        case "":
          optionTxt = "Other's Ball";
          newOperation = "moveToPlayer";
          newOwner = currentOwner === 1 ? 2 : 1;
          break;
        case "moveToPlayer":
          optionTxt = "Dead Ball";
          newOperation = "dead";
          newOwner = -1;
          break;
        case "dead":
          optionTxt = "Reset";
          newOperation = "default";
          newOwner = 0;
          break;
        default:
          optionTxt = "";
          newOperation = "";
          newOwner = "";
          break;
      }
    }

    const updatedOptions = [...editBalls];
    updatedOptions[ballState.id] = {
      ...updatedOptions[ballState.id],
      optionTxt: optionTxt,
      operation: newOperation,
      ballState: ballState,
      currentOwner: currentOwner,
      newOwner: newOwner,
    };
    setEditBalls(updatedOptions);
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
    setEditBalls(defaultEditRack)
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
        editBalls,
        updateBallState,
        updatePlayers,
        getOverlayImage,
        turnOver,
        newRack,
        clearAll,
        editRack,
        updateEditRackBalls
      }}
    >
      {children}
    </ScoreNineContext.Provider>
  );
};
