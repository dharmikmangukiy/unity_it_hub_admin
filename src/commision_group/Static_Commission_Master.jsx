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
  Menu,
  MenuItem,
  Paper,
  InputLabel,
  Select,
  TextField,
  FormHelperText,
  Autocomplete,
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
import { json, useNavigate } from "react-router-dom";
import NewDate from "../common/NewDate";

const Static_Commission_Master = (prop) => {
  const [mt5GroupName, setmt5GroupName] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xxl");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [viewData, setViewData] = useState({});
  const [param, setParam] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resData, setResData] = useState({});
  const [option, setOption] = useState([]);
  const [form, setForm] = useState({
    assigned_role_id: [],
    assigned_script: [],
    ib_group_level_id: "",
    ib_group_main_id: "",
    pair_data: [
      {
        script_name: "",
        total_commission: "",
        commission_level_1: "",
        commission_level_2: "",
        commission_level_3: "",
        commission_level_4: "",
        commission_level_5: "",
        commission_level_6: "",
        commission_level_7: "",
        commission_level_8: "",
        commission_level_9: "",
        commission_level_10: "",
      },
    ],
    Status: "",
    Remark: "",
    group_name: "",
    ib_mt5group_name: "",
    ib_comapny_get: "",
    ib_company_passon: "",
    plan_title: "",
    minimum_deposit: "",
    spread: "",
    commission: "",
    leverage: "",
    swap_free: "",
    trading_plaform: "",
    execution: "",
    trading_instrument: "",
    account_currency: "",
    minimum_trade_size: "",
    stop_out_level: "",
    is_default: "",
    is_private: "",
    commission_type: "",
    level: "",
    will_get: "",
    will_passon: "",
    partnership: "",
    ib_company_forex: "",
    ib_company_bullion: "",

    isLoader: false,
  });

  const [inputinfoTrue, setinputinfoTrue] = useState({
    ib_group_level_id: false,
    ib_group_main_id: false,
    Status: false,
    group_name: false,
    Remark: false,
    ib_mt5group_name: false,
    ib_comapny_get: false,
    ib_company_passon: false,
    plan_title: false,
    minimum_deposit: false,
    spread: false,
    commission: false,
    leverage: false,
    swap_free: false,
    trading_plaform: false,
    execution: false,
    trading_instrument: false,
    account_currency: false,
    minimum_trade_size: false,
    stop_out_level: false,
    is_default: false,
    is_private: false,
    commission_type: false,
    level: false,
    will_get: false,
    will_passon: false,
    partnership: false,
    ib_company_forex: false,
    ib_company_bullion: false,

    ib_company_indices: false,
    ib_company_energy: false,
    ib_company_crypto: false,
  });
  const [scroll, setScroll] = useState("paper");
  const handleClickOpen = (scrollType) => () => {
    setOpenModel(true);
    setScroll(scrollType);
  };
  const handleClose = () => {
    setOpenModel(false);
    const updatedPairData = {
      script_name: "",
      total_commission: "",
      commission_level_1: "",
      commission_level_2: "",
      commission_level_3: "",
      commission_level_4: "",
      commission_level_5: "",
      commission_level_6: "",
      commission_level_7: "",
      commission_level_8: "",
      commission_level_9: "",
      commission_level_10: "",
    };
    form.Status = "";
    form.Remark = "";
    form.group_name = "";
    setForm((prevForm) => ({
      ...prevForm,
      pair_data: [updatedPairData],
      isLoader: false,
    }));
  };
  toast.configure();
  const [searchBy, setSearchBy] = useState([
    {
      label: "structure name",
      value: false,
      name: "structure_name",
    },
  ]);
  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      sortable: false,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "structure name",
      selector: (row) => {
        return <span title={row.structure_name}>{row.structure_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },

    {
      name: "Updated BY",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "added datetime",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            <NewDate newDate={row.added_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "updated datetime",
      selector: (row) => {
        if (row.updated_datetime) {
          return (
            <span title={row.updated_datetime}>
              <NewDate newDate={row.updated_datetime} />
            </span>
          );
        } else {
          return null;
        }
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "status",
      selector: (row) => {
        const statusText = row.status == 1 ? "Active" : "In-Active";
        return <span title={statusText}>{statusText}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "remarks",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "ACTION",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.get_main_ib_groups == 1 ||
            prop.permission.update_ib_commission_group == 1 ||
            prop.permission.delete_ib_commission_group == 1 ? (
              <>
                <Button
                  id={`actionButton_${row.sr_no}`}
                  aria-controls={open ? `basic-menu-${row.sr_no}` : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  // onClick={(event) => handleContextClick(event, row.sr_no)}
                  {...row}
                  style={{ color: "rgb(144 145 139)" }}
                  className="edit"
                  onClick={(event) => {
                    navigate(`/Static_Commission_Master_Edit/${row.structure_id}`);
                  }}
                >
                  <i className="material-icons">edit_note</i>
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      grow: 0.1,
    },
  ];

  const handleContextClose = (index) => {
    let tableMenus = [...openTableMenus];
    tableMenus[index] = null;
    setOpenTableMenus(tableMenus);
  };

  const actionMenuPopup = (e, index, flagALL) => {
    handleContextClose(index.sr_no);
    if (flagALL == "delete") {
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
                  id="loder"
                  variant="contained"
                  className="btn-gradient btn-danger"
                  onClick={() => {
                    handleAction(index, "delete", onClose);
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
    if (dialogTitle == "Add") {
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
    if (dialogTitle == "Add") {
      return (
        <div>
          <div className="view-commission-content-section">
            <div className="view-content-element">
              <TextField
                label="Group Name"
                variant="standard"
                sx={{ width: "100%" }}
                name="group_name"
                value={form.group_name}
                error={
                  form.group_name == "" && inputinfoTrue.group_name
                    ? true
                    : false
                }
                helperText={
                  form.group_name == "" && inputinfoTrue.group_name
                    ? "Group Name is required"
                    : ""
                }
                onBlur={inputtrueFalse}
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    /^[A-Za-z0-9_ ]*$/.test(e.target.value) ||
                    e.target.value === " "
                  ) {
                    input(e);
                  }
                }}
                // onChange={input}
              />
            </div>
            <div className="view-content-element">
              <TextField
                label="Remark"
                variant="standard"
                sx={{ width: "100%" }}
                name="Remark"
                value={form.Remark}
                error={form.Remark == "" && inputinfoTrue.Remark ? true : false}
                helperText={
                  form.Remark == "" && inputinfoTrue.Remark
                    ? "Remark is required"
                    : ""
                }
                onBlur={inputtrueFalse}
                onChange={(e) => {
                  if (
                    e.target.value === "" ||
                    /^[A-Za-z0-9_ ]*$/.test(e.target.value) ||
                    e.target.value === " "
                  ) {
                    input(e);
                  }
                }}
                // onChange={input}
              />
            </div>
            <div className="view-content-element">
              <FormControl
                variant="standard"
                sx={{ width: "100%" }}
                error={form.Status == "" && inputinfoTrue.Status ? true : false}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  label
                  value={form.Status}
                  // className="select-font-small"
                  onBlur={inputtrueFalse}
                  name="Status"
                  onChange={input}
                >
                  <MenuItem value={"2"}>In-Active</MenuItem>
                  <MenuItem value={"1"}>Active</MenuItem>
                </Select>
                {form.Status == "" && inputinfoTrue.Status ? (
                  <FormHelperText>Status is required</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </div>
          </div>
          <p className="commission-content-pair-section">Manual Section</p>

          <div className="view-commission-content-section p-2">
            <table class="table table-responsive">
              <thead>
                <th>Script Name</th>
                <th>Commision</th>
                <th>Level 1</th>
                <th>Level 2</th>
                <th>Level 3</th>
                <th>Level 4</th>
                <th>Level 5</th>
                <th>Level 6</th>
                <th>Level 7</th>
                <th>Level 8</th>
                <th>Level 9</th>
                <th>Level 10</th>
              </thead>
              <thead>
                {form.pair_data.map((item, index) => {
                  return (
                    <tr>
                      <th>
                        <div className="Width_levels">
                          <Autocomplete
                            options={option}
                            getOptionLabel={(opt) =>
                              opt ? opt.script_name : ""
                            }
                            onChange={(event, newValue) => {
                              const selectedScriptId = newValue
                                ? newValue.script_id
                                : "";
                              const selectedScriptName = newValue
                                ? newValue.script_name
                                : "";
                              const selectedTotalCommission = newValue
                                ? newValue.total_commission
                                : "";

                              setForm((prevForm) => ({
                                ...prevForm,
                                pair_data: prevForm.pair_data.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        script_name: selectedScriptName,
                                        total_commission:
                                          selectedTotalCommission,
                                      }
                                    : item
                                ),
                              }));

                              setOption((prevOptions) =>
                                prevOptions.filter(
                                  (opt) => opt.script_id !== selectedScriptId
                                )
                              );
                            }}
                            value={option.find(
                              (opt) =>
                                opt.script_name ===
                                form.pair_data[index].script_name
                            )}
                            sx={{ width: "100%" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // label="Script Name"
                                variant="standard"
                              />
                            )}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="Width_levels">
                          <TextField
                            type="text"
                            // label="Commision"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Commision"
                            // error={
                            //   form.Commision == "" && inputinfoTrue.Commision
                            //     ? true
                            //     : false
                            // }
                            // helperText={
                            //   form.Commision == "" && inputinfoTrue.Commision
                            //     ? "Commision is required"
                            //     : ""
                            // }
                            value={form.pair_data[index].total_commission}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].total_commission =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="Width_levels">
                          <TextField
                          disabled={form.pair_data[index].total_commission == ""}
                            type="text"
                             
                            // label="Level 1"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_1"
                            onBlur={inputtrueFalse}
                            // error={
                            //   form.Level_1 == "" && inputinfoTrue.Level_1
                            //     ? true
                            //     : false
                            // }
                            // helperText={
                            //   form.Level_1 == "" && inputinfoTrue.Level_1
                            //     ? "Level 1 is required"
                            //     : ""
                            // }
                            value={form.pair_data[index].commission_level_1}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_1 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 2"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_2"
                            onBlur={inputtrueFalse}
                            // error={
                            //   form.Level_2 == "" && inputinfoTrue.Level_2
                            //     ? true
                            //     : false
                            // }
                            // helperText={
                            //   form.Level_2 == "" && inputinfoTrue.Level_2
                            //     ? "Level 2 is required"
                            //     : ""
                            // }
                            value={form.pair_data[index].commission_level_2}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e, index);
                                form.pair_data[index].commission_level_2 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 3"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_3"
                            onBlur={inputtrueFalse}
                            // error={
                            //   form.Level_3 == "" && inputinfoTrue.Level_3
                            //     ? true
                            //     : false
                            // }
                            // helperText={
                            //   form.Level_3 == "" && inputinfoTrue.Level_3
                            //     ? "Level 3 is required"
                            //     : ""
                            // }
                            value={form.pair_data[index].commission_level_3}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_3 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th scope="col">
                        {" "}
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 4"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_4"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_4}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_4 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 5"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_5"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_5}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_5 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>

                      <th>
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 6"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_6"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_6}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_6 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 7"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_7"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_7}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_7 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 8"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_8"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_8}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_8 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 9"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_9"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_9}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_9 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="Width_levels">
                          <TextField
                            type="text"
                                disabled={form.pair_data[index].total_commission == ""}
                            // label="Level 10"
                            variant="standard"
                            sx={{ width: "100%" }}
                            name="Level_10"
                            onBlur={inputtrueFalse}
                            value={form.pair_data[index].commission_level_10}
                            onChange={(e) => {
                              if (
                                e.target.value === "" ||
                                /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                                e.target.value === " "
                              ) {
                                input(e);
                                form.pair_data[index].commission_level_10 =
                                  e.target.value;
                                setForm({ ...form });
                              }
                            }}
                          />
                        </div>
                      </th>
                      {form.pair_data.length !== 1 ? (
                        <CloseIcon onClick={removeInputFields} />
                      ) : (
                        ""
                      )}
                    </tr>
                  );
                })}
              </thead>
            </table>
          </div>

          <br />
          <div style={{ textAlign: "end" }}>
            <Button variant="contained" onClick={addInputField}>
              + Add More
            </Button>
          </div>
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
  const inputtrueFalse = (event) => {
    var { name, value } = event.target;
    setinputinfoTrue((prevalue) => {
      return {
        ...prevalue,
        [name]: true,
      };
    });
  };
  const submit = async () => {
    if (form.group_name == "") {
      toast.error("Please enter group name");
    } else if (form.Remark == "") {
      toast.error("Please enter Remark");
    } else if (form.Status == "") {
      toast.error("Please Select Status");
    } else if (form.pair_data[0].script_name == "") {
      toast.error("Please Select Script");
    } else if (form.pair_data[0].total_commission == undefined) {
      toast.error("Please Enter Commision");
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
      param.append("action", "add_new_structure");
      param.append("structure_name", form.group_name);
      param.append("remarks", form.Remark);
      param.append("status", form.Status);
      // param.append("total_commission", form.total_commission);
      param.append("pair_data", JSON.stringify(form.pair_data));

      await axios
        .post(`${Url}/ajaxfiles/fixed_structures_manage.php`, param)
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
            const updatedPairData = {
              script_name: "",
              total_commission: "",
              commission_level_1: "",
              commission_level_2: "",
              commission_level_3: "",
              commission_level_4: "",
              commission_level_5: "",
              commission_level_6: "",
              commission_level_7: "",
              commission_level_8: "",
              commission_level_9: "",
              commission_level_10: "",
            };
            form.Status = "";
            form.Remark = "";
            form.group_name = "";
            setForm((prevForm) => ({
              ...prevForm,
              pair_data: [updatedPairData],
              isLoader: false,
            }));
          }
        });
    }
  };

  const addInputField = () => {
    form.pair_data.push({
      script_name: "",
      total_commission: "",
      commission_level_1: "",
      commission_level_2: "",
      commission_level_3: "",
      commission_level_4: "",
      commission_level_5: "",
      commission_level_6: "",
      commission_level_7: "",
      commission_level_8: "",
      commission_level_9: "",
      commission_level_10: "",
    });
    setForm({ ...form });
  };
  const removeInputFields = (index) => {
    const updatedPairData = [...form.pair_data];
    updatedPairData.splice(index, 1);

    setForm((prevForm) => ({
      ...prevForm,
      pair_data: updatedPairData,
    }));
  };

  const submitUpdate = async () => {
    if (Number(form.ib_company_crypto) > Number(form.ib_company_passon)) {
      toast.error(
        "Crypto amount should be less than to company passon, Please enter valid crypto amount"
      );
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
      param.append("action", "update_ib_commission_group");

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

  const getMt5GroupName = async (prop) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_script_master");
    await axios
      .post(Url + "/ajaxfiles/fixed_structures_manage.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status != "error") {
          setOption(res.data.script_data);
        }
      });
  };

  const AddCommissionGroup = () => {
    setDialogTitle("Add");
    getMt5GroupName("add");
    setinputinfoTrue({
      ib_group_level_id: false,
      ib_group_main_id: false,
      group_name: false,
      ib_mt5group_name: false,
      ib_comapny_get: false,
      ib_company_passon: false,
      plan_title: false,
      minimum_deposit: false,
      spread: false,
      commission: false,
      leverage: false,
      swap_free: false,
      trading_plaform: false,
      execution: false,
      trading_instrument: false,
      account_currency: false,
      minimum_trade_size: false,
      stop_out_level: false,
      is_default: false,
      is_private: false,
      commission_type: false,
      level: false,
      will_get: false,
      will_passon: false,
      partnership: false,
      ib_company_forex: false,
      ib_company_bullion: false,
      ib_company_indices: false,
      ib_company_energy: false,
      ib_company_crypto: false,
    });
    setOpenModel(true);
  };

  const handleAction = async (id, flag, onClose) => {
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
    if (flag == "delete") {
      param.append("action", "update_structure_delete_script");
    }
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("structure_id", id.structure_id);
    // param.append("structure_pair_id", id.structure_id);

    await axios
      .post(`${Url}/ajaxfiles/fixed_structures_manage.php`, param)
      .then((res) => {
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
                <p className="main-heading">Static Commission Master</p>
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
                    {prop.permission.add_ib_commission_group == 1 ? (
                      <Button variant="contained" onClick={AddCommissionGroup}>
                        Add
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                  <br />
                  <CommonTable
                    url={`${Url}/datatable/ib_fixed_commision_group_list.php`}
                    column={column}
                    sort="0"
                    action=""
                    search={searchBy}
                    refresh={refresh}
                    param={param}
                    searchWord={searchKeyword}
                    setResData={setResData}
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
              const updatedPairData = {
                script_name: "",
                total_commission: "",
                commission_level_1: "",
                commission_level_2: "",
                commission_level_3: "",
                commission_level_4: "",
                commission_level_5: "",
                commission_level_6: "",
                commission_level_7: "",
                commission_level_8: "",
                commission_level_9: "",
                commission_level_10: "",
              };
              form.Status = "";
              form.Remark = "";
              form.group_name = "";
              setForm((prevForm) => ({
                ...prevForm,
                pair_data: [updatedPairData],
                isLoader: false,
              }));
            }}
          />
        </DialogTitle>
        <DialogContent dividers>{manageContent()}</DialogContent>
        <DialogActions>{manageDialogActionButton()}</DialogActions>
      </Dialog>
    </div>
  );
};

export default Static_Commission_Master;
