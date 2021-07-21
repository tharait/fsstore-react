import React from 'react'

const styles = {
    uploadButton: {
        display: 'inlineBlock',
        position: 'relative'
    },
    maskButton: {
        display: 'block'
    },
    fileInput: {
        opacity: 0,
        position: 'absolute',
        display: 'block',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    }
}

const UploadButton = ({ onSelect }) => {
    const handleFileSelect = (event) => {
        onSelect(event.target.files);
    }
    return (
        <div style={styles.uploadButton}>
            <button style={styles.maskButton} className="fs-btn fs-primary-bg">
               <i className="pi pi-upload"></i> Upload File(s)
            </button>
            <input type="file" name="file" multiple onChange={handleFileSelect} style={styles.fileInput}></input>
        </div>
    )
}

export default UploadButton
