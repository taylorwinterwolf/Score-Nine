import { useScoreNine } from "../contexts/ScoreNineContext";

export default function EditRack() {
  const { editRack, editBalls, players, BallImages, deadBalls, ballStates, updateEditRackBalls } = useScoreNine();
  

  

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
              {players[0].rackBallsPotted.map((ballNum) => {
                const source = BallImages[ballNum].img;
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() =>
                      updateEditRackBalls(
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
                      updateEditRackBalls(
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
              {players[1].rackBallsPotted.map((ballNum) => {
                const source = BallImages[ballNum].img;
                return (
                  <div
                    key={"ballImgWrap-" + ballNum}
                    className="ballImg mb-2"
                    onClick={() =>
                      updateEditRackBalls(
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
