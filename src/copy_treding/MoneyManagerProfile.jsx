import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
} from "@mui/material";
import Chart from "react-apexcharts";

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
import { IsApprove, Url } from "../global";
import { BootstrapInput, ColorButton } from "../common/CustomElement";
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

const MoneyManagerProfile = () => {
  const [fullWidth, setFullWidth] = useState(true);
  const navigate = useNavigate();
  let { id, moneyManagerUserId } = useParams();
  const [info, setInfo] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [userId, setUserId] = useState();
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  var [moneyManagerListMenu, setMoneyManagerListMenu] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [tardeParam, setTardeParam] = useState({
    user_id: moneyManagerUserId,
  });
  const [positionParam, setPositionParam] = useState({
    user_id: moneyManagerUserId,
  });
  const [walletbalance, setwalletbalance] = useState("");

  const [treadShow, setTreadShow] = useState(true);
  const [datatableLoder, setDatatableLoder] = useState(false);
  const [isLoderButton, setIsLoaderButton] = useState(false);
  const [prefrence, setPrefrence] = useState({});
  const [btnactive, setbtnactive] = useState({
    weekly: true,
    month: false,
    year: false,
  });
  const [year, setYear] = useState("");

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

  const [createPortfolioForm, setCreatePortfolioForm] = useState({
    isLoader: false,
    portfolio_name: "",
    mm_mt5_acc_id: moneyManagerUserId,
    investment_months: "",
  });

  const [crinputinfoTrue, setcrinputinfoTrue] = useState({
    portfolio_name: false,
    mm_mt5_acc_id: false,
    investment_months: false,
  });
  const handleClose = () => {
    setOpen(false);
  };
  const walletbalancefun = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", moneyManagerUserId);
    param.append("action", "get_wallet_balance");
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setwalletbalance(res.data.balance);
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
      param.append("user_id", moneyManagerUserId);
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
      param.append("user_id", moneyManagerUserId);
      param.append("pid", info.pid);
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
            toast.success(res.data.message);
            setWithdrawForm({
              user_id: "",
              isLoader: false,
              amount: "",
            });
            getalldetail();
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
    param.append("user_id", moneyManagerUserId);
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

  const crinputtrueFalse = (event) => {
    var { name, value } = event.target;
    setcrinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const trueFalse = () => {
    if (investmentForm.amount > walletbalance) {
      invebutton.button = true;
      setinvebutton({ ...invebutton });
      toast.error(
        "Your wallet balance is low, if you want to invest same amount then please make a deposit"
      );
    } else {
      invebutton.button = false;
      setinvebutton({ ...invebutton });
    }
  };
  const [invebutton, setinvebutton] = useState({
    button: false,
  });
  const [withdrawForm, setWithdrawForm] = useState({
    isLoader: false,
    allWithdraw: true,
    amount: "",
    pid: info.pid,
  });
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
  const investmentInput = (e) => {
    const { name, value } = e.target;

    setInvestmentForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const [investmentForm, setInvestmentForm] = useState({
    isLoader: false,
    pid: info.pid,
    amount: "",
  });
  const investmentFormSubmit = () => {
    if (id == "") {
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
      param.append("user_id", moneyManagerUserId);
      param.append("pid", info.pid);
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
              amount: "",
            });
          }
        });
    }
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
              onBlur={crinputtrueFalse}
              error={
                createPortfolioForm.portfolio_name == "" &&
                crinputinfoTrue.portfolio_name
                  ? true
                  : false
              }
              sx={{ width: "100%" }}
              name="portfolio_name"
              helperText={
                createPortfolioForm.portfolio_name == "" &&
                crinputinfoTrue.portfolio_name
                  ? "Name is required"
                  : ""
              }
            />
          </div>

          <div className="padingtopmy5create">
            <FormControl
              variant="standard"
              sx={{ width: "100%" }}
              error={
                createPortfolioForm.mm_mt5_acc_id == "" &&
                crinputinfoTrue.mm_mt5_acc_id
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
              crinputinfoTrue.mm_mt5_acc_id ? (
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
              error={
                createPortfolioForm.investment_months == "" &&
                crinputinfoTrue.investment_months
                  ? true
                  : false
              }
              helperText={
                createPortfolioForm.investment_months == "" &&
                crinputinfoTrue.investment_months
                  ? "Investment Months is required"
                  : ""
              }
              type="text"
              name="investment_months"
              value={createPortfolioForm.investment_months}
              variant="standard"
              onBlur={crinputtrueFalse}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  createPortfolioInput(e);
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
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  withdrawInput(e);
                }
              }}
              variant="standard"
              sx={{ width: "100%" }}
              name="amount"
              disabled={withdrawForm.allWithdraw}
              value={withdrawForm.allWithdraw ? 0 : withdrawForm.amount}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Investment") {
      return (
        <div>
          <div>
            <Grid container spacing={3}>
              <Grid item md={7.5}>
                <TextField
                  className="input-font-small"
                  label="Wallet Balance"
                  variant="standard"
                  value={`$${walletbalance}`}
                  sx={{ width: "100%" }}
                  name="amount"
                  disabled
                />
              </Grid>
              <Grid item md={4.5}>
                {/* <ColorButton>Add Deposit</ColorButton> */}
                <Button
                  variant="contained"
                  disabled={!invebutton.button}
                  className="btn-gradient"
                  onClick={() => {
                    navigate("/deposit");
                  }}
                >
                  Add More Deposit
                </Button>
              </Grid>
            </Grid>
          </div>
          <br />
          <div>
            <TextField
              className="input-font-small"
              label="Amount"
              type="text"
              variant="standard"
              value={investmentForm.amount}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  investmentInput(e);
                }
              }}
              sx={{ width: "100%" }}
              onBlur={trueFalse}
              name="amount"
            />
          </div>
        </div>
      );
    }
  };
  const [infoTrue, setinfoTrue] = useState({
    portfolio_name: false,
    mm_mt5_acc_id: false,
    investment_months: false,
  });
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
              onClick={withdrawFormSubmit}
            >
              Submit
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
              disabled={invebutton.button}
              className="btn-gradient "
              onClick={investmentFormSubmit}
            >
              Invest
            </Button>
          )}
        </div>
      );
    }
  };

  const column = [
    /*     {
          name: "Portfolio Id",
          selector: (row) => {
            return <span title={row.portfolio_id}>{row.portfolio_id}</span>;
          },
          wrap: true,
          reorder: true,
          grow: 0.1,
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
        }, */
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
      grow: 0.1,
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

  const changeYear = (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", moneyManagerUserId);
    param.append("mm_mt5_acc_id", id);
    param.append("filter_profit_years", prop);
    param.append("action", "view_money_manager_profile");
    setIsLoaderButton(true);

    axios
      .post(Url + "/ajaxfiles/pamm/portfolio_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          navigate("/");
          return;
        }
        setPrefrence(res.data.data);
        dailySalesOptions.series[0].data =
          res.data.data.money_manager_monthly_profit.y;
        dailySalesOptions.xaxis.categories =
          res.data.data.money_manager_monthly_profit.x;
        setdailySalesOptions({ ...dailySalesOptions });
        setIsLoaderButton(false);
      });
  };
  const getalldetail = () => {
    filterData.mm_mt5_acc_id = id;
    setFilterData({ ...filterData });

    tardeParam.mm_mt5_acc_id = id;
    setTardeParam({ ...tardeParam });

    positionParam.mm_mt5_acc_id = id;
    setPositionParam({ ...positionParam });

    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", moneyManagerUserId);
    param.append("mm_mt5_acc_id", id);
    param.append("action", "view_money_manager_profile");

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
        dailySalesOptions.series[0].data =
          res.data.data.money_manager_monthly_profit.y;
        dailySalesOptions.xaxis.categories =
          res.data.data.money_manager_monthly_profit.x;
        setdailySalesOptions({ ...dailySalesOptions });
        setYear(res.data.data.filter_profit_years[0]);

        setIsLoader(false);
      });
  };
  useEffect(() => {
    getalldetail();
  }, []);

  toast.configure();
  return (
    <div className="money-manager-profile-section">
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
                          <Grid item md={6} sx={{ margin: "auto" }}>
                            {/* <button onClick={() => navigate(-1)}>go back</button> */}
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
                                        {info.mt5_name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="profile__preview-nav">
                                    <div className="m__profile__ct-start-button">
                                      {info.is_closed == "2" ? (
                                        <GreenButton
                                          className="m__ct-start-button"
                                          style={{
                                            background: "#ebe5c1",
                                            color: "#af843a",
                                          }}
                                        >
                                          <div className="m__ct-start-button__main-text">
                                            Pending
                                          </div>
                                        </GreenButton>
                                      ) : info.is_closed == "0" ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "6px",
                                          }}
                                        >
                                          <GreenButton
                                            className="m__ct-start-button1"
                                            onClick={(e) => {
                                              setMaxWidth("sm");
                                              setDialogTitle("Withdraw");
                                              setOpen(true);
                                            }}
                                            sx={{ background: "#ebd7d7" }}
                                          >
                                            <div
                                              className="m__ct-start-button__main-text"
                                              style={{ fontWeight: "700" }}
                                            >
                                              Withdraw
                                            </div>
                                          </GreenButton>
                                          <GreenButton
                                            className="m__ct-start-button2"
                                            onClick={(e) => {
                                              walletbalancefun();

                                              setMaxWidth("sm");
                                              setDialogTitle("Investment");
                                              setOpen(true);
                                            }}
                                          >
                                            <div
                                              className="m__ct-start-button__main-text"
                                              style={{ fontWeight: "700" }}
                                            >
                                              Invest
                                            </div>
                                          </GreenButton>
                                        </div>
                                      ) : (
                                        <GreenButton
                                          className="m__ct-start-button"
                                          onClick={(e) => {
                                            setMaxWidth("sm");
                                            setinfoTrue({
                                              portfolio_name: false,
                                              mm_mt5_acc_id: false,
                                              investment_months: false,
                                            });
                                            setcrinputinfoTrue({
                                              portfolio_name: false,
                                              mm_mt5_acc_id: false,
                                              investment_months: false,
                                            });
                                            setCreatePortfolioForm({
                                              isLoader: false,
                                              portfolio_name: "",
                                              mm_mt5_acc_id: id,
                                              investment_months: "",
                                            });
                                            setDialogTitle("Create Portfolio");
                                            getMoneyManagerList();
                                            setOpen(true);
                                          }}
                                        >
                                          <div className="m__ct-start-button__main-text">
                                            Create Portfolio
                                          </div>
                                        </GreenButton>
                                      )}
                                    </div>
                                    {/* <div className="m__profile__ct-start-button">
                                      <GreenButton
                                        className="m__ct-start-button"
                                        onClick={(e) => {
                                          setMaxWidth("sm");
                                          //   createPortfolioForm.mm_mt5_acc_id =
                                          //     item.mm_mt5_acc_id;

                                          //   setCreatePortfolioForm({
                                          //     ...createPortfolioForm,
                                          //   });
                                          setDialogTitle("Create Portfolio");
                                          getMoneyManagerList();
                                          setOpen(true);
                                        }}
                                      >
                                        <div className="m__ct-start-button__main-text">
                                          Create Portfolio
                                        </div>
                                      </GreenButton>
                                    </div> */}
                                    <div className="m__profile__min-invest">
                                      Minimum Investment
                                      <span>
                                        ${info.minimum_deposit_amount}
                                      </span>
                                    </div>
                                    <div className="m__profile__min-invest">
                                      Fees Percentage
                                      <span>{info.fees_percentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Grid>
                          <Grid item md={6}>
                            <div className="master__row">
                              <div className="master__section_performance w-100">
                                <div className="master__performance">
                                  <div className="performance">
                                    <div
                                      data-v-2ce223c0=""
                                      className="performance__head _black _bold _medium"
                                    >
                                      Performance
                                    </div>
                                    <div className="performance__periods">
                                      <div className="performance__period">
                                        <div className="performance__period-info">
                                          <div
                                            data-v-2ce223c0=""
                                            className=" _gray _bold _smallest _upper "
                                          >
                                            Return %
                                          </div>
                                          <div
                                            data-v-2ce223c0=""
                                            className="performance__period-info-value _bold _upper _positive performance__period-info-key"
                                          >
                                            {info.approx_return_percentage}%
                                          </div>
                                        </div>
                                        <div className="performance__period-info">
                                          <div
                                            data-v-2ce223c0=""
                                            className=" _gray _bold _smallest _upper"
                                          >
                                            P/L
                                          </div>
                                          <div
                                            data-v-2ce223c0=""
                                            className="performance__period-info-value _bold _upper performance__period-info-key"
                                          >
                                            ${info.mm_pl}
                                          </div>
                                        </div>
                                        <div className="performance__period-info">
                                          <div
                                            data-v-2ce223c0=""
                                            className=" _gray _bold _smallest _upper"
                                          >
                                            profit and loss
                                          </div>
                                          <div className="performance__period-pnl">
                                            <div className="performance__period-pnl-head">
                                              <div
                                                data-v-2ce223c0=""
                                                className="_bold _upper _positive"
                                              >
                                                ${info.mm_total_profit}
                                              </div>
                                              <div
                                                data-v-2ce223c0=""
                                                className="_bold _upper _negative"
                                              >
                                                ${info.mm_total_loss}
                                              </div>
                                            </div>
                                            <div
                                              className="performance__period-pnl-body"
                                              style={{ display: "flex" }}
                                            >
                                              <div
                                                className="performance__period-pnl-line _positive"
                                                style={{
                                                  width: `${
                                                    (Number(
                                                      info.mm_total_profit_int
                                                    ) *
                                                      100) /
                                                    (info.mm_total_loss_int +
                                                      Number(
                                                        info.mm_total_profit_int
                                                      ))
                                                  }%`,
                                                }}
                                              ></div>
                                              <div
                                                className="performance__period-pnl-line _negative"
                                                style={{
                                                  width: `${
                                                    (info.mm_total_loss_int *
                                                      100) /
                                                    (info.mm_total_loss_int +
                                                      Number(
                                                        info.mm_total_profit_int
                                                      ))
                                                  }%`,
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="master__section_account-details  w-100">
                                <div className="master__account-details">
                                  <div className="account-details">
                                    <div
                                      data-v-2ce223c0=""
                                      className="account-details__head _black _bold _medium"
                                    >
                                      Account details
                                    </div>
                                    <div className="account-details__info">
                                      <div className="account-details__info-item">
                                        <div className="account-details__info-head">
                                          <div
                                            data-v-2ce223c0=""
                                            className="account-details__info-key _gray _bold _smallest _upper"
                                          >
                                            Risk score
                                          </div>
                                        </div>
                                        <div className="account-details__info-mobile-dots"></div>
                                        <div
                                          data-v-2ce223c0=""
                                          className="account-details__info-value _bold _upper performance__period-info-key"
                                        >
                                          {info.risk_ratio}
                                        </div>
                                      </div>
                                      <div className="account-details__info-item">
                                        <div className="account-details__info-head">
                                          <div
                                            data-v-2ce223c0=""
                                            className="account-details__info-key _gray _bold _smallest _upper "
                                          >
                                            Equity
                                          </div>
                                          {/* <div
                                                                            arrow="true"
                                                                            arrowtype="round"
                                                                            animation="fade"
                                                                            maxwidth="300"
                                                                            placement="top-center"
                                                                            size="small"
                                                                            hideonclick="true"
                                                                            className="ct-tooltip account-details__info-tooltip"
                                                                        >
                                                                            <div tabindex="0">
                                                                                <div className="ct-tooltip__icon">
                                                                                    <img src="https://friconix.com/png/fi-cnsuxs-question-mark.png" />
                                                                                </div>
                                                                            </div>
                                                                        </div> */}
                                        </div>
                                        <div className="account-details__info-mobile-dots"></div>
                                        <div
                                          data-v-2ce223c0=""
                                          className="account-details__info-value _bold _upper performance__period-info-key"
                                        >
                                          {info.mt_equity}
                                        </div>
                                      </div>
                                      <div className="account-details__info-item">
                                        <div className="account-details__info-head">
                                          <div
                                            data-v-2ce223c0=""
                                            className="account-details__info-key _gray _bold _smallest _upper"
                                          >
                                            Investors
                                          </div>
                                          {/* <div
                                                                            arrow="true"
                                                                            arrowtype="round"
                                                                            animation="fade"
                                                                            maxwidth="300"
                                                                            placement="top-center"
                                                                            size="small"
                                                                            hideonclick="true"
                                                                            className="ct-tooltip account-details__info-tooltip"
                                                                        >
                                                                            <div tabindex="0">
                                                                                <div className="ct-tooltip__icon">
                                                                                    <img src="https://friconix.com/png/fi-cnsuxs-question-mark.png" />
                                                                                </div>
                                                                            </div>
                                                                        </div> */}
                                        </div>
                                        <div className="account-details__info-mobile-dots"></div>
                                        <div
                                          data-v-2ce223c0=""
                                          className="account-details__info-value _bold _upper performance__period-info-key"
                                        >
                                          {info.total_investors} |{" "}
                                          {info.total_today_investors}
                                        </div>
                                      </div>
                                      <div className="account-details__info-item">
                                        <div className="account-details__info-head">
                                          <div
                                            data-v-2ce223c0=""
                                            className="account-details__info-key _gray _bold _smallest _upper"
                                          >
                                            Deposits | Deposit
                                          </div>
                                          {/* <div
                                                                            arrow="true"
                                                                            arrowtype="round"
                                                                            animation="fade"
                                                                            maxwidth="300"
                                                                            placement="top-center"
                                                                            size="small"
                                                                            hideonclick="true"
                                                                            className="ct-tooltip account-details__info-tooltip"
                                                                        >
                                                                            <div tabindex="0">
                                                                                <div className="ct-tooltip__icon">
                                                                                    <img src="https://friconix.com/png/fi-cnsuxs-question-mark.png" />
                                                                                </div>
                                                                            </div>
                                                                        </div> */}
                                        </div>
                                        <div className="account-details__info-mobile-dots"></div>
                                        <div
                                          data-v-2ce223c0=""
                                          className="account-details__info-value _bold _upper"
                                        >
                                          {info.total_investment} |
                                          {info.total_today_investment}
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
                                // value={filterData.withdrawal_status}
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
                        <div className="">
                          <div className="master__history">
                            <div className="history">
                              <div className="history__header">
                                <div
                                  data-v-2ce223c0=""
                                  className="history__head _black _bold _medium"
                                >
                                  History
                                </div>
                                <div className="history__nav-wrapper">
                                  <div className="history__nav">
                                    <ButtonGroup variant="outlined">
                                      <Button
                                        variant={`${
                                          treadShow ? "contained" : "outlined"
                                        }`}
                                        onClick={(e) => {
                                          setTreadShow(true);
                                          setDatatableLoder(true);
                                          setTimeout(() => {
                                            setDatatableLoder(false);
                                          }, 500);
                                        }}
                                      >
                                        Trade History
                                      </Button>
                                      <Button
                                        variant={`${
                                          !treadShow ? "contained" : "outlined"
                                        }`}
                                        onClick={(e) => {
                                          setTreadShow(false);
                                          setDatatableLoder(true);
                                          setTimeout(() => {
                                            setDatatableLoder(false);
                                          }, 500);
                                        }}
                                      >
                                        Open Position
                                      </Button>
                                    </ButtonGroup>
                                  </div>
                                </div>
                              </div>
                              <Grid container spacing={2}>
                                <Grid item sm={6} md={3}>
                                  <FormControl fullWidth={true}>
                                    <label className="small font-weight-bold text-dark">
                                      From
                                    </label>
                                    <BootstrapInput
                                      type="date"
                                      onChange={(e) => {
                                        if (treadShow) {
                                          tardeParam.start_date =
                                            e.target.value;
                                          setTardeParam({ ...tardeParam });
                                        } else {
                                          positionParam.start_date =
                                            e.target.value;
                                          setPositionParam({
                                            ...positionParam,
                                          });
                                        }
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
                                        if (treadShow) {
                                          tardeParam.end_date = e.target.value;
                                          setTardeParam({ ...tardeParam });
                                        } else {
                                          positionParam.end_date =
                                            e.target.value;
                                          setPositionParam({
                                            ...positionParam,
                                          });
                                        }
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
                              ) : treadShow == true ? (
                                <>
                                  <CommonTable
                                    url={`${Url}/datatable/pamm/mm_trade_history.php`}
                                    column={column}
                                    sort="2"
                                    param={tardeParam}
                                    refresh={refresh}
                                  />
                                </>
                              ) : (
                                <>
                                  <CommonTable
                                    url={`${Url}/datatable/pamm/pamm_open_position.php`}
                                    column={columnopen}
                                    sort="2"
                                    param={positionParam}
                                    refresh={refresh}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
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

export default MoneyManagerProfile;
