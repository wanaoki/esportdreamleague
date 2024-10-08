import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

const programID = new PublicKey('FAmj5kvAaDgTdS1nzknYDDkS3hCYvAS2EJVNtHKfNqg6');
const opts = {
  preflightCommitment: "processed"
}

const IDL = {
  "version": "0.1.0",
  "name": "esports_league",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "gameState",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "mintPlayer",
      "accounts": [
        {
          "name": "gameState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerName",
          "type": "string"
        }
      ]
    },
    {
      "name": "battle",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "opponent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "opponent",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "dailyCheckIn",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "GameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "battlesWon",
            "type": "u64"
          },
          {
            "name": "battlesLost",
            "type": "u64"
          },
          {
            "name": "dailyCheckIn",
            "type": "i64"
          },
          {
            "name": "xp",
            "type": "u64"
          },
          {
            "name": "power",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CheckInTooEarly",
      "msg": "You can only check in once every 24 hours"
    }
  ]
};

export const getProvider = (wallet, connection) => {
  if (!wallet || !connection) {
    throw new Error("Wallet or connection not provided");
  }
  const provider = new AnchorProvider(
    connection, 
    wallet, 
    opts
  );
  return provider;
}

export const getProgram = (wallet, connection) => {
  try {
    const provider = getProvider(wallet, connection);
    console.log("Provider:", provider);
    
    if (!provider.wallet?.publicKey) {
      throw new Error("Wallet not connected");
    }

    const program = new Program(IDL, programID, provider);
    console.log("Program:", program);
    return program;
  } catch (error) {
    console.error("Error in getProgram:", error);
    throw error;
  }
}

export const initializeGame = async (wallet, connection) => {
  try {
    const program = getProgram(wallet, connection);
    const gameState = web3.Keypair.generate();
    console.log("Game State Public Key:", gameState.publicKey.toString());

    const walletPublicKey = program.provider.wallet.publicKey;
    if (!walletPublicKey) {
      throw new Error("Wallet not connected");
    }
    console.log("Wallet Public Key:", walletPublicKey.toString());

    const tx = await program.methods.initialize()
      .accounts({
        gameState: gameState.publicKey,
        authority: walletPublicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([gameState])
      .rpc();
    console.log("Transaction signature:", tx);
    return gameState.publicKey;
  } catch (error) {
    console.error("Error in initializeGame:", error);
    throw error;
  }
}

export const mintPlayer = async (playerName, gameStatePublicKey, wallet, connection) => {
  try {
    const program = getProgram(wallet, connection);
    const player = web3.Keypair.generate();
    const tx = await program.methods.mintPlayer(playerName)
      .accounts({
        gameState: gameStatePublicKey,
        player: player.publicKey,
        user: program.provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([player])
      .rpc();
    console.log("Mint player transaction signature:", tx);
    return player.publicKey;
  } catch (error) {
    console.error("Error in mintPlayer:", error);
    throw error;
  }
}

export const battle = async (playerPublicKey, opponentPublicKey, wallet, connection) => {
  try {
    const program = getProgram(wallet, connection);
    const tx = await program.methods.battle(opponentPublicKey)
      .accounts({
        player: playerPublicKey,
        opponent: opponentPublicKey,
      })
      .rpc();
    console.log("Battle transaction signature:", tx);
  } catch (error) {
    console.error("Error in battle:", error);
    throw error;
  }
}

export const dailyCheckIn = async (playerPublicKey, wallet, connection) => {
  try {
    const program = getProgram(wallet, connection);
    const tx = await program.methods.dailyCheckIn()
      .accounts({
        player: playerPublicKey,
      })
      .rpc();
    console.log("Daily check-in transaction signature:", tx);
  } catch (error) {
    console.error("Error in dailyCheckIn:", error);
    throw error;
  }
}