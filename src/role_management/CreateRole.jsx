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
