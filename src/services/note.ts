import request from 'utils/request';
import { NoteUrls } from 'utils/api';

const NoteService = {
    getListNotes() {
        return request({
            method: 'GET',
            url: NoteUrls.getListNotes,
        });
    },
    updateNote(noteId, data) {
        return request({
            method: 'PATCH',
            data,
            url: NoteUrls.updateNote(noteId),
        });
    },
 

};

export default NoteService;
