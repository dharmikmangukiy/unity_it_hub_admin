import { Button, CardContent, Grid, Input, Paper } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./setting.css";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuSetting = () => {
  const navigate = useNavigate();
  let list = [];
  let sourceElement = null;
  const [sortedList, setSortedList] = useState(list);
  toast.configure();

  const handleDragStart = (event) => {
    event.target.style.opacity = 0.5;
    sourceElement = event.target;
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (event) => {
    event.target.classList.add("over");
    document.querySelector(".over").closest(".dnd-list").classList.add("over");
  };

  const handleDragLeave = (event) => {
    document
      .querySelector(".over")
      .closest(".dnd-list")
      .classList.remove("over");
    event.target.classList.remove("over");
  };

  const handleDrop = (event) => {
    event.stopPropagation();
    if (sourceElement !== event.target) {
      const list = sortedList.filter(
        (item, i) => i.toString() !== sourceElement.id
      );
      const removed = sortedList.filter(
        (item, i) => i.toString() === sourceElement.id
      )[0];
      let insertAt = Number(event.target.id);

      let tempList = [];
      if (insertAt >= list.length) {
        tempList = list.slice(0).concat(removed);
        setSortedList(tempList);
        document
          .querySelector(".over")
          .closest(".dnd-list")
          .classList.remove("over");
        event.target.classList.remove("over");
      } else if (insertAt < list.length) {
        tempList = list.slice(0, insertAt).concat(removed);
        const newList = tempList.concat(list.slice(insertAt));
        setSortedList(newList);
        document
          .querySelector(".over")
          .closest(".dnd-list")
          .classList.remove("over");
        event.target.classList.remove("over");
      }
    } else
      document
        .querySelector(".over")
        .closest(".dnd-list")
        .classList.remove("over");
    event.target.classList.remove("over");
  };

  const handleDragEnd = (event) => {
    event.target.style.opacity = 1;
  };

  const handleChange = (event) => {
    event.preventDefault();
    const list = sortedList.map((item, i) => {
      if (i !== Number(event.target.id)) {
        return item;
      } else return event.target.value;
    });
    setSortedList(list);
  };

  const listItems = () => {
    return sortedList.map((item, i) => (
      <div key={i} className="dnd-list">
        <input
          id={i}
          type="text"
          className="input-item"
          draggable="true"
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onChange={handleChange}
          placeholder="Enter text here"
          value={item.menu_name}
          readOnly
        />
      </div>
    ));
  };

  const getParentMenus = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "view_parent_menus");
    axios.post(Url + "/ajaxfiles/menu_manage.php", param).then((res) => {
      if (
        res.data["status"] == "error" &&
        res.data["message"] == "Session has been expired"

      ) {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setSortedList([...res.data.data]);
      }
    });
  };

  const save = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "order_main_menu");
    param.append("main_menu_ids", JSON.stringify(sortedList));
    axios.post(Url + "/ajaxfiles/menu_manage.php", param).then((res) => {
      if (
        res.data["status"] == "error" &&
        res.data["message"] == "Session has been expired"

      ) {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        getParentMenus();
      }
    });
  };

  useEffect(() => {
    getParentMenus();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Change Menu Order</p>

                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        {listItems()}
                        <br />
                        <div className="popsavebuttton">
                          {/* {loader == true ? (
                                                        <Button disabled className="popdisableimage" >
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
                                                        </Button>
                                                    ) : (
                                                    )} */}
                          <Button
                            variant="contained"
                            className="btn-success"
                            onClick={save}
                          >
                            Save
                          </Button>
                        </div>
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

export default MenuSetting;
