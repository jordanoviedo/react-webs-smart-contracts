import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import piedraManifest from "./contracts/Piedra";
import { useState, useEffect, useRef } from 'react';

function Piedra() {
  const piedra = useRef(null);
  const [opcion1, setOpcion1] = useState(0);
  const [opcion2, setOpcion2] = useState(0);
  const pictures = ["nada.png","piedra.png","papel.png","tijera.png"]

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await configureBlockchain();

    let opcionJugador1 = await piedra.current?.getOpcionJugador1();
    setOpcion1(opcionJugador1)
    let opcionJugador2 = await piedra.current?.getOpcionJugador2();
    setOpcion2(opcionJugador2)
  }

  let configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const networkId = await provider.request({ method: 'net_version' })

        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();

        piedra.current = new Contract(
          piedraManifest.networks[networkId].address,
          piedraManifest.abi,
          signer
        );

      }
    } catch (error) { }
  }

  let jugar = async (opcion) => {
   
    try{
    const tx = await piedra.current.jugar(opcion, {
      value: ethers.utils.parseEther("0.02")
    });

    await tx.wait();
  } catch ( error ){
    console.log(error)
  }
    
    let opcionJugador1 = await piedra.current?.getOpcionJugador1();
    setOpcion1(opcionJugador1)
    let opcionJugador2 = await piedra.current?.getOpcionJugador2();
    setOpcion2(opcionJugador2)
  }

  return (
    <div>
      <h1>Piedra - Papel - Tijera</h1>

      <button onClick={() => { jugar(1) }} > Piedra </button>

      <button onClick={() => { jugar(2) }} > Papel </button>

      <button onClick={() => { jugar(3) }} > Tijera </button>

      <h2>Jugador1: <img src={ pictures[opcion1] }/>  </h2>
      <h2>Jugador2: <img src={ pictures[opcion2] }/> </h2>
    </div>
  )

}
export default Piedra;
