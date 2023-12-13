import "./ticket.css";
import React, { useState } from "react";
import {
  Button,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { Url } from "../global";
import { useNavigate } from "react-router-dom";
import NewDate from "../common/NewDate";

const Ticket = (prop) => {
  const navigate = useNavigate();
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "Ticket Title",
      value: false,
      name: "ticket_title",
    },
    {
      label: "Subject",
      value: false,
      name: "subject",
    },
    {
      label: "Message",
      value: false,
      name: "message",
    },
    {
      label: "Date",
      value: false,
      name: "date",
    },
  ]);

  const column = [
    {
      name: "Name",
      selector: (row) => (
        <>
          {prop.permission.open_client_panel == 1 ? (
            <a
              className="linkColor"
              title={row.user_name}
              href={"/profile/" + row.user_id}
              // onClick={(event) => gotoProfile(row)}
              target="_blank"
            >
              {row.user_name}
            </a>
          ) : (
            <span title={row.user_name}>{row.user_name}</span>
          )}
        </>
      ),
      sortable: true,
      reorder: true,
      grow: 0.4,
      //  wrap: true,
    },
    {
      name: "email",
      selector: (row) => <span title={row.email}>{row.email}</span>,
      sortable: true,
      reorder: true,
      grow: 0.7,
      //  wrap: true,
    },
    {
      name: "phone",
      selector: (row) => <span title={row.user_phone}>{row.user_phone}</span>,
      sortable: true,
      reorder: true,
      grow: 0.5,
      //  wrap: true,
    },
    {
      name: "Ticket ID",
      selector: (row) => (
        <span title={row.ticketChatID}>{row.ticketChatID}</span>
      ),
      sortable: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "Ticket Title",
      selector: (row) => <span title={row.ticketTitle}>{row.ticketTitle}</span>,
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "Subject",
      selector: (row) => <span title={row.subject}>{row.subject}</span>,
      sortable: true,
      reorder: true,
      grow: 1,
      //   wrap: true,
    },
    {
      name: "Message",
      selector: (row) => <span title={row.ticketBody}>{row.ticketBody}</span>,
      sortable: true,
      reorder: true,
      grow: 1,
      //  wrap: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      reorder: true,
      grow: 0.3,
      //  wrap: true,
    },
    {
      name: "Date",
      selector: (row) => <NewDate newDate={row.ticketDateTime} />,
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => {
        return (
          <div>
            {prop.permission.view_ticket == 1 ? (
              <Button
                onClick={(e) => {
                  chatSection(row);
                }}
              >
                View
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const chatSection = (data) => {
    navigate(`/view_ticket/${data.ticketChatID}`);
  };

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Ticket</p>
                <CommonFilter search={searchBy} searchWord={setSearchKeyword} setParam={setParam}/>
                <br />
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
                        <CommonTable
                          url={`${Url}/datatable/ticket_list.php`}
                          column={column}
                          sort="0"
                          param={param}
                          search={searchBy}
                          searchWord={searchKeyword}
                        />
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

export default Ticket;
