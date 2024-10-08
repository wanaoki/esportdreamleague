import React from 'react';
import './PlayerCard.css';


const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <img src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${player.name}`} alt="Player Avatar" />
      <h3>{player.name}</h3>
      <p>Public Key: {player.publicKey.toString().slice(0, 8)}...</p>
    </div>
  );
};

export default PlayerCard;