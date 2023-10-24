import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import SvgIcon from '@/components/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';

function ActivityTimelineItem({ item, last }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color="primary"
          className="w-40 h-40 p-0  mt-0 flex items-center justify-center"
        >
          <Tooltip title={item.user?.username}>
            {item.user && <Avatar src={item.user.avatar} />}
          </Tooltip>
          {!item.user?.avatar && (
            <SvgIcon>heroicons-solid:star</SvgIcon>
          )}
        </TimelineDot>

        {!last && <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent className="flex flex-col items-start pt-0 pb-48">
        {item.message && <div dangerouslySetInnerHTML={{ __html: item.message }} />}

        <div className="flex flex-col sm:flex-row sm:items-center mt-8 sm:mt-4 sm:space-x-8 text-md leading-5">
          <Typography className="text-13" color="text.secondary">
            {item.timestamp && format(new Date(item.timestamp), 'MMM dd, h:mm a')}
          </Typography>
        </div>

        {/* {item.context && (
          <Box
            className="mt-16 py-16 px-20 rounded-lg border"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? lighten(theme.palette.background.default, 0.4)
                  : lighten(theme.palette.background.default, 0.02),
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: item.context }} />
          </Box>
        )} */}
      </TimelineContent>
    </TimelineItem>
  );
}

export default ActivityTimelineItem;
