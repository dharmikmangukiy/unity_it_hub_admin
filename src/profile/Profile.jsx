import "./profile.css";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import CachedIcon from "@mui/icons-material/Cached";
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  Menu,
  Tabs,
  Tab,
  Typography,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Input,
  ButtonGroup,
  FormGroup,
  Autocomplete,
  RadioGroup,
  Radio,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomImageModal from "../common/CustomImageModal";
import CommonTable from "../common/CommonTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from "@mui/system";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@emotion/react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Chart from "react-apexcharts";
import { Url, ClientUrl, IsApprove } from "../global";
import KycDocument from "./KycDocument";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Referrals from "./Referrals";
import Statement from "./Statement";
import NewDate from "../common/NewDate";
import { AdditionalDocuments } from "./AdditionalDocuments";
import { QrCode } from "@mui/icons-material";
import { GenerateStrongPassword } from "../common/GenerateStrongPassword";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      className="panding-left-right-0"
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
    borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: "12px",
    padding: "8px 10px 8px 10px",
    marginTop: 0,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.

    "&:hover": {
      borderColor: "#1e64b4;",
    },
    "&:focus": {
      borderRadius: 9,
      borderColor: "#1e64b4;",
      border: "2px solid #1e64b4;",
    },
  },
}));
var paymentSub = {};
var imageDeposit = "";
var bankDeposit = [];
var ibGroup = [];
const Profile = (prop12) => {
  const re = /^[A-Za-z_ ]*$/;

  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const [dialogTitle, setDialogTitle] = useState("");
  const [pammGroupButton, setPammGroupButton] = useState("dashboard");
  const [pammPortfolioGroupButton, setPammPortfolioGroupButton] = useState("");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [moneyManagerList, setMoneyManagerList] = useState([]);
  const [myPortfolio, setMyPortfolio] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [investor, setinvestor] = useState(false);
  const [portfolioLoader, setPortfolioLoader] = useState(true);
  const [mission, setMission] = useState(() => {
    const storedProjectName = localStorage.getItem("projectName");
    return storedProjectName || ''; 
  });
  const [param, setParam] = useState({
    action: "my_referrals",
    user_id: id,
    structure_id: 0,
  });
  const [userData, setuserData] = useState({ isLoader: true, data: {} });
  const [filterData, setFilterData] = useState(null);
  const [positionParam, setPositionParam] = useState({
    end_date: "",
    start_date: "",
    mt5_acc_no: "",
    open: true,
    hide: true,
  });
  const [mt5AccountList, setMt5AccountList] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [pammDashboardData, setPammDashboardData] = useState({});
  const [countryData, setCountryData] = useState({
    data: [],
  });
  const [doc, setDoc] = useState({
    proof: "",
    id: "",
    fontimg: "",
    backimg: "",
  });
  const [refreshOpenClose, setRefreshOpenClose] = useState(false);
  const [walletBal, setWalletBal] = useState("");
  var [profileForm, setProfileForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    dob: "",
    nationality: "",
    country_of_residence: "",
    city: "",
    state:"",
    address: "",
    address_2: "",
    gender: "",
    postal_code: "",
    language: "",
    source: "",
    us_citizen: "",
    finacial_work: "",
    tax_number: "",
    source_from: "",
    politically_exposed: "",
    sales_agent: "",
    login_block: "",
    user_status: "",
    wallet_code: "",
  });
  const [createMt5Form, setCreateMt5Form] = useState({
    account_type: "",
    account_option: "",
    mt5_balance: "",
    confirm_password: "",
    password: "",
    isLoader: false,
  });
  const [chGroup, setChGroup] = useState({
    mt5_account_id: "",
    mt5_group_id: "",
    selectedGroup: "",
    groupList: [],
    isLoader: false,
  });
  const [chGrouptruefalse, setChGrouptruefalse] = useState({
    mt5_account_id: false,
    mt5_group_id: false,
  });
  const [inputinfoTrue, setinputinfoTrue] = useState({
    account_type: false,
    account_option: false,
    confirm_password: false,
    password: false,
    mt5_balance: false,
  });
  const [createLiveType, setCreateLiveType] = useState([]);
  const [Mt5AccessForm, setMt5AccessForm] = useState({
    account_type: "",
    status: "",
    isLoader: false,
  });
  const [input1infoTrue, setinput1infoTrue] = useState({
    account_type: false,
    status: false,
  });
  const [linkAccountForm, setLinkAccountForm] = useState({
    account_number: "",
    account_type: "",
    account_name: "",
    account_option: "",
    password: "",
    confirm_password: "",
    isLoader: false,
  });

  const [input2infoTrue, setinput2infoTrue] = useState({
    account_number: false,
    account_type: false,
    account_name: false,
    account_option: false,
    password: false,
    confirm_password: false,
  });
  const [resetMt5PasswordForm, setResetMt5PasswordForm] = useState({
    mt5_id: "",
    isLoader: false,
  });
  const [leverageForm, setLeverageForm] = useState([]);
  const [changeLeverageForm, setChangeLeverageForm] = useState({
    account: "",
    leverage: "",
    isLoader: false,
  });

  const [input4infoTrue, setinput4infoTrue] = useState({
    account: false,
    leverage: false,
  });
  const [changeAccountPasswordForm, setChangeAccountPasswordForm] = useState({
    mt5_id: "",
    new_password: "",
    confirm_password: "",
    password_type: "",
    isLoader: "",
  });
  const [input5infoTrue, setinput5infoTrue] = useState({
    mt5_id: false,
    new_password: false,
    confirm_password: false,
    password_type: false,
  });
  const [masterStructureForm, setmasterStructureForm] = useState({
    name: "",
    forex_rebate: "",
    forex_commission: "",
    bullion_rebate: "",
    bullion_commission: "",
    indices_rebate: "",
    indices_commission: "",
    energy_rebate: "",
    energy_commission: "",
    crypto_rebate: "",
    crypto_commission: "",
  });
  const [employmentDetailsForm, setEmploymentDetailsForm] = useState({
    status: "",
    industry: "",
  });
  const [sharedStructureForm, setSharedStructureForm] = useState({
    name: "",
    total_rebate: "",
    total_commission: "",
    list: [
      {
        id: "",
        name: "",
        value: "",
      },
    ],
  });
  const [linkClientForm, setLinkClientForm] = useState({
    client: "",
    structure: "",
    list: [],
  });
  const [moveToIb, setMoveToIb] = useState({
    list: [],
    isLoader: true,
    BisLoader: false,
    ibName: "",
  });
  const [linkIBForm, setLinkIBForm] = useState({
    master_account: "",
    customer_name: "",
    structure: "",
    list: [],
  });

  const [cpAccessForm, setCpAccessForm] = useState({
    status: "",
  });
  const [noteForm, setNoteForm] = useState({
    notes: "",
    call_status: "",
    set_reminder: false,
    date: "",
    isLoader: false,
  });
  const [bankAccountForm, setBankAccountForm] = useState({
    name: "",
    bank_name: "",
    bank_address: "",
    swift_code: "",
    currency: "",
    bank_proof: "",
    bank_proof_preview: "",
    currencyArray: [],
    iban_number: "",
    account_number: "",
    confirm_account_number: "",
    show: false,
    ibanselect: "IFSC",
    ifscdata: {},
    show: false,
    refresh: false,
    visLoader: false,
    isLoader: false,
  });
  const [bankIinfoTrue, setbankIinfoTrue] = useState({
    name: false,
    bank_name: false,
    bank_address: false,
    iban_number: false,
    account_number: false,
    confirm_account_number: false,
    user_bank_id: false,
  });
  const [transactionForm, setTransactionForm] = useState({
    type: "",
    from_account_type: "",
    mt5_id: "",
    // imageDeposit:"",
    from_mt5_account_id: "",
    withdrawForm: "",
    credit_type: "",
    deposit_to: "",
    transfer_to: "",
    remark: "",
    admin_note: "",
    account: "",
    account_to: "",
    payment: "",
    payment_method: "",
    amount: "",
    note: "",
    image: [],
    image_per: "",
    currency_code: "",
    isLoader: false,
    transation_id: "",
    wallet_code: "",
    mt5_account_id: "",
    isLoder: false,
    user_bank_id: "",
    upi_name: "",
    upi_crypto_ac_number: "",
    crypto_name: "",
  });
  const [trinputinfoTrue, settrinputinfoTrue] = useState({
    type: false,
    from_account_type: false,
    mt5_id: false,
    credit_type: false,
    deposit_to: false,
    transfer_to: false,
    account: false,
    account_to: false,
    payment: false,
    payment_method: false,
    amount: false,
    note: false,
    currency_code: false,
    isLoader: false,
    transation_id: false,
    wallet_code: false,
    mt5_account_id: false,
  });
  const [sendMailForm, setsendMailForm] = useState({
    from: "",
    to: "",
    subject: "",
    template_title: "",
    language: "",
    template: "",
    body: "",
    isLoader: false,
  });
  const [sendMailinputinfoTrue, setsendMailinputinfoTrue] = useState({
    to: false,
    subject: false,
    template_title: false,
    language: false,
    template: false,
  });
  const [linkCampaignForm, setLinkCampaignForm] = useState({
    account: "",
    campaign: "",
  });
  const [editSharedStructureForm, setEditSharedStructureForm] = useState({
    name: "",
    total_rebate: "",
    total_commission: "",
    list: [
      {
        id: "",
        name: "",
        value: "",
      },
    ],
  });
  const [deleteStructureForm, setDeleteStructureForm] = useState({
    structure: "",
  });
  const [allBank, setAllBank] = useState([]);
  const [depositMethods, setDepositMethods] = useState([]);

  const [accountOption, setAccountOption] = useState([]);
  const [IbAccountOption, setIBAccountOption] = useState([]);
  toast.configure();
  const [mtBalance, setMtBalance] = useState("");
  const [masterStructureData, setMasterStructureData] = useState([]);
  const [userBlockUnblockStatus, setUserBlockUnblockStatus] = useState({
    isLoader: false,
    status: "",
  });
  const [newMasterStructureData, setNewMasterStructureData] = useState({
    structure_name: "",
    structure_data: [],
    structure_dataOld: [],
    structure_id: "",
    isLoader: false,
  });
  const [newMasterStructureData1, setNewMasterStructureData1] = useState({
    structure_data: [],
    structure_id: "",
    isLoader: false,
  });
  const [partnershipMasterStructureData, setPartnershipMasterStructureData] =
    useState({
      structure_name: "",
      structure_data: [],
      structure_id: "",
      structure_dataOld: [],
      isLoader: false,
    });
  const [
    newPartnershipMasterStructureData,
    setNewPartnershipMasterStructureData,
  ] = useState({
    structure_name: "",
    structure_data: [],
    structure_id: "",
    structure_dataOld: [],
    isLoader: false,
  });
  const [structureList, setStructureList] = useState({
    data: [],
    structure_name: "",
    structure_id: "",
  });
  const [referralData, setReferralData] = useState({
    data: [],
    structure_name: "",
    structure_id: "",
  });
  const [myTraderData, setMyTraderData] = useState({
    data: {},
    user_name: "",
    user_id: "",
    main_user_name: "",
  });
  const [myChildTraderData, setMyChildTraderData] = useState({
    data: {},
    parent_name: "",
    parent_id: "",
  });
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [moneyManagerListMenu, setMoneyManagerListMenu] = useState([]);
  const [myStructureData, setMyStructureData] = useState({
    structure_name: "",
    structure_data: [],
    structure_id: "",
    isLoader: false,
  });
  const [groupForm, setGroupForm] = useState({
    group_id: "",
    isLoader: false,
    list: [],
  });

  const [pammWithdrawParam, setPammWithdrawParam] = useState({
    user_id: id,
  });

  const [pammTradeParam, setPammTardeParam] = useState({
    user_id: id,
  });

  const [pammMyManagerParam, setPammMyManagerParam] = useState({
    user_id: id,
  });

  const depositColumn = [
    {
      name: "Bank Name",
      selector: (row) => {
        return <span title={row.mt5_id}>{row.mt5_id}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "Swift",
      selector: (row) => {
        return <span title={row.wallet_code}>{row.wallet_code}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "Bank Address",
      selector: (row) => {
        return <span title={row.group_level}>{row.group_level}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "IBAN",
      selector: (row) => {
        return (
          <a
            className="linkColor"
            title={row.name}
            onClick={(event) => gotoProfile(row)}
          >
            {row.name}
          </a>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Account Number",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1.5,
    },
    {
      name: "CURRENCY",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "BENEFICiary Name",
      selector: (row) => {
        return (
          <span title={row.user_visible_password}>
            {row.user_visible_password}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
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
              {row.kyc_status == "1" ? (
                <MenuItem
                  {...row}
                  onClick={(event) => handleContextClose(row.sr_no)}
                >
                  <i className="material-icons">receipt</i>&nbsp;&nbsp;View
                </MenuItem>
              ) : (
                <div>
                  <MenuItem
                    {...row}
                    onClick={(event) => handleContextClose(row.sr_no)}
                  >
                    <i className="material-icons">receipt</i>&nbsp;&nbsp;View
                  </MenuItem>
                  <MenuItem
                    {...row}
                    onClick={(event) => handleContextClose(row.sr_no)}
                  >
                    <i className="material-icons font-color-approved">
                      thumb_up
                    </i>
                    &nbsp;&nbsp;Approved
                  </MenuItem>
                  <MenuItem
                    {...row}
                    onClick={(event) => handleContextClose(row.sr_no)}
                  >
                    <i className="material-icons font-color-rejected">
                      thumb_down
                    </i>
                    &nbsp;&nbsp;Rejected
                  </MenuItem>
                </div>
              )}
            </Menu>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const mt5AccountListColumn = [
    {
      name: "Sr No",
      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      reorder: true,
      minWidth: "72px",

      grow: 0.1,
    },
    {
      name: "Name",
      selector: (row) => {
        return <span title={row.mt5_name}>{row.mt5_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Account Number",
      selector: (row) => {
        return (
          <span
            title={row.mt5_acc_no}
            className="linkColor"
            onClick={() => {
              positionParam.mt5_acc_no = row.mt5_acc_no;
              positionParam.hide = false;
              positionParam.open = true;
              setPositionParam({ ...positionParam });
            }}
          >
            {row.mt5_acc_no}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Account Type",
      selector: (row) => {
        return (
          <span title={row.acc_type == "1" ? "Live" : "Demo"}>
            {row.acc_type == "1" ? "Live" : "Demo"}
          </span>
        );
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Group Name",
      selector: (row) => {
        return <span title={row.group_name}>{row.group_name}</span>;
      },
      sortable: true,
      //  wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Leverage",
      selector: (row) => {
        return <span title={row.leverage}>{row.leverage}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "balance",
      selector: (row) => {
        return <span title={row.mt_balance}>{row.mt_balance}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "credit",
      selector: (row) => {
        return <span title={row.mt_credit}>{row.mt_credit}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "equity",
      selector: (row) => {
        return <span title={row.mt_equity}>{row.mt_equity}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "free margin",
      selector: (row) => {
        return <span title={row.mt_free_margin}>{row.mt_free_margin}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
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
      wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Main Password",
      selector: (row) => {
        return <span title={row.main_pwd}>{row.main_pwd}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Investor Password",
      selector: (row) => {
        return <span title={row.investor_pwd}>{row.investor_pwd}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Status",
      selector: (row) => {
        return (
          <span
            title={
              row.status == "1"
                ? "APPROVED"
                : row.status == "2"
                ? "REJECTED"
                : "PENDING"
            }
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
      //  wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Send Mail",
      button: true,
      cell: (row) => {
        return (
          <div>
            {row.isLoader ? (
              <Button>
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
                onClick={(e) => {
                  confirmAlert({
                    customUI: ({ onClose }) => {
                      return (
                        <div className="custom-ui">
                          <h1>Are you sure?</h1>
                          <p>Do you want to send this mt5 account password?</p>
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
                                onClose();
                                row.isLoader = true;
                                var status = sendMT5PasswordMail(row);
                                if (status) {
                                  row.isLoader = false;
                                }
                              }}
                            >
                              Yes, Send it!
                            </Button>
                          </div>
                        </div>
                      );
                    },
                  });
                }}
              >
                <i className="material-icons">forward_to_inbox</i>
              </Button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  const positionColumn = [
    {
      name: "symbol",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Ticket",
      selector: (row) => {
        return <span title={row.order_no}>{row.order_no}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Time",
      selector: (row) => {
        return <span title={row.trade_time}>{row.trade_time}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Deal Type",
      selector: (row) => {
        return (
          <span title={row.trade_type}>
            {row.trade_type == "Buy" ? (
              <span className="status-text-approved">Buy</span>
            ) : (
              <span className="status-text-rejected">Sell</span>
            )}
          </span>
        );
      },
      sortable: true,
      //  wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "volume",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price",
      selector: (row) => {
        return <span title={row.trade_price}>{row.trade_price}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price sl",
      selector: (row) => {
        return <span title={row.stopLoss}>{row.stopLoss}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price Tp",
      selector: (row) => {
        return <span title={row.takeProfit}>{row.takeProfit}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price position",
      selector: (row) => {
        return <span title={row.trade_open_price}>{row.trade_open_price}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "swap",
      selector: (row) => {
        return <span title={row.swap}>{row.swap}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "profit",
      selector: (row) => {
        return <span title={row.trade_profit}>{row.trade_profit}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
  ];
  const positionColumnClose = [
    {
      name: "symbol",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Ticket",
      selector: (row) => {
        return <span title={row.order_no}>{row.order_no}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Open Time",
      selector: (row) => {
        return <span title={row.trade_time}>{row.trade_time}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Close Time",
      selector: (row) => {
        return <span title={row.trade_closetime}>{row.trade_closetime}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Deal Type",
      selector: (row) => {
        return (
          <span title={row.trade_type}>
            {row.trade_type == "Buy" ? (
              <span className="status-text-approved">Buy</span>
            ) : (
              <span className="status-text-rejected">Sell</span>
            )}
          </span>
        );
      },
      sortable: true,
      //  wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "volume",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "Open price",
      selector: (row) => {
        return <span title={row.trade_open_price}>{row.trade_open_price}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "close price",
      selector: (row) => {
        return <span title={row.trade_price}>{row.trade_price}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price sl",
      selector: (row) => {
        return <span title={row.stopLoss}>{row.stopLoss}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price Tp",
      selector: (row) => {
        return <span title={row.takeProfit}>{row.takeProfit}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "price position",
      selector: (row) => {
        return <span title={row.trade_open_price}>{row.trade_open_price}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "swap",
      selector: (row) => {
        return <span title={row.swap}>{row.swap}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "profit",
      selector: (row) => {
        return <span title={row.trade_profit}>{row.trade_profit}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
  ];
  const bankColumn = [
    {
      name: "Sr.No",
      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      reorder: true,
      minWidth: "72px",

      grow: 0.1,
    },
    {
      name: "BENEFICIARY NAME",
      selector: (row) => {
        return (
          <span title={row.bank_account_holder_name}>
            {row.bank_account_holder_name}
          </span>
        );
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 1.5,
      minWidth: "112px",
    },
    {
      name: "BANK NAME",
      selector: (row) => {
        return <span title={row.bank_name}>{row.bank_name}</span>;
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "currency",
      selector: (row) => {
        return <span title={row.currency}>{row.currency}</span>;
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 0.2,
    },
    {
      name: "Account Number",
      selector: (row) => {
        return (
          <span title={row.bank_account_number}>{row.bank_account_number}</span>
        );
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 1.5,
    },
    {
      name: "Swift Code",
      selector: (row) => {
        return <span title={row.swift_code}>{row.swift_code}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "IBAN/IFSC",
      selector: (row) => {
        return (
          <a className="linkColor" title={row.bank_ifsc}>
            {row.bank_ifsc}
          </a>
        );
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "PROOF",
      selector: (row) => {
        return row.proof != "" ? (
          <CustomImageModal
            image={row.upload_proof}
            isIcon={true}
            className="tableImg"
          />
        ) : (
          ""
        );
      },
      reorder: true,
      grow: 0.2,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.bank_status == "1"
                ? "status-text-approved"
                : row.bank_status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.bank_status == "1"
                ? "Approved"
                : row.bank_status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.bank_status == "1"
              ? "Approved"
              : row.bank_status == "2"
              ? "Rejected"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      wrap: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div>
            {permission.delete_user_bank == 1 ? (
              <Button
                className="deleteBank cursor-pointer p-0 p-md-2 rounded-circle text-muted"
                onClick={(e) => openDialogbox(e, row)}
              >
                {/* <DeleteIcon
                className="deleteBank"
                sx={{ color: "red" }}
                onClick={(e) => openDialogbox(e, row)}
              />
              delete */}
                <i
                  className="material-icons deleteBank"
                  onClick={(e) => openDialogbox(e, row)}
                  style={{ color: "red" }}
                >
                  delete
                </i>
              </Button>
            ) : (
              ""
            )}

            {permission.update_user_bank == 1 ? (
              <>
                {row.bank_status == "2" ? (
                  <Button
                    className="add_bank cursor-pointer mx-3 p-0 p-md-2 rounded-circle text-muted "
                    onClick={(e) => openDialogbox(e, row)}
                  >
                    <i
                      className="material-icons add_bank"
                      onClick={(e) => openDialogbox(e, row)}
                      style={{ color: "green" }}
                    >
                      edit
                    </i>
                    {/* <CreateIcon sx={{ color: "green" }} className="add_bank" onClick={(e) => openDialogbox(e, row)}/> */}
                    {/* edit */}
                  </Button>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
      reorder: true,
      grow: 3,
    },
  ];

  const activityColumn = [
    {
      name: "SR NO",
      selector: (row) => row.sr_no,
      reorder: true,
      minWidth: "72px",
      grow: 0.4,
    },

    {
      name: "IP ADDRESS",
      selector: (row) => row.ip_address,
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "DATETIME",
      selector: (row) => row.added_datetime,
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
  ];

  const referralsColumn = [
    {
      name: "Name",
      selector: (row) => row.structure_name,
      sortable: true,
      reorder: true,
      grow: 0.4,
    },

    {
      name: "Client Type",
      selector: (row) => row.client_type,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Account",
      selector: (row) => row.mt5_acc_no,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Commission",
      selector: (row) => row.group_commission,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Rebate",
      selector: (row) => row.group_rebate,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "Parent Name",
      selector: (row) => row.sponsor_name,
      sortable: true,
      reorder: true,
      grow: 1,
    },
  ];

  const partnershipcolumn = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "USER NAME",
      selector: (row) => {
        return (
          <span title={row.requested_user_name}>{row.requested_user_name}</span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.date}>{row.date}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.6,
    },
    {
      name: "ACQUIRE CLIENT",
      selector: (row) => {
        return <span title={row.acquire_client}>{row.acquire_client}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "COUNTRY",
      selector: (row) => {
        return <span title={row.countries}>{row.countries}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Sponsor Name",
      selector: (row) => {
        return <span title={row.sponsor_name}>{row.sponsor_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },

    {
      name: "STRUCTURE NAME",
      selector: (row) => {
        return <span title={row.structure_name}>{row.structure_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "REFFEERED",
      selector: (row) => {
        return (
          <span title={row.structure_name}>
            {row.is_reffered == "0" ? "NO" : "YES"}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "WEBSITE",
      selector: (row) => {
        return (
          <span title={row.is_website}>
            {row.is_website == "0" ? "NO" : "YES"}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "REMARK",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "SPONSOR APPROVE",
      selector: (row) => {
        return (
          <span
            title={row.sponsor_approve}
            className={`text-color-${
              row.sponsor_approve == "1"
                ? "green"
                : row.sponsor_approve == "2"
                ? "red"
                : "yellow"
            }`}
          >
            {row.sponsor_approve == "1"
              ? "APPROVED"
              : row.sponsor_approve == "2"
              ? "REJECTED"
              : "PENDING"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "ADMIN APPROVE",
      selector: (row) => {
        return (
          <span
            title={row.admin_approve}
            className={`text-color-${
              row.admin_approve == "1"
                ? "green"
                : row.admin_approve == "2"
                ? "red"
                : "yellow"
            }`}
          >
            {row.admin_approve == "1"
              ? "APPROVED"
              : row.admin_approve == "2"
              ? "REJECTED"
              : "PENDING"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 1,
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
      wrap: true,
      grow: 1,
    },
    {
      name: "ACTION",
      selector: (row) => {
        return (
          <span title={row.structure_name}>
            {" "}
            {row.sponsor_approve == "1" ? (
              ""
            ) : (
              <Button
                sx={{ color: "black" }}
                onClick={() => {
                  viewRequest(row);
                }}
              >
                <i className="material-icons">view_timeline</i>
              </Button>
            )}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];

  const [ibdata, setIbData] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [getStructuresList, setGetStructuresList] = useState([]);
  const [viewCpPassword, setViewCpPassword] = useState({
    cp_password: "",
  });
  const [changePassword, setChangePassword] = useState({
    password: "",
    new_password: "",
    isLoader: false,
  });
  const [chinputinfoTrue, setchinputinfoTrue] = useState({
    password: false,
    new_password: false,
  });

  const [pammAccess, setPammAccess] = useState({
    status: "",
    isLoader: false,
  });
  const [updateDate, setUpdateDate] = useState({
    structure_id: "",
    sponsor_approve: "",
    remarks: "",
    isLoader: false,
    refresh: false,
  });
  const [refreshCreatePortfolio1, SetRefreshCreatePortfolio1] = useState(false);
  const [createPortfolioForm, setCreatePortfolioForm] = useState({
    isLoader: false,
    portfolio_name: "",
    mm_mt5_acc_id: "",
    investment_months: "",
  });
  const [cpinputinfoTrue, setcpinputinfoTrue] = useState({
    portfolio_name: false,
    mm_mt5_acc_id: false,
    investment_months: false,
  });
  const [investmentForm, setInvestmentForm] = useState({
    isLoader: false,
    user_id: "",
    pid: "",
    amount: "",
  });
  const [withdrawForm, setWithdrawForm] = useState({
    isLoader: false,
    allWithdraw: true,
    amount: "",
    pid: "",
  });

  const input01 = (event) => {
    const { name, value } = event.target;
    setUpdateDate((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const [permission, setPermission] = useState({
    unlink_client: 0,
    update_user_bank: 0,
    delete_user_bank: 0,
    update_kyc: 0,
    view_portfolio_details: 0,
    view_money_manager_profile: 0,
    create_portfolio: 0,
    add_investment: 0,
    withdraw_request: 0,
    update_basic_information: 0,
    update_employement_status: 0,
    link_client: 0,
    unlink_ib: 0,
    send_mail: 0,
    update_cp_access: 0,
    view_cp_password: 0,
    change_password: 0,
    update_is_pamm: 0,
    add_new_notes: 0,
    add_deposit: 0,
    add_withdraw: 0,
    internal_transfer: 0,
    mt5_credit_debit: 0,
    add_user_bank: 0,
    create_mt5_account: 0,
    check_mt5_status: 0,
    change_mt5_leverage: 0,
    change_mt5_password: 0,
    mt5_link: 0,
    mt5_reset: 0,
    link_ib: 0,
    change_assigned_rebate: 0,
    mt5_access: 0,
    insert_strcuture_master: 0,
    update_strcuture_master: 0,
    change_user_group: 0,
    transaction_access: 0,
    my_portfolios: 0,
    money_manager_accounts: 0,
    my_money_managers: 0,
    pamm_trade_history: 0,
    pamm_withdraw_request: 0,
    get_bank_list: 0,
    get_general_information: 0,
    get_general_informationShow: 0,
    get_kyc_status: 0,
    get_my_assigned_structure: 0,
    list_my_structures: 0,
    log_list: 0,
    mt5_account_list: 0,
    my_traders: 0,
    notes_list: 0,
    view_login_activities: 0,
    view_pamm_dashboard: 0,
    wallet_history: 0,
    delete_master_structure: 0,
  });
  const getpermissions = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "get_client_permissions");
    await axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "ok") {
          permission.delete_master_structure =
            res.data.button_permissions.delete_master_structure;
          permission.update_user_bank =
            res.data.button_permissions.update_user_bank;
          permission.delete_user_bank =
            res.data.button_permissions.delete_user_bank;
          permission.update_kyc = res.data.button_permissions.update_kyc;
          permission.view_portfolio_details =
            res.data.button_permissions.view_portfolio_details;
          permission.create_portfolio =
            res.data.button_permissions.create_portfolio;
          permission.add_investment =
            res.data.button_permissions.add_investment;
          permission.withdraw_request =
            res.data.button_permissions.withdraw_request;
          permission.update_basic_information =
            res.data.button_permissions.update_basic_information;
          permission.update_employement_status =
            res.data.button_permissions.link_client;
          permission.view_money_manager_profile =
            res.data.button_permissions.view_money_manager_profile;
          permission.link_client = res.data.button_permissions.link_client;
          permission.unlink_ib = res.data.button_permissions.unlink_ib;
          permission.send_mail = res.data.button_permissions.send_mail;
          permission.update_cp_access =
            res.data.button_permissions.update_cp_access;
          permission.view_cp_password =
            res.data.button_permissions.view_cp_password;
          permission.change_password =
            res.data.button_permissions.change_password;
          permission.update_is_pamm =
            res.data.button_permissions.update_is_pamm;
          permission.add_new_notes = res.data.button_permissions.add_new_notes;
          permission.add_deposit = res.data.button_permissions.add_deposit;
          permission.add_withdraw = res.data.button_permissions.add_withdraw;
          permission.internal_transfer =
            res.data.button_permissions.internal_transfer;
          permission.mt5_credit_debit =
            res.data.button_permissions.mt5_credit_debit;
          permission.add_user_bank = res.data.button_permissions.add_user_bank;
          permission.create_mt5_account =
            res.data.button_permissions.create_mt5_account;
          permission.check_mt5_status =
            res.data.button_permissions.check_mt5_status;
          permission.change_mt5_leverage =
            res.data.button_permissions.change_mt5_leverage;
          permission.change_mt5_password =
            res.data.button_permissions.change_mt5_password;
          permission.mt5_link = res.data.button_permissions.mt5_link;
          permission.mt5_reset = res.data.button_permissions.mt5_reset;
          permission.insert_strcuture_master =
            res.data.button_permissions.insert_strcuture_master;
          permission.update_strcuture_master =
            res.data.button_permissions.update_strcuture_master;
          permission.change_user_group =
            res.data.button_permissions.change_user_group;
          permission.block_unblock_user =
            res.data.button_permissions.block_unblock_user;
          permission.transaction_access =
            res.data.button_permissions.transaction_access;
          permission.link_ib = res.data.button_permissions.link_ib;
          permission.mt5_access = res.data.button_permissions.mt5_access;
          permission.money_manager_accounts =
            res.data.pamm_tab_permissions.money_manager_accounts;
          permission.my_money_managers =
            res.data.pamm_tab_permissions.my_money_managers;
          permission.pamm_trade_history =
            res.data.pamm_tab_permissions.pamm_trade_history;
          permission.pamm_withdraw_request =
            res.data.pamm_tab_permissions.pamm_withdraw_request;
          // permission.view_pamm_dashboard =
          //   res.data.pamm_tab_permissions.view_pamm_dashboard;
          permission.get_bank_list = res.data.tab_permissions.get_bank_list;
          permission.unlink_client = res.data.button_permissions.unlink_client;
          permission.get_general_information =
            res.data.tab_permissions.get_general_information;
          permission.get_general_informationShow =
            res.data.button_permissions.get_general_information;
          permission.get_kyc_status = res.data.tab_permissions.get_kyc_status;
          permission.get_my_assigned_structure =
            res.data.tab_permissions.get_my_assigned_structure;
          permission.list_my_structures =
            res.data.tab_permissions.list_my_structures;
          permission.log_list = res.data.tab_permissions.log_list;
          permission.mt5_account_list =
            res.data.tab_permissions.mt5_account_list;
          permission.my_traders = res.data.tab_permissions.my_traders;
          permission.notes_list = res.data.tab_permissions.notes_list;
          permission.view_login_activities =
            res.data.tab_permissions.view_login_activities;
          permission.view_pamm_dashboard =
            res.data.tab_permissions.view_pamm_dashboard;
          permission.wallet_history = res.data.tab_permissions.wallet_history;
          permission.my_portfolios =
            res.data.pamm_tab_permissions.my_portfolios;
          permission.change_assigned_rebate =
            res.data.button_permissions.change_assigned_rebate;
          setPermission({ ...permission });

          if (res.data.tab_permissions.get_general_information == 1) {
            getProfilePageData();
          }
        }
      });
  };

  const checkIfscCode = () => {
    if (bankAccountForm.iban_number == "") {
      toast.error("iban/IFSC code is requied");
    } else {
      bankAccountForm.visLoader = true;
      setBankAccountForm({ ...bankAccountForm });
      const param = new FormData();
      param.append("ifsc_code", bankAccountForm.iban_number);
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      // bankAccountForm.visLoader = true;
      // setBankAccountForm({ ...bankAccountForm });
      axios.post(`${Url}/ajaxfiles/check_ifsc_code.php`, param).then((res) => {
        if (res.data.status == "error") {
          toast.error(res.data.message);
          bankAccountForm.visLoader = false;
          setBankAccountForm({ ...bankAccountForm });
        } else {
          toast.success(res.data.message);
          bankAccountForm.ifscdata = res.data.bank_data;
          bankAccountForm.visLoader = false;
          bankAccountForm.show = true;
          setBankAccountForm({ ...bankAccountForm });
        }
      });
    }
  };
  const updatePartnership = () => {
    if (updateDate.sponsor_approve == "") {
      toast.error("Status is required");
    } else if (updateDate.remarks == "") {
      toast.error("Remark is required");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("action", "update_partnership_request");
      param.append("ib_application_id", ibdata.ib_application_id);
      param.append("structure_id", updateDate.structure_id);
      param.append("sponsor_approve", updateDate.sponsor_approve);
      param.append("remarks", updateDate.remarks);
      setUpdateDate((prevalue) => {
        return {
          ...prevalue,
          isLoader: true,
        };
      });
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            setUpdateDate((prevalue) => {
              return {
                ...prevalue,
                isLoader: false,
              };
            });
          } else {
            toast.success(res.data.message);
            setUpdateDate((prevalue) => {
              return {
                ...prevalue,
                isLoader: false,
                refresh: !updateDate.refresh,
              };
            });
            setOpenModel(false);
          }
        });
    }
  };

  const viewRequest = (prop) => {
    setOpenModel(true);
    setIbData(prop);
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "get_my_structure");
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setGetStructuresList(res.data.data);
      });
  };

  const noteColumn = [
    {
      name: "SR NO",
      selector: (row) => row.sr_no,
      sortable: true,
      reorder: true,
      minWidth: "72px",

      grow: 0.4,
    },

    {
      name: "Description",
      selector: (row) => row.notes,
      sortable: true,
      reorder: true,
      grow: 3,
    },
    {
      name: "DATE - TIME",
      selector: (row) => row.date,
      sortable: true,
      reorder: true,
      grow: 1,
    },
  ];

  const logColumn = [
    {
      name: "SR NO",
      selector: (row) => row.sr_no,
      reorder: true,
      minWidth: "72px",

      grow: 0.4,
    },

    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 3,
    },
    {
      name: "DATE - TIME",
      selector: (row) => row.date,
      sortable: true,
      //  wrap: true,
      reorder: true,
      grow: 1,
    },
  ];

  const walletHistoryColumn = [
    {
      name: "SR.NO",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      minWidth: "72px",

      grow: 0.1,
    },
    {
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.date}>
            <NewDate newDate={row.date} />
          </span>
        );
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "type",
      selector: (row) => {
        return <span title={row.entry_type}>{row.entry_type}</span>;
      },
      reorder: true,
      sortable: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "FROM ACCOUNT",
      selector: (row) => {
        return <span title={row.from_account}>{row.from_account}</span>;
      },
      reorder: true,
      sortable: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "TO ACCOUNT",
      selector: (row) => {
        return <span title={row.to_account}>{row.to_account}</span>;
      },
      reorder: true,
      sortable: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "TRANSFER TO NAME",
      selector: (row) => {
        return <span title={row.transfer_to_name}>{row.transfer_to_name}</span>;
      },
      reorder: true,
      sortable: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "payment method",
      selector: (row) => {
        return <span title={row.payment_method}>{row.payment_method}</span>;
      },
      reorder: true,
      sortable: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "AMOUNT",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      reorder: true,
      // sortable: true,
      wrap: true,
      grow: 0.4,
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
      wrap: true,
      grow: 0.1,
    },
  ];

  const pammWithdrawHistoryColumn = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
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
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Investor NAME",
      selector: (row) => {
        return <span title={row.investor_name}>{row.investor_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Portfolio Name",
      selector: (row) => {
        return <span title={row.portfolio_name}>{row.portfolio_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Account NAME",
      selector: (row) => {
        return <span title={row.mt5_name}>{row.mt5_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Portfolio Id",
      selector: (row) => {
        return <span title={row.portfolio_id}>{row.portfolio_id}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Amount",
      selector: (row) => {
        return <span title={"$" + row.amount}>{"$" + row.amount}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Approved Date",
      selector: (row) => {
        return (
          <span title={row.approved_datetime}>
            <NewDate newDate={row.approved_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={
              row.withdrawal_status == "0"
                ? "Pending"
                : row.withdrawal_status == "1"
                ? "Approves"
                : "Rejected"
            }
            className={`status-text-${
              row.withdrawal_status == "0"
                ? "pending"
                : row.withdrawal_status == "1"
                ? "approved"
                : "rejected"
            }`}
          >
            {row.withdrawal_status == "0"
              ? "Pending"
              : row.withdrawal_status == "1"
              ? "Approves"
              : "Rejected"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
  ];

  const pammTradeHistoryColumn = [
    {
      name: "Portfolio Id",
      selector: (row) => {
        return <span title={row.portfolio_id}>{row.portfolio_id}</span>;
      },
      reorder: true,
      grow: 1,
    },
    {
      name: "Portfolio Name",
      selector: (row) => {
        return <span title={row.portfolio_name}>{row.portfolio_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <span title={row.trade_datetime}>
            <NewDate newDate={row.trade_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Symbol",
      selector: (row) => {
        return <span title={row.symbol}>{row.symbol}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <span
            title={row.action}
            className={`text-color-${row.action == "Buy" ? "green" : "red"}`}
          >
            {row.action}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Price",
      selector: (row) => {
        return <span title={row.price}>{row.price}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Profit",
      selector: (row) => {
        return (
          <span
            title={row.profit}
            className={`text-color-${row.profit >= 0 ? "green" : "red"}`}
          >
            {row.profit}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "Lot",
      selector: (row) => {
        return <span title={row.volume}>{row.volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
  ];

  const pammMyManagerColumn = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      reorder: true,
      grow: 0.1,
    },
    {
      name: "ACCOUNT NAME",
      selector: (row) => {
        return <span title={row.account_name}>{row.account_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      //  wrap: true,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      //  wrap: true,
    },
    {
      name: "MOBILE",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      //   wrap: true,
    },
    {
      name: "TOTAL DEPOSIT",
      selector: (row) => {
        return (
          <span title={"$" + row.total_deposit}>{"$" + row.total_deposit}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      //  wrap: true,
    },
    {
      name: "DATETIME",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
  ];
  const [deleteBankDetail, setdeleteBankDetail] = useState({
    bank_id: "",
    isLoader: "",
  });
  const getAccountList = async () => {
    const param = new FormData();
    param.append("user_id", id);
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_mt5_disable_account_list_live");

    await axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setMt5AccountList(res.data.data);
      });
  };

  const getMasterStructureList = () => {
    const param = new FormData();
    param.append("user_id", id);
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_my_structures");

    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setStructureList((preValue) => {
          return {
            ...preValue,
            data: res.data.data,
          };
        });
      });
  };

  const getMasterStructure2 = (res) => {
    const param1 = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param1.append("user_id", id);

    if (res !== null) {
      if (res == "add_new_structure_data") {
        param1.append("action", res);
      } else {
        param1.append("structure_id", res);
        param1.append("action", "get_master_structure");
      }
    }

    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param1)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setMasterStructureData(res.data.data);
      });
  };

  const forinloop = () => {
    var html = [];
    for (let x in masterStructureData.pair_data) {
      html.push(
        <div className="structureInputSection">
          <hr className="solid" />
          <br />

          <Grid container>
            <Grid item md={4} lg={4} xl={4} className="label-center">
              <label>{x}</label>
            </Grid>
            <Grid item md={8} lg={8} xl={8}>
              <Grid container spacing={1}>
                {masterStructureData.pair_data[x].map((item1, index1) => {
                  return (
                    <>
                      <Grid item md={4} lg={4} xl={4}>
                        <label>{item1.pair_name}</label>
                      </Grid>
                      <Grid item md={4} lg={4} xl={4}>
                        <input
                          value={item1.rebate}
                          type="text"
                          className=""
                          placeholder="Rebate"
                          onChange={(e) => {
                            masterStructureData["pair_data"][x][index1][
                              "rebate"
                            ] = e.target.value;
                            setMasterStructureData({
                              ...masterStructureData,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item md={4} lg={4} xl={4}>
                        <input
                          value={item1.commission}
                          type="text"
                          className=""
                          placeholder="Commission"
                          onChange={(e) => {
                            masterStructureData["pair_data"][x][index1][
                              "commission"
                            ] = e.target.value;
                            setMasterStructureData({
                              ...masterStructureData,
                            });
                          }}
                        />
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
    return html;
  };

  const getMasterStructure = (res) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    if (res) {
      param.append("structure_id", res);
      param.append("action", "get_my_structure");
    } else {
      param.append("action", "get_default_structure");
      // param.append("action", "add_new_structure_data");
    }
    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        newMasterStructureData.structure_data = res.data.data;
        newMasterStructureData.structure_dataOld = res.data.data1;

        setNewMasterStructureData({ ...newMasterStructureData });
        // setMasterStructureData(res.data.data);
        // setStructureList((preValue) => {
        //   return {
        //     ...preValue,
        //     data: res.data.data,
        //   };
        // });
      });
  };

  const getPartnershipMasterStructure = (res) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    if (res) {
      param.append("structure_id", res);
      param.append("action", "get_my_structure");
    } else {
      param.append("action", "get_default_structure");
      // param.append("action", "add_new_structure_data");
    }
    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((resData) => {
        if (resData.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res) {
          partnershipMasterStructureData.structure_data = resData.data.data;
          partnershipMasterStructureData.structure_dataOld = resData.data.data1;
          setPartnershipMasterStructureData({
            ...partnershipMasterStructureData,
          });
        } else {
          newPartnershipMasterStructureData.structure_data = resData.data.data;
          setNewPartnershipMasterStructureData({
            ...newPartnershipMasterStructureData,
          });
        }
      });
  };

  const getBankList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    // param.append("action", "view_bank_details");
    param.append("action", "withdrawal_payment_methods");

    axios.post(Url + "/ajaxfiles/common_api.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      setAllBank(res.data.data);
    });
  };
  const getDepositList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    // param.append("action", "view_bank_details");
    param.append("action", "deposit_methods");

    axios.post(Url + "/ajaxfiles/common_api.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      setDepositMethods(res.data.data);
    });
  };

  const getwalletBalance = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "view_balance");
    axios.post(Url + "/ajaxfiles/internal_transfer.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      setWalletBal(res.data.formated_balance);
    });
  };

  const getCurrency = (row) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "get_bank_currency");
    axios.post(Url + "/ajaxfiles/common_api.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "ok") {
        if (row) {
          setBankAccountForm({
            ...bankAccountForm,
            ibanselect: row.is_bank_ifsc_iban,
            ifscdata: {},
            isLoader: false,
            visLoader: false,
            show: false,
            swift_code: row.swift_code,
            currency: row.currency,
            confirm_account_number: row.bank_account_number,
            name: row.bank_name,
            bank_proof: "",
            bank_proof_preview: row.upload_proof,
            currencyArray: res.data.data,
            bank_name: row.bank_account_holder_name,
            iban_number: row.bank_ifsc,
            account_number: row.bank_account_number,
            user_bank_id: row.user_bank_id,
          });
        } else {
          setBankAccountForm({
            ...bankAccountForm,
            ibanselect: "IFSC",
            ifscdata: {},
            isLoader: false,
            visLoader: false,
            show: false,
            bank_proof: "",
            bank_proof_preview: "",
            swift_code: "",
            currency: "",
            confirm_account_number: "",
            name: "",
            currencyArray: res.data.data,
            bank_name: "",
            iban_number: "",
            account_number: "",
            user_bank_id: "",
          });
        }
      }

      // (res.data.formated_balance);
    });
  };

  const getMtBalance = (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("from_mt5_account_id", prop);
    param.append("action", "view_mt5_balance");
    axios.post(Url + "/ajaxfiles/internal_transfer.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      setMtBalance(res.data.formated_balance);
    });
  };

  const getMt5LivePackages = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    await axios
      .post(Url + "/ajaxfiles/get_mt5_live_packages.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setCreateLiveType(res.data.data);
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (newValue == 7 && userData.data.is_ib_account != "0") {
      setReferralData({
        data: [],
        structure_name: "",
        structure_id: "",
      });
      setPartnershipMasterStructureData({
        structure_name: "",
        structure_data: [],
        structure_id: "",
        isLoader: false,
      });
      getMasterStructureList();
    }

    if (newValue == 8 && userData.data.is_ib_account != "0") {
      setPartnershipMasterStructureData({
        structure_name: "",
        structure_data: [],
        structure_id: "",
        isLoader: false,
      });
      getMasterStructureList();
    }

    if (newValue == 11) {
      getMyTraders();
    }

    if (newValue == 9) {
      getMyAssignedStructure();
    }

    if (newValue == 12 && userData.data.is_pamm == "1") {
      if (permission.view_pamm_dashboard == 1) {
        getPammDashboard();
        setPammGroupButton("dashboard");
      } else if (
        permission.view_pamm_dashboard == 0 &&
        (permission.money_manager_accounts == 1 ||
          permission.my_portfolios == 1)
      ) {
        getMoneyManager();
        setPammPortfolioGroupButton("money_manager");
        setPammGroupButton("portfolio_manage");
      } else if (
        permission.pamm_trade_history == 1 &&
        permission.view_pamm_dashboard == 0 &&
        (permission.money_manager_accounts == 0 ||
          permission.my_portfolios == 1)
      ) {
        setPammGroupButton("trade_history");
      } else if (
        permission.pamm_withdraw_request == 1 &&
        permission.view_pamm_dashboard == 0 &&
        (permission.money_manager_accounts == 0 ||
          permission.my_portfolios == 0) &&
        permission.pamm_trade_history == 0
      ) {
        setPammGroupButton("withdraw_history");
      }
      // getMoneyManagerList();
    }

    // if (
    //   newValue == 8 &&
    //   userData.data.is_pamm == "1" &&
    //   userData.data.is_ib_account == "0"
    // ) {
    //   getPammDashboard();
    //   setPammGroupButton("dashboard");
    //   // getMoneyManagerList();
    // }
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const openDialogbox = (e, row) => {
    if (e.target.classList.contains("createMt5")) {
      getMt5LivePackages();
      setDialogTitle("Create MT5 Account");
      setCreateMt5Form({
        account_type: "",
        account_option: "",
        mt5_balance: "",
        confirm_password: GenerateStrongPassword(8),
        password: GenerateStrongPassword(8),
        isLoader: false,
      });
      setinputinfoTrue({
        account_type: false,
        account_option: false,
        confirm_password: false,
        password: false,
        mt5_balance: false,
      });
    } else if (e.target.classList.contains("deleteBank")) {
      setDialogTitle("Delete Bank");
      setdeleteBankDetail({
        bank_id: row.user_bank_id,
        isLoader: false,
      });
    } else if (e.target.classList.contains("mt5_access")) {
      getAccountList();
      setDialogTitle("MT5 Access");
      setMt5AccessForm({
        account_type: "",
        status: "",
        isLoader: false,
      });
      setinput1infoTrue({
        account_type: false,
        status: false,
      });
    } else if (e.target.classList.contains("link_mt5")) {
      getMt5LivePackages();
      setDialogTitle("Link Existing Account");
      let tempPass = GenerateStrongPassword(8);
      setLinkAccountForm({
        account_number: "",
        account_type: "",
        account_option: "",
        password: tempPass,
        confirm_password: tempPass,
        isLoader: false,
      });
      setinput2infoTrue({
        account_number: false,
        account_type: false,
        account_name: false,
        account_option: false,
        password: false,
        confirm_password: false,
      });
    } else if (e.target.classList.contains("reset_mt5")) {
      getAccountList();
      setDialogTitle("Reset MT5 Password");
      setResetMt5PasswordForm({
        mt5_id: "",
        isLoader: false,
      });
    } else if (e.target.classList.contains("change_leverage")) {
      getAccountList();
      getLeverages();
      setDialogTitle("Change Account leverage");
      setChangeLeverageForm({
        account: "",
        leverage: "",
        isLoader: false,
      });
      setinput4infoTrue({
        account: false,
        leverage: false,
      });
    } else if (e.target.classList.contains("change_mt5_group")) {
      getAccountList();
      setDialogTitle("Change MT5 Group");
      setChGroup({
        mt5_account_id: "",
        mt5_group_id: "",
        selectedGroup: "",
        groupList: [],
        isLoader: false,
      });
      setChGrouptruefalse({
        mt5_account_id: false,
        mt5_group_id: false,
      });
    } else if (e.target.classList.contains("add_master_structure")) {
      setDialogTitle("Add Master Structure");
      newMasterStructureData.structure_name = "";
      newMasterStructureData.structure_data = [];
      newMasterStructureData.structure_id = "";
      newMasterStructureData.isLoader = false;
      setNewMasterStructureData({ ...newMasterStructureData });
      getMasterStructure();
      setmasterStructureForm({
        name: "",
        forex_rebate: "",
        forex_commission: "",
        bullion_rebate: "",
        bullion_commission: "",
        indices_rebate: "",
        indices_commission: "",
        energy_rebate: "",
        energy_commission: "",
        crypto_rebate: "",
        crypto_commission: "",
      });
    } else if (e.target.classList.contains("edit_master_structure")) {
      setDialogTitle("Edit Master Structure");
      newMasterStructureData.structure_name = "";
      newMasterStructureData.structure_data = [];
      newMasterStructureData.structure_id = "";
      newMasterStructureData.isLoader = false;
      setNewMasterStructureData({ ...newMasterStructureData });
      getMasterStructureList();
      setMasterStructureData([]);
      setmasterStructureForm({
        name: "",
        forex_rebate: "",
        forex_commission: "",
        bullion_rebate: "",
        bullion_commission: "",
        indices_rebate: "",
        indices_commission: "",
        energy_rebate: "",
        energy_commission: "",
        crypto_rebate: "",
        crypto_commission: "",
      });
    } else if (e.target.classList.contains("add_shared_structure")) {
      setDialogTitle("ADD SHARED STRUCTURE");
      setSharedStructureForm({
        name: "",
        total_rebate: "",
        total_commission: "",
        list: [
          {
            id: "",
            name: "",
            value: "",
          },
        ],
      });
    } else if (e.target.classList.contains("link_client")) {
      getSalesList();
      setDialogTitle("Link Client");
      setLinkClientForm({
        client: "",
        structure: "",
        list: [],
      });
      getLinkClientList();
    } else if (e.target.classList.contains("moveToIB")) {
      setDialogTitle("Move IB to IB");
      setMoveToIb({
        list: [],
        isLoader: true,
        ibName: "",
      });
      getMoveIBList();
    } else if (e.target.classList.contains("link_ib")) {
      setDialogTitle("Link To IB");
      setLinkIBForm({
        master_account: "",
        customer_name: "",
        structure: "",
        list: [],
      });
      getIBUserList();
    } else if (e.target.classList.contains("unlink_ib")) {
      // setDialogTitle("Convert to client");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to Convert to client?</p>
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
                    unlinkIB();
                    onClose();
                  }}
                >
                  Yes, Convert to client!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("unlink_client")) {
      // setDialogTitle("Convert to client");
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to Unlink Client?</p>
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
                    unlinkClient();
                    onClose();
                  }}
                >
                  Yes, Unlink Client!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("send_email")) {
      setDialogTitle("Send Email");
      setsendMailinputinfoTrue({
        to: false,
        subject: false,
        template_title: false,
        language: false,
        template: false,
      });
      setsendMailForm({
        from: "",
        to: profileForm.email,
        subject: "",
        template_title: "",
        language: "",
        template: "",
        body: "",
        isLoader: false,
      });
    } else if (e.target.classList.contains("cp_access")) {
      setDialogTitle("Control Panel Access");
      setCpAccessForm({
        status: "",
      });
      getCpAccessSetting();
    } else if (e.target.classList.contains("view_cp_password")) {
      setDialogTitle("View Control Panel Access Password");
      viewCPPassword();
    } else if (e.target.classList.contains("download_application")) {
      setDialogTitle("Download Client PDF");
    } else if (e.target.classList.contains("add_note")) {
      setDialogTitle("Add New Note");
      setNoteForm({
        notes: "",
        call_status: "",
        set_reminder: false,
        date: "",
        isLoader: false,
      });
    } else if (e.target.classList.contains("add_bank")) {
      if (row) {
        setDialogTitle("Edit Account");
        setbankIinfoTrue({
          name: false,
          bank_name: false,
          bank_address: false,
          iban_number: false,
          account_number: false,
          confirm_account_number: false,
        });

        getCurrency(row);
      } else {
        getCurrency();
        setDialogTitle("Add Account");
        setbankIinfoTrue({
          name: false,
          bank_name: false,
          bank_address: false,
          iban_number: false,
          account_number: false,
          confirm_account_number: false,
        });
        setBankAccountForm({
          name: "",
          bank_name: "",
          iban_number: "",
          account_number: "",
          swift_code: "",
          currency: "",
          bank_proof: "",
          bank_proof_preview: "",
          currencyArray: [],
          show: false,
          ibanselect: "IFSC",
          ifscdata: {},
          bank_proof: "",
          bank_proof_preview: "",
          confirm_account_number: "",
          visLoader: false,
          isLoader: false,
        });
      }
    } else if (e.target.classList.contains("add_transaction")) {
      getwalletBalance();
      getBankList();
      getDepositList();
      getAccountList();
      setDialogTitle("Add New Transaction");
      setTransactionForm({
        type: "",
        payment_method: "",
        from_account_type: "",
        withdrawForm: "",
        credit_type: "",
        from_mt5_account_id: "",
        transfer_to: "",
        image: [],
        image_per: "",
        account: "",
        account_to: "",
        remark: "",
        admin_note: "",
        payment: "",
        amount: "",
        mt5_id: "",
        note: "",
        currency_code: "",
        isLoader: false,
        deposit_to: "",
        transation_id: "",
        wallet_code: "",
        mt5_account_id: "",
        user_bank_id: "",
        upi_name: "",
        upi_crypto_ac_number: "",
        crypto_name: "",
      });
      settrinputinfoTrue({
        type: false,
        from_account_type: false,
        mt5_id: false,
        credit_type: false,
        deposit_to: false,
        transfer_to: false,
        account: false,
        account_to: false,
        payment: false,
        payment_method: false,
        amount: false,
        note: false,
        currency_code: false,
        isLoader: false,
        transation_id: false,
        wallet_code: false,
        mt5_account_id: false,
        user_bank_id: false,
        upi_name: false,
        upi_crypto_ac_number: false,
        crypto_name: false,
      });
    } else if (e.target.classList.contains("link_campaign")) {
      setDialogTitle("Link to Campaign");
      setLinkCampaignForm({
        account: "",
        campaign: "",
      });
    } else if (e.target.classList.contains("edit_structure")) {
      setDialogTitle("EDIT STRUCTURE");
      partnershipMasterStructureData.isLoader = false;
      setPartnershipMasterStructureData({ ...partnershipMasterStructureData });
      setEditSharedStructureForm({
        name: "",
        total_rebate: "",
        total_commission: "",
        list: [
          {
            id: "",
            name: "",
            value: "",
          },
        ],
      });
    } else if (e.target.classList.contains("change_mt5_password")) {
      getAccountList();
      setDialogTitle("Change MT5 Password");
      let tempPass = GenerateStrongPassword(8);
      setChangeAccountPasswordForm({
        mt5_id: "",
        new_password: tempPass,
        confirm_password: tempPass,
        password_type: "",
        isLoader: "",
      });
      setinput5infoTrue({
        mt5_id: false,
        new_password: false,
        confirm_password: false,
        password_type: false,
      });
    } else if (e.target.classList.contains("change_password")) {
      setDialogTitle("Change Password");
      let tempPass = GenerateStrongPassword(8);
      setChangePassword({
        password: tempPass,
        new_password: tempPass,
        isLoader: false,
      });
      setchinputinfoTrue({
        password: false,
        new_password: false,
      });
    } else if (e.target.classList.contains("pamm_access")) {
      setDialogTitle("Pamm Access");
      setPammAccess({
        status: userData.data["is_pamm"],
        isLoader: false,
      });
    } else if (e.target.classList.contains("user-group")) {
      getUserGroupList();
      setDialogTitle("Groups");
    } else if (e.target.classList.contains("block_unblock")) {
      setDialogTitle("Block/Unblock");
      setUserBlockUnblockStatus({
        isLoader: false,
        status: "",
      });
      getUserBlockunblockSetting();
    }
    if (
      e.target.classList.contains("unlink_ib") ||
      e.target.classList.contains("unlink_client")
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
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
    navigate("/profile/" + e.name);
  };

  const manageContent = () => {
    if (dialogTitle == "Create MT5 Account") {
      return (
        <div>
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                inputinfoTrue.account_type && createMt5Form.account_type == ""
                  ? true
                  : false
              }
            >
              <InputLabel>Account Type</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account_type"
                value={createMt5Form.account_type}
                onChange={input}
                onBlur={inputtrueFalse}
              >
                <MenuItem value="1">Live</MenuItem>
                <MenuItem value="0">Demo</MenuItem>
              </Select>
              {inputinfoTrue.account_type &&
              createMt5Form.account_type == "" ? (
                <FormHelperText>Account Type is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                inputinfoTrue.account_option &&
                createMt5Form.account_option == ""
                  ? true
                  : false
              }
            >
              <InputLabel>Account option</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account_option"
                onChange={input}
                onBlur={inputtrueFalse}
              >
                {createMt5Form.account_type == "1" ? (
                  createLiveType.map((item) => {
                    return (
                      <MenuItem value={item.ib_group_level_id}>
                        {item.ib_group_name}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem value="1">DEMO</MenuItem>
                )}
              </Select>
              {inputinfoTrue.account_option &&
              createMt5Form.account_option == "" ? (
                <FormHelperText>Account option is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          {createMt5Form.account_type == "0" ? (
            <div className="padingtopmy5create">
              <TextField
                className="input-font-small"
                label="MT5 Balance"
                type="text"
                variant="standard"
                sx={{ width: "100%" }}
                name="mt5_balance"
                value={createMt5Form.mt5_balance}
                onBlur={inputtrueFalse}
                error={
                  inputinfoTrue.mt5_balance && createMt5Form.mt5_balance == ""
                    ? true
                    : false
                }
                helperText={
                  inputinfoTrue.mt5_balance && createMt5Form.mt5_balance == ""
                    ? "MT5 Balance is required"
                    : ""
                }
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    createMt5Form.mt5_balance = e.target.value;
                    setCreateMt5Form({ ...createMt5Form });
                  }
                }}
              />
            </div>
          ) : (
            ""
          )}
          {createMt5Form.account_type == "0" ||
          createMt5Form.account_type == "1" ? (
            <div className="padingtopmy5create">
              <TextField
                className="input-font-small hint-color-red"
                type={showPassword ? "text" : "password"}
                error={
                  (!createMt5Form.password.match(/[A-Z]/g) ||
                    !createMt5Form.password.match(/[a-z]/g) ||
                    !createMt5Form.password.match(/[0-9]/g) ||
                    createMt5Form.password == "" ||
                    createMt5Form.password.length < 8 ||
                    createMt5Form.password.length >= 20 ||
                    !createMt5Form.password.match(/[!@#$%^&*()_+=]/g)) &&
                  inputinfoTrue.password
                    ? true
                    : false
                }
                label={
                  createMt5Form.account_type == "0"
                    ? "Password"
                    : "Main Password"
                }
                variant="standard"
                onChange={input}
                onBlur={inputtrueFalse}
                value={createMt5Form.password}
                sx={{ width: "100%" }}
                name="password"
                helperText={
                  createMt5Form.password == "" && inputinfoTrue.password
                    ? "Enter your password"
                    : inputinfoTrue.password &&
                      (createMt5Form.password.length < 8 ||
                        createMt5Form.password.length >= 20)
                    ? "Password must contain atleast 8-20 characters"
                    : inputinfoTrue.password &&
                      (!createMt5Form.password.match(/[A-Z]/g) ||
                        !createMt5Form.password.match(/[a-z]/g) ||
                        !createMt5Form.password.match(/[0-9]/g) ||
                        !createMt5Form.password.match(/[!@#$%^&*()_+=]/g))
                    ? "Atleast one lower case, upper case,special character and number required"
                    : ""
                }
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
                // helperText="Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
              />
            </div>
          ) : (
            ""
          )}

          {createMt5Form.account_type == "0" ||
          createMt5Form.account_type == "1" ? (
            <div className="padingtopmy5create">
              <TextField
                className="input-font-small"
                type={investor ? "text" : "password"}
                label={
                  createMt5Form.account_type == "0"
                    ? "Investor Password"
                    : "Investor Password"
                }
                error={
                  (!createMt5Form.confirm_password.match(/[A-Z]/g) ||
                    !createMt5Form.confirm_password.match(/[a-z]/g) ||
                    !createMt5Form.confirm_password.match(/[0-9]/g) ||
                    createMt5Form.confirm_password == "" ||
                    createMt5Form.confirm_password.length < 8 ||
                    createMt5Form.confirm_password.length >= 20 ||
                    !createMt5Form.confirm_password.match(
                      /[!@#$%^&*()_+=]/g
                    )) &&
                  inputinfoTrue.confirm_password
                    ? true
                    : false
                }
                variant="standard"
                value={createMt5Form.confirm_password}
                onChange={input}
                onBlur={inputtrueFalse}
                helperText={
                  createMt5Form.confirm_password == "" &&
                  inputinfoTrue.confirm_password
                    ? "Enter your investor Password"
                    : inputinfoTrue.confirm_password &&
                      (createMt5Form.confirm_password.length < 8 ||
                        createMt5Form.confirm_password.length >= 20)
                    ? "investor Password must contain atleast 8-20 characters"
                    : inputinfoTrue.confirm_password &&
                      (!createMt5Form.confirm_password.match(/[A-Z]/g) ||
                        !createMt5Form.confirm_password.match(/[a-z]/g) ||
                        !createMt5Form.confirm_password.match(/[0-9]/g) ||
                        !createMt5Form.confirm_password.match(
                          /[!@#$%^&*()_+=]/g
                        ))
                    ? "Atleast one lower case, upper case,special character and number required"
                    : ""
                }
                sx={{ width: "100%" }}
                name="confirm_password"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={InvestorPassword} edge="end">
                      {investor ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      );
    } else if (dialogTitle == "Delete Bank") {
      return <div>Are you sure want to delete bank?</div>;
    } else if (dialogTitle == "MT5 Access") {
      return (
        <div>
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                Mt5AccessForm.account_type == "" && input1infoTrue.account_type
                  ? true
                  : false
              }
            >
              <InputLabel>Select MT5 Account</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account_type"
                onChange={input1}
                onBlur={input1trueFalse}
              >
                {mt5AccountList.map((item) => {
                  return (
                    <MenuItem value={item.mt5_acc_no}>
                      {item.mt5_acc_no}
                    </MenuItem>
                  );
                })}
              </Select>
              {Mt5AccessForm.account_type == "" &&
              input1infoTrue.account_type ? (
                <FormHelperText>MT5 Account is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                Mt5AccessForm.status == "" && input1infoTrue.status
                  ? true
                  : false
              }
            >
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                onChange={input1}
                onBlur={input1trueFalse}
                value={Mt5AccessForm.status}
              >
                <MenuItem value="1">Activate</MenuItem>
                <MenuItem value="0">Deactivate</MenuItem>
              </Select>
              {Mt5AccessForm.status == "" && input1infoTrue.status ? (
                <FormHelperText>Status is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Link Existing Account") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Account Number"
              variant="standard"
              sx={{ width: "100%" }}
              type="text"
              name="account_number"
              error={
                linkAccountForm.account_number == "" &&
                input2infoTrue.account_number
                  ? true
                  : false
              }
              value={linkAccountForm.account_number}
              onBlur={input2trueFalse}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  input2(e);
                }
              }}
              helperText={
                linkAccountForm.account_number == "" &&
                input2infoTrue.account_number
                  ? "Account Number is required"
                  : ""
              }
            />
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                linkAccountForm.account_type == "" &&
                input2infoTrue.account_type
                  ? true
                  : false
              }
            >
              <InputLabel>Account Type</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account_type"
                onChange={input2}
                onBlur={input2trueFalse}
              >
                <MenuItem value="1">Live</MenuItem>
              </Select>
              {linkAccountForm.account_type == "" &&
              input2infoTrue.account_type ? (
                <FormHelperText>Account Type is required </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                linkAccountForm.account_option == "" &&
                input2infoTrue.account_option
                  ? true
                  : false
              }
            >
              <InputLabel>Account Option</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account_option"
                onChange={input2}
                onBlur={input2trueFalse}
              >
                {createLiveType.map((item) => {
                  return (
                    <MenuItem value={item.ib_group_level_id}>
                      {item.ib_group_name}
                    </MenuItem>
                  );
                })}
              </Select>
              {linkAccountForm.account_option == "" &&
              input2infoTrue.account_option ? (
                <FormHelperText>Account Type is required </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              type={showPassword ? "text" : "password"}
              label="Password"
              onBlur={input2trueFalse}
              error={
                (!linkAccountForm.password.match(/[A-Z]/g) ||
                  !linkAccountForm.password.match(/[a-z]/g) ||
                  !linkAccountForm.password.match(/[0-9]/g) ||
                  linkAccountForm.password == "" ||
                  linkAccountForm.password.length < 8 ||
                  linkAccountForm.password.length >= 20 ||
                  !linkAccountForm.password.match(/[!@#$%^&*()_+=]/g)) &&
                input2infoTrue.password
                  ? true
                  : false
              }
              variant="standard"
              onChange={input2}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              value={linkAccountForm.password}
              sx={{ width: "100%" }}
              name="password"
              helperText={
                linkAccountForm.password == "" && input2infoTrue.password
                  ? "Enter your password"
                  : input2infoTrue.password &&
                    (linkAccountForm.password.length < 8 ||
                      linkAccountForm.password.length >= 20)
                  ? "Password must contain atleast 8-20 characters"
                  : input2infoTrue.password &&
                    (!linkAccountForm.password.match(/[A-Z]/g) ||
                      !linkAccountForm.password.match(/[a-z]/g) ||
                      !linkAccountForm.password.match(/[0-9]/g) ||
                      !linkAccountForm.password.match(/[!@#$%^&*()_+=]/g))
                  ? "Atleast one lower case, upper case,special character and number required"
                  : ""
              }
            />
          </div>
          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              type={investor ? "text" : "password"}
              error={
                (linkAccountForm.confirm_password == "" ||
                  linkAccountForm.password !==
                    linkAccountForm.confirm_password) &&
                input2infoTrue.confirm_password
                  ? true
                  : false
              }
              label="Confirm Password"
              variant="standard"
              value={linkAccountForm.confirm_password}
              onChange={input2}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={InvestorPassword} edge="end">
                    {investor ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              onBlur={input2trueFalse}
              sx={{ width: "100%" }}
              helperText={
                linkAccountForm.confirm_password == "" &&
                input2infoTrue.confirm_password
                  ? "Enter your Confirm password"
                  : linkAccountForm.password !==
                      linkAccountForm.confirm_password &&
                    input2infoTrue.confirm_password
                  ? "Passwords must match"
                  : ""
              }
              name="confirm_password"
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Reset MT5 Password") {
      return (
        <div>
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Select MT5 Account</InputLabel>
              <Select
                label
                className="select-font-small"
                name="mt5_id"
                onChange={input3}
              >
                {mt5AccountList.map((item) => {
                  return (
                    <MenuItem value={item.mt5_acc_no}>
                      {item.mt5_acc_no}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Change Account leverage") {
      return (
        <div>
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                changeLeverageForm.account == "" && input4infoTrue.account
                  ? true
                  : false
              }
            >
              <InputLabel>MT5 Account</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account"
                onChange={input4}
                onBlur={input4trueFalse}
              >
                {mt5AccountList.map((item) => {
                  return (
                    <MenuItem value={item.mt5_acc_no}>
                      {item.mt5_acc_no}
                    </MenuItem>
                  );
                })}
              </Select>
              {changeLeverageForm.account == "" && input4infoTrue.account ? (
                <FormHelperText>MT5 Account is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                changeLeverageForm.leverage == "" && input4infoTrue.leverage
                  ? true
                  : false
              }
            >
              <InputLabel>Leverage</InputLabel>
              <Select
                label
                className="select-font-small"
                name="leverage"
                onChange={input4}
                onBlur={input4trueFalse}
              >
                {leverageForm.map((item) => {
                  return (
                    <MenuItem value={item.leverage_value}>
                      {item.leverage_data}
                    </MenuItem>
                  );
                })}
              </Select>
              {changeLeverageForm.leverage == "" && input4infoTrue.leverage ? (
                <FormHelperText>Leverage is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Change MT5 Group") {
      return (
        <div>
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                chGroup.mt5_account_id == "" && chGrouptruefalse.mt5_account_id
                  ? true
                  : false
              }
            >
              <InputLabel>MT5 Account</InputLabel>
              <Select
                label
                className="select-font-small"
                name="mt5_account_id"
                value={chGroup.mt5_account_id}
                onChange={(e) => {
                  getGroupname(e);
                }}
                onBlur={inputChGroupTrueFalse}
              >
                {mt5AccountList.map((item) => {
                  return (
                    <MenuItem value={item.mt5_acc_no}>
                      {item.mt5_acc_no}
                    </MenuItem>
                  );
                })}
              </Select>
              {chGroup.mt5_account_id == "" &&
              chGrouptruefalse.mt5_account_id ? (
                <FormHelperText>MT5 Account is required</FormHelperText>
              ) : (
                <div>
                  <b> {chGroup.selectedGroup == "" ? "" : "Group Name:"} </b>
                  {chGroup.selectedGroup}
                </div>
              )}
            </FormControl>
          </div>

          {chGroup.mt5_account_id != "" ? (
            <div className="padingtopmy5create">
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <Autocomplete
                  options={chGroup.groupList}
                  getOptionLabel={(option) =>
                    option ? option.mt5_group_name : ""
                  }
                  name="mt5_group_id"
                  onBlur={chGrouptruefalse}
                  onChange={(event, newInputValue) => {
                    chGroup.mt5_group_id = newInputValue.mt5_group_id;
                    setChGroup({ ...chGroup });
                  }}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Client" variant="standard" />
                  )}
                />
              </FormControl>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    } else if (dialogTitle == "Add Master Structure") {
      return (
        <div className="master-structure-section">
          <div className="structureNameSection view-ib-content-section">
            <input
              type="text"
              className=""
              placeholder="Structure Name"
              name="name"
              value={newMasterStructureData.structure_name}
              onChange={(e) => {
                newMasterStructureData.structure_name = e.target.value;
                setNewMasterStructureData({ ...newMasterStructureData });
                // setStructureList((preValue) => {
                //   return {
                //     ...preValue,
                //     structure_name: e.target.value,
                //   };
                // });
              }}
            />
          </div>
          <div className="main-content-input">
            <div className="ib-structure view-commission-content-section">
              {newMasterStructureData.structure_data.map((item, index) => {
                {
                }
                return (
                  <div className="group-structure-section">
                    <div className="main-section">
                      <div className="main-section-title">
                        {item.ib_group_name}
                      </div>
                      <div className="main-section-input-element">
                        <div>
                          {/* <span>Rebate</span> */}
                          <input
                            type="text"
                            style={
                              (item.group_rebate * 100) /
                                newMasterStructureData.structure_dataOld[index]
                                  .group_rebate1 >
                              100
                                ? { border: "2px solid red" }
                                : {}
                            }
                            className="Rebate_amount"
                            placeholder="Rebate"
                            value={item.group_rebate}
                            disabled={
                              newMasterStructureData.structure_dataOld[index]
                                .group_rebate1 == 0
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  newMasterStructureData.structure_data[index][
                                    "group_rebate"
                                  ] = e.target.value;
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ].forEach((value, valueIndex) => {
                                    if (
                                      newMasterStructureData.structure_dataOld[
                                        index
                                      ]["pair_data1"][valueIndex]["rebate1"] ==
                                      0
                                    ) {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][valueIndex]["rebate"] = 0;
                                    } else {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][valueIndex]["rebate"] =
                                        e.target.value;
                                    }
                                  });
                                  setNewMasterStructureData({
                                    ...newMasterStructureData,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                newMasterStructureData.structure_data[index][
                                  "group_rebate"
                                ] = 0;
                                newMasterStructureData.structure_data[index][
                                  "pair_data"
                                ].forEach((value, valueIndex) => {
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ][valueIndex]["rebate"] = 0;
                                });
                                setNewMasterStructureData({
                                  ...newMasterStructureData,
                                });
                              }
                            }}
                          />
                          <span>
                            {item.group_rebate == "0" ? (
                              <span className="fw-700 d-block">0.00%</span>
                            ) : (
                              <span className="fw-700 d-block">
                                {(
                                  (item.group_rebate * 100) /
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ].group_rebate1
                                ).toFixed(2) == Infinity ||
                                (
                                  (item.group_rebate * 100) /
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ].group_rebate1
                                ).toFixed(2) == "NaN"
                                  ? "0.00%"
                                  : `${(
                                      (item.group_rebate * 100) /
                                      newMasterStructureData.structure_dataOld[
                                        index
                                      ].group_rebate1
                                    ).toFixed(2)}%`}
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          {/* <span>Commission</span> */}
                          <input
                            type="text"
                            className="commission_amount"
                            placeholder="Commission"
                            value={item.group_commission}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  newMasterStructureData.structure_data[index][
                                    "group_commission"
                                  ] = e.target.value;
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ].forEach((value, valueIndex) => {
                                    newMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"][valueIndex]["commission"] =
                                      e.target.value;
                                  });
                                  setNewMasterStructureData({
                                    ...newMasterStructureData,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                newMasterStructureData.structure_data[index][
                                  "group_commission"
                                ] = 0;
                                newMasterStructureData.structure_data[index][
                                  "pair_data"
                                ].forEach((value, valueIndex) => {
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ][valueIndex]["commission"] = 0;
                                });
                                setNewMasterStructureData({
                                  ...newMasterStructureData,
                                });
                              }
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <span
                            onClick={(e) => {
                              newMasterStructureData.structure_data[index][
                                "is_visible"
                              ] = !item.is_visible;
                              setUpdateDate({ ...newMasterStructureData });
                            }}
                          >
                            <i
                              style={{ fontSize: "27px" }}
                              class={`fa ${
                                item.is_visible
                                  ? "fa-angle-up"
                                  : "fa-angle-down"
                              }`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`pair-section ${
                        item.is_visible ? "child-section-visible" : ""
                      }`}
                    >
                      {item.pair_data.map((item1, index1) => {
                        return (
                          <div className="pair-data">
                            <div className="pair-data-title">
                              {item1.pair_name}
                            </div>
                            <div>
                              <input
                                type="text"
                                className="rebert_amount"
                                placeholder="Rebert"
                                // value={item1.rebate}
                                value={
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ]["pair_data1"][index1]["rebate1"] == 0
                                    ? 0
                                    : item1.rebate
                                }
                                disabled={
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ]["pair_data1"][index1]["rebate1"] == 0
                                    ? true
                                    : false
                                }
                                style={
                                  (item1.rebate * 100) /
                                    newMasterStructureData.structure_dataOld[
                                      index
                                    ]["pair_data1"][index1]["rebate1"] >
                                  100
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                onChange={(e) => {
                                  var floatNumber = e.target.value.split(".");
                                  if (!isNaN(Number(e.target.value))) {
                                    if (
                                      floatNumber.length == 1 ||
                                      (floatNumber.length == 2 &&
                                        floatNumber[1].length <= 3)
                                    ) {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][index1]["rebate"] =
                                        e.target.value;
                                      setNewMasterStructureData({
                                        ...newMasterStructureData,
                                      });
                                    }
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    newMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"][index1]["rebate"] = 0;
                                    setNewMasterStructureData({
                                      ...newMasterStructureData,
                                    });
                                  }
                                }}
                              />
                              {item1.rebate == "0" ? (
                                <span className="fw-700 d-block">0.00%</span>
                              ) : (
                                <span className="fw-700 d-block">
                                  {(item1.rebate * 100) /
                                    newMasterStructureData.structure_dataOld[
                                      index
                                    ]["pair_data1"][index1]["rebate1"] ==
                                    Infinity ||
                                  (item1.rebate * 100) /
                                    newMasterStructureData.structure_dataOld[
                                      index
                                    ]["pair_data1"][index1]["rebate1"] ==
                                    "NaN"
                                    ? "0.00%"
                                    : `${(
                                        (item1.rebate * 100) /
                                        newMasterStructureData
                                          .structure_dataOld[index][
                                          "pair_data1"
                                        ][index1]["rebate1"]
                                      ).toFixed(2)}%`}
                                </span>
                              )}
                            </div>
                            <div>
                              <input
                                type="text"
                                className="commission_amount"
                                placeholder="Commission"
                                value={item1.commission}
                                onChange={(e) => {
                                  var floatNumber = e.target.value.split(".");
                                  if (!isNaN(Number(e.target.value))) {
                                    if (
                                      floatNumber.length == 1 ||
                                      (floatNumber.length == 2 &&
                                        floatNumber[1].length <= 3)
                                    ) {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][index1]["commission"] =
                                        e.target.value;
                                      setNewMasterStructureData({
                                        ...newMasterStructureData,
                                      });
                                    }
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    newMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"][index1]["commission"] = 0;
                                    setNewMasterStructureData({
                                      ...newMasterStructureData,
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* {forinloop()} */}
        </div>
      );
    } else if (dialogTitle == "Edit My Structure") {
      return (
        <div className="master-structure-section">
          <div className="main-content-input">
            <div className="ib-structure view-commission-content-section">
              {newMasterStructureData1.structure_data.map((item, index) => {
                return (
                  <div className="group-structure-section">
                    <div className="main-section">
                      <div className="main-section-title">
                        {item.ib_group_name}
                      </div>
                      <div className="main-section-input-element">
                        <div>
                          <span>Rebate</span>
                          <input
                            type="text"
                            className="Rebate_amount"
                            placeholder="Rebate"
                            value={item.group_rebate}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  newMasterStructureData1.structure_data[index][
                                    "group_rebate"
                                  ] = e.target.value;
                                  newMasterStructureData1.structure_data[index][
                                    "pair_data"
                                  ].forEach((value, valueIndex) => {
                                    if (
                                      newMasterStructureData1.structure_data[
                                        index
                                      ].pair_data[valueIndex].pair_name ==
                                        "crypto" ||
                                      newMasterStructureData1.structure_data[
                                        index
                                      ].pair_data[valueIndex].pair_name ==
                                        "indices"
                                    ) {
                                    } else {
                                      newMasterStructureData1.structure_data[
                                        index
                                      ]["pair_data"][valueIndex]["rebate"] =
                                        e.target.value;
                                    }
                                  });
                                  setNewMasterStructureData1({
                                    ...newMasterStructureData1,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                newMasterStructureData1.structure_data[index][
                                  "group_rebate"
                                ] = 0;
                                newMasterStructureData1.structure_data[index][
                                  "pair_data"
                                ].forEach((value, valueIndex) => {
                                  newMasterStructureData1.structure_data[index][
                                    "pair_data"
                                  ][valueIndex]["rebate"] = 0;
                                });
                                setNewMasterStructureData1({
                                  ...newMasterStructureData1,
                                });
                              }
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "block",
                            fontWeight: "600",
                          }}
                        >
                          <span>Commission</span>
                          <input
                            type="text"
                            className="commission_amount"
                            placeholder="Commission"
                            value={item.group_commission}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  newMasterStructureData1.structure_data[index][
                                    "group_commission"
                                  ] = e.target.value;
                                  newMasterStructureData1.structure_data[index][
                                    "pair_data"
                                  ].forEach((value, valueIndex) => {
                                    newMasterStructureData1.structure_data[
                                      index
                                    ]["pair_data"][valueIndex]["commission"] =
                                      e.target.value;
                                  });
                                  newMasterStructureData1({
                                    ...newMasterStructureData1,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                newMasterStructureData1.structure_data[index][
                                  "group_commission"
                                ] = 0;
                                newMasterStructureData1.structure_data[index][
                                  "pair_data"
                                ].forEach((value, valueIndex) => {
                                  newMasterStructureData1.structure_data[index][
                                    "pair_data"
                                  ][valueIndex]["commission"] = 0;
                                });
                                setNewMasterStructureData1({
                                  ...newMasterStructureData1,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="action-section">
                        <div style={{ width: "95%" }}>
                          {item.ibGroup != undefined ? (
                            <Autocomplete
                              className="autoComplete-input-remove-border"
                              // disablePortal
                              value={item.ibGroup_selected}
                              options={item.ibGroup}
                              getOptionLabel={(option) =>
                                option ? option.ib_group_name : ""
                              }
                              renderOption={(props, option) => {
                                return (
                                  <li
                                    {...props}
                                    key={`${option.ib_group_level_id}-${option.ib_group_name}`}
                                  >
                                    {option.ib_group_name}
                                  </li>
                                );
                              }}
                              onInputChange={(event, newInputValue) => {
                                // fetchAccount(event, newInputValue);
                              }}
                              onChange={(event, newValue) => {
                                newMasterStructureData1.structure_data[index][
                                  "ib_group_level_id"
                                ] = newValue.ib_group_level_id;
                                newMasterStructureData1.structure_data[index][
                                  "ibGroup_selected"
                                ] = newValue;
                                setNewMasterStructureData1({
                                  ...newMasterStructureData1,
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="IB Group"
                                  variant="standard"
                                  style={{
                                    width: "100%",
                                    border: "0px !important",
                                  }}
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}
                        </div>

                        <span
                          onClick={(e) => {
                            newMasterStructureData1.structure_data[index][
                              "is_visible"
                            ] = !item.is_visible;
                            setNewMasterStructureData1({
                              ...newMasterStructureData1,
                            });
                          }}
                        >
                          <i
                            class={`fa ${
                              item.is_visible ? "fa-angle-up" : "fa-angle-down"
                            }`}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`pair-section ${
                        item.is_visible ? "child-section-visible" : ""
                      }`}
                    >
                      {item.pair_data.map((item1, index1) => {
                        return (
                          <div className="pair-data">
                            <div className="pair-data-title">
                              {item1.pair_name}
                            </div>
                            <div>
                              <input
                                type="text"
                                className="rebert_amount"
                                placeholder="Rebert"
                                value={item1.rebate}
                                onChange={(e) => {
                                  var floatNumber = e.target.value.split(".");
                                  if (!isNaN(Number(e.target.value))) {
                                    if (
                                      floatNumber.length == 1 ||
                                      (floatNumber.length == 2 &&
                                        floatNumber[1].length <= 3)
                                    ) {
                                      newMasterStructureData1.structure_data[
                                        index
                                      ]["pair_data"][index1]["rebate"] =
                                        e.target.value;
                                      setNewMasterStructureData1({
                                        ...newMasterStructureData1,
                                      });
                                    }
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    newMasterStructureData1.structure_data[
                                      index
                                    ]["pair_data"][index1]["rebate"] = 0;
                                    setNewMasterStructureData1({
                                      ...newMasterStructureData1,
                                    });
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                className="commission_amount"
                                placeholder="Commission"
                                value={item1.commission}
                                onChange={(e) => {
                                  var floatNumber = e.target.value.split(".");
                                  if (!isNaN(Number(e.target.value))) {
                                    if (
                                      floatNumber.length == 1 ||
                                      (floatNumber.length == 2 &&
                                        floatNumber[1].length <= 3)
                                    ) {
                                      newMasterStructureData1.structure_data[
                                        index
                                      ]["pair_data"][index1]["commission"] =
                                        e.target.value;
                                      setNewMasterStructureData1({
                                        ...newMasterStructureData1,
                                      });
                                    }
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    newMasterStructureData1.structure_data[
                                      index
                                    ]["pair_data"][index1]["commission"] = 0;
                                    setNewMasterStructureData1({
                                      ...newMasterStructureData1,
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* {forinloop()} */}
        </div>
      );
    } else if (dialogTitle == "Edit Master Structure") {
      return (
        <div className="master-structure-section">
          <div className="structureNameSection view-ib-content-section">
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Structure</InputLabel>
              <Select
                label
                className="select-font-small"
                name="Structure"
                onChange={(e) => {
                  getMasterStructure(e.target.value);
                  newMasterStructureData.structure_id = e.target.value;
                  newMasterStructureData.structure_name =
                    structureList.data.filter(
                      (x) => x.structure_id == e.target.value
                    )[0].structure_name;
                  setStructureList((prevalue) => {
                    return {
                      ...prevalue,
                      structure_name: structureList.data.filter(
                        (x) => x.structure_id == e.target.value
                      )[0].structure_name,
                      structure_id: e.target.value,
                    };
                  });
                }}
              >
                {structureList.data.map((item) => {
                  return (
                    <MenuItem value={item.structure_id}>
                      {item.structure_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="main-content-input">
            <div className="ib-structure view-commission-content-section">
              {newMasterStructureData.structure_data.map((item, index) => {
                return (
                  <div className="group-structure-section">
                    <div className="main-section">
                      <div className="main-section-title">
                        {item.ib_group_name}
                      </div>
                      <div className="main-section-input-element">
                        <div>
                          {/* <span>Rebate</span> */}
                          <input
                            type="text"
                            className="Rebate_amount"
                            placeholder="Rebate"
                            style={
                              (item.group_rebate * 100) /
                                newMasterStructureData.structure_dataOld[index]
                                  .group_rebate1 >
                              100
                                ? { border: "2px solid red" }
                                : {}
                            }
                            disabled={
                              newMasterStructureData.structure_dataOld[index]
                                .group_rebate1 == 0
                                ? true
                                : false
                            }
                            value={item.group_rebate}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  newMasterStructureData.structure_data[index][
                                    "group_rebate"
                                  ] = e.target.value;
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ].forEach((value, valueIndex) => {
                                    if (
                                      newMasterStructureData.structure_dataOld[
                                        index
                                      ]["pair_data1"][valueIndex]["rebate1"] ==
                                      0
                                    ) {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][valueIndex]["rebate"] = 0;
                                    } else {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][valueIndex]["rebate"] =
                                        e.target.value;
                                    }
                                  });
                                  setNewMasterStructureData({
                                    ...newMasterStructureData,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                newMasterStructureData.structure_data[index][
                                  "group_rebate"
                                ] = 0;
                                newMasterStructureData.structure_data[index][
                                  "pair_data"
                                ].forEach((value, valueIndex) => {
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ][valueIndex]["rebate"] = 0;
                                });
                                setNewMasterStructureData({
                                  ...newMasterStructureData,
                                });
                              }
                            }}
                          />
                          <span>
                            {item.group_rebate == "0" ? (
                              <span className="fw-700 d-block">0.00%</span>
                            ) : (
                              <span className="fw-700 d-block">
                                {(
                                  (item.group_rebate * 100) /
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ].group_rebate1
                                ).toFixed(2) == Infinity ||
                                (
                                  (item.group_rebate * 100) /
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ].group_rebate1
                                ).toFixed(2) == "NaN"
                                  ? "0.00%"
                                  : `${(
                                      (item.group_rebate * 100) /
                                      newMasterStructureData.structure_dataOld[
                                        index
                                      ].group_rebate1
                                    ).toFixed(2)}%`}
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          {/* <span>Commission</span> */}
                          <input
                            type="text"
                            className="commission_amount"
                            placeholder="Commission"
                            value={item.group_commission}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  newMasterStructureData.structure_data[index][
                                    "group_commission"
                                  ] = e.target.value;
                                  newMasterStructureData.structure_data[index][
                                    "pair_data"
                                  ].forEach((value, valueIndex) => {
                                    newMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"][valueIndex]["commission"] =
                                      e.target.value;
                                  });
                                  setNewMasterStructureData({
                                    ...newMasterStructureData,
                                  });
                                }
                              }
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <span
                            onClick={(e) => {
                              newMasterStructureData.structure_data[index][
                                "is_visible"
                              ] = !item.is_visible;
                              setUpdateDate({ ...newMasterStructureData });
                            }}
                          >
                            <i
                              style={{ fontSize: "27px" }}
                              class={`fa ${
                                item.is_visible
                                  ? "fa-angle-up"
                                  : "fa-angle-down"
                              }`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`pair-section ${
                        item.is_visible ? "child-section-visible" : ""
                      }`}
                    >
                      {item.pair_data.map((item1, index1) => {
                        return (
                          <div className="pair-data">
                            <div className="pair-data-title">
                              {item1.pair_name}
                            </div>
                            <div>
                              <input
                                type="text"
                                className="rebert_amount"
                                placeholder="Rebert"
                                value={
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ]["pair_data1"][index1]["rebate1"] == 0
                                    ? 0
                                    : item1.rebate
                                }
                                disabled={
                                  newMasterStructureData.structure_dataOld[
                                    index
                                  ]["pair_data1"][index1]["rebate1"] == 0
                                    ? true
                                    : false
                                }
                                style={
                                  (item1.rebate * 100) /
                                    newMasterStructureData.structure_dataOld[
                                      index
                                    ]["pair_data1"][index1]["rebate1"] >
                                  100
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                onChange={(e) => {
                                  var floatNumber = e.target.value.split(".");
                                  if (!isNaN(Number(e.target.value))) {
                                    if (
                                      floatNumber.length == 1 ||
                                      (floatNumber.length == 2 &&
                                        floatNumber[1].length <= 3)
                                    ) {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][index1]["rebate"] =
                                        e.target.value;
                                      setNewMasterStructureData({
                                        ...newMasterStructureData,
                                      });
                                    }
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    newMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"][index1]["rebate"] = 0;
                                    setNewMasterStructureData({
                                      ...newMasterStructureData,
                                    });
                                  }
                                }}
                              />
                              {item1.rebate == "0" ? (
                                <span className="fw-700 d-block">0.00%</span>
                              ) : (
                                <span className="fw-700 d-block">
                                  {(item1.rebate * 100) /
                                    newMasterStructureData.structure_dataOld[
                                      index
                                    ]["pair_data1"][index1]["rebate1"] ==
                                    Infinity ||
                                  (item1.rebate * 100) /
                                    newMasterStructureData.structure_dataOld[
                                      index
                                    ]["pair_data1"][index1]["rebate1"] ==
                                    "NaN"
                                    ? "0.00%"
                                    : `${(
                                        (item1.rebate * 100) /
                                        newMasterStructureData
                                          .structure_dataOld[index][
                                          "pair_data1"
                                        ][index1]["rebate1"]
                                      ).toFixed(2)}%`}
                                </span>
                              )}
                            </div>
                            <div>
                              <input
                                type="text"
                                className="commission_amount"
                                placeholder="Commission"
                                value={item1.commission}
                                onChange={(e) => {
                                  var floatNumber = e.target.value.split(".");
                                  if (!isNaN(Number(e.target.value))) {
                                    if (
                                      floatNumber.length == 1 ||
                                      (floatNumber.length == 2 &&
                                        floatNumber[1].length <= 3)
                                    ) {
                                      newMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][index1]["commission"] =
                                        e.target.value;
                                      setNewMasterStructureData({
                                        ...newMasterStructureData,
                                      });
                                    }
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    newMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"][index1]["commission"] = 0;
                                    setNewMasterStructureData({
                                      ...newMasterStructureData,
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* {masterStructureData.map((item, index) => {
            return (
              <div className="structureInputSection">
                <hr className="solid" />
                <br />
                <Grid container>
                  <Grid item md={4} lg={4} xl={4} className="label-center">
                    <label>{item.ib_group_name}</label>
                  </Grid>
                  <Grid item md={8} lg={8} xl={8}>
                    <Grid container spacing={1}>
                      {item.pair_data.map((item1, index1) => {
                        return (
                          <>
                            <Grid item md={4} lg={4} xl={4}>
                              <label>{item1.pair_name}</label>
                            </Grid>
                            <Grid item md={4} lg={4} xl={4}>
                              <input
                                value={item1.rebate}
                                type="text"
                                className=""
                                placeholder="Rebate"
                                onChange={(e) => {
                                  masterStructureData[index]["pair_data"][
                                    index1
                                  ]["rebate"] = e.target.value;
                                  setMasterStructureData([
                                    ...masterStructureData,
                                  ]);
                                }}
                              />
                            </Grid>
                            <Grid item md={4} lg={4} xl={4}>
                              <input
                                value={item1.commission}
                                type="text"
                                className=""
                                placeholder="Commission"
                                onChange={(e) => {
                                  masterStructureData[index]["pair_data"][
                                    index1
                                  ]["commission"] = e.target.value;
                                  setMasterStructureData([
                                    ...masterStructureData,
                                  ]);
                                }}
                              />
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            );
          })} */}
        </div>
      );
    } else if (dialogTitle == "ADD SHARED STRUCTURE") {
      return (
        <div>
          <div className="structureInputSection">
            <Grid container>
              <Grid item md={4} lg={4} xl={4} className="label-center">
                <div className="structureNameSection">
                  <label>Structure Name</label>
                  <input
                    type="text"
                    className=""
                    placeholder="Structure Name"
                    name="name"
                    onChange={sharedStructurIBInput}
                  />
                </div>
              </Grid>
              <Grid item md={8} lg={8} xl={8}>
                <Grid container spacing={1}>
                  <Grid item md={3} lg={3} xl={3}></Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Account Type</label>
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Total Rebate</label>
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Total Commission</label>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={3} lg={3} xl={3}></Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Executive</label>
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <input
                      type="text"
                      className=""
                      placeholder="Rebate"
                      name="total_rebate"
                      onChange={sharedStructurIBInput}
                    />
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <input
                      type="text"
                      className=""
                      placeholder="Commission"
                      name="total_commission"
                      onChange={sharedStructurIBInput}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <hr className="solid" />
          <div className="structureInputSection">
            {sharedStructureForm.list.map((rowData, i) => (
              <Grid container spacing={1}>
                <Grid item md={4} lg={4} xl={4}>
                  <label>IB</label>
                </Grid>
                <Grid item md={4} lg={4} xl={4}>
                  <input
                    type="text"
                    className=""
                    style={{ width: "70%" }}
                    value={rowData.value}
                    onChange={(e) => inputSteuctureIB(e, i)}
                  />
                </Grid>
                <Grid item md={4} lg={4} xl={4}>
                  <Button variant="contained" className="btn-gradient">
                    Proceed
                  </Button>
                  <IconButton
                    aria-label="delete"
                    className="btn-danger"
                    onClick={(e) => deleteStructureIB(e, i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </div>
          <hr className="solid" />
          <div className="contentActionButton">
            <Button
              variant="contained"
              className="btn-gradient"
              onClick={sharedStructurAddNewIB}
            >
              Add another IB
            </Button>
            <Button variant="contained" disabled>
              Add Structure
            </Button>
          </div>
        </div>
      );
    } else if (dialogTitle == "Link Client") {
      return (
        <div style={{ height: "200px" }}>
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <Autocomplete
                disablePortal
                options={accountOption}
                getOptionLabel={(option) => (option ? option.client_name : "")}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue != "") {
                    var serachData = linkClientForm.list.filter((x) =>
                      x.client_name.toLowerCase().startsWith(newInputValue)
                    );
                    setAccountOption([...serachData]);
                  } else {
                    setAccountOption([...linkClientForm.list]);
                  }
                }}
                onChange={(event, newValue) => {
                  setLinkClientForm((prevalue) => {
                    return {
                      ...prevalue,
                      client: newValue != null ? newValue.client_id : 0,
                    };
                  });
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Client" variant="standard" />
                )}
              />
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Move IB to IB") {
      return (
        <div>
          {moveToIb.isLoader == true ? (
            <>
              <div className="" style={{ height: "22px", textAlign: "center" }}>
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
            </>
          ) : (
            <div>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <Autocomplete
                  options={moveToIb.list}
                  getOptionLabel={(option) =>
                    option ? option.sponser_name : ""
                  }
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.sponser_id}>
                        {option.sponser_name}
                      </li>
                    );
                  }}
                  onChange={(event, newValue) => {
                    moveToIb.ibName = newValue;
                    setMoveToIb({ ...moveToIb });
                  }}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="IB Name" variant="standard" />
                  )}
                />
              </FormControl>
            </div>
          )}
        </div>
      );
    } else if (dialogTitle == "Link To IB") {
      return (
        <div style={{ height: "100px" }}>
          {/* <div className="margeField">
            <TextField
              className="input-font-small"
              label="Master Account ID"
              variant="standard"
              sx={{ width: "50%" }}
              name="master_account"
              onChange={linkIBInput}
            />
            <TextField
              className="input-font-small"
              label="Customer Name"
              variant="standard"
              sx={{ width: "50%" }}
              name="customer_name"
              onChange={linkIBInput}
            />
          </div>
          <br /> */}
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              {/* <InputLabel>IB User</InputLabel>
              <Select
                label
                className="select-font-small"
                name="customer_name"
                onChange={linkIBInput}
              >
                {linkIBForm.list?.map((item) => {
                  return (
                    <MenuItem value={item.sponser_id}>
                      {item.sponser_name}
                    </MenuItem>
                  );
                })}
              </Select> */}
              <Autocomplete
                disablePortal
                options={IbAccountOption}
                getOptionLabel={(option) => (option ? option.sponser_name : "")}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue != "") {
                    var serachData = linkIBForm.list.filter((x) =>
                      x.sponser_name.toLowerCase().startsWith(newInputValue)
                    );
                    setAccountOption([...serachData]);
                  } else {
                    setAccountOption([...linkIBForm.list]);
                  }
                }}
                onChange={(event, newValue) => {
                  setLinkIBForm((prevalue) => {
                    return {
                      ...prevalue,
                      customer_name: newValue != null ? newValue.sponser_id : 0,
                    };
                  });
                  // setLinkClientForm((prevalue) => {
                  //   return {
                  //     ...prevalue,
                  //     "client": (newValue != null) ? newValue.sponser_id : 0,
                  //   };
                  // });
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Client" variant="standard" />
                )}
              />
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Convert to client") {
    } else if (dialogTitle == "Send Email") {
      return (
        <div>
          {/* <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>FROM</InputLabel>
              <Select
                label
                className="select-font-small"
                name="from"
                onChange={sendMailInput}
              >
                <MenuItem value="1">admin@gmail.com</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br /> */}
          <div>
            <TextField
              className="input-font-small"
              label="To"
              type="text"
              variant="standard"
              sx={{ width: "100%" }}
              name="to"
              value={sendMailForm.to}
              error={
                (sendMailForm.to == "" ||
                  !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    sendMailForm.to
                  )) &&
                sendMailinputinfoTrue.to
                  ? true
                  : false
              }
              onBlur={sendMailinputtrueFalse}
              onChange={sendMailInput}
              helperText={
                sendMailForm.to == "" && sendMailinputinfoTrue.to
                  ? "Please enter to e-mail address"
                  : !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                      sendMailForm.to
                    ) && sendMailinputinfoTrue.to
                  ? "Enter a valid to e-mail"
                  : ""
              }
            />
          </div>

          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              label="Subject"
              variant="standard"
              onBlur={sendMailinputtrueFalse}
              error={
                sendMailForm.subject == "" && sendMailinputinfoTrue.subject
                  ? true
                  : false
              }
              helperText={
                sendMailForm.subject == "" && sendMailinputinfoTrue.subject
                  ? "Please enter subject"
                  : ""
              }
              sx={{ width: "100%" }}
              name="subject"
              onChange={sendMailInput}
            />
          </div>

          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              label="Template Title"
              variant="standard"
              onBlur={sendMailinputtrueFalse}
              error={
                sendMailForm.template_title == "" &&
                sendMailinputinfoTrue.template_title
                  ? true
                  : false
              }
              helperText={
                sendMailForm.template_title == "" &&
                sendMailinputinfoTrue.template_title
                  ? "Please enter template title"
                  : ""
              }
              sx={{ width: "100%" }}
              name="template_title"
              onChange={sendMailInput}
            />
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                sendMailForm.language == "" && sendMailinputinfoTrue.language
                  ? true
                  : false
              }
            >
              <InputLabel>Language</InputLabel>
              <Select
                label
                className="select-font-small"
                name="language"
                onBlur={sendMailinputtrueFalse}
                onChange={sendMailInput}
              >
                <MenuItem value="en-gb">English</MenuItem>
                <MenuItem value="ar-ae">عربي</MenuItem>
              </Select>
              {sendMailForm.language == "" && sendMailinputinfoTrue.language ? (
                <FormHelperText>Please select language</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>

          <div className="editor-section-border padingtopmy5create">
            <Editor
              // editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              name="body"
              onChange={onContentStateChange}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Control Panel Access") {
      return (
        <div>
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                value={cpAccessForm.status}
                onChange={input7}
              >
                <MenuItem value="1">Enable</MenuItem>
                <MenuItem value="0">Disable</MenuItem>
                {/* <MenuItem value="0">Active</MenuItem>
                <MenuItem value="1">Blocked</MenuItem> */}
              </Select>
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "View Control Panel Access Password") {
      return (
        <div>
          <div className="element-section">
            <label>CP Password :</label>
            <span>{viewCpPassword.cp_password}</span>
          </div>
        </div>
      );
    } else if (dialogTitle == "Download Client PDF") {
    } else if (dialogTitle == "Add New Note") {
      return (
        <div>
          <div>
            <TextField
              id="standard-textarea"
              label="Notes"
              multiline
              variant="standard"
              sx={{ width: "100%" }}
              name="notes"
              onChange={input8}
            />
          </div>
          <br />
          {/* <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Call Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="call_status"
                onChange={input8}
              >
                <MenuItem value="1">1st Call Attempted</MenuItem>
                <MenuItem value="2">2nd Call Attempted</MenuItem>
                <MenuItem value="3">3rd Call Attempted</MenuItem>
                <MenuItem value="4">4th Call Attempted</MenuItem>
                <MenuItem value="5">Busy Tune</MenuItem>
                <MenuItem value="6">Not Interested</MenuItem>
                <MenuItem value="7">Archived</MenuItem>
                <MenuItem value="8">Qualified</MenuItem>
                <MenuItem value="9">Interested</MenuItem>
                <MenuItem value="10">Language Not Support</MenuItem>
                <MenuItem value="11">Converted</MenuItem>
                <MenuItem value="12">Wrong Number</MenuItem>
                <MenuItem value="13">Fake Registration</MenuItem>
                <MenuItem value="14">Duplicate</MenuItem>
                <MenuItem value="15">Poor quality but can follow up</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br /> */}
          {/* <div>
            <FormControlLabel
              className="declarationCheckbox"
              control={
                // <Checkbox checked={true} name="declaration" size="small"/>
                <Checkbox name="set_reminder" size="small" onChange={input8} />
              }
              label="Set Reminder"
            />
          </div>
          <br />
          {noteForm.set_reminder == true ? (
            <div>
              <TextField
                type="date"
                id="standard-textarea"
                label="Date"
                variant="standard"
                sx={{ width: "100%" }}
                name="date"
                onChange={input8}
                focused
              />
            </div>
          ) : (
            ""
          )} */}
        </div>
      );
    } else if (dialogTitle == "Add Account" || dialogTitle == "Edit Account") {
      return (
        <div>
          <div>
            <TextField
              value={bankAccountForm.name}
              className="input-font-small"
              label="Beneficiary Name"
              error={
                bankAccountForm.name == "" && bankIinfoTrue.name ? true : false
              }
              variant="standard"
              sx={{ width: "100%" }}
              name="name"
              onBlur={bankInputtrueFalse}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  bankInput(e);
                }
              }}
              helperText={
                bankAccountForm.name == "" && bankIinfoTrue.name
                  ? "Beneficiary Name is required"
                  : ""
              }
            />
          </div>

          <div className="padingtopmy5create">
            <TextField
              value={bankAccountForm.bank_name}
              className="input-font-small"
              label="Beneficiary Bank Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="bank_name"
              error={
                bankAccountForm.bank_name == "" && bankIinfoTrue.bank_name
                  ? true
                  : false
              }
              // onChange={bankInput}
              onBlur={bankInputtrueFalse}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  re.test(e.target.value) ||
                  e.target.value === " "
                ) {
                  bankInput(e);
                }
              }}
              helperText={
                bankAccountForm.bank_name == "" && bankIinfoTrue.bank_name
                  ? "Beneficiary Bank Name is required"
                  : ""
              }
            />
          </div>
          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                bankIinfoTrue.currency && bankAccountForm.currency == ""
                  ? true
                  : false
              }
            >
              <InputLabel>Currency</InputLabel>
              <Select
                label
                className="select-font-small"
                name="currency"
                value={bankAccountForm.currency}
                onChange={bankInput}
                onBlur={bankInputtrueFalse}
              >
                {bankAccountForm.currencyArray.map((item) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
                {/* <MenuItem value="0">Demo</MenuItem> */}
              </Select>
              {bankIinfoTrue.currency && bankAccountForm.currency == "" ? (
                <FormHelperText>currency is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="padingtopmy5create">
            <TextField
              value={bankAccountForm.account_number}
              className="input-font-small"
              label="Account Number"
              type="text"
              variant="standard"
              sx={{ width: "100%" }}
              name="account_number"
              onBlur={bankInputtrueFalse}
              error={
                bankAccountForm.account_number == "" &&
                bankIinfoTrue.account_number
                  ? true
                  : false
              }
              onChange={(e) => {
                if (Number(e.target.value) || e.target.value == "") {
                  bankInput(e);
                }
              }}
              helperText={
                bankAccountForm.account_number == "" &&
                bankIinfoTrue.account_number
                  ? "Account Number is required"
                  : ""
              }
            />
          </div>

          <div className="padingtopmy5create">
            <TextField
              value={bankAccountForm.confirm_account_number}
              className="input-font-small"
              label="Confirm Account Number"
              type="text"
              error={
                (bankAccountForm.confirm_account_number == "" ||
                  bankAccountForm.confirm_account_number !==
                    bankAccountForm.account_number) &&
                bankIinfoTrue.confirm_account_number
                  ? true
                  : false
              }
              variant="standard"
              sx={{ width: "100%" }}
              name="confirm_account_number"
              onBlur={bankInputtrueFalse}
              onChange={(e) => {
                if (Number(e.target.value) || e.target.value == "") {
                  bankInput(e);
                }
              }}
              helperText={
                bankAccountForm.confirm_account_number == "" &&
                bankIinfoTrue.confirm_account_number
                  ? "Confirm Account Number is required"
                  : bankAccountForm.confirm_account_number !==
                      bankAccountForm.account_number &&
                    bankIinfoTrue.confirm_account_number
                  ? "Account Number must match"
                  : ""
              }
            />
          </div>
          {/* <div className="padingtopmy5create">
            <TextField
              value={bankAccountForm.swift_code}
              className="input-font-small"
              label="Swift Code(Optional)"
              variant="standard"
              sx={{ width: "100%" }}
              name="swift_code"
              // onChange={bankInput}
              onChange={(e) => {
                bankInput(e);
              }}
            />
          </div> */}

          <div className="padingtopmy5create">
            <div className="update-withdraw-request-section">
              <TextField
                value={bankAccountForm.swift_code}
                className="input-font-small"
                label="Swift Code(Optional)"
                variant="standard"
                sx={{ width: "100%" }}
                name="swift_code"
                // onChange={bankInput}
                onChange={(e) => {
                  bankInput(e);
                }}
              />
              <div className="element w-100">
                <label>Bank Proof</label>
                {bankAccountForm.bank_proof_preview ? (
                  <div className="">
                    <a
                      className="bg-transparent p-0 border-0"
                      style={{
                        textAlign: "center",
                        width: "100%",
                        display: "block",
                      }}
                      onClick={() => {
                        bankAccountForm.bank_proof = "";
                        bankAccountForm.bank_proof_preview = "";
                        setBankAccountForm({ ...bankAccountForm });
                      }}
                    >
                      <CloseOutlinedIcon className="fontimgclose" />
                    </a>
                    <CustomImageModal
                      image={bankAccountForm.bank_proof_preview}
                      className="deposit-upload-image-preview"
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="contained-button-file"
                    className="fileuploadButton"
                    style={{ display: "initial" }}
                  >
                    <Input
                      accept="application/pdf,image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => {
                        if (
                          e.target.files[0].type == "image/jpeg" ||
                          e.target.files[0].type == "application/pdf" ||
                          e.target.files[0].type == "image/png" ||
                          e.target.files[0].type == "image/jpg"
                        ) {
                          var objectUrl1 = URL.createObjectURL(
                            e.target.files[0]
                          );
                          bankAccountForm.bank_proof = e.target.files[0];
                          bankAccountForm.bank_proof_preview = objectUrl1;
                          setBankAccountForm({ ...bankAccountForm });
                        } else {
                          toast.error(
                            "Only JPG, JPEG, PNG and PDF types are accepted"
                          );
                        }
                      }}
                    />
                    <div style={{ marginLeft: "10px" }}>
                      <Button variant="contained" component="span">
                        <i className="material-icons">backup</i>
                        &nbsp;Upload
                      </Button>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="padingtopmy5create">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="IFSC"
                value={bankAccountForm.ibanselect}
                name="ibanselect"
                sx={{ display: "block" }}
                onChange={bankInput}
              >
                <FormControlLabel
                  value="IFSC"
                  control={<Radio />}
                  label="IFSC"
                />
                <FormControlLabel
                  value="IBAN"
                  control={<Radio />}
                  label="IBAN"
                />
                {/* <FormControlLabel
                  value="SWIFT"
                  control={<Radio />}
                  label="SWIFT"
                /> */}
              </RadioGroup>
            </FormControl>
            <Grid container>
              <Grid item md={12}>
                <div className="d-flex">
                  <TextField
                    value={bankAccountForm.iban_number}
                    className="input-font-small"
                    label="CODE"
                    variant="standard"
                    sx={
                      bankAccountForm.ibanselect == "IFSC"
                        ? { width: "60%" }
                        : { width: "100%" }
                    }
                    error={
                      bankAccountForm.iban_number == "" &&
                      bankIinfoTrue.iban_number
                        ? true
                        : false
                    }
                    onBlur={bankInputtrueFalse}
                    name="iban_number"
                    onChange={(e) => {
                      if (
                        e.target.value === "" ||
                        /^[A-Za-z0-9_ ]*$/.test(e.target.value) ||
                        e.target.value === " "
                      ) {
                        if (bankAccountForm.show) {
                          bankInput(e);
                          bankAccountForm.ifscdata = {};
                          bankAccountForm.show = false;
                          setBankAccountForm({ ...bankAccountForm });
                        } else {
                          bankInput(e);
                        }
                      }
                    }}
                    // onChange={(e) => {

                    // }}
                    helperText={
                      bankAccountForm.iban_number == "" &&
                      bankIinfoTrue.iban_number ? (
                        <p className="d-block">Code is required</p>
                      ) : (
                        ""
                      )
                    }
                  />
                  {bankAccountForm.ibanselect == "IFSC" ? (
                    bankAccountForm.visLoader != false ? (
                      <Button
                        sx={{ marginLeft: "10px", width: "40%" }}
                        variant="contained"
                        disabled
                        className="add_bank"
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
                        sx={{ marginLeft: "10px", width: "40%" }}
                        variant="contained"
                        className="add_bank"
                        disabled={bankAccountForm.show}
                        onClick={checkIfscCode}
                      >
                        Verify Code
                      </Button>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </Grid>

              {bankAccountForm.show && bankAccountForm.ifscdata.BRANCH ? (
                <div>
                  <span>
                    {bankAccountForm.ifscdata.BRANCH},
                    {bankAccountForm.ifscdata.CENTRE},
                    {bankAccountForm.ifscdata.STATE}
                  </span>
                </div>
              ) : (
                ""
              )}
            </Grid>
          </div>
        </div>
      );
    } else if (dialogTitle == "Add New Transaction") {
      if (transactionForm.type == "") {
        return (
          <div>
            <div>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.type == "" && trinputinfoTrue.type
                    ? true
                    : false
                }
              >
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="type"
                  value={transactionForm.type}
                  onChange={transactionInput}
                  onBlur={trinputtrueFalse}
                >
                  {permission.add_deposit == 1 ? (
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.add_withdraw == 1 ? (
                    <MenuItem value="WITHDRAWAL">Withdraw</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.internal_transfer == 1 ? (
                    <MenuItem value="INTERNAL_TRANSFER">
                      Internal Transfer
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.mt5_credit_debit == 1 ? (
                    <MenuItem value="CREDIT">Credit</MenuItem>
                  ) : (
                    ""
                  )}
                </Select>
                {transactionForm.type == "" && trinputinfoTrue.type ? (
                  <FormHelperText>Transaction Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
          </div>
        );
      } else if (transactionForm.type == "DEPOSIT") {
        return (
          <div>
            <div>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.type == "" && trinputinfoTrue.type
                    ? true
                    : false
                }
              >
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  value={transactionForm.type}
                  name="type"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                >
                  {permission.add_deposit == 1 ? (
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.add_withdraw == 1 ? (
                    <MenuItem value="WITHDRAWAL">Withdraw</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.internal_transfer == 1 ? (
                    <MenuItem value="INTERNAL_TRANSFER">
                      Internal Transfer
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.mt5_credit_debit == 1 ? (
                    <MenuItem value="CREDIT">Credit</MenuItem>
                  ) : (
                    ""
                  )}
                </Select>
                {transactionForm.type == "" && trinputinfoTrue.type ? (
                  <FormHelperText>Transaction Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>

            <div className="margeField padingtopmy5create">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.deposit_to == "" && trinputinfoTrue.deposit_to
                    ? true
                    : false
                }
              >
                <InputLabel>Deposit To</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="deposit_to"
                  onChange={transactionInput}
                  onBlur={trinputtrueFalse}
                  value={transactionForm.deposit_to}
                >
                  <MenuItem value="Wallet">Wallet</MenuItem>
                  <MenuItem value="mt5">MT5</MenuItem>
                </Select>
                {transactionForm.deposit_to == "" &&
                trinputinfoTrue.deposit_to ? (
                  <FormHelperText>Deposit To is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.payment == "" && trinputinfoTrue.payment
                    ? true
                    : false
                }
              >
                <InputLabel>Payment Gateway</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="payment"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                  value={transactionForm.payment}
                >
                  {depositMethods?.map((item, index) => {
                    if (item.status == 1) {
                      return (
                        <MenuItem
                          value={item.slug}
                          key={index}
                          onClick={() => {
                            imageDeposit = item?.qr_code;
                            bankDeposit = item?.bank_details;
                          }}
                        >
                          {item.title}
                        </MenuItem>
                      );
                    }
                  })}

                  {/* <MenuItem value="Bank">Bank</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="USDT">USDT</MenuItem>
                  <MenuItem value="Cash">Exchange</MenuItem> */}
                </Select>
                {transactionForm.payment == "" && trinputinfoTrue.payment ? (
                  <FormHelperText>Payment Gateway is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
            {transactionForm.deposit_to == "mt5" ? (
              <div
                className="margeField padingtopmy5create"
                error={
                  transactionForm.mt5_id == "" && trinputinfoTrue.mt5_id
                    ? true
                    : false
                }
              >
                {transactionForm.deposit_to == "mt5" ? (
                  <FormControl variant="standard" sx={{ width: "100%" }}>
                    <InputLabel>MT5 Account</InputLabel>
                    <Select
                      label
                      className="select-font-small"
                      name="mt5_id"
                      onBlur={trinputtrueFalse}
                      onChange={transactionInput}
                    >
                      {mt5AccountList.map((item) => {
                        return (
                          <MenuItem value={item.mt5_acc_no}>
                            {item.mt5_acc_no} ({item.mt5_name})
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {transactionForm.mt5_id == "" && trinputinfoTrue.mt5_id ? (
                      <FormHelperText>MT5 Account is required</FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            {transactionForm.payment == "bank" && bankDeposit.length !== 0 ? (
              <>
                <br />

                <div className="view-commission-content-section">
                  <div
                    className="view-content-element"
                    style={{ width: "237px" }}
                  >
                    <h6 className="element-title">Bank Name</h6>
                    <div className=" element-content">
                      {bankDeposit[0].bank_name}
                    </div>
                  </div>
                  <div
                    className="view-content-element"
                    style={{ width: "237px" }}
                  >
                    <h6 className="element-title">Holder Name</h6>
                    <div className=" element-content">
                      {bankDeposit[0].bank_ac_name}
                    </div>
                  </div>
                  <div
                    className="view-content-element"
                    style={{ width: "237px" }}
                  >
                    <h6 className="element-title">Account Number</h6>
                    <div className=" element-content">
                      {bankDeposit[0].bank_ac_number}
                    </div>
                  </div>
                  <div
                    className="view-content-element"
                    style={{ width: "237px" }}
                  >
                    <h6 className="element-title">Bank IFSC</h6>
                    <div className=" element-content">
                      {bankDeposit[0].bank_ifsc_code}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {imageDeposit ? (
              <div className="padingtopmy5create text-center">
                <img src={imageDeposit} alt="" width="150px" height="150px" />
              </div>
            ) : (
              ""
            )}
            {transactionForm.payment == "USDT.TRC20" ||
            transactionForm.payment == "BTC" ||
            transactionForm.payment == "gpay" ||
            transactionForm.payment == "paytm" ||
            transactionForm.payment == "phonepe" ||
            transactionForm.payment == "upi" ||
            transactionForm.payment == "bank" ? (
              <div className="padingtopmy5create">
                <TextField
                  className="input-font-small"
                  label={
                    transactionForm.payment == "USDT.TRC20" ||
                    transactionForm.payment == "BTC"
                      ? "Enter Crypto Address"
                      : `Enter UTR Number (Optional)`
                  }
                  // error={
                  //   transactionForm.transation_id == "" &&
                  //   trinputinfoTrue.transation_id
                  //     ? true
                  //     : false
                  // }
                  variant="standard"
                  sx={{ width: "100%" }}
                  name="transation_id"
                  // helperText={
                  //   transactionForm.transation_id == "" &&
                  //   trinputinfoTrue.transation_id
                  //     ? "Transation ID is required"
                  //     : ""
                  // }
                  onChange={transactionInput}
                  onBlur={trinputtrueFalse}
                />
              </div>
            ) : (
              ""
            )}

            <div className="margeField padingtopmy5create">
              <TextField
                className="input-font-small"
                label="Amount"
                type="text"
                error={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? true
                    : false
                }
                variant="standard"
                sx={{ width: "100%" }}
                name="amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                value={transactionForm.amount}
                onBlur={trinputtrueFalse}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    transactionInput(e);
                  }
                }}
                helperText={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? "Amount is required"
                    : ""
                }
              />
            </div>

            <div className="margeField padingtopmy5create">
              <TextField
                id="standard-textarea"
                label="Notes"
                // multiline
                error={
                  transactionForm.note == "" && trinputinfoTrue.note
                    ? true
                    : false
                }
                variant="standard"
                sx={{ width: "100%" }}
                name="note"
                onBlur={trinputtrueFalse}
                helperText={
                  transactionForm.note == "" && trinputinfoTrue.note
                    ? "Notes is required"
                    : ""
                }
                onChange={transactionInput}
              />
            </div>
            {transactionForm.payment == "USDT.TRC20" ||
            transactionForm.payment == "BTC" ||
            transactionForm.payment == "gpay" ||
            transactionForm.payment == "paytm" ||
            transactionForm.payment == "phonepe" ||
            transactionForm.payment == "upi" ||
            transactionForm.payment == "bank" ? (
              <>
                <div className="margeField padingtopmy5create">
                  <label>Proof</label>

                  <label
                    htmlFor="contained-button-file"
                    className="fileuploadButton"
                  >
                    <Input
                      accept="application/pdf,image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => {
                        if (
                          (e.target.files[0].type == "image/jpeg" ||
                            e.target.files[0].type == "image/png" ||
                            e.target.files[0].type == "image/jpg") &&
                          transactionForm.image?.length < 5
                        ) {
                          var objectUrl1 = URL.createObjectURL(
                            e.target.files[0]
                          );
                          transactionForm.image = [
                            ...transactionForm.image,
                            e.target.files[0],
                          ];
                          // transactionForm.image_per = objectUrl1;
                          setTransactionForm({ ...transactionForm });
                        } else if (transactionForm.image?.length >= 5) {
                          toast.error("You can upload max 5 deposit proof");
                        } else {
                          toast.error(
                            "Only JPG, JPEG and PNG types are accepted"
                          );
                        }
                      }}
                    />
                    <div style={{ marginLeft: "10px" }}>
                      <Button variant="contained" component="span">
                        <i className="material-icons">backup</i>
                        &nbsp;Upload
                      </Button>
                    </div>
                  </label>
                </div>

                <div className="deposit-image-flex">
                  {transactionForm.image?.map((item, index) => {
                    var imagep = URL.createObjectURL(item);
                    return (
                      <div className="">
                        <a
                          className="bg-transparent p-0 border-0"
                          style={{
                            textAlign: "center",
                            width: "100%",
                            display: "block",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            transactionForm.image.splice(index, 1);
                            setTransactionForm({ ...transactionForm });
                          }}
                        >
                          <CloseOutlinedIcon className="fontimgclose" />
                        </a>
                        <CustomImageModal
                          image={imagep}
                          className="deposit-upload-image-preview"
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        );
      } else if (transactionForm.type == "WITHDRAWAL") {
        return (
          <div>
            <div>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.type == "" && trinputinfoTrue.type
                    ? true
                    : false
                }
              >
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  value={transactionForm.type}
                  name="type"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                >
                  {permission.add_deposit == 1 ? (
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.add_withdraw == 1 ? (
                    <MenuItem value="WITHDRAWAL">Withdraw</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.internal_transfer == 1 ? (
                    <MenuItem value="INTERNAL_TRANSFER">
                      Internal Transfer
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.mt5_credit_debit == 1 ? (
                    <MenuItem value="CREDIT">Credit</MenuItem>
                  ) : (
                    ""
                  )}
                </Select>
                {transactionForm.type == "" && trinputinfoTrue.type ? (
                  <FormHelperText>Transaction Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
            <div className="margeField padingtopmy5create">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.withdrawForm == "" &&
                  trinputinfoTrue.withdrawForm
                    ? true
                    : false
                }
              >
                <InputLabel>Withdraw Form </InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="withdrawForm"
                  value={transactionForm.withdrawForm}
                  onChange={(e) => {
                    transactionInput(e);
                  }}
                  onBlur={trinputtrueFalse}
                >
                  <MenuItem value="Wallet">Wallet</MenuItem>
                  <MenuItem value="MT5">MT5</MenuItem>
                </Select>
                {transactionForm.withdrawForm == "" &&
                trinputinfoTrue.withdrawForm ? (
                  <FormHelperText>Withdraw Form is required</FormHelperText>
                ) : transactionForm.withdrawForm == "Wallet" &&
                  trinputinfoTrue.withdrawForm ? (
                  <FormHelperText sx={{ fontWeight: "700" }}>
                    Balance:-{walletBal}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
            {transactionForm.withdrawForm == "MT5" ? (
              <div className="padingtopmy5create">
                <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  error={
                    transactionForm.mt5_id == "" && trinputinfoTrue.mt5_id
                      ? true
                      : false
                  }
                >
                  <InputLabel>MT5 Account</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    name="mt5_id"
                    onBlur={trinputtrueFalse}
                    onChange={(e) => {
                      transactionInput(e);
                      getMtBalance(e.target.value);
                    }}
                  >
                    {mt5AccountList.map((item) => {
                      return (
                        <MenuItem value={item.mt5_acc_no}>
                          {item.mt5_acc_no} ({item.mt5_name})
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {transactionForm.mt5_id == "" && trinputinfoTrue.mt5_id ? (
                    <FormHelperText>MT5 Account is required</FormHelperText>
                  ) : transactionForm.mt5_id !== "" &&
                    trinputinfoTrue.mt5_id ? (
                    <FormHelperText
                      className="fw-700"
                      sx={{ fontWeight: "700" }}
                    >
                      Balance:-{mtBalance}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </div>
            ) : (
              ""
            )}
            <div className="margeField padingtopmy5create">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.payment_method == "" &&
                  trinputinfoTrue.payment_method
                    ? true
                    : false
                }
              >
                <InputLabel>Transaction Gateways</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="payment_method"
                  onChange={transactionInput}
                  onBlur={trinputtrueFalse}
                >
                  {allBank?.map((item, index) => {
                    if (item.payment_method == "UPI") {
                      paymentSub.UPI = item.payment_upi;
                    } else if (item.payment_method == "Crypto") {
                      paymentSub.Crypto = item.payment_crypto;
                    } else if (item.payment_method == "Bank") {
                      paymentSub.Bank = item.payment_bank;
                    }
                    if (item.active_status == 1) {
                      return (
                        <MenuItem value={item.payment_method} key={index}>
                          {item.payment_method}
                        </MenuItem>
                      );
                    }
                  })}
                  {/* <MenuItem value="Bank">BANK</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Cash">Exchange</MenuItem>
                  <MenuItem value="Crypto">Crypto</MenuItem> */}
                </Select>
                {transactionForm.payment_method == "" &&
                trinputinfoTrue.payment_method ? (
                  <FormHelperText>
                    Transaction Gateways is required
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
            {transactionForm.payment_method == "UPI" ? (
              <>
                <div className="padingtopmy5create">
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    error={
                      transactionForm.upi_name == "" && trinputinfoTrue.upi_name
                        ? true
                        : false
                    }
                  >
                    <InputLabel>UPI type</InputLabel>
                    <Select
                      label
                      className="select-font-small"
                      name="upi_name"
                      onChange={transactionInput}
                      onBlur={trinputtrueFalse}
                    >
                      {paymentSub?.UPI?.map((item, index) => {
                        return (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        );
                      })}
                      {/* <MenuItem value="Google Pay">Google Pay</MenuItem>
                      <MenuItem value="Phone Pay">Phone Pay</MenuItem>
                      <MenuItem value="Paytem">Paytem</MenuItem> */}
                    </Select>
                    {transactionForm.upi_name == "" &&
                    trinputinfoTrue.upi_name ? (
                      <FormHelperText>UPI type is required</FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </div>
                <div className="padingtopmy5create">
                  {transactionForm.upi_name ? (
                    <>
                      <TextField
                        className="input-font-small"
                        label={`${transactionForm.upi_name} UPI ID`}
                        variant="standard"
                        onBlur={trinputtrueFalse}
                        error={
                          transactionForm.upi_crypto_ac_number == "" &&
                          trinputinfoTrue.upi_crypto_ac_number
                            ? true
                            : false
                        }
                        sx={{ width: "100%" }}
                        name="upi_crypto_ac_number"
                        helperText={
                          transactionForm.upi_crypto_ac_number == "" &&
                          trinputinfoTrue.upi_crypto_ac_number
                            ? `${transactionForm.upi_name} is required`
                            : ""
                        }
                        onChange={transactionInput}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            {transactionForm.payment_method == "Crypto" ? (
              <>
                <br />
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    error={
                      transactionForm.crypto_name == "" &&
                      trinputinfoTrue.crypto_name
                        ? true
                        : false
                    }
                  >
                    <InputLabel> Crypto type</InputLabel>
                    <Select
                      label
                      className="select-font-small"
                      name="crypto_name"
                      onChange={transactionInput}
                      onBlur={trinputtrueFalse}
                    >
                      {paymentSub?.Crypto?.map((item, index) => {
                        return (
                          <MenuItem value={item.slug} key={index}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                      {/* <MenuItem value="BTC">Bitcoin</MenuItem>
                      <MenuItem value="ETH">Ethereum</MenuItem>
                      <MenuItem value="USDT">USDT</MenuItem>
                      <MenuItem value="LIT">Litecoin</MenuItem> */}
                    </Select>
                    {transactionForm.crypto_name == "" &&
                    trinputinfoTrue.crypto_name ? (
                      <FormHelperText>Crypto type is required</FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </div>
                <div className="padingtopmy5create">
                  {transactionForm.crypto_name ? (
                    <>
                      <TextField
                        className="input-font-small"
                        label={`${transactionForm.crypto_name} Address`}
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="upi_crypto_ac_number"
                        error={
                          transactionForm.upi_crypto_ac_number == "" &&
                          trinputinfoTrue.upi_crypto_ac_number
                            ? true
                            : false
                        }
                        helperText={
                          transactionForm.upi_crypto_ac_number == "" &&
                          trinputinfoTrue.upi_crypto_ac_number
                            ? `${transactionForm.upi_name} is required`
                            : ""
                        }
                        onChange={transactionInput}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            {transactionForm.payment_method == "Bank" ? (
              <>
                <div className="padingtopmy5create">
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    error={
                      transactionForm.user_bank_id == "" &&
                      trinputinfoTrue.user_bank_id
                        ? true
                        : false
                    }
                  >
                    <InputLabel>Bank Account</InputLabel>
                    <Select
                      label
                      className="select-font-small"
                      name="user_bank_id"
                      onBlur={trinputtrueFalse}
                      onChange={transactionInput}
                    >
                      {paymentSub?.Bank?.map((item) => {
                        return (
                          <MenuItem value={item.user_bank_id}>
                            {item.bank_account_holder_name} {"("}
                            {item.bank_account_number}
                            {")"}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {transactionForm.user_bank_id == "" &&
                    trinputinfoTrue.user_bank_id ? (
                      <FormHelperText>Bank Account is required</FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </div>
              </>
            ) : (
              ""
            )}

            <div className="margeField padingtopmy5create">
              <TextField
                id="standard-textarea"
                label="Amount"
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? true
                    : false
                }
                helperText={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? `Amount is required`
                    : ""
                }
                name="amount"
                value={transactionForm.amount}
                onBlur={trinputtrueFalse}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    transactionInput(e);
                  }
                }}
              />
            </div>

            <div className="margeField padingtopmy5create">
              <TextField
                id="standard-textarea"
                label="Remark"
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.remark == "" && trinputinfoTrue.remark
                    ? true
                    : false
                }
                helperText={
                  transactionForm.remark == "" && trinputinfoTrue.remark
                    ? `Remark is required`
                    : ""
                }
                name="remark"
                value={transactionForm.remark}
                onBlur={trinputtrueFalse}
                onChange={transactionInput}
              />
            </div>
            <div className="margeField padingtopmy5create">
              <TextField
                id="standard-textarea"
                label="Admin Note"
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.admin_note == "" && trinputinfoTrue.admin_note
                    ? true
                    : false
                }
                helperText={
                  transactionForm.admin_note == "" && trinputinfoTrue.admin_note
                    ? `Admin Note is required`
                    : ""
                }
                name="admin_note"
                value={transactionForm.admin_note}
                onBlur={trinputtrueFalse}
                onChange={transactionInput}
              />
            </div>
          </div>
        );
      } else if (transactionForm.type == "INTERNAL_TRANSFER") {
        return (
          <div>
            <div>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.type == "" && trinputinfoTrue.type
                    ? true
                    : false
                }
              >
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  value={transactionForm.type}
                  name="type"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                >
                  {permission.add_deposit == 1 ? (
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.add_withdraw == 1 ? (
                    <MenuItem value="WITHDRAWAL">Withdraw</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.internal_transfer == 1 ? (
                    <MenuItem value="INTERNAL_TRANSFER">
                      Internal Transfer
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.mt5_credit_debit == 1 ? (
                    <MenuItem value="CREDIT">Credit</MenuItem>
                  ) : (
                    ""
                  )}
                </Select>
                {transactionForm.type == "" && trinputinfoTrue.type ? (
                  <FormHelperText>Transaction Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>

            {/* <div className="margeField padingtopmy5create"> */}
            {/* <FormControl variant="standard" sx={{ width: "100%" }} focused>
                <InputLabel>From Account Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="from_account_type"
                  onChange={transactionInput}
                >
                  <MenuItem value="live">Live Accounts</MenuItem>
                  <MenuItem value="ib">IB Account</MenuItem>
                </Select>
              </FormControl> */}
            {/* <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel>Transfer To</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="transfer_to"
                  onChange={transactionInput}
                >
                  <MenuItem value="own">Own Account</MenuItem>
                  <MenuItem value="clients">Client's Account</MenuItem>
                </Select>
              </FormControl> */}
            {/* </div> */}

            <div className="margeField padingtopmy5create">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.account == "" && trinputinfoTrue.account
                    ? true
                    : false
                }
              >
                <InputLabel>From Account</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="account"
                  onChange={transactionInput}
                  onBlur={trinputtrueFalse}
                >
                  <MenuItem value="Wallet">Wallet</MenuItem>
                  <MenuItem value="MT5">MT5</MenuItem>
                </Select>
                {transactionForm.account == "" && trinputinfoTrue.account ? (
                  <FormHelperText>From Account is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              {transactionForm.account == "MT5" ? (
                <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  error={
                    transactionForm.account_to == "" &&
                    trinputinfoTrue.account_to
                      ? true
                      : false
                  }
                >
                  <InputLabel>To Account</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    name="account_to"
                    onChange={transactionInput}
                    onBlur={trinputtrueFalse}
                  >
                    <MenuItem value="Wallet">Wallet</MenuItem>
                    <MenuItem value="MT5">MT5</MenuItem>
                  </Select>
                  {transactionForm.account_to == "" &&
                  trinputinfoTrue.account_to ? (
                    <FormHelperText>To Account is required</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              ) : (
                <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  error={
                    transactionForm.account_to == "" &&
                    trinputinfoTrue.account_to
                      ? true
                      : false
                  }
                >
                  <InputLabel>To Account</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    name="account_to"
                    onChange={transactionInput}
                    onBlur={trinputtrueFalse}
                  >
                    {/* <MenuItem value="Wallet">Wallet</MenuItem> */}
                    <MenuItem value="MT5">MT5</MenuItem>
                  </Select>
                  {transactionForm.account_to == "" &&
                  trinputinfoTrue.account_to ? (
                    <FormHelperText>To Account is required</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
            </div>

            <div className="margeField padingtopmy5create">
              {transactionForm.account == "Wallet" ? (
                <>
                  <TextField
                    className="disabled-input-wallet-code"
                    label="Wallet Balance"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="Balance"
                    value={walletBal}
                    disabled
                    focused
                  />
                </>
              ) : transactionForm.account == "MT5" ? (
                <>
                  {" "}
                  <FormControl
                    variant="standard"
                    sx={{ width: "100%" }}
                    error={
                      transactionForm.from_mt5_account_id == "" &&
                      trinputinfoTrue.from_mt5_account_id
                        ? true
                        : false
                    }
                  >
                    <InputLabel>From MT5 Account ID</InputLabel>
                    <Select
                      label
                      className="select-font-small"
                      name="from_mt5_account_id"
                      onChange={transactionInput}
                      onBlur={trinputtrueFalse}
                    >
                      {mt5AccountList.map((item) => {
                        if (
                          transactionForm.mt5_account_id !== item.mt5_acc_no
                        ) {
                          return (
                            <MenuItem value={item.mt5_acc_no}>
                              {item.mt5_acc_no}
                            </MenuItem>
                          );
                        }
                      })}
                    </Select>
                    {transactionForm.from_mt5_account_id == "" &&
                    trinputinfoTrue.from_mt5_account_id ? (
                      <FormHelperText>
                        From MT5 Account ID is required
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </>
              ) : (
                ""
              )}
              {transactionForm.account_to == "MT5" ? (
                <FormControl
                  variant="standard"
                  sx={{ width: "100%" }}
                  error={
                    transactionForm.mt5_account_id == "" &&
                    trinputinfoTrue.mt5_account_id
                      ? true
                      : false
                  }
                >
                  <InputLabel>To MT5 Account ID</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    name="mt5_account_id"
                    onChange={transactionInput}
                    onBlur={trinputtrueFalse}
                  >
                    {mt5AccountList.map((item) => {
                      if (
                        transactionForm.from_mt5_account_id !== item.mt5_acc_no
                      ) {
                        return (
                          <MenuItem value={item.mt5_acc_no}>
                            {item.mt5_acc_no}
                          </MenuItem>
                        );
                      }
                    })}
                  </Select>
                  {transactionForm.mt5_account_id == "" &&
                  trinputinfoTrue.mt5_account_id ? (
                    <FormHelperText> MT5 Account ID is required</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              ) : transactionForm.account_to != "" ? (
                transactionForm.account == "MT5" &&
                transactionForm.account_to == "Wallet" ? (
                  <TextField
                    className="disabled-input-wallet-code"
                    label="Wallet Code"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="wallet_code"
                    onChange={transactionInput}
                    value={userData.data["wallet_code"]}
                    disabled
                    focused
                  />
                ) : (
                  <TextField
                    className="input-font-small"
                    label="Wallet Code"
                    error={
                      transactionForm.wallet_code == "" &&
                      trinputinfoTrue.wallet_code
                        ? true
                        : false
                    }
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="wallet_code"
                    helperText={
                      transactionForm.wallet_code == "" &&
                      trinputinfoTrue.wallet_code
                        ? "Wallet Code is required"
                        : ""
                    }
                    onBlur={trinputtrueFalse}
                    onChange={transactionInput}
                    focused
                  />
                )
              ) : (
                ""
              )}
              {transactionForm.from_mt5_account_id &&
              transactionForm.account == "MT5" ? (
                <>
                  <TextField
                    className="disabled-input-wallet-code"
                    label="MT5 Balance"
                    variant="standard"
                    sx={{ width: "100%" }}
                    name="MT5 Balance"
                    onChange={transactionInput}
                    value={mtBalance}
                    disabled
                    focused
                  />
                </>
              ) : (
                ""
              )}
            </div>
            {/* <div>
            </div>
            <br /> */}
            <div className="margeField">
              <TextField
                className="input-font-small"
                label="Amount"
                variant="standard"
                sx={{ width: "100%" }}
                name="amount"
                error={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? true
                    : false
                }
                helperText={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? "Amount is required"
                    : ""
                }
                onBlur={trinputtrueFalse}
                value={transactionForm.amount}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    transactionInput(e);
                  }
                }}
              />
              <TextField
                id="standard-textarea"
                label="Remark"
                multiline
                error={
                  transactionForm.note == "" && trinputinfoTrue.note
                    ? true
                    : false
                }
                helperText={
                  transactionForm.note == "" && trinputinfoTrue.note
                    ? "Note is required"
                    : ""
                }
                onBlur={trinputtrueFalse}
                variant="standard"
                sx={{ width: "100%" }}
                name="note"
                onChange={transactionInput}
              />
            </div>
          </div>
        );
      } else if (transactionForm.type == "CREDIT") {
        return (
          <div>
            <div>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.type == "" && trinputinfoTrue.type
                    ? true
                    : false
                }
              >
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  value={transactionForm.type}
                  name="type"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                >
                  {permission.add_deposit == 1 ? (
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.add_withdraw == 1 ? (
                    <MenuItem value="WITHDRAWAL">Withdraw</MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.internal_transfer == 1 ? (
                    <MenuItem value="INTERNAL_TRANSFER">
                      Internal Transfer
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {permission.mt5_credit_debit == 1 ? (
                    <MenuItem value="CREDIT">Credit</MenuItem>
                  ) : (
                    ""
                  )}
                </Select>
                {transactionForm.type == "" && trinputinfoTrue.type ? (
                  <FormHelperText>Transaction Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>

            <div className="margeField padingtopmy5create">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                focused
                error={
                  transactionForm.credit_type == "" &&
                  trinputinfoTrue.credit_type
                    ? true
                    : false
                }
              >
                <InputLabel>Credit Type</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="credit_type"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                >
                  <MenuItem value="credit">Credit In</MenuItem>
                  <MenuItem value="debit">Credit Out</MenuItem>
                </Select>
                {transactionForm.credit_type == "" &&
                trinputinfoTrue.credit_type ? (
                  <FormHelperText>Credit Type is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  transactionForm.account == "" && trinputinfoTrue.account
                    ? true
                    : false
                }
              >
                <InputLabel>Account</InputLabel>
                <Select
                  label
                  className="select-font-small"
                  name="account"
                  onBlur={trinputtrueFalse}
                  onChange={transactionInput}
                >
                  {mt5AccountList.map((item) => {
                    return (
                      <MenuItem value={item.mt5_acc_no}>
                        {item.mt5_acc_no}
                      </MenuItem>
                    );
                  })}
                </Select>
                {transactionForm.account == "" && trinputinfoTrue.account ? (
                  <FormHelperText>
                    From MT5 Account ID is required
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>

            <div className="margeField padingtopmy5create">
              <TextField
                className="input-font-small"
                label="Amount"
                error={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? true
                    : false
                }
                variant="standard"
                sx={{ width: "100%" }}
                name="amount"
                value={transactionForm.amount}
                onBlur={trinputtrueFalse}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    transactionInput(e);
                  }
                }}
                helperText={
                  transactionForm.amount == "" && trinputinfoTrue.amount
                    ? "Amount is required"
                    : ""
                }
              />
              <TextField
                id="standard-textarea"
                label="Notes"
                error={
                  transactionForm.note == "" && trinputinfoTrue.note
                    ? true
                    : false
                }
                helperText={
                  transactionForm.note == "" && trinputinfoTrue.note
                    ? "Note is required"
                    : ""
                }
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                name="note"
                onBlur={trinputtrueFalse}
                onChange={transactionInput}
              />
            </div>
          </div>
        );
      }
    } else if (dialogTitle == "Link to Campaign") {
      return (
        <div>
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Live Account</InputLabel>
              <Select
                label
                className="select-font-small"
                name="account"
                onChange={campaignInput}
              >
                <MenuItem value="1">12122</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Campaign</InputLabel>
              <Select
                label
                className="select-font-small"
                name="campaign"
                onChange={campaignInput}
              >
                <MenuItem value="2">525252</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "EDIT STRUCTURE") {
      return (
        <div className="master-structure-section">
          <div className="structureNameSection view-ib-content-section">
            <input
              type="text"
              className=""
              placeholder="Structure Name"
              name="name"
              value={partnershipMasterStructureData.structure_name}
              onChange={(e) => {
                partnershipMasterStructureData.structure_name = e.target.value;
                setPartnershipMasterStructureData({
                  ...partnershipMasterStructureData,
                });
                // setStructureList((preValue) => {
                //   return {
                //     ...preValue,
                //     structure_name: e.target.value,
                //   };
                // });
              }}
            />
          </div>
          <div className="main-content-input">
            <div className="ib-structure view-commission-content-section">
              {partnershipMasterStructureData.structure_data.map(
                (item, index) => {
                  return (
                    <div className="group-structure-section">
                      <div className="main-section">
                        <div className="main-section-title">
                          {item.ib_group_name}
                        </div>
                        <div className="main-section-input-element">
                          <div>
                            {/* <span>Rebate</span> */}
                            <input
                              type="text"
                              className="Rebate_amount"
                              placeholder="Rebate"
                              style={
                                (item.group_rebate * 100) /
                                  partnershipMasterStructureData
                                    .structure_dataOld[index].group_rebate1 >
                                100
                                  ? { border: "2px solid red" }
                                  : {}
                              }
                              disabled={
                                partnershipMasterStructureData
                                  .structure_dataOld[index].group_rebate1 == 0
                                  ? true
                                  : false
                              }
                              value={item.group_rebate}
                              onChange={(e) => {
                                var floatNumber = e.target.value.split(".");
                                if (!isNaN(Number(e.target.value))) {
                                  if (
                                    floatNumber.length == 1 ||
                                    (floatNumber.length == 2 &&
                                      floatNumber[1].length <= 3)
                                  ) {
                                    partnershipMasterStructureData.structure_data[
                                      index
                                    ]["group_rebate"] = e.target.value;
                                    partnershipMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"].forEach(
                                      (value, valueIndex) => {
                                        if (
                                          partnershipMasterStructureData
                                            .structure_dataOld[index][
                                            "pair_data1"
                                          ][valueIndex]["rebate1"] == 0
                                        ) {
                                          partnershipMasterStructureData.structure_data[
                                            index
                                          ]["pair_data"][valueIndex][
                                            "rebate"
                                          ] = 0;
                                        } else {
                                          partnershipMasterStructureData.structure_data[
                                            index
                                          ]["pair_data"][valueIndex]["rebate"] =
                                            e.target.value;
                                        }
                                      }
                                    );
                                    setPartnershipMasterStructureData({
                                      ...partnershipMasterStructureData,
                                    });
                                  }
                                } else if (
                                  e.target.value == "" ||
                                  e.target.value == 0
                                ) {
                                  partnershipMasterStructureData.structure_data[
                                    index
                                  ]["group_rebate"] = 0;
                                  partnershipMasterStructureData.structure_data[
                                    index
                                  ]["pair_data"].forEach(
                                    (value, valueIndex) => {
                                      partnershipMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][valueIndex]["rebate"] = 0;
                                    }
                                  );
                                  setPartnershipMasterStructureData({
                                    ...partnershipMasterStructureData,
                                  });
                                }
                              }}
                            />
                            <span>
                              {item.group_rebate == "0" ? (
                                <span className="fw-700 d-block">0.00%</span>
                              ) : (
                                <span className="fw-700 d-block">
                                  {(
                                    (item.group_rebate * 100) /
                                    partnershipMasterStructureData
                                      .structure_dataOld[index].group_rebate1
                                  ).toFixed(2) == Infinity ||
                                  (
                                    (item.group_rebate * 100) /
                                    partnershipMasterStructureData
                                      .structure_dataOld[index].group_rebate1
                                  ).toFixed(2) == "NaN"
                                    ? "0.00%"
                                    : `${(
                                        (item.group_rebate * 100) /
                                        partnershipMasterStructureData
                                          .structure_dataOld[index]
                                          .group_rebate1
                                      ).toFixed(2)}%`}
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            {/* <span>Commission</span> */}
                            <input
                              type="text"
                              className="commission_amount"
                              placeholder="Commission"
                              value={item.group_commission}
                              onChange={(e) => {
                                var floatNumber = e.target.value.split(".");
                                if (!isNaN(Number(e.target.value))) {
                                  if (
                                    floatNumber.length == 1 ||
                                    (floatNumber.length == 2 &&
                                      floatNumber[1].length <= 3)
                                  ) {
                                    partnershipMasterStructureData.structure_data[
                                      index
                                    ]["group_commission"] = e.target.value;
                                    partnershipMasterStructureData.structure_data[
                                      index
                                    ]["pair_data"].forEach(
                                      (value, valueIndex) => {
                                        partnershipMasterStructureData.structure_data[
                                          index
                                        ]["pair_data"][valueIndex][
                                          "commission"
                                        ] = e.target.value;
                                      }
                                    );
                                    setPartnershipMasterStructureData({
                                      ...partnershipMasterStructureData,
                                    });
                                  }
                                } else if (
                                  e.target.value == "" ||
                                  e.target.value == 0
                                ) {
                                  partnershipMasterStructureData.structure_data[
                                    index
                                  ]["group_commission"] = 0;
                                  partnershipMasterStructureData.structure_data[
                                    index
                                  ]["pair_data"].forEach(
                                    (value, valueIndex) => {
                                      partnershipMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][valueIndex][
                                        "commission"
                                      ] = 0;
                                    }
                                  );
                                  setPartnershipMasterStructureData({
                                    ...partnershipMasterStructureData,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="action-section">
                          <span
                            onClick={(e) => {
                              partnershipMasterStructureData.structure_data[
                                index
                              ]["is_visible"] = !item.is_visible;
                              setPartnershipMasterStructureData({
                                ...partnershipMasterStructureData,
                              });
                            }}
                          >
                            <i
                              class={`fa ${
                                item.is_visible
                                  ? "fa-angle-up"
                                  : "fa-angle-down"
                              }`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      </div>
                      <div
                        className={`pair-section ${
                          item.is_visible ? "child-section-visible" : ""
                        }`}
                      >
                        {item.pair_data.map((item1, index1) => {
                          return (
                            <div className="pair-data">
                              <div className="pair-data-title">
                                {item1.pair_name}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  className="rebert_amount"
                                  placeholder="Rebert"
                                  // value={item1.rebate}
                                  value={
                                    partnershipMasterStructureData
                                      .structure_dataOld[index]["pair_data1"][
                                      index1
                                    ]["rebate1"] == 0
                                      ? 0
                                      : item1.rebate
                                  }
                                  disabled={
                                    partnershipMasterStructureData
                                      .structure_dataOld[index]["pair_data1"][
                                      index1
                                    ]["rebate1"] == 0
                                      ? true
                                      : false
                                  }
                                  style={
                                    (item1.rebate * 100) /
                                      partnershipMasterStructureData
                                        .structure_dataOld[index]["pair_data1"][
                                        index1
                                      ]["rebate1"] >
                                    100
                                      ? { border: "2px solid red" }
                                      : {}
                                  }
                                  onChange={(e) => {
                                    var floatNumber = e.target.value.split(".");
                                    if (!isNaN(Number(e.target.value))) {
                                      if (
                                        floatNumber.length == 1 ||
                                        (floatNumber.length == 2 &&
                                          floatNumber[1].length <= 3)
                                      ) {
                                        partnershipMasterStructureData.structure_data[
                                          index
                                        ]["pair_data"][index1]["rebate"] =
                                          e.target.value;
                                        setPartnershipMasterStructureData({
                                          ...partnershipMasterStructureData,
                                        });
                                      }
                                    } else if (
                                      e.target.value == "" ||
                                      e.target.value == 0
                                    ) {
                                      partnershipMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][index1]["rebate"] = 0;
                                      setPartnershipMasterStructureData({
                                        ...partnershipMasterStructureData,
                                      });
                                    }
                                  }}
                                />
                                {item1.rebate == "0" ? (
                                  <span className="fw-700 d-block">0.00%</span>
                                ) : (
                                  <span className="fw-700 d-block">
                                    {(item1.rebate * 100) /
                                      partnershipMasterStructureData
                                        .structure_dataOld[index]["pair_data1"][
                                        index1
                                      ]["rebate1"] ==
                                      Infinity ||
                                    (item1.rebate * 100) /
                                      partnershipMasterStructureData
                                        .structure_dataOld[index]["pair_data1"][
                                        index1
                                      ]["rebate1"] ==
                                      "NaN"
                                      ? "0.00%"
                                      : `${(
                                          (item1.rebate * 100) /
                                          partnershipMasterStructureData
                                            .structure_dataOld[index][
                                            "pair_data1"
                                          ][index1]["rebate1"]
                                        ).toFixed(2)}%`}
                                  </span>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  className="commission_amount"
                                  placeholder="Commission"
                                  value={item1.commission}
                                  onChange={(e) => {
                                    var floatNumber = e.target.value.split(".");
                                    if (!isNaN(Number(e.target.value))) {
                                      if (
                                        floatNumber.length == 1 ||
                                        (floatNumber.length == 2 &&
                                          floatNumber[1].length <= 3)
                                      ) {
                                        partnershipMasterStructureData.structure_data[
                                          index
                                        ]["pair_data"][index1]["commission"] =
                                          e.target.value;
                                        setPartnershipMasterStructureData({
                                          ...partnershipMasterStructureData,
                                        });
                                      }
                                    } else if (
                                      e.target.value == "" ||
                                      e.target.value == 0
                                    ) {
                                      partnershipMasterStructureData.structure_data[
                                        index
                                      ]["pair_data"][index1]["commission"] = 0;
                                      setPartnershipMasterStructureData({
                                        ...partnershipMasterStructureData,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {/* {masterStructureData.map((item, index) => {
            return (
              <div className="structureInputSection">
                <hr className="solid" />
                <br />
                <Grid container>
                  <Grid item md={4} lg={4} xl={4} className="label-center">
                    <label>{item.ib_group_name}</label>
                  </Grid>
                  <Grid item md={8} lg={8} xl={8}>
                    <Grid container spacing={1}>
                      {item.pair_data.map((item1, index1) => {
                        return (
                          <>
                            <Grid item md={4} lg={4} xl={4}>
                              <label>{item1.pair_name}</label>
                            </Grid>
                            <Grid item md={4} lg={4} xl={4}>
                              <input
                                value={item1.rebate}
                                type="text"
                                className=""
                                placeholder="Rebate"
                                onChange={(e) => {
                                  masterStructureData[index]["pair_data"][
                                    index1
                                  ]["rebate"] = e.target.value;
                                  setMasterStructureData([
                                    ...masterStructureData,
                                  ]);
                                }}
                              />
                            </Grid>
                            <Grid item md={4} lg={4} xl={4}>
                              <input
                                value={item1.commission}
                                type="text"
                                className=""
                                placeholder="Commission"
                                onChange={(e) => {
                                  masterStructureData[index]["pair_data"][
                                    index1
                                  ]["commission"] = e.target.value;
                                  setMasterStructureData([
                                    ...masterStructureData,
                                  ]);
                                }}
                              />
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            );
          })} */}
          {/* <div>
          <div className="structureInputSection">
            <Grid container>
              <Grid item md={4} lg={4} xl={4} className="label-center">
                <div className="structureNameSection">
                  <label>Structure Name</label>
                  <input
                    type="text"
                    className=""
                    placeholder="Structure Name"
                    name="name"
                    onChange={inputEditSteuctureIB}
                  />
                </div>
              </Grid>
              <Grid item md={8} lg={8} xl={8}>
                <Grid container spacing={1}>
                  <Grid item md={3} lg={3} xl={3}></Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Account Type</label>
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Total Rebate</label>
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Total Commission</label>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={3} lg={3} xl={3}></Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <label>Executive</label>
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <input
                      type="text"
                      className=""
                      placeholder="Rebate"
                      name="total_rebate"
                      onChange={inputEditSteuctureIB}
                    />
                  </Grid>
                  <Grid item md={3} lg={3} xl={3}>
                    <input
                      type="text"
                      className=""
                      placeholder="Commission"
                      name="total_commission"
                      onChange={inputEditSteuctureIB}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <hr className="solid" />
          <div className="structureInputSection">
            {editSharedStructureForm.list.map((rowData, i) => (
              <Grid container spacing={1}>
                <Grid item md={4} lg={4} xl={4}>
                  <label>IB</label>
                </Grid>
                <Grid item md={4} lg={4} xl={4}>
                  <input
                    type="text"
                    className=""
                    style={{ width: "70%" }}
                    value={rowData.value}
                    onChange={(e) => inputEditSteuctureIB(e, i)}
                  />
                </Grid>
                <Grid item md={4} lg={4} xl={4}>
                  <Button variant="contained" className="btn-gradient">
                    Proceed
                  </Button>
                  <IconButton
                    aria-label="delete"
                    className="btn-danger"
                    onClick={(e) => deleteEditStructureIB(e, i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </div>
          <hr className="solid" />
          <div className="contentActionButton">
            <Button
              variant="contained"
              className="btn-gradient"
              onClick={editSharedStructurAddNewIB}
            >
              Add another IB
            </Button>
            <Button variant="contained" onClick={editSharedStructureIBSave}>
              Update For New Clients Only
            </Button>
          </div>
        </div> */}
        </div>
      );
    } else if (dialogTitle == "Change MT5 Password") {
      return (
        <div>
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                changeAccountPasswordForm.mt5_id == "" && input5infoTrue.mt5_id
                  ? true
                  : false
              }
            >
              <InputLabel>MT5 Account</InputLabel>
              <Select
                label
                className="select-font-small"
                name="mt5_id"
                onChange={input5}
                onBlur={input5trueFalse}
              >
                {mt5AccountList.map((item) => {
                  return (
                    <MenuItem value={item.mt5_acc_no}>
                      {item.mt5_acc_no}
                    </MenuItem>
                  );
                })}
              </Select>
              {changeAccountPasswordForm.mt5_id == "" &&
              input5infoTrue.mt5_id ? (
                <FormHelperText> MT5 Account is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                changeAccountPasswordForm.password_type == "" &&
                input5infoTrue.password_type
                  ? true
                  : false
              }
            >
              <InputLabel>Password Type</InputLabel>
              <Select
                label
                className="select-font-small"
                name="password_type"
                onChange={input5}
                onBlur={input5trueFalse}
              >
                <MenuItem value="main">Trading Password</MenuItem>
                <MenuItem value="investor">Investor Password</MenuItem>
              </Select>
              {changeAccountPasswordForm.password_type == "" &&
              input5infoTrue.password_type ? (
                <FormHelperText> MT5 Account is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              label="Password"
              type={showPassword ? "text" : "password"}
              onBlur={input5trueFalse}
              error={
                (!changeAccountPasswordForm.new_password.match(/[A-Z]/g) ||
                  !changeAccountPasswordForm.new_password.match(/[a-z]/g) ||
                  !changeAccountPasswordForm.new_password.match(/[0-9]/g) ||
                  changeAccountPasswordForm.new_password == "" ||
                  changeAccountPasswordForm.new_password.length < 8 ||
                  changeAccountPasswordForm.new_password.length >= 20 ||
                  !changeAccountPasswordForm.new_password.match(
                    /[!@#$%^&*()_+=]/g
                  )) &&
                input5infoTrue.new_password
                  ? true
                  : false
              }
              variant="standard"
              value={changeAccountPasswordForm.new_password}
              sx={{ width: "100%" }}
              name="new_password"
              helperText={
                changeAccountPasswordForm.new_password == "" &&
                input5infoTrue.new_password
                  ? "Enter your password"
                  : input5infoTrue.new_password &&
                    (changeAccountPasswordForm.new_password.length < 8 ||
                      changeAccountPasswordForm.new_password.length >= 20)
                  ? "Password must contain atleast 8-20 characters"
                  : input5infoTrue.new_password &&
                    (!changeAccountPasswordForm.new_password.match(/[A-Z]/g) ||
                      !changeAccountPasswordForm.new_password.match(/[a-z]/g) ||
                      !changeAccountPasswordForm.new_password.match(/[0-9]/g) ||
                      !changeAccountPasswordForm.new_password.match(
                        /[!@#$%^&*()_+=]/g
                      ))
                  ? "Atleast one lower case, upper case,special character and number required"
                  : ""
              }
              onChange={input5}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              type={investor ? "text" : "password"}
              onBlur={input5trueFalse}
              error={
                (changeAccountPasswordForm.confirm_password == "" ||
                  changeAccountPasswordForm.new_password !==
                    changeAccountPasswordForm.confirm_password) &&
                input5infoTrue.confirm_password
                  ? true
                  : false
              }
              label="Confirm Password"
              value={changeAccountPasswordForm.confirm_password}
              variant="standard"
              sx={{ width: "100%" }}
              name="confirm_password"
              helperText={
                changeAccountPasswordForm.confirm_password == "" &&
                input5infoTrue.confirm_password
                  ? "Enter your Confirm password"
                  : changeAccountPasswordForm.new_password !==
                      changeAccountPasswordForm.confirm_password &&
                    input5infoTrue.confirm_password
                  ? "Passwords must match"
                  : ""
              }
              onChange={input5}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={InvestorPassword} edge="end">
                    {investor ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Change Password") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Password"
              type={showPassword ? "text" : "password"}
              error={
                (!changePassword.password.match(/[A-Z]/g) ||
                  !changePassword.password.match(/[a-z]/g) ||
                  !changePassword.password.match(/[0-9]/g) ||
                  changePassword.password == "" ||
                  changePassword.password.length < 8 ||
                  changePassword.password.length >= 20 ||
                  !changePassword.password.match(/[!@#$%^&*()_+=]/g)) &&
                chinputinfoTrue.password
                  ? true
                  : false
              }
              variant="standard"
              sx={{ width: "100%" }}
              name="password"
              onChange={changePasswordInput}
              value={changePassword.password}
              onBlur={chinputtrueFalse}
              helperText={
                changePassword.password == "" && chinputinfoTrue.password
                  ? "Enter your password"
                  : chinputinfoTrue.password &&
                    (changePassword.password.length < 8 ||
                      changePassword.password.length >= 20)
                  ? "Password must contain atleast 8-20 characters"
                  : chinputinfoTrue.password &&
                    (!changePassword.password.match(/[A-Z]/g) ||
                      !changePassword.password.match(/[a-z]/g) ||
                      !changePassword.password.match(/[0-9]/g) ||
                      !changePassword.password.match(/[!@#$%^&*()_+=]/g))
                  ? "Atleast one lower case, upper case,special character and number required"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              type={investor ? "text" : "password"}
              error={
                (changePassword.new_password == "" ||
                  changePassword.password !== changePassword.new_password) &&
                chinputinfoTrue.new_password
                  ? true
                  : false
              }
              label="Confirm Password"
              variant="standard"
              sx={{ width: "100%" }}
              value={changePassword.new_password}
              name="new_password"
              onBlur={chinputtrueFalse}
              helperText={
                changePassword.new_password == "" &&
                chinputinfoTrue.new_password
                  ? "Enter your Confirm password"
                  : changePassword.new_password !== changePassword.password &&
                    chinputinfoTrue.new_password
                  ? "Passwords must match"
                  : ""
              }
              onChange={changePasswordInput}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={InvestorPassword} edge="end">
                    {investor ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </div>
        </div>
      );
    } else if (
      dialogTitle == myTraderData.user_name ||
      dialogTitle == myTraderData.main_user_name
    ) {
      return (
        <div className="bankDetailsTabSection downline-table">
          {myChildTraderData.parent_id != "" ? (
            <div>
              <Button
                onClick={(e) => {
                  getMyChildTrader(myChildTraderData.parent_id);
                }}
              >
                <i className="material-icons">arrow_back_ios</i>Back
              </Button>
            </div>
          ) : (
            ""
          )}

          <table>
            <thead>
              <tr>
                <th>SR.NO</th>
                <th>Name</th>
                <th>Email</th>
                <th>IB Account</th>
                <th>MT Code</th>
                <th>Deposit</th>
                <th>Withdraw</th>
                <th>Team Deposit</th>
                <th>Team Withdraw</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myChildTraderData.data.data != undefined ? (
                myChildTraderData.data.data.map((item) => {
                  return (
                    <tr>
                      <td>{item.sr_no}</td>
                      <td>{item.name}</td>
                      <td>{item.user_email}</td>
                      <td>{item.is_ib_account == "1" ? "Yes" : "No"}</td>
                      <td>{item.mt5_acc_ids}</td>
                      <td>{item.deposit_amount}</td>
                      <td>{item.withdrawal_amount}</td>
                      <td>{item.total_deposit}</td>
                      <td>{item.total_withdraw}</td>
                      <td>{item.wallet_balance}</td>
                      <td>
                        {item.is_ib_account == "1" &&
                        item.has_downline == true ? (
                          <Button
                            variant="contained"
                            className="add_note"
                            onClick={(e) => {
                              myTraderData.user_name = item.name;
                              myTraderData.user_id = item.client_id;
                              setMyTraderData({ ...myTraderData });
                              getMyChildTrader(item.client_id);
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-center" colSpan={10}>
                    Recored not found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5">
                  <b>
                    {myChildTraderData.data.footer_count != undefined
                      ? myChildTraderData.data["footer_count"]["total"]
                      : ""}
                  </b>
                </td>
                <td>
                  <b>
                    {myChildTraderData.data.footer_count != undefined
                      ? myChildTraderData.data["footer_count"][
                          "total_user_deposit"
                        ]
                      : ""}
                  </b>
                </td>
                <td>
                  <b>
                    {myChildTraderData.data.footer_count != undefined
                      ? myChildTraderData.data["footer_count"][
                          "total_user_withdraw"
                        ]
                      : ""}
                  </b>
                </td>
                <td>
                  <b>
                    {myChildTraderData.data.footer_count != undefined
                      ? myChildTraderData.data["footer_count"][
                          "total_total_user_deposit"
                        ]
                      : ""}
                  </b>
                </td>
                <td>
                  <b>
                    {myChildTraderData.data.footer_count != undefined
                      ? myChildTraderData.data["footer_count"][
                          "total_total_user_withdraw"
                        ]
                      : ""}
                  </b>
                </td>
                <td>
                  <b>
                    {myChildTraderData.data.footer_count != undefined
                      ? myChildTraderData.data["footer_count"][
                          "total_user_wallet"
                        ]
                      : ""}
                  </b>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      );
    } else if (dialogTitle == "Pamm Access") {
      return (
        <div>
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                value={pammAccess.status}
                onChange={pammAccessInput}
              >
                <MenuItem value="0">Disable</MenuItem>
                <MenuItem value="1">Enable</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      );
    } else if (dialogTitle == "Groups") {
      return (
        <div>
          <FormControl variant="standard" sx={{ width: "100%" }}>
            <InputLabel>Gorup</InputLabel>
            <Select
              label
              className="select-font-small"
              name="language"
              value={groupForm.group_id}
              onChange={(e) => {
                groupForm.group_id = e.target.value;
                setGroupForm({ ...groupForm });
              }}
            >
              {groupForm.list.map((item) => {
                return (
                  <MenuItem value={item.user_group_id}>
                    {item.user_group_name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      );
    } else if (dialogTitle == "Create Portfolio") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Name"
              error={
                createPortfolioForm.portfolio_name == "" &&
                cpinputinfoTrue.portfolio_name
                  ? true
                  : false
              }
              variant="standard"
              value={createPortfolioForm.portfolio_name}
              onChange={createPortfolioInput}
              onBlur={cpinputtrueFalse}
              sx={{ width: "100%" }}
              helperText={
                createPortfolioForm.portfolio_name == "" &&
                cpinputinfoTrue.portfolio_name
                  ? "Name is required"
                  : ""
              }
              name="portfolio_name"
            />
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                createPortfolioForm.mm_mt5_acc_id == "" &&
                cpinputinfoTrue.mm_mt5_acc_id
                  ? true
                  : false
              }
            >
              <InputLabel>Money Manager</InputLabel>
              <Select
                label
                className="select-font-small"
                name="mm_mt5_acc_id"
                value={createPortfolioForm.mm_mt5_acc_id}
                onChange={createPortfolioInput}
                onBlur={cpinputtrueFalse}
              >
                {moneyManagerListMenu.map((item) => {
                  return (
                    <MenuItem value={item.mm_mt5_acc_id}>
                      {item.mt5_name}
                    </MenuItem>
                  );
                })}
              </Select>
              {createPortfolioForm.mm_mt5_acc_id == "" &&
              cpinputinfoTrue.mm_mt5_acc_id ? (
                <FormHelperText>Money Manager is required</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </div>

          <div className="padingtopmy5create">
            <TextField
              className="input-font-small"
              label="Investment Months"
              type="text"
              onBlur={cpinputtrueFalse}
              error={
                createPortfolioForm.investment_months == "" &&
                cpinputinfoTrue.investment_months
                  ? true
                  : false
              }
              helperText={
                createPortfolioForm.investment_months == "" &&
                cpinputinfoTrue.investment_months
                  ? "Name is required"
                  : ""
              }
              value={createPortfolioForm.investment_months}
              name="investment_months"
              variant="standard"
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  createPortfolioInput(e);
                }
              }}
              // onChange={createPortfolioInput}
              sx={{ width: "100%" }}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Investment") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Amount"
              variant="standard"
              value={investmentForm.amount}
              name="amount"
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  investmentInput(e);
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Withdraw") {
      return (
        <div>
          <div>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="allWithdraw"
                    checked={withdrawForm.allWithdraw}
                    onChange={withdrawInput}
                  />
                }
                label="All Withdraw"
              />
            </FormGroup>
          </div>
          <div>
            <TextField
              className="input-font-small"
              label="Amount"
              type="text"
              variant="standard"
              // onChange={withdrawInput}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  withdrawInput(e);
                }
              }}
              sx={{ width: "100%" }}
              name="amount"
              disabled={withdrawForm.allWithdraw}
              value={withdrawForm.allWithdraw ? 0 : withdrawForm.amount}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Block/Unblock") {
      return (
        <div>
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Status</InputLabel>
              <Select
                label
                className="select-font-small"
                name="status"
                value={userBlockUnblockStatus.status}
                onChange={(e) => {
                  setUserBlockUnblockStatus((prevalue) => {
                    return {
                      ...prevalue,
                      status: e.target.value,
                    };
                  });
                }}
              >
                <MenuItem value="1">Block</MenuItem>
                <MenuItem value="0">Un-block</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Create MT5 Account") {
      return (
        <div>
          {createMt5Form.isLoader ? (
            <Button
              tabIndex="0"
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
              onClick={createMt5AccountSubmit}
            >
              Create
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Delete Bank") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {deleteBankDetail.isLoader ? (
            <Button
              tabIndex="0"
              size="large"
              className=" btn-danger font-color-white createMt5Formloder"
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
              className="btn-danger font-color-white"
              onClick={deleteBankDetailfunc}
            >
              Delete
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "MT5 Access") {
      return (
        <>
          {permission.check_mt5_status == 1 ? (
            <div className="dialogMultipleActionButton">
              <Button
                variant="contained"
                className="cancelButton"
                onClick={handleClose}
              >
                Cancel
              </Button>

              {Mt5AccessForm.isLoader ? (
                <Button
                  tabIndex="0"
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
                  className="btn-gradient btn-success"
                  onClick={Mt5AccountAccessSubmit}
                >
                  Update
                </Button>
              )}
            </div>
          ) : (
            ""
          )}
        </>
      );
    } else if (dialogTitle == "Link Existing Account") {
      return (
        <div>
          {linkAccountForm.isLoader ? (
            <Button
              tabIndex="0"
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
              onClick={linkAccountSubmit}
            >
              Link
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Reset MT5 Password") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {resetMt5PasswordForm.isLoader ? (
            <Button
              tabIndex="0"
              size="large"
              className=" btn-danger font-color-white createMt5Formloder"
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
              className="btn-danger font-color-white"
              onClick={resetAccountPasswordSubmit}
            >
              Reset
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Change MT5 Group") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {chGroup.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success createMt5Formloder"
              onClick={changeMtGroup}
            >
              Change
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Change Account leverage") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {changeLeverageForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success createMt5Formloder"
              onClick={changeLeverageSubmit}
            >
              Change
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Control Panel Access") {
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
            onClick={cpAccessSubmit}
          >
            Update
          </Button>
        </div>
      );
    } else if (dialogTitle == "Add Account" || dialogTitle == "Edit Account") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {bankAccountForm.isLoader ? (
            <Button
              tabIndex="0"
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
              onClick={bankAccountSubmit}
            >
              {dialogTitle}
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add New Note") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {noteForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={noteSubmit}
            >
              Add Note
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add New Transaction") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {transactionForm.isLoader == true ? (
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
              onClick={transactionSubmit}
            >
              Add Transaction
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Link To IB") {
      return (
        <div>
          <Button
            variant="contained"
            className="btn-success"
            onClick={linkIBFormSubmit}
          >
            Next
          </Button>
        </div>
      );
    } else if (dialogTitle == "Link Client") {
      return (
        <div>
          <Button
            variant="contained"
            className="btn-success"
            onClick={linkClientSubmit}
          >
            Save
          </Button>
        </div>
      );
    } else if (dialogTitle == "Add Master Structure") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {newMasterStructureData.isLoader ? (
            <Button
              tabIndex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
              {" "}
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
              onClick={masterStructureSubmit}
            >
              Add Structure
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit My Structure") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {newMasterStructureData1.isLoader ? (
            <Button
              tabIndex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
              {" "}
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
              onClick={masterStructureSubmit12}
            >
              Edit My Structure
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Move IB to IB") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {moveToIb.BisLoader ? (
            <Button
              tabIndex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
              {" "}
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
              onClick={onSubmitMoveTOIB}
            >
              Move IB to IB
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit Master Structure") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {newMasterStructureData.isLoader ? (
            <Button
              tabIndex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
              {" "}
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
              onClick={masterStructureSubmit1}
            >
              Edit Structure
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "ADD SHARED STRUCTURE") {
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
            onClick={sharedStructureSubmit}
          >
            Add
          </Button>
        </div>
      );
    } else if (dialogTitle == "Send Email") {
      return (
        <div className="dialogMultipleActionButton">
          {sendMailForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={sendMailSubmit}
            >
              Send
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Link to Campaign") {
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
            onClick={linkCampaignSubmit}
          >
            Link
          </Button>
        </div>
      );
    } else if (dialogTitle == "EDIT STRUCTURE") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {partnershipMasterStructureData.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={partnerMasterStructureSubmit}
            >
              Edit Structure
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Change MT5 Password") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {changeAccountPasswordForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={changeAccountPasswordSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "View Control Panel Access Password") {
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
    } else if (dialogTitle == "Change Password") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {changePassword.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={changeCRMAccountPasswordSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      );
    } else if (
      dialogTitle == myTraderData.user_name ||
      dialogTitle == myTraderData.main_user_name
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
        </div>
      );
    } else if (dialogTitle == "Pamm Access") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {pammAccess.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={pammAccessSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Groups") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {groupForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={userGroupSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Create Portfolio") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {createPortfolioForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={createPortfolioFormSubmit}
            >
              Create
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Investment") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {investmentForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={investmentFormSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Withdraw") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {withdrawForm.isLoader ? (
            <Button
              tabIndex="0"
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
              className="btn-gradient btn-success"
              onClick={withdrawFormSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Block/Unblock") {
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
            onClick={UserBlockUnblockSubmit}
          >
            Update
          </Button>
        </div>
      );
    }
  };

  const createPortfolioInput = (e) => {
    const { name, value } = e.target;

    setCreatePortfolioForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const cpinputtrueFalse = (event) => {
    var { name, value } = event.target;
    setcpinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const investmentInput = (e) => {
    const { name, value } = e.target;

    setInvestmentForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const withdrawInput = (e) => {
    var { name, value } = e.target;

    if (e.target.getAttribute) {
      if (e.target.getAttribute("type") == "checkbox") {
        value = e.target.checked;
      }
    }

    setWithdrawForm((prevalue) => {
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
  const input = (event) => {
    const { name, value } = event.target;
    setCreateMt5Form((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
    if (event.target.value == "1") {
      // const param = new FormData();
      // param.append("is_app", 1);
      // param.append("AADMIN_LOGIN_ID", 1);
      // axios
      //   .post(Url + "/ajaxfiles/get_mt5_live_packages.php", param)
      //   .then((res) => {
      //     setCreateLiveType(res.data.data);
      //   });
    }
  };
  const inputChGroup = (event) => {
    const { name, value } = event.target;
    setChGroup((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const inputChGroupTrueFalse = (event) => {
    const { name, value } = event.target;
    setChGrouptruefalse((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const getGroupname = (e) => {
    chGroup.mt5_account_id = e.target.value;
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("mt5_account_id", e.target.value);
    param.append("action", "get_mt5_groups");
    param.append("user_id", id);

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        chGroup.groupList = res.data.mt5_groups;
        chGroup.selectedGroup = res.data.my_current_group;
        setChGroup({ ...chGroup });
      });
  };
  const createMt5AccountSubmit = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    if (createMt5Form.account_type == "") {
      toast.error("Please select account type");
    } else if (createMt5Form.account_option == "") {
      toast.error("Please select account option");
    } else if (
      createMt5Form.mt5_balance == "" &&
      createMt5Form.account_type == "0"
    ) {
      toast.error("Please select account option");
    } else if (createMt5Form.password == "") {
      toast.error("Please enter password");
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=])[A-Za-z\d!@#$%^&*()_+=]{8,}$/g.test(
        createMt5Form.password
      )
    ) {
      toast.error(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
    } else if (createMt5Form.password.length <= 7) {
      /* !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        createMt5Form.password
      ) */
      toast.error("Minimum eight characters is required in Main password");
    } else if (createMt5Form.confirm_password == "") {
      toast.error("Please enter investor password");
    } else if (createMt5Form.confirm_password == createMt5Form.password) {
      toast.error("Investor password can't be the same as Main password");
    } else if (createMt5Form.confirm_password.length <= 7) {
      /* !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        createMt5Form.confirm_password
      ) */
      toast.error("Minimum eight characters is required in Investor password");
    } else {
      if (createMt5Form.account_type == "0") {
        param.append("mt5_balance", createMt5Form.mt5_balance);
      }
      setCreateMt5Form((prevalue) => {
        return { ...prevalue, isLoader: true };
      });
      param.append("user_id", id);
      param.append("main_password", createMt5Form.password);
      param.append("investor_password", createMt5Form.confirm_password);
      param.append("ib_group_id", createMt5Form.account_option);
      param.append("account_type", createMt5Form.account_type);
      param.append("action", "create_mt5_account");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setCreateMt5Form((prevalue) => {
            return { ...prevalue, isLoader: false };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            getAccountList();
            toast.success(res.data.message);
            setOpen(false);
            setRefresh(!refresh);
          }
        });
    }
  };
  const deleteBankDetailfunc = () => {
    deleteBankDetail.isLoader = true;
    setdeleteBankDetail({ ...deleteBankDetail });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);

    param.append("action", "delete_user_bank");
    param.append("bank_id", deleteBankDetail.bank_id);
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          deleteBankDetail.isLoader = false;
          setdeleteBankDetail({ ...deleteBankDetail });
          bankAccountForm.refresh = !bankAccountForm.refresh;
          setBankAccountForm({ ...bankAccountForm });
          setOpen(false);
        }
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
  const input1 = (event) => {
    const { name, value } = event.target;
    setMt5AccessForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });

    if (name == "account_type") {
      getMt5AccountStatus(value);
    }
  };

  const getMt5AccountStatus = (mt5ID) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("mt5_id", mt5ID);
    param.append("action", "check_mt5_status");
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          setMt5AccessForm((prevalue) => {
            return {
              ...prevalue,
              ["status"]: res.data.mt5_status,
            };
          });
        }
      });
  };

  const Mt5AccountAccessSubmit = () => {
    if (Mt5AccessForm.account_type == "") {
      toast.error("Please select account type");
    } else if (Mt5AccessForm.status == "") {
      toast.error("Please select status");
    } else {
      setMt5AccessForm((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("mt5_id", Mt5AccessForm.account_type);
      param.append("mt5_access_type", Mt5AccessForm.status);
      param.append("action", "mt5_access");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setMt5AccessForm((preValue) => {
            return {
              ...preValue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };
  const input2trueFalse = (event) => {
    var { name, value } = event.target;
    setinput2infoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const input2 = (event) => {
    const { name, value } = event.target;
    setLinkAccountForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const linkAccountSubmit = () => {
    if (linkAccountForm.account_number == "") {
      toast.error("Please enter account number");
    } else if (linkAccountForm.account_type == "") {
      toast.error("Please select account type");
    } else if (linkAccountForm.account_option == "") {
      toast.error("Please select account name");
    } else if (linkAccountForm.password == "") {
      toast.error("Please Enter Password");
    } else if (linkAccountForm.confirm_password == "") {
      toast.error("Please Enter Confirm Password");
    } else if (linkAccountForm.password != linkAccountForm.confirm_password) {
      toast.error("Confirm password must be the same as password");
    } else {
      setLinkAccountForm((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("mt5_id", linkAccountForm.account_number);
      param.append("account_type", linkAccountForm.account_type);
      param.append("ib_group_id", linkAccountForm.account_option);
      param.append("confirm_password", linkAccountForm.confirm_password);
      param.append("new_password", linkAccountForm.password);
      param.append("action", "mt5_link");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setLinkAccountForm((preValue) => {
            return {
              ...preValue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const input3 = (event) => {
    const { name, value } = event.target;
    setResetMt5PasswordForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const pammAccessInput = (event) => {
    const { name, value } = event.target;
    setPammAccess((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const resetAccountPasswordSubmit = () => {
    if (resetMt5PasswordForm.mt5_id == "") {
      toast.error("Please select account");
    } else {
      setResetMt5PasswordForm((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("mt5_id", resetMt5PasswordForm.mt5_id);

      param.append("action", "mt5_reset");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setResetMt5PasswordForm((preValue) => {
            return {
              ...preValue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
            getAccountList();
          }
        });
    }
  };

  const input4 = (event) => {
    const { name, value } = event.target;
    setChangeLeverageForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const input4trueFalse = (event) => {
    var { name, value } = event.target;
    setinput4infoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const changeLeverageSubmit = () => {
    if (changeLeverageForm.account == "") {
      toast.error("Please select account");
    } else if (changeLeverageForm.leverage == "") {
      toast.error("Please select leverage");
    } else {
      setChangeLeverageForm((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("action", "change_mt5_leverage");
      param.append("mt5_id", changeLeverageForm.account);
      param.append("new_leverage", changeLeverageForm.leverage);

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setChangeLeverageForm((preValue) => {
            return {
              ...preValue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };
  const changeMtGroup = () => {
    if (chGroup.mt5_account_id == "") {
      toast.error("Please select account");
    } else if (chGroup.mt5_group_id == "") {
      toast.error("Please select group");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("action", "update_mt5_group_id");
      param.append("mt5_account_id", chGroup.mt5_account_id);
      param.append("mt5_group_id", chGroup.mt5_group_id);
      chGroup.isLoader = true;
      setChGroup({ ...chGroup });
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }

          if (res.data.status == "error") {
            toast.error(res.data.message);
            chGroup.isLoader = false;
            setChGroup({ ...chGroup });
          } else {
            chGroup.isLoader = false;
            setChGroup({ ...chGroup });
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const input5 = (event) => {
    const { name, value } = event.target;
    setChangeAccountPasswordForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const input5trueFalse = (event) => {
    var { name, value } = event.target;
    setinput5infoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const changePasswordInput = (event) => {
    const { name, value } = event.target;
    setChangePassword((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const chinputtrueFalse = (event) => {
    var { name, value } = event.target;
    setchinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };

  const changeAccountPasswordSubmit = () => {
    if (changeAccountPasswordForm.mt5_id == "") {
      toast.error("Please Select MT5 Account");
    } else if (changeAccountPasswordForm.password_type == "") {
      toast.error("Please Select Password Type");
    } else if (changeAccountPasswordForm.new_password == "") {
      toast.error("Please enter Password");
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=])[A-Za-z\d!@#$%^&*()_+=]{8,}$/g.test(
        changeAccountPasswordForm.new_password
      )
    ) {
      toast.error(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
    } else if (changeAccountPasswordForm.confirm_password == "") {
      toast.error("Please enter Confirm password");
    } else if (
      changeAccountPasswordForm.new_password !==
      changeAccountPasswordForm.confirm_password
    ) {
      toast.error("Confirm password must be the same as password");
    } else {
      setChangeAccountPasswordForm((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("mt5_id", changeAccountPasswordForm.mt5_id);
      param.append("password_type", changeAccountPasswordForm.password_type);
      param.append("new_password", changeAccountPasswordForm.new_password);
      param.append(
        "confirm_password",
        changeAccountPasswordForm.confirm_password
      );
      param.append("action", "change_mt5_password");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setChangeAccountPasswordForm((preValue) => {
            return {
              ...preValue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const changeCRMAccountPasswordSubmit = () => {
    if (changePassword.password == "") {
      toast.error("Please enter Password");
    } else if (changePassword.new_password == "") {
      toast.error("Please enter Confirm password");
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=])[A-Za-z\d!@#$%^&*()_+=]{8,}$/g.test(
        changePassword.new_password
      )
    ) {
      toast.error(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
    } else if (changePassword.password !== changePassword.new_password) {
      toast.error("Confirm password must be the same as password");
    } else {
      setChangePassword((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("password", changePassword.password);
      param.append("confirm_password", changePassword.new_password);
      param.append("action", "change_password");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setChangeAccountPasswordForm((preValue) => {
            return {
              ...preValue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const pammAccessSubmit = () => {
    if (pammAccess.status == "") {
      toast.error("Please select status");
    } else {
      pammAccess.isLoader = true;
      setPammAccess({ ...pammAccess });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("is_pamm", pammAccess.status);
      param.append("action", "update_is_pamm");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          pammAccess.isLoader = false;
          setPammAccess({ ...pammAccess });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const input6 = (event) => {
    const { name, value } = event.target;
    setmasterStructureForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const masterStructureSubmit1 = () => {
    var error = false;
    if (newMasterStructureData.structure_data.length > 0) {
      if (newMasterStructureData.structure_name == "") {
        toast.error("Please enter structure name");
        error = true;
      } else {
        /* newMasterStructureData.structure_data.forEach((element) => {
          if (element.group_rebate === "") {
            toast.error(`Please enter ${element.ib_group_name} rebate`);
            error = true;
            return false;
          } else if (element.group_commission === "") {
            toast.error(`Please enter ${element.ib_group_name} commission`);
            error = true;
            return false;
          } else if (element.ib_group_level_id === 0) {
            toast.error(`Please enter ${element.ib_group_name} ib group`);
            error = true;
            return false;
          } else {
            element.pair_data.forEach((element1) => {
              if (element1.rebate === "") {
                toast.error(
                  `Please enter ${element.ib_group_name} in ${element1.pair_name} rebate`
                );
                error = true;
                return false;
              } else if (element1.rebate > element.group_rebate) {
                // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} rebate invalid`);
                toast.error(
                  `Pair Rebate for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group rebate`
                );
                error = true;
                return false;
              } else if (element1.commission === "") {
                toast.error(
                  `Please enter ${element.ib_group_name} in ${element1.pair_name} commission`
                );
                error = true;
                return false;
              } else if (element1.commission > element.group_commission) {
                // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} commission invalid`);
                toast.error(
                  `Pair Commission for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group commission`
                );
                error = true;
                return false;
              }
            });
          }
          if (error) {
            return false;
          }
        }); */
      }
      if (error) {
        return false;
      }
    }

    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    newMasterStructureData.isLoader = true;
    setNewMasterStructureData({ ...newMasterStructureData });
    param.append("user_id", id);
    param.append(
      "pair_data",
      JSON.stringify(newMasterStructureData.structure_data)
    );
    param.append("structure_name", newMasterStructureData.structure_name);
    param.append("structure_id", newMasterStructureData.structure_id);
    param.append("action", "update_strcuture_master");
    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          newMasterStructureData.isLoader = false;
          setNewMasterStructureData({ ...newMasterStructureData });
        } else {
          newMasterStructureData.isLoader = false;
          setNewMasterStructureData({ ...newMasterStructureData });
          toast.success(res.data.message);
          getMasterStructureList();
          handleClose();
        }
      });
  };

  const partnerMasterStructureSubmit = () => {
    var error = false;
    if (partnershipMasterStructureData.structure_data.length > 0) {
      if (partnershipMasterStructureData.structure_name == "") {
        toast.error("Please enter structure name");
        error = true;
      }
      // else {
      //   partnershipMasterStructureData.structure_data.forEach((element) => {
      //     if (element.group_rebate === "") {
      //       toast.error(`Please enter ${element.ib_group_name} rebate`);
      //       error = true;
      //       return false;
      //     } else if (element.group_commission === "") {
      //       toast.error(`Please enter ${element.ib_group_name} commission`);
      //       error = true;
      //       return false;
      //     } else if (element.ib_group_level_id === 0) {
      //       toast.error(`Please enter ${element.ib_group_name} ib group`);
      //       error = true;
      //       return false;
      //     } else {
      //       element.pair_data.forEach((element1) => {
      //         if (element1.rebate === "") {
      //           toast.error(
      //             `Please enter ${element.ib_group_name} in ${element1.pair_name} rebate`
      //           );
      //           error = true;
      //           return false;
      //         } else if (element1.rebate > element.group_rebate) {
      //           // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} rebate invalid`);
      //           toast.error(
      //             `Pair Rebate for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group rebate`
      //           );
      //           error = true;
      //           return false;
      //         } else if (element1.commission === "") {
      //           toast.error(
      //             `Please enter ${element.ib_group_name} in ${element1.pair_name} commission`
      //           );
      //           error = true;
      //           return false;
      //         } else if (element1.commission > element.group_commission) {
      //           // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} commission invalid`);
      //           toast.error(
      //             `Pair Commission for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group commission`
      //           );
      //           error = true;
      //           return false;
      //         }
      //       });
      //     }
      //     if (error) {
      //       return false;
      //     }
      //   });
      // }
      if (error) {
        return false;
      }
    }

    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    partnershipMasterStructureData.isLoader = true;
    setPartnershipMasterStructureData({ ...partnershipMasterStructureData });
    param.append("user_id", id);
    param.append(
      "pair_data",
      JSON.stringify(partnershipMasterStructureData.structure_data)
    );
    param.append(
      "structure_name",
      partnershipMasterStructureData.structure_name
    );
    param.append("structure_id", partnershipMasterStructureData.structure_id);
    param.append("action", "update_strcuture_master");
    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          partnershipMasterStructureData.isLoader = false;
          setPartnershipMasterStructureData({
            ...partnershipMasterStructureData,
          });
        } else {
          getMasterStructureList();

          partnershipMasterStructureData.isLoader = false;
          setPartnershipMasterStructureData({
            ...partnershipMasterStructureData,
          });
          toast.success(res.data.message);
          getPartnershipMasterStructure(
            partnershipMasterStructureData.structure_id
          );
          handleClose();
        }
      });
  };
  const masterStructureSubmit12 = () => {
    const param = new FormData();
    newMasterStructureData1.isLoader = true;
    setNewMasterStructureData1({ ...newMasterStructureData1 });
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append(
      "pair_data",
      JSON.stringify(newMasterStructureData1.structure_data)
    );
    param.append("structure_id", newMasterStructureData1.structure_id);
    param.append("action", "change_assigned_rebate");

    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          newMasterStructureData1.isLoader = false;
          setNewMasterStructureData1({ ...newMasterStructureData1 });
        } else {
          newMasterStructureData1.isLoader = false;
          setNewMasterStructureData1({ ...newMasterStructureData1 });
          toast.success(res.data.message);
          getMyAssignedStructure();
          handleClose();
        }
      });
  };
  const masterStructureSubmit = () => {
    var error = false;
    if (newMasterStructureData.structure_data.length > 0) {
      if (newMasterStructureData.structure_name == "") {
        toast.error("Please enter structure name");
        error = true;
      } else {
        /* newMasterStructureData.structure_data.forEach((element) => {
          if (element.group_rebate === "") {
            toast.error(`Please enter ${element.ib_group_name} rebate`);
            error = true;
            return false;
          } else if (element.group_commission === "") {
            toast.error(`Please enter ${element.ib_group_name} commission`);
            error = true;
            return false;
          } else if (element.ib_group_level_id === 0) {
            toast.error(`Please enter ${element.ib_group_name} ib group`);
            error = true;
            return false;
          } else {
            element.pair_data.forEach((element1) => {
              if (element1.rebate === "") {
                toast.error(
                  `Please enter ${element.ib_group_name} in ${element1.pair_name} rebate`
                );
                error = true;
                return false;
              } else if (element1.rebate > element.group_rebate) {
                // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} rebate invalid`);
                toast.error(
                  `Pair Rebate for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group rebate`
                );
                error = true;
                return false;
              } else if (element1.commission === "") {
                toast.error(
                  `Please enter ${element.ib_group_name} in ${element1.pair_name} commission`
                );
                error = true;
                return false;
              } else if (element1.commission > element.group_commission) {
                // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} commission invalid`);
                toast.error(
                  `Pair Commission for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group commission`
                );
                error = true;
                return false;
              }
            });
          }
          if (error) {
            return false;
          }
        }); */
      }
      if (error) {
        return false;
      }
    }

    const param = new FormData();
    newMasterStructureData.isLoader = true;
    setNewMasterStructureData({ ...newMasterStructureData });
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append(
      "pair_data",
      JSON.stringify(newMasterStructureData.structure_data)
    );
    param.append("structure_name", newMasterStructureData.structure_name);
    param.append("action", "insert_strcuture_master");

    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          newMasterStructureData.isLoader = false;
          setNewMasterStructureData({ ...newMasterStructureData });
        } else {
          newMasterStructureData.isLoader = false;
          setNewMasterStructureData({ ...newMasterStructureData });
          toast.success(res.data.message);
          handleClose();
        }
      });
  };

  const profileInput = (event) => {
    const { name, value } = event.target;
    setProfileForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    axios.post(Url + "/datatable/get_countries.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        countryData.data = res.data.aaData;
        setCountryData({ ...countryData });
      }
    });
  }, []);

  const profileSubmit = async () => {
    if (profileForm.title == "") {
      toast.error("Please select title");
    } else if (profileForm.first_name == "") {
      toast.error("Please enter first name");
    } else if (profileForm.last_name == "") {
      toast.error("Please enter last name");
    } else if (profileForm.phone == "") {
      toast.error("Please enter phone number");
    } else if (profileForm.dob == "") {
      toast.error("Please select date of birth");
    } else if (profileForm.nationality == "") {
      toast.error("Please select nationality");
    } else if (profileForm.country_of_residence == "") {
      toast.error("Please select country of residence");
    } else if (profileForm.city == "") {
      toast.error("Please enter city");
    } else if (profileForm.address == "") {
      toast.error("Please enter address");
    } else if (profileForm.gender == "") {
      toast.error("Please select gender");
    } else if (profileForm.postal_code == "") {
      toast.error("Please enter postal code");
    } else if (profileForm.language == "") {
      toast.error("Please select language");
    } else if (profileForm.source == "") {
      toast.error("Please enter source");
    } else if (profileForm.us_citizen == "") {
      toast.error("Please select us citizen");
    } else if (profileForm.finacial_work == "") {
      toast.error("Please select worked in financial");
    } else if (profileForm.tax_number == "") {
      toast.error("Please enter tax identification number");
    } else if (profileForm.politically_exposed == "") {
      toast.error("Please select politically exposed");
    } else if (profileForm.sales_agent == "") {
      toast.error("Please select sales agent");
    } else if (profileForm.login_block == "") {
      toast.error("Please select Login Block");
    } else if (profileForm.user_status == "") {
      toast.error("Please select user_status");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "update_basic_information");
      param.append("user_id", id);
      param.append(
        "manager_id",
        profileForm.sales_agent ? profileForm.sales_agent.manager_id : ""
      );
      param.append("user_title", profileForm.title);
      param.append("user_first_name", profileForm.first_name);
      param.append("user_last_name", profileForm.last_name);
      param.append("user_dob", profileForm.dob);
      param.append("user_email", profileForm.email);
      param.append("user_phone", profileForm.phone);
      param.append("user_nationality", profileForm.nationality);
      param.append("user_country", profileForm.country_of_residence);
      param.append("user_city", profileForm.city);
      param.append("user_state", profileForm.state);
      param.append("user_address_1", profileForm.address);
      param.append("user_address_2", profileForm.address_2);
      param.append("user_gender", profileForm.gender);
      param.append("user_postcode", profileForm.postal_code);
      param.append("user_language", profileForm.language);
      param.append("user_source", profileForm.source);
      param.append("us_citizen", profileForm.us_citizen);
      param.append("worked_in_financial", profileForm.finacial_work);
      param.append("tax_identification_number", profileForm.tax_number);
      param.append("politically_exposed", profileForm.politically_exposed);
      param.append("user_status", profileForm.user_status);
      param.append("login_block", profileForm.login_block);
      axios
        .post(`${Url}/ajaxfiles/update_user_profile.php`, param)
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
            toast.success(res.data.message);
          }
        });
    }
  };

  const employementInput = (event) => {
    const { name, value } = event.target;
    setEmploymentDetailsForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const employmentDetailsSubmit = () => {
    if (employmentDetailsForm.status == "") {
      toast.error("Please select employment status");
    } else if (employmentDetailsForm.industry == "") {
      toast.error("Please select employment industry");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("employment_status", employmentDetailsForm.status);
      param.append("inudstry", employmentDetailsForm.industry);
      param.append("action", "update_employement_status");

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
            toast.success(res.data.message);
          }
        });
    }
  };

  const sharedStructureSubmit = () => {
    if (sharedStructureForm.name == "") {
      toast.error("Please enter structure name");
    } else if (sharedStructureForm.total_rebate == "") {
      toast.error("Please enter total rebate");
    } else if (sharedStructureForm.total_commission == "") {
      toast.error("Please enter total commission");
    } else if (sharedStructureForm.list.length > 0) {
      var emptyIb = false;
      sharedStructureForm.list.map((rowData, i) => {
        if (rowData.value == "") {
          emptyIb = true;
          toast.error("Please enter IB");
        }
      });

      if (!emptyIb) {
        toast.success("Shared Structure has been added successfully");
        setOpen(false);
      }
    } else {
      toast.success("Shared Structure has been added successfully");
      setOpen(false);
    }
  };

  const sharedStructurAddNewIB = () => {
    sharedStructureForm.list.push({
      id: "",
      name: "",
      value: "",
    });
    setSharedStructureForm({ ...sharedStructureForm });
  };

  const editSharedStructurAddNewIB = () => {
    editSharedStructureForm.list.push({
      id: "",
      name: "",
      value: "",
    });
    setEditSharedStructureForm({ ...editSharedStructureForm });
  };

  const editSharedStructureIBSave = () => {
    if (editSharedStructureForm.list.length > 0) {
      var emptyIb = false;
      editSharedStructureForm.list.map((rowData, i) => {
        if (rowData.value == "") {
          emptyIb = true;
          toast.error("Please enter IB");
        }
      });

      if (!emptyIb) {
        toast.success("Edit Shared Structure has been added successfully");
        setOpen(false);
      }
    } else {
      toast.success("Edit Shared Structure has been added successfully");
      setOpen(false);
    }
  };

  const deleteEditStructureIB = (e, index) => {
    editSharedStructureForm.list.splice(index, 1);
    setEditSharedStructureForm({ ...editSharedStructureForm });
  };

  const inputEditSteuctureIB = (e, index) => {
    const { name, value } = e.target;
    editSharedStructureForm.list[index].value = value;
    setEditSharedStructureForm({ ...editSharedStructureForm });
  };

  const deleteStructureIB = (e, index) => {
    sharedStructureForm.list.splice(index, 1);
    setSharedStructureForm({ ...sharedStructureForm });
  };

  const inputSteuctureIB = (e, index) => {
    const { name, value } = e.target;
    sharedStructureForm.list[index].value = value;
    setSharedStructureForm({ ...sharedStructureForm });
  };

  const sharedStructurIBInput = (event) => {
    const { name, value } = event.target;
    setSharedStructureForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const linkClientInput = (event) => {
    const { name, value } = event.target;
    setLinkClientForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const onSubmitMoveTOIB = () => {
    if (!moveToIb.ibName) {
      toast.error("Please select IB Name");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("sponsor_id", moveToIb.ibName.sponser_id);
      param.append("action", "move_ib_to_ib");
      moveToIb.BisLoader = true;
      setMoveToIb({ ...moveToIb });
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            moveToIb.BisLoader = false;
            setMoveToIb({ ...moveToIb });
          } else {
            toast.success(res.data.message);
            moveToIb.BisLoader = false;
            setMoveToIb({ ...moveToIb });
            setOpen(false);
          }
        });
    }
  };
  const linkClientSubmit = () => {
    if (linkClientForm.client == "") {
      toast.error("Please select client");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("client_id", linkClientForm.client);
      param.append("action", "link_client");

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const linkIBInput = (event) => {
    const { name, value } = event.target;
    setLinkIBForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const linkIBFormSubmit = () => {
    if (linkIBForm.customer_name == "") {
      toast.error("Please enter master account id");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("sponsor_id", linkIBForm.customer_name);
      param.append("action", "link_ib");

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const sendMailInput = (event) => {
    const { name, value } = event.target;
    setsendMailForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const sendMailinputtrueFalse = (event) => {
    var { name, value } = event.target;
    setsendMailinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const sendMailSubmit = () => {
    /* if (sendMailForm.from == "") {
      toast.error("Please select from e-mail address");
    } else  */
    if (sendMailForm.to == "") {
      toast.error("Please enter to e-mail address");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sendMailForm.to)
    ) {
      toast.error("Enter a valid to e-mail");
    } else if (sendMailForm.subject == "") {
      toast.error("Please enter subject");
    } else if (sendMailForm.template_title == "") {
      toast.error("Please enter template title");
    } else if (sendMailForm.language == "") {
      toast.error("Please select language");
    } else if (sendMailForm.body == "") {
      toast.error("Please enter body");
    } else {
      setsendMailForm((prevalue) => {
        return {
          ...prevalue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      // param.append("mail_from", sendMailForm.from);
      param.append("mail_to", sendMailForm.to);
      param.append("subject", sendMailForm.subject);
      param.append("template_title", sendMailForm.template_title);
      param.append("language", sendMailForm.language);
      param.append("message", sendMailForm.body);
      param.append("action", "send_mail");
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setsendMailForm((prevalue) => {
            return {
              ...prevalue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const onContentStateChange = (event) => {
    sendMailForm.body = draftToHtml(event);
    setsendMailForm({ ...sendMailForm });
  };

  const input7 = (event) => {
    const { name, value } = event.target;
    setCpAccessForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const cpAccessSubmit = () => {
    if (cpAccessForm.status == "") {
      toast.error("Please select control panel access");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("action", "update_cp_access");
      param.append("user_status", cpAccessForm.status);

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const UserBlockUnblockSubmit = () => {
    if (userBlockUnblockStatus.status == "") {
      toast.error("Please select user block/unblock status");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("action", "block_unblock_user");
      param.append("login_block", userBlockUnblockStatus.status);

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
            getUserDetails();
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const input8 = (event) => {
    var { name, value } = event.target;
    if (event.target.getAttribute) {
      if (event.target.getAttribute("type") == "checkbox") {
        value = event.target.checked;
      }
    }
    setNoteForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const noteSubmit = () => {
    if (noteForm.notes == "") {
      toast.error("Please enter note");
      /* } else if (noteForm.call_status == "") {
        toast.error("Please select call status");
      } else if (noteForm.set_reminder == true && noteForm.date == "") {
        toast.error("Please select date"); */
    } else {
      setNoteForm((prevalue) => {
        return {
          ...prevalue,
          isLoader: true,
        };
      });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("action", "add_new_notes");
      param.append("notes", noteForm.notes);
      /* param.append("call_status", noteForm.call_status);
      param.append("reminder", noteForm.date); */
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          setNoteForm((prevalue) => {
            return {
              ...prevalue,
              isLoader: false,
            };
          });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setRefresh(!refresh);
            setOpen(false);
          }
        });
    }
  };

  const bankInput = (event) => {
    const { name, value } = event.target;
    setBankAccountForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const bankInputtrueFalse = (event) => {
    var { name, value } = event.target;
    setbankIinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const bankAccountSubmit = async (prop) => {
    if (prop) {
      if (bankAccountForm.name == "") {
        toast.error("Please enter beneficiary name");
      } else if (bankAccountForm.bank_name == "") {
        toast.error("Please enter beneficiary bank name");
      } else if (bankAccountForm.currency == "") {
        toast.error("currency is required");
      } else if (bankAccountForm.account_number == "") {
        toast.error("Please enter account number");
      } else if (
        bankAccountForm.account_number !==
        bankAccountForm.confirm_account_number
      ) {
        toast.error("Account number must match");
      } else if (
        !bankAccountForm.bank_proof &&
        !bankAccountForm.bank_proof_preview
      ) {
        toast.error("Please upload bank proof like a passbook or checkbook.");
      } else if (bankAccountForm.iban_number == "") {
        toast.error(`Please enter ${bankAccountForm.ibanselect} Number`);
      } else if (
        bankAccountForm.show == false &&
        bankAccountForm.ibanselect == "IFSC"
      ) {
        toast.error("Please first verify IFSC your code");
      } else {
        const param = new FormData();
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("user_id", id);
        param.append("is_bank_ifsc_iban", bankAccountForm.ibanselect);
        param.append("bank_name", bankAccountForm.name);
        param.append("bank_ifsc", bankAccountForm.iban_number);
        param.append("bank_account_number", bankAccountForm.account_number);
        param.append("bank_account_name", bankAccountForm.bank_name);
        param.append("swift_code", bankAccountForm.swift_code);
        param.append("currency", bankAccountForm.currency);

        param.append(
          "confirm_bank_account_number",
          bankAccountForm.confirm_account_number
        );

        if (bankAccountForm.user_bank_id) {
          param.append("user_bank_id", bankAccountForm.user_bank_id);
          param.append("action", "update_user_bank");
          if (
            bankAccountForm.bank_proof &&
            bankAccountForm.bank_proof_preview
          ) {
            param.append("bank_proof", bankAccountForm.bank_proof);
          }
        } else {
          param.append("action", "add_user_bank");
          param.append("bank_proof", bankAccountForm.bank_proof);
        }
        setBankAccountForm((preValue) => {
          return {
            ...preValue,
            isLoader: true,
          };
        });
        await axios
          .post(Url + "/ajaxfiles/update_user_profile.php", param)
          .then((res) => {
            if (res.data.message == "Session has been expired") {
              toast.error(res.data.message);
              localStorage.setItem("login", true);
              navigate("/");
              return;
            }
            setBankAccountForm((preValue) => {
              return {
                ...preValue,
                isLoader: false,
              };
            });
            if (res.data.status == "error") {
              toast.error(res.data.message);
            } else {
              toast.success(res.data.message);
              bankAccountForm.refresh = !bankAccountForm.refresh;
              setBankAccountForm({ ...bankAccountForm });
              setOpen(false);
            }
          });
      }
    } else {
      setBankAccountForm((preValue) => {
        return {
          ...preValue,
          isLoader: true,
        };
      });
      if (bankAccountForm.name == "") {
        toast.error("Please enter beneficiary name");
      } else if (bankAccountForm.bank_name == "") {
        toast.error("Please enter beneficiary bank name");
      } else if (bankAccountForm.currency == "") {
        toast.error("currency is required");
      } else if (bankAccountForm.account_number == "") {
        toast.error("Please enter account number");
      } else if (
        bankAccountForm.account_number !==
        bankAccountForm.confirm_account_number
      ) {
        toast.error("Account number must match");
      } else if (bankAccountForm.iban_number == "") {
        toast.error(`Please enter ${bankAccountForm.ibanselect} Number`);
      } else if (
        bankAccountForm.show == false &&
        bankAccountForm.ibanselect == "IFSC"
      ) {
        toast.error("Please first verify IFSC your code");
      } else {
        const param = new FormData();
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("action", "add_user_bank");
        param.append("user_id", id);
        param.append("is_bank_ifsc_iban", bankAccountForm.ibanselect);

        param.append("bank_name", bankAccountForm.name);
        param.append("bank_ifsc", bankAccountForm.iban_number);
        param.append("bank_account_number", bankAccountForm.account_number);
        param.append("bank_account_name", bankAccountForm.bank_name);
        param.append("swift_code", bankAccountForm.swift_code);
        param.append("currency", bankAccountForm.currency);
        if (bankAccountForm.user_bank_id) {
          param.append("user_bank_id", bankAccountForm.user_bank_id);
        }
        await axios
          .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
              toast.success(res.data.message);
              setOpen(false);
            }
          });
      }
    }
  };

  const transactionInput = (event) => {
    const { name, value } = event.target;
    if (name == "type") {
      imageDeposit = "";
      bankDeposit = [];
      setTransactionForm({
        type: value,
        payment_method: "",
        from_account_type: "",
        from_mt5_account_id: "",
        withdrawForm: "",
        mt5_id: "",
        remark: "",
        admin_note: "",
        credit_type: "",
        image: [],
        image_per: "",
        transfer_to: "",
        account: "",
        account_to: "",
        payment: "",
        amount: "",
        mt5_id: "",
        note: "",
        currency_code: "",
        isLoader: false,
        deposit_to: "",
        transation_id: "",
        wallet_code: "",
        mt5_account_id: "",
        user_bank_id: "",
        upi_name: "",
        upi_crypto_ac_number: "",
        crypto_name: "",
      });
      settrinputinfoTrue({
        type: false,
        from_account_type: false,
        mt5_id: false,
        credit_type: false,
        deposit_to: false,
        transfer_to: false,
        account: false,
        account_to: false,
        payment: false,
        payment_method: false,
        amount: false,

        note: false,
        currency_code: false,
        isLoader: false,
        transation_id: false,
        wallet_code: false,
        mt5_account_id: false,
        user_bank_id: false,
        upi_name: false,
        upi_crypto_ac_number: false,
        crypto_name: false,
      });
    }
    if (name == "from_mt5_account_id") {
      getMtBalance(value);
    }
    if (name == "account") {
      transactionForm.from_mt5_account_id = "";
    }
    if (name == "account_to") {
      if (transactionForm.account == "MT5" && value == "Wallet") {
        transactionForm.wallet_code = userData.data["wallet_code"];
        transactionForm.mt5_account_id = "";

        setTransactionForm({ ...transactionForm });
      }
    }
    if (name !== "type") {
      transactionForm[name] = value;
      setTransactionForm({ ...transactionForm });
    }

    // setTransactionForm((prevalue) => {
    //   return {
    //     ...prevalue,
    //     [name]: value,
    //   };
    // });
  };

  const trinputtrueFalse = (event) => {
    var { name, value } = event.target;
    settrinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const transactionSubmit = async () => {
    if (transactionForm.type == "") {
      toast.error("Please select transaction type");
    } else if (transactionForm.type == "DEPOSIT") {
      if (transactionForm.deposit_to == "") {
        toast.error("Please select deposit to");
      } else if (transactionForm.payment == "") {
        toast.error("Please select payment gateway");
      } else if (transactionForm.amount == "") {
        toast.error("Please enter amount");
      } else if (
        transactionForm.mt5_id == "" &&
        transactionForm.deposit_to == "mt5"
      ) {
        toast.error("Please select MT5 Account");
      } else if (transactionForm.note == "") {
        toast.error("Please enter note");
      } else if (
        (!transactionForm.image || transactionForm.image.length == 0) &&
        transactionForm.payment !== "cash"
      ) {
        toast.error("Proof is Required");
      } else {
        const param = new FormData();
        if (transactionForm.deposit_to == "Wallet") {
          param.append("wallet_type", transactionForm.deposit_to);
        } else if (transactionForm.deposit_to == "mt5") {
          param.append("mt5_id", transactionForm.mt5_id);
        }
        transactionForm.isLoader = true;
        setTransactionForm({ ...transactionForm });
        param.append("action", "add_deposit");
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("user_id", id);
        param.append("wallet_type", transactionForm.deposit_to);
        if (
          transactionForm.payment == "gpay" ||
          transactionForm.payment == "paytm" ||
          transactionForm.payment == "phonepe" ||
          transactionForm.payment == "upi"
        ) {
          // param.append("payment_method", transactionForm.upi_name);
          param.append("utr_number", transactionForm.transation_id);
        } else if (
          transactionForm.payment == "USDT.TRC20" ||
          transactionForm.payment == "BTC"
        ) {
          // param.append("payment_method", transactionForm.crypto_name);
          param.append("crypto_address", transactionForm.transation_id);
        } else if (transactionForm.payment == "bank") {
          // param.append("payment_method", transactionForm.payment);
          param.append("utr_number", transactionForm.transation_id);
        }
        param.append("payment_method", transactionForm.payment);

        if (
          transactionForm.image?.length != 0 &&
          transactionForm.payment !== "cash"
        ) {
          transactionForm.image.map((item, index) => {
            param.append(`deposit_proof[${index}]`, item);
          });
        }

        param.append("amount", transactionForm.amount);
        param.append("deposit_remarks", transactionForm.note);
        await axios
          .post(`${Url}/ajaxfiles/update_user_profile.php`, param)
          .then((res) => {
            if (res.data.message == "Session has been expired") {
              toast.error(res.data.message);
              localStorage.setItem("login", true);
              navigate("/");
              return;
            }
            transactionForm.isLoader = false;
            setTransactionForm({ ...transactionForm });
            if (res.data.status == "error") {
              toast.error(res.data.message);
            } else {
              toast.success(res.data.message);
              prop12?.socket?.emit("playSound");
              setOpen(false);
              setRefresh(!refresh);
            }
          });
        /* toast.success('Deposit has been successfully added.');
                setOpen(false); */
      }
    } else if (transactionForm.type == "WITHDRAWAL") {
      if (transactionForm.withdrawForm == "") {
        toast.error("Please select Withdraw Form");
      } else if (
        transactionForm.withdrawForm == "MT5" &&
        transactionForm.mt5_id == ""
      ) {
        toast.error("Please select MT5 Account");
      } else if (transactionForm.payment_method == "") {
        toast.error("Please select Transaction Gateway");
      } else if (
        transactionForm.payment_method == "Bank" &&
        transactionForm.user_bank_id == ""
      ) {
        toast.error("Please select Bank Account");
      } else if (
        transactionForm.payment_method == "UPI" &&
        transactionForm.upi_name == ""
      ) {
        toast.error("Please select Upi type");
      } else if (
        transactionForm.payment_method == "UPI" &&
        transactionForm.upi_crypto_ac_number == ""
      ) {
        toast.error("Please Enter Upi Id");
      } else if (
        transactionForm.payment_method == "Crypto" &&
        transactionForm.crypto_name == ""
      ) {
        toast.error("Please select Crypto type");
      } else if (
        transactionForm.payment_method == "Crypto" &&
        transactionForm.upi_crypto_ac_number == ""
      ) {
        toast.error("Please Enter Crypto Address");
      } else if (transactionForm.amount == "") {
        toast.error("Please enter amount");
      } else if (transactionForm.remark == "") {
        toast.error("Remark is required");
      } else if (transactionForm.admin_note == "") {
        toast.error("Admin Note is required");
      } else {
        transactionForm.isLoader = true;
        setTransactionForm({ ...transactionForm });
        const param = new FormData();
        param.append("action", "add_withdraw");
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }

        param.append("user_id", id);
        param.append("payment_method", transactionForm.payment_method);
        if (transactionForm.crypto_name) {
          param.append("crypto_name", transactionForm.crypto_name);
        }
        if (transactionForm.upi_crypto_ac_number) {
          param.append(
            "upi_crypto_ac_number",
            transactionForm.upi_crypto_ac_number
          );
        }
        if (transactionForm.user_bank_id) {
          param.append("user_bank_id", transactionForm.user_bank_id);
        }
        if (transactionForm.upi_name) {
          param.append("upi_name", transactionForm.upi_name);
        }
        param.append("withdrawal_from", transactionForm.withdrawForm);
        if (transactionForm.withdrawForm == "MT5") {
          param.append("mt5_acc_no", transactionForm.mt5_id);
        }
        param.append("amount", transactionForm.amount);
        // param.append("action", "add_withdraw");
        param.append("withdraw_remarks", transactionForm.remark);
        param.append("admin_notes", transactionForm.admin_note);

        await axios
          .post(`${Url}/ajaxfiles/update_user_profile.php`, param)
          .then((res) => {
            if (res.data.message == "Session has been expired") {
              toast.error(res.data.message);
              localStorage.setItem("login", true);
              navigate("/");
              return;
            }
            // setLoader(false);
            transactionForm.isLoader = false;
            setTransactionForm({ ...transactionForm });
            if (res.data.status == "error") {
              toast.error(res.data.message);
            } else {
              toast.success(res.data.message);
              prop12?.socket?.emit("playSound4");
              setOpen(false);
              setRefresh(!refresh);
            }
          });
      }
    } else if (transactionForm.type == "INTERNAL_TRANSFER") {
      if (transactionForm.account == "") {
        toast.error("Please select from account");
      } else if (transactionForm.account_to == "") {
        toast.error("Please select to account");
      } else if (
        transactionForm.account_to == "MT5" &&
        transactionForm.mt5_account_id == ""
      ) {
        toast.error("Please select mt5 account id");
      } else if (
        transactionForm.account == "MT5" &&
        !transactionForm.from_mt5_account_id
      ) {
        toast.error("Please select from mt5 account id");
      } else if (
        transactionForm.account_to == "Wallet" &&
        transactionForm.wallet_code == ""
      ) {
        toast.error("Please enter wallet code");
      } else if (transactionForm.amount == "") {
        toast.error("Please enter amount");
      } else {
        transactionForm.isLoader = true;
        setTransactionForm({ ...transactionForm });
        const param = new FormData();
        param.append("action", "add_transfer");
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("user_id", userData.data["user_id"]);
        param.append("from_transfer", transactionForm.account);
        param.append("to_transfer", transactionForm.account_to);
        if (transactionForm.account_to == "MT5") {
          param.append("mt5_account_id", transactionForm.mt5_account_id);
        } else {
          param.append("wallet_id", transactionForm.wallet_code);
          param.append("mt5_account_id", "");
        }
        if (transactionForm.account == "MT5") {
          param.append(
            "from_mt5_account_id",
            transactionForm.from_mt5_account_id
          );
        }
        param.append("amount", transactionForm.amount);
        param.append("from_account_type", transactionForm.from_account_type);
        param.append("transfer_to", transactionForm.transfer_to);
        param.append("remarks", transactionForm.note);

        await axios
          .post(`${Url}/ajaxfiles/internal_transfer.php`, param)
          .then((res) => {
            if (res.data.message == "Session has been expired") {
              toast.error(res.data.message);
              localStorage.setItem("login", true);
              navigate("/");
              return;
            }
            // setLoader(false);
            transactionForm.isLoader = false;
            setTransactionForm({ ...transactionForm });
            if (res.data.status == "error") {
              toast.error(res.data.message);
            } else {
              toast.success(res.data.message);
              prop12?.socket?.emit("playSound3");

              setOpen(false);
              setRefresh(!refresh);
            }
          });
        // toast.success('Internal transfer has been successfully added.');
        // setOpen(false);
      }
    } else if (transactionForm.type == "CREDIT") {
      if (transactionForm.credit_type == "") {
        toast.error("Please select credit type");
      } else if (transactionForm.account == "") {
        toast.error("Please select account");
      } else if (transactionForm.amount == "") {
        toast.error("Please enter amount");
      } else if (transactionForm.note == "") {
        toast.error("Please enter note");
      } else {
        transactionForm.isLoader = true;
        setTransactionForm({ ...transactionForm });
        const param = new FormData();
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("user_id", id);
        param.append("action", "add_mt5_bonus");
        param.append("credit_type", transactionForm.credit_type);
        param.append("account", transactionForm.account);
        param.append("amount", transactionForm.amount);
        param.append("note", transactionForm.note);
        axios
          .post(Url + "/ajaxfiles/mt5_credit_debit.php", param)
          .then((res) => {
            if (res.data.message == "Session has been expired") {
              toast.error(res.data.message);
              localStorage.setItem("login", true);
              navigate("/");
              return;
            }
            transactionForm.isLoader = false;
            setTransactionForm({ ...transactionForm });
            if (res.data.status == "error") {
              toast.error(res.data.message);
            } else {
              toast.success(res.data.message);
              setOpen(false);
              setRefresh(!refresh);
            }
          });
      }
    }
  };

  const campaignInput = (event) => {
    const { name, value } = event.target;
    setLinkCampaignForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const linkCampaignSubmit = () => {
    if (linkCampaignForm.account == "") {
      toast.error("Please select account");
    } else if (linkCampaignForm.campaign == "") {
      toast.error("Please select campaign");
    } else {
      toast.success("Campaign has been successfully linked.");
      setOpen(false);
    }
  };

  const input9 = (event) => {
    var { name, value } = event.target;

    setDeleteStructureForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const deleteStructureSubmit = () => {
    if (partnershipMasterStructureData.structure_id == "") {
      toast.error("Please select structure");
    } else {
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
                  variant="contained"
                  className="btn-gradient btn-danger"
                  onClick={async () => {
                    onClose();
                    const param = new FormData();
                    if (IsApprove !== "") {
                      param.append(
                        "AADMIN_AUTH_KEY",
                        IsApprove.AADMIN_AUTH_KEY
                      );
                      param.append("is_app", IsApprove.is_app);
                      param.append(
                        "AADMIN_LOGIN_ID",
                        IsApprove.AADMIN_LOGIN_ID
                      );
                      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
                    }
                    param.append("user_id", id);
                    param.append("action", "delete_master_structure");
                    param.append(
                      "structure_id",
                      partnershipMasterStructureData.structure_id
                    );
                    await axios
                      .post(
                        `${Url}/ajaxfiles/master_structure_manage.php`,
                        param
                      )
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
                          toast.success(res.data.message);
                          getMasterStructureList();
                          setPartnershipMasterStructureData({
                            structure_name: "",
                            structure_data: [],
                            structure_id: "",
                            isLoader: false,
                          });
                        }
                      });
                  }}
                >
                  Yes, Delete it!
                </Button>
              </div>
            </div>
          );
        },
      });
      /* toast.success("Structure has been successfully deleted");
      setDeleteStructureForm({
        structure: "",
      }); */
    }
  };

  const getUserDetails = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    userData.isLoader = true;
    setuserData({ ...userData });
    await axios
      .post(`${Url}/ajaxfiles/fetch_user_details.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        userData.isLoader = false;
        setuserData({ ...userData });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          userData.data = res.data.data;
          setuserData({ ...userData });
          groupForm.group_id = res.data.data.user_group_id;
          setGroupForm({ ...groupForm });
          setEmploymentDetailsForm({
            status: userData.data["employment_status"],
            industry: userData.data["inudstry"],
          });
        }
      });
  };

  const getProfilePageData = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "get_general_information");
    await axios
      .post(`${Url}/ajaxfiles/update_user_profile.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        userData.isLoader = false;
        setuserData({ ...userData });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setProfileForm({
            title: res.data.data.user_title,
            first_name: res.data.data.user_first_name,
            last_name: res.data.data.user_last_name,
            phone: res.data.data.user_phone,
            email: res.data.data.user_email,
            dob: res.data.data.user_dob,
            nationality: res.data.data.user_nationality,
            country_of_residence: res.data.data.user_country,
            city: res.data.data.user_city,
            state: res.data.data.user_state,
            address: res.data.data.user_address_1,
            address_2: res.data.data.user_address_2,
            gender: res.data.data.user_gender,
            source_from: res.data.data.source_from,
            postal_code: res.data.data.user_postcode,
            language: res.data.data.user_language,
            source: res.data.data.user_source,
            us_citizen: res.data.data.us_citizen,
            finacial_work: res.data.data.worked_in_financial,
            tax_number: res.data.data.tax_identification_number,
            politically_exposed: res.data.data.politically_exposed,
            sales_agent: res.data.data.manager_id
              ? {
                  manager_id: res.data.data.manager_id,
                  manager_name: res.data.data.manager_name,
                }
              : "",
            login_block: res.data.data.login_block,
            user_status: res.data.data.user_status,
            wallet_code: res.data.data.wallet_code,
          });
        }
      });
  };

  const getReferralData = async (structure_id) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("structure_id", structure_id);
    param.append("action", "my_referrals");
    await axios
      .post(`${Url}/ajaxfiles/master_structure_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        userData.isLoader = false;
        setuserData({ ...userData });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          referralData.data = res.data.data;
          setReferralData({ ...referralData });
        }
      });
  };

  const getSalesList = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_salesman");

    await axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          // toast.error(res.data.message);
        } else {
          setSalesList(res.data.managers);
        }
      });
  };

  const getMoveIBList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);

    param.append("action", "list_ib_users_move_ib");
    moveToIb.isLoader = true;
    setMoveToIb({ ...moveToIb });
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          moveToIb.isLoader = false;
          moveToIb.list = [];

          setMoveToIb({ ...moveToIb });
        } else {
          moveToIb.isLoader = false;
          moveToIb.list = res.data.data;
          setMoveToIb({ ...moveToIb });
        }
      });
  };
  const getLinkClientList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);

    param.append("action", "list_clients");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          linkClientForm.list = res.data.data;
          setLinkClientForm({ ...linkClientForm });
          setAccountOption([...res.data.data]);
        }
      });
  };

  const getIBUserList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_ib_users");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          linkIBForm.list = res.data.data;
          setLinkIBForm({ ...linkIBForm });
          setIBAccountOption([...res.data.data]);
        }
      });
  };

  const unlinkIB = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "unlink_ib");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          toast.success(res.data.message);
        }
      });
  };
  const unlinkClient = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "unlink_client");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          getUserDetails();
          toast.success(res.data.message);
        }
      });
  };

  const viewCPPassword = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "view_cp_password");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          viewCpPassword.cp_password = res.data.view_password;
          setViewCpPassword({ ...viewCpPassword });
        }
      });
  };

  const getCpAccessSetting = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "view_cp_access");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          cpAccessForm.status = res.data.user_status;
          setCpAccessForm({ ...cpAccessForm });
        }
      });
  };

  const getUserBlockunblockSetting = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "view_block_status");

    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
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
          userBlockUnblockStatus.status = res.data.login_block;
          setUserBlockUnblockStatus({ ...userBlockUnblockStatus });
        }
      });
  };

  const getMyTraders = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);

    axios.post(Url + "/ajaxfiles/my_traders.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        myTraderData.data = res.data;
        setMyTraderData({ ...myTraderData });
      }
    });
  };

  const getMyChildTrader = (childId) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("client_id", childId);

    axios
      .post(Url + "/ajaxfiles/sponser_mt_data_ajax.php", param)
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
          myChildTraderData.data = res.data;
          myChildTraderData.parent_id = res.data.back_links;
          setMyChildTraderData({ ...myChildTraderData });
          if (res.data.back_links == "") {
            setDialogTitle(myTraderData.main_user_name);
          } else {
            setDialogTitle(myTraderData.user_name);
          }
          setMaxWidth("lg");
          setOpen(true);
        }
      });
  };

  const getMyAssignedStructure = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "get_my_assigned_structure");
    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((resData) => {
        if (resData.data.message == "Session has been expired") {
          toast.error(resData.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (resData.data.status == "error") {
          toast.error(resData.data.message);
        } else {
          myStructureData.structure_data = resData.data.data;
          myStructureData.structure_name = resData.data.structure_name;
          myStructureData.structure_id = resData.data.structure_id;

          setMyStructureData({ ...myStructureData });
        }
      });
  };

  const sendMT5PasswordMail = async (data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "mail_mt5_password");
    param.append("user_id", data.user_id);
    param.append("mt5_acc_no", data.mt5_account_id);
    param.append("main_pwd", data.main_pwd);
    param.append("investor_pwd", data.investor_pwd);
    await axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((resData) => {
        if (resData.data.message == "Session has been expired") {
          toast.error(resData.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (resData.data.status == "error") {
          toast.error(resData.data.message);
        } else {
          toast.success(resData.data.message);
        }
        return true;
      });
  };

  const getUserGroupList = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_user_groups");
    await axios
      .post(Url + "/ajaxfiles/user_group_manage.php", param)
      .then((resData) => {
        if (resData.data.message == "Session has been expired") {
          toast.error(resData.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (resData.data.status == "error") {
          toast.error(resData.data.message);
        } else {
          groupForm.list = resData.data.group_data;
          setGroupForm({ ...groupForm });
        }
        return true;
      });
  };

  const userGroupSubmit = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "change_user_group");
    param.append("user_id", id);
    param.append("user_group_id", groupForm.group_id);
    await axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((resData) => {
        if (resData.data.message == "Session has been expired") {
          toast.error(resData.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (resData.data.status == "error") {
          toast.error(resData.data.message);
        } else {
          toast.success(resData.data.message);
          setOpen(false);
          getUserDetails();
        }
        return true;
      });
  };

  const getPammDashboard = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    await axios
      .post(Url + "/ajaxfiles/pamm/pamm_dashboard.php", param)
      .then((resData) => {
        if (resData.data.message == "Session has been expired") {
          toast.error(resData.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (resData.data.status == "error") {
          toast.error(resData.data.message);
        } else {
          setPammDashboardData({ ...resData.data });
        }
      });
  };

  const getMyPortfolio = () => {
    setPortfolioLoader(true);
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "my_portfolios");
    param.append("user_id", id);
    axios
      .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setPortfolioLoader(false);
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setMyPortfolio([...res.data.data]);
        }
      });
  };

  const getMoneyManager = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "money_manager_accounts");
    param.append("user_id", id);
    axios
      .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
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
          setMoneyManagerList([...res.data.data]);
        }
      });
  };

  const getMoneyManagerList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "available_money_manager");
    param.append("user_id", id);

    axios
      .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
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
          setMoneyManagerListMenu([...res.data.data]);
        }
      });
  };

  const createPortfolioFormSubmit = () => {
    if (createPortfolioForm.portfolio_name == "") {
      toast.error("Please enter portfolio name");
    } else if (createPortfolioForm.mm_mt5_acc_id == "") {
      toast.error("Please select money manager");
    } else if (createPortfolioForm.investment_months == "") {
      toast.error("Please enter investment month");
    } else {
      createPortfolioForm.isLoader = true;
      setCreatePortfolioForm({ ...createPortfolioForm });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("portfolio_name", createPortfolioForm.portfolio_name);
      param.append("mm_mt5_acc_id", createPortfolioForm.mm_mt5_acc_id);
      param.append("investment_months", createPortfolioForm.investment_months);
      param.append("action", "create_portfolio");
      axios
        .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          createPortfolioForm.isLoader = false;
          setCreatePortfolioForm({ ...createPortfolioForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            if (pammPortfolioGroupButton == "money_manager") {
              getMoneyManager();
            } else {
              getMyPortfolio();
            }
            toast.success(res.data.message);
            setRefresh(!refresh);
            setOpen(false);
          }
        });
    }
  };

  const investmentFormSubmit = () => {
    if (investmentForm.pid == "") {
      toast.error("Please enter pid");
    } else if (investmentForm.amount == "") {
      toast.error("Please enter amount");
    } else {
      investmentForm.isLoader = true;
      setInvestmentForm({ ...investmentForm });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("pid", investmentForm.pid);
      param.append("amount", investmentForm.amount);
      param.append("action", "add_investment");
      axios
        .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          investmentForm.isLoader = false;
          setInvestmentForm({ ...investmentForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setOpen(false);
            setInvestmentForm({
              user_id: "",
              isLoader: false,
              pid: "",
              amount: "",
            });
          }
        });
    }
  };

  const withdrawFormSubmit = () => {
    if (withdrawForm.amount == "" && !withdrawForm.allWithdraw) {
      toast.error("Please enter amount");
    } else {
      withdrawForm.isLoader = true;
      setWithdrawForm({ ...withdrawForm });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("user_id", id);
      param.append("pid", withdrawForm.pid);
      param.append(
        "amount",
        withdrawForm.allWithdraw ? 0 : withdrawForm.amount
      );
      param.append("withdraw_all", withdrawForm.allWithdraw ? 1 : 0);
      param.append("action", "withdraw_request");
      axios
        .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          withdrawForm.isLoader = false;
          setWithdrawForm({ ...withdrawForm });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            if (refreshCreatePortfolio1) {
              getMoneyManager();
            } else {
              getMyPortfolio();
            }
            toast.success(res.data.message);
            setOpen(false);

            setWithdrawForm({
              user_id: "",
              isLoader: false,
              pid: "",
              amount: "",
            });
          }
        });
    }
  };

  const getLeverages = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", id);
    param.append("action", "get_leverages");
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setLeverageForm(res.data.leverages);
      });
  };
  useEffect(() => {
    getpermissions();
    // getProfilePageData();

    getUserDetails();
    // if (permission.get_general_information == 1) {
    //   getProfilePageData();
    // }
    // getMt5LivePackages();
    // getAccountList();
    getSalesList();
  }, [id]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  const InvestorPassword = () => {
    setinvestor((prev) => !prev);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          {userData.isLoader == true ? (
            <div className="loader">
              <div className="clock">
                <div className="pointers"></div>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 1 }}>
              <Grid container>
                <Grid item md={12} lg={12} xl={12}>
                  {userData.data["user_status"] == "0" ? (
                    <div className="user-status-section">
                      <span className={`text-color-red`}>
                        {userData.data["user_status_msg"]}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="client-detail-header">
                    <div className="client-name">
                      <label>
                        {userData.data["user_first_name"]}{" "}
                        {userData.data["user_last_name"]}
                      </label>
                      <p className="margin-bottom-remove">
                        {userData.data["wallet_code"]}
                      </p>
                    </div>
                    <div className="header-highlight">
                      <label>Created On</label>
                      <p>{userData.data["added_datetime"]}</p>
                    </div>
                    <div className="header-highlight">
                      <label>Total Accounts</label>
                      <p>{userData.data["total_mt5_accounts"]}</p>
                    </div>
                    {userData.data["user_level"] == "USD" ? (
                      <div className="header-highlight">
                        <label>Account Currency</label>
                        <p>USD</p>
                      </div>
                    ) : userData.data["user_level"] == "Master" ? (
                      <div className="header-highlight">
                        <label>Partnership</label>
                        <p>Level: {userData.data["user_level"]}</p>
                      </div>
                    ) : (
                      <div className="header-highlight">
                        <label>Partnership</label>
                        <p>
                          Level: {userData.data["user_level"]} | Parent:{" "}
                          <NavLink
                            className="linkColor"
                            title={userData.data["sponsor_name"]}
                            to={`/profile/${userData.data["sponsor_id"]}`}
                          >
                            {userData.data["sponsor_name"]}
                          </NavLink>
                        </p>
                      </div>
                    )}

                    <div className="header-highlight">
                      <label>Balance</label>
                      <p>$ {userData.data["wallet_balance"]}</p>
                    </div>
                    <div className="header-highlight">
                      <label>Wallet</label>
                      <p>$ {userData.data["crm_wallet_balance"]}</p>
                    </div>
                    <div className="header-highlight">
                      <label>Sales Agent</label>
                      <p>
                        {userData.data["manager_name"] == ""
                          ? "Not Assigned"
                          : userData.data["manager_name"]}
                      </p>
                    </div>
                  </div>
                  <br />
                  {/* <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}> */}
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    className="tabsBar"
                  >
                    {permission.get_general_information == 1 ? (
                      <Tab label="PROFILE PAGE" value={0} />
                    ) : (
                      ""
                    )}
                    {permission.get_bank_list == 1 ? (
                      <Tab label="BANK DETAILS" value={1} />
                    ) : (
                      ""
                    )}
                    {permission.get_kyc_status == 1 ? (
                      <Tab label="DOCUMENTS" value={2} />
                    ) : (
                      ""
                    )}
                    <Tab label="Additional Documents" value={14} />

                    {permission.mt5_account_list == 1 ? (
                      <Tab label="ACCOUNTS" value={3} />
                    ) : (
                      ""
                    )}
                    {permission.view_login_activities == 1 ? (
                      <Tab label="ACTIVITIES" value={4} />
                    ) : (
                      ""
                    )}
                    {permission.log_list == 1 ? (
                      <Tab label="LOGS" value={5} />
                    ) : (
                      ""
                    )}
                    {permission.wallet_history == 1 ? (
                      <Tab label="TRANSACTIONS" value={6} />
                    ) : (
                      ""
                    )}

                    {/* {userData.data.is_ib_account == "0" ? (
                      ""
                    ) : (
                      <Tab label="REFERRALS" value={7} />
                    )} */}
                    {permission.list_my_structures == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <Tab label="REFERRALS" value={7} />
                      )
                    ) : (
                      ""
                    )}
                    {permission.list_my_structures == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <Tab label="PARTNERSHIP" value={8} />
                      )
                    ) : (
                      ""
                    )}
                    {permission.list_my_structures == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <Tab label="statement " value={13} />
                      )
                    ) : (
                      ""
                    )}
                    {permission.get_my_assigned_structure == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <Tab label="MY STRUCTURE" value={9} />
                      )
                    ) : (
                      ""
                    )}

                    {permission.notes_list == 1 ? (
                      <Tab label="NOTES" value={10} />
                    ) : (
                      ""
                    )}

                    {permission.my_traders == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <Tab label="DOWNLINE" value={11} />
                      )
                    ) : (
                      ""
                    )}

                    {permission.view_pamm_dashboard == 1 ||
                    permission.money_manager_accounts == 1 ||
                    permission.my_money_managers == 1 ||
                    permission.my_portfolios == 1 ||
                    permission.pamm_trade_history == 1 ||
                    permission.pamm_withdraw_request == 1 ? (
                      userData.data.is_pamm == "1" ? (
                        <Tab label="PAMM" value={12} />
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </Tabs>

                  <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                  >
                    {permission.get_general_information == 1 ? (
                      <TabPanel value={0} index={0} dir={theme.direction}>
                        <Grid container spacing={3} className="grid-handle">
                          <Grid item md={9} lg={9} xl={9}>
                            <Paper
                              elevation={2}
                              style={{ borderRadius: "10px" }}
                              className="paper-main-section"
                            >
                              <p className="header-title">
                                General Information
                              </p>
                              {permission.get_general_informationShow == 1 ? (
                                <div className="contentSection formSection">
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>Title</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.title}
                                        onChange={profileInput}
                                        name="title"
                                      >
                                        <MenuItem value="Mr.">Mr.</MenuItem>
                                        <MenuItem value="Mrs">Mrs</MenuItem>
                                        <MenuItem value="Miss">Miss</MenuItem>
                                        <MenuItem value="Ms">Ms</MenuItem>
                                        <MenuItem value="Dr">Dr</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="First Name"
                                      variant="standard"
                                      //   value={userData.data["user_first_name"]}
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      value={profileForm.first_name}
                                      focused
                                      name="first_name"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Last Name"
                                      variant="standard"
                                      value={profileForm.last_name}
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      //   value={userData.data["user_last_name"]}
                                      focused
                                      name="last_name"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Phone"
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      value={profileForm.phone}
                                      variant="standard"
                                      focused
                                      name="phone"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Email"
                                      variant="standard"
                                      value={profileForm.email}
                                      // disabled={permission.update_basic_information==1 ?false :true}
                                      //   value={userData.data["user_email"]}
                                      focused
                                      name="email"
                                      // disabled
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      type="date"
                                      className="input-font-small"
                                      label="Date of Birth"
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      focused
                                      value={profileForm.dob}
                                      name="dob"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>Nationality</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        value={profileForm.nationality}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        // value={age}
                                        onChange={profileInput}
                                        name="nationality"
                                      >
                                        {countryData.data.map((item) => {
                                          return (
                                            <MenuItem value={item.nicename}>
                                              {item.nicename}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>
                                        Country of Residence
                                      </InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.country_of_residence}
                                        onChange={profileInput}
                                        name="country_of_residence"
                                      >
                                        {countryData.data.map((item) => {
                                          return (
                                            <MenuItem value={item.nicename}>
                                              {item.nicename}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="City"
                                      variant="standard"
                                      focused
                                      value={profileForm.city}
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      name="city"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="State"
                                      variant="standard"
                                      focused
                                      value={profileForm.state}
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      name="state"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Address"
                                      variant="standard"
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      focused
                                      value={profileForm.address}
                                      name="address"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Address Line 2"
                                      variant="standard"
                                      focused
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      value={profileForm.address_2}
                                      name="address_2"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>Gender</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        value={profileForm.gender}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        onChange={profileInput}
                                        name="gender"
                                      >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">
                                          Female
                                        </MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Postal Code"
                                      variant="standard"
                                      value={profileForm.postal_code}
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      focused
                                      name="postal_code"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>Language</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        value={profileForm.language}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        onChange={profileInput}
                                        name="language"
                                      >
                                        <MenuItem value="en-gb">
                                          English
                                        </MenuItem>
                                        <MenuItem value="ar-ae">عربي</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Source"
                                      variant="standard"
                                      focused
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      value={profileForm.source}
                                      name="source"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Source From"
                                      variant="standard"
                                      // focused
                                      title={profileForm.source_from}
                                      disabled={true}
                                      value={profileForm.source_from}
                                      name="source_from"
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>US citizen ?</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        // value={age}
                                        value={profileForm.us_citizen}
                                        onChange={profileInput}
                                        name="us_citizen"
                                      >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>
                                        Worked in Financial?
                                      </InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.finacial_work}
                                        onChange={profileInput}
                                        name="finacial_work"
                                      >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <TextField
                                      className="input-font-small"
                                      label="Tax Identification Number"
                                      variant="standard"
                                      focused
                                      disabled={
                                        permission.update_basic_information == 1
                                          ? false
                                          : true
                                      }
                                      name="tax_number"
                                      value={profileForm.tax_number}
                                      onChange={profileInput}
                                    />
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>
                                        Politically exposed ?
                                      </InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.politically_exposed}
                                        onChange={profileInput}
                                        name="politically_exposed"
                                      >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    {/* <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>Sales Agent</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.sales_agent}
                                        onChange={profileInput}
                                        name="sales_agent"
                                      >
                                        {salesList.map((item) => {
                                          return (
                                            <MenuItem value={item.manager_id}>
                                              {item.manager_name}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl> */}
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <Autocomplete
                                        disablePortal
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        options={salesList}
                                        getOptionLabel={(option) =>
                                          option ? option.manager_name : ""
                                        }
                                        value={profileForm.sales_agent}
                                        onChange={(event, newValue) => {
                                          profileForm.sales_agent = newValue;
                                          setProfileForm({ ...profileForm });
                                        }}
                                        sx={{ width: "100%" }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Assigned Sales Manager"
                                            variant="standard"
                                          />
                                        )}
                                      />
                                    </FormControl>
                                  </div>
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>Login Block</InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.login_block}
                                        onChange={profileInput}
                                        name="login_block"
                                      >
                                        <MenuItem value="0">No</MenuItem>
                                        <MenuItem value="1">Yes</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>{" "}
                                  <div className="element">
                                    <FormControl
                                      variant="standard"
                                      sx={{ width: "100%" }}
                                      focused
                                    >
                                      <InputLabel>User Status </InputLabel>
                                      <Select
                                        label
                                        className="select-font-small"
                                        // value={age}
                                        disabled={
                                          permission.update_basic_information ==
                                          1
                                            ? false
                                            : true
                                        }
                                        value={profileForm.user_status}
                                        onChange={profileInput}
                                        name="user_status"
                                      >
                                        <MenuItem value="0">No</MenuItem>
                                        <MenuItem value="1">Yes</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "4em",
                                  }}
                                >
                                  You don't have access to view user profile
                                  data
                                </div>
                              )}

                              {permission.update_basic_information == 1 ? (
                                <div className="btnActionSection">
                                  <Button
                                    variant="contained"
                                    className="btn-success"
                                    onClick={profileSubmit}
                                  >
                                    Update Profile
                                  </Button>
                                </div>
                              ) : (
                                ""
                              )}
                            </Paper>
                          </Grid>
                          <Grid item md={3} lg={3} xl={3}>
                            <Paper
                              elevation={2}
                              style={{ borderRadius: "10px" }}
                            >
                              <p className="header-title">Quick Actions</p>
                              <div className="contentSection">
                                {permission.create_mt5_account == 1 ||
                                permission.mt5_access == 1 ||
                                permission.mt5_link ||
                                permission.mt5_reset ||
                                permission.change_mt5_leverage ||
                                permission.change_mt5_password ? (
                                  <p className="group-header">
                                    Trading Account
                                  </p>
                                ) : (
                                  ""
                                )}
                                {/* <p className="group-header">Trading Account</p> */}
                                <div className="mt5btngroup">
                                  {permission.create_mt5_account == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="createMt5 btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Create MT5
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                  {permission.mt5_access == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="mt5_access btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      MT5 Access
                                    </Button>
                                  ) : (
                                    ""
                                  )}

                                  {permission.mt5_link == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="link_mt5 btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Link MT5
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                  {permission.mt5_reset == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="reset_mt5 btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Reset MT5
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                  {permission.change_mt5_leverage == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="change_leverage btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Change Leverage
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                  {permission.change_mt5_password == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="change_mt5_password btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Change MT5 Password
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {permission.insert_strcuture_master == 1 ||
                                permission.insert_strcuture_maste == 1 ||
                                permission.link_client == 1 ||
                                permission.link_ib == 1 ||
                                permission.unlink_ib == 1 ? (
                                  <>
                                    {" "}
                                    <br /> <p className="group-header">IB</p>
                                  </>
                                ) : (
                                  ""
                                )}

                                <div className="mt5btngroup">
                                  {userData.data.is_ib_account == "1" ? (
                                    <>
                                      {permission.insert_strcuture_master ==
                                      1 ? (
                                        <Button
                                          variant="contained"
                                          className="add_master_structure btn-hover-css"
                                          onClick={openDialogbox}
                                        >
                                          Add Master Structure
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {permission.update_strcuture_master ==
                                      1 ? (
                                        <Button
                                          variant="contained"
                                          className="edit_master_structure btn-hover-css"
                                          onClick={openDialogbox}
                                        >
                                          Edit Master Structure
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {permission.link_client == 1 ? (
                                        <Button
                                          variant="contained"
                                          className="link_client btn-hover-css"
                                          onClick={openDialogbox}
                                        >
                                          Link Client
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {permission.link_client == 1 ? (
                                        <Button
                                          variant="contained"
                                          className="moveToIB btn-hover-css"
                                          onClick={openDialogbox}
                                        >
                                          Move IB to IB
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {permission.unlink_ib == 1 ? (
                                        <Button
                                          variant="contained"
                                          className="unlink_ib btn-hover-css"
                                          onClick={openDialogbox}
                                        >
                                          Convert to client
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {userData.data.is_ib_account == "0" ? (
                                    <>
                                      {permission.unlink_client == 1 ? (
                                        <>
                                          {" "}
                                          {userData.data.is_ib_account == 0 &&
                                          userData.data.sponsor_id != 0 ? (
                                            <Button
                                              variant="contained"
                                              className="unlink_client btn-hover-css"
                                              onClick={openDialogbox}
                                            >
                                              Unlink Client
                                            </Button>
                                          ) : (
                                            ""
                                          )}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      {permission.link_ib == 1 &&
                                      userData.data.sponsor_id == 0 ? (
                                        <Button
                                          variant="contained"
                                          className="link_ib btn-hover-css"
                                          onClick={openDialogbox}
                                        >
                                          Link To IB
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                {/* {
                                userData.data.is_ib_account == "0" ? "" :
                                  <>
                                    <div className="mt5btngroup">
                                    </div>
                                  </>
                              } */}

                                {permission.send_mail == 1 ||
                                permission.update_cp_access == 1 ||
                                permission.view_cp_password == 1 ||
                                permission.change_password == 1 ||
                                permission.block_unblock_user == 1 ? (
                                  <>
                                    <br />{" "}
                                    <p className="group-header">
                                      Communication
                                    </p>
                                  </>
                                ) : (
                                  ""
                                )}

                                <div className="mt5btngroup">
                                  {permission.send_mail == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="send_email btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Send Email
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {permission.update_cp_access == 1 ||
                                permission.view_cp_password == 1 ||
                                permission.change_password == 1 ||
                                permission.block_unblock_user == 1 ? (
                                  <>
                                    <br />
                                    <p className="group-header">
                                      Client Portal
                                    </p>
                                  </>
                                ) : (
                                  ""
                                )}

                                <div className="mt5btngroup">
                                  {permission.update_cp_access == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="cp_access btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      CP Access
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                  {permission.view_cp_password == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="view_cp_password btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      View CP Password
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                  {permission.change_password == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="change_password btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Change Password
                                    </Button>
                                  ) : (
                                    ""
                                  )}

                                  {permission.block_unblock_user == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="block_unblock btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Block/ Unblock
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {permission.update_is_pamm == 1 ? (
                                  <>
                                    <br /> <p className="group-header">Pamm</p>
                                  </>
                                ) : (
                                  ""
                                )}

                                <div className="mt5btngroup">
                                  {permission.update_is_pamm == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="pamm_access btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Pamm Access
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {permission.add_new_notes == 1 ||
                                permission.add_user_bank == 1 ||
                                permission.transaction_access == 1 ? (
                                  <>
                                    <br />
                                    <p className="group-header">Misc.</p>
                                  </>
                                ) : (
                                  ""
                                )}

                                <div className="mt5btngroup">
                                  {/* <Button
                                  variant="contained"
                                  className="download_application btn-hover-css"
                                  onClick={openDialogbox}
                                >
                                  Download Application
                                </Button> */}
                                  {permission.add_new_notes == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="add_note btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Add Note
                                    </Button>
                                  ) : (
                                    ""
                                  )}

                                  {permission.add_user_bank == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="add_bank btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Add Bank
                                    </Button>
                                  ) : (
                                    ""
                                  )}

                                  {permission.transaction_access == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="add_transaction btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Add Transaction
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {permission.change_user_group == 1 ? (
                                  <>
                                    <br />{" "}
                                    <p className="group-header">Groups</p>
                                  </>
                                ) : (
                                  ""
                                )}

                                <div className="mt5btngroup">
                                  {permission.change_user_group == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="user-group btn-hover-css"
                                      onClick={openDialogbox}
                                    >
                                      Group
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </Paper>
                          </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3} className="grid-handle">
                          {/* <Grid item md={6} lg={6} xl={6}>
                          <Paper
                            elevation={2}
                            style={{ borderRadius: "10px" }}
                            className="paper-main-section"
                          >
                            <p className="header-title">
                              Financial Information
                            </p>
                            <div className="contentSection">
                              <Grid
                                container
                                spacing={3}
                                className="grid-handle"
                              >
                                <Grid item md={6} lg={6} xl={6}>
                                  <p className="subtitle">Annual Income</p>
                                </Grid>
                                <Grid item md={6} lg={6} xl={6}>
                                  <p className="subtitle">Source of Funds</p>
                                </Grid>
                              </Grid>
                            </div>
                          </Paper>
                        </Grid> */}
                          {userData.data.is_ib_account == "0" ? (
                            ""
                          ) : (
                            <Grid item md={12} lg={12} xl={12}>
                              <Paper
                                elevation={2}
                                style={{ borderRadius: "10px" }}
                                className="paper-main-section"
                              >
                                <p className="header-title">
                                  IB Dedicated Links
                                </p>
                                <div className="contentSection IB-Dedicated-Links">
                                  <div className="master-structure-section">
                                    <div className="user-links">
                                      <div className="user-link-header">
                                        <label>Link Type</label>
                                        <label>Link</label>
                                      </div>
                                      <div className="user-link-body">
                                        <label>Register</label>
                                        <div className="link-section">
                                          <a
                                            href={`${ClientUrl}/register/sponsor/${profileForm.wallet_code}`}
                                            target="_blank"
                                          >
                                            {ClientUrl +
                                              `/register/sponsor/${profileForm.wallet_code}`}
                                          </a>
                                          <button
                                            className="copy_link"
                                            onClick={(e) => {
                                              navigator.clipboard
                                                .writeText(
                                                  ClientUrl +
                                                    `/register/sponsor/${profileForm.wallet_code}`
                                                )
                                                .then(
                                                  function () {
                                                    toast.success(
                                                      "The sponsor link has been successfully copying"
                                                    );
                                                  },
                                                  function (err) {
                                                    toast.error(
                                                      "The sponsor link Could not copy, Please try again"
                                                    );
                                                  }
                                                );
                                            }}
                                          >
                                            <span className="blinking">
                                              <i className="material-icons">
                                                content_copy
                                              </i>
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Paper>
                            </Grid>
                          )}

                          <Grid item md={6} lg={6} xl={6}>
                            <Paper
                              elevation={2}
                              style={{ borderRadius: "10px" }}
                              className="paper-main-section"
                            >
                              <p className="header-title">Employment Details</p>
                              <div className="contentSection">
                                <Grid
                                  container
                                  spacing={3}
                                  className="grid-handle"
                                >
                                  <Grid item md={6} lg={6} xl={6}>
                                    <div
                                      className="element"
                                      style={{ width: "100%" }}
                                    >
                                      <FormControl
                                        variant="standard"
                                        sx={{ width: "100%" }}
                                        focused
                                      >
                                        <InputLabel>
                                          Employment Status
                                        </InputLabel>
                                        <Select
                                          label
                                          className="select-font-small"
                                          value={employmentDetailsForm.status}
                                          onChange={employementInput}
                                          name="status"
                                        >
                                          <MenuItem value="Employed (full time)">
                                            Employed (full time)
                                          </MenuItem>
                                          <MenuItem value="Self Employed">
                                            Self Employed
                                          </MenuItem>
                                          <MenuItem value="Employed (part time )">
                                            Employed (part time )
                                          </MenuItem>
                                          <MenuItem value="unemployed">
                                            unemployed
                                          </MenuItem>
                                          <MenuItem value="Student">
                                            Student
                                          </MenuItem>
                                          <MenuItem value="Retired">
                                            Retired
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                  </Grid>
                                  <Grid item md={6} lg={6} xl={6}>
                                    <div
                                      className="element"
                                      style={{ width: "100%" }}
                                    >
                                      <FormControl
                                        variant="standard"
                                        sx={{ width: "100%" }}
                                        focused
                                      >
                                        <InputLabel>Inudstry</InputLabel>
                                        <Select
                                          label
                                          className="select-font-small"
                                          value={employmentDetailsForm.industry}
                                          onChange={employementInput}
                                          name="industry"
                                        >
                                          <MenuItem value="Aviation">
                                            Aviation
                                          </MenuItem>
                                          <MenuItem value="Agricultural">
                                            Agricultural
                                          </MenuItem>
                                          <MenuItem value="Financial industry">
                                            Financial industry
                                          </MenuItem>
                                          <MenuItem value="Marketing">
                                            Marketing
                                          </MenuItem>
                                          <MenuItem value="Retail industry">
                                            Retail industry
                                          </MenuItem>
                                          <MenuItem value="HR">HR</MenuItem>
                                          <MenuItem value="Management">
                                            Management
                                          </MenuItem>
                                          <MenuItem value="Healthcare">
                                            Healthcare
                                          </MenuItem>
                                          <MenuItem value="Administration">
                                            Administration
                                          </MenuItem>
                                          <MenuItem value="Academic">
                                            Academic
                                          </MenuItem>
                                          <MenuItem value="Engineering">
                                            Engineering
                                          </MenuItem>
                                          <MenuItem value="Civil Engineering">
                                            Civil Engineering
                                          </MenuItem>
                                          <MenuItem value="Architecture">
                                            Architecture
                                          </MenuItem>
                                          <MenuItem value="Media">
                                            Media
                                          </MenuItem>
                                          <MenuItem value="Chemical engineering">
                                            Chemical engineering
                                          </MenuItem>
                                          <MenuItem value="Power engineering">
                                            Power engineering
                                          </MenuItem>
                                          <MenuItem value="Other">
                                            Other
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                    {permission.update_employement_status ==
                                    1 ? (
                                      <div className="btnActionSection employment-details">
                                        <Button
                                          variant="contained"
                                          className="btn-success"
                                          onClick={employmentDetailsSubmit}
                                        >
                                          Update Information
                                        </Button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </Grid>
                                </Grid>
                              </div>
                            </Paper>
                          </Grid>
                          <Grid item md={6} lg={6} xl={6}>
                            <Paper
                              elevation={2}
                              style={{ borderRadius: "10px" }}
                              className="paper-main-section"
                            >
                              <p className="header-title">Declarations</p>
                              <div className="contentSection">
                                <FormControlLabel
                                  className="declarationCheckbox"
                                  control={
                                    <Checkbox
                                      defaultChecked
                                      name="declaration"
                                    />
                                  }
                                  label={`By clicking here I give my consent for ${mission} to contact me for marketing purposes. You can opt out at any time. For further details please see ourMarketing and Communication Policy Statement.`}
                                />
                                {/* <div className='element'>
                                                        </div> */}
                              </div>
                            </Paper>
                          </Grid>
                        </Grid>
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    {permission.get_bank_list == 1 ? (
                      <TabPanel value={1} index={1} dir={theme.direction}>
                        <Grid container spacing={3} className="grid-handle">
                          <Grid item md={12} lg={12} xl={12}>
                            <Paper
                              elevation={2}
                              style={{ borderRadius: "10px" }}
                              className="paper-main-section"
                            >
                              <div className="headerSection header-title">
                                <p className="margin-0">Bank Accounts</p>
                                {permission.add_user_bank == 1 ? (
                                  <Button
                                    variant="contained"
                                    className="add_bank"
                                    onClick={openDialogbox}
                                  >
                                    Add New Bank Account
                                  </Button>
                                ) : (
                                  ""
                                )}
                              </div>
                              {/* <br/> */}
                              {value == 1 ? (
                                <div className="bankDetailsTabSection">
                                  <CommonTable
                                    url={`${Url}/datatable/get_bank_list.php`}
                                    column={bankColumn}
                                    sort="0"
                                    refresh={bankAccountForm.refresh}
                                    userId={id}
                                    filter={filterData}
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </Paper>
                          </Grid>
                        </Grid>
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    {permission.get_kyc_status == 1 ? (
                      <TabPanel value={2} index={2} dir={theme.direction}>
                        <Grid
                          container
                          spacing={3}
                          className="grid-handle panding-left-right-3px"
                        >
                          <Grid item md={12} lg={12} xl={12}>
                            {value == 2 ? (
                              <KycDocument
                                id={id}
                                socket={prop12?.socket}
                                permission={permission.update_kyc}
                              />
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    {permission.mt5_account_list == 1 ? (
                      <TabPanel value={3} index={3} dir={theme.direction}>
                        <Grid container spacing={3} className="grid-handle">
                          {value == 3 ? (
                            <Grid item md={12} lg={12} xl={12}>
                              <Paper
                                elevation={2}
                                style={{
                                  borderRadius: "10px",
                                  height: "auto",
                                  marginBottom: "10px",
                                }}
                                className="paper-main-section"
                              >
                                <div className="headerSection header-title">
                                  <p className="margin-0">Accounts</p>
                                  <div className="groun-button Accounts-groun-button">
                                    {/* <Button
                                  variant="contained"
                                  className="link_campaign"
                                  onClick={openDialogbox}
                                >
                                  Link to Campaign
                                </Button> */}
                                    {permission.change_mt5_leverage == 1 ? (
                                      <Button
                                        variant="contained"
                                        className="change_leverage btn-hover-css"
                                        onClick={openDialogbox}
                                      >
                                        Change Leverage
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                    {permission.change_mt5_leverage == 1 ? (
                                      <Button
                                        variant="contained"
                                        className="change_mt5_group btn-hover-css"
                                        onClick={openDialogbox}
                                      >
                                        Change MT5 Group
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                    {permission.mt5_link == 1 ? (
                                      <Button
                                        variant="contained"
                                        className="link_mt5"
                                        onClick={openDialogbox}
                                      >
                                        Link Account
                                      </Button>
                                    ) : (
                                      ""
                                    )}

                                    {permission.create_mt5_account == 1 ? (
                                      <Button
                                        variant="contained"
                                        className="createMt5"
                                        onClick={openDialogbox}
                                      >
                                        Create Account
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                {/* <br/> */}
                                <div className="bankDetailsTabSection">
                                  <CommonTable
                                    url={`${Url}/datatable/mt5_account_list.php`}
                                    column={mt5AccountListColumn}
                                    userId={id}
                                    sort="0"
                                    filter={filterData}
                                    refresh={refresh}
                                  />
                                </div>
                              </Paper>
                              {positionParam.hide == false &&
                              positionParam.mt5_acc_no ? (
                                <div>
                                  <Grid
                                    container
                                    spacing={3}
                                    className="grid-handle"
                                  >
                                    <Grid item md={12} lg={12} xl={12}>
                                      <Paper
                                        elevation={2}
                                        style={{
                                          borderRadius: "10px",
                                          height: "auto",
                                          marginBottom: "10px",
                                        }}
                                        className="paper-main-section"
                                      >
                                        <div className="headerSection header-title">
                                          <p className="margin-0">
                                            Positions -{" "}
                                            {positionParam.mt5_acc_no}{" "}
                                            <ColorButton
                                              style={{
                                                height: "26px",
                                                width: "10px",
                                                marginLeft: "10px",
                                              }}
                                              onClick={() => {
                                                setRefreshOpenClose(
                                                  !refreshOpenClose
                                                );
                                              }}
                                            >
                                              <CachedIcon />
                                            </ColorButton>
                                          </p>
                                        </div>
                                        <div className="option-textFild">
                                          <Button
                                            className="main-color"
                                            onClick={() => {
                                              positionParam.open = true;
                                              setPositionParam({
                                                ...positionParam,
                                              });
                                            }}
                                            disabled={positionParam.open}
                                          >
                                            Open Positions
                                          </Button>
                                          <Button
                                            className="main-color"
                                            disabled={!positionParam.open}
                                            onClick={() => {
                                              positionParam.open = false;
                                              setPositionParam({
                                                ...positionParam,
                                              });
                                            }}
                                          >
                                            Close Positions
                                          </Button>
                                        </div>
                                        <div className="option-textFild">
                                          <TextField
                                            type="date"
                                            label="From Date"
                                            variant="standard"
                                            className="w-200px"
                                            onChange={(e) => {
                                              positionParam.start_date =
                                                e.target.value;
                                              setPositionParam({
                                                ...positionParam,
                                              });
                                            }}
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                          />
                                          <TextField
                                            type="date"
                                            label="To Date"
                                            variant="standard"
                                            className="w-200px"
                                            onChange={(e) => {
                                              positionParam.end_date =
                                                e.target.value;
                                              setPositionParam({
                                                ...positionParam,
                                              });
                                            }}
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                          />
                                        </div>
                                        <div className="bankDetailsTabSection">
                                          {positionParam.open ? (
                                            <CommonTable
                                              url={`${Url}/ajaxfiles/get_user_mt5_open_trade.php`}
                                              column={positionColumn}
                                              userId={id}
                                              sort="0"
                                              refresh={refreshOpenClose}
                                              paginationOff={true}
                                              param={positionParam}
                                            />
                                          ) : (
                                            <CommonTable
                                              url={`${Url}/ajaxfiles/get_user_mt5_closed_trade.php`}
                                              column={positionColumnClose}
                                              userId={id}
                                              paginationOff={true}
                                              sort="0"
                                              refresh={refreshOpenClose}
                                              param={positionParam}
                                            />
                                          )}
                                        </div>
                                      </Paper>
                                    </Grid>
                                  </Grid>
                                </div>
                              ) : (
                                ""
                              )}
                            </Grid>
                          ) : (
                            ""
                          )}
                        </Grid>
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    {permission.view_login_activities == 1 ? (
                      <TabPanel value={4} index={4} dir={theme.direction}>
                        <Grid container spacing={3} className="grid-handle">
                          {value == 4 ? (
                            <Grid item md={12} lg={12} xl={12}>
                              <Paper
                                elevation={2}
                                style={{ borderRadius: "10px" }}
                                className="paper-main-section"
                              >
                                <div className="headerSection header-title">
                                  <p className="margin-0">Activities</p>
                                </div>
                                {/* <br/> */}
                                <div className="bankDetailsTabSection">
                                  <CommonTable
                                    url={`${Url}/datatable/login_activities.php`}
                                    column={activityColumn}
                                    userId={id}
                                    sort="2"
                                  />
                                </div>
                              </Paper>
                            </Grid>
                          ) : (
                            ""
                          )}
                        </Grid>
                      </TabPanel>
                    ) : (
                      ""
                    )}

                    {permission.log_list == 1 ? (
                      <TabPanel value={5} index={5} dir={theme.direction}>
                        {value == "5" ? (
                          <Grid container spacing={3} className="grid-handle">
                            <Grid item md={12} lg={12} xl={12}>
                              <Paper
                                elevation={2}
                                style={{ borderRadius: "10px" }}
                                className="paper-main-section"
                              >
                                <div className="headerSection header-title">
                                  <p className="margin-0">Logs</p>
                                  {/* <Button
                                variant="contained"
                                className="add_note"
                                onClick={openDialogbox}
                              >
                                Add Note
                              </Button> */}
                                </div>
                                <div className="bankDetailsTabSection">
                                  <CommonTable
                                    url={`${Url}/datatable/log_list.php`}
                                    column={logColumn}
                                    userId={id}
                                    sort="2"
                                  />
                                </div>
                              </Paper>
                            </Grid>
                          </Grid>
                        ) : (
                          ""
                        )}
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    {permission.wallet_history == 1 ? (
                      <TabPanel value={6} index={6} dir={theme.direction}>
                        {value == 6 ? (
                          <Grid container spacing={3} className="grid-handle">
                            <Grid item md={12} lg={12} xl={12}>
                              <Paper
                                elevation={2}
                                style={{ borderRadius: "10px" }}
                                className="paper-main-section"
                              >
                                <div className="headerSection header-title">
                                  <p className="margin-0">Transactions</p>
                                  {permission.transaction_access == 1 ? (
                                    <Button
                                      variant="contained"
                                      className="add_transaction"
                                      onClick={openDialogbox}
                                    >
                                      Add New Transaction
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="bankDetailsTabSection">
                                  <CommonTable
                                    url={`${Url}/datatable/user_recent_transaction_list.php`}
                                    column={walletHistoryColumn}
                                    userId={id}
                                    refresh={refresh}
                                    sort="1"
                                  />
                                </div>
                              </Paper>
                            </Grid>
                          </Grid>
                        ) : (
                          ""
                        )}
                      </TabPanel>
                    ) : (
                      ""
                    )}

                    {userData.data.is_ib_account == "0" ? (
                      permission.notes_list == 1 ? (
                        <TabPanel value={10} index={7} dir={theme.direction}>
                          <Grid container spacing={3} className="grid-handle">
                            {value == 10 ? (
                              <Grid item md={12} lg={12} xl={12}>
                                <Paper
                                  elevation={2}
                                  style={{ borderRadius: "10px" }}
                                  className="paper-main-section"
                                >
                                  <div className="headerSection header-title">
                                    <p className="margin-0">Notes</p>
                                    {permission.add_new_notes == 1 ? (
                                      <Button
                                        variant="contained"
                                        className="add_note"
                                        onClick={openDialogbox}
                                      >
                                        Add Note
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {}
                                  <div className="bankDetailsTabSection">
                                    <CommonTable
                                      url={`${Url}/datatable/notes_list.php`}
                                      column={noteColumn}
                                      userId={id}
                                      sort="2"
                                      refresh={refresh}
                                    />
                                  </div>
                                </Paper>
                              </Grid>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </TabPanel>
                      ) : (
                        ""
                      )
                    ) : permission.list_my_structures == 1 ? (
                      <TabPanel value={7} index={7} dir={theme.direction}>
                        {value == 7 ? <Referrals id={id} /> : ""}
                      </TabPanel>
                    ) : (
                      ""
                    )}

                    {userData.data.is_ib_account == "1" ? (
                      permission.list_my_structures == 1 ? (
                        <TabPanel value={8} index={8} dir={theme.direction}>
                          <Grid container spacing={3} className="grid-handle">
                            {value == 8 ? (
                              <Grid item md={12} lg={12} xl={12}>
                                <Paper
                                  elevation={2}
                                  style={{ borderRadius: "10px" }}
                                  className="paper-main-section partnership-main-section"
                                >
                                  <div className="headerSection header-title">
                                    <div className="header-search-section">
                                      <FormControl
                                        variant="standard"
                                        sx={{ width: "100%" }}
                                      >
                                        <InputLabel>Structure</InputLabel>
                                        <Select
                                          label
                                          className="select-font-small"
                                          name="structure"
                                          onChange={(e) => {
                                            getPartnershipMasterStructure(
                                              e.target.value
                                            );
                                            partnershipMasterStructureData.structure_id =
                                              e.target.value;
                                            partnershipMasterStructureData.structure_name =
                                              structureList.data.filter(
                                                (x) =>
                                                  x.structure_id ==
                                                  e.target.value
                                              )[0].structure_name;
                                            setStructureList((prevalue) => {
                                              return {
                                                ...prevalue,
                                                structure_name:
                                                  structureList.data.filter(
                                                    (x) =>
                                                      x.structure_id ==
                                                      e.target.value
                                                  )[0].structure_name,
                                                structure_id: e.target.value,
                                              };
                                            });
                                          }}
                                        >
                                          {structureList.data.map((item) => {
                                            return (
                                              <MenuItem
                                                value={item.structure_id}
                                              >
                                                {item.structure_name}
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </FormControl>
                                      {permission.delete_master_structure ==
                                      1 ? (
                                        <Button
                                          variant="contained"
                                          className="add_master_structure btn-danger"
                                          onClick={deleteStructureSubmit}
                                        >
                                          Structure Delete
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="groun-button">
                                      {permission.insert_strcuture_master ==
                                      1 ? (
                                        <Button
                                          variant="contained"
                                          className="add_master_structure"
                                          onClick={openDialogbox}
                                        >
                                          Add Master Structure
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {permission.update_strcuture_master ==
                                      1 ? (
                                        <Button
                                          variant="contained"
                                          className="edit_structure"
                                          onClick={openDialogbox}
                                          disabled={
                                            partnershipMasterStructureData.structure_name !=
                                            ""
                                              ? false
                                              : true
                                          }
                                        >
                                          Edit Structure
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="bankDetailsTabSection">
                                    {partnershipMasterStructureData
                                      .structure_data.length > 0 ? (
                                      <div className="partnership-section">
                                        <div className="master-structure-section">
                                          <div className="structureNameSection view-ib-content-section">
                                            <label>STRUCTURE NAME</label>
                                            <span>
                                              {
                                                partnershipMasterStructureData.structure_name
                                              }
                                            </span>
                                          </div>
                                          <div className="main-content-input">
                                            <div className="ib-structure view-commission-content-section">
                                              {partnershipMasterStructureData.structure_data.map(
                                                (item, index) => {
                                                  return (
                                                    <div className="group-structure-section">
                                                      <div className="main-section">
                                                        <div className="main-section-title">
                                                          {item.ib_group_name}
                                                        </div>
                                                        <div className="main-section-input-element">
                                                          <div>
                                                            {/* <span>Rebate</span> */}
                                                            <input
                                                              type="number"
                                                              className="Rebate_amount"
                                                              placeholder="Rebate"
                                                              disabled
                                                              value={
                                                                item.group_rebate
                                                              }
                                                            />
                                                          </div>
                                                          <div>
                                                            {/* <span>Commission</span> */}
                                                            <input
                                                              type="number"
                                                              className="commission_amount"
                                                              placeholder="Commission"
                                                              disabled
                                                              value={
                                                                item.group_commission
                                                              }
                                                            />
                                                          </div>
                                                          {/* <div>
                                                      {
                                                        (item.ibGroup != undefined) ?
                                                          <FormControl variant="standard">
                                                            <Select
                                                              label
                                                              className="select-font-small"
                                                              value={item.ib_group_level_id}
                                                              name="title"
                                                              disabled
                                                            >
                                                              <MenuItem value={0}>Select IB Group</MenuItem>
                                                              {
                                                                item.ibGroup.map((item1, index1) => {
                                                                  return (
                                                                    <MenuItem disabled={item1.isDisable} value={item1.ib_group_level_id}>{item1.ib_group_name}</MenuItem>
                                                                  );
                                                                })
                                                              }
                                                            </Select>
                                                          </FormControl> : ''
                                                      }
                                                    </div> */}
                                                        </div>
                                                        <div className="action-section">
                                                          <span
                                                            onClick={(e) => {
                                                              partnershipMasterStructureData.structure_data[
                                                                index
                                                              ]["is_visible"] =
                                                                !item.is_visible;
                                                              setUpdateDate({
                                                                ...newMasterStructureData,
                                                              });
                                                            }}
                                                          >
                                                            <i
                                                              class={`fa ${
                                                                item.is_visible
                                                                  ? "fa-angle-up"
                                                                  : "fa-angle-down"
                                                              }`}
                                                              aria-hidden="true"
                                                            ></i>
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={`pair-section ${
                                                          item.is_visible
                                                            ? "child-section-visible"
                                                            : ""
                                                        }`}
                                                      >
                                                        {item.pair_data.map(
                                                          (item1, index1) => {
                                                            return (
                                                              <div className="pair-data">
                                                                <div className="pair-data-title">
                                                                  {
                                                                    item1.pair_name
                                                                  }
                                                                </div>
                                                                <div>
                                                                  <input
                                                                    type="number"
                                                                    className="rebert_amount"
                                                                    placeholder="Rebert"
                                                                    value={
                                                                      item1.rebate
                                                                    }
                                                                    disabled
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <input
                                                                    type="number"
                                                                    className="commission_amount"
                                                                    placeholder="Commission"
                                                                    value={
                                                                      item1.commission
                                                                    }
                                                                    disabled
                                                                  />
                                                                </div>
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="master-structure-section">
                                          <div className="structureNameSection view-ib-content-section">
                                            <h4 style={{ fontWeight: 600 }}>
                                              IB Dedicated Links
                                            </h4>
                                            {/* <label>STRUCTURE NAME</label>
                                        <span>{partnershipMasterStructureData.structure_name}</span> */}
                                          </div>
                                          <div className="user-links">
                                            <div className="user-link-header">
                                              <label>Link Type</label>
                                              <label>Link</label>
                                            </div>
                                            <div className="user-link-body">
                                              <label>Register</label>
                                              <div className="link-section">
                                                <a
                                                  href={`${ClientUrl}/register/sponsor/${profileForm.wallet_code}`}
                                                  target="_blank"
                                                >
                                                  {ClientUrl +
                                                    `/register/sponsor/${profileForm.wallet_code}`}
                                                </a>
                                                <button
                                                  className="copy_link"
                                                  onClick={(e) => {
                                                    navigator.clipboard
                                                      .writeText(
                                                        ClientUrl +
                                                          `/register/sponsor/${profileForm.wallet_code}`
                                                      )
                                                      .then(
                                                        function () {
                                                          toast.success(
                                                            "The sponsor link has been successfully copying"
                                                          );
                                                        },
                                                        function (err) {
                                                          toast.error(
                                                            "The sponsor link Could not copy, Please try again"
                                                          );
                                                        }
                                                      );
                                                  }}
                                                >
                                                  <span className="blinking">
                                                    <i className="material-icons">
                                                      content_copy
                                                    </i>
                                                  </span>
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Paper>
                              </Grid>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </TabPanel>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                    {permission.get_my_assigned_structure == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <TabPanel value={9} index={9} dir={theme.direction}>
                          <Grid container spacing={3} className="grid-handle">
                            {value == 9 ? (
                              <Grid item md={12} lg={12} xl={12}>
                                <Paper
                                  elevation={2}
                                  style={{ borderRadius: "10px" }}
                                  className="paper-main-section partnership-main-section"
                                >
                                  <div className="headerSection header-title">
                                    <div className="header-search-section">
                                      <p class="margin-0">My Structure</p>
                                    </div>
                                    {permission.change_assigned_rebate == 1 ? (
                                      <ColorButton
                                        onClick={() => {
                                          setDialogTitle("Edit My Structure");
                                          setMaxWidth("md");
                                          setNewMasterStructureData1({
                                            structure_data: JSON.parse(
                                              JSON.stringify(
                                                myStructureData.structure_data
                                              )
                                            ),
                                            structure_id:
                                              myStructureData.structure_id,
                                            isLoader: false,
                                          });
                                          setOpen(true);
                                        }}
                                      >
                                        Edit My Structure
                                      </ColorButton>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="bankDetailsTabSection getMyStructure">
                                    {myStructureData.structure_data.length >
                                    0 ? (
                                      <div className="partnership-section">
                                        <div className="master-structure-section">
                                          <div className="structureNameSection view-ib-content-section">
                                            <label>
                                              {myStructureData.structure_name}
                                            </label>
                                            {/* <span>{myStructureData.structure_name}</span> */}
                                          </div>
                                          <div className="main-content-input">
                                            <div className="ib-structure view-commission-content-section">
                                              {myStructureData.structure_data.map(
                                                (item, index) => {
                                                  return (
                                                    <div className="group-structure-section">
                                                      <div className="main-section">
                                                        <div className="main-section-title">
                                                          {item.ib_group_name}{" "}
                                                          {item.mt5_group_name
                                                            ? `(${item.mt5_group_name})`
                                                            : ""}
                                                        </div>
                                                        <div className="main-section-input-element">
                                                          <div>
                                                            <input
                                                              type="number"
                                                              className="Rebate_amount"
                                                              placeholder="Rebate"
                                                              disabled
                                                              value={
                                                                item.group_rebate
                                                              }
                                                            />
                                                          </div>
                                                          <div>
                                                            <input
                                                              type="number"
                                                              className="commission_amount"
                                                              placeholder="Commission"
                                                              disabled
                                                              value={
                                                                item.group_commission
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="action-section">
                                                          <span
                                                            onClick={(e) => {
                                                              myStructureData.structure_data[
                                                                index
                                                              ]["is_visible"] =
                                                                !item.is_visible;
                                                              setMyStructureData(
                                                                {
                                                                  ...myStructureData,
                                                                }
                                                              );
                                                            }}
                                                          >
                                                            <i
                                                              class={`fa ${
                                                                item.is_visible
                                                                  ? "fa-angle-up"
                                                                  : "fa-angle-down"
                                                              }`}
                                                              aria-hidden="true"
                                                            ></i>
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={`pair-section ${
                                                          item.is_visible
                                                            ? "child-section-visible"
                                                            : ""
                                                        }`}
                                                      >
                                                        {item.pair_data.map(
                                                          (item1, index1) => {
                                                            return (
                                                              <div className="pair-data">
                                                                <div className="pair-data-title">
                                                                  {
                                                                    item1.pair_name
                                                                  }
                                                                </div>
                                                                <div>
                                                                  <input
                                                                    type="number"
                                                                    className="rebert_amount"
                                                                    placeholder="Rebert"
                                                                    value={
                                                                      item1.rebate
                                                                    }
                                                                    disabled
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <input
                                                                    type="number"
                                                                    className="commission_amount"
                                                                    placeholder="Commission"
                                                                    value={
                                                                      item1.commission
                                                                    }
                                                                    disabled
                                                                  />
                                                                </div>
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <label
                                        className="text-center"
                                        style={{ width: "100%" }}
                                      >
                                        STRUCTURE Has Been Not Assigned
                                      </label>
                                    )}
                                  </div>
                                </Paper>
                              </Grid>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </TabPanel>
                      )
                    ) : (
                      ""
                    )}

                    {permission.notes_list == 1 ? (
                      <TabPanel value={10} index={10} dir={theme.direction}>
                        <Grid container spacing={3} className="grid-handle">
                          {value == 10 ? (
                            <Grid item md={12} lg={12} xl={12}>
                              <Paper
                                elevation={2}
                                style={{ borderRadius: "10px" }}
                                className="paper-main-section"
                              >
                                <div className="headerSection header-title">
                                  <p className="margin-0">Notes</p>
                                  <Button
                                    variant="contained"
                                    className="add_note"
                                    onClick={openDialogbox}
                                  >
                                    Add Note
                                  </Button>
                                </div>
                                <div className="bankDetailsTabSection">
                                  <CommonTable
                                    url={`${Url}/datatable/notes_list.php`}
                                    column={noteColumn}
                                    userId={id}
                                    sort="2"
                                    refresh={refresh}
                                  />
                                </div>
                              </Paper>
                            </Grid>
                          ) : (
                            ""
                          )}
                        </Grid>
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    {permission.my_traders == 1 ? (
                      userData.data.is_ib_account == "0" ? (
                        ""
                      ) : (
                        <TabPanel value={11} index={11} dir={theme.direction}>
                          <Grid container spacing={3} className="grid-handle">
                            {value == 11 ? (
                              <Grid item md={12} lg={12} xl={12}>
                                <Paper
                                  elevation={2}
                                  style={{ borderRadius: "10px" }}
                                  className="paper-main-section"
                                >
                                  <div className="headerSection header-title">
                                    <p className="margin-0">Downline</p>
                                  </div>
                                  <div className="bankDetailsTabSection downline-table">
                                    <table>
                                      <thead>
                                        <tr>
                                          <th>SR.NO</th>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>IB Account</th>
                                          <th>MT Code</th>
                                          <th>Deposit</th>
                                          <th>Withdraw</th>
                                          <th>Team Deposit</th>
                                          <th>Team Withdraw</th>
                                          <th>Balance</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {myTraderData.data.data != undefined ? (
                                          myTraderData.data.data.map((item) => {
                                            return (
                                              <tr>
                                                <td>{item.sr_no}</td>
                                                <td>{item.name}</td>
                                                <td>{item.user_email}</td>
                                                <td>
                                                  {item.is_ib_account == "1"
                                                    ? "Yes"
                                                    : "No"}
                                                </td>
                                                <td>{item.mt5_acc_ids}</td>
                                                <td>{item.deposit_amount}</td>
                                                <td>
                                                  {item.withdrawal_amount}
                                                </td>
                                                <td>{item.total_deposit}</td>
                                                <td>{item.total_withdraw}</td>
                                                <td>{item.wallet_balance}</td>
                                                <td>
                                                  {item.is_ib_account == "1" &&
                                                  item.has_downline == true ? (
                                                    <Button
                                                      variant="contained"
                                                      className="add_note"
                                                      onClick={(e) => {
                                                        myTraderData.user_name =
                                                          item.name;
                                                        myTraderData.main_user_name =
                                                          item.name;
                                                        myTraderData.user_id =
                                                          item.client_id;
                                                        setMyTraderData({
                                                          ...myTraderData,
                                                        });
                                                        getMyChildTrader(
                                                          item.client_id
                                                        );
                                                      }}
                                                    >
                                                      View
                                                    </Button>
                                                  ) : (
                                                    ""
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          })
                                        ) : (
                                          <tr>
                                            <td
                                              className="text-center"
                                              colSpan={10}
                                            >
                                              Recored not found
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td colSpan="5">
                                            <b>
                                              {myTraderData.data.footer_count !=
                                              undefined
                                                ? myTraderData.data[
                                                    "footer_count"
                                                  ]["total"]
                                                : ""}
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {myTraderData.data.footer_count !=
                                              undefined
                                                ? myTraderData.data[
                                                    "footer_count"
                                                  ]["total_user_deposit"]
                                                : ""}
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {myTraderData.data.footer_count !=
                                              undefined
                                                ? myTraderData.data[
                                                    "footer_count"
                                                  ]["total_user_withdraw"]
                                                : ""}
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {myTraderData.data.footer_count !=
                                              undefined
                                                ? myTraderData.data[
                                                    "footer_count"
                                                  ]["total_total_user_deposit"]
                                                : ""}
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {myTraderData.data.footer_count !=
                                              undefined
                                                ? myTraderData.data[
                                                    "footer_count"
                                                  ]["total_total_user_withdraw"]
                                                : ""}
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {myTraderData.data.footer_count !=
                                              undefined
                                                ? myTraderData.data[
                                                    "footer_count"
                                                  ]["total_user_wallet"]
                                                : ""}
                                            </b>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </Paper>
                              </Grid>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </TabPanel>
                      )
                    ) : (
                      ""
                    )}

                    {permission.view_pamm_dashboard == 1 ||
                    permission.money_manager_accounts == 1 ||
                    permission.my_money_managers == 1 ||
                    permission.my_portfolios == 1 ||
                    permission.pamm_trade_history == 1 ||
                    permission.pamm_withdraw_request == 1 ? (
                      userData.data.is_pamm == "1" ? (
                        <TabPanel value={12} index={12} dir={theme.direction}>
                          <Grid container spacing={3} className="grid-handle">
                            {value == 12 ? (
                              <Grid item md={12} lg={12} xl={12}>
                                <Paper
                                  elevation={2}
                                  style={{ borderRadius: "10px" }}
                                  className="paper-main-section"
                                >
                                  <div className="headerSection header-title">
                                    <p className="margin-0">PAMM</p>
                                  </div>
                                  <div className="bankDetailsTabSection pamm-section">
                                    <div className="groupButtonSection">
                                      <ButtonGroup variant="outlined">
                                        {permission.view_pamm_dashboard == 1 ? (
                                          <Button
                                            variant={`${
                                              pammGroupButton == "dashboard"
                                                ? "contained"
                                                : "outlined"
                                            }`}
                                            onClick={(e) => {
                                              setPammGroupButton("dashboard");
                                            }}
                                          >
                                            Dashboard
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                        {permission.money_manager_accounts ==
                                          1 || permission.my_portfolios == 1 ? (
                                          <Button
                                            variant={`${
                                              pammGroupButton ==
                                              "portfolio_manage"
                                                ? "contained"
                                                : "outlined"
                                            }`}
                                            onClick={(e) => {
                                              getMoneyManager();
                                              setPammPortfolioGroupButton(
                                                "money_manager"
                                              );
                                              setPammGroupButton(
                                                "portfolio_manage"
                                              );
                                            }}
                                          >
                                            Portfolio Manage
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                        {permission.my_money_managers == 1 ? (
                                          <Button
                                            variant={`${
                                              pammGroupButton == "my_manage"
                                                ? "contained"
                                                : "outlined"
                                            }`}
                                            onClick={(e) => {
                                              setPammGroupButton("my_manage");
                                            }}
                                          >
                                            My Managers
                                          </Button>
                                        ) : (
                                          ""
                                        )}

                                        {permission.pamm_trade_history == 1 ? (
                                          <Button
                                            variant={`${
                                              pammGroupButton == "trade_history"
                                                ? "contained"
                                                : "outlined"
                                            }`}
                                            onClick={(e) => {
                                              setPammGroupButton(
                                                "trade_history"
                                              );
                                            }}
                                          >
                                            Trade History
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                        {permission.pamm_withdraw_request ==
                                        1 ? (
                                          <Button
                                            variant={`${
                                              pammGroupButton ==
                                              "withdraw_history"
                                                ? "contained"
                                                : "outlined"
                                            }`}
                                            onClick={(e) => {
                                              setPammGroupButton(
                                                "withdraw_history"
                                              );
                                            }}
                                          >
                                            Withdrawal History
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                      </ButtonGroup>
                                    </div>
                                    <br />
                                    {pammGroupButton == "dashboard" ? (
                                      <div>
                                        <div className="setBoxs">
                                          <div className="row1 boxSection">
                                            <div className="card padding-9 animate fadeLeft boxsize">
                                              <div className="row">
                                                <NavLink to="/pamm_user_management">
                                                  <div className="col s12 m12 text-align-center">
                                                    <h5 className="mb-0">
                                                      {pammDashboardData.my_balance ==
                                                      null
                                                        ? "$0"
                                                        : "$" +
                                                          pammDashboardData.my_balance}
                                                    </h5>
                                                    <p className="no-margin">
                                                      Wallet Balance
                                                    </p>
                                                  </div>
                                                </NavLink>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row1 boxSection">
                                            <div className="card padding-9 animate fadeLeft boxsize">
                                              <div className="row">
                                                <NavLink to="/pamm_mm_management">
                                                  <div className="col s12 m12 text-align-center">
                                                    <h5 className="mb-0">
                                                      {pammDashboardData.total_investment ==
                                                      null
                                                        ? "$0"
                                                        : "$" +
                                                          pammDashboardData.total_investment}
                                                    </h5>
                                                    <p className="no-margin">
                                                      Total Investment
                                                    </p>
                                                  </div>
                                                </NavLink>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row1 boxSection">
                                            <div className="card padding-9 animate fadeLeft boxsize">
                                              <div className="row">
                                                <NavLink to="/pamm_mm_management">
                                                  <div className="col s12 m12 text-align-center">
                                                    <h5 className="mb-0">
                                                      {pammDashboardData.total_withdrawal ==
                                                      null
                                                        ? "$0"
                                                        : "$" +
                                                          pammDashboardData.total_withdrawal}
                                                    </h5>
                                                    <p className="no-margin">
                                                      Total Withdrawal
                                                    </p>
                                                  </div>
                                                </NavLink>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {pammGroupButton == "portfolio_manage" ? (
                                      <div>
                                        <div className="portfolio-manager-group-button">
                                          <ButtonGroup variant="outlined">
                                            {permission.money_manager_accounts ==
                                            1 ? (
                                              <Button
                                                variant={`${
                                                  pammPortfolioGroupButton ==
                                                  "money_manager"
                                                    ? "contained"
                                                    : "outlined"
                                                }`}
                                                onClick={(e) => {
                                                  getMoneyManager();
                                                  setPammPortfolioGroupButton(
                                                    "money_manager"
                                                  );
                                                }}
                                              >
                                                MONEY MANAGER
                                              </Button>
                                            ) : (
                                              ""
                                            )}
                                            {permission.my_portfolios == 1 ? (
                                              <Button
                                                variant={`${
                                                  pammPortfolioGroupButton ==
                                                  "my_portfolio"
                                                    ? "contained"
                                                    : "outlined"
                                                }`}
                                                onClick={(e) => {
                                                  getMyPortfolio();
                                                  setPammPortfolioGroupButton(
                                                    "my_portfolio"
                                                  );
                                                }}
                                              >
                                                MY PORTFOLIO
                                              </Button>
                                            ) : (
                                              ""
                                            )}
                                          </ButtonGroup>
                                        </div>
                                        <br />
                                        {pammPortfolioGroupButton ==
                                        "my_portfolio" ? (
                                          <div className="pamm-create-my-portfolio-button">
                                            {permission.create_portfolio ==
                                            1 ? (
                                              <Button
                                                variant="contained"
                                                onClick={(e) => {
                                                  setMaxWidth("sm");

                                                  setCreatePortfolioForm({
                                                    isLoader: false,
                                                    portfolio_name: "",
                                                    mm_mt5_acc_id: "",
                                                    investment_months: "",
                                                  });
                                                  setcpinputinfoTrue({
                                                    portfolio_name: false,
                                                    mm_mt5_acc_id: false,
                                                    investment_months: false,
                                                  });
                                                  setDialogTitle(
                                                    "Create Portfolio"
                                                  );
                                                  getMoneyManagerList();
                                                  setOpen(true);
                                                }}
                                              >
                                                Create Portfolio
                                              </Button>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {pammPortfolioGroupButton ==
                                        "money_manager" ? (
                                          <div>
                                            <div className="money-manager-card-list-section">
                                              {moneyManagerList.map(
                                                (item, index) => {
                                                  return (
                                                    <div className="money-manager-content">
                                                      <div className="money-manager-header-section">
                                                        <NavLink
                                                          className="navlink-color-white"
                                                          to={`/money_manager_profile/${item.mm_mt5_acc_id}/${id}`}
                                                        >
                                                          <label>
                                                            {item.mt5_name}
                                                          </label>
                                                        </NavLink>
                                                      </div>
                                                      <div className="money-manager-body-section">
                                                        <div className="money-manager-body-content-element marge-element">
                                                          <div className="right-side-border">
                                                            <label>
                                                              Minimum deposit
                                                            </label>
                                                            <p>
                                                              $
                                                              {
                                                                item.minimum_deposit_amount
                                                              }
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <label>
                                                              Fees Percentage
                                                            </label>
                                                            <p>
                                                              {
                                                                item.fees_percentage
                                                              }
                                                              %
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="money-manager-body-content-element marge-element">
                                                          <div className="right-side-border">
                                                            <label>
                                                              Approx Return
                                                            </label>
                                                            <p className="text-color-green">
                                                              {
                                                                item.fees_percentage
                                                              }
                                                              %
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <label>
                                                              Risk Score
                                                            </label>
                                                            <img src="./assets/img/rishScoreLow.jpg" />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      {item.is_closed == "0" ? (
                                                        <div className="money-manager-footer-action-section">
                                                          {permission.withdraw_request ==
                                                          1 ? (
                                                            <button
                                                              className="danger"
                                                              onClick={(e) => {
                                                                setWithdrawForm(
                                                                  {
                                                                    isLoader: false,
                                                                    allWithdraw: true,
                                                                    amount: "",
                                                                    pid: item.pid,
                                                                  }
                                                                );
                                                                setDialogTitle(
                                                                  "Withdraw"
                                                                );
                                                                SetRefreshCreatePortfolio1(
                                                                  true
                                                                );
                                                                setOpen(true);
                                                              }}
                                                            >
                                                              Withdraw
                                                            </button>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {permission.add_investment ==
                                                          1 ? (
                                                            <button
                                                              className="success"
                                                              onClick={(e) => {
                                                                investmentForm.user_id =
                                                                  item.mm_user_id;
                                                                investmentForm.pid =
                                                                  item.pid;
                                                                investmentForm.amount =
                                                                  "";
                                                                setInvestmentForm(
                                                                  {
                                                                    ...investmentForm,
                                                                  }
                                                                );
                                                                setDialogTitle(
                                                                  "Investment"
                                                                );
                                                                setOpen(true);
                                                              }}
                                                            >
                                                              Invest
                                                            </button>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {permission.view_money_manager_profile ==
                                                          1 ? (
                                                            <NavLink
                                                              className="third-view-button"
                                                              to={`/money_manager_profile/${item.mm_mt5_acc_id}/${id}`}
                                                            >
                                                              View
                                                            </NavLink>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </div>
                                                      ) : item.is_closed ==
                                                        "2" ? (
                                                        <div className="money-manager-footer-action-section">
                                                          <button className="skyblue1 padingbutton">
                                                            Pending
                                                          </button>
                                                          {permission.view_money_manager_profile ==
                                                          1 ? (
                                                            <NavLink
                                                              className="third-view-button"
                                                              to={`/money_manager_profile/${item.mm_mt5_acc_id}/${id}`}
                                                            >
                                                              View
                                                            </NavLink>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </div>
                                                      ) : (
                                                        <div className="money-manager-footer-action-section">
                                                          {permission.create_portfolio ==
                                                          1 ? (
                                                            <button
                                                              className="skyblue"
                                                              onClick={(e) => {
                                                                setMaxWidth(
                                                                  "sm"
                                                                );
                                                                createPortfolioForm.mm_mt5_acc_id =
                                                                  item.mm_mt5_acc_id;
                                                                createPortfolioForm.investment_months =
                                                                  "";
                                                                createPortfolioForm.portfolio_name =
                                                                  "";
                                                                setCreatePortfolioForm(
                                                                  {
                                                                    ...createPortfolioForm,
                                                                  }
                                                                );
                                                                setcpinputinfoTrue(
                                                                  {
                                                                    portfolio_name: false,
                                                                    mm_mt5_acc_id: false,
                                                                    investment_months: false,
                                                                  }
                                                                );
                                                                setDialogTitle(
                                                                  "Create Portfolio"
                                                                );
                                                                getMoneyManagerList();
                                                                setOpen(true);
                                                              }}
                                                            >
                                                              Create Portfolio
                                                            </button>
                                                          ) : (
                                                            ""
                                                          )}

                                                          {permission.view_money_manager_profile ==
                                                          1 ? (
                                                            <NavLink
                                                              className="third-view-button"
                                                              to={`/money_manager_profile/${item.mm_mt5_acc_id}/${id}`}
                                                            >
                                                              View
                                                            </NavLink>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {pammPortfolioGroupButton ==
                                        "my_portfolio" ? (
                                          <div className="myportfolio-card-section">
                                            {portfolioLoader ? (
                                              <div className="loader-section">
                                                <svg
                                                  class="spinner"
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
                                              </div>
                                            ) : (
                                              myPortfolio.map((item) => {
                                                return (
                                                  <div className="myportfolio-card-content">
                                                    <div className="width-100-with-border header-sction">
                                                      <div>
                                                        <NavLink
                                                          to={`/portfolio_profile/${item.pid}/${id}`}
                                                          className="portfolio-link-color"
                                                        >
                                                          {item.portfolio_name}
                                                        </NavLink>
                                                        <span className="text-bold-700">
                                                          {item.portfolio_id}
                                                        </span>
                                                      </div>
                                                      <div>
                                                        <span>
                                                          Money Manager
                                                        </span>
                                                        <NavLink
                                                          className="navlink-color-white"
                                                          to={`/money_manager_profile/${item.mm_mt5_acc_id}/${id}`}
                                                        >
                                                          <span className="text-bold-700">
                                                            {item.account_name}
                                                          </span>
                                                        </NavLink>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="width-100-with-border"
                                                      style={{
                                                        backgroundColor:
                                                          item.is_closed == "0"
                                                            ? "white"
                                                            : "#ebd7d7",
                                                      }}
                                                    >
                                                      <div>
                                                        <span>Investment</span>
                                                        <span className="text-bold-700">
                                                          ${item.my_investment}
                                                        </span>
                                                      </div>
                                                      <div>
                                                        <span>
                                                          Current Value
                                                        </span>
                                                        <span
                                                          className="text-bold-700"
                                                          style={{
                                                            color:
                                                              item.my_investment <=
                                                              item.current_value
                                                                ? "green"
                                                                : "red",
                                                          }}
                                                        >
                                                          ${item.current_value}
                                                        </span>
                                                      </div>

                                                      <div>
                                                        <span>PNL</span>
                                                        <span
                                                          className="text-bold-700"
                                                          style={{
                                                            color:
                                                              item.pnl >= 0
                                                                ? "green"
                                                                : "red",
                                                          }}
                                                        >
                                                          ${item.pnl}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="width-100-with-border"
                                                      style={{
                                                        backgroundColor:
                                                          item.is_closed == "0"
                                                            ? "white"
                                                            : "#ebd7d7",
                                                      }}
                                                    >
                                                      <div>
                                                        <span>Return %</span>
                                                        <span
                                                          className="text-bold-700"
                                                          style={{
                                                            color:
                                                              item.return_percentage >=
                                                              0
                                                                ? "green"
                                                                : "red",
                                                          }}
                                                        >
                                                          {
                                                            item.return_percentage
                                                          }
                                                          %
                                                        </span>
                                                      </div>

                                                      <div>
                                                        <span>Date Time</span>
                                                        <span className="text-bold-700">
                                                          {item.added_datetime}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="width-100-with-border"
                                                      style={{
                                                        backgroundColor:
                                                          item.is_closed == "0"
                                                            ? "white"
                                                            : "#ebd7d7",
                                                      }}
                                                    >
                                                      <div>
                                                        <span>Floating</span>
                                                        <span
                                                          className="text-bold-700"
                                                          style={{
                                                            color:
                                                              item.current_floating >=
                                                              0
                                                                ? "green"
                                                                : "red",
                                                          }}
                                                        >
                                                          {
                                                            item.current_floating
                                                          }
                                                        </span>
                                                      </div>

                                                      <div>
                                                        <span>Trade</span>
                                                        <span className="cursor">
                                                          <span
                                                            class="material-icons"
                                                            onClick={() => {
                                                              navigate(
                                                                `/pamm_trade_history/${item.pid}`
                                                              );
                                                            }}
                                                          >
                                                            insert_chart
                                                          </span>
                                                        </span>
                                                      </div>
                                                    </div>
                                                    {item.is_closed == "0" ? (
                                                      <div className="footer-action-button">
                                                        <button
                                                          onClick={(e) => {
                                                            setMaxWidth("sm");
                                                            setWithdrawForm({
                                                              isLoader: false,
                                                              allWithdraw: true,
                                                              amount: "",
                                                              pid: item.pid,
                                                            });
                                                            SetRefreshCreatePortfolio1(
                                                              false
                                                            );
                                                            setDialogTitle(
                                                              "Withdraw"
                                                            );
                                                            setOpen(true);
                                                          }}
                                                        >
                                                          Withdraw
                                                        </button>
                                                        <button
                                                          onClick={(e) => {
                                                            investmentForm.user_id =
                                                              "";
                                                            investmentForm.pid =
                                                              item.pid;
                                                            investmentForm.amount =
                                                              "";
                                                            setMaxWidth("sm");
                                                            setInvestmentForm({
                                                              ...investmentForm,
                                                            });
                                                            setDialogTitle(
                                                              "Investment"
                                                            );
                                                            setOpen(true);
                                                          }}
                                                        >
                                                          Invest
                                                        </button>
                                                        <NavLink
                                                          className="third-view-button"
                                                          to={`/portfolio_profile/${item.pid}/${id}`}
                                                        >
                                                          View
                                                        </NavLink>
                                                      </div>
                                                    ) : item.is_closed ==
                                                      "1" ? (
                                                      <div className="footer-action-button">
                                                        <div
                                                          className="footer-action-button spanportFolio1"
                                                          style={{
                                                            backgroundColor:
                                                              item.is_closed ==
                                                              "0"
                                                                ? "white"
                                                                : "#ebd7d7",
                                                          }}
                                                        >
                                                          <span className="spanportFolio">
                                                            Closed
                                                          </span>
                                                        </div>
                                                        <NavLink
                                                          className="third-view-button"
                                                          to={`/portfolio_profile/${item.pid}/${id}`}
                                                        >
                                                          View
                                                        </NavLink>
                                                      </div>
                                                    ) : (
                                                      <div className="footer-action-button">
                                                        <div
                                                          className="footer-action-button spanportFolio1"
                                                          style={{
                                                            backgroundColor:
                                                              item.is_closed ==
                                                              "0"
                                                                ? "white"
                                                                : "#ebe5c1",
                                                          }}
                                                        >
                                                          <span className="spanportFoliopading">
                                                            Pending
                                                          </span>
                                                        </div>
                                                        <NavLink
                                                          className="third-view-button"
                                                          to={`/portfolio_profile/${item.pid}/${id}`}
                                                        >
                                                          View
                                                        </NavLink>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {pammGroupButton == "my_manage" ? (
                                      <div>
                                        <CommonTable
                                          url={`${Url}/datatable/pamm/my_money_managers.php`}
                                          column={pammMyManagerColumn}
                                          sort="5"
                                          param={pammMyManagerParam}
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {pammGroupButton == "trade_history" ? (
                                      <div>
                                        <div className="pamm-withdraw-history-filter-section">
                                          <div className="filter-element">
                                            <TextField
                                              className="input-font-small"
                                              label="From"
                                              type="date"
                                              variant="standard"
                                              sx={{ width: "100%" }}
                                              name="from"
                                              focused
                                              onChange={(e) => {
                                                pammTradeParam.start_date =
                                                  e.target.value;
                                                setPammTardeParam({
                                                  ...pammTradeParam,
                                                });
                                              }}
                                            />
                                          </div>
                                          <div className="filter-element">
                                            <TextField
                                              className="input-font-small"
                                              label="To"
                                              type="date"
                                              variant="standard"
                                              sx={{ width: "100%" }}
                                              name="to"
                                              focused
                                              onChange={(e) => {
                                                pammTradeParam.end_date =
                                                  e.target.value;
                                                setPammTardeParam({
                                                  ...pammTradeParam,
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <CommonTable
                                          url={`${Url}/datatable/pamm/pamm_trade_history.php`}
                                          column={pammTradeHistoryColumn}
                                          sort="2"
                                          param={pammTradeParam}
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {pammGroupButton == "withdraw_history" ? (
                                      <div>
                                        <div className="pamm-withdraw-history-filter-section">
                                          <div className="filter-element">
                                            <TextField
                                              className="input-font-small"
                                              label="From"
                                              type="date"
                                              variant="standard"
                                              sx={{ width: "100%" }}
                                              name="from"
                                              focused
                                              onChange={(e) => {
                                                pammWithdrawParam.start_date =
                                                  e.target.value;
                                                setPammWithdrawParam({
                                                  ...pammWithdrawParam,
                                                });
                                              }}
                                            />
                                          </div>
                                          <div className="filter-element">
                                            <TextField
                                              className="input-font-small"
                                              label="To"
                                              type="date"
                                              variant="standard"
                                              sx={{ width: "100%" }}
                                              name="to"
                                              focused
                                              onChange={(e) => {
                                                pammWithdrawParam.end_date =
                                                  e.target.value;
                                                setPammWithdrawParam({
                                                  ...pammWithdrawParam,
                                                });
                                              }}
                                            />
                                          </div>
                                          <div className="filter-element">
                                            <FormControl
                                              variant="standard"
                                              sx={{ width: "100%" }}
                                            >
                                              <InputLabel>Status</InputLabel>
                                              <Select
                                                label
                                                className="select-font-small"
                                                name="account_type"
                                                onChange={(e) => {
                                                  pammWithdrawParam.status =
                                                    e.target.value;
                                                  setPammWithdrawParam({
                                                    ...pammWithdrawParam,
                                                  });
                                                }}
                                                focused
                                              >
                                                <MenuItem value="0">
                                                  Pending
                                                </MenuItem>
                                                <MenuItem value="1">
                                                  Approved
                                                </MenuItem>
                                                <MenuItem value="2">
                                                  Rejected
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </div>
                                        </div>
                                        <CommonTable
                                          url={`${Url}/datatable/pamm/pamm_withdraw_request.php`}
                                          column={pammWithdrawHistoryColumn}
                                          sort="1"
                                          param={pammWithdrawParam}
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Paper>
                              </Grid>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </TabPanel>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}

                    <TabPanel value={13} index={13} dir={theme.direction}>
                      {value == 13 ? <Statement id={id} /> : ""}
                    </TabPanel>
                    <TabPanel value={14} index={14} dir={theme.direction}>
                      <Grid
                        container
                        spacing={3}
                        className="grid-handle panding-left-right-3px"
                      >
                        <Grid item md={12} lg={12} xl={12}>
                          {value == 14 ? <AdditionalDocuments id={id} /> : ""}
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </SwipeableViews>
                  {/* </Box> */}
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
          )}
        </div>
        <Dialog
          open={openModel}
          onClose={handleClose}
          // aria-labelledby="alert-dialog-title"
          // aria-describedby="alert-dialog-description"
          style={{
            opacity: "1",
            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
          PaperProps={{
            sx: {
              width: "50%",
              maxWidth: "768px",
              borderRadius: "10px",
              elevation: "24",
              class: "border border-bottom-0",
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            className="d-flex align-items-center p-3"
            style={{ borderBottom: "none" }}
          >
            <h5 className="ml-3 w-100 text-start mt-2 mb-2 font-weight-bold">
              View Partnership
            </h5>
            <CloseIcon
              onClick={() => {
                setOpenModel(false);
              }}
            />
          </DialogTitle>
          <DialogContent className="create-account-content ml-4">
            <Grid
              container
              spacing={1}
              // className="MuiGrid-justify-xs-space-between mt-2"
            >
              <div>
                <div className="main-content-display">
                  <div className="display-element">
                    <h6>User Name</h6>
                    <div>{ibdata.requested_user_name}</div>
                  </div>
                  <div className="display-element">
                    <h6>DATE</h6>
                    <div>{ibdata.date}</div>
                  </div>
                  <div className="display-element">
                    <h6>ACQUIRE CLIENT</h6>
                    <div>{ibdata.execution}</div>
                  </div>
                  <div className="display-element">
                    <h6>COUNTRY</h6>
                    <div>{ibdata.countries}</div>
                  </div>
                  <div className="display-element">
                    <h6>EMAIL</h6>
                    <div>{ibdata.user_email}</div>
                  </div>
                  <div className="display-element">
                    <h6>Sponsor Name</h6>
                    <div>{ibdata.sponsor_name}</div>
                  </div>
                  <div className="display-element">
                    <h6>STRUCTURE NAME</h6>
                    <div>{ibdata.structure_name}</div>
                  </div>
                  <div className="display-element">
                    <h6>REFFEERED</h6>
                    <div>{ibdata.is_reffered == "0" ? "NO" : "YES"}</div>
                  </div>
                  <div className="display-element">
                    <h6>WEBSITE</h6>
                    <div>{ibdata.is_website == "0" ? "NO" : "YES"}</div>
                  </div>
                  <div className="display-element">
                    <h6>REMARK</h6>
                    <div>{ibdata.REMARK}</div>
                  </div>
                  <div className="display-element">
                    <h6>IB APPROVE</h6>
                    <div
                      className={`col s12 text-color-${
                        ibdata.sponsor_approve == "1"
                          ? "green"
                          : ibdata.sponsor_approve == "2"
                          ? "red"
                          : "yellow"
                      }`}
                    >
                      {ibdata.sponsor_approve == "1"
                        ? "APPROVED"
                        : ibdata.sponsor_approve == "2"
                        ? "REJECTED"
                        : "PENDING"}
                    </div>
                  </div>
                  <div className="display-element">
                    <h6>ADMIN APPROVE</h6>
                    <div
                      className={`col s12 text-color-${
                        ibdata.admin_approve == "1"
                          ? "green"
                          : ibdata.admin_approve == "2"
                          ? "red"
                          : "yellow"
                      }`}
                    >
                      {ibdata.admin_approve == "1"
                        ? "APPROVED"
                        : ibdata.admin_approve == "2"
                        ? "REJECTED"
                        : "PENDING"}
                    </div>
                  </div>
                  <div className="display-element">
                    <h6>STATUS</h6>
                    <div
                      className={`col s12 text-color-${
                        ibdata.status == "1"
                          ? "green"
                          : ibdata.status == "2"
                          ? "red"
                          : "yellow"
                      }`}
                    >
                      {ibdata.status == "1"
                        ? "APPROVED"
                        : ibdata.status == "2"
                        ? "REJECTED"
                        : "PENDING"}
                    </div>
                  </div>{" "}
                </div>
              </div>
              <div className="divider"></div>
              <div className="main-content-input">
                <div>
                  <label
                    htmlFor="structure_id"
                    className="text-info font-weight-bold form-label-head w-100  required"
                  >
                    Structure type
                  </label>
                  <Select
                    value={updateDate.structure_id}
                    name="structure_id"
                    onChange={input01}
                    displayEmpty
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    input={<BootstrapInput />}
                    className="mt-0 ml-0"
                    style={{ width: "100%" }}
                  >
                    <MenuItem value="">Select Option</MenuItem>
                    {getStructuresList.map((item) => {
                      return (
                        <MenuItem value={item.structure_id}>
                          {item.structure_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="sponsor_approve"
                    className="text-info font-weight-bold form-label-head w-100  required"
                  >
                    Status
                  </label>
                  <Select
                    value={updateDate.sponsor_approve}
                    name="sponsor_approve"
                    onChange={input01}
                    displayEmpty
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    input={<BootstrapInput />}
                    className="mt-0 ml-0"
                    style={{ width: "100%" }}
                  >
                    <MenuItem value="">Select Option</MenuItem>
                    <MenuItem value="0">PENDING</MenuItem>
                    <MenuItem value="1">APPROVED</MenuItem>
                    <MenuItem value="2">REJECTED</MenuItem>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="remarks"
                    className="text-info font-weight-bold form-label-head w-100 mt-4 required"
                  >
                    Remarks
                  </label>
                  <BootstrapInput
                    name="remarks"
                    value={updateDate.remarks}
                    onChange={input01}
                    displayEmpty
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                  />
                </div>
                <div>
                  {updateDate.isLoader ? (
                    <ColorButton
                      tabIndex="0"
                      size="large"
                      className="createMt5Formloder "
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
                    </ColorButton>
                  ) : (
                    <ColorButton onClick={updatePartnership}>
                      Update
                    </ColorButton>
                  )}
                  {/* <ColorButton onClick={updatePartnership}>Update</ColorButton> */}
                </div>
              </div>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
