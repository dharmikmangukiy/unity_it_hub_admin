import React, { useEffect, useState } from "react";
// import Highcharts from 'highcharts';
import * as ReactDom from "react-dom";
import * as Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import "./dashboard.css";
import {
  ButtonGroup,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import mapDataWorld from "@highcharts/map-collection/custom/world.geo.json";
import Chart from "react-apexcharts";
import CommonFilter from "../common/CommonFilter";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomLoader from "../common/CustomLoader";
const WorldMap = require("react-world-map");

var data: [string, number][] = [
  ["fo", 0],
  ["um", 1],
  ["us", 2],
  ["jp", 3],
  ["sc", 4],
  ["in", 800],
  ["fr", 6],
  ["fm", 7],
  ["cn", 8],
  ["pt", 9],
  ["sw", 10],
  ["sh", 11],
  ["br", 12],
  ["ki", 13],
  ["ph", 14],
  ["mx", 15],
  ["es", 16],
  ["bu", 17],
  ["mv", 18],
  ["sp", 19],
  ["gb", 20],
  ["gr", 21],
  ["as", 22],
  ["dk", 23],
  ["gl", 24],
  ["gu", 25],
  ["mp", 26],
  ["pr", 27],
  ["vi", 28],
  ["ca", 29],
  ["st", 30],
  ["cv", 31],
  ["dm", 32],
  ["nl", 33],
  ["jm", 34],
  ["ws", 35],
  ["om", 36],
  ["vc", 37],
  ["tr", 38],
  ["bd", 39],
  ["lc", 40],
  ["nr", 41],
  ["no", 42],
  ["kn", 43],
  ["bh", 44],
  ["to", 45],
  ["fi", 46],
  ["id", 47],
  ["mu", 48],
  ["se", 49],
  ["tt", 50],
  ["my", 51],
  ["pa", 52],
  ["pw", 53],
  ["tv", 54],
  ["mh", 55],
  ["cl", 56],
  ["th", 57],
  ["gd", 58],
  ["ee", 59],
  ["ag", 60],
  ["tw", 61],
  ["bb", 62],
  ["it", 63],
  ["mt", 64],
  ["vu", 65],
  ["sg", 66],
  ["cy", 67],
  ["lk", 68],
  ["km", 69],
  ["fj", 70],
  ["ru", 71],
  ["va", 72],
  ["sm", 73],
  ["kz", 74],
  ["az", 75],
  ["tj", 76],
  ["ls", 77],
  ["uz", 78],
  ["ma", 79],
  ["co", 80],
  ["tl", 81],
  ["tz", 82],
  ["ar", 83],
  ["sa", 84],
  ["pk", 85],
  ["ye", 86],
  ["ae", 87],
  ["ke", 88],
  ["pe", 89],
  ["do", 90],
  ["ht", 91],
  ["pg", 92],
  ["ao", 93],
  ["kh", 94],
  ["vn", 95],
  ["mz", 96],
  ["cr", 97],
  ["bj", 98],
  ["ng", 99],
  ["ir", 100],
  ["sv", 101],
  ["sl", 102],
  ["gw", 103],
  ["hr", 104],
  ["bz", 105],
  ["za", 106],
  ["cf", 107],
  ["sd", 108],
  ["cd", 109],
  ["kw", 110],
  ["de", 111],
  ["be", 112],
  ["ie", 113],
  ["kp", 114],
  ["kr", 115],
  ["gy", 116],
  ["hn", 117],
  ["mm", 118],
  ["ga", 119],
  ["gq", 120],
  ["ni", 121],
  ["lv", 122],
  ["ug", 123],
  ["mw", 124],
  ["am", 125],
  ["sx", 126],
  ["tm", 127],
  ["zm", 128],
  ["nc", 129],
  ["mr", 130],
  ["dz", 131],
  ["lt", 132],
  ["et", 133],
  ["er", 134],
  ["gh", 135],
  ["si", 136],
  ["gt", 137],
  ["ba", 138],
  ["jo", 139],
  ["sy", 140],
  ["mc", 141],
  ["al", 142],
  ["uy", 143],
  ["cnm", 144],
  ["mn", 145],
  ["rw", 146],
  ["so", 147],
  ["bo", 148],
  ["cm", 149],
  ["cg", 150],
  ["eh", 151],
  ["rs", 152],
  ["me", 153],
  ["tg", 154],
  ["la", 155],
  ["af", 156],
  ["ua", 157],
  ["sk", 158],
  ["jk", 159],
  ["bg", 160],
  ["qa", 161],
  ["li", 162],
  ["at", 163],
  ["sz", 164],
  ["hu", 165],
  ["ro", 166],
  ["ne", 167],
  ["lu", 168],
  ["ad", 169],
  ["ci", 170],
  ["lr", 171],
  ["bn", 172],
  ["iq", 173],
  ["ge", 174],
  ["gm", 175],
  ["ch", 176],
  ["td", 177],
  ["kv", 178],
  ["lb", 179],
  ["dj", 180],
  ["bi", 181],
  ["sr", 182],
  ["il", 183],
  ["ml", 184],
  ["sn", 185],
  ["gn", 186],
  ["zw", 187],
  ["pl", 188],
  ["mk", 189],
  ["py", 190],
  ["by", 191],
  ["cz", 192],
  ["bf", 193],
  ["na", 194],
  ["ly", 195],
  ["tn", 196],
  ["bt", 197],
  ["md", 198],
  ["ss", 199],
  ["bw", 200],
  ["bs", 201],
  ["nz", 202],
  ["cu", 203],
  ["ec", 204],
  ["au", 205],
  ["ve", 206],
  ["sb", 207],
  ["mg", 208],
  ["is", 209],
  ["eg", 210],
  ["kg", 211],
  ["np", 212],
];

const options: Highcharts.Options = {
  colors: [
    "rgba(227, 64, 117, 1)",
    "rgba(227,64,117,0.2)",
    "rgba(227,64,117,0.4)",
    "rgba(227,64,117,0.5)",
    "rgba(227,64,117,0.6)",
    "rgba(227,64,117,0.8)",
    "rgba(227,64,117,1)",
  ],
  title: {
    text: "",
  },
  colorAxis: {
    dataClasses: [
      {
        to: 3,
        color: "rgba(227, 64, 117, 0.1)",
      },
      {
        from: 3,
        to: 10,
        color: "rgba(227,64,117,0.2)",
      },
      {
        from: 10,
        to: 30,
        color: "rgba(227,64,117,0.4)",
      },
      {
        from: 30,
        to: 100,
        color: "rgba(227,64,117,0.5)",
      },
      {
        from: 100,
        to: 300,
        color: "rgba(227,64,117,0.6)",
      },
      {
        from: 300,
        to: 1000,
        color: "rgba(227,64,117,0.8)",
      },
      {
        from: 1000,
        color: "rgba(227, 64, 117, 1)",
      },
    ],
  },
  series: [
    {
      type: "map",
      mapData: mapDataWorld,
      data: data,
    },
  ],
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: "bottom",
    },
  },
};

var dailySalesOptions = {
  series: [
    {
      name: "Deposit",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Withdraw",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ],
  chart: {
    height: 350,
    type: "area",
  },
  colors: ["#008FFB", "#00E396", "#b11233"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z",
    ],
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
};

var ibSummaryOptions = {
  series: [
    {
      name: "No of IBs",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Rebate",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "Commission",
      data: [5, 10, 15, 20, 25, 15, 10],
    },
  ],
  chart: {
    height: 350,
    type: "area",
  },
  colors: ["#008FFB", "#00E396", "#b11233"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z",
    ],
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
};

const Dashboard = (prop) => {
  const navigate = useNavigate();
  const [selected, onSelect] = useState(null);
  const [fullData, setFullData] = useState({});
  const [SmallLoader, setSmallLoader] = useState(false);
  const [SmallLoader1, setSmallLoader1] = useState(false);

  const [dateF, setDateF] = useState({
    start_date: "",
    end_date: "",
  });
  const [dateF1, setDateF1] = useState({
    start_date: "",
    end_date: "",
  });
  const [pageLoader, setPageLoader] = useState(true);
  const [leadwise, setLeadWise] = useState({
    options: options,
    active: true,
  });
  const handleSearch = () => {
    if (!dateF.start_date) {
      toast.error("Please Enter Start Date");
      return;
    } else if (!dateF.end_date) {
      toast.error("Please Enter End Date");
      return;
    }
    setSmallLoader(true);
    dashboardData();
  };
  const handleSearch1 = () => {
    if (!dateF1.start_date) {
      toast.error("Please Enter Start Date");
      return;
    } else if (!dateF1.end_date) {
      toast.error("Please Enter End Date");
      return;
    }
    setSmallLoader1(true);
    dashboardData1();
  };
  const dashboardData = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "deposit_withdrawal_amount");
    param.append("start_date", dateF.start_date);
    param.append("end_date", dateF.end_date);

    // setPageLoader(true);
    axios
      .post(Url + "/ajaxfiles/dashboard_filter_data.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          prop.setLogin("true");
          navigate("/");
          return;
        } else {
          setSmallLoader(false);

          fullData.deposit_withdrawal_amount.total_deposits =
            res.data.total_deposits;
          fullData.deposit_withdrawal_amount.total_withdrawal =
            res.data.total_withdrawal;
          fullData.deposit_withdrawal_amount.net_deposit_withdrawal =
            res.data.net_deposit_withdrawal;
          fullData.deposit_withdrawal_amount.total_ib_withdrawal =
            res?.data?.total_ib_withdrawal;

          setFullData({ ...fullData });
        }
      });
  };
  const dashboardData1 = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "deposit_bonus_claim_data");
    param.append("start_date", dateF1.start_date);
    param.append("end_date", dateF1.end_date);
    // setPageLoader(true);
    axios
      .post(Url + "/ajaxfiles/dashboard_filter_data.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          prop.setLogin("true");
          navigate("/");
          return;
        } else {
          setSmallLoader1(false);

          fullData.deposit_bonus_claim_data.total_accounts =
            res.data.total_accounts;
          fullData.deposit_bonus_claim_data.bonus_claimed =
            res.data.bonus_claimed;
          setFullData({ ...fullData });
        }
      });
  };
  useEffect(() => {
    if (localStorage.getItem("login") == "true") {
      prop.setLogin("true");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      axios.post(Url + "/ajaxfiles/dashboard.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          prop.setLogin("true");
          navigate("/");
          return;
        } else {
          setFullData(res.data);
          setPageLoader(false);
          // const dateTime = new Date(res.data.start_date);
          // const dateTime1 = new Date(res.data.end_date);

          // const formattedDate = dateTime.toLocaleDateString();
          // const formattedDate1 = dateTime1.toLocaleDateString();
          if (res?.data?.start_date && res?.data?.end_date) {
            dateF.start_date = res?.data?.start_date?.split(" ")[0];
            dateF.end_date = res?.data?.end_date?.split(" ")[0];
            dateF1.start_date = res?.data?.start_date?.split(" ")[0];
            dateF1.end_date = res?.data?.end_date?.split(" ")[0];

            setDateF({ ...dateF });
            setDateF1({ ...dateF1 });
          }
        }
      });
    }
  }, []);

  const facthMapData = () => {
    if (leadwise.active) {
      data.forEach((item) => {
        var count = fullData.countrywise_leads.filter(
          (y) => y.country == item[0]
        );
        if (count.length > 0) {
          item[1] = Number(count[0]["inquiry_counts"]);
        } else {
          item[1] = 0;
        }
      });
      leadwise.options = { ...options };
      setLeadWise({ ...leadwise });
    } else {
      data.forEach((item) => {
        var count = fullData.countrywise_users.filter(
          (y) => y.country == item[0]
        );
        if (count.length > 0) {
          item[1] = Number(count[0]["user_counts"]);
        } else {
          item[1] = 0;
        }
      });
      leadwise.options = { ...options };
      setLeadWise({ ...leadwise });
    }
  };

  useEffect(() => {
    if (fullData.countrywise_leads) {
      facthMapData();
    }
  }, [fullData]);

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
              {/* <CommonFilter />
                        <br/> */}
              <Grid container spacing={3}>
                <Grid
                  item
                  md={12}
                  lg={12}
                  xl={12}
                  sm={12}
                  className="margin-bottom-30px"
                >
                  <p className="main-heading">Dashboard&nbsp;</p>
                  <Grid container spacing={3}>
                    {/* <Grid item md={6} lg={6} xl={6} sm={12}>
                      <p className="main-heading">Dashboard&nbsp;</p>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                      >
                        <CardContent className="py-3">
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="section-header">
                                <p>&nbsp;</p>
                                <ButtonGroup
                                  disableElevation
                                  variant="contained"
                                >
                                  <Button
                                    className={`${
                                      leadwise.active
                                        ? "action-group-button"
                                        : "button-group-off"
                                    }`}
                                    onClick={() => {
                                      leadwise.active = true;
                                      setLeadWise({ ...leadwise });
                                      facthMapData();
                                    }}
                                  >
                                    Leads
                                  </Button>
                                  <Button
                                    className={`${
                                      !leadwise.active
                                        ? "action-button-group"
                                        : "button-group-off"
                                    }`}
                                    onClick={() => {
                                      leadwise.active = false;
                                      setLeadWise({ ...leadwise });
                                      facthMapData();
                                    }}
                                  >
                                    Clients
                                  </Button>
                                </ButtonGroup>
                              </div>

                              <div className="chartSection">
                                <HighchartsReact
                                  options={leadwise.options}
                                  highcharts={Highcharts}
                                  constructorType={"mapChart"}
                                />
                              </div>
                            </Grid>
                           
                          </Grid>
                        </CardContent>
                      </Paper>
                    </Grid> */}
                    {/* <Grid item md={6} lg={6} xl={6} sm={12}>
                      <p className="main-heading">&nbsp;</p>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">Reminders</p>
                            <p className="section-count">4</p>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="remainderContentSection">
                                {fullData.recent_followups.map(
                                  (item, index) => {
                                    return (
                                      <>
                                        <div className="remainder">
                                          <i className="material-icons">
                                            textsms
                                          </i>

                                          <div className="content">
                                            <p>{item.remarks}</p>
                                            <p>{item.customer_name}</p>
                                            <p>{item.inquiry_datetime}</p>
                                          </div>
                                        </div>
                                        <hr />
                                      </>
                                    );
                                  }
                                )}

                                <div className="remainder">
                                  <i className="material-icons">textsms</i>
                                  <div className="content">
                                    <p>remind me to tomorrow call to him</p>
                                    <p>Test Test</p>
                                    <p>01/12/2022</p>
                                  </div>
                                </div>
                                <hr />
                                <div className="remainder">
                                  <i className="material-icons">textsms</i>
                                  <div className="content">
                                    <p>remind me to tomorrow call to him</p>
                                    <p>Test Test</p>
                                    <p>01/12/2022</p>
                                  </div>
                                </div>
                                <hr />
                                <div className="remainder">
                                  <i className="material-icons">textsms</i>
                                  <div className="content">
                                    <p>remind me to tomorrow call to him</p>
                                    <p>Test Test</p>
                                    <p>01/12/2022</p>
                                  </div>
                                </div>
                                <hr />
                                <div className="moreRemainderSection">
                                  <span>More</span>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>
                    </Grid> */}
                    {/* <Grid item md={6} lg={6} xl={6} sm={12}>
                      <p className="main-heading">&nbsp;</p>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">Daily Sales</p>
                            <ButtonGroup
                              disableElevation
                              variant="contained"
                              className="action-group-button"
                            >
                              <Button>Week</Button>
                              <Button className="button-group-off">
                                Month
                              </Button>
                              <Button className="button-group-off">Year</Button>
                            </ButtonGroup>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="remainderContentSection">
                                <Chart
                                  options={dailySalesOptions}
                                  series={dailySalesOptions.series}
                                  type="area"
                                />
                                <div className="bottom-label-section">
                                  <div className="label">
                                    <span className="blur-dot-chart"></span>{" "}
                                    Total Deposit : <b>0</b>
                                  </div>
                                  <div className="label">
                                    <span className="green-dot-chart"></span>{" "}
                                    Total Withdraw : <b>0</b>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>
                    </Grid>
                    <Grid item md={6} lg={6} xl={6} sm={12}>
                      <p className="main-heading">&nbsp;</p>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">IB Summary</p>
                            <ButtonGroup
                              disableElevation
                              variant="contained"
                              className="action-group-button"
                            >
                              <Button>Week</Button>
                              <Button className="button-group-off">
                                Month
                              </Button>
                              <Button className="button-group-off">Year</Button>
                            </ButtonGroup>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="remainderContentSection">
                                <Chart
                                  options={ibSummaryOptions}
                                  series={ibSummaryOptions.series}
                                  type="area"
                                />
                                <div className="bottom-label-section">
                                  <div className="label">
                                    <span className="blur-dot-chart"></span>{" "}
                                    Total Deposit : <b>0</b>
                                  </div>
                                  <div className="label">
                                    <span className="green-dot-chart"></span>{" "}
                                    Total Withdraw : <b>0</b>
                                  </div>
                                  <div className="label">
                                    <span className="red-dot-chart"></span>{" "}
                                    Total Commission : <b>0</b>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>
                    </Grid> */}

                    <Grid item md={6} lg={6} xl={6} sm={12}>
                      {/* <p className="main-heading">&nbsp;</p> */}
                      <Paper
                        elevation={2}
                        style={{
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">Transaction Request</p>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="remainderContentSection">
                                <div className="th-div">
                                  <label></label>
                                  <label>PENDING</label>
                                  <label>REJECTED</label>
                                  <label>APPROVED</label>
                                </div>
                                <div className="th-div td-div">
                                  <label>Deposit</label>
                                  <label>
                                    {
                                      fullData.all_transaction.deposit_requests
                                        .deposit_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction.deposit_requests
                                        .deposit_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction.deposit_requests
                                        .deposit_approved_request
                                    }
                                  </label>
                                </div>
                                <div className="th-div td-div">
                                  <label>Withdrawals</label>
                                  <label>
                                    {
                                      fullData.all_transaction.withdraw_requests
                                        .withdrawal_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction.withdraw_requests
                                        .withdrawal_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction.withdraw_requests
                                        .withdrawal_approved_request
                                    }
                                  </label>
                                </div>
                                <div className="th-div td-div">
                                  <div>IB Withdrawal</div>

                                  <label>
                                    {
                                      fullData.all_transaction
                                        .ib_withdraw_requests
                                        .ib_withdrawal_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction
                                        .ib_withdraw_requests
                                        .ib_withdrawal_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction
                                        .ib_withdraw_requests
                                        .ib_withdrawal_approved_request
                                    }
                                  </label>
                                </div>
                                <div className="th-div td-div">
                                  <label>Internal Transfer</label>
                                  <label>
                                    {
                                      fullData.all_transaction.transfer_requests
                                        .transfer_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction.transfer_requests
                                        .transfer_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.all_transaction.transfer_requests
                                        .transfer_approved_request
                                    }
                                  </label>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", marginTop: "24px" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">Other Request</p>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="remainderContentSection">
                                <div className="th-div">
                                  <label></label>
                                  <label>PENDING</label>
                                  <label>REJECTED</label>
                                  <label>APPROVED</label>
                                </div>

                                <div className="th-div td-div">
                                  <label>IB Request</label>
                                  <label>
                                    {
                                      fullData.requests.ib_requests
                                        .ib_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.ib_requests
                                        .ib_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.ib_requests
                                        .ib_approved_request
                                    }
                                  </label>
                                </div>

                                <div className="th-div td-div">
                                  <label>Leverage Request</label>
                                  <label>
                                    {
                                      fullData.requests.leverage_request
                                        .leverage_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.leverage_request
                                        .leverage_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.leverage_request
                                        .leverage_appoved_request
                                    }
                                  </label>
                                </div>
                                <div className="th-div td-div">
                                  <label>KYC Request</label>
                                  <label>
                                    {
                                      fullData.requests.kyc_request
                                        .kyc_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.kyc_request
                                        .kyc_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.kyc_request
                                        .kyc_appoved_request
                                    }
                                  </label>
                                </div>
                                <div className="th-div td-div">
                                  <div>Affiliate Request</div>

                                  <label>
                                    {
                                      fullData.requests.affiliate_request
                                        .affiliate_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.affiliate_request
                                        .affiliate_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.affiliate_request
                                        .affiliate_appoved_request
                                    }
                                  </label>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>

                      {/* <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", marginTop: "24px" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">Other Request</p>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="th-div td-div">
                                <b>
                                  <div>IB Request</div>
                                </b>
                                <label>
                                  {
                                    fullData.requests.ib_requests
                                      .ib_pending_request
                                  }
                                </label>
                                <label>
                                  {
                                    fullData.requests.ib_requests
                                      .ib_rejected_request
                                  }
                                </label>
                                <label>
                                  {
                                    fullData.requests.ib_requests
                                      .ib_approved_request
                                  }
                                </label>
                              </div>

                              <div className="remainderContentSection">
                                <div className="th-div td-div">
                                  <label className="ml-4">
                                    Leverage REQUEST
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.leverage_request
                                        .leverage_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.leverage_request
                                        .leverage_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.leverage_request
                                        .leverage_appoved_request
                                    }
                                  </label>
                                </div>
                              </div>

                              <div className="th-div td-div">
                                <b>
                                  <div>KYC Request</div>
                                </b>
                                <label>
                                  {
                                    fullData.requests.kyc_request
                                      .kyc_pending_request
                                  }
                                </label>
                                <label>
                                  {
                                    fullData.requests.kyc_request
                                      .kyc_rejected_request
                                  }
                                </label>
                                <label>
                                  {
                                    fullData.requests.kyc_request
                                      .kyc_appoved_request
                                  }
                                </label>
                              </div>

                              <div className="remainderContentSection">
                                <div className="th-div td-div">
                                  <label className="ml-4">
                                    Affiliate REQUEST
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.affiliate_request
                                        .affiliate_pending_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.affiliate_request
                                        .affiliate_rejected_request
                                    }
                                  </label>
                                  <label>
                                    {
                                      fullData.requests.affiliate_request
                                        .affiliate_appoved_request
                                    }
                                  </label>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper> */}
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", marginTop: "24px" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title">KYC Documents</p>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="leadsContentSection kyc-document">
                                <div className="leadRightContentSection">
                                  <div className="roundedShapeContent">
                                    <NavLink to="/pending_kyc/pending">
                                      <span>
                                        {
                                          fullData.requests.kyc_request
                                            .kyc_pending_request
                                        }
                                      </span>
                                      <p>Pending Approval</p>
                                    </NavLink>
                                  </div>
                                  <div className="roundedShapeContent">
                                    <NavLink to="/history_kyc/approved">
                                      <span>
                                        {
                                          fullData.requests.kyc_request
                                            .kyc_appoved_request
                                        }
                                      </span>
                                      <p>Approval KYC</p>
                                    </NavLink>
                                  </div>
                                  <div className="roundedShapeContent">
                                    <NavLink to="/history_kyc/rejected">
                                      <span>
                                        {
                                          fullData.requests.kyc_request
                                            .kyc_rejected_request
                                        }
                                      </span>
                                      <p>Rejected KYC</p>
                                    </NavLink>
                                  </div>
                                  <div className="roundedShapeContent">
                                    <NavLink to="/client_list/missing">
                                      <span>
                                        {
                                          fullData.requests.kyc_request
                                            .missing_kyc
                                        }
                                      </span>
                                      <p>Missing KYC</p>
                                    </NavLink>
                                  </div>
                                  <div className="roundedShapeContent">
                                    <NavLink to="/history_kyc">
                                      <span>
                                        {
                                          fullData.requests.kyc_request
                                            .total_kyc_request
                                        }
                                      </span>
                                      <p>Total KYC</p>
                                    </NavLink>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>

                      {/* <p className="main-heading">&nbsp;</p> */}
                    </Grid>

                    <Grid item md={6} lg={6} xl={6} sm={12}>
                      {/* <p className="main-heading">&nbsp;</p> */}
                      <Grid item md={12} lg={12} xl={12} sm={12}>
                        <Paper elevation={2} style={{ borderRadius: "10px" }}>
                          <CardContent className="py-3">
                            <div className="section-header">
                              <p className="section-title">
                                Deposit & Withdrawal
                              </p>
                            </div>
                            <div
                              className="text_fild_only_dash mobile_center_test"
                              style={{ marginTop: "0px" }}
                            >
                              <div>
                                <FormControl fullWidth variant="standard">
                                  <b>
                                    <label className="start-lable-size">
                                      Start Date
                                    </label>
                                  </b>
                                  <TextField
                                    id="standard-helperText"
                                    value={dateF.start_date}
                                    variant="outlined"
                                    size="small"
                                    className="small-start-date"
                                    onChange={(e) => {
                                      dateF.start_date = e.target.value;
                                      setDateF({ ...dateF });
                                    }}
                                    type="date"
                                  />
                                </FormControl>
                              </div>

                              <div>
                                <FormControl fullWidth variant="standard">
                                  <b>
                                    {" "}
                                    <label className="start-lable-size">
                                      End Date
                                    </label>
                                  </b>
                                  <TextField
                                    id="standard-helperText"
                                    variant="outlined"
                                    className="small-start-date"
                                    value={dateF.end_date}
                                    onChange={(e) => {
                                      dateF.end_date = e.target.value;
                                      setDateF({ ...dateF });
                                    }}
                                    type="date"
                                  />
                                </FormControl>
                              </div>
                              <div className="button-in-center1">
                                <ColorButton
                                  onClick={handleSearch}
                                  disabled={SmallLoader == true}
                                >
                                  Search
                                </ColorButton>
                              </div>
                            </div>
                            <Grid
                              container
                              spacing={2}
                              sx={{ marginTop: "0px" }}
                            >
                              <Grid item sm={12} md={12} lg={12}>
                                {SmallLoader == true ? (
                                  <CustomLoader />
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginTop: "10px",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <div
                                      className="th-div td-div_right fontsize-Deposit"
                                      style={{ display: "block" }}
                                    >
                                      <label>Deposit</label>
                                      <b>
                                        <div className="text-center">
                                          {
                                            fullData.deposit_withdrawal_amount
                                              .total_deposits
                                          }
                                        </div>
                                      </b>
                                    </div>
                                    <div
                                      className="th-div td-div_right fontsize-Deposit"
                                      style={{ display: "block" }}
                                    >
                                      <label>Withdrawal</label>
                                      <b>
                                        <div className="text-center">
                                          {
                                            fullData.deposit_withdrawal_amount
                                              .total_withdrawal
                                          }
                                        </div>
                                      </b>
                                    </div>
                                    <div
                                      className="th-div td-div_right fontsize-Deposit"
                                      style={{ display: "block" }}
                                    >
                                      <label>IB Withdrawal</label>
                                      <b>
                                        <div className="text-center">
                                          {
                                            fullData?.deposit_withdrawal_amount
                                              ?.total_ib_withdrawal
                                          }
                                        </div>
                                      </b>
                                    </div>
                                    <div
                                      className="th-div fontsize-Deposit"
                                      style={{ display: "block" }}
                                    >
                                      <label>Net D/W</label>
                                      <b>
                                        <div className="text-center">
                                          {
                                            fullData.deposit_withdrawal_amount
                                              .net_deposit_withdrawal
                                          }
                                        </div>
                                      </b>
                                    </div>
                                  </div>
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Paper>
                      </Grid>

                      <Grid container spacing={3} pt="24px">
                        <Grid item md={6} lg={6} xl={6} sm={12}>
                          <Paper elevation={2} style={{ borderRadius: "10px" }}>
                            <CardContent className="py-3">
                              <div className="section-header">
                                <p className="section-title">Leads</p>
                              </div>
                              <Grid container spacing={2}>
                                <Grid item sm={12} md={12} lg={12}>
                                  <div className="leadsContentSection">
                                    <div className="allLeadsNumner">
                                      <NavLink to="/leads_list">
                                        <b>
                                          {
                                            fullData.lead_count_request
                                              .total_lead_count_request
                                          }
                                        </b>
                                        <p>All</p>
                                      </NavLink>
                                    </div>
                                    <div className="leadRightContentSection">
                                      <div className="roundedShapeContent">
                                        <NavLink to="/leads_list/new">
                                          <span>
                                            {
                                              fullData.lead_count_request
                                                .assigned_leads
                                            }
                                          </span>
                                          <p>New</p>
                                        </NavLink>
                                      </div>
                                      <div className="roundedShapeContent">
                                        <NavLink to="/leads_list/unassigned">
                                          <span>
                                            {
                                              fullData.lead_count_request
                                                .unassigned_leads
                                            }
                                          </span>
                                          <p>Unassigned</p>
                                        </NavLink>
                                      </div>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Paper>
                        </Grid>
                        <Grid item md={6} lg={6} xl={6} sm={12}>
                          <Paper elevation={2} style={{ borderRadius: "10px" }}>
                            <CardContent className="py-3">
                              <div className="section-header">
                                <p className="section-title">Clients</p>
                              </div>
                              <Grid container spacing={2}>
                                <Grid item sm={12} md={12} lg={12}>
                                  <div className="leadsContentSection">
                                    <div className="allLeadsNumner">
                                      <NavLink to="/client_list">
                                        <b>
                                          {
                                            fullData.manager_assign
                                              .total_user_counts
                                          }
                                        </b>
                                        <p>All</p>
                                      </NavLink>
                                    </div>
                                    <div className="leadRightContentSection">
                                      <div className="roundedShapeContent">
                                        <NavLink to="/client_list/new">
                                          <span>
                                            {
                                              fullData.manager_assign
                                                .assigned_managers
                                            }
                                          </span>
                                          <p>New</p>
                                        </NavLink>
                                      </div>
                                      <div className="roundedShapeContent">
                                        <NavLink to="/client_list/unassigned">
                                          <span>
                                            {
                                              fullData.manager_assign
                                                .unassigned_managers
                                            }
                                          </span>
                                          <p>Unassigned</p>
                                        </NavLink>
                                      </div>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Paper>
                        </Grid>
                        {fullData?.show_ticket_data == 1 ? (
                          <Grid item md={12} lg={12} xl={12} sm={12}>
                            <Paper
                              elevation={2}
                              style={{ borderRadius: "10px" }}
                            >
                              <CardContent className="py-3">
                                <div className="section-header">
                                  <p className="section-title">Ticket</p>
                                </div>
                                <Grid container spacing={2}>
                                  <Grid item sm={12} md={12} lg={12}>
                                    <div className="leadsContentSection">
                                      <div className="allLeadsNumner">
                                        <NavLink to="/client_list">
                                          <b>
                                            {
                                              fullData.ticket_data
                                                .total_ticket_request
                                            }
                                          </b>
                                          <p>All</p>
                                        </NavLink>
                                      </div>
                                      <div className="leadRightContentSection">
                                        <div className="roundedShapeContent">
                                          <NavLink to="/ticket">
                                            <span>
                                              {
                                                fullData.ticket_data
                                                  .ticket_open_request
                                              }
                                            </span>
                                            <p>Open Request</p>
                                          </NavLink>
                                        </div>
                                        <div className="roundedShapeContent">
                                          <NavLink to="/ticket">
                                            <span>
                                              {
                                                fullData.ticket_data
                                                  .ticket_closed_request
                                              }
                                            </span>
                                            <p>Closed Request</p>
                                          </NavLink>
                                        </div>
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Paper>
                          </Grid>
                        ) : (
                          ""
                        )}

                        {/* <Grid item md={12} lg={12} xl={12} sm={12}>
                          <Paper elevation={2} style={{ borderRadius: "10px" }}>
                            <CardContent className="py-3">
                              <div className="section-header">
                                <p className="section-title">Ticket</p>
                              </div>
                              <Grid container spacing={2}>
                                <Grid item sm={12} md={12} lg={12}>
                                  <div className="leadsContentSection">
                                    <div className="allLeadsNumner">
                                      <NavLink to="/client_list">
                                        <b>
                                          {
                                            fullData.ticket_data
                                              .total_ticket_request
                                          }
                                        </b>
                                        <p>All</p>
                                      </NavLink>
                                    </div>
                                    <div className="leadRightContentSection">
                                      <div className="roundedShapeContent">
                                        <NavLink to="/ticket">
                                          <span>
                                            {
                                              fullData.ticket_data
                                                .ticket_open_request
                                            }
                                          </span>
                                          <p>Open Request</p>
                                        </NavLink>
                                      </div>
                                      <div className="roundedShapeContent">
                                        <NavLink to="/ticket">
                                          <span>
                                            {
                                              fullData.ticket_data
                                                .ticket_closed_request
                                            }
                                          </span>
                                          <p>Closed Request</p>
                                        </NavLink>
                                      </div>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Paper>
                        </Grid> */}
                      </Grid>
                      <Grid item md={12} lg={12} xl={12} sm={12}>
                        <Paper
                          elevation={2}
                          style={{ borderRadius: "10px", marginTop: "24px" }}
                        >
                          <CardContent className="py-3">
                            <div className="section-header">
                              <p className="section-title">Bonus Claimed</p>
                            </div>
                            <div
                              className="text_fild_only_dash mobile_center_test"
                              style={{ marginTop: "0" }}
                            >
                              <div>
                                <FormControl fullWidth variant="standard">
                                  <b>
                                    <label className="start-lable-size">
                                      Start Date
                                    </label>
                                  </b>
                                  <TextField
                                    id="standard-helperText"
                                    value={dateF1.start_date}
                                    variant="outlined"
                                    className="small-start-date"
                                    onChange={(e) => {
                                      dateF1.start_date = e.target.value;
                                      setDateF1({ ...dateF1 });
                                    }}
                                    type="date"
                                  />
                                </FormControl>
                              </div>

                              <div>
                                <FormControl fullWidth variant="standard">
                                  <b>
                                    {" "}
                                    <label className="start-lable-size">
                                      End Date
                                    </label>
                                  </b>
                                  <TextField
                                    id="standard-helperText"
                                    variant="outlined"
                                    value={dateF1.end_date}
                                    className="small-start-date"
                                    onChange={(e) => {
                                      dateF1.end_date = e.target.value;
                                      setDateF1({ ...dateF1 });
                                    }}
                                    type="date"
                                  />
                                </FormControl>
                              </div>
                              <div className="button-in-center1">
                                <ColorButton
                                  onClick={handleSearch1}
                                  disabled={SmallLoader1 == true}
                                >
                                  Search
                                </ColorButton>
                              </div>
                            </div>
                            <Grid container spacing={2}>
                              <Grid item sm={12} md={12} lg={12}>
                                {SmallLoader1 == true ? (
                                  <CustomLoader />
                                ) : (
                                  <div
                                    className="leadsContentSection kyc-document"
                                    style={{ marginTop: "20px" }}
                                  >
                                    <div className="leadRightContentSection">
                                      <div className="roundedShapeContent">
                                        <NavLink to="/BonusList">
                                          <span>
                                            {
                                              fullData.deposit_bonus_claim_data
                                                .total_accounts
                                            }
                                          </span>
                                          <p>Total Account</p>
                                        </NavLink>
                                      </div>
                                      <div className="roundedShapeContent">
                                        <NavLink to="/BonusList">
                                          <span>
                                            {
                                              fullData.deposit_bonus_claim_data
                                                .bonus_claimed
                                            }
                                          </span>
                                          <p>Bonus Claimed</p>
                                        </NavLink>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* <Grid item md={12} lg={12} xl={12} sm={12}>
                      <p className="main-heading">&nbsp;</p>
                      <Paper
                        elevation={2}
                        style={{ borderRadius: "10px", height: "100%" }}
                      >
                        <CardContent className="py-3">
                          <div className="section-header">
                            <p className="section-title montly-sales-target">
                              Monthly Sales Target
                            </p>
                            <div className="section-action-button">
                              <span className="action">ACCOUNT TARGET</span>
                              <span>MONEY IN</span>
                              <span>MONEY OUT</span>
                              <span>NET</span>
                            </div>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={12}>
                              <div className="remainderContentSection"></div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Paper>
                    </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
