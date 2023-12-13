import { Button, CardContent, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./link.css";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";

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

const Target = () => {
  const navigate = useNavigate();
  var [salesPerson, setSalesPerson] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState("");
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [checkStatus, setcheckStatus] = useState("");
  const [form, setForm] = useState({
    ac_target: "",
    money_in_target: "",
    id: "",
    isLoader: false,
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "name",
    },
    {
      label: "Sales Person Name",
      value: false,
      name: "sales_porson_name",
    },
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    {
      label: "Mobile",
      value: false,
      name: "user_phone",
    },
    {
      label: "Account Target",
      value: false,
      name: "ac_target",
    },
    {
      label: "Money In Target",
      value: false,
      name: "money_in_target",
    },
  ]);

  const activityColumn = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "USER NAME",
      selector: (row) => {
        return (
          <span title={row.sales_porson_name}>{row.sales_porson_name}</span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "MOBILE",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "MANAGER",
      selector: (row) => {
        return (
          <span title={row.sales_manager_master}>
            {row.sales_manager_master}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "ACCOUNT TARGET",
      selector: (row) => {
        return <span title={row.ac_target}>{row.ac_target}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "MONEY IN TARGET",
      selector: (row) => {
        return <span title={row.money_in_target}>{row.money_in_target}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={
              row.user_status == "0"
                ? "Pending"
                : row.user_status == "1"
                ? "Approve"
                : "Rejected"
            }
            className={`text-color-${
              row.user_status == "1"
                ? "green"
                : row.user_status == "2"
                ? "red"
                : "yellow"
            }`}
          >
            {row.user_status == "0"
              ? "Pending"
              : row.user_status == "1"
              ? "Approve"
              : "Rejected"}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "DATETIME",
      selector: (row) => {
        return (
          <span title={row.user_added_datetime}>{row.user_added_datetime}</span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            <Button onClick={(e) => edit(row)}>
              <i className="material-icons">track_changes</i>
            </Button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  toast.configure();

  const getTarget = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    // param.append("user_id", id);
    param.append("action", "get_target");
    await axios
      .post(Url + "/ajaxfiles/campaign_manage.php", param)
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
          salesPerson = res.data.sales_person_target;
          setSalesPerson({ ...salesPerson });
          setForm({
            ac_target: res.data.sales_person_target.sales_person_ac_target,
            money_in_target: res.data.sales_person_target.sales_person_money_in,
          });
        }
      });
  };

  const submit = async () => {
    if (form.sales_person_ac_target == "") {
      toast.error("Please enter sales person account target");
    } else if (form.sales_person_money_in == "") {
      toast.error("Please enter sales person money in");
    } else {
      form.isLoder = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      // param.append("user_id", id);
      param.append("action", "set_target");
      param.append("sales_person_ac_target", form.sales_person_ac_target);
      param.append("sales_person_money_in", form.sales_person_money_in);
      await axios
        .post(Url + "/ajaxfiles/campaign_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          form.isLoder = false;
          setForm({ ...form });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
          }
        });
    }
  };

  const input = (e) => {
    const { name, value } = e.target;

    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const edit = async (data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("user_id", data.user_id);
    param.append("action", "get_target");
    await axios
      .post(Url + "/ajaxfiles/target_manage.php", param)
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
          setForm({
            ac_target: res.data.ac_target,
            id: data.user_id,
            money_in_target: res.data.money_in_target,
          });
          setDialogTitle("Edit");
          setOpen(true);
        }
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const manageContent = () => {
    if (dialogTitle == "Edit") {
      return (
        <div>
          <div className="element">
            <TextField
              label="Account Target"
              variant="standard"
              sx={{ width: "100%" }}
              name="ac_target"
              onChange={input}
              value={form.ac_target}
              focused
            />
          </div>
          <br />
          <div className="element">
            <TextField
              label="Money In Target"
              variant="standard"
              sx={{ width: "100%" }}
              name="money_in_target"
              onChange={input}
              value={form.money_in_target}
              focused
            />
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Edit") {
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
              className=" btn-gradient  btn-success createMt5Formloder"
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
              onClick={submitForm}
            >
              Update
            </Button>
          )}
        </div>
      );
    }
  };

  const submitForm = async () => {
    if (form.ac_target == "") {
      toast.error("Please enter account target");
    } else if (form.money_in_target == "") {
      toast.error("Please enter money in target");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("user_id", form.id);
      param.append("ac_target", form.ac_target);
      param.append("money_in_target", form.money_in_target);
      param.append("action", "set_target");
      await axios
        .post(Url + "/ajaxfiles/target_manage.php", param)
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
            toast.success(res.data.message);
            setRefresh(!refresh);
            setForm({
              ac_target: "",
              id: "",
              money_in_target: "",
            });
            setOpen(false);
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
                <p className="main-heading">Salesman</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  setcheckStatus={setcheckStatus}
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
                        <CommonTable
                          url={`${Url}/datatable/salesmanager_list.php`}
                          column={activityColumn}
                          sort="2"
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          refresh={refresh}
                          checkStatus={checkStatus}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
                {/* <Paper elevation={2} style={{ borderRadius: "10px" }} className='pending-all-15px'>
                                    <Grid container spacing={3} className="grid-handle">
                                        <Grid item md={12} lg={12} xl={12}>
                                            <Paper
                                                elevation={2}
                                                style={{ borderRadius: "10px" }}
                                                className="paper-main-section partnership-main-section">
                                                <div className='table-header-section'>
                                                    <label>Name</label>
                                                    <label>Account Target</label>
                                                    <label>Money In</label>
                                                </div>
                                                <div className='table-body-section'>
                                                    <span>Sales Person</span>
                                                    <div>
                                                        <input type="number" onChange={input} name="sales_person_ac_target" min="1" max="100" placeholder='Target' value={form.sales_person_ac_target} />
                                                    </div>
                                                    <div>
                                                        <input type="number" onChange={input} name="sales_person_money_in" min="1" placeholder='Money In' value={form.sales_person_money_in} />
                                                    </div>
                                                </div>
                                                <div className='button-center'>
                                                    {
                                                        (form.isLoder) ?
                                                            <Button
                                                                size="large"
                                                                className="createMt5Formloder"
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
                                                            </Button> : <Button
                                                                variant="contained"
                                                                className="add_master_structure"
                                                                onClick={submit}>
                                                                Save
                                                            </Button>
                                                    }

                                                </div>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Paper> */}
              </Grid>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesIncentiveExcel;
