import React, { useState } from "react";
import "./employees.css";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
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
import CommonTable from "../common/CommonTable";
import { useNavigate } from "react-router-dom";
import CustomImageModal from "../common/CustomImageModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import CommonFilter from "../common/CommonFilter";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import NewDate from "../common/NewDate";

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
const Employees = (prop) => {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [checkStatus, setcheckStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [resData, setResData] = useState({});
  const [maxWidth, setMaxWidth] = useState("sm");
  const [searchBy, setSearchBy] = useState([
    {
      label: "ROLE NAME",
      value: false,
      name: "role",
    },
    {
      label: "NAME",
      value: false,
      name: "user_first_name",
    },
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    // {
    //   label: "PAYMENT METHOD",
    //   value: false,
    //   name: "payment_method",
    // },
    {
      label: "Phone Number",
      value: false,
      name: "user_phone",
    },
    {
      label: "MANAGER",
      value: false,
      name: "master_manager_name",
    },
    {
      label: "ACCOUNT TARGET",
      value: false,
      name: "ac_target",
    },
    {
      label: "MONEY IN TARGET",
      value: false,
      name: "money_in_target",
    },
  ]);
  const re = /^[A-Za-z_ ]*$/;

  const [list, setList] = useState({
    roleList: [],
    get_regional_head: [],
    get_head_of_sales: [],
    mangerList: [],
  });
  const [form, setForm] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_password: "",
    role_id: "",
    manager_master_id: "",
    ac_target: "",
    get_regional_head: "",
    get_head_of_sales: "",
    money_in_target: "",
    ib_ac_target: "",
    user_status: "",
    user_phone: "",
    user_id: "",
    isLoader: false,
  });
  toast.configure();
  const handleClose = () => {
    setinfoTrue({
      user_first_name: false,
      user_last_name: false,
      user_email: false,
      user_password: false,
      role_id: false,
      manager_master_id: false,
      ac_target: false,
      money_in_target: false,
      user_status: false,
      user_phone: false,
    });
    setOpen(false);
  };
  const trueFalse = (event) => {
    var { name, value } = event.target;
    setinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const [infoTrue, setinfoTrue] = useState({
    user_first_name: false,
    user_last_name: false,
    user_email: false,
    user_password: false,
    role_id: false,
    manager_master_id: false,
    ac_target: false,
    money_in_target: false,
    user_status: false,
    user_phone: false,
  });

  const input = (e) => {
    const { name, value } = e.target;
    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const getRoleList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_roles");
    axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      list.roleList = res.data.data;
      setList({ ...list });
    });
  };
  const getHeadOfSales = () => {
    const param = new FormData();

    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_head_of_sales");
    axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      list.get_head_of_sales = res.data.data;
      setList({ ...list });
    });
  };
  const getRegionalHead = () => {
    const param = new FormData();

    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_regional_head");
    axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      list.get_regional_head = res.data.data;
      setList({ ...list });
    });
  };
  const getManagerList = () => {
    const param = new FormData();

    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_manager_master");
    axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      list.mangerList = res.data.data;
      setList({ ...list });
    });
  };
  const formSubmit = () => {
    if (form.user_first_name == "") {
      toast.error("First Name is required");
    } else if (form.user_last_name == "") {
      toast.error("Last Name is required");
    } else if (form.user_email == "") {
      toast.error("Email is required");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.user_email)
    ) {
      toast.error("Enter a valid email");
    } else if (form.user_phone == "") {
      toast.error("Phone number is required");
    } else if (
      form.user_phone.toString().length < 4 ||
      form.user_phone.toString().length > 12
    ) {
      toast.error("Phone number is not valid");
    } else if (form.role_id == "" || form.role_id == "0") {
      toast.error("Role is required");
    } else if (!form.manager_master_id && form.role_id == "3") {
      toast.error("Manager is required");
    } else if (!form.get_regional_head && form.role_id == "2") {
      toast.error("Regional Head is required");
    } else if (!form.get_head_of_sales && form.role_id == "20") {
      toast.error("Head Of Sales is required");
    } else if (form.ac_target == "" && form.role_id == "3") {
      toast.error("Account target is required");
    } else if (form.money_in_target == "" && form.role_id == "3") {
      toast.error("Money in target is required");
    } else if (form.ib_ac_target == "" && form.role_id == "3") {
      toast.error("Ib Account Target is required");
    }
    // else if (form.user_password == "") {
    //   toast.error("Enter your password");
    // } else if (
    //   !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
    //     form.user_password
    //   )
    // ) {
    //   toast.error(
    //     "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    //   );
    // }
    else if (form.user_status == "") {
      toast.error("Status is required");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (form.role_id == "3") {
        param.append(
          "manager_master_id",
          form.manager_master_id?.manager_master_id
        );
        param.append("ac_target", form.ac_target);
        param.append("money_in_target", form.money_in_target);
        param.append("ib_ac_target", form.ib_ac_target);
      }
      if (form.role_id == "2") {
        param.append("regional_head", form.get_regional_head?.regional_head);
      }
      if (form.role_id == "20") {
        param.append("head_of_sales", form.get_head_of_sales?.head_of_sales);
      }
      param.append("action", "edit_employee");
      param.append("user_first_name", form.user_first_name);
      param.append("user_last_name", form.user_last_name);
      param.append("user_email", form.user_email);
      param.append("user_password", form.user_password);
      param.append("employee_role_id", form.role_id);

      param.append("user_status", form.user_status);
      param.append("user_phone", form.user_phone);

      param.append("user_id", form.user_id);
      form.isLoader = true;
      setForm({ ...form });
      axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
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
          setinfoTrue({
            user_first_name: false,
            user_last_name: false,
            user_email: false,
            user_password: false,
            role_id: false,
            manager_master_id: false,
            ac_target: false,
            money_in_target: false,
            user_status: false,
            user_phone: false,
          });
          setOpen(false);
          setRefresh(!refresh);
          form.isLoader = false;
          setForm({ ...form });
        }
      });
    }
  };
  const formDelete = () => {
    const param = new FormData();

    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "delete_employee");
    param.append("user_id", form.user_id);
    form.isLoader = true;
    setForm({ ...form });
    axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
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
        setinfoTrue({
          user_first_name: false,
          user_last_name: false,
          user_email: false,
          user_password: false,
          role_id: false,
          manager_master_id: false,
          ac_target: false,
          money_in_target: false,
          user_status: false,
          user_phone: false,
        });
        setOpen(false);
        setRefresh(!refresh);
        form.isLoader = false;
        setForm({ ...form });
      }
    });
  };

  const Change_Auth_Key = () => {
    const param = new FormData();

    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "expired_current_session");
    param.append("user_id", form.user_id);
    form.isLoader = true;
    setForm({ ...form });
    axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
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
        setinfoTrue({
          user_first_name: false,
          user_last_name: false,
          user_email: false,
          user_password: false,
          role_id: false,
          manager_master_id: false,
          ac_target: false,
          money_in_target: false,
          user_status: false,
          user_phone: false,
        });
        setOpen(false);
        setRefresh(!refresh);
        form.isLoader = false;
        setForm({ ...form });
      }
    });
  };
  const formAdd = () => {
    if (form.user_first_name == "") {
      toast.error("First Name is required");
    } else if (form.user_last_name == "") {
      toast.error("Last Name is required");
    } else if (form.user_email == "") {
      toast.error("Email is required");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.user_email)
    ) {
      toast.error("Enter a valid email");
    } else if (form.user_phone == "") {
      toast.error("Phone is required");
    } else if (
      form.user_phone.toString().length < 4 ||
      form.user_phone.toString().length > 12
    ) {
      toast.error("Phone number is not valid");
    } else if (form.role_id == "" || form.role_id == "0") {
      toast.error("Role is required");
    } else if (!form.manager_master_id && form.role_id == "3") {
      toast.error("Manager is required");
    } else if (!form.get_regional_head && form.role_id == "2") {
      toast.error("Regional Head is required");
    } else if (!form.get_head_of_sales && form.role_id == "20") {
      toast.error("Head Of Sales is required");
    } else if (form.ac_target == "" && form.role_id == "3") {
      toast.error("Account target is required");
    } else if (form.money_in_target == "" && form.role_id == "3") {
      toast.error("Money in target is required");
    } else if (form.ib_ac_target == "" && form.role_id == "3") {
      toast.error("Ib Account Target is required");
    }
    else if (form.user_status == "") {
      toast.error("Status is required");
    } else {
      const param = new FormData();

      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (form.role_id == "3") {
        param.append(
          "manager_master_id",
          form.manager_master_id?.manager_master_id
        );
        param.append("ac_target", form.ac_target);
        param.append("money_in_target", form.money_in_target);
        param.append("ib_ac_target", form.ib_ac_target);
      }
      if (form.role_id == "2") {
        param.append("regional_head", form.get_regional_head.regional_head);
      }
      if (form.role_id == "20") {
        param.append("head_of_sales", form.get_head_of_sales.head_of_sales);
      }
      param.append("action", "add_employee");
      param.append("user_first_name", form.user_first_name);
      param.append("user_last_name", form.user_last_name);
      param.append("user_email", form.user_email);
      param.append("user_password", form.user_password);
      param.append("employee_role_id", form.role_id);

      param.append("user_status", form.user_status);
      param.append("user_phone", form.user_phone);
      form.isLoader = true;
      setForm({ ...form });
      axios.post(Url + "/ajaxfiles/employee_manage.php", param).then((res) => {
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
          setinfoTrue({
            user_first_name: false,
            user_last_name: false,
            user_email: false,
            user_password: false,
            role_id: false,
            manager_master_id: false,
            ac_target: false,
            money_in_target: false,
            user_status: false,
            user_phone: false,
          });
          setOpen(false);
          setRefresh(!refresh);
          form.isLoader = false;
          setForm({ ...form });
        }
      });
    }
  };
  const manageContent = () => {
    if (dialogTitle == "Update Employees" || dialogTitle == "Add Employees") {
      return (
        <div>
          <div className="d-flex flexWrapm">
            <div className="element twofild">
              <TextField
                label="First Name"
                variant="standard"
                sx={{ width: "100%" }}
                name="user_first_name"
                // onChange={input}
                value={form.user_first_name}
                error={
                  form.user_first_name == "" && infoTrue.user_first_name
                    ? true
                    : false
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
                onBlur={trueFalse}
                helperText={
                  form.user_first_name == "" && infoTrue.user_first_name
                    ? "First name is required"
                    : ""
                }
              />
            </div>
            <div className="element w-100">
              <TextField
                label="Last Name"
                id="standard-error-helper-text"
                variant="standard"
                sx={{ width: "100%" }}
                name="user_last_name"
                value={form.user_last_name}
                error={
                  form.user_last_name == "" && infoTrue.user_last_name
                    ? true
                    : false
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
                onBlur={trueFalse}
                helperText={
                  form.user_last_name == "" && infoTrue.user_last_name
                    ? "Last name is required"
                    : ""
                }
              />
            </div>
          </div>
          <div className="d-flex flexWrapm padingtopmy5create">
            <div className="element twofild">
              <TextField
                label="Email"
                variant="standard"
                error={
                  (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    form.user_email
                  ) ||
                    form.user_email == "") &&
                  infoTrue.user_email == true
                    ? true
                    : false
                }
                // disabled={dialogTitle == "Add Employees" ? false : true}
                sx={{ width: "100%" }}
                name="user_email"
                onChange={input}
                value={form.user_email}
                onBlur={trueFalse}
                helperText={
                  form.user_email == "" && infoTrue.user_email
                    ? "Email is required"
                    : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        form.user_email
                      ) && infoTrue.user_email
                    ? "Enter a valid email"
                    : ""
                }
              />
            </div>{" "}
            <div className="element w-100">
              <TextField
                label="Phone"
                variant="standard"
                sx={{ width: "100%" }}
                type="text"
                error={
                  (form.user_phone.toString().length < 4 ||
                    form.user_phone.toString().length > 12 ||
                    form.user_phone == "") &&
                  infoTrue.user_phone
                    ? true
                    : false
                }
                name="user_phone"
                onBlur={trueFalse}
                onChange={(e) => {
                  if (Number(e.target.value) > 0) {
                    form.user_phone = Number(e.target.value);
                    setForm({
                      ...form,
                    });
                  } else if (e.target.value == "") {
                    form.user_phone = "";
                    setForm({
                      ...form,
                    });
                  }
                }}
                value={form.user_phone}
                helperText={
                  form.user_phone == "" && infoTrue.user_phone
                    ? "Phone is required"
                    : (form.user_phone.toString().length < 4 ||
                        form.user_phone.toString().length > 12) &&
                      infoTrue.user_phone
                    ? "Phone number is not valid"
                    : ""
                }
              />
            </div>{" "}
          </div>
          <div className="element padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={infoTrue.role_id && form.role_id == "" ? true : false}
            >
              <InputLabel>Role</InputLabel>
              <Select
                label
                value={form.role_id}
                // className="select-font-small"
                name="role_id"
                onChange={(e) => {
                  input(e);
                  if (e.target.value == 2) {
                    getRegionalHead();
                  }
                  if (e.target.value == "20") {
                    getHeadOfSales();
                  }
                  if (e.target.value == 3) {
                    getManagerList();
                  }
                }}
                onBlur={trueFalse}
              >
                {list.roleList.map((item) => {
                  return (
                    <MenuItem value={item.role_id}>{item.role_name}</MenuItem>
                  );
                })}
              </Select>
              {infoTrue.role_id && form.role_id == "" ? (
                <FormHelperText>Role is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>{" "}
          {form.role_id == "3" ? (
            <>
              <div className="element padingtopmy5create ">
                <Autocomplete
                  options={list.mangerList}
                  value={form.manager_master_id}
                  getOptionLabel={(option) =>
                    option ? option.manager_master_name : ""
                  }
                  onChange={(event, newValue) => {
                    form.manager_master_id = newValue;
                    setForm({ ...form });
                  }}
                  className="w-100"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Manager"
                      name="manager_master_id"
                      onBlur={trueFalse}
                      error={
                        !form.manager_master_id && infoTrue.manager_master_id
                          ? true
                          : false
                      }
                      helperText={
                        !form.manager_master_id && infoTrue.manager_master_id
                          ? "Manager is required"
                          : ""
                      }
                      variant="standard"
                    />
                  )}
                />
                {/* <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  error={
                    infoTrue.manager_master_id && form.manager_master_id == ""
                      ? true
                      : false
                  }
                >
                  <InputLabel>Manager</InputLabel>
                  <Select
                    label
                    value={form.manager_master_id}
                    // className="select-font-small"
                    name="manager_master_id"
                    onChange={input}
                    onBlur={trueFalse}
                  >
                    {list.mangerList.map((item) => {
                      return (
                        <MenuItem value={item.manager_master_id}>
                          {item.manager_master_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {infoTrue.manager_master_id &&
                  form.manager_master_id == "" ? (
                    <FormHelperText>Manager is required</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl> */}
              </div>
              <br />
            </>
          ) : (
            ""
          )}
          {form.role_id == "2" ? (
            <>
              <div className="element padingtopmy5create ">
                <Autocomplete
                  options={list.get_regional_head}
                  value={form.get_regional_head}
                  getOptionLabel={(option) => (option ? option.name : "")}
                  onChange={(event, newValue) => {
                    form.get_regional_head = newValue;
                    setForm({ ...form });
                  }}
                  className="w-100"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Regional Head"
                      name="get_regional_head"
                      onBlur={trueFalse}
                      error={
                        !form.get_regional_head && infoTrue.get_regional_head
                          ? true
                          : false
                      }
                      helperText={
                        !form.get_regional_head && infoTrue.get_regional_head
                          ? "Regional Head is required"
                          : ""
                      }
                      variant="standard"
                    />
                  )}
                />
              </div>
              <br />
            </>
          ) : (
            ""
          )}
          {form.role_id == "20" ? (
            <>
              <div className="element padingtopmy5create ">
                <Autocomplete
                  options={list.get_head_of_sales}
                  value={form.get_head_of_sales}
                  getOptionLabel={(option) => (option ? option.name : "")}
                  onChange={(event, newValue) => {
                    form.get_head_of_sales = newValue;
                    setForm({ ...form });
                  }}
                  className="w-100"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Head Of Sales"
                      name="get_head_of_sales"
                      onBlur={trueFalse}
                      error={
                        !form.get_head_of_sales && infoTrue.get_head_of_sales
                          ? true
                          : false
                      }
                      helperText={
                        !form.get_head_of_sales && infoTrue.get_head_of_sales
                          ? "Head Of Sales is required"
                          : ""
                      }
                      variant="standard"
                    />
                  )}
                />
              </div>
              <br />
            </>
          ) : (
            ""
          )}
          {form.role_id == "3" ? (
            <>
              <div className="d-flex padingtopmy5create flexWrapm">
                <div className="element twofild">
                  <TextField
                    label="Account Target"
                    variant="standard"
                    type="text"
                    value={form.ac_target}
                    sx={{ width: "100%" }}
                    error={
                      infoTrue.ac_target && form.ac_target == "" ? true : false
                    }
                    name="ac_target"
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        form.ac_target = e.target.value;
                        setForm({
                          ...form,
                        });
                      } else if (e.target.value == "" || e.target.value == 0) {
                        form.ac_target = 0;
                        setForm({
                          ...form,
                        });
                      }
                    }}
                    onBlur={trueFalse}
                    helperText={
                      infoTrue.ac_target && form.ac_target == ""
                        ? "Account Target is required"
                        : ""
                    }
                  />
                </div>{" "}
                <div className="element w-100">
                  <TextField
                    label="Money In Target"
                    type="text"
                    variant="standard"
                    error={
                      infoTrue.money_in_target && form.money_in_target == ""
                        ? true
                        : false
                    }
                    sx={{ width: "100%" }}
                    name="money_in_target"
                    value={form.money_in_target}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        form.money_in_target = e.target.value;
                        setForm({
                          ...form,
                        });
                      } else if (e.target.value == "" || e.target.value == 0) {
                        form.money_in_target = 0;
                        setForm({
                          ...form,
                        });
                      }
                    }}
                    onBlur={trueFalse}
                    helperText={
                      infoTrue.money_in_target && form.money_in_target == ""
                        ? "Money In Target is required"
                        : ""
                    }
                  />
                </div>
                <div className="element w-100">
                  <TextField
                    label="Ib Account Target"
                    type="text"
                    variant="standard"
                    error={
                      infoTrue.ib_ac_target && form.ib_ac_target == ""
                        ? true
                        : false
                    }
                    sx={{ width: "100%" }}
                    name="ib_ac_target"
                    value={form.ib_ac_target}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        form.ib_ac_target = e.target.value;
                        setForm({
                          ...form,
                        });
                      } else if (e.target.value == "" || e.target.value == 0) {
                        form.ib_ac_target = 0;
                        setForm({
                          ...form,
                        });
                      }
                    }}
                    onBlur={trueFalse}
                    helperText={
                      infoTrue.ib_ac_target && form.ib_ac_target == ""
                        ? "Ib Account Target is required"
                        : ""
                    }
                  />
                </div>
              </div>
              <br />
            </>
          ) : (
            ""
          )}
          <div className="d-flex padingtopmy5create flexWrapm">
            <div className="element twofild">
              <TextField
                label="Password"
                type="password"
                // error={
                //   (!form.user_password.match(/[A-Z]/g) ||
                //     !form.user_password.match(/[a-z]/g) ||
                //     !form.user_password.match(/[0-9]/g) ||
                //     form.user_password == "" ||
                //     form.user_password.length < 8 ||
                //     form.user_password.length > 20 ||
                //     !form.user_password.match(/[!@#$%^&*()_+=]/g)) &&
                //   infoTrue.user_password == true
                //     ? true
                //     : false
                // }
                variant="standard"
                sx={{ width: "100%" }}
                name="user_password"
                onChange={input}
                onBlur={trueFalse}
                value={form.user_password}
                // helperText={
                //   form.user_password == "" && infoTrue.user_password == true
                //     ? "Enter your password"
                //     : infoTrue.user_password == true &&
                //       (form.user_password.length < 8 ||
                //         form.user_password.length > 20)
                //     ? "Password must contain atleast 8-20 characters"
                //     : infoTrue.user_password == true &&
                //       (!form.user_password.match(/[A-Z]/g) ||
                //         !form.user_password.match(/[a-z]/g) ||
                //         !form.user_password.match(/[0-9]/g) ||
                //         !form.user_password.match(/[!@#$%^&*()_+=]/g))
                //     ? "Atleast one lower case, upper case,special character and number required"
                //     : ""
                // }
              />
            </div>{" "}
            <div className="element  w-100">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={infoTrue.user_status && form.user_status == ""}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  label
                  value={form.user_status}
                  name="user_status"
                  onChange={input}
                  onBlur={trueFalse}
                >
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Approve</MenuItem>
                </Select>
                {infoTrue.user_status && form.user_status == "" ? (
                  <FormHelperText>Status is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>{" "}
          </div>
          <br />
        </div>
      );
    } else if (dialogTitle == "Delete Employees") {
      return (
        <>
          <div>
            <h1>Are you sure ?</h1>
            Do you want to sure delete this employee ?
          </div>
        </>
      );
    }
    else if (dialogTitle == "Change Auth Key") {
      return (
        <>
          <div>
            <h1>Are you sure ?</h1>
            Do you want to sure Change Auth Key ?
          </div>
        </>
      );
    }
  };
  const manageDialogActionButton = () => {
    if (dialogTitle == "Update Employees") {
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
              className=" btn-gradient  btn-success addbankloder"
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
              Update
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add Employees") {
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
              className=" btn-gradient  btn-success addbankloder"
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
              onClick={formAdd}
            >
              Add
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Delete Employees") {
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
              className=" btn-gradient  btn-danger addbankloder"
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
              className="btn-gradient btn-danger"
              onClick={formDelete}
            >
              Delete
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Change Auth Key") {
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
              className=" btn-gradient  btn-danger addbankloder"
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
              className="btn-gradient btn-danger"
              onClick={Change_Auth_Key}
            >
              Change auth key
            </Button>
          )}
        </div>
      );
    }
  };
  const columns = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      wrap: true,
      grow: 0.1,
    },
    {
      name: "ROLE NAME",
      selector: (row) => {
        return <span title={row.role}>{row.role}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Name",
      selector: (row) => {
        return (
          <span
            title={`${row.user_first_name} ${row.user_last_name}`}
          >{`${row.user_first_name} ${row.user_last_name}`}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "referral code",
      selector: (row) => {
        return <span title={row.referral_code}>{row.referral_code}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      // wrap: true,
    },
    {
      name: "Email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <span title={row.user_added_datetime}>
            <NewDate newDate={row.user_added_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "Phone Number",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.9,
      // wrap: true,
    },
    {
      name: "Password",
      selector: (row) => {
        return (
          <span title={row.user_visible_password}>
            {row.user_visible_password}
          </span>
        );
      },

      grow: 0.9,
      // wrap: true,
    },
    {
      name: "MANAGER",
      selector: (row) => {
        return (
          <span title={row.master_manager_name}>{row.master_manager_name}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "Regional Head",
      selector: (row) => {
        return (
          <span title={row.regional_head_name}>{row.regional_head_name}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "Head Of Sales",
      selector: (row) => {
        return (
          <span title={row.head_of_sales_name}>{row.head_of_sales_name}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "ACCOUNT TARGET",
      selector: (row) => {
        return <span title={row.ac_target}>{row.ac_target}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
      // wrap: true,
    },
    {
      name: "MONEY IN TARGET",
      selector: (row) => {
        return <span title={row.money_in_target}>{row.money_in_target}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "Ib Account Target",
      selector: (row) => {
        return <span title={row.ib_ac_target}>{row.ib_ac_target}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.user_status == "1"
                ? "status-text-approved"
                : row.user_status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.user_status == "1"
                ? "Approved"
                : row.user_status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.user_status == "1"
              ? "Approved"
              : row.user_status == "2"
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
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "Change Key",
      selector: (row) => {
        return (
          <span >
              <Button
                onClick={() => {
                  setDialogTitle("Change Auth Key");
                  setOpen(true);
                  form.user_id = row.user_id;
                  form.isLoader = false;
                  setForm({ ...form });
                }}
              >
                <span className="material-icons">key</span>
              </Button>
          
          </span>
        );
      },
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <span style={{ display: "flex" }}>
            {prop.permission.edit_employee == 1 ? (
              <Button>
                <span
                  className="material-icons  icon_Mar"
                  style={{ color: "green" }}
                  onClick={() => {
                    getRoleList();
                    // getManagerList();
                    if (row.role_id == 2) {
                      getRegionalHead();
                    }
                    if (row.role_id == "20") {
                      getHeadOfSales();
                    }
                    if (row.role_id == 3) {
                      getManagerList();
                    }
                    setDialogTitle("Update Employees");
                    setOpen(true);

                    setForm({
                      user_first_name: row.user_first_name,
                      user_last_name: row.user_last_name,
                      user_email: row.user_email,
                      ib_ac_target: row.ib_ac_target,
                      user_password: row.user_password,
                      role_id: row.role_id,
                      get_regional_head:
                        row.role_id == 2
                          ? {
                              regional_head: row.regional_head,
                              name: row.regional_head_name,
                            }
                          : "",
                      get_head_of_sales:
                        row.role_id == 20
                          ? {
                              head_of_sales: row.head_of_sales,
                              name: row.head_of_sales_name,
                            }
                          : "",
                      user_phone: row.user_phone,
                      manager_master_id:
                        row.role_id == 3
                          ? {
                              manager_master_id: row.manager_master_id,
                              manager_master_name: row.master_manager_name,
                            }
                          : "",
                      ac_target: row.ac_target,
                      money_in_target: row.money_in_target,
                      user_status: row.user_status,
                      user_id: row.user_id,
                      isLoader: false,
                    });
                  }}
                >
                  edit
                </span>
              </Button>
            ) : (
              ""
            )}
            {prop.permission.delete_employee == 1 ? (
              <Button
                onClick={() => {
                  setDialogTitle("Delete Employees");
                  setOpen(true);
                  form.user_id = row.user_id;
                  form.isLoader = false;
                  setForm({ ...form });
                }}
              >
                <span
                  className="material-icons  icon_Mar"
                  style={{ color: "red" }}
                >
                  delete
                </span>
              </Button>
            ) : (
              ""
            )}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      wrap: true,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Employees</p>
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
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        {prop.permission.add_employee == 1 ? (
                          <ColorButton
                            onClick={() => {
                              getRoleList();
                              // getManagerList();
                              setDialogTitle("Add Employees");
                              setOpen(true);
                              setForm({
                                user_first_name: "",
                                user_last_name: "",
                                user_email: "",
                                ib_ac_target: "",
                                user_password: "",
                                role_id: "",
                                get_regional_head: "",
                                get_head_of_sales: "",
                                manager_master_id: "",
                                ac_target: "",
                                money_in_target: "",
                                user_status: "",
                                user_phone: "",
                                user_id: "",
                                isLoader: false,
                              });
                            }}
                          >
                            Add Employees
                          </ColorButton>
                        ) : (
                          ""
                        )}

                        <CommonTable
                          url={`${Url}/datatable/employees_list.php`}
                          column={columns}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          checkStatus={checkStatus}
                          setResData={setResData}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
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
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
