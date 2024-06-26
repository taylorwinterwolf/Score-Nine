import { useScoreNine } from "../contexts/ScoreNineContext"
import PlayerCard from "./PlayerCard"
import EditRack from "./EditRack"
import EditPlayers from "./EditPlayers"
import logo from "../assets/logo.png"

export default function ScoreNine() {
  const { players, playerOneActive, deadBalls, ballIcons, rackNumber, ballStates, nineIsPotted, BallImages,
    updateBallState, getOverlayImage, turnOver, newRack, customPlayers, clearAll
  } = useScoreNine();

  return (
    <div className="centerTxt">
      <div className="row mb-2 mt-2 d-flex justify-content-center">
        <div className="col-7" id="logoWrap">
          <img src={logo} alt="Score Nine" />
        </div>
      </div>

      {/*PLAYER ONE*/}
      <PlayerCard
        playerActive={playerOneActive}
        playerName={players[0].name}
        rackBallsPotted={players[0].rackBallsPotted}
        skillLevel={players[0].skillLevel !== null ? players[0].skillLevel : 0}
        pointsNeeded={players[0].pointsNeeded}
        totalPoints={players[0].totalPoints}
        rackPoints={players[0].rackPoints}
        skillPoints={players[0].skillPoints}
      />

      {/*PLAYER TWO*/}
      <PlayerCard
        playerActive={!playerOneActive}
        playerName={players[1].name}
        rackBallsPotted={players[1].rackBallsPotted}
        skillLevel={players[1].skillLevel !== null ? players[1].skillLevel : 0}
        pointsNeeded={players[1].pointsNeeded}
        totalPoints={players[1].totalPoints}
        rackPoints={players[1].rackPoints}
        skillPoints={players[1].skillPoints}
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
                {ballState.currentState !== 'default' &&
                  <img
                    key={"icon-" + ballState.id}
                    className="overlayImage"
                    src={getOverlayImage(ballState)}
                    alt=""
                  />
                }
              </div>
            );
          }
        })}
      </div>

      <EditRack />

      {/*BUTTONS*/}
      {nineIsPotted &&
          <div className="row mb-2">
            <div className="col d-flex">
              <button type="button" className="flex-fill btn btn-lg btn-secondary p-3" onClick={newRack}>
                Start New Rack
              </button>
            </div>
          </div>
      }
      {!customPlayers &&
        <div className="row mb-2">
          <div className="col d-flex">
            <button type="button" className="flex-fill btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#editPlayersModal">
              Add Match Up
            </button>
          </div>
        </div>
      }
      <div className="row mb-2">
        <div className="col d-flex">
          <button type="button" className={ "flex-fill btn btn-lg p-3 " + (!nineIsPotted ? "btn-secondary" : "btn-outline-secondary")} onClick={nineIsPotted ? undefined : turnOver}>
            Turn Over
          </button>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col d-flex">
          <button
            type="button"
            className="flex-fill btn btn-lg btn-secondary"
            data-bs-toggle="collapse"
            data-bs-target="#editRackCollapse"
            aria-expanded="false"
            aria-controls="editRackCollapse"
            disabled={players[0].rackBallsPotted.length === 0 && players[1].rackBallsPotted.length === 0 && deadBalls.length === 0}
          >
            Edit Rack
          </button>
        </div>
      </div>
      {customPlayers &&
        <div className="row mb-2">
          <div className="col d-flex">
            <button type="button" className="flex-fill btn btn-lg btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editPlayersModal">
              Edit Match Up
            </button>
          </div>
        </div>
      }
      <div className="row">
        <div className="col d-flex">
          <button
            type="button"
            className="flex-fill btn btn-sm btn-outline-secondary"
            onClick={clearAll}
          >
            Reset Default
          </button>
          <EditPlayers />
        </div>
      </div>
    </div>
  );
}
