import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import history from '@/history';
import { Link } from 'react-router-dom';
import SvgIcon from '@/components/core/SvgIcon';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import { Avatar } from '@mui/material';
import EntityHeader from '@/components/core/Header/EntityHeader';

function OverviewHeader(props) {
  const dispatch = useDispatch();
  const { pathname } = history.location;
  const data = props.data

  return (
    <div className="flex flex-col">
      <img
        className="h-160 object-cover w-full"
        src="assets/images/cover/entity_cover.jpg"
      />
      {/* <video width="100%" height="240" src="static/images/pages/profile/cover.mp4" controls>
              Your browser does not support the video tag.
          </video>  */}

      <div className="flex flex-col flex-0 lg:flex-row items-center w-full mx-auto px-32 lg:h-72">
        <div className="-mt-96 lg:-mt-88 rounded-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
            <Avatar
              sx={{ borderColor: 'background.paper' }}
              className="ml-16 w-160 h-128 border-4 rounded-16"
              src={data?.thumbnail || "assets/images/thumbnail/no_entity_thumbnail.jpg"}
            />
          </motion.div>
        </div>

        <EntityHeader />

      </div>
    </div>
  );
}

export default OverviewHeader;

