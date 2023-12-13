import { useTheme } from '@emotion/react';
// import { TabPanel } from '@mui/lab';
import { Box, CardContent, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views';
import CommonFilter from '../common/CommonFilter';
import CommonTable from '../common/CommonTable';
import { Url } from '../global';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
            className="panding-left-right-0"
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const PammActivityLog = () => {

    const theme = useTheme();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [param, setParam] = useState("");
    const [value, setValue] = useState(0);
    const [searchBy, setSearchBy] = useState([
        {
            'label': 'USER NAME',
            'value': false,
            'name': 'full_name'
        },
        {
            'label': 'IP ADDRESS',
            'value': false,
            'name': 'ip_address'
        }
    ]);

    const activityColumn = [
        {
            name: 'USER NAME',
            selector: row => row.full_name,
            sortable: true,
            reorder: true,
            grow: 0.4,
        },
        {
            name: 'IP ADDRESS',
            selector: row => row.ip_address,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'DATETIME',
            selector: row => row.datetime,
            sortable: true,
            reorder: true,
            grow: 1,
        }
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <div>
            <div className="app-content--inner">
                <div className="app-content--inner__wrapper mh-100-vh">
                    <div style={{ opacity: 1 }}>
                        <Grid container>
                            <Grid item md={12} lg={12} xl={12}>
                                <p className='main-heading'>Pamm Activity Log</p>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                    className="tabsBar"
                                >
                                    <Tab label="INVESTOR LOGS" />
                                    <Tab label="MONEY MANAGER LOGS" />
                                </Tabs>
                                <SwipeableViews
                                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                                    index={value}
                                    onChangeIndex={handleChangeIndex}
                                >
                                    <TabPanel value={value} index={0} dir={theme.direction}>
                                        <CommonFilter search={searchBy} searchWord={setSearchKeyword} setParam={setParam} />
                                        <br />
                                        <Paper elevation={2} style={{ borderRadius: "10px" }} className='pending-all-15px'>
                                            <CardContent className="py-3">
                                                <Grid container spacing={2}>
                                                    <Grid item sm={12} md={12} lg={12}>
                                                        <CommonTable url={`${Url}/datatable/pamm/uesr_activity_log_list.php`} column={activityColumn} sort='2' search={searchBy} searchWord={searchKeyword} param={param} />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Paper>
                                    </TabPanel>
                                    <TabPanel value={value} index={1} dir={theme.direction}>
                                        <CommonFilter search={searchBy} searchWord={setSearchKeyword} setParam={setParam} />
                                        <br />
                                        <Paper elevation={2} style={{ borderRadius: "10px" }} className='pending-all-15px'>
                                            <CardContent className="py-3">
                                                <Grid container spacing={2}>
                                                    <Grid item sm={12} md={12} lg={12}>
                                                        <CommonTable url={`${Url}/datatable/pamm/mm_activity_log_list.php`} column={activityColumn} sort='2' search={searchBy} searchWord={searchKeyword} param={param} />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Paper>
                                    </TabPanel>
                                </SwipeableViews>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PammActivityLog