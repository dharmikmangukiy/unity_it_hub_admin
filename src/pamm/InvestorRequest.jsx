import {
  Button,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import NewDate from "../common/NewDate";

const InvestorRequest = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [open, setOpen] = useState(false);
  const [resData, setResData] = useState({});
  const navigate = useNavigate();
  toast.configure();
  const [searchBy, setSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "name",
    },
    {
      label: "WALLET CODE",
      value: false,
      name: "wallet_code",
    },
    {
      label: "EMAIL",
      value: false,
      name: "user_email",
    },
    {
      label: "MOBILE",
      value: false,
      name: "user_phone",
    },
    {
      label: "COUNTRY",
      value: false,
      name: "user_country",
    },
  ]);

  const activityColumn = [
    {
      name: "SR NO",
      minWidth: "72px",
      selector: (row) => row.sr_no,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "USER NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "WALLET CODE",
      selector: (row) => {
        return <span title={row.wallet_code}>{row.wallet_code}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "MOBILE",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "COUNTRY",
      selector: (row) => {
        return <span title={row.user_country}>{row.user_country}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "PAMM ACCOUNT",
      selector: (row) => {
        return (
          <span title={row.is_pamm == "0" ? "No" : "Yes"}>
            {row.is_pamm == "0" ? "No" : "Yes"}
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={
              row.status == "0"
                ? "Pending"
                : row.status == "1"
                ? "Approved"
                : "Rejected"
            }
            className={`text-color-${
              row.status == "1" ? "green" : row.status == "2" ? "red" : "yellow"
            }`}
          >
            {row.status == "0"
              ? "Pending"
              : row.status == "1"
              ? "Approved"
              : "Rejected"}
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "DATETIME",
      selector: (row) => {
        return (
          <span title={row.user_added_datetime}>
            <NewDate newDate={row.user_added_datetime} />
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "APPROVE DATETIME",
      selector: (row) => {
        return (
          <span title={row.approved_date_time}>
            <NewDate newDate={row.approved_date_time} />
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            <Button
              id={`actionButton_${row.sr_no}`}
              aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleContextClick(event, row.sr_no)}
              {...row}
              style={{ color: "rgb(144 145 139)" }}
            >
              <i className="material-icons">more_horiz</i>
            </Button>
            <Menu
              id={`basic-menu-${row.sr_no}`}
              anchorEl={openTableMenus[row.sr_no]}
              open={Boolean(openTableMenus[row.sr_no])}
              onClose={(event) => handleContextClose(row.sr_no)}
            >
              <MenuItem
                className="approve"
                {...row}
                onClick={(event) => actionMenuPopup(event, row, "approve")}
              >
                <i className="approve material-icons font-color-approved">
                  thumb_up
                </i>
                &nbsp;&nbsp;Approved
              </MenuItem>
              <MenuItem
                className="reject"
                {...row}
                onClick={(event) => actionMenuPopup(event, row, "reject")}
              >
                <i className="reject material-icons font-color-rejected">
                  thumb_down
                </i>
                &nbsp;&nbsp;Rejected
              </MenuItem>
            </Menu>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const handleContextClick = (event, index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = event.currentTarget;
    setOpenTableMenus(tableMenus);
  };

  const handleContextClose = (index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = null;
    setOpenTableMenus(tableMenus);
  };

  const actionMenuPopup = (e, data, flagALL) => {
    handleContextClose(data.sr_no);
    if (flagALL == "reject") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to rejected this?</p>
              <div className="confirmation-alert-action-button">
                <Button
                  variant="contained"
                  className="cancelButton"
                  onClick={onClose}
                >
                  No
                </Button>
                <Button
                  id="loder"
                  variant="contained"
                  className="btn-gradient btn-danger"
                  onClick={() => {
                    changeStatus("rejected", data, onClose);
                  }}
                >
                  Yes, Reject it!
                </Button>
              </div>
            </div>
          );
        },
      });
    } else if (e.target.classList.contains("approve")) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to approved this?</p>
              <div className="confirmation-alert-action-button">
                <Button
                  variant="contained"
                  className="cancelButton"
                  onClick={onClose}
                >
                  No
                </Button>
                <Button
                  id="loder"
                  variant="contained"
                  className="btn-gradient btn-success"
                  onClick={() => {
                    changeStatus("approved", data, onClose);
                  }}
                >
                  Yes, Approve it!
                </Button>
              </div>
            </div>
          );
        },
      });
    }
  };

  const changeStatus = (status, data, onClose) => {
    document.getElementById("loder").classList.add("MyClassLoder");
    var button = document.getElementById("loder");

    // Disable the button
    button.disabled = true;
    button.innerHTML = ` <svg class="spinner" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>`;
    if (status == "approved") {
      setIsLoader(true);
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("user_id", data.user_id);
      param.append("action", "update_is_pamm");
      param.append("pamm_request_id", data.pamm_request_id);
      param.append("status", 1);
      axios.post(Url + "/ajaxfiles/pamm/user_manage.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setIsLoader(false);
        if (res.data.status == "error") {
          document.getElementById("loder").classList.remove("MyClassLoder");
          var button = document.getElementById("loder");
          button.disabled = false;
          button.innerHTML = `Yes, Approved it!`;
          toast.error(res.data.message);
        } else {
          onClose();
          setRefresh(!refresh);
          toast.success(res.data.message);
        }
      });
    } else if (status == "rejected") {
      setIsLoader(true);
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("user_id", data.user_id);
      param.append("action", "update_is_pamm");
      param.append("pamm_request_id", data.pamm_request_id);
      param.append("status", 2);
      axios.post(Url + "/ajaxfiles/pamm/user_manage.php", param).then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        setIsLoader(false);
        if (res.data.status == "error") {
          document.getElementById("loder").classList.remove("MyClassLoder");
          var button = document.getElementById("loder");
          button.disabled = false;
          button.innerHTML = `Yes, Reject it!`;
          toast.error(res.data.message);
        } else {
          onClose();
          setRefresh(!refresh);
          toast.success(res.data.message);
        }
      });
    }
  };

  const updatePamm = (data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>
              Do you want to {data.is_pamm == "0" ? "add" : "remove"} pamm this?
            </p>
            <div className="confirmation-alert-action-button">
              <Button
                variant="contained"
                className="cancelButton"
                onClick={onClose}
              >
                No
              </Button>
              <Button
                variant="contained"
                className="btn-gradient btn-success"
                onClick={() => {
                  const param = new FormData();
                  if (IsApprove !== "") {
                    param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
                    param.append("is_app", IsApprove.is_app);
                    param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
                  }
                  param.append("action", "update_is_pamm");
                  param.append("user_id", data.user_id);
                  param.append("is_pamm", data.is_pamm == "0" ? 1 : 0);
                  axios
                    .post(Url + "/ajaxfiles/pamm/user_manage.php", param)
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
                        toast.success(res.data.message);
                        setRefresh(!refresh);
                      }
                    });
                  onClose();
                }}
              >
                Yes, {data.is_pamm == "0" ? "Add" : "Remove"} it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Investor Request</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" onClick={handleClickOpen}>Add Deposit</Button>
                                    </div>
                                    <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        {isLoader ? (
                          <div className="table-loader">
                            <svg class="spinner" viewBox="0 0 50 50">
                              <circle
                                class="path"
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke-width="5"
                              ></circle>
                            </svg>
                          </div>
                        ) : (
                          <CommonTable
                            url={`${Url}/datatable/pamm/pamm_investor_requests.php`}
                            column={activityColumn}
                            sort="2"
                            search={searchBy}
                            searchWord={searchKeyword}
                            param={param}
                            refresh={refresh}
                            setResData={setResData}
                          />
                        )}
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

export default InvestorRequest;
