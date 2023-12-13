// import './partnership_withdraw.css';
import React, { useEffect, useState } from "react";
import "./refreshdata.css";
import {
  Autocomplete,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ColorButton } from "../common/CustomElement";
const RefreshData = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState({
    filter_type: "",
    mt5_acc_no: "",
    mt5group_name: "",
    start_date: "",
    end_date: "",
    user: "",
    isLoder: false,
  });
  const [option, setOption] = useState({
    group: [],
    mt5_acc_no: [],
    user: [],
  });
  const selsecyGroup = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_groups");
    axios
      .post(Url + "/ajaxfiles/refresh_data_manage.php", param)
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
          option.group = res.data.groups_data;
          setOption({ ...option });
          // toast.success(res.data.message);
        }
      });
  };
  const selsecUser = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_users");
    axios
      .post(Url + "/ajaxfiles/refresh_data_manage.php", param)
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
          option.user = res.data.users_data;
          setOption({ ...option });
        }
      });
  };
  const onSubmit = () => {
    if (data.filter_type == "") {
      toast.error("Please select Filter Type");
    } else if (data.filter_type == "user" && data.user == "") {
      toast.error("Please select User");
    } else if (data.filter_type == "group" && data.mt5group_name == "") {
      toast.error("Please select Group");
    } else if (data.filter_type == "user" && data.mt5_acc_no == "") {
      toast.error("Please select Mt5 Account  ");
    } else if (
      data.filter_type == "user" &&
      data.mt5group_name !== "" &&
      data.mt5_acc_no == ""
    ) {
      toast.error("Please select MT5 Account");
    } else if (data.start_date == "") {
      toast.error("From date is requied");
    } else if (data.end_date == "") {
      toast.error("To date is requied");
    } else {
      data.isLoder = true;
      setData({ ...data });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "refresh_data");
      param.append("filter_type", data.filter_type);
      if (data.filter_type == "user") {
        param.append("user_id", data.user);
        param.append("mt5_acc_no", data.mt5_acc_no);
      } else {
        param.append("mt5group_name", data.mt5group_name);
      }

      param.append("start_date", data.start_date);
      param.append("end_date", data.end_date);

      axios
        .post(Url + "/ajaxfiles/refresh_data_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            data.isLoder = false;
            setData({ ...data });
          } else {
            // option.mt5_acc_no = res.data.mt5_accounts;
            // setOption({ ...option });
            toast.success(res.data.message);

            setData({
              filter_type: "",
              mt5_acc_no: "",
              mt5group_name: "",
              start_date: "",
              end_date: "",
              user: "",
              isLoder: false,
            });
          }
        });
    }
  };
  const selsecMt5 = (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_mt5_accounts");
    param.append("user_id", prop);
    axios
      .post(Url + "/ajaxfiles/refresh_data_manage.php", param)
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
          option.mt5_acc_no = res.data.mt5_accounts;
          setOption({ ...option });
        }
      });
  };

  const input5 = (event) => {
    const { name, value } = event.target;
    setData((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
    if (name == "filter_type" && value == "user") {
      selsecUser();
    }
    if (name == "filter_type" && value == "group") {
      selsecyGroup();
    }
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Refresh Data</p>

                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <Grid container spacing={3}>
                    <Grid item md={4}>
                      <FormControl variant="standard" sx={{ width: "100%" }}>
                        <InputLabel>Filter Type</InputLabel>
                        <Select
                          label
                          className="select-font-small"
                          name="filter_type"
                          value={data.filter_type}
                          onChange={input5}
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="group">Group</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {data.filter_type == "group" ? (
                      <Grid item md={4}>
                        <Autocomplete
                          disablePortal
                          options={option.group}
                          getOptionLabel={(option) =>
                            option ? option.ib_group_name : ""
                          }
                          onChange={(e, value) => {
                            if (value == null) {
                              data.mt5group_name = "";
                              setData({ ...data });
                            } else {
                              data.mt5group_name = value.group_id;
                              setData({ ...data });
                            }
                          }}
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={data.mt5group_name}
                              label="Group"
                              variant="standard"
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                    {data.filter_type == "user" ? (
                      <Grid item md={4}>
                        <Autocomplete
                          disablePortal
                          options={option.user}
                          getOptionLabel={(option) =>
                            option ? option.user_name : ""
                          }
                          name="hello"
                          onChange={(e, value) => {
                            // if (value.user_id !== "" && value != null) {

                            // }
                            if (value == null || value == "") {
                              data.user = "";
                              setData({ ...data });
                            } else {
                              data.mt5_acc_no = "";
                              data.user = value.user_id;
                              setData({ ...data });
                              selsecMt5(value.user_id);
                            }
                          }}
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={data.user}
                              label="User"
                              variant="standard"
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                    {data.filter_type == "user" && data.user !== "" ? (
                      <Grid item md={4}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
                          <InputLabel>MT5 Account</InputLabel>
                          <Select
                            label
                            className="select-font-small"
                            name="mt5_acc_no"
                            value={data.mt5_acc_no}
                            onChange={input5}
                          >
                            {option.mt5_acc_no.map((item, index) => {
                              return (
                                <MenuItem value={item.mt5_acc_no}>
                                  {item.mt5_acc_no}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid container spacing={3} className="padingtopmy5create">
                    <Grid item md={4}>
                      <TextField
                        type="date"
                        className="input-font-small"
                        label="From"
                        variant="standard"
                        sx={{ width: "100%" }}
                        focused
                        value={data.start_date}
                        name="start_date"
                        onChange={input5}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        type="date"
                        className="input-font-small"
                        label="To"
                        variant="standard"
                        sx={{ width: "100%" }}
                        focused
                        value={data.end_date}
                        name="end_date"
                        onChange={input5}
                      />
                    </Grid>
                  </Grid>
                  <div className="refreshbutton">
                    {data.isLoder == true ? (
                      <ColorButton
                        sx={{ padding: "18px 65px" }}
                        tabindex="0"
                        size="large"
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
                      </ColorButton>
                    ) : (
                      <ColorButton onClick={onSubmit}>Refresh</ColorButton>
                    )}
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefreshData;
