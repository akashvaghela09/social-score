import React from 'react';
import { Wallet } from '../Wallet/Wallet';
import { useNavigate } from 'react-router';
import './Header.css';

const Header = () => {

    let navigate = useNavigate();

    const handleRoute = (para) => {
        navigate(`/${para}`)
    }

    return (
        <div className='header_wrapper'>
            <p className='page_title'>Social Score</p>
            <div className='page_tag_container'>
                <p className='page_tag' onClick={()=> handleRoute("dashboard")}>My Profile</p>
                <p className='page_tag' onClick={()=> handleRoute("community")}>Community</p>
                <p className='page_tag' onClick={()=> handleRoute("events")}>Events</p>
                <p className='page_tag' onClick={()=> handleRoute("admin")}>Admin Area</p>
                <p className='page_tag' onClick={()=> handleRoute("manage-token")}>Manage Token</p>
            </div>
            <Wallet />
        </div>
    )
}

export { Header }