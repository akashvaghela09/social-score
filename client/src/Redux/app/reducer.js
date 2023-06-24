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

const initialState = {
    isLoading: false,
    isError: false,
    isAlert: { status: false, msg: "" },
    contract: {},
    wallet: {},
    walletModal: false,
    isAuth: false,
    isRegistered: true,
    ssToken: 0,
    tokenContract: {},
    sscoreContract: {},
    communityContract: {},
}

const reducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case SET_LOADING:
            return {
                ...state,
                isLoading: payload
            }
        case SET_ERROR:
            return {
                ...state,
                isError: payload
            }
        case SET_ALERT:
            return {
                ...state,
                isAlert: payload
            }
        case SET_CONTRACT_INSTANCE:
            return {
                ...state,
                contract: payload
            }
        case SET_WALLET:
            return {
                ...state,
                wallet: payload
            }
        case SET_WALLET_MODAL:
            return {
                ...state,
                walletModal: payload
            }
        case SET_IS_AUTH:
            return {
                ...state,
                isAuth: payload
            }
        case SET_IS_REGISTERED:
            return {
                ...state,
                isRegistered: payload
            }
        case SET_SSTOKEN:
            return {
                ...state,
                ssToken: payload
            }
        case SET_TOKEN_CONTRACT:
            return {
                ...state,
                tokenContract: payload
            }
        case SET_SSCORE_CONTRACT:
            return {
                ...state,
                sscoreContract: payload
            }
        default:
            return state
    }
}

export { reducer }