import { useScoreNine } from "../contexts/ScoreNineContext";
import UseLocalStorage from "../hooks/UseLocalStorage";

export default function EditRack() {
  const { editRack, players, BallImages, deadBalls, ballStates } =
    useScoreNine();
  const [editBalls, setEditBalls] = UseLocalStorage("editBalls", [
    null,
    {
      id: 1,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 2,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 3,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 4,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 5,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 6,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 7,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 8,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
    {
      id: 9,
      optionTxt: "",
      currentOwner: "",
      newOwner: "",
      ballState: "",
      operation: "",
    },
  ]);

  function updateBallOptions(ballState, operation, optionTxt, currentOwner) {
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

  return (
    <>
      <div
        className="collapse"
        id="editRackCollapse"
        style={{ borderTop: "1px solid gray", paddingTop: "5px" }}
      >
        <div className="row d-flex justify-content-center">
          <div className="col-4">
            <h5 className="bold">Player One</h5>
            <div>
              {players[1].rackBallsPotted.map((ballNum) => {
                const source = BallImages[ballNum].img;
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() =>
                      updateBallOptions(
                        ballStates[ballNum],
                        editBalls[ballNum].operation,
                        editBalls[ballNum].optionTxt,
                        ballStates[ballNum].currentOwner
                      )
                    }
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{editBalls[ballNum].optionTxt}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-4">
            <h5 className="bold">Dead Balls</h5>
            <div>
              {deadBalls.map((ballNum) => {
                const source = BallImages[ballNum].img;
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() =>
                      updateBallOptions(
                        ballStates[ballNum],
                        editBalls[ballNum].operation,
                        editBalls[ballNum].optionTxt,
                        ballStates[ballNum].currentOwner
                      )
                    }
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{editBalls[ballNum].optionTxt}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-4">
            <h5 className="bold">Player Two</h5>
            <div>
              {players[2].rackBallsPotted.map((ballNum) => {
                const source = BallImages[ballNum].img;
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() =>
                      updateBallOptions(
                        ballStates[ballNum],
                        editBalls[ballNum].operation,
                        editBalls[ballNum].optionTxt,
                        ballStates[ballNum].currentOwner
                      )
                    }
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{editBalls[ballNum].optionTxt}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-toggle="collapse"
            data-bs-target="#editRackCollapse"
            aria-controls="editRackCollapse"
            onClick={() => editRack(editBalls)}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
