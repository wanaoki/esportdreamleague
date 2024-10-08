import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { initializeGame, mintPlayer, battle, dailyCheckIn } from './programUtils';
import { QRCodeSVG } from 'qrcode.react';
import { QrReader } from 'react-qr-reader';
import { FaGamepad } from 'react-icons/fa';
import PlayerCard from './PlayerCard';
import BattleUI from './BattleUI';
import LoadingSpinner from './LoadingSpinner';
import './GameComponent.css';

function GameComponent() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPlayerQR, setShowPlayerQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [battleTransaction, setBattleTransaction] = useState(null);

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
    setIsLoading(true);
    try {
      const gameStatePublicKey = await initializeGame(anchorWallet, connection);
      console.log("Game State Initialized:", gameStatePublicKey.toString());
      setGameState(gameStatePublicKey);
    } catch (error) {
      console.error("Failed to initialize game state:", error);
      setError(`Failed to initialize game state: ${error.message}`);
    } finally {
      setIsInitializing(false);
      setIsLoading(false);
    }
  };

  const handleMintPlayer = async () => {
    if (!gameState || !anchorWallet || !connection) {
      console.log("Cannot mint player. Status:", { gameState: !!gameState, anchorWallet: !!anchorWallet, connection: !!connection });
      setError("Game state not initialized or wallet not connected");
      return;
    }
    setIsLoading(true);
    try {
      setError(null);
      const playerName = `Player ${Math.floor(Math.random() * 1000)}`;
      const playerPublicKey = await mintPlayer(playerName, gameState, anchorWallet, connection);
      setPlayer({ publicKey: playerPublicKey, name: playerName });
    } catch (error) {
      console.error("Failed to mint player:", error);
      setError(`Failed to mint player: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBattle = async (opponentPublicKey) => {
    if (!player || !opponentPublicKey || !anchorWallet || !connection) {
      setError("Player or opponent not set, or wallet not connected");
      return;
    }
    setIsLoading(true);
    try {
      setError(null);
      const transaction = await battle(player.publicKey, opponentPublicKey, anchorWallet, connection);
      setBattleTransaction(transaction);
    } catch (error) {
      console.error("Battle failed:", error);
      setError(`Battle failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBattle = async () => {
    if (!battleTransaction) return;
  
    try {
      setIsLoading(true);
      const signature = await sendTransaction(battleTransaction, connection);
      console.log("Battle transaction sent:", signature);
      // You might want to wait for confirmation here
      await connection.confirmTransaction(signature, 'processed');
      console.log("Battle transaction confirmed");
      
      // Set a more structured battle result
      setBattleResult({
        winner: Math.random() < 0.5 ? player.publicKey : opponent,
        isPlayerWinner: Math.random() < 0.5
      });
    } catch (error) {
      console.error("Error confirming battle:", error);
      setError(`Error confirming battle: ${error.message}`);
    } finally {
      setIsLoading(false);
      setBattleTransaction(null);
    }
  };

  const cancelBattle = () => {
    setBattleTransaction(null);
  };

  const handleDailyCheckIn = async () => {
    if (!player || !anchorWallet || !connection) {
      setError("Player not set or wallet not connected");
      return;
    }
    setIsLoading(true);
    try {
      setError(null);
      await dailyCheckIn(player.publicKey, anchorWallet, connection);
      console.log("Daily check-in completed");
    } catch (error) {
      console.error("Daily check-in failed:", error);
      setError(`Daily check-in failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = (result) => {
    if (result) {
      setOpponent(result?.text);
      setShowQRScanner(false);
    }
  };

  const handleEndBattle = () => {
    setBattleMode(false);
    setOpponent(null);
    setBattleResult(null);
  };

  return (
    <div className="game-container">
      <FaGamepad className="game-logo" />
      {isLoading && <LoadingSpinner />}
      {error && <div className="error-message">{error}</div>}
      {battleTransaction && (
        <div className="battle-confirmation">
          <h3>Confirm Battle</h3>
          <p>Are you sure you want to start this battle?</p>
          <button onClick={confirmBattle} className="main-button gradient-button">Confirm</button>
          <button onClick={cancelBattle} className="secondary-button">Cancel</button>
        </div>
      )}
      {!connected ? (
        <div className="message">Please connect your wallet to play.</div>
      ) : !publicKey ? (
        <div className="message">Waiting for wallet public key...</div>
      ) : !gameState ? (
        <button className="main-button gradient-button" onClick={initializeGameState} disabled={isInitializing}>
          Initialize Game State
        </button>
      ) : !player ? (
        <button className="main-button gradient-button" onClick={handleMintPlayer}>Mint Player NFT</button>
      ) : (
        <div className="player-dashboard">
          <PlayerCard player={player} />
          <div className="player-actions">
            <button className="main-button gradient-button" onClick={handleDailyCheckIn}>Daily Check-In</button>
            <button className="main-button gradient-button" onClick={() => setBattleMode(!battleMode)}>
              {battleMode ? 'Exit Battle Mode' : 'Enter Battle Mode'}
            </button>
          </div>
          {battleMode && (
            <BattleUI
              player={player}
              opponent={opponent}
              onBattle={handleBattle}
              onOpponentChange={setOpponent}
              battleResult={battleResult}
              onEndBattle={handleEndBattle}
            />
          )}
          <div className="qr-section">
            <button className="secondary-button gradient-button" onClick={() => setShowPlayerQR(!showPlayerQR)}>
              {showPlayerQR ? 'Hide QR' : 'Show QR'}
            </button>
            {showPlayerQR && (
              <div className="qr-code">
                <QRCodeSVG value={player.publicKey.toString()} size={128} />
              </div>
            )}
            <button className="secondary-button gradient-button" onClick={() => setShowQRScanner(!showQRScanner)}>
              {showQRScanner ? 'Hide Scanner' : 'Scan QR'}
            </button>
            {showQRScanner && (
              <div className="qr-scanner">
                <QrReader
                  onResult={handleQRScan}
                  constraints={{ facingMode: 'environment' }}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameComponent;