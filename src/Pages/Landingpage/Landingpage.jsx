import { Card, CardContent, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Landingpage = () => {
    const navigate = useNavigate();

    const navigateToForm = (params) => {
        // console.log("navigateToForm", params);

        switch (params) {
            case "ColumbiaLaboratories":
                navigate('/ColumbiaLaboratories');
                break;
            // case "AdamsonAnalyticalLabs":
            //     navigate('/AdamsonAnalyticalLabs');
            //     break;
            case "TentamusNorthAmericaVirginia":
                navigate('/TentamusNorthAmericaVirginia');
                break;
            case "AdamsonAnalyticalLabs":
                navigate('/AdamsonAnalyticalLabs');
                break;

            default: navigate("/");
        }

    }

    return (
        <Card
            style={{
                maxWidth: 400,
                margin: 'auto',
                marginTop: '10rem',
                backgroundColor: '#FEFDED',
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            }}
        >
            <CardContent
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <span className='text-xl font-semibold' style={{ marginBottom: '1rem' }}>
                    Choose company to pay
                </span>

                {/* <Button
                    variant='contained'
                    color="success"
                    size='small'
                    style={{ textTransform: "capitalize", fontWeight: 600, marginBottom: '1rem' }}
                    onClick={() => navigateToForm("AnalyticalFoodLaboratories")}>
                    Pay to AFL
                </Button> */}

                <Button
                    variant='contained'
                    color="success"
                    className="text-base"
                    // size='small'
                    fullWidth
                    style={{ textTransform: 'none', fontWeight: 600, marginBottom: '1rem' }}
                    onClick={() => navigateToForm("ColumbiaLaboratories")}>
                    Columbia Laboratories
                </Button>

                <Button
                    variant='contained'
                    color="success"
                    className="text-base"
                    // size='small'
                    fullWidth
                    style={{ textTransform: 'none', fontWeight: 600, marginBottom: '1rem' }}
                    onClick={() => navigateToForm("TentamusNorthAmericaVirginia")}>
                    Tentamus North America Virginia
                </Button>

                <Button
                    variant='contained'
                    color="success"
                    className="text-base"
                    // size='small'
                    fullWidth
                    style={{ textTransform: 'none', fontWeight: 600 }}
                    onClick={() => navigateToForm("AdamsonAnalyticalLabs")}>
                    Adamson Analytical Labs
                </Button>



            </CardContent>
        </Card>
    )
}

export default Landingpage;

