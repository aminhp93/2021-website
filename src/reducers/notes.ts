import { createSlice } from '@reduxjs/toolkit';

import { ThunkActionType } from 'store';
import NoteService from 'services/note';

const notesSlice = createSlice({
    name: 'notes',
    initialState: {},
    reducers: {},
});

export default notesSlice.reducer;

export const {

} = notesSlice.actions;

export const updateNote = (noteId, content): ThunkActionType => async (
    dispatch
) => {
    const data = {
        content
    }
    const res = await NoteService.updateNote(noteId, data);
    return res
};

export const getListNotes = (): ThunkActionType => async (
    dispatch
) => {
    const res = await NoteService.getListNotes();
    return res
};

