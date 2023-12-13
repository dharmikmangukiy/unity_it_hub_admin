import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CardContent, FormControl, Grid, Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import CommonTable from "../common/CommonTable";
import { BootstrapInput } from "../common/CustomElement";

const Statement = (prop) => {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(false);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [sdate, setSDate] = useState({
    start_date: "",
    end_date: "",
  });
  const [sdate1, setSDate1] = useState({
    start_date: "",
    end_date: "",
  });
  const column = [
    {
      name: "client name",
      selector: (row) => {
        return <span title={row.client_name}>{row.client_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "client type",
      selector: (row) => {
        return <span title={row.client_type}>{row.client_type}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },

    {
      name: "LOT",
      selector: (row) => {
        return <span title={row.total_lot_size}>{row.total_lot_size}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "rebate",
      selector: (row) => {
        return (
          <span title={row.total_rebate_generated}>
            {row.total_rebate_generated}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "commission",
      selector: (row) => {
        return <span title={row.total_commission}>{row.total_commission}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];
  const column1 = [
    {
      name: "MT5 account",
      selector: (row) => {
        return <span title={row.mt5_account_id}>{row.mt5_account_id}</span>;
      },
      sortable: true,
      //  wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "symbol",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },

    {
      name: "order number",
      selector: (row) => {
        return <span title={row.order_no}>{row.order_no}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "volume",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "trade_profit",
      selector: (row) => {
        return <span title={row.trade_profit}>{row.trade_profit}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];
  const [mt5accounts, setMt5Account] = useState({
    data: [],
    total: {},
    // total:{
    //     rebate_generated:0,
    //     rebate_withdraw:0,
    //     total:0,
    //     total_deposit:0,
    //     total_lot:0,
    //     total_withdraw:0
    // }
  });
  const navigate = useNavigate();
  const [statement, setStatement] = useState({
    data: [],
    structure_name: "",
    structure_id: "",
    masterData: {},
  });
  const [userData, setuserData] = useState({ isLoader: true, data: {} });
  const handleClose = () => {
    setOpen(false);
  };
  const getStatementData = async (structure_id) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("user_id", prop.id);
    // param.append("structure_id", structure_id);
    param.append("action", "my_referrals");
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
          statement.data = res.data.data;
          statement.masterData = res.data;

          setStatement({ ...statement });
        }
      });
  };
  useEffect(() => {
    getStatementData();
  }, []);

  return (
    <div>
      {/* <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh"> */}
      <Grid container spacing={3} className="grid-handle">
        <Grid item md={12} lg={12} xl={12}>
          <Paper
            elevation={2}
            style={{ borderRadius: "10px" }}
            className="paper-main-section"
          >
            <div className="headerSection header-title">
              <p className="margin-0">Statement</p>
            </div>
            <div className="statementdate">
              <FormControl>
                <label className="small font-weight-bold text-dark">From</label>
                <BootstrapInput
                  type="date"
                  onChange={(e) => {
                    sdate1.start_date = e.target.value;
                    setSDate1({ ...sdate1 });
                  }}
                ></BootstrapInput>
              </FormControl>
              <FormControl>
                <label className="small font-weight-bold text-dark">To</label>
                <BootstrapInput
                  type="date"
                  onChange={(e) => {
                    sdate1.end_date = e.target.value;
                    setSDate1({ ...sdate1 });
                  }}
                ></BootstrapInput>
              </FormControl>
            </div>
            <CardContent className="py-3">
              <Grid container spacing={2}>
                <Grid item sm={12} md={12} lg={12}>
                  <CommonTable
                    url={`${Url}/datatable/user_statements.php`}
                    //   setResData={setResData}
                    column={column}
                    sort="0"
                    userId={prop.id}
                    //   refresh={refresh}
                    //   search={searchBy}
                    param={sdate1}
                    //   searchWord={searchKeyword}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <hr />{" "}
            <div className="statementdate">
              <FormControl>
                <label className="small font-weight-bold text-dark">From</label>
                <BootstrapInput
                  type="date"
                  onChange={(e) => {
                    sdate.start_date = e.target.value;
                    setSDate({ ...sdate });
                  }}
                ></BootstrapInput>
              </FormControl>
              <FormControl>
                <label className="small font-weight-bold text-dark">To</label>
                <BootstrapInput
                  type="date"
                  onChange={(e) => {
                    sdate.end_date = e.target.value;
                    setSDate({ ...sdate });
                  }}
                ></BootstrapInput>{" "}
              </FormControl>
            </div>
            <CardContent className="py-3">
              <Grid container spacing={2}>
                <Grid item sm={12} md={12} lg={12}>
                  <CommonTable
                    url={`${Url}/datatable/user_statements_trades.php`}
                    //   setResData={setResData}
                    column={column1}
                    sort="0"
                    userId={prop.id}
                    //   refresh={refresh}
                    //   search={searchBy}
                    param={sdate}
                    //   searchWord={searchKeyword}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
      {/* </div>
      </div> */}
    </div>
  );
};

export default Statement;
