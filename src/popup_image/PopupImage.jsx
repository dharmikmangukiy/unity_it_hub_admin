import "./popup_image.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  FormControl,
  Grid,
  Input,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";

import axios from "axios";
import { useNavigate } from "react-router-dom";
const PopupImage = (prop) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };
  toast.configure();
  const fatchimage = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }
    param.append("action", "popup_image");
    await axios.post(`${Url}/ajaxfiles/common_api.php`, param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        setPreview(res.data.popup_image);
      }
    });
  };

  useEffect(() => {
    fatchimage();
  }, []);

  const onSubmit = async () => {
    if (!selectedFile) {
      toast.error("image is requied");
    } else {
      setLoader(true);
      const param = new FormData();
      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      param.append("popup_image", selectedFile);
      await axios
        .post(`${Url}/ajaxfiles/update_image.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            setLoader(false);
          } else {
            toast.success(res.data.message);
            setSelectedFile("");
            fatchimage();
            setLoader(false);
          }
        });
    }
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Popup Image</p>

                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <div className="actionGroupButton">
                    {/* <Button variant="contained" className='add-faq' onClick={handleClickOpen}>Add</Button> */}
                  </div>
                  <br />
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <div className="image-center-section">
                          <label
                            htmlFor="contained-button-file"
                            className="fileuploadButton"
                          >
                            <Input
                              accept="image/*"
                              id="contained-button-file"
                              multiple
                              type="file"
                              disabled={
                                prop.permission.update_image == 1 ? false : true
                              }
                              onChange={(e) => {
                                if (
                                  e.target.files[0].type == "image/jpeg" ||
                                  e.target.files[0].type == "image/png" ||
                                  e.target.files[0].type == "image/jpg"
                                ) {
                                  onSelectFile(e);
                                } else {
                                  toast.error(
                                    "Only JPG, JPEG, and PNG types are accepted"
                                  );
                                }
                              }}
                            />
                            {preview ? (
                              <img
                                src={preview}
                                style={{ maxWidth: "320px" }}
                              />
                            ) : (
                              <Button variant="contained" component="span">
                                <i className="material-icons">backup</i>
                                &nbsp;Upload
                              </Button>
                            )}
                          </label>
                        </div>
                        <br />
                        {prop.permission.update_image == 1 ? (
                          <div className="popsavebuttton">
                            {loader == true ? (
                              <Button disabled className="popdisableimage">
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
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                className="btn-success"
                                onClick={onSubmit}
                              >
                                Save
                              </Button>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupImage;
