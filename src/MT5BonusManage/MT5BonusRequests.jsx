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
import DataTable from "react-data-table-component";
import axios from "axios";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import CustomImageModal from "../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
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

const MT5BonusRequests = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [dialogTitle, setDialogTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [refresh, setRefresh] = useState(false);
  const [accountOption, setAccountOption] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [checkStatus, setcheckStatus] = useState("");
  const [resData, setResData] = useState({});
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
      label: "Account",
      value: false,
      name: "mt5_acc_no",
    },
    {
      label: "bonus percentage",
      value: false,
      name: "mt5_bonus_percentage",
    },
    {
      label: "transfer amount",
      value: false,
      name: "transfer_amount",
    },
    {
      label: "transfer bonus amount",
      value: false,
      name: "transfer_bonus_amount",
    },
    {
      label: "AMOUNT",
      value: false,
      name: "amount",
    },
    {
      label: "REMARK",
      value: false,
      name: "deposit_remarks",
    },
  ]);
  const [viewDepositForm, setviewDepositForm] = useState({
    date: "",
    name: "",
    email: "",
    modified_by_name: "",
    mt5_acc_no: "",
    mt5_bonus_percentage: "",
    transfer_amount: "",
    transfer_bonus_amount: "",
    remark: "",
    status: "",
    mt5_bonus_id: "",
    isLoader: false,
  });
  const [storeDepositData, setStoreDepositData] = useState({
    status: "",
    isLoader: true,
  });
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
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
          <span title={row.date}>
            <NewDate newDate={row.date} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "bonus percentage",
      selector: (row) => {
        return (
          <span title={row.mt5_bonus_percentage}>
            {row.mt5_bonus_percentage}%
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "Account",
      selector: "mt5_acc_no",
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "transfer amount",
      selector: "transfer_amount",
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "transfer bonus amount",
      selector: (row) => {
        return <span title={row.transfer_amount}>{row.transfer_amount}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "remarks",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.claim_status == "1"
                ? "status-text-approved"
                : row.claim_status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.claim_status == "1"
                ? "Approved"
                : row.claim_status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.claim_status == "1"
              ? "Approved"
              : row.claim_status == "2"
              ? "Rejected"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
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
            {prop.permission.view_mt5_bonus_request == 1 ||
            prop.permission.approve_mt5_bonus_request == 1 ||
            prop.permission.reject_mt5_bonus_request == 1 ||
            prop.permission.update_mt5_bonus_offer == 1 ? (
              <>
                <Button
                  id={`actionButton_${row.mt5_bonus_id}`}
                  aria-controls={
                    open ? `basic-menu-${row.mt5_bonus_id}` : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(event) =>
                    handleContextClick(event, row.mt5_bonus_id)
                  }
                  {...row}
                  style={{ color: "rgb(144 145 139)" }}
                >
                  <i className="material-icons">more_horiz</i>
                </Button>
                <Menu
                  id={`basic-menu-${row.mt5_bonus_id}`}
                  anchorEl={openTableMenus[row.mt5_bonus_id]}
                  open={Boolean(openTableMenus[row.mt5_bonus_id])}
                  onClose={(event) => handleContextClose(row.mt5_bonus_id)}
                >
                  {row.claim_status != "0" ? (
                    <>
                      {prop.permission.view_mt5_bonus_request == 1 ||
                      prop.permission.update_mt5_bonus_offer == 1 ? (
                        <MenuItem
                          className="view"
                          {...row}
                          onClick={(event) => viewDeposit(row)}
                        >
                          <i className="material-icons">receipt</i>
                          &nbsp;&nbsp;View
                        </MenuItem>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <div>
                      {prop.permission.view_mt5_bonus_request == 1 ||
                      prop.permission.update_mt5_bonus_offer == 1 ? (
                        <MenuItem
                          className="view"
                          {...row}
                          onClick={(event) => viewDeposit(row)}
                        >
                          <i className="material-icons">receipt</i>
                          &nbsp;&nbsp;View
                        </MenuItem>
                      ) : (
                        ""
                      )}
                      {prop.permission.approve_mt5_bonus_request == 1 ? (
                        <MenuItem
                          className="approve"
                          {...row}
                          onClick={(event) =>
                            actionMenuPopup(event, row.mt5_bonus_id, "approve")
                          }
                        >
                          <i className="material-icons font-color-approved">
                            task_alt
                          </i>
                          &nbsp;&nbsp;Approved
                        </MenuItem>
                      ) : (
                        ""
                      )}
                      {prop.permission.reject_mt5_bonus_request == 1 ? (
                        <MenuItem
                          className="reject"
                          {...row}
                          onClick={(event) =>
                            actionMenuPopup(event, row.mt5_bonus_id, "reject")
                          }
                        >
                          <i className="material-icons font-color-rejected">
                            cancel
                          </i>
                          &nbsp;&nbsp;Rejected
                        </MenuItem>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </Menu>
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  const footer = {
    amount: "das",
  };

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
    } else if (dialogTitle == "Update Mt5 Bonus Request") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {storeDepositData.status == "0" &&
          prop.permission.update_mt5_bonus_offer == 1 ? (
            viewDepositForm.isLoader == true ? (
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
          {/* {(viewDepositForm.isLoader == true) ? <Button variant="contained" className='btn-gradient btn-success' disabled><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></Button> : <Button variant="contained" className='btn-gradient btn-success' onClick={submitUpdate}>Update</Button>} */}
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
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
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

  const submitUpdate = async () => {
    if (viewDepositForm.transfer_bonus_amount == "") {
      toast.error("Please enter bonus amount");
    } else if (viewDepositForm.remark == "") {
      toast.error("Please enter remark");
    } else {
      viewDepositForm.isLoader = true;
      setviewDepositForm({ ...viewDepositForm });
      const param = new FormData();
      param.append("action", "update_mt5_bonus_request");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("mt5_bonus_id", viewDepositForm.mt5_bonus_id);
      param.append(
        "transfer_bonus_amount",
        viewDepositForm.transfer_bonus_amount
      );
      param.append("remarks", viewDepositForm.remark);
      param.append("claim_status", viewDepositForm.status);
      await axios
        .post(`${Url}/ajaxfiles/mt5_bonus_request_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          viewDepositForm.isLoader = false;
          setviewDepositForm({ ...viewDepositForm });
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
    if (dialogTitle == "View") {
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
    } else if (dialogTitle == "Update Mt5 Bonus Request") {
      if (storeDepositData.isLoader) {
        return (
          <div className="popup-loader">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle
                class="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke-width="5"
              ></circle>
            </svg>
          </div>
        );
      } else {
        return (
          <div>
            <div className="update-withdraw-request-section">
              <TextField
                label="Date"
                variant="standard"
                sx={{ width: "100%" }}
                name="date"
                value={viewDepositForm.date}
                onChange={input1}
                focused
                disabled
              />
              <TextField
                label="Name"
                variant="standard"
                sx={{ width: "100%" }}
                name="name"
                value={viewDepositForm.name}
                onChange={input1}
                focused
                disabled
              />
              <TextField
                label="Email"
                variant="standard"
                sx={{ width: "100%" }}
                name="email"
                value={viewDepositForm.email}
                onChange={input1}
                focused
                disabled
              />
            </div>
            <br />
            <div className="update-withdraw-request-section">
              <TextField
                label="Update BY"
                variant="standard"
                sx={{ width: "100%" }}
                name="modified_by_name"
                value={viewDepositForm.modified_by_name}
                onChange={input1}
                focused
                disabled
              />
              <TextField
                label="Bonus Percentage"
                variant="standard"
                sx={{ width: "100%" }}
                name="mt5_bonus_percentage"
                value={`${viewDepositForm.mt5_bonus_percentage}%`}
                onChange={input1}
                focused
                disabled
              />
              <TextField
                label="Bonus Amount"
                variant="standard"
                sx={{ width: "100%" }}
                name="transfer_bonus_amount"
                value={viewDepositForm.transfer_bonus_amount}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    input1(e);
                  }
                }}
                focused
                disabled={
                  storeDepositData.status == "0" &&
                  prop.permission.update_mt5_bonus_offer == 1
                    ? false
                    : true
                }
              />
            </div>
            <br />
            <div className="update-withdraw-request-section">
              <TextField
                label="Remark"
                variant="standard"
                sx={{ width: "100%" }}
                name="remark"
                value={viewDepositForm.remark}
                onChange={input1}
                focused
                disabled={
                  storeDepositData.status == "0" &&
                  prop.permission.update_mt5_bonus_offer == 1
                    ? false
                    : true
                }
              />
              {/* <TextField label="Status" variant="standard" sx={{ width: '100%' }} name='customer_name' value={viewDepositForm.status} onChange={input1} focused/> */}
              <FormControl variant="standard" sx={{ width: "100%" }} focused>
                <InputLabel>Status</InputLabel>
                <Select
                  value={viewDepositForm.status}
                  name="status"
                  onChange={input1}
                  disabled={
                    storeDepositData.status == "0" &&
                    prop.permission.update_mt5_bonus_offer == 1
                      ? false
                      : true
                  }
                >
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Approve</MenuItem>
                  <MenuItem value="2">Reject</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        );
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
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
                    handleAction(index, "rejected", onClose);
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

    // setOpen(true);
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
    if (flag == "approve") {
      param.append("action", "approve_mt5_bonus_request");
    } else {
      param.append("action", "reject_mt5_bonus_request");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("mt5_bonus_id", id);
    await axios
      .post(`${Url}/ajaxfiles/mt5_bonus_request_manage.php`, param)
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

  const viewDeposit = async (row) => {
    const param = new FormData();
    param.append("action", "view_mt5_bonus_request");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("mt5_bonus_id", row.mt5_bonus_id);
    storeDepositData.isLoader = true;
    setStoreDepositData({ ...storeDepositData });
    await axios
      .post(`${Url}/ajaxfiles/mt5_bonus_request_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        handleContextClose(row.mt5_bonus_id);
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setviewDepositForm({
            date: res.data.data.date,
            name: res.data.data.name,
            email: res.data.data.email,
            modified_by_name: res.data.data.modified_by_name,
            mt5_acc_no: res.data.data.mt5_acc_no,
            mt5_bonus_percentage: res.data.data.mt5_bonus_percentage,
            transfer_amount: res.data.data.transfer_amount,
            transfer_bonus_amount: res.data.data.transfer_bonus_amount,
            remark: res.data.data.remark,
            status: res.data.data.claim_status,
            mt5_bonus_id: res.data.data.mt5_bonus_id,
            isLoader: false,
          });
          setStoreDepositData({
            status: res.data.data.claim_status,
            isLoader: false,
          });
          setDialogTitle("Update Mt5 Bonus Request");
          setOpen(true);
        }
      });
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
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
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

  const input1 = (event) => {
    const { name, value } = event.target;
    setviewDepositForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Bonus Requests</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
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
                          url={`${Url}/datatable/mt5_bonus_request_list.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          footer={footer}
                          param={param}
                          searchWord={searchKeyword}
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

export default MT5BonusRequests;
