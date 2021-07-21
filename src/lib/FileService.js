import axios from 'axios';
const {REACT_APP_API} = process.env;

export default class FileService {
    getFiles() {
        return axios.get(REACT_APP_API);
    }

    deleteFile(fileName) {
        return axios.delete(REACT_APP_API + '/' + fileName, {method: 'DELETE'});
    }

    uploadFile(data) {
        return axios.post(REACT_APP_API, data);
    }

    downloadUrl(fileName) {
        return REACT_APP_API + '/' + fileName;
    }
}
