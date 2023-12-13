import "./leads.css";
import React, { useState, useEffect, useRef } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonTable from "../common/CommonTable";
import TextField from "@mui/material/TextField";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CommonFilter from "../common/CommonFilter";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClientUrl, IsApprove, Url } from "../global";
import axios from "axios";
import NewDate from "../common/NewDate";
import { ColorButton } from "../common/CustomElement";
import { TabContext, TabList, TabPanel } from "@mui/lab";

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

const Leads = (prop) => {
  const { id, id1 } = useParams();
  const theme = useTheme();
  const LeadRef = useRef();
  const [checkStatus, setcheckStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const navigate = useNavigate();
  const [resData, setResData] = useState({});
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterDate, setFilterDate] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
  const [columnTrue, setColumnTrue] = useState([]);
  const [Crefresh, setCrefresh] = useState(true);
  const [LArefresh, setLArefresh] = useState(true);
  const [value, setValue] = React.useState("1");
  const [mangeClassHide, setMangeClassHide] = useState(false);
  const [filterData, setFilterData] = useState();
  const [dialogTitle, setDialogTitle] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [param, setParam] = useState({});
  const [callParam, setCallParam] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [listManagers, setListManagers] = useState([]);
  const [bulkLoader, setBulkLoader] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_mobile: "",
    customer_email: "",
    customer_address: "",
    source_id: "",
    source_desc: "",
    interest: "",
    assign: {},
    date: "",
    time: "",
    remark: "",
    customer_country: {},
    isCustomerSendMail: true,
    isCustomerSendsms: true,
    isAssignSendsms: false,
    isAdminSendsms: false,
    isLoader: false,
  });
  const [CreateAccount, setCreateAccount] = useState({
    customer_name: "",
    customer_mobile: "",
    customer_email: "",
    customer_country: "",
    user_password: "",
    acc_type: "",
    bal: "",
    ib_group_id: "",
    treding_passowrd: "",
    listIBg: [],
    isLoader: false,
    inquiry_id: "",
    popLoader: "",
  });
  const [CreateAccountTrue, setCreateAccountTrue] = useState({
    customer_name: false,
    customer_mobile: false,
    customer_email: false,
    customer_country: false,
    user_password: false,
    acc_type: false,
    treding_passowrd: false,
    bal: false,
    ib_group_id: false,
    isLoader: false,
    inquiry_id: false,
  });

  const [editLead, setEditLead] = useState({
    customer_name: "",
    customer_mobile: "",
    customer_email: "",
    customer_address: "",
    customer_country: "",
    source_id: "",
    inquiry_id: "",
    isLoader: false,
  });
  const [editTrueFalse, SeteditTrueFalse] = useState({
    customer_name: false,
    customer_mobile: false,
    customer_email: false,
    customer_address: false,
    source_id: false,
    source_desc: false,
    interest: false,
    assign: false,
    date: false,
    time: false,
    remark: false,
    customer_country: false,
  });
  const [reminderAdd, setReminderAdd] = useState({
    inquiry_id: "",
    notes: "",
    followup_date: "",
    followup_time: "",
    isLoader: false,
    popLoader: true,
  });
  const [reminderTrue, setReminderTrue] = useState({
    notes: false,
    followup_date: false,
    followup_time: false,
    isLoader: false,
  });
  const [activityAdd, setActivityAdd] = useState({
    inquiry_id: "",
    notes: "",
    main_status: "",
    InquiryStatusList: {},
    sub_status: "",
    isLoader: false,
    popLoader: true,
  });
  const [activityTrue, setActivityTrue] = useState({
    notes: false,
    followup_date: false,
    notes: false,
    main_status: false,
    sub_status: false,
    followup_time: false,
    isLoader: false,
  });
  const [inputinfoTrue, setinputinfoTrue] = useState({
    customer_name: false,
    customer_mobile: false,
    customer_email: false,
    customer_address: false,
    source_id: false,
    source_desc: false,
    interest: false,
    assign: false,
    date: false,
    time: false,
    remark: false,
    customer_country: false,
  });
  const [newFollowupForm, setNewFollowupForm] = useState({
    date: "",
    time: "",
    interest: "",
    remark: "",
    inquiry_id: "",
    lead_assign_user_id: "",
    isCustomerSendsms: true,
    isAssignSendsms: false,
    isAdminSendsms: false,
    isLoader: false,
  });
  const [leadDetails, setLeadDetails] = useState({
    inquiry_id: "",
    InquiryStatusList: {},
    customer_name: "",
    customer_mobile: "",
    customer_email: "",
    source_id: "",
    followup: "",
    lead_added: "",
    lead_added_by: "",
    reference: "",
    mt5_ac: "",
    demo_ac: "",
    whatsapp_link: "",
    spin_ac: "",
    customer_country: "",
    leads_stage: "",
    popLoader: "",
    last_remarks: "",
  });
  const [cpData, setCpData] = useState({
    cp_access: "",
    demo_mt5: "",
    isLoader: "",
    refresh: false,
    ibCommissionGroupList: [],
    ib_group_id: "0",
  });
  const [doc, setDoc] = useState({
    file: "",
  });
  const [soure, setSoure] = useState([]);
  const [searchBy, setSearchBy] = useState([
    {
      label: "Customer",
      value: false,
      name: "customer_name",
    },
    {
      label: "Interest",
      value: false,
      name: "interest",
    },
    {
      label: "Remark",
      value: false,
      name: "remarks",
    },
  ]);
  toast.configure();
  const interest = ["Very Low", "Low", "Average", "High", "Very High"];
  var csvData = `Customer Name, Customer Mobile, Customer Email, Customer Address, Customer Country, Source, Source Description, Assign To Sales Executive, Follow Up Date, Follow Up Time, Remark
  Demo, 1234567890, demo@gmail.com, 000 demo society demo Nager Near demo market demo., India,  Web, test, 7475717273, 11-05-2022, 01:51 PM, Test
  Demo 1, 0987654321, demo1@gmail.com, 0 demo1 society demo1 Nager Near demo1 market demo1., India, Banner, test, 7475717273, 11-05-2022, 01:51 PM, Test`;
  const handleModalClose = () => {
    setMangeClassHide(false);
  };
  const getcontry = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    axios.post(Url + "/datatable/get_countries.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        // toast.error(res.data.message);
      } else {
        setCountryData(res.data.aaData);
      }
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const getInquiryStatus = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_inquiry_status");
    activityAdd.popLoader = true;

    setActivityAdd({ ...activityAdd });
    axios.post(Url + "/ajaxfiles/lead_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        // toast.error(res.data.message);
      } else {
        setActivityAdd({
          inquiry_id: "",
          notes: "",
          main_status: "",
          sub_status: "",
          isLoader: false,
          popLoader: false,
        });
        setActivityTrue({
          notes: false,
          main_status: false,
          sub_status: false,
          isLoader: false,
        });
        // activityAdd.InquiryStatusList = res.data.data;
        // activityAdd.popLoader = false;

        // setActivityAdd({ ...activityAdd });
        // setCountryData(res.data.aaData);
      }
    });
  };
  const fatchIbGroup = (row) => {
    CreateAccount.popLoader = true;
    setCreateAccount({ ...CreateAccount });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_mt5_default_group");

    axios.post(Url + "/ajaxfiles/lead_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        CreateAccount.popLoader = false;
        setCreateAccount({ ...CreateAccount });

        // toast.error(res.data.message);
      } else {
        let test = countryData.filter(
          (x) => x.nicename == row.customer_country
        )[0];
        setCreateAccount({
          customer_name: row.customer_name,
          customer_mobile: row.customer_mobile,
          customer_email: row.customer_email,
          customer_country: test ? test : "",
          user_password: "",
          acc_type: "",
          bal: "",
          ib_group_id: "",
          treding_passowrd: "",
          listIBg: res.data.data,
          isLoader: false,
          inquiry_id: row.inquiry_id,
          popLoader: false,
        });
        setCreateAccountTrue({
          customer_name: false,
          customer_mobile: false,
          customer_email: false,
          customer_country: false,
          user_password: false,
          acc_type: false,
          treding_passowrd: false,
          bal: false,
          ib_group_id: false,
          isLoader: false,
          inquiry_id: false,
        });
      }
    });
  };
  const getListManagers = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_managers");

    await axios
      .post(Url + "/ajaxfiles/change_lead_data.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          setPageLoader(false);

          // toast.error(res.data.message);
        } else {
          setPageLoader(false);
          setListManagers(res.data.managers);
          setSoure(res.data.inquiry_source_master);
        }
      });
  };

  useEffect(() => {
    if (
      prop?.permission?.add_reminder == "1" &&
      prop?.permission?.add_call_history == "0"
    ) {
      setValue("2");
    }
    getListManagers();

    getcontry();
    if (id && !id1) {
      setFilterDate({ filter: id });
    }
    if (id && id1) {
      setFilterDate({ [id]: [id1] });
    }
  }, []);

  const handleClickOpen = (e) => {
    setForm({
      customer_name: "",
      customer_mobile: "",
      customer_email: "",
      customer_address: "",
      source_id: "",
      source_desc: "",
      interest: "",
      assign: listManagers.length == 1 ? listManagers[0] : "",
      date: "",
      time: "",
      remark: "",
      customer_country: "",
      isCustomerSendMail: true,
      isCustomerSendsms: true,
      isAssignSendsms: false,
      isAdminSendsms: false,
      isLoader: false,
    });
    setinputinfoTrue({
      customer_name: false,
      customer_mobile: false,
      customer_email: false,
      customer_address: false,
      source_id: false,
      source_desc: false,
      interest: false,
      assign: false,
      date: false,
      time: false,
      remark: false,
      customer_country: false,
    });
    setDialogTitle("Add Lead");
    setMaxWidth("md");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const gotoProfile = (e) => {
    navigate("/profile/" + e.user_id);
  };
  const viewFollowup1 = (e) => {
    leadDetails.popLoader = true;
    setLeadDetails({ ...leadDetails });
    const param1 = new FormData();
    if (IsApprove !== "") {
      param1.append("is_app", IsApprove.is_app);
      param1.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param1.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param1.append("action", "view_lead");
    param1.append("inquiry_id", e);

    axios.post(Url + "/ajaxfiles/lead_manage.php", param1).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        // setPageLoader(false);
        // toast.error(res.data.message);
      } else {
        setLeadDetails({
          inquiry_id: e.inquiry_id,
          InquiryStatusList: resData?.status_data ? resData?.status_data : {},
          customer_name: res.data.data.customer_name,
          customer_mobile: res.data.data.customer_mobile,
          customer_email: res.data.data.customer_email,
          source_id: res.data.data.source,
          followup: res.data.data.followup_date,
          lead_added: res.data.data.added_datetime,
          lead_added_by: res.data.data.lead_assign_user_name,
          mt5_ac: res.data.data.mt5_ac,
          whatsapp_link: res.data.data.whatsapp_link,
          demo_ac: res.data.data.demo_ac,
          spin_ac: res.data.data.spin_ac,
          customer_country: res.data.data.customer_country,
          leads_stage: res.data.data?.leads_stage,
          popLoader: false,
          last_remarks: res.data.data?.last_remarks,

          reference: "",
        });
      }
    });
  };
  const viewFollowup = (e) => {
    setNewFollowupForm({
      date: "",
      time: "",
      interest: "",
      remark: "",
      inquiry_id: e.inquiry_id,
      lead_assign_user_id: e.lead_assign_user_id,
      isCustomerSendsms: true,
      isAssignSendsms: false,
      isAdminSendsms: false,
      isLoader: false,
    });
    leadDetails.popLoader = true;
    setLeadDetails({ ...leadDetails });

    setParam({ ...param, inquiry_id: e.inquiry_id });
    setCallParam({ inquiry_id: e.inquiry_id });
    setDialogTitle("View Lead (" + e.customer_name + ")");
    setActivityAdd({
      inquiry_id: "",
      notes: "",
      main_status: "",
      sub_status: "",
      isLoader: false,
      popLoader: true,
    });
    setActivityTrue({
      notes: false,
      followup_date: false,
      notes: false,
      main_status: false,
      sub_status: false,
      followup_time: false,
      isLoader: false,
    });
    setMaxWidth("lg");
    setOpen(true);
    const param1 = new FormData();
    if (IsApprove !== "") {
      param1.append("is_app", IsApprove.is_app);
      param1.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param1.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param1.append("action", "view_lead");
    param1.append("inquiry_id", e.inquiry_id);

    axios.post(Url + "/ajaxfiles/lead_manage.php", param1).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        // setPageLoader(false);
        // toast.error(res.data.message);
      } else {
        setLeadDetails({
          inquiry_id: e.inquiry_id,
          InquiryStatusList: resData?.status_data ? resData?.status_data : {},
          customer_name: res.data.data.customer_name,
          customer_mobile: res.data.data.customer_mobile,
          customer_email: res.data.data.customer_email,
          source_id: res.data.data.source,
          followup: res.data.data.followup_date,
          lead_added: res.data.data.added_datetime,
          lead_added_by: res.data.data.lead_assign_user_name,
          mt5_ac: res.data.data.mt5_ac,
          whatsapp_link: res.data.data.whatsapp_link,
          demo_ac: res.data.data.demo_ac,
          spin_ac: res.data.data.spin_ac,
          customer_country: res.data.data.customer_country,
          leads_stage: res.data.data?.leads_stage,
          popLoader: false,
          last_remarks: res.data.data?.last_remarks,
          reference: "",
        });
      }
    });
  };
  const manageDialogActionButton = () => {
    if (dialogTitle == "Add Lead") {
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
              onClick={submitForm}
            >
              Add Lead
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Are you sure?") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {cpData.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success addbankloder"
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
              onClick={completeLead}
            >
              Complete Lead
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == `View Lead (${leadDetails.customer_name})`) {
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
          {editLead.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success addbankloder"
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
              onClick={editSubmit}
            >
              Edit
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Create Account") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {CreateAccount.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success addbankloder"
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
              onClick={CreateSubmit}
            >
              Create Account
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add Reminder") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={() => {
              setDialogTitle(`View Lead (${leadDetails.customer_name})`);
            }}
          >
            Cancel
          </Button>
          {reminderAdd.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success addbankloder"
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
              onClick={reminderSubmit}
            >
              ADD
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add Call Activity") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={() => {
              setDialogTitle(`View Lead (${leadDetails.customer_name})`);
            }}
          >
            Cancel
          </Button>
          {activityAdd.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success addbankloder"
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
              onClick={activityrSubmit}
            >
              ADD
            </Button>
          )}
        </div>
      );
    }
  };

  const activityrSubmit = async () => {
    if (activityAdd.main_status == "") {
      toast.error("Main Status is required");
    } else if (activityAdd.sub_status == "") {
      toast.error("Sub Status is required");
    } else {
      activityAdd.isLoader = true;
      setActivityAdd({ ...activityAdd });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("inquiry_id", leadDetails.inquiry_id);
      param.append("notes", activityAdd.notes);
      param.append("sub_status", activityAdd.sub_status);
      param.append("main_status", activityAdd.main_status);

      param.append("action", "add_call_history");
      // param.append('cp_access', editLead.cp_access);
      // param.append('demo_mt5', editLead.create_demo_mt5);
      await axios
        .post(`${Url}/ajaxfiles/lead_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          activityAdd.isLoader = false;
          setActivityAdd({ ...activityAdd });
          if (res.data.status == "error") {
            toast.error(res.data.message);
            activityAdd.isLoader = false;
            setActivityAdd({ ...activityAdd });
          } else {
            // activityAdd.isLoader = false;
            // setActivityAdd({ ...activityAdd });
            setCrefresh(!Crefresh);
            cpData.refresh = !cpData.refresh;
            setCpData({ ...cpData });
            setLArefresh(!LArefresh);
            setReminderAdd({
              inquiry_id: "",
              notes: "",
              followup_date: "",
              followup_time: "",
              isLoader: false,
            });
            setReminderTrue({
              notes: false,
              followup_date: false,
              followup_time: false,
              isLoader: false,
            });
            setActivityAdd({
              inquiry_id: "",
              notes: "",
              main_status: "",
              sub_status: "",
              isLoader: false,
              popLoader: true,
            });
            setActivityTrue({
              notes: false,
              followup_date: false,
              notes: false,
              main_status: false,
              sub_status: false,
              followup_time: false,
              isLoader: false,
            });
            viewFollowup1(leadDetails.inquiry_id);

            toast.success(res.data.message);
            // setDialogTitle(`View Lead (${leadDetails.customer_name})`);
          }
        });
    }
  };
  const reminderSubmit = async () => {
    if (reminderAdd.followup_date == "") {
      toast.error("Follow Up Date is required");
    } else if (reminderAdd.followup_time == "") {
      toast.error("Follow Up Date is required");
    } else {
      reminderAdd.isLoader = true;
      setReminderAdd({ ...reminderAdd });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("inquiry_id", leadDetails.inquiry_id);
      param.append("notes", reminderAdd.notes);
      param.append("followup_date", reminderAdd.followup_date);
      param.append("followup_time", reminderAdd.followup_time);

      param.append("action", "add_reminder");
      // param.append('cp_access', editLead.cp_access);
      // param.append('demo_mt5', editLead.create_demo_mt5);
      await axios
        .post(`${Url}/ajaxfiles/lead_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }

          if (res.data.status == "error") {
            reminderAdd.isLoader = false;
            setReminderAdd({ ...reminderAdd });
            toast.error(res.data.message);
          } else {
            cpData.refresh = !cpData.refresh;
            setCpData({ ...cpData });
            setLArefresh(!LArefresh);
            setRefresh(!refresh);
            setReminderAdd({
              inquiry_id: "",
              notes: "",
              followup_date: "",
              followup_time: "",
              isLoader: false,
            });
            setReminderTrue({
              notes: false,
              followup_date: false,
              followup_time: false,
              isLoader: false,
            });
            // reminderAdd.isLoader = false;
            // setReminderAdd({ ...reminderAdd });
            viewFollowup1(leadDetails.inquiry_id);
            toast.success(res.data.message);
            // setDialogTitle(`View Lead (${leadDetails.customer_name})`);
          }
        });
    }
  };
  const CreateSubmit = async () => {
    if (CreateAccount.customer_name == "") {
      toast.error("Please enter customer name");
    } else if (CreateAccount.customer_mobile == "") {
      toast.error("Please enter customer mobile");
    } else if (
      CreateAccount.customer_mobile.toString().length < 4 ||
      CreateAccount.customer_mobile.toString().length > 12
    ) {
      toast.error("Mobile Number is not valid");
    } else if (CreateAccount.customer_email == "") {
      toast.error("Please enter customer email");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        CreateAccount.customer_email
      )
    ) {
      toast.error("Enter a valid customer email");
    } else if (!CreateAccount.customer_country) {
      toast.error("Please enter customer country");
    } else if (!CreateAccount.user_password) {
      toast.error("Please enter User Password");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        CreateAccount.user_password
      )
    ) {
      toast.error(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character in User Password"
      );
    } else if (!CreateAccount.acc_type) {
      toast.error("Account Type is required");
    } else if (CreateAccount.acc_type == 1 && CreateAccount.ib_group_id == "") {
      toast.error("Account option is required");
    } else if (CreateAccount.acc_type == 0 && CreateAccount.bal == "") {
      toast.error("Account option is required");
    } else if (!CreateAccount.treding_passowrd) {
      toast.error("Please enter Trading Password");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        CreateAccount.treding_passowrd
      )
    ) {
      toast.error(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character in Trading Password"
      );
    } else {
      CreateAccount.isLoader = true;
      setCreateAccount({ ...CreateAccount });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("inquiry_id", CreateAccount.inquiry_id);
      param.append("customer_name", CreateAccount.customer_name);
      param.append("customer_mobile", CreateAccount.customer_mobile);
      param.append("customer_email", CreateAccount.customer_email);
      param.append("account_type", CreateAccount.acc_type);
      param.append("user_password", CreateAccount.user_password);
      param.append("trading_password", CreateAccount.treding_passowrd);
      if (CreateAccount.acc_type == 0) {
        param.append("demo_balance", CreateAccount.bal);
      } else {
        param.append("ib_group_id", CreateAccount.ib_group_id);
      }

      param.append("action", "create_account");
      // param.append('cp_access', CreateAccount.cp_access);
      // param.append('demo_mt5', CreateAccount.create_demo_mt5);
      param.append(
        "customer_country",
        CreateAccount?.customer_country?.nicename
          ? CreateAccount?.customer_country?.nicename
          : ""
      );
      await axios
        .post(`${Url}/ajaxfiles/lead_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          CreateAccount.isLoader = false;
          setCreateAccount({ ...CreateAccount });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setCpData((preValue) => {
              return {
                ...preValue,
                refresh: !cpData.refresh,
              };
            });
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };
  const editSubmit = async () => {
    // if (editLead.customer_name == "") {
    //   toast.error("Please enter customer name");
    // } else if (editLead.customer_mobile == "") {
    //   toast.error("Please enter customer mobile");
    // } else if (editLead.customer_email == "") {
    //   toast.error("Please enter customer email");
    // } else if (
    //   !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    //     editLead.customer_email
    //   )
    // ) {
    //   toast.error("Enter a valid customer email");
    // } else if (editLead.customer_address == "") {
    //   toast.error("Please enter customer address");
    // } else if (editLead.source_id == "") {
    //   toast.error("Please select source");
    // }
    if (editLead.customer_mobile == "" && editLead.customer_email == "") {
      toast.error("Please enter Email or Moblie");
    } else if (
      editLead.customer_email &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        editLead.customer_email
      )
    ) {
      toast.error("Enter a valid email");
    } else if (
      editLead.customer_mobile &&
      (editLead.customer_mobile.toString().length < 4 ||
        editLead.customer_mobile.toString().length > 12)
    ) {
      toast.error("Mobile Number is not valid");
    } else {
      editLead.isLoader = true;
      setForm({ ...editLead });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("inquiry_id", editLead.inquiry_id);
      param.append("customer_name", editLead.customer_name);
      param.append("customer_mobile", editLead.customer_mobile);
      param.append("customer_email", editLead.customer_email);
      param.append("customer_address", editLead.customer_address);
      param.append("source_id", editLead.source_id);
      param.append("action", "edit_lead");
      // param.append('cp_access', editLead.cp_access);
      // param.append('demo_mt5', editLead.create_demo_mt5);
      param.append(
        "customer_country",
        editLead?.customer_country?.nicename
          ? editLead?.customer_country?.nicename
          : ""
      );
      await axios
        .post(`${Url}/ajaxfiles/lead_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          editLead.isLoader = false;
          setEditLead({ ...editLead });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setCpData((preValue) => {
              return {
                ...preValue,
                refresh: !cpData.refresh,
              };
            });
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const completeLead = () => {
    if (cpData.cp_access == "") {
      toast.error("Select Cp Access");
    } else if (cpData.cp_access == "1" && cpData.demo_mt5 == "") {
      toast.error("Select Demo Account");
    } else if (
      cpData.cp_access == "1" &&
      cpData.demo_mt5 == "1" &&
      cpData.user_password == ""
    ) {
      toast.error("Enter Password");
    } else {
      const param = new FormData();
      setCpData((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      }
      param.append("cp_access", cpData.cp_access);
      param.append("leads_status", "1");
      param.append("inquiry_id", cpData.inquiry_id);
      if (cpData.cp_access == "1") {
        param.append("demo_mt5", cpData.demo_mt5);
      }
      if (cpData.cp_access == "1" && cpData.demo_mt5 == "1") {
        param.append("ib_group_id", cpData.ib_group_id);
      }
      if (
        cpData.cp_access == "1" &&
        cpData.demo_mt5 == "1" &&
        cpData.ib_group_id != "0"
      ) {
        param.append("user_password", cpData.user_password);
      }
      axios
        .post(Url + "/ajaxfiles/update_lead_status.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            setCpData((preValue) => {
              return {
                ...preValue,
                isLoader: false,
              };
            });
            toast.error(res.data.message);
          } else {
            setCpData((preValue) => {
              return {
                ...preValue,
                isLoader: false,
                refresh: !cpData.refresh,
              };
            });
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  // const rejectedLead = (data) => {
  //   setCpData((preValue) => {
  //     return {
  //       ...preValue,
  //       isLoader: true,
  //     };
  //   });
  //   const param = new FormData();
  //   if (IsApprove !== "") {
  //     param.append("is_app", IsApprove.is_app);
  //     param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
  //     param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
  //   }
  //   param.append("cp_access", "");
  //   param.append("leads_status", "2");
  //   param.append("inquiry_id", data.inquiry_id);
  //   axios.post(Url + "/ajaxfiles/update_lead_status.php", param).then((res) => {
  //     if (res.data.message == "Session has been expired") {
  //       localStorage.setItem("login", true);
  //       navigate("/");
  //       return;
  //     }
  //     setCpData((preValue) => {
  //       return {
  //         ...preValue,
  //         isLoader: false,
  //       };
  //     });
  //     if (res.data.status == "error") {
  //       toast.error(res.data.message);
  //     } else {
  //       setCpData((preValue) => {
  //         return {
  //           ...preValue,
  //           isLoader: false,
  //           refresh: !cpData.refresh,
  //         };
  //       });
  //       toast.success(res.data.message);
  //     }
  //   });
  // };
  const componentLead = (data, flag, remark) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }

    param.append("action", "reminder_change_complete_status");

    param.append("inquiry_id", data.inquiry_id);
    param.append("reminder_id", data.followup_id);

    axios.post(Url + "/ajaxfiles/lead_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }

      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        cpData.refresh = !cpData.refresh;
        setCpData({ ...cpData });
        setLArefresh(!LArefresh);
        setRefresh(!refresh);
        toast.success(res.data.message);
      }
    });
  };
  const rejectDelete = (data, flag, remark, onClose) => {
    if (flag == "remove_lead" && !remark) {
      toast.error("Please enter remarks");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      document.getElementById("loder1").classList.add("MyClassLoder");
      var button = document.getElementById("loder1");

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

      param.append("action", flag);

      if (flag == "remove_lead") {
        param.append("remove_remarks", remark);
      }
      param.append("inquiry_id", data.inquiry_id);
      axios.post(Url + "/ajaxfiles/lead_manage.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }

        if (res.data.status == "error") {
          toast.error(res.data.message);
          document.getElementById("loder1").classList.remove("MyClassLoder");
          var button = document.getElementById("loder1");

          // Disable the button
          button.disabled = false;
          button.innerHTML =
            flag == "remove_lead" ? `Yes, Remove it!` : "Yes, Delete it!";
        } else {
          onClose();

          cpData.refresh = !cpData.refresh;
          setCpData({ ...cpData });
          toast.success(res.data.message);
        }
      });
    }
  };
  const manageContent = () => {
    if (dialogTitle == "Add Lead") {
      return (
        <div>
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Customer Name"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="customer_name"
              value={form.customer_name}
              // onChange={input}
              // error={
              //   form.customer_name == "" && inputinfoTrue.customer_name
              //     ? true
              //     : false
              // }
              // helperText={
              //   form.customer_name == "" && inputinfoTrue.customer_name
              //     ? "Customer Name is required"
              //     : ""
              // }
              onBlur={inputtrueFalse}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  /^[A-Za-z_ ]*$/.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
            />
            <TextField
              type="text"
              label="Customer Mobile"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              onBlur={inputtrueFalse}
              name="customer_mobile"
              // onChange={input}
              // error={
              //   form.customer_mobile == "" && inputinfoTrue.customer_mobile
              //     ? true
              //     : false
              // }
              // helperText={
              //   form.customer_mobile == "" && inputinfoTrue.customer_mobile
              //     ? "Customer Mobile is required"
              //     : ""
              // }
              value={form.customer_mobile}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  /^[0-9]*$/.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  input(e);
                }
              }}
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Customer Email"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              // helperText={
              //   form.customer_email == "" && inputinfoTrue.customer_email
              //     ? "Email is required"
              //     : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              //         form.customer_email
              //       ) && inputinfoTrue.customer_email
              //     ? "Enter a valid email"
              //     : ""
              // }
              // error={
              //   (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              //     form.customer_email
              //   ) ||
              //     form.customer_email == "") &&
              //   inputinfoTrue.customer_email == true
              //     ? true
              //     : false
              // }
              onBlur={inputtrueFalse}
              name="customer_email"
              onChange={input}
            />
            <TextField
              type="text"
              label="Customer Address"
              multiline
              variant="standard"
              // error={
              //   form.customer_address == "" && inputinfoTrue.customer_address
              //     ? true
              //     : false
              // }
              // helperText={
              //   form.customer_address == "" && inputinfoTrue.customer_address
              //     ? "Customer Address is required"
              //     : ""
              // }
              sx={{ width: "100%" }}
              focused
              onBlur={inputtrueFalse}
              name="customer_address"
              onChange={input}
            />
          </div>
          <br />
          <div className="element margeTwoField">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              focused
              // error={
              //   form.source_id == "" && inputinfoTrue.source_id ? true : false
              // }
            >
              <InputLabel id="demo-simple-select-standard-label">
                Source
              </InputLabel>
              <Select
                onChange={input}
                label="Source"
                name="source_id"
                onBlur={inputtrueFalse}
              >
                {soure.map((item) => {
                  return (
                    <MenuItem value={item.source_id}>{item.name}</MenuItem>
                  );
                })}
              </Select>
              {/* {form.source_id == "" && inputinfoTrue.source_id ? (
                <FormHelperText>Source is required</FormHelperText>
              ) : (
                ""
              )} */}
            </FormControl>
            <TextField
              type="text"
              label="Source Description"
              multiline
              variant="standard"
              sx={{ width: "100%" }}
              focused
              // error={
              //   form.source_desc == "" && inputinfoTrue.source_desc
              //     ? true
              //     : false
              // }
              // helperText={
              //   form.source_desc == "" && inputinfoTrue.source_desc
              //     ? "Source Description is required"
              //     : ""
              // }
              onBlur={inputtrueFalse}
              name="source_desc"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <Autocomplete
              options={countryData}
              value={form.customer_country}
              getOptionLabel={(option) => (option ? option.nicename : "")}
              onChange={(event, newValue) => {
                form.customer_country = newValue;
                setForm({ ...form });
              }}
              className="w-100"
              renderInput={(params) => (
                <TextField {...params} label="Country" variant="standard" />
              )}
            />
            <Autocomplete
              options={listManagers}
              value={form.assign}
              getOptionLabel={(option) => (option ? option.manager_name : "")}
              onChange={(event, newValue) => {
                form.assign = newValue;
                setForm({ ...form });
              }}
              className="w-100"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign To Sales-Executive"
                  variant="standard"
                />
              )}
            />
          </div>
          <br />
          <div className="element margeTwoField">
            <TextField
              type="date"
              label="Follow Up Date"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              onBlur={inputtrueFalse}
              // error={form.date == "" && inputinfoTrue.date ? true : false}
              // helperText={
              //   form.date == "" && inputinfoTrue.date
              //     ? "Follow Up Date is required"
              //     : ""
              // }
              name="date"
              onChange={input}
            />
            <TextField
              type="time"
              label="Follow Up Time"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              onBlur={inputtrueFalse}
              name="time"
              // error={form.time == "" && inputinfoTrue.time ? true : false}
              // helperText={
              //   form.time == "" && inputinfoTrue.time
              //     ? "Follow Up Time is required"
              //     : ""
              // }
              onChange={input}
            />
          </div>
          <br />
          <div className="element">
            <br />
            <TextField
              label="Remarks"
              multiline
              variant="standard"
              focused
              onBlur={inputtrueFalse}
              sx={{ width: "100%" }}
              name="remark"
              onChange={input}
            />
          </div>
          <br />
          {/* <div className='element margeTwoField'>
          <FormControl variant="standard" sx={{ width: '100%' }} focused>
            <InputLabel id="demo-simple-select-standard-label">CP Access</InputLabel>
            <Select
              onChange={input}
              label="CP Access"
              name='cp_access'
              value={form.cp_access}
            >
              <MenuItem value="1">Yes</MenuItem>
              <MenuItem value="0">No</MenuItem>
            </Select>
          </FormControl>
          {(form.cp_access == '1') ? <FormControl variant="standard" sx={{ width: '100%' }} focused>
            <InputLabel id="demo-simple-select-standard-label">Create Demo MT5</InputLabel>
            <Select
              onChange={input}
              label="Create Demo MT5"
              name='create_demo_mt5'
              value={form.create_demo_mt5}
            >
              <MenuItem value="1">Yes</MenuItem>
              <MenuItem value="0">No</MenuItem>
            </Select>
          </FormControl> : ''}

        </div> */}
          {/* <br />
        <div className='element margeTwoField'>
          <div className='checkboxSection' style={{ width: '100%' }}>
            <label>Do you want to send project details to Customer?</label>
            <FormControlLabel control={<Checkbox defaultChecked size="small" name='isCustomerSendMail' onChange={input} />} label="Send Mail?" />
          </div>
          <div className='checkboxSection' style={{ width: '100%' }}>
            <label>Please select user type to send SMS.</label>
            <div className='checkbox-group'>
              <FormControlLabel control={<Checkbox defaultChecked size="small" name='isCustomerSendsms' onChange={input} />} label="Client" />
              <FormControlLabel control={<Checkbox size="small" name='isAssignSendsms' onChange={input} />} label="Sales-Executive" />
              <FormControlLabel control={<Checkbox size="small" name='isAdminSendsms' onChange={input} />} label="Admin" />
            </div>
          </div>
        </div> */}
        </div>
      );
    } else if (dialogTitle.substring(0, 9) == "View Lead") {
      // minDate
      var today = new Date();

      var dateInput = document.getElementById("myDateInput");
      var year = today.getFullYear();
      var month = String(today.getMonth() + 1).padStart(2, "0");
      var day = String(today.getDate()).padStart(2, "0");
      // Set the desired minimum date value
      var minDate = year + "-" + month + "-" + day;
      return (
        <>
          {leadDetails.popLoader == true ? (
            <div
              className="leadpoplodercenter"
              style={{ margin: "30px 0px !important" }}
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
            </div>
          ) : (
            <div>
              <div
                style={{
                  marginBottom: "23px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Paper
                  elevation={2}
                  style={{
                    borderRadius: "10px",
                    height: "100%",
                    background: "#008000",
                    width: "auto",
                  }}
                  className="pending-all-15px"
                >
                  <div className="user-details">
                    <label style={{ fontWeight: "700", color: "white" }}>
                      Leads Stage:
                    </label>
                    <p style={{ color: "white", marginBottom: "0" }}>
                      {leadDetails?.leads_stage
                        ? leadDetails?.leads_stage
                        : "-"}
                    </p>
                  </div>
                </Paper>
                <div>
                  <ColorButton
                    sx={{ marginLeft: "10px", marginTop: "10px" }}
                    onClick={() => {
                      window.open(leadDetails.whatsapp_link, "_blank");
                    }}
                  >
                    Whatsapp
                  </ColorButton>
                  <ColorButton
                    sx={{ marginLeft: "10px", marginTop: "10px" }}
                    onClick={() => {
                      window.open(
                        `mailto:${leadDetails.customer_email}`,
                        "_blank"
                      );
                    }}
                  >
                    Email
                  </ColorButton>
                </div>
              </div>

              <Grid container spacing={3}>
                <Grid
                  item
                  md={
                    prop?.permission?.add_reminder == "1" ||
                    prop?.permission?.add_call_history == "1"
                      ? 6
                      : 12
                  }
                  lg={
                    prop?.permission?.add_reminder == "1" ||
                    prop?.permission?.add_call_history == "1"
                      ? 6
                      : 12
                  }
                  xl={
                    prop?.permission?.add_reminder == "1" ||
                    prop?.permission?.add_call_history == "1"
                      ? 6
                      : 12
                  }
                  sm={12}
                >
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px", height: "100%" }}
                    className="pending-all-15px"
                  >
                    <p className="view-lead-popup-header-title">Lead Details</p>
                    <div className="popup-content-section">
                      <div className="user-details">
                        <label>Customer Name:</label>
                        <p>{leadDetails.customer_name}</p>
                      </div>
                      <div className="user-details">
                        <label>Source:</label>
                        <p>{leadDetails.source_id}</p>
                      </div>
                      <div className="user-details">
                        <label>Customer Mobile:</label>
                        <p>{leadDetails.customer_mobile}</p>
                      </div>
                      <div className="user-details">
                        <label>Customer Email:</label>
                        <p>{leadDetails.customer_email}</p>
                      </div>
                      <div className="user-details">
                        <label>Lead Added By:</label>
                        <p>{leadDetails.lead_added_by}</p>
                      </div>
                      <div className="user-details">
                        <label>Lead Added:</label>
                        <p>{leadDetails.lead_added}</p>
                      </div>
                      <div className="user-details">
                        <label>Current Followup:</label>
                        <p>{leadDetails.followup}</p>
                      </div>
                      <div className="user-details">
                        <label>Last Remarks:</label>
                        <p>
                          {leadDetails?.last_remarks
                            ? leadDetails?.last_remarks
                            : "-"}
                        </p>
                      </div>
                      <div className="user-details">
                        <label>MT5 Account:</label>
                        <p>{leadDetails?.mt5_ac ? leadDetails?.mt5_ac : "-"}</p>
                      </div>

                      <div className="user-details">
                        <label>Demo Account:</label>
                        <p>
                          {leadDetails?.demo_ac ? leadDetails?.demo_ac : "-"}
                        </p>
                      </div>

                      <div className="user-details">
                        <label>Spin Account:</label>
                        <p>
                          {leadDetails?.spin_ac ? leadDetails?.spin_ac : "-"}
                        </p>
                      </div>

                      <div className="user-details">
                        <label>Country:</label>
                        <p>
                          {leadDetails?.customer_country
                            ? leadDetails?.customer_country
                            : "-"}
                        </p>
                      </div>

                      <div className="user-details">
                        <label>Leads Stage:</label>
                        <p>
                          {leadDetails?.leads_stage
                            ? leadDetails?.leads_stage
                            : "-"}
                        </p>
                      </div>

                      {/* <div className='user-details'>
                  <label>Reference:</label>
                  <p>{leadDetails.reference}</p>
                </div> */}
                    </div>
                  </Paper>
                </Grid>
                {prop?.permission?.add_reminder == "1" ||
                prop?.permission?.add_call_history == "1" ? (
                  <Grid item md={6} lg={6} xl={6} sm={12}>
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px", height: "100%" }}
                      className="pending-all-15px"
                    >
                      <Box sx={{ width: "100%", typography: "body1" }}>
                        <TabContext value={value}>
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                              onChange={handleChange}
                              aria-label="lab API tabs example"
                            >
                              {prop?.permission?.add_call_history == "1" ? (
                                <Tab label="Add Call Activity" value="1" />
                              ) : (
                                ""
                              )}
                              {prop?.permission?.add_reminder == "1" ? (
                                <Tab label="Add Reminder" value="2" />
                              ) : (
                                ""
                              )}
                            </TabList>
                          </Box>
                          {/* <TabPanel value="1" sx={{padding:"0px"}}> <p className="view-lead-popup-header-title">Add Call Activity</p></TabPanel>
                    <TabPanel value="2" sx={{padding:"0px"}}><p className="view-lead-popup-header-title">Add Reminder </p></TabPanel> */}
                        </TabContext>
                      </Box>
                      {value == "1" ? (
                        <>
                          {" "}
                          <p
                            className="view-lead-popup-header-title"
                            style={{ marginTop: "10px" }}
                          >
                            Add Call Activity
                          </p>
                          <div className="margeTwoField element">
                            <FormControl
                              variant="standard"
                              sx={{ width: "100%" }}
                              focused
                              error={
                                activityAdd.main_status == "" &&
                                activityTrue.main_status
                                  ? true
                                  : false
                              }
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Main Status
                              </InputLabel>
                              <Select
                                // value={age}
                                onChange={activityinput}
                                onBlur={activitytrueFalse}
                                label="Main Status"
                                name="main_status"
                                value={activityAdd.main_status}
                              >
                                {Object.keys(
                                  leadDetails?.InquiryStatusList
                                ).map((key, index) => {
                                  return <MenuItem value={key}>{key}</MenuItem>;
                                })}
                              </Select>
                              {activityAdd.main_status == "" &&
                              activityTrue.main_status ? (
                                <FormHelperText>
                                  Main Status is required
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                            {activityAdd.main_status ? (
                              <FormControl
                                variant="standard"
                                sx={{ width: "100%" }}
                                focused
                                error={
                                  activityAdd.sub_status == "" &&
                                  activityTrue.sub_status
                                    ? true
                                    : false
                                }
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Sub Status
                                </InputLabel>
                                <Select
                                  // value={age}
                                  onChange={activityinput}
                                  onBlur={activitytrueFalse}
                                  label="Sub Status"
                                  name="sub_status"
                                  value={activityAdd.sub_status}
                                >
                                  {leadDetails?.InquiryStatusList[
                                    activityAdd?.main_status
                                  ].map((item, index) => {
                                    return (
                                      <MenuItem value={item}>{item}</MenuItem>
                                    );
                                  })}
                                </Select>
                                {activityAdd.sub_status == "" &&
                                activityTrue.sub_status ? (
                                  <FormHelperText>
                                    Sub Status is required
                                  </FormHelperText>
                                ) : (
                                  ""
                                )}
                              </FormControl>
                            ) : (
                              ""
                            )}
                          </div>
                          <br />
                          <div className="margeTwoField element">
                            <TextField
                              type="text"
                              label="Note"
                              variant="standard"
                              sx={{ width: "100%" }}
                              focused
                              name="notes"
                              value={activityinput.notes}
                              onChange={activityinput}
                              // error={
                              //   reminderAdd.customer_name == "" && editTrueFalse.customer_name
                              //     ? true
                              //     : false
                              // }
                              // helperText={
                              //   reminderAdd.customer_name == "" && editTrueFalse.customer_name
                              //     ? "Customer Name is required"
                              //     : ""
                              // }
                              // onBlur={remindertrueFalse}
                            />
                          </div>
                          <br />
                          <div className="popup-add-lead-section">
                            {activityAdd.isLoader ? (
                              <Button
                                tabindex="0"
                                size="large"
                                className=" btn-gradient  btn-success addbankloder"
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
                                onClick={activityrSubmit}
                              >
                                Add Call Activity
                              </Button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            className="view-lead-popup-header-title"
                            style={{ marginTop: "10px" }}
                          >
                            Add Reminder
                          </p>
                          <div className="margeTwoField element">
                            <TextField
                              type="date"
                              label="Follow Up Date"
                              variant="standard"
                              sx={{ width: "100%" }}
                              name="followup_date"
                              id="myDateInput"
                              inputProps={{
                                min: minDate, // Set the minimum date dynamically
                              }}
                              // min="2023-06-21"
                              value={reminderAdd.followup_date}
                              onChange={reminderinput}
                              onBlur={remindertrueFalse}
                              error={
                                reminderAdd.followup_date == "" &&
                                reminderTrue.followup_date
                                  ? true
                                  : false
                              }
                              helperText={
                                reminderAdd.followup_date == "" &&
                                reminderTrue.followup_date
                                  ? "Follow Up Date is required"
                                  : ""
                              }
                              focused
                            />
                            <TextField
                              type="time"
                              label="Follow Up Time"
                              variant="standard"
                              sx={{ width: "100%" }}
                              name="followup_time"
                              value={reminderAdd.followup_time}
                              onChange={reminderinput}
                              error={
                                reminderAdd.followup_time == "" &&
                                reminderTrue.followup_time
                                  ? true
                                  : false
                              }
                              helperText={
                                reminderAdd.followup_time == "" &&
                                reminderTrue.followup_time
                                  ? "Follow Up Time is required"
                                  : ""
                              }
                              onBlur={remindertrueFalse}
                              focused
                            />
                          </div>
                          <br />
                          <div className="element">
                            <TextField
                              type="text"
                              label="Note"
                              variant="standard"
                              sx={{ width: "100%" }}
                              focused
                              name="notes"
                              value={reminderAdd.notes}
                              onChange={reminderinput}
                            />
                          </div>
                          <br />
                          <div className="popup-add-lead-section">
                            {reminderAdd.isLoader ? (
                              <Button
                                tabindex="0"
                                size="large"
                                className=" btn-gradient  btn-success addbankloder"
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
                                onClick={reminderSubmit}
                              >
                                ADD Reminder
                              </Button>
                            )}
                          </div>{" "}
                        </>
                      )}
                    </Paper>
                  </Grid>
                ) : (
                  ""
                )}

                <Grid item md={12} lg={12} xl={12} sm={12}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px" }}
                    className="pending-all-15px"
                  >
                    <p className="view-lead-popup-header-title">
                      Reminder History
                    </p>
                    <CommonTable
                      url={`${Url}/datatable/lead_reminder_list.php`}
                      column={column}
                      sort="0"
                      filter={filterData}
                      refresh={refresh}
                      param={param}
                    />
                  </Paper>
                </Grid>
                {/* <Grid item md={12} lg={12} xl={12} sm={12}>
              <Paper
                elevation={2}
                style={{ borderRadius: "10px" }}
                className="pending-all-15px"
              >
                <p className="view-lead-popup-header-title">
                  {" "}
                  Call Activity History
                </p>
                <CommonTable
                  url={`${Url}/datatable/lead_call_history.php`}
                  column={callColumn}
                  refresh={Crefresh}
                  sort="0"
                  ra
                  param={callParam}
                />
              </Paper>
            </Grid> */}
                <Grid item md={12} lg={12} xl={12} sm={12}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px" }}
                    className="pending-all-15px"
                  >
                    <p className="view-lead-popup-header-title">
                      {" "}
                      Lead Activity History
                    </p>
                    <CommonTable
                      url={`${Url}/datatable/lead_activity_list.php`}
                      column={callColumn1}
                      refresh={LArefresh}
                      sort="0"
                      ra
                      param={callParam}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>
          )}
        </>
      );
    } else if (dialogTitle == "Are you sure?") {
      return (
        <div className="lead-completed-section">
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                CP access
              </InputLabel>
              <Select onChange={input3} label="CP access" name="cp_access">
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {cpData.cp_access == 1 ? (
            <div>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Live Mt5
                </InputLabel>
                <Select onChange={input3} label="Demo Mt5" name="demo_mt5">
                  <MenuItem value="1">Yes</MenuItem>
                  <MenuItem value="0">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            ""
          )}
          {cpData.demo_mt5 == 1 ? (
            <div>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  IB Group
                </InputLabel>
                <Select onChange={input3} label="Demo Mt5" name="ib_group_id">
                  {cpData.ibCommissionGroupList.map((item) => {
                    return (
                      <MenuItem value={item.ib_group_id}>
                        {item.ib_group_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          ) : (
            ""
          )}
          {cpData.ib_group_id != "0" ? (
            <div>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                {/* <InputLabel id="demo-simple-select-standard-label">Password</InputLabel> */}
                <TextField
                  type="text"
                  label="Password"
                  multiline
                  variant="standard"
                  sx={{ width: "100%" }}
                  name="user_password"
                  onChange={input3}
                />
              </FormControl>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    } else if (dialogTitle == "Edit") {
      return (
        <div>
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Customer Name"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="customer_name"
              value={editLead.customer_name}
              // onChange={input}
              // error={
              //   editLead.customer_name == "" && editTrueFalse.customer_name
              //     ? true
              //     : false
              // }
              // helperText={
              //   editLead.customer_name == "" && editTrueFalse.customer_name
              //     ? "Customer Name is required"
              //     : ""
              // }
              onBlur={edittrueFalsefuc}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  /^[A-Za-z_ ]*$/.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  editInput(e);
                }
              }}
            />
            <TextField
              type="text"
              label="Customer Mobile"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              onBlur={edittrueFalsefuc}
              name="customer_mobile"
              // onChange={input}
              // error={
              //   editLead.customer_mobile == "" && editTrueFalse.customer_mobile
              //     ? true
              //     : false
              // }
              // helperText={
              //   editLead.customer_mobile == "" && editTrueFalse.customer_mobile
              //     ? "Customer Mobile is required"
              //     : ""
              // }
              value={editLead.customer_mobile}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  /^[0-9]*$/.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  editInput(e);
                }
              }}
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Customer Email"
              variant="standard"
              value={editLead.customer_email}
              sx={{ width: "100%" }}
              focused
              // helperText={
              //   editLead.customer_email == "" && editTrueFalse.customer_email
              //     ? "Email is required"
              //     : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              //         editLead.customer_email
              //       ) && editTrueFalse.customer_email
              //     ? "Enter a valid email"
              //     : ""
              // }
              // error={
              //   (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              //     editLead.customer_email
              //   ) ||
              //     editLead.customer_email == "") &&
              //   editTrueFalse.customer_email == true
              //     ? true
              //     : false
              // }
              onBlur={edittrueFalsefuc}
              name="customer_email"
              onChange={editInput}
            />
            <TextField
              type="text"
              label="Customer Address"
              multiline
              value={editLead.customer_address}
              variant="standard"
              // error={
              //   editLead.customer_address == "" &&
              //   editTrueFalse.customer_address
              //     ? true
              //     : false
              // }
              // helperText={
              //   editLead.customer_address == "" &&
              //   editTrueFalse.customer_address
              //     ? "Customer Address is required"
              //     : ""
              // }
              sx={{ width: "100%" }}
              focused
              onBlur={edittrueFalsefuc}
              name="customer_address"
              onChange={editInput}
            />
          </div>
          <br />
          <div className="element margeTwoField">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              focused
              // error={
              //   editLead.source_id == "" && editTrueFalse.source_id
              //     ? true
              //     : false
              // }
            >
              <InputLabel id="demo-simple-select-standard-label">
                Source
              </InputLabel>
              <Select
                onChange={editInput}
                label="Source"
                name="source_id"
                value={editLead.source_id}
                onBlur={edittrueFalsefuc}
              >
                {soure.map((item) => {
                  return (
                    <MenuItem value={item.source_id}>{item.name}</MenuItem>
                  );
                })}
              </Select>
              {/* {editLead.source_id == "" && editTrueFalse.source_id ? (
                <FormHelperText>Source is required</FormHelperText>
              ) : (
                ""
              )} */}
            </FormControl>
            <Autocomplete
              options={countryData}
              value={editLead.customer_country}
              getOptionLabel={(option) => (option ? option.nicename : "")}
              onChange={(event, newValue) => {
                editLead.customer_country = newValue;
                setEditLead({ ...editLead });
              }}
              className="w-100"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  name="customer_country"
                  onBlur={edittrueFalsefuc}
                  // error={
                  //   !editLead.customer_country && editTrueFalse.customer_country
                  //     ? true
                  //     : false
                  // }
                  // helperText={
                  //   !editLead.customer_country && editTrueFalse.customer_country
                  //     ? "Country Name is required"
                  //     : ""
                  // }
                  variant="standard"
                />
              )}
            />
          </div>
          <br />
        </div>
      );
    } else if (dialogTitle == "Add Reminder") {
      return (
        <div>
          <div className="margeTwoField element">
            <TextField
              type="date"
              label="Follow Up Date"
              variant="standard"
              sx={{ width: "100%" }}
              name="followup_date"
              value={reminderAdd.followup_date}
              onChange={reminderinput}
              onBlur={remindertrueFalse}
              error={
                reminderAdd.followup_date == "" && reminderTrue.followup_date
                  ? true
                  : false
              }
              helperText={
                reminderAdd.followup_date == "" && reminderTrue.followup_date
                  ? "Follow Up Date is required"
                  : ""
              }
              focused
            />
            <TextField
              type="time"
              label="Follow Up Time"
              variant="standard"
              sx={{ width: "100%" }}
              name="followup_time"
              value={reminderAdd.followup_time}
              onChange={reminderinput}
              error={
                reminderAdd.followup_time == "" && reminderTrue.followup_time
                  ? true
                  : false
              }
              helperText={
                reminderAdd.followup_time == "" && reminderTrue.followup_time
                  ? "Follow Up Time is required"
                  : ""
              }
              onBlur={remindertrueFalse}
              focused
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Lead Name"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="customer_name"
              value={leadDetails.customer_name}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              // value={editLead.customer_name}
              // onChange={input}
              // error={
              //   editLead.customer_name == "" && editTrueFalse.customer_name
              //     ? true
              //     : false
              // }
              // helperText={
              //   editLead.customer_name == "" && editTrueFalse.customer_name
              //     ? "Customer Name is required"
              //     : ""
              // }
              //   onBlur={edittrueFalsefuc}
              //   onChange={(e) => {
              //     if (
              //       e.target.value === "" ||
              //       /^[A-Za-z_ ]*$/.test(e.target.value) ||
              //       e.target.value === " "
              //     ) {
              //       editInput(e);
              //     }
              //   }}
            />
            <TextField
              type="text"
              label="Note"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="notes"
              value={reminderAdd.notes}
              onChange={reminderinput}
              // error={
              //   reminderAdd.customer_name == "" && editTrueFalse.customer_name
              //     ? true
              //     : false
              // }
              // helperText={
              //   reminderAdd.customer_name == "" && editTrueFalse.customer_name
              //     ? "Customer Name is required"
              //     : ""
              // }
              // onBlur={remindertrueFalse}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Add Call Activity") {
      return (
        <>
          {activityAdd.popLoader == true ? (
            <div className="leadpoplodercenter">
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
          ) : (
            <div>
              <div
                className="popup-content-section"
                style={{ justifyContent: "space-between" }}
              >
                <div className="user-details">
                  <label>Name:</label>
                  <p>{leadDetails.customer_name}</p>
                </div>
                <div className="user-details">
                  <label>Email:</label>
                  <p>{leadDetails.customer_email}</p>
                </div>

                <div className="user-details">
                  <label>Mobile:</label>
                  <p>{leadDetails.customer_mobile}</p>
                </div>
                <div className="user-details">
                  <label>Followup:</label>
                  <p>{leadDetails.followup}</p>
                </div>
              </div>
              <div className="margeTwoField element">
                <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  error={
                    activityAdd.main_status == "" && activityTrue.main_status
                      ? true
                      : false
                  }
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Main Status
                  </InputLabel>
                  <Select
                    // value={age}
                    onChange={activityinput}
                    onBlur={activitytrueFalse}
                    label="Main Status"
                    name="main_status"
                    value={activityAdd.main_status}
                  >
                    {Object.keys(activityAdd.InquiryStatusList).map(
                      (key, index) => {
                        return <MenuItem value={key}>{key}</MenuItem>;
                      }
                    )}
                  </Select>
                  {activityAdd.main_status == "" && activityTrue.main_status ? (
                    <FormHelperText>Main Status is required</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
                {activityAdd.main_status ? (
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    focused
                    error={
                      activityAdd.sub_status == "" && activityTrue.sub_status
                        ? true
                        : false
                    }
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Sub Status
                    </InputLabel>
                    <Select
                      // value={age}
                      onChange={activityinput}
                      onBlur={activitytrueFalse}
                      label="Sub Status"
                      name="sub_status"
                      value={activityAdd.sub_status}
                    >
                      {activityAdd.InquiryStatusList[
                        activityAdd.main_status
                      ].map((item, index) => {
                        return <MenuItem value={item}>{item}</MenuItem>;
                      })}
                    </Select>
                    {activityAdd.sub_status == "" && activityTrue.sub_status ? (
                      <FormHelperText>Sub Status is required</FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                ) : (
                  ""
                )}
              </div>
              <br />
              <div className="margeTwoField element">
                <TextField
                  type="text"
                  label="Note"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  name="notes"
                  value={reminderAdd.notes}
                  onChange={reminderinput}
                  // error={
                  //   reminderAdd.customer_name == "" && editTrueFalse.customer_name
                  //     ? true
                  //     : false
                  // }
                  // helperText={
                  //   reminderAdd.customer_name == "" && editTrueFalse.customer_name
                  //     ? "Customer Name is required"
                  //     : ""
                  // }
                  // onBlur={remindertrueFalse}
                />
              </div>
            </div>
          )}
        </>
      );
    } else if (dialogTitle == "Create Account") {
      return (
        <div>
          {CreateAccount.popLoader ? (
            <div className="leadpoplodercenter">
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
          ) : (
            <div>
              <div className="margeTwoField element">
                <TextField
                  type="text"
                  label="Customer Name"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  name="customer_name"
                  value={CreateAccount.customer_name}
                  // onChange={CreateInput}
                  error={
                    CreateAccount.customer_name == "" &&
                    CreateAccountTrue.customer_name
                      ? true
                      : false
                  }
                  helperText={
                    CreateAccount.customer_name == "" &&
                    CreateAccountTrue.customer_name
                      ? "Customer Name is required"
                      : ""
                  }
                  onBlur={CreatetrueFalse}
                  onChange={(e) => {
                    if (
                      e.target.value === "" ||
                      /^[A-Za-z_ ]*$/.test(e.target.value) ||
                      e.target.value === " "
                    ) {
                      CreateInput(e);
                    }
                  }}
                />
                <TextField
                  type="text"
                  label="Customer Mobile"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  onBlur={CreatetrueFalse}
                  name="customer_mobile"
                  value={CreateAccount.customer_mobile}
                  // onChange={CreateInput}
                  error={
                    CreateAccount.customer_mobile == "" &&
                    CreateAccountTrue.customer_mobile
                      ? true
                      : false
                  }
                  helperText={
                    CreateAccount.customer_mobile == "" &&
                    CreateAccountTrue.customer_mobile
                      ? "Customer Mobile is required"
                      : ""
                  }
                  onChange={(e) => {
                    if (
                      e.target.value === "" ||
                      /^[0-9]*$/.test(e.target.value) ||
                      e.target.value === " "
                    ) {
                      CreateInput(e);
                    }
                  }}
                />
              </div>
              <br />
              <div className="margeTwoField element">
                <TextField
                  type="text"
                  label="Customer Email"
                  variant="standard"
                  value={CreateAccount.customer_email}
                  sx={{ width: "100%" }}
                  focused
                  helperText={
                    CreateAccount.customer_email == "" &&
                    CreateAccountTrue.customer_email
                      ? "Email is required"
                      : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                          CreateAccount.customer_email
                        ) && CreateAccountTrue.customer_email
                      ? "Enter a valid email"
                      : ""
                  }
                  error={
                    (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      CreateAccount.customer_email
                    ) ||
                      CreateAccount.customer_email == "") &&
                    CreateAccountTrue.customer_email == true
                      ? true
                      : false
                  }
                  onBlur={CreatetrueFalse}
                  name="customer_email"
                  onChange={CreateInput}
                />
                <Autocomplete
                  options={countryData}
                  value={CreateAccount.customer_country}
                  getOptionLabel={(option) => (option ? option.nicename : "")}
                  onChange={(event, newValue) => {
                    CreateAccount.customer_country = newValue;
                    setCreateAccount({ ...CreateAccount });
                  }}
                  className="w-100"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      name="customer_country"
                      onBlur={CreatetrueFalse}
                      error={
                        !CreateAccount.customer_country &&
                        CreateAccountTrue.customer_country
                          ? true
                          : false
                      }
                      helperText={
                        !CreateAccount.customer_country &&
                        CreateAccountTrue.customer_country
                          ? "Country Name is required"
                          : ""
                      }
                      variant="standard"
                    />
                  )}
                />
              </div>
              <br />
              <div className="element margeTwoField">
                <TextField
                  type="password"
                  error={
                    (!CreateAccount.user_password.match(/[A-Z]/g) ||
                      !CreateAccount.user_password.match(/[a-z]/g) ||
                      !CreateAccount.user_password.match(/[0-9]/g) ||
                      CreateAccount.user_password == "" ||
                      CreateAccount.user_password.length < 8 ||
                      CreateAccount.user_password.length >= 20 ||
                      !CreateAccount.user_password.match(/[!@#$%^&*()_+=]/g)) &&
                    CreateAccountTrue.user_password
                      ? true
                      : false
                  }
                  label="User Password"
                  variant="standard"
                  onChange={CreateInput}
                  onBlur={CreatetrueFalse}
                  sx={{ width: "100%" }}
                  name="user_password"
                  helperText={
                    CreateAccount.user_password == "" &&
                    CreateAccountTrue.user_password
                      ? "Enter your User password"
                      : CreateAccountTrue.user_password &&
                        (CreateAccount.user_password.length < 8 ||
                          CreateAccount.user_password.length >= 20)
                      ? "User Password must contain atleast 8-20 characters"
                      : CreateAccountTrue.user_password &&
                        (!CreateAccount.user_password.match(/[A-Z]/g) ||
                          !CreateAccount.user_password.match(/[a-z]/g) ||
                          !CreateAccount.user_password.match(/[0-9]/g) ||
                          !CreateAccount.user_password.match(
                            /[!@#$%^&*()_+=]/g
                          ))
                      ? "Atleast one lower case, upper case,special character and number required"
                      : ""
                  }
                />
                <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  error={
                    CreateAccount.acc_type == "" && CreateAccountTrue.acc_type
                      ? true
                      : false
                  }
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Account Type
                  </InputLabel>
                  <Select
                    onChange={CreateInput}
                    onBlur={CreatetrueFalse}
                    label="Account Type"
                    name="acc_type"
                  >
                    <MenuItem value="1">Live</MenuItem>
                    <MenuItem value="0">Demo</MenuItem>
                  </Select>
                  {CreateAccount.acc_type == "" &&
                  CreateAccountTrue.acc_type ? (
                    <FormHelperText> Account Type is required</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </div>
              <br />
              <div className="element margeTwoField">
                {CreateAccount.acc_type == "0" ? (
                  <TextField
                    type="text"
                    label="Demo Balance"
                    variant="standard"
                    sx={{ width: "100%" }}
                    focused
                    onBlur={CreatetrueFalse}
                    name="bal"
                    value={CreateAccount.bal}
                    // onChange={CreateInput}
                    error={
                      CreateAccount.bal == "" && CreateAccountTrue.bal
                        ? true
                        : false
                    }
                    helperText={
                      CreateAccount.bal == "" && CreateAccountTrue.bal
                        ? "Demo Balanceis required"
                        : ""
                    }
                    onChange={(e) => {
                      if (
                        e.target.value === "" ||
                        /^[0-9]*$/.test(e.target.value) ||
                        e.target.value === " "
                      ) {
                        CreateInput(e);
                      }
                    }}
                  />
                ) : CreateAccount.acc_type == "1" ? (
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    error={
                      CreateAccount.ib_group_id == "" &&
                      CreateAccountTrue.ib_group_id
                        ? true
                        : false
                    }
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Account Type
                    </InputLabel>
                    <Select
                      onChange={CreateInput}
                      onBlur={CreatetrueFalse}
                      value={CreateAccount.ib_group_id}
                      label="Account option"
                      name="ib_group_id"
                    >
                      {CreateAccount.listIBg?.map((item, index) => {
                        return (
                          <MenuItem value={item.ib_group_level_id}>
                            {item.ib_group_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {CreateAccount.ib_group_id == "" &&
                    CreateAccountTrue.ib_group_id ? (
                      <FormHelperText>
                        Account option is required
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                ) : (
                  ""
                )}
                {CreateAccount.acc_type ? (
                  <TextField
                    type="password"
                    error={
                      (!CreateAccount.treding_passowrd.match(/[A-Z]/g) ||
                        !CreateAccount.treding_passowrd.match(/[a-z]/g) ||
                        !CreateAccount.treding_passowrd.match(/[0-9]/g) ||
                        CreateAccount.treding_passowrd == "" ||
                        CreateAccount.treding_passowrd.length < 8 ||
                        CreateAccount.treding_passowrd.length >= 20 ||
                        !CreateAccount.treding_passowrd.match(
                          /[!@#$%^&*()_+=]/g
                        )) &&
                      CreateAccountTrue.treding_passowrd
                        ? true
                        : false
                    }
                    label="Trading Password"
                    variant="standard"
                    onChange={CreateInput}
                    onBlur={CreatetrueFalse}
                    sx={{ width: "100%" }}
                    name="treding_passowrd"
                    helperText={
                      CreateAccount.treding_passowrd == "" &&
                      CreateAccountTrue.treding_passowrd
                        ? "Enter your Trading password"
                        : CreateAccountTrue.treding_passowrd &&
                          (CreateAccount.treding_passowrd.length < 8 ||
                            CreateAccount.treding_passowrd.length >= 20)
                        ? "Trading Password must contain atleast 8-20 characters"
                        : CreateAccountTrue.treding_passowrd &&
                          (!CreateAccount.treding_passowrd.match(/[A-Z]/g) ||
                            !CreateAccount.treding_passowrd.match(/[a-z]/g) ||
                            !CreateAccount.treding_passowrd.match(/[0-9]/g) ||
                            !CreateAccount.treding_passowrd.match(
                              /[!@#$%^&*()_+=]/g
                            ))
                        ? "Atleast one lower case, upper case,special character and number required"
                        : ""
                    }
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const depositColumn = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),

          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
      // conditionalCellStyles: [
      //   {
      //     when: (row) => row.color == "f4510b",
      //     style: {
      //       backgroundColor: "#ffe6e6",
      //     },
      //   },
      //   {
      //     when: (row) => row.color == "ff8000",
      //     style: {
      //       backgroundColor: "#fff2e6",
      //     },
      //   },
      //   {
      //     when: (row) => row.color == "00d5d5",
      //     style: {
      //       backgroundColor: "#00d5d5",
      //     },
      //   },
      //   {
      //     when: (row) => row.color == "0080ff",
      //     style: {
      //       backgroundColor: "#e6ffff",
      //     },
      //   },
      //   {
      //     when: (row) => row.color == "25138c",
      //     style: {
      //       backgroundColor: "#ebe9fc",
      //     },
      //   },
      // ],
    },

    {
      name: "lead assign time",
      selector: (row) => {
        return <span title={row.lead_assign_time}>{row.lead_assign_time}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            <NewDate newDate={row.added_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "CUSTOMER Name",
      selector: (row) => {
        return (
          <>
            {row?.user_id !== "" && row?.user_id !== "0" ? (
              <a
                className="linkColor"
                title={row.customer_name}
                href={"/profile/" + row.user_id}
                target="_blank"
              >
                {row.customer_name}
              </a>
            ) : (
              <span title={row.customer_name}>{row.customer_name} </span>
            )}
          </>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
      // wrap: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <>
            {" "}
            {prop.permission.update_lead == 1 ? (
              <div>
                <Button
                  id={`actionButton_${row.sr_no}`}
                  aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(event) => handleContextClick(event, row.sr_no)}
                  style={{ color: "black" }}
                >
                  <i className="material-icons">more_horiz</i>
                </Button>
                <Menu
                  id={`basic-menu-${row.sr_no}`}
                  anchorEl={openTableMenus[row.sr_no]}
                  open={Boolean(openTableMenus[row.sr_no])}
                  onClose={(event) => handleContextClose(row.sr_no)}
                >
                  {/* <MenuItem
                    className="completed"
                    {...row}
                    onClick={(e) => {
                      // actionMenuPopup(e, row)
                      handleContextClose(row.sr_no);
                      setCpData({
                        cp_access: "",
                        demo_mt5: "",
                        user_password: "",
                        inquiry_id: row.inquiry_id,
                        leads_status: "Completed",
                        refresh: false,
                        ibCommissionGroupList: [],
                        ib_group_id: "0",
                      });
                      setDialogTitle("Are you sure?");
                      setMaxWidth("md");
                      setOpen(true);
                    }}
                  >
                    <i className="material-icons font-color-approved">
                      task_alt
                    </i>
                    &nbsp;&nbsp;Complete
                  </MenuItem> */}
                  {row.is_register == 0 && prop?.permission?.edit_lead ? (
                    <MenuItem
                      className="completed"
                      {...row}
                      onClick={(e) => {
                        // actionMenuPopup(e, row)
                        handleContextClose(row.sr_no);
                        let test = countryData.filter(
                          (x) => x.nicename == row.customer_country
                        )[0];

                        setEditLead({
                          customer_name: row.customer_name,
                          customer_mobile: row.customer_mobile,
                          customer_email: row.customer_email,
                          customer_address: row.customer_address,
                          customer_country: test,
                          source_id: row.source_id,
                          inquiry_id: row.inquiry_id,
                          isLoader: false,
                        });
                        SeteditTrueFalse({
                          customer_name: false,
                          customer_mobile: false,
                          customer_email: false,
                          customer_address: false,
                          source_id: false,
                          source_desc: false,
                          interest: false,
                          assign: false,
                          date: false,
                          time: false,
                          remark: false,
                          customer_country: false,
                        });
                        setDialogTitle("Edit");
                        setMaxWidth("sm");
                        setOpen(true);
                      }}
                    >
                      <i className="material-icons font-color-approved">
                        edit_note
                      </i>
                      &nbsp;&nbsp;Edit
                    </MenuItem>
                  ) : (
                    ""
                  )}

                  {row.is_register == 0 && prop?.permission?.create_account ? (
                    <MenuItem
                      className=""
                      {...row}
                      onClick={(e) => {
                        // actionMenuPopup(e, row)
                        handleContextClose(row.sr_no);
                        let test = countryData.filter(
                          (x) => x.nicename == row.customer_country
                        )[0];
                        fatchIbGroup(row);

                        setDialogTitle("Create Account");
                        setMaxWidth("sm");
                        setOpen(true);
                      }}
                    >
                      <i className="material-icons font-color-approved">
                        add_circle
                      </i>
                      &nbsp;&nbsp;Create Account
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {prop?.permission?.remove_lead == 1 ? (
                    <MenuItem
                      className="rejected"
                      {...row}
                      onClick={(e) => {
                        // actionMenuPopup(e, row)
                        handleContextClose(row.sr_no);
                        confirmAlert({
                          customUI: ({ onClose }) => {
                            var remark = "";
                            return (
                              <div className="custom-ui">
                                <h1>Are you sure?</h1>
                                <p>Do you want to Remove this lead?</p>
                                <TextField
                                  type="text"
                                  label="Remark"
                                  variant="standard"
                                  sx={{ width: "100%" }}
                                  focused
                                  name="customer_name"
                                  onChange={(e) => {
                                    remark = e.target.value;
                                  }}
                                  // value={editLead.customer_name}
                                  // // onChange={input}

                                  // onBlur={edittrueFalsefuc}
                                  // onChange={(e) => {
                                  //   if (
                                  //     e.target.value === "" ||
                                  //     /^[A-Za-z_ ]*$/.test(e.target.value) ||
                                  //     e.target.value === " "
                                  //   ) {
                                  //     editInput(e);
                                  //   }
                                  // }}
                                />
                                <div
                                  className="confirmation-alert-action-button"
                                  style={{ marginTop: "10px" }}
                                >
                                  <Button
                                    variant="contained"
                                    className="cancelButton"
                                    onClick={onClose}
                                  >
                                    No
                                  </Button>
                                  <Button
                                    variant="contained"
                                    id="loder1"
                                    className="btn-gradient btn-danger"
                                    onClick={() => {
                                      rejectDelete(
                                        row,
                                        "remove_lead",
                                        remark,
                                        onClose
                                      );
                                    }}
                                  >
                                    Yes, Remove it!
                                  </Button>
                                </div>
                              </div>
                            );
                          },
                        });
                      }}
                    >
                      <i className="material-icons font-color-rejected">
                        cancel
                      </i>
                      &nbsp;&nbsp;Remove
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {prop?.permission?.delete_lead == 1 ? (
                    <MenuItem
                      className="rejected"
                      {...row}
                      onClick={(e) => {
                        // actionMenuPopup(e, row)
                        handleContextClose(row.sr_no);
                        confirmAlert({
                          customUI: ({ onClose }) => {
                            handleContextClose(row.sr_no);
                            return (
                              <div className="custom-ui">
                                <h1>Are you sure?</h1>
                                <p>Do you want to Delete this lead?</p>
                                <div className="confirmation-alert-action-button">
                                  <Button
                                    variant="contained"
                                    className="cancelButton"
                                    onClick={onClose}
                                  >
                                    No
                                  </Button>
                                  <Button
                                    id="loder1"
                                    variant="contained"
                                    className="btn-gradient btn-danger"
                                    onClick={() => {
                                      rejectDelete(
                                        row,
                                        "delete_lead",
                                        "",
                                        onClose
                                      );
                                    }}
                                  >
                                    Yes, Delete it!
                                  </Button>
                                </div>
                              </div>
                            );
                          },
                        });
                      }}
                    >
                      <i className="material-icons font-color-rejected">
                        delete
                      </i>
                      &nbsp;&nbsp;Delete
                    </MenuItem>
                  ) : (
                    ""
                  )}

                  {row.leads_status == "Completed" ? <></> : ""}
                </Menu>
              </div>
            ) : (
              ""
            )}
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 0.5,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },

    {
      name: "CUSTOMER Email",
      selector: (row) => {
        return <span title={row.customer_email}>{row.customer_email} </span>;
      },
      sortable: true,
      reorder: true,
      grow: 1.5,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
      // wrap: true,
    },
    {
      name: "Mobile",
      selector: (row) => {
        return <span>{row.customer_mobile}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "country",
      selector: (row) => {
        return <span title={row.customer_country}>{row.customer_country}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Followup",
      selector: (row) => {
        return (
          <div>
            {prop?.permission?.add_reminder == "1" ||
            prop?.permission?.add_call_history == "1" ? (
              <i className="material-icons" onClick={(e) => viewFollowup(row)}>
                visibility
              </i>
            ) : (
              ""
            )}
          </div>
        );
      },
      reorder: true,
      grow: 0.3,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Register Source",
      selector: (row) => {
        return <span title={row.user_source}>{row.user_source}</span>;
      },
      reorder: true,
      grow: 0.4,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
      // wrap: true,
    },
    {
      name: "Leads Stage",
      selector: (row) => {
        return <span title={row.leads_stage}>{row.leads_stage}</span>;
      },
      reorder: true,
      grow: 1,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Assign To",
      selector: (row) => {
        let test = listManagers?.filter(
          (x) => x.lead_assign_user_id == row.lead_assign_user_id
        )[0];
        return (
          <div>
            {prop.permission.change_assign_to == 1 ? (
              <>
                <Autocomplete
                  options={listManagers}
                  value={test}
                  getOptionLabel={(option) =>
                    option ? option.manager_name : ""
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      changeAssign(newValue.lead_assign_user_id, row);
                    } else {
                      // changeAssign("", row);
                    }
                  }}
                  sx={{ minWidth: "200px" }}
                  // className="w-100"
                  renderInput={(params) => (
                    <TextField
                      className="w-100"
                      {...params}
                      variant="standard"
                    />
                  )}
                />
              </>
            ) : (
              <span title={row.lead_assign_user_name}>
                {row.lead_assign_user_name}
              </span>
            )}
          </div>
        );
      },
      reorder: true,
      grow: 3,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Source",
      selector: (row) => {
        return <span title={row.source}>{row.source}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "MT5",
      selector: (row) => {
        return <span title={row.mt5}>{row.mt5}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },

    {
      name: "Followup Date",
      selector: (row) => {
        return (
          <span title={row.followup_date}>
            {row.followup_date == "-" || row.followup_date == "" ? (
              ""
            ) : (
              <NewDate newDate={row.followup_date} />
            )}
          </span>
        );
      },
      // sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Followup Remarks",
      selector: (row) => {
        return <span title={row.last_followup_remarks}>{row.last_followup_remarks}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "Register Status",
      selector: (row) => {
        return (
          <span title={row.is_register == "0" ? "No" : "Yes"}>
            {row.is_register == "0" ? "No" : "Yes"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    {
      name: "KYC",
      selector: (row) => {
        return (
          <span
            title={
              row.kyc_status == "0" ? "No" : row.kyc_status == "1" ? "Yes" : ""
            }
          >
            {row.kyc_status == "0" ? "No" : row.kyc_status == "1" ? "Yes" : ""}
          </span>
        );
      },
      // className={(row.leads_status == "Completed") ? "status-text-approved" : (row.leads_status == "Rejected") ? "status-text-rejected" : "status-text-pending"}
      reorder: true,
      // wrap: true,
      grow: 0.2,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },

    {
      name: "IB",
      selector: (row) => {
        // return <span title={row.ib_name}>{row.ib_name}</span>;
        return (
          <>
            {row?.ib_user_id !== "" && row?.ib_user_id !== "0" ? (
              <a
                className="linkColor"
                title={row.ib_name}
                href={"/profile/" + row.ib_user_id}
                target="_blank"
              >
                {row.ib_name}
              </a>
            ) : (
              <span title={row.ib_name}>{row.ib_name} </span>
            )}
          </>
        );
      },
      // className={(row.leads_status == "Completed") ? "status-text-approved" : (row.leads_status == "Rejected") ? "status-text-rejected" : "status-text-pending"}
      reorder: true,
      // wrap: true,
      grow: 1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
    // {
    //   name: "STATUS",
    //   selector: (row) => {
    //     return <span title={row.leads_status}>{row.leads_status}</span>;
    //   },
    //   reorder: true,
    //   grow: 1,
    //   conditionalCellStyles: [
    //     {
    //       when: (row) => row.color == "f4510b",
    //       style: {
    //         backgroundColor: "#ffe6e6",
    //       },
    //     },
    //     {
    //       when: (row) => row.color == "ff8000",
    //       style: {
    //         backgroundColor: "#fff2e6",
    //       },
    //     },
    //     {
    //       when: (row) => row.color == "00d5d5",
    //       style: {
    //         backgroundColor: "#00d5d5",
    //       },
    //     },
    //     {
    //       when: (row) => row.color == "0080ff",
    //       style: {
    //         backgroundColor: "#e6ffff",
    //       },
    //     },
    //     {
    //       when: (row) => row.color == "25138c",
    //       style: {
    //         backgroundColor: "#ebe9fc",
    //       },
    //     },
    //   ],
    // },

    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      grow: 0.4,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
      // wrap: true,
    },
    {
      name: "Client Login",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.login_as_user == 1 &&
            row?.is_register == 1 &&
            row?.user_id ? (
              <Button
                onClick={(e) => {
                  userLogin(row);
                }}
              >
                <i className="material-icons">login</i>
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 0.1,
      conditionalCellStyles: [
        {
          when: (row) => row.color,
          style: (row) => ({ backgroundColor: row.color }),
        },
      ],
    },
  ];

  const column = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      grow: 0.1,
      // wrap: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Followup Date",
      selector: (row) => {
        return (
          <span title={row.followup_datetime}>{row.followup_datetime}</span>
        );
      },
      // sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Remarks",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "Added By",
      selector: (row) => {
        return <span title={row.added_by}>{row.added_by}</span>;
      },
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <>
            {prop?.permission?.reminder_change_complete_status == "1" ? (
              <>
                {" "}
                {row.is_completed == "1" ? (
                  <span>
                    <ThumbUpAltIcon sx={{ color: "green" }} />
                  </span>
                ) : (
                  <span
                    onClick={(e) => {
                      // actionMenuPopup(e, row)
                      setMangeClassHide(true);
                      confirmAlert({
                        customUI: ({ onClose }) => {
                          return (
                            <div className="custom-ui">
                              <h1>Are you sure?</h1>
                              <p>Do you want to Complete this Reminder?</p>
                              <div
                                className="confirmation-alert-action-button"
                                style={{ marginTop: "10px" }}
                              >
                                <Button
                                  variant="contained"
                                  className="cancelButton"
                                  onClick={() => {
                                    onClose();
                                    handleModalClose();
                                  }}
                                >
                                  No
                                </Button>
                                <Button
                                  variant="contained"
                                  className="btn-gradient btn-success"
                                  onClick={() => {
                                    componentLead(row, "remove_lead");
                                    handleModalClose();
                                    onClose();
                                  }}
                                >
                                  Yes, Complete it!
                                </Button>
                              </div>
                            </div>
                          );
                        },
                        onClose: handleModalClose,
                        closeOnClickOutside: false,
                        closeOnEscape: false,
                      });
                    }}
                  >
                    <ThumbUpAltIcon sx={{ color: "grey" }} />
                  </span>
                )}
              </>
            ) : (
              ""
            )}
          </>
        );
      },
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    /* {
      name: 'Recording',
      button: true,
      cell: row => {
        return <div></div>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 0.5,
    } */
  ];

  const callColumn1 = [
    {
      name: "SR NO",
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
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,

      // wrap: true,
    },
    {
      name: "request type",
      selector: (row) => {
        return <span title={row.request_type}>{row.request_type}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "main status",
      selector: (row) => {
        return <span title={row.main_status}>{row.main_status}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "sub status",
      selector: (row) => {
        return <span title={row.sub_status}>{row.sub_status}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "stage",
      selector: (row) => {
        return <span title={row.stage}>{row.stage}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "remarks",
      selector: (row) => {
        return <span title={row.remove_remarks}>{row.remove_remarks}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,

      // wrap: true,
    },
    {
      name: "ip",
      selector: (row) => {
        return <span title={row.added_ip_address}>{row.added_ip_address}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "description",
      selector: (row) => {
        return <span title={row.description}>{row.description}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,

      // wrap: true,
    },
  ];
  const callColumn = [
    {
      name: "SR NO",
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
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
    },
    {
      name: "main status",
      selector: (row) => {
        return <span title={row.main_status}>{row.main_status}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
    },
    {
      name: "sub status",
      selector: (row) => {
        return <span title={row.sub_status}>{row.sub_status}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
    },
    {
      name: "stage",
      selector: (row) => {
        return <span title={row.stage}>{row.stage}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
    },
    {
      name: "notes",
      selector: (row) => {
        return <span title={row.notes}>{row.notes}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
    },
    {
      name: "added by",
      selector: (row) => {
        return <span title={row.added_by}>{row.added_by}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
    },
  ];

  const submitForm = async () => {
    // if (form.customer_name == "") {
    //   toast.error("Please enter customer name");
    // } else if (form.customer_mobile == "") {
    //   toast.error("Please enter customer mobile");
    // } else if (form.customer_email == "") {
    //   toast.error("Please enter customer email");
    // } else if (form.customer_address == "") {
    //   toast.error("Please enter customer address");
    // } else if (form.source_id == "") {
    //   toast.error("Please select source");
    // } else if (form.interest == "") {
    //   toast.error("Please select interest");
    // } else if (form.assign == "") {
    //   toast.error("Please select Assign To Sales-Executive");
    // } else if (form.date == "") {
    //   toast.error("Please select follow up date");
    // } else if (form.time == "") {
    //   toast.error("Please select follow up time");
    // } else if (form.customer_country == "") {
    //   toast.error("Please select country");
    // } else

    if (form.customer_mobile == "" && form.customer_email == "") {
      toast.error("Please enter Email or Moblie");
    } else if (
      form.customer_email &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.customer_email)
    ) {
      toast.error("Enter a valid email");
    } else if (
      form.customer_mobile &&
      (form.customer_mobile.toString().length < 4 ||
        form.customer_mobile.toString().length > 12)
    ) {
      toast.error("Mobile Number is not valid");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("customer_name", form?.customer_name);
      param.append("customer_mobile", form?.customer_mobile);
      param.append("customer_email", form?.customer_email);
      param.append("customer_address", form?.customer_address);
      // param.append("status_id", form.interest);
      param.append("source_id", form?.source_id);
      param.append("source_desc", form?.source_desc);
      param.append(
        "lead_assign_user_id",
        form?.assign?.lead_assign_user_id
          ? form?.assign?.lead_assign_user_id
          : ""
      );
      param.append("followup_date", form?.date);
      param.append("followup_time", form?.time);
      // param.append('cp_access', form.cp_access);
      // param.append('demo_mt5', form.create_demo_mt5);
      param.append(
        "customer_country",
        form?.customer_country?.nicename ? form?.customer_country?.nicename : ""
      );
      param.append("remarks", form?.remark);
      await axios
        .post(`${Url}/ajaxfiles/add_inquiry.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          form.isLoader = false;
          setForm({ ...form });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setCpData((preValue) => {
              return {
                ...preValue,
                isLoader: true,
                refresh: !cpData.refresh,
              };
            });
            toast.success(res.data.message);
            setOpen(false);
            setForm({
              customer_name: "",
              customer_mobile: "",
              customer_email: "",
              customer_address: "",
              source_id: "",
              source_desc: "",
              interest: "",
              assign: {},
              date: "",
              time: "",
              remark: "",
              customer_country: {},
              isCustomerSendMail: true,
              isCustomerSendsms: true,
              isAssignSendsms: false,
              isAdminSendsms: false,
              isLoader: false,
            });
          }
        });

      /* handleClose();
      toast.success('Lead has been added successfully.'); */
    }
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
  const edittrueFalsefuc = (event) => {
    var { name, value } = event.target;
    SeteditTrueFalse((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const reminderinput = (event) => {
    var { name, value } = event.target;

    setReminderAdd((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const remindertrueFalse = (event) => {
    var { name, value } = event.target;
    setReminderTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const activityinput = (event) => {
    var { name, value } = event.target;

    setActivityAdd((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const activitytrueFalse = (event) => {
    var { name, value } = event.target;
    setActivityTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const editInput = (event) => {
    var { name, value } = event.target;
    if (event.target.getAttribute) {
      if (event.target.getAttribute("type") == "checkbox") {
        value = event.target.checked;
      }
    }

    setEditLead((prevalue) => {
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

  const CreateInput = (event) => {
    var { name, value } = event.target;

    setCreateAccount((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const CreatetrueFalse = (event) => {
    var { name, value } = event.target;
    setCreateAccountTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const input3 = (event) => {
    const { name, value } = event.target;
    if (name == "demo_mt5" && value == "1") {
      getIBCommissionGroup();
    }
    setCpData((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const input1 = (event) => {
    var { name, value } = event.target;
    if (event.target.getAttribute) {
      if (event.target.getAttribute("type") == "checkbox") {
        value = event.target.checked;
      }
    }

    setNewFollowupForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const changeInterestStatus = (e, data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>
              Do you want to change interest status{" "}
              {interest[e.target.value - 1]} ?
            </p>
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
                  approveInterestStatus(e, data);
                  onClose();
                }}
              >
                Yes, Apply it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  const approveInterestStatus = (e, data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "change_interest");
    param.append("inquiry_id", data.inquiry_id);
    param.append("interest", e.target.value);
    axios.post(Url + "/ajaxfiles/change_lead_data.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      toast.success(res.data.message);
      setCpData((preValue) => {
        return {
          ...preValue,
          refresh: !cpData.refresh,
        };
      });
    });
  };

  const changeAssign = (e, data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to change assign sales executive ?</p>
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
                  approvechangeAssign(e, data);
                  onClose();
                }}
              >
                Yes, Apply it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  // const changeAssignBulk = (data, onClose, is_mail) => {
  //   if (!data) {
  //     toast.error("Assign To Sales-Executive is required");
  //   } else {
  //     setBulkLoader(true);
  //     const param = new FormData();
  //     if (IsApprove !== "") {
  //       param.append("is_app", IsApprove.is_app);
  //       param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
  //       param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
  //     }
  //     param.append("action", "assign_bulk_lead");
  //     var inquiry_ids = "";
  //     columnTrue?.map((item, index) => {
  //       if (index == 0) {
  //         inquiry_ids = item.inquiry_id;
  //       } else {
  //         inquiry_ids = item.inquiry_id + "," + inquiry_ids;
  //       }
  //     });
  //     console.log(inquiry_ids);
  //     param.append("inquiry_ids", inquiry_ids);
  //     param.append("is_mail", is_mail ? 1 : 0);

  //     param.append("lead_assign_user_id", data.lead_assign_user_id);
  //     axios.post(Url + "/ajaxfiles/lead_manage.php", param).then((res) => {
  //       if (res.data.message == "Session has been expired") {
  //         localStorage.setItem("login", true);
  //         navigate("/");
  //         return;
  //       }
  //       if (res.data.status == "error") {
  //         setBulkLoader(false);
  //         toast.error(res.data.message);
  //         onClose();
  //       } else {
  //         setBulkLoader(false);
  //         toast.success(res.data.message);
  //         setCpData((preValue) => {
  //           return {
  //             ...preValue,
  //             refresh: !cpData.refresh,
  //           };
  //         });
  //         onClose();
  //       }
  //     });
  //   }
  // };

  const approvechangeAssign = (e, data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "change_assign_to");
    param.append("inquiry_id", data.inquiry_id);
    param.append("lead_assign_user_id", e);
    axios.post(Url + "/ajaxfiles/change_lead_data.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        setCpData((preValue) => {
          return {
            ...preValue,
            refresh: !cpData.refresh,
          };
        });
      }
    });
  };

  const getIBCommissionGroup = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_default_ib_groups");
    await axios
      .post(Url + "/ajaxfiles/ib_commission_group_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          // cpData.ibCommissionGroupList = res.data.data;
          // setCpData({...cpData});
          setCpData((prevalue) => {
            return {
              ...prevalue,
              ["ibCommissionGroupList"]: res.data.data,
            };
          });
        }
        /* toast.success(res.data.message);
        setRefresh(!refresh) */
      });
  };
  const userLogin = (row) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to sure login this user ?</p>
            <div className="confirmation-alert-action-button">
              <Button
                variant="contained"
                className="cancelButton"
                onClick={onClose}
              >
                No
              </Button>
              <Button
                id="loder123"
                variant="contained"
                className="btn-gradient btn-success"
                onClick={() => {
                  getUserLoginToken(row, onClose);
                }}
              >
                Yes, Login it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };
  const getUserLoginToken = (data, onClose) => {
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "login_as_user");
    param.append("user_id", data.user_id);
    document.getElementById("loder123").classList.add("MyClassLoder");
    var button = document.getElementById("loder123");

    // Disable the button
    button.disabled = true;
    button.innerHTML = `<svg class="spinner" viewBox="0 0 50 50">
    <circle
      class="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke-width="5"
    ></circle>
  </svg>`;
    axios.post(Url + "/ajaxfiles/user_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
        document.getElementById("loder123").classList.remove("MyClassLoder");
        var button = document.getElementById("loder123");

        // Disable the button
        button.disabled = false;
        button.innerHTML = `Yes, Login it!`;
      } else {
        onClose();
        if (res.data.redirect_url == "" && !res.data.redirect_url) {
          window.open(
            `${ClientUrl}/login_as/${res.data.login_token}`,
            "_blank"
          );
        } else {
          window.open(res.data.redirect_url, "_blank");
        }

        setTimeout(() => {
          // window.open(res.data.redirect_url, "_blank");
        }, 3000);
      }
    });
  };
  const assignBulk = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        let cp_access = 0;
        var newValuesalsman = "";
        var is_mail = false;
        var is_loader = false;
        const changeAssignBulk = (data, onClose, is_mail) => {
          if (!data) {
            toast.error("Assign To Sales-Executive is required");
          } else {
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
              param.append("is_app", IsApprove.is_app);
              param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
              param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
            }
            param.append("action", "assign_bulk_lead");
            var inquiry_ids = "";
            columnTrue?.map((item, index) => {
              if (index == 0) {
                inquiry_ids = item.inquiry_id;
              } else {
                inquiry_ids = item.inquiry_id + "," + inquiry_ids;
              }
            });
            param.append("inquiry_ids", inquiry_ids);
            param.append("is_mail", is_mail ? 1 : 0);

            param.append("lead_assign_user_id", data.lead_assign_user_id);
            axios
              .post(Url + "/ajaxfiles/lead_manage.php", param)
              .then((res) => {
                if (res.data.message == "Session has been expired") {
                  localStorage.setItem("login", true);

                  navigate("/");
                  return;
                }
                if (res.data.status == "error") {
                  document
                    .getElementById("loder")
                    .classList.remove("MyClassLoder");
                  var button = document.getElementById("loder");

                  // Disable the button
                  button.disabled = false;
                  button.innerHTML = `Yes, Assign it!`;
                  // setBulkLoader(false);
                  toast.error(res.data.message);
                  // onClose();
                } else {
                  toast.success(res.data.message);
                  setColumnTrue([]);
                  setCpData((preValue) => {
                    return {
                      ...preValue,
                      refresh: !cpData.refresh,
                    };
                  });
                  onClose();
                }
              });
          }
        };

        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to Assign Sales-Executive this?</p>
            <div>
              {/* <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  CP access
                </InputLabel>
                <Select onChange={input3} label="CP access" name="cp_access">
                  <MenuItem value="1">Yes</MenuItem>
                  <MenuItem value="0">No</MenuItem>
                </Select>
              </FormControl> */}
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      is_mail = e.target.checked;
                    }}
                  />
                }
                label="Send Mail"
              />
              <Autocomplete
                options={listManagers}
                getOptionLabel={(option) => (option ? option.manager_name : "")}
                onChange={(event, newValue) => {
                  newValuesalsman = newValue;
                }}
                sx={{ minWidth: "200px", marginBottom: "17px" }}
                // className="w-100"
                renderInput={(params) => (
                  <TextField
                    className="w-100"
                    {...params}
                    label="Assign To Sales-Executive"
                    variant="standard"
                  />
                )}
              />
            </div>

            <div className="confirmation-alert-action-button">
              <Button
                variant="contained"
                // className={is_loader ? "yes" : "no"}
                className="cancelButton"
                onClick={onClose}
              >
                No
              </Button>

              <Button
                variant="contained"
                id="loder"
                className="btn-gradient btn-success"
                onClick={() => {
                  changeAssignBulk(newValuesalsman, onClose, is_mail);
                }}
                // disabled={}
              >
                Yes, Assign it!
              </Button>

              {/* <Button
                variant="contained"
                className="btn-gradient btn-success"
                onClick={() => {
                  changeAssignBulk(newValuesalsman, onClose, is_mail);
                }}
              >
                Yes, Assign it!
              </Button> */}
            </div>
          </div>
        );
      },
    });
  };
  const changeFollowupDate = (e, data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to change followup date ?</p>
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
                  approvechangeFollowupDate(e, data);
                  onClose();
                }}
              >
                Yes, Apply it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  const approvechangeFollowupDate = (e, data) => {
    toast.success("Assign sales executive has been updated successfully.");
  };

  const addNewFollowup = async () => {
    const param = new FormData();
    param.append("inquiry_id", newFollowupForm.inquiry_id);
    if (newFollowupForm.date == "") {
      toast.error("Please select followup date");
    } else if (newFollowupForm.time == "") {
      toast.error("Please select followup time");
    } else if (newFollowupForm.interest == "") {
      toast.error("Please select followup interest");
    } else if (newFollowupForm.remark == "") {
      toast.error("Please enter followup remark");
    } else {
      newFollowupForm.isLoader = true;
      setNewFollowupForm({ ...newFollowupForm });
      if (IsApprove !== "") {
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("status_id", newFollowupForm.interest);
      param.append("lead_assign_user_id", newFollowupForm.lead_assign_user_id);
      param.append("remarks", newFollowupForm.remark);
      param.append("followup_date", newFollowupForm.date);
      param.append("followup_time", newFollowupForm.time);
      await axios
        .post(`${Url}/ajaxfiles/add_followup.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          newFollowupForm.isLoader = false;
          setNewFollowupForm({ ...newFollowupForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            cpData.refresh = !cpData.refresh;
            setCpData({ ...cpData });
            setLArefresh(!LArefresh);
            setRefresh(!refresh);
            toast.success(res.data.message);
            setNewFollowupForm({
              date: "",
              time: "",
              interest: "",
              remark: "",
              inquiry_id: "",
              lead_assign_user_id: "",
              isCustomerSendsms: true,
              isAssignSendsms: false,
              isAdminSendsms: false,
              isLoader: false,
            });
          }
        });
      // toast.success('Followup hsa been added successfully.');
    }
  };

  const actionMenuPopup = (e, data) => {
    handleContextClose(data.sr_no);
    if (e.target.classList.contains("not_interested")) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to not interest this?</p>
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
                    changeLeadStatus("not_interested", data);
                    onClose();
                  }}
                >
                  Yes, Not Interested it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("completed")) {
      confirmAlert({
        customUI: ({ onClose }) => {
          let cp_access = 0;
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to completed this?</p>
              <div>
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    CP access
                  </InputLabel>
                  <Select onChange={input3} label="CP access" name="cp_access">
                    <MenuItem value="1">Yes</MenuItem>
                    <MenuItem value="0">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {cpData.cp_access == 1 ? (
                <div>
                  dsadsdf
                  {/* <FormControl variant="standard" sx={{ width: '100%' }} >
            <InputLabel id="demo-simple-select-standard-label">Demo Mt5</InputLabel>
            <Select
              onChange={input3}
              label="Demo Mt5"
              name='demo_mt5'
            >
              <MenuItem value="1">Yes</MenuItem>
              <MenuItem value="0">No</MenuItem>
             
            </Select>
          </FormControl> */}
                </div>
              ) : (
                ""
              )}

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
                    changeLeadStatus("completed", data);
                    onClose();
                  }}
                >
                  Yes, Completed it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("rejected")) {
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
                    changeLeadStatus("rejected", data);
                    onClose();
                  }}
                >
                  Yes, Rejected it!
                </Button>
              </div>
            </div>
          );
        },
      });
    }

    // setOpen(true);
  };

  const changeLeadStatus = async (status, data) => {
    const param = new FormData();
    param.append("inquiry_id", data.inquiry_id);
    if (status == "not_interested") {
      param.append("leads_status", 2);
    } else if (status == "completed") {
      param.append("leads_status", 1);
    } else if (status == "rejected") {
      param.append("leads_status", 3);
    }
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    await axios
      .post(`${Url}/ajaxfiles/update_lead_status.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setCpData((preValue) => {
            return {
              ...preValue,
              refresh: !cpData.refresh,
            };
          });
          toast.success(res.data.message);
        }
      });
  };

  const handleAction = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("import_lead_file", doc.file);
    await axios.post(`${Url}/ajaxfiles/import_leads.php`, param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
        LeadRef.current.value = "";
      } else {
        toast.success(res.data.message);
        setCpData((preValue) => {
          return {
            ...preValue,
            refresh: !cpData.refresh,
          };
        });
      }
    });
  };
  const makeLeadwallet5Array = (array1) => {
    var newArrayLead = [];
    array1?.map((item, index) => {
      newArrayLead.push({
        wallte_user_id: item.wallte_user_id,
        wallet_code: `${item.wallet_code}-${item.lead_name}`,
      });
    });
    return newArrayLead;
  };
  const makeLeadMt5Array = (array1) => {
    var newArrayLead = [];
    array1?.map((item, index) => {
      newArrayLead.push({
        lead_user_id: item.lead_user_id,
        mt5_acc_no: `${item.mt5_acc_no}-${item.lead_name}`,
      });
    });
    return newArrayLead;
  };
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          {pageLoader == true ? (
            <div className="loader">
              <div className="clock">
                <div className="pointers"></div>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 1 }}>
              <Grid container>
                <Grid item md={12} lg={12} xl={12}>
                  <p className="main-heading">Leads List</p>

                  <CommonFilter
                    search={searchBy}
                    searchWord={setSearchKeyword}
                    setParam={setFilterDate}
                    salesAgent={true}
                    lead_assign_date="true"
                    setsaleStatus={setcheckStatus}
                    selectDynamic={{
                      data: { 0: "Unregistered", 1: "Registered" },
                      keyName: "is_register",
                      label: "Register Status",
                    }}
                    checkboxTrue={{
                      keyName: "filter",
                      label: "Unassigned",
                    }}
                    autoCompleteArray={[
                      {
                        options: resData.lead_mt5_users
                          ? makeLeadMt5Array(resData.lead_mt5_users)
                          : [],
                        label: "Search MT5 ID",
                        keyName: "lead_user_id",
                        serchlabel: "mt5_acc_no",
                      },
                      {
                        options: resData.lead_wallet_users
                          ? makeLeadwallet5Array(resData.lead_wallet_users)
                          : [],
                        label: "Search Wallet Code",
                        keyName: "wallte_user_id",
                        serchlabel: "wallet_code",
                      },
                      {
                        options: resData.user_sources,
                        label: "Register Source",
                        keyName: "register_source",
                        serchlabel: "register_source",
                      },
                    ]}
                    selectDynamic1={{
                      data: resData?.lead_stages,
                      keyName: "lead_stage",
                      label: "lead Stages",
                    }}
                    lastUpdatedBy={resData.modified_by_users}
                  />
                  <br />
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px" }}
                    className="pending-all-15px"
                  >
                    <div className="lead actionGroupButton">
                      <div className="export-import-buttons">
                        {prop.permission.export_lead == 1 ? (
                          <a
                            href={`data:text/csv;charset=utf-8,${escape(
                              csvData
                            )}`}
                            className="btn-export-style"
                            download="lead.csv"
                          >
                            <i className="material-icons">cloud_download</i>
                            &nbsp;Export
                          </a>
                        ) : (
                          ""
                        )}

                        <label
                          htmlFor="contained-button-file"
                          className="fileuploadButton"
                        >
                          {prop.permission.import_lead == 1 ? (
                            <input
                              accept=".csv"
                              id="contained-button-file"
                              type="file"
                              ref={LeadRef}
                              onChange={(e) => {
                                doc.file = e.target.files[0];
                                setDoc({ ...doc });
                                confirmAlert({
                                  customUI: ({ onClose }) => {
                                    return (
                                      <div className="custom-ui">
                                        <h1>Are you sure?</h1>
                                        <p>Do you want to import leads file?</p>
                                        <div className="confirmation-alert-action-button">
                                          <Button
                                            variant="contained"
                                            className="cancelButton"
                                            onClick={(e) => {
                                              LeadRef.current.value = "";
                                              onClose();
                                            }}
                                          >
                                            No
                                          </Button>
                                          <Button
                                            variant="contained"
                                            className="btn-gradient btn-success"
                                            onClick={() => {
                                              handleAction();
                                              onClose();
                                            }}
                                          >
                                            Yes, Import it!
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  },
                                });
                              }}
                            />
                          ) : (
                            ""
                          )}

                          {prop.permission.import_lead == 1 ? (
                            <Button variant="contained" component="span">
                              <i className="material-icons">backup</i>
                              &nbsp;Import
                            </Button>
                          ) : (
                            ""
                          )}
                        </label>
                      </div>
                      {prop.permission.add_lead == 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleClickOpen}
                          className="addLead"
                        >
                          Add
                        </Button>
                      ) : (
                        ""
                      )}

                      {/* <Button variant="contained">Add IB</Button>
                    <Button variant="contained">All</Button> */}
                    </div>
                    {columnTrue?.length !== 0 &&
                    prop?.permission?.assign_bulk_lead == 1 ? (
                      <div style={{ marginTop: "10px" }}>
                        <ColorButton onClick={assignBulk}>
                          {" "}
                          Assign To Salesman
                        </ColorButton>{" "}
                      </div>
                    ) : (
                      ""
                    )}

                    <br />
                    {/* <CommonTable url={`${Url}/datatable/users_list.php`} column={depositColumn} sort='0' refresh={refresh} filter={filterData} search={searchBy} searchWord={searchKeyword} /> */}
                    <CommonTable
                      url={`${Url}/datatable/fetch_lead.php`}
                      column={depositColumn}
                      sort="0"
                      refresh={cpData.refresh}
                      filter={filterData}
                      searchWord={searchKeyword}
                      param={filterDate}
                      checkStatus={checkStatus}
                      search={searchBy}
                      setColumnTrue={setColumnTrue}
                      selectableRows={
                        prop?.permission?.assign_bulk_lead == 1 ? true : false
                      }
                      setResData={setResData}
                    />
                  </Paper>

                  <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    style={mangeClassHide ? { zIndex: "-1" } : {}}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
