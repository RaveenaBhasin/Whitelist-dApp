// import Head from "next/head";
// import styles from "../styles/Home.module.css";
// import Web3Modal from "web3modal";
// import { providers, Contract } from "ethers";
// import { useEffect, useRef, useState } from "react";
// import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

// export default function Home() {
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [joinedWhitelist, setJoinedWhitelist] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [numberofWhiteListed, setNumberofWhiteListed] = useState(0);
//   const web3ModalRef = useRef();

//   const getProviderOrSigner = async (needSigner = false) => {
//     const provider = await web3ModalRef.current.connect();
//     const web3Provider = new providers.Web3Provider(provider);

//     const { chainId } = await web3Provider.getNetwork();
//     if(chainId !== 4){
//       window.alert("Change the network to Rinkeby");
//       throw new Error("Change the network to Rinkeby");
//     }

//     if(needSigner) {
//       const signer = web3Provider.getSigner();
//       return signer;
//     }

//     return web3Provider;
//   }

//   const addAddressToWhitelist = async () => {
//     try{
//       const signer = await getProviderOrSigner(true);
//       const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
//       const tx = await whitelistContract.addAddressToWhitelist();
//       setLoading(true);
//       await tx.wait();
//       setLoading(false);
//       await getNumberOfWhiteListed();
//       setJoinedWhitelist(true);
//     }
//     catch(err){
//       console.error(err);
//     }
//   }

//   const checkIfJoinedWhitelist = async () => {
//     try{
//       const signer = getProviderOrSigner(true);
//       const whitelistContract = new Contract (WHITELIST_CONTRACT_ADDRESS, abi, signer);
//       const address = await signer.getAddress();
//       const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
//       setJoinedWhitelist(_joinedWhitelist);
//     }
//     catch(err) {
//       console.error(err);
//     }
//   }

//   const getNumberOfWhiteListed = async () => {
//     try{
//       const provider = await getProviderOrSigner();
//       const whitelistContract = new Contract (WHITELIST_CONTRACT_ADDRESS, abi, provider);
//       const _numberOfWhiteListed = await whitelistContract.numAddressesWhitelisted();
//       setNumberofWhiteListed(_numberOfWhiteListed);
//     }
//     catch(err){
//       console.error(err);
//     }
//   }

//   const connectWallet = async() => {
//     try {
//       await getProviderOrSigner();
//       setWalletConnected(true);
//       checkIfJoinedWhitelist();
//       getNumberOfWhiteListed();
//     } catch(err) {
//       console.log(err);
//     }
//   }

//   const renderButton = () => {
//     if(walletConnected) {
//       if(joinedWhitelist) {
//         return (
//           <div className={styles.description}>
//             Thank you for joining the whitelist!
//           </div>
//         );
//       }
//       else if(loading) {
//         return <button className={styles.button}>Loading....</button>;
//       }
//       else {
//         <button onClick={addAddressToWhitelist} className={styles.button}>
//           Join Whitelist
//         </button>
//       }
//     }
//     else{
//       return (
//         <button onClick={connectWallet} className={styles.button}>
//           Connect Wallet
//         </button>
//       );
//     }
//   };

//   useEffect(() => {
//     if(!walletConnected) {
//       web3ModalRef.current = new Web3Modal({
//         network: "rinkeby",
//         providerOptions: {},
//         disableInjectedProvider: false,
//       });
//       connectWallet();
//     }
//   }, [walletConnected]);

//   return(
//     <div>
//       <Head>
//         <title>Whitelist dApp</title>
//         <meta name="description" content="Whitelist-Dapp" />
//       </Head>
//       <div className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to Crypto Devs
//         </h1>
//         <div className={styles.description}>
//           {numberofWhiteListed} have already joined the whitelist
//         </div>
//         {renderButton()}
//         <div>
//           <img className={styles.image} src="./crypto-devs.svg"/>
//         </div>
//       </div>
//       <footer className={styles.footer}>
//         Made with &#10084; by Crypto Devs
//       </footer>
//     </div>
//   )
// }
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // reference to the Web3 Modal for connecting to Metamask
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Get access to object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    // Not connected to Rinkeby 
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from metamask (signer not required)
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal to connect the wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}