import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {green} from '@mui/material/colors';
import Button from '@mui/material/Button';
import {FC} from "react";
import {useAppSelector} from "../../hooks/redux-hooks";

type ButtonWithLoadingPropsType = {
    title: string
    disabledButton: boolean
}

export const ButtonWithLoading: FC<ButtonWithLoadingPropsType> = ({title, disabledButton}) => {
    const appStatus = useAppSelector(state => state.app.status)

    const buttonSx = {
        ...(appStatus === 'succeeded' && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>

            <Box sx={{m: 1, position: 'relative'}}>
                <Button
                    variant="contained"
                    sx={{backgroundColor: '#4E97FD'}}
                    disabled={appStatus === 'loading' || disabledButton}
                    type={'submit'}
                >
                    {title}
                </Button>
                {appStatus === 'loading' && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}