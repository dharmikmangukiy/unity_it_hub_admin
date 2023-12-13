import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  InputLabel,
  Input,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CustomImageModal from "../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate, useParams } from "react-router-dom";
import NewDate from "../common/NewDate";
import { ColorButton } from "../common/CustomElement";

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

const AdditionalDocument = (prop) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [dialogTitle, setDialogTitle] = useState("");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [checkStatus, setcheckStatus] = useState("");
  const [param, setParam] = useState({
    // status: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "EMAIL",
      value: false,
      name: "email",
    },
  ]);
  const [type, setType] = useState({
    passport_front_image: "",
    passport_back_image: "",

    passport_front_imageP: "",
    passport_back_imageP: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",

    aadhar_card_number: "",
    aadhar_front_img: "",
    maincheck1: true,
    passport_front_image: "",
    passport_back_image: "",

    remark: "",
    status: "",
    isLoader: false,
    kyc_id: 0,
  });
  toast.configure();

  const column = [
    {
      name: "SR.NO",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      sortable: true,
      minWidth: "72px",
      // wrap: true,
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
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },

    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={row.status}
            className={`text-color-${
              row.status == "1" ? "green" : row.status == "2" ? "red" : "yellow"
            }`}
          >
            {row.status == "1"
              ? "APPROVED"
              : row.status == "2"
              ? "REJECTED"
              : "PENDING"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
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
      name: "Updated Date",
      selector: (row) => {
        return (
          <span title={row.updated_datetime}>
            {row.updated_datetime == "" ? (
              ""
            ) : (
              <NewDate newDate={row.updated_datetime} />
            )}
          </span>
        );
      },
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.view_kycs == 1 ||
            prop.permission.update_kyc == 1 ||
            prop.permission.approve_kyc == 1 ||
            prop.permission.reject_kyc == 1 ? (
              <>
                <Button
                  id={`actionButton_${row.sr_no}`}
                  aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(event) => handleContextClick(event, row.sr_no)}
                  {...row}
                  style={{ color: "rgb(144 145 139)" }}
                >
                  <i className="material-icons">more_horiz</i>
                </Button>
                <Menu
                  id={`basic-menu-${row.sr_no}`}
                  anchorEl={openTableMenus[row.sr_no]}
                  open={Boolean(openTableMenus[row.sr_no])}
                  onClose={(event) => handleContextClose(row.sr_no)}
                >
                  {prop.permission.view_kycs == 1 ? (
                    <MenuItem
                      className="view"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row, "view")}
                    >
                      <i
                        className="material-icons view"
                        onClick={(event) => actionMenuPopup(event, row, "view")}
                      >
                        receipt
                      </i>
                      &nbsp;&nbsp;View
                    </MenuItem>
                  ) : (
                    ""
                  )}

                  {prop.permission.update_kyc == 1 && row.status != "1" ? (
                    <MenuItem
                      className="edit"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row, "edit")}
                    >
                      <i
                        className="material-icons edit"
                        onClick={(event) => actionMenuPopup(event, row, "edit")}
                      >
                        visibility
                      </i>
                      &nbsp;&nbsp;Edit
                    </MenuItem>
                  ) : (
                    ""
                  )}

                  {row.status != "1" ? (
                    prop.permission.approve_kyc == 1 ? (
                      <MenuItem
                        className="approve"
                        {...row}
                        onClick={(event) =>
                          actionMenuPopup(event, row, "approve")
                        }
                      >
                        <i
                          className="material-icons font-color-approved approve"
                          onClick={(event) =>
                            actionMenuPopup(event, row, "approve")
                          }
                        >
                          thumb_up
                        </i>
                        &nbsp;&nbsp;Approved
                      </MenuItem>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}

                  {prop.permission.reject_kyc == 1 && row.status != "1" ? (
                    <MenuItem
                      className="reject"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row, "reject")}
                    >
                      <i
                        className="material-icons font-color-rejected reject"
                        onClick={(event) =>
                          actionMenuPopup(event, row, "reject")
                        }
                      >
                        thumb_down
                      </i>
                      &nbsp;&nbsp;Rejected
                    </MenuItem>
                  ) : (
                    ""
                  )}
                </Menu>
              </>
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

  const actionMenuPopup = (e, data, flagALL) => {
    handleContextClose(data.sr_no);
    if (flagALL == "reject") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to rejected this?</p>
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
                    changeStatus("rejected", data, onClose);
                  }}
                >
                  Yes, Reject it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (flagALL == "approve") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to approved this?</p>
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
                    changeStatus("approved", data, onClose);
                  }}
                >
                  Yes, Approve it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (flagALL == "view") {
      setForm({
        name: "",
        email: "",
        maincheck1: true,
        passport_front_image: "",
        passport_back_image: "",
        aadhar_card_number: "",

        remark: "",
        status: "",
        isLoader: false,
        user_id: 0,
        kyc_id: 0,
      });
      editkycDetails(e, data, "View Additional Document");
      setDialogTitle("View Additional Document");
      setOpen(true);
    } else if (flagALL == "edit") {
      setForm({
        name: "",
        email: "",
        aadhar_card_number: "",

        maincheck1: true,
        passport_front_image: "",
        passport_back_image: "",

        remark: "",
        status: "",
        isLoader: true,
        user_id: 0,
        kyc_id: 0,
      });
      editkycDetails(e, data, "Edit Additional Document");
      setDialogTitle("Edit Additional Document");
      setOpen(true);
    }
  };

  const editkycDetails = async (e, data, status) => {
    setForm((prevalue) => {
      return {
        ...prevalue,

        name: data.name,
        email: data.email,
        aadhar_card_number: data.document_name,
        maincheck1: data.document_back_image == "" ? false : true,
        passport_front_image: "",
        passport_back_image: "",
        remark: data.remarks,
        status: data.status,
        isLoader: false,
        user_id: data.user_id,
        kyc_id: data.document_id,
      };
    });
    setType({
      passport_front_image:
        data.document_front_image.split(".").pop() == "pdf"
          ? "application/pdf"
          : "image",
      passport_back_image:
        data.document_back_image.split(".").pop() == "pdf"
          ? "application/pdf"
          : "image",

      passport_front_imageP: data.document_front_image,
      passport_back_imageP: data.document_back_image,
    });
  };

  const changeStatus = (status, data, onClose) => {
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
    if (status == "approved") {
      const param = new FormData();
      if (IsApprove !== "") {
param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("document_id", data.document_id);
      param.append("action", "approve_document");
      axios
        .post(Url + "/ajaxfiles/additional_documents_manage.php", param)
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

            // Disable the button
            button.disabled = false;
            button.innerHTML = `Yes, Approve it!`;
            toast.error(res.data.message);
          } else {
            onClose();
            setRefresh(!refresh);
            toast.success(res.data.message);
          }
        });
    } else if (status == "rejected") {
      const param = new FormData();
      if (IsApprove !== "") {
param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("document_id", data.document_id);
      param.append("action", "reject_document");
      axios
        .post(Url + "/ajaxfiles/additional_documents_manage.php", param)
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

            // Disable the button
            button.disabled = false;
            button.innerHTML = `Yes, Reject it!`;
            toast.error(res.data.message);
          } else {
            onClose();
            setRefresh(!refresh);
            toast.success(res.data.message);
          }
        });
    }
  };

  const manageContent = () => {
    if (dialogTitle == "View Additional Document") {
      if (form.isLoader == true) {
        return (
          <div className="popup-loader">
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
          </div>
        );
      } else {
        return (
          <div>
            <div className="view-margeField">
              <div className="element">
                <label>Name :</label>
                <label>{form.name}</label>
              </div>
              <div className="element">
                <label>Email :</label>
                <label>{form.email}</label>
              </div>
              <div className="element">
                <label>Document Name :</label>
                <label>{form.aadhar_card_number}</label>
              </div>
              {/* <div className="element">
                <label>ID Number :</label>
                <label>{form.aadhar_card_number}</label>
              </div> */}
              <div className="element">
                <label>Remark :</label>
                <label>{form.remark}</label>
              </div>
            </div>
            <br />
            <div className="view-image-section">
              <div className="view-image-section">
                {type.passport_front_image != "" ? (
                  <div className="element">
                    <label>Front Img :</label>
                    {type.passport_front_imageP != "" ? (
                      type.passport_front_image == "application/pdf" ? (
                        <a href={type.passport_front_imageP} target="_blank">
                          <embed
                            src={type.passport_front_imageP}
                            className="deposit-upload-image-preview"
                          />
                          <div>
                            <ColorButton>View Pdf</ColorButton>
                          </div>
                        </a>
                      ) : (
                        <CustomImageModal
                          image={type.passport_front_imageP}
                          isIcon={false}
                          className="tableImg"
                        />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
                {type.passport_back_imageP != "" ? (
                  <div className="element">
                    <label> Back Img :</label>
                    {type.passport_back_imageP != "" ? (
                      type.passport_back_image == "application/pdf" ? (
                        <a href={type.passport_back_imageP} target="_blank">
                          <embed
                            src={type.passport_back_imageP}
                            className="deposit-upload-image-preview"
                          />
                          <div>
                            <ColorButton>View Pdf</ColorButton>
                          </div>
                        </a>
                      ) : (
                        <CustomImageModal
                          image={type.passport_back_imageP}
                          isIcon={false}
                          className="tableImg"
                        />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );
      }
    } else if (dialogTitle == "Edit Additional Document") {
      if (form.isLoader == true) {
        return (
          <div className="popup-loader">
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
          </div>
        );
      } else {
        return (
          <div>
            <div className="view-margeField">
              {/* <div className='element'>
                            <TextField label="First Name" variant="standard" sx={{ width: '100%' }} onChange={input} value={form.first_name} name='first_name' disabled />
                        </div> */}
              <div className="element">
                <TextField
                  label="Name"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={input}
                  value={form.name}
                  name="name"
                  disabled
                />
              </div>
              <div className="element">
                <TextField
                  label="Email"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={input}
                  value={form.email}
                  name="email"
                  disabled
                />
              </div>
              {/* <div className="element">
                <TextField
                  label="ID Number"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={input}
                  value={form.aadhar_card_number}
                  name="aadhar_card_number"
                />
              </div> */}
              <div className="element">
                <TextField
                  label="Document Name"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={input}
                  onBlur={() => {
                    form.aadhar_card_numberTrue = true;
                    setForm({ ...form });
                  }}
                  name="aadhar_card_number"
                  value={form.aadhar_card_number}
                  error={
                    form.aadhar_card_numberTrue == true &&
                    form.aadhar_card_number == ""
                      ? true
                      : false
                  }
                  helperText={
                    form.aadhar_card_numberTrue == true &&
                    form.aadhar_card_number == ""
                      ? "Please Enter Document Name"
                      : ""
                  }
                />
              </div>
              <div className="element">
                <TextField
                  label="Remark"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={input}
                  name="remark"
                  value={form.remark}
                />
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Status
                  </InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    onChange={input}
                    value={form.status}
                  >
                    <MenuItem value="0">Pending</MenuItem>
                    <MenuItem value="1">Approved</MenuItem>
                    <MenuItem value="2">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <br />

            <br />

            <div className="element">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.maincheck1}
                    onChange={(e) => {
                      form.maincheck1 = !form.maincheck1;
                      setForm({ ...form });
                    }}
                  />
                }
                label="Additional Document Double side"
              />
            </div>
            <div className="view-image-section" style={{ gap: "34px" }}>
              <div className="element">
                <label>Front Img :</label>
                <label
                  htmlFor="contained-button-file1"
                  className="fileuploadButton"
                >
                  <Input
                    accept="application/pdf,image/*"
                    id="contained-button-file1"
                    type="file"
                    onChange={(e) => {
                      var objectUrl1 = URL.createObjectURL(e.target.files[0]);
                      if (
                        e.target.files[0].type == "image/jpeg" ||
                        e.target.files[0].type == "application/pdf" ||
                        e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpg"
                      ) {
                        form.passport_front_image = e.target.files[0];
                        setForm({ ...form });
                        type.passport_front_image = e.target.files[0].type;
                        type.passport_front_imageP = objectUrl1;
                        setType({ ...type });
                      } else {
                        toast.error(
                          "Only JPG, JPEG and PNG types are accepted."
                        );
                      }
                    }}
                  />
                  {type.passport_front_imageP ? (
                    type.passport_front_image == "application/pdf" ? (
                      <>
                        <embed
                          src={type.passport_front_imageP}
                          className="deposit-upload-image-preview"
                        />
                        <div>
                          <Button variant="contained" component="span">
                            <i className="material-icons">backup</i>&nbsp;Upload
                          </Button>
                        </div>
                      </>
                    ) : (
                      <img
                        src={type.passport_front_imageP}
                        className="deposit-upload-image-preview"
                      />
                    )
                  ) : (
                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>&nbsp;Upload
                    </Button>
                  )}
                </label>
              </div>
              {form.maincheck1 == true ? (
                <div className="element">
                  <label>Back Img :</label>
                  <label
                    htmlFor="contained-button-file_back1"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="application/pdf,image/*"
                      id="contained-button-file_back1"
                      type="file"
                      onChange={(e) => {
                        var objectUrl1 = URL.createObjectURL(e.target.files[0]);
                        if (
                          e.target.files[0].type == "image/jpeg" ||
                          e.target.files[0].type == "application/pdf" ||
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg"
                        ) {
                          form.passport_back_image = e.target.files[0];
                          setForm({ ...form });
                          type.passport_back_image = e.target.files[0].type;
                          type.passport_back_imageP = objectUrl1;
                          setType({ ...type });
                        } else {
                          toast.error(
                            "Only JPG, JPEG and PNG types are accepted."
                          );
                        }
                      }}
                    />
                    {type.passport_back_imageP ? (
                      type.passport_back_image == "application/pdf" ? (
                        <>
                          <embed
                            src={type.passport_back_imageP}
                            className="deposit-upload-image-preview"
                          />
                          <div>
                            <Button variant="contained" component="span">
                              <i className="material-icons">backup</i>
                              &nbsp;Upload
                            </Button>
                          </div>
                        </>
                      ) : (
                        <img
                          src={type.passport_back_imageP}
                          className="deposit-upload-image-preview"
                        />
                      )
                    ) : (
                      <Button variant="contained" component="span">
                        <i className="material-icons">backup</i>&nbsp;Upload
                      </Button>
                    )}
                  </label>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      }
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
              Add
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit Additional Document") {
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
            onClick={formSubmit}
          >
            Update
          </Button>
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
    } else if (dialogTitle == "View Additional Document") {
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
    }
  };

  const formSubmit = async () => {
    if (form.aadhar_card_number == "") {
      toast.error("Please enter Document Name");
    } else if (form.status == "") {
      toast.error("Please select status");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      param.append("action", "update_document");
      if (IsApprove !== "") {
param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("document_status", form.status);
      param.append("document_name", form.aadhar_card_number);

      param.append("admin_remarks", form.remark);
      param.append("document_id", form.kyc_id);
      param.append("user_id", form.user_id);

      if (form.passport_front_image && type.passport_front_imageP) {
        param.append("document_front_image", form.passport_front_image);
      }
      if (form.passport_back_image && type.passport_back_imageP) {
        param.append("document_back_image", form.passport_back_image);
      }

      param.append("document_double_sided", form.maincheck1 == true ? 1 : 0);
      await axios
        .post(`${Url}/ajaxfiles/additional_documents_manage.php`, param)
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
              name: "",
              email: "",
              aadhar_card_number: "",
              maincheck1: true,
              passport_front_image: "",
              passport_back_image: "",
              remark: "",
              status: "",
              isLoader: false,
              user_id: 0,
              kyc_id: 0,
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

  useEffect(() => {
    if (checkStatus != "") {
      param.kyc_status = checkStatus;
      setParam({ ...param });
    }
  }, [checkStatus]);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Additional Documents</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setcheckStatus={setcheckStatus}
                  setParam={setParam}
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" className='add-group' onClick={handleClickOpen}>Add</Button>
                                    </div>
                                    <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/additional_documents_list.php`}
                          column={column}
                          sort="0"
                          refresh={refresh}
                          param={param}
                          search={searchBy}
                          searchWord={searchKeyword}
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

export default AdditionalDocument;
