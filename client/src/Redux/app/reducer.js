import {
    SET_LOADING
} from './actionTypes';

const initialState = {
    isLoading: false,
}

const reducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case SET_LOADING:
            return {
                ...state,
                isLoading: payload
            }
        default:
            return state
    }
}

export { reducer }