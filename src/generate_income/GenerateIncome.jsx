import "./generate_income.css";
import React, { useState } from "react";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import { Box } from "@mui/system";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

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

const GenerateIncome = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [dialogTitle, setDialogTitle] = useState("");
  const [form, setForm] = useState({
    password: "",
    isLoader: false,
  });
  toast.configure();

  const handleClickOpen = (e) => {
    setForm({
      password: "",
      isLoader: false,
    });
    if (e.target.classList.contains("partnership")) {
      setDialogTitle("Generate Partnership Income");
    } else if (e.target.classList.contains("copy_trading")) {
      setDialogTitle("Generate Copy Trading Income");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setForm({
      password: "",
      isLoader: false,
    });
    setOpen(false);
  };

  const manageContent = () => {
    return (
      <div>
        <div className="element">
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              type="password"
              label="Verify Current Password"
              variant="standard"
              sx={{ width: "100%" }}
              onChange={input}
              name="password"
            />
          </Box>
        </div>
      </div>
    );
  };

  const manageDialogActionButton = () => {
    return (
      <div className="dialogMultipleActionButton">
        <Button
          variant="contained"
          className="cancelButton"
          onClick={handleClose}
        >
          Cancel
        </Button>
        {form.isLoader == true ? (
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
            Submit
          </Button>
        )}
      </div>
    );
  };

  const input = (event) => {
    var { name, value } = event.target;

    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const formSubmit = async () => {
    if (form.password == "") {
      toast.error("Please enter password");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("verify_password", form.password);

      await axios
        .post(
          `${Url}admin/ajaxfiles/${
            dialogTitle == "Generate Partnership Income"
              ? "generate_partnership_income"
              : "generate_copy_trading_income"
          }.php`,
          param
        )
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          form.isLoader = false;
          setForm({ ...form });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            // setRefresh(!refresh);
            toast.success(res.data.message);
            setOpen(false);
            setForm({
              password: "",
              isLoader: false,
            });
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
                <p className="main-heading">Generate Income</p>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <div className="generate-group-btn">
                          <Button
                            variant="contained"
                            className="partnership"
                            onClick={(e) => handleClickOpen(e)}
                          >
                            Generate Partnership
                          </Button>
                          <Button
                            variant="contained"
                            className="copy_trading"
                            onClick={(e) => handleClickOpen(e)}
                          >
                            Generate Copy Trading
                          </Button>
                        </div>
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

export default GenerateIncome;
