import React, { useState, useEffect } from "react";
import {
  CardContent,
  FormControl,
  Grid,
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import NewDate from "../common/NewDate";

const BasicReport = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [salesAgent, setSalesAgent] = useState("");
  const [groupList, setGroupList] = useState([]);

  const [searchBy, setSearchBy] = useState([
    {
      label: "Name",
      value: false,
      name: "user_name",
    },
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    {
      label: "Phone",
      value: false,
      name: "user_phone",
    },
    {
      label: "MT5",
      value: false,
      name: "user_mt5",
    },
    {
      label: "Total Deposit",
      value: false,
      name: "total_deposit",
    },
    {
      label: "Total Withdraw",
      value: false,
      name: "total_withdraw",
    },
    {
      label: "Bonus In",
      value: false,
      name: "bonus_in",
    },
    {
      label: "Bonus Out",
      value: false,
      name: "bonus_out",
    },
    {
      label: "Remark",
      value: false,
      name: "user_remarks",
    },
    {
      label: "Equity",
      value: false,
      name: "equity",
    },
    {
      label: "Lot Size",
      value: false,
      name: "lot_size",
    },
    {
      label: "Wallet Balance",
      value: false,
      name: "wallet_balance",
    },
    {
      label: "P&L",
      value: false,
      name: "row.pnl",
    },
    {
      label: "Net P&L",
      value: false,
      name: "net_pnl",
    },
    {
      label: "Group Name",
      value: false,
      name: "mt5_group_name",
    },
    {
      label: "Sales Person Name",
      value: false,
      name: "sales_person_name",
    },
    {
      label: "Ib Name",
      value: false,
      name: "ib_name",
    },
    {
      label: "Total Trade Count",
      value: false,
      name: "total_trade_count",
    },
  ]);
  const [resData, setResData] = useState({});
  toast.configure();

  const column = [
    {
      name: "Name",
      selector: (row) => {
        return <span>{row.user_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "Email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Phone",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "MT5",
      selector: (row) => {
        return <span title={row.user_mt5}>{row.user_mt5}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "days Account From",
      selector: (row) => {
        return (
          <span title={row.days_account_from}>{row.days_account_from}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Highest Traded Pair",
      selector: (row) => {
        return (
          <span title={row.highest_traded_pair}>{row.highest_traded_pair}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "one Minute Trades",
      selector: (row) => {
        return (
          <span title={row.total_trade_closed_in_minusts}>
            {row.total_trade_closed_in_minusts}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Deposit",
      selector: (row) => {
        return <span title={row.total_deposit}>${row.total_deposit}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Withdraw",
      selector: (row) => {
        return <span title={row.total_withdraw}>${row.total_withdraw}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Credit In",
      selector: (row) => {
        return <span title={row.bonus_in}>${row.bonus_in}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Credit Out",
      selector: (row) => {
        return <span title={row.bonus_out}>${row.bonus_out}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Remark",
      selector: (row) => {
        return <span title={row.user_remarks}>{row.user_remarks}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Equity",
      selector: (row) => {
        return <span title={row.equity}>${row.equity}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Lot Size",
      selector: (row) => {
        return <span title={row.lot_size}>{row.lot_size}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Wallet Balance",
      selector: (row) => {
        return <span title={row.wallet_balance}>{row.wallet_balance}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "P&L",
      selector: (row) => {
        return <span title={row.pnl}>{row.pnl}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Net P&L",
      selector: (row) => {
        return <span title={row.net_pnl}>{row.net_pnl}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <span title={row.register_date}>
            <NewDate newDate={row.register_date} />
          </span>
        );
      },
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "User Group",
      selector: (row) => {
        return <span title={row.user_group_name}>{row.user_group_name}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Group Name",
      selector: (row) => {
        return <span title={row.mt5_group_name}>{row.mt5_group_name}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Sales Person Name",
      selector: (row) => {
        return (
          <span title={row.sales_person_name}>{row.sales_person_name}</span>
        );
      },
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Rebate",
      selector: (row) => {
        return <span title={row.rebate}>{row.rebate}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Ib Name",
      selector: (row) => {
        return <span title={row.ib_name}>{row.ib_name}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Trade Count",
      selector: (row) => {
        return (
          <span title={row.total_trade_count}>{row.total_trade_count}</span>
        );
      },
      reorder: true,
      grow: 0.3,
    },
  ];

  const getUserGroup = async () => {
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
          setGroupList([...resData.data.group_data]);
        }
        return true;
      });
  };

  useEffect(() => {
    getUserGroup();
  }, []);
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">All In One Report</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  salesAgent={setSalesAgent}
                  userGroup={groupList}
                />
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
                          url={`${Url}/datatable/basic_reports.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          setResData={setResData}
                          salesAgent={salesAgent}
                          csv="datatable/basic_reports_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid container>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.bonus_in_sum}</h5>
                              <p className="no-margin">Total Credit in</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.bonus_out_sum}</h5>
                              <p className="no-margin">Total Credit out</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.deposit_sum}</h5>
                              <p className="no-margin">Total deposit</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.equity_sum}</h5>
                              <p className="no-margin">Total equity</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.lot_sum}</h5>
                              <p className="no-margin">Total lot</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>{" "}
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.net_pnl_sum}</h5>
                              <p className="no-margin">Total net P&l</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>{" "}
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.pnl_sum}</h5>
                              <p className="no-margin">Total P&l</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>{" "}
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.wallet_balance_sum}
                              </h5>
                              <p className="no-margin">Total wallet balance</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>{" "}
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.withdraw_sum}</h5>
                              <p className="no-margin">Total withdraw</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicReport;
