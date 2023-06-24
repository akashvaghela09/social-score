import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import { setAlert, setCommunityContract, setIsAuth, setIsRegistered, setLoading, setSscoreContract, setTokenContract, setWallet, setWalletModal } from "../../Redux/app/actions"
import { ethers } from "ethers";
import SSTokenData from "../../artifacts/contracts/SSToken.sol/SSToken.json";
import SocialScoreData from "../../artifacts/contracts/SocialScore.sol/SocialScore.json";
import CommunityData from "../../artifacts/contracts/Community.sol/Community.json";
import { metamask, metaMaskChecker } from '../../Utils/metamaskChecker';
import { Button } from 'antd';
import "./Wallet.css";

const Wallet = () => {
    const dispatch = useDispatch();

    const [profileModal, setProfileModal] = useState(false);
    const [userWalletLoading, setUserWalletLoading] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)

    const tokenABI = SSTokenData.abi;
    const sscoreABI = SocialScoreData.abi;
    const CommunityABI = CommunityData.abi;

    const {
        REACT_APP_TOKEN_ADDRESS,
        REACT_APP_SOCIALSCORE_ADDRESS,
        REACT_APP_COMMUNITY_ADDRESS,
        REACT_APP_BADGE_ADDRESS
    } = process.env;

    const {
        isAuth,
        wallet,
        walletModal
    } = useSelector(state => state.app)

    const checkAuthStatus = () => {
        if (isAuth === true) {
            setProfileModal(!profileModal)
        } else {
            dispatch(setWalletModal(true))
        }
    }

    const handleWalletUser = async () => {
        setUserWalletLoading(true);
        setTimeout(async () => {
            setUserWalletLoading(false);
            let response = await metaMaskChecker();
            console.log(response);
            if (response.available === true) {
                connectWallet()
            } else {
                dispatch(setWalletModal(false))
                dispatch(setAlert(response.obj))
            }
        }, 1500);
    }

    const connectWallet = async () => {
        console.log("connecting wallet...");
        dispatch(setWalletModal(false))
        dispatch(setLoading(true));

        let walletObj = { "name": "MetaMask" }
        walletObj.accounts = await metamask.requestAccounts()
        walletObj.balance = await metamask.getBalance()
        walletObj.network = await metamask.chainId()
        walletObj.isConnected = await metamask.isConnected()
        dispatch(setWallet(walletObj));
        dispatch(setIsAuth(true))

        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
        let mySigner = ethersProvider.getSigner();

        let sscoreContractInstance = new ethers.Contract(
            REACT_APP_SOCIALSCORE_ADDRESS,
            sscoreABI,
            mySigner
        );

        let ssTokenContractInstance = new ethers.Contract(
            REACT_APP_TOKEN_ADDRESS,
            tokenABI,
            mySigner
        );

        let communityContractInstance = new ethers.Contract(
            REACT_APP_COMMUNITY_ADDRESS,
            CommunityABI,
            mySigner
        );


        let userRes = await sscoreContractInstance.users(walletObj.accounts[0]);

        console.log(userRes.walletAddress);
        if(userRes.walletAddress == "0x0000000000000000000000000000000000000000"){
            console.log("user not registered");
            dispatch(setIsRegistered(false))
        } else {
            console.log("user registered");
            dispatch(setIsRegistered(true))
        }

        dispatch(setTokenContract(ssTokenContractInstance));
        dispatch(setCommunityContract(communityContractInstance));
        dispatch(setSscoreContract(sscoreContractInstance));

        dispatch(setLoading(false));
    }

    const handleLogOut = () => {
        setLogoutLoading(true);
        setTimeout(() => {
            setLogoutLoading(false);
            setProfileModal(!profileModal)
            dispatch(setIsAuth(false))
            dispatch(setWalletModal(false))
            dispatch(setWallet({}))
        }, 1500);
    }

    const networkObj = {
        "0x1": "MainNet",
        "0x3": "Ropsten",
        "0x4": "Rinkeby",
        "0x42": "Kovan",
        "0xaa36a7": "Sepolia"
    }

    const concatString = (para = "") => {
        let adr = para.split("")
        let start = adr.slice(0, 4).join("")
        let end = adr.slice(-4).join("")
        let string = `${start}...${end}`
        return string;
    }

    return (
        <div className="wallet_wrapper">
            {
                isAuth === false && <Button className='wallet_button' type="primary" onClick={() => handleWalletUser()}>Connect Wallet</Button>
            }

            {
                isAuth === true && <Button className='wallet_button' type="primary" onClick={() => checkAuthStatus()}>Connected</Button>
            }


            {
                profileModal === true &&
                <div className='wallet_modal' onClick={() => setProfileModal(false)} />
            }

            {
                profileModal === true &&
                <div className='wallet_modal_sidebar' onClick={() => setProfileModal(false)}>
                    <div className='sidebar_balance_wrapper'>
                        <p className='wallet_modal_sidebar_text'><b>ETH :</b> {concatString(wallet.accounts[0])}</p>
                        <p className="wallet_modal_sidebar_text"><b>Balance :</b> {concatString(wallet.balance)}</p>
                        <p className="wallet_modal_sidebar_text"><b>SSToken :</b> 1000</p>
                    </div>

                    {
                        logoutLoading === false &&
                        <Button type="primary" className="logout_button" onClick={() => handleLogOut()}> Log Out <FiLogOut className='' /></Button>
                    }
                </div>
            }
        </div>
    )
}

export { Wallet }