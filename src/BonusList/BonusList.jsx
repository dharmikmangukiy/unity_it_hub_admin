import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import CustomImageModal from "../common/CustomImageModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import NewDate from "../common/NewDate";

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

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    // borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #ced4da",
    fontSize: 16,
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

const BonusList = (prop) => {
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({});
  const [checkStatus, setcheckStatus] = useState("");
  const [resData, setResData] = useState({});

  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "email",
      value: false,
      name: "user_email",
    },
    // {
    //   label: "wallet code",
    //   value: false,
    //   name: "wallet_code",
    // },
    // {
    //   label: "payment method",
    //   value: false,
    //   name: "payment_method",
    // },
    {
      label: "mt5",
      value: false,
      name: "mt5_acc_no",
    },
    {
      label: "bonus amount",
      value: false,
      name: "bonus_amount",
    },
    {
      label: "percentage",
      value: false,
      name: "bonus_percentage",
    },
    {
      label: "deposit amount",
      value: false,
      name: "deposit_amount",
    },
    // {
    //   label: "deposit remarks",
    //   value: false,
    //   name: "deposit_remarks",
    // },
  ]);
  toast.configure();

  const columns = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.1,
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
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "claim Bonus",
      selector: (row) => {
        return (
          <span title={row.bonus_claim_datetime}>
            {row.bonus_claim_datetime == "" ? (
              ""
            ) : (
              <NewDate newDate={row.bonus_claim_datetime} />
            )}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.user_name}>{row.user_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "MT5",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "percentage",
      selector: (row) => {
        return (
          <span title={row.bonus_percentage}>{row.bonus_percentage}%</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "deposit amount",
      selector: (row) => {
        return <span title={row.deposit_amount}>{row.deposit_amount}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "bonus amount",
      selector: (row) => {
        return <span title={row.bonus_amount}>{row.bonus_amount}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "Lots Required",
      selector: (row) => {
        return (
          <span title={row.lots_to_be_traded}>{row.lots_to_be_traded}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "lots remaining",
      selector: (row) => {
        return <span title={row.lots_remaining}>{row.lots_remaining}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "lots completed",
      selector: (row) => {
        return <span title={row.lots_completed}>{row.lots_completed}</span>;
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
            className={
              row.status == "1"
                ? "status-text-approved"
                : row.status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.status == "1"
                ? "Approved"
                : row.status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.status == "1"
              ? "Approved"
              : row.status == "2"
              ? "Rejected"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Bonus Requests</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  setcheckStatus={setcheckStatus}
                  sales_manager_list={resData.sales_manager_list}
                  ib_users_list={resData.ib_users_list}
                  lastUpdatedBy={resData.modified_by_users}
                  userlist={resData.deposit_users_list}
                  //   lastUpdatedBy={resData.modified_by_users}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" onClick={handleClickOpen}>Add</Button>
                                    </div>
                                    <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/deposit_mt5_bonus_list.php`}
                          column={columns}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          checkStatus={checkStatus}
                          setResData={setResData}
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

export default BonusList;
