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
import "./treadeAndWin.css";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
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

const TradeAndWin = (prop) => {
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
  const [resData, setResData] = useState();
  const [data, setData] = useState({
    fullName: "",
    email: "",
    addOne: "",
    date: "",
    order_id: "",
    addTwo: "",
    remark: "",
    country: "",
    city: "",
    status: "",
    pin: "",
    array: [],
    note: "",
    state: "",
    isLoder: false,
  });
  const [error, setError] = useState({
    fullName: false,
    email: false,
    addOne: false,
    addTwo: false,
    country: false,
    city: false,
    pin: false,
    city1: false,
  });
  const trueFalse = (event) => {
    var { name, value } = event.target;
    setError((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const [countryData, setCountryData] = useState({
    country: [],
    city: [],
    state: [],
  });
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const pinReg = /^(?=[0-9]*$)(?:.{6})$/;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // setError((prevState) => ({
    //   ...prevState,
    //   [e.target.name]: "",
    // }));
  };
  const [popLoder, setPopLoder] = useState({
    city: true,
    state: true,
    country: true,
  });
  const getStateData = (prop, prop1) => {
    if (prop == null) {
      countryData.state = [];
      countryData.city = [];
      setCountryData({ ...countryData });
      data.city = "";
      data.state = "";

      setData({ ...data });
    } else {
      const param = new FormData();
      param.append("action", "get_states");
      param.append("country", prop.nicename);
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      axios.post(Url + "/ajaxfiles/common_api.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/login");
        }
        if (res.data.status == "error") {
        } else {
          // if (id == undefined || id == null || id == "") {

          // }

          countryData.state = res.data.data;
          setCountryData({ ...countryData });
          if (prop1 == "first Time") {
            popLoder.state = false;
            setPopLoder({ ...popLoder });
          }
        }
      });
    }
  };
  const getContry = (prop, prop1, row) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    axios.post(Url + "/datatable/get_countries.php", param).then((res) => {
      if (res.data.status == "error") {
      } else {
        countryData.country = res.data.aaData;
        setCountryData({ ...countryData });

        let test = countryData.country.filter((x) => x.nicename == prop)[0];
        setData({
          fullName: row.user_name,
          email: row.user_email,
          addOne: row.shipping_address.address_1,
          addTwo: row.shipping_address.address_2,
          country: test,
          date: row.added_datetime,
          status: row.status,
          remark: row.admin_remarks,
          array: row.order_data,
          city: row.shipping_address.city,
          order_id: row.order_id,
          pin: row.shipping_address.pincode,
          note: row.order_notes,
          state: row.shipping_address.state,
          isLoder: false,
        });
        if (row.shipping_address.country !== "") {
          getStateData(test, "first Time");
          if (prop1 == "first Time") {
            popLoder.country = false;
            setPopLoder({ ...popLoder });
          }
        } else {
          if (prop1 == "first Time") {
            popLoder.country = false;
            popLoder.state = false;

            setPopLoder({ ...popLoder });
          }
        }
      }
    });
  };
  const getCityData = (prop, prop1) => {
    if (prop == null) {
      countryData.city = [];
      setCountryData({ ...countryData });
      data.city = "";
      data.state = "";
      setData({ ...data });
    } else {
      const param = new FormData();
      param.append("action", "get_cities");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("state", prop);
      axios.post(Url + "/ajaxfiles/common_api.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/login");
        }
        if (res.data.status == "error") {
          // Toast("error",res.data.message);
        } else {
          // if (id == undefined || id == null || id == "") {
          //   info.onEdit = "";
          //   setOnEdit({ ...onEdit });
          // }

          countryData.city = res.data.data;
          setCountryData({ ...countryData });
          if (prop1 == "first Time") {
            popLoder.city = false;
            setPopLoder({ ...popLoder });
          }
        }
      });
    }
  };
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "user_name",
    },
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    {
      label: "notes",
      value: false,
      name: "order_notes",
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
      name: "order id",
      selector: (row) => {
        return <span title={row.order_id}>{row.order_id}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "name",
      selector: (row) => {
        return <span title={row.user_name}>{row.user_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "order time lot",
      selector: (row) => {
        return (
          <span title={row.user_order_time_lot}>{row.user_order_time_lot}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "total lot",
      selector: (row) => {
        return (
          <span title={row.total_item_lot_size}>{row.total_item_lot_size}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "notes",
      selector: (row) => {
        return <span title={row.order_notes}>{row.order_notes}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.status == "0"
                ? "status-text-pending"
                : row.status == "4"
                ? "status-text-rejected"
                : "status-text-approved"
            }
            title={
              row.status == "0"
                ? "Pending"
                : row.status == "4"
                ? "Rejected"
                : row.status == "1"
                ? "Approved"
                : row.status == "2"
                ? "Ready For Delivery"
                : row.status == "3"
                ? "Delivered"
                : row.status == "5"
                ? "Delivery Failed"
                : ""
            }
          >
            {row.status == "0"
              ? "Pending"
              : row.status == "4"
              ? "Rejected"
              : row.status == "1"
              ? "Approved"
              : row.status == "2"
              ? "Ready For Delivery"
              : row.status == "3"
              ? "Delivered"
              : row.status == "5"
              ? "Delivery Failed"
              : ""}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },

    {
      name: "updated date",
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
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            <Button
              onClick={() => {
                setPopLoder({ city: true, state: true, country: true });

                setError({
                  fullName: false,
                  email: false,
                  addOne: false,
                  addTwo: false,
                  country: false,
                  city: false,
                  pin: false,
                  city1: false,
                });
                setDialogTitle("View Order");
                setOpen(true);

                getContry(row.shipping_address.country, "first Time", row);
                if (row.shipping_address.state == "") {
                  popLoder.city = false;
                  setPopLoder({ ...popLoder });
                } else {
                  getCityData(row.shipping_address.state, "first Time");
                }
              }}
            >
              <VisibilityIcon />
            </Button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  const manageDialogActionButton = () => {
    if (dialogTitle == "View Order") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {data.isLoder == true ? (
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
              onClick={formSubmit}
            >
              Update
            </Button>
          )}
        </div>
      );
    }
  };
  const formSubmit = () => {
    if (data.fullName == "") {
      toast.error("Fullname is required!");
    } else if (data.email == "") {
      toast.error("Email is required!");
    } else if (!emailReg.test(data.email)) {
      toast.error("Email is invalid!");
    } else if (data.addOne == "") {
      toast.error("Address1 is required!");
    } else if (data.addTwo == "") {
      toast.error("addTwo is required!");
    } else if (data.country === "" || data.country === null) {
      toast.error("Country is required!");
    } else if (data.state === "" || data.state === null) {
      toast.error("State is required!");
    } else if (data.city === "" || data.city === null) {
      toast.error("City is required!");
    } else if (data.pin === "") {
      toast.error("Pincode is required!");
    } else if (!pinReg.test(data?.pin)) {
      toast.error("Pin code should be 6 digit numbe");
    } else if (data.status == "") {
      toast.error("Status is required!");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "update_trade_win_order");
      param.append("order_notes", data?.note);
      param.append("admin_remarks", data?.remark);
      param.append("order_id", data?.order_id);
      param.append("status", data?.status);

      var arrayAddress = {
        address_1: data?.addOne,
        address_2: data?.addTwo,
        city: data?.city,
        state: data?.state,
        country: data?.country.nicename,
        pincode: data?.pin,
      };
      param.append("shipping_address", JSON.stringify(arrayAddress));
      data.isLoder = true;
      setData({ ...data });
      axios
        .post(Url + "/ajaxfiles/trade_and_win_order_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/login");
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            data.isLoder = false;
            setData({ ...data });
          } else {
            data.isLoder = false;
            setData({ ...data });
            toast.success(res.data.message);
            setRefresh(!refresh);
            setOpen(false);
          }
        });
    }
  };
  const manageContent = () => {
    if (dialogTitle == "View Order") {
      if (
        popLoder.city == true ||
        popLoder.country == true ||
        popLoder.state == true
      ) {
        return (
          <div className="popup-loader">
            <svg className="spinner" viewBox="0 0 50 50">
              <circle
                class="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="5"
              ></circle>
            </svg>
          </div>
        );
      } else {
        return (
          <div>
            <div>
              <h5>Address</h5>
            </div>

            <Grid container>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Full Name"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="fullName"
                    onBlur={trueFalse}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data?.fullName}
                    onChange={(e) => handleChange(e)}
                  />
                  {error?.fullName == true && data?.fullName == "" ? (
                    <span className="error">Fullname is required!</span>
                  ) : (
                    ""
                  )}
                </Grid>

                <Grid item xs={12} sm={4} title={data?.email}>
                  <TextField
                    label="Email"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="email"
                    onBlur={trueFalse}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data?.email}
                    onChange={(e) => handleChange(e)}
                  />
                  {error?.email == true && data?.email == "" ? (
                    <span className="error">Email is required!</span>
                  ) : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      data?.email
                    ) && error?.email == true ? (
                    <span className="error">Enter a valid email</span>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Order Date"
                    variant="standard"
                    sx={{ width: "100%" }}
                    type="text"
                    onBlur={trueFalse}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={NewDate({ newDate: data.date }).props.children}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address line 1"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="addOne"
                    value={data?.addOne}
                    onBlur={trueFalse}
                    onChange={(e) => handleChange(e)}
                  />
                  {error?.addOne == true && data?.addOne == "" ? (
                    <span className="error">Address1 is required!!</span>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address line 2"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="addTwo"
                    value={data?.addTwo}
                    onBlur={trueFalse}
                    onChange={(e) => handleChange(e)}
                  />
                  {error?.addTwo == true && data?.addTwo == "" ? (
                    <span className="error">Address2 is required!</span>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    disablePortal
                    options={countryData.country}
                    value={data.country}
                    getOptionLabel={(option) => (option ? option.nicename : "")}
                    onChange={(event, newValue) => {
                      getStateData(newValue);

                      if (newValue == null) {
                        data.country = newValue;
                        data.city = "";
                        data.state = "";

                        setData({ ...data });
                      } else {
                        data.country = newValue;
                        data.city = "";
                        data.state = "";

                        setData({ ...data });
                      }
                    }}
                    sx={{ padding: "0px" }}
                    className="w-100"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        // variant="standard"
                        size="small"
                        name="country"
                        onBlur={trueFalse}
                        variant="standard"
                        sx={{ padding: "0px" }}
                      />
                    )}
                  />
                  {error?.country == true &&
                  (data?.country == "" || data?.country == null) ? (
                    <span className="error">Country is required!</span>
                  ) : (
                    ""
                  )}
                </Grid>
                {countryData.state.length == 0 ? (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="State"
                      variant="standard"
                      sx={{ width: "100%" }}
                      name="state"
                      value={data?.state}
                      onBlur={trueFalse}
                      onChange={(e) => handleChange(e)}
                    />
                    {error?.state == true && data?.state == "" ? (
                      <span className="error">State is required!</span>
                    ) : (
                      ""
                    )}
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      disablePortal
                      options={countryData.state}
                      value={data.state}
                      getOptionLabel={(option) => (option ? option : "")}
                      onChange={(event, newValue) => {
                        getCityData(newValue);

                        if (newValue == null) {
                          data.state = newValue;
                          data.city = "";

                          setData({ ...data });
                        } else {
                          data.state = newValue;
                          data.city = "";

                          setData({ ...data });
                        }
                      }}
                      sx={{ padding: "0px" }}
                      className="w-100"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="State"
                          // variant="standard"
                          onBlur={trueFalse}
                          size="small"
                          name="state"
                          variant="standard"
                          sx={{ padding: "0px" }}
                        />
                      )}
                    />
                    {error?.state == true &&
                    (data?.state == "" || data?.state == null) ? (
                      <span className="error">State is required!</span>
                    ) : (
                      ""
                    )}
                  </Grid>
                )}
                {countryData.state.length == 0 ||
                countryData.city.length == 0 ? (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="City"
                      variant="standard"
                      sx={{ width: "100%" }}
                      name="city"
                      value={data?.city}
                      onBlur={trueFalse}
                      onChange={(e) => handleChange(e)}
                    />
                    {error?.city == true && data?.city == "" ? (
                      <span className="error">City is required!</span>
                    ) : (
                      ""
                    )}
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      disablePortal
                      options={countryData.city}
                      value={data.city}
                      getOptionLabel={(option) => (option ? option : "")}
                      onChange={(event, newValue) => {
                        if (newValue == null) {
                          data.city = newValue;
                          setData({ ...data });
                        } else {
                          data.city = newValue;
                          setData({ ...data });
                        }
                      }}
                      sx={{ padding: "0px" }}
                      className="w-100"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City"
                          size="small"
                          // className="autoComplte-textfild"
                          onBlur={trueFalse}
                          // helperText={
                          //   (data.city1 == null || data.city1 == "") && error.city1
                          //     ? "City is required"
                          //     : ""
                          // }
                          // error={
                          //   (data.city1 == null || data.city1 == "") && error.city1
                          //     ? true
                          //     : false
                          // }
                          name="city"
                          sx={{ padding: "0px" }}
                          variant="standard"
                        />
                      )}
                    />
                    {error?.city == true &&
                    (data?.city == "" || data?.city == null) ? (
                      <span className="error">State is required!</span>
                    ) : (
                      ""
                    )}
                  </Grid>
                )}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pincode"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="pin"
                    value={data?.pin}
                    onBlur={trueFalse}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        handleChange(e);
                      } else if (e.target.value == "") {
                        handleChange(e);
                      }
                    }}
                  />
                  {error?.pin == true && data?.pin == "" ? (
                    <span className="error">Pincode is required!</span>
                  ) : error?.pin == true &&
                    data?.pin.toString().length !== 6 ? (
                    <span className="error">
                      Pin code should be 6 digit number
                    </span>
                  ) : (
                    ""
                  )}
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Notes"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="note"
                    value={data?.note}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Admin Remark"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="remark"
                    value={data?.remark}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  {" "}
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    error={data.status == "" && error.status ? true : false}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={data.status}
                      name="status"
                      onChange={handleChange}
                      onBlur={trueFalse}
                    >
                      <MenuItem value="0">Pending</MenuItem>
                      <MenuItem value="1">Approved</MenuItem>
                      <MenuItem value="2">Ready For Delivery</MenuItem>
                      <MenuItem value="3">Delivered</MenuItem>
                      <MenuItem value="4">Rejected</MenuItem>
                      <MenuItem value="5">Delivery Failed</MenuItem>
                    </Select>
                    {data.status == "" && error.status ? (
                      <FormHelperText>Status is required</FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <div
              className="divider"
              style={{ marginTop: "9px", background: "#dcdce3" }}
            ></div>
            <div style={{ marginTop: "9px" }}>
              <h5>Order Items</h5>
            </div>
            <Grid container>
              {data.array.map((item, index) => {
                return (
                  <div key={index} className="tred-body">
                    <div>
                      <div className="tred-body-image">
                        <img src={item.item_image} alt="" />
                      </div>
                      <div className="tred-body-text-image text-center">
                        <span>{item.item_brand}</span>
                      </div>
                    </div>
                    <div>
                      <div>
                        <span>{item.item_name}</span>
                      </div>
                      <div>
                        <span>
                          <b>Lot:-</b>
                          {item.item_lot_size}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Grid>
          </div>
        );
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Trade And Win List</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  userlist={resData?.users_list}
                  selectDynamic={{
                    data: {
                      0: "Pending",
                      1: "Approved",
                      2: "Ready For Delivery",
                      3: "Delivered",
                      4: "Rejected",
                      5: "Delivery Failed",
                    },
                    keyName: "status",
                    label: "Status",
                  }}
                  // setcheckStatus={setcheckStatus}
                  // lastUpdatedBy={resData.modified_by_users}
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
                          url={`${Url}/datatable/trade_and_win_list.php`}
                          column={columns}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          csv={"datatable/trade_and_win_list_export.php"}
                          searchWord={searchKeyword}
                          param={param}
                          setResData={setResData}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px", marginTop: "20px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" onClick={handleClickOpen}>Add</Button>
                                    </div>
                                    <br /> */}
                  <div className="headerSection header-title">
                    <p className="margin-0">Issued Items</p>
                  </div>
                  <div className="bankDetailsTabSection">
                    <div className="referrals-section">
                      <table>
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Item</th>
                            <th>Total Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resData ? (
                            resData.total_ordered_items == undefined ||
                            resData.total_ordered_items == null ||
                            resData.total_ordered_items == "" ? (
                              <tr>
                                <td colSpan="3">
                                  There are no records to display
                                </td>
                              </tr>
                            ) : resData.total_ordered_items.length == 0 ? (
                              <tr>
                                <td colSpan="3">
                                  There are no records to display
                                </td>
                              </tr>
                            ) : (
                              resData?.total_ordered_items.map(
                                (item, index) => {
                                  return (
                                    <tr
                                      style={{
                                        borderBottom:
                                          "1px solid hsla(0, 0.4%, 50%, 0.3)",
                                      }}
                                    >
                                      <td>{item.sr_no}</td>
                                      <td>{item.issued_items}</td>
                                      <td>{item.total_qty}</td>
                                    </tr>
                                  );
                                }
                              )
                            )
                          ) : (
                            <tr>
                              <td colSpan="3">
                                There are no records to display
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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

export default TradeAndWin;
