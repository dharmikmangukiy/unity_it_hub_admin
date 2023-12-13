import "./currency_rate.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CurrencyRate = (prop) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({
    deposit_rate: "",
    incentive_usd_rate: "",
    withdrawal_rate: "",
  });

  const [inputinfoTrue, setinputinfoTrue] = useState({
    deposit_rate: false,
    incentive_usd_rate: false,
    withdrawal_rate: false,
  });
  const inputtrueFalse = (event) => {
    var { name, value } = event.target;
    setinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  useEffect(() => {
    fatchimage();
  }, []);
  const onChange = (event) => {
    const { name, value } = event.target;
    setData((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const fatchimage = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "currency_rate");
    await axios.post(`${Url}/ajaxfiles/common_api.php`, param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setData({
          deposit_rate: res.data.deposit_rate,
          withdrawal_rate: res.data.withdrawal_rate,
          incentive_usd_rate: res.data.incentive_usd_rate,
        });
      }
    });
  };
  //   useState

  const onSubmit = async () => {
    if (!data.incentive_usd_rate) {
      toast.error("Insantive USD rate is requied");
    } else if (!data.deposit_rate) {
      toast.error("Deposit rate is requied");
    } else if (!data.withdrawal_rate) {
      toast.error("withdrawal rate is requied");
    } else {
      setLoader(true);
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "update_rate");
      param.append("deposit_rate", data.deposit_rate);
      param.append("withdrawal_rate", data.withdrawal_rate);
      param.append("incentive_usd_rate", data.incentive_usd_rate);
      await axios
        .post(`${Url}/ajaxfiles/currency_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            setLoader(false);
          } else {
            toast.success(res.data.message);
            setinputinfoTrue({
              deposit_rate: false,
              incentive_usd_rate: false,
              withdrawal_rate: false,
            });
            setLoader(false);
          }
        });
    }
  };
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Currency Rate</p>

                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <div className="input-section">
                          <TextField
                            label="Insantive USD Rate"
                            value={data.incentive_usd_rate}
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="incentive_usd_rate"
                            onBlur={inputtrueFalse}
                            disabled={
                              prop.permission.update_rate == 1 ? false : true
                            }
                            error={
                              data.incentive_usd_rate == "" &&
                              inputinfoTrue.incentive_usd_rate
                                ? true
                                : false
                            }
                            helperText={
                              data.incentive_usd_rate == "" &&
                              inputinfoTrue.incentive_usd_rate
                                ? "Insantive USD Rate is required"
                                : ""
                            }
                            type="text"
                            onChange={(e) => {
                              if (!isNaN(Number(e.target.value))) {
                                data.incentive_usd_rate = e.target.value;
                                setData({ ...data });
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                data.incentive_usd_rate = 0;
                                setData({ ...data });
                              }
                            }}
                          />
                        </div>
                        <br />
                        <div className="input-section">
                          <TextField
                            label="Deposit Rate"
                            value={data.deposit_rate}
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="deposit_rate"
                            onBlur={inputtrueFalse}
                            disabled={
                              prop.permission.update_rate == 1 ? false : true
                            }
                            error={
                              data.deposit_rate == "" &&
                              inputinfoTrue.deposit_rate
                                ? true
                                : false
                            }
                            helperText={
                              data.deposit_rate == "" &&
                              inputinfoTrue.deposit_rate
                                ? "Deposit Rate is required"
                                : ""
                            }
                            type="text"
                            onChange={(e) => {
                              if (!isNaN(Number(e.target.value))) {
                                data.deposit_rate = e.target.value;
                                setData({ ...data });
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                data.deposit_rate = 0;
                                setData({ ...data });
                              }
                            }}
                          />
                        </div>
                        <br />
                        <div className="input-section">
                          <TextField
                            label="Withdrawal Rate"
                            value={data.withdrawal_rate}
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="withdrawal_rate"
                            onBlur={inputtrueFalse}
                            disabled={
                              prop.permission.update_rate == 1 ? false : true
                            }
                            error={
                              data.withdrawal_rate == "" &&
                              inputinfoTrue.withdrawal_rate
                                ? true
                                : false
                            }
                            helperText={
                              data.withdrawal_rate == "" &&
                              inputinfoTrue.withdrawal_rate
                                ? "Withdrawal Rate is required"
                                : ""
                            }
                            type="text"
                            onChange={(e) => {
                              if (!isNaN(Number(e.target.value))) {
                                data.withdrawal_rate = e.target.value;
                                setData({ ...data });
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                data.withdrawal_rate = 0;
                                setData({ ...data });
                              }
                            }}
                          />
                        </div>
                        <br />
                        {prop.permission.update_rate == 1 ? (
                          <div className="action-button-section">
                            {loader == true ? (
                              <Button disabled className="popdisableimage">
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
                                className="btn-success"
                                onClick={onSubmit}
                              >
                                Update
                              </Button>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRate;
