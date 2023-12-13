import "./notification.css";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Notification = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [withoutButton, setWithoutButton] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "DESCRIPTION",
      value: false,
      name: "description",
    },
  ]);
  const [page, setPage] = useState({
    index: "",
    totalPage: 0,
    search: "",
  });
  const [param, setParam] = useState("");
  const loader = useRef(null);
  var search = "";

  toast.configure();

  useEffect(() => {
    fatchdata();
  }, []);

  const handleObserver = useCallback((entries) => {}, []);

  useEffect(() => {
    if (searchKeyword != "") {
      page.index = 0;
    }
    setPage({ ...page });
    fatchdata(page.index, param.start_date, param.end_date);
  }, [param, searchKeyword]);

  /* useEffect(() => {
    fatchdata(page.index, param.start_date, param.end_date);
  }, [searchKeyword]); */

  const makeAsRead = async (item, index) => {
    // toast.error(item)
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("action", "mark_as_read");
    param.append("id", item.notification_id.index);
    await axios
      .post(`${Url}/ajaxfiles/notification_manage.php`, param)
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
          setWithoutButton((prev) => [item, ...prev]);
          toast.success(res.data.message);
          setData(data.filter((v, i) => i !== index));
        }
      });
  };

  const fatchdata = async (start = 0, start_date = "", end_date = "") => {
    page.index = start;
    setPage({ ...page });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("draw", 1);
    param.append("start", start);
    param.append("length", 10);
    if (start_date != "") {
      param.append("start_date", start_date);
    }

    if (end_date != "") {
      param.append("end_date", end_date);
    }

    if (searchKeyword != "") {
      param.append("description", searchKeyword);
    }
    param.append("action", "list_notifications");
    await axios
      .post(`${Url}/datatable/notification_list.php`, param)
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
          page.totalPage = res.data.iTotalRecords;
          setPage({ ...page });
          if (res.data.aaData.length == 0) {
            setData([...res.data.aaData]);
          } else {
            if (searchKeyword != "") {
              setData([...res.data.aaData]);
            } else {
              setData((prev) => [...prev, ...res.data.aaData]);
            }
          }
        }
      });
  };

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Notification</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
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
                        <div className="notification-section">
                          {data.map((item, index) => {
                            return (
                              <>
                                <div className="notification-element">
                                  <label>{item.description}</label>
                                  {item.is_read == 0 ? (
                                    <Button
                                      variant="contained"
                                      className="btn-success"
                                      onClick={(e) => makeAsRead(item, index)}
                                    >
                                      Mark as Read
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            );
                          })}

                          {withoutButton.map((item, index) => {
                            return (
                              <>
                                <div className="notification-element">
                                  <label>{item.description}</label>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <div ref={loader} />
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

export default Notification;
