import "./notification.css";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { ColorButton } from "../common/CustomElement";
import CheckIcon from "@mui/icons-material/Check";
const ColorButton2 = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ff0000"),
  backgroundColor: "red",
  textTransform: "initial",

  fontSize: "14px",
  padding: "6px 16px",
  "&:hover": {
    backgroundColor: "#f83245",
  },
}));
const ColorButton1 = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ff0000"),
  backgroundColor: "#e0e0e0",
  textTransform: "initial",
  color: "black",
  fontSize: "14px",
  padding: "6px 16px",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}));
const Notification = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [withoutButton, setWithoutButton] = useState([]);
  const [listItems, setListItems] = useState(
    Array.from(Array(30).keys(), (n) => n + 1)
  );
  const [refresh, setRefresh] = React.useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const handleClose = () => {
    setOpen1(false);
  };
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "DESCRIPTION",
      value: false,
      name: "description",
    },
  ]);
  const [page, setPage] = useState({
    index: 0,
    totalPage: 0,
    search: "",
  });
  useEffect(() => {
    fatchdata();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFetching) {
      fatchdata();
    }
  }, [isFetching]);

  function handleScroll() {
    if (
      parseInt(
        (window.innerHeight + document.documentElement.scrollTop).toFixed(0)
      ) +
        1 >=
        document.documentElement.scrollHeight ||
      isFetching
    ) {
      setIsFetching(true);
    }
  }

  function fetchMoreListItems() {}
  const [param1, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const loader = useRef(null);
  var search = "";

  toast.configure();

  // useEffect(() => {

  // }, []);
  const readAll = () => {
    const param = new FormData();
    setIsLoader(true);

    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "mark_as_read_all");

    axios
      .post(`${Url}/ajaxfiles/notification_manage.php`, param)
      .then((res) => {
        if (res.data.status == "error") {
          toast.error(res.data.message);
          setIsLoader(false);
        } else {
          setIsLoader(false);
          setRefresh(!refresh);
          setOpen1(false);
        }
      });
  };
  const handleObserver = useCallback((entries) => {}, []);

  useEffect(() => {
    page.index = 0;
    setPage({ ...page });
    fatchdata();
  }, [param1, searchKeyword, refresh]);

  /* useEffect(() => {
    fatchdata(page.index, param.start_date, param.end_date);
  }, [searchKeyword]); */

  const makeAsRead = async (item, index) => {
    // toast.error(item)
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "mark_as_read");
    param.append("id", item.notification_id);
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
          // toast.success(res.data.message);
          setData(data.filter((v, i) => i !== index));
        }
      });
  };

  const fatchdata = async () => {
    const param = new FormData();
    if (IsApprove != "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("draw", 1);
    param.append("start", page.index);
    param.append("length", 10);
    if (param1.start_date != "") {
      param.append("start_date", param1.start_date);
    }

    if (param1.end_date != "") {
      param.append("end_date", param1.end_date);
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
          page.index = page.index + 10;
          setPage({ ...page });
          if (res.data.aaData.length == 0) {
            setData([...res.data.aaData]);
          } else {
            if (searchKeyword != "") {
              setData([...res.data.aaData]);
            } else {
              if (page.index == 10) {
                setData((prev) => [...res.data.aaData]);
              } else {
                setData((prev) => [...prev, ...res.data.aaData]);
              }
              if (page.index < res.data.iTotalRecords) {
                setIsFetching(false);
              }
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
                        <ColorButton
                          sx={{
                            padding: "12px 26px",
                            marginBottom: "10px",
                            fontSize: "16px",
                          }}
                          onClick={() => {
                            setOpen1(true);
                          }}
                        >
                          Mark All Read
                        </ColorButton>
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
                                      <span className="disble-noti-button">
                                        Mark as Read
                                      </span>
                                      <span className="disbleNot-noti-button">
                                        <CheckIcon />
                                      </span>
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            );
                          })}

                          {/* {withoutButton.map((item, index) => {
                            return (
                              <>
                                <div className="notification-element">
                                  <label>{item.description}</label>
                                </div>
                              </>
                            );
                          })} */}
                        </div>
                        <div ref={loader} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
            <Dialog open={open1} onClose={handleClose}>
              <DialogTitle
                sx={{ borderBottom: "0px solid #e6e7f1 !important" }}
              >
                Are you sure?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Are you sure want to mark all notification to read?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <ColorButton1 onClick={handleClose}>No</ColorButton1>
                {isLoader == true ? (
                  <ColorButton2 disabled>
                    <svg
                      class="spinner"
                      style={{ position: "unset" }}
                      viewBox="0 0 50 50"
                    >
                      <circle
                        class="path"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke-width="5"
                      ></circle>
                    </svg>
                  </ColorButton2>
                ) : (
                  <ColorButton2 onClick={readAll}>Mark all read</ColorButton2>
                )}
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
