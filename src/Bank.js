import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import { useState, useEffect, useRef } from 'react';
import bankManifest from "./contracts/Bank.json";

function Bank() {
  const bank = useRef(null);

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await configureBlockchain();
  }

  let configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const networkId = await provider.request({ method: 'net_version' })

        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();

        bank.current = new Contract(
          bankManifest.networks[networkId].address,
          bankManifest.abi,
          signer
        );

      }
    } catch (error) { }
  }

  let onSubmitDeposit = async (e) => {
    e.preventDefault();

    const BNBamount = parseFloat(e.target.elements[0].value);

    // Wei to BNB se pasa con ethers.utils recibe un String!!!
    const tx = await bank.current.deposit({
        value: ethers.utils.parseEther(String(BNBamount)),
        gasLimit: 6721975,
        gasPrice: 20000000000,
    });

    await tx.wait();
  }

  let clickWithdraw = async (e) => {
    try{
      await bank.current.withdraw();
    } catch ( error){
      console.log(error)
    }
  }


  return (
    <div>
      <h1>Bank</h1>
      <form onSubmit= { (e) => onSubmitDeposit(e) } >
                <input type="number" step="0.01" />
                <button type="submit">Deposit</button>
       </form>
       <button onClick= { () => clickWithdraw() } > Withdraw </button>
    </div>
  )
}

export default Bank;