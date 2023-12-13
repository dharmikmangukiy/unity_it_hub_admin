import "./setting.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { IsApprove, Url } from "../global";
import axios from "axios";

const Setting = (prop) => {
  const navigate = useNavigate();
  const [upiSelectedFile, setUpiSelectedFile] = useState();
  const [upiPreview, setUpiPreview] = useState();
  const [usdtSelectedFile, setUsdtSelectedFile] = useState();
  const [usdtPreview, setUsdtPreview] = useState();
  const [form, setForm] = useState({
    is_deposit_active: 0,
    is_withdrawal_active: 0,
    is_transfer_active: 0,
    is_copy_invest_active: 0,
    is_copy_withdraw_active: 0,
    is_ib_withdraw_active: 0,
    is_pamm_invest_active: 0,
    is_pamm_withdraw_active: 0,
    transfer_wallet_to_wallet_charges: "0",
    bank_ac_name: "0",
    bank_ac_number: "0",
    bank_name: "0",
    bank_ifsc_code: "0",
    upi_qr_code: "",
    usdt_trc_20_qr_code: "",
    isloader: false,
  });
  toast.configure();

  const input = (event) => {
    var { name, value } = event.target;
    if (event.target.getAttribute) {
      if (event.target.getAttribute("type") == "checkbox") {
        value = event.target.checked;
      }
    }

    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const getSetting = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("action", "get_settings");
    await axios.post(Url + "/ajaxfiles/common_api.php", param).then((res) => {
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
          is_deposit_active:
            res.data.settings_list.is_deposit_active == "0" ? false : true,
          is_withdrawal_active:
            res.data.settings_list.is_withdrawal_active == "0" ? false : true,
          is_transfer_active:
            res.data.settings_list.is_transfer_active == "0" ? false : true,
          is_copy_invest_active:
            res.data.settings_list.is_copy_invest_active == "0" ? false : true,
          is_copy_withdraw_active:
            res.data.settings_list.is_copy_withdraw_active == "0"
              ? false
              : true,
          is_ib_withdraw_active:
            res.data.settings_list.is_ib_withdraw_active == "0" ? false : true,
          is_pamm_invest_active:
            res.data.settings_list.is_pamm_invest_active == "0" ? false : true,
          is_pamm_withdraw_active:
            res.data.settings_list.is_pamm_withdraw_active == "0"
              ? false
              : true,
          transfer_wallet_to_wallet_charges:
            res.data.settings_list.transfer_wallet_to_wallet_charges,
          /* bank_ac_name: res.data.settings_list.bank_ac_name,
                    bank_ac_number: res.data.settings_list.bank_ac_number,
                    bank_name: res.data.settings_list.bank_name,
                    bank_ifsc_code: res.data.settings_list.bank_ifsc_code,
                    upi_qr_code: res.data.settings_list.upi_qr_code,
                    usdt_trc_20_qr_code: res.data.settings_list.usdt_trc_20_qr_code, */
          isloader: false,
        });
      }
    });
  };

  const saveSetting = async () => {
    form.isloader = true;
    setForm({ ...form });
    const param = new FormData();
    // if (IsApprove !== "") {
    //   param.append("is_app", IsApprove.is_app);
    //   param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    //   param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    // }
    param.append("action", "update_settings");
    param.append(
      "is_deposit_active",
      form.is_deposit_active == true ? "1" : "0"
    );
    param.append(
      "is_withdrawal_active",
      form.is_withdrawal_active == true ? "1" : "0"
    );
    param.append(
      "is_transfer_active",
      form.is_transfer_active == true ? "1" : "0"
    );
    param.append(
      "is_copy_invest_active",
      form.is_copy_invest_active == true ? "1" : "0"
    );
    param.append(
      "is_copy_withdraw_active",
      form.is_copy_withdraw_active == true ? "1" : "0"
    );
    param.append(
      "is_ib_withdraw_active",
      form.is_ib_withdraw_active == true ? "1" : "0"
    );
    param.append(
      "is_pamm_invest_active",
      form.is_pamm_invest_active == true ? "1" : "0"
    );
    param.append(
      "is_pamm_withdraw_active",
      form.is_pamm_withdraw_active == true ? "1" : "0"
    );
    param.append(
      "transfer_wallet_to_wallet_charges",
      form.transfer_wallet_to_wallet_charges
    );
    /* param.append("bank_ac_name", form.bank_ac_name);
        param.append("bank_ac_number", form.bank_ac_name);
        param.append("bank_name", form.bank_name);
        param.append("bank_ifsc_code", form.bank_ifsc_code);
        if (upiSelectedFile) {
            param.append("upi_qr_code", form.upi_qr_code);
        }
        if (usdtSelectedFile) {
            param.append("usdt_trc_20_qr_code", form.usdt_trc_20_qr_code);
        } */
    await axios
      .post(Url + "/ajaxfiles/settings_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        form.isloader = false;
        setForm({ ...form });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      });
  };

  /* const onSelectFile = (e, flag) => {
        if (flag == 'upi') {
            if (!e.target.files || e.target.files.length === 0) {
                setUpiSelectedFile(undefined)
                return
            }
            setForm({ ...form, upi_qr_code: e.target.files[0] });
            setUpiSelectedFile(e.target.files[0])
        }

        if (flag == 'usdt') {
            if (!e.target.files || e.target.files.length === 0) {
                setUsdtSelectedFile(undefined)
                return
            }
            setForm({ ...form, usdt_trc_20_qr_code: e.target.files[0] });
            setUsdtSelectedFile(e.target.files[0])
        }
    } */

  /* useEffect(() => {
        if (!upiSelectedFile) {
            setUpiPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(upiSelectedFile)
        setUpiPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [upiSelectedFile])

    useEffect(() => {
        if (!usdtSelectedFile) {
            setUsdtPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(usdtSelectedFile)
        setUsdtPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [usdtSelectedFile]) */

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Setting</p>

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
                        <div className="checkbox-section">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_copy_invest_active}
                                name="is_copy_invest_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Copy Invest Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_copy_withdraw_active}
                                name="is_copy_withdraw_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Copy Withdraw Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_deposit_active}
                                name="is_deposit_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Deposit Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_ib_withdraw_active}
                                name="is_ib_withdraw_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="IB Withdraw Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_pamm_invest_active}
                                name="is_pamm_invest_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Pamm Invest Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_pamm_withdraw_active}
                                name="is_pamm_withdraw_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Pamm Withdraw Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_transfer_active}
                                name="is_transfer_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Transafer Status"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={form.is_withdrawal_active}
                                name="is_withdrawal_active"
                                disabled={
                                  prop.permission.update_settings == 1
                                    ? false
                                    : true
                                }
                                onChange={input}
                              />
                            }
                            label="Withdrawal Status"
                          />
                        </div>
                        <br />
                        <div className="input-section">
                          <TextField
                            label="Wallet to Wallet Transfer Charges ($)"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="transfer_wallet_to_wallet_charges"
                            disabled={
                              prop.permission.update_settings == 1
                                ? false
                                : true
                            }
                            value={form.transfer_wallet_to_wallet_charges}
                            onChange={(e) => {
                              if (!isNaN(Number(e.target.value))) {
                                input(e);
                              }
                            }}
                          />
                        </div>
                        {/* <br />
                                                <div className='input-section'>
                                                    <TextField label="Bank Account Name" variant="standard" sx={{ width: '100%' }} name='bank_ac_name' onChange={input} value={form.bank_ac_name} />
                                                    <TextField label="Bank Account Number" variant="standard" sx={{ width: '100%' }} name='bank_ac_number' onChange={input} value={form.bank_ac_number} />
                                                    <TextField label="Bank Name" variant="standard" sx={{ width: '100%' }} name='bank_name' onChange={input} value={form.bank_name} />
                                                    <TextField label="Bank IFSC Code" variant="standard" sx={{ width: '100%' }} name='bank_ifsc_code' onChange={input} value={form.bank_ifsc_code} />
                                                </div> */}
                        {/* <br />
                                                <div className='input-section qr-code-section'>
                                                    <label htmlFor="upi-contained-button-file" className='fileuploadButton'>
                                                        <Input accept="image/*" id="upi-contained-button-file" multiple type="file" onChange={(e) => onSelectFile(e, 'upi')} />
                                                        {(upiSelectedFile != undefined || form.upi_qr_code != "")
                                                            ? (upiSelectedFile) ? <img src={upiPreview} className='deposit-upload-image-preview' /> : <img src={form.upi_qr_code} className='deposit-upload-image-preview' />
                                                            : <Button variant="contained" component="span">
                                                                <i className="material-icons">backup</i>&nbsp;Upload
                                                            </Button>}
                                                    </label>
                                                    <label htmlFor="usdt-contained-button-file" className='fileuploadButton'>
                                                        <Input accept="image/*" id="usdt-contained-button-file" multiple type="file" onChange={(e) => onSelectFile(e, 'usdt')} />
                                                        {(usdtSelectedFile != undefined || form.usdt_trc_20_qr_code != "")
                                                            ? (usdtSelectedFile) ? <img src={usdtPreview} className='deposit-upload-image-preview' /> : <img src={form.usdt_trc_20_qr_code} className='deposit-upload-image-preview' />
                                                            : <Button variant="contained" component="span">
                                                                <i className="material-icons">backup</i>&nbsp;Upload
                                                            </Button>}
                                                    </label>
                                                </div> */}
                        <br />
                        {prop.permission.update_settings == 1 ? (
                          <div className="action-button-section">
                            {form.isloader ? (
                              <Button
                                variant="contained"
                                className="btn-gradient btn-success"
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
                                onClick={saveSetting}
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

export default Setting;
