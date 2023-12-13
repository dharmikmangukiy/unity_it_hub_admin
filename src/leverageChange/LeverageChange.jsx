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
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import CustomImageModal from "../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import NewDate from "../common/NewDate";

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

const LeverageChange = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [dialogTitle, setDialogTitle] = useState("");
  const [accountOption, setAccountOption] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({});
  const [checkStatus, setcheckStatus] = useState("");
  const [buttonDis, setButttonDis] = useState();
  const [resData, setResData] = useState({});
  const [Form, setForm] = useState({
    account_type: "",
    account: "",
    customer_name: "",
    payment_gateway: "",
    amount: "",
    currency_code: "",
    note: "",
    user_id: "",
    isLoader: false,
  });
  const [viewWithdrawForm, setviewWithdrawForm] = useState({
    date: "",
    name: "",
    email: "",
    phone: "",
    amount: "",
    leverage: "",
    remark: "",
    admin_notes: "",
    status: "",
    withdrawal_id: "",
    isLoader: false,
  });
  const [input1infoTrue, setinput1infoTrue] = useState({
    amount: false,
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "email",
      value: false,
      name: "email",
    },
    {
      label: "MT5",
      value: false,
      name: "mt5_acc_no",
    },
    {
      label: "leverage",
      value: false,
      name: "leverage",
    },
    {
      label: "admin remarks",
      value: false,
      name: "admin_remarks",
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
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            <NewDate newDate={row.added_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "MT5",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "leverage",
      selector: (row) => {
        return <span title={row.leverage}>{row.leverage}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.status == "1"
                ? "status-text-approved"
                : row.status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.status == "1"
                ? "Approved"
                : row.status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.status == "1"
              ? "Approved"
              : row.status == "2"
              ? "Rejected"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "REMARKS",
      selector: (row) => {
        return <span title={row.admin_remarks}>{row.admin_remarks}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "updated date",
      selector: (row) => {
        return (
          <span title={row.updated_datetime}>
            {row.updated_datetime == "" ? (
              ""
            ) : (
              <NewDate newDate={row.updated_datetime} />
            )}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            {" "}
            <Button
              id={`actionButton_${row.requests_id}`}
              aria-controls={open ? `basic-menu-${row.requests_id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleContextClick(event, row.requests_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.requests_id}`}
              anchorEl={openTableMenus[row.requests_id]}
              open={Boolean(openTableMenus[row.requests_id])}
              onClose={(event) => handleContextClose(row.requests_id)}
            >
              <div>
                <MenuItem
                  className="view"
                  {...row}
                  onClick={(event) => viewWithdrawl(row)}
                >
                  <i className="material-icons">receipt</i>
                  &nbsp;&nbsp;View
                </MenuItem>
                {row.status == "1" || row.status == "2" ? (
                  ""
                ) : (
                  <>
                    <MenuItem
                      className="approve"
                      {...row}
                      onClick={(event) =>
                        actionMenuPopup(event, row.requests_id, "approve")
                      }
                    >
                      <i className="material-icons font-color-approved">
                        task_alt
                      </i>
                      &nbsp;&nbsp;Approved
                    </MenuItem>

                    <MenuItem
                      className="reject"
                      {...row}
                      onClick={(event) =>
                        actionMenuPopup(event, row.requests_id, "reject")
                      }
                    >
                      <i className="material-icons font-color-rejected">
                        cancel
                      </i>
                      &nbsp;&nbsp;Rejected
                    </MenuItem>
                  </>
                )}
              </div>
            </Menu>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
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
    if (dialogTitle == "Reject") {
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
    } else if (dialogTitle == "Update Leverage Request") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {buttonDis == "0" ? (
            viewWithdrawForm.isLoader == true ? (
              <Button
                variant="contained"
                className="btn-gradient btn-success"
                disabled
              >
                <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
              </Button>
            ) : (
              <Button
                variant="contained"
                className="btn-gradient btn-success"
                onClick={submitUpdate}
              >
                Update
              </Button>
            )
          ) : (
            ""
          )}
          {/* {(viewWithdrawForm.isLoader == true) ? <Button variant="contained" className='btn-gradient btn-success' disabled><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></Button> : <Button variant="contained" className='btn-gradient btn-success' onClick={submitUpdate}>Update</Button>} */}
        </div>
      );
    }
  };

  const manageContent = () => {
    if (dialogTitle == "Update Leverage Request") {
      return (
        <div>
          <div className="view-commission-content-section">
            <div className="view-content-element">
              <h6 className="element-title">Name</h6>
              <div className=" element-content">{viewWithdrawForm.name}</div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Email</h6>
              <div className=" element-content">{viewWithdrawForm.email}</div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">MT5</h6>
              <div className=" element-content">
                {viewWithdrawForm.mt5_acc_no}
              </div>
            </div>

            <div className="view-content-element">
              <h6 className="element-title">Date</h6>
              <div className=" element-content">
                <NewDate newDate={viewWithdrawForm.added_datetime} />
              </div>
            </div>
            {viewWithdrawForm.modified_by_name ? (
              <div className="view-content-element">
                <h6 className="element-title">Modified By Name</h6>
                <div className=" element-content">
                  {viewWithdrawForm.modified_by_name}
                </div>
              </div>
            ) : (
              ""
            )}

            {viewWithdrawForm.update_datetime ? (
              <div className="view-content-element">
                <h6 className="element-title">Update Date</h6>
                <div className=" element-content">
                  <NewDate newDate={viewWithdrawForm.update_datetime} />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="divider" style={{ margin: "7px 0px" }}></div>
          <TextField
            id="standard-basic"
            label="Remark"
            variant="standard"
            sx={{ width: "100%" }}
            name="admin_remarks"
            value={viewWithdrawForm.admin_remarks}
            onChange={input1}
            focused
            disabled={buttonDis == 1 ? true : false}
          />
          <br />
          <br />
          <div className="update-withdraw-request-section">
            {/* <TextField id="standard-basic" label="Status" variant="standard" sx={{ width: '100%' }} name='customer_name' value={viewWithdrawForm.status} onChange={input1} focused/> */}
            <FormControl variant="standard" sx={{ width: "100%" }} focused>
              <InputLabel>Leverage</InputLabel>
              <Select
                value={viewWithdrawForm.leverage}
                name="leverage"
                onChange={input1}
                disabled={buttonDis == 1 ? true : false}
              >
                {resData.leverages.map((item, index) => {
                  return (
                    <MenuItem value={item.leverage_data}>
                      {item.leverage_data}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ width: "100%" }} focused>
              <InputLabel>Status</InputLabel>
              <Select
                value={viewWithdrawForm.status}
                name="status"
                onChange={input1}
                disabled={buttonDis == 1 ? true : false}
              >
                <MenuItem value="0">Pending</MenuItem>
                <MenuItem value="1">Approve</MenuItem>
                <MenuItem value="2">Reject</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Reject") {
      return (
        <div>
          <div className="withdrawal-action-popup-text">
            <label>Are you want to sure reject this withdrawal ?</label>
          </div>
        </div>
      );
    } else if (dialogTitle == "Approve") {
      return (
        <div>
          <div className="withdrawal-action-popup-text">
            <label>Are you want to sure approve this withdrawal ?</label>
          </div>
        </div>
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (e) => {
    setForm({
      account_type: "",
      account: "",
      customer_name: "",
      payment_gateway: "",
      amount: "",
      currency_code: "",
      note: "",
      user_id: "",
      isLoader: false,
    });
    setDialogTitle("Add New Withdrawal");
    setOpen(true);
  };

  const actionMenuPopup = (e, index, flagALL) => {
    handleContextClose(index);
    if (flagALL == "reject") {
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
                  id="loder"
                  variant="contained"
                  className="btn-gradient btn-danger"
                  onClick={() => {
                    handleAction(index, "reject", onClose);
                  }}
                >
                  Yes, Reject it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (flagALL == "approve") {
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
                  id="loder"
                  variant="contained"
                  className="btn-gradient btn-success"
                  onClick={() => {
                    handleAction(index, "approve", onClose);
                  }}
                >
                  Yes, Approve it!
                </Button>
              </div>
            </div>
          );
        },
      });
    }
  };

  const input = (event) => {
    const { name, value } = event.target;
    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const input1 = (event) => {
    const { name, value } = event.target;
    setviewWithdrawForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const input1trueFalse = (event) => {
    var { name, value } = event.target;
    setinput1infoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const fetchAccount = async (event, search) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("search", search);
    param.append("type", Form.account_type);
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

  const submitForm = async () => {
    if (Form.account_type == "") {
      toast.error("Please select account type");
    } else if (Form.account == "") {
      toast.error("Please enter account");
    } else if (Form.customer_name == "") {
      toast.error("Please enter customer name");
    } else if (Form.payment_gateway == "") {
      toast.error("Please select any one payment gateway");
    } else if (Form.amount == "") {
      toast.error("Please enter amount");
    } else if (Form.currency_code == "") {
      toast.error("Please select currency code");
    } else if (Form.note == "") {
      toast.error("Please enter note");
    } else {
      Form.isLoader = true;
      setForm({ ...Form });
      const param = new FormData();
      param.append("action", "add_withdraw");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", Form.account);
      param.append("account_type", Form.account_type);
      param.append("payment_method", Form.payment_gateway);
      param.append("amount", Form.amount);
      param.append("currency", Form.currency_code);
      param.append("note", Form.note);
      await axios
        .post(`${Url}/ajaxfiles/user_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          // setLoader(false);
          Form.isLoader = false;
          setForm({ ...Form });
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

  const submitUpdate = async () => {
    if (viewWithdrawForm.status == "") {
      toast.error("Please select status");
    } else {
      viewWithdrawForm.isLoader = true;
      setviewWithdrawForm({ ...viewWithdrawForm });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("request_id", viewWithdrawForm.requests_id);
      param.append("status", viewWithdrawForm.status);
      param.append("admin_remarks", viewWithdrawForm.admin_remarks);
      param.append("leverage", viewWithdrawForm.leverage);
      param.append("action", "update_leverage_request");

      await axios
        .post(`${Url}/ajaxfiles/leverage_change_request_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          viewWithdrawForm.isLoader = false;
          setviewWithdrawForm({ ...viewWithdrawForm });
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

  const handleAction = async (id, flag, onClose) => {
    const param = new FormData();
    document.getElementById("loder").classList.add("MyClassLoder");
    var button = document.getElementById("loder");

    // Disable the button
    button.disabled = true;
    button.innerHTML = ` <svg class="spinner" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>`;
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    if (flag == "approve") {
      param.append("action", "approve_leverage_requests");
    } else {
      param.append("action", "reject_leverage_requests");
    }
    param.append("request_id", id);
    await axios
      .post(`${Url}/ajaxfiles/leverage_change_request_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          document.getElementById("loder").classList.remove("MyClassLoder");
          var button = document.getElementById("loder");

          // Disable the button
          button.disabled = false;
          button.innerHTML =
            flag == "approve" ? "Yes, Approve it!" : `Yes, Reject it!`;
          toast.error(res.data.message);
        } else {
          onClose();
          setRefresh(!refresh);
          toast.success(res.data.message);
        }
      });
  };

  const viewWithdrawl = async (id) => {
    handleContextClose(id.requests_id);
    if (id.status == "1" || id.status == "2") {
      setButttonDis("1");
    } else {
      setButttonDis("0");
    }
    setviewWithdrawForm(id);
    setDialogTitle("Update Leverage Request");
    setOpen(true);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Leverage Change Requests</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  setcheckStatus={setcheckStatus}
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />
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
                          url={`${Url}/datatable/mt5_leverage_change_requests.php`}
                          column={columns}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          checkStatus={checkStatus}
                          setResData={setResData}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
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

export default LeverageChange;
