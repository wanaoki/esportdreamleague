import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FaTrophy, FaUserCircle, FaStore, FaCog } from 'react-icons/fa';
import { GiCrossedSwords } from 'react-icons/gi';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <GiCrossedSwords className="logo-icon" />
        <span>Esports Dream League</span>
      </div>
      <div className="navbar-menu">
        <a href="#home" className="navbar-item">
          <FaTrophy /> Leaderboard
        </a>
        <a href="#profile" className="navbar-item">
          <FaUserCircle /> Profile
        </a>
        <a href="#marketplace" className="navbar-item">
          <FaStore /> Marketplace
        </a>
        <a href="#settings" className="navbar-item">
          <FaCog /> Settings
        </a>
      </div>
      <WalletMultiButton className="wallet-button" />
    </nav>
  );
};

export default Navbar;