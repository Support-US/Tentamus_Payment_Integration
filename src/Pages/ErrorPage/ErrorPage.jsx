import { Button } from '@mui/material';
import React from 'react'

const ErrorPage = () => {
    return (
        <div className="flex flex-column justify-content-center align-items-center h-screen">
            <h1 className='text-8xl font-bold' style={{ color: "#4CAF50" }}>404</h1>
            <span className="text-xl font-bold" style={{ color: "gray" }}>Page No Found</span>
            <Button
                variant='outlined'
                color="success"
                className='mt-5'
                // size='small'
                style={{ textTransform: 'none', fontWeight: 600 }}
                onClick={() => window.location.href = "/"}>
                Go to Home
            </Button>
        </div>
    )
}

export default ErrorPage;