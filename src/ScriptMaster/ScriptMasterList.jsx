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
import DeleteIcon from "@mui/icons-material/Delete";
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
import "./ScriptMasterList.css";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import NewDate from "../common/NewDate";
import AddIcon from "@mui/icons-material/Add";
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

const ScriptMasterList = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xl");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({});
  const [checkStatus, setcheckStatus] = useState("");
  const [buttonDis, setButttonDis] = useState();
  const [resData, setResData] = useState({});

  var [viewWithdrawForm, setviewWithdrawForm] = useState({
    base_currency: "",
    lot_size: "",
    calculation: "",
    chart_mode: "",
    contract_size: "",
    digit: "",
    volume_limit: "",
    execution: "",
    expiration: "",
    filling: "",
    tick_value: "",
    hedged_margin: "",
    tick_size: "",
    gtc_mode: "",
    initial_margin: "",
    maintenance_margin: "",
    volume_limit: "",
    isin: "",
    country: "",
    industry: "",
    is_future: "",
    is_usd: "",
    margin_currency: "",
    margin_rate: [
      {
        margin_rate: "Market buy",
        initial: "",
        maintenance: "",
      },
      {
        margin_rate: "Market sell",
        initial: "",
        maintenance: "",
      },

      {
        margin_rate: "Buy limit",
        initial: "",
        maintenance: "",
      },
      {
        margin_rate: "Sell limit",
        initial: "",
        maintenance: "",
      },
      {
        margin_rate: "Buy stop",
        initial: "",
        maintenance: "",
      },
      {
        margin_rate: "Sell stop",
        initial: "",
        maintenance: "",
      },
      {
        margin_rate: "Buy stop limit",
        initial: "",
        maintenance: "",
      },
      {
        margin_rate: "Sell stop limit",
        initial: "",
        maintenance: "",
      },
    ],
    commissions: [
      {
        commission: "",
        value: "",
      },
    ],
    market_type_name: "",
    market_type_id: "",
    maximal_volume: "",
    minimal_volume: "",
    orders: "",
    profit_currency: "",
    quote_currency: "",
    script_chart_name: "",
    script_full_name: "",
    script_id: "",
    script_image: "",
    script_lot_qty: "",
    script_name: "",
    sector: "",
    sessions: [
      {
        day: "Monday",
        is_closed: "",
        quotes: {
          start_time: "",
          end_time: "",
        },
        trade: {
          start_time: "",
          end_time: "",
        },
      },
      {
        day: "Tuesday",
        is_closed: "",
        quotes: {
          start_time: "",
          end_time: "",
        },
        trade: {
          start_time: "",
          end_time: "",
        },
      },
      {
        day: "Wednesday",
        is_closed: "",
        quotes: {
          start_time: "",
          end_time: "",
        },
        trade: {
          start_time: "",
          end_time: "",
        },
      },
      {
        day: "Thursday",
        is_closed: "",
        quotes: {
          start_time: "",
          end_time: "",
        },
        trade: {
          start_time: "",
          end_time: "",
        },
      },
      {
        day: "Friday",
        is_closed: "",
        quotes: {
          start_time: "",
          end_time: "",
        },
        trade: {
          start_time: "",
          end_time: "",
        },
      },
      {
        day: "Saturday",
        is_closed: "",
        quotes: {
          start_time: "",
          end_time: "",
        },
        trade: {
          start_time: "",
          end_time: "",
        },
      },
    ],
    spread: "",
    stops_level: "",
    swap_long: "",
    swap_rates: [
      {
        day: "Monday",
        value: "",
      },
      {
        day: "Tuesday",
        value: "",
      },
      {
        day: "Wednesday",
        value: "",
      },
      {
        day: "Thursday",
        value: "",
      },
      {
        day: "Friday",
        value: "",
      },
    ],
    swap_short: "",
    swap_type: "",
    trade: "",
    usd_rate: "",
    volume_step: "",
    is_active: "",
    isLoader: false,
  });
  var ViewArray = [
    {
      label: "Name",
      keyName: "script_name",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Chart Name",
      keyName: "script_chart_name",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Full Name",
      keyName: "script_full_name",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Quote Currency",
      keyName: "quote_currency",
      type: "text",
    },
    {
      label: "Base Currency",
      keyName: "base_currency",
      type: "text",
    },
    {
      label: "USD Rate",
      keyName: "usd_rate",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Digit",
      keyName: "digit",
      type: "number",
      is_requied: "1",
    },

    {
      label: "Lot Qty",
      keyName: "script_lot_qty",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Sector",
      keyName: "sector",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Spread",
      keyName: "spread",
      type: "number",
      is_requied: "1",
    },
    {
      label: "Stops Level",
      keyName: "stops_level",
      type: "number",
      is_requied: "1",
    },
    {
      label: "Margin Currency",
      keyName: "margin_currency",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Initial Margin",
      keyName: "initial_margin",
      type: "text",
    },
    {
      label: "Maintenance Margin",
      keyName: "maintenance_margin",
      type: "text",
    },
    {
      label: "Volume Limit",
      keyName: "volume_limit",
      type: "text",
    },
    {
      label: "ISIN",
      keyName: "isin",
      type: "text",
    },
    {
      label: "Country",
      keyName: "country",
      type: "text",
    },
    {
      label: "Industry",
      keyName: "industry",
      type: "text",
    },
    {
      label: "Profit Currency",
      keyName: "profit_currency",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Calculation",
      keyName: "calculation",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Tick Size",
      keyName: "tick_size",
      type: "text",
    },
    {
      label: "Tick Value",
      keyName: "tick_value",
      type: "text",
    },
    {
      label: "Hedged Margin",
      keyName: "hedged_margin",
      type: "text",
    },
    {
      label: "Chart Mode",
      keyName: "chart_mode",
      type: "text",
      is_requied: "1",
    },
    // {
    //   label: "margin rate",
    //   keyName: "margin_rate",
    //   type: "text",
    // },
    {
      label: "Trade",
      keyName: "trade",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Execution",
      keyName: "execution",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Gtc Mode",
      keyName: "gtc_mode",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Filling",
      keyName: "filling",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Expiration",
      keyName: "expiration",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Orders",
      keyName: "orders",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Minimal Volume",
      keyName: "minimal_volume",
      type: "number",
      is_requied: "1",
    },
    {
      label: "Maximal Volume",
      keyName: "maximal_volume",
      type: "number",
      is_requied: "1",
    },
    {
      label: "Volume Step",
      keyName: "volume_step",
      type: "number",
      is_requied: "1",
    },
    {
      label: "Swap Type",
      keyName: "swap_type",
      type: "text",
      is_requied: "1",
    },
    {
      label: "Swap Long",
      keyName: "swap_long",
      type: "number",
      is_requied: "1",
    },
    {
      label: "Swap Short",
      keyName: "swap_short",
      type: "number",
      is_requied: "1",
    },

    {
      label: "Contract Size",
      keyName: "contract_size",
      type: "number",
      is_requied: "1",
    },
  ];
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
      label: "name",
      value: false,
      name: "script_name",
    },
    {
      label: "full name",
      value: false,
      name: "script_full_name",
    },
    {
      label: "market type",
      value: false,
      name: "market_type_name",
    },
    {
      label: "lot qty",
      value: false,
      name: "script_lot_qty",
    },
    {
      label: "sector",
      value: false,
      name: "sector",
    },
    {
      label: "contract size",
      value: false,
      name: "contract_size",
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
      name: "name",
      selector: (row) => {
        return <span title={row.script_name}>{row.script_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "full name",
      selector: (row) => {
        return <span title={row.script_full_name}>{row.script_full_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "sector",
      selector: (row) => {
        return <span title={row.sector}>{row.sector}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },

    {
      name: "digit",
      selector: (row) => {
        return <span title={row.digit}>{row.digit}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "Contract size",
      selector: (row) => {
        return <span title={row.contract_size}>{row.contract_size}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Spread",
      selector: (row) => {
        return <span title={row.spread}>{row.spread}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "market type",
      selector: (row) => {
        return <span title={row.market_type_name}>{row.market_type_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "lot qty",
      selector: (row) => {
        return <span title={row.script_lot_qty}>{row.script_lot_qty}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "Stops level",
      selector: (row) => {
        return <span title={row.stops_level}>{row.stops_level}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "Margin currency",
      selector: (row) => {
        return <span title={row.margin_currency}>{row.margin_currency}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Profit currency",
      selector: (row) => {
        return <span title={row.profit_currency}>{row.profit_currency}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Calculation",
      selector: (row) => {
        return <span title={row.calculation}>{row.calculation}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Chart mode",
      selector: (row) => {
        return <span title={row.chart_mode}>{row.chart_mode}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Trade",
      selector: (row) => {
        return <span title={row.trade}>{row.trade}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Execution",
      selector: (row) => {
        return <span title={row.execution}>{row.execution}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "GTC mode",
      selector: (row) => {
        return <span title={row.gtc_mode}>{row.gtc_mode}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Filling",
      selector: (row) => {
        return <span title={row.filling}>{row.filling}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Expiration",
      selector: (row) => {
        return <span title={row.expiration}>{row.expiration}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Orders",
      selector: (row) => {
        return <span title={row.orders}>{row.orders}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Minimal volume",
      selector: (row) => {
        return <span title={row.minimal_volume}>{row.minimal_volume}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "Maximal volume",
      selector: (row) => {
        return <span title={row.maximal_volume}>{row.maximal_volume}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "Volume step",
      selector: (row) => {
        return <span title={row.volume_step}>{row.volume_step}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "Swap type",
      selector: (row) => {
        return <span title={row.swap_type}>{row.swap_type}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Swap Long",
      selector: (row) => {
        return <span title={row.swap_long}>{row.swap_long}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Swap short",
      selector: (row) => {
        return <span title={row.swap_short}>{row.swap_short}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
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
              id={`actionButton_${row.script_id}`}
              aria-controls={open ? `basic-menu-${row.script_id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleContextClick(event, row.script_id)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.script_id}`}
              anchorEl={openTableMenus[row.script_id]}
              open={Boolean(openTableMenus[row.script_id])}
              onClose={(event) => handleContextClose(row.script_id)}
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
                    var sessions = [];
                    var commissions = [];
                    var margin_rate = [];
                    var swap_rates = [];
                    row.sessions.map((item, map) => {
                      sessions = [...sessions, item];
                    });
                    row.commissions.map((item, map) => {
                      commissions = [...commissions, item];
                    });
                    row.margin_rate.map((item, map) => {
                      margin_rate = [...margin_rate, item];
                    });
                    row.swap_rates.map((item, map) => {
                      swap_rates = [...swap_rates, item];
                    });
                    viewWithdrawForm = { ...row };
                    viewWithdrawForm.sessions = JSON.parse(
                      JSON.stringify(row.sessions)
                    );
                    viewWithdrawForm.margin_rate = JSON.parse(
                      JSON.stringify(row.margin_rate)
                    );
                    viewWithdrawForm.commissions = JSON.parse(
                      JSON.stringify(row.commissions)
                    );
                    viewWithdrawForm.swap_rates = JSON.parse(
                      JSON.stringify(row.swap_rates)
                    );

                    setviewWithdrawForm({ ...viewWithdrawForm });
                    setinput1infoTrue({
                      item_brand: false,
                    });
                    setDialogTitle("Edit Script Master");
                    setOpen(true);

                    handleContextClose(row.script_id);
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
                    actionMenuPopup(event, row.script_id, "reject")
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
    param.append("action", "delete_script_master");

    param.append("script_id", id);
    await axios
      .post(`${Url}/ajaxfiles/script_master_manage.php`, param)
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
    if (dialogTitle == "View Script Master") {
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
      dialogTitle == "Edit Script Master" ||
      dialogTitle == "Add Script Master"
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
                {dialogTitle == "Add Script Master" ? "Add" : "Update"}
              </Button>
            )}
          </div>
        </>
      );
    }
  };

  const manageContent = () => {
    if (dialogTitle == "View Script Master") {
      return (
        <div>
          <div className="view-commission-content-section">
            {ViewArray.map((item, index) => {
              if (viewWithdrawForm[item.keyName]) {
                return (
                  <div className="view-content-element" key={index}>
                    <h6
                      className="element-title"
                      style={{ textTransform: "capitalize" }}
                    >
                      {item.label}
                    </h6>
                    <div className=" element-content">
                      {viewWithdrawForm[item.keyName]}
                    </div>
                  </div>
                );
              }
            })}
            <div className="view-content-element">
              <h6
                className="element-title"
                style={{ textTransform: "capitalize" }}
              >
                Script Image
              </h6>
              <div className="element-content">
                {/* <a
                  href={viewWithdrawForm.script_image.image_url}
                  target="_blank"
                >
                  <img
                    src={viewWithdrawForm.script_image.image_url}
                    alt=""
                    style={{ width: "200px" }}
                  />
                </a> */}
                <CustomImageModal
                  image={viewWithdrawForm.script_image.image_url}
                  isIcon={false}
                  className="scriptimgwidth"
                />
              </div>
            </div>
          </div>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <div>
                <div>
                  <h6
                    className="element-title"
                    style={{ fontWeight: "700", marginTop: "10px" }}
                  >
                    Sessions:-
                  </h6>
                </div>
                <table className="tableforriskscroe w-100">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Quotes</th>
                      <th>Trade</th>

                      <th>Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewWithdrawForm.sessions.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.day}</td>
                          <td>
                            {item.quotes.start_time} - {item.quotes.end_time}
                          </td>
                          <td>
                            {item.trade.start_time} - {item.trade.end_time}
                          </td>
                          <td>{item.is_closed == "0" ? "No" : "Yes"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Grid>
            <Grid item md={6}>
              <div>
                <div>
                  <h6
                    className="element-title"
                    style={{ fontWeight: "700", marginTop: "10px" }}
                  >
                    Margin Rate:-
                  </h6>
                </div>
                <table className="tableforriskscroe w-100">
                  <thead>
                    <tr>
                      <th>Margin Rate</th>
                      <th>Initial</th>
                      <th>Maintenance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewWithdrawForm.margin_rate.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.margin_rate}</td>
                          <td>{item.initial}</td>
                          <td>{item.maintenance}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Grid>
            <Grid item md={6}>
              <div>
                <div>
                  <h6
                    className="element-title"
                    style={{ fontWeight: "700", marginTop: "10px" }}
                  >
                    Swap Rates:-
                  </h6>
                </div>
                <table className="tableforriskscroe w-100">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewWithdrawForm.swap_rates.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.day}</td>
                          <td>{item.value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Grid>
            <Grid item md={6}>
              <div>
                <div>
                  <h6
                    className="element-title"
                    style={{ fontWeight: "700", marginTop: "10px" }}
                  >
                    Commissions:-
                  </h6>
                </div>
                <table className="tableforriskscroe w-100">
                  <thead>
                    <tr>
                      <th>Commission</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewWithdrawForm.commissions.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.commission}</td>
                          <td>{item.value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    } else if (
      dialogTitle == "Edit Script Master" ||
      dialogTitle == "Add Script Master"
    ) {
      return (
        <>
          <div>
            <div className="scriptmasterTextFild">
              {ViewArray.map((item, index) => {
                return (
                  <TextField
                    id={`standard-basic${index}`}
                    label={item.label}
                    variant="standard"
                    sx={{ width: "100%" }}
                    name={item.keyName}
                    value={viewWithdrawForm[item.keyName]}
                    onChange={(e) => {
                      if (item.type == "number") {
                        if (!isNaN(Number(e.target.value))) {
                          input1(e);
                        } else if (
                          e.target.value == "" ||
                          e.target.value == 0
                        ) {
                          input1(e);
                        }
                      } else {
                        input1(e);
                      }
                    }}
                    onBlur={input1trueFalse}
                    error={
                      viewWithdrawForm[item.keyName] == "" &&
                      input1infoTrue[item.keyName] &&
                      item.is_requied == "1"
                        ? true
                        : false
                    }
                    helperText={
                      viewWithdrawForm[item.keyName] == "" &&
                      input1infoTrue[item.keyName] &&
                      item.is_requied == "1"
                        ? `${item.label} is required`
                        : ""
                    }
                    disabled={buttonDis == 1 ? true : false}
                  />
                );
              })}
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  viewWithdrawForm.market_type_id == "" &&
                  input1infoTrue.market_type_id
                    ? true
                    : false
                }
              >
                <InputLabel>Market Type</InputLabel>
                <Select
                  value={viewWithdrawForm.market_type_id}
                  name="market_type_id"
                  onChange={input1}
                  onBlur={input1trueFalse}
                  disabled={buttonDis == 1 ? true : false}
                >
                  {resData
                    ? resData.market_type_list.map((item, index) => {
                        return (
                          <MenuItem value={item.market_type_id}>
                            {item.market_type_name}
                          </MenuItem>
                        );
                      })
                    : ""}
                  {/* <MenuItem value="1">Active</MenuItem> */}
                  {/* <MenuItem value="0">Inactive </MenuItem> */}
                </Select>
                {viewWithdrawForm.market_type_id == "" &&
                input1infoTrue.market_type_id ? (
                  <FormHelperText>Market Type is required</FormHelperText>
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
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  viewWithdrawForm.is_usd == "" && input1infoTrue.is_usd
                    ? true
                    : false
                }
              >
                <InputLabel>Usd</InputLabel>
                <Select
                  value={viewWithdrawForm.is_usd}
                  name="is_usd"
                  onChange={input1}
                  onBlur={input1trueFalse}
                  disabled={buttonDis == 1 ? true : false}
                >
                  <MenuItem value="1">Yes</MenuItem>
                  <MenuItem value="0">No</MenuItem>
                </Select>
                {viewWithdrawForm.is_usd == "" && input1infoTrue.is_usd ? (
                  <FormHelperText>USD is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={
                  viewWithdrawForm.is_future == "" && input1infoTrue.is_future
                    ? true
                    : false
                }
              >
                <InputLabel>Future</InputLabel>
                <Select
                  value={viewWithdrawForm.is_future}
                  name="is_future"
                  onChange={input1}
                  onBlur={input1trueFalse}
                  disabled={buttonDis == 1 ? true : false}
                >
                  <MenuItem value="1">Yes</MenuItem>
                  <MenuItem value="0">No </MenuItem>
                </Select>
                {viewWithdrawForm.is_future == "" &&
                input1infoTrue.is_future ? (
                  <FormHelperText>Future is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <div className="sript-image">
                {viewWithdrawForm.script_image == "" ? (
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
                          viewWithdrawForm.script_image = e.target.files[0];
                          setviewWithdrawForm({ ...viewWithdrawForm });
                        } else {
                          toast.error(
                            "Only JPG, JPEG and PNG types are accepted."
                          );
                        }
                      }}
                    />
                    <Button variant="contained" component="span">
                      <i className="material-icons">backup</i>&nbsp;Script Image
                    </Button>
                  </label>
                ) : (
                  <div className="position-relative">
                    <CloseIcon
                      className="remove-script-image"
                      onClick={() => {
                        viewWithdrawForm.script_image = "";
                        setviewWithdrawForm({ ...viewWithdrawForm });
                      }}
                    />
                    <div
                      style={{
                        padding: "10px",
                        boxShadow:
                          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                      }}
                    >
                      <span>
                        {viewWithdrawForm.script_image
                          ? viewWithdrawForm.script_image.name
                          : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <div>
                  <div>
                    <h6
                      className="element-title"
                      style={{ fontWeight: "700", marginTop: "10px" }}
                    >
                      Sessions:-
                    </h6>
                  </div>
                  <table className="tableforriskscroe w-100 closeHovertable">
                    <thead>
                      <tr>
                        <th>Sessions</th>
                        <th>Quotes</th>
                        <th>Trade</th>
                        <th>Close</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewWithdrawForm.sessions.map((item, index) => {
                        return (
                          <tr>
                            <td>{item.day}</td>
                            <td>
                              <TextField
                                id={`standard-basis3${index}`}
                                label="Start Time"
                                variant="standard"
                                type="time"
                                // sx={{ width: "100%" }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={item.quotes.start_time}
                                onChange={(e) => {
                                  viewWithdrawForm.sessions[
                                    index
                                  ].quotes.start_time = e.target.value;
                                  setviewWithdrawForm({ ...viewWithdrawForm });
                                }}
                              />
                              <TextField
                                id={`standard-basis3${index}`}
                                label="End Time"
                                variant="standard"
                                type="time"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                // sx={{ width: "100%" }}
                                value={item.quotes.end_time}
                                onChange={(e) => {
                                  viewWithdrawForm.sessions[
                                    index
                                  ].quotes.end_time = e.target.value;
                                  setviewWithdrawForm({ ...viewWithdrawForm });
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                id={`standard-basis3${index}`}
                                label="Start Time"
                                variant="standard"
                                type="time"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                // sx={{ width: "100%" }}
                                value={item.trade.start_time}
                                onChange={(e) => {
                                  viewWithdrawForm.sessions[
                                    index
                                  ].trade.start_time = e.target.value;
                                  setviewWithdrawForm({ ...viewWithdrawForm });
                                }}
                              />
                              <TextField
                                id={`standard-basis3${index}`}
                                label="End Time"
                                variant="standard"
                                type="time"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                // sx={{ width: "100%" }}
                                value={item.trade.end_time}
                                onChange={(e) => {
                                  viewWithdrawForm.sessions[
                                    index
                                  ].trade.end_time = e.target.value;
                                  setviewWithdrawForm({ ...viewWithdrawForm });
                                }}
                              />
                            </td>
                            <td>
                              <FormControl
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{ width: "100%",minWidth:"60px" }}
                              >
                                <InputLabel>Close</InputLabel>
                                <Select
                                  value={item.is_closed}
                                  name="is_closed"
                                  onChange={(e) => {
                                    viewWithdrawForm.sessions[index].is_closed =
                                      e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  }}
                                  onBlur={input1trueFalse}
                                  disabled={buttonDis == 1 ? true : false}
                                >
                                  <MenuItem value="1">Active</MenuItem>
                                  <MenuItem value="0">Inactive </MenuItem>
                                </Select>
                              </FormControl>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <div>
                    <h6
                      className="element-title"
                      style={{ fontWeight: "700", marginTop: "10px" }}
                    >
                      Margin Rate:-
                    </h6>
                  </div>
                  <table className="tableforriskscroe w-100 closeHovertable">
                    <thead>
                      <tr>
                        <th>Margin Rate</th>
                        <th>Initial</th>
                        <th>Maintenance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewWithdrawForm.margin_rate.map((item, index) => {
                        return (
                          <tr>
                            <td>{item.margin_rate}</td>
                            <td>
                              <TextField
                                id={`standard-basic311${index}`}
                                // label={item.label}
                                variant="standard"
                                // sx={{ width: "100%" }}
                                value={item.initial}
                                onChange={(e) => {
                                  if (!isNaN(Number(e.target.value))) {
                                    viewWithdrawForm.margin_rate[
                                      index
                                    ].initial = e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    viewWithdrawForm.margin_rate[
                                      index
                                    ].initial = e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  }
                                }}
                                // onBlur={input1trueFalse}
                                // error={
                                //   viewWithdrawForm[item.keyName] == "" &&
                                //   input1infoTrue[item.keyName]
                                //     ? true
                                //     : false
                                // }
                                // helperText={
                                //   viewWithdrawForm[item.keyName] == "" &&
                                //   input1infoTrue[item.keyName]
                                //     ? `${item.label} is required`
                                //     : ""
                                // }
                                // disabled={buttonDis == 1 ? true : false}
                              />
                            </td>
                            <td>
                              <TextField
                                id={`standard-basic311${index}`}
                                // label={item.label}
                                variant="standard"
                                // sx={{ width: "100%" }}
                                value={item.maintenance}
                                onChange={(e) => {
                                  if (!isNaN(Number(e.target.value))) {
                                    viewWithdrawForm.margin_rate[
                                      index
                                    ].maintenance = e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    viewWithdrawForm.margin_rate[
                                      index
                                    ].maintenance = e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  }
                                }}
                                // onBlur={input1trueFalse}
                                // error={
                                //   viewWithdrawForm[item.keyName] == "" &&
                                //   input1infoTrue[item.keyName]
                                //     ? true
                                //     : false
                                // }
                                // helperText={
                                //   viewWithdrawForm[item.keyName] == "" &&
                                //   input1infoTrue[item.keyName]
                                //     ? `${item.label} is required`
                                //     : ""
                                // }
                                // disabled={buttonDis == 1 ? true : false}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <div>
                    <h6
                      className="element-title"
                      style={{ fontWeight: "700", marginTop: "10px" }}
                    >
                      Swap Rates:-
                    </h6>
                  </div>
                  <table className="tableforriskscroe w-100">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewWithdrawForm.swap_rates.map((item, index) => {
                        return (
                          <tr>
                            <td>{item.day}</td>
                            {/* <td>{item.value} */}
                            <td>
                              <TextField
                                id={`standard-basic311w${index}`}
                                // label={item.label}
                                variant="standard"
                                // sx={{ width: "100%" }}
                                value={item.value}
                                onChange={(e) => {
                                  if (!isNaN(Number(e.target.value))) {
                                    viewWithdrawForm.swap_rates[index].value =
                                      e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  } else if (
                                    e.target.value == "" ||
                                    e.target.value == 0
                                  ) {
                                    viewWithdrawForm.swap_rates[index].value =
                                      e.target.value;
                                    setviewWithdrawForm({
                                      ...viewWithdrawForm,
                                    });
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h6
                      className="element-title"
                      style={{ fontWeight: "700", marginTop: "10px" }}
                    >
                      Commissions:-
                    </h6>
                    {/* <ColorButton
                      sx={{ padding: "0px 13px" }}
                      onClick={() => {
                        viewWithdrawForm.commissions.push({
                          commission: "",
                          value: "",
                        });
                        setviewWithdrawForm({ ...viewWithdrawForm });
                      }}
                    >
                      <AddIcon />
                    </ColorButton> */}
                  </div>
                  <table className="tableforriskscroe w-100">
                    <thead>
                      <tr>
                        <th>Commission</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewWithdrawForm.commissions.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              <TextField
                                id={`standard-basicc${index}`}
                                // label={item.label}
                                variant="standard"
                                // sx={{ width: "100%" }}
                                value={item.commission}
                                onChange={(e) => {
                                  viewWithdrawForm.commissions[
                                    index
                                  ].commission = e.target.value;
                                  setviewWithdrawForm({
                                    ...viewWithdrawForm,
                                  });
                                }}
                              />
                            </td>
                            <td>
                              {" "}
                              <TextField
                                id={`standard-basicc${index}`}
                                // label={item.label}
                                variant="standard"
                                // sx={{ width: "100%" }}
                                value={item.value}
                                onChange={(e) => {
                                  viewWithdrawForm.commissions[index].value =
                                    e.target.value;
                                  setviewWithdrawForm({
                                    ...viewWithdrawForm,
                                  });
                                }}
                              />
                            </td>
                            {/* <td>
                              <DeleteIcon
                                onClick={() => {
                                  viewWithdrawForm.commissions.splice(index, 1);
                                  setviewWithdrawForm({ ...viewWithdrawForm });
                                }}
                              />
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Grid>
            </Grid>
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
    var arrayError = "";
    var sessionsError = "";
    var marginRateError = "";
    var swapRateError = "";
    const error = () => {
      var test = "";
      ViewArray.map((item, index) => {
        if (
          viewWithdrawForm[item.keyName] == "" &&
          test == "" &&
          item.is_requied == "1"
        ) {
          test = item;
          arrayError = item;
        }
      });
      return test;
    };
    const marginRateArrayError = () => {
      var test = "";
      viewWithdrawForm.margin_rate.map((item, index) => {
        if (item.initial == "" && marginRateError == "") {
          test = item;
          marginRateError = `${item.margin_rate} Initial is required`;
        } else if (item.maintenance == "" && marginRateError == "") {
          test = item;
          marginRateError = `${item.margin_rate} Maintenance is required`;
        }
      });
      return test;
    };
    const sessionsArrayError = () => {
      var test = "";
      viewWithdrawForm.sessions.map((item, index) => {
        if (
          item.quotes.start_time == "" &&
          sessionsError == "" &&
          item.is_closed != 0
        ) {
          sessionsError = `${item.day} Quotes Start Time is required`;
          test = sessionsError;
        } else if (
          item.quotes.end_time == "" &&
          sessionsError == "" &&
          item.is_closed != 0
        ) {
          sessionsError = `${item.day} Quotes End Time is required`;
          test = sessionsError;
        } else if (
          item.trade.start_time == "" &&
          sessionsError == "" &&
          item.is_closed != 0
        ) {
          sessionsError = `${item.day} Trade Start Time is required`;
          test = sessionsError;
        } else if (
          item.trade.end_time == "" &&
          sessionsError == "" &&
          item.is_closed != 0
        ) {
          sessionsError = `${item.day} Trade End Time is required`;
          test = sessionsError;
        } else if (item.is_closed == "" && sessionsError == "") {
          sessionsError = `${item.day} Close is required`;
          test = sessionsError;
        }
      });
      return test;
    };
    const swapRateArrayError = () => {
      var test = "";
      viewWithdrawForm.swap_rates.map((item, index) => {
        if (item.value == "" && swapRateError == "") {
          swapRateError = `${item.day} Value is required`;
          test = item;
        }
      });
      return test;
    };
    if (error()) {
      toast.error(`${arrayError.label} is required`);
    } else if (viewWithdrawForm.market_type_id == "") {
      toast.error("Market Type is required");
    } else if (viewWithdrawForm.is_active == "") {
      toast.error("Status is required");
    } else if (viewWithdrawForm.is_usd == "") {
      toast.error("USD is required");
    } else if (viewWithdrawForm.is_future == "") {
      toast.error("Future is required");
    } else if (viewWithdrawForm.script_image == "") {
      toast.error("Script Image is required");
    } else if (sessionsArrayError()) {
      toast.error(sessionsError);
    } else if (marginRateArrayError()) {
      toast.error(marginRateError);
    } else if (swapRateArrayError()) {
      toast.error(swapRateError);
    } else if (viewWithdrawForm.commissions[0].commission == "") {
      toast.error("Commission is required");
    } else if (viewWithdrawForm.commissions[0].value == "") {
      toast.error("Value is required");
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
      if (viewWithdrawForm.script_id == "") {
        param.append("action", "add_script_master");
      } else {
        param.append("action", "edit_script_master");
        param.append("script_id", viewWithdrawForm.script_id);
      }
      ViewArray.map((item, index) => {
        param.append(item.keyName, viewWithdrawForm[item.keyName]);
      });
      param.append("market_type_id", viewWithdrawForm.market_type_id);

      param.append("is_active", viewWithdrawForm.is_active);
      param.append("is_usd", viewWithdrawForm.is_usd);
      param.append("is_future", viewWithdrawForm.is_future);
      if (!viewWithdrawForm.script_image.image_url) {
        param.append("script_image", viewWithdrawForm.script_image);
      }
      param.append("margin_rate", JSON.stringify(viewWithdrawForm.margin_rate));
      param.append("sessions", JSON.stringify(viewWithdrawForm.sessions));
      param.append("swap_rates", JSON.stringify(viewWithdrawForm.swap_rates));
      param.append("commissions", JSON.stringify(viewWithdrawForm.commissions));
      await axios
        .post(`${Url}/ajaxfiles/script_master_manage.php`, param)
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
    handleContextClose(id.script_id);
    if (id.status == "1") {
      setButttonDis("1");
    } else {
      setButttonDis("0");
    }
    setviewWithdrawForm(id);
    setDialogTitle("View Script Master");
    setOpen(true);
  };
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Script Master</p>
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
                          base_currency: "",
                          lot_size: "",
                          calculation: "",
                          chart_mode: "",
                          contract_size: "",
                          digit: "",
                          volume_limit: "",
                          execution: "",
                          expiration: "",
                          filling: "",
                          tick_value: "",
                          hedged_margin: "",
                          tick_size: "",
                          gtc_mode: "",
                          initial_margin: "",
                          maintenance_margin: "",
                          volume_limit: "",
                          isin: "",
                          country: "",
                          industry: "",
                          is_future: "",
                          is_usd: "",
                          margin_currency: "",
                          margin_rate: [
                            {
                              margin_rate: "Market buy",
                              initial: "",
                              maintenance: "",
                            },
                            {
                              margin_rate: "Market sell",
                              initial: "",
                              maintenance: "",
                            },

                            {
                              margin_rate: "Buy limit",
                              initial: "",
                              maintenance: "",
                            },
                            {
                              margin_rate: "Sell limit",
                              initial: "",
                              maintenance: "",
                            },
                            {
                              margin_rate: "Buy stop",
                              initial: "",
                              maintenance: "",
                            },
                            {
                              margin_rate: "Sell stop",
                              initial: "",
                              maintenance: "",
                            },
                            {
                              margin_rate: "Buy stop limit",
                              initial: "",
                              maintenance: "",
                            },
                            {
                              margin_rate: "Sell stop limit",
                              initial: "",
                              maintenance: "",
                            },
                          ],
                          commissions: [
                            {
                              commission: "",
                              value: "",
                            },
                          ],
                          market_type_name: "",
                          market_type_id: "",
                          maximal_volume: "",
                          minimal_volume: "",
                          orders: "",
                          profit_currency: "",
                          quote_currency: "",
                          script_chart_name: "",
                          script_full_name: "",
                          script_id: "",
                          script_image: "",
                          script_lot_qty: "",
                          script_name: "",
                          sector: "",
                          sessions: [
                            {
                              day: "Monday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                            {
                              day: "Tuesday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                            {
                              day: "Wednesday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                            {
                              day: "Thursday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                            {
                              day: "Friday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                            {
                              day: "Saturday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                            {
                              day: "Sunday",
                              is_closed: "",
                              quotes: {
                                start_time: "",
                                end_time: "",
                              },
                              trade: {
                                start_time: "",
                                end_time: "",
                              },
                            },
                          ],
                          spread: "",
                          stops_level: "",
                          swap_long: "",
                          swap_rates: [
                            {
                              day: "Monday",
                              value: "",
                            },
                            {
                              day: "Tuesday",
                              value: "",
                            },
                            {
                              day: "Wednesday",
                              value: "",
                            },
                            {
                              day: "Thursday",
                              value: "",
                            },
                            {
                              day: "Friday",
                              value: "",
                            },
                          ],
                          swap_short: "",
                          swap_type: "",
                          trade: "",
                          usd_rate: "",
                          volume_step: "",
                          is_active: "",
                          isLoader: false,
                        });
                        setinput1infoTrue({});
                        setDialogTitle("Add Script Master");
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
                          url={`${Url}/datatable/script_master_list.php`}
                          column={columns}
                          sort="0"
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

export default ScriptMasterList;
