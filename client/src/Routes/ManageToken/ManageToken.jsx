import React, { useState , useEffect } from 'react'
import "./ManageToken.css";
import { Button } from 'antd';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const ManageToken = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [amount, setAmount] = useState(0);

    const {
        tokenContract,
        sscoreContract,
        isRegistered
    } = useSelector(state => state.app)

    const handlePurchase =  async () => {
        try {
            let tx = await tokenContract.buyTokens({value: amount})
            await tx.wait();
        } catch (error) {
            console.log(error);
        } finally {
            setAmount(0);
        }
    }

    const handleApprove =  async () => {
        try {
            let tx = await tokenContract.approve(sscoreContract.address, amount)
            await tx.wait();
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleImport =  async () => {
        try {
            let tx = await sscoreContract.loadAccount({value: 10})
            await tx.wait();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(isRegistered === false || isRegistered === null) {
            navigate('/');
        }
    }, [isRegistered]);

    return (
        <div className='dashboard_wrapper'>
            <div className='dashboard_sidepanel'>
                <div className='subpage_title' onClick={() => setCurrentPage(1)}>Buy Tokens</div>
                <div className='subpage_title' onClick={() => setCurrentPage(2)}>Import Tokens</div>
                <div className='subpage_title' onClick={() => setCurrentPage(3)}>Approve</div>
            </div>
            <div className='dashboard_content_area_wrapper'>
                {
                    currentPage === 1 &&
                    <div className='content_area'>
                        <p className='copy_text_info'>Your order amount</p>
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} className='amount_input'/>
                        <Button type="primary" onClick={() => handlePurchase()}>Buy</Button>
                    </div>
                }

                {
                    currentPage === 2 &&
                    <div className='content_area'>
                        <p className='copy_text_info'>Import your NFT tokens. Leverage them for voting and shaping community.</p>
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} className='amount_input'/>
                        <Button type="primary" onClick={() => handleImport()}>Import</Button>
                    </div>
                }

                {
                    currentPage === 3 &&
                    <div className='content_area'>
                        <p className='copy_text_info'>Authorize the transfer of your NFT to a different address by approving it.</p>
                        <Button type="primary" onClick={() => handleApprove()}>Approve</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export { ManageToken }