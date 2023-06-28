import { useScoreNine } from "../contexts/ScoreNineContext";
import PlayerCard from "./PlayerCard";
import EditRack from "./EditRack";
import logo from "../assets/logo.png";

export default function ScoreNine() {
  const {
    players,
    playerOneActive,
    deadBalls,
    ballIcons,
    rackNumber,
    ballStates,
    nineIsPotted,
    BallImages,
    updateBallState,
    updatePlayers,
    getOverlayImage,
    turnOver,
    newRack,
    clearAll,
  } = useScoreNine();

  const inlineStyles = {
    activePlayer: {
      backgroundColor: "#729142",
      borderRadius: "10px 0px 0px 10px",
      color: "gold",
    },
    inActivePlayer: {
      backgroundColor: "#839099",
      borderRadius: "10px 0px 0px 10px",
    },
  };

  return (
    <div className="centerTxt">
      <div className="row mb-2 mt-2 d-flex justify-content-center">
        <div className="col-7" id="logoWrap">
          <img src={logo} alt="" />
        </div>
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
        <div className="col">
          <span className="me-1">Dead Balls:</span>
          {deadBalls.length > 0 &&
            deadBalls
              .sort((a, b) => a - b)
              .map((ballNum) => {
                return (
                  <img
                    key={ballNum}
                    src={ballIcons[ballNum].icon}
                    alt=""
                    className="icon"
                  />
                );
              })}
        </div>
      </div>

      {/*AVAILABLE BALLS*/}
      <div className="row ballsContainer d-flex justify-content-center">
        <div className="rackNumber">
          <h2>Rack Number {rackNumber}</h2>
        </div>
        {ballStates.map((ballState) => {
          if (ballState !== null && ballState.archived !== true) {
            return (
              <div
                key={ballState.id}
                onClick={() => {
                  updateBallState(ballState.id);
                }}
                className="col-4 col-sm-2 ballImg mb-2"
              >
                <img
                  key={ballState.id}
                  src={BallImages[ballState.id].img}
                  alt=""
                />
                <img
                  key={"icon-" + ballState.id}
                  className="overlayImage"
                  src={getOverlayImage(ballState)}
                  alt=""
                />
              </div>
            );
          }
        })}
      </div>

      <EditRack />

      {/*BUTTONS*/}
      <div className="row mb-5">
        <div className="col d-flex">
          <button
            type="button"
            className={
              "flex-fill btn " +
              (!nineIsPotted ? "btn-secondary" : "btn-outline-secondary")
            }
            onClick={nineIsPotted ? undefined : turnOver}
          >
            Turn Over
          </button>

          <button
            type="button"
            className={
              "flex-fill btn " +
              (nineIsPotted ? "btn-secondary" : "btn-outline-secondary")
            }
            disabled={!nineIsPotted}
            onClick={newRack}
          >
            Start New Rack
          </button>

          <button
            type="button"
            className="flex-fill btn btn-outline-secondary"
            data-bs-toggle="collapse"
            data-bs-target="#editRackCollapse"
            aria-expanded="false"
            aria-controls="editRackCollapse"
          >
            Edit Rack
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col d-flex">
          <button
            type="button"
            className="flex-fill btn btn-outline-primary"
            onClick={clearAll}
          >
            Clear Everything
          </button>
          <button
            type="button"
            className="flex-fill btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#editPlayersModal"
          >
            Edit Players
          </button>
        </div>
      </div>
    </div>
  );
}
