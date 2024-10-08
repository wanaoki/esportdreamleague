# Esport Dream League
# Solana Radar Hackathon 2024

Esport Dream League is a decentralized gaming platform built on the Solana blockchain. Players can mint their own NFT characters, engage in battles, and earn rewards through daily check-ins and victories.

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Solana Integration](#solana-integration)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Esport Dream League is built using:
- React
- Vite
- Solana Web3.js
- Anchor Framework

Players can:
- Connect their Solana wallet
- Mint a player NFT
- Engage in battles with other players
- Perform daily check-ins for rewards

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Solana wallet (e.g., Phantom, Solflare)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/esport-dream-league.git
   ```

2. Navigate to the project directory:
   ```
   cd esport-dream-league
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Project

To run the project in development mode:

```
npm run dev
```

This will start the development server, typically at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run serve`: Serves the production build locally
- `npm run lint`: Runs the linter to check for code style issues
- `npm run test`: Runs the test suite (if implemented)

## Project Structure

```
esport-dream-league/
├── src/
│   |
│   │   GameComponent.jsx
│   │   BattleUI.jsx
│   │   PlayerCard.jsx
│   │   LoadingSpinner.jsx
│   | 
│   │   programUtils.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── vite.config.js
├── package.json
└── README.md
```

## Solana Integration

This project uses the Solana blockchain for:
- Minting player NFTs
- Recording battle results
- Managing in-game currency and rewards

Make sure you have a Solana wallet extension installed in your browser (e.g., Phantom, Solflare) and are connected to the correct network (Devnet for testing, Mainnet for production).

## Contributing

Contributions to the Esport Dream League project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).