import { 
    SET_LOADING,
    SET_ERROR, 
    SET_ALERT, 
    SET_CONTRACT_INSTANCE,
    SET_WALLET,
    SET_WALLET_MODAL,
    SET_IS_AUTH,
    SET_IS_REGISTERED,
    SET_SSTOKEN,
    SET_TOKEN_CONTRACT,
    SET_SSCORE_CONTRACT,
    SET_COMMUNITY_CONTRACT
} from './actionTypes';

const setLoading = (payload) => {
    return {
        type: SET_LOADING,
        payload
    }
}

const setError = (payload) => {
    return {
        type: SET_ERROR,
        payload
    }
}

const setAlert = (payload) => {
    return {
        type: SET_ALERT,
        payload
    }
}

const setContractInstance = (payload) => {
    return {
        type: SET_CONTRACT_INSTANCE,
        payload
    }
}

const setWallet = (payload) => {
    return {
        type: SET_WALLET,
        payload
    }
}

const setWalletModal = (payload) => {
    return {
        type: SET_WALLET_MODAL,
        payload
    }
}

const setIsAuth = (payload) => {
    return {
        type: SET_IS_AUTH,
        payload
    }
}

const setIsRegistered = (payload) => {
    return {
        type: SET_IS_REGISTERED,
        payload
    }
}

const setSSToken = (payload) => {
    return {
        type: SET_SSTOKEN,
        payload
    }
}

const setTokenContract = (payload) => {
    return {
        type: SET_TOKEN_CONTRACT,
        payload
    }
}

const setSscoreContract = (payload) => {
    return {
        type: SET_SSCORE_CONTRACT,
        payload
    }
}

const setCommunityContract = (payload) => {
    return {
        type: SET_COMMUNITY_CONTRACT,
        payload
    }
}


export { 
    setLoading,
    setError,
    setAlert,
    setContractInstance,
    setWallet,
    setWalletModal,
    setIsAuth,
    setIsRegistered,
    setSSToken,
    setTokenContract,
    setSscoreContract,
    setCommunityContract
}