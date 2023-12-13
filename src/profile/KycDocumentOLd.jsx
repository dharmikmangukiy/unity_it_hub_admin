import React, { useState, useEffect } from "react";
import { Grid, Input } from "@mui/material";
import { Paper } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { IsApprove, Url } from "../global";
import { BootstrapInput, ColorButton } from "../common/CustomElement";

const KycDocument = (prop) => {
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState(null);
  const [option, setOption] = useState(true);
  const [change1, setChange1] = useState(false);
  const [change, setChange] = useState(false);
  const [fontimg, setFontimg] = useState("");
  const [backimg, setBackimg] = useState("");
  const [mainLoader, setMainLoader] = useState(true);
  const [addfontimg, setAddFontimg] = useState("");
  const [addbackimg, setAddBackimg] = useState("");
  const [sendKycRequest, setSendKycRequest] = useState({
    proof1: false,
    proof2: false,
    proof3: false,
  });
  const [proofAdd, setProofAdd] = useState([]);
  const [kycStatus, setKycStatus] = useState("");
  const [document, setDocument] = useState(false);
  const [addressProof, setAddressProof] = useState([]);
  const [additional, setAdditional] = useState([]);
  const [kycStatusMessage, setKycStatusMessage] = useState("");
  const [adddoc, setAddDoc] = useState({
    fontimg: "",
    backimg: "",
    isLoder: "",
  });
  const [doc, setDoc] = useState({
    proof: "Proof of ID",
    id: "id",
    fontimg: "",
    backimg: "",
    idnumber: "",
    isLoder: false,
  });
  const onOtherImage = () => {
    if (doc.proof == "Addition Documents") {
      if (!additional) {
        toast.error("Upload a Image");
      } else {
        const param = new FormData();
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("additional_documents", additional);

        axios.post(Url + "/ajaxfiles/update_kyc.php", param).then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setSendKycRequest((prevalue) => {
              return {
                ...prevalue,
                proof3: true,
              };
            });
            fatchKycStatus();
          }
        });
      }
    } else if (doc.proof == "Proof of Address") {
      if (!addressProof) {
        toast.error("Upload a Image");
      } else {
        const param = new FormData();
        if (IsApprove !== "") {
          param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
          param.append("is_app", IsApprove.is_app);
          param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
          param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
        }
        param.append("proof_of_address", addressProof[0]);
        axios.post(Url + "/ajaxfiles/update_kyc.php", param).then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);

            setSendKycRequest((prevalue) => {
              return {
                ...prevalue,
                proof2: true,
              };
            });
            fatchKycStatus();
          }
        });
      }
    }
  };
  const onSubmit = () => {
    if (!doc.idnumber) {
      toast.error("Id Number is required");
    } else if (!doc.fontimg && !fontimg) {
      toast.error("FRONT SIDE of image is required");
    } else {
      doc.isLoder = true;
      setDoc({ ...doc });
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (doc.fontimg) {
        param.append("aadhar_card_front_image", doc.fontimg);
      }
      if (doc.backimg) {
        param.append("aadhar_card_back_image", doc.backimg);
      }
      param.append("aadhar_card_number", doc.idnumber);
      param.append("action", "update_kyc");
      param.append("user_id", prop.id);

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            doc.isLoder = false;
            setDoc({ ...doc });
          } else {
            toast.success(res.data.message);
            fatchKycStatus();
            doc.isLoder = false;
            setDoc({ ...doc });
          }
        });
    }
  };
  const onaddsubmit = () => {
    if (!adddoc.fontimg && !addfontimg) {
      toast.error("Front Side of image is required");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (adddoc.fontimg) {
        param.append("additional_documents", adddoc.fontimg);
      }
      if (adddoc.backimg) {
        param.append("additional_documents_back", adddoc.backimg);
      }
      param.append("action", "update_kyc");
      param.append("user_id", prop.id);
      adddoc.isLoder = true;
      setAddDoc({ ...adddoc });
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            adddoc.isLoder = false;
            setAddDoc({ ...adddoc });
          } else {
            adddoc.isLoder = false;
            setAddDoc({ ...adddoc });
            toast.success(res.data.message);
            fatchKycStatus();
          }
        });
    }
  };

  const fatchKycStatus = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("action", "get_kyc_status");
    param.append("user_id", prop.id);

    setMainLoader(true);
    await axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          setDocument(false);
          setSendKycRequest((prevalue) => {
            return {
              ...prevalue,
              proof1: false,
            };
          });
          setMainLoader(false);
        } else {
          doc.idnumber = res.data.kyc_data.aadhar_card_number;
          setDoc({ ...doc });
          setKycStatus(res.data.kyc_data);
          setBackimg(res.data.kyc_data.aadhar_card_back_image);
          setFontimg(res.data.kyc_data.aadhar_card_front_image);
          setAddBackimg(res.data.kyc_data.additional_documents_back);
          setAddFontimg(res.data.kyc_data.additional_documents);
          setKycStatusMessage(res.data.message);
          setDocument(true);
          setMainLoader(false);

          if (
            res.data.kyc_data.master_status == "2" ||
            res.data.kyc_data.master_status == "0"
          ) {
            setSendKycRequest((prevalue) => {
              return {
                ...prevalue,
                proof1: false,
              };
            });
          } else {
            setSendKycRequest((prevalue) => {
              return {
                ...prevalue,
                proof1: true,
              };
            });
          }
        }
      });
  };
  useEffect(() => {
    fatchKycStatus();
  }, []);

  useEffect(() => {
    if (sendKycRequest) {
      if ((fontimg == "" || fontimg == null) && doc.fontimg) {
        if (!doc.fontimg) {
          setFontimg(undefined);
          return;
        }

        const objectUrl = URL.createObjectURL(doc.fontimg);
        setFontimg(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [doc]);
  useEffect(() => {
    if ((addfontimg == "" || addfontimg == null) && adddoc.fontimg) {
      if (!adddoc.fontimg) {
        setAddFontimg(undefined);
        return;
      }

      const objectUrl = URL.createObjectURL(adddoc.fontimg);
      setAddFontimg(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [adddoc]);

  useEffect(() => {
    if (sendKycRequest) {
      if ((backimg == "" || backimg == null) && doc.backimg) {
        if (!doc.backimg) {
          setBackimg(undefined);
          return;
        }

        const objectUrl = URL.createObjectURL(doc.backimg);
        setBackimg(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [doc]);
  useEffect(() => {
    if (sendKycRequest) {
      if ((addbackimg == "" || addbackimg == null) && adddoc.backimg) {
        if (!adddoc.backimg) {
          setAddBackimg(undefined);
          return;
        }

        const objectUrl = URL.createObjectURL(adddoc.backimg);
        setAddBackimg(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [adddoc]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDoc((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  // const [click, setClick] = React.useState();
  toast.configure();
  const buttonstyle = {
    background: "linear-gradient(45deg, #eeeff8 30%, #eeeff8 90%)",
    borderRadius: "20px",
    boxShadow: "0",
  };

  // useEffect(() => {
  // }, [proofAdd]);

  return (
    <div>
      <div>
        <div>
          <div>
            <Grid container>
              <Grid item sm={12}></Grid>
              <Grid item xl={1}></Grid>
              <Grid item xl={10} md={12}>
                {mainLoader == true ? (
                  <div
                    className="centerflexjus"
                    style={{ alignItems: "center", height: "200px" }}
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
                  </div>
                ) : (
                  <Grid container spacing={3}>
                    <Grid
                      item
                      md={
                        !kycStatus.additional_documents &&
                        kycStatus.master_status == "1"
                          ? 12
                          : 8
                      }
                      className="d-flex"
                    >
                      <Paper
                        elevation={1}
                        style={{ borderRadius: "10px" }}
                        className="w-100 mb-5"
                      >
                        <div className="card-header font-weight-bold mb-0 text-dark h5">
                          Upload New Document
                        </div>
                        <div className="divider"></div>
                        <div className="card-body">
                          <label
                            htmlFor="upi_crypto_ac_number"
                            className="text-info font-weight-bold form-label-head w-100 required"
                          >
                            Id Number
                          </label>

                          <BootstrapInput
                            // type="number"
                            disabled={sendKycRequest.proof1}
                            value={doc.idnumber}
                            onChange={handleChange}
                            name="idnumber"
                            displayEmpty
                            inputProps={{
                              "aria-label": "Without label",
                            }}
                          />
                          {doc.proof == "Proof of ID" ? (
                            !sendKycRequest.proof1 == true &&
                            kycStatus.master_status == "0" ? (
                              <div className="text-dark w-100 h-100 kyc-status-section padingtop5">
                                <h5 className="text-center font-weight-bold text-dark ">
                                  <div>
                                    <InfoIcon
                                      style={{
                                        fontSize: "5rem",
                                        color: "rgb(204 207 23)",
                                        paddingBottom: "1rem",
                                      }}
                                    />
                                  </div>
                                  {kycStatusMessage}
                                </h5>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}

                          {doc.proof == "Proof of ID" ? (
                            sendKycRequest.proof1 == true &&
                            kycStatus.master_status == "1" ? (
                              <div className="text-dark w-100 h-100 kyc-status-section padingtop5">
                                <h5 className="text-center font-weight-bold text-dark">
                                  <div>
                                    <CheckCircleOutlineIcon
                                      style={{
                                        fontSize: "5rem",
                                        color: "rgb(18 219 52)",
                                        paddingBottom: "1rem",
                                      }}
                                    />
                                  </div>
                                  {kycStatusMessage}
                                </h5>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}

                          {doc.proof == "Proof of ID" ? (
                            !sendKycRequest.proof1 == true &&
                            kycStatus.master_status == "2" ? (
                              <div className="text-dark w-100 h-100 kyc-status-section padingtop5">
                                <h5 className="text-center font-weight-bold text-dark ">
                                  <div>
                                    <CancelIcon
                                      style={{
                                        fontSize: "5rem",
                                        color: "rgb(255 3 3)",
                                        paddingBottom: "1rem",
                                      }}
                                    />
                                  </div>
                                  {kycStatusMessage}{" "}
                                  {kycStatus.feedback_remarks}
                                </h5>
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}

                          {change1 && (
                            <Grid container className="text-center my-4">
                              <Grid item sm={12}>
                                {additional.map((proof, index) => {
                                  return (
                                    <Paper
                                      elevation={1}
                                      className="d-flex p-3 justify-content-between align-items-center mb-2"
                                      style={{ borderRadius: "10px" }}
                                      key={index}
                                    >
                                      <span className="text-dark font-size-sm font-weight-bold">
                                        {proof.name}
                                      </span>
                                      <CloseOutlinedIcon
                                        className="fontimgclose"
                                        onClick={() => {
                                          // proofAdd.splice(index, 1);
                                          setAdditional(
                                            additional.filter(
                                              (v, i) => i !== index
                                            )
                                          );
                                        }}
                                      />
                                    </Paper>
                                  );
                                })}
                              </Grid>
                            </Grid>
                          )}
                          {change && (
                            <Grid container className="text-center my-4">
                              <Grid item sm={12}>
                                {addressProof.map((proof, index) => {
                                  return (
                                    <Paper
                                      elevation={1}
                                      className="d-flex p-3 justify-content-between align-items-center mb-2"
                                      style={{ borderRadius: "10px" }}
                                      key={index}
                                    >
                                      <span className="text-dark font-size-sm font-weight-bold">
                                        {proof.name}
                                      </span>
                                      <CloseOutlinedIcon
                                        className="fontimgclose"
                                        onClick={() => {
                                          // proofAdd.splice(index, 1);
                                          setAddressProof(
                                            addressProof.filter(
                                              (v, i) => i !== index
                                            )
                                          );
                                        }}
                                      />
                                    </Paper>
                                  );
                                })}
                              </Grid>
                            </Grid>
                          )}
                          {option && (
                            <Grid
                              container
                              spacing={7}
                              className="mt-4 mb-2 justify-content-center"
                              style={{ marginLeft: "-28px", gap: "80px" }}
                            >
                              <Grid
                                item
                                sm={6}
                                lg={4}
                                className="d-flex flex-column align-items-center upload-zone p-4"
                              >
                                <h6 className="mb-3  font-size-xs font-weight-bold">
                                  FRONT SIDE*
                                </h6>
                                <div className="uploaderDropZone">
                                  <Input
                                    accept="image/*"
                                    id="FILE_FRONT_SIDE"
                                    type="file"
                                    name="fontimg"
                                    // value={doc.fontimg}
                                    onChange={(e) => {
                                      setDoc((prevalue) => {
                                        return {
                                          ...prevalue,
                                          fontimg: e.target.files[0],
                                        };
                                      });
                                    }}
                                    style={{ display: "none" }}
                                  />

                                  {!fontimg ? (
                                    <label
                                      htmlFor="FILE_FRONT_SIDE"
                                      className="text-dark font-weight-bold font-size-xs"
                                    >
                                      UPLOAD
                                    </label>
                                  ) : (
                                    <>
                                      {sendKycRequest.proof1 ? (
                                        ""
                                      ) : (
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            setDoc((prevalue) => {
                                              return {
                                                ...prevalue,
                                                fontimg: "",
                                              };
                                            });
                                            setFontimg("");
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      <img
                                        src={fontimg}
                                        className="deposit-upload-image-preview1"
                                      />
                                    </>
                                  )}
                                </div>
                              </Grid>
                              <Grid
                                item
                                sm={6}
                                lg={4}
                                className="d-flex flex-column align-items-center upload-zone p-4"
                              >
                                <h6 className="mb-3 font-size-xs font-weight-bold">
                                  BACK SIDE*
                                </h6>
                                <div className="uploaderDropZone">
                                  <Input
                                    accept="image/*"
                                    id="FILE_BACK_SIDE"
                                    type="file"
                                    name="backimg"
                                    // value={doc.backimg}
                                    onChange={(e) =>
                                      setDoc((prevalue) => {
                                        return {
                                          ...prevalue,
                                          backimg: e.target.files[0],
                                        };
                                      })
                                    }
                                    style={{ display: "none" }}
                                  />

                                  {!backimg ? (
                                    <label
                                      htmlFor="FILE_BACK_SIDE"
                                      className="text-dark font-weight-bold font-size-xs"
                                    >
                                      UPLOAD
                                    </label>
                                  ) : (
                                    <>
                                      {sendKycRequest.proof1 ? (
                                        ""
                                      ) : (
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            setDoc((prevalue) => {
                                              return {
                                                ...prevalue,
                                                backimg: "",
                                              };
                                            });
                                            setBackimg("");
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      <img
                                        src={backimg}
                                        className="deposit-upload-image-preview1"
                                      />

                                      {/* <div className="received-file">
                                    <div className="w-100 h-100">
                                      {doc.backimg.name}
                                    </div>
                                    <button
                                      className="bg-transparent p-0 border-0"
                                      onClick={() =>
                                        setDoc((prevalue) => {
                                          return {
                                            ...prevalue,
                                            backimg: "",
                                          };
                                        })
                                      }
                                    >
                                      <CloseOutlinedIcon className="fontimgclose" />
                                    </button>
                                  </div> */}
                                    </>
                                  )}
                                </div>
                              </Grid>
                              {/* <hr className="ml-2 mr-2 uploadmr" ></hr>
                            <Grid item xs={12} className="py-0 pr-4 pl-4 pb-1">
                              <form noValidate className="autocomplete-off">
                                <h6 className="font-weight-bold mb-4 pb-1 d-flex">
                                  Fill in your Details for a seamless experience{" "}
                                  <small className="d-baseline">
                                    {" "}
                                    (Optional)
                                  </small>
                                </h6>
                                <Grid container spacing={1} className="ml-n1">
                                  <Grid item sm={6} className="p-1">
                                    <FormControl className="w-100">
                                      <label className="font-weight-bold font-size-sm d-flex justify-content-start">
                                        Document No
                                      </label>
                                      <BootstrapInput
                                        value={doc.documentNo}
                                        name="documentNo"
                                        onChange={handleChange}
                                        inputProps={{
                                          "aria-label": "Without label",
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item sm={6} className="p-1">
                                    <FormControl className="w-100 mb-2">
                                      <label className="font-weight-bold font-size-sm d-flex justify-content-start">
                                        Country Of Issue
                                      </label>
                                      <Select
                                        value={doc.id}
                                        name="id"
                                        label="ID"
                                        onChange={handleChange}
                                        displayEmpty
                                        inputProps={{
                                          "aria-label": "Without label",
                                        }}
                                        input={<BootstrapInput />}
                                        className="mt-0 ml-0"
                                      >
                                        <MenuItem value=""></MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item sm={6} className="p-1">
                                    <FormControl className="w-100 mb-2">
                                      <label className="font-weight-bold font-size-sm d-flex justify-content-start">
                                        Date Of Issue
                                      </label>

                                      <BootstrapInput
                                        id="date"
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: "100%" }}
                                        inputlabelprops={{
                                          shrink: true,
                                        }}
                                        inputProps={{ max: "2022-04-13" }}
                                        onChange={(e) =>
                                          setFilterData({
                                            ...filterData,
                                            deposit_from: e.target.value,
                                          })
                                        }
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item sm={6} className="p-1">
                                    <FormControl className="w-100 mb-2">
                                      <label className="font-weight-bold font-size-sm d-flex justify-content-start">
                                        Date Of Expiry
                                      </label>

                                      <BootstrapInput
                                        id="date"
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: "100%" }}
                                        inputlabelprops={{
                                          shrink: true,
                                        }}
                                        onChange={(e) =>
                                          setFilterData({
                                            ...filterData,
                                            deposit_from: e.target.value,
                                          })
                                        }
                                      />
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </form>
                            </Grid> */}
                            </Grid>
                          )}

                          <div
                            className="text-dark font-size-xs d-flex justify-content-between align-items-center"
                            style={{ marginTop: "100px" }}
                          >
                            <i>
                              (Maximum size of document 5MB) Allow File Formats
                              *jpg, *png)
                            </i>
                            {doc.proof == "Proof of ID" ? (
                              doc.isLoder ? (
                                <ColorButton
                                  tabindex="0"
                                  size="large"
                                  className=" btn-gradient  btn-success "
                                  sx={{
                                    padding: "20px 57px",
                                    marginTop: "10px",
                                  }}
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
                                <ColorButton
                                  onClick={onSubmit}
                                  variant="contained"
                                  disabled={sendKycRequest.proof1}
                                  size="medium"
                                  className="p-3 pr-4 pl-4 text-center text-capitalize"
                                >
                                  Save
                                </ColorButton>
                              )
                            ) : doc.proof == "Proof of Address" ? (
                              <ColorButton
                                onClick={onOtherImage}
                                variant="contained"
                                disabled={sendKycRequest.proof2}
                                size="medium"
                                className="p-3 pr-4 pl-4 text-center text-capitalize"
                              >
                                Save
                              </ColorButton>
                            ) : (
                              <ColorButton
                                onClick={onOtherImage}
                                variant="contained"
                                disabled={sendKycRequest.proof3}
                                size="medium"
                                className="p-3 pr-4 pl-4 text-center text-capitalize"
                              >
                                Save
                              </ColorButton>
                            )}
                            {/* <ColorButton
                            onClick={onSubmit}
                            variant="contained"
                            disabled={!sendKycRequest}
                            size="medium"
                            className="p-3 pr-4 pl-4 text-center text-capitalize"
                          >
                            Save
                          </ColorButton> */}
                          </div>
                        </div>
                      </Paper>
                    </Grid>
                    {!kycStatus.additional_documents &&
                    kycStatus.master_status == "1" ? (
                      ""
                    ) : (
                      <Grid item md={4}>
                        <Paper elevation={1} style={{ borderRadius: "10px" }}>
                          <div className="card-header card-header-alt p-3">
                            <h5 className="font-weight-bold mb-0 text-dark">
                              Additional Documents
                            </h5>
                          </div>
                          <div className="divider"></div>
                          <Grid container spacing={3}>
                            <Grid item md={12}>
                              <h6
                                className="mb-3 mt-3 font-size-xs font-weight-bold"
                                style={{ textAlign: "center" }}
                              >
                                FRONT SIDE*
                              </h6>
                              <div className="centerflexjus">
                                <div className="uploaderDropZone">
                                  <Input
                                    accept="image/*"
                                    id="FILE_FRONT_SIDE1"
                                    type="file"
                                    name="fontimg"
                                    // value={doc.fontimg}
                                    onChange={(e) =>
                                      setAddDoc((prevalue) => {
                                        return {
                                          ...prevalue,
                                          fontimg: e.target.files[0],
                                        };
                                      })
                                    }
                                    style={{ display: "none" }}
                                  />

                                  {!addfontimg ? (
                                    <label
                                      htmlFor="FILE_FRONT_SIDE1"
                                      className="text-dark font-weight-bold font-size-xs"
                                    >
                                      UPLOAD
                                    </label>
                                  ) : (
                                    <>
                                      {sendKycRequest.proof1 ? (
                                        ""
                                      ) : (
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            setAddDoc((prevalue) => {
                                              return {
                                                ...prevalue,
                                                fontimg: "",
                                              };
                                            });
                                            setAddFontimg("");
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      <img
                                        src={addfontimg}
                                        className="deposit-upload-image-preview1"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            </Grid>
                            <Grid item md={12}>
                              <h6
                                className="mb-3 font-size-xs font-weight-bold"
                                style={{ textAlign: "center" }}
                              >
                                BACK SIDE*
                              </h6>
                              <div className="centerflexjus">
                                <div className="uploaderDropZone">
                                  <Input
                                    accept="image/*"
                                    id="FILE_BACk_SIDE1"
                                    type="file"
                                    name="backimg"
                                    // value={doc.fontimg}
                                    onChange={(e) =>
                                      setAddDoc((prevalue) => {
                                        return {
                                          ...prevalue,
                                          backimg: e.target.files[0],
                                        };
                                      })
                                    }
                                    style={{ display: "none" }}
                                  />

                                  {!addbackimg ? (
                                    <label
                                      htmlFor="FILE_BACk_SIDE1"
                                      className="text-dark font-weight-bold font-size-xs"
                                    >
                                      UPLOAD
                                    </label>
                                  ) : (
                                    <>
                                      {sendKycRequest.proof1 ? (
                                        ""
                                      ) : (
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            setAddBackimg("");
                                            setAddDoc((prevalue) => {
                                              return {
                                                ...prevalue,
                                                backimg: "",
                                              };
                                            });
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      <img
                                        src={addbackimg}
                                        className="deposit-upload-image-preview1"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            </Grid>

                            <Grid item md={12} style={{ marginBottom: "10px" }}>
                              <div className="centerflexjus">
                                {adddoc.isLoder ? (
                                  <ColorButton
                                    tabindex="0"
                                    size="large"
                                    className=" btn-gradient  btn-success "
                                    sx={{
                                      padding: "20px 57px",
                                      marginTop: "10px",
                                    }}
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
                                  <ColorButton
                                    style={{ marginTop: "10px" }}
                                    onClick={onaddsubmit}
                                    disabled={sendKycRequest.proof1}
                                  >
                                    Save
                                  </ColorButton>
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycDocument;
