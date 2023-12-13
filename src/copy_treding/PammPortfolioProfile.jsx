import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SouthEastSharpIcon from "@mui/icons-material/SouthEastSharp";
import GetAppSharpIcon from "@mui/icons-material/GetAppSharp";
import NorthEastSharpIcon from "@mui/icons-material/NorthEastSharp";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import "./pamm.css";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@emotion/react";
import Chart from "react-apexcharts";
import { IsApprove, Url } from "../global";
import { BootstrapInput } from "../common/CustomElement";
import CommonTable from "../common/CommonTable";

const GreenButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ff0000"),
  backgroundColor: "#3D9730",
  textTransform: "initial",
  fontSize: "13px",
  padding: "15px 22px",
  "&:hover": {
    backgroundColor: "#068017",
  },
}));
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
      className="panding-left-right-0 tabpanel"
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const PammPortfolioProfile = () => {
  const theme = useTheme();
  const [fullWidth, setFullWidth] = useState(true);
  const navigate = useNavigate();
  let { id, portfolioUserId } = useParams();
  const [isLoderButton, setIsLoaderButton] = useState(false);
  const [prefrence, setPrefrence] = useState({});
  const [tradeParam, setTardeParam] = useState({
    user_id: portfolioUserId,
  });
  const [positionParam, setPositionParam] = useState({
    user_id: portfolioUserId,
  });
  const [investmentParam, setInvestmentParam] = useState({
    user_id: portfolioUserId,
  });
  const [withdrawParam, setWithdrawParam] = useState({
    user_id: portfolioUserId,
  });
  const [commissionParam, setCommissionParam] = useState({
    user_id: portfolioUserId,
  });
  const [info, setInfo] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [userId, setUserId] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [dialogTitle, setDialogTitle] = useState("");
  var [moneyManagerListMenu, setMoneyManagerListMenu] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [year, setYear] = useState("");
  const [treadShow, setTreadShow] = useState(true);
  const [datatableLoder, setDatatableLoder] = useState(false);
  const [createPortfolioForm, setCreatePortfolioForm] = useState({
    isLoader: false,
    portfolio_name: "",
    mm_mt5_acc_id: "",
    investment_months: "",
  });

  var [dailySalesOptions, setdailySalesOptions] = useState({
    series: [
      {
        name: "P&L",
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#3d9730"],
    stroke: {
      curve: "smooth",
    },

    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [],
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    filterData.start_date = "";
    filterData.end_date = "";
    setFilterData({ ...filterData });
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClose = () => {
    setOpen(false);
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
      param.append("user_id", portfolioUserId);
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
            toast.success(res.data.message);
            setOpen(false);
          }
        });
    }
  };

  const getMoneyManagerList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", portfolioUserId);
    param.append("action", "available_money_manager");

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
          moneyManagerListMenu = res.data.data;
          setMoneyManagerListMenu([...moneyManagerListMenu]);
        }
      });
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

  const manageContent = () => {
    if (dialogTitle == "Create Portfolio") {
      return (
        <div>
          <div>
            <TextField
              className="input-font-small"
              label="Name"
              variant="standard"
              value={createPortfolioForm.portfolio_name}
              onChange={createPortfolioInput}
              sx={{ width: "100%" }}
              name="portfolio_name"
            />
          </div>
          <br />
          <div>
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel>Money Manager</InputLabel>
              <Select
                label
                className="select-font-small"
                name="mm_mt5_acc_id"
                value={createPortfolioForm.mm_mt5_acc_id}
                onChange={createPortfolioInput}
              >
                {moneyManagerListMenu.map((item) => {
                  return (
                    <MenuItem value={item.mm_mt5_acc_id}>
                      {item.mt5_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <br />
          <div>
            <TextField
              className="input-font-small"
              label="Investment Months"
              type="text"
              variant="standard"
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  createPortfolioInput(e);
                }
              }}
              sx={{ width: "100%" }}
              name="investment_months"
            />
          </div>
        </div>
      );
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Create Portfolio") {
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
              className="btn-gradient btn-success"
              onClick={createPortfolioFormSubmit}
            >
              Create
            </Button>
          )}
        </div>
      );
    }
  };

  const changeYear = (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", portfolioUserId);
    param.append("pid", id);
    param.append("action", "view_portfolio_details");
    param.append("filter_profit_years", prop);

    setIsLoaderButton(true);

    axios
      .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          navigate("/");
          return;
        }
        dailySalesOptions.series[0].data = res.data.data.get_monthly_pnl_data.y;
        dailySalesOptions.xaxis.categories =
          res.data.data.get_monthly_pnl_data.x;
        setdailySalesOptions({ ...dailySalesOptions });
        setIsLoaderButton(false);
      });
  };

  const columnWithdraw = [
    {
      name: "sr no",
      minWidth: "72px",
      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "date",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "investor Name",
      selector: (row) => {
        return <span title={row.investor_name}>{row.investor_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Account Name",
      selector: (row) => {
        return <span title={row.mt5_name}>{row.mt5_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "portfolio id",
      selector: (row) => {
        return <span title={row.portfolio_id}>{row.portfolio_id}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "portfolio name",
      selector: (row) => {
        return <span title={row.portfolio_name}>{row.portfolio_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "amount",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "remarks",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
  ];

  const columnInvestment = [
    {
      name: "sr no",
      minWidth: "72px",
      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "date",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "investor Name",
      selector: (row) => {
        return <span title={row.investor_name}>{row.investor_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Account Name",
      selector: (row) => {
        return <span title={row.mt5_name}>{row.mt5_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "portfolio id",
      selector: (row) => {
        return <span title={row.portfolio_id}>{row.portfolio_id}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "portfolio name",
      selector: (row) => {
        return <span title={row.portfolio_name}>{row.portfolio_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];

  const columnTrade = [
    {
      name: "Portfolio Id",
      selector: (row) => {
        return <span title={row.portfolio_id}>{row.portfolio_id}</span>;
      },
      wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Portfolio Name",
      selector: (row) => {
        return <span title={row.portfolio_name}>{row.portfolio_name}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Date",
      selector: (row) => {
        return <span title={row.trade_datetime}>{row.trade_datetime}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.6,
    },
    {
      name: "Symbol",
      selector: (row) => {
        return <span title={row.symbol}>{row.symbol}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <span
            title={row.action}
            style={{ color: row.action == "Buy" ? "green" : "red" }}
          >
            {row.action}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Price",
      selector: (row) => {
        return <span title={row.price}>{row.price}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },

    {
      name: "Profit",
      selector: (row) => {
        return (
          <span
            title={row.profit}
            style={{ color: row.profit >= 0 ? "green" : "red" }}
          >
            {row.profit}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Lot",
      selector: (row) => {
        return <span title={row.volume}>{row.volume}</span>;
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];

  const columnopen = [
    {
      name: "LOGIN",
      selector: (row) => {
        return <span>{row.trade_login}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "SYMBOL",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "TRADE NO",
      selector: (row) => {
        return <span title={row.trade_no}>{row.trade_no}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.trade_time}>{row.trade_time}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "TYPE",
      selector: (row) => {
        return <span title={row.trade_type}>{row.trade_type}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: "TRADE VOLUME",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "TRADE OPEN RATE",
      selector: (row) => {
        return <span title={row.trade_open_rate}>{row.trade_open_rate}</span>;
      },
      reorder: true,
      wrap: true,
      grow: 0.1,
    },
    {
      name: "S/L",
      selector: (row) => {
        return <span title={row.trade_s_l}>{row.trade_s_l}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "T/P",
      selector: (row) => {
        return <span title={row.trade_t_p}>{row.trade_t_p}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "CURRENT PRICE",
      selector: (row) => {
        return <span title={row.trade_curr_rate}>{row.trade_curr_rate}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "PROFIT",
      selector: (row) => {
        return <span title={row.trade_profit}>{row.trade_profit}</span>;
      },
      reorder: true,
      sortable: true,
      wrap: true,
      grow: 0.5,
    },
  ];

  useEffect(() => {
    filterData.pid = id;
    setFilterData({ ...filterData });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", portfolioUserId);
    param.append("pid", id);
    param.append("action", "view_portfolio_details");

    axios
      .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          navigate("/");
          return;
        }

        setInfo(res.data.data);
        createPortfolioForm.mm_mt5_acc_id = id;
        setCreatePortfolioForm({ ...createPortfolioForm });
        setPrefrence(res.data.data);
        dailySalesOptions.series[0].data = res.data.data.get_monthly_pnl_data.y;
        dailySalesOptions.xaxis.categories =
          res.data.data.get_monthly_pnl_data.x;
        setdailySalesOptions({ ...dailySalesOptions });
        setYear(res.data.data.filter_profit_years[0]);
        setIsLoader(false);
      });
  }, []);
  toast.configure();

  return (
    <div className="money-manager-profile-section portfolio-profile">
      <div className="px-md-5">
        <Grid
          container
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Grid item md={12} lg={10}>
            <div>
              {isLoader ? (
                <div className="loader-section">
                  <svg class="spinner" viewBox="0 0 50 50">
                    <circle
                      class="path"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      strokeWidth="5"
                    ></circle>
                  </svg>
                </div>
              ) : (
                <div className="master">
                  <div className="master__wrapper">
                    <div className="master__inner">
                      <div className="money-manager-profile-view-section">
                        <Grid container spacing={1}>
                          <Grid item md={6}>
                            <div className="btn_back-section">
                              <Button
                                variant="text"
                                onClick={() => navigate(-1)}
                              >
                                <i className="material-icons">arrow_back_ios</i>{" "}
                                Go Back
                              </Button>
                            </div>
                            <div className="master__section">
                              <div className="m__profile">
                                <div className="m__profile__preview">
                                  <div className="m__profile__preview-head">
                                    <div className="m__profile__image">
                                      <div className="m__profile__image-avatar">
                                        <div className="m__profile__country">
                                          <img
                                            src="https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg"
                                            alt=""
                                            className="m__country-flag"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="m__profile__about">
                                      <div className="m__profile__name">
                                        {info.portfolio_name}
                                      </div>
                                      <div className="m__profile__id">
                                        {info.portfolio_id}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="profile__preview-nav">
                                    <div className="portfolio-content-section">
                                      <div className="withdrawal-section">
                                        <span>Investment</span>
                                        <span className="text-bold-700">
                                          ${info.my_investment}
                                        </span>
                                      </div>
                                      <div className="withdrawal-section">
                                        <span>Current Value</span>
                                        <span
                                          className="text-bold-700"
                                          style={{
                                            color:
                                              Number(info.my_investment) <=
                                              Number(info.current_value)
                                                ? "green"
                                                : "red",
                                          }}
                                        >
                                          ${info.current_value}
                                        </span>
                                      </div>
                                      <div className="withdrawal-section">
                                        <span>PNL</span>
                                        <span
                                          className="text-bold-700"
                                          style={{
                                            color:
                                              Number(info.pnl) >= 0
                                                ? "green"
                                                : "red",
                                          }}
                                        >
                                          ${info.pnl}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="portfolio-content-section">
                                      <div className="withdrawal-section">
                                        <span>Return %</span>
                                        <span
                                          className="text-bold-700"
                                          style={{
                                            color:
                                              Number(info.return_percentage) >=
                                              0
                                                ? "green"
                                                : "red",
                                          }}
                                        >
                                          {info.return_percentage}%
                                        </span>
                                      </div>
                                      <div className="withdrawal-section">
                                        <span>Floating</span>
                                        <span
                                          className="text-bold-700"
                                          style={{
                                            color:
                                              Number(info.current_floating) >= 0
                                                ? "green"
                                                : "red",
                                          }}
                                        >
                                          {info.current_floating}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="third-section"></div>
                                    {/* <div className="m__profile__ct-start-button">
                                                                    <GreenButton
                                                                        className="m__ct-start-button"
                                                                        onClick={(e) => {
                                                                            setMaxWidth("sm");
                                                                            setDialogTitle("Create Portfolio");
                                                                            getMoneyManagerList();
                                                                            setOpen(true);
                                                                        }}
                                                                    >
                                                                        <div className="m__ct-start-button__main-text">
                                                                            Create Portfolio
                                                                        </div>
                                                                    </GreenButton>
                                                                </div>
                                                                <div className="m__profile__min-invest">
                                                                    Minimum Investment
                                                                    <span>${info.minimum_deposit_amount}</span>
                                                                </div>
                                                                <div className="m__profile__min-invest">
                                                                    Fees Percentage
                                                                    <span>{info.fees_percentage}%</span>
                                                                </div> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Grid>
                          <Grid item md={6} sx={{ margin: "auto" }}>
                            <div className="master__row">
                              <div className="master__section_performance w-100">
                                <div className="master__performance">
                                  <div className="performance">
                                    <div
                                      data-v-2ce223c0=""
                                      className="performance__head _black _bold _medium"
                                    >
                                      Account Details
                                    </div>
                                    <div className="performance__periods">
                                      <div className="performance__period">
                                        <div className="performance__period-info">
                                          <div
                                            data-v-2ce223c0=""
                                            className=" _gray _bold _smallest _upper "
                                          >
                                            Investment
                                          </div>
                                          <div
                                            data-v-2ce223c0=""
                                            className="performance__period-info-value _bold _upper performance__period-info-key"
                                          >
                                            50 | 100
                                          </div>
                                        </div>
                                        <div className="performance__period-info">
                                          <div
                                            data-v-2ce223c0=""
                                            className=" _gray _bold _smallest _upper"
                                          >
                                            Withdrawal
                                          </div>
                                          <div
                                            data-v-2ce223c0=""
                                            className="performance__period-info-value _bold _upper performance__period-info-key"
                                          >
                                            10 | 100
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                        className="w-100"
                      >
                        <CardContent className="py-3">
                          <div style={{ marginBottom: "15px" }}>
                            <p className="profitANDLOSS">
                              Profit And Loss Chart
                            </p>

                            <FormControl fullWidth={true}>
                              <label className="small font-weight-bold text-dark">
                                Years
                              </label>
                              <Select
                                value={year}
                                onChange={(e) => {
                                  setYear(e.target.value);
                                  changeYear(e.target.value);
                                }}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                input={<BootstrapInput />}
                              >
                                {prefrence.filter_profit_years.map(
                                  (item, index) => {
                                    return (
                                      <MenuItem value={item}>{item}</MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            </FormControl>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item md={12} lg={12} xl={12}>
                              <div className="remainderContentSection">
                                {isLoderButton ? (
                                  <div className="loderforChart">
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
                                  <Chart
                                    options={dailySalesOptions}
                                    series={dailySalesOptions.series}
                                    type="line"
                                    height="300px"
                                  />
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                        // className="w-100"
                        spacing={2}
                        className="pending-all-15px"
                      >
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          variant="scrollable"
                          scrollButtons="auto"
                          aria-label="scrollable auto tabs example"
                          className="tabsBar"
                        >
                          <Tab label="TOTAL TRADE" />
                          <Tab label="OPEN POSITION" />
                          <Tab label="INVESTMENT HISTORY" />
                          <Tab label="WITHDRWAL HISTORY" />
                          <Tab label="COMMISSION HISTORY" />
                        </Tabs>

                        <SwipeableViews
                          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                          index={value}
                          onChangeIndex={handleChangeIndex}
                        >
                          <TabPanel
                            value={value}
                            index={0}
                            dir={theme.direction}
                          >
                            {/* <Paper
                                                            elevation={2}
                                                            style={{ borderRadius: "10px", height: "100%" }}
                                                            // className="w-100"
                                                            spacing={2}
                                                            className="pending-all-15px"

                                                        > */}
                            <div className="">
                              <div className="master__history">
                                <div className="history">
                                  <Grid container spacing={2}>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          From
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            tradeParam.start_date =
                                              e.target.value;
                                            setTardeParam({ ...tradeParam });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          To
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            tradeParam.end_date =
                                              e.target.value;
                                            setTardeParam({ ...tradeParam });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <br />
                                  {datatableLoder ? (
                                    <div className="loader-section">
                                      <svg class="spinner" viewBox="0 0 50 50">
                                        <circle
                                          class="path"
                                          cx="25"
                                          cy="25"
                                          r="20"
                                          fill="none"
                                          strokeWidth="5"
                                        ></circle>
                                      </svg>
                                    </div>
                                  ) : (
                                    <CommonTable
                                      url={`${Url}/datatable/pamm/pamm_trade_history.php`}
                                      column={columnTrade}
                                      sort="2"
                                      param={tradeParam}
                                      refresh={refresh}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* </Paper> */}
                          </TabPanel>
                          <TabPanel
                            value={value}
                            index={1}
                            dir={theme.direction}
                          >
                            {/* <Paper
                                                            elevation={2}
                                                            style={{ borderRadius: "10px", height: "100%" }}
                                                            // className="w-100"
                                                            spacing={2}
                                                            className="pending-all-15px"

                                                        > */}
                            <div className="">
                              <div className="master__history">
                                <div className="history">
                                  <Grid container spacing={2}>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          From
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            positionParam.start_date =
                                              e.target.value;
                                            setPositionParam({
                                              ...positionParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          To
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            positionParam.end_date =
                                              e.target.value;
                                            setPositionParam({
                                              ...positionParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <br />
                                  {datatableLoder ? (
                                    <div className="loader-section">
                                      <svg class="spinner" viewBox="0 0 50 50">
                                        <circle
                                          class="path"
                                          cx="25"
                                          cy="25"
                                          r="20"
                                          fill="none"
                                          strokeWidth="5"
                                        ></circle>
                                      </svg>
                                    </div>
                                  ) : (
                                    <CommonTable
                                      url={`${Url}/datatable/pamm/pamm_open_position.php`}
                                      column={columnopen}
                                      sort="2"
                                      param={positionParam}
                                      refresh={refresh}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* </Paper> */}
                          </TabPanel>
                          <TabPanel
                            value={value}
                            index={2}
                            dir={theme.direction}
                          >
                            {/* <Paper
                                                            elevation={2}
                                                            style={{ borderRadius: "10px", height: "100%" }}
                                                            // className="w-100"
                                                            spacing={2}
                                                            className="pending-all-15px"

                                                        > */}
                            <div className="">
                              <div className="master__history">
                                <div className="history">
                                  <Grid container spacing={2}>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          From
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            investmentParam.start_date =
                                              e.target.value;
                                            setInvestmentParam({
                                              ...investmentParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          To
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            investmentParam.end_date =
                                              e.target.value;
                                            setInvestmentParam({
                                              ...investmentParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <br />
                                  {datatableLoder ? (
                                    <div className="loader-section">
                                      <svg class="spinner" viewBox="0 0 50 50">
                                        <circle
                                          class="path"
                                          cx="25"
                                          cy="25"
                                          r="20"
                                          fill="none"
                                          strokeWidth="5"
                                        ></circle>
                                      </svg>
                                    </div>
                                  ) : (
                                    <CommonTable
                                      url={`${Url}/datatable/pamm/pamm_investment_list.php`}
                                      column={columnInvestment}
                                      sort="2"
                                      param={investmentParam}
                                      refresh={refresh}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* </Paper> */}
                          </TabPanel>
                          <TabPanel
                            value={value}
                            index={3}
                            dir={theme.direction}
                          >
                            {/* <Paper
                                                            elevation={2}
                                                            style={{ borderRadius: "10px", height: "100%" }}
                                                            // className="w-100"
                                                            spacing={2}
                                                            className="pending-all-15px"

                                                        > */}
                            <div className="">
                              <div className="master__history">
                                <div className="history">
                                  <Grid container spacing={2}>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          From
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            withdrawParam.start_date =
                                              e.target.value;
                                            setWithdrawParam({
                                              ...withdrawParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          To
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            withdrawParam.end_date =
                                              e.target.value;
                                            setWithdrawParam({
                                              ...withdrawParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <br />
                                  {datatableLoder ? (
                                    <div className="loader-section">
                                      <svg class="spinner" viewBox="0 0 50 50">
                                        <circle
                                          class="path"
                                          cx="25"
                                          cy="25"
                                          r="20"
                                          fill="none"
                                          strokeWidth="5"
                                        ></circle>
                                      </svg>
                                    </div>
                                  ) : (
                                    <CommonTable
                                      url={`${Url}/datatable/pamm/pamm_withdraw_list.php`}
                                      column={columnWithdraw}
                                      sort="2"
                                      param={withdrawParam}
                                      refresh={refresh}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* </Paper> */}
                          </TabPanel>
                          <TabPanel
                            value={value}
                            index={4}
                            dir={theme.direction}
                          >
                            {/* <Paper
                                                            elevation={2}
                                                            style={{ borderRadius: "10px", height: "100%" }}
                                                            // className="w-100"
                                                            spacing={2}
                                                            className="pending-all-15px"

                                                        > */}
                            <div className="">
                              <div className="master__history">
                                <div className="history">
                                  <Grid container spacing={2}>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          From
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            commissionParam.start_date =
                                              e.target.value;
                                            setCommissionParam({
                                              ...commissionParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                    <Grid item sm={6} md={3}>
                                      <FormControl fullWidth={true}>
                                        <label className="small font-weight-bold text-dark">
                                          To
                                        </label>
                                        <BootstrapInput
                                          type="date"
                                          onChange={(e) => {
                                            commissionParam.end_date =
                                              e.target.value;
                                            setCommissionParam({
                                              ...commissionParam,
                                            });
                                          }}
                                        ></BootstrapInput>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <br />
                                  {datatableLoder ? (
                                    <div className="loader-section">
                                      <svg class="spinner" viewBox="0 0 50 50">
                                        <circle
                                          class="path"
                                          cx="25"
                                          cy="25"
                                          r="20"
                                          fill="none"
                                          strokeWidth="5"
                                        ></circle>
                                      </svg>
                                    </div>
                                  ) : (
                                    <CommonTable
                                      url={`${Url}/datatable/pamm/pamm_open_position.php`}
                                      column={columnopen}
                                      sort="2"
                                      param={commissionParam}
                                      refresh={refresh}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* </Paper> */}
                          </TabPanel>
                        </SwipeableViews>
                      </Paper>
                      <div className="master__section._bottom-nav"> </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        </Grid>
      </div>
    </div>
  );
};

export default PammPortfolioProfile;
