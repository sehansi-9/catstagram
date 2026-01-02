import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            return action.payload;
        },
        logout: (state) => {
            return null;
        },
        updatePic: (state, action) => {
            return {
                ...state,
                pic: action.payload
            };
        },
        updateBio: (state, action) => {
            return {
                ...state,
                bio: action.payload
            };
        },
        updateName: (state, action) => {
            return {
                ...state,
                name: action.payload
            };
        },
        updateFollowing: (state, action) => {
            return {
                ...state,
                followers: action.payload.followers,
                following: action.payload.following
            };
        }
    }
});

export const { login, logout, updatePic, updateBio, updateName, updateFollowing } = userSlice.actions;

export default userSlice.reducer;
