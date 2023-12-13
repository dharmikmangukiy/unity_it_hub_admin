import "./role_management.css";
import React, { useState } from "react";
import { Button, Grid, Paper } from "@mui/material";
import CommonTable from "../common/CommonTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CommonFilter from "../common/CommonFilter";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { IsApprove, Url } from "../global";
import axios from "axios";

const RoleManagement = (prop) => {
  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      grow: 0.1,
    },
    {
      name: "ROLE NAME",
      selector: (row) => {
        return <span title={row.role_name}>{row.role_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
      wrap: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => {
        return <span title={row.role_description}>{row.role_description}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      grow: 0.3,
      wrap: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div className="actionButtonGroup">
            {prop.permission.edit_role == 1 ? (
              <Button
                className="btn-edit"
                onClick={(event) => gotoCreateRole(event, row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              </Button>
            ) : (
              ""
            )}
            {prop.permission.delete_role == 1 ? (
              <Button
                className="btn-close"
                onClick={(event) => actionMenuPopup(event, row)}
                {...row}
                style={{ color: "rgb(144 145 139)" }}
              >
                <i class="fa fa-times" aria-hidden="true"></i>
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [param, setParam] = useState({});
  const [resData, setResData] = useState({});
  const [searchBy, setSearchBy] = useState([
    {
      label: "ROLE NAME",
      value: false,
      name: "role_name",
    },
    {
      label: "DESCRIPTION",
      value: false,
      name: "role_description",
    },
  ]);

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

  const gotoRoleCreate = (e) => {
    navigate("/createRole");
  };

  const gotoCreateRole = (e, data) => {
    navigate("/createRole/" + data.role_id);
  };

  const actionMenuPopup = (e, data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to delete this role?</p>
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
                  deleterole(data, onClose);
                }}
              >
                Yes, Delete it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  const deleterole = (data, onClose) => {
    const param = new FormData();
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
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("role_id", data.role_id);
    param.append("action", "delete_role");
    axios.post(Url + "/ajaxfiles/role_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        document.getElementById("loder").classList.remove("MyClassLoder");
        var button = document.getElementById("loder");
        button.disabled = false;
        button.innerHTML = `Yes, Delete it!`;
        toast.error(res.data.message);
      } else {
        onClose();
        setRefresh(!refresh);
        toast.success(res.data.message);
      }
    });
  };
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Role Management</p>
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
                  <div className="actionGroupButton">
                    {prop.permission.add_role == 1 ? (
                      <Button variant="contained" onClick={gotoRoleCreate}>
                        Add Role
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                  <br />
                  <CommonTable
                    url={`${Url}/datatable/role_list.php`}
                    column={column}
                    sort="0"
                    search={searchBy}
                    searchWord={searchKeyword}
                    param={param}
                    refresh={refresh}
                    setResData={setResData}
                  />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
