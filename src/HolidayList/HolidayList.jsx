// import "./faq_editor.css";
import React, { useState, useEffect } from "react";
import {
  Autocomplete,
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

const HolidayList = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [resData, setResData] = useState({});
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    date: "",
    status: false,
    Start_Time: "",
    isLoader: false,
    End_Time: "",
    id: "",
    symbol: [],
  });
  const [formTrue, setFormTrue] = useState({
    date: false,
    Start_Time: false,
    End_Time: false,
    symbol: false,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "added datetime",
      value: false,
      name: "added_datetime",
    },
    {
      label: "date",
      value: false,
      name: "date",
    },
    {
      label: "start time",
      value: false,
      name: "start_time",
    },
    {
      label: "end time",
      value: false,
      name: "end_time",
    },
  ]);
  const [param, setParam] = useState("");
  toast.configure();
  useEffect(() => {
    listSourceMaster();
  }, []);
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
      name: "added datetime",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "date",
      selector: (row) => {
        return <span title={row.date}>{row.date}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "start time",
      selector: (row) => {
        return <span title={row.start_time}>{row.start_time}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "end time",
      selector: (row) => {
        return <span title={row.end_time}>{row.end_time}</span>;
      },
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "SYMBOL",
      selector: (row) => {
        return <span title={row.symbol}>{row.symbol}</span>;
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
            {prop.permission !== 1 ? (
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
            {prop.permission !== 1 ? (
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
  const listSourceMaster = async () => {
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    // param.append("user_id", id);
    param.append("action", "get_scripts");
    await axios
      .post(Url + "/ajaxfiles/script_holiday_master.php", param)
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
          setList(res.data.data);
          // setSourceMasterList({ ...res.data });
        }
      });
  };
  const editGroup = (data) => {
    var newArray = [];
    data.script_ids?.map((item, index) => {
      let test = list.filter((x) => x.script_id == item)[0];
      if (test) {
        newArray.push(test);
      }
    });
    setForm({
      date: data.date,
      status: data.status == "1" ? true : false,
      Start_Time: data.start_time,
      End_Time: data.end_time,
      id: data.id,

      symbol: newArray,
      holiday_id: "",
      isLoader: false,
    });
    setDialogTitle("Edit Holiday");
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
    param.append("action", "delete_script");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }

    param.append("id", data.id);
    await axios
      .post(`${Url}/ajaxfiles/script_holiday_master.php`, param)
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
      date: "",
      status: false,
      holiday_id: "",
      id: "",
      Start_Time: "",
      isLoader: false,
      End_Time: "",
      symbol: [],
    });
    setFormTrue({
      date: false,
      Start_Time: false,
      End_Time: false,
      symbol: false,
    });
    setDialogTitle("Add Holiday");
    setOpen(true);
  };

  const manageContent = () => {
    if (dialogTitle == "Add Holiday" || dialogTitle == "Edit Holiday") {
      return (
        <div>
          <div className="margeField">
            <Autocomplete
              multiple
              id="tags-standard"
              className="w-100"
              options={list}
              value={form.symbol}
              getOptionLabel={(option) =>
                option.script_name ? option.script_name : ""
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.script_id}>
                    {option.script_name}
                  </li>
                );
              }}
              onChange={(event, newValue) => {
                form.symbol = newValue;
                setForm({ ...form });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Symbol"
                  name="symbol"
                  placeholder="Select Symbol"
                  onBlur={inputTrue}
                  error={
                    form.symbol.length == 0 && formTrue.symbol ? true : false
                  }
                  helperText={
                    form.symbol.length == 0 && formTrue.symbol
                      ? "Symbol is required"
                      : ""
                  }
                />
              )}
            />
            {/* 
            <TextField
              label="Symbol"
              variant="standard"
              sx={{ width: "100%" }}
              name="symbol"
              onChange={input}
            /> */}
          </div>
          <br />

          <div className="margeField">
            <TextField
              //   id={`standard-basis3${index}`}
              label="Start Time"
              name="Start_Time"
              variant="standard"
              type="time"
              sx={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,
              }}
              value={form.Start_Time}
              onChange={input}
              onBlur={inputTrue}
              error={
                form.Start_Time == "" && formTrue.Start_Time ? true : false
              }
              helperText={
                form.Start_Time == "" && formTrue.Start_Time
                  ? "Start Time is required"
                  : ""
              }
            />
            <TextField
              //   id={`standard-basis3${index}`}
              label="End Time"
              name="End_Time"
              variant="standard"
              type="time"
              sx={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,
              }}
              value={form.End_Time}
              onChange={input}
              onBlur={inputTrue}
              error={form.End_Time == "" && formTrue.End_Time ? true : false}
              helperText={
                form.End_Time == "" && formTrue.End_Time
                  ? "End Time is required"
                  : ""
              }
            />
          </div>
          <br />
          <div className="margeField">
            <TextField
              variant="standard"
              sx={{ width: "100%" }}
              name="date"
              type="date"
              label="Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={form.date}
              onChange={input}
              onBlur={inputTrue}
              error={form.date == "" && formTrue.date ? true : false}
              helperText={
                form.date == "" && formTrue.date ? "Date is required" : ""
              }
            />
          </div>
        </div>
      );
    }
    // else if (dialogTitle == "Edit Holiday") {
    //   return (
    //     <div>
    //       <div className="margeField">
    //         <TextField
    //           //   id={`standard-basis3${index}`}
    //           label="Start Time"
    //           name="Start_Time"
    //           variant="standard"
    //           type="time"
    //           sx={{ width: "100%" }}
    //           InputLabelProps={{
    //             shrink: true,
    //           }}
    //           value={form.Start_Time}
    //           onChange={input}
    //         />
    //         <TextField
    //           //   id={`standard-basis3${index}`}
    //           label="End Time"
    //           name="End_Time"
    //           variant="standard"
    //           type="time"
    //           sx={{ width: "100%" }}
    //           InputLabelProps={{
    //             shrink: true,
    //           }}
    //           value={form.End_Time}
    //           onChange={input}
    //         />
    //       </div>

    //       <label htmlFor="">Date</label>
    //       <div className="margeField">
    //         <TextField
    //           variant="standard"
    //           sx={{ width: "100%" }}
    //           name="date"
    //           type="date"
    //           value={form.date}
    //           onChange={input}
    //         />
    //       </div>
    //       <div className="margeField">
    //         <TextField
    //           label="Symbol"
    //           variant="standard"
    //           sx={{ width: "100%" }}
    //           name="symbol"
    //           onChange={input}
    //           value={form.symbol}
    //         />
    //       </div>
    //     </div>
    //   );
    // }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add Holiday" || dialogTitle == "Edit Holiday") {
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
              {dialogTitle == "Add Holiday" ? "Add" : "Update"}
            </Button>
          )}
        </div>
      );
    }
  };

  const formSubmit = async () => {
    if (form.symbol.length == 0 || !form.symbol) {
      toast.error("Symbol is required");
    } else if (!form.date) {
      toast.error("Date is required");
    } else if (!form.Start_Time) {
      toast.error("Start Time is required");
    } else if (!form.End_Time) {
      toast.error("Symbol is required");
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
      if (dialogTitle == "Edit Holiday") {
        param.append("action", "edit_script");
        param.append("id", form.id);
      } else {
        param.append("action", "add_script");
      }
      param.append("end_time", form.End_Time);

      param.append("start_time", form.Start_Time);
      param.append("date", form.date);
      var symbolList = "";
      form.symbol?.map((item, index) => {
        if (index == 0) {
          symbolList = item.script_id;
        } else {
          symbolList = symbolList + "," + item.script_id;
        }
      });
      param.append("symbol", symbolList);
      await axios
        .post(`${Url}/ajaxfiles/script_holiday_master.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          form.isLoader = false;
          setForm({ ...form });
          if (res.data.status == "error1") {
            toast.error(res.data.message);
          } else {
            setRefresh(!refresh);
            toast.success(res.data.message);
            setOpen(false);
            setForm({
              date: "",
              status: false,
              holiday_id: "",

              Start_Time: "",
              isLoader: false,
              End_Time: "",
              symbol: [],
            });
          }
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const inputTrue = (event) => {
    var { name, value } = event.target;

    setFormTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
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
                <p className="main-heading">Holidays </p>
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
                    {prop.permission !== 1 ? (
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
                          url={`${Url}/datatable/script_holiday_master_list.php`}
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

export default HolidayList;
