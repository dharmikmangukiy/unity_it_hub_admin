import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { IsApprove, Url } from "../global";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    dob: "",
    nationality: "",
    country_of_residence: "",
    city: "",
    address: "",
    address_2: "",
    gender: "",
    postal_code: "",
    language: "",
    source: "",
    us_citizen: "",
    finacial_work: "",
    tax_number: "",
    politically_exposed: "",
    sales_agent: "",
  });
  const profileInput = (event) => {
    const { name, value } = event.target;
    setProfileForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  toast.configure();

  const profileSubmit = async () => {
    if (profileForm.title == "") {
      toast.error("Please select title");
    } else if (profileForm.first_name == "") {
      toast.error("Please enter first name");
    } else if (profileForm.last_name == "") {
      toast.error("Please enter last name");
    } else if (profileForm.phone == "") {
      toast.error("Please enter phone number");
    } else if (profileForm.email == "") {
      toast.error("Please enter email address");
    } else if (profileForm.dob == "") {
      toast.error("Please select date of birth");
    } else if (profileForm.nationality == "") {
      toast.error("Please select nationality");
    } else if (profileForm.country_of_residence == "") {
      toast.error("Please select country of residence");
    } else if (profileForm.city == "") {
      toast.error("Please enter city");
    } else if (profileForm.address == "") {
      toast.error("Please enter address");
    } else if (profileForm.gender == "") {
      toast.error("Please select gender");
    } else if (profileForm.postal_code == "") {
      toast.error("Please enter postal code");
    } else if (profileForm.language == "") {
      toast.error("Please select language");
    } else if (profileForm.source == "") {
      toast.error("Please enter source");
    } else if (profileForm.us_citizen == "") {
      toast.error("Please select us citizen");
    } else if (profileForm.finacial_work == "") {
      toast.error("Please select worked in financial");
    } else if (profileForm.tax_number == "") {
      toast.error("Please enter tax identification number");
    } else if (profileForm.politically_exposed == "") {
      toast.error("Please select politically exposed");
    } else if (profileForm.sales_agent == "") {
      toast.error("Please select sales agent");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("action", "update_basic_information");
      param.append("3r_id", id);
      param.append("manager_id", profileForm.sales_agent);
      param.append("user_title", profileForm.title);
      param.append("user_first_name ", profileForm.first_name);
      param.append("user_last_name ", profileForm.last_name);
      param.append("user_dob ", profileForm.dob);
      param.append("user_email ", profileForm.email);
      param.append("user_phone ", profileForm.phone);
      param.append("user_nationality ", profileForm.nationality);
      param.append("user_country ", profileForm.country_of_residence);
      param.append("user_city ", profileForm.city);
      param.append("user_address_1 ", profileForm.address);
      param.append("user_address_2 ", profileForm.address_2);
      param.append("user_gender ", profileForm.gender);
      param.append("user_postcode ", profileForm.postal_code);
      param.append("user_language ", profileForm.language);
      param.append("user_source ", profileForm.source);
      param.append("us_citizen ", profileForm.us_citizen);
      param.append("worked_in_financial ", profileForm.finacial_work);
      param.append("tax_identification_number ", profileForm.tax_number);
      param.append("politically_exposed ", profileForm.politically_exposed);
      // param.append('user_status ', profileForm.);
      // param.append('login_block ', profileForm.);
      axios
        .post(`${Url}/ajaxfiles/update_user_profile.php`, param)
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
          }
        });
      toast.success("Client profile has been updated");
    }
  };
  return (
    <div>
      {" "}
      <Grid container spacing={3} className="grid-handle">
        <Grid item md={9} lg={9} xl={9}>
          <Paper
            elevation={2}
            style={{ borderRadius: "10px" }}
            className="paper-main-section"
          >
            <p className="header-title">General Information</p>
            <div className="contentSection formSection">
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Title</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.title}
                    onChange={profileInput}
                    name="title"
                  >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Miss">Miss</MenuItem>
                    <MenuItem value="Ms">Ms</MenuItem>
                    <MenuItem value="Dr">Dr</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="First Name"
                  variant="standard"
                  //   value={userData.data["user_first_name"]}
                  value={profileForm.first_name}
                  focused
                  name="first_name"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Last Name"
                  variant="standard"
                  value={profileForm.last_name}
                  //   value={userData.data["user_last_name"]}
                  focused
                  name="last_name"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Phone"
                  value={profileForm.phone}
                  variant="standard"
                  focused
                  name="phone"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Email"
                  variant="standard"
                  value={profileForm.email}
                  //   value={userData.data["user_email"]}
                  focused
                  name="email"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <TextField
                  type="date"
                  className="input-font-small"
                  label="Date of Birth"
                  variant="standard"
                  sx={{ width: "100%" }}
                  focused
                  value={profileForm.dob}
                  name="dob"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Nationality</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    value={profileForm.nationality}
                    // value={age}
                    onChange={profileInput}
                    name="nationality"
                  >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Miss">Miss</MenuItem>
                    <MenuItem value="Ms">Ms</MenuItem>
                    <MenuItem value="Dr">Dr</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Country of Residence</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.country_of_residence}
                    onChange={profileInput}
                    name="country_of_residence"
                  >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Miss">Miss</MenuItem>
                    <MenuItem value="Ms">Ms</MenuItem>
                    <MenuItem value="Dr">Dr</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="City"
                  variant="standard"
                  focused
                  value={profileForm.city}
                  name="city"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Address"
                  variant="standard"
                  focused
                  value={profileForm.address}
                  name="address"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Address Line 2"
                  variant="standard"
                  focused
                  value={profileForm.address_2}
                  name="address_2"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Gendere</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.gender}
                    onChange={profileInput}
                    name="gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Postal Code"
                  variant="standard"
                  value={profileForm.postal_code}
                  focused
                  name="postal_code"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Language</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    value={profileForm.language}
                    onChange={profileInput}
                    name="language"
                  >
                    <MenuItem value="en-gb">English</MenuItem>
                    <MenuItem value="ar-ae">عربي</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Source"
                  variant="standard"
                  focused
                  value={profileForm.source}
                  name="source"
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>US citizen ?</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.us_citizen}
                    onChange={profileInput}
                    name="us_citizen"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Worked in Financial?</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.finacial_work}
                    onChange={profileInput}
                    name="finacial_work"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <TextField
                  className="input-font-small"
                  label="Tax Identification Number"
                  variant="standard"
                  focused
                  name="tax_number"
                  value={profileForm.tax_number}
                  onChange={profileInput}
                />
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Politically exposed ?</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.politically_exposed}
                    onChange={profileInput}
                    name="politically_exposed"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Sales Agent</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.sales_agent}
                    onChange={profileInput}
                    name="sales_agent"
                  >
                    <MenuItem value="1">Demo</MenuItem>
                    <MenuItem value="2">Test</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>Login Block</InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.login_block}
                    onChange={profileInput}
                    name="login_block"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </div>{" "}
              <div className="element">
                <FormControl variant="standard" sx={{ width: "100%" }} focused>
                  <InputLabel>User Status </InputLabel>
                  <Select
                    label
                    className="select-font-small"
                    // value={age}
                    value={profileForm.user_status}
                    onChange={profileInput}
                    name="user_status "
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="btnActionSection">
              <Button
                variant="contained"
                className="btn-success"
                onClick={profileSubmit}
              >
                Update Profile
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item md={3} lg={3} xl={3}>
          <Paper elevation={2} style={{ borderRadius: "10px" }}>
            <p className="header-title">Quick Actions</p>
            <div className="contentSection">
              <p className="group-header">Trading Account</p>
              <div className="mt5btngroup">
                <Button
                  variant="contained"
                  className="createMt5 btn-hover-css"
                  onClick={openDialogbox}
                >
                  Create MT5
                </Button>
                <Button
                  variant="contained"
                  className="mt5_access btn-hover-css"
                  onClick={openDialogbox}
                >
                  MT5 Access
                </Button>
                <Button
                  variant="contained"
                  className="link_mt5 btn-hover-css"
                  onClick={openDialogbox}
                >
                  Link MT5
                </Button>
                <Button
                  variant="contained"
                  className="reset_mt5 btn-hover-css"
                  onClick={openDialogbox}
                >
                  Reset MT5
                </Button>
                <Button
                  variant="contained"
                  className="change_leverage btn-hover-css"
                  onClick={openDialogbox}
                >
                  Change Leverage
                </Button>
                <Button
                  variant="contained"
                  className="change_password btn-hover-css"
                  onClick={openDialogbox}
                >
                  Change Password
                </Button>
              </div>
              <br />
              <p className="group-header">IB</p>
              <div className="mt5btngroup">
                <Button
                  variant="contained"
                  className="add_master_structure btn-hover-css"
                  onClick={openDialogbox}
                >
                  Add Master Structure
                </Button>
                <Button
                  variant="contained"
                  className="add_shared_structure btn-hover-css"
                  onClick={openDialogbox}
                >
                  Add Shared Structure
                </Button>
                <Button
                  variant="contained"
                  className="link_client btn-hover-css"
                  onClick={openDialogbox}
                >
                  Link Client
                </Button>
                <Button
                  variant="contained"
                  className="link_ib btn-hover-css"
                  onClick={openDialogbox}
                >
                  Link To IB
                </Button>
                <Button
                  variant="contained"
                  className="unlink_ib btn-hover-css"
                  onClick={openDialogbox}
                >
                  Unlink IB
                </Button>
              </div>
              <br />
              <p className="group-header">Communication</p>
              <div className="mt5btngroup">
                <Button
                  variant="contained"
                  className="send_email btn-hover-css"
                  onClick={openDialogbox}
                >
                  Send Email
                </Button>
              </div>
              <br />
              <p className="group-header">Client Portal</p>
              <div className="mt5btngroup">
                <Button
                  variant="contained"
                  className="cp_access btn-hover-css"
                  onClick={openDialogbox}
                >
                  CP Access
                </Button>
                <Button
                  variant="contained"
                  className="view_cp_password btn-hover-css"
                  onClick={openDialogbox}
                >
                  View CP Password
                </Button>
              </div>
              <br />
              <p className="group-header">Misc.</p>
              <div className="mt5btngroup">
                <Button
                  variant="contained"
                  className="download_application btn-hover-css"
                  onClick={openDialogbox}
                >
                  Download Application
                </Button>
                <Button
                  variant="contained"
                  className="add_note btn-hover-css"
                  onClick={openDialogbox}
                >
                  Add Note
                </Button>
                <Button
                  variant="contained"
                  className="add_bank btn-hover-css"
                  onClick={openDialogbox}
                >
                  Add Bank
                </Button>
                <Button
                  variant="contained"
                  className="add_transaction btn-hover-css"
                  onClick={openDialogbox}
                >
                  Add Transaction
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={3} className="grid-handle">
        <Grid item md={6} lg={6} xl={6}>
          <Paper
            elevation={2}
            style={{ borderRadius: "10px" }}
            className="paper-main-section"
          >
            <p className="header-title">Financial Information</p>
            <div className="contentSection">
              <Grid container spacing={3} className="grid-handle">
                <Grid item md={6} lg={6} xl={6}>
                  <p className="subtitle">Annual Income</p>
                </Grid>
                <Grid item md={6} lg={6} xl={6}>
                  <p className="subtitle">Source of Funds</p>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Grid>
        <Grid item md={6} lg={6} xl={6}>
          <Paper
            elevation={2}
            style={{ borderRadius: "10px" }}
            className="paper-main-section"
          >
            <p className="header-title">Employment Details</p>
            <div className="contentSection">
              <Grid container spacing={3} className="grid-handle">
                <Grid item md={6} lg={6} xl={6}>
                  <div className="element" style={{ width: "100%" }}>
                    <FormControl
                      variant="standard"
                      sx={{ width: "100%" }}
                      focused
                    >
                      <InputLabel>Employment Status</InputLabel>
                      <Select
                        label
                        className="select-font-small"
                        // value={age}
                        onChange={employementInput}
                        name="status"
                      >
                        <MenuItem value="Employed (full time)">
                          Employed (full time)
                        </MenuItem>
                        <MenuItem value="Self Employed">Self Employed</MenuItem>
                        <MenuItem value="Employed (part time )">
                          Employed (part time )
                        </MenuItem>
                        <MenuItem value="unemployed">unemployed</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Retired">Retired</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item md={6} lg={6} xl={6}>
                  <div className="element" style={{ width: "100%" }}>
                    <FormControl
                      variant="standard"
                      sx={{ width: "100%" }}
                      focused
                    >
                      <InputLabel>Inudstry</InputLabel>
                      <Select
                        label
                        className="select-font-small"
                        // value={age}
                        onChange={employementInput}
                        name="industry"
                      >
                        <MenuItem value="Aviation">Aviation</MenuItem>
                        <MenuItem value="Agricultural">Agricultural</MenuItem>
                        <MenuItem value="Financial industry">
                          Financial industry
                        </MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Retail industry">
                          Retail industry
                        </MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Management">Management</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                        <MenuItem value="Administration">
                          Administration
                        </MenuItem>
                        <MenuItem value="Academic">Academic</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        <MenuItem value="Civil Engineering">
                          Civil Engineering
                        </MenuItem>
                        <MenuItem value="Architecture">Architecture</MenuItem>
                        <MenuItem value="Media">Media</MenuItem>
                        <MenuItem value="Chemical engineering">
                          Chemical engineering
                        </MenuItem>
                        <MenuItem value="Power engineering">
                          Power engineering
                        </MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="btnActionSection employment-details">
                    <Button
                      variant="contained"
                      className="btn-success"
                      onClick={employmentDetailsSubmit}
                    >
                      Update Information
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Grid>
        <Grid item md={6} lg={6} xl={6}>
          <Paper
            elevation={2}
            style={{ borderRadius: "10px" }}
            className="paper-main-section"
          >
            <p className="header-title">Declarations</p>
            <div className="contentSection">
              <FormControlLabel
                className="declarationCheckbox"
                control={<Checkbox defaultChecked name="declaration" />}
                label="By clicking here I give my consent for Exiniti to contact me for marketing purposes. You can opt out at any time. For further details please see ourMarketing and Communication Policy Statement."
              />
              {/* <div className='element'>
                                    </div> */}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
