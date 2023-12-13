import "./ibcommisions.css";
import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../../common/CustomElement";
import { Button } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from "axios";
import "./ibcommisions.css";
import CommonFilter from "../../common/CommonFilter";
import CommonTable from "../../common/CommonTable";
import CustomImageModal from "../../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../../global.js";
import { useNavigate } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {/* {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null} */}
    </DialogTitle>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    // borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 8px 10px",
    // transition: theme.transitions.create(["border-color", "box-shadow"]),
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
      // borderRadius: 9,
      borderColor: "#80bdff",
    },
  },
}));

const IBCommisions = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [resData, setResData] = useState({});
  const [param, setParam] = useState({});
  const [userList, setUserList] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [preview, setPreview] = useState();

  const [refresh, setRefresh] = useState(false);
  const [accountOption, setAccountOption] = useState([]);
  const [depositForm, setDepositForm] = useState({
    live_account: "",
    account: "",
    deposit_to: "",
    customer_name: "",
    payment_gateway: "",
    amount: "",
    file: "",
    note: "",
    currency_code: "",
    isLoader: false,
    transation_id: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "IB GROUP ID",
      value: false,
      name: "ib_group_id",
    },
    {
      label: "TRADE NO",
      value: false,
      name: "trade_no",
    },
    {
      label: "SYMBOL",
      value: false,
      name: "trade_symbol",
    },
    {
      label: "TYPE",
      value: false,
      name: "trade_type",
    },
    {
      label: "CLOSE PRICE",
      value: false,
      name: "trade_close_price",
    },
    {
      label: "VOLUME",
      value: false,
      name: "trade_volume",
    },
    {
      label: "IB COMISSION AMOUNT",
      value: false,
      name: "ib_comission_amount",
    },
  ]);
  toast.configure();

  const columns = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      //  wrap: true,
      grow: 0.1,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "IB GROUP",
      selector: (row) => {
        return <span title={row.ib_group_id}>{row.ib_group_id}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      //  wrap: true,
    },
    {
      name: "TRADE NO",
      selector: (row) => {
        return <span title={row.trade_no}>{row.trade_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      //  wrap: true,
    },
    {
      name: "SYMBOL",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
      //   wrap: true,
    },
    {
      name: "TYPE",
      selector: (row) => {
        return <span title={row.trade_type}>{row.trade_type}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
      // wrap: true,
    },
    {
      name: "CLOSE PRICE",
      selector: (row) => {
        return (
          <span title={row.trade_close_price}>{row.trade_close_price}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      //  wrap: true,
    },
    {
      name: "CLOSE TIME",
      selector: (row) => {
        return <span title={row.close_time}>{row.close_time}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      //  wrap: true,
    },
    {
      name: "VOLUME",
      selector: (row) => {
        return <span title={row.trade_close_price}>{row.trade_volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      // wrap: true,
    },
    {
      name: "IB COMISSION AMOUNT",
      selector: (row) => {
        return (
          <span title={row.ib_comission_amount}>{row.ib_comission_amount}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
  ];

  const handleContextClick = (event, index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = event.currentTarget;
    setOpenTableMenus(tableMenus);
  };

  const handleContextClose = (index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = null;
    setOpenTableMenus(tableMenus);
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add New Deposit") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {/* {(depositForm.isLoader == true) ? <Button variant="contained" className='btn-gradient btn-success' disabled><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></Button> : <Button variant="contained" className='btn-gradient btn-success' onClick={depositFormSubmit}>Add</Button>}
           */}
        </div>
      );
    } else if (dialogTitle == "Reject") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained" className="btn-gradient btn-danger">
            Reject
          </Button>
        </div>
      );
    } else if (dialogTitle == "Approve") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained" className="btn-gradient btn-success">
            Approve
          </Button>
        </div>
      );
    }
  };

  const depositFormSubmit = async () => {
    if (depositForm.live_account == "") {
      toast.error("Please select account type");
    } else if (depositForm.account == "") {
      toast.error("Please select account");
    } else if (depositForm.customer_name == "") {
      toast.error("Please enter customer name");
    } else if (depositForm.deposit_to == "") {
      toast.error("Please select deposit to");
    } else if (depositForm.payment_gateway == "") {
      toast.error("Please select payment gateway option");
    } else if (depositForm.transation_id == "") {
      toast.error("Please enter transaction id");
    } else if (depositForm.amount == "") {
      toast.error("Please enter amount");
    } else if (depositForm.currency_code == "") {
      toast.error("Please select currency code");
    } else if (depositForm.note == "") {
      toast.error("Please enter note");
    } else {
      depositForm.isLoader = true;
      setDepositForm({ ...depositForm });
      const param = new FormData();
      param.append("action", "add_deposit");
      if (IsApprove != "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("user_id", depositForm.account);
      param.append("deposit_to", depositForm.deposit_to);
      param.append("payment_method", depositForm.payment_gateway);
      param.append("transactionid", depositForm.transation_id);
      param.append("amount", depositForm.amount);
      param.append("currency", depositForm.currency_code);
      param.append("note", depositForm.note);
      await axios
        .post(`${Url}/ajaxfiles/user_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          depositForm.isLoader = false;
          setDepositForm({ ...depositForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setRefresh(!refresh);
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const manageContent = () => {
    if (dialogTitle == "Add New Deposit") {
      return (
        <div>
          <div>
            {/* <TextField id="standard-basic" label="Live Account" variant="standard" sx={{ width: '100%' }} name='live_account' value={depositForm.live_account} onChange={input} /> */}
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Account Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                label="Account"
                name="live_account"
                onChange={input}
              >
                <MenuItem value="live">Live</MenuItem>
                <MenuItem value="demo">Demo</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />
          <div className="margeField">
            <Autocomplete
              disablePortal
              options={accountOption}
              getOptionLabel={(option) =>
                option ? option.mt_live_account_id : ""
              }
              onInputChange={(event, newInputValue) => {
                fetchAccount(event, newInputValue);
              }}
              onChange={(event, newValue) => {
                // setValue(newValue);
                setDepositForm((prevalue) => {
                  return {
                    ...prevalue,
                    customer_name:
                      newValue != null
                        ? newValue["user_first_name"] +
                          " " +
                          newValue["user_last_name"]
                        : "",
                    account: newValue != null ? newValue["user_id"] : "",
                  };
                });
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Account" variant="standard" />
              )}
            />
            <TextField
              id="standard-basic"
              label="Customer Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="customer_name"
              value={depositForm.customer_name}
              onChange={input}
            />
          </div>
          <br />
          {/* <div>
                    <FormControl variant="standard" sx={{ width: '100%' }}>
                        <InputLabel id="demo-simple-select-standard-label">Account</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            name='account'
                            label="Account"
                            onChange={input}>
                            <MenuItem value='1321321'>1321321</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <br /> */}
          <div className="margeField">
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Deposit To
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                name="deposit_to"
                label="Deposit To"
                onChange={input}
              >
                <MenuItem value="Wallet">Wallet</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Payment Gateway
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                name="payment_gateway"
                label="Payment Gateway"
                onChange={input}
              >
                <MenuItem value="BANK">BANK</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />
          <div>
            <TextField
              id="standard-basic"
              label="Transation ID"
              variant="standard"
              sx={{ width: "100%" }}
              name="transation_id"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeField">
            <TextField
              id="standard-basic"
              label="Amount"
              variant="standard"
              sx={{ width: "100%" }}
              name="amount"
              value={depositForm.amount}
              onChange={input}
            />
            <label htmlFor="contained-button-file" className="fileuploadButton">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={onSelectFile}
              />
              {selectedFile ? (
                <img src={preview} className="deposit-upload-image-preview" />
              ) : (
                <Button variant="contained" component="span">
                  <i className="material-icons">backup</i>&nbsp;Upload
                </Button>
              )}
            </label>
          </div>
          <br />
          <div className="margeField">
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Currenct Code
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                label="Currenct Code"
                name="currency_code"
                onChange={input}
              >
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="standard-textarea"
              label="Notes"
              multiline
              variant="standard"
              sx={{ width: "100%" }}
              name="note"
              value={depositForm.note}
              onChange={input}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "View") {
      return <div></div>;
    } else if (dialogTitle == "Reject") {
      return (
        <div>
          <div className="deposit-action-popup-text">
            <label>Are you want to sure reject this deposit ?</label>
          </div>
        </div>
      );
    } else if (dialogTitle == "Approve") {
      return (
        <div>
          <div className="deposit-action-popup-text">
            <label>Are you want to sure approve this deposit ?</label>
          </div>
        </div>
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (e) => {
    setSelectedFile(undefined);
    setDepositForm({
      live_account: "",
      account: "",
      customer_name: "",
      payment_gateway: "",
      amount: "",
      file: "",
      note: "",
      currency_code: "",
      deposit_to: "",
      isLoader: false,
      transation_id: "",
    });
    setDialogTitle("Add New Deposit");
    setOpen(true);
  };

  const actionMenuPopup = (e, index) => {
    handleContextClose(index);
    if (e.target.classList.contains("reject")) {
      setDialogTitle("Reject");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to reject this?</p>
              <div className="confirmation-alert-action-button">
                <Button
                  variant="contained"
                  className="cancelButton"
                  onClick={onClose}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  className="btn-gradient btn-danger"
                  onClick={() => {
                    handleClickReject();
                    onClose();
                  }}
                >
                  Yes, Reject it!
                </Button>
              </div>
            </div>
          );
        },
      });
      /* confirmAlert({
                title: 'Reject',
                message: 'Are you sure to do this ?',
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => alert('Click Yes')
                  },
                  {
                    label: 'No',
                    onClick: () => alert('Click No')
                  }
                ]
              }); */
    } else if (e.target.classList.contains("approve")) {
      setDialogTitle("Approve");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to approve this?</p>
              <div className="confirmation-alert-action-button">
                <Button
                  variant="contained"
                  className="cancelButton"
                  onClick={onClose}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  className="btn-gradient btn-success"
                  onClick={() => {
                    handleClickapprove();
                    onClose();
                  }}
                >
                  Yes, Approve it!
                </Button>
              </div>
            </div>
          );
        },
      });
      /* confirmAlert({
                title: 'Approve',
                message: 'Are you sure to do this ?',
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => alert('Click Yes')
                  },
                  {
                    label: 'No',
                    onClick: () => alert('Click No')
                  }
                ]
              }); */
    }

    // setOpen(true);
  };

  const handleClickapprove = () => {
    toast.success("Deposit has been approved successfully.");
  };

  const handleClickReject = () => {
    toast.success("Deposit has been rejected successfully.");
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (resData.all_commission_users) {
      setUserList([...resData.all_commission_users]);
    }
  }, [resData]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setDepositForm({ ...depositForm, file: e.target.files[0] });
    setSelectedFile(e.target.files[0]);
  };

  const input = (event) => {
    const { name, value } = event.target;
    setDepositForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const tableRefresh = () => {
    var status = refresh ? false : true;
    setRefresh(status);
  };

  const fetchAccount = async (event, search) => {
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("search", search);
    param.append("type", depositForm.live_account);
    await axios
      .post(`${Url}/ajaxfiles/fetch_user_account.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setAccountOption(res.data.data);
        }
      });
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Admin IB Commissions</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  userlist={userList}
                  setParam={setParam}
                />
                <br />
                {/* <Paper elevation={2} style={{ borderRadius: "10px" }}>
                                    <div className="card-header font-weight-bold text-dark border-bottom py-2">
                                        Filter Criteria
                                    </div>
                                    <CardContent className="py-3">
                                        <Grid container spacing={2}>
                                            <Grid item sm={6} md={3}>
                                                <FormControl fullWidth={true}>
                                                    <label className="small font-weight-bold text-dark">
                                                        Transaction Type
                                                    </label>
                                                    <Select
                                                        value={age}
                                                        onChange={handleChange}
                                                        displayEmpty
                                                        inputProps={{ "aria-label": "Without label" }}
                                                        input={<BootstrapInput />}
                                                    >
                                                        <MenuItem value="All">All</MenuItem>

                                                        <MenuItem value="deposit">Deposit</MenuItem>
                                                        <MenuItem value="withdrawal">Withdrawal</MenuItem>
                                                        <MenuItem value="internal_transfer">
                                                            Internal Transfer
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={6} md={3}>
                                                <FormControl fullWidth={true}>
                                                    <label className="small font-weight-bold text-dark">
                                                        Trading Account
                                                    </label>
                                                    <Select
                                                        value={age}
                                                        onChange={handleChange}
                                                        displayEmpty
                                                        inputProps={{ "aria-label": "Without label" }}
                                                        input={<BootstrapInput />}
                                                    >
                                                        <MenuItem value="All">All</MenuItem>
                                                        <MenuItem value="deposit">19861</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={6} md={3}>
                                                <FormControl fullWidth={true}>
                                                    <label className="small font-weight-bold text-dark">
                                                        Date From
                                                    </label>
                                                    <BootstrapInput type="date"></BootstrapInput>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={6} md={3}>
                                                <FormControl fullWidth={true}>
                                                    <label className="small font-weight-bold text-dark">
                                                        Date To
                                                    </label>
                                                    <BootstrapInput type="date" ></BootstrapInput>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item sm={12} md={12}>
                                                <div className="filter-submit">
                                                    <ColorButton className=" d-block ml-auto mb-3 mr-3 ">
                                                        Sumbit
                                                    </ColorButton>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Paper>
                                <br /> */}
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" onClick={handleClickOpen}>Add</Button>
                                    </div>
                                    <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/admin_ib_commission_list.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          searchWord={searchKeyword}
                          setResData={setResData}
                          param={param}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid container>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.total_amount}</h5>
                              <p className="no-margin">Total Amount</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_ib_comission_amount_footer}
                              </h5>
                              <p className="no-margin">Comission Amount</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_trade_volume_footer}
                              </h5>
                              <p className="no-margin">Total Lot</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.total_lot}</h5>
                              <p className="no-margin">Lot</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                  fullWidth={fullWidth}
                  maxWidth={maxWidth}
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    {dialogTitle}
                  </BootstrapDialogTitle>
                  <DialogContent dividers>{manageContent()}</DialogContent>
                  <DialogActions>{manageDialogActionButton()}</DialogActions>
                </BootstrapDialog>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBCommisions;
