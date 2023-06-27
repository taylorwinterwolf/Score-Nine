import { ballIcons } from "./BallIcons"

export default function PlayerCard({ playerActive, playerName, rackBallsPotted, skillLevel, pointsNeeded, totalPoints, skillPoints }){
    
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
        <div className="row d-flex justify-content-center playerWrapper">
            <div className="playerContainer col-11 mb-2">
                <div className="row">
                <div className="col-1 d-flex align-items-center justify-content-center p-0" style={playerActive ? inlineStyles.activePlayer : inlineStyles.inActivePlayer}>{playerActive && <span>&#9733;</span>}</div>
                <div className="col-9 d-flex flex-column">
                    <div className="row flex-grow-1 align-items-center">
                            <p className="playerName">
                                {playerName !== null ? playerName : "Player 1"}
                            </p>
                        </div>
                        <div className="row flex-grow-1">
                            <div className="col d-flex justify-content-center align-items-center">
                            {rackBallsPotted.length > 0 && rackBallsPotted.sort((a, b) => a - b).map((ballNum) => {
                                return(
                                    <img key={ballNum} src={ballIcons[ballNum].icon} alt="" className="icon ms-1"/>
                                )
                            })}
                        </div>
                        </div>
                    <div className="row flex-grow-1">
                        <div className="col d-flex justify-content-center align-items-center skillLevel">
                            SL {skillLevel !== null ? skillLevel : 0}
                        </div>
                        <div className="col toWin d-flex justify-content-center align-items-center">
                            <div className="col">{pointsNeeded} TO WIN</div>
                        </div>
                    </div>
                </div>
                <div className="col-2 scoreBoard d-flex flex-column">
                    <div className="row flex-grow-1" style={{ backgroundColor: '#838370' }}>
                            <h1>{totalPoints}</h1>
                    </div>
                    <div className="row flex-grow-1" style={{ backgroundColor: '#6d828f' }}>
                        <h1>{skillPoints}</h1>
                    </div>
                </div>
                </div>                    
            </div>
        </div>
    )
}