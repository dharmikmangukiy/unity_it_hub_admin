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
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { IsApprove, Url } from "../global";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { ColorButton } from "../common/CustomElement";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { keyframes } from "styled-components";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  margin: 16px;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

function Leaddashboard() {
  const navigate = useNavigate();
  const [DashData, setDashData] = useState("");
  const [pageLoader, setPageLoader] = useState(true);
  const [SmallLoader, setSmallLoader] = useState(true);
  const [dateF, setDateF] = useState({
    start_date: "",
    end_date: "",
  });

  const CustomLoader = () => (
    <div style={{ padding: "1%" }}>
      <center>
        <Spinner />
        <b>Loading...</b>
      </center>
    </div>
  );

  const dashboardData = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }

    // setPageLoader(true);
    axios.post(Url + "/ajaxfiles/lead_dashboard.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        navigate("/");
      } else {
        setDashData(res.data);
        setPageLoader(false);
        setSmallLoader(false);
      }
    });
  };
  toast.configure();
  useEffect(() => {
    dashboardData();
  }, []);

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
              <Grid container spacing={3}>
                <Grid item md={12}>
                  <div>
                    <p className="main-heading">Lead Dashboard</p>

                    <Paper style={{ borderRadius: "10px", height: "100%" ,padding:"16px"}}>
                      <div>
                        <div
                          className="text_fild_only_dash mobile_center_test "
                          style={{ marginTop: "0px", padding: "16px" }}
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
                                className="small-start-date_lead"
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
                                value={dateF.end_date}
                                className="small-start-date_lead"
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
                              onClick={handleSearch}
                              disabled={SmallLoader == true}
                            >
                              Search
                            </ColorButton>
                          </div>
                        </div>

                        {SmallLoader == true ? (
                          <CustomLoader />
                        ) : (
                          <div className="dashbord_box">
                            <div className="row1 boxSection">
                              <div className="card padding-9 animate fadeLeft boxsize">
                                <div className="row">
                                  {/* <NavLink to="/pamm_mm_management"> */}
                                  <div className="col s12 m12 text-align-center">
                                    <h5 className="mb-0">
                                      ${" "}
                                      {parseFloat(
                                        DashData.total_deposit
                                      ).toFixed(2)}
                                    </h5>
                                    <p className="no-margin">Deposit</p>
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
                                      ${" "}
                                      {parseFloat(
                                        DashData.total_withdraw
                                      ).toFixed(2)}
                                    </h5>
                                    <p className="no-margin">Withdraw</p>
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
                                      ${" "}
                                      {parseFloat(DashData.net_amount).toFixed(
                                        2
                                      )}
                                    </h5>
                                    <p className="no-margin">Net</p>
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
                                      {DashData.total_lead_request}
                                    </h5>
                                    <p className="no-margin">Total Lead</p>
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
                                      {DashData.converted_lead}
                                    </h5>
                                    <p className="no-margin">Convert Client</p>
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
                                      {DashData.ac_target}
                                    </h5>
                                    <p className="no-margin">Target</p>
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
                                      {DashData.ac_target_achived}
                                    </h5>
                                    <p className="no-margin">Achived</p>
                                  </div>
                                  {/* </NavLink> */}
                                </div>
                              </div>
                            </div>

                            <div className="row1 boxSection">
                              <div className="card padding-9 animate fadeLeft boxsize">
                                <div className="row">
                                  <NavLink to="/client_list/todays_closed">
                                    <div className="col s12 m12 text-align-center">
                                      <h5 className="mb-0">
                                        {DashData.todays_closed_leads}
                                      </h5>
                                      <p className="no-margin">Closed Leads</p>
                                    </div>
                                  </NavLink>
                                </div>
                              </div>
                            </div>
                            <div className="row1 boxSection">
                              <div className="card padding-9 animate fadeLeft boxsize">
                                <div className="row">
                                  <NavLink to="/leads_list/removed_leads">
                                    <div className="col s12 m12 text-align-center">
                                      <h5 className="mb-0">
                                        {DashData?.todays_removed_leads}
                                      </h5>
                                      <p className="no-margin">Removed Leads</p>
                                    </div>
                                  </NavLink>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Paper>
                  </div>
                </Grid>

                {/* <Grid item md={6} lg={6} xl={6} sm={12} mt={2} style={{height:"100%"}}>
                  <Paper elevation={2} style={{ borderRadius: "10px",height:"100%",width:"96%" }}>
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Leads</p>
                      </div>
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={12} lg={12}>
                          <div className="leadsContentSection">
                            <div className="allLeadsNumner">
                              // <NavLink to="/leads_list">
                                <b>{DashData.today_leads}</b>
                                <p>All</p>
                              // </NavLink>
                            </div>
                            <div className="leadRightContentSection">
                              <div className="roundedShapeContent">
                                // <NavLink to="/leads_list/new">
                                  <span>0</span>
                                  <p>New</p>
                                // </NavLink>
                              </div>
                              <div className="roundedShapeContent">
                                // <NavLink to="/leads_list/unassigned">
                                  <span>0</span>
                                  <p>Prospect</p>
                                // </NavLink>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Paper>
                </Grid> */}
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} mt={2}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px", height: "100%" }}
                  >
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Lead by Source</p>
                      </div>
                      {SmallLoader == true ? (
                        <CustomLoader />
                      ) : (
                        <div className="remainderContentSection">
                          <div className="th-div3">
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Source Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Source Count
                            </label>
                          </div>
                          {DashData.lead_by_source_list?.map((item) => {
                            return (
                              <div className="th-div3 td-div">
                                <label>{item.source_name}</label>
                                <label
                                  className="nav-link"
                                  onClick={() => {
                                    navigate(
                                      `/leads_list/source_id/${item.source_name}`
                                    );
                                  }}
                                >
                                  {item.source_count}
                                </label>
                              </div>
                            );
                          })}
                          {DashData?.lead_by_source_list?.length >= 10 ? (
                            <div className="text-end">
                              <NavLink
                                className="link-lead-dash"
                                to="/Lead_by_sources"
                              >
                                View More
                              </NavLink>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item md={6} mt={2}>
                  <Paper
                    style={{ borderRadius: "10px", height: "100%" }}

                    // elevation={2}
                    // style={{ borderRadius: "10px", height: "100%" }}
                  >
                    <CardContent>
                      <div className="section-header">
                        <p className="section-title">Reminders</p>
                        {/* <p className="section-count">4</p> */}
                      </div>
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={12} lg={12}>
                          <div className="remainderContentSection">
                            {DashData?.reminder_data?.map((item, index) => {
                              return (
                                <>
                                  <div className="remainder">
                                    <i className="material-icons">textsms</i>

                                    <div className="content">
                                      <p>{item.remarks}</p>
                                      <p>{item.customer_name}</p>
                                      <p>{item.followup_datetime}</p>
                                    </div>
                                  </div>
                                  <hr />
                                </>
                              );
                            })}

                            {/* <div className="remainder">
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
                            <hr /> */}
                            {DashData?.reminder_data ? (
                              DashData?.reminder_data.length > 0 ? (
                                <div className="moreRemainderSection">
                                  <span onClick={() => navigate("/Reminders")}>
                                    More
                                  </span>
                                </div>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                {/* <Grid item md={6} mt={2}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px", height: "100%" }}
                  >
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Overall Lead Funnel</p>
                      </div>
                      {SmallLoader == true ? (
                        <CustomLoader />
                      ) : (
                        <div className="remainderContentSection">
                          <div className="th-div3">
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Stage Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Leads by Stage
                            </label>
                          </div>
                          {DashData.overall_lead_funnel
                            .slice(1)
                            ?.map((item) => {
                              return (
                                <div className="th-div3 td-div">
                                  <label>{item.stage_name}</label>
                                  <label
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      navigate(
                                        `/leads_list/lead_stage/${item.stage_name}`
                                      );
                                    }}
                                  >
                                    {item.leads_by_stage}
                                  </label>
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
                      )}
                    </CardContent>
                  </Paper>
                </Grid> */}
                <Grid item md={6} mt={2}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px", height: "100%" }}
                  >
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Lead by Country</p>
                      </div>
                      {SmallLoader == true ? (
                        <CustomLoader />
                      ) : (
                        <div className="remainderContentSection">
                          <div className="th-div2">
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Country Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Country Lead Count
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Country Converted
                            </label>
                          </div>
                          {DashData.lead_by_country_list?.map((item) => {
                            return (
                              <div className="th-div2 td-div">
                                <label>{item.country_name}</label>
                                <label
                                  className="nav-link"
                                  onClick={() => {
                                    navigate(
                                      `/leads_list/country_lead_count/${item.country_name}`
                                    );
                                  }}
                                >
                                  {item.country_lead_count}
                                </label>
                                <label>{item.lead_by_country_converted}</label>
                              </div>
                            );
                          })}
                          {DashData?.lead_by_country_list?.length >= 10 ? (
                            <div className="text-end">
                              <NavLink
                                className="link-lead-dash"
                                to="/lead_by_country"
                              >
                                View More
                              </NavLink>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item md={6} mt={2}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px", height: "100%" }}
                  >
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Task Summary</p>
                      </div>
                      {SmallLoader == true ? (
                        <CustomLoader />
                      ) : (
                        <div className="remainderContentSection">
                          <div className="th-div3 td-div">
                            <label>Total Incomplate Task</label>
                            <label
                              className="nav-link"
                              onClick={() => {
                                navigate(
                                  `/leads_list/task_summary/Total Incomplate Task`
                                );
                              }}
                            >
                              {DashData.task_summary.total_incompleted_task}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Leads</label>
                            <label
                              className="nav-link"
                              onClick={() => {
                                navigate(
                                  `/leads_list/task_summary/Total Leads`
                                );
                              }}
                            >
                              {DashData.task_summary.total_leads}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Leads Converted</label>
                            <label
                              className="nav-link"
                              onClick={() => {
                                navigate(
                                  `/leads_list/task_summary/Total Leads Converted`
                                );
                              }}
                            >
                              {DashData.task_summary.total_leads_converted}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Overdue Task</label>
                            <label
                              className="nav-link"
                              onClick={() => {
                                navigate(
                                  `/leads_list/task_summary/Total Overdue Task`
                                );
                              }}
                            >
                              {DashData.task_summary.total_overdue_task}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Pending</label>
                            <label
                              className="nav-link"
                              onClick={() => {
                                navigate(
                                  `/leads_list/task_summary/Total Pending`
                                );
                              }}
                            >
                              {DashData.task_summary.total_pending}
                            </label>
                          </div>
                          <div className="th-div3 td-div">
                            <label>Total Salse Person</label>
                            <label
                              className="nav-link"
                              onClick={() => {
                                navigate(
                                  `/leads_list/task_summary/Total Salse Person`
                                );
                              }}
                            >
                              {DashData.task_summary.total_sales_person}
                            </label>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6} mt={2}>
                  <Paper
                    elevation={2}
                    style={{ borderRadius: "10px", height: "100%" }}
                  >
                    <CardContent className="py-3">
                      <div className="section-header">
                        <p className="section-title">Overall Lead Funnel</p>
                      </div>
                      {SmallLoader == true ? (
                        <CustomLoader />
                      ) : (
                        <div className="remainderContentSection">
                          <div className="th-div3">
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Stage Name
                            </label>
                            <label
                              style={{ borderBottom: "2px solid #ED6000" }}
                            >
                              Leads by Stage
                            </label>
                          </div>
                          {DashData.overall_lead_funnel
                            .slice(1)
                            ?.map((item) => {
                              return (
                                <div className="th-div3 td-div">
                                  <label>{item.stage_name}</label>
                                  <label
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      navigate(
                                        `/leads_list/lead_stage/${item.stage_name}`
                                      );
                                    }}
                                  >
                                    {item.leads_by_stage}
                                  </label>
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
                      )}
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaddashboard;
