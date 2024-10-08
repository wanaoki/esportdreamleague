import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { FaTrophy, FaSadTear } from 'react-icons/fa';
import './BattleUI.css';

const BattleUI = ({ player, opponent, onBattle, onOpponentChange, battleResult, onEndBattle }) => {
  return (
    <div className="battle-ui">
      <h3>Battle Mode</h3>
      {!battleResult ? (
        <>
          <input 
            type="text" 
            placeholder="Opponent Public Key"
            value={opponent || ''}
            onChange={(e) => onOpponentChange(e.target.value)}
            className="opponent-input"
          />
          <button 
            className="main-button gradient-button" 
            onClick={() => onBattle(new PublicKey(opponent))}
            disabled={!opponent}
          >
            Battle
          </button>
        </>
      ) : (
        <div className="battle-result">
          {battleResult.isPlayerWinner ? (
            <div className="winner">
              <FaTrophy className="result-icon" />
              <p>Congratulations! You won the battle!</p>
            </div>
          ) : (
            <div className="loser">
              <FaSadTear className="result-icon" />
              <p>Better luck next time. You lost the battle.</p>
            </div>
          )}
          {battleResult.winner && (
            <p>Winner: {battleResult.winner.toString()}</p>
          )}
          <button className="main-button gradient-button" onClick={onEndBattle}>
            End Battle
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleUI;