import {
  Button,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
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
import NewDate from "../common/NewDate";

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

const Target = (prop) => {
  const navigate = useNavigate();
  var [salesPerson, setSalesPerson] = useState({});
  const [reportData, setReportData] = useState({
    manager_id: "",
    month: "",
    year: "",
    type: "",
  });

  const [inputReportinfoTrue, setinputReportinfoTrue] = useState({
    month: false,
    year: false,
    type: false,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState("");
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [checkStatus, setcheckStatus] = useState("");
  const [resData, setResData] = useState({});
  const [form, setForm] = useState({
    ac_target: "",
    money_in_target: "",
    id: "",
    ib_ac_target: "",
    isLoader: false,
  });

  const [inputinfoTrue, setinputinfoTrue] = useState({
    ac_target: false,
    money_in_target: false,
    id: false,
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "name",
    },
    // {
    //   label: "Sales Person Name",
    //   value: false,
    //   name: "sales_porson_name",
    // },
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
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "MOBILE",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      // wrap: true,
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
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "ACCOUNT TARGET",
      selector: (row) => {
        return <span title={row.ac_target}>{row.ac_target}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "MONEY IN TARGET",
      selector: (row) => {
        return <span title={row.money_in_target}>{row.money_in_target}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "IB Account Target",
      selector: (row) => {
        return <span title={row.ib_ac_target}>{row.ib_ac_target}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
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
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "DATETIME",
      selector: (row) => {
        return (
          <span title={row.user_added_datetime}>
            <NewDate newDate={row.user_added_datetime} />
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Report",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.export_saleman_insantive == 1 ||
            prop.permission.export_saleman_target == 1 ? (
              <Button onClick={(e) => report(row)}>
                <i className="material-icons">stacked_bar_chart</i>
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
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.set_target == 1 ? (
              <Button onClick={(e) => edit(row)}>
                <i className="material-icons">track_changes</i>
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

  toast.configure();

  const getTarget = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
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
            // ib_ac_target: res.data.sales_person_target.
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
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
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
  const inputtrueFalse = (event) => {
    var { name, value } = event.target;
    setinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const inputReport = (e) => {
    const { name, value } = e.target;

    setReportData((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const inputReporttrueFalse = (event) => {
    var { name, value } = event.target;
    setinputReportinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const edit = async (data) => {
    setForm({
      ac_target: data.ac_target,
      id: data.user_id,
      ib_ac_target: data.ib_ac_target,
      money_in_target: data.money_in_target,
    });
    setDialogTitle("Edit");
    setOpen(true);
    //   const param = new FormData();
    //   if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
    //     param.append("is_app", IsApprove.is_app);
    //     param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    //     param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    //   }
    //   param.append("user_id", data.user_id);
    //   param.append("action", "get_target");
    //   await axios
    //     .post(Url + "/ajaxfiles/target_manage.php", param)
    //     .then((res) => {
    //       if (res.data.message == "Session has been expired") {

    //         localStorage.setItem("login", true);
    //         navigate("/");
    //         return;
    //       }

    //       if (res.data.status == "error") {
    //         toast.error(res.data.message);
    //       } else {

    //       }
    //     });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const report = (data) => {
    setReportData({
      manager_id: data.user_id,
      month: "",
      year: "",
      type: "",
    });
    setDialogTitle("Report");
    setinputReportinfoTrue({
      month: false,
      year: false,
      type: false,
    });
    setOpen(true);
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
              // onChange={input}
              value={form.ac_target}
              onBlur={inputtrueFalse}
              error={
                form.ac_target == "" && inputinfoTrue.ac_target ? true : false
              }
              helperText={
                form.ac_target == "" && inputinfoTrue.ac_target
                  ? "Account Target is required"
                  : ""
              }
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input(e);
                }
              }}
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
              // onChange={input}
              error={
                form.money_in_target == "" && inputinfoTrue.money_in_target
                  ? true
                  : false
              }
              helperText={
                form.money_in_target == "" && inputinfoTrue.money_in_target
                  ? "Money In Target is required"
                  : ""
              }
              onBlur={inputtrueFalse}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input(e);
                }
              }}
              value={form.money_in_target}
              focused
            />
          </div>
          <br />
          <div className="element">
            <TextField
              label="IB Account Target"
              variant="standard"
              sx={{ width: "100%" }}
              name="ib_ac_target"
              // onChange={input}
              error={
                form.ib_ac_target == "" && inputinfoTrue.ib_ac_target
                  ? true
                  : false
              }
              helperText={
                form.ib_ac_target == "" && inputinfoTrue.ib_ac_target
                  ? "IB Account Target is required"
                  : ""
              }
              onBlur={inputtrueFalse}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input(e);
                }
              }}
              value={form.ib_ac_target}
              focused
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Report") {
      return (
        <div>
          <div className="element">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                reportData.type == "" && inputReportinfoTrue.type ? true : false
              }
            >
              <InputLabel>Report Type</InputLabel>
              <Select
                label
                className="select-font-small"
                name="type"
                onBlur={inputReporttrueFalse}
                onChange={inputReport}
              >
                {prop.permission.export_saleman_insantive == 1 ? (
                  <MenuItem value="1">Salesman Incentive</MenuItem>
                ) : (
                  ""
                )}
                {prop.permission.export_saleman_target == 1 ? (
                  <MenuItem value="2">Salesman Target</MenuItem>
                ) : (
                  ""
                )}
              </Select>
              {reportData.type == "" && inputReportinfoTrue.type ? (
                <FormHelperText>Report Type is required </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <br />
          <div className="element">
            <TextField
              type="text"
              label="Month"
              variant="standard"
              sx={{ width: "100%" }}
              name="month"
              value={reportData.month}
              onBlur={inputReporttrueFalse}
              error={
                reportData.month == "" && inputReportinfoTrue.month
                  ? true
                  : false
              }
              helperText={
                reportData.month == "" && inputReportinfoTrue.month
                  ? "Month is required"
                  : ""
              }
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  reportData.month = Number(e.target.value);
                  setReportData({
                    ...reportData,
                  });
                }
              }}
              focused
            />
          </div>
          <br />
          <div className="element">
            <TextField
              type="text"
              label="Year"
              variant="standard"
              sx={{ width: "100%" }}
              name="year"
              onBlur={inputReporttrueFalse}
              error={
                reportData.year == "" && inputReportinfoTrue.year ? true : false
              }
              helperText={
                reportData.year == "" && inputReportinfoTrue.year
                  ? "Year is required"
                  : ""
              }
              value={reportData.year}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  reportData.year = Number(e.target.value);
                  setReportData({
                    ...reportData,
                  });
                }
              }}
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
    } else if (dialogTitle == "Report") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="btn-gradient btn-success"
            onClick={downloadReport}
          >
            Download
          </Button>
        </div>
      );
    }
  };

  const submitForm = async () => {
    if (form.ac_target == "") {
      toast.error("Please enter account target");
    } else if (form.money_in_target == "") {
      toast.error("Please enter money in target");
    } else if (form.ib_ac_target == "") {
      toast.error("Please enter IB Account Target");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", form.id);
      param.append("ac_target", form.ac_target);
      param.append("money_in_target", form.money_in_target);
      param.append("ib_ac_target", form.ib_ac_target);

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
              ib_ac_target: "",
              money_in_target: "",
            });
            setOpen(false);
          }
        });
    }
  };

  const downloadReport = async () => {
    if (reportData.type == "") {
      toast.error("Please select type");
    } else if (reportData.month == "") {
      toast.error("Please enter month");
    } else if (reportData.year == "") {
      toast.error("Please enter year");
    } else {
      setOpen(false);
      window.open(
        `${Url}/${
          reportData.type == "1"
            ? "ajaxfiles/salesman_insantive_report.php"
            : "ajaxfiles/salesman_target_report.php"
        }?manager_id=${reportData.manager_id}&month=${reportData.month}&year=${
          reportData.year
        }`,
        "_blank"
      );
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
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" onClick={handleClickOpen}>Add Deposit</Button>
                                    </div>
                                    <br /> */}
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
                          setResData={setResData}
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

export default Target;
