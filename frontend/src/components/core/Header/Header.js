import { Typography, Button, Paper, Input } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import history from '@/history';
import SvgIcon from '@/components/core/SvgIcon';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import { useDispatch } from 'react-redux';

const Header = (props) => {
    const dispatch = useDispatch();
    const { pathname } = history.location;
    const openNewDialog = props.openNewDialog;
    const entity = props.entity;
    const searchText = props.searchText;
    const setSearchText = props.setSearchText;

    return (
        <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-8 px-16 md:px-16">
            <Typography
                component={Link}
                to={pathname}
                role="button"
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
                delay={300}
                className="text-24 font-bold tracking-tight"
            >
                {entity}
            </Typography>

            <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
                {setSearchText && (<Paper className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0">
                    <Input
                        placeholder="Search project"
                        className="flex flex-1"
                        disableUnderline
                        fullWidth
                        value={searchText}
                        inputProps={{
                            'aria-label': 'Search',
                        }}
                        onChange={(ev) => dispatch(setSearchText(ev))}
                    />
                    <SvgIcon color="disabled">heroicons-solid:search</SvgIcon>
                </Paper>)}
                {openNewDialog ? (<Button
                    variant="contained"
                    color="secondary"
                    onClick={(ev) => {
                        ev.stopPropagation();
                        dispatch(openNewDialog);
                    }}
                >
                    <SvgIcon size={20}>heroicons-outline:plus</SvgIcon>
                    <span className="mx-8">Create</span>
                </Button>) : (<Button
                    variant="contained"
                    color="secondary"
                    component={NavLinkAdapter}
                    to="new/edit"
                >
                    <SvgIcon size={20}>heroicons-outline:plus</SvgIcon>
                    <span className="mx-8">Create</span>
                </Button>)
                }
            </div>
        </div>
    )
}

export default Header