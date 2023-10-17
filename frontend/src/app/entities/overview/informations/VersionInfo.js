import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';

function ProjectInfo(props) {
    const data = props.data;
    const users = props.users;
    const statuses = props.statuses
    console.info(data)

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
                <Typography className="font-bold mb-4 text-15">Description</Typography>
                <Typography className="font-medium" color="text.secondary">{data.description}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="font-bold mb-4 text-15">Project</Typography>
                <Typography className="font-medium" color="text.secondary">{data.project}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="font-bold mb-4 text-15">Episode</Typography>
                <Typography className="font-medium" color="text.secondary">{data.episode}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="font-bold mb-4 text-15">Sequence</Typography>
                <Typography className="font-medium" color="text.secondary">{data.sequence}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="font-bold mb-4 text-15">Asset</Typography>
                <Typography className="font-medium" color="text.secondary">{data.asset}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="font-bold mb-4 text-15">Status</Typography>
                <Typography className="font-medium" color="text.secondary">{statuses && statuses[data.status]?.name}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Created By</Typography>
                <Typography className="font-medium" color="text.secondary">{users && users[data.created_by]?.full_name}</Typography>
            </div>
            <div className="mb-24">
                <Typography className="mb-4 text-15">Created Date</Typography>
                <Typography className="font-medium" color="text.secondary">{data?.created_at && format(new Date(data.created_at), 'dd-MM-y hh:mm:ss')}</Typography>
            </div>

        </CardContent>
    );
}
export default ProjectInfo;
