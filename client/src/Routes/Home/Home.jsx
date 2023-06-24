import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setIsRegistered } from "../../Redux/app/actions"
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { metamask } from '../../Utils/metamaskChecker';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        contract,
        isRegistered,
        sscoreContract,
        wallet,
    } = useSelector(state => state.app)


    // const handleSubmit = async () => {
    //     dispatch(setLoading(true))
    //     let tx = await contract.setName(nameString)
    //     await tx.wait();
    //     dispatch(setLoading(false))
    //     getName()
    //     setNameString("")
    // }

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             let tempName = await contract.getName()
    //             setName(tempName)
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     })()
    // }, [contract]);

    const handleRegistration = async () => {
        try {
            dispatch(setLoading(true))
            let tx = await sscoreContract.register()
            await tx.wait();

            let walletObj = { "name": "MetaMask" }
            walletObj.accounts = await metamask.requestAccounts()

            let userRes = await sscoreContract.users(walletObj.accounts[0]);

            if (userRes.walletAddress == "0x0000000000000000000000000000000000000000") {
                console.log("user not registered");
                dispatch(setIsRegistered(false))
            } else {
                console.log("user registered");
                dispatch(setIsRegistered(true))
            }

            dispatch(setLoading(false))
        } catch (error) {
            console.log("error: failed in registration ", error);
        }
    }

    useEffect(() => {
        console.log("isRegistered", isRegistered);
        if (isRegistered === true) {
            navigate("/dashboard");
        }
    }, [isRegistered]);


    return (
        <div className='home_wrapper'>
            <div className='home_title_container'>
                <p className='home_title_text_large'>Social</p>
                <p className='home_title_text_large'>Score</p>
                <p className='home_subtitle_text'>your proof of work</p>
            </div>
            <div className='home_copy_container'>
                <p className='copy_text'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos itaque laboriosam quas asperiores voluptate quasi ab, laudantium sunt illo repellat est error libero, ipsam quos iste. Sint rem suscipit doloribus mollitia neque. Quam, reprehenderit dolore corporis est ducimus temporibus? Debitis rerum quod harum id placeat cum suscipit dolorem dolor minus!</p>
                <div className='register_join_button' onClick={() => handleRegistration()}>Join Social Score</div>
            </div>
        </div>
    )
}

export { Home }