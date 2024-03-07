import { Card, CardContent, Button} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Landingpage = () => {
    const navigate = useNavigate();
    const navigateToAFLCustomerPaymentDetailsForm = () => {
        navigate('/AnalyticalFoodLaboratories');
    }
    const navigateToCFLCustomerPaymentDetailsForm = () => {
        navigate('/ColumbiaLaboratories');
    }

    return (
        <Card style={{ maxWidth: 400, margin: 'auto', marginTop: '10rem', backgroundColor: '#f0f0f0' }}>
            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className='text-xs sm:text-lg font-semibold' style={{ marginBottom: '1rem' }}>
                    Choose Your Company
                </span>

                <Button
                    variant='contained'
                    color="success"
                    size='small'
                    style={{ textTransform: "capitalize", fontWeight: 600, marginBottom: '1rem' }}
                    onClick={navigateToAFLCustomerPaymentDetailsForm}>
                    Pay to AFL
                </Button>

                <Button
                    variant='contained'
                    color="success"
                    size='small'
                    style={{ textTransform: "capitalize", fontWeight: 600 }}
                    onClick={navigateToCFLCustomerPaymentDetailsForm}>
                    Pay to CFL
                </Button>
            </CardContent>
        </Card>
    )
}

export default Landingpage;

