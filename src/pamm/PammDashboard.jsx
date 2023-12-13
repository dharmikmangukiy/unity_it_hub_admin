import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { IsApprove, Url } from "../global";
import {
  Button,
  ButtonGroup,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import "./pamm.css";
import Chart from "react-apexcharts";
import { BootstrapInput } from "../common/CustomElement";

const PammDashboard = () => {
  const navigate = useNavigate();
  var [resData, setResData] = useState({});
  const [mainLoader, setMainLoader] = useState(true);
  const [year, setYear] = useState("");
  const [invetsmentYear, setInvestmentYear] = useState("");
  const [invetsmentType, setInvestmentType] = useState("yearly");
  const [isLoderButton, setIsLoaderButton] = useState(false);
  const [invetsmentLoader, setInvetsmentLoader] = useState(false);
  const [prefrence, setPrefrence] = useState({});
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
  var [investmentChart, setInvestmentChart] = useState({
    series: [
      {
        name: "Investment",
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

  var [chartvalue, setchartvalue] = useState({
    options: {
      series: [0, 0],
      labels: ["Total Investment", "Total Withdrawal"],
    },
  });

  toast.configure();

  const changeYear = (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("filter_profit_years", prop);
    setIsLoaderButton(true);

    axios.post(Url + "/ajaxfiles/pamm/dashboard.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        dailySalesOptions.series[0].data = res.data.get_monthly_pnl_data.y;
        dailySalesOptions.xaxis.categories = res.data.get_monthly_pnl_data.x;
        setdailySalesOptions({ ...dailySalesOptions });
        setIsLoaderButton(false);
      }
    });
  };

  const changeInvetsmentYear = (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("filter_profit_years", prop);
    setInvetsmentLoader(true);

    axios.post(Url + "/ajaxfiles/pamm/dashboard.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setResData({ ...res.data });
        investmentChart.series[0].data =
          res.data.yearly_pamm_investment_summary.y;
        investmentChart.xaxis.categories =
          res.data.yearly_pamm_investment_summary.x;
        setInvestmentChart({ ...investmentChart });
        setInvestmentType("yearly");
        setInvetsmentLoader(false);
      }
    });
  };

  const dashboardData = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    axios.post(Url + "/ajaxfiles/pamm/dashboard.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        resData = res.data;
        setResData({ ...resData });
        chartvalue.options.series = [
          Number(res.data.total_investment),
          Number(res.data.total_pamm_withdrawal),
        ];
        setchartvalue({ ...chartvalue });
        setPrefrence(res.data);
        dailySalesOptions.series[0].data = res.data.get_monthly_pnl_data.y;
        dailySalesOptions.xaxis.categories = res.data.get_monthly_pnl_data.x;
        setdailySalesOptions({ ...dailySalesOptions });

        investmentChart.series[0].data =
          res.data.yearly_pamm_investment_summary.y;
        investmentChart.xaxis.categories =
          res.data.yearly_pamm_investment_summary.x;
        setInvestmentChart({ ...investmentChart });
        setYear(res.data.current_year);
        setInvestmentYear(res.data.current_year);
        setMainLoader(false);
        setInvetsmentLoader(true);
        setIsLoaderButton(true);
        setTimeout(() => {
          setInvetsmentLoader(false);
          setIsLoaderButton(false);
        }, 10);
      }
    });
  };

  useEffect(() => {
    dashboardData();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Pamm Dashboard</p>
                <Grid container spacing={2}>
                  <Grid item sm={12} md={6} lg={6}>
                    <div className="setBoxs pamm-dashboard-boxSection">
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <NavLink to="/pamm_user_management">
                              <div className="col s12 m12 text-align-center">
                                <h5 className="mb-0">
                                  {resData.total_pamm_user == null
                                    ? "0"
                                    : resData.total_pamm_user}
                                </h5>
                                <p className="no-margin">Total User</p>
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
                                  {resData.total_pamm_manager == null
                                    ? "0"
                                    : resData.total_pamm_manager}
                                </h5>
                                <p className="no-margin">Total Manager</p>
                              </div>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            {/* <NavLink to="/pamm_mm_management"> */}
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                $
                                {resData.total_investment == null
                                  ? "0"
                                  : resData.total_investment}
                              </h5>
                              <p className="no-margin">Total Investment</p>
                            </div>
                            {/* </NavLink> */}
                          </div>
                        </div>
                      </div>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            {/* <NavLink to="/pamm_mm_management"> */}
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                $
                                {resData.total_pamm_withdrawal == null
                                  ? "0"
                                  : resData.total_pamm_withdrawal}
                              </h5>
                              <p className="no-margin">Total Withdraw</p>
                            </div>
                            {/* </NavLink> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={12} md={6} lg={6}>
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="paper-main-section"
                    >
                      <div className="remainderContentSection">
                        <Chart
                          options={chartvalue.options}
                          series={chartvalue.options.series}
                          // type="area"
                          // type="donut"
                          height="300px"
                          type="pie"
                        />
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item sm={12} md={6} lg={6}>
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="paper-main-section pamm-dashboard-new-user-section"
                    >
                      <div className="headerSection header-title">
                        <p className="margin-0">Recent Members</p>
                        <span className="new-pamm-member-count">
                          {resData.recent_pamm_users
                            ? resData.recent_pamm_users.length
                            : "0"}{" "}
                          New Member
                        </span>
                      </div>
                      <div className="new-pamm-member-section">
                        {resData.recent_pamm_users
                          ? resData.recent_pamm_users.map((item) => {
                              return (
                                <div className="new-pamm-member-element">
                                  <label>{item.name}</label>
                                  <span>{item.user_added_datetime}</span>
                                </div>
                              );
                            })
                          : ""}
                      </div>
                      {resData.recent_pamm_users ? (
                        <div className="footer-section">
                          <NavLink to="/pamm_user_management">
                            View All Users
                          </NavLink>
                        </div>
                      ) : (
                        ""
                      )}
                    </Paper>
                  </Grid>
                  <Grid item sm={12} md={6} lg={6}>
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="paper-main-section pamm-dashboard-new-user-section"
                    >
                      <div className="headerSection header-title">
                        <p className="margin-0">Recent Manager</p>
                        <span className="new-pamm-member-count">
                          {resData.recent_money_managers
                            ? resData.recent_money_managers.length
                            : "0"}{" "}
                          New Manager
                        </span>
                      </div>
                      <div className="new-pamm-member-section">
                        {resData.recent_money_managers
                          ? resData.recent_money_managers.map((item) => {
                              return (
                                <div className="new-pamm-member-element">
                                  <label>{item.name}</label>
                                  <span>{item.user_added_datetime}</span>
                                </div>
                              );
                            })
                          : ""}
                      </div>
                      {resData.recent_money_managers ? (
                        <div className="footer-section">
                          <NavLink to="/pamm_mm_management">
                            View All Manager
                          </NavLink>
                        </div>
                      ) : (
                        ""
                      )}
                    </Paper>
                  </Grid>
                  <Grid item sm={12} md={12} lg={12}>
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="paper-main-section"
                    >
                      <CardContent className="py-3">
                        <div style={{ marginBottom: "15px" }}>
                          <p className="profitANDLOSS">Profit And Loss</p>

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
                              {prefrence.filter_profit_years?.map(
                                (item, index) => {
                                  return (
                                    <MenuItem value={item}>{item}</MenuItem>
                                  );
                                }
                              )}
                            </Select>
                          </FormControl>
                        </div>
                        <Grid container spacing={2} sx={{ marginTop: "21px" }}>
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
                                      strokeWidth="5"
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
                  </Grid>
                  <Grid item sm={12} md={12} lg={12}>
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px" }}
                      className="paper-main-section"
                    >
                      <CardContent className="py-3">
                        <div style={{ marginBottom: "15px" }}>
                          <p className="profitANDLOSS">Investment</p>
                          <div className="filter-with-group-button">
                            <FormControl>
                              <label className="small font-weight-bold text-dark">
                                Years
                              </label>
                              <Select
                                value={invetsmentYear}
                                onChange={(e) => {
                                  setInvestmentYear(e.target.value);
                                  changeInvetsmentYear(e.target.value);
                                }}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                input={<BootstrapInput />}
                              >
                                {prefrence.filter_profit_years?.map(
                                  (item, index) => {
                                    return (
                                      <MenuItem value={item}>{item}</MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            </FormControl>
                            <ButtonGroup variant="outlined">
                              <Button
                                variant={`${
                                  invetsmentType == "yearly"
                                    ? "contained"
                                    : "outlined"
                                }`}
                                onClick={(e) => {
                                  setInvestmentType("yearly");
                                  investmentChart.series[0].data =
                                    resData.yearly_pamm_investment_summary.y;
                                  investmentChart.xaxis.categories =
                                    resData.yearly_pamm_investment_summary.x;
                                  setInvestmentChart({ ...investmentChart });
                                  setInvetsmentLoader(true);
                                  setTimeout(() => {
                                    setInvetsmentLoader(false);
                                  }, 10);
                                }}
                              >
                                Yearly
                              </Button>
                              <Button
                                variant={`${
                                  invetsmentType == "monthly"
                                    ? "contained"
                                    : "outlined"
                                }`}
                                onClick={(e) => {
                                  setInvestmentType("monthly");
                                  investmentChart.series[0].data =
                                    resData.monthly_pamm_investment.y;
                                  investmentChart.xaxis.categories =
                                    resData.monthly_pamm_investment.x;
                                  setInvestmentChart({ ...investmentChart });
                                  setInvetsmentLoader(true);
                                  setTimeout(() => {
                                    setInvetsmentLoader(false);
                                  }, 10);
                                }}
                              >
                                Monthly
                              </Button>
                              <Button
                                variant={`${
                                  invetsmentType == "weekly"
                                    ? "contained"
                                    : "outlined"
                                }`}
                                onClick={(e) => {
                                  setInvestmentType("weekly");
                                  investmentChart.series[0].data =
                                    resData.weekly_pamm_investment.y;
                                  investmentChart.xaxis.categories =
                                    resData.weekly_pamm_investment.x;
                                  setInvestmentChart({ ...investmentChart });
                                  setInvetsmentLoader(true);
                                  setTimeout(() => {
                                    setInvetsmentLoader(false);
                                  }, 10);
                                }}
                              >
                                Weekly
                              </Button>
                            </ButtonGroup>
                          </div>
                        </div>
                        <Grid container spacing={2} sx={{ marginTop: "21px" }}>
                          <Grid item md={12} lg={12} xl={12}>
                            <div className="remainderContentSection">
                              {invetsmentLoader ? (
                                <div
                                  className="loderforChart"
                                  style={{ height: "300px" }}
                                >
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
                                <Chart
                                  options={investmentChart}
                                  series={investmentChart.series}
                                  type="line"
                                  height="300px"
                                />
                              )}
                            </div>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PammDashboard;
