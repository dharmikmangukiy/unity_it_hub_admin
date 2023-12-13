import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import TextField from "@mui/material/TextField";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove, Url } from "../global";
import { BootstrapInput } from "./CustomElement";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const CssTextField = styled(TextField)({});

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  margin: 16px;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const customStyles = {
  rows: {
    style: {
      minHeight: "72px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

const CommonTable = (prop) => {
  // const [info, setinfo] = useState({});
  const navigate = useNavigate();
  const [clientData, setClientData] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientTotalRows, setClientTotalRows] = useState(0);
  const [clientPerPage, setClientPerPage] = useState(10);
  const [clientSort, setClientSort] = useState(prop.sort);
  const [clientDir, setClientDir] = useState("desc");
  const [clientSearch, setClientSearch] = useState("");
  const [openTableMenus, setOpenTableMenus] = useState([]);
  const [salesReport, setSalesReport] = useState({
    sales_filter_by: "only_incentive",
    show_group_by: 0,
  });
  const [anchorEl, setAnchorEl] = React.useState([]);
  var [link, setLink] = React.useState("");
  const open = Boolean(anchorEl);
  const cancelTokenSource = axios.CancelToken.source();
  toast.configure();

  const handleClientPageChange = (page) => {
    fetchClient(page == 1 ? 0 : page * clientPerPage - 10);
  };

  const handleClientPerRowsChange = async (newPerPage, page) => {
    setClientPerPage(newPerPage);
  };

  const handleClientSort = async (column, sortDirection) => {
    setClientSort(column.id - 1);
    setClientDir(sortDirection);
  };
  const input1 = (event) => {
    const { name, value } = event.target;
    setClientSearch(value);
  };
  const CustomLoader = () => (
    <div style={{ padding: "24px" }}>
      <Spinner />
      <div>
        <center>
          <b>Loading...</b>
        </center>
      </div>
    </div>
  );

  const fetchClient = async (page) => {
    setClientLoading(true);
    const param = new FormData();
    if (IsApprove !== "") {
      param.append("AADMIN_AUTH_KEY", IsApprove.AADMIN_AUTH_KEY);
      param.append("is_app", IsApprove.is_app);
      param.append("AADMIN_LOGIN_ID", IsApprove.AADMIN_LOGIN_ID);
      param.append("role_id", IsApprove.AADMIN_LOGIN_ROLE_ID);
    }
    param.append("draw", 0);
    param.append("start", page);
    param.append("length", clientPerPage);
    if (prop.level) {
      param.append("level_id", prop.level);
    }
    if (prop.checkStatus) {
      param.append("status", prop.checkStatus);
    }
    if (prop.salesAgent) {
      param.append("manager_id", prop.salesAgent);
    }
    if (prop.filter) {
      if (prop.filter.deposit_from) {
        param.append("start_date", prop.filter.deposit_from);
      }
      if (prop.filter.deposit_to) {
        param.append("end_date", prop.filter.deposit_to);
      }
      if (prop.filter.deposit_status) {
        param.append("deposit_status", prop.filter.deposit_status);
      }
      if (prop.filter.withdraw_from) {
        param.append("start_date", prop.filter.withdraw_from);
      }
      if (prop.filter.withdraw_to) {
        param.append("end_date", prop.filter.withdraw_to);
      }
      if (prop.filter.withdraw_status) {
        param.append("withdrawal_status", prop.filter.withdraw_status);
      }
    }
    if (prop.userId) {
      param.append("user_id", prop.userId);
    }
    if (prop.searchWord != "" && prop.searchWord != undefined) {
      if (prop.search.filter((x) => x.value == true).length == 0) {
        param.append("search[value]", prop.searchWord);
      } else {
        var columns = prop.search
          .filter((x) => x.value == true)
          .map((x) => {
            return x.name;
          })
          .join(",");
        param.append("columns", columns);
        param.append("columnSearch", prop.searchWord);
        /* prop.search.forEach(element => {
                    if (element.value == true) {
                        param.append(element.name, prop.searchWord);
                    }
                }); */
      }
    }
    if (prop.salesReport) {
      param.append("sales_filter_by", salesReport.sales_filter_by);
      param.append("show_group_by", salesReport.show_group_by);
    }

    if (prop.param) {
      // param.append('kyc_status', prop.param.kyc_status);
      for (const key in prop.param) {
        param.append(key, prop.param[`${key}`]);
      }
    }
    param.append("order[0][column]", clientSort);
    param.append("order[0][dir]", clientDir);
    if (clientSearch.trim() != "") {
      param.append("search[value]", clientSearch.trim());
    }
    // cancelTokenSource = axios.CancelToken.source();
    await axios
      .post(`${prop.url}`, param, {
        cancelToken: cancelTokenSource.token,
      })
      .then((res) => {
        if (res.data["status"]) {
          if (
            res.data["status"] == "error" &&
            res.data["message"] == "Session has been expired"
          ) {
            toast.error(res.data.message);
            localStorage.setItem("login", true);
            navigate("/");
            return;
          }
        }

        if (res.data["status"] == "error") {
          // toast.error(res.data.message);
          setClientLoading(false);
        } else {
          setClientData(res.data.aaData);
          setClientTotalRows(res.data.iTotalRecords);
          setClientLoading(false);
          if (prop.setResData) {
            prop.setResData(res.data);
          }
        }
      });
  };
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const handleRowSelected = React.useCallback((state) => {
    // console.log(state.selectedRows);
    if (prop.setColumnTrue) {
      prop.setColumnTrue(state.selectedRows);
    }
  }, []);
  useEffect(() => {
    fetchClient(0);
    var Link = Url + "/" + prop.csv + `?sort=${clientDir}&column=${clientSort}`;
    if (prop.param) {
      for (const key in prop.param) {
        Link += `&${key}=${prop.param[key]}`;
      }
    }
    if (clientSearch.trim() != "") {
      Link += `&search=${clientSearch.trim()}`;
    }
    if (prop.searchWord != "" && prop.searchWord != undefined) {
      if (prop.search.filter((x) => x.value == true).length == 0) {
        Link += `&search=${prop.searchWord}`;
      } else {
        var columns = prop.search
          .filter((x) => x.value == true)
          .map((x) => {
            return x.name;
          })
          .join(",");
        Link += `&columns=${columns}`;
        Link += `&columnSearch=${prop.searchWord}`;
      }
    }
    if (prop.userId) {
      Link += `&user_id=${prop.userId}`;
    }
    if (prop.level) {
      Link += `&level_id=${prop.level}`;
    }
    if (prop.checkStatus) {
      Link += `&status=${prop.checkStatus}`;
    }
    if (prop.salesAgent) {
      Link += `&manager_id=${prop.salesAgent}`;
    }
    if (prop.filter) {
      if (prop.filter.deposit_from) {
        Link += `&start_date=${prop.filter.deposit_from}`;
      }
      if (prop.filter.deposit_to) {
        Link += `&end_date=${prop.filter.deposit_to}`;
      }
      if (prop.filter.deposit_status) {
        Link += `&deposit_status=${prop.filter.deposit_status}`;
      }
      if (prop.filter.withdraw_from) {
        Link += `&start_date=${prop.filter.withdraw_from}`;
      }
      if (prop.filter.withdraw_to) {
        Link += `&end_date=${prop.filter.withdraw_to}`;
      }
      if (prop.filter.withdraw_status) {
        Link += `&withdrawal_status=${prop.filter.withdraw_status}`;
      }
    }
    setLink(Link);
  }, [
    clientPerPage,
    clientSort,
    clientDir,
    clientSearch,
    prop.level,
    prop.filter,
    salesReport,
    prop.refresh,
    prop.searchWord,
    prop.search,
    prop.param,
    prop.salesAgent,
    prop.checkStatus,
  ]);
  return (
    <div className={`${prop.className ? prop.className : ""}`}>
      <div className={`tableSearchField ${prop.csv ? "space-between" : ""}`}>
        {prop.csv ? (
          <a href={link} className="btn-export-style" target="_blank">
            CSV
          </a>
        ) : (
          ""
        )}
        {prop.salesReport ? (
          <div className="salsenameSelect" style={{ marginBottom: "5px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    salesReport.show_group_by = e.target.checked ? 1 : 0;
                    setSalesReport({ ...salesReport });
                  }}
                />
              }
              label="Group By"
            />
            <FormControl>
              <label class="salesfilterby">Filter By :</label>
              <Select
                label="Category"
                name="sales_filter_by"
                value={salesReport.sales_filter_by}
                // value={filterBy}
                onChange={(e) => {
                  salesReport.sales_filter_by = e.target.value;
                  setSalesReport({ ...salesReport });
                }}
                input={<BootstrapInput />}
                sx={{ width: "200px" }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="only_withdraw">Withdraw</MenuItem>
                <MenuItem value="only_incentive">Incentive</MenuItem>
                <MenuItem value="withdraw_incentive_both">
                  Withdraw and Incentive
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : (
          ""
        )}

        {prop.salesReport ? (
          ""
        ) : (
          <CssTextField
            id="standard-search"
            label="Search"
            sx={{ width: "200px", marginBottom: "5px" }}
            variant="standard"
            name="myclient_search"
            // value={info.myclient_search}
            onChange={input1}
          />
        )}
      </div>
      <DataTable
        columns={prop.column}
        data={clientData}
        progressPending={clientLoading}
        onSort={handleClientSort}
        footer={prop.footer}
        sortServer
        pagination={prop.paginationOff == true ? false : true}
        paginationServer
        paginationTotalRows={clientTotalRows}
        paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 300, 500, 0]}
        paginationComponentOptions={paginationComponentOptions}
        onChangeRowsPerPage={handleClientPerRowsChange}
        onChangePage={handleClientPageChange}
        highlightOnHover
        onSelectedRowsChange={handleRowSelected}
        persistTableHead
        pointerOnHover
        selectableRows={prop.selectableRows}
        progressComponent={<CustomLoader />}
      />
    </div>
  );
};

export default CommonTable;
