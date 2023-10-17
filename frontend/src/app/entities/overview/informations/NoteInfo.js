import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';

function ProjectInfo(props) {
    const data = props.data;
    const users = props.users;

    if (!data) {
        return null
    }

    return (
        <CardContent className="px-32 py-24">
            <div className="mb-24">
                <Typography className="mb-4 text-15">UID</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.uid}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Name</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.name}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Code</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.code}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">CG Supervisor</Typography>
                <Typography className="font-medium" color="text.secondary">{users && users[data?.cg_supervisor]?.email}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Episodic</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.is_episodic ? 'Yes' : 'No'}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Start Date</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.start_date && format(new Date(data.start_date), 'dd-MM-y hh:mm:ss')}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Due Date</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.due_date && format(new Date(data.due_date), 'dd-MM-y hh:mm:ss')}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Resolution</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.resolution}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Start Frame</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.start_frame}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Created Date</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.created_at && format(new Date(data.created_at), 'dd-MM-y hh:mm:ss')}</Typography>
            </div>

        </CardContent>
    );
}
export default ProjectInfo;
