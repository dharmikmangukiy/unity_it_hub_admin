import "./commision_group.css";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
// import CustomImageModal from '../common/CustomImageModal';
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IBStructure = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [viewData, setViewData] = useState({});
  toast.configure();

  const [form, setForm] = useState({
    structure_id: "",
    structure_name: "",
    structure_data: [],
    isLoader: false,
  });

  const [searchBy, setSearchBy] = useState([
    {
      label: "GROUP NAME",
      value: false,
      name: "group_name",
    },
    {
      label: "TYPE",
      value: false,
      name: "type",
    },
    {
      label: "TOTAL LEVEL",
      value: false,
      name: "total_level",
    },
    {
      label: "COMPANY GET",
      value: false,
      name: "company_code",
    },
    {
      label: "COMPANY PASSON",
      value: false,
      name: "company_passon",
    },
    {
      label: "MAIN USER TRADER",
      value: false,
      name: "main_user_trader",
    },
  ]);

  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 0.1,
    },
    {
      name: "GROUP NAME",
      selector: (row) => {
        return <span title={row.group_name}>{row.group_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      wrap: true,
    },
    {
      name: "MT5 GROUP NAME",
      selector: (row) => {
        return <span title={row.group_name}>{row.ib_mt5group_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      wrap: true,
    },
    {
      name: "COMMISSION",
      selector: (row) => {
        return <span title={row.commission}>{row.commission}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.added_datetime}>{row.added_datetime}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "COMPANY GET",
      selector: (row) => {
        return <span title={row.ib_comapny_get}>{row.ib_comapny_get}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "COMPANY PASSON",
      selector: (row) => {
        return (
          <span title={row.ib_company_passon}>{row.ib_company_passon}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "plan title",
      selector: (row) => {
        return <span title={row.plan_title}>{row.plan_title}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "Is Default",
      selector: (row) => {
        return (
          <span title={row.plan_title}>
            {row.is_default == "0" ? "No" : "Yes"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      wrap: true,
    },
    {
      name: "Is Private",
      selector: (row) => {
        return (
          <span title={row.plan_title}>
            {row.is_private == "0" ? "No" : "Yes"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
      wrap: true,
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
                className="view"
                {...row}
                onClick={(event) => {
                  setDialogTitle("View");
                  setViewData(row);
                  setOpenModel(true);
                  handleContextClose(row.sr_no);
                }}
              >
                <i className="material-icons">receipt</i>&nbsp;&nbsp;View
              </MenuItem>
              <MenuItem
                className="edit"
                {...row}
                onClick={(event) => {
                  setDialogTitle("Edit");
                  setForm({
                    ib_group_level_id: row.ib_group_level_id,
                    group_name: row.group_name,
                    ib_mt5group_name: row.ib_mt5group_name,
                    ib_comapny_get: row.ib_comapny_get,
                    ib_company_passon: row.ib_company_passon,
                    plan_title: row.plan_title,
                    minimum_deposit: row.minimum_deposit,
                    spread: row.spread,
                    commission: row.commission,
                    leverage: row.leverage,
                    swap_free: row.swap_free,
                    trading_plaform: row.trading_plaform,
                    execution: row.execution,
                    trading_instrument: row.trading_instrument,
                    account_currency: row.account_currency,
                    minimum_trade_size: row.minimum_trade_size,
                    stop_out_level: row.stop_out_level,
                    is_default: row.is_default == "0" ? false : true,
                    is_private: row.is_private == "0" ? false : true,
                    commission_type: "",
                    level: "",
                    will_get: "",
                    will_passon: "",
                    partnership: "",
                    isLoader: false,
                  });
                  setOpenModel(true);
                  handleContextClose(row.sr_no);
                }}
              >
                <i className="material-icons">edit_note</i>&nbsp;&nbsp;Edit
              </MenuItem>
              <MenuItem
                className="delete"
                {...row}
                onClick={(event) => {
                  actionMenuPopup(event, row);
                }}
              >
                <i className="material-icons commission-delete-icon">delete</i>
                &nbsp;&nbsp;Delete
              </MenuItem>
              {/* <MenuItem className='reject' {...row} onClick={(event) => actionMenuPopup(event, row.sr_no)}><i className="material-icons font-color-rejected">cancel</i>&nbsp;&nbsp;Rejected</MenuItem> */}
            </Menu>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const handleClose = () => {
    setOpenModel(false);
  };

  const handleContextClose = (index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = null;
    setOpenTableMenus(tableMenus);
  };

  const actionMenuPopup = (e, index) => {
    handleContextClose(index.sr_no);
    if (e.target.classList.contains("delete")) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p>Do you want to delete this?</p>
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
                  className="btn-gradient btn-danger"
                  onClick={() => {
                    handleAction(index, "delete");
                    onClose();
                  }}
                >
                  Yes, Delete it!
                </Button>
              </div>
            </div>
          );
        },
      });
    }
  };

  const handleContextClick = (event, index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = event.currentTarget;
    setOpenTableMenus(tableMenus);
  };

  const manageDialogActionButton = () => {
    if (dialogTitle == "View") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      );
    } else if (dialogTitle == "Edit") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {form.isLoader == true ? (
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              disabled
            >
              <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
            </Button>
          ) : (
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={submitUpdate}
            >
              Update
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Add") {
      return (
        <div className="dialogMultipleActionButton">
          <Button
            variant="contained"
            className="cancelButton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {form.isLoader == true ? (
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              disabled
            >
              <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
            </Button>
          ) : (
            <Button
              variant="contained"
              className="btn-gradient btn-success"
              onClick={submit}
            >
              Add
            </Button>
          )}
        </div>
      );
    }
  };

  const manageContent = () => {
    if (dialogTitle == "View") {
      return (
        <div className="view-commission-content-section">
          <div className="view-content-element">
            <h6 className="element-title">Group Name</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.group_name}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">MT5 Group Name</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.ib_mt5group_name}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Execution</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.execution}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Commission</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.commission}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Company Will Get</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.ib_comapny_get}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Company Will Passon</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.ib_company_passon}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Leverage</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.leverage}</div>
            </div>
          </div>
          {/* <div className="view-content-element">
              <h6 className="element-title"></h6>
              <div className=" element-content">
                <div className=" col s12">{viewData.group_name}</div>
              </div>
            </div> */}
          <div className="view-content-element">
            <h6 className="element-title">Minimum Deposit</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.minimum_deposit}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Plan Title</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.plan_title}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Date</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.added_datetime}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Minimun Trade Size</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.minimum_trade_size}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Spread</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.spread}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title"> Stop out Level</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.stop_out_level}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Swap Free</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.swap_free}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title"> Trading Instrument</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.trading_instrument}</div>
            </div>
          </div>
          <div className="view-content-element">
            <h6 className="element-title">Trading Platform</h6>
            <div className=" element-content">
              <div className=" col s12">{viewData.trading_plaform}</div>
            </div>
          </div>
        </div>
      );
    } else if (dialogTitle == "Edit") {
      return (
        <div className="view-commission-content-section">
          <div className="view-content-element">
            <TextField
              label="Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="group_name"
              value={form.group_name}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="MT5 Group Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="ib_mt5group_name"
              value={form.ib_mt5group_name}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Execution"
              variant="standard"
              sx={{ width: "100%" }}
              name="execution"
              value={form.execution}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Commission"
              variant="standard"
              sx={{ width: "100%" }}
              name="commission"
              value={form.commission}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Company Will Get"
              variant="standard"
              sx={{ width: "100%" }}
              name="ib_comapny_get"
              value={form.ib_comapny_get}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Company Will Passon"
              variant="standard"
              sx={{ width: "100%" }}
              name="ib_company_passon"
              value={form.ib_company_passon}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Leverage"
              variant="standard"
              sx={{ width: "100%" }}
              name="leverage"
              value={form.leverage}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Minimum Deposit"
              variant="standard"
              sx={{ width: "100%" }}
              name="minimum_deposit"
              value={form.minimum_deposit}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Plan Title"
              variant="standard"
              sx={{ width: "100%" }}
              name="plan_title"
              value={form.plan_title}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Minimun Trade Size"
              variant="standard"
              sx={{ width: "100%" }}
              name="minimum_trade_size"
              value={form.minimum_trade_size}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Spread"
              variant="standard"
              sx={{ width: "100%" }}
              name="spread"
              value={form.spread}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Stop out Level"
              variant="standard"
              sx={{ width: "100%" }}
              name="stop_out_level"
              value={form.stop_out_level}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Swap Free"
              variant="standard"
              sx={{ width: "100%" }}
              name="swap_free"
              value={form.swap_free}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Trading Instrument"
              variant="standard"
              sx={{ width: "100%" }}
              name="trading_instrument"
              value={form.trading_instrument}
              onChange={input}
            />
          </div>
          <div className="view-content-element">
            <TextField
              label="Trading Platform"
              variant="standard"
              sx={{ width: "100%" }}
              name="trading_plaform"
              value={form.trading_plaform}
              onChange={input}
              disabled
            />
          </div>
          <div className="view-content-element">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_default"
                    checked={form.is_default}
                    onChange={input}
                  />
                }
                label="Is Default"
              />
            </FormGroup>
          </div>
          <div className="view-content-element">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_private"
                    checked={form.is_private}
                    onChange={input}
                  />
                }
                label="Is Private"
              />
            </FormGroup>
          </div>
        </div>
      );
    } else if (dialogTitle == "Add") {
      return (
        <div className="ib-structure view-commission-content-section">
          <div style={{ width: "100%" }}>
            <TextField
              label="Structure Name"
              variant="standard"
              sx={{ width: "100%" }}
              name="structure_name"
              value={form.structure_name}
              onChange={input}
            />
          </div>
          {form.structure_data.map((item, index) => {
            return (
              <div className="group-structure-section">
                <div className="main-section">
                  <div>{item.ib_group_name}</div>
                  <div>
                    <input
                      type="text"
                      className="rebert_amount"
                      placeholder="Rebert"
                      value={item.group_rebate}
                      onChange={(e) => {
                        var floatNumber = e.target.value.split(".");
                        if (!isNaN(Number(e.target.value))) {
                          if (
                            floatNumber.length == 1 ||
                            (floatNumber.length == 2 &&
                              floatNumber[1].length <= 3)
                          ) {
                            form.structure_data[index]["group_rebate"] =
                              e.target.value;
                            setForm({
                              ...form,
                            });
                          }
                        } else if (
                          e.target.value == "" ||
                          e.target.value == 0
                        ) {
                          form.structure_data[index]["group_rebate"] = 0;
                          setForm({
                            ...form,
                          });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="commission_amount"
                      placeholder="Commission"
                      value={item.group_commission}
                      onChange={(e) => {
                        var floatNumber = e.target.value.split(".");
                        if (!isNaN(Number(e.target.value))) {
                          if (
                            floatNumber.length == 1 ||
                            (floatNumber.length == 2 &&
                              floatNumber[1].length <= 3)
                          ) {
                            form.structure_data[index]["group_commission"] =
                              e.target.value;
                            setForm({
                              ...form,
                            });
                          }
                        } else if (
                          e.target.value == "" ||
                          e.target.value == 0
                        ) {
                          form.structure_data[index]["group_commission"] = 0;
                          setForm({
                            ...form,
                          });
                        }
                      }}
                    />
                  </div>
                  <div>
                    {item.ibGroup != undefined ? (
                      <FormControl variant="standard">
                        <Select
                          label
                          className="select-font-small"
                          value={item.ib_group_level_id}
                          name="title"
                          onChange={(e) => {
                            form.structure_data[index]["ib_group_level_id"] =
                              e.target.value;
                            setForm({
                              ...form,
                            });
                          }}
                        >
                          <MenuItem value="0">Select IB Group</MenuItem>
                          {item.ibGroup.map((item1, index1) => {
                            return (
                              <MenuItem value={item1.ib_group_level_id}>
                                {item1.ib_group_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="pair-section">
                  {item.pair_data.map((item1, index1) => {
                    return (
                      <div className="pair-data">
                        <div>{item1.pair_name}</div>
                        <div>
                          <input
                            type="text"
                            className="rebert_amount"
                            placeholder="Rebert"
                            value={item1.rebate}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  form.structure_data[index]["pair_data"][
                                    index1
                                  ]["rebate"] = e.target.value;
                                  setForm({
                                    ...form,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                form.structure_data[index]["pair_data"][index1][
                                  "rebate"
                                ] = 0;
                                setForm({
                                  ...form,
                                });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            className="commission_amount"
                            placeholder="Commission"
                            value={item1.commission}
                            onChange={(e) => {
                              var floatNumber = e.target.value.split(".");
                              if (!isNaN(Number(e.target.value))) {
                                if (
                                  floatNumber.length == 1 ||
                                  (floatNumber.length == 2 &&
                                    floatNumber[1].length <= 3)
                                ) {
                                  form.structure_data[index]["pair_data"][
                                    index1
                                  ]["commission"] = e.target.value;
                                  setForm({
                                    ...form,
                                  });
                                }
                              } else if (
                                e.target.value == "" ||
                                e.target.value == 0
                              ) {
                                form.structure_data[index]["pair_data"][index1][
                                  "commission"
                                ] = 0;
                                setForm({
                                  ...form,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
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

  const submit = async () => {
    var error = false;
    if (form.structure_name == "") {
      toast.error("Please enter structure name");
      error = true;
    } else {
    }
    if (error) {
      return false;
    }
    form.isLoader = true;
    setForm({ ...form });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("action", "insert_master_structure");
    param.append("user_id", form.group_name);
    param.append("structure_name", form.structure_name);
    param.append("pair_data", JSON.stringify(form.structure_data));

    await axios
      .post(`${Url}/ajaxfiles/structures_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
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
          setRefresh(!refresh);
          toast.success(res.data.message);
          setOpenModel(false);
        }
      });
    // }
  };

  const submitUpdate = async () => {
    if (form.group_name == "") {
      toast.error("Please enter group name");
    } else if (form.ib_mt5group_name == "") {
      toast.error("Please enter mt5 group name");
    } else if (form.execution == "") {
      toast.error("Please enter execution");
    } else if (form.commission == "") {
      toast.error("Please enter commission");
    } else if (form.ib_comapny_get == "") {
      toast.error("Please enter company will get");
    } else if (form.ib_company_passon == "") {
      toast.error("Please enter company will passon");
    } else if (form.leverage == "") {
      toast.error("Please enter leverage");
    } else if (form.minimum_deposit == "") {
      toast.error("Please enter Minimum Deposit");
    } else if (form.plan_title == "") {
      toast.error("please enter plan title");
    } else if (form.minimum_trade_size == "") {
      toast.error("Please enter minimun trade size");
    } else if (form.spread == "") {
      toast.error("Please enter spread");
    } else if (form.stop_out_level == "") {
      toast.error("Please enter stop out level");
    } else if (form.swap_free == "") {
      toast.error("Please enter swap free");
    } else if (form.trading_instrument == "") {
      toast.error("Please enter trading instrument");
    } else if (form.trading_plaform == "") {
      toast.error("Please enter trading plaform");
    } else {
      form.isLoader = true;
      setForm({ ...form });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("action", "update_ib_commission_group");
      param.append("ib_group_level_id", form.ib_group_level_id);
      param.append("group_name", form.group_name);
      param.append("ib_mt5group_name", form.ib_mt5group_name);
      param.append("ib_comapny_get", form.ib_comapny_get);
      param.append("ib_company_passon", form.ib_company_passon);
      param.append("plan_title", form.plan_title);
      param.append("minimum_deposit", form.minimum_deposit);
      param.append("spread", form.spread);
      param.append("commission", form.commission);
      param.append("leverage", form.leverage);
      param.append("swap_free", form.swap_free);
      param.append("trading_plaform", form.trading_plaform);
      param.append("execution", form.execution);
      param.append("trading_instrument", form.trading_instrument);
      param.append("account_currency", form.account_currency);
      param.append("minimum_trade_size", form.minimum_trade_size);
      param.append("stop_out_level", form.stop_out_level);
      param.append("is_default", form.is_default ? "1" : "0");
      param.append("is_private", form.is_private ? "1" : "0");
      param.append("account_currency", "USD");

      await axios
        .post(`${Url}/ajaxfiles/ib_commission_group_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
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
            setRefresh(!refresh);
            toast.success(res.data.message);
            setOpenModel(false);
          }
        });
    }
  };

  const AddCommissionGroup = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("action", "get_default_structure");
    await axios
      .post(`${Url}/ajaxfiles/structures_manage.php`, param)
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
          form.structure_data = res.data.data;
          setForm({ ...form });
          setMaxWidth("md");
          setDialogTitle("Add");
          setOpenModel(true);
        }
      });
  };

  const handleAction = async (id, flag) => {
    const param = new FormData();
    if (flag == "delete") {
      param.append("action", "delete_ib_commission_group");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("ib_group_level_id", id.ib_group_level_id);
    await axios
      .post(`${Url}/ajaxfiles/ib_commission_group_manage.php`, param)
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
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">IB Structure</p>
                <CommonFilter search={searchBy} />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <div className="actionGroupButton">
                    <Button variant="contained" onClick={AddCommissionGroup}>
                      Add
                    </Button>
                  </div>
                  <br />
                  <CommonTable
                    url={`${Url}/datatable/ib_commision_group_list.php`}
                    column={column}
                    sort="0"
                    search={searchBy}
                    refresh={refresh}
                  />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <Dialog
        open={openModel}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle
          id="alert-dialog-title"
          className="d-flex align-items-center p-3"
          style={{ borderBottom: "none" }}
        >
          <h5 className="ml-3 w-100 text-start mt-2 mb-2 font-weight-bold">
            {dialogTitle}
          </h5>
          <CloseIcon
            onClick={() => {
              setOpenModel(false);
            }}
          />
        </DialogTitle>
        <DialogContent dividers>{manageContent()}</DialogContent>
        <DialogActions>{manageDialogActionButton()}</DialogActions>
      </Dialog>
    </div>
  );
};

export default IBStructure;
