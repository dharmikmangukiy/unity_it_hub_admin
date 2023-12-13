import "./myaccount.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import { ClientUrl, IsApprove, Url } from "../global";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Myaccount = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [prefrence, setPrefrence] = useState({
    isLoader: false,
    user_email: "",
    user_first_name: "",
    user_last_name: "",
    user_name: "",
    user_phone: "",
    referral_code: "",
  });
  const [smtpData, setSMTPData] = useState({
    smtp_host: "",
    smtp_port: "",
    smtp_secure: "",
    smtp_user: "",
    smtp_user_password: "",
    isLoader: false,
  });
  toast.configure();

  const openDialogbox = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getSMTPDetails = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_smtp_settings");

    axios.post(Url + "/ajaxfiles/smtp_settings.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setSMTPData({
          smtp_host: res.data.data.smtp_host,
          smtp_port: res.data.data.smtp_port,
          smtp_secure: res.data.data.smtp_secure,
          smtp_user: res.data.data.smtp_user,
          smtp_user_password: res.data.data.smtp_user_password,
          isLoader: false,
        });
      }
    });
  };

  const input = (e) => {
    const { name, value } = e.target;

    setSMTPData((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const submitSMTP = () => {
    if (smtpData.smtp_host == "") {
      toast.error("Please enter server");
    } else if (smtpData.smtp_port == "") {
      toast.error("Please enter port");
    } else if (smtpData.smtp_user == "") {
      toast.error("Please enter authentication email");
    } else if (smtpData.smtp_user_password == "") {
      toast.error("Please enter password");
    } else {
      smtpData.isLoader = true;
      setSMTPData({ ...smtpData });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "update_smtp");
      param.append("smtp_user", smtpData.smtp_user);
      param.append("smtp_user_password", smtpData.smtp_user_password);
      param.append("smtp_secure", smtpData.smtp_secure);
      param.append("smtp_host", smtpData.smtp_host);
      param.append("smtp_port", smtpData.smtp_port);

      axios.post(Url + "/ajaxfiles/smtp_settings.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        smtpData.isLoader = false;
        setSMTPData({ ...smtpData });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      });
    }
  };

  const fetchUserPref = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    await axios
      .post(`${Url}/ajaxfiles/get_user_prefrence.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }

        setPrefrence({
          isLoader: false,
          user_email: res.data.user_email,
          user_first_name: res.data.user_first_name,
          user_last_name: res.data.user_last_name,
          user_name: res.data.user_name,
          user_phone: res.data.user_phone,
          referral_code: res.data.referral_code,
        });
      });
  };

  const updateUser = async () => {
    prefrence.isLoader = true;
    setPrefrence({ ...prefrence });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("first_name", prefrence.user_first_name);
    param.append("last_name", prefrence.user_last_name);
    param.append("user_phone", prefrence.user_phone);
    param.append("action", "update_profile");
    await axios
      .post(`${Url}/ajaxfiles/profile_update.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        prefrence.isLoader = false;
        setPrefrence({ ...prefrence });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setOpen(false);
        }
      });
  };

  useEffect(() => {
    fetchUserPref();
    // getSMTPDetails();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container spacing={3} className="margin-bottom-30px">
              <Grid item md={6} lg={6} xl={6} sm={12}>
                <p className="main-heading">&nbsp;</p>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px", height: "100%" }}
                >
                  <div className="headerSection header-title">
                    <p className="margin-0">My Account</p>
                    <IconButton
                      className="padding-0px"
                      onClick={(e) => {
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item sm={12} md={12} lg={12}>
                      <div className="from-section">
                        <div className="input-section">
                          <div className="full-section">
                            <div className="element">
                              <label>First Name</label>
                              <span>{prefrence.user_first_name}</span>
                            </div>
                            <div className="element">
                              <label>Last Name</label>
                              <span>{prefrence.user_last_name}</span>
                            </div>
                          </div>
                          <div className="full-section">
                            <div className="element">
                              <label>E-mail</label>
                              <span>{prefrence.user_email}</span>
                            </div>
                            <div className="element">
                              <label>Mobile</label>
                              <span>{prefrence.user_phone}</span>
                            </div>
                            {/* <div className='element'>
                                                            <label>Phone</label>
                                                            <span></span>
                                                        </div> */}
                          </div>
                          {/* <div className='full-section'>
                                                        <div className='element'>
                                                            <label>Password</label>
                                                            <span>*********</span>
                                                        </div>
                                                        <div className='element'>
                                                            <label className='margeIcon'>Change Password
                                                                <button className="copy_link" onClick={openDialogbox}>
                                                                    <span className="blinking">
                                                                        <i className="material-icons">edit</i>
                                                                    </span>
                                                                </button>
                                                            </label>
                                                            <span></span>
                                                        </div>
                                                    </div> */}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item md={6} lg={6} xl={6} sm={12}>
                <p className="main-heading">&nbsp;</p>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px", height: "100%" }}
                >
                  <div className="headerSection header-title">
                    <p className="margin-0">Referal Links</p>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item sm={12} md={12} lg={12}>
                      <div className="referal-links-section">
                        <div className="referal-link-element">
                          <p className="title">Register:</p>
                          <div className="content">
                            <a
                              className="text-break"
                              href={
                                ClientUrl +
                                `/register/managercode/${prefrence.referral_code}`
                              }
                              target="_blank"
                            >
                              {ClientUrl +
                                `/register/managercode/${prefrence.referral_code}`}
                            </a>
                            <button
                              className="copy_link"
                              onClick={(e) => {
                                navigator.clipboard
                                  .writeText(
                                    ClientUrl +
                                      `/register/managercode/${prefrence.referral_code}`
                                  )
                                  .then(
                                    function () {
                                      toast.success(
                                        "The link has been successfully copying"
                                      );
                                    },
                                    function (err) {
                                      toast.error(
                                        "The link Could not copy, Please try again"
                                      );
                                    }
                                  );
                              }}
                            >
                              <span className="blinking">
                                <i className="material-icons">content_copy</i>
                              </span>
                            </button>
                          </div>
                        </div>
                        {/* <div className='referal-link-element'>
                                                    <p className='title'>Register Live:</p>
                                                    <div className='content'>
                                                        <span>https://alphapixclients.com/forex/registerlive.php?ref=541879</span>
                                                        <button className="copy_link">
                                                            <span className="blinking">
                                                                <i className="material-icons">content_copy</i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='referal-link-element'>
                                                    <p className='title'>Register IB:</p>
                                                    <div className='content'>
                                                        <span>https://alphapixclients.com/forex/registerib.php?ref=541879</span>
                                                        <button className="copy_link">
                                                            <span className="blinking">
                                                                <i className="material-icons">content_copy</i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div> */}
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              {/* <Grid item md={6} lg={6} xl={6} sm={12}>
                <p className="main-heading">&nbsp;</p>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px", height: "100%" }}
                >
                  <div className="headerSection header-title">
                    <p className="margin-0">SMTP Settings</p>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item sm={12} md={12} lg={12}>
                      <div className="fromSection">
                        <div className="inputSection">
                          <div className="element">
                            <TextField
                              label="Server"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              focused
                              value={smtpData.smtp_host}
                              onChange={input}
                            />
                          </div>
                          <div className="element">
                            <TextField
                              label="Port"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              focused
                              value={smtpData.smtp_port}
                              onChange={input}
                            />
                          </div>
                          <div className="element">
                            <TextField
                              label="Authentication Email"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              focused
                              value={smtpData.smtp_user}
                              onChange={input}
                            />
                          </div>
                          <div className="element">
                            <TextField
                              label="Password"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              focused
                              value={smtpData.smtp_user_password}
                              onChange={input}
                            />
                          </div>
                        </div>
                        <div className="buttonSection">
                          {smtpData.isLoader ? (
                            <Button
                              variant="contained"
                              disabled
                              className="btn-gradient  btn-success createMt5Formloder"
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
                              className="btn-success"
                              onClick={submitSMTP}
                            >
                              Add SMTP
                            </Button>
                          )}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid> */}
            </Grid>

            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              fullWidth={true}
              maxWidth={`md`}
              className="modalWidth100"
            >
              <BootstrapDialogTitle
                id="customized-dialog-title"
                className="dialogTitle"
                onClose={handleClose}
              >
                Change User Details
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <div className="changePasswordSection">
                  <div className="element">
                    <TextField
                      label="First Name"
                      variant="standard"
                      sx={{ width: "100%" }}
                      focused
                      value={prefrence.user_first_name}
                    />
                  </div>
                  <br />
                  <div className="element">
                    <TextField
                      label="Last Name"
                      variant="standard"
                      sx={{ width: "100%" }}
                      focused
                      value={prefrence.user_last_name}
                    />
                  </div>
                  <br />
                  <div className="element">
                    <TextField
                      label="Mobile"
                      variant="standard"
                      sx={{ width: "100%" }}
                      focused
                      value={prefrence.user_phone}
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <div className="dialogMultipleActionButton">
                  <Button
                    variant="contained"
                    className="cancelButton"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  {prefrence.isLoader ? (
                    <Button
                      variant="contained"
                      disabled
                      className="btn-gradient  btn-success createMt5Formloder"
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
                      className="btn-success"
                      onClick={updateUser}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </DialogActions>
            </BootstrapDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;
