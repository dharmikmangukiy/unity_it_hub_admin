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
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { ColorButton } from "../common/CustomElement";
import { Convert_PassWord } from "../common/Encryption";

const Setting = (prop) => {
  const navigate = useNavigate();
  const [upiSelectedFile, setUpiSelectedFile] = useState();
  const [upiPreview, setUpiPreview] = useState();
  const [usdtSelectedFile, setUsdtSelectedFile] = useState();
  const [usdtPreview, setUsdtPreview] = useState();
  const [input1infoTrue, setinput1infoTrue] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
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
  const [arrayData, setArrayData] = useState({
    checkbox: [],
    textBox: [],
    deposit: [],
    img: [],
    bank: [],
    spin: [],
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
  const RestartServer = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append(
      "api_key",
      Convert_PassWord({ message: "AAAA@!%&^*Unity_IT_Hub@2023" })
    );
    await axios
      .post(Url + "/ajaxfiles/restart_live_price.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          setPageLoader(false);
        } else {
          toast.success(res.data.message);
        }
      });
  };
  const getSetting = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_all_settings");
    await axios
      .post(Url + "/ajaxfiles/settings_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          setPageLoader(false);
        } else {
          arrayData.checkbox = res.data.checkbox_site_prefrence;
          arrayData.textBox = res.data.text_site_prefrence;
          arrayData.bank = res.data.bank;
          arrayData.deposit = res.data.deposit;
          arrayData.spin = res.data.spin_win_banner_data;

          arrayData.img = res.data.image_site_prefrence;

          setArrayData({ ...arrayData });
          setPageLoader(false);
        }
      });
  };

  const saveSetting = async () => {
    var testFildError = "";
    var imgError = "";
    var DepositImgError = "";
    var bankTextError = "";
    var spinError = "";
    const SpinAndWinError = () => {
      var test = "";
      arrayData.spin.map((item, index) => {
        if (item.value == "" && spinError == "") {
          spinError = `${item.label} is required`;
          test = spinError;
        }
      });
      return test;
    };
    const DepositError = () => {
      var test = "";
      arrayData.deposit.map((item, index) => {
        if (item.value == "" && DepositImgError == "") {
          DepositImgError = `${item.label} is required`;
          test = DepositImgError;
        }
      });
      return test;
    };
    const BankError = () => {
      var test = "";
      arrayData.bank.map((item, index) => {
        if (item.value == "" && bankTextError == "") {
          bankTextError = `${item.label} is required`;
          test = bankTextError;
        }
      });
      return test;
    };
    const textError = () => {
      var test = "";
      arrayData.textBox.map((item, index) => {
        if (item.value == "" && testFildError == "") {
          testFildError = `${item.label} is required`;
          test = testFildError;
        }
      });
      return test;
    };
    const imageError = () => {
      var test = "";
      arrayData.img.map((item, index) => {
        if (item.value == "" && imgError == "") {
          imgError = `${item.label} is required`;
          test = imgError;
        }
      });
      return test;
    };
    if (BankError()) {
      toast.error(bankTextError);
    } else if (SpinAndWinError()) {
      toast.error(spinError);
    } else if (DepositError()) {
      toast.error(DepositImgError);
    } else if (textError()) {
      toast.error(testFildError);
    } else if (imageError()) {
      toast.error(imgError);
    } else {
      // form.isloader = true;
      // setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "update_all_settings");
      param.append("text_site_prefrence", JSON.stringify(arrayData.textBox));
      param.append(
        "checkbox_site_prefrence",
        JSON.stringify(arrayData.checkbox)
      );
      param.append("bank", JSON.stringify(arrayData.bank));
      arrayData.img.map((item, index) => {
        if (item.value) {
          if (item.value.name) {
            param.append(item.name, item.value);
          }
        }
      });
      arrayData.deposit.map((item, index) => {
        if (item.value) {
          if (item.value.name) {
            param.append(item.name, item.value);
          }
        }
      });
      arrayData.spin.map((item, index) => {
        if (item.value && item.type == "image") {
          if (item.value.name) {
            param.append(item.name, item.value);
          }
        } else if (item.type == "text") {
          param.append(item.name, item.value);
        }
      });
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
    }
  };
  useEffect(() => {
    getSetting();
  }, []);
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
          {pageLoader == true ? (
            <div className="loader">
              <div className="clock">
                <div className="pointers"></div>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 1 }}>
              <Grid container>
                <Grid item md={12} lg={12} xl={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <p className="main-heading">Setting</p>{" "}
                    <ColorButton
                      onClick={RestartServer}
                      style={{
                        marginBottom: "1.5rem!important",
                        width: "223px",
                      }}
                    >
                      Restart Server
                    </ColorButton>
                  </div>

                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px" }}
                    className="pending-all-15px"
                  >
                    <CardContent className="py-3">
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={12} lg={12}>
                          <div className="checkbox-section">
                            {arrayData.checkbox.map((item, index) => {
                              return (
                                <div key={index}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          arrayData.checkbox[index].value == 1
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          arrayData.checkbox[index].value =
                                            e.target.checked == true ? 1 : 0;
                                          setArrayData({ ...arrayData });
                                        }}
                                        id={`settingArray${index}`}
                                        name={`settingArray${index}`}
                                      />
                                    }
                                    label={item.label}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <br />
                          <div>
                            <div className="scriptmasterTextFild">
                              {arrayData.textBox.map((item, index) => {
                                return (
                                  <TextField
                                    id={`standard-basic${index}`}
                                    label={item.label}
                                    variant="standard"
                                    sx={{ width: "100%" }}
                                    name={item.name}
                                    value={arrayData.textBox[index].value}
                                    onChange={(e) => {
                                      if (item.type == "number") {
                                        if (!isNaN(Number(e.target.value))) {
                                          arrayData.textBox[index].value =
                                            e.target.value;
                                          setArrayData({ ...arrayData });
                                        } else if (
                                          e.target.value == "" ||
                                          e.target.value == 0
                                        ) {
                                          arrayData.textBox[index].value =
                                            e.target.value;
                                          setArrayData({ ...arrayData });
                                        }
                                      } else {
                                        arrayData.textBox[index].value =
                                          e.target.value;
                                        setArrayData({ ...arrayData });
                                      }
                                    }}
                                    onBlur={input1trueFalse}
                                    error={
                                      arrayData.textBox[index].value == "" &&
                                      input1infoTrue[item.name]
                                        ? true
                                        : false
                                    }
                                    helperText={
                                      arrayData.textBox[index].value == "" &&
                                      input1infoTrue[item.name]
                                        ? `${item.label} is required`
                                        : ""
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>

                          <br />

                          <div>
                            <div className="scriptmasterTextFild">
                              {arrayData.img.map((item, index) => {
                                return (
                                  <div className="">
                                    <h6>{item.label}</h6>

                                    {arrayData.img[index].value == "" ? (
                                      <label
                                        htmlFor={`contained-button-filese${index}`}
                                        className="fileuploadButton"
                                      >
                                        <Input
                                          accept="image/*"
                                          id={`contained-button-filese${index}`}
                                          type="file"
                                          onChange={(e) => {
                                            if (
                                              e.target.files[0].type ==
                                                "image/png" ||
                                              e.target.files[0].type ==
                                                "image/jpg" ||
                                              e.target.files[0].type ==
                                                "image/jpeg"
                                            ) {
                                              arrayData.img[index].value =
                                                e.target.files[0];
                                              setArrayData({
                                                ...arrayData,
                                              });
                                            } else {
                                              toast.error(
                                                "Only JPG, JPEG and PNG types are accepted."
                                              );
                                            }
                                          }}
                                        />
                                        <Button
                                          variant="contained"
                                          component="span"
                                        >
                                          <i className="material-icons">
                                            backup
                                          </i>
                                          &nbsp;Upload Image
                                        </Button>
                                      </label>
                                    ) : (
                                      <div className="position-relative">
                                        <CloseIcon
                                          className="remove-script-image"
                                          onClick={() => {
                                            arrayData.img[index].value = "";
                                            setArrayData({
                                              ...arrayData,
                                            });
                                          }}
                                        />
                                        <div
                                          style={{
                                            padding: "10px",
                                            boxShadow:
                                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                                          }}
                                        >
                                          <img
                                            className="w-100"
                                            src={
                                              arrayData.img[index].value.name
                                                ? URL.createObjectURL(
                                                    arrayData.img[index].value
                                                  )
                                                : arrayData.img[index].value
                                            }
                                            alt=""
                                          />
                                          {/* <span>
                                      {arrayData.deposit.gpay_image
                                        ? arrayData.deposit.gpay_image.name
                                        : ""}
                                    </span> */}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <br />
                          <div>
                            <div className="subTitle-setting">Spin And Win</div>
                            <div className="scriptmasterTextFild">
                              {arrayData.spin.map((item, index) => {
                                if (item.type == "image") {
                                  return (
                                    <div className="">
                                      <h6>{item.label}</h6>

                                      {arrayData.spin[index].value == "" ? (
                                        <label
                                          htmlFor={`contained-button-filese${index}`}
                                          className="fileuploadButton"
                                        >
                                          <Input
                                            accept="image/*"
                                            id={`contained-button-filese${index}`}
                                            type="file"
                                            onChange={(e) => {
                                              if (
                                                e.target.files[0].type ==
                                                  "image/png" ||
                                                e.target.files[0].type ==
                                                  "image/jpg" ||
                                                e.target.files[0].type ==
                                                  "image/jpeg"
                                              ) {
                                                arrayData.spin[index].value =
                                                  e.target.files[0];
                                                setArrayData({
                                                  ...arrayData,
                                                });
                                              } else {
                                                toast.error(
                                                  "Only JPG, JPEG and PNG types are accepted."
                                                );
                                              }
                                            }}
                                          />
                                          <Button
                                            variant="contained"
                                            component="span"
                                          >
                                            <i className="material-icons">
                                              backup
                                            </i>
                                            &nbsp;Upload Image
                                          </Button>
                                        </label>
                                      ) : (
                                        <div className="position-relative">
                                          <CloseIcon
                                            className="remove-script-image"
                                            onClick={() => {
                                              arrayData.spin[index].value = "";
                                              setArrayData({
                                                ...arrayData,
                                              });
                                            }}
                                          />
                                          <div
                                            style={{
                                              padding: "10px",
                                              boxShadow:
                                                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                                            }}
                                          >
                                            <img
                                              className="w-100"
                                              src={
                                                arrayData.spin[index].value.name
                                                  ? URL.createObjectURL(
                                                      arrayData.spin[index]
                                                        .value
                                                    )
                                                  : arrayData.spin[index].value
                                              }
                                              alt=""
                                            />
                                            {/* <span>
                                      {arrayData.deposit.gpay_image
                                        ? arrayData.deposit.gpay_image.name
                                        : ""}
                                    </span> */}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                } else if (item.type == "text") {
                                  return (
                                    <TextField
                                      id={`standard-basic${index}`}
                                      label={item.label}
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      name={item.name}
                                      value={arrayData.spin[index].value}
                                      onChange={(e) => {
                                        if (item.type == "number") {
                                          if (!isNaN(Number(e.target.value))) {
                                            arrayData.spin[index].value =
                                              e.target.value;
                                            setArrayData({ ...arrayData });
                                          } else if (
                                            e.target.value == "" ||
                                            e.target.value == 0
                                          ) {
                                            arrayData.spin[index].value =
                                              e.target.value;
                                            setArrayData({ ...arrayData });
                                          }
                                        } else {
                                          arrayData.spin[index].value =
                                            e.target.value;
                                          setArrayData({ ...arrayData });
                                        }
                                      }}
                                      onBlur={input1trueFalse}
                                      error={
                                        arrayData.spin[index].value == "" &&
                                        input1infoTrue[item.name]
                                          ? true
                                          : false
                                      }
                                      helperText={
                                        arrayData.spin[index].value == "" &&
                                        input1infoTrue[item.name]
                                          ? `${item.label} is required`
                                          : ""
                                      }
                                    />
                                  );
                                }
                              })}
                            </div>
                          </div>
                          <br />
                          <div>
                            <div className="subTitle-setting">Deposit</div>
                            <div className="scriptmasterTextFild">
                              {arrayData.deposit.map((item, index) => {
                                return (
                                  <div className="">
                                    <h6>{item.label}</h6>

                                    {arrayData.deposit[index].value == "" ? (
                                      <label
                                        htmlFor={`contained-button-filese${index}`}
                                        className="fileuploadButton"
                                      >
                                        <Input
                                          accept="image/*"
                                          id={`contained-button-filese${index}`}
                                          type="file"
                                          onChange={(e) => {
                                            if (
                                              e.target.files[0].type ==
                                                "image/png" ||
                                              e.target.files[0].type ==
                                                "image/jpg" ||
                                              e.target.files[0].type ==
                                                "image/jpeg"
                                            ) {
                                              arrayData.deposit[index].value =
                                                e.target.files[0];
                                              setArrayData({
                                                ...arrayData,
                                              });
                                            } else {
                                              toast.error(
                                                "Only JPG, JPEG and PNG types are accepted."
                                              );
                                            }
                                          }}
                                        />
                                        <Button
                                          variant="contained"
                                          component="span"
                                        >
                                          <i className="material-icons">
                                            backup
                                          </i>
                                          &nbsp;Upload Image
                                        </Button>
                                      </label>
                                    ) : (
                                      <div className="position-relative">
                                        <CloseIcon
                                          className="remove-script-image"
                                          onClick={() => {
                                            arrayData.deposit[index].value = "";
                                            setArrayData({
                                              ...arrayData,
                                            });
                                          }}
                                        />
                                        <div
                                          style={{
                                            padding: "10px",
                                            boxShadow:
                                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                                          }}
                                        >
                                          <img
                                            className="w-100"
                                            src={
                                              arrayData.deposit[index].value
                                                .name
                                                ? URL.createObjectURL(
                                                    arrayData.deposit[index]
                                                      .value
                                                  )
                                                : arrayData.deposit[index].value
                                            }
                                            alt=""
                                          />
                                          {/* <span>
                                      {arrayData.deposit.gpay_image
                                        ? arrayData.deposit.gpay_image.name
                                        : ""}
                                    </span> */}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <br />
                          <div>
                            <div className="subTitle-setting">Bank</div>

                            <div className="scriptmasterTextFild">
                              {arrayData.bank.map((item, index) => {
                                return (
                                  <TextField
                                    id={`standard-basic${index}`}
                                    label={item.label}
                                    variant="standard"
                                    sx={{ width: "100%" }}
                                    name={item.name}
                                    value={arrayData.bank[index].value}
                                    onChange={(e) => {
                                      if (item.type == "number") {
                                        if (!isNaN(Number(e.target.value))) {
                                          arrayData.bank[index].value =
                                            e.target.value;
                                          setArrayData({ ...arrayData });
                                        } else if (
                                          e.target.value == "" ||
                                          e.target.value == 0
                                        ) {
                                          arrayData.bank[index].value =
                                            e.target.value;
                                          setArrayData({ ...arrayData });
                                        }
                                      } else {
                                        arrayData.bank[index].value =
                                          e.target.value;
                                        setArrayData({ ...arrayData });
                                      }
                                    }}
                                    onBlur={input1trueFalse}
                                    error={
                                      arrayData.bank[index].value == "" &&
                                      input1infoTrue[item.name]
                                        ? true
                                        : false
                                    }
                                    helperText={
                                      arrayData.bank[index].value == "" &&
                                      input1infoTrue[item.name]
                                        ? `${item.label} is required`
                                        : ""
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                          <br />
                          {prop.permission.update_settings == 1 ? (
                            <div className="action-button-section">
                              {form.isloader ? (
                                <ColorButton
                                  variant="contained"
                                  // className="btn-gradient btn-success"
                                  disabled
                                >
                                  <i class="fa fa-refresh fa-spin fa-1x fa-fw"></i>
                                </ColorButton>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
