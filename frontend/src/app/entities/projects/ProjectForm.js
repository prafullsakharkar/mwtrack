import { Button, Typography, Switch } from '@mui/material';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Loading from '@/components/core/Loading';
import _ from '@/lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import SvgIcon from '@/components/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  addProject,
  selectProjectById,
  updateProject,
} from './store/projectSlice';
import diff from 'object-diff';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  code: yup.string().required('You must enter a project code'),
  name: yup.string().required('You must enter a project name'),
  resolution: yup.string().required('You must enter a project name'),
  start_frame: yup.string().required('You must enter a project name'),
  fps: yup.string().required('You must enter a fps'),
});

const defaultFormState = {
  name: '',
  code: '',
  cg_supervisor: '',
  duration: 1,
  is_episodic: true,
  resolution: '',
  is_active: true,
  start_frame: 101,
  fps: 24,
  thumbnail: null,
};

function ProjectForm(props) {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const project = useSelector((state) => selectProjectById(state, routeParams.uid)) || null;
  const users = useSelector(({ projectApp }) => projectApp.users.entities);

  const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  const roles = ["admin", "owner", "production", "supervisor", "artist"]

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (routeParams.uid === 'new') {
      dispatch(addProject(data)).then(() => navigate("/projects"));
    } else {
      const changedValues = diff(project, data)
      changedValues.id = project.uid
      dispatch(updateProject(changedValues)).then(() => navigate("/projects"));
    }
  }


  function handleUploadChange(e) {

    return new Promise((resolve, reject) => {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      const formData = new FormData();
      formData.append('thumbnail', file);
      formData.id = form.uid;
      dispatch(updateProject(formData));
      const reader = new FileReader();

      reader.onload = () => {
        resolve(`data:${file.type};base64,${btoa(reader.result)}`);
      };

      reader.onerror = reject;

      reader.readAsBinaryString(file);
    });

  }


  useEffect(() => {
    reset((routeParams.uid == "new") ? defaultFormState : { ...project });
  }, [project, reset]);

  if (_.isEmpty(form)) {
    return <Loading />;
  }

  return (
    <>
      <Box
        className="relative w-full h-88 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        {!form.thumbnail && (<Typography className="flex justify-center mt-24 text-3xl font-bold truncate">Create New Project</Typography>)}
      </Box>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        {form?.thumbnail && (<div className="w-full">
          <div className="flex flex-auto items-end -mt-64">
            <Controller
              control={control}
              name="thumbnail"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: 'solid',
                    borderColor: 'background.paper',
                  }}
                  className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label htmlFor="button-thumbnail" className="flex p-8 cursor-pointer">
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-thumbnail"
                          type="file"
                          onChange={async (e) => {
                            const newImage = await handleUploadChange(e);
                            onChange(newImage);
                          }}
                        />
                        <SvgIcon className="text-white">heroicons-outline:camera</SvgIcon>
                      </label>
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: 'background.default',
                      color: 'secondary',
                    }}
                    className="object-cover w-full h-full text-64 font-bold"
                    src={value}
                    alt={project?.code}
                  >
                    {project?.code.charAt(0)}
                  </Avatar>
                </Box>
              )}
            />
          </div>
        </div>
        )}

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              className="mt-24"
              {...field}
              label="Project Name"
              id="name"
              error={!!errors.name}
              helperText={errors?.name?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <TextField
              className="mt-24"
              {...field}
              label="Project Code"
              id="code"
              error={!!errors.code}
              helperText={errors?.code?.message}
              variant="outlined"
              fullWidth
              required
            />
          )}
        />
        <Controller
          control={control}
          name="cg_supervisor"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              className="mt-24"
              id="cg_supervisor"
              options={Object.values(users)}
              value={form?.cg_supervisor && users[form.cg_supervisor] || null}
              disableClearable
              getOptionLabel={option => option.email}
              fullWidth
              onChange={(event, newValue) => {
                onChange(newValue.id)
              }}
              renderInput={(params) => <TextField {...params} label="CG Supervisor" />}
            />
          )}
        />
        <Controller
          control={control}
          name="start_frame"
          render={({ field }) => (
            <TextField
              className="mt-24"
              {...field}
              label="Start Frame"
              id="start_frame"
              error={!!errors.start_frame}
              helperText={errors?.start_frame?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />


        <Controller
          control={control}
          name="duration"
          render={({ field }) => (
            <TextField
              className="mt-24"
              {...field}
              label="Duration (in days)"
              id="duration"
              error={!!errors.duration}
              helperText={errors?.duration?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="fps"
          render={({ field }) => (
            <TextField
              className="mt-24"
              {...field}
              label="FPS"
              id="fps"
              error={!!errors.fps}
              helperText={errors?.fps?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="resolution"
          render={({ field }) => (
            <TextField
              className="mt-24"
              {...field}
              label="Resolution"
              placeholder="(e.g 1920X1020)"
              id="resolution"
              error={!!errors.resolution}
              helperText={errors?.resolution?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <div className="mt-24">
          <Typography>Is Active
            <Controller
              control={control}
              name="is_active"
              label="Project Active"
              labelPlacement="start"
              render={({ field }) => (
                <Switch checked={form.is_active} {...field} name="is_active" />
              )}
            />
          </Typography>
          <Typography>Is Episodic
            <Controller
              control={control}
              name="is_episodic"
              label="Project Active"
              labelPlacement="start"
              render={({ field }) => (
                <Switch checked={form.is_episodic} {...field} name="is_episodic" />
              )}
            />
          </Typography>
        </div>


      </div>

      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
          Cancel
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

export default ProjectForm;
