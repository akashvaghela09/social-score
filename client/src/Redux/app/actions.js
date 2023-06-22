import { 
    SET_LOADING,
} from './actionTypes';

const setLoading = (payload) => {
    return {
        type: SET_LOADING,
        payload
    }
}

export { 
    setLoading
}