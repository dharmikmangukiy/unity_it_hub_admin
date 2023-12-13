import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../../global.js";
import axios from "axios";
import "./trandestatistics.css";
import { useNavigate } from "react-router-dom";
const TradeStatistics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  useEffect(() => {
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    axios
      .post(`${Url}/ajaxfiles/trading_statistics_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setData(res.data);
      });
  }, []);
  return (
    <div className="setBoxs">
      {" "}
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.total_lot}</h5>
              <p className="no-margin">Total Lot</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.total_trade} </h5>
              <p className="no-margin">Total Trade</p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.total_admin_get}</h5>
              <p className="no-margin">Total Admin Get</p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.total_ib_passon} </h5>
              <p className="no-margin">Total Id Passon</p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.total_partnership_main_interest} </h5>
              <p className="no-margin">Total Partnership Main Interest</p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.total_partnership_level} </h5>
              <p className="no-margin">Total Partnership Level</p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row1 boxSection">
        <div className="card padding-9 animate fadeLeft boxsize">
          <div className="row">
            <div className="col s12 m12 text-align-center">
              <h5 className="mb-0">{data.admin_partnership_income}</h5>
              <p className="no-margin">Total Admin Partnership Income</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeStatistics;
