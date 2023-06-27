export default function EditRack({ players, BallImages, deadBalls }) {
    //console.log(players)
    return (
        
        <div className="collapse" id="editRackCollapse">
            <div className="card card-body" style={{ backgroundColor: 'transparent', border:'none' }}>
            <div>
                Edit Rack
            </div>
            <div className="row d-flex justify-content-center">
                    <div className="col-4">
                        <p>Player One</p>
                        <div>
                        {players[1].rackBallsPotted.map((ballNum) => {
                            const source = BallImages[ballNum].img
                            return (
                                <div key={ballNum} className="ballImg mb-2" onClick={undefined}>
                                    <img key={ballNum} src={source} alt="" />
                                </div>
                            )
                        })}
                        </div>
                </div>
                <div className="col-4">
                        <p>Dead Balls</p>
                        <div>
                        {deadBalls.map((ball) => {
                            const source = BallImages[ball].img
                            return (
                                <div key={ball} className="ballImg mb-2">
                                    <img key={ball} src={source} alt=""/>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                    <div className="col-4">
                        <p>Player Two</p>
                    <div>
                        {players[2].rackBallsPotted.map((ball) => {
                            const source = BallImages[ball].img
                            return (
                                <div key={ball} className="ballImg mb-2">
                                    <img key={ball} src={source} alt=""/>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            <div>
                <button type="button" className="btn btn-secondary" data-bs-toggle="collapse" data-bs-target="#editRackCollapse" aria-controls="editRackCollapse">Done</button>
            </div>
            </div>    
        </div> 
        
    )
}