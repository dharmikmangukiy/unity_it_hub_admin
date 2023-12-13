import {
  FormControl,
  Grid,
  Input,
  Paper,
  FormHelperText,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./AdditionalDocuments.css";

import Toast from "../common/Toast";
import { IsApprove, Url } from "../global";
import {
  BootstrapInput,
  ColorButton,
  ColorButton1,
  ColorButton2,
} from "../common/CustomElement";
import CustomImageModal from "../common/CustomImageModal";
var id = 0;
export const AdditionalDocuments = (prop) => {
  const navigate = useNavigate();
  const [mainLoader, setMainLoader] = useState(true);
  const [open1, setOpen1] = React.useState(false);
  const [listData, setListData] = useState([]);
  const [deleteData, setDeleteData] = useState({
    isLoader: "",
    id: "",
  });
  const [info, setInfo] = useState({
    fontimg: "",
    ftype: "",
    perviewfontimg: "",
    backimg: "",
    btype: "",
    perviewbackimg: "",
    twoSide: false,
    doc_name: "",
    isLoader: false,
    id: "",
    addAndEdit: "",
  });
  const [infoTrue, setInfoTrue] = useState({
    fontimg: false,

    backimg: false,
    doc_name: false,
  });
  const fatchDocuments = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    setMainLoader(true);
    param.append("end_date", "");
    param.append("start_date", "");
    param.append("start", 0);
    param.append("user_id", prop.id);

    param.append("length", 20);

    axios
      .post(Url + "/datatable/user_additional_documents_list.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          navigate("/");
        }
        if (res.data.status == "error") {
          Toast("error", res.data.message);
        } else {
          setListData(res.data.aaData);
          setMainLoader(false);
        }
      });
  };

  const deleteAddDoc = () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    deleteData.isLoader = true;
    setDeleteData({ ...deleteData });
    param.append("document_id", deleteData.id);
    param.append("action", "delete_documents");
    param.append("user_id", prop.id);
    axios
      .post(Url + "/ajaxfiles/update_user_profile.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          navigate("/");
        }
        if (res.data.status == "error") {
          Toast("error", res.data.message);
          deleteData.isLoader = false;
          setDeleteData({ ...deleteData });
        } else {
          deleteData.isLoader = false;
          setDeleteData({ ...deleteData });
          setOpen1(false);
          Toast("success", res.data.message);
          fatchDocuments();
        }
      });
  };
  const onsubmit = () => {
    if (info.doc_name == "") {
      Toast("error", "Document Name is required");
    } else if (info.fontimg == "") {
      Toast("error", "Font Image is required");
    } else if (info.backimg == "" && info.twoSide == true) {
      Toast("error", "Back Image is required");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      param.append("document_name", info.doc_name);
      param.append("document_double_sided", info.twoSide == true ? 1 : 0);
      param.append("document_front_image", info.fontimg);
      param.append("document_back_image", info.backimg);
      param.append("action", "add_documents");
      param.append("user_id", prop.id);

      info.isLoader = true;
      setInfo({ ...info });

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
          }
          if (res.data.status == "error") {
            Toast("error", res.data.message);
            info.isLoader = false;
            setInfo({ ...info });
          } else {
            setInfo({
              fontimg: "",
              ftype: "",
              perviewfontimg: "",
              backimg: "",
              btype: "",
              perviewbackimg: "",
              twoSide: false,
              doc_name: "",
              id: "",
              addAndEdit: "",
              isLoader: false,
            });
            setInfoTrue({
              fontimg: false,

              backimg: false,
              doc_name: false,
            });
            Toast("success", res.data.message);

            fatchDocuments();
          }
        });
    }
  };
  const onEdit = () => {
    if (info.doc_name == "") {
      Toast("error", "Document Name is required");
    } else if (info.fontimg == "" && info.perviewfontimg == "") {
      Toast("error", "Font Image is required");
    } else if (
      info.backimg == "" &&
      info.twoSide == true &&
      info.perviewbackimg == ""
    ) {
      Toast("error", "Back Image is required");
    } else {
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
        param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
      }
      if (info.fontimg) {
        param.append("document_front_image", info.fontimg);
      }
      if (info.backimg) {
        param.append("document_back_image", info.backimg);
      }
      param.append("document_name", info.doc_name);
      param.append("document_double_sided", info.twoSide == true ? 1 : 0);
      param.append("document_id", info.id);
      param.append("user_id", prop.id);
      param.append("action", "update_documents");

      info.isLoader = true;
      setInfo({ ...info });

      axios
        .post(Url + "/ajaxfiles/update_user_profile.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            navigate("/");
          }
          if (res.data.status == "error") {
            Toast("error", res.data.message);
            info.isLoader = false;
            setInfo({ ...info });
          } else {
            setInfo({
              fontimg: "",
              ftype: "",
              perviewfontimg: "",
              backimg: "",
              btype: "",
              perviewbackimg: "",
              twoSide: false,
              doc_name: "",
              id: "",
              addAndEdit: "",
              isLoader: false,
            });
            setInfoTrue({
              fontimg: false,

              backimg: false,
              doc_name: false,
            });
            Toast("success", res.data.message);

            fatchDocuments();
          }
        });
    }
  };
  useEffect(() => {
    fatchDocuments();
  }, []);
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          {mainLoader == true ? (
            <div className="loader1">
              <span className="loader2"></span>
            </div>
          ) : (
            <div style={{ opacity: 1 }}>
              <Grid container>
                <Grid item sm={11}></Grid>
                <Grid item xl={1}></Grid>
                <Grid item xl={10} md={12} lg={12}>
                  <Grid container spacing={3}>
                    <Grid item md={12}>
                      <Paper
                        elevation={1}
                        style={{ borderRadius: "10px" }}
                        className="w-100 mb-5"
                      >
                        <div className="addDoc-listView-sw">
                          <div className="card-header font-weight-bold mb-0 text-dark h5">
                            My Document
                          </div>
                          <div>
                            <a href={`/profile/${prop.id}#add-doc-move${id}`}>
                              <ColorButton
                                sx={{
                                  padding: "5px 15px",
                                  marginRight: "10px",
                                }}
                                onClick={() => {
                                  id = id + 1;
                                  setInfo({
                                    fontimg: "",
                                    ftype: "",
                                    perviewfontimg: "",
                                    backimg: "",
                                    btype: "",
                                    perviewbackimg: "",
                                    twoSide: false,
                                    doc_name: "",
                                    isLoader: false,
                                    id: "",
                                    addAndEdit: "Add",
                                  });
                                  setInfoTrue({
                                    fontimg: false,
                                    backimg: false,
                                    doc_name: false,
                                  });
                                }}
                              >
                                Add
                              </ColorButton>
                            </a>
                          </div>
                        </div>
                        <div className="divider"></div>
                        <div className="addDoc-listView">
                          {listData.length == 0 ? (
                            <div
                              className="text-center"
                              style={{ margin: "30px 0px" }}
                            >
                              There are no records to display
                            </div>
                          ) : (
                            <>
                              {listData.map((item, index) => {
                                var type1 =
                                  item.document_front_image.split(".").pop() ==
                                  "pdf"
                                    ? "application/pdf"
                                    : "image";
                                var type2 =
                                  item.document_front_image.split(".").pop() ==
                                  "pdf"
                                    ? "application/pdf"
                                    : "image";
                                return (
                                  <>
                                    <div
                                      className="addDoc-listView-block"
                                      key={index}
                                    >
                                      <div className="addDoc-listView-sw">
                                        <div className="text-info font-weight-bold">
                                          Document Name:-{item.document_name}
                                        </div>
                                        <div>
                                          {item.status == "1" ? (
                                            ""
                                          ) : (
                                            <>
                                              <a
                                                href={`/profile/${prop.id}#add-doc-move${id}`}
                                              >
                                                <Button
                                                  onClick={() => {
                                                    id = id + 1;
                                                    setInfo({
                                                      fontimg: "",
                                                      ftype: type1,
                                                      perviewfontimg:
                                                        item.document_front_image,
                                                      backimg: "",
                                                      btype: type2,
                                                      perviewbackimg:
                                                        item.document_back_image,
                                                      twoSide:
                                                        item.document_double_sided ==
                                                        0
                                                          ? false
                                                          : true,
                                                      doc_name:
                                                        item.document_name,
                                                      isLoader: false,
                                                      id: item.document_id,
                                                      addAndEdit: "Edit",
                                                    });
                                                    setInfoTrue({
                                                      fontimg: false,

                                                      backimg: false,
                                                      doc_name: false,
                                                    });
                                                  }}
                                                >
                                                  <EditIcon
                                                    sx={{ color: "green" }}
                                                  />
                                                </Button>{" "}
                                              </a>
                                            </>
                                          )}
                                          {item.status == "1" ? (
                                            ""
                                          ) : (
                                            <Button
                                              onClick={() => {
                                                setDeleteData({
                                                  isLoader: false,
                                                  id: item.document_id,
                                                });
                                                setOpen1(true);
                                              }}
                                            >
                                              <DeleteIcon
                                                sx={{ color: "red" }}
                                              />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <span
                                          className={`approvedocument ${
                                            item.status == 1
                                              ? "approve"
                                              : item.status == 2
                                              ? "rejected"
                                              : item.status == 0
                                              ? "padding"
                                              : ""
                                          }`}
                                        >
                                          {" "}
                                          {item.status == 1
                                            ? " Approved"
                                            : item.status == 2
                                            ? "Approval Rejected"
                                            : item.status == 0
                                            ? "Approval Pending"
                                            : ""}
                                        </span>
                                      </div>
                                      <div className="addDoc-listView-block-sub">
                                        <Grid container spacing={3}>
                                          <Grid
                                            className="addDoc-listView-Center"
                                            item
                                            md={
                                              item.document_back_image == ""
                                                ? 12
                                                : 6
                                            }
                                          >
                                            <div>
                                              <div className="text-center">
                                                <h6 className="font-size-xs font-weight-bold">
                                                  FRONT SIDE
                                                </h6>
                                              </div>
                                              <div className="addDoc-listView-block-sub-imgF">
                                                {type1 == "image" ? (
                                                  <>
                                                    <div className="position-Eye-addDoc">
                                                      <CustomImageModal
                                                        image={
                                                          item.document_front_image
                                                        }
                                                        isIcon={true}
                                                        className="scriptimgwidth"
                                                      />
                                                    </div>
                                                    <img
                                                      src={
                                                        item.document_front_image
                                                      }
                                                      alt=""
                                                      width="200px"
                                                    />
                                                  </>
                                                ) : (
                                                  <>
                                                    <div className="position-Eye-addDoc">
                                                      <Button
                                                        onClick={() => {
                                                          const myWindow =
                                                            window.open(
                                                              item.document_front_image,
                                                              "",
                                                              "width=320,height=320"
                                                            );
                                                        }}
                                                      >
                                                        <VisibilityIcon />
                                                      </Button>
                                                    </div>
                                                    <embed
                                                      src={
                                                        item.document_front_image
                                                      }
                                                    />
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </Grid>
                                          {item.document_back_image == "" ? (
                                            ""
                                          ) : (
                                            <Grid
                                              item
                                              md={6}
                                              className="addDoc-listView-Center"
                                            >
                                              <div>
                                                <div className="text-center">
                                                  <h6 className="font-size-xs font-weight-bold">
                                                    BACK SIDE
                                                  </h6>
                                                </div>
                                                <div className="addDoc-listView-block-sub-imgF">
                                                  {type2 == "image" ? (
                                                    <>
                                                      <div className="position-Eye-addDoc">
                                                        <CustomImageModal
                                                          image={
                                                            item.document_back_image
                                                          }
                                                          isIcon={true}
                                                          className="scriptimgwidth"
                                                        />
                                                      </div>
                                                      <img
                                                        src={
                                                          item.document_back_image
                                                        }
                                                        alt=""
                                                        width="200px"
                                                      />
                                                    </>
                                                  ) : (
                                                    <>
                                                      <div className="position-Eye-addDoc">
                                                        <Button
                                                          onClick={() => {
                                                            const myWindow =
                                                              window.open(
                                                                item.document_back_image,
                                                                "",
                                                                "width=320,height=320"
                                                              );
                                                          }}
                                                        >
                                                          <VisibilityIcon />
                                                        </Button>
                                                      </div>
                                                      <embed
                                                        src={
                                                          item.document_back_image
                                                        }
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </Grid>
                                          )}
                                        </Grid>
                                      </div>
                                    </div>
                                    <div className="divider"></div>
                                    {index == listData.length - 1 ? (
                                      <div
                                        id={`add-doc-move${id}`}
                                        style={{ marginBottom: "10px" }}
                                      ></div>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </Paper>
                      {info.addAndEdit == "" ? (
                        ""
                      ) : (
                        <Paper
                          id="add-doc-move"
                          elevation={1}
                          style={{ borderRadius: "10px" }}
                          className="w-100 mb-5"
                        >
                          <div className="card-header font-weight-bold mb-0 text-dark h5">
                            {info.addAndEdit == "Add"
                              ? "Add New Documents"
                              : "Edit Documents"}
                          </div>
                          <div className="divider"></div>
                          <div className="addDoc-main">
                            <div className="addDoc-textbox">
                              <div>
                                <label className="text-info font-weight-bold form-label-head w-100 required">
                                  Document Name
                                </label>
                                <FormControl
                                  className="w-100"
                                  error={
                                    info.doc_name == "" &&
                                    infoTrue.doc_name == true
                                      ? true
                                      : false
                                  }
                                >
                                  <BootstrapInput
                                    //   value={info.amount}
                                    name="doc_name"
                                    type="text"
                                    className="w-100"
                                    //   onBlur={trueFalse}
                                    value={info.doc_name}
                                    onChange={(e) => {
                                      info.doc_name = e.target.value;
                                      setInfo({ ...info });
                                    }}
                                    onBlur={() => {
                                      infoTrue.doc_name = true;
                                      setInfoTrue({ ...infoTrue });
                                    }}
                                    displayEmpty
                                    inputProps={{
                                      "aria-label": "Without label",
                                    }}
                                  />
                                  {info.doc_name == "" && infoTrue.doc_name ? (
                                    <FormHelperText>
                                      Document Name is required
                                    </FormHelperText>
                                  ) : (
                                    ""
                                  )}
                                </FormControl>
                              </div>
                              <div className="addDoc-checkBox">
                                <input
                                  type="checkbox"
                                  name="tos"
                                  value={info.twoSide}
                                  // value={!twoSide.main}
                                  checked={info.twoSide}
                                  // disabled={
                                  //   kycStatus.status == 1 ? true : false
                                  // }
                                  onChange={(e) => {
                                    info.twoSide = e.target.checked;
                                    setInfo({ ...info });
                                  }}
                                  id="gridCheck"
                                  className="form-check-input"
                                />
                                <label
                                  htmlFor="gridCheck"
                                  className="form-check-label"
                                >
                                  <span> Double side</span>
                                </label>
                              </div>
                            </div>
                            <Grid
                              container
                              spacing={7}
                              className="justify-content-center"
                              style={{
                                marginLeft: "-28px",
                                marginTop: "-7px",
                              }}
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
                                      var objectUrl1 = URL.createObjectURL(
                                        e.target.files[0]
                                      );
                                      if (
                                        e.target.files[0].type ==
                                          "image/jpeg" ||
                                        e.target.files[0].type ==
                                          "application/pdf" ||
                                        e.target.files[0].type == "image/png" ||
                                        e.target.files[0].type == "image/jpg"
                                      ) {
                                        setInfo((prevalue) => {
                                          return {
                                            ...prevalue,
                                            fontimg: e.target.files[0],
                                            ftype: e.target.files[0].type,
                                            perviewfontimg: objectUrl1,
                                          };
                                        });
                                      } else {
                                        Toast(
                                          "error",
                                          "Only JPG, JPEG, PNG and PDF types are accepted."
                                        );
                                      }
                                    }}
                                    style={{ display: "none" }}
                                  />

                                  {!info.perviewfontimg ? (
                                    <label
                                      htmlFor="FILE_FRONT_SIDE4"
                                      className="text-dark font-weight-bold font-size-xs"
                                    >
                                      UPLOAD
                                    </label>
                                  ) : (
                                    <>
                                      <button
                                        className="bg-transparent p-0 border-0"
                                        onClick={() => {
                                          info.perviewfontimg = "";
                                          info.fontimg = "";
                                          setInfo({ ...info });
                                        }}
                                      >
                                        <CloseOutlinedIcon className="fontimgclose" />
                                      </button>

                                      {info?.ftype == "application/pdf" ? (
                                        <embed
                                          src={info.perviewfontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      ) : (
                                        <img
                                          src={info.perviewfontimg}
                                          className="deposit-upload-image-preview1"
                                        />
                                      )}
                                    </>
                                  )}
                                  {/* {infotrue.fontimg2 == true &&
                                    !formImage.perviewfontimg ? (
                                      <span className="doc-Requied">
                                        Requied!
                                      </span>
                                    ) : (
                                      ""
                                    )} */}
                                </div>
                              </Grid>
                              {info.twoSide ? (
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
                                        var objectUrl1 = URL.createObjectURL(
                                          e.target.files[0]
                                        );
                                        if (
                                          e.target.files[0].type ==
                                            "image/jpeg" ||
                                          e.target.files[0].type ==
                                            "application/pdf" ||
                                          e.target.files[0].type ==
                                            "image/png" ||
                                          e.target.files[0].type == "image/jpg"
                                        ) {
                                          setInfo((prevalue) => {
                                            return {
                                              ...prevalue,
                                              backimg: e.target.files[0],
                                              btype: e.target.files[0].type,
                                              perviewbackimg: objectUrl1,
                                            };
                                          });
                                        } else {
                                          Toast(
                                            "error",
                                            "Only JPG, JPEG, PNG and PDF types are accepted."
                                          );
                                        }
                                      }}
                                      style={{ display: "none" }}
                                    />

                                    {!info.perviewbackimg ? (
                                      <label
                                        htmlFor="FILE_BACK_SIDE4"
                                        className="text-dark font-weight-bold font-size-xs"
                                      >
                                        UPLOAD
                                      </label>
                                    ) : (
                                      <>
                                        <button
                                          className="bg-transparent p-0 border-0"
                                          onClick={() => {
                                            info.backimg = "";
                                            info.perviewbackimg = "";
                                            setInfo({ ...info });
                                          }}
                                        >
                                          <CloseOutlinedIcon className="fontimgclose" />
                                        </button>

                                        {info?.btype == "application/pdf" ? (
                                          <embed
                                            src={info.perviewbackimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        ) : (
                                          <img
                                            src={info.perviewbackimg}
                                            className="deposit-upload-image-preview1"
                                          />
                                        )}
                                      </>
                                    )}
                                    {/* {infotrue.backimg2 == true &&
                                      !formImage.perviewbackimg ? (
                                        <span className="doc-Requied">
                                          Requied!
                                        </span>
                                      ) : (
                                        ""
                                      )} */}
                                  </div>
                                </Grid>
                              ) : (
                                ""
                              )}
                            </Grid>
                            <div className="text-dark font-size-xs d-flex justify-content-between align-items-center">
                              <i>
                                (Maximum size of document 5MB, Allow File
                                Formats *jpg, *png, *pdf)
                              </i>
                              {info.isLoader == true ? (
                                <>
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
                                </>
                              ) : (
                                <ColorButton
                                  onClick={() => {
                                    if (info.addAndEdit == "Add") {
                                      onsubmit();
                                    } else {
                                      onEdit();
                                    }
                                  }}
                                >
                                  save
                                </ColorButton>
                              )}
                            </div>
                          </div>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={open1}
        onClose={() => {
          setOpen1(false);
        }}
      >
        <DialogTitle sx={{ borderBottom: "0px solid #e6e7f1 !important" }}>
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to Delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ColorButton1
            onClick={() => {
              setOpen1(false);
            }}
          >
            No
          </ColorButton1>
          {deleteData.isLoader == true ? (
            <ColorButton2 disabled>
              <svg
                class="spinner"
                style={{ position: "unset" }}
                viewBox="0 0 50 50"
              >
                <circle
                  class="path"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke-width="5"
                ></circle>
              </svg>
            </ColorButton2>
          ) : (
            <ColorButton2 onClick={deleteAddDoc}>Delete</ColorButton2>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
