import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { lighten } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import SvgIcon from '@/components/core/SvgIcon';
import format from 'date-fns/format';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import NewNote from './NewNote';
import { openEditNoteDialog, openEditReplyDialog } from 'src/app/entities/notes/store/noteSlice';

function NoteCard(props) {
  const dispatch = useDispatch();
  const { note } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Card component={motion.div} variants={item} key={note.id} className="mb-16">
      <CardHeader
        className="px-12 pt-12"
        avatar={<Avatar aria-label="Recipe" src={note.created_by?.avatar} />}
        action={
          <IconButton aria-label="more" size="large"
            onClick={
              (ev) => {
                ev.preventDefault();
                dispatch(openEditNoteDialog(note));
              }
            }
          >
            <SvgIcon>heroicons-outline:pencil</SvgIcon>
          </IconButton>
        }
        title={
          <span className="flex items-center space-x-8">
            <Typography className="font-normal" color="secondary.main" paragraph={false}>
              {note.created_by?.full_name}
            </Typography>
            <span className="mx-4">
              created a note on {note.step
                ? "step " + note.step : note.asset
                  ? "asset " + note.asset : note.shot
                    ? "shot " + note.shot : note.sequence
                      ? "sequence " + note.sequence : note.episode
                        ? "episode " + note.episode : "project " + note.project
              }
            </span>
          </span>
        }
        subheader={note.created_at && format(new Date(note.created_at), 'MMM dd, h:mm a')}
      />

      <CardContent className="px-32">
        {note.message && (
          <Typography component="p" className="mb-16">
            {note.message}
          </Typography>
        )}

        <div className="flex flex-wrap -m-8 mt-8 overflow-auto">
          {note?.attachments.map((attachment, index) => (
            <div className="flex items-center m-8" key={attachment.id}>
              {attachment.type.startsWith('image/') && (
                <img
                  className="w-120 h-80 rounded-md overflow-hidden cursor-pointer"
                  src={attachment.url}
                  // src={"http://localhost:8000" + attachment.url}
                  alt={attachment.name}
                  onClick={() => setIsOpen(true)}
                />
              )}

              {attachment.type.startsWith('application/') && (
                <Box
                  sx={{ backgroundColor: 'background.default' }}
                  className="flex items-center justify-center w-120 h-80 rounded-md overflow-hidden"
                >
                  <Typography className="flex items-center justify-center text-sm font-semibold">
                    {attachment.type.split('/')[1].trim().toUpperCase()}
                  </Typography>
                </Box>
              )}
            </div>
          ))}
          {isOpen && (
            <Lightbox
              mainSrc={note?.attachments[photoIndex]?.url}
              nextSrc={note?.attachments[(photoIndex + 1) % note?.attachments.length]?.url}
              prevSrc={note?.attachments[(photoIndex + note?.attachments.length - 1) % note?.attachments.length]?.url}
              onCloseRequest={() => setIsOpen(false)}
              onMovePrevRequest={() => setPhotoIndex((photoIndex + note?.attachments.length - 1) % note?.attachments.length)}
              onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % note?.attachments.length)}
            />
          )}
        </div>


        {/* <SingleLineImageList itemData={note.attachments} /> */}

      </CardContent>

      <div className="flex items-center mx-52 mb-8">
        <NewNote
          type={'Reply'}
          replies={note.replies}
          noteId={note.id}
        />
      </div>

      {note.replies && note.replies.length > 0 && (
        <Box
          className="card-footer flex flex-col px-32 py-24 border-t-1"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? lighten(theme.palette.background.default, 0.4)
                : lighten(theme.palette.background.default, 0.02),
          }}
        >
          <div className="">
            <div className="flex items-center">
              <Typography>{note.replies.length} replies</Typography>
              <SvgIcon size={16} className="mx-4" color="action">
                heroicons-outline:chevron-down
              </SvgIcon>
            </div>

            <List>
              {note.replies.map((reply) => (
                <>
                  <div key={reply.id}>
                    <ListItem className="px-0 -mx-8">
                      <Avatar
                        alt={reply.created_by?.username}
                        src={reply.created_by?.avatar}
                        className="mx-8"
                      />
                      <ListItemText
                        className="px-4"
                        primary={
                          <div className="flex items-center space-x-8">
                            <Typography
                              className="font-normal"
                              color="secondary"
                              paragraph={false}
                            >
                              {reply.created_by?.username}
                            </Typography>
                            <Typography variant="caption">{format(new Date(reply.created_at), 'MMM dd, h:mm a')}</Typography>
                          </div>
                        }
                        secondary={reply.message}
                      />
                      <IconButton aria-label="more" size="large"
                        onClick={
                          (ev) => {
                            ev.preventDefault();
                            dispatch(openEditReplyDialog(reply));
                          }
                        }
                      >
                        <SvgIcon>heroicons-outline:pencil</SvgIcon>
                      </IconButton>
                    </ListItem>


                    {reply?.attachments.map((attachment, index) => (
                      <div className="flex items-center m-8" key={attachment.id}>
                        {attachment.type.startsWith('image/') && (
                          <img
                            className="w-120 h-80 rounded-md overflow-hidden cursor-pointer"
                            src={attachment.url}
                            // src={"http://localhost:8000" + attachment.url}
                            alt={attachment.name}
                            onClick={() => setIsOpen(true)}
                          />
                        )}

                        {attachment.type.startsWith('application/') && (
                          <Box
                            sx={{ backgroundColor: 'background.default' }}
                            className="flex items-center justify-center w-120 h-80 rounded-md overflow-hidden"
                          >
                            <Typography className="flex items-center justify-center text-sm font-semibold">
                              {attachment.type.split('/')[1].trim().toUpperCase()}
                            </Typography>
                          </Box>
                        )}
                      </div>
                    ))}
                    {isOpen && (
                      <Lightbox
                        mainSrc={reply?.attachments[photoIndex]?.url}
                        nextSrc={reply?.attachments[(photoIndex + 1) % reply?.attachments.length]?.url}
                        prevSrc={reply?.attachments[(photoIndex + reply?.attachments.length - 1) % reply?.attachments.length]?.url}
                        onCloseRequest={() => setIsOpen(false)}
                        onMovePrevRequest={() => setPhotoIndex((photoIndex + reply?.attachments.length - 1) % reply?.attachments.length)}
                        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % reply?.attachments.length)}
                      />
                    )}
                  </div>
                </>
              ))}
            </List>
          </div>
        </Box>
      )}
    </Card>
  );
}

export default NoteCard;
