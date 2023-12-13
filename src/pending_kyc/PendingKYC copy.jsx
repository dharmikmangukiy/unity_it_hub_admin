import "./pending_kyc.css";
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

const PendingKYC = (prop) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [dialogTitle, setDialogTitle] = useState("");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});
  const [selectedAadharCardFrontFile, setSelectedAadharCardFrontFile] =
    useState();
  const [previewAadharCardFront, setPreviewAadharCardFront] = useState();
  const [selectedAadharCardBackFile, setSelectedAadharCardBackFile] =
    useState();
  const [previewAdditionalDocumentsBack, setPreviewAdditionalDocumentsBack] =
    useState();
  const [selectedAdditionalDocumentsBack, setSelectedAdditionalDocumentsBack] =
    useState();

  const [previewAdditionalDocuments, setPreviewAdditionalDocuments] =
    useState();
  const [selectedAdditionalDocuments, setSelectedAdditionalDocuments] =
    useState();

  const [previewAadharCardBack, setPreviewAadharCardBack] = useState();
  const [selectedPanCardFile, setSelectedPanCardFile] = useState();
  const [previewPancard, setPreviewPancard] = useState();
  const [selectedPassbookFile, setSelectedPassbookFile] = useState();
  const [previewPassbook, setPreviewPassbook] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [checkStatus, setcheckStatus] = useState("");
  const [param, setParam] = useState({
    kyc_status: "",
    filter: id,
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    maincheck: true,
    sencons: true,
    aadhar_card_number: "",
    aadhar_front_img: "",
    maincheck1: true,
    passport_front_image: "",
    passport_back_image: "",
    additional_documents: "",
    additional_documents_back: "",
    aadhar_back_img: "",
    pan_card_img: "",
    passbook_img: "",
    account_number: "",
    bank_name: "",
    bank_holder_name: "",
    bank_ifsc_code: "",
    remark: "",
    status: "",
    first_name: "",
    last_name: "",
    isLoader: false,
    user_id: 0,
    kyc_id: 0,
  });
  toast.configure();

  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      sortable: true,
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
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i
                        className="material-icons view"
                        onClick={(event) => actionMenuPopup(event, row)}
                      >
                        receipt
                      </i>
                      &nbsp;&nbsp;View
                    </MenuItem>
                  ) : (
                    ""
                  )}

                  {prop.permission.update_kyc == 1 ? (
                    <MenuItem
                      className="edit"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i
                        className="material-icons edit"
                        onClick={(event) => actionMenuPopup(event, row)}
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
                        onClick={(event) => actionMenuPopup(event, row)}
                      >
                        <i
                          className="material-icons font-color-approved approve"
                          onClick={(event) => actionMenuPopup(event, row)}
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
                  {prop.permission.reject_kyc == 1 ? (
                    <MenuItem
                      className="reject"
                      {...row}
                      onClick={(event) => actionMenuPopup(event, row)}
                    >
                      <i
                        className="material-icons font-color-rejected reject"
                        onClick={(event) => actionMenuPopup(event, row)}
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

  const actionMenuPopup = (e, data) => {
    handleContextClose(data.sr_no);
    if (e.target.classList.contains("reject")) {
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
                  variant="contained"
                  className="btn-gradient btn-danger"
                  onClick={() => {
                    changeStatus("rejected", data);
                    onClose();
                  }}
                >
                  Yes, Reject it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("approve")) {
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
                  variant="contained"
                  className="btn-gradient btn-success"
                  onClick={() => {
                    changeStatus("approved", data);
                    onClose();
                  }}
                >
                  Yes, Approve it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("view")) {
      setForm({
        name: "",
        email: "",
        maincheck: true,
        sencons: true,
        maincheck1: true,
        passport_front_image: "",
        passport_back_image: "",
        aadhar_card_number: "",
        aadhar_front_img: "",
        aadhar_back_img: "",
        additional_documents: "",
        additional_documents_back: "",
        pan_card_img: "",
        passbook_img: "",
        account_number: "",
        bank_name: "",
        bank_holder_name: "",
        bank_ifsc_code: "",
        remark: "",
        status: "",
        isLoader: true,
        user_id: 0,
        kyc_id: 0,
      });
      editkycDetails(e, data, "View KYC Details");
      setDialogTitle("View KYC Details");
      setOpen(true);
    } else if (e.target.classList.contains("edit")) {
      setForm({
        name: "",
        email: "",
        aadhar_card_number: "",
        aadhar_front_img: "",
        maincheck: true,
        sencons: true,
        maincheck1: true,
        passport_front_image: "",
        passport_back_image: "",
        aadhar_back_img: "",
        additional_documents: "",
        additional_documents_back: "",
        pan_card_img: "",
        passbook_img: "",
        account_number: "",
        bank_name: "",
        bank_holder_name: "",
        bank_ifsc_code: "",
        remark: "",
        status: "",
        isLoader: true,
        user_id: 0,
        kyc_id: 0,
      });
      editkycDetails(e, data, "Edit KYC Details");
      setDialogTitle("Edit KYC Details");
      setOpen(true);
    }
  };

  const editkycDetails = async (e, data, status) => {
    form.isLoader = true;
    setForm({ ...form });
    const param = new FormData();
    if (status == "View KYC Details") {
      param.append("action", "view_kyc");
    } else if (status == "Edit KYC Details") {
      param.append("action", "view_kyc");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", data.user_id);
    param.append("kyc_id", data.kyc_id);
    await axios.post(`${Url}/ajaxfiles/kyc_manage.php`, param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setSelectedAadharCardBackFile("");
        setSelectedAadharCardFrontFile("");
        setSelectedAdditionalDocuments("");
        setSelectedAdditionalDocumentsBack("");
        setForm((prevalue) => {
          return {
            ...prevalue,
            first_name: res.data.kyc_data.first_name,
            last_name: res.data.kyc_data.last_name,
            name: res.data.kyc_data.name,
            email: res.data.kyc_data.email,
            aadhar_card_number: res.data.kyc_data.aadhar_card_number,
            aadhar_front_img: res.data.kyc_data.id_proof_front_image,
            aadhar_back_img: res.data.kyc_data.id_proof_back_image,
            additional_documents: res.data.kyc_data.additional_documents,
            additional_documents_back:
              res.data.kyc_data.additional_documents_back,
            pan_card_img: res.data.kyc_data.pancard_image,
            maincheck:
              res.data.kyc_data.id_proof_back_image == "" ? false : true,
            sencons:
              res.data.kyc_data.additional_documents_back == "" ? false : true,
            maincheck1:
              res.data.kyc_data.passport_back_image == "" ? false : true,
            passport_front_image: res.data.kyc_data.passport_front_image,
            passport_back_image: res.data.kyc_data.passport_back_image,
            bank_name: res.data.kyc_data.bank_name,
            bank_holder_name: res.data.kyc_data.bank_holder_name,
            bank_ifsc_code: res.data.kyc_data.bank_ifsc_code,
            remark: res.data.kyc_data.feedback_remarks,
            status: res.data.kyc_data.status,
            isLoader: false,
            user_id: data.user_id,
            kyc_id: data.kyc_id,
          };
        });
      }
    });
  };

  const changeStatus = (status, data) => {
    if (status == "approved") {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("kyc_id", data.kyc_id);
      param.append("action", "approve_kyc");
      axios.post(Url + "/ajaxfiles/kyc_manage.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setRefresh(!refresh);
        toast.success(res.data.message);
      });
    } else if (status == "rejected") {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("kyc_id", data.kyc_id);
      param.append("action", "reject_kyc");
      axios.post(Url + "/ajaxfiles/kyc_manage.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setRefresh(!refresh);
        toast.success(res.data.message);
      });
    }
  };

  const manageContent = () => {
    if (dialogTitle == "View KYC Details") {
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
                <label>ID Number :</label>
                <label>{form.aadhar_card_number}</label>
              </div>
              <div className="element">
                <label>Remark :</label>
                <label>{form.remark}</label>
              </div>
            </div>
            <br />
            <div className="view-image-section">
              {form.aadhar_front_img != "" ? (
                <div className="element">
                  <label>ID Front Img :</label>
                  {form.aadhar_front_img != "" ? (
                    <CustomImageModal image={`${form.aadhar_front_img}`} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {form.aadhar_back_img != "" ? (
                <div className="element">
                  <label>ID Back Img :</label>
                  {form.aadhar_back_img != "" ? (
                    <CustomImageModal image={`${form.aadhar_back_img}`} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {form.additional_documents != "" ? (
                <div className="element">
                  <label>additional ID Front Img :</label>
                  {form.additional_documents != "" ? (
                    <CustomImageModal image={`${form.additional_documents}`} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="view-image-section">
              {form.additional_documents_back != "" ? (
                <div className="element">
                  <label> additional ID Back Img :</label>
                  {form.additional_documents_back != "" ? (
                    <CustomImageModal
                      image={`${form.additional_documents_back}`}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      }
    } else if (dialogTitle == "Edit KYC Details") {
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
              <div className="element">
                <TextField
                  label="ID Number"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={input}
                  value={form.aadhar_card_number}
                  name="aadhar_card_number"
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
            <div className="element">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.maincheck}
                    onChange={(e) => {
                      form.maincheck = !form.maincheck;
                      setForm({ ...form });
                    }}
                  />
                }
                label="ID Double side"
              />
            </div>
            <div className="view-image-section" style={{ gap: "34px" }}>
              <div className="element">
                <label>ID Front Img :</label>
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
                        e.target.files[0].type == "application/pdf" ||
                        e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpg"
                      ) {
                        onSelectFile(e, "aadhar_front");
                      } else {
                        toast.error(
                          "Only JPG, JPEG, PNG and PDF types are accepted"
                        );
                      }
                    }}
                  />
                  {selectedAadharCardFrontFile ? (
                    <img
                      src={previewAadharCardFront}
                      className="deposit-upload-image-preview"
                    />
                  ) : form.aadhar_front_img != "" ? (
                    <img
                      src={form.aadhar_front_img}
                      className="deposit-upload-image-preview"
                    />
                  ) : (
                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>&nbsp;Upload
                    </Button>
                  )}
                </label>
              </div>
              {form.maincheck == true ? (
                <div className="element">
                  <label>ID Back Img :</label>
                  <label
                    htmlFor="contained-button-file_back"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="image/*"
                      id="contained-button-file_back"
                      type="file"
                      onChange={(e) => {
                        {
                          if (
                            e.target.files[0].type == "image/jpeg" ||
                            e.target.files[0].type == "application/pdf" ||
                            e.target.files[0].type == "image/png" ||
                            e.target.files[0].type == "image/jpg"
                          ) {
                            onSelectFile(e, "aadhar_back");
                          } else {
                            toast.error(
                              "Only JPG, JPEG, PNG and PDF types are accepted"
                            );
                          }
                        }
                      }}
                    />
                    {selectedAadharCardBackFile ? (
                      <img
                        src={previewAadharCardBack}
                        className="deposit-upload-image-preview"
                      />
                    ) : form.aadhar_back_img != "" ? (
                      <img
                        src={form.aadhar_back_img}
                        className="deposit-upload-image-preview"
                      />
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
                label="Address Proof Double side"
              />
            </div>
            <div className="view-image-section" style={{ gap: "34px" }}>
              <div className="element">
                <label>Address Proof Front Img :</label>
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
                        e.target.files[0].type == "application/pdf" ||
                        e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpg"
                      ) {
                        onSelectFile(e, "aadhar_front");
                      } else {
                        toast.error(
                          "Only JPG, JPEG, PNG and PDF types are accepted"
                        );
                      }
                    }}
                  />
                  {selectedAadharCardFrontFile ? (
                    <img
                      src={previewAadharCardFront}
                      className="deposit-upload-image-preview"
                    />
                  ) : form.passport_front_image != "" ? (
                    <img
                      src={form.passport_front_image}
                      className="deposit-upload-image-preview"
                    />
                  ) : (
                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>&nbsp;Upload
                    </Button>
                  )}
                </label>
              </div>
              {form.maincheck1 == true ? (
                <div className="element">
                  <label>Address Proof Back Img :</label>
                  <label
                    htmlFor="contained-button-file_back"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="image/*"
                      id="contained-button-file_back"
                      type="file"
                      onChange={(e) => {
                        if (
                          e.target.files[0].type == "image/jpeg" ||
                          e.target.files[0].type == "application/pdf" ||
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg"
                        ) {
                          onSelectFile(e, "aadhar_back");
                        } else {
                          toast.error(
                            "Only JPG, JPEG, PNG and PDF types are accepted"
                          );
                        }
                      }}
                    />
                    {selectedAadharCardBackFile ? (
                      <img
                        src={previewAadharCardFront}
                        className="deposit-upload-image-preview"
                      />
                    ) : form.passport_back_image != "" ? (
                      <img
                        src={form.passport_back_image}
                        className="deposit-upload-image-preview"
                      />
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
            <br />
            <div className="element">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.sencons}
                    onChange={(e) => {
                      form.sencons = !form.sencons;
                      setForm({ ...form });
                    }}
                  />
                }
                label="Additional ID Double side"
              />
            </div>
            <div className="view-image-section">
              <div className="element">
                <label>Additional ID Front Img :</label>
                <label
                  htmlFor="contained-button-file_back1"
                  className="fileuploadButton"
                >
                  <Input
                    accept="image/*"
                    id="contained-button-file_back1"
                    type="file"
                    onChange={(e) => {
                      if (
                        e.target.files[0].type == "image/jpeg" ||
                        e.target.files[0].type == "application/pdf" ||
                        e.target.files[0].type == "image/png" ||
                        e.target.files[0].type == "image/jpg"
                      ) {
                        onSelectFile(e, "additional_documents");
                      } else {
                        toast.error(
                          "Only JPG, JPEG, PNG and PDF types are accepted"
                        );
                      }
                    }}
                  />
                  {selectedAdditionalDocuments ? (
                    <img
                      src={previewAdditionalDocuments}
                      className="deposit-upload-image-preview"
                    />
                  ) : form.additional_documents != "" ? (
                    <img
                      src={form.additional_documents}
                      className="deposit-upload-image-preview"
                    />
                  ) : (
                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>&nbsp;Upload
                    </Button>
                  )}
                </label>
              </div>
              {form.sencons == true ? (
                <div className="element">
                  <label>Additional ID Back Img :</label>
                  <label
                    htmlFor="contained-button-file_back11"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="image/*"
                      id="contained-button-file_back11"
                      type="file"
                      onChange={(e) => {
                        if (
                          e.target.files[0].type == "image/jpeg" ||
                          e.target.files[0].type == "application/pdf" ||
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg"
                        ) {
                          onSelectFile(e, "additional_documents_back");
                        } else {
                          toast.error(
                            "Only JPG, JPEG, PNG and PDF types are accepted"
                          );
                        }
                      }}
                    />
                    {selectedAdditionalDocumentsBack ? (
                      <img
                        src={previewAdditionalDocumentsBack}
                        className="deposit-upload-image-preview"
                      />
                    ) : form.additional_documents_back != "" ? (
                      <img
                        src={form.additional_documents_back}
                        className="deposit-upload-image-preview"
                      />
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
    } else if (dialogTitle == "Edit KYC Details") {
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
    } else if (dialogTitle == "View KYC Details") {
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
    /* if (form.aadhar_card_number == '') {
            toast.error('Please enter aadhar card number');
        } else if (form.account_number == '') {
            toast.error('Please enter bank account number');
        } else if (form.bank_name == '') {
            toast.error('Please enter bank name');
        } else if (form.bank_holder_name == '') {
            toast.error('Please enter bank holder name');
        } else if (form.bank_ifsc_code == '') {
            toast.error('Please enter bank ifsc code');
        } else  */
    if (form.remark == "") {
      toast.error("Please enter remark");
    } else if (form.status == "") {
      toast.error("Please select status");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      param.append("action", "update_kyc");
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("aadhar_card_number", form.aadhar_card_number);
      /* param.append('bank_account_number', form.account_number);
            param.append('bank_name', form.bank_name);
            param.append('bank_holder_name', form.bank_holder_name);
            param.append('bank_ifsc_code', form.bank_ifsc_code); */
      param.append("kyc_status", form.status);
      param.append("feedback_remarks", form.remark);
      param.append("kyc_id", form.kyc_id);
      param.append("user_id", form.user_id);

      if (selectedAadharCardFrontFile) {
        param.append("aadhar_card_front_image", selectedAadharCardFrontFile);
      }

      if (selectedAadharCardBackFile) {
        param.append("aadhar_card_back_image", selectedAadharCardBackFile);
      }
      if (selectedAdditionalDocumentsBack) {
        param.append(
          "additional_documents_back",
          selectedAdditionalDocumentsBack
        );
      }
      if (selectedAdditionalDocuments) {
        param.append("additional_documents", selectedAdditionalDocuments);
      }
      param.append("double_sided_documents", form.maincheck == true ? 1 : 0);
      param.append("additional_double_sided", form.sencons == true ? 1 : 0);

      await axios.post(`${Url}/ajaxfiles/kyc_manage.php`, param).then((res) => {
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
            maincheck: true,
            sencons: true,
            maincheck1: true,
            passport_front_image: "",
            passport_back_image: "",
            aadhar_card_number: "",
            aadhar_front_img: "",
            aadhar_back_img: "",
            additional_documents: "",
            additional_documents_back: "",
            pan_card_img: "",
            passbook_img: "",
            account_number: "",
            bank_name: "",
            bank_holder_name: "",
            bank_ifsc_code: "",
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
    if (!selectedAadharCardFrontFile) {
      setPreviewAadharCardFront(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAadharCardFrontFile);
    setPreviewAadharCardFront(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAadharCardFrontFile]);

  useEffect(() => {
    if (!selectedAadharCardBackFile) {
      setPreviewAadharCardBack(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAadharCardBackFile);
    setPreviewAadharCardBack(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAadharCardBackFile]);

  useEffect(() => {
    if (checkStatus != "") {
      param.kyc_status = checkStatus;
      setParam({ ...param });
    }
  }, [checkStatus]);
  useEffect(() => {
    if (!selectedAdditionalDocuments) {
      setPreviewAdditionalDocuments(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAdditionalDocuments);
    setPreviewAdditionalDocuments(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAdditionalDocuments]);
  useEffect(() => {
    if (!selectedAdditionalDocumentsBack) {
      setPreviewAdditionalDocumentsBack(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAdditionalDocumentsBack);
    setPreviewAdditionalDocumentsBack(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAdditionalDocumentsBack]);

  const onSelectFile = (e, flag) => {
    if (flag == "aadhar_front") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewAadharCardFront(undefined);
        return;
      }

      setSelectedAadharCardFrontFile(e.target.files[0]);
    } else if (flag == "aadhar_back") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewAadharCardBack(undefined);
        return;
      }

      setSelectedAadharCardBackFile(e.target.files[0]);
    } else if (flag == "additional_documents") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewAdditionalDocuments(undefined);
        return;
      }

      setSelectedAdditionalDocuments(e.target.files[0]);
    } else if (flag == "additional_documents_back") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewAdditionalDocumentsBack(undefined);
        return;
      }

      setSelectedAdditionalDocumentsBack(e.target.files[0]);
    } else if (flag == "pan_card") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewPancard(undefined);
        return;
      }

      setSelectedPanCardFile(e.target.files[0]);
    } else if (flag == "passbook") {
      if (!e.target.files || e.target.files.length === 0) {
        setPreviewPassbook(undefined);
        return;
      }

      setSelectedPassbookFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Pending KYC</p>
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
                          url={`${Url}/datatable/kyc_list.php`}
                          column={column}
                          sort="1"
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

export default PendingKYC;
