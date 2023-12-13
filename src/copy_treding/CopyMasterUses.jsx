import {
  Button,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tab,
  Tabs,
  Typography,
  Box,
  Menu,
  Input,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@emotion/react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import CustomImageModal from "../common/CustomImageModal";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
const re = /^[A-Za-z_ ]*$/;

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CopyMasterUses = (prop) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [param, setParam] = useState({});
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const [refresh, setRefresh] = useState(false);
  const [value, setValue] = useState(0);
  const [resData, setResData] = useState({});
  const [selectedAadharCardFrontFile, setSelectedAadharCardFrontFile] =
    useState();
  const [previewAadharCardFront, setPreviewAadharCardFront] = useState();
  const [selectedAadharCardBackFile, setSelectedAadharCardBackFile] =
    useState();
  const [previewAadharCardBack, setPreviewAadharCardBack] = useState();
  const [countryData, setCountryData] = useState({
    data: [],
  });

  const [approvestatus, setApprovestatus] = useState(false);
  const [form, setForm] = useState({
    isLoader: false,
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    country: "",
    state: "",
    city: "",
    status: "",
    password: "",
    confirm_password: "",
    showpassword: false,
    showconfirm_password: false,
    additional_email: "",
    additional_contact_number: "",
  });
  const [inputinfoTrue, setinputinfoTrue] = useState({
    first_name: false,
    last_name: false,
    email: false,
    mobile: false,
    gender: false,
    dob: false,
    address: false,
    country: false,
    state: false,
    city: false,
    status: false,
    password: false,
    confirm_password: false,
    additional_email: false,
    additional_contact_number: false,
  });
  const [kycForm, setKycForm] = useState({
    isLoader: false,
    id: "",
    name: "",
    id_number: "",
    back_image: "",
    front_image: "",
    email: "",
    feedback_remarks: "",
    feedback_remarks: "",
    status: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "name",
    },
    {
      label: "EMAIL",
      value: false,
      name: "user_email",
    },
    {
      label: "MOBILE",
      value: false,
      name: "user_phone",
    },
    {
      label: "PASSWORD",
      value: false,
      name: "user_visible_password",
    },
  ]);
  const [kycSearchBy, setKycSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "name",
    },
    {
      label: "EMAIL",
      value: false,
      name: "user_email",
    },
    {
      label: "ID NUMBER",
      value: false,
      name: "aadhar_card_number",
    },
  ]);
  toast.configure();

  const column = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "USER NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "MOBILE",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "PASSWORD",
      selector: (row) => {
        return (
          <span title={row.user_visible_password}>
            {row.user_visible_password}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={row.user_status == "0" ? "Pending" : "Approve"}
            className={`text-color-${
              row.user_status == "1"
                ? "green"
                : row.user_status == "2"
                ? "red"
                : "yellow"
            }`}
          >
            {row.user_status == "0" ? "Pending" : "Approve"}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.user_added_datetime}>{row.user_added_datetime}</span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div className="actionButtonGroup">
            {prop.permission.update_manager_details == 1 ? (
              <Button
                className="btn-edit"
                onClick={(event) => edit(row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              </Button>
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

  const kycColumn = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "USER NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "ID NUMBER",
      selector: (row) => {
        return (
          <span title={row.aadhar_card_number}>{row.aadhar_card_number}</span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={
              row.status == "0"
                ? "Pending"
                : row.status == "1"
                ? "Approve"
                : "Rejected"
            }
            className={`text-color-${
              row.status == "1" ? "green" : row.status == "2" ? "red" : "yellow"
            }`}
          >
            {row.status == "0"
              ? "Pending"
              : row.status == "1"
              ? "Approve"
              : "Rejected"}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.7,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.view_mm_kyc == 1 ||
            prop.permission.approve_mm_kyc == 1 ||
            prop.permission.update_mm_kyc == 1 ||
            prop.permission.reject_mm_kyc == 1 ? (
              <>
                <Button
                  id={`actionButton_${row.sr_no}`}
                  aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(event) => handleContextClick(event, row.sr_no)}
                  {...row}
                  style={{ color: "rgb(144 145 139)" }}
                >
                  <i className="material-icons">more_horiz</i>
                </Button>
                <Menu
                  id={`basic-menu-${row.sr_no}`}
                  anchorEl={openTableMenus[row.sr_no]}
                  open={Boolean(openTableMenus[row.sr_no])}
                  onClose={(event) => handleContextClose(row.sr_no)}
                >
                  {prop.permission.view_mm_kyc == 1 ? (
                    <MenuItem
                      className="view"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i
                        className="material-icons view"
                        onClick={(event) => actionMenuPopup(event, row)}
                      >
                        receipt
                      </i>
                      &nbsp;&nbsp;View
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {prop.permission.update_mm_kyc == 1 ? (
                    <MenuItem
                      className="edit"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i className="edit material-icons">visibility</i>
                      &nbsp;&nbsp;Edit
                    </MenuItem>
                  ) : (
                    ""
                  )}

                  {row.status != "1" && prop.permission.approve_mm_kyc == 1 ? (
                    <MenuItem
                      className="approve"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i className="approve material-icons font-color-approved">
                        thumb_up
                      </i>
                      &nbsp;&nbsp;Approved
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {prop.permission.reject_mm_kyc == 1 ? (
                    <MenuItem
                      className="reject"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i className="reject material-icons font-color-rejected">
                        thumb_down
                      </i>
                      &nbsp;&nbsp;Rejected
                    </MenuItem>
                  ) : (
                    ""
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

  const actionMenuPopup = (e, data) => {
    handleContextClose(data.sr_no);
    if (e.target.classList.contains("reject")) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to rejected this?</p>
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
                    changeStatus("rejected", data);
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
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to approved this?</p>
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
                    changeStatus("approved", data);
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
    } else if (
      e.target.classList.contains("view") ||
      e.target.classList.contains("edit")
    ) {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("kyc_id", data.kyc_id);
      param.append("action", "view_kyc");
      axios
        .post(Url + "/ajaxfiles/copy_master/copy_master_kyc_manage.php", param)
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
            setKycForm((prevalue) => {
              return {
                ...prevalue,
                id: data.kyc_id,
                name: res.data.kyc_data.name,
                id_number: res.data.kyc_data.aadhar_card_number,
                back_image: res.data.kyc_data.aadhar_card_back_image,
                front_image: res.data.kyc_data.aadhar_card_front_image,
                email: res.data.kyc_data.email,
                feedback_remarks: res.data.kyc_data.feedback_remarks,
                status: res.data.kyc_data.aadharcard_status,
                isLoader: false,
              };
            });
            if (e.target.classList.contains("edit")) {
              setDialogTitle("Edit KYC Details");
            } else {
              setDialogTitle("View KYC Details");
            }

            setOpen(true);
          }
        });
    }
  };

  const changeStatus = (status, data) => {
    if (status == "approved") {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("kyc_id", data.kyc_id);
      param.append("action", "approve_kyc");
      axios
        .post(Url + "/ajaxfiles/copy_master/copy_master_kyc_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setRefresh(!refresh);
          toast.success(res.data.message);
        });
    } else if (status == "rejected") {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("kyc_id", data.kyc_id);
      param.append("action", "reject_kyc");
      axios
        .post(Url + "/ajaxfiles/copy_master/copy_master_kyc_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setRefresh(!refresh);
          toast.success(res.data.message);
        });
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openDialogbox = (e, row) => {
    if (e.target.classList.contains("add")) {
      setDialogTitle("Add");
      setForm({
        isLoader: false,
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        gender: "",
        dob: "",
        address: "",
        country: "",
        state: "",
        city: "",
        status: "",
        showpassword: false,
        showconfirm_password: false,
        password: "",
        confirm_password: "",
        additional_email: "",
        additional_contact_number: "",
      });
      setinputinfoTrue({
        first_name: false,
        last_name: false,
        email: false,
        mobile: false,
        gender: false,
        dob: false,
        address: false,
        country: false,
        state: false,
        city: false,
        status: false,
        password: false,
        confirm_password: false,
        additional_email: false,
        additional_contact_number: false,
      });
    }
    setOpen(true);
  };

  const manageContent = () => {
    if (dialogTitle == "Add") {
      return (
        <div className="mmManagement-section">
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="First Name"
              variant="standard"
              onBlur={inputtrueFalse}
              value={form.first_name}
              error={
                form.first_name == "" && inputinfoTrue.first_name ? true : false
              }
              helperText={
                form.first_name == "" && inputinfoTrue.first_name
                  ? "First Name is required"
                  : ""
              }
              // onChange={input}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
              name="first_name"
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Last Name"
              variant="standard"
              // onChange={input}
              onBlur={inputtrueFalse}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              value={form.last_name}
              error={
                form.last_name == "" && inputinfoTrue.last_name ? true : false
              }
              helperText={
                form.last_name == "" && inputinfoTrue.last_name
                  ? "Last Name is required"
                  : ""
              }
              sx={{ width: "100%" }}
              name="last_name"
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Email"
              variant="standard"
              onChange={input}
              onBlur={inputtrueFalse}
              value={form.email}
              helperText={
                form.email == "" && inputinfoTrue.email
                  ? "Email is required"
                  : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      form.email
                    ) && inputinfoTrue.email
                  ? "Enter a valid email"
                  : ""
              }
              error={
                (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                  form.email
                ) ||
                  form.email == "") &&
                inputinfoTrue.email == true
                  ? true
                  : false
              }
              sx={{ width: "100%" }}
              name="email"
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Mobile"
              variant="standard"
              // onChange={input}
              name="mobile"
              onBlur={inputtrueFalse}
              error={
                (form.mobile == "" ||
                  form.mobile.toString().length < 4 ||
                  form.mobile.toString().length > 12) &&
                inputinfoTrue.mobile
                  ? true
                  : false
              }
              helperText={
                form.mobile == "" && inputinfoTrue.mobile
                  ? "Mobile is required"
                  : (form.mobile.toString().length < 4 ||
                      form.mobile.toString().length > 12) &&
                    inputinfoTrue.mobile
                  ? "Mobile number is not valid"
                  : ""
              }
              value={form.mobile}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="input-element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.gender == "" && inputinfoTrue.gender ? true : false}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                label
                className="select-font-small"
                name="gender"
                onBlur={inputtrueFalse}
                onChange={input}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              {form.gender == "" && inputinfoTrue.gender ? (
                <FormHelperText>Gender is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Date Of Birth"
              type="date"
              variant="standard"
              onChange={input}
              error={form.dob == "" && inputinfoTrue.dob ? true : false}
              helperText={
                form.dob == "" && inputinfoTrue.dob
                  ? "Date Of Birth is required"
                  : ""
              }
              onBlur={inputtrueFalse}
              sx={{ width: "100%" }}
              name="dob"
              focused
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Address"
              variant="standard"
              onChange={input}
              onBlur={inputtrueFalse}
              error={form.address == "" && inputinfoTrue.address ? true : false}
              helperText={
                form.address == "" && inputinfoTrue.address
                  ? "Address is required"
                  : ""
              }
              sx={{ width: "100%" }}
              name="address"
              multiline
            />
          </div>
          <div className="input-element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.country == "" && inputinfoTrue.country ? true : false}
            >
              <InputLabel>Country</InputLabel>
              <Select
                label
                className="select-font-small"
                name="country"
                onChange={input}
                onBlur={inputtrueFalse}
              >
                {countryData.data.map((item) => {
                  return <MenuItem value={item.id}>{item.nicename}</MenuItem>;
                })}
                {/* <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem> */}
              </Select>
              {form.country == "" && inputinfoTrue.country ? (
                <FormHelperText>Country is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="State"
              variant="standard"
              // onChange={input}
              onBlur={inputtrueFalse}
              error={form.state == "" && inputinfoTrue.state ? true : false}
              helperText={
                form.state == "" && inputinfoTrue.state
                  ? "State is required"
                  : ""
              }
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
              name="state"
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="City"
              name="city"
              variant="standard"
              // onChange={input}
              error={form.city == "" && inputinfoTrue.city ? true : false}
              helperText={
                form.city == "" && inputinfoTrue.city ? "City is required" : ""
              }
              onBlur={inputtrueFalse}
              value={form.city}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>

          <div className="input-element">
            <FormControl
              sx={{ width: "100%" }}
              variant="standard"
              error={
                (!form.password.match(/[A-Z]/g) ||
                  !form.password.match(/[a-z]/g) ||
                  !form.password.match(/[0-9]/g) ||
                  form.password == "" ||
                  form.password.length < 8 ||
                  form.password.length >= 20 ||
                  !form.password.match(/[!@#$%^&*()_+=]/g)) &&
                inputinfoTrue.password
                  ? true
                  : false
              }
            >
              <InputLabel>Password</InputLabel>
              <Input
                type={form.showpassword ? "text" : "password"}
                value={form.password}
                variant="standard"
                onBlur={inputtrueFalse}
                onChange={input}
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      // aria-label="toggle password visibility"
                      onClick={() => {
                        form.showpassword = !form.showpassword;
                        setForm({ ...form });
                      }}
                      edge="end"
                    >
                      {form.showpassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {form.password == "" && inputinfoTrue.password
                  ? "Enter your password"
                  : inputinfoTrue.password &&
                    (form.password.length < 8 || form.password.length >= 20)
                  ? "Password must contain atleast 8-20 characters"
                  : inputinfoTrue.password &&
                    (!form.password.match(/[A-Z]/g) ||
                      !form.password.match(/[a-z]/g) ||
                      !form.password.match(/[0-9]/g) ||
                      !form.password.match(/[!@#$%^&*()_+=]/g))
                  ? "Atleast one lower case, upper case,special character and number required"
                  : ""}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="input-element">
            <FormControl
              sx={{ width: "100%" }}
              variant="standard"
              error={
                (form.confirm_password == "" ||
                  form.password !== form.confirm_password) &&
                inputinfoTrue.confirm_password
                  ? true
                  : false
              }
            >
              <InputLabel>Confirm Password</InputLabel>
              <Input
                type={form.showconfirm_password ? "text" : "password"}
                value={form.confirm_password}
                variant="standard"
                onBlur={inputtrueFalse}
                onChange={input}
                name="confirm_password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      // aria-label="toggle password visibility"
                      onClick={() => {
                        form.showconfirm_password = !form.showconfirm_password;
                        setForm({ ...form });
                      }}
                      edge="end"
                    >
                      {form.showpassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {form.confirm_password == "" && inputinfoTrue.confirm_password
                  ? "Enter your Confirm password"
                  : form.password !== form.confirm_password &&
                    inputinfoTrue.confirm_password
                  ? "Passwords must match"
                  : ""}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="input-element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.status == "" && inputinfoTrue.status ? true : false}
            >
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                onBlur={inputtrueFalse}
                onChange={input}
              >
                <MenuItem value="0">Pending</MenuItem>
                <MenuItem value="1">Approve</MenuItem>
              </Select>
              {form.status == "" && inputinfoTrue.status ? (
                <FormHelperText>Status is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Edit") {
      return (
        <div className="mmManagement-section">
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="First Name"
              variant="standard"
              onBlur={inputtrueFalse}
              error={
                form.first_name == "" && inputinfoTrue.first_name ? true : false
              }
              helperText={
                form.first_name == "" && inputinfoTrue.first_name
                  ? "First Name is required"
                  : ""
              }
              // onChange={input}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
              name="first_name"
              value={form.first_name}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Last Name"
              variant="standard"
              // onChange={input}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              onBlur={inputtrueFalse}
              sx={{ width: "100%" }}
              name="last_name"
              error={
                form.last_name == "" && inputinfoTrue.last_name ? true : false
              }
              helperText={
                form.last_name == "" && inputinfoTrue.last_name
                  ? "Last Name is required"
                  : ""
              }
              value={form.last_name}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Email"
              variant="standard"
              onChange={input}
              onBlur={inputtrueFalse}
              value={form.email}
              helperText={
                form.email == "" && inputinfoTrue.email
                  ? "Email is required"
                  : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      form.email
                    ) && inputinfoTrue.email
                  ? "Enter a valid email"
                  : ""
              }
              error={
                (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                  form.email
                ) ||
                  form.email == "") &&
                inputinfoTrue.email == true
                  ? true
                  : false
              }
              sx={{ width: "100%" }}
              name="email"
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Additional Email"
              variant="standard"
              onChange={input}
              sx={{ width: "100%" }}
              name="additional_email"
              value={form.additional_email}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Mobile"
              variant="standard"
              // onChange={input}
              name="mobile"
              onBlur={inputtrueFalse}
              error={
                (form.mobile == "" ||
                  form.mobile.toString().length < 4 ||
                  form.mobile.toString().length > 12) &&
                inputinfoTrue.mobile
                  ? true
                  : false
              }
              helperText={
                form.mobile == "" && inputinfoTrue.mobile
                  ? "Mobile is required"
                  : (form.mobile.toString().length < 4 ||
                      form.mobile.toString().length > 12) &&
                    inputinfoTrue.mobile
                  ? "Mobile number is not valid"
                  : ""
              }
              value={form.mobile}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Additional Contact Number"
              variant="standard"
              onChange={input}
              sx={{ width: "100%" }}
              name="additional_contact_number"
              value={form.additional_contact_number}
            />
          </div>
          <div className="input-element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.gender == "" && inputinfoTrue.gender ? true : false}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                label
                className="select-font-small"
                name="gender"
                onBlur={inputtrueFalse}
                onChange={input}
                value={form.gender}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              {form.gender == "" && inputinfoTrue.gender ? (
                <FormHelperText>Gender is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Date Of Birth"
              type="date"
              variant="standard"
              onBlur={inputtrueFalse}
              onChange={input}
              sx={{ width: "100%" }}
              name="dob"
              error={form.dob == "" && inputinfoTrue.dob ? true : false}
              helperText={
                form.dob == "" && inputinfoTrue.dob
                  ? "Date Of Birth is required"
                  : ""
              }
              value={form.dob}
              focused
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Address"
              variant="standard"
              onChange={input}
              onBlur={inputtrueFalse}
              sx={{ width: "100%" }}
              name="address"
              error={form.address == "" && inputinfoTrue.address ? true : false}
              helperText={
                form.address == "" && inputinfoTrue.address
                  ? "Address is required"
                  : ""
              }
              value={form.address}
              multiline
            />
          </div>
          <div className="input-element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.country == "" && inputinfoTrue.country ? true : false}
            >
              <InputLabel>Country</InputLabel>
              <Select
                label
                className="select-font-small"
                name="country"
                onChange={input}
                onBlur={inputtrueFalse}
                value={form.country}
              >
                {countryData.data.map((item) => {
                  return (
                    <MenuItem value={item.nicename}>{item.nicename}</MenuItem>
                  );
                })}
              </Select>
              {form.country == "" && inputinfoTrue.country ? (
                <FormHelperText>Country is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="State"
              variant="standard"
              onBlur={inputtrueFalse}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              sx={{ width: "100%" }}
              name="state"
              error={form.state == "" && inputinfoTrue.state ? true : false}
              helperText={
                form.state == "" && inputinfoTrue.state
                  ? "State is required"
                  : ""
              }
              value={form.state}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="City"
              variant="standard"
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
              error={form.city == "" && inputinfoTrue.city ? true : false}
              helperText={
                form.city == "" && inputinfoTrue.city ? "City is required" : ""
              }
              sx={{ width: "100%" }}
              name="city"
              onBlur={inputtrueFalse}
              value={form.city}
            />
          </div>
          <div className="input-element">
            <FormControl
              sx={{ width: "100%" }}
              variant="standard"
              error={
                (!form.password.match(/[A-Z]/g) ||
                  !form.password.match(/[a-z]/g) ||
                  !form.password.match(/[0-9]/g) ||
                  form.password == "" ||
                  form.password.length < 8 ||
                  form.password.length >= 20 ||
                  !form.password.match(/[!@#$%^&*()_+=]/g)) &&
                inputinfoTrue.password
                  ? true
                  : false
              }
            >
              <InputLabel>Password</InputLabel>
              <Input
                type={form.showpassword ? "text" : "password"}
                value={form.password}
                variant="standard"
                onBlur={inputtrueFalse}
                onChange={input}
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      // aria-label="toggle password visibility"
                      onClick={() => {
                        form.showpassword = !form.showpassword;
                        setForm({ ...form });
                      }}
                      edge="end"
                    >
                      {form.showpassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {form.password == "" && inputinfoTrue.password
                  ? "Enter your password"
                  : inputinfoTrue.password &&
                    (form.password.length < 8 || form.password.length >= 20)
                  ? "Password must contain atleast 8-20 characters"
                  : inputinfoTrue.password &&
                    (!form.password.match(/[A-Z]/g) ||
                      !form.password.match(/[a-z]/g) ||
                      !form.password.match(/[0-9]/g) ||
                      !form.password.match(/[!@#$%^&*()_+=]/g))
                  ? "Atleast one lower case, upper case,special character and number required"
                  : ""}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="input-element">
            <FormControl
              sx={{ width: "100%" }}
              variant="standard"
              error={
                (form.confirm_password == "" ||
                  form.password !== form.confirm_password) &&
                inputinfoTrue.confirm_password
                  ? true
                  : false
              }
            >
              <InputLabel>Confirm Password</InputLabel>
              <Input
                type={form.showconfirm_password ? "text" : "password"}
                value={form.confirm_password}
                variant="standard"
                onBlur={inputtrueFalse}
                onChange={input}
                name="confirm_password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      // aria-label="toggle password visibility"
                      onClick={() => {
                        form.showconfirm_password = !form.showconfirm_password;
                        setForm({ ...form });
                      }}
                      edge="end"
                    >
                      {form.showpassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {form.confirm_password == "" && inputinfoTrue.confirm_password
                  ? "Enter your Confirm password"
                  : form.password !== form.confirm_password &&
                    inputinfoTrue.confirm_password
                  ? "Passwords must match"
                  : ""}
              </FormHelperText>
            </FormControl>
          </div>

          {approvestatus ? (
            ""
          ) : (
            <div className="input-element">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={form.status == "" && inputinfoTrue.status ? true : false}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="status"
                  onBlur={inputtrueFalse}
                  onChange={input}
                  value={form.status}
                >
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Approve</MenuItem>
                </Select>
                {form.status == "" && inputinfoTrue.status ? (
                  <FormHelperText>Status is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
          )}
        </div>
      );
    } else if (dialogTitle == "View KYC Details") {
      if (kycForm.isLoader == true) {
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
            <div className="view-margeField">
              <div className="element">
                <label>Name :</label>
                <label>{kycForm.name}</label>
              </div>
              <div className="element">
                <label>Email :</label>
                <label>{kycForm.email}</label>
              </div>
              <div className="element">
                <label>ID Number :</label>
                <label>{kycForm.id_number}</label>
              </div>
              <div className="element">
                <label>Remark :</label>
                <label>{kycForm.feedback_remarks}</label>
              </div>
            </div>
            <br />
            <div className="view-image-section">
              {kycForm.front_image != "" ? (
                <div className="element">
                  <label>ID Front Img :</label>
                  {kycForm.front_image != "" ? (
                    <CustomImageModal image={`${kycForm.front_image}`} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {kycForm.back_image != "" ? (
                <div className="element">
                  <label>ID Back Img :</label>
                  {kycForm.back_image != "" ? (
                    <CustomImageModal image={`${kycForm.back_image}`} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      }
    } else if (dialogTitle == "Edit KYC Details") {
      return (
        <div>
          <div className="view-margeField">
            {/* <div className='element'>
                            <TextField label="First Name" variant="standard" sx={{ width: '100%' }} onChange={input} value={form.first_name} name='first_name' disabled />
                        </div> */}
            <div className="element">
              <TextField
                label="Name"
                variant="standard"
                sx={{ width: "100%" }}
                onChange={kycInput}
                value={kycForm.name}
                name="name"
                disabled
              />
            </div>
            <div className="element">
              <TextField
                label="Email"
                variant="standard"
                sx={{ width: "100%" }}
                onChange={kycInput}
                value={kycForm.email}
                name="email"
                disabled
              />
            </div>
            <div className="element">
              <TextField
                label="ID Number"
                variant="standard"
                sx={{ width: "100%" }}
                onChange={kycInput}
                value={kycForm.id_number}
                name="id_number"
              />
            </div>
            <div className="element">
              <TextField
                label="Remark"
                variant="standard"
                sx={{ width: "100%" }}
                onChange={kycInput}
                name="feedback_remarks"
                value={kycForm.feedback_remarks}
              />
            </div>
            <div className="element">
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Status
                </InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={kycForm.status}
                  onChange={kycInput}
                >
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Approved</MenuItem>
                  <MenuItem value="2">Rejected</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <br />
          <div className="view-image-section">
            <div className="element">
              <label>ID Front Img :</label>
              <label
                htmlFor="contained-button-file"
                className="fileuploadButton"
              >
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => onSelectFile(e, "aadhar_front")}
                />
                {selectedAadharCardFrontFile ? (
                  <img
                    src={previewAadharCardFront}
                    className="deposit-upload-image-preview"
                  />
                ) : kycForm.front_image != "" ? (
                  <img
                    src={kycForm.front_image}
                    className="deposit-upload-image-preview"
                  />
                ) : (
                  <Button variant="contained" component="span">
                    <i className="material-icons">backup</i>&nbsp;Upload
                  </Button>
                )}
              </label>
            </div>
            <div className="element">
              <label>ID Back Img :</label>
              <label
                htmlFor="contained-button-file_back"
                className="fileuploadButton"
              >
                <Input
                  accept="image/*"
                  id="contained-button-file_back"
                  type="file"
                  onChange={(e) => onSelectFile(e, "aadhar_back")}
                />
                {selectedAadharCardBackFile ? (
                  <img
                    src={previewAadharCardBack}
                    className="deposit-upload-image-preview"
                  />
                ) : kycForm.back_image != "" ? (
                  <img
                    src={kycForm.back_image}
                    className="deposit-upload-image-preview"
                  />
                ) : (
                  <Button variant="contained" component="span">
                    <i className="material-icons">backup</i>&nbsp;Upload
                  </Button>
                )}
              </label>
            </div>
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {form.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
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
              variant="contained"
              className="btn-gradient btn-success"
              onClick={formSubmit}
            >
              Create
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {form.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
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
              variant="contained"
              className="btn-gradient btn-success"
              onClick={updateFormSubmit}
            >
              Update
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "View KYC Details") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      );
    } else if (dialogTitle == "Edit KYC Details") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {kycForm.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
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
              variant="contained"
              className="btn-gradient btn-success"
              onClick={kycFormSubmit}
            >
              Update
            </Button>
          )}
        </div>
      );
    }
  };

  const input = (e) => {
    const { name, value } = e.target;

    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const inputtrueFalse = (event) => {
    var { name, value } = event.target;
    setinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const kycInput = (e) => {
    const { name, value } = e.target;

    setKycForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const formSubmit = async () => {
    if (form.first_name == "") {
      toast.error("Please enter first name");
    } else if (form.last_name == "") {
      toast.error("Please enter last name");
    } else if (form.email == "") {
      toast.error("Please enter email");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
    ) {
      toast.error("Enter a valid email");
    } else if (form.mobile == "") {
      toast.error("Please enter mobile number");
    } else if (
      form.mobile.toString().length < 4 ||
      form.mobile.toString().length > 12
    ) {
      toast.error("Mobile number is not valid");
    } else if (form.gender == "") {
      toast.error("Please select gender");
    } else if (form.dob == "") {
      toast.error("Please select date of birth");
    } else if (form.address == "") {
      toast.error("Please enter address");
    } else if (form.country == "") {
      toast.error("Please select country");
    } else if (form.state == "") {
      toast.error("Please select state");
    } else if (form.city == "") {
      toast.error("Please select city");
    } else if (form.status == "") {
      toast.error("Please select status");
    } else if (form.password == "") {
      toast.error("Please enter password");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        form.password
      )
    ) {
      // errors.portalPassword = "Password is requied";
      toast.error(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
    } else if (form.confirm_password == "") {
      toast.error("Please enter confirm password");
    } else if (form.confirm_password != form.password) {
      toast.error("Confirm password must be same like to password");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_first_name", form.first_name);
      param.append("user_last_name", form.last_name);
      param.append("user_email", form.email);
      param.append("user_phone", form.mobile);
      param.append("gender", form.gender);
      param.append("dob", form.dob);
      param.append("city", form.city);
      param.append("state", form.state);
      param.append("user_country", form.country);
      param.append("address", form.address);
      param.append("user_password", form.password);
      param.append("user_conf_password", form.confirm_password);
      param.append("user_status", form.status);
      param.append("action", "add_copy_master");
      await axios
        .post(`${Url}/ajaxfiles/copy_master/copy_master_manage.php`, param)
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
            setOpen(false);
            setRefresh(!refresh);
          }
        });
    }
  };

  const updateFormSubmit = async () => {
    if (form.first_name == "") {
      toast.error("Please enter first name");
    } else if (form.last_name == "") {
      toast.error("Please enter last name");
    } else if (form.email == "") {
      toast.error("Please enter email");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
    ) {
      toast.error("Enter a valid email");
    } else if (form.mobile == "") {
      toast.error("Please enter mobile number");
    } else if (
      form.mobile.toString().length < 4 ||
      form.mobile.toString().length > 12
    ) {
      toast.error("Mobile number is not valid");
    } else if (form.gender == "") {
      toast.error("Please select gender");
    } else if (form.dob == "") {
      toast.error("Please select date of birth");
    } else if (form.address == "") {
      toast.error("Please enter address");
    } else if (form.country == "") {
      toast.error("Please select country");
    } else if (form.state == "") {
      toast.error("Please select state");
    } else if (form.city == "") {
      toast.error("Please select city");
    } else if (form.status == "") {
      toast.error("Please select status");
    } else if (form.password == "") {
      toast.error("Please enter password");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        form.password
      )
    ) {
      // errors.portalPassword = "Password is requied";
      toast.error(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
    } else if (form.confirm_password == "") {
      toast.error("Please enter confirm password");
    } else if (form.confirm_password != form.password) {
      toast.error("Confirm password must be same like to password");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "update_copy_master");
      param.append("user_id", form.id);
      param.append("first_name", form.first_name);
      param.append("last_name", form.last_name);
      param.append("user_email", form.email);
      param.append("user_phone", form.mobile);
      param.append("gender", form.gender);
      param.append("dob", form.dob);
      param.append("city", form.city);
      param.append("state", form.state);
      param.append("user_country", form.country);
      param.append("address", form.address);
      param.append("new_password", form.password);
      param.append("confirm_password", form.confirm_password);
      param.append("user_status", form.status);
      param.append("additional_email", form.additional_email);
      param.append("additional_contact_number", form.additional_contact_number);

      await axios
        .post(`${Url}/ajaxfiles/copy_master/copy_master_manage.php`, param)
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
            setOpen(false);
            setRefresh(!refresh);
          }
        });
    }
  };

  const getCountry = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    axios.post(Url + "/datatable/get_countries.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        countryData.data = res.data.aaData;
        setCountryData({ ...countryData });
      }
    });
  };

  const edit = (data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "view_copy_master");
    param.append("user_id", data.user_id);
    axios
      .post(Url + "/ajaxfiles/copy_master/copy_master_manage.php", param)
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
          setForm({
            isLoader: false,
            id: data.user_id,
            first_name: res.data.data.user_first_name,
            last_name: res.data.data.user_last_name,
            email: res.data.data.user_email,
            mobile: res.data.data.user_phone,
            gender: res.data.data.gender,
            dob: res.data.data.dob,
            address: res.data.data.address,
            country: res.data.data.user_country,
            state: res.data.data.state,
            city: res.data.data.city,
            status: res.data.data.user_status,
            password: res.data.data.user_visible_password,
            confirm_password: res.data.data.user_visible_password,
            showpassword: false,
            showconfirm_password: false,
            additional_email: "",
            additional_contact_number: "",
          });
          setinputinfoTrue({
            first_name: false,
            last_name: false,
            email: false,
            mobile: false,
            gender: false,
            dob: false,
            address: false,
            country: false,
            state: false,
            city: false,
            status: false,
            password: false,
            confirm_password: false,
            additional_email: false,
            additional_contact_number: false,
          });
          if (res.data.data.user_status == "1") {
            setApprovestatus(true);
          } else {
            setApprovestatus(false);
          }
          setOpen(true);
          setDialogTitle("Edit");
        }
      });
  };

  const onSelectFile = (e, flag) => {
    if (flag == "aadhar_front") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewAadharCardFront(undefined);
        return;
      }

      setSelectedAadharCardFrontFile(e.target.files[0]);
    } else if (flag == "aadhar_back") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewAadharCardBack(undefined);
        return;
      }

      setSelectedAadharCardBackFile(e.target.files[0]);
    }
  };

  const kycFormSubmit = async () => {
    if (kycForm.feedback_remarks == "") {
      toast.error("Please enter remark");
    } else if (kycForm.status == "") {
      toast.error("Please select status");
    } else {
      kycForm.isLoader = true;
      setKycForm({ ...kycForm });
      const param = new FormData();
      param.append("action", "update_kyc");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("aadhar_card_number", kycForm.id_number);
      param.append("kyc_status", kycForm.status);
      param.append("feedback_remarks", kycForm.feedback_remarks);
      param.append("kyc_id", kycForm.id);
      // param.append('user_id', kycForm.user_id);

      if (selectedAadharCardFrontFile) {
        param.append("aadhar_card_front_image", selectedAadharCardFrontFile);
      }

      if (selectedAadharCardBackFile) {
        param.append("aadhar_card_back_image", selectedAadharCardBackFile);
      }

      await axios
        .post(`${Url}/ajaxfiles/copy_master/copy_master_kyc_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          kycForm.isLoader = false;
          setKycForm({ ...kycForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setRefresh(!refresh);
            toast.success(res.data.message);
            setOpen(false);
            setKycForm({
              isLoader: false,
              id: "",
              name: "",
              id_number: "",
              back_image: "",
              front_image: "",
              email: "",
              feedback_remarks: "",
              feedback_remarks: "",
              status: "",
            });
          }
        });
    }
  };

  useEffect(() => {
    if (!selectedAadharCardFrontFile) {
      setPreviewAadharCardFront(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAadharCardFrontFile);
    setPreviewAadharCardFront(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAadharCardFrontFile]);

  useEffect(() => {
    if (!selectedAadharCardBackFile) {
      setPreviewAadharCardBack(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAadharCardBackFile);
    setPreviewAadharCardBack(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAadharCardBackFile]);

  useEffect(() => {
    getCountry();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Copy Master Uses</p>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  className="tabsBar"
                >
                  <Tab label="Copy Master List" />
                  {prop.permission.mm_kyc_list == 1 ? (
                    <Tab label="Copy Master KYC LIST" />
                  ) : (
                    ""
                  )}
                </Tabs>
                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <CommonFilter
                      search={searchBy}
                      searchWord={setSearchKeyword}
                      setParam={setParam}
                      lastUpdatedBy={resData.modified_by_users}
                    />
                    <br />
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="pending-all-15px"
                    >
                      <div className="actionGroupButton">
                        <Button
                          variant="contained"
                          className="add"
                          onClick={openDialogbox}
                        >
                          Add
                        </Button>
                      </div>
                      <br />
                      <CardContent className="py-3">
                        <Grid container spacing={2}>
                          <Grid item sm={12} md={12} lg={12}>
                            <CommonTable
                              url={`${Url}/datatable/copy_master/copy_master_list.php`}
                              column={column}
                              sort="2"
                              search={searchBy}
                              searchWord={searchKeyword}
                              param={param}
                              refresh={refresh}
                              setResData={setResData}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Paper>
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <CommonFilter
                      search={kycSearchBy}
                      searchWord={setSearchKeyword}
                      setParam={setParam}
                      lastUpdatedBy={resData.modified_by_users}
                    />
                    <br />
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="pending-all-15px"
                    >
                      {/* <div className='actionGroupButton'>
                                                <Button variant="contained" className="add" onClick={openDialogbox}>Add</Button>
                                            </div>
                                            <br /> */}
                      <CardContent className="py-3">
                        <Grid container spacing={2}>
                          <Grid item sm={12} md={12} lg={12}>
                            <CommonTable
                              url={`${Url}/datatable/copy_master/copy_master_kyc_list.php`}
                              column={kycColumn}
                              sort="2"
                              search={kycSearchBy}
                              searchWord={searchKeyword}
                              param={param}
                              refresh={refresh}
                              setResData={setResData}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Paper>
                  </TabPanel>
                </SwipeableViews>
              </Grid>
            </Grid>

            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              className="modalWidth100"
              fullWidth={fullWidth}
              maxWidth={maxWidth}
            >
              <BootstrapDialogTitle
                id="customized-dialog-title"
                className="dialogTitle"
                onClose={handleClose}
              >
                {dialogTitle}
              </BootstrapDialogTitle>
              <DialogContent dividers>{manageContent()}</DialogContent>
              <DialogActions>{manageDialogActionButton()}</DialogActions>
            </BootstrapDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyMasterUses;
