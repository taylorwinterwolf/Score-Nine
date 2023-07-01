import { useScoreNine } from "../contexts/ScoreNineContext"


export default function EditRack() {
  const { players, BallImages, deadBalls, ballsToUpdate, setBallsToUpdate, editRack } = useScoreNine();
  
  
  function switchBallOptions(ballID, currentState, currentOwner) {
    console.log("Ball ID: ", ballID, "Current Owner: ", currentOwner, "Current State: ", currentState)
    const ballIndex = ballID - 1
    let optionTxt = ""
    let newOwner = null

    switch (ballsToUpdate[ballIndex].clicks) {
      case 0:
        //First Click
        if (currentOwner === 3) {
          optionTxt = "Player 1 Ball"
          newOwner = 0
        } else {
          optionTxt = "Other's Ball"
          newOwner = currentOwner === 0 ? 1 : 0
        }
        break
      case 1:
        //Second Click
        if (currentOwner === 3) {
          optionTxt = "Player 2 Ball"
          newOwner = 1
        } else {
          if (ballID !== 9) {
            optionTxt = "Dead"
            newOwner = 3
          } else {
            optionTxt = "Reset"
            newOwner = null
          }
        }
        break
      case 2:
        //Third Click
        optionTxt = "Reset"
        newOwner = null
        break
      case 3:
        //Fourth Click Clear everything
        optionTxt = ""
        newOwner = null
        break
      default:
        optionTxt = ""
        newOwner = null
        break
    }

    setBallsToUpdate((prevBalls) => {
    const updatedBalls = [...prevBalls]
    updatedBalls[ballIndex] = {
      ...updatedBalls[ballIndex],
      clicks: prevBalls[ballIndex].clicks + 1 > 3 ? 0 : prevBalls[ballIndex].clicks + 1,
      optionTxt,
      currentOwner,
      newOwner
    }
      return updatedBalls
    })
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
                const ballIndex = ballNum -1
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() => switchBallOptions(ballNum, currentState, currentOwner)}
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{ballsToUpdate[ballIndex].optionTxt}</p>
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
                const source = BallImages[ballNum].img
                const ballIndex = ballNum -1
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() => switchBallOptions(ballNum, 'dead', 3)}
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{ballsToUpdate[ballIndex].optionTxt}</p>
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
                const ballIndex = ballNum -1
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() => switchBallOptions(ballNum, currentState, currentOwner)}
                  >
                    <img key={"ballImg-" + ballNum} src={source} alt="" />
                    <p>{ballsToUpdate[ballIndex].optionTxt}</p>
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
            onClick={editRack}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
