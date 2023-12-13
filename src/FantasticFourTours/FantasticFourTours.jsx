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

const FantasticFourTours = (prop) => {
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
    is_international: "",
    lot_size: "",
    country_name: "",
    time_duration: "",
    is_active: "",
    fantastic_id: "",
    delete_id: [],
    main_image: "",
    main_imageP: "",
    tour_imageP: [],
    tour_image: [],

    image_id: "",
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
      label: "country",
      value: false,
      name: "country_name",
    },
    {
      label: "time duration",
      value: false,
      name: "time_duration",
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
      name: "date",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            {<NewDate newDate={row.added_datetime} />}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "country",
      selector: (row) => {
        return <span title={row.country_name}>{row.country_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Tour Type",
      selector: (row) => {
        return (
          <span
            title={
              row.is_international == 0
                ? "Domestic Tours"
                : "International Tours"
            }
          >
            {row.is_international == 0
              ? "Domestic Tours"
              : "International Tours"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "Lot",
      selector: (row) => {
        return <span title={row.lot_size}>{row.lot_size}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "time duration",
      selector: (row) => {
        return <span title={row.time_duration}>{row.time_duration}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
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
              id={`actionButton_${row.fantastic_id}`}
              aria-controls={
                open ? `basic-menu-${row.fantastic_id}` : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleContextClick(event, row.fantastic_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.fantastic_id}`}
              anchorEl={openTableMenus[row.fantastic_id]}
              open={Boolean(openTableMenus[row.fantastic_id])}
              onClose={(event) => handleContextClose(row.fantastic_id)}
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
                    var image = [];
                    row.tour_image.map((item, index) => {
                      if (index !== 0) {
                        image = [...image, item];
                      }
                    });
                    setviewWithdrawForm({
                      is_international: row.is_international,
                      lot_size: row.lot_size,
                      country_name: row.country_name,
                      time_duration: row.time_duration,
                      is_active: row.is_active,
                      fantastic_id: row.fantastic_id,
                      main_image: "",
                      main_imageP: row.tour_image[0],
                      tour_image: [],
                      delete_id: [],
                      tour_imageP: image,
                      image_id: "",
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
                    setDialogTitle("Edit Fantastic Four Tours");
                    setOpen(true);
                    handleContextClose(row.fantastic_id);
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
                    actionMenuPopup(event, row.fantastic_id, "reject")
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
    param.append("action", "delete_fantastic_four");

    param.append("fantastic_id", id);
    await axios
      .post(`${Url}/ajaxfiles/fantastic_four_manage.php`, param)
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
    if (dialogTitle == "View Fantastic Four Tours") {
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
      dialogTitle == "Edit Fantastic Four Tours" ||
      dialogTitle == "Add Fantastic Four Tours"
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
    if (dialogTitle == "View Fantastic Four Tours") {
      return (
        <div>
          <div className="view-commission-content-section">
            <div className="view-content-element">
              <h6 className="element-title">Country Name</h6>
              <div className=" element-content">
                {viewWithdrawForm.country_name}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Tour Type</h6>
              <div className=" element-content">
                {viewWithdrawForm.is_international == "0"
                  ? "Domestic Tours"
                  : "International Tours"}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title"> Lot Size</h6>
              <div className=" element-content">
                {viewWithdrawForm.lot_size}
              </div>
            </div>
            <div className="view-content-element">
              <h6 className="element-title">Time Duration</h6>
              <div className=" element-content">
                {viewWithdrawForm.time_duration}
              </div>
            </div>
          </div>
          <div className="fftgrid">
            {viewWithdrawForm.tour_image.map((item, index) => {
              return (
                <div className="tredandWinMasterImage">
                  <label>Image</label>
                  <CustomImageModal
                    image={item.tour_image}
                    isIcon={false}
                    className=""
                  />
                  {/* <a href={item.tour_image} target="_blank">
                    <img src={item.tour_image} alt="" />
                  </a> */}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (
      dialogTitle == "Edit Fantastic Four Tours" ||
      dialogTitle == "Add Fantastic Four Tours"
    ) {
      return (
        <>
          <div>
            <div className="update-withdraw-request-section">
              <TextField
                id="standard-basic"
                label="Country Name"
                variant="standard"
                sx={{ width: "100%" }}
                name="country_name"
                value={viewWithdrawForm.country_name}
                onChange={input1}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.country_name == "" &&
                  input1infoTrue.country_name
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.country_name == "" &&
                  input1infoTrue.country_name
                    ? "Country Name is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
              <TextField
                id="standard-basic"
                label="Time Duration"
                variant="standard"
                sx={{ width: "100%" }}
                name="time_duration"
                value={viewWithdrawForm.time_duration}
                onChange={input1}
                onBlur={input1trueFalse}
                error={
                  viewWithdrawForm.time_duration == "" &&
                  input1infoTrue.time_duration
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.time_duration == "" &&
                  input1infoTrue.time_duration
                    ? "Time Duration is required"
                    : ""
                }
                disabled={buttonDis == 1 ? true : false}
              />
            </div>
            <br />
            <div className="update-withdraw-request-section">
              <TextField
                id="standard-basic"
                label="Lot Size"
                variant="standard"
                sx={{ width: "100%" }}
                name="lot_size"
                value={viewWithdrawForm.lot_size}
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
                  viewWithdrawForm.lot_size == "" && input1infoTrue.lot_size
                    ? true
                    : false
                }
                helperText={
                  viewWithdrawForm.lot_size == "" && input1infoTrue.lot_size
                    ? "Lot is required"
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
                  viewWithdrawForm.is_international == "" &&
                  input1infoTrue.is_international
                    ? true
                    : false
                }
              >
                <InputLabel>Tour Type</InputLabel>
                <Select
                  value={viewWithdrawForm.is_international}
                  name="is_international"
                  onChange={input1}
                  onBlur={input1trueFalse}
                  disabled={buttonDis == 1 ? true : false}
                >
                  <MenuItem value="1">International Tours</MenuItem>
                  <MenuItem value="0">Domestic Tours </MenuItem>
                </Select>
                {viewWithdrawForm.is_international == "" &&
                input1infoTrue.is_international ? (
                  <FormHelperText>Tour Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
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
            <div className="view-image-section fftgrid">
              <div className="view-image-section">
                <div className="element">
                  <label className="fw-700" style={{ fontWeight: "700" }}>
                    Main Image :
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
                          var objectUrl1 = {
                            id: 1,
                            tour_image: URL.createObjectURL(e.target.files[0]),
                          };
                          viewWithdrawForm.main_imageP = objectUrl1;
                          viewWithdrawForm.main_image = {
                            id: 0,
                            tour_image: e.target.files[0],
                          };
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
                    {viewWithdrawForm.main_imageP ? (
                      <img
                        src={
                          viewWithdrawForm?.main_imageP
                            ? viewWithdrawForm.main_imageP.tour_image
                            : " "
                        }
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
              {viewWithdrawForm.tour_imageP.map((item, index) => {
                return (
                  <div className="view-image-section" key={index}>
                    <div className="element">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="fw-700" style={{ fontWeight: "700" }}>
                          Child Image :
                        </label>
                        <CloseIcon
                          sx={{ fontSize: "21px" }}
                          onClick={() => {
                            if (item.id !== 0) {
                              viewWithdrawForm.delete_id.push(item.id);
                            }

                            viewWithdrawForm.tour_imageP.splice(index, 1);

                            setviewWithdrawForm({ ...viewWithdrawForm });
                          }}
                        />
                      </div>

                      <label
                        htmlFor={`contained-button-file2${index}`}
                        className="fileuploadButton"
                      >
                        <Input
                          accept="image/*"
                          id={`contained-button-file2${index}`}
                          type="file"
                          onChange={(e) => {
                            if (
                              e.target.files[0].type == "image/png" ||
                              e.target.files[0].type == "image/jpg" ||
                              e.target.files[0].type == "image/jpeg"
                            ) {
                              var objectUrl1 = {
                                id: item.id,
                                tour_image: URL.createObjectURL(
                                  e.target.files[0]
                                ),
                                tour_imageF: e.target.files[0],
                              };

                              viewWithdrawForm.tour_imageP.splice(
                                index,
                                1,
                                objectUrl1
                              );
                              // viewWithdrawForm.item_image = e.target.files[0];
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
                        {item ? (
                          <img
                            src={item ? item.tour_image : ""}
                            className="deposit-upload-image-preview"
                          />
                        ) : (
                          <Button variant="contained" component="span">
                            <i className="material-icons">backup</i>
                            &nbsp;Upload
                          </Button>
                        )}
                      </label>
                    </div>
                  </div>
                );
              })}
              <div className="view-image-section">
                <div className="element">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label className="fw-700" style={{ fontWeight: "700" }}>
                      Add Child Image :
                    </label>
                  </div>

                  <label
                    htmlFor={`contained-button-file5`}
                    className="fileuploadButton"
                  >
                    <Input
                      accept="image/*"
                      id={`contained-button-file5`}
                      type="file"
                      onChange={(e) => {
                        if (
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg" ||
                          e.target.files[0].type == "image/jpeg"
                        ) {
                          var objectUrl1 = {
                            id: 0,
                            tour_image: URL.createObjectURL(e.target.files[0]),
                            tour_imageF: e.target.files[0],
                          };

                          viewWithdrawForm.tour_imageP.push(objectUrl1);
                          // viewWithdrawForm.item_image = e.target.files[0];
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

                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>&nbsp;Upload
                    </Button>
                  </label>
                </div>
              </div>
            </div>
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
    if (viewWithdrawForm.country_name == "") {
      toast.error("Country Name is required");
    } else if (viewWithdrawForm.time_duration == "") {
      toast.error("Time Duration is required");
    } else if (viewWithdrawForm.lot_size == "") {
      toast.error("Lot is required");
    } else if (viewWithdrawForm.is_international == "") {
      toast.error("Tour Type is required");
    } else if (viewWithdrawForm.is_active == "") {
      toast.error("Status is required");
    } else if (
      viewWithdrawForm.main_image == "" &&
      viewWithdrawForm.main_imageP == ""
    ) {
      toast.error("main image is required");
    } else if (
      viewWithdrawForm.tour_imageP == "" ||
      viewWithdrawForm.tour_imageP.length == 0
    ) {
      toast.error("Child image is required");
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
      if (viewWithdrawForm.fantastic_id !== "") {
        param.append("fantastic_id", viewWithdrawForm.fantastic_id);
        param.append("action", "update_fantastic_four");
        if (viewWithdrawForm.main_image.tour_image) {
          param.append(`image_id[${0}]`, viewWithdrawForm.main_image.id);
          param.append(
            `tour_image[${0}]`,
            viewWithdrawForm.main_image.tour_image
          );
        }

        viewWithdrawForm.tour_imageP.map((item, index) => {
          if (item.tour_imageF) {
            param.append(`image_id[${index + 1}]`, item.id);
            param.append(`tour_image[${index + 1}]`, item.tour_imageF);
          }
        });
        viewWithdrawForm.delete_id.map((item, index) => {
          param.append(`delete_id[${index}]`, item);
        });
      } else {
        param.append("action", "add_fantastic_four");
        param.append(
          `tour_image[${0}]`,
          viewWithdrawForm.main_image.tour_image
        );
        viewWithdrawForm.tour_imageP.map((item, index) => {
          param.append(`tour_image[${index + 1}]`, item.tour_imageF);
        });
      }

      param.append("is_international", viewWithdrawForm.is_international);
      param.append("country_name", viewWithdrawForm.country_name);
      if (viewWithdrawForm.item_imageF) {
        param.append("item_image", viewWithdrawForm.item_imageF);
      }
      param.append("lot_size", viewWithdrawForm.lot_size);
      param.append("time_duration", viewWithdrawForm.time_duration);
      param.append("is_active", viewWithdrawForm.is_active);
      await axios
        .post(`${Url}/ajaxfiles/fantastic_four_manage.php`, param)
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
    handleContextClose(id.fantastic_id);
    if (id.status == "1") {
      setButttonDis("1");
    } else {
      setButttonDis("0");
    }
    setviewWithdrawForm(id);
    setDialogTitle("View Fantastic Four Tours");
    setOpen(true);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Fantastic Four Tours</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  date="n0"
                  selectDynamic={{
                    data: { 0: "inactive", 1: "active" },
                    keyName: "status",
                    label: "Status",
                  }}
                  selectDynamic1={{
                    data: { 0: "Domestic Tours", 1: "International Tours" },
                    keyName: "is_international",
                    label: "Tour Type",
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
                          is_international: "",
                          lot_size: "",
                          country_name: "",
                          time_duration: "",
                          is_active: "",
                          fantastic_id: "",
                          main_image: "",
                          main_imageP: "",
                          tour_image: [],
                          tour_imageP: [],
                          delete_id: [],
                          image_id: "",
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
                        setDialogTitle("Add Fantastic Four Tours");
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
                          url={`${Url}/datatable/fantastic_four_list.php`}
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

export default FantasticFourTours;
