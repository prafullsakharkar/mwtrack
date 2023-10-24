import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import React from 'react';

function ImageUpload(props) {
    const files = props.files

    function handleUploadChange(e) {

        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const uploaded = []
        Array.from(e.target.files).map(item => {
            if (Array.from(files).length > 0) {
                (Array.from(files).filter(value => value.name === item.name)).length == 0 && uploaded.push(item)
            } else {
                uploaded.push(item)
            }
        })
        props.setFiles([...files, ...uploaded])

    }

    function handleAttachmentRemove(fileName) {
        const updatedFiles = Array.from(files).filter(item => item.name !== fileName)
        props.setFiles(updatedFiles)
    }

    return (
        <>
            <div className='flex '>
                <label
                    htmlFor="button-file"
                    className=
                    'flex items-center justify-center relative w-full h-128 rounded-16 mx-12 mb-12 overflow-hidden cursor-pointer shadow hover:shadow-lg'

                >
                    <input
                        accept="image/*"
                        className="hidden"
                        id="button-file"
                        type="file"
                        multiple={props.multiple}
                        onChange={handleUploadChange}
                    />
                    <Icon fontSize="large" color="action">
                        cloud_upload
                    </Icon>
                </label>
            </div>
            <div className='flex '>

                {files.length > 0 && (
                    <ul className="py-8 px-16 flex flex-wrap list-reset">
                        {Array.from(files).map(item => (
                            <li key={item.name} className="flex items-center w-full">
                                <Icon color="action" className="text-16">
                                    photo
                                </Icon>
                                <Typography>
                                    {item.name}
                                </Typography>
                                <IconButton
                                    className="w-32 h-32 mx-4 p-0"
                                    aria-label="Delete"
                                    onClick={() => handleAttachmentRemove(item.name)}
                                >
                                    <Icon fontSize="small">delete</Icon>
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

export default ImageUpload;
