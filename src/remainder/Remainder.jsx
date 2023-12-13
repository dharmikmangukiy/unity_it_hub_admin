import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@emotion/react";
import {
  Button,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import axios from "axios";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {/* {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null} */}
    </DialogTitle>
  );
};

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

const Remainder = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [pageLoader, setPageLoader] = useState(true);
  const [confirmdate, setConfirmdate] = useState(new Date().getMonth());
  const [form, setForm] = useState({
    type: "",
    note: "",
  });
  toast.configure();
  const openDialogbox = (e) => {
    setForm({
      type: "",
      note: "",
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDateSelect = (selectInfo) => {
    /* let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: '',
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        } */
    setEventData(selectInfo);
    openDialogbox(selectInfo);
  };

  const handleEventClick = (clickInfo) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //     clickInfo.event.remove()
    // }
  };

  const handleEvents = (events) => {
    // this.setState({
    //   currentEvents: events
    // })
  };

  const addNewEvent = () => {};

  const insertNewEvent = () => {
    if (form.type == "") {
      toast.error("Please select type");
    } else if (form.note == "") {
      toast.error("Please enter notes");
    } else {
      let title = eventData.note;
      let calendarApi = eventData.view.calendar;

      calendarApi.unselect();

      if (title) {
        calendarApi.addEvent({
          id: "",
          title,
          start: eventData.startStr,
          end: eventData.endStr,
          allDay: eventData.allDay,
        });
      }
      toast.success("event has been added successfully.");
      setOpen(false);
    }
  };
  const eventData1 = async () => {
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ROLE_ID", 1);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
    }

    param.append("action", "day_wise_lead_count");
    setPageLoader(true);
    await axios
      .post(Url + "/ajaxfiles/change_lead_data.php", param)
      .then((res) => {
        if (res.data.message == "Session has been expired") {
          toast.error(res.data.message);
          localStorage.setItem("login", true);
          navigate("/");
          return;
        }
        if (res.data.status == "error") {
          toast.error(res.data.message);
          setPageLoader(false);
        } else {
          setData(res.data.data);
          setRefresh(!refresh);
          setPageLoader(false);
        }
      });
  };
  useEffect(() => {
    eventData1();
  }, []);
  const input = (event) => {
    const { name, value } = event.target;
    setForm((prevalue) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };
  const changeMonth = async (e) => {
    let date = new Date(e.startStr);
    // date.getDate() == 1 && date.getMonth() + 1 == confirmdate;
    if (
      (date.getDate() == 1 && date.getMonth() + 1 !== confirmdate) ||
      (date.getDate() !== 1 && date.getMonth() + 2 !== confirmdate)
    ) {
      const param = new FormData();

      if (IsApprove !== "") {
        param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
        param.append("is_app", IsApprove.is_app);
        param.append("AADMIN_LOGIN_ROLE_ID", 1);
        param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      }
      if (date.getDate() == 1) {
        param.append("month", date.getMonth() + 1);
        param.append("year", date.getFullYear());
      } else {
        param.append("month", date.getMonth() + 2);

        param.append("year", date.getFullYear());
      }
      param.append("action", "day_wise_lead_count");
      await axios
        .post(Url + "/ajaxfiles/change_lead_data.php", param)
        .then((res) => {
          if (res.data.message == "Session has been expired") {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
          if (res.data.status == "error") {
            toast.error(res.data.message);
            setPageLoader(false);
          } else {
            setData(res.data.data);
            setRefresh(!refresh);
            setPageLoader(false);
          }
        });
    } else {
      setConfirmdate(() => {
        if (date.getDate() == 1) {
          return date.getMonth() + 1;
        } else {
          return date.getMonth() + 2;
        }
      });
    }
  };
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          {pageLoader == true ? (
            <div className="loader">
              <div className="clock">
                <div className="pointers"></div>
              </div>
            </div>
          ) : (
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                    <Button variant="contained" onClick={handleClickOpen}>Add Deposit</Button>
                                </div>
                                <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <FullCalendar
                          // loading={refresh}
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin,
                          ]}
                          initialView="dayGridMonth"
                          headerToolbar={{
                            left: "prev,next today",

                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                          }}
                          droppable={false}
                          events={data}
                          //   events={[
                          //     { title: "event 1", date: "2022-04-03" },
                          //     { title: "event 2", date: "2022-07-12" },
                          //     {
                          //       title: "My Event",
                          //       date: "2022-03-29",
                          //       url: "http://google.com/",
                          //     },
                          //   ]}
                          eventColor="red"
                          datesSet={(e) => {
                            changeMonth(e);
                          }}
                          eventClick={(e) => {
                            // let str = formatDate(e.event.start, {
                            //     month: "numeric",
                            //     year: "numeric",
                            //     day: "numeric",
                            // });
                            // navigate(`/dashboard/${str}`)
                          }}
                          // editable={true}
                          // selectable={true}
                          // selectMirror={true}
                          dayMaxEvents={true}
                          // select={(e) => handleDateSelect(e)}
                          // eventContent={renderEventContent} // custom render function
                          // eventClick={() => handleEventClick}
                          // eventsSet={(e) => handleEvents(e)}
                          // eventAdd={(e) => addNewEvent(e)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
          )}
        </div>
      </div>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        // fullWidth="sm   "
        maxWidth="sm"
        open={open}
        className="modalWidth100"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          className="dialogTitle"
          onClose={handleClose}
        >
          Add Reminder
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div>
            <div>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Client / Lead
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  label="Client / Leads"
                  name="type"
                  onChange={input}
                >
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                </Select>
              </FormControl>
            </div>
            <br />
            <div>
              <TextField
                id="standard-textarea"
                label="Notes"
                name="note"
                multiline
                variant="standard"
                sx={{ width: "100%" }}
                onChange={input}
              />
            </div>
            <br />
            <div>
              <TextField
                type="date"
                id="standard-basic"
                label="Reminder"
                value={eventData ? eventData.startStr : ""}
                variant="standard"
                sx={{ width: "100%" }}
                focused
                disabled
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="dialogMultipleActionButton">
            <Button
              variant="contained"
              className="cancelButton"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant="contained" className="btn-gradient btn-success">
              Add
            </Button>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default Remainder;
