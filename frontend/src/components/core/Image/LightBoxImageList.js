import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function LightBoxImageList(props) {
    const { media_files } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);


    return (
        <Box>
            <AvatarGroup max={3}>
                {media_files.map((attachment, index) => (
                    <Tooltip key={index} title={attachment.name} placement="top">
                        <Avatar
                            key={index}
                            src={attachment.url}
                            className="rounded-md cursor-pointer"
                            onClick={() => setIsOpen(true)}
                        />
                    </Tooltip>
                ))}
            </AvatarGroup>

            {isOpen && (
                <Lightbox
                    mainSrc={media_files[photoIndex]?.url}
                    nextSrc={media_files[(photoIndex + 1) % media_files.length]?.url}
                    prevSrc={media_files[(photoIndex + media_files.length - 1) % media_files.length]?.url}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + media_files.length - 1) % media_files.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % media_files.length)}
                />
            )}
        </Box>
    );
}

export default LightBoxImageList;
