import React, { useState } from 'react'
import { TrashOutline } from 'react-ionicons'

const File = (params) => {

    const [file, setFile] = useState(params.file);
    const [confirming, setConfirming] = useState(false);

    const handleDelete = () => {
        setConfirming(true);
    }

    const handleCancel = () => {
        setConfirming(false);
    }

    const handleConfirm = () => {
        setFile({ ...file, deleting: true });
        params.onDelete(file);
    }

    return (
        <React.Fragment>
            <div className={`fs-list-item ${file.uploading ? "uploading" : ""}`}>
                <div className="fs-list-item-text">{file.fileName}</div>
                {!(confirming || file.uploading) &&
                    <button type="button" onClick={handleDelete} className="fs-btn fs-btn-round">
                        <TrashOutline
                            color={'#ffffff'}
                            title="delete"
                            height="1rem"
                        />
                    </button>
                }
                {confirming &&
                    <div className="fs-list-item-btns">
                        <button type="button" onClick={handleConfirm} className="fs-btn fs-btn-sm fs-primary-bg">
                            Delete
                        </button>
                        <button type="button" onClick={(handleCancel)} className="fs-btn fs-btn-sm">
                            Cancel
                        </button>
                    </div>
                }
                {file.uploading &&
                    <div className="fs-list-item-status">
                        Uploading...
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

export default File
