import "./link.css";
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
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { ClientUrl, IsApprove, Url } from "../global";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
const re = /^[A-Za-z_ ]*$/;

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

const Link = (prop) => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [open, setOpen] = useState(false);
  var [sourceMasterList, setSourceMasterList] = useState({});
  const [resData, setResData] = useState({});
  const [form, setForm] = useState({
    isLoader: false,
    source_name: "",
    source_type: "",
    sales_person: "",
    url_type: "",
    status: "",
    id: "",
  });
  const [inputinfoTrue, setinputinfoTrue] = useState({
    source_name: false,
    source_type: false,
    sales_person: false,
    url_type: false,
    status: false,
    id: false,
  });
  toast.configure();

  const [searchBy, setSearchBy] = useState([
    {
      label: "SOURCE",
      value: false,
      name: "source_name",
    },
    {
      label: "ASSIGNED USER",
      value: false,
      name: "sales_person_name",
    },
    {
      label: "TYPE",
      value: false,
      name: "source_type",
    },
    {
      label: "URL TYPE",
      value: false,
      name: "url_type",
    },
    // {
    //   label: "FULL URL",
    //   value: false,
    //   name: "campaign_url",
    // },
  ]);

  const column = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "SOURCE",
      selector: (row) => {
        return <span title={row.source_name}>{row.source_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "ASSIGNED USER",
      selector: (row) => {
        return (
          <span title={row.sales_person_name}>{row.sales_person_name}</span>
        );
      },
      sortable: true,
      reorder: true,
      // grow: 0.5,
      wrap: true,
    },
    {
      name: "TYPE",
      selector: (row) => {
        return <span title={row.source_type}>{row.source_type}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "URL TYPE",
      selector: (row) => {
        return <span title={row.url_type}>{row.url_type}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span title={row.status == "1" ? "Enable" : "Disable"}>
            {row.status == "1" ? "Enable" : "Disable"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      wrap: true,
    },
    {
      name: "FULL URL",
      selector: (row) => {
        return (
          <div className="full-url-section">
            <a
              className="linkColor linkwrep"
              title={`${ClientUrl}/register/campaign/${row.campaign_url}`}
              href={`${ClientUrl}/register/campaign/${row.campaign_url}`}
              target="_blank"
            >
              {`${ClientUrl}/register/campaign/${row.campaign_url}`}
            </a>
            <button
              className="copy_link"
              onClick={(e) => {
                navigator.clipboard
                  .writeText(
                    `${ClientUrl}/register/campaign/${row.campaign_url}`
                  )
                  .then(
                    function () {
                      toast.success("URL has been successfully copied");
                    },
                    function (err) {
                      toast.error("URL Could not copy, Please try again");
                    }
                  );
              }}
            >
              <span className="blinking">
                <i className="material-icons">content_copy</i>
              </span>
            </button>
          </div>
        );
      },
      reorder: true,
      grow: 1,
      // wrap: true,
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
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div className="actionButtonGroup">
            {prop.permission.update_campaign == 1 ? (
              <Button
                className="btn-edit"
                onClick={(event) => editLink(event, row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              </Button>
            ) : (
              ""
            )}
            {prop.permission.delete_campaign == 1 ? (
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

  const handleClose = () => {
    setOpen(false);
  };
  const openDialogbox = (e, row) => {
    if (e.target.classList.contains("add")) {
      setDialogTitle("Add");
      setForm({
        isLoader: false,
        source_name: "",
        source_type: "",
        sales_person: "",
        url_type: "",
        status: "",
        id: "",
      });
      setinputinfoTrue({
        source_name: false,
        source_type: false,
        sales_person: false,
        url_type: false,
        status: false,
        id: false,
      });
    }
    setOpen(true);
  };
  const manageContent = () => {
    if (dialogTitle == "Add") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Source Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="source_name"
              onBlur={inputtrueFalse}
              error={
                form.source_name == "" && inputinfoTrue.source_name
                  ? true
                  : false
              }
              helperText={
                form.source_name == "" && inputinfoTrue.source_name
                  ? "Source Name is required"
                  : ""
              }
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
            />
          </div>
          <br />
          <div>
            <TextField
              className="input-font-small"
              label="Source Type"
              variant="standard"
              sx={{ width: "100%" }}
              name="source_type"
              onBlur={inputtrueFalse}
              error={
                form.source_type == "" && inputinfoTrue.source_type
                  ? true
                  : false
              }
              helperText={
                form.source_type == "" && inputinfoTrue.source_type
                  ? "Source Type is required"
                  : ""
              }
              onChange={input}
            />
          </div>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.source_type == "" && inputinfoTrue.source_type
                  ? true
                  : false
              }
            >
              <Autocomplete
                multiple
                options={sourceMasterList.source_name}
                getOptionLabel={(option) => (option ? option : "")}
                onChange={(event, newValue) => {
                  form.source_type = newValue;
                  setForm({ ...form });
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Source Type"
                    variant="standard"
                    onBlur={inputtrueFalse}
                    name="source_type"
                    error={
                      form.source_type == "" && inputinfoTrue.source_type
                        ? true
                        : false
                    }
                  />
                )}
              />
            
              {form.source_type == "" && inputinfoTrue.source_type ? (
                <FormHelperText>Source Type is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div> */}
          <br />
          <div>
            {/* <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.sales_person == "" && inputinfoTrue.sales_person
                  ? true
                  : false
              }
            >
              <InputLabel>Sales Person</InputLabel>
              <Select
                label
                className="select-font-small"
                name="sales_person"
                onChange={input}
                onBlur={inputtrueFalse}
              >
                {sourceMasterList.list_salesman?.map((item) => {
                  return (
                    <MenuItem value={item.sales_person}>
                      {item.sales_person_name}
                    </MenuItem>
                  );
                })}
              </Select>
              {form.sales_person == "" && inputinfoTrue.sales_person ? (
                <FormHelperText>Sales Person is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl> */}
            <Autocomplete
              options={sourceMasterList.list_salesman}
              getOptionLabel={(option) =>
                option ? option.sales_person_name : ""
              }
              onChange={(event, newValue) => {
                form.sales_person = newValue;
                setForm({ ...form });
              }}
              value={form.sales_person}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Source Person"
                  variant="standard"
                  // onBlur={inputtrueFalse}
                  name="sales_person"
                  // error={
                  //   form.sales_person == "" && inputinfoTrue.sales_person
                  //     ? true
                  //     : false
                  // }
                  // helperText={form.sales_person == "" && inputinfoTrue.sales_person ? "Sales Person is required" : ""}
                />
              )}
            />
          </div>
          <br />
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.url_type == "" && inputinfoTrue.url_type ? true : false
              }
            >
              <InputLabel>URL Type</InputLabel>
              <Select
                label
                className="select-font-small"
                name="url_type"
                onChange={input}
                onBlur={inputtrueFalse}
              >
                {sourceMasterList.url_type?.map((item) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
              {form.url_type == "" && inputinfoTrue.url_type ? (
                <FormHelperText>URL Type is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <br />
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.status == "" && inputinfoTrue.status ? true : false}
            >
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                onChange={input}
                onBlur={inputtrueFalse}
              >
                <MenuItem value="1">Enable</MenuItem>
                <MenuItem value="0">Disable</MenuItem>
              </Select>
              {form.status == "" && inputinfoTrue.status ? (
                <FormHelperText>Status is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Edit") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Source Name"
              variant="standard"
              value={form.source_name}
              sx={{ width: "100%" }}
              name="source_name"
              onBlur={inputtrueFalse}
              error={
                form.source_name == "" && inputinfoTrue.source_name
                  ? true
                  : false
              }
              helperText={
                form.source_name == "" && inputinfoTrue.source_name
                  ? "Source Name is required"
                  : ""
              }
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
            />
          </div>
          <br />
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.source_type == "" && inputinfoTrue.source_type
                  ? true
                  : false
              }
            >
              <Autocomplete
                multiple
                options={sourceMasterList.source_name}
                getOptionLabel={(option) => (option ? option : "")}
                onChange={(event, newValue) => {
                  form.source_type = newValue;
                  setForm({ ...form });
                }}
                sx={{ width: "100%" }}
                value={form.source_type}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Source Type"
                    variant="standard"
                    onBlur={inputtrueFalse}
                    name="source_type"
                    error={
                      form.source_type == "" && inputinfoTrue.source_type
                        ? true
                        : false
                    }
                  />
                )}
              />

              {form.source_type == "" && inputinfoTrue.source_type ? (
                <FormHelperText>Source Type is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
 
          </div> */}
          <div>
            <TextField
              className="input-font-small"
              label="Source Type"
              variant="standard"
              sx={{ width: "100%" }}
              name="source_type"
              value={form.source_type}
              onBlur={inputtrueFalse}
              error={
                form.source_type == "" && inputinfoTrue.source_type
                  ? true
                  : false
              }
              helperText={
                form.source_type == "" && inputinfoTrue.source_type
                  ? "Source Type is required"
                  : ""
              }
              onChange={input}
            />
          </div>
          <br />
          <div>
            {/* <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.sales_person == "" && inputinfoTrue.sales_person
                  ? true
                  : false
              }
            >
              <InputLabel>Sales Person</InputLabel>
              <Select
                label
                className="select-font-small"
                name="sales_person"
                value={form.sales_person}
                onChange={input}
                onBlur={inputtrueFalse}
              >
                {sourceMasterList.list_salesman?.map((item) => {
                  return (
                    <MenuItem value={item.sales_person}>
                      {item.sales_person_name}
                    </MenuItem>
                  );
                })}
                {sourceMasterList.list_salesman?.map((item) => {
                  return (
                    <MenuItem value={item.sales_person}>
                      {item.sales_person_name}
                    </MenuItem>
                  );
                })}
              </Select>
              {form.sales_person == "" && inputinfoTrue.sales_person ? (
                <FormHelperText>Sales Person is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl> */}
            <Autocomplete
              options={sourceMasterList.list_salesman}
              getOptionLabel={(option) =>
                option ? option.sales_person_name : ""
              }
              onChange={(event, newValue) => {
                form.sales_person = newValue;
                setForm({ ...form });
              }}
              value={form.sales_person}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Source Person"
                  variant="standard"
                  // onBlur={inputtrueFalse}
                  name="sales_person"
                  // error={
                  //   form.sales_person == "" && inputinfoTrue.sales_person
                  //     ? true
                  //     : false
                  // }
                  // helperText={form.sales_person == "" && inputinfoTrue.sales_person ? "Sales Person is required" : ""}
                />
              )}
            />
          </div>
          <br />
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                form.url_type == "" && inputinfoTrue.url_type ? true : false
              }
            >
              <InputLabel>URL Type</InputLabel>
              <Select
                label
                className="select-font-small"
                name="url_type"
                value={form.url_type}
                onChange={input}
                onBlur={inputtrueFalse}
              >
                {sourceMasterList.url_type?.map((item) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
              {form.url_type == "" && inputinfoTrue.url_type ? (
                <FormHelperText>URL Type is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <br />
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={form.status == "" && inputinfoTrue.status ? true : false}
            >
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                value={form.status}
                onChange={input}
                onBlur={inputtrueFalse}
              >
                <MenuItem value="1">Enable</MenuItem>
                <MenuItem value="0">Disable</MenuItem>
              </Select>
              {form.status == "" && inputinfoTrue.status ? (
                <FormHelperText>Status is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add") {
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
              className="btn-success"
              onClick={addSubmit}
            >
              Create
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit") {
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
              className="btn-success"
              onClick={addSubmit}
            >
              Update
            </Button>
          )}
        </div>
      );
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

  const editLink = (e, data) => {
    setForm({
      isLoader: false,
      source_name: data.source_name,
      source_type: data.source_type,
      sales_person:
        data.sales_person && data.sales_person_name
          ? {
              sales_person: data.sales_person,
              sales_person_name: data.sales_person_name,
            }
          : "",
      url_type: data.url_type,
      status: data.status,
      id: data.id,
    });
    setinputinfoTrue({
      source_name: false,
      source_type: false,
      sales_person: false,
      url_type: false,
      status: false,
      id: false,
    });
    setDialogTitle("Edit");
    setOpen(true);
  };

  const actionMenuPopup = (e, data) => {
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
                  deleteLink(data, onClose);
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

  const deleteLink = async (data, onClose) => {
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
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    // param.append("user_id", id);
    param.append("id", data.id);
    param.append("action", "delete_campaign");
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

  const listSourceMaster = async () => {
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    // param.append("user_id", id);
    param.append("action", "list_campaign_master");
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
          setSourceMasterList({ ...res.data });
        }
      });
  };

  const addSubmit = async () => {
    if (form.source_name == "") {
      toast.error("Please enter source name");
    } else if (form.source_type == "") {
      toast.error("Please select source type");
    } else if (form.url_type == "") {
      toast.error("Please select url type");
    } else if (form.status == "") {
      toast.error("Please select status");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove != "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("url_type", form.url_type);
      if (form.sales_person) {
        if (form?.sales_person?.sales_person) {
          param.append("sales_person", form?.sales_person?.sales_person);
        }
      } else {
        param.append("sales_person", "");
      }
      param.append("source_type", form.source_type);
      param.append("source_name", form.source_name);
      param.append("status", form.status);
      if (form.id != "") {
        param.append("action", "update_campaign");
        param.append("id", form.id);
      } else {
        param.append("action", "add_campaign");
      }
      await axios
        .post(Url + "/ajaxfiles/campaign_manage.php", param)
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
            setOpen(false);
            setRefresh(!refresh);
          }
        });
    }
  };

  useEffect(() => {
    listSourceMaster();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Link</p>
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
                    {prop.permission.add_campaign == 1 ? (
                      <Button
                        variant="contained"
                        className="add"
                        onClick={openDialogbox}
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
                          url={`${Url}/datatable/campaign_list.php`}
                          column={column}
                          sort="1"
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          refresh={refresh}
                          setResData={setResData}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
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

export default Link;
