import './master.css';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { FormControl, Grid, MenuItem, Select, Menu } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import LoadingButton from '@mui/lab/LoadingButton';
import CustomImageModal from '../common/CustomImageModal';
import CommonTable from '../common/CommonTable';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Url } from '../global';

const CssTextField = styled(TextField)({
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(0),
    },
    "& .MuiInputBase-input": {
        borderRadius: 9,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #ced4da",
        fontSize: 16,
        padding: "8px 26px 8px 10px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        "&:focus": {
            borderRadius: 9,
            borderColor: "#80bdff",
        },
    },
}));

const Master = () => {
    const { id } = useParams();
    const [info, setinfo] = useState({});
    const [anchorEl, setAnchorEl] = React.useState([]);
    const [openTableMenus, setOpenTableMenus] = useState([]);
    const open = Boolean(anchorEl);
    const [openCollapse, setOpen] = React.useState({});
    const handleCollapseClick = (e) => {
        const name = e.target.classList[0];
        setOpen((preValue) => {
            return {
                [name]: !openCollapse[name],
            };
        });
    };
    const input1 = (event) => {
        const { name, value } = event.target;
        if (name == "myclient_search") {
            // setClientSearch(value);
        } else {
            setinfo((prevalue) => {
                return {
                    ...prevalue,
                    [name]: value,
                };
            });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const [age, setAge] = React.useState("");
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const handleClick = (event, index) => {
        let tableMenus = [...openTableMenus];
        tableMenus[index] = event.currentTarget;
        setOpenTableMenus(tableMenus);
    };
    const handleClose = (index) => {
        let tableMenus = [...openTableMenus];
        tableMenus[index] = null;
        setOpenTableMenus(tableMenus);
    };
    const columns = [
        {
            name: 'First Name',
            selector: row => row.first_name,
            sortable: true,
            reorder: true,
        },
        {
            name: 'Last Name',
            selector: row => row.last_name,
            sortable: true,
            reorder: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            reorder: true,
        },
        {
            name: 'Action',
            button: true,
            cell: row => {
                return <div>
                    <Button
                        id={`actionButton_${row.id}`}
                        aria-controls={open ? `basic-menu-${row.id}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(event) => handleClick(event, row.id)}
                        {...row}
                    >
                        Action
                    </Button>
                    <Menu
                        id={`basic-menu-${row.id}`}
                        anchorEl={openTableMenus[row.id]}
                        open={Boolean(openTableMenus[row.id])}
                        onClose={(event) => handleClose(row.id)}
                    >
                        <MenuItem {...row} onClick={(event) => handleClose(row.id)}>Profile {`${open}`}</MenuItem>
                        <MenuItem {...row} onClick={(event) => handleClose(row.id)}>My account</MenuItem>
                        <MenuItem {...row} onClick={(event) => handleClose(row.id)}>Logout</MenuItem>
                    </Menu>
                </div>
            },
            ignoreRowClick: true,
            allowOverflow: true
        },
    ];

    const myClientColumns = [
        {
            name: 'ID',
            selector: row => row.sr_no,
            sortable: true,
            reorder: true,
            grow: 0.2,
        },
        {
            name: 'UPLINE',
            selector: row => row.upline,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'IB GROUP',
            selector: row => row.ib_group,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'NAME',
            selector: row => row.name,
            sortable: true,
            reorder: true,
            grow: 2,
        },
        {
            name: 'EMAIL',
            selector: row => row.user_email,
            sortable: true,
            reorder: true,
            grow: 2,
        },
        {
            name: 'PHONE',
            selector: row => row.user_phone,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'REGISTRATION DATE',
            selector: row => row.added_datetime,
            sortable: true,
            reorder: true,
            grow: 2,
        },
    ];

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

    const partnershipCommisionColumn = [
        {
            name: 'SR.NO',
            selector: row => row.sr_no,
            sortable: true,
            reorder: true,
            grow: 0.4,
        },
        {
            name: 'DATE',
            selector: row => row.date,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'FROM NAME',
            selector: row => row.from_name,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'AMOUNT',
            selector: row => row.amount,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'START DATE',
            selector: row => row.start_date,
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'END DATE',
            selector: row => row.end_date,
            sortable: true,
            reorder: true,
            grow: 1,
        },
    ];

    const depositColumn = [
        {
            name: 'SR.NO',
            selector: row => row.sr_no,
            sortable: true,
            reorder: true,
            grow: 0.1,
        },
        {
            name: 'REFERENCE NO',
            selector: row => {
                return <span title={row.refrence_no}>{row.refrence_no}</span>
            },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'DATE',
            selector: row => { return <span title={row.date}>{row.date}</span> },
            sortable: true,
            reorder: true,
            grow: 1.3,
        },
        {
            name: 'WALLET CODE',
            selector: row => { return <span title={row.wallet_code}>{row.wallet_code}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'PAYMENT METHOD',
            selector: row => { return <span title={row.method}>{row.method}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'AMOUNT',
            selector: row => { return <span title={row.amount}>{row.amount}</span> },
            sortable: true,
            reorder: true,
            grow: 0.5,
        },
        {
            name: 'PROOF',
            selector: row => {
                return <div>
                    {(row.proof != '') ? <CustomImageModal image={row.proof} className='tableImg' /> : ''}

                </div>
            },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'STATUS',
            selector: row => {
                return <div>
                    <span className={`badge ${(row.status == "0") ? 'pending' : (row.status == "1") ? "approved" : "rejected"}`}>{(row.status == "0") ? 'Pending' : (row.status == "1") ? "Approved" : "Rejected"}</span>
                </div>
            },
            sortable: true,
            reorder: true,
            grow: 0.7,
        },
        {
            name: 'Action',
            button: true,
            cell: row => {
                return <div>
                    <Button
                        id={`actionButton_${row.sr_no}`}
                        aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(event) => handleClick(event, row.sr_no)}
                        {...row}
                        style={{ color: 'rgb(144 145 139)' }}
                    >
                        <i className="material-icons">more_vert</i>
                    </Button>
                    <Menu
                        id={`basic-menu-${row.sr_no}`}
                        anchorEl={openTableMenus[row.sr_no]}
                        open={Boolean(openTableMenus[row.sr_no])}
                        onClose={(event) => handleClose(row.sr_no)}
                    >
                        {(row.status == "1") ?
                            <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons">receipt</i>&nbsp;&nbsp;View</MenuItem>
                            : <div><MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons">receipt</i>&nbsp;&nbsp;View</MenuItem>
                                <MenuItem {...row} onClick={(event) => depositApproved(row.sr_no)}><i className="material-icons font-color-approved">thumb_up</i>&nbsp;&nbsp;Approved</MenuItem>
                                <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons font-color-rejected">thumb_down</i>&nbsp;&nbsp;Rejected</MenuItem></div>}

                    </Menu>
                </div>
            },
            ignoreRowClick: true,
            allowOverflow: true
        }
    ];

    const withdrawColumn = [
        {
            name: 'SR.NO',
            selector: row => row.sr_no,
            sortable: true,
            reorder: true,
            grow: 0.1,
        },
        {
            name: 'DATE',
            selector: row => { return <span title={row.date}>{row.date}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'NAME',
            selector: row => { return <span title={row.name}>{row.name}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'ACCOUNT NO',
            selector: row => { return <span title={row.account_number}>{row.account_number}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'PAYMENT METHOD',
            selector: row => { return <span title={row.method}>{row.method}</span> },
            sortable: true,
            reorder: true,
            grow: 0.5,
        },
        {
            name: 'REMARKS',
            selector: row => { return <span title={row.remarks}>{row.remarks}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'AMOUNT',
            selector: row => { return <span title={row.amount}>{row.amount}</span> },
            sortable: true,
            reorder: true,
            grow: 0.5,
        },
        {
            name: 'STATUS',
            selector: row => {
                return <div>
                    <span className={`badge ${(row.status == "0") ? 'pending' : (row.status == "1") ? "approved" : "rejected"}`}>{(row.status == "0") ? 'Pending' : (row.status == "1") ? "Approved" : "Rejected"}</span>
                </div>
            },
            sortable: true,
            reorder: true,
            grow: 0.7,
        },
        {
            name: 'Action',
            button: true,
            cell: row => {
                return <div>
                    <Button
                        id={`actionButton_${row.sr_no}`}
                        aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(event) => handleClick(event, row.sr_no)}
                        {...row}
                        style={{ color: 'rgb(144 145 139)' }}
                    >
                        <i className="material-icons">more_vert</i>
                    </Button>
                    <Menu
                        id={`basic-menu-${row.sr_no}`}
                        anchorEl={openTableMenus[row.sr_no]}
                        open={Boolean(openTableMenus[row.sr_no])}
                        onClose={(event) => handleClose(row.sr_no)}
                    >
                        {(row.status == "1") ?
                            <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons">receipt</i>&nbsp;&nbsp;View</MenuItem>
                            : <div><MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons">receipt</i>&nbsp;&nbsp;View</MenuItem>
                                <MenuItem {...row} onClick={(event) => depositApproved(row.sr_no)}><i className="material-icons font-color-approved">thumb_up</i>&nbsp;&nbsp;Approved</MenuItem>
                                <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons font-color-rejected">thumb_down</i>&nbsp;&nbsp;Rejected</MenuItem></div>}

                    </Menu>
                </div>
            },
            ignoreRowClick: true,
            allowOverflow: true
        }
    ];

    const ibwithdrawColumn = [
        {
            name: 'SR.NO',
            selector: row => row.sr_no,
            sortable: true,
            reorder: true,
            grow: 0.1,
        },
        {
            name: 'DATE',
            selector: row => { return <span title={row.date}>{row.date}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'NAME',
            selector: row => { return <span title={row.name}>{row.name}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'EMAIL',
            selector: row => { return <span title={row.email}>{row.email}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'MT5 A/C NO',
            selector: row => { return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span> },
            sortable: true,
            reorder: true,
            grow: 0.5,
        },
        {
            name: 'AMOUNT',
            selector: row => { return <span title={row.amount}>{row.amount}</span> },
            sortable: true,
            reorder: true,
            grow: 0.5,
        },
        {
            name: 'REMARKS',
            selector: row => { return <span title={row.remarks}>{row.remarks}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'STATUS',
            selector: row => {
                return <div>
                    <span className={`badge ${(row.status == "0") ? 'pending' : (row.status == "1") ? "approved" : "rejected"}`}>{(row.status == "0") ? 'Pending' : (row.status == "1") ? "Approved" : "Rejected"}</span>
                </div>
            },
            sortable: true,
            reorder: true,
            grow: 0.7,
        },
        /* {
            name: 'Action',
            button: true,
            cell: row => {
                return <div>
                    <Button
                        id={`actionButton_${row.sr_no}`}
                        aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(event) => handleClick(event, row.sr_no)}
                        {...row}
                    >
                        Action
                    </Button>
                    <Menu
                        id={`basic-menu-${row.sr_no}`}
                        anchorEl={openTableMenus[row.sr_no]}
                        open={Boolean(openTableMenus[row.sr_no])}
                        onClose={(event) => handleClose(row.sr_no)}
                    >
                        <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}>View</MenuItem>
                        <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}>Approved</MenuItem>
                        <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}>Rejected</MenuItem>
                    </Menu>
                </div>
            },
            ignoreRowClick: true,
            allowOverflow: true
        } */
    ];

    const ticketColumn = [
        {
            name: 'Ticket ID',
            selector: row => row.ticketID,
            sortable: true,
            reorder: true,
            grow: 0.1,
        },
        {
            name: 'Ticket Title',
            selector: row => { return <span title={row.ticketTitle}>{row.ticketTitle}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'Subject',
            selector: row => { return <span title={row.subject}>{row.subject}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'Message',
            selector: row => { return <span title={row.ticketBody}>{row.ticketBody}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'Status',
            selector: row => { return <span title={row.status}>{row.status}</span> },
            sortable: true,
            reorder: true,
            grow: 0.5,
        },
        {
            name: 'Date',
            selector: row => { return <span title={row.ticketDateTime}>{row.ticketDateTime}</span> },
            sortable: true,
            reorder: true,
            grow: 1,
        },
        {
            name: 'Action',
            button: true,
            cell: row => {
                return <div>
                    <Button
                        id={`actionButton_${row.sr_no}`}
                        aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(event) => handleClick(event, row.sr_no)}
                        {...row}
                        style={{ color: 'rgb(144 145 139)' }}
                    >
                        <i className="material-icons">more_vert</i>
                    </Button>
                    <Menu
                        id={`basic-menu-${row.sr_no}`}
                        anchorEl={openTableMenus[row.sr_no]}
                        open={Boolean(openTableMenus[row.sr_no])}
                        onClose={(event) => handleClose(row.sr_no)}
                    >
                        {(row.status == "1") ?
                            <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons">receipt</i>&nbsp;&nbsp;View</MenuItem>
                            : <div><MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons">receipt</i>&nbsp;&nbsp;View</MenuItem>
                                <MenuItem {...row} onClick={(event) => depositApproved(row.sr_no)}><i className="material-icons font-color-approved">thumb_up</i>&nbsp;&nbsp;Approved</MenuItem>
                                <MenuItem {...row} onClick={(event) => handleClose(row.sr_no)}><i className="material-icons font-color-rejected">thumb_down</i>&nbsp;&nbsp;Rejected</MenuItem></div>}

                    </Menu>
                </div>
            },
            ignoreRowClick: true,
            allowOverflow: true
        }
    ];

    const [clientLevel, setClientLevel] = useState(1);

    const [data, setData] = useState([]);
    const [resData, setResData] = useState();
    const [filterData, setFilterData] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const fetchUsers = async page => {
        setLoading(true);

        const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        fetchUsers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`);

        setData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };

    const handleSort = async (column, sortDirection) => {
    };

    const actionClick = (e) => {
        var id = e.target.getAttribute("id");
        var email = e.target.getAttribute("email");
        var first_name = e.target.getAttribute("first_name");
        var last_name = e.target.getAttribute("last_name");
        var avatar = e.target.getAttribute("avatar");
    }

    const depositApproved = (e) => {
    }

    const depositFilter = (e) => {

        
        if (e.target.classList.contains('depositFilter')) {
            if (filterData.deposit_from == undefined) {
                toast.error('Please select from date');
            } else if (filterData.deposit_to == undefined) {
                toast.error('Please select to date');
            } else {
            }
        } else if (e.target.classList.contains('withdrawFilter')) {
            if (filterData.withdraw_from == undefined) {
                toast.error('Please select from date');
            } else if (filterData.withdraw_to == undefined) {
                toast.error('Please select to date');
            } else {

            }
        }
    }
    toast.configure();
    useEffect(() => {
        fetchUsers(1); // fetch page 1 of users
    }, []);

    return (
        <div>
            <div className="app-content--inner">
                <div className="app-content--inner__wrapper mh-100-vh">
                    <div style={{ opacity: 1 }}>
                        <Grid container>
                            <Grid item md={12} lg={12} xl={12}>
                                <p className='main-heading'>{id}</p>
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`userInfo ${openCollapse.userInfo ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='userInfo CollapseHeadingTitle'>
                                            <span className="userInfo material-icons">
                                                person
                                            </span>
                                            User Info
                                        </div>
                                        <span className="userInfo sidebar-icon-indicator">
                                            {openCollapse.userInfo ? <span className="userInfo material-icons">
                                                expand_more
                                            </span> : <span className="userInfo material-icons">
                                                expand_less
                                            </span>}
                                        </span>
                                    </a>
                                    <Collapse in={openCollapse.userInfo} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <div className='refferalSection'>
                                                <div className='dotted-border'>
                                                    <p className="my-refferal-link center">
                                                        <label className='boldFont'>My Refferal Link:&nbsp;</label> <span id="iblink">https://alphapixclients.com/forex/register.php?sponsorId=541879 </span> <button className="copy_link"><span className="blinking"><i className="material-icons">content_copy</i></span></button>
                                                    </p>
                                                    <div className='passwordSection'>
                                                        <p className="my-refferal-link center">
                                                            <label className='boldFont'>MT5 Password:&nbsp;</label> <span id="iblink">O5W0IqN4K1@ </span> <button className="copy_link"><span className="blinking"><i className="material-icons">content_copy</i></span></button>
                                                        </p>
                                                        <p className="my-refferal-link center">
                                                            <label className='boldFont'>MT5 View Password:&nbsp;</label> <span id="iblink">u2G97ESi7Y@ </span> <button className="copy_link"><span className="blinking"><i className="material-icons">content_copy</i></span></button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='elementSection'>
                                                <form onSubmit={handleSubmit} >
                                                    <div className='userInforFrom'>
                                                        <div className='element'>
                                                            <label>MT5 ID</label>
                                                            <p className='fakeinput'>75492</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Wallet ID</label>
                                                            <p className='fakeinput'>175238</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Phone</label>
                                                            <p className='fakeinput'>+91-9979114524</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Referral</label>
                                                            <p className='fakeinput'>Life Long</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Total Earnings</label>
                                                            <p className='fakeinput'>$0</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>My Wallet</label>
                                                            <p className='fakeinput'>$61</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>MT Balance</label>
                                                            <p className='fakeinput'>$0.76</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>MT Credit</label>
                                                            <p className='fakeinput'>$30</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>MT Equity</label>
                                                            <p className='fakeinput'>$30.76</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>MT Free Margin</label>
                                                            <p className='fakeinput'>$30.76</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>MT Profit</label>
                                                            <p className='fakeinput'>$0</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Total Team</label>
                                                            <p className='fakeinput'>0</p>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Registration Date</label>
                                                            <p className='fakeinput'>05 Apr 2022, 11:14 AM</p>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <div className='userInforFrom'>
                                                        <div className='element'>
                                                            <label>First Name</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="frist_name"
                                                                value={info.first_name}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Last Name</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="last_name"
                                                                value={info.last_name}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Email</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="email"
                                                                value={info.email}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Date of Birth</label>
                                                            {/* <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="dob"
                                                                value={info.dob}
                                                                onChange={input1}
                                                            /> */}
                                                            <BootstrapInput type="date"></BootstrapInput>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Group Level</label>
                                                            <Select
                                                                value={age}
                                                                onChange={handleChange}
                                                                displayEmpty
                                                                inputProps={{ "aria-label": "Without label" }}
                                                                input={<BootstrapInput />}
                                                            >
                                                                <MenuItem value="Trading">Trading</MenuItem>
                                                                <MenuItem value="Partnership">Partnership</MenuItem>
                                                            </Select>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Password</label>
                                                            <span className='btnChangePassword'>Change?</span>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Apply Copy Trading:</label>
                                                            <span className='btnChangePassword'>Apply?</span>
                                                        </div>
                                                    </div>
                                                    <div className='formActionSection'>
                                                        <ColorButton className=" d-block ml-auto mb-3 mr-3 " onClick={handleSubmit}>
                                                            Sumbit
                                                        </ColorButton>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`userKyc ${openCollapse.userKyc ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='userKyc CollapseHeadingTitle'>
                                            <span className="userKyc material-icons">
                                                verified_user
                                            </span>
                                            KYC
                                        </div>
                                        <div className='userKyc collapseActionSection'>
                                            <span className="userKyc badge badge-success">Approved</span>
                                            <span className="userKyc sidebar-icon-indicator">
                                                {openCollapse.userKyc ? <span className="userKyc material-icons">
                                                    expand_more
                                                </span> : <span className="userKyc material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.userKyc} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <div className='elementSection'>
                                                <form onSubmit={handleSubmit} >
                                                    <div className='userInforFrom'>
                                                        <div className='element'>
                                                            <label>Aadhar Card Number</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="aadhar_card_number"
                                                                value={info.aadhar_card_number}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Bank Account Number</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="bank_account_number"
                                                                value={info.bank_account_number}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Bank Name</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="bank_name"
                                                                value={info.bank_name}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Bank Holder Name</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="bank_holder_name"
                                                                value={info.bank_holder_name}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Bank IFSC Code</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="bank_ifsc_code"
                                                                value={info.bank_ifsc_code}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Remark</label>
                                                            <CssTextField
                                                                id="standard-search"
                                                                sx={{ width: "100%" }}
                                                                variant="standard"
                                                                name="remark"
                                                                value={info.remark}
                                                                onChange={input1}
                                                            />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Status</label>
                                                            <Select
                                                                value={age}
                                                                onChange={handleChange}
                                                                displayEmpty
                                                                inputProps={{ "aria-label": "Without label" }}
                                                                input={<BootstrapInput />}
                                                            >
                                                                <MenuItem value="Approved">Approved</MenuItem>
                                                                <MenuItem value="Rejected">Rejected</MenuItem>
                                                            </Select>
                                                        </div>
                                                        <div className='element'>
                                                            <label>Aadhar Card Front Image </label>
                                                            <CustomImageModal image={`${Url}/uploads/kyc/aadhar_front_1648558245_1109.png`} />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Aadhar Card Back Image </label>
                                                            <CustomImageModal image={`${Url}/uploads/kyc/aadhar_front_1648477388_1106.png`} />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Pan Card Image </label>
                                                            <CustomImageModal image={`${Url}/uploads/kyc/aadhar_back_1648446659_1106.png`} />
                                                        </div>
                                                        <div className='element'>
                                                            <label>Passbook Image </label>
                                                            <CustomImageModal image={`${Url}/uploads/kyc/bank_passbook_1648477753_1106.png`} />
                                                        </div>
                                                    </div>
                                                    <div className='formActionSection'>
                                                        <ColorButton className=" d-block ml-auto mb-3 mr-3 " onClick={handleSubmit}>
                                                            Sumbit
                                                        </ColorButton>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`myClient ${openCollapse.myClient ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='myClient CollapseHeadingTitle'>
                                            <span className="myClient material-icons">
                                                groups
                                            </span>
                                            My Client
                                        </div>
                                        <div className='myClient collapseActionSection'>
                                            <span className="myClient sidebar-icon-indicator">
                                                {openCollapse.myClient ? <span className="myClient material-icons">
                                                    expand_more
                                                </span> : <span className="myClient material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.myClient} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container >
                                                <Grid item sm={12} md={4} lg={4}>
                                                    <p class="level_commision_value ib_total_lot"><b>Total Level-{clientLevel}  Lot = {(resData)? resData.total_trade_volume : 0}</b></p>
                                                </Grid>
                                                <Grid item sm={12} md={4} lg={4}>
                                                    <p class="level_commision_value ib_total_commissions"><b>Total Level-{clientLevel} Commission = ${(resData)? resData.total_ib_comission_amount : 0}</b></p>
                                                </Grid>
                                                <Grid item sm={12} md={4} lg={4}>
                                                    <p class="level_commision_value partnership_commision"><b>Total Partnership Level-{clientLevel} Commission = ${(resData)? resData.total_partnership_commision_amount : 0}</b></p>
                                                </Grid>
                                            </Grid>
                                            <div className='clientListButton'>
                                                <LoadingButton
                                                    size="small"
                                                    onClick={() => setClientLevel(1)}
                                                    loading={loading}
                                                    loadingPosition="end"
                                                    variant="contained">
                                                    Level 1 Client
                                                </LoadingButton>
                                                <LoadingButton
                                                    size="small"
                                                    onClick={() => setClientLevel(2)}
                                                    loading={loading}
                                                    loadingPosition="end"
                                                    variant="contained">
                                                    Level 2 Client
                                                </LoadingButton>
                                                <LoadingButton
                                                    size="small"
                                                    onClick={() => setClientLevel(3)}
                                                    loading={loading}
                                                    loadingPosition="end"
                                                    variant="contained">
                                                    Level 3 Client
                                                </LoadingButton>
                                                <LoadingButton
                                                    size="small"
                                                    onClick={() => setClientLevel(4)}
                                                    loading={loading}
                                                    loadingPosition="end"
                                                    variant="contained">
                                                    Level 4 Client
                                                </LoadingButton>
                                            </div>
                                            <br />
                                            <CommonTable url={`${Url}/datatable/my_client_list.php`} column={myClientColumns} sort='6' level={clientLevel} setResData={setResData}/>
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`collDeposit ${openCollapse.collDeposit ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='collDeposit CollapseHeadingTitle'>
                                            <span className="collDeposit material-icons">
                                                add
                                            </span>
                                            Deposit
                                        </div>
                                        <div className='collDeposit collapseActionSection'>
                                            <span className='collDeposit boldFont'>$0.00</span>
                                            <span className="collDeposit sidebar-icon-indicator">
                                                {openCollapse.collDeposit ? <span className="collDeposit material-icons">
                                                    expand_more
                                                </span> : <span className="collDeposit material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.collDeposit} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date" onChange={(e) => setFilterData({...filterData,'deposit_from': e.target.value})}></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" onChange={(e) => setFilterData({...filterData,'deposit_to': e.target.value})}></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={filterData.deposit_status ? filterData.deposit_status : ''}
                                                            onChange={(e) => setFilterData({...filterData,'deposit_status': e.target.value})}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter depositFilter" onClick={depositFilter}>
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <CommonTable url={`${Url}/datatable/deposit_list.php`} column={depositColumn} sort='2' filter={filterData}/>
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`withdraw ${openCollapse.withdraw ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='withdraw CollapseHeadingTitle'>
                                            <span className="withdraw material-icons">
                                                file_upload
                                            </span>
                                            Withdraw
                                        </div>
                                        <div className='withdraw collapseActionSection'>
                                            <span className='withdraw boldFont'>$0.00</span>
                                            <span className="withdraw sidebar-icon-indicator">
                                                {openCollapse.withdraw ? <span className="withdraw material-icons">
                                                    expand_more
                                                </span> : <span className="withdraw material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.withdraw} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date" onChange={(e) => setFilterData({...filterData,'withdraw_from': e.target.value})}></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" onChange={(e) => setFilterData({...filterData,'withdraw_to': e.target.value})}></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={filterData.withdraw_status ? filterData.withdraw_status : ''}
                                                            onChange={(e) => setFilterData({...filterData,'withdraw_status': e.target.value})}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter withdrawFilter"  onClick={depositFilter}>
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <CommonTable url={`${Url}/datatable/withdraw_list.php`} column={withdrawColumn} sort='1' filter={filterData}/>
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`ibWithdraw ${openCollapse.ibWithdraw ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='ibWithdraw CollapseHeadingTitle'>
                                            <span className="ibWithdraw material-icons">
                                                file_upload
                                            </span>
                                            IB Withdraw
                                        </div>
                                        <div className='ibWithdraw collapseActionSection'>
                                            <span className='ibWithdraw boldFont'>$0.00</span>
                                            <span className="ibWithdraw sidebar-icon-indicator">
                                                {openCollapse.ibWithdraw ? <span className="ibWithdraw material-icons">
                                                    expand_more
                                                </span> : <span className="ibWithdraw material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.ibWithdraw} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date"></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" ></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={age}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="All">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter" >
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <CommonTable url={`${Url}/datatable/ib_withdraw_list.php`} column={ibwithdrawColumn} sort='1' />
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`ibCommision ${openCollapse.ibCommision ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='ibCommision CollapseHeadingTitle'>
                                            <span className="ibCommision material-icons">
                                                file_upload
                                            </span>
                                            IB Commision
                                        </div>
                                        <div className='ibCommision collapseActionSection'>
                                            <span className='ibCommision boldFont'>$0.00</span>
                                            <span className="ibCommision sidebar-icon-indicator">
                                                {openCollapse.ibCommision ? <span className="ibCommision material-icons">
                                                    expand_more
                                                </span> : <span className="ibCommision material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.ibCommision} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date"></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" ></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={age}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="All">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter" >
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <div className='tableSearchField'>
                                                <CssTextField
                                                    id="standard-search"
                                                    label="Search"
                                                    sx={{ width: "200px" }}
                                                    variant="standard"
                                                    name="ibCommision_search"
                                                    value={info.ibCommision_search}
                                                    onChange={input1}
                                                />
                                            </div>
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                progressPending={loading}
                                                onSort={handleSort}
                                                sortServer
                                                pagination
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
                                                highlightOnHover
                                                pointerOnHover
                                            />
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`partnershipWithdraw ${openCollapse.partnershipWithdraw ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='partnershipWithdraw CollapseHeadingTitle'>
                                            <span className="partnershipWithdraw material-icons">
                                                file_upload
                                            </span>
                                            Partnership Withdraw
                                        </div>
                                        <div className='partnershipWithdraw collapseActionSection'>
                                            <span className='partnershipWithdraw boldFont'>$0.00</span>
                                            <span className="partnershipWithdraw sidebar-icon-indicator">
                                                {openCollapse.partnershipWithdraw ? <span className="partnershipWithdraw material-icons">
                                                    expand_more
                                                </span> : <span className="partnershipWithdraw material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.partnershipWithdraw} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date"></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" ></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={age}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="All">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter" >
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <div className='tableSearchField'>
                                                <CssTextField
                                                    id="standard-search"
                                                    label="Search"
                                                    sx={{ width: "200px" }}
                                                    variant="standard"
                                                    name="partnershipWithdraw_search"
                                                    value={info.partnershipWithdraw_search}
                                                    onChange={input1}
                                                />
                                            </div>
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                progressPending={loading}
                                                onSort={handleSort}
                                                sortServer
                                                pagination
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
                                                highlightOnHover
                                                pointerOnHover
                                            />
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`partnershipCommisions ${openCollapse.partnershipCommisions ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='partnershipCommisions CollapseHeadingTitle'>
                                            <span className="partnershipCommisions material-icons">
                                                file_upload
                                            </span>
                                            Partnership Commisions
                                        </div>
                                        <div className='partnershipCommisions collapseActionSection'>
                                            <span className='partnershipCommisions boldFont'>$0.00</span>
                                            <span className="partnershipCommisions sidebar-icon-indicator">
                                                {openCollapse.partnershipCommisions ? <span className="partnershipCommisions material-icons">
                                                    expand_more
                                                </span> : <span className="partnershipCommisions material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.partnershipCommisions} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date"></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" ></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={age}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="All">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter" >
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <CommonTable url={`${Url}/datatable/admin_partnership_commissions_list.php`} column={partnershipCommisionColumn} sort='1' />
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`copyTradingCommision ${openCollapse.copyTradingCommision ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='copyTradingCommision CollapseHeadingTitle'>
                                            <span className="copyTradingCommision material-icons">
                                                file_upload
                                            </span>
                                            Copy Trading Commisions
                                        </div>
                                        <div className='copyTradingCommision collapseActionSection'>
                                            <span className='copyTradingCommision boldFont'>$0.00</span>
                                            <span className="copyTradingCommision sidebar-icon-indicator">
                                                {openCollapse.copyTradingCommision ? <span className="copyTradingCommision material-icons">
                                                    expand_more
                                                </span> : <span className="copyTradingCommision material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.copyTradingCommision} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date"></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" ></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={age}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="All">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter" >
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            <div className='tableSearchField'>
                                                <CssTextField
                                                    id="standard-search"
                                                    label="Search"
                                                    sx={{ width: "200px" }}
                                                    variant="standard"
                                                    name="copyTradingCommision_search"
                                                    value={info.copyTradingCommision_search}
                                                    onChange={input1}
                                                />
                                            </div>
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                progressPending={loading}
                                                onSort={handleSort}
                                                sortServer
                                                pagination
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
                                                highlightOnHover
                                                pointerOnHover
                                            />
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`ticket ${openCollapse.ticket ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='ticket CollapseHeadingTitle'>
                                            <span className="ticket material-icons">
                                                receipt_long
                                            </span>
                                            Ticket
                                        </div>
                                        <div className='ticket collapseActionSection'>
                                            <span className='ticket boldFont'>0</span>
                                            <span className="ticket sidebar-icon-indicator">
                                                {openCollapse.ticket ? <span className="ticket material-icons">
                                                    expand_more
                                                </span> : <span className="ticket material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.ticket} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <Grid container spacing={2}>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            From
                                                        </label>
                                                        <BootstrapInput type="date"></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            To
                                                        </label>
                                                        <BootstrapInput type="date" ></BootstrapInput>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={6} md={3}>
                                                    <FormControl fullWidth={true}>
                                                        <label className="small font-weight-bold text-dark">
                                                            Status
                                                        </label>
                                                        <Select
                                                            value={age}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "Without label" }}
                                                            input={<BootstrapInput />}
                                                        >
                                                            <MenuItem value="All">All</MenuItem>
                                                            <MenuItem value="pending">Pending</MenuItem>
                                                            <MenuItem value="approved">Approved</MenuItem>
                                                            <MenuItem value="rejected">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} md={1}>
                                                    <ColorButton className="d-block ml-auto mb-3 mr-3 btn-filter" >
                                                        Filter
                                                    </ColorButton>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            {/* <div className='tableSearchField'>
                                                <CssTextField
                                                    id="standard-search"
                                                    label="Search"
                                                    sx={{ width: "200px" }}
                                                    variant="standard"
                                                    name="ticket_search"
                                                    value={info.ticket_search}
                                                    onChange={input1}
                                                />
                                            </div> */}
                                            {/* <DataTable
                                                columns={columns}
                                                data={data}
                                                progressPending={loading}
                                                onSort={handleSort}
                                                sortServer
                                                pagination
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
                                                highlightOnHover
                                                pointerOnHover
                                            /> */}
                                            <CommonTable url={`${Url}/datatable/ticket_list.php`} column={ticketColumn} sort='5'/>
                                        </div>
                                    </Collapse>
                                </Paper>
                                <br />
                                <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <a className={`activityLog ${openCollapse.activityLog ? "active" : ""} CollapseSection`} onClick={handleCollapseClick}>
                                        <div className='activityLog CollapseHeadingTitle'>
                                            <span className="activityLog material-icons">
                                                list_alt
                                            </span>
                                            Activity Log
                                        </div>
                                        <div className='activityLog collapseActionSection'>
                                            <span className="activityLog sidebar-icon-indicator">
                                                {openCollapse.activityLog ? <span className="activityLog material-icons">
                                                    expand_more
                                                </span> : <span className="activityLog material-icons">
                                                    expand_less
                                                </span>}
                                            </span>
                                        </div>
                                    </a>
                                    <Collapse in={openCollapse.activityLog} timeout="auto" unmountOnExit>
                                        <div className='Collapse-body-section'>
                                            <CommonTable url={`${Url}/datatable/activity_log_list.php`} column={activityColumn} sort='2' />
                                        </div>
                                    </Collapse>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Master