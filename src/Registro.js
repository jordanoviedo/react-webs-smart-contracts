import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import registroManifest from "./contracts/Registro.json";
import { useState, useEffect, useRef } from 'react';

function Registro() {
  const registro = useRef(null);
  const [peticiones, setPeticiones] = useState([]);
  const [textoNuevaPeticion, setTextoNuevaPeticion] = useState("");

  const [peticioneAProcesar, setPeticioneAProcesar] = useState("");

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await configureBlockchain();
    let peticionesFromBlockchain = await registro.current?.getAllPeticiones();
    if (peticionesFromBlockchain != null)
    setPeticiones(peticionesFromBlockchain)
  }

  let configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const networkId = await provider.request({ method: 'net_version' })

        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();

        registro.current = new Contract(
          registroManifest.networks[networkId].address,
          registroManifest.abi,
          signer
        );

      }
    } catch (error) { }
  }

  let onChangeInput = (e) =>{
    setTextoNuevaPeticion(e.target.value);
  }

  let registrarPeticion = async () => {
    try{
      const tx = await registro.current.registrarPeticion(textoNuevaPeticion);
      await tx.wait();
    } catch (error) {}

    let peticionesFromBlockchain = await registro.current?.getAllPeticiones();
    if (peticionesFromBlockchain != null)
    setPeticiones(peticionesFromBlockchain)
  }

  let obtenerPeticionActual = async () => {
    try{
      let p = await registro.current.verPeticionActual();
      setPeticioneAProcesar(p)
    } catch (error) {
      setPeticioneAProcesar("No hay más peticiones")
    }
  }

  let responderAPeticion = async (valorRespuesta) => {
    try{
      const tx = await registro.current.contestarPeticionActual(valorRespuesta);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }

    let peticionesFromBlockchain = await registro.current?.getAllPeticiones();
    if (peticionesFromBlockchain != null)
    setPeticiones(peticionesFromBlockchain)
  }

  return (
    <div>
      <h1>Todas las peticiones</h1>
      <ul>
        {peticiones.map((texto, i) =>
          <li> {texto} </li>
        )}
      </ul>
      <h1>Agregar Petición</h1>
      <ul>
        <input type="text" onChange={onChangeInput}/>
        <button onClick={registrarPeticion}> Registrar Peticion</button>
      </ul>
      <h1>Procesar peticiones</h1>
      <ul>
        <button onClick={obtenerPeticionActual}> Ver petición actual </button>
        <p> { peticioneAProcesar } </p>
        <button onClick={() => responderAPeticion(1)}> No </button>
        <button onClick={() => responderAPeticion(2)}> Sí </button>
      </ul>
    </div>
  )

}
export default Registro;
