import {
  Button,
  CardContent,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@emotion/react";
import { styled } from "@mui/material/styles";
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
const re = /^[A-Za-z_ ]*$/;

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

const CopyUser = (prop) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const [refresh, setRefresh] = useState(false);
  const [title, setTitle] = useState("Client List");
  const [value, setValue] = useState(0);
  const [resData, setResData] = useState({});
  const [searchBy, setSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "name",
    },
    {
      label: "WALLET CODE",
      value: false,
      name: "wallet_code",
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
      label: "COUNTRY",
      value: false,
      name: "user_country",
    },
    {
      label: "SPONSOR NAME",
      value: false,
      name: "sponsor_name",
    },
    {
      label: "MANAGER NAME",
      value: false,
      name: "manager_name",
    },
  ]);

  const [clientPasswordSearchBy, setClientPasswordSearchBy] = useState([
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
      label: "Password",
      value: false,
      name: "user_visible_password",
    },
  ]);
  const [form, setForm] = useState({
    isLoader: false,
    user_id: "",
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_phone: "",
    user_gender: "",
    user_country: "",
    user_address_1: "",
    user_address_2: "",
    login_block: "",
    user_dob: "",
    user_city: "",
  });
  const [inputinfoTrue, setinputinfoTrue] = useState({
    user_first_name: false,
    user_last_name: false,
    user_email: false,
    user_phone: false,
    user_gender: false,
    user_country: false,
    user_address_1: false,
    user_address_2: false,
    login_block: false,
    user_dob: false,
    user_city: false,
  });
  const [countryData, setCountryData] = useState({
    data: [],
  });
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
      name: "WALLET CODE",
      selector: (row) => {
        return <span title={row.wallet_code}>{row.wallet_code}</span>;
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
      grow: 0.5,
    },
    {
      name: "COUNTRY",
      selector: (row) => {
        return <span title={row.user_country}>{row.user_country}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
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
      grow: 0.5,
    },
    {
      name: "SPONSOR NAME",
      selector: (row) => {
        return <span title={row.sponsor_name}>{row.sponsor_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Sales MANAGER",
      selector: (row) => {
        return <span title={row.manager_name}>{row.manager_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.date}>{row.date}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
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
            {prop.permission.update_user_details == 1 ? (
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

  const clientPasswordColumn = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
      sortable: true,
      reorder: true,
      grow: 0.4,
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
      grow: 0.5,
    },
    {
      name: "ACCOUNT TYPE",
      selector: (row) => {
        return <span title={row.account_type}>{row.account_type}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
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
      grow: 0.5,
    },
    /* {
            name: 'Action',
            button: true,
            cell: row => {
                return <div className='actionButtonGroup'>
                    <Button
                        className='btn-edit'
                        onClick={(event) => edit(row)}
                        {...row}
                        style={{ color: 'rgb(144 145 139)' }}>
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </Button>
                </div>
            },
            ignoreRowClick: true,
            allowOverflow: true
        } */
  ];

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
        password: "",
        confirm_password: "",
        additional_email: "",
        additional_contact_number: "",
      });
    }
    setOpen(true);
  };

  const manageContent = () => {
    if (dialogTitle == "Edit") {
      return (
        <div className="mmManagement-section">
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="First Name"
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
              error={
                form.user_first_name == "" && inputinfoTrue.user_first_name
                  ? true
                  : false
              }
              helperText={
                form.user_first_name == "" && inputinfoTrue.user_first_name
                  ? "First Name is required"
                  : ""
              }
              sx={{ width: "100%" }}
              name="user_first_name"
              value={form.user_first_name}
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
              error={
                form.user_last_name == "" && inputinfoTrue.user_last_name
                  ? true
                  : false
              }
              helperText={
                form.user_last_name == "" && inputinfoTrue.user_last_name
                  ? "Last Name is required"
                  : ""
              }
              name="user_last_name"
              value={form.user_last_name}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Email"
              variant="standard"
              onChange={input}
              onBlur={inputtrueFalse}
              sx={{ width: "100%" }}
              name="user_email"
              helperText={
                form.user_email == "" && inputinfoTrue.user_email
                  ? "Email is required"
                  : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      form.user_email
                    ) && inputinfoTrue.user_email
                  ? "Enter a valid email"
                  : ""
              }
              error={
                (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                  form.user_email
                ) ||
                  form.user_email == "") &&
                inputinfoTrue.user_email == true
                  ? true
                  : false
              }
              value={form.user_email}
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Mobile"
              variant="standard"
              name="user_phone"
              onBlur={inputtrueFalse}
              value={form.user_phone}
              error={
                (form.user_phone == "" ||
                  form.user_phone.toString().length < 4 ||
                  form.user_phone.toString().length > 12) &&
                inputinfoTrue.user_phone
                  ? true
                  : false
              }
              helperText={
                form.user_phone == "" && inputinfoTrue.user_phone
                  ? "Mobile Number is required"
                  : (form.user_phone.toString().length < 4 ||
                      form.user_phone.toString().length > 12) &&
                    inputinfoTrue.user_phone
                  ? "Mobile number is not valid"
                  : ""
              }
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
              error={
                inputinfoTrue.user_gender == true && form.user_gender == ""
                  ? true
                  : false
              }
            >
              <InputLabel>Gender</InputLabel>
              <Select
                label
                className="select-font-small"
                name="user_gender"
                onChange={input}
                onBlur={inputtrueFalse}
                value={form.user_gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
              {inputinfoTrue.user_gender == true && form.user_gender == "" ? (
                <FormHelperText>Please select gender</FormHelperText>
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
              name="user_dob"
              error={
                form.user_phone == "" && inputinfoTrue.user_phone ? true : false
              }
              helperText={
                form.user_phone == "" && inputinfoTrue.user_phone
                  ? "Mobile Number is required"
                  : ""
              }
              value={form.user_dob}
              focused
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Address 1"
              variant="standard"
              onChange={input}
              error={
                form.user_address_1 == "" && inputinfoTrue.user_address_1
                  ? true
                  : false
              }
              helperText={
                form.user_address_1 == "" && inputinfoTrue.user_address_1
                  ? "Address 1 is required"
                  : ""
              }
              onBlur={inputtrueFalse}
              sx={{ width: "100%" }}
              name="user_address_1"
              value={form.user_address_1}
              multiline
            />
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="Address 2"
              variant="standard"
              onChange={input}
              sx={{ width: "100%" }}
              onBlur={inputtrueFalse}
              name="user_address_2"
              value={form.user_address_2}
              multiline
            />
          </div>
          <div className="input-element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.user_country == "" && inputinfoTrue.user_country
                  ? true
                  : false
              }
            >
              <InputLabel>Country</InputLabel>
              <Select
                label
                className="select-font-small"
                name="user_country"
                onChange={input}
                onBlur={inputtrueFalse}
                value={form.user_country}
              >
                {countryData.data.map((item) => {
                  return (
                    <MenuItem value={item.nicename}>{item.nicename}</MenuItem>
                  );
                })}
              </Select>
              {form.user_country == "" && inputinfoTrue.user_country ? (
                <FormHelperText>Country is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="input-element">
            <TextField
              className="input-font-small"
              label="City"
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
              name="user_city"
              value={form.user_city}
            />
          </div>
          <div className="input-element">
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Login Block</InputLabel>
              <Select
                label
                className="select-font-small"
                name="login_block"
                onChange={input}
                onBlur={inputtrueFalse}
                value={form.login_block}
              >
                <MenuItem value="0">Active</MenuItem>
                <MenuItem value="1">Block</MenuItem>
              </Select>
            </FormControl>
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
            <Button variant="contained" className="btn-gradient btn-success">
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

  const edit = (data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "view_user_details");
    param.append("user_id", data.user_id);
    axios.post(Url + "/ajaxfiles/pamm/user_manage.php", param).then((res) => {
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
          user_id: data.user_id,
          user_first_name: res.data.data.user_first_name,
          user_last_name: res.data.data.user_last_name,
          user_email: res.data.data.user_email,
          user_phone: res.data.data.user_phone,
          user_gender: res.data.data.user_gender,
          user_country: res.data.data.user_country,
          user_address_1: res.data.data.user_address_1,
          user_address_2: res.data.data.user_address_2,
          login_block: res.data.data.login_block,
          user_city: res.data.data.user_city,
          user_dob: res.data.data.user_dob,
        });
        setinputinfoTrue({
          user_first_name: false,
          user_last_name: false,
          user_email: false,
          user_phone: false,
          user_gender: false,
          user_country: false,
          user_address_1: false,
          user_address_2: false,
          login_block: false,
          user_dob: false,
          user_city: false,
        });
        setDialogTitle("Edit");
        setOpen(true);
      }
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == 0) {
      setTitle("Client List");
    }
    if (newValue == 1) {
      setTitle("Client Password List");
    }
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const updateFormSubmit = () => {
    if (form.user_first_name == "") {
      toast.error("Please enter first name");
    } else if (form.user_last_name == "") {
      toast.error("Please enter last name");
    } else if (form.user_email == "") {
      toast.error("Please enter email address");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.user_email)
    ) {
      toast.error("Enter a valid email");
    } else if (form.user_phone == "") {
      toast.error("Please enter mobile number");
    } else if (
      form.user_phone.toString().length < 4 ||
      form.user_phone.toString().length > 12
    ) {
      toast.error("mobile number is not valid");
    } else if (form.user_gender == "") {
      toast.error("Please select gender");
    } else if (form.user_address_1 == "") {
      toast.error("Please enter address 1");
    } else if (form.user_country == "") {
      toast.error("Please select country");
    } else if (form.login_block == "") {
      toast.error("Please select login block");
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
      param.append("action", "update_user_details");
      param.append("user_id", form.user_id);
      param.append("user_first_name", form.user_first_name);
      param.append("user_last_name", form.user_last_name);
      param.append("user_email", form.user_email);
      param.append("user_phone", form.user_phone);
      param.append("user_gender", form.user_gender);
      param.append("user_country", form.user_country);
      param.append("user_address_1", form.user_address_1);
      param.append("user_address_2", form.user_address_2);
      param.append("login_block", form.login_block);
      param.append("user_dob", form.user_dob);
      param.append("user_city", form.user_city);
      axios.post(Url + "/ajaxfiles/pamm/user_manage.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          form.isLoader = false;
          setForm({ ...form });
        } else {
          toast.success(res.data.message);
          setRefresh(!refresh);
          setOpen(false);
          form.isLoader = false;
          setForm({ ...form });
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
                <p className="main-heading">User Management</p>
                {/* <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  className="tabsBar"
                >
                  <Tab label="CLIENT LIST" />
                  <Tab label="CLIENT PASSWORD LIST" />
                </Tabs> */}
                {/* <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}> */}
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
                  {/* <div className='actionGroupButton'>
                                                <Button variant="contained" onClick={handleClickOpen}>Add Deposit</Button>
                                            </div>
                                            <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/pamm/pamm_client_list.php`}
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
                {/* </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <CommonFilter
                      search={clientPasswordSearchBy}
                      searchWord={setSearchKeyword}
                      setParam={setParam}
                    />
                    <br />
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="pending-all-15px"
                    >
                      <CardContent className="py-3">
                        <Grid container spacing={2}>
                          <Grid item sm={12} md={12} lg={12}>
                            <CommonTable
                              url={`${Url}/datatable/pamm/pamm_client_password_list.php`}
                              column={clientPasswordColumn}
                              sort="2"
                              search={clientPasswordSearchBy}
                              searchWord={searchKeyword}
                              param={param}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Paper>
                  </TabPanel>
                </SwipeableViews> */}
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

export default CopyUser;
