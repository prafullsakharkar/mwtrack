import CustomScrollbars from '@/components/core/CustomScrollbars';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SvgIcon from '@/components/core/SvgIcon';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import ProjectInfo from './informations/ProjectInfo';
import AssetInfo from './informations/AssetInfo';
import EpisodeInfo from './informations/EpisodeInfo';
import SequenceInfo from './informations/SequenceInfo';
import ShotInfo from './informations/ShotInfo';
import StepInfo from './informations/StepInfo';
import TaskInfo from './informations/TaskInfo';
import VersionInfo from './informations/VersionInfo';
import NoteInfo from './informations/NoteInfo';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ActivityTimelineItem from './ActivityTimelineItem';
import CircularProgress from '@mui/material/CircularProgress';

import NewNote from './note/NewNote';
import SingleLineImageList from '@/components/core/Image/SingleLineImageList';
import { getNotes, selectNotes } from 'src/app/entities/notes/store/noteSlice';
// import { getActivities, selectActivities } from 'src/app/tools/activities/store/activitiesSlice';
import NoteCard from './note/NoteCard';

function OverviewList(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const entity = props.entity;
  const data = props.data;
  const users = props.users;
  const statuses = props.statuses;
  const priorities = props.priorities;

  const pageSize = 10

  const notesData = useSelector(selectNotes);
  const notesCount = useSelector(({ overviewApp }) => overviewApp.notes.totalCount);
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState([])
  const [start, setStart] = useState(0)
  const stopLoadingNotes = (notesCount <= notes.length)

  const activitiesCount = 0;
  // const activitiesCount = 0 || useSelector(({ overviewApp }) => overviewApp.activities.totalCount);
  // const actsData = useSelector(selectActivities);
  const [isLoadingAct, setIsLoadingAct] = useState(false)
  const [activities, setActivities] = useState([])
  const [startAct, setStartAct] = useState(0)
  const stopLoadingActs = (activitiesCount <= activities.length)
  console.info(activitiesCount, activities.length)

  useEffect(() => {
    const handleScroll = () => {
      // console.info(window.innerHeight + 5 + document.documentElement.scrollTop, document.documentElement.offsetHeight)
      if (
        parseInt(window.innerHeight + document.documentElement.scrollTop) ===
        parseInt(document.documentElement.offsetHeight)
      ) {
        if (!stopLoadingNotes) {
          setStart(start => pageSize + start);
          setIsLoading(true);
        }
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stopLoadingNotes]);

  useEffect(() => {
    setIsLoading(true)
    const queryParams = {
      page_size: pageSize,
      start: start,
    }
    queryParams[routeParams.entity] = routeParams.uid
    dispatch(getNotes(queryParams))
  }, [start])

  useEffect(() => {
    notesData.length > 0 && setNotes([...notes, ...notesData])
    setIsLoading(false);
  }, [notesData])

  useEffect(() => {
    const element = document.getElementById('div-activities')

    const handleActivityScroll = () => {
      // console.info(element.scrollTop, element.offsetHeight, element.scrollHeight)
      if (
        parseInt(element.scrollTop + element.offsetHeight) ===
        parseInt(element.scrollHeight)
      ) {
        // console.info('Activity bottom ...')
        if (!stopLoadingActs) {
          setStartAct(startAct => pageSize + startAct);
          setIsLoadingAct(true);
        }
      }
    }
    element?.addEventListener('scroll', handleActivityScroll);
    return () => element?.removeEventListener('scroll', handleActivityScroll);
  }, [stopLoadingActs]);

  // useEffect(() => {
  //   setIsLoadingAct(true)
  //   startAct === 0 && setActivities([])
  //   const queryActParams = {
  //     page_size: pageSize,
  //     start: startAct,
  //   }
  //   queryActParams[routeParams.entity] = routeParams.uid
  //   dispatch(getActivities(queryActParams))
  // }, [startAct, routeParams])

  // useEffect(() => {
  //   actsData.length > 0 && setActivities([...activities, ...actsData])
  //   setIsLoadingAct(false);
  // }, [actsData])

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full">
      <div className="md:flex">

        <div className="flex flex-col flex-1 md:ltr: mr-16 md:rtl:ml-16">
          <NewNote />

          {notes.length > 0 && notes.map((note, index) => (
            <NoteCard note={note} key={'note-' + index} />
          ))}
          {isLoading && (<Box className='flex items-center flex-row justify-center mb-12'>
            <CircularProgress color="secondary" />
          </Box>)}
        </div>

        <div className="flex flex-col w-full md:w-480 md:ltr:mr-16 md:rtl:ml-16" >
          {entity === 'project' && (<Card component={motion.div} variants={item} className="flex flex-col w-full px-32 pt-24 mb-16">
            <div className="flex justify-between items-center pb-16" >
              <Typography className="text-2xl leading-tight font-extrabold tracking-tight" color="secondary">
                Latest Activity
              </Typography>
            </div>

            <CardContent className="p-0">
              <Timeline
                className="py-12"
                position="right"
                sx={{
                  '& .MuiTimelineItem-root:before': {
                    display: 'none',
                  },
                }}
              >
                <CustomScrollbars className="grow overflow-auto max-h-480" id="div-activities" >
                  {activities?.map((item, index) => (
                    <ActivityTimelineItem
                      last={activities.length === index + 1}
                      item={item}
                      key={'acts-' + index}
                    />
                  ))}
                </CustomScrollbars>
                {isLoadingAct && (<Box className='flex items-center flex-row justify-center mb-12'>
                  <CircularProgress color="secondary" />
                </Box>)}
              </Timeline>
            </CardContent>
          </Card>)}

          <Card component={motion.div} variants={item} className="flex flex-col w-full px-32 pt-24 mb-16">
            <div className="flex justify-between items-center pb-16">

              <Typography className="text-2xl leading-tight font-extrabold tracking-tight" color="secondary">
                {entity?.charAt(0).toUpperCase() + entity?.slice(1)} Information
              </Typography>
            </div>

            {entity === 'project' && (<ProjectInfo data={data} users={users} />)}
            {entity === 'asset' && (<AssetInfo data={data} users={users} />)}
            {entity === 'episode' && (<EpisodeInfo data={data} users={users} />)}
            {entity === 'sequence' && (<SequenceInfo data={data} users={users} />)}
            {entity === 'shot' && (<ShotInfo data={data} users={users} />)}
            {entity === 'step' && (<StepInfo data={data} users={users} statuses={statuses} priorities={priorities} />)}
            {entity === 'task' && (<TaskInfo data={data} users={users} statuses={statuses} priorities={priorities} />)}
            {entity === 'version' && (<VersionInfo data={data} users={users} statuses={statuses} />)}
            {entity === 'note' && (<NoteInfo data={data} users={users} />)}

          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default OverviewList;
