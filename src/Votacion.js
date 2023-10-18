import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import { useState, useEffect, useRef } from 'react';
import sistemaVotacionManifest from "./contracts/SistemaVotacion.json";

function Votacion() {
  const sistemVotacion = useRef(null);
  const [votosOpcion1, setVotosOpcion1] = useState(0);
  const [votosOpcion2, setVotosOpcion2] = useState(0);

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await configureBlockchain();

    const votosOpcion1 = await sistemVotacion.current.getVotosOpcion1();
    setVotosOpcion1(votosOpcion1);

    const votosOpcion2 = await sistemVotacion.current.getVotosOpcion2();
    setVotosOpcion2(votosOpcion2);
  }

  let configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const networkId = await provider.request({ method: 'net_version' })

        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();

        sistemVotacion.current = new Contract(
          sistemaVotacionManifest.networks[networkId].address,
          sistemaVotacionManifest.abi,
          signer
        );

      }
    } catch (error) { }
  }

  let vota = async (opcion) => {
    const tx = await sistemVotacion.current.vota(opcion);
    await tx.wait();

    const votosOpcion1 = await sistemVotacion.current.getVotosOpcion1();
    setVotosOpcion1(votosOpcion1);

    const votosOpcion2 = await sistemVotacion.current.getVotosOpcion2();
    setVotosOpcion2(votosOpcion2);
  }

  let clickDameTokens = async (e) => {
    try{
      await sistemVotacion.current.dameTokens();

    } catch ( error){
      console.log(error)
    }
  }


  return (
    <div> 
      <h1>Votacion</h1>
      <h2>Votos opción 1: { ethers.BigNumber.from(votosOpcion1).toNumber() } 
        <button onClick= { () => { vota(1) } }> Vota1 </button>
      </h2> 
      

      <h2>Votos opción 2: { ethers.BigNumber.from(votosOpcion2).toNumber() }  
        <button onClick= { () => { vota(2) } } > Vota2 </button>
      </h2> 
      

      <button onClick= { clickDameTokens } > Dame Tokens </button>
    </div>
  )
}

export default Votacion;