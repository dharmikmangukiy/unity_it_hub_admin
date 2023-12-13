import React, { useState, useEffect } from "react";
import { Grid, Input } from "@mui/material";
import { Paper } from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CustomImageModal from "../common/CustomImageModal";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { BootstrapInput, ColorButton } from "../common/CustomElement";
import { IsApprove, Url } from "../global";
import ErrorIcon from "@mui/icons-material/Error";
import "./kycDocument.css";
import Toast from "../common/Toast";

const KycDocument = (prop) => {
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState(null);
  const [option, setOption] = useState(true);

  const [fontimg, setFontimg] = useState("");
  const [backimg, setBackimg] = useState("");
  const [mainLoader, setMainLoader] = useState(true);
  const [addfontimg, setAddFontimg] = useState("");
  const [addbackimg, setAddBackimg] = useState("");
  const [formImage, setFormImage] = useState({
    fontimg: "",
    backimg: "",
    perviewfontimg: "",
    perviewbackimg: "",
    ftype: "",
    btype: "",
  });
  const [sendKycRequest, setSendKycRequest] = useState({
    proof1: false,
    proof2: false,
    proof3: false,
  });
  const [twoSide, setTwoSide] = useState({
    addition: false,
    main: false,
    add: false,
  });
  const [infotrue, setinfoTrue] = useState({
    fontimg: false,
    backimg: false,
    fontimg2: false,
    backimg2: false,
    fontimg3: false,
    backimg3: false,
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
    setinfoTrue({
      fontimg: true,
      backimg: true,
      fontimg2: true,
      backimg2: true,
      fontimg3: infotrue.fontimg3,
      backimg3: infotrue.backimg3,
    });
    // if (!doc.fontimg && !fontimg) {
    //   Toast("error", "Please upload documents ID Proof front side image");
    // } else if (twoSide.main && !doc.backimg && !backimg) {
    //   Toast("error", "Please upload documents ID Proof back side image");
    // }
    // else if (!formImage.fontimg && !formImage.perviewfontimg) {
    //   Toast("error", "Please upload documents Address Proof front side image");
    // } else if (twoSide.add && !formImage.backimg && !formImage.perviewbackimg) {
    //   Toast("error", "Please upload documents Address Proof back side image");
    // }
    // else {
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
      param.append("id_proof_front_image", doc.fontimg);
    }
    if (doc.backimg && twoSide.main) {
      param.append("id_proof_back_image", doc.backimg);
    }
    if (formImage.fontimg) {
      param.append("passport_front_image", formImage.fontimg);
    }
    if (formImage.backimg && twoSide.add) {
      param.append("passport_back_image", formImage.backimg);
    }
    // param.append("aadhar_card_number", doc.idnumber);
    param.append("id_proof_double_sided", twoSide.main ? 1 : 0);
    param.append("passport_double_sided", twoSide.add ? 1 : 0);
    param.append("action", "update_kyc");
    param.append("user_id", prop.id);
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          navigate("/");
        }
        if (res.data.status == "error") {
          Toast("error", res.data.message);
          doc.isLoder = false;
          setDoc({ ...doc });
        } else {
          Toast("success", res.data.message);
          prop?.socket?.emit("playSound5");

          fatchKycStatus();
          doc.isLoder = false;
          setDoc({ ...doc });
        }
      });
    //}
  };
  const onaddsubmit = () => {
    infotrue.fontimg3 = true;
    infotrue.backimg3 = true;
    setinfoTrue({
      ...infotrue,
    });
    if (!adddoc.fontimg && !addfontimg) {
      Toast("error", "Please upload additional documents front side image");
    } else if (!adddoc.backimg && twoSide.addition && !addbackimg) {
      Toast("error", "Please upload additional documents back side image");
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
      param.append("additional_double_sided", twoSide.addition ? 1 : 0);
      param.append("action", "update_kyc");
      param.append("user_id", prop.id);
      adddoc.isLoder = true;
      setAddDoc({ ...adddoc });
      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
          }
          if (res.data.status == "error") {
            Toast("error", res.data.message);
            adddoc.isLoder = false;
            setAddDoc({ ...adddoc });
          } else {
            adddoc.isLoder = false;
            setAddDoc({ ...adddoc });
            Toast("success", res.data.message);
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
          doc.ftype =
            res.data.kyc_data.id_proof_front_image.split(".").pop() == "pdf"
              ? "application/pdf"
              : "image";
          doc.btype =
            res.data.kyc_data.id_proof_back_image.split(".").pop() == "pdf"
              ? "application/pdf"
              : "image";

          // doc.idnumber = res.data.kyc_data.aadhar_card_number;
          setDoc({ ...doc });
          adddoc.ftype =
            res.data.kyc_data.additional_documents.split(".").pop() == "pdf"
              ? "application/pdf"
              : "image";
          adddoc.btype =
            res.data.kyc_data.additional_documents_back.split(".").pop() ==
            "pdf"
              ? "application/pdf"
              : "image";
          setAddDoc({ ...adddoc });
          formImage.ftype =
            res.data.kyc_data.passport_front_image.split(".").pop() == "pdf"
              ? "application/pdf"
              : "image";
          formImage.btype =
            res.data.kyc_data.passport_back_image.split(".").pop() == "pdf"
              ? "application/pdf"
              : "image";
          formImage.perviewfontimg = res.data.kyc_data.passport_front_image;
          formImage.perviewbackimg = res.data.kyc_data.passport_back_image;
          setFormImage({ ...formImage });
          setKycStatus(res.data.kyc_data);
          setBackimg(res.data.kyc_data.id_proof_back_image);
          setFontimg(res.data.kyc_data.id_proof_front_image);
          setAddBackimg(res.data.kyc_data.additional_documents_back);
          setAddFontimg(res.data.kyc_data.additional_documents);
          setKycStatusMessage(res.data.message);
          if (res.data.kyc_data.id_proof_back_image != "") {
            twoSide.main = true;
            setTwoSide({ ...twoSide });
          }
          if (res.data.kyc_data.passport_back_image != "") {
            twoSide.add = true;
            setTwoSide({ ...twoSide });
          }

          if (res.data.kyc_data.additional_documents_back != "") {
            twoSide.addition = true;
            setTwoSide({ ...twoSide });
          }
          setDocument(true);
          setMainLoader(false);
          if (res.data.kyc_data.master_status == "1") {
          } else {
            setinfoTrue({
              fontimg: false,
              backimg: false,
              fontimg2: false,
              backimg2: false,
              fontimg3: false,
              backimg3: false,
            });
          }
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
    param.append("action", "remove_kyc_image");
    param.append("user_id", prop.id);
    param.append("remove_kyc_image", type);
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          navigate("/");
        }
        if (res.data.status == "error") {
          Toast("error", res.data.message);
        } else {
          if (type == "id_proof_front_image") {
            setDoc((prevalue) => {
              return {
                ...prevalue,
                fontimg: "",
              };
            });
            setFontimg("");
          } else if (type == "id_proof_back_image") {
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
          } else if (type == "passport_front_image") {
            formImage.perviewfontimg = "";
            formImage.fontimg = "";
            setFormImage({ ...formImage });
          } else if (type == "passport_back_image") {
            formImage.perviewbackimg = "";
            formImage.backimg = "";
            setFormImage({ ...formImage });
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
                <Grid item sm={11}></Grid>
                <Grid item xl={1}></Grid>
                <Grid item xl={10} md={12} lg={12}>
                  {/* <TopButton /> */}
                  <Grid container spacing={3}>
                    {/* <Grid item md={12}>
                    <Paper
                      elevation={1}
                      style={{ borderRadius: "10px" }}
                      className="w-100 mb-5"
                    >
                      <div className="card-header d-flex align-items-center justify-content-between card-header-alt p-3">
                        <h5 className="font-weight-bold mb-0 text-dark">
                          My Documents{" "}
                          <span
                            className={`approvedocument ${
                              kycStatus.master_status == 1
                                ? "approve"
                                : kycStatus.master_status == 2
                                ? "rejected"
                                : kycStatus.master_status == 0
                                ? "padding"
                                : ""
                            }`}
                          >
                            {" "}
                            {kycStatus.master_status == 1
                              ? "Approved"
                              : kycStatus.master_status == 2
                              ? "Approval Rejected"
                              : kycStatus.master_status == 0
                              ? "Approval Pending"
                              : ""}
                          </span>
                        </h5>
                      </div>
                      <div className="divider"></div>
                      <div className="card-body position-relative bg-transparent p-0">
                        <Grid container spacing={3}>
                          <Grid
                            item
                            md={12}
                            className="d-flex flex-column position-relative mh-150"
                          >
                            {!document ? (
                              <div className="d-flex align-items-center text-dark w-100 h-100">
                                <i className="m-auto">No document uploaded</i>
                              </div>
                            ) : (
                              documentShow()
                            )}
                          </Grid>
                        </Grid>
                      </div>
                    </Paper>
                  </Grid> */}
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
                          My Documents{" "}
                          <span
                            className={`approvedocument ${
                              kycStatus.master_status == 1
                                ? "approve"
                                : kycStatus.master_status == 2
                                ? "rejected"
                                : kycStatus.master_status == 0
                                ? "padding"
                                : ""
                            }`}
                          >
                            {kycStatus.master_status == 1
                              ? " Approved"
                              : kycStatus.master_status == 2
                              ? "Approval Rejected"
                              : kycStatus.master_status == 0
                              ? "Approval Pending"
                              : ""}
                          </span>
                        </div>
                        <div className="divider"></div>
                        <div className="card-body">
                          <div className="id-proof-wrap">
                            <div>
                              <label
                                htmlFor="upi_crypto_ac_number"
                                className="text-info font-weight-bold form-label-head w-100 fontsize17"
                                style={{ fontSize: "18px !important" }}
                              >
                                ID Proof{" "}
                              </label>
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
                                className="form-check-input"
                              />{" "}
                              <label
                                htmlFor="gridCheck"
                                className="form-check-label"
                              >
                                <span> Double side</span>
                              </label>
                            </div>
                          </div>

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
                                    value=""
                                    onChange={(e) => {
                                      if (
                                        e.target.files[0].type ==
                                          "image/jpeg" ||
                                        e.target.files[0].type ==
                                          "application/pdf" ||
                                        e.target.files[0].type == "image/png" ||
                                        e.target.files[0].type == "image/jpg"
                                      ) {
                                        setDoc((prevalue) => {
                                          return {
                                            ...prevalue,
                                            fontimg: e.target.files[0],
                                            ftype: e.target.files[0].type,
                                          };
                                        });
                                      } else {
                                        toast.error(
                                          "Only JPG, JPEG, PNG and PDF types are accepted"
                                        );
                                      }
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
                                            onRemoveImage(
                                              "id_proof_front_image"
                                            );
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      {doc?.ftype == "application/pdf" ? (
                                        <embed
                                          src={fontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      ) : (
                                        <img
                                          src={fontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                                {infotrue.fontimg == true && !fontimg ? (
                                  <span className="doc-Requied">Requied!</span>
                                ) : (
                                  ""
                                )}
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
                                      value=""
                                      // value={doc.backimg}
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].type ==
                                            "image/jpeg" ||
                                          e.target.files[0].type ==
                                            "application/pdf" ||
                                          e.target.files[0].type ==
                                            "image/png" ||
                                          e.target.files[0].type == "image/jpg"
                                        ) {
                                          setDoc((prevalue) => {
                                            return {
                                              ...prevalue,
                                              backimg: e.target.files[0],
                                              btype: e.target.files[0].type,
                                            };
                                          });
                                        } else {
                                          toast.error(
                                            "Only JPG, JPEG, PNG and PDF types are accepted"
                                          );
                                        }
                                      }}
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
                                              onRemoveImage(
                                                "id_proof_back_image"
                                              );
                                            }}
                                          >
                                            <CloseOutlinedIcon className="fontimgclose" />
                                          </button>
                                        )}
                                        {doc?.btype == "application/pdf" ? (
                                          <embed
                                            src={backimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        ) : (
                                          <img
                                            src={backimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        )}
                                      </>
                                    )}
                                    {infotrue.backimg == true && !backimg ? (
                                      <span className="doc-Requied">
                                        Requied!
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Grid>
                              ) : (
                                ""
                              )}
                            </Grid>
                          )}
                          <div
                            className="id-proof-wrap"
                            style={{ marginTop: "25px" }}
                          >
                            <div>
                              <label
                                htmlFor="upi_crypto_ac_number"
                                className="text-info font-weight-bold form-label-head w-100 fontsize17"
                                style={{ fontSize: "18px !important" }}
                              >
                                Address Proof{" "}
                              </label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                name="tos"
                                value={!twoSide.add}
                                checked={twoSide.add}
                                disabled={
                                  kycStatus.master_status == 1 ? true : false
                                }
                                onChange={(e) => {
                                  twoSide.add = e.target.checked;
                                  setTwoSide({ ...twoSide });
                                }}
                                id="gridCheck4"
                                className="form-check-input"
                              />{" "}
                              <label
                                htmlFor="gridCheck4"
                                className="form-check-label"
                              >
                                <span>Double side</span>
                              </label>
                            </div>
                          </div>

                          {option && (
                            <Grid
                              container
                              spacing={7}
                              className="justify-content-center"
                              style={{ marginLeft: "-28px", marginTop: "-7px" }}
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
                                    id="FILE_FRONT_SIDE4"
                                    type="file"
                                    name="fontimg"
                                    value=""
                                    // value={doc.fontimg}
                                    onChange={(e) => {
                                      if (
                                        e.target.files[0].type ==
                                          "image/jpeg" ||
                                        e.target.files[0].type ==
                                          "application/pdf" ||
                                        e.target.files[0].type == "image/png" ||
                                        e.target.files[0].type == "image/jpg"
                                      ) {
                                        var objectUrl1 = URL.createObjectURL(
                                          e.target.files[0]
                                        );

                                        setFormImage((prevalue) => {
                                          return {
                                            ...prevalue,
                                            fontimg: e.target.files[0],
                                            ftype: e.target.files[0].type,
                                            perviewfontimg: objectUrl1,
                                          };
                                        });
                                      } else {
                                        toast.error(
                                          "Only JPG, JPEG, PNG and PDF types are accepted"
                                        );
                                      }
                                    }}
                                    style={{ display: "none" }}
                                  />

                                  {!formImage.perviewfontimg ? (
                                    <label
                                      htmlFor="FILE_FRONT_SIDE4"
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
                                            onRemoveImage(
                                              "passport_front_image"
                                            );
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      {formImage?.ftype == "application/pdf" ? (
                                        <embed
                                          src={formImage.perviewfontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      ) : (
                                        <img
                                          src={formImage.perviewfontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      )}
                                    </>
                                  )}
                                  {infotrue.fontimg2 == true &&
                                  !formImage.perviewfontimg ? (
                                    <span className="doc-Requied">
                                      Requied!
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Grid>
                              {twoSide.add ? (
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
                                      id="FILE_BACK_SIDE4"
                                      type="file"
                                      name="backimg"
                                      value=""
                                      // value={doc.backimg}
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].type ==
                                            "image/jpeg" ||
                                          e.target.files[0].type ==
                                            "application/pdf" ||
                                          e.target.files[0].type ==
                                            "image/png" ||
                                          e.target.files[0].type == "image/jpg"
                                        ) {
                                          var objectUrl1 = URL.createObjectURL(
                                            e.target.files[0]
                                          );
                                          setFormImage((prevalue) => {
                                            return {
                                              ...prevalue,
                                              backimg: e.target.files[0],
                                              btype: e.target.files[0].type,
                                              perviewbackimg: objectUrl1,
                                            };
                                          });
                                        } else {
                                          toast.error(
                                            "Only JPG, JPEG, PNG and PDF types are accepted"
                                          );
                                        }
                                      }}
                                      style={{ display: "none" }}
                                    />

                                    {!formImage.perviewbackimg ? (
                                      <label
                                        htmlFor="FILE_BACK_SIDE4"
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
                                              onRemoveImage(
                                                "passport_back_image"
                                              );
                                            }}
                                          >
                                            <CloseOutlinedIcon className="fontimgclose" />
                                          </button>
                                        )}
                                        {formImage?.btype ==
                                        "application/pdf" ? (
                                          <embed
                                            src={formImage.perviewbackimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        ) : (
                                          <img
                                            src={formImage.perviewbackimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        )}
                                      </>
                                    )}
                                    {infotrue.backimg2 == true &&
                                    !formImage.perviewbackimg ? (
                                      <span className="doc-Requied">
                                        Requied!
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Grid>
                              ) : (
                                ""
                              )}
                            </Grid>
                          )}

                          <div
                            className="text-dark font-size-xs d-flex justify-content-between align-items-center"
                            style={{ marginTop: "100px" }}
                          >
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
                              ) : (
                                <ColorButton
                                  onClick={onSubmit}
                                  variant="contained"
                                  disabled={sendKycRequest.proof1}
                                  size="medium"
                                  className="text-center text-capitalize"
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
                                className="text-center text-capitalize"
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
                          <div className="card-header card-header-alt">
                            <h5
                              className="font-weight-bold  text-dark "
                              style={{ margin: "0" }}
                            >
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
                                  className="form-check-input"
                                />{" "}
                                <label
                                  htmlFor="gridAdditionCheck"
                                  className="form-check-label"
                                >
                                  <span>Double side</span>
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
                                    name="fontimg"
                                    // value={doc.fontimg}
                                    value=""
                                    onChange={(e) => {
                                      if (
                                        e.target.files[0].type ==
                                          "image/jpeg" ||
                                        e.target.files[0].type ==
                                          "application/pdf" ||
                                        e.target.files[0].type == "image/png" ||
                                        e.target.files[0].type == "image/jpg"
                                      ) {
                                        setAddDoc((prevalue) => {
                                          return {
                                            ...prevalue,
                                            fontimg: e.target.files[0],
                                            ftype: e.target.files[0].type,
                                          };
                                        });
                                      } else {
                                        toast.error(
                                          "Only JPG, JPEG, PNG and PDF types are accepted"
                                        );
                                      }
                                    }}
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
                                            onRemoveImage(
                                              "additional_documents"
                                            );
                                            /* setAddDoc((prevalue) => {
                                            return {
                                              ...prevalue,
                                              fontimg: "",
                                            };
                                          });
                                          setAddFontimg(""); */
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>
                                      )}
                                      {adddoc?.ftype == "application/pdf" ? (
                                        <embed
                                          src={addfontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      ) : (
                                        <img
                                          src={addfontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      )}
                                    </>
                                  )}
                                  {infotrue.fontimg3 == true && !addfontimg ? (
                                    <span className="doc-Requied">
                                      Requied!
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </Grid>
                            {twoSide.addition ? (
                              <Grid item md={12}>
                                <h6
                                  className="mb-3 font-size-xs font-weight-bold"
                                  style={{
                                    textAlign: "center",
                                    marginTop: "10px",
                                  }}
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
                                      value=""
                                      // value={doc.fontimg}
                                      onChange={(e) => {
                                        if (
                                          e.target.files[0].type ==
                                            "image/jpeg" ||
                                          e.target.files[0].type ==
                                            "application/pdf" ||
                                          e.target.files[0].type ==
                                            "image/png" ||
                                          e.target.files[0].type == "image/jpg"
                                        ) {
                                          setAddDoc((prevalue) => {
                                            return {
                                              ...prevalue,
                                              backimg: e.target.files[0],
                                              btype: e.target.files[0].type,
                                            };
                                          });
                                        } else {
                                          toast.error(
                                            "Only JPG, JPEG, PNG and PDF types are accepted"
                                          );
                                        }
                                      }}
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
                                              /* setAddBackimg("");
                                          setAddDoc((prevalue) => {
                                            return {
                                              ...prevalue,
                                              backimg: "",
                                            };
                                          }); */
                                              onRemoveImage(
                                                "additional_documents_back"
                                              );
                                            }}
                                          >
                                            <CloseOutlinedIcon className="fontimgclose" />
                                          </button>
                                        )}
                                        {adddoc?.btype == "application/pdf" ? (
                                          <embed
                                            src={addbackimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        ) : (
                                          <img
                                            src={addbackimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        )}
                                      </>
                                    )}
                                    {infotrue.backimg3 == true &&
                                    !addbackimg ? (
                                      <span className="doc-Requied">
                                        Requied!
                                      </span>
                                    ) : (
                                      ""
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
                  <Grid item md={12}>
                    <Grid item md={12}>
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
