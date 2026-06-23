import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { startGuessingGame, giveGuess } from "../../socket/selectLobby";
import { socket } from "../../socket/socket";
//import "../../style/buttons.css";
import "../../App.css";


export interface GuessingGame {
  id: string;
  drawPrompt: string;
  participants: string[];
  drawMasterId: string;
  answerOptions: string[]; 
}

export default function GuessingGameCreator() {
    const { activeLobbyId, guessingGame } = useContext(AppContext);
    const [showStartPrompt, setShowStartPrompt] = useState(false);
    
    const joinGuessingGame = () => {
        if(!activeLobbyId) return;
        setShowStartPrompt(false);
        startGuessingGame(activeLobbyId)
    }

    const guessHandler = (answer: string) => {
        if (!activeLobbyId) return;
        giveGuess(activeLobbyId, answer)
    }

    if(!guessingGame){ return (
        <div style={{ position: "relative" }}>
            <button
             className="btn btn-secondary lm-trigger"
             onClick={() => setShowStartPrompt(true)}>
                Starte Rate Spiel
            </button>
            {showStartPrompt && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Rate Spiel starten"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: "min(280px, 80vw)",
                        padding: "12px",
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "8px",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
                        zIndex: 1300,
                    }}
                >
                    <p style={{ margin: "0 0 10px", color: "#1f2937", fontWeight: 700 }}>
                        Rate Spiel starten?
                    </p>
                    <p style={{ margin: "0 0 12px", color: "#4b5563", fontSize: "14px", lineHeight: 1.35 }}>
                        Eine Person bekommt gleich einen Zeichenauftrag. Alle anderen raten mit Auswahlmöglichkeiten.
                    </p>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowStartPrompt(false)}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={joinGuessingGame}
                        >
                            Starten
                        </button>
                    </div>
                </div>
            )}
        </div>
    )}

    if(socket.id === guessingGame.drawMasterId) { return null } else { return (
        <div>
            <div>
                {guessingGame.answerOptions.map((answer: string) => (
                    <button
                        className="btn btn-secondary"
                        key={answer}
                        onClick={() => guessHandler(answer)}
                        >
                        {answer}
                    </button>
                ))}
            </div>
        </div>
    )}
}
