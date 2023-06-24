import React, { useEffect, useState } from 'react';
import "./AdminPage.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { metamask } from '../../Utils/metamaskChecker';
import { Button } from 'antd';

const AdminPage = () => {

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isAdmin, setIsAdmin] = useState(true);
    const { sscoreContract, communityContract, isRegistered } = useSelector(state => state.app);

    const list = [
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
        {
            address: "0x1234567890",
            eventId: 1,
            status: "Pending",
        },
    ]

    useEffect(() => {
        if (isRegistered === false || isRegistered === null) {
            navigate('/');
        } else if (isRegistered === true) {
            // fetchCommunityData();
        }
    }, [isRegistered]);

    return (
        <div className='dashboard_wrapper'>
            <div className='dashboard_sidepanel'>
                <div className='subpage_title' onClick={() => setCurrentPage(1)}>Applications</div>
                {/* <div className='subpage_title' onClick={() => setCurrentPage(2)}>Create Community</div> */}
            </div>
            <div className='dashboard_content_area_wrapper'>
                <div className='event_fetch_container'>
                    <input className='copy_text_info' />
                    <Button type="primary">Fetch</Button>
                </div>
                {
                    isAdmin === false &&
                    <div className='empty_event_container'>
                        <p>Not an Admin to perform this action</p>
                    </div>
                }
                {
                    isAdmin === true &&
                    <div className='event_list_wrapper'>
                        {
                            list.map((item, index) => {
                                return (
                                    <div className='event_card_item' key={index}>
                                        <div>
                                            <div className='event_card_item_text_large'>{item.address}</div>
                                            <div className='event_card_item_text_small'>#{item.eventId}</div>
                                            <div className='event_card_item_text_small'>{item.status}</div>
                                        </div>
                                        <div className='event_button_container'>
                                            <Button type="primary">Approve</Button>
                                            <Button type="primary">Reject</Button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export { AdminPage }