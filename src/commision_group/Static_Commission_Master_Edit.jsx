import React, { useEffect, useState } from "react";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import {
  Button,
  Grid,
  Paper,
  MenuItem,
  Menu,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NewDate from "../common/NewDate";
import CloseIcon from "@mui/icons-material/Close";
import { ColorButton } from "../common/CustomElement";
import CommonFilter from "../common/CommonFilter";

function Static_Commission_Master_Edit(prop) {
  const { id } = useParams();
  const [refresh, setRefresh] = useState(false);
  const [param, setParam] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resData, setResData] = useState({});
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xxl");
  const [dialogTitle, setDialogTitle] = useState("");
  const [columnTrue, setColumnTrue] = useState([]);
  const [RowData, setRowData] = useState();
  const [option, setOption] = useState([]);
  const [Newoption, setNewOption] = useState([]);
  const [form, setForm] = useState({
    pair_data: [
      {
        script_name1:{},
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
    isLoader: false,
  });

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
      name: "script name",
      selector: (row) => {
        return <span title={row.script_name}>{row.script_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },

    {
      name: "Updated BY",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      // sortable: true,
      reorder: true,
      grow: 0.7,
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
      name: "total commission",
      selector: (row) => {
        return <span title={row.total_commission}>{row.total_commission}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "level 1",
      selector: (row) => {
        return (
          <span title={row.commission_level_1}>{row.commission_level_1}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 2",
      selector: (row) => {
        return (
          <span title={row.commission_level_2}>{row.commission_level_2}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 3",
      selector: (row) => {
        return (
          <span title={row.commission_level_3}>{row.commission_level_3}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 4",
      selector: (row) => {
        return (
          <span title={row.commission_level_4}>{row.commission_level_4}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 5",
      selector: (row) => {
        return (
          <span title={row.commission_level_5}>{row.commission_level_5}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 6",
      selector: (row) => {
        return (
          <span title={row.commission_level_6}>{row.commission_level_6}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 7",
      selector: (row) => {
        return (
          <span title={row.commission_level_7}>{row.commission_level_7}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 8",
      selector: (row) => {
        return (
          <span title={row.commission_level_8}>{row.commission_level_8}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 9",
      selector: (row) => {
        return (
          <span title={row.commission_level_9}>{row.commission_level_9}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "level 10",
      selector: (row) => {
        return (
          <span title={row.commission_level_10}>{row.commission_level_10}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.1,
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
                  onClick={() => {
                    setRowData(row);
                    setDialogTitle("Update");
                    setOpenModel(true);
                    const updatedPairData = {
                      script_name: row.script_name,
                      total_commission: row.total_commission,
                      commission_level_1: row.commission_level_1,
                      commission_level_2: row.commission_level_2,
                      commission_level_3: row.commission_level_3,
                      commission_level_4: row.commission_level_4,
                      commission_level_5: row.commission_level_5,
                      commission_level_6: row.commission_level_6,
                      commission_level_7: row.commission_level_7,
                      commission_level_8: row.commission_level_8,
                      commission_level_9: row.commission_level_9,
                      commission_level_10: row.commission_level_10,
                    };
                    setForm((prevForm) => ({
                      ...prevForm,
                      pair_data: [updatedPairData],
                      isLoader: false,
                    }));
                  }}
                  {...row}
                  style={{ color: "rgb(144 145 139)" }}
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

  const [searchBy, setSearchBy] = useState([
    {
      label: "script name",
      value: false,
      name: "script_name",
    },
  ]);

  const handleClose = () => {
    setOpenModel(false);
  };

  const input = (event) => {
    var { name, value } = event.target;
    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
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
              onClick={AddScript}
            >
              Add
            </Button>
          )}
        </div>
      );
    } else if (dialogTitle == "Update") {
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
          Navigate("/");
          return;
        }
        if (res.data.status != "error") {
          setOption(res.data.script_data);
        }
      });
  };

  const GetScript = () => {
    const resDataScriptNames = resData?.aaData?.map(
      (option) => option.script_name
    );
    const filteredResDataScriptNames = option.filter(
      (scriptName) => !resDataScriptNames.includes(scriptName.script_name)
    );
    setNewOption(filteredResDataScriptNames);
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
    console.log("index",index)
    const updatedPairData = [...form.pair_data];
    form.pair_data.splice(index, 1);
    console.log("form.pair_data",form.pair_data)
setForm({...form})
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   pair_data: updatedPairData,
    // }));
  };


  const manageContent = () => {
    if (dialogTitle == "Add") {
      return (
        <div>
          <div className="view-commission-content-section p-2">
            <table class="table table-responsive">
              <thead>
                <th style={{minWidth: "150px"}}>Script Name</th>
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
                <th>Delete</th>

              </thead>
              <thead>
                {form.pair_data.map((item, index) => {
                  return (
                    <tr>
                      <th>
                        <div className="">
                          <Autocomplete
                            options={Newoption}
                            getOptionLabel={(opt) =>
                              opt ? opt.script_name : ""
                            }
// value={Newoption.find(obj => obj.name === name)}

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
                              // setForm((prevForm) => ({
                              //   ...prevForm,
                              //   pair_data: prevForm.pair_data.map((item, i) =>
                              //     i === index
                              //       ? {
                              //           ...item,
                              //           script_name: selectedScriptName,
                              //           total_commission:
                              //             selectedTotalCommission,
                              //         }
                              //       : item
                              //   ),
                              // }));
form.pair_data[index].script_name=newValue?.script_name
form.pair_data[index].script_name1=newValue

setForm({...form})
                              setOption((prevOptions) =>
                                prevOptions.filter(
                                  (opt) => opt.script_id !== selectedScriptId
                                )
                              );
                            }}
                            value={item.script_name1}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                            // onBlur={inputtrueFalse}
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
                      <th>
                      {form.pair_data.length !== 1 ? (
                        <CloseIcon onClick={()=>removeInputFields(index)} />
                      ) : (
                        ""
                      )}
                      </th>
                      
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
    } else if (dialogTitle == "Update") {
      return (
        <div>
          <div className="view-commission-content-section p-2">
            <table class="table table-responsive">
              <thead>
                <th style={{width: "150px"}}>Script Name</th>
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
                <tr>
                  <th>
                    <div className="">
                      <Autocomplete
                        options={Newoption}
                        getOptionLabel={(option) =>
                          option ? option.script_name : ""
                        }
                        
                        onChange={(event, newValue) => {
                          form.pair_data[0].script_name = newValue.script_name;
                          setForm({ ...form });
                        }}
                        sx={{ width: "100%" }}
                        value={form.pair_data[0]}
                        style={{ minWidth: "150px" }}
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
                        value={form.pair_data[0].total_commission}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].total_commission = e.target.value;
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
                        // label="Level 1"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_1"
                        value={form.pair_data[0].commission_level_1}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_1 =
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
                        // label="Level 2"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_2"
                        value={form.pair_data[0].commission_level_2}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_2 =
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
                        // label="Level 3"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_3"
                        value={form.pair_data[0].commission_level_3}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_3 =
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
                        // label="Level 4"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_4"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_4}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_4 =
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
                        // label="Level 5"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_5"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_5}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_5 =
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
                        // label="Level 6"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_6"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_6}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_6 =
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
                        // label="Level 7"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_7"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_7}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_7 =
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
                        // label="Level 8"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_8"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_8}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_8 =
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
                        // label="Level 9"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_9"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_9}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_9 =
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
                        // label="Level 10"
                        variant="standard"
                        sx={{ width: "100%" }}
                        name="Level_10"
                        // onBlur={inputtrueFalse}
                        value={form.pair_data[0].commission_level_10}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            /^[\d]*\.?[\d]{0,2}$/.test(e.target.value) ||
                            e.target.value === " "
                          ) {
                            input(e);
                            form.pair_data[0].commission_level_10 =
                              e.target.value;
                            setForm({ ...form });
                          }
                        }}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      );
    }
  };

  const submitUpdate = async () => {
    form.isLoader = true;
    setForm({ ...form });
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "update_structure_edit_script");
    param.append("structure_id", id);
    param.append("structure_pair_id", RowData.structure_pair_id);
    param.append("script_name", form.pair_data[0].script_name);
    param.append("total_commission", form.pair_data[0].total_commission);
    param.append("commission_level_1", form.pair_data[0].commission_level_1);
    param.append("commission_level_2", form.pair_data[0].commission_level_2);
    param.append("commission_level_3", form.pair_data[0].commission_level_3);
    param.append("commission_level_4", form.pair_data[0].commission_level_4);
    param.append("commission_level_5", form.pair_data[0].commission_level_5);
    param.append("commission_level_6", form.pair_data[0].commission_level_6);
    param.append("commission_level_7", form.pair_data[0].commission_level_7);
    param.append("commission_level_8", form.pair_data[0].commission_level_8);
    param.append("commission_level_9", form.pair_data[0].commission_level_9);
    param.append("commission_level_10", form.pair_data[0].commission_level_10);
    await axios
      .post(`${Url}/ajaxfiles/fixed_structures_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          Navigate("/");
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
  };
  const AddScript = async () => {
    if (form.pair_data[0].script_name == "") {
      toast.error("Please Select Script");
    } else if (form.pair_data[0].total_commission == "") {
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
      param.append("action", "update_structure_add_script");
      param.append("structure_id", id);
      param.append("pair_data", JSON.stringify(form.pair_data));

      await axios
        .post(`${Url}/ajaxfiles/fixed_structures_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            Navigate("/");
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
            setForm((prevForm) => ({
              ...prevForm,
              pair_data: [updatedPairData],
              isLoader: false,
            }));
          }
        });
    }
  };

  const submitDelete = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }

    if (columnTrue.length < 2) {
      param.append("action", "update_structure_delete_script");
      param.append("structure_id", id);
      param.append("structure_pair_id", columnTrue[0].structure_pair_id);
    }
    if (columnTrue.length >= 2) {
      param.append("action", "update_structure_delete_multi_script");
      param.append("structure_id", id);
      param.append(
        "script_ids",
        columnTrue.map((item) => item.structure_pair_id)
      );
    }
    axios
      .post(`${Url}/ajaxfiles/fixed_structures_manage.php`, param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          Navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          setRefresh(!refresh);
          toast.success(res.data.message);
          setOpenModel(false);
        }
      });
  };

  useEffect(() => {
    getMt5GroupName();
    GetScript();
  }, [openModel]);

  return (
    <div>
      <div>
        <div className="app-content--inner">
          <div className="app-content--inner__wrapper mh-100-vh">
            <div style={{ opacity: 1 }}>
              <Grid container>
                <Grid item md={12} lg={12} xl={12}>
                  <p className="main-heading">Static Commission Master Edit</p>
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
                    <div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h5 className="pl-3"><b>{resData.structure_name}</b></h5>
                        <ColorButton
                          style={{ padding: "6px 12px" }}
                          onClick={() => {
                            setDialogTitle("Add");
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

                            setForm((prevForm) => ({
                              ...prevForm,
                              pair_data: [updatedPairData],
                              isLoader: false,
                            }));
                            setOpenModel(true);
                          }}
                        >
                          Add
                        </ColorButton>
                      </div>
                      <div
                        style={{
                          display: columnTrue.length > 0 ? "unset" : "none",
                        }}
                      >
                        <ColorButton
                          style={{ padding: "6px 12px" }}
                          onClick={submitDelete}
                        >
                          Delete
                        </ColorButton>
                      </div>
                    </div>
                    <CommonTable
                      url={`${Url}/ajaxfiles/fixed_structures_manage.php`}
                      column={column}
                      sort="0"
                      action="get_added_scripts_list"
                      structure_id={id}
                      search={searchBy}
                      refresh={refresh}
                      param={param}
                      searchWord={searchKeyword}
                      setResData={setResData}
                      selectableRows
                      setColumnTrue={setColumnTrue}
                      clearSelectedRows={toggleCleared}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>
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
}

export default Static_Commission_Master_Edit;
