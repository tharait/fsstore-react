import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";
import {confirmDialog} from 'primereact/confirmdialog';
import UploadButton from './UploadButton';
import FileService from "../lib/FileService";

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0'
    }
}

const FileList = ({height, header}) => {
    const [files, setFiles] = useState([]);
    const [filterText, setFilterText] = useState([]);
    const fileService = new FileService();
    const toast = useRef(null);
    useEffect(() => {
        fileService.getFiles()
            .then(res => setFiles(res.data))
            .catch(reason => showAlert(reason.response.data.message))
    }, []);

    const onDelete = (fileName) => {
        confirmDialog({
            message: `Are you sure you want to delete [${fileName}]?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleDelete(fileName),
        });
    }

    const handleDelete = (fileName) => {
        fileService.deleteFile(fileName)
            .then(res => {
                setFiles(files.filter(e => e.name !== fileName));
                showAlert(fileName + " deleted", 'File deleted', true)
            })
    }

    const handleUpload = (filesToUpload) => {
        for (var i = 0; i < filesToUpload.length; i++) {
            // Uploaded file exists with same name
            // eslint-disable-next-line
            const index = files.findIndex(e => e.fileName === filesToUpload.item(i).name);
            if (index > -1) {
                showAlert("A file with name (" + filesToUpload.item(i).name + ") has already been uploaded. If you wish to upload it anyway, please delete the old file first.");
            } else {
                uploadFile(filesToUpload.item(i));
            }
        }
    }

    const showAlert = (message, summary, success) => {
        toast.current.show({severity: success ? 'success' : 'error', summary: summary, detail: message});
    }

    const uploadFile = (file) => {
        const data = new FormData();
        data.append('file', file);
        const random = randomString();
        const newFile = {name: file.name, id: random, uploading: true};
        files.push(newFile);
        setFiles([...files]);
        fileService.uploadFile(data)
            .then(res => {
                updateItem(res.data)
            })
            .catch(reason => {
                showAlert(reason.response.data.message, 'Upload Error', false);
                removeItem(newFile);
            });
    }

    const randomString = () => {
        return Math.random().toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5);
    }

    const updateItem = (file) => {
        const index = files.findIndex(e => e.name === file.name);
        if (index > -1) {
            files[index] = file;
            setFiles([...files]);
        }
    }

    const removeItem = (file) => {
        const index = files.findIndex(e => e.id === file.id);
        if (index > -1) {
            files.splice(index, 1);
            setFiles(files);
        }
    }

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const bytesColumn = (file) => {
        if (file.uploading) return '';
        if (file.bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(file.bytes) / Math.log(1024)) + '');
        return <small>{Math.round(file.bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]}</small>
    }

    const buttonsColumn = (file) => {
        return (file.uploading) ? ''
            : <div>
                <a href={fileService.downloadUrl(file.name)} download={file.name} style={{textDecoration: 'none'}}>
                    <Button icon="pi pi-download" title="download"
                            className="p-button-danger p-button-text"/>
                </a>
                <Button icon="pi pi-trash" title="delete"
                        className="p-button-danger p-button-text"
                        onClick={() => onDelete(file.name)}/>
            </div>
    }

    const dateColumn = (file) => {
        return (file.uploading)
            ? <small><i className="pi pi-spin pi-spinner"></i> uploading</small>
            : <small>{new Date(file.createdAt).toLocaleDateString("ja-JP")}</small>
    }

    return (
        <React.Fragment>
            <Toast ref={toast}></Toast>
            <div style={styles.header}>
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search"/>
                        <InputText type="search"
                                   value={filterText}
                                   onChange={(e) => setFilterText(e.target.value)}
                                   placeholder="Search"
                                   className={styles.searchInput}
                                   style={{height: '2.5rem'}}/>
                    </span>
                    <small style={{marginLeft: '1rem'}}>{files.length} files</small>
                </div>
                <UploadButton onSelect={handleUpload}></UploadButton>
            </div>
            <DataTable value={files}
                       scrollable
                       scrollHeight={height}
                       globalFilter={filterText}
                       emptyMessage="No files found.">
                <Column field="name" header="Name" sortable></Column>
                <Column field="createdAt" header="Date" body={dateColumn} sortable style={{width: '120px'}}></Column>
                <Column field="bytes" header="Size" body={bytesColumn} sortable
                        style={{width: '120px', textAlign: 'right'}}></Column>
                <Column header="" body={buttonsColumn} style={{width: '120px'}}></Column>
            </DataTable>
        </React.Fragment>
    )
}

FileList.defaultProps = {
    height: '400px',
    header: 'File Store'
}

export default FileList
