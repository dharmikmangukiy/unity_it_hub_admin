import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import InnerImageZoom from "react-inner-image-zoom";
import {
  Button,
  Grid,
  Input,
  InputBase,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import "./ticket.css";
import { IsApprove, Url } from "../global";
import { styled } from "@mui/material/styles";
import CustomImageModal from "../common/CustomImageModal";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    // borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #ced4da",
    fontSize: 20,
    padding: "8px 26px 8px 10px",
    // transition: theme.transitions.create(["border-color", "box-shadow"]),
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
      // borderRadius: 9,
      borderColor: "#80bdff",
    },
  },
}));

const ViewTicket = (prop) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [form, setForm] = useState({
    message: "",
    file: "",
    status: "Open",
    isLoader: false,
  });
  const [viewTicketData, setViewTicketData] = useState({
    data: {},
  });
  toast.configure();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    fetchViewTicketDetails();
  }, []);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setForm({ ...form, file: e.target.files[0] });
    setSelectedFile(e.target.files[0]);
  };

  const fetchViewTicketDetails = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("ticket_id", id);
    await axios.post(`${Url}/ajaxfiles/view_ticket.php`, param).then((res) => {
      if (res.data.message == "Session has been expired") {
        toast.error(res.data.message);
        localStorage.setItem("login", true);
        navigate("/");
        return;
      }
      if (res.data.status == "error") {
        toast.error(res.data.message);
      } else {
        if (res.data.data.length > 0) {
          viewTicketData.data = res.data.data[0];
          form.status = res.data.data[0].ticketstatus;
          setForm({ ...form });
          setViewTicketData({ ...viewTicketData });
        }
      }
    });
  };

  const sendMessage = async () => {
    if (form.message == "") {
      toast.error("Please enter message");
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
      param.append("ticketChatID", id);
      param.append("ticketTitle", viewTicketData.data.tickettitle);
      param.append("subject", viewTicketData.data.subject);
      param.append("ticketBody", form.message);
      param.append("ticketstatus", form.status);
      if (form.file != "") {
        param.append("attachment", form.file);
      }
      await axios
        .post(`${Url}/ajaxfiles/replay_ticket.php`, param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          form.isLoader = false;
          setForm({ ...form });
          if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            setSelectedFile(undefined);
            setForm({
              message: "",
              file: "",
              status: "Open",
              isLoader: false,
            });
            fetchViewTicketDetails();
          }
        });
    }
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh view-ticket-page">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item sm={12}></Grid>
              <Grid item xl={1}></Grid>
              <Grid item xl={10} md={12} lg={12}>
                {/* <TopButton /> */}
                <Grid container>
                  <Grid item md={12}>
                    <Paper
                      elevation={1}
                      style={{ borderRadius: "10px" }}
                      className="w-100 mb-5"
                    >
                      <div className="view-ticket card-header">
                        <div>
                          <div>
                            <label className="font-weight-bold mb-0 text-dark font-size-18">
                              Name -{" "}
                              {viewTicketData.data.user_name
                                ? viewTicketData.data.user_name
                                : ""}
                            </label>
                          </div>
                          <div>
                            <label className="font-weight-bold mb-0 text-dark font-size-18">
                              Email :{" "}
                              {viewTicketData.data.user_email
                                ? viewTicketData.data.user_email
                                : ""}
                            </label>
                          </div>
                          <div>
                            <label className="font-weight-bold mb-0 text-dark font-size-18">
                              View Ticket -{" "}
                              {viewTicketData.data.tickettitle
                                ? viewTicketData.data.tickettitle
                                : ""}
                            </label>
                          </div>
                          <div>
                            <label className="mb-0 text-dark">
                              Subject :{" "}
                              {viewTicketData.data.subject
                                ? viewTicketData.data.subject
                                : ""}
                            </label>
                          </div>
                        </div>
                        <div>
                          {viewTicketData?.data?.ticketstatus == "Open" ? (
                            <label className="ticket-status">Ticket Open</label>
                          ) : (
                            <label className="ticket-close">
                              Ticket Close{" "}
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="divider"></div>
                      <div className="card-body position-relative pt-0">
                        <Grid container spacing={3}>
                          <Grid
                            item
                            md={12}
                            className="d-flex position-relative mh-150 w-100"
                          >
                            <Paper
                              elevation={0}
                              style={{ borderRadius: "10px" }}
                              className="w-100"
                            >
                              <div className="content-area">
                                {viewTicketData.data.conversation
                                  ? viewTicketData.data.conversation.map(
                                      (item) => {
                                        if (item.position == "right") {
                                          return (
                                            <div className="chat right-side">
                                              <div className="chat-body">
                                                <div className="chat-text">
                                                  <p>
                                                    {item.attachment != "" ? (
                                                      <CustomImageModal
                                                        image={item.attachment}
                                                        className="ticket-upload-image"
                                                      />
                                                    ) : (
                                                      ""
                                                    )}
                                                    {item.ticketconversation}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="chat-avatar">
                                                <a className="avatar">
                                                  <img
                                                    src={item.avtar}
                                                    class="circle"
                                                    alt="avatar"
                                                  />
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div className="chat left-side">
                                              <div className="chat-avatar">
                                                <a className="avatar">
                                                  <img
                                                    src={item.avtar}
                                                    class="circle"
                                                    alt="avatar"
                                                  />
                                                </a>
                                              </div>
                                              <div className="chat-body">
                                                <div className="chat-text">
                                                  {item.attachment != "" ? (
                                                    <img
                                                      src={item.attachment}
                                                    />
                                                  ) : (
                                                    ""
                                                  )}
                                                  <p>
                                                    {item.ticketconversation}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      }
                                    )
                                  : ""}

                                {/* <div className="chat left-side">
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br /> hii</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="chat right-side">
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br />hiii</p>
                                    </div>
                                  </div>
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                </div>
                                <div className="chat left-side">
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br /> hii</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="chat right-side">
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br />hiii</p>
                                    </div>
                                  </div>
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                </div>
                                <div className="chat left-side">
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br /> hii</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="chat right-side">
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br />hiii</p>
                                    </div>
                                  </div>
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                </div>
                                <div className="chat left-side">
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br /> hii</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="chat right-side">
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br />hiii</p>
                                    </div>
                                  </div>
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                </div>
                                <div className="chat left-side">
                                  <div className="chat-avatar">
                                    <a className="avatar">
                                      <img src="http://0.gravatar.com/avatar/ca1028e62523b9861bd55d4f37a4b891?s=96&amp;d=mm&amp;r=g" class="circle" alt="avatar" />
                                    </a>
                                  </div>
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>test <br /> hii</p>
                                    </div>
                                  </div>
                                </div> */}
                              </div>
                            </Paper>
                          </Grid>
                        </Grid>
                      </div>
                      <hr />
                      <div className="action-section">
                        {prop.permission.replay_ticket == 1 ? (
                          <div className="input-section">
                            <input
                              name="title"
                              className="send-message-text-element"
                              value={form.message}
                              disabled={
                                viewTicketData?.data?.ticketstatus == "Open"
                                  ? false
                                  : true
                              }
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  message: e.target.value,
                                });
                              }}
                              placeholder="Send Message"
                              displayEmpty
                              inputProps={{
                                "aria-label": "Without label",
                              }}
                            />
                            {form.isLoader ? (
                              <Button
                                className="send-message-disabled-button"
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
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                className="send-message"
                                onClick={sendMessage}
                                disabled={
                                  viewTicketData?.data?.ticketstatus == "Open"
                                    ? false
                                    : true
                                }
                              >
                                <i className="material-icons">send</i>{" "}
                                &nbsp;Send
                              </Button>
                            )}
                            {form.isLoader ? (
                              <Button
                                className="send-message-disabled-button"
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
                              </Button>
                            ) : (
                              <label
                                htmlFor="contained-button-file"
                                className="ticket-file-upload"
                              >
                                <Input
                                  accept="image/*"
                                  id="contained-button-file"
                                  multiple
                                  type="file"
                                  disabled={
                                    viewTicketData?.data?.ticketstatus == "Open"
                                      ? false
                                      : true
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
                                {selectedFile ? (
                                  <img
                                    src={preview}
                                    className="deposit-upload-image-preview"
                                  />
                                ) : (
                                  <Button
                                    className="site-button-color"
                                    variant="contained"
                                    component="span"
                                    disabled={
                                      viewTicketData?.data?.ticketstatus ==
                                      "Open"
                                        ? false
                                        : true
                                    }
                                  >
                                    <i className="material-icons">backup</i>
                                    &nbsp;Upload
                                  </Button>
                                )}
                              </label>
                            )}
                            <Select
                              value={form.status}
                              displayEmpty
                              inputProps={{
                                "aria-label": "Without label",
                              }}
                              style={{ minWidth: "73px" }}
                              className="table-dropdown"
                              input={<BootstrapInput />}
                              name="interest"
                              disabled={
                                viewTicketData?.data?.ticketstatus == "Open"
                                  ? false
                                  : true
                              }
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  status: e.target.value,
                                })
                              }
                            >
                              <MenuItem value="Open">Open</MenuItem>
                              <MenuItem value="Close">Close</MenuItem>
                            </Select>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
