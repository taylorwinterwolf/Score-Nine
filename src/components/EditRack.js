import { useState } from "react"
import { useScoreNine } from "../contexts/ScoreNineContext"

export default function EditRack() {
  const { editBalls, players, BallImages, deadBalls, setEditBalls } = useScoreNine();
  let optionTxt = ["", "", ""]
  const [ballClickCount, updateBallClickCount] = useState([])
  
  function updateEditBalls(ballID, currentState, currentOwner) {
    console.log("Ball ID: ", ballID, "Current Owner: ", currentOwner, "Current State: ", currentState)
    
    updateBallClickCount((prevBallClickCount) => {
      const newCount = [...prevBallClickCount];
      newCount.push({ id: ballID });
      return newCount;
    })
    
    let newOwner = 4
    //Player 1
    switch (ballClickCount) {
      case 0:
        newOwner = 1
        optionTxt[0] = "Other's Ball"
        break
      case 1:
        newOwner = 3
        optionTxt[0] = "Dead Ball"
        break
      case 2:
        newOwner = 4
        optionTxt[0] = "Reset"
        break
      default:
        break
    }

    /*
    setEditBalls((prevEditBalls) => {
      const newEntry = { id: ballID, currentState, currentOwner, newOwner }
      const updatedBalls = prevEditBalls.filter((ball) => ball.id !== ballID)
      updatedBalls.push(newEntry)
      return updatedBalls
    })
    */
    console.log("Edit Balls: ", editBalls)
    console.log("Ball Click Count: ", ballClickCount)
  }

  return (
    <>
      <div
        className="collapse"
        id="editRackCollapse"
        style={{ borderTop: "1px solid gray", paddingTop: "5px" }}
      >
        <div className="row d-flex justify-content-center">

          {/*PLAYER ONE*/}
          <div className="col-4">
            <h5 className="bold">Player One</h5>
            <div>
              {players[0].rackBallsPotted.map((ballNum) => {
                const source = BallImages[ballNum].img
                const currentState = 'potted'
                const currentOwner = 0
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() => updateEditBalls(ballNum, currentState, currentOwner)}
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{optionTxt[0]}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/*DEAD BALLS*/}
          <div className="col-4">
            <h5 className="bold">Dead Balls</h5>
            <div>
              {deadBalls.map((ballNum) => {
                const source = BallImages[ballNum].img;
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() => updateEditBalls(ballNum, 'dead', 3)}
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{optionTxt[3]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/*PLAYER TWO*/}
          <div className="col-4">
            <h5 className="bold">Player Two</h5>
            <div>
              {players[1].rackBallsPotted.map((ballNum) => {
                const source = BallImages[ballNum].img
                const currentState = 'potted'
                const currentOwner = 1
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() => updateEditBalls(ballNum, currentState, currentOwner)}
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{optionTxt[1]}</p>
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
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
