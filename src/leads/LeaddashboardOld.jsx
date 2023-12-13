import React, { useEffect, useState } from "react";
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
import { NavLink, Navigate } from "react-router-dom";
import { IsApprove, Url } from "../global";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { ColorButton } from "../common/CustomElement";

function Leaddashboard() {
  const [DashData, setDashData] = useState("");
  const [pageLoader, setPageLoader] = useState(true);
  const [dateF, setDateF] = useState({
    start_date: "",
    end_date: "",
  });
  const dashboardData = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("start_date", dateF.start_date);
    param.append("end_date", dateF.end_date);

    setPageLoader(true);
    axios.post(Url + "/ajaxfiles/lead_dashboard.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        Navigate("/");
      } else {
        setDashData(res.data);
        setPageLoader(false);
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
          {pageLoader == true ? (
            <div className="loader">
              <div className="clock">
                <div className="pointers"></div>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 1 }}>
              <Grid container justifyContent="start">
                <Grid item md={12} lg={12} xl={12}>
                  <p className="main-heading">Lead Dashboard</p>
                  <Paper>
                    <div>
                      <div className="text_fild_only_dash">
                        <div>
                          <FormControl
                            fullWidth
                            sx={{ m: 4 }}
                            variant="standard"
                          >
                            <b>
                              <label>Start Date</label>
                            </b>
                            <TextField
                              id="standard-helperText"
                              variant="outlined"
                              onChange={(e) => {
                                dateF.start_date = e.target.value;
                                setDateF({ ...dateF });
                              }}
                              type="date"
                            />
                          </FormControl>
                        </div>

                        <div>
                          <FormControl
                            fullWidth
                            sx={{ m: 4 }}
                            variant="standard"
                          >
                            <b>
                              {" "}
                              <label>End Date</label>
                            </b>
                            <TextField
                              id="standard-helperText"
                              variant="outlined"
                              onChange={(e) => {
                                dateF.end_date = e.target.value;
                                setDateF({ ...dateF });
                              }}
                              type="date"
                            />
                          </FormControl>
                        </div>
                        <div className="button-in-center">
                          <ColorButton
                            onClick={() => {
                              dashboardData();
                            }}
                          >
                            Search
                          </ColorButton>
                        </div>
                      </div>

                      <div className="dashbord_box">
                        <div className="row1 boxSection">
                          <div className="card padding-9 animate fadeLeft boxsize">
                            <div className="row">
                              <NavLink to="/pamm_mm_management">
                                <div className="col s12 m12 text-align-center">
                                  <h5 className="mb-0">
                                    ${" "}
                                    {parseFloat(DashData.total_deposit).toFixed(
                                      2
                                    )}
                                  </h5>
                                  <p className="no-margin">Deposite</p>
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
                                    ${" "}
                                    {parseFloat(
                                      DashData.total_withdraw
                                    ).toFixed(2)}
                                  </h5>
                                  <p className="no-margin">Withdrow</p>
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
                                    ${" "}
                                    {parseFloat(DashData.net_amount).toFixed(2)}
                                  </h5>
                                  <p className="no-margin">Net</p>
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
                                    {DashData.total_lead_request}
                                  </h5>
                                  <p className="no-margin">Total Lead</p>
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
                                    {DashData.converted_lead}
                                  </h5>
                                  <p className="no-margin">Convert Client</p>
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
                                  <h5 className="mb-0">{DashData.ac_target}</h5>
                                  <p className="no-margin">Target</p>
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
                                    {DashData.ac_target_achived}
                                  </h5>
                                  <p className="no-margin">Achived</p>
                                </div>
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </Grid>

                <Grid
                  item
                  md={6}
                  lg={6}
                  xl={6}
                  sm={12}
                  mt={2}
                  style={{ height: "100%" }}
                >
                  <Paper
                    elevation={2}
                    style={{
                      borderRadius: "10px",
                      height: "100%",
                      width: "96%",
                    }}
                  >
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Leads</p>
                      </div>
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={12} lg={12}>
                          <div className="leadsContentSection">
                            <div className="allLeadsNumner">
                              <NavLink to="/leads_list">
                                <b>{DashData.today_leads}</b>
                                <p>All</p>
                              </NavLink>
                            </div>
                            <div className="leadRightContentSection">
                              <div className="roundedShapeContent">
                                <NavLink to="/leads_list/new">
                                  <span>0</span>
                                  <p>New</p>
                                </NavLink>
                              </div>
                              <div className="roundedShapeContent">
                                <NavLink to="/leads_list/unassigned">
                                  <span>0</span>
                                  <p>Prospect</p>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>

              <div className="main_calss_only_dash">
                <div className="width_new_dash">
                  <Grid
                    item
                    md={6}
                    lg={6}
                    xl={6}
                    sm={12}
                    mt={2}
                    style={{ height: "100%" }}
                  >
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px", height: "100%" }}
                    >
                      <CardContent className="py-3">
                        <div className="section-header">
                          <p className="section-title">Lead by Source</p>
                        </div>
                        <div className="remainderContentSection">
                          <div className="th-div3">
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Source Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Source Count
                            </label>
                          </div>
                          {DashData.lead_by_source_list.map((item) => {
                            return (
                              <div className="th-div3 td-div">
                                <label>{item.source_name}</label>
                                <label>{item.source_count}</label>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Paper>
                  </Grid>
                </div>

                <div className="width_new_dash">
                  <Grid
                    item
                    md={6}
                    lg={6}
                    xl={6}
                    sm={12}
                    mt={2}
                    style={{ height: "100%" }}
                  >
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px", height: "100%" }}
                    >
                      <CardContent className="py-3">
                        <div className="section-header">
                          <p className="section-title">Lead by Country</p>
                        </div>
                        <div className="remainderContentSection">
                          <div className="th-div2">
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Country Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Country Lead Count
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Country Converted
                            </label>
                          </div>
                          {DashData.lead_by_country_list.map((item) => {
                            return (
                              <div className="th-div2 td-div">
                                <label>{item.country_name}</label>
                                <label>{item.country_lead_count}</label>
                                <label>{item.lead_by_country_converted}</label>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Paper>
                  </Grid>
                </div>
              </div>
              <div className="main_calss_only_dash">
                <div className="width_new_dash">
                  <Grid
                    item
                    md={6}
                    lg={6}
                    xl={6}
                    sm={12}
                    mt={2}
                    style={{ height: "100%" }}
                  >
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px", height: "100%" }}
                    >
                      <CardContent className="py-3">
                        <div className="section-header">
                          <p className="section-title">Overall Lead Funnel</p>
                        </div>
                        <div className="remainderContentSection">
                          <div className="th-div3">
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Stage Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #4e3f90" }}
                            >
                              Leads by Stage
                            </label>
                          </div>
                          {DashData.overall_lead_funnel.slice(1).map((item) => {
                            return (
                              <div className="th-div3 td-div">
                                <label>{item.stage_name}</label>
                                <label>{item.leads_by_stage}</label>
                              </div>
                            );
                          })}
                          <div className="th-div3 td-div">
                            <label>
                              {DashData.overall_lead_funnel[0].toal_leads}
                            </label>
                            <label>
                              {DashData.overall_lead_funnel[0].leads_by_stage}
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Paper>
                  </Grid>
                </div>

                <div className="width_new_dash">
                  <Grid
                    item
                    md={6}
                    lg={6}
                    xl={6}
                    sm={12}
                    mt={2}
                    style={{ height: "100%" }}
                  >
                    <Paper
                      elevation={2}
                      style={{ borderRadius: "10px", height: "100%" }}
                    >
                      <CardContent className="py-3">
                        <div className="section-header">
                          <p className="section-title">Task Summary</p>
                        </div>
                        <div className="remainderContentSection">
                          <div className="th-div3 td-div">
                            <label>Total Incomplate Task</label>
                            <label>
                              {DashData.task_summary.total_incompleted_task}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Leads</label>
                            <label>{DashData.task_summary.total_leads}</label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Leads Converted</label>
                            <label>
                              {DashData.task_summary.total_leads_converted}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Overdue Task</label>
                            <label>
                              {DashData.task_summary.total_overdue_task}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Pending</label>
                            <label>{DashData.task_summary.total_pending}</label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Salse Person</label>
                            <label>
                              {DashData.task_summary.total_sales_person}
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Paper>
                  </Grid>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaddashboard;
