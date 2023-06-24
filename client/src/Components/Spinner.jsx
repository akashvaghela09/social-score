import React, { useState } from 'react';
// import { ImSpinner2 , ImSpinner8 } from 'react-icons/im';
import { CgSpinner } from 'react-icons/cg';

const Spinner = () => {
    const [status, setStatus] = useState(false);

    return (
        <div>
            <div className='' onClick={() => setStatus(!status)} ></div>
                <div className=''>
                    {/* <ImSpinner2 className='fill-slate-200 text-6xl animate-spin'/> */}
                    {/* <ImSpinner8 className='fill-slate-200 text-6xl animate-spin'/> */}
                    <CgSpinner className=''/>
                </div>
        </div>
    )
}

export { Spinner }