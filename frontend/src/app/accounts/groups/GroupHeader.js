import { Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'
import history from '@/history';
import SvgIcon from '@/components/core/SvgIcon';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import { useDispatch } from 'react-redux';
import { openNewGroupDialog } from './store/groupSlice';

const GroupHeader = () => {
    const dispatch = useDispatch();
    const { pathname } = history.location;
    return (
        <div className="flex items-center justify-center py-8 px-4 md:px-8 h-full w-full">
            <div className="px-24 py-8 w-full flex flex-col sm:flex-row space-y-8 sm:space-y-0 items-center justify-between">
                <motion.span
                    className="flex items-end"
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                >
                    <Typography
                        component={Link}
                        to={pathname}
                        className="text-24 font-bold tracking-tight leading-none"
                        role="button"
                    >
                        Groups
                    </Typography>
                </motion.span>
                <Button
                    className="mx-8"
                    variant="contained"
                    color="secondary"
                    onClick={(ev) => {
                        ev.stopPropagation();
                        dispatch(openNewGroupDialog());
                    }}
                >
                    <SvgIcon size={20}>heroicons-outline:plus</SvgIcon>
                    <span className="mx-8">Create</span>
                </Button>
            </div>
        </div>
    )
}

export default GroupHeader