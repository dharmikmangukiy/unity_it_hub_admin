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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IsApprove, Url } from "../global";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Color } from "highcharts";
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

// const source = [
//   "Website - IB Form",
//   "Website - Demo Form",
//   "CRM",
//   "Live",
//   "CRM - Multi Structure",
//   "Website - Live Form",
//   "Dedicated Link - IB",
// ];

const CommonFilter = (prop) => {
  const [soure, setSoure] = useState([]);

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
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
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
        // ...prevalue,
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
          control={<Checkbox onChange={handleChange} name={element.name} />}
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
                    // value={prop.searchWord}
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
                      {/* <FormControlLabel
                                            className='searchByCheckbox'
                                            control={
                                                <Checkbox checked={state.first_name} onChange={handleChange} name="first_name" />
                                            }
                                            label="First Name"
                                        />
                                        <FormControlLabel
                                            className='searchByCheckbox'
                                            control={
                                                <Checkbox checked={state.last_name} onChange={handleChange} name="last_name" />
                                            }
                                            label="Last Name"
                                        />
                                        <FormControlLabel
                                            className='searchByCheckbox'
                                            control={
                                                <Checkbox checked={state.email} onChange={handleChange} name="email" />
                                            }
                                            label="Email"
                                        />
                                        <FormControlLabel
                                            className='searchByCheckbox'
                                            control={
                                                <Checkbox checked={state.phone} onChange={handleChange} name="phone" />
                                            }
                                            label="Phone"
                                        />
                                        <FormControlLabel
                                            className='searchByCheckbox'
                                            control={
                                                <Checkbox checked={state.account_id} onChange={handleChange} name="account_id" />
                                            }
                                            label="Account ID"
                                        />
                                        <FormControlLabel
                                            className='searchByCheckbox'
                                            control={
                                                <Checkbox checked={state.mt5_account} onChange={handleChange} name="mt5_account" />
                                            }
                                            label="MT5 Account"
                                        /> */}
                    </div>
                    {prop.isShowFilterBy ? (
                      ""
                    ) : (
                      <div className="filterBy">
                        <b class="mb-2 d-block">Filter By :</b>
                        <FormControl>
                          <Select
                            label="Category"
                            value={filterBy}
                            onChange={filterByChange}
                            input={<BootstrapInput />}
                            sx={{ width: "200px" }}
                          >
                            <MenuItem value="None">None</MenuItem>
                            {prop.date ? (
                              ""
                            ) : (
                              <MenuItem value="Date">Date</MenuItem>
                            )}
                            {!prop.source_list ? (
                              ""
                            ) : (
                              <MenuItem value="sourceCilent">Source</MenuItem>
                            )}
                            {!prop.ib_users_list ? (
                              ""
                            ) : (
                              <MenuItem value="ibList">IB</MenuItem>
                            )}{" "}
                            {!prop.deposit_users_list ? (
                              ""
                            ) : (
                              <MenuItem value="ClientDeposit">Client</MenuItem>
                            )}{" "}
                            {!prop.sales_manager_list ? (
                              ""
                            ) : (
                              <MenuItem value="SalesCilent">Sales</MenuItem>
                            )}{" "}
                            {!prop.country_list ? (
                              ""
                            ) : (
                              <MenuItem value="countryCilent">Country</MenuItem>
                            )}
                            {prop.salesAgent ? (
                              <MenuItem value="Sales">Sales</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.salesAgent ? (
                              <MenuItem value="Source">Source</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.setcheckStatus || prop.setsaleStatus ? (
                              <MenuItem value="Status">Status</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.userlist ? (
                              <MenuItem value="Users">Users</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.kycStatus ? (
                              <MenuItem value="kycStatus">KYC Status</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.ibList ? (
                              <MenuItem value="sponsor">Sponsor</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.ibList ? (
                              <MenuItem value="admin">Admin</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.userGroup ? (
                              <MenuItem value="userGroup">User Group</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.lastUpdatedBy ? (
                              <MenuItem value="lastUpdatedBy">
                                Last Updated By
                              </MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.checkStatusBonus ? (
                              <MenuItem value="Bonus Status">
                                Bonus Status
                              </MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.search_users_list ? (
                              <MenuItem value="SearchUsersList">users</MenuItem>
                            ) : (
                              ""
                            )}
                            {prop.advance_filters ? (
                              <MenuItem value="advance_filters">
                                Advance Filters
                              </MenuItem>
                            ) : (
                              ""
                            )}
                            {/* {
                              prop.ibList ? <>
                                <MenuItem value="sponsor">Sponsor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                              </> : ""
                            } */}
                            {/* <MenuItem value="Account Type">Account Type</MenuItem> */}
                            {/* <MenuItem value="IB">IB</MenuItem> */}
                            {/*<MenuItem value="Source">Source</MenuItem>*/}
                          </Select>
                        </FormControl>
                        {filterBy == "kycStatus" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <label className="small font-weight-bold text-dark">
                              KYC Status
                            </label>
                            {/* <InputLabel>KYC Status</InputLabel> */}
                            <Select
                              label="KYC Status"
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    user_kyc_status: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              {/* <MenuItem value="">Select</MenuItem> */}
                              <MenuItem value="0">Pending</MenuItem>
                              <MenuItem value="1">Completed</MenuItem>
                              <MenuItem value="2">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          ""
                        )}
                        {filterBy !== "Date" ? (
                          <>
                            <FormControl>
                              <label className="small font-weight-bold text-dark">
                                From
                              </label>
                              <BootstrapInput
                                type="date"
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      end_date: prevalue.end_date,
                                      start_date: e.target.value,
                                    };
                                  });
                                }}
                              ></BootstrapInput>
                            </FormControl>
                            <FormControl>
                              <label className="small font-weight-bold text-dark">
                                To
                              </label>
                              <BootstrapInput
                                type="date"
                                onChange={(e) => {
                                  prop.setParam((prevalue) => {
                                    return {
                                      start_date: prevalue.start_date,
                                      end_date: e.target.value,
                                    };
                                  });
                                }}
                              ></BootstrapInput>
                            </FormControl>
                          </>
                        ) : filterBy == "Sales" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Select Sales</InputLabel>
                            <Select
                              labe
                              id="demo-multiple-chip"
                              value={personName}
                              input={<BootstrapInput />}
                              onChange={(e) => {
                                setPersonName(e.target.value);
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    lead_assign_user_id: e.target.value,
                                  };
                                });
                              }}
                            >
                              {listManagers.map((item) => {
                                return (
                                  <MenuItem value={item.lead_assign_user_id}>
                                    {item.manager_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        ) : filterBy == "Country" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Select Country</InputLabel>
                            <Select
                              labe
                              id="demo-multiple-chip"
                              multiple
                              value={personName}
                              input={
                                <OutlinedInput
                                  id="select-multiple-chip"
                                  label="Select Country"
                                />
                              }
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
                              {names.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  // style={getStyles(name, personName, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : filterBy == "Account Type" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <label className="small font-weight-bold text-dark">
                              Account Type
                            </label>
                            <Select
                              label="Category"
                              value={filterBy}
                              onChange={filterByChange}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              <MenuItem value="Individual">Individual</MenuItem>
                              <MenuItem value="Individual-IB">
                                Individual-IB
                              </MenuItem>
                              <MenuItem value="Corporate">Corporate</MenuItem>
                            </Select>
                          </FormControl>
                        ) : filterBy == "IB" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Select IB</InputLabel>
                            <Select
                              labe
                              id="demo-multiple-chip"
                              multiple
                              value={personName}
                              input={
                                <OutlinedInput
                                  id="select-multiple-chip"
                                  label="Select IB"
                                />
                              }
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
                              {names.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  // style={getStyles(name, personName, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : filterBy == "Source" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <Select
                              labe
                              id="demo-multiple-chip"
                              multiple
                              value={sourceName}
                              input={<BootstrapInput />}
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
                        {filterBy == "advance_filters" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <label className="small font-weight-bold text-dark">
                              Advance Filters
                            </label>
                            <Select
                              value={checkStatus}
                              onChange={(e) => {
                                setcheckStatus(e.target.value);
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    advance_filters: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              {/* <MenuItem value="">Select Option</MenuItem> */}

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
                        {filterBy == "sourceCilent" ? (
                          <Autocomplete
                            disablePortal
                            // multiple
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
                                  // ...prevalue,
                                  source_list: newValue
                                    ? newValue.source_id
                                    : "",
                                };
                              });
                            }}
                            sx={{ width: "200px" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Source"
                                variant="standard"
                              />
                            )}
                          />
                        ) : (
                          ""
                        )}
                        {filterBy == "ibList" ? (
                          <Autocomplete
                            disablePortal
                            options={prop.ib_users_list}
                            getOptionLabel={(option) =>
                              option ? option.ib_user_name : ""
                            }
                            onChange={(event, newValue) => {
                              prop.setParam((prevalue) => {
                                return {
                                  // ...prevalue,
                                  ib_users_list: newValue
                                    ? newValue.ib_user_id
                                    : "",
                                };
                              });
                            }}
                            sx={{ width: "200px" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="IB Name"
                                variant="standard"
                              />
                            )}
                          />
                        ) : (
                          ""
                        )}{" "}
                        {filterBy == "SearchUsersList" ? (
                          <Autocomplete
                            disablePortal
                            options={prop.search_users_list}
                            getOptionLabel={(option) =>
                              option ? option.user_name : ""
                            }
                            onChange={(event, newValue) => {
                              prop.setParam((prevalue) => {
                                return {
                                  // ...prevalue,
                                  search_users_list: newValue
                                    ? newValue.search_user_id
                                    : "",
                                };
                              });
                            }}
                            sx={{ width: "200px" }}
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
                        )}{" "}
                        {filterBy == "ClientDeposit" ? (
                          <Autocomplete
                            disablePortal
                            // multiple
                            options={prop.deposit_users_list}
                            getOptionLabel={(option) =>
                              option ? option.deposit_user_name : ""
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
                                  // ...prevalue,
                                  deposit_users_list: newValue
                                    ? newValue.deposit_user_id
                                    : "",
                                };
                              });
                            }}
                            sx={{ width: "200px" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Client Name"
                                variant="standard"
                              />
                            )}
                          />
                        ) : (
                          ""
                        )}
                        {filterBy == "SalesCilent" ? (
                          <Autocomplete
                            disablePortal
                            // multiple
                            options={prop.sales_manager_list}
                            getOptionLabel={(option) =>
                              option ? option.sales_manager_name : ""
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
                                  // ...prevalue,
                                  sales_manager_list: newValue
                                    ? newValue.sales_manager_id
                                    : "",
                                };
                              });
                            }}
                            sx={{ width: "200px" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Sales Executive"
                                variant="standard"
                              />
                            )}
                          />
                        ) : (
                          ""
                        )}{" "}
                        {filterBy == "countryCilent" ? (
                          <Autocomplete
                            disablePortal
                            // multiple
                            options={prop.country_list}
                            getOptionLabel={(option) =>
                              option ? option.country_name : ""
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
                                  // ...prevalue,
                                  country_list: newValue
                                    ? newValue.country_name
                                    : "",
                                };
                              });
                            }}
                            sx={{ width: "200px" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Country"
                                variant="standard"
                              />
                            )}
                          />
                        ) : (
                          ""
                        )}
                        {filterBy == "Bonus Status" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={checkStatus}
                              onChange={(e) => {
                                setcheckStatus(e.target.value);

                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    bonus_offer_status: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              <MenuItem>Select Option</MenuItem>
                              <MenuItem value="0">Disable</MenuItem>
                              <MenuItem value="1">Enable</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          ""
                        )}
                        {filterBy == "Status" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={checkStatus}
                              onChange={(e) => {
                                setcheckStatus(e.target.value);
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    status: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              <MenuItem>Select Option</MenuItem>
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
                        {filterBy == "Users" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Users</InputLabel>
                            <Select
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    user_id: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              {prop.userlist.map((item) => {
                                return (
                                  <MenuItem value={item.user_id}>
                                    {item.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        ) : (
                          ""
                        )}
                        {filterBy == "admin" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Admin Status</InputLabel>
                            <Select
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    admin_status: e.target.value,
                                    sponsor_status: "",
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
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
                        {filterBy == "sponsor" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>Sponsor Status</InputLabel>
                            <Select
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    sponsor_status: e.target.value,
                                    admin_status: "",
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
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
                        {filterBy == "userGroup" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <InputLabel>User Group</InputLabel>
                            <Select
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    user_group_id: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              {prop.userGroup.map((item) => {
                                return (
                                  <MenuItem value={item.user_group_id}>
                                    {item.user_group_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        ) : (
                          ""
                        )}
                        {filterBy == "lastUpdatedBy" ? (
                          <FormControl
                            sx={{ m: 1, width: 300 }}
                            className="multipleSelect"
                          >
                            <label className="small font-weight-bold text-dark">
                              Last Updated By
                            </label>

                            <Select
                              onChange={(e) => {
                                prop.setParam((prevalue) => {
                                  return {
                                    // ...prevalue,
                                    modified_by: e.target.value,
                                  };
                                });
                              }}
                              input={<BootstrapInput />}
                              sx={{ width: "200px" }}
                            >
                              {prop.lastUpdatedBy.map((item) => {
                                return (
                                  <MenuItem value={item.modified_by}>
                                    {item.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        ) : (
                          ""
                        )}
                      </div>
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
