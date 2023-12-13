import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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

const BankList = (prop) => {
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
      label: "email",
      value: false,
      name: "email",
    },
  ]);
  const [viewDepositForm, setviewDepositForm] = useState({
    date: "",
    name: "",
    email: "",
    phone: "",
    user_id: "",
    bank_name: "",
    bank_ifsc: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    currency: "",
    swift_code: "",
    bank_proof: "",
    bank_proof_preview: "",
    remark: "",
    admin_notes: "",
    status: "",
    user_bank_id: "",
    ifscdata: "",
    ibanselect: "IFSC",
    show: false,
    visLoader: false,
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
    visLoader: "",
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
      grow: 0.4,
      wrap: true,
    },
    {
      name: "name",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "bank name",
      selector: (row) => {
        return <span title={row.bank_name}>{row.bank_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "ifsc/Iban",
      selector: (row) => {
        return <span title={row.bank_ifsc}>{row.bank_ifsc}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },

    {
      name: "account number",
      selector: (row) => {
        return (
          <span title={row.bank_account_number}>{row.bank_account_number}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "currency",
      selector: (row) => {
        return <span title={row.currency}>{row.currency}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
      // wrap: true,
    },
    {
      name: "PROOF",
      selector: (row) => {
        return row.upload_proof != "" ? (
          <CustomImageModal
            image={row.upload_proof}
            isIcon={true}
            className="tableImg"
          />
        ) : (
          ""
        );
      },
      reorder: true,
      grow: 0.1,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.bank_status == "1"
                ? "status-text-approved"
                : row.bank_status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.bank_status == "1"
                ? "Approved"
                : row.bank_status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.bank_status == "1"
              ? "Approved"
              : row.bank_status == "2"
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
    {
      name: "Remarks ",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Updated Date",
      selector: (row) => {
        return (
          <span title={row.update_datetime}>
            {row.update_datetime == "" ? (
              ""
            ) : (
              <NewDate newDate={row.update_datetime} />
            )}
          </span>
        );
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "ip address",
      selector: (row) => {
        return <span title={row.ip_address}>{row.ip_address}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "approve ip",
      selector: (row) => {
        return (
          <span title={row.approve_ip_address}>{row.approve_ip_address}</span>
        );
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
            <Button
              id={`actionButton_${row.user_bank_id}`}
              aria-controls={
                open ? `basic-menu-${row.user_bank_id}` : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleContextClick(event, row.user_bank_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.user_bank_id}`}
              anchorEl={openTableMenus[row.user_bank_id]}
              open={Boolean(openTableMenus[row.user_bank_id])}
              onClose={(event) => handleContextClose(row.user_bank_id)}
            >
              {row.bank_status != "0" ? (
                <>
                  {prop.permission.view_update_deposit == 1 ||
                  prop.permission.view_deposit == 1 ? (
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
                  <MenuItem
                    className="view"
                    {...row}
                    onClick={(event) => viewDeposit(row)}
                  >
                    <i className="material-icons">receipt</i>
                    &nbsp;&nbsp;View
                  </MenuItem>

                  <MenuItem
                    className="approve"
                    {...row}
                    onClick={(event) =>
                      actionMenuPopup(event, row.user_bank_id, "approve")
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
                      actionMenuPopup(event, row.user_bank_id, "reject")
                    }
                  >
                    <i className="material-icons font-color-rejected">cancel</i>
                    &nbsp;&nbsp;Rejected
                  </MenuItem>
                </div>
              )}
            </Menu>
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
  const checkIfscCode = () => {
    if (viewDepositForm.bank_ifsc == "") {
      toast.error("iban/IFSC code is requied");
    } else {
      viewDepositForm.visLoader = true;
      setviewDepositForm({ ...viewDepositForm });
      const param = new FormData();
      param.append("ifsc_code", viewDepositForm.bank_ifsc);
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      // viewDepositForm.visLoader = true;
      // setBankAccountForm({ ...viewDepositForm });
      axios.post(`${Url}/ajaxfiles/check_ifsc_code.php`, param).then((res) => {
        if (res.data.status == "error") {
          toast.error(res.data.message);
          viewDepositForm.visLoader = false;
          setviewDepositForm({ ...viewDepositForm });
        } else {
          toast.success(res.data.message);
          viewDepositForm.ifscdata = res.data.bank_data;
          viewDepositForm.visLoader = false;
          viewDepositForm.show = true;
          setviewDepositForm({ ...viewDepositForm });
        }
      });
    }
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
    } else if (dialogTitle == "Update Bank Account Request") {
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
  const notify = (p) => {
    toast.error(p);
  };
  const submitUpdate = async () => {
    if (!viewDepositForm.bank_account_holder_name) {
      notify("Account holder name required");
    } else if (!viewDepositForm.bank_name) {
      notify("Benificiary bank name required");
    } else if (!viewDepositForm.currency) {
      notify("Please Select Currency");
    } else if (!viewDepositForm.bank_account_number) {
      notify("Bank account number required");
    } else if (!viewDepositForm.bank_ifsc) {
      notify(`${viewDepositForm.ibanselect} code is required`);
    } else if (
      viewDepositForm.bank_ifsc !== viewDepositForm.ifscdata.IFSC &&
      viewDepositForm.ibanselect == "IFSC"
    ) {
      // console.log(
      //   "viewDepositForm.ifscdata.IFSC",
      //   viewDepositForm.ifscdata.IFSC,
      //   viewDepositForm.bank_ifsc
      // );
      notify("Verify IFSc code");
    } else if (
      !viewDepositForm.bank_proof &&
      !viewDepositForm.bank_proof_preview
    ) {
      notify("Please enter bank proof like passbook or checkbook.");
    } else {
      viewDepositForm.isLoader = true;
      setviewDepositForm({ ...viewDepositForm });
      const param = new FormData();
      param.append("action", "update_bank");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("is_bank_ifsc_iban", viewDepositForm.ibanselect);

      param.append("bank_name", viewDepositForm.bank_name);
      param.append("user_id", viewDepositForm.user_id);
      param.append("bank_id", viewDepositForm.user_bank_id);
      //   param.append("bank_id", viewDepositForm.bank_id);
      param.append("bank_ifsc", viewDepositForm.bank_ifsc);
      param.append("currency", viewDepositForm.currency);
      param.append("bank_account_number", viewDepositForm.bank_account_number);
      param.append(
        "bank_account_name",
        viewDepositForm.bank_account_holder_name
      );
      param.append("swift_code", viewDepositForm.swift_code);
      param.append("bank_status", viewDepositForm.status);
      param.append("remarks", viewDepositForm.remark);
      if (viewDepositForm.bank_proof && viewDepositForm.bank_proof_preview) {
        param.append("bank_proof", viewDepositForm.bank_proof);
      }

      await axios
        .post(`${Url}/ajaxfiles/bank_manage.php`, param)
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
    } else if (dialogTitle == "Update Bank Account Request") {
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
              label="Account Holder Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="bank_account_holder_name"
              value={viewDepositForm.bank_account_holder_name}
              onChange={input1}
              onBlur={input1trueFalse}
              error={
                viewDepositForm.bank_account_holder_name == "" &&
                input1infoTrue.bank_account_holder_name
                  ? true
                  : false
              }
              helperText={
                viewDepositForm.bank_account_holder_name == "" &&
                input1infoTrue.bank_account_holder_name
                  ? "Please Enter Account Holder Name"
                  : ""
              }
              focused
              disabled={storeDepositData.status == "0" ? false : true}
            />
            <TextField
              label="Beneficiary Bank Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="bank_name"
              value={viewDepositForm.bank_name}
              onChange={input1}
              onBlur={input1trueFalse}
              error={
                viewDepositForm.bank_name == "" && input1infoTrue.bank_name
                  ? true
                  : false
              }
              helperText={
                viewDepositForm.bank_name == "" && input1infoTrue.bank_name
                  ? "Please Enter Beneficiary Bank Name"
                  : ""
              }
              disabled={storeDepositData.status == "0" ? false : true}
            />
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              focused
              error={
                viewDepositForm.currency == "" && input1infoTrue.currency
                  ? true
                  : false
              }
            >
              <InputLabel>Currency</InputLabel>
              <Select
                value={viewDepositForm.currency}
                name="currency"
                onChange={input1}
                onBlur={input1trueFalse}
                disabled={storeDepositData.status == "0" ? false : true}
              >
                {resData?.bank_currency.map((item, index) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
              {viewDepositForm.currency == "" && input1infoTrue.currency ? (
                <FormHelperText>Please Select Currency</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <br />
          <div className="update-withdraw-request-section">
            <TextField
              label="Bank Account Number"
              variant="standard"
              sx={{ width: "100%" }}
              name="bank_account_number"
              value={viewDepositForm.bank_account_number}
              onChange={input1}
              onBlur={input1trueFalse}
              error={
                viewDepositForm.bank_account_number == "" &&
                input1infoTrue.bank_account_number
                  ? true
                  : false
              }
              helperText={
                viewDepositForm.bank_account_number == "" &&
                input1infoTrue.bank_account_number
                  ? "Please Enter Bank Account Number"
                  : ""
              }
              focused
              disabled={storeDepositData.status == "0" ? false : true}
            />
            <TextField
              label="Swift Code (optional)"
              variant="standard"
              sx={{ width: "100%" }}
              name="swift_code"
              value={viewDepositForm.swift_code}
              onChange={input1}
              focused
              disabled={storeDepositData.status == "0" ? false : true}
            />
          </div>
          <br />

          <div className="update-withdraw-request-section">
            <div className="w-100">
              <FormControl
                disabled={storeDepositData.status == "0" ? false : true}
              >
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="IFSC"
                  value={viewDepositForm.ibanselect}
                  name="ibanselect"
                  sx={{ display: "block" }}
                  onChange={input1}
                >
                  <FormControlLabel
                    value="IFSC"
                    control={<Radio />}
                    label="IFSC"
                  />
                  <FormControlLabel
                    value="IBAN"
                    control={<Radio />}
                    label="IBAN"
                  />
                  {/* <FormControlLabel
                  value="SWIFT"
                  control={<Radio />}
                  label="SWIFT"
                /> */}
                </RadioGroup>
              </FormControl>
              <Grid container>
                <Grid item md={12}>
                  <div className="d-flex">
                    <TextField
                      value={viewDepositForm.bank_ifsc}
                      className="input-font-small"
                      label="CODE"
                      variant="standard"
                      sx={
                        viewDepositForm.ibanselect == "IFSC"
                          ? { width: "60%" }
                          : { width: "100%" }
                      }
                      error={
                        viewDepositForm.bank_ifsc == "" &&
                        input1infoTrue.bank_ifsc
                          ? true
                          : false
                      }
                      onBlur={input1trueFalse}
                      name="bank_ifsc"
                      disabled={storeDepositData.status == "0" ? false : true}
                      onChange={(e) => {
                        if (
                          e.target.value === "" ||
                          /^[A-Za-z0-9_ ]*$/.test(e.target.value) ||
                          e.target.value === " "
                        ) {
                          if (viewDepositForm.show) {
                            input1(e);
                            viewDepositForm.ifscdata = {};
                            viewDepositForm.show = false;
                            setviewDepositForm({ ...viewDepositForm });
                          } else {
                            input1(e);
                          }
                        }
                      }}
                      // onChange={(e) => {

                      // }}
                      helperText={
                        viewDepositForm.bank_ifsc == "" &&
                        input1infoTrue.bank_ifsc ? (
                          <p className="d-block">Code is required</p>
                        ) : (
                          ""
                        )
                      }
                    />
                    {viewDepositForm.ibanselect == "IFSC" ? (
                      viewDepositForm.visLoader != false ? (
                        <Button
                          sx={{ marginLeft: "10px", width: "40%" }}
                          variant="contained"
                          disabled
                          className="add_bank"
                        >
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
                        </Button>
                      ) : (
                        <Button
                          sx={{ marginLeft: "10px", width: "40%" }}
                          variant="contained"
                          className="add_bank"
                          disabled={viewDepositForm.show}
                          onClick={checkIfscCode}
                        >
                          Verify Code
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </Grid>

                {viewDepositForm.show && viewDepositForm.ifscdata.BRANCH ? (
                  <div>
                    <span>
                      {viewDepositForm.ifscdata?.BRANCH},
                      {viewDepositForm.ifscdata?.CENTRE},
                      {viewDepositForm.ifscdata?.STATE}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </Grid>
            </div>
          </div>
          <br />
          <div className="update-withdraw-request-section">
            <div className="element w-50">
              <label>Bank Proof</label>
              {viewDepositForm.bank_proof_preview ? (
                <div className="">
                  <a
                    className="bg-transparent p-0 border-0"
                    style={{
                      textAlign: "center",
                      width: "100%",
                      display: "block",
                    }}
                    onClick={() => {
                      viewDepositForm.bank_proof = "";
                      viewDepositForm.bank_proof_preview = "";
                      setviewDepositForm({ ...viewDepositForm });
                    }}
                  >
                    {storeDepositData.status == "0" ? (
                      <CloseOutlinedIcon className="fontimgclose" />
                    ) : (
                      true
                    )}
                  </a>
                  <CustomImageModal
                    image={viewDepositForm.bank_proof_preview}
                    className="deposit-upload-image-preview"
                  />
                </div>
              ) : (
                <label
                  htmlFor="contained-button-file"
                  className="fileuploadButton"
                >
                  <Input
                    accept="application/pdf,image/*"
                    id="contained-button-file"
                    type="file"
                    disabled={storeDepositData.status == "0" ? false : true}
                    onChange={(e) => {
                      if (
                        e.target.files[0].type == "image/jpeg" ||
                        e.target.files[0].type == "application/pdf" ||
                        e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpg"
                      ) {
                        var objectUrl1 = URL.createObjectURL(e.target.files[0]);
                        viewDepositForm.bank_proof = e.target.files[0];
                        viewDepositForm.bank_proof_preview = objectUrl1;
                        setviewDepositForm({ ...viewDepositForm });
                      } else {
                        toast.error(
                          "Only JPG, JPEG, PNG and PDF types are accepted"
                        );
                      }
                    }}
                  />
                  <div style={{ marginLeft: "10px" }}>
                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>
                      &nbsp;Upload
                    </Button>
                  </div>
                </label>
              )}
            </div>
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
                disabled={storeDepositData.status == "0" ? false : true}
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
              disabled={storeDepositData.status == "0" ? false : true}
            />
            {/* <TextField
              label="Admin Note"
              variant="standard"
              sx={{ width: "100%" }}
              name="admin_notes"
              value={viewDepositForm.admin_notes}
              onChange={input1}
              focused
              disabled={storeDepositData.status == "0" ? false : true}
            /> */}
          </div>
        </div>
      );
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
      param.append("action", "approve_bank");
    } else {
      param.append("action", "reject_bank");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("bank_id", id);
    await axios.post(`${Url}/ajaxfiles/bank_manage.php`, param).then((res) => {
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

  const viewDeposit = async (data) => {
    handleContextClose(data.user_bank_id);
    setviewDepositForm({
      date: data.added_datetime,
      user_id: data.user_id,
      name: data.name,
      admin_notes: data.admin_notes,
      email: data.email,
      bank_name: data.bank_name,
      bank_ifsc: data.bank_ifsc,
      bank_account_holder_name: data.bank_account_holder_name,
      bank_account_number: data.bank_account_number,
      currency: data.currency,
      swift_code: data.swift_code,
      bank_proof: "",
      bank_proof_preview: data.upload_proof,
      phone: data.user_phone,
      ifscdata: { IFSC: data.bank_ifsc },
      ibanselect: data.is_bank_ifsc_iban ? data.is_bank_ifsc_iban : "IFSC",
      show: true,
      visLoader: false,
      remark: data.deposit_remarks,
      status: data.bank_status,
      user_bank_id: data.user_bank_id,
      isLoader: false,
    });
    setStoreDepositData({
      date: data.deposit_datetime,
      name: data.name,
      email: data.email,
      phone: data.user_phone,
      admin_notes: data.admin_notes,
      bank_name: data.bank_name,
      bank_ifsc: data.bank_ifsc,
      bank_account_holder_name: data.bank_account_holder_name,
      bank_account_number: data.bank_account_number,
      currency: data.currency,
      swift_code: data.swift_code,
      bank_proof: data.bank_proof,
      bank_proof_preview: data.bank_proof_preview,
      remark: data.deposit_remarks,
      status: data.bank_status,
      user_bank_id: data.user_bank_id,
      isLoader: false,
    });
    setDialogTitle("Update Bank Account Request");
    setOpen(true);
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
                <p className="main-heading">Bank Account</p>
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
                          url={`${Url}/datatable/bank_list.php`}
                          column={columns}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          lastUpdatedBy={resData.modified_by_users}
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

export default BankList;
