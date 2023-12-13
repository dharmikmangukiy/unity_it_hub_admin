import "./mt5_group.css";
import React, { useState } from "react";
import {
  Button,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const Mt5Group = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [form, setForm] = useState({
    group_name: "",
    mt5_group_name: "",
    isActive: false,
    isLoader: "",
    groupId: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "GROUP NAME",
      value: false,
      name: "group_name",
    },
    {
      label: "MT5 GROUP NAME",
      value: false,
      name: "mt5_group_name",
    },
    {
      label: "DATE",
      value: false,
      name: "date",
    },
  ]);
  toast.configure();

  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "GROUP NAME",
      selector: (row) => {
        return <span title={row.group_name}>{row.group_name}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "MT5 GROUP NAME",
      selector: (row) => {
        return <span title={row.mt5_group_name}>{row.mt5_group_name}</span>;
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={`status-${row.status == "1" ? "active" : "in-active"}`}
          >
            {row.status == "1" ? "Active" : "In-Active"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div className="actionButtonGroup">
            <Button
              className="btn-edit"
              onClick={(event) => editGroupDetails(event, row.group_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </Button>
            <Button
              className="btn-close"
              onClick={(event) => actionMenuPopup(event, row.group_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i class="fa fa-times" aria-hidden="true"></i>
            </Button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 0.5,
    },
  ];

  const editGroupDetails = async (e, id) => {
    const param = new FormData();
    param.append("action", "edit_mt5_group");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("group_id", id);
    await axios
      .post(`${Url}/ajaxfiles/mt5_group_manage.php`, param)
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
          setForm((prevalue) => {
            return {
              ...prevalue,
              group_name: res.data.group_name,
              mt5_group_name: res.data.mt5_group_name,
              isActive: res.data.active_status == "1" ? true : false,
              groupId: id,
            };
          });
          setDialogTitle("Edit MT5 Groups");
          setOpen(true);
        }
      });
  };

  const deleteMt5Group = async (id) => {
    const param = new FormData();
    param.append("action", "delete_mt5_group");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("group_id", id);
    await axios
      .post(`${Url}/ajaxfiles/mt5_group_manage.php`, param)
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
          setRefresh(!refresh);
        }
      });
  };

  const actionMenuPopup = (e, index) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to delete this?</p>
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
                  onClose();
                  deleteMt5Group(index);
                }}
              >
                Yes, Delete it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  const handleClickOpen = (e) => {
    setForm({
      group_name: "",
      mt5_group_name: "",
      isActive: false,
      isLoader: "",
      groupId: "",
    });
    setDialogTitle("Add MT5 Groups");
    setOpen(true);
  };

  const manageContent = () => {
    if (dialogTitle == "Add MT5 Groups") {
      return (
        <div>
          <div className="margeField">
            <TextField
              label="Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="group_name"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeField">
            <TextField
              label="MT5 Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="mt5_group_name"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeField">
            <FormControlLabel
              control={
                <Checkbox name="isActive" size="small" onChange={input} />
              }
              label="Active"
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Edit MT5 Groups") {
      return (
        <div>
          <div className="margeField">
            <TextField
              label="Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="group_name"
              value={form.group_name}
              onChange={input}
            />
          </div>
          <br />
          <div className="margeField">
            <TextField
              label="MT5 Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="mt5_group_name"
              value={form.mt5_group_name}
              onChange={input}
            />
          </div>
          <br />
          <div className="margeField">
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  size="small"
                  checked={form.isActive}
                  onChange={input}
                />
              }
              label="Active"
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "View") {
      return <div></div>;
    } else if (dialogTitle == "Reject") {
      return (
        <div>
          <div className="deposit-action-popup-text">
            <label>Are you want to sure reject this deposit ?</label>
          </div>
        </div>
      );
    } else if (dialogTitle == "Approve") {
      return (
        <div>
          <div className="deposit-action-popup-text">
            <label>Are you want to sure approve this deposit ?</label>
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add MT5 Groups" || dialogTitle == "Edit MT5 Groups") {
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
              {dialogTitle == "Add MT5 Groups" ? "Add" : "Update"}
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Reject") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained" className="btn-gradient btn-danger">
            Reject
          </Button>
        </div>
      );
    } else if (dialogTitle == "Approve") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained" className="btn-gradient btn-success">
            Approve
          </Button>
        </div>
      );
    }
  };

  const formSubmit = async () => {
    if (form.group_name == "") {
      toast.error("Please enter group name");
    } else if (form.mt5_group_name == "") {
      toast.error("Please enter MT5 group name");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (dialogTitle == "Add MT5 Groups") {
        param.append("action", "add_mt5_group");
      } else {
        param.append("group_id", form.groupId);
        param.append("action", "update_mt5_group");
      }
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("group_name", form.group_name);
      param.append("mt5_group_name", form.mt5_group_name);
      param.append("status", form.isActive ? 1 : 0);
      await axios
        .post(`${Url}/ajaxfiles/mt5_group_manage.php`, param)
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
            setRefresh(!refresh);
            toast.success(res.data.message);
            setOpen(false);
            setForm({
              group_name: "",
              mt5_group_name: "",
              isActive: false,
              isLoader: "",
              groupId: "",
            });
          }
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">MT5 Groups</p>
                <CommonFilter search={searchBy} />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <div className="actionGroupButton">
                    <Button
                      variant="contained"
                      className="add-group"
                      onClick={handleClickOpen}
                    >
                      Add
                    </Button>
                  </div>
                  <br />
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/mt5_group_list.php`}
                          column={column}
                          sort="4"
                          refresh={refresh}
                          search={searchBy}
                        />
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

export default Mt5Group;
