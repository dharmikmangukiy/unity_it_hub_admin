import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import CustomImageModal from "../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
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

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    // borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 8px 10px",
    // transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      // borderRadius: 9,
      borderColor: "#80bdff",
    },
  },
}));

const GroupSpread = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({});
  const [checkStatus, setcheckStatus] = useState("");
  const [buttonDis, setButttonDis] = useState();
  const [resData, setResData] = useState({});

  var [viewWithdrawForm, setviewWithdrawForm] = useState({
    ib_group_name: "",
    ib_group_spread_id: "",
    market_type_name: "",
    script_name: "",
    spread_value: "",
    spread_value_2: "",

    isLoader: false,
  });
  const [input1infoTrue, setinput1infoTrue] = useState({
    ib_group_name: "",
    ib_group_spread_id: "",
    market_type_name: "",
    script_name: "",
    spread_value: "",
    spread_value_2: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "group name",
      value: false,
      name: "ib_group_name",
    },
    {
      label: "market type name",
      value: false,
      name: "market_type_name",
    },
    {
      label: "script name",
      value: false,
      name: "script_name",
    },
    {
      label: "spread value",
      value: false,
      name: "spread_value",
    },
    {
      label: "spread value 2",
      value: false,
      name: "spread_value_2",
    },
  ]);
  toast.configure();

  const columns = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },

    {
      name: "group name",
      selector: (row) => {
        return <span title={row.ib_group_name}>{row.ib_group_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },

    {
      name: "market type name",
      selector: (row) => {
        return <span title={row.market_type_name}>{row.market_type_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "script name",
      selector: (row) => {
        return <span title={row.script_name}>{row.script_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "spread value",
      selector: (row) => {
        return <span title={row.spread_value}>{row.spread_value}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "spreadvalue 2",
      selector: (row) => {
        return <span title={row.spread_value_2}>{row.spread_value_2}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            {" "}
            <Button
              id={`actionButton_${row.ib_group_spread_id}`}
              aria-controls={
                open ? `basic-menu-${row.ib_group_spread_id}` : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) =>
                handleContextClick(event, row.ib_group_spread_id)
              }
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.ib_group_spread_id}`}
              anchorEl={openTableMenus[row.ib_group_spread_id]}
              open={Boolean(openTableMenus[row.ib_group_spread_id])}
              onClose={(event) => handleContextClose(row.ib_group_spread_id)}
            >
              <div>
                <MenuItem
                  className="view"
                  {...row}
                  onClick={(event) => viewWithdrawl(row)}
                >
                  <i className="material-icons">receipt</i>
                  &nbsp;&nbsp;View
                </MenuItem>
                <MenuItem
                  className="edit"
                  {...row}
                  onClick={() => {
                    setviewWithdrawForm({
                      ib_group_name: {
                        ib_group_level_id: row.group_id,
                        ib_group_name: row.ib_group_name,
                      },
                      ib_group_spread_id: row.ib_group_spread_id,
                      market_type_name: {
                        market_type_id: row.market_type_id,
                        market_type_name: row.market_type_name,
                      },
                      script_name: {
                        script_id: row.script_id,
                        script_name: row.script_name,
                      },
                      spread_value: row.spread_value,
                      spread_value_2: row.spread_value_2,
                      isLoader: false,
                    });
                    setinput1infoTrue({
                      ib_group_name: "",
                      ib_group_spread_id: "",
                      market_type_name: "",
                      script_name: "",
                      spread_value: "",
                      spread_value_2: "",
                    });
                    setDialogTitle("Edit Group Spread");
                    setOpen(true);
                    handleContextClose(row.ib_group_spread_id);
                  }}
                >
                  <i
                    className="material-icons edit"
                    // onClick={(event) => actionMenuPopup(event, row)}
                  >
                    visibility
                  </i>
                  &nbsp;&nbsp;Edit
                </MenuItem>
                <MenuItem
                  className="reject"
                  {...row}
                  onClick={(event) =>
                    actionMenuPopup(event, row.ib_group_spread_id, "reject")
                  }
                >
                  <i className="material-icons font-color-rejected">delete</i>
                  &nbsp;&nbsp;Delete
                </MenuItem>
              </div>
            </Menu>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  const actionMenuPopup = (e, index, flagALL) => {
    handleContextClose(index);
    if (flagALL == "reject") {
      setDialogTitle("Reject");
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
                    handleAction(index, "reject", onClose);
                  }}
                >
                  Yes, Delete it!
                </Button>
              </div>
            </div>
          );
        },
      });
    }
  };
  const handleAction = async (id, flag, onClose) => {
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
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "delete_group_spread");

    param.append("ib_group_spread_id", id);
    await axios
      .post(`${Url}/ajaxfiles/ib_group_spread_master_manage.php`, param)
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
  const handleContextClick = (event, index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = event.currentTarget;
    setOpenTableMenus(tableMenus);
  };

  const handleContextClose = (index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = null;
    setOpenTableMenus(tableMenus);
  };
  const manageDialogActionButton = () => {
    if (dialogTitle == "View Group Spread") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      );
    } else if (
      dialogTitle == "Edit Group Spread" ||
      dialogTitle == "Add Group Spread"
    ) {
      return (
        <>
          <div className="dialogMultipleActionButton">
            <Button
              variant="contained"
              className="cancelButton"
              onClick={handleClose}
            >
              Cancel
            </Button>
            {viewWithdrawForm.isLoader == true ? (
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
                onClick={submitUpdate}
              >
                {dialogTitle == "Add Group Spread" ? "Add" : "Update"}
              </Button>
            )}
          </div>
        </>
      );
    }
  };

  const manageContent = () => {
    if (dialogTitle == "View Group Spread") {
      return (
        <div>
          <div className="view-commission-content-section">
            <div className="view-content-element">
              <h6 className="element-title">Group Name</h6>
              <div className=" element-content">
                {viewWithdrawForm.ib_group_name}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Market Type Name</h6>
              <div className=" element-content">
                {viewWithdrawForm.market_type_name}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Script Name</h6>
              <div className=" element-content">
                {viewWithdrawForm.script_name}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Spread Value</h6>
              <div className=" element-content">
                {viewWithdrawForm.spread_value}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Spread Value 2</h6>
              <div className=" element-content">
                {viewWithdrawForm.spread_value_2}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      dialogTitle == "Edit Group Spread" ||
      dialogTitle == "Add Group Spread"
    ) {
      return (
        <>
          <div>
            <div className="update-withdraw-request-section">
              <Autocomplete
                options={resData.group_level_master_data}
                value={viewWithdrawForm.ib_group_name}
                getOptionLabel={(option) =>
                  option ? option.ib_group_name : ""
                }
                onChange={(event, newValue) => {
                  viewWithdrawForm.ib_group_name = newValue;
                  setviewWithdrawForm({ ...viewWithdrawForm });
                }}
                className="w-100"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Group Name"
                    name="ib_group_name"
                    onBlur={input1trueFalse}
                    error={
                      !viewWithdrawForm.ib_group_name &&
                      input1infoTrue.ib_group_name
                        ? true
                        : false
                    }
                    helperText={
                      !viewWithdrawForm.ib_group_name &&
                      input1infoTrue.ib_group_name
                        ? "Group Name is required"
                        : ""
                    }
                    variant="standard"
                  />
                )}
              />
              <Autocomplete
                options={resData.market_data}
                value={viewWithdrawForm.market_type_name}
                getOptionLabel={(option) =>
                  option ? option.market_type_name : ""
                }
                onChange={(event, newValue) => {
                  viewWithdrawForm.market_type_name = newValue;
                  setviewWithdrawForm({ ...viewWithdrawForm });
                }}
                className="w-100"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Market Type Name"
                    name="market_type_name"
                    onBlur={input1trueFalse}
                    error={
                      !viewWithdrawForm.market_type_name &&
                      input1infoTrue.market_type_name
                        ? true
                        : false
                    }
                    helperText={
                      !viewWithdrawForm.market_type_name &&
                      input1infoTrue.market_type_name
                        ? "Market Type Name is required"
                        : ""
                    }
                    variant="standard"
                  />
                )}
              />
            </div>
            <br />

            <div className="update-withdraw-request-section">
              <Autocomplete
                options={resData.script_data}
                value={viewWithdrawForm.script_name}
                getOptionLabel={(option) => (option ? option.script_name : "")}
                onChange={(event, newValue) => {
                  viewWithdrawForm.script_name = newValue;
                  setviewWithdrawForm({ ...viewWithdrawForm });
                }}
                className="w-100"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Script Name"
                    name="script_name"
                    onBlur={input1trueFalse}
                    error={
                      !viewWithdrawForm.script_name &&
                      input1infoTrue.script_name
                        ? true
                        : false
                    }
                    helperText={
                      !viewWithdrawForm.script_name &&
                      input1infoTrue.script_name
                        ? "Script Name is required"
                        : ""
                    }
                    variant="standard"
                  />
                )}
              />
            </div>
            <br />
            <div className="update-withdraw-request-section">
              <TextField
                id="standard-basic"
                label="Spread Value"
                variant="standard"
                sx={{ width: "100%" }}
                name="spread_value"
                value={viewWithdrawForm.spread_value}
                // onChange={input1}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    input1(e);
                  } else if (e.target.value == "" || e.target.value == 0) {
                    input1(e);
                  }
                }}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.spread_value == "" &&
                  input1infoTrue.spread_value
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.spread_value == "" &&
                  input1infoTrue.spread_value
                    ? "Spread Value is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
              <TextField
                id="standard-basic"
                label="Spread Value 2"
                variant="standard"
                sx={{ width: "100%" }}
                name="spread_value_2"
                value={viewWithdrawForm.spread_value_2}
                // onChange={input1}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    input1(e);
                  } else if (e.target.value == "" || e.target.value == 0) {
                    input1(e);
                  }
                }}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.spread_value_2 == "" &&
                  input1infoTrue.spread_value_2
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.spread_value_2 == "" &&
                  input1infoTrue.spread_value_2
                    ? "Spread Value 2 is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
            </div>

            <br />

            {/* <div className="view-image-section">
             
            </div> */}
          </div>
        </>
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const input1 = (event) => {
    const { name, value } = event.target;
    setviewWithdrawForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const input1trueFalse = (event) => {
    var { name, value } = event.target;
    setinput1infoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const submitUpdate = async () => {
    if (!viewWithdrawForm.ib_group_name) {
      toast.error("Group Name is required");
    } else if (!viewWithdrawForm.market_type_name) {
      toast.error("Market Type Name is required");
    } else if (!viewWithdrawForm.script_name) {
      toast.error("Script Name is required");
    } else if (viewWithdrawForm.spread_value == "") {
      toast.error("Spread Value is required");
    } else if (viewWithdrawForm.spread_value_2 == "") {
      toast.error("Spread Value 2 is required");
    } else {
      viewWithdrawForm.isLoader = true;
      setviewWithdrawForm({ ...viewWithdrawForm });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (viewWithdrawForm.ib_group_spread_id !== "") {
        param.append("ib_group_spread_id", viewWithdrawForm.ib_group_spread_id);
        param.append("action", "edit_group_spread");
      } else {
        param.append("action", "add_group_spread");
      }

      param.append(
        "market_type_id",
        viewWithdrawForm.market_type_name.market_type_id
      );
      param.append("script_id", viewWithdrawForm.script_name.script_id);

      param.append(
        "group_id",
        viewWithdrawForm.ib_group_name.ib_group_level_id
      );
      param.append("spread_value", viewWithdrawForm.spread_value);
      param.append("spread_value_2", viewWithdrawForm.spread_value_2);
      await axios
        .post(`${Url}/ajaxfiles/ib_group_spread_master_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          viewWithdrawForm.isLoader = false;
          setviewWithdrawForm({ ...viewWithdrawForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setRefresh(!refresh);
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };
  const viewWithdrawl = async (id) => {
    handleContextClose(id.ib_group_spread_id);
    if (id.status == "1") {
      setButttonDis("1");
    } else {
      setButttonDis("0");
    }
    setviewWithdrawForm(id);
    setDialogTitle("View Group Spread");
    setOpen(true);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Group Spread</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  date="n0"
                  autoCompleteArray={[
                    {
                      options: resData.script_data,
                      label: "Script Name",
                      keyName: "script_id",
                      serchlabel: "script_name",
                    },
                    {
                      options: resData.market_data,
                      label: "Market Type Name",
                      keyName: "market_type_id",
                      serchlabel: "market_type_name",
                    },
                    {
                      options: resData.group_level_master_data,
                      label: "Group Name",
                      keyName: "ib_group_level_id",
                      serchlabel: "ib_group_name",
                    },
                  ]}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <div className="actionGroupButton">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setviewWithdrawForm({
                          ib_group_name: "",
                          ib_group_spread_id: "",
                          market_type_name: "",
                          script_name: "",
                          spread_value: "",
                          spread_value_2: "",
                          isLoader: false,
                        });
                        setinput1infoTrue({
                          ib_group_name: "",
                          ib_group_spread_id: "",
                          market_type_name: "",
                          script_name: "",
                          spread_value: "",
                          spread_value_2: "",
                        });
                        setDialogTitle("Add Group Spread");
                        setOpen(true);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <br />
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/ib_group_spread_master_list.php`}
                          column={columns}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          checkStatus={checkStatus}
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

export default GroupSpread;
