import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../Redux/app/actions"

const Home = () => {
    // const dispatch = useDispatch();

    const {
        isLoading
    } = useSelector(state => state.app)

    return (
        <div className='h-full flex justify-center items-center flex-col'>
            <h1>Home</h1>
        </div>
    )
}

export { Home }