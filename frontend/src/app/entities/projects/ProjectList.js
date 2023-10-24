import Utils from '@/libs/Utils';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import { Box, Grid, Paper } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjects, openEditProjectDialog } from './store/projectSlice';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import SvgIcon from '@/components/core/SvgIcon';
import history from '@/history';
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
function ProjectList(props) {
	const dispatch = useDispatch();
	const projects = useSelector(selectProjects);
	const searchText = useSelector(({ projectApp }) => projectApp.projects.searchText);
	const [active, setActive] = useState([])
	const [inActive, setInActive] = useState([])

	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return entities;
			}
			return Utils.filterArrayByString(entities, _searchText);
		}

		if (projects) {
			setFilteredData(getFilteredArray(projects, searchText));
		}
	}, [projects, searchText]);

	useEffect(() => {
		setActive(filteredData?.filter(row => row.is_active))
		setInActive(filteredData?.filter(row => !row.is_active))
	}, [filteredData])

	return !filteredData || filteredData.length === 0 ? (
		<div className="flex items-center justify-center w-full h-full">
			<Typography color="textSecondary" variant="h5">
				There are no projects!
			</Typography>
		</div>
	) : (
		<div>
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
				variants={container}
				className="w-full"
			>
				<div className="md:flex">
					<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
						<div className="p-32">
							<Grid container justifyContent="left" spacing="20">
								{active?.map((item) => (
									<Grid key={item.uid} item>
										<Paper
											sx={{
												height: 160,
												width: 290,
												backgroundColor: (theme) =>
													theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
											}}
										>
											<ImageListItem key={item.code} className="p-4 cursor-pointer">
												<img
													src={item.thumbnail}
													className="max-w-300 max-h-160 rounded-16"
													onClick={() => history.push("/entity/project/" + item.uid + "/overview")}
													srcSet={item.thumbnail}
													loading="lazy"
												/>
												<ImageListItemBar
													className="rounded-16 p-4 font-bold"
													title={item.code}
													actionIcon={
														<IconButton
															variant="contained"
															color="secondary"
															component={NavLinkAdapter}
															to={item.uid + "/edit"}
														>
															<SvgIcon size={20}>heroicons-outline:pencil-alt</SvgIcon>
														</IconButton>
													}
												/>
											</ImageListItem>
										</Paper>
									</Grid>
								))}
							</Grid>
						</div>
						<div className="p-32">
							{inActive.length > 0 && (<ListSubheader
								component={motion.div}
								variants={item}
								className="flex items-center px-0 mb-12 bg-transparent"
							>
								<Typography className="text-4xl font-semibold leading-tight" color="secondary">
									Archived
								</Typography>
								<Typography className="mx-12 font-medium leading-tight" color="text.secondary">
									( {inActive.length} )
								</Typography>
							</ListSubheader>)}

							<Grid container justifyContent="left" spacing="10">
								{inActive?.map((item) => (
									<Grid key={item.uid} item>
										<Paper
											sx={{
												height: 160,
												width: 300,
												backgroundColor: (theme) =>
													theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
											}}
										>
											<ImageListItem key={item.code} className="p-4 cursor-pointer">
												<img
													src={item.thumbnail}
													alt={item.code}
													className="max-w-300 max-h-160 rounded-16"
													onClick={() => history.push("/entity/project/" + item.uid + "/overview")}
													srcSet={item.thumbnail}
													loading="lazy"
												/>
												<ImageListItemBar
													className="rounded-16 p-4 font-bold"
													title={item.code}
													actionIcon={
														<IconButton
															variant="contained"
															color="secondary"
															component={NavLinkAdapter}
															to={item.uid + "/edit"}
														>
															<SvgIcon size={20}>heroicons-outline:pencil-alt</SvgIcon>
														</IconButton>
													}
												/>
											</ImageListItem>
										</Paper>
									</Grid>
								))}
							</Grid>
						</div>
					</div>
				</div>
			</motion.div>

		</div>
	);
}

export default ProjectList;
