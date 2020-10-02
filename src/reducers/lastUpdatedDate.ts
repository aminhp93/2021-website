import { createSlice } from '@reduxjs/toolkit';

import { ThunkActionType, DispatchType } from 'store';
import LastUpdatedDateService from 'services/lastUpdatedDate';

const lastUpdatedDateSlice = createSlice({
    name: 'lastUpdatedDate',
    initialState: null,
    reducers: {
        updateLastUpdatedDateSuccess: (state, { payload }) => {
            return payload
        },
    },
});

export const {
    updateLastUpdatedDateSuccess,
} = lastUpdatedDateSlice.actions;

export default lastUpdatedDateSlice.reducer;

export const getLastUpdatedDate = (): ThunkActionType => async (
    dispatch: DispatchType
) => {
    const response = await LastUpdatedDateService.getLastUpdatedDate();
    dispatch(updateLastUpdatedDateSuccess(response.data));
};

export const updateLastUpdatedDate = (data: any): ThunkActionType => async (
    dispatch: DispatchType
) => {
    const response = await LastUpdatedDateService.updateLastUpdatedDate(data);
    dispatch(updateLastUpdatedDateSuccess(response.data));
};


