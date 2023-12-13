import React, { useState, useEffect } from "react";
import {
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 8px 10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
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
      borderRadius: 9,
      borderColor: "#80bdff",
    },
  },
}));

const PositionReport = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [searchBy, setSearchBy] = useState([
    {
      label: "LOGIN",
      value: false,
      name: "trade_login",
    },
    {
      label: "SYMBOL",
      value: false,
      name: "trade_symbol",
    },
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "TRADE NO",
      value: false,
      name: "trade_no",
    },
    {
      label: "TIME",
      value: false,
      name: "trade_time",
    },
    {
      label: "TYPE",
      value: false,
      name: "trade_type",
    },
    {
      label: "LOT",
      value: false,
      name: "trade_volume",
    },
    {
      label: "TRADE PRICE",
      value: false,
      name: "trade_open_rate",
    },
    {
      label: "T/P",
      value: false,
      name: "trade_t_p",
    },
    {
      label: "CURRENT PRICE",
      value: false,
      name: "trade_curr_rate",
    },
    {
      label: "PROFIT",
      value: false,
      name: "trade_profit",
    },
  ]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resData, setResData] = useState({});
  const [mt5AccountList, setMt5AccountList] = useState([]);
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
    mt5_acc_no: "",
  });
  toast.configure();
  const column = [
    {
      name: "LOGIN",
      selector: (row) => {
        return <span>{row.trade_login}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "SYMBOL",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.1,
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
      name: "TRADE NO.",
      selector: (row) => {
        return <span title={row.trade_no}>{row.trade_no}</span>;
      },
      sortable: true,
      //  reorder: true,
      grow: 0.3,
    },
    {
      name: "TIME",
      selector: (row) => {
        return <span title={row.trade_time}>{row.trade_time}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "TYPE",
      selector: (row) => {
        return <span title={row.trade_type}>{row.trade_type}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "LOT",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "TRADE PRICE",
      selector: (row) => {
        return <span title={row.trade_open_rate}>{row.trade_open_rate}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "S/L",
      selector: (row) => {
        return <span title={row.trade_s_l}>{row.trade_s_l}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "T/P",
      selector: (row) => {
        return <span title={row.trade_t_p}>{row.trade_t_p}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "CURRENT PRICE",
      selector: (row) => {
        return <span title={row.trade_curr_rate}>{row.trade_curr_rate}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "PROFIT",
      selector: (row) => {
        return <span title={row.trade_profit}>{row.trade_profit}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];
  useEffect(() => {
    getMt5AccountList();
  }, []);
  const getMt5AccountList = async () => {
    const param = new FormData();
    if (IsApprove !== "") {

      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    await axios
      .post(`${Url}/ajaxfiles/position_mt5_list.php`, param)
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
          if (res.data.status != "error") {
            setMt5AccountList([...res.data.mt5_acc_no_list]);
          }
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
                <p className="main-heading">Position Report</p>
                <div className="setBoxs">
                  {" "}
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.mt_balance}</h5>
                          <p className="no-margin">MT Balance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.mt_credit} </h5>
                          <p className="no-margin">MT Credit</p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.mt_equity}</h5>
                          <p className="no-margin">MT Equity</p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.mt_free_margin} </h5>
                          <p className="no-margin">MT Free Margin</p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.total_earnings} </h5>
                          <p className="no-margin">Total Earning</p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </div>
                {/* <CommonFilter search={searchBy} setParam={setParam} searchWord={setSearchKeyword} /> */}
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <Select
                            input={<BootstrapInput />}
                            sx={{ width: "100%" }}
                            value={param.mt5_acc_no}
                            onChange={(e) => {
                              param.mt5_acc_no = e.target.value;
                              setParam({ ...param });
                            }}
                          >
                            {mt5AccountList.map((item) => {
                              return (
                                <MenuItem value={item.mt5_account_id}>
                                  {item.mt5_name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/position_list.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          setResData={setResData}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/position_list_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionReport;
