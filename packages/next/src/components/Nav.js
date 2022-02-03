import React, { useEffect, useState } from "react";
import axios from "axios";

const chainId = "osmosis-1";
const CONNECT_WALLET = "Connect Wallet";
const CONNECTED = "Connected: ";

const Nav = ({accounts, setAccounts}) => {
  const [buttonText, setButtonText] = useState(CONNECT_WALLET);

  useEffect(() => {
    if (accounts.length > 0) {
      setButtonText(CONNECTED + `${accounts[0].address.slice(0, 12)}`);
    } else {
      setButtonText(CONNECT_WALLET);
    }
  }, [accounts]);

  const getKeplr = () => {
    if (typeof window === 'undefined') {
      return {};
    } else {
      return window['keplr']
    }
  }
  const handleClick = async () => {
    if (typeof window === 'undefined') {
      return;
    } else {

    }
    if (!getKeplr()) {
      alert("Please install keplr extension");
    } else {
      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether to allow access if they haven't visited this website.
      // Also, it will request that the user unlock the wallet if the wallet is locked.
      try {
        await getKeplr().enable(chainId);
      } catch {
        alert("Please add Omsosis Chain to your wallet");
        return;
      }

      const offlineSigner = getKeplr().getOfflineSigner(chainId);

      // You can get the address/public keys by `getAccounts` method.
      // It can return the array of address/public key.
      // But, currently, Keplr extension manages only one address/public key pair.
      // XXX: This line is needed to set the sender address for SigningCosmosClient.
      const accounts = await offlineSigner.getAccounts();

      setAccounts(accounts);
    }
  };

  return (
    <div className='pool-adder__table__body'>
      <button className='secondary-button' style={{ height: 38, color: '#0089FF', width: '100%', borderRadius: 0 }} onClick={handleClick}>{buttonText}</button>
    </div>
  );
};

export default Nav;
