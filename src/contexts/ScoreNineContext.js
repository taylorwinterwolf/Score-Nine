import { createContext, useContext, useEffect, useState } from "react"
import UseLocalStorage from "../hooks/UseLocalStorage"

const ScoreNineContext = createContext()

export function useScoreNine() {
    return useContext(ScoreNineContext)
}

export const ScoreNineProvider = ({ children }) => {





return (
        <ScoreNineContext.Provider value={{}}>
            { children }
        </ScoreNineContext.Provider>        
    )
}