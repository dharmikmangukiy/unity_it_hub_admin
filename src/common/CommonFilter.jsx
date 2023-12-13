import { useTheme } from "@emotion/react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IsApprove, Url } from "../global";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Color, isArray, seriesType } from "highcharts";
import { ColorButton } from "./CustomElement";
import SearchIcon from "@mui/icons-material/Search";
const CssTextField = styled(TextField)({});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 8px 10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 9,
      borderColor: "#80bdff",
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const CommonFilter = (prop) => {
  const [soure, setSoure] = useState([]);
  const [param, setParam] = useState({});
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState([]);
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filterSection, setFilterSection] = useState(false);
  const [filterBy, setFilterBy] = useState("None");
  const [clientSearch, setClientSearch] = useState("");
  const [state, setState] = useState({
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
    account_id: false,
    mt5_account: false,
  });
  const [searchField, setSearchField] = useState("");
  const [personName, setPersonName] = useState([]);
  const [sourceName, setSourceName] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [clientType, setClientType] = useState("");
  const [propSearchElement, setPropSearchElement] = useState(prop.search);
  const [listManagers, setListManagers] = useState([]);
  const [checkStatus, setcheckStatus] = useState("");
  const input1 = (event) => {
    const { name, value } = event.target;
    setClientSearch(value);
  };
  const getListManagers = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "list_managers");

    axios.post(Url + "/ajaxfiles/change_lead_data.php", param).then((res) => {
      if (res.data.message == "Session has been expired") {
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        // toast.error(res.data.message);
      } else {
        setListManagers(res.data.managers);
        setSoure(res.data.inquiry_source_master);
      }
    });
  };
  useEffect(() => {
    getListManagers();
  }, [prop.salesAgent]);

  const handleChange = (event) => {
    propSearchElement[
      propSearchElement.findIndex((x) => x.name == event.target.name)
    ].value = event.target.checked;
    setPropSearchElement([...propSearchElement]);
  };

  const filterByChange = (e) => {
    setFilterBy(e.target.value);
    if (e.target.value == "None") {
      prop.setParam({});
    }
    // prop.setParam({});
  };
  const handleChange1 = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setSourceName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    prop.setParam((prevalue) => {
      return {
        ...prevalue,
        source_id: typeof value === "string" ? value.split(",") : value,
      };
    });
  };
  const dynamicCheckbox = (e) => {
    let checkbox = [];
    propSearchElement.forEach((element) => {
      checkbox.push(
        <FormControlLabel
          className="searchByCheckbox"
          control={
            <Checkbox
              onChange={handleChange}
              name={element.name}
              checked={element.value ? element.value : ""}
            />
          }
          label={element.label}
        />
      );
    });
    return checkbox;
  };
  return (
    <div>
      <Grid container>
        <Grid item md={12} lg={12} xl={12}>
          <Paper
            elevation={2}
            style={{ borderRadius: "10px" }}
            className="pending-all-15px"
          >
            <Grid container spacing={2}>
              <Grid item sm={12} md={12}>
                <div className="newFilterSection">
                  <CssTextField
                    label="Search"
                    sx={{ width: "100%" }}
                    variant="standard"
                    value={searchField}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        prop.searchWord(e.target.value);
                      }
                    }}
                    onChange={(e) => setSearchField(e.target.value)}
                  />
                  <ColorButton
                    sx={{ padding: "7px 17px" }}
                    onClick={() => {
                      prop.searchWord(searchField);
                    }}
                  >
                    <SearchIcon />
                  </ColorButton>
                  <Button
                    className="main-color"
                    onClick={(event) => {
                      setFilterSection(!filterSection);
                    }}
                  >
                    <i className="material-icons">
                      {" "}
                      {filterSection ? "menu" : "filter_list"}
                    </i>
                  </Button>
                </div>
                <br />
                {filterSection ? (
                  <div>
                    <div className="SerachBySection">
                      <b class="mr-3">Search By : </b>
                      {dynamicCheckbox()}
                    </div>
                    {prop.isShowFilterBy ? (
                      ""
                    ) : (
                      <>
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <b class="mr-3">Filter By : </b>
                          <ColorButton
                            onClick={() => {
                              prop.setParam("");
                              setSearchField("");
                              setSourceName([]);
                              setParam({});
                              prop.searchWord("");
                              var serArray = [];
                              if (isArray(prop.search))
                                prop.search?.map((item, index) => {
                                  item.value = false;
                                  serArray = [...serArray, item];
                                  console.log(index, item.value);
                                });
                              // serArray
                              setPropSearchElement(serArray);
                            }}
                          >
                            Clear Filter
                          </ColorButton>
                        </div>
                        <div className="filterBy">
                          {prop.date ? (
                            ""
                          ) : (
                            <>
                              <TextField
                                type="date"
                                label="From Date"
                                variant="standard"
                                className="w-200px"
                                value={
                                  param?.start_date ? param?.start_date : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      end_date: prevalue.end_date,
                                      start_date: e.target.value,
                                    };
                                  });
                                  param.start_date = e.target.value;
                                  setParam({ ...param });
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                              <TextField
                                type="date"
                                label="To Date"
                                variant="standard"
                                className="w-200px"
                                value={param?.end_date ? param?.end_date : ""}
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      start_date: prevalue.start_date,
                                      end_date: e.target.value,
                                    };
                                  });
                                  param.end_date = e.target.value;
                                  setParam({ ...param });
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </>
                          )}
                          {prop.lead_assign_date ? (
                            <>
                              <TextField
                                type="date"
                                label="Lead Assign From Date"
                                variant="standard"
                                className="w-200px"
                                value={
                                  param?.lead_assign_start_date
                                    ? param?.lead_assign_start_date
                                    : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      lead_assign_end_date:
                                        prevalue.lead_assign_end_date,
                                      lead_assign_start_date: e.target.value,
                                    };
                                  });
                                  param.lead_assign_start_date = e.target.value;
                                  setParam({ ...param });
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                              <TextField
                                type="date"
                                label="Lead Assign To Date"
                                variant="standard"
                                className="w-200px"
                                value={
                                  param?.lead_assign_end_date
                                    ? param?.lead_assign_end_date
                                    : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      lead_assign_start_date:
                                        prevalue.lead_assign_start_date,
                                      lead_assign_end_date: e.target.value,
                                    };
                                  });
                                  param.lead_assign_end_date = e.target.value;
                                  setParam({ ...param });
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </>
                          ) : (
                            ""
                          )}
                          {prop.approvedDate ? (
                            <TextField
                              type="date"
                              label="Approved Date"
                              variant="standard"
                              className="w-200px"
                              value={
                                param?.approved_date ? param?.approved_date : ""
                              }
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    approved_date: e.target.value,
                                  };
                                });
                                param.approved_date = e.target.value;
                                setParam({ ...param });
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          ) : (
                            ""
                          )}

                          {prop.source_list ? (
                            <Autocomplete
                              disablePortal
                              // multiple
                              value={param?.source_id ? param?.source_id : ""}
                              options={prop.source_list}
                              getOptionLabel={(option) =>
                                option ? option.source_name : ""
                              }
                              // onInputChange={(event, newInputValue) => {
                              //   form.assigned_role_id = newInputValue.assigned_role_id;
                              //   // setForm({ ...form });
                              // }}
                              // onInputChange={(event, newInputValue) => {
                              //   fetchAccount(event, newInputValue);
                              // }}
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    source_list: newValue
                                      ? newValue.source_id
                                      : "",
                                  };
                                });
                                param.source_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Lead Source"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}

                          {!prop.ib_users_list ? (
                            ""
                          ) : (
                            <Autocomplete
                              options={prop.ib_users_list}
                              value={param?.ib_user_id ? param?.ib_user_id : ""}
                              getOptionLabel={(option) =>
                                option ? option.ib_user_name : ""
                              }
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    ib_users_list: newValue
                                      ? newValue.ib_user_id
                                      : "",
                                  };
                                });
                                param.ib_user_id = newValue;
                                setParam({ ...param });
                              }}
                              renderOption={(props, option) => {
                                return (
                                  <li {...props} key={option.ib_user_id}>
                                    {option.ib_user_name}
                                  </li>
                                );
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="IB Name"
                                  variant="standard"
                                />
                              )}
                            />
                          )}
                          {!prop.deposit_users_list ? (
                            ""
                          ) : (
                            <Autocomplete
                              disablePortal
                              // multiple
                              value={
                                param?.deposit_user_id
                                  ? param?.deposit_user_id
                                  : ""
                              }
                              options={prop.deposit_users_list}
                              getOptionLabel={(option) =>
                                option ? option.deposit_user_name : ""
                              }
                              renderOption={(props, option) => {
                                return (
                                  <li
                                    {...props}
                                    key={`${option.deposit_user_id}-${option.deposit_user_name}`}
                                  >
                                    {option.deposit_user_name}
                                  </li>
                                );
                              }}
                              // onInputChange={(event, newInputValue) => {
                              //   form.assigned_role_id = newInputValue.assigned_role_id;
                              //   // setForm({ ...form });
                              // }}
                              // onInputChange={(event, newInputValue) => {
                              //   fetchAccount(event, newInputValue);
                              // }}
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    deposit_users_list: newValue
                                      ? newValue.deposit_user_id
                                      : "",
                                  };
                                });

                                param.deposit_user_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Client Name"
                                  variant="standard"
                                />
                              )}
                            />
                          )}
                          {!prop.withdrawal_users_list ? (
                            ""
                          ) : (
                            <Autocomplete
                              disablePortal
                              // multiple
                              value={
                                param?.withdrawal_user_id
                                  ? param?.withdrawal_user_id
                                  : ""
                              }
                              options={prop.withdrawal_users_list}
                              getOptionLabel={(option) =>
                                option ? option.withdrawal_user_name : ""
                              }
                              renderOption={(props, option) => {
                                return (
                                  <li
                                    {...props}
                                    key={`${option.withdrawal_user_id}-${option.withdrawal_user_name}`}
                                  >
                                    {option.withdrawal_user_name}
                                  </li>
                                );
                              }}
                              // onInputChange={(event, newInputValue) => {
                              //   form.assigned_role_id = newInputValue.assigned_role_id;
                              //   // setForm({ ...form });
                              // }}
                              // onInputChange={(event, newInputValue) => {
                              //   fetchAccount(event, newInputValue);
                              // }}
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    withdrawal_user_id: newValue
                                      ? newValue.withdrawal_user_id
                                      : "",
                                  };
                                });
                                param.withdrawal_user_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Client Name"
                                  variant="standard"
                                />
                              )}
                            />
                          )}
                          {!prop.sales_manager_list ? (
                            ""
                          ) : (
                            <Autocomplete
                              value={
                                param?.sales_manager_id
                                  ? param?.sales_manager_id
                                  : ""
                              }
                              options={prop.sales_manager_list}
                              getOptionLabel={(option) =>
                                option ? option.sales_manager_name : ""
                              }
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    sales_manager_list: newValue
                                      ? newValue.sales_manager_id
                                      : "",
                                  };
                                });
                                param.sales_manager_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Sales Executive"
                                  variant="standard"
                                />
                              )}
                            />
                          )}
                          {prop.selectDynamic ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>
                                {prop.selectDynamic.label}
                              </InputLabel>
                              <Select
                                value={
                                  param[prop.selectDynamic.keyName]
                                    ? param[prop.selectDynamic.keyName]
                                    : ""
                                }
                                onChange={(e) => {
                                  setcheckStatus(e.target.value);
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      [prop.selectDynamic.keyName]:
                                        e.target.value,
                                    };
                                  });
                                  param[prop.selectDynamic.keyName] =
                                    e.target.value;
                                  setParam({ ...param });
                                }}
                                // className="w-200px"
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                {Object.keys(prop.selectDynamic.data).map(
                                  (item, key) => {
                                    return (
                                      <MenuItem value={item}>
                                        {prop.selectDynamic.data[item]}
                                      </MenuItem>
                                    );
                                  }
                                )}

                                {/* <MenuItem>Select Option</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>

                                <MenuItem value="1">Redeemed</MenuItem>

                                <MenuItem value="2">Missed</MenuItem> */}
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.selectDynamic1 ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>
                                {prop.selectDynamic1.label}
                              </InputLabel>
                              <Select
                                value={
                                  param[prop.selectDynamic1.keyName]
                                    ? param[prop.selectDynamic1.keyName]
                                    : ""
                                }
                                onChange={(e) => {
                                  // setcheckStatus(e.target.value);
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      [prop.selectDynamic1.keyName]:
                                        e.target.value,
                                    };
                                  });
                                  param[prop.selectDynamic1.keyName] =
                                    e.target.value;
                                  setParam({ ...param });
                                }}
                                // className="w-200px"
                              >
                                <MenuItem value={""}>None</MenuItem>
                                {Object.keys(prop.selectDynamic1.data).map(
                                  (item, key) => {
                                    return (
                                      <MenuItem value={item}>
                                        {prop.selectDynamic1.data[item]}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {!prop.country_list ? (
                            ""
                          ) : (
                            <Autocomplete
                              disablePortal
                              options={prop.country_list}
                              value={
                                param?.country_name ? param?.country_name : ""
                              }
                              getOptionLabel={(option) =>
                                option ? option.country_name : ""
                              }
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    country_list: newValue
                                      ? newValue.country_name
                                      : "",
                                  };
                                });
                                param.country_name = newValue;
                                setParam({ ...param });
                              }}
                              // sx={{ width: "200px" }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Country"
                                  variant="standard"
                                />
                              )}
                            />
                          )}
                          {prop.salesAgent ? (
                            <Autocomplete
                              value={
                                param?.lead_assign_user_id
                                  ? param?.lead_assign_user_id
                                  : ""
                              }
                              options={listManagers}
                              getOptionLabel={(option) =>
                                option ? option.manager_name : ""
                              }
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    lead_assign_user_id: newValue
                                      ? newValue.lead_assign_user_id
                                      : "",
                                  };
                                });
                                param.lead_assign_user_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Sales"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}

                          {prop.salesAgent ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Source</InputLabel>

                              <Select
                                id="demo-multiple-chip"
                                multiple
                                value={sourceName}
                                onChange={handleChange1}
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((value) => (
                                      <Chip key={value} label={value} />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                {soure.map((item) => {
                                  return (
                                    <MenuItem value={item.name}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.setcheckStatus || prop.setsaleStatus ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={param?.status ? param?.status : ""}
                                onChange={(e) => {
                                  // setcheckStatus(e.target.value);
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      status: e.target.value,
                                    };
                                  });
                                  param.status = e.target.value;
                                  setParam({ ...param });
                                }}
                                // className="w-200px"
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                {prop.setsaleStatus ? (
                                  <MenuItem value="1">Completed</MenuItem>
                                ) : (
                                  <MenuItem value="1">Approve</MenuItem>
                                )}

                                <MenuItem value="2">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.Check_Status ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={
                                  param?.transfer_status
                                    ? param?.transfer_status
                                    : ""
                                }
                                onChange={(e) => {
                                  // setcheckStatus(e.target.value);
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      transfer_status: e.target.value,
                                    };
                                  });
                                  param.transfer_status = e.target.value;
                                  setParam({ ...param });
                                }}
                                // className="w-200px"
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                <MenuItem value="1">Approve</MenuItem>
                                <MenuItem value="2">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}

                          {prop.userlist ? (
                            <Autocomplete
                              options={prop.userlist}
                              getOptionLabel={(option) =>
                                option ? option.name : ""
                              }
                              value={param?.user_id ? param?.user_id : ""}
                              renderOption={(props, option) => {
                                return (
                                  <li {...props} key={option.user_id}>
                                    {option.name}
                                  </li>
                                );
                              }}
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    user_id: newValue ? newValue.user_id : "",
                                  };
                                });
                                param.user_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Users"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}

                          {prop.FantasticFour ? (
                            <>
                              <FormControl
                                className="w-200px"
                                variant="standard"
                              >
                                <InputLabel>Winner</InputLabel>

                                {/* <InputLabel>KYC Status</InputLabel> */}
                                <Select
                                  label="Winner"
                                  value={
                                    param?.filter_is_winner
                                      ? param?.filter_is_winner
                                      : ""
                                  }
                                  onChange={(e) => {
                                    prop.setParam((prevalue) => {
                                      return {
                                        ...prevalue,
                                        filter_is_winner: e.target.value,
                                      };
                                    });
                                    param.filter_is_winner = e.target.value;
                                    setParam({ ...param });
                                  }}
                                  // sx={{ width: "200px" }}
                                >
                                  <MenuItem value="">Select Option</MenuItem>{" "}
                                  <MenuItem value="yes">Yes</MenuItem>
                                  <MenuItem value="no">No</MenuItem>
                                </Select>
                              </FormControl>
                              <FormControl
                                className="w-200px"
                                variant="standard"
                              >
                                <InputLabel>Winner Announce</InputLabel>

                                {/* <InputLabel>KYC Status</InputLabel> */}
                                <Select
                                  value={
                                    param?.filter_is_winner_announce
                                      ? param.filter_is_winner_announce
                                      : ""
                                  }
                                  label="Winner Announce"
                                  onChange={(e) => {
                                    prop.setParam((prevalue) => {
                                      return {
                                        ...prevalue,
                                        filter_is_winner_announce:
                                          e.target.value,
                                      };
                                    });
                                    param.filter_is_winner_announce =
                                      e.target.value;
                                    setParam({ ...param });
                                  }}
                                  // sx={{ width: "200px" }}
                                >
                                  {/* <MenuItem value="">Select</MenuItem> */}
                                  <MenuItem value="">Select Option</MenuItem>
                                  <MenuItem value="yes">Yes</MenuItem>
                                  <MenuItem value="no">No</MenuItem>
                                </Select>
                              </FormControl>
                            </>
                          ) : (
                            ""
                          )}
                          {prop.kycStatus ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>KYC Status</InputLabel>

                              {/* <InputLabel>KYC Status</InputLabel> */}
                              <Select
                                label="KYC Status"
                                value={
                                  param?.user_kyc_status
                                    ? param?.user_kyc_status
                                    : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      user_kyc_status: e.target.value,
                                    };
                                  });
                                  param.user_kyc_status = e.target.value;
                                  setParam({ ...param });
                                }}
                                // sx={{ width: "200px" }}
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                <MenuItem value="1">Completed</MenuItem>
                                <MenuItem value="2">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.ibList ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Sponsor Status</InputLabel>
                              <Select
                                label="Sponsor Status"
                                value={
                                  param?.sponsor_status
                                    ? param.sponsor_status
                                    : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      sponsor_status: e.target.value,
                                      admin_status: "",
                                    };
                                  });
                                  param.sponsor_status = e.target.value;
                                  setParam({ ...param });
                                }}
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                <MenuItem value="1">Completed</MenuItem>
                                <MenuItem value="2">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.ibList ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Admin Status</InputLabel>
                              <Select
                                label="Admin Status"
                                value={
                                  param?.admin_status ? param?.admin_status : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      admin_status: e.target.value,
                                      sponsor_status: "",
                                    };
                                  });
                                  param.admin_status = e.target.value;
                                  setParam({ ...param });
                                }}
                              >
                                <MenuItem>Select Option</MenuItem>
                                <MenuItem value="0">Pending</MenuItem>
                                <MenuItem value="1">Completed</MenuItem>
                                <MenuItem value="2">Rejected</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.userGroup ? (
                            <Autocomplete
                              options={prop.userGroup}
                              value={
                                param?.filter_user_group_id
                                  ? param?.filter_user_group_id
                                  : ""
                              }
                              getOptionLabel={(option) =>
                                option ? option.user_group_name : ""
                              }
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    filter_user_group_id: newValue
                                      ? newValue.filter_user_group_id
                                      : "",
                                  };
                                });
                                param.filter_user_group_id = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="User Group"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}

                          {prop.lastUpdatedBy ? (
                            <Autocomplete
                              options={prop.lastUpdatedBy}
                              getOptionLabel={(option) =>
                                option ? option.name : ""
                              }
                              value={
                                param?.modified_by ? param?.modified_by : ""
                              }
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    modified_by: newValue
                                      ? newValue.modified_by
                                      : "",
                                  };
                                });
                                param.modified_by = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Modified By"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}

                          {prop.checkStatusBonus ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={
                                  param?.bonus_offer_status
                                    ? param?.bonus_offer_status
                                    : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      bonus_offer_status: e.target.value,
                                    };
                                  });
                                  param.bonus_offer_status = e.target.value;
                                  setParam({ ...param });
                                }}
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="0">Disable</MenuItem>
                                <MenuItem value="1">Enable</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.search_users_list ? (
                            <Autocomplete
                              disablePortal
                              value={
                                param.search_user_id ? param.search_user_id : ""
                              }
                              options={prop.search_users_list}
                              getOptionLabel={(option) =>
                                option ? option.user_name : ""
                              }
                              renderOption={(props, option) => {
                                return (
                                  <li
                                    {...props}
                                    key={`${option.search_user_id}-${option.user_name}`}
                                  >
                                    {option.user_name}
                                  </li>
                                );
                              }}
                              onChange={(event, newValue) => {
                                param.search_user_id = newValue;
                                setParam({ ...param });
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    search_users_list: newValue
                                      ? newValue.search_user_id
                                      : "",
                                  };
                                });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="User"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}
                          {prop.advance_filters ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Advance Filters</InputLabel>

                              <Select
                                value={
                                  param?.advance_filters
                                    ? param?.advance_filters
                                    : ""
                                }
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      advance_filters: e.target.value,
                                    };
                                  });
                                  param.advance_filters = e.target.value;
                                  setParam({ ...param });
                                }}
                              >
                                <MenuItem value="">Select Option</MenuItem>{" "}
                                {Object.keys(prop.advance_filters).map(
                                  (index, item) => {
                                    return (
                                      <MenuItem value={index}>
                                        {prop.advance_filters[index]}
                                      </MenuItem>
                                    );
                                  }
                                )}
                                {/* <MenuItem value="0">Disable</MenuItem>
                              <MenuItem value="1">Enable</MenuItem> */}
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.transfer_methods ? (
                            <FormControl className="w-200px" variant="standard">
                              <InputLabel>Transfer Methods</InputLabel>
                              <Select
                                value={
                                  param?.transfer_methods
                                    ? param?.transfer_methods
                                    : ""
                                }
                                onChange={(e) => {
                                  // setcheckStatus(e.target.value);
                                  prop.setParam((prevalue) => {
                                    return {
                                      ...prevalue,
                                      transfer_methods: e.target.value,
                                    };
                                  });
                                  param.transfer_methods = e.target.value;
                                  setParam({ ...param });
                                }}
                              >
                                <MenuItem value="">Select Option</MenuItem>
                                <MenuItem value="wallet_to_mt5">
                                  Wallet to MT5
                                </MenuItem>
                                <MenuItem value="mt5_to_wallet">
                                  MT5 to Wallet
                                </MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            ""
                          )}
                          {prop.search_user_id1 ? (
                            <Autocomplete
                              disablePortal
                              options={prop.search_user_id1}
                              value={
                                param?.search_user_id1
                                  ? param?.search_user_id1
                                  : ""
                              }
                              getOptionLabel={(option) =>
                                option ? option.user_name : ""
                              }
                              renderOption={(props, option) => {
                                return (
                                  <li {...props} key={option.search_user_id}>
                                    {option.user_name}
                                  </li>
                                );
                              }}
                              onChange={(event, newValue) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    ...prevalue,
                                    search_user_id: newValue
                                      ? newValue.search_user_id
                                      : "",
                                  };
                                });
                                param.search_user_id1 = newValue;
                                setParam({ ...param });
                              }}
                              className="w-200px"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="User"
                                  variant="standard"
                                />
                              )}
                            />
                          ) : (
                            ""
                          )}
                          {prop.autoCompleteArray ? (
                            <>
                              {prop.autoCompleteArray.map((item) => {
                                return (
                                  <Autocomplete
                                    disablePortal
                                    options={item.options}
                                    value={
                                      param[item.keyName]
                                        ? param[item.keyName]
                                        : ""
                                    }
                                    getOptionLabel={(option) =>
                                      option ? option[item.serchlabel] : ""
                                    }
                                    renderOption={(props, option) => {
                                      return (
                                        <li
                                          {...props}
                                          key={`${option[item?.keyName]}-${
                                            option[item?.serchlabel]
                                          }`}
                                        >
                                          {option[item.serchlabel]}
                                        </li>
                                      );
                                    }}
                                    onChange={(event, newValue) => {
                                      prop.setParam((prevalue) => {
                                        return {
                                          ...prevalue,
                                          [item.keyName]: newValue
                                            ? newValue[item.keyName]
                                            : "",
                                        };
                                      });
                                      param[item.keyName] = newValue;
                                      setParam({ ...param });
                                    }}
                                    className="w-200px"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label={item.label}
                                        variant="standard"
                                      />
                                    )}
                                  />
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}

                          {prop.checkboxTrue ? (
                            <FormControlLabel
                              className="searchByCheckbox"
                              control={
                                <Checkbox
                                  checked={
                                    param[prop.checkboxTrue.keyName] == true
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    prop.setParam((prevalue) => {
                                      return {
                                        ...prevalue,
                                        [prop.checkboxTrue.keyName]:
                                          e.target.checked == true
                                            ? "unassigned"
                                            : "",
                                      };
                                    });
                                    param[prop.checkboxTrue.keyName] =
                                      e.target.checked;
                                    setParam({ ...param });
                                  }}
                                  name={prop.checkboxTrue.keyName}
                                />
                              }
                              label={prop.checkboxTrue.label}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default CommonFilter;
