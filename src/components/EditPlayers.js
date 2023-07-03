import { useRef } from "react"
import { useScoreNine } from "../contexts/ScoreNineContext"

export default function EditPlayers() {
    const { addPlayers } = useScoreNine()
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

    function handleClick(){
        const playersInfo = [
            {
            name: playerOneNameRef.current.value,
            skillLevel: playerOneSkillRef.current.value
            },
            {
            name: playerTwoNameRef.current.value,
            skillLevel: playerTwoSkillRef.current.value
            }
        ]
        addPlayers(playersInfo)
    }

    return (
        <>  {/*EDIT PLAYERS MODAL*/ }
            <div className="modal fade" id="editPlayersModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="playerWrapper">
                                <div><h5>Player 1 Name</h5></div>
                                <div><input type="text" ref={playerOneNameRef}/></div>
                                <div><h5>Select Skill Level</h5></div>
                                <div>
                                    <select ref={playerOneSkillRef}>
                                        {skillLevels.map((option) => {
                                            return (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="playerWrapper">
                                <div><h5>Player 2 Name</h5></div>
                                <div><input type="text" ref={playerTwoNameRef}/></div>
                                <div><h5>Select Skill Level</h5></div>
                                <div>
                                    <select ref={playerTwoSkillRef}>
                                        {skillLevels.map((option) => {
                                            return (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleClick} data-bs-dismiss="modal">Add Players</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>    
                    </div>
                </div>
            </div>
        </>
    )
}            
            