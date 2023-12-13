import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Button, Collapse, Grid, Paper, Switch } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";

const CreateRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState({
    operation: false,
    trading: false,
    platforms: false,
    contests: false,
    staff: false,
  });
  const [form, setForm] = useState({
    role: id,
    name: "",
    description: "",
    accessId: "",
    isLoader: false,
  });
  const [data, setData] = useState([]);
  toast.configure();

  const updateRole = () => {
    if (form.name == "") {
      toast.error("Please enter role name");
    } else if (form.description == "") {
      toast.error("Please enter role description");
    } else {
      var activeMenuIds = [];
      data.forEach((element) => {
        if (element.active == true) {
          activeMenuIds.push(element.menu_id);
          var subMenuactiveIds = element.sub_menu_list
            .filter((x) => x.active == true)
            .map((sub) => {
              return sub.menu_id;
            });
          activeMenuIds.push(...subMenuactiveIds);
        }
      });

      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "edit_role");
      param.append("role_id", id);
      param.append("role_name", form.name);
      param.append("role_description", form.description);
      param.append("menu_access_menu_ids", activeMenuIds.join(","));
      axios.post(Url + "/ajaxfiles/role_manage.php", param).then((res) => {
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
          navigate("/role_management");
        }
      });
    }
  };

  const createRole = () => {
    if (form.name == "") {
      toast.error("Please enter role name");
    } else if (form.description == "") {
      toast.error("Please enter role description");
    } else {
      var activeMenuIds = [];
      data.forEach((element) => {
        if (element.active == true) {
          activeMenuIds.push(element.menu_id);
          var subMenuactiveIds = element.sub_menu_list
            .filter((x) => x.active == true)
            .map((sub) => {
              return sub.menu_id;
            });
          activeMenuIds.push(...subMenuactiveIds);
        }
      });

      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "add_role");
      param.append("role_name", form.name);
      param.append("role_description", form.description);
      param.append("menu_access_menu_ids", activeMenuIds.join(","));
      axios.post(Url + "/ajaxfiles/role_manage.php", param).then((res) => {
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
          navigate("/role_management");
        }
      });
    }
  };

  const getRolemanList = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    if (id) {
      param.append("view_role_id", id);
      param.append("action", "view_role_details");
    } else {
      param.append("action", "list_permissions");
    }
    axios.post(Url + "/ajaxfiles/role_manage.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setData(res.data.data);
        if (id) {
          setForm({
            name: res.data.role_name,
            description: res.data.role_description,
          });
        }
      }
    });
  };

  const input = (event) => {
    const { name, value } = event.target;
    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const handleClick = (e) => {
    const name = e.target.classList[0];
    if (name.startsWith("menu-")) {
      setOpen((preValue) => {
        return {
          ...preValue,
          [name]: !open[name],
        };
      });
    }
  };

  useEffect(() => {
    getRolemanList();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">
                  {" "}
                  {id != undefined ? "Update" : "Create"} Role
                </p>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <div className="create-role-content-section">
                    <div
                      className="input-section"
                      style={{ flexDirection: "column", gap: "0px" }}
                    >
                      <b>Role Name</b>
                      <input
                        type="text"
                        className="create-role-input"
                        placeholder="Role Name"
                        name="name"
                        value={form.name}
                        onChange={input}
                      />
                    </div>
                    <div
                      className="input-section"
                      style={{ flexDirection: "column", gap: "0px" }}
                    >
                      <b>Role Description</b>
                      <input
                        type="text"
                        className="create-role-input"
                        placeholder="Role Description"
                        name="description"
                        value={form.description}
                        onChange={input}
                      />
                    </div>
                    <div className="input-section">
                      <label>
                        All <small>(select/unselect)</small>
                      </label>
                      <Switch
                        onChange={(e) => {
                          data.forEach((element) => {
                            element.active = e.target.checked;
                            element.sub_menu_list.forEach((subMenu) => {
                              subMenu.active = e.target.checked;
                            });
                          });
                          setData([...data]);
                        }}
                      />
                    </div>
                    {/* <br/> */}
                    <ul className="role-management-section">
                      {data.map((item, index) => {
                        return (
                          <li className="main-menu-section">
                            <a
                              className={`menu-${index} ${
                                open[`menu-${index}`] ? "active" : ""
                              }`}
                              onClick={handleClick}
                            >
                              <div>
                                <i
                                  className={`menu-${index} ${
                                    open[`menu-${index}`] ? "active" : ""
                                  } material-icons`}
                                  onClick={handleClick}
                                >
                                  {item.icon_class}
                                </i>
                                <span
                                  className={`menu-${index} ${
                                    open[`menu-${index}`] ? "active" : ""
                                  }`}
                                  onClick={handleClick}
                                >
                                  {item.menu_name}{" "}
                                  <small>({item.menu_label})</small>{" "}
                                  {item.description == "" ||
                                  item.description == null
                                    ? ""
                                    : "- " + item.description}{" "}
                                </span>
                              </div>

                              <div>
                                <Switch
                                  checked={item.active ? item.active : false}
                                  onChange={(e) => {
                                    item.active = e.target.checked;
                                    item.sub_menu_list.forEach((element) => {
                                      element.active = e.target.checked;
                                    });
                                    setData([...data]);
                                  }}
                                />
                                {item.sub_menu_list.length > 0 ? (
                                  <span
                                    className={`menu-${index} ${
                                      open[`menu-${index}`] ? "active" : ""
                                    } sidebar-icon-indicator`}
                                    onClick={handleClick}
                                  >
                                    {open[`menu-${index}`] ? (
                                      <ExpandMore />
                                    ) : (
                                      <ExpandLess />
                                    )}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </a>

                            {item.sub_menu_list.length > 0 ? (
                              <Collapse
                                in={open[`menu-${index}`]}
                                timeout="auto"
                                unmountOnExit
                              >
                                <ul className="sub-menu-section">
                                  {item.sub_menu_list.map((subMenu) => {
                                    return (
                                      <li
                                        className={`sub-menu ${
                                          subMenu.menu_label == "Permission"
                                            ? "permission"
                                            : ""
                                        }`}
                                      >
                                        <span className="sub-menu-title">
                                          {subMenu.menu_name}{" "}
                                          <small>({subMenu.menu_label})</small>{" "}
                                          {subMenu.description == "" ||
                                          subMenu.description == null
                                            ? ""
                                            : "- " + subMenu.description}
                                        </span>
                                        <Switch
                                          checked={
                                            subMenu.active
                                              ? subMenu.active
                                              : false
                                          }
                                          onChange={(e) => {
                                            subMenu.active = e.target.checked;
                                            // setData([...data]);
                                            var activeMenu =
                                              item.sub_menu_list.filter(
                                                (x) => x.active == true
                                              );
                                            if (activeMenu.length > 0) {
                                              item.active = true;
                                            } else {
                                              // item.active = false;
                                            }
                                            setData([...data]);
                                          }}
                                        />
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Collapse>
                            ) : (
                              ""
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {/* <div className="permission-table">
                      <div className="site-role-section">
                        <div className="permission-table-header">
                          <label></label>
                          <label>Add</label>
                          <label>Add IB</label>
                          <label>View</label>
                          <label>Update</label>
                          <label>Delete</label>
                          <label>Approve</label>
                          <label>Reject</label>
                        </div>
                        <div className="permission-table-body">
                          <label>Roles</label>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Users</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Leads</label>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Client Request</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Client</label>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Transactions Deposit</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Transactions Withdraw</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Transactions Internal</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Requests IB</label>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Requests Account</label>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Email Templates</label>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            {id != undefined ? (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                                checked
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="permission-radio-button"
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Team</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Team Members</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Team Manager</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Requests Leverage</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Campaigns</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Sales Target</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Credit</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Requests Promotions</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Requests Structure</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Currency Rates</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Reports</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body">
                          <label>Marketing Links</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="permission-table">
                      <div className="leads-role-section">
                        <div className="permission-table-header leads-section">
                          <label></label>
                          <label>Add</label>
                          <label>Add IB</label>
                          <label>View</label>
                          <label>Update</label>
                          <label>Delete</label>
                          <label>Approve</label>
                          <label>Reject</label>
                          <label>View All</label>
                          <label>View Assigned</label>
                          <label>Assign To All</label>
                          <label>Assign To Sale</label>
                          <label>Assign To Team</label>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Profile</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Employment</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Bank</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Documents</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Activities</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Notes</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Transaction</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Links</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Leads Agenets</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="permission-table">
                      <div className="mt5-role-section">
                        <div className="permission-table-header mt5-section">
                          <label></label>
                          <label>MT5</label>
                          <label>CP Access</label>
                          <label>Reset MT5 Password</label>
                          <label>Reset CP Access</label>
                          <label>Download App</label>
                          <label>Add Transaction</label>
                          <label>Link Client</label>
                          <label>Link Sub IB</label>
                          <label>Convert To Client</label>
                          <label>Convert To IB</label>
                          <label>Link To IB</label>
                          <label>Client PDF</label>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Client Action</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                        <div className="permission-table-body leads-section">
                          <label>Lead Action</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="permission-table">
                      <div className="client-leade-role-section">
                        <div className="permission-table-header client-lead-section">
                          <label></label>
                          <label>View</label>
                          <label>Link</label>
                          <label>Update</label>
                          <label>Add Account</label>
                          <label>Link Account</label>
                        </div>
                        <div className="permission-table-body client-lead-section">
                          <label>Client Action</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="permission-table-body client-lead-section">
                          <label>Lead Action</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="permission-table">
                      <div className="dashboard-role-section">
                        <div className="permission-table-header dashboard-section">
                          <label></label>
                          <label>Dashboard</label>
                          <label>Clients</label>
                          <label>Leads</label>
                          <label>Settings</label>
                          <label>Transaction</label>
                          <label>Request</label>
                          <label>Marketing</label>
                          <label>Report</label>
                        </div>
                        <div className="permission-table-body dashboard-section">
                          <label>Sidebar</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="permission-table">
                      <div className="client-kyc-role-section">
                        <div className="permission-table-header client-lead-section">
                          <label></label>
                          <label>Leads</label>
                          <label>Clients</label>
                          <label>Requests</label>
                          <label>Transaction</label>
                          <label>KYC</label>
                        </div>
                        <div className="permission-table-body client-lead-section">
                          <label>Dashboard Data</label>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="permission-radio-button"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="createRoleButton">
                      {id != undefined ? (
                        <Button
                          variant="contained"
                          className="btn btn-success"
                          onClick={updateRole}
                        >
                          Update Role
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          className="btn btn-success"
                          onClick={createRole}
                        >
                          Create Role
                        </Button>
                      )}
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
