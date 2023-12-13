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

const TradeWinMaster = (prop) => {
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
  const [viewWithdrawForm, setviewWithdrawForm] = useState({
    item_brand: "",
    item_full_description: "",
    item_id: "",
    item_image: "",
    item_imageF: "",
    item_lot_size: "",
    item_name: "",
    item_short_description: "",
    is_active: "",
    isLoader: false,
  });
  const [input1infoTrue, setinput1infoTrue] = useState({
    item_brand: false,
    item_full_description: false,
    item_id: false,
    item_image: false,
    item_lot_size: false,
    item_name: false,
    item_short_description: false,
    is_active: false,
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "brand Name",
      value: false,
      name: "item_brand",
    },
    {
      label: "item name",
      value: false,
      name: "item_name",
    },
    {
      label: "lot",
      value: false,
      name: "item_lot_slot",
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
      name: "brand Name",
      selector: (row) => {
        return <span title={row.item_brand}>{row.item_brand}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "item name",
      selector: (row) => {
        return <span title={row.item_name}>{row.item_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Lot",
      selector: (row) => {
        return <span title={row.item_lot_size}>{row.item_lot_size}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "short description",
      selector: (row) => {
        return (
          <span title={row.item_short_description}>
            {row.item_short_description}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },

    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.is_active == "1"
                ? "status-text-approved"
                : row.is_active == "0"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.is_active == "1"
                ? "Active"
                : row.is_active == "0"
                ? "inactive"
                : ""
            }
          >
            {row.is_active == "1"
              ? "Active"
              : row.is_active == "0"
              ? "inactive"
              : ""}
          </span>
        );
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
              id={`actionButton_${row.item_id}`}
              aria-controls={open ? `basic-menu-${row.item_id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleContextClick(event, row.item_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.item_id}`}
              anchorEl={openTableMenus[row.item_id]}
              open={Boolean(openTableMenus[row.item_id])}
              onClose={(event) => handleContextClose(row.item_id)}
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
                    handleContextClose(row.item_id);

                    setviewWithdrawForm({
                      item_brand: row.item_brand,
                      item_full_description: row.item_full_description,
                      item_id: row.item_id,
                      item_imageF: "",
                      item_image: row.item_image,
                      item_lot_size: row.item_lot_size,
                      item_name: row.item_name,
                      item_short_description: row.item_short_description,
                      is_active: row.is_active,
                      isLoader: false,
                    });
                    setinput1infoTrue({
                      item_brand: false,
                      item_full_description: false,
                      item_id: false,
                      item_imageF: "",
                      item_image: false,
                      item_lot_size: false,
                      item_name: false,
                      item_short_description: false,
                      is_active: false,
                    });
                    setDialogTitle("Edit Trade & Win Products");
                    setOpen(true);
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
                    actionMenuPopup(event, row.item_id, "reject")
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
    param.append("action", "delete_trade_and_win");

    param.append("trade_win_id", id);
    await axios
      .post(`${Url}/ajaxfiles/trade_and_win_manage.php`, param)
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
    if (dialogTitle == "View Trade & Win Products") {
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
      dialogTitle == "Edit Trade & Win Products" ||
      dialogTitle == "Add Trade & Win Products"
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
                {viewWithdrawForm.item_id == "" ? "Add" : "Update"}
              </Button>
            )}
          </div>
        </>
      );
    }
  };

  const manageContent = () => {
    if (dialogTitle == "View Trade & Win Products") {
      return (
        <div>
          <div className="view-commission-content-section">
            <div className="view-content-element">
              <h6 className="element-title">Brand Name</h6>
              <div className=" element-content">
                {viewWithdrawForm.item_brand}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Item Name</h6>
              <div className=" element-content">
                {viewWithdrawForm.item_name}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Item Lot Size</h6>
              <div className=" element-content">
                {viewWithdrawForm.item_lot_size}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Short Description</h6>
              <div className=" element-content">
                {viewWithdrawForm.item_short_description}
              </div>
            </div>
            <div className="view-content-element w-100">
              <h6 className="element-title">Full Description</h6>
              <div className=" element-content">
                {viewWithdrawForm.item_full_description}
              </div>
            </div>
          </div>
          <div className="tredandWinMasterImage">
            <label>Item Image</label>

            {/* <a href={viewWithdrawForm.item_image} target="_blank"> */}
            {/* <img src={viewWithdrawForm.item_image} alt="" /> */}
            <CustomImageModal
              image={viewWithdrawForm.item_image}
              isIcon={false}
              className=""
            />
            {/* </a> */}
          </div>
        </div>
      );
    } else if (
      dialogTitle == "Edit Trade & Win Products" ||
      dialogTitle == "Add Trade & Win Products"
    ) {
      return (
        <>
          <div>
            <div className="update-withdraw-request-section">
              <TextField
                id="standard-basic"
                label="Brand Name"
                variant="standard"
                sx={{ width: "100%" }}
                name="item_brand"
                value={viewWithdrawForm.item_brand}
                onChange={input1}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.item_brand == "" && input1infoTrue.item_brand
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.item_brand == "" && input1infoTrue.item_brand
                    ? "Brand Name is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
              <TextField
                id="standard-basic"
                label="Item Name"
                variant="standard"
                sx={{ width: "100%" }}
                name="item_name"
                value={viewWithdrawForm.item_name}
                onChange={input1}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.item_name == "" && input1infoTrue.item_name
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.item_name == "" && input1infoTrue.item_name
                    ? "Item Name is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
            </div>
            <br />
            <div className="update-withdraw-request-section">
              <TextField
                id="standard-basic"
                label="Lot"
                variant="standard"
                sx={{ width: "100%" }}
                name="item_lot_size"
                value={viewWithdrawForm.item_lot_size}
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
                  viewWithdrawForm.item_lot_size == "" &&
                  input1infoTrue.item_lot_size
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.item_lot_size == "" &&
                  input1infoTrue.item_lot_size
                    ? "Lot is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
              <TextField
                id="standard-basic"
                label="Short Description"
                variant="standard"
                sx={{ width: "100%" }}
                name="item_short_description"
                value={viewWithdrawForm.item_short_description}
                onChange={input1}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.item_short_description == "" &&
                  input1infoTrue.item_short_description
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.item_short_description == "" &&
                  input1infoTrue.item_short_description
                    ? "Short Description is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
            </div>
            <br />

            <div className="update-withdraw-request-section">
              <TextField
                id="standard-basic"
                label="Full Description"
                variant="standard"
                sx={{ width: "100%" }}
                name="item_full_description"
                value={viewWithdrawForm.item_full_description}
                onChange={input1}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.item_full_description == "" &&
                  input1infoTrue.item_full_description
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.item_full_description == "" &&
                  input1infoTrue.item_full_description
                    ? "Full Description is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
            </div>
            <br />
            <div className="update-withdraw-request-section">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  viewWithdrawForm.is_active == "" && input1infoTrue.is_active
                    ? true
                    : false
                }
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={viewWithdrawForm.is_active}
                  name="is_active"
                  onChange={input1}
                  onBlur={input1trueFalse}
                  disabled={buttonDis == 1 ? true : false}
                >
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="0">Inactive </MenuItem>
                </Select>
                {viewWithdrawForm.is_active == "" &&
                input1infoTrue.is_active ? (
                  <FormHelperText>Status is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
            <br />
            <div className="view-image-section">
              <div className="view-image-section">
                <div className="element">
                  <label className="fw-700" style={{ fontWeight: "700" }}>
                    Item Image :
                  </label>
                  <label
                    htmlFor="contained-button-file1"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="image/*"
                      id="contained-button-file1"
                      type="file"
                      onChange={(e) => {
                        if (
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg" ||
                          e.target.files[0].type == "image/jpeg"
                        ) {
                          var objectUrl1 = URL.createObjectURL(
                            e.target.files[0]
                          );
                          viewWithdrawForm.item_image = objectUrl1;
                          viewWithdrawForm.item_imageF = e.target.files[0];
                          setviewWithdrawForm({ ...viewWithdrawForm });
                        } else {
                          toast.error(
                            "Only JPG, JPEG and PNG types are accepted."
                          );
                        }

                        //   type.passport_front_image = e.target.files[0].type;
                        //   type.passport_front_imageP = objectUrl1;
                        //   setType({ ...type });
                      }}
                    />
                    {viewWithdrawForm.item_image ? (
                      <img
                        src={viewWithdrawForm.item_image}
                        className="deposit-upload-image-preview"
                      />
                    ) : (
                      <Button variant="contained" component="span">
                        <i className="material-icons">backup</i>&nbsp;Upload
                      </Button>
                    )}
                  </label>
                </div>
              </div>
            </div>
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
    if (viewWithdrawForm.item_brand == "") {
      toast.error("Brand Name is required");
    } else if (viewWithdrawForm.item_name == "") {
      toast.error("Item Name is required");
    } else if (viewWithdrawForm.item_lot_size == "") {
      toast.error("Lot is required");
    } else if (viewWithdrawForm.item_short_description == "") {
      toast.error("Short Description is required");
    } else if (viewWithdrawForm.item_full_description == "") {
      toast.error("Full Description is required");
    } else if (viewWithdrawForm.is_active == "") {
      toast.error("Status is required");
    } else if (
      viewWithdrawForm.item_image == "" &&
      viewWithdrawForm.item_imageF == ""
    ) {
      toast.error("Item image is required");
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
      if (viewWithdrawForm.item_id !== "") {
        param.append("trade_win_id", viewWithdrawForm.item_id);
        param.append("action", "edit_trade_and_win");
      } else {
        param.append("action", "add_trade_and_win");
      }

      param.append("item_name", viewWithdrawForm.item_name);
      param.append("item_brand", viewWithdrawForm.item_brand);
      if (viewWithdrawForm.item_imageF) {
        param.append("item_image", viewWithdrawForm.item_imageF);
      }
      param.append("item_lot_size", viewWithdrawForm.item_lot_size);
      param.append(
        "item_short_description",
        viewWithdrawForm.item_short_description
      );
      param.append("status", viewWithdrawForm.is_active);
      param.append(
        "item_full_description",
        viewWithdrawForm.item_full_description
      );

      await axios
        .post(`${Url}/ajaxfiles/trade_and_win_manage.php`, param)
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
    handleContextClose(id.item_id);
    if (id.status == "1") {
      setButttonDis("1");
    } else {
      setButttonDis("0");
    }
    setviewWithdrawForm(id);
    setDialogTitle("View Trade & Win Products");
    setOpen(true);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Trade & Win Products</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  date="n0"
                  selectDynamic={{
                    data: { 0: "Inactive", 1: "Active" },
                    keyName: "status",
                    label: "Status",
                  }}
                  //   setcheckStatus={setcheckStatus}
                  lastUpdatedBy={resData.modified_by_users}
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
                          item_brand: "",
                          item_full_description: "",
                          item_id: "",
                          item_image: "",
                          item_lot_size: "",
                          item_imageF: "",

                          item_name: "",
                          item_short_description: "",
                          is_active: "",
                          isLoader: false,
                        });
                        setinput1infoTrue({
                          item_brand: false,
                          item_full_description: false,
                          item_id: false,
                          item_imageF: "",
                          item_image: false,
                          item_lot_size: false,
                          item_name: false,
                          item_short_description: false,
                          is_active: false,
                        });
                        setDialogTitle("Add Trade & Win Products");
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
                          url={`${Url}/datatable/fetch_trade_and_win_list.php`}
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

export default TradeWinMaster;
