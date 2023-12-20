import "./list_request.css";
import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { IsApprove, Url } from "../global";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BootstrapInput, ColorButton } from "../common/CustomElement";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import "../commision_group/commision_group.css";
import NewDate from "../common/NewDate";

const ListRequest = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [isDefaultStructure, setIsDefaultStructure] = useState(true);
  const [resData, setResData] = useState({});
  const [value, setValue] = React.useState();
  const [OptionState, setOptionState] = useState();

  const [updateDate, setUpdateDate] = useState({
    structure_id: "",
    sponsor_approve: "",
    remarks: "",
    structure_name: "",
    structure_data: [],
    isLoader: false,
    refresh: false,
    admin_approve: "",
  });
  const input01 = (event) => {
    const { name, value } = event.target;
    setUpdateDate((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const [ibdata, setIbData] = useState("");
  const [param, setParam] = useState({});
  const partnershipcolumn = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span title={row.sr_no}>{row.sr_no}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "USER NAME",
      selector: (row) => {
        return (
          <span title={row.requested_user_name}>{row.requested_user_name}</span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.date}>
            <NewDate newDate={row.date} />
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.7,
    },
    {
      name: "ACQUIRE CLIENT",
      selector: (row) => {
        return <span title={row.acquire_client}>{row.acquire_client}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.6,
    },
    {
      name: "COUNTRY",
      selector: (row) => {
        return <span title={row.countries}>{row.countries}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Sponsor Name",
      selector: (row) => {
        return <span title={row.sponsor_name}>{row.sponsor_name}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "EMAIL",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.7,
    },

    {
      name: "STRUCTURE NAME",
      selector: (row) => {
        return <span title={row.structure_name}>{row.structure_name}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "REFFEERED",
      selector: (row) => {
        return (
          <span title={row.structure_name == "0" ? "NO" : "YES"}>
            {row.is_reffered == "0" ? "NO" : "YES"}
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "WEBSITE",
      selector: (row) => {
        return (
          <span title={row.is_website == "0" ? "NO" : "YES"}>
            {row.is_website == "0" ? "NO" : "YES"}
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "WEBSITE URL",
      selector: (row) => {
        return <span title={row.website_url}>{row.website_url}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "REMARK",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "SPONSOR APPROVE",
      selector: (row) => {
        return (
          <span
            title={
              row.sponsor_approve == "1"
                ? "APPROVED"
                : row.sponsor_approve == "2"
                ? "REJECTED"
                : "PENDING"
            }
            className={`text-color-${
              row.sponsor_approve == "1"
                ? "green"
                : row.sponsor_approve == "2"
                ? "red"
                : "yellow"
            }`}
          >
            {row.sponsor_approve == "1"
              ? "APPROVED"
              : row.sponsor_approve == "2"
              ? "REJECTED"
              : "PENDING"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "ADMIN APPROVE",
      selector: (row) => {
        return (
          <span
            title={
              row.admin_approve == "1"
                ? "APPROVED"
                : row.admin_approve == "2"
                ? "REJECTED"
                : "PENDING"
            }
            className={`text-color-${
              row.admin_approve == "1"
                ? "green"
                : row.admin_approve == "2"
                ? "red"
                : "yellow"
            }`}
          >
            {row.admin_approve == "1"
              ? "APPROVED"
              : row.admin_approve == "2"
              ? "REJECTED"
              : "PENDING"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            title={
              row.status == "1"
                ? "APPROVED"
                : row.status == "2"
                ? "REJECTED"
                : "PENDING"
            }
            className={`text-color-${
              row.status == "1" ? "green" : row.status == "2" ? "red" : "yellow"
            }`}
          >
            {row.status == "1"
              ? "APPROVED"
              : row.status == "2"
              ? "REJECTED"
              : "PENDING"}
          </span>
        );
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Updated By",
      selector: (row) => {
        return <span title={row.modified_by_name}>{row.modified_by_name}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "ACTION",
      selector: (row) => {
        return (
          <span title={row.structure_name}>
            {" "}
            {/* {((row.sponsor_approve == "1" && row.admin_approve == "0") || row.sponsor_id=="0") ?  */}
            {row.show_update_btn ? (
              <Button
                sx={{ color: "black" }}
                onClick={() => {
                  viewRequest(row);
                  setUpdateDate((preValue) => {
                    return {
                      ...preValue,
                      admin_approve: row.admin_approve,
                      remarks: row.remarks,
                      requested_user_id: row.requested_user_id,
                      ib_application_id: row.ib_application_id,
                    };
                  });
                }}
              >
                <i className="material-icons">view_timeline</i>
              </Button>
            ) : (
              ""
            )}
          </span>
        );
      },
      wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.1,
    },
  ];
  const viewRequest = async (prop) => {
    setIbData(prop);
    if (prop.sponsor_id == "0") {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "get_default_structure");
      param.append("user_id", prop.requested_user_id);
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
            setOptionState(res.data.fixed_structure_list);

            setIsDefaultStructure(true);
            updateDate.structure_data = res.data.data;
            if (res.data.structure_id) {
              updateDate.structure_id = res.data.structure_id;
              updateDate.structure_name = res.data.structure_name;
            }
            updateDate.remarks = prop.remarks;
            updateDate.admin_approve = prop.admin_approve;
            updateDate.structure_name = prop.structure_name;

            setUpdateDate({ ...updateDate });

            // setMaxWidth('md');
            // setDialogTitle('Add');
            setOpenModel(true);
          }
        });
    } else if (prop.sponsor_id != "0" && prop.structure_id != "0") {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "get_my_structure");
      param.append("user_id", prop.requested_user_id);
      param.append("structure_id", prop.structure_id);
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
            setIsDefaultStructure(false);
            updateDate.structure_data = res.data.data;
            if (res.data.structure_id) {
              updateDate.structure_id = res.data.structure_id;
              updateDate.structure_name = res.data.structure_name;
            }
            updateDate.remarks = prop.remarks;
            updateDate.admin_approve = prop.admin_approve;
            updateDate.structure_name = prop.structure_name;

            setUpdateDate({ ...updateDate });
            setOpenModel(true);
          }
        });
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("action", "get_default_structure");
      param.append("user_id", prop.requested_user_id);
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
            setOptionState(res.data.fixed_structure_list);
            setOpenModel(true);
          }
        });
      setOpenModel(true);
    }
    /* const param = new FormData();
    param.append("is_app", 1);
    param.append("AADMIN_LOGIN_ID", 1);
    param.append("user_id", id);
    param.append("action", "get_my_structure");
    axios
      .post(Url + "/ajaxfiles/master_structure_manage.php", param)
      .then((res) => {
        setGetStructuresList(res.data.data);
      }); */
  };
  const handleClose = () => {
    setOpenModel(false);
  };
  // const updatePartnership = () => {
  //   if (updateDate.sponsor_approve == "") {
  //     toast.error("Status is required");
  //   } else if (updateDate.remarks == "") {
  //     toast.error("Remark is required");
  //   } else {
  //     const param = new FormData();
  //     // param.append("is_app", 1);
  //     // param.append("AADMIN_LOGIN_ID", 1);
  //     //    param.append("user_id", id);
  //     param.append("action", "update_partnership_request");

  //     param.append("ib_application_id", ibdata.ib_application_id);
  //     // param.append("structure_id", updateDate.structure_id);
  //     param.append("admin_approve", updateDate.sponsor_approve);
  //     param.append("remarks", updateDate.remarks);
  //     setUpdateDate((prevalue) => {
  //       return {
  //         ...prevalue,
  //         isLoader: true,

  //       };
  //     });
  //     axios
  //       .post(Url + "/ajaxfiles/partnership_request_manage.php", param)
  //       .then((res) => {
  //         if (res.data.status == "error") {
  //           toast.error(res.data.message);
  //           setUpdateDate((prevalue) => {
  //             return {
  //               ...prevalue,
  //               isLoader: false,
  //             };
  //           });
  //         } else {
  //           toast.success(res.data.message);
  //           setUpdateDate((prevalue) => {
  //             return {
  //               ...prevalue,
  //               isLoader: false,
  //               refresh: !updateDate.refresh,
  //             };
  //           });
  //           setOpenModel(false);
  //         }
  //       });
  //   }
  // };
  toast.configure();
  console.log(updateDate);
  const updatePartnership = async () => {
    // if (updateDate.structure_data.length > 0) {
    //   if (updateDate.structure_name == "") {
    //     toast.error("Please enter structure name");
    //     error = true;
    //   } else {
    //     updateDate.structure_data.forEach((element) => {
    //       if (element.group_rebate === "") {
    //         toast.error(`Please enter ${element.ib_group_name} rebate`);
    //         error = true;
    //         return false;
    //       } else if (element.group_commission === "") {
    //         toast.error(`Please enter ${element.ib_group_name} commission`);
    //         error = true;
    //         return false;
    //       } else if (element.ib_group_level_id === 0) {
    //         toast.error(`Please enter ${element.ib_group_name} ib group`);
    //         error = true;
    //         return false;
    //       } else {
    //         element.pair_data.forEach((element1) => {
    //           if (element1.rebate === "") {
    //             toast.error(
    //               `Please enter ${element.ib_group_name} in ${element1.pair_name} rebate`
    //             );
    //             error = true;
    //             return false;
    //           } else if (element1.rebate > element.group_rebate) {
    //             // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} rebate invalid`);
    //             toast.error(
    //               `Pair Rebate for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group rebate`
    //             );
    //             error = true;
    //             return false;
    //           } else if (element1.commission === "") {
    //             toast.error(
    //               `Please enter ${element.ib_group_name} in ${element1.pair_name} commission`
    //             );
    //             error = true;
    //             return false;
    //           } else if (element1.commission > element.group_commission) {
    //             // toast.error(`Please enter ${element.ib_group_name} in ${element1.pair_name} commission invalid`);
    //             toast.error(
    //               `Pair Commission for ${element1.pair_name} can not be greater then ${element.ib_group_name} 1 group commission`
    //             );
    //             error = true;
    //             return false;
    //           }
    //         });
    //       }
    //       if (error) {
    //         return false;
    //       }
    //     });
    //   }
    //   if (error) {
    //     return false;
    //   }
    // }

    if (updateDate.structure_name == "") {
      toast.error("Please enter structure name");
    } else {
      updateDate.isLoader = true;
      setUpdateDate({ ...updateDate });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }

      param.append("requested_user_id", ibdata.requested_user_id);
      param.append("ib_application_id", ibdata.ib_application_id);
      param.append("remarks", updateDate.remarks);
      param.append("commission_type", value);

      // param.append('sponsor_approve', updateDate.sponsor_approve);
      param.append("admin_approve", updateDate.admin_approve);
      param.append("structure_name", updateDate.structure_name);
      if (updateDate.structure_id) {
        param.append("structure_id", updateDate.structure_id);
        param.append("action", "update_master_structure");
      }
      if (value == "fixed") {
        param.append("structure_id", updateDate.structure_name);
        param.append("admin_approve", updateDate.admin_approve);
        param.append("remarks", updateDate.remarks);
      }
      if (updateDate.structure_id == "") {
        param.append("action", "insert_master_structure");
      }
      param.append("pair_data", JSON.stringify(updateDate.structure_data));

      await axios
        .post(`${Url}/ajaxfiles/structures_manage.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          updateDate.isLoader = false;
          setUpdateDate({ ...updateDate });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setOpenModel(false);
            setUpdateDate({
              structure_id: "",
              sponsor_approve: "",
              admin_approve: "",
              remarks: "",
              structure_name: "",
              structure_data: [],
              isLoader: false,
              refresh: !updateDate.refresh,
              admin_approve: "",
            });
          }
        });
    }
    // }
  };
  const [searchBy, setSearchBy] = useState([
    {
      label: "USER NAME",
      value: false,
      name: "requested_user_name",
    },
    {
      label: "ACQUIRE CLIENT",
      value: false,
      name: "acquire_client",
    },
    {
      label: "COUNTRY",
      value: false,
      name: "countries",
    },
    {
      label: "Sponsor Name",
      value: false,
      name: "sponsor_name",
    },
    {
      label: "EMAIL",
      value: false,
      name: "user_email",
    },
    {
      label: "STRUCTURE NAME",
      value: false,
      name: "structure_name",
    },
    {
      label: "REMARK",
      value: false,
      name: "remarks",
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

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  console.log(updateDate);
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">IB Request List</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  ibList={true}
                  setParam={setParam}
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CommonTable
                    url={`${Url}/datatable/partnership_requests.php`}
                    column={partnershipcolumn}
                    sort="0"
                    search={searchBy}
                    refresh={updateDate.refresh}
                    searchWord={searchKeyword}
                    param={param}
                    setResData={setResData}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Dialog
              open={openModel}
              onClose={handleClose}
              // aria-labelledby="alert-dialog-title"
              // aria-describedby="alert-dialog-description"
              style={{
                opacity: "1",
                transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              }}
              PaperProps={{
                sx: {
                  width: "50%",
                  maxWidth: "768px",
                  borderRadius: "10px",
                  elevation: "24",
                  class: "border border-bottom-0",
                },
              }}
            >
              <DialogTitle
                id="alert-dialog-title"
                className="d-flex align-items-center p-3"
                style={{ borderBottom: "none" }}
              >
                <h5 className="ml-3 w-100 text-start mt-2 mb-2 font-weight-bold">
                  View IB
                </h5>
                <CloseIcon
                  onClick={() => {
                    setOpenModel(false);
                  }}
                />
              </DialogTitle>
              <DialogContent className="view-ib-content-section">
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    <b>Select IB</b>
                  </FormLabel>
                  <RadioGroup
                    style={{ display: "unset", padding: "0px 0 18px 0" }}
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="manual"
                      control={<Radio />}
                      label="Manual"
                    />
                    <FormControlLabel
                      value="fixed"
                      control={<Radio />}
                      label="Fixed"
                    />
                  </RadioGroup>
                </FormControl>
                {value === "manual" && (
                  <Grid container spacing={1}>
                    <div>
                      <div
                        className="main-content-display"
                        style={{
                          borderBottom: "1px solid gray",
                          paddingBottom: "18px",
                          marginBottom: "11px",
                        }}
                      >
                        <div className="display-element">
                          <h6>User Name</h6>
                          <div>{ibdata.requested_user_name}</div>
                        </div>
                        <div className="display-element">
                          <h6>DATE</h6>
                          <div>{ibdata.date}</div>
                        </div>
                        <div className="display-element">
                          <h6>ACQUIRE CLIENT</h6>
                          <div>{ibdata.acquire_client}</div>
                        </div>
                        <div className="display-element">
                          <h6>COUNTRY</h6>
                          <div>{ibdata.countries}</div>
                        </div>
                        <div className="display-element">
                          <h6>EMAIL</h6>
                          <div>{ibdata.user_email}</div>
                        </div>
                        <div className="display-element">
                          <h6>Sponsor Name</h6>
                          <div>{ibdata.sponsor_name}</div>
                        </div>
                        <div className="display-element">
                          <h6>STRUCTURE NAME</h6>
                          <div>{ibdata.structure_name}</div>
                        </div>
                        <div className="display-element">
                          <h6>REFFEERED</h6>
                          <div>{ibdata.is_reffered == "0" ? "NO" : "YES"}</div>
                        </div>
                        <div className="display-element">
                          <h6>WEBSITE</h6>
                          <div>{ibdata.is_website == "0" ? "NO" : "YES"}</div>
                        </div>
                        <div className="display-element">
                          <h6>WEBSITE URL</h6>
                          <div>{ibdata.website_url}</div>
                        </div>
                        <div className="display-element">
                          <h6>REMARK</h6>
                          <div>{ibdata.remarks}</div>
                        </div>
                        <div className="display-element">
                          <h6>IB APPROVE</h6>
                          <div
                            className={`col s12 text-color-${
                              ibdata.sponsor_approve == "1"
                                ? "green"
                                : ibdata.sponsor_approve == "2"
                                ? "red"
                                : "yellow"
                            }`}
                          >
                            {ibdata.sponsor_approve == "1"
                              ? "APPROVED"
                              : ibdata.sponsor_approve == "2"
                              ? "REJECTED"
                              : "PENDING"}
                          </div>
                        </div>
                        <div className="display-element">
                          <h6>ADMIN APPROVE</h6>
                          <div
                            className={`col s12 text-color-${
                              ibdata.admin_approve == "1"
                                ? "green"
                                : ibdata.admin_approve == "2"
                                ? "red"
                                : "yellow"
                            }`}
                          >
                            {ibdata.admin_approve == "1"
                              ? "APPROVED"
                              : ibdata.admin_approve == "2"
                              ? "REJECTED"
                              : "PENDING"}
                          </div>
                        </div>
                        <div className="display-element">
                          <h6>STATUS</h6>
                          <div
                            className={`col s12 text-color-${
                              ibdata.status == "1"
                                ? "green"
                                : ibdata.status == "2"
                                ? "red"
                                : "yellow"
                            }`}
                          >
                            {ibdata.status == "1"
                              ? "APPROVED"
                              : ibdata.status == "2"
                              ? "REJECTED"
                              : "PENDING"}
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="main-content-input">
                      <div className="ib-structure view-commission-content-section">
                        {ibdata.sponsor_id == "0" ? (
                          <div style={{ width: "100%" }}>
                            {/* <TextField
                            label="Structure Name"
                            id="outlined-basic"
                            variant="outlined"
                            sx={{ width: "100%" }}
                            name="structure_name"
                            value={updateDate.structure_name}
                            onChange={input01}
                          /> */}
                            <label
                              htmlFor="remarks"
                              className="text-info font-weight-bold form-label-head w-100 mt-4 required"
                            >
                              Structure Name
                            </label>
                            <BootstrapInput
                              name="structure_name"
                              value={updateDate.structure_name}
                              onChange={input01}
                              displayEmpty
                              inputProps={{
                                "aria-label": "Without label",
                              }}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        {updateDate.structure_data?.map((item, index) => {
                          return (
                            <div className="group-structure-section">
                              <div className="main-section">
                                <div className="main-section-title">
                                  {item.ib_group_name}
                                </div>
                                <div className="main-section-input-element">
                                  <div>
                                    <span>Rebate</span>
                                    <input
                                      type="text"
                                      className="Rebate_amount"
                                      placeholder="Rebate"
                                      value={item.group_rebate}
                                      disabled={!isDefaultStructure}
                                      onChange={(e) => {
                                        var floatNumber =
                                          e.target.value.split(".");
                                        if (!isNaN(Number(e.target.value))) {
                                          if (
                                            floatNumber.length == 1 ||
                                            (floatNumber.length == 2 &&
                                              floatNumber[1].length <= 3)
                                          ) {
                                            updateDate.structure_data[index][
                                              "group_rebate"
                                            ] = e.target.value;
                                            updateDate.structure_data[index][
                                              "pair_data"
                                            ].forEach((value, valueIndex) => {
                                              if (
                                                updateDate.structure_data[index]
                                                  .pair_data[valueIndex]
                                                  .pair_name == "crypto" ||
                                                updateDate.structure_data[index]
                                                  .pair_data[valueIndex]
                                                  .pair_name == "indices"
                                              ) {
                                              } else {
                                                updateDate.structure_data[
                                                  index
                                                ]["pair_data"][valueIndex][
                                                  "rebate"
                                                ] = e.target.value;
                                              }
                                            });
                                            setUpdateDate({
                                              ...updateDate,
                                            });
                                          }
                                        } else if (
                                          e.target.value == "" ||
                                          e.target.value == 0
                                        ) {
                                          updateDate.structure_data[index][
                                            "group_rebate"
                                          ] = 0;
                                          updateDate.structure_data[index][
                                            "pair_data"
                                          ].forEach((value, valueIndex) => {
                                            updateDate.structure_data[index][
                                              "pair_data"
                                            ][valueIndex]["rebate"] = 0;
                                          });
                                          setUpdateDate({
                                            ...updateDate,
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: "block",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <span>Commission</span>
                                    <input
                                      type="text"
                                      className="commission_amount"
                                      placeholder="Commission"
                                      value={item.group_commission}
                                      disabled={!isDefaultStructure}
                                      onChange={(e) => {
                                        var floatNumber =
                                          e.target.value.split(".");
                                        if (!isNaN(Number(e.target.value))) {
                                          if (
                                            floatNumber.length == 1 ||
                                            (floatNumber.length == 2 &&
                                              floatNumber[1].length <= 3)
                                          ) {
                                            updateDate.structure_data[index][
                                              "group_commission"
                                            ] = e.target.value;
                                            updateDate.structure_data[index][
                                              "pair_data"
                                            ].forEach((value, valueIndex) => {
                                              updateDate.structure_data[index][
                                                "pair_data"
                                              ][valueIndex]["commission"] =
                                                e.target.value;
                                            });
                                            setUpdateDate({
                                              ...updateDate,
                                            });
                                          }
                                        } else if (
                                          e.target.value == "" ||
                                          e.target.value == 0
                                        ) {
                                          updateDate.structure_data[index][
                                            "group_commission"
                                          ] = 0;
                                          updateDate.structure_data[index][
                                            "pair_data"
                                          ].forEach((value, valueIndex) => {
                                            updateDate.structure_data[index][
                                              "pair_data"
                                            ][valueIndex]["commission"] = 0;
                                          });
                                          setUpdateDate({
                                            ...updateDate,
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="action-section">
                                  {isDefaultStructure ? (
                                    <div style={{ width: "95%" }}>
                                      {item.ibGroup != undefined ? (
                                        <Autocomplete
                                          className="autoComplete-input-remove-border"
                                          // disablePortal
                                          options={item.ibGroup}
                                          getOptionLabel={(option) =>
                                            option ? option.ib_group_name : ""
                                          }
                                          onInputChange={(
                                            event,
                                            newInputValue
                                          ) => {
                                            // fetchAccount(event, newInputValue);
                                          }}
                                          onChange={(event, newValue) => {
                                            updateDate.structure_data[index][
                                              "ib_group_level_id"
                                            ] = newValue.ib_group_level_id;
                                            setUpdateDate({
                                              ...updateDate,
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="IB Group"
                                              variant="standard"
                                              style={{
                                                width: "100%",
                                                border: "0px !important",
                                              }}
                                            />
                                          )}
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <span
                                    onClick={(e) => {
                                      updateDate.structure_data[index][
                                        "is_visible"
                                      ] = !item.is_visible;
                                      setUpdateDate({ ...updateDate });
                                    }}
                                  >
                                    <i
                                      class={`fa ${
                                        item.is_visible
                                          ? "fa-angle-up"
                                          : "fa-angle-down"
                                      }`}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`pair-section ${
                                  item.is_visible ? "child-section-visible" : ""
                                }`}
                              >
                                {item.pair_data?.map((item1, index1) => {
                                  return (
                                    <div className="pair-data">
                                      <div className="pair-data-title">
                                        {item1.pair_name}
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          className="rebert_amount"
                                          placeholder="Rebert"
                                          value={item1.rebate}
                                          disabled={!isDefaultStructure}
                                          onChange={(e) => {
                                            var floatNumber =
                                              e.target.value.split(".");
                                            if (
                                              !isNaN(Number(e.target.value))
                                            ) {
                                              if (
                                                floatNumber.length == 1 ||
                                                (floatNumber.length == 2 &&
                                                  floatNumber[1].length <= 3)
                                              ) {
                                                updateDate.structure_data[
                                                  index
                                                ]["pair_data"][index1][
                                                  "rebate"
                                                ] = e.target.value;
                                                setUpdateDate({
                                                  ...updateDate,
                                                });
                                              }
                                            } else if (
                                              e.target.value == "" ||
                                              e.target.value == 0
                                            ) {
                                              updateDate.structure_data[index][
                                                "pair_data"
                                              ][index1]["rebate"] = 0;
                                              setUpdateDate({
                                                ...updateDate,
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
                                          disabled={!isDefaultStructure}
                                          onChange={(e) => {
                                            var floatNumber =
                                              e.target.value.split(".");
                                            if (
                                              !isNaN(Number(e.target.value))
                                            ) {
                                              if (
                                                floatNumber.length == 1 ||
                                                (floatNumber.length == 2 &&
                                                  floatNumber[1].length <= 3)
                                              ) {
                                                updateDate.structure_data[
                                                  index
                                                ]["pair_data"][index1][
                                                  "commission"
                                                ] = e.target.value;
                                                setUpdateDate({
                                                  ...updateDate,
                                                });
                                              }
                                            } else if (
                                              e.target.value == "" ||
                                              e.target.value == 0
                                            ) {
                                              updateDate.structure_data[index][
                                                "pair_data"
                                              ][index1]["commission"] = 0;
                                              setUpdateDate({
                                                ...updateDate,
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
                      {/* { */}
                      {/* (ibdata.sponsor_id == "0") ? <div>
                      <label
                        htmlFor="sponsor_approve"
                        className="text-info font-weight-bold form-label-head w-100  required"
                      >
                        Sponsor Status
                      </label>
                      <Select
                        value={updateDate.sponsor_approve}
                        name="sponsor_approve"
                        onChange={input01}
                        displayEmpty
                        inputProps={{
                          "aria-label": "Without label",
                        }}
                        input={<BootstrapInput />}
                        className="mt-0 ml-0"
                        style={{ width: "100%" }}
                      >
                        <MenuItem value="">Select Option</MenuItem>
                        <MenuItem value="0">PENDING</MenuItem>
                        <MenuItem value="1">APPROVED</MenuItem>
                        <MenuItem value="2">REJECTED</MenuItem>
                      </Select>
                    </div> : ""
                    } */}

                      <div>
                        <label
                          htmlFor="sponsor_approve"
                          className="text-info font-weight-bold form-label-head w-100  required"
                        >
                          Admin Status
                        </label>
                        <Select
                          value={updateDate.admin_approve}
                          name="admin_approve"
                          onChange={input01}
                          displayEmpty
                          inputProps={{
                            "aria-label": "Without label",
                          }}
                          input={<BootstrapInput />}
                          className="mt-0 ml-0"
                          style={{ width: "100%" }}
                        >
                          <MenuItem value="">Select Option</MenuItem>
                          <MenuItem value="0">PENDING</MenuItem>
                          <MenuItem value="1">APPROVED</MenuItem>
                          <MenuItem value="2">REJECTED</MenuItem>
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="remarks"
                          className="text-info font-weight-bold form-label-head w-100 mt-4 required"
                        >
                          Remarks
                        </label>
                        <BootstrapInput
                          name="remarks"
                          value={updateDate.remarks}
                          onChange={input01}
                          displayEmpty
                          inputProps={{
                            "aria-label": "Without label",
                          }}
                        />
                      </div>
                      <div>
                        {updateDate.isLoader ? (
                          <ColorButton
                            tabindex="0"
                            size="large"
                            style={{ padding: "20px 65px" }}
                            // className="createMt5Formloder "
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
                          </ColorButton>
                        ) : (
                          <ColorButton onClick={updatePartnership}>
                            {updateDate.structure_id == ""
                              ? "Approve structure"
                              : "Update structure"}
                          </ColorButton>
                        )}
                        {/* <ColorButton onClick={updatePartnership}>Update</ColorButton> */}
                      </div>
                    </div>
                  </Grid>
                )}

                {value === "fixed" && (
                  <Grid spacing={1}>
                    <div>
                      <div style={{ width: "100%" }}>
                        <label
                          htmlFor="sponsor_approve"
                          className="text-info font-weight-bold form-label-head w-100  required"
                        >
                          Select Structure
                        </label>
                        <Select
                          value={updateDate.structure_name}
                          name="structure_name"
                          onChange={input01}
                          displayEmpty
                          inputProps={{
                            "aria-label": "Without label",
                          }}
                          input={<BootstrapInput />}
                          className="mt-0 ml-0"
                          style={{ width: "100%" }}
                        >
                          <MenuItem value="">Select Option</MenuItem>
                          {OptionState?.map((option) => (
                            <MenuItem value={option.structure_id}>
                              {option.structure_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="sponsor_approve"
                          className="text-info font-weight-bold form-label-head w-100  required"
                        >
                          Admin Status
                        </label>
                        <Select
                          value={updateDate.admin_approve}
                          name="admin_approve"
                          onChange={input01}
                          displayEmpty
                          inputProps={{
                            "aria-label": "Without label",
                          }}
                          input={<BootstrapInput />}
                          className="mt-0 ml-0"
                          style={{ width: "100%" }}
                        >
                          <MenuItem value="">Select Option</MenuItem>
                          <MenuItem value="0">PENDING</MenuItem>
                          <MenuItem value="1">APPROVED</MenuItem>
                          <MenuItem value="2">REJECTED</MenuItem>
                        </Select>
                      </div>

                      <div style={{ width: "100%" }}>
                        <label
                          htmlFor="remarks"
                          className="text-info font-weight-bold form-label-head w-100 mt-2 required"
                        >
                          Remarks
                        </label>
                        <BootstrapInput
                          style={{ width: "100%" }}
                          name="remarks"
                          value={updateDate.remarks}
                          onChange={input01}
                          displayEmpty
                          inputProps={{
                            "aria-label": "Without label",
                          }}
                        />
                      </div>
                      <div className="my-2 text-right">
                        {updateDate.isLoader ? (
                          <ColorButton
                            tabindex="0"
                            size="large"
                            style={{ padding: "20px 65px" }}
                            // className="createMt5Formloder "
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
                          </ColorButton>
                        ) : (
                          <ColorButton onClick={updatePartnership}>
                            {updateDate.structure_id == ""
                              ? "Approve structure"
                              : "Update structure"}
                          </ColorButton>
                        )}
                        {/* <ColorButton onClick={updatePartnership}>Update</ColorButton> */}
                      </div>
                    </div>
                  </Grid>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRequest;
