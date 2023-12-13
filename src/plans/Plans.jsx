import './plans.css';
import React, { useState } from 'react'
import { Button, CardContent, Grid, Paper } from '@mui/material'
import Dynamicinput from '../common/Dynamicinput';

const Plans = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [isAdd, setIsAdd] = useState(false);

    const add = () => {
        setIsEdit(true);
        setIsAdd(true);
    }

    const back = () => {
        setIsEdit(false);
        setIsAdd(false);
    }
    return (
        <div>
            <div className="app-content--inner">
                <div className="app-content--inner__wrapper mh-100-vh">
                    <div style={{ opacity: 1 }}>
                        <Grid container>
                            <Grid item md={12} lg={12} xl={12}>
                                <p className='main-heading'>Plans</p>

                                <Paper elevation={2} style={{ borderRadius: "10px" }} className='pending-all-15px'>
                                    <div className='actionGroupButton'>
                                        {(isEdit) ? <Button variant="contained" className='add-faq' onClick={back}>Back</Button> : ''}
                                        <Button variant="contained" className='add-faq' onClick={add}>Add</Button>
                                    </div>
                                    <br />
                                    <CardContent className="py-3">
                                        <Grid container spacing={2}>
                                            <Grid item sm={12} md={12} lg={12}>
                                                <div className='plan-main-container'>
                                                    {(isEdit) ? <div className='plan-element'>
                                                        {/* <img src='./assets/img/person.png' className='plan-user-img' /> */}
                                                        <h2><Dynamicinput /></h2>
                                                        <div className='containt-area'>
                                                            <p>Minimum Deposit: <Dynamicinput /></p>
                                                            <p>Spread: <Dynamicinput /></p>
                                                            <p>Commission: <Dynamicinput /></p>
                                                            <p>Leverage: <Dynamicinput /></p>
                                                            <p>Swap Free: <Dynamicinput /></p>
                                                            <p>Trading Plaform: <Dynamicinput /></p>
                                                            <p>Execution: <Dynamicinput /></p>
                                                            <p>Trading Instrument: <Dynamicinput /></p>
                                                            <p>Account Currency: <Dynamicinput /></p>
                                                            <p>Minimum Trade Size: <Dynamicinput /></p>
                                                            <p>Stop out level: <Dynamicinput /></p>
                                                        </div>
                                                        {(isAdd) ? <button className='btn btn-edit' onClick={back}>Add</button> :<button className='btn btn-edit' onClick={back}>Update</button>}
                                                        
                                                    </div> : <><div className='plan-element'>
                                                        {/* <img src='./assets/img/person.png' className='plan-user-img' /> */}
                                                        <h2>EXECUTIVE</h2>
                                                        <div className='containt-area'>
                                                            <p>Minimum Deposit: <b>$100</b></p>
                                                            <p>Spread: <b>From 1.4</b></p>
                                                            <p>Commission: <b>No</b></p>
                                                            <p>Leverage: <b>1:500</b></p>
                                                            <p>Swap Free: <b>10 Days</b></p>
                                                            <p>Trading Plaform: <b>MT5</b></p>
                                                            <p>Execution: <b>Market Execution</b></p>
                                                            <p>Trading Instrument: <b>+300 Instruments.Forex, Metals, Indeces, Engergy</b></p>
                                                            <p>Account Currency: <b>USD</b></p>
                                                            <p>Minimum Trade Size: <b>0.01 for Forex and Metals</b></p>
                                                            <p>Stop out level: <b>30%</b></p>
                                                        </div>
                                                        <button className='btn btn-edit' onClick={(e) => setIsEdit(true)}>Edit</button>
                                                    </div>
                                                        <div className='plan-element'>
                                                            {/* <img src='./assets/img/person.png' className='plan-user-img' /> */}
                                                            <h2>EXECUTIVE</h2>
                                                            <div className='containt-area'>
                                                                <p>Minimum Deposit: <b>$100</b></p>
                                                                <p>Spread: <b>From 1.4</b></p>
                                                                <p>Commission: <b>No</b></p>
                                                                <p>Leverage: <b>1:500</b></p>
                                                                <p>Swap Free: <b>10 Days</b></p>
                                                                <p>Trading Plaform: <b>MT5</b></p>
                                                                <p>Execution: <b>Market Execution</b></p>
                                                                <p>Trading Instrument: <b>+300 Instruments.Forex, Metals, Indeces, Engergy</b></p>
                                                                <p>Account Currency: <b>USD</b></p>
                                                                <p>Minimum Trade Size: <b>0.01 for Forex and Metals</b></p>
                                                                <p>Stop out level: <b>30%</b></p>
                                                            </div>
                                                            <button className='btn btn-edit' onClick={(e) => setIsEdit(true)}>Edit</button>
                                                        </div>
                                                        <div className='plan-element'>
                                                            {/* <img src='./assets/img/person.png' className='plan-user-img' /> */}
                                                            <h2>EXECUTIVE</h2>
                                                            <div className='containt-area'>
                                                                <p>Minimum Deposit: <b>$100</b></p>
                                                                <p>Spread: <b>From 1.4</b></p>
                                                                <p>Commission: <b>No</b></p>
                                                                <p>Leverage: <b>1:500</b></p>
                                                                <p>Swap Free: <b>10 Days</b></p>
                                                                <p>Trading Plaform: <b>MT5</b></p>
                                                                <p>Execution: <b>Market Execution</b></p>
                                                                <p>Trading Instrument: <b>+300 Instruments.Forex, Metals, Indeces, Engergy</b></p>
                                                                <p>Account Currency: <b>USD</b></p>
                                                                <p>Minimum Trade Size: <b>0.01 for Forex and Metals</b></p>
                                                                <p>Stop out level: <b>30%</b></p>
                                                            </div>
                                                            <button className='btn btn-edit' onClick={(e) => setIsEdit(true)}>Edit</button>
                                                        </div>
                                                    </>}

                                                </div>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Plans