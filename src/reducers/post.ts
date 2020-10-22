

import { createSlice } from '@reduxjs/toolkit';

import { ThunkActionType } from 'store';
import PostService from 'services/post';

const postSlice = createSlice({
    name: 'post',
    initialState: {},
    reducers: {},
});

// export const {} = postSlice.actions;

export default postSlice.reducer;

export const getPosts = (type, offset, limit, symbol): ThunkActionType => async () => {
    const res = await PostService.getPosts(type, offset, limit, symbol)
    return res
}

export const getReplies = (postId): ThunkActionType => async () => {
    const res = await PostService.getReplies(postId)
    return res
}
