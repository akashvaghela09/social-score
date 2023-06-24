import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { metamask } from '../../Utils/metamaskChecker';
import { getUsers } from '../../firebase-configs';

const Dashboard = () => {

    const navigate = useNavigate();
    const [userId, setUserId] = useState(0);
    const [userAddress, setUserAddress] = useState('');
    const [socialScore, setSocialScore] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    const list = [
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
        {
            communityId: 1,
            communityName: "Community 1",
            eventId: 1,
            eventName: "Event 1",
        },
    ]

    const { sscoreContract, isRegistered } = useSelector(state => state.app);

    const fetchUserData = async () => {
        try {
            let walletObj = { "name": "MetaMask" }
            walletObj.accounts = await metamask.requestAccounts()
            let address = walletObj.accounts[0]

            let tx = await sscoreContract.users(address);

            let userId = tx[0].toNumber();
            let userAddress = tx[1];
            let socialScore = tx[2].toNumber();
            let totalBalance = tx[4].toNumber();

            setUserId(userId);
            setUserAddress(userAddress);
            setSocialScore(socialScore);
            setTotalBalance(totalBalance);
        } catch (error) {
            console.log(error);
        }
    }


    const test = async () => {
        console.log("test");
        let res = await getUsers();

        console.log(res);
    }

    useEffect(() => {
        if (isRegistered === false || isRegistered === null) {
            navigate('/');
        } else if (isRegistered === true) {
            fetchUserData();
        }
    }, [isRegistered]);

    return (
        <div className='dashboard_wrapper'>
            <div className='dashboard_sidepanel'>
                <div className='subpage_title' onClick={() => test()}>Profile</div>
                {/* <div className='subpage_title' onClick={() => setCurrentPage(2)}>Import Tokens</div> */}
                {/* <div className='subpage_title' onClick={() => setCurrentPage(3)}>Approve</div> */}
            </div>
            <div className='dashboard_content_area_wrapper'>
                <div className='content_area'>
                    <div className='info_section'>
                        <p>Wallet Address : {userAddress}</p>
                        <p>Token Balance : {totalBalance}</p>
                        <p>Social Score : {socialScore}</p>
                        <p>Total Badge Earned: 0</p>
                    </div>
                </div>
                <p className='section_divider'>Participation Badge</p>
                <div className='badge_section'>
                    {
                        list.map((item, index) => {
                            return (
                                <div className='badge_card'>
                                    <h3>{item.communityName}</h3>
                                    <p>#{item.communityId}</p>
                                    <h4>{item.eventName}</h4>
                                    <p>#{item.eventId}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export { Dashboard }