import "./deposit.css";
import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
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

const Internaltranfer = (prop) => {
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
      label: "Name",
      value: false,
      name: "name",
    },
    {
      label: "From Mt5 Id",
      value: false,
      name: "from_mt5_id",
    },
    {
      label: "To Mt5 Id",
      value: false,
      name: "to_mt5_Id",
    },
    {
      label: "From Wallet Code",
      value: false,
      name: "from_wallet_code",
    },
    {
      label: "To Wallet Code",
      value: false,
      name: "to_wallet_code",
    },
    {
      label: "AMOUNT",
      value: false,
      name: "amount",
    },
    // {
    //   label: "REMARK",
    //   value: false,
    //   name: "remarks",
    // },
  ]);
  const [viewDepositForm, setviewDepositForm] = useState({
    date: "",
    name: "",
    email: "",
    phone: "",
    deposit_method: "",
    amount: "",
    remark: "",
    status: "",
    deposit_id: "",
    isLoader: false,
  });
  const [input1infoTrue, setinput1infoTrue] = useState({
    amount: false,
    status: false,
  });

  const [storeDepositData, setStoreDepositData] = useState({
    date: "",
    name: "",
    email: "",
    phone: "",
    deposit_method: "",
    amount: "",
    remark: "",
    status: "",
    deposit_id: "",
    isLoader: false,
  });
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  toast.configure();

  const columns = [
    {
      name: "SR.NO",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      minWidth: "72px",

      // wrap: true,
      grow: 0.1,
    },
    // {
    //   name: "Transfer ID",
    //   selector: (row) => {
    //     return <span title={row.transfer_id}>{row.transfer_id}</span>;
    //   },
    //   sortable: true,
    //   reorder: true,
    //   grow: 0.7,
    //   // wrap: true,
    // },
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
      grow: 0.4,
      wrap: true,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.transfer_to_name}>{row.transfer_to_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "From Account",
      selector: (row) => {
        return <span title={row.from_account}>{row.from_account}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "TO Account",
      selector: (row) => {
        return <span title={row.to_account}>{row.to_account}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "AMOUNT",
      selector: "amount",
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "Transaction Type",
      selector: (row) => {
        return <span title={row.transaction_type}>{row.transaction_type}</span>;
      },
      reorder: true,
      minWidth: "115px",
      // wrap: true,
      grow: 0.4,
    },
    // {
    //   name: "REMARK",
    //   selector: (row) => {
    //     return <span title={row.deposit_remarks}>{row.deposit_remarks}</span>;
    //   },
    //   sortable: true,
    //   reorder: true,
    //   grow: 1.5,
    //   // wrap: true,
    // },
    // {
    //   name: "PROOF",
    //   selector: (row) => {
    //     return row.proof != "" ? (
    //       <CustomImageModal
    //         image={row.proof}
    //         isIcon={true}
    //         className="tableImg"
    //       />
    //     ) : (
    //       ""
    //     );
    //   },
    //   reorder: true,
    //   grow: 0.2,
    //   // wrap: true,
    // },
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
      grow: 0.3,
      wrap: true,
    },

    // {
    //   name: "Updated Date",
    //   selector: (row) => {
    //     return (
    //       <span title={row.updated_datetime}>
    //         {row.updated_datetime == "" ? (
    //           ""
    //         ) : (
    //           <NewDate newDate={row.updated_datetime} />
    //         )}
    //       </span>
    //     );
    //   },
    //   reorder: true,
    //   // wrap: true,
    //   grow: 0.5,
    // },
    // {
    //   name: "Action",
    //   button: true,
    //   cell: (row) => {
    //     return (
    //       <div>
    //         {prop.permission.view_update_deposit == 1 ||
    //         prop.permission.view_deposit == 1 ||
    //         prop.permission.approve_deposite == 1 ||
    //         prop.permission.reject_deposite == 1 ? (
    //           <>
    //             <Button
    //               id={`actionButton_${row.deposit_id}`}
    //               aria-controls={
    //                 open ? `basic-menu-${row.deposit_id}` : undefined
    //               }
    //               aria-haspopup="true"
    //               aria-expanded={open ? "true" : undefined}
    //               onClick={(event) => handleContextClick(event, row.deposit_id)}
    //               {...row}
    //               style={{ color: "rgb(144 145 139)" }}
    //             >
    //               <i className="material-icons">more_horiz</i>
    //             </Button>
    //             <Menu
    //               id={`basic-menu-${row.deposit_id}`}
    //               anchorEl={openTableMenus[row.deposit_id]}
    //               open={Boolean(openTableMenus[row.deposit_id])}
    //               onClose={(event) => handleContextClose(row.deposit_id)}
    //             >
    //               {row.status != "0" ? (
    //                 <>
    //                   {prop.permission.view_update_deposit == 1 ||
    //                   prop.permission.view_deposit == 1 ? (
    //                     <MenuItem
    //                       className="view"
    //                       {...row}
    //                       onClick={(event) => viewDeposit(row.deposit_id)}
    //                     >
    //                       <i className="material-icons">receipt</i>
    //                       &nbsp;&nbsp;View
    //                     </MenuItem>
    //                   ) : (
    //                     ""
    //                   )}
    //                 </>
    //               ) : (
    //                 <div>
    //                   {prop.permission.view_update_deposit == 1 ||
    //                   prop.permission.view_deposit == 1 ? (
    //                     <MenuItem
    //                       className="view"
    //                       {...row}
    //                       onClick={(event) => viewDeposit(row.deposit_id)}
    //                     >
    //                       <i className="material-icons">receipt</i>
    //                       &nbsp;&nbsp;View
    //                     </MenuItem>
    //                   ) : (
    //                     ""
    //                   )}
    //                   {prop.permission.approve_deposite == 1 ? (
    //                     <MenuItem
    //                       className="approve"
    //                       {...row}
    //                       onClick={(event) =>
    //                         actionMenuPopup(event, row.deposit_id)
    //                       }
    //                     >
    //                       <i className="material-icons font-color-approved">
    //                         task_alt
    //                       </i>
    //                       &nbsp;&nbsp;Approved
    //                     </MenuItem>
    //                   ) : (
    //                     ""
    //                   )}
    //                   {prop.permission.reject_deposite == 1 ? (
    //                     <MenuItem
    //                       className="reject"
    //                       {...row}
    //                       onClick={(event) =>
    //                         actionMenuPopup(event, row.deposit_id)
    //                       }
    //                     >
    //                       <i className="material-icons font-color-rejected">
    //                         cancel
    //                       </i>
    //                       &nbsp;&nbsp;Rejected
    //                     </MenuItem>
    //                   ) : (
    //                     ""
    //                   )}
    //                 </div>
    //               )}
    //             </Menu>
    //           </>
    //         ) : (
    //           ""
    //         )}
    //       </div>
    //     );
    //   },
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    // },
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
          {depositForm.isLoader == true ? (
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
              onClick={depositFormSubmit}
            >
              Add
            </Button>
          )}
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
    } else if (dialogTitle == "Update Deposit Request") {
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
          prop.permission.view_update_deposit == 1 ? (
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
    if (viewDepositForm.amount == "") {
      toast.error("Please enter amount");
    } else if (viewDepositForm.remark == "") {
      toast.error("Please enter remark");
    } else {
      viewDepositForm.isLoader = true;
      setviewDepositForm({ ...viewDepositForm });
      const param = new FormData();
      param.append("action", "view_update_deposit");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("deposit_id", viewDepositForm.deposit_id);
      param.append("amount", viewDepositForm.amount);
      param.append("deposit_remarks", viewDepositForm.remark);
      param.append("deposit_status", viewDepositForm.status);
      await axios
        .post(`${Url}/ajaxfiles/deposit_manage.php`, param)
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
    if (dialogTitle == "Add New Deposit") {
      return (
        <div>
          <div>
            {/* <TextField label="Live Account" variant="standard" sx={{ width: '100%' }} name='live_account' value={depositForm.live_account} onChange={input} /> */}
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
    } else if (dialogTitle == "Update Deposit Request") {
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
              label="Phone"
              variant="standard"
              sx={{ width: "100%" }}
              name="phone"
              value={viewDepositForm.phone}
              onChange={input1}
              focused
              disabled
            />
            <TextField
              label="Method"
              variant="standard"
              sx={{ width: "100%" }}
              name="deposit_method"
              value={viewDepositForm.deposit_method}
              onChange={input1}
              focused
              disabled
            />
            <TextField
              label="Amount"
              type="text"
              error={
                viewDepositForm.amount == "" && input1infoTrue.amount
                  ? true
                  : false
              }
              helperText={
                viewDepositForm.amount == "" && input1infoTrue.amount
                  ? "Amount is required"
                  : ""
              }
              onBlur={input1trueFalse}
              variant="standard"
              sx={{ width: "100%" }}
              name="amount"
              value={viewDepositForm.amount}
              // onChange={input1}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input1(e);
                }
              }}
              focused
              disabled={
                storeDepositData.status == "0" &&
                prop.permission.view_update_deposit == 1
                  ? false
                  : true
              }

              // disabled={viewDepositForm.status == "0"   ? false : true}
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
                prop.permission.view_update_deposit == 1
                  ? false
                  : true
              }
            />
            {/* <TextField label="Status" variant="standard" sx={{ width: '100%' }} name='customer_name' value={viewDepositForm.status} onChange={input1} focused/> */}
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              focused
              error={
                viewDepositForm.status == "" && input1infoTrue.status
                  ? true
                  : false
              }
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={viewDepositForm.status}
                name="status"
                onChange={input1}
                onBlur={input1trueFalse}
                disabled={
                  storeDepositData.status == "0" &&
                  prop.permission.view_update_deposit == 1
                    ? false
                    : true
                }
              >
                <MenuItem value="0">Pending</MenuItem>
                <MenuItem value="1">Approve</MenuItem>
                <MenuItem value="2">Reject</MenuItem>
              </Select>
              {viewDepositForm.status == "" && input1infoTrue.status ? (
                <FormHelperText>Status is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
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
                    handleAction(index, "rejected");
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
                    handleAction(index, "approve");
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
    }

    // setOpen(true);
  };

  const handleAction = async (id, flag) => {
    const param = new FormData();
    if (flag == "approve") {
      param.append("action", "approve_deposite");
    } else {
      param.append("action", "reject_deposite");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("deposit_id", id);
    await axios
      .post(`${Url}/ajaxfiles/deposit_manage.php`, param)
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
          toast.success(res.data.message);
          setRefresh(!refresh);
        }
      });
  };

  const viewDeposit = async (id) => {
    const param = new FormData();
    param.append("action", "view_deposit");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("deposit_id", id);
    await axios
      .post(`${Url}/ajaxfiles/deposit_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        handleContextClose(id);
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setviewDepositForm({
            date: res.data.deposit_data.deposit_datetime,
            name: res.data.deposit_data.name,
            email: res.data.deposit_data.user_email,
            phone: res.data.deposit_data.user_phone,
            deposit_method: res.data.deposit_data.deposit_method,
            amount: res.data.deposit_data.deposit_amount,
            remark: res.data.deposit_data.deposit_remarks,
            status: res.data.deposit_data.deposit_status,
            deposit_id: id,
            isLoader: false,
          });
          setStoreDepositData({
            date: res.data.deposit_data.deposit_datetime,
            name: res.data.deposit_data.name,
            email: res.data.deposit_data.user_email,
            phone: res.data.deposit_data.user_phone,
            deposit_method: res.data.deposit_data.deposit_method,
            amount: res.data.deposit_data.deposit_amount,
            remark: res.data.deposit_data.deposit_remarks,
            status: res.data.deposit_data.deposit_status,
            deposit_id: id,
            isLoader: false,
          });
          setDialogTitle("Update Deposit Request");
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
  const input1trueFalse = (event) => {
    var { name, value } = event.target;
    setinput1infoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
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
                <p className="main-heading">Internal Tranfer</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  //   setcheckStatus={setcheckStatus}

                  lastUpdatedBy={resData.modified_by_users}
                  transfer_methods={true}
                  search_user_id1={resData.search_user_list}
                  Check_Status={true}
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
                          url={`${Url}/datatable/internal_transfer_list.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          footer={footer}
                          param={param}
                          searchWord={searchKeyword}
                          checkStatus={checkStatus}
                          setResData={setResData}
                          csv="datatable/internal_transfer_list_export.php"
                          // csv="datatable/deposit_list_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <div className="d-flex">
                    <Grid container>
                      <Grid item md={12}>
                        <div className="row1 boxSection">
                          <div className="card padding-9 animate fadeLeft boxsize">
                            <div className="row">
                              <div className="col s12 m12 text-align-center">
                                <h5 className="mb-0">
                                  {resData.total_transfer_amount_footer}
                                </h5>
                                <p className="no-margin">Total Deposit</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                      {/* <Grid item md={6}>
                        <div className="row1 boxSection">
                          <div className="card padding-9 animate fadeLeft boxsize">
                            <div className="row">
                              <div className="col s12 m12 text-align-center">
                                <h5 className="mb-0">
                                  {resData.total_deposit}
                                </h5>
                                <p className="no-margin">Deposit</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid> */}
                    </Grid>
                  </div>
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

export default Internaltranfer;
