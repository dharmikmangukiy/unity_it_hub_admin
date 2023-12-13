// import "./faq_editor.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonTable from "../common/CommonTable";
import CommonFilter from "../common/CommonFilter";
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
import NewDate from "../common/NewDate";
const re = /^[A-Za-z0-9_ ]*$/;

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const UsersGroups = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [resData, setResData] = useState({});
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [form, setForm] = useState({
    user_group_name: "",
    status: false,
    user_group_id: "",
    isLoader: false,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "Group Name",
      value: false,
      name: "user_group_name",
    },
    {
      label: "Created By",
      value: false,
      name: "created_by",
    },
  ]);
  const [param, setParam] = useState("");
  toast.configure();

  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "Group Name",
      selector: (row) => {
        return <span title={row.user_group_name}>{row.user_group_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Created By",
      selector: (row) => {
        return <span title={row.created_by}>{row.created_by}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Users in Group",
      selector: (row) => {
        return <span title={row.group_users}>{row.group_users}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
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
      grow: 0.3,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div className="actionButtonGroup">
            {prop.permission.update_user_group == 1 ? (
              <Button
                className="btn-edit"
                onClick={(event) => editGroup(row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              </Button>
            ) : (
              ""
            )}
            {prop.permission.delete_user_group == 1 ? (
              <Button
                className="btn-close"
                onClick={(event) => actionMenuPopup(event, row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-times" aria-hidden="true"></i>
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

  const editGroup = (data) => {
    setForm({
      user_group_name: data.user_group_name,
      status: data.status == "1" ? true : false,
      user_group_id: data.user_group_id,
      isLoader: false,
    });
    setDialogTitle("Edit Group");
    setOpen(true);
  };

  const deleteGroup = async (data, onClose) => {
    const param = new FormData();
    document.getElementById("loder").classList.add("MyClassLoder");
    var button = document.getElementById("loder");

    // Disable the button
    button.disabled = true;
    button.innerHTML = ` <svg class="spinner" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>`;
    param.append("action", "delete_user_group");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_group_id", data.user_group_id);
    await axios
      .post(`${Url}/ajaxfiles/user_group_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          document.getElementById("loder").classList.remove("MyClassLoder");
          var button = document.getElementById("loder");
          button.disabled = false;
          button.innerHTML = `Yes, Delete it!`;
          toast.error(res.data.message);
        } else {
          onClose();
          setRefresh(!refresh);
          toast.success(res.data.message);
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
                id="loder"
                variant="contained"
                className="btn-gradient btn-danger"
                onClick={() => {
                  deleteGroup(index, onClose);
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
      user_group_name: "",
      status: false,
      user_group_id: "",
      isLoader: "",
    });
    setDialogTitle("Add Group");
    setOpen(true);
  };

  const manageContent = () => {
    if (dialogTitle == "Add Group") {
      return (
        <div>
          <div className="margeField">
            <TextField
              label="Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="user_group_name"
              // onChange={input}
              value={form.user_group_name}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
            />
          </div>
          <br />
          <div className="margeField">
            <FormControlLabel
              control={<Checkbox name="status" size="small" onChange={input} />}
              label="Status"
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Edit Group") {
      return (
        <div>
          <div className="margeField">
            <TextField
              label="Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="user_group_name"
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
              value={form.user_group_name}
            />
          </div>
          <br />
          <div className="margeField">
            <FormControlLabel
              control={
                <Checkbox
                  name="status"
                  checked={form.status}
                  size="small"
                  onChange={input}
                />
              }
              label="Status"
            />
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add Group" || dialogTitle == "Edit Group") {
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
              {dialogTitle == "Add Group" ? "Add" : "Update"}
            </Button>
          )}
        </div>
      );
    }
  };

  const formSubmit = async () => {
    if (form.user_group_name == "") {
      toast.error("Please enter group name");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (form.user_group_id == "") {
        param.append("action", "add_user_group");
      } else {
        param.append("user_group_id", form.user_group_id);
        param.append("action", "update_user_group");
      }
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_group_name", form.user_group_name);
      param.append("status", form.status ? "1" : "0");
      await axios
        .post(`${Url}/ajaxfiles/user_group_manage.php`, param)
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
              user_group_name: "",
              status: false,
              user_group_id: "",
              isLoader: "",
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
                <p className="main-heading">User Groups</p>
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
                  <div className="actionGroupButton">
                    {prop.permission.add_user_group == 1 ? (
                      <Button
                        variant="contained"
                        className="add-group"
                        onClick={handleClickOpen}
                      >
                        Add
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                  <br />
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/user_groups.php`}
                          column={column}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          setResData={setResData}
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

export default UsersGroups;
