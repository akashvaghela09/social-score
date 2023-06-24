import React, { useEffect, useState } from 'react';
import "./Community.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { metamask } from '../../Utils/metamaskChecker';
import { Button } from 'antd';

const Community = () => {

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [externalUrl, setExternalUrl] = useState("");

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

    const { sscoreContract,  communityContract, isRegistered } = useSelector(state => state.app);

    const fetchCommunityData = async () => {

    }

    const createNewCommunity = async () => {
        try {
            let tx = await communityContract.createCommunity(name, description, externalUrl);
            tx.wait();
            console.log(tx);

        } catch (error) {
            console.log(error);
        }

        setName("");
        setDescription("");
        setExternalUrl("");
    }

    useEffect(() => {
        if (isRegistered === false || isRegistered === null) {
            navigate('/');
        } else if (isRegistered === true) {
            fetchCommunityData();
        }
    }, [isRegistered]);

    return (
        <div className='dashboard_wrapper'>
            <div className='dashboard_sidepanel'>
                <div className='subpage_title' onClick={() => setCurrentPage(1)}>My Communities</div>
                <div className='subpage_title' onClick={() => setCurrentPage(2)}>Create Community</div>
            </div>
            <div className='dashboard_content_area_wrapper'>
                {
                    currentPage === 1 &&
                    <div className='community_data_wrapper'>
                            {
                            list.map((item, index) => {
                                return (
                                    <div className='community_card' key={index}>
                                        <div className='community_card_item_text_large'>{item.communityName}</div>
                                        <div className='community_card_item_text_small'>#{item.communityId}</div>
                                    </div>
                                )
                            })}
                    </div>
                }

                {
                    currentPage === 2 &&
                    <div className='community_data_wrapper2'>
                        <p className='copy_text_info'>Name</p>
                        <input value={name} onChange={(e) => setName(e.target.value)} className='create_community_input_field'/>
                        <p className='copy_text_info'>Description</p>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} className='create_community_input_field'/>
                        <p className='copy_text_info'>External URL</p>
                        <input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className='create_community_input_field'/>
                        <Button type='primary' className='create_community_button' onClick={() => createNewCommunity()}>Create community</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export { Community }