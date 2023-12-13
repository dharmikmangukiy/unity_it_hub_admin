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
import CustomImageModal from "../common/CustomImageModal";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { BootstrapInput, ColorButton } from "../common/CustomElement";
import { IsApprove, Url } from "../global";
import ErrorIcon from "@mui/icons-material/Error";
import "./kycDocument.css";

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
  const [twoSide, setTwoSide] = useState({
    addition: false,
    main: false,
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
    if (!doc.fontimg && !fontimg) {
      toast.error("Please upload documents front side image");
    } else if (twoSide.main && !doc.backimg && !backimg) {
      toast.error("Please upload documents back side image");
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
      if (doc.backimg && twoSide.main) {
        param.append("aadhar_card_back_image", doc.backimg);
      }
      param.append("action", "update_kyc");
      param.append("user_id", prop.id);

      param.append("aadhar_card_number", doc.idnumber);
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
      toast.error("Please upload additional documents front side image");
    } else if (!adddoc.backimg && twoSide.addition && !addbackimg) {
      toast.error("Please upload additional documents back side image");
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
      if (adddoc.backimg && twoSide.addition) {
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
          if (res.data.kyc_data.aadhar_card_back_image != "") {
            twoSide.main = true;
            setTwoSide({ ...twoSide });
          }

          if (res.data.kyc_data.additional_documents_back != "") {
            twoSide.addition = true;
            setTwoSide({ ...twoSide });
          }
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

  const onRemoveImage = (type) => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("remove_kyc_image", type);
    param.append("action", "remove_kyc_image");
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
        } else {
          if (type == "aadhar_card_front_image") {
            setDoc((prevalue) => {
              return {
                ...prevalue,
                fontimg: "",
              };
            });
            setFontimg("");
          } else if (type == "aadhar_card_back_image") {
            setDoc((prevalue) => {
              return {
                ...prevalue,
                backimg: "",
              };
            });
            setBackimg("");
          } else if (type == "additional_documents") {
            setAddDoc((prevalue) => {
              return {
                ...prevalue,
                fontimg: "",
              };
            });
            setAddFontimg("");
          } else if (type == "additional_documents_back") {
            setAddDoc((prevalue) => {
              return {
                ...prevalue,
                backimg: "",
              };
            });
            setAddBackimg("");
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
  const documentShow = () => {
    var html = [];
    if (kycStatus.aadhar_card_front_image) {
      html.push(
        <div>
          {/* <img src={kycStatus.aadhar_card_front_image} alt="" /> */}
          <div className="uploaded-proof-view-section">
            <div className="uploaded-proof-element">
              <label className="filable">Front Image</label>
              <CustomImageModal
                image={kycStatus.aadhar_card_front_image}
                className="docimage"
              />
            </div>
            {/* {kycStatus.aadhar_card_back_image ? <img src={kycStatus.aadhar_card_back_image} alt="" />:""} */}
            {kycStatus.aadhar_card_back_image ? (
              <div className="uploaded-proof-element">
                <label className="filable">Back Image</label>
                <CustomImageModal
                  image={kycStatus.aadhar_card_back_image}
                  className="docimage"
                />{" "}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    }

    if (kycStatus.proof_of_address) {
      html.push(
        <div>
          <h2 className="margin-right-15px">Proof of Address</h2>
          <CustomImageModal image={kycStatus.proof_of_address} />
        </div>
      );
    }

    return html;
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
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
            <div style={{ opacity: 1 }}>
              <Grid container>
                <Grid item sm={12}></Grid>
                <Grid item xl={1}></Grid>
                <Grid item xl={10} md={12} lg={12}>
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
                          Upload New Document :{" "}
                          <span
                            className={`approvedocument ${
                              kycStatus.master_status == 1
                                ? "approve"
                                : kycStatus.master_status == 2
                                ? "rejected"
                                : "padding"
                            }`}
                          >
                            {kycStatus.master_status == 1
                              ? "Approved"
                              : kycStatus.master_status == 2
                              ? "Approval Rejected"
                              : "Approval Pending"}
                          </span>
                        </div>
                        <div className="divider"></div>
                        <div className="card-body">
                          <div className="doument-input-section">
                            <div>
                              <label
                                htmlFor="upi_crypto_ac_number"
                                className="text-info font-weight-bold form-label-head w-100 "
                              >
                                ID NUMBER
                              </label>
                              <BootstrapInput
                                disabled={
                                  sendKycRequest.proof1 || prop.permission == 0
                                    ? true
                                    : false
                                }
                                value={doc.idnumber}
                                onChange={handleChange}
                                name="idnumber"
                                displayEmpty
                                inputProps={{
                                  "aria-label": "Without label",
                                }}
                              />
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                name="tos"
                                value={!twoSide.main}
                                checked={twoSide.main}
                                disabled={
                                  kycStatus.master_status == 1 ? true : false
                                }
                                onChange={(e) => {
                                  twoSide.main = e.target.checked;
                                  setTwoSide({ ...twoSide });
                                }}
                                id="gridCheck"
                                className="form-check-input marcheckbox"
                              />
                              <label
                                htmlFor="gridCheck"
                                className="form-check-label"
                              >
                                <span> Double side</span>
                              </label>
                            </div>
                            {/* </div> */}
                          </div>

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
                              style={{ marginLeft: "-28px" }}
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
                                    disabled={
                                      prop.permission == 0 ? true : false
                                    }
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
                                      {sendKycRequest.proof1 ||
                                      prop.permission == 0 ? (
                                        ""
                                      ) : (
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            onRemoveImage(
                                              "aadhar_card_front_image"
                                            );
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
                              {twoSide.main ? (
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
                                      disabled={
                                        prop.permission == 0 ? true : false
                                      }
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
                                        {sendKycRequest.proof1 ||
                                        prop.permission == 0 ? (
                                          ""
                                        ) : (
                                          <button
                                            className="bg-transparent p-0 border-0"
                                            onClick={() => {
                                              onRemoveImage(
                                                "aadhar_card_back_image"
                                              );
                                            }}
                                          >
                                            <CloseOutlinedIcon className="fontimgclose" />
                                          </button>
                                        )}
                                        <img
                                          src={backimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      </>
                                    )}
                                  </div>
                                </Grid>
                              ) : (
                                ""
                              )}
                            </Grid>
                          )}

                          <div className="text-dark font-size-xs d-flex justify-content-between align-items-center">
                            <i>
                              (Maximum size of document 5MB, Allow File Formats
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
                              ) : prop.permission == 1 ? (
                                <ColorButton
                                  onClick={onSubmit}
                                  variant="contained"
                                  disabled={sendKycRequest.proof1}
                                  size="medium"
                                  className="text-center text-capitalize"
                                >
                                  Save
                                </ColorButton>
                              ) : (
                                ""
                              )
                            ) : doc.proof == "Proof of Address" ? (
                              <ColorButton
                                onClick={onOtherImage}
                                variant="contained"
                                disabled={sendKycRequest.proof2}
                                size="medium"
                                className="text-center text-capitalize"
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
                            <h5 className="font-weight-bold text-dark">
                              Additional Documents
                            </h5>
                          </div>
                          <div className="divider"></div>
                          <Grid container spacing={3}>
                            <Grid item md={12}>
                              <div style={{ padding: "15px" }}>
                                <input
                                  type="checkbox"
                                  name="tos"
                                  value={!twoSide.addition}
                                  checked={twoSide.addition}
                                  disabled={
                                    kycStatus.master_status == 1 ? true : false
                                  }
                                  onChange={(e) => {
                                    twoSide.addition = e.target.checked;
                                    setTwoSide({ ...twoSide });
                                  }}
                                  id="gridAdditionCheck"
                                  className="form-check-input marcheckbox"
                                />
                                <label
                                  htmlFor="gridAdditionCheck"
                                  className="form-check-label"
                                >
                                  <span> Double side</span>
                                </label>
                              </div>
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
                                    disabled={
                                      prop.permission == 0 ? true : false
                                    }
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
                                      {sendKycRequest.proof1 ||
                                      prop.permission == 0 ? (
                                        ""
                                      ) : (
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            onRemoveImage(
                                              "additional_documents"
                                            );
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
                            {twoSide.addition ? (
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
                                      disabled={
                                        prop.permission == 0 ? true : false
                                      }
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
                                        {sendKycRequest.proof1 ||
                                        prop.permission == 0 ? (
                                          ""
                                        ) : (
                                          <button
                                            className="bg-transparent p-0 border-0"
                                            onClick={() => {
                                              onRemoveImage(
                                                "additional_documents_back"
                                              );
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
                            ) : (
                              ""
                            )}

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
                                ) : prop.permission == 1 ? (
                                  <ColorButton
                                    style={{ marginTop: "10px" }}
                                    onClick={onaddsubmit}
                                    disabled={sendKycRequest.proof1}
                                  >
                                    Save
                                  </ColorButton>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                  {/* <Grid item md={12}>
                    <Grid item md={12} sx={{ marginTop: "10px" }}>
                      <Paper
                        elevation={1}
                        style={{ borderRadius: "10px" }}
                        className="w-100 mb-1"
                      >
                        <div className="card-header card-header-alt p-3 text-center">
                          <h4 className="font-weight-bold mb-0 text-dark text-center">
                            Uploaded Document
                          </h4>
                        </div>
                        <div className="card-body position-relative py-3 px-3 px-md-5">
                          <Grid
                            container
                            spacing={3}
                            className="justify-xs-center"
                          >
                            <Grid
                              item
                              md={12}
                              className="font-italic text-dark"
                            >
                              <p className="text-align-justify">
                                Please provide a clear color copy of both sides
                                of a non-expired and valid ID document
                                indicating your Full Name and Date of Birth as
                                provided in your application.
                              </p>
                              <p className="text-align-justify">
                                Please see below a list of all acceptable
                                documents
                              </p>
                              <hr></hr>
                              <p className="text-align-justify">- Passport</p>
                              <p className="text-align-justify">
                                - Identity Card
                              </p>
                              <p className="text-align-justify">
                                - Proof of Address
                              </p>
                              <hr></hr>
                              <p className="text-align-justify">
                                Please provide a clear copy of Proof of Address
                                stating your full name, address and issuing
                                authority, issued within the last three(3)
                                months
                              </p>
                              <p className="text-align-justify">
                                The address should match the one used during
                                your application.
                              </p>
                              <hr></hr>
                              <p className="text-align-justify">
                                You are kindly advised to provide colored
                                full-page documents. All information such as
                                issuing date, issuer, billing name, and address
                                should be clearly visible. You may hide any
                                confidential information should as your personal
                                account number or any transaction history.
                              </p>
                              <p className="text-align-justify">
                                List of acceptable documents
                              </p>
                              <p className="text-align-justify">
                                - Utility bill such as electricity, gas, water
                              </p>
                              <p className="text-align-justify">
                                - Bank/Credit Card Statement
                              </p>
                              <p className="text-align-justify">
                                - Local Authority Tax Bill
                              </p>
                              <br></br>
                            </Grid>
                          </Grid>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid> */}
                  <Grid item md={12} style={{ marginTop: "10px" }}>
                    <Grid item md={12}>
                      <Paper
                        elevation={1}
                        style={{ borderRadius: "10px" }}
                        className="w-100 mb-1"
                      >
                        <div
                          className="card-header card-header-alt p-3 text-center"
                          style={{ justifyContent: "center" }}
                        >
                          <h4 className="font-weight-bold mb-0 text-dark text-center">
                            Uploaded Document
                          </h4>
                        </div>
                        <div className="card-body position-relative py-3 px-3 px-md-5">
                          <Grid
                            container
                            spacing={3}
                            className="justify-xs-center"
                          >
                            <Grid
                              item
                              md={12}
                              // className="font-italic text-dark"
                            >
                              <div className="docMain">
                                <div className="centerflexjus">
                                  <div className="docH1Text">
                                    {" "}
                                    <h5 className="d-flex">
                                      <div>
                                        <ErrorIcon
                                          sx={{
                                            color: "green",
                                            fontSize: "25px",
                                            marginRight: "5px",
                                          }}
                                        />
                                      </div>
                                      <div>
                                        Make sure the document shows your
                                        photo,full name,date of birth and date
                                        of issue
                                      </div>
                                    </h5>
                                  </div>
                                </div>
                                <div className="picdocMain">
                                  <div className="firstimageofdoc">
                                    <img
                                      src="./assets/img/image1.png"
                                      alt=""
                                      className="firstimageofdoc1"
                                    />
                                    <div>
                                      <h2
                                        style={{
                                          color: "green",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Do
                                      </h2>
                                      <ul style={{ listStyle: "disc inside" }}>
                                        <li>Photo is clear</li>
                                        <li>Good photo quality</li>
                                        <li>All 4 corners are visible</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="firstimageofdoc">
                                    <img
                                      src="./assets/img/image2.png"
                                      alt=""
                                      className="firstimageofdoc2"
                                    />
                                    <div>
                                      <h2
                                        style={{
                                          color: "red",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Don't
                                      </h2>
                                      <ul style={{ listStyle: "disc inside" }}>
                                        <li>Photo is blurred</li>
                                        <li>Light reflection</li>
                                        <li>Poor photo quality</li>
                                        <li>Not all corners are visible</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycDocument;
