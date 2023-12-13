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
import DataTable from "react-data-table-component";
import axios from "axios";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import CustomImageModal from "../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
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

const Mt5BonusOffer = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [checkStatus, setcheckStatus] = useState(true);
  const [resData, setResData] = useState({});
  const [previewBonusOfferImage, setPreviewBonusOfferImage] = useState();
  const [selectedBonusOfferImage, setSelectedBonusOfferImage] = useState();
  const [popisLoader, setPopisLoader] = useState(false);
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
    bonus_offer_status: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "Title",
      value: false,
      name: "bonus_title",
    },
    {
      label: "bonus percentage",
      value: false,
      name: "bonus_percentage",
    },
  ]);
  const onSelectFile = (e, flag) => {
    if (flag == "bonus_offer_image") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewBonusOfferImage(undefined);
        return;
      }

      setSelectedBonusOfferImage(e.target.files[0]);
    }
  };
  useEffect(() => {
    if (!selectedBonusOfferImage) {
      setPreviewBonusOfferImage(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedBonusOfferImage);
    setPreviewBonusOfferImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedBonusOfferImage]);

  const [edit, setEdit] = useState({
    id: "",
    bonus_title: "",
    bonus_percentage: "",
    start_date: "",
    end_date: "",
    status: "",
    bonus_offer_image: "",
    isLoader: false,
  });
  const [mainImage, setMainImage] = useState("");
  const [inputinfoTrue, setinputinfoTrue] = useState({
    bonus_title: false,
    bonus_percentage: false,
    start_date: false,
    end_date: false,
    status: false,
  });
  toast.configure();
  const input = (event) => {
    const { name, value } = event.target;
    setEdit((prevalue) => {
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
      name: "Title",
      selector: (row) => {
        return <span title={row.bonus_title}>{row.bonus_title}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Start Date",
      selector: (row) => {
        return (
          <span title={row.start_date}>
            <NewDate newDate={row.start_date} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },

    {
      name: "end date",
      selector: (row) => {
        return (
          <span title={row.end_date}>
            <NewDate newDate={row.end_date} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "date",
      selector: (row) => {
        return (
          <span title={row.date}>
            <NewDate newDate={row.date} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "bonus percentage",
      selector: (row) => {
        return (
          <span title={row.bonus_percentage}>{row.bonus_percentage}%</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.6,
      // wrap: true,
    },

    {
      name: "offer image",
      selector: (row) => {
        return row.proof != "" ? (
          <CustomImageModal
            image={row.bonus_offer_image}
            isIcon={true}
            className="tableImg"
          />
        ) : (
          ""
        );
      },
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "remarks",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.bonus_offer_status == "1"
                ? "status-text-approved"
                : row.bonus_offer_status == "0"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.bonus_offer_status == "1"
                ? "Enable"
                : row.bonus_offer_status == "0"
                ? "Disable"
                : "Pending"
            }
          >
            {row.bonus_offer_status == "1"
              ? "Enable"
              : row.bonus_offer_status == "0"
              ? "Disable"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex">
            {prop.permission.update_mt5_bonus_offer == 1 ? (
              <Button
                type="submit"
                className="cursor-pointer mx-3 p-0 p-md-2 rounded-circle text-muted"
                onClick={() => updateoffer(row)}
              >
                <CreateIcon sx={{ color: "#3D9730" }} />
              </Button>
            ) : (
              ""
            )}

            {prop.permission.delete_mt5_bonus_offer == 1 ? (
              <Button
                className="cursor-pointer p-0 p-md-2 rounded-circle text-muted"
                onClick={() => {
                  actionMenuPopup("reject", row.id);
                }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
      reorder: true,
      // wrap: true,
      grow: 1,
    },
  ];
  const footer = {
    amount: "das",
  };
  const onAdd = () => {
    setEdit({
      id: "",
      bonus_title: "",
      bonus_percentage: "",
      start_date: "",
      end_date: "",
      status: "",
      bonus_offer_image: "",
      isLoader: false,
    });
    setinputinfoTrue({
      bonus_title: false,
      bonus_percentage: false,
      start_date: false,
      end_date: false,
      status: false,
    });
    setSelectedBonusOfferImage(undefined);
    setDialogTitle("Add Bonus Offer");
    setOpen(true);
  };
  const updateoffer = (prop) => {
    var start_date = new Date(prop.start_date);
    var end_date = new Date(prop.end_date);
    setSelectedBonusOfferImage(undefined);

    setEdit({
      id: prop.id,
      bonus_title: prop.bonus_title,
      bonus_percentage: prop.bonus_percentage,
      start_date: `${start_date.getFullYear()}-${
        start_date.getMonth().toString.length == 1 ? 0 : ""
      }${start_date.getMonth()}-${
        start_date.getDate().toString().length == 1 ? 0 : ""
      }${start_date.getDate()}`,
      end_date: `${end_date.getFullYear()}-${
        end_date.getMonth().toString.length == 1 ? 0 : ""
      }${end_date.getMonth()}-${
        end_date.getDate().toString().length == 1 ? 0 : ""
      }${end_date.getDate()}`,
      status: prop.bonus_offer_status,
      bonus_offer_image: prop.bonus_offer_image,
      isLoader: false,
    });
    setPreviewBonusOfferImage(prop.bonus_offer_image);
    setinputinfoTrue({
      bonus_title: false,
      bonus_percentage: false,
      start_date: false,
      end_date: false,
      status: false,
    });
    setDialogTitle("Update Bonus Offer");
    setOpen(true);
  };

  const handleContextClose = (index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = null;
    setOpenTableMenus(tableMenus);
  };
  const onUpdate = async () => {
    if (edit.bonus_title == "") {
      toast.error("Bonus Title is requied");
    } else if (edit.bonus_percentage == "") {
      toast.error("Bonus Percentage is requied");
    } else if (edit.start_date == "") {
      toast.error("Start Date is requied");
    } else if (edit.end_date == "") {
      toast.error("End Date is requied");
    } else if (edit.status == "") {
      toast.error("Status is requied");
    } else if (
      selectedBonusOfferImage == undefined &&
      edit.bonus_offer_image == ""
    ) {
      toast.error("Offer Image is requied");
    } else {
      edit.isLoader = true;
      setEdit({ ...edit });
      const param = new FormData();
      if (edit.id == "") {
        param.append("action", "add_mt5_bonus_offer");
      } else {
        param.append("action", "update_mt5_bonus_offer");
        param.append("id", edit.id);
      }

      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (edit.bonus_offer_image != previewBonusOfferImage) {
        param.append("bonus_offer_image", selectedBonusOfferImage);
      }
      param.append("bonus_title", edit.bonus_title);
      param.append("bonus_percentage", edit.bonus_percentage);
      param.append("start_date", edit.start_date);
      param.append("end_date", edit.end_date);
      param.append("bonus_offer_status", edit.status);

      await axios
        .post(`${Url}/ajaxfiles/mt5_bonus_offers_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          edit.isLoader = false;
          setEdit({ ...edit });
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
  const manageDialogActionButton = () => {
    if (
      dialogTitle == "Update Bonus Offer" ||
      dialogTitle == "Add Bonus Offer"
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
          {edit.isLoader == true ? (
            <Button type="submit" className="btn-gradient btn-success" disabled>
              <svg
                class="spinner"
                style={{ position: "unset" }}
                viewBox="0 0 50 50"
              >
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
              onClick={onUpdate}
            >
              {edit.id == "" ? "Add Offer" : "Update"}
            </Button>
          )}
        </div>
      );
    }
  };
  const manageContent = () => {
    if (
      dialogTitle == "Update Bonus Offer" ||
      dialogTitle == "Add Bonus Offer"
    ) {
      return (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sx={6}>
              {" "}
              <TextField
                label="Bonus Title"
                variant="standard"
                error={
                  edit.bonus_title == "" && inputinfoTrue.bonus_title
                    ? true
                    : false
                }
                helperText={
                  edit.bonus_title == "" && inputinfoTrue.bonus_title
                    ? "Bonus Title is required"
                    : ""
                }
                sx={{ width: "100%" }}
                name="bonus_title"
                onBlur={inputtrueFalse}
                value={edit.bonus_title}
                onChange={input}
                focused
              />
            </Grid>
            <Grid item md={6} sx={6}>
              <TextField
                label="Bonus Percentage"
                variant="standard"
                sx={{ width: "100%" }}
                name="bonus_percentage"
                error={
                  edit.bonus_percentage == "" && inputinfoTrue.bonus_percentage
                    ? true
                    : false
                }
                helperText={
                  edit.bonus_percentage == "" && inputinfoTrue.bonus_percentage
                    ? "Bonus Percentage is required"
                    : ""
                }
                value={edit.bonus_percentage}
                onBlur={inputtrueFalse}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    input(e);
                  }
                }}
                focused
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                label="Start Date"
                type="date"
                variant="standard"
                sx={{ width: "100%" }}
                name="start_date"
                value={edit.start_date}
                onBlur={inputtrueFalse}
                error={
                  edit.start_date == "" && inputinfoTrue.start_date
                    ? true
                    : false
                }
                helperText={
                  edit.start_date == "" && inputinfoTrue.start_date
                    ? "Start Date is required"
                    : ""
                }
                onChange={input}
                focused
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                label="End Date"
                variant="standard"
                type="date"
                focused
                sx={{ width: "100%" }}
                onBlur={inputtrueFalse}
                error={
                  edit.end_date == "" && inputinfoTrue.end_date ? true : false
                }
                helperText={
                  edit.end_date == "" && inputinfoTrue.end_date
                    ? "End Date is required"
                    : ""
                }
                name="end_date"
                value={edit.end_date}
                onChange={input}
              />
            </Grid>
            <Grid item md={6}>
              {" "}
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={edit.status == "" && inputinfoTrue.status ? true : false}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Status
                </InputLabel>
                <Select
                  label="Status"
                  name="status"
                  onBlur={inputtrueFalse}
                  onChange={input}
                  value={edit.status}
                  focused
                >
                  <MenuItem value="1">Enable</MenuItem>
                  <MenuItem value="0">Disable</MenuItem>
                </Select>
                {edit.status == "" && inputinfoTrue.status ? (
                  <FormHelperText>Status is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <div className="element">
                <div>
                  <label>Offer Image :</label>
                </div>
                <div>
                  <label
                    htmlFor="contained-button-file"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => {
                        if (
                          e.target.files[0].type == "image/jpeg" ||
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg"
                        ) {
                          onSelectFile(e, "bonus_offer_image");
                        } else {
                          toast.error(
                            "Only JPG, JPEG and PNG types are accepted"
                          );
                        }
                      }}
                    />
                    {selectedBonusOfferImage ? (
                      <img
                        src={previewBonusOfferImage}
                        style={{ width: "auto" }}
                        className="deposit-upload-image-preview"
                      />
                    ) : edit.bonus_offer_image != "" ? (
                      <img
                        src={edit.bonus_offer_image}
                        style={{ width: "auto" }}
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
            </Grid>
          </Grid>
        </>
      );
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const actionMenuPopup = (e, index) => {
    handleContextClose(index);
    if (e == "reject") {
      setDialogTitle("Reject");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to reject this?</p>
              <div className="confirmation-alert-action-button">
                <Button
                  variant="contained"
                  className="cancelButton"
                  onClick={onClose}
                >
                  No
                </Button>
                {popisLoader == true ? (
                  <Button
                    type="submit"
                    className="btn-gradient btn-danger"
                    disabled
                  >
                    <svg
                      class="spinner"
                      style={{ position: "unset" }}
                      viewBox="0 0 50 50"
                    >
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
                    id="loder"
                    variant="contained"
                    className="btn-gradient btn-danger"
                    onClick={() => {
                      handleAction(index, "rejected", onClose);
                    }}
                  >
                    Yes, Reject it!
                  </Button>
                )}
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("approve")) {
      setDialogTitle("Approve");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to approve this?</p>
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
                  className="btn-gradient btn-success"
                  onClick={() => {
                    handleAction(index, "approve", onClose);
                  }}
                >
                  Yes, Approve it!
                </Button>
              </div>
            </div>
          );
        },
      });
    }

    // setOpen(true);
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
    if (flag == "approve") {
      param.append("action", "approve_mt5_bonus_request");
    } else {
      param.append("action", "delete_mt5_bonus_offer");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    setPopisLoader(true);
    param.append("id", id);
    await axios
      .post(`${Url}/ajaxfiles/mt5_bonus_offers_manage.php`, param)
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
          button.innerHTML =
            flag == "approve" ? "Yes, Approve it!" : `Yes, Reject it!`;
          toast.error(res.data.message);
          setPopisLoader(false);
        } else {
          onClose();
          toast.success(res.data.message);
          setRefresh(!refresh);
          setPopisLoader(false);
        }
      });
  };
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Bonus Offer</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  checkStatusBonus={checkStatus}
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />

                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {prop.permission.add_mt5_bonus_offer == 1 ? (
                    <ColorButton onClick={onAdd}>Add Offer</ColorButton>
                  ) : (
                    ""
                  )}

                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/mt5_bonus_offer_list.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          footer={footer}
                          param={param}
                          searchWord={searchKeyword}
                          // checkStatus={checkStatus}
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

export default Mt5BonusOffer;
