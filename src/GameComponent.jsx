import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { initializeGame, mintPlayer, battle, dailyCheckIn } from './programUtils';

function GameComponent() {
  const { publicKey, connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (connected && anchorWallet && connection && publicKey) {
      console.log("Wallet connected:", publicKey.toString());
    }
  }, [connected, anchorWallet, connection, publicKey]);

  const initializeGameState = async () => {
    if (isInitializing || !connected || !anchorWallet || !connection || !publicKey) {
      console.log("Cannot initialize. Wallet status:", { connected, anchorWallet: !!anchorWallet, connection: !!connection, publicKey: publicKey?.toString() });
      return;
    }
    setIsInitializing(true);
    setError(null);
    try {
      const gameStatePublicKey = await initializeGame(anchorWallet, connection);
      console.log("Game State Initialized:", gameStatePublicKey.toString());
      setGameState(gameStatePublicKey);
    } catch (error) {
      console.error("Failed to initialize game state:", error);
      setError(`Failed to initialize game state: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleMintPlayer = async () => {
    if (!gameState || !anchorWallet || !connection) {
      console.log("Cannot mint player. Status:", { gameState: !!gameState, anchorWallet: !!anchorWallet, connection: !!connection });
      setError("Game state not initialized or wallet not connected");
      return;
    }
    try {
      setError(null);
      const playerName = `Player ${Math.floor(Math.random() * 1000)}`;
      const playerPublicKey = await mintPlayer(playerName, gameState, anchorWallet, connection);
      setPlayer({ publicKey: playerPublicKey, name: playerName });
    } catch (error) {
      console.error("Failed to mint player:", error);
      setError(`Failed to mint player: ${error.message}`);
    }
  };

  const handleBattle = async () => {
    if (!player || !opponent || !anchorWallet || !connection) {
      setError("Player or opponent not set, or wallet not connected");
      return;
    }
    try {
      setError(null);
      await battle(player.publicKey, new PublicKey(opponent), anchorWallet, connection);
      console.log("Battle completed");
    } catch (error) {
      console.error("Battle failed:", error);
      setError(`Battle failed: ${error.message}`);
    }
  };

  const handleDailyCheckIn = async () => {
    if (!player || !anchorWallet || !connection) {
      setError("Player not set or wallet not connected");
      return;
    }
    try {
      setError(null);
      await dailyCheckIn(player.publicKey, anchorWallet, connection);
      console.log("Daily check-in completed");
    } catch (error) {
      console.error("Daily check-in failed:", error);
      setError(`Daily check-in failed: ${error.message}`);
    }
  };

  return (
    <div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {!connected ? (
        <div>Please connect your wallet to play.</div>
      ) : !publicKey ? (
        <div>Waiting for wallet public key...</div>
      ) : !gameState ? (
        <button onClick={initializeGameState} disabled={isInitializing}>
          Initialize Game State
        </button>
      ) : !player ? (
        <button onClick={handleMintPlayer}>Mint Player NFT</button>
      ) : (
        <div>
          <h2>Welcome, {player.name}!</h2>
          <p>Player Public Key: {player.publicKey.toString()}</p>
          <button onClick={handleDailyCheckIn}>Daily Check-In</button>
          <input 
            type="text" 
            placeholder="Opponent Public Key"
            onChange={(e) => setOpponent(e.target.value)}
          />
          <button onClick={handleBattle}>Battle</button>
        </div>
      )}
    </div>
  );
}

export default GameComponent;