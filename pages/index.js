import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";

import L_Kermes from "../src/L_Kermes.jpg";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';


import { useRouter } from "next/router";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    SendTransactionError,
} from "@solana/web3.js";
import { useStorageUpload } from "@thirdweb-dev/react";

import axios from "axios";

const team = [
  {
    name: "L_Kermes",
    bio: "FooBar",
    image: L_Kermes,
  }
];

const SOLANA_NETWORK = "devnet";

const Home = () => {

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToRegistration = () => {
    router.push('/Sign_In'); // Reemplaza '/registration' con la ruta correcta de tu página de registro
    handleClose();
  };

    const [publicKey, setPublicKey] = useState(null);
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState(null);
    const [amount, setAmount] = useState(null);
    const [explorerLink, setExplorerLink] = useState(null);

    const [uploadUrl, setUploadUrl] = useState(null);
    const [url, setUrl] = useState(null);
    const [statusText, setStatusText] = useState("");

    useEffect(() => {
        let key = window.localStorage.getItem("publicKey"); //obtiene la publicKey del localStorage
        setPublicKey(key);
        if (key) getBalances(key);
        if (explorerLink) setExplorerLink(null);
        }, []);


        

        const handleReceiverChange = (event) => {
        setReceiver(event.target.value);
        };

        

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSubmit = async () => {
        console.log("Este es el receptor", receiver);
        console.log("Este es el monto", amount);
        sendTransaction();
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        console.log("Si se esta seteando la URL", url);
    };

    //Funcion para Iniciar sesion con nuestra Wallet de Phantom

    const signIn = async () => {
        //Si phantom no esta instalado
        const provider = window?.phantom?.solana;
        const { solana } = window;

        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error("Phantom no esta instalado");
            setTimeout(() => {
                window.open("https://phantom.app/", "_blank");
            }, 2000);
            return;
        }
        //Si phantom esta instalado
        let phantom;
        if (provider?.isPhantom) phantom = provider;

        const { publicKey } = await phantom.connect(); //conecta a phantom
        console.log("publicKey", publicKey.toString()); //muestra la publicKey
        setPublicKey(publicKey.toString()); //guarda la publicKey en el state
        window.localStorage.setItem("publicKey", publicKey.toString()); //guarda la publicKey en el localStorage

        toast.success("Tu Wallet esta conectada");

        getBalances(publicKey);
    };

    //Funcion para cerrar sesion con nuestra Wallet de Phantom

    const signOut = async () => {
        if (window) {
            const { solana } = window;
            window.localStorage.removeItem("publicKey");
            setPublicKey(null);
            solana.disconnect();
            router.reload(window?.location?.pathname);
        }
    };

    //Funcion para obtener el balance de nuestra wallet

    const getBalances = async (publicKey) => {
        try {
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            const balance = await connection.getBalance(
                new PublicKey(publicKey)
            );

            const balancenew = balance / LAMPORTS_PER_SOL;
            setBalance(balancenew);
        } catch (error) {
            console.error("ERROR GET BALANCE", error);
            toast.error("Something went wrong getting the balance");
        }
    };

    

    //Función para subir archivos a IPFS

    return (
         <div className="h-screen bg-black">
      <div className="flex flex-col w-auto h-auto bg-white">
        <div className="flex flex-col py-24 place-items-center justify-center">
        <div>
        
        <h1 className="text-5xl text-black font-bold pb-10">kermés</h1>
          </div>
          <h2 className="text-5xl text-black font-bold pb-10">_________________________________________________</h2>
          
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            Menu
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={navigateToRegistration} >Pay</MenuItem>
            <MenuItem onClick={handleClose}>Sell</MenuItem>
          </Menu>
          
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
      </div>
    </div>
  );
  
};
export default Home;

