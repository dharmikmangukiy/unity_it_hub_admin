import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IsApprove, Url } from "../global";
import {
  Button,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  Switch,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./setting.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
    </DialogTitle>
  );
};

const MenuItems = (prop) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    operation: false,
    trading: false,
    platforms: false,
    contests: false,
  });
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortLoader, setSortLoader] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  let list = [];
  let sourceElement = null;
  const [sortedList, setSortedList] = useState(list);
  const [form, setForm] = useState({
    name: "",
    icon: "",
    url: "",
    action: "",
    status: "",
    order: "",
    description: "",
    menu_id: "",
    parent_menu_id: "",
    isLoader: false,
    isPermission: false,
  });
  toast.configure();

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

  const getViewAllMenu = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "view_menu_list");
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
        setData(res.data.data);
      }
    });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleClickOpen = (e, data) => {
    if (e.target.classList.contains("add-main-menu")) {
      setForm({
        name: "",
        icon: "",
        url: "",
        action: "",
        status: "",
        order: "",
        description: "",
        menu_id: "",
        parent_menu_id: "",
        isLoader: false,
        isPermission: false,
      });
      setDialogTitle("Add Main Menu");
      setMaxWidth("md");
      setDialogOpen(true);
    } else if (e.target.classList.contains("edit-main-menu")) {
      setForm({
        name: data.menu_name,
        icon: data.icon_class,
        url: data.menu_url,
        action: data.menu_ajax_action,
        status: data.menu_status,
        order: data.menu_order,
        description: data.description,
        menu_id: data.menu_id,
        parent_menu_id: "",
        isLoader: false,
        isPermission: false,
      });
      setDialogTitle("Edit Main Menu");
      setMaxWidth("md");
      setDialogOpen(true);
    } else if (e.target.classList.contains("add-child-menu")) {
      setForm({
        name: "",
        icon: "",
        url: "",
        action: "",
        status: "",
        order: "",
        description: "",
        menu_id: "",
        parent_menu_id: data.menu_id,
        isLoader: false,
        isPermission: false,
      });
      setDialogTitle("Add Child Menu");
      setMaxWidth("md");
      setDialogOpen(true);
    } else if (e.target.classList.contains("edit-child-menu")) {
      setForm({
        name: data.menu_name,
        icon: data.icon_class,
        url: data.menu_url,
        action: data.menu_ajax_action,
        status: data.menu_status,
        order: data.menu_order,
        description: data.description,
        menu_id: data.menu_id,
        parent_menu_id: data.menu_parent_id,
        isLoader: false,
        isPermission: data.menu_type == "permission" ? true : false,
      });
      setDialogTitle("Edit Child Menu");
      setMaxWidth("md");
      setDialogOpen(true);
    }
  };

  const manageContent = () => {
    if (dialogTitle == "Add Main Menu") {
      return (
        <div>
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Name"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="name"
              onChange={input}
            />
            <TextField
              type="text"
              label="Icon"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="icon"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="URL"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="url"
              onChange={input}
            />
            <TextField
              type="text"
              label="Ajax Action"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="action"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <FormControl variant="standard" sx={{ width: "100%" }} focused>
              <InputLabel>Status</InputLabel>
              <Select name="status" onChange={input}>
                <MenuItem value="1">Enabled</MenuItem>
                <MenuItem value="0">Disbled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="text"
              label="Order"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="order"
              onChange={input}
            />
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Description"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="description"
              onChange={input}
            />
          </div>
        </div>
      );
    } else if (
      dialogTitle == "Edit Main Menu" ||
      dialogTitle == "Edit Child Menu"
    ) {
      return (
        <div>
          <div className="margeTwoField element">
            {dialogTitle == "Edit Child Menu" ? (
              <FormControlLabel
                sx={{ width: "100%" }}
                label="Is Permission"
                control={
                  <Checkbox
                    name="isPermission"
                    checked={form.isPermission}
                    onChange={input}
                  />
                }
              />
            ) : (
              ""
            )}
            <TextField
              type="text"
              label="Name"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="name"
              value={form.name}
              onChange={input}
            />
          </div>
          <br />
          {!form.isPermission ? (
            <>
              <div className="margeTwoField element">
                <TextField
                  type="text"
                  label="Icon"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  name="icon"
                  value={form.icon}
                  onChange={input}
                />
                <TextField
                  type="text"
                  label="URL"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  name="url"
                  value={form.url}
                  onChange={input}
                />
              </div>
              <br />
            </>
          ) : (
            ""
          )}
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Ajax Action"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="action"
              value={form.action}
              onChange={input}
            />
            <FormControl variant="standard" sx={{ width: "100%" }} focused>
              <InputLabel>Status</InputLabel>
              <Select name="status" onChange={input} value={form.status}>
                <MenuItem value="1">Enabled</MenuItem>
                <MenuItem value="0">Disbled</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Order"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="order"
              value={form.order}
              onChange={input}
            />
            <TextField
              type="text"
              label="Description"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="description"
              value={form.description}
              onChange={input}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Add Child Menu") {
      return (
        <div>
          <div className="margeTwoField element">
            <FormControlLabel
              sx={{ width: "100%" }}
              label="Is Permission"
              control={
                <Checkbox
                  name="isPermission"
                  checked={form.isPermission}
                  onChange={input}
                />
              }
            />
            <TextField
              type="text"
              label="Name"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="name"
              onChange={input}
            />
          </div>
          <br />
          {!form.isPermission ? (
            <>
              <div className="margeTwoField element">
                <TextField
                  type="text"
                  label="Icon"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  name="icon"
                  onChange={input}
                />
                <TextField
                  type="text"
                  label="URL"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  name="url"
                  onChange={input}
                />
              </div>
              <br />
            </>
          ) : (
            ""
          )}

          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Ajax Action"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="action"
              onChange={input}
            />
            <FormControl variant="standard" sx={{ width: "100%" }} focused>
              <InputLabel>Status</InputLabel>
              <Select name="status" onChange={input}>
                <MenuItem value="1">Enabled</MenuItem>
                <MenuItem value="0">Disbled</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />
          <div className="margeTwoField element">
            <TextField
              type="text"
              label="Order"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="order"
              onChange={input}
            />
            <TextField
              type="text"
              label="Description"
              variant="standard"
              sx={{ width: "100%" }}
              focused
              name="description"
              onChange={input}
            />
          </div>
        </div>
      );
    } else if (dialogTitle == "Change Sub Menu Order") {
      return <div>{listItems()}</div>;
    }
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "Add Main Menu") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {form.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
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
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={addMainMenu}
            >
              Add
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit Main Menu") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {form.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
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
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={addMainMenu}
            >
              Update
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add Child Menu") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {form.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
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
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={addChildMenu}
            >
              Add
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Edit Child Menu") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {form.isLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
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
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={addChildMenu}
            >
              Update
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Change Sub Menu Order") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {sortLoader ? (
            <Button
              tabindex="0"
              size="large"
              className=" btn-gradient  btn-success createMt5Formloder"
              disabled
            >
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
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={saveSortdata}
            >
              Save
            </Button>
          )}
        </div>
      );
    }
  };

  const addMainMenu = () => {
    if (form.name == "") {
      toast.error("Please enter menu name");
    } else if (form.url == "") {
      toast.error("Please enter menu url");
    } else if (form.status == "") {
      toast.error("Please select menu status");
    } else if (form.order == "") {
      toast.error("Please enter menu order");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (form.menu_id == "") {
        param.append("action", "add_parent_menu");
      } else {
        param.append("action", "edit_parent_menu");
        param.append("menu_id", form.menu_id);
      }
      param.append("menu_name", form.name);
      param.append("icon_class", form.icon);
      param.append("menu_url", form.url);
      param.append("menu_ajax_action", form.action);
      param.append("menu_status", form.status);
      param.append("menu_order", form.order);
      param.append("description", form.description);
      axios.post(Url + "/ajaxfiles/menu_manage.php", param).then((res) => {
        if (
          res.data["status"] == "error" &&
          res.data["message"] == "Session has been expired"
        ){
        toast.error(res.data.message); 
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        form.isLoader = false;
        setForm({ ...form });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setDialogOpen(false);
          getViewAllMenu();
        }
      });
    }
  };

  const addChildMenu = () => {
    if (form.name == "") {
      toast.error("Please enter menu name");
    } else if (form.url == "" && !form.isPermission) {
      toast.error("Please enter menu url");
    } else if (form.action == "") {
      toast.error("Please enter menu action");
    } else if (form.status == "") {
      toast.error("Please select menu status");
    } else if (form.order == "") {
      toast.error("Please enter menu order");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (form.menu_id == "") {
        if (form.isPermission) {
          param.append("action", "add_menu_permission");
        } else {
          param.append("action", "add_child_menu");
        }
      } else {
        if (form.isPermission) {
          param.append("action", "edit_menu_permission");
        } else {
          param.append("action", "edit_child_menu");
        }
        param.append("menu_id", form.menu_id);
      }
      param.append("menu_parent_id", form.parent_menu_id);
      param.append("menu_name", form.name);
      param.append("icon_class", form.icon);
      param.append("menu_url", form.url);
      param.append("menu_ajax_action", form.action);
      param.append("menu_status", form.status);
      param.append("menu_order", form.order);
      param.append("description", form.description);
      axios.post(Url + "/ajaxfiles/menu_manage.php", param).then((res) => {
        if (
          res.data["status"] == "error" &&
          res.data["message"] == "Session has been expired"
        ){
        toast.error(res.data.message); 
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        form.isLoader = false;
        setForm({ ...form });
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setDialogOpen(false);
          getViewAllMenu();
        }
      });
    }
  };

  const input = (event) => {
    var { name, value } = event.target;
    if (event.target.getAttribute) {
      if (event.target.getAttribute("type") == "checkbox") {
        value = event.target.checked;
      }
    }
    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const deleteConfirmation = (data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>Do you want to delete this menu?</p>
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
                  deleteMenuItem(data, onClose);
                }}
              >
                Yes, delete it!
              </Button>
            </div>
          </div>
        );
      },
    });
  };

  const deleteMenuItem = (data, onClose) => {
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
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "delete_menu");
    param.append("menu_id", data.menu_id);
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
        document.getElementById("loder").classList.remove("MyClassLoder");
        var button = document.getElementById("loder");
        button.disabled = false;
        button.innerHTML = `Yes, delete it!`;
        toast.error(res.data.message);
      } else {
        onClose();
        toast.success(res.data.message);
        getViewAllMenu();
      }
    });
  };

  const sorting = (data) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "view_sub_menu");
    param.append("menu_id", data.menu_id);
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
        setDialogTitle("Change Sub Menu Order");
        setDialogOpen(true);
      }
    });
  };

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

  const saveSortdata = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "update_order_sub_menu");
    param.append("sub_menu_ids", JSON.stringify(sortedList));
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
        getViewAllMenu();
        setDialogOpen(false);
      }
    });
  };

  useEffect(() => {
    getViewAllMenu();
  }, []);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Menu Item</p>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <div className="create-role-content-section">
                    <div className="createMenuItemButtonEnd">
                      {prop.permission.add_parent_menu == 1 ? (
                        <Button
                          className="add-main-menu"
                          variant="contained"
                          onClick={handleClickOpen}
                        >
                          Add Main Menu
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
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
                                {prop.permission.edit_parent_menu == 1 ? (
                                  <Button
                                    className="edit-main-menu"
                                    title="Edit Main Menu"
                                    onClick={(e) => {
                                      handleClickOpen(e, item);
                                    }}
                                  >
                                    <i
                                      className={`material-icons edit-main-menu`}
                                    >
                                      edit_note
                                    </i>
                                  </Button>
                                ) : (
                                  ""
                                )}
                                {prop.permission.add_child_menu == 1 ? (
                                  <Button
                                    className="add-child-menu"
                                    title="Add New Child Menu"
                                    onClick={(e) => {
                                      handleClickOpen(e, item);
                                    }}
                                  >
                                    <i
                                      className={`material-icons add-child-menu`}
                                    >
                                      control_point
                                    </i>
                                  </Button>
                                ) : (
                                  ""
                                )}

                                {item.sub_menu_list.length > 0 &&
                                prop.permission.update_order_sub_menu == 1 ? (
                                  <Button
                                    title="Sorting"
                                    className="sorting-sub-menu"
                                    onClick={(e) => {
                                      sorting(item);
                                    }}
                                  >
                                    <i className={`material-icons`}>
                                      format_list_bulleted
                                    </i>
                                  </Button>
                                ) : (
                                  ""
                                )}
                                {prop.permission.delete_menu == 1 ? (
                                  <Button
                                    title="Delete"
                                    className="menu-edit-button"
                                    onClick={(e) => {
                                      deleteConfirmation(item);
                                    }}
                                  >
                                    <i className={`material-icons`}>delete</i>
                                  </Button>
                                ) : (
                                  ""
                                )}

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
                                        <div>
                                          {prop.permission.edit_child_menu ==
                                          1 ? (
                                            <Button
                                              className="edit-child-menu"
                                              title={`${
                                                subMenu.menu_label ==
                                                "Permission"
                                                  ? "Edit Permission"
                                                  : "Edit Child Menu"
                                              } `}
                                              onClick={(e) => {
                                                handleClickOpen(e, subMenu);
                                              }}
                                            >
                                              <i
                                                className={`material-icons edit-child-menu`}
                                              >
                                                edit_note
                                              </i>
                                            </Button>
                                          ) : (
                                            ""
                                          )}
                                          {prop.permission.delete_menu == 1 ? (
                                            <Button
                                              title="Delete"
                                              className="menu-edit-button"
                                              onClick={(e) => {
                                                deleteConfirmation(subMenu);
                                              }}
                                            >
                                              <i className={`material-icons`}>
                                                delete
                                              </i>
                                            </Button>
                                          ) : (
                                            ""
                                          )}
                                        </div>
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
                  </div>
                </Paper>

                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={dialogOpen}
                  fullWidth={fullWidth}
                  maxWidth={maxWidth}
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    {dialogTitle}
                  </BootstrapDialogTitle>
                  <DialogContent dividers>{manageContent()}</DialogContent>
                  <DialogActions>{manageDialogActionButton()}</DialogActions>
                </BootstrapDialog>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItems;
