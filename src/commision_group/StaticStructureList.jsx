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
import CloseIcon from "@mui/icons-material/Close";

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

const StaticStructureList = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [resData, setResData] = useState({});
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [list, setList] = useState([]);
  const [option, setOption] = useState([]);

  const [form, setForm] = useState({
    ib_name: "",
    structure_name: "",
    structure_id: "",
    ib_group_name: "",
    ib_group_level_id: "",
    user_id: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "User id",
      value: false,
      name: "user_id",
    },
    {
      label: "Structure Name",
      value: false,
      name: "structure_name",
    },
    {
      label: "IB Group Name",
      value: false,
      name: "ib_group_name",
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
      name: "name",
      selector: (row) => {
        return <span title={row.user_name}>{row.user_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "group name",
      selector: (row) => {
        return <span title={row.ib_group_name}>{row.ib_group_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "structure name",
      selector: (row) => {
        return <span title={row.structure_name}>{row.structure_name}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
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
                className="text-danger"
                onClick={(event) => actionMenuPopup(row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
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

  const addInputField = () => {
    form.pair_data.push({
      structure_name: "",
      ib_group_name: "",
    });
    setForm({ ...form });
  };
  const removeInputFields = (index) => {
    const updatedPairData = [...form.pair_data];
    form.pair_data.splice(index, 1);
    setForm({ ...form });
  };

  const editGroup = (data) => {
    setForm((prevForm) => ({
      ...prevForm,
      ib_name1: { ib_name: data.user_name },
      structure_name1: { structure_name: data.structure_name },
      ib_group_name1: { ib_group_name: data.ib_group_name },
      structure_id: data.structure_id,
      ib_group_level_id: data.ib_group_level_id,
      user_id: data.user_id,
    }));
    setDialogTitle("Edit Static Structure");
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
    param.append("action", "delete_assigned_structure");
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("master_id", data.master_id);

    await axios
      .post(`${Url}/ajaxfiles/user_static_structure_manage.php`, param)
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

  const actionMenuPopup = (data, index) => {
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
                  deleteGroup(data, onClose);
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
    form.ib_name = "";
    form.structure_name1 = "";
    form.ib_group_name1 = "";

    setDialogTitle("Add Static Structure");
    setOpen(true);
  };
  const manageContent = () => {
    if (dialogTitle == "Add Static Structure") {
      return (
        <div>
          <div className="margeField">
            <Autocomplete
              options={resData.ib_users_list}
              getOptionLabel={(option) => (option ? option.ib_name : "")}
              onChange={(event, newValue) => {
                form.ib_name = newValue.ib_name;
                form.ib_name1 = newValue;
                form.ib_user_id = newValue.ib_user_id;
                setForm({ ...form });

                const param = new FormData();
                if (IsApprove !== "") {
                  param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
                  param.append("is_app", IsApprove.is_app);
                  param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
                  param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
                }
                param.append("action", "get_ib_unassinged_groups");
                param.append("ib_user_id", form.ib_user_id);
                axios
                  .post(
                    `${Url}/ajaxfiles/user_static_structure_manage.php`,
                    param
                  )
                  .then((res) => {
                    setOption(res.data.data);
                    if (res.data.message == "Session has been expired") {
                      toast.error(res.data.message);
                      localStorage.setItem("login", true);
                      navigate("/");
                      return;
                    }
                  });
              }}
              sx={{ width: "100%" }}
              style={{ minWidth: "150px" }}
              renderInput={(params) => (
                <TextField {...params} label="Select IB Name" variant="standard" />
              )}
            />
          </div>
          <br />
          {/* {form.pair_data?.map((item, index) => {
            return ( */}
          <div className="margeField">
            <Autocomplete
              disabled={form.ib_name == ""}
              options={option}
              getOptionLabel={(option) => (option ? option.ib_group_name : "")}
              onChange={(event, newValue) => {
                // const selectedScriptId = newValue.ib_group_level_id
                //   ? newValue.ib_group_level_id
                //   : "";
                form.ib_group_level_id = newValue.ib_group_level_id;
                form.ib_group_name = newValue.ib_group_name;
                form.ib_group_name1 = newValue;

                setForm({ ...form });
                // setOption((prevOptions) =>
                //   prevOptions.filter(
                //     (opt) => opt.ib_group_level_id !== selectedScriptId
                //   )
                // );
              }}
              value={form?.ib_group_name1 ? form?.ib_group_name1 : ""}
              sx={{ width: "100%" }}
              style={{ minWidth: "150px" }}
              renderInput={(params) => (
                <TextField {...params} label="Select IB Group" variant="standard" />
              )}
            />

            <Autocomplete
              disabled={form.ib_name == ""}
              options={resData.fixed_structures_list}
              getOptionLabel={(option) => (option ? option.structure_name : "")}
              onChange={(event, newValue) => {
                // const selectedScriptId = newValue.ib_group_level_id
                //   ? newValue.ib_group_level_id
                //   : "";
                form.structure_id = newValue.structure_id;
                form.structure_name = newValue.structure_name;
                form.structure_name1 = newValue;

                setForm({ ...form });
                // setOption((prevOptions) =>
                //   prevOptions.filter(
                //     (opt) => opt.ib_group_level_id !== selectedScriptId
                //   )
                // );
              }}
              value={form?.structure_name1 ? form?.structure_name1 : ""}
              sx={{ width: "100%" }}
              style={{ minWidth: "150px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select IB Structures"
                  variant="standard"
                />
              )}
            />
            {/* <div style={{ display: "flex", alignItems: "end" }}>
                  {form.pair_data.length !== 1 ? (
                    <CloseIcon onClick={() => removeInputFields(index)} />
                  ) : (
                    ""
                  )}
                </div> */}
          </div>
          {/* );
          })} */}
          {/* <div style={{ textAlign: "end", marginTop: "10px" }}>
            <Button
              disabled={form.ib_name == ""}
              variant="contained"
              onClick={addInputField}
            >
              + Add More
            </Button>
          </div> */}
        </div>
      );
    } else if (dialogTitle == "Edit Static Structure") {
      return (
        <div>
          <div className="margeField">
            <Autocomplete
              options={resData.ib_users_list}
              getOptionLabel={(option) => (option ? option.ib_name : "")}
              onChange={(event, newValue) => {
                form.user_id = newValue.ib_user_id;
                form.ib_name = newValue.ib_name;
                form.ib_name1 = newValue;
                setForm({ ...form });
              }}
              value={form.ib_name1}
              sx={{ width: "100%" }}
              style={{ minWidth: "150px" }}
              renderInput={(params) => (
                <TextField {...params} label="Select IB Name" variant="standard" />
              )}
            />
          </div>
          <br />
          {/* {form.pair_data?.map((item, index) => {
            return ( */}
          <div className="margeField">
            <Autocomplete
              disabled
              options={resData.ib_default_group_list}
              getOptionLabel={(option) => (option ? option.ib_group_name : "")}
              onChange={(event, newValue) => {
                form.ib_group_level_id = newValue.ib_group_level_id;
                form.ib_group_name = newValue.ib_group_name;
                form.ib_group_name1 = newValue;

                setForm({ ...form });
              }}
              value={form?.ib_group_name1 ? form?.ib_group_name1 : ""}
              sx={{ width: "100%" }}
              style={{ minWidth: "150px" }}
              renderInput={(params) => (
                <TextField {...params} label="Select IB Group " variant="standard" />
              )}
            />

            <Autocomplete
              options={resData.fixed_structures_list}
              getOptionLabel={(option) => (option ? option.structure_name : "")}
              onChange={(event, newValue) => {
                form.structure_id = newValue.structure_id;
                form.structure_name = newValue.structure_name;
                form.structure_name1 = newValue;

                setForm({ ...form });
              }}
              value={form?.structure_name1 ? form?.structure_name1 : ""}
              sx={{ width: "100%" }}
              style={{ minWidth: "150px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select IB Structures "
                  variant="standard"
                />
              )}
            />
            {/* <div style={{ display: "flex", alignItems: "end" }}>
                  {form.pair_data.length !== 1 ? (
                    <CloseIcon onClick={() => removeInputFields(index)} />
                  ) : (
                    ""
                  )}
                </div> */}
          </div>
          {/* );
          })} */}
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (
      dialogTitle == "Add Static Structure" ||
      dialogTitle == "Edit Static Structure"
    ) {
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
              {dialogTitle == "Add Static Structure" ? "Add" : "Update"}
            </Button>
          )}
        </div>
      );
    }
  };
  const formSubmit = async () => {
    if (form.ib_name == "") {
      toast.error("Please Select IB Name");
    } else if (form.ib_group_name1 == "") {
      toast.error("Please Select IB Group");
    } else if (form.structure_name1 == "") {
      toast.error("Please Select IB Structure");
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
      if (dialogTitle == "Edit Static Structure") {
        param.append("action", "update_ib_structure");
        param.append("user_id", form.user_id);
        param.append("ib_group_level_id", form.ib_group_level_id);
        param.append("structure_id", form.structure_id);
      } else {
        param.append("action", "add_new_structure");
        param.append("user_id", form.ib_user_id);
        param.append("ib_group_level_id", form.ib_group_level_id);
        param.append("structure_id", form.structure_id);
      }
      await axios
        .post(`${Url}/ajaxfiles/user_static_structure_manage.php`, param)
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
            form.ib_name = "";
            form.structure_name1 = "";
            form.ib_group_name1 = "";
          }
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">User Static Structure List </p>
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
                          url={`${Url}/datatable/user_static_structure_list.php`}
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

export default StaticStructureList;
